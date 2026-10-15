/* RedirHub's product UI for W43, from the approved key frames (w43-DomainRedirect, w43-LinksList,
   w43-ConnectDNS, w43-HttpsIssued): the Unified Links prototype's shell (grey sidebar, inset panel,
   breadcrumb, orange split Create), its card list and full-page "New domain redirect" form; the create
   chooser and the Connect DNS dialog as in the product (W41's captures). Inter and the app's colours
   only; every state is a prop so scenes animate it as a function of time. */
import type { CSSProperties, ReactNode } from 'react';
import { IconLink, IconQr, IconRedirect, IconUpload } from '../../components/icons';
import { clamp } from '../../lib/anim';
import { MONO, UI, mix, smooth } from './kit';

const SV = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const Ico = ({ d, size = 18, children }: { d?: string; size?: number; children?: ReactNode }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...SV} aria-hidden="true" style={{ flexShrink: 0 }}>{d ? <path d={d} /> : children}</svg>
);
const NAV: readonly { key: string; label: string; d: string }[] = [
    { key: 'analytics', label: 'Analytics', d: 'M18 20V10M12 20V4M6 20v-6' },
    { key: 'links', label: 'Links', d: 'M4 7h13M17 7l-3-3M17 7l-3 3M20 17H7M7 17l3-3M7 17l3 3' },
    { key: 'monitor', label: 'Monitor', d: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { key: 'hostnames', label: 'Hostnames', d: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01' },
];
const WS: readonly { label: string; d: string }[] = [
    { label: 'AI assistants', d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' },
    { label: 'Members', d: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { label: 'Plan & billing', d: 'M2 6h20v12H2zM2 10h20' },
];

/** The app shell at its native size (w × h); the caller scales it. `pulse` 0–1 rings the active nav item. */
export function Shell({ w, h, active, counts, crumb, pulse = 0, right, children }: {
    w: number; h: number; active: 'links' | 'hostnames'; counts: { links: number; hostnames: number }; crumb: string; pulse?: number; right?: ReactNode; children: ReactNode;
}) {
    return (
        <div style={{ width: w, height: h, display: 'flex', background: '#F2F4F7', fontFamily: UI, color: '#181D27' }}>
            <aside style={{ width: 236, height: h, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 12px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 6, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    <svg width="26" height="26" viewBox="0 0 120 120" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M3 0H95Q107 0 107 12V70L83 93V23H24Z" fill="#E59426" /><path d="M25 80L66 39V79L25 120Z" fill="#20A795" /><rect x="9" y="5.5" width="34" height="2.6" fill="#F2F4F7" /><rect x="16" y="13.5" width="27" height="2.6" fill="#F2F4F7" /></svg>RedirHub
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: '#FFFFFF', border: '1px solid #EAECF0' }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: '#E8F0F8', color: '#1962A4', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>MB</span>
                    <span style={{ flexGrow: 1, fontSize: 14, fontWeight: 600 }}>My Brand</span>
                    <span style={{ display: 'inline-flex', color: '#98A2B3' }}><Ico size={15} d="M7 15l5 5 5-5M7 9l5-5 5 5" /></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV.map((n) => {
                        const on = n.key === active;
                        const count = n.key === 'links' ? counts.links : n.key === 'hostnames' ? counts.hostnames : null;
                        return (
                            <span key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, fontSize: 14, whiteSpace: 'nowrap', fontWeight: on ? 600 : 500, color: on ? '#181D27' : '#414651', background: on ? '#FFFFFF' : undefined, boxShadow: on ? `0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0, 0 0 0 ${4 * pulse}px rgba(28,109,182,${0.25 * pulse})` : undefined }}>
                                <span style={{ display: 'inline-flex', color: on ? '#1C6DB6' : '#717680' }}><Ico d={n.d} /></span>
                                <span style={{ flexGrow: 1 }}>{n.label}</span>
                                {count !== null && count > 0 && <span style={{ fontSize: 12, fontWeight: 500, color: '#98A2B3' }}>{count}</span>}
                            </span>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ padding: '8px 10px 4px', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', color: '#98A2B3' }}>WORKSPACE</span>
                    {WS.map((n) => (
                        <span key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#414651' }}><span style={{ display: 'inline-flex', color: '#717680' }}><Ico d={n.d} /></span>{n.label}</span>
                    ))}
                </div>
            </aside>
            <div style={{ margin: '8px 8px 8px 0', height: h - 16, borderRadius: 16, background: '#FFFFFF', boxShadow: '0 1px 2px rgba(16,24,40,0.05), 0 0 0 1px #EAECF0', overflow: 'hidden', flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px 0 24px', borderBottom: '1px solid #EAECF0', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 14, color: '#717680' }}>My Brand</span><span style={{ margin: '0 8px', color: '#D5D7DA' }}>/</span><span style={{ fontSize: 14, fontWeight: 600 }}>{crumb}</span>
                    <span style={{ flexGrow: 1 }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 180, height: 36, padding: '0 10px 0 12px', marginRight: right ? 12 : 0, border: '1px solid #D5D7DA', borderRadius: 10, fontSize: 14, color: '#717680', boxSizing: 'border-box' }}>
                        <Ico size={16}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Ico><span style={{ flexGrow: 1 }}>Search</span><span style={{ fontSize: 11, color: '#98A2B3', border: '1px solid #EAECF0', borderRadius: 5, padding: '1px 6px' }}>⌘K</span>
                    </span>
                    {right}
                </div>
                {children}
            </div>
        </div>
    );
}

/** The orange split Create button (the frame's one amber object). `press` 0–1 squeezes it. */
export function CreateButton({ press = 0, ring = 0 }: { press?: number; ring?: number }) {
    const sw = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
    return (
        <span style={{ display: 'inline-flex', height: 40, borderRadius: 12, overflow: 'hidden', background: '#E59426', color: '#FFFFFF', fontSize: 14, fontWeight: 600, willChange: 'transform', transform: `scale(${1 - 0.06 * press})`, boxShadow: `0 0 0 ${4 * ring}px rgba(229,148,38,${0.3 * ring})` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 10px 0 14px' }}><svg width="20" height="20" viewBox="0 0 24 24" {...sw} aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Create</span>
            <span style={{ width: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.4)' }}><svg width="20" height="20" viewBox="0 0 24 24" {...sw} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></span>
        </span>
    );
}

/** The Links list body: filter chips and one card per redirect. `rows[i].k` 0–1 is that card's entrance. */
export function LinksBody({ rows, main }: { rows: readonly { domain: string; k: number }[]; main: string }) {
    const n = rows.filter((r) => r.k > 0).length;
    return (
        <div style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 180, height: 40, padding: '0 12px', border: '1px solid #D5D7DA', borderRadius: 8, fontSize: 15, color: '#717680', boxSizing: 'border-box' }}><Ico><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Ico>Search</span>
                <Chip on label="All" n={n} />
                {n > 0 && <Chip label="Domain redirects" n={n} />}
            </div>
            {rows.map((r) => r.k > 0 && (
                <div key={r.domain} style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, padding: '12px 16px', background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12, opacity: clamp(r.k * 2), willChange: 'transform', transform: `translate3d(0, ${(1 - r.k) * 14}px, 0) rotate(0.02deg)`, boxShadow: `0 0 0 ${3 * clamp((1 - r.k) * 3)}px rgba(32,167,149,0.35)` }}>
                    <span style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, borderRadius: 999, boxShadow: 'inset 0 0 0 1px #EAECF0', fontSize: 12, fontWeight: 600, color: '#414651', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>MB<span style={{ position: 'absolute', right: 1, bottom: 1, width: 10, height: 10, borderRadius: 999, background: '#12B76A' }} /></span>
                    <div style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 18, fontWeight: 500, color: '#344054' }}>{r.domain}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#717680' }}>↳ https://{main}</span>
                    </div>
                    <span style={{ fontSize: 14, color: '#344054', whiteSpace: 'nowrap' }}><strong>0</strong> Clicks</span>
                    <span style={{ width: 72, fontSize: 14, color: '#414651', whiteSpace: 'nowrap' }}>just now</span>
                    <span style={{ display: 'flex', gap: 4, color: '#414651' }}><Ico size={20}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></Ico><span style={{ width: 6 }} /><Ico size={20} d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></span>
                </div>
            ))}
        </div>
    );
}
function Chip({ label, n, on = false }: { label: string; n: number; on?: boolean }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 6px 0 14px', borderRadius: 999, border: `1px solid ${on ? '#8EB6DB' : '#D5D7DA'}`, background: on ? '#E8F0F8' : undefined, fontSize: 14, fontWeight: on ? 600 : 500, color: on ? '#1962A4' : '#414651' }}>
            {label}<span style={{ minWidth: 22, height: 24, padding: '0 8px', boxSizing: 'border-box', borderRadius: 999, background: on ? '#FFFFFF' : '#F2F4F7', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
        </span>
    );
}

/** The create chooser (product copy from W41's captures). `pick` 0–1 selects Domain Redirect. */
export function CreateChooser({ pick = 0 }: { pick?: number }) {
    const items: readonly [string, string, string, (p: { size?: number; color?: string }) => ReactNode, string, string][] = [
        ['Branded Link', 'A short, memorable link on a domain you own.', 'acme.co/summer → your campaign page', IconLink, '#E3EEF9', '#1C6DB6'],
        ['Dynamic QR Code', 'A trackable QR whose destination can change after it is printed.', 'Packaging, posters, business cards', IconQr, '#FDF1E2', '#C77A12'],
        ['Domain Redirect', 'Redirect a domain, subdomain or path — 301 or 302.', 'old-acme.com → acme.com', IconRedirect, '#E6F6F0', '#12855F'],
        ['Website Migration', 'Move many URLs with one same-path rule, or map them one-to-one.', 'Replatforming, domain change, site restructure', IconUpload, '#F2F4F7', '#344054'],
    ];
    return (
        <div style={{ width: 800, borderRadius: 18, background: '#FFFFFF', boxShadow: '0 30px 80px rgba(16,24,40,0.3)', overflow: 'hidden', fontFamily: UI, color: '#181D27' }}>
            <div style={{ padding: '26px 28px 0' }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>What do you want to create?</div>
                <div style={{ fontSize: 15, color: '#667085', marginTop: 6 }}>Pick the job. Everything you create here is managed together in Links.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '20px 28px 22px' }}>
                {items.map(([title, body, example, Icon, tile, ic], i) => {
                    const on = i === 2 ? pick : 0;
                    return (
                        <div key={title} style={{ borderRadius: 12, border: `1.5px solid ${mix('#EAECF0', '#1C6DB6', on)}`, background: mix('#FFFFFF', '#F5F9FD', on), boxShadow: `0 0 0 ${4 * on}px rgba(28,109,182,0.16)`, padding: '18px 20px 14px', willChange: 'transform', transform: `scale(${1 + on * 0.015})` }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: tile, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={ic} /></div>
                            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 14 }}>{title}</div>
                            <div style={{ fontSize: 14.5, color: '#475467', marginTop: 4, lineHeight: 1.4, minHeight: 40 }}>{body}</div>
                            <div style={{ borderTop: '1px solid #EAECF0', marginTop: 12, paddingTop: 10, fontSize: 14, color: '#667085' }}>{example}</div>
                        </div>
                    );
                })}
            </div>
            <div style={{ background: '#F9FAFB', borderTop: '1px solid #EAECF0', padding: '14px 28px', fontSize: 15, color: '#475467', display: 'flex', gap: 10, alignItems: 'center' }}>
                <IconUpload size={18} color="#475467" />Already have a spreadsheet of links? <span style={{ color: '#1C6DB6', fontWeight: 600 }}>Import CSV</span>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- the New domain redirect form */
export type FormState = {
    from: string; to: string; caret: 'from' | 'to' | null;
    type301: number; keepPath: number;      // 0–1 emphasis ring (both are the defaults, so always selected)
    hops: number;                           // 0–3 example rows shown in What happens
    hopRing: number;                        // 0–1 ring on the deep-path hop (the one she says)
    wwwRing: number;                        // 0–1 teal ring on "A root domain also covers www."
    warn: number;                           // 0–1 the "doesn't point to RedirHub yet" note
    save: number;                           // 0–1 Create redirect press
};
export function RedirectForm({ s, main, from, deepPath }: { s: FormState; main: string; from: string; deepPath: string }) {
    const field = (v: string, caret: boolean, ph: string): ReactNode => (
        <div style={{ height: 44, padding: '0 14px', border: `1px solid ${caret ? '#8EB6DB' : '#D5D7DA'}`, boxShadow: caret ? '0 0 0 3px #E8F0F8' : undefined, borderRadius: 8, display: 'flex', alignItems: 'center', fontSize: 15, color: v ? '#181D27' : '#98A2B3', boxSizing: 'border-box', whiteSpace: 'pre' }}>
            {v || ph}{caret && <i style={{ display: 'inline-block', width: 1.5, height: 18, background: '#1C6DB6', marginLeft: 1 }} />}
        </div>
    );
    const hops: readonly [string, string][] = [[from, main], [from + deepPath, main + deepPath], [`${from}/blog/launch?ref=x`, `${main}/blog/launch?ref=x`]];
    return (
        <div style={{ width: 1235, height: 566, background: '#F9FAFB', display: 'flex', flexDirection: 'column', fontFamily: UI, color: '#181D27' }}>
            <div style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px', background: '#FFFFFF', borderBottom: '1px solid #EAECF0', boxSizing: 'border-box' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#414651' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#414651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>Back</span>
                <span style={{ width: 1, height: 24, background: '#EAECF0' }} />
                <span style={{ fontSize: 18, fontWeight: 600, color: '#344054' }}>New domain redirect</span>
                <span style={{ flexGrow: 1 }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 14px', border: '1px solid #D5D7DA', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#344054' }}>Cancel</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 16px', borderRadius: 8, background: mix('#337CBD', '#1C6DB6', s.save), fontSize: 14, fontWeight: 600, color: '#FFFFFF', willChange: 'transform', transform: `scale(${1 - 0.06 * Math.sin(Math.PI * s.save)})`, boxShadow: `0 0 0 ${4 * Math.sin(Math.PI * s.save)}px rgba(28,109,182,0.25)` }}>Create redirect</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 26, padding: '24px 26px' }}>
                <div style={{ width: 560, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20, padding: '22px 26px', background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12, boxSizing: 'border-box', alignSelf: 'flex-start' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 24px minmax(0,1fr)', alignItems: 'end', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#344054' }}>Redirect from</span>{field(s.from, s.caret === 'from', '')}</div>
                        <span style={{ height: 44, display: 'flex', alignItems: 'center', color: '#717680' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#717680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#344054' }}>Redirect to</span>{field(s.to, s.caret === 'to', '')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: -8, fontSize: 13, color: '#717680' }}>
                        <span style={{ fontWeight: 600, color: '#1C6DB6' }}>+ Add another source</span>
                        <span style={{ padding: '3px 8px', borderRadius: 6, boxShadow: `0 0 0 ${2 * s.wwwRing}px #20A795, 0 0 0 ${2 + 5 * s.wwwRing}px rgba(32,167,149,${0.18 * s.wwwRing})`, color: mix('#717680', '#181D27', s.wwwRing), fontWeight: 500 }}>A root domain also covers www.</span>
                    </div>
                    <Radios label="Redirect type" k={s.type301} items={[['301 · Permanent', 'Moved for good. Passes SEO value.'], ['302 · Temporary', 'For now. Browsers won’t cache it.']]}
                        foot={<span style={{ fontSize: 13, fontWeight: 600, color: '#1C6DB6' }}>More types <span style={{ fontWeight: 400, color: '#717680' }}>307 · 308 · Custom HTML</span></span>} />
                    <Radios label="Paths" k={s.keepPath} items={[['Keep the path', `/about goes to ${main}/about`], ['Everything to one URL', `Every path lands on ${main}`]]} />
                </div>
                <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, alignSelf: 'flex-start' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: '#717680' }}>WHAT HAPPENS</span>
                    <div style={{ background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12, overflow: 'hidden', opacity: clamp(s.hops * 2) }}>
                        {hops.map(([a, b], i) => {
                            const k = clamp(s.hops - i);
                            if (k <= 0) return null;
                            const ring = i === 1 ? s.hopRing : 0;
                            // The row opens to its height, so the panel below glides down instead of jumping a row.
                            return (
                                <div key={i} style={{ maxHeight: 66 * smooth(k), overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4, padding: `${12 * smooth(k)}px 14px`, borderTop: i ? '1px solid #EAECF0' : undefined, fontSize: 13, opacity: smooth(k), background: ring > 0 ? `rgba(32,167,149,${0.08 * ring})` : undefined, boxShadow: ring > 0 ? `inset 3px 0 0 rgba(32,167,149,${ring})` : undefined }}>
                                    <span style={{ color: '#414651' }}>{a}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}><span style={{ fontSize: 11, fontWeight: 700, color: '#1C6DB6', background: '#E8F0F8', borderRadius: 4, padding: '1px 5px' }}>301</span>{b}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#FFFAEB', border: '1px solid #FEDF89', fontSize: 13, lineHeight: '19px', color: '#7A2E0E', opacity: s.warn, willChange: 'transform', transform: `translate3d(0, ${(1 - s.warn) * 8}px, 0) rotate(0.02deg)` }}>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span><b>{from}</b> doesn&apos;t point to RedirHub yet. The redirect is saved now and goes live when DNS is updated.</span>
                            <span style={{ fontWeight: 600, color: '#B54708' }}>See DNS records in Hostnames</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
function Radios({ label, k, items, foot }: { label: string; k: number; items: readonly [string, string][]; foot?: ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#344054' }}>{label}</span>
            <div style={{ display: 'flex', gap: 10 }}>
                {items.map(([t, sub], i) => {
                    const on = i === 0;
                    const hl = on ? k : 0;
                    return (
                        <div key={t} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', border: '1px solid', borderRadius: 12, borderColor: on ? '#8EB6DB' : '#EAECF0', background: on ? '#F5F9FC' : '#FFFFFF', boxShadow: on ? `0 0 0 3px #E8F0F8, 0 0 0 ${3 + 3 * hl}px rgba(32,167,149,${0.55 * hl})` : undefined }}>
                            <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, borderRadius: 999, boxSizing: 'border-box', border: on ? '5px solid #1C6DB6' : '1.5px solid #D5D7DA' }} />
                            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{t}</span><span style={{ fontSize: 13, color: '#717680' }}>{sub}</span></span>
                        </div>
                    );
                })}
            </div>
            {foot}
        </div>
    );
}

/* ---------------------------------------------------------------- Hostnames + Connect DNS */
export function HostnamesBody({ domains, warn = [] }: { domains: readonly string[]; warn?: readonly number[] }) {
    return (
        <div style={{ padding: '22px 24px' }}>
            <div style={{ border: '1px solid #EAECF0', borderRadius: 12, overflow: 'hidden' }}>
                {domains.map((d, i) => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: i ? '1px solid #EAECF0' : undefined, fontSize: 15 }}>
                        <span style={{ fontFamily: MONO, flexGrow: 1 }}>{d}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#717680' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E59426', opacity: warn[i] ?? 0, willChange: 'transform', transform: `scale(${0.6 + 0.4 * (warn[i] ?? 0)})` }} />Not connected</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export type DialogState = {
    rows: readonly [number, number, number];   // 0–1 highlight per record row (A, TXT, CNAME)
    values: number;                             // 0–1 glow on every value ("copy yours")
    auto: number;                               // 0–1 focus on the Automatic tab + Continue with Cloudflare
    mx: number;                                 // 0–1 highlight on the dialog's own MX sentence
};
export type DnsRecord = { change: 'Replace' | 'Add'; type: string; name: string; from?: string; value: string };
const GRID: CSSProperties = { display: 'grid', gridTemplateColumns: '130px 100px 80px minmax(0, 1fr)', alignItems: 'center', padding: '12px 20px' };
export function ConnectDialog({ domain, oldIp, edge, records, s }: { domain: string; oldIp: string; edge: string; records: readonly DnsRecord[]; s: DialogState }) {
    const ring = (k: number): CSSProperties => ({ boxShadow: `0 0 0 ${3 * k}px rgba(28,109,182,${0.22 * k})` });
    return (
        <div style={{ width: 1110, height: 770, boxSizing: 'border-box', borderRadius: 24, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 24px 48px rgba(16,24,40,0.24)', fontFamily: UI, color: '#181D27', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '26px 34px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ width: 54, height: 54, flex: 'none', borderRadius: 12, background: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#475467" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontFamily: MONO, fontSize: 32, fontWeight: 500 }}>{domain}</span>
                            <span style={{ padding: '4px 10px', borderRadius: 8, background: '#F2F4F7', fontSize: 15, fontWeight: 500, color: '#344054' }}>Root domain</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', borderRadius: 8, background: 'rgba(229,148,38,0.12)', fontSize: 15, fontWeight: 600, color: '#B42318' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E59426' }} />Not connected</span>
                        </div>
                        <span style={{ fontSize: 20, color: '#475467' }}>Connect DNS so its 1 link starts working</span>
                    </div>
                </div>
                <div style={{ height: 78, boxSizing: 'border-box', borderRadius: 14, background: '#F9FAFB', boxShadow: 'inset 0 0 0 1.5px #EAECF0', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 17, fontWeight: 600 }}>Cloudflare DNS</span><span style={{ fontFamily: MONO, fontSize: 14, color: '#475467' }}>…ns.cloudflare.com</span></div>
                    <span style={{ padding: '5px 12px', borderRadius: 16, background: '#FFFFFF', boxShadow: 'inset 0 0 0 1.5px #D0D5DD', fontSize: 14, fontWeight: 600, color: '#344054' }}>A points to {oldIp}</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C6DB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 17, fontWeight: 600 }}>RedirHub edge</span><span style={{ fontFamily: MONO, fontSize: 14, color: '#475467' }}>{edge}</span></div>
                    <span style={{ flex: 1, borderTop: '2px dashed #D0D5DD' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 17, fontWeight: 600 }}>1 link</span><span style={{ fontSize: 14, color: '#667085' }}>waiting</span></div>
                </div>
                <div style={{ display: 'flex', gap: 34, borderBottom: '1.5px solid #EAECF0', fontSize: 21, fontWeight: 600 }}>
                    <span style={{ padding: '0 0 12px', borderBottom: '3px solid #1C6DB6', color: '#1C6DB6', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 4, ...ring(s.auto) }}>Automatic <span style={{ padding: '2px 9px', borderRadius: 8, background: '#ECFDF3', color: '#067647', fontSize: 14 }}>Recommended</span></span>
                    <span style={{ padding: '0 0 12px', color: '#475467' }}>Manual</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 600 }}>Cloudflare will make these changes</span>
                <div style={{ borderRadius: 12, boxShadow: 'inset 0 0 0 1.5px #EAECF0', overflow: 'hidden', fontSize: 17 }}>
                    <div style={{ ...GRID, padding: '10px 20px', background: '#F9FAFB', color: '#475467', fontSize: 16 }}><span>Change</span><span>Type</span><span>Name</span><span>Value</span></div>
                    {records.map((r, i) => {
                        const k = s.rows[i];
                        return (
                            <div key={r.type} style={{ ...GRID, borderTop: '1px solid #EAECF0', fontFamily: MONO, fontSize: 21, background: `rgba(28,109,182,${0.07 * k})`, boxShadow: `inset 4px 0 0 rgba(28,109,182,${k})` }}>
                                <span style={{ width: 'fit-content', padding: '3px 10px', borderRadius: 7, background: r.change === 'Add' ? '#ECFDF3' : '#F2F4F7', fontFamily: UI, fontSize: 15, fontWeight: 600, color: r.change === 'Add' ? '#067647' : '#344054' }}>{r.change}</span>
                                <span style={{ fontWeight: k > 0.5 ? 600 : 400 }}>{r.type}</span><span>{r.name}</span>
                                <span><span style={{ borderRadius: 6, padding: '2px 4px', margin: '0 -4px', background: `rgba(32,167,149,${0.2 * s.values})` }}>{r.from && <><span style={{ color: '#98A2B3', textDecoration: 'line-through' }}>{r.from}</span> → </>}{r.value}</span></span>
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: '#1C6DB6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                    Also connect <span style={{ fontWeight: 600 }}>www.{domain}</span>
                </div>
                <div style={{ padding: '14px 18px', borderRadius: 12, background: '#F9FAFB', fontSize: 18, lineHeight: 1.5, color: '#344054' }}>
                    A root domain can point to one place only, so whatever runs on {oldIp} stops getting visitors from {domain}. <span style={{ borderRadius: 4, background: `rgba(32,167,149,${0.18 * s.mx})`, boxShadow: `0 0 0 ${3 * s.mx}px rgba(32,167,149,${0.18 * s.mx})` }}>Email (MX) and every other record stay as they are.</span>
                </div>
            </div>
            <div style={{ marginTop: 'auto', height: 84, flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '0 34px', borderTop: '1.5px solid #EAECF0', background: '#F9FAFB' }}>
                <span style={{ flex: 1, fontSize: 19, color: '#475467' }}>You approve on Cloudflare and come straight back.</span>
                <span style={{ height: 50, padding: '0 22px', borderRadius: 10, background: '#FFFFFF', boxShadow: 'inset 0 0 0 1.5px #D0D5DD', fontSize: 18, fontWeight: 600, color: '#344054', display: 'inline-flex', alignItems: 'center' }}>Later</span>
                <span style={{ height: 50, padding: '0 22px', borderRadius: 10, background: '#1C6DB6', color: '#FFFFFF', fontSize: 18, fontWeight: 600, display: 'inline-flex', alignItems: 'center', ...ring(s.auto) }}>Continue with Cloudflare</span>
            </div>
        </div>
    );
}
