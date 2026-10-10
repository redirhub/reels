"""Per-video background bed for voice-led films: a slow, quiet pad. No drums.

A 5-minute tutorial with narration wants a floor, not a beat: low, soft chords that move every
few bars, filtered dark so the voice sits on top. Like beat.py it is synthesized here (saw
oscillators through a low-pass), so it is ours.

    {
      "kind": "pad",
      "duration": 325.7,      # seconds; must equal the film's length (render.mjs checks)
      "bpm": 72,              # one chord per 2 bars at this tempo
      "root": 50,             # MIDI note of the key (50 = D2)
      "progression": [[0, 4, 7, 11], [-3, 0, 4, 7], ...]   # optional; semitones from the root
    }

The video id seeds the detune and the slow filter drift, so the same video always renders
the same file.
"""
import numpy as np

from dsp import SR, filt, rand, seed, tt
from instruments import pad

# I–vi–IV–V-ish in a major key, voiced low and open, with a 9th on the tonic so it never
# sounds like a pop loop. Semitones from the root.
DEFAULT = [[0, 7, 11, 14], [-3, 4, 7, 12], [-7, 0, 4, 9], [-5, 2, 7, 11]]


def bed(video_id, cfg):
    seed(f"pad:{video_id}")
    dur, bpm = float(cfg["duration"]), float(cfg.get("bpm", 72))
    root = int(cfg.get("root", 50))
    prog = cfg.get("progression", DEFAULT)
    chord_len = 60 / bpm * 8  # two bars
    l = np.zeros(int(dur * SR)); r = np.zeros(len(l))
    at, i = 0.0, 0
    while at < dur:
        d = min(chord_len + 0.6, dur - at)  # chords overlap by their release, no gap
        notes = [root + s for s in prog[i % len(prog)]]
        cl, cr = pad(notes, d, cutoff=900 + 250 * rand())
        s = int(at * SR); n = min(len(cl), len(l) - s)
        l[s:s + n] += cl[:n]; r[s:s + n] += cr[:n]
        at += chord_len; i += 1
    t = tt(dur)
    # Slow filter breathing (about a minute per cycle) and a long fade in/out.
    drift = 0.85 + 0.15 * np.sin(2 * np.pi * t / (55 + 10 * rand()))
    l = filt(l * drift, "low", 1400); r = filt(r * drift, "low", 1400)
    shape = np.clip(t / 3.0, 0, 1) * np.clip((dur - t) / 4.0, 0, 1)
    st = np.stack([l, r]) * shape
    return st / np.max(np.abs(st)) * 10 ** (-3 / 20)
