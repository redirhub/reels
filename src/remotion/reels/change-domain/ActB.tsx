/* Act B · The name problem: w44-Smoothie (beats 9–12), w44-Rename (13), w44-Worry (14–17), w44-Title (18). */
import { clamp, easeInOut, easeOut, prog, useTime } from '../../lib/anim';
import { At, Browser, C, Eyebrow, Headline, MONO, Pill, Roll, SHOP, SceneFade, Scaled, Tag, fx, mix, popIn, slideIn, smooth } from './kit';
import { Bubble, Home, Logo, Mark, Sign, Straw, StrawberryCard } from './shop';
import type { CSSProperties } from 'react';
import { NAMES } from './props';
import { local } from './timeline';

/* ---------------------------------------------------------------- Smoothie */
const L1 = local('smoothie');
export function SmoothieScene() {
    const t = useTime();
    // The sign hangs: it drops a little from above and settles (no swing: nothing tilts).
    const hang = easeOut(prog(t, 0.1, 0.8));
    const strawA = L1.word(12, 'fair') - 0.25;
    const drop = prog(t, strawA, strawA + 0.55);
    // Falls in, then a small settle bounce: a function of time, not a spring state.
    const dropY = drop < 0.7 ? -260 * (1 - easeIn(drop / 0.7)) : 14 * Math.sin(((drop - 0.7) / 0.3) * Math.PI) * (1 - (drop - 0.7) / 0.3);
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.2} dark>THE NAME PROBLEM</Eyebrow>
            <At x={120} y={220} style={fx(smooth(hang * 1.4), 0, (1 - hang) * -40)}><Sign brand="fusion" w={760} h={400}><Logo width={540} id="smoothie-sign" /></Sign></At>
            <At x={380} y={620} style={popIn(t, 0.35, 0.5)}>
                <div style={{ position: 'relative', width: 210, height: 294 }}>
                    <div style={{ position: 'absolute', left: Math.round(210 * 0.56), top: 0, opacity: smooth(drop * 3), transform: `translate3d(0, ${dropY}px, 0) rotate(0.02deg)`, willChange: 'transform' }}><Straw size={210} /></div>
                    <div style={{ position: 'absolute', left: 0, top: Math.round(210 * 0.38) }}><Mark size={210} id="smoothie-gag" /></div>
                </div>
            </At>
            <At x={1000} y={260} style={popIn(t, L1.word(10, 'smoothie') - 0.15, 0.45)}><Bubble text="Is this a smoothie bar?" who="AK" /></At>
            <At x={1080} y={420} style={popIn(t, L1.word(11, 'green') - 0.15, 0.45)}><Bubble text="One green detox, please." who="JM" /></At>
            <div style={{ position: 'absolute', left: 1000, top: 650, width: 800, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: C.char }}>
                <span style={{ display: 'inline-block', ...slideIn(t, L1.word(12, 'fair') - 0.05, 0.4, 0, 14) }}>Fair.</span>{' '}
                <span style={{ display: 'inline-block', ...slideIn(t, L1.word(12, 'fusion') - 0.05, 0.45, 0, 14) }}>“Fusion” does sound a little…</span>{' '}
                <span style={{ display: 'inline-block', ...slideIn(t, L1.word(12, 'blended') - 0.08, 0.4, 0, 14) }}>blended.</span>
            </div>
        </SceneFade>
    );
}
const easeIn = (x: number) => x * x * x;

/* ---------------------------------------------------------------- Rename */
const L2 = local('rename');
export function RenameScene() {
    const t = useTime();
    // The morph runs on "Frosty Bites"; the awning's stripes blend sky → pink with it.
    const mA = L2.word(13, 'frosty') - 0.1;
    const morph = clamp(prog(t, mA, mA + 1.3));
    // The sign arrives centred, then makes room for BEFORE on "Short, sweet".
    const sA = L2.word(13, 'short') - 0.2;
    const shift = easeInOut(prog(t, sA, sA + 0.7));
    const pillK = easeInOut(prog(t, L2.word(13, 'get') - 0.1, L2.word(13, 'get') + 0.5));
    const stripe = mix(SHOP.sky, SHOP.pink, smooth(prog(morph, 0.2, 0.7)));
    // The sign slides by transform (a moving `left` would snap to whole pixels).
    const dx = (370 - 620) * (1 - shift);
    const withShift = (st: CSSProperties): CSSProperties => ({ ...st, transform: `translate3d(${dx}px, 0, 0) ${st.transform ?? ''}` });
    return (
        <SceneFade t={t} room="light">
            <Eyebrow t={t} a={0.2} dark>A NEW NAME</Eyebrow>
            <div style={{ position: 'absolute', left: 120, top: 380, width: 400, display: 'flex', flexDirection: 'column', gap: 22, ...slideIn(t, sA + 0.2, 0.6, -40, 0) }}>
                <Tag>BEFORE</Tag>
                <div style={{ opacity: 0.5 }}><Logo width={400} id="rename-before" /></div>
                <span style={{ fontFamily: MONO, fontSize: 22, color: C.g500, textDecoration: 'line-through' }}>{NAMES.old}</span>
            </div>
            <At x={620} y={230} style={slideIn(t, sA + 0.35, 0.5, 0, 10)}><Tag color={C.char}>NOW</Tag></At>
            <At x={620} y={282} style={withShift(popIn(t, 0.15, 0.55, 0.94))}>
                <div style={{ position: 'relative', width: 1180, height: 480, borderRadius: 30, background: '#FFFFFF', overflow: 'hidden', boxShadow: '0 30px 70px rgba(16,24,40,0.14), 0 0 0 1px rgba(16,24,40,0.06)' }}>
                    <div style={{ height: 64, background: `repeating-linear-gradient(90deg, ${stripe} 0 60px, #FFFFFF 60px 120px)` }} />
                    <div style={{ height: 416, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Logo width={760} k={morph} id="rename-sign" /></div>
                </div>
            </At>
            <div style={{ position: 'absolute', left: 620, width: 1180, top: 800, display: 'flex', justifyContent: 'center', ...withShift(popIn(t, 0.4, 0.5)) }}>
                <Pill size={36}><Roll from={NAMES.old} to={NAMES.new} k={pillK} h={46} /></Pill>
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Worry */
const L3 = local('worry');
const SOCKETS = ['links', 'reviews', 'history'] as const;
export function WorryScene() {
    const t = useTime();
    const cardA = 0.25;
    const q = popIn(t, L3.word(15, 'spot') - 0.1, 0.45, 0.4);
    const siteA = L3.word(16, 'change') + 0.1;
    const stranger = L3.word(16, 'total') - 0.15;
    const rightA = L3.word(17, 'right') - 0.1;
    return (
        <SceneFade t={t} room="glow">
            <Eyebrow t={t} a={0.2}>THE WORRY</Eyebrow>
            <Headline size={72} style={slideIn(t, L3.word(15, 'what') - 0.1, 0.5, 0, 18)}>What happens to the top spot?</Headline>
            <At x={200} y={440} style={slideIn(t, cardA, 0.6, -60, 0)}>
                <div style={{ position: 'relative' }}>
                    <StrawberryCard w={1040} s={0.8} rank="1" />
                    <span style={{ position: 'absolute', right: -36, top: -40, width: 92, height: 92, borderRadius: '50%', background: '#FFFFFF', color: C.char, boxShadow: '0 20px 50px rgba(0,0,0,0.35)', fontSize: 60, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', ...q }}>?</span>
                </div>
            </At>
            <At x={1180} y={340} style={slideIn(t, siteA, 0.6, 50, 0)}>
                <Browser url={`https://${NAMES.new}`} w={590} h={338} bar={50} size={16}><Scaled s={0.5} w={1180} h={576}><Home brand="bites" id="worry-home" /></Scaled></Browser>
            </At>
            <div style={{ position: 'absolute', left: 1180, top: 712, display: 'flex', gap: 12 }}>
                {SOCKETS.map((s, i) => {
                    const fix = easeInOut(prog(t, rightA + 0.35 + i * 0.3, rightA + 0.85 + i * 0.3));
                    return (
                        <span key={s} style={{ height: 52, padding: '0 22px', borderRadius: 26, boxShadow: `inset 0 0 0 2px ${mix('rgba(185,198,216,0.45)', C.teal, fix)}`, background: `rgba(32,167,149,${0.14 * fix})`, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 600, color: mix(C.soft, C.ink, fix), ...popIn(t, stranger + i * 0.12, 0.4) }}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', boxShadow: `inset 0 0 0 ${2 + 4 * fix}px ${mix(C.mute, C.teal, fix)}` }} />
                            <Roll from={`no ${s}`} to={s} k={fix} h={30} />
                        </span>
                    );
                })}
            </div>
            <div style={{ position: 'absolute', left: 1180, top: 796, width: 620, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink, ...slideIn(t, L3.word(16, 'stranger') - 0.1, 0.45, 0, 12) }}>
                <Roll from={<>Done wrong: a total <span style={{ color: C.red }}>stranger</span>.</>} to={<>Done right: <span style={{ color: C.teal }}>not from zero</span>.</>} k={prog(t, L3.word(17, 'zero') - 0.6, L3.word(17, 'zero') - 0.1)} h={46} />
            </div>
        </SceneFade>
    );
}

/* ---------------------------------------------------------------- Title */
const L4 = local('title');
export function TitleScene() {
    const t = useTime();
    const a = 0.15;
    return (
        <SceneFade t={t} room="sweep">
            <div style={{ position: 'absolute', left: '50%', top: 520, width: 1400, height: 520, transform: 'translateX(-50%)', background: 'radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ height: 60, padding: '0 26px', borderRadius: 30, background: 'rgba(255,255,255,0.14)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45)', fontFamily: MONO, fontSize: 26, display: 'inline-flex', alignItems: 'center', color: 'rgba(255,255,255,0.8)', ...slideIn(t, a, 0.5, -30, 0) }}>{NAMES.old}</span>
                    <span style={{ fontSize: 26, fontWeight: 700, color: 'rgba(255,255,255,0.85)', ...popIn(t, a + 0.3, 0.4) }}>becomes</span>
                    <span style={{ height: 60, padding: '0 26px', borderRadius: 30, background: '#FFFFFF', fontFamily: MONO, fontSize: 26, display: 'inline-flex', alignItems: 'center', color: C.char, ...slideIn(t, a + 0.5, 0.5, 30, 0) }}>{NAMES.new}</span>
                </div>
                <h1 style={{ margin: 0, fontSize: 100, lineHeight: 1.02, fontWeight: 800, letterSpacing: '-0.035em', ...slideIn(t, L4.word(18, 'how') - 0.15, 0.6, 0, 24) }}>How to change your domain<br />name without losing SEO.</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', height: 84, padding: '0 44px', borderRadius: 42, background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.18)', fontSize: 40, fontWeight: 700, ...popIn(t, L4.word(18, 'three') - 0.1, 0.45) }}>Three steps.</span>
            </div>
        </SceneFade>
    );
}
