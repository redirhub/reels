/* "10,000 flyers printed. Then the site changed." — 30s vertical reel.
   Scene windows overlap so transitions (circle reveal, slide-up, zoom-fade)
   happen with both scenes on screen; later sequences draw on top. */
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { BeforeAfter } from './BeforeAfter';
import { Cta } from './Cta';
import { Hook } from './Hook';
import { Workflow } from './Workflow';
import type { QrNoReprintProps } from './props';

/** Scene windows in seconds: [start, end]. */
const SCENES = {
    hook: [0, 7.15],
    workflow: [6.55, 17.85],
    beforeAfter: [17.3, 25.9],
    cta: [25.35, 30],
} as const;

/** Sound effects at absolute seconds, synced to on-screen events. */
const SOUND_CUES: readonly SfxCue[] = [
        [2.33, 'impact', 0.9],   // 404
        [5.55, 'riser', 0.5],    // into the dashboard
        [6.2, 'whoosh', 0.5],    // circle reveal
        [7.95, 'alert', 0.55],   // monitor alert toast
        [9.65, 'click', 0.8],    // open the link
        [11.05, 'click', 0.8],   // focus the To field
        [11.8, 'typing', 0.5],   // typing the new destination (Workflow types 5.25–6.8s local)
        [14.15, 'click', 0.8],   // Save
        [14.35, 'success', 0.6], // saved
        [17.05, 'whoosh', 0.5],  // slide to before/after
        [20.45, 'success', 0.35],// after-phone lands on the sale
        [24.35, 'riser', 0.45],  // into the end card
        [25.35, 'stinger', 0.8], // end card
];

export function QrNoReprint(props: QrNoReprintProps) {
    const { fps } = useVideoConfig();
    const f = (s: number) => Math.round(s * fps);
    const seq = ([a, b]: readonly [number, number]) => ({ from: f(a), durationInFrames: f(b) - f(a) });

    return (
        <AbsoluteFill style={{ background: '#101828', fontFamily: font.sans, WebkitFontSmoothing: 'antialiased' }}>
            <Sequence {...seq(SCENES.hook)} name="Hook"><Hook {...props} /></Sequence>
            <Sequence {...seq(SCENES.workflow)} name="Workflow"><Workflow {...props} /></Sequence>
            <Sequence {...seq(SCENES.beforeAfter)} name="Before / after"><BeforeAfter {...props} /></Sequence>
            <Sequence {...seq(SCENES.cta)} name="CTA"><Cta {...props} /></Sequence>

            <Html5Audio src={staticFile('audio/qr-no-reprint-bgm.mp3')} />
            <Sfx cues={SOUND_CUES} />
        </AbsoluteFill>
    );
}
