/* Act F · What listening changed (beats 25–29): the knocks heard (63 visits, typed in), a real price, the quiet
   names, and the tag paying off. Motion notes: keyframes.md (w46-Knocks, w46-Price, w46-Quiet, w46-ByTag). The
   second knock is a sound cue (BulkRedirects.tsx) at timeline.ts knockAt(2). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, Layers, hookIn } from './scene';
import { ease, popIn, slideIn, smooth } from './kit';
import { knockAt, local } from './timeline';
import type { BulkRedirectsProps } from './props';

/** The knock's three raps, seconds after its cue (as ActD). */
const RAPS = [0, 0.101, 0.203];

/** Beats 25–26. The open door; on "could hear the knocks" the knock sounds and its arcs leave the door, one per
    rap. kipzoo's tile arrives on "A few weeks in" and its count rolls to the visits on "sixty-three visits"; the
    line lands on "Nobody sent those people", "Channel: Direct" on "They typed it in". On "It had been on last
    year's drop list" the sticky arrives and a pen line crosses it out. */
export function KnocksScene({ visits }: BulkRedirectsProps) {
    const t = useTime(); const L = local('knocks');
    const knock = knockAt(2) - L.start;
    const arcs: Record<string, number> = {};
    RAPS.forEach((r, k) => { arcs[`--o-knock${k}`] = smooth(prog(t, knock + r - 0.01, knock + r + 0.14)); });
    const roll = ease(t, L.word(25, 'sixtythree') - 0.1, 1.0);
    return (
        <FrameScene k="Knocks" moves={{
            0: slideIn(t, L.word(25, 'few') - 0.25, 0.55, 0, 18),
            1: slideIn(t, L.word(25, 'typed') - 0.2, 0.5, 0, 10),
            2: slideIn(t, L.word(25, 'nobody') - 0.2, 0.55, 0, 16),
        }} vars={{
            ...arcs, '--count-visits': Math.round(visits * roll),
            ...hookIn(t, 'sticky', L.word(26, 'drop') - 0.3, 0.45, 12),
            '--clipx-strike': `${((1 - ease(t, L.word(26, 'list') - 0.05, 0.4)) * 100).toFixed(2)}%`,
        }} />
    );
}

/** Beat 27. The same Glomvo lander; "Write to us" gives way to Buy now on "a real price" and Make an offer on
    "make-offer button"; the headline lands with the price. */
export function PriceScene() {
    const t = useTime(); const L = local('price');
    const price = L.word(27, 'real') - 0.15, offer = L.word(27, 'makeoffer') - 0.15;
    return (
        <FrameScene k="Price" moves={{
            0: slideIn(t, price - 0.1, 0.55, 0, 20),
            1: { ...popIn(t, 0.0, 0.6, 0.97), transformOrigin: '960px 590px' },
        }} vars={{ '--o-write': 1 - smooth(prog(t, price - 0.1, price + 0.2)), ...hookIn(t, 'buy', price, 0.45, 10), ...hookIn(t, 'offer', offer, 0.45, 10) }} />
    );
}

/** Where each row of the approved (sorted) card starts before "stayed quiet all season" sorts them. */
const UNSORTED = [2, 6, 0, 4, 7, 1, 5, 3];
const ROW_H = 60;

/** Beat 28. The card arrives unsorted; the rows sort on "stayed quiet all season"; the headline lands on "quiet",
    the line on "At renewal time"; the amber bracket draws round the zeros on "where to look first". */
export function QuietScene() {
    const t = useTime(); const L = local('quiet');
    const sort = L.word(28, 'stayed') - 0.15;
    const vars: Record<string, string> = {};
    UNSORTED.forEach((from, i) => {
        const k = ease(t, sort + i * 0.04, 0.85);
        vars[`--y-vr${i}`] = `${((from - i) * ROW_H * (1 - k)).toFixed(2)}px`;
    });
    const look = ease(t, L.word(28, 'where') - 0.1, 0.6);
    return (
        <FrameScene k="Quiet" moves={{
            0: slideIn(t, 0.0, 0.55, -30, 0),
            1: { clipPath: `inset(0 ${(1920 - 120 - 822 * look).toFixed(1)}px 0 0)`, opacity: look > 0 ? 1 : 0 },
            2: { opacity: smooth(prog(t, 0.2, 0.6)) },
            3: slideIn(t, L.word(28, 'quiet') - 0.2, 0.55, 0, 18),
            4: slideIn(t, L.word(28, 'renewal') - 0.2, 0.55, 0, 14),
        }} vars={vars} />
    );
}

/** Beat 29. The Links page; the filter applies on "Filter by the tag" (only the Brandables, checked); the dialog
    docks forward on "Change it once" and its Update button rings. */
export function ByTagScene() {
    const t = useTime(); const L = local('bytag');
    const filter = L.word(29, 'filter') - 0.1, change = L.word(29, 'change') - 0.15;
    const dialog: CSSProperties = { ...popIn(t, change, 0.5, 0.94), transformOrigin: '960px 520px' };
    return (
        <FrameScene k="ByTag" hide={[1, 2, 3]} moves={{ 0: slideIn(t, filter - 0.1, 0.55, 0, 18) }} extra={<>
            {/* each state over the last, opaque (no half-and-half dip): all links, filtered and checked, then the dialog */}
            <AbsoluteFill>{X.ByTagAll()}</AbsoluteFill>
            <AbsoluteFill style={{ opacity: smooth(prog(t, filter, filter + 0.4)) }}>{X.ByTagPicked()}</AbsoluteFill>
            <Layers k="ByTag" hide={[0]} vars={{ '--ring-upd': smooth(prog(t, change + 0.4, change + 0.8)) }} moves={{
                1: { opacity: smooth(prog(t, change, change + 0.35)) },
                2: dialog,
                3: { opacity: smooth(prog(t, filter + 0.2, filter + 0.6)) },
            }} />
        </>} />
    );
}
