// Decide which reels a push needs to render, from the files it changed.
//
//   node scripts/changed-reels.mjs <base-sha>      (compares <base-sha>..HEAD)
//
// Prints key=value lines for $GITHUB_OUTPUT:
//   code=true|false    anything besides docs changed (run typecheck + build)
//   render=true|false  at least one reel needs rendering
//   reels=<ids>        space-separated ids, or empty for "all reels"
//   registered=<ids>   every reel in src/reels.ts (publish prunes index.json with it)
//
// Rules (first match wins, per file):
//   docs (*.md, docs/, .claude/)                  → nothing
//   gallery, CI and tooling that doesn't change   → nothing to render, but code=true
//     video output (app/, .github/, scripts/publish-s3.sh, scripts/qa/,
//     scripts/audio/ sources, next.config.ts, public/brand/, .gitignore)
//   src/remotion/reels/<id>/**                    → that reel
//   public/audio/<id>-beat.mp3                    → that reel
//   src/reels.ts                                  → the reels whose entries changed
//   anything else (components, brand, lib, SFX, fonts, deps, render script…) → all reels
// No usable base (first push of a branch, force push) → all reels.
import { execFileSync } from 'node:child_process';

const base = process.argv[2];
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
// Array.from, not iterator helpers: this runs on the runner's preinstalled Node (may be < 22).
const registered = new Set(Array.from(git('show', 'HEAD:src/reels.ts').matchAll(/^\s*id:\s*'([^']+)'/gm), (m) => m[1]));

function out(code, reels) {
    const render = reels === 'all' || reels.size > 0;
    console.log(`code=${code}`);
    console.log(`render=${render}`);
    console.log(`reels=${reels === 'all' ? '' : [...reels].sort().join(' ')}`);
    console.log(`registered=${[...registered].sort().join(' ')}`);
    console.error(`changed reels: ${reels === 'all' ? 'all' : [...reels].join(', ') || 'none'}`);
}

let files;
try {
    if (!base || /^0+$/.test(base)) throw new Error('no base');
    git('cat-file', '-e', `${base}^{commit}`);
    files = git('diff', '--name-only', base, 'HEAD').split('\n').filter(Boolean);
} catch {
    out(true, 'all');
    process.exit(0);
}

const DOCS = /(\.md$|^docs\/|^\.claude\/)/;
const NO_VIDEO = /^(app\/|\.github\/|scripts\/publish-s3\.sh$|scripts\/qa\/|scripts\/audio\/|next\.config\.ts$|public\/brand\/|\.gitignore$)/;

/** Reel ids whose registry entries changed. An `id:` line inside a changed block names
    that block's reel; a changed line elsewhere belongs to the entry above it. Changes
    before the first entry (imports) and removed entries render nothing. */
function registryReels() {
    const lines = git('show', 'HEAD:src/reels.ts').split('\n');
    const idAt = lines.map((l) => l.match(/^\s*id:\s*'([^']+)'/)?.[1] ?? null);
    const found = new Set();
    const diff = git('diff', '-U0', base, 'HEAD', '--', 'src/reels.ts');
    for (const hunk of diff.split(/^(?=@@ )/m).filter((h) => h.startsWith('@@'))) {
        const [, start, count] = hunk.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
        const added = count === undefined ? 1 : Number(count);
        const removedIds = [...hunk.matchAll(/^-\s*id:\s*'([^']+)'/gm)].map((m) => m[1]);
        if (added === 0 && removedIds.length) continue; // a whole entry was removed
        const from = Number(start) - 1;
        const inside = idAt.slice(from, from + Math.max(added, 1)).filter(Boolean);
        if (added > 0 && inside.length) {
            inside.forEach((id) => found.add(id));
            continue;
        }
        for (let i = Math.min(from, lines.length - 1); i >= 0; i--) {
            if (idAt[i]) {
                found.add(idAt[i]);
                break;
            }
        }
    }
    return found;
}

let code = false;
const reels = new Set();
for (const f of files) {
    if (DOCS.test(f)) continue;
    code = true;
    if (NO_VIDEO.test(f)) continue;
    const scene = f.match(/^src\/remotion\/reels\/([^/]+)\//)?.[1];
    const beat = f.match(/^public\/audio\/([^/]+)-beat\.mp3$/)?.[1];
    if (scene || beat) {
        reels.add(scene || beat);
        continue;
    }
    if (f === 'src/reels.ts') {
        registryReels().forEach((id) => reels.add(id));
        continue;
    }
    out(true, 'all'); // shared code: every reel may look different
    process.exit(0);
}
// Only ids still in the registry (a deleted reel's files change, but there's nothing to render).
out(code, new Set([...reels].filter((id) => registered.has(id))));
