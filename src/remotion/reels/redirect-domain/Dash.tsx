/* RedirHub's dashboard, drawn after the real app (redirhub/lviv) and the Product Facts
   screenshots in reference/ (Links list, Create chooser, Hostnames, Connect DNS; captured
   2026-10-01 and 2026-10-05 from the e2e fixtures). Landscape, ~0.7× of the 2880 px captures.
   Product UI keeps Inter and the app's own colours; the film's type is Plus Jakarta Sans. */
import type { CSSProperties, ReactNode } from 'react';
import { RedirHubIcon } from '../../brand/Logo';
import { color, font, yt } from '../../brand/tokens';
import { IconCopy, IconGlobe, IconHome, IconLink, IconPulse, IconQr, IconRedirect, IconSearch, IconUpload } from '../../components/icons';
import { BrowserCard } from '../../components/BrowserCard';
import { easeOut, fx, lerp, prog } from '../../lib/anim';
import type { RedirectDomainProps } from './props';

// App tokens (lviv tailwind.css).
const ok = '#12B76A';
const okSoft = { bg: '#ECFDF3', text: '#067647' };
const warn = { dot: '#F79009', bg: '#FFFAEB', text: '#B54708', line: '#FEDF89' };
const border = color.g200;
const createAmber = '#E8A033';
/** The example deep path shown in the "Keep path" hint (matches props.deepPath). */
const EXAMPLE_PATH = '/pricing';

export const DASH = { w: 1480, h: 850, x: (1920 - 1480) / 2, y: 140 } as const;
const SIDEBAR = 120;

export function DashWindow({ address, nav, children, style }: { address: string; nav: 'home' | 'links' | 'monitor' | 'hostnames'; children: ReactNode; style?: CSSProperties }) {
    const items: [typeof nav, string, (p: { size?: number; color?: string }) => ReactNode][] = [
        ['home', 'Home', IconHome], ['links', 'Links', IconRedirect], ['monitor', 'Monitor', IconPulse], ['hostnames', 'Hostnames', IconGlobe],
    ];
    return (
        <div style={{ position: 'absolute', left: DASH.x, top: DASH.y, ...style }}>
            <BrowserCard address={address} lock="secure" width={DASH.w} height={DASH.h} radius={26}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDEBAR, background: '#fff', borderRight: `1px solid ${border}`, fontFamily: font.sans }}>
                    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ height: 40 }}><RedirHubIcon /></div></div>
                    {items.map(([key, label, Icon]) => {
                        const on = key === nav;
                        return (
                            <div key={key} style={{ margin: '8px 10px 0', height: 70, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: on ? '#fff' : color.g700, background: on ? '#2E7BC4' : 'transparent' }}>
                                <Icon size={22} color={on ? '#fff' : color.g700} />{label}
                            </div>
                        );
                    })}
                    <div style={{ position: 'absolute', left: 36, bottom: 24, width: 48, height: 48, borderRadius: 24, background: color.g100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: color.g700 }}>MC</div>
                </div>
                <div style={{ position: 'absolute', left: SIDEBAR, top: 0, right: 0, bottom: 0, background: '#fff' }}>{children}</div>
            </BrowserCard>
        </div>
    );
}

function PageHeader({ title, action, press = 0 }: { title: string; action?: string; press?: number }) {
    return (
        <div style={{ height: 66, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: color.charcoal }}>{title}</div>
            {action && (
                <div style={{ marginLeft: 'auto', height: 42, borderRadius: 10, background: createAmber, color: '#fff', fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', transform: `scale(${1 - press * 0.05})`, overflow: 'hidden' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>{action}
                    </span>
                    <span style={{ height: '100%', width: 36, borderLeft: '1px solid rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                </div>
            )}
        </div>
    );
}

function Chip({ children, active = false, dot }: { children: ReactNode; active?: boolean; dot?: string }) {
    return (
        <div style={{ height: 38, padding: '0 14px', borderRadius: 19, border: `1.5px solid ${active ? '#9CC3E6' : border}`, background: active ? '#EEF6FD' : '#fff', color: active ? color.blue : color.g700, fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            {dot && <i style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />}{children}
        </div>
    );
}

function Count({ n, tone = 'blue' }: { n: string | number; tone?: 'blue' | 'grey' }) {
    return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 11, background: tone === 'blue' ? '#E3EEF9' : color.g100, color: tone === 'blue' ? color.blue : color.g600, fontSize: 13, fontWeight: 600 }}>{n}</span>;
}

export type Row = { kind: 'link' | 'redirect' | 'qr'; title: string; dest: string; clicks: string; trend?: string; dot?: string; highlight?: number; letter?: string };

export function LinksPage({ rows, press = 0 }: { rows: readonly Row[]; press?: number }) {
    return (
        <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, background: color.g50 }}>
            <div style={{ background: '#fff' }}><PageHeader title="Links" action="Create" press={press} /></div>
            <div style={{ position: 'absolute', left: 28, right: 28, top: 86, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 230, height: 38, borderRadius: 19, border: `1.5px solid ${border}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 15, color: color.g400 }}><IconSearch size={18} color={color.g500} />Search in {rows.length} links</div>
                <Chip active>All <Count n={rows.length} /></Chip>
                <Chip>go.mybrand.com <Count n={3} tone="grey" /></Chip>
                <Chip>Last 7 days <Count n={2} tone="grey" /></Chip>
                <Chip dot={warn.dot}>DNS issue <Count n={0} tone="grey" /></Chip>
                <div style={{ marginLeft: 'auto' }}><Chip>Show: <b>Latest</b></Chip></div>
            </div>
            {rows.map((r, i) => (
                <div key={r.title} style={{ position: 'absolute', left: 28, right: 28, top: 142 + i * 94, height: 82, borderRadius: 14, background: '#fff', border: `1.5px solid ${r.highlight ? yt.teal : border}`, boxShadow: r.highlight ? `0 0 0 ${6 * r.highlight}px rgba(32,167,149,.22)` : 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px' }}>
                    <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 10, background: r.kind === 'qr' ? color.g100 : '#2E7BC4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                        {r.kind === 'qr' ? <IconQr size={24} color={color.g700} /> : r.kind === 'redirect' ? <IconRedirect size={22} color="#fff" /> : (r.letter ?? 'M')}
                        <i style={{ position: 'absolute', right: -4, bottom: -4, width: 12, height: 12, borderRadius: 6, border: '2px solid #fff', background: r.dot ?? ok }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 19, fontWeight: 600, color: color.charcoal }}>{r.title}</div>
                        <div style={{ fontSize: 15, color: color.g500, marginTop: 4 }}>↳ {r.dest}</div>
                    </div>
                    <div style={{ fontSize: 16, color: color.g700, whiteSpace: 'nowrap' }}>{r.clicks} {r.kind === 'qr' ? 'Scans' : 'Clicks'}</div>
                    {r.trend && <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 10px', borderRadius: 13, background: okSoft.bg, color: okSoft.text, fontSize: 14, fontWeight: 600 }}>↑ {r.trend}</span>}
                    <div style={{ fontSize: 15, color: color.g500, whiteSpace: 'nowrap', width: 100 }}>{r.highlight !== undefined ? 'just now' : '19 days ago'}</div>
                    <div style={{ display: 'flex', gap: 18, color: color.g600 }}><IconCopy size={18} color={color.g600} /><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color.g600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg><span style={{ fontSize: 18, lineHeight: '18px', letterSpacing: 1 }}>···</span></div>
                </div>
            ))}
        </div>
    );
}

export function CreateChooser({ hover }: { hover: number }) {
    const items: [string, string, string, (p: { size?: number; color?: string }) => ReactNode, string, string][] = [
        ['Branded Link', 'A short, memorable link on a domain you own.', 'acme.co/summer → your campaign page', IconLink, '#E3EEF9', color.blue],
        ['Dynamic QR Code', 'A trackable QR whose destination can change after it is printed.', 'Menus, packaging, posters, business cards', IconQr, '#FDF1E2', '#C77A12'],
        ['Domain Redirect', 'Redirect a domain, subdomain or path — 301 or 302.', 'old-acme.com → acme.com', IconRedirect, '#E6F6F0', '#12855F'],
        ['Website Migration', 'Move many URLs with one same-path rule, or map them one-to-one.', 'Replatforming, domain change, site restructure', IconUpload, color.g100, color.g700],
    ];
    return (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,24,40,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
            <div style={{ width: 800, borderRadius: 18, background: '#fff', boxShadow: '0 30px 80px rgba(16,24,40,.3)', overflow: 'hidden' }}>
                <div style={{ padding: '26px 28px 0' }}>
                    <div style={{ fontSize: 22, fontWeight: 600, color: color.charcoal }}>What do you want to create?</div>
                    <div style={{ fontSize: 15, color: color.g500, marginTop: 6 }}>Pick the job. Everything you create here is managed together in Links.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '20px 28px 22px' }}>
                    {items.map(([title, body, example, Icon, tile, ic], i) => {
                        const on = i === 2 ? hover : 0;
                        return (
                            <div key={title} style={{ borderRadius: 12, border: `1.5px solid ${on > 0.5 ? color.blue : border}`, background: on > 0.5 ? '#F5F9FD' : '#fff', padding: '18px 20px 14px', transform: `scale(${1 + on * 0.012})` }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: tile, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={ic} /></div>
                                <div style={{ fontSize: 18, fontWeight: 600, color: color.charcoal, marginTop: 14 }}>{title}</div>
                                <div style={{ fontSize: 14.5, color: color.g600, marginTop: 4, lineHeight: 1.4, minHeight: 40 }}>{body}</div>
                                <div style={{ borderTop: `1px solid ${border}`, marginTop: 12, paddingTop: 10, fontSize: 14, color: color.g500 }}>{example}</div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ background: color.g50, borderTop: `1px solid ${border}`, padding: '14px 28px', fontSize: 15, color: color.g600, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <IconUpload size={18} color={color.g600} />Already have a spreadsheet of links? <span style={{ color: color.blue, fontWeight: 600 }}>Import CSV</span>
                </div>
            </div>
        </div>
    );
}

function Label({ children }: { children: ReactNode }) { return <div style={{ fontSize: 17, fontWeight: 600, color: color.g700, marginBottom: 8 }}>{children}</div>; }
function Input({ value, caret, focused, mono = true }: { value: string; caret?: boolean; focused?: boolean; mono?: boolean }) {
    return (
        <div style={{ height: 54, borderRadius: 10, border: `1.5px solid ${focused ? color.blue : color.g300}`, boxShadow: focused ? '0 0 0 4px rgba(28,109,182,.16)' : 'none', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 19, color: value ? color.charcoal : color.g400, fontFamily: mono ? font.mono : font.sans, whiteSpace: 'pre' }}>
            {value || 'https://'}{caret && <i style={{ display: 'inline-block', width: 2, height: 24, background: color.blue, marginLeft: 1 }} />}
        </div>
    );
}

/** The Domain Redirect form. Fields per the Product Facts spec (Redirect from / to, 301/302, keep path);
    no screenshot of this exact form exists yet — labels to confirm with Kris. */
export function DomainRedirectForm({ from, to, focus, type, keepPath, savePress = 0, saved = false }: {
    from: string; to: string; focus: 'from' | 'to' | null; type: '301' | '302' | null; keepPath: number; savePress?: number; saved?: boolean;
}) {
    return (
        <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, background: color.g50 }}>
            <div style={{ height: 66, borderBottom: `1px solid ${border}`, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14 }}>
                <span style={{ fontSize: 17, color: color.g600, fontWeight: 500 }}>← Links</span><span style={{ width: 1, height: 24, background: border }} /><span style={{ fontSize: 22, fontWeight: 600, color: color.charcoal }}>Domain Redirect</span>
            </div>
            <div style={{ position: 'absolute', left: 28, top: 94, width: 760, borderRadius: 16, background: '#fff', border: `1.5px solid ${border}`, padding: 26 }}>
                <Label>Redirect from</Label><Input value={from} focused={focus === 'from'} caret={focus === 'from'} />
                <div style={{ height: 20 }} />
                <Label>Redirect to</Label><Input value={to} focused={focus === 'to'} caret={focus === 'to'} />
                <div style={{ height: 22 }} />
                <Label>Redirect type</Label>
                <div style={{ display: 'flex', gap: 10 }}>
                    {(['301', '302'] as const).map((k) => (
                        <div key={k} style={{ height: 42, padding: '0 16px', borderRadius: 21, border: `1.5px solid ${type === k ? color.blue : color.g300}`, background: type === k ? '#EEF6FD' : '#fff', color: type === k ? color.blue : color.g700, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: font.mono }}>{k}</span>{k === '301' ? 'Permanent' : 'Temporary'}
                        </div>
                    ))}
                </div>
                <div style={{ height: 22 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 30, borderRadius: 15, background: keepPath > 0.5 ? color.teal : color.g300, position: 'relative' }}>
                        <i style={{ position: 'absolute', top: 3, left: lerp(3, 25, easeOut(keepPath)), width: 24, height: 24, borderRadius: 12, background: '#fff' }} />
                    </div>
                    <div><div style={{ fontSize: 17, fontWeight: 600, color: color.g700 }}>Keep path</div><div style={{ fontSize: 14, color: color.g500 }}>{from || 'olddomain.com'}{EXAMPLE_PATH} → {to.replace(/^https?:\/\//, '') || 'newdomain.com'}{EXAMPLE_PATH}</div></div>
                </div>
            </div>
            <div style={{ position: 'absolute', left: 28, top: 600, height: 50, padding: '0 26px', borderRadius: 12, background: saved ? color.teal : '#2E7BC4', color: '#fff', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', transform: `scale(${1 - savePress * 0.05})` }}>{saved ? 'Saved' : 'Save'}</div>
        </div>
    );
}

export function HostnamesPage({ host, press = 0 }: { host: string; press?: number }) {
    const rows = [
        { h: host, provider: 'Your registrar · Added today', ok: false, links: '1 link' },
        { h: 'go.mybrand.com', provider: 'Cloudflare · Automatic', ok: true, links: '812 links' },
        { h: 'mybrand.com', provider: 'Cloudflare · Manual', ok: true, links: '41 links' },
    ];
    return (
        <div style={{ position: 'absolute', inset: 0, fontFamily: font.sans, background: color.g50 }}>
            <div style={{ background: '#fff' }}><PageHeader title="Hostnames" /></div>
            <div style={{ position: 'absolute', left: 28, right: 28, top: 86, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 220, height: 38, borderRadius: 19, border: `1.5px solid ${border}`, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 15, color: color.g400 }}><IconSearch size={18} color={color.g500} />Search</div>
                <Chip active>All <Count n={3} /></Chip>
                <Chip dot={warn.dot}>DNS issue <Count n={1} tone="grey" /></Chip>
                <Chip dot={warn.dot}>HTTPS issue <Count n={0} tone="grey" /></Chip>
                <div style={{ marginLeft: 'auto' }}><Chip>Needs attention first ▾</Chip></div>
            </div>
            {rows.map((r, i) => (
                <div key={r.h} style={{ position: 'absolute', left: 28, right: 28, top: 142 + i * 94, height: 82, borderRadius: 14, background: '#fff', border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px' }}>
                    <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 10, background: r.ok ? '#E3EEF9' : '#FDF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconGlobe size={24} color={r.ok ? color.blue : '#C77A12'} /><i style={{ position: 'absolute', right: -4, bottom: -4, width: 12, height: 12, borderRadius: 6, border: '2px solid #fff', background: r.ok ? ok : warn.dot }} />
                    </div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 19, fontWeight: 600, color: color.charcoal, fontFamily: font.mono }}>{r.h}</div><div style={{ fontSize: 15, color: color.g500, marginTop: 4 }}>{r.provider}</div></div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 14, background: r.ok ? okSoft.bg : warn.bg, color: r.ok ? okSoft.text : warn.text, fontSize: 14, fontWeight: 600 }}><i style={{ width: 7, height: 7, borderRadius: 4, background: r.ok ? ok : warn.dot }} />{r.ok ? 'Connected' : 'DNS issue'}</span>
                    {!r.ok && <div style={{ height: 42, padding: '0 16px', borderRadius: 10, background: '#2E7BC4', color: '#fff', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transform: `scale(${1 - press * 0.05})` }}><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M13 2L3 14h8l-1 8 10-12h-8z" /></svg>Connect DNS</div>}
                    <div style={{ fontSize: 15, color: color.g700, fontWeight: 600, width: 80, textAlign: 'right' }}>{r.links}</div>
                    <div style={{ fontSize: 15, color: color.g500, width: 110 }}>{i === 0 ? 'just now' : '2 months ago'}</div>
                    <span style={{ fontSize: 18, color: color.g600, letterSpacing: 1 }}>⋮</span>
                </div>
            ))}
        </div>
    );
}

export type Verify = { dns: number; https: number };
/** The Connect DNS window on its Manual tab for a root domain on the A-record path: A + TXT, and a
    CNAME for www. Layout after the 2026-10-05 screenshot (steps 1–3, record type switch, live checks).
    Provider shown generically ("Your DNS provider") instead of the detected registrar. */
export function ConnectDns({ p, copied, verify, tab = 'manual', k = 1 }: { p: RedirectDomainProps; copied: number; verify: Verify; tab?: 'manual' | 'automatic'; k?: number }) {
    const edge = p.records[2].value;
    const connected = verify.dns > 0.9; // the last row has just flipped to Found
    return (
        <div style={{ position: 'absolute', inset: 0, background: `rgba(16,24,40,${0.35 * k})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.sans }}>
            <div style={{ width: 1060, borderRadius: 18, background: '#fff', boxShadow: '0 30px 80px rgba(16,24,40,.3)', overflow: 'hidden', ...fx(k, 0, (1 - k) * 30, lerp(0.97, 1, k)) }}>
                <div style={{ padding: '20px 26px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ position: 'relative', width: 46, height: 46, borderRadius: 10, background: connected ? '#E3EEF9' : '#FDF1E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconGlobe size={24} color={connected ? color.blue : '#C77A12'} /><i style={{ position: 'absolute', right: -4, bottom: -4, width: 12, height: 12, borderRadius: 6, border: '2px solid #fff', background: connected ? ok : warn.dot }} /></div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontFamily: font.mono, fontSize: 22, fontWeight: 700, color: color.charcoal }}>{p.oldDomain}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 12, background: connected ? okSoft.bg : warn.bg, color: connected ? okSoft.text : warn.text, fontSize: 13, fontWeight: 600 }}><i style={{ width: 6, height: 6, borderRadius: 3, background: connected ? ok : warn.dot }} />{connected ? 'Connected' : 'Not connected'}</span>
                        </div>
                        <div style={{ fontSize: 15, color: color.g600, marginTop: 2 }}>Connect DNS so its 1 link starts working</div>
                    </div>
                    <span style={{ marginLeft: 'auto', width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color.g600, fontSize: 18 }}>×</span>
                </div>
                {/* Status strip */}
                <div style={{ margin: '14px 26px 0', height: 56, borderRadius: 12, border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontSize: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.g600} strokeWidth="2"><rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /></svg></div>
                    <div><div style={{ fontWeight: 600, color: color.charcoal }}>Your DNS provider</div><div style={{ color: color.g500, fontSize: 12.5 }}>wherever your domain lives</div></div>
                    <span style={{ height: 30, padding: '0 10px', borderRadius: 15, background: connected ? okSoft.bg : warn.bg, color: connected ? okSoft.text : warn.text, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', border: `1px solid ${connected ? '#ABEFC6' : warn.line}` }}>{connected ? 'Records found' : 'A record missing'}</span>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: '#E3EEF9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill={color.blue}><path d="M13 2L3 14h8l-1 8 10-12h-8z" /></svg></div>
                    <div><div style={{ fontWeight: 600, color: color.charcoal }}>RedirHub edge</div><div style={{ color: color.g500, fontSize: 12.5, fontFamily: font.mono }}>{edge}</div></div>
                    <span style={{ flex: 1, borderTop: `2px dashed ${color.g300}` }} />
                    <div style={{ width: 30, height: 30, borderRadius: 15, border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconLink size={16} color={color.g600} /></div>
                    <div><div style={{ fontWeight: 600, color: color.charcoal }}>1 link</div><div style={{ color: color.g500, fontSize: 12.5 }}>{connected ? 'live' : 'waiting'}</div></div>
                </div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 24, padding: '14px 26px 0', borderBottom: `1px solid ${border}`, margin: '0 26px' }}>
                    {([['manual', 'Manual'], ['automatic', 'Automatic'], ['nameservers', 'Nameservers']] as const).map(([key, label]) => (
                        <div key={key} style={{ padding: '8px 2px 12px', fontSize: 16, fontWeight: 600, color: key === tab ? color.blue : key === 'nameservers' || key === 'automatic' ? color.g500 : color.g700, borderBottom: key === tab ? `2.5px solid ${color.blue}` : '2.5px solid transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {label}
                            {key === 'manual' && <span style={{ height: 20, padding: '0 8px', borderRadius: 10, background: okSoft.bg, color: okSoft.text, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Recommended</span>}
                            {key === 'automatic' && <span style={{ color: color.g400 }}>⊘</span>}
                            {key === 'nameservers' && <span style={{ height: 20, padding: '0 8px', borderRadius: 10, background: warn.bg, color: warn.text, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Add-on</span>}
                        </div>
                    ))}
                </div>
                <div style={{ padding: '14px 26px 20px' }}>
                    {tab === 'manual' ? (
                        <>
                            <div style={{ fontSize: 15, color: color.g600 }}>Your provider doesn’t support automatic setup yet, so copy the records below. About 2 minutes.</div>
                            <Step n={1} title="Open your DNS at your provider">
                                <span style={{ height: 36, padding: '0 14px', borderRadius: 9, border: `1.5px solid ${border}`, fontSize: 14.5, fontWeight: 600, color: color.g700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>Open DNS settings ↗</span>
                            </Step>
                            <Step n={2} title="Add these records">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: color.g600 }}>Record type
                                    <span style={{ height: 32, padding: '0 12px', borderRadius: 16, border: `1.5px solid ${border}`, color: color.g700, fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>CNAME</span>
                                    <span style={{ height: 32, padding: '0 12px', borderRadius: 16, border: `1.5px solid ${color.blue}`, background: '#EEF6FD', color: color.blue, fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>A record</span>
                                </span>
                            </Step>
                            <div style={{ marginLeft: 40, borderRadius: 10, border: `1.5px solid ${border}`, overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '110px 110px 1fr 120px', padding: '8px 16px', background: color.g50, fontSize: 13, fontWeight: 600, color: color.g600 }}><span>Type</span><span>Name</span><span>Value</span><span /></div>
                                {p.records.map((r, i) => {
                                    const done = i === 0 ? verify.dns > 0.3 : i === 1 ? verify.dns > 0.6 : verify.dns > 0.9;
                                    return (
                                        <div key={r.type + r.name} style={{ display: 'grid', gridTemplateColumns: '110px 110px 1fr 120px', alignItems: 'center', padding: '10px 16px', borderTop: `1px solid ${border}`, fontFamily: font.mono, fontSize: 16, color: color.charcoal }}>
                                            <span style={{ fontWeight: 700 }}>{r.type}</span><span>{r.name}</span><span style={{ fontWeight: 600 }}>{r.value}</span>
                                            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                {done ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: okSoft.text, fontFamily: font.sans, fontSize: 14, fontWeight: 700 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: ok }} />Found</span>
                                                    : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: `1.5px solid ${i < copied ? color.teal : border}`, fontFamily: font.sans, fontSize: 13.5, fontWeight: 600, color: i < copied ? '#138373' : color.g700 }}><IconCopy size={14} color={i < copied ? '#138373' : color.g600} />{i < copied ? 'Copied' : 'Copy'}</span>}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginLeft: 40, marginTop: 8, fontSize: 13.5, color: color.g500 }}>Most hosts accept a CNAME. If yours refuses it, switch to A record. The www CNAME keeps the www version working.</div>
                            <Step n={3} title="We check every few seconds">
                                <span style={{ fontSize: 14, color: color.g500 }}>You can close this. We email you when it’s live.</span>
                            </Step>
                            <div style={{ marginLeft: 40, display: 'flex', gap: 12 }}>
                                <Check k={verify.dns} label="DNS" sub={verify.dns > 0.9 ? 'Records found' : 'Checking…'} />
                                <Check k={verify.https} label="HTTPS" sub={verify.https >= 1 ? 'Certificate issued' : verify.dns >= 1 ? 'Issuing certificate…' : 'Waiting for DNS'} />
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: 16, color: color.g600, lineHeight: 1.5 }}>
                            Your DNS is at <b style={{ color: color.g700 }}>Cloudflare</b>. Approve the records once at Cloudflare and come straight back.
                            <div style={{ marginTop: 16, display: 'inline-flex', height: 46, padding: '0 20px', borderRadius: 10, background: '#2E7BC4', color: '#fff', fontSize: 16, fontWeight: 600, alignItems: 'center' }}>Continue with Cloudflare</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Step({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, marginBottom: 8 }}>
            <span style={{ width: 26, height: 26, borderRadius: 13, background: '#E3EEF9', color: color.blue, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: color.charcoal }}>{title}</span>
            <span style={{ marginLeft: 'auto' }}>{children}</span>
        </div>
    );
}

function Check({ k, label, sub }: { k: number; label: string; sub: string }) {
    const done = k >= 1;
    return (
        <div style={{ flex: 1, height: 58, borderRadius: 10, border: `1.5px solid ${done ? '#ABEFC6' : border}`, background: done ? okSoft.bg : '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: done ? ok : color.g100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.6" strokeLinecap="round" style={{ transform: `rotate(${k * 720}deg)` }}><path d="M20 12a8 8 0 1 1-2.3-5.6" /></svg>}
            </div>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: done ? okSoft.text : color.g700 }}>{label}</div><div style={{ fontSize: 13, color: done ? okSoft.text : color.g500 }}>{sub}</div></div>
        </div>
    );
}

export function Toast({ k, text }: { k: number; text: string }) {
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16, display: 'flex', justifyContent: 'center', ...fx(k, 0, (1 - k) * -40) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 12, background: '#fff', border: `1.5px solid ${border}`, boxShadow: '0 20px 40px rgba(16,24,40,.18)', fontFamily: font.sans }}>
                <svg width="22" height="22" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={ok} /><path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 17, fontWeight: 600, color: color.charcoal }}>{text}</span>
            </div>
        </div>
    );
}
