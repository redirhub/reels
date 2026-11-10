#!/usr/bin/env python3
"""Write voiceover/chunks.json from script.md: one take per run of beats, the text sent to ElevenLabs v4 (delivery
tags kept, URLs and numbers written the way she says them) and, per beat, the words she actually says (`spoken`),
which vo-build.py aligns against.
    python3 youtube/02_videos/2026-W44_change-domain-seo/voiceover/make_chunks.py"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
md = open(os.path.join(HERE, '..', 'script.md'), encoding='utf8').read().split('## ACT A')[1].split('## Notes to self')[0]
beats = {}
for m in re.finditer(r'\*\*(\d+)\.\*\*(.*?)\n`\[', md, re.S):
    tags = re.findall(r'\*\((\[.*?\])\)\*', m.group(2))
    vo = re.sub(r'\s+', ' ', re.sub(r'\*\(.*?\)\*', '', m.group(2))).strip()
    beats[int(m.group(1))] = (tags, vo)

# Said as a person says them. Order matters: the long URLs first.
SAY = [('getfrostyfusion.com/flavors/strawberry', 'get frosty fusion dot com slash flavors slash strawberry'),
       ('getfrostybites.com/flavors/strawberry', 'get frosty bites dot com slash flavors slash strawberry'),
       ('getfrostyfusion.com', 'get frosty fusion dot com'), ('getfrostybites.com', 'get frosty bites dot com'),
       ('a 301', 'a three-oh-one'), ('A 301', 'A three-oh-one'), ('with a 301', 'with a three-oh-one'),
       ('from 2021', 'from twenty twenty-one')]
def say(s):
    for a, b in SAY:
        s = s.replace(a, b)
    return s

TAKES = [(1, 4), (5, 8), (9, 13), (14, 18), (19, 24), (25, 28), (29, 35), (36, 43), (44, 47), (48, 51), (52, 52),
         (53, 55), (56, 59), (60, 64)]
out = []
for k, (a, b) in enumerate(TAKES, 1):
    parts, spoken = [], {}
    for n in range(a, b + 1):
        tags, vo = beats[n]
        sv = say(vo)
        if sv != vo:
            spoken[str(n)] = sv.replace('three-oh-one', 'three oh one').replace('twenty-one', 'twenty one')
        # An ellipsis before the line is the pause (it times better than a [pause] tag inside a take).
        lead = ' '.join(t for t in tags if t != '[pause]')
        if '[pause]' in tags:
            sv = '… ' + sv
        parts.append((lead + ' ' + sv).strip())
    text = ' '.join(parts)
    text = re.sub(r'^…\s*', '', text)  # an ellipsis can't open a take
    c = {'id': f'c{k:02d}', 'beats': list(range(a, b + 1)), 'text': text, 'words': len(re.sub(r'\[.*?\]', '', text).split())}
    if spoken:
        c['spoken'] = spoken
    out.append(c)
# Retakes: a newer take of one beat replaces it in its first take (vo-build skips it there), when both recognisers
# hear a slip, e.g. RETAKES = [('c15', 24)]. None for the round-3 recording (Frankie, v4, 2026-10-28).
RETAKES = []
for cid, n in RETAKES:
    tags, vo = beats[n]
    first = next(c for c in out if n in c['beats'])
    first.setdefault('skip', []).append(n)
    out.append({'id': cid, 'beats': [n], 'text': (' '.join(tags) + ' ' + say(vo)).strip(), 'words': len(vo.split())})
json.dump(out, open(os.path.join(HERE, 'chunks.json'), 'w'), indent=2, ensure_ascii=False)
print(f'{len(out)} takes, {sum(len(c["text"]) for c in out)} characters')
for c in out:
    print(c['id'], c['beats'][0], '-', c['beats'][-1], len(c['text']), 'chars')
