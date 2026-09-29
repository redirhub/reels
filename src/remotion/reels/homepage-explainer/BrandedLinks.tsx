/* 27.9–36.3s (8.4s) · Chapter 3: a branded short link + QR on the customer's
   domain; the destination changes, the printed QR doesn't. Times are local. */
import { color, font } from '../../brand/tokens';
import { Avatar, Field } from '../../components/Dashboard';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { BrandedQr } from '../../components/QrCode';
import { IconCheck, IconQr } from '../../components/icons';
import { easeBack, easeOut, fx, lerp, prog, useTime } from '../../lib/anim';
import { Button, Caret, Chapter, CONTENT, typed } from './Layout';
import { links, type HomepageExplainerProps } from './props';

export const LINKS_CLICKS = [1.8, 4.1] as const;
export const LINKS_TYPING = [2.35, 3.5] as const;
const CURSOR: readonly CursorKey[] = [[1.0, 1500, 980], [1.7, CONTENT.x + 300, CONTENT.y + 262], [3.6, CONTENT.x + 300, CONTENT.y + 262], [4.0, CONTENT.x + 650, CONTENT.y + 262]];

const rowLabel = { width: 80, fontSize: 26, color: color.g600, fontWeight: 500 } as const;

export function BrandedLinks(props: HomepageExplainerProps) {
    const t = useTime();
    const { shortLink, oldUrl, newUrl } = links(props);
    const focused = t >= 1.8 && t < 4.1;
    const selected = t >= 2.0 && t < 2.35;
    const saved = t >= 4.2;
    const toText = t < 2.35 ? oldUrl : typed(newUrl, t, 2.35, 3.5);
    const caretOn = focused && !selected && (Math.floor(t * 2.5) % 2 === 0 || (t > 2.35 && t < 3.5));
    const ring = prog(t, 4.4, 4.7) * (0.75 + 0.25 * Math.sin((t - 4.4) * 6));

    return (
        <Chapter
            t={t} index={2} nav="shortener" address={`dash.redirhub.com/short-url/${props.linkPath}`}
            title={<>Branded links people<br /><span style={{ color: color.teal }}>recognize as yours.</span></>}
            body={<>Short links and dynamic QR codes on your own domain. Print once, then change where it goes anytime.</>}
            overlay={<Cursor t={t} keys={CURSOR} clicks={LINKS_CLICKS} show={0.95} hide={4.5} />}
        >
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <Avatar size={76} icon={<IconQr size={38} color={color.blue} />} />
                    <div>
                        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', color: color.charcoal }}>Spring flyer</div>
                        <div style={{ fontSize: 24, color: color.g500, fontFamily: font.mono, marginTop: 4 }}>{shortLink}</div>
                    </div>
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={rowLabel}>From</div>
                    <Field style={{ height: 84, background: color.g50, fontFamily: font.mono }}>{shortLink}</Field>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={rowLabel}>To</div>
                    <Field style={{
                        height: 84, fontFamily: font.mono, fontSize: 25,
                        borderColor: saved ? color.teal : focused ? color.blue : color.g300,
                        boxShadow: focused ? '0 0 0 6px rgba(28,109,182,.15)' : saved ? '0 0 0 6px rgba(32,167,149,.15)' : 'none',
                        color: saved ? color.okText : color.g700, background: saved ? '#F6FEF9' : '#fff',
                    }}>
                        <span style={selected ? { background: '#B2D4F5', borderRadius: 4 } : undefined}>{toText}</span>
                        <Caret on={caretOn} />
                    </Field>
                    <Button t={t} pressAt={4.1} done={saved} doneLabel={<><IconCheck size={28} color="#fff" />Saved</>}>Save</Button>
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: 350, height: 280, borderRadius: 26, background: color.g100, padding: 26, display: 'flex', gap: 34, alignItems: 'center' }}>
                    <div style={{ flex: 'none', position: 'relative' }}>
                        <BrandedQr value={props.qrValue} label={shortLink} size={180} labelSize={16} padding={14} style={{ borderRadius: 16 }} />
                        <div style={{ position: 'absolute', inset: -10, borderRadius: 24, border: `6px solid ${color.teal}`, ...fx(ring) }} />
                        <div style={{
                            position: 'absolute', left: '50%', top: -24, whiteSpace: 'nowrap', background: color.teal, color: '#fff',
                            fontSize: 22, fontWeight: 800, padding: '8px 18px', borderRadius: 30, opacity: easeOut(prog(t, 4.45, 4.75)),
                            transform: `translateX(-50%) scale(${lerp(0.6, 1, easeBack(prog(t, 4.45, 4.8)))})`,
                        }}>Unchanged ✓</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: color.charcoal }}>The printed QR code</div>
                        <div style={{ fontSize: 25, color: color.g600, marginTop: 12, lineHeight: 1.45 }}>
                            Shows your branded link, so people<br />know where it goes. Only the<br />destination behind it changed.
                        </div>
                    </div>
                </div>
            </div>
        </Chapter>
    );
}
