/* ACT D (part two) — beats 48–52. Two closing tips, the callback to "It looks done," and
   "Now it is." The end card follows as its own sequence. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { font, yt } from '../../brand/tokens';
import { BrowserCard, SkeletonPage } from '../../components/BrowserCard';
import { GlassCard } from '../../components/GlassCard';
import { IdCard } from '../../components/IdCard';
import { Padlock } from '../../components/Padlock';
import { RedirectLine } from '../../components/RedirectLine';
import { UrlPill } from '../../components/UrlPill';
import { Caption, DomainPill, Night, PILL_Y, SAFE, Tag, W, pillGeometry } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('close');

export function CloseScene(p: RedirectDomainProps) {
    const t = useTime();
    const tipsOn = t < L.at(51) - 0.3;
    const a = easeOut(prog(t, L.at(49), L.at(49) + 0.5));
    const b = easeOut(prog(t, L.at(50), L.at(50) + 0.5));
    const flip = easeInOut(prog(t, L.at(50) + 2.4, L.at(50) + 3.2));
    const out = easeInOut(prog(t, L.at(51) - 0.6, L.at(51) - 0.1));

    // Callback: the beat-3 frame, small in the corner, then expanding.
    const g = pillGeometry(p.oldDomain, p.newDomain);
    const cbIn = easeOut(prog(t, L.at(51) + 0.2, L.at(51) + 0.8));
    const grow = easeInOut(prog(t, L.at(52) - 0.2, L.at(52) + 0.7));
    const redraw = easeInOut(prog(t, L.at(52) + 0.5, L.at(52) + 1.3));
    const scale = lerp(0.42, 1, grow);
    const ox = lerp(W - SAFE.x - 1920 * 0.42, 0, grow), oy = lerp(540, 0, grow);
    const fade = prog(t, L.end(52) - 0.25, L.end(52));

    return (
        <Night style={{ opacity: 1 - fade }}>
            <Tag t={t} from={L.at(48)} until={L.at(51) - 0.4}>BEFORE YOU GO</Tag>
            {tipsOn && (
                <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 260, display: 'flex', gap: 48, ...fx(1 - out, 0, out * 30) }}>
                    <GlassCard padding={40} accent={yt.teal} style={{ flex: 1, ...fx(a, 0, (1 - a) * 24) }}>
                        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: yt.teal }}>ONE</div>
                        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', marginTop: 14, lineHeight: 1.1 }}>A padlock means private.<br />Not honest.</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 30 }}>
                            <Padlock size={90} color={yt.teal} />
                            <div style={{ transform: 'scale(.62)', transformOrigin: 'left top', height: 170, width: 273 }}><IdCard domain={p.newDomain} width={440} /></div>
                        </div>
                        <div style={{ fontSize: 26, color: yt.inkSoft, marginTop: 10 }}>An ID card, not a character reference.</div>
                    </GlassCard>
                    <GlassCard padding={40} accent={yt.teal} style={{ flex: 1, ...fx(b, 0, (1 - b) * 24) }}>
                        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: yt.teal }}>TWO</div>
                        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', marginTop: 14, lineHeight: 1.1 }}>Don’t let the old<br />domain expire.</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 30 }}>
                            <UrlPill url={p.oldDomain} dot="teal" size={28} />
                            <div style={{ position: 'relative', width: 150, height: 120, perspective: 800 }}>
                                <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#fff', color: '#101828', fontFamily: font.display, textAlign: 'center', padding: 10, boxShadow: '0 20px 40px rgba(0,0,0,.35)' }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.1em', color: '#667085' }}>RENEWS</div>
                                    <div style={{ fontSize: 40, fontWeight: 800, marginTop: 4 }}>{flip > 0.5 ? '2028' : '2027'}</div>
                                    <div style={{ fontSize: 16, color: yt.teal, fontWeight: 700 }}>auto-renew on</div>
                                </div>
                                <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#F2F4F7', transformOrigin: 'top', transform: `rotateX(${-flip * 180}deg)`, backfaceVisibility: 'hidden', opacity: flip > 0 && flip < 1 ? 1 : 0 }} />
                            </div>
                        </div>
                        <div style={{ fontSize: 26, color: yt.inkSoft, marginTop: 10 }}>As long as anyone might still have the old address.</div>
                    </GlassCard>
                </div>
            )}

            {/* Callback frame */}
            {t >= L.at(51) && (
                <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${ox}px, ${oy}px) scale(${scale})`, ...fx(cbIn), borderRadius: lerp(28, 0, grow), overflow: 'hidden', boxShadow: grow < 1 ? '0 40px 100px rgba(0,0,0,.5)' : 'none', background: 'rgba(255,255,255,.02)' }}>
                    <DomainPill url={p.oldDomain} dot={redraw > 0.9 ? 'teal' : 'grey'} x={g.old.x} />
                    <DomainPill url={p.newDomain} dot="teal" x={g.new.x} />
                    <RedirectLine from={[g.old.right + 14, PILL_Y]} to={[g.new.left - 14, PILL_Y]} progress={grow < 1 ? 1 : redraw} color={grow < 1 ? yt.inkSoft : yt.teal} bend={0.12} traffic={redraw >= 1 ? 3 : 0} t={t} />
                    <div style={{ position: 'absolute', left: (W - 900) / 2, top: 600 }}>
                        <BrowserCard address={`https://${p.newDomain}`} lock="secure" dot={redraw > 0.9 ? 'teal' : 'none'} width={900} height={330}><SkeletonPage title="Welcome to mybrand" lines={2} /></BrowserCard>
                    </div>
                </div>
            )}
            <Caption t={t} from={L.word(51, 'Forwarding') - 0.15} until={L.at(52) + 0.4} y={200} size={40} color={yt.inkSoft}>Forwarding on. Old link opens. Looks done.</Caption>
            <Caption t={t} from={L.word(52, 'Now') - 0.05} until={L.end(52)} y={330} size={64} color={yt.ink} text="Now it is.">Now <span style={{ color: yt.teal }}>it is.</span></Caption>
        </Night>
    );
}
