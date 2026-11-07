# W46 review notes (Gates 1–4, 2026-11-06)

## Gate 1 · World

- **Motif.** Round 1 drew the door as a rounded slab with the padlock on top: at thumbnail size it read as a
  battery. Redrawn as an arched doorway, the padlock as its keystone, light spilling onto a floor line when it
  opens. Reads as a door at 140 px, and stays drawn rather than cartoon (no handle, hinges or wood).
- **Names.** Every name is invented and DNS-checked (open-questions.md, D). kipzoo.com is the one exception: no
  DNS, but registered (D-1, with fallbacks).
- **Glomvo.** Serif wordmark, stone and ink, "names, held with care": a serious small team, no startup gloss.
- Fixed before any frame: three panels that clipped their notes; kipzoo's F state was drawn twice.

## Gate 2 · Frames

Scores per frame are in keyframes.md. Reworked before moving on: the empty name line (a timid "?"), tiles and
sheets crossing the right gutter, a teal ring on the https:// chip (teal means fixed), a notebook too small to
read its strike, dialogs at 16 px (now docked forward at 1.45×), a sheet footer below y 950, an end-card line in
the right half, a second amber object (a halo), cramped recap marks.

## Gate 3 · Acts as storyboards

- **A** (Notebook → Glomvo → Title): an empty name, *therefore* a team that holds names, *therefore* the promise.
  The wall flows into the title's sheet.
- **B** (Renewals → Parking → Weight): it costs every year, *but* the ads that helped went away, *therefore* each
  visitor matters. Calm, no numbers.
- **C** (TwoResults → Warning → Silence): it worked, *but* not on https; the founder leaves; *and* nobody knows.
  Quietest act: one room, no cues, one low tone and a held silence.
- **D** (Door → Honest → Once): the model; *but* if you have a few names you're done; *but* Glomvo has three
  registrars, *therefore* once for all. Once now draws into an empty sheet, so the rows arrive in Step 1.
- **E** (List → Columns → Import → Fix → Review → PointDNS → Padlocks): clearer and faster, one progress bar.
  Fix comes before Review, as the product does (script-deltas.md Δ-1).
- **F** (Knocks → Price → Quiet → ByTag): warm: hear, act, look, change once.
- **G** (Recap → YourNames → EndCard): four words; the viewer's own doors, closed; every door, open.
- No line left without a picture after the fixes below; the beat-10 last clause lives in TwoResults' left label.

## Gate 4 · The whole film

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

## Fresh-eyes review

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
