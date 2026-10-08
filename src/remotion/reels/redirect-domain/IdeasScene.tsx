/* ACT B — beats 11–24. Three concepts, one object each: the 301 note, the address book (DNS),
   the ID card (HTTPS). Plain numbered cards introduce and recap them; no icon rail. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { font, yt } from '../../brand/tokens';
import { BrowserCard, NotSecurePage } from '../../components/BrowserCard';
import { GlassCard } from '../../components/GlassCard';
import { IdCard } from '../../components/IdCard';
import { Padlock } from '../../components/Padlock';
import { RedirectLine } from '../../components/RedirectLine';
import { UrlPill } from '../../components/UrlPill';
import { Caption, Night, SAFE, Tag, W } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('ideas');

const CONCEPTS = [
    { n: '01', title: 'The 301', sub: 'the note' },
    { n: '02', title: 'DNS', sub: 'the address book' },
    { n: '03', title: 'HTTPS', sub: 'the ID card' },
] as const;

/** The three concept cards: introduced on beat 11, recapped (ticked) on beat 24. */
function ConceptCards({ t, from, until, ticks }: { t: number; from: number; until: number; ticks: boolean }) {
    if (t < from || t >= until) return null;
    const out = easeInOut(prog(t, until - 0.4, until));
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 40 }}>
            {CONCEPTS.map((c, i) => {
                const k = easeOut(prog(t, from + 0.2 + i * 0.35, from + 0.7 + i * 0.35));
                const tick = ticks ? easeOut(prog(t, from + 0.8 + i * 0.45, from + 1.2 + i * 0.45)) : 0;
                return (
                    <div key={c.n} style={{ ...fx(k * (1 - out), 0, (1 - k) * 24) }}>
                        <GlassCard padding={40} style={{ width: 420, height: 230 }} accent={tick > 0.5 ? yt.teal : undefined}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: font.mono, fontSize: 30, color: yt.teal, fontWeight: 600 }}>{c.n}</span>
                                <span style={{ width: 44, height: 44, borderRadius: 22, background: yt.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', ...fx(tick, 0, 0, lerp(0.6, 1, tick)) }}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B1426" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                </span>
                            </div>
                            <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-.03em', marginTop: 22 }}>{c.title}</div>
                            <div style={{ fontSize: 30, color: yt.inkSoft, marginTop: 6 }}>{c.sub}</div>
                        </GlassCard>
                    </div>
                );
            })}
        </div>
    );
}

export function IdeasScene(p: RedirectDomainProps) {
    const t = useTime();
    const idea = (a: number, b: number) => t >= L.at(a) && t < L.at(b);
    return (
        <Night>
            <ConceptCards t={t} from={L.at(11)} until={L.at(12)} ticks={false} />
            <Caption t={t} from={L.at(11) + 0.2} until={L.at(12) - 0.2} y={680} size={48} color={yt.inkSoft} text="Three concepts. Then we do it together.">Three concepts. Then we do it together.</Caption>

            {/* CONCEPT ONE — the 301 (beats 12–14) */}
            {idea(12, 15) && <ThreeOhOne t={t} p={p} />}
            {/* CONCEPT TWO — the address book (beats 15–17) */}
            {idea(15, 18) && <AddressBook t={t} p={p} />}
            {/* CONCEPT THREE — the ID card (beats 18–23) */}
            {idea(18, 24) && <IdCardIdea t={t} p={p} />}

            {/* Beat 24: recap — the same three cards, ticked */}
            <ConceptCards t={t} from={L.at(24)} until={L.end(24)} ticks />
        </Night>
    );
}

/* ---------- Concept one: the 301 ---------- */
function ThreeOhOne({ t, p }: { t: number; p: RedirectDomainProps }) {
    const y = 540;
    const oldX = 260, newX = 1340;
    const pills = easeOut(prog(t, L.at(12) + 0.1, L.at(12) + 0.6));
    const ticket = easeOut(prog(t, L.word(13, 'note') - 0.2, L.word(13, 'note') + 0.35));
    const addr = easeOut(prog(t, L.word(13, 'plus') - 0.1, L.word(13, 'plus') + 0.4));
    const line = easeInOut(prog(t, L.word(14, 'Browsers') - 0.1, L.word(14, 'instantly')));
    const chipA = easeOut(prog(t, L.word(14, 'follow') - 0.1, L.word(14, 'follow') + 0.35));
    const chipB = easeOut(prog(t, L.word(14, 'Google') - 0.1, L.word(14, 'Google') + 0.35));
    const out = easeInOut(prog(t, L.at(15) - 0.4, L.at(15)));
    return (
        <div style={{ position: 'absolute', inset: 0, ...fx(1 - out) }}>
            <Tag t={t} from={L.at(12)} until={L.at(15) - 0.3}>CONCEPT ONE · THE 301 REDIRECT</Tag>
            <div style={{ position: 'absolute', left: oldX, top: y - 38, ...fx(pills, (1 - pills) * -20, 0) }}><UrlPill url={p.oldDomain} dot={line >= 1 ? 'teal' : 'grey'} size={40} /></div>
            <div style={{ position: 'absolute', left: newX, top: y - 38, ...fx(pills * lerp(0.45, 1, line), (1 - pills) * 20, 0) }}><UrlPill url={p.newDomain} dot={line >= 1 ? 'teal' : 'none'} size={40} /></div>
            <RedirectLine from={[oldX + 420, y]} to={[newX - 20, y]} progress={line} color={yt.teal} bend={0} traffic={line >= 1 ? 3 : 0} t={t} />
            {/* The ticket: the part of the idea people remember */}
            <div style={{ position: 'absolute', left: W / 2 - 200, top: y - 250, width: 400, ...fx(ticket, 0, (1 - ticket) * -30, lerp(0.92, 1, ticket)) }}>
                <div style={{ borderRadius: 22, background: '#FFF4D6', color: '#3B3A36', padding: '26px 32px', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }}>
                    <div style={{ fontFamily: font.mono, fontSize: 72, fontWeight: 700, lineHeight: 1 }}>301</div>
                    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>Moved permanently.</div>
                    <div style={{ fontSize: 24, marginTop: 10, color: '#6B675F', ...fx(lerp(0.25, 1, addr)) }}>New address: <b style={{ fontFamily: font.mono, color: '#3B3A36', background: `rgba(32,167,149,${0.22 * addr})`, borderRadius: 6, padding: '0 6px' }}>{p.newDomain}</b></div>
                </div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: y + 110, display: 'flex', justifyContent: 'center', gap: 30 }}>
                {([['Browsers', 'follow it instantly', chipA], ['Google', 'updates its records', chipB]] as const).map(([who, what, k]) => (
                    <div key={who} style={{ ...fx(k, 0, (1 - k) * 16) }}>
                        <GlassCard padding={26} style={{ width: 400 }} accent={yt.teal}>
                            <div style={{ fontSize: 24, color: yt.inkSoft, marginLeft: 14 }}>{who}</div>
                            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4, marginLeft: 14 }}>{what}</div>
                        </GlassCard>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Concept two: the address book ---------- */
function AddressBook({ t, p }: { t: number; p: RedirectDomainProps }) {
    const open = easeInOut(prog(t, L.at(15) + 0.6, L.at(15) + 1.6));
    const lookup = easeOut(prog(t, L.word(16, 'looks'), L.word(16, 'looks') + 0.6));
    const label = easeOut(prog(t, L.word(16, 'Those') - 0.1, L.word(16, 'Those') + 0.4)) * (1 - easeOut(prog(t, L.word(17, 'changing') - 0.3, L.word(17, 'changing'))));
    const swap = easeInOut(prog(t, L.word(17, 'changing') - 0.2, L.word(17, 'changing') + 0.6));
    const dispenser = easeOut(prog(t, L.word(17, 'points') - 0.2, L.word(17, 'points') + 0.4));
    const out = easeInOut(prog(t, L.at(18) - 0.45, L.at(18) - 0.05));   // the book is gone before concept three starts
    const x = lerp((W - 1100) / 2, 150, dispenser), y = 250;
    return (
        <div style={{ position: 'absolute', inset: 0, ...fx(1 - out) }}>
            <Tag t={t} from={L.at(15)} until={L.at(18) - 0.3}>CONCEPT TWO · THE ADDRESS BOOK</Tag>
            <div style={{ position: 'absolute', left: x, top: y, width: 1100, height: 520, perspective: 1600 }}>
                {/* Left page (cover opens) */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: 550, height: 520, borderRadius: '26px 6px 6px 26px', background: '#F4EFE6', transformOrigin: 'right center', transform: `rotateY(${(1 - open) * -170}deg)`, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: '#1E2A44', opacity: open < 0.5 ? 1 : 0 }} />
                    <div style={{ padding: 44, fontFamily: font.display, color: '#3B3A36', opacity: open > 0.5 ? 1 : 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: '#8A8478' }}>INTERNET · ADDRESS BOOK</div>
                        <div style={{ fontSize: 20, marginTop: 30, lineHeight: 1.6, color: '#6B675F' }}>Type a name,<br />get a number.</div>
                    </div>
                </div>
                {/* Right page: the entry */}
                <div style={{ position: 'absolute', left: 550, top: 0, width: 550, height: 520, borderRadius: '6px 26px 26px 6px', background: '#FBF7EF', boxShadow: '0 30px 80px rgba(0,0,0,.4)', padding: 44, fontFamily: font.display, color: '#3B3A36' }}>
                    {/* The entries are the records: highlighted together, with a small arrow, no label. */}
                    <div style={{ position: 'absolute', left: 30, right: 30, top: 38, height: 4 * 86 + 12, borderRadius: 14, background: `rgba(32,167,149,${0.13 * label})`, boxShadow: `inset 0 0 0 2px rgba(32,167,149,${0.55 * label})` }} />
                    <svg width="64" height="40" viewBox="0 0 64 40" style={{ position: 'absolute', left: -78, top: 44 + 86 * 1.5, ...fx(label, (1 - label) * -18, 0) }}>
                        <path d="M4 20h48M38 6l16 14-16 14" fill="none" stroke={yt.teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, height: 86, borderBottom: '1px solid #E6DFD1', opacity: i === 1 ? 1 : lerp(0.35, 0.8, label) }}>
                            <div style={{ fontFamily: font.mono, fontSize: i === 1 ? 28 : 22, fontWeight: i === 1 ? 700 : 500, width: 250 }}>{i === 1 ? p.oldDomain : ['acme.org', '', 'example.net', 'shop.co'][i]}</div>
                            <div style={{ fontFamily: font.mono, fontSize: 22, color: '#6B675F', position: 'relative', height: 30 }}>
                                {i === 1 ? (<>
                                    <span style={{ position: 'absolute', left: 0, opacity: (1 - swap) * lookup, background: `rgba(32,167,149,${0.18 * lookup * (1 - swap)})`, borderRadius: 6, padding: '2px 8px' }}>203.0.113.42</span>
                                    <span style={{ position: 'absolute', left: 0, opacity: swap, color: '#138373', fontWeight: 700, background: 'rgba(32,167,149,.18)', borderRadius: 6, padding: '2px 8px' }}>{p.records[0].value}</span>
                                </>) : ['198.51.100.7', '', '192.0.2.88', '203.0.113.9'][i]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* The changed record now points at something that hands out the note (the redirect server) */}
            <div style={{ position: 'absolute', left: 1330, top: 330, ...fx(dispenser, (1 - dispenser) * 30, 0) }}>
                <GlassCard padding={34} style={{ width: 440 }} accent={yt.teal}>
                    <div style={{ fontSize: 26, color: yt.inkSoft, marginLeft: 14 }}>The record now points at</div>
                    <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8, lineHeight: 1.18, marginLeft: 14 }}>something that hands out the note</div>
                    <div style={{ marginTop: 20, marginLeft: 14, display: 'inline-block', fontFamily: font.mono, fontSize: 32, fontWeight: 700, color: '#3B3A36', background: '#FFF4D6', padding: '6px 16px', borderRadius: 10 }}>301</div>
                </GlassCard>
            </div>
        </div>
    );
}

/* ---------- Concept three: the ID card ---------- */
function IdCardIdea({ t, p }: { t: number; p: RedirectDomainProps }) {
    const lockIn = easeOut(prog(t, L.at(18) + 0.15, L.at(18) + 0.65));   // only after the book has gone
    const morph = easeInOut(prog(t, L.at(18) + 0.9, L.at(18) + 1.9));
    const handshake = easeOut(prog(t, L.word(19, 'shows') - 0.3, L.word(19, 'shows') + 0.5));
    const missing = t >= L.at(20) && t < L.at(21);
    const seq = t >= L.at(21) && t < L.at(22);
    const chrome = t >= L.at(22) && t < L.at(23);
    const fair = t >= L.at(23);
    const show = !(missing || seq || chrome || fair);
    const cardW = 560;
    return (
        <>
            <Tag t={t} from={L.at(18)} until={L.at(24) - 0.3}>CONCEPT THREE · THE ID CARD</Tag>
            {show && (
                <>
                    {/* The padlock from a browser bar grows and morphs into the ID card */}
                    <div style={{ position: 'absolute', left: W / 2 - 110 - morph * 500, top: 330, ...fx(lockIn, 0, (1 - lockIn) * 20) }}>
                        <Padlock size={lerp(220, 140, morph)} color={yt.teal} />
                    </div>
                    <div style={{ position: 'absolute', left: W / 2 - cardW / 2 + 140, top: 300, ...fx(morph, (1 - morph) * -40, 0, lerp(0.92, 1, morph)) }}>
                        <IdCard domain={p.newDomain} valid width={cardW} />
                    </div>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26, ...fx(handshake) }}>
                        <span style={{ fontFamily: font.mono, fontSize: 44, color: yt.ink }}><span style={{ color: yt.teal, fontWeight: 700 }}>https://</span>{p.newDomain}</span>
                        <span style={{ fontSize: 34, color: yt.inkSoft }}>ID shown, padlock closes</span>
                    </div>
                </>
            )}
            {missing && (
                <>
                    <div style={{ position: 'absolute', left: SAFE.x + 40, top: 360 }}><IdCard domain={p.oldDomain} valid={false} width={420} /></div>
                    <div style={{ position: 'absolute', left: 700, top: 300 }}>
                        <BrowserCard address={`https://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage kind="nocert" /></BrowserCard>
                    </div>
                </>
            )}
            {seq && <IdBeforeNote t={t - L.at(21)} p={p} />}
            {chrome && (
                <div style={{ position: 'absolute', left: (W - 1000) / 2, top: 300, ...fx(easeOut(prog(t, L.at(22), L.at(22) + 0.4))) }}>
                    <BrowserCard address={`http://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage /></BrowserCard>
                    <div style={{ position: 'absolute', left: -300, right: -300, top: 500, textAlign: 'center', fontSize: 30, color: yt.inkSoft }}>Chrome · “Always use secure connections”, rolling out as the default for public sites</div>
                </div>
            )}
            {fair && <FairToRegistrars t={t - L.at(23)} p={p} />}
        </>
    );
}

function IdBeforeNote({ t, p }: { t: number; p: RedirectDomainProps }) {
    const steps = ['Browser arrives', 'Checks the ID card', 'Reads the note', 'New site'];
    // Local to beat 21: each step lands on its words ("old domain", "ID card", "checks the ID", "reads the note").
    const at = [L.word(21, 'old'), L.word(21, 'card,'), L.word(21, 'checks'), L.word(21, 'reads')].map((w) => w - L.at(21) - 0.15);
    const k = (i: number) => easeOut(prog(t, at[i], at[i] + 0.45));
    return (
        <div style={{ position: 'absolute', left: 40, right: 40, top: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {steps.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <GlassCard padding={30} accent={i === 1 ? yt.teal : undefined} style={{ width: 372, ...fx(k(i), 0, (1 - k(i)) * 20) }}>
                        <div style={{ fontSize: 24, color: yt.teal, letterSpacing: '.1em', fontWeight: 700, fontFamily: font.mono }}>{i + 1}</div>
                        <div style={{ fontSize: 31, fontWeight: 700, marginTop: 8, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{s}</div>
                        <div style={{ fontSize: 26, color: yt.inkSoft, marginTop: 10, fontFamily: i === 0 || i === 3 ? font.mono : font.display }}>{i === 0 ? p.oldDomain : i === 1 ? 'certificate' : i === 2 ? '301' : p.newDomain}</div>
                    </GlassCard>
                    {i < 3 && <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={yt.inkMute} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: k(i + 1) }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
                </div>
            ))}
        </div>
    );
}

function FairToRegistrars({ t, p }: { t: number; p: RedirectDomainProps }) {
    const a = easeOut(prog(t, 0.4, 0.9)), b = easeOut(prog(t, 2.4, 2.9));
    const check = easeOut(prog(t, 9.0, 9.5));
    return (
        <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 60 }}>
                <div style={{ ...fx(a, 0, (1 - a) * 20) }}>
                    <GlassCard padding={34} style={{ width: 720 }}>
                        <div style={{ fontSize: 22, color: yt.inkSoft, fontWeight: 700, letterSpacing: '.12em' }}>SOME DO</div>
                        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}><Padlock size={44} color={yt.teal} /><span style={{ fontFamily: font.mono, fontSize: 34 }}>https://{p.oldDomain}</span></div>
                    </GlassCard>
                </div>
                <div style={{ ...fx(b, 0, (1 - b) * 20) }}>
                    <GlassCard padding={34} style={{ width: 720 }}>
                        <div style={{ fontSize: 22, color: yt.inkSoft, fontWeight: 700, letterSpacing: '.12em' }}>SOME DON’T</div>
                        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16, color: yt.signalRed }}>
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={yt.signalRed} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18.5v.5" /></svg>
                            <span style={{ fontFamily: font.mono, fontSize: 34, color: yt.ink }}>https://{p.oldDomain}</span>
                        </div>
                    </GlassCard>
                </div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', ...fx(check, 0, (1 - check) * 16) }}>
                Here’s how to check: <span style={{ fontFamily: font.mono, color: yt.teal, fontWeight: 500 }}>https://</span> in front. Padlock, or warning?
            </div>
        </>
    );
}
