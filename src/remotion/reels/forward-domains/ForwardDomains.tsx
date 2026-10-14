/* "How to Forward Multiple Domains to One Website (With HTTPS)" — 16:9, YouTube W43. Scenes are
   <Sequence>s over beat windows from timeline.ts; every visual is a function of time. Sound: the voiceover
   (public/audio/forward-domains-vo.mp3, built by scripts/yt/vo-build.py: AudioSR band restoration, then the
   studio chain), the bed under it (public/audio/forward-domains-bed.mp3, scripts/yt/bed-build.py: ducked,
   never near the voice) and effects on story beats, timed to her words (roles in sound.ts). */
import type { ReactNode } from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { DeadEndsScene, DomainsScene, TitleScene } from './ActA';
import { AddressBarScene, OneAddressScene, PointerScene, REWIND_FROM, StepsScene, TwistScene } from './ActB';
import { ConnectDnsScene, DashScene, HttpsIssuedScene, MainAddressScene } from './ActC';
import { AllGreenScene, CheckerScene, EndCardScene, FourAddressesScene, HonestScene, RenewScene, allGreenRows } from './ActD';
import type { ForwardDomainsProps } from './props';
import { SOUND, type Role } from './sound';
import { TOTAL, at, local, sceneWindow, word, type SceneKey } from './timeline';

export const FORWARD_DOMAINS_SECONDS = TOTAL;

const S = (t: number, role: Role, volume: number): SfxCue => [t, SOUND[role], volume];
/** Effects on story beats, timed to the spoken words. `transition` twice (title, into the product),
    `rewind` once, `fixed` twice (a pass, the end card): the signature chime only plays when something
    broken is now right. Clicks and typing only on real product actions, as on W41. */
const CUES: readonly SfxCue[] = [
    // Act A: many names, one problem
    S(word(2, 'com') - 0.02, 'pop', 0.32),                   // the first pill
    S(word(6, 'not') - 0.05, 'denied', 0.42),                // "Not secure" racks to the centre
    S(at(8) - 0.3, 'transition', 0.38),                      // into the title (1 of 2)
    // Act B: how it works, the shortcut, the twist
    S(word(10, 'dns') - 0.2, 'pop', 0.28),                   // the address book
    S(at(13) + 0.25, 'pop', 0.3), // the ticks: it looks perfect
    S(word(14, 'copies') - 0.15, 'burst', 0.45),             // COPY stamps
    S(word(16, 'typo') - 0.3, 'denied', 0.36),               // the typo stays in the bar
    S(local('addressbar').start + REWIND_FROM(), 'rewind', 0.42), // the film's only time-reverse
    S(word(17, '301') - 0.05, 'pop', 0.3),                   // the 301 tags
    S(at(19) + 0.35, 'pop', 0.28),                           // three steps
    // Act C: the three steps, in RedirHub
    S(word(20, 'main') - 0.1, 'pop', 0.3),                   // the main address card
    S(at(23) - 0.3, 'transition', 0.36),                     // into the product (2 of 2)
    S(word(24, 'create') - 0.05, 'click', 0.4),              // Create
    S(word(24, 'domain') - 0.05, 'click', 0.4),              // Domain Redirect
    S(word(25, 'mybrand'), 'typing', 0.2),                   // Redirect from
    S(word(25, 'https'), 'typing', 0.2),                     // Redirect to
    S(word(28, 'save') - 0.05, 'click', 0.4),                // Create redirect
    S(word(28, 'save') + 0.75, 'success', 0.32),             // the first row lands
    S(word(28, 'co'), 'pop', 0.24), S(word(28, 'typo'), 'pop', 0.24), S(word(28, 'get'), 'pop', 0.24), // a pop per row
    S(word(30, 'dozens') - 0.1, 'pop', 0.26),                // the CSV tip
    S(word(33, 'connect') + 0.1, 'click', 0.4),              // Connect DNS
    S(word(37, 'quick') - 0.1, 'pop', 0.26),                 // the MX tip
    S(word(38, 'automatically') + 0.15, 'success', 0.42),    // the certificate: the room floods
    // Act D: prove it, then close
    S(word(41, 'sixteen') - 0.1, 'burst', 0.4),              // "16" slams in
    S(at(43) + 0.25, 'click', 0.4),                          // Check Redirect
    S(word(43, "that's") - 0.05, 'fixed', 0.55),             // That's a pass (1 of 2)
    ...allGreenRows().map((a) => S(a, 'pop', 0.22)),        // all sixteen, a pop per row
    S(word(49, 'one') - 0.1, 'fixed', 0.5),                  // One website (2 of 2)
];

const SCENES: readonly [SceneKey, string, (p: ForwardDomainsProps) => ReactNode][] = [
    ['domains', 'A · Domains', (p) => <DomainsScene {...p} />],
    ['deadends', 'A · Dead ends', (p) => <DeadEndsScene {...p} />],
    ['title', 'A · Title', () => <TitleScene />],
    ['pointer', 'B · Pointer', (p) => <PointerScene {...p} />],
    ['twist', 'B · Perfect → Copies', (p) => <TwistScene {...p} />],
    ['addressbar', 'B · Address bar', (p) => <AddressBarScene {...p} />],
    ['oneaddress', 'B · One address', (p) => <OneAddressScene {...p} />],
    ['steps', 'B · Steps', () => <StepsScene L={local('steps')} />],
    ['main', 'C · Main address', (p) => <MainAddressScene {...p} />],
    ['dash', 'C · Dashboard', (p) => <DashScene {...p} />],
    ['dns', 'C · Connect DNS', (p) => <ConnectDnsScene {...p} />],
    ['https', 'C · HTTPS issued', (p) => <HttpsIssuedScene {...p} />],
    ['four', 'D · Four addresses', (p) => <FourAddressesScene {...p} />],
    ['checker', 'D · Checker', (p) => <CheckerScene {...p} />],
    ['allgreen', 'D · All green', (p) => <AllGreenScene {...p} />],
    ['honest', 'D · Honest note', () => <HonestScene />],
    ['renew', 'D · Renew', (p) => <RenewScene {...p} />],
    ['recap', 'D · Recap', () => <StepsScene recap L={local('recap')} />],
    ['end', 'End card', (p) => <EndCardScene {...p} />],
];

export function ForwardDomains(props: ForwardDomainsProps) {
    const { fps } = useVideoConfig();
    const seq = (key: SceneKey) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Html5Audio src={staticFile('audio/forward-domains-vo.mp3')} />
            {/* The bed, already fitted, ducked under every word and level-checked (scripts/yt/bed-build.py). */}
            <Html5Audio src={staticFile('audio/forward-domains-bed.mp3')} />
            <Sfx cues={CUES} />
            {SCENES.map(([key, name, render]) => <Sequence key={key} {...seq(key)} name={name}>{render(props)}</Sequence>)}
        </AbsoluteFill>
    );
}
