/* Shared pieces for W43, drawn from the approved key frames (youtube/02_videos/2026-W43_forward-
   multiple-domains/style-canvas/project/*.dc.html): the seven rooms (site gradients), the eyebrow,
   the step progress bar, glass pills, the browser card, the tip card and the tick. */
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { font } from '../../brand/tokens';
import { clamp, easeBack, easeInOut, easeOut, fx as baseFx, prog } from '../../lib/anim';

export const W = 1920, H = 1080;

/** Opacity + transform, smooth at sub-pixel precision. Chrome snaps a plain translation to whole pixels, so
    the slow tail of every ease moved in 1-px steps on alternate frames (measured: 0.47, 0.00, 0.54, 0.01).
    Its own layer plus a 0.02° turn (invisible) makes it a true sub-pixel transform: the tail decays
    continuously, and text at rest measured as sharp as before. */
/** Smoothstep: starts and ends at rest (no first-frame jolt). */
export const smooth = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
/** Blend two colours (any CSS colour) by k, so a state change fades instead of flipping in one frame. */
export const mix = (a: string, b: string, k: number) => `color-mix(in srgb, ${b} ${(clamp(k) * 100).toFixed(1)}%, ${a})`;
export const SMOOTH = (x: number, y: number, s = 1, r = 0) => `translate3d(${x}px, ${y}px, 0) scale(${s}) rotate(${r + 0.02}deg)`;
export function fx(o = 1, x = 0, y = 0, s = 1, r = 0): CSSProperties {
    return { ...baseFx(o, x, y, s, r), transform: SMOOTH(x, y, s, r), willChange: 'transform, opacity', backfaceVisibility: 'hidden' };
}
export const C = {
    teal: '#20A795', red: '#E5484D', amber: '#E59426', blue: '#1C6DB6',
    ink: '#FFFFFF', soft: '#B9C6D8', mute: '#6B7A90',
    char: '#181D27', char2: '#101828', night: '#0B1426', navy: '#1E2A44',
    g700: '#344054', g600: '#475467', g500: '#667085', g400: '#98A2B3', g300: '#D0D5DD', g200: '#EAECF0', g100: '#F2F4F7', g50: '#F9FAFB',
    paper: '#FBF7EF', paper2: '#F4EFE6', paperHi: '#FFF4D6', ink3: '#3B3A36', ink6: '#6B675F', ink8: '#8A8478',
} as const;
export const MONO = font.mono, DISPLAY = font.display, UI = font.sans;

/* ---------------------------------------------------------------- rooms */
export type Room = 'mesh' | 'sweep' | 'light' | 'twist' | 'radial' | 'lab' | 'charcoal';
const ROOM_BG: Record<Room, string> = {
    mesh: 'radial-gradient(circle at 20% 10%, rgba(229,148,38,0.20) 0%, rgba(229,148,38,0) 34%), radial-gradient(circle at 82% 18%, rgba(32,167,149,0.16) 0%, rgba(32,167,149,0) 30%), linear-gradient(#181D27 0%, #101828 100%)',
    sweep: 'linear-gradient(163deg, #1C6DB6 0%, #20A795 86%)',
    light: 'linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%)',
    twist: 'radial-gradient(ellipse 900px 520px at 70% 8%, rgba(229,72,77,0.20) 0%, rgba(229,72,77,0) 100%), linear-gradient(#181D27 0%, #0B1426 100%)',
    radial: 'radial-gradient(111.83% 100% at 50% 100%, #20A795 0%, #1C6DB6 100%)',
    lab: 'radial-gradient(ellipse 1000px 600px at 50% 0%, rgba(28,109,182,0.30) 0%, rgba(28,109,182,0) 100%), #0B1426',
    charcoal: 'linear-gradient(#181D27 0%, #101828 100%)',
};
const MESH_GRID: CSSProperties = { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.045) 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, rgba(0,0,0,0) 1px)', backgroundSize: '80px 80px', WebkitMaskImage: 'radial-gradient(60% 55% at 50% 30%, #000 30%, rgba(0,0,0,0) 75%)', maskImage: 'radial-gradient(60% 55% at 50% 30%, #000 30%, rgba(0,0,0,0) 75%)' };
const LAB_GRID: CSSProperties = { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px)', backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(75% 70% at 50% 45%, #000 35%, rgba(0,0,0,0) 85%)', maskImage: 'radial-gradient(75% 70% at 50% 45%, #000 35%, rgba(0,0,0,0) 85%)' };
export const DOTS: CSSProperties = { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16,24,40,0.10) 1.5px, rgba(0,0,0,0) 1.5px)', backgroundSize: '32px 32px', WebkitMaskImage: 'radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%)', maskImage: 'radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%)' };

/** Zero-mean dither over a room's gradient. Overlay-blended fractal noise moves each pixel a fraction of a
    shade up or down, so 8-bit gradients (and the encoder after them) can't collapse into visible bands.
    Static and seeded, so it costs little bitrate and never shimmers. */
function Dither({ strength }: { strength: number }) {
    return (
        <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: strength, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
            <filter id="w43-dither" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="43" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#w43-dither)" />
        </svg>
    );
}
const DITHER: Record<Room, number> = { mesh: 0.12, sweep: 0.1, light: 0.06, twist: 0.12, radial: 0.1, lab: 0.12, charcoal: 0.1 };

/** A full-frame room. `grid` adds the room's own texture (mesh grid, lab grid, light dots). `drift`
    nudges the texture a few px over the scene so a held frame never reads as frozen. */
export function RoomBg({ room, grid = true, t = 0, opacity = 1, children }: { room: Room; grid?: boolean; t?: number; opacity?: number; children?: ReactNode }) {
    const dx = Math.sin(t / 3.7) * 6, dy = Math.cos(t / 4.3) * 4;
    const tex = room === 'mesh' ? MESH_GRID : room === 'lab' ? LAB_GRID : room === 'light' ? DOTS : null;
    return (
        <AbsoluteFill style={{ background: ROOM_BG[room], opacity, fontFamily: DISPLAY, color: room === 'light' ? C.char : C.ink, WebkitFontSmoothing: 'antialiased' }}>
            {grid && tex && <div style={{ ...tex, transform: SMOOTH(dx, dy), willChange: 'transform' }} />}
            <Dither strength={DITHER[room]} />
            {children}
        </AbsoluteFill>
    );
}

/* ---------------------------------------------------------------- type & chrome */
/** Eyebrow, top-left at y 110: a short dash and caps. */
export function Eyebrow({ k = 1, color, dash, children, top = 110 }: { k?: number; color: string; dash: string; children: ReactNode; top?: number }) {
    return (
        <div style={{ position: 'absolute', left: 120, top, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color, ...fx(k, (1 - k) * -14, 0) }}>
            <span style={{ width: 36, height: 3, borderRadius: 2, background: dash, transform: `scaleX(${clamp(k * 1.4)})`, transformOrigin: 'left center', willChange: 'transform' }} />{children}
        </div>
    );
}

/** Three-segment step progress, top-right. `fill` 0–3, fractional while a segment draws. */
export function Progress({ fill, k = 1, on = C.teal, off = C.g300 }: { fill: number; k?: number; on?: string; off?: string }) {
    return (
        <div style={{ position: 'absolute', left: 1560, top: 110, width: 240, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, opacity: k }}>
            {[0, 1, 2].map((i) => (
                <span key={i} style={{ position: 'relative', width: 64, height: 6, borderRadius: 3, background: off, overflow: 'hidden' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: on, borderRadius: 3, transform: `scaleX(${clamp(fill - i)})`, transformOrigin: 'left center', willChange: 'transform' }} />
                </span>
            ))}
        </div>
    );
}

/** Pop-in: scale from 0.86 with a little overshoot, fade over the first part. */
export function popIn(t: number, a: number, d = 0.42): CSSProperties {
    const k = prog(t, a, a + d);
    return fx(smooth(k * 2.2), 0, 0, 0.86 + 0.14 * easeBack(k));
}
/** Slide in from a side (dx) or below (dy). */
export function slideIn(t: number, a: number, d = 0.45, dx = 0, dy = 30): CSSProperties {
    const q = prog(t, a, a + d), k = easeOut(q);
    // Position eases out; opacity eases in and out, so a large panel never jumps from invisible on frame one.
    return fx(smooth(q * 1.6), (1 - k) * dx, (1 - k) * dy);
}
/** Fade out over [b, b+d] (multiply into opacity). */
export const outK = (t: number, b: number, d = 0.3) => 1 - easeOut(prog(t, b, b + d));

/** Teal tick in a circle. */
export function Tick({ size = 24, fill = C.teal, stroke = '#FFFFFF', draw = 1 }: { size?: number; fill?: string; stroke?: string; draw?: number }) {
    return (
        <svg style={{ flex: 'none' }} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill={fill} />
            <path d="M19 33l9 9 17-19" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset={40 * (1 - clamp(draw))} />
        </svg>
    );
}

export function Lock({ size = 16, color = C.g600, sw = 2.4 }: { size?: number; color?: string; sw?: number }) {
    return (
        <svg style={{ flex: 'none' }} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

/** The browser's three window dots. */
export function Dots3({ size = 11, gap = 7 }: { size?: number; gap?: number }) {
    return (
        <div style={{ display: 'flex', gap }}>
            {['#F97066', '#FDB022', '#32D583'].map((c) => <span key={c} style={{ width: size, height: size, borderRadius: '50%', background: c }} />)}
        </div>
    );
}

/** The typo with its swapped letters underlined in red (wavy). */
export function Typo({ text, span, color = C.red, thick = 2, offset = 9, colorLetters = false }: { text: string; span: readonly [number, number]; color?: string; thick?: number; offset?: number; colorLetters?: boolean }) {
    return (
        <span>
            {text.slice(0, span[0])}
            <span style={{ textDecoration: `underline wavy ${color}`, textDecorationThickness: thick, textUnderlineOffset: offset, color: colorLetters ? color : undefined }}>{text.slice(span[0], span[1])}</span>
            {text.slice(span[1])}
        </span>
    );
}

/** Glass pill on dark (site glass): mono domain, optional dot. */
export function GlassPill({ children, size = 38, dot = C.soft, style }: { children: ReactNode; size?: number; dot?: string | null; style?: CSSProperties }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, height: size * 2, padding: `0 ${size * 0.8}px`, borderRadius: size, background: 'rgba(255,255,255,0.10)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22), 0 20px 50px rgba(0,0,0,0.35)', fontFamily: MONO, fontSize: size, fontWeight: 500, whiteSpace: 'nowrap', color: C.ink, ...style }}>
            {dot && <span style={{ width: size * 0.37, height: size * 0.37, borderRadius: '50%', background: dot, flex: 'none' }} />}{children}
        </span>
    );
}

/** Solid charcoal tip card (beside the stage, never over it). */
export function TipCard({ label, title, sub, x, y, w, size = 44, style }: { label: string; title: string; sub?: string; x: number; y: number; w: number; size?: number; style?: CSSProperties }) {
    return (
        <div style={{ position: 'absolute', left: x, top: y, width: w, boxSizing: 'border-box', padding: '38px 40px 42px', borderRadius: 26, background: C.char, color: C.ink, boxShadow: '0 30px 80px rgba(16,24,40,0.22)', display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
            <span style={{ fontWeight: 700, fontSize: 21, letterSpacing: '0.15em', color: C.teal }}>{label}</span>
            <span style={{ fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{title}</span>
            {sub && <span style={{ fontSize: 24, fontWeight: 500, color: C.soft }}>{sub}</span>}
        </div>
    );
}

/** A "Welcome to mybrand" site card in a browser window (the twist grid). */
export function SiteCard({ domain, w = 500, h = 250, style, grey = false, children }: { domain: ReactNode; w?: number; h?: number; style?: CSSProperties; grey?: boolean; children?: ReactNode }) {
    return (
        <div style={{ position: 'absolute', width: w, height: h, borderRadius: 20, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 24px 60px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)', fontFamily: UI, color: C.g700, filter: grey ? 'grayscale(1)' : undefined, ...style }}>
            <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderBottom: `1px solid ${C.g200}` }}>
                <Dots3 />
                <div style={{ flex: 1, height: 34, borderRadius: 17, background: C.g100, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', fontFamily: MONO, fontSize: 19, color: C.g700 }}><Lock /><span>{domain}</span></div>
            </div>
            <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 13 }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: C.navy }} />
                <span style={{ fontSize: 27, fontWeight: 600, color: C.char, letterSpacing: '-0.01em' }}>Welcome to mybrand</span>
                <span style={{ height: 10, width: 330, borderRadius: 5, background: C.g200 }} />
                <span style={{ height: 10, width: 250, borderRadius: 5, background: C.g200 }} />
            </div>
            {children}
        </div>
    );
}

/** Scene entrance over the lap. With `room`, the incoming room is laid down first as a cover (so the
    outgoing scene never double-exposes with this one), then the content fades in on top of it. */
export function SceneFade({ t, room, inD = 0.3, outAt, outD = 0.3, color = C.ink, children }: { t: number; room?: Room; inD?: number; outAt?: number; outD?: number; color?: string; children: ReactNode }) {
    const out = outAt === undefined ? 1 : outK(t, outAt, outD);
    // One continuous dissolve: both curves ease in and out and overlap, so the cut never moves in two steps
    // (an ease-out content fade started at full speed right after the cover: measured as a one-frame jump).
    // A single eased phase drives both: the room is laid down in its first 60%, the content over its last 75%,
    // so the motion never pauses between them (two eases in a row slowed to zero mid-cut: measured as a stall).
    const ph = easeInOut(prog(t, 0, inD));
    const cover = room ? clamp(ph / 0.6) : 1;
    const o = (room ? clamp((ph - 0.25) / 0.75) : ph) * out;
    return (
        <AbsoluteFill style={{ color, fontFamily: DISPLAY }}>
            {room && <RoomBg room={room} t={t} opacity={cover * out} />}
            <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>
        </AbsoluteFill>
    );
}
