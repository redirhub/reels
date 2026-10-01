"""Fit a licensed music track (e.g. an ElevenLabs Music generation) to a reel.

    python3 scripts/audio/prepare_track.py analyze <track.mp3>
    python3 scripts/audio/prepare_track.py fit <track.mp3> <reel-id> --duration 15.6 \
        --align <track-seconds>=<reel-seconds> [--splice <reel-s>=<track-s>] [--fade 0.25] [--lufs -16]
    python3 scripts/audio/prepare_track.py oneshot <effect.mp3> <out.wav> --start 0.1 --end 0.4 \
        [--fade-out 0.03] [--highpass 30] [--peak -3]

`analyze` prints the tempo, a loudness curve, the biggest energy rises (section changes)
and the track's near-silent gaps, so you can pick the moment of the track that should land
on a story beat. `fit` shifts the track so <track-seconds> plays at <reel-seconds>, cuts it
to the reel's length (silence-padded if the shift starts before 0), fades in/out briefly and
applies one static gain to the loudness target. `--splice` jumps ahead in the track at a
reel time (12 ms crossfade), e.g. to land the track's real ending on the end card: splice
just before a downbeat to just before a downbeat a whole number of bars later, so the
music never stops. `oneshot` cuts a licensed sound effect to the part a reel plays (play it
with an SfxSample cue in <Sfx />). It writes public/audio/<reel-id>-beat.mp3, the
file <Beat /> plays, so a reel can use a licensed track instead of a generated beat
(it must then have no music.json, or `npm run audio` would overwrite the file).
Record the source and licence in docs/audio-licenses.md.
"""
import argparse
import pathlib
import re
import subprocess

import numpy as np

from dsp import SR, ffmpeg

ROOT = pathlib.Path(__file__).resolve().parents[2]


def decode(path):
    raw = subprocess.run([ffmpeg(), "-loglevel", "error", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).T.copy()


def lufs(path):
    err = subprocess.run([ffmpeg(), "-hide_banner", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


def onset_envelope(mono, hop):
    frames = len(mono) // hop
    spec = np.abs(np.fft.rfft(mono[: frames * hop].reshape(frames, hop) * np.hanning(hop), axis=1))
    flux = np.maximum(np.diff(np.log1p(spec), axis=0), 0).sum(axis=1)
    return np.concatenate([[0], flux])


def analyze(path):
    st = decode(path)
    mono = st.mean(axis=0)
    dur = len(mono) / SR
    hop = 1024
    env = onset_envelope(mono, hop)
    env = env - env.mean()
    ac = np.correlate(env, env, "full")[len(env) - 1:]
    fps = SR / hop
    lags = np.arange(len(ac)) / fps
    ok = (lags > 60 / 150) & (lags < 60 / 95)  # typical reel tempos; avoids half/double picks
    bpm = 60 / lags[ok][np.argmax(ac[ok])]
    print(f"{path}: {dur:.2f}s, ~{bpm:.1f} BPM, integrated {lufs(path):.1f} LUFS")
    win = int(0.25 * SR)
    rms = [max(-60.0, 20 * np.log10(np.sqrt(np.mean(mono[i:i + win] ** 2)) + 1e-9)) for i in range(0, len(mono) - win, win)]
    print("loudness per 0.25s (dBFS):")
    for i in range(0, len(rms), 8):
        print(f"  {i * 0.25:5.2f}s " + " ".join(f"{v:6.1f}" for v in rms[i:i + 8]))
    # Section changes: biggest rise of 1s mean loudness vs the second before.
    sec = int(1 / 0.25)
    rises = []
    for i in range(sec, len(rms) - sec):
        rises.append((np.mean(rms[i:i + sec]) - np.mean(rms[i - sec:i]), i * 0.25))
    print("biggest rises (dB, at s):", ", ".join(f"{d:+.1f}@{t:.2f}" for d, t in sorted(rises, reverse=True)[:5]))
    # Near-silent gaps (under -30 dBFS for 30 ms or more): the track's own breaths, usually just
    # before a downbeat. A --splice from one gap to another (a whole number of bars apart) is
    # inaudible.
    w10 = int(0.01 * SR)
    e = [20 * np.log10(np.sqrt(np.mean(mono[i:i + w10] ** 2)) + 1e-9) for i in range(0, len(mono) - w10, w10)]
    gaps, start = [], None
    for i, v in enumerate(e + [0.0]):
        if v < -30 and start is None:
            start = i
        elif v >= -30 and start is not None:
            if i - start >= 3:
                gaps.append(f"{start * 0.01:.2f}-{i * 0.01:.2f}")
            start = None
    print("quiet gaps (s):", ", ".join(gaps) or "none")
    # Low end share (sub/bass vs everything): chiptune-ish tracks are thin down there.
    spec = np.abs(np.fft.rfft(mono))
    f = np.fft.rfftfreq(len(mono), 1 / SR)
    bands = {"sub <80": (0, 80), "bass 80-250": (80, 250), "mid 250-2k": (250, 2000), "high 2k-8k": (2000, 8000), "air >8k": (8000, SR / 2)}
    total = (spec ** 2).sum()
    print("energy by band: " + ", ".join(f"{k} {100 * (spec[(f >= a) & (f < b)] ** 2).sum() / total:.0f}%" for k, (a, b) in bands.items()))


def render(st, n, segs, xf):
    """segs: [(reel sample, track offset)], sorted by reel sample. From each reel sample on, the
    reel plays track sample (reel sample + offset) until the next segment; joins are equal-power
    crossfades `xf` samples long, centred on the join."""
    out = np.zeros((2, n), np.float32)
    for k, (s0, off) in enumerate(segs):
        last = k + 1 == len(segs)
        s1 = n if last else segs[k + 1][0]
        a = 0 if k == 0 else max(0, s0 - xf // 2)
        b = n if last else min(n, s1 + xf // 2)
        idx = np.arange(a, b)
        src = idx + off
        ok = (src >= 0) & (src < st.shape[1])
        seg = np.zeros((2, b - a), np.float32)
        seg[:, ok] = st[:, src[ok]]
        g = np.ones(b - a)
        if k:
            g *= np.sin(np.clip((idx - (s0 - xf / 2)) / xf, 0, 1) * np.pi / 2)
        if not last:
            g *= np.cos(np.clip((idx - (s1 - xf / 2)) / xf, 0, 1) * np.pi / 2)
        out[:, a:b] += seg * g
    return out


def fit(path, reel, duration, align, fade, target, splices=()):
    st = decode(path)
    src_t, reel_t = (float(x) for x in align.split("="))
    shift = int(round((reel_t - src_t) * SR))  # >0: track starts later in the reel
    n = int(round(duration * SR))
    segs = [(0, -shift)]
    for sp in sorted(splices, key=lambda s: float(s.split("=")[0])):
        r, s = (float(x) for x in sp.split("="))
        segs.append((int(round(r * SR)), int(round((s - r) * SR))))
    out = render(st, n, segs, int(0.012 * SR))
    t = np.arange(n) / SR
    fi = np.clip((t - max(0, shift) / SR) / 0.03, 0, 1)
    fo = np.clip((duration - t) / fade, 0, 1)
    out *= fi * fo
    tmp = ROOT / "public" / "audio" / f"{reel}-beat.wav"
    raw = (np.clip(out.T, -1, 1) * 32767).astype("<i2")
    import wave
    with wave.open(str(tmp), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(raw.tobytes())
    gain = target - lufs(tmp)
    dst = ROOT / "public" / "audio" / f"{reel}-beat.mp3"
    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-i", str(tmp), "-af", f"volume={gain:.2f}dB,alimiter=limit=0.89:level=false",
                    "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k", str(dst)], check=True)
    tmp.unlink()
    jumps = "".join(f", jump at {s / SR:.2f}s to track {(s + o) / SR:.2f}s" for s, o in segs[1:])
    print(f"wrote {dst.relative_to(ROOT)}: shift {shift / SR:+.2f}s{jumps}, gain {gain:+.1f} dB → {lufs(dst):.1f} LUFS")


def oneshot(path, dst, start, end, fade_out, highpass, peak):
    """Cut a licensed one-shot effect (a click, a meme sting) to the part a reel plays: from
    `start` to `end` seconds of the file, 5 ms fade-in, cosine fade over the last `fade_out`
    seconds, optional high-pass, peak-normalised. Writes a 48 kHz 16-bit WAV (no MP3 encoder
    delay, so the effect stays on its frame)."""
    import wave
    from scipy.signal import butter, sosfiltfilt
    st = decode(path)[:, int(round(start * SR)):int(round(end * SR))].astype(np.float64)
    if highpass:
        st = sosfiltfilt(butter(2, highpass, "high", fs=SR, output="sos"), st, axis=1)
    n = st.shape[1]
    g = np.ones(n)
    fi = min(n, int(0.005 * SR))
    g[:fi] = np.linspace(0, 1, fi)
    fo = min(n, int(fade_out * SR))
    if fo:
        g[n - fo:] *= 0.5 * (1 + np.cos(np.linspace(0, np.pi, fo)))
    st *= g
    st *= 10 ** (peak / 20) / np.abs(st).max()
    with wave.open(str(dst), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st.T, -1, 1) * 32767).astype("<i2").tobytes())
    print(f"wrote {dst}: {n / SR:.3f}s from {start:.3f}s, peak {peak:.1f} dBFS")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    o = sub.add_parser("oneshot"); o.add_argument("track"); o.add_argument("dst")
    o.add_argument("--start", type=float, default=0.0); o.add_argument("--end", type=float, required=True)
    o.add_argument("--fade-out", type=float, default=0.03); o.add_argument("--highpass", type=float, default=0.0)
    o.add_argument("--peak", type=float, default=-3.0)
    a = sub.add_parser("analyze"); a.add_argument("track")
    f = sub.add_parser("fit"); f.add_argument("track"); f.add_argument("reel")
    f.add_argument("--duration", type=float, required=True); f.add_argument("--align", required=True)
    f.add_argument("--fade", type=float, default=0.25); f.add_argument("--lufs", type=float, default=-16.0)
    f.add_argument("--splice", action="append", default=[], metavar="REEL=TRACK",
                   help="at REEL seconds, jump to TRACK seconds of the track (repeatable)")
    args = ap.parse_args()
    if args.cmd == "analyze":
        analyze(args.track)
    elif args.cmd == "oneshot":
        oneshot(args.track, args.dst, args.start, args.end, args.fade_out, args.highpass, args.peak)
    else:
        fit(args.track, args.reel, args.duration, args.align, args.fade, args.lufs, args.splice)
