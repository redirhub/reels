/* 0–6.3s · Hook: your links live everywhere, then the site moves and they break.
   Also reused by the recap (all fixed). Times are local. */
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { color, font } from '../../brand/tokens';
import { Pill } from '../../components/Dashboard';
import { BrandedQr } from '../../components/QrCode';
import { IconGlobe, IconLock, IconMail, IconQr, IconUser } from '../../components/icons';
import { clamp, easeBack, easeOut, fx, lerp, prog, shake, useTime } from '../../lib/anim';
import { links, type HomepageExplainerProps } from './props';

const headline = { fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, fontSize: 84, whiteSpace: 'nowrap' } as const;
/** When each card breaks (hook). */
export const BREAKS = [3.0, 3.25, 3.5, 3.75] as const;

export function Hook(props: HomepageExplainerProps) {
    const t = useTime();
    const l2 = easeOut(prog(t, 1.9, 2.3));
    const l2out = prog(t, 4.1, 4.25);
    const l3 = prog(t, 4.2, 4.35);
    const settle = easeOut(prog(t, 0, 0.8));

    return (
        <AbsoluteFill style={{
            background: `radial-gradient(1100px 700px at 85% 90%, rgba(28,109,182,.35), transparent 70%),
                radial-gradient(900px 600px at 10% 0%, rgba(32,167,149,.18), transparent 70%), ${color.dark}`,
        }}>
            {/* On screen from frame 0 so the poster frame already explains the problem. */}
            <div style={{ position: 'absolute', left: 125, top: 110 }}>
                <div style={{ ...headline, color: '#fff' }}>Your links are everywhere.</div>
                <div style={{ position: 'relative', height: 100, marginTop: 6 }}>
                    <div style={{ ...headline, position: 'absolute', color: color.g400, ...fx(l2 * (1 - l2out), (1 - l2) * 60) }}>Then your website moves.</div>
                    <div style={{ ...headline, position: 'absolute', color: '#F97066', ...fx(l3, 0, 0, lerp(0.8, 1, easeBack(prog(t, 4.2, 4.55)))) }}>Every one of them breaks.</div>
                </div>
            </div>
            <LinkCards props={props} t={t} flipAt={BREAKS} from="ok" style={{ transform: `scale(${lerp(1.03, 1, settle)})` }} />
            <AbsoluteFill style={{ background: color.red, mixBlendMode: 'screen', opacity: 0.22 * Math.max(0, 1 - Math.abs(t - 3.05) / 0.3) }} />
        </AbsoluteFill>
    );
}

/** The four places a link lives. Card i flips from `from` to the other state at flipAt[i]. */
export function LinkCards({ props, t, flipAt, from, style }: {
    props: HomepageExplainerProps; t: number; flipAt: readonly number[]; from: 'ok' | 'bad'; style?: CSSProperties;
}) {
    const { shortLink, oldDisplay } = links(props);
    const cards: { kicker: string; icon: ReactNode; url: string; body: ReactNode }[] = [
        {
            kicker: 'Printed flyer', icon: <IconQr size={26} color={color.g400} />, url: shortLink,
            body: <BrandedQr value={props.qrValue} label={shortLink} size={150} labelSize={13} style={{ margin: '0 auto', borderRadius: 14 }} />,
        },
        {
            kicker: 'Newsletter', icon: <IconMail size={26} color={color.g400} />, url: oldDisplay,
            body: (
                <div style={{ background: '#fff', borderRadius: 14, padding: 22, height: 186 }}>
                    <div style={{ height: 14, width: '70%', borderRadius: 7, background: color.g300 }} />
                    <div style={{ height: 12, width: '90%', borderRadius: 6, background: color.g200, marginTop: 14 }} />
                    <div style={{ height: 12, width: '80%', borderRadius: 6, background: color.g200, marginTop: 10 }} />
                    <div style={{ marginTop: 26, height: 56, borderRadius: 12, background: color.amber, color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Shop the sale</div>
                </div>
            ),
        },
        {
            kicker: 'Social bio', icon: <IconUser size={26} color={color.g400} />, url: `go.${props.domain}/app`,
            body: (
                <div style={{ background: '#fff', borderRadius: 14, padding: 22, height: 186, textAlign: 'center' }}>
                    <div style={{ width: 70, height: 70, borderRadius: '50%', margin: '0 auto', background: `linear-gradient(135deg, ${color.teal}, ${color.blue})` }} />
                    <div style={{ fontSize: 22, fontWeight: 800, color: color.charcoal, marginTop: 12 }}>Your Brand</div>
                    <div style={{ display: 'inline-block', marginTop: 12, padding: '8px 16px', borderRadius: 20, background: color.blueBg, color: color.blue, fontSize: 18, fontWeight: 700 }}>🔗 Get the app</div>
                </div>
            ),
        },
        {
            kicker: 'Old domain', icon: <IconGlobe size={26} color={color.g400} />, url: props.extraDomain,
            body: (
                <div style={{ background: '#fff', borderRadius: 14, height: 186, overflow: 'hidden' }}>
                    <div style={{ height: 52, background: color.g100, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontSize: 19, color: color.g700, fontWeight: 600 }}>
                        <IconLock size={18} color={color.g500} />{props.extraDomain}
                    </div>
                    <div style={{ padding: 20 }}>
                        <div style={{ height: 16, width: '60%', borderRadius: 8, background: color.g300 }} />
                        <div style={{ height: 12, width: '85%', borderRadius: 6, background: color.g200, marginTop: 14 }} />
                        <div style={{ height: 12, width: '75%', borderRadius: 6, background: color.g200, marginTop: 10 }} />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div style={{ position: 'absolute', left: 125, top: 400, display: 'flex', gap: 50, ...style }}>
            {cards.map((c, i) => {
                const flipped = t >= flipAt[i];
                const bad = from === 'ok' ? flipped : !flipped;
                const pop = flipped ? lerp(0.6, 1, easeBack(clamp(prog(t, flipAt[i], flipAt[i] + 0.3)))) : 1;
                return (
                    <div key={c.kicker} style={{
                        width: 380, height: 470, borderRadius: 30, padding: 26, display: 'flex', flexDirection: 'column',
                        background: bad ? 'rgba(217,45,32,.12)' : '#1D2939', border: `2px solid ${bad ? '#F97066' : '#344054'}`,
                        transform: `translateX(${from === 'ok' ? shake(t, flipAt[i], 0.4, 10) : 0}px)`,
                        boxShadow: !bad && from === 'bad' ? `0 0 ${50 * prog(t, flipAt[i], flipAt[i] + 0.3)}px rgba(32,167,149,.35)` : 'none',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: color.g400 }}>
                            {c.icon}{c.kicker}
                        </div>
                        <div style={{ marginTop: 22, height: 214, filter: bad ? 'grayscale(1) brightness(.6)' : 'none' }}>{c.body}</div>
                        <div style={{ marginTop: 'auto', fontFamily: font.mono, fontSize: 21, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.url}</div>
                        <div style={{ marginTop: 14, position: 'relative', height: 58 }}>
                            <Pill tone="ok" style={{ position: 'absolute', ...fx(bad ? 0 : 1, 0, 0, from === 'bad' ? pop : 1) }}>Works</Pill>
                            <Pill tone="bad" style={{ position: 'absolute', ...fx(bad ? 1 : 0, 0, 0, from === 'ok' ? pop : 1) }}>404 · Page not found</Pill>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
