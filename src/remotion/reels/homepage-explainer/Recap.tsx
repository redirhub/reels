/* 43.9–48.3s (4.4s) · Before / after: the same four links from the hook, all
   working again. Times are local. */
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import { easeInOut, prog, rise, useTime } from '../../lib/anim';
import { LinkCards } from './Hook';
import type { HomepageExplainerProps } from './props';

export const RECAP_FIXES = [1.0, 1.2, 1.4, 1.6] as const;

export function Recap(props: HomepageExplainerProps) {
    const t = useTime();
    const slide = easeInOut(prog(t, 0, 0.55));
    return (
        <AbsoluteFill style={{
            transform: `translateY(${(1 - slide) * 1080}px)`,
            background: `radial-gradient(1100px 700px at 85% 90%, rgba(32,167,149,.32), transparent 70%),
                radial-gradient(900px 600px at 10% 0%, rgba(28,109,182,.3), transparent 70%), ${color.dark}`,
        }}>
            <div style={{ position: 'absolute', left: 125, top: 110, fontSize: 84, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, whiteSpace: 'nowrap' }}>
                <div style={{ color: '#fff', ...rise(t, 0.4, 0.45, 30) }}>Same links, wherever they live.</div>
                <div style={{ color: '#5FD3C1', ...rise(t, 1.7, 0.45, 30) }}>Every one of them works.</div>
            </div>
            <LinkCards props={props} t={t} flipAt={RECAP_FIXES} from="bad" />
        </AbsoluteFill>
    );
}
