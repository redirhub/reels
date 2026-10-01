/* "Free coffee?" — vertical reel, no voiceover. One continuous browser shot: a bait link
   404s, the fix happens in RedirHub in another tab (Links → Edit link → new destination →
   Save changes), and the same click on the same link now lands. Then the brand close.
   Timing and layout live in timeline.ts; the camera zooms like a screen recording. */
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Beat } from '../../components/Beat';
import { Cursor } from '../../components/Cursor';
import { Grain } from '../../components/Grain';
import { Sfx, type SfxCue, type SfxSample } from '../../components/Sfx';
import { easeBack, easeInOut, easeOut, prog, shake, useTime } from '../../lib/anim';
import { LinkPage, NotFoundPage, PayoffPage } from './BrandSite';
import { BrandFavicon, Browser, RedirHubFavicon } from './Chrome';
import { EndCard } from './EndCard';
import { EditLinkPage, LinksPage, SavedToast, type RowData } from './RedirHubApp';
import { BROKEN_ROW, CLICKS, CURSOR, PAGE, T, camera, keyTimes, typed } from './timeline';
import { Keystrokes } from './Keys';
import { urls, type FreeCoffeeProps } from './props';

/** Navy, pre-darkened for the <Grain /> on top (10% grey noise lifts it back). */
export const BG = `radial-gradient(1100px 900px at 50% 28%, #0B2D5B 0%, #01112D 55%, #00081C 100%)`;

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
    // The edit: select `editFrom` in the old destination and type `editTo` over it.
    const at = u.oldUrl.indexOf(props.editFrom);
    const pre = u.oldUrl.slice(0, at);
    const post = u.oldUrl.slice(at + props.editFrom.length);
    const typing = t >= T.typing[0];
    const field = {
        pre,
        sel: !typing && t >= T.select ? props.editFrom : '',
        mid: typing ? typed(props.editTo, t, T.typing[0], T.typing[1]) : t >= T.select ? '' : props.editFrom,
        post,
    };
    const value = field.pre + (field.sel || field.mid) + field.post;
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
            <Grain />
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
                                : landed ? <PayoffPage text={props.payoff} emoji={props.payoffEmoji} k={easeOut(prog(t, T.ok, T.ok + 0.12))} />
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
                                            field={field}
                                            value={value}
                                            caret={t >= T.fieldClick && t < T.save && !field.sel && (t < T.typing[1] + 0.2 || Math.floor(t * 2.6) % 2 === 0)}
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

/** Licensed samples (Pixabay, see docs/audio-licenses.md), cut with `prepare_track.py oneshot`.
    `onset` is where the attack sits in the file, so a cue lands on its frame. */
const CLICK: SfxSample = { name: 'click', src: 'audio/free-coffee/click.wav', seconds: 0.19, onset: 0.006 };
/** The plot twist: the "What!?" meme, its first syllable on the snap-zoom. */
const WHAT: SfxSample = { name: 'what!?', src: 'audio/free-coffee/twist.wav', seconds: 2, onset: 0.028 };

/** Sound tied to motion, close and dry (ASMR). The click is the motif: the same click
    fails, then succeeds. The swishes, the 404 hit and the snap are generated by the repo. */
const SOUND_CUES: readonly SfxCue[] = [
    [T.click1, CLICK, 0.65],                // clicks the link
    [T.fail, 'error', 0.55],                // 404
    [T.toB - 0.04, 'swish_r', 0.55],       // over to the RedirHub tab (pans right)
    [T.pencil, CLICK, 0.45],               // Edit
    [T.fieldClick, CLICK, 0.4],           // into the field
    [T.save, CLICK, 0.45],                 // Save changes
    [T.saved, 'snap', 0.6],                // "Changes saved": the fix locks in
    [T.toA - 0.04, 'swish_l', 0.55],       // back to the first tab (pans left)
    [T.back, CLICK, 0.4],                  // Back
    [T.click2, CLICK, 0.65],                // the same click
    [T.twist, WHAT, 0.7],                  // "Nice try." What!?
];

/** Music level: [from, to, level, ramp-in s, ramp-out s]. The music never stops (owner: stops
    and restarts felt awkward); it only dips a little so the keystrokes come through. The track
    ("Soft", Pixabay) is fitted so its bass drops back in as the payoff page appears, and jumps
    on a downbeat to its own last bar, so it ends with the end card instead of fading. */
const MUSIC: readonly (readonly [number, number, number, number, number])[] = [
    [T.fieldClick - 0.1, T.typing[1] + 0.15, 0.8, 0.2, 0.3],
];
function musicVolume(s: number) {
    let v = 1;
    for (const [a, b, lvl, rin, rout] of MUSIC) {
        const k = Math.min(prog(s, a - rin, a), 1 - prog(s, b, b + rout));
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
            <Keystrokes times={keyTimes(props.editTo, T.typing[0], T.typing[1])} volume={0.8} />
            <Sfx cues={SOUND_CUES} budget={{
                max: 11,
                reason: 'Owner brief (2026-10-01/02): a no-voiceover, sound-designed short; every effect is tied to a motion, the repeated click is the story motif and the punchline gets a meme sting.',
            }} />
        </AbsoluteFill>
    );
}
