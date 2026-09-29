/* "What is RedirHub?" — 60s landscape explainer for the redirhub.com homepage.
   Scene windows overlap so each transition has both scenes on screen; later
   sequences draw on top. Music bars land on 0.4 + 2k s, so every chapter is
   fully in on a downbeat (12.4, 20.4, 28.4, …). */
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { BrandedLinks } from './BrandedLinks';
import { Cta } from './Cta';
import { Domains } from './Domains';
import { Hook } from './Hook';
import { Idea } from './Idea';
import { Migrate } from './Migrate';
import { Monitor } from './Monitor';
import { Proof } from './Proof';
import { Recap } from './Recap';
import type { HomepageExplainerProps } from './props';

/** Scene windows in seconds: [start, end]. */
const SCENES = {
    hook: [0, 6.3],
    idea: [5.9, 12.3],
    domains: [11.9, 20.3],
    migrate: [19.9, 28.3],
    links: [27.9, 36.3],
    monitor: [35.9, 44.3],
    recap: [43.9, 48.3],
    proof: [47.9, 54.3],
    cta: [53.9, 60],
} as const;

/** Sound effects at absolute seconds, synced to on-screen events. */
const SOUND_CUES: readonly SfxCue[] = [
    [3.0, 'impact', 0.8],        // first link breaks
    [3.25, 'click', 0.6], [3.5, 'click', 0.6], [3.75, 'click', 0.6],
    [5.2, 'riser', 0.45],        // into the idea
    [5.9, 'whoosh', 0.5],
    [9.1, 'click', 0.55],        // destination swaps
    [10.3, 'click', 0.55],
    [11.2, 'riser', 0.45],       // into the product
    [11.9, 'whoosh', 0.5],
    // 01 Domain redirects (+11.9)
    [13.5, 'click', 0.8], [13.6, 'typing-short', 0.45],
    [14.9, 'click', 0.8], [15.0, 'typing-short', 0.45],
    [16.6, 'click', 0.8], [16.75, 'success', 0.55],
    // 02 Website migrations (+19.9)
    [19.9, 'whoosh', 0.45],
    [21.6, 'click', 0.8],        // CSV dropped
    [22.4, 'key', 0.6], [22.7, 'key', 0.6], [23.0, 'key', 0.6], [23.3, 'key', 0.6], [23.6, 'key', 0.6],
    [25.1, 'click', 0.8], [25.2, 'success', 0.55],
    // 03 Branded links & QR (+27.9)
    [27.9, 'whoosh', 0.45],
    [29.7, 'click', 0.8], [30.25, 'typing-short', 0.45],
    [32.0, 'click', 0.8], [32.1, 'success', 0.55],
    // 04 Monitoring (+35.9)
    [35.9, 'whoosh', 0.45],
    [37.9, 'alert', 0.55],
    [39.1, 'click', 0.7], [39.22, 'click', 0.7], [39.5, 'typing-short', 0.45],
    [40.8, 'success', 0.55],
    // Recap, proof, CTA
    [43.9, 'whoosh', 0.5],
    [44.9, 'success', 0.4],
    [47.9, 'whoosh', 0.45],
    [49.2, 'click', 0.5], [49.5, 'click', 0.5], [49.8, 'click', 0.5], [50.1, 'click', 0.5],
    [53.1, 'riser', 0.45],
    [53.9, 'stinger', 0.8],
];

export function HomepageExplainer(props: HomepageExplainerProps) {
    const { fps } = useVideoConfig();
    const f = (s: number) => Math.round(s * fps);
    const seq = ([a, b]: readonly [number, number]) => ({ from: f(a), durationInFrames: f(b) - f(a) });

    return (
        <AbsoluteFill style={{ background: '#101828', fontFamily: font.sans, WebkitFontSmoothing: 'antialiased' }}>
            <Sequence {...seq(SCENES.hook)} name="Hook"><Hook {...props} /></Sequence>
            <Sequence {...seq(SCENES.idea)} name="Idea"><Idea {...props} /></Sequence>
            <Sequence {...seq(SCENES.domains)} name="01 Domain redirects"><Domains {...props} /></Sequence>
            <Sequence {...seq(SCENES.migrate)} name="02 Website migrations"><Migrate {...props} /></Sequence>
            <Sequence {...seq(SCENES.links)} name="03 Branded links & QR"><BrandedLinks {...props} /></Sequence>
            <Sequence {...seq(SCENES.monitor)} name="04 Monitoring"><Monitor {...props} /></Sequence>
            <Sequence {...seq(SCENES.recap)} name="Recap"><Recap {...props} /></Sequence>
            <Sequence {...seq(SCENES.proof)} name="Proof"><Proof {...props} /></Sequence>
            <Sequence {...seq(SCENES.cta)} name="CTA"><Cta /></Sequence>

            <Html5Audio src={staticFile('audio/homepage-explainer-bgm.mp3')} />
            <Sfx cues={SOUND_CUES} />
        </AbsoluteFill>
    );
}
