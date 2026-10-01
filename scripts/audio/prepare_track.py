"""Fit a licensed music track (e.g. an ElevenLabs Music generation) to a reel.

    python3 scripts/audio/prepare_track.py analyze <track.mp3>
    python3 scripts/audio/prepare_track.py fit <track.mp3> <reel-id> --duration 15.6 \
        --align <track-seconds>=<reel-seconds> [--fade 0.25] [--lufs -16]

`analyze` prints the tempo, a loudness curve and the biggest energy rises (section
changes), so you can pick the moment of the track that should land on a story beat.
`fit` shifts the track so <track-seconds> plays at <reel-seconds>, cuts it to the reel's
length (silence-padded if the shift starts before 0), fades in/out briefly and applies
one static gain to the loudness target. It writes public/audio/<reel-id>-beat.mp3, the
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
    # Low end share (sub/bass vs everything): chiptune-ish tracks are thin down there.
    spec = np.abs(np.fft.rfft(mono))
    f = np.fft.rfftfreq(len(mono), 1 / SR)
    bands = {"sub <80": (0, 80), "bass 80-250": (80, 250), "mid 250-2k": (250, 2000), "high 2k-8k": (2000, 8000), "air >8k": (8000, SR / 2)}
    total = (spec ** 2).sum()
    print("energy by band: " + ", ".join(f"{k} {100 * (spec[(f >= a) & (f < b)] ** 2).sum() / total:.0f}%" for k, (a, b) in bands.items()))


def fit(path, reel, duration, align, fade, target):
    st = decode(path)
    src_t, reel_t = (float(x) for x in align.split("="))
    shift = int(round((reel_t - src_t) * SR))  # >0: track starts later in the reel
    n = int(round(duration * SR))
    out = np.zeros((2, n), np.float32)
    a = max(0, shift)
    b = max(0, -shift)
    m = min(n - a, st.shape[1] - b)
    out[:, a:a + m] = st[:, b:b + m]
    t = np.arange(n) / SR
    fi = np.clip((t - a / SR) / 0.03, 0, 1) if b == 0 else np.clip(t / 0.03, 0, 1)
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
    print(f"wrote {dst.relative_to(ROOT)}: shift {shift / SR:+.2f}s, gain {gain:+.1f} dB → {lufs(dst):.1f} LUFS")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("analyze"); a.add_argument("track")
    f = sub.add_parser("fit"); f.add_argument("track"); f.add_argument("reel")
    f.add_argument("--duration", type=float, required=True); f.add_argument("--align", required=True)
    f.add_argument("--fade", type=float, default=0.25); f.add_argument("--lufs", type=float, default=-16.0)
    args = ap.parse_args()
    if args.cmd == "analyze":
        analyze(args.track)
    else:
        fit(args.track, args.reel, args.duration, args.align, args.fade, args.lufs)
