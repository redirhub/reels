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
                const k = easeOut(prog(t, from + 0.05 + i * 0.3, from + 0.5 + i * 0.3));
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
    const idea = (a: number, b: number) => t >= L.at(a) - 0.35 && t < L.at(b);   // each concept enters as the last one leaves
    return (
        <Night>
            <ConceptCards t={t} from={L.at(11) - 0.35} until={L.at(12)} ticks={false} />
            <Caption t={t} from={L.at(11) + 0.2} until={L.at(12) - 0.2} y={680} size={48} color={yt.inkSoft} text="Three concepts. Then we do it together.">Three concepts. Then we do it together.</Caption>

            {/* CONCEPT ONE — the 301 (beats 12–14) */}
            {idea(12, 15) && <ThreeOhOne t={t} p={p} />}
            {/* CONCEPT TWO — the address book (beats 15–17) */}
            {idea(15, 18) && <AddressBook t={t} p={p} />}
            {/* CONCEPT THREE — the ID card (beats 18–23) */}
            {idea(18, 24) && <IdCardIdea t={t} p={p} />}

            {/* Beat 24: recap — the same three cards, ticked */}
            <ConceptCards t={t} from={L.at(24) - 0.3} until={L.end(24) + 0.3} ticks />
        </Night>
    );
}

/* ---------- Concept one: the 301 ---------- */
function ThreeOhOne({ t, p }: { t: number; p: RedirectDomainProps }) {
    const y = 540;
    const oldX = 260, newX = 1340;
    const pills = easeOut(prog(t, L.at(12) - 0.02, L.at(12) + 0.45));
    const ticket = easeOut(prog(t, L.word(12, '301') - 0.2, L.word(12, '301') + 0.35));   // on the word "301"
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
    const bookIn = easeOut(prog(t, L.at(15) - 0.02, L.at(15) + 0.4));
    const open = easeInOut(prog(t, L.at(15) + 0.6, L.at(15) + 1.6));
    const lookup = easeOut(prog(t, L.word(16, 'looks'), L.word(16, 'looks') + 0.6));
    const label = easeOut(prog(t, L.word(16, 'Those') - 0.1, L.word(16, 'Those') + 0.4)) * (1 - easeOut(prog(t, L.word(17, 'changing') - 0.3, L.word(17, 'changing'))));
    const swap = easeInOut(prog(t, L.word(17, 'changing') - 0.2, L.word(17, 'changing') + 0.6));
    const dispenser = easeOut(prog(t, L.word(17, 'points') - 0.2, L.word(17, 'points') + 0.4));
    const out = easeInOut(prog(t, L.at(18) - 0.45, L.at(18) - 0.05));   // the book is gone before concept three starts
    const x = lerp((W - 1100) / 2, 150, dispenser), y = 250;
    return (
        <div style={{ position: 'absolute', inset: 0, ...fx(bookIn * (1 - out), 0, (1 - bookIn) * 16) }}>
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
                            <div style={{ fontFamily: font.mono, fontSize: i === 1 ? 28 : 22, fontWeight: i === 1 || (i === 2 && swap > 0.5) ? 700 : 500, width: 232 }}>{i === 1 ? p.oldDomain : ['acme.org', '', `www.${p.oldDomain}`, 'shop.co'][i]}</div>
                            <div style={{ fontFamily: font.mono, fontSize: 22, color: '#6B675F', position: 'relative', height: 30 }}>
                                {i === 1 ? (<>
                                    <span style={{ position: 'absolute', left: 0, opacity: (1 - swap) * lookup, background: `rgba(32,167,149,${0.18 * lookup * (1 - swap)})`, borderRadius: 6, padding: '2px 8px' }}>203.0.113.42</span>
                                    <span style={{ position: 'absolute', left: 0, opacity: swap, color: '#138373', fontWeight: 700, background: 'rgba(32,167,149,.18)', borderRadius: 6, padding: '2px 8px' }}>{p.records[0].value}</span>
                                </>) : i === 2 ? (<>
                                    <span style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap', opacity: 1 - swap }}>192.0.2.88</span>
                                    <span style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap', opacity: swap, color: '#138373', fontWeight: 700, fontSize: 17, background: 'rgba(32,167,149,.18)', borderRadius: 6, padding: '2px 8px' }}>{p.records[2].value}</span>
                                </>) : ['198.51.100.7', '', '', '203.0.113.9'][i]}
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
    const lockIn = easeOut(prog(t, L.at(18) - 0.05, L.at(18) + 0.45));   // only after the book has gone
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
                    {/* The padlock alone first; it shrinks away as the ID card (the certificate) takes its place. */}
                    <div style={{ position: 'absolute', left: W / 2 - 110, top: 330, ...fx(lockIn * (1 - morph), 0, (1 - lockIn) * 20, lerp(1, 0.6, morph)) }}>
                        <Padlock size={220} color={yt.teal} />
                    </div>
                    <div style={{ position: 'absolute', left: W / 2 - cardW / 2, top: 280, ...fx(morph, 0, (1 - morph) * 20, lerp(0.9, 1, morph)) }}>
                        <IdCard domain={p.newDomain} valid width={cardW} />
                    </div>
                    {/* What the certificate does, as she says it */}
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', gap: 28 }}>
                        {([['proves', 'Proves who the site is'], ['keeps', 'Keeps the connection private']] as const).map(([w, label]) => {
                            const k = easeOut(prog(t, L.word(19, w) - 0.15, L.word(19, w) + 0.3));
                            return (
                                <div key={w} style={{ ...fx(k * handshake, 0, (1 - k) * 14) }}>
                                    <GlassCard padding={24} style={{ width: 470 }} accent={yt.teal}>
                                        <div style={{ fontSize: 32, fontWeight: 700, marginLeft: 14 }}>{label}</div>
                                    </GlassCard>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            {missing && (
                <>
                    {/* No certificate: an empty, dashed ID slot, not a card. */}
                    <div style={{ position: 'absolute', left: SAFE.x + 40, top: 360, width: 420, height: 270, borderRadius: 22, border: `3px dashed ${yt.signalRed}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.12em', color: yt.signalRed }}>NO CERTIFICATE</div>
                        <div style={{ fontFamily: font.mono, fontSize: 32, marginTop: 14 }}>{p.oldDomain}</div>
                        <div style={{ fontSize: 24, color: yt.inkSoft, marginTop: 12 }}>No ID card to show</div>
                    </div>
                    <div style={{ position: 'absolute', left: 700, top: 300 }}>
                        <BrowserCard address={`https://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage kind="nocert" /></BrowserCard>
                    </div>
                </>
            )}
            {seq && <IdBeforeNote t={t - L.at(21)} p={p} />}
            {chrome && (
                <div style={{ position: 'absolute', left: (W - 1000) / 2, top: 300, ...fx(easeOut(prog(t, L.at(22), L.at(22) + 0.4))) }}>
                    <BrowserCard address={`http://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage /></BrowserCard>
                    <div style={{ position: 'absolute', left: -300, right: -300, top: 500, textAlign: 'center', fontSize: 32, color: yt.inkSoft }}>Chrome · “Always use secure connections”, rolling out as the default for public sites</div>
                </div>
            )}
            {fair && <FairToRegistrars t={t - L.at(23)} p={p} />}
        </>
    );
}

function IdBeforeNote({ t, p }: { t: number; p: RedirectDomainProps }) {
    const steps = ['Browser arrives', 'Checks the ID card', 'Reads the note', 'New site'];
    // Local to beat 21: each step lands on its words ("old domain", "ID card", "checks the ID", "reads the note").
    const at = [L.at(21) + 0.35, L.word(21, 'card,'), L.word(21, 'checks'), L.word(21, 'reads')].map((w) => w - L.at(21) - 0.15);   // first card on "Here's the catch": no empty frame
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
    // t is local to beat 23. The two outcomes enter on "some do" / "some don't" and answer on "Padlock?" / "Warning?".
    const w = (x: string) => L.word(23, x) - L.at(23);
    const a = easeOut(prog(t, 0.1, 0.6)), b = easeOut(prog(t, w("doesn't") - 0.3, w("doesn't") + 0.2));
    const check = easeOut(prog(t, w("Here's") - 0.1, w("Here's") + 0.4));
    const pulse = (at: number) => 1 + 0.08 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - at) / 0.6)));
    const lockOn = pulse(w('Padlock') - 0.05), warnOn = pulse(w('Warning') - 0.05);
    const card = (k: number, s: number, label: string, ok: boolean) => (
        <div style={{ ...fx(k, 0, (1 - k) * 20, s) }}>
            <GlassCard padding={40} style={{ width: 760 }} accent={ok ? yt.teal : yt.signalRed}>
                <div style={{ fontSize: 26, color: yt.inkSoft, fontWeight: 700, letterSpacing: '.12em', marginLeft: 14 }}>{label}</div>
                <div style={{ marginTop: 22, marginLeft: 14, display: 'flex', alignItems: 'center', gap: 20 }}>
                    {ok ? <Padlock size={56} color={yt.teal} /> : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={yt.signalRed} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18.5v.5" /></svg>}
                    <span style={{ fontFamily: font.mono, fontSize: 40 }}>https://{p.oldDomain}</span>
                </div>
                <div style={{ marginTop: 18, marginLeft: 14, fontSize: 28, color: ok ? yt.teal : yt.signalRed, fontWeight: 700 }}>{ok ? 'Forwarding with its own certificate' : 'No certificate: a warning'}</div>
            </GlassCard>
        </div>
    );
    return (
        <>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 50 }}>
                {card(a, lockOn, 'SOME DO', true)}
                {card(b, warnOn, 'SOME DON’T', false)}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontSize: 46, fontWeight: 700, letterSpacing: '-.03em', ...fx(check, 0, (1 - check) * 16) }}>
                Here’s how to check: <span style={{ fontFamily: font.mono, color: yt.teal, fontWeight: 500 }}>https://</span> in front. Padlock, or warning?
            </div>
        </>
    );
}
