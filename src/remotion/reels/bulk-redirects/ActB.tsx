/* Act B · What waiting costs (beats 5–7): renewals as a calm, recurring pressure; one ad surface closing (a dated
   fact, with its source); the weight of one visitor. Motion notes: keyframes.md (w46-Renewals, w46-Parking, w46-Weight). */
import type { CSSProperties } from 'react';
import { prog, useTime } from '../../lib/anim';
import { FrameScene } from './scene';
import { SMOOTH, ease, popIn, slideIn, smooth } from './kit';
import { local } from './timeline';

/** The renewal month of each name row, in the frame's order (build_frames.py _renewals). */
const MONTHS = [2, 4, 0, 8, 5, 10, 7, 1];

/** Beat 5. The headline is there on the cut; the Renews chips arrive month by month, a slow left-to-right sweep
    under "Every year, each one asks for its renewal". No numbers, no alarm. */
export function RenewalsScene() {
    const t = useTime(); const L = local('renewals');
    const a = L.word(5, 'every') - 0.1, sweep = Math.max(2.2, L.word(5, 'renewal') - a);
    const moves: Record<number, CSSProperties> = { 0: slideIn(t, 0.05, 0.5, 0, 18) };
    MONTHS.forEach((m, k) => { moves[15 + 3 * k] = popIn(t, a + (m / 11) * sweep, 0.4, 0.8); });
    moves[37] = slideIn(t, L.word(5, 'renewal'), 0.5, 0, 10);
    return <FrameScene k="Renewals" moves={moves} />;
}

/** Beat 6. The sponsored blocks fade from the top down while "Parking ads used to pay part of that" is said;
    "February 10, 2026" and Google's own wording land on "February". */
export function ParkingScene() {
    const t = useTime(); const L = local('parking');
    const own = [0.9, 0.6, 0.35, 0.15];
    const a = L.word(6, 'used') - 0.1, b = L.word(6, 'that') + 0.2;
    const vars: Record<string, number> = {};
    own.forEach((o, i) => {
        // from full (0.9) to the approved level, one block after another
        const k = ease(t, a + (i / 4) * (b - a), (b - a) / 2.2);
        vars[`--o-ad${i}`] = (0.9 / o) * (1 - k) + 1 * k;
    });
    return <FrameScene k="Parking" vars={vars} moves={{ 0: slideIn(t, 0.05, 0.55, -30, 0), 1: slideIn(t, L.word(6, 'february') - 0.2, 0.6, 0, 24) }} />;
}

/** Beat 7. A quiet field of names, kipzoo.com lit among them. On "each person who comes looking" one amber visitor
    arrives at its corner and its halo breathes once (the frame's only amber). */
export function WeightScene() {
    const t = useTime(); const L = local('weight');
    const moves: Record<number, CSSProperties> = {};
    for (let i = 0; i < 15; i++) moves[i] = { opacity: smooth(prog(t, 0.05 + i * 0.035, 0.45 + i * 0.035)) };
    const a = L.word(7, 'person') - 0.25;
    const breathe = Math.sin(Math.PI * prog(t, a + 0.4, a + 1.6));
    moves[15] = { opacity: smooth(prog(t, a, a + 0.5)) * (0.75 + 0.25 * breathe), transform: SMOOTH(0, 0, 1 + 0.14 * breathe), transformOrigin: '1118px 348px' };
    moves[16] = { ...popIn(t, a, 0.45, 0.4), transformOrigin: '1118px 348px' };
    moves[17] = slideIn(t, L.word(7, 'each') - 0.15, 0.55, 0, 20);
    return <FrameScene k="Weight" moves={moves} />;
}
