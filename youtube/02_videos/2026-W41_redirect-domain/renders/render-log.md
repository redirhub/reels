# Render log — 2026-W41 redirect-domain

Every render, partial or full, gets an entry: what was rendered, what the audit found, what was
fixed. Audit steps per the brief §7: contact sheet · text hold · color · sync · motion · audio ·
technical.

## R1 — style-frame pass 1 (stills, 2026-10-06)

- **Rendered:** 16 stills from the estimated timeline (beats 3, 5, 10, 13, 14, 19, 21, 29, 32, 35,
  39, 41, 47, 50, 52, 53), 1920×1080 PNG via `scripts/yt/stills.mjs`.
- **Text hold (automated):** `<OnScreenText>` threw on two captions:
  - beat 34 "Copy yours, not mine. The values are the ones your dashboard shows for your domain."
    held 4.89 s, needed 6.0 s → caption shortened to "Copy yours, not mine." (2.33 s needed).
  - beat 42 "Still the old site? DNS can take a few minutes. Try again." held 2.2 s, needed 5.0 s →
    beat lengthened to 4.2 s and caption shortened to "Still the old site? Give DNS a few minutes."
    (4.0 s needed). Script v3 updated to match.
- **Contact-sheet review (by eye, every frame):**
  - beat 5: the not-secure interstitial's buttons were clipped by the 420 px card → page compacted.
  - beats 13–14: the redirect arc did not draw inside the house metaphor: `RedirectLine` sized itself
    to a zero-height wrapper → the component now sizes to the composition. The 301 card overlapped
    the right house → houses fade to 15 % during the morph (one idea per screen).
  - beats 29–35: the docked domain pills and the step tag collided top-left → step tags centred.
- **Color:** only tokens in use (Night, teal, Signal Red, amber once in the house scene, blue in
  product UI, inks, glass). Product UI uses the dashboard's own greys (fidelity).
- **Safe areas:** nothing key below y = 950; end card's right half clear.
- Sync / motion / audio: n/a for stills.

## R2 — style-frame pass 2 (stills, 2026-10-06)

- Re-rendered all 16 after the fixes, plus beat 42.
- **Text hold:** one more catch: beat 43 "Three quick checks." held 1.51 s, needed 2.0 s → beat
  lengthened by 0.6 s.
- **Contact sheet:** rewind marker "◀◀" overlapped the twist caption → moved to the card's top-right.
  Closing tip's scaled ID card overlapped its caption (transform origin) → fixed. Everything else
  clean. Filed as `style-frames/*.jpg` (11 named) and `style-frames/more/*.jpg` (6).

## R3 — full silent animatic (2026-10-06)

- `npm run render -- redirect-domain` on the estimated timeline (no VO, no audio yet) to prove
  every frame of all 53 beats renders and passes the hold rule.
- **Result:** rendered clean, exit 0. `out/redirect-domain.mp4`: 357.06 s, 1920×1080, 30 fps,
  H.264 + AAC (silent track), 38 MB. No `<OnScreenText>` hold violation anywhere in the film.
- **Technical:** `blackdetect` found no black frames. `freezedetect` (4 s, -60 dB) reports ~15
  static holds of 4–8 s. Expected in a silent animatic (the narration carries those holds), but it
  is a note for Phase 3: every hold longer than ~4 s should carry one quiet motion (traffic dots
  on a line, a slow settle, a caption arriving) so the picture never reads as frozen.
- **Contact sheet** (1 frame / 5 s, two 6×6 sheets): reviewed; see the checkpoint report for the
  items carried into Phase 3.
- Not published to git (size). CI renders this commit and the branch's Vercel preview plays it
  under the **Rendered MP4** tab, about 10–20 minutes after the push.

## R4 — dashboard fidelity pass (stills, 2026-10-08)

- Retrieved the seven Product Facts screenshots (see production-notes §7) and redrew `Dash.tsx`
  to match. Re-rendered beats 26, 28, 29, 31, 32, 34, 35; replaced style frames 07 and 08 and the
  verifying frame; added the Links list, the chooser and the DNS split view to `style-frames/more/`.
- **Contact sheet of R3 (1 frame / 5 s):** two tiles looked empty (beats 20 and 22); stills at
  135 s and 155 s render correctly, so it was the sampler landing on a cut. The last 0.7 s of the
  film was black (end card ended before the composition did) → the end card now runs to the last
  frame. The docked pills collided with the centred step tag → the tag is centred in the free band
  between pills and rail. The shifted dashboard was cropped at the left edge during the DNS split →
  it now shifts less and shrinks 10 %.
- Hold rule: no violations in the re-rendered frames.

## R5 — first pass on the real voice (stills, 2026-10-08)

- Voiceover generated (Emily, 16 chunks, 299 s of speech, 159 wpm), word-aligned with Vosk and
  cut into beats by `scripts/yt/vo-build.py`; `timeline.ts` now reads `voiceover/timings.json`.
  Film 325.7 s → 326 s (whole seconds, the end card runs to the last frame).
- **Text hold (automated, one still per beat, 53 stills):** three captions failed on the real
  timing and were fixed where the cause was:
  - beat 11 "Three ideas. Then we do it." 2.82 s < 3.0 s → 0.3 s more air after the line
    (`assembly.json`).
  - beat 16 "The entries are called records." 2.0 s < 2.67 s → the caption is now pinned to the
    spoken word ("Those…") and lingers 0.8 s into beat 17, which is still about records.
  - beat 43 "Three quick checks." 1.55 s < 2.0 s → 0.5 s more air after the line.
  - beat 51 "Forwarding on. Old link opens. Looks done." 3.30 s < 3.33 s → pinned to "Forwarding",
    runs 0.4 s into beat 52; "Now it is." then starts on its word (was a guessed +0.9 s and fell
    to 1.45 s).
- **Sync:** twelve visual moments that the storyboard ties to a word (the card lands on "land",
  note → 301 on "301", Google on "Google", the lookup on "looks", the swap on "changing", the
  dispenser on "hands", the handshake on "shows", DNS green on "updates", HTTPS green on "issued",
  the private-window reveal on "there") now use `local(scene).word(n, w)` instead of offsets
  guessed from the 155 wpm estimate.
- A full silent render was started and stopped once the audio was ready: superseded by R6.
