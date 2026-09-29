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
| **Preview (team)** | The gallery at <https://reels-redirhub.vercel.app>. Production plays the published MP4 (instant scrubbing). Branch previews default to **Live preview**, which renders the branch's code in the browser, since the CDN only has `main`'s render. Both are one tab apart. |
| **Preview (editing)** | `npm run studio` opens Remotion Studio with a timeline, frame scrubbing and props. |
| **Render** | `npm run render` (all reels) or `npm run render -- qr-no-reprint`. Writes `out/<id>.mp4` (H.264, AAC) and `out/<id>.jpg` (cover). |
| **Download** | Every push to `main` renders and publishes to the public CDN: `https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4` (stable link), `…/download.mp4` (downloads instead of playing), `…/latest.jpg` (cover), plus an immutable `reels/renders/<id>/<commit>.mp4` per render (kept 90 days) and `reels/index.json`. Docs-only commits skip rendering. Pull-request renders stay private as the run's `reels-<sha>` artifact (7 days). Setup: [`docs/aws/SETUP.md`](docs/aws/SETUP.md). |

## Getting started

```bash
npm install
npm run dev       # gallery at http://localhost:3000
npm run studio    # Remotion Studio
npm run render    # MP4s into out/
```

Requires Node 22 (`.nvmrc`). To regenerate audio: `pip install -r scripts/audio/requirements.txt && python3 scripts/audio/generate.py`. Rendering downloads a headless Chrome on first run. If that is blocked,
set `CHROME_PATH` to a local chrome-headless-shell.

### Vercel

The gallery is deployed at <https://reels-redirhub.vercel.app> (Next.js defaults). Only the
gallery runs on Vercel; rendering happens in GitHub Actions.

| Env var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_REELS_BASE_URL` | `https://dcr3565853rcg.cloudfront.net/reels` | CDN root the gallery plays and downloads from. |
| `NEXT_PUBLIC_VERCEL_ENV` | set by Vercel | `production` shows the published MP4 first; previews show the live Player first. |

## Stack

- **Remotion 4**: React compositions rendered frame by frame in headless Chrome, encoded
  with FFmpeg (bundled with Remotion).
- **Next.js 16 + `@remotion/player`**: the preview gallery.
- **Python (numpy/scipy)**: `scripts/audio/generate.py` synthesizes the music and sound
  effects, so all audio is original.
- **`qrcode`**: real, scannable QR codes generated from props.
- **GitHub Actions + S3/CloudFront**: typecheck, build and render on every PR; publish to the CDN from `main` (OIDC, no stored AWS keys).

See [`AGENTS.md`](AGENTS.md) for the project layout and conventions.

## Reels

### `qr-no-reprint`: "10,000 flyers printed. Then the site changed."

30s · 1080×1920 · 30 fps. A printed QR campaign breaks when the website changes, and
RedirHub fixes it without a reprint.

| Time | Beat | On screen | Audio |
|---|---|---|---|
| 0–3.3s | Hook | "10,000 flyers printed. Then the site changed." A phone scans the flyer QR and gets a 404 (red flash). | Driving minor groove, then an impact at the 404 and the music cuts out |
| 3.3–6.8s | Stakes | Static QR: *reprint all 10,000*. RedirHub QR on your domain: *change one field*. | Ticking tension, build and riser |
| 6.8–17.4s | Product | Monitor alert flags the 404 → open the link → retype the destination → Save → "Monitored · Healthy", QR "Unchanged ✓". | Drop into the major-key groove; alert, click, typing and success sounds |
| 17.4–25.4s | Before / after | Same printed QR: a 404 on one phone, the live sale page on the other. | Whoosh; the lead melody enters |
| 25.4–30s | CTA | Logo, "Dynamic QR codes. On your domain.", audience line, "Start free at redirhub.com", scannable QR. | Chord stinger, then the outro fades |

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
| 0–6s | Hook | "Your links are everywhere." Four cards: printed flyer QR, newsletter, social bio, old domain, all "Works". "Then your website moves." Each flips to 404: "Every one of them breaks." | Filtered deep-house groove; impact on the first 404, then the music drops out to a drone |
| 6–12s | Idea | "Keep the link. Change the destination." Your link (stays the same) → RedirHub → destination (changes twice). "RedirHub is the link infrastructure for your domain." | Airy chords and arps, filter opening; build and riser |
| 12–20s | 01 Domain redirects | "Redirect the domain. Skip the server." New redirect form: `yourbrand.net` → `https://yourbrand.com`, Create, Active. | **Drop** as the dashboard lands; clicks, typing, success |
| 20–28s | 02 Website migrations | "Move the site. Keep every old URL working." Drag a CSV into Import from CSV, old → new rows check off, 248 redirects created. | Groove + arp layer |
| 28–36s | 03 Branded links & QR | "Branded links people recognize as yours." Retype the short link's destination, Save; the printed QR is "Unchanged ✓". | + lead melody |
| 36–44s | 04 Monitoring | "A working redirect can still lead somewhere broken." A destination returns 404, monitor alert, double-click to edit, Healthy. Note: monitoring on eligible plans. | Alert, clicks, success |
| 44–48s | Before / after | The four hook cards flip back to "Works": "Same links, wherever they live. Every one of them works." | Breakdown, sweep |
| 48–54s | Proof | "Redirect infrastructure you don't have to run." 99.99% platform uptime · 130 Global PoPs · ~90ms global average response time · 1M+ domains redirected daily. | Full groove |
| 54–60s | CTA | Logo, "The link infrastructure for your domain.", the four use cases, "Start free at redirhub.com". | Stinger, outro fades |

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
