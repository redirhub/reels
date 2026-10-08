/* Frosted card for Night backgrounds (brand "glass effect"): tips, metaphors, captions. */
import type { CSSProperties, ReactNode } from 'react';
import { yt } from '../brand/tokens';

export function GlassCard({ children, style, radius = 28, padding = 36, accent }: {
    children: ReactNode; style?: CSSProperties; radius?: number; padding?: number;
    /** Optional left accent bar colour (e.g. teal for a tip). */
    accent?: string;
}) {
    return (
        <div style={{
            position: 'relative', borderRadius: radius, padding, background: yt.glass, boxShadow: `inset 0 0 0 1px ${yt.glassLine}, 0 30px 80px rgba(0,0,0,.35)`,
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', overflow: 'hidden', ...style,
        }}>
            {accent && <i style={{ position: 'absolute', left: 0, top: padding, bottom: padding, width: 6, borderRadius: 3, background: accent }} />}
            {children}
        </div>
    );
}
