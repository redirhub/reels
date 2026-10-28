/* Act E · Proof, the sweet surprise, and the same spot: w44-Checker (48–51), w44-OldMenu (52), w44-Wobble (53–54),
   w44-Watch (55), w44-Keep (56–58), the Steps recap (59, in ActC), w44-Return (60–61) and w44-EndCard (62–65). */
import { BrandedQr } from '../../components/QrCode';
import { RedirHubLogo } from '../../brand/Logo';
import { clamp, easeInOut, easeOut, prog, useTime } from '../../lib/anim';
import { At, Browser, C, Check, CheckIn, DrawPath, Eyebrow, Headline, MONO, Roll, SHOP, SOFT_SHADOW, SceneFade, Tag, fx, mix, popIn, slideIn, smooth } from './kit';
import { AnalyticsBody, Dashboard, Shell } from './Product';
import { Logo, MenuCard, Phone, ScoopIcon, SearchPage, StrawberryCard } from './shop';
import { NAMES, type ChangeDomainProps } from './props';
import { local } from './timeline';
import { SEARCH } from './ActA';

/* ---------------------------------------------------------------- Checker */
const L1 = local('checker');
export function CheckerScene() {
    const t = useTime();
    const paste = L1.word(49, 'paste') + 0.1;
    const press = L1.voEnd(49) + 0.05;
    const hop1 = L1.word(50, 'hop') - 0.2, hop2 = L1.word(50, 'lands') - 0.1;
    const pass = L1.word(50, "that's") - 0.1;
    const url = `https://${NAMES.old}${NAMES.path}`;
    const okRow = (text: string, a: number) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', ...slideIn(t, a, 0.4, 16, 0) }}><CheckIn t={t} a={a + 0.05} />{text}</span>
    );
    const row = (n: number, u: string, code: string, ok: boolean, a: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px', borderTop: n === 1 ? 0 : `1px solid ${C.g200}`, ...slideIn(t, a, 0.4, 0, 10) }}>
            <span style={{ width: 32, height: 32, flex: 'none', borderRadius: '50%', background: C.g100, fontSize: 15, fontWeight: 600, color: C.g700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
            <span style={{ flex: 1, fontFamily: MONO, fontSize: 18, whiteSpace: 'nowrap' }}>{u}</span>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: ok ? '#ECFDF3' : '#E8F0F8', color: ok ? '#067647' : C.blue, fontFamily: MONO, fontSize: 18, fontWeight: 600 }}>{code}</span>
        </div>
    );
    const sel = smooth(prog(t, paste, paste + 0.15)) * (1 - smooth(prog(t, paste + 0.35, paste + 0.7)));
    return (
        <SceneFade t={t} room="glowTeal">
            <Eyebrow t={t} a={0.15}>NOW TEST IT · FREE REDIRECT CHECKER</Eyebrow>
            <At x={120} y={230} style={slideIn(t, 0.2, 0.6, 0, 40)}>
                <Browser url="redirhub.com/redirect-checker" w={1080} h={520}>
                    <div style={{ padding: '40px 50px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' }}>Check Any URL Redirect</span>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1, height: 58, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${mix(C.g300, C.blue, sel)}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 19, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                <span style={{ background: `rgba(28,109,182,${0.18 * sel})`, borderRadius: 4, ...fx(smooth(prog(t, paste, paste + 0.12)), 0, 0) }}>{url}</span>
                            </div>
                            <span style={{ height: 58, padding: '0 22px', borderRadius: 12, background: C.blue, color: '#FFFFFF', fontSize: 19, fontWeight: 600, display: 'inline-flex', alignItems: 'center', transform: `scale(${1 - 0.05 * smooth(prog(t, press, press + 0.08)) * (1 - smooth(prog(t, press + 0.1, press + 0.25)))})`, boxShadow: `0 0 0 ${4 * smooth(prog(t, press - 0.2, press)) * (1 - smooth(prog(t, press + 0.2, press + 0.5)))}px rgba(28,109,182,0.3)` }}>Check Redirect</span>
                        </div>
                        <div style={{ marginTop: 10, borderRadius: 16, boxShadow: `inset 0 0 0 1.5px ${C.g200}`, overflow: 'hidden', opacity: smooth(prog(t, hop1 - 0.1, hop1 + 0.2)) }}>
                            {row(1, url, '301', false, hop1)}
                            {row(2, `https://${NAMES.new}${NAMES.path}`, '200', true, hop2)}
                        </div>
                    </div>
                </Browser>
            </At>
            <div style={{ position: 'absolute', left: 120, top: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', color: C.soft, marginRight: 6, ...slideIn(t, L1.word(51, 'try') - 0.1, 0.4, -10, 0) }}>TRY A FEW MORE</span>
                {([['Your best sellers', 'best'], ['An old blog post', 'blog'], ['The www version', 'www']] as const).map(([x, w]) => (
                    <span key={x} style={{ height: 44, padding: '0 18px', borderRadius: 22, background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.22)', display: 'inline-flex', alignItems: 'center', fontSize: 20, fontWeight: 600, color: C.soft, ...popIn(t, L1.word(51, w) - 0.15, 0.4) }}>{x}</span>
                ))}
            </div>
            <div style={{ position: 'absolute', left: 1270, top: 250, width: 530, display: 'flex', flexDirection: 'column', gap: 30 }}>
                {okRow('One hop', L1.word(50, 'hop') - 0.1)}
                {okRow('A 301', L1.word(50, 'three') - 0.1)}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22, ...slideIn(t, hop2, 0.4, 16, 0) }}>
                    <CheckIn t={t} a={hop2 + 0.05} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '56px' }}>Lands on its twin</span>
                        <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: C.teal }}>{NAMES.new}<br />{NAMES.path}</span></div>
                </div>
                <span style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', width: 'max-content', height: 96, padding: '0 40px', borderRadius: 48, background: C.teal, boxShadow: '0 0 0 10px rgba(32,167,149,0.20), 0 30px 70px rgba(32,167,149,0.30)', fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', ...popIn(t, pass, 0.5, 0.7) }}>That’s a pass.</span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- The sweet surprise */
const L2 = local('oldmenu');
/** Sparkles when the phone lands (pure functions of time: each grows, turns white → teal and fades). */
function Sparkles({ t, a, x, y }: { t: number; a: number; x: number; y: number }) {
    const pts: readonly [number, number, number][] = [[-30, -40, 30], [400, 10, 24], [-50, 300, 20], [410, 260, 34], [180, -70, 22], [360, 560, 18]];
    return (
        <>
            {pts.map(([dx, dy, s], i) => {
                const k = prog(t, a + i * 0.06, a + 0.9 + i * 0.06);
                const o = smooth(k * 4) * (1 - smooth(prog(k, 0.55, 1)));
                return (
                    <svg key={i} width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{ position: 'absolute', left: x + dx, top: y + dy, ...fx(o, 0, -10 * k, 0.4 + 0.8 * easeOut(k)) }}>
                        <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill={i % 2 ? '#FFFFFF' : SHOP.blush} />
                    </svg>
                );
            })}
        </>
    );
}
export function OldMenuScene() {
    const t = useTime();
    const sweet = L2.word(52, 'sweet') - 0.15;
    const menuA = L2.word(52, 'menu') - 0.2;
    const says = L2.word(52, 'says') - 0.1;
    const scan = L2.word(52, 'scans') - 0.1;
    const land = L2.word(52, 'lands') - 0.05;
    const works = L2.word(52, 'every') - 0.1;
    const phone = easeOut(prog(t, scan - 0.3, scan + 0.4));
    const beam = prog(t, scan + 0.2, land);
    const loaded = smooth(prog(t, land, land + 0.4));
    return (
        <SceneFade t={t} room="sweep">
            <Eyebrow t={t} a={0.15}>THE SWEET SURPRISE</Eyebrow>
            <Headline size={72} style={slideIn(t, sweet, 0.5, 0, 18)}>
                <Roll from="Here’s the sweet part." to="Even the old menus still work." k={prog(t, works - 0.2, works + 0.3)} h={80} />
            </Headline>
            <div style={{ position: 'absolute', left: 120, top: 300, display: 'flex', flexDirection: 'column', gap: 16, ...slideIn(t, menuA, 0.6, -50, 0) }}>
                <span style={{ display: 'inline-flex', width: 'max-content', alignItems: 'center', height: 38, padding: '0 16px', borderRadius: 19, background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45)', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em' }}>PRINTED IN 2021</span>
                <div style={{ boxShadow: `0 0 0 ${6 * smooth(prog(t, says, says + 0.3)) * (1 - smooth(prog(t, says + 1.0, says + 1.4)))}px rgba(255,255,255,0.5)`, borderRadius: 10 }}>
                    <MenuCard w={400} k={0} id="old-menu" scan={smooth(prog(t, scan, scan + 0.2)) * (1 - smooth(prog(t, land + 0.2, land + 0.6)))} qrLabel={<>{NAMES.old}<br />{NAMES.path}</>} />
                </div>
            </div>
            <div style={{ position: 'absolute', left: 600, top: 420, width: 620, boxSizing: 'border-box', padding: '30px 34px', borderRadius: 26, background: 'rgba(255,255,255,0.94)', color: C.char, boxShadow: '0 30px 70px rgba(16,24,40,0.22)', display: 'flex', flexDirection: 'column', gap: 22, ...slideIn(t, scan, 0.5, 0, 24) }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.12em', color: C.g500 }}>THE OLD MENU SAYS</span><span style={{ fontFamily: MONO, fontSize: 21, whiteSpace: 'nowrap' }}>{NAMES.old}{NAMES.path}</span></div>
                <div style={{ height: 1, background: C.g200 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...slideIn(t, land, 0.45, 0, 10) }}><span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.12em', color: C.g500 }}>THE PHONE OPENS</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 21, fontWeight: 600, whiteSpace: 'nowrap' }}>{NAMES.new}{NAMES.path}<CheckIn t={t} a={land + 0.3} size={30} /></span></div>
            </div>
            <At x={1380} y={286} style={fx(smooth(phone * 1.5), (1 - phone) * 80, 0)}>
                <Phone w={380} h={650}>
                    <div style={{ height: 44, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.g100, fontFamily: MONO, fontSize: 12, color: C.g700 }}>
                        <Roll from="Scanning…" to={`${NAMES.new}${NAMES.path}`} k={prog(t, land - 0.1, land + 0.25)} h={16} align="center" />
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                        {/* The camera view while scanning: a soft frame and a beam. */}
                        <div style={{ position: 'absolute', inset: 0, background: '#2A3244', opacity: 1 - loaded, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: 200, height: 200, borderRadius: 24, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.7)' }}>
                                <span style={{ position: 'absolute', left: 12, right: 12, top: 12 + 170 * (0.5 - 0.5 * Math.cos(beam * Math.PI * 2)), height: 3, borderRadius: 2, background: C.teal, boxShadow: `0 0 12px ${C.teal}` }} />
                            </div>
                        </div>
                        <div data-shop style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${SHOP.blush} 0%, #FFFFFF 70%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '26px 22px', opacity: loaded, transform: `translate3d(0, ${(1 - loaded) * 20}px, 0)` }}>
                            <Logo width={230} k={1} id="phone-logo" />
                            <span style={{ display: 'inline-flex', transform: `scale(${0.9 + 0.1 * easeOut(prog(t, land + 0.1, land + 0.6))})` }}><ScoopIcon size={190} bg="#FFFFFF" /></span>
                            <span style={{ fontSize: 34, fontWeight: 700, color: SHOP.ink }}>Strawberry</span>
                            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.08em', color: SHOP.ink, opacity: 0.6 }}>THE FAMOUS ONE</span>
                            <span style={{ marginTop: 6, height: 50, padding: '0 26px', borderRadius: 25, background: SHOP.ink, color: '#FFFFFF', fontSize: 18, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>Order a scoop</span>
                        </div>
                    </div>
                </Phone>
            </At>
            <Sparkles t={t} a={land + 0.15} x={1380} y={286} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Wobble */
const L3 = local('wobble');
const PTS: readonly [number, number][] = [[200, 360], [500, 360], [620, 360], [720, 640], [830, 470], [930, 690], [1060, 430], [1170, 540], [1290, 380], [1420, 400], [1640, 360]];
const TRACK = PTS.slice(1).reduce((d, [x1, y1], i) => { const [x0, y0] = PTS[i]; const mx = (x0 + x1) / 2; return `${d} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; }, `M${PTS[0][0]} ${PTS[0][1]}`);
/** A point on the track at u ∈ [0, 10] (segment i, param s). */
function trackAt(u: number): [number, number] {
    const i = Math.min(9, Math.floor(clamp(u, 0, 9.9999))), s = clamp(u - i);
    const [x0, y0] = PTS[i], [x1, y1] = PTS[i + 1], mx = (x0 + x1) / 2, m = 1 - s;
    return [m * m * m * x0 + 3 * m * m * s * mx + 3 * m * s * s * mx + s * s * s * x1, m * m * m * y0 + 3 * m * m * s * y0 + 3 * m * s * s * y1 + s * s * s * y1];
}
export function WobbleScene() {
    const t = useTime();
    const draw = easeInOut(prog(t, 0.3, L3.word(53, 'wobble')));
    const rideA = L3.word(53, 'few') - 0.3, rideB = L3.word(54, 'normal') + 0.1;
    const u = 10 * easeInOut(prog(t, rideA, rideB));
    const [x, y] = trackAt(u);
    return (
        <SceneFade t={t} room="charcoal">
            <Eyebrow t={t} a={0.15}>THE PART NOBODY WARNS YOU ABOUT</Eyebrow>
            <Headline size={72} style={slideIn(t, L3.word(53, 'few') - 0.15, 0.5, 0, 18)}>A few weeks of wobble.</Headline>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                <path d="M200 800 H1660" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                {[620, 860, 1100, 1340, 1580].map((tx) => <path key={tx} d={`M${tx} 800 V812`} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />)}
                <DrawPath d={TRACK} k={draw} stroke="#FFFFFF" width={22} opacity={0.18} dash="3 22" />
                <g transform="translate(0 -9)"><DrawPath d={TRACK} k={draw} stroke="#FFFFFF" width={5} /></g>
                <g transform="translate(0 9)"><DrawPath d={TRACK} k={draw} stroke="#FFFFFF" width={5} /></g>
                <path d="M620 300 V820" stroke={C.mute} strokeWidth="2" strokeDasharray="6 8" opacity={smooth(prog(t, 0.6, 1.2))} />
            </svg>
            {([[1, 860], [2, 1100], [3, 1340], [4, 1580]] as const).map(([n, wx], i) => <span key={n} style={{ position: 'absolute', left: wx - 60, top: 824, width: 120, textAlign: 'center', fontSize: 22, fontWeight: 600, color: C.soft, ...slideIn(t, 0.8 + i * 0.15, 0.4, 0, 8) }}>Week {n}</span>)}
            <span style={{ position: 'absolute', left: 560, top: 824, width: 120, textAlign: 'center', fontSize: 22, fontWeight: 700, color: C.ink, ...slideIn(t, 0.6, 0.4, 0, 8) }}>The move</span>
            <span style={{ position: 'absolute', left: 120, top: 344, fontSize: 22, fontWeight: 700, color: C.soft, ...slideIn(t, 0.5, 0.4, -8, 0) }}>#1</span>
            <At x={x - 38} y={y - 64} style={popIn(t, 0.5, 0.45)}><ScoopIcon size={76} bg="#FFFFFF" /></At>
            <At x={1680} y={186} style={slideIn(t, 0.6, 0.4, 0, 8)}><Tag light={false}>Example</Tag></At>
            <div style={{ position: 'absolute', left: 120, right: 120, top: 884, textAlign: 'center', fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', ...slideIn(t, L3.word(54, 'normal') - 0.1, 0.45, 0, 14) }}>
                Normal. <span style={{ display: 'inline-block', ...slideIn(t, L3.word(54, "don't") - 0.15, 0.45, 0, 10) }}>Don’t undo the redirects.</span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Watch */
const L4 = local('watch');
export function WatchScene() {
    const t = useTime();
    const ring = smooth(prog(t, L4.word(55, 'old') - 0.2, L4.word(55, 'old') + 0.3));
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>WATCH THE MOVE</Eyebrow>
            <At x={120} y={200} style={slideIn(t, 0.15, 0.6, 0, 40)}>
                <Dashboard s={1.4} w={900} h={520}>
                    <Shell w={900} h={520} active="Analytics" crumbs={[NAMES.newName, 'Analytics']}><AnalyticsBody ring={ring} rows={[prog(t, 0.6, 1.0), prog(t, 0.75, 1.15)]} /></Shell>
                </Dashboard>
            </At>
            <div style={{ position: 'absolute', left: 1400, top: 320, width: 400, display: 'flex', flexDirection: 'column', gap: 22 }}>
                <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, color: C.char, ...slideIn(t, L4.word(55, 'how') - 0.15, 0.5, 20, 0) }}>See who still uses the old address.</span>
                <span style={slideIn(t, L4.word(55, 'how'), 0.4, 0, 8)}><Tag>Example numbers</Tag></span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Keep */
const L5 = local('keep');
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
export function KeepScene() {
    const t = useTime();
    const r1 = L5.word(57, 'keep') - 0.2;
    const tickA = L5.word(57, 'least') - 0.2, tickB = L5.wordEnd(57, 'year') + 0.4;
    const good = L5.word(57, 'keep', 1) - 0.15;
    const r2 = L5.word(58, 'renewing') - 0.4;
    const someone = L5.word(58, 'someone') - 0.1;
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>BEFORE YOU GO</Eyebrow>
            <Headline size={72} color={C.char} style={slideIn(t, L5.word(56, 'two') - 0.15, 0.45, 0, 18)}>Two rules.</Headline>
            <div data-ui="print" style={{ position: 'absolute', left: 120, top: 340, width: 780, boxSizing: 'border-box', padding: 36, borderRadius: 22, background: C.paper, boxShadow: '0 30px 70px rgba(59,58,54,0.16), 0 0 0 1px #F4EFE6', color: C.ink3, display: 'flex', flexDirection: 'column', gap: 22, ...slideIn(t, r1, 0.55, 0, 30) }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.14em', color: C.ink8 }}>RULE ONE</span>
                <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08 }}>Keep the redirects<br />a year, at least.</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 8 }}>
                    {MONTHS.map((m, i) => {
                        const k = smooth(prog(t, tickA + (tickB - tickA) * (i / 12), tickA + (tickB - tickA) * ((i + 1) / 12)));
                        return <span key={m} style={{ height: 44, borderRadius: 8, background: mix('#FFFFFF', 'rgba(32,167,149,0.16)', k), boxShadow: `inset 0 0 0 1px ${mix('#F4EFE6', C.teal, k)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, color: mix(C.ink6, '#0E7A6C', k) }}>{m}</span>;
                    })}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 700, color: C.char, ...slideIn(t, good, 0.45, 0, 10) }}><CheckIn t={t} a={good + 0.1} size={34} />Better still: keep them for good.</span>
            </div>
            <div style={{ position: 'absolute', left: 980, top: 340, width: 820, boxSizing: 'border-box', padding: 36, borderRadius: 22, background: '#FFFFFF', boxShadow: SOFT_SHADOW, display: 'flex', flexDirection: 'column', gap: 22, color: C.char, ...slideIn(t, r2, 0.55, 0, 30) }}>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.14em', color: C.g500 }}>RULE TWO</span>
                <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08 }}>Keep renewing<br />the old domain.</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 24px', borderRadius: 16, background: C.g50, boxShadow: `inset 0 0 0 1px ${C.g200}` }}>
                    <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600 }}>{NAMES.old}</span>
                    <span style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}><span style={{ fontSize: 16, fontWeight: 600, color: C.g500 }}>Renews</span><span style={{ fontSize: 22, fontWeight: 700 }}>Oct 2027</span></span>
                </div>
                <span style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.35, color: C.g700, ...slideIn(t, L5.word(58, 'if') - 0.15, 0.45, 0, 10) }}>If it lapses, <span style={{ color: mix(C.g700, C.red, smooth(prog(t, someone, someone + 0.3))) }}>someone else</span> can buy it, and every link that still points to it.</span>
                <span style={slideIn(t, r2 + 0.3, 0.4, 0, 6)}><Tag>Example date</Tag></span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Return */
const L6 = local('ret');
export function ReturnScene() {
    const t = useTime();
    const typed = prog(t, L6.word(60, 'best') - 0.05, L6.wordEnd(60, 'cream'));
    const cardA = L6.word(60, 'again') - 0.1;
    const roll = prog(t, L6.word(61, 'frosty') - 0.15, L6.word(61, 'bites') + 0.2);
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.15} dark>A FEW WEEKS LATER</Eyebrow>
            <At x={SEARCH.x} y={SEARCH.y} style={slideIn(t, 0, 0.5, 0, 20)}>
                <SearchPage typed={typed} caret={typed > 0 && typed < 1} slot={
                    <div style={{ position: 'absolute', left: 0, top: 0, ...fx(smooth(prog(t, cardA, cardA + 0.45)), 0, (1 - easeOut(prog(t, cardA, cardA + 0.5))) * 16) }}>
                        <StrawberryCard w={1040} k={roll} rank="1" />
                    </div>
                } />
            </At>
            <div style={{ position: 'absolute', left: 120, right: 120, top: 884, textAlign: 'center', fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: C.char, ...slideIn(t, L6.word(61, 'right') - 0.15, 0.45, 0, 16) }}>Right where {NAMES.oldName} used to be.</div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- End card */
const L7 = local('end');
export function EndCardScene({ end, qr }: ChangeDomainProps) {
    const t = useTime();
    // The Frosty Bites card docks from the search result under the headline (shared element across the cut).
    const dock = easeInOut(prog(t, 0, 0.8));
    const cardX = 140, cardY = 640, cardS = 0.5;
    const l1 = L7.word(62, 'new') - 0.1, l2 = L7.word(62, 'same', 1) - 0.1;
    const tail = L7.word(63, 'stuck') + 0.2;
    return (
        <SceneFade t={t} room="glow" carry={dock < 1 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: 'top left', ...fx(1, SEARCH.cardX + (cardX - SEARCH.cardX) * dock, SEARCH.cardY + (cardY - SEARCH.cardY) * dock, 1 - (1 - cardS) * dock) }}>
                <StrawberryCard w={1040} k={1} style={{ boxShadow: `0 24px 60px rgba(16,24,40,${(0.16 * clamp(dock * 3)).toFixed(3)}), 0 0 0 1px ${C.g200}` }} />
            </div>
        ) : null}>
            <div style={{ position: 'absolute', left: 140, top: 200, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 128, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em', ...slideIn(t, l1, 0.45, 0, 30) }}>{end.lines[0]}</span>
                <span style={{ fontSize: 128, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em', color: C.teal, ...slideIn(t, l2, 0.45, 0, 30) }}>{end.lines[1]}</span>
            </div>
            <div style={{ position: 'absolute', left: 140, top: 500, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 34 }}>
                <span style={{ color: C.soft, ...slideIn(t, L7.word(63, 'links') - 0.1, 0.4, 0, 14) }}>{end.sub}</span>
                <span style={{ fontWeight: 700, ...slideIn(t, L7.word(63, 'stuck') - 0.2, 0.4, 0, 14) }}>{end.cta}</span>
            </div>
            {dock >= 1 && <At x={cardX} y={cardY} style={{ transformOrigin: 'top left', transform: `scale(${cardS})` }}><StrawberryCard w={1040} k={1} /></At>}
            <div style={{ position: 'absolute', left: 140, top: 820, width: 300, ...slideIn(t, tail, 0.45, 0, 16) }}><RedirHubLogo variant="white" /></div>
            <div style={{ position: 'absolute', left: 700, top: 610, ...slideIn(t, tail + 0.15, 0.45, 0, 16) }}><BrandedQr value={qr.value} label={qr.label} size={180} labelSize={19} /></div>
        </SceneFade>
    );
}
