/* "EZMarketing" customer story, 9:16, text-only cut. One continuous stage in four rooms (Night for
   the problem, amber-lit Night for the catch, light for the product, teal for the fix), and the
   twist: at beat 10 the film rewinds to beat 2's exact frame and replays the same tap, which now
   lands on Jobs. Show, don't tell: the phone really opens the old link, scrolls and searches for
   "jobs"; the three old links really open the same page; the visits really stream to /jobs.
   Every time comes from timeline.ts (timing.json + the script). */
import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { RedirHubIcon, RedirHubLogo } from '../../brand/Logo';
import { color, font, yt } from '../../brand/tokens';
import { NIGHT_BG } from '../../components/FixedEndCard';
import { Grain } from '../../components/Grain';
import { LinksPage, ROW_GEOM, type RowData } from '../../components/LinksList';
import { Phone } from '../../components/Phone';
import { UrlPill } from '../../components/UrlPill';
import { easeBack, easeInOut, easeOut, lerp, prog, useTime } from '../../lib/anim';
import { Bubble, Caption, Card, Check, Line, SAFE, Tap, assertHold, env, f, smooth, type Pt } from './kit';
import { CARDS, type EzMarketingProps } from './props';
import { CAPTIONS, beat, chipWindow, word } from './timeline';

const B = (n: number) => beat(n);
/** A group that spans beats a..b: in just before a starts, out just after b ends (crossfades overlap). */
const span = (t: number, a: number, b: number) => env(t, B(a)[0] - 0.2, B(b)[1] + 0.2, 0.4, 0.4);

/* ---------------------------------------------------------------- rooms */
type Room = 'night' | 'catch' | 'light' | 'flood';
/** Beat 7 turns light when the DNS line reaches RedirHub; beat 10 floods teal when the tap lands. */
const LIGHT_AT = () => word(7, 'redirhub');
const REWIND = 0.8; // seconds of beat 10 spent rewinding to beat 2
const LAND = 0.75; // into the replay: the page lands
const FLOOD_AT = () => B(10)[0] + REWIND + LAND;
function roomWeights(t: number): Record<Room, number> {
    const x = (a: number, d = 0.5) => smooth(prog(t, a - d / 2, a + d / 2));
    const catchK = x(B(6)[0]) * (1 - x(B(7)[0]));
    const light = x(LIGHT_AT(), 0.4) * (1 - x(B(9)[0])) + x(B(12)[0], 0.4);
    const flood = x(FLOOD_AT(), 0.6) * (1 - x(B(12)[0], 0.4));
    return { night: 1, catch: catchK, light, flood };
}
function Rooms({ t }: { t: number }) {
    const w = roomWeights(t);
    return (
        <>
            <AbsoluteFill style={{ background: NIGHT_BG }} />
            <AbsoluteFill style={{ background: 'radial-gradient(900px 700px at 50% 62%, rgba(229,148,38,.30), rgba(229,148,38,0) 70%)', opacity: w.catch }} />
            <AbsoluteFill style={{ background: 'radial-gradient(1400px 1100px at 50% 30%, #FFFFFF 0%, #F2F4F7 60%, #E7EBF1 100%)', opacity: w.light }}>
                <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(16,24,40,.10) 1.6px, transparent 1.6px)', backgroundSize: '36px 36px' }} />
            </AbsoluteFill>
            <AbsoluteFill style={{ background: 'radial-gradient(1300px 1100px at 50% 40%, #2BB8A5 0%, #1C9A88 55%, #137566 100%)', opacity: w.flood }} />
            <Grain opacity={0.08} />
        </>
    );
}
/** On the light room text turns dark; captions get a dark backing on light and teal. */
const onLight = (t: number) => roomWeights(t).light;
const needsBacking = (t: number) => Math.max(roomWeights(t).light, roomWeights(t).flood);

/* ---------------------------------------------------------------- the phone: beats 1–2 and 10–11 */
const PH = { w: 440, h: 900, s: 0.86, top: 470 } as const;
const PH_LEFT = (1080 - PH.w * PH.s) / 2;
/** Phone-inner → composition coordinates. */
const ph = (x: number, y: number): Pt => [PH_LEFT + (16 + x) * PH.s, PH.top + (16 + y) * PH.s];
const BAR_C = ph(204, 97); // centre of the address bar
const FIND_C = ph(204, 172); // centre of the find-in-page bar
/** The phone's window: the camera pushes in inside it, clear of the text above and the caption below. */
const WIN = { top: 430, bottom: 1300 } as const;

/** The phone's address bar: the link being opened, its loading bar, and a status dot. */
function AddressBar({ url, loading, dot }: { url: string; loading: number; dot: 'none' | 'red' | 'teal' }) {
    const dc = dot === 'red' ? yt.signalRed : yt.teal;
    return (
        <div style={{ position: 'absolute', left: 22, right: 22, top: 66, height: 62, borderRadius: 18, background: color.g100, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', fontFamily: font.sans, fontSize: 23, fontWeight: 500, color: color.g700, overflow: 'hidden', zIndex: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.4" strokeLinecap="round" style={{ flex: 'none' }}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
            {dot !== 'none' && <i style={{ flex: 'none', width: 16, height: 16, borderRadius: 8, background: dc, boxShadow: `0 0 12px ${dc}` }} />}
            {loading > 0 && loading < 1 && <i style={{ position: 'absolute', left: 0, bottom: 0, height: 4, width: `${loading * 100}%`, background: yt.blue }} />}
        </div>
    );
}

/** The new owner's site. `jobs` false: the homepage (no jobs anywhere); true: the Jobs page. */
function Site({ jobs, scroll = 0 }: { jobs: boolean; scroll?: number }) {
    const bar = (w: string, h = 14, c: string = color.g200) => <i style={{ display: 'block', width: w, height: h, borderRadius: h / 2, background: c }} />;
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 140, fontFamily: font.sans, transform: `translate3d(0, ${-scroll}px, 0)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px 18px' }}>
                <i style={{ width: 34, height: 34, borderRadius: 10, background: yt.blue }} />
                <span style={{ fontSize: 22, fontWeight: 700, color: color.charcoal }}>Your Company</span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 18, color: color.g500 }}><span>Home</span><span>About</span><span>Contact</span></span>
            </div>
            {jobs ? (
                <div style={{ padding: '10px 26px' }}>
                    <div style={{ fontFamily: font.display, fontSize: 52, fontWeight: 800, letterSpacing: '-.03em', color: color.charcoal }}>Jobs</div>
                    {[0, 1, 2].map((i) => (
                        <div key={i} style={{ marginTop: 20, padding: 22, borderRadius: 18, border: `2px solid ${color.g200}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>{bar(['70%', '58%', '64%'][i], 16, color.g300)}{bar('40%', 12)}</div>
                            <span style={{ padding: '10px 18px', borderRadius: 12, background: yt.teal, color: '#fff', fontSize: 18, fontWeight: 700 }}>Apply</span>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div style={{ margin: '4px 22px', height: 250, borderRadius: 24, background: 'linear-gradient(135deg, #1C6DB6, #3F8FD6)', padding: 28, boxSizing: 'border-box', color: '#fff' }}>
                        <div style={{ fontFamily: font.display, fontSize: 52, fontWeight: 800, letterSpacing: '-.03em' }}>Welcome</div>
                        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>{bar('76%', 14, 'rgba(255,255,255,.45)')}{bar('52%', 14, 'rgba(255,255,255,.45)')}</div>
                    </div>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{ margin: '22px 26px 0', display: 'flex', gap: 18 }}>
                            <i style={{ flex: 'none', width: 120, height: 96, borderRadius: 16, background: ['#E8F0F8', '#E6F6F4', '#F2F4F7', '#E8F0F8'][i] }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>{bar('80%', 16, color.g300)}{bar('92%')}{bar('64%')}</div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

/** The phone opening the old Careers link. `tau` is its own clock (seconds since the phone is up),
    so beat 10 can play beat 2 backwards and then forwards with the fix: the same frame, two endings.
      0.30 tap · 0.30–0.75 loading · 0.55 the address changes · 0.60–0.95 the page lands
      fail only: 1.3–2.3 scrolls down looking for jobs · 2.2 find-in-page "jobs" → 0/0 */
function PhoneShot({ tau, fixed, p, y = 0, scale = 1 }: { tau: number; fixed: boolean; p: EzMarketingProps; y?: number; scale?: number }) {
    const old = `${p.oldDomain}${p.paths.careers}`;
    const landed = tau >= 0.55;
    const url = landed ? (fixed ? `${p.newDomain}${p.paths.jobs}` : p.newDomain) : old;
    const pageK = smooth(prog(tau, 0.6, 0.95));
    const scroll = fixed ? 0 : 340 * easeInOut(prog(tau, 1.3, 2.3));
    const findK = fixed ? 0 : smooth(prog(tau, 2.2, 2.45));
    const typed = 'jobs'.slice(0, Math.max(0, Math.min(4, Math.floor((tau - 2.45) / 0.09) + 1)));
    const none = !fixed && tau >= 2.9;
    const dot = !landed ? 'none' : fixed ? (tau >= 0.95 ? 'teal' : 'none') : (none ? 'red' : 'none');
    // The camera, like a screen recording: it pushes in on the address bar as the address changes,
    // and (beat 2) on the find bar as "jobs" finds nothing. Inside a window, so it never reaches the
    // text above or the caption below. Driven by tau, so the rewind plays it backwards too.
    const addr = smooth(prog(tau, 0.4, 0.7)) * (1 - smooth(prog(tau, 1.15, 1.5)));
    const find = fixed ? 0 : smooth(prog(tau, 2.05, 2.45));
    const w = Math.max(addr, find);
    const F = addr >= find ? BAR_C : FIND_C;
    const Pz: Pt = addr >= find ? [540, 680] : [540, 720];
    const zs = 1 + 0.8 * w;
    const zx = lerp(F[0], Pz[0], w) - F[0] * zs, zy = lerp(F[1], Pz[1], w) - F[1] * zs;
    return (
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${WIN.top}px 0 ${1920 - WIN.bottom}px 0)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate3d(${zx}px, ${zy}px, 0) scale(${zs})`, willChange: 'transform' }}>
        <div style={{ position: 'absolute', left: PH_LEFT, top: PH.top, width: PH.w * PH.s, height: PH.h * PH.s, transformOrigin: '50% 0', ...f(1, 0, y, scale) }}>
            <div style={{ width: PH.w, height: PH.h, transform: `scale(${PH.s})`, transformOrigin: '0 0' }}>
                <Phone width={PH.w} height={PH.h} style={{ left: 0, top: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}>
                        <AddressBar url={url} loading={prog(tau, 0.3, 0.75)} dot={dot} />
                        <div style={{ position: 'absolute', inset: 0, opacity: pageK }}><Site jobs={fixed} scroll={scroll} /></div>
                        {findK > 0 && (
                            <div style={{ position: 'absolute', left: 22, right: 22, top: 140, height: 64, borderRadius: 16, background: '#fff', boxShadow: '0 10px 30px rgba(16,24,40,.18)', border: `2px solid ${none ? '#FDA29B' : color.g200}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontFamily: font.sans, fontSize: 24, color: color.charcoal, zIndex: 5, ...f(findK, 0, (1 - findK) * -20) }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                                <span style={{ flex: 1 }}>{typed}</span>
                                <span style={{ fontWeight: 700, color: none ? '#D92D20' : color.g400 }}>0/0</span>
                            </div>
                        )}
                    </div>
                </Phone>
            </div>
        </div>
        </div>
        </div>
    );
}

function Opening({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s1] = B(1), [s2] = B(2);
    const up = easeInOut(prog(t, s2, s2 + 0.6)); // the phone rises; the pill flies into its address bar
    const pillK = smooth(prog(t, s2 + 0.35, s2 + 0.6));
    const tau = t - (s2 + 0.6);
    const center: Pt = [540, 880];
    const px = lerp(center[0], BAR_C[0], up), py = lerp(center[1], BAR_C[1], up);
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 1, 2) }}>
            {t >= s2 && <PhoneShot tau={Math.max(0, tau)} fixed={false} p={p} y={(1 - up) * 1100} />}
            <div style={{ position: 'absolute', left: 0, top: 0, ...f(1 - pillK, px, py) }}>
                <div style={{ transform: `translate(-50%, -50%) scale(${lerp(1, 0.5, up)})` }}>
                    <UrlPill url={`${p.oldDomain}${p.paths.careers}`} size={54} />
                </div>
            </div>
            <Tap t={t} when={s2 + 0.9} at={BAR_C} from={[1160, 300]} />
            {[0.45, 1.25, 2.05, 2.75].map((d, i) => (
                <Tap key={i} t={t} when={s1 + d} at={center} from={([[-80, 420], [1160, 1320], [1160, 380], [-80, 1300]] as const)[i]} />
            ))}
        </div>
    );
}

/** Beat 10: rewind to beat 2's frame (its state at the moment it found nothing), then the same tap,
    now redirected. Beat 11 pulls back ~3%, in the teal room. */
function Callback({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s10] = B(10), [s11, e11] = B(11);
    const back = easeInOut(prog(t, s10, s10 + REWIND));
    const rewinding = t < s10 + REWIND;
    const tau = rewinding ? lerp(3.4, 0.3, back) : 0.3 + (t - (s10 + REWIND));
    const pull = 1 - 0.03 * easeInOut(prog(t, s11, e11));
    const shake = rewinding ? Math.sin(t * 90) * 3 * Math.sin(Math.PI * back) : 0;
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 10, 11) }}>
            <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 900px', ...f(1, shake, 0, pull) }}>
                <PhoneShot tau={tau} fixed={!rewinding} p={p} />
            </div>
            {/* The rewind reads as one: scan lines and a reverse glyph while it runs. */}
            {rewinding && (
                <div style={{ position: 'absolute', inset: 0, opacity: Math.sin(Math.PI * back) * 0.9, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 7px)' }}>
                    <svg width="120" height="80" viewBox="0 0 60 40" style={{ position: 'absolute', left: 480, top: 380 }}>
                        <path d="M30 8L8 20l22 12zM54 8L32 20l22 12z" fill="#fff" />
                    </svg>
                </div>
            )}
            <Tap t={t} when={s10 + REWIND} at={BAR_C} from={[1160, 300]} />
        </div>
    );
}

/* ---------------------------------------------------------------- beat 3: the agency */
function Agency({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s3, e3] = B(3);
    assertHold(`${p.agency.name} ${p.agency.sub}`, s3 + 0.2, e3);
    const k = easeInOut(prog(t, s3 + 0.15, s3 + 0.85));
    const sub = smooth(prog(t, s3 + 0.7, s3 + 1.1));
    const pin = easeBack(prog(t, s3 + 0.8, s3 + 1.25));
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 3, 3) }}>
            {/* a faint map grid: a place, not a logo */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 560, height: 640, opacity: 0.5 * k, backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.07) 2px, transparent 2px)', backgroundSize: '90px 90px', WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)', maskImage: 'radial-gradient(closest-side, #000, transparent)' }} />
            <div style={{ position: 'absolute', left: SAFE.x, width: SAFE.w, top: 740, fontFamily: font.display, fontSize: 150, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1, color: yt.ink, clipPath: `inset(-10% ${(1 - k) * 100}% -10% 0)` }}>{p.agency.name}</div>
            <div style={{ position: 'absolute', left: SAFE.x - 4, top: 750, width: 8, height: 140, borderRadius: 4, background: yt.teal, ...f(k > 0 && k < 1 ? 1 : 0, SAFE.w * k, 0) }} />
            <div style={{ position: 'absolute', left: SAFE.x, top: 935, display: 'flex', alignItems: 'center', gap: 18, fontFamily: font.display, fontSize: 50, fontWeight: 600, color: yt.inkSoft, ...f(sub, 0, (1 - sub) * 20) }}>
                <svg width="46" height="58" viewBox="0 0 24 30" style={{ flex: 'none', transformOrigin: '50% 100%', transform: `scale(${Math.max(0, pin)})` }}>
                    <path d="M12 1C6 1 1.5 5.4 1.5 11.2 1.5 19 12 29 12 29s10.5-10 10.5-17.8C22.5 5.4 18 1 12 1z" fill={yt.amber} /><circle cx="12" cy="11" r="4.2" fill="#0B1426" />
                </svg>
                {p.agency.sub}
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- beats 4–5: the handover ticket, then the ask */
function Handover({ t }: { t: number }) {
    const [s4] = B(4), [s5, e5] = B(5);
    const t1 = word(4, 'forwarded'), t2 = word(4, 'shut');
    const inK = easeOut(prog(t, s4, s4 + 0.5));
    const dim = easeInOut(prog(t, s5, s5 + 0.4));
    const pop = prog(t, s5 + 0.2, s5 + 0.65);
    const off = smooth(prog(t, t2, t2 + 0.5)); // the hosting powers down
    assertHold(CARDS.ask, s5 + 0.2, e5);
    const row = (k: number, label: string, icon: ReactNode) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '28px 0', borderTop: `2px dashed ${color.g200}` }}>
            {icon}
            <span style={{ flex: 1, fontFamily: font.display, fontSize: 48, fontWeight: 700, letterSpacing: '-.02em', color: color.charcoal }}>{label}</span>
            <svg width="70" height="70" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="29" fill={yt.teal} opacity={Math.min(1, k * 1.6)} transform={`scale(${0.6 + 0.4 * Math.min(1, k * 1.6)})`} style={{ transformOrigin: '32px 32px' }} />
                <circle cx="32" cy="32" r="29" fill="none" stroke={color.g300} strokeWidth="3" opacity={1 - Math.min(1, k * 1.6)} />
                <path d="M19 33l9 9 17-19" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (k - 0.35) / 0.65)} />
            </svg>
        </div>
    );
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 4, 5) }}>
            <div style={{ position: 'absolute', left: SAFE.x + 20, width: SAFE.w - 40, top: 600, transformOrigin: '50% 30%', ...f(inK * (1 - 0.6 * dim), 0, (1 - inK) * 60, 1 - 0.04 * dim, lerp(-2.5, -1.5, inK)) }}>
                <div style={{ background: '#fff', borderRadius: 30, padding: '40px 48px 14px', boxShadow: '0 40px 100px rgba(0,0,0,.45)' }}>
                    <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 800, letterSpacing: '.16em', color: color.g500, marginBottom: 14 }}>HANDOVER</div>
                    {row(easeOut(prog(t, t1, t1 + 0.45)), 'Domain forwarded', (
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={yt.blue} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                    ))}
                    {row(easeOut(prog(t, t2, t2 + 0.45)), 'Hosting closed', (
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={color.g600} strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" />
                            <circle cx="7" cy="7.5" r="1.3" fill={off < 0.5 ? '#12B76A' : color.g300} stroke="none" /><circle cx="7" cy="16.5" r="1.3" fill={off < 0.5 ? '#12B76A' : color.g300} stroke="none" />
                        </svg>
                    ))}
                </div>
            </div>
            <Bubble label={<><i style={{ width: 16, height: 16, borderRadius: 8, background: yt.amber, boxShadow: `0 0 12px ${yt.amber}` }} />Client</>} style={{ left: SAFE.x + 60, top: 1010, transformOrigin: '0 100%', ...f(smooth(pop * 1.8) * (1 - smooth(prog(t, e5 - 0.3, e5))), 0, 0, lerp(0.85, 1, easeBack(pop))) }}>
                {CARDS.ask}
            </Bubble>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 6: the catch (shown) */
const CELL = { w: 290, h: 470, gap: 25, top: 630 } as const;
const cellX = (i: number) => (1080 - 3 * CELL.w - 2 * CELL.gap) / 2 + i * (CELL.w + CELL.gap);

function Catch({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s6] = B(6), [s7] = B(7);
    const labels = [p.oldDomain, p.paths.careers, p.paths.contact];
    const ring = smooth(prog(t, word(6, 'one') - 0.2, word(6, 'one') + 0.3));
    const leave = smooth(prog(t, s7, s7 + 0.45)); // beat 7: the pages go; the domain pill stays put
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: env(t, s6 - 0.2, B(7)[1], 0.4, 0.3) }}>
            {labels.map((l, i) => {
                const a = s6 + 0.2 + i * 0.35; // each link is opened in turn…
                const load = smooth(prog(t, a + 0.25, a + 0.6));
                const k = smooth(prog(t, a, a + 0.35));
                return (
                    <div key={l}>
                        <div style={{ position: 'absolute', left: cellX(i), width: CELL.w, top: CELL.top - 80, display: 'flex', justifyContent: 'center', ...f(k * (1 - leave)) }}>
                            <UrlPill url={l} size={28} />
                        </div>
                        <div style={{ position: 'absolute', left: cellX(i), top: CELL.top, width: CELL.w, height: CELL.h, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: `0 30px 70px rgba(0,0,0,.45), 0 0 0 ${6 * ring}px rgba(229,148,38,${ring})`, ...f(k * (1 - leave), 0, (1 - k) * 40 + leave * 40) }}>
                            {/* …and every one shows the same homepage */}
                            <div style={{ height: 44, background: color.g100, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, fontFamily: font.sans, fontSize: 15, color: color.g600 }}>
                                <i style={{ width: 10, height: 10, borderRadius: 5, background: load > 0.9 ? yt.signalRed : color.g300 }} />{load > 0.5 ? p.newDomain : '…'}
                            </div>
                            <div style={{ position: 'absolute', left: 0, top: 44, width: 440, height: 760, transform: 'scale(0.66)', transformOrigin: '0 0', opacity: load }}>
                                <div style={{ position: 'absolute', inset: 0, top: -140 }}><Site jobs={false} /></div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* the catch: one amber bracket around three identical pages */}
            <div style={{ position: 'absolute', left: cellX(0) - 24, width: 3 * CELL.w + 2 * CELL.gap + 48, top: CELL.top + CELL.h + 30, height: 24, borderLeft: `6px solid ${yt.amber}`, borderRight: `6px solid ${yt.amber}`, borderBottom: `6px solid ${yt.amber}`, borderRadius: '0 0 18px 18px', boxSizing: 'border-box', ...f(ring * (1 - leave), 0, (1 - ring) * -10) }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: CELL.top + CELL.h + 66, textAlign: 'center', fontFamily: font.mono, fontSize: 34, fontWeight: 600, color: yt.amber, ...f(ring * (1 - leave)) }}>= {p.newDomain}</div>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 7: RedirHub (the room turns light) */
const DNS_GO = () => word(7, 'pointed');
const LIST_AT = () => word(7, 'set') - 0.1;
const MARK: Pt = [540, 980];

function Connect({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s7] = B(7);
    const from: Pt = [cellX(0) + CELL.w / 2, CELL.top - 80 + 58];
    const dnsK = easeInOut(prog(t, DNS_GO(), LIGHT_AT()));
    const mark = smooth(prog(t, LIGHT_AT() - 0.15, LIGHT_AT() + 0.25));
    const out = 1 - smooth(prog(t, LIST_AT() - 0.1, LIST_AT() + 0.15));
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: env(t, s7, LIST_AT() + 0.15, 0.3, 0.25) }}>
            <Line id="dns" from={from} to={[MARK[0] - 70, MARK[1] - 90]} progress={dnsK} bend={-0.25} opacity={out} />
            <div style={{ position: 'absolute', left: 560, top: 760, fontFamily: font.mono, fontSize: 34, fontWeight: 600, color: lerpColor(onLight(t)), ...f(smooth(dnsK * 3) * out) }}>DNS</div>
            <div style={{ position: 'absolute', left: MARK[0] - 120, top: MARK[1] - 120, width: 240, height: 240, borderRadius: 120, background: '#fff', boxShadow: `0 30px 80px rgba(16,24,40,.25), 0 0 0 ${14 * mark}px rgba(229,148,38,.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...f(mark * out, 0, 0, lerp(0.7, 1, easeBack(mark))) }}>
                <div style={{ height: 130 }}><RedirHubIcon variant="color" /></div>
            </div>
            {/* the domain pill, in place from beat 6 */}
            <div style={{ position: 'absolute', left: cellX(0), width: CELL.w, top: CELL.top - 80, display: 'flex', justifyContent: 'center', ...f(out) }}>
                <UrlPill url={p.oldDomain} size={28} variant={onLight(t) > 0.5 ? 'light' : 'glass'} />
            </div>
        </div>
    );
}
const lerpColor = (k: number) => `color-mix(in srgb, ${color.g600} ${(k * 100).toFixed(0)}%, ${yt.inkSoft})`;

function Links({ t, p }: { t: number; p: EzMarketingProps }) {
    const [, e7] = B(7);
    const at = LIST_AT();
    const rows: RowData[] = [
        { icon: 'globe', title: p.oldDomain, dest: `https://${p.newDomain}`, clicks: '0' },
        { icon: 'globe', title: `${p.oldDomain}${p.paths.careers}`, dest: `https://${p.newDomain}${p.paths.jobs}`, clicks: '0' },
        { icon: 'globe', title: `${p.oldDomain}${p.paths.contact}`, dest: `https://${p.newDomain}`, clicks: '0' },
    ];
    const S = 0.9, W = 1000, H = ROW_GEOM.top + 3 * (ROW_GEOM.h + ROW_GEOM.gap) + 10;
    const enter = rows.map((_, i) => easeOut(prog(t, at + 0.25 + i * 0.4, at + 0.65 + i * 0.4)));
    const k = easeOut(prog(t, at - 0.05, at + 0.35));
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: env(t, at - 0.05, e7 + 0.2, 0.2, 0.4) }}>
            <div style={{ position: 'absolute', left: (1080 - W * S) / 2, top: 560, width: W * S, height: H * S, borderRadius: 32, overflow: 'hidden', background: '#fff', boxShadow: '0 40px 100px rgba(16,24,40,.20), 0 0 0 2px rgba(16,24,40,.06)', ...f(1, 0, (1 - k) * 60, lerp(0.96, 1, k)) }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${S})`, transformOrigin: 'top left' }}>
                    <LinksPage rows={rows} enter={enter} linkCount={3} />
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 8: three chips, each shown */
function Stopwatch({ k }: { k: number }) {
    const a = k * 2 * Math.PI;
    return (
        <svg width="190" height="190" viewBox="0 0 100 100">
            <circle cx="50" cy="55" r="38" fill="none" stroke={color.g200} strokeWidth="8" />
            <circle cx="50" cy="55" r="38" fill="none" stroke={yt.teal} strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform="rotate(-90 50 55)" />
            <rect x="43" y="5" width="14" height="8" rx="3" fill={color.g600} />
            <line x1="50" y1="55" x2={50 + 26 * Math.sin(a)} y2={55 - 26 * Math.cos(a)} stroke={color.charcoal} strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="55" r="5" fill={color.charcoal} />
        </svg>
    );
}
function Padlock({ k }: { k: number }) {
    return (
        <svg width="170" height="190" viewBox="0 0 90 100">
            <path d={`M22 ${48 - 14 * (1 - k)} V30 a23 23 0 0 1 46 0 V${48 - 14 * (1 - k)}`} fill="none" stroke={color.g600} strokeWidth="9" strokeLinecap="round" transform={`translate(0 ${-10 * (1 - k)})`} />
            <rect x="10" y="44" width="70" height="52" rx="12" fill={yt.teal} />
            <circle cx="45" cy="66" r="7" fill="#fff" /><rect x="42" y="68" width="6" height="14" rx="3" fill="#fff" />
        </svg>
    );
}
function Server({ k }: { k: number }) {
    return (
        <svg width="190" height="190" viewBox="0 0 100 100">
            <g opacity={1 - 0.55 * k}>
                {[14, 40, 66].map((y) => <g key={y}><rect x="16" y={y} width="68" height="20" rx="5" fill="none" stroke={color.g600} strokeWidth="5" /><circle cx="28" cy={y + 10} r="3.5" fill={color.g500} /></g>)}
            </g>
            <line x1="12" y1="88" x2="88" y2="12" stroke={yt.signalRed} strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
        </svg>
    );
}

function Chips({ t }: { t: number }) {
    const dark = color.charcoal;
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 8, 8) }}>
            {CARDS.chips.map((c, i) => {
                const [a, b] = chipWindow(i);
                assertHold(c, a, b);
                const last = i === CARDS.chips.length - 1;
                const inK = smooth(prog(t, a, a + 0.3)), outK = last ? 0 : smooth(prog(t, b - 0.05, b + 0.25));
                const act = easeOut(prog(t, a + 0.15, a + 1.0));
                const icon = i === 0 ? <Stopwatch k={act} /> : i === 1 ? <Padlock k={easeBack(prog(t, a + 0.25, a + 0.7))} /> : <Server k={act} />;
                return (
                    <div key={c} style={{ position: 'absolute', left: 0, width: 1080, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, ...f(inK * (1 - outK), 0, (1 - inK) * 40 - outK * 40, lerp(0.94, 1, easeBack(prog(t, a, a + 0.4)))) }}>
                        <div style={{ width: 300, height: 300, borderRadius: 80, background: '#fff', boxShadow: '0 30px 80px rgba(16,24,40,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <div style={{ fontFamily: font.display, fontSize: 110, fontWeight: 800, letterSpacing: '-.04em', color: dark, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 22 }}>
                            {c.replace(' ✓', '')}{c.endsWith('✓') && <Check size={96} k={easeOut(prog(t, a + 0.15, a + 0.55))} />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------------------------------------------------------------- beat 9: the visits, shown */
function Visits({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s9, e9] = B(9);
    assertHold(`${CARDS.visits} ${CARDS.visitsSub}`, s9 + 0.2, e9);
    const k = easeOut(prog(t, s9 + 0.4, s9 + 2.4));
    const n = Math.round(p.visits * k);
    const lineK = easeInOut(prog(t, s9 + 0.15, s9 + 0.6));
    const A: Pt = [540, 690], Z: Pt = [540, 1110];
    const flow = 1 - smooth(prog(t, s9 + 2.3, s9 + 2.9)); // the stream eases off as the count settles
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 9, 9), fontFamily: font.display }}>
            <div style={{ position: 'absolute', left: SAFE.x, top: 290, fontSize: 200, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1, color: yt.ink, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 26 }}>
                {n}<span style={{ fontSize: 88, color: yt.teal, letterSpacing: '-.035em' }}>visits</span>
            </div>
            <div style={{ position: 'absolute', left: SAFE.x, top: 510, fontSize: 42, fontWeight: 500, color: yt.inkSoft }}>{CARDS.visitsSub}</div>
            <Line id="v9" from={[A[0], A[1] + 40]} to={[Z[0], Z[1] - 46]} progress={lineK} bend={0} width={8} />
            {/* each dot is a visit: in at the old link, out at /jobs */}
            {Array.from({ length: 14 }, (_, i) => {
                const ph = ((t - s9) * 1.6 + i / 14) % 1;
                const y = lerp(A[1] + 50, Z[1] - 60, ph);
                const o = lineK > 0.95 ? Math.sin(Math.PI * ph) * flow : 0;
                return <i key={i} style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: `0 0 16px ${yt.teal}`, ...f(o, A[0], y) }} />;
            })}
            <div style={{ position: 'absolute', left: 0, width: 1080, top: A[1] - 40, display: 'flex', justifyContent: 'center' }}><UrlPill url={`${p.oldDomain}${p.paths.careers}`} size={40} /></div>
            <div style={{ position: 'absolute', left: 0, width: 1080, top: Z[1] - 40, display: 'flex', justifyContent: 'center' }}><UrlPill url={`${p.newDomain}${p.paths.jobs}`} dot="teal" size={40} /></div>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 12: the end card (light, full-colour logo) */
function End({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s] = B(12);
    const l1 = s + 0.1, l2 = l1 + 0.35 + 0.3; // "Old links." reveals, a 300 ms beat, "Fixed." lands
    const logo = smooth(prog(t, l2 + 0.3, l2 + 0.8));
    const r = (a: number) => f(smooth(prog(t, a, a + 0.35)), 0, (1 - easeOut(prog(t, a, a + 0.4))) * 30);
    return (
        <AbsoluteFill style={{ textAlign: 'center', fontFamily: font.display, opacity: smooth(prog(t, s - 0.2, s + 0.15)) }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 640, fontSize: 150, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.02 }}>
                <div style={{ color: color.charcoal, ...r(l1) }}>{p.endLines[0]}</div>
                <div style={{ color: yt.teal, ...r(l2) }}>{p.endLines[1]}</div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', ...f(logo, 0, (1 - logo) * 16) }}>
                <div style={{ width: 520 }}><RedirHubLogo variant="color" /></div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1190, fontSize: 44, fontWeight: 600, color: color.g600, ...f(logo, 0, (1 - logo) * 16) }}>{p.endSub}</div>
        </AbsoluteFill>
    );
}

/* ---------------------------------------------------------------- the reel */
export function EzMarketingStory(props: EzMarketingProps) {
    const t = useTime();
    const ink = `color-mix(in srgb, ${color.charcoal} ${(onLight(t) * 100).toFixed(1)}%, ${yt.ink})`;
    const c = (n: number, text: string, from = B(n)[0] + 0.2, until = B(n)[1]) => <Card t={t} from={from} until={until} text={text} color={ink} />;
    return (
        <AbsoluteFill style={{ fontFamily: font.display }}>
            <Rooms t={t} />
            <Opening t={t} p={props} />
            <Agency t={t} p={props} />
            <Handover t={t} />
            <Catch t={t} p={props} />
            <Connect t={t} p={props} />
            <Links t={t} p={props} />
            <Chips t={t} />
            <Visits t={t} p={props} />
            <Callback t={t} p={props} />

            {c(1, CARDS.clicked)}
            {c(2, CARDS.jobs, B(2)[0] + 0.5)}
            {c(4, CARDS.handover)}
            {c(6, CARDS.fan)}
            {c(7, CARDS.redirects, LIST_AT())}
            {c(10, CARDS.right, B(10)[0] + REWIND)}
            {c(11, CARDS.still, B(11)[0] + 0.1)}

            {CAPTIONS.map((cap, i) => <Caption key={i} t={t} {...cap} backing={needsBacking(t)} />)}
            {t >= B(12)[0] - 0.2 && <End t={t} p={props} />}
        </AbsoluteFill>
    );
}
