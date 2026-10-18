// Write a reel's captions as SubRip, from the same caption track the video burns in.
//   npx tsx scripts/reel-srt.mts <id> <out.srt>
// The reel's timeline.ts must export CAPTIONS: { text, from, until }[] in seconds.
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const [id, out] = process.argv.slice(2);
if (!id || !out) { console.error('usage: npx tsx scripts/reel-srt.mts <id> <out.srt>'); process.exit(1); }
const { CAPTIONS } = await import(path.resolve(import.meta.dirname, `../src/remotion/reels/${id}/timeline.ts`));
const ts = (s: number) => {
    const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const srt = (CAPTIONS as { text: string; from: number; until: number }[])
    .map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.until)}\n${c.text}\n`).join('\n');
writeFileSync(out, srt);
console.log(`wrote ${out}: ${CAPTIONS.length} captions`);
