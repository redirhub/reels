"""DSP building blocks shared by the instruments, beats and sound effects."""
import pathlib
import shutil
import wave
import zlib

import numpy as np
import scipy.signal as ss

SR = 48_000
_rng = np.random.default_rng(0)


def seed(name):
    """Reseed the noise source from a name, so each beat or effect is reproducible
    on its own: adding or changing one never alters the others."""
    global _rng
    _rng = np.random.default_rng(zlib.crc32(name.encode()))


def rand():
    return _rng.random()


def choice(options):
    return options[int(_rng.integers(len(options)))]


def noise(n):
    return _rng.uniform(-1, 1, n)


def tt(d):
    return np.arange(int(d * SR)) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, t, phase=0.0):
    return 2 * ((f * t + phase) % 1) - 1


def filt(x, kind, fc, order=2):
    b, a = ss.butter(order, np.array(fc) / (SR / 2), kind)
    return ss.lfilter(b, a, x)


def env(t, attack, decay, hold=0.0):
    """Linear attack, optional hold, exponential decay."""
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-np.maximum(t - attack - hold, 0) / decay)
    return a * d


def release(x, r=0.03):
    n = min(len(x), int(r * SR))
    if n:
        x[-n:] *= np.linspace(1, 0, n)
    return x


class Bus:
    """Stereo mix bus with equal-power panning."""

    def __init__(self, dur):
        self.l = np.zeros(int(dur * SR))
        self.r = np.zeros(int(dur * SR))

    def add(self, x, at, gain=1.0, pan=0.0, xr=None):
        i = int(round(at * SR))
        if i >= len(self.l) or i < 0:
            return
        xl = x[: len(self.l) - i]
        xr = xl if xr is None else xr[: len(self.l) - i]
        th = (pan + 1) * np.pi / 4
        self.l[i : i + len(xl)] += xl * gain * np.cos(th)
        self.r[i : i + len(xr)] += xr * gain * np.sin(th)

    def stereo(self):
        return np.stack([self.l, self.r])


def reverb(st, seconds=1.8, decay=0.55, lp=6000):
    t = tt(seconds)
    irs = [filt(noise(len(t)) * np.exp(-t / decay), "low", lp) for _ in range(2)]
    return np.stack([ss.fftconvolve(st[c], irs[c])[: st.shape[1]] for c in range(2)]) * 0.12


def master(mix, peak_db=-1.0):
    """High-pass, gentle soft-clip of the loudest peaks only, then peak-normalize.
    Loudness targets are applied at encode time."""
    mix = filt(mix, "high", 30)
    mix = mix / np.max(np.abs(mix))
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    return mix / np.max(np.abs(mix)) * 10 ** (peak_db / 20)


def write_wav(path, st):
    path = pathlib.Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (np.clip(st.T, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()
