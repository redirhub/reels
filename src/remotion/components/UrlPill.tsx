/* A URL in JetBrains Mono, in a pill, with a status dot: red = broken, teal = fixed,
   amber = pending, grey = unknown. The seed of the channel's visual identity (free-coffee). */
import type { CSSProperties } from 'react';
import { font, yt } from '../brand/tokens';

export type DotTone = 'red' | 'teal' | 'amber' | 'grey' | 'none';
export const DOT: Record<Exclude<DotTone, 'none'>, string> = { red: yt.signalRed, teal: yt.teal, amber: yt.amber, grey: yt.inkMute };

export function UrlPill({ url, dot = 'none', size = 40, variant = 'glass', style, strike = 0 }: {
    url: string; dot?: DotTone; size?: number;
    /** `glass` sits on Night; `light` is a white pill for inside light UI. */
    variant?: 'glass' | 'light';
    /** 0–1: a red strike-through drawn over the URL (a dead link). */
    strike?: number;
    style?: CSSProperties;
}) {
    const h = Math.round(size * 1.9);
    const light = variant === 'light';
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.45), height: h, padding: `0 ${Math.round(size * 0.7)}px`,
            borderRadius: h / 2, fontFamily: font.mono, fontSize: size, fontWeight: 500, whiteSpace: 'nowrap', position: 'relative',
            background: light ? '#fff' : yt.glass, color: light ? '#101828' : yt.ink,
            boxShadow: light ? '0 1px 0 rgba(16,24,40,.06), 0 12px 30px rgba(16,24,40,.12)' : `inset 0 0 0 1px ${yt.glassLine}`,
            ...style,
        }}>
            {dot !== 'none' && <i style={{ flex: 'none', width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: DOT[dot], boxShadow: `0 0 ${size * 0.4}px ${DOT[dot]}66` }} />}
            <span>{url}</span>
            {strike > 0 && (
                <i style={{ position: 'absolute', left: Math.round(size * 0.7) + (dot !== 'none' ? size * 0.85 : 0), top: '50%', height: Math.max(3, size * 0.08), width: `${strike * (url.length * size * 0.6)}px`, background: yt.signalRed, borderRadius: 2, transform: 'translateY(-50%)' }} />
            )}
        </div>
    );
}
