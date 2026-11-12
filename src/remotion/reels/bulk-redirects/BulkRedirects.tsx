/* "How to Redirect Hundreds of Domains at Once (One Spreadsheet)" — 16:9, YouTube W46. A calm story first, a
   tutorial second: Glomvo holds names; a founder types kipzoo.com, meets a warning page and leaves; one spreadsheet
   gives every name a door that opens properly and a way to hear the knock. Scenes are <Sequence>s over beat windows
   from timeline.ts, built from the approved key frames (frames.gen.tsx); every visual is a function of time.
   Sound: Sarah's voiceover (public/audio/bulk-redirects-vo.mp3, scripts/yt/vo-build.py: eleven_v4 takes, tone-matched,
   gently mastered), Moon Walk under it (public/audio/bulk-redirects-bed.mp3, scripts/yt/bed-build.py: looped once,
   ducked, never near the voice) and effects on story beats only (roles in sound.ts). */
import type { ReactNode } from 'react';
import { loadFont } from '@remotion/fonts';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { GlomvoScene, NotebookScene, TitleScene } from './ActA';
import { ParkingScene, RenewalsScene, WeightScene } from './ActB';
import { TwoScene, WarningScene } from './ActC';
import { DoorScene, HonestScene, OnceScene } from './ActD';
import type { BulkRedirectsProps } from './props';
import { StaticScene } from './scene';
import { SOUND, type Role } from './sound';
import { TOTAL, at, knockAt, sceneWindow, word, type SceneKey } from './timeline';

// Instrument Serif (OFL, public/fonts/OFL-instrument-serif.txt): Glomvo's wordmark only.
if (typeof document !== 'undefined') loadFont({ family: 'Instrument Serif', url: staticFile('fonts/instrument-serif-latin-400.woff2'), weight: '400', format: 'woff2' });

export const BULK_REDIRECTS_SECONDS = TOTAL;

const S = (t: number, role: Role, volume: number): SfxCue => [t, SOUND[role], volume];
/** Effects on story beats only (w46-Sound). No clicks, typing or ticks. */
const CUES: readonly SfxCue[] = [
    S(at(4) - 0.3, 'transition', 0.34), // into the title (1 of 2)
    S(word(10, 'warning') - 0.05, 'problem', 0.3), // the warning page lands (the one low tone)
    S(knockAt(1), 'knock', 0.5), // "a way to hear when someone knocks" (knock 1 of 2)
];

const SCENES: readonly [SceneKey, string, (p: BulkRedirectsProps) => ReactNode][] = [
    ['notebook', 'A · Notebook', () => <NotebookScene />],
    ['glomvo', 'A · Glomvo', () => <GlomvoScene />],
    ['title', 'A · Title', () => <TitleScene />],
    ['renewals', 'B · Renewals', () => <RenewalsScene />],
    ['parking', 'B · Parking', () => <ParkingScene />],
    ['weight', 'B · Weight', () => <WeightScene />],
    ['two', 'C · Two results', () => <TwoScene />],
    ['warning', 'C · Warning → Silence', () => <WarningScene />],
    ['door', 'D · Door', () => <DoorScene />],
    ['honest', 'D · Honest', () => <HonestScene />],
    ['once', 'D · Once', () => <OnceScene />],
    ['list', 'E · List', () => <StaticScene k="List" />],
    ['columns', 'E · Columns', () => <StaticScene k="Columns" />],
    ['product', 'E · Import → Fix → Review', () => <StaticScene k="Import" />],
    ['dns', 'E · Point DNS', () => <StaticScene k="PointDNS" />],
    ['padlocks', 'E · Padlocks', () => <StaticScene k="Padlocks" />],
    ['knocks', 'F · Knocks', () => <StaticScene k="Knocks" />],
    ['price', 'F · Price', () => <StaticScene k="Price" />],
    ['quiet', 'F · Quiet', () => <StaticScene k="Quiet" />],
    ['bytag', 'F · By tag', () => <StaticScene k="ByTag" />],
    ['recap', 'G · Recap', () => <StaticScene k="Recap" />],
    ['yours', 'G · Your names', () => <StaticScene k="YourNames" />],
    ['end', 'End card', () => <StaticScene k="EndCard" />],
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
            <Sfx cues={CUES} />
            {SCENES.map(([key, name, render]) => <Sequence key={key} {...seq(key)} name={name}>{render(props)}</Sequence>)}
        </AbsoluteFill>
    );
}
