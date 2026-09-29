/* 53.9–60s (6.1s) · End card. No QR: this plays on redirhub.com itself, so the
   CTA is the site's own sign-up. Times are local. */
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import { RedirHubLogo } from '../../brand/Logo';
import { IconArrowRight } from '../../components/icons';
import { easeBack, easeInOut, easeOut, fx, lerp, prog, rise, useTime } from '../../lib/anim';

export function Cta() {
    const t = useTime();
    const inK = easeInOut(prog(t, 0, 0.55));
    const btn = prog(t, 1.4, 1.8);
    const breathe = t > 2.3 ? 0.02 * Math.sin((t - 2.3) * 4) : 0;

    return (
        <AbsoluteFill style={{
            textAlign: 'center', ...fx(inK, 0, 0, lerp(1.06, 1, inK)),
            background: `radial-gradient(900px 600px at 0% 0%, rgba(32,167,149,.16), transparent 70%),
                radial-gradient(1000px 700px at 100% 100%, rgba(28,109,182,.18), transparent 70%),
                radial-gradient(600px 400px at 100% 10%, rgba(229,148,38,.12), transparent 70%), #fff`,
        }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', ...rise(t, 0.25, 0.5, 30) }}>
                <div style={{ width: 560 }}><RedirHubLogo /></div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 380, fontSize: 92, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, color: color.charcoal, ...rise(t, 0.55, 0.5, 40) }}>
                The link infrastructure<br /><span style={{ color: color.teal }}>for your domain.</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 610, fontSize: 34, color: color.g600, ...rise(t, 0.95, 0.5, 30) }}>
                Domain redirects · Website migrations · Branded links · QR codes
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', ...fx(easeOut(btn), 0, (1 - easeOut(btn)) * 40, lerp(0.9, 1, easeBack(btn)) + breathe) }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 16, height: 112, padding: '0 56px', borderRadius: 28,
                    background: color.blue, color: '#fff', fontSize: 42, fontWeight: 800, boxShadow: '0 24px 50px rgba(28,109,182,.35)',
                }}>Start free at redirhub.com<IconArrowRight size={44} color="#fff" /></div>
            </div>
        </AbsoluteFill>
    );
}
