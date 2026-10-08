#!/usr/bin/env python3
"""Build a video's music bed: fit a track to the film, duck it under the voice, prove it stays under.

    python3 scripts/yt/bed-build.py <video dir> <reel id>

Reads <video>/bed.json:
    {
      "source": "youtube/01_library/audio/music/<file>.mp3" | "generated",   # generated = public/audio/<id>-beat.mp3 (npm run audio)
      "start": 0,            # seconds into the track to begin
      "speech": -26,         # bed level under speech, LUFS (short-term)
      "gaps": -20,           # bed level in pauses longer than 0.8 s, LUFS
      "fadeIn": 1.5, "fadeOut": 3.0
    }
and the voice from <video>/voiceover/timings.json + public/audio/<id>-vo.mp3.
Writes public/audio/<id>-bed.mp3 (played at volume 1; all gain is baked in here).

The rule it enforces (Leo: "never raise the music louder than the voiceover"):
  - while she speaks, the bed's momentary loudness stays at least 10 LU under hers;
  - everywhere, even in pauses, the bed stays at least 8 LU under her integrated level.
The build fails if either is broken, so a louder track cannot slip in.
A track shorter than the film loops with a 2 s crossfade.
"""
import json, os, re, subprocess, sys
import numpy as np

video, rid = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cfg = json.load(open(os.path.join(video, 'bed.json')))
tim = json.load(open(os.path.join(video, 'voiceover', 'timings.json')))
total = float(tim['total'])
total = float(np.ceil(total))
SR = 48000
vo = os.path.join(root, 'public', 'audio', f'{rid}-vo.mp3')
src = os.path.join(root, 'public', 'audio', f'{rid}-beat.mp3') if cfg['source'] == 'generated' else os.path.join(root, cfg['source'])
out = os.path.join(root, 'public', 'audio', f'{rid}-bed.mp3')

def load(p, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).T.astype(np.float64)

def momentary(x, ch):
    """Momentary loudness (400 ms, LUFS) every 100 ms, via ffmpeg's EBU R128 meter."""
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f64le', '-ar', str(SR), '-ac', str(ch), '-i', '-', '-af',
                        'ebur128=metadata=1,ametadata=print:key=lavfi.r128.M', '-f', 'null', '-'],
                       input=np.ascontiguousarray(x.T).tobytes(), capture_output=True)
    vals = [float(v) for v in re.findall(r'lavfi\.r128\.M=(-?(?:\d+(?:\.\d+)?|inf|nan))', p.stdout.decode() + p.stderr.decode())]
    vals = [v if np.isfinite(v) else -120.0 for v in vals]
    return np.array(vals)

def integrated(x, ch):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f64le', '-ar', str(SR), '-ac', str(ch), '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=np.ascontiguousarray(x.T).tobytes(), capture_output=True)
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p.stderr.decode())[-1])

# 1. fit the track
m = load(src)
m = m[:, int(cfg.get('start', 0) * SR):]
need = int(total * SR)
xf = int(2.0 * SR)
while m.shape[1] < need:
    ramp = np.linspace(0, 1, xf)
    joined = m[:, -xf:] * (1 - ramp) + m[:, :xf] * ramp
    m = np.concatenate([m[:, :-xf], joined, m[:, xf:]], axis=1)
m = m[:, :need]
t = np.arange(need) / SR
m *= np.clip(t / cfg.get('fadeIn', 1.5), 0, 1) * np.clip((total - t) / cfg.get('fadeOut', 3.0), 0, 1)

# 2. ducking envelope from the spoken words (pre-roll 0.3 s, release 0.9 s; gaps under 0.8 s stay ducked)
speech = np.zeros(need, bool)
spans = []
for b in tim['beats']:
    for w in b['words']:
        spans.append((w['s'] - 0.3, w['e'] + 0.9))   # hold the duck through the word's tail
spans.sort()
merged = []
for s, e in spans:
    if merged and s - merged[-1][1] < 0.8:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])
for s, e in merged:
    speech[max(0, int(s * SR)):min(need, int(e * SR))] = True

m_lufs = integrated(m, 2)                           # the fitted track's own level
g_speech = 10 ** ((cfg['speech'] - m_lufs) / 20)
g_gap = 10 ** ((cfg['gaps'] - m_lufs) / 20)
target = np.where(speech, g_speech, g_gap)
# smooth the gain: 0.35 s ramps, no jumps
k = int(0.35 * SR)
kern = np.hanning(2 * k + 1); kern /= kern.sum()
env = np.convolve(np.pad(target, k, mode='edge'), kern, mode='valid')
env = np.minimum(env, np.where(speech, g_speech, np.inf))  # the ramp never lifts the bed while she speaks
bed = m * env

# 3. prove it stays under the voice
v = load(vo, 1)[:, :need]
if v.shape[1] < need:
    v = np.pad(v, ((0, 0), (0, need - v.shape[1])))
vI = integrated(v, 1)
bM, vM = momentary(bed, 2), momentary(v, 1)
n = min(len(bM), len(vM))
bM, vM = bM[:n], vM[:n]
talking = vM > vI - 10
gap_speech = np.min(vM[talking] - bM[talking]) if talking.any() else np.inf
over_all = np.max(bM) - vI
print(f"voice {vI:.1f} LUFS · bed {integrated(bed, 2):.1f} LUFS · while speaking the bed is >= {gap_speech:.1f} LU under her · bed peak momentary {over_all:+.1f} LU vs her integrated")
if gap_speech < 10 or over_all > -8:
    sys.exit('FAIL: the music comes too close to the voice. Lower "speech"/"gaps" in bed.json.')

subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f64le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', out],
               input=np.ascontiguousarray(bed.T).tobytes(), check=True)
print('→', os.path.relpath(out, root), f'({total:.0f} s, source: {cfg["source"]})')
