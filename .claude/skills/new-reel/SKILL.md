---
name: new-reel
description: Plan, build, verify and ship a new RedirHub social video (Reel, Short, TikTok) in this repo, or a variant of an existing one. Use when asked to create, script, storyboard, produce or remake a reel/video, or to change one's story, copy, music or timing.
---

# New reel

Follow `docs/reel-playbook.md`. It has the sources, process, decisions and gotchas. The short version:

1. **Read first:** `docs/reel-playbook.md` (sections 1–4) and `AGENTS.md`. Check the playbook's
   **reel log** and **open items**.
2. **Ground the story in Notion.** Don't write from memory:
   - Fetch the Positioning & Messaging page (`3bda0f405c6c81e0bcc9c870d162f26b`).
   - Query the POV Library (`collection://ed4b3e5d-68c0-455e-9bea-b5839a14937c`) for
     `Status = 'Approved external'`, and pick **one** POV, preferably Signature and not used yet.
   - Query Approved Claims (`collection://774f12f8-1692-4541-ae20-f32cc3066f1f`) for every
     claim you plan to show.
   If the Notion connector isn't available, stop and say so rather than inventing positioning.
3. **Agree on the storyboard** (beat table: hook 0–3s, stakes, product ≥ ⅓ of runtime,
   before/after, CTA) and the claims list with the user **before** building, unless they
   asked you to just go ahead.
4. **Build** in `src/remotion/reels/<id>/` (props.ts, one file per scene, composition), register it in
   `src/reels.ts`, and reuse `src/remotion/components/`. Every QR uses `<BrandedQr>`. Keep copy inside
   y 200–1600.
5. **Audio:** don't compose music. Add `src/remotion/reels/<id>/music.json` (bpm, duration,
   `drop` = when the product appears, `mute` = dramatic silences), run `npm run audio`, and use
   `<Beat />` (drums only, by design; don't add melodic layers). Put SFX on top with `<Sfx cues />`,
   **restrained**: one per story beat (problem, detection, fix, cut to result, end card), ≤ 6 per
   30s, no UI sounds (clicks, typing). Restraint is the premium sound.
6. **Verify:** `npm run typecheck`, `npm run build`, `npm run render -- <id>`, then
   `python3 scripts/qa/check_reel.py out/<id>.mp4 --qr <sec>=<url>`. **Look at the contact
   sheet** and fix anything off before calling it done. Say plainly that you can't listen to
   the audio.
7. **Ship:** branch + PR (the owner merges). Add the reel's storyboard, claims check and
   caption to `README.md`, a row to the playbook's reel log, and update open items. Share the
   rendered MP4 with the user.
