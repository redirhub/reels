/* Act E · One spreadsheet (beats 14–24): the list, its columns, the import in the real product (choose Import CSV,
   fix the rows that need it, review), pointing the names, and every padlock lit. Motion notes: keyframes.md
   (w46-List … w46-Padlocks). Sound: whoosh 2 into the product and the fixed chime on the last padlock
   (BulkRedirects.tsx). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, Layers, hookIn } from './scene';
import { ease, outK, popIn, slideIn, smooth } from './kit';
import { local, padlocksLit } from './timeline';

/** The newest progress segment fills (progress(): --prog). */
const fill = (t: number, a: number) => ({ '--prog': ease(t, a, 0.6) });
/** A teal ring that draws on: its alpha (the frames' --ring-* box-shadows). */
const ring = (t: number, a: number, d = 0.45) => smooth(prog(t, a, a + d));
/** The six sheet rows arriving one after another (sheet(hooks): data-o="row{i}"). */
const rows = (t: number, a: number, gap = 0.09) => Object.assign({}, ...[0, 1, 2, 3, 4, 5].map((i) => hookIn(t, `row${i}`, a + i * gap, 0.4, 10)));

/** Where Once's empty sheet sat (scaled 0.9 at 880, 300; 1016 px wide) against the List sheet (122, 360; 1616 px). */
const ONCE_SHEET = { dx: 880 - 122, dy: 300 - 360, s: (1016 * 0.9) / 1616 };

/** Beats 14–15. The sheet docks from where Once left it and grows into Step 1; the rows arrive on "One row per
    name"; the source_url column tints on "The name", the destination column on "Where it should go". */
export function ListScene() {
    const t = useTime(); const L = local('list');
    const dock = ease(t, 0.0, 1.0);
    const sheet: CSSProperties = {
        transform: `translate3d(${(ONCE_SHEET.dx * (1 - dock)).toFixed(2)}px, ${(ONCE_SHEET.dy * (1 - dock)).toFixed(2)}px, 0) scale(${ONCE_SHEET.s + (1 - ONCE_SHEET.s) * dock}) rotate(0.02deg)`,
        transformOrigin: '122px 360px', willChange: 'transform',
    };
    const perName = L.word(14, 'one', 1);
    const name = L.word(15, 'name'), where = L.word(15, 'where');
    return (
        <FrameScene k="List" moves={{
            2: slideIn(t, perName - 0.2, 0.55, 0, 22),
            3: slideIn(t, name - 0.2, 0.5, 0, 12),
            4: slideIn(t, where - 0.2, 0.5, 0, 12),
            5: sheet,
            6: { opacity: smooth(prog(t, perName + 0.4, perName + 0.8)) },
        }} vars={{
            ...fill(t, L.word(14, 'one') - 0.1), ...rows(t, perName - 0.05),
            '--tint-0': ease(t, name - 0.1, 0.5), '--tint-1': ease(t, where - 0.1, 0.5),
        }} />
    );
}

/** Beats 16–17. The tint slides from the name and destination to type on "a 302, the temporary kind"; the
    headline's first half lands on "the day a name sells", the second on "a label for a group"; the tags column
    tints on "And a tag" and the three chips light one by one on "Brandables. Short names. Premium." */
export function ColumnsScene() {
    const t = useTime(); const L = local('columns');
    const type = L.word(16, 'three') - 0.15, tag = L.word(17, 'tag') - 0.1;
    const slide = ease(t, type, 0.6);
    return (
        <FrameScene k="Columns" moves={{
            3: slideIn(t, type, 0.5, 0, 12),
            5: { opacity: smooth(prog(t, tag, tag + 0.4)) },
        }} vars={{
            '--tint-0': 1 - slide, '--tint-1': 1 - slide, '--tint-2': slide, '--tint-3': ease(t, tag, 0.5),
            ...hookIn(t, 'h1', L.word(16, 'day') - 0.2, 0.55, 20), ...hookIn(t, 'h2', L.word(17, 'label') - 0.2, 0.55, 20),
            ...hookIn(t, 'chip0', L.word(17, 'brandables') - 0.1, 0.4, 8), ...hookIn(t, 'chip1', L.word(17, 'short') - 0.1, 0.4, 8),
            ...hookIn(t, 'chip2', L.word(17, 'premium') - 0.1, 0.4, 8),
        }} />
    );
}

/** Beats 18–21, one take in the product. Step 2 on the cut (whoosh 2); the chooser docks forward over the dimmed
    dashboard on "Create" and its Import CSV ring draws on "Import CSV"; the CSV line lands on "plain spreadsheet
    file". On "Before anything is saved" the chooser docks out and the import's check docks in; its error group
    opens on "any row that needs a fix"; on "One click fixes them all" the button is pressed and the group
    clears, and the dialog turns into the review (shared element); the www row rings on "each name covers". */
export function ProductScene() {
    const t = useTime(); const L = local('product');
    const create = L.word(19, 'create'), before = L.word(20, 'before') - 0.35;
    const chooserOut = outK(t, before, 0.35);
    const chooser: CSSProperties = { ...popIn(t, create - 0.15, 0.5, 0.94), transformOrigin: '960px 560px' };
    const anyRow = L.word(20, 'any') - 0.1;
    const click = L.word(21, 'click');
    const press = Math.sin(Math.PI * prog(t, click, click + 0.22));
    const clears = click + 0.35, turn = L.word(21, 'all') - 0.05;
    const fixIn: CSSProperties = { ...popIn(t, before + 0.1, 0.5, 0.95), transformOrigin: '960px 560px' };
    const reviewIn = smooth(prog(t, turn, turn + 0.35));
    const fixOut = outK(t, turn + 0.25, 0.3);
    return (
        <FrameScene k="Import" hide={[3, 4]} vars={fill(t, L.word(18, 'two') - 0.1)}
            extra={<>
                {/* the chooser, then its CSV caption, both leaving on "Before anything is saved" */}
                <Layers k="Import" hide={[0, 1, 2]} vars={{ '--ring-csv': ring(t, L.word(19, 'import') - 0.1) }} moves={{
                    3: { ...chooser, opacity: (chooser.opacity as number) * chooserOut },
                    4: { ...slideIn(t, L.word(19, 'plain') - 0.2, 0.5, 0, 14), opacity: (slideIn(t, L.word(19, 'plain') - 0.2, 0.5, 0, 14).opacity as number) * chooserOut },
                }} />
                {/* the Import CSV breadcrumb arrives with the check: Fix's dashboard over Import's (same shell) */}
                <Layers k="Fix" hide={[0, 1, 3, 4]} moves={{ 2: { opacity: smooth(prog(t, before, before + 0.35)) } }} />
                <Layers k="Fix" hide={[0, 1, 2]} vars={{
                    '--clip-errs': `${((1 - ease(t, anyRow, 0.5)) * 100).toFixed(2)}%`, '--o-errs': smooth(prog(t, anyRow, anyRow + 0.25)) * outK(t, clears, 0.35),
                    '--y-btn': `${(press * 2).toFixed(2)}px`, '--ring-fix': 1 - 0.5 * press,
                }} moves={{ 3: { ...fixIn, opacity: (fixIn.opacity as number) * fixOut }, 4: { opacity: smooth(prog(t, before + 0.3, before + 0.7)) } }} />
                <Layers k="Review" hide={[0, 1, 2, 4]} vars={{ '--ring-www': ring(t, L.word(21, 'each') - 0.1) }}
                    moves={{ 3: { opacity: reviewIn, transform: `translate3d(0, ${((1 - reviewIn) * 10).toFixed(2)}px, 0) rotate(0.02deg)` } }} />
            </>} />
    );
}

/** Beats 22–23. Step 3 on the cut; the Connect DNS panel docks in on "DNS is the setting"; the Cloudflare row rings
    on "On Cloudflare"; the Manual tab lifts on "Elsewhere"; on "In batches, if you like" four waiting names turn
    Connected one at a time, and the one still waiting doesn't hold up the others (the caption). */
export function DnsScene() {
    const t = useTime(); const L = local('dns');
    const manual = ease(t, L.word(23, 'elsewhere') - 0.1, 0.45);
    const batch = L.word(23, 'batches') - 0.1;
    const conn: Record<string, number> = {};
    [0, 1, 2, 3].forEach((i) => { conn[`--conn-${i}`] = ease(t, batch + i * 0.3, 0.35); });
    return (
        <FrameScene k="PointDNS" moves={{ 3: slideIn(t, batch + 0.9, 0.55, 0, 14) }} vars={{
            ...fill(t, L.word(22, 'three') - 0.1), ...hookIn(t, 'panel', L.word(22, 'dns') - 0.2, 0.55, 18),
            '--ring-cf': ring(t, L.word(23, 'cloudflare') - 0.1), '--tab-manual': manual, '--tab-automatic': 1 - manual, ...conn,
        }} />
    );
}

/** Beat 24. A wall of closed doors; on "as each name connects" they open one after another, light filling each
    from the top and its padlock turning solid; the last one lands on "set up" with the fixed chime
    (timeline.ts padlocksLit); the headline lands on "renewed for it". */
export function PadlocksScene() {
    const t = useTime(); const L = local('padlocks');
    const a = L.word(24, 'each') - 0.1, last = padlocksLit() - L.start;
    const step = (last - 0.5 - a) / 11;
    const doors: Record<number, CSSProperties> = {};
    const closed: Record<string, number> = {};
    for (let k = 0; k < 12; k++) {
        const s = a + k * step;
        doors[1 + k] = { clipPath: `inset(0 0 ${((1 - ease(t, s, 0.5)) * 100).toFixed(2)}% 0)` };
        closed[`--o-pc${k}`] = 1 - smooth(prog(t, s + 0.4, s + 0.7));
    }
    return (
        <FrameScene k="Padlocks" hide={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} moves={{ 0: slideIn(t, L.word(24, 'renewed') - 0.25, 0.6, 0, 22) }}
            extra={<>
                {/* the closed wall under the opening doors */}
                <AbsoluteFill style={closed as CSSProperties}>{X.PadClosed()}</AbsoluteFill>
                <Layers k="Padlocks" hide={[0]} moves={doors} />
            </>} />
    );
}
