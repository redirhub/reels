# RedirHub Reels

Short social videos (Instagram Reels, TikTok, YouTube Shorts) for RedirHub, built in
React with [Remotion](https://remotion.dev). Each video is code: brand tokens,
product UI and copy are components and props, so a new video, a translated version or a
copy fix is a code change plus a re-render.

> **Remotion license:** Remotion is free for individuals, non-profits and companies with
> up to 3 employees. Larger companies need a paid Company License. Check the current terms
> at <https://remotion.dev/license> before publishing. Once it's settled, add
> `acknowledgeRemotionLicense` to the `<Player>` in `app/components/Gallery.tsx` to hide
> the console notice.

## Preview, render, download

| | How |
|---|---|
| **Preview (team)** | The gallery at <https://reels-redirhub.vercel.app>. Production plays `main`'s published MP4. Each branch's Vercel preview plays **CI's render of that exact commit** (`renders/<id>/<commit>.mp4`, uploaded about 3–4 minutes after the push), so what you see is what `main` will publish. Until it's ready, the preview falls back to **Live preview** (renders in the browser). |
| **Preview (editing)** | `npm run studio` opens Remotion Studio with a timeline, frame scrubbing and props. |
| **Render** | `npm run render` (all reels) or `npm run render -- qr-no-reprint`. Writes `out/<id>.mp4` (H.264, AAC) and `out/<id>.jpg` (cover). |
| **Download** | Every push to `main` renders and publishes to the public CDN: `https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4` (stable link), `…/download.mp4` (downloads instead of playing), `…/latest.jpg` (cover), plus an immutable `reels/renders/<id>/<commit>.mp4` per render (kept 90 days) and `reels/index.json`. Branch pushes upload only their `renders/<id>/<commit>.mp4`; the public `latest` links change only when `main` updates after a merge. **CI renders only the reels a push affects** (`scripts/changed-reels.mjs`): a reel's own files → that reel; shared components, brand, SFX or dependencies → all; gallery, CI and docs → none. Run the workflow manually to re-render everything. Docs-only commits skip rendering. Each run also keeps a private `reels-<sha>` artifact (7 days). Setup: [`docs/aws/SETUP.md`](docs/aws/SETUP.md). |

## Getting started

```bash
npm install
npm run dev       # gallery at http://localhost:3000
npm run studio    # Remotion Studio
npm run render    # MP4s into out/
```

Requires Node 22 (`.nvmrc`). To regenerate audio: `pip install -r scripts/audio/requirements.txt && npm run audio`. Rendering downloads a headless Chrome on first run. If that is blocked,
set `CHROME_PATH` to a local chrome-headless-shell.

### Vercel

The gallery is deployed at <https://reels-redirhub.vercel.app> (Next.js defaults). Only the
gallery runs on Vercel; rendering happens in GitHub Actions.

| Env var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_REELS_BASE_URL` | `https://dcr3565853rcg.cloudfront.net/reels` | CDN root the gallery plays and downloads from. |
| `NEXT_PUBLIC_VERCEL_ENV`, `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`, `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` | set by Vercel | Production plays `main`'s MP4; previews play the render of their commit SHA. |

## Stack

- **Remotion 4**: React compositions rendered frame by frame in headless Chrome, encoded
  with FFmpeg (bundled with Remotion).
- **Next.js 16 + `@remotion/player`**: the preview gallery.
- **Python (numpy/scipy)**: `scripts/audio/` generates a beat per reel (from its `music.json`) and
  the shared sound effects, so all audio is original.
- **`qrcode`**: real, scannable QR codes generated from props.
- **GitHub Actions + S3/CloudFront**: typecheck, build and render on every PR; publish to the CDN from `main` (OIDC, no stored AWS keys).

See [`AGENTS.md`](AGENTS.md) for the project layout and conventions.

## Reels

### `qr-no-reprint`: "10,000 flyers printed. Then the site changed."

30s · 1080×1920 · 30 fps. A printed QR campaign breaks when the website changes, and
RedirHub fixes it without a reprint.

| Time | Beat | On screen | Audio |
|---|---|---|---|
| 0–3.3s | Hook | "10,000 flyers printed. Then the site changed." A phone scans the flyer QR and gets a 404 (red flash). | Kick and hats from the first frame; impact at the 404, then silence |
| 3.3–6.8s | Stakes | Static QR: *reprint all 10,000*. RedirHub QR on your domain: *change one field*. | Kick and hats back in, clap roll into the drop |
| 6.8–17.4s | Product | Monitor alert flags the 404 → open the link → retype the destination → Save → "Monitored · Healthy", QR "Unchanged ✓". | **Drop** at 6.55s: clap, open hats and a crash join; an alert ding, then a success chime on save |
| 17.4–25.4s | Before / after | Same printed QR: a 404 on one phone, the live sale page on the other. | One soft whoosh; the full drum groove continues |
| 25.4–30s | CTA | Logo, "Dynamic QR codes. On your domain.", audience line, "Start free at redirhub.com", scannable QR. | End-card stinger, then the beat fades out |

**Messaging basis (Notion):** use case *Trackable QR codes*. Signature POV *"A QR code is a
printed URL, not just a graphic."* Positioning *"Dynamic QR codes. On your domain."*

**Claims check:**
- "Start free": **Free tier available** (Approved external).
- The monitoring alert: **Proactive link health monitoring for eligible plans** (Approved
  external, plan-qualified). Check the plan qualifier before paid distribution.
- There are no speed or uptime claims.
- "10,000 flyers", "3,412 clicks", `yourbrand.com` and the dates are illustrative scenario data.
- QR codes follow the RedirHub QR design standard: the branded link is always shown under
  the code. The end-card QR encodes `https://redirhub.com/qr` (RedirHub's own branded link to
  `/dynamic-qr-codes`) and shows `redirhub.com/qr` underneath. The story QRs are labelled with
  the story link `go.yourbrand.com/spring` but also open `redirhub.com/qr`, because the demo
  domain isn't ours.

**Suggested caption:**

> Printed 10,000 flyers, then your site changed? 😬
> If the QR code points to a link on *your* domain, you don't reprint. You change one field.
> RedirHub: dynamic QR codes, branded links and redirects on your own domain. Start free at redirhub.com
>
> #QRcode #marketingtips #printmarketing #linkmanagement #SaaS

### `homepage-explainer`: "What is RedirHub?"

60s · 1920×1080 (landscape) · 30 fps. For the redirhub.com homepage: explains RedirHub to
first-time visitors. Music and SFX only, all copy on screen, so it works muted (autoplay).

| Time | Beat | On screen | Audio |
|---|---|---|---|
| 0–6s | Hook | "Your links are everywhere." Four cards: printed flyer QR, newsletter, social bio, old domain, all "Works". "Then your website moves." Each flips to 404: "Every one of them breaks." | Kick + hats beat; impact on the first 404 with the beat muted around it |
| 6–12s | Idea | "Keep the link. Change the destination." Your link (stays the same) → RedirHub → destination (changes twice). "RedirHub is the link infrastructure for your domain." | Beat resumes; whoosh into the idea |
| 12–20s | 01 Domain redirects | "Redirect the domain. Skip the server." New redirect form: `yourbrand.net` → `https://yourbrand.com`, Create, Active. | **Drop** (full kit) as the dashboard lands, whoosh; success on save |
| 20–28s | 02 Website migrations | "Move the site. Keep every old URL working." Drag a CSV into Import from CSV, old → new rows check off, 248 redirects created. | Beat; success when the CSV import finishes |
| 28–36s | 03 Branded links & QR | "Branded links people recognize as yours." Retype the short link's destination, Save; the printed QR is "Unchanged ✓". | Beat |
| 36–44s | 04 Monitoring | "A working redirect can still lead somewhere broken." A destination returns 404, monitor alert, double-click to edit, Healthy. Note: monitoring on eligible plans. | Alert on the broken link, success when fixed |
| 44–48s | Before / after | The four hook cards flip back to "Works": "Same links, wherever they live. Every one of them works." | Beat; whoosh into the recap |
| 48–54s | Proof | "Redirect infrastructure you don't have to run." 99.99% platform uptime · 130 Global PoPs · ~90ms global average response time · 1M+ domains redirected daily. | Beat |
| 54–60s | CTA | Logo, "The link infrastructure for your domain.", the four use cases, "Start free at redirhub.com". | Stinger, beat fades out |

The dashboard is drawn after the real app (`redirhub/lviv`): nav Home / Redirects / Shortener /
Monitor / Hostnames, the "Redirect from / Redirect to" form, "Import from CSV", the monitor
list and double-click-to-edit.

**Messaging basis (Notion):** homepage direction *"RedirHub — The link infrastructure for
your domain"* and the four product-page headlines from Positioning & Messaging. Signature POV
*"The public URL should be stable. The destination can change."* (cross-use-case, not used
by an earlier reel). Chapter 04 uses the platform-page direction *"A working redirect can
still lead somewhere broken."*

**Claims check** (Approved Claims & Message Library, re-queried 2026-09-29; all
`Approved external`):
- "99.99% platform uptime": **99.99% uptime**. Stated as a platform uptime metric, not an SLA or guarantee.
- "130 Global PoPs": **130 Global PoPs**, exactly (not "130+").
- "~90ms global average response time": **~90ms global average response time**, with its measurement context in the label.
- "1M+ domains redirected daily": **1M+ domains redirected daily**, the exact metric.
- Monitoring chapter: **Proactive link health monitoring for eligible plans**; the on-screen note says "available on eligible plans". No promise of incident prevention.
- "Start free": **Free tier available**.
- Not used, because they are `Internal only`: per-link analytics (no click counts on screen), managed HTTPS, bulk/API/MCP workflows, "one control layer".
- `yourbrand.com`, `yourbrand.net`, the CSV rows and "248 redirects" are illustrative scenario data.
- QR standard: the story QRs show `go.yourbrand.com/spring` underneath but encode `https://redirhub.com/qr`, because the demo domain isn't ours. There is no QR on the end card: the video plays on redirhub.com, so the CTA is the site's own sign-up.

**Homepage embed:** use `https://dcr3565853rcg.cloudfront.net/reels/homepage-explainer/latest.mp4`
(poster: `…/latest.jpg`) once merged, e.g. `<video autoplay muted loop playsinline>`.

### `free-coffee`: "Free coffee?"

12s · 1080×1920 · 30 fps. A sound-designed Instagram short with no voiceover and almost no copy: a
bait link 404s, gets a (secret) destination in RedirHub's redirect layer, and the same link lands
on the joke. The URL is the object that carries every transition.

| Time | Beat | On screen | Audio |
|---|---|---|---|
| 0–1.9s | Curiosity | A browser; the page's only readable thing is the link `brand.com/free-coffee`. Cursor glides in and clicks. | Beat (kick + hats + muted synth pulse); **click** |
| 1.9–3.4s | Failure | A plain site 404: "404 / Page not found". Small jolt. | **Error** hit; the beat drops out around it |
| 3.4–4.2s | Into the redirect layer | The URL lifts out of the address bar; the camera passes through the page into a dark grid. | **Whoosh**; beat ducked |
| 4.2–6.6s | Fix | URL = source node (red dot). A destination node appears with its path **redacted**. A wire draws, an orange pulse runs down it, it locks: teal wire, arrow, ring. Small RedirHub wordmark at the top. | **Ticks** as the wire forms; silence, then the **snap** with the full beat (drop) |
| 6.6–8.1s | Return | The same URL drops back onto the same page. Same cursor, same click. | The same **click** |
| 8.1–10.2s | Payoff | Address bar `brand.com/nice-try`, page: "Nice try. ☕" | Soft **chime**, beat ducked |
| 10.2–12s | Close | "Broken link. **Fixed.**" + RedirHub logo. Ends on a cut. | Beat, short tail |

**Messaging basis (Notion, re-queried 2026-10-01):** Signature POV *"The public URL should be
stable. The destination can change."* (also behind `homepage-explainer`; this reel tells it as
a 12s joke instead of a tour). Story and copy come from the owner's creative brief.

**Claims check** (Approved Claims & Message Library, 2026-10-01): no product claims or numbers
on screen. "Broken link. Fixed." describes the story's outcome, not a speed or uptime claim; the
reel deliberately shows no timings. `brand.com` and both paths are illustrative scenario data;
no QR and no link sends viewers to that domain.

**Departures from the house style, per the owner's brief:**
- **7 sound effects in 12s, including two mouse clicks.** The repeated click is the story's
  motif (fail, then succeed), so the reel raises the `<Sfx>` cap with an explicit
  `budget={{ max, reason }}`. Other reels keep the 6-per-30s default.
- **A synth pulse under the drums** (`music.json` `"pulse"`): one repeated note on 16ths,
  filtered, never changing pitch, so it adds drive without becoming a melody.
- **Beat ducking** under the whoosh/ticks, the snap and the payoff (`<Beat volume={fn}>`).
- **Typeface:** the brief said Plus Jakarta Sans; redirhub.com/brand says Inter, so the reel
  uses Inter like every other reel. Swap in `brand/fonts.ts` if the brand changes.
- The ☕ is rendered from a bundled Noto Color Emoji subset (`public/fonts/`, OFL), so it is in
  color on any render machine.

**Caption:** "Free coffee? ☕ The link was broken. Then it wasn't. #marketing #links #redirects"
