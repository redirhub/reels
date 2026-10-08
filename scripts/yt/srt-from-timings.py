#!/usr/bin/env python3
"""Captions (.srt) from a video's word timings.

    python3 scripts/yt/srt-from-timings.py youtube/02_videos/<video>/voiceover/timings.json out.srt

Cues follow the script's sentences: a beat is split at sentence ends, then into lines of at most
42 characters, at most two lines per cue, each cue on screen at least 1 s and extended to the
next cue if the gap is short. Times are the spoken words', so the captions land with the voice.
"""
import json, re, sys

timings, out = sys.argv[1], sys.argv[2]
beats = json.load(open(timings))['beats']
MAX_LINE, MIN_SHOW = 42, 1.0

def lines_of(words):
    lines, cur = [], []
    for w in words:
        if cur and len(' '.join(x['w'] for x in cur + [w])) > MAX_LINE:
            lines.append(cur); cur = []
        cur.append(w)
    if cur: lines.append(cur)
    return lines

cues = []
for b in beats:
    if not b['words']: continue
    # sentences: split after . ! ? … (keep quotes that follow the mark)
    sents, cur = [], []
    for w in b['words']:
        cur.append(w)
        if re.search(r'[.!?…]["”]?$', w['w']):
            sents.append(cur); cur = []
    if cur: sents.append(cur)
    for s in sents:
        ls = lines_of(s)
        for i in range(0, len(ls), 2):
            chunk = ls[i:i + 2]
            flat = [w for l in chunk for w in l]
            cues.append({'s': flat[0]['s'], 'e': flat[-1]['e'], 'text': '\n'.join(' '.join(w['w'] for w in l) for l in chunk)})
for a, b in zip(cues, cues[1:]):
    a['e'] = max(a['e'], min(a['s'] + MIN_SHOW, b['s'] - 0.05)) if b['s'] - a['e'] < 1.5 else max(a['e'] + 0.4, a['s'] + MIN_SHOW)
    a['e'] = min(a['e'], b['s'] - 0.05)
cues[-1]['e'] += 0.6

def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"
with open(out, 'w') as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['text']}\n\n")
print(f"{len(cues)} cues → {out}")
