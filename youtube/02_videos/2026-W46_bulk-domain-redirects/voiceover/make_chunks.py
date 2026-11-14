#!/usr/bin/env python3
"""Write voiceover/chunks.json and src/remotion/reels/bulk-redirects/script.ts from script.md (v6).

    python3 youtube/02_videos/2026-W46_bulk-domain-redirects/voiceover/make_chunks.py

One take per beat (v6, Leo 2026-11-13: a failing beat is regenerated alone; vo-build.py tone-matches the takes). The
text sent to ElevenLabs has no
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
assert sorted(beats) == list(range(1, 36)), sorted(beats)

# Said as a person says them.
SAY = [('A 301,', 'A three-oh-one,'), ('its https?', 'its H T T P S?'), ("domain's www version", "domain's double-u double-u double-u version"),
       ('without the h.', 'without the H.')]
# "RedirHub" has no confirmed pronunciation (open-questions.md P-1). Beat 20 is also generated with this respelling,
# which stresses "redirect"; the take that Whisper hears as "RedirHub" or "redirect hub" is used, and Leo decides.
ALIAS = {20: ('RedirHub', 'Redir Hub')}  # 2026-11-14: "Redirect Hub" said redirect-hub (Leo); "Redir Hub" stresses re-DIR, like redirect
USE_ALIAS = True
def say(s):
    for a, b in SAY:
        s = s.replace(a, b)
    return s

# The key frame each beat plays over (keyframes.md); the visual note in script.ts.
FRAME = {1: 'w46-Notebook', 2: 'w46-Notebook', 3: 'w46-Northway', 4: 'w46-OneSite', 5: 'w46-Title', 6: 'w46-Renewals',
         7: 'w46-Accounts', 8: 'w46-Weight', 9: 'w46-TwoResults', 10: 'w46-TwoResults', 11: 'w46-Warning',
         12: 'w46-Silence', 13: 'w46-Door', 14: 'w46-Honest', 15: 'w46-Once', 16: 'w46-List', 17: 'w46-Columns',
         18: 'w46-Columns', 19: 'w46-Columns', 20: 'w46-Import', 21: 'w46-Fix', 22: 'w46-Fix, then the www row of w46-Review',
         23: 'w46-PointDNS', 24: 'w46-PointDNS', 25: 'w46-Padlocks', 26: 'w46-Knocks', 27: 'w46-Knocks', 28: 'w46-Knocks',
         29: 'w46-Price', 30: 'w46-Quiet', 31: 'w46-ByTag', 32: 'w46-Recap', 33: 'w46-YourNames', 34: 'w46-YourNames',
         35: 'w46-EndCard'}

TAKES = [(n, n) for n in range(1, 36)]
out = []
for k, (a, b) in enumerate(TAKES, 1):
    parts, spoken = [], {}
    for n in range(a, b + 1):
        sv = say(beats[n])
        if sv != beats[n]:
            spoken[str(n)] = sv.replace('three-oh-one', 'three oh one').replace('double-u', 'double u')
        parts.append(sv)
    text = ' '.join(parts)
    c = {'id': f'c{k:02d}', 'beats': list(range(a, b + 1)), 'text': text, 'words': len(text.split())}
    if spoken:
        c['spoken'] = spoken
    out.append(c)
    if a in ALIAS:  # the same beat, with the brand respelled; both takes are kept, the Whisper-passing one is used
        old, new = ALIAS[a]
        alt = {**c, 'id': f'c{k:02d}b', 'text': text.replace(old, new), 'alias': f'{old} -> {new}',
               'spoken': {str(a): text.replace(old, new)}}
        # 2026-11-14 (P-1): "Redir Hub" is said re-DIR-hub, the stress of "redirect"; the plain take stresses REA-der.
        # Whisper writes both as "Reader Hub" (it has no word "redir"), so the choice was made on syllable stress.
        (c if USE_ALIAS else alt)['unused'] = True
        out.append(alt)
json.dump(out, open(os.path.join(HERE, 'chunks.json'), 'w'), indent=2, ensure_ascii=False)

ts = [{'n': n, 'vo': beats[n], 'visual': FRAME[n]} for n in range(1, 36)]
open(os.path.join(ROOT, 'src/remotion/reels/bulk-redirects/script.ts'), 'w', encoding='utf8').write(
    "/* GENERATED from youtube/02_videos/2026-W46_bulk-domain-redirects/script.md (v6) by voiceover/make_chunks.py. One entry\n"
    "   per VO beat: the spoken line and the key frame it plays over. Don't edit here; edit the script and regenerate. */\n"
    "export type Beat = { n: number; vo: string; visual: string };\n"
    "export const SCRIPT_BEATS: readonly Beat[] = " + json.dumps(ts, ensure_ascii=False, indent=4) + ";\n")
print(f'{len(out)} takes, {sum(len(c["text"]) for c in out)} characters')
for c in out:
    print(c['id'], c['beats'][0], '-', c['beats'][-1], len(c['text']), 'chars', '(spoken:', ', '.join(c.get('spoken', {})) + ')' if c.get('spoken') else '')
