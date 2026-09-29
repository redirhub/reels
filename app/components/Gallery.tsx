'use client';

import { Player } from '@remotion/player';
import { useState } from 'react';
import { reels, type Reel } from '@/reels';
import { loadBrandFonts } from '@/remotion/brand/fonts';

loadBrandFonts();

/** Public CDN root that CI publishes to on every push to main (docs/aws/SETUP.md). */
const CDN = process.env.NEXT_PUBLIC_REELS_BASE_URL ?? 'https://dcr3565853rcg.cloudfront.net/reels';

/* Production shows what's published on main, so the rendered MP4 is the default:
   native video scrubs instantly. Branch previews (and local dev) default to the live
   Player, because the CDN only has main's render, not this branch's changes. */
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

type Mode = 'video' | 'live';

export function Gallery() {
    return <>{reels.map((r) => <ReelCard key={r.id} reel={r} />)}</>;
}

function ReelCard({ reel: r }: { reel: Reel }) {
    const [mode, setMode] = useState<Mode>(IS_PRODUCTION ? 'video' : 'live');
    const [missing, setMissing] = useState(false);
    const base = `${CDN}/${r.id}`;

    return (
        <article className="reel">
            <div>
                <div className="tabs" role="tablist" aria-label="Preview mode">
                    <button role="tab" aria-selected={mode === 'video'} disabled={missing} onClick={() => setMode('video')}>
                        Rendered MP4
                    </button>
                    <button role="tab" aria-selected={mode === 'live'} onClick={() => setMode('live')}>
                        Live preview
                    </button>
                </div>
                <div className="player" style={{ aspectRatio: `${r.width} / ${r.height}` }}>
                    {mode === 'video' ? (
                        <video
                            key="video"
                            src={`${base}/latest.mp4`}
                            poster={`${base}/latest.jpg`}
                            controls
                            playsInline
                            preload="metadata"
                            onError={() => {
                                // Not published yet (e.g. a reel added on this branch).
                                setMissing(true);
                                setMode('live');
                            }}
                        />
                    ) : (
                        <Player
                            key="live"
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
                            spaceKeyToPlayOrPause
                            numberOfSharedAudioTags={8}
                        />
                    )}
                </div>
                <p className="hint">
                    {mode === 'video'
                        ? 'The published render from main, exactly what gets posted.'
                        : missing
                            ? 'Not published yet. This live preview renders in your browser.'
                            : 'Renders in your browser from this branch’s code. Scrubbing is heavier than the MP4.'}
                </p>
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
                    <a className="btn primary" href={`${base}/download.mp4`}>Download MP4</a>
                    <a className="btn" href={`${base}/latest.jpg`}>Cover image</a>
                </div>
                <p className="hint">
                    Public link: <code>{`${base}/latest.mp4`}</code>. Updated on every push to{' '}
                    <code>main</code>. Render locally with <code>npm run render -- {r.id}</code>.
                </p>
            </div>
        </article>
    );
}
