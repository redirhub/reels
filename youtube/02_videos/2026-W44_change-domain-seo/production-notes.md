# W44 production notes: from key frames to film

**Status:** 2026-10-27, first cut. Composition `change-domain` (`src/remotion/reels/change-domain/`), built from the
approved canvas page `w44` (Review 2: "the frames look awesome, now it all falls down to execution") and `script.md`
v3. Length follows the voice (`voiceover/timings.json`): **402 s** (6:42), 60 fps.

Leo's brief for this pass: keep the script's tone emotionally sound and expressive; smooth animation with no lag;
no delay or pause in the watch time ("just like we learned before", W43); check every animation and sound while
building it, so the audit happens as the film is made.

## Voice

- **Narrator:** ElevenLabs "Emily" (`zHGX9VSXpW8cGSDRCqy0`), the W41/W43 voice, on **`eleven_v3`** this time, because
  the script's delivery tags (`[warm]`, `[amused]`, `[laughs softly]`, `[sighs]`, `[worried]`, `[delighted]`…) are
  performed only by v3. Settings: stability 0.0 ("Creative", the widest pitch range in a side-by-side test: 8.8
  semitones p10–p90 against 7.6 on "Natural"), similarity 0.75, seed 42. Generated on the paid account through
  Composio, so the narration is cleared for commercial use like W43's.
- **Same voice as W43?** Measured, not assumed: the v3 test take's long-term spectrum correlates 0.984 with W43's
  take of the same line, and "RedirHub" is pronounced the same way (Whisper hears both as "Read Air Hub").
- **14 takes plus 2 retakes** (`voiceover/chunks.json`, written from `script.md` by `voiceover/make_chunks.py`): one
  take per run of beats, so each scene's emotion carries through the take; URLs written the way she says them.
- **Every take was audited by ear-proxy before use** (`take_audit.py` + Whisper `small.en`, two independent
  recognisers): words heard vs the script, tags read aloud (none), pauses, pitch range, clipping. Two slips were
  heard by *both* recognisers and re-recorded as single-line retakes: "Map it" sounded like "nap it" (beat 24) and
  "Two rules" like "two results" (beat 56). Every other difference was a recogniser spelling ("home page",
  "40", "frostyfusion").
- **No dead air.** v3 reads slower than v2 (169 wpm articulation against 180 on W43) and leaves 0.5–0.9 s between
  sentences. Two new, general options in `vo-build.py` (`assembly.json`):
  - `tighten`: every *silent* gap longer than 0.36 s is cut to 0.3 s, taken from the middle so the breath stays. A
    cut is only made where the audio is at least 28 dB under her speech, so the performed laugh and sigh are never
    cut. The deliberate pauses are protected by name (the ellipses at 3, 12, 52, 60; the pauses before 8 and 32;
    the melt).
  - `tempo`: a 1.05 time-stretch of every take with Rubber Band (pitch and formants preserved).
  - Result: 7:03 → 6:42. A Whisper pass over the assembled track matches the script word for word (every
    remaining difference is spelling), so no cut clipped a word. The only pauses over 0.5 s left are her laugh, her
    sigh, sentence-end breaths between takes and the planned second of silence after "It starts to melt".
- **Air only where the picture needs it** (`assembly.json`): the title transition (18), one second after the melt
  (34, script-deltas #12; the rewind plays inside it), into the product (35), the pass chime (50), the sweet
  surprise (52), the second chime (61). The end card holds 3 s for YouTube's end screen.
- **Top octave:** AudioSR on every take, as on W43 (`voiceover/chunks-sr/`, committed so CI never needs it).

## Picture

Every scene is the approved key frame in motion; shared props (`shop.tsx`: both logos, the strawberry card, the
search page, the sites, the menus) and the product UI (`Product.tsx`) are drawn once, so they are identical
wherever they appear. W43's smoothness rules are built in (`kit.tsx`): every move is a sub-pixel transform on its
own layer; opacity runs on a smoothstep; state colours blend (`color-mix`); a changed word or number *rolls*
(`Roll`), never swaps in one frame; scene cuts lay the next room down first, then dissolve the content in one eased
phase; nothing moves by `left`/`top`/`width`. Nothing tilts (Leo, round 2).

### Where the film differs from the approved frames (and why)

| Frame | Change | Why |
|---|---|---|
| Pages → Flip | One continuous scene: the same tree, the room warms charcoal → Glow, the headline rolls "Google ranks pages. Not domains." → "Every address changes." | A cut between two identical trees would blink. |
| Migration → Preview | One continuous scene in one dashboard size (1460 × 660 at 1.1): the form switches mode on "Changed pages?", the eyebrow rolls to "CHANGED PAGES". Before it: "Step two: redirect every page." over beat 36, and the Links page → create chooser → form on "Links. Create. Website Migration." | Same as above; W43's lesson: step two is said over its own headline, the product rises on "Here's what that looks like". |
| Migration | The www pill and VO line are **cut** | Unconfirmed for a migration (open-questions UI-3); Kris can restore both. |
| SEO | "Search engine optimization" under "SEO:" during beat 6, and a "Five years of it" chip by the pill during beat 7 | Beats 5–7 run 14 s before the first rope; each line gets a picture. |
| Search | The card starts in slot 3 under two skeleton results and swaps to the top on "there they are" | "Rises into slot 1" needs somewhere to rise from. |
| Worry | On "Do it right" the three empty sockets turn teal and roll to "links / reviews / history"; the caption rolls to "Done right: not from zero." | The frame shows only the wrong way; beat 17 needed its picture. Hedged with the VO ("can carry"). |
| Shortcut, Melt, Sweet surprise, Everything | The headline starts as the beat's first idea and rolls to the frame's headline on its word ("Send everything home?" → "It looks perfect.", "Google notices too." → "The top spot starts to melt.", "Here's the sweet part." → "Even the old menus still work.", "Update everything you control." → "All of it says Frosty Bites now.") | Each headline lands on the line it answers; no screen shows a conclusion before she says it. |
| Melt → One to one | The card melts on "melt", holds in the second of silence, and the film's only time-reverse runs the drips back up just before the cut | The catch has to land before the fix. |
| Sweet surprise | The phone shows a scanning camera (a teal beam over the QR frame) until "lands", then the strawberry page; six sparkles | The scan is the moment; the frame shows only the end state. |
| Tell Google | The New site field starts as "Choose a site" and rolls to the new domain on "the new one" | A generic illustration (labelled), so a placeholder isn't product copy. |
| End card | A real QR, `redirhub.com/support` (as on W43), in place of the "Branded QR · link pending" slot; the Frosty Bites card docks under the headline from the search | A placeholder can't ship. Swap it for the video's branded link when Kris gives one. |

## Sound

- **Effects:** 18 cues in 402 s (budget 80), all W43's licensed one-shots copied into `public/audio/change-domain/`
  (licences in `docs/audio-licenses.md`): `transition` twice (title, product), `rewind` once, the signature `fixed`
  chime twice ("That's a pass", "Right where Frosty Fusion used to be"), `shimmer` on the rename morph, `sparkle`
  when the old menu lands, a soft `problem` tone twice (the history drops, the spot melts), clicks only on real
  presses (Create, Website Migration, the checker), pops on a few arrivals. None on the gag (her laugh is the sound),
  the wobble or the end card.
- **Music:** a generated pad (`music.json`, `"kind": "pad"`, C major, 402 s), ducked under every word by
  `bed-build.py`, which fails the build if the bed comes within 10 LU of her while she speaks.

## Audit

See the checklist at the end of this file (filled in after the render).
