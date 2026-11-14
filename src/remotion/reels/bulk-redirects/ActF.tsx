/* Act F · Hearing the knock (beats 26–31): the knocks heard (63 visits on a misspelling), the homepage they now land
   on, the quiet domains, and the tag paying off. Motion notes: keyframes.md (w46-Knocks, w46-Price, w46-Quiet, w46-ByTag). The
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
const RAPS = [0, 0.176, 0.368];

/** Beats 26–29 (to "Now"). The open door; on "could hear the knocks" the knock sounds and its arcs leave the door,
    one per rap. The misspelling's tile arrives on "A few weeks in, one stood out" and its count rolls to the visits
    on "Sixty-three visits"; on "It had nearly been dropped at the last renewal" the sticky arrives and a pen line
    crosses it out; the line lands on "Those were customers, typing the name a little wrong", with "Channel:
    Direct". */
export function KnocksScene({ visits }: BulkRedirectsProps) {
    const t = useTime(); const L = local('knocks');
    const knock = knockAt(2) - L.start;
    const arcs: Record<string, number> = {};
    RAPS.forEach((r, k) => { arcs[`--o-knock${k}`] = smooth(prog(t, knock + r - 0.01, knock + r + 0.14)); });
    const roll = ease(t, L.word(27, 'sixtythree') - 0.1, 1.0);
    return (
        <FrameScene k="Knocks" moves={{
            0: slideIn(t, L.word(27, 'few') - 0.25, 0.55, 0, 18),
            1: slideIn(t, L.word(29, 'customers') - 0.1, 0.5, 0, 10),
            2: slideIn(t, L.readBy(L.word(29, 'those') - 0.2, 7), 0.55, 0, 16),
        }} vars={{
            ...arcs, '--count-visits': Math.round(visits * roll),
            ...hookIn(t, 'sticky', L.word(28, 'nearly') - 0.3, 0.45, 12),
            // the door is just a door until "A misspelling" names it (fresh-eyes review: it was on screen 9 s early)
            ...hookIn(t, 'dlabel', L.word(27, 'misspelling') - 0.2, 0.5, 8),
            '--clipx-strike': `${((1 - ease(t, L.word(28, 'renewal') - 0.05, 0.4)) * 100).toFixed(2)}%`,
        }} />
    );
}

/** Beat 29, from "Now". Northway's homepage; the address bar still shows the misspelling as typed, and on "they land
    on the homepage" it becomes https://northwaysoft.com with its padlock; the headline lands on "Now". */
export function PriceScene() {
    const t = useTime(); const L = local('price');
    const land = ease(t, L.word(29, 'land') - 0.1, 0.5);
    return (
        <FrameScene k="Price" moves={{
            0: slideIn(t, L.readBy(L.word(29, 'now') - 0.05, 6), 0.55, 0, 20),
            1: { ...popIn(t, 0.0, 0.6, 0.97), transformOrigin: '960px 590px' },
        }} vars={{ '--o-typed': 1 - land, '--o-url': land }} />
    );
}

/** Where each row of the approved (sorted) card starts before "stayed quiet all season" sorts them. */
const UNSORTED = [2, 6, 0, 4, 7, 1, 5, 3];
const ROW_H = 60;

/** Beat 30. The card arrives unsorted; the rows sort on "stayed quiet all season"; the headline lands on "quiet",
    the line on "At renewal time"; the amber bracket draws round the zeros on "where to look first". */
export function QuietScene() {
    const t = useTime(); const L = local('quiet');
    const sort = L.word(30, 'stayed') - 0.15;
    const vars: Record<string, string> = {};
    UNSORTED.forEach((from, i) => {
        const k = ease(t, sort + i * 0.04, 0.85);
        vars[`--y-vr${i}`] = `${((from - i) * ROW_H * (1 - k)).toFixed(2)}px`;
    });
    const look = ease(t, L.word(30, 'where') - 0.1, 0.6);
    return (
        <FrameScene k="Quiet" moves={{
            0: slideIn(t, 0.0, 0.55, -30, 0),
            1: { clipPath: `inset(0 ${(1920 - 120 - 822 * look).toFixed(1)}px 0 0)`, opacity: look > 0 ? 1 : 0 },
            2: { opacity: smooth(prog(t, 0.2, 0.6)) },
            3: slideIn(t, L.word(30, 'quiet') - 0.2, 0.55, 0, 18),
            4: slideIn(t, L.readBy(L.word(30, 'season') + 0.2, 9), 0.55, 0, 14),
        }} vars={vars} />
    );
}

/** Beat 31. The Links page; the filter applies on "Filter by its tag" (only the Product links, checked); the dialog
    docks forward on "Change it once" and its Update button rings. */
export function ByTagScene() {
    const t = useTime(); const L = local('bytag');
    const filter = L.word(31, 'filter') - 0.1, change = L.word(31, 'change') - 0.15;
    const dialog: CSSProperties = { ...popIn(t, change, 0.5, 0.94), transformOrigin: '960px 520px' };
    return (
        <FrameScene k="ByTag" hide={[1, 2, 3]} moves={{ 0: slideIn(t, L.readBy(L.word(31, 'product') - 0.1, 7), 0.55, 0, 18) }} extra={<>
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
