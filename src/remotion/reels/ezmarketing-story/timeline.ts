/* Every time in the reel comes from here, and everything here comes from one data file,
   timing.json, plus the script in props.ts.

   Text-only cut (mode "text"): there is no narration, so each script line is the caption of its beat
   and holds at reading pace, words ÷ wordsPerSecond + padSeconds. A "word time" is when a reader
   reaches that word: line start + a short settle + (words before it) ÷ pace. Picture events (a tick on
   "forwarded", the rows on "three") hang off word times, so a voiceover cut is the same reel with word
   times read from the VO's timestamps instead (mode "vo", not built yet).

   Beats are 1-based like the sync sheet: beat 1–11 = script line 1–11, beat 12 = the end card. */
import { minHold } from '../../components/OnScreenText';
import timing from './timing.json';
import { CARDS, ezMarketingDefaults } from './props';

const LINES = ezMarketingDefaults.script;
const PACE = timing.readingPace.wordsPerSecond;
/** A reader starts reading a caption this long after it appears. */
const SETTLE = 0.3;

/** Words of a line, lower-cased and stripped of punctuation ("sign-up" stays one word). */
export const words = (line: string) => line.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase().replace(/[^a-z0-9-]/g, ''));
const readTime = (line: string) => Math.max(1, words(line).length / PACE + timing.readingPace.padSeconds);

/** Reading position of a word inside line `n` (1-based), relative to the line's start. */
function wordAt(n: number, token: string, nth = 0) {
    const ws = words(LINES[n - 1]);
    let seen = -1;
    const i = ws.findIndex((w) => w === token && ++seen === nth);
    if (i < 0) throw new Error(`"${token}" is not in script line ${n}: "${LINES[n - 1]}"`);
    return SETTLE + i / PACE;
}

/** Beat 8's chips swap on their words, but each must also hold its own minimum (the hold rule):
    10 minutes → HTTPS ✓ → No server. Offsets are relative to the beat's start. */
const CHIP_WORDS = ['ten', 'https', 'no'] as const;
const CHIPS: { at: number; until: number }[] = [];
for (let i = 0; i < CHIP_WORDS.length; i++) {
    const at = Math.max(wordAt(8, CHIP_WORDS[i]), i ? CHIPS[i - 1].at + minHold(CARDS.chips[i - 1]) : 0);
    if (i) CHIPS[i - 1].until = at;
    CHIPS.push({ at, until: at + minHold(CARDS.chips[i]) });
}

/** What a beat needs beyond its reading time (its on-screen events have to fit inside it). */
const NEEDS: Record<number, number> = { 8: CHIPS[CHIPS.length - 1].until + 0.15 };

const durations = LINES.map((line, i) => Math.max(readTime(line), NEEDS[i + 1] ?? 0));
const starts: number[] = [];
durations.reduce((t, d) => (starts.push(t), t + d), timing.leadIn);

/** [start, end] of beat n in seconds (1–11: script lines; 12: the end card). */
export function beat(n: number): readonly [number, number] {
    if (n === 12) { const s = starts[10] + durations[10]; return [s, s + timing.endCard]; }
    return [starts[n - 1], starts[n - 1] + durations[n - 1]];
}

/** When a reader reaches `token` in beat n's line, in absolute seconds. */
export const word = (n: number, token: string, nth = 0) => beat(n)[0] + wordAt(n, token, nth);

/** Beat 8's chip windows in absolute seconds. */
export const chipWindow = (i: number) => [beat(8)[0] + CHIPS[i].at, beat(8)[0] + CHIPS[i].until] as const;

export const TOTAL = beat(12)[1];

/** The caption track: one script line per beat, in absolute seconds (also the .srt). */
export const CAPTIONS = LINES.map((text, i) => ({ text, from: beat(i + 1)[0], until: beat(i + 1)[1] }));
