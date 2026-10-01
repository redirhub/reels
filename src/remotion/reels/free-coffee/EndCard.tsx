/* 10.2–12s · Scene 7: brand close. Fast in, no fade out: the reel ends on a cut. */
import { AbsoluteFill } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { color } from '../../brand/tokens';
import { rise, useTime } from '../../lib/anim';
import { BG } from './Stage';
import type { FreeCoffeeProps } from './props';

export function EndCard(props: FreeCoffeeProps) {
    const t = useTime();
    return (
        <AbsoluteFill style={{ background: BG, textAlign: 'center' }}>
            <div style={{ position: 'absolute', left: 30, right: 30, top: 700, fontSize: 116, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.04, color: '#fff' }}>
                <div style={rise(t, 0, 0.3, 30)}>{props.endLines[0]}</div>
                <div style={{ color: color.teal, ...rise(t, 0.12, 0.3, 30) }}>{props.endLines[1]}</div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1030, display: 'flex', justifyContent: 'center', ...rise(t, 0.3, 0.35, 24) }}>
                <div style={{ width: 440 }}><RedirHubLogo variant="white" /></div>
            </div>
        </AbsoluteFill>
    );
}
