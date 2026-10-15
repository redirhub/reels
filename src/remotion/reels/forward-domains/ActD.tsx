/* Act D · Prove it, then close: w43-FourAddresses (39–42), w43-Checker (43), w43-AllGreen (44–45),
   w43-Honest (46), w43-Renew (47), the recap (48, the Steps frame ticked, in ActB) and w43-EndCard (49–52). */
import type { CSSProperties, ReactNode } from 'react';
import { RedirHubLogo } from '../../brand/Logo';
import { BrandedQr } from '../../components/QrCode';
import { clamp, easeInOut, easeOut, fx, lerp, prog, useTime } from '../../lib/anim';
import { C, DISPLAY, Dots3, Eyebrow, GlassPill, Lock, MONO, RoomBg, SceneFade, Tick, TipCard, UI, popIn, slideIn } from './kit';
import type { ForwardDomainsProps } from './props';
import { local } from './timeline';

const VERSIONS = ['http://', 'http://www.', 'https://', 'https://www.'] as const;
/** The 4 × 4 grid (w43-FourAddresses / w43-AllGreen): 1680 wide from x 120, four columns, 20 px gutters. */
const GRID = { x: 120, y: 470, w: 1680, colGap: 20, rowGap: 16, head: 41, pill: 64 } as const;
const COL_W = (GRID.w - 3 * GRID.colGap) / 4;
const cell = (row: number, col: number) => ({ x: GRID.x + col * (COL_W + GRID.colGap), y: GRID.y + GRID.head + GRID.rowGap + row * (GRID.pill + GRID.rowGap) });

function DarkPill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, height: GRID.pill, boxSizing: 'border-box', padding: '0 18px', borderRadius: 32, background: 'rgba(255,255,255,0.07)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.16)', fontFamily: MONO, fontSize: 19, color: C.ink, whiteSpace: 'nowrap', ...style }}>
            <span style={{ width: 11, height: 11, flex: 'none', borderRadius: '50%', background: C.mute }} />{children}
        </span>
    );
}
function WhitePill({ children, tick, style }: { children: ReactNode; tick: number; style?: CSSProperties }) {
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, height: GRID.pill, boxSizing: 'border-box', padding: '0 18px', borderRadius: 32, background: '#FFFFFF', boxShadow: '0 12px 30px rgba(16,24,40,0.16)', fontFamily: MONO, fontSize: 19, color: C.char, whiteSpace: 'nowrap', ...style }}>
            <Tick size={24} draw={tick} />{children}
        </span>
    );
}

/* ---------------------------------------------------------------- Four addresses */
const LF = local('four');
export function FourAddressesScene({ extras }: ForwardDomainsProps) {
    const t = useTime();
    const split = LF.word(40, 'four') - 0.05;                       // one domain becomes four
    const wwwA = LF.word(40, 'www') - 0.1, httpsA = LF.word(40, 'https') - 0.1;
    const rowA = (r: number) => (r === 0 ? split : LF.word(41, 'four') + (r - 1) * 0.3);
    const sixteen = LF.word(41, 'sixteen') - 0.1;
    const amber = LF.word(42, 'start') - 0.1;
    const solo = 1 - easeOut(prog(t, split, split + 0.25));
    const hd = (c: number) => Math.max(c % 2 === 1 ? clamp(Math.sin(Math.PI * prog(t, wwwA, wwwA + 1.2))) : 0, c >= 2 ? clamp(Math.sin(Math.PI * prog(t, httpsA, httpsA + 1.2))) : 0);
    const big = prog(t, sixteen, sixteen + 0.3);
    const lead = slideIn(t, LF.at(39) + 0.1, 0.5, 0, 18);
    const leadOut = 1 - easeOut(prog(t, sixteen - 0.25, sixteen + 0.05));
    return (
        <SceneFade t={t} room="lab">
            <RoomBg room="lab" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.soft} dash={C.teal}>NOW TEST IT</Eyebrow>
            {/* Beats 39–40: the line she says, so the lab is never an empty room; "16" takes its place. */}
            <div style={{ position: 'absolute', left: 120, top: 170, display: 'flex', flexDirection: 'column', gap: 14, ...lead, opacity: Number(lead.opacity) * leadOut }}>
                <span style={{ fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>Now test it.</span>
                <span style={{ fontSize: 36, fontWeight: 600, color: C.soft, ...slideIn(t, LF.word(39, 'part') - 0.1, 0.45, 0, 12) }}>The part most people skip.</span>
            </div>
            <div style={{ position: 'absolute', left: 120, top: 160, display: 'flex', alignItems: 'flex-end', gap: 36 }}>
                <span style={{ fontSize: 240, fontWeight: 800, lineHeight: 0.82, letterSpacing: '-0.06em', ...fx(clamp(big * 3), 0, 0, lerp(1.35, 1, easeOut(big))) }}>16</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 6 }}>
                    <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, ...slideIn(t, sixteen + 0.2, 0.4, -16, 0) }}>ways in.</span>
                    <span style={{ fontSize: 30, fontWeight: 600, color: C.soft, ...slideIn(t, sixteen + 0.4, 0.4, -16, 0) }}>Four extra domains, four versions each.</span>
                </div>
            </div>
            {/* Beat 39: one domain, alone in the empty lab. */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: cell(0, 0).y, display: 'flex', justifyContent: 'center', ...fx(popIn(t, LF.at(39) + 0.5, 0.45).opacity as number * solo, 0, 0, 1 + 0.2 * (1 - solo)) }}>
                <GlassPill size={30} dot={C.mute}>{extras[0]}</GlassPill>
            </div>
            {VERSIONS.map((v, c) => (
                <span key={v} style={{ position: 'absolute', left: cell(0, c).x, top: GRID.y, fontFamily: MONO, fontSize: 24, fontWeight: 600, color: lerpColor(c === 3 && t > amber ? 1 : hd(c)), padding: '0 0 6px 8px', ...slideIn(t, split + c * 0.08, 0.35, 0, 10) }}>{v}</span>
            ))}
            {extras.map((d, r) => VERSIONS.map((v, c) => {
                const a = rowA(r) + c * 0.07;
                const p = cell(r, c);
                // The first row splits out of the solo pill: from the centre to its column.
                const from = r === 0 ? (1920 / 2 - COL_W / 2) - p.x : 0;
                const k = easeOut(prog(t, a, a + 0.4));
                return (
                    <div key={d + v} style={{ position: 'absolute', left: p.x, top: p.y, width: COL_W, ...fx(clamp(k * 2), from * (1 - k), r === 0 ? 0 : (1 - k) * 14) }}>
                        <DarkPill>{v}{d}</DarkPill>
                    </div>
                );
            }))}
            <div style={{ position: 'absolute', left: cell(0, 3).x - 14, top: GRID.y - 14, width: COL_W + 28, height: GRID.head + GRID.rowGap + 4 * GRID.pill + 3 * GRID.rowGap + 28, boxSizing: 'border-box', borderRadius: 26, boxShadow: `inset 0 0 0 3px ${C.amber}`, opacity: easeOut(prog(t, amber, amber + 0.3)) }} />
            <span style={{ position: 'absolute', left: cell(0, 3).x, top: GRID.y - 66, display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 16px', borderRadius: 20, background: '#FFFFFF', fontSize: 19, fontWeight: 800, color: C.char, ...slideIn(t, LF.word(42, 'easiest') - 0.15, 0.4, 0, 10) }}>Start here · the easiest to forget</span>
        </SceneFade>
    );
}
/** Column header colour: soft → white as she names that part. */
const lerpColor = (k: number) => (k > 0.5 ? '#FFFFFF' : C.soft);

/* ---------------------------------------------------------------- Checker */
const LK = local('checker');
export function CheckerScene({ main, extras }: ForwardDomainsProps) {
    const t = useTime();
    const url = `https://www.${extras[0]}`;
    // Shared element: the amber cell flies from the grid into the checker's input.
    const fly = easeInOut(prog(t, 0.05, 0.7));
    const src = cell(0, 3), dst = { x: 176, y: 430 };
    const press = LK.at(43) + 0.25;
    const hop1 = LK.word(43, 'hop') - 0.15, c301 = LK.word(43, '301') - 0.15, lands = LK.word(43, 'lands') - 0.15, pass = LK.word(43, "that's") - 0.05;
    const checks: readonly [number, ReactNode][] = [
        [hop1, <span key="h">One hop</span>], [c301, <span key="3">A 301</span>],
        [lands, <div key="l" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><span style={{ lineHeight: '56px' }}>Lands on</span><span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, color: C.teal }}>https://{main}</span></div>],
    ];
    const glow = easeOut(prog(t, pass, pass + 0.6));
    return (
        <SceneFade t={t} room="lab">
            <RoomBg room="lab" t={t} />
            <div style={{ position: 'absolute', left: 1100, top: 120, width: 1000, height: 900, background: 'radial-gradient(closest-side, rgba(32,167,149,0.30), rgba(32,167,149,0))', opacity: 0.4 + 0.6 * glow }} />
            <Eyebrow k={1} color={C.soft} dash={C.teal}>NOW TEST IT · FREE REDIRECT CHECKER</Eyebrow>
            <div data-ui="website" style={{ position: 'absolute', left: 120, top: 250, width: 1060, height: 500, borderRadius: 24, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10)', fontFamily: UI, color: C.char, ...slideIn(t, 0, 0.45, 0, 30) }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', borderBottom: `1px solid ${C.g200}` }}>
                    <Dots3 size={13} gap={8} />
                    <div style={{ flex: 1, height: 40, borderRadius: 20, background: C.g100, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', fontFamily: MONO, fontSize: 19, color: C.g700 }}><Lock />redirhub.com/redirect-checker</div>
                </div>
                <div style={{ padding: '44px 56px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>Check Any URL Redirect</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1, height: 60, borderRadius: 12, boxShadow: `inset 0 0 0 1.5px ${fly >= 1 && t < press ? '#1C6DB6' : C.g300}`, display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: MONO, fontSize: 22 }}>{fly >= 1 ? url : ''}</div>
                        <span style={{ height: 60, padding: '0 26px', borderRadius: 12, background: '#1C6DB6', color: '#FFFFFF', fontSize: 20, fontWeight: 600, display: 'inline-flex', alignItems: 'center', transform: `scale(${1 - 0.05 * Math.sin(Math.PI * prog(t, press, press + 0.25))})` }}>Check Redirect</span>
                    </div>
                    <div style={{ marginTop: 14, borderRadius: 16, boxShadow: `inset 0 0 0 1.5px ${C.g200}`, overflow: 'hidden', opacity: easeOut(prog(t, press + 0.2, press + 0.5)) }}>
                        <Hop n={1} url={url} code="301" k={easeOut(prog(t, press + 0.3, press + 0.65))} badge={popIn(t, c301, 0.35)} />
                        <Hop n={2} url={`https://${main}`} code="200" ok k={easeOut(prog(t, lands - 0.1, lands + 0.25))} badge={popIn(t, lands + 0.15, 0.35)} />
                    </div>
                </div>
            </div>
            {/* the flying cell */}
            {fly > 0 && fly < 1 && (
                <div style={{ position: 'absolute', left: lerp(src.x, dst.x, fly), top: lerp(src.y, dst.y, fly), width: COL_W }}>
                    <DarkPill style={{ background: `rgba(255,255,255,${lerp(0.07, 1, fly)})`, color: fly > 0.5 ? C.char : C.ink, boxShadow: `inset 0 0 0 3px ${C.amber}` }}>{url}</DarkPill>
                </div>
            )}
            <div style={{ position: 'absolute', left: 1250, top: 250, width: 550, display: 'flex', flexDirection: 'column', gap: 34 }}>
                {checks.map(([a, label], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: i === 2 ? 'flex-start' : 'center', gap: 22, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', ...slideIn(t, a, 0.4, -20, 0) }}>
                        <Tick size={56} draw={prog(t, a + 0.1, a + 0.4)} />{label}
                    </div>
                ))}
                <span style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', width: 'max-content', height: 96, padding: '0 40px', borderRadius: 48, background: C.teal, boxShadow: '0 0 0 10px rgba(32,167,149,0.20), 0 30px 70px rgba(32,167,149,0.30)', fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', ...popIn(t, pass, 0.45) }}>That&apos;s a pass.</span>
            </div>
        </SceneFade>
    );
}
function Hop({ n, url, code, ok = false, k, badge }: { n: number; url: string; code: string; ok?: boolean; k: number; badge: CSSProperties }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', borderTop: n > 1 ? `1px solid ${C.g200}` : undefined, opacity: k, transform: `translateY(${(1 - k) * 10}px)` }}>
            <span style={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', background: C.g100, fontSize: 16, fontWeight: 600, color: C.g700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
            <span style={{ flex: 1, fontFamily: MONO, fontSize: 22 }}>{url}</span>
            <span style={{ padding: '6px 14px', borderRadius: 8, background: ok ? '#ECFDF3' : '#E8F0F8', color: ok ? '#067647' : '#1C6DB6', fontFamily: MONO, fontSize: 19, fontWeight: 600, ...badge }}>{code}</span>
        </div>
    );
}

/* ---------------------------------------------------------------- All green */
const LG = local('allgreen');
/** When each grid row turns white, one row at a time (a pop each). */
export const allGreenRows = () => [0, 1, 2, 3].map((r) => LG.start + LG.word(44, 'do') + r * 0.32);
export function AllGreenScene({ main, extras }: ForwardDomainsProps) {
    const t = useTime();
    const rows = allGreenRows().map((a) => a - LG.start);
    const n = rows.reduce((acc, a) => acc + (t >= a ? 4 : 0), 0);
    const tip = slideIn(t, LG.word(45, 'not') - 0.1, 0.5, 40, 0);
    return (
        <SceneFade t={t} room="radial">
            <RoomBg room="radial" t={t} />
            <div style={{ position: 'absolute', left: '50%', top: -200, width: 1600, height: 900, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))' }} />
            <Eyebrow k={1} color={C.ink} dash={C.ink}>NOW TEST IT</Eyebrow>
            <div style={{ position: 'absolute', left: 120, top: 160, display: 'flex', alignItems: 'flex-end', gap: 36 }}>
                {/* Leo set this to 92 px, weight 500 on the canvas (in Open Sans); the film keeps the brand face. */}
                <span style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 500, lineHeight: 0.82, letterSpacing: '-0.04em', width: 540, height: 197, display: 'flex', alignItems: 'flex-end', fontVariantNumeric: 'tabular-nums' }}>{n} / 16</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 6, ...slideIn(t, rows[3] + 0.3, 0.45, -16, 0) }}>
                    <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>land on</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, width: 'max-content', height: 64, padding: '0 24px', borderRadius: 32, background: '#FFFFFF', color: C.char, fontFamily: MONO, fontSize: 32, fontWeight: 600 }}><Lock size={26} color={C.char} sw={2.6} />https://{main}</span>
                </div>
            </div>
            <TipCard label="NOT PASSING YET?" title="Give DNS a few minutes, then check again." x={1330} y={190} w={470} size={34} style={{ padding: '30px 34px 34px', ...tip }} />
            {VERSIONS.map((v, c) => <span key={v} style={{ position: 'absolute', left: cell(0, c).x, top: GRID.y, fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.ink, padding: '0 0 6px 8px' }}>{v}</span>)}
            {extras.map((d, r) => VERSIONS.map((v, c) => {
                const a = rows[r] + c * 0.05;
                const k = easeOut(prog(t, a, a + 0.3));
                const p = cell(r, c);
                return (
                    <div key={d + v} style={{ position: 'absolute', left: p.x, top: p.y, width: COL_W }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 1 - k }}><DarkPill>{v}{d}</DarkPill></div>
                        <div style={{ position: 'relative', ...fx(k, 0, 0, 0.96 + 0.04 * k) }}><WhitePill tick={prog(t, a + 0.1, a + 0.4)}>{v}{d}</WhitePill></div>
                    </div>
                );
            }))}
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- One honest note */
const LHn = local('honest');
export function HonestScene() {
    const t = useTime();
    // Each card lands as she says it, left to right: what it doesn't do comes first in the line, then what it does.
    const grey = slideIn(t, LHn.word(46, "won't") - 0.15, 0.5, 0, 30);
    const teal = slideIn(t, LHn.word(46, 'catches') - 0.15, 0.5, 0, 30);
    const greyDim = 1 - 0.35 * easeOut(prog(t, LHn.word(46, 'catches'), LHn.word(46, 'catches') + 0.4));
    return (
        <SceneFade t={t} room="charcoal">
            <RoomBg room="charcoal" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.soft} dash={C.teal}>ONE HONEST NOTE</Eyebrow>
            <div style={{ position: 'absolute', left: 120, top: 260, width: 1680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                <div style={{ height: 520, boxSizing: 'border-box', padding: 56, borderRadius: 34, background: 'rgba(255,255,255,0.04)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 30, ...grey, opacity: Number(grey.opacity) * greyDim }}>
                    <svg style={{ flex: 'none' }} width="72" height="72" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke={C.mute} strokeWidth="4" /><path d="M23 23l18 18M41 23l-18 18" fill="none" stroke={C.mute} strokeWidth="6" strokeLinecap="round" /></svg>
                    <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.12em', color: C.mute }}>WHAT IT DOESN&apos;T</span>
                    <span style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, color: C.soft }}>It doesn&apos;t lift rankings on its own.</span>
                </div>
                <div style={{ height: 520, boxSizing: 'border-box', padding: 56, borderRadius: 34, background: 'linear-gradient(160deg, rgba(32,167,149,0.22) 0%, rgba(32,167,149,0.06) 100%)', boxShadow: `inset 0 0 0 2px ${C.teal}`, display: 'flex', flexDirection: 'column', gap: 30, ...teal }}>
                    <Tick size={72} draw={prog(t, LHn.word(46, 'catches'), LHn.word(46, 'catches') + 0.4)} />
                    <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.12em', color: C.teal }}>WHAT IT DOES</span>
                    <span style={{ fontSize: 80, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.02 }}>Forwarding catches people.</span>
                </div>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Renew */
const LR = local('renew');
export function RenewScene({ extras }: ForwardDomainsProps) {
    const t = useTime();
    const cal = LR.word(47, 'renewing') - 0.1;
    const k = easeOut(prog(t, cal, cal + 0.55));
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.char} dash={C.teal}>ONE RULE</Eyebrow>
            <div style={{ position: 'absolute', left: 120, top: 300, width: 940, display: 'flex', flexDirection: 'column', gap: 30, color: C.char }}>
                <span style={{ fontSize: 84, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04, ...slideIn(t, LR.word(47, 'keep') - 0.15, 0.5, 0, 20) }}>Keep renewing every domain you forward.</span>
                <span style={{ fontSize: 38, fontWeight: 600, color: C.g600, ...slideIn(t, LR.word(47, 'expires') - 0.3, 0.45, 0, 14) }}>If one expires, <span style={{ color: C.red, opacity: easeOut(prog(t, LR.word(47, 'someone') - 0.1, LR.word(47, 'someone') + 0.2)) }}>someone else can buy it.</span></span>
            </div>
            <div style={{ position: 'absolute', left: 1220, top: 250, width: 520, height: 600 }}>
                <span style={{ position: 'absolute', left: 30, top: 0, display: 'inline-flex', alignItems: 'center', gap: 14, height: 76, padding: '0 30px', borderRadius: 38, background: 'linear-gradient(140deg, rgba(255,255,255,0.79) 0%, rgba(255,255,255,0.64) 100%)', boxShadow: 'inset 0 0 0 1.5px #FFFFFF, 0 30px 70px rgba(16,24,40,0.18)', fontFamily: MONO, fontSize: 34, fontWeight: 600, whiteSpace: 'nowrap', color: C.char, ...popIn(t, 0.25, 0.45) }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: C.teal }} />{extras[3]}
                </span>
                <div style={{ position: 'absolute', left: 60, top: 120, width: 420, borderRadius: 22, overflow: 'hidden', background: C.paper, boxShadow: '0 40px 90px rgba(16,24,40,0.18)', color: C.ink3, ...fx(clamp(k * 2), 0, (1 - k) * -50, 1.03 - 0.03 * k) }}>
                    <div style={{ height: 84, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', color: '#FFFFFF' }}><span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '0.08em' }}>OCT</span><span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 600 }}>2027</span></div>
                    <div style={{ padding: '28px 30px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.16em', color: C.ink8 }}>RENEWED UNTIL</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 120, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.9 }}>14</span><Tick size={72} draw={prog(t, cal + 0.5, cal + 0.85)} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>{Array.from({ length: 14 }, (_, i) => <span key={i} style={{ height: 10, borderRadius: 5, background: C.paper2 }} />)}</div>
                    </div>
                </div>
                <span style={{ position: 'absolute', left: 70, top: 500, fontWeight: 700, fontSize: 18, letterSpacing: '0.12em', color: C.g600, opacity: k }}>EXAMPLE DATE</span>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- End card */
const LE = local('end');
/** The hook's five pills (positions from w43-Domains), here only to collapse into the headline. */
const HOOK: readonly { x: number; y: number }[] = [{ x: 1100, y: 190 }, { x: 1240, y: 296 }, { x: 1060, y: 402 }, { x: 1280, y: 508 }, { x: 1110, y: 614 }];
export function EndCardScene({ main, extras, end, qr }: ForwardDomainsProps) {
    const t = useTime();
    const names = [main, ...extras];
    const l1 = LE.word(49, 'every') - 0.1, l2 = LE.word(49, 'one') - 0.1;
    const teal = easeOut(prog(t, l1 + 0.2, l1 + 0.6));
    const fold = easeInOut(prog(t, l2 - 0.35, l2 + 0.25));
    const tail = LE.word(50, 'links') + 0.4;
    return (
        <SceneFade t={t} room="mesh">
            <RoomBg room="mesh" t={t} />
            {names.map((d, i) => {
                const p = HOOK[i];
                const tx = lerp(p.x, 360, fold), ty = lerp(p.y, 400, fold);
                return (
                    <span key={d} style={{ position: 'absolute', left: tx, top: ty, ...fx(clamp(popIn(t, 0.05 + i * 0.08, 0.4).opacity as number) * (1 - clamp((fold - 0.6) * 2.5)), 0, 0, 1 - 0.55 * fold) }}>
                        <GlassPill size={34} dot={teal > 0.5 ? C.teal : C.soft} style={{ boxShadow: `inset 0 0 0 ${1 + 1.5 * teal}px ${teal > 0.5 ? C.teal : 'rgba(255,255,255,0.22)'}, 0 20px 50px rgba(0,0,0,0.35)` }}>{d}</GlassPill>
                    </span>
                );
            })}
            <div style={{ position: 'absolute', left: 140, top: 236, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 128, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em', ...slideIn(t, l1, 0.45, 0, 30) }}>{end.lines[0]}</span>
                <span style={{ fontSize: 128, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em', color: C.teal, ...slideIn(t, l2 + 0.1, 0.45, 0, 30) }}>{end.lines[1]}</span>
            </div>
            <div style={{ position: 'absolute', left: 140, top: 538, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 34 }}>
                <span style={{ color: C.soft, ...slideIn(t, LE.word(50, 'links') - 0.1, 0.4, 0, 14) }}>{end.sub}</span>
                <span style={{ fontWeight: 700, ...slideIn(t, LE.word(50, 'stuck') - 0.2, 0.4, 0, 14) }}>{end.cta}</span>
            </div>
            <div style={{ position: 'absolute', left: 140, top: 770, width: 340, ...slideIn(t, tail, 0.45, 0, 16) }}><RedirHubLogo variant="white" /></div>
            <div style={{ position: 'absolute', left: 600, top: 660, ...slideIn(t, tail + 0.15, 0.45, 0, 16) }}>
                <BrandedQr value={qr.value} label={qr.label} size={200} labelSize={20} />
            </div>
        </SceneFade>
    );
}
