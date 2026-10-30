// CI: which reels need rendering. A reel needs it when no render of its exact content is published yet,
// i.e. renders/<id>/<key>.jpg is missing on the CDN (the key is from scripts/reel-keys.mjs; the cover is
// uploaded after the mp4, so a cover that's there proves the video is).
//
//   node scripts/reels-to-render.mjs              # the reels with no render of their key
//   node scripts/reels-to-render.mjs --force [id…]  # render these anyway (no ids: all), e.g. a manual run
//
// Prints key=value lines for $GITHUB_OUTPUT:
//   render=true|false  at least one reel to render
//   reels=<ids>        the reels to render, newest first, space-separated (never empty when render=true)
//   matrix=<json>      the same as a JSON array, for a job matrix (one job per reel)
//   registered=<ids>   every reel, newest first (publish orders and prunes index.json with it)
//   keys=<id=key …>    every reel's content key (publish names the files with it)
import { reelKeys } from './reel-keys.mjs';

const BASE_URL = process.env.REELS_BASE_URL || 'https://dcr3565853rcg.cloudfront.net/reels';
const keys = reelKeys();
const ids = Object.keys(keys);
const args = process.argv.slice(2);
const force = args[0] === '--force';
const unknown = args.slice(1).filter((id) => !keys[id]);
if (unknown.length) {
    console.error(`Unknown reel id(s): ${unknown.join(', ')}. Known: ${ids.join(', ')}`);
    process.exit(1);
}

async function published(id) {
    const url = `${BASE_URL}/renders/${id}/${keys[id]}.jpg`;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const r = await fetch(url, { method: 'HEAD' });
            return r.ok; // a missing file is 403 (S3 without list access), not 404
        } catch (e) {
            console.error(`${id}: ${url} unreachable (${e.message}), attempt ${attempt + 1}`);
        }
    }
    return false; // can't tell: render it rather than publish nothing
}

const todo = [];
for (const id of ids) {
    const done = force ? false : await published(id);
    const wanted = force ? args.length === 1 || args.includes(id) : !done;
    console.error(`${id} ${keys[id].slice(0, 12)}: ${force ? (wanted ? 'forced' : 'skipped') : done ? 'already rendered' : 'not rendered yet'}`);
    if (wanted) todo.push(id);
}
console.log(`render=${todo.length > 0}`);
// newest first: the reel someone is working on is usually the newest, so its render lands first
todo.reverse();
console.log(`reels=${todo.join(' ')}`);
console.log(`matrix=${JSON.stringify(todo)}`);
console.log(`registered=${[...ids].reverse().join(' ')}`);
console.log(`keys=${ids.map((id) => `${id}=${keys[id]}`).join(' ')}`);
