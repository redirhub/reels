/* A real, scannable QR code rendered as crisp SVG modules. Generated from the
   value at render time, so the encoded URL is a prop, not a baked image. */
import QRCode from 'qrcode';

/* Cached per value: scenes remount on every seek in the Player, and the same
   few URLs are encoded over and over. */
const cache = new Map<string, { size: number; d: string }>();

function modules(value: string) {
    let hit = cache.get(value);
    if (!hit) {
        const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
        const n = qr.modules.size;
        let path = '';
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                if (qr.modules.get(x, y)) path += `M${x} ${y}h1v1h-1z`;
            }
        }
        hit = { size: n, d: path };
        cache.set(value, hit);
    }
    return hit;
}

export function QrCode({ value, color = '#101828', style }: { value: string; color?: string; style?: React.CSSProperties }) {
    const { size, d } = modules(value);
    return (
        <svg viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" style={{ display: 'block', width: '100%', height: '100%', ...style }}>
            <path fill={color} d={d} />
        </svg>
    );
}

/** RedirHub QR design standard: a QR code is always shown with its branded link
    directly underneath, so people can see where it goes before they scan. Use this
    instead of a bare <QrCode> anywhere a QR appears on screen. */
export function BrandedQr({ value, label, size, labelSize = 24, padding = Math.round(size * 0.12), style }: {
    /** URL encoded in the QR. */
    value: string;
    /** Branded link shown under the QR, without the scheme (e.g. "go.yourbrand.com/spring"). */
    label: string;
    /** QR edge length in px (excluding the card padding). */
    size: number;
    labelSize?: number;
    /** Card padding in px. Defaults to 12% of the QR, about the 4-module quiet zone the QR spec asks for,
        so the code never touches the card edge and the whitespace scales with the QR. */
    padding?: number;
    style?: React.CSSProperties;
}) {
    // Shrink the label if needed so it always stays inside the card (bold sans is ~0.6em per character).
    const fontSize = Math.min(labelSize, Math.floor((size + padding) / (label.length * 0.6)));
    return (
        <div style={{
            background: '#fff', borderRadius: Math.round(size * 0.09), padding, paddingBottom: Math.round(padding * 0.85),
            width: size + padding * 2, boxSizing: 'border-box', textAlign: 'center', ...style,
        }}>
            <div style={{ width: size, height: size }}><QrCode value={value} /></div>
            <div style={{
                marginTop: Math.round(padding * 0.7), fontSize, fontWeight: 700, color: '#101828',
                letterSpacing: '-.01em', whiteSpace: 'nowrap', lineHeight: 1.1,
            }}>{label}</div>
        </div>
    );
}
