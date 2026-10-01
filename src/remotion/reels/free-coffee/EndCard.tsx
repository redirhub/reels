/* Brand close. Fast in, no fade out: the reel ends on a cut. Times are local. */
import { AbsoluteFill } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { color } from '../../brand/tokens';
import { rise, useTime } from '../../lib/anim';
import type { FreeCoffeeProps } from './props';

const BG = `radial-gradient(1100px 900px at 50% 28%, #17355F 0%, #0E1C35 55%, #0A1426 100%)`;

export function EndCard(props: FreeCoffeeProps) {
    const t = useTime();
    return (
        <AbsoluteFill style={{ background: BG, textAlign: 'center' }}>
            <div style={{ position: 'absolute', left: 30, right: 30, top: 640, fontSize: 120, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.04, color: '#fff' }}>
                <div style={rise(t, -0.1, 0.3, 30)}>{props.endLines[0]}</div>
                <div style={{ color: color.teal, ...rise(t, 0.02, 0.3, 30) }}>{props.endLines[1]}</div>
            </div>
            <div style={{ position: 'absolute', left: 30, right: 30, top: 920, fontSize: 44, fontWeight: 500, color: '#B9C6D8', ...rise(t, 0.2, 0.35, 20) }}>
                {props.endSub}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center', ...rise(t, 0.32, 0.35, 24) }}>
                <div style={{ width: 440 }}><RedirHubLogo variant="white" /></div>
            </div>
        </AbsoluteFill>
    );
}
