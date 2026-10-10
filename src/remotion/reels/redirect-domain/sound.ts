/* Sound roles for this video. Every cue in the sheet is a role, not a file. The click, the pop, the
   transition and the rewind are Leo's Pixabay picks, cut with `scripts/audio/prepare_track.py oneshot`
   into public/audio/redirect-domain/ (originals in youtube/01_library/audio/sfx/, licences in
   docs/audio-licenses.md). Typing is generated: the "typing on a laptop" file that came with them is
   the ElevenLabs free-plan generation, not cleared for commercial use. The rest are generated
   (scripts/audio/sfx.py). To swap a sound, change its line here. */
import type { SfxName, SfxSample } from '../../components/Sfx';

export type Role = 'click' | 'typing' | 'pop' | 'transition' | 'error' | 'alert'
    | 'success' | 'snap' | 'fixed' | 'rewind' | 'stinger';

const own = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/redirect-domain/${name}.wav`, seconds, onset });

export const SOUND: Record<Role, SfxName | SfxSample> = {
    click: own('click', 0.184, 0.014),          // a real button press (Buy, toggles, Create, Save…)
    typing: 'typing',                           // a field filling (generated)
    pop: own('pop', 0.25, 0.03),                // a card or chip arriving
    transition: own('transition', 1.0, 0.33),   // a change of place; used twice in the film, no more
    rewind: own('rewind', 1.0, 0.44),           // the time-reverse, once
    error: 'denied',                            // a problem lands (generated, soft)
    alert: 'alert',                             // a security warning (generated)
    success: 'success',                         // a step is done (generated)
    snap: 'snap',                               // something locks into place (generated)
    fixed: 'fixed',                             // signature: something broken is now right (generated)
    stinger: 'stinger',                         // the end card (generated)
};
