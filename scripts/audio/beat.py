"""Per-reel background beat: drums only. Simple, clean, strongly rhythmic.

Scene-specific sound effects (sfx.py, placed with <Sfx>) carry the story on top.
There is deliberately no bass, melody or chords: drums plus effects is the
restrained, premium sound RedirHub ads use.

Each reel has src/remotion/reels/<id>/music.json:

    {
      "bpm": 120,          # 116–126 works best
      "duration": 30,      # seconds; must equal the reel's length (render.mjs checks)
      "drop": 6.55,        # optional: the full kit (clap, open hats, crash) comes in here, and
                           #   the bar grid is aligned so this is a downbeat. Before it: kick +
                           #   hats only. Without it: full kit after one bar.
      "mute": [[2.35, 4.55]]  # optional: silence, so an effect (e.g. an impact) stands alone
    }

The reel id seeds two small choices (open-hat pattern, kick pickup), so reels differ a
little but the same reel always renders the same file.
"""
import math

import numpy as np

from dsp import SR, Bus, choice, master, reverb, seed
from instruments import clap, crash, hat, kick, shaker

# 16th-note steps within a bar.
OPEN_HATS = [[2, 6, 10, 14], [2, 6, 10, 14, 15], [2, 6, 7, 10, 14]]
KICK_PICKUPS = [[], [14], [11]]  # extra kick before the next bar, every second bar


def beat(reel_id, cfg):
    seed(f"beat:{reel_id}")
    bpm, dur = float(cfg["bpm"]), float(cfg["duration"])
    drop, mutes = cfg.get("drop"), cfg.get("mute", [])
    step = 60 / bpm / 4
    bar = 16 * step
    origin = (drop % bar) if drop is not None else 0.0
    full_from = drop if drop is not None else origin + bar
    hats, pickup = choice(OPEN_HATS), choice(KICK_PICKUPS)

    def muted(t):
        return any(a <= t < b for a, b in mutes)

    drums, send = Bus(dur), Bus(dur)
    K, C, SH, HC, HO, CR = kick(), clap(), shaker(), hat(), hat(True), crash()

    first = math.floor((0 - origin) / bar)
    for b in range(first, math.ceil((dur - origin) / bar) + 1):
        start = origin + b * bar
        for s in range(16):
            t = start + s * step
            if t < 0 or t >= dur or muted(t):
                continue
            full = t >= full_from - 1e-6
            if s % 4 == 0 or (full and b % 2 == 1 and s in pickup):
                drums.add(K, t, 0.45 if full else 0.38)  # softer before the drop, so it lifts
            if full:
                drums.add(SH, t, 0.12 if s % 4 == 2 else 0.06, pan=0.3)
                if s in (4, 12):
                    drums.add(C, t, 0.5)
                    send.add(C, t, 0.35)
                if s in hats:
                    drums.add(HO, t, 0.15, pan=-0.3)
            elif s % 2 == 0:
                drums.add(HC, t, 0.16 if s % 4 == 2 else 0.09, pan=0.25)
        # Clap roll into the drop.
        if drop is not None and start < drop <= start + bar + 1e-6 and drop > bar:
            for i in range(4):
                t = drop - step * (4 - i)
                if t >= 0 and not muted(t):
                    drums.add(C, t, 0.2 + 0.1 * i)

    if not muted(full_from) and full_from < dur - 2:
        drums.add(CR, full_from, 0.22, pan=0.2)

    mix = drums.stereo() + reverb(send.stereo(), 1.0, 0.3)
    t = np.arange(mix.shape[1]) / SR
    mix *= np.clip(t / 0.02, 0, 1) * np.clip((dur - 0.1 - t) / 1.5, 0, 1)  # fade in/out
    return master(mix), {"open_hats": OPEN_HATS.index(hats), "kick_pickup": KICK_PICKUPS.index(pickup)}
