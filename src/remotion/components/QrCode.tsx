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
