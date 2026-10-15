/* Act B · How it works, the shortcut that fakes it, and the twist:
   w43-Pointer (9–11), w43-Perfect → w43-Copies (12–15, one scene: the room drops, the cards stay),
   w43-AddressBar (16, ends on the film's only time-reverse), w43-OneAddress (17–18), w43-Steps (19, and the recap at 48). */
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { clamp, easeInOut, easeOut, lerp, prog, useTime } from '../../lib/anim';
import { C, Eyebrow, GlassPill, Lock, MONO, RoomBg, SceneFade, SiteCard, Tick, Typo, UI, popIn, slideIn, outK, fx, mix, smooth } from './kit';
import type { ForwardDomainsProps } from './props';
import { local, type Local } from './timeline';

/* ---------------------------------------------------------------- Pointer */
const LP = local('pointer');
export function PointerScene({ main, extras, hostIp }: ForwardDomainsProps) {
    const t = useTime();
    // Each object lands on its word and stays: the site where it "lives", the address book on "DNS",
    // then the other four names on "five domains". Nothing leaves before the scene ends.
    const site = slideIn(t, LP.word(9, 'lives') - 0.15, 0.5, 30, 0);
    const book = slideIn(t, LP.word(10, 'dns') - 0.2, 0.5, 0, 30);
    const line1 = easeInOut(prog(t, LP.word(10, 'dns') - 0.1, LP.word(10, 'dns') + 0.4));
    const line2 = easeInOut(prog(t, LP.word(10, 'book') - 0.1, LP.word(10, 'book') + 0.4));
    const hi = clamp(prog(t, LP.word(10, 'address'), LP.word(10, 'address') + 0.3));
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.char} dash={C.teal}>HOW A DOMAIN WORKS</Eyebrow>
            <h2 style={{ position: 'absolute', left: 120, top: 170, margin: 0, fontSize: 80, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08, color: C.char }}>
                <span style={slideIn(t, LP.at(9) + 0.3, 0.5, 0, 20)}>A domain doesn&apos;t hold your site.</span><br />
                <span style={{ color: C.teal, display: 'inline-block', ...slideIn(t, LP.word(9, 'points') - 0.1, 0.5, 0, 20) }}>It points to where it lives.</span>
            </h2>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0 }}>
                <path d="M500 554 L655 554" fill="none" stroke={C.teal} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" strokeDashoffset={-t * 30} style={{ clipPath: `inset(0 ${(1 - line1) * 100}% 0 0)` }} />
                <path d="M641 542 L657 554 L641 566" fill="none" stroke={C.teal} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={line1 > 0.95 ? 1 : 0} />
                <path d="M1205 554 L1288 554" fill="none" stroke={C.teal} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" strokeDashoffset={-t * 30} style={{ clipPath: `inset(0 ${(1 - line2) * 100}% 0 0)` }} />
                <path d="M1274 542 L1290 554 L1274 566" fill="none" stroke={C.teal} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity={line2 > 0.95 ? 1 : 0} />
            </svg>
            <div style={{ position: 'absolute', left: 120, top: 470, width: 520, display: 'flex', flexDirection: 'column', gap: 18, ...slideIn(t, LP.word(9, 'points') + 0.2, 0.45, 0, 20) }}>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', color: C.g600 }}>WHAT PEOPLE TYPE</span>
                <span style={{ width: 'max-content' }}><LightPill>{main}</LightPill></span>
                {extras.map((d, i) => (
                    <span key={d} style={{ width: 'max-content', marginTop: i ? -6 : 0, ...popIn(t, LP.word(11, 'five') + i * 0.12, 0.4) }}><LightPill size={28}>{d}</LightPill></span>
                ))}
            </div>
            <div style={{ position: 'absolute', left: 680, top: 440, width: 500, borderRadius: 18, background: C.paper, boxShadow: `0 30px 70px rgba(16,24,40,0.16), inset 0 0 0 1px ${C.paper2}`, padding: '30px 34px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18, color: C.ink3, ...book }}>
                <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '0.16em', color: C.ink8 }}>ADDRESS BOOK · DNS</span>
                <div style={{ height: 10, width: 300, borderRadius: 5, background: C.paper2 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderRadius: 12, background: C.paperHi, boxShadow: `0 0 0 ${3 * hi}px rgba(32,167,149,${0.6 * hi})`, fontFamily: MONO, fontSize: 24, fontWeight: 600 }}><span>{main}</span><span style={{ color: C.ink6, padding: '0 10px' }}>→</span><span>{hostIp}</span></div>
                <div style={{ height: 10, width: 340, borderRadius: 5, background: C.paper2 }} />
                <div style={{ height: 10, width: 260, borderRadius: 5, background: C.paper2 }} />
            </div>
            <div style={{ position: 'absolute', left: 1310, top: 420, width: 490, display: 'flex', flexDirection: 'column', gap: 14, ...site }}>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', color: C.g600 }}>WHERE THE SITE LIVES · <span style={{ fontFamily: MONO, letterSpacing: 0, fontWeight: 600 }}>{hostIp}</span></span>
                <div data-ui="browser" style={{ borderRadius: 20, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 30px 70px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)', fontFamily: UI }}>
                    <div style={{ height: 48, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: `1px solid ${C.g200}` }}>{['#F97066', '#FDB022', '#32D583'].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}</div>
                    <div style={{ padding: '30px 30px 34px', display: 'flex', flexDirection: 'column', gap: 14 }}><span style={{ width: 40, height: 40, borderRadius: 9, background: C.navy }} /><span style={{ fontSize: 30, fontWeight: 600, color: C.char }}>Welcome to mybrand</span><span style={{ height: 10, width: 330, borderRadius: 5, background: C.g200 }} /><span style={{ height: 10, width: 250, borderRadius: 5, background: C.g200 }} /></div>
                </div>
            </div>
        </SceneFade>
    );
}
function LightPill({ children, size = 40 }: { children: ReactNode; size?: number }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.35, height: size * 2.3, padding: `0 ${size * 0.75}px`, borderRadius: size * 1.15, background: 'linear-gradient(140deg, rgba(255,255,255,0.79) 0%, rgba(255,255,255,0.64) 100%)', boxShadow: 'inset 0 0 0 1.5px #FFFFFF, 0 24px 60px rgba(16,24,40,0.12)', fontFamily: MONO, fontSize: size, fontWeight: 600, color: C.char, whiteSpace: 'pre' }}>
            <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: C.teal }} />{children}
        </span>
    );
}

/* ---------------------------------------------------------------- Twist: Perfect → Copies */
const LT = local('twist');
const CARDS: readonly { x: number; y: number }[] = [{ x: 120, y: 400 }, { x: 710, y: 400 }, { x: 1300, y: 400 }, { x: 415, y: 690 }, { x: 1005, y: 690 }];
export function TwistScene({ main, extras, typoSpan }: ForwardDomainsProps) {
    const t = useTime();
    const domains = [main, extras[0], extras[1], extras[2], extras[3]];
    const drop = easeInOut(prog(t, LT.at(14) - 0.05, LT.at(14) + 0.55)); // the room plunges
    const tickA = LT.at(13) + 0.25;
    const stampA = LT.word(14, 'copies') - 0.15;
    const lensA = LT.at(15) + 0.15;
    const lens = easeOut(prog(t, lensA, lensA + 0.6));
    const chip = popIn(t, LT.word(15, 'picks') - 0.1, 0.4);
    const head1 = slideIn(t, LT.at(13) + 0.05, 0.5, 0, 18);
    const head2 = slideIn(t, LT.at(14) + 0.35, 0.5, 0, 18);
    const stampOrder = [0, 2, 3, 4]; // every card but Google's pick (mybrand.net)
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} opacity={1 - drop} />
            <AbsoluteFill style={{ opacity: drop }}>
                <RoomBg room="twist" t={t}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.025) 0 2px, rgba(0,0,0,0) 2px 22px)' }} />
                </RoomBg>
            </AbsoluteFill>
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6)) * (1 - drop)} color={C.char} dash={C.teal}>WAY ONE · POINT EVERY DOMAIN AT YOUR HOSTING</Eyebrow>
            <Eyebrow k={drop} color={C.soft} dash={C.red}>THE TWIST</Eyebrow>
            <h2 style={{ position: 'absolute', left: 120, top: 170, margin: 0, fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, color: C.char, ...head1, opacity: Number(head1.opacity) * (1 - drop) }}>It looks <span style={{ color: C.teal }}>perfect.</span></h2>
            <h2 style={{ position: 'absolute', left: 120, top: 170, margin: 0, fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, color: C.ink, ...head2 }}>To Google, that&apos;s <span style={{ color: C.red }}>five copies.</span></h2>
            {CARDS.map((p, i) => {
                const inK = popIn(t, LT.at(12) + 0.35 + i * 0.2, 0.45);
                const grey = i === 1 ? drop * (1 - lens) : drop;
                const d = domains[i];
                return (
                    <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 500, height: 250, ...inK }}>
                        <SiteCard domain={i === 3 ? <Typo text={d} span={typoSpan} thick={2} offset={6} /> : d} style={{ left: 0, top: 0, filter: `grayscale(${grey})`, opacity: 1 - 0.5 * grey }} />
                        <span style={{ position: 'absolute', left: 500 - 30 - 28, top: -22, width: 56, height: 56, borderRadius: '50%', background: C.teal, boxShadow: '0 10px 24px rgba(32,167,149,0.35), 0 0 0 5px #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', ...popIn(t, tickA + i * 0.14, 0.35), opacity: Number(popIn(t, tickA + i * 0.14, 0.35).opacity) * (1 - drop) }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                        </span>
                        {stampOrder.includes(i) && <Stamp t={t} a={stampA + stampOrder.indexOf(i) * 0.16} />}
                    </div>
                );
            })}
            {/* The magnifier: Google's pick (the frame's only amber). */}
            <div style={{ position: 'absolute', left: 700, top: 345, width: 360, height: 360, ...fx(lens, (1 - lens) * 260, (1 - lens) * 180, 0.8 + 0.2 * lens) }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `16px solid ${C.amber}`, boxSizing: 'border-box', boxShadow: '0 0 0 4px rgba(11,20,38,0.6), 0 30px 80px rgba(0,0,0,0.45)', background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%)' }} />
                <div style={{ position: 'absolute', left: 30, top: 307, width: 46, height: 210, borderRadius: 23, background: C.navy, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.14), 0 20px 40px rgba(0,0,0,0.4)', transform: 'rotate(45deg)', transformOrigin: 'top center' }} />
            </div>
            <div style={{ position: 'absolute', left: 120, top: 760, width: 260, display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 22px', boxSizing: 'border-box', borderRadius: 16, background: '#FFFFFF', color: C.char, boxShadow: '0 20px 50px rgba(0,0,0,0.45)', ...chip }}>
                <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.12em', color: C.g600 }}>GOOGLE SHOWS</span>
                <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600 }}>{extras[0]}</span>
                <span style={{ fontSize: 17, fontWeight: 600, color: C.g600 }}>Example</span>
            </div>
        </SceneFade>
    );
}
function Stamp({ t, a }: { t: number; a: number }) {
    const k = prog(t, a, a + 0.22);
    const s = k < 1 ? lerp(1.7, 1, easeOut(k)) : 1;
    return (
        <span style={{ position: 'absolute', left: 120, top: 120, padding: '6px 22px', border: `5px solid ${C.red}`, borderRadius: 12, fontSize: 52, fontWeight: 800, letterSpacing: '0.12em', color: C.red, background: 'rgba(11,20,38,0.55)', opacity: clamp(k * 3), willChange: 'transform', transform: `rotate(-12deg) scale(${s})`, transformOrigin: 'center' }}>COPY</span>
    );
}

/* ---------------------------------------------------------------- Address bar (and the rewind) */
const LA = local('addressbar');
/** When the time-reverse starts (after the silence) and how fast it runs back. */
export const REWIND_FROM = () => LA.end(16) - 0.75;
export function AddressBarScene({ extras, typoSpan }: ForwardDomainsProps) {
    const raw = useTime();
    const r0 = REWIND_FROM();
    // Time-reverse: after r0 the whole scene runs back to its first frame in 0.75 s (about 6×), then dips to night.
    const rev = clamp(prog(raw, r0, r0 + 0.75));
    const t = raw < r0 ? raw : lerp(r0, 0, easeInOut(rev)); // spins up and down: no full-speed start

    const a = LA.at(16) + 0.05;
    const push = easeInOut(prog(t, a - 0.25, a + 0.75)); // the push-in starts from rest under the dissolve
    const ghost1 = slideIn(t, a + 0.35, 0.5, 0, 30), ghost2 = slideIn(t, a + 0.2, 0.5, 0, 30);
    const red = clamp(prog(t, LA.word(16, 'typo') - 0.3, LA.word(16, 'typo') + 0.1));
    const cap1 = slideIn(t, LA.word(16, 'shows') - 0.1, 0.45, 0, 18);
    const cap2 = slideIn(t, LA.word(16, 'even') - 0.1, 0.45, 0, 14);
    return (
        <SceneFade t={raw} room="twist" inD={0.25}>
            <RoomBg room="twist" t={raw} />
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 1000px 560px at 50% 45%, rgba(229,72,77,${0.16 * push}) 0%, rgba(229,72,77,0) 100%)` }} />
            <Eyebrow k={easeOut(prog(t, 0.15, 0.5))} color={C.soft} dash={C.red}>WHAT YOUR VISITOR SEES</Eyebrow>
            <div data-ui="browser" style={{ position: 'absolute', left: 300, top: 215, width: 1320, height: 80, borderRadius: 40, background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 44px', boxSizing: 'border-box', fontFamily: MONO, fontSize: 40, color: C.char, ...ghost1, opacity: 0.18 * Number(ghost1.opacity) }}>{extras[1]}</div>
            <div data-ui="browser" style={{ position: 'absolute', left: 210, top: 310, width: 1500, height: 96, borderRadius: 48, background: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 52px', boxSizing: 'border-box', fontFamily: MONO, fontSize: 50, color: C.char, ...ghost2, opacity: 0.34 * Number(ghost2.opacity) }}>{extras[0]}</div>
            <div data-ui="browser" style={{ position: 'absolute', left: 120, top: 425, width: 1680, height: 220, borderRadius: 110, background: '#FFFFFF', boxShadow: '0 50px 120px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', gap: 40, padding: '0 80px', boxSizing: 'border-box', color: C.char, ...fx(smooth(push * 1.4), 0, (1 - push) * 120, 0.55 + 0.45 * push) }}>
                <Lock size={64} />
                <span style={{ fontFamily: MONO, fontSize: 120, fontWeight: 500, letterSpacing: '-0.02em' }}>
                    {extras[2].slice(0, typoSpan[0])}
                    <span style={{ textDecoration: `underline wavy rgba(229,72,77,${red})`, textDecorationThickness: 5, textUnderlineOffset: 22, color: mix(C.char, C.red, red) }}>{extras[2].slice(typoSpan[0], typoSpan[1])}</span>
                    {extras[2].slice(typoSpan[1])}
                </span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, textAlign: 'center' }}>
                <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', ...cap1 }}>Same site. <span style={{ color: C.red }}>A different name</span> every time.</span>
                <span style={{ fontSize: 30, fontWeight: 500, color: C.soft, ...cap2 }}>Whatever they typed stays in the bar. Even the typo.</span>
            </div>
            {/* The rewind reads as tape running back: a light scanline sweep and a slight blur. */}
            <AbsoluteFill style={{ pointerEvents: 'none', opacity: rev > 0 && rev < 1 ? 0.5 : 0, background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0) 2px 7px)`, willChange: 'transform', transform: `translateY(${-raw * 400 % 7}px)` }} />
            <AbsoluteFill style={{ background: '#0B1426', opacity: easeInOut(prog(raw, r0 + 0.55, r0 + 0.8)) }} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- One main address */
const LO = local('oneaddress');
/** The four curves (cubic Béziers) into the node; `onLine` gives a point on one, so traffic is a pure function of t. */
const LINES = ['M440 488 C760 488 800 690 980 690', 'M400 600 C760 600 800 690 980 690', 'M420 712 C760 712 800 690 980 690', 'M480 824 C760 824 800 690 980 690'];
function onLine(i: number, u: number): [number, number] {
    const n = LINES[i].match(/-?\d+(\.\d+)?/g)!.map(Number); // M x0 y0 C x1 y1 x2 y2 x3 y3
    const v = 1 - u, b = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u];
    return [b[0] * n[0] + b[1] * n[2] + b[2] * n[4] + b[3] * n[6], b[0] * n[1] + b[1] * n[3] + b[2] * n[5] + b[3] * n[7]];
}
const TAGS: readonly CSSProperties[] = [{ left: 540, top: 474 }, { left: 540, top: 588 }, { left: 540, top: 698 }, { left: 560, top: 804 }];
export function OneAddressScene({ main, extras }: ForwardDomainsProps) {
    const t = useTime();
    const draw = (i: number) => easeInOut(prog(t, LO.word(17, 'every') + i * 0.15, LO.word(17, 'every') + 0.8 + i * 0.15));
    const card = popIn(t, LO.word(17, 'main') - 0.05, 0.5);
    const trunk = easeOut(prog(t, LO.word(17, 'there') - 0.2, LO.word(17, 'there') + 0.3));
    const tagA = LO.word(17, '301') - 0.1;
    const flow = (t * 0.6) % 1;
    return (
        <SceneFade t={t} room="mesh" inD={0.2}>
            <RoomBg room="mesh" t={t + 9} />
            <div style={{ position: 'absolute', left: 1050, top: 280, width: 900, height: 700, background: 'radial-gradient(closest-side, rgba(32,167,149,0.28), rgba(32,167,149,0))', opacity: trunk }} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.soft} dash={C.teal}>WAY TWO</Eyebrow>
            <h2 style={{ position: 'absolute', left: 120, top: 170, margin: 0, fontSize: 80, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08 }}>
                <span style={slideIn(t, LO.at(17) + 0.3, 0.5, 0, 20)}>One main address.</span><br />
                <span style={{ color: C.teal, display: 'inline-block', ...slideIn(t, tagA, 0.5, 0, 20) }}>A 301 from every other domain.</span>
            </h2>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0 }}>
                <defs><linearGradient id="ln43" x1="0" x2="1"><stop offset="0" stopColor="#7FB6E6" /><stop offset="1" stopColor="#5FD1BE" /></linearGradient></defs>
                {LINES.map((d, i) => <path key={i} d={d} fill="none" stroke="url(#ln43)" strokeWidth="3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw(i)} />)}
                {/* Traffic: a dot rides each line once it is drawn (draw = traffic moves). */}
                {LINES.map((_, i) => {
                    if (draw(i) < 1) return null;
                    const [x, y] = onLine(i, (flow + i * 0.23) % 1);
                    return <circle key={'f' + i} cx={x} cy={y} r="6" fill="#5FD1BE" opacity={0.9} />;
                })}
                <path d="M1000 690 L1140 690" fill="none" stroke={C.teal} strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - trunk} />
                <circle cx="990" cy="690" r={26 * trunk} fill={C.teal} fillOpacity="0.25" />
                <circle cx="990" cy="690" r={13 * trunk} fill={C.teal} />
            </svg>
            <div style={{ position: 'absolute', left: 120, top: 450, display: 'flex', flexDirection: 'column', gap: 36 }}>
                {extras.map((d, i) => <span key={d} style={{ width: 'max-content', ...slideIn(t, LO.at(17) + 0.4 + i * 0.12, 0.4, -30, 0) }}><GlassPill size={34} dot={null}>{d}</GlassPill></span>)}
            </div>
            {TAGS.map((s, i) => (
                <span key={i} style={{ position: 'absolute', ...s, padding: '4px 12px', borderRadius: 8, background: '#101828', boxShadow: `inset 0 0 0 1.5px ${C.teal}`, fontFamily: MONO, fontSize: 20, fontWeight: 600, color: C.teal, ...popIn(t, tagA + 0.1 + i * 0.12, 0.35) }}>301</span>
            ))}
            <div style={{ position: 'absolute', left: 1160, top: 570, width: 640, boxSizing: 'border-box', padding: '34px 40px', borderRadius: 28, background: '#FFFFFF', boxShadow: `0 40px 100px rgba(0,0,0,0.45), 0 0 0 ${10 * trunk}px rgba(32,167,149,0.18)`, color: C.char, display: 'flex', flexDirection: 'column', gap: 14, ...card }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', color: C.g600 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: C.teal }} />MAIN ADDRESS</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 46, fontWeight: 600 }}><Lock size={44} color={C.char} sw={2.6} />https://{main}</span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Steps (and the recap) */
const STEPS: readonly { n: string; t: string; sub?: string }[] = [
    { n: '01', t: 'Pick the main address' }, { n: '02', t: 'Redirect every other domain' }, { n: '03', t: 'Connect each domain', sub: 'with HTTPS' },
];
export function StepsScene({ recap = false, L }: { recap?: boolean; L: Local }) {
    const t = useTime();
    // Beat 19 opens with what the steps do ("Here's how to set that up in RedirHub, with HTTPS"),
    // then names them ("three steps, and one test"): the goal line lands first, the headline and cards on "three".
    const three = recap ? 0.05 : L.word(19, 'three') - 0.1;
    const cardA = (i: number) => (recap ? 0.15 : three + 0.25) + i * 0.18;
    const ticks = recap ? [L.word(48, 'main'), L.word(48, '301'), L.word(48, 'https'), L.word(48, 'test')] : [];
    const goal = slideIn(t, recap ? 0.05 : L.word(19, "here's") - 0.05, 0.5, 0, 14);
    const head = slideIn(t, three, 0.5, 0, 18);
    return (
        <SceneFade t={t} room="radial" inD={0.25}>
            <RoomBg room="radial" t={t} />
            <div style={{ position: 'absolute', left: '50%', top: -200, width: 1600, height: 900, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(255,255,255,0.14), rgba(255,255,255,0))' }} />
            <Eyebrow k={easeOut(prog(t, 0.1, 0.5))} color={C.ink} dash={C.ink}>{recap ? 'SO' : 'HERE’S HOW'}</Eyebrow>
            <span style={{ position: 'absolute', left: 120, top: 162, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.86)', ...goal }}>Set up way two in RedirHub, with HTTPS.</span>
            <h2 style={{ position: 'absolute', left: 120, top: 222, margin: 0, fontSize: 80, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, color: C.ink, ...head }}>Three steps. One test.</h2>
            <div style={{ position: 'absolute', left: 120, top: 360, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 30 }}>
                {STEPS.map((s, i) => {
                    const done = recap ? clamp(prog(t, ticks[i] - 0.1, ticks[i] + 0.3)) : 0;
                    return (
                        <div key={s.n} style={{ position: 'relative', height: 380, boxSizing: 'border-box', padding: 40, borderRadius: 30, background: 'linear-gradient(140deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.84) 100%)', boxShadow: `inset 0 0 0 1.5px #FFFFFF, 0 30px 70px rgba(16,24,40,0.20), 0 0 0 ${4 * done}px ${C.teal}`, color: C.char, display: 'flex', flexDirection: 'column', gap: 22, top: [0, 30, 60][i], ...slideIn(t, cardA(i), 0.5, 0, 50) }}>
                            <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, color: C.teal }}>{s.n}</span>
                            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.06 }}>{s.t}</span>
                            {s.sub && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: 'max-content', height: 46, padding: '0 18px', borderRadius: 23, background: '#ECFDF3', fontSize: 22, fontWeight: 700, color: '#067647' }}><Tick size={22} />{s.sub}</span>}
                            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>{[0, 1, 2].map((j) => <span key={j} style={{ width: 40, height: 6, borderRadius: 3, background: j <= i ? C.teal : C.g300 }} />)}</div>
                            {recap && <span style={{ position: 'absolute', right: 28, top: 28, ...popIn(t, ticks[i], 0.35) }}><Tick size={56} draw={prog(t, ticks[i], ticks[i] + 0.35)} /></span>}
                        </div>
                    );
                })}
            </div>
            <div style={{ position: 'absolute', left: 120, top: 862, display: 'flex', alignItems: 'center', gap: 16, height: 64, padding: '0 28px', borderRadius: 32, background: 'rgba(255,255,255,0.16)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.16)', fontSize: 30, fontWeight: 700, color: C.ink, ...slideIn(t, recap ? 0.6 : L.word(19, 'test') - 0.1, 0.45, 0, 20) }}>
                {recap ? <span style={popIn(t, ticks[3], 0.35)}><Tick size={30} fill="#FFFFFF" stroke={C.teal} /></span> : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>}
                Then one test: every version of every domain.
            </div>
        </SceneFade>
    );
}
