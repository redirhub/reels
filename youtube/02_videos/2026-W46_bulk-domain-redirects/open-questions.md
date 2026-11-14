# W46 open questions · v6, the Northway cut (2026-11-13)

## D · Domains shown (DNS-checked)

Every domain on screen was checked on 2026-11-12 at 22:25 UTC: a DNS lookup over HTTPS (NS query) and, for .com,
the registry (RDAP, Verisign). **NXDOMAIN** = no DNS. **RDAP 404** = not registered at all. (RDAP 400 = Verisign
doesn't serve that TLD; the DNS answer is the test there.)

| Domain | Role on screen | DNS | Registry |
|---|---|---|---|
| **northwaysoft.com** | Northway's one website (every destination) | NXDOMAIN | not registered |
| **rotawick.com** | the retired product: the twist, the door, the closing question | NXDOMAIN | not registered |
| **nortwaysoft.com** | "Northway without the h": the knocks, 63 visits | NXDOMAIN | not registered |
| fernvalesoft.com | the old name, from before the rebrand | NXDOMAIN | not registered |
| clinvane.com, rostavia.com, notevane.com, slotbrae.com, dockwen.com | products | NXDOMAIN | not registered |
| northwaysoft.de, northwaysoft.fr, northwaysoft.co.uk, northwaysoft.es, northwaysoft.nl | country versions | NXDOMAIN | — |
| northwaysft.com, nrthwaysoft.com | more misspellings | NXDOMAIN | not registered |

- **D-1 · The main site.** `northway.com` is live (A record, 66.96.149.1) and so is `nortway.com`, so neither
  appears anywhere. Northway keeps its name; its site is **northwaysoft.com** (short, easy to read, unregistered).
  The misspelling follows it: **nortwaysoft.com**.
- Rejected while choosing (registered or live): northway.app, northwayhq.com, northwayapp.com, getnorthway.com,
  and common words such as slotkeep, tallyroom, pathmint, bookpine, cliniqo, shiftwell, nordlane, waypine.
- Not shown but used in a URL path only: none. Reserved example hosts: none needed in v6.

## T · The prop typeface

**T-1 · Instrument Serif** (Google Fonts, OFL; already in the repo for W46) for Northway's wordmark only
(`data-logo`), with "SOFTWARE" in small tracked capitals of the film's own Jakarta. It reads as a quiet, premium
software brand and never outweighs the RedirHub frame. Northway's palette: ink `#1B2333`, paper `#F6F5F1`, line
`#E4E2DC`, slate `#7C8596`, gated to Northway's own props by the checker (`SHOP_HEX`). The homepage's headline is
set in the website's UI type (Inter), not the serif (the prop font stays in the logo).

## P · Pronunciation

- **P-1 · "RedirHub" (2026-11-14) · ✅ confirmed:** re-DIR-hub, the "Redir Hub" respelling below (confirmed in review
  after hearing the beat 20 clip). Use it for every video until the brand says otherwise. Leo heard v6's respelled take, "Redirect Hub", as redirect-hub. Beat 20 was
  generated three more ways (same voice and settings) and compared by syllable stress, because Whisper writes every
  version as "Reader Hub" (it has no word "redir"):
  - plain "RedirHub" (`c20.mp3`, kept): stress on the first syllable, REA-der-hub;
  - **"Redir Hub" (`c20b.mp3`, used)**: a short, soft "re", then a longer, higher "DIR": re-DIR-hub, the stress of "redirect";
  - "Re-dir Hub" and "Ree-deer Hub" (not kept): REA-der again, or run together.
  If the brand should sound different, the fix is one beat: `ALIAS` in `voiceover/make_chunks.py`, regenerate `c20b`, rebuild.
- **P-2 · "Northway"** is heard as "Northway" in every beat (Whisper); "without the H" as written.

## Q · Unconfirmed UI and labels (drawn as close to the real UI as I could)

Labels come from the live dashboard source (`redirhub/lviv`) where I could find them.

- **Q-1 · Create chooser.** Title, subtitle, the four card titles, the Domain Redirect description and example, and
  the footer "Already have a spreadsheet of links? Import CSV" are real. The other three cards' descriptions are
  drawn as grey lines.
- **Q-2 · Import fix and review steps.** "{count} rows need a fix before they can import", "The other {count}
  rows are fine. Row numbers match your spreadsheet.", "Destination must start with https:// or http://.",
  "Add https:// to all {count}", the footer actions, "Adds {domains} domains and {links} links, updates {updated}
  links", "Leave out {count} www rows their root already covers", "Where the links are" and "Import {count}
  changes" are real strings. The layout is mine.
- **Q-3 · Redirect Checker (Honest).** Drawn generically: input, Check, numbered hops with status codes. On
  redirhub.com the free checker opens FindRedirect; I couldn't confirm that its result page shows the certificate
  (padlock) state, only that redirhub.com describes it as checking "that HTTPS redirects work". **Claim ⚠️ for Leo
  or Kris** (§6.1, beat 14). The VO only says "Check one in our free Redirect Checker".
- **Q-4 · Hostnames / Connect DNS.** "Connect DNS", the Automatic and Manual tabs, "Waiting for DNS" are real;
  "Connected" as a badge and the single Cloudflare row with Connect are my reading of the Domain Connect flow.
- **Q-5 · Visits vs Clicks.** The analytics card says Clicks; the VO says "visits".
- **Q-6 · Bulk change destination.** "{n} links selected", "Change destination", "Replace URL", "Find and
  replace", "New destination URL", the forwarding note and "Update {n} links" are real; "Tags: Product" as a filter
  button label is mine.

## C · Claims check (v6, §6.1 of the brief)

| Beat | Claim | Status | Source |
|---|---|---|---|
| 10 | Browsers ask for the secure version first | ✅ | HTTPS-first behaviour in current browsers |
| 10 | Some registrars' forwarding includes a padlock, others don't | ✅ fair wording | registrar docs (no HTTPS forwarding at some; GoDaddy now handles it) |
| 14 | The free Redirect Checker shows whether a domain has the padlock | ✅ with https:// typed | F-3 |
| 16–18 | CSV columns: domain, destination, type (301), tags | ✅ | /support/import-links-csv |
| 17 | 301 = permanent, right for a consolidation | ✅ | |
| 20 | Links → Create → Import CSV | ✅ | lviv; Q-1 |
| 21–22 | A preview before saving, one-click https fix, www covered | ✅ | Notion release "CSV import review"; product facts |
| 24 | Cloudflare connects automatically; elsewhere add the shown records | ✅ | /support/connect-dns (Domain Connect, Cloudflare only today) |
| 25 | A padlock per domain, renewed automatically | ✅ | /support/automatic-https |
| 26–27 | Visits per domain; 63 visits | ✅ / 🏷 | analytics; the number is an Example, labelled |
| 31 | Change many domains at once by tag | ✅ | product facts; bulk edit (lviv) |
| — | 200+ domains (the UI shows 214) fits the Pro plan (250) | ✅ | no plan or price is said |

No parking, Bodis or Google claims remain (the v4 C-1 items are gone with the Glomvo story). No dollar figures,
prices or plan names appear. Numbers that aren't facts (63, 9, 214, 12, 46, 226 rows, the quiet domains' zeros)
carry an Example label in their frame.

## E · The end card

- **E-1 · The line:** "Every door. Open."
- **E-2 · No QR slot** (v6.1, Leo, 2026-11-14): the end card is the line, "Links are in the description" and the
  RedirHub logo; the right half stays clear for YouTube's end screen.

## L · Length

- **L-1 · 4:44, not about 4:24.** Sarah's natural pace on v6 is 4:18 of pure speech (v6 has more words than v4);
  the pauses between beats are 0.3–1.2 s and the end card holds 4 s for the end screen. Speeding the voice would
  bring back the stretched, robotic sound Leo rejected in W44, so the voice runs at its own pace.

## Other

- **O-1 · The warning page** is generic ("rotawick.com doesn't support a secure connection", F-1), not any browser's wording or icon.
- **O-2 · Door broken state.** Defined on the World board, unused in frames.

## R · Raised by the fresh-eyes review, left for Leo

The reviewer (Gate 5, review.md) raised these. Each needs a script or frame decision beyond this pass's brief:

- **R-1 · Northway on screen.** Done in v6.1: "Northway" is written at the top of the notebook as she names it
  (0:02), so the name is on screen 17 s before the wordmark.
- **R-2 · The Links backdrop.** Behind the Import CSV dialog (2:43) the dimmed Links list already shows
  Northway's domains, which can read as "already imported". An empty or unrelated list would be cleaner.
- **R-3 · Connectives.** "But the real question is…" (beat 5) follows a "therefore", and beat 6 opens on renewals
  without a bridge from the question. Script wording, so kept.
- **R-4 · "You" mid-film.** From beat 6 to beat 12 and again in Act F, voice and screen speak only about Northway;
  "you" returns on screen at 4:26 ("Your domains"). Kept as scripted.
- **L-2 · Length.** The final cut is 4:43 (v6.1: beat 32 is 1.6 s shorter without the listen line; beat 29 keeps its
  0.4 s more pause so both of its lines can be read).
- **S-1 · The knock** (v6.1): a real knock, Mixkit #197. The v6 file was Mixkit #1523, "Heavy sliding door", picked
  under the wrong title; Leo heard that it wasn't a knock. docs/audio-licenses.md has the record.

## F · Fact check of every claim (2026-11-14)

Every spoken line and every on-screen string, checked against the dashboard source (`redirhub/lviv`, 2026-11-07),
redirhub.com's support pages and product facts (updated 2026-11-08), and the browsers' and registrars' own docs.

- **F-1 · Fixed: the warning page (beat 11).** A customer who types a bare domain doesn't get a certificate-error page.
  Since Chrome 154 (stable September 2026), "Always use secure connections" is on by default for public sites: when
  the https:// attempt fails, Chrome stops with a "this site doesn't support a secure connection" warning and a
  "Continue to site" button. The frame said "didn't show a valid certificate" (the wrong page); it now says
  "rotawick.com doesn't support a secure connection", why, and offers Go back / Continue to site, and the address bar
  shows the plain address. Generic wording, no browser's colours or icon.
  - The voice ("So the customer sees a warning page") is fair for Chrome 154+, the largest browser. Firefox's
    HTTPS-First falls back to http silently; Safari's warning is a separate setting. Kept as scripted (the twist).
- **F-2 · Registrar forwarding and the padlock (beat 10): true.** HTTPS on forwarded domains: GoDaddy (applied when a
  forward is set up or edited, so an old untouched forward may still lack it), Porkbun, Squarespace (SSL toggle),
  Cloudflare Redirect Rules (proxied). No HTTPS on free forwarding: Namecheap, Hover, Name.com; IONOS only with paid
  Redirect Shield.
- **F-3 · Fixed: the Redirect Checker (beat 14).** redirhub.com/redirect-checker opens FindRedirect. A bare domain is
  checked over http:// only (it would show the forward working: the false comfort of the twist); typed with
  https://, each hop's Details shows "SSL: Verified" or "Unverified". The honest note now says "Check one in our free
  Redirect Checker, with https:// in front", and the checker on screen already shows https://clinvane.com.
- **F-4 · Fixed: Connect DNS (beat 24).** The panel had an invented "Connect" button and helper line; it now shows the
  dashboard's copy: "Approve once at Cloudflare and it adds this record for you. About a minute, nothing to copy." /
  "Continue with Cloudflare". Automatic setup (Domain Connect) works with Cloudflare only today: true. "In batches,
  if you like" means "at your own pace": there is no batch-connect button; the docs say any order, and a waiting
  domain doesn't hold up the others.
- **F-5 · Fixed: "46 selected" (beat 31).** The bulk bar says "{n} selected", not "{n} links selected".
- **F-6 · Verified word for word:** navigation, the Create chooser and "Already have a spreadsheet of links? Import
  CSV", every string of the import's fix and review steps, "Waiting for DNS" / "Connected", "Automatic" / "Manual",
  the Change destination dialog ("Replace URL", "Find and replace", "New destination URL", "Domain redirects keep
  their path and query forwarding. Only the target changes.", "Update 46 links"), the analytics tabs ("Domains",
  "Tags", "Clicks") and "Channel: Direct". "Destination must start with https:// or http://." is the import's
  documented error (support: CSV import problems).
- **F-7 · CSV (beats 16–20): true.** Required headers `source_url` and `destination` (the film shows exactly these);
  `type` optional (empty = 301); `tags` optional. Links → Create → Import CSV; Excel and Google Sheets files work.
  No documented row limit; imports over the plan are blocked (no plan is named in the film).
- **F-8 · Review, one-click https fix, www (beats 21–22): true.** Nothing is saved before the review is confirmed; a
  bare domain covers its www (when www also points to RedirHub).
- **F-9 · Padlock set up and renewed per domain (beat 25): true** (/support/automatic-https).
- **F-10 · Visits per domain, quiet domains (beats 26–30): true.** Analytics counts "clicks" (the voice says visits;
  both are used on the site), by domain, tag and channel ("Direct"). Links-list counts include bots; Analytics has
  "Humans only".
- **F-11 · Filter by tag, change once (beat 31): true** (product facts: "changed in groups by tag or status").
- **F-12 · Renewals (beat 6): true as a generalization** (ICANN: terms of 1–10 years, usually renewed yearly).
- **F-13 · Numbers agree across scenes:** 226 rows = 9 to fix + 217 fine = 214 domains + 12 www rows left out =
  6 shown + "220 more". 63 visits, 46 links, 214 domains and the zeros carry an Example label.
- **F-14 · Outside the film:** redirhub.com/support/analytics-find-top-channel still says "the Free plan does not
  include it"; there is no free plan. For the support content owners.
