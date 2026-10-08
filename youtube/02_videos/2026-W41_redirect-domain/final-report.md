# Final report — W41 "How to Redirect a Domain to Another Domain (With HTTPS That Actually Works)"

_Status: see §1. Render numbers in `renders/render-log.md`; packaging in `packaging.md`._

## 0. Revision 2 (Leo's notes, 2026-10-08)

Final cut: **5:17**, 1920×1080, 30 fps, H.264 + AAC 48 kHz, −14.9 LUFS, −2.3 dBTP, no black
frames, QR decodes. What changed is listed note by note in `renders/render-log.md` ("Revision 2"
and the second review that follows it). In short:

- **Voice:** the narrator's takes stop at 8 kHz (the voice itself, every model gives the same
  ceiling), which is the "phone call" sound. `scripts/yt/voice_enhance.py` now restores the
  top octave and removes the boxy mids on every build. Not verified by ear in this session.
- **Music:** Leo's sound folder lives on his computer, which this cloud session cannot reach. The
  bed builder is ready for it: drop the files into `youtube/01_library/audio/music/` (effects into
  `public/audio/library/sfx/`), set `bed.json` / `sound.ts`, rebuild. It ducks the music under
  every word and refuses to build if the music gets within 10 LU of the voice while she speaks.
  Until then the generated pad plays, about 20 LU under her.
- **Script:** "three concepts", concept one in 12 s with the 301 ticket and no house, no menu
  example anywhere (generic /pricing), no "full disclosure", a closing call to action to the
  description and to reach out. Ten new lines, spliced by beat; speech recognition over the
  final voice track finds none of the removed words.
- **Picture:** the opening acts out buying a domain and switching on forwarding in a registrar
  tab; no icon rail; records highlighted with an arrow; padlock never on the book; tips and
  panels solid and readable; every slip from two independent reviews fixed or logged.

## 1. What was made

- **The film:** 5:25, 1920×1080, 30 fps, H.264 + AAC 48 kHz. Script v3 (53 beats, 794 words),
  narrated by Emily (ElevenLabs), built in Remotion from shared channel components, timed from
  the voice's word timestamps. Renders by CI on every push to `out/redirect-domain.mp4` and plays
  on the branch's Vercel preview.
- **The system around it** (reusable for every video on the channel):
  `script.md → script.ts → voiceover chunks → timings.json → scenes that read beat and word times`,
  with the text-hold rule enforced in code, a one-command audit (`scripts/yt/audit-video.sh`),
  captions from the word timestamps, thumbnails from an HTML template, and a sound set generated
  in-repo (pad bed, signature "fixed" chime).
- **Packaging:** title A/B, description with 13 chapters, UTM-tagged branded-link placeholder,
  `captions.srt` (118 cues), pinned comment, thumbnails A/B with 168×94 proofs.
- **Governance:** `youtube/rule-v0.3-proposal.md` (13 rule proposals, changelog, open items),
  `01_library/audio/audio-library.md`, `production-notes.md`, `storyboard.md`, `script-craft-notes.md`.

## 2. Why it is the way it is

The brief asked for a tutorial that teaches before it demonstrates, in the voice of a transparent
friend, with the product shown exactly as it is. So the film spends its first 2:30 on three
metaphors (note on the door, address book, ID card), each introduced as an object before its
term, then spends 1:30 inside a recreated dashboard doing the two steps, and ends on the test
most people get wrong. The script dictates the picture: every scene reads beat and word times
from the voice, so the voice could be re-taken (chunk c09 was) without touching a scene.

**Final render R9** (`out/redirect-domain.mp4`, CI re-renders it on every push to the branch):

| Check | Result |
|---|---|
| Format | 1920×1080, 30 fps, H.264 yuv420p, AAC 48 kHz stereo, 325.06 s (5:25), 81 MB |
| Loudness | -14.8 LUFS integrated, LRA 2.9 LU, true peak -1.7 dBTP (targets -14 / -1) |
| Text hold | enforced in code; 53 per-beat stills and the full render passed |
| QR | end card decodes to `https://redirhub.com/qr` from the MP4, label `redirhub.com/qr`; the "dead" menu QR does not decode |
| Black / frozen | no black (the 0.6 s lead-in is Night); 3 static holds where white UI or the end card covers the canvas, the cursor and checks move inside them |
| Silence | none over 3 s in the mix; the pad carries the title card, the caption-only wait and the end card |
| Contact sheets | 2 × 36 tiles reviewed: single idea per tile, captions on plates inside the safe area, right half of the end card clear |
| Sync | word-pinned visuals and 16 cues within 0.3 s of their words; checked by frame at 34.9 s (Dead), 198–204 s (records), 313 s (callback), 319 s (end card) |

Audits for every render are in `renders/render-log.md` (R1–R9).

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
| Branded link for the description/QR (`redirhub.com/qr` placeholder with UTM; it is a QR product page, so a redirect/contact link would fit better) and the contact link for "reach out" | `packaging.md` |
| **Leo's music and sound files** into the repo (his Windows folder is not reachable from the cloud session) | `youtube/01_library/audio/music/README.md` |
| Listen to the restored voice (0:00–0:30, 2:35–3:10): if it still sounds thin, switch to a full-band narrator | production-notes §3 |

## 6. What to reuse next time

- `scripts/yt/beats-from-script.py`, `vo-build.py`, `srt-from-timings.py`, `stills.mjs`,
  `thumbnail.mjs`, `audit-video.sh`; `assembly.json` as the one place to add air.
- Components: `OnScreenText` (hold rule), `UrlPill`, `RedirectLine`, `GlassCard`, `BrowserCard`,
  `Padlock`, `IdCard`, `ChecklistBadge`, `FixedEndCard`; `Dash.tsx` for product UI.
- Sound: `music.json` `"kind": "pad"`, `fixed` and `rewind` effects, the cue discipline in
  `RedirectDomain.tsx`.
- Process: generate the voice first, in chunks; render stills per beat before the full render;
  read the contact sheet; log every render.

## 7. Independent review (separate agent, on cut R6) and what was done

The reviewer watched ~75 frames, measured the audio, checked captions, chapters and thumbnails,
and read the scene code where a frame looked wrong. Verdict: **"ship after fixes"**. Every
should-fix was fixed before the final render; the nits were either fixed or decided and written
down. The full report is in the session; the dispositions:

| # | Finding (severity) | Disposition |
|---|---|---|
| 1 | Two walkthrough captions at y = 960 straddled the dashboard's bottom edge and sat below the safe line (should-fix) | Set on a Night plate at y ≈ 895, inside the safe area and readable over the white UI (a first move to y = 870 put them on the white and was caught in the R8 stills) |
| 2 | Beat 51 callback never shrank: a style spread overrode its transform (should-fix) | Fixed; the morph scales 0.42 → 1 as storyboarded |
| 3 | Real IP on screen 27 s before "copy yours, not mine" (should-fix) | The caption now shows from the moment the records table appears (beat 32) until beat 35 |
| 4 | 14 caption cues under 1 s, orphan one-word cues (should-fix) | Generator merges short cues and breaks at clause boundaries: 98 cues, none under 1 s, none over 42 chars |
| 5 | Chapter "0:35 Why it breaks" pointed at the promise (should-fix) | Chapters: 0:16 Why it breaks · 0:35 The promise · 5:13 Remember the start |
| 6 | The "dead" menu QR was scannable and landed on a live page; "Dead" label 2 s before the word (should-fix) | Finder pattern covered and the code dimmed (verified: no decode); scan and labels now land on the spoken "Dead" |
| 7 | Report placeholders (should-fix) | Filled (this document) |
| 8 | Dashboard frame said "Found" / "A record missing" / "Checking…" at once (should-fix) | Chip and check flip together with the last row |
| 9 | URL/acronym reads: "https://mybrand.com" took 4.8 s (verify by ear) | Confirmed from the recogniser: the first take read "colon slash slash". Chunk c09 re-taken with the address written as spoken; now "h-t-t-p-s, mybrand dot com". "CNAME" and "DNS/HTTPS" are letter reads, as people say them |
| 10 | End card "Every old link lands" is an absolute not in the approved claims | Softened to "Old links land. With HTTPS." |
| 11 | "Registrar" never defined for a viewer who has never heard of DNS | On-screen gloss on the first mention (beat 2): "Registrar: where you bought the domain." |
| 12 | "Last 20 s right half clear" rule broken by tip card TWO (nit) | Rule re-scoped to the end card, where packaging places the end screen; rule 6 says why |
| 13 | Storyboard "silence" entry vs the stinger + pad on the end card (nit) | Storyboard updated to what the film does (the fixed chime plays on "Now it is.", the end card holds on the pad with one low stinger) |
| 14 | Beat 13 punchline caption 4 s before its word (nit) | Pinned to the word "right" |
| 15 | Chrome footnote wrapped on one word (nit) | Box widened |
| 16 | Interstitial copy for a missing certificate used the HTTPS-first wording (nit) | `NotSecurePage kind="nocert"` for beats 5 and 20: "Your connection is not private" |
| 17 | Off-palette paper colours and a green/red status pill on the ID card (nit) | ID card uses teal / Signal Red; the paper set is now written into rule 9 as a sanctioned prop palette |
| 18 | "#1 → #7" is an invented ranking (nit) | Replaced with "Slipping" and the arrow |
| 19 | Dashboard fidelity nits (QR rows "Clicks", sidebar icon, dialog footer) | "Scans" for QR rows; icon and footer left (no screenshot for the footer's exact copy; logged in production-notes §7) |
| 20 | Records table text small on a phone (nit) | Left: the VO tells viewers to copy their own; the focus rack at beat 34 enlarges it |
| 21 | Tip card covered the private window's address bar (nit) | Card lowered 80 px |
| 22 | "It's simpler than you think" is stock (nit) | Kept: it is the mandated pivot line (brief §3) |
| 23 | Half a second of empty Night before the end card (nit) | End card now overlaps the close by 0.8 s |

Not re-reviewed after the fixes: the reviewer saw R6; the final cut (R9) carries all of the above
plus the glow drift and the cursor walk added after R6. The R9 audit in `renders/render-log.md`
and the per-beat stills are the check that nothing regressed.
