/* 35.9–44.3s (8.4s) · Chapter 4: a destination breaks, monitoring flags it, it's
   fixed in place. Monitoring is plan-qualified (see the note). Times are local. */
import { color, font } from '../../brand/tokens';
import { Chip, LinkRow, Pill, Toast } from '../../components/Dashboard';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { IconBell, IconCheck, IconGlobe, IconLink, IconQr } from '../../components/icons';
import { easeBack, easeOut, fx, lerp, prog, shake, useTime } from '../../lib/anim';
import { Caret, Chapter, CONTENT, typed } from './Layout';
import type { HomepageExplainerProps } from './props';

export const MONITOR_BREAK = 1.8;
export const MONITOR_CLICKS = [3.2, 3.32] as const; // double-click to edit
export const MONITOR_TYPING = [3.6, 4.5] as const;
export const MONITOR_FIXED = 4.8;
const CURSOR: readonly CursorKey[] = [[2.4, 1600, 1000], [3.1, CONTENT.x + 330, CONTENT.y + 373]];

export function Monitor(props: HomepageExplainerProps) {
    const t = useTime();
    const broken = t >= MONITOR_BREAK && t < MONITOR_FIXED;
    const editing = t >= 3.32 && t < MONITOR_FIXED;
    const brokenUrl = `https://${props.domain}/download`;
    const fixedUrl = `https://${props.domain}/app`;
    const dest = t < 3.6 ? brokenUrl : typed(fixedUrl, t, ...MONITOR_TYPING);
    const flip = (a: number) => lerp(0.6, 1, easeBack(prog(t, a, a + 0.3)));
    const alertK = easeOut(prog(t, 2.0, 2.4)) * (1 - prog(t, 3.0, 3.25));
    const okK = easeOut(prog(t, 4.9, 5.3)) * (1 - prog(t, 7.4, 7.7));

    return (
        <Chapter
            t={t} index={3} nav="monitor" address="dash.redirhub.com/monitor"
            title={<>A working redirect can still lead <span style={{ color: color.teal }}>somewhere broken.</span></>}
            body={<>RedirHub follows each link to its final page and alerts you when the destination breaks.</>}
            note="Link health monitoring is available on eligible plans."
            overlay={<Cursor t={t} keys={CURSOR} clicks={MONITOR_CLICKS} show={2.4} hide={3.7} />}
        >
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.02em', color: color.charcoal, marginRight: 'auto' }}>Monitor</div>
                    <Chip active>All</Chip>
                    <Chip>Issues <span style={{
                        minWidth: 36, height: 36, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, padding: '0 10px', background: broken ? '#FEE4E2' : color.g100, color: broken ? color.redText : color.g700,
                    }}>{broken ? 1 : 0}</span></Chip>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 90 }}>
                    <LinkRow icon={<IconGlobe size={40} color={color.teal} />} source={props.extraDomain} destination={`https://${props.domain}`} status={<Pill tone="ok">Healthy</Pill>} />
                    <LinkRow
                        icon={<IconLink size={40} color={color.amber} />} source={`go.${props.domain}/app`}
                        destination={editing ? '' : t < MONITOR_FIXED ? brokenUrl : fixedUrl}
                        dot={broken ? '#F04438' : '#12B76A'}
                        style={{
                            marginLeft: shake(t, MONITOR_BREAK, 0.5, 10, 60),
                            borderColor: broken ? '#FDA29B' : t >= MONITOR_FIXED && t < 6 ? color.teal : color.g200,
                            background: broken ? '#FFFBFA' : '#fff',
                        }}
                        status={<>
                            <Pill tone="ok" style={fx(broken ? 0 : 1, 0, 0, t >= MONITOR_FIXED ? flip(MONITOR_FIXED) : 1)}>Healthy</Pill>
                            <Pill tone="bad" style={{ position: 'absolute', right: 0, top: 0, ...fx(broken ? 1 : 0, 0, 0, flip(MONITOR_BREAK)) }}>404</Pill>
                        </>}
                    />
                    <LinkRow icon={<IconQr size={40} color={color.blue} />} source={`go.${props.domain}/qr`} destination={`https://${props.domain}/menu`} status={<Pill tone="ok">Healthy</Pill>} />
                </div>
                {/* Inline edit of the broken destination (double-click to edit). */}
                <div style={{
                    position: 'absolute', left: 130, width: 420, top: 90 + 170 + 88, height: 50, borderRadius: 12,
                    border: `2px solid ${color.blue}`, boxShadow: '0 0 0 5px rgba(28,109,182,.15)', background: '#fff',
                    display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: font.mono, fontSize: 22, fontWeight: 600, color: color.g700,
                    ...fx(editing ? 1 : 0),
                }}>
                    <span style={t < 3.6 ? { background: '#B2D4F5', borderRadius: 4 } : undefined}>{dest}</span>
                    <Caret on={t >= 3.6 && (Math.floor(t * 2.5) % 2 === 0 || t < 4.5)} />
                </div>
            </div>
            <Toast
                icon={<IconBell size={40} color={color.amber} />} iconBg="rgba(229,148,38,.2)" background={color.dark}
                title="Monitor alert" body={`go.${props.domain}/app → destination returns 404`}
                style={fx(alertK, 0, (1 - alertK) * 140)}
            />
            <Toast
                icon={<IconCheck size={40} color="#fff" />} iconBg="rgba(255,255,255,.18)" background="#0E6B5F"
                title="Destination updated" body={`go.${props.domain}/app → ${fixedUrl.replace('https://', '')}`}
                style={fx(okK, 0, (1 - okK) * 140)}
            />
        </Chapter>
    );
}
