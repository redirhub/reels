"""Synthesized instruments. All return mono numpy arrays at dsp.SR."""
import numpy as np

from dsp import SR, env, filt, midi, noise, rand, saw, tt


def kick():
    t = tt(0.45)
    f = 45 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.2)
    click = filt(noise(len(t)), "low", 5000) * np.exp(-t / 0.004) * 0.35
    return np.tanh((body + click) * 1.6)


def hat(open_=False):
    t = tt(0.3 if open_ else 0.08)
    return filt(noise(len(t)), "high", 7500) * env(t, 0.001, 0.12 if open_ else 0.025)


def shaker():
    t = tt(0.07)
    return filt(noise(len(t)), "band", [5000, 12000]) * env(t, 0.004, 0.022)


def clap():
    t = tt(0.35)
    bursts = sum(np.exp(-np.maximum(t - o, 0) / 0.006) * (t >= o) for o in (0, 0.011, 0.022))
    tail = env(t, 0.02, 0.11)
    return filt(noise(len(t)), "band", [900, 2600]) * np.maximum(bursts, tail)



def crash():
    t = tt(1.6)
    return filt(noise(len(t)), "high", 3500) * env(t, 0.002, 0.55)



def pad(notes, d, cutoff=1800):
    t = tt(d)
    l = np.zeros(len(t))
    r = np.zeros(len(t))
    for m in notes:
        f = midi(m)
        for cents, side in ((-8, "l"), (0, "b"), (8, "r")):
            v = saw(f * 2 ** (cents / 1200), t, rand())
            if side in ("l", "b"):
                l += v
            if side in ("r", "b"):
                r += v
    a = np.clip(t / 0.25, 0, 1) * np.clip((d - t) / 0.4, 0, 1)
    k = 0.3 / len(notes)
    return filt(l, "low", cutoff) * a * k, filt(r, "low", cutoff) * a * k




def bell(m, d=1.2):
    t = tt(d)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.15)
    return x * env(t, 0.002, 0.45)
