/* "How to redirect a domain to another domain (with HTTPS that actually works)" — 16:9,
   RedirHub's first YouTube video. Scenes are <Sequence>s over beat windows from timeline.ts;
   every visual is a function of time. Audio (voiceover, bed, SFX) is added in Phase 3. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { FixedEndCard } from '../../components/FixedEndCard';
import { CloseScene } from './CloseScene';
import { HookScene } from './HookScene';
import { IdeasScene } from './IdeasScene';
import { TestScene } from './TestScene';
import { WalkthroughScene } from './WalkthroughScene';
import type { RedirectDomainProps } from './props';
import { TOTAL, sceneWindow } from './timeline';

export const REDIRECT_DOMAIN_SECONDS = TOTAL;

export function RedirectDomain(props: RedirectDomainProps) {
    const { fps } = useVideoConfig();
    const seq = (key: Parameters<typeof sceneWindow>[0]) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Sequence {...seq('hook')} name="A · Hook"><HookScene {...props} /></Sequence>
            <Sequence {...seq('ideas')} name="B · Three ideas"><IdeasScene {...props} /></Sequence>
            <Sequence {...seq('walkthrough')} name="C · Walkthrough"><WalkthroughScene {...props} /></Sequence>
            <Sequence {...seq('test')} name="D · Test and checks"><TestScene {...props} /></Sequence>
            <Sequence {...seq('close')} name="D · Close"><CloseScene {...props} /></Sequence>
            <Sequence {...seq('end')} name="End card"><FixedEndCard lines={props.endLines} sub={props.endSub} qr={props.qr} /></Sequence>
        </AbsoluteFill>
    );
}
