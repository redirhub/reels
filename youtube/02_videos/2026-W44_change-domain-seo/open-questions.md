# W44 open questions (key frames, round 2, 2026-10-25)

## Domains (D)

| ID | Question | What I found (2026-10-25) | What the frames use |
|---|---|---|---|
| D-1 | Are `frostyfusion.com` and `frostybites.com` free to show? | **No, both are live.** `frostyfusion.com`: registered (Verisign RDAP 200), resolves to 76.223.54.146. `frostybites.com`: registered, resolves to 157.230.161.221, serves a domain-broker sale page. (Round 1's `velvetscoop.com` was a parked page; it's no longer used.) | **`getfrostyfusion.com` → `getfrostybites.com`**: both RDAP 404 (unregistered) and no DNS. Same brand names with a common small-brand prefix. Also free: `frostyfusionicecream.com`. Re-check on recording day; they only ever appear as mockups. |
| D-2 | Are the shop names themselves safe? | Not checked against trademarks. "Frosty Fusion" and "Frosty Bites" may be names of real small shops somewhere. The logos are original, built on Leo's cup-of-scoops reference; the palette is generic pink and blue. | Kris: a quick trademark search before publishing? |

## The logos and the prop typeface (for Kris)

- **Logos:** both marks are drawn in-house as SVG on Leo's reference (an outlined cup of scoops): Frosty Fusion's
  cup holds one blue-and-pink soft-serve swirl, Frosty Bites' cup holds two scoops, pink with sprinkles and a drip,
  blue with a smiling face. Not traced from the reference: own geometry, colour and face. Leo, please confirm the
  reference image is cleared as inspiration (it looks like a stock line icon).
- **Fredoka** (Google Fonts, SIL Open Font License), variable 400–700: both wordmarks and their "ICE CREAM" line only.
  It never appears outside the logos; the checker enforces that (`PROP_FONT`). It replaces round 1's Fraunces.
- For the Remotion build, Fredoka needs to be self-hosted in `public/fonts/` (latin subset, about 30 KB) with its
  licence, like Plus Jakarta Sans.
- **Palette** (shop world only): blush `#FFE3EC`, bubblegum `#FF8FB1`, mist `#E6F5FD`, sky `#8ACFF5`, cone ink
  `#26335C`. Bubblegum is lighter and pinker than Signal Red, sky much lighter than product blue.

## UI details not confirmed (drawn as close to the real UI as I could, flagged)

The dashboard frames are rebuilt from the **Dashboard (lviv) Prototype** (claude.ai artifact, updated 2026-10-25):
`03-create-chooser`, `03-create-migration` (desktop) and `03-phone-create-migration(-same)`, plus the "Website
migration" and "Bulk CSV import" screens in the **RedirHub Product Screenshots** artifact (Oct 23) and the W43
app shell (`Product.tsx`).

| ID | Frame | Detail | What was drawn | Who |
|---|---|---|---|---|
| UI-1 | Migration, Preview | **Release timing.** Is the "New website migration" page (How are the URLs changing? · Keep the same paths / Map URLs one by one · Old domain → New base URL · URL mappings · What happens) live as drawn? Product Facts says Links lists website migrations and "Create starts from what you are making" (LIVE, Approved), but the form itself is from the prototype. | As in the prototype, labels verbatim. | Kris |
| UI-2 | Migration | The default redirect type. The prototype's state defaults to 301, and the row reads "301 · Permanent". | 301 · Permanent. | Kris: confirm the live default |
| UI-3 | Migration | **www coverage for a migration.** "A root domain automatically covers its www variant" is approved for redirects. Does a same-path migration rule from `getfrostyfusion.com` also cover `www.getfrostyfusion.com`? The migration form doesn't say. | A film pill under the dashboard: "www.getfrostyfusion.com comes along too" (not product UI). | Kris. If no: cut the pill and VO line 39 (script-deltas #13) |
| UI-4 | Migration, Preview | The section label. The real expanded state shows **Options** (Tags, Monitoring) then the three advanced rows and a "Fewer options" toggle. I show only "More options" with Redirect type, Query forwarding, Subdomains & HTTPS. | Tags and Monitoring left out on purpose (monitoring is an excluded claim). | Leo: OK to crop? |
| UI-5 | Preview | The skipped row's wording ("New URL missing, this row is skipped", amber-brown "Skip" badge) and the footer "2 redirects · 1 skipped" are the prototype's. The red ring around the row is a film annotation. | As in the prototype. | Kris |
| UI-6 | Migration, Preview | Left out: the header's "456 managed links left" and the footer's "Uses N of 456 managed links" (capacity is a plan claim). The redirect-type hint "Moved for good. Search engines move rankings to the new URLs. Best for migrations." is not shown: it's an SEO promise without an approved claim (like W43 UI-11). | Not shown. | Leo / Kris: keep the hint out of the film, or reword it in the product? |
| UI-7 | Checker | The Redirect Checker's result layout (carried from W43 UI-4). The page is real ("Check Any URL Redirect", "Check Redirect"); the two-hop result list is drawn. | hop 1 `https://getfrostyfusion.com/flavors/strawberry` 301, hop 2 `https://getfrostybites.com/flavors/strawberry` 200. | Leo / Kris (one screenshot) |
| UI-8 | Watch | Per-path analytics for a migration. Analytics breaks traffic down by domain (Approved); a view of *which old paths* still get visits under one same-path rule isn't confirmed. | The prototype's Analytics "Domains" card: `getfrostybites.com` and `getfrostyfusion.com`, numbers labelled "Example numbers". VO proposed per domain (script-deltas #22). | Kris |
| UI-9 | Migration | The create chooser (beat 37) is shown only in the move, not in the key frame; its copy is the real chooser's ("Website Migration · Move many URLs with one same-path rule, or map them one-to-one. · Replatforming, domain change, site restructure"). | — | — |
| UI-10 | All dashboard frames | Workspace name "Frosty Bites" (avatar "FB") instead of the demo "My Brand". Product Facts asks for mybrand.com-style demo data in *screenshots*; this is the story's own workspace in a film. | Frosty Bites. | Leo: OK? |

## Claims check

`guide.md` (with its ✅ list) is on Leo's machine and couldn't be read here, so the check was redone from the sources
of record on 2026-10-25: **redirhub.com/product-facts** (public facts from Product Facts — Core rows that are LIVE and
Approved; the Notion database stopped being the public source on 2026-10-18) and the Notion **Approved Claims &
Message Library — Core**. Please diff against guide.md's ✅ list.

| Shown / said | Source | Status |
|---|---|---|
| Links → Create → Website Migration; one Links page for every link | Product facts: "One Links page lists every branded link, dynamic QR code, domain redirect and website migration, and Create starts from what you are making." (verified 2026-10-01) | LIVE · Approved |
| Paste a map, or upload a CSV; review before anything is created | Product facts: "Links can be imported from a CSV file, with a review of what will be added, updated or removed before anything is written" (2026-10-01) | LIVE · Approved |
| 301, the permanent kind; path forwarding (same paths) | Product facts: redirects with 301/302/307/308; path forwarding included on Core, Pro and Enterprise | LIVE · Approved (no plan named on screen) |
| The www version comes along too | Product facts: "a root domain automatically covers its www variant…" (redirects) | LIVE · Approved for redirects; **unconfirmed for migrations** (UI-3) |
| The padlock is set up automatically once DNS points to RedirHub | Product facts: automatic HTTPS; "the certificate is issued automatically once DNS points to RedirHub" | LIVE · Approved |
| RedirHub's analytics show traffic by domain | Product facts: "Analytics breaks traffic down … by domain and tag …" | LIVE · Approved (per-path: UI-8) |
| Free Redirect Checker | redirhub.com/product-facts "Free tools: Redirect Checker"; the page says "completely free, no account required" (W43) | Live page; no Product Facts row (carried from W43) |
| Do it right and Google can carry your rankings over; rankings may wobble | Google's behaviour, hedged | Approved Claims caveat: "Do not promise SEO rankings, traffic preservation or migration outcomes." VO 17 hedged (script-deltas #6). The ending ("Same spot") is the story's outcome for one fictional shop, shown on a search labelled "Example". |
| Keep redirects at least a year | Google Search Central's site-move guidance ("as long as possible, generally at least 1 year") | Third-party; cite with a date in the description |

Left out on purpose: pricing, plans, free-plan wording, capacity ("managed links left"), monitoring, ranking
guarantees, Product Facts' SEO hint in the redirect-type picker.

## Decisions for Leo

1. **Domains:** `getfrostyfusion.com` → `getfrostybites.com` (D-1), or another free pair?
2. **The twist:** the new sweet-surprise frame (`w44-OldMenu`, script-deltas #18): an old Frosty Fusion menu from
   2021 still opens the strawberry page. Is that the kind of joyful twist you meant, or do you have another in mind?
3. **New frames kept from round 1:** the Pages beat split into Pages + Flip, and `w44-Watch` for beat 54. Keep both?
4. **The second fixed chime** sits on the Return ("right where Frosty Fusion used to be"); the end card holds in quiet.
5. **Rooms (round 2):** Dark mesh, grids and the perspective floor are gone. Six gradient rooms remain: Light, Glow
   (the gradient you kept), Glow teal (same recipe), Brand sweep, Brand radial, Charcoal. Make that the channel set?
6. **"Without losing SEO"** in the title is the topic, not a promise; VO 17 is hedged and the ending is labelled
   Example. Enough against the claims caveat, or add a one-line "results vary" to the description?
7. **The "nothing tilts" rule** is now an opt-in check in `keyframes-check.py` (`NO_TILT=1`). Make it the default for
   future videos? W43's frames would fail it (stamps, flyer, floor).

## Waiting on Kris

- Signal Red `#E5484D` and Night `#0B1426` are still pending approval as channel tokens (carried from W41).
- The branded link for the end-card QR (drawn as a slot: "Branded QR · link pending").
- UI-1, UI-2, UI-3, UI-5, UI-8 above.
- The ElevenLabs v3 delivery tags: the W43 narrator ran on `eleven_multilingual_v2`; the tags in this script need
  the v3 model. Confirm the voice and model before Review 3.
