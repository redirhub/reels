// Render stills of one composition at several times, bundling once.
//   node scripts/yt/stills.mjs <id> <outDir> <seconds...>
// Writes <outDir>/<id>-<seconds>s.png. CHROME_PATH as in scripts/render.mjs.
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [id, outDir, ...secs] = process.argv.slice(2);
if (!id || !outDir || !secs.length) { console.error('usage: node scripts/yt/stills.mjs <id> <outDir> <seconds...>'); process.exit(1); }
const root = path.resolve(import.meta.dirname, '../..');
const browserExecutable = process.env.CHROME_PATH || null;
await mkdir(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/remotion/index.ts') });
const comps = await getCompositions(serveUrl, { browserExecutable });
const composition = comps.find((c) => c.id === id);
if (!composition) { console.error(`unknown id ${id}`); process.exit(1); }
for (const s of secs) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
    const output = path.join(outDir, `${id}-${Number(s).toFixed(1).replace('.', '_')}s.png`);
    await renderStill({ serveUrl, composition, frame, imageFormat: 'png', browserExecutable, output });
    console.log(`${output} (frame ${frame})`);
}
