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
    """Lines of at most MAX_LINE characters, breaking at the last clause boundary (, ; : …) that
    fits, so a line does not end on "type the" when "type the old address," was available."""
    lines, cur = [], []
    for w in words:
        if cur and len(' '.join(x['w'] for x in cur + [w])) > MAX_LINE:
            cut = max((i for i, x in enumerate(cur[:-1]) if re.search(r'[,;:…]["”]?$', x['w'])), default=None)
            if cut is not None and cut >= len(cur) // 3:
                lines.append(cur[:cut + 1]); cur = cur[cut + 1:]
            else:
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
# A cue shorter than MIN_SHOW (an orphan "site." after a long sentence) joins its neighbour when
# the pair still fits two lines; otherwise it is simply held longer below.
def merged(a, b):
    text = (a['text'] + ' ' + b['text']).replace('\n', ' ')
    ws = [{'w': w, 's': 0, 'e': 0} for w in text.split()]
    ls = lines_of(ws)
    if len(ls) > 2: return None
    return {'s': a['s'], 'e': b['e'], 'text': '\n'.join(' '.join(w['w'] for w in l) for l in ls)}
i = 0
while i < len(cues):
    c = cues[i]
    if c['e'] - c['s'] < MIN_SHOW:
        for j in (i - 1, i + 1):
            if 0 <= j < len(cues):
                m = merged(cues[min(i, j)], cues[max(i, j)])
                if m:
                    cues[min(i, j)] = m; del cues[max(i, j)]; i = min(i, j); break
        else:
            i += 1
            continue
        continue
    i += 1
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
