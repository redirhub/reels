/* "How to redirect a domain to another domain (with HTTPS that actually works)" — 16:9,
   RedirHub's first YouTube video. Scenes are <Sequence>s over beat windows from timeline.ts;
   every visual is a function of time. Sound: the voiceover (public/audio/redirect-domain-vo.mp3, built by
   scripts/yt/vo-build.py with a studio chain and mastered to the channel level), the music bed under it
   (public/audio/redirect-domain-bed.mp3, scripts/yt/bed-build.py: ducked, never near the voice) and
   effects on story beats, timed to the spoken words (roles in sound.ts). */
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { font } from '../../brand/tokens';
import { FixedEndCard } from '../../components/FixedEndCard';
import { CloseScene } from './CloseScene';
import { HookScene } from './HookScene';
import { IdeasScene } from './IdeasScene';
import { TestScene } from './TestScene';
import { WalkthroughScene } from './WalkthroughScene';
import type { RedirectDomainProps } from './props';
import { TOTAL, at, local, sceneWindow, word } from './timeline';
import { Sfx, type SfxCue } from '../../components/Sfx';
import { SOUND, type Role } from './sound';

export const REDIRECT_DOMAIN_SECONDS = TOTAL;
const END = local('end');

/** Effects on story beats, timed to the spoken words. Roles map to files in sound.ts. `fixed` is
    the channel's signature chime: it plays only when something broken is now right.
    Music never plays louder than the voice: the bed is pre-mixed and ducked by bed-build.py. */
const S = (at: number, role: Role, volume: number): SfxCue => [at, SOUND[role], volume];
const CUES: readonly SfxCue[] = [
    // Act A: the move most people make, then what breaks
    S(at(1) + 0.9, 'typing', 0.22),                   // typing mybrand.com
    S(word(1, 'most') - 0.3, 'pop', 0.3),             // "Available"
    S(word(2, 'buy') - 0.05, 'click', 0.4),           // Buy
    S(word(2, 'forwarding') + 0.2, 'click', 0.4),     // forwarding switched on
    S(word(2, 'type'), 'typing', 0.22),               // typing the old address
    S(word(2, 'land') - 0.1, 'success', 0.3),         // lands on the new site
    S(at(5) + 0.1, 'alert', 0.4),                     // Not secure
    // (one negative sound per run of problems: "Not secure" opens it, "Dead" closes it)
    S(word(9, 'Dead') - 0.05, 'error', 0.45),         // the printed QR and the old email are dead
    S(at(10) + 0.5, 'transition', 0.3),               // title (transition 1 of 2)
    // Act B: three concepts
    S(at(11) - 0.3, 'pop', 0.3),                      // concept cards
    S(word(12, '301') - 0.2, 'pop', 0.35),            // the 301 ticket
    S(word(14, 'follow') - 0.1, 'pop', 0.28),         // browsers follow it
    S(word(14, 'Google') - 0.1, 'pop', 0.28),         // Google updates its records
    S(word(17, 'changing') - 0.2, 'snap', 0.3),       // the records change
    S(at(18) + 0.05, 'pop', 0.3),                     // the padlock
    S(word(19, 'proves') - 0.15, 'pop', 0.28),        // proves who the site is
    S(word(19, 'keeps') - 0.15, 'pop', 0.28),         // keeps the connection private
    S(at(20) + 0.1, 'error', 0.4),                    // no certificate
    S(at(22) + 0.1, 'alert', 0.35),                   // Chrome's warning
    S(at(24), 'success', 0.35),                       // three concepts, ticked
    // Act C: the walkthrough
    S(at(25) - 0.3, 'transition', 0.3),               // into the dashboard (transition 2 of 2)
    S(word(28, 'Create'), 'click', 0.4),              // Create
    S(word(28, 'Domain') + 0.5, 'click', 0.4),        // Domain Redirect
    S(word(29, 'from') + 0.2, 'typing', 0.22),        // redirect from
    S(word(29, 'to') + 0.1, 'typing', 0.22),          // redirect to
    S(word(29, '301') - 0.1, 'click', 0.4),           // 301
    S(word(29, 'keep') + 0.2, 'click', 0.4),          // keep path
    S(at(30) + 0.3, 'click', 0.4),                    // Save
    S(at(30) + 0.45, 'success', 0.35),                // redirect saved
    S(at(31) + 1.2, 'click', 0.4),                    // Hostnames
    S(at(31) + 3.6, 'click', 0.4),                    // Connect DNS
    S(at(33) + 0.2, 'pop', 0.3),                      // quick tip
    S(word(35, 'updates') - 0.2, 'snap', 0.35),       // DNS check turns green
    S(word(35, 'issued') + 0.2, 'fixed', 0.55),       // the certificate is issued: HTTPS green
    // Act D: the test, the checks, the close
    S(at(37) + 1.2, 'typing', 0.22),                  // typing the old address
    S(at(39) + 0.9, 'rewind', 0.4),                   // time runs backwards
    S(at(40) + 0.9, 'pop', 0.3),                      // quick tip
    S(at(41) + 0.3, 'typing', 0.22),                  // typing in the private window
    S(word(41, 'there'), 'fixed', 0.5),               // padlock in the private window
    S(at(44) + 2.2, 'pop', 0.3),                      // check one
    S(at(45) + 2.2, 'pop', 0.3),                      // check two
    S(at(46) + 2.2, 'pop', 0.3),                      // check three
    S(at(47) + 0.3, 'fixed', 0.6),                    // all three green
    S(at(48) + 0.3, 'pop', 0.3),                      // tip one
    S(at(50), 'pop', 0.3),                            // tip two
    S(word(52, 'Now') + 0.3, 'fixed', 0.5),           // "Now it is."
    S(at(53) + 0.1, 'stinger', 0.25),                 // end card
];

export function RedirectDomain(props: RedirectDomainProps) {
    const { fps } = useVideoConfig();
    const seq = (key: Parameters<typeof sceneWindow>[0]) => {
        const [a, b] = sceneWindow(key);
        return { from: Math.round(a * fps), durationInFrames: Math.max(1, Math.round(b * fps) - Math.round(a * fps)) };
    };
    return (
        <AbsoluteFill style={{ background: '#0B1426', fontFamily: font.display, WebkitFontSmoothing: 'antialiased' }}>
            <Html5Audio src={staticFile('audio/redirect-domain-vo.mp3')} />
            {/* The music bed, already fitted, ducked under every word and level-checked (scripts/yt/bed-build.py). */}
            <Html5Audio src={staticFile('audio/redirect-domain-bed.mp3')} />
            {/* Leo asked for click and typing sounds on the on-screen UI actions, so those are part of the story here. */}
            <Sfx cues={CUES} budget={{ max: 48, reason: 'Leo asked for click and typing sounds on the UI actions (Buy, toggles, form fields, Save); one per action, no hover sounds.' }} />
            <Sequence {...seq('hook')} name="A · Hook"><HookScene {...props} /></Sequence>
            <Sequence {...seq('ideas')} name="B · Three concepts"><IdeasScene {...props} /></Sequence>
            <Sequence {...seq('walkthrough')} name="C · Walkthrough"><WalkthroughScene {...props} /></Sequence>
            <Sequence {...seq('test')} name="D · Test and checks"><TestScene {...props} /></Sequence>
            <Sequence {...seq('close')} name="D · Close"><CloseScene {...props} /></Sequence>
            <Sequence {...seq('end')} name="End card"><FixedEndCard lines={props.endLines} sub={props.endSub} cta={props.endCta} subAt={END.at(53) + 1.0} ctaAt={END.word(53, 'reach') - 0.1} qr={props.qr} /></Sequence>
        </AbsoluteFill>
    );
}
