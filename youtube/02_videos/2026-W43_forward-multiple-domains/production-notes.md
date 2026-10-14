# W43 production notes: from key frames to film

**Status:** 2026-10-14. Composition `forward-domains` (`src/remotion/reels/forward-domains/`), built from the
approved canvas page `w43` (Leo's edits synced) and `script.md` v2. Length follows the voice (`timings.json`),
currently **305 s**.

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
- **Blocked: 11 of 17 takes.** ElevenLabs disabled the account's free tier ("unusual activity… upgrade to a paid
  subscription"), and its 10,000-credit quota is spent. Six takes are real (c01, c05, c06, c07, c08, c12). The other
  eleven are silent stand-ins at her measured pace (`scripts/yt/vo-placeholder.py`), so the picture is timed and
  audited now. When the takes come in, run: `voice_sr.py` → `vo-placeholder.py` (drops the stand-ins) →
  `vo-build.py` → `bed-build.py`. Every scene reads beat and word times, so the picture re-times itself. A paid plan is also
  what makes the narration cleared for commercial use; W41 flagged this as well.

## Sound

- **Leo's five Pixabay effects** are in the library (`youtube/01_library/audio/sfx/`). Two are new
  (pop-click, ui-error-denied), and three were already there byte for byte (balloon burst, transition, swoosh).
  Cut with `prepare_track.py oneshot` into `public/audio/forward-domains/`. Licences are in `docs/audio-licenses.md`.
- **Generated effects** (`typing`, `success`, `fixed`) are short and dry like Leo's set, with no tails or reverb.
- **Cue sheet** (`ForwardDomains.tsx`, 33 cues in 305 s, under the default budget of 60):
  - one sound per story beat;
  - `transition` twice (title, into the product);
  - `rewind` once (the film's only time-reverse);
  - `fixed`, the signature chime, twice ("That's a pass", "One website");
  - clicks only on real product actions (Create, Domain Redirect, Create redirect, Connect DNS, Check Redirect), as Leo asked on W41;
  - typing on the two fields.
- **Music:** a generated pad (`music.json`, `"kind": "pad"`). `bed-build.py` ducks it under every word and fails the
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
- `npm run typecheck`, `npm run build`, full render and `scripts/qa/check_reel.py` before each push (results are in the PR).
