#!/usr/bin/env python3
"""Print the estimated beat timeline of a video (mirrors src/remotion/reels/<id>/timeline.ts).

    python3 scripts/yt/beat-times.py redirect-domain            # table
    python3 scripts/yt/beat-times.py redirect-domain 3+1.3 29+7  # seconds for beat+offset
"""
import json, re, sys

reel = sys.argv[1]
base = f'src/remotion/reels/{reel}'
beats = json.loads(re.search(r'SCRIPT_BEATS: readonly Beat\[\] = (\[.*\]);', open(f'{base}/script.ts', encoding='utf8').read(), re.S).group(1))
tl = open(f'{base}/timeline.ts', encoding='utf8').read()
WPM = float(re.search(r'WPM = (\d+)', tl).group(1))
BREATH = float(re.search(r'BREATH = ([\d.]+)', tl).group(1))
EXTRA = {int(k): float(v) for k, v in re.findall(r'^\s*(\d+): ([\d.]+),', re.search(r'EXTRA: Record<number, number> = \{(.*?)\};', tl, re.S).group(1), re.M)}
at = 0.6
rows = []
for b in beats:
    w = len(b['vo'].split())
    dur = max(1, (w / WPM) * 60 + (BREATH if w else 0) + EXTRA.get(b['n'], 0))
    rows.append((b['n'], at, dur, b['vo']))
    at += dur
if len(sys.argv) > 2:
    for arg in sys.argv[2:]:
        n, off = arg.split('+') if '+' in arg else (arg, '0')
        print(round(rows[int(n) - 1][1] + float(off), 2))
else:
    for n, a, d, vo in rows:
        print(f'{n:>2}  {a:7.2f}  {d:5.2f}  {vo[:80]}')
    print(f'total {at:.2f}s')
