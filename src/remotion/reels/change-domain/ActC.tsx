/* Act C · How Google sees your site: w44-Pages → w44-Flip (beats 19–23, one scene: the same tree, the room warms
   and every address rolls) and w44-Steps (24, and again ticked for the recap at 59). */
import { clamp, easeInOut, easeOut, prog, useTime } from '../../lib/anim';
import { At, C, Check, Eyebrow, Headline, MONO, Roll, SceneFade, Tag, popIn, slideIn, smooth, type Room } from './kit';
import { Badge, PageCard } from './shop';
import type { ChangeDomainProps } from './props';
import { local, type Local } from './timeline';

/* ---------------------------------------------------------------- Pages → Flip */
const L1 = local('pages');
const EDGES: readonly [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
export function PagesScene({ tree }: ChangeDomainProps) {
    const t = useTime();
    const w = (x: number, path: string) => (path === '/' ? 440 : x === 620 ? 500 : 580);
    // Each card arrives as she names it: the homepage, the flavor menu (and the blog beside it), the famous page.
    const nodeAt = [L1.word(20, 'homepage') - 0.1, L1.word(20, 'flavor') - 0.1, L1.word(20, 'menu') + 0.1, L1.word(20, 'famous') - 0.1, L1.word(20, 'famous') + 0.25, L1.word(20, 'famous') + 0.4];
    const badgeAt = (i: number) => L1.word(21, 'history') - 0.2 + i * 0.16;
    const flipA = L1.word(22, 'every') - 0.1;
    const flip = (i: number) => easeInOut(prog(t, flipA + [0, 0.25, 0.35, 0.5, 0.6, 0.7][i], flipA + [0, 0.25, 0.35, 0.5, 0.6, 0.7][i] + 0.5));
    const lose = (i: number) => easeInOut(prog(t, L1.word(22, 'history') - 0.4 + i * 0.1, L1.word(22, 'history') + 0.2 + i * 0.1));
    const warm = easeInOut(prog(t, L1.at(22) - 0.1, L1.at(22) + 0.9));
    const head2 = prog(t, L1.word(22, 'change') - 0.2, L1.word(22, 'change') + 0.3);
    return (
        <SceneFade t={t} room="charcoal" blend={{ room: 'glow', k: warm }}>
            <Eyebrow t={t} a={0.2}>HOW GOOGLE SEES YOUR SITE</Eyebrow>
            <Headline size={72} style={slideIn(t, L1.word(19, 'google') - 0.15, 0.5, 0, 18)}>
                <Roll from="Google ranks pages. Not domains." to="Every address changes." k={head2} h={80} />
            </Headline>
            <At x={1600} y={186} style={{ ...slideIn(t, badgeAt(0), 0.4, 0, 8), opacity: (slideIn(t, badgeAt(0), 0.4, 0, 8).opacity as number) * (1 - smooth(head2)) }}><Tag light={false}>Example numbers</Tag></At>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                {EDGES.map(([a, b]) => {
                    const A = tree[a], Bn = tree[b];
                    const xa = A.x + w(A.x, A.path), ya = A.y + 36, xb = Bn.x, yb = Bn.y + 36;
                    const k = easeInOut(prog(t, nodeAt[b] - 0.25, nodeAt[b] + 0.2));
                    return <path key={`${a}-${b}`} d={`M${xa} ${ya} C${xa + 50} ${ya} ${xb - 50} ${yb} ${xb} ${yb}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} strokeOpacity={k > 0 ? 1 : 0} />;
                })}
                {tree.map((n, i) => {
                    // The broken line from each card to its dropped history.
                    const k = lose(i);
                    return <path key={n.path} d={`M${n.x + 24} ${n.y + 76} V${n.y + 126} H${n.x + 40}`} fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="6 7" opacity={smooth(k * 1.5)} />;
                })}
            </svg>
            {tree.map((n, i) => (
                <div key={n.path}>
                    <At x={n.x} y={n.y} style={popIn(t, nodeAt[i], 0.45, 0.9)}><PageCard path={n.path} k={flip(i)} w={w(n.x, n.path)} hero={n.hero} /></At>
                    <At x={n.x} y={n.y + 88} style={{ ...popIn(t, badgeAt(i), 0.4, 0.7), transform: `translate3d(${40 * lose(i)}px, ${24 * lose(i)}px, 0) ${popIn(t, badgeAt(i), 0.4, 0.7).transform}` }}>
                        <Badge text={n.badge} hero={n.hero} dim={lose(i)} />
                    </At>
                </div>
            ))}
            <div style={{ position: 'absolute', left: 120, top: 860, width: 900, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', ...slideIn(t, L1.at(23) + 0.1, 0.45, 0, 14) }}>The history doesn’t follow on its own.</div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Steps (and the recap) */
const STEPS = [['01', 'Map it'], ['02', 'Redirect it'], ['03', 'Tell Google']] as const;
export function StepsScene({ L, recap = false, room = 'radial' }: { L: Local; recap?: boolean; room?: Room }) {
    const t = useTime();
    const n = recap ? 59 : 24;
    const cardAt = recap ? [0.2, 0.32, 0.44] : [L.word(24, 'map') - 0.1, L.word(24, 'redirect') - 0.1, L.word(24, 'tell') - 0.1];
    const tickAt = recap ? [L.word(59, 'map') - 0.05, L.word(59, 'redirect') - 0.05, L.word(59, 'tell') - 0.05] : null;
    return (
        <SceneFade t={t} room={room}>
            <Eyebrow t={t} a={0.15}>{recap ? 'SO' : 'THE MOVE'}</Eyebrow>
            <Headline size={80} style={slideIn(t, recap ? 0.1 : L.word(24, 'three') - 0.1, 0.5, 0, 18)}>Three steps.</Headline>
            <div style={{ position: 'absolute', left: 120, top: 320, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 30, alignItems: 'start' }}>
                {STEPS.map(([num, title], i) => {
                    const tick = tickAt ? easeOut(prog(t, tickAt[i], tickAt[i] + 0.4)) : 0;
                    return (
                        <div key={num} style={{ position: 'relative', height: 360, boxSizing: 'border-box', padding: 40, borderRadius: 30, background: 'linear-gradient(140deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.84) 100%)', boxShadow: `inset 0 0 0 1.5px #FFFFFF, 0 30px 70px rgba(16,24,40,0.20)${tick > 0 ? `, 0 0 0 ${5 * tick}px rgba(32,167,149,${0.6 * tick})` : ''}`, color: C.char, display: 'flex', flexDirection: 'column', gap: 22, marginTop: i * 30, ...slideIn(t, cardAt[i], 0.5, 0, 40) }}>
                            <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, color: C.teal }}>{num}</span>
                            <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{title}</span>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>{[0, 1, 2].map((k) => <span key={k} style={{ width: 40, height: 6, borderRadius: 3, background: k <= i ? C.teal : C.g300 }} />)}</div>
                            {tickAt && <span style={{ position: 'absolute', right: 30, top: 30, ...popIn(t, tickAt[i], 0.4, 0.5) }}><Check size={64} draw={clamp((t - tickAt[i] - 0.08) / 0.3)} /></span>}
                        </div>
                    );
                })}
            </div>
            <div style={{ position: 'absolute', left: 120, top: 806, display: 'flex', alignItems: 'center', gap: 16, height: 64, padding: '0 28px', borderRadius: 32, background: 'rgba(255,255,255,0.16)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.16)', fontSize: 30, fontWeight: 700, ...(recap ? popIn(t, L.word(n, 'settle') - 0.35, 0.45) : { opacity: 0 }) }}>Then let it settle.</div>
        </SceneFade>
    );
}
