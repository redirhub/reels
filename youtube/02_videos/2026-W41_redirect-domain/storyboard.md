# Storyboard — "How to redirect a domain to another domain (with HTTPS that actually works)"

Version: v3 storyboard for Leo's checkpoint (2026-10-06). Maps every line of `script.md` v3 to one
screen, names the transition into each beat and what it means, and lists the component each
screen is built from. Times are the current estimate (155 wpm + breath + visual beats); Phase 3
replaces them with the voiceover's word timestamps. Total ≈ 5:54 estimated; expect 5:20–5:50 once
the VO is recorded at channel pace.

**World:** Night canvas with fine grain. Two "worlds" only: *Night* (ideas, metaphors, captions) and
*the white card* (browsers, the RedirHub dashboard, printed things). Every object is one of the
channel components (§Components). Nothing else is drawn.

**Transition grammar (meaning, not decoration):**
- **Cut on the beat** — the default. One idea leaves, the next arrives on the VO beat.
- **Shared-element morph** — the same object becomes the next idea (note → 301 card; padlock → ID
  card; three glyphs → progress rail; small callback frame → full frame). Means: *same thing, new
  understanding.*
- **Dock** — an element shrinks to a fixed position and stays (the domain pills, the idea rail).
  Means: *we're still talking about this; it's now context.*
- **Draw** — the redirect line draws from one URL to another with traffic dots. Means: *people are
  moving.*
- **Time-reverse** — one use only, the twist. Means: *we're going to redo that.*
- **Register change** — a tip card slides in from the right over the scene. Means: *an aside.*
- **Focus rack** — the dashboard shifts left and a panel appears beside it. Means: *two places,
  one job.*
- **Silence** — the end card holds with only the fixed chime. Means: *done.*

Hold rule: every on-screen line holds ≥ 1 s, longer lines (words ÷ 3) + 1 s. `<OnScreenText>`
throws at render time if a line is shorter, so retiming can't break it.

---

## ACT A — Hook (beats 1–10, 0:00–0:58) · `HookScene.tsx`

| # | VO | Screen (one idea) | In-transition and meaning | Components |
|---|---|---|---|---|
| 1 | When people decide to move to a new domain… | `mydomain.com` pill rises; `mybrand.com` pill slides in beside it. | Fade from Night. *A decision: two names.* | UrlPill |
| 2 | They buy the new one, switch on forwarding… land on the new site. | Redirect line draws old → new; a white browser card lands under them showing mybrand. | Draw. *Traffic moves.* | RedirectLine, BrowserCard, SkeletonPage |
| 3 | And honestly? Fair enough. It looks done. | Everything settles. Line and dots turn teal. Caption "Fair enough. **It looks done.**" Then 1.6 s of stillness. | Settle, then hold. *This is the frame we'll come back to.* | Caption |
| 4 | But here's what a half-done move does… | Card and new pill slide away; the old pill docks top-left and its dot cools to grey, then red. | Dock. *Stay with the old domain.* | UrlPill |
| 5 | Some old links open with a warning: "Not secure." | Browser card: `mydomain.com`, red dot, the browser's not-secure interstitial. Label: *Not secure.* | Cut. | BrowserCard, NotSecurePage |
| 6 | Others dump people on the homepage… | Mono URL `mydomain.com/menu` above a card showing the mybrand homepage; the `/menu` falls off the URL and strikes through. | Cut. *The path is lost.* | BrowserCard, SkeletonPage |
| 7 | Some pages are just… gone. | Card: "This page doesn't exist." Red dot. | Cut, lands on "gone". | BrowserCard, NotFoundPage |
| 8 | Google can't follow the move, so your rankings slip. | A search-results card; the top result for mydomain fades and sinks; "#1 → #7" in red. | Cut. *Ranking is a position; it moves.* | (local) SearchResult |
| 9 | And the QR code on your menu? The link in that email…? Dead. | A printed menu with a branded QR (label `mydomain.com/menu`); scan line finds "No page". An old email with the dead link. | Cut; two objects, one idea (printed and posted). | BrandedQr, (local) DeadPrint |
| 10 | So how do you move your domain the right way, and keep it secure? It's simpler than you think. | Problems sweep off. Title: "How to redirect a domain to another domain." / "With HTTPS that actually works." (teal). | Sweep to title. *The promise.* 2.6 s hold. | OnScreenText |

## ACT B — Three ideas (beats 11–24, 0:58–3:03) · `IdeasScene.tsx`

| # | VO | Screen | Transition / meaning | Components |
|---|---|---|---|---|
| 11 | Three ideas, and then we do it. | Three outline glyphs centre stage: note, book, ID card. Caption "Three ideas. Then we do it." | Fade in. *An unfinished list (open loop).* | IdeaGlyph |
| 12 | Idea one: a redirect is a note on the door. | Glyphs dock top-right as a rail (outlines). Tag "IDEA ONE · THE NOTE ON THE DOOR". Two houses; a note pins to the old door. | Dock + reveal. | Tag, (local) House |
| 13 | Your old domain is a house you've moved out of… right room, not just the front door. | A visitor dot walks to the old door; the path bends to the new house and a specific window lights (amber, the scene's one amber). Caption "The right room, not just the front door." | Draw. *Traffic re-routed, with intent.* | RedirectLine |
| 14 | The internet has a specific note for this: a 301… update your records. | The paper note morphs into a card: "301 · Moved permanently." Two glass cards: "Browsers follow it instantly", "Google ✓ updates its records". | Shared-element morph. *Same note, official name.* | GlassCard |
| 15 | Idea two: DNS is the internet's address book. | Rail highlights the book. A closed address book opens (3D page). | Cut + open. | (local) AddressBook |
| 16 | Type a domain… those entries are called records. | Right page: `mydomain.com` row, its number highlighted. Label "← A RECORD" appears. Caption "The entries are called records." | Focus. *Name → number.* | |
| 17 | Moving the right way means changing a couple of those records… hands out the note. | The number swaps to the new one; a glass card beside the book: "Points at something that hands out the note · 301". | Swap. *One edit, new destination.* | GlassCard |
| 18 | Idea three: the padlock is an ID card. | A large padlock; it slides left and an ID card prints itself beside it (CERTIFICATE · Issued to · Issued by · Valid). | Shared-element morph. | Padlock, IdCard |
| 19 | Over HTTPS, a site shows an ID card first… keeps the connection private. | `https://mybrand.com` in mono; "ID shown → padlock closes". | Hold. | |
| 20 | No certificate, no padlock. A warning instead of your page. | Browser card for mydomain with the not-secure page; a small red "Missing" ID card tucked at its corner. | Cut. | BrowserCard, IdCard(valid=false) |
| 21 | Here's the catch… checks the ID before it reads the note. | Four glass steps, left to right: Browser arrives → Checks the ID card (accented) → Reads the note → New home. | Sequence reveal. *Order matters.* | GlassCard |
| 22 | And browsers are getting stricter: Chrome is rolling out a warning… | Card: `http://mydomain.com`, Chrome-style interstitial. Footnote: "Chrome · 'Always use secure connections', rolling out as the default for public sites". | Cut. | NotSecurePage |
| 23 | To be fair to registrars… Padlock? You're fine. Warning? Keep watching. | Two glass cards: SOME DO (padlock + `https://mydomain.com`), SOME DON'T (warning). Then: "Here's how to check: `https://` in front. Padlock, or warning?" | Side by side. *Fairness, then a test the viewer can run now.* | GlassCard, Padlock |
| 24 | That's it. Three ideas… Now let's use them. | The rail's three glyphs fill teal one by one. Caption "The note. The address book. The ID card." | Fill. *Loop closed; list complete.* | IdeaGlyph |

## ACT C — Walkthrough in RedirHub (beats 25–36, 3:03–4:23) · `WalkthroughScene.tsx`, `Dash.tsx`

| # | VO | Screen | Transition / meaning | Components |
|---|---|---|---|---|
| 25 | Here's how to do it the right way. | The dashboard window rises into frame: `dash.redirhub.com/links`, Links list with three healthy rows. | Rise. *New world: the product.* | DashWindow, LinksPage |
| 26 | Full disclosure: we make RedirHub… same idea anywhere. | Hold on the Links list. The idea rail (empty) sits top-right. | Hold. | |
| 27 | Old domain: mydomain.com. New site: mybrand.com. | The two pills dock top-left with an arrow between them and stay for the act. | Dock. | UrlPill |
| 28 | Step one: write the note. Links → Create → Domain Redirect. | Tag "STEP ONE · WRITE THE NOTE". Cursor: Create → the chooser (Branded Link, Dynamic QR Code, Domain Redirect, Website Migration) → Domain Redirect. | Cursor action. | CreateChooser, Cursor |
| 29 | Redirect from… Redirect to… Type: 301. And keep the path on. | The form fills field by field; 301 chip selects; Keep path toggles teal with "/menu → /menu" under it. | Typing. *Each field is one of the taught ideas.* | DomainRedirectForm |
| 30 | Save. One idea down. | Save → toast "Redirect created"; the new row appears highlighted; rail: note fills. | Confirm. | Toast, IdeaGlyph |
| 31 | Step two: the address book. RedirHub shows you exactly which records to change. | Tag "STEP TWO". Hostnames page: `mydomain.com` "DNS not connected yet" → Connect DNS → the window opens on **Manual**. | Cursor action; dialog rises. | HostnamesPage, ConnectDns |
| 32 | For a root domain, that's two: an A record… a TXT record… Plus a CNAME for www. | The records table: A @ · TXT @ · CNAME www with Copy buttons. (Values in the real format; VO later says "copy yours".) | Hold; rows highlight with the VO. | ConnectDns |
| 33 | Quick tip. Before you touch anything in your DNS, screenshot it… | Tip card slides in from the right: "Screenshot your DNS first." / "Thirty seconds now, zero regret later." | Register change. | TipCard |
| 34 | Now open your DNS, wherever your domain lives… copy yours, not mine. | Focus rack: dashboard shifts left; a glass "YOUR DNS PROVIDER" panel appears; the three values fly across one by one (Copy → Copied). Caption "Copy yours, not mine…" | Focus rack. *Two places, one job.* | GlassCard |
| 35 | Back in RedirHub, it checks every few seconds… Two green checks: DNS. HTTPS. | Panel leaves. In the window: rows flip to "Found"; DNS check spins → green; HTTPS "Issuing certificate…" → green. Rail: book, then ID fill. | Progress. *The ID card issues itself.* | ConnectDns |
| 36 | That's the whole setup. Idea three took care of itself. | Hold on two green checks; rail complete. Caption "The note. The address book. The ID card, automatically." | Hold (1 s quiet). | |

*Left out of the VO for length:* the **Automatic** tab (Domain Connect; Cloudflare today). It's LIVE
and approved (Product Facts, 2026-10-05). `ConnectDns` has the tab built; it goes in the
description and can be a 6 s insert if Leo wants it.

## ACT D — Test, twist, checks, close (beats 37–53, 4:23–5:54) · `TestScene.tsx`, `CloseScene.tsx`, `FixedEndCard.tsx`

| # | VO | Screen | Transition / meaning | Components |
|---|---|---|---|---|
| 37 | Let's test it. Open a browser, type mydomain.com… | Browser card; the address types. | Cut to Night + card. | BrowserCard |
| 38 | …and it's still the old site. | Loading bar; the old site loads; grey dot. A beat. | Load. *Anticlimax.* | SkeletonPage |
| 39 | Hold on. Your redirect might be fine. It's your test that's wrong. | Time runs backwards: the page unloads, the address un-types, the card desaturates slightly; "◀◀" under it. Caption with the line. | **Time-reverse.** *Redo, not retry.* | |
| 40 | Browsers keep copies… First rule of testing a move: a private window… | A dark private-window card slides over the first. Tip card: "Test in a private window." / "No copies, no leftovers." | Overlay + register change. | BrowserCard(dark), TipCard |
| 41 | Same address, private window… and there it is. mybrand.com. Padlock. | Types mydomain.com → resolves to `https://mybrand.com`, padlock, teal dot. | Load → land. *Payoff.* | |
| 42 | *(no VO)* | Caption only: "Still the old site? Give DNS a few minutes." | Hold 4.2 s. | Caption |
| 43 | Three quick checks. | The card leaves; heading "Three quick checks." | Cut. | |
| 44 | One: the old domain, with https in front… padlock. | Row 1: badge · `https://mydomain.com` → line → `https://mybrand.com`. Badge ticks. | Draw. | ChecklistBadge, UrlPill, RedirectLine |
| 45 | Two: an old deep link lands on the same page… | Row 2: `mydomain.com/menu` → `mybrand.com/menu`. Badge ticks. | Draw. | |
| 46 | Three: the www version works too. | Row 3: `www.mydomain.com` → `mybrand.com`. Badge ticks. | Draw. | |
| 47 | All three green. | The one allowed combined screen: three ticked rows, a teal rule, "All three green." | Hold. *Promise paid.* | |
| 48 | Two things before you go. | Tag "BEFORE YOU GO"; two empty glass slots. | Cut. | GlassCard |
| 49 | A padlock means the connection is private, not that the site is honest… | Slot one: padlock + the ID card; "A padlock means private. Not honest." / "An ID card, not a character reference." | Fill slot. | Padlock, IdCard |
| 50 | And don't let the old domain expire… | Slot two: `mydomain.com` pill (teal) and a calendar card that flips 2027 → 2028, "auto-renew on". | Fill slot; flip. | UrlPill |
| 51 | Remember the start? Forwarding on, old link opens, looks done. | Tips leave. The beat-3 frame appears small in the bottom-right corner (grey line, grey dot). Caption "Forwarding on. Old link opens. Looks done." | **Callback.** | (recreated beat 3) |
| 52 | Now it is. | The small frame expands to full screen; the line redraws teal with traffic; every dot turns teal. Caption "Now **it is.**" Fade to Night. | Shared-element morph. *Same picture, now true.* | RedirectLine |
| 53 | *(no VO)* | End card: "Old domain." white / "Fixed." teal; white logo; branded QR `redirhub.com/qr` with its label. Right half clear for end-screen elements. Silence but the fixed chime. | **Silence.** 6 s. | FixedEndCard, BrandedQr |

---

## Style frames rendered for the checkpoint

`style-frames/` (1920×1080 PNG, rendered from the composition itself, not mock-ups):

| File | Beat | What to judge |
|---|---|---|
| `01-looks-done.png` | 3 | The frame we come back to. Quiet, two pills, teal line, white card. |
| `02-not-secure.png` | 5 | The first concrete problem: red dot, browser warning, docked old pill. |
| `03-title.png` | 10 | The promise. Plus Jakarta Sans 800, teal second line. |
| `04-note-on-the-door.png` | 13 | The house metaphor; the path bends into the lit room (the scene's one amber). |
| `05-301-card.png` | 14 | The note has become "301 · Moved permanently"; houses fade back. |
| `06-id-card.png` | 19 | The padlock and the certificate as an ID card. |
| `07-create-redirect.png` | 29 | Links → Create → Domain Redirect, form filled, Keep path on. |
| `08-connect-dns.png` | 32 | The Connect DNS window, Manual tab, three records with Copy. |
| `09-rewind.png` | 39 | The twist: time runs backwards on the first test. |
| `10-three-checks.png` | 47 | The one combined screen: three ticked rows, "All three green." |
| `11-end-card.png` | 53 | "Old domain. / Fixed.", white logo, branded QR; right half clear. |

`style-frames/more/`: the Links list (26), the Create chooser (28), the ID-before-note sequence (21),
the DNS split view (34), DNS and HTTPS verifying (35), the private window (41), the DNS caption (42),
the closing tips (49–50), "Now it is." (52). Real product screenshots for comparison: `reference/`.

## Components (shared, in `src/remotion/components/`)

| Component | What | Reuse |
|---|---|---|
| `BrowserCard` (+ `SkeletonPage`, `NotFoundPage`, `NotSecurePage`) | White browser card: address bar, lock state (secure / insecure / none), status dot; dark = private window | Any "a website" moment |
| `UrlPill` | JetBrains Mono URL in a glass or white pill with a red / teal / amber / grey dot; optional strike | Any URL on Night |
| `RedirectLine` | Arc from A to B with arrow head, draw progress and travelling traffic dots | Any redirect, any flow |
| `GlassCard` | Frosted card on Night, optional accent bar | Tips, metaphors, side panels |
| `Padlock` | Open/closed padlock | HTTPS moments |
| `IdCard` | The certificate as an ID card (issued to / by / Valid or Missing) | HTTPS teaching |
| `ChecklistBadge` | Self-drawing check with label | Any checklist |
| `FixedEndCard` | "<Problem>. Fixed." end card with logo and branded QR, end-screen-safe layout | Every video |
| `OnScreenText` | Copy with the hold rule enforced at render time | Every caption |
| `Grain`, `Cursor`, `BrandedQr` | Existing | |

Video-local pieces (`src/remotion/reels/redirect-domain/`): `Stage.tsx` (Night, pills, Caption,
TipCard, Tag), `Dash.tsx` (dashboard: Links list, Create chooser, Domain Redirect form, Hostnames,
Connect DNS window, toast), the five scenes, `timeline.ts`, `script.ts` (generated from script.md),
`props.ts`.

## Accuracy notes (facts used on screen)

| On screen | Source | Status |
|---|---|---|
| Automatic HTTPS; HTTPS certificate issued after DNS is in place; "we check every few seconds"; emailed when live | Product Facts — Core: *Automatic HTTPS* (LIVE, Approved); *Connect DNS* (LIVE, Approved 2026-10-05) | OK |
| Root setup: A on @ + TXT verification; www gets a CNAME; root automatically covers www | *Connect DNS* rules; *Whole-domain catch-all and www coverage* (LIVE, Approved) | OK |
| Record formats (`A → 3.33.236.10`, `TXT → reh-verify=<edge>.rediredge.com`, `CNAME www → <edge>.rediredge.com`) | Live API `get-host` on the RedirHub workspace, 2026-10-06 (the real IP and the `reh-verify=` format). Edge id in the video is illustrative (`k7m2qx`). VO: "copy yours, not mine." | Confirm with Kris that showing the real anycast IP is fine |
| Links → Create → Domain Redirect; fields Redirect from / to, 301/302, Keep path | *Unified Links list & create flows* (LIVE; **Approved 2026-10-06**, was Needs review in the brief) | OK, resolved |
| Connect DNS: Automatic (Domain Connect, Cloudflare today), Manual with CNAME / A switch, Nameservers add-on | *Connect DNS* (LIVE, Approved 2026-10-05). **The brief said "not live yet"; Notion now says live.** Shown: Manual. Automatic is out of the VO (length), in the description. | Flag for Leo: include a 6 s Automatic insert? |
| Path forwarding ("Keep path") on all plans | *Path forwarding* (LIVE, Approved) | OK |
| 301 = moved permanently; browsers follow; Google updates its index | Standard HTTP semantics; wording avoids SEO outcome promises (Claims caveat: "do not promise SEO rankings") | OK |
| Chrome warning | Google Security Blog (Oct 2025): default "Always Use Secure Connections" for public sites "with the release of Chrome 154 in October 2026", phased rollout. Chromium dash: 154 stable 2026-09-22, **155 stable 2026-10-06 (today)**. Enterprise release notes seen place the default in 154/155. | **Not confirmed on for everyone** → VO says "rolling out", never "now warns". Kris to confirm wording |
| "Some do, some don't" (registrars) | Comparison articles (Notion): GoDaddy applies HTTPS forwarding automatically; Namecheap documents certificates on both domains for HTTPS→HTTPS forwarding | OK; no registrar named |
| Demo domains `mydomain.com` / `mybrand.com` | Product Facts page: Brand System domain convention | OK |
| QR codes on screen encode `https://redirhub.com/qr` | Repo rule: demo domains belong to someone else | OK |

No pricing, plan names, free-plan claims, PoP counts or uptime numbers appear.
