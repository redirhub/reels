/* "How to Change Your Domain Name Without Losing SEO" — 16:9, YouTube W44. A story first, a tutorial second:
   Frosty Fusion becomes Frosty Bites without losing its place on Google. Scenes are <Sequence>s over beat
   windows from timeline.ts; every visual is a function of time. Sound: the voiceover (public/audio/change-domain-vo.mp3,
   built by scripts/yt/vo-build.py: ElevenLabs v3 takes, gaps tightened, AudioSR band restoration, then the studio
   chain), the pad under it (public/audio/change-domain-bed.mp3, scripts/yt/bed-build.py: ducked, never near the
   voice) and effects on story beats, timed to her words (roles in sound.ts). */
import type { ReactNode } from 'react';
import { loadFont } from '@remotion/fonts';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { SearchScene, SeoScene, ShopScene } from './ActA';
import { RenameScene, SmoothieScene, TitleScene, WorryScene } from './ActB';
import { PagesScene, StepsScene } from './ActC';
import { EverythingScene, MapScene, MeltScene, OneToOneScene, ProductScene, REWIND, REWIND_END, ShortcutScene, TellScene } from './ActD';
import { CheckerScene, EndCardScene, KeepScene, OldMenuScene, ReturnScene, WatchScene, WobbleScene } from './ActE';
import type { ChangeDomainProps } from './props';
import { SOUND, type Role } from './sound';
import { TOTAL, at, end, local, sceneWindow, voEnd, word, type SceneKey } from './timeline';

// Fredoka (OFL, public/fonts/OFL-fredoka.txt): the shop's logos only.
if (typeof document !== 'undefined') loadFont({ family: 'Fredoka', url: staticFile('fonts/fredoka-latin-wght-normal.woff2'), weight: '300 700', format: 'woff2' });

export const CHANGE_DOMAIN_SECONDS = TOTAL;

const S = (t: number, role: Role, volume: number): SfxCue => [t, SOUND[role], volume];
/** Effects on story beats only, timed to her words (frame notes, w44-Sound). `transition` twice (title, into the
    product), `rewind` once, `fixed` twice (a pass; the same spot): the signature chime only plays when something
    broken is now right. Clicks only on real product actions. The gag, the wobble and the end card have none. */
const CUES: readonly SfxCue[] = [
    S(word(4, 'there') + 0.3, 'pop', 0.28),                 // the card rises into slot 1
    S(word(13, 'frosty') + 0.1, 'shimmer', 0.42),           // the rename morph: the scoop smiles
    S(at(18) - 0.3, 'transition', 0.36),                    // into the title (1 of 2)
    S(word(22, 'history') - 0.3, 'problem', 0.3),           // the history drops off
    S(word(28, 'quick') - 0.05, 'pop', 0.26),               // the tip
    S(word(31, 'no') - 0.05, 'pop', 0.24),                  // the ticks: it looks perfect
    S(word(34, 'melt'), 'problem', 0.32),                   // the top spot melts
    S(end(34) - REWIND_END - REWIND, 'rewind', 0.4),                     // the film's only time-reverse
    S(word(35, 'one') + 0.2 + 4 * 0.32 + 0.3, 'pop', 0.28), // the strawberry row snaps to its twin
    S(at(36) - 0.3, 'transition', 0.34),                    // into the product (2 of 2)
    S(word(37, 'create') - 0.05, 'click', 0.4),             // Create
    S(word(37, 'website') - 0.1, 'click', 0.4),             // Website Migration
    S(word(45, 'new') + 0.3, 'pop', 0.24),                  // Move requested
    S(word(46, 'sitemap') - 0.05, 'pop', 0.24),             // Submitted
    S(voEnd(49) + 0.05, 'click', 0.36),                     // Check Redirect
    S(word(50, "that's") - 0.1, 'fixed', 0.55),             // That's a pass (1 of 2)
    S(word(52, 'lands') + 0.1, 'sparkle', 0.5),             // the old menu still lands on the strawberry
    S(word(61, 'right') - 0.05, 'fixed', 0.5),              // right where Frosty Fusion used to be (2 of 2)
];

const SCENES: readonly [SceneKey, string, (p: ChangeDomainProps) => ReactNode][] = [
    ['shop', 'A · Shop', () => <ShopScene />],
    ['search', 'A · Search', () => <SearchScene />],
    ['seo', 'A · SEO', () => <SeoScene />],
    ['smoothie', 'B · Smoothie', () => <SmoothieScene />],
    ['rename', 'B · Rename', () => <RenameScene />],
    ['worry', 'B · Worry', () => <WorryScene />],
    ['title', 'B · Title', () => <TitleScene />],
    ['pages', 'C · Pages → Flip', (p) => <PagesScene {...p} />],
    ['steps', 'C · Steps', () => <StepsScene L={local('steps')} />],
    ['map', 'D · Map', (p) => <MapScene {...p} />],
    ['shortcut', 'D · Shortcut', () => <ShortcutScene />],
    ['melt', 'D · Melt', () => <MeltScene />],
    ['onetoone', 'D · One to one', (p) => <OneToOneScene {...p} />],
    ['product', 'D · Website Migration', (p) => <ProductScene {...p} />],
    ['tell', 'D · Tell Google', () => <TellScene />],
    ['everything', 'D · Everything', () => <EverythingScene />],
    ['checker', 'E · Checker', () => <CheckerScene />],
    ['oldmenu', 'E · Sweet surprise', () => <OldMenuScene />],
    ['wobble', 'E · Wobble', () => <WobbleScene />],
    ['watch', 'E · Watch', () => <WatchScene />],
    ['keep', 'E · Keep', () => <KeepScene />],
    ['recap', 'E · Recap', () => <StepsScene recap L={local('recap')} />],
    ['ret', 'E · Return', () => <ReturnScene />],
    ['end', 'End card', (p) => <EndCardScene {...p} />],
];

export function ChangeDomain(props: ChangeDomainProps) {
    const { fps } = useVideoConfig();
    const seq = (key: SceneKey) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Html5Audio src={staticFile('audio/change-domain-vo.mp3')} />
            {/* The pad, already fitted, ducked under every word and level-checked (scripts/yt/bed-build.py). */}
            <Html5Audio src={staticFile('audio/change-domain-bed.mp3')} />
            <Sfx cues={CUES} />
            {SCENES.map(([key, name, render]) => <Sequence key={key} {...seq(key)} name={name}>{render(props)}</Sequence>)}
        </AbsoluteFill>
    );
}
