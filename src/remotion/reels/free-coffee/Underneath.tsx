/* 3.4–7.3s · Scenes 3–5: the broken URL lifts out of the address bar, the camera moves
   behind the page into the redirect layer, the link gets a destination (kept secret),
   then the same URL drops back onto the page. Times are local (absolute − 3.4). */
import { AbsoluteFill } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { color } from '../../brand/tokens';
import { clamp, easeBack, easeInOut, easeOut, fx, lerp, prog, useTime } from '../../lib/anim';
import {
    ADDR, BG, BIG, Browser, CHIP, DEEP, DEST_Y, LinkPage, NODE_Y, NotFoundPage, PAGE_LINK_Y, UrlChip, centered, chipWidth,
} from './Stage';
import { dest, link, type FreeCoffeeProps } from './props';

/** Local seconds. Sound cues in FreeCoffee.tsx use these + the scene start. */
export const T = {
    lift: [0.05, 0.8],
    destIn: [0.85, 1.15],
    wire: [1.2, 1.85],
    pulse: [1.45, 2.3],
    snap: 2.35,
    back: [3.2, 3.85],
} as const;

/** Curiosity ends pushed in by this much (its slow push), around this origin. */
const PUSH = 1.025;
const ORIGIN = { x: 540, y: 1920 * 0.47 };
const pushed = (x: number, y: number) => ({ x: ORIGIN.x + (x - ORIGIN.x) * PUSH, y: ORIGIN.y + (y - ORIGIN.y) * PUSH });

export function Underneath(props: FreeCoffeeProps) {
    const u = useTime();
    const url = link(props);

    const lift = easeInOut(prog(u, ...T.lift));
    const back = easeInOut(prog(u, ...T.back));
    const away = 1 - prog(u, T.back[0], T.back[0] + 0.25); // redirect layer fades out on the way back
    const snapped = u >= T.snap;
    const snapK = prog(u, T.snap, T.snap + 0.5);

    // Browser: we pass through it on the way in, it settles back on the way out.
    const goneIn = prog(u, 0.1, 0.6);
    const comeBack = prog(u, T.back[0] + 0.1, T.back[1]);
    const showBack = u >= T.back[0];
    const bOpacity = showBack ? easeOut(comeBack) : 1 - goneIn;
    const bScale = showBack ? lerp(1.3, 1, easeOut(comeBack)) : lerp(PUSH, 1.3, easeInOut(goneIn));
    const bBlur = showBack ? (1 - comeBack) * 8 : goneIn * 8;

    // Redirect layer: darker, a dot grid that rises as the camera moves in.
    const layer = showBack ? 1 - comeBack : goneIn;
    const gridY = lerp(220, 0, easeOut(prog(u, 0.05, 1.0)));

    // The chip: address bar → source node → back onto the page.
    const start = pushed(ADDR.x, ADDR.y);
    const node = centered(url, NODE_Y, BIG);
    const page = centered(url, PAGE_LINK_Y, BIG);
    let x = lerp(start.x, node.x, lift);
    let y = lerp(start.y, node.y, lift);
    let s = lerp(PUSH, BIG, lift);
    let card = lift;
    let linkish = 0;
    if (showBack) {
        x = lerp(node.x, page.x, back);
        y = lerp(node.y, page.y, back);
        s = BIG;
        card = 1 - back;
        linkish = back;
    }
    const statusC = snapped ? color.teal : color.red;
    const border = showBack ? undefined
        : snapped ? `rgba(32,167,149,${0.9 * away})`
            : `rgba(217,45,32,${0.85 * lift})`;

    // Destination: appears concealed, locks on the snap. Its path is never rendered.
    const destText = dest(props);
    const destIn = easeBack(prog(u, ...T.destIn));
    const pop = snapped ? 1 + 0.07 * (1 - easeOut(prog(u, T.snap, T.snap + 0.22))) : 1;
    const dPos = centered(destText, DEST_Y, BIG * destIn * pop);

    // Wire between them, then the orange pulse travelling down it.
    const top = NODE_Y + (CHIP.h * BIG) / 2 + 18;
    const bottom = DEST_Y - (CHIP.h * BIG) / 2 - 18;
    const wire = easeInOut(prog(u, ...T.wire));
    const pk = prog(u, ...T.pulse);
    const pulseY = lerp(top, bottom, easeInOut(pk));

    const nodeRight = node.x + chipWidth(url) * BIG;
    const ringW = chipWidth(destText) * BIG + 60;

    return (
        <AbsoluteFill style={{ background: BG, overflow: 'hidden' }}>
            {/* Redirect layer */}
            <AbsoluteFill style={{ opacity: layer, background: DEEP }}>
                <AbsoluteFill style={{
                    transform: `translateY(${gridY}px)`,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,.075) 2px, transparent 2.5px)',
                    backgroundSize: '44px 44px', backgroundPosition: '22px 22px',
                }} />
                <AbsoluteFill style={{ background: 'radial-gradient(700px 600px at 50% 52%, rgba(28,109,182,.22), transparent 70%)' }} />
            </AbsoluteFill>

            <div style={{ position: 'absolute', left: 0, right: 0, top: 236, display: 'flex', justifyContent: 'center', ...fx(0.55 * clamp(prog(u, 0.6, 1.0)) * away) }}>
                <div style={{ width: 300 }}><RedirHubLogo variant="white" /></div>
            </div>

            {/* Wire + pulse */}
            <div style={{
                position: 'absolute', left: 540 - 2, top, width: 4, height: (bottom - top) * wire, borderRadius: 2,
                background: snapped ? color.teal : 'rgba(255,255,255,.28)', opacity: away,
            }} />
            <svg width="40" height="30" viewBox="0 0 40 30" style={{
                position: 'absolute', left: 520, top: bottom - 6, ...fx(snapped ? away * snapK * 4 : 0),
            }}><path d="M6 4 L20 22 L34 4" fill="none" stroke={color.teal} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{
                position: 'absolute', left: 540 - 13, top: pulseY - 13, width: 26, height: 26, borderRadius: 13, background: color.amber,
                boxShadow: `0 0 26px 8px rgba(229,148,38,.45)`, ...fx(pk > 0 && pk < 1 ? 1 : pk >= 1 ? 1 - prog(u, T.pulse[1], T.pulse[1] + 0.1) : 0),
            }} />

            {/* Destination (concealed) */}
            {destIn > 0 && (
                <UrlChip text={destText} redact={props.destPath.length} shimmer={((u - 0.9) * 0.9) % 1.4}
                    x={dPos.x} y={dPos.y} s={BIG * destIn * pop}
                    look={{ card: snapped ? 1 : 0.92, linkish: 0, border: snapped ? color.teal : 'rgba(255,255,255,.0)' }}
                    style={{ opacity: away, outline: snapped ? 'none' : '2px dashed rgba(255,255,255,.45)', outlineOffset: 6 }} />
            )}
            {/* Lock-on ring */}
            {snapped && (
                <div style={{
                    position: 'absolute', left: 540 - ringW / 2, top: DEST_Y - 72, width: ringW, height: 144, borderRadius: 40,
                    border: `3px solid ${color.teal}`, ...fx((1 - snapK) * 0.8 * away, 0, 0, lerp(1, 1.25, easeOut(snapK))),
                }} />
            )}

            {/* Status dot next to the source: broken (red) → routed (teal) */}
            <div style={{
                position: 'absolute', left: nodeRight + 24, top: NODE_Y - 11, width: 22, height: 22, borderRadius: 11, background: statusC,
                boxShadow: `0 0 0 ${snapped ? 10 * (1 - snapK) : 0}px rgba(32,167,149,.35)`,
                ...fx(clamp(prog(u, 0.7, 0.9)) * away),
            }} />

            {/* Browser (we fly through it, then it settles back) */}
            <Browser
                address={showBack ? props.domain : url}
                hideAddress={!showBack}
                page={showBack ? <LinkPage /> : <NotFoundPage />}
                style={{
                    opacity: bOpacity, transform: `scale(${bScale})`, transformOrigin: `${ORIGIN.x - 70}px ${ORIGIN.y - 300}px`,
                    filter: `blur(${bBlur}px)`, visibility: bOpacity <= 0.001 ? 'hidden' : 'visible',
                }}
            />

            {/* The URL itself: the object that carries the story */}
            <UrlChip text={url} x={x} y={y} s={s} look={{ card, linkish, border }} />
        </AbsoluteFill>
    );
}
