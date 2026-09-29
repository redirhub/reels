/* 17.3–25.9s (8.6s) · Same printed QR, before vs after. Times are local. */
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { CameraView, NotFoundPage, Phone, SalePage } from '../../components/Phone';
import { IconArrowRight, IconCheck } from '../../components/icons';
import { clamp, easeBack, easeInOut, easeOut, fx, lerp, prog, rise, useTime } from '../../lib/anim';
import { links, type QrNoReprintProps } from './props';

const tag = (bg: string): React.CSSProperties => ({
    position: 'absolute', top: 590, display: 'inline-flex', alignItems: 'center', height: 62, padding: '0 26px',
    borderRadius: 40, fontSize: 27, fontWeight: 800, letterSpacing: '.08em', color: '#fff', background: bg,
});
const headline = { position: 'absolute', left: 70, right: 70, textAlign: 'center', fontSize: 92, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04 } as const;

export function BeforeAfter(props: QrNoReprintProps) {
    const t = useTime();
    const { shortLink, oldDisplay, newDisplay } = links(props);

    const slide = easeInOut(prog(t, 0, 0.55));
    const before = easeOut(prog(t, 1.1, 1.65));
    const after = easeOut(prog(t, 1.7, 2.25));
    const sale = prog(t, 3.0, 3.2);
    const push = easeInOut(prog(t, 4.2, 8.1));

    return (
        <AbsoluteFill style={{
            transform: `translateY(${(1 - slide) * 1920}px)`,
            background: `radial-gradient(900px 700px at 90% 10%, rgba(32,167,149,.35), transparent 65%),
                linear-gradient(165deg, ${color.blue} 0%, #134a7c 55%, ${color.dark} 100%)`,
        }}>
            <div style={{ ...headline, top: 200, color: '#fff', ...rise(t, 0.3) }}>Same printed QR.</div>
            <div style={{ ...headline, top: 310, color: '#9FD8FF', ...rise(t, 0.7) }}>No reprint.</div>
            <div style={{
                position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 16, fontFamily: font.mono, fontSize: 27, fontWeight: 600, ...rise(t, 3.6, 0.45, 30),
            }}>
                <span style={{ padding: '14px 20px', borderRadius: 16, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: '#fff' }}>{shortLink}</span>
                <IconArrowRight size={40} color="#fff" />
                <span style={{ padding: '14px 20px', borderRadius: 16, background: color.teal, color: '#fff' }}>{newDisplay}</span>
            </div>

            <div style={{ ...tag(color.red), left: 130, ...fx(easeOut(prog(t, 1.4, 1.7))) }}>BEFORE</div>
            <div style={{ ...tag(color.teal), left: 620, ...fx(easeOut(prog(t, 2.0, 2.3))) }}>AFTER</div>

            <Phone width={450} height={880} style={{
                left: 60, top: 680, ...fx(before, 0, (1 - before) * 500, 1, lerp(-6, -2, before)),
                filter: `saturate(${lerp(1, 0.55, push)}) brightness(${lerp(1, 0.8, push)})`,
            }}>
                <NotFoundPage url={oldDisplay} />
            </Phone>
            <Phone width={450} height={880} style={{ left: 570, top: 680, ...fx(after, 0, (1 - after) * 500, lerp(1, 1.04, push), lerp(6, 2, after)) }}>
                <CameraView qrValue={props.qrValue} scan={prog(t, 2.3, 3.0)} style={{ opacity: 1 - sale }} />
                <div style={{ position: 'absolute', inset: 0, opacity: sale }}>
                    <SalePage url={newDisplay} title="SPRING SALE" subtitle="Up to 40% off everything" cta="Shop the sale" />
                </div>
            </Phone>
            <div style={{
                position: 'absolute', left: 930, top: 650, width: 110, height: 110, borderRadius: '50%', background: color.teal,
                border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.3)',
                ...fx(clamp(prog(t, 3.15, 3.3)), 0, 0, lerp(0.3, 1, easeBack(prog(t, 3.15, 3.5)))),
            }}><IconCheck size={54} color="#fff" /></div>
        </AbsoluteFill>
    );
}
