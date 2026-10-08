/* On-screen copy with the channel's hold rule built in (rule.md §4): every line holds at
   least 1 s; longer lines hold (words ÷ 3) + 1 s. The check runs at render time, like the
   <Sfx> budget, so a retimed scene can't quietly break the rule. */
import type { CSSProperties, ReactNode } from 'react';
import { font, yt } from '../brand/tokens';
import { easeOut, fx, prog } from '../lib/anim';

export function minHold(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, words / 3 + 1);
}

export function OnScreenText({ t, from, until, children, text, size = 56, weight = 700, color = yt.ink, align = 'left', mono = false, style }: {
    t: number;
    /** When the line appears and disappears, in the scene's seconds. */
    from: number; until: number;
    /** The copy, for the hold check (defaults to `children` when it's a string). */
    text?: string;
    children: ReactNode;
    size?: number; weight?: number; color?: string; align?: 'left' | 'center' | 'right'; mono?: boolean;
    style?: CSSProperties;
}) {
    const copy = text ?? (typeof children === 'string' ? children : '');
    if (copy && until - from < minHold(copy) - 1e-6) {
        throw new Error(`"${copy}" holds ${(until - from).toFixed(2)}s; the rule is at least ${minHold(copy).toFixed(2)}s (1s, or words/3+1).`);
    }
    const k = easeOut(prog(t, from, from + 0.4));
    const out = easeOut(prog(t, until - 0.25, until));
    return (
        <div style={{
            fontFamily: mono ? font.mono : font.display, fontSize: size, fontWeight: weight, color, textAlign: align,
            letterSpacing: mono ? 0 : '-.025em', lineHeight: 1.12, ...fx(k * (1 - out), 0, (1 - k) * 22 - out * 10), ...style,
        }}>{children}</div>
    );
}
