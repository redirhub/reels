# Reel playbook

How a RedirHub reel goes from idea to published MP4. Written so a new session (human or
agent) can make the next video without the conversation the first one came from. The
`new-reel` skill (`.claude/skills/new-reel/SKILL.md`) runs this process.

Repo conventions live in [`AGENTS.md`](../AGENTS.md). This doc covers the **process**,
the **sources**, and **why** things are the way they are.

---

## 1. Sources

| What | Where | Use |
|---|---|---|
| Positioning & Messaging | Notion page `3bda0f405c6c81e0bcc9c870d162f26b` (RedirHub Marketing HQ) | Category, per-use-case headlines ("Dynamic QR codes. On your domain.", "Redirect the domain. Skip the server.", …), messaging rules |
| POV Library — Core | Notion data source `collection://ed4b3e5d-68c0-455e-9bea-b5839a14937c` | The story angle. Filter `Status = 'Approved external'`; prefer `Tier = 'Signature'`. **One POV per reel.** |
| Approved Claims & Message Library | Notion data source `collection://774f12f8-1692-4541-ae20-f32cc3066f1f` | Every product claim on screen must be `Approval = 'Approved external'`; obey its caveat column |
| Brand tokens, logos, fonts | `src/remotion/brand/` (mirrors `redirhub/marketing` `globals.css` + `/brand`) | Never hard-code other colors; never recolor the logo |
| Real dashboard UI | `redirhub/marketing` `public/assets/images/powerful-features/*.{png,jpg}` | Reference for anything drawn as product UI. Don't invent features |

Notion content changes. **Re-query it for every reel**; don't copy claims from an older
reel's README.

Useful queries (Notion MCP `query-data-sources`, SQL mode):

```sql
SELECT POV, "Use case", Tier, "Evidence strength" FROM "collection://ed4b3e5d-68c0-455e-9bea-b5839a14937c"
WHERE Status = 'Approved external' ORDER BY Tier;

SELECT "Message / claim", Approval, "Prohibited overclaim / caveat" FROM "collection://774f12f8-1692-4541-ae20-f32cc3066f1f";
```

**YouTube look (landscape videos):** all YouTube videos share one style canvas (live HTML mockups of
key frames); each video gets its own page on it, named after the video. Rules and the
list of pages: [`docs/youtube-style-canvas.md`](youtube-style-canvas.md).

## 2. Process

1. **Brief.** Pick one use case (Domain redirects, Website migrations, Branded links,
   Trackable QR codes) and one approved POV. Check the [reel log](#6-reel-log) so you don't
   repeat an angle.
2. **Story:** one specific, recognizable problem, for example "10,000 flyers printed. Then
   the site changed." Not a feature tour.
3. **Storyboard.** Write the beat table in the reel's README section first:
   - **0–3s hook**: the problem, legible on the first frame (it is the thumbnail).
   - **Stakes**: the cost without RedirHub, stated concretely.
   - **Product**: at least a third of the runtime in the dashboard; the UI is the hero.
   - **Before / after**: the same asset, the outcome changes.
   - **CTA**: logo, positioning headline, audience line, "Start free at redirhub.com", scannable QR.
   - About 30s, 1080×1920, 30 fps, all copy on screen (it has to work with the sound off).
     Website embeds use `LANDSCAPE` (1920×1080) instead, and no social safe area; see
     `homepage-explainer`.
4. **Claims check.** List every claim and number on screen with its Notion source, or mark
   it as illustrative scenario data. Put it in the README.
5. **Build** (conventions in `AGENTS.md`):
   - `src/remotion/reels/<id>/`: `props.ts` for all scenario data, one file per scene,
     `<Id>.tsx` composing scenes with `<Sequence>` and audio.
   - Register it in `src/reels.ts`.
   - Reuse `components/` and extend them rather than copying.
   - Iterate with `npm run studio`, or stills:
     `npx remotion still src/remotion/index.ts <id> /tmp/f.jpg --frame=<n>`.
6. **Audio:** a generated beat plus sound effects, no voiceover (see the decisions log).
   - **Beat:** don't compose music. Write `src/remotion/reels/<id>/music.json` (`bpm`,
     `duration`, optional `drop` and `mute`; see `scripts/audio/beat.py`), run `npm run audio`,
     and put `<Beat />` in the composition. Set `drop` to the moment the product appears, and
     `mute` over dramatic beats (silence, e.g. after the 404). The style is fixed: **drums only**
     (kick, clap, hats, shaker; no bass, chords or melody). The reel id picks small pattern variations.
   - Keep effect volumes so that the QA check's peak stays at or below -1 dBFS; long effects that
     ring over the full beat (like the end-card stinger) need a lower volume.
   - **SFX on top, restrained:** they connect the music to the picture, so use them only on
     **story beats**, about one per scene, 6 at most per 30s (`<Sfx>` refuses more). Typical set:
     the problem (impact), the detection (alert), the fix (success), the cut to the result
     (whoosh), the end card (stinger). **No sounds for UI micro-actions** (clicks, typing,
     hovers), and no risers into a drop the beat already builds. Keep them under the beat:
     volumes around 0.3–0.7. Exception: a brief that makes a UI sound the story (see
     `free-coffee`) can raise the cap with `<Sfx budget={{ max, reason }}>`; dip the music
     a little under key effects with `<Beat volume={(s) => …}>`, never stop it. A licensed track can replace the
     generated beat; see the decisions log.
7. **Verify.** Run `npm run render -- <id>`, then:
   ```bash
   pip install -r scripts/qa/requirements.txt
   python3 scripts/qa/check_reel.py out/<id>.mp4 --qr <end-card seconds>=<exact URL>
   ```
   Then **look at `out/qa/<id>/sheet.png`**: overlaps, safe area (pink lines), text wrapping,
   cursor on target. Most real bugs were only visible there. Listen to the audio yourself;
   agents can't, so they measure loudness and correlate SFX timing instead.
8. **Ship.** Push a branch and open a PR. CI renders every push and publishes that commit's
   MP4 to the branch's Vercel preview (**Rendered MP4** tab, about 3–4 minutes after the push).
   Review that, not the live Player: the in-browser version can differ from the real render.
   CI renders only the reels your push affects; untouched reels show `main`'s published version.
   After merge, `main` publishes to `https://dcr3565853rcg.cloudfront.net/reels/<id>/latest.mp4`.
9. **Post.** Add the caption suggestion to the README. Music added in-app is optional,
   since the MP4 already has its own track.

## 3. Decisions log

| Decision | Why |
|---|---|
| **Remotion in its own repo** (not in `redirhub/marketing`) | Heavy dependencies (Chromium, FFmpeg) and a different review cycle; keeps the site's builds clean |
| **Music + SFX, no voiceover** | Owner's call. Most people watch muted, so the story is carried by on-screen copy |
| **SFX only on story beats (≤ 6 per 30s), none for UI micro-actions** | Owner's call: 13 effects in 30s felt cluttered. Five, one per story beat, reads as a premium ad; enforced by `<Sfx>` |
| **Drums-only beat per reel + scene SFX, not composed music** | Owner's direction: drums plus scene sound effects is the premium ad sound, and more layers made it cluttered. A fixed style with `music.json` per reel means no session ever composes music, and every reel sounds consistent. SFX carry the video-specific moments |
| **Audio is synthesized** (`scripts/audio/generate.py`), pinned deps | Original and royalty-free, reproducible byte for byte |
| **QR design standard**: branded link always shown under the QR (`<BrandedQr>`) | People see where it goes before they scan, which builds trust. CTA QRs encode a RedirHub branded link (`https://redirhub.com/qr`) whose label matches exactly |
| **Story QRs encode `redirhub.com/qr`** even when labelled with a demo domain | Demo domains (`yourbrand.com`) belong to someone else; never send viewers there |
| **CI renders only affected reels** (`scripts/changed-reels.mjs`) | Render time and uploads stay flat as the library grows; a reel's public file only changes when that reel (or shared code) changes |
| **Every push uploads `renders/<id>/<commit>.mp4`; only `main` (after a merge) updates the public `latest` links** | The in-browser Player sometimes renders differently from the real MP4, so reviews must see CI's render (owner's call). Branches share the main publish role (acceptable while `main` is unprotected); commit renders are unlisted and expire after 90 days |
| **S3 + CloudFront** (`dcr3565853rcg.cloudfront.net/reels/`), GitHub OIDC with a custom subject | Public, stable links; no stored AWS keys; details in `docs/aws/SETUP.md` |
| **Gallery plays the MP4 by default in production**; live Player on branch previews | Native video scrubs instantly. The live Player is for unpublished changes |
| **Per-commit renders expire after 90 days** (`reels/renders/`) | Otherwise storage grows forever. `latest` links are unaffected |
| **Short, sound-designed reels may raise the SFX cap** via `<Sfx budget={{ max, reason }}>` (first: `free-coffee`) | Owner's brief for a no-voiceover short where the click itself is the story motif. The default stays one effect per story beat; an override must state why |
| **A reel may use a licensed music track instead of the generated beat** (first: `free-coffee`, "Soft" from Pixabay) | Owner's call: a synthesized single-note pulse "sounded like Mario music". Fit it with `scripts/audio/prepare_track.py` (aligns a section change to a story beat, trims, -16 LUFS; `--splice` jumps bar-to-bar so the track's real ending lands on the end card) into `public/audio/<id>-beat.mp3`, delete the reel's `music.json`, and record source + licence in `docs/audio-licenses.md` |
| **Music plays straight through** (`free-coffee`) | Owner: dropping the music for the 404 and the punchline, then restarting it, felt awkward. Only small dips (e.g. under typing) |
| **Licensed sounds come from Pixabay** (owner, 2026-10-02) | Pixabay Content License allows commercial use without attribution. ElevenLabs output is only licensed for commercial use on a paid plan; the free plan's isn't. Cut one-shots with `prepare_track.py oneshot` and play them as `SfxSample` cues in `<Sfx>` (they count against the budget) |
| **Show the product doing the fix, step by step** (`free-coffee`) | Owner's feedback on the first cut: an abstract "redirect layer" didn't show how the link was fixed. Recreate the real app flow from `redirhub/lviv` (screens, copy, order) |
| **Social safe area y 200–1600** | Platform UI covers the top and bottom of vertical video |

## 4. Environment gotchas

- **Remotion needs chrome-headless-shell.** Full Chrome dropped the old headless mode. In
  sandboxes without Remotion's download, point `CHROME_PATH` / `--browser-executable` at
  an installed `headless_shell` (e.g. Playwright's `chromium_headless_shell-*/chrome-linux/headless_shell`).
- **Open-source Chromium can't play H.264.** A sandbox browser failing to play the MP4
  doesn't mean the MP4 is broken; check with `check_reel.py`.
- **Proxies with their own CA** can break loading fonts from a CDN inside headless
  Chromium. That's why fonts are bundled in `public/fonts/`.
- **Cursor keyframes are pixel positions.** After moving UI, measure the target again
  (render a still) and update the keyframes.
- **All `remotion`/`@remotion/*` packages must be the same exact version.**
- **Dark gradients band after encoding.** JPEG frames + H.264 (and Instagram's re-encode) flatten
  a navy gradient into visible rings. Put `<Grain />` (`components/Grain.tsx`) over it and darken
  the gradient ~10% to compensate (free-coffee: longest flat band 143px → 5px).

## 5. Open items

| Item | Owner | Status (2026-09-29) |
|---|---|---|
| Remotion Company License: needed if RedirHub has more than 3 employees. Once settled, add `acknowledgeRemotionLicense` to the gallery `<Player>` | Business | Open |
| Apply `docs/aws/reels-lifecycle.json` to the bucket (merge with existing rules) | AWS admin | Open |
| Delete the three per-commit renders published under the old `reels/qr-no-reprint/<sha>.*` layout | AWS admin | Open |
| Remotion's AAC track plays ~43 ms (2048 samples) late in the MP4: its encoder priming isn't signalled, so every effect lands ~1 frame after its picture. Rendering audio as WAV and muxing with ffmpeg's AAC measured exact. Fix in `scripts/render.mjs` | Reels | Open (2026-10-02) |
| Close `redirhub/marketing#164` (the HTML sketch this repo replaced) | Owner | Open |
| Enable "Automatically delete head branches" in repo settings | Owner | Open |

Update this table as items close.

## 6. Reel log

| Reel | Shipped | Use case | POV | Notes |
|---|---|---|---|---|
| `qr-no-reprint` | 2026-09-29 | Trackable QR codes | "A QR code is a printed URL, not just a graphic." | Monitoring alert shown: that claim is plan-qualified |
| `homepage-explainer` | 2026-09-29 | All four (homepage explainer, 60s landscape) | "The public URL should be stable. The destination can change." | Uses all four approved platform numbers; monitoring plan-qualified; no end-card QR (plays on redirhub.com) |
| `free-coffee` | 2026-10-01 | Branded links (16s sound-designed short) | "The public URL should be stable. The destination can change." | One browser shot, real app flow (Links → Edit link → Save changes); Pixabay track ("Soft") and one-shots (click, "What!?" meme); 11 SFX incl. a repeated click motif (explicit `<Sfx budget>`); keystrokes still free-plan ElevenLabs (replace before posting); no claims, no end-card QR |

**Unused Signature POVs** (approved external, as of 2026-09-29; re-check Notion):
- Domain redirects: "A redirect-only domain still needs real infrastructure." / "DNS does not redirect a URL. HTTP does."
- Website migrations: "The migration is not finished on launch day. Launch is when monitoring starts." / "A migration is primarily a URL inventory and mapping problem."
- Branded links: "A link carries reputation before it carries traffic." / "A branded link is not a cosmetic decision. It is an ownership decision."
- Cross-use-case: "A redirect can be technically healthy while the user journey is broken."
