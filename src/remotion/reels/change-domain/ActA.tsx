/* Act A · Meet Frosty Fusion: w44-Shop (beats 1–2), w44-Search (3–4), w44-SEO (5–8). */
import { clamp, easeInOut, easeOut, prog, useTime } from '../../lib/anim';
import { At, Browser, C, Eyebrow, Headline, Label, Pill, SOFT_SHADOW, SceneFade, fx, popIn, slideIn, smooth } from './kit';
import { BlogCard, Home, PageCard, ReviewCard, ScoopIcon, SearchPage, Sticker, StrawberryCard } from './shop';
import { NAMES } from './props';
import { local } from './timeline';

/* ---------------------------------------------------------------- Shop */
const L1 = local('shop');
/** Where the strawberry tile's icon sits on the Shop frame (composition px), measured from a still. */
export const SHOP_ICON = { x: 571, y: 563, size: 84 };
export function ShopScene() {
    const t = useTime();
    const site = easeOut(prog(t, 0, 0.9));
    const hot = L1.word(2, 'strawberry') - 0.1;
    return (
        <SceneFade t={t} room="light" inD={0.01}>
            <Eyebrow t={t} dark>MEET FROSTY FUSION</Eyebrow>
            <At x={120} y={200} style={fx(smooth(site * 1.5), 0, (1 - site) * 24, 0.985 + 0.015 * site)}>
                <Browser url={`https://${NAMES.old}`} w={1180} h={640} shadow={SOFT_SHADOW}><Home brand="fusion" hot={easeOut(prog(t, hot, hot + 0.5))} id="shop-home" /></Browser>
            </At>
            <At x={1400} y={250} style={popIn(t, L1.word(2, 'five') - 0.05)}><Sticker big="5" small={<>years of<br />scooping</>} /></At>
            <At x={1400} y={440} style={popIn(t, L1.word(2, 'forty') - 0.05)}><Sticker big="40" small="flavors" /></At>
            <At x={1400} y={630} style={popIn(t, L1.word(2, 'one') - 0.05)}><Sticker big="1" small={<>famous<br />strawberry</>} /></At>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Search */
const L2 = local('search');
/** The search page sits at (320, 170); the first result's card at (450, 362) with its icon at (510, 416). */
export const SEARCH = { x: 320, y: 170, cardX: 450, cardY: 362, icon: { x: 510, y: 416, size: 56 } };
const SLOT_DROP = 232; // two skeleton results: the card waits under them, then swaps to the top
export function SearchScene() {
    const t = useTime();
    // The strawberry icon flies from the homepage tile into the search card (shared element).
    const fly = easeInOut(prog(t, 0, 0.75));
    const from = SHOP_ICON, to = SEARCH.icon;
    const rise = easeInOut(prog(t, L2.word(4, 'there') - 0.15, L2.word(4, 'there') + 0.6));
    const typed = prog(t, L2.word(3, 'best') - 0.05, L2.wordEnd(3, 'cream'));
    const cardIn = smooth(prog(t, 0.2, 0.6));
    const flyCarry = fly < 1 && (
        <div style={{ position: 'absolute', left: 0, top: 0, ...fx(1 - smooth(prog(t, 0.68, 0.78)), from.x + (to.x - from.x) * fly - from.size / 2, from.y + (to.y - from.y + SLOT_DROP) * fly - from.size / 2 - Math.sin(fly * Math.PI) * 90, 1 + (to.size / from.size - 1) * fly) }}>
            <ScoopIcon size={from.size} bg="#FFFFFF" />
        </div>
    );
    return (
        <SceneFade t={t} room="light" carry={flyCarry}>
            <Eyebrow t={t} a={0.2} dark>A SEARCH NEAR THE SHOP</Eyebrow>
            <At x={SEARCH.x} y={SEARCH.y} style={slideIn(t, 0, 0.5, 0, 20)}>
                <SearchPage typed={typed} caret={typed > 0 && typed < 1} slot={
                    <>
                        <div style={{ position: 'absolute', left: 0, top: 0, ...fx(cardIn, 0, SLOT_DROP * (1 - rise)), zIndex: 2 }}>
                            <StrawberryCard w={1040} rank="1" rankK={prog(t, L2.word(4, 'there') + 0.3, L2.word(4, 'there') + 0.7)} iconK={smooth(prog(t, 0.7, 0.8))} style={{ boxShadow: `0 ${24 + 20 * Math.sin(rise * Math.PI)}px ${60 + 30 * Math.sin(rise * Math.PI)}px rgba(16,24,40,${0.16 + 0.1 * Math.sin(rise * Math.PI)}), 0 0 0 1px ${C.g200}` }} />
                        </div>
                    </>
                } skeletonShift={-(201 + 6) * (1 - rise)} />
            </At>
            <div style={{ position: 'absolute', left: 120, right: 120, top: 884, textAlign: 'center', fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: C.char, ...slideIn(t, L2.word(4, 'right') - 0.1, 0.45, 0, 16) }}>Right at the top.</div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- SEO */
const L3 = local('seo');
function rope(x1: number, y1: number, x2: number, y2: number, bend = 0.45) {
    const mx = x1 + (x2 - x1) * bend;
    return `M${x1} ${y1} C${mx} ${y1} ${x2 - (x2 - x1) * bend} ${y2} ${x2} ${y2}`;
}
export function SeoScene() {
    const t = useTime();
    // The strawberry card docks into the address pill (shared element across the cut).
    const dock = easeInOut(prog(t, 0, 0.7));
    const carry = dock < 1 && (
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: 'top left', ...fx(1 - smooth(prog(t, 0.45, 0.7)), SEARCH.cardX + (700 - SEARCH.cardX) * dock, SEARCH.cardY + (600 - SEARCH.cardY) * dock, 1 - 0.55 * dock) }}>
            {/* A copy over the original: its shadow fades in, or two shadows stack for a frame (measured). */}
            <StrawberryCard w={1040} rank="1" style={{ boxShadow: `0 24px 60px rgba(16,24,40,${(0.16 * clamp(dock * 3)).toFixed(3)}), 0 0 0 1px ${C.g200}` }} />
        </div>
    );
    const pill = popIn(t, 0.45, 0.45);
    const pages = L3.word(7, 'pages'), blogs = L3.word(7, 'food'), reviews = L3.word(7, 'reviews');
    const ropeK = (a: number) => easeInOut(prog(t, a, a + 0.6));
    const tied = L3.word(8, 'tied') - 0.1;
    const glow = easeOut(prog(t, tied, tied + 0.5));
    const pageRows: readonly [string, boolean][] = [['/', false], ['/flavors', false], [NAMES.path, true]];
    return (
        <SceneFade t={t} room="glow" carry={carry}>
            <Eyebrow t={t} a={0.3}>WHAT HOLDS THE SPOT</Eyebrow>
            <Headline size={64}>
                <span style={{ display: 'inline-block', ...popIn(t, L3.word(5, 'seo') - 0.05, 0.4) }}>SEO:</span>{' '}
                <span style={{ display: 'inline-block', ...slideIn(t, L3.word(6, 'google') - 0.1, 0.5, 0, 16) }}>what makes Google pick your page.</span>
            </Headline>
            <span style={{ position: 'absolute', left: 122, top: 252, fontSize: 26, fontWeight: 600, color: C.soft, ...slideIn(t, L3.word(6, 'search') - 0.05, 0.45, 0, 10), opacity: (slideIn(t, L3.word(6, 'search') - 0.05, 0.45, 0, 10).opacity as number) * (1 - smooth(prog(t, pages - 0.6, pages - 0.2))) }}>Search engine optimization</span>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                {[0, 1, 2].map((i) => <g key={i}><path d={rope(640, 458 + i * 120, 700, 640)} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ropeK(pages + 0.15 + i * 0.12)} /><circle cx={640} cy={458 + i * 120} r={6 * ropeK(pages + 0.15 + i * 0.12)} fill="rgba(255,255,255,0.55)" /></g>)}
                {[480, 720, 850].map((y, i) => {
                    const a = i === 0 ? blogs + 0.15 : reviews + 0.15 + (i - 1) * 0.25;
                    return <g key={y}><path d={rope(1360, y, 1240, 640)} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ropeK(a)} /><circle cx={1360} cy={y} r={6 * ropeK(a)} fill="rgba(255,255,255,0.55)" /></g>;
                })}
            </svg>
            <Label x={120} y={380} style={slideIn(t, pages - 0.1, 0.4, -10, 0)}>PAGES</Label>
            {pageRows.map(([p, h], i) => <At key={p} x={120} y={420 + i * 120} style={slideIn(t, pages + i * 0.12, 0.45, -24, 0)}><PageCard path={p} w={520} hero={h} /></At>)}
            <Label x={1360} y={300} style={slideIn(t, blogs - 0.1, 0.4, 10, 0)}>FOOD BLOGS</Label>
            <At x={1360} y={334} style={slideIn(t, blogs, 0.45, 24, 0)}><BlogCard title="Where to find the best strawberry scoop in town" w={440} /></At>
            <Label x={1360} y={610} style={slideIn(t, reviews - 0.1, 0.4, 10, 0)}>REVIEWS</Label>
            <At x={1360} y={644} style={slideIn(t, reviews, 0.45, 24, 0)}><ReviewCard quote="The strawberry at Frosty Fusion is worth the drive." w={440} /></At>
            <At x={1360} y={790} style={slideIn(t, reviews + 0.25, 0.45, 24, 0)}><ReviewCard quote="Five stars for Frosty Fusion. That strawberry!" who="a first-timer" w={440} /></At>
            <At x={700} y={600} style={pill}><Pill size={32} ring={glow > 0 ? `rgba(255,255,255,${0.35 * glow})` : undefined}>{NAMES.old}</Pill></At>
            <At x={700} y={526} style={{ ...popIn(t, L3.word(7, 'five') - 0.05, 0.4), opacity: (popIn(t, L3.word(7, 'five') - 0.05, 0.4).opacity as number) * (1 - smooth(prog(t, tied, tied + 0.3))) }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 16px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35)', fontSize: 19, fontWeight: 700, color: C.ink }}>Five years of it</span>
            </At>
            <div style={{ position: 'absolute', left: 700, top: 694, width: 540, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: C.soft, ...slideIn(t, tied, 0.45, 0, 12) }}>All tied to one address.</div>
        </SceneFade>
    );
}
