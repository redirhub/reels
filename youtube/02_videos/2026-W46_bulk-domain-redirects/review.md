# W46 review notes

## v6 · the Northway cut (2026-11-13)

Leo's corrective pass: the story rebuilt around Northway, a small software company, re-voiced from script v6,
every scene reskinned, one new scene (beat 4), no step labels or progress bars, re-timed to the new voice. The
v4 notes (Glomvo) follow below, unchanged, as history.

### Gate 1 · Identity and names

- **Wordmark.** "Northway" in Instrument Serif with "SOFTWARE" in small tracked capitals (open-questions.md, T-1).
  Checked at thumbnail size on the World board and in w46-Northway: reads as a quiet software brand, never
  louder than the RedirHub logo (the only logo on the end card).
- **Domains.** All 17 shown are invented and NXDOMAIN (2026-11-12 22:25 UTC; open-questions.md, D). northway.com
  and nortway.com are live, so neither appears: the site is northwaysoft.com, the misspelling nortwaysoft.com.
- **Leftovers.** grep over the W46 composition, frames and props for Glomvo, kipzoo, STEP 1/2/3, 302 (in this
  film's CSV), Brandables, drop list and founder: no hits in anything rendered. The remaining hits are history
  (this file's v4 notes, script-deltas.md's v4 log, the git history of the deleted takes).
- **keyframes-check** (`PREFIX=w46-`, Instrument Serif as the prop font, Northway's palette, `NO_TILT=1`):
  30 of 30 boards OK. The grep also caught a stale build of the Sound board (it still said the narrator reads
  "kipzoo") and Glomvo's unused palette in kit.tsx: both fixed, the board republished on the canvas.

### Gate 2 · The voice

- Same voice, model and settings as v4 (Sarah, eleven_v4, stability 0.5, similarity 0.75, seed 42), one take per
  beat; no tags. Domains are never read aloud.
- **Whisper (faster-whisper small.en)** against script v6, beat by beat: takes 0.994, built track 0.996. The
  misses are spelling only (registrars', home page).
- **"RedirHub"** (beat 20): the plain take is heard as "Reader Hub"; the respelled take "Redirect Hub" is heard
  as "Redirect Hub" and is the one used. Both takes kept (open-questions.md, P-1). **"Northway"** is heard as
  Northway in every beat.
- **Gaps:** longest mid-section pause 1.18 s (under 1.2 s). The 1:10–1:16 gap of v4 is gone: beats 9–10 run on.

### Gate 3 · Each changed scene

A still of every scene at its peak, against the §4 map (alignment-done.md, one row each). Fixed at this gate:
the import dialogs showing the dashboard through mid-change (now one solid card that morphs), an empty first
second on Accounts, the Knocks tile overflowing its card, a 2 px shift in the DNS badges, a stale frame export.

### Gate 4 · The full render

- `out/bulk-redirects.mp4`: 4:44 (284.05 s), 1920×1080, 60 fps, H.264 + AAC.
- **Loudness:** −14.1 LUFS integrated, −3.2 dBTP true peak, LRA 2.9 LU; no clipping. The voice sits at least 11 LU over the bed.
- **Contact sheet** every 0.5 s (`w46-contact-sheet.png`, 568 frames), every frame looked at. The first full
  render showed four empty or near-empty openings (Northway, the warning page, Once, the recap) and five lines
  that left too early; all fixed. The second showed seven lines still 0.1–0.6 s under the hold rule.
- **Hold times.** Every on-screen line now holds at least max(1 s, words ÷ 3 + 1 s) before its cut: the rule is
  in code (`timeline.ts`, `local().readBy`), so a line lands on its word unless that would leave it short, and
  then lands earlier. Beat 29 needed both its lines ("Customers, typing the name a little wrong." and "Now they
  land on the homepage.") to hold, which the beat's 6.5 s could not give: 0.4 s more pause after it, voice and
  bed re-assembled from the same takes (no new generation).
- **Sync.** Cuts on beat starts; the knock on "knocks" (twice), the low tone with the warning page, the fixed
  chime on the last padlock, two whooshes (title, product). flash_check: only the cuts and the intended silence.
  stutter_check: 8-bit rounding of slow fades (1.5–4.5 grey levels), no text stepping.
- **Re-transcribed final MP4** against script v6: **0.994** word match (687/691). The misses are spelling (registrars', home page, "north way") and one "and" lost under the music in beat 31. Beat 20 is heard as "Redirect Hub".
- **End card:** "Every door. Open." with the RedirHub logo; the "Dynamic QR · link pending" slot (no drawn code);
  the right half clear for YouTube's end screen.

### Gate 5 · Fresh eyes

A reviewer sub-agent saw only the final contact sheet, the final transcript and §1 of the brief. Its verdict:
"Mostly yes" on one viewing; the arc (many domains → one site → the broken padlock → the spreadsheet → listening)
is clear and the door motif lands three times. What it raised, and what I did:

| Point | Done |
|---|---|
| The misspelled domain sits on the knocking door 9 s before the voice explains it (211–220 s). | **Fixed.** The door is unlabelled until "A misspelling", then nortwaysoft.com fades in under it. |
| "Northway checked the plain address" arrives 2 s before "Someone checked that once"; whose screen is whose is unclear. | **Fixed** the timing: the caption lands on "Someone checked". **Kept** the panes: the customer's browser is alone and full brightness while the voice says "a customer types", and is named on "the customer's browser". |
| The visit counter reads 0 while the voice says "63 visits". | **Rejected.** The transcript's 2 s segments misled it: "Sixty-three" starts at 224.12 s and the count rolls from 224.0 to 225.0 s. |
| The import preview shows "9 rows need a fix" before "Adds 214 domains", while the voice says the adds first (172–188 s). | **Rejected.** That is the product's order (the fix step comes before the review; v4 Δ-1). The error row lands on "any row that needs a second look". |
| The Links list behind the import already holds Northway's domains (163–165 s). | **Rejected** for this pass: it is the dimmed backdrop of the approved frame (§4: "Reskin … keep 214"). Noted for Leo. |
| The opening names Northway in voice at 2 s but on screen only at 19 s; the notebook is still until 9 s. | **Rejected.** §4 keeps the notebook ("Everything else stays"); the plan writes on its words ("buy the domain first" at 9 s). Noted for Leo. |
| "But the real question…" (38 s), the jump to renewals (46 s), "The fix wasn't fewer domains" (99 s), and "you" fading in the middle. | **Rejected.** Script wording: the script is the spine, and its order, bridge and twist are to stay intact. Noted for Leo. |
| "Three registrar accounts" over one registrar card (51–59 s). | **Rejected.** §4 sets exactly this card and line; the card is headed "Registrar B", one of the three. |
| "Their own check worked only because they typed the plain address" plays over the lone domain (95–99 s). | **Rejected.** That is the twist's silence (w46-Silence): one domain, two faint rings, nobody hears. The two panes were on screen for 15 s just before. |
| Numbered markers: the notebook plan (1–4) and "1 / 2" on "Every domain needed two things". | **Rejected.** §4 asks for both ("The plan line 1 becomes the domain"; "1 door · 2 knock"). They are a handwritten plan and a two-item list, not steps. |
| The recap's List / Import / Point / Listen row reads like step cards. | **Rejected.** §4: "Recap card: List · Import · Point · Listen — Keep", now matched by the voice. No numbers. |
| The end card's QR is a placeholder; "our earlier videos are right here on screen" needs end-screen elements. | **Kept** as briefed: the slot stays until the real dynamic QR exists, and the right half is clear for the end screen, which is set in YouTube Studio. |


## v4 · Glomvo (Gates 1–4, 2026-11-06)

### Gate 1 · World

- **Motif.** Round 1 drew the door as a rounded slab with the padlock on top: at thumbnail size it read as a
  battery. Redrawn as an arched doorway, the padlock as its keystone, light spilling onto a floor line when it
  opens. Reads as a door at 140 px, and stays drawn rather than cartoon (no handle, hinges or wood).
- **Review 2 (Leo):** the door simplified further to one arch and one centred padlock (outline closed, teal light
  and a solid lock open, thin arcs for a knock), and Glomvo's logo became the wordmark alone.
- **Names.** Every name is invented and DNS-checked (open-questions.md, D). kipzoo.com is the one exception: no
  DNS, but registered (D-1, with fallbacks).
- **Glomvo.** Serif wordmark, stone and ink, "names, held with care": a serious small team, no startup gloss.
- Fixed before any frame: three panels that clipped their notes; kipzoo's F state was drawn twice.

### Gate 2 · Frames

Scores per frame are in keyframes.md. Reworked before moving on: the empty name line (a timid "?"), tiles and
sheets crossing the right gutter, a teal ring on the https:// chip (teal means fixed), a notebook too small to
read its strike, dialogs at 16 px (now docked forward at 1.45×), a sheet footer below y 950, an end-card line in
the right half, a second amber object (a halo), cramped recap marks.

### Gate 3 · Acts as storyboards

- **A** (Notebook → Glomvo → Title): an empty name, *therefore* a team that holds names, *therefore* the promise.
  The wall flows into the title's sheet.
- **B** (Renewals → Parking → Weight): it costs every year, *but* one ad surface that helped closed this year
  (after the 2026-11-09 fact check, Δ-0), *therefore* each visitor matters. Calm, no numbers.
- **C** (TwoResults → Warning → Silence): it worked, *but* not on https; the founder leaves; *and* nobody knows.
  Quietest act: one room, no cues, one low tone and a held silence.
- **D** (Door → Honest → Once): the model; *but* if you have a few names you're done; *but* Glomvo has three
  registrars, *therefore* once for all. Once now draws into an empty sheet, so the rows arrive in Step 1.
- **E** (List → Columns → Import → Fix → Review → PointDNS → Padlocks): clearer and faster, one progress bar.
  Fix comes before Review, as the product does (script-deltas.md Δ-1).
- **F** (Knocks → Price → Quiet → ByTag): warm: hear, act, look, change once.
- **G** (Recap → YourNames → EndCard): four words; the viewer's own doors, closed; every door, open.
- No line left without a picture after the fixes below; the beat-10 last clause lives in TwoResults' left label.

### Gate 4 · The whole film

- `stills/w46-contact-sheet.png`: all 26 frames in order.
- `keyframes-check.py` (with `PREFIX=w46-`, the prop font, Glomvo's palette and `NO_TILT=1`): **29 of 29 OK**
  (26 frames and 3 boards): no text below y 950 or in the gutters, fonts and colours on the token list, nothing
  tilted, ink inside the safe area, the end card's right half clear.
- Threads:
  - kipzoo.com is the same component in all 22 frames it appears in, always JetBrains Mono.
  - The door motif first appears in frame 10 (Door); before that only as the tiles' small slot. It pays off in
    Padlocks, Knocks, Recap and YourNames.
  - Amber: at most one object per frame, used twice in the film (the visitor in Weight, the quiet names in Quiet).
  - Signal Red: only in Warning.
  - The fixed chime: once, on Padlocks (the brief's first fix moment). Not on Fix, to keep its meaning.

### Fresh-eyes review

A reviewer sub-agent saw only the contact sheet, the script and §1/§5 of the brief. Its five weakest frames, and
what I did:

| # | Frame | Their point | Done |
|---|---|---|---|
| 1 | Price | Nothing changes: Make an offer was already on the Act C lander; the price looked like loading; the headline belonged to the previous frame. | **Fixed.** The early lander only says "Interested? Write to us."; Price adds Buy now (a PRICE chip, no figure) and Make an offer; headline "So kipzoo got a real price." |
| 2 | TwoResults | The blurred left pane read as the broken one; the right spinner read as loading. | **Fixed.** Both panes full brightness with large address bars; the left labelled "Glomvo typed the plain address"; the right an empty padlock. The fairness line stays (the brief requires it on screen). |
| 3 | EndCard | The QR is a placeholder; the line repeats the title. | **Line fixed**: "Every door. Open." **QR rejected**: the brief requires a labelled slot and forbids a drawn code until Kris makes the real one. |
| 4 | Columns | Tag had no picture; Once showed the finished sheet before Step 1 built it. | **Fixed both.** Tag carries its three chips and half the headline; Once draws into an empty sheet. **Split rejected**: one idea, "two more columns", and the frame budget (26). |
| 5 | YourNames | kipzoo, lit and knocking, answered the question; the aside was tiny. | **Fixed.** kipzoo's door steps back, the viewer's doors stay closed; the aside chip is larger. **Separate aside frame rejected** (budget; Δ-4 offers a 2 s beat instead). |

Their other notes:

- *Blue in the Title and Recap backgrounds*: **rejected**. Brand sweep and brand radial are house rooms, approved
  by Leo since W43; "blue only in product UI" governs blue as a signal, not the brand gradients.
- *Red in the Fix error box*: **rejected**. That's the product's own error colour (`#B42318` on `#FEF3F2`), not
  Signal Red `#E5484D`.
- *Amber on the visitor dot*: **kept**. The visitor arriving is Act B's key action.
- *Long captions in Weight (23 words) and Parking*: **fixed**. Weight shows 10 words; Parking's consequence line
  is voice only.
- *"… and 220 more rows" has no Example label*: **fixed** in List and Columns.
- *Names repeated in Weight's grid*: **fixed**. 15 different checked names.
- *Door and Knocks share a layout*: **fixed**. Knocks is mirrored (door on the right).
- *The drop-list sticky is ambiguous*: **fixed**. It now says "drop list?", crossed out.
- *Beat 6 shows nothing leaving*: **kept**. The ad blocks fade top to bottom in the frame; the motion note says when.
- *Beat 23 batches, beat 24 "renewed"*: **kept**. PointDNS shows rows at different states and the approved line
  "a domain that is still waiting doesn't hold up the others"; Padlocks' headline says "set up, and renewed".
- *Spreadsheet shown in several frames*: **kept on purpose**. It is the film's tool and the same object (Title
  promise, Once empty, List/Columns built, Recap mark); each time it moves the story.

### Production · Animation (2026-11-12)

The composition is `src/remotion/reels/bulk-redirects/` (acts in `ActA.tsx` … `ActG.tsx`). Every scene starts from the
approved frame's own markup (`style-canvas/export_scenes.py` → `frames.gen.tsx`) and only adds motion, through hooks
in the frame (`data-o`, `data-draw`, `data-clip`, `data-clipx`, `data-count`, `--tint-k`, `--ring-*`, `--prog`,
`--conn-i`, `--tab-*`). Unset, a hook leaves the frame as approved: the frames rebuilt with every hook in place
re-render pixel-identical to the approved stills, except two sub-pixel glyph shifts (Columns, Once) and the
drop-list strike, now a drawn line (9 px off).

Self-checks, act by act and on the whole film:

- **Stills:** a settled frame of every scene against its approved still: mean difference 1–2 grey levels (encoding).
- **Word cues:** all 86 cue words exist in `timings.json` (a missing word fails the build, not the timing).
- **stutter_check / flash_check:** found and fixed: the opening's fade-stop-rise (one continuous move now); text
  snapping a pixel at a time at the end of slow lifts (hooked elements get their own layer); door light that
  crossed each door in a fifth of its time (a soft mask over the door's own box); half-and-half crossfades that
  dipped a window grey (Two results, the notebook strike, the By-tag states: each state stays opaque under the
  next); kipzoo.com landing on the warning page's text; the two import dialogs overlapping; a dark-to-light room
  change at 50 grey levels a frame (the cover now spans the whole 0.3 s lap, peak 15). What remains is 8-bit
  rounding of slow fades (about one grey level) and intended pulses (the silent rings, the knock arcs).
- **Sound:** two whooshes (title, product), one low tone (warning), two knocks (Mixkit #1523, after "someone
  knocks" and "hear the knocks"; beat 11 got 0.8 s so the knock lands before the aside), one chime (the last
  padlock), silence after "Glomvo never finds out". Bed at least 11 LU under the voice; voice and bed rebuilt.
- **Loudness:** -17.4 LUFS integrated (gentle master chosen to keep Sarah natural); YouTube normalises down only,
  so it plays about 3 dB quieter than louder uploads.
