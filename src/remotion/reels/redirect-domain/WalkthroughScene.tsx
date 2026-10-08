/* ACT C — beats 25–36. The walkthrough inside RedirHub: write the note (Links → Create →
   Domain Redirect), update the address book (Hostnames → Connect DNS → records), and the ID
   card issues itself. The two domain pills and the three-idea rail stay docked. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { font, yt } from '../../brand/tokens';
import { Cursor } from '../../components/Cursor';
import { GlassCard } from '../../components/GlassCard';
import { UrlPill } from '../../components/UrlPill';
import { ConnectDns, CreateChooser, DASH, DashWindow, DomainRedirectForm, HostnamesPage, LinksPage, Toast, type Row } from './Dash';
import { IdeaGlyph } from './IdeasScene';
import { Caption, Night, SAFE, Tag, TipCard, W } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('walkthrough');
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.floor(prog(t, a, b) * s.length + 1e-6));

export function WalkthroughScene(p: RedirectDomainProps) {
    const t = useTime();
    const dashIn = easeOut(prog(t, L.at(25) + 0.2, L.at(25) + 0.9));
    const pillsIn = easeOut(prog(t, L.at(27), L.at(27) + 0.5));

    // Step one: Create → Domain Redirect → form → Save.
    const createPress = Math.max(0, 1 - Math.abs(t - (L.at(28) + 1.6)) / 0.12);
    const chooser = t >= L.at(28) + 1.7 && t < L.at(28) + 3.6;
    const hover = easeOut(prog(t, L.at(28) + 2.6, L.at(28) + 3.0));
    const form = t >= L.at(28) + 3.6 && t < L.at(31);
    const f = L.at(29);
    const fromTyped = typed(p.oldDomain, t, f + 0.2, f + 1.3);
    const toTyped = typed(`https://${p.newDomain}`, t, f + 2.4, f + 3.9);
    const focus = t < f + 2.2 ? 'from' : t < f + 4.2 ? 'to' : null;
    const type301 = t >= f + 4.8 ? '301' : null;
    const keep = prog(t, f + 6.4, f + 6.8);
    const savePress = Math.max(0, 1 - Math.abs(t - (L.at(30) + 0.3)) / 0.12);
    const saved = t >= L.at(30) + 0.45;
    const toast = easeOut(prog(t, L.at(30) + 0.5, L.at(30) + 0.8)) * (1 - prog(t, L.end(30) - 0.4, L.end(30)));

    // Step two: Hostnames → Connect DNS.
    const hosts = t >= L.at(31) && t < L.at(36);
    const connectPress = Math.max(0, 1 - Math.abs(t - (L.at(31) + 3.6)) / 0.12);
    const dlgK = easeOut(prog(t, L.at(31) + 3.7, L.at(31) + 4.2));
    const dialog = t >= L.at(31) + 3.7;
    const copied = Math.floor(prog(t, L.at(34) + 1.0, L.at(34) + 4.0) * 3 + 1e-6);
    const splitK = easeInOut(prog(t, L.at(34) + 0.2, L.at(34) + 0.9)) * (1 - easeInOut(prog(t, L.at(35) - 0.5, L.at(35))));
    const dns = easeOut(prog(t, L.at(35) + 1.2, L.at(35) + 3.4));
    const https = easeOut(prog(t, L.at(35) + 4.2, L.at(35) + 5.8));

    const rows: Row[] = [
        { kind: 'qr', title: 'Spring menu – table tents', dest: 'go.mybrand.com/menu → https://mybrand.com/menu/spring-2026', clicks: '2.8k', trend: '412' },
        { kind: 'link', title: 'go.mybrand.com/webinar', dest: 'https://mybrand.com/events/october-webinar', clicks: '1.2k', trend: '388' },
        { kind: 'link', title: 'shop.mybrand.com', dest: 'https://mybrand.com/store', clicks: '6.1k', trend: '1.3k' },
        { kind: 'link', title: 'go.mybrand.com/careers', dest: 'https://jobs.mybrand.com', clicks: '488', trend: '97', letter: 'J' },
        ...(saved ? [{ kind: 'redirect', title: p.oldDomain, dest: `https://${p.newDomain}`, clicks: '0', highlight: easeOut(prog(t, L.at(30) + 0.5, L.at(30) + 0.9)) } as Row] : []),
    ];
    const address = form ? 'dash.redirhub.com/links/create/redirect' : hosts ? 'dash.redirhub.com/hostnames' : 'dash.redirhub.com/links';
    const rail = [t >= L.at(30) + 0.5 ? 1 : 0, dns >= 1 ? 1 : 0, https >= 1 ? 1 : 0];

    // The dashboard shifts left and shrinks a little while the "Your DNS provider" panel is shown.
    const shift = -190 * splitK;
    const dashScale = lerp(0.97, 1, dashIn) * (1 - 0.1 * splitK);

    return (
        <Night>
            {/* Docked pills and the idea rail */}
            <div style={{ position: 'absolute', left: SAFE.x, top: SAFE.top + 10, display: 'flex', alignItems: 'center', gap: 22, ...fx(pillsIn, 0, (1 - pillsIn) * -10) }}>
                <UrlPill url={p.oldDomain} dot={rail.every(Boolean) ? 'teal' : 'amber'} size={26} />
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke={yt.inkMute} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h34M28 4l8 8-8 8" /></svg>
                <UrlPill url={p.newDomain} dot="teal" size={26} />
            </div>
            <div style={{ position: 'absolute', right: SAFE.x, top: SAFE.top + 6, display: 'flex', gap: 46, ...fx(dashIn) }}>
                {(['note', 'book', 'id'] as const).map((k, i) => <IdeaGlyph key={k} kind={k} filled={rail[i]} size={64} color={rail[i] ? yt.ink : yt.inkMute} />)}
            </div>
            <Tag t={t} from={L.at(28)} until={L.at(31) - 0.2} align="center">STEP ONE · WRITE THE NOTE</Tag>
            <Tag t={t} from={L.at(31)} until={L.at(36) - 0.2} align="center">STEP TWO · UPDATE THE ADDRESS BOOK</Tag>

            <DashWindow address={address} nav={hosts ? 'hostnames' : 'links'} style={{ ...fx(dashIn, shift, (1 - dashIn) * 50, dashScale), transformOrigin: 'left center' }}>
                {!form && !hosts && <LinksPage rows={rows} press={createPress} />}
                {chooser && <CreateChooser hover={hover} />}
                {form && <DomainRedirectForm from={fromTyped} to={toTyped} focus={focus} type={type301} keepPath={keep} savePress={savePress} saved={saved} />}
                {!form && !hosts && saved && <Toast k={toast} text="Redirect created" />}
                {hosts && <HostnamesPage host={p.oldDomain} press={connectPress} />}
                {hosts && dialog && <ConnectDns p={p} copied={copied} verify={{ dns, https }} k={dlgK} />}
            </DashWindow>

            {/* "Your DNS provider" panel during beat 34 */}
            <div style={{ position: 'absolute', left: W - SAFE.x - 520 + (1 - splitK) * 600, top: 300, width: 520, ...fx(splitK) }}>
                <GlassCard padding={30}>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '.12em', color: yt.inkSoft }}>YOUR DNS PROVIDER</div>
                    <div style={{ fontSize: 24, color: yt.inkMute, marginTop: 6 }}>wherever your domain lives</div>
                    {p.records.map((r, i) => (
                        <div key={r.type + r.name} style={{ marginTop: 18, height: 56, borderRadius: 12, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', fontFamily: font.mono, fontSize: 19, opacity: i < copied ? 1 : 0.35 }}>
                            <b style={{ width: 70 }}>{r.type}</b><span style={{ width: 60, color: yt.inkSoft }}>{r.name}</span><span style={{ color: i < copied ? yt.teal : yt.inkMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i < copied ? r.value : '…'}</span>
                        </div>
                    ))}
                </GlassCard>
            </div>

            <TipCard t={t} from={L.at(33) + 0.2} until={L.at(34) - 0.1} label={p.tips.screenshot}>Thirty seconds now, zero regret later.</TipCard>
            <Caption t={t} from={L.at(34) + 3.2} until={L.at(35) - 0.2} y={960} size={32} color={yt.inkMute}>Copy yours, not mine.</Caption>
            <Caption t={t} from={L.at(36) + 0.3} until={L.end(36)} y={960} size={34} color={yt.inkSoft}>The note. The address book. The ID card, automatically.</Caption>

            <Cursor t={t} keys={[
                [L.at(28), DASH.x + 1240, DASH.y + 300],
                [L.at(28) + 1.4, DASH.x + 1380, DASH.y + 112],          // Create
                [L.at(28) + 2.4, DASH.x + 1380, DASH.y + 112],
                [L.at(28) + 3.0, DASH.x + 620, DASH.y + 560],           // Domain Redirect card
                [L.at(29) - 0.1, DASH.x + 620, DASH.y + 560],
                [L.at(29) + 0.1, DASH.x + 560, DASH.y + 232],           // from field
                [L.at(29) + 2.2, DASH.x + 560, DASH.y + 332],           // to field
                [L.at(29) + 4.6, DASH.x + 290, DASH.y + 436],           // 301
                [L.at(29) + 6.2, DASH.x + 200, DASH.y + 522],           // keep path
                [L.at(30) + 0.1, DASH.x + 215, DASH.y + 703],           // Save
                [L.at(31) + 1.0, DASH.x + 60, DASH.y + 410],            // Hostnames nav
                [L.at(31) + 3.4, DASH.x + 1130, DASH.y + 262],          // Connect DNS
                [L.at(31) + 4.4, DASH.x + 1130, DASH.y + 262],
                [L.at(32) + 0.5, DASH.x + 1180, DASH.y + 560],
            ]} clicks={[L.at(28) + 1.6, L.at(28) + 3.4, L.at(29) + 4.8, L.at(29) + 6.4, L.at(30) + 0.3, L.at(31) + 1.2, L.at(31) + 3.6]} show={L.at(28)} hide={L.at(33)} />
        </Night>
    );
}
