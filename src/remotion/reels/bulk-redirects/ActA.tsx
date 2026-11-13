/* Act A · Your company (beats 1–5): the product notebook whose plan starts with "the domain", Northway and its pile
   of domains, the one website they all need to move to (new in v6), the title. Motion notes: keyframes.md
   (w46-Notebook, w46-Northway, w46-OneSite, w46-Title). */
import type { CSSProperties } from 'react';
import { prog, useTime } from '../../lib/anim';
import { FrameScene, hookIn } from './scene';
import { ease, fx, popIn, slideIn, smooth } from './kit';
import { local } from './timeline';

/** Beats 1–2. Cold open on the open notebook (Northway's habit, never a face). On "buy the domain first" the circle
    draws round the empty line after "the domain"; the rest of the plan writes itself on its words: "one for each
    country", "a few misspellings", "the old name". */
export function NotebookScene() {
    const t = useTime(); const L = local('notebook');
    // starts with the room's fade, so the open is one continuous move (a 0.1 s delay read as fade, stop, rise)
    const open = ease(t, 0.0, 1.2);
    const draw = ease(t, L.word(2, 'domain') - 0.1, 0.9);
    return (
        <FrameScene k="Notebook" moves={{ 0: fx(smooth(open * 1.3), 0, (1 - open) * 26) }}
            vars={{
                '--draw-circle': 1 - draw,
                ...hookIn(t, 'p2', L.word(2, 'country') - 0.35, 0.5, 10),
                ...hookIn(t, 'p3', L.word(2, 'misspellings') - 0.3, 0.5, 10),
                ...hookIn(t, 'p4', L.word(2, 'old') - 0.3, 0.5, 10),
            }} />
    );
}

/** Beat 3. The wordmark settles on "Northway"; the wall fills tile by tile on "owns over two hundred domains"
    (products, countries, misspellings, the old name); the line lands on "over two hundred". */
export function NorthwayScene() {
    const t = useTime(); const L = local('northway');
    const tiles: Record<string, number | string> = {};
    const a = L.word(3, 'owns') - 0.2;
    for (let i = 0; i < 12; i++) {
        const k = ease(t, a + i * 0.075, 0.42);
        tiles[`--o-t${i}`] = smooth(k * 1.4);
        tiles[`--y-t${i}`] = `${((1 - k) * 16).toFixed(2)}px`;
    }
    return (
        <FrameScene k="Northway" vars={tiles} moves={{
            0: slideIn(t, 0.15, 0.6, 0, 18), // with the cut: waiting for "Northway" left the room empty for 0.7 s
            1: slideIn(t, L.word(3, 'over') - 0.15, 0.55, 0, 22),
        }} />
    );
}

/** Beat 4 (new in v6). Six of the domains wait on the left; Northway's one website arrives on "on one website" with
    its line; on "every one of those two hundred domains needs a new destination" each domain draws a line into it
    (draw: traffic moves), one after another, and the arrow lands. One idea on screen: one website, every product. */
export function OneSiteScene() {
    const t = useTime(); const L = local('onesite');
    const moves: Record<number, CSSProperties> = {};
    for (let i = 0; i < 6; i++) moves[i] = slideIn(t, 0.05 + i * 0.06, 0.5, -30, 0);
    const site = L.word(4, 'one') - 0.2;
    moves[7] = { ...popIn(t, site, 0.6, 0.95), transformOrigin: '1330px 550px' };
    moves[8] = slideIn(t, site + 0.25, 0.6, 0, 18);
    const every = L.word(4, 'every') - 0.1;
    const vars: Record<string, number> = {};
    for (let i = 0; i < 6; i++) vars[`--draw-w${i}`] = 1 - ease(t, every + i * 0.16, 0.8);
    vars['--o-whead'] = smooth(prog(t, every + 1.4, every + 1.7));
    return <FrameScene k="OneSite" moves={moves} vars={vars} />;
}

/** Beat 5. The sheet settles in (whoosh 1 of 2, BulkRedirects.tsx); the title lands on "how do you move hundreds of
    domains at once" and holds through the question. */
export function TitleScene() {
    const t = useTime(); const L = local('title');
    const s = ease(t, 0.0, 0.9);
    return (
        <FrameScene k="Title" moves={{
            0: slideIn(t, L.word(5, 'how') - 0.25, 0.6, 0, 26),
            1: { ...fx(smooth(prog(t, 0, 0.55)), (1 - s) * 60, 0, 0.95 + 0.05 * s), transformOrigin: '1400px 540px' },
        }} />
    );
}
