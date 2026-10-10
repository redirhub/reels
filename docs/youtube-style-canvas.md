# YouTube style canvas: one canvas per video

Every RedirHub YouTube video gets its own **style canvas**: a claude.ai Design canvas of live HTML
mockups, one 1920×1080 artboard per key frame, that people review and comment on before and after
the video is built. Leo's rule (2026-10-10): **the canvas is named after the video, and the next video
goes on a new canvas.** Never add a second video's frames to an existing canvas.

## Canvases so far

| Video | Canvas (title = video title) | Source in the repo |
|---|---|---|
| W41 · How to Redirect a Domain to Another Domain (With HTTPS That Actually Works) | https://claude.ai/artifact/VtcXcWtwwRQWjWYbN2TcCx | `youtube/02_videos/2026-W41_redirect-domain/style-canvas/project/` |

Add a row for each new video. The canvases are private until shared from the page's Share menu.

## Making the canvas for a new video

1. **Create a new canvas** from the Artifact type **Design** (the canvas type), with `title` = the video's
   working title exactly as in its `packaging.md` (e.g. "How to Set Up a 301 Redirect for One Page").
   Don't reuse or republish another video's canvas URL.
2. **Start from the latest video's source**: copy `youtube/02_videos/<latest video>/style-canvas/project/`
   (an index `canvas.json` plus one `.dc.html` per artboard) and rewrite the frames for the new story.
   Keep the system boards (`System.dc.html`, `Sound.dc.html`) unless the look changes on purpose; if it
   does, say what changed in the canvas's teal sticky note and in the video's `production-notes.md`.
3. **Frames to cover** (keep the order; rows are the acts, each with a `title1` note above it):
   title card · the problem in real browser UI · concept map · one object per idea · dashboard step with
   a quick tip · the turn (caption) · checks · before-you-go tips · end card · system · sound and timing.
   Add or drop frames to fit the story, but every video has a title card, a dashboard step and the end card.
4. **Draw them in the channel look** (tokens in `src/remotion/brand/tokens.ts`, `yt`): Night `#0B1426`
   with the soft blue glow at the top, Plus Jakarta Sans for display and eyebrows, Inter for captions and
   product UI, JetBrains Mono for every address and record. Teal means fixed, red means broken, amber
   once a scene, blue only inside product UI. Eyebrow top-left at 120 px; captions under the stage;
   tips solid and beside the stage. Product UI mirrors the real dashboard; no invented features.
5. **Real content only**: the video's actual lines, domains and records. Every QR mockup encodes the real
   branded link and shows it underneath, exactly as on screen.
6. **Save the source** in `youtube/02_videos/<video>/style-canvas/project/` and add the row above in the
   same commit. Film stills of the approved cut go in `youtube/01_library/style/keyframes/<video>/`.
7. Build the video in Remotion from the approved frames (`docs/reel-playbook.md`), reusing the shared
   components (`FixedEndCard`, `BrandedQr`, `OnScreenText`, `Cursor`, the browser and dashboard pages).
   If the built film drifts from the canvas on purpose, update the canvas after the cut is approved.

## The workflow for a new YouTube video

Agreed after W41 (2026-10-10). W41 took three review rounds because most problems (phone-call voice,
the menu example, "full disclosure", too many whooshes, quiet music) only showed up after a full render.
Each could have been caught at the script, canvas or voice-sample stage, so review happens there.
Target: two review rounds at most (step 4 and the step 5 polish).

| Step | Who | Output | Review |
|---|---|---|---|
| 0. Prep | Leo | Topic; music and SFX files in the repo; the branded link for the end-card QR | Nothing starts until the assets are in |
| 1. Script | Claude | Script, claims check against the Notion Approved Claims library, YouTube title | **Review 1:** story, hook, wording |
| 2. Style canvas | Claude | A new canvas named after the video, started from the latest video's canvas files; one HTML mockup per key frame with the real copy | **Review 2:** comment on the canvas; changing a frame here costs minutes, not a render |
| 3. Voice sample | Claude | A 30-second sample on a paid ElevenLabs plan (cleared for commercial use) | **Review 3:** voice and pace, about 5 minutes |
| 4. Build | Claude | Remotion build from the approved canvas, automatic checks, one full preview render | **Review 4:** watch once, send every change in one list |
| 5. Final | Claude | One polish round, then CI publishes the download link; packaging (title, description, chapters, captions, thumbnail); stills of the cut added to the canvas | Download and upload |
| 6. Retro | Claude | Lessons added to `docs/reel-playbook.md` | None |

The automatic checks in step 4 fail the render on their own: every line holds long enough to read, the
music stays under the voice, the effect count stays within budget, the QR scans, and loudness is −14 LUFS.
