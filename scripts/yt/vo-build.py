#!/usr/bin/env python3
"""Build a video's voiceover track and beat timings from its VO chunks.

    python3 scripts/yt/vo-build.py youtube/02_videos/<video> src/remotion/reels/<id>/script.ts public/audio/<id>-vo.mp3 [--wav out.wav]

Inputs (in <video>/voiceover/): chunks.json (chunk id → beats + text), chunks/<id>.mp3 (the takes),
asr-vosk.json (word-level recognition of each chunk; made here with Vosk when missing and $VOSK_MODEL
points at a model), assembly.json (lead-in, joins, extra silence after beats, silent beats).

1. Align the recognised words to the script words of each chunk (difflib on normalised tokens;
   unmatched words are interpolated between their matched neighbours).
2. Cut each chunk into beats at the pause between the last word of one beat and the first of the next.
3. Lay the beats end to end with the configured silences; write timings.json (beat start/end, first and
   last word, every word with absolute times) and the VO track (mp3, optionally wav for the mix).
Scenes read beat times from timings.json via timeline.ts, so moving a beat here moves the picture.
"""
import json, os, re, subprocess, sys, difflib

video, script_ts, out_mp3 = sys.argv[1], sys.argv[2], sys.argv[3]
out_wav = sys.argv[sys.argv.index('--wav') + 1] if '--wav' in sys.argv else None
vo_dir = os.path.join(video, 'voiceover')
chunks = json.load(open(os.path.join(vo_dir, 'chunks.json')))
cfg = json.load(open(os.path.join(vo_dir, 'assembly.json')))
beats = json.loads(re.search(r'SCRIPT_BEATS: readonly Beat\[\] = (\[.*?\]);', open(script_ts).read(), re.S).group(1))
by_n = {b['n']: b for b in beats}
SR = 48000

# ---- 1. recognition (cached) -------------------------------------------------------------------
asr_path = os.path.join(vo_dir, 'asr-vosk.json')
asr = json.load(open(asr_path)) if os.path.exists(asr_path) else {}
todo = [c for c in chunks if c['id'] not in asr]
if todo:
    import types
    sys.modules['srt'] = types.ModuleType('srt')
    import vosk
    vosk.SetLogLevel(-1)
    model = vosk.Model(os.environ['VOSK_MODEL'])
    for c in todo:
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(vo_dir, 'chunks', c['id'] + '.mp3'),
                              '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
        rec = vosk.KaldiRecognizer(model, 16000); rec.SetWords(True); words = []
        for p in range(0, len(pcm), 8000):
            if rec.AcceptWaveform(pcm[p:p + 8000]): words += json.loads(rec.Result()).get('result', [])
        words += json.loads(rec.FinalResult()).get('result', [])
        asr[c['id']] = [{'w': w['word'], 's': round(w['start'], 3), 'e': round(w['end'], 3)} for w in words]
    json.dump(asr, open(asr_path, 'w'), indent=0)

# ---- 2. align script words to recognised words --------------------------------------------------
# The recogniser spells some tokens letter by letter ("h t t p s"); merge those back into the
# script's spelling before matching. Each merged token keeps the start of its first letter and the end of its last.
MERGE = [(('h','t','t','p','s'),'https'), (('h','t','t','p'),'http'), (('w','w','w'),'www'), (('q','r'),'qr'),
         (('three','oh','one'),'301'), (('three','o','one'),'301'), (('three','zero','one'),'301'),
         (('d','n','s'),'dns'), (('u','r','l'),'url'), (('c','name'),'cname'), (('home','page'),'homepage'),
         (('reader','hub'),'redirhub'), (('redirect','hub'),'redirhub'), (('redder','hub'),'redirhub')]
def norm(w):
    w = w.lower().replace('\u2019', "'")
    return re.sub(r"[^a-z0-9']+", ' ', w).strip()
def merge_tokens(rec):
    toks = [dict(w=norm(r['w']), s=r['s'], e=r['e']) for r in rec]
    out = []; i = 0
    while i < len(toks):
        for seq, word in MERGE:
            if tuple(t['w'] for t in toks[i:i+len(seq)]) == seq:
                out.append(dict(w=word, s=toks[i]['s'], e=toks[i+len(seq)-1]['e'])); i += len(seq); break
        else:
            out.append(toks[i]); i += 1
    return out
def subtokens(word):
    return norm(word).split() or ['']

def dur(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]))

def align(chunk):
    """→ list of beats [{n, words:[{w,s,e}]}] with times relative to the chunk file."""
    script_words = []  # (beat n, word)
    spoken = chunk.get('spoken', {})  # what this take actually says, where the script has moved on
    for n in chunk['beats']:
        for w in spoken.get(str(n), by_n[n]['vo']).split():
            script_words.append((n, w))
    subs, owner = [], []
    for i, (_, w) in enumerate(script_words):
        for s in subtokens(w): subs.append(s); owner.append(i)
    rec = merge_tokens(asr[chunk['id']])
    rec_tokens = [r['w'] for r in rec]
    sm = difflib.SequenceMatcher(a=subs, b=rec_tokens, autojunk=False)
    start = [None] * len(script_words); end = [None] * len(script_words)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                o = owner[i1 + k]; r = rec[j1 + k]
                start[o] = r['s'] if start[o] is None else min(start[o], r['s'])
                end[o] = r['e'] if end[o] is None else max(end[o], r['e'])
        elif tag == 'replace' and (i2 - i1) == (j2 - j1):  # same count: likely mis-heard words, keep times
            for k in range(i2 - i1):
                o = owner[i1 + k]; r = rec[j1 + k]
                start[o] = r['s'] if start[o] is None else min(start[o], r['s'])
                end[o] = r['e'] if end[o] is None else max(end[o], r['e'])
    total = dur(os.path.join(vo_dir, 'chunks', chunk['id'] + '.mp3'))
    # interpolate unmatched words by character weight between matched neighbours
    n = len(script_words); i = 0
    matched = sum(1 for s in start if s is not None)
    while i < n:
        if start[i] is not None: i += 1; continue
        j = i
        while j < n and start[j] is None: j += 1
        t0 = end[i - 1] if i > 0 else max(0.0, (start[j] if j < n else total) - 0.0)
        t1 = start[j] if j < n else total - 0.25
        if i == 0: t0 = max(0.0, t1 - 0.32 * (j - i))
        weights = [len(script_words[k][1]) + 1 for k in range(i, j)]
        tot = sum(weights); at = t0
        for k, wt in zip(range(i, j), weights):
            start[k] = at; at += (t1 - t0) * wt / tot; end[k] = at
        i = j
    out = []
    for n_ in chunk['beats']:
        ws = [{'w': w, 's': round(start[k], 3), 'e': round(end[k], 3)} for k, (bn, w) in enumerate(script_words) if bn == n_]
        out.append({'n': n_, 'words': ws})
    return out, total, matched, len(script_words)

# ---- 3. cut into beats and lay out --------------------------------------------------------------
segments = []   # (chunk file, cut_from, cut_to, beat n)
report = []
for c in chunks:
    if not os.path.exists(os.path.join(vo_dir, 'chunks', c['id'] + '.mp3')):
        sys.exit(f"missing take {c['id']}.mp3 for beats {c['beats']}")
    bts, total, matched, nwords = align(c)
    report.append(f"{c['id']}: {matched}/{nwords} words matched")
    edges = [0.0]
    for a, b in zip(bts, bts[1:]):
        last_e, first_s = a['words'][-1]['e'], b['words'][0]['s']
        gap = first_s - last_e
        edges.append(last_e + max(0.08, min(gap * 0.5, 0.25)))  # cut inside the pause, closer to the end of the last word
    edges.append(total)
    for i, b in enumerate(bts):
        if b['n'] in c.get('skip', []):  # a newer take replaces this beat
            continue
        segments.append({'chunk': c['id'], 'from': edges[i], 'to': edges[i + 1], 'n': b['n'], 'words': b['words']})

timed = {}
t = cfg['leadIn']
prev_chunk = None
extra_after = {int(k): v for k, v in cfg['extraAfter'].items()}
silent = {int(k): v for k, v in cfg['silentBeats'].items()}
placed = []
for n in sorted(by_n):
    if n in silent:
        timed[n] = {'n': n, 'at': round(t, 3), 'end': round(t + silent[n], 3), 'voStart': None, 'voEnd': None, 'words': []}
        t += silent[n]; continue
    seg = next(s for s in segments if s['n'] == n)
    if prev_chunk and seg['chunk'] != prev_chunk: t += cfg['join']
    prev_chunk = seg['chunk']
    off = t - seg['from']
    words = [{'w': w['w'], 's': round(w['s'] + off, 3), 'e': round(w['e'] + off, 3)} for w in seg['words']]
    placed.append((seg, t))
    t += seg['to'] - seg['from']
    t += extra_after.get(n, 0)
    timed[n] = {'n': n, 'at': round(placed[-1][1], 3), 'end': None, 'voStart': words[0]['s'], 'voEnd': words[-1]['e'], 'words': words}
ns = sorted(timed)
for a, b in zip(ns, ns[1:]):
    if timed[a]['end'] is None: timed[a]['end'] = timed[b]['at']
TOTAL = timed[ns[-1]]['end']
out = {'_doc': 'GENERATED by scripts/yt/vo-build.py from voiceover/chunks + assembly.json. Beat start/end in seconds; a beat runs until the next starts. voStart/voEnd = first/last spoken word.',
       'total': TOTAL, 'beats': [timed[n] for n in ns]}
json.dump(out, open(os.path.join(vo_dir, 'timings.json'), 'w'), indent=1)

# ---- 4. render the track -----------------------------------------------------------------------
inputs, fc = [], []
files = sorted({s['chunk'] for s, _ in placed})
idx = {f: i for i, f in enumerate(files)}
for f in files: inputs += ['-i', os.path.join(vo_dir, 'chunks', f + '.mp3')]
labels = []
for k, (seg, at) in enumerate(placed):
    fc.append(f"[{idx[seg['chunk']]}:a]atrim={seg['from']:.3f}:{seg['to']:.3f},asetpts=PTS-STARTPTS,aresample={SR},"
              f"afade=t=in:d=0.01,afade=t=out:st={seg['to']-seg['from']-0.01:.3f}:d=0.01,adelay={int(at*1000)}|{int(at*1000)}[s{k}]")
    labels.append(f'[s{k}]')
fc.append(''.join(labels) + f"amix=inputs={len(labels)}:normalize=0:dropout_transition=0,apad=whole_dur={TOTAL:.3f}[out]")
tmp_wav = out_wav or (os.path.splitext(out_mp3)[0] + '.tmp.wav')
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', '[out]',
                       '-ac', '1', '-ar', str(SR), '-c:a', 'pcm_s24le', tmp_wav + '.raw.wav'])
# Studio chain: put back the top end the voice was rendered without, take the box out (voice_enhance.py).
subprocess.check_call([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voice_enhance.py'), tmp_wav + '.raw.wav', tmp_wav])
os.remove(tmp_wav + '.raw.wav')
# Master the voice: gentle compression, a static gain to the channel level, a true-peak ceiling.
# Static gain, not loudnorm's dynamic mode, so the read keeps its own dynamics.
VO_LUFS, VO_CEIL = -14.2, -2.2
comp = 'acompressor=threshold=-22dB:ratio=3:attack=6:release=140'
def lufs_of(path, af=''):
    err = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', (af + ',' if af else '') + 'ebur128', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', err)[-1])
gain = VO_LUFS - lufs_of(tmp_wav, comp)
for _ in range(3):  # the limiter takes some level back; a few passes converge on the target
    chain = f"{comp},volume={gain:.2f}dB,alimiter=limit={10 ** (VO_CEIL / 20):.4f}:attack=3:release=60:level=false"
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', tmp_wav, '-af', chain, '-c:a', 'pcm_s16le', tmp_wav + '.m.wav'])
    gain += VO_LUFS - lufs_of(tmp_wav + '.m.wav')
os.replace(tmp_wav + '.m.wav', tmp_wav)
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', tmp_wav, '-b:a', '160k', out_mp3])
if not out_wav: os.remove(tmp_wav)
print('\n'.join(report))
print(f"total {TOTAL:.2f}s · {len(ns)} beats → {os.path.join(vo_dir, 'timings.json')}, {out_mp3}")
