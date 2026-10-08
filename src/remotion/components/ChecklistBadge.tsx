/* A check that draws itself. `k` 0–1 fills the badge and strokes the tick; the label sits beside it. */
import { font, yt } from '../brand/tokens';

export function ChecklistBadge({ k, label, size = 64, color = yt.teal, style }: { k: number; label?: string; size?: number; color?: string; style?: React.CSSProperties }) {
    const r = size / 2;
    const fill = Math.min(1, k * 1.6);
    const tick = Math.max(0, (k - 0.35) / 0.65);
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, ...style }}>
            <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', flex: 'none' }}>
                <circle cx="32" cy="32" r="29" fill="none" stroke={yt.glassLine} strokeWidth="3" />
                <circle cx="32" cy="32" r="29" fill={color} opacity={fill} transform={`scale(${0.6 + 0.4 * fill})`} style={{ transformOrigin: '32px 32px' }} />
                <path d="M19 33l9 9 17-19" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
            </svg>
            {label && <span style={{ fontFamily: font.display, fontSize: r * 1.15, fontWeight: 600, color: k > 0.6 ? yt.ink : yt.inkSoft, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{label}</span>}
        </div>
    );
}
