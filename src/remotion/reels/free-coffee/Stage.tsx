/* Shared pieces for the free-coffee reel: the browser, the URL chip that travels
   between scenes, and the page states. Everything is laid out in composition pixels
   so the chip can move between the address bar, the page and the redirect layer
   and land exactly where the next scene expects it. */
import type { CSSProperties, ReactNode } from 'react';
import { color, font } from '../../brand/tokens';
import { lerp } from '../../lib/anim';

export const BG = `radial-gradient(1100px 900px at 50% 28%, #17355F 0%, #0E1C35 55%, #0A1426 100%)`;
export const DEEP = '#0A1324';

/** Browser window frame. */
export const WIN = { x: 70, y: 300, w: 940, h: 1180, r: 40, bar: 128 } as const;
/** Address pill inside the toolbar. */
export const ADDR = { x: 110, y: 328, w: 860, h: 72 } as const;

/** URL chip geometry at scale 1 (JetBrains Mono advances exactly 0.6em). */
export const CHIP = { h: 72, fs: 34, pad: 22, icon: 30, gap: 12 } as const;
export const chipWidth = (text: string) => CHIP.pad * 2 + CHIP.icon + CHIP.gap + text.length * CHIP.fs * 0.6;

/** Chip scale on the page and in the redirect layer. */
export const BIG = 1.55;
/** Chip centers. */
export const PAGE_LINK_Y = 900;
export const NODE_Y = 760;
export const DEST_Y = 1200;

/** Chip in the address bar: top-left corner at scale 1. */
export const addrChipPos = () => ({ x: ADDR.x, y: ADDR.y });
/** Top-left for a chip of `text` centered at (540, cy) at scale s. */
export const centered = (text: string, cy: number, s: number) => ({
    x: 540 - (chipWidth(text) * s) / 2,
    y: cy - (CHIP.h * s) / 2,
});

export type ChipLook = {
    /** 0 = address bar look (transparent), 1 = node look (white card). */
    card: number;
    /** 0..1 blend toward the in-page link look (blue on light blue). */
    linkish: number;
    /** Border color override (status). */
    border?: string;
};

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const blend = (a: number[], b: number[], k: number) => a.map((v, i) => lerp(v, b[i], k));
const css = (c: number[]) => `rgb(${c.map(Math.round).join(',')})`;

export function LockIcon({ c, size = CHIP.icon }: { c: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export function LinkIcon({ c, size = CHIP.icon }: { c: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
        </svg>
    );
}

/** The URL as a physical object. Positioned by its top-left corner, scaled from there. */
export function UrlChip({ text, x, y, s = 1, look, redact = 0, shimmer = 0, children, style }: {
    text: string; x: number; y: number; s?: number; look: ChipLook;
    /** Hide the last `redact` characters behind a bar (the secret destination). They are never rendered. */
    redact?: number;
    /** Phase of the shimmer across the redaction bar. */
    shimmer?: number;
    children?: ReactNode; style?: CSSProperties;
}) {
    const ink = css(blend(blend(rgb(color.g700), rgb(color.dark), look.card), rgb(color.blue), look.linkish));
    const bg = look.linkish > 0
        ? css(blend(rgb('#FFFFFF'), rgb(color.blueBg), look.linkish))
        : `rgba(255,255,255,${look.card})`;
    const icon = look.linkish > 0.5 ? <LinkIcon c={ink} /> : <LockIcon c={look.card > 0.5 ? color.g500 : color.g400} />;
    return (
        <div style={{
            position: 'absolute', left: x, top: y, height: CHIP.h, width: chipWidth(text),
            transform: `scale(${s})`, transformOrigin: '0 0',
            display: 'flex', alignItems: 'center', gap: CHIP.gap, padding: `0 ${CHIP.pad}px`, boxSizing: 'border-box',
            borderRadius: 22, background: bg,
            border: `2px solid ${look.border ?? `rgba(208,213,221,${look.card * 0.9})`}`,
            boxShadow: `0 ${18 * look.card}px ${44 * look.card}px rgba(3,10,25,${0.45 * look.card})`,
            fontFamily: font.mono, fontSize: CHIP.fs, fontWeight: 600, color: ink, whiteSpace: 'nowrap', letterSpacing: 0,
            ...style,
        }}>
            {icon}
            <span>{redact ? text.slice(0, -redact) : text}</span>
            {redact > 0 && (
                <span style={{
                    display: 'inline-block', width: redact * CHIP.fs * 0.6 - 6, height: 30, borderRadius: 10, marginLeft: -CHIP.gap + 4,
                    background: `linear-gradient(100deg, ${color.g200} 0%, ${color.g200} ${shimmer * 140 - 40}%, #fff ${shimmer * 140 - 20}%, ${color.g200} ${shimmer * 140}%, ${color.g200} 100%)`,
                }} />
            )}
            {children}
        </div>
    );
}

/** Browser window with toolbar and a page. The address chip can be hidden when a
    scene draws its own (travelling) copy on top. */
export function Browser({ address, page, hideAddress, loading = -1, style }: {
    address: string; page: ReactNode; hideAddress?: boolean; loading?: number; style?: CSSProperties;
}) {
    return (
        <div style={{
            position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: WIN.r,
            background: '#fff', overflow: 'hidden', boxShadow: '0 50px 120px rgba(2,8,20,.55), 0 0 0 1px rgba(255,255,255,.06)',
            transformOrigin: '50% 40%', ...style,
        }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: WIN.bar, background: color.g50, borderBottom: `1px solid ${color.g200}` }}>
                <div style={{
                    position: 'absolute', left: ADDR.x - WIN.x, top: ADDR.y - WIN.y, width: ADDR.w, height: ADDR.h,
                    borderRadius: 22, background: color.g100,
                }} />
                {!hideAddress && <UrlChip text={address} x={ADDR.x - WIN.x} y={ADDR.y - WIN.y} look={{ card: 0, linkish: 0 }} />}
                {loading >= 0 && (
                    <div style={{
                        position: 'absolute', left: 0, bottom: -1, height: 5, width: `${loading * 100}%`,
                        background: color.blue, opacity: loading >= 1 ? 0 : 1,
                    }} />
                )}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: WIN.bar, bottom: 0 }}>{page}</div>
        </div>
    );
}

const bar = (w: number, top: number, h = 22, c: string = color.g100): CSSProperties => ({
    position: 'absolute', left: (WIN.w - w) / 2, top, width: w, height: h, borderRadius: h / 2, background: c,
});

/** The page the link sits on: quiet skeleton content so the link is the only thing to read.
    The link itself is drawn by the scene (it travels), at PAGE_LINK_Y. */
export function LinkPage() {
    return (
        <>
            <div style={{ position: 'absolute', left: 60, top: 56, width: 64, height: 64, borderRadius: 18, background: color.g100 }} />
            <div style={{ ...bar(260, 66, 20, color.g200), left: 144 }} />
            <div style={{ ...bar(180, 98, 16), left: 144 }} />
            <div style={bar(820, 196)} />
            <div style={bar(820, 236)} />
            <div style={bar(620, 276)} />
            <div style={bar(820, 610)} />
            <div style={bar(720, 650)} />
            <div style={bar(540, 690)} />
            <div style={{ ...bar(820, 780, 200, color.g50), borderRadius: 24 }} />
        </>
    );
}

/** A modern site's 404, not an infographic. Page-relative coordinates. */
export function NotFoundPage() {
    return (
        <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: font.sans }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 250, fontSize: 280, fontWeight: 800, letterSpacing: '-.05em', color: color.charcoal, lineHeight: 1 }}>404</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 570, fontSize: 52, fontWeight: 600, color: color.g600 }}>Page not found</div>
            <div style={{
                position: 'absolute', left: (WIN.w - 340) / 2, top: 680, width: 340, height: 84, borderRadius: 18,
                border: `2px solid ${color.g300}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 600, color: color.g700,
            }}>Go to homepage</div>
        </div>
    );
}
