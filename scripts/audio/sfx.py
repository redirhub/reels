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


def error():
    """Dry digital error: a short low thud under a clipped two-step square blip. No tail."""
    t = tt(0.32)
    f = 70 + 90 * np.exp(-t / 0.03)
    thud = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.08)
    sq = np.sign(np.sin(2 * np.pi * np.where(t < 0.07, 330, 247) * t))
    blip = filt(sq, "low", 2400) * env(t, 0.001, 0.06, hold=0.1) * (t < 0.2)
    x = np.tanh((thud * 1.2 + blip * 0.35) * 1.5)
    return master(np.stack([x, x]), -2)


def _swish(left_to_right):
    """Soft close swish, like a card sliding over felt: band-limited noise whose band rises
    and whose pan follows the direction of the move. No reverb tail."""
    d = 0.34
    t = tt(d)
    n = noise(len(t))
    out = np.zeros(len(t))
    step = 600
    for i in range(0, len(t), step):
        f = 700 + 2100 * (i / len(t)) ** 0.8
        seg = n[max(0, i - 300): i + step]
        y = filt(seg, "band", [f * 0.55, min(f * 1.7, SR / 2 - 100)])
        out[i: i + step] = y[-len(out[i: i + step]):]
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2 * np.exp(-t / 0.22)
    out *= env
    pan = t / d if left_to_right else 1 - t / d
    pan = 0.25 + 0.5 * pan
    return master(np.stack([out * np.cos(pan * np.pi / 2), out * np.sin(pan * np.pi / 2)]), -5)


def swish_r():
    return _swish(True)


def swish_l():
    return _swish(False)


def snap():
    """Magnetic snap: a fast downward zip into a tight low thump and a bright click."""
    t = tt(0.5)
    zip_ = np.sin(2 * np.pi * np.cumsum(1800 * np.exp(-t / 0.012) + 120) / SR) * env(t, 0.0005, 0.02)
    thump = np.sin(2 * np.pi * np.cumsum(55 + 140 * np.exp(-t / 0.02)) / SR) * env(t, 0.001, 0.09)
    clk = filt(noise(len(t)), "band", [2500, 7000]) * np.exp(-t / 0.0025)
    ring = np.sin(2 * np.pi * 1320 * t) * env(t, 0.001, 0.07) * 0.12
    x = np.tanh((zip_ * 0.6 + thump * 1.3 + clk * 0.8 + ring) * 1.6)
    st = np.stack([x, x])
    return master(st + reverb(st, 0.5, 0.12, 5000) * 1.5, -1.5)


ALL = {
    "impact": impact, "whoosh": whoosh, "riser": riser, "click": click, "key": key,
    "typing": typing, "alert": alert, "success": success, "stinger": stinger,
    "error": error, "swish_r": swish_r, "swish_l": swish_l, "snap": snap,
}
