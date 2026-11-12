/* Act C · The founder who came (beats 8–10), the twist. Quiet: one room (Evening), no whoosh, one low tone, then
   silence. Motion notes: keyframes.md (w46-TwoResults, w46-Warning, w46-Silence). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, Layers } from './scene';
import { SMOOTH, ease, outK, slideIn, smooth } from './kit';
import { local } from './timeline';

/** Beats 8–9. The founder types kipzoo.com (right). On "Glomvo had forwarded it" Glomvo's own check comes in on the
    left, the plain address and the lander ("it worked"), while the founder's side waits, dimmed. Focus rack on "But
    the founder's browser": the founder's side comes back, and on "secure version first" the address becomes
    https:// and the page waits on an empty padlock. The fairness line lands on "Some registrars". */
export function TwoScene() {
    const t = useTime(); const L = local('two');
    const typeA = L.word(8, 'types'), typeB = L.word(8, 'com') + 0.15;
    const typed = ease(t, typeA, typeB - typeA);
    const glomvo = L.word(8, 'glomvo') - 0.25;
    const rack = ease(t, L.word(9, 'but') - 0.1, 0.6);
    const secure = ease(t, L.word(9, 'secure') - 0.15, 0.55);
    // the founder's side: full while typing, dimmed while Glomvo's check is shown, back on the rack
    const focus = 1 - 0.55 * ease(t, glomvo, 0.5) * (1 - rack);
    const caret = 0.5 + 0.5 * Math.cos(t * Math.PI * 1.6);
    const right: CSSProperties = { opacity: smooth(prog(t, 0.0, 0.45)) * focus };
    return (
        <FrameScene k="TwoResults" hide={[3]} moves={{
            0: slideIn(t, glomvo, 0.5, -20, 0),
            1: slideIn(t, glomvo + 0.1, 0.6, -40, 0),
            2: { ...slideIn(t, L.word(9, 'asks') - 0.2, 0.5, 20, 0) },
            4: slideIn(t, L.word(9, 'some') - 0.2, 0.55, 0, 18),
        }} vars={{ '--clipx-kip': `${((1 - typed) * 100).toFixed(2)}%`, '--o-caret': caret * (1 - secure) }}
            extra={<>
                {/* the plain address stays opaque underneath while the https:// state fades in over it: two half-transparent
                    browsers crossfading dipped the window grey (flash_check, 65.2 s) */}
                <AbsoluteFill style={right}>{X.TwoPlain()}</AbsoluteFill>
                <AbsoluteFill style={{ opacity: secure * focus }}><Layers k="TwoResults" hide={[0, 1, 2, 4]} /></AbsoluteFill>
            </>} />
    );
}

/** Beat 10, then the hold. The warning page is there on "So the founder sees a warning page" (the low tone,
    BulkRedirects.tsx); the notebook docks in on "and picks another name" and kipzoo.com is crossed out, the next name
    written. On "Glomvo never finds out" the page and the notebook leave the room: kipzoo.com alone, two faint rings
    fading before they reach it (a knock nobody hears), and silence. */
export function WarningScene() {
    const t = useTime(); const L = local('warning');
    const dock = slideIn(t, L.word(10, 'and') - 0.1, 0.6, 90, 0);
    const strike = ease(t, L.word(10, 'picks') + 0.1, 0.5);
    const leave = L.word(10, 'glomvo') - 0.4;
    const away = outK(t, leave, 0.6);
    // kipzoo.com arrives once the page and notebook are nearly gone (it landed on the warning's text, 75.9 s)
    const silence = smooth(prog(t, leave + 0.5, leave + 1.2));
    const ring = (i: number): CSSProperties => {
        const a = leave + 0.6 + i * 0.6, k = prog(t, a, a + 2.6);
        return { opacity: Math.sin(Math.PI * k) * silence, transform: SMOOTH(0, 0, 1.22 - 0.22 * ease(t, a, 2.6)), transformOrigin: '960px 470px' };
    };
    return (
        <FrameScene k="Warning" hide={[1]} moves={{
            0: { ...slideIn(t, 0.05, 0.45, 0, 14), opacity: (slideIn(t, 0.05, 0.45, 0, 14).opacity as number) * away },
        }} extra={<>
            {/* the named notebook stays opaque under the crossed-out one (layer 1, painted over it): no half-and-half dip */}
            <AbsoluteFill style={{ opacity: (dock.opacity as number) * away, transform: dock.transform }}>{X.WarnNamed()}</AbsoluteFill>
            <Layers k="Warning" hide={[0]} moves={{ 1: { opacity: (dock.opacity as number) * strike * away, transform: dock.transform } }} />
            <AbsoluteFill style={{ opacity: silence }}>
                <Layers k="Silence" moves={{ 0: ring(0), 1: ring(1), 3: slideIn(t, L.word(10, 'never') - 0.2, 0.7, 0, 16) }} />
            </AbsoluteFill>
        </>} />
    );
}
