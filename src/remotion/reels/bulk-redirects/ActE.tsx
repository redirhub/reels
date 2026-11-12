/* Act E · One spreadsheet (beats 16–25): the file, its columns, the import in the real product (choose Import CSV,
   fix the rows that need it, review), pointing the domains, and every padlock lit. No step labels (v6). Motion notes: keyframes.md
   (w46-List … w46-Padlocks). Sound: whoosh 2 into the product and the fixed chime on the last padlock
   (BulkRedirects.tsx). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, Layers, fillDown, hookIn } from './scene';
import { ease, outK, popIn, slideIn, smooth } from './kit';
import { local, padlocksLit } from './timeline';

/** A teal ring that draws on: its alpha (the frames' --ring-* box-shadows). */
const ring = (t: number, a: number, d = 0.45) => smooth(prog(t, a, a + d));
/** The six sheet rows arriving one after another (sheet(hooks): data-o="row{i}"). */
const rows = (t: number, a: number, gap = 0.09) => Object.assign({}, ...[0, 1, 2, 3, 4, 5].map((i) => hookIn(t, `row${i}`, a + i * gap, 0.4, 10)));

/** Where Once's empty sheet sat (scaled 0.9 at 880, 300; 1016 px wide) against the List sheet (122, 360; 1616 px). */
const ONCE_SHEET = { dx: 880 - 122, dy: 300 - 360, s: (1016 * 0.9) / 1616 };
/** The List sheet's body rows (composition px): the first starts under the header at y 501, 57 px a row. */
const ROW = (i: number) => 501 + i * 57;

/** Beat 16. The file docks from where Once left it and grows; the rows arrive and the domain column tints on "Each
    row is one domain", the destination column on "where it should go". Then a ring walks the rows the voice
    names: the old product name, the country domains, the misspellings. */
export function ListScene() {
    const t = useTime(); const L = local('list');
    const dock = ease(t, 0.0, 1.0);
    const sheet: CSSProperties = {
        transform: `translate3d(${(ONCE_SHEET.dx * (1 - dock)).toFixed(2)}px, ${(ONCE_SHEET.dy * (1 - dock)).toFixed(2)}px, 0) scale(${ONCE_SHEET.s + (1 - ONCE_SHEET.s) * dock}) rotate(0.02deg)`,
        transformOrigin: '122px 360px', willChange: 'transform',
    };
    const each = L.word(16, 'each'), one = L.word(16, 'one'), where = L.word(16, 'where');
    // the ring: on the old product's row, then the two country rows, then the two misspellings
    const r1 = ease(t, L.word(16, 'country') - 0.2, 0.45), r2 = ease(t, L.word(16, 'misspellings') - 0.2, 0.45);
    const top = ROW(0) + (ROW(2) - ROW(0)) * r1 + (ROW(4) - ROW(2)) * r2;
    const h = 57 + 57 * Math.min(1, r1 * 2);
    const ringIn = smooth(prog(t, L.word(16, 'old') - 0.2, L.word(16, 'old') + 0.2));
    return (
        <FrameScene k="List" moves={{
            0: slideIn(t, each - 0.25, 0.55, 0, 22),
            1: slideIn(t, one - 0.2, 0.5, 0, 12),
            2: slideIn(t, where - 0.2, 0.5, 0, 12),
            3: sheet,
            4: { opacity: smooth(prog(t, each + 0.4, each + 0.8)) },
        }} vars={{ ...rows(t, each - 0.05), '--tint-0': ease(t, one - 0.1, 0.5), '--tint-1': ease(t, where - 0.1, 0.5) }}
            extra={<div style={{ position: 'absolute', left: 178, width: 1560, top, height: h, borderRadius: 6, boxShadow: 'inset 0 0 0 3px #20A795', opacity: ringIn }} />} />
    );
}

/** Beats 17–19. The tint slides to the type column on "A 301, the permanent kind" and the headline's first half
    lands on "because these moves are for good"; the tags column tints on "And a tag", the second half lands on "a
    short label for the group", and the three chips light one by one on "Product. Country. Typo." The file holds
    through "That one file is the whole plan". */
export function ColumnsScene() {
    const t = useTime(); const L = local('columns');
    const type = L.word(17, 'three') - 0.15, tag = L.word(18, 'tag') - 0.1;
    const slide = ease(t, type, 0.6);
    return (
        <FrameScene k="Columns" moves={{
            1: slideIn(t, type, 0.5, 0, 12),
            3: { opacity: smooth(prog(t, tag, tag + 0.4)) },
        }} vars={{
            '--tint-0': 1 - slide, '--tint-1': 1 - slide, '--tint-2': slide, '--tint-3': ease(t, tag, 0.5),
            ...hookIn(t, 'h1', L.word(17, 'because') - 0.2, 0.55, 20), ...hookIn(t, 'h2', L.word(18, 'label') - 0.2, 0.55, 20),
            ...hookIn(t, 'chip0', L.word(18, 'product') - 0.1, 0.4, 8), ...hookIn(t, 'chip1', L.word(18, 'country') - 0.1, 0.4, 8),
            ...hookIn(t, 'chip2', L.word(18, 'typo') - 0.1, 0.4, 8),
        }} />
    );
}

/** Beats 20–22, one take in the product (whoosh 2 on the cut). The chooser docks forward over the dimmed dashboard on
    "Create" and its Import CSV ring draws on "Import CSV"; the CSV line lands on "plain spreadsheet file". On
    "Before anything is saved" the chooser docks out and the import's check docks in; its error group opens on "any
    row that needs a second look"; on "One click fixes all of them" the button is pressed and the group clears, and
    the dialog turns into the review (shared element); the www row rings on "each domain's www version". */
export function ProductScene() {
    const t = useTime(); const L = local('product');
    const create = L.word(20, 'create'), before = L.word(21, 'before') - 0.35;
    const chooserOut = outK(t, before, 0.35);
    const chooser: CSSProperties = { ...popIn(t, create - 0.15, 0.5, 0.94), transformOrigin: '960px 560px' };
    // it docks back (a touch smaller) and is gone before the check docks in: two half-transparent dialogs read as a mess
    if (t > before) chooser.transform = `scale(${0.97 + 0.03 * chooserOut}) rotate(0.02deg)`;
    const anyRow = L.word(21, 'any') - 0.1;
    const click = L.word(22, 'click');
    const press = Math.sin(Math.PI * prog(t, click, click + 0.22));
    const clears = click + 0.35, turn = L.word(22, 'all') - 0.05;
    const fixIn: CSSProperties = { ...popIn(t, before + 0.22, 0.5, 0.95), transformOrigin: '960px 560px' };
    const reviewIn = smooth(prog(t, turn, turn + 0.35));
    const fixOut = outK(t, turn + 0.25, 0.3);
    const csv = slideIn(t, L.word(20, 'plain') - 0.2, 0.5, 0, 14);
    return (
        <FrameScene k="Import" hide={[1, 2]}
            extra={<>
                {/* the chooser, then its CSV caption, both leaving on "Before anything is saved" */}
                <Layers k="Import" hide={[0]} vars={{ '--ring-csv': ring(t, L.word(20, 'import') - 0.1) }} moves={{
                    1: { ...chooser, opacity: (chooser.opacity as number) * chooserOut },
                    2: { ...csv, opacity: (csv.opacity as number) * chooserOut },
                }} />
                {/* the Import CSV breadcrumb arrives with the check: Fix's dashboard over Import's (same shell) */}
                <Layers k="Fix" hide={[1, 2]} moves={{ 0: { opacity: smooth(prog(t, before, before + 0.35)) } }} />
                <Layers k="Fix" hide={[0]} vars={{
                    '--clip-errs': `${((1 - ease(t, anyRow, 0.5)) * 100).toFixed(2)}%`, '--o-errs': smooth(prog(t, anyRow, anyRow + 0.25)) * outK(t, clears, 0.35),
                    '--y-btn': `${(press * 2).toFixed(2)}px`, '--ring-fix': 1 - 0.5 * press,
                }} moves={{ 1: { ...fixIn, opacity: (fixIn.opacity as number) * fixOut }, 2: { opacity: smooth(prog(t, before + 0.3, before + 0.7)) } }} />
                <Layers k="Review" hide={[0, 2]} vars={{ '--ring-www': ring(t, L.word(22, 'each') - 0.1) }}
                    moves={{ 1: { opacity: reviewIn, transform: `translate3d(0, ${((1 - reviewIn) * 10).toFixed(2)}px, 0) rotate(0.02deg)` } }} />
            </>} />
    );
}

/** Beats 23–24. Hostnames on the cut; the Connect DNS panel docks in on "That's DNS"; the Cloudflare row rings on "On
    Cloudflare"; the Manual tab lifts on "Elsewhere"; on "In batches, if you like" four waiting domains turn Connected
    one at a time, and the one still waiting doesn't hold up the others (the caption). */
export function DnsScene() {
    const t = useTime(); const L = local('dns');
    const manual = ease(t, L.word(24, 'elsewhere') - 0.1, 0.45);
    const batch = L.word(24, 'batches') - 0.1;
    const conn: Record<string, number> = {};
    [0, 1, 2, 3].forEach((i) => { conn[`--conn-${i}`] = ease(t, batch + i * 0.3, 0.35); });
    return (
        <FrameScene k="PointDNS" moves={{ 1: slideIn(t, batch + 0.9, 0.55, 0, 14) }} vars={{
            ...hookIn(t, 'panel', L.word(23, 'dns') - 0.2, 0.55, 18),
            '--ring-cf': ring(t, L.word(24, 'cloudflare') - 0.1), '--tab-manual': manual, '--tab-automatic': 1 - manual, ...conn,
        }} />
    );
}

/** Beat 25. A wall of closed doors; on "as each domain connects" they open one after another, light filling each
    from the top and its padlock turning solid; the last one lands on "set up" with the fixed chime
    (timeline.ts padlocksLit); the headline lands on "renewed for it". */
export function PadlocksScene() {
    const t = useTime(); const L = local('padlocks');
    const a = L.word(25, 'each') - 0.1, last = padlocksLit() - L.start;
    const step = (last - 0.5 - a) / 11;
    const doors: Record<number, CSSProperties> = {};
    const closed: Record<string, number> = {};
    for (let k = 0; k < 12; k++) {
        const s = a + k * step;
        // each door's own light box: its glow (y 235–512 in row 0) and label, 320 px a row
        doors[1 + k] = fillDown(235 + Math.floor(k / 6) * 320, 520 + Math.floor(k / 6) * 320, ease(t, s, 0.55), 30);
        closed[`--o-pc${k}`] = 1 - smooth(prog(t, s + 0.4, s + 0.7));
    }
    return (
        <FrameScene k="Padlocks" hide={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} moves={{ 0: slideIn(t, L.word(25, 'renewed') - 0.25, 0.6, 0, 22) }}
            extra={<>
                {/* the closed wall under the opening doors */}
                <AbsoluteFill style={closed as CSSProperties}>{X.PadClosed()}</AbsoluteFill>
                <Layers k="Padlocks" hide={[0]} moves={doors} />
            </>} />
    );
}
