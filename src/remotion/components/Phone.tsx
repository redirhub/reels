/* Phone mockup and the in-phone pages reused across reels. */
import type { CSSProperties, ReactNode } from 'react';
import { color, font } from '../brand/tokens';
import { IconLock } from './icons';
import { BrandedQr } from './QrCode';

export function Phone({ width = 440, height = 900, style, children }: { width?: number; height?: number; style?: CSSProperties; children: ReactNode }) {
    return (
        <div style={{
            position: 'absolute', width, height, borderRadius: 70, background: '#0B1220', padding: 16,
            boxShadow: '0 50px 100px rgba(0,0,0,.5), inset 0 0 0 2px #2a3446', ...style,
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 56, overflow: 'hidden', background: '#fff' }}>
                <div style={{ position: 'absolute', left: '50%', top: 14, width: 130, height: 36, marginLeft: -65, borderRadius: 20, background: '#0B1220', zIndex: 5 }} />
                {children}
            </div>
        </div>
    );
}

/** Full-screen layer inside a Phone; stack several and cross-fade with `style`. */
export function Screen({ style, children, background = '#fff' }: { style?: CSSProperties; children: ReactNode; background?: string }) {
    return <div style={{ position: 'absolute', inset: 0, background, ...style }}>{children}</div>;
}

export function UrlBar({ url, secure = true }: { url: string; secure?: boolean }) {
    return (
        <div style={{
            position: 'absolute', left: 22, right: 22, top: 66, height: 62, borderRadius: 18, background: color.g100,
            display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', fontSize: 23, color: color.g700, fontWeight: 500, zIndex: 4,
        }}>
            {secure && <IconLock size={22} color={color.g500} />}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
        </div>
    );
}

export function NotFoundPage({ url }: { url: string }) {
    return (
        <Screen>
            <UrlBar url={url} />
            <div style={{ textAlign: 'center', padding: '240px 36px 0' }}>
                <div style={{ fontSize: 170, fontWeight: 900, color: color.red, letterSpacing: '-.05em', lineHeight: 1 }}>404</div>
                <div style={{ fontSize: 40, fontWeight: 800, marginTop: 22, color: color.charcoal }}>Page not found</div>
                <div style={{ fontSize: 25, color: color.g500, marginTop: 14, lineHeight: 1.4 }}>This page moved or no longer exists.</div>
                <div style={{
                    margin: '44px auto 0', width: 280, height: 74, borderRadius: 16, border: `2px solid ${color.g300}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 600, color: color.g700,
                }}>Go to homepage</div>
            </div>
        </Screen>
    );
}

export function SalePage({ url, title, subtitle, cta }: { url: string; title: string; subtitle: string; cta: string }) {
    const tiles = ['#E8F0F8', '#E6F6F4', '#FDF3E6', color.g100];
    return (
        <Screen>
            <UrlBar url={url} />
            <div style={{ paddingTop: 150 }}>
                <div style={{ margin: '0 22px', borderRadius: 26, background: color.amber, color: '#fff', padding: '38px 30px' }}>
                    <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1 }}>{title}</div>
                    <div style={{ fontSize: 26, fontWeight: 600, marginTop: 10 }}>{subtitle}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: 22 }}>
                    {tiles.map((bg) => (
                        <div key={bg} style={{ height: 170, borderRadius: 20, background: bg, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 18, bottom: 18, width: '60%', height: 14, borderRadius: 7, background: color.g300 }} />
                        </div>
                    ))}
                </div>
                <div style={{
                    margin: '6px 22px', height: 84, borderRadius: 18, background: color.dark, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700,
                }}>{cta}</div>
            </div>
        </Screen>
    );
}

/** Phone camera pointed at a QR code. `scan` is 0→1 progress of the scan line
    (hidden outside (0,1)); `bubble` shows the detected-link chip when set. */
export function CameraView({ qrValue, qrLabel, scan, bubble, bubbleStyle, style }: {
    qrValue: string; qrLabel: string; scan: number; bubble?: string; bubbleStyle?: CSSProperties; style?: CSSProperties;
}) {
    const corner = (pos: CSSProperties, radius: string): CSSProperties => ({
        position: 'absolute', width: 62, height: 62, border: '7px solid #FDE047', borderRadius: radius, ...pos,
    });
    return (
        <Screen background="radial-gradient(circle at 50% 45%, #3b3f47, #111317 75%)" style={style}>
            <BrandedQr value={qrValue} label={qrLabel} size={200} labelSize={17} style={{
                position: 'absolute', left: '50%', top: '44%', margin: '-124px 0 0 -124px', transform: 'rotate(-4deg)',
            }} />
            <div style={{ position: 'absolute', left: '50%', top: '44%', width: 300, height: 300, margin: '-150px 0 0 -150px' }}>
                <div style={corner({ left: 0, top: 0, borderRight: 0, borderBottom: 0 }, '18px 0 0 0')} />
                <div style={corner({ right: 0, top: 0, borderLeft: 0, borderBottom: 0 }, '0 18px 0 0')} />
                <div style={corner({ left: 0, bottom: 0, borderRight: 0, borderTop: 0 }, '0 0 0 18px')} />
                <div style={corner({ right: 0, bottom: 0, borderLeft: 0, borderTop: 0 }, '0 0 18px 0')} />
            </div>
            <div style={{
                position: 'absolute', left: '50%', width: 280, marginLeft: -140, height: 6, borderRadius: 3,
                background: '#FDE047', boxShadow: '0 0 24px #FDE047', opacity: scan > 0 && scan < 1 ? 1 : 0,
                top: `calc(44% - 140px + ${Math.abs(Math.sin(scan * Math.PI * 1.5)) * 280}px)`,
            }} />
            {bubble && (
                <div style={{
                    position: 'absolute', left: '50%', top: '67%', whiteSpace: 'nowrap', background: '#FDE047', color: '#111',
                    fontWeight: 700, fontSize: 24, padding: '14px 24px', borderRadius: 40, fontFamily: font.sans, ...bubbleStyle,
                }}>{bubble}</div>
            )}
        </Screen>
    );
}
