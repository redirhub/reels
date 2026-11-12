/* Act A · Imagine (beats 1–4): the founder's notebook with its empty name line, Glomvo and its wall of names, the
   title. Motion notes: keyframes.md (w46-Notebook, w46-Glomvo, w46-Title). */
import { prog, useTime } from '../../lib/anim';
import { FrameScene } from './scene';
import { ease, fx, slideIn, smooth } from './kit';
import { local } from './timeline';

/** Beats 1–2. Cold open on the open notebook; on "…is the name" the circle draws round the empty line. */
export function NotebookScene() {
    const t = useTime(); const L = local('notebook');
    // starts with the room's fade, so the open is one continuous move (a 0.1 s delay read as fade, stop, rise)
    const open = ease(t, 0.0, 1.2);
    const draw = ease(t, L.word(2, 'look') - 0.05, 0.9);
    return (
        <FrameScene k="Notebook" moves={{ 0: fx(smooth(open * 1.3), 0, (1 - open) * 26) }}
            vars={{ '--draw-circle': 1 - draw }} />
    );
}

/** Beat 3. The wordmark settles on "Glomvo", the line rises on "small", the wall fills tile by tile on "buys
    names like that" (kipzoo.com among them, unmarked). */
export function GlomvoScene() {
    const t = useTime(); const L = local('glomvo');
    const tiles: Record<string, number | string> = {};
    const a = L.word(3, 'buys') - 0.1;
    for (let i = 0; i < 12; i++) {
        const k = ease(t, a + i * 0.075, 0.42);
        tiles[`--o-t${i}`] = smooth(k * 1.4);
        tiles[`--y-t${i}`] = `${((1 - k) * 16).toFixed(2)}px`;
    }
    return (
        <FrameScene k="Glomvo" vars={tiles} moves={{
            0: slideIn(t, L.word(3, 'glomvo') - 0.2, 0.55, 0, 18),
            1: slideIn(t, L.word(3, 'small') - 0.1, 0.5, 0, 22),
        }} />
    );
}

/** Beat 4. The sheet settles in as the wall's names become its rows (whoosh 1 of 2, BulkRedirects.tsx); the title
    lands on "how to redirect". */
export function TitleScene() {
    const t = useTime(); const L = local('title');
    const s = ease(t, 0.0, 0.9);
    return (
        <FrameScene k="Title" moves={{
            0: slideIn(t, L.word(4, 'how') - 0.25, 0.6, 0, 26),
            1: { ...fx(smooth(prog(t, 0, 0.55)), (1 - s) * 60, 0, 0.95 + 0.05 * s), transformOrigin: '1400px 540px' },
        }} />
    );
}
