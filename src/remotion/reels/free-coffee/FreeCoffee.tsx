/* "Free coffee?" — vertical reel, no voiceover. One continuous browser shot: a bait link
   404s, the fix happens in RedirHub in another tab (Links → Edit link → new destination →
   Save changes), and the same click on the same link now lands. Then the brand close.
   Timing and layout live in timeline.ts; the camera zooms like a screen recording. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
import { Cursor } from '../../components/Cursor';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { easeBack, easeInOut, easeOut, prog, shake, useTime } from '../../lib/anim';
import { LinkPage, NotFoundPage, PayoffPage } from './BrandSite';
import { BrandFavicon, Browser, RedirHubFavicon } from './Chrome';
import { EndCard } from './EndCard';
import { EditLinkPage, LinksPage, SavedToast, type RowData } from './RedirHubApp';
import { BROKEN_ROW, CLICKS, CURSOR, PAGE, T, camera, typed } from './timeline';
import { urls, type FreeCoffeeProps } from './props';

export const BG = `radial-gradient(1100px 900px at 50% 28%, #17355F 0%, #0E1C35 55%, #0A1426 100%)`;

/** 0 → 1 across a short window (tab switches, page swaps). */
const sw = (t: number, at: number, d = 0.2) => easeInOut(prog(t, at, at + d));

function Stage(props: FreeCoffeeProps) {
    const t = useTime();
    const u = urls(props);

    // Which tab is in front. Like a real browser, the page swaps instantly on the click;
    // the incoming page only settles in (no cross-fade, so pages never double-expose).
    const onB = t >= T.toB && t < T.toA;
    const tabShape = sw(t, T.toB, 0.1) * (1 - sw(t, T.toA, 0.1));
    const settleA = t >= T.toA ? easeOut(prog(t, T.toA, T.toA + 0.22)) : 1;
    const settleB = easeOut(prog(t, T.toB, T.toB + 0.22));

    // Tab A: link page → 404 → (Back) link page → payoff.
    const failed = t >= T.fail && t < T.back;
    const landed = t >= T.ok;
    const pressA = (t >= T.click1 && t < T.fail) || (t >= T.click2 && t < T.ok) ? 0.97 : 1;
    const addrA = t < T.click1 ? props.site
        : t < T.hop1 ? u.link
            : t < T.back ? u.oldDest
                : t < T.click2 ? props.site
                    : t < T.hop2 ? u.link : u.newDest;
    const loadingA = t >= T.click1 && t < T.fail ? prog(t, T.click1, T.fail)
        : t >= T.click2 && t < T.ok ? prog(t, T.click2, T.ok) : -1;
    const titleA = failed ? 'Page not found' : landed ? 'Nice try' : 'Brand';
    const jolt = shake(t, T.fail, 0.35, 8, 90);

    // Tab B: Links → Edit link → saved → Links.
    const editK = easeOut(prog(t, T.editIn[0], T.editIn[1])) * (1 - easeInOut(prog(t, T.editOut[0], T.editOut[1])));
    const editing = t >= T.editIn[0] && t < T.editOut[1];
    const saved = t >= T.saved;
    const value = t < T.typing[0] ? u.oldUrl : typed(u.newUrl, t, T.typing[0], T.typing[1]);
    const addrB = editing ? 'dash.redirhub.com/links/edit/4821' : 'dash.redirhub.com/links';
    const titleB = editing ? 'Edit link · RedirHub' : 'Links · RedirHub';
    const attention = t >= T.errorPulse && !saved ? 0.6 + 0.4 * Math.sin((t - T.errorPulse) * 7) : 0;
    const pillPop = saved
        ? 0.6 + 0.4 * easeBack(prog(t, T.rowFlash - 0.1, T.rowFlash + 0.25))
        : 1 + 0.12 * Math.sin(Math.PI * prog(t, T.errorPulse, T.errorPulse + 0.3));
    const flash = saved ? Math.sin(Math.PI * prog(t, T.rowFlash, T.rowFlash + 0.9)) : 0;
    const pencilHover = prog(t, T.pencil - 0.25, T.pencil - 0.1) * (1 - prog(t, T.editIn[1], T.editIn[1] + 0.1));
    const toastK = easeOut(prog(t, T.saved, T.saved + 0.25)) * (1 - prog(t, T.toA - 0.35, T.toA - 0.1));
    const savePress = Math.abs(t - T.save) < 0.1 ? 0.96 : 1;

    const rows: RowData[] = [
        { icon: 'link', title: `${props.linkHost}/spring-sale`, dest: `https://${props.site}/sale`, clicks: '3.4K' },
        saved
            ? { icon: 'link', title: u.link, dest: u.newUrl, clicks: props.clicks }
            : { icon: 'link', title: u.link, dest: u.oldUrl, error: true },
        { icon: 'link', title: `${props.linkHost}/menu`, dest: `https://${props.site}/menu`, clicks: '812' },
        { icon: 'globe', title: 'brand.co', dest: `https://${props.site}`, clicks: '1.1K' },
        { icon: 'link', title: `${props.linkHost}/careers`, dest: `https://${props.site}/jobs`, clicks: '96' },
        { icon: 'link', title: `${props.linkHost}/app`, dest: `https://${props.site}/download`, clicks: '640' },
    ];

    return (
        <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
            <AbsoluteFill style={{ transform: camera(t), transformOrigin: '0 0' }}>
                <Browser
                    tabs={[
                        { title: titleA, icon: <BrandFavicon /> },
                        { title: titleB, icon: <RedirHubFavicon /> },
                    ]}
                    activeB={tabShape}
                    address={onB ? addrB : addrA}
                    loading={onB ? -1 : loadingA}
                >
                    {/* Tab A */}
                    {!onB && (
                        <AbsoluteFill style={{ transform: `translateX(${(1 - settleA) * -28 + jolt}px)`, opacity: 0.5 + 0.5 * settleA }}>
                            {failed ? <NotFoundPage />
                                : landed ? <PayoffPage text={props.payoff} emoji={props.payoffEmoji} k={easeOut(prog(t, T.ok, T.ok + 0.3))} />
                                    : <LinkPage link={u.link} press={pressA} />}
                        </AbsoluteFill>
                    )}
                    {/* Tab B */}
                    {onB && (
                        <AbsoluteFill style={{ opacity: 0.5 + 0.5 * settleB, transform: `translateX(${(1 - settleB) * 28}px)` }}>
                            <LinksPage rows={rows} brokenIndex={BROKEN_ROW} attention={editing ? 0 : attention}
                                flash={flash} pillPop={pillPop} pencilHover={pencilHover} />
                            {editing && (
                                <>
                                    <AbsoluteFill style={{ background: `rgba(16,24,40,${0.18 * editK})` }} />
                                    <AbsoluteFill style={{ transform: `translateY(${(1 - editK) * PAGE.h}px)`, boxShadow: '0 -20px 60px rgba(16,24,40,.18)' }}>
                                        <EditLinkPage
                                            link={u.link}
                                            value={value}
                                            selected={t >= T.selectAll && t < T.typing[0]}
                                            caret={t >= T.fieldClick && t < T.save && (t < T.typing[1] || Math.floor(t * 2.6) % 2 === 0)}
                                            focused={t >= T.fieldClick && t < T.save}
                                            dirty={t >= T.saved ? 0 : easeOut(prog(t, T.typing[0], T.typing[0] + 0.25))}
                                            saving={t >= T.save && t < T.editOut[0]}
                                            press={savePress}
                                        />
                                    </AbsoluteFill>
                                </>
                            )}
                            <SavedToast k={toastK} />
                        </AbsoluteFill>
                    )}
                </Browser>
                {!landed && <Cursor t={t} keys={CURSOR} clicks={CLICKS} show={0.3} hide={T.click2 + 0.1} />}
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

/** Sound tied to motion: clicks are the motif (fail, then the same click succeeds). */
const SOUND_CUES: readonly SfxCue[] = [
    [T.click1, 'mouse', 0.6],       // clicks the link
    [T.fail, 'error', 0.7],         // 404 (music drops out)
    [T.toB - 0.03, 'whoosh', 0.45], // over to RedirHub
    [T.pencil, 'mouse', 0.35],      // Edit
    [T.typing[0], 'typing', 0.35],  // new destination
    [T.saved, 'snap', 0.8],         // Changes saved: the fix locks in
    [T.toA - 0.03, 'whoosh', 0.45], // back to the first tab
    [T.back, 'mouse', 0.35],        // Back
    [T.click2, 'mouse', 0.6],       // the same click
    [T.ok + 0.02, 'chime', 0.9],    // "Nice try."
];

/** Music level over time: silence after the 404, room for the snap and the punchline. */
const DUCK: readonly (readonly [number, number, number])[] = [
    [T.fail, T.fail + 0.65, 0],
    [T.saved - 0.25, T.saved + 0.3, 0.45],
    [T.ok, T.ok + 1.0, 0.55],
];
function musicVolume(s: number) {
    let v = 1;
    for (const [a, b, lvl] of DUCK) {
        const k = Math.min(prog(s, a - 0.08, a), 1 - prog(s, b, b + 0.25));
        v = Math.min(v, 1 - (1 - lvl) * Math.max(0, k));
    }
    return v;
}

export function FreeCoffee(props: FreeCoffeeProps) {
    const { fps } = useVideoConfig();
    const f = (s: number) => Math.round(s * fps);
    return (
        <AbsoluteFill style={{ background: '#0A1426', fontFamily: font.sans, WebkitFontSmoothing: 'antialiased', color: color.charcoal }}>
            <Sequence from={0} durationInFrames={f(T.end)} name="Browser: 404 → RedirHub fix → works"><Stage {...props} /></Sequence>
            <Sequence from={f(T.end)} durationInFrames={f(T.total) - f(T.end)} name="End card"><EndCard {...props} /></Sequence>

            <Beat volume={musicVolume} />
            <Sfx cues={SOUND_CUES} budget={{
                max: 10,
                reason: 'Owner brief (2026-10-01): a no-voiceover, sound-designed short; every effect is tied to a motion and the repeated click is the story motif.',
            }} />
        </AbsoluteFill>
    );
}
