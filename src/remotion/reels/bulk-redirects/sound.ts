/* Sound roles for W46 (w46-Sound): two whooshes, one fixed chime, two knocks, one low tone, one silence. Every cue is
   a role, not a file. transition, fixed and denied are W43's licensed one-shots, copied into this reel's own folder
   (licences in docs/audio-licenses.md). To swap a sound, change its line. */
import type { SfxSample } from '../../components/Sfx';

export type Role = 'transition' | 'fixed' | 'problem' | 'knock';

const own = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/bulk-redirects/${name}.wav`, seconds, onset });

export const SOUND: Record<Role, SfxSample> = {
    transition: own('transition', 1.0, 0.18), // a change of place: into the title, into the product (Leo, Pixabay)
    fixed: own('fixed', 0.98, 0.036),         // the signature chime, once: every padlock is lit (Mixkit 766)
    problem: own('denied', 0.48, 0.023),      // one soft low tone as the warning page lands (Leo, Pixabay)
    knock: own('knock', 0.55, 0.018),         // three knocks on a wooden door, twice: someone knocks (Mixkit 197)
};
