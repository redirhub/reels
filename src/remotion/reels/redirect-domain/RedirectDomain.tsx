/* "How to redirect a domain to another domain (with HTTPS that actually works)" — 16:9,
   RedirHub's first YouTube video. Scenes are <Sequence>s over beat windows from timeline.ts;
   every visual is a function of time. Sound: the voiceover (public/audio/redirect-domain-vo.mp3, built by
   scripts/yt/vo-build.py and mastered to the channel level), a quiet generated pad under it (<Beat>, music.json
   kind "pad") and a few effects on story beats only, timed to the spoken words. */
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { FixedEndCard } from '../../components/FixedEndCard';
import { CloseScene } from './CloseScene';
import { HookScene } from './HookScene';
import { IdeasScene } from './IdeasScene';
import { TestScene } from './TestScene';
import { WalkthroughScene } from './WalkthroughScene';
import type { RedirectDomainProps } from './props';
import { TOTAL, at, sceneWindow, word } from './timeline';
import { Beat } from '../../components/Beat';
import { Sfx, type SfxCue } from '../../components/Sfx';

export const REDIRECT_DOMAIN_SECONDS = TOTAL;

/** Effects on story beats only (problem, fix, result), never on UI micro-actions. `fixed` is the
    channel's signature chime: it plays only when something broken is now right. */
const CUES: readonly SfxCue[] = [
    [at(2) + 0.9, 'whoosh', 0.35],              // the redirect line draws
    [word(2, 'land') - 0.1, 'snap', 0.4],       // the card lands on the new site
    [at(5) + 0.1, 'alert', 0.45],               // "Not secure"
    [at(7) + 0.2, 'error', 0.4],                // "gone"
    [word(9, 'Dead') - 0.05, 'error', 0.35],    // the printed QR is dead
    [at(10) + 1.2, 'swish_r', 0.4],             // title sweep
    [word(14, '301') - 0.6, 'whoosh', 0.3],     // note → 301 card
    [at(24) + 0.3, 'success', 0.35],            // the three ideas fill in
    [at(30) + 0.45, 'success', 0.4],            // redirect saved
    [word(35, 'updates') - 0.2, 'snap', 0.35],  // DNS check turns green
    [word(35, 'issued') + 0.2, 'fixed', 0.55],  // the certificate is issued: HTTPS green
    [at(39) + 0.9, 'rewind', 0.45],             // time runs backwards
    [word(41, 'there'), 'fixed', 0.5],          // padlock in the private window
    [at(47) + 0.3, 'fixed', 0.6],               // all three checks green
    [word(52, 'Now') + 0.3, 'fixed', 0.5],      // "Now it is."
    [at(53) + 0.2, 'stinger', 0.3],             // end card
];

export function RedirectDomain(props: RedirectDomainProps) {
    const { fps } = useVideoConfig();
    const seq = (key: Parameters<typeof sceneWindow>[0]) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Html5Audio src={staticFile('audio/redirect-domain-vo.mp3')} />
            <Beat volume={0.22} />
            <Sfx cues={CUES} />
            <Sequence {...seq('hook')} name="A · Hook"><HookScene {...props} /></Sequence>
            <Sequence {...seq('ideas')} name="B · Three ideas"><IdeasScene {...props} /></Sequence>
            <Sequence {...seq('walkthrough')} name="C · Walkthrough"><WalkthroughScene {...props} /></Sequence>
            <Sequence {...seq('test')} name="D · Test and checks"><TestScene {...props} /></Sequence>
            <Sequence {...seq('close')} name="D · Close"><CloseScene {...props} /></Sequence>
            <Sequence {...seq('end')} name="End card"><FixedEndCard lines={props.endLines} sub={props.endSub} qr={props.qr} /></Sequence>
        </AbsoluteFill>
    );
}
