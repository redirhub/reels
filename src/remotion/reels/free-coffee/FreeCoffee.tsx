/* "Free coffee?" — 12s vertical reel, no voiceover. A bait link 404s, gets a
   destination in RedirHub's redirect layer, and the same link lands on the joke.
   The URL is the object that carries every transition. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { prog } from '../../lib/anim';
import { CLICK_1, Curiosity, LOAD_404 } from './Curiosity';
import { EndCard } from './EndCard';
import { CLICK_2, LOAD_OK, Payoff } from './Payoff';
import { T, Underneath } from './Underneath';
import type { FreeCoffeeProps } from './props';

/** Scene windows in seconds: [start, end]. Each scene draws its own transition. */
const SCENES = {
    curiosity: [0, 3.4],
    underneath: [3.4, 7.3],
    payoff: [7.3, 10.2],
    end: [10.2, 12],
} as const;

const U = SCENES.underneath[0];
const P = SCENES.payoff[0];

/** Every effect is tied to a motion. The brief asks for a sound-designed short:
    the two identical clicks are the motif (fail, then succeed), so this reel
    raises the usual story-beats-only cap (see `budget` below). */
const SOUND_CUES: readonly SfxCue[] = [
    [CLICK_1, 'mouse', 0.6],         // 1 click
    [LOAD_404, 'error', 0.7],         // 2 404 (music drops out around it)
    [U + T.lift[0], 'whoosh', 0.6],  // 3 the URL leaves the browser
    [U + T.wire[0], 'ticks', 1],    // 4 the connection forms
    [U + T.snap, 'snap', 0.8],       // 5 lock: brief silence before, the full beat lands with it
    [P + CLICK_2, 'mouse', 0.6],     // 6 the same click
    [P + LOAD_OK + 0.02, 'chime', 0.9], // 7 "Nice try."
];

/** Beat ducking: [start, end, level], with 0.12s ramps. The effects carry these
    moments, so the beat steps back for them (the redirect layer, the snap, the joke). */
const DUCK: readonly (readonly [number, number, number])[] = [
    [U + 0.0, U + 2.05, 0.6],   // whoosh + ticks + pulse
    [U + T.snap, U + T.snap + 0.35, 0.45], // let the snap through, then the full beat
    [P + LOAD_OK, P + LOAD_OK + 0.9, 0.55], // chime + "Nice try."
];

function beatVolume(s: number) {
    let v = 1;
    for (const [a, b, lvl] of DUCK) {
        const k = Math.min(prog(s, a - 0.12, a), 1 - prog(s, b, b + 0.12));
        v = Math.min(v, 1 - (1 - lvl) * Math.max(0, k));
    }
    return v;
}

export function FreeCoffee(props: FreeCoffeeProps) {
    const { fps } = useVideoConfig();
    const f = (s: number) => Math.round(s * fps);
    const seq = ([a, b]: readonly [number, number]) => ({ from: f(a), durationInFrames: f(b) - f(a) });

    return (
        <AbsoluteFill style={{ background: '#0A1426', fontFamily: font.sans, WebkitFontSmoothing: 'antialiased' }}>
            <Sequence {...seq(SCENES.curiosity)} name="Curiosity + 404"><Curiosity {...props} /></Sequence>
            <Sequence {...seq(SCENES.underneath)} name="Redirect layer"><Underneath {...props} /></Sequence>
            <Sequence {...seq(SCENES.payoff)} name="Payoff"><Payoff {...props} /></Sequence>
            <Sequence {...seq(SCENES.end)} name="End card"><EndCard {...props} /></Sequence>

            <Beat volume={beatVolume} />
            <Sfx cues={SOUND_CUES} budget={{
                max: 7,
                reason: 'Owner brief (2026-10-01): a no-voiceover, sound-designed 12s short where the repeated click is the story motif.',
            }} />
        </AbsoluteFill>
    );
}
