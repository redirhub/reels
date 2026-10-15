/* Act C · The three steps, in RedirHub: w43-MainAddress (20–22), the dashboard (23–30: Links → Create →
   Domain Redirect → the form → the list, w43-DomainRedirect + w43-LinksList), w43-ConnectDNS (31–37) and
   w43-HttpsIssued (38). The product never animates something it doesn't do: 301 and Keep the path are the
   form's defaults, so they are ringed as she names them, not clicked. */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { clamp, easeInOut, easeOut, lerp, prog, useTime } from '../../lib/anim';
import { C, Eyebrow, Lock, MONO, Progress, RoomBg, SceneFade, Tick, TipCard, UI, outK, popIn, slideIn, fx, smooth } from './kit';
import { ConnectDialog, CreateButton, CreateChooser, HostnamesBody, LinksBody, RedirectForm, Shell } from './Product';
import type { ForwardDomainsProps } from './props';
import { local } from './timeline';

/** Blend two #rrggbb colours (the window's background as it turns from the list into the form). */
const mixHex = (a: string, b: string, k: number) => '#' + [1, 3, 5].map((i) => Math.round(lerp(parseInt(a.slice(i, i + 2), 16), parseInt(b.slice(i, i + 2), 16), clamp(k))).toString(16).padStart(2, '0')).join('');
/** Characters of `text` typed over [a, b]. */
const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.round(text.length * prog(t, a, b)));
/** 0→1→0 over [a, a+d]: a highlight that comes and goes. */
const bump = (t: number, a: number, d = 0.8) => Math.sin(Math.PI * prog(t, a, a + d));
/** 0→1 at a, holding until b, then back to `rest`. */
const hold = (t: number, a: number, b: number, rest = 0) => {
    const up = easeOut(prog(t, a, a + 0.3));
    return t < b ? up : lerp(rest, 1, 1 - easeOut(prog(t, b, b + 0.3))) * up;
};

/* ---------------------------------------------------------------- Step one: the main address */
const LM = local('main');
export function MainAddressScene({ main, extras, tips }: ForwardDomainsProps) {
    const t = useTime();
    const dim = easeOut(prog(t, LM.word(20, 'main') - 0.1, LM.word(20, 'main') + 0.4));
    const card = popIn(t, LM.word(20, 'main') - 0.1, 0.5);
    const ex = LM.word(21, 'exactly');
    const say = bump(t, LM.word(21, 'say') - 0.1, 1.0);
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.char} dash={C.teal}>STEP ONE · PICK THE MAIN ADDRESS</Eyebrow>
            <Progress fill={easeInOut(prog(t, LM.at(20) + 0.2, LM.at(20) + 0.8))} k={easeOut(prog(t, 0.2, 0.6))} />
            <div style={{ position: 'absolute', left: 120, top: 330, width: 1040, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, opacity: lerp(1, 0.75, dim) }}>
                    {extras.map((d, i) => (
                        <span key={d} style={{ display: 'inline-flex', alignItems: 'center', height: 64, padding: '0 26px', borderRadius: 32, background: 'linear-gradient(140deg, rgba(255,255,255,0.79) 0%, rgba(255,255,255,0.64) 100%)', boxShadow: 'inset 0 0 0 1.5px #FFFFFF, 0 20px 50px rgba(16,24,40,0.10)', fontFamily: MONO, fontSize: 28, color: C.g600, whiteSpace: 'nowrap', ...slideIn(t, 0.15 + i * 0.1, 0.4, 0, 16) }}>{d}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30, padding: '40px 44px', borderRadius: 32, background: '#FFFFFF', boxShadow: `0 0 0 ${4 + 4 * say}px ${C.teal}, 0 40px 100px rgba(16,24,40,0.18)`, ...card }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700, letterSpacing: '0.14em', color: C.g600 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: C.teal }} />MAIN ADDRESS</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, fontFamily: MONO, fontSize: 60, fontWeight: 600, whiteSpace: 'nowrap', color: C.char }}><Lock size={52} color={C.char} sw={2.6} />https://{main}</span>
                    <div style={{ display: 'flex', gap: 14 }}>
                        {['https', 'no www'].map((x, i) => (
                            <span key={x} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 20px', borderRadius: 24, background: '#F2F7FC', boxShadow: 'inset 0 0 0 1px #D1E9FF', fontSize: 22, fontWeight: 700, color: C.char, ...popIn(t, ex + i * 0.15, 0.4) }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> {x}
                            </span>
                        ))}
                        <span style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 4px', fontSize: 22, fontWeight: 600, color: C.g600, ...slideIn(t, ex + 0.35, 0.4, -12, 0) }}>exactly as people should see it</span>
                    </div>
                </div>
            </div>
            <TipCard label="QUICK TIP" title={tips.main} x={1290} y={520} w={510} style={slideIn(t, LM.word(22, 'quick') - 0.1, 0.5, 40, 0)} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Step two: the dashboard */
const LD = local('dash');
/** The window: the Links list (sidebar shell, 1000×633 at 1.2) or the full-page form (1235×566 at 1.36). */
const LIST = { w: 1000, h: 633, s: 1.2 }, FORM = { w: 1235, h: 566, s: 1.36 };
const WIN = { w: FORM.w * FORM.s, h: Math.max(LIST.h * LIST.s, FORM.h * FORM.s) };
export function DashScene({ main, extras, deepPath, tips }: ForwardDomainsProps) {
    const t = useTime();
    const T = {
        links: LD.word(24, 'links'), create: LD.word(24, 'create'), pick: LD.word(24, 'domain'), form: LD.word(24, 'redirect') + 0.3,
        from: LD.word(25, 'mybrand'), to: LD.word(25, 'https'), toEnd: LD.word(25, 'com') + 0.25, type: LD.word(25, '301'),
        keep: LD.word(26, 'keep'), deep: LD.word(26, 'mybrand'), home: LD.word(26, 'homepage'), root: LD.word(27, 'root'),
        save: LD.word(28, 'save') - 0.05, rows: [LD.word(28, 'co'), LD.word(28, 'typo'), LD.word(28, 'get')],
        dozens: LD.word(30, 'dozens') - 0.1, csvCreate: LD.word(30, 'create'), csvImport: LD.word(30, 'import', 1),
    };
    const back = T.save + 0.4;                                  // the form closes into the list
    const toForm = easeInOut(prog(t, T.form, T.form + 0.45)) * (1 - easeInOut(prog(t, back, back + 0.45)));
    const win = { w: lerp(LIST.w * LIST.s, FORM.w * FORM.s, toForm), h: lerp(LIST.h * LIST.s, FORM.h * FORM.s, toForm) };
    const rowsK = [back + 0.35, ...T.rows].map((a) => easeOut(prog(t, a, a + 0.4)));
    const nRows = rowsK.filter((k) => k > 0).length;
    const chooser = t >= T.create + 0.05 && t < T.form + 0.3;
    // The chooser fades out while the window starts growing (overlapping eases, so no pause between them).
    const chooserK = smooth(prog(t, T.create + 0.05, T.create + 0.35)) * (1 - easeInOut(prog(t, T.form - 0.15, T.form + 0.3)));
    const form = {
        from: typed(extras[0], t, T.from, T.from + 0.55), to: typed(`https://${main}`, t, T.to, T.toEnd),
        caret: (t >= LD.word(25, 'from') - 0.2 && t < T.from + 0.7 ? 'from' : t >= T.to - 0.3 && t < T.toEnd + 0.4 ? 'to' : null) as 'from' | 'to' | null,
        type301: hold(t, T.type - 0.1, LD.at(26)), keepPath: hold(t, T.keep - 0.1, LD.at(27)),
        hops: clamp(prog(t, T.toEnd + 0.2, T.toEnd + 0.5)) + clamp(prog(t, T.deep, T.deep + 0.3)) + clamp(prog(t, T.home - 0.2, T.home + 0.1)),
        hopRing: hold(t, LD.word(26, 'pricing') - 0.1, LD.at(27)),
        wwwRing: hold(t, T.root - 0.15, T.save),
        warn: easeOut(prog(t, T.from + 0.9, T.from + 1.3)),
        save: prog(t, T.save, T.save + 0.3),
    };
    const stepFill = 1 + easeInOut(prog(t, LD.at(23) + 0.4, LD.at(23) + 1.0));
    const winIn = LD.word(23, "here's") - 0.25;
    const lead = slideIn(t, 0.15, 0.5, 0, 18);
    const leadOut = 1 - easeOut(prog(t, winIn - 0.1, winIn + 0.25));
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.char} dash={C.teal}>STEP TWO · REDIRECT EVERY OTHER DOMAIN</Eyebrow>
            <h2 style={{ position: 'absolute', left: 120, top: 420, margin: 0, fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.04, color: C.char, ...lead, opacity: Number(lead.opacity) * leadOut }}>Redirect every<br /><span style={{ color: C.teal }}>other domain.</span></h2>
            <Progress fill={stepFill} />
            {/* The window grows from the list to the full-page form. Width/height would re-layout and snap to whole
                pixels every frame, so the frame is a scaled panel and the content a clip, both sub-pixel smooth. */}
            <div data-ui="dashboard" style={{ position: 'absolute', left: 120, top: 170, width: WIN.w, height: WIN.h, ...slideIn(t, winIn, 0.55, 0, 40) }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: WIN.w, height: WIN.h, borderRadius: 24, background: mixHex('#F2F4F7', '#F9FAFB', toForm), boxShadow: '0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)', transform: `scale(${win.w / WIN.w}, ${win.h / WIN.h})`, transformOrigin: 'top left', willChange: 'transform' }} />
                <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${WIN.w - win.w}px ${WIN.h - win.h}px 0 round 24px)` }}>
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${LIST.s})`, transformOrigin: 'top left', opacity: 1 - toForm }}>
                    <Shell w={LIST.w} h={LIST.h} active="links" counts={{ links: nRows, hostnames: nRows }} crumb="Links" pulse={bump(t, T.links - 0.1, 0.8)}
                        right={<CreateButton press={bump(t, T.create - 0.05, 0.25)} ring={Math.max(bump(t, T.create - 0.25, 0.7), bump(t, T.csvCreate - 0.1, 0.8))} />}>
                        <LinksBody main={main} rows={extras.map((d, i) => ({ domain: d, k: rowsK[i] }))} />
                    </Shell>
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${FORM.s})`, transformOrigin: 'top left', opacity: toForm }}>
                    <RedirectForm s={form} main={main} from={extras[0]} deepPath={deepPath} />
                </div>
                {chooser && <AbsoluteFill style={{ background: `rgba(16,24,40,${0.35 * chooserK})` }} />}
                </div>
            </div>
            {chooser && (
                <div style={{ position: 'absolute', left: 320, top: 300, ...fx(chooserK, 0, (1 - chooserK) * 16, 0.96 + 0.04 * chooserK) }}>
                    <CreateChooser pick={easeOut(prog(t, T.pick - 0.05, T.pick + 0.2))} />
                </div>
            )}
            <TipCard label="DOZENS OF DOMAINS?" title={tips.csv} sub={tips.csvPath} x={1380} y={560} w={420} size={40}
                style={{ padding: '36px 38px 40px', borderRadius: 24, ...slideIn(t, T.dozens, 0.5, 40, 0), boxShadow: `0 30px 80px rgba(16,24,40,0.22), 0 0 0 ${3 * bump(t, T.csvImport - 0.1, 0.9)}px ${C.teal}` }} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Step three: Connect DNS */
const LN = local('dns');
export function ConnectDnsScene({ extras, records, tips }: ForwardDomainsProps) {
    const t = useTime();
    const open = LN.word(33, 'connect') + 0.15;
    const dlg = easeOut(prog(t, open, open + 0.4));
    const rA = LN.word(34, 'a', 1) - 0.15, rT = LN.word(34, 'txt') - 0.15, rC = LN.word(34, 'cname') - 0.15, done = LN.at(35);
    const row = (a: number, b: number) => (t < a ? 0 : t < b ? easeOut(prog(t, a, a + 0.25)) : lerp(0.3, 1, 1 - easeOut(prog(t, b, b + 0.3)))) * (1 - easeOut(prog(t, done, done + 0.3)));
    const copyA = LN.word(35, 'copy') - 0.1;
    const note = slideIn(t, copyA, 0.45, 40, 0);
    const noteOut = outK(t, LN.at(37) - 0.4, 0.3);
    const edge = records.find((r) => r.type === 'CNAME')?.value ?? '';
    const oldIp = records.find((r) => r.type === 'A')?.from ?? '';
    const rowHi = bump(t, LN.word(33, 'click') - 0.1, 0.9);
    return (
        <SceneFade t={t} room="light" color={C.char}>
            <RoomBg room="light" t={t} />
            <Eyebrow k={easeOut(prog(t, 0.2, 0.6))} color={C.char} dash={C.teal}>STEP THREE · CONNECT EACH DOMAIN</Eyebrow>
            <Progress fill={2 + easeInOut(prog(t, LN.at(31) + 0.4, LN.at(31) + 1.0))} />
            <div data-ui="dashboard-behind" style={{ position: 'absolute', left: 120, top: 170, width: 1230, height: 770, borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)', ...slideIn(t, 0.1, 0.5, 0, 30) }}>
                <div style={{ transform: 'scale(1.2)', transformOrigin: 'top left' }}>
                    <Shell w={1025} h={642} active="hostnames" counts={{ links: extras.length, hostnames: extras.length }} crumb="Hostnames" pulse={bump(t, LN.word(33, 'hostnames') - 0.1, 0.8)}>
                        <div style={{ position: 'relative' }}>
                            <HostnamesBody domains={extras} warn={extras.map((_, i) => easeOut(prog(t, LN.word(32, 'point') + i * 0.15, LN.word(32, 'point') + i * 0.15 + 0.3)))} />
                            <div style={{ position: 'absolute', left: 24, right: 24, top: 22, height: 50, borderRadius: '12px 12px 0 0', boxShadow: `inset 0 0 0 ${2 * rowHi}px #1C6DB6`, background: `rgba(28,109,182,${0.06 * rowHi})` }} />
                        </div>
                    </Shell>
                </div>
                <AbsoluteFill style={{ background: `rgba(16,24,40,${0.4 * dlg})` }} />
            </div>
            <div data-ui="modal" style={{ position: 'absolute', left: 330, top: 178, transformOrigin: 'top left', ...fx(dlg, 0, (1 - dlg) * 24, 0.9 * (0.97 + 0.03 * dlg)) }}>
                <ConnectDialog domain={extras[0]} oldIp={oldIp} edge={edge} records={records}
                    s={{ rows: [row(rA, rT), row(rT, rC), row(rC, done)], values: hold(t, copyA, LN.at(36)), auto: hold(t, LN.word(36, 'automatic') - 0.1, LN.at(37)), mx: hold(t, LN.word(37, 'leave') - 0.1, 99) }} />
            </div>
            <TipCard label="COPY YOURS" title="Use the values in your own dashboard." x={1410} y={300} w={390} size={36} style={{ ...note, opacity: Number(note.opacity) * noteOut }} />
            <TipCard label="QUICK TIP" title={tips.mx} sub={tips.mxSub} x={1410} y={470} w={390} size={42} style={{ padding: '40px 40px 44px 50px', ...slideIn(t, LN.word(37, 'quick') - 0.1, 0.5, 40, 0) }} />
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- HTTPS issued */
const LH = local('https');
const STATUS: readonly [string, string][] = [
    ['Approved at Cloudflare', 'The records were added.'],
    ['DNS points to RedirHub', 'Public DNS usually updates within a few minutes.'],
    ['HTTPS certificate', 'Issued automatically once DNS is in place.'],
];
export function HttpsIssuedScene({ extras }: ForwardDomainsProps) {
    const t = useTime();
    const ticks = [LH.word(38, 'in') - 0.1, LH.word(38, 'checks') - 0.1, LH.word(38, 'automatically') - 0.1];
    const flood = easeInOut(prog(t, ticks[2] + 0.15, ticks[2] + 0.85));
    const lock = easeOut(prog(t, ticks[2] + 0.35, ticks[2] + 0.95));
    const every = LH.word(38, 'every') - 0.1;
    // "on every domain": the padlock's address steps through the four domains, one per 0.45 s.
    const idx = t < every ? 0 : Math.min(3, Math.floor((t - every) / 0.45));
    const connected = t >= ticks[2] + 0.2;
    return (
        <SceneFade t={t} room="light">
            <RoomBg room="light" t={t} />
            <AbsoluteFill style={{ opacity: flood }}><RoomBg room="sweep" t={t} /></AbsoluteFill>
            <Eyebrow k={1 - flood} color={C.char} dash={C.teal}>STEP THREE · CONNECT EACH DOMAIN</Eyebrow>
            <Eyebrow k={flood} color={C.ink} dash={C.ink}>STEP THREE · CONNECT EACH DOMAIN</Eyebrow>
            <Progress fill={3} on={mixHex(C.teal, '#FFFFFF', flood)} />
            <div data-ui="modal" style={{ position: 'absolute', left: 120, top: 290, width: 1010, boxSizing: 'border-box', borderRadius: 24, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 50px 120px rgba(16,24,40,0.30)', fontFamily: UI, color: C.char, ...popIn(t, 0.1, 0.5) }}>
                <div style={{ padding: '30px 34px 26px', display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ width: 56, height: 56, flex: 'none', borderRadius: 12, background: '#E8F0F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C6DB6" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 500 }}>{extras[0]}</span>
                            {/* The status chip appears only once it is true (the product's in-progress wording isn't captured). */}
                            {connected && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px', borderRadius: 8, background: '#ECFDF3', fontSize: 15, fontWeight: 600, color: '#067647', ...popIn(t, ticks[2] + 0.2, 0.35) }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: C.teal }} />Connected</span>}
                        </div>
                        <span style={{ fontSize: 18, color: C.g600 }}>Automatic with Cloudflare</span>
                    </div>
                </div>
                <div style={{ margin: '0 34px 30px', borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${C.g200}`, overflow: 'hidden' }}>
                    {STATUS.map(([a, b], i) => {
                        const k = prog(t, ticks[i], ticks[i] + 0.35);
                        return (
                            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 24px', borderTop: i ? `1px solid ${C.g200}` : undefined }}>
                                <span style={{ position: 'relative', width: 40, height: 40, flex: 'none' }}>
                                    <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true" style={{ position: 'absolute', opacity: 1 - clamp(k * 3) }}>
                                        <circle cx="32" cy="32" r="26" fill="none" stroke={C.g200} strokeWidth="6" />
                                        <circle cx="32" cy="32" r="26" fill="none" stroke="#1C6DB6" strokeWidth="6" strokeLinecap="round" strokeDasharray="40 200" transform={`rotate(${t * 360} 32 32)`} />
                                    </svg>
                                    <span style={{ position: 'absolute', inset: 0, ...fx(clamp(k * 3), 0, 0, 0.7 + 0.3 * easeOut(k)) }}><Tick size={40} draw={k} /></span>
                                </span>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 21, fontWeight: 600 }}>{a}</span><span style={{ fontSize: 17, color: C.g600 }}>{b}</span></div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ position: 'absolute', left: 1210, top: 270, width: 590, paddingTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
                <svg width="240" height="240" viewBox="0 0 100 100" aria-hidden="true" style={{ filter: 'drop-shadow(0 30px 40px rgba(16,24,40,0.25))', ...fx(clamp(lock * 2), 0, (1 - lock) * 40, 0.4 + 0.6 * lock) }}>
                    <path d={`M30 48 V${lerp(44, 36, easeOut(prog(t, ticks[2] + 0.8, ticks[2] + 1.1)))}a20 20 0 0 1 40 0v12`} fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
                    <rect x="18" y="46" width="64" height="46" rx="12" fill="#FFFFFF" /><circle cx="50" cy="66" r="6" fill={C.navy} /><rect x="47.5" y="66" width="5" height="12" rx="2.5" fill={C.navy} />
                </svg>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 76, padding: '0 30px', borderRadius: 38, background: 'rgba(255,255,255,0.16)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.16)', fontFamily: MONO, fontSize: 34, fontWeight: 500, whiteSpace: 'nowrap', color: C.ink, ...slideIn(t, ticks[2] + 0.6, 0.45, 0, 16) }}>
                    <Lock size={26} color="#FFFFFF" sw={2.6} />
                    <span style={{ position: 'relative', overflow: 'hidden', height: 44, display: 'inline-block' }}>
                        {/* Each new domain rolls up while the previous one rolls out, so the text never swaps in one frame. */}
                        <span style={{ display: 'block', lineHeight: '44px', visibility: 'hidden' }}>https://{extras[3]}</span>
                        {[idx - 1, idx].map((j) => {
                            if (j < 0) return null;
                            const q = idx > 0 ? smooth(prog(t, every + idx * 0.45, every + idx * 0.45 + 0.2)) : 1;
                            const cur = j === idx;
                            return <span key={j} style={{ position: 'absolute', left: 0, top: 0, lineHeight: '44px', whiteSpace: 'nowrap', ...fx(cur ? q : 1 - q, 0, cur ? (1 - q) * 30 : -q * 30) }}>https://{extras[j]}</span>;
                        })}
                    </span>
                </span>
                <span style={{ fontSize: 48, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.025em', lineHeight: 1.1, color: C.ink, ...slideIn(t, LH.word(38, 'padlock') - 0.15, 0.5, 0, 18) }}>The padlock,<br />on every domain.</span>
            </div>
        </SceneFade>
    );
}
