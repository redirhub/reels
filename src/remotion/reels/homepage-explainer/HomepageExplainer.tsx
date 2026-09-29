/* "What is RedirHub?" — 60s landscape explainer for the redirhub.com homepage.
   Scene windows overlap so each transition has both scenes on screen; later
   sequences draw on top. The beat drops at 11.9 s (music.json), so the product chapters are
   fully in from the dashboard reveal. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
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

/** Sound effects at absolute seconds, synced to on-screen events. Restrained on
    purpose: one per story beat, none for clicks or typing (the beat carries rhythm). */
const SOUND_CUES: readonly SfxCue[] = [
    [3.0, 'impact', 0.7],     // the first link breaks
    [5.9, 'whoosh', 0.35],    // into the idea
    [11.9, 'whoosh', 0.4],    // into the product (the beat drops here)
    [16.75, 'success', 0.45], // 01 redirect saved
    [25.2, 'success', 0.45],  // 02 CSV imported
    [37.9, 'alert', 0.4],     // 04 monitoring catches a broken link
    [40.8, 'success', 0.45],  // ...and it's fixed
    [43.9, 'whoosh', 0.35],   // recap: every link works
    [53.9, 'stinger', 0.45],  // brand close
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

            <Beat />
            <Sfx cues={SOUND_CUES} />
        </AbsoluteFill>
    );
}
