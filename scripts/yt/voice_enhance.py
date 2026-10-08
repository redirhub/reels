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

def main(inp, outp):
    x = load(inp)
    y = x + bwe(x)
    tmp = outp + '.pre.wav'
    save(tmp, y)
    chain = ('highpass=f=70:poles=2,'
             'equalizer=f=420:t=q:w=1.1:g=-3.5,'
             'equalizer=f=160:t=q:w=0.9:g=1.5,'
             'equalizer=f=3200:t=q:w=1.2:g=2,'
             'deesser=i=0.35:m=0.5:f=0.5:s=o')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', chain, '-ar', str(SR), '-c:a', 'pcm_s24le', outp], check=True)
    import os; os.remove(tmp)

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
