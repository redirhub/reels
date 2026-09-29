/* 5.9–12.3s (6.4s) · The idea: the public link stays, the destination can change.
   Times are local. */
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { RedirHubIcon } from '../../brand/Logo';
import { IconLock } from '../../components/icons';
import { easeBack, easeInOut, easeOut, fx, lerp, prog, rise, useTime } from '../../lib/anim';
import { links, type HomepageExplainerProps } from './props';

/** Destination swaps (local seconds), for the SFX cues. */
export const SWAPS = [3.2, 4.4] as const;

const Y = 560; // diagram centre line

export function Idea(props: HomepageExplainerProps) {
    const t = useTime();
    const { shortLink, oldDisplay, newDisplay } = links(props);
    const reveal = easeInOut(prog(t, 0, 0.6));
    const dests = [oldDisplay, newDisplay, `shop.${props.domain}`];
    const di = t < SWAPS[0] ? 0 : t < SWAPS[1] ? 1 : 2;
    const since = di === 0 ? 99 : t - SWAPS[di - 1];
    const flow = prog(t, 2.0, 2.4);

    return (
        <AbsoluteFill style={{
            clipPath: `circle(${reveal * 1200}px at 960px 540px)`,
            background: `radial-gradient(900px 600px at 100% 0%, rgba(28,109,182,.14), transparent 70%),
                radial-gradient(800px 600px at 0% 100%, rgba(32,167,149,.14), transparent 70%), #fff`,
            textAlign: 'center',
        }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 150, fontSize: 84, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, color: color.charcoal, ...rise(t, 0.45, 0.45, 30) }}>
                Keep the link. <span style={{ color: color.teal }}>Change the destination.</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 270, fontSize: 36, color: color.g600, ...rise(t, 0.85, 0.45, 24) }}>
                RedirHub is the link infrastructure for your domain.
            </div>

            {/* Connectors with traffic flowing left → right. */}
            {[[640, 860], [1060, 1280]].map(([a, b], k) => (
                <div key={a} style={{ position: 'absolute', left: a, top: Y - 2, width: b - a, height: 4, borderRadius: 2, background: color.g300, ...fx(easeOut(prog(t, 1.5 + k * 0.3, 1.9 + k * 0.3))) }}>
                    {[0, 1, 2].map((i) => {
                        const p = (t * 0.9 + i / 3 + k * 0.15) % 1;
                        return <div key={i} style={{ position: 'absolute', left: `${p * 100}%`, top: -7, width: 18, height: 18, marginLeft: -9, borderRadius: '50%', background: k ? color.teal : color.blue, opacity: flow * Math.sin(p * Math.PI) }} />;
                    })}
                </div>
            ))}

            <Node x={160} kicker="Your link" tone={color.blue} style={rise(t, 1.2, 0.45, 40)}
                badge={<><IconLock size={22} color={color.blue} />Stays the same</>} badgeBg={color.blueBg} badgeColor={color.blue}>
                {shortLink}
            </Node>

            <div style={{
                position: 'absolute', left: 860, top: Y - 100, width: 200, height: 200, borderRadius: '50%', background: '#fff',
                boxShadow: `0 20px 50px rgba(16,24,40,.14), 0 0 0 ${10 + 6 * Math.sin(t * 5) * flow}px rgba(32,167,149,.12)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...fx(easeOut(prog(t, 1.5, 1.9)), 0, 0, lerp(0.6, 1, easeBack(prog(t, 1.5, 1.95)))),
            }}>
                <div style={{ height: 96 }}><RedirHubIcon /></div>
            </div>
            <div style={{ position: 'absolute', left: 810, width: 300, top: Y + 120, fontSize: 26, fontWeight: 800, color: color.charcoal, ...rise(t, 1.7, 0.4, 16) }}>RedirHub</div>

            <Node x={1280} kicker="Destination" tone={color.teal} style={rise(t, 1.6, 0.45, 40)}
                badge="Change it anytime" badgeBg="#E6F6F4" badgeColor="#138373">
                <span style={{ display: 'inline-block', ...fx(easeOut(Math.min(1, since / 0.3)), 0, (1 - easeOut(Math.min(1, since / 0.3))) * 30) }}>{dests[di]}</span>
            </Node>

            <div style={{ position: 'absolute', left: 0, right: 0, top: 840, fontSize: 30, color: color.g600, ...rise(t, 4.9, 0.45, 20) }}>
                For <b style={{ color: color.charcoal }}>domain redirects</b>, <b style={{ color: color.charcoal }}>website migrations</b>, <b style={{ color: color.charcoal }}>branded links</b> and <b style={{ color: color.charcoal }}>QR codes</b>.
            </div>
        </AbsoluteFill>
    );
}

function Node({ x, kicker, tone, badge, badgeBg, badgeColor, style, children }: {
    x: number; kicker: string; tone: string; badge: React.ReactNode; badgeBg: string; badgeColor: string;
    style: React.CSSProperties; children: React.ReactNode;
}) {
    return (
        <div style={{ position: 'absolute', left: x, top: Y - 110, width: 480, ...style }}>
            <div style={{
                height: 220, borderRadius: 28, background: '#fff', border: `2px solid ${tone}`, boxShadow: '0 20px 50px rgba(16,24,40,.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
            }}>
                <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: tone }}>{kicker}</div>
                <div style={{ fontFamily: font.mono, fontSize: 30, fontWeight: 700, color: color.charcoal, whiteSpace: 'nowrap', height: 40, overflow: 'hidden' }}>{children}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 50, padding: '0 22px', borderRadius: 30, fontSize: 22, fontWeight: 700, background: badgeBg, color: badgeColor }}>{badge}</div>
            </div>
        </div>
    );
}
