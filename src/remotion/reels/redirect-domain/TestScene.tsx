/* ACT D (part one) — beats 37–47. The test, the twist (time runs backwards), the private
   window, and the three checks that pay off the promise. */
import { useTime, prog, easeOut, easeInOut, fx, lerp } from '../../lib/anim';
import { font, yt } from '../../brand/tokens';
import { BrowserCard, SkeletonPage } from '../../components/BrowserCard';
import { ChecklistBadge } from '../../components/ChecklistBadge';
import { Padlock } from '../../components/Padlock';
import { RedirectLine } from '../../components/RedirectLine';
import { UrlPill } from '../../components/UrlPill';
import { Caption, Night, SAFE, Tag, TipCard, W } from './Stage';
import { local } from './timeline';
import type { RedirectDomainProps } from './props';

const L = local('test');
const typed = (s: string, k: number) => s.slice(0, Math.floor(k * s.length + 1e-6));

export function TestScene(p: RedirectDomainProps) {
    const t = useTime();
    // Virtual time for the first attempt: runs forward through 37–38, then backwards during 39.
    const rewindStart = L.at(39) + 0.9, rewindEnd = L.end(39);
    const vt = t < rewindStart ? t : lerp(rewindStart, L.at(37), easeInOut(prog(t, rewindStart, rewindEnd)));
    const typeK = prog(vt, L.at(37) + 1.2, L.at(37) + 2.6);
    const loaded = easeOut(prog(vt, L.at(38) - 0.2, L.at(38) + 0.5));
    const firstTry = t < L.at(40) + 0.6;
    const rewinding = t >= rewindStart && t < rewindEnd;

    // Private window.
    const privIn = easeOut(prog(t, L.at(40) + 0.6, L.at(40) + 1.3));
    const type2 = prog(t, L.at(41) + 0.3, L.at(41) + 1.5);
    const resolved = easeOut(prog(t, L.word(41, 'there') - 0.2, L.word(41, 'there') + 0.3));
    const checks = t >= L.at(43);
    // While the private-window tip is up, both cards step left so the tip never covers the address bar.
    const tipK = easeInOut(prog(t, L.at(40) + 0.7, L.at(40) + 1.3)) * (1 - easeInOut(prog(t, L.at(41) - 0.3, L.at(41) + 0.3)));
    const cardOut = easeInOut(prog(t, L.at(43) - 0.4, L.at(43)));

    const cardX = (W - 1000) / 2 - 300 * tipK;
    return (
        <Night>
            <Tag t={t} from={L.at(37)} until={L.at(43) - 0.2}>THE TEST</Tag>
            {!checks && (
                <>
                    {/* First attempt */}
                    <div style={{ position: 'absolute', left: cardX, top: 260, ...fx(firstTry ? 1 - privIn * 0.6 : 0, 0, privIn * 30, 1 - privIn * 0.04), filter: rewinding ? 'saturate(.7)' : 'none' }}>
                        <BrowserCard address={typed(p.oldDomain, typeK)} lock={loaded > 0.5 ? 'none' : 'none'} dot={loaded > 0.5 ? 'grey' : 'none'} width={1000} height={520} loading={typeK >= 1 && loaded < 1 ? loaded : -1}>
                            <div style={{ ...fx(loaded) }}><SkeletonPage title="mydomain (old site)" accent={yt.inkMute} lines={3} /></div>
                        </BrowserCard>
                    </div>
                    {rewinding && (
                        <div style={{ position: 'absolute', left: cardX + 1000 - 90, top: 210, fontSize: 28, fontWeight: 600, color: yt.inkMute, letterSpacing: '.1em' }}>◀◀</div>
                    )}
                    <Caption t={t} from={L.at(39) + 0.1} until={L.at(40) + 0.6} y={840} size={44} color={yt.ink} text="Your redirect might be fine. It's your test that's wrong.">
                        Your redirect might be fine. <span style={{ color: yt.teal }}>It’s your test that’s wrong.</span>
                    </Caption>

                    {/* Private window */}
                    <div style={{ position: 'absolute', left: cardX, top: 260, ...fx(privIn * (1 - cardOut), 0, (1 - privIn) * 60 + cardOut * 40) }}>
                        <BrowserCard dark title="Private window" style={{ boxShadow: '0 50px 120px rgba(0,0,0,.55), 0 0 0 2px rgba(185,198,216,.5)' }} address={resolved > 0.5 ? `https://${p.newDomain}` : typed(p.oldDomain, type2)} lock={resolved > 0.5 ? 'secure' : 'none'} dot={resolved > 0.5 ? 'teal' : 'none'} width={1000} height={520} loading={type2 >= 1 && resolved < 1 ? prog(t, L.at(41) + 1.5, L.at(41) + 2.1) : -1}>
                            <div style={{ ...fx(resolved) }}><SkeletonPage tone="dark" title="Welcome to mybrand" lines={3} /></div>
                        </BrowserCard>
                    </div>
                    <TipCard t={t} from={L.at(40) + 0.9} until={L.at(41) - 0.1} label={p.tips.privateWindow} y={380}>No copies, no leftovers.</TipCard>
                    <Caption t={t} from={L.at(42)} until={L.end(42)} y={840} size={40} color={yt.inkSoft}>Old site? Give DNS a few minutes.</Caption>
                </>
            )}
            {checks && <Checks t={t} p={p} />}
        </Night>
    );
}

function Checks({ t, p }: { t: number; p: RedirectDomainProps }) {
    const items = [
        { from: `https://${p.oldDomain}`, to: `https://${p.newDomain}`, label: 'Old domain, with https', lock: true },
        { from: `${p.oldDomain}${p.deepPath}`, to: `${p.newDomain}${p.deepPath}`, label: 'Deep link lands on the same page', lock: true },
        { from: `www.${p.oldDomain}`, to: `${p.newDomain}`, label: 'www works too', lock: true },
    ];
    const beatOf = [44, 45, 46] as const;
    const all = t >= L.at(47);
    const y0 = 300, gap = 170;
    return (
        <>
            <Caption t={t} from={L.at(43) + 0.1} until={L.at(44) + 0.15} y={160} size={44} color={yt.ink}>Three quick checks.</Caption>
            {items.map((it, i) => {
                const b = beatOf[i];
                const show = t >= L.at(b) || all;
                const k = easeOut(prog(t, L.at(b) + 0.1, L.at(b) + 0.6));
                const line = easeInOut(prog(t, L.at(b) + 1.0, L.at(b) + 2.0));
                const done = easeOut(prog(t, L.at(b) + 2.2, L.at(b) + 2.9));
                const y = y0 + i * gap;
                if (!show) return null;
                const fromX = SAFE.x + 120, toX = W - SAFE.x - 120 - it.to.length * 19;
                return (
                    <div key={it.label} style={{ ...fx(k) }}>
                        <div style={{ position: 'absolute', left: SAFE.x, top: y - 30 }}><ChecklistBadge k={done} size={60} /></div>
                        <div style={{ position: 'absolute', left: fromX, top: y - 36 }}><UrlPill url={it.from} dot={done > 0.5 ? 'teal' : 'grey'} size={30} /></div>
                        <RedirectLine from={[fromX + it.from.length * 19 + 60, y]} to={[toX - (i === 0 ? 66 : 20), y]} progress={line} color={yt.teal} bend={0.0} traffic={done > 0.5 ? 2 : 0} t={t} />
                        {/* Check one is "with a padlock": the lock sits just before the new address */}
                        {i === 0 && <div style={{ position: 'absolute', left: toX - 52, top: y - 22, ...fx(done) }}><Padlock size={34} color={yt.teal} /></div>}
                        <div style={{ position: 'absolute', left: toX, top: y - 36, display: 'flex', alignItems: 'center', gap: 14, ...fx(line > 0.95 ? 1 : 0.35) }}>
                            <UrlPill url={it.to} dot={done > 0.5 ? 'teal' : 'none'} size={30} />
                        </div>
                        <div style={{ position: 'absolute', left: fromX, top: y + 34, fontSize: 24, color: yt.inkMute, fontFamily: font.display }}>{it.label}</div>
                    </div>
                );
            })}
            {/* Beat 47: the one allowed combined result */}
            <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x + 20, top: y0 + 3 * gap + 20, ...fx(easeOut(prog(t, L.at(47) + 0.2, L.at(47) + 0.7))) }}>
                <div style={{ height: 4, borderRadius: 2, background: yt.teal, transform: `scaleX(${easeInOut(prog(t, L.at(47) + 0.3, L.at(47) + 1.1))})`, transformOrigin: 'left' }} />
                <div style={{ marginTop: 26, fontSize: 48, fontWeight: 800, letterSpacing: '-.03em', color: yt.teal }}>All three green.</div>
            </div>
        </>
    );
}
