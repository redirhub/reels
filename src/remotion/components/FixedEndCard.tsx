/* The channel's end card: "<Problem>. Fixed." in two tones, the white logo, and a branded QR
   with its link underneath. Landscape layout keeps the right half clear for YouTube end-screen
   elements and nothing key in the bottom 12%. */
import { AbsoluteFill } from 'remotion';
import { RedirHubLogo } from '../brand/Logo';
import { font, yt } from '../brand/tokens';
import { easeOut, prog, rise, useTime } from '../lib/anim';
import { BrandedQr } from './QrCode';
import { Grain } from './Grain';

export const NIGHT_BG = `radial-gradient(1400px 900px at 50% 20%, #10214A 0%, #0B1426 55%, #070E1C 100%)`;

export function FixedEndCard({ lines, sub, qr, size = 128 }: {
    /** ["Old domain.", "Fixed."]: first line white, second teal. */
    lines: readonly [string, string];
    sub?: string;
    /** A RedirHub branded link: encoded value and the exact label without scheme. */
    qr: { value: string; label: string };
    size?: number;
}) {
    const t = useTime();
    const logoK = easeOut(prog(t, 0.5, 0.9));
    return (
        <AbsoluteFill style={{ background: NIGHT_BG, fontFamily: font.display }}>
            <Grain />
            <div style={{ position: 'absolute', left: 140, top: 300, fontSize: size, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.04, color: yt.ink }}>
                <div style={rise(t, 0, 0.35, 30)}>{lines[0]}</div>
                <div style={{ color: yt.teal, ...rise(t, 0.14, 0.35, 30) }}>{lines[1]}</div>
            </div>
            {sub && <div style={{ position: 'absolute', left: 140, top: 300 + size * 2.3, fontSize: 36, fontWeight: 500, color: yt.inkSoft, ...rise(t, 0.35, 0.35, 20) }}>{sub}</div>}
            <div style={{ position: 'absolute', left: 140, top: 760, width: 360, opacity: logoK, transform: `translateY(${(1 - logoK) * 16}px)` }}><RedirHubLogo variant="white" /></div>
            <div style={{ position: 'absolute', left: 620, top: 690, opacity: logoK, transform: `translateY(${(1 - logoK) * 16}px)` }}>
                <BrandedQr value={qr.value} label={qr.label} size={170} labelSize={22} />
            </div>
        </AbsoluteFill>
    );
}
