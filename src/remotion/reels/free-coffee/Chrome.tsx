/* The browser: two tabs, a toolbar with Back / Forward / Reload and the address bar.
   Drawn at stage coordinates (WIN); the page goes in the content box (PAGE). */
import type { ReactNode } from 'react';
import { RedirHubIcon } from '../../brand/Logo';
import { color, font } from '../../brand/tokens';
import { BAR_H, PAGE, TAB_A, TAB_B, TABS_H, WIN } from './timeline';

export type TabInfo = { title: string; icon: ReactNode };

/** The fictional brand's favicon: a plain mark that can't be mistaken for a real company. */
export function BrandFavicon({ size = 30 }: { size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.3, background: color.charcoal, color: '#fff', flex: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.62, fontWeight: 800, fontFamily: font.sans,
        }}>b</div>
    );
}

export const RedirHubFavicon = () => <div style={{ height: 30, flex: 'none' }}><RedirHubIcon /></div>;

function Tab({ rect, tab, active }: { rect: { x: number; y: number; w: number; h: number }; tab: TabInfo; active: number }) {
    // `active` 0..1 so a switch can cross-fade the tab shapes.
    return (
        <div style={{
            position: 'absolute', left: rect.x - WIN.x, top: rect.y - WIN.y, width: rect.w, height: rect.h,
            borderRadius: '18px 18px 0 0', background: `rgba(255,255,255,${active})`,
            display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', boxSizing: 'border-box',
            fontSize: 24, fontWeight: 500, color: active > 0.5 ? color.g700 : color.g600, whiteSpace: 'nowrap', overflow: 'hidden',
        }}>
            {tab.icon}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.title}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginLeft: 'auto', flex: 'none', opacity: 0.55 }}>
                <path d="M6 6l12 12M18 6L6 18" stroke={color.g600} strokeWidth="2.4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

const navIcon = (d: string, dim = false) => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={dim ? color.g300 : color.g600} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export function Browser({ tabs, activeB, address, loading, children }: {
    tabs: readonly [TabInfo, TabInfo];
    /** 0 = tab A active, 1 = tab B active (fractional during the switch). */
    activeB: number;
    address: string;
    /** 0..1 page-load progress, or -1 when idle. */
    loading: number;
    children: ReactNode;
}) {
    return (
        <div style={{
            position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: WIN.r, overflow: 'hidden',
            background: '#DDE3EB', boxShadow: '0 60px 140px rgba(2,8,20,.6), 0 0 0 1px rgba(255,255,255,.08)', fontFamily: font.sans,
        }}>
            {/* Tab strip */}
            <div style={{ position: 'absolute', left: 30, top: 34, display: 'flex', gap: 12 }}>
                {['#F97066', '#FDB022', '#32D583'].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
            </div>
            <Tab rect={TAB_A} tab={tabs[0]} active={1 - activeB} />
            <Tab rect={TAB_B} tab={tabs[1]} active={activeB} />

            {/* Toolbar */}
            <div style={{
                position: 'absolute', left: 0, right: 0, top: TABS_H, height: BAR_H, background: '#fff',
                borderBottom: `1px solid ${color.g200}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 34px',
            }}>
                {navIcon('M19 12H5M11 6l-6 6 6 6')}
                {navIcon('M5 12h14M13 6l6 6-6 6', true)}
                {navIcon('M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5')}
                <div style={{
                    flex: 1, height: 58, borderRadius: 29, background: color.g100, display: 'flex', alignItems: 'center', gap: 14,
                    padding: '0 26px', fontSize: 28, color: color.g700, whiteSpace: 'nowrap', overflow: 'hidden', marginLeft: 6,
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                        <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    {address}
                </div>
                {loading >= 0 && loading < 1 && (
                    <div style={{ position: 'absolute', left: 0, bottom: -2, height: 5, width: `${Math.max(0.08, loading) * 100}%`, background: color.blue }} />
                )}
            </div>

            {/* Page */}
            <div style={{ position: 'absolute', left: 0, top: PAGE.y - WIN.y, width: PAGE.w, height: PAGE.h, overflow: 'hidden', background: '#fff' }}>
                {children}
            </div>
        </div>
    );
}
