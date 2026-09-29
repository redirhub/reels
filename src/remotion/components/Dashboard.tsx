/* Building blocks of the RedirHub dashboard (dash.redirhub.com), recreated from
   product screenshots in redirhub/marketing public/assets/images/powerful-features.
   Scaled up ~2× so they read on a phone screen. */
import type { CSSProperties, ReactNode } from 'react';
import { color } from '../brand/tokens';
import { RedirHubIcon } from '../brand/Logo';

export function BrowserWindow({ address, style, children }: { address: string; style?: CSSProperties; children: ReactNode }) {
    return (
        <div style={{
            position: 'absolute', width: 1008, height: 1090, borderRadius: 40, background: '#fff', overflow: 'hidden',
            boxShadow: `0 40px 90px rgba(16,24,40,.16), 0 0 0 1px ${color.g200}`, ...style,
        }}>
            <div style={{ height: 88, background: color.g50, borderBottom: `1px solid ${color.g200}`, display: 'flex', alignItems: 'center', padding: '0 30px', gap: 12 }}>
                {['#F97066', '#FDB022', '#32D583'].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: '50%', background: c }} />)}
                <div style={{
                    marginLeft: 24, flex: 1, height: 54, borderRadius: 14, background: '#fff', border: `1px solid ${color.g200}`,
                    display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', fontSize: 24, color: color.g600,
                }}>
                    <div style={{ height: 30 }}><RedirHubIcon /></div>
                    {address}
                </div>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 88, bottom: 0 }}>{children}</div>
        </div>
    );
}

/** A view inside BrowserWindow; stack views and animate with `style`. */
export function View({ style, children }: { style?: CSSProperties; children: ReactNode }) {
    return <div style={{ position: 'absolute', inset: 0, padding: '36px 40px', ...style }}>{children}</div>;
}

export type PillTone = 'ok' | 'bad';
const tones: Record<PillTone, CSSProperties> = {
    ok: { background: color.okSoft, borderColor: color.okLine, color: color.okText },
    bad: { background: color.redSoft, borderColor: color.redLine, color: color.redText },
};

export function Pill({ tone, children, style }: { tone: PillTone; children: ReactNode; style?: CSSProperties }) {
    return (
        <div style={{
            flex: 'none', height: 58, padding: '0 22px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 25, fontWeight: 600, border: '2px solid', whiteSpace: 'nowrap', ...tones[tone], ...style,
        }}>
            <i style={{ width: 12, height: 12, borderRadius: '50%', background: 'currentColor' }} />
            {children}
        </div>
    );
}

export function Avatar({ icon, dot, size = 86 }: { icon: ReactNode; dot?: string; size?: number }) {
    return (
        <div style={{
            position: 'relative', flex: 'none', width: size, height: size, borderRadius: '50%', border: `2px solid ${color.g200}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
        }}>
            {icon}
            {dot && <div style={{ position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, borderRadius: '50%', border: '4px solid #fff', background: dot }} />}
        </div>
    );
}

/** One row of the links list: source, destination, status pill. */
export function LinkRow({ icon, source, destination, status, dot = '#12B76A', style }: {
    icon: ReactNode; source: string; destination: string; status: ReactNode; dot?: string; style?: CSSProperties;
}) {
    return (
        <div style={{
            position: 'relative', height: 152, borderRadius: 24, border: `2px solid ${color.g200}`, display: 'flex',
            alignItems: 'center', gap: 26, padding: '0 26px', marginBottom: 18, background: '#fff', ...style,
        }}>
            <Avatar icon={icon} dot={dot} />
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 35, fontWeight: 600, color: color.charcoal, letterSpacing: '-.01em' }}>{source}</div>
                <div style={{ fontSize: 26, color: color.g600, marginTop: 8, whiteSpace: 'nowrap' }}>↳ {destination}</div>
            </div>
            <div style={{ marginLeft: 'auto', position: 'relative' }}>{status}</div>
        </div>
    );
}

export function Chip({ active, children }: { active?: boolean; children: ReactNode }) {
    return (
        <div style={{
            height: 64, padding: '0 28px', borderRadius: 40, border: `2px solid ${active ? '#9CC3E6' : color.g300}`,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 27, fontWeight: 600,
            color: active ? color.blue : color.g700, background: active ? color.blueBg : '#fff',
        }}>{children}</div>
    );
}

export function Field({ children, style }: { children: ReactNode; style?: CSSProperties }) {
    return (
        <div style={{
            flex: 1, height: 94, borderRadius: 20, border: `2px solid ${color.g300}`, display: 'flex', alignItems: 'center',
            padding: '0 26px', fontSize: 32, fontWeight: 600, color: color.g700, whiteSpace: 'nowrap', overflow: 'hidden', ...style,
        }}>{children}</div>
    );
}

export function IconButton({ children, active }: { children: ReactNode; active?: boolean }) {
    return (
        <div style={{
            width: 74, height: 74, borderRadius: 18, border: `2px solid ${active ? color.g200 : color.g300}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? color.g200 : '#fff',
        }}>{children}</div>
    );
}

/** Bottom-of-window notification. */
export function Toast({ icon, title, body, background, iconBg, style }: {
    icon: ReactNode; title: string; body: string; background: string; iconBg: string; style?: CSSProperties;
}) {
    return (
        <div style={{
            position: 'absolute', left: 40, right: 40, bottom: 36, borderRadius: 26, padding: '28px 32px', display: 'flex',
            gap: 24, alignItems: 'center', color: '#fff', background, boxShadow: '0 24px 60px rgba(16,24,40,.35)', ...style,
        }}>
            <div style={{ flex: 'none', width: 76, height: 76, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 25, opacity: 0.85, marginTop: 6 }}>{body}</div>
            </div>
        </div>
    );
}

/** "STEP 1 · SPOT IT" chip + large heading above the product window. */
export function StepHeading({ step, title, tone = 'blue', style }: { step: string; title: ReactNode; tone?: 'blue' | 'teal'; style?: CSSProperties }) {
    return (
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, ...style }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', height: 62, padding: '0 26px', borderRadius: 40, fontSize: 26,
                fontWeight: 800, letterSpacing: '.08em',
                background: tone === 'teal' ? '#E6F6F4' : color.blueBg, color: tone === 'teal' ? '#138373' : color.blue,
            }}>{step}</div>
            <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.04, marginTop: 22, color: color.charcoal }}>{title}</div>
        </div>
    );
}
