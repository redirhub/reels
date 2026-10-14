#!/usr/bin/env python3
"""Give a band-limited TTS take a real top octave with AudioSR, keeping the voice itself untouched.

    AUDIOSR_PYTHON=/path/to/venv/bin/python python3 scripts/yt/voice_sr.py youtube/02_videos/<video> [chunk ids...]

Why: the narrator (ElevenLabs "Emily", zHGX9VSXpW8cGSDRCqy0) is rendered with nothing above ~8 kHz
on every model (multilingual v2, v3, v4), which is what makes her sound like a phone call. W41 put an
octave back with harmonic bandwidth extension (voice_enhance.py). This goes further: AudioSR
(Liu et al. 2023, "speech" model, a latent diffusion super-resolution model) generates the missing
8–24 kHz band from the take, and only that band is kept:

  out = original below 7.5 kHz  +  AudioSR above 7.5 kHz (level-matched at 6–7.4 kHz, gated to the voice)

so every word, pitch and timing is the original take; AudioSR only adds air and consonant detail.
Writes voiceover/chunks-sr/<id>.wav (48 kHz, 24-bit), which vo-build.py prefers over the mp3 and then
skips its own harmonic extension. Run once per take (CPU: ~25 s per second of audio); the outputs are
committed so CI never needs AudioSR. Skips takes whose wav is newer than the mp3 and stand-ins.

AudioSR needs torch; it lives in its own venv (pip: torch torchaudio torchvision torchcodec from the CPU
index, then `audiosr --no-deps` + numpy scipy librosa soundfile einops tqdm ftfy timm transformers
huggingface_hub chardet unidecode torchlibrosa progressbar pandas phonemizer matplotlib).
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from scipy.signal import butter, sosfiltfilt, correlate

SR = 48000
XOVER = 7500.0
PIECE, OVERLAP = 10.0, 0.6

RUNNER = r'''
import sys, warnings; warnings.filterwarnings("ignore")
import torch, numpy as np, soundfile as sf
from audiosr import build_model, super_resolution
torch.set_num_threads(int(sys.argv[1]))
m = build_model(model_name="speech", device="cpu")
for inp in sys.argv[2:]:
    w = super_resolution(m, inp, seed=42, guidance_scale=3.5, ddim_steps=50, latent_t_per_second=12.8)
    sf.write(inp[:-4] + ".sr.wav", np.asarray(w).squeeze(), 48000)
    print("done", inp, flush=True)
'''

def load(p, sr=SR):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f64le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float64).copy()

def save(p, x):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', p], input=x.tobytes(), check=True)

def band(x, lo, hi, order=4):
    return sosfiltfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)

def env(x, win=0.02):
    n = int(SR * win); return np.convolve(np.abs(x), np.ones(n) / n, 'same')

def merge(orig, sr_pieces, starts):
    """Overlap-add the SR pieces (aligned), keep only their top band, gate it to the voice."""
    top = np.zeros(len(orig)); wsum = np.zeros(len(orig))
    for s, start in zip(sr_pieces, starts):
        seg = orig[start:start + len(s)]
        a, b = band(seg, 1000, 4000), band(s[:len(seg)], 1000, 4000)
        c = correlate(b, a, mode='full'); lag = int(np.argmax(c) - (len(a) - 1))
        lag = lag if abs(lag) < 480 else 0
        s = s[lag:] if lag >= 0 else np.concatenate([np.zeros(-lag), s])
        s = np.pad(s, (0, max(0, len(seg) - len(s))))[:len(seg)]
        w = np.ones(len(seg)); f = int(OVERLAP * SR)
        if start > 0: w[:f] = np.linspace(0, 1, f)
        if start + len(seg) < len(orig): w[-f:] = np.linspace(1, 0, f)
        top[start:start + len(seg)] += sosfiltfilt(butter(8, XOVER, 'highpass', fs=SR, output='sos'), s) * w
        wsum[start:start + len(seg)] += w
    top /= np.maximum(wsum, 1e-6)
    # Level, in two bands so the new octave falls off the way speech does:
    #   7.5–10 kHz continues the original's 6–7.4 kHz level, 3 dB under it;
    #   above 10 kHz sits 9 dB under it (AudioSR can come out bright up there, which reads as hiss).
    # Each gain is measured on the SR output itself and capped at ×2.
    ref = np.mean(band(orig, 6000, 7400) ** 2)
    mid = sosfiltfilt(butter(8, 10000, 'lowpass', fs=SR, output='sos'), top)
    air = top - mid
    def fit(x, lo, hi, db):
        return min(np.sqrt(ref / max(np.mean(band(x, lo, hi) ** 2), 1e-12)) * 10 ** (db / 20), 2.0)
    top = mid * fit(mid, 7600, 9800, -3) + air * fit(air, 10200, 14000, -9)
    # Gate: follow the original voice (2–7 kHz envelope), so pauses stay silent.
    e = env(band(orig, 2000, 7000), 0.012); gate = np.clip(e / (e.max() * 0.04), 0, 1) ** 1.5
    gate = np.convolve(gate, np.ones(240) / 240, 'same')
    lo = sosfiltfilt(butter(8, XOVER, 'lowpass', fs=SR, output='sos'), orig)
    return lo + top * gate

def main():
    args = sys.argv[1:]
    # --pieces DIR: re-merge from AudioSR outputs already on disk (<id>-NN.sr.wav), without running the model again.
    pieces_dir = None
    if '--pieces' in args:
        i = args.index('--pieces'); pieces_dir = args[i + 1]; del args[i:i + 2]
    video = args[0]; only = set(args[1:])
    vo = os.path.join(video, 'voiceover'); out_dir = os.path.join(vo, 'chunks-sr'); os.makedirs(out_dir, exist_ok=True)
    stand_ins = set(json.load(open(os.path.join(vo, 'placeholders.json')))) if os.path.exists(os.path.join(vo, 'placeholders.json')) else set()
    py = os.environ.get('AUDIOSR_PYTHON')
    if not py and not pieces_dir: sys.exit('set AUDIOSR_PYTHON to the python of the AudioSR venv')
    todo = []
    for c in json.load(open(os.path.join(vo, 'chunks.json'))):
        cid = c['id']; mp3 = os.path.join(vo, 'chunks', cid + '.mp3'); wav = os.path.join(out_dir, cid + '.wav')
        if (only and cid not in only) or cid in stand_ins or not os.path.exists(mp3): continue
        if not pieces_dir and os.path.exists(wav) and os.path.getmtime(wav) > os.path.getmtime(mp3): continue
        todo.append(cid)
    if not todo: print('nothing to do'); return
    tmp = pieces_dir or tempfile.mkdtemp(prefix='voice-sr-')
    pieces = {}
    for cid in todo:
        x = load(os.path.join(vo, 'chunks', cid + '.mp3'))
        step = int((PIECE - OVERLAP) * SR); starts = list(range(0, max(1, len(x) - int(OVERLAP * SR)), step))
        files = []
        for i, st in enumerate(starts):
            p = os.path.join(tmp, f'{cid}-{i:02d}.wav'); files.append(p)
            if not pieces_dir: save(p, x[st:st + int(PIECE * SR)])
        pieces[cid] = (x, starts, files)
    allf = [f for v in pieces.values() for f in v[2]]
    print(f'{"Re-merging" if pieces_dir else "AudioSR on"} {len(allf)} pieces from {len(todo)} takes…', flush=True)
    if not pieces_dir: subprocess.run([py, '-c', RUNNER, str(os.cpu_count() or 4), *allf], check=True)
    for cid, (x, starts, files) in pieces.items():
        srs = [load(f[:-4] + '.sr.wav') for f in files]
        y = merge(x, srs, starts)
        save(os.path.join(out_dir, cid + '.wav'), y)
        print(f'{cid}: {len(x) / SR:.1f}s → chunks-sr/{cid}.wav', flush=True)

if __name__ == '__main__':
    main()
