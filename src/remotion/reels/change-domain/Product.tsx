/* RedirHub's product UI for W44, from the approved key frames (w44-Migration, w44-Preview, w44-Watch), which
   follow the Dashboard (lviv) prototype's "New website migration" page (03-create-migration, labels verbatim)
   and the app shell of W43's Product.tsx, in the story's own workspace (Frosty Bites, open-questions UI-10).
   The create chooser is the product's (W41's captures). Inter and the app's colours only; every state is a
   prop so scenes animate it as a function of time. */
import type { CSSProperties, ReactNode } from 'react';
import { IconLink, IconQr, IconRedirect, IconUpload } from '../../components/icons';
import { clamp, easeOut } from '../../lib/anim';
import { C, MONO, Roll, UI, mix, smooth } from './kit';
import { NAMES } from './props';

const SV = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export const Ico = ({ d, size = 18, color, sw = 1.8, children }: { d?: string; size?: number; color?: string; sw?: number; children?: ReactNode }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...SV} stroke={color ?? 'currentColor'} strokeWidth={sw} aria-hidden="true" style={{ flexShrink: 0 }}>{d ? <path d={d} /> : children}</svg>
);
const NAV = [
    { label: 'Analytics', d: 'M18 20V10M12 20V4M6 20v-6' },
    { label: 'Links', d: 'M4 7h13M17 7l-3-3M17 7l-3 3M20 17H7M7 17l3-3M7 17l3 3' },
    { label: 'Monitor', d: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    { label: 'Hostnames', d: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01' },
] as const;
const WS = [
    { label: 'AI assistants', d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' },
    { label: 'Members', d: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
    { label: 'Plan & billing', d: 'M2 6h20v12H2zM2 10h20' },
] as const;

/** The app shell at its native size; the caller scales it. `crumbs` is the breadcrumb (last one bold). */
export function Shell({ w, h, active, crumbs, right, pulse = 0, children }: { w: number; h: number; active: 'Analytics' | 'Links'; crumbs: readonly ReactNode[]; right?: ReactNode; pulse?: number; children: ReactNode }) {
    return (
        <div style={{ width: w, height: h, display: 'flex', background: C.g100, fontFamily: UI, color: C.char }}>
            <aside style={{ width: 236, height: h, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 12px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 6, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    <svg data-logo width="26" height="26" viewBox="0 0 120 120" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M3 0H95Q107 0 107 12V70L83 93V23H24Z" fill="#E59426" /><path d="M25 80L66 39V79L25 120Z" fill="#20A795" /><rect x="9" y="5.5" width="34" height="2.6" fill="#F2F4F7" /><rect x="16" y="13.5" width="27" height="2.6" fill="#F2F4F7" /></svg>RedirHub
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, background: '#FFFFFF', border: '1px solid #EAECF0' }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: '#E8F0F8', color: '#1962A4', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>FB</span>
                    <span style={{ flexGrow: 1, fontSize: 14, fontWeight: 600 }}>{NAMES.newName}</span>
                    <span style={{ display: 'inline-flex', color: '#98A2B3' }}><Ico size={15} d="M7 15l5 5 5-5M7 9l5-5 5 5" /></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV.map((n) => {
                        const on = n.label === active;
                        return (
                            <span key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, fontSize: 14, whiteSpace: 'nowrap', fontWeight: on ? 600 : 500, color: on ? C.char : '#414651', background: on ? '#FFFFFF' : undefined, boxShadow: on ? `0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0, 0 0 0 ${4 * pulse}px rgba(28,109,182,${0.25 * pulse})` : undefined }}>
                                <span style={{ display: 'inline-flex', color: on ? '#1C6DB6' : '#717680' }}><Ico d={n.d} /></span><span style={{ flexGrow: 1 }}>{n.label}</span>
                            </span>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ padding: '8px 10px 4px', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', color: '#98A2B3' }}>WORKSPACE</span>
                    {WS.map((n) => <span key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#414651' }}><span style={{ display: 'inline-flex', color: '#717680' }}><Ico d={n.d} /></span>{n.label}</span>)}
                </div>
            </aside>
            <div style={{ margin: '8px 8px 8px 0', height: h - 16, borderRadius: 16, background: '#FFFFFF', boxShadow: '0 1px 2px rgba(16,24,40,0.05), 0 0 0 1px #EAECF0', overflow: 'hidden', flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 0 24px', borderBottom: '1px solid #EAECF0', boxSizing: 'border-box' }}>
                    {crumbs.map((c, k) => (
                        <span key={k} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {k > 0 && <span style={{ margin: '0 8px 0 -2px', color: '#D5D7DA' }}>/</span>}
                            <span style={{ fontSize: 14, fontWeight: k === crumbs.length - 1 ? 600 : 400, color: k === crumbs.length - 1 ? C.char : '#717680' }}>{c}</span>
                        </span>
                    ))}
                    <span style={{ flexGrow: 1 }} />{right}
                </div>
                <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', background: C.g50 }}>{children}</div>
            </div>
        </div>
    );
}
/** The dashboard window: native w × h drawn at scale s. */
export function Dashboard({ s, w, h, children, style }: { s: number; w: number; h: number; children: ReactNode; style?: CSSProperties }) {
    return (
        <div data-ui="dashboard" style={{ width: Math.round(w * s), height: Math.round(h * s), borderRadius: 24, overflow: 'hidden', background: C.g100, boxShadow: '0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)', fontFamily: UI, color: C.char, ...style }}>
            <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
        </div>
    );
}
/** The orange split Create button. `press` 0–1 squeezes it, `ring` 0–1 rings it. */
export function CreateButton({ press = 0, ring = 0 }: { press?: number; ring?: number }) {
    const sw = { fill: 'none', stroke: '#FFFFFF', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
    return (
        <span style={{ display: 'inline-flex', height: 40, borderRadius: 12, overflow: 'hidden', background: '#E59426', color: '#FFFFFF', fontSize: 14, fontWeight: 600, willChange: 'transform', transform: `scale(${1 - 0.06 * press})`, boxShadow: `0 0 0 ${4 * ring}px rgba(229,148,38,${0.3 * ring})` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 10px 0 14px' }}><svg width="20" height="20" viewBox="0 0 24 24" {...sw} aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Create</span>
            <span style={{ width: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.4)' }}><svg width="20" height="20" viewBox="0 0 24 24" {...sw} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg></span>
        </span>
    );
}
/** The Links page body: search and the "All" chip (the workspace's other links are left out of the shot). */
export function LinksBody() {
    return (
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: 180, height: 40, padding: '0 12px', border: '1px solid #D5D7DA', borderRadius: 8, fontSize: 15, color: '#717680', boxSizing: 'border-box', background: '#FFFFFF' }}><Ico><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Ico>Search</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 14px', borderRadius: 999, border: '1px solid #8EB6DB', background: '#E8F0F8', fontSize: 14, fontWeight: 600, color: '#1962A4' }}>All</span>
        </div>
    );
}
/** The create chooser (product copy from W41's captures). `pick` 0–1 selects Website Migration. */
export function CreateChooser({ pick = 0 }: { pick?: number }) {
    const items: readonly [string, string, string, (p: { size?: number; color?: string }) => ReactNode, string, string][] = [
        ['Branded Link', 'A short, memorable link on a domain you own.', 'acme.co/summer → your campaign page', IconLink, '#E3EEF9', '#1C6DB6'],
        ['Dynamic QR Code', 'A trackable QR whose destination can change after it is printed.', 'Packaging, posters, business cards', IconQr, '#FDF1E2', '#C77A12'],
        ['Domain Redirect', 'Redirect a domain, subdomain or path — 301 or 302.', 'old-acme.com → acme.com', IconRedirect, '#E6F6F0', '#12855F'],
        ['Website Migration', 'Move many URLs with one same-path rule, or map them one-to-one.', 'Replatforming, domain change, site restructure', IconUpload, '#F2F4F7', '#344054'],
    ];
    return (
        <div style={{ width: 800, borderRadius: 18, background: '#FFFFFF', boxShadow: '0 30px 80px rgba(16,24,40,0.3)', overflow: 'hidden', fontFamily: UI, color: C.char }}>
            <div style={{ padding: '26px 28px 0' }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>What do you want to create?</div>
                <div style={{ fontSize: 15, color: '#667085', marginTop: 6 }}>Pick the job. Everything you create here is managed together in Links.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '20px 28px 22px' }}>
                {items.map(([title, body, example, Icon, tile, ic], i) => {
                    const on = i === 3 ? pick : 0;
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

/* ---------------------------------------------------------------- New website migration */
const LBL: CSSProperties = { fontSize: 14, fontWeight: 500, color: '#344054' };
const INP: CSSProperties = { height: 42, padding: '0 14px', border: '1px solid #D5D7DA', borderRadius: 8, background: '#FFFFFF', fontSize: 15, color: C.char, display: 'flex', alignItems: 'center', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden' };
const BTN_S: CSSProperties = { display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 14px', border: '1px solid #D5D7DA', borderRadius: 8, background: '#FFFFFF', fontSize: 14, fontWeight: 600, color: '#344054' };
const BTN_P: CSSProperties = { display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 16px', borderRadius: 8, background: '#1C6DB6', fontSize: 14, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' };
const Tag301 = () => <span style={{ flex: 'none', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: '#E8F0F8', color: '#1C6DB6' }}>301</span>;
const TagSkip = () => <span style={{ flex: 'none', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: '#FEF0C7', color: '#B54708' }}>Skip</span>;
const B = ({ children }: { children: ReactNode }) => <b style={{ color: C.char, fontWeight: 600 }}>{children}</b>;

function MigOption({ title, sub, exA, exB, on, ring = 0 }: { title: string; sub: string; exA: ReactNode; exB: ReactNode; on: number; ring?: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 14px', borderRadius: 12, border: `1px solid ${mix('#EAECF0', '#8EB6DB', on)}`, background: mix('#FFFFFF', '#F5F9FC', on), boxShadow: `0 0 0 ${3 * on}px #E8F0F8${ring > 0 ? `, 0 0 0 ${3 + 3 * ring}px rgba(32,167,149,${0.55 * ring})` : ''}` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ position: 'relative', width: 18, height: 18, flex: 'none', borderRadius: '50%', boxSizing: 'border-box', border: `1.5px solid ${mix('#D5D7DA', '#1C6DB6', on)}`, background: '#FFFFFF' }}>
                    <span style={{ position: 'absolute', inset: 2, borderRadius: '50%', boxShadow: `inset 0 0 0 ${3.5 * on}px #1C6DB6` }} />
                </span>
                <b style={{ fontSize: 14, fontWeight: 600, color: C.char }}>{title}</b>
            </span>
            <small style={{ fontSize: 12.5, lineHeight: '18px', color: '#535862', margin: '2px 0 0 28px' }}>{sub}</small>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8, paddingTop: 8, borderTop: '1px solid #EAECF0', fontSize: 12, color: '#535862' }}><span>{exA}</span><span>{exB}</span></span>
        </div>
    );
}
/** "What happens": rows laid out from the start; `show[i]` 0–1 fades row i in; `ring` rings one row. */
function WhatHappens({ rows, show, foot, ring, ringColor = C.teal, w = 340 }: { rows: readonly [ReactNode, ReactNode, boolean][]; show: readonly number[]; foot: ReactNode; ring?: { row: number; k: number }; ringColor?: string; w?: number }) {
    return (
        <div style={{ width: w, flex: 'none', padding: '20px 20px 20px 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, opacity: smooth((show[0] ?? 1) * 2.5) }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: '#717680' }}>WHAT HAPPENS</span>
            <div style={{ background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12, overflow: 'hidden' }}>
                {rows.map(([a, b, warn], k) => {
                    const r = ring && ring.row === k ? clamp(ring.k) : 0;
                    const o = smooth(show[k] ?? 1);
                    return (
                        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 16px', borderTop: k === 0 ? 0 : '1px solid #EAECF0', fontSize: 13, boxShadow: `inset 0 0 0 ${2 * r}px ${ringColor}` }}>
                            <span style={{ color: '#414651', whiteSpace: 'nowrap', opacity: o, transform: `translate3d(${(1 - easeOut(clamp(show[k] ?? 1))) * 10}px, 0, 0)` }}>{a}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: warn ? '#B54708' : C.char, fontWeight: 500, whiteSpace: 'nowrap', opacity: o }}>{warn ? <TagSkip /> : <Tag301 />}{b}</span>
                        </div>
                    );
                })}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid #EAECF0', background: C.g50, fontSize: 13, color: '#414651' }}>{foot}</div>
            </div>
        </div>
    );
}
const OPT_TYPE = ['M4 7h11a4 4 0 0 1 0 8H8', 'Redirect type', '301 · Permanent'] as const;
const OPT_QUERY = ['M5 12h14M13 6l6 6-6 6', 'Query forwarding', 'Query kept'] as const;
const OPT_DOM = ['M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18', 'Subdomains & HTTPS', 'HTTPS'] as const;
function OptRows({ rows, ring = 0 }: { rows: readonly (readonly [string, string, string])[]; ring?: number }) {
    return (
        <div style={{ background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12 }}>
            {rows.map(([icon, label, val], k) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 46, padding: '0 14px', borderTop: k === 0 ? 0 : '1px solid #EAECF0', fontSize: 14, color: '#344054', borderRadius: 10, boxShadow: k === 0 ? `inset 0 0 0 ${2 * clamp(ring)}px #20A795` : undefined }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: C.g100, color: '#535862', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ico d={icon} size={16} /></span>{label}
                    <span style={{ marginLeft: 'auto', fontSize: 13, color: '#717680' }}>{val}</span><Ico d="M9 6l6 6-6 6" size={16} color="#98A2B3" />
                </div>
            ))}
        </div>
    );
}

export type MigState = {
    /** 0 = Keep the same paths, 1 = Map URLs one by one (the body crossfades, the radios blend). */
    mode: number;
    /** Typed share 0–1 of the two fields (same paths). */
    oldTyped: number; newTyped: number; caret: 'old' | 'new' | null;
    /** Rings 0–1: the same-paths option; the strawberry row in What happens; the CSV card; the skipped row; the
        redirect type; the Create button. */
    sameRing: number; heroRing: number; csvRing: number; skipRing: number; typeRing: number; createRing: number;
    /** What happens rows 0–1 (same paths: 3 rows; map: 3 rows). */
    sameRows: readonly number[]; mapRows: readonly number[];
    /** Pasted rows 0–3 (fractional while a row arrives). */
    pasted: number;
};
const typed = (s: string, k: number) => s.slice(0, Math.round(s.length * clamp(k)));

/** The "New website migration" page body at 1460 × 660 (native), with its header buttons. */
export function MigrationPage({ st, paste }: { st: MigState; paste: readonly (readonly [string, string | null])[] }) {
    const m = smooth(st.mode);
    const O = NAMES.old, N = NAMES.new, P = NAMES.path;
    const head = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={LBL}>How are the URLs changing?</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <MigOption title="Keep the same paths" sub="Only the domain changes. One rule covers every URL." exA={<>{O}<B>{P}</B></>} exB={<>→ {N}<B>{P}</B></>} on={1 - m} ring={st.sameRing} />
                <MigOption title="Map URLs one by one" sub="Paths changed. List each old URL and its new home." exA={<>{O}<B>/blog/strawberry-secret</B></>} exB={<>→ {N}<B>/journal/strawberry-secret</B></>} on={m} />
            </div>
        </div>
    );
    const ring = (k: number): CSSProperties => ({ borderColor: mix('#D5D7DA', '#20A795', k), boxShadow: `0 0 0 ${3 * k}px rgba(32,167,149,0.25)` });
    const caret = <span style={{ width: 1.5, height: 20, background: C.char, marginLeft: 1 }} />;
    const same = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 24px minmax(0, 1fr)', alignItems: 'end', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>Old domain</span><span style={{ ...INP, ...ring(st.caret === 'old' ? 1 : 0) }}>{typed(O, st.oldTyped)}{st.caret === 'old' && caret}</span></div>
                <span style={{ height: 42, display: 'flex', alignItems: 'center', color: '#717680' }}><Ico d="M5 12h14M13 6l6 6-6 6" size={22} color="#717680" sw={2} /></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>New base URL</span><span style={{ ...INP, ...ring(st.caret === 'new' ? 1 : 0) }}>{typed(`https://${N}`, st.newTyped)}{st.caret === 'new' && caret}</span></div>
            </div>
            <span style={{ fontSize: 13, lineHeight: '19px', color: '#535862', marginTop: -6 }}>Every old path is added after the new base URL. A few pages moved anyway? Map just those one by one.</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>More options</span><OptRows rows={[OPT_TYPE, OPT_QUERY, OPT_DOM]} /></div>
        </div>
    );
    const tabs = (
        <span style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 8, background: C.g100 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, color: '#414651' }}>Add manually</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, color: C.char, background: '#FFFFFF', boxShadow: '0 1px 2px rgba(16,24,40,0.08)' }}>Paste</span>
        </span>
    );
    const map = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center' }}><span style={LBL}>URL mappings</span><span style={{ marginLeft: 'auto' }}>{tabs}</span></span>
                <div style={{ height: 90, boxSizing: 'border-box', padding: '12px 14px', border: '1px solid #D5D7DA', borderRadius: 10, background: '#FFFFFF', fontFamily: MONO, fontSize: 12.5, lineHeight: '22px', color: C.char, whiteSpace: 'pre', overflow: 'hidden' }}>
                    {paste.map(([a, b], i) => (
                        <div key={a} style={{ opacity: smooth(clamp(st.pasted - i) * 2), transform: `translate3d(0, ${(1 - easeOut(clamp(st.pasted - i))) * 8}px, 0)` }}>{b ? `${O}${a}    ${N}${b}` : `${O}${a}`}</div>
                    ))}
                </div>
                <span style={{ fontSize: 13, color: '#535862' }}>Two columns, old URL then new URL, straight from Excel or Google Sheets. <b style={{ fontWeight: 600, color: '#344054', opacity: smooth(clamp(st.pasted - 2)) }}>3 rows found.</b></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `1px dashed ${mix('#D5D7DA', '#079455', st.csvRing)}`, borderRadius: 12, boxShadow: `0 0 0 ${3 * st.csvRing}px rgba(7,148,85,0.18)` }}>
                <span style={{ color: '#079455', display: 'inline-flex' }}><Ico d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M9 13h6M9 17h6" size={22} color="#079455" /></span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><b style={{ fontSize: 14, fontWeight: 600, color: C.char }}>Import a CSV file</b>
                    <span style={{ fontSize: 12.5, color: '#717680' }}>Hundreds of URLs? Upload two columns, old URL and new URL. You review every row before anything is created.</span></span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={LBL}>More options</span><OptRows rows={[OPT_TYPE]} ring={st.typeRing} /></div>
        </div>
    );
    const sameAside = (
        <WhatHappens rows={[[`${O}/`, `${N}/`, false], [`${O}${P}`, `${N}${P}`, false], [`${O}/about?ref=menu`, `${N}/about?ref=menu`, false]]} show={st.sameRows}
            foot={<span style={{ fontWeight: 600, color: C.char, whiteSpace: 'nowrap', opacity: smooth(st.sameRows[2] ?? 1) }}>…and every other path</span>} ring={{ row: 1, k: st.heroRing }} />
    );
    const mapAside = (
        <WhatHappens w={380} rows={paste.map(([a, b]) => [`${O}${a}`, b ? `${N}${b}` : 'New URL missing, this row is skipped', !b] as [ReactNode, ReactNode, boolean])} show={st.mapRows}
            foot={<span style={{ fontWeight: 600, color: C.char, whiteSpace: 'nowrap', opacity: smooth(st.mapRows[2] ?? 1) }}>2 redirects · 1 skipped</span>} ring={{ row: 2, k: st.skipRing }} ringColor={C.red} />
    );
    // Header and the radios are one layer; the body below and the aside crossfade between the two modes.
    return (
        <>
            <div style={{ flex: 1, minWidth: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {head}
                <div style={{ position: 'relative', flex: 1 }}>
                    {m < 1 && <div style={{ position: 'absolute', inset: 0, opacity: 1 - m }}>{same}</div>}
                    {m > 0 && <div style={{ position: 'absolute', left: 0, right: 0, top: -2, opacity: m }}>{map}</div>}
                </div>
            </div>
            <div style={{ position: 'relative', width: 380, flex: 'none' }}>
                {m < 1 && <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - m }}>{sameAside}</div>}
                {m > 0 && <div style={{ position: 'absolute', left: 0, top: 0, opacity: m }}>{mapAside}</div>}
            </div>
        </>
    );
}
/** The page's header buttons; the primary label rolls with the mode. */
export function MigrationButtons({ mode, ring = 0 }: { mode: number; ring?: number }) {
    return (
        <span style={{ display: 'inline-flex', gap: 10 }}>
            <span style={BTN_S}>Cancel</span>
            <span style={{ ...BTN_P, boxShadow: `0 0 0 ${4 * ring}px rgba(28,109,182,${0.3 * ring})` }}><Roll from="Create redirect" to="Create 2 redirects" k={mode} h={20} align="center" /></span>
        </span>
    );
}

/* ---------------------------------------------------------------- Analytics (w44-Watch) */
/** The Analytics page's Domains card ("Example numbers"). `ring` 0–1 rings the old domain's row; `rows` 0–1 each. */
export function AnalyticsBody({ ring = 0, rows = [1, 1] }: { ring?: number; rows?: readonly number[] }) {
    const data: readonly [string, string, string, string][] = [[NAMES.new, '1,284', '↑ 41%', '#067647'], [NAMES.old, '612', '↓ 18%', C.g600]];
    const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px 80px', alignItems: 'center', gap: 12 };
    return (
        <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 12px', border: '1px solid #D5D7DA', borderRadius: 8, background: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>Last 30 days</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 12px', border: '1px solid #D5D7DA', borderRadius: 8, background: '#FFFFFF', fontSize: 14, color: '#414651' }}>Humans only</span>
            </div>
            <div style={{ width: 560, background: '#FFFFFF', border: '1px solid #EAECF0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px' }}><span style={{ fontSize: 16, fontWeight: 600 }}>Domains</span>
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 2, padding: 3, borderRadius: 8, background: C.g100 }}><span style={{ padding: '3px 10px', borderRadius: 6, background: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>Domains</span><span style={{ padding: '3px 10px', fontSize: 13, color: '#717680' }}>Tags</span></span></div>
                <div style={{ ...grid, padding: '8px 18px', background: C.g50, fontSize: 12, fontWeight: 600, color: '#717680' }}><span>DOMAIN</span><span style={{ textAlign: 'right' }}>CLICKS</span><span style={{ textAlign: 'right' }}>CHANGE</span></div>
                {data.map(([d, n, ch, c], i) => (
                    <div key={d} style={{ ...grid, height: 54, padding: '0 18px', borderTop: '1px solid #EAECF0', fontSize: 15, opacity: smooth(rows[i] ?? 1), boxShadow: i === 1 ? `inset 0 0 0 ${2 * clamp(ring)}px #20A795` : undefined, background: i === 1 ? mix('#FFFFFF', '#F0FAF8', ring) : undefined }}>
                        <span style={{ color: C.char, fontWeight: 500 }}>{d}</span><span style={{ textAlign: 'right', fontWeight: 600 }}>{n}</span><span style={{ textAlign: 'right', color: c }}>{ch}</span>
                    </div>
                ))}
                <div style={{ padding: '12px 18px', borderTop: '1px solid #EAECF0', fontSize: 13, fontWeight: 600, color: '#1C6DB6' }}>View details</div>
            </div>
        </div>
    );
}
