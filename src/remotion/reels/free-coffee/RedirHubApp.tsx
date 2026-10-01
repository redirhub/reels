/* RedirHub in tab B, drawn after the real app (redirhub/lviv): the unified Links list
   (src/components/links/LinksList.tsx, BaseListItem, RowStatusPill) and the full-page
   Edit link form (CreateBranded + CreateLayout), with its "Changes saved" toast
   (ToastContainer). Page-local coords; sizes scaled ~2× for a phone screen. */
import type { ReactNode } from 'react';
import { RedirHubIcon } from '../../brand/Logo';
import { color, font } from '../../brand/tokens';
import { IconDots, IconGlobe, IconLink, IconLock, IconSearch } from '../../components/icons';
import { easeBack, fx, lerp } from '../../lib/anim';
import { FIELD, ROW, SAVE_BTN, rowTop } from './timeline';

// App tokens (lviv src/styles/tailwind.css).
const ok = '#12B76A';
const err = { dot: '#F04438', bg: '#FEF3F2', text: '#B42318', line: '#FDA29B' };
const warn = { bg: '#FFFAEB', text: '#C86407' };
const border = color.g200;

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
function Row({ i, row, attention = 0, flash = 0, pillPop = 1, pencilHover = 0 }: {
    i: number; row: RowData; attention?: number; flash?: number; pillPop?: number; pencilHover?: number;
}) {
    const bad = !!row.error;
    return (
        <div style={{
            position: 'absolute', left: ROW.x, top: rowTop(i), width: ROW.w, height: ROW.h, boxSizing: 'border-box',
            borderRadius: 22, border: `2px solid ${flash > 0 ? color.teal : attention > 0 ? err.line : border}`,
            background: bad && attention > 0 ? '#FFFBFA' : '#fff', display: 'flex', alignItems: 'center', padding: '0 24px 0 28px', gap: 24,
            boxShadow: flash > 0 ? `0 0 0 ${8 * flash}px rgba(32,167,149,${0.25 * flash})` : attention > 0 ? `0 0 0 ${8 * attention}px rgba(240,68,56,${0.14 * attention})` : 'none',
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
function LinksHeader() {
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

export function LinksPage({ rows, attention, flash, pillPop, pencilHover, brokenIndex }: {
    rows: readonly RowData[]; attention: number; flash: number; pillPop: number; pencilHover: number; brokenIndex: number;
}) {
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: font.sans }}>
            <LinksHeader />
            <div style={{
                position: 'absolute', left: 40, right: 40, top: 130, height: 76, borderRadius: 16, border: `2px solid ${color.g300}`,
                display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', fontSize: 28, color: color.g400,
            }}><IconSearch size={30} color={color.g400} />Search in 128 links</div>
            <div style={{ position: 'absolute', left: 40, top: 228, display: 'flex', gap: 12 }}>
                {['Branded links', 'QR codes', 'Redirects', 'Health'].map((c) => (
                    <div key={c} style={{ height: 54, padding: '0 22px', borderRadius: 27, border: `2px solid ${color.g300}`, fontSize: 24, fontWeight: 600, color: color.g700, display: 'flex', alignItems: 'center' }}>{c}</div>
                ))}
            </div>
            {rows.map((row, i) => (
                <Row key={i} i={i} row={row}
                    attention={i === brokenIndex ? attention : 0}
                    flash={i === brokenIndex ? flash : 0}
                    pillPop={i === brokenIndex ? pillPop : 1}
                    pencilHover={i === brokenIndex ? pencilHover : 0} />
            ))}
        </div>
    );
}

function Label({ top, children }: { top: number; children: ReactNode }) {
    return <div style={{ position: 'absolute', left: 40, top, fontSize: 28, fontWeight: 500, color: color.g700 }}>{children}</div>;
}
function Hint({ top, children }: { top: number; children: ReactNode }) {
    return <div style={{ position: 'absolute', left: 40, right: 40, top, fontSize: 23, lineHeight: 1.4, color: color.g500 }}>{children}</div>;
}

/** The full-page editor (E1): only the destination can change; the short link is locked. */
export function EditLinkPage({ link, value, selected, caret, focused, dirty, saving, press }: {
    link: string; value: string; selected: boolean; caret: boolean; focused: boolean; dirty: number; saving: boolean; press: number;
}) {
    const CARD = { x: 30, y: 128, w: 940 };
    return (
        <div style={{ position: 'absolute', inset: 0, background: color.g50, fontFamily: font.sans }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100, background: '#fff', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 500, color: color.g600 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color.g600} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>Back
                </div>
                <div style={{ width: 2, height: 36, background: border }} />
                <div style={{ fontSize: 34, fontWeight: 600, color: color.g700 }}>Edit link</div>
                <div style={{ fontSize: 24, color: color.g500, whiteSpace: 'nowrap' }}>{link}</div>
                <div style={{
                    marginLeft: 'auto', height: 46, padding: '0 18px', borderRadius: 23, background: warn.bg, color: warn.text, fontSize: 22, fontWeight: 500,
                    display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', ...fx(dirty, 0, 0, lerp(0.7, 1, easeBack(dirty))),
                }}>Unsaved changes</div>
            </div>

            <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: 512, background: '#fff', border: `2px solid ${border}`, borderRadius: 22, boxSizing: 'border-box' }}>
                <Label top={38}>Destination URL</Label>
                <div style={{
                    position: 'absolute', left: 40, right: 40, top: FIELD.top - CARD.y, height: FIELD.h, boxSizing: 'border-box', borderRadius: 16,
                    border: `2px solid ${focused ? color.blue : color.g300}`, boxShadow: focused ? '0 0 0 6px rgba(28,109,182,.16)' : 'none',
                    display: 'flex', alignItems: 'center', padding: '0 26px', fontSize: 30, color: color.charcoal, whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                    <span style={selected ? { background: '#B2D4F5', borderRadius: 4 } : undefined}>{value}</span>
                    <span style={{ display: 'inline-block', width: 3, height: 38, background: color.blue, marginLeft: 2, visibility: caret ? 'visible' : 'hidden' }} />
                </div>
                <Hint top={318 - CARD.y}>Everyone who opens the link goes here as soon as you save.</Hint>
                <Label top={386 - CARD.y}>Short link</Label>
                <div style={{
                    position: 'absolute', left: 40, right: 40, top: 432 - CARD.y, height: 88, boxSizing: 'border-box', borderRadius: 16,
                    border: `2px solid ${border}`, background: color.g50, display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px',
                }}>
                    <IconLock size={28} color={color.g500} />
                    <span style={{ fontSize: 30, fontWeight: 500, color: color.charcoal }}>{link}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 500, color: color.g500, whiteSpace: 'nowrap' }}>Can’t be changed</span>
                </div>
                <Hint top={536 - CARD.y}>Short links stay the same once created, so everything you’ve shared or printed keeps working.</Hint>
            </div>

            <div style={{ position: 'absolute', left: 40, top: 676, fontSize: 22, fontWeight: 600, letterSpacing: '.1em', color: color.g500 }}>PREVIEW</div>
            <div style={{ position: 'absolute', left: CARD.x, top: 712, width: CARD.w, boxSizing: 'border-box', background: '#fff', border: `2px solid ${border}`, borderRadius: 22, padding: '30px 36px' }}>
                <div style={{ fontSize: 38, fontWeight: 600, color: color.blue }}>{link}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, fontSize: 27, color: color.g500, whiteSpace: 'nowrap' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color.g500} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    {value || '…'}
                </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, top: SAVE_BTN.top - 18, bottom: 0, background: '#fff', borderTop: `1px solid ${border}` }} />
            <div style={{
                position: 'absolute', left: 40, right: 40, top: SAVE_BTN.top, height: SAVE_BTN.h, borderRadius: 18, background: color.blue,
                color: '#fff', fontSize: 32, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${press})`, opacity: saving ? 0.85 : 1,
            }}>{saving ? 'Saving…' : 'Save changes'}</div>
        </div>
    );
}

/** The app's success toast (top of the page). */
export function SavedToast({ k }: { k: number }) {
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center', ...fx(k, 0, (1 - k) * -60, lerp(0.92, 1, k)) }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 18, padding: '24px 36px', borderRadius: 18, background: '#fff',
                border: `2px solid ${border}`, boxShadow: '0 24px 50px rgba(16,24,40,.18)', fontFamily: font.sans,
            }}>
                <svg width="38" height="38" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={ok} /><path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 32, fontWeight: 600, color: color.charcoal }}>Changes saved</span>
            </div>
        </div>
    );
}
