/* ACT B — beats 11–24. Three ideas with everyday metaphors: the note on the door (301), the
   address book (DNS), the ID card (HTTPS). Each idea is one object; the three objects become a
   progress rail that the walkthrough fills in. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { font, yt } from '../../brand/tokens';
import { BrowserCard, NotSecurePage, SkeletonPage } from '../../components/BrowserCard';
import { GlassCard } from '../../components/GlassCard';
import { IdCard } from '../../components/IdCard';
import { Padlock } from '../../components/Padlock';
import { RedirectLine } from '../../components/RedirectLine';
import { UrlPill } from '../../components/UrlPill';
import { Caption, Night, SAFE, Tag, W } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('ideas');

/** The three idea glyphs (outline → filled). */
export function IdeaGlyph({ kind, filled, size = 120, color = yt.ink }: { kind: 'note' | 'book' | 'id'; filled: number; size?: number; color?: string }) {
    const s = size, sw = 4;
    const fill = `rgba(32,167,149,${0.95 * filled})`;
    return (
        <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
            {kind === 'note' && (<>
                <rect x="22" y="14" width="56" height="72" rx="6" fill={fill} stroke={color} strokeWidth={sw} />
                <circle cx="50" cy="22" r="4" fill={color} />
                <path d="M34 42h32M34 54h32M34 66h20" stroke={filled > 0.5 ? '#0B1426' : color} strokeWidth={sw} strokeLinecap="round" />
            </>)}
            {kind === 'book' && (<>
                <path d="M18 20h30a6 6 0 0 1 6 6v58a8 8 0 0 0-8-6H18z" fill={fill} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
                <path d="M82 20H52a6 6 0 0 0-6 6v58a8 8 0 0 1 8-6h28z" fill={fill} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
                <path d="M26 36h14M26 48h14M60 36h14M60 48h14" stroke={filled > 0.5 ? '#0B1426' : color} strokeWidth={sw} strokeLinecap="round" />
            </>)}
            {kind === 'id' && (<>
                <rect x="12" y="24" width="76" height="52" rx="8" fill={fill} stroke={color} strokeWidth={sw} />
                <circle cx="32" cy="50" r="9" fill="none" stroke={filled > 0.5 ? '#0B1426' : color} strokeWidth={sw} />
                <path d="M50 42h26M50 54h18" stroke={filled > 0.5 ? '#0B1426' : color} strokeWidth={sw} strokeLinecap="round" />
            </>)}
        </svg>
    );
}

export function IdeasScene(p: RedirectDomainProps) {
    const t = useTime();
    // Beat 11: three outlines. They sit centre, then park top-right as a rail for the rest of the act.
    const slotsIn = easeOut(prog(t, L.at(11) + 0.3, L.at(11) + 1.0));
    const park = easeInOut(prog(t, L.at(12) - 0.4, L.at(12) + 0.3));
    const filled = (i: number) => easeOut(prog(t, L.at(24) + 0.3 + i * 0.35, L.at(24) + 0.8 + i * 0.35));

    const idea = (a: number, b: number) => t >= L.at(a) - 0.3 && t < L.at(b);

    return (
        <Night>
            {/* Rail of three ideas */}
            {(['note', 'book', 'id'] as const).map((k, i) => {
                const cx = lerp(W / 2 + (i - 1) * 300, W - SAFE.x - 60 - (2 - i) * 110, park);
                const cy = lerp(500, SAFE.top + 50, park);
                const size = lerp(140, 64, park);
                const on = (idea(12, 15) && i === 0) || (idea(15, 18) && i === 1) || (idea(18, 24) && i === 2);
                return (
                    <div key={k} style={{ position: 'absolute', left: cx - size / 2, top: cy - size / 2, ...fx(slotsIn, 0, (1 - slotsIn) * 20) }}>
                        <IdeaGlyph kind={k} filled={filled(i)} size={size} color={on || park < 1 ? yt.ink : yt.inkMute} />
                    </div>
                );
            })}
            <Caption t={t} from={L.at(11) + 0.2} until={L.at(12) - 0.4} y={700} size={48} color={yt.inkSoft}>Three ideas. Then we do it.</Caption>

            {/* IDEA ONE — the note on the door (beats 12–14) */}
            {idea(12, 15) && <NoteOnTheDoor t={t} p={p} />}
            {/* IDEA TWO — the address book (beats 15–17) */}
            {idea(15, 18) && <AddressBook t={t} p={p} />}
            {/* IDEA THREE — the ID card (beats 18–23) */}
            {idea(18, 24) && <IdCardIdea t={t} p={p} />}

            {/* Beat 24: recap */}
            <Caption t={t} from={L.at(24) + 0.2} until={L.end(24)} y={640} size={54} color={yt.ink} text="The note. The address book. The ID card.">
                The note. The address book. The ID card.
            </Caption>
        </Night>
    );
}

/* ---------- Idea one ---------- */
function House({ x, y, lit = 0, scale = 1, color = yt.inkSoft }: { x: number; y: number; lit?: number; scale?: number; color?: string }) {
    return (
        <svg width={260 * scale} height={240 * scale} viewBox="0 0 260 240" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
            <path d="M20 120 L130 30 L240 120" fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" />
            <rect x="45" y="118" width="170" height="110" rx="6" fill="rgba(255,255,255,.04)" stroke={color} strokeWidth="6" />
            <rect x="112" y="160" width="36" height="68" rx="4" fill={color} opacity={0.9} />
            <rect x="160" y="140" width="34" height="34" rx="4" fill={`rgba(229,148,38,${lit})`} stroke={color} strokeWidth="4" />
            <rect x="66" y="140" width="34" height="34" rx="4" fill="none" stroke={color} strokeWidth="4" />
        </svg>
    );
}

function NoteOnTheDoor({ t, p }: { t: number; p: RedirectDomainProps }) {
    const oldX = 300, newX = 1340, y = 330;
    const inK = easeOut(prog(t, L.at(12), L.at(12) + 0.6));
    const noteK = easeOut(prog(t, L.at(12) + 1.4, L.at(12) + 1.9));
    const visitor = easeInOut(prog(t, L.at(13) + 1.0, L.at(13) + 2.2));          // walks to the door
    const bend = easeInOut(prog(t, L.at(13) + 4.6, L.at(13) + 6.2));             // path bends to the new house
    const lit = easeOut(prog(t, L.at(13) + 6.0, L.at(13) + 6.6));
    const morph = easeInOut(prog(t, L.word(14, '301') - 0.7, L.word(14, '301')));      // note → 301 card, on the word
    const google = easeOut(prog(t, L.word(14, 'Google') - 0.1, L.word(14, 'Google') + 0.5));
    const vx = lerp(140, oldX + 130, visitor);
    return (
        <>
            <Tag t={t} from={L.at(12)} until={L.at(15) - 0.3}>IDEA ONE · THE NOTE ON THE DOOR</Tag>
            <div style={{ ...fx(inK * (1 - morph * 0.85)) }}>
                <House x={oldX} y={y} />
                <House x={newX} y={y} lit={lit} color={lit > 0.5 ? yt.ink : yt.inkSoft} />
                <div style={{ position: 'absolute', left: oldX + 50, top: y + 250 }}><UrlPill url={p.oldDomain} dot="grey" size={28} /></div>
                <div style={{ position: 'absolute', left: newX + 50, top: y + 250 }}><UrlPill url={p.newDomain} dot={lit > 0.5 ? 'teal' : 'none'} size={28} /></div>
                {/* The visitor: a dot that walks to the door, then follows the note's path */}
                <div style={{ position: 'absolute', left: vx - 10, top: y + 215, width: 20, height: 20, borderRadius: 10, background: '#fff', boxShadow: '0 0 20px rgba(255,255,255,.6)', opacity: visitor > 0 ? 1 - bend : 0 }} />
                <RedirectLine from={[oldX + 130, y + 190]} to={[newX + 177, y + 157]} progress={bend} color={yt.teal} bend={-0.22} traffic={bend >= 1 ? 2 : 0} t={t} />
            </div>
            <div style={{ ...fx(inK) }}>
                {/* The note, pinned to the door, morphing into the 301 card */}
                <div style={{ position: 'absolute', left: lerp(oldX + 96, W / 2 - 230, morph), top: lerp(y + 150, 300, morph), width: lerp(70, 460, morph), height: lerp(90, 300, morph), borderRadius: lerp(6, 28, morph), background: '#FFF4D6', boxShadow: '0 30px 80px rgba(0,0,0,.45)', ...fx(noteK, 0, (1 - noteK) * -20), overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, padding: lerp(8, 40, morph), fontFamily: font.display, color: '#3B3A36', opacity: 1 - morph }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>We moved.</div>
                        <div style={{ fontSize: 9, marginTop: 4, lineHeight: 1.3 }}>New address →<br />{p.newDomain}</div>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, padding: 40, fontFamily: font.display, color: '#3B3A36', opacity: morph }}>
                        <div style={{ fontFamily: font.mono, fontSize: 96, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1 }}>301</div>
                        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14 }}>Moved permanently.</div>
                        <div style={{ fontSize: 22, marginTop: 10, color: '#6B675F' }}>New address: <span style={{ fontFamily: font.mono }}>{p.newDomain}</span></div>
                    </div>
                </div>
                {/* Beat 14: a browser icon follows the card; Google ticks the box */}
                <div style={{ position: 'absolute', left: W / 2 + 270, top: 330, display: 'flex', flexDirection: 'column', gap: 30, ...fx(morph) }}>
                    <GlassCard padding={24} style={{ width: 380 }}>
                        <div style={{ fontSize: 22, color: yt.inkSoft }}>Browsers</div>
                        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>follow it instantly</div>
                    </GlassCard>
                    <GlassCard padding={24} style={{ width: 380, ...fx(google) }}>
                        <div style={{ fontSize: 22, color: yt.inkSoft }}>Google</div>
                        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={yt.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                            updates its records
                        </div>
                    </GlassCard>
                </div>
            </div>
            <Caption t={t} from={L.at(13) + 4.2} until={L.at(14) - 0.2} y={760} size={44}>The right room, not just the front door.</Caption>
        </>
    );
}

/* ---------- Idea two ---------- */
function AddressBook({ t, p }: { t: number; p: RedirectDomainProps }) {
    const open = easeInOut(prog(t, L.at(15) + 0.6, L.at(15) + 1.6));
    const lookup = easeOut(prog(t, L.word(16, 'looks'), L.word(16, 'looks') + 0.6));
    const label = easeOut(prog(t, L.word(16, 'Those') - 0.1, L.word(16, 'Those') + 0.4));
    const swap = easeInOut(prog(t, L.word(17, 'changing') - 0.2, L.word(17, 'changing') + 0.6));
    const dispenser = easeOut(prog(t, L.word(17, 'hands') - 0.2, L.word(17, 'hands') + 0.5));
    const x = (W - 1100) / 2, y = 250;
    return (
        <>
            <Tag t={t} from={L.at(15)} until={L.at(18) - 0.3}>IDEA TWO · THE ADDRESS BOOK</Tag>
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
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, height: 86, borderBottom: '1px solid #E6DFD1', opacity: i === 1 ? 1 : 0.35 }}>
                            <div style={{ fontFamily: font.mono, fontSize: i === 1 ? 28 : 22, fontWeight: i === 1 ? 700 : 500, width: 250 }}>{i === 1 ? p.oldDomain : ['acme.org', '', 'example.net', 'shop.co'][i]}</div>
                            <div style={{ fontFamily: font.mono, fontSize: 22, color: '#6B675F', position: 'relative', height: 30 }}>
                                {i === 1 ? (<>
                                    <span style={{ position: 'absolute', left: 0, opacity: (1 - swap) * lookup, background: `rgba(32,167,149,${0.18 * lookup * (1 - swap)})`, borderRadius: 6, padding: '2px 8px' }}>203.0.113.42</span>
                                    <span style={{ position: 'absolute', left: 0, opacity: swap, color: '#138373', fontWeight: 700, background: 'rgba(32,167,149,.18)', borderRadius: 6, padding: '2px 8px' }}>{p.records[0].value}</span>
                                </>) : ['198.51.100.7', '', '192.0.2.88', '203.0.113.9'][i]}
                            </div>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', right: 44, top: 150, fontSize: 20, fontWeight: 700, letterSpacing: '.12em', color: yt.teal, ...fx(label, 0, (1 - label) * 10) }}>← A RECORD</div>
                </div>
            </div>
            {/* The number now leads to a note dispenser (the redirect server) */}
            <div style={{ position: 'absolute', left: x + 1100 + 60, top: 330, ...fx(dispenser, (1 - dispenser) * 30, 0) }}>
                <GlassCard padding={28} style={{ width: 300 }}>
                    <div style={{ fontSize: 20, color: yt.inkSoft }}>Points at</div>
                    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, lineHeight: 1.15 }}>something that hands out the note</div>
                    <div style={{ marginTop: 18, display: 'inline-block', fontFamily: font.mono, fontSize: 26, fontWeight: 700, color: '#3B3A36', background: '#FFF4D6', padding: '6px 14px', borderRadius: 10 }}>301</div>
                </GlassCard>
            </div>
            <Caption t={t} from={L.word(16, 'Those') - 0.1} until={L.at(17) + 0.8} y={830} size={40}>The entries are called records.</Caption>
        </>
    );
}

/* ---------- Idea three ---------- */
function IdCardIdea({ t, p }: { t: number; p: RedirectDomainProps }) {
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
            <Tag t={t} from={L.at(18)} until={L.at(24) - 0.3}>IDEA THREE · THE ID CARD</Tag>
            {show && (
                <>
                    {/* The padlock from a browser bar grows and morphs into the ID card */}
                    <div style={{ position: 'absolute', left: W / 2 - 110 - morph * 500, top: 330, ...fx(1 - morph * 0.0, 0, 0) }}>
                        <Padlock size={lerp(220, 140, morph)} color={yt.teal} />
                    </div>
                    <div style={{ position: 'absolute', left: W / 2 - cardW / 2 + 140, top: 300 }}>
                        <IdCard domain={p.oldDomain.replace(p.oldDomain, p.newDomain)} valid width={cardW} k={morph} />
                    </div>
                    <div style={{ position: 'absolute', left: W / 2 - 400, top: 700, display: 'flex', alignItems: 'center', gap: 20, fontFamily: font.mono, fontSize: 40, color: yt.inkSoft, ...fx(handshake) }}>
                        <span style={{ color: yt.teal, fontWeight: 700 }}>https://</span>{p.newDomain}
                        <span style={{ fontFamily: font.display, fontSize: 28, color: yt.inkMute, marginLeft: 20 }}>ID shown → padlock closes</span>
                    </div>
                </>
            )}
            {missing && (
                <div style={{ position: 'absolute', left: (W - 1000) / 2, top: 300 }}>
                    <BrowserCard address={p.oldDomain} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage /></BrowserCard>
                    <div style={{ position: 'absolute', right: -40, top: -40, transform: 'rotate(8deg)' }}><IdCard domain={p.oldDomain} valid={false} width={300} /></div>
                </div>
            )}
            {seq && <IdBeforeNote t={t - L.at(21)} p={p} />}
            {chrome && (
                <div style={{ position: 'absolute', left: (W - 1000) / 2, top: 300, ...fx(easeOut(prog(t, L.at(22), L.at(22) + 0.4))) }}>
                    <BrowserCard address={`http://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={460}><NotSecurePage /></BrowserCard>
                    <div style={{ position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', fontSize: 26, color: yt.inkMute }}>Chrome · “Always use secure connections”, rolling out as the default for public sites</div>
                </div>
            )}
            {fair && <FairToRegistrars t={t - L.at(23)} p={p} />}
        </>
    );
}

function IdBeforeNote({ t, p }: { t: number; p: RedirectDomainProps }) {
    const steps = ['Browser arrives', 'Checks the ID card', 'Reads the note', 'New home'];
    const k = (i: number) => easeOut(prog(t, 1.2 + i * 1.3, 1.7 + i * 1.3));
    return (
        <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
            {steps.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                    <GlassCard padding={28} accent={i === 1 ? yt.teal : undefined} style={{ width: 330, ...fx(k(i), 0, (1 - k(i)) * 20) }}>
                        <div style={{ fontSize: 20, color: yt.inkSoft, letterSpacing: '.1em', fontWeight: 700 }}>{i + 1}</div>
                        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, lineHeight: 1.15 }}>{s}</div>
                        <div style={{ fontSize: 22, color: yt.inkMute, marginTop: 10, fontFamily: i === 0 || i === 3 ? font.mono : font.display }}>{i === 0 ? p.oldDomain : i === 1 ? 'certificate' : i === 2 ? '301' : p.newDomain}</div>
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
