'use client';

import { Player } from '@remotion/player';
import { useEffect, useState } from 'react';
import { reels, type Reel } from '@/reels';
import { loadBrandFonts } from '@/remotion/brand/fonts';

loadBrandFonts();

/** Public CDN root that CI publishes to on every push to main (docs/aws/SETUP.md). */
const CDN = process.env.NEXT_PUBLIC_REELS_BASE_URL ?? 'https://dcr3565853rcg.cloudfront.net/reels';

/* Which rendered MP4s to try, in order (native video scrubs instantly, and it's exactly
   what CI rendered, so it catches anything the in-browser Player gets wrong):
   - production: main's published render (<id>/latest.mp4)
   - branch previews: CI's render of exactly this content, renders/<id>/<key>.mp4 (the key is a sha256 of
     every file that can change the reel, computed in next.config.ts the same way CI does, so any commit
     with the same content finds it, a docs-only commit included); then the newest render of the reel on
     this branch (renders/<id>/branch-<slug>.mp4, while CI is still rendering this content); then main's
     latest.mp4.
   - local dev: none, live Player only
   A source is offered (played, downloaded) only once its cover has loaded: CI uploads the mp4
   before the jpg, so a cover that loads proves the video is there. A link to a file that doesn't
   exist gets S3's "AccessDenied" XML, which is what the Download button used to hand out. */
const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;
const COMMIT = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
const BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
const KEYS: Record<string, string> = JSON.parse(process.env.NEXT_PUBLIC_REEL_KEYS || '{}');
/** Same slug as scripts/publish-s3.sh: [A-Za-z0-9._-] kept, anything else becomes "-". */
const SLUG = BRANCH?.replace(/[^A-Za-z0-9._-]/g, '-');

type Source = { kind: 'render' | 'branch' | 'latest'; mp4: string; poster: string; download: string };

function sourcesFor(id: string): Source[] {
    const latest: Source = {
        kind: 'latest', mp4: `${CDN}/${id}/latest.mp4`, poster: `${CDN}/${id}/latest.jpg`, download: `${CDN}/${id}/download.mp4`,
    };
    if (VERCEL_ENV === 'production') return [latest];
    if (!COMMIT) return [];
    const own = (name: string, kind: Source['kind']): Source => {
        const mp4 = `${CDN}/renders/${id}/${name}.mp4`;
        return { kind, mp4, poster: `${CDN}/renders/${id}/${name}.jpg`, download: mp4 };
    };
    return [...(KEYS[id] ? [own(KEYS[id], 'render')] : []), ...(SLUG ? [own(`branch-${SLUG}`, 'branch')] : []), latest];
}

/** The first source whose cover loads: 'checking' while it looks, 'none' if no source is there. */
function useAvailable(sources: Source[]): number | 'checking' | 'none' {
    const key = sources.map((s) => s.poster).join(' ');
    const [found, setFound] = useState<number | 'checking' | 'none'>(sources.length ? 'checking' : 'none');
    useEffect(() => {
        let alive = true;
        const tryFrom = (i: number) => {
            if (!alive) return;
            if (i >= sources.length) return setFound('none');
            const img = new Image();
            img.onload = () => alive && setFound(i);
            img.onerror = () => tryFrom(i + 1);
            img.src = sources[i].poster;
        };
        setFound(sources.length ? 'checking' : 'none');
        tryFrom(0);
        return () => { alive = false; };
    }, [key]);
    return found;
}

type Mode = 'video' | 'live';

/* The gallery is split by shape: vertical reels and landscape videos are watched in different
   places and need different player sizes, so each gets its own section. The shape comes from the
   reel's own width and height, so a new reel lands in the right section without extra config.
   Newest first: the registry lists reels in the order they were added. */
const SECTIONS = [
    {
        id: 'short',
        title: 'Short-form',
        format: '9:16 vertical',
        where: 'Instagram Reels, YouTube Shorts, TikTok',
        test: (r: Reel) => r.height > r.width,
    },
    {
        id: 'long',
        title: 'Long-form',
        format: '16:9 landscape',
        where: 'YouTube, the website',
        test: (r: Reel) => r.height <= r.width,
    },
] as const;

export function Gallery() {
    const groups = SECTIONS.map((s) => ({ ...s, items: [...reels].reverse().filter(s.test) })).filter((g) => g.items.length > 0);
    return (
        <>
            <nav className="sections" aria-label="Sections">
                {groups.map((g) => (
                    <a key={g.id} href={`#${g.id}`}>
                        {g.title} <span>{g.format} · {g.items.length}</span>
                    </a>
                ))}
            </nav>
            {groups.map((g) => (
                <section key={g.id} id={g.id} className={`section ${g.id}`}>
                    <header className="section-head">
                        <h2>{g.title}</h2>
                        <p>{g.format} · {g.where} · {g.items.length} {g.items.length === 1 ? 'video' : 'videos'}</p>
                    </header>
                    {g.items.map((r) => <ReelCard key={r.id} reel={r} />)}
                </section>
            ))}
        </>
    );
}

function ReelCard({ reel: r }: { reel: Reel }) {
    const sources = sourcesFor(r.id);
    const available = useAvailable(sources);
    // The file is there (its cover loaded), so it can always be downloaded; a browser that can't
    // play it inline only falls back to the live Player.
    const source = typeof available === 'number' ? sources[available] : undefined;
    const [unplayable, setUnplayable] = useState(false);
    const [chosen, setChosen] = useState<Mode | null>(null);
    const mode: Mode = chosen ?? (source && !unplayable ? 'video' : 'live');
    const missing = !source;
    const base = `${CDN}/${r.id}`;

    return (
        <article className="reel">
            <div>
                <div className="tabs" role="tablist" aria-label="Preview mode">
                    <button role="tab" aria-selected={mode === 'video'} disabled={missing || unplayable} onClick={() => setChosen('video')}>
                        Rendered MP4
                    </button>
                    <button role="tab" aria-selected={mode === 'live'} onClick={() => setChosen('live')}>
                        Live preview
                    </button>
                </div>
                <div className="player" style={{ aspectRatio: `${r.width} / ${r.height}` }}>
                    {mode === 'video' && source ? (
                        <video
                            key={source?.mp4}
                            src={source?.mp4}
                            poster={source?.poster}
                            controls
                            playsInline
                            preload="metadata"
                            onError={() => {
                                // The file is there but this browser won't play it: show the live Player.
                                setUnplayable(true);
                                setChosen('live');
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
                        ? source?.kind === 'render'
                            ? `CI’s render of exactly this code (version ${KEYS[r.id]?.slice(0, 7)}), what main will publish.`
                            : source?.kind === 'branch'
                                ? `An earlier render of this reel on ${BRANCH}: CI is still rendering this version. Refresh after CI to get it.`
                                : VERCEL_ENV === 'production'
                                    ? 'The published render from main, exactly what gets posted.'
                                    : 'Main’s published version: this version hasn’t been rendered yet (CI is still rendering it).'
                        : unplayable
                            ? 'This browser can’t play the rendered MP4 inline; Download MP4 still gets it. Showing the live preview.'
                            : available === 'checking'
                            ? 'Looking for a rendered MP4…'
                            : missing
                                ? sources.length === 0
                                    ? 'Live preview: renders in your browser from this code.'
                                    : 'No rendered MP4 yet (a new reel before its first CI run, or CI is still running). Showing the live preview; refresh to check again.'
                                : 'Renders in your browser from this code. Scrubbing is heavier than the MP4, and it can differ from the real render.'}
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
                    {source ? (
                        <>
                            <a className="btn primary" href={source.download}>Download MP4</a>
                            <a className="btn" href={source.poster}>Cover image</a>
                        </>
                    ) : (
                        // Never a link to a file that isn't there (S3 answers it with "AccessDenied").
                        <button className="btn primary" disabled>{available === 'checking' ? 'Checking for a render…' : 'Rendering… (refresh after CI)'}</button>
                    )}
                </div>
                <p className="hint">
                    Public link: <code>{`${base}/latest.mp4`}</code>. Updated on every push to{' '}
                    <code>main</code>. Render locally with <code>npm run render -- {r.id}</code>.
                </p>
            </div>
        </article>
    );
}
