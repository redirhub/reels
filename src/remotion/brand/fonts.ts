/* Fonts are bundled in public/fonts (OFL) so renders never depend on a CDN.
   loadFont() delays rendering until the font is ready, in both Remotion and the Player. */
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

let loaded: Promise<unknown> | null = null;

export function loadBrandFonts() {
    // Fonts only exist in a browser; Next.js prerenders the gallery on the server.
    if (typeof document === 'undefined') return Promise.resolve();
    loaded ??= Promise.all([
        loadFont({
            family: 'Inter',
            url: staticFile('fonts/inter-latin-wght-normal.woff2'),
            weight: '100 900',
            format: 'woff2',
        }),
        loadFont({
            family: 'JetBrains Mono',
            url: staticFile('fonts/jetbrains-mono-latin-wght-normal.woff2'),
            weight: '100 800',
            format: 'woff2',
        }),
    ]);
    return loaded;
}
