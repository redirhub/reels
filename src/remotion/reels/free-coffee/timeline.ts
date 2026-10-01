/* One continuous browser shot, timed like a screen recording. Every time is in
   absolute seconds; every position is in composition pixels (inside the camera). */
import { easeInOut, lerp, prog } from '../../lib/anim';

export const T = {
    // Tab A: the brand's page with the link → click → redirect → 404.
    click1: 1.3,
    hop1: 1.5, // the redirect is followed: address bar shows the old destination
    fail: 1.62,
    // Tab B: RedirHub.
    toB: 3.3,
    errorPulse: 3.8,
    pencil: 4.55,
    editIn: [4.62, 5.02],
    fieldClick: 5.5,
    selectAll: 5.58,
    typing: [5.78, 7.25],
    save: 8.0,
    saved: 8.2,
    editOut: [8.35, 8.75],
    rowFlash: 8.75,
    // Back to tab A: Back, then the same click on the same link.
    toA: 9.75,
    back: 10.3,
    click2: 10.9,
    hop2: 11.06,
    ok: 11.18,
    // Brand close.
    end: 13.4,
    total: 16.0,
} as const;

/** Browser window and its parts. */
export const WIN = { x: 40, y: 230, w: 1000, h: 1360, r: 36 } as const;
export const TABS_H = 76;
export const BAR_H = 84;
/** Page content box (below the toolbar). Pages lay out in their own coordinates from here. */
export const PAGE = { x: WIN.x, y: WIN.y + TABS_H + BAR_H, w: WIN.w, h: WIN.h - TABS_H - BAR_H } as const;

/** Tab rects (stage coords). */
export const TAB_W = 320;
export const TAB_A = { x: 150, y: WIN.y + 14, w: TAB_W, h: TABS_H - 14 } as const;
export const TAB_B = { x: 478, y: WIN.y + 14, w: TAB_W, h: TABS_H - 14 } as const;
const BAR_Y = WIN.y + TABS_H + BAR_H / 2;
export const BACK_BTN = { x: 92, y: BAR_Y } as const;

/* Page-local layout, shared by the pages and the cursor targets. */
export const LINK_Y = 510; // the link on the brand page
export const ROW = { top: 316, h: 146, gap: 14, x: 30, w: 940 } as const;
export const rowTop = (i: number) => ROW.top + i * (ROW.h + ROW.gap);
export const BROKEN_ROW = 1; // second row
export const PENCIL_X = 874;
export const FIELD = { top: 214, h: 88 } as const; // Destination URL input
export const SAVE_BTN = { top: 1088, h: 94 } as const;

/** Page-local → stage. */
export const stage = (x: number, y: number) => ({ x: PAGE.x + x, y: PAGE.y + y });

const brokenRowY = stage(0, rowTop(BROKEN_ROW) + ROW.h / 2).y;
const fieldY = stage(0, FIELD.top + FIELD.h / 2).y;
const saveY = stage(0, SAVE_BTN.top + SAVE_BTN.h / 2).y;
const linkY = stage(0, LINK_Y).y;

/** [t, x, y]: cursor tip. */
export const CURSOR: readonly (readonly [number, number, number])[] = [
    [0, 930, 1560],
    [0.35, 930, 1560],
    [1.15, 640, linkY + 12],
    [1.4, 640, linkY + 12],
    [1.95, 860, 1330],
    [2.9, 860, 1330],
    [3.22, TAB_B.x + 180, TAB_B.y + 32],
    [3.8, TAB_B.x + 190, TAB_B.y + 70],
    [4.38, stage(PENCIL_X, 0).x, brokenRowY],
    [5.1, stage(PENCIL_X, 0).x, brokenRowY],
    [5.42, 720, fieldY + 4],
    [5.62, 720, fieldY + 4],
    [5.9, 800, fieldY + 70],
    [7.3, 800, fieldY + 70],
    [7.85, 560, saveY],
    [9.3, 560, saveY],
    [9.65, TAB_A.x + 160, TAB_A.y + 32],
    [9.85, TAB_A.x + 150, TAB_A.y + 40],
    [10.18, BACK_BTN.x, BACK_BTN.y],
    [10.4, BACK_BTN.x + 10, BACK_BTN.y + 10],
    [10.78, 640, linkY + 12],
];
export const CLICKS = [T.click1, T.toB, T.pencil, T.fieldClick, T.save, T.toA, T.back, T.click2] as const;

/** Camera: [t, scale, focus x, focus y]. The focus point is drawn at the frame center. */
const CAMERA: readonly (readonly [number, number, number, number])[] = [
    [0, 1.12, 540, linkY + 10],
    [T.click1 - 0.05, 1.14, 540, linkY + 10],
    [T.fail + 0.05, 1, 540, 960],
    [T.toB - 0.1, 1.02, 540, 960],
    [T.toB + 0.25, 1, 540, 960],
    [T.errorPulse - 0.05, 1, 540, 960],
    [T.errorPulse + 0.45, 1.2, 560, brokenRowY],
    [T.pencil + 0.05, 1.2, 560, brokenRowY],
    [T.editIn[1], 1, 540, 960],
    [T.editIn[1] + 0.12, 1, 540, 960],
    [T.fieldClick, 1.15, 540, fieldY - 28],
    [T.typing[1] + 0.05, 1.15, 540, fieldY - 28],
    [T.save - 0.25, 1, 540, 960],
    [T.editOut[1], 1, 540, 960],
    [T.rowFlash + 0.35, 1.18, 560, brokenRowY],
    [T.toA - 0.45, 1.18, 560, brokenRowY],
    [T.toA - 0.05, 1, 540, 960],
    [T.back + 0.1, 1, 540, 960],
    [T.click2 - 0.05, 1.1, 540, linkY + 10],
    [T.ok + 0.1, 1, 540, 960],
    [T.end, 1.06, 540, 920],
];

export function camera(t: number) {
    let k = CAMERA[CAMERA.length - 1];
    let s = k[1], fx = k[2], fy = k[3];
    for (let i = 1; i < CAMERA.length; i++) {
        const [t1, s1, x1, y1] = CAMERA[i];
        const [t0, s0, x0, y0] = CAMERA[i - 1];
        if (t <= t1) {
            const e = easeInOut(prog(t, t0, t1));
            s = lerp(s0, s1, e); fx = lerp(x0, x1, e); fy = lerp(y0, y1, e);
            break;
        }
    }
    if (t <= CAMERA[0][0]) [s, fx, fy] = [CAMERA[0][1], CAMERA[0][2], CAMERA[0][3]];
    // A small punch on the save: the fix lands.
    const punch = t > T.saved && t < T.saved + 0.35 ? Math.sin(prog(t, T.saved, T.saved + 0.35) * Math.PI) * 0.025 : 0;
    s *= 1 + punch;
    return `translate(540px, 960px) scale(${s}) translate(${-fx}px, ${-fy}px)`;
}

/** Text typed across [a, b]. */
export const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.round(prog(t, a, b) * text.length));
