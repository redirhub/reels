/* Sound roles for W44. Every cue is a role, not a file. All are W43's licensed one-shots (copied byte for byte
   from public/audio/forward-domains/ into public/audio/change-domain/ so this reel's renders stay its own;
   originals in youtube/01_library/audio/sfx/, licences in docs/audio-licenses.md). The tonal ones sit in C,
   the key of the pad. To swap a sound, change its line. */
import type { SfxSample } from '../../components/Sfx';

export type Role = 'pop' | 'click' | 'problem' | 'transition' | 'rewind' | 'shimmer' | 'sparkle' | 'fixed';

const own = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/change-domain/${name}.wav`, seconds, onset });

export const SOUND: Record<Role, SfxSample> = {
    pop: own('pop', 0.34, 0.03),               // a card, row or tick arriving (Leo, Pixabay)
    click: own('click', 0.184, 0.015),         // a real button press in the product (Leo, Pixabay)
    problem: own('denied', 0.48, 0.023),       // a soft problem tone: the history drops, the spot melts (Leo, Pixabay)
    transition: own('transition', 1.0, 0.18),  // a change of place; twice in the film (Leo, Pixabay)
    rewind: own('rewind', 1.0, 0.304),         // the time-reverse, once (Leo, Pixabay)
    shimmer: own('secure', 1.4, 0.02),         // the rename morph: the shop smiles (Mixkit 2574, C and G)
    sparkle: own('treasure', 1.9, 0.1),        // the sweet surprise lands (Leo's "You find a treasure", C, F, G)
    fixed: own('fixed', 0.98, 0.036),          // signature chime: something broken is now right; twice (Mixkit 766)
};
