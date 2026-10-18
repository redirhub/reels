/* The RedirHub Links list (dash.redirhub.com), drawn after the real app (redirhub/lviv):
   src/components/links/LinksList.tsx, BaseListItem and RowStatusPill. Page-local coordinates,
   scaled ~2× so it reads on a phone screen. First built for free-coffee; shared so every reel
   that shows the list shows the same one. */
import type { ReactNode } from 'react';
import { RedirHubIcon } from '../brand/Logo';
import { color, font } from '../brand/tokens';
import { fx } from '../lib/anim';
import { IconDots, IconGlobe, IconLink, IconSearch } from './icons';

// App tokens (lviv src/styles/tailwind.css).
const ok = '#12B76A';
const err = { dot: '#F04438', bg: '#FEF3F2', text: '#B42318', line: '#FDA29B' };
const border = color.g200;

/** Where the rows sit on the page: first row's top, row height, gap, left and width. */
export type RowGeom = { top: number; h: number; gap: number; x: number; w: number };
export const ROW_GEOM: RowGeom = { top: 316, h: 146, gap: 14, x: 30, w: 940 };
export const rowTopIn = (g: RowGeom, i: number) => g.top + i * (g.h + g.gap);

function Pencil({ size = 30, c = color.g600 }: { size?: number; c?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
    );
}

function ReturnArrow() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 2 }}>
            <path d="M5 4v7a4 4 0 0 0 4 4h11" /><path d="M16 11l4 4-4 4" />
        </svg>
    );
}

export type RowData = { icon: 'link' | 'globe'; title: string; dest: string; clicks?: string; error?: boolean };

/** One row of the Links list. A healthy row shows its clicks; a broken one only its pill. */
export function LinkRow({ i, row, attention = 0, flash = 0, pillPop = 1, pencilHover = 0, enter = 1, geom = ROW_GEOM }: {
    i: number; row: RowData; attention?: number; flash?: number; pillPop?: number; pencilHover?: number;
    /** 0–1: the row landing in the list (fades and rises into place). */
    enter?: number; geom?: RowGeom;
}) {
    const bad = !!row.error;
    return (
        <div style={{
            position: 'absolute', left: geom.x, top: rowTopIn(geom, i), width: geom.w, height: geom.h, boxSizing: 'border-box',
            borderRadius: 22, border: `2px solid ${flash > 0 ? color.teal : attention > 0 ? err.line : border}`,
            background: bad && attention > 0 ? '#FFFBFA' : '#fff', display: 'flex', alignItems: 'center', padding: '0 24px 0 28px', gap: 24,
            boxShadow: flash > 0 ? `0 0 0 ${8 * flash}px rgba(32,167,149,${0.25 * flash})` : attention > 0 ? `0 0 0 ${8 * attention}px rgba(240,68,56,${0.14 * attention})` : 'none',
            ...(enter < 1 ? fx(enter, 0, (1 - enter) * 40) : null),
        }}>
            <div style={{
                position: 'relative', flex: 'none', width: 70, height: 70, borderRadius: 35, border: `2px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
            }}>
                {row.icon === 'globe' ? <IconGlobe size={34} color={color.teal} /> : <IconLink size={34} color={color.blue} />}
                <div style={{ position: 'absolute', right: -3, bottom: -3, width: 24, height: 24, borderRadius: 12, border: '4px solid #fff', background: bad ? err.dot : ok }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 500, color: color.g700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 24, color: color.g500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    <ReturnArrow /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.dest}</span>
                </div>
            </div>
            <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                {bad ? (
                    <div style={{
                        height: 46, padding: '0 18px', borderRadius: 23, background: err.bg, color: err.text, fontSize: 24, fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${pillPop})`,
                    }}><i style={{ width: 10, height: 10, borderRadius: 5, background: err.dot }} />Error</div>
                ) : (
                    <div style={{ fontSize: 26, color: color.g700, whiteSpace: 'nowrap', transform: `scale(${pillPop})` }}><b style={{ fontWeight: 700 }}>{row.clicks}</b> Clicks</div>
                )}
                <div style={{
                    width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `rgba(234,236,240,${pencilHover})`,
                }}><Pencil c={pencilHover > 0.5 ? color.g700 : color.g500} /></div>
                <IconDots size={30} color={color.g400} />
            </div>
        </div>
    );
}

/** Header of the Links page (phones/narrow windows show the logo next to the title). */
export function LinksHeader() {
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 18 }}>
            <div style={{ height: 46 }}><RedirHubIcon /></div>
            <div style={{ fontSize: 38, fontWeight: 600, color: color.charcoal, letterSpacing: '-.01em' }}>Links</div>
            <div style={{ marginLeft: 'auto', height: 62, padding: '0 26px', borderRadius: 14, background: color.blue, color: '#fff', fontSize: 27, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>Create
            </div>
            <div style={{ width: 58, height: 58, borderRadius: 29, background: color.blueBg, color: color.blue, fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>L</div>
        </div>
    );
}

export function LinksPage({ rows, attention = 0, flash = 0, pillPop = 1, pencilHover = 0, brokenIndex = -1, enter, linkCount = 128, geom = ROW_GEOM }: {
    rows: readonly RowData[]; attention?: number; flash?: number; pillPop?: number; pencilHover?: number; brokenIndex?: number;
    /** Per-row landing progress (0–1); rows land one by one. */
    enter?: readonly number[];
    /** The count in the search box ("Search in N links"). */
    linkCount?: number; geom?: RowGeom;
}) {
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: font.sans }}>
            <LinksHeader />
            <div style={{
                position: 'absolute', left: 40, right: 40, top: 130, height: 76, borderRadius: 16, border: `2px solid ${color.g300}`,
                display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', fontSize: 28, color: color.g400,
            }}><IconSearch size={30} color={color.g400} />{`Search in ${linkCount} links`}</div>
            <div style={{ position: 'absolute', left: 40, top: 228, display: 'flex', gap: 12 }}>
                {['Branded links', 'QR codes', 'Redirects', 'Health'].map((c) => (
                    <div key={c} style={{ height: 54, padding: '0 22px', borderRadius: 27, border: `2px solid ${color.g300}`, fontSize: 24, fontWeight: 600, color: color.g700, display: 'flex', alignItems: 'center' }}>{c}</div>
                ))}
            </div>
            {rows.map((row, i) => (
                <LinkRow key={i} i={i} row={row} geom={geom} enter={enter?.[i] ?? 1}
                    attention={i === brokenIndex ? attention : 0}
                    flash={i === brokenIndex ? flash : 0}
                    pillPop={i === brokenIndex ? pillPop : 1}
                    pencilHover={i === brokenIndex ? pencilHover : 0} />
            ))}
        </div>
    );
}
