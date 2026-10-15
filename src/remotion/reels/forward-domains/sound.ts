/* Sound roles for W43. Every cue is a role, not a file. All are licensed one-shots cut with
   `scripts/audio/prepare_track.py oneshot` into public/audio/forward-domains/ (originals in
   youtube/01_library/audio/sfx/, licences in docs/audio-licenses.md): Leo's picks first, then Mixkit
   sounds chosen to match them (short, warm, tonal; the tonal ones sit in C, the key of the pad).
   No generated effects: Leo found them below studio level (Oct 15). To swap a sound, change its line. */
import type { SfxSample } from '../../components/Sfx';

export type Role = 'pop' | 'burst' | 'click' | 'typeShort' | 'typeLong' | 'denied' | 'transition' | 'rewind' | 'treasure' | 'secure' | 'fixed';

const own = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/forward-domains/${name}.wav`, seconds, onset });

export const SOUND: Record<Role, SfxSample> = {
    pop: own('pop', 0.34, 0.03),               // a pill, card, row or tick arriving (Leo, Pixabay)
    burst: own('burst', 0.25, 0.026),          // a stamp landing (COPY), "16" slamming in (Leo, Pixabay)
    click: own('click', 0.184, 0.015),         // a real button press in the product (Leo, Pixabay)
    typeShort: own('typing-a', 0.68, 0.039),   // a short field filling (Mixkit 2531)
    typeLong: own('typing-b', 1.17, 0.046),    // a longer field filling (Mixkit 2531, another stretch)
    denied: own('denied', 0.48, 0.023),        // a problem lands (Leo, Pixabay)
    transition: own('transition', 1.0, 0.18),  // a change of place; twice in the film (Leo, Pixabay)
    rewind: own('rewind', 1.0, 0.304),         // the time-reverse, once (Leo, Pixabay)
    treasure: own('treasure', 1.9, 0.1),       // the redirect is created: the first row lands (Leo, Oct 15)
    secure: own('secure', 1.4, 0.02),          // HTTPS issued: the room floods (Mixkit 2574)
    fixed: own('fixed', 0.98, 0.036),          // signature chime: something broken is now right; twice (Mixkit 766)
};
