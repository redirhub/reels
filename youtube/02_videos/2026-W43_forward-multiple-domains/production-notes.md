# W43 production notes: from key frames to film

**Status:** 2026-10-15, round 3 (smooth motion; round 2 was Leo's review of the first cut, below). Composition `forward-domains`
(`src/remotion/reels/forward-domains/`), built from the approved canvas page `w43` (Leo's edits synced) and `script.md` v3.
Length follows the voice (`timings.json`), currently **290 s** (was 305 s).

## Round 2: Leo's review of the first cut (Oct 15)

| Note | What changed |
|---|---|
| Pauses (0:15–0:20, nothing until 0:56, 1:49–1:57, 2:00): "every second counts" | Most were the 11 silent stand-ins. All 17 takes are now real, regenerated on the paid ElevenLabs account (connected through Composio; same voice, model and settings, seed 42), which also clears them for commercial use (see Voice). The air I had added between beats is cut from up to 1.3 s to 0.15–0.5 s, kept only where the picture needs it: the title transition, "it looks perfect", the rewind, the padlock, the pass chime. The lead-in drops from 0.6 s to 0.35 s and the end-screen hold from 4 s to 3 s. |
| Gradients look pixelated | Two causes, both fixed. (1) The encode: 16:9 renders now capture frames losslessly (PNG, not JPEG) and encode at CRF 15 on x264 `slow` (`scripts/render.mjs`). (2) The gradients themselves: every room carries a static, zero-mean overlay dither (`Dither` in `kit.tsx`), so 8-bit steps can't form bands. A contrast-boosted crop of the title's sweep went from blocky bands to a smooth gradient. |
| 0:48: a card appears and disappears at once | The site card arrived on "book" and faded on "Pointing" half a second later. Now the site lands on "lives", the address book on "DNS", the other four names on "five domains", and nothing leaves the scene. |
| 1:30 jumps straight to "Three steps" | Beat 19 now opens with what the steps do: "Here's how to set that up in RedirHub, with HTTPS: three steps, and one test." (worded so it doesn't repeat the title line at beat 8). On screen: eyebrow "HERE'S HOW", the goal line "Set up way two in RedirHub, with HTTPS.", then the headline and cards on "three". |
| "Check the video yourself for hidden slops" | Every beat was reviewed as a still against the real voice, and the whole cut was run through `scripts/qa/flash_check.py`, which flags anything that appears and disappears within a second (it catches the 0:48 slip on the old cut). Fixed: an empty lab with one pill while she says "Now test it" (now the line itself, until "16" takes its place); the honest note's empty left half (the cards now read left to right in the order she says them); a static Hostnames list for 8 s (each "Not connected" takes an amber dot as she says the domain has to point at RedirHub); an empty Links panel at step two (step two is said over its own headline, and the product rises on "Here's what that looks like"). |
| 2:19: the sound after "Create redirect" | The generated success sound is replaced by Leo's "You find a treasure". The other generated effects (HTTPS issued, the signature chime, typing) are replaced too, with Mixkit sounds chosen to match Leo's set: warm (brightness centre 1.3–1.8 kHz), tonal, short. |
| Music | Kept: the calm pad Leo likes, moved from D major to C major so the tonal effects (treasure: C, F, G; chime: C, E; HTTPS: C, G) sit in key. |

## Round 3: smooth motion (Leo, Oct 15: "some animations stutter or lag")

Measured, not guessed: `scripts/qa/stutter_check.py` decodes the render, splits it into tiles, and flags frames where
motion freezes for a frame (hold) or skips ahead (jump). On the round-2 cut it found 94 events; the first 15 s alone
had 19, almost all on the floating domain pills. The causes, and the fixes:

| Cause | Fix |
|---|---|
| Things moved by layout properties (margin, left/top, width/height): Chrome snaps layout to whole pixels, so slow motion stepped | Every motion is a transform now: the pills' float, the end card's pills folding into the headline, the checker's flying address, the eyebrow dash and progress bars (scaleX), the typo underline (fades instead of thickening). The dashboard window's list-to-form growth is a scaled panel plus a clip instead of a resizing box |
| Moving text was re-rasterized each frame and snapped to the pixel grid, so the slow tail of every ease moved in 1-px steps on alternate frames (measured 0.47, 0.00, 0.54, 0.01) | Every animated element gets its own compositor layer and a true sub-pixel transform (`SMOOTH` in `kit.tsx`: `translate3d` plus an invisible 0.02° turn). The tail now decays continuously; text at rest measured as sharp as before |
| The rooms' background drift moved about 0.05 px a frame, so it jumped a pixel every half second | Same sub-pixel transform on the texture |
| Scene cuts moved in two steps: the new room, then the content snapping on at full speed | One continuous dissolve: cover and content both ease in and out and overlap |
| The window morph crossfaded through a blank frame and switched its colour in one frame; the flying address swapped for the input text in one frame | True crossfades: list and form overlap, the colour blends, the address hands over to the text over 0.15 s |
| 30 fps: every move advanced in coarse steps | The video renders at **60 fps** (YouTube plays 1080p60). Everything is timed in seconds, so nothing else changed |
| Cuts still dipped halfway: the room's ease came to rest before the content's began | Room and content run on **one** eased phase (`SceneFade`): the room is laid in its first 60 %, the content over its last 75 %, so the motion never stops |
| Colours flipped in one frame at 50 % (typo letters, chooser cards, save button, column headers, the flying address, the end card's rings, the HTTPS bar) | Every state colour blends (`mix` in `kit.tsx`, CSS `color-mix`) |
| The form's "What happens" rows popped in at full height and shoved the panel below down a row | All three rows are laid out from the start; the box opens by a clip, and its bottom edge and the note below move on transforms. (A first try grew each row's height: layout snaps to whole pixels, so the slow ends of the ease stepped and the checker caught one-frame holds at 112, 119 and 127 s) |
| Entrances started at full speed (opacity on an ease-out jumps a third of the way on frame one): every slide-in and pop, the Connect DNS dialog and its scrim, the browser cards, the address bar, the padlock, the "16", the grid pills, the amber ring, the renew card | Opacity runs on a smoothstep; position keeps its ease-out |
| Back-to-back moves: the chooser faded, stopped, then the window grew; the rewind and the address-bar push started at full speed | The moves overlap, and both start from rest (ease in and out) |
| Discrete values: "n / 16" and the padlock's domain swapped in one frame | Both roll: the old value rolls out as the new one rolls in. "/16" glides on a transform when 8 becomes 12 (the digits sit in a fixed two-digit slot) |

Result on the first 15 s: 19 events at 30 fps → 2 at 60 fps, both the pixel snapping fixed above. On the six windows
with the most findings in the first 60 fps cut (cuts, the rewind, the window morph, the counter), 32 findings → 15, and
the 15 left are all one grey level a frame or less: a slow fade over a flat colour, which 8-bit video can only step
1, 0, 1, 0. That's invisible, but it reads as a "hold" to the checker, so `stutter_check.py` now prints each finding's
peak and drops those under 1.5 grey levels a frame (`--min-peak 0` shows them all). The one real jump left (the
counter's "/16" shifting when 8 became 12) is fixed above.

**Final cut (60 fps, 290.05 s):** `stutter_check.py` 68 findings → 33, and above the 1.5-level threshold 9, every one a
flat-colour fade or a crossfade stepping one or two grey levels a frame (peaks ≤ 3.5). Each was checked frame by
frame against lossless PNG captures: none is a frozen or skipped frame of moving content. `flash_check.py` lists the
same 18 dissolves as before (all cuts or deliberate hand-overs, none a card that flashes).

## Voice

- **Narrator:** ElevenLabs "Emily" (`zHGX9VSXpW8cGSDRCqy0`), `eleven_multilingual_v2`, the same voice as W41.
  17 takes (`voiceover/chunks.json`), one per run of beats, URLs written the way a person says them.
- **Quality, the "phone call" ceiling.** Every Emily take, on every model (v2, v3, v4), has nothing above about 8 kHz.
  W41 put an octave back with harmonic extension. W43 goes further: `scripts/yt/voice_sr.py` runs **AudioSR**
  (latent-diffusion super-resolution, "speech" model) on each take and keeps only what it generates above 7.5 kHz.
  Her own audio below 7.5 kHz is untouched, level-matched to her 6–7.4 kHz band and gated to her voice, so pauses
  stay silent. The words, pitch and timing are still the take; AudioSR only adds air and consonant detail.
  On the test take, 8–10 kHz went from −63 dB to −24.5 dB, with zero lag against the original.
  The restored takes are committed (`voiceover/chunks-sr/`), so CI never needs AudioSR.
  `vo-build.py` prefers them, then runs the W41 studio chain (`voice_enhance.py --no-bwe`).
- **All 17 takes are paid-plan generations** (round 2). The first cut's six free-plan takes and eleven stand-ins are
  gone: every take was regenerated on the paid account (≈3,900 characters), so the whole narration is cleared for
  commercial use. Pace check: no pause inside any take is over 0.5 s; the only longer gaps are the deliberate ones
  listed in `assembly.json`. To redo a take: replace `voiceover/chunks/<id>.mp3`, remove its entry from
  `asr-vosk.json`, then `voice_sr.py` → `vo-build.py` → `bed-build.py`; every scene reads beat and word times, so the
  picture re-times itself.

## Sound

- **Leo's five Pixabay effects** are in the library (`youtube/01_library/audio/sfx/`). Two are new
  (pop-click, ui-error-denied), and three were already there byte for byte (balloon burst, transition, swoosh).
  Cut with `prepare_track.py oneshot` into `public/audio/forward-domains/`. Licences are in `docs/audio-licenses.md`.
- **No generated effects** since round 2. Leo's treasure sound marks the redirect being created. Three Mixkit sounds,
  profiled against Leo's set (length, attack, brightness, pitch), cover the rest: "Software interface start" (HTTPS
  issued), "Alert quick chime" (the signature chime) and two stretches of "Typing on a laptop keyboard". Licences
  and cut points are in `docs/audio-licenses.md`.
- **Cue sheet** (`ForwardDomains.tsx`, 33 cues in 293 s, under the default budget of 58):
  - one sound per story beat;
  - `transition` twice (title, into the product);
  - `rewind` once (the film's only time-reverse);
  - `fixed`, the signature chime, twice ("That's a pass", "One website");
  - clicks only on real product actions (Create, Domain Redirect, Create redirect, Connect DNS, Check Redirect), as Leo asked on W41;
  - typing on the two fields.
- **Music:** a generated pad (`music.json`, `"kind": "pad"`, C major since round 2). `bed-build.py` ducks it under every word and fails the
  build if it ever comes within 10 LU of her while she speaks.

## Where the film differs from the approved frames (and why)

| Frame | Change | Why |
|---|---|---|
| Pointer (beat 11) | The other four names join the `mybrand.com` pill on "five domains". | The frame held one pill for 6.6 s while she says "pointing five domains". |
| Perfect → Copies | All five cards drain to grey when the room drops; `mybrand.net` comes back to white only when the magnifier lands on it (beat 15). | If it stayed white from beat 14, it would give away Google's pick a beat early. |
| DomainRedirect | 301 and Keep the path are selected from the first frame and only get a ring as she names them. Fields start empty, with no placeholder text. | Both are the prototype's defaults (open-questions UI-2). Animating a click would show the product doing something it doesn't do. A placeholder would be invented copy. |
| DomainRedirect | The second "What happens" hop is `mybrand.net/pricing → mybrand.com/pricing`. | It is the example she says (beat 26). The radio's own hint keeps the product's `/about`. |
| LinksList, ConnectDNS | The Links and Hostnames counts in the sidebar count up with the rows, ending at 4 (the frame said Hostnames 5). | Four redirects make four hostnames; 5 didn't match the four rows on screen. |
| ConnectDNS | A "Copy yours" card on beat 35. | The VO asks for it; the frame had no picture for that line. |
| HttpsIssued | The three rows tick on her words; the "Connected" chip appears with the third tick; the padlock pill steps through the four domains on "every domain". | The frame shows the end state only. The product's in-progress wording isn't captured, so no interim chip is shown. |
| AllGreen | "16 / 16" counts up as each row turns. It stays at Leo's 92 px, weight 500, but in Plus Jakarta Sans, not Open Sans. A "Not passing yet?" card sits on beat 45. | Brand fonts only. Beat 45 was an 8.7 s hold with no picture for its advice. |
| Honest | The grey card lands first ("won't lift your rankings"), then the teal one ("It catches people"). | Each card lands as she says it; the VO names the grey card first. |
| EndCard | A real QR, `redirhub.com/support`, in place of the "Branded QR · link pending" slot. | A placeholder can't ship. `/support` works (200, 2026-10-14) and sits beside "Stuck? Reach out." Its label stays readable at 200 px; `redirhub.com/redirect-checker` shrank to about 10 px. Swap it for the video's branded link when one exists. |
| All cuts | Each scene lays its room down first, then fades its content in. | Plain crossfades double-exposed two layouts for 0.3 s. |

## Audit (what was checked, and how)

- Stills at every beat's settled state and on both sides of every cut (`scripts/yt/stills.mjs`), reviewed as
  contact sheets. Fixed:
  - dark text on dark rooms;
  - the steps staircase being lost;
  - an empty "What happens" box;
  - a ghost-pill artifact;
  - the double exposures at cuts;
  - a partial rewind;
  - SMIL traffic dots that ran on the wall clock (now a pure function of time).
- End card: the QR decodes to `https://redirhub.com/support`, and nothing on the frame goes below y 950.
- `npm run typecheck` and `npm run build` pass. The full render (`out/forward-domains.mp4`, round 3) passes `check_reel.py`:
  - format: 1920×1080, 60 fps, h264/aac, 290.05 s;
  - the QR at 287 s scans to `https://redirhub.com/support`;
  - loudness −14.9 LUFS integrated, true peak −1.1 dBTP (all 17 takes real since round 2).
- Voice restoration: every restored take keeps its original below 7 kHz (correlation ≥ 0.9999) and falls off
  naturally above it (6–7.4 kHz → 8–10 kHz about −4 dB → 10–14 kHz about −10 dB). The seams between AudioSR's 10 s
  pieces show no level steps.
