#!/usr/bin/env python3
"""Stand-ins for VO chunks that have no take yet, so the film can be built and timed before the
voice is finished.

    python3 scripts/yt/vo-placeholder.py youtube/02_videos/<video>

For every chunk in voiceover/chunks.json without voiceover/chunks/<id>.mp3, writes a silent
<id>.mp3 whose length follows the narrator's measured pace (from the takes that exist) and puts
evenly paced word times for it into asr-vosk.json, marked "placeholder". vo-build.py then lays
it out like a real take. When the real take arrives: drop it in chunks/, run this script again
(it removes the stand-in's recognition entry when the mp3 is no longer a stand-in), and rebuild.
"""
import json, os, re, subprocess, sys

video = sys.argv[1]
vo = os.path.join(video, 'voiceover')
chunks = json.load(open(os.path.join(vo, 'chunks.json')))
asr_path = os.path.join(vo, 'asr-vosk.json')
asr = json.load(open(asr_path)) if os.path.exists(asr_path) else {}
marks_path = os.path.join(vo, 'placeholders.json')
marks = set(json.load(open(marks_path))) if os.path.exists(marks_path) else set()

def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))

# A real take replaced a stand-in: forget the stand-in's fake recognition.
for cid in list(marks):
    p = os.path.join(vo, 'chunks', cid + '.mp3')
    if os.path.exists(p):
        size_marker = os.path.join(vo, 'chunks', cid + '.placeholder')
        if not os.path.exists(size_marker):
            asr.pop(cid, None); marks.discard(cid)

real = [c for c in chunks if c['id'] not in marks and os.path.exists(os.path.join(vo, 'chunks', c['id'] + '.mp3'))]
words = sum(len(c['text'].split()) for c in real)
secs = sum(dur(os.path.join(vo, 'chunks', c['id'] + '.mp3')) for c in real)
wps = words / secs if secs else 2.6
print(f'pace from {len(real)} real takes: {wps * 60:.0f} wpm')

for c in chunks:
    mp3 = os.path.join(vo, 'chunks', c['id'] + '.mp3')
    if os.path.exists(mp3) and c['id'] not in marks:
        continue
    t, out = 0.25, []
    for w in c['text'].split():
        d = max(0.12, len(re.sub(r'[^A-Za-z0-9]', '', w)) * 0.062 + 0.09) / (wps / 2.6)
        out.append({'w': re.sub(r"[^A-Za-z0-9']", '', w).lower() or w, 's': round(t, 3), 'e': round(t + d * 0.92, 3)})
        t += d
        if w.endswith(('.', '?', '!', ':')): t += 0.38
        elif w.endswith(','): t += 0.16
    total = t + 0.3
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', f'{total:.3f}', '-b:a', '64k', mp3])
    open(os.path.join(vo, 'chunks', c['id'] + '.placeholder'), 'w').write('silent stand-in; replace the mp3 with the real take, delete this file, re-run vo-placeholder.py\n')
    asr[c['id']] = out; marks.add(c['id'])
    print(f"{c['id']}: stand-in {total:.1f}s ({len(out)} words)")

json.dump(asr, open(asr_path, 'w'), indent=0)
json.dump(sorted(marks), open(marks_path, 'w'))
