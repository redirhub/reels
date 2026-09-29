/* "10,000 flyers printed. Then the site changed." — 30s vertical reel.
   Scene windows overlap so transitions (circle reveal, slide-up, zoom-fade)
   happen with both scenes on screen; later sequences draw on top. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
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
    // Restrained on purpose: one sound per story beat, none for UI micro-actions
    // (clicks, typing). The beat carries the rhythm; these mark the story.
    [2.33, 'impact', 0.7],   // the problem: 404
    [7.95, 'alert', 0.4],    // RedirHub catches it
    [14.35, 'success', 0.45], // the fix: saved
    [17.05, 'whoosh', 0.3],  // cut to the result
    [25.35, 'stinger', 0.45], // brand close
]

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

            {/* Beat from music.json (drop on the dashboard reveal, silence after the 404); SFX on top. */}
            <Beat />
            <Sfx cues={SOUND_CUES} />
        </AbsoluteFill>
    );
}
