/* Sound roles for W43. Every cue is a role, not a file. Leo's Pixabay picks are cut with
   `scripts/audio/prepare_track.py oneshot` into public/audio/forward-domains/ (originals in
   youtube/01_library/audio/sfx/, licences in docs/audio-licenses.md); the rest are generated
   (scripts/audio/sfx.py) and match their tone: short, soft, no tails. To swap a sound, change its line. */
import type { SfxName, SfxSample } from '../../components/Sfx';

export type Role = 'pop' | 'burst' | 'click' | 'typing' | 'denied' | 'transition' | 'rewind' | 'success' | 'fixed' | 'stinger';

const own = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/forward-domains/${name}.wav`, seconds, onset });

export const SOUND: Record<Role, SfxName | SfxSample> = {
    pop: own('pop', 0.34, 0.03),               // a pill, card, row or tick arriving (Leo, 2026-10-14)
    burst: own('burst', 0.25, 0.026),          // a stamp landing (COPY), a tag snapping on
    click: own('click', 0.184, 0.015),         // a real button press in the product
    typing: 'typing',                          // a field filling (generated)
    denied: own('denied', 0.48, 0.023),        // a problem lands (Leo, 2026-10-14)
    transition: own('transition', 1.0, 0.18),  // a change of place; twice in the film
    rewind: own('rewind', 1.0, 0.304),         // the time-reverse, once
    success: 'success',                        // a step is done (generated)
    fixed: 'fixed',                            // signature chime: something broken is now right (generated); twice
    stinger: 'stinger',                        // unused unless the end card needs it
};
