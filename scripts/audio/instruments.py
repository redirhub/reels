"""Synthesized instruments. All return mono numpy arrays at dsp.SR."""
import numpy as np

from dsp import SR, env, filt, midi, noise, rand, release, saw, tt


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


def rim():
    """Short woody click (clave / rim) for syncopated percussion."""
    t = tt(0.06)
    tone = np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.012)
    return tone + 0.4 * filt(noise(len(t)), "band", [1800, 4000]) * np.exp(-t / 0.006)


def crash():
    t = tt(1.6)
    return filt(noise(len(t)), "high", 3500) * env(t, 0.002, 0.55)


def bass(m, d):
    t = tt(d)
    f = midi(m)
    x = 0.6 * saw(f, t) + 0.4 * saw(f * 1.004, t, 0.3)
    x = filt(x, "low", 520) + 0.7 * np.sin(2 * np.pi * f * t)
    return release(x * env(t, 0.004, 0.35, hold=0.02), 0.02)


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


def pluck(m, d=0.35):
    t = tt(d)
    f = midi(m)
    x = saw(f, t) + 0.5 * np.sign(np.sin(2 * np.pi * f * t))
    bright = filt(x, "low", 3800) * np.exp(-t / 0.045)
    body = filt(x, "low", 1100) * np.exp(-t / 0.22)
    return release((bright * 0.6 + body) * np.clip(t / 0.002, 0, 1), 0.02)


def stab(notes, d=0.22):
    """Short chord hit built from plucks: the bright, happy element of the beat."""
    return sum(pluck(m, d) for m in notes) / len(notes)


def bell(m, d=1.2):
    t = tt(d)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.15)
    return x * env(t, 0.002, 0.45)
