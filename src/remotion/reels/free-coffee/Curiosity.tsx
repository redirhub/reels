/* 0–3.4s · Scenes 1–2: the bait link, the click, the 404. Times are local (= absolute). */
import { AbsoluteFill } from 'remotion';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { easeOut, prog, shake, useTime } from '../../lib/anim';
import { BG, BIG, Browser, LinkPage, NotFoundPage, PAGE_LINK_Y, UrlChip, centered } from './Stage';
import { link, type FreeCoffeeProps } from './props';

/** The click (sound cue is at the same second in FreeCoffee.tsx). */
export const CLICK_1 = 1.75;
/** The 404 lands. */
export const LOAD_404 = 1.87;

const CURSOR: readonly CursorKey[] = [[0, 930, 1580], [0.35, 930, 1580], [1.45, 640, 920], [2.2, 640, 920]];

export function Curiosity(props: FreeCoffeeProps) {
    const t = useTime();
    const url = link(props);
    const failed = t >= LOAD_404;
    // Settle in: a gentle push toward the link so the first frame already reads.
    const push = 1 + 0.025 * easeOut(prog(t, 0, CLICK_1));
    const press = t >= CLICK_1 && t < LOAD_404 ? 0.97 : 1;
    const pos = centered(url, PAGE_LINK_Y, BIG * press);
    const jolt = shake(t, LOAD_404, 0.35, 7, 90);

    return (
        <AbsoluteFill style={{ background: BG }}>
            <AbsoluteFill style={{ transform: `translateX(${jolt}px) scale(${push})`, transformOrigin: '50% 47%' }}>
                <Browser
                    address={failed ? url : props.domain}
                    loading={t >= CLICK_1 && t < LOAD_404 + 0.1 ? prog(t, CLICK_1, LOAD_404) : -1}
                    page={failed ? <NotFoundPage /> : <LinkPage />}
                />
                {!failed && (
                    <UrlChip text={url} x={pos.x} y={pos.y} s={BIG * press} look={{ card: 0, linkish: 1 }} />
                )}
                {!failed && <Cursor t={t} keys={CURSOR} clicks={[CLICK_1]} show={0.3} hide={CLICK_1 + 0.12} />}
            </AbsoluteFill>
        </AbsoluteFill>
    );
}
