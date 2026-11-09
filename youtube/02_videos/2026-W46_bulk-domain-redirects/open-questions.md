# W46 open questions (key frames, 2026-11-06)

## D · Domains shown (DNS-checked)

Every name on screen was checked on 2026-11-06 at 20:23 UTC: a DNS lookup (DoH, NS query) and the .com
registry (RDAP, Verisign). "NXDOMAIN" means no DNS; "RDAP 404" means not registered at all.

| Name | Where | DNS | Registry |
|---|---|---|---|
| **kipzoo.com** | the thread, 22 frames | NXDOMAIN | **registered** (RDAP 200) |
| glomvo.com | Glomvo's site and email, the lander URLs | NXDOMAIN | not registered |
| tumbrik.com, olzik.com, zentvy.com, savvlo.com, gozvu.com, grolvi.com, zinnobi.com, quellox.com, yobzi.com, mobvra.com, bazlio.com, jubrik.com, bvoko.com, ubvex.com | Glomvo's wall, the sheet, registrars, hostnames, analytics | NXDOMAIN | not registered |
| rimboa.com | the founder's next name (Warning) | NXDOMAIN | not registered |
| marketplace.example | the generic marketplace listing | reserved TLD (RFC 2606) | — |

**D-1 · kipzoo.com is registered (please decide).** It passes the brief's test (NXDOMAIN: no site, no DNS), but
the registry has it: registered 2024-09-16, expires 2027-09-16, status client hold, last changed 2026-11-06.
Nobody's site or person is shown as ours, but the owner could put it live later. I kept it because the brief
fixes it and the narrator says it. Unregistered fallbacks that keep the sound (all NXDOMAIN and RDAP 404 today):
**kipzou.com, kopzoo.com, kypzoo.com, kipzoa.com, kibzoo.com, kipzuu.com, kipvoo.com**. Swapping is one constant
(`KIP` in `style-canvas/w46_props.py`) plus the VO.

## T · The prop typeface

**T-1 · Instrument Serif** (Google Fonts, OFL) for Glomvo's wordmark only (`data-logo`), so Glomvo reads as a
quiet, old-fashioned small team, not a startup. Its subset is `style-canvas/instrument-serif.woff2` for the
checker. Everything else is Jakarta, JetBrains Mono, or Inter inside UI. Glomvo's palette: ink `#2B2722`, stone
`#F4F0E8`, linen `#E7E0D4`, pebble `#A79F92`, gated to Glomvo's own props by the checker (`SHOP_HEX`).

## Q · Unconfirmed UI and labels (drawn as close to the real UI as I could)

Labels come from the live dashboard source (`redirhub/lviv`) where I could find them.

- **Q-1 · Create chooser.** Title, subtitle, the four card titles, the Domain Redirect description and example, and
  the footer "Already have a spreadsheet of links? Import CSV" are real. The other three cards' descriptions are
  drawn as grey lines (not confirmed).
- **Q-2 · Import fix and review steps.** "{count} rows need a fix before they can import", "The other {count}
  rows are fine. Row numbers match your spreadsheet.", "Destination must start with https:// or http://.",
  "Add https:// to all {count}", the three footer actions, "Adds {domains} domains and {links} links, updates
  {updated} links", the In this file table, "Leave out {count} www rows their root already covers" with its
  explanation, "Where the links are", the DNS line and "Import {count} changes" are real strings. The layout is
  mine. The review's "Uses from your plan" line is left out on purpose (no plan claims).
- **Q-3 · Redirect Checker (Honest).** Drawn generically: input, Check, numbered hops with status codes. Its real
  page layout wasn't checked; please compare with redirhub.com's checker.
- **Q-4 · Hostnames / Connect DNS.** "Connect DNS", the Automatic and Manual tabs, "Waiting for DNS" are real;
  "Connected" as a badge and the Automatic tab's single Cloudflare row with a Connect button are my reading of
  the Domain Connect flow. The line "Elsewhere: Manual shows the record to add at your DNS host." is mine.
- **Q-5 · Visits vs Clicks.** The analytics card says Clicks (and Unique visitors). The VO says "visits". See
  script-deltas.md Δ-2.
- **Q-6 · Bulk change destination.** "{n} links selected", "Change destination", "Replace URL", "Find and replace",
  "New destination URL", the forwarding note and "Update {n} links" are real; "Tags: Brandables" as a filter
  button label is mine.

## C · Claims check (live sources, 2026-11-06)

Leo's `guide.md` and `rule.md` are on his machine, which wasn't connected to this session, so I couldn't read
the guide's ✅/⚠️ marks. I checked every product statement against the live pages instead and used only what
they say:

| Claim on screen or in the VO | Source |
|---|---|
| Import links from a CSV, with a check and a review before anything is saved | /support/import-links-csv, product facts |
| One click adds https:// to destinations that lack it | the import's fix step (lviv) |
| A bare domain covers its www | /support/import-links-csv, review step |
| type column (302 allowed), tags column | /support/import-links-csv; /blog/domain-redirect-at-scale ("for sale", 302) |
| Cloudflare connects automatically (Domain Connect); elsewhere add the records shown | /support/connect-dns |
| A domain still waiting doesn't hold up the others | /blog/domain-redirect-at-scale |
| HTTPS set up automatically once DNS points to us, and renewed | /support/automatic-https |
| Visits by domain and by tag | product facts; analytics card |
| Change the destination of many links at once, by tag | product facts; bulk edit (lviv) |
| Free Redirect Checker | redirhub.com navigation, “Free tools → Redirect Checker” |

- **C-1 · The parking facts: resolved by narrowing (Kris's fact check, 2026-11-09).** See script-deltas.md Δ-0.
  - **Google, kept and narrowed.** Google Ads Help, "Parked domain site"
    (https://support.google.com/google-ads/answer/50002): "Parked Domains (AFD) will cease to be an ad surface within
    the Search Partner Network effective February 10, 2026." Checked 2026-11-09. Proposed VO: "since February tenth,
    parked domains are no longer eligible as ad placements on Google's Search Partner Network." It says nothing about
    Google ending all domain advertising or monetization, and neither do the frames.
  - **Bodis, left out.** The only evidence is secondary: DomainInvesting.com (2026-01-28; the author quotes "an email
    I received from Bodis": services cease "effective January 31, 2026") and a DNForum repost of the same email
    (https://www.dnforum.com/threads/bodis-is-shutting-down.628336/). No first-party Bodis notice was found: bodis.com
    returned 503 and an archived copy couldn't be read from this session. **Question for Kris and Leo:** if either of
    you has the original Bodis email, the optional line in Δ-0 can come back, worded as what Bodis told customers.
  - **"Most of that went away", removed.** No independent evidence for an industry-wide revenue claim. Beat 7 is
    softened to match ("the surest way a name pays for itself").
- No dollar figures, prices, plan names or free-plan wording appear anywhere. Numbers that aren't facts (63, 9,
  214, 12, 128, 226 rows, the quiet names' zeros) carry an Example label in their frame.

## E · The end card

- **E-1 · The line.** Shown: **Every door. Open.** Alternative: "Hundreds of domains. One file." (rejected by the
  fresh-eyes review as a repeat of the title).
- **E-2 · The QR.** A labelled slot, "Dynamic QR · link pending". It needs a RedirHub dynamic QR to the
  domain-parking page with UTMs (`utm_medium=qr`), made by Kris, with its branded link printed under it.
- The right half stays clear for YouTube's end screen (W43, W41).

## Other

- **O-1 · The warning page** is generic ("This connection isn't secure"), not any browser's wording or icon.
- **O-2 · The checker** used for these frames is W44's `scripts/yt/keyframes-check.py` (prop font, story palette,
  no-tilt), brought onto this branch unchanged; it is identical to the one in redirhub/reels#17.
- **O-3 · Door broken state.** Defined on the World board, unused in frames (the warning page carries that
  moment). Delete it if Leo prefers the motif never shows red.
