'use client';

import { Player } from '@remotion/player';
import { reels } from '@/reels';
import { loadBrandFonts } from '@/remotion/brand/fonts';

loadBrandFonts();

/** Public CDN root that CI publishes to on every push to main (docs/aws/SETUP.md). */
const CDN = process.env.NEXT_PUBLIC_REELS_BASE_URL ?? 'https://dcr3565853rcg.cloudfront.net/reels';

export function Gallery() {
    return (
        <>
            {reels.map((r) => (
                <article key={r.id} className="reel">
                    <div className="player" style={{ aspectRatio: `${r.width} / ${r.height}` }}>
                        <Player
                            component={r.component}
                            inputProps={r.defaultProps}
                            durationInFrames={Math.round(r.durationInSeconds * r.fps)}
                            fps={r.fps}
                            compositionWidth={r.width}
                            compositionHeight={r.height}
                            style={{ width: '100%', height: '100%' }}
                            controls
                            loop
                            clickToPlay
                            doubleClickToFullscreen
                        />
                    </div>
                    <div className="meta">
                        <h2>{r.title}</h2>
                        <p>{r.description}</p>
                        <div className="tags">
                            <span>{r.width}×{r.height}</span>
                            <span>{r.durationInSeconds}s · {r.fps} fps</span>
                            <span>{r.id}</span>
                        </div>
                        <div className="actions">
                            <a className="btn primary" href={`${CDN}/${r.id}/download.mp4`}>Download MP4</a>
                            <a className="btn" href={`${CDN}/${r.id}/latest.jpg`}>Cover image</a>
                        </div>
                        <p className="hint">
                            Public link: <code>{`${CDN}/${r.id}/latest.mp4`}</code>. Updated on every push to{' '}
                            <code>main</code>. Render locally with <code>npm run render -- {r.id}</code>.
                        </p>
                    </div>
                </article>
            ))}
        </>
    );
}
