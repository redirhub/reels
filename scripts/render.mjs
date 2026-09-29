// Render every reel (or the ids given as arguments) to out/<id>.mp4, plus a
// cover image out/<id>.jpg for the gallery and social thumbnails.
//
//   npm run render                 # all reels
//   npm run render -- qr-no-reprint
//
// CHROME_PATH=/path/to/chromium uses an installed browser instead of Remotion's download.
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'out');
const browserExecutable = process.env.CHROME_PATH || null;
/** Second of each reel used as the cover image. */
const COVER_AT_SECONDS = 2.5;

await mkdir(outDir, { recursive: true });
console.log('Bundling…');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/remotion/index.ts') });

const all = await getCompositions(serveUrl, { browserExecutable });
const wanted = process.argv.slice(2);
const unknown = wanted.filter((id) => !all.some((c) => c.id === id));
if (unknown.length) {
    console.error(`Unknown reel id(s): ${unknown.join(', ')}. Known: ${all.map((c) => c.id).join(', ')}`);
    process.exit(1);
}

for (const composition of all.filter((c) => !wanted.length || wanted.includes(c.id))) {
    // The beat is generated for a fixed length; catch a reel retimed without regenerating it.
    const musicFile = path.join(root, 'src/remotion/reels', composition.id, 'music.json');
    if (existsSync(musicFile)) {
        const music = JSON.parse(await readFile(musicFile, 'utf8'));
        const seconds = composition.durationInFrames / composition.fps;
        if (Math.abs(music.duration - seconds) > 0.01) {
            console.error(`${composition.id}: music.json duration is ${music.duration}s but the reel is ${seconds}s. Update it and run \`npm run audio\`.`);
            process.exit(1);
        }
        if (!existsSync(path.join(root, 'public/audio', `${composition.id}-beat.mp3`))) {
            console.error(`${composition.id}: public/audio/${composition.id}-beat.mp3 is missing. Run \`npm run audio\`.`);
            process.exit(1);
        }
    }
    const file = path.join(outDir, `${composition.id}.mp4`);
    let last = -1;
    await renderMedia({
        serveUrl,
        composition,
        codec: 'h264',
        crf: 18,
        pixelFormat: 'yuv420p',
        colorSpace: 'bt709', // tagged BT.709 so phones show brand colors correctly
        imageFormat: 'jpeg',
        jpegQuality: 95,
        audioCodec: 'aac',
        audioBitrate: '192k',
        enforceAudioTrack: true,
        browserExecutable,
        outputLocation: file,
        onProgress: ({ progress }) => {
            const pct = Math.floor(progress * 10) * 10;
            if (pct !== last) {
                last = pct;
                console.log(`${composition.id}: ${pct}%`);
            }
        },
    });
    await renderStill({
        serveUrl,
        composition,
        frame: Math.round(COVER_AT_SECONDS * composition.fps),
        imageFormat: 'jpeg',
        jpegQuality: 90,
        browserExecutable,
        output: path.join(outDir, `${composition.id}.jpg`),
    });
    console.log(`wrote ${path.relative(root, file)}`);
}
