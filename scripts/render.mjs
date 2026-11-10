// Render every reel (or the ids given as arguments) to out/<id>.mp4, plus a
// cover image out/<id>.jpg for the gallery and social thumbnails.
//
//   npm run render                 # all reels
//   npm run render -- qr-no-reprint
//
// CHROME_PATH=/path/to/chromium uses an installed browser instead of Remotion's download.
// RENDER_SEGMENT_FRAMES=1800 renders the video in segments of that many frames, joined without
// re-encoding (CI sets it). Remotion streams frames straight to the encoder only when the machine has
// about 4 GB of free memory for 1080p; otherwise it keeps every frame on disk as an image until the end,
// and a 5-minute video's PNG frames fill a small disk. Segments keep at most one segment's frames on disk.
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'out');
const browserExecutable = process.env.CHROME_PATH || null;
/** Second of each reel used as the cover image. */
const COVER_AT_SECONDS = 2.5;
const SEGMENT = Number(process.env.RENDER_SEGMENT_FRAMES) || 0;
/** Remotion's own ffmpeg (the one it encodes with), so the render needs nothing installed. */
const ffmpeg = (...args) => execFileSync(path.join(root, 'node_modules/.bin/remotion'), ['ffmpeg', '-v', 'error', '-y', ...args], { stdio: 'inherit' });

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
    // 16:9 YouTube videos are long, gradient-heavy and re-encoded by YouTube: capture frames losslessly
    // (JPEG frames block up smooth gradients) and encode at a higher quality, so rooms stay free of bands.
    const youtube = composition.width > composition.height;
    const video = {
        serveUrl,
        composition,
        codec: 'h264',
        crf: youtube ? 15 : 18,
        x264Preset: youtube ? 'slow' : 'medium',
        pixelFormat: 'yuv420p',
        colorSpace: 'bt709', // tagged BT.709 so phones show brand colors correctly
        ...(youtube ? { imageFormat: 'png' } : { imageFormat: 'jpeg', jpegQuality: 95 }),
        browserExecutable,
    };
    const progress = (label) => {
        let last = -1;
        return ({ progress }) => {
            const pct = Math.floor(progress * 10) * 10;
            if (pct !== last) {
                last = pct;
                console.log(`${label}: ${pct}%`);
            }
        };
    };
    const N = composition.durationInFrames;
    if (SEGMENT && N > SEGMENT) {
        // Video in segments (each starts on a keyframe, so they join by stream copy), the full mix as one
        // audio pass, then one mux: the same encoder settings and the same file as a single pass.
        const dir = path.join(outDir, `.segments-${composition.id}`);
        await rm(dir, { recursive: true, force: true });
        await mkdir(dir, { recursive: true });
        const parts = [];
        for (let a = 0; a < N; a += SEGMENT) {
            const part = path.join(dir, `${String(parts.length).padStart(3, '0')}.mp4`);
            const range = [a, Math.min(N, a + SEGMENT) - 1];
            await renderMedia({ ...video, muted: true, frameRange: range, outputLocation: part, onProgress: progress(`${composition.id} frames ${range[0]}-${range[1]} of ${N}`) });
            parts.push(part);
        }
        const wav = path.join(dir, 'audio.wav');
        await renderMedia({ serveUrl, composition, codec: 'wav', browserExecutable, outputLocation: wav, onProgress: progress(`${composition.id} audio`) });
        const list = path.join(dir, 'parts.txt');
        await writeFile(list, parts.map((p) => `file '${p}'`).join('\n') + '\n');
        ffmpeg('-f', 'concat', '-safe', '0', '-i', list, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', file);
        await rm(dir, { recursive: true, force: true });
    } else {
        await renderMedia({
            ...video,
            audioCodec: 'aac',
            audioBitrate: '192k',
            enforceAudioTrack: true,
            outputLocation: file,
            onProgress: progress(composition.id),
        });
    }
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
