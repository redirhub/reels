"""Synthesize the original background music and sound effects for the reels.

Everything here is generated from oscillators and noise, so the audio is ours:
no samples, no stock library, no licensing questions.

    pip install numpy scipy imageio-ffmpeg
    python3 scripts/audio/generate.py

Writes public/audio/qr-no-reprint-bgm.mp3 and public/audio/sfx/*.wav. The output is
deterministic (fixed random seed), so re-running it only changes files when this
script changes.
"""
import pathlib
import shutil
import subprocess

import numpy as np
import scipy.signal as ss

SR = 48_000
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "audio"
rng = np.random.default_rng(7)


# ── DSP helpers ──────────────────────────────────────────────────────────────
def tt(d):
    return np.arange(int(d * SR)) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, t, phase=0.0):
    return 2 * ((f * t + phase) % 1) - 1


def filt(x, kind, fc, order=2):
    b, a = ss.butter(order, np.array(fc) / (SR / 2), kind)
    return ss.lfilter(b, a, x)


def noise(n):
    return rng.uniform(-1, 1, n)


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
        if i >= len(self.l):
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


# ── Instruments ──────────────────────────────────────────────────────────────
def kick():
    t = tt(0.45)
    f = 45 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.2)
    click = filt(noise(len(t)), "low", 5000) * np.exp(-t / 0.004) * 0.35
    return np.tanh((body + click) * 1.6)


def hat(open_=False):
    t = tt(0.3 if open_ else 0.08)
    return filt(noise(len(t)), "high", 7500) * env(t, 0.001, 0.12 if open_ else 0.025)


def clap():
    t = tt(0.35)
    bursts = sum(np.exp(-np.maximum(t - o, 0) / 0.006) * (t >= o) for o in (0, 0.011, 0.022))
    tail = env(t, 0.02, 0.11)
    return filt(noise(len(t)), "band", [900, 2600]) * np.maximum(bursts, tail)


def bass(m, d):
    t = tt(d)
    f = midi(m)
    x = 0.6 * saw(f, t) + 0.4 * saw(f * 1.004, t, 0.3)
    x = filt(x, "low", 520) + 0.7 * np.sin(2 * np.pi * f * t)
    return release(x * env(t, 0.004, 0.35, hold=0.02), 0.02)


def pad(notes, d, cutoff=1800):
    t = tt(d)
    l = np.zeros(len(t))
    r = np.zeros(len(t))
    for m in notes:
        f = midi(m)
        for cents, side in ((-8, "l"), (0, "b"), (8, "r")):
            v = saw(f * 2 ** (cents / 1200), t, rng.random())
            if side in ("l", "b"):
                l += v
            if side in ("r", "b"):
                r += v
    a = np.clip(t / 0.25, 0, 1) * np.clip((d - t) / 0.4, 0, 1)
    k = 0.3 / len(notes)
    return filt(l, "low", cutoff) * a * k, filt(r, "low", cutoff) * a * k


def pluck(m, d=0.35):
    t = tt(d)
    f = midi(m)
    x = saw(f, t) + 0.5 * np.sign(np.sin(2 * np.pi * f * t))
    bright = filt(x, "low", 3800) * np.exp(-t / 0.045)
    body = filt(x, "low", 1100) * np.exp(-t / 0.22)
    return release((bright * 0.6 + body) * np.clip(t / 0.002, 0, 1), 0.02)


def bell(m, d=1.2):
    t = tt(d)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.15)
    return x * env(t, 0.002, 0.45)


# ── Background music: "qr-no-reprint" (30s, 120 BPM, downbeat on 6.55s) ─────
DUR = 30.0
BEAT = 0.5
O = 0.55  # grid origin: bars fall on 0.55, 2.55, 4.55, 6.55 (dashboard reveal) …


def bar(k):
    return O + 2 * k


def beats(a, b, step=BEAT):
    return [x for x in np.arange(a, b - 1e-6, step)]


def bgm():
    drums, bassb, music, send = Bus(DUR), Bus(DUR), Bus(DUR), Bus(DUR)
    K, H, HO, C = kick(), hat(), hat(True), clap()
    kicks = []

    def k(at, g=1.0):
        drums.add(K, at, 0.38 * g)
        kicks.append(at)

    # 0 → 2.35 · hook: driving minor pulse (cut dead by the 404 impact SFX).
    for x in beats(O, 2.35):
        k(x)
    for i, x in enumerate(beats(0, 2.35, BEAT / 4)):
        drums.add(H, x, 0.18 if i % 2 else 0.28, pan=0.25)
    for x in beats(O, 2.35, BEAT / 2):
        bassb.add(bass(33, 0.22), x, 0.55)
    l, r = pad([57, 60, 64], 2.35, cutoff=1400)
    music.add(l, 0, 1.0, -1, r)
    send.add(l, 0, 1.0, -1, r)

    # 2.35 → 4.55 · aftermath: low drone and a ticking clock.
    t = tt(2.2)
    drone = np.sin(2 * np.pi * midi(33) * t) + 0.3 * np.sin(2 * np.pi * midi(45) * t)
    drone *= np.clip(t / 0.6, 0, 1) * np.clip((2.2 - t) / 0.3, 0, 1)
    music.add(drone, 2.35, 0.12)
    for x in beats(3.3, 4.55, BEAT / 2):
        drums.add(H, x, 0.2, pan=-0.3 if int(x * 4) % 2 else 0.3)

    # 4.55 → 6.55 · build: F → G, snare roll into the drop.
    for x in beats(bar(2), bar(3)):
        k(x, 0.85)
    for x in beats(bar(2), bar(3), BEAT / 4):
        drums.add(H, x, 0.16, pan=0.2)
    for x in beats(bar(2), bar(2) + 1, BEAT / 2):
        bassb.add(bass(29, 0.22), x, 0.55)
    for x in beats(bar(2) + 1, bar(3), BEAT / 2):
        bassb.add(bass(31, 0.22), x, 0.55)
    for m, at in (([53, 57, 60], bar(2)), ([55, 59, 62], bar(2) + 1)):
        l, r = pad(m, 1.0, cutoff=2200)
        music.add(l, at, 1.0, -1, r)
        send.add(l, at, 1.0, -1, r)
    roll = beats(bar(2) + 1, bar(3), BEAT / 2) + beats(bar(2) + 1.5, bar(3), BEAT / 4)
    for x in sorted(roll):
        drums.add(C, x, 0.25 + 0.5 * (x - (bar(2) + 1)), pan=0.1)

    # 6.55 → 24.55 · main loop C – G – Am – F; lead enters with the before/after.
    chords = [
        (36, [60, 64, 67, 74]),  # Cadd9
        (31, [55, 59, 62, 67]),  # G
        (33, [57, 60, 64, 67]),  # Am7
        (29, [53, 57, 60, 64]),  # Fmaj7
    ]
    arp = [0, 1, 2, 3, 2, 1, 2, 3]
    lead = [76, 74, 72, 74, 76, 79, 76, 74]  # one bar motif, 8ths
    for b in range(3, 12):
        at = bar(b)
        root, notes = chords[(b - 3) % 4]
        for x in beats(at, at + 2):
            k(x)
        for x in (at + 0.5, at + 1.5):
            drums.add(C, x, 0.55, pan=0.05)
            send.add(C, x, 0.4)
        for i, x in enumerate(beats(at, at + 2, BEAT / 2)):
            drums.add(HO if i % 2 else H, x, 0.22 if i % 2 else 0.12, pan=-0.25)
        for i, x in enumerate(beats(at, at + 2, BEAT / 2)):
            bassb.add(bass(root + (12 if i % 2 else 0), 0.22), x, 0.42)
        l, r = pad(notes, 2.0)
        music.add(l, at, 1.0, -1, r)
        send.add(l, at, 1.2, -1, r)
        full = at >= 18.5
        for i, x in enumerate(beats(at, at + 2, BEAT / 4)):
            n = notes[arp[i % 8]] + 12
            music.add(pluck(n, 0.3), x, 0.3 if full else 0.2, pan=0.35 if i % 2 else -0.35)
            send.add(pluck(n, 0.3), x, 0.2)
        if full:
            for i, x in enumerate(beats(at, at + 2, BEAT / 2)):
                music.add(pluck(lead[i] + (12 if b % 2 else 0), 0.45), x, 0.4)
                send.add(pluck(lead[i], 0.45), x, 0.4)

    # 24.55 → 26.55 · breath before the end card (CTA stinger is an SFX at 25.35).
    l, r = pad([60, 64, 67, 74], 2.0, cutoff=900)
    music.add(l, bar(12), 0.9, -1, r)
    send.add(l, bar(12), 1.2, -1, r)
    for x in beats(bar(12), bar(12) + 0.8, BEAT / 4):
        drums.add(H, x, 0.12, pan=0.3)

    # 26.55 → 30 · outro groove on C, fading out.
    for x in beats(bar(13), DUR):
        k(x, 0.8)
    for i, x in enumerate(beats(bar(13), DUR, BEAT / 2)):
        drums.add(HO if i % 2 else H, x, 0.18 if i % 2 else 0.1, pan=-0.25)
        bassb.add(bass(36 + (12 if i % 2 else 0), 0.22), x, 0.5)
    for x in beats(bar(13) + 0.5, DUR, 1.0):
        drums.add(C, x, 0.45)
    l, r = pad([60, 64, 67, 71, 74], DUR - bar(13) + 0.4)
    music.add(l, bar(13), 1.0, -1, r)
    send.add(l, bar(13), 1.2, -1, r)
    for i, x in enumerate(beats(bar(13), DUR, BEAT / 4)):
        music.add(pluck([72, 76, 79, 83][i % 4], 0.3), x, 0.2, pan=0.35 if i % 2 else -0.35)

    # Sidechain: duck bass and music under each kick for the pumping feel.
    duck = np.ones(len(drums.l))
    t = tt(0.35)
    for at in kicks:
        i = int(at * SR)
        seg = 1 - 0.55 * np.exp(-t / 0.09)
        n = min(len(seg), len(duck) - i)
        duck[i : i + n] = np.minimum(duck[i : i + n], seg[:n])

    mix = drums.stereo() + (bassb.stereo() + music.stereo()) * duck + reverb(send.stereo())
    # Fade out the tail and leave the last frames silent.
    t = np.arange(mix.shape[1]) / SR
    mix *= np.clip((29.9 - t) / 1.6, 0, 1)
    return master(mix)


def master(mix, peak_db=-1.0):
    """High-pass, gentle soft-clip of the loudest peaks only, then peak-normalize.
    Loudness targets are applied at encode time (see main)."""
    mix = filt(mix, "high", 30)
    mix = mix / np.max(np.abs(mix))
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    return mix / np.max(np.abs(mix)) * 10 ** (peak_db / 20)


# ── Sound effects ────────────────────────────────────────────────────────────
def sfx_impact():
    t = tt(1.8)
    f = 38 + 60 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.002, 0.5)
    crack = filt(noise(len(t)), "low", 3500) * env(t, 0.001, 0.09)
    x = np.tanh((boom + 0.8 * crack) * 1.8)
    st = np.stack([x, x])
    return master(st + reverb(st, 1.6, 0.5, 3000) * 3, -2)


def sfx_whoosh(d=0.7):
    t = tt(d)
    fc = 400 + 5000 * np.sin(np.pi * t / d) ** 2
    n = noise(len(t))
    out = np.zeros(len(t))
    # Short blocks with their own band-pass give a sweeping filter.
    step = 1200
    for i in range(0, len(t), step):
        seg = n[max(0, i - 400) : i + step]
        f = fc[i]
        y = filt(seg, "band", [f * 0.6, min(f * 1.6, SR / 2 - 100)])
        out[i : i + step] = y[-len(out[i : i + step]) :]
    out *= np.sin(np.pi * t / d) ** 1.5
    pan = t / d
    return master(np.stack([out * np.cos(pan * np.pi / 2), out * np.sin(pan * np.pi / 2)]), -4)


def sfx_riser(d=1.0):
    t = tt(d)
    f = 200 * 2 ** (3 * t / d)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    hiss = filt(noise(len(t)), "high", 2000) * 0.5
    x = (tone + hiss) * (t / d) ** 2
    return master(np.stack([x, np.roll(x, 240)]), -5)


def sfx_click():
    t = tt(0.06)
    x = filt(noise(len(t)), "band", [1800, 6000]) * np.exp(-t / 0.004)
    x += 0.5 * filt(noise(len(t)), "band", [1500, 4000]) * np.exp(-np.maximum(t - 0.03, 0) / 0.003) * (t > 0.03)
    return master(np.stack([x, x]), -8)


def sfx_key():
    t = tt(0.05)
    x = filt(noise(len(t)), "band", [2500, 8000]) * np.exp(-t / 0.006)
    x += 0.4 * np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.01)
    return master(np.stack([x, x]), -14)


def sfx_alert():
    x = np.zeros(int(0.9 * SR))
    for at, m in ((0, 81), (0.14, 76)):
        b = bell(m, 0.7)
        i = int(at * SR)
        x[i : i + len(b)] += b
    st = np.stack([x, x])
    return master(st + reverb(st, 1.0, 0.3), -7)


def sfx_success():
    x = np.zeros(int(1.3 * SR))
    for at, m in ((0, 76), (0.09, 79), (0.18, 84)):
        b = bell(m, 1.0)
        i = int(at * SR)
        x[i : i + len(b)] += b
    st = np.stack([x, x])
    return master(st + reverb(st, 1.4, 0.4), -5)


def sfx_stinger():
    d = 3.0
    l, r = pad([48, 60, 64, 67, 71, 74], d, cutoff=3200)
    t = tt(d)
    hitk = np.zeros(len(t))
    kk = kick()
    hitk[: len(kk)] = kk
    bell_ = np.zeros(len(t))
    for at, m in ((0, 84), (0.12, 88), (0.24, 91)):
        b = bell(m, 1.4)
        i = int(at * SR)
        bell_[i : i + len(b)] += b * 0.25
    st = np.stack([l * 6 + hitk * 0.8 + bell_, r * 6 + hitk * 0.8 + bell_])
    st *= np.clip((d - t) / 1.2, 0, 1)
    return master(st + reverb(st, 2.2, 0.8), -2)


# ── Output ───────────────────────────────────────────────────────────────────
def write_wav(path, st):
    import wave

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


def main():
    tmp = OUT / "qr-no-reprint-bgm.wav"
    write_wav(tmp, bgm())
    subprocess.run(
        # -16 LUFS bed: sits under the SFX; the full mix lands near the -14 LUFS social target.
        [ffmpeg(), "-y", "-loglevel", "error", "-i", str(tmp), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k",
         str(OUT / "qr-no-reprint-bgm.mp3")],
        check=True,
    )
    tmp.unlink()
    for name, fn in {
        "impact": sfx_impact, "whoosh": sfx_whoosh, "riser": sfx_riser, "click": sfx_click,
        "key": sfx_key, "alert": sfx_alert, "success": sfx_success, "stinger": sfx_stinger,
    }.items():
        write_wav(OUT / "sfx" / f"{name}.wav", fn())
    print("wrote", sorted(p.relative_to(ROOT).as_posix() for p in OUT.rglob("*.*")))


if __name__ == "__main__":
    main()
