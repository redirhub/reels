/* Pieces of the EZMarketing story: the on-screen text column, the caption, the redirect line,
   taps and the chat bubble. Motion rules from W43: everything moves on transforms (sub-pixel smooth,
   own compositor layer), fades ease in and out from rest, and nothing appears or leaves in one frame. */
import type { CSSProperties, ReactNode } from 'react';
import { useVideoConfig } from 'remotion';
import { font, yt } from '../../brand/tokens';
import { minHold } from '../../components/OnScreenText';
import { clamp, easeOut, prog } from '../../lib/anim';

/** Smoothstep: starts and ends at rest. */
export const smooth = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
/** A transform that stays sub-pixel (Chrome snaps a plain 2D translate of text to whole pixels). */
export const T3 = (x = 0, y = 0, s = 1, r = 0) => `translate3d(${x}px, ${y}px, 0) scale(${s}) rotate(${r + 0.02}deg)`;
export function f(o = 1, x = 0, y = 0, s = 1, r = 0): CSSProperties {
    return { opacity: o, visibility: o <= 0.001 ? 'hidden' : 'visible', transform: T3(x, y, s, r), willChange: 'transform, opacity' };
}
/** Visible across [a, b]: eases in over `din`, out over `dout` (both inside the window). */
export const env = (t: number, a: number, b: number, din = 0.35, dout = 0.3) => smooth(prog(t, a, a + din)) * (1 - smooth(prog(t, b - dout, b)));

/** The social safe band (Reels/Shorts UI covers the top ~14% and the bottom ~22%), with an 80 px gutter. */
export const SAFE = { top: 260, bottom: 1500, x: 80, w: 920 } as const;
/** Three zones down the frame: the on-screen text, the picture, the caption. */
export const Z = { card: 300, picTop: 540, picBottom: 1230, capBottom: 1480 } as const;

/** Throws when on-screen text would hold less than the rule (1 s, or words ÷ 3 + 1 s). */
export function assertHold(text: string, from: number, until: number) {
    if (until - from < minHold(text) - 1e-6) throw new Error(`"${text}" holds ${(until - from).toFixed(2)}s; the rule is ${minHold(text).toFixed(2)}s.`);
}

/** The on-screen text column: one idea per screen, ≤ 6 words, held by the rule. */
export function Card({ t, from, until, text, children, size = 88, color = yt.ink }: {
    t: number; from: number; until: number; text: string; children?: ReactNode; size?: number; color?: string;
}) {
    assertHold(text, from, until);
    const o = env(t, from, until, 0.4, 0.3);
    return (
        <div style={{
            position: 'absolute', left: SAFE.x, width: SAFE.w, top: Z.card, fontFamily: font.display, fontSize: size, fontWeight: 800,
            letterSpacing: '-.035em', lineHeight: 1.06, color, ...f(o, 0, (1 - easeOut(prog(t, from, from + 0.5))) * 24),
        }}>{children ?? text}</div>
    );
}

/** The caption (the script line), bottom of the safe band, white, brand font Medium. */
export function Caption({ t, text, from, until, backing = 0 }: {
    t: number; text: string; from: number; until: number;
    /** 0–1: a dark backing behind the words, for light and teal rooms (white text stays readable). */
    backing?: number;
}) {
    const o = env(t, from, until, 0.25, 0.25);
    return (
        <div style={{
            position: 'absolute', left: SAFE.x, width: SAFE.w, bottom: 1920 - Z.capBottom, fontFamily: font.display, fontSize: 50, fontWeight: 500,
            lineHeight: 1.36, letterSpacing: '-.01em', color: '#FFFFFF', textShadow: `0 2px 16px rgba(0,0,0,${0.45 * (1 - backing)})`, ...f(o, 0, (1 - smooth(prog(t, from, from + 0.3))) * 10),
        }}>
            <span style={{ background: `rgba(11,20,38,${(0.84 * backing).toFixed(3)})`, borderRadius: 14, padding: '3px 16px', marginLeft: -16, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{text}</span>
        </div>
    );
}

export type Pt = readonly [number, number];
function quad(a: Pt, b: Pt, bend: number) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    return [mx - dy * bend, my + dx * bend] as Pt;
}
const at = (a: Pt, c: Pt, b: Pt, k: number): Pt => {
    const u = 1 - k;
    return [u * u * a[0] + 2 * u * k * c[0] + k * k * b[0], u * u * a[1] + 2 * u * k * c[1] + k * k * b[1]];
};

/** A line drawn from a to b. A RedirHub redirect goes blue → teal; anything else (the old
    forwarding) is a muted grey. `progress` 0–1 draws it, with an arrow head at the tip. */
export function Line({ from, to, progress, kind = 'redirect', bend = 0.15, width = 6, opacity = 1, id }: {
    from: Pt; to: Pt; progress: number; kind?: 'redirect' | 'muted'; bend?: number; width?: number; opacity?: number; id: string;
}) {
    const { width: vw, height: vh } = useVideoConfig();
    const c = quad(from, to, bend);
    const L = 1000;
    const p = Math.max(0.001, progress);
    const tip = at(from, c, to, p), prev = at(from, c, to, Math.max(0, p - 0.02));
    const ang = (Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) * 180) / Math.PI;
    const stroke = kind === 'redirect' ? `url(#${id})` : yt.inkMute;
    const head = kind === 'redirect' ? yt.teal : yt.inkMute;
    return (
        <svg width={vw} height={vh} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity: progress > 0 ? opacity : 0 }}>
            <defs>
                <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}>
                    <stop offset="0" stopColor={yt.blue} /><stop offset="1" stopColor={yt.teal} />
                </linearGradient>
            </defs>
            <path d={`M${from[0]} ${from[1]} Q${c[0]} ${c[1]} ${to[0]} ${to[1]}`} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round"
                pathLength={L} strokeDasharray={L} strokeDashoffset={L * (1 - progress)} />
            {progress > 0.04 && (
                <g transform={`translate(${tip[0]} ${tip[1]}) rotate(${ang})`} opacity={smooth(progress / 0.12)}>
                    <path d={`M${-width * 2.4} ${-width * 1.8} L0 0 L${-width * 2.4} ${width * 1.8}`} fill="none" stroke={head} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}
        </svg>
    );
}

/** A tap that arrives from off-screen and lands on `at` at time `when`: a dot travels in (that's
    traffic), then a ring spreads where it lands. */
export function Tap({ t, when, at: p, from }: { t: number; when: number; at: Pt; from: Pt }) {
    const fly = prog(t, when - 0.55, when);
    const k = fly * fly; // accelerates in, like a click arriving
    const ring = prog(t, when, when + 0.6);
    const x = from[0] + (p[0] - from[0]) * k, y = from[1] + (p[1] - from[1]) * k;
    return (
        <>
            {fly > 0 && fly < 1 && <i style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: '0 0 18px rgba(255,255,255,.7)', ...f(smooth(fly / 0.3), x, y) }} />}
            {ring > 0 && ring < 1 && <i style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: 60, border: '4px solid rgba(255,255,255,.75)', boxSizing: 'border-box', ...f(1 - smooth(ring), p[0], p[1], 0.3 + 0.9 * easeOut(ring)) }} />}
        </>
    );
}

/** A chat message from the client. */
export function Bubble({ children, label, style }: { children: ReactNode; label: ReactNode; style?: CSSProperties }) {
    return (
        <div style={{ position: 'absolute', ...style }}>
            <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 600, color: yt.inkSoft, marginLeft: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>{label}</div>
            <div style={{
                position: 'relative', padding: '34px 44px', borderRadius: '44px 44px 44px 12px', background: '#FFFFFF', color: '#101828',
                fontFamily: font.display, fontSize: 68, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.08, boxShadow: '0 30px 80px rgba(0,0,0,.45)',
            }}>{children}</div>
        </div>
    );
}

/** A teal check mark, drawn (the fonts have no ✓ glyph of their own). */
export function Check({ size = 80, k = 1 }: { size?: number; k?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: '-0.08em' }}>
            <path d="M4.5 12.5l5 5 10-11" fill="none" stroke={yt.teal} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        </svg>
    );
}
