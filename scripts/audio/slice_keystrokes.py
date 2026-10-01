"""Cut single keystrokes out of a typing recording, so a reel can place one on every
character as it appears (in sync, which is what makes typing sound satisfying).

    python3 scripts/audio/slice_keystrokes.py <typing.mp3> <out-dir> [--count 8]

Writes <out-dir>/key-1.wav … key-N.wav: the N cleanest strokes (loud, with room before the
next one), each from 3 ms before its attack, at most 120 ms long, faded out, peak -3 dBFS.
Record the source recording in docs/audio-licenses.md.
"""
import argparse
import pathlib
import subprocess
import wave

import numpy as np

from dsp import SR, ffmpeg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--count", type=int, default=8)
    a = ap.parse_args()

    raw = subprocess.run([ffmpeg(), "-loglevel", "error", "-i", a.src, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    st = np.frombuffer(raw, np.float32).reshape(-1, 2).T.copy()
    mono = st.mean(axis=0)
    hop = int(0.002 * SR)
    env = np.array([np.abs(mono[i:i + hop]).max() for i in range(0, len(mono) - hop, hop)])
    thr = env.max() * 0.25
    onsets, last = [], -1
    for i in range(5, len(env)):
        if env[i] > thr and env[i] > 2.5 * env[i - 5:i].mean() + 1e-4 and (last < 0 or (i - last) * hop / SR > 0.06):
            onsets.append(i * hop)
            last = i
    strokes = []
    for k, on in enumerate(onsets):
        nxt = onsets[k + 1] if k + 1 < len(onsets) else len(mono)
        room = (nxt - on) / SR
        peak = np.abs(mono[on:on + int(0.03 * SR)]).max()
        strokes.append((room >= 0.09, peak, on, nxt))
    picked = sorted([s for s in strokes if s[0]], key=lambda s: -s[1])[: a.count]
    picked.sort(key=lambda s: s[2])
    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for n, (_, _, on, nxt) in enumerate(picked, 1):
        s0 = max(0, on - int(0.003 * SR))
        s1 = min(nxt - int(0.004 * SR), s0 + int(0.12 * SR))
        seg = st[:, s0:s1].copy()
        fade = int(0.02 * SR)
        seg[:, -fade:] *= np.linspace(1, 0, fade)
        seg *= 10 ** (-3 / 20) / np.abs(seg).max()
        with wave.open(str(out / f"key-{n}.wav"), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(seg.T, -1, 1) * 32767).astype("<i2").tobytes())
        print(f"key-{n}.wav: from {s0 / SR:.3f}s, {seg.shape[1] / SR * 1000:.0f} ms")


if __name__ == "__main__":
    main()
