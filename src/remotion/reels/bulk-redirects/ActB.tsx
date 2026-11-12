/* Act B · The quiet pile (beats 6–8): every domain renews; the forwards live in three registrar accounts, set up
   years ago; nobody knows which ones people still type. Motion notes: keyframes.md (w46-Renewals, w46-Accounts,
   w46-Weight). */
import type { CSSProperties } from 'react';
import { prog, useTime } from '../../lib/anim';
import { FrameScene } from './scene';
import { SMOOTH, popIn, slideIn, smooth } from './kit';
import { local } from './timeline';

/** The renewal month of each domain row, in the frame's order (build_frames.py _renewals). */
const MONTHS = [2, 4, 0, 8, 5, 10, 7, 1];

/** Beat 6. The headline is there on the cut; the Renews chips arrive month by month, a slow left-to-right sweep
    under "renews every year"; the footer lands on "whether anyone uses it or not". No numbers, no alarm. */
export function RenewalsScene() {
    const t = useTime(); const L = local('renewals');
    const a = L.word(6, 'renews') - 0.1, sweep = Math.max(2.0, L.word(6, 'whether') - a);
    const moves: Record<number, CSSProperties> = { 0: slideIn(t, 0.05, 0.5, 0, 18) };
    MONTHS.forEach((m, k) => { moves[15 + 3 * k] = popIn(t, a + (m / 11) * sweep, 0.4, 0.8); });
    moves[37] = slideIn(t, L.word(6, 'whether') - 0.1, 0.5, 0, 10);
    return <FrameScene k="Renewals" moves={moves} />;
}

/** Beat 7. A registrar's forwarding settings arrive on "Most of them forward somewhere"; the line lands on "Set up
    years ago" and holds through "For Northway, that's three accounts". */
export function AccountsScene() {
    const t = useTime(); const L = local('accounts');
    return <FrameScene k="Accounts" moves={{ 0: slideIn(t, L.word(7, 'forward') - 0.3, 0.6, -30, 0), 1: slideIn(t, L.word(7, 'set') - 0.2, 0.6, 0, 24) }} />;
}

/** Beat 8. A quiet field of Northway's domains; the line lands on "which ones people still type"; on "a product you
    retired years ago" one amber visitor arrives at the retired product's corner and its halo breathes once (the
    frame's only amber). */
export function WeightScene() {
    const t = useTime(); const L = local('weight');
    const moves: Record<number, CSSProperties> = {};
    for (let i = 0; i < 15; i++) moves[i] = { opacity: smooth(prog(t, 0.05 + i * 0.035, 0.45 + i * 0.035)) };
    const a = L.word(8, 'retired') - 0.25;
    const breathe = Math.sin(Math.PI * prog(t, a + 0.4, a + 1.6));
    moves[15] = { opacity: smooth(prog(t, a, a + 0.5)) * (0.75 + 0.25 * breathe), transform: SMOOTH(0, 0, 1 + 0.14 * breathe), transformOrigin: '1118px 348px' };
    moves[16] = { ...popIn(t, a, 0.45, 0.4), transformOrigin: '1118px 348px' };
    moves[17] = slideIn(t, L.word(8, 'which') - 0.2, 0.55, 0, 20);
    return <FrameScene k="Weight" moves={moves} />;
}
