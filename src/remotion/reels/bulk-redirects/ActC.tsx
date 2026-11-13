/* Act C · The visitor nobody sees (beats 9–12), the twist. Quiet: one room (Evening), no whoosh, one low tone, then
   silence. Motion notes: keyframes.md (w46-TwoResults, w46-Warning, w46-Silence). */
import type { CSSProperties } from 'react';
import { AbsoluteFill } from 'remotion';
import { prog, useTime } from '../../lib/anim';
import { X } from './frames.gen';
import { FrameScene, Layers } from './scene';
import { SMOOTH, ease, outK, slideIn, smooth } from './kit';
import { local, warningPageAt } from './timeline';

/** Beats 9–10. A customer types the retired product's domain (right). On "It forwards to Northway's site" Northway's
    own check comes in on the left, the plain address and the homepage ("it worked"), while the customer's side
    waits, dimmed. Focus rack on "But the customer's browser": the customer's side comes back, and on "secure version
    first" the address becomes https:// and the page waits on an empty padlock. The fairness line lands on "Some
    registrars". */
export function TwoScene() {
    const t = useTime(); const L = local('two');
    const typeA = L.word(9, 'types'), typeB = L.word(9, 'domain') + 0.2;
    const typed = ease(t, typeA, typeB - typeA);
    const check = L.word(9, 'forwards') - 0.25;
    const rack = ease(t, L.word(10, 'but') - 0.1, 0.6);
    const secure = ease(t, L.word(10, 'secure') - 0.15, 0.55);
    // the customer's side: full while typing, dimmed while Northway's check is shown, back on the rack
    const focus = 1 - 0.55 * ease(t, check, 0.5) * (1 - rack);
    const caret = 0.5 + 0.5 * Math.cos(t * Math.PI * 1.6);
    const right: CSSProperties = { opacity: smooth(prog(t, 0.0, 0.45)) * focus };
    return (
        <FrameScene k="TwoResults" hide={[3]} moves={{
            0: slideIn(t, check, 0.5, -20, 0),
            1: slideIn(t, check + 0.1, 0.6, -40, 0),
            2: { ...slideIn(t, L.word(10, 'asks') - 0.2, 0.5, 20, 0) },
            4: slideIn(t, L.word(10, 'some') - 0.2, 0.55, 0, 18),
        }} vars={{ '--clipx-kip': `${((1 - typed) * 100).toFixed(2)}%`, '--o-caret': caret * (1 - secure) }}
            extra={<>
                {/* the plain address stays opaque underneath while the https:// state fades in over it: two half-transparent
                    browsers crossfading dipped the window grey (flash_check, 65.2 s) */}
                <AbsoluteFill style={right}>{X.TwoPlain()}</AbsoluteFill>
                <AbsoluteFill style={{ opacity: secure * focus }}><Layers k="TwoResults" hide={[0, 1, 2, 4]} /></AbsoluteFill>
            </>} />
    );
}

/** Beats 11–12. The warning page lands on "So the customer sees a warning page" (the low tone, BulkRedirects.tsx) and
    holds through "it looks like Northway is broken". On "They leave" the page leaves the room: the retired product's
    domain alone, two faint rings fading before they reach it (a knock nobody hears), and on "Northway never finds
    out" the line, then silence. */
export function WarningScene() {
    const t = useTime(); const L = local('warning');
    const leave = L.word(11, 'leave') - 0.25;
    const away = outK(t, leave, 0.6);
    // the domain arrives once the page is nearly gone (it landed on the page's text, v4 75.9 s)
    const silence = smooth(prog(t, leave + 0.5, leave + 1.2));
    const ring = (i: number): CSSProperties => {
        const a = leave + 0.6 + i * 0.6, k = prog(t, a, a + 2.6);
        return { opacity: Math.sin(Math.PI * k) * silence, transform: SMOOTH(0, 0, 1.22 - 0.22 * ease(t, a, 2.6)), transformOrigin: '960px 470px' };
    };
    // lands on "the customer sees" (with the low tone): waiting for "warning" left the room empty for 1 s
    const page = slideIn(t, warningPageAt() - L.start - 0.05, 0.5, 0, 14);
    return (
        <FrameScene k="Warning" moves={{ 0: { ...page, opacity: (page.opacity as number) * away } }} extra={
            <AbsoluteFill style={{ opacity: silence }}>
                <Layers k="Silence" moves={{ 0: ring(0), 1: ring(1), 3: slideIn(t, L.word(12, 'never') - 0.2, 0.7, 0, 16) }} />
            </AbsoluteFill>
        } />
    );
}
