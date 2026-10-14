# W43 key frames: "How to Forward Multiple Domains to One Website (With HTTPS)"

Key-frame pass for **Review 2** (workflow step 2), 2026-10-14. Publishes Oct 19.
Canvas: **RedirHub YouTube Style Frames**, page **W43 · How to Forward Multiple Domains to One Website**:
https://claude.ai/artifact/VtcXcWtwwRQWjWYbN2TcCx (private until shared).
Source: `style-canvas/project/` (one `.dc.html` per frame, plus `canvas.json` as it stands after this video).
Stills: `style-canvas/stills/` (rendered locally, checked against the brief's fit rules).

**Direction:** many names, one home. Every frame below is the peak moment of its beat: the state the viewer
remembers. Where motion is the point, the frame shows the end state and the move is described here and in
the frame's sticky on the canvas.

## The film at a glance

| # | Frame | Beats | The one idea |
|---|---|---|---|
| A1 | `w43-Domains` | 1–5 | You own more than one name, and every one is a way in |
| A2 | `w43-DeadEnds` | 6–7 | An extra domain that leads nowhere is a visitor you almost had |
| A3 | `w43-Title` | 8–9 | The promise: every domain, one website, with HTTPS |
| B1 | `w43-Pointer` | 10–11 | A domain doesn't hold the site; it points to where it lives |
| B2 | `w43-Copies` | 12–17 | **The twist:** pointing them all at the hosting makes five copies, and Google picks the address |
| B3 | `w43-OneAddress` | 18–20 | The fix: one main address, a 301 from every other domain |
| C1 | `w43-Steps` | 21 (+ recap 49) | Three steps and one test |
| C2 | `w43-MainAddress` | 22–24 | Step one: choose the main address, exactly as people should see it |
| C3 | `w43-DomainRedirect` | 25–29 | Step two: one Domain Redirect, filled in |
| C4 | `w43-LinksList` | 30–32 | Every other domain gets its own redirect, all to the same place |
| C5 | `w43-ConnectDNS` | 33–38 | Step three: point each domain at RedirHub in its DNS |
| C6 | `w43-HttpsIssued` | 39 | HTTPS is issued automatically: the padlock on every domain |
| D1 | `w43-FourAddresses` | 40–43 | Every domain is four addresses: sixteen ways in |
| D2 | `w43-Checker` | 43–45 | What a pass looks like: one hop, a 301, lands on the main address |
| D3 | `w43-AllGreen` | (new) | All sixteen land on one address |
| D4 | `w43-Honest` | 47 | Forwarding catches people; it doesn't lift rankings on its own |
| D5 | `w43-Renew` | 48 | Keep renewing every domain you forward |
| D6 | `w43-EndCard` | 50–52 | Five domains. One website. |
| S1 | `w43-System` | — | Colour, type, layout (changed from W41: noted on the board) |
| S2 | `w43-Sound` | — | Sound and timing (changed from W41: noted on the board) |

Changes to the brief's starting list: **reordered** row A (title after the dead ends, as in the script);
**added** `w43-Steps` (a list replaces narration at #21 and returns ticked for the recap), `w43-AllGreen`
(the grid's payoff); **split** step three into `w43-ConnectDNS` and `w43-HttpsIssued`, and Before-you-go
into `w43-Honest` and `w43-Renew`; **dropped** beat 46 (analytics), see script-deltas #14.

Budgets across the film: **transition sound 2** (into the title, into the dashboard) · **time-reverse 1**
(Copies → One address) · **fixed chime 2** (Checker pass, end card) · **amber ≤ 1 object per frame**
(Copies: the address Google picked · LinksList: the real Create button · ConnectDNS: the "Not connected"
status · FourAddresses: the https://www. column; every other frame has none).

The same five pills run the whole film: `mybrand.com` is home; `mybrand.net`, `mybrand.co`, `mybrnad.com`
(the typo) and `getmybrand.com` (the flyer) travel from grey (unknown) to red (broken) to teal (working).

## Frames

### A1 · `w43-Domains` · beats 1–5
- **One idea:** you own more than one name, and every one is a way in.
- **In:** cut on her first word (cold open, no eyebrow, no sound but the pad). Each pill appears on its name:
  .com, .net, .co, then the typo with its swapped letters underlined, then the flyer domain.
- **Out:** *dock*: the pills slide left and shrink as the dead ends open (they become context).
- **Sound:** pad only. **Feel:** "that's me". Recognition, no judgement.
- **On screen:** "Every one is a way in." (6 words, holds ≥ 3.0 s). Labels "the typo you bought", "on your flyers".

### A2 · `w43-DeadEnds` · beats 6–7
- **One idea:** an extra domain that leads nowhere is a visitor who almost reached you.
- **In:** cut. Parked page, then "can't be reached", then *focus rack* to "Not secure" in the centre
  (three places, one job). Real browser UI, generic (no browser or registrar named).
- **Out:** cut to the title.
- **Sound:** one soft problem tone on "Not secure". **Feel:** a small, specific loss.
- **On screen:** "A visitor who almost reached you." (6 words, ≥ 3.0 s).

### A3 · `w43-Title` · beats 8–9 (merged)
- **One idea:** the promise.
- **In:** transition sound (1 of 2). Five grey dots *draw* into one teal dot (the film's whole story in a
  mark), then the title: keyword first, "With HTTPS on every one." in teal.
- **Out:** cut. **Hold:** ≈ 1.5 s. **Feel:** a promise, not a pitch.
- **On screen:** "How to forward multiple domains to one website." (8 words, ≥ 3.7 s across the title and
  the VO question) · "With HTTPS on every one." (5 words, ≥ 2.7 s).

### B1 · `w43-Pointer` · beats 10–11
- **One idea:** a domain doesn't hold your website; it points to where it lives.
- **In:** *shared-element morph*: the hook's mybrand.com pill becomes this pill. The line *draws* to the
  address book (DNS, the W41 metaphor kept on purpose), then to the site.
- **Out:** the one pill becomes five, every line drawing into the same host (into B2).
- **Sound:** none. **Feel:** "oh, it's just a pointer".
- **On screen:** "A domain points to where your site lives." (8 words, ≥ 3.7 s). Documentation IP 203.0.113.10.

### B2 · `w43-Copies` · beats 12–17 · the twist
- **One idea:** pointing every domain at the hosting makes five copies, and Google picks which address to show.
- **In:** *draw*: five lines run into one host; five identical windows stack, each with its own address,
  the typo in front (so the address bar shows the misspelled brand while the site looks perfect).
- **The beat:** hold the deck alone on "It looks perfect." Then the search card slides in and the address it
  picked, `mybrand.net`, lights amber (the frame's only amber). One soft problem tone. **One second of
  silence.** That silence is the turn.
- **Out:** *time-reverse*, the film's only one: the deck unstacks and the five lines run back to their
  domains... (into B3).
- **Sound:** one problem tone, then silence, then the rewind. **Feel:** the floor shifts.
- **On screen:** "Five copies. Google picks which one to show." (8 words, ≥ 3.7 s). "SEARCH RESULT · EXAMPLE".

### B3 · `w43-OneAddress` · beats 18–20
- **One idea:** one main address; a 301 from every other domain.
- **In:** ...and the same lines re-route: the four extra domains swing into `https://mybrand.com`; a 301 tag
  pops onto each line on "with a 301". (The rewind and the re-route are one gesture: redo, done right.)
- **Out:** the main pill *docks* as the step map comes up.
- **Sound:** a pop per tag. **Feel:** relief. That is what clean looks like.
- **On screen:** "One main address. A 301 from every other domain." (9 words, ≥ 4.0 s).

### C1 · `w43-Steps` · beat 21, reused at the recap (49)
- **One idea:** three steps and one test.
- **In:** cut. A list replaces narration: the VO says only "Three steps, and one test."
- **Out:** transition sound (2 of 2) into the dashboard; card 01 *morphs* into step one.
- **Recap (49):** the same frame returns; each card takes a teal check as she names it.
- **On screen:** card titles (3–4 words each), "Then one test: every version of every domain." (8 words, ≥ 3.7 s).

### C2 · `w43-MainAddress` · beats 22–24
- **One idea:** choose the main address, exactly as people should see it.
- **In:** *shared-element morph*: the main pill from B3 grows; the other four dim. The chips "https" and
  "no www" land on "exactly". The tip slides in beside (*register change*: an aside).
- **Out:** cut into the dashboard.
- **Sound:** a pop on the tip. **Feel:** a decision, made calmly.
- **On screen:** tip "Keep the one that already ranks, or has links." (9 words, ≥ 4.0 s).

### C3 · `w43-DomainRedirect` · beats 25–29
- **One idea:** one Domain Redirect, filled in.
- **In:** Links → Create → Domain Redirect: three quick cuts on her three words (the create chooser is the
  real one, `reference/links-create-chooser.png`). Fields fill on her words; "301 Permanent" on "Type";
  Keep path flips teal on "path" with its `/pricing` hint. "www comes along" *docks* beside on #29.
- **Out:** Save → success sound → cut to the list.
- **Sound:** success on Save. **Feel:** easy.
- **On screen:** "www comes along" / `www.mybrand.net` / "A root domain covers its www." (6 words, ≥ 3.0 s).
- **Flag:** this form has no screenshot; labels follow W41's recreation (open-questions UI-1, UI-2).

### C4 · `w43-LinksList` · beats 30–32
- **One idea:** every other domain gets its own redirect, all to the same place.
- **In:** cut on Save. Four rows arrive one by one, each `↳ https://mybrand.com` (a pop each).
  The CSV tip slides in on "dozens" (*register change*).
- **Out:** cut to Hostnames.
- **Amber:** the real Create button (the frame's only amber).
- **On screen:** "Import them all from one CSV." (6 words, ≥ 3.0 s), "Create → Import CSV".

### C5 · `w43-ConnectDNS` · beats 33–38
- **One idea:** point each domain at RedirHub in its DNS.
- **In:** Hostnames → Connect DNS: the real dialog on its Automatic tab (`reference/connect-dns-automatic-root-www.png`).
  Rows highlight as she names A, TXT and the www CNAME. The MX tip slides in on #38 (*register change*).
- **Out:** cut to the checks (C6).
- **Sound:** none. **Amber:** the "Not connected" status. **Feel:** clear, even for someone who has never
  opened DNS.
- **On screen:** tip "Leave MX records alone." / "They're your email." The dialog shows the real edge IP:
  the VO must say "copy yours, not mine" (rule v0.3 #4, script-deltas #10).

### C6 · `w43-HttpsIssued` · beat 39
- **One idea:** HTTPS is issued automatically: the padlock, on every domain.
- **In:** the three steps tick down the list (`reference/connect-dns-verifying.png`, final state). On
  "automatically" the padlock closes and grows out of the dialog (*shared element*).
- **Out:** cut to the test.
- **Sound:** success. **Feel:** step three pays off.
- **On screen:** "The padlock, on every domain." (5 words, ≥ 2.7 s).

### D1 · `w43-FourAddresses` · beats 40–43
- **One idea:** every domain is four addresses: four extra domains, sixteen ways in.
- **In:** one domain splits into four (2 × 2), then the grid fills row by row to sixteen (*draw*). On
  "easiest to forget" the `https://www.` column takes the amber outline.
- **Out:** *shared-element morph*: the amber cell `https://www.mybrand.net` flies into the checker's input.
- **Sound:** none (the grid filling is quiet). **Feel:** "I would have missed those."
- **On screen:** "Four extra domains. Sixteen ways in." (6 words, ≥ 3.0 s).

### D2 · `w43-Checker` · beats 43–45
- **One idea:** what a pass looks like.
- **In:** the morph lands in the input; Check Redirect; the chain *draws*: hop 1, 301, hop 2, 200. The three
  checks land on "One hop. A 301. Lands on...".
- **Out:** cut back to the grid. Beat 45 (DNS may need a few minutes) is VO only.
- **Sound:** **fixed chime** on "That's a pass" (1 of 2). **Feel:** proof, not promise.
- **On screen:** "One hop", "A 301", "Lands on https://mybrand.com", "That's a pass." (3 words, ≥ 2.0 s).
- **Flag:** the checker page is real (redirhub.com/redirect-checker: "Check Any URL Redirect", "Check
  Redirect"); its result layout is drawn, not captured (open-questions UI-4).

### D3 · `w43-AllGreen` · new
- **One idea:** all sixteen land on one address (the brief's one allowed combined result).
- **In:** back to the grid; the rows turn teal one by one.
- **Out:** *silence* (done), then the honest note.
- **Sound:** four pops, one per row. **Feel:** finished.
- **On screen:** "All sixteen land on https://mybrand.com" (5 words, ≥ 2.7 s).

### D4 · `w43-Honest` · beat 47
- **One idea:** forwarding catches people; it doesn't lift rankings on its own.
- **In:** *register change*: the film steps back and talks straight. No effect. The white line holds, then
  the soft line lands.
- **Out:** cut. **Feel:** trust.
- **On screen:** "Forwarding catches people." (3 words, ≥ 2.0 s) / "It doesn't lift rankings on its own." (7 words, ≥ 3.3 s).

### D5 · `w43-Renew` · beat 48
- **One idea:** keep renewing every domain you forward.
- **In:** cut. The flyer domain and its renewal card (the date is labelled as an example).
- **Out:** the step map returns ticked for the recap (49), then the end card.
- **Sound:** none. **Feel:** a friend's reminder.
- **On screen:** "Keep renewing every domain you forward." (6 words, ≥ 3.0 s) / "If one expires, someone else can buy it." (8 words, ≥ 3.7 s).

### D6 · `w43-EndCard` · beats 50–52
- **One idea:** five domains, one website.
- **In:** the five hook pills turn teal and collapse into the headline (the callback: "Every name you own.
  One website." is the VO; the headline is the brief's).
- **Hold:** the end screen (next week's video, subscribe) sits in the clear right half.
- **Sound:** **fixed chime** (2 of 2), then the pad resolves. **Feel:** done, and welcome back.
- **On screen:** "Five domains." / "One website." · "Links to everything are in the description." (7 words,
  ≥ 3.3 s) · "Stuck? Reach out. We're happy to help." (7 words, ≥ 3.3 s) · logo · QR slot "Branded QR ·
  link pending" (no fake code).

## Checks run on every frame (`stills/`)

Rendered in local Chromium with the brand fonts, then checked in the page and on the PNG:

- 1920 × 1080; no text outside the 120 px gutters; no text and no ink below y 950 (film frames).
- Fonts: Plus Jakarta Sans for display, eyebrows and captions; JetBrains Mono for every domain, URL and record
  (ligatures off, so "://" never splits); Inter only inside recreated product or browser UI.
- Colours: every computed colour is a `yt` token, a brand `color.*` token (product UI), a paper token
  (printed props), or the browser's three window dots. The logo uses its own approved file colours.
- Amber: at most one object per frame (list above).
- Hold: every line's minimum hold is listed above; the longest is 4.0 s.
- One idea per frame: reviewed by eye on every still.
