/* 47.9–54.3s (6.4s) · Proof: approved platform numbers over a field of edge
   locations. Times are local. */
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import { easeBack, easeInOut, easeOut, fx, lerp, prog, rise, useTime } from '../../lib/anim';
import type { HomepageExplainerProps } from './props';

/** Deterministic pseudo-random in [0, 1) (no Math.random at render time). */
const hash = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};
const DOTS = Array.from({ length: 130 }, (_, i) => ({ x: hash(i) * 1920, y: 60 + hash(i + 500) * 960, phase: hash(i + 900) }));
export const PROOF_TILES = [1.3, 1.6, 1.9, 2.2] as const;

export function Proof(props: HomepageExplainerProps) {
    const t = useTime();
    const reveal = easeInOut(prog(t, 0, 0.6));
    return (
        <AbsoluteFill style={{
            clipPath: `inset(0 0 0 ${(1 - reveal) * 100}%)`,
            background: `radial-gradient(1000px 700px at 90% 10%, rgba(32,167,149,.35), transparent 65%),
                linear-gradient(160deg, ${color.blue} 0%, #134a7c 55%, ${color.dark} 100%)`,
        }}>
            {DOTS.map((d, i) => {
                const on = prog(t, 0.3 + d.phase * 1.5, 0.6 + d.phase * 1.5);
                const pulse = 0.5 + 0.5 * Math.sin(t * 3 + d.phase * 6.28);
                return <div key={i} style={{ position: 'absolute', left: d.x, top: d.y, width: 8, height: 8, marginLeft: -4, borderRadius: '50%', background: '#9FD8FF', opacity: on * (0.15 + 0.35 * pulse) }} />;
            })}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontSize: 80, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, color: '#fff', ...rise(t, 0.5, 0.45, 30) }}>
                Redirect infrastructure<br /><span style={{ color: '#9FD8FF' }}>you don't have to run.</span>
            </div>
            <div style={{ position: 'absolute', left: 110, right: 110, top: 520, display: 'flex', gap: 40 }}>
                {props.stats.map((s, i) => {
                    const k = easeOut(prog(t, PROOF_TILES[i], PROOF_TILES[i] + 0.45));
                    return (
                        <div key={s.label} style={{
                            flex: 1, height: 250, borderRadius: 30, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.22)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px',
                            ...fx(k, 0, (1 - k) * 50),
                        }}>
                            <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: '-.04em', color: '#fff', transform: `scale(${lerp(0.7, 1, easeBack(prog(t, PROOF_TILES[i], PROOF_TILES[i] + 0.5)))})` }}>{s.value}</div>
                            <div style={{ fontSize: 26, fontWeight: 600, color: '#CFE6FA', marginTop: 10, lineHeight: 1.3 }}>{s.label}</div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
}
