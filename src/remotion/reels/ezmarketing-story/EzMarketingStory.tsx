/* "EZMarketing" customer story, 9:16, text-only cut. Twelve beats, one idea per screen: an old
   Careers link still gets clicked → it lands on a homepage → the agency's handover → the client's
   question → why forwarding can't → three redirects in RedirHub → the result → the same tap, now
   landing on Jobs → end card. One continuous stage: shared elements (the URL pill, the checklist,
   the browser card) carry across beats instead of cutting. Every time comes from timeline.ts. */
import { AbsoluteFill } from 'remotion';
import { RedirHubIcon, RedirHubLogo } from '../../brand/Logo';
import { font, yt } from '../../brand/tokens';
import { BrowserCard, SkeletonPage } from '../../components/BrowserCard';
import { ChecklistBadge } from '../../components/ChecklistBadge';
import { GlassCard } from '../../components/GlassCard';
import { Grain } from '../../components/Grain';
import { LinksPage, ROW_GEOM, type RowData } from '../../components/LinksList';
import { NIGHT_BG } from '../../components/FixedEndCard';
import { UrlPill } from '../../components/UrlPill';
import { easeBack, easeInOut, easeOut, lerp, prog, useTime } from '../../lib/anim';
import { Bubble, Caption, Card, Check, Line, SAFE, Tap, assertHold, env, f, smooth, type Pt } from './kit';
import { CARDS, type EzMarketingProps } from './props';
import { CAPTIONS, beat, chipWindow, word } from './timeline';

const B = (n: number) => beat(n);
/** A group that spans beats a..b: in just before a starts, out just after b ends (crossfades overlap). */
const span = (t: number, a: number, b: number) => env(t, B(a)[0] - 0.2, B(b)[1] + 0.2, 0.4, 0.4);

/* ---------------------------------------------------------------- beats 1–2 and 10–11: the tap */
/** Where the pill sits in beat 1 (alone, centre) and in the shared shot of beats 2 and 10. */
const PILL_SOLO = 860, PILL_TOP = 600;
const CARD_BOX = { x: 110, y: 770, w: 860, h: 470 };

/** Beats 2 and 10 are the same composition (the callback): the pill on top, the line, the browser
    card below. `fixed` swaps only what the redirect changes: the line, the address, the page, the dot. */
function TapShot({ t, p, fixed, landK, lineK, pillY, scale = 1, pillDot }: {
    t: number; p: EzMarketingProps; fixed: boolean; landK: number; lineK: number; pillY: number; scale?: number; pillDot: 'none' | 'teal';
}) {
    const careers = `${p.oldDomain}${p.paths.careers}`;
    return (
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '540px 900px', ...f(1, 0, 0, scale) }}>
            <Line id={fixed ? 'l10' : 'l2'} from={[540, pillY + 46]} to={[540, CARD_BOX.y - 6]} progress={lineK} kind={fixed ? 'redirect' : 'muted'} bend={0} />
            <div style={{ position: 'absolute', left: 0, width: 1080, top: 0, display: 'flex', justifyContent: 'center', ...f(1, 0, pillY - 42) }}>
                <UrlPill url={careers} dot={pillDot} size={44} />
            </div>
            <div style={{ position: 'absolute', left: CARD_BOX.x, top: CARD_BOX.y, ...f(smooth(landK * 1.6), 0, (1 - easeOut(landK)) * 140) }}>
                <BrowserCard address={fixed ? `${p.newDomain}${p.paths.jobs}` : p.newDomain} lock="secure" dot={fixed ? 'teal' : 'red'} width={CARD_BOX.w} height={CARD_BOX.h}>
                    <SkeletonPage title={fixed ? 'Jobs' : 'Welcome'} accent={fixed ? yt.teal : yt.blue} lines={fixed ? 5 : 3} />
                </BrowserCard>
            </div>
        </div>
    );
}

function Opening({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s1] = B(1), [s2] = B(2);
    const careersAt: Pt = [540, PILL_SOLO];
    const rise = easeInOut(prog(t, s2, s2 + 0.6)); // the pill moves up as the browser card arrives
    const pillY = lerp(PILL_SOLO, PILL_TOP, rise);
    const tap2 = s2 + 0.15;
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 1, 2) }}>
            <TapShot t={t} p={p} fixed={false} pillY={pillY} pillDot="none"
                lineK={easeInOut(prog(t, tap2 + 0.3, tap2 + 0.8))} landK={prog(t, tap2 + 0.55, tap2 + 1.15)} />
            {[0.5, 1.45, 2.4].map((d, i) => (
                <Tap key={i} t={t} when={s1 + d} at={careersAt} from={([[-80, 420], [1160, 1320], [1160, 380]] as const)[i]} />
            ))}
            <Tap t={t} when={tap2} at={[540, PILL_TOP]} from={[1160, 300]} />
        </div>
    );
}

function Callback({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s10] = B(10), [s11, e11] = B(11);
    const tap = s10 + 0.15; // the same tap as beat 2, at the same moment into its beat
    const pull = 1 - 0.03 * easeInOut(prog(t, s11, e11)); // beat 11: ~3% push-out
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 10, 11) }}>
            <TapShot t={t} p={p} fixed pillY={PILL_TOP} scale={pull} pillDot={t >= s11 + 0.2 ? 'teal' : 'none'}
                lineK={easeInOut(prog(t, tap + 0.3, tap + 0.8))} landK={prog(t, tap + 0.55, tap + 1.15)} />
            <Tap t={t} when={tap} at={[540, PILL_TOP]} from={[1160, 300]} />
        </div>
    );
}

/* ---------------------------------------------------------------- beat 3: the agency */
function Agency({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s3, e3] = B(3);
    assertHold(`${p.agency.name} ${p.agency.sub}`, s3 + 0.2, e3);
    const k = easeInOut(prog(t, s3 + 0.2, s3 + 0.9)); // mask reveal, left to right
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 3, 3) }}>
            <GlassCard style={{ position: 'absolute', left: SAFE.x + 30, width: SAFE.w - 60, top: 700, boxSizing: 'border-box', padding: '64px 60px', clipPath: `inset(0 ${(1 - k) * 100}% 0 0 round 28px)` }}>
                <div style={{ fontFamily: font.display, fontSize: 120, fontWeight: 800, letterSpacing: '-.04em', color: yt.ink, lineHeight: 1 }}>{p.agency.name}</div>
                <div style={{ fontFamily: font.display, fontSize: 46, fontWeight: 500, color: yt.inkSoft, marginTop: 26 }}>{p.agency.sub}</div>
            </GlassCard>
        </div>
    );
}

/* ---------------------------------------------------------------- beats 4–5: the handover, then the ask */
function Handover({ t }: { t: number }) {
    const [s5, e5] = B(5);
    const t1 = word(4, 'forwarded'), t2 = word(4, 'shut');
    const dim = easeInOut(prog(t, s5, s5 + 0.4));
    const pop = prog(t, s5 + 0.2, s5 + 0.65);
    assertHold(CARDS.ask, s5 + 0.2, e5);
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 4, 5) }}>
            <div style={{ position: 'absolute', left: SAFE.x + 30, top: 640, transformOrigin: '430px 200px', ...f(1 - 0.65 * dim, 0, 0, 1 - 0.04 * dim) }}>
                <GlassCard style={{ width: SAFE.w - 60, boxSizing: 'border-box', padding: '50px 56px' }}>
                    <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 700, letterSpacing: '.14em', color: yt.inkSoft, marginBottom: 40 }}>HANDOVER</div>
                    <ChecklistBadge k={easeOut(prog(t, t1, t1 + 0.45))} label="Domain forwarded" size={80} />
                    <div style={{ height: 34 }} />
                    <ChecklistBadge k={easeOut(prog(t, t2, t2 + 0.45))} label="Hosting closed" size={80} />
                </GlassCard>
            </div>
            <Bubble label="Client" style={{ left: SAFE.x + 60, top: 1000, transformOrigin: '0 100%', ...f(smooth(pop * 1.8) * (1 - smooth(prog(t, e5 - 0.3, e5))), 0, 0, lerp(0.85, 1, easeBack(pop))) }}>
                {CARDS.ask}
            </Bubble>
        </div>
    );
}

/* ---------------------------------------------------------------- beats 6–7: one page, then RedirHub */
/** Longest first, so each line leaves its pill's end and bows outward past the pills below. The
    domain itself is last: it stays put in beat 7. */
const SRC_Y = [600, 700, 800] as const;
const TARGET: Pt = [540, 1100];

function Fan({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s6, e6] = B(6), [s7] = B(7);
    const sources = [`${p.oldDomain}${p.paths.careers}`, `${p.oldDomain}${p.paths.contact}`, p.oldDomain];
    const ROOT = 2;
    const widths = sources.map((u) => 2 * Math.round(34 * 0.7) + u.length * 34 * 0.6); // JetBrains Mono: 0.6 em per glyph
    const lineAt = word(6, 'every');
    const others = 1 - smooth(prog(t, s7, s7 + 0.4)); // beat 7: only the domain pill stays
    const target = 1 - smooth(prog(t, s7, s7 + 0.4));
    // Beat 7: the DNS line from the domain pill to RedirHub.
    const dnsK = easeInOut(prog(t, word(7, 'pointed'), word(7, 'redirhub')));
    const mark = smooth(prog(t, word(7, 'redirhub') - 0.15, word(7, 'redirhub') + 0.25));
    const out7 = 1 - smooth(prog(t, LIST_AT() - 0.1, LIST_AT() + 0.15));
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: env(t, s6 - 0.2, LIST_AT() + 0.15, 0.4, 0.25) }}>
            {sources.map((_, i) => (
                <Line key={i} id={`fan${i}`} from={[SAFE.x + widths[i] + 14, SRC_Y[i]]} to={[TARGET[0] + (1 - i) * 60, TARGET[1] - 46]} bend={-0.32 + i * 0.1}
                    progress={easeInOut(prog(t, lineAt + i * 0.12, lineAt + 0.7 + i * 0.12))} kind="muted" opacity={others} width={5} />
            ))}
            {sources.map((u, i) => (
                <div key={u} style={{ position: 'absolute', left: SAFE.x, top: SRC_Y[i] - 32, ...f(i === ROOT ? out7 * smooth(prog(t, s6 + 0.1, s6 + 0.5)) : others * smooth(prog(t, s6 + 0.1 + i * 0.12, s6 + 0.5 + i * 0.12))) }}>
                    <UrlPill url={u} size={34} />
                </div>
            ))}
            <div style={{ position: 'absolute', left: 0, width: 1080, top: TARGET[1] - 42, display: 'flex', justifyContent: 'center', ...f(target * smooth(prog(t, lineAt + 0.5, lineAt + 0.9)), 0, 0) }}>
                <UrlPill url={p.newDomain} dot="red" size={44} />
            </div>
            <Line id="dns" from={[SAFE.x + widths[ROOT] + 14, SRC_Y[ROOT]]} to={[540 - 100, 1010]} progress={dnsK} bend={-0.3} opacity={out7} />
            <div style={{ position: 'absolute', left: 520, top: 850, fontFamily: font.mono, fontSize: 32, color: yt.inkSoft, ...f(smooth(dnsK * 3) * out7) }}>DNS</div>
            <div style={{ position: 'absolute', left: 540 - 95, top: 1010 - 95 + 40, width: 190, height: 190, borderRadius: 95, background: yt.glass, boxShadow: `inset 0 0 0 1px ${yt.glassLine}, 0 0 60px rgba(32,167,149,${0.25 * mark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...f(mark * out7, 0, 0, lerp(0.8, 1, easeBack(mark))) }}>
                <div style={{ height: 96 }}><RedirHubIcon variant="color" style={{ height: 96 }} /></div>
            </div>
        </div>
    );
}

/** Beat 7 cuts from the DNS line to the Links list as the reader reaches "set up". */
const LIST_AT = () => word(7, 'set') - 0.1;

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
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: env(t, at - 0.05, e7 + 0.2, 0.2, 0.4) }}>
            <div style={{ position: 'absolute', left: (1080 - W * S) / 2, top: 560, width: W * S, height: H * S, borderRadius: 32, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 120px rgba(0,0,0,.45)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${S})`, transformOrigin: 'top left' }}>
                    <LinksPage rows={rows} enter={enter} linkCount={3} />
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 8: three chips */
function Chips({ t }: { t: number }) {
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 8, 8) }}>
            {CARDS.chips.map((c, i) => {
                const [a, b] = chipWindow(i);
                assertHold(c, a, b);
                const last = i === CARDS.chips.length - 1;
                const inK = smooth(prog(t, a, a + 0.3)), outK = last ? 0 : smooth(prog(t, b - 0.05, b + 0.25));
                const label = c.replace(' ✓', '');
                return (
                    <div key={c} style={{ position: 'absolute', left: 0, width: 1080, top: 760, display: 'flex', justifyContent: 'center', ...f(inK * (1 - outK), 0, (1 - inK) * 40 - outK * 40, lerp(0.92, 1, easeBack(prog(t, a, a + 0.4)))) }}>
                        <GlassCard padding={0} style={{ padding: '54px 74px', borderRadius: 40 }}>
                            <div style={{ fontFamily: font.display, fontSize: 116, fontWeight: 800, letterSpacing: '-.04em', color: yt.ink, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 26 }}>
                                {label}{c.endsWith('✓') && <Check size={104} k={easeOut(prog(t, a + 0.15, a + 0.55))} />}
                            </div>
                        </GlassCard>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------------------------------------------------------------- beat 9: the count */
function Count({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s9, e9] = B(9);
    assertHold(`${CARDS.visits} ${CARDS.visitsSub}`, s9 + 0.2, e9);
    const k = easeOut(prog(t, s9 + 0.3, s9 + 2.0));
    const n = Math.round(p.visits * k);
    return (
        <div style={{ position: 'absolute', inset: 0, opacity: span(t, 9, 9), textAlign: 'center', fontFamily: font.display }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 640, fontSize: 300, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1, color: yt.ink, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 950, fontSize: 96, fontWeight: 800, letterSpacing: '-.035em', color: yt.teal }}>visits</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1090, fontSize: 42, fontWeight: 500, color: yt.inkSoft }}>{CARDS.visitsSub}</div>
        </div>
    );
}

/* ---------------------------------------------------------------- beat 12: the end card */
function End({ t, p }: { t: number; p: EzMarketingProps }) {
    const [s] = B(12);
    const l1 = s + 0.1, l2 = l1 + 0.35 + 0.3; // "Old links." reveals, a 300 ms beat, "Fixed." lands
    const logo = smooth(prog(t, l2 + 0.3, l2 + 0.8));
    const r = (a: number) => f(smooth(prog(t, a, a + 0.35)), 0, (1 - easeOut(prog(t, a, a + 0.4))) * 30);
    return (
        <AbsoluteFill style={{ background: NIGHT_BG, textAlign: 'center', fontFamily: font.display, opacity: smooth(prog(t, s - 0.2, s + 0.15)) }}>
            <Grain />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 660, fontSize: 140, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.04 }}>
                <div style={{ color: yt.ink, ...r(l1) }}>{p.endLines[0]}</div>
                <div style={{ color: yt.teal, ...r(l2) }}>{p.endLines[1]}</div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', ...f(logo, 0, (1 - logo) * 16) }}>
                <div style={{ width: 460 }}><RedirHubLogo variant="white" /></div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1200, fontSize: 44, fontWeight: 600, color: yt.inkSoft, ...f(logo, 0, (1 - logo) * 16) }}>{p.endSub}</div>
        </AbsoluteFill>
    );
}

/* ---------------------------------------------------------------- the reel */
export function EzMarketingStory(props: EzMarketingProps) {
    const t = useTime();
    const c = (n: number, text: string, from = B(n)[0] + 0.2, until = B(n)[1]) => <Card t={t} from={from} until={until} text={text} />;
    return (
        <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: font.display }}>
            <Grain />
            <Opening t={t} p={props} />
            <Agency t={t} p={props} />
            <Handover t={t} />
            <Fan t={t} p={props} />
            <Links t={t} p={props} />
            <Chips t={t} />
            <Count t={t} p={props} />
            <Callback t={t} p={props} />

            {c(1, CARDS.clicked)}
            {c(2, CARDS.jobs, B(2)[0] + 0.5)}
            {c(4, CARDS.handover)}
            {c(6, CARDS.fan)}
            {c(7, CARDS.redirects, LIST_AT())}
            {c(10, CARDS.right)}
            {c(11, CARDS.still, B(11)[0] + 0.1)}

            {CAPTIONS.map((cap, i) => <Caption key={i} t={t} {...cap} />)}
            {t >= B(12)[0] - 0.2 && <End t={t} p={props} />}
        </AbsoluteFill>
    );
}
