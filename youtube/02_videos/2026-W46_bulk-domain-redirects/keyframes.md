# W46 key frames · How to Redirect Hundreds of Domains at Once (One Spreadsheet)

**v6, the corrected cut (2026-11-13).** Leo watched the v4 render: the motion and voice worked, the Glomvo story
didn't. Script v6 tells the same lesson through Northway, a small software company whose domains piled up. The
frames were reskinned (same components, compositions and moves), one scene was added (`w46-OneSite`, beat 4) and
every step label was removed. 27 frames plus three boards (World, System, Sound) on the `w46` page of the style
canvas; the Remotion composition is `src/remotion/reels/bulk-redirects/`.

- Canvas: https://claude.ai/artifact/VtcXcWtwwRQWjWYbN2TcCx, page **W46 · How to Redirect Hundreds of Domains at Once**.
- Sources: `style-canvas/build_frames.py` writes every `project/w46-*.dc.html` from the shared house system
  (`w46_base.py`, from W44) and the cast (`w46_props.py`); `export_scenes.py` turns them into the composition's
  layers (`frames.gen.tsx`). `frame_notes.py` writes the canvas stickies and the frame section below, so both say
  the same. Stills and the contact sheet: `style-canvas/stills/`. Row-by-row status: `alignment-done.md`.
- Re-check: `PREFIX=w46- PROP_FONT="Instrument Serif" PROP_FONT_FILE=style-canvas/instrument-serif.woff2
  SHOP_HEX="1B2333 F6F5F1 E4E2DC 7C8596" NO_TILT=1 python3 scripts/yt/keyframes-check.py style-canvas/project style-canvas/stills`.

## The film in one paragraph

Imagine you have a company, Northway. Every product got a domain, then one per country, a few misspellings and the old
name: over two hundred now, forwarding from three registrar accounts set up years ago. Now everything moves to one
website, so every domain needs a new destination. One evening a customer types a retired product's domain; it
forwards, but only on the plain address, so the browser shows a warning and they leave, and Northway never finds
out. The fix: every domain needs a door that opens properly, padlock included, and a way to hear the knock. You
write down once, in one spreadsheet, where every domain should go; RedirHub imports it, fixes what needs fixing,
points the domains and lights every padlock. Then Northway hears the knocks: a misspelling with 63 visits. The
summary shows the method in the product (one list, one import, the domains pointed), and the question turns to
the viewer's own list.

## The threads and the motif

- **rotawick.com**, a product Northway retired, is the twist: the lit tile people still type (B), the address the
  customer types and the warning page (C), the tile that becomes the door (D), the file's first row (E) and a
  hostname connected at last in the summary (G).
- **nortwaysoft.com**, "Northway without the h", is the knocks: 0 → 63 visits (an Example), the crossed-out
  "drop at renewal?" sticky, then the padlocked homepage it now lands on (F).
- Both are the same component everywhere (`name_tile`): a white tile, a small arched slot, the address in
  JetBrains Mono. The narrator never reads a domain aloud.
- **The door and the knock** (`door()`): an arched doorway with a small padlock. Closed = thin outline; open = teal
  light, the padlock solid; knock = three arcs. Born at "Every domain needed two things" (beat 13), every door
  opens at beat 25, and the knocks pay off in F. After that the film leaves the picture (v6.1, Leo: "over used"): the summary and the
  question show the method and the viewer's own list; only the words "would the door open for them?" and the end
  line keep it.

## Buildable from the kit

| Piece | Notes |
|---|---|
| `Door` | SVG, props `state` (closed, open, broken), `knock` (0–3), `label`; the fill and the knock arcs are the animated parts. |
| `NameTile` | slot + mono name; options: tag chip, visit count (a CSS counter the scene rolls), ring, dim, strike, `h` (a wider tile keeps its type size). |
| `NorthwayLogo`, `Homepage` | Instrument Serif in the wordmark only; the homepage in Inter (it is a website). |
| `Notebook` | paper tokens from W41; "1. the domain" circled round an empty line; plan lines 2–4 are hooks. |
| `Sheet` | generic grid with the real import columns (301, Product / Country / Typo); column tints and rows are hooks. |
| `Registrar` | three neutral styles A/B/C, no brand. |
| `WarningPage` | generic wording; Signal Red only here. |
| Product | Create chooser with Import CSV; the import's fix step; the review step; Hostnames with Connect DNS (Automatic/Manual); analytics Domains card; bulk Change destination. Labels from the live dashboard (`redirhub/lviv`). |
| Dialog dock | dialogs come forward over the dimmed dashboard at 1.45× so their words read at 1080p. |


## The world · Northway, its domains, the two threads and the door-and-knock motif (every frame reuses them)

### `w46-World` · The story world

- **Note:** v6 (Leo, 2026-11-13): Northway, a small software company whose domains piled up (products, countries, misspellings, the old name); its type-only wordmark (Instrument Serif, “software” in small capitals) and its one website on northwaysoft.com (northway.com is live). Two threads: rotawick.com, a retired product people still type (the twist and the closing door), and nortwaysoft.com, “Northway without the h” (the knocks). Every domain invented and DNS-checked on 12 Nov 2026.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Board.


## A · Your company

### `w46-Notebook` · Buy the domain first

- **Beats:** 1–2 · **Room:** Evening
- **The one idea:** Every product Northway launched started the same way: the domain first.
- **Props:** a product notebook: the idea (“A scheduling app for clinics”), a crossed-out idea, a sketch; the plan: “1. the domain” circled round an empty line, then 2–4; “Northway” written at the top of the page
- **In:** Cold open on the notebook; “Northway” writes in as she names it. On “buy the domain first” the circle draws round the empty line (draw); “one for each country”, “a few misspellings” and “the old name, too” write in on their words.
- **Out:** Cut on “Today, Northway owns…”.
- **Voice:** warm, then plain · **Sound:** No cue.
- **The viewer should feel:** “That’s how my list started too.”
- **Note:** The notebook is Northway’s habit, never a person.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Northway` · Meet Northway

- **Beats:** 3 · **Room:** Light
- **The one idea:** Today Northway owns over two hundred domains.
- **Props:** the Northway wordmark on paper; twelve domain tiles (products, countries, misspellings, the old name)
- **In:** The wordmark settles on “Northway”; the wall fills tile by tile on “owns over two hundred domains”; the line lands on “over two hundred”.
- **Out:** The tiles carry into the next frame (six of them).
- **Voice:** thoughtful · **Sound:** None.
- **The viewer should feel:** “Whatever your business is, your list grew the same way.”
- **Note:** The wordmark is never louder than the RedirHub frame around it.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-OneSite` · One website, every product

- **Beats:** 4 · **Room:** Light
- **The one idea:** All the products move to one website, so every domain needs a new destination.
- **Props:** six domain tiles; Northway’s homepage on northwaysoft.com; six lines and an arrow
- **In:** New in v6. The homepage pops in on “on one website” with its line; on “every one of those two hundred domains needs a new destination” each domain draws a line into it, one after another (draw: traffic moves).
- **Out:** Whoosh into the title.
- **Voice:** matter-of-fact · **Sound:** None.
- **The viewer should feel:** The job is clear: everything points to one place.
- **Note:** One idea on screen. Uses the existing draw move.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** New in v6 (2026-11-13): one idea, the existing draw move; checked at its peak moment (Gate 3) and by keyframes-check.

### `w46-Title` · Title card

- **Beats:** 5 · **Room:** Brand sweep
- **The one idea:** How to redirect hundreds of domains at once, with one spreadsheet.
- **Props:** the title; the file the domains became
- **In:** The file slides in (whoosh 1 of 2); the title lands on “how do you move hundreds of domains at once” and holds through the question.
- **Out:** Cut to Act B.
- **Voice:** thoughtful · **Sound:** Whoosh 1 of 2.
- **The viewer should feel:** “That’s my question.”
- **Note:** The title keeps “redirect” for search; the voice says “move”.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## B · The quiet pile

### `w46-Renewals` · Every domain renews

- **Beats:** 6 · **Room:** Light
- **The one idea:** Each domain renews every year, used or not.
- **Props:** eight Northway domains across a year; one Renews chip each, in its month
- **In:** The headline is there on the cut; the Renews chips arrive month by month under “renews every year”; the footer lands on “whether anyone uses it or not”.
- **Out:** Cut.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** A calm, familiar pressure. No numbers.
- **Note:** No dollar figures.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Accounts` · Three registrar accounts

- **Beats:** 7 · **Room:** Charcoal
- **The one idea:** The forwards live in three registrar accounts, set up years ago.
- **Props:** a generic registrar forwarding settings card (no real brand); one line
- **In:** The card arrives on “Most of them forward somewhere”; “Three registrar accounts. Set up years ago.” lands on “Set up years ago”.
- **Out:** Cut.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** “Nobody’s looked at these in years.”
- **Note:** Was w46-Parking (v4). No parking, Bodis or Google claims remain.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Weight` · Which ones do people still type?

- **Beats:** 8 · **Room:** Evening
- **The one idea:** Nobody knows which domains people still type.
- **Props:** fifteen Northway domains dimmed; rotawick.com lit; one amber visitor dot
- **In:** The line lands on “which ones people still type”; on “a product you retired years ago” one amber dot arrives at rotawick.com and its halo breathes once.
- **Out:** Cut into the evening.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** One domain matters more than it looks.
- **Note:** Amber once: the visitor.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## C · The visitor nobody sees (the twist)

### `w46-TwoResults` · Two addresses, two results

- **Beats:** 9–10 · **Room:** Evening
- **The one idea:** The plain address works; the secure one doesn’t.
- **Props:** left: Northway checked the plain address rotawick.com and its homepage shows; right: the customer’s browser at https://rotawick.com, an empty padlock
- **In:** The customer types the retired product’s domain (right). On “It forwards to Northway’s site” Northway’s own check comes in on the left while the right dims; focus rack on “But the customer’s browser”; on “secure version first” the address becomes https://.
- **Out:** Cut to the warning.
- **Voice:** curious · **Sound:** None.
- **The viewer should feel:** A small chill: “which one did we test?”
- **Note:** Fairness on screen: “Some registrars include a padlock with forwarding. Others don’t.”
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Warning` · The customer leaves

- **Beats:** 11 · **Room:** Evening
- **The one idea:** The customer sees a warning page; to them, Northway looks broken.
- **Props:** the generic warning page for https://rotawick.com
- **In:** The page lands on “warning page” (the one low tone) and holds through “it looks like Northway is broken”.
- **Out:** On “They leave” the page leaves the room.
- **Voice:** quiet · **Sound:** One soft low tone.
- **The viewer should feel:** A quiet loss.
- **Note:** The only frame with Signal Red. Now narrated (v6 beat 11 fills the old gap).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Silence` · Northway never finds out

- **Beats:** 12 · **Room:** Evening
- **The one idea:** Northway never finds out.
- **Props:** rotawick.com alone; two faint rings that fade before they reach it
- **In:** The rings spread and fade before reaching the tile (a knock nobody hears). The line lands on “never finds out”.
- **Out:** Silence (done), then the door is born from the tile.
- **Voice:** plain · **Sound:** Silence.
- **The viewer should feel:** The low point. Restraint.
- **Note:** No email, no notification: the absence is the picture.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## D · The way out (the motif is born; the bridge into the spreadsheet)

### `w46-Door` · A door, and a knock

- **Beats:** 13 · **Room:** Charcoal
- **The one idea:** Every domain needs a door that opens, and a way to hear the knock.
- **Props:** the motif, born: rotawick.com as an arched door, teal light, the padlock solid; three knock arcs
- **In:** Shared-element morph: the tile grows into a closed door; on “a door that opens properly” the light fills it from the top; the two lines land with their words; on “someone knocks” the knock sounds and the arcs leave, one per rap.
- **Out:** Register change into the honest note.
- **Voice:** thoughtful · **Sound:** Knock 1 of 2.
- **The viewer should feel:** “That’s the whole problem, in one picture.”
- **Note:** The motif’s first full appearance.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Honest` · One honest note

- **Beats:** 14 · **Room:** Light
- **The one idea:** A handful of domains with a working padlock: you’re done.
- **Props:** an aside card; the Redirect Checker on https://clinvane.com: 301, then 200 on Northway’s page
- **In:** The card slides in on “One honest note”; the checker comes in on “a handful of domains” and runs on “Check one”: the two hops appear in order.
- **Out:** Cut back on “But”.
- **Voice:** plain, generous · **Sound:** None.
- **The viewer should feel:** Trust: they’re not selling me something I don’t need.
- **Note:** Checker drawn as an example (labelled); its layout unconfirmed (open-questions.md Q-3).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Once` · Two hundred domains, one file

- **Beats:** 15 · **Room:** Light
- **The one idea:** The bridge: write down once where every domain should go.
- **Props:** three registrar forms with Northway’s domains; three lines; one empty file
- **In:** The forms stack on “in three accounts, one form at a time”; the empty file arrives on “So instead”; on “you write down once” three lines draw into it; the line lands on “once”.
- **Out:** Dock: the file slides to centre and grows.
- **Voice:** thoughtful · **Sound:** None.
- **The viewer should feel:** Relief: one place for the plan.
- **Note:** The rows arrive in the next frame, not before.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## E · One spreadsheet (no steps: it grows out of the story)

### `w46-List` · One row per domain

- **Beats:** 16 · **Room:** Light
- **The one idea:** Each row is one domain, and where it should go.
- **Props:** northway-domains.csv: six rows (the old product, a product, two countries, two misspellings)
- **In:** The file docks from Once; the rows arrive on “Each row is one domain”; the domain column tints on “one domain”, the destination column on “where it should go”; a ring walks the old product’s row, the country rows, the misspellings.
- **Out:** Hold; the tint moves right.
- **Voice:** calm, teaching · **Sound:** None.
- **The viewer should feel:** “I can write that.”
- **Note:** No step label (v6).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Columns` · A 301 and a tag

- **Beats:** 17–19 · **Room:** Light
- **The one idea:** A 301 because the moves are for good; a tag for the group.
- **Props:** the same file; “301”; Product · Country · Typo chips
- **In:** The tint slides to type on “A 301, the permanent kind”; the headline’s first half lands on “because these moves are for good”, the second on “a short label for the group”; the chips light on “Product. Country. Typo.”; the file holds through “the whole plan”.
- **Out:** Whoosh into the product.
- **Voice:** calm, warm · **Sound:** None.
- **The viewer should feel:** The plan is done, and anyone can check it.
- **Note:** The real import columns: source_url, destination, type, tags.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Import` · Import CSV

- **Beats:** 20 · **Room:** Light
- **The one idea:** In RedirHub: Links, Create, Import CSV.
- **Props:** the Northway workspace’s Links; the Create chooser; the Import CSV link ringed; the CSV line
- **In:** Cut into the product (whoosh 2); the chooser docks forward on “Create”; the ring draws on “Import CSV”; the CSV line lands on “plain spreadsheet file”.
- **Out:** The chooser docks out before the check comes in.
- **Voice:** calm · **Sound:** Whoosh 2 of 2.
- **The viewer should feel:** Familiar, real product.
- **Note:** The voice says “Redirect Hub” (open-questions.md P-1).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Fix` · One click fixes all of them

- **Beats:** 21–22a · **Room:** Light
- **The one idea:** Before saving, it shows what will happen and the rows that need a second look.
- **Props:** the import check: 9 rows need a fix; Add https:// to all 9
- **In:** The check docks in on “Before anything is saved”; the error group opens on “any row that needs a second look”; on “One click fixes all of them” the button is pressed and the group clears.
- **Out:** Shared element: the dialog turns into the review.
- **Voice:** calm · **Sound:** None.
- **The viewer should feel:** Nothing breaks by surprise.
- **Note:** Real strings (open-questions.md Q-2).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Review` · It shows what will happen

- **Beats:** 22b · **Room:** Light
- **The one idea:** Adds 214 domains; each domain’s www comes along.
- **Props:** the review: Adds 214 domains and 214 links; Leave out 12 www rows
- **In:** The review settles; the www row rings on “each domain’s www version comes along too”.
- **Out:** Cut to Hostnames.
- **Voice:** calm · **Sound:** None.
- **The viewer should feel:** Confidence before committing.
- **Note:** 214 fits the Pro plan (250); no plan is named.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-PointDNS` · Point the domains

- **Beats:** 23–24 · **Room:** Light
- **The one idea:** DNS points each domain; Cloudflare connects automatically, elsewhere add the records.
- **Props:** Hostnames: Northway’s domains, Waiting for DNS / Connected; Connect DNS panel
- **In:** The panel docks in on “That’s DNS”; the Cloudflare row rings on “On Cloudflare”; the Manual tab lifts on “Elsewhere”; four domains turn Connected one at a time on “In batches”.
- **Out:** Cut to the padlocks.
- **Voice:** calm · **Sound:** None.
- **The viewer should feel:** It can be done in batches.
- **Note:** The caption: a domain still waiting doesn’t hold up the others.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Padlocks` · Every door opens, padlock included

- **Beats:** 25 · **Room:** Glow, teal
- **The one idea:** As each domain connects, its padlock is set up and renewed.
- **Props:** twelve doors, Northway’s domains
- **In:** The doors open one after another on “as each domain connects”, light filling each; the last lands on “set up” with the fixed chime; the headline on “renewed for it”.
- **Out:** Hold, then cut to Act F.
- **Voice:** warm · **Sound:** Fixed chime (the fix moment).
- **The viewer should feel:** Done.
- **Note:** The chime plays only here.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## F · Hearing the knock (the reward)

### `w46-Knocks` · Sixty-three knocks

- **Beats:** 26–29a · **Room:** Charcoal
- **The one idea:** For the first time, Northway hears the knocks: a misspelling with 63 visits.
- **Props:** nortwaysoft.com, 0 → 63 visits (Example), “drop at renewal?” crossed out; the open door with arcs
- **In:** On “could hear the knocks” the knock sounds and the arcs leave; the tile arrives on “one stood out” and rolls to 63 on “Sixty-three visits”; the door is unlabelled until “A misspelling” names it; the sticky arrives on “nearly been dropped” and a pen line crosses it; the line lands on “Those were customers…”.
- **Out:** Cut on “Now”.
- **Voice:** warm, lightly · **Sound:** Knock 2 of 2.
- **The viewer should feel:** “Real people typed that.”
- **Note:** The number is an example, labelled.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Price` · They land on the homepage

- **Beats:** 29b · **Room:** Light
- **The one idea:** Now they land on the homepage, padlock and all.
- **Props:** Northway’s homepage; the address bar from nortwaysoft.com to https://northwaysoft.com
- **In:** Cut on “Now”; the headline lands; on “they land on the homepage” the address becomes the padlocked homepage.
- **Out:** Cut.
- **Voice:** thoughtful · **Sound:** None.
- **The viewer should feel:** Fixed, and found.
- **Note:** Was “a real price” (v4).
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-Quiet` · Where to look first

- **Beats:** 30 · **Room:** Light
- **The one idea:** The quiet domains: where to look first at renewal.
- **Props:** the analytics Domains card, Northway’s domains, sorted; an amber bracket round the zeros
- **In:** The rows sort on “stayed quiet all season”; the headline lands on “quiet”, the line on “At renewal time”; the bracket draws on “where to look first”.
- **Out:** Cut.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** A practical win.
- **Note:** Amber once. Counts labelled Example.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-ByTag` · Filter by its tag, change it once

- **Beats:** 31 · **Room:** Light
- **The one idea:** Retiring a product? Filter by its tag, change it once.
- **Props:** Links filtered by the tag Product; Change destination to a Northway page; Update 46 links
- **In:** The filter applies on “Filter by its tag”; the dialog docks forward on “Change it once” and the Update button rings.
- **Out:** Cut to the recap.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** The tag pays off.
- **Note:** 46 is an example.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## G · Your list

### `w46-Recap` · One list, one import, point the domains

- **Beats:** 32 · **Room:** Brand radial
- **The one idea:** One list. One import. Point the domains. That’s how to move hundreds of domains at once.
- **Props:** the film’s own three objects: northway-domains.csv, the import’s review (Adds 214 domains…), Hostnames with every row Connected
- **In:** The list is there from the cut; on “One import” a line draws into the review; on “Point the domains” a second line draws into Hostnames and its rows turn Connected, one after another; the spoken summary builds above, phrase by phrase.
- **Out:** Register change into the aside.
- **Voice:** plain · **Sound:** None.
- **The viewer should feel:** I can remember that, and I’ve seen each part.
- **Note:** v6.1 (Leo, 2026-11-14): no door and no “listen”; the summary is the method, in the product.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-YourNames` · Picture your own list

- **Beats:** 33–34 · **Room:** Evening
- **The one idea:** Picture your own list: which domain would a customer type tonight, and would the door open?
- **Props:** the aside pill and Northway’s wordmark; then your-domains.csv, rows unnamed, one row lit amber; the question
- **In:** Northway’s wordmark is there from the cut and the pill fades in on “Northway isn’t a real company”; on “Picture your own list” both leave and the viewer’s list arrives; on “Which domain…” one row lights amber and the question lands in two parts.
- **Out:** Silence, then the end card.
- **Voice:** lightly, thoughtful · **Sound:** None.
- **The viewer should feel:** It’s about my own domains.
- **Note:** The frame asks; it doesn’t answer.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.

### `w46-EndCard` · End card

- **Beats:** 35 · **Room:** Glow, teal
- **The one idea:** Every door. Open.
- **Props:** the end line; Links are in the description; the RedirHub logo; the right half clear for YouTube’s end screen
- **In:** Cut on “If this helped”; the line and logo are there from the cut; the links line lands with its words.
- **Out:** Hold (done).
- **Voice:** warm · **Sound:** None.
- **The viewer should feel:** Calm, complete.
- **Note:** v6.1 (Leo, 2026-11-14): no QR slot.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.


## The system behind every frame: rooms, colour, type, motion, sound and voice

### `w46-System` · System: rooms, colour, type, motion

- **Note:** Teal means fixed; Signal Red only on the warning page; amber at most once a frame; Northway’s palette and serif only on its own things.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Board.

### `w46-Sound` · Sound, voice and timing

- **Note:** Two whooshes, one fixed chime, two knocks, one low tone, one silence. Voice: Sarah, one take per beat, −14 LUFS mix.
- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** Board.

