import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { font } from '../../brand/tokens';
import { easeOut, prog, useTime } from '../../lib/anim';
import serverFile from './server.webp';
import lampFile from './lamp.webp';

export const ink = '#101b1c';
export const paper = '#f0f0e9';
export const mint = '#94f6d8';
export const orange = '#ffaf65';
export const mono: CSSProperties = { fontFamily: font.mono, fontSize: 24, letterSpacing: 1 };
export const at = (left: number, top: number): CSSProperties => ({ position: 'absolute', left, top });
export const headline: CSSProperties = { fontSize: 106, lineHeight: 1.02, fontWeight: 750, letterSpacing: -6 };
export const reveal = (t: number, delay = 0) => {
    const k = easeOut(prog(t, delay, delay + 0.42));
    return { opacity: k, transform: 'translateY(' + (1 - k) * 28 + 'px)' };
};
export function Stage({ children, light = false, name }: { children: ReactNode; light?: boolean; name: string }) {
    return (
        <AbsoluteFill
            style={{
                fontFamily: font.display,
                color: light ? ink : paper,
                overflow: 'hidden',
                background: light
                    ? 'radial-gradient(ellipse at 70% 45%, #fafaf3, #e7e8df)'
                    : 'radial-gradient(ellipse at 72% 75%, #1c3637, #0d1c1d 52%, #0a1416 90%)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: light ? 0.12 : 0.095,
                    backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.7px)',
                    backgroundSize: '28px 28px',
                }}
            />
            {children}
            <div style={{ ...at(80, 58), display: 'flex', alignItems: 'center', gap: 24 }}>
                <RedirHubLogo variant={light ? 'color' : 'white'} style={{ width: 192 }} />
                <div style={{ width: 1, height: 28, background: 'currentColor', opacity: 0.35 }} />
                <span style={{ fontSize: 26, fontWeight: 550 }}>Self-Hosted Edge</span>
            </div>
            <div style={{ position: 'absolute', right: 80, top: 63, ...mono, fontSize: 20 }}>{name}</div>
        </AbsoluteFill>
    );
}
function asset(file: string | { src: string }) {
    return typeof file === 'string' ? file : file.src;
}
export function Server({ x, y, w, tilt = 0 }: { x: number; y: number; w: number; tilt?: number }) {
    return (
        <Img
            src={asset(serverFile)}
            style={{
                ...at(x, y),
                width: w,
                transform: 'rotate(' + tilt + 'deg)',
                filter: 'drop-shadow(0 20px 18px rgba(1,12,13,.28))',
            }}
        />
    );
}
export function Shop({ x, y, w, host }: { x: number; y: number; w: number; host: string }) {
    const t = useTime();
    return (
        <div
            style={{
                ...at(x, y),
                width: 850,
                transformOrigin: 'top left',
                transform: 'scale(' + w / 850 + ')',
                overflow: 'hidden',
                borderRadius: 22,
                boxShadow: '0 28px 70px #00171735',
                background: '#f5ede3',
                color: '#252522',
            }}
        >
            <div
                style={{
                    background: '#fafaf6',
                    height: 65,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 28px',
                    gap: 22,
                    borderBottom: '1px solid #d5d3c8',
                }}
            >
                <div style={{ fontSize: 22, letterSpacing: 4, color: '#a6aaa5' }}>•••</div>
                <div
                    style={{ ...mono, background: '#eaece7', padding: '6px 20px', borderRadius: 9, fontSize: 19 }}
                >
                    https://{host}
                </div>
            </div>
            <div
                style={{
                    position: 'relative',
                    height: 450,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg,#eee8d9,#dfcfba)',
                }}
            >
                <div style={{ ...at(40, 32), fontSize: 35, fontFamily: 'Georgia, serif' }}>Forma Studio</div>
                <div
                    style={{
                        ...at(42, 175),
                        fontSize: 68,
                        lineHeight: 1,
                        fontFamily: 'Georgia, serif',
                        letterSpacing: -3,
                    }}
                >
                    Arc Table
                    <br />
                    Light
                </div>
                <div style={{ ...at(44, 364), fontSize: 20, borderBottom: '2px solid', paddingBottom: 4 }}>
                    View collection ↗
                </div>
                <Img
                    src={asset(lampFile)}
                    style={{
                        ...at(353, -15),
                        width: 510,
                        transform: 'rotate(' + Math.sin(t * 0.55) * 1.8 + 'deg)',
                        filter: 'drop-shadow(8px 20px 14px #4c352833)',
                    }}
                />
            </div>
        </div>
    );
}
export function Path({
    d,
    t,
    delay = 0,
    accent = mint,
    dashed = false,
}: {
    d: string;
    t: number;
    delay?: number;
    accent?: string;
    dashed?: boolean;
}) {
    const p = prog(t, delay, delay + 1.05);
    return (
        <>
            <path
                d={d}
                fill="none"
                stroke={accent}
                opacity=".26"
                strokeWidth="3"
                strokeDasharray={dashed ? '7 10' : undefined}
            />
            <path
                d={d}
                fill="none"
                stroke={accent}
                opacity={p * 0.85}
                strokeWidth="4"
                pathLength="1"
                strokeDasharray={dashed ? '.015 .013' : '1'}
                strokeDashoffset={dashed ? -t * 0.08 : 1 - p}
            />
            {p > 0.02 && (
                <path
                    d={d}
                    fill="none"
                    stroke={accent}
                    strokeWidth="11"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray=".011 .989"
                    strokeDashoffset={-((Math.max(0, t - delay) * 0.45) % 1)}
                />
            )}
        </>
    );
}
export const Plot = ({ children }: { children: ReactNode }) => (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={at(0, 0)}>
        {children}
    </svg>
);
export function Tag({
    x,
    y,
    children,
    bright = false,
}: {
    x: number;
    y: number;
    children: ReactNode;
    bright?: boolean;
}) {
    return (
        <div
            style={{
                ...at(x, y),
                ...mono,
                borderRadius: 30,
                padding: '8px 20px',
                background: bright ? mint : ink,
                color: bright ? ink : paper,
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </div>
    );
}
