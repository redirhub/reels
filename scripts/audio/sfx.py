"""One-shot sound effects, placed on on-screen events by the Sfx component."""
import numpy as np

from dsp import SR, env, filt, master, noise, rand, reverb, tt
from instruments import bell, kick, pad


def impact():
    t = tt(1.8)
    f = 38 + 60 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.002, 0.5)
    crack = filt(noise(len(t)), "low", 3500) * env(t, 0.001, 0.09)
    x = np.tanh((boom + 0.8 * crack) * 1.8)
    st = np.stack([x, x])
    return master(st + reverb(st, 1.6, 0.5, 3000) * 3, -2)


def whoosh(d=0.7):
    t = tt(d)
    fc = 400 + 5000 * np.sin(np.pi * t / d) ** 2
    n = noise(len(t))
    out = np.zeros(len(t))
    # Short blocks with their own band-pass give a sweeping filter.
    step = 1200
    for i in range(0, len(t), step):
        seg = n[max(0, i - 400) : i + step]
        f = fc[i]
        y = filt(seg, "band", [f * 0.6, min(f * 1.6, SR / 2 - 100)])
        out[i : i + step] = y[-len(out[i : i + step]) :]
    out *= np.sin(np.pi * t / d) ** 1.5
    pan = t / d
    return master(np.stack([out * np.cos(pan * np.pi / 2), out * np.sin(pan * np.pi / 2)]), -4)


def riser(d=1.0):
    t = tt(d)
    f = 200 * 2 ** (3 * t / d)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    hiss = filt(noise(len(t)), "high", 2000) * 0.5
    x = (tone + hiss) * (t / d) ** 2
    return master(np.stack([x, np.roll(x, 240)]), -5)


def click():
    t = tt(0.06)
    x = filt(noise(len(t)), "band", [1800, 6000]) * np.exp(-t / 0.004)
    x += 0.5 * filt(noise(len(t)), "band", [1500, 4000]) * np.exp(-np.maximum(t - 0.03, 0) / 0.003) * (t > 0.03)
    return master(np.stack([x, x]), -8)


def key():
    t = tt(0.05)
    x = filt(noise(len(t)), "band", [2500, 8000]) * np.exp(-t / 0.006)
    x += 0.4 * np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.01)
    return master(np.stack([x, x]), -14)


def typing(duration=1.55, ticks=13):
    """A burst of keystrokes as one file (one audio element instead of one per key)."""
    out = np.zeros((2, int((duration + 0.1) * SR)))
    for i in range(ticks):
        k = key() * (0.8 + 0.2 * rand())
        at = int(i * duration / ticks * SR)
        out[:, at : at + k.shape[1]] += k
    return out


def alert():
    x = np.zeros(int(0.9 * SR))
    for at, m in ((0, 81), (0.14, 76)):
        b = bell(m, 0.7)
        i = int(at * SR)
        x[i : i + len(b)] += b
    st = np.stack([x, x])
    return master(st + reverb(st, 1.0, 0.3), -7)


def success():
    x = np.zeros(int(1.3 * SR))
    for at, m in ((0, 76), (0.09, 79), (0.18, 84)):
        b = bell(m, 1.0)
        i = int(at * SR)
        x[i : i + len(b)] += b
    st = np.stack([x, x])
    return master(st + reverb(st, 1.4, 0.4), -5)


def stinger():
    d = 3.0
    l, r = pad([48, 60, 64, 67, 71, 74], d, cutoff=3200)
    t = tt(d)
    hitk = np.zeros(len(t))
    kk = kick()
    hitk[: len(kk)] = kk
    bell_ = np.zeros(len(t))
    for at, m in ((0, 84), (0.12, 88), (0.24, 91)):
        b = bell(m, 1.4)
        i = int(at * SR)
        bell_[i : i + len(b)] += b * 0.25
    st = np.stack([l * 6 + hitk * 0.8 + bell_, r * 6 + hitk * 0.8 + bell_])
    st *= np.clip((d - t) / 1.2, 0, 1)
    return master(st + reverb(st, 2.2, 0.8), -2)


ALL = {
    "impact": impact, "whoosh": whoosh, "riser": riser, "click": click, "key": key,
    "typing": typing, "alert": alert, "success": success, "stinger": stinger,
}
