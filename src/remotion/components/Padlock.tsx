/* A padlock whose shackle opens and closes; the browser's HTTPS icon drawn large. */
import { yt } from '../brand/tokens';

export function Padlock({ size = 160, closed = 1, color = yt.teal, style }: { size?: number; closed?: number; color?: string; style?: React.CSSProperties }) {
    // Shackle lifts by up to 22% of the size when open.
    const lift = (1 - closed) * size * 0.22;
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', ...style }}>
            <path d={`M30 ${48 - lift * (100 / size)} V36a20 20 0 0 1 40 0v${12 - lift * (100 / size)}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <rect x="18" y="46" width="64" height="46" rx="12" fill={color} />
            <circle cx="50" cy="66" r="6" fill="#0B1426" />
            <rect x="47.5" y="66" width="5" height="12" rx="2.5" fill="#0B1426" />
        </svg>
    );
}
