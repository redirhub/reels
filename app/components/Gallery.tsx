'use client';

import { Player } from '@remotion/player';
import { useState } from 'react';
import { reels, type Reel } from '@/reels';
import { loadBrandFonts } from '@/remotion/brand/fonts';

loadBrandFonts();

/** Public CDN root that CI publishes to on every push to main (docs/aws/SETUP.md). */
const CDN = process.env.NEXT_PUBLIC_REELS_BASE_URL ?? 'https://dcr3565853rcg.cloudfront.net/reels';

/* Which rendered MP4 to play (native video scrubs instantly, and it's exactly what CI
   rendered, so it catches anything the in-browser Player gets wrong):
   - production: main's published render (<id>/latest.mp4)
   - branch previews: CI's render of this exact commit (renders/<id>/<sha>.mp4),
     uploaded by the branch push; main updates latest.mp4 after the merge
   - local dev: none, live Player only */
const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;
const COMMIT = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;

function renderedFor(id: string) {
    if (VERCEL_ENV === 'production') {
        return { mp4: `${CDN}/${id}/latest.mp4`, poster: `${CDN}/${id}/latest.jpg`, download: `${CDN}/${id}/download.mp4` };
    }
    if (COMMIT) {
        const mp4 = `${CDN}/renders/${id}/${COMMIT}.mp4`;
        return { mp4, poster: `${CDN}/renders/${id}/${COMMIT}.jpg`, download: mp4 };
    }
    return null;
}

type Mode = 'video' | 'live';

export function Gallery() {
    return <>{reels.map((r) => <ReelCard key={r.id} reel={r} />)}</>;
}

function ReelCard({ reel: r }: { reel: Reel }) {
    const rendered = renderedFor(r.id);
    const [mode, setMode] = useState<Mode>(rendered ? 'video' : 'live');
    const [missing, setMissing] = useState(!rendered);
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
                            src={rendered?.mp4}
                            poster={rendered?.poster}
                            controls
                            playsInline
                            preload="metadata"
                            onError={() => {
                                // Not rendered yet: CI is still running, or this commit didn't render.
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
                        ? VERCEL_ENV === 'production'
                            ? 'The published render from main, exactly what gets posted.'
                            : `CI’s render of ${BRANCH ?? 'this branch'} at ${COMMIT?.slice(0, 7)}, exactly what main will publish.`
                        : missing
                            ? !rendered
                                ? 'Live preview: renders in your browser from this code.'
                                : VERCEL_ENV === 'production'
                                    ? 'The published MP4 couldn’t be loaded, so this is the live preview.'
                                    : 'CI hasn’t rendered this commit yet (about 3–4 minutes after a push; docs-only commits are skipped). Showing the live preview; refresh to check again.'
                            : 'Renders in your browser from this code. Scrubbing is heavier than the MP4.'}
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
                    <a className="btn primary" href={rendered?.download ?? `${base}/download.mp4`}>Download MP4</a>
                    <a className="btn" href={rendered?.poster ?? `${base}/latest.jpg`}>Cover image</a>
                </div>
                <p className="hint">
                    Public link: <code>{`${base}/latest.mp4`}</code>. Updated on every push to{' '}
                    <code>main</code>. Render locally with <code>npm run render -- {r.id}</code>.
                </p>
            </div>
        </article>
    );
}
