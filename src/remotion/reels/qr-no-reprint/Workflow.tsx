/* 6.55–17.85s (11.3s) · The dashboard: spot the 404, change the destination, done.
   Times below are local to this scene. */
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import {
    BrowserWindow, Chip, Field, IconButton, LinkRow, Pill, StepHeading, Toast, View, Avatar,
} from '../../components/Dashboard';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { BrandedQr } from '../../components/QrCode';
import {
    IconBell, IconCheck, IconCopy, IconDots, IconDownCircle, IconGlobe, IconLink, IconPulse, IconQr, IconSearch,
} from '../../components/icons';
import { easeBack, easeInOut, easeOut, fx, lerp, prog, rise, shake, useTime } from '../../lib/anim';
import { links, type QrNoReprintProps } from './props';

/* Pointer path, in composition pixels: row 1 → To field → Save. */
const CURSOR: readonly CursorKey[] = [
    [2.05, 920, 1720], [2.95, 480, 946], [3.95, 480, 946], [4.45, 640, 1131],
    [6.95, 640, 1131], [7.45, 899, 1131], [8.25, 899, 1131], [8.75, 1000, 1750],
];
const CLICKS = [3.1, 4.5, 7.6] as const;

export function Workflow(props: QrNoReprintProps) {
    const t = useTime();
    const { shortLink, oldUrl, newUrl, newDisplay } = links(props);

    const reveal = easeInOut(prog(t, 0, 0.6));
    const toDetail = easeInOut(prog(t, 3.3, 3.75));
    const flagged = prog(t, 1.2, 1.35) > 0.5;
    const fixedK = prog(t, 7.8, 7.95);
    const saved = t >= 7.8;
    const focused = t >= 4.5 && t < 7.6;
    const selected = t >= 4.8 && t < 5.2;
    const typed = prog(t, 5.25, 6.8);
    const toText = t < 5.2 ? oldUrl : newUrl.slice(0, Math.round(typed * newUrl.length));
    const caretOn = focused && !selected && (Math.floor(t * 2.5) % 2 === 0 || (typed > 0 && typed < 1));
    const press = Math.max(0, 1 - Math.abs(t - 7.6) / 0.12);
    const ringPulse = t > 9.0 ? 0.75 + 0.25 * Math.sin((t - 9.0) * 6) : 0;
    const clicks = 3412 + (t > 9.05 ? Math.floor((t - 9.05) * 3) : 0);
    const winIn = easeOut(prog(t, 0.35, 0.85));

    return (
        <AbsoluteFill style={{
            clipPath: `circle(${reveal * 1400}px at 540px 1100px)`,
            background: `radial-gradient(900px 600px at 100% 0%, rgba(28,109,182,.12), transparent 70%),
                radial-gradient(800px 600px at 0% 100%, rgba(32,167,149,.12), transparent 70%), ${color.g100}`,
        }}>
            <div style={{ position: 'absolute', left: 60, right: 60, top: 200, height: 320 }}>
                <StepHeading step="STEP 1 · SPOT IT" title={<>RedirHub flags the<br />broken destination.</>} style={rise(t, 0.45, 0.45, 30, 3.5, 0.25)} />
                <StepHeading step="STEP 2 · FIX IT" title={<>Point the same link<br />at the new page.</>} style={rise(t, 3.75, 0.4, 30, 8.0, 0.25)} />
                <StepHeading step="STEP 3 · DONE" tone="teal" title={<>Saved. Next scan<br />lands on the sale.</>} style={rise(t, 8.25, 0.4, 30)} />
            </div>

            <BrowserWindow
                address={toDetail > 0.5 ? 'dash.redirhub.com/links/spring-flyer' : 'dash.redirhub.com/links'}
                style={{ left: 36, top: 540, ...fx(winIn, 0, (1 - easeOut(prog(t, 0.35, 0.95))) * 120) }}
            >
                {/* Links list */}
                <View style={fx(1 - toDetail, -toDetail * 120)}>
                    <div style={{ height: 96, borderRadius: 20, border: `2px solid ${color.g300}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px', fontSize: 32, color: color.g500 }}>
                        <IconSearch size={36} color={color.g500} />Search in 42 links
                    </div>
                    <div style={{ display: 'flex', gap: 14, margin: '22px 0 24px' }}>
                        <Chip active>All</Chip><Chip>Active</Chip>
                        <Chip>Issues <span style={{
                            minWidth: 36, height: 36, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 22, padding: '0 10px', background: flagged ? '#FEE4E2' : color.g100, color: flagged ? color.redText : color.g700,
                        }}>{flagged ? 1 : 0}</span></Chip>
                    </div>
                    <LinkRow
                        icon={<IconQr size={40} color={color.blue} />} source={shortLink} destination={oldUrl}
                        dot={flagged ? '#F04438' : '#12B76A'}
                        style={{
                            marginLeft: shake(t, 1.25, 0.5, 10, 60),
                            borderColor: flagged ? '#FDA29B' : color.g200, background: flagged ? '#FFFBFA' : '#fff',
                            boxShadow: t > 2.75 && t < 3.35 ? '0 0 0 5px rgba(28,109,182,.25)' : 'none',
                        }}
                        status={<>
                            <Pill tone="ok" style={fx(1 - prog(t, 1.2, 1.35))}>Active</Pill>
                            <Pill tone="bad" style={{ position: 'absolute', right: 0, top: 0, ...fx(prog(t, 1.2, 1.35), 0, 0, lerp(0.6, 1, easeBack(prog(t, 1.2, 1.5)))) }}>404</Pill>
                        </>}
                    />
                    <LinkRow icon={<IconQr size={40} color={color.blue} />} source={`go.${props.domain}/menu`} destination={`https://${props.domain}/menu`} status={<Pill tone="ok">Active</Pill>} />
                    <LinkRow icon={<IconGlobe size={40} color={color.teal} />} source={props.domain.replace(/\.com$/, '.co')} destination={`https://${props.domain}`} status={<Pill tone="ok">Active</Pill>} />
                    <LinkRow icon={<IconLink size={40} color={color.amber} />} source={`go.${props.domain}/app`} destination="https://apps.apple.com/app/yourbrand" status={<Pill tone="ok">Active</Pill>} />
                    <Toast
                        icon={<IconBell size={40} color={color.amber} />} iconBg="rgba(229,148,38,.2)" background={color.dark}
                        title="Monitor alert" body={`${shortLink} → destination returns 404`}
                        style={fx(easeOut(prog(t, 1.4, 1.8)), 0, (1 - easeOut(prog(t, 1.4, 1.8))) * 160)}
                    />
                </View>

                {/* Link detail */}
                <View style={fx(toDetail, (1 - toDetail) * 120)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                        <Avatar size={92} icon={<IconQr size={44} color={color.blue} />} />
                        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em' }}>Spring flyer QR</div>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
                            <IconButton><IconCopy size={32} color={color.g700} /></IconButton>
                            <IconButton active><IconQr size={32} color={color.g700} /></IconButton>
                            <IconButton><IconDots size={32} color={color.g700} /></IconButton>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 30, fontSize: 27, color: color.g600 }}>
                        <div style={{ position: 'relative', height: 58, width: 300 }}>
                            <Pill tone="bad" style={fx(1 - fixedK)}>Destination 404</Pill>
                            <Pill tone="ok" style={{ position: 'absolute', left: 0, top: 0, ...fx(fixedK, 0, 0, lerp(0.7, 1, easeBack(prog(t, 7.8, 8.1)))) }}>Monitored · Healthy</Pill>
                        </div>
                        <span>⌘ 302 Redirect</span>
                        <span>Created 02.03.2026</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 34 }}>
                        <div style={{ width: 70, fontSize: 30, color: color.g600, fontWeight: 500 }}>From</div>
                        <Field style={{ background: color.g50 }}>{shortLink}</Field>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '26px 0 0 96px', fontSize: 36 }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FDF3E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconDownCircle size={30} color={color.amber} />
                        </div>
                        <IconPulse size={36} color={color.g700} />
                        <b>{clicks.toLocaleString('en-US')}</b><span style={{ color: color.g500 }}>Clicks</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginTop: 26 }}>
                        <div style={{ width: 70, fontSize: 30, color: color.g600, fontWeight: 500 }}>To</div>
                        <Field style={{
                            borderColor: saved ? color.teal : focused ? color.blue : '#FDA29B',
                            boxShadow: focused ? '0 0 0 6px rgba(28,109,182,.15)' : saved ? '0 0 0 6px rgba(32,167,149,.15)' : 'none',
                            color: saved ? color.okText : t < 4.5 ? color.redText : color.g700,
                            background: saved ? '#F6FEF9' : t < 4.5 ? '#FFFBFA' : '#fff',
                        }}>
                            <span style={selected ? { background: '#B2D4F5', borderRadius: 4 } : undefined}>{toText}</span>
                            <span style={{ display: 'inline-block', width: 3, height: 40, background: color.blue, marginLeft: 2, visibility: caretOn ? 'visible' : 'hidden' }} />
                        </Field>
                        <div style={{
                            flex: 'none', width: 210, height: 94, borderRadius: 20, color: '#fff', fontSize: 30, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            background: saved ? color.teal : color.blue, transform: `scale(${1 - press * 0.06})`,
                        }}>{saved ? <><IconCheck size={30} color="#fff" />Saved</> : 'Save'}</div>
                    </div>
                    <div style={{ marginTop: 40, borderRadius: 28, background: color.g100, padding: 28, display: 'flex', gap: 30, alignItems: 'center' }}>
                        <div style={{ flex: 'none', position: 'relative' }}>
                            <BrandedQr value={props.qrValue} label={shortLink} size={206} labelSize={17}  />
                            <div style={{ position: 'absolute', inset: -10, borderRadius: 26, border: `6px solid ${color.teal}`, ...fx(prog(t, 9.0, 9.4) * ringPulse) }} />
                            <div style={{
                                position: 'absolute', left: '50%', top: -26, whiteSpace: 'nowrap', background: color.teal, color: '#fff',
                                fontSize: 24, fontWeight: 800, padding: '10px 20px', borderRadius: 30,
                                opacity: easeOut(prog(t, 9.1, 9.4)),
                                transform: `translateX(-50%) scale(${lerp(0.6, 1, easeBack(prog(t, 9.1, 9.45)))})`,
                            }}>Unchanged ✓</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 34, fontWeight: 800 }}>The printed QR</div>
                            <div style={{ fontSize: 27, color: color.g600, marginTop: 12, lineHeight: 1.4 }}>
                                Printed with its link, so people<br />know where it goes. Only the<br />destination behind it changes.
                            </div>
                        </div>
                    </div>
                    <Toast
                        icon={<IconCheck size={40} color="#fff" />} iconBg="rgba(255,255,255,.18)" background="#0E6B5F"
                        title="Destination updated" body={`${shortLink} → ${newDisplay}`}
                        style={fx(easeOut(prog(t, 7.95, 8.35)) * (1 - prog(t, 8.8, 9.05)), 0, (1 - easeOut(prog(t, 7.95, 8.35))) * 160)}
                    />
                </View>
            </BrowserWindow>

            <Cursor t={t} keys={CURSOR} clicks={CLICKS} show={1.95} hide={8.45} />
        </AbsoluteFill>
    );
}
