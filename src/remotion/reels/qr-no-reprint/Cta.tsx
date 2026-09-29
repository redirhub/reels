/* 25.35–30s (4.65s) · End card. Times are local. */
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import { RedirHubLogo } from '../../brand/Logo';
import { QrCode } from '../../components/QrCode';
import { IconArrowRight } from '../../components/icons';
import { easeBack, easeInOut, easeOut, fx, lerp, prog, rise, useTime } from '../../lib/anim';
import type { QrNoReprintProps } from './props';

export function Cta(props: QrNoReprintProps) {
    const t = useTime();
    const inK = easeInOut(prog(t, 0, 0.55));
    const btn = prog(t, 1.25, 1.65);
    const breathe = t > 2.15 ? 0.02 * Math.sin((t - 2.15) * 4) : 0;

    return (
        <AbsoluteFill style={{
            textAlign: 'center', ...fx(inK, 0, 0, lerp(1.06, 1, inK)),
            background: `radial-gradient(700px 600px at 0% 0%, rgba(32,167,149,.16), transparent 70%),
                radial-gradient(800px 700px at 100% 100%, rgba(28,109,182,.18), transparent 70%),
                radial-gradient(500px 400px at 100% 10%, rgba(229,148,38,.12), transparent 70%), #fff`,
        }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 280, display: 'flex', justifyContent: 'center', ...rise(t, 0.25, 0.5, 30) }}>
                <div style={{ width: 560 }}><RedirHubLogo /></div>
            </div>
            <div style={{ position: 'absolute', left: 30, right: 30, top: 500, fontSize: 96, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04, color: color.charcoal, ...rise(t, 0.5, 0.5, 40) }}>
                Dynamic QR codes.<br /><span style={{ color: color.teal }}>On your domain.</span>
            </div>
            <div style={{ position: 'absolute', left: 110, right: 110, top: 770, fontSize: 38, lineHeight: 1.4, color: color.g600, ...rise(t, 0.9, 0.5, 30) }}>
                Change where printed QR codes, branded links and redirects go. For marketing teams, agencies and brands.
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 980, display: 'flex', justifyContent: 'center', ...fx(easeOut(btn), 0, (1 - easeOut(btn)) * 40, lerp(0.9, 1, easeBack(btn)) + breathe) }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 16, height: 120, padding: '0 56px', borderRadius: 30,
                    background: color.blue, color: '#fff', fontSize: 44, fontWeight: 800, boxShadow: '0 24px 50px rgba(28,109,182,.35)',
                }}>Start free at redirhub.com<IconArrowRight size={46} color="#fff" /></div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, ...rise(t, 1.65, 0.5, 30) }}>
                <div style={{ width: 230, height: 230, background: '#fff', borderRadius: 24, padding: 18, boxShadow: '0 10px 30px rgba(16,24,40,.12)', border: `1px solid ${color.g200}` }}>
                    <QrCode value={props.qrValue} />
                </div>
                <div style={{ textAlign: 'left', fontSize: 32, fontWeight: 700, color: color.g700, lineHeight: 1.3 }}>
                    Scan it.<br /><span style={{ fontWeight: 500, color: color.g500 }}>See how it works.</span>
                </div>
            </div>
        </AbsoluteFill>
    );
}
