#!/usr/bin/env python3
"""Find things that flash: a card, label or panel that appears and is gone again within about a second.

    python3 scripts/qa/flash_check.py out/<id>.mp4 [--window 0.5] [--min 6]

A viewer reads that as a glitch ("a card appears and disappears immediately", Leo, W43 round 1). The video
is decoded at 10 fps in grey at 192×108 and split into an 8×6 grid of tiles. For each time t and tile it
compares the frame at t with the frames a window before and after:

    came  = |f(t) − f(t−w)|      something changed in the tile
    went  = |f(t+w) − f(t−w)|    ...and the tile is back to how it was

A tile flags when `came` is large (≥ --min grey levels) and `went` is under a third of it. Neighbouring
hits merge into one finding with its time span and screen area. A cut away and back, a blink or a pulse
can flag too, so look at each finding: it is a list to check, not a verdict.
"""
import argparse, subprocess
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('mp4'); ap.add_argument('--window', type=float, default=0.5); ap.add_argument('--min', type=float, default=6.0)
a = ap.parse_args()
FPS, W, H, GX, GY = 10, 192, 108, 8, 6
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.mp4, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                     capture_output=True, check=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
tw, th = W // GX, H // GY
tiles = f[:, :th * GY, :tw * GX].reshape(len(f), GY, th, GX, tw).mean(axis=(2, 4))  # (n, GY, GX)
k = int(round(a.window * FPS))
hits = []
for i in range(k, len(f) - k):
    came = np.abs(tiles[i] - tiles[i - k]); went = np.abs(tiles[i + k] - tiles[i - k])
    m = (came >= a.min) & (went < came / 3)
    for gy, gx in zip(*np.nonzero(m)):
        hits.append((i / FPS, gx, gy, float(came[gy, gx])))
# merge hits close in time
hits.sort(); found = []
for t, gx, gy, c in hits:
    if found and t - found[-1]['end'] <= 0.3:
        g = found[-1]; g['end'] = t; g['tiles'].add((gx, gy)); g['peak'] = max(g['peak'], c)
    else:
        found.append({'start': t, 'end': t, 'tiles': {(gx, gy)}, 'peak': c})
for g in found:
    xs = [x for x, _ in g['tiles']]; ys = [y for _, y in g['tiles']]
    box = (min(xs) * 1920 // GX, min(ys) * 1080 // GY, (max(xs) + 1) * 1920 // GX, (max(ys) + 1) * 1080 // GY)
    print(f"{g['start']:7.1f}–{g['end']:.1f}s  tiles {len(g['tiles']):2d}  area x{box[0]}–{box[2]} y{box[1]}–{box[3]}  change {g['peak']:.0f}")
print(f'{len(found)} finding(s)')
