/* Act G · Close (beats 30–33): the recap on the beat, the aside and the question, the end card. Motion notes:
   keyframes.md (w46-Recap, w46-YourNames, w46-EndCard). */
import type { CSSProperties } from 'react';
import { useTime } from '../../lib/anim';
import { FrameScene, hookIn } from './scene';
import { SMOOTH, ease, slideIn } from './kit';
import { local } from './timeline';

/** Beat 30. One step at a time, on the words: List on "One list", Import on "One import", Point on "Point the
    names", Listen held for the keyword line ("That's how to redirect hundreds of domains at once"). */
export function RecapScene() {
    const t = useTime(); const L = local('recap');
    const at = [L.word(30, 'list'), L.word(30, 'import'), L.word(30, 'point'), L.word(30, "that's")];
    return <FrameScene k="Recap" vars={Object.assign({}, ...at.map((a, k) => hookIn(t, `step${k}`, a - 0.3, 0.55, 26)))} />;
}

/** Beats 31–32. The aside pill fades in on "Glomvo isn't a real company" and kipzoo's door steps back; on "Picture
    your own names" four closed doors rise beside it; the question lands in two parts on its two sentences. */
export function YoursScene() {
    const t = useTime(); const L = local('yours');
    const aside = L.word(31, 'glomvo') - 0.2;
    const back = ease(t, aside, 0.9);
    const door: CSSProperties = { transform: SMOOTH(0, 0, 1.1 - 0.1 * back), transformOrigin: '245px 360px', willChange: 'transform' };
    const picture = L.word(32, 'picture') - 0.15;
    const moves: Record<number, CSSProperties> = { 0: slideIn(t, aside, 0.6, 0, 10), 1: door };
    for (let k = 0; k < 4; k++) moves[2 + k] = slideIn(t, picture + k * 0.14, 0.6, 0, 40);
    return <FrameScene k="YourNames" moves={moves} vars={{ ...hookIn(t, 'q1', L.word(32, 'which') - 0.2, 0.5, 0), ...hookIn(t, 'q2', L.word(32, 'and') - 0.15, 0.5, 0) }} />;
}

/** Beat 33. Cut on "If this helped": the line and the logo are there from the cut; "Links are in the description"
    lands with its words; then it holds (YouTube's end screen). */
export function EndScene() {
    const t = useTime(); const L = local('end');
    return <FrameScene k="EndCard" moves={{ 0: slideIn(t, 0.0, 0.6, 0, 20), 1: slideIn(t, L.word(33, 'links') - 0.2, 0.55, 0, 12) }} />;
}
