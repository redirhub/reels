/* 11.9–20.3s (8.4s) · Chapter 1: point an extra domain at the main site.
   Form labels follow the real "New redirect" form (redirhub/lviv Form.add.js). Times are local. */
import { color, font } from '../../brand/tokens';
import { Field, Pill } from '../../components/Dashboard';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { IconArrowRight, IconCheck } from '../../components/icons';
import { easeOut, fx, prog, rise, useTime } from '../../lib/anim';
import { Button, Caret, Chapter, CONTENT, typed } from './Layout';
import type { HomepageExplainerProps } from './props';

const FIELD_X = CONTENT.x + 330;
export const DOMAINS_CLICKS = [1.6, 3.0, 4.7] as const;
const CURSOR: readonly CursorKey[] = [
    [1.0, 1700, 960], [1.5, FIELD_X, CONTENT.y + 142], [2.6, FIELD_X, CONTENT.y + 142],
    [2.95, FIELD_X, CONTENT.y + 302], [4.2, FIELD_X, CONTENT.y + 302], [4.65, CONTENT.x + 100, CONTENT.y + 462],
];
/** Typing windows, for the SFX cues. */
export const DOMAINS_TYPING = [[1.7, 2.5], [3.1, 4.1]] as const;

const label = { position: 'absolute', left: 0, fontSize: 26, fontWeight: 600, color: color.g700 } as const;

export function Domains(props: HomepageExplainerProps) {
    const t = useTime();
    const from = props.extraDomain;
    const to = `https://${props.domain}`;
    const done = t >= 4.8;
    const f1 = t >= 1.6 && t < 3.0;
    const f2 = t >= 3.0 && t < 4.7;
    const blink = Math.floor(t * 2.5) % 2 === 0;
    const preview = easeOut(prog(t, 4.9, 5.3));

    return (
        <Chapter
            t={t} index={0} nav="redirects" address="dash.redirhub.com/redirects/new"
            title={<>Redirect the domain.<br /><span style={{ color: color.teal }}>Skip the server.</span></>}
            overlay={<Cursor t={t} keys={CURSOR} clicks={DOMAINS_CLICKS} show={0.95} hide={5.3} />}
            body={<>Point an extra or old domain wherever it needs to go, without keeping hosting alive just to return a redirect.</>}
        >
            <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.02em', color: color.charcoal }}>New redirect</div>

                <div style={{ ...label, top: 80 }}>Redirect from</div>
                <Field style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 84, borderColor: f1 ? color.blue : color.g300, boxShadow: f1 ? '0 0 0 6px rgba(28,109,182,.15)' : 'none' }}>
                    <span style={{ fontFamily: font.mono }}>{typed(from, t, 1.7, 2.5)}</span><Caret on={f1 && blink} />
                    {t < 1.7 && <span style={{ color: color.g400, fontWeight: 500 }}>example.com</span>}
                </Field>

                <div style={{ ...label, top: 240 }}>Redirect to</div>
                <Field style={{ position: 'absolute', left: 0, right: 0, top: 280, height: 84, borderColor: f2 ? color.blue : color.g300, boxShadow: f2 ? '0 0 0 6px rgba(28,109,182,.15)' : 'none' }}>
                    <span style={{ fontFamily: font.mono }}>{typed(to, t, 3.1, 4.1)}</span><Caret on={f2 && blink} />
                    {t < 3.1 && <span style={{ color: color.g400, fontWeight: 500 }}>https://</span>}
                </Field>

                <div style={{ position: 'absolute', left: 0, top: 420 }}>
                    <Button t={t} pressAt={4.7} done={done} doneLabel={<><IconCheck size={28} color="#fff" />Created</>}>Create</Button>
                </div>

                {/* What a visitor now sees. */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, top: 540, height: 110, borderRadius: 22, background: color.g50, border: `2px solid ${color.g200}`,
                    display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', fontFamily: font.mono, fontSize: 26, fontWeight: 700,
                    ...fx(preview, 0, (1 - preview) * 30),
                }}>
                    <span style={{ color: color.g700 }}>{from}</span>
                    <IconArrowRight size={32} color={color.g500} />
                    <span style={{ color: color.okText }}>{props.domain}</span>
                    <Pill tone="ok" style={{ marginLeft: 'auto', fontFamily: font.sans, ...rise(t, 5.2, 0.35, 10) }}>Active</Pill>
                </div>
            </div>
        </Chapter>
    );
}
