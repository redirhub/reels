#!/usr/bin/env python3
"""Write voiceover/chunks.json and src/remotion/reels/bulk-redirects/script.ts from script.md (v4).

    python3 youtube/02_videos/2026-W46_bulk-domain-redirects/voiceover/make_chunks.py

One take per run of beats (an act or half an act, so a take keeps one tone). The text sent to ElevenLabs has no
delivery tags (Leo, 2026-11-11: "[softly]" was performed as a whisper; the narrator is Sarah on eleven_v4), and the
few tokens a person says differently are written the way she says them (`spoken`, which vo-build.py aligns against).
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
md = open(os.path.join(HERE, '..', 'script.md'), encoding='utf8').read()
beats = {}
for m in re.finditer(r'^(\d+)\.\s+(.*)$', md, re.M):
    beats[int(m.group(1))] = re.sub(r'\[[^\]]*\]\s*', '', m.group(2)).strip()
assert sorted(beats) == list(range(1, 34)), sorted(beats)

# Said as a person says them.
SAY = [('a 302,', 'a three-oh-two,'), ('its https?', 'its H T T P S?'), ('its www version', 'its double-u double-u double-u version')]
def say(s):
    for a, b in SAY:
        s = s.replace(a, b)
    return s

# The key frame each beat plays over (keyframes.md); the visual note in script.ts.
FRAME = {1: 'w46-Notebook', 2: 'w46-Notebook', 3: 'w46-Glomvo', 4: 'w46-Title', 5: 'w46-Renewals', 6: 'w46-Parking',
         7: 'w46-Weight', 8: 'w46-TwoResults', 9: 'w46-TwoResults', 10: 'w46-Warning, then w46-Silence', 11: 'w46-Door',
         12: 'w46-Honest', 13: 'w46-Once', 14: 'w46-List', 15: 'w46-List', 16: 'w46-Columns', 17: 'w46-Columns',
         18: 'w46-Import', 19: 'w46-Import', 20: 'w46-Review (with the fix count)', 21: 'w46-Fix, then the www row of w46-Review',
         22: 'w46-PointDNS', 23: 'w46-PointDNS', 24: 'w46-Padlocks', 25: 'w46-Knocks', 26: 'w46-Knocks', 27: 'w46-Price',
         28: 'w46-Quiet', 29: 'w46-ByTag', 30: 'w46-Recap', 31: 'w46-YourNames', 32: 'w46-YourNames', 33: 'w46-EndCard'}

TAKES = [(1, 4), (5, 7), (8, 10), (11, 13), (14, 17), (18, 21), (22, 24), (25, 27), (28, 29), (30, 33)]
out = []
for k, (a, b) in enumerate(TAKES, 1):
    parts, spoken = [], {}
    for n in range(a, b + 1):
        sv = say(beats[n])
        if sv != beats[n]:
            spoken[str(n)] = sv.replace('three-oh-two', 'three oh two').replace('double-u', 'double u')
        parts.append(sv)
    text = ' '.join(parts)
    c = {'id': f'c{k:02d}', 'beats': list(range(a, b + 1)), 'text': text, 'words': len(text.split())}
    if spoken:
        c['spoken'] = spoken
    out.append(c)
json.dump(out, open(os.path.join(HERE, 'chunks.json'), 'w'), indent=2, ensure_ascii=False)

ts = [{'n': n, 'vo': beats[n], 'visual': FRAME[n]} for n in range(1, 34)]
open(os.path.join(ROOT, 'src/remotion/reels/bulk-redirects/script.ts'), 'w', encoding='utf8').write(
    "/* GENERATED from youtube/02_videos/2026-W46_bulk-domain-redirects/script.md (v4) by voiceover/make_chunks.py. One entry\n"
    "   per VO beat: the spoken line and the key frame it plays over. Don't edit here; edit the script and regenerate. */\n"
    "export type Beat = { n: number; vo: string; visual: string };\n"
    "export const SCRIPT_BEATS: readonly Beat[] = " + json.dumps(ts, ensure_ascii=False, indent=4) + ";\n")
print(f'{len(out)} takes, {sum(len(c["text"]) for c in out)} characters')
for c in out:
    print(c['id'], c['beats'][0], '-', c['beats'][-1], len(c['text']), 'chars', '(spoken:', ', '.join(c.get('spoken', {})) + ')' if c.get('spoken') else '')
