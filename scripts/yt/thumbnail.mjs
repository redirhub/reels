// Render a 1280×720 thumbnail from an HTML file with the bundled chrome-headless-shell, then a
// 168×94 proof (the size YouTube shows in a sidebar) so readability is checked, not assumed.
//   CHROME_PATH=… node scripts/yt/thumbnail.mjs <in.html> <out.png>
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const [html, out] = process.argv.slice(2);
const chrome = process.env.CHROME_PATH;
if (!html || !out || !chrome) { console.error('usage: CHROME_PATH=… node scripts/yt/thumbnail.mjs <in.html> <out.png>'); process.exit(1); }
execFileSync(chrome, ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1280,720', `--screenshot=${path.resolve(out)}`, `file://${path.resolve(html)}`], { stdio: 'ignore' });
const proof = out.replace(/\.png$/, '-168x94.png');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', out, '-vf', 'scale=168:94:flags=lanczos', proof]);
console.log(out, proof);
