/* Act A · Many names, one problem: w43-Domains (beats 1–5), w43-DeadEnds (6–7), w43-Title (8). */
import { useTime, easeOut, easeInOut, prog, clamp } from '../../lib/anim';
import { C, DOTS, Dots3, GlassPill, Lock, MONO, RoomBg, SceneFade, Typo, UI, popIn, slideIn, outK, fx, smooth } from './kit';
import type { ForwardDomainsProps } from './props';
import { local } from './timeline';

/* ---------------------------------------------------------------- Domains */
const L1 = local('domains');
export function DomainsScene({ extras, main, typoSpan }: ForwardDomainsProps) {
    const t = useTime();
    const float = (i: number) => Math.sin(t * 0.9 + i * 1.7) * 4;
    // The idle float rides on the transform (a margin would snap to whole pixels and step).
    const pill = (a: number, i: number) => { const p = popIn(t, a, 0.45); return { ...p, transform: `translate3d(0, ${float(i)}px, 0) ${p.transform}` }; }; // p.transform is already sub-pixel (kit fx)
    const head = slideIn(t, L1.at(1) + 0.05, 0.6, 0, 26);
    const sub = slideIn(t, L1.word(5, 'every'), 0.45, 0, 18);
    return (
        <SceneFade t={t} room="mesh" inD={0.01}>
            <RoomBg room="mesh" t={t} />
            <div style={{ position: 'absolute', left: 120, top: 250, width: 760, display: 'flex', flexDirection: 'column', gap: 30 }}>
                <span style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.035em', ...head }}>Most brands own more than one domain.</span>
                <span style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.4, color: C.soft, ...sub }}>Every one is <span style={{ color: C.ink, fontWeight: 700 }}>a way in.</span></span>
            </div>
            <div style={{ position: 'absolute', left: 1040, top: 190, width: 760, height: 720 }}>
                <span style={{ position: 'absolute', left: 60, top: 0, ...pill(L1.word(2, 'com'), 0) }}><GlassPill>{main}</GlassPill></span>
                <span style={{ position: 'absolute', left: 200, top: 106, ...pill(L1.word(2, 'net'), 1) }}><GlassPill>{extras[0]}</GlassPill></span>
                <span style={{ position: 'absolute', left: 20, top: 212, ...pill(L1.word(2, 'co'), 2) }}><GlassPill>{extras[1]}</GlassPill></span>
                <div style={{ position: 'absolute', left: 240, top: 318, display: 'flex', flexDirection: 'column', gap: 10, ...pill(L1.at(3) + 0.1, 3) }}>
                    <GlassPill><Typo text={extras[2]} span={typoSpan} thick={2} color={`rgba(229,72,77,${clamp(prog(t, L1.word(3, 'misspelling'), L1.word(3, 'misspelling') + 0.4))})`} /></GlassPill>
                    <span style={{ paddingLeft: 30, fontSize: 24, fontWeight: 600, color: C.soft, ...slideIn(t, L1.word(3, 'bought'), 0.4, 0, 10) }}>the typo you bought</span>
                </div>
                <div style={{ position: 'absolute', left: 70, top: 470, width: 380, height: 230, borderRadius: 14, background: C.paper, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', color: C.ink3, padding: '26px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10, ...flyerIn(t, L1.at(4) + 0.05) }}>
                    <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.16em', color: C.ink8 }}>SPRING FLYER</span>
                    <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>New season.<br />Come see us.</span>
                    <span style={{ marginTop: 'auto', fontFamily: MONO, fontSize: 26, fontWeight: 600 }}>{extras[3]}</span>
                </div>
                <span style={{ position: 'absolute', left: 480, top: 600, fontSize: 24, fontWeight: 600, color: C.soft, ...slideIn(t, L1.word(4, 'flyers') - 0.1, 0.4, 0, 10) }}>the short one on flyers</span>
            </div>
        </SceneFade>
    );
}
/** The flyer drops onto the table: from above, settling at -4°. */
function flyerIn(t: number, a: number) {
    const k = easeOut(prog(t, a, a + 0.55));
    return { ...fx(smooth(k * 2), 0, (1 - k) * -60, 1.04 - 0.04 * k, -4 - (1 - k) * 6) };
}

/* ---------------------------------------------------------------- Dead ends */
const L2 = local('deadends');
function SideCard({ domain, title, side }: { domain: string; title: string; side: 'l' | 'r' }) {
    return (
        <div style={{ width: 520, height: 380, borderRadius: 22, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 40px 90px rgba(0,0,0,0.5)', fontFamily: UI, color: C.g700 }}>
            <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderBottom: `1px solid ${C.g200}` }}>
                <Dots3 />
                <div style={{ flex: 1, height: 34, borderRadius: 17, background: C.g100, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: MONO, fontSize: 19, color: C.g700 }}>{domain}</div>
            </div>
            <div style={{ padding: '54px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <span style={{ fontSize: 30, fontWeight: 600, color: C.char }}>{title}</span>
                <span style={{ height: 12, width: side === 'l' ? 320 : 340, borderRadius: 6, background: C.g200 }} />
                <span style={{ height: 12, width: side === 'l' ? 240 : 260, borderRadius: 6, background: C.g200 }} />
                {side === 'l' && <span style={{ height: 12, width: 280, borderRadius: 6, background: C.g200 }} />}
            </div>
        </div>
    );
}
const Warn = ({ s, sw }: { s: number; sw: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5" /><path d="M12 18h.01" /></svg>
);
export function DeadEndsScene({ extras }: ForwardDomainsProps) {
    const t = useTime();
    const aL = L2.word(6, 'parking'), aR = L2.word(6, 'error'), aC = L2.word(6, 'not');
    const side = (a: number, dir: 1 | -1) => {
        const k = easeOut(prog(t, a, a + 0.5));
        const rack = prog(t, aC, aC + 0.5); // focus rack: the sides recede when "Not secure" arrives
        return { opacity: clamp(k * 1.6) * (1 - 0.3 * rack), filter: `blur(${rack * 2.5}px)`, willChange: 'transform', transform: `translateX(${(1 - k) * 80 * dir}px) rotateY(${32 * dir}deg) scale(${0.9 - 0.03 * rack})`, transformOrigin: dir === 1 ? 'right center' : 'left center' };
    };
    const cK = easeOut(prog(t, aC, aC + 0.5));
    const glow = 0.4 + 0.6 * cK;
    return (
        <SceneFade t={t} room="mesh">
            <RoomBg room="mesh" t={t + 5} />
            <div style={{ position: 'absolute', left: '50%', top: 560, width: 1300, height: 500, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(229,72,77,0.22), rgba(229,72,77,0))', opacity: glow }} />
            <div style={{ position: 'absolute', left: 120, top: 110, display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: C.soft, ...slideIn(t, 0.1, 0.4, -12, 0) }}><span style={{ width: 36, height: 3, borderRadius: 2, background: C.red }} />WHAT VISITORS HIT</div>
            <div style={{ position: 'absolute', inset: 0, perspective: 1800 }}>
                <div style={{ position: 'absolute', left: 150, top: 300, ...side(aL, 1) }}><SideCard domain={extras[1]} title="This domain is parked." side="l" /></div>
                <div style={{ position: 'absolute', left: 1250, top: 300, ...side(aR, -1) }}><SideCard domain={extras[2]} title="This site can't be reached" side="r" /></div>
            </div>
            <div data-ui="browser" style={{ position: 'absolute', left: 560, top: 230, width: 800, height: 500, borderRadius: 26, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 60px 140px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10)', fontFamily: UI, color: C.g700, ...fx(smooth(cK * 1.5), 0, (1 - cK) * 40, 0.94 + 0.06 * cK) }}>
                <div style={{ height: 76, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', borderBottom: `1px solid ${C.g200}` }}>
                    <Dots3 size={14} gap={9} />
                    <div style={{ flex: 1, height: 46, borderRadius: 23, background: C.g100, display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 600, color: C.red }}><Warn s={20} sw={2.4} />Not secure</span>
                        <span style={{ width: 1, height: 22, background: C.g300 }} />
                        <span style={{ fontFamily: MONO, fontSize: 22, color: C.g700 }}>https://{extras[0]}</span>
                    </div>
                </div>
                <div style={{ padding: '60px 64px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <Warn s={64} sw={2} />
                    <span style={{ fontSize: 40, fontWeight: 600, color: C.char, letterSpacing: '-0.01em' }}>Your connection is not private</span>
                    <span style={{ fontSize: 22, lineHeight: 1.5, color: C.g600, maxWidth: 640 }}>This site has no valid certificate for this address, so the browser can't confirm who it is talking to.</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 8 }}><span style={{ padding: '13px 26px', borderRadius: 10, background: C.g700, color: '#FFFFFF', fontSize: 20, fontWeight: 600 }}>Back to safety</span><span style={{ fontSize: 20, color: C.g600 }}>Advanced</span></div>
                </div>
            </div>
            <p style={{ position: 'absolute', left: 0, right: 0, top: 800, margin: 0, textAlign: 'center', fontSize: 56, fontWeight: 800, letterSpacing: '-0.025em', ...slideIn(t, L2.at(7) + 0.05, 0.45, 0, 18) }}>A visitor who <span style={{ color: C.red }}>almost</span> reached you.</p>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Title */
const L3 = local('title');
export function TitleScene() {
    const t = useTime();
    const a = L3.at(8);
    const draw = easeInOut(prog(t, a - 0.1, a + 0.9));
    const node = easeOut(prog(t, a + 0.7, a + 1.0));
    const title = slideIn(t, a + 0.45, 0.6, 0, 24);
    const pillK = popIn(t, L3.word(8, 'https') - 0.05, 0.45);
    const floorK = easeOut(prog(t, 0, 1.4));
    const ys = [12, 36, 60, 84, 108];
    return (
        <SceneFade t={t} room="sweep">
            <RoomBg room="sweep" t={t} />
            <div style={{ position: 'absolute', left: -400, right: -400, top: 640, height: 900, willChange: 'transform', transform: `perspective(700px) rotateX(62deg) translateY(${(1 - floorK) * 60 - t * 6}px)`, transformOrigin: 'top center', backgroundImage: 'linear-gradient(rgba(255,255,255,0.22) 2px, rgba(0,0,0,0) 2px), linear-gradient(90deg, rgba(255,255,255,0.22) 2px, rgba(0,0,0,0) 2px)', backgroundSize: '120px 120px', WebkitMaskImage: 'linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0) 80%)', maskImage: 'linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0) 80%)', opacity: floorK }} />
            <div style={{ position: 'absolute', left: '50%', top: 520, width: 1400, height: 520, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, textAlign: 'center', color: C.ink }}>
                <svg width="220" height="120" viewBox="0 0 220 120" aria-hidden="true" style={{ opacity: clamp(prog(t, a - 0.2, a + 0.1)) }}>
                    {ys.map((y) => <path key={y} d={y === 60 ? 'M14 60 L196 60' : `M14 ${y} C100 ${y} 120 60 196 60`} fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />)}
                    {ys.map((y) => <circle key={'c' + y} cx="14" cy={y} r="7" fill="#FFFFFF" />)}
                    <circle cx="200" cy="60" r={16 * node} fill="#FFFFFF" />
                </svg>
                <h1 style={{ margin: 0, fontSize: 104, lineHeight: 1.02, fontWeight: 800, letterSpacing: '-0.035em', ...title }}>How to forward multiple<br />domains to one website.</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, height: 84, padding: '0 40px', borderRadius: 42, background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.18)', fontSize: 40, fontWeight: 700, ...pillK }}>
                    <Lock size={34} color="#FFFFFF" />With HTTPS on every one.
                </span>
            </div>
        </SceneFade>
    );
}
