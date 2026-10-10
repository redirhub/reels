/* The certificate as an ID card: who it's issued to, who vouched for it, and whether it's
   valid. A metaphor component; it never pretends to be a real certificate viewer. */
import { font, yt } from '../brand/tokens';
import { Padlock } from './Padlock';

export function IdCard({ domain, issuer = 'Trusted certificate authority', valid = true, width = 520, k = 1, style }: {
    domain: string; issuer?: string; valid?: boolean; width?: number;
    /** 0–1 reveal (the card prints itself). */
    k?: number; style?: React.CSSProperties;
}) {
    const h = Math.round(width * 0.62);
    const tone = valid ? yt.teal : yt.signalRed;
    return (
        <div style={{
            position: 'relative', width, height: h, borderRadius: Math.round(width * 0.05), background: '#fff', overflow: 'hidden', fontFamily: font.display,
            boxShadow: '0 40px 100px rgba(0,0,0,.45)', clipPath: `inset(0 ${(1 - k) * 100}% 0 0 round ${Math.round(width * 0.05)}px)`, ...style,
        }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.22, background: '#101828', display: 'flex', alignItems: 'center', padding: `0 ${width * 0.06}px`, gap: 14 }}>
                <span style={{ color: '#fff', fontSize: width * 0.045, fontWeight: 700, letterSpacing: '.12em' }}>CERTIFICATE</span>
                <span style={{ marginLeft: 'auto', color: yt.inkSoft, fontSize: width * 0.034, fontFamily: font.mono }}>https</span>
            </div>
            <div style={{ position: 'absolute', left: width * 0.06, top: h * 0.32, width: width * 0.22, height: width * 0.22, borderRadius: 18, background: '#EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Padlock size={width * 0.14} color={tone} />
            </div>
            <div style={{ position: 'absolute', left: width * 0.34, top: h * 0.32, right: width * 0.06 }}>
                <div style={{ fontSize: width * 0.03, color: '#667085', fontWeight: 600, letterSpacing: '.08em' }}>ISSUED TO</div>
                <div style={{ fontSize: width * 0.052, color: '#101828', fontWeight: 700, fontFamily: font.mono, marginTop: 4, whiteSpace: 'nowrap' }}>{domain}</div>
                <div style={{ fontSize: width * 0.03, color: '#667085', fontWeight: 600, letterSpacing: '.08em', marginTop: h * 0.09 }}>ISSUED BY</div>
                <div style={{ fontSize: width * 0.036, color: '#344054', fontWeight: 600, marginTop: 4 }}>{issuer}</div>
            </div>
            <div style={{ position: 'absolute', left: width * 0.06, bottom: h * 0.08, display: 'inline-flex', alignItems: 'center', gap: 10, height: h * 0.11, padding: `0 ${width * 0.03}px`, borderRadius: 999, background: valid ? 'rgba(32,167,149,0.14)' : 'rgba(229,72,77,0.12)', color: valid ? '#20A795' : '#E5484D', fontSize: width * 0.034, fontWeight: 700 }}>
                <i style={{ width: 10, height: 10, borderRadius: 5, background: tone }} />{valid ? 'Valid' : 'Missing'}
            </div>
        </div>
    );
}
