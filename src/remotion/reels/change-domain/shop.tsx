/* The story world of W44, from the approved world board (w44-World) and build_frames.py: both logos on Leo's
   cup-of-scoops reference, the rename morph, the strawberry card (the film's thread), the search page, the
   shop's sites and its printed props. Every prop that changes name takes `k` (0 = Frosty Fusion, 1 = Frosty
   Bites) and changes by morph or roll, never a cut. The shop palette (SHOP) stays inside these props. */
import type { CSSProperties, ReactNode } from 'react';
import { clamp, easeInOut, easeOut, prog } from '../../lib/anim';
import { Browser, C, FR, MONO, Roll, SHOP, SOFT_SHADOW, UI, mix, smooth } from './kit';
import { NAMES } from './props';

const S = SHOP;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/* ---------------------------------------------------------------- the marks */
const SWIRL = 'M18 57Q14 46 26 44Q24 33 36 32Q38 20 50 17Q62 20 64 32Q76 33 74 44Q86 46 82 57Z';
/** The cup both marks share; the rim's colour blends mist (Fusion) → blush (Bites). */
function Cup({ k }: { k: number }) {
    return (
        <g>
            <path d="M17 66L25 104Q26 109 31 109H69Q74 109 75 104L83 66Z" fill="#FFFFFF" stroke={S.ink} strokeWidth="5" strokeLinejoin="round" />
            <path d="M30 80H70" stroke={S.blush} strokeWidth="6" strokeLinecap="round" />
            <rect x="10" y="56" width="80" height="13" rx="6.5" fill={mix(S.mist, S.blush, k)} stroke={S.ink} strokeWidth="5" />
        </g>
    );
}
/** The logo mark, morphing with `k`: 0 is Frosty Fusion's swirl (half blue, half pink); the swirl splits into two
    scoops (0–0.45), the drip runs over the rim and the sprinkles land (0.45–0.75), the blue scoop opens its eyes
    and smiles (0.7–1). `id` keeps the clip ids unique per instance. */
export function Mark({ size = 120, k = 0, id }: { size?: number; k?: number; id: string }) {
    const split = easeInOut(prog(k, 0, 0.45));
    const drip = easeOut(prog(k, 0.45, 0.75));
    const face = easeOut(prog(k, 0.7, 1));
    const swirlO = 1 - smooth(split * 1.4);
    // The scoops grow out of the swirl's centre to their places.
    const blue = { cx: lerp(52, 64, split), cy: lerp(40, 36, split), r: lerp(14, 24, split) };
    const pink = { cx: lerp(46, 35, split), cy: lerp(44, 42, split), r: lerp(12, 20, split) };
    const sprinkles: readonly [string, string][] = [['M27 34L31 31', '#FFFFFF'], ['M37 27H42', S.ink], ['M24 45L27 48', S.ink], ['M39 40L42 37', '#FFFFFF'], ['M33 47H37', '#FFFFFF']];
    return (
        <svg data-logo width={size} height={Math.round(size * 1.14)} viewBox="0 0 100 114" role="img" aria-label="Frosty mark" style={{ display: 'block', flex: 'none', overflow: 'visible' }}>
            <defs>
                <clipPath id={`${id}-l`}><rect x="0" y="0" width="50" height="60" /></clipPath>
                <clipPath id={`${id}-r`}><rect x="50" y="0" width="50" height="60" /></clipPath>
                <clipPath id={`${id}-d`}><rect x="20" y="60" width="20" height={4 + 26 * drip} /></clipPath>
            </defs>
            {split > 0 && (
                <g>
                    <circle cx={blue.cx} cy={blue.cy} r={blue.r} fill={S.sky} stroke={S.ink} strokeWidth="5" opacity={smooth(split * 2)} />
                    <circle cx={pink.cx} cy={pink.cy} r={pink.r} fill={S.pink} stroke={S.ink} strokeWidth="5" opacity={smooth(split * 2)} />
                </g>
            )}
            {swirlO > 0 && (
                <g opacity={swirlO} transform={`translate(50 40) scale(${1 - 0.15 * split}) translate(-50 -40)`}>
                    <g clipPath={`url(#${id}-l)`}><path d={SWIRL} fill={S.sky} /></g>
                    <g clipPath={`url(#${id}-r)`}><path d={SWIRL} fill={S.pink} /></g>
                    <path d={SWIRL} fill="none" stroke={S.ink} strokeWidth="5" strokeLinejoin="round" />
                    <path d="M27 44H73M36 32H64" stroke={S.ink} strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 17Q51 10 47 6" fill="none" stroke={S.ink} strokeWidth="5" strokeLinecap="round" />
                </g>
            )}
            {face > 0 && (
                <g opacity={smooth(face * 1.5)}>
                    <circle cx="57" cy="32" r={3 * face} fill={S.ink} />
                    <circle cx="71" cy="32" r={3 * face} fill={S.ink} />
                    <path d="M57 41Q64 48 71 41" fill="none" stroke={S.ink} strokeWidth="4.5" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - face} />
                </g>
            )}
            {drip > 0 && sprinkles.map(([d, c], i) => (
                <path key={d} d={d} stroke={c} strokeWidth="4" strokeLinecap="round" opacity={smooth(prog(drip, i * 0.12, i * 0.12 + 0.4))} />
            ))}
            <Cup k={drip} />
            {drip > 0 && (
                <g clipPath={`url(#${id}-d)`}>
                    <path d="M27 64V77Q27 82 31.5 82Q36 82 36 77V64" fill={S.pink} stroke={S.ink} strokeWidth="5" strokeLinejoin="round" />
                    <path d="M29 62H34" stroke={S.pink} strokeWidth="6" />
                </g>
            )}
        </svg>
    );
}

/** The full logo: mark + Fredoka wordmark. The second word rolls Fusion → Bites with the morph. */
export function Logo({ width = 520, k = 0, id }: { width?: number; k?: number; id: string }) {
    const roll = easeInOut(prog(k, 0.3, 0.75));
    const fs = Math.round(width * 0.14);
    const second = (word: string, color: string) => (
        <span style={{ color, WebkitTextStroke: `${Math.max(1.5, width * 0.0045).toFixed(1)}px ${S.ink}`, paintOrder: 'stroke fill' }}>{word}</span>
    );
    return (
        <div data-logo data-shop style={{ display: 'flex', alignItems: 'center', gap: Math.round(width * 0.045), width }}>
            <Mark size={width * 0.24} k={k} id={id} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(width * 0.01) }}>
                <span style={{ fontFamily: FR, fontWeight: 600, fontSize: fs, lineHeight: 1, letterSpacing: '-0.01em', color: S.ink, whiteSpace: 'nowrap' }}>
                    Frosty <Roll from={second('Fusion', S.sky)} to={second('Bites', S.pink)} k={roll} h={fs * 1.2} />
                </span>
                <span style={{ fontFamily: FR, fontWeight: 500, fontSize: Math.round(width * 0.042), letterSpacing: '0.34em', color: S.ink, opacity: 0.7, whiteSpace: 'nowrap' }}>ICE CREAM</span>
            </div>
        </div>
    );
}

/** The strawberry page's own icon, the same under both names: one pink scoop with seeds in a small cup. */
export function ScoopIcon({ size = 64, bg = C.g100, color = S.pink }: { size?: number; bg?: string; color?: string }) {
    return (
        <span data-shop style={{ width: size, height: size, flex: 'none', borderRadius: '50%', background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 48 48" aria-hidden="true">
                <path d="M9 23A15 15 0 0 1 39 23Z" fill={color} stroke={S.ink} strokeWidth="2.4" strokeLinejoin="round" />
                {color === S.pink && <path d="M18 14.5V16M26 12V13.5M31 18V19.5M21 19.5V21" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />}
                <path d="M8 23H40L36.5 42Q36 44.5 33.5 44.5H14.5Q12 44.5 11.5 42Z" fill="#FFFFFF" stroke={S.ink} strokeWidth="2.4" strokeLinejoin="round" />
                {color === S.pink && <path d="M13 31H35" stroke={S.blush} strokeWidth="3" strokeLinecap="round" />}
            </svg>
        </span>
    );
}

/* ---------------------------------------------------------------- the strawberry card */
const SNIPPET = 'Fresh strawberries, folded in every morning. The scoop people cross town for.';
/** The film's thread: a search result for the strawberry page. `k` rolls its name and address Fusion → Bites.
    `ring` (a colour) and `ringK` (0–1) draw the ring; `rank` shows the slot number; `iconK` fades the icon in
    (the shared-element hand-off from the homepage tile). */
export function StrawberryCard({ k = 0, w = 1080, s = 1, rank, rankK = 1, rankRoll, ring, ringK = 1, iconK = 1, style }: {
    k?: number; w?: number; s?: number; rank?: ReactNode; rankK?: number; rankRoll?: { from: string; to: string; k: number }; ring?: string; ringK?: number; iconK?: number; style?: CSSProperties;
}) {
    const r = (v: number) => Math.round(v * s);
    const name = <Roll from={NAMES.oldName} to={NAMES.newName} k={k} h={r(26)} />;
    const dom = <Roll from={NAMES.old} to={NAMES.new} k={k} h={r(24)} />;
    const title = <Roll from={`Strawberry ice cream · ${NAMES.oldName}`} to={`Strawberry ice cream · ${NAMES.newName}`} k={k} h={r(40)} />;
    return (
        <div data-ui="website" style={{ position: 'relative', width: r(w), boxSizing: 'border-box', padding: `${r(26)}px ${r(32)}px ${r(28)}px`, borderRadius: r(22), background: '#FFFFFF', boxShadow: `${ring ? `0 0 0 ${r(4) * clamp(ringK)}px ${ring}, ` : ''}0 ${r(24)}px ${r(60)}px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: C.char, display: 'flex', flexDirection: 'column', gap: r(12), ...style }}>
            {(rank !== undefined || rankRoll) && (
                <span style={{ position: 'absolute', left: r(-78), top: r(34), width: r(52), height: r(52), borderRadius: '50%', background: C.char, color: '#FFFFFF', fontFamily: MONO, fontSize: r(24), fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: smooth(rankK * 1.6), transform: `scale(${0.6 + 0.4 * easeOut(clamp(rankK))})`, willChange: 'transform' }}>
                    {rankRoll ? <Roll from={rankRoll.from} to={rankRoll.to} k={rankRoll.k} h={r(30)} /> : rank}
                </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: r(16) }}>
                <span style={{ display: 'inline-flex', opacity: iconK }}><ScoopIcon size={r(56)} /></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: r(3) }}>
                    <span style={{ fontSize: r(21), fontWeight: 600 }}>{name}</span>
                    <span style={{ fontFamily: MONO, fontSize: r(18), color: C.g600, whiteSpace: 'nowrap' }}>{dom} › flavors › strawberry</span>
                </div>
            </div>
            <span style={{ fontSize: r(32), fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{title}</span>
            <span style={{ fontSize: r(20), lineHeight: 1.45, color: C.g600 }}>{SNIPPET}</span>
        </div>
    );
}
/** The strawberry card, melting: its bottom edge runs into drips as `melt` goes 0 → 1 (no tilt). */
export function MeltDrips({ w, s = 1, melt }: { w: number; s?: number; melt: number }) {
    const e = easeOut(clamp(melt));
    return (
        <>
            <svg data-amber-part width={Math.round(w * s)} height={Math.round(120 * s)} viewBox="0 0 1080 120" preserveAspectRatio="none" aria-hidden="true"
                style={{ position: 'absolute', left: 0, top: '100%', marginTop: Math.round(-22 * s), transform: `scaleY(${0.05 + 0.95 * e})`, transformOrigin: 'top center', willChange: 'transform' }}>
                <path d="M40 0H1040V8Q1030 30 1012 26Q996 22 990 54Q986 82 966 80Q946 78 948 40Q950 14 900 16Q850 18 846 44Q842 66 826 64Q806 62 808 30Q808 12 700 14Q590 16 588 58Q586 104 560 104Q534 104 536 52Q538 18 420 16Q300 14 298 40Q296 62 280 62Q262 62 262 34Q262 14 180 14Q110 14 108 70Q106 112 84 112Q60 112 62 60Q64 20 40 10Z" fill="#FFFFFF" />
            </svg>
            <span style={{ position: 'absolute', left: Math.round(40 * s), right: Math.round(60 * s), top: '100%', marginTop: Math.round(96 * s), height: Math.round(22 * s), borderRadius: '50%', background: 'rgba(255,255,255,0.22)', filter: 'blur(2px)', opacity: smooth(prog(e, 0.5, 1)) }} />
        </>
    );
}

function SkeletonResult({ w = 1040, alpha = 1 }: { w?: number; alpha?: number }) {
    return (
        <div style={{ width: w, boxSizing: 'border-box', padding: '22px 32px', display: 'flex', gap: 16, alignItems: 'flex-start', opacity: alpha }}>
            <span style={{ width: 48, height: 48, flex: 'none', borderRadius: '50%', background: C.g100 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
                <span style={{ width: '34%', height: 12, borderRadius: 6, background: C.g200 }} />
                <span style={{ width: '62%', height: 20, borderRadius: 8, background: C.g300 }} />
                <span style={{ width: '88%', height: 12, borderRadius: 6, background: C.g200 }} />
            </div>
        </div>
    );
}
const Mag = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#475467" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>;
/** A generic search results page (no search engine's name, colours or copy), 1280 × h. `typed` 0–1 writes the
    query; `skeletonShift` moves the two skeleton results (the strawberry card swaps places with them); `slot`
    is the first result. */
export function SearchPage({ h = 700, typed = 1, skeletonShift = 0, slot, caret = false }: { h?: number; typed?: number; skeletonShift?: number; slot: ReactNode; caret?: boolean }) {
    const q = NAMES.query.slice(0, Math.round(NAMES.query.length * clamp(typed)));
    return (
        <Browser url="" w={1280} h={h} shadow={SOFT_SHADOW}>
            <div style={{ padding: '34px 60px 0', display: 'flex', flexDirection: 'column', gap: 26 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, height: 68, borderRadius: 34, boxShadow: `inset 0 0 0 1.5px ${C.g300}, 0 6px 18px rgba(16,24,40,0.06)`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', fontSize: 26, color: C.char }}>
                        <Mag />{q}{caret && <span style={{ width: 2, height: 30, background: C.char, marginLeft: -12 }} />}
                    </div>
                    <span style={{ height: 34, padding: '0 14px', borderRadius: 17, background: C.g100, fontSize: 16, fontWeight: 600, color: C.g600, display: 'inline-flex', alignItems: 'center' }}>Example search</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 70 }}>
                    <div style={{ position: 'relative', minHeight: 201 }}>{slot}</div>
                    <div style={{ transform: `translate3d(0, ${skeletonShift}px, 0) rotate(0.02deg)`, willChange: 'transform' }}>
                        <SkeletonResult /><SkeletonResult alpha={0.7} />
                    </div>
                </div>
            </div>
        </Browser>
    );
}

/* ---------------------------------------------------------------- the shop's sites */
const FLAVORS: readonly [string, string | null][] = [['Vanilla bean', '#FFFFFF'], ['Strawberry', null], ['Blue moon', S.sky], ['Cotton candy', S.blush]];
function PlainScoop({ size, col }: { size: number; col: string }) {
    return (
        <span style={{ width: size, height: size, flex: 'none', borderRadius: '50%', background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} viewBox="0 0 48 48" aria-hidden="true">
                <path d="M9 23A15 15 0 0 1 39 23Z" fill={col} stroke={S.ink} strokeWidth="2.4" strokeLinejoin="round" />
                <path d="M8 23H40L36.5 42Q36 44.5 33.5 44.5H14.5Q12 44.5 11.5 42Z" fill="#FFFFFF" stroke={S.ink} strokeWidth="2.4" strokeLinejoin="round" />
            </svg>
        </span>
    );
}
export function Stars({ n = 5, size = 22, color = C.g700 }: { n?: number; size?: number; color?: string }) {
    return (
        <span style={{ display: 'inline-flex', gap: 3 }}>
            {Array.from({ length: n }, (_, i) => <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill={color} /></svg>)}
        </span>
    );
}
/** The shop's homepage at 1180 × (h − 64) under a browser bar. `brand` 'fusion' | 'bites'; `hot` 0–1 lifts and
    rings the strawberry tile; `hunt` 0–1 dims the tile so the cursor's search reads (the shortcut). */
export function Home({ brand, h = 640, hot = brand === 'fusion' ? 1 : 0, id }: { brand: 'fusion' | 'bites'; h?: number; hot?: number; id: string }) {
    const famous = brand === 'fusion'; // the label row is laid out from the start (its opacity animates, never its height)
    const [wash, accent] = brand === 'fusion' ? [S.mist, S.sky] : [S.blush, S.pink];
    const head = brand === 'fusion' ? 'Forty flavors. One famous strawberry.' : 'Same scoops. A sweeter name.';
    const sub = brand === 'fusion' ? 'Scooping since 2021 · Open daily, noon till late' : 'Forty flavors, made here every morning.';
    const e = smooth(hot);
    return (
        <div data-shop style={{ height: h - 64, background: '#FFFFFF', display: 'flex', flexDirection: 'column', fontFamily: UI }}>
            <div style={{ height: 88, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 44px', borderBottom: `1px solid ${wash}` }}>
                <Logo width={260} k={brand === 'fusion' ? 0 : 1} id={`${id}-logo`} />
                <div style={{ display: 'flex', gap: 30, fontSize: 18, fontWeight: 500, color: S.ink }}><span>Flavors</span><span>Visit</span><span>Our story</span></div>
            </div>
            <div style={{ flex: 1, background: `linear-gradient(180deg, ${wash} 0%, #FFFFFF 80%)`, padding: '38px 44px 0', display: 'flex', flexDirection: 'column', gap: 26 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-0.02em', color: S.ink }}>{head}</span>
                    <span style={{ fontSize: 21, color: S.ink, opacity: 0.75 }}>{sub}</span>
                </div>
                <div style={{ display: 'flex', gap: 18 }}>
                    {FLAVORS.map(([name, col]) => {
                        const star = name === 'Strawberry';
                        const k = star ? e : 0;
                        return (
                            <div key={name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '22px 0 18px', borderRadius: 18, background: star ? mix(wash, '#FFFFFF', k) : wash, boxShadow: star ? `0 0 0 ${4 * k}px ${accent}, 0 ${16 * k}px ${36 * k}px rgba(38,51,92,${0.16 * k})` : 'none', transform: star ? `translate3d(0, ${-10 * k}px, 0)` : undefined, willChange: star ? 'transform' : undefined }}>
                                {col === null ? <ScoopIcon size={84} bg={wash} /> : <PlainScoop size={84} col={col} />}
                                <span style={{ fontSize: 19, fontWeight: 600, color: S.ink }}>{name}</span>
                                {star && famous && <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: S.ink, opacity: 0.6 * k }}>THE FAMOUS ONE</span>}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 19, color: S.ink }}><Stars n={5} size={20} color={S.ink} /><span>“Worth the drive. Every time.”</span></div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- SEO tethers and shop props */
export const LinkIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </svg>
);
export function BlogCard({ title, w = 420 }: { title: string; w?: number }) {
    return (
        <div data-ui="website" style={{ width: w, boxSizing: 'border-box', borderRadius: 18, background: '#FFFFFF', boxShadow: `0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, overflow: 'hidden', fontFamily: UI, color: C.char }}>
            <div style={{ height: 40, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 8, background: C.g50, borderBottom: `1px solid ${C.g200}`, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: C.g500 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.g300 }} />A LOCAL FOOD BLOG
            </div>
            <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>{title}</span>
                <span style={{ width: '92%', height: 10, borderRadius: 5, background: C.g200 }} /><span style={{ width: '70%', height: 10, borderRadius: 5, background: C.g200 }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 'max-content', maxWidth: '100%', padding: '8px 12px', borderRadius: 10, background: C.g100, color: C.g700, fontFamily: MONO, fontSize: 15 }}><LinkIcon />{NAMES.old}{NAMES.path}</span>
            </div>
        </div>
    );
}
export function ReviewCard({ quote, who = 'a regular', w = 420 }: { quote: string; who?: string; w?: number }) {
    return (
        <div data-ui="website" style={{ width: w, boxSizing: 'border-box', padding: '20px 22px', borderRadius: 18, background: '#FFFFFF', boxShadow: `0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: C.char, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: C.g200 }} />
                <span style={{ fontSize: 16, fontWeight: 600, color: C.g600 }}>{who}</span><span style={{ marginLeft: 'auto' }}><Stars size={20} /></span>
            </div>
            <span style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 500 }}>“{quote}”</span>
        </div>
    );
}
/** A page of the site as an address card. `k` rolls its domain old → new; `badge` is a slot under the address. */
export function PageCard({ path, k = 0, w = 420, hero = false, dim = false, badge, style }: { path: string; k?: number; w?: number; hero?: boolean; dim?: boolean; badge?: ReactNode; style?: CSSProperties }) {
    return (
        <div data-ui="website" style={{ width: w, boxSizing: 'border-box', padding: '16px 18px', borderRadius: 16, background: '#FFFFFF', opacity: dim ? 0.55 : 1, boxShadow: `${hero ? `0 0 0 3px ${C.g300}, ` : ''}0 18px 44px rgba(16,24,40,0.14), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: C.char, display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {hero ? <ScoopIcon size={44} /> : <span style={{ width: 44, height: 44, flex: 'none', borderRadius: 12, background: C.g100 }} />}
                <span style={{ fontFamily: MONO, fontSize: 18, color: C.char, whiteSpace: 'nowrap' }}>
                    <span style={{ color: C.g500 }}>{k > 0 ? <Roll from={NAMES.old} to={NAMES.new} k={k} h={24} /> : NAMES.old}</span>{path}
                </span>
            </div>
            {badge}
        </div>
    );
}
/** The social bio card. `k` 0 → 1 flips the handle and link to Frosty Bites (the mark morphs). */
export function BioCard({ w = 400, k = 1, id }: { w?: number; k?: number; id: string }) {
    return (
        <div data-shop data-ui="website" style={{ width: w, boxSizing: 'border-box', padding: 24, borderRadius: 22, background: '#FFFFFF', boxShadow: `0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: C.char, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ width: 76, height: 76, borderRadius: '50%', background: mix(S.mist, S.blush, k), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px #FFFFFF, 0 0 0 5px ${C.g200}` }}><Mark size={46} k={k} id={id} /></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}><Roll from="frostyfusion" to="frostybites" k={k} h={26} /></span>
                    <span style={{ fontSize: 15, color: C.g500 }}>Ice cream shop</span>
                </div>
            </div>
            <span style={{ fontSize: 17, lineHeight: 1.45 }}>Small-batch ice cream. Forty flavors.<br />Yes, that strawberry.</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.g700, fontFamily: MONO, fontSize: 16 }}><LinkIcon /><Roll from={NAMES.old} to={NAMES.new} k={k} h={22} /></span>
        </div>
    );
}
const QrGlyph = ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6B675F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7" />
    </svg>
);
/** The paper menu. `k` 0 → 1 morphs its logo and its QR label to Frosty Bites; `qrLabel` overrides the label;
    `scan` 0–1 rings the QR slot (the phone scanning it). */
export function MenuCard({ w = 360, k = 1, qrLabel, scan = 0, id }: { w?: number; k?: number; qrLabel?: ReactNode; scan?: number; id: string }) {
    return (
        <div data-shop data-ui="print" style={{ width: w, boxSizing: 'border-box', padding: '26px 28px', borderRadius: 10, background: C.paper, boxShadow: '0 24px 50px rgba(16,24,40,0.18), 0 0 0 1px #F4EFE6', fontFamily: UI, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Logo width={250} k={k} id={id} />
            <span style={{ height: 1, background: C.paper2, margin: '4px 0' }} />
            {FLAVORS.map(([n]) => <span key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, color: C.ink3 }}><span>{n}</span><span style={{ color: C.ink8 }}>·</span></span>)}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 84, height: 84, flex: 'none', borderRadius: 10, boxShadow: `inset 0 0 0 2px #8A8478, 0 0 0 ${6 * scan}px rgba(32,167,149,${0.45 * scan})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrGlyph /></span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.ink6 }}>QR slot · menu link</span>
                    <span style={{ fontFamily: MONO, fontSize: 15, color: C.ink3, lineHeight: 1.3 }}>{qrLabel ?? <Roll from={NAMES.old} to={NAMES.new} k={k} h={20} />}</span>
                </span>
            </div>
        </div>
    );
}
/** The maps-style listing. `k` flips its name and link to Frosty Bites. */
export function MapsCard({ w = 420, k = 1 }: { w?: number; k?: number }) {
    return (
        <div data-shop data-ui="website" style={{ width: w, boxSizing: 'border-box', borderRadius: 22, overflow: 'hidden', background: '#FFFFFF', boxShadow: `0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: C.char }}>
            <div style={{ position: 'relative', height: 150, background: C.g100, overflow: 'hidden' }}>
                <svg width={w} height="150" viewBox="0 0 420 150" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}><path d="M-10 40L430 90M120 -10L170 160M-10 120L430 70M300 -10L260 160" stroke="#FFFFFF" strokeWidth="12" /></svg>
                <svg width="44" height="56" viewBox="0 0 24 30" aria-hidden="true" style={{ position: 'absolute', left: w / 2 - 22, top: 34 }}><path d="M12 29C12 29 22 17 22 10A10 10 0 0 0 2 10C2 17 12 29 12 29Z" fill={S.pink} stroke={S.ink} strokeWidth="1.6" /><circle cx="12" cy="10" r="4" fill="#FFFFFF" /></svg>
            </div>
            <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}><Roll from={NAMES.oldName} to={NAMES.newName} k={k} h={28} /></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: C.g600 }}>Ice cream shop · Open now</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.g700, fontFamily: MONO, fontSize: 16 }}><LinkIcon /><Roll from={NAMES.old} to={NAMES.new} k={k} h={22} /></span>
            </div>
        </div>
    );
}
/** The site's own links card. `k` flips the header logo and every link to the new domain. */
export function SiteLinksCard({ w = 400, k = 1, id }: { w?: number; k?: number; id: string }) {
    return (
        <div data-shop data-ui="website" style={{ width: w, boxSizing: 'border-box', borderRadius: 22, overflow: 'hidden', background: mix(S.mist, S.blush, k), boxShadow: `0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px ${C.g200}`, fontFamily: UI, color: S.ink }}>
            <div style={{ padding: '22px 24px 16px' }}><Logo width={250} k={k} id={id} /></div>
            <div style={{ padding: '16px 24px 22px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: C.g500 }}>SITE LINKS</span>
                {['/flavors', '/visit', '/order'].map((p, i) => (
                    <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 15, color: C.g700 }}><LinkIcon /><Roll from={NAMES.old} to={NAMES.new} k={clamp(k * 1.3 - i * 0.15)} h={20} />{p}</span>
                ))}
            </div>
        </div>
    );
}
/** The shop sign: a striped awning over the logo. */
export function Sign({ brand, w, h, children, style }: { brand: 'fusion' | 'bites'; w: number; h: number; children: ReactNode; style?: CSSProperties }) {
    const stripe = brand === 'fusion' ? S.sky : S.pink;
    return (
        <div data-shop style={{ position: 'relative', width: w, height: h, borderRadius: 30, background: '#FFFFFF', overflow: 'hidden', boxShadow: SOFT_SHADOW, ...style }}>
            <div style={{ height: 64, background: `repeating-linear-gradient(90deg, ${stripe} 0 60px, #FFFFFF 60px 120px)` }} />
            <div style={{ height: h - 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
        </div>
    );
}
/** The one gag: a smoothie straw (striped) that drops into the swirl. Drawn alone; the scene places it over a mark. */
export function Straw({ size = 210 }: { size?: number }) {
    return (
        <svg width={Math.round(size * 0.2)} height={Math.round(size * 0.75)} viewBox="0 0 20 74" aria-hidden="true" style={{ display: 'block' }}>
            <rect x="3" y="2" width="14" height="70" rx="4" fill="#FFFFFF" stroke={S.ink} strokeWidth="3" />
            <path d="M3 14L17 6M3 30L17 22M3 46L17 38M3 62L17 54" stroke={S.pink} strokeWidth="4" />
        </svg>
    );
}
/** A customer's message bubble. */
export function Bubble({ text, who, w = 600 }: { text: ReactNode; who: string; w?: number }) {
    return (
        <div data-ui="messages" style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <span style={{ width: 52, height: 52, flex: 'none', borderRadius: '50%', background: C.g200, fontFamily: UI, fontSize: 16, fontWeight: 600, color: C.g600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{who}</span>
            <span style={{ maxWidth: w, padding: '22px 28px', borderRadius: '28px 28px 28px 8px', background: '#FFFFFF', boxShadow: `0 20px 50px rgba(16,24,40,0.14), 0 0 0 1px ${C.g200}`, fontFamily: UI, fontSize: 34, fontWeight: 500, color: C.char, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{text}</span>
        </div>
    );
}
/** A round friendly number sticker. */
export function Sticker({ big, small }: { big: string; small: ReactNode }) {
    return (
        <div style={{ width: 380, display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ width: 120, height: 120, flex: 'none', borderRadius: '50%', background: '#FFFFFF', boxShadow: SOFT_SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', color: C.char }}>{big}</span>
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, color: C.char }}>{small}</span>
        </div>
    );
}
/** A phone (frame only); the screen is the child. */
export function Phone({ w = 380, h = 650, children }: { w?: number; h?: number; children: ReactNode }) {
    return (
        <div data-ui="website" style={{ width: w, height: h, boxSizing: 'border-box', padding: 12, borderRadius: 52, background: C.char, boxShadow: '0 30px 70px rgba(16,24,40,0.30)', fontFamily: UI, color: C.char }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 42, overflow: 'hidden', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>{children}</div>
        </div>
    );
}
/** A history badge (clock + text). */
export function Badge({ text, hero = false, dim = 0 }: { text: string; hero?: boolean; dim?: number }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 40, padding: '0 16px', borderRadius: 20, background: hero ? '#FFFFFF' : 'rgba(255,255,255,0.12)', color: hero ? C.char : C.ink, opacity: 1 - 0.5 * dim, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35)', fontSize: 19, fontWeight: 700, whiteSpace: 'nowrap' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{text}
        </span>
    );
}
export const CURSOR = (
    <svg width="44" height="52" viewBox="0 0 22 26" aria-hidden="true" style={{ display: 'block' }}><path d="M2 2L2 21L7.5 16L11 24L14.5 22.5L11 15L18 15Z" fill="#181D27" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);
