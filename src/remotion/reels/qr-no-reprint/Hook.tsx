/* 0–7.15s · Hook (flyer scan → 404) and the fork (static QR vs RedirHub QR). */
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { CameraView, NotFoundPage, Phone } from '../../components/Phone';
import { Flyer, FlyerSheet } from '../../components/Flyer';
import { IconCheck, IconX } from '../../components/icons';
import { clamp, easeBack, easeOut, fx, lerp, prog, rise, shake, useTime } from '../../lib/anim';
import { links, type QrNoReprintProps } from './props';

const headline = { fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04, fontSize: 88, whiteSpace: 'nowrap' } as const;

export function Hook(props: QrNoReprintProps) {
    const t = useTime();
    const { shortLink, oldDisplay } = links(props);

    const hookOut = prog(t, 3.05, 3.4);
    const l2 = easeOut(prog(t, 0.75, 1.1));
    const l2out = prog(t, 2.2, 2.35);
    const fOut = easeOut(prog(t, 3.05, 3.45));
    const settle = easeOut(prog(t, 0, 0.6));
    const fan = (d: number) => easeOut(prog(t, 0.1, 0.1 + d));
    const phoneIn = easeOut(prog(t, 0.95, 1.5));
    const err = prog(t, 2.25, 2.4);
    const dim = easeOut(prog(t, 5.7, 6.1));

    return (
        <AbsoluteFill style={{
            background: `radial-gradient(900px 700px at 85% 70%, rgba(28,109,182,.35), transparent 70%),
                radial-gradient(700px 600px at 10% 20%, rgba(32,167,149,.18), transparent 70%), ${color.dark}`,
        }}>
            {/* Headline: on screen from frame 0 so the thumbnail already hooks. */}
            <div style={{ position: 'absolute', left: 80, right: 80, top: 200 }}>
                <div style={{ ...headline, color: '#fff', ...fx(1 - hookOut, 0, -hookOut * 40) }}>{props.flyerCount} flyers printed.</div>
                <div style={{ position: 'relative', height: 110, marginTop: 10 }}>
                    <div style={{ ...headline, position: 'absolute', color: color.g400, ...fx(l2 * (1 - l2out), (1 - l2) * 60) }}>Then the site changed.</div>
                    <div style={{ ...headline, position: 'absolute', color: '#F97066', ...fx(clamp(prog(t, 2.3, 2.45)) * (1 - hookOut), 0, 0, lerp(0.7, 1, easeBack(prog(t, 2.3, 2.65)))) }}>Every scan: 404.</div>
                </div>
            </div>

            {/* The printed stack. */}
            <div style={{ position: 'absolute', left: 120, top: 640, ...fx(1 - fOut, lerp(-20, 0, settle) - fOut * 200, fOut * 60, lerp(1.04, 1, settle) - fOut * 0.2) }}>
                <FlyerSheet style={{ transform: `translate(${36 * fan(0.7)}px,10px) rotate(${7 * fan(0.7)}deg)` }} />
                <FlyerSheet style={{ transform: `translate(${18 * fan(0.6)}px,4px) rotate(${3 * fan(0.6)}deg)` }} />
                <Flyer title="SPRING SALE" subtitle="Up to 40% off everything" caption="Scan to shop" printedUrl={shortLink} qrValue={props.qrValue} style={{ transform: 'rotate(-3deg)' }} />
            </div>

            {/* Phone scans the flyer and hits the dead page. */}
            <Phone style={{ left: 560 + shake(t, 2.3, 0.45, 14), top: 860, ...fx(1 - fOut, fOut * 200, (1 - phoneIn) * 1100 + fOut * 60, 1 - fOut * 0.2, lerp(8, 4, phoneIn)) }}>
                <CameraView
                    qrValue={props.qrValue}
                    scan={prog(t, 1.5, 2.1)}
                    bubble={shortLink}
                    bubbleStyle={{ opacity: clamp(prog(t, 1.8, 1.95)), transform: `translateX(-50%) scale(${lerp(0.8, 1, easeBack(prog(t, 1.8, 2.05)))})` }}
                    style={{ opacity: 1 - err }}
                />
                <div style={{ position: 'absolute', inset: 0, opacity: err }}><NotFoundPage url={oldDisplay} /></div>
            </Phone>
            <AbsoluteFill style={{ background: color.red, mixBlendMode: 'screen', opacity: 0.28 * Math.max(0, 1 - Math.abs(t - 2.35) / 0.25) }} />

            {/* Fork: why the QR type decides the fix. */}
            <div style={{ position: 'absolute', left: 80, right: 80, top: 230, fontSize: 84, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04, color: '#fff', ...rise(t, 3.35, 0.45, 40) }}>
                Now what?<br /><span style={{ color: color.g400 }}>Depends on the QR.</span>
            </div>
            <ForkCard
                top={640} tone="#F97066" icon={<IconX size={44} color="#F97066" />} iconBg="rgba(217,45,32,.18)"
                background="#1D2939" border="2px solid #344054" kicker="Static QR code"
                body={<>The old URL is printed<br />into the ink.</>} fix={`Fix: reprint all ${props.flyerCount}.`}
                style={{ ...rise(t, 3.75, 0.45, 60), opacity: easeOut(prog(t, 3.75, 4.2)) * lerp(1, 0.38, dim) }}
            />
            <ForkCard
                top={1060} tone="#5FD3C1" icon={<IconCheck size={46} color="#fff" />} iconBg={color.teal}
                background="rgba(32,167,149,.14)" border={`2px solid ${color.teal}`} kicker="RedirHub QR on your domain"
                body={<>The printed URL is a link<br />you still control.</>} fix="Fix: change one field."
                style={{
                    ...rise(t, 4.75, 0.45, 60),
                    transform: `translateY(${(1 - easeOut(prog(t, 4.75, 5.2))) * 60}px) scale(${lerp(1, 1.04, dim)})`,
                    boxShadow: `0 0 ${80 * dim}px rgba(32,167,149,${0.45 * dim})`,
                }}
            />
        </AbsoluteFill>
    );
}

function ForkCard({ top, tone, icon, iconBg, background, border, kicker, body, fix, style }: {
    top: number; tone: string; icon: React.ReactNode; iconBg: string; background: string; border: string;
    kicker: string; body: React.ReactNode; fix: string; style: React.CSSProperties;
}) {
    return (
        <div style={{ position: 'absolute', left: 70, right: 70, top, borderRadius: 34, padding: '40px 44px', display: 'flex', gap: 30, alignItems: 'flex-start', background, border, ...style }}>
            <div style={{ flex: 'none', width: 84, height: 84, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tone }}>{kicker}</div>
                <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.12, color: '#fff', marginTop: 10, fontFamily: font.sans }}>{body}</div>
                <div style={{ fontSize: 38, fontWeight: 800, marginTop: 18, color: tone }}>{fix}</div>
            </div>
        </div>
    );
}
