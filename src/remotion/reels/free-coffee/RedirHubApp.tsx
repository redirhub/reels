/* RedirHub in tab B, drawn after the real app (redirhub/lviv): the unified Links list
   (src/components/links/LinksList.tsx, BaseListItem, RowStatusPill) and the full-page
   Edit link form (CreateBranded + CreateLayout), with its "Changes saved" toast
   (ToastContainer). Page-local coords; sizes scaled ~2× for a phone screen. */
import type { ReactNode } from 'react';
import { color, font } from '../../brand/tokens';
import { IconLock } from '../../components/icons';
import { LinksPage as SharedLinksPage, type RowData } from '../../components/LinksList';
import { easeBack, fx, lerp } from '../../lib/anim';
import { FIELD, ROW, SAVE_BTN } from './timeline';

// App tokens (lviv src/styles/tailwind.css).
const ok = '#12B76A';
const warn = { bg: '#FFFAEB', text: '#C86407' };
const border = color.g200;

export type { RowData };

/** The shared Links list (components/LinksList.tsx) with this reel's row geometry. */
export function LinksPage(p: { rows: readonly RowData[]; attention: number; flash: number; pillPop: number; pencilHover: number; brokenIndex: number }) {
    return <SharedLinksPage {...p} geom={ROW} />;
}

function Label({ top, children }: { top: number; children: ReactNode }) {
    return <div style={{ position: 'absolute', left: 40, top, fontSize: 28, fontWeight: 500, color: color.g700 }}>{children}</div>;
}
function Hint({ top, children }: { top: number; children: ReactNode }) {
    return <div style={{ position: 'absolute', left: 40, right: 40, top, fontSize: 23, lineHeight: 1.4, color: color.g500 }}>{children}</div>;
}

/** The full-page editor (E1): only the destination can change; the short link is locked. */
export type FieldParts = { pre: string; sel: string; mid: string; post: string };

export function EditLinkPage({ link, field, value, caret, focused, dirty, saving, press }: {
    link: string; field: FieldParts; value: string; caret: boolean; focused: boolean; dirty: number; saving: boolean; press: number;
}) {
    // Zero-width, so the hidden caret never opens a gap in the text.
    const caretEl = (
        <span style={{ position: 'relative', display: 'inline-block', width: 0, height: 38, verticalAlign: 'middle' }}>
            <span style={{ position: 'absolute', left: -1, top: 0, width: 3, height: 38, background: color.blue, visibility: caret ? 'visible' : 'hidden' }} />
        </span>
    );
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
                    <span style={{ whiteSpace: 'pre' }}>{field.pre}</span>
                    {field.sel && <span style={{ background: '#B2D4F5', borderRadius: 4, whiteSpace: 'pre' }}>{field.sel}</span>}
                    <span style={{ whiteSpace: 'pre' }}>{field.mid}</span>
                    {caretEl}
                    <span style={{ whiteSpace: 'pre' }}>{field.post}</span>
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
