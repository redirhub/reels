/* A printed promo flyer with a QR code: the physical asset in QR stories. */
import type { CSSProperties } from 'react';
import { color, font } from '../brand/tokens';
import { QrCode } from './QrCode';

export const FLYER = { width: 520, height: 730 } as const;

export function Flyer({ title, subtitle, caption, printedUrl, qrValue, style }: {
    title: string; subtitle: string; caption: string; printedUrl: string; qrValue: string; style?: CSSProperties;
}) {
    return (
        <div style={{
            position: 'absolute', ...FLYER, borderRadius: 28, background: '#FFFBF5',
            boxShadow: '0 40px 80px rgba(0,0,0,.45)', overflow: 'hidden', ...style,
        }}>
            <div style={{ background: color.amber, color: '#fff', padding: '44px 40px 36px' }}>
                <div style={{ fontSize: 66, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1 }}>{title}</div>
                <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12, opacity: 0.95 }}>{subtitle}</div>
            </div>
            <div style={{ width: 300, height: 300, margin: '44px auto 0', padding: 18, background: '#fff', borderRadius: 22, boxShadow: '0 2px 10px rgba(16,24,40,.08)' }}>
                <QrCode value={qrValue} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 26, fontSize: 26, fontWeight: 700, color: color.charcoal }}>{caption}</div>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 24, color: color.g600, fontFamily: font.mono }}>{printedUrl}</div>
        </div>
    );
}

/** Blank paper behind a flyer, to suggest a stack. */
export function FlyerSheet({ style }: { style?: CSSProperties }) {
    return <div style={{ position: 'absolute', ...FLYER, borderRadius: 28, background: '#F4EBDD', boxShadow: '0 40px 80px rgba(0,0,0,.35)', ...style }} />;
}
