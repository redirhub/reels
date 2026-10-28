/* Act D · The three steps, the shortcut and the catch: w44-Map (25–28), w44-Shortcut (29–32), w44-Melt (33–34,
   with the film's only time-reverse in its last half second), w44-OneToOne (35), the RedirHub walkthrough
   (w44-Migration → w44-Preview, 36–43, one scene: the same form switches mode), w44-TellGoogle (44–46) and
   w44-Everything (47). */
import type { CSSProperties, ReactNode } from 'react';
import { clamp, easeInOut, easeOut, prog, useTime } from '../../lib/anim';
import { At, Browser, C, CheckIn, DrawPath, Eyebrow, Headline, Label, Lock, MONO, Progress, Roll, SOFT_SHADOW, SceneFade, Scaled, Tag, Tip, UI, fx, mix, popIn, slideIn, smooth, Check } from './kit';
import { BioCard, CURSOR, Home, MapsCard, MeltDrips, MenuCard, PageCard, ScoopIcon, SiteLinksCard, StrawberryCard } from './shop';
import { AnalyticsBody, CreateButton, CreateChooser, Dashboard, Ico, LinksBody, MigrationButtons, MigrationPage, Shell, type MigState } from './Product';
import { NAMES, type ChangeDomainProps } from './props';
import { local } from './timeline';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/* ---------------------------------------------------------------- Map */
const L1 = local('map');
export function MapScene({ mapRows }: ChangeDomainProps) {
    const t = useTime();
    const oldH = L1.word(26, 'old') - 0.1, newH = L1.word(26, 'new') - 0.1;
    const rowAt = (i: number) => L1.word(26, 'get') - 0.3 + i * 0.18;
    const heroLift = easeInOut(prog(t, L1.word(26, 'becomes') - 0.2, L1.word(26, 'becomes') + 0.4));
    const teal = easeInOut(prog(t, L1.word(27, 'rule') - 0.25, L1.word(27, 'rule') + 0.45));
    const grey = easeInOut(prog(t, L1.word(27, 'own') - 0.35, L1.word(27, 'own') + 0.35));
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>STEP ONE · MAP IT</Eyebrow>
            <Progress fill={easeInOut(prog(t, 0.3, 1.0))} />
            <div data-ui="print" style={{ position: 'absolute', left: 120, top: 210, width: 1160, boxSizing: 'border-box', padding: '34px 30px 30px', borderRadius: 16, background: C.paper, boxShadow: '0 30px 70px rgba(59,58,54,0.16), 0 0 0 1px #F4EFE6', fontFamily: UI, ...slideIn(t, 0.1, 0.6, 0, 30) }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) minmax(0, 1fr)', gap: 22, padding: '0 24px 18px', borderBottom: '2px solid #F4EFE6' }}>
                    <span />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 6, ...slideIn(t, oldH, 0.4, -12, 0) }}><span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.12em', color: C.ink8 }}>OLD ADDRESS</span><span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.ink3 }}>{NAMES.old}</span></span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 6, ...slideIn(t, newH, 0.4, 12, 0) }}><span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.12em', color: C.ink8 }}>NEW ADDRESS</span><span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.ink3 }}>{NAMES.new}</span></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                    {mapRows.map(([a, b], i) => {
                        const hero = a === NAMES.path, changed = a !== b;
                        const k = hero ? heroLift : 0;
                        const w = prog(t, rowAt(i), rowAt(i) + 0.5);
                        return (
                            <div key={a} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'center', gap: 22, height: 78, padding: '0 24px', borderRadius: 14, background: hero ? `rgba(255,255,255,${k})` : 'rgba(0,0,0,0)', boxShadow: hero ? `0 ${10 * k}px ${30 * k}px rgba(59,58,54,${0.1 * k})` : 'none', borderTop: i === 0 || hero ? 0 : '1px solid #F4EFE6', opacity: smooth(w * 1.6), transform: `translate3d(${(1 - easeOut(w)) * -14}px, ${-4 * k}px, 0) rotate(0.02deg)`, willChange: 'transform' }}>
                                {hero ? <span style={{ display: 'inline-flex', opacity: smooth(k * 1.5) }}><ScoopIcon size={40} bg="#FFFFFF" /></span> : <span style={{ width: 40 }} />}
                                <span style={{ fontFamily: MONO, fontSize: 24, color: C.ink3, whiteSpace: 'nowrap' }}>{a}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 24, color: C.ink3, whiteSpace: 'nowrap', fontWeight: changed ? 600 : 400 }}>{b}</span>
                                    {changed && <span style={{ height: 32, padding: '0 12px', borderRadius: 16, background: C.paperHi, fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', color: C.ink6, display: 'inline-flex', alignItems: 'center', ...popIn(t, L1.word(27, 'changed') - 0.05, 0.4) }}>CHANGED</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                <DrawPath d="M1300 352 H1318 V650 H1300" k={teal} stroke={C.teal} width={4} />
                <DrawPath d="M1300 668 H1318 V740 H1300" k={grey} stroke={C.g500} width={4} />
            </svg>
            <div style={{ position: 'absolute', left: 1340, top: 500, display: 'flex', flexDirection: 'column', gap: 4, ...slideIn(t, L1.word(27, 'one') - 0.05, 0.45, 14, 0) }}><span style={{ fontSize: 32, fontWeight: 800, color: C.char }}>Same paths:</span><span style={{ fontSize: 32, fontWeight: 800, color: C.teal }}>one rule.</span></div>
            <div style={{ position: 'absolute', left: 1340, top: 680, display: 'flex', flexDirection: 'column', gap: 4, ...slideIn(t, L1.word(27, 'each') - 0.05, 0.45, 14, 0) }}><span style={{ fontSize: 32, fontWeight: 800, color: C.char }}>Changed:</span><span style={{ fontSize: 32, fontWeight: 800, color: C.char }}>its own line.</span></div>
            <Tip kicker="QUICK TIP" title="Export your page list first." sub="From your sitemap or Search Console." x={1340} y={180} w={460} style={slideIn(t, L1.word(28, 'quick') - 0.1, 0.5, 40, 0)} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Shortcut */
const L2 = local('shortcut');
type P = readonly [number, number];
/** The cursor's hunting loop (approved frame's trail): three cubic segments, evaluated at u ∈ [0, 3]. */
const TRAIL: readonly (readonly [P, P, P, P])[] = [
    [[1180, 700], [1260, 640], [1420, 720], [1360, 620]],
    [[1360, 620], [1300, 520], [1560, 520], [1600, 620]],
    [[1600, 620], [1640, 720], [1460, 760], [1500, 660]],
];
const TRAIL_D = 'M1180 700 C 1260 640, 1420 720, 1360 620 C 1300 520, 1560 520, 1600 620 C 1640 720, 1460 760, 1500 660';
function trailAt(u: number): P {
    const i = Math.min(2, Math.floor(clamp(u, 0, 2.9999))), s = clamp(u - i);
    const [a, b, c, d] = TRAIL[i];
    const m = 1 - s;
    return [m * m * m * a[0] + 3 * m * m * s * b[0] + 3 * m * s * s * c[0] + s * s * s * d[0], m * m * m * a[1] + 3 * m * m * s * b[1] + 3 * m * s * s * c[1] + s * s * s * d[1]];
}
export function ShortcutScene() {
    const t = useTime();
    const olds: readonly [string, boolean][] = [['/', false], ['/flavors', false], [NAMES.path, true], ['/about', false], ['/blog/strawberry-season', false]];
    const bend = (i: number) => easeInOut(prog(t, L2.word(30, 'send') + i * 0.12, L2.word(30, 'send') + 0.7 + i * 0.12));
    const checkA = L2.word(31, 'no') - 0.1;
    const huntA = L2.word(32, 'now') - 0.3, huntB = L2.voEnd(32) + 0.2;
    const hunt = easeInOut(prog(t, huntA, huntB));
    const [cx, cy] = trailAt(hunt * 3);
    const head2 = prog(t, L2.word(31, 'perfect') - 0.35, L2.word(31, 'perfect') + 0.1);
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>THE SHORTCUT</Eyebrow>
            <Headline size={80} color={C.char} style={slideIn(t, L2.word(30, 'shortcut') - 0.1, 0.5, 0, 18)}>
                <Roll from="Send everything home?" to={<>It looks <span style={{ color: C.teal }}>perfect.</span></>} k={head2} h={88} />
            </Headline>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                {olds.map((_, i) => <DrawPath key={i} d={`M730 ${368 + i * 104} C 870 ${368 + i * 104}, 900 560, 1060 560`} k={bend(i)} stroke={C.teal} opacity={0.55} />)}
                <DrawPath d={TRAIL_D} k={hunt} stroke={C.char} width={3} dash="2 12" />
            </svg>
            {olds.map(([p, h], i) => <At key={p} x={120} y={330 + i * 104} style={slideIn(t, 0.15 + i * 0.1, 0.5, -30, 0)}><PageCard path={p} w={600} hero={h} /></At>)}
            {olds.map((_, i) => <At key={i} x={740} y={350 + i * 104}><CheckIn t={t} a={checkA + i * 0.08} size={34} /></At>)}
            <At x={1060} y={330} style={slideIn(t, L2.word(30, 'new') - 0.2, 0.55, 40, 0)}>
                <Browser url={`https://${NAMES.new}`} w={732} h={420} bar={54} size={17} shadow={SOFT_SHADOW}><Scaled s={0.62} w={1180} h={576}><Home brand="bites" id="shortcut-home" /></Scaled></Browser>
            </At>
            <At x={cx - 10} y={cy - 20} style={{ opacity: smooth(prog(t, huntA - 0.1, huntA + 0.2)) }}>{CURSOR}</At>
            <span style={{ position: 'absolute', left: 1340, top: 780, height: 56, padding: '0 24px', borderRadius: 28, background: C.char, color: '#FFFFFF', fontSize: 26, fontWeight: 700, display: 'inline-flex', alignItems: 'center', ...popIn(t, L2.word(32, 'hunting') - 0.15, 0.45) }}>Where’s the strawberry?</span>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Melt (and the rewind) */
const L3 = local('melt');
/** The rewind runs over REWIND seconds that end as the next scene starts to cover this one (LAP before the end),
    inside the second of silence after "melt". */
export const REWIND = 0.5;
export const REWIND_END = 0.3; // = LAP
export function MeltScene() {
    const t = useTime();
    const goneA = L3.word(33, 'hundreds') - 0.1;
    const strike = (i: number) => easeInOut(prog(t, L3.word(33, 'exist') - 0.5 + i * 0.15, L3.word(33, 'exist') + i * 0.15));
    const meltA = L3.word(34, 'starts') - 0.1;
    const fwd = easeInOut(prog(t, meltA, meltA + 0.9)); // done well before the rewind: the melted spot holds in the silence
    const rw = easeInOut(prog(t, L3.len - REWIND_END - REWIND, L3.len - REWIND_END));
    const m = fwd * (1 - rw);
    const head2 = prog(t, L3.word(34, 'top') - 0.3, L3.word(34, 'top') + 0.2);
    return (
        <SceneFade t={t} room="glow">
            <Eyebrow t={t} a={0.15}>THE CATCH</Eyebrow>
            <Headline size={72} style={slideIn(t, L3.word(33, 'google') - 0.1, 0.5, 0, 18)}>
                <Roll from="Google notices too." to="The top spot starts to melt." k={head2} h={80} />
            </Headline>
            <Label x={120} y={330} style={slideIn(t, goneA - 0.1, 0.4, -10, 0)}>HOW GOOGLE SEES THE OLD PAGES</Label>
            <div style={{ position: 'absolute', left: 120, top: 380, display: 'flex', flexDirection: 'column', gap: 30 }}>
                {['/flavors', '/about', '/blog/strawberry-season'].map((p, i) => (
                    <div key={p} style={{ display: 'flex', flexDirection: 'column', gap: 6, ...slideIn(t, goneA + i * 0.15, 0.45, -20, 0) }}>
                        <span style={{ position: 'relative', fontFamily: MONO, fontSize: 22, color: mix(C.soft, C.mute, strike(i)), whiteSpace: 'nowrap', width: 'max-content' }}>
                            {NAMES.old}{p}
                            <span style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 2, background: C.mute, transform: `scaleX(${strike(i)})`, transformOrigin: 'left center' }} />
                        </span>
                        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.06em', color: C.red, opacity: smooth(strike(i)) }}>TREATED AS GONE</span>
                    </div>
                ))}
            </div>
            {/* Its old spot: drawn once the card has left it. */}
            <div style={{ position: 'absolute', left: 820, top: 300, width: 980, height: 150, boxSizing: 'border-box', borderRadius: 22, boxShadow: 'inset 0 0 0 3px rgba(185,198,216,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: C.soft, opacity: smooth(prog(m, 0.4, 0.9)) }}>
                Its old spot
                <span style={{ position: 'absolute', left: -78, top: 49, width: 52, height: 52, borderRadius: '50%', boxShadow: `inset 0 0 0 2px ${C.mute}`, fontFamily: MONO, fontSize: 24, color: C.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            </div>
            <At x={820} y={300} style={{ ...fx(smooth(prog(t, 0.2, 0.6)), 0, 260 * m), zIndex: 2 }}>
                <div style={{ position: 'relative', width: Math.round(1040 * 0.94) }}>
                    <StrawberryCard w={1040} s={0.94} ring={C.amber} ringK={m} />
                    <MeltDrips w={1040} s={0.94} melt={m} />
                    <span style={{ position: 'absolute', left: -78, top: 40, width: 52, height: 52, borderRadius: '50%', background: mix(C.char, '#FFFFFF', m), color: mix('#FFFFFF', C.char, m), fontFamily: MONO, fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.4)', overflow: 'hidden' }}>
                        <Roll from="1" to="4" k={prog(m, 0.35, 0.8)} h={30} align="center" />
                    </span>
                </div>
            </At>
            <At x={1680} y={186} style={slideIn(t, meltA, 0.4, 0, 8)}><Tag light={false}>Example</Tag></At>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- One to one */
const L4 = local('onetoone');
export function OneToOneScene({ mapRows }: ChangeDomainProps) {
    const t = useTime();
    const n = mapRows.length;
    // The strawberry row snaps last and thickest.
    const order = mapRows.map(([a], i) => (a === NAMES.path ? n - 1 : i < mapRows.findIndex(([x]) => x === NAMES.path) ? i : i - 1));
    const rowA = (i: number) => L4.word(35, 'one') - 0.1 + order[i] * 0.32;
    return (
        <SceneFade t={t} room="glowTeal">
            <Eyebrow t={t} a={0.15}>THE RULE</Eyebrow>
            <Headline size={64} style={slideIn(t, L4.word(35, 'one') - 0.15, 0.5, 0, 18)}>One old page. One matching new page.</Headline>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                {mapRows.map(([a], i) => {
                    const y = 330 + i * 112, hero = a === NAMES.path;
                    const k = easeInOut(prog(t, rowA(i) + 0.15, rowA(i) + 0.55));
                    const tag = smooth(prog(t, rowA(i) + 0.45, rowA(i) + 0.7));
                    return (
                        <g key={a}>
                            <DrawPath d={`M780 ${y + 38} H1140`} k={k} stroke={C.teal} width={hero ? 5 : 3} />
                            <circle cx="780" cy={y + 38} r={8 * smooth(k * 4)} fill={C.teal} />
                            <circle cx="1140" cy={y + 38} r={8 * smooth(prog(k, 0.85, 1))} fill={C.teal} />
                            <g opacity={tag}><rect x="926" y={y + 22} width="68" height="32" rx="8" fill="#101828" stroke={C.teal} strokeWidth="2" /><text x="960" y={y + 45} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="18" fontWeight="600" fill="#FFFFFF">301</text></g>
                        </g>
                    );
                })}
            </svg>
            {mapRows.map(([a, b], i) => {
                const y = 330 + i * 112, hero = a === NAMES.path;
                return (
                    <div key={a}>
                        <At x={120} y={y} style={slideIn(t, 0.1 + i * 0.07, 0.45, -30, 0)}><PageCard path={a} w={660} hero={hero} /></At>
                        <At x={1140} y={y} style={slideIn(t, rowA(i) + 0.35, 0.4, 40, 0)}><PageCard path={b} k={1} w={660} hero={hero} /></At>
                    </div>
                );
            })}
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Step two: the RedirHub walkthrough */
const L5 = local('product');
const DW = 1460, DH = 660, DS = 1.1;
export function ProductScene({ paste }: ChangeDomainProps) {
    const t = useTime();
    const here = L5.word(36, "here's") - 0.15;
    const rise = easeOut(prog(t, here, here + 0.7));
    const links = L5.word(37, 'links'), create = L5.word(37, 'create'), web = L5.word(37, 'website');
    const chooser = smooth(prog(t, create, create + 0.3)) * (1 - smooth(prog(t, web + 0.75, web + 1.05)));
    const toForm = easeInOut(prog(t, web + 0.75, web + 1.15));
    const o1 = L5.word(38, 'get'), o2 = L5.wordEnd(38, 'com');
    const n1 = L5.word(38, 'get', 1), n2 = L5.wordEnd(38, 'com', 1);
    const mode = easeInOut(prog(t, L5.word(40, 'changed') - 0.1, L5.word(40, 'changed') + 0.5));
    const pulse = (a: number, d = 1.2) => smooth(prog(t, a, a + 0.25)) * (1 - smooth(prog(t, a + d, a + d + 0.35)));
    const st: MigState = {
        mode,
        oldTyped: prog(t, o1, o2), newTyped: prog(t, n1, n2),
        caret: t > o1 - 0.2 && t < o2 + 0.3 ? 'old' : t > n1 - 0.2 && t < n2 + 0.3 ? 'new' : null,
        sameRing: pulse(L5.word(39, 'same') - 0.1, 1.4),
        sameRows: [0, 1, 2].map((i) => prog(t, L5.word(39, 'rule') + i * 0.2, L5.word(39, 'rule') + 0.4 + i * 0.2)),
        heroRing: smooth(prog(t, L5.word(39, 'twin') - 0.2, L5.word(39, 'twin') + 0.2)),
        pasted: clamp((t - L5.word(40, 'paste')) / 0.35, 0, 3),
        csvRing: pulse(L5.word(40, 'spreadsheet') - 0.1, 1.2),
        mapRows: [0, 1, 2].map((i) => prog(t, L5.word(41, 'shows') + i * 0.22, L5.word(41, 'shows') + 0.4 + i * 0.22)),
        skipRing: smooth(prog(t, L5.word(41, 'flags') - 0.1, L5.word(41, 'flags') + 0.3)),
        typeRing: smooth(prog(t, L5.word(42, 'three') - 0.15, L5.word(42, 'three') + 0.25)),
        createRing: pulse(L5.word(41, 'create', 1) - 0.1, 1.0),
    };
    const crumbs: ReactNode[] = [NAMES.newName, 'Links'];
    const formK = toForm;
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark><Roll from="STEP TWO · REDIRECT IT" to="STEP TWO · CHANGED PAGES" k={mode} h={28} /></Eyebrow>
            <Progress fill={1 + easeInOut(prog(t, 0.3, 1.0))} />
            <Headline size={88} color={C.char} y={400} style={{ ...slideIn(t, 0.15, 0.55, 0, 20), opacity: (slideIn(t, 0.15, 0.55, 0, 20).opacity as number) * (1 - smooth(prog(t, here - 0.1, here + 0.3))) }}>
                Step two:<br /><span style={{ color: C.teal }}>redirect every page.</span>
            </Headline>
            <At x={120} y={170} style={fx(smooth(rise * 1.5), 0, (1 - rise) * 80, 0.97 + 0.03 * rise)}>
                <Dashboard s={DS} w={DW} h={DH}>
                    <Shell w={DW} h={DH} active="Links" pulse={pulse(links - 0.1, 0.8)}
                        crumbs={[...crumbs, 'New website migration']} crumbOpacity={[1, 1, smooth((formK - 0.2) / 0.6)]}
                        right={formK > 0.5 ? <span style={{ opacity: smooth((formK - 0.5) * 2) }}><MigrationButtons mode={mode} ring={st.createRing} /></span> : <span style={{ opacity: 1 - smooth(formK * 2) }}><CreateButton press={pulse(create - 0.05, 0.15)} ring={pulse(create - 0.2, 0.5)} /></span>}>
                        {formK < 1 && <div style={{ position: 'absolute', inset: 0, opacity: 1 - formK }}><LinksBody /></div>}
                        {formK > 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: formK }}><MigrationPage st={st} paste={paste} /></div>}
                        {chooser > 0 && (
                            <div style={{ position: 'absolute', inset: 0, background: `rgba(16,24,40,${0.18 * chooser})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ ...fx(chooser, 0, (1 - chooser) * 16, 0.96 + 0.04 * chooser) }}><CreateChooser pick={smooth(prog(t, web - 0.1, web + 0.25))} /></div>
                            </div>
                        )}
                    </Shell>
                </Dashboard>
            </At>
            <Tip kicker="THEN" icon={<Lock size={22} color={C.teal} sw={2.4} />} title="Point the old domain at RedirHub." sub="The padlock is automatic. Our earlier videos show how." x={1330} y={670} w={440}
                style={{ padding: '26px 30px 28px', borderRadius: 22, gap: 10, boxShadow: '0 12px 30px rgba(16,24,40,0.22)', ...slideIn(t, L5.at(43) + 0.05, 0.5, 40, 0) }} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Step three: tell Google */
const L6 = local('tell');
export function TellScene() {
    const t = useTime();
    const pick = L6.word(45, 'new') - 0.2;
    const moveK = L6.word(45, 'new') + 0.25;
    const sitemap = L6.word(46, 'sitemap') - 0.1;
    const g = C;
    const field: CSSProperties = { height: 48, padding: '0 16px', borderRadius: 10, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 18 };
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>STEP THREE · TELL GOOGLE</Eyebrow>
            <Progress fill={2 + easeInOut(prog(t, 0.3, 1.0))} />
            <At x={120} y={240} style={slideIn(t, 0.2, 0.6, 0, 40)}>
                <div data-ui="console" style={{ width: 1180, height: 520, borderRadius: 24, overflow: 'hidden', background: '#FFFFFF', boxShadow: SOFT_SHADOW, fontFamily: UI, color: C.char, display: 'flex' }}>
                    <div style={{ width: 260, flex: 'none', padding: '22px 16px', boxSizing: 'border-box', background: g.g100, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 14px', borderRadius: 10, background: '#FFFFFF', boxShadow: `0 0 0 1px ${g.g200}`, fontFamily: MONO, fontSize: 15 }}>{NAMES.old}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                            {(['Overview', 'Pages', 'Sitemaps', 'Settings'] as const).map((x) => {
                                const on = x === 'Settings';
                                return <span key={x} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', borderRadius: 10, fontSize: 16, fontWeight: on ? 600 : 500, color: on ? C.char : g.g600, background: on ? '#FFFFFF' : 'rgba(0,0,0,0)', boxShadow: on ? `0 0 0 1px ${g.g200}` : 'none' }}>{x}</span>;
                            })}
                        </div>
                    </div>
                    <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, background: g.g50 }}>
                        <span style={{ fontSize: 15, color: g.g500 }}>Settings › Change of address</span>
                        <div style={{ padding: '26px 28px', borderRadius: 16, background: '#FFFFFF', boxShadow: `0 0 0 1px ${g.g200}`, display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <span style={{ fontSize: 22, fontWeight: 700 }}>Change of address</span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 40px minmax(0, 1fr)', alignItems: 'end', gap: 12 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 600, color: g.g600 }}>Old site</span><span style={{ ...field, background: g.g50, boxShadow: `inset 0 0 0 1px ${g.g300}` }}>{NAMES.old}</span></div>
                                <span style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: g.g500 }}>to</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 600, color: g.g600 }}>New site</span>
                                    <span style={{ ...field, justifyContent: 'space-between', background: '#FFFFFF', boxShadow: `inset 0 0 0 1.5px ${mix(g.g300, g.g700, smooth(prog(t, pick, pick + 0.3)))}` }}>
                                        <Roll from={<span style={{ color: g.g400 }}>Choose a site</span>} to={NAMES.new} k={prog(t, pick, pick + 0.4)} h={24} /><Ico d="M6 9l6 6 6-6" size={18} color={g.g600} sw={2} />
                                    </span>
                                </div>
                            </div>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 600, color: C.char, ...slideIn(t, moveK, 0.4, 0, 8) }}><CheckIn t={t} a={moveK + 0.05} size={26} />Move requested</span>
                        </div>
                        <div style={{ padding: '22px 28px', borderRadius: 16, background: '#FFFFFF', boxShadow: `0 0 0 1px ${g.g200}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <span style={{ fontSize: 22, fontWeight: 700 }}>Sitemaps</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 52, padding: '0 16px', borderRadius: 10, background: g.g50 }}>
                                <span style={{ fontFamily: MONO, fontSize: 18 }}>{NAMES.new}/sitemap.xml</span>
                                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, ...slideIn(t, sitemap, 0.4, 8, 0) }}><CheckIn t={t} a={sitemap + 0.05} size={22} />Submitted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </At>
            <div style={{ position: 'absolute', left: 1360, top: 240, width: 440, display: 'flex', flexDirection: 'column', gap: 40 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...slideIn(t, L6.word(45, 'change') - 0.1, 0.45, 20, 0) }}><span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 600, color: C.teal }}>1</span><span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Point the old site at the new one.</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...slideIn(t, L6.word(46, 'submit') - 0.1, 0.45, 20, 0) }}><span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 600, color: C.teal }}>2</span><span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Submit the new sitemap.</span></div>
                <span style={{ height: 34, width: 'max-content', padding: '0 14px', borderRadius: 17, background: C.g100, fontSize: 16, fontWeight: 600, color: C.g600, display: 'inline-flex', alignItems: 'center', ...slideIn(t, 0.6, 0.4, 0, 8) }}>Generic illustration, not the real console</span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Everything you control */
const L7 = local('everything');
export function EverythingScene() {
    const t = useTime();
    const flips = [L7.word(47, 'links') - 0.25, L7.word(47, 'bio') - 0.3, L7.word(47, 'menu') - 0.3, L7.word(47, 'listing') - 0.4];
    const flipK = (i: number) => easeInOut(prog(t, flips[i], flips[i] + 0.8));
    const head2 = prog(t, L7.word(47, 'all') - 0.3, L7.word(47, 'all') + 0.2);
    const tick = (i: number, x: number, y: number, w: number, h: number, node: ReactNode) => (
        <At x={x} y={y} style={slideIn(t, 0.2 + i * 0.12, 0.5, 0, 30)}>
            <div style={{ position: 'relative' }}>
                <Scaled s={1.04} w={w} h={h}>{node}</Scaled>
                <span style={{ position: 'absolute', right: -18, top: -18 }}><CheckIn t={t} a={flips[i] + 0.6} size={48} /></span>
            </div>
        </At>
    );
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>AND EVERYTHING YOU CONTROL</Eyebrow>
            <Headline size={64} color={C.char} style={slideIn(t, 0.2, 0.5, 0, 18)}>
                <Roll from="Update everything you control." to={<>All of it says {NAMES.newName} now.</>} k={head2} h={72} />
            </Headline>
            {tick(0, 120, 420, 380, 300, <SiteLinksCard w={380} k={flipK(0)} id="ev-links" />)}
            {tick(1, 555, 420, 380, 230, <BioCard w={380} k={flipK(1)} id="ev-bio" />)}
            {tick(2, 990, 400, 340, 470, <MenuCard w={340} k={flipK(2)} id="ev-menu" />)}
            {tick(3, 1370, 420, 400, 310, <MapsCard w={400} k={flipK(3)} />)}
        </SceneFade>
    );
}
