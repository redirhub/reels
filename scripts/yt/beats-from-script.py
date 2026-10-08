#!/usr/bin/env python3
"""Regenerate src/remotion/reels/<id>/script.ts from a video's script.md.

    python3 scripts/yt/beats-from-script.py youtube/02_videos/2026-W41_redirect-domain/script.md src/remotion/reels/redirect-domain/script.ts

The script is the source of truth (rule: the script dictates the video). Each `**N.** VO`
line followed by a `[visual]` line becomes one beat. Stage notes in *(...)* and ★ marks are dropped.
"""
import json, re, sys

src, dst = sys.argv[1], sys.argv[2]
t = open(src, encoding='utf8').read()
body = t.split('## ACT A')[1].split('## Notes to self')[0]
beats = []
for m in re.finditer(r'\*\*(\d+)\.\*\*(.*?)\n`\[(.*?)\]`', body, re.S):
    vo = re.sub(r'\*\(.*?\)\*', '', m.group(2)).replace('★', '').strip()
    beats.append({'n': int(m.group(1)), 'vo': re.sub(r'\s+', ' ', vo), 'visual': re.sub(r'\s+', ' ', m.group(3)).strip()})
out = ("/* GENERATED from %s by scripts/yt/beats-from-script.py. One entry per VO beat: the spoken\n"
       "   line and the visual note. Don't edit here; edit the script and regenerate. */\n"
       "export type Beat = { n: number; vo: string; visual: string };\n"
       "export const SCRIPT_BEATS: readonly Beat[] = %s;\n") % (src, json.dumps(beats, ensure_ascii=False, indent=4))
open(dst, 'w', encoding='utf8').write(out)
print(f'{len(beats)} beats → {dst}')
