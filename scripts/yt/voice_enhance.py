#!/usr/bin/env python3
"""Make a band-limited TTS voice sound studio-recorded.

    python3 scripts/yt/voice_enhance.py in.wav out.wav

Why: the narrator (ElevenLabs "Emily") is rendered with nothing above ~8 kHz and a boxy
300-500 Hz build-up. That combination is what a phone call sounds like. Every model we tried
(multilingual v2, v4) gives the same ceiling, so it is the voice, not the settings.

What this does, in order:
1. Harmonic bandwidth extension (see bwe): the voice's own 3.8-7.8 kHz band generates its
   octave above, set 12 dB under the 4-6 kHz band. It follows the source syllable by syllable,
   so "s" and "t" get air and vowels barely change.
2. Tone: high-pass 70 Hz, -3.5 dB at 420 Hz (the box), +1.5 dB at 160 Hz (chest),
   +2 dB at 3.2 kHz (presence).
3. A de-esser on the new top end.
Loudness, compression and the true-peak ceiling are applied afterwards by vo-build.py.

A full-band studio voice (W44 round 3, ElevenLabs "Frankie") needs none of that: `--clean` is only the
70 Hz high-pass and a light de-esser. What such a voice does need is consistency between takes, which
`match_takes` gives (vo-build.py, assembly.json "match": true).
"""
import subprocess, sys
import numpy as np

SR = 48000

def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)

def save(p, x):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', p],
                   input=x.astype(np.float64).tobytes(), check=True)

def bwe(x, rel_db=-12.0):
    """Harmonic bandwidth extension. The 3.8-7.8 kHz band is full-wave rectified (which creates
    its second harmonic, coherent with the voice, at 7.6-15.6 kHz), the result is high-passed
    steeply at 7.6 kHz, rolled off above 14 kHz, and set so the new 8-11 kHz band sits rel_db
    under the voice's own 4-6 kHz band (a natural studio tilt; the full-band reference voice
    sits higher). Being driven by the source, it follows every syllable."""
    from scipy.signal import butter, sosfiltfilt
    band = sosfiltfilt(butter(6, [3800, 7800], 'bandpass', fs=SR, output='sos'), x)
    h = np.abs(band)
    h = sosfiltfilt(butter(8, 7600, 'highpass', fs=SR, output='sos'), h)
    h = sosfiltfilt(butter(2, 14000, 'lowpass', fs=SR, output='sos'), h)
    def band_db(y, lo, hi):
        Y = np.abs(np.fft.rfft(y)) ** 2; f = np.fft.rfftfreq(len(y), 1 / SR)
        return 10 * np.log10(Y[(f >= lo) & (f < hi)].mean() + 1e-20)
    g = 10 ** ((band_db(x, 4000, 6000) + rel_db - band_db(h, 8000, 11000)) / 20)
    return h * g

def top_band_db(x):
    """The 8-12 kHz band against 200-4000 Hz, voiced frames only. About -60 dB for a band-limited voice
    (nothing up there), about -20 dB for a full-band studio one."""
    N = 4096; fr = x[:len(x) // N * N].reshape(-1, N) * np.hanning(N)
    P = np.abs(np.fft.rfft(fr, axis=1)) ** 2; e = P.sum(1); P = P[e > np.percentile(e, 40)]
    f = np.fft.rfftfreq(N, 1 / SR); m = P.mean(0)
    return 10 * np.log10(m[(f >= 8000) & (f < 12000)].sum() / m[(f >= 200) & (f < 4000)].sum() + 1e-20)

def _profile(x, N=4096):
    """Long-term spectrum of the voiced frames (dB, smoothed to 1/3 octave) and their mean level (dB)."""
    fr = x[:len(x) // N * N].reshape(-1, N) * np.hanning(N)
    P = np.abs(np.fft.rfft(fr, axis=1)) ** 2; e = P.sum(1)
    voiced = (e > np.percentile(e, 40)) & (e > e.max() * 1e-4)
    m = 10 * np.log10(P[voiced].mean(0) + 1e-20)
    f = np.fft.rfftfreq(N, 1 / SR); sm = m.copy()
    for i in range(1, len(f)):
        sel = (f >= f[i] / 2 ** (1 / 6)) & (f <= f[i] * 2 ** (1 / 6))
        sm[i] = m[sel].mean()
    return sm, 10 * np.log10(e[voiced].mean())

def match_takes(xs, max_db=3.0, max_gain=4.0):
    """Make separately generated takes sound like one session: each take gets a smooth, linear-phase EQ
    (at most +-max_db, 90 Hz-14 kHz) that moves its long-term voiced spectrum onto the median of all takes,
    and a gain that brings its voiced level to the median level. A performance's own changes inside a take
    are untouched; only the take's overall colour and level move. Returns (matched takes, report lines)."""
    from scipy.signal import fftconvolve
    N = 4096; f = np.fft.rfftfreq(N, 1 / SR)
    profs = {k: _profile(x) for k, x in xs.items()}
    ref = np.median([p for p, _ in profs.values()], axis=0)
    lvl = np.median([l for _, l in profs.values()])
    band = (f >= 90) & (f <= 14000); mid = (f >= 300) & (f <= 3000)
    taper = np.clip(np.minimum((f - 60) / 30, (16000 - f) / 2000), 0, 1)
    out, rep = {}, []
    for k, x in xs.items():
        p, l = profs[k]
        corr = np.where(band, ref - p, 0.0)
        corr -= corr[mid].mean()                      # colour only; level is the gain below
        corr = np.clip(corr, -max_db, max_db) * taper
        h = np.fft.irfft(10 ** (corr / 20), N); h = np.roll(h, N // 2) * np.hanning(N)
        gain = float(np.clip(lvl - l, -max_gain, max_gain))
        y = fftconvolve(x, h)[N // 2:N // 2 + len(x)] * 10 ** (gain / 20)
        out[k] = y
        rep.append(f'{k}: EQ up to {np.abs(corr).max():.1f} dB, gain {gain:+.1f} dB')
    after = np.array([_profile(y)[0][band] for y in out.values()])
    before = np.array([p[band] for p, _ in profs.values()])
    rep.append(f'take-to-take spread (90 Hz-14 kHz, dB): {before.std(0).mean():.2f} -> {after.std(0).mean():.2f}')
    return out, rep

def main(inp, outp, extend=True, clean=False):
    x = load(inp)
    y = x + bwe(x) if extend else x
    tmp = outp + '.pre.wav'
    save(tmp, y)
    chain = ('highpass=f=70:poles=2,deesser=i=0.2:m=0.5:f=0.5:s=o' if clean else
             'highpass=f=70:poles=2,'
             'equalizer=f=420:t=q:w=1.1:g=-3.5,'
             'equalizer=f=160:t=q:w=0.9:g=1.5,'
             'equalizer=f=3200:t=q:w=1.2:g=2,'
             'deesser=i=0.35:m=0.5:f=0.5:s=o')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', chain, '-ar', str(SR), '-c:a', 'pcm_s24le', outp], check=True)
    import os; os.remove(tmp)

if __name__ == '__main__':
    # --bwe-only in out: just the bandwidth extension (vo-build.py runs it per take that has no
    #   AudioSR version); --no-bwe in out: tone and de-esser only (the top end is already there);
    #   --clean in out: a full-band studio voice, high-pass and a light de-esser only.
    if sys.argv[1] == '--clean':
        main(sys.argv[2], sys.argv[3], extend=False, clean=True)
    elif sys.argv[1] == '--bwe-only':
        x = load(sys.argv[2]); save(sys.argv[3], x + bwe(x))
    elif sys.argv[1] == '--no-bwe':
        main(sys.argv[2], sys.argv[3], extend=False)
    else:
        main(sys.argv[1], sys.argv[2])
