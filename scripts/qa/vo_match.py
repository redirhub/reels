#!/usr/bin/env python3
"""Whisper the voiceover and score it against the script, beat by beat (the voice gate).

    python3 scripts/qa/vo_match.py <video dir> [--takes] [--mix public/audio/<id>-vo.mp3]

--takes transcribes each take in voiceover/chunks/ against its beats' text (chunks.json); --mix transcribes the
built track and cuts it at the beat times of voiceover/timings.json. Each beat gets a word-match ratio (difflib on
normalised words: lower case, no punctuation, digits and spelled-out forms folded together), and the brand words
are checked as heard. Needs faster-whisper (small.en, CPU).
"""
import argparse, difflib, json, os, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--takes', action='store_true'); ap.add_argument('--mix')
ap.add_argument('--model', default='small.en'); ap.add_argument('--only', nargs='*', default=None)
a = ap.parse_args()
FOLD = [(r'\bthree oh one\b', '301'), (r'\b301\b', '301'), (r'\btwo hundred\b', '200'), (r'\bsixty three\b', '63'),
        (r'\bh t t p s\b', 'https'), (r'\bdouble u double u double u\b', 'www'), (r'\bw w w\b', 'www'),
        (r'\bre ?dir ?hub\b', 'redirhub'), (r'\bredirect hub\b', 'redirhub')]


def norm(s):
    s = s.lower().replace('-', ' ').replace('’', "'")
    s = re.sub(r"[^a-z0-9' ]+", ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    for p, r in FOLD:
        s = re.sub(p, r, s)
    return s.split()


def audio(path, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + ['-i', path] + (['-t', str(t)] if t else []) + ['-ar', '16000', '-ac', '1', '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)


m = WhisperModel(a.model, device='cpu', compute_type='int8')
def hear(x):
    segs, _ = m.transcribe(x, beam_size=5, language='en', vad_filter=False)
    return ' '.join(s.text.strip() for s in segs)

md = open(os.path.join(a.video, 'script.md'), encoding='utf8').read()
script = {int(k): re.sub(r'\[[^\]]*\]\s*', '', v).strip() for k, v in re.findall(r'^(\d+)\.\s+(.*)$', md, re.M)}
rows = []
if a.takes:
    for c in json.load(open(os.path.join(a.video, 'voiceover', 'chunks.json'))):
        if a.only and c['id'] not in a.only:
            continue
        want = ' '.join(script[n] for n in c['beats'])
        got = hear(audio(os.path.join(a.video, 'voiceover', 'chunks', c['id'] + '.mp3')))
        rows.append((c['id'], want, got))
if a.mix:
    T = json.load(open(os.path.join(a.video, 'voiceover', 'timings.json')))
    for b in T['beats']:
        if b.get('voStart') is None:
            continue
        s0, s1 = b['voStart'] - 0.15, b['voEnd'] + 0.25
        got = hear(audio(a.mix, s0, s1 - s0))
        rows.append((f"b{b['n']:02d}", script[b['n']], got))
tot_w = tot_ok = 0
out = []
for k, want, got in rows:
    w, g = norm(want), norm(got)
    sm = difflib.SequenceMatcher(None, w, g)
    ok = sum(bl.size for bl in sm.get_matching_blocks())
    tot_w += len(w); tot_ok += ok
    diff = [f'{op}: {" ".join(w[i1:i2])} -> {" ".join(g[j1:j2])}' for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
    out.append({'id': k, 'match': round(ok / max(1, len(w)), 3), 'heard': got, 'diff': diff})
    print(f'{k:5s} {ok / max(1, len(w)):.3f}  {"; ".join(diff)[:150]}')
print(f'overall word match {tot_ok / max(1, tot_w):.3f} ({tot_ok}/{tot_w})')
brand = [r for r in out if re.search(r'redir|reader|red air|redear', r['heard'], re.I)]
for r in brand:
    print('brand', r['id'], '|', re.findall(r'\b\S*(?:redir|reader|red air|redear)\S*(?:\s+hub)?', r['heard'], re.I))
json.dump(out, open('/tmp/vo_match.json', 'w'), indent=1)
