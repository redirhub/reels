/* A real, scannable QR code rendered as crisp SVG modules. Generated from the
   value at render time, so the encoded URL is a prop, not a baked image. */
import { useMemo } from 'react';
import QRCode from 'qrcode';

export function QrCode({ value, color = '#101828', style }: { value: string; color?: string; style?: React.CSSProperties }) {
    const { size, d } = useMemo(() => {
        const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
        const n = qr.modules.size;
        let path = '';
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                if (qr.modules.get(x, y)) path += `M${x} ${y}h1v1h-1z`;
            }
        }
        return { size: n, d: path };
    }, [value]);
    return (
        <svg viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" style={{ display: 'block', width: '100%', height: '100%', ...style }}>
            <path fill={color} d={d} />
        </svg>
    );
}

/** RedirHub QR design standard: a QR code is always shown with its branded link
    directly underneath, so people can see where it goes before they scan. Use this
    instead of a bare <QrCode> anywhere a QR appears on screen. */
export function BrandedQr({ value, label, size, labelSize = 24, padding = 18, style }: {
    /** URL encoded in the QR. */
    value: string;
    /** Branded link shown under the QR, without the scheme (e.g. "go.yourbrand.com/spring"). */
    label: string;
    /** QR edge length in px (excluding the card padding). */
    size: number;
    labelSize?: number;
    padding?: number;
    style?: React.CSSProperties;
}) {
    return (
        <div style={{ background: '#fff', borderRadius: 22, padding, width: size + padding * 2, textAlign: 'center', ...style }}>
            <div style={{ width: size, height: size }}><QrCode value={value} /></div>
            <div style={{
                marginTop: Math.round(labelSize * 0.55), fontSize: labelSize, fontWeight: 700, color: '#101828',
                letterSpacing: '-.01em', whiteSpace: 'nowrap', lineHeight: 1.1,
            }}>{label}</div>
        </div>
    );
}
