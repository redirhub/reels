# Final report — W41 "How to Redirect a Domain to Another Domain (With HTTPS That Actually Works)"

_Status: see §1. Render numbers in `renders/render-log.md`; packaging in `packaging.md`._

## 1. What was made

- **The film:** 5:26, 1920×1080, 30 fps, H.264 + AAC 48 kHz. Script v3 (53 beats, 794 words),
  narrated by Emily (ElevenLabs), built in Remotion from shared channel components, timed from
  the voice's word timestamps. Renders by CI on every push to `out/redirect-domain.mp4` and plays
  on the branch's Vercel preview.
- **The system around it** (reusable for every video on the channel):
  `script.md → script.ts → voiceover chunks → timings.json → scenes that read beat and word times`,
  with the text-hold rule enforced in code, a one-command audit (`scripts/yt/audit-video.sh`),
  captions from the word timestamps, thumbnails from an HTML template, and a sound set generated
  in-repo (pad bed, signature "fixed" chime).
- **Packaging:** title A/B, description with 12 chapters, UTM-tagged branded-link placeholder,
  `captions.srt` (118 cues), pinned comment, thumbnails A/B with 168×94 proofs.
- **Governance:** `youtube/rule-v0.3-proposal.md` (13 rule proposals, changelog, open items),
  `01_library/audio/audio-library.md`, `production-notes.md`, `storyboard.md`, `script-craft-notes.md`.

## 2. Why it is the way it is

RENDER_SECTION

## 3. Decisions I'm proudest of

1. **The script dictates the picture, mechanically.** Scenes never contain seconds. They ask for
   beat 35's start or the word "issued". When the voice arrived, the whole film re-timed itself
   and only five captions needed a decision, all caught by the hold rule at render time.
2. **Metaphors before mechanisms, and one morph per idea.** The note on the door becomes the 301
   card on the word "301"; the ID card becomes the certificate; the address book becomes the
   records table. Viewers meet each term as an image before they meet it as a word.
3. **The twist is honest about the viewer's own test.** "Your redirect might be fine. It's your
   test that's wrong" is the line that earns the private-window tip, and the only time-reverse in
   the film is spent on it.
4. **Restraint in sound.** Sixteen cues in five and a half minutes, no UI sounds, a pad instead of
   a beat, and one chime that is only ever heard when something broken is now right.
5. **Fairness as a style choice.** Registrars "some do, some don't"; Chrome "is rolling out";
   "copy yours, not mine" on every real value. The film never needs the viewer to distrust anyone.

## 4. Compromises and what they cost

- **Voiceover licence.** The ElevenLabs workspace behaves like the Free tier. The narration is
  real and timed, but it must be regenerated on a paid plan before publishing (same 16 chunk
  texts, same voice; `vo-build.py` re-times the film). Cost: one more render and audit.
- **Word timestamps from Vosk, not Scribe.** Scribe refused the probe transcription on quota;
  a local recogniser matched 97 % of words directly and the rest were interpolated. Good enough
  for beat timing and captions (±50 ms on matched words); re-run with Scribe when credits exist.
- **No Pixabay sounds.** Downloads need a browser session; every effect is generated in-repo
  instead. No certificates to file, nothing to clear with Content ID.
- **Voice settings.** The MCP tool exposes no stability/similarity/speed; the voice's defaults
  are what you hear. Emily's natural pace on real sentences (159 wpm) made that moot this time.
- **Brand files not read.** rule.md v0.2, the brief v1, the Brand Guidelines and TH-A were on
  Kris's machine. I worked from the brief's summary and the repo's tokens; anything in those
  files that contradicts a choice here wins.

## 5. Open items for Kris

| Item | Where |
|---|---|
| Approve Signal Red `#E5484D` and Night `#0B1426` as channel tokens | `tokens.ts` `yt.*`, rule 9 |
| Links → Create → Domain Redirect UI shown externally (Notion says Approved 2026-10-06; confirm it covers video) | storyboard accuracy table |
| Secondary font: none; Inter only inside recreated product UI | rule 10 |
| The Chrome line: "is rolling out a warning" (154 stable 2026-09-22, default not confirmed) | production-notes §5 |
| Real anycast IP `3.33.236.10` on screen with "copy yours, not mine" | production-notes §6, rule 4 |
| **Voiceover licence** (paid plan, then regenerate) and the pronunciation of "RedirHub" | production-notes §3, rule 5 |
| Branded link for the description/QR (`redirhub.com/qr` placeholder with UTM) | `packaging.md` |

## 6. What to reuse next time

- `scripts/yt/beats-from-script.py`, `vo-build.py`, `srt-from-timings.py`, `stills.mjs`,
  `thumbnail.mjs`, `audit-video.sh`; `assembly.json` as the one place to add air.
- Components: `OnScreenText` (hold rule), `UrlPill`, `RedirectLine`, `GlassCard`, `BrowserCard`,
  `Padlock`, `IdCard`, `ChecklistBadge`, `FixedEndCard`; `Dash.tsx` for product UI.
- Sound: `music.json` `"kind": "pad"`, `fixed` and `rewind` effects, the cue discipline in
  `RedirectDomain.tsx`.
- Process: generate the voice first, in chunks; render stills per beat before the full render;
  read the contact sheet; log every render.

REVIEW_SECTION
