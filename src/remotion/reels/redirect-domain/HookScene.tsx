/* ACT A — beats 1–10. The move most people make, acted out in a registrar tab (buy, forwarding
   on, old address, new site), "It looks done.", then five concrete breakages one per screen,
   then the title. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { color, font, yt } from '../../brand/tokens';
import { Cursor } from '../../components/Cursor';
import { BrowserCard, NotFoundPage, NotSecurePage, SkeletonPage } from '../../components/BrowserCard';
import { OnScreenText } from '../../components/OnScreenText';
import { BrandedQr } from '../../components/QrCode';
import { Caption, DomainPill, Night, SAFE, W } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('hook');

export function HookScene(p: RedirectDomainProps) {
    const t = useTime();
    // Beats 1–3: the move most people make, acted out in a browser tab at a registrar:
    // search the new domain, buy it, switch on forwarding, type the old address, land on the new site.
    const cardIn = 1;   // the film opens on the filled tab, no fade from empty
    const settled = t >= L.at(3);
    // Beat 4: "a few weeks later" — the tab steps back and dims before the problems.
    const back = easeInOut(prog(t, L.at(4), L.at(4) + 0.45));
    const gone = easeInOut(prog(t, L.at(5) - 0.45, L.at(5) - 0.05));
    const problems = t >= L.at(5) && t < L.at(10);
    const anchorK = easeOut(prog(t, L.at(5) - 0.2, L.at(5) + 0.3));
    const titleK = easeOut(prog(t, L.at(10) + 0.7, L.at(10) + 1.3));   // no empty frame while she speaks
    const sweep = easeInOut(prog(t, L.at(10) + 0.2, L.at(10) + 0.8));

    return (
        <Night>
            {t < L.at(5) && (
                <div style={{ position: 'absolute', left: TAB.x, top: TAB.y, transformOrigin: 'center center', ...fx(cardIn * (1 - gone) * (1 - back), 0, (1 - cardIn) * 40, lerp(0.97, 1, cardIn) * (1 - back * 0.08)) }}>
                    <RegistrarTab t={t} p={p} settled={settled} />
                </div>
            )}
            <Caption t={t} from={L.word(3, 'Fair') - 0.1} until={L.end(3)} y={160} size={64} color={yt.ink} text="Fair enough. It looks done.">Fair enough. <span style={{ color: yt.teal }}>It looks done.</span></Caption>
            <Caption t={t} from={L.at(4) + 0.5} until={L.at(5) - 0.1} y={490} size={64} color={yt.ink} text="Weeks later…">Weeks later…</Caption>
            {t < L.at(5) + 0.1 && (
                <Cursor t={t} keys={[
                    [L.at(1), TAB.x + 900, TAB.y + 520],
                    [L.word(2, 'buy') - 0.5, TAB.x + 1090, TAB.y + 78 + 318],
                    [L.word(2, 'switch') - 0.1, TAB.x + 1090, TAB.y + 78 + 318],
                    [L.word(2, 'forwarding') + 0.1, TAB.x + 1128, TAB.y + 78 + 248],
                    [L.word(2, 'type') - 0.2, TAB.x + 1000, TAB.y + 300],
                ]} clicks={[L.word(2, 'buy') - 0.05, L.word(2, 'forwarding') + 0.2]} show={L.at(1) + 1.6} hide={L.word(2, 'type') - 0.2} />
            )}

            {/* Beats 5–9: one problem per screen, under the old address */}
            <DomainPill url={p.oldDomain} dot="red" x={SAFE.x} y={180} style={{ ...fx(anchorK * (problems ? 1 : 0) * (1 - sweep), 0, (1 - anchorK) * 12) }} />
            <Problem t={t} from={L.at(5)} until={L.at(6)} label="Not secure">
                <BrowserCard address={`https://${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={420}><NotSecurePage kind="nocert" /></BrowserCard>
            </Problem>
            <Problem t={t} from={L.at(6)} until={L.at(7)} label="Wrong page">
                <WrongPage t={t - L.at(6)} p={p} />
            </Problem>
            <Problem t={t} from={L.at(7)} until={L.at(8)} label="Gone">
                <BrowserCard address={`${p.oldDomain}${p.deepPath}`} lock="none" dot="red" width={1000} height={420}><NotFoundPage /></BrowserCard>
            </Problem>
            <Problem t={t} from={L.at(8)} until={L.at(9)} label="Rankings slip">
                <SearchResult t={t - L.at(8)} p={p} />
            </Problem>
            <Problem t={t} from={L.at(9)} until={L.at(10) + 0.6} label="Printed and posted">
                <DeadPrint t={t - L.at(9)} dead={L.word(9, 'Dead') - L.at(9)} p={p} />
            </Problem>

            {/* Beat 10: title */}
            <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 380, textAlign: 'center', ...fx(titleK * (1 - easeInOut(prog(t, L.at(11) - 0.6, L.at(11) - 0.3))), 0, (1 - titleK) * 24) }}>
                <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.04 }}>How to redirect a domain<br />to another domain.</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: yt.teal, marginTop: 28, letterSpacing: '-.02em' }}>With HTTPS that actually works.</div>
            </div>
        </Night>
    );
}

/** The registrar tab, composition pixels. Content starts 78 px below the top (the browser bar). */
export const TAB = { x: 340, y: 280, w: 1240, h: 500 } as const;

const typed = (s: string, k: number) => s.slice(0, Math.round(s.length * Math.max(0, Math.min(1, k))));

/** A generic registrar (no real company): search → buy → forwarding on → old address → new site. */
function RegistrarTab({ t, p, settled }: { t: number; p: RedirectDomainProps; settled: boolean }) {
    const buyAt = L.word(2, 'buy');
    const phaseB = t >= L.word(2, 'switch') - 0.25;            // the domain's settings page
    const phaseC = t >= L.word(2, 'type') - 0.2;               // a new tab: the old address
    const landed = t >= L.word(2, 'land') - 0.1;
    const q = typed(p.newDomain, prog(t, L.at(1) + 0.9, L.at(1) + 2.0));
    const results = easeOut(prog(t, L.word(1, 'most') - 0.3, L.word(1, 'most') + 0.2));
    const bought = t >= buyAt;
    const fwd = easeOut(prog(t, L.word(2, 'forwarding') + 0.15, L.word(2, 'forwarding') + 0.45));
    const oldTyped = typed(p.oldDomain, prog(t, L.word(2, 'type'), L.word(2, 'address')));
    const load = prog(t, L.word(2, 'address') + 0.1, L.word(2, 'land') - 0.1);
    const address = !phaseB ? 'your-registrar.example/search' : !phaseC ? `your-registrar.example/domains/${p.oldDomain}` : landed ? `https://${p.newDomain}` : oldTyped;
    return (
        <BrowserCard address={address} lock={landed ? 'secure' : phaseC ? 'none' : 'secure'} dot={settled ? 'teal' : 'none'} width={TAB.w} height={TAB.h} loading={phaseC && !landed ? load : -1}>
            {!phaseC && (
                <div style={{ padding: '30px 56px', fontFamily: font.sans, color: color.charcoal }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: color.g500 }}>
                        <i style={{ width: 30, height: 30, borderRadius: 8, background: color.g300 }} />
                        <b style={{ color: color.g700 }}>Your registrar</b><span>· where you buy domains</span>
                    </div>
                    {!phaseB ? (<>
                        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em', marginTop: 26 }}>Find your new domain</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
                            <div style={{ flex: 1, height: 72, borderRadius: 14, border: `2px solid ${color.blue}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: font.mono, fontSize: 30 }}>{q}<i style={{ width: 2, height: 34, background: color.g700, marginLeft: 3, opacity: q.length < p.newDomain.length ? 1 : 0 }} /></div>
                            <div style={{ width: 200, height: 72, borderRadius: 14, background: color.g700, color: '#fff', fontSize: 26, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Search</div>
                        </div>
                        <div style={{ marginTop: 26, height: 110, borderRadius: 18, border: `1px solid ${color.g200}`, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', ...fx(results, 0, (1 - results) * 14) }}>
                            <span style={{ fontFamily: font.mono, fontSize: 34, fontWeight: 600 }}>{p.newDomain}</span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: '#0E7C6E', background: 'rgba(32,167,149,.14)', borderRadius: 999, padding: '6px 16px' }}>Available</span>
                            <span style={{ marginLeft: 'auto', width: 190, height: 64, borderRadius: 14, background: bought ? 'rgba(32,167,149,.16)' : color.blue, color: bought ? '#0E7C6E' : '#fff', fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bought ? '✓ Yours' : 'Buy'}</span>
                        </div>
                    </>) : (<>
                        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em', marginTop: 26, fontFamily: font.mono }}>{p.oldDomain}</div>
                        <div style={{ fontSize: 22, color: color.g500, marginTop: 6 }}>Domain settings</div>
                        <div style={{ marginTop: 26, borderRadius: 18, border: `1px solid ${color.g200}` }}>
                            <div style={{ height: 96, display: 'flex', alignItems: 'center', padding: '0 28px', borderBottom: `1px solid ${color.g200}` }}>
                                <span style={{ fontSize: 30, fontWeight: 600 }}>Forwarding</span>
                                <span style={{ marginLeft: 'auto', width: 84, height: 46, borderRadius: 23, background: fwd > 0.5 ? yt.teal : color.g300, position: 'relative' }}>
                                    <i style={{ position: 'absolute', top: 5, left: lerp(5, 43, fwd), width: 36, height: 36, borderRadius: 18, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
                                </span>
                            </div>
                            <div style={{ height: 96, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', opacity: lerp(0.35, 1, fwd) }}>
                                <span style={{ fontSize: 26, color: color.g500 }}>Forward to</span>
                                <span style={{ fontFamily: font.mono, fontSize: 30, color: color.g700 }}>https://{p.newDomain}</span>
                            </div>
                        </div>
                    </>)}
                </div>
            )}
            {phaseC && landed && <SkeletonPage title={`Welcome to ${p.newDomain.replace('.com', '')}`} lines={3} />}
        </BrowserCard>
    );
}

/** One problem screen: card centred, small label below, in and out on cuts with a settle. */
function Problem({ t, from, until, label, children }: { t: number; from: number; until: number; label: string; children: React.ReactNode }) {
    if (t < from || t >= until) return null;
    const k = easeOut(prog(t, from, from + 0.35));
    const out = easeOut(prog(t, until - 0.2, until));
    return (
        <>
            <div style={{ position: 'absolute', left: (W - 1000) / 2, top: 330, ...fx(k * (1 - out), 0, (1 - k) * 30 - out * 20, lerp(0.985, 1, k)) }}>{children}</div>
            <OnScreenText t={t} from={from + 0.1} until={until} text={label} size={34} weight={600} color={yt.inkSoft} align="center"
                style={{ position: 'absolute', left: 0, right: 0, top: 790 }}>{label}</OnScreenText>
        </>
    );
}

function WrongPage({ t, p }: { t: number; p: RedirectDomainProps }) {
    // The old deep link is typed in the address bar; it lands on the new homepage instead of the page.
    const landed = t >= 1.0;
    const chip = easeOut(prog(t, 1.2, 1.6));
    return (
        <div style={{ position: 'relative', width: 1000, height: 420 }}>
            <BrowserCard address={landed ? `https://${p.newDomain}` : `${p.oldDomain}${p.deepPath}`} lock={landed ? 'secure' : 'none'} dot="red" width={1000} height={420} loading={landed ? -1 : prog(t, 0.2, 1.0)}>
                {landed && <SkeletonPage title={`Welcome to ${p.newDomain.replace('.com', '')}`} lines={3} />}
                <div style={{ position: 'absolute', right: 34, top: 34, display: 'flex', alignItems: 'center', gap: 10, fontFamily: font.mono, fontSize: 24, fontWeight: 600, color: yt.signalRed, background: 'rgba(229,72,77,.1)', borderRadius: 12, padding: '8px 16px', ...fx(chip) }}>
                    <span style={{ textDecoration: 'line-through' }}>{p.deepPath}</span><span style={{ fontFamily: font.sans }}>→ homepage</span>
                </div>
            </BrowserCard>
        </div>
    );
}

function SearchResult({ t, p }: { t: number; p: RedirectDomainProps }) {
    // A search page: the old site's top result slides down the list as the old address stops passing its place on.
    const drop = easeInOut(prog(t, 0.8, 2.2));
    const rows = [['Pricing', p.deepPath], ['About us', '/about'], ['Contact', '/contact']];
    return (
        <div style={{ position: 'relative', width: 1000, height: 420, borderRadius: 28, background: '#fff', padding: '30px 44px', boxShadow: '0 50px 120px rgba(0,0,0,.45)', fontFamily: font.sans, overflow: 'hidden' }}>
            <div style={{ height: 54, borderRadius: 27, border: `1px solid ${color.g300}`, display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 24, color: color.g700 }}>{p.oldDomain.replace('.com', '')} pricing</div>
            {rows.map(([title, path], i) => {
                // Pricing leaves, the others move up, and Pricing comes back in last place: rows never pass through each other.
                // Pricing fades out first, then the others move up, then it fades back in at the bottom.
                const move = easeInOut(prog(drop, 0.3, 0.7));
                const y = i === 0 ? (drop < 0.5 ? 0 : 2 * 104) : lerp(i * 104, (i - 1) * 104, move);
                const o = i === 0 ? (drop < 0.3 ? 1 - drop / 0.3 : drop > 0.7 ? (drop - 0.7) / 0.3 : 0) : 1;
                return (
                    <div key={title} style={{ position: 'absolute', left: 44, right: 44, top: 112 + y, height: 96, opacity: o }}>
                        <div style={{ fontSize: 19, color: color.g500, fontFamily: font.mono }}>{p.oldDomain}{path}</div>
                        <div style={{ fontSize: 30, color: color.blue, fontWeight: 600, marginTop: 4 }}>{title}</div>
                        {i === 0 && <div style={{ position: 'absolute', right: 0, top: 18, display: 'flex', alignItems: 'center', gap: 8, color: yt.signalRed, fontSize: 24, fontWeight: 700, opacity: drop }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={yt.signalRed} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>Dropping
                        </div>}
                    </div>
                );
            })}
        </div>
    );
}

function DeadPrint({ t, dead, p }: { t: number; dead: number; p: RedirectDomainProps }) {
    // `dead`: when the voice says "Dead", local to this beat. The scan runs just before it, the labels land on it.
    const scan = easeInOut(prog(t, dead - 1.7, dead - 0.9));
    const fail = prog(t, dead - 0.25, dead + 0.1);
    return (
        <div style={{ position: 'relative', width: 1000, height: 420 }}>
            {/* A printed card with a QR (a prop: its finder pattern is covered so it cannot decode). */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 470, height: 420, borderRadius: 24, background: '#FBF7EF', boxShadow: '0 50px 120px rgba(0,0,0,.45)', padding: 32, fontFamily: font.display, color: '#3B3A36' }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.12em', color: '#8A8478' }}>PRINTED</div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', marginTop: 6 }}>Scan to see our prices</div>
                <div style={{ position: 'absolute', left: 32, bottom: 32, opacity: 0.6, filter: 'blur(2.5px)' }}><BrandedQr value={p.qr.value} label={`${p.oldDomain}${p.deepPath}`} size={170} labelSize={20} /></div>
                <div style={{ position: 'absolute', left: 32 + 20, right: 470 - 32 - 20 - 170 - 40 + 20, top: lerp(190, 400, scan), height: 3, background: yt.signalRed, opacity: scan > 0 && scan < 1 ? 0.9 : 0 }} />
                <div style={{ position: 'absolute', right: 32, bottom: 60, fontSize: 24, fontWeight: 700, color: yt.signalRed, opacity: fail }}>No page</div>
            </div>
            {/* An old email with the link */}
            <div style={{ position: 'absolute', left: 520, top: 40, width: 480, height: 340, borderRadius: 24, background: '#fff', boxShadow: '0 50px 120px rgba(0,0,0,.45)', padding: 30, fontFamily: font.sans, color: color.g700 }}>
                <div style={{ fontSize: 18, color: color.g500 }}>Email · last year</div>
                <div style={{ fontSize: 26, fontWeight: 600, marginTop: 8 }}>Our new prices are live</div>
                <div style={{ fontSize: 22, marginTop: 18, lineHeight: 1.5 }}>Have a look:<br /><span style={{ fontFamily: font.mono, color: color.blue, textDecoration: 'underline' }}>{p.oldDomain}{p.deepPath}</span></div>
                <div style={{ position: 'absolute', right: 30, bottom: 30, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: yt.signalRed, opacity: fail }}>
                    <i style={{ width: 12, height: 12, borderRadius: 6, background: yt.signalRed }} />Dead
                </div>
            </div>
        </div>
    );
}
