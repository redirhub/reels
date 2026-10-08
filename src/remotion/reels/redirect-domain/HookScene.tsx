/* ACT A — beats 1–10. The two pills, the forwarding line, "It looks done.", then the five
   concrete breakages one per screen, then the title. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { yt } from '../../brand/tokens';
import { BrowserCard, NotFoundPage, NotSecurePage, SkeletonPage } from '../../components/BrowserCard';
import { RedirectLine } from '../../components/RedirectLine';
import { OnScreenText } from '../../components/OnScreenText';
import { BrandedQr } from '../../components/QrCode';
import { Caption, DomainPill, Night, PILL_Y, SAFE, W, pillGeometry } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('hook');

export function HookScene(p: RedirectDomainProps) {
    const t = useTime();
    const g = pillGeometry(p.oldDomain, p.newDomain);
    // Beat 1: old pill, then new pill slides in. Beat 2: line draws, card lands. Beat 3: stillness.
    const oldK = easeOut(prog(t, L.at(1) + 0.2, L.at(1) + 0.7));
    const newK = easeOut(prog(t, L.at(1) + 2.6, L.at(1) + 3.2));
    const lineK = easeInOut(prog(t, L.at(2) + 0.9, L.at(2) + 1.9));
    const cardK = easeOut(prog(t, L.word(2, 'land') - 0.3, L.word(2, 'land') + 0.4));
    const settled = t >= L.at(3);
    // Beat 4: the card and new pill leave; the old pill stays and moves up-left as the anchor.
    const leave = easeInOut(prog(t, L.at(4) + 0.6, L.at(4) + 1.4));
    const problems = t >= L.at(5) && t < L.at(10);
    const titleK = easeOut(prog(t, L.at(10) + 1.6, L.at(10) + 2.3));
    const sweep = easeInOut(prog(t, L.at(10) + 1.2, L.at(10) + 1.9));

    const pillY = lerp(PILL_Y, 180, leave);
    const oldX = lerp(g.old.x, SAFE.x, leave);

    return (
        <Night>
            {/* Anchor pills */}
            <DomainPill url={p.oldDomain} dot={settled && !problems ? 'teal' : problems ? 'red' : 'grey'} x={oldX} y={pillY} style={{ ...fx(oldK * (1 - sweep), 0, (1 - oldK) * 20) }} />
            <DomainPill url={p.newDomain} dot={settled ? 'teal' : 'none'} x={g.new.x} style={{ ...fx(newK * (1 - leave), (1 - newK) * 60, 0) }} />
            <RedirectLine from={[g.old.right + 14, PILL_Y]} to={[g.new.left - 14, PILL_Y]} progress={lineK} color={settled ? yt.teal : yt.inkSoft} bend={0.12} traffic={settled ? 3 : 0} t={t} opacity={1 - leave} />

            {/* Beat 2–3: the browser card lands under the pills */}
            <div style={{ position: 'absolute', left: (W - 900) / 2, top: 600, ...fx(cardK * (1 - leave), 0, (1 - cardK) * 40 + leave * 60, lerp(0.96, 1, cardK)) }}>
                <BrowserCard address={`https://${p.newDomain}`} lock="secure" dot={settled ? 'teal' : 'none'} width={900} height={330}>
                    <SkeletonPage title="Welcome to mybrand" lines={2} />
                </BrowserCard>
            </div>
            <Caption t={t} from={L.at(3) + 0.9} until={L.end(3)} y={330} size={64} color={yt.ink} text="Fair enough. It looks done.">Fair enough. <span style={{ color: yt.teal }}>It looks done.</span></Caption>

            {/* Beats 5–9: one problem per screen */}
            <Problem t={t} from={L.at(5)} until={L.at(6)} label="Not secure">
                <BrowserCard address={`${p.oldDomain}`} lock="insecure" dot="red" width={1000} height={420}><NotSecurePage /></BrowserCard>
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
            <Problem t={t} from={L.at(9)} until={L.at(10) + 1.2} label="Printed and posted">
                <DeadPrint t={t - L.at(9)} p={p} />
            </Problem>

            {/* Beat 10: title */}
            <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 380, textAlign: 'center', ...fx(titleK, 0, (1 - titleK) * 24) }}>
                <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.04 }}>How to redirect a domain<br />to another domain.</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: yt.teal, marginTop: 28, letterSpacing: '-.02em' }}>With HTTPS that actually works.</div>
            </div>
        </Night>
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
    // The deep link's path falls off; the card shows the homepage.
    const drop = easeInOut(prog(t, 0.6, 1.3));
    return (
        <div style={{ position: 'relative', width: 1000, height: 420 }}>
            <BrowserCard address={`https://${p.newDomain}`} lock="secure" dot="red" width={1000} height={420}>
                <SkeletonPage title="Welcome to mybrand" lines={3} />
            </BrowserCard>
            <div style={{ position: 'absolute', left: 330, top: -70, fontFamily: '"JetBrains Mono", monospace', fontSize: 30, color: yt.inkSoft, ...fx(1 - drop * 0.4, 0, drop * 90, 1 - drop * 0.1) }}>
                {p.oldDomain}<span style={{ color: yt.signalRed, textDecoration: drop > 0.5 ? 'line-through' : 'none' }}>{p.deepPath}</span>
            </div>
        </div>
    );
}

function SearchResult({ t, p }: { t: number; p: RedirectDomainProps }) {
    const fade = easeInOut(prog(t, 0.8, 2.2));
    const rows = ['Our menu — mydomain.com', 'Opening hours — mydomain.com', 'Book a table — mydomain.com'];
    return (
        <div style={{ width: 1000, height: 420, borderRadius: 28, background: '#fff', padding: '34px 44px', boxShadow: '0 50px 120px rgba(0,0,0,.45)', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ height: 52, borderRadius: 26, border: '1px solid #D0D5DD', display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 24, color: '#344054' }}>{p.oldDomain.replace('.com', '')} menu</div>
            {rows.map((r, i) => (
                <div key={r} style={{ marginTop: 26, opacity: 1 - fade * (i === 0 ? 0.75 : 0.4), transform: `translateY(${fade * (i === 0 ? 28 : 0)}px)` }}>
                    <div style={{ fontSize: 18, color: '#667085' }}>{p.oldDomain}{i === 0 ? p.deepPath : ''}</div>
                    <div style={{ fontSize: 28, color: '#1C6DB6', fontWeight: 500, marginTop: 4 }}>{r.split(' — ')[0]}</div>
                </div>
            ))}
            <div style={{ position: 'absolute', right: 60, top: 150, display: 'flex', alignItems: 'center', gap: 10, color: yt.signalRed, fontSize: 30, fontWeight: 700, opacity: fade }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={yt.signalRed} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
                #1 → #7
            </div>
        </div>
    );
}

function DeadPrint({ t, p }: { t: number; p: RedirectDomainProps }) {
    const scan = easeInOut(prog(t, 0.3, 1.1));
    const fail = prog(t, 1.2, 1.6);
    return (
        <div style={{ position: 'relative', width: 1000, height: 420 }}>
            {/* A printed menu card with a branded QR (the QR encodes redirhub.com/qr; demo domains belong to someone else). */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: 470, height: 420, borderRadius: 24, background: '#FBF7EF', boxShadow: '0 50px 120px rgba(0,0,0,.45)', padding: 32, fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#3B3A36' }}>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em' }}>Menu</div>
                <div style={{ fontSize: 20, marginTop: 8, color: '#6B675F' }}>Scan for today’s specials</div>
                <div style={{ position: 'absolute', left: 32, bottom: 32 }}><BrandedQr value={p.qr.value} label={`${p.oldDomain}${p.deepPath}`} size={170} labelSize={20} /></div>
                <div style={{ position: 'absolute', left: 32 + 20, right: 470 - 32 - 20 - 170 - 40 + 20, top: lerp(190, 400, scan), height: 3, background: yt.signalRed, opacity: scan > 0 && scan < 1 ? 0.9 : 0 }} />
                <div style={{ position: 'absolute', right: 32, bottom: 60, fontSize: 24, fontWeight: 700, color: yt.signalRed, opacity: fail }}>No page</div>
            </div>
            {/* An old email with the link */}
            <div style={{ position: 'absolute', left: 520, top: 40, width: 480, height: 340, borderRadius: 24, background: '#fff', boxShadow: '0 50px 120px rgba(0,0,0,.45)', padding: 30, fontFamily: '"Inter", sans-serif', color: '#344054' }}>
                <div style={{ fontSize: 18, color: '#667085' }}>Last year</div>
                <div style={{ fontSize: 26, fontWeight: 600, marginTop: 8 }}>Our new menu is live</div>
                <div style={{ fontSize: 22, marginTop: 18, lineHeight: 1.5 }}>Have a look before Friday:<br /><span style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1C6DB6', textDecoration: 'underline' }}>{p.oldDomain}{p.deepPath}</span></div>
                <div style={{ position: 'absolute', right: 30, bottom: 30, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: yt.signalRed, opacity: fail }}>
                    <i style={{ width: 12, height: 12, borderRadius: 6, background: yt.signalRed }} />Dead
                </div>
            </div>
        </div>
    );
}
