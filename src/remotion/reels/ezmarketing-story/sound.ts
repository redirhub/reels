/* The reel's sounds, by the sync sheet's library names. Cut with `prepare_track.py oneshot` into
   public/audio/ezmarketing-story/ from the originals in youtube/01_library/audio/sfx/ (licences in
   docs/audio-licenses.md). `onset`: seconds into the file where the attack is, so a cue lands on its
   on-screen event. */
import type { SfxSample } from '../../components/Sfx';

const s = (name: string, seconds: number, onset = 0): SfxSample => ({ name, src: `audio/ezmarketing-story/${name}.wav`, seconds, onset });

export const SOUND = {
    tap_soft: s('tap_soft', 0.25, 0.03),
    error_thunk: s('error_thunk', 0.5, 0.02),
    tick_soft: s('tick_soft', 0.147, 0.01),
    notif_pop: s('notif_pop', 0.3, 0.01),
    problem_tone: s('problem_tone', 0.75),
    swipe_line: s('swipe_line', 1.0),
    click_ui: s('click_ui', 0.184, 0.006),
    pop_glass: s('pop_glass', 0.45, 0.01),
    /** count_tick, repeated on the count's own ease-out and rising 5 semitones, ending on 201. */
    count_roll: s('count_roll', 2.3, 0.04),
    rewind_tape: s('rewind_tape', 1.0),
    fixed_chime: s('fixed_chime', 0.98, 0.03),
} as const;
