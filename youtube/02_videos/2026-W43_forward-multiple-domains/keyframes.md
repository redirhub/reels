# W43 key frames: "How to Forward Multiple Domains to One Website (With HTTPS)"

Key-frame pass for **Review 2** (workflow step 2), 2026-10-14. Publishes Oct 19.
Canvas: **RedirHub YouTube Style Frames**, page **W43 · How to Forward Multiple Domains to One Website**:
https://claude.ai/artifact/VtcXcWtwwRQWjWYbN2TcCx (private until shared).
Source: `style-canvas/project/` (one `.dc.html` per frame, plus `canvas.json` as it stands after this video).
Stills: `style-canvas/stills/` (rendered locally, checked against the brief's fit rules).

**Direction:** many names, one home. Every frame below is the peak moment of its beat: the state the viewer
remembers. Where motion is the point, the frame shows the end state and the move is described here and in
the frame's sticky on the canvas.

## Round 2 (Leo's notes, 2026-10-14)

Leo's notes on round 1: every frame sat on the same Night background (the second video in a row), the twist
was not visible, and the frames lacked variety. "It should be as engaging and fun as it is informative." The
references were RedirHub's own carousel slides: brand gradients, glass cards, big Jakarta headlines that end
with a full stop, accent dots, fan diagrams, a perspective floor, and an eyebrow with a progress bar.

What changed:

- **Rooms.** Each act gets its own background, taken from the gradients on redirhub.com's stylesheet
  (read 2026-10-14). A room change marks a new act, so the background carries the structure:

  | Room | Recipe (site CSS) | Frames |
  |---|---|---|
  | Dark mesh | amber + teal radial glows on `#181D27 → #101828`, masked 80 px grid | Domains, DeadEnds, OneAddress, EndCard |
  | Brand sweep | `linear-gradient(163deg, #1C6DB6, #20A795 86%)`, perspective floor on the title | Title, HttpsIssued |
  | Light | `linear-gradient(160deg, #F2F7FC, #EEF8F6)` + dot pattern | Pointer, Perfect, the four dashboard steps, Renew |
  | Twist night | red glow on `#181D27 → #0B1426` | Copies, AddressBar |
  | Brand radial | `radial-gradient(… at 50% 100%, #20A795, #1C6DB6)` | Steps, AllGreen |
  | Lab | Night + a fine 60 px grid | FourAddresses, Checker |
  | Charcoal | `#181D27 → #101828` | Honest |

- **The twist is three frames** with one shared layout, so it reads as a reversal: **It looks perfect**
  (light room, five sites with teal ticks) → **five copies** (the room drops to dark red, the same cards go
  grey and get stamped COPY, a magnifier marks Google's pick) → **the address bar** (the typo, giant, in
  the visitor's own bar). Then the rewind.
- **More kinds of visual:** a 3D browser carousel (DeadEnds), a perspective floor (Title, Steps), a paper flyer,
  address book and renewal calendar, a fan diagram converging on one node (OneAddress), a giant number
  ("16", "16/16"), stamps, a magnifier, a two-card "does / doesn't" comparison.
- **Dashboard from the prototype (Oct 14):** the product frames use the Unified Links prototype's app shell, Links
  list and full-page create form (open-questions UI-10 to UI-12).
- **Glass and type from the site:** glass pills and cards; headlines in Plus Jakarta Sans 800 with a full stop;
  the eyebrow is a short dash plus caps at y 110, and the dashboard act adds a three-step progress bar top right.
  Tips are solid charcoal cards beside the stage.
- Rules kept: 120 px gutters, nothing to read below y 950, one idea per frame, amber on one object at most, blue
  only inside product UI, teal = fixed, red = broken.

## The film at a glance

| # | Frame | Room | Beats | The one idea |
|---|---|---|---|---|
| A1 | `w43-Domains` | Dark mesh | 1–5 | Most brands own more than one domain, and every one is a way in |
| A2 | `w43-DeadEnds` | Dark mesh | 6–7 | An extra domain that leads nowhere is a visitor you almost had |
| A3 | `w43-Title` | Brand sweep | 8–9 | The promise: every domain, one website, with HTTPS |
| B1 | `w43-Pointer` | Light | 10–11 | A domain doesn't hold the site; it points to where it lives |
| B2 | `w43-Perfect` | Light | 12–14 | Way one, pointing every domain at the hosting, looks perfect (**new**) |
| B3 | `w43-Copies` | Twist night | 15–16 | **The twist:** to Google, that's five copies, and it picks the address |
| B4 | `w43-AddressBar` | Twist night | 17 | **The twist, personal:** the bar shows whatever they typed, even the typo (**new**) |
| B5 | `w43-OneAddress` | Dark mesh | 18–20 | Way two: one main address, a 301 from every other domain |
| C1 | `w43-Steps` | Brand radial | 21 (+ recap 49) | Three steps and one test |
| C2 | `w43-MainAddress` | Light | 22–24 | Step one: choose the main address, exactly as people should see it |
| C3 | `w43-DomainRedirect` | Light | 25–29 | Step two: one Domain Redirect, filled in |
| C4 | `w43-LinksList` | Light | 30–32 | Every other domain gets its own redirect, all to the same place |
| C5 | `w43-ConnectDNS` | Light | 33–38 | Step three: point each domain at RedirHub in its DNS |
| C6 | `w43-HttpsIssued` | Brand sweep | 39 | HTTPS is issued automatically: the padlock on every domain |
| D1 | `w43-FourAddresses` | Lab | 40–43 | Every domain is four addresses: sixteen ways in |
| D2 | `w43-Checker` | Lab | 43–45 | What a pass looks like: one hop, a 301, lands on the main address |
| D3 | `w43-AllGreen` | Brand radial | (new) | 16/16 land on one address |
| D4 | `w43-Honest` | Charcoal | 47 | Forwarding catches people; it doesn't lift rankings on its own |
| D5 | `w43-Renew` | Light | 48 | Keep renewing every domain you forward |
| D6 | `w43-EndCard` | Dark mesh | 50–52 | Five domains. One website. |
| S1 | `w43-System` | — | — | Rooms, colour roles, type, glass (changed from W41: noted on the board) |
| S2 | `w43-Sound` | — | — | Sound and timing (changed from W41: noted on the board) |

Changes to the brief's starting list: **reordered** row A (title after the dead ends, as in the script);
**added** `w43-Perfect` and `w43-AddressBar` (the twist in three frames), `w43-Steps` (a list replaces narration
at #21 and returns ticked for the recap), `w43-AllGreen` (the grid's payoff); **split** step three into
`w43-ConnectDNS` and `w43-HttpsIssued`, and Before-you-go into `w43-Honest` and `w43-Renew`; **dropped** beat 46
(analytics), see script-deltas #25.

Budgets across the film: **transition sound 2** (into the title, into the dashboard) · **time-reverse 1**
(AddressBar → OneAddress) · **fixed chime 2** (Checker pass, end card) · **amber ≤ 1 object per frame**
(Copies: the magnifier · LinksList: the real Create button · ConnectDNS: the "Not connected" status ·
FourAddresses: the `https://www.` column; every other frame has none, apart from the logo and the site's
background glow).

The same five names run the whole film: `mybrand.com` is home; `mybrand.net`, `mybrand.co`, `mybrnad.com`
(the typo) and `getmybrand.com` (the flyer) travel from grey (unknown) to red (broken) to teal (working).

## Frames

### A1 · `w43-Domains` · beats 1–5 · dark mesh
- **One idea:** most brands own more than one domain, and every one is a way in.
- **In:** cut on her first word (cold open, no sound but the pad). The headline sits left; the glass pills
  cascade in on the right as she names them: .com, .net, .co, then the typo (swapped letters underlined in
  red, "the typo you bought"), then the flyer prop drops in with `getmybrand.com` ("the short one on flyers").
- **Out:** *dock*: the pills slide away as the dead ends open.
- **Sound:** pad only. **Feel:** "that's me".
- **On screen:** "Most brands own more than one domain." (7 words, ≥ 3.3 s) / "Every one is a way in." (6 words, ≥ 3.0 s).

### A2 · `w43-DeadEnds` · beats 6–7 · dark mesh, red glow
- **One idea:** an extra domain that leads nowhere is a visitor who almost reached you.
- **In:** cut. Three browser windows on a 3D carousel: parked page, "can't be reached", then *focus rack* to
  "Not secure" in the centre. Real browser UI, generic (no browser or registrar named).
- **Out:** cut to the title. **Sound:** one soft problem tone on "Not secure". **Feel:** a small, specific loss.
- **On screen:** "A visitor who almost reached you." ("almost" in red; 6 words, ≥ 3.0 s).

### A3 · `w43-Title` · beats 8–9 (merged) · brand sweep
- **One idea:** the promise.
- **In:** transition sound (1 of 2). First room change into colour. Five white dots *draw* into one, then the
  title; "With HTTPS on every one." lands in a glass pill on the perspective floor.
- **Out:** cut. **Hold:** ≈ 1.5 s. **Feel:** a promise, not a pitch.

### B1 · `w43-Pointer` · beats 10–11 · light
- **One idea:** a domain doesn't hold your website; it points to where it lives.
- **In:** room change to light (act B opens). The hook's `mybrand.com` pill becomes this glass pill; the dotted
  line *draws* to the paper address book (DNS), then to the site.
- **Out:** the one pill becomes five as the five sites rise into B2. **Feel:** "oh, it's just a pointer".
- **On screen:** "A domain doesn't hold your site. / It points to where it lives." Documentation IP 203.0.113.10.

### B2 · `w43-Perfect` · beats 12–14 · light · new
- **One idea:** way one looks perfect.
- **In:** five sites pop up in a 3 + 2 grid, one per domain, each "Welcome to mybrand"; each takes a teal tick.
- **Beat:** hold alone on "And it looks perfect." Leave the beat (script-deltas #4).
- **Out:** the room drops to dark red with every card in place (B3 shares the layout, so it reads as a reversal).
- **Feel:** "great, done". **On screen:** "It looks perfect." (3 words, ≥ 2.0 s).

### B3 · `w43-Copies` · beats 15–16 · twist night · the twist
- **One idea:** to Google, that's five copies, and it picks which address to show.
- **In:** the room plunges from light to dark red. The cards don't move: four drain to grey and get stamped
  COPY one by one; `mybrand.net` stays lit under the magnifier (the frame's only amber), with the chip
  "Google shows mybrand.net · Example".
- **Sound:** one soft problem tone as the room drops. **Feel:** the floor shifts.
- **Out:** push into the typo card's address bar.
- **On screen:** "To Google, that's five copies." (5 words, ≥ 2.7 s).

### B4 · `w43-AddressBar` · beat 17 · twist night · new
- **One idea:** the address bar shows whatever they typed, even the typo.
- **In:** push-in. One address bar fills the frame: `mybrnad.com`, the swapped letters red with a wavy
  underline; `mybrand.net` and `mybrand.co` stack behind it.
- **Then one second of silence.** That silence is the turn.
- **Out:** *time-reverse*, the film's only one: bar → cards → the five lines run back to their domains (into B5).
- **On screen:** "Same site. A different name every time." (7 words, ≥ 3.3 s) / "Whatever they typed stays in the bar.
  Even the typo." (10 words, ≥ 4.3 s).

### B5 · `w43-OneAddress` · beats 18–20 · dark mesh
- **One idea:** one main address; a 301 from every other domain.
- **In:** ...and the lines re-route: four glass pills fan into one glowing node, then a thick teal line runs
  to the white card `https://mybrand.com`; a 301 tag pops onto each line on "with a 301".
- **Out:** the main card *docks* as the steps come up. **Sound:** a pop per tag. **Feel:** relief.
- **On screen:** "One main address. / A 301 from every other domain." (9 words, ≥ 4.0 s).

### C1 · `w43-Steps` · beat 21, reused at the recap (49) · brand radial
- **One idea:** three steps and one test.
- **In:** cut. Three frosted cards rise in a staircase on the floor; each carries a three-dash progress mark.
  The VO says only "Three steps, and one test."
- **Out:** transition sound (2 of 2); card 01 *morphs* into step one and the room turns light.
- **Recap (49):** the same frame returns; each card takes a teal check as she names it.

### C2 · `w43-MainAddress` · beats 22–24 · light
- **One idea:** choose the main address, exactly as people should see it.
- **In:** the four other names dim to small glass chips; the main address rises on a white card ringed teal,
  tilted a little. "https" and "no www" land on "exactly". The tip card slides in beside.
- **Eyebrow:** STEP ONE, progress bar 1 of 3. **Feel:** a decision, made calmly.
- **On screen:** tip "Keep the one that already ranks, or has links." (9 words, ≥ 4.0 s).

### C3 · `w43-DomainRedirect` · beats 25–29 · light
- **One idea:** one Domain Redirect, filled in.
- **In:** Links → Create → Domain Redirect, three quick cuts on her three words (the prototype's create chooser).
  The full-page "New domain redirect" form: Redirect from `mybrand.net` → Redirect to `https://mybrand.com`;
  "301 · Permanent" on "Type"; "Keep the path" on "path"; What happens fills with three example hops. On #29 the
  form's own hint "A root domain also covers www." takes a teal ring.
- **Out:** Save → success sound → cut to the list. **Progress bar:** 2 of 3.
- **Source:** the Unified Links prototype's `03-create-redirect` page (open-questions UI-1, UI-10, UI-11).

### C4 · `w43-LinksList` · beats 30–32 · light
- **One idea:** every other domain gets its own redirect, all to the same place.
- **In:** the prototype's Links list in the new shell (sidebar, breadcrumb "My Brand / Links", orange split Create).
  Four cards arrive one by one, each `↳ https://mybrand.com` (a pop each). The CSV tip slides in on "dozens".
- **Amber:** the real Create button. **On screen:** "Import them all from one CSV." (6 words, ≥ 3.0 s).

### C5 · `w43-ConnectDNS` · beats 33–38 · light
- **One idea:** point each domain at RedirHub in its DNS.
- **In:** Hostnames → Connect DNS, the real dialog on its Automatic tab, over the new shell (dimmed, Hostnames active). Rows highlight as she names A, TXT and
  the www CNAME. The MX tip slides in on #38. **Progress bar:** 3 of 3.
- **Amber:** the "Not connected" status. The dialog shows the real edge IP: the VO says "copy yours, not mine".

### C6 · `w43-HttpsIssued` · beat 39 · brand sweep
- **One idea:** HTTPS is issued automatically: the padlock, on every domain.
- **In:** the three steps tick down the list. On "automatically" the room floods with the brand sweep (the
  payoff) and a big white padlock grows out of the dialog.
- **Sound:** success. **On screen:** "The padlock, on every domain." (5 words, ≥ 2.7 s).

### D1 · `w43-FourAddresses` · beats 40–43 · lab
- **One idea:** every domain is four addresses: four extra domains, sixteen ways in.
- **In:** the number "16" slams in, then the grid fills row by row (*draw*). On "easiest to forget" the
  `https://www.` column takes the amber outline and its label "Start here · the easiest to forget".
- **Out:** *shared-element morph*: the amber cell `https://www.mybrand.net` flies into the checker's input.
- **On screen:** "16 ways in." / "Four extra domains, four versions each." (6 words, ≥ 3.0 s).

### D2 · `w43-Checker` · beats 43–45 · lab, teal glow
- **One idea:** what a pass looks like.
- **In:** the morph lands in the input; Check Redirect; the chain *draws*: hop 1, 301, hop 2, 200. The three
  checks land on "One hop. A 301. Lands on...", then the solid teal pill "That's a pass."
- **Sound:** **fixed chime** on "That's a pass" (1 of 2). **Feel:** proof, not promise.
- **Flag:** the checker page is real; its result layout is drawn, not captured (open-questions UI-4).

### D3 · `w43-AllGreen` · new · brand radial
- **One idea:** all sixteen land on one address.
- **In:** the room flips from lab to colour; the grid's pills turn white with teal ticks row by row; "16" becomes "16/16".
- **Out:** *silence* (done), then the honest note. **Sound:** four pops, one per row.

### D4 · `w43-Honest` · beat 47 · charcoal
- **One idea:** forwarding catches people; it doesn't lift rankings on its own.
- **In:** *register change*: no effect. The teal card (what it does) lands and holds, then the grey card (what it
  doesn't). **Feel:** trust.

### D5 · `w43-Renew` · beat 48 · light
- **One idea:** keep renewing every domain you forward.
- **In:** cut. The flyer domain and a paper renewal calendar (date labelled "Example date"); "someone else can
  buy it" in red.
- **Out:** the steps return ticked for the recap (49), then the end card.

### D6 · `w43-EndCard` · beats 50–52 · dark mesh (the site's hero)
- **One idea:** five domains, one website.
- **In:** the five hook pills turn teal and collapse into the headline.
- **Hold:** the end screen sits in the clear right half. **Sound:** **fixed chime** (2 of 2).
- **On screen:** "Five domains." / "One website." · "Links to everything are in the description." ·
  "Stuck? Reach out. We're happy to help." · logo · QR slot "Branded QR · link pending" (no fake code).

## Checks run on every frame (`stills/`)

`PREFIX=w43- python3 scripts/yt/keyframes-check.py style-canvas/project style-canvas/stills` renders every frame in
local Chromium with the brand fonts, then checks it in the page and on the PNG:

- 1920 × 1080; no text outside the 120 px gutters; no text and no ink below y 950 (film frames). Decorative
  background layers (grids, floors, glows) are marked `data-bg` and compared against a background-only render
  of the same frame, so they may bleed to the edge; nothing else may.
- Fonts: Plus Jakarta Sans for display, eyebrows and captions; JetBrains Mono for every domain, URL and record
  (ligatures off, so "://" never splits); Inter only inside recreated product or browser UI.
- Colours: every computed colour is a `yt` token, a brand `color.*` token, a paper token, a colour from the
  website's stylesheet (the room gradients), or the browser's three window dots.
- Amber: at most one object per frame (list above).
- Result: all 22 frames pass, 0 rule hits, 0 ink outside the safe area. One idea per frame was reviewed by eye.
