/* 19.9–28.3s (8.4s) · Chapter 2: a site migration as one CSV of old → new URLs.
   Copy follows the real CSV import (redirhub/lviv redirect.import-*). Times are local. */
import { color, font } from '../../brand/tokens';
import { Cursor, type CursorKey } from '../../components/Cursor';
import { IconCheck, IconFile, IconUpload } from '../../components/icons';
import { clamp, easeBack, easeInOut, easeOut, fx, lerp, prog, useTime } from '../../lib/anim';
import { Button, Chapter, CONTENT } from './Layout';
import type { HomepageExplainerProps } from './props';

export const MIGRATE_DROP = 1.7;
export const MIGRATE_CLICK = 5.2;
const ROW0 = 2.0;
const ROW_GAP = 0.3;
const CURSOR: readonly CursorKey[] = [[3.9, 1500, 700], [4.9, CONTENT.x + 650, CONTENT.y + 582]];

export function Migrate(props: HomepageExplainerProps) {
    const t = useTime();
    const drop = easeInOut(prog(t, 1.0, MIGRATE_DROP));
    const landed = t >= MIGRATE_DROP;
    const done = t >= MIGRATE_CLICK + 0.1;
    const col = { from: 0, to: 330, type: 620 };

    return (
        <Chapter
            t={t} index={1} nav="redirects" address="dash.redirhub.com/redirects/import"
            title={<>Move the site.<br /><span style={{ color: color.teal }}>Keep every old URL working.</span></>}
            body={<>A migration is a URL mapping job. Upload the old → new list as a CSV and publish it in one go.</>}
            overlay={<>
                {/* The CSV file dragged in from the desktop. */}
                <div style={{
                    position: 'absolute', left: lerp(1640, CONTENT.x + 220, drop), top: lerp(1000, CONTENT.y + 90, drop),
                    display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderRadius: 18, background: '#fff',
                    boxShadow: '0 20px 50px rgba(16,24,40,.25)', fontSize: 26, fontWeight: 700, color: color.charcoal,
                    ...fx(clamp(prog(t, 0.9, 1.1)) * (landed ? 0 : 1), 0, 0, 1, lerp(-8, 0, drop)),
                }}><IconFile size={34} color={color.teal} />old-site-urls.csv</div>
                <Cursor t={t} keys={CURSOR} clicks={[MIGRATE_CLICK]} show={3.9} hide={5.7} />
            </>}
        >
            <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.02em', color: color.charcoal }}>Import from CSV</div>

                {/* Drop zone → uploaded file. */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, top: 70, height: landed ? 80 : 190, borderRadius: 20,
                    border: `2px ${landed ? 'solid' : 'dashed'} ${landed ? color.okLine : drop > 0.5 ? color.blue : color.g300}`,
                    background: landed ? color.okSoft : drop > 0.5 ? color.blueBg : color.g50,
                    display: 'flex', alignItems: 'center', justifyContent: landed ? 'flex-start' : 'center', gap: 16, padding: '0 26px',
                    flexDirection: landed ? 'row' : 'column',
                }}>
                    {landed ? (
                        <>
                            <IconFile size={34} color={color.teal} />
                            <span style={{ fontSize: 26, fontWeight: 700, color: color.charcoal }}>old-site-urls.csv</span>
                            <span style={{ marginLeft: 'auto', fontSize: 24, fontWeight: 600, color: color.okText }}>{props.migrationCount} rows</span>
                        </>
                    ) : (
                        <>
                            <IconUpload size={40} color={color.g500} />
                            <span style={{ fontSize: 26, fontWeight: 600, color: color.g700 }}>Drag and drop or click to upload a CSV</span>
                        </>
                    )}
                </div>

                {/* Mapping preview. */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: 170, ...fx(landed ? 1 : 0) }}>
                    <div style={{ position: 'relative', height: 40, fontSize: 21, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: color.g500 }}>
                        <span style={{ position: 'absolute', left: col.from + 16 }}>Old URL</span>
                        <span style={{ position: 'absolute', left: col.to }}>New URL</span>
                        <span style={{ position: 'absolute', left: col.type }}>Type</span>
                    </div>
                    {props.migration.map(([a, b], i) => {
                        const at = ROW0 + i * ROW_GAP;
                        const k = easeOut(prog(t, at, at + 0.35));
                        const ok = prog(t, at + 0.5, at + 0.75);
                        return (
                            <div key={a} style={{
                                position: 'relative', height: 56, borderTop: `1px solid ${color.g200}`, fontFamily: font.mono, fontSize: 22, fontWeight: 600,
                                display: 'flex', alignItems: 'center', ...fx(k, (1 - k) * 40),
                            }}>
                                <span style={{ position: 'absolute', left: col.from + 16, color: color.g600 }}>{a}</span>
                                <span style={{ position: 'absolute', left: col.to, color: color.charcoal }}>{b}</span>
                                <span style={{ position: 'absolute', left: col.type, padding: '4px 12px', borderRadius: 10, background: color.blueBg, color: color.blue, fontFamily: font.sans, fontSize: 20, fontWeight: 700 }}>301</span>
                                <div style={{
                                    position: 'absolute', right: 8, width: 36, height: 36, borderRadius: '50%', background: color.teal,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', ...fx(ok, 0, 0, lerp(0.4, 1, easeBack(ok))),
                                }}><IconCheck size={20} color="#fff" /></div>
                            </div>
                        );
                    })}
                    <div style={{ height: 40, borderTop: `1px solid ${color.g200}`, fontSize: 21, color: color.g500, paddingTop: 8, paddingLeft: 16, ...fx(prog(t, ROW0 + 5 * ROW_GAP, ROW0 + 5 * ROW_GAP + 0.3)) }}>
                        + {Number(props.migrationCount) - props.migration.length} more
                    </div>
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', alignItems: 'center', ...fx(easeOut(prog(t, 3.6, 4.0))) }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: done ? color.okText : color.charcoal }}>
                        {done ? `${props.migrationCount} redirects created` : `${props.migrationCount} redirects ready`}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button t={t} pressAt={MIGRATE_CLICK} done={done} doneLabel={<><IconCheck size={28} color="#fff" />Created</>}>Create</Button>
                    </div>
                </div>
            </div>
        </Chapter>
    );
}
