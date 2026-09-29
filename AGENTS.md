# AGENTS.md

Guidance for coding agents (and people) working on RedirHub Reels: short social
videos built with [Remotion](https://remotion.dev), previewed in a Next.js gallery.

## Before you finish

```bash
npm run typecheck   # tsc --noEmit
npm run build       # gallery builds (what Vercel runs)
npm run render -- <id>   # when you changed a reel: render it and look at the frames
```

CI (`.github/workflows/render.yml`) runs typecheck, build and a full render on every PR.

## Layout

| Path | What |
|---|---|
| `src/reels.ts` | Registry of every reel. Studio, the renderer and the gallery all read it. |
| `src/remotion/reels/<id>/` | One folder per reel: scenes, `props.ts` (all scenario data), and the top-level composition. |
| `src/remotion/components/` | Reusable pieces: `Phone` + in-phone pages, `Flyer`, dashboard blocks (`Dashboard.tsx`), `Cursor`, `QrCode`, icons. |
| `src/remotion/brand/` | Brand tokens, fonts, official logo marks. |
| `src/remotion/lib/anim.ts` | Time helpers (`useTime`, `prog`, easings, `rise`, `fx`). |
| `app/` | Next.js gallery (Remotion Player + download links). Deployed on Vercel. |
| `scripts/render.mjs` | Batch render to `out/<id>.mp4` + `out/<id>.jpg`. |
| `scripts/publish-s3.sh` | CI-only: upload `out/` to S3 and invalidate CloudFront. Setup in `docs/aws/SETUP.md`. |
| `scripts/audio/generate.py` | Synthesizes the music bed and SFX into `public/audio/`. |

## Writing reels

- **Time in seconds, local to the scene.** Each scene is a `<Sequence>`; inside it,
  `const t = useTime()` and animate with `prog(t, a, b)` + easings. Every visual must be a
  pure function of `t`: no `useState`, timers, CSS animations or `Math.random()` at render time.
- **Scenario data goes in `props.ts`**, never hard-coded in scenes, so variants are new props.
- **Reuse components.** If a new reel needs a phone, flyer, dashboard row or cursor, use
  or extend the shared component instead of copying markup.
- **Keep text inside the social safe area**: roughly y 200–1600 on a 1080×1920 frame
  (platform UI covers the top ~200px and bottom ~300px).
- **Cursor keyframes are composition pixels.** If you move UI, re-measure the targets
  (render a still and check) and update the keyframes.

## Brand and claims

- Colors, fonts and logos come from `src/remotion/brand/`, mirrored from
  `redirhub/marketing` (`globals.css` and the `/brand` page). Never recolor the logo except
  the all-white variant on dark backgrounds.
- Product UI mirrors the real dashboard. Don't invent features.
- Product claims must come from the Notion **Approved Claims & Message Library** with
  `Approval = Approved external` and respect their caveats. The story angle should come from
  the **RedirHub POV Library — Core** (`Status = Approved external`). Document the claims
  check in the reel's PR.
- **QR design standard:** every QR on screen shows its branded link directly underneath,
  so viewers know where it goes before they scan, and it builds trust. Always use
  `<BrandedQr value label />` from `components/QrCode.tsx`, never a bare `<QrCode>`.
- A QR a viewer is invited to scan (end cards, CTAs) must encode a RedirHub branded link, and
  its label must be exactly that URL without the scheme (e.g. `redirhub.com/qr`). Every QR
  must encode a real, working URL. Verify it scans from the rendered MP4.

## Audio

- Music and SFX are **generated** by `scripts/audio/generate.py` (numpy/scipy), so they're
  original and royalty-free. Don't add third-party audio without a license on file.
- The music bed is loudness-normalized to -16 LUFS; SFX sit on top via `<Html5Audio>`
  inside `<Sequence from=…>` at the frame of the on-screen event.
- Changed the generator? Re-run it and commit the regenerated files in `public/audio/`.

## Environment notes

- Remotion downloads its own headless Chrome. In sandboxes without network access to it, set
  `CHROME_PATH` to an existing **chrome-headless-shell** binary (full Chrome no longer
  supports the old headless mode Remotion uses).
- All `remotion` / `@remotion/*` packages must be pinned to the **same exact version**.
