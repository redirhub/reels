import { execFileSync } from 'node:child_process';
import type { NextConfig } from 'next';

/* Each reel's content key (scripts/reel-keys.mjs), computed from this build's files. A branch preview
   plays CI's render of exactly this content, renders/<id>/<key>.mp4, whichever commit rendered it. */
const reelKeys = execFileSync(process.execPath, ['scripts/reel-keys.mjs', '--json'], { encoding: 'utf8' }).trim();

const nextConfig: NextConfig = {
    env: { NEXT_PUBLIC_REEL_KEYS: reelKeys },
};

export default nextConfig;
