/* Shared stage pieces for the video: the Night canvas, the two domain pills that anchor the
   whole film, a caption slot, and the tip card. Layout constants are composition pixels. */
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { font, yt } from '../../brand/tokens';
import { GlassCard } from '../../components/GlassCard';
import { Grain } from '../../components/Grain';
import { NIGHT_BG } from '../../components/FixedEndCard';
import { OnScreenText } from '../../components/OnScreenText';
import { UrlPill, type DotTone } from '../../components/UrlPill';
import { easeOut, fx, prog } from '../../lib/anim';

export const W = 1920, H = 1080;
/** Safe area: platform UI and end screens. Nothing key below y = 950 (bottom 12%). */
export const SAFE = { x: 120, top: 70, bottom: 950 } as const;

export function Night({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    // The glow drifts a little (two slow sines, about 20 s each) so a held frame never reads as
    // frozen while the narration carries it. Far below anything the eye would call motion.
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = frame / fps;
    const gx = 50 + 2.5 * Math.sin((2 * Math.PI * s) / 23);
    const gy = 20 + 2 * Math.sin((2 * Math.PI * s) / 17 + 1);
    const bg = `radial-gradient(1400px 900px at ${gx.toFixed(2)}% ${gy.toFixed(2)}%, #10214A 0%, #0B1426 55%, #070E1C 100%)`;
    return (
        <AbsoluteFill style={{ background: bg, fontFamily: font.display, color: yt.ink, WebkitFontSmoothing: 'antialiased', ...style }}>
            <Grain />
            {children}
        </AbsoluteFill>
    );
}

/** The old → new pair, centred on a baseline. `gap` is the space between them for a line. */
export const PILL_Y = 500;
export const PILL_SIZE = 44;
export function pillGeometry(oldDomain: string, newDomain: string, gap = 420, size = PILL_SIZE) {
    const w = (s: string) => s.length * size * 0.6 + size * 1.4 + size * 0.85; // text + padding + dot
    const wo = w(oldDomain), wn = w(newDomain);
    const total = wo + gap + wn;
    const x0 = (W - total) / 2;
    return {
        old: { x: x0, w: wo, right: x0 + wo },
        new: { x: x0 + wo + gap, w: wn, left: x0 + wo + gap },
    };
}

export function Caption({ t, from, until, children, text, y = 800, size = 46, color = yt.inkSoft, plate = false }: {
    t: number; from: number; until: number; children: ReactNode; text?: string; y?: number; size?: number; color?: string;
    /** A Night plate behind the line, for a caption that has to sit over light UI (the dashboard). */
    plate?: boolean;
}) {
    const shown = t >= from && t < until;
    return (
        <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: y, display: 'flex', justifyContent: 'center' }}>
            <div style={plate && shown ? { background: 'rgba(7,14,28,0.88)', padding: '8px 26px', borderRadius: 14 } : undefined}>
                <OnScreenText t={t} from={from} until={until} text={text} size={size} weight={600} color={color} align="center">{children}</OnScreenText>
            </div>
        </div>
    );
}

/** Side tip: slides in from the right, holds, slides out. */
export function TipCard({ t, from, until, label, children, y = 300 }: { t: number; from: number; until: number; label: string; children: ReactNode; y?: number }) {
    const k = easeOut(prog(t, from, from + 0.45));
    const out = easeOut(prog(t, until - 0.35, until));
    return (
        <div style={{ position: 'absolute', right: SAFE.x, top: y, width: 560, ...fx(k * (1 - out), (1 - k) * 80 + out * 40, 0) }}>
            <GlassCard accent={yt.teal} padding={40}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: yt.teal }}>QUICK TIP</div>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.12, marginTop: 14 }}>{label}</div>
                <div style={{ fontSize: 26, color: yt.inkSoft, marginTop: 16, lineHeight: 1.4 }}>{children}</div>
            </GlassCard>
        </div>
    );
}

/** Small section tag, top-left ("IDEA ONE", "STEP TWO"). */
export function Tag({ t, from, until, children, align = 'left' }: { t: number; from: number; until: number; children: string; align?: 'left' | 'center' }) {
    const k = easeOut(prog(t, from, from + 0.35)) * (1 - easeOut(prog(t, until - 0.25, until)));
    // 'center' centres in the free band between the docked pills (left) and the idea rail (right).
    const pos: CSSProperties = align === 'center' ? { left: 720, right: 440, textAlign: 'center', whiteSpace: 'nowrap' } : { left: SAFE.x };
    return (
        <div style={{ position: 'absolute', top: SAFE.top + 30, fontSize: 24, fontWeight: 700, letterSpacing: '.16em', color: yt.teal, ...pos, ...fx(k, align === 'center' ? 0 : (1 - k) * -16, align === 'center' ? (1 - k) * -10 : 0) }}>{children}</div>
    );
}

export function DomainPill({ url, dot, x, y = PILL_Y, size = PILL_SIZE, style }: { url: string; dot: DotTone; x: number; y?: number; size?: number; style?: CSSProperties }) {
    return <div style={{ position: 'absolute', left: x, top: y - size * 0.95, ...style }}><UrlPill url={url} dot={dot} size={size} /></div>;
}
