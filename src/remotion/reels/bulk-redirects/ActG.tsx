/* Act G · Your list (beats 32–35): the summary in the film's own objects, the aside (Northway's wordmark) and the
   question over the viewer's own list, the end card. No doors after the knocks (Leo, 2026-11-14). Motion notes:
   keyframes.md (w46-Recap, w46-YourNames, w46-EndCard). */
import type { CSSProperties } from 'react';
import { prog, useTime } from '../../lib/anim';
import { FrameScene, hookIn } from './scene';
import { ease, outK, popIn, slideIn, smooth } from './kit';
import { local } from './timeline';

/** Beat 32 (v6.1). The film's three objects, joined by its draw move: the list is there from the cut; on "One import" a
    line draws into the import's review; on "Point the domains" a second line draws into Hostnames and its rows turn
    Connected, one after another. The spoken summary builds above, phrase by phrase. No door, no "listen". */
export function RecapScene() {
    const t = useTime(); const L = local('recap');
    const list = L.word(32, 'list'), imp = L.word(32, 'import'), point = L.word(32, 'point');
    const vars: Record<string, number | string> = {
        ...hookIn(t, 'r0', list - 0.25, 0.5, 14), ...hookIn(t, 'r1', imp - 0.25, 0.5, 14), ...hookIn(t, 'r2', L.readBy(point - 0.25, 7), 0.5, 14),
        '--draw-k1': 1 - ease(t, imp - 0.4, 0.45), '--o-kh1': smooth(prog(t, imp + 0.0, imp + 0.2)),
        '--draw-k2': 1 - ease(t, point - 0.4, 0.45), '--o-kh2': smooth(prog(t, point + 0.0, point + 0.2)),
    };
    for (let i = 0; i < 5; i++) vars[`--rc${i}`] = ease(t, point + 0.35 + i * 0.16, 0.35);
    return (
        <FrameScene k="Recap" vars={vars} moves={{
            1: slideIn(t, 0.1, 0.6, -30, 0),
            3: { ...popIn(t, imp - 0.2, 0.5, 0.96), transformOrigin: '1015px 590px' },
            4: slideIn(t, point - 0.2, 0.55, 30, 0),
        }} />
    );
}

/** Beats 33–34 (v6.1). No doors here. "Northway isn't a real company": Northway's wordmark, with the aside pill. On
    "Picture your own list" the wordmark leaves and the viewer's own list arrives, rows unnamed; on "Which domain would
    a customer type tonight?" one row lights amber (the visitor) and the question lands in two parts. */
export function YoursScene() {
    const t = useTime(); const L = local('yours');
    const aside = L.word(33, 'northway') - 0.2;
    const picture = L.word(34, 'picture') - 0.15;
    const card = popIn(t, 0.05, 0.6, 0.97);
    const leave = outK(t, picture - 0.2, 0.45);
    const moves: Record<number, CSSProperties> = {
        // the aside leaves with Northway's wordmark: from "Picture your own list" the frame is the viewer's
        0: (() => { const m = slideIn(t, aside, 0.6, 0, 10); return { ...m, opacity: (m.opacity as number) * leave }; })(),
        1: { ...card, opacity: (card.opacity as number) * leave, transformOrigin: '960px 450px' },
        2: slideIn(t, picture - 0.3, 0.6, 0, 24), // arrives as the wordmark leaves (a crossfade, no dip)
    };
    return <FrameScene k="YourNames" moves={moves} vars={{
        ...hookIn(t, 'hot', L.word(34, 'which') - 0.1, 0.45, 0),
        ...hookIn(t, 'q1', L.word(34, 'which') - 0.2, 0.5, 0), ...hookIn(t, 'q2', L.readBy(L.word(34, 'and') - 0.15, 5), 0.5, 0),
    }} />;
}

/** Beat 35. Cut on "If this helped": the line and the logo are there from the cut; "Links are in the description"
    lands with its words; then it holds (YouTube's end screen). */
export function EndScene() {
    const t = useTime(); const L = local('end');
    return <FrameScene k="EndCard" moves={{ 0: slideIn(t, 0.0, 0.6, 0, 20), 1: slideIn(t, L.word(35, 'links') - 0.2, 0.55, 0, 12) }} />;
}
