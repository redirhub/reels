/* Shared layout of the four product chapters: copy on the left, the dashboard on
   the right, chapter index bottom-left. Each chapter slides in over the previous one. */
import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { color } from '../../brand/tokens';
import { BrowserWindow, Sidebar, SIDEBAR_WIDTH, View, type NavKey } from '../../components/Dashboard';
import { easeInOut, easeOut, fx, prog, rise } from '../../lib/anim';

/** Browser window position in composition pixels. Cursor keyframes depend on it. */
export const WIN = { left: 770, top: 140, width: 1070, height: 800 } as const;
/** Top-left of the page content inside the window (after chrome, sidebar and View padding). */
export const CONTENT = { x: WIN.left + SIDEBAR_WIDTH + 40, y: WIN.top + 88 + 36 } as const;

export const CHAPTERS = ['Domain redirects', 'Website migrations', 'Branded links & QR', 'Monitoring'] as const;

export function Chapter({ t, index, title, body, note, address, nav, children, overlay }: {
    t: number; index: number; title: ReactNode; body: ReactNode; note?: string;
    address: string; nav: NavKey; children: ReactNode;
    /** Drawn over the whole frame in composition pixels (the cursor). */
    overlay?: ReactNode;
}) {
    const slide = easeInOut(prog(t, 0, 0.55));
    const winIn = easeOut(prog(t, 0.35, 0.9));
    return (
        <AbsoluteFill style={{
            transform: `translateX(${(1 - slide) * 1920}px)`,
            boxShadow: '-40px 0 80px rgba(16,24,40,.25)',
            background: `radial-gradient(900px 600px at 100% 0%, rgba(28,109,182,.12), transparent 70%),
                radial-gradient(800px 600px at 0% 100%, rgba(32,167,149,.12), transparent 70%), ${color.g100}`,
        }}>
            <div style={{ position: 'absolute', left: 96, top: 190, width: 630 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', height: 50, padding: '0 22px', borderRadius: 30, fontSize: 21,
                    fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', background: color.blueBg, color: color.blue,
                    ...rise(t, 0.35, 0.4, 20),
                }}>{`0${index + 1} · ${CHAPTERS[index]}`}</div>
                <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.05, marginTop: 26, color: color.charcoal, ...rise(t, 0.5, 0.45, 30) }}>{title}</div>
                <div style={{ fontSize: 30, lineHeight: 1.45, marginTop: 28, color: color.g600, ...rise(t, 0.75, 0.45, 24) }}>{body}</div>
                {note && <div style={{ fontSize: 21, marginTop: 22, color: color.g500, ...rise(t, 0.95, 0.45, 20) }}>{note}</div>}
            </div>

            <div style={{ position: 'absolute', left: 96, top: 880, display: 'flex', gap: 10, ...rise(t, 0.6, 0.4, 16) }}>
                {CHAPTERS.map((c, i) => (
                    <div key={c} style={{
                        height: 8, width: i === index ? 64 : 28, borderRadius: 4,
                        background: i < index ? color.teal : i === index ? color.blue : color.g300,
                    }} />
                ))}
            </div>

            <BrowserWindow address={address} style={{ ...WIN, ...fx(winIn, 0, (1 - winIn) * 80) }}>
                <Sidebar active={nav} />
                <View style={{ left: SIDEBAR_WIDTH }}>{children}</View>
            </BrowserWindow>
            {overlay}
        </AbsoluteFill>
    );
}

/** Blinking caret for typed fields. */
export function Caret({ on }: { on: boolean }) {
    return <span style={{ display: 'inline-block', width: 3, height: 38, background: color.blue, marginLeft: 2, verticalAlign: 'middle', visibility: on ? 'visible' : 'hidden' }} />;
}

/** Text typed across [a, b]: returns the visible prefix. */
export function typed(text: string, t: number, a: number, b: number) {
    return text.slice(0, Math.round(prog(t, a, b) * text.length));
}

/** Primary button with a press dip at `pressAt`. */
export function Button({ t, pressAt, done, children, doneLabel, width = 200 }: {
    t: number; pressAt: number; done: boolean; children: ReactNode; doneLabel?: ReactNode; width?: number;
}) {
    const press = Math.max(0, 1 - Math.abs(t - pressAt) / 0.12);
    return (
        <div style={{
            flex: 'none', width, height: 84, borderRadius: 18, color: '#fff', fontSize: 28, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: done ? color.teal : color.blue, transform: `scale(${1 - press * 0.06})`,
        }}>{done && doneLabel ? doneLabel : children}</div>
    );
}
