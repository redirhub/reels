/* Timing. Until the voiceover exists, each beat's length is estimated from its word count at
   the channel pace (155 wpm) plus a breath; a few beats carry extra visual time (title,
   stillness, rewind, end card). Phase 3 replaces `ESTIMATE` with the VO's word timestamps
   (voiceover/timings.json) and nothing else changes: scenes read beat times, never seconds. */
import { SCRIPT_BEATS } from './script';

export const WPM = 155;
/** Breath between beats, s. */
const BREATH = 0.55;
/** Visual-only time added to a beat, s (by beat number). */
const EXTRA: Record<number, number> = {
    3: 1.6,   // "It looks done." stillness
    10: 2.6,  // title card
    11: 0.4,
    24: 0.9,  // rail completes
    36: 1.0,  // quiet beat after setup
    39: 1.4,  // rewind
    42: 4.2,  // caption only (9 words → 4 s hold)
    43: 0.6,  // "Three quick checks." needs a 2 s hold
    47: 1.0,  // all three green
    52: 1.2,  // "Now it is." → cut to black
    53: 6.0,  // end card (no VO)
};

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export type Timed = { n: number; at: number; dur: number; end: number; vo: string };

/** Beats with absolute start/end, in seconds. */
export const BEATS: readonly Timed[] = (() => {
    let at = 0.6; // a breath of Night before the first word
    return SCRIPT_BEATS.map((b) => {
        const spoken = words(b.vo) ? (words(b.vo) / WPM) * 60 : 0;
        const dur = Math.max(1, spoken + (words(b.vo) ? BREATH : 0) + (EXTRA[b.n] ?? 0));
        const timed = { n: b.n, at, dur, end: at + dur, vo: b.vo };
        at += dur;
        return timed;
    });
})();

export const TOTAL = Math.ceil(BEATS[BEATS.length - 1].end);

/** Start time of beat n (absolute). */
export const at = (n: number) => BEATS[n - 1].at;
export const end = (n: number) => BEATS[n - 1].end;

/** Scene windows: [first beat, last beat]. Scenes overlap by `lap` seconds so transitions can carry both. */
export const SCENES = {
    hook: [1, 10],
    ideas: [11, 24],
    walkthrough: [25, 36],
    test: [37, 47],
    close: [48, 52],
    end: [53, 53],
} as const;
export type SceneKey = keyof typeof SCENES;

export function sceneWindow(key: SceneKey, lap = 0.4): readonly [number, number] {
    const [a, b] = SCENES[key];
    // The end card runs to the last frame so the film never ends on black.
    return [Math.max(0, at(a) - (key === 'hook' ? 0 : lap)), key === 'end' ? TOTAL : Math.min(TOTAL, end(b))];
}

/** Local time helpers for a scene: beat start/end relative to the scene's start. */
export function local(key: SceneKey) {
    const [s] = sceneWindow(key);
    return { at: (n: number) => at(n) - s, end: (n: number) => end(n) - s, start: s };
}
