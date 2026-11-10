// The content key of each reel's render: a sha256 of every file that can change how the reel looks or
// sounds. Same files, same key, so a render is stored once under its key (renders/<id>/<key>.mp4) and any
// commit, branch or CI run with the same content finds it there instead of rendering it again.
//
//   node scripts/reel-keys.mjs           # id=key lines
//   node scripts/reel-keys.mjs --json    # {"id": "key", ...}
//
// Reads the working tree (no git: Vercel builds have no .git), so CI and the gallery's build get the same
// keys from the same commit. What goes into a reel's key (*.md files never do):
//   its own files       src/remotion/reels/<id>/**, public/audio/<id>-*.mp3 and public/audio/<id>/**,
//                       the youtube/ files its sources import (a video's timings.json), and its entry in
//                       src/reels.ts (without title and description: the video doesn't show them)
//   shared files        the rest of src/ and public/ (components, brand, lib, shared SFX and fonts), the
//                       render settings (scripts/render.mjs, remotion.config.ts) and the dependencies
//   a font              public/fonts/<file>: in the reels whose sources name it, in all when shared code does
//   never               public/brand/ (gallery only), the gallery, CI, docs, production sources in youtube/
// Bump VERSION when these rules change, so every reel is rendered again under the new rules.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const VERSION = 'reel-key-v1';
const SKIP = new Set(['node_modules', '.git', '.next', 'out', '__pycache__', '.DS_Store']);
const ROOT_FILES = ['package.json', 'package-lock.json', 'tsconfig.json', 'remotion.config.ts', 'scripts/render.mjs'];

function walk(root, dir) {
    if (!existsSync(path.join(root, dir))) return [];
    return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
        if (SKIP.has(e.name)) return [];
        const rel = `${dir}/${e.name}`;
        return e.isDirectory() ? walk(root, rel) : [rel];
    });
}

/** The registry entry of each reel in src/reels.ts, without its title and description lines. */
function registryEntries(text) {
    const lines = text.split('\n');
    const entries = {};
    lines.forEach((l, i) => {
        const id = l.match(/^\s*id:\s*'([^']+)'/)?.[1];
        if (!id) return;
        let a = i, b = i;
        while (a > 0 && !/^\s*\{\s*$/.test(lines[a])) a--;
        while (b < lines.length - 1 && !/^\s*\},?\s*$/.test(lines[b])) b++;
        entries[id] = lines.slice(a, b + 1).filter((x) => !/^\s*(title|description):/.test(x)).join('\n');
    });
    return entries;
}

export function reelKeys(root = path.resolve(import.meta.dirname, '..')) {
    const read = (f) => readFileSync(path.join(root, f));
    const digest = (buf) => createHash('sha256').update(buf).digest('hex');
    const entries = registryEntries(read('src/reels.ts').toString());
    const ids = Object.keys(entries);
    const byLength = [...ids].sort((a, b) => b.length - a.length); // ids contain hyphens: longest prefix wins
    const files = { shared: [] };
    ids.forEach((id) => (files[id] = []));

    const src = walk(root, 'src').filter((f) => !f.endsWith('.md') && f !== 'src/reels.ts');
    const reelOf = (f) => f.match(/^src\/remotion\/reels\/([^/]+)\//)?.[1];
    for (const f of src) {
        const id = reelOf(f);
        if (!id) files.shared.push(f);
        else if (files[id]) files[id].push(f);
        // a folder with no registry entry renders nothing
    }
    // youtube/ files a reel imports, e.g. from '../../../../youtube/<video>/voiceover/timings.json'
    for (const f of src.filter((x) => reelOf(x) && files[reelOf(x)])) {
        for (const m of read(f).toString().matchAll(/from\s+'((?:\.\.\/)+youtube\/[^']+)'/g)) {
            const target = path.posix.join(path.posix.dirname(f), m[1]);
            if (existsSync(path.join(root, target))) files[reelOf(f)].push(target);
        }
    }
    for (const f of walk(root, 'public').filter((x) => !x.endsWith('.md'))) {
        if (f.startsWith('public/brand/')) continue;
        const font = f.match(/^public\/(fonts\/[^/]+)$/)?.[1];
        if (font) {
            const users = src.filter((s) => read(s).toString().includes(font));
            if (users.some((s) => !reelOf(s))) files.shared.push(f);
            else new Set(users.map(reelOf)).forEach((id) => files[id]?.push(f));
            continue;
        }
        const rest = f.match(/^public\/audio\/(.+)$/)?.[1];
        const own = rest && byLength.find((id) => rest.startsWith(`${id}/`) || (!rest.includes('/') && rest.startsWith(`${id}-`) && rest.endsWith('.mp3')));
        (own ? files[own] : files.shared).push(f);
    }
    files.shared.push(...ROOT_FILES.filter((f) => existsSync(path.join(root, f))));

    const list = (fs) => [...new Set(fs)].sort().map((f) => `${f} ${digest(read(f))}\n`).join('');
    const shared = list(files.shared);
    return Object.fromEntries(ids.map((id) => [id, digest(`${VERSION}\n${id}\n${entries[id]}\n${shared}${list(files[id])}`)]));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const keys = reelKeys();
    console.log(process.argv.includes('--json') ? JSON.stringify(keys) : Object.entries(keys).map(([id, k]) => `${id}=${k}`).join('\n'));
}
