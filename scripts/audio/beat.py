"""Per-reel background beat: simple, bright, strongly rhythmic.

Each reel has src/remotion/reels/<id>/music.json:

    {
      "bpm": 120,          # 116–126 works best
      "duration": 30,      # seconds; must equal the reel's length (render.mjs checks)
      "drop": 6.55,        # optional: the full groove (bass + chords) kicks in here with a
                           #   crash, and the bar grid is aligned so this is a downbeat.
                           #   Before it: drums only. Without it: full groove after one bar.
      "mute": [[2.35, 4.55]]  # optional: only a soft shaker plays (for dramatic moments)
    }

The style is fixed: four-on-the-floor kick, clap on 2 and 4, 16th shaker, off-beat open
hats, a major-key bass line and short chord stabs. The reel id seeds a few choices
(key, chord loop, bass/hat/percussion patterns), so every reel sounds a bit different
but the same reel always renders the same file.
"""
import math

import numpy as np

from dsp import SR, Bus, choice, master, reverb, seed, tt
from instruments import bass, clap, crash, hat, kick, rim, shaker, stab

# Chord loops as semitone offsets from the key's root (one chord per bar).
PROGRESSIONS = [
    [0, 7, 9, 5],  # I – V – vi – IV
    [0, 5, 7, 5],  # I – IV – V – IV
    [0, 9, 5, 7],  # I – vi – IV – V
]
# 16th-note steps within a bar. Bass steps carry an octave jump.
BASS_PATTERNS = [
    [(2, 0), (6, 0), (10, 0), (14, 0)],                                        # off-beat house bass
    [(0, 0), (2, 12), (4, 0), (6, 12), (8, 0), (10, 12), (12, 0), (14, 12)],   # octave bounce
    [(0, 0), (3, 0), (6, 0), (8, 0), (11, 0), (14, 0)],                        # syncopated
]
OPEN_HATS = [[2, 6, 10, 14], [2, 6, 10, 14, 15], [2, 6, 7, 10, 14]]
PERCUSSION = [[3, 6, 10, 12], [3, 7, 11, 14], [0, 3, 6, 10, 13]]
STABS = [[2, 6, 10, 14], [3, 6, 11, 14], [0, 3, 6, 11]]
KEYS = [0, 2, 5]  # C, D, F major


def _triad(root_midi, offset):
    """Major triad, or minor on the ii/iii/vi degrees, voiced between G3 and G4."""
    minor = offset % 12 in (2, 4, 9)
    r = root_midi + offset
    notes = [r, r + (3 if minor else 4), r + 7]
    return [n - 12 if n > 67 else n + 12 if n < 55 else n for n in notes]


def beat(reel_id, cfg):
    seed(f"beat:{reel_id}")
    bpm, dur = float(cfg["bpm"]), float(cfg["duration"])
    drop, mutes = cfg.get("drop"), cfg.get("mute", [])
    step = 60 / bpm / 4
    bar = 16 * step
    origin = (drop % bar) if drop is not None else 0.0
    full_from = drop if drop is not None else origin + bar

    key = choice(KEYS)
    prog = choice(PROGRESSIONS)
    bass_pat, hats, perc, stabs = choice(BASS_PATTERNS), choice(OPEN_HATS), choice(PERCUSSION), choice(STABS)

    def muted(t):
        return any(a <= t < b for a, b in mutes)

    drums, tonal, send = Bus(dur), Bus(dur), Bus(dur)
    K, C, SH, HO, RIM, CR = kick(), clap(), shaker(), hat(True), rim(), crash()
    kicks = []

    first = math.floor((0 - origin) / bar)
    for b in range(first, math.ceil((dur - origin) / bar) + 1):
        start = origin + b * bar
        chord = prog[(b - first) % 4]
        for s in range(16):
            t = start + s * step
            if t < 0 or t >= dur:
                continue
            if muted(t):
                if s % 2 == 0:
                    drums.add(SH, t, 0.07, pan=0.3)
                continue
            full = t >= full_from - 1e-6
            drums.add(SH, t, 0.13 if s % 4 == 2 else 0.07, pan=0.3)
            if s % 4 == 0:
                drums.add(K, t, 0.4)
                kicks.append(t)
            if s in (4, 12):
                drums.add(C, t, 0.5)
                send.add(C, t, 0.3)
            if s in hats:
                drums.add(HO, t, 0.16, pan=-0.3)
            if full and s in perc:
                drums.add(RIM, t, 0.12, pan=0.5)
            if full:
                for s2, octave in bass_pat:
                    if s2 == s:
                        tonal.add(bass(36 + key + chord - (12 if chord + key > 4 else 0) + octave, step * 1.8), t, 0.4)
                if s in stabs:
                    notes = _triad(60 + key, chord)
                    tonal.add(stab(notes), t, 0.16, pan=-0.2)
                    send.add(stab(notes), t, 0.25)
        # Clap roll in the last beat before the drop.
        if drop is not None and start < drop <= start + bar + 1e-6 and drop > bar:
            for i in range(4):
                t = drop - step * (4 - i)
                if t >= 0 and not muted(t):
                    drums.add(C, t, 0.2 + 0.1 * i)

    # Crash on the drop and every 8 bars after it.
    t = full_from
    while t < dur - 2:
        if not muted(t):
            drums.add(CR, t, 0.22, pan=0.2)
        t += 8 * bar

    # Sidechain: bass and stabs duck under each kick (the "pumping" groove).
    duck = np.ones(len(drums.l))
    env_t = tt(0.3)
    for at in kicks:
        i = int(at * SR)
        seg = 1 - 0.5 * np.exp(-env_t / 0.08)
        n = min(len(seg), len(duck) - i)
        duck[i : i + n] = np.minimum(duck[i : i + n], seg[:n])

    mix = drums.stereo() + tonal.stereo() * duck + reverb(send.stereo(), 1.2, 0.35)
    t = np.arange(mix.shape[1]) / SR
    mix *= np.clip(t / 0.05, 0, 1) * np.clip((dur - 0.1 - t) / 1.5, 0, 1)  # fade in/out
    names = {"key": "C D F".split()[KEYS.index(key)], "progression": prog,
             "bass": BASS_PATTERNS.index(bass_pat), "hats": OPEN_HATS.index(hats),
             "percussion": PERCUSSION.index(perc), "stabs": STABS.index(stabs)}
    return master(mix), names
