import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { RedirHubLogo } from '../../brand/Logo';
import { color, font } from '../../brand/tokens';

export const at = (left: number, top: number): CSSProperties => ({ position: 'absolute', left, top });
export const surface: CSSProperties = {
    background: 'white',
    border: `2px solid ${color.g200}`,
    borderRadius: 28,
    boxShadow: '0 15px 44px -25px rgba(16,24,40,.22)',
    boxSizing: 'border-box',
};
export function Stage({ title, focus, children }: { title: string; focus: string; children: ReactNode }) {
    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(180deg,#F3F8FD 0%,#FFFFFF 70%)',
                color: color.charcoal,
                fontFamily: font.sans,
            }}
        >
            <div style={{ ...at(108, 67), display: 'flex', alignItems: 'center', gap: 34 }}>
                <RedirHubLogo style={{ width: 221 }} />
                <span style={{ borderLeft: `2px solid ${color.g300}`, paddingLeft: 32, fontSize: 30 }}>
                    Self-Hosted Edge
                </span>
            </div>
            <div
                style={{
                    ...at(100, 193),
                    width: 1720,
                    textAlign: 'center',
                    lineHeight: 1.08,
                    fontSize: 83,
                    letterSpacing: -3.5,
                    fontWeight: 800,
                }}
            >
                {title} <span style={{ color: color.blue }}>{focus}</span>
            </div>
            {children}
        </AbsoluteFill>
    );
}
export function Packet({ d, progress }: { d: string; progress: number }) {
    return (
        <>
            <path d={d} fill="none" stroke={color.blueLight} strokeWidth="7" />
            <path
                d={d}
                fill="none"
                stroke={color.blue}
                strokeWidth="7"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - progress}
            />
            {progress > 0 && progress < 1 && (
                <path
                    d={d}
                    fill="none"
                    stroke={color.blue}
                    strokeWidth="19"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray=".001 2"
                    strokeDashoffset={-progress}
                />
            )}
        </>
    );
}
export function Status({ children }: { children: ReactNode }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 15, color: color.g700 }}>
            <span style={{ background: color.teal, borderRadius: '50%', width: 18, height: 18 }} />
            {children}
        </span>
    );
}
