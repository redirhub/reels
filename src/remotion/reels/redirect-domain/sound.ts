/* Sound roles for this video. Every effect in the cue sheet is a role, not a file, so a licensed
   sound from Leo's RedirHub library can replace the generated one in one line:

     error: { name: 'error', src: 'audio/library/sfx/<file>.mp3', seconds: 0.8 },   // an SfxSample

   (put the file in public/audio/library/sfx/ and log its licence in docs/audio-licenses.md).
   Until then each role plays the generated effect named here (scripts/audio/sfx.py). */
import type { SfxName, SfxSample } from '../../components/Sfx';

export type Role = 'pop' | 'whoosh' | 'swish' | 'error' | 'alert' | 'success' | 'snap' | 'fixed' | 'rewind' | 'stinger';

export const SOUND: Record<Role, SfxName | SfxSample> = {
    pop: 'pop',          // something arrives on screen (cards, chips)
    whoosh: 'whoosh',    // a transition between places
    swish: 'swish_r',    // a quick sweep (title, panel)
    error: 'denied',     // a problem lands; soft, replaced the old square-wave buzz
    alert: 'alert',      // a security warning
    success: 'success',  // a step is done
    snap: 'snap',        // something locks into place
    fixed: 'fixed',      // signature: something broken is now right
    rewind: 'rewind',    // the time-reverse, once
    stinger: 'stinger',  // the end card
};
