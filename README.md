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
| **Preview (team)** | The gallery app in `app/` is deployed on Vercel. Every branch gets a preview URL with each reel playing in the browser. |
| **Preview (editing)** | `npm run studio` opens Remotion Studio with a timeline, frame scrubbing and props. |
| **Render** | `npm run render` (all reels) or `npm run render -- qr-no-reprint`. Writes `out/<id>.mp4` (H.264, AAC) and `out/<id>.jpg` (cover). |
| **Download** | Every push to `main` renders and publishes to the public CDN: `https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4` (stable link), `…/download.mp4` (downloads instead of playing), `…/latest.jpg` (cover), plus an immutable `…/<commit>.mp4` per render and `reels/index.json`. Pull-request renders stay private as the run's `reels-<sha>` artifact. Setup: [`docs/aws/SETUP.md`](docs/aws/SETUP.md). |

## Getting started

```bash
npm install
npm run dev       # gallery at http://localhost:3000
npm run studio    # Remotion Studio
npm run render    # MP4s into out/
```

Requires Node 22. Rendering downloads a headless Chrome on first run. If that is blocked,
set `CHROME_PATH` to a local chrome-headless-shell.

### Vercel

Import the repo in Vercel as a Next.js project with the default settings. Only the gallery
is deployed. Rendering happens in GitHub Actions, not on Vercel.

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
- Every QR code encodes `https://www.redirhub.com/dynamic-qr-codes`, so viewers who scan
  it land on the product page.

**Suggested caption:**

> Printed 10,000 flyers, then your site changed? 😬
> If the QR code points to a link on *your* domain, you don't reprint. You change one field.
> RedirHub: dynamic QR codes, branded links and redirects on your own domain. Start free at redirhub.com
>
> #QRcode #marketingtips #printmarketing #linkmanagement #SaaS
