/* 7.3–10.2s · Scenes 5–6: same page, same link, same click. This time it lands.
   Times are local (absolute − 7.3). */
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { easeOut, fx, lerp, prog, useTime } from '../../lib/anim';
import { BG, BIG, Browser, LinkPage, PAGE_LINK_Y, UrlChip, centered } from './Stage';
import { dest, link, type FreeCoffeeProps } from './props';

export const CLICK_2 = 0.7;
export const LOAD_OK = 0.8;

const CURSOR: readonly CursorKey[] = [[0, 930, 1580], [0.05, 930, 1580], [0.55, 640, 920], [1.4, 640, 920]];

export function Payoff(props: FreeCoffeeProps) {
    const v = useTime();
    const url = link(props);
    const loaded = v >= LOAD_OK;
    const press = v >= CLICK_2 && v < LOAD_OK ? 0.97 : 1;
    const pos = centered(url, PAGE_LINK_Y, BIG * press);
    const joke = easeOut(prog(v, LOAD_OK, LOAD_OK + 0.3));
    const push = 1 + 0.02 * easeOut(prog(v, LOAD_OK, 2.9));

    return (
        <AbsoluteFill style={{ background: BG }}>
            <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 47%' }}>
                <Browser
                    address={loaded ? dest(props) : props.domain}
                    loading={v >= CLICK_2 && v < LOAD_OK + 0.1 ? prog(v, CLICK_2, LOAD_OK) : -1}
                    page={loaded ? (
                        <div style={{
                            position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: font.sans,
                            fontSize: 132, fontWeight: 800, letterSpacing: '-.04em', color: color.charcoal, whiteSpace: 'nowrap',
                            ...fx(joke, 0, (1 - joke) * 24, lerp(0.97, 1, joke)),
                        }}>{props.payoff} <span style={{ letterSpacing: 0, fontFamily: font.emoji, fontWeight: 400 }}>{props.payoffEmoji}</span></div>
                    ) : <LinkPage />}
                />
                {!loaded && <UrlChip text={url} x={pos.x} y={pos.y} s={BIG * press} look={{ card: 0, linkish: 1 }} />}
                {!loaded && <Cursor t={v} keys={CURSOR} clicks={[CLICK_2]} show={0.05} hide={CLICK_2 + 0.1} />}
            </AbsoluteFill>
        </AbsoluteFill>
    );
}
