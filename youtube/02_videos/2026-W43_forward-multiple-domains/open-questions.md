# W43 open questions (key frames, 2026-10-14, round 2)

## Sources this pass could not read

- `rule.md`, `script.md` and `guide.md` live on Leo's computer (`C:\Users\word\Desktop\kris\redirhub.com\Youtube
  Content Engine\`), not in the repo, Drive or Notion. The script came from the brief's copy. **The claims
  check was redone from Notion** (Product Facts — Core, read 2026-10-14; table below). Please diff it against
  guide.md's ✅ list.
- The repo's `youtube/rule-v0.3-proposal.md` stood in for rule.md (transition grammar, safe areas, colours, fonts, hold rule).

## UI details not confirmed (drawn as in W41, flagged)

| ID | Frame | Detail | What was drawn | Who |
|---|---|---|---|---|
| UI-1 | DomainRedirect | **Resolved (Oct 14):** drawn from the Unified Links prototype's "New domain redirect" page (`03-create-redirect`): Redirect from → Redirect to, "A root domain also covers www.", Redirect type (301 · Permanent / 302 · Temporary, More types), Paths (Keep the path / Everything to one URL), What happens, Create redirect. | As in the prototype. | — |
| UI-2 | DomainRedirect | **Resolved:** the prototype defaults to 301 and "Keep the path". | 301, Keep the path. | — |
| UI-3 | DomainRedirect | **Resolved:** the form itself says "A root domain also covers www." under the sources; the film rings it in teal instead of adding a chip. | Teal ring on the hint. | — |
| UI-4 | Checker | The Redirect Checker's result layout. The page exists ("Check Any URL Redirect", button "Check Redirect", "completely free, no account required", traces each hop's status code). | A two-hop chain: 1 https://www.mybrand.net 301, 2 https://mybrand.com 200. | Leo / Kris (one screenshot) |
| UI-5 | ConnectDNS | The **Nameservers (Add-on)** tab is left off the dialog because the brief excludes the add-on. The real dialog shows three tabs. | Automatic (Recommended) and Manual only. | Leo: OK to crop? |
| UI-6 | (cut) | A per-domain analytics view, for beat 46. | Not drawn; beat 46 proposed cut. | Leo |
| UI-7 | HttpsIssued | The final state of the verifying list (all three done) and the root-domain wording "The records were added." (the reference says "The CNAME record was added." for a subdomain). | Three teal ticks; status "Connected". | Kris |
| UI-8 | ConnectDNS | The "Replace" chip is neutral here (orange in the real dialog), so the frame keeps one amber. | Grey chip. | Leo: OK? |
| UI-9 | LinksList | New rows show "0 Clicks · just now"; favicons read "MB". Sidebar counts (Links 4, Hostnames 5) match the demo workspace. | As drawn. | — |
| UI-10 | DomainRedirect, LinksList, ConnectDNS | **Release timing.** These three frames now use the Unified Links prototype (Dashboard (lviv) Prototype, Oct 14): the new app shell (grey sidebar, inset panel, breadcrumb, orange split Create), the card list and the full-page create form. If that design is not live by the time W43 is recorded (publishes Oct 19), the film shows UI viewers can't find yet. | Prototype design, as asked on Oct 14. | Kris: will it be live by recording? |
| UI-11 | DomainRedirect | The prototype's 301 hint reads "Moved for good. Passes SEO value." It is product copy, but it is also an SEO claim with no Approved Claims row, and the film's honest note says forwarding doesn't lift rankings on its own. | Shown as in the prototype. | Leo / Kris: keep, or reword in the product? |
| UI-12 | Dashboard shell | Left out of the prototype shell on purpose: the plan card ("CORE · Domains 18 / 25", Upgrade plan: plans and slot counting are excluded claims) and the signed-in person's name and email. The Connect DNS dialog is still the real one from the W41 screenshots; the prototype has no Hostnames screens, so the new shell sits dimmed behind it. | As drawn. | — |

## Claims check (Notion Product Facts — Core, read 2026-10-14)

| Shown / said | Product Facts row | Status · external use |
|---|---|---|
| Links → Create → Domain Redirect; Import CSV in the create chooser | Unified Links list & create flows | LIVE · Approved |
| "A root domain covers its www." | Whole-domain catch-all and www coverage | LIVE · Approved |
| Keep path | Path forwarding | LIVE · Approved (pricing page lists Core, Pro, Enterprise; no plan is named on screen) |
| Hostnames → Connect DNS, Automatic with Cloudflare, Manual | Connect DNS (automatic and manual DNS setup) | LIVE · Approved |
| HTTPS issued automatically | Automatic HTTPS | LIVE · Approved |
| "Import them all from one CSV" | Bulk Link Import / Export | LIVE · Approved |
| Free Redirect Checker | **No Product Facts row.** Page text on redirhub.com/redirect-checker (2026-10-14): "completely free — no account required". | Needs a row or Leo's OK |

Left out on purpose: pricing, plans, domain-slot counting, free-plan wording, auto-redirect, the nameservers
add-on, monitoring, analytics (beat 46).

**Third-party behaviour** (rule v0.3 #3): "Google picks one address to show" (duplicate URLs and canonical
choice) is Google's documented behaviour. Hedged on screen and in VO ("maybe not the one you'd pick").
Proposal: cite Google Search Central's page on consolidating duplicate URLs in the description, with the date.
Cloudflare is named only because the real dialog names it; nothing is said about other providers.

## Decisions for Leo

1. **Four extra domains, sixteen ways in** (the brief said 3 × 4 = 12). The film shows five domains and the
   end card says "Five domains", so the extras are four. Keep 16, or drop getmybrand.com and use "Four domains"
   on the end card?
2. **The twist's pick:** the magnifier in `w43-Copies` marks `mybrand.net` as the address Google shows (labelled Example).
   The typo gets its own moment in `w43-AddressBar` instead. OK?
3. **Sound:** the brief says effects only on story beats. W41 (revision 3) added a click per button press at
   Leo's request. Keep the click rule for W43, or drop it as the Sound board proposes?
4. **New frames:** `w43-Perfect` and `w43-AddressBar` (the twist in three frames), `w43-Steps` (list replaces
   narration at #21, reused for the recap) and `w43-AllGreen` (the grid's payoff). Keep all four?
5. **Beat 46 (analytics) cut.** Agree, or move it to the description?
6. **Captions in Plus Jakarta Sans** (W41 used Inter). The brief asks for it; it's a channel change. Confirm for
   all future videos.
7. **Rooms (round 2):** seven backgrounds from the website's gradients instead of one Night background
   (`w43-System` board, keyframes.md). Make the room system the channel default, so the next video starts from it?
   It changes the guideline's "Night with the soft blue glow" rule in `docs/youtube-style-canvas.md`.
8. **Light rooms and the Signal Red / Night tokens:** the dashboard act now sits on the light room with charcoal
   text, so Night appears less often. Kris's pending approval of Night `#0B1426` matters less; Signal Red is
   still used for the twist.

## Waiting on Kris

- Signal Red `#E5484D` and Night `#0B1426` are still pending approval as channel tokens (carried from W41).
- The branded link for the end-card QR (drawn as an empty slot: "Branded QR · link pending").
- The ElevenLabs paid plan before the voice is recorded (workflow step 3).
