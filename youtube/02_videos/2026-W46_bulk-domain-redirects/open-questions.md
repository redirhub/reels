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

- **P-1 · "RedirHub" (please confirm).** No confirmed pronunciation is on file (W41 and W44 notes, rule v0.3:
  "TESTING until Leo confirms"). Beat 20 was generated twice:
  - **plain** "In RedirHub, …" (`voiceover/chunks/c20.mp3`, kept, not used): Whisper hears **"Reader Hub"**, the
    same fault Leo heard at 2:16.
  - **respelled** "In Redirect Hub, …" (`c20b.mp3`, used): Whisper hears **"Redirect Hub"**, which passes.
  If the brand should sound different, the fix is one beat: change `ALIAS` in `voiceover/make_chunks.py`,
  regenerate `c20b`, rebuild.
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
| 14 | The free Redirect Checker shows whether a domain has the padlock | ⚠️ | Q-3 |
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
- **E-2 · The QR slot is back** (v6 brief): "Dynamic QR · link pending", an empty frame with a QR icon, never a
  drawn code. (v4 had removed it on 2026-11-10; the v6 brief keeps the slot.) It sits on the left; the right half
  stays clear for YouTube's end screen.

## L · Length

- **L-1 · 4:44, not about 4:24.** Sarah's natural pace on v6 is 4:18 of pure speech (v6 has more words than v4);
  the pauses between beats are 0.3–1.2 s and the end card holds 4 s for the end screen. Speeding the voice would
  bring back the stretched, robotic sound Leo rejected in W44, so the voice runs at its own pace.

## Other

- **O-1 · The warning page** is generic ("This connection isn't secure"), not any browser's wording or icon.
- **O-2 · Door broken state.** Defined on the World board, unused in frames.

## R · Raised by the fresh-eyes review, left for Leo

The reviewer (Gate 5, review.md) raised these. Each needs a script or frame decision beyond this pass's brief:

- **R-1 · Northway on screen.** The voice names Northway at 0:02; the wordmark arrives at 0:19 (beat 3). The
  notebook (§4: "everything else stays") carries no name. A small "Northway" on the notebook would close the gap.
- **R-2 · The Links backdrop.** Behind the Import CSV dialog (2:43) the dimmed Links list already shows
  Northway's domains, which can read as "already imported". An empty or unrelated list would be cleaner.
- **R-3 · Connectives.** "But the real question is…" (beat 5) follows a "therefore", and beat 6 opens on renewals
  without a bridge from the question. Script wording, so kept.
- **R-4 · "You" mid-film.** From beat 6 to beat 12 and again in Act F, voice and screen speak only about Northway;
  "you" returns on screen at 4:26 ("Your domains"). Kept as scripted.
- **L-2 · Length.** The final cut is 4:44 (beat 29 got 0.4 s more pause so both of its lines can be read).
