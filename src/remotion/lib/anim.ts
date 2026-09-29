/* Time-based animation helpers. Reels are written in seconds (not frames) so
   timings read like a storyboard; useTime() converts the current frame. */
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { CSSProperties } from 'react';

/** Seconds elapsed in the current <Sequence> (or the whole video at top level). */
export function useTime(): number {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return frame / fps;
}

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** Progress 0→1 of t across [a, b]. */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
/** Overshoot ease for "pop" entrances. */
export const easeBack = (x: number) => {
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
/** Decaying horizontal shake, in px, active during [a, a+d]. */
export const shake = (t: number, a: number, d: number, amp: number, speed = 70) =>
    t > a && t < a + d ? Math.sin((t - a) * speed) * amp * (1 - prog(t, a, a + d)) : 0;

/** Opacity + transform style. Hidden elements get visibility:hidden too. */
export function fx(o = 1, x = 0, y = 0, s = 1, r = 0): CSSProperties {
    return {
        opacity: o,
        visibility: o <= 0.001 ? 'hidden' : 'visible',
        transform: `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`,
    };
}

/** Fade-and-rise in over [a, a+d]; optional fade-out starting at b. */
export function rise(t: number, a: number, d = 0.45, dist = 40, b = 1e9, d2 = 0.3): CSSProperties {
    const k = easeOut(prog(t, a, a + d));
    const out = prog(t, b, b + d2);
    return fx(k * (1 - out), 0, (1 - k) * dist - out * 30);
}
