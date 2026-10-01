/* The fictional brand's pages in tab A: the page where the link is posted, the 404
   the old destination returns, and the page the fixed link lands on. Page-local coords. */
import { color, font } from '../../brand/tokens';
import { IconLink } from '../../components/icons';
import { fx, lerp } from '../../lib/anim';
import { LINK_Y, PAGE } from './timeline';

const bar = (w: number, top: number, h = 22, c: string = color.g100) => ({
    position: 'absolute' as const, left: (PAGE.w - w) / 2, top, width: w, height: h, borderRadius: h / 2, background: c,
});

/** The link as posted: the only thing on the page worth reading. */
export function LinkPage({ link, press = 1 }: { link: string; press?: number }) {
    return (
        <>
            <div style={{ position: 'absolute', left: 60, top: 54, width: 64, height: 64, borderRadius: 18, background: color.g100 }} />
            <div style={{ ...bar(260, 64, 20, color.g200), left: 144 }} />
            <div style={{ ...bar(180, 96, 16), left: 144 }} />
            <div style={bar(820, 196)} />
            <div style={bar(820, 236)} />
            <div style={bar(620, 276)} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: LINK_Y - 54, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    height: 108, padding: '0 40px', borderRadius: 28, background: color.blueBg, display: 'flex', alignItems: 'center', gap: 18,
                    fontSize: 54, fontWeight: 700, letterSpacing: '-.02em', color: color.blue, transform: `scale(${press})`,
                }}>
                    <IconLink size={46} color={color.blue} />
                    <span style={{ textDecoration: 'underline', textDecorationThickness: 4, textUnderlineOffset: 10 }}>{link}</span>
                </div>
            </div>
            <div style={bar(820, 640)} />
            <div style={bar(720, 680)} />
            <div style={bar(540, 720)} />
            <div style={{ ...bar(820, 800, 220, color.g50), borderRadius: 24 }} />
        </>
    );
}

/** A modern site's 404, not an infographic. */
export function NotFoundPage() {
    return (
        <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontFamily: font.sans }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 290, fontSize: 290, fontWeight: 800, letterSpacing: '-.05em', color: color.charcoal, lineHeight: 1 }}>404</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 620, fontSize: 54, fontWeight: 600, color: color.g600 }}>Page not found</div>
            <div style={{
                position: 'absolute', left: (PAGE.w - 360) / 2, top: 730, width: 360, height: 88, borderRadius: 18,
                border: `2px solid ${color.g300}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 600, color: color.g700,
            }}>Go to homepage</div>
        </div>
    );
}

/** Where the fixed link lands. */
export function PayoffPage({ text, emoji, k }: { text: string; emoji: string; k: number }) {
    return (
        <div style={{
            position: 'absolute', left: 0, right: 0, top: LINK_Y - 90, textAlign: 'center', fontFamily: font.sans,
            fontSize: 140, fontWeight: 800, letterSpacing: '-.045em', color: color.charcoal, whiteSpace: 'nowrap',
            ...fx(k, 0, (1 - k) * 26, lerp(0.96, 1, k)),
        }}>
            {text} <span style={{ letterSpacing: 0, fontFamily: font.emoji, fontWeight: 400 }}>{emoji}</span>
        </div>
    );
}
