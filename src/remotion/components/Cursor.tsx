/* Mouse pointer that glides between keyframes and shows click ripples. */
import { clamp, easeInOut, easeOut, fx, lerp, prog } from '../lib/anim';

/** [time (s), x, y] — x/y is the pointer tip in composition pixels. */
export type CursorKey = readonly [number, number, number];

export function cursorAt(keys: readonly CursorKey[], t: number): [number, number] {
    if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
    for (let i = 1; i < keys.length; i++) {
        if (t <= keys[i][0]) {
            const [t0, x0, y0] = keys[i - 1];
            const [t1, x1, y1] = keys[i];
            const k = easeInOut(prog(t, t0, t1));
            return [lerp(x0, x1, k), lerp(y0, y1, k)];
        }
    }
    const last = keys[keys.length - 1];
    return [last[1], last[2]];
}

export function Cursor({ t, keys, clicks, show, hide }: {
    t: number; keys: readonly CursorKey[]; clicks: readonly number[]; show: number; hide: number;
}) {
    const [x, y] = cursorAt(keys, t);
    const visible = clamp(prog(t, show, show + 0.3)) * (1 - prog(t, hide, hide + 0.3));
    let press = 1;
    for (const c of clicks) {
        const d = Math.abs(t - c);
        if (d < 0.12) press = Math.min(press, 1 - (1 - d / 0.12) * 0.18);
    }
    const active = clicks.find((c) => t >= c && t < c + 0.45);
    const rp = active === undefined ? 0 : prog(t, active, active + 0.45);
    const [rx, ry] = active === undefined ? [0, 0] : cursorAt(keys, active);
    return (
        <>
            <div style={{
                position: 'absolute', left: rx, top: ry, width: 120, height: 120, margin: '-60px 0 0 -60px', borderRadius: '50%',
                background: 'rgba(28,109,182,.35)', zIndex: 49, ...fx(active === undefined ? 0 : 1 - rp, 0, 0, lerp(0.2, 1.2, easeOut(rp))),
            }} />
            <svg viewBox="0 0 32 32" style={{ position: 'absolute', left: 0, top: 0, width: 64, height: 64, zIndex: 50, ...fx(visible, x - 12, y - 6, press) }}>
                <path d="M6 3l19 12.5-8.2 1.6 4.8 9.6-3.6 1.8-4.8-9.7L6 25z" fill="#101828" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        </>
    );
}
