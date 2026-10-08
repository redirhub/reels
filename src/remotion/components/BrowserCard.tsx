/* A white browser card (the channel's seed from free-coffee): one address bar, a lock state
   and a status dot. Pages go inside. `dark` is a private window. */
import type { CSSProperties, ReactNode } from 'react';
import { color, font, yt } from '../brand/tokens';
import { DOT, type DotTone } from './UrlPill';

export type LockState = 'secure' | 'insecure' | 'none';

export function BrowserCard({ address, lock = 'none', dot = 'none', dark = false, width = 980, height = 620, radius = 28, children, style, loading = -1, title }: {
    address: string; lock?: LockState; dot?: DotTone; dark?: boolean; width?: number; height?: number; radius?: number;
    children?: ReactNode; style?: CSSProperties;
    /** 0–1 page-load progress, or -1 when idle. */
    loading?: number;
    /** Optional small label at the top (e.g. "Private window"). */
    title?: string;
}) {
    const bar = dark ? '#1F2A3A' : color.g100;
    const chrome = dark ? '#141C2A' : '#fff';
    const text = dark ? '#E6EDF7' : color.g700;
    const lockColor = lock === 'secure' ? yt.teal : lock === 'insecure' ? yt.signalRed : color.g500;
    return (
        <div style={{
            position: 'relative', width, height, borderRadius: radius, overflow: 'hidden', background: chrome, fontFamily: font.sans,
            boxShadow: '0 50px 120px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08)', ...style,
        }}>
            <div style={{ height: 78, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', borderBottom: `1px solid ${dark ? '#243043' : color.g200}` }}>
                <div style={{ display: 'flex', gap: 9 }}>
                    {['#F97066', '#FDB022', '#32D583'].map((c) => <i key={c} style={{ width: 14, height: 14, borderRadius: 7, background: dark ? '#3A4658' : c }} />)}
                </div>
                {title && <span style={{ fontSize: 20, fontWeight: 600, color: dark ? '#8EA0B8' : color.g500, marginLeft: 6, whiteSpace: 'nowrap' }}>{title}</span>}
                <div style={{ flex: 1, height: 48, borderRadius: 24, background: bar, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontFamily: font.mono, fontSize: 24, color: text, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {lock === 'secure' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                            <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                    )}
                    {lock === 'insecure' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: lockColor, fontFamily: font.sans, fontWeight: 600, fontSize: 21, flex: 'none' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18.5v.5" /></svg>
                            Not secure
                        </span>
                    )}
                    {lock === 'none' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.g400} strokeWidth="2.2" strokeLinecap="round" style={{ flex: 'none' }}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                    )}
                    <span>{address}</span>
                </div>
                {dot !== 'none' && <i style={{ flex: 'none', width: 16, height: 16, borderRadius: 8, background: DOT[dot], boxShadow: `0 0 14px ${DOT[dot]}88` }} />}
                {loading >= 0 && loading < 1 && <div style={{ position: 'absolute', left: 0, top: 76, height: 3, width: `${Math.max(0.06, loading) * 100}%`, background: yt.blue }} />}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 78, bottom: 0, background: dark ? '#0F1724' : '#fff', overflow: 'hidden' }}>{children}</div>
        </div>
    );
}

/** Generic placeholder page: a few grey bars, so a card reads as "a website" without inventing one. */
export function SkeletonPage({ tone = 'light', title, accent = yt.blue, lines = 4 }: { tone?: 'light' | 'dark'; title?: string; accent?: string; lines?: number }) {
    const bar = tone === 'dark' ? '#223047' : color.g200;
    return (
        <div style={{ padding: '36px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
                <i style={{ width: 44, height: 44, borderRadius: 12, background: accent }} />
                <i style={{ width: 160, height: 18, borderRadius: 9, background: bar }} />
                <i style={{ marginLeft: 'auto', width: 90, height: 18, borderRadius: 9, background: bar }} />
                <i style={{ width: 90, height: 18, borderRadius: 9, background: bar }} />
            </div>
            {title && <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700, color: tone === 'dark' ? '#E6EDF7' : color.charcoal, letterSpacing: '-.03em', marginBottom: 24 }}>{title}</div>}
            {Array.from({ length: lines }, (_, i) => <i key={i} style={{ display: 'block', height: 16, borderRadius: 8, background: bar, width: `${[92, 78, 85, 60, 70][i % 5]}%`, marginBottom: 16 }} />)}
        </div>
    );
}

/** A browser's "page not found". */
export function NotFoundPage({ dark = false }: { dark?: boolean }) {
    return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: dark ? '#E6EDF7' : color.charcoal }}>
            <div style={{ fontFamily: font.display, fontSize: 44, fontWeight: 700, letterSpacing: '-.03em' }}>This page doesn’t exist.</div>
            <div style={{ fontFamily: font.sans, fontSize: 24, color: color.g500 }}>Check the address and try again.</div>
        </div>
    );
}

/** Chrome-style interstitials. `httpsfirst` (default): the "Always Use Secure Connections" warning for a plain
    http site. `nocert`: the certificate error for https on a domain with no valid certificate. */
export function NotSecurePage({ kind = 'httpsfirst' }: { kind?: 'httpsfirst' | 'nocert' }) {
    const copy = kind === 'nocert'
        ? { title: 'Your connection is not private', body: 'This site has no valid certificate, so the browser cannot confirm who it is talking to.', a: 'Back to safety', b: 'Advanced' }
        : { title: 'The connection to this site is not secure', body: 'You are seeing this warning because this site does not support HTTPS.', a: 'Go back', b: 'Continue to site' };
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', padding: '38px 60px', color: color.charcoal }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={yt.signalRed} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18.5v.5" /></svg>
            <div style={{ fontFamily: font.sans, fontSize: 34, fontWeight: 500, marginTop: 18, letterSpacing: '-.01em' }}>{copy.title}</div>
            <div style={{ fontFamily: font.sans, fontSize: 21, color: color.g600, marginTop: 10, lineHeight: 1.45, maxWidth: 820 }}>{copy.body}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
                <div style={{ height: 50, padding: '0 24px', borderRadius: 25, background: yt.blue, color: '#fff', fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{copy.a}</div>
                <div style={{ height: 50, padding: '0 24px', borderRadius: 25, border: `1px solid ${color.g300}`, color: color.g700, fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center' }}>{copy.b}</div>
            </div>
        </div>
    );
}
