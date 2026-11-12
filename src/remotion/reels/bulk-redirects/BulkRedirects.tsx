/* "How to Redirect Hundreds of Domains at Once (One Spreadsheet)" — 16:9, YouTube W46 (v6). A calm story first, a
   tutorial second: Northway, a small software company, has two hundred domains to move to one website; a customer
   types a retired product's domain, meets a warning page and leaves; one spreadsheet gives every domain a door that
   opens properly and a way to hear the knock. Scenes are <Sequence>s over beat windows
   from timeline.ts, built from the approved key frames (frames.gen.tsx); every visual is a function of time.
   Sound: Sarah's voiceover (public/audio/bulk-redirects-vo.mp3, scripts/yt/vo-build.py: eleven_v4 takes, tone-matched,
   gently mastered), Moon Walk under it (public/audio/bulk-redirects-bed.mp3, scripts/yt/bed-build.py: looped once,
   ducked, never near the voice) and effects on story beats only (roles in sound.ts). */
import type { ReactNode } from 'react';
import { loadFont } from '@remotion/fonts';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { NorthwayScene, NotebookScene, OneSiteScene, TitleScene } from './ActA';
import { AccountsScene, RenewalsScene, WeightScene } from './ActB';
import { TwoScene, WarningScene } from './ActC';
import { DoorScene, HonestScene, OnceScene } from './ActD';
import { ColumnsScene, DnsScene, ListScene, PadlocksScene, ProductScene } from './ActE';
import { ByTagScene, KnocksScene, PriceScene, QuietScene } from './ActF';
import { EndScene, RecapScene, YoursScene } from './ActG';
import type { BulkRedirectsProps } from './props';
import { SOUND, type Role } from './sound';
import { TOTAL, at, knockAt, padlocksLit, sceneWindow, word, type SceneKey } from './timeline';

// Instrument Serif (OFL, public/fonts/OFL-instrument-serif.txt): Northway's wordmark only.
if (typeof document !== 'undefined') loadFont({ family: 'Instrument Serif', url: staticFile('fonts/instrument-serif-latin-400.woff2'), weight: '400', format: 'woff2' });

export const BULK_REDIRECTS_SECONDS = TOTAL;

const S = (t: number, role: Role, volume: number): SfxCue => [t, SOUND[role], volume];
/** Effects on story beats only (w46-Sound). No clicks, typing or ticks. */
const CUES: readonly SfxCue[] = [
    S(at(5) - 0.3, 'transition', 0.34), // into the title (1 of 2)
    S(word(11, 'warning') - 0.05, 'problem', 0.3), // the warning page lands (the one low tone)
    S(knockAt(1), 'knock', 0.5), // "a way to hear when someone knocks" (knock 1 of 2)
    S(at(20) - 0.3, 'transition', 0.34), // into the product (2 of 2)
    S(padlocksLit(), 'fixed', 0.45), // every padlock lit (the signature chime, once: a fix moment)
    S(knockAt(2), 'knock', 0.5), // "Northway could hear the knocks" (knock 2 of 2)
];

const SCENES: readonly [SceneKey, string, (p: BulkRedirectsProps) => ReactNode][] = [
    ['notebook', 'A · Notebook', () => <NotebookScene />],
    ['northway', 'A · Northway', () => <NorthwayScene />],
    ['onesite', 'A · One website', () => <OneSiteScene />],
    ['title', 'A · Title', () => <TitleScene />],
    ['renewals', 'B · Renewals', () => <RenewalsScene />],
    ['accounts', 'B · Three accounts', () => <AccountsScene />],
    ['weight', 'B · Which ones people type', () => <WeightScene />],
    ['two', 'C · Two results', () => <TwoScene />],
    ['warning', 'C · Warning → Silence', () => <WarningScene />],
    ['door', 'D · Door', () => <DoorScene />],
    ['honest', 'D · Honest', () => <HonestScene />],
    ['once', 'D · One file', () => <OnceScene />],
    ['list', 'E · List', () => <ListScene />],
    ['columns', 'E · Columns', () => <ColumnsScene />],
    ['product', 'E · Import → Fix → Review', () => <ProductScene />],
    ['dns', 'E · Point DNS', () => <DnsScene />],
    ['padlocks', 'E · Padlocks', () => <PadlocksScene />],
    ['knocks', 'F · Knocks', (p) => <KnocksScene {...p} />],
    ['price', 'F · Homepage', () => <PriceScene />],
    ['quiet', 'F · Quiet', () => <QuietScene />],
    ['bytag', 'F · By tag', () => <ByTagScene />],
    ['recap', 'G · Recap', () => <RecapScene />],
    ['yours', 'G · Your list', () => <YoursScene />],
    ['end', 'End card', () => <EndScene />],
];

export function BulkRedirects(props: BulkRedirectsProps) {
    const { fps } = useVideoConfig();
    const seq = (key: SceneKey) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Html5Audio src={staticFile('audio/bulk-redirects-vo.mp3')} />
            {/* Moon Walk, already fitted, ducked under every word and level-checked (scripts/yt/bed-build.py). */}
            <Html5Audio src={staticFile('audio/bulk-redirects-bed.mp3')} />
            {/* a number a scene rolls (frames.gen.tsx data-count): drawn from its CSS counter */}
            <style>{'.w46-count::after { content: counter(w46n); }'}</style>
            <Sfx cues={CUES} />
            {SCENES.map(([key, name, render]) => <Sequence key={key} {...seq(key)} name={name}>{render(props)}</Sequence>)}
        </AbsoluteFill>
    );
}
