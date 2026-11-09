# W46 key frames · How to Redirect Hundreds of Domains at Once (One Spreadsheet)

Key-frame pass for Review 2 (2026-11-06). 26 frames plus three boards (World, System, Sound) on the
`w46` page of the style canvas. Frames only: no Remotion scenes, voice, audio or video were made.

- Canvas: https://claude.ai/artifact/VtcXcWtwwRQWjWYbN2TcCx, page **W46 · How to Redirect Hundreds of Domains at Once**.
- Sources: `style-canvas/build_frames.py` writes every `project/w46-*.dc.html` from the shared house system
  (`w46_base.py`, from W44) and the cast (`w46_props.py`). `frame_notes.py` writes the canvas stickies and the
  frame section below, so both say the same. Stills, the contact sheet and the checker report: `style-canvas/stills/`.
- Re-check: `PREFIX=w46- PROP_FONT="Instrument Serif" PROP_FONT_FILE=style-canvas/instrument-serif.woff2
  SHOP_HEX="2B2722 F4F0E8 E7E0D4 A79F92" NO_TILT=1 python3 scripts/yt/keyframes-check.py style-canvas/project style-canvas/stills`.

## The film in one paragraph

Glomvo, a small team, holds names until the right founder comes looking. One evening a founder types
kipzoo.com; Glomvo's own check had worked, but only on the plain address. The founder's browser asks for the
padlock first, sees a warning and picks another name, and Glomvo never finds out. The way out: every name is a
door that has to open properly, padlock included, and a visit is a knock Glomvo needs to hear. One spreadsheet
(list, import, point) opens every door; then, for the first time, Glomvo hears the knocks.

## The thread and the motif

- **kipzoo.com** is one component (`name_tile`): a white tile, a small arched slot, the address in JetBrains
  Mono. It is on Glomvo's wall (A), the founder's address bar and notebook (C), the sheet's first row (E),
  the 63-visit tile with the crossed-out "drop list?" sticky, then a priced lander (F), and the stepped-back
  door in the closing question (G). It appears in 22 of 26 frames.
- **The door and the knock** (`door()`): an arched doorway whose padlock is its keystone. Closed = navy leaf,
  unlit lock. Open = the leaf slides aside, teal light fills the gap and spills on the floor, the lock lights
  teal. Knock = three arcs leave the door's edge. Broken (red, shackle sprung) exists on the World board for
  completeness but is not used in any frame: the warning page carries that moment. The motif hides in every
  tile as the small slot from frame 2, is born at beat 11 (Door), opens on every name at 24 (Padlocks), knocks
  in F and asks its question in G. New move on `w46-System`: **knock = someone came looking**.

## Buildable from the kit (additions to describe for the build)

Everything uses `tokens.ts` colours and the yt fonts. New pieces the build will need, all drawn in
`w46_props.py` / `build_frames.py`:

| Piece | Notes |
|---|---|
| `Door` | SVG, props `state` (closed, ajar, open, broken), `knock` (0–3), `label`. The knock arcs and the slide of the leaf are the only animated parts. |
| `NameTile` | slot + mono name; options: tag chip, visit count, ring, dim, strike. |
| `GlomvoLogo`, `GlomvoLander` | Instrument Serif in the wordmark only; lander in Inter (it is a website). `price` adds Buy now (a PRICE chip, never a figure) and Make an offer. |
| `Notebook` | paper tokens from W41; the circled name line (empty, kipzoo.com, struck + next name). |
| `Sheet` | generic grid with the real import columns; column/row highlights. |
| `Registrar` | three neutral styles A/B/C, no brand. |
| `WarningPage` | generic wording; Signal Red only here. |
| Product (extend `Product.tsx`) | Create chooser with Import CSV; the import's fix step; the review step; Hostnames with Connect DNS (Automatic/Manual); analytics Domains card; bulk Change destination. Labels from the live dashboard (`redirhub/lviv`), see open-questions.md Q-3. |
| Dialog dock | dialogs come forward over the dimmed dashboard at 1.45× so their words read at 1080p. |


## The world · cast, props and the door-and-knock motif (every frame reuses them)

### `w46-World` · The story world

- **Note:** Glomvo (Instrument Serif wordmark, stone palette), its for-sale lander, the portfolio wall (every name DNS-checked), the kipzoo.com thread in its five states, the door-and-knock motif (closed, opening with the padlock lit, a knock, and the broken state used once), the founder (a notebook and a browser, never a person), the generic warning page, three unbranded registrars, the spreadsheet with the real import columns, and the analytics Domains card. World rules at the bottom right.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Gate 1: round 1 the door read as a battery (rounded slab under a lock): redrawn as an arched doorway, padlock keystone, light spill on the floor. Panels that clipped their notes were resized; the F tile was shown twice and is now one.


## A · Imagine

### `w46-Notebook` · A name that comes first

- **Beats:** 1–2 · **Room:** Evening
- **The one idea:** The company doesn’t exist yet; its name is the first thing it needs.
- **Props:** the founder’s notebook: the idea, a crossed-out word, a sketch, and “1. the name” circled with an empty dashed line
- **In:** Cold open on the open notebook. On “Imagine” the idea line writes in; on “the first thing they’ll look for is the name” the circle draws around the empty name line (draw).
- **Out:** Hard cut on “That’s the bet”.
- **Voice:** [softly] then [warm] · **Sound:** Pad fades in under the voice. No cue.
- **The viewer should feel:** Lean in: “that empty line is my business.”
- **Note:** Merges the hook and the notebook moment (beats 1 and 2) into one image: the empty circled line is the hook.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Craft 1: the empty name line was a timid “?”; now a dashed blank line inside the circle, and “the name” no longer wraps.

### `w46-Glomvo` · Meet Glomvo

- **Beats:** 3 · **Room:** Light
- **The one idea:** Glomvo holds names until the right person comes looking.
- **Props:** the Glomvo wordmark on stone; the portfolio wall of twelve tiles, kipzoo.com among them
- **In:** Cut on “Glomvo”: the wordmark settles first, then the wall fills tile by tile under “buys names like that” (no sound per tile).
- **Out:** Shared-element morph: the wall’s tiles flow into the rows of one sheet (into the title).
- **Voice:** plain, warm · **Sound:** None.
- **The viewer should feel:** A serious, small team. Respect.
- **Note:** kipzoo.com sits in the wall, unmarked: planted, not pointed at.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Craft 1: tiles ran into the right gutter and the group sat high; tiles narrowed and the composition centred.

### `w46-Title` · Title card

- **Beats:** 4 · **Room:** Brand sweep
- **The one idea:** How to redirect hundreds of domains at once, with one spreadsheet.
- **Props:** the title; the sheet the wall became
- **In:** The wall’s tiles land as rows of the sheet (shared-element morph: the same names, now one file). The title lands on “how to redirect hundreds of domains at once”.
- **Out:** Cut to Act B.
- **Voice:** [thoughtful] · **Sound:** Whoosh 1 of 2, on the morph.
- **The viewer should feel:** “Ah, this is about my portfolio.”
- **Note:** The keyword is spoken here and shown in full.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Craft 1: the sheet was too small to read as a sheet and crossed the gutter; now narrower and larger.


## B · What waiting costs

### `w46-Renewals` · Every name asks every year

- **Beats:** 5 · **Room:** Light
- **The one idea:** Holding a name isn’t free: every name renews, every year.
- **Props:** eight name rows across a year; one Renews chip per name, in its month
- **In:** The headline is there on the cut. The Renews chips arrive month by month as a slow left-to-right sweep under “every year, each one asks” (no sound).
- **Out:** Cut.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** A calm, familiar pressure. No numbers, no alarm.
- **Note:** No dollar figures, on purpose.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2.

### `w46-Parking` · A parking ad surface closes

- **Beats:** 6 · **Room:** Charcoal
- **The one idea:** One of the ad surfaces that paid parked names closed this year.
- **Props:** a generic parked page on olzik.com, its sponsored-listing blocks; one plain dated line with its source
- **In:** The ad blocks fade from the top down while “Parking ads used to pay part of that” is spoken; “February 10, 2026” lands on “February tenth”, the line under it with the voice, the source line last.
- **Out:** Cut.
- **Voice:** [matter-of-fact] · **Sound:** None.
- **The viewer should feel:** Matter-of-fact: a dated change, not alarm.
- **Note:** Worded as Google’s help page words it (support.google.com/google-ads/answer/50002): parked domains stopped being an ad surface on the Search Partner Network on February 10, 2026. Bodis is left out (only secondary reports of a customer email); no claim about parking revenue overall. See script-deltas.md Δ-0 and open-questions.md C-1.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Fact check (Kris, 2026-11-09): narrowed to the one fact Google’s own page states, with its source on screen; Bodis and the industry-wide line removed. Gate 4: the consequence caption is gone (the voice carries it), so the frame holds only the two dated lines.

### `w46-Weight` · Each visitor carries weight

- **Beats:** 7 · **Room:** Evening
- **The one idea:** Sales are rare, so one visitor matters a lot.
- **Props:** fifteen name tiles (all different, all checked), dimmed; kipzoo.com lit; one amber visitor dot at its corner with a soft halo
- **In:** The tiles dim on “someone buys it. That’s rare”. On “each person who comes looking” one amber dot arrives at kipzoo.com and its halo breathes once.
- **Out:** Shared-element morph: the dot becomes the founder’s typing caret in the next act.
- **Voice:** plain, slower · **Sound:** None.
- **The viewer should feel:** The weight of one person.
- **Note:** Amber once: the visitor, the key action of Act B. On screen only the second half of beat 7 (10 words); the voice carries the rest.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1: the amber dot’s halo counted as a second amber object; the halo is now a gradient, the dot the only amber object. Gate 4 (fresh eyes): names repeated across the grid and the caption ran 23 words; now 15 different names and a 10-word line.


## C · The founder who came (the twist)

### `w46-TwoResults` · Two addresses, two results

- **Beats:** 8–9 · **Room:** Evening
- **The one idea:** Same name, two results: plain address works, https doesn’t.
- **Props:** left: Glomvo typed the plain address kipzoo.com and the lander shows (a white tick: it worked); right: the founder’s browser at https://kipzoo.com, an empty padlock waiting
- **In:** Focus rack (two places, one job): the left is full brightness on “checked that it worked”; on “asks for the secure version first” the focus racks right and the left settles back a step (opacity only, never blurred, so it doesn’t read as the broken one). Both address bars are large mono. The fairness line lands on “Some registrars’ forwarding includes one”.
- **Out:** Hold on the spinner, then cut to the warning.
- **Voice:** [curious] · **Sound:** None.
- **The viewer should feel:** A small chill: “wait, which one did I test?”
- **Note:** Fairness on screen: “Some registrars include a padlock with forwarding. Others don’t.” No registrar is said to fail.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Craft/Honesty 1: the https:// chip was ringed in teal (teal means fixed); now a neutral dark chip. Group moved down to centre. Gate 4 (fresh eyes): the blurred left pane read as the broken one and the spinner as “loading”; now both panes are full brightness, address bars large, and the right pane shows an empty padlock.

### `w46-Warning` · The founder leaves

- **Beats:** 10a · **Room:** Evening
- **The one idea:** The founder sees a warning page and picks another name.
- **Props:** the generic warning page for https://kipzoo.com; the notebook with kipzoo.com struck through and “try: rimboa.com” under it
- **In:** Cut to the warning page on “warning page”. On “picks another name” the notebook slides in from the right (dock) and a pen line strikes kipzoo.com; the next name writes itself.
- **Out:** Cut to black-blue: the warning leaves, Glomvo’s side remains.
- **Voice:** [quiet] · **Sound:** One soft low tone as the warning lands.
- **The viewer should feel:** A quiet loss.
- **Note:** The only frame with Signal Red. rimboa.com is invented and DNS-checked; it is not on Glomvo’s wall.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Clarity 1: the notebook was too small to read the strike; now larger, overlapping the page’s empty corner.

### `w46-Silence` · Glomvo never finds out

- **Beats:** 10b · **Room:** Evening
- **The one idea:** Glomvo never finds out.
- **Props:** kipzoo.com alone; two faint rings that fade before they reach it
- **In:** Nothing moves but the rings: they spread and fade before reaching the tile (a knock nobody hears, foreshadowing the motif). The line holds on “never finds out”.
- **Out:** Silence (done): 1.5 s of nothing, then the cut. The VO’s last clause (“their own check worked only because they typed the plain address”) plays over the hold.
- **Voice:** [quiet] · **Sound:** Silence: pad out for 1.5 s.
- **The viewer should feel:** The low point. Restraint.
- **Note:** No email, no offer, no notification: the absence is the picture.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Rings raised slightly so they read at all.


## D · The way out (the motif is born)

### `w46-Door` · A door, and a knock

- **Beats:** 11 · **Room:** Charcoal
- **The one idea:** Every name needs a door that opens, and a way to hear the knock.
- **Props:** the motif, born: kipzoo.com as an arched door, padlock keystone lit, light spilling; three knock arcs
- **In:** Shared-element morph: the kipzoo tile’s small slot grows into the door (same thing, new understanding). On “a door that opens properly” the leaf slides, light spills and the padlock lights teal; on “a way to hear when someone knocks” the knock (new move) sends three arcs from the door’s edge. The two lines land with the words.
- **Out:** Register change into the honest note.
- **Voice:** [thoughtful] · **Sound:** Knock (new cue): a soft two-tap on “knocks”.
- **The viewer should feel:** “That’s the whole problem, in one picture.”
- **Note:** The motif’s first full appearance. Before this it hid in every tile as the small slot.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Headline size trimmed so “two things” doesn’t orphan.

### `w46-Honest` · One honest note

- **Beats:** 12 · **Room:** Light
- **The one idea:** A handful of names with a working padlock: you’re done.
- **Props:** an aside card; the Redirect Checker on https://bazlio.com: 302, then 200 on Glomvo’s page
- **In:** Register change (an aside): the room lightens and the card slides in on “One honest note”. The checker runs on “Check one”: the two hops appear in order (draw: traffic moves).
- **Out:** Cut back to the story on “But”.
- **Voice:** plain, generous · **Sound:** None.
- **The viewer should feel:** Trust: they’re not selling me something I don’t need.
- **Note:** Checker output is drawn as an example (labelled), its layout unconfirmed (open-questions.md, Q-3).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Craft 1: top-heavy; card and checker centred and the checker widened.

### `w46-Once` · Three registrars, fixed once

- **Beats:** 13 · **Room:** Light
- **The one idea:** Three registrars, so fix every name once, together.
- **Props:** three unbranded registrar forms (A, B, C); three lines drawing into one empty sheet, headers only
- **In:** The three forms stack on “sat across three registrars”. On “So they fixed them once” the three lines draw from the forms into an empty sheet with only its four headers (draw): the decision. The rows arrive in Step 1, not before.
- **Out:** Dock: the sheet slides to centre and grows into Step 1.
- **Voice:** plain, decided · **Sound:** None.
- **The viewer should feel:** A decision, not a slide change.
- **Note:** No registrar named; nobody “can’t”.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Gate 4 (fresh eyes): the finished sheet appeared before Step 1 built it; the sheet is now empty, headers only.


## E · One spreadsheet: list, import, point

### `w46-List` · Step one: the list

- **Beats:** 14–15 · **Room:** Light
- **The one idea:** One row per name: the name, and where it goes.
- **Props:** the spreadsheet glomvo-portfolio.csv; kipzoo.com’s row ringed; “The name” and “Where it should go” over their columns
- **In:** Cut on “Step one”. The progress bar takes its first segment; the source_url column tints on “The name”, the destination column on “Where it should go”.
- **Out:** Hold; the tint moves right in the next frame.
- **Voice:** calm, teaching · **Sound:** None.
- **The viewer should feel:** Clear: “I can make this file.”
- **Note:** Destinations: Glomvo’s own pages and a generic marketplace.example listing.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1: seven rows pushed the footer below y 950; now six, labels moved closer to their columns.

### `w46-Columns` · A 302 and a tag

- **Beats:** 16–17 · **Room:** Light
- **The one idea:** Two more columns: a 302, and a tag.
- **Props:** the same sheet; the type and tags columns tinted; “302” over the type column; Brandables, Short and Premium chips over the tags column
- **In:** The tint slides from destination to type on “a 302, the temporary kind”; the headline’s first half lands on “the day a name sells”, the second on “a label for a group”. The three chips light one by one on “Brandables. Short names. Premium.”
- **Out:** Whoosh into the product (Step 2).
- **Voice:** calm, teaching · **Sound:** None.
- **The viewer should feel:** “Of course: temporary, because it will sell.”
- **Note:** Merges the type and tag beats: one idea, “two more columns”. The reviewer asked for a split; kept as one to hold the frame budget (review.md).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1: two lines (headline plus caption) crowded the frame; one headline now carries both halves. Gate 4 (fresh eyes): Tag had only an underline; it now carries the three chips and half the headline.

### `w46-Import` · Step two: Import CSV

- **Beats:** 18–19 · **Room:** Light
- **The one idea:** Links, Create, Import CSV.
- **Props:** the RedirHub dashboard (Links, workspace Glomvo); the Create chooser; “Import CSV” ringed
- **In:** Cut into the product on “Step two”. Dock: the chooser comes forward over the dimmed dashboard on “Create”; the Import CSV ring draws on “Import CSV”. The CSV line lands on “plain spreadsheet file”.
- **Out:** Dock out into the import’s first check.
- **Voice:** calm · **Sound:** Whoosh 2 of 2, into the dashboard.
- **The viewer should feel:** Familiar, easy.
- **Note:** Labels from the live dashboard (redirhub/lviv).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Clarity 1: the dialog was 16 px type inside the scaled dashboard; it now docks forward at 1.45×.

### `w46-Fix` · One click fixes them all

- **Beats:** 20–21a · **Room:** Light
- **The one idea:** Before saving, it finds the rows to fix; one click fixes them.
- **Props:** the import’s fix step: 9 rows missing https://, e.g. glomvo.com/olzik, “Add https:// to all 9”
- **In:** The step lands on “Before anything is saved”; the error group opens on “any row that needs a fix”; on “One click fixes them all” the button is pressed and the group clears.
- **Out:** Shared element: the dialog stays; its content turns into the review.
- **Voice:** calm, a little relieved · **Sound:** None (the brief keeps the first fixed chime for the padlocks).
- **The viewer should feel:** Relief.
- **Note:** Counts labelled Example. Script reordered to match the product (script-deltas.md, Δ-1).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Same dock fix as Import.

### `w46-Review` · It shows what the file will do

- **Beats:** 20b–21b · **Room:** Light
- **The one idea:** It shows what the file will do; www is covered.
- **Props:** the import review: Adds 214 domains and 214 links; Leave out 12 www rows their root already covers (ringed)
- **In:** The headline counts land on “what the file will do”; the www row rings on “each name covers its www version too”.
- **Out:** Cut to Step 3.
- **Voice:** calm · **Sound:** None.
- **The viewer should feel:** Confidence before committing.
- **Note:** Counts labelled Example. No plan usage shown (the review’s plan line is cropped out).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Same dock fix; the plan-usage line is left out (no plan claims).

### `w46-PointDNS` · Step three: point the names

- **Beats:** 22–23 · **Room:** Light
- **The one idea:** Point the names; Cloudflare connects automatically, elsewhere add records.
- **Props:** Hostnames with Waiting for DNS and Connected; Connect DNS for kipzoo.com, Automatic (Cloudflare) ringed, Manual beside it
- **In:** Cut on “Step three”; progress takes its third segment. The panel docks in on “DNS is the setting…”; the Cloudflare row rings on “On Cloudflare”; the Manual tab lifts on “Elsewhere”. Rows flip to Connected one at a time on “In batches, if you like”.
- **Out:** Cut to the padlocks.
- **Voice:** calm · **Sound:** None.
- **The viewer should feel:** “I can do these a few at a time.”
- **Note:** “Cloudflare” as a plain word only, as the real UI names it. Caption is the approved fact: a waiting domain doesn’t hold up the others.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. The Cloudflare row is ringed so “automatically” has a picture.

### `w46-Padlocks` · Every door opens, padlock included

- **Beats:** 24 · **Room:** Glow, teal
- **The one idea:** As each name connects, its padlock is set up and renewed.
- **Props:** the wall again, as twelve doors, every padlock lit, light spilling
- **In:** The doors open one after another on “as each name connects”, each padlock lighting teal; the headline lands on “renewed for it”.
- **Out:** Hold, then cut to Act F.
- **Voice:** calm, satisfied · **Sound:** Fixed chime, the film’s only one, as the last padlock lights.
- **The viewer should feel:** Done properly.
- **Note:** One combined result (“all names connected”): the allowed exception to one idea per frame.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1: doors bunched left; now spread across the frame.


## F · Hearing the knock (the reward)

### `w46-Knocks` · Sixty-three knocks

- **Beats:** 25–26 · **Room:** Charcoal
- **The one idea:** kipzoo had 63 visits, typed in, and it was on the drop list.
- **Props:** the kipzoo.com tile with 63 visits; last year’s “drop list?” sticky, crossed out; Channel: Direct; the kipzoo door knocking, on the right (mirrored from the Door frame)
- **In:** On “hear the knocks” the door’s arcs pulse (knock). The count rolls to 63 on “sixty-three visits”; “Channel: Direct” appears on “They typed it in”. On “It had been on last year’s drop list” the “drop list?” sticky arrives and a pen line crosses it out.
- **Out:** Cut.
- **Voice:** [warm] then [lightly] · **Sound:** Knock (second and last).
- **The viewer should feel:** Warm, with one dry smile.
- **Note:** 63 is labelled Example. The VO says visits; the dashboard’s label is Clicks (open-questions.md, Q-5).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Caption narrowed so it doesn’t leave a one-word line. Gate 4 (fresh eyes): same layout as Door (door left, text right); mirrored. The sticky now says “drop list?” so it can’t read as “nearly dropped by accident”.

### `w46-Price` · A real price

- **Beats:** 27 · **Room:** Light
- **The one idea:** So kipzoo got a real price.
- **Props:** Glomvo’s lander for kipzoo.com: until now only “Interested? Write to us.”; now Buy now (a PRICE chip, never a figure) and Make an offer
- **In:** Shared-element morph: the same lander from Act C; “Write to us” gives way to Buy now on “a real price” and Make an offer on “make-offer button”. The headline lands with them.
- **Out:** Cut.
- **Voice:** [thoughtful] · **Sound:** None.
- **The viewer should feel:** Quiet satisfaction.
- **Note:** No price, no dollar sign.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Gate 4 (fresh eyes): Make an offer was already on the Act C lander, so nothing changed; the early lander now only says “Write to us”, the price shows as a PRICE chip, and the headline is the beat’s.

### `w46-Quiet` · Where to look first

- **Beats:** 28 · **Room:** Light
- **The one idea:** At renewal, the quiet names are where to look first.
- **Props:** the analytics Domains card, kipzoo.com on top; the three names at 0 bracketed in amber
- **In:** Rows sort on “stayed quiet all season”; the amber bracket draws around the zeros on “where to look first”.
- **Out:** Cut.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** Informed, not told.
- **Note:** Amber once. Counts labelled Example. Nobody is told to drop a name.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Bracket pulled inside the gutter.

### `w46-ByTag` · Filter by the tag, change it once

- **Beats:** 29 · **Room:** Light
- **The one idea:** Filter by the tag, change the destination once.
- **Props:** Links filtered by Tags: Brandables; 128 links selected; Change destination with a generic marketplace URL; Update 128 links
- **In:** The filter applies on “Filter by the tag”; the rows check; the dialog docks forward on “Change it once” and the Update button rings.
- **Out:** Cut to the recap.
- **Voice:** plain, light · **Sound:** None.
- **The viewer should feel:** “The tags were worth it.”
- **Note:** 128 labelled Example. The note under the URL is the product’s own line.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Same dock fix as Import.


## G · Close

### `w46-Recap` · List · Import · Point · Listen

- **Beats:** 30 · **Room:** Brand radial
- **The one idea:** List, import, point, listen.
- **Props:** four marks: the sheet, Import CSV, a lit door, a knocking door
- **In:** One at a time, on the beat: List on “One list”, Import on “One import”, Point on “Point the names”, Listen held for the keyword line.
- **Out:** Register change into the aside.
- **Voice:** plain, summing up · **Sound:** None.
- **The viewer should feel:** I could do this.
- **Note:** The voice says three; the fourth word, Listen, is the picture’s (script-deltas.md, Δ-3).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1 Clarity 1: the marks were too small; enlarged.

### `w46-YourNames` · Would the door open?

- **Beats:** 31–32 · **Room:** Evening
- **The one idea:** Picture your own names: would the door open?
- **Props:** the aside pill; kipzoo.com’s door, open but stepped back; four closed doors, unlabelled: yours
- **In:** The aside pill fades in on “Glomvo isn’t a real company” (register change), and kipzoo’s door steps back. On “Picture your own names” four closed doors rise beside it, unlit, unlabelled; the question lands in two parts on its two sentences. The frame asks; it doesn’t answer.
- **Out:** Silence, then the end card.
- **Voice:** [lightly] then [thoughtful] · **Sound:** Pad thins out.
- **The viewer should feel:** A question that stays with you tonight.
- **Note:** Calls back to the opening (the evening room, the founder typing tonight). Merges the aside and the final question.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Door floors aligned. Gate 4 (fresh eyes): kipzoo, lit and knocking, answered the question; it now steps back and the viewer’s four doors stay closed. The aside is a larger chip (not a separate frame, to hold the budget).

### `w46-EndCard` · End card

- **Beats:** 33 · **Room:** Glow, teal
- **The one idea:** Every door. Open.
- **Props:** the end line; the RedirHub logo; the QR slot “Dynamic QR · link pending”; the right half clear for YouTube’s end screen (W43, W41)
- **In:** Cut on “If this helped”. The line holds; logo and QR slot are there from the cut.
- **Out:** Silence (done).
- **Voice:** [warm] · **Sound:** Pad out. Silence.
- **The viewer should feel:** Warm, finished.
- **Note:** QR: a RedirHub dynamic QR to the domain-parking page with utm_medium=qr, made later. Never a drawn code.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** 2·2·2·2·2·2. Round 1: the line ran into the right half; set on three lines. Gate 4 (fresh eyes): “Hundreds of domains. One file.” repeated the title; now “Every door. Open.”, which closes the motif. The QR stays a labelled slot, as the brief requires.


## The system behind every frame: rooms, colour, type, motion, sound and voice

### `w46-System` · System: rooms, colour, type, motion

- **Note:** The knock is the one new move.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Board.

### `w46-Sound` · Sound, voice and timing

- **Note:** Two whooshes, one fixed chime, two knocks, one low tone, one silence.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Board.

