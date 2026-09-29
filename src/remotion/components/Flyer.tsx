/* A printed promo flyer with a QR code: the physical asset in QR stories. */
import type { CSSProperties } from 'react';
import { color } from '../brand/tokens';
import { BrandedQr } from './QrCode';

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
            <div style={{ textAlign: 'center', marginTop: 30, fontSize: 26, fontWeight: 700, color: color.charcoal }}>{caption}</div>
            <BrandedQr value={qrValue} label={printedUrl} size={272} labelSize={25} style={{ margin: '16px auto 0', boxShadow: '0 2px 10px rgba(16,24,40,.08)' }} />
        </div>
    );
}

/** Blank paper behind a flyer, to suggest a stack. */
export function FlyerSheet({ style }: { style?: CSSProperties }) {
    return <div style={{ position: 'absolute', ...FLYER, borderRadius: 28, background: '#F4EBDD', boxShadow: '0 40px 80px rgba(0,0,0,.35)', ...style }} />;
}
