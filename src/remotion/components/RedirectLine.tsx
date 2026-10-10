/* The redirect line: drawn from one URL to another, with an arrow head, and optional
   "traffic" dots travelling along it. Motion that represents traffic, not decoration. */
import { useVideoConfig } from 'remotion';
import { yt } from '../brand/tokens';

export type Pt = readonly [number, number];

/** A gentle arc from a to b (quadratic), in composition pixels. */
export function arcPath(a: Pt, b: Pt, bend = 0.18) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const cx = mx - (dy / len) * len * bend, cy = my + (dx / len) * len * bend;
    return { d: `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`, c: [cx, cy] as Pt };
}

function pointAt(a: Pt, c: Pt, b: Pt, k: number): Pt {
    const u = 1 - k;
    return [u * u * a[0] + 2 * u * k * c[0] + k * k * b[0], u * u * a[1] + 2 * u * k * c[1] + k * k * b[1]];
}

export function RedirectLine({ from, to, progress, color = yt.teal, width = 5, bend = 0.18, traffic = 0, t = 0, dashed = false, opacity = 1 }: {
    from: Pt; to: Pt;
    /** 0–1 of the line drawn. */
    progress: number;
    color?: string; width?: number; bend?: number;
    /** Number of traffic dots travelling along the drawn part; `t` drives them. */
    traffic?: number; t?: number;
    dashed?: boolean; opacity?: number;
}) {
    const { width: vw, height: vh } = useVideoConfig();
    const { d, c } = arcPath(from, to, bend);
    const L = 2000; // long enough for any on-screen arc; dashoffset trick
    const tip = pointAt(from, c, to, Math.max(0.001, progress));
    const prev = pointAt(from, c, to, Math.max(0, progress - 0.02));
    const ang = (Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) * 180) / Math.PI;
    return (
        <svg width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} style={{ position: 'absolute', left: 0, top: 0, width: vw, height: vh, overflow: 'visible', pointerEvents: 'none', opacity }}>
            <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
                strokeDasharray={dashed ? `${width * 2.4} ${width * 2.4}` : `${L}`} strokeDashoffset={dashed ? 0 : L * (1 - progress)}
                pathLength={dashed ? undefined : L} style={{ opacity: progress > 0 ? 1 : 0 }} />
            {progress > 0.05 && (
                <g transform={`translate(${tip[0]} ${tip[1]}) rotate(${ang})`}>
                    <path d={`M${-width * 2.6} ${-width * 1.9} L0 0 L${-width * 2.6} ${width * 1.9}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}
            {Array.from({ length: traffic }, (_, i) => {
                const k = ((t * 0.45 + i / traffic) % 1) * progress;
                const p = pointAt(from, c, to, k);
                return <circle key={i} cx={p[0]} cy={p[1]} r={width * 1.1} fill="#fff" opacity={0.9 * Math.sin(Math.PI * (k / Math.max(progress, 0.001)))} />;
            })}
        </svg>
    );
}
