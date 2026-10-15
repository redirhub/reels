#!/usr/bin/env python3
"""Find stutter: frames where an animation freezes for a frame or jumps, instead of moving evenly.

    python3 scripts/qa/stutter_check.py out/<id>.mp4 [--from 0] [--to 0] [--top 40]

The video is decoded at its own frame rate in grey at 320×180 and cut into a 8×6 grid of tiles. For every
tile, d[i] is how much it changed from frame i−1 to frame i. In smooth motion d changes gradually from frame
to frame; two signatures break that:

  hold   the tile is moving on both sides (d[i−1], d[i+1] large) but frame i barely changes: a frozen or
         duplicated frame inside an animation (a step function, a rounded value, a dropped render).
  jump   d[i] is several times its neighbours' (and not a cut): the element skipped ahead.

Findings within 0.3 s of each other merge. Cuts (most of the frame changing at once) are ignored.
Each finding prints its time, the kind, how many tiles and where, so it can be looked at frame by frame.
"""
import argparse, subprocess
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('mp4'); ap.add_argument('--from', dest='t0', type=float, default=0); ap.add_argument('--to', dest='t1', type=float, default=0)
ap.add_argument('--top', type=int, default=60)
a = ap.parse_args()
fps = eval(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', a.mp4]).decode().strip())
W, H, GX, GY = 320, 180, 8, 6
cmd = ['ffmpeg', '-v', 'error']
if a.t0: cmd += ['-ss', str(a.t0)]
cmd += ['-i', a.mp4]
if a.t1: cmd += ['-t', str(a.t1 - a.t0)]
cmd += ['-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-']
f = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
tw, th = W // GX, H // GY
diff = np.abs(np.diff(f, axis=0))                                   # (n-1, H, W): change into frame i+1
d = diff[:, :th * GY, :tw * GX].reshape(len(diff), GY, th, GX, tw).mean(axis=(2, 4))  # per tile
glob = diff.mean(axis=(1, 2))
cut = glob > 12                                                      # most of the frame changed: a cut, not motion
MOVE = 0.35                                                          # grey levels/frame that count as motion in a tile
found = []
for i in range(2, len(d) - 2):
    if cut[i - 1:i + 2].any():
        continue
    prev, cur, nxt = d[i - 1], d[i], d[i + 1]
    hold = (prev > MOVE) & (nxt > MOVE) & (cur < 0.25 * np.minimum(prev, nxt))
    ref = np.maximum(np.maximum(d[i - 2], prev), np.maximum(nxt, d[i + 2]))
    jump = (cur > 1.2) & (cur > 3.0 * np.maximum(ref, 0.2))
    for kind, m in (('hold', hold), ('jump', jump)):
        for gy, gx in zip(*np.nonzero(m)):
            found.append((a.t0 + (i + 1) / fps, kind, gx, gy, float(cur[gy, gx]), float(max(prev[gy, gx], nxt[gy, gx]))))
found.sort()
groups = []
for t, kind, gx, gy, c, n in found:
    g = groups[-1] if groups else None
    if g and t - g['end'] <= 0.3 and g['kind'] == kind:
        g['end'] = t; g['tiles'].add((gx, gy)); g['n'] += 1
    else:
        groups.append({'start': t, 'end': t, 'kind': kind, 'tiles': {(gx, gy)}, 'n': 1})
for g in groups[:a.top] if a.top else groups:
    xs = [x for x, _ in g['tiles']]; ys = [y for _, y in g['tiles']]
    print(f"{g['start']:7.2f}–{g['end']:.2f}s  {g['kind']:4s} ×{g['n']:<3d} area x{min(xs) * 1920 // GX}–{(max(xs) + 1) * 1920 // GX} y{min(ys) * 1080 // GY}–{(max(ys) + 1) * 1080 // GY}")
print(f'{len(groups)} finding(s) at {fps:g} fps')
