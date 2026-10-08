# Production notes — decisions, verification and blockers (checkpoint, 2026-10-06)

## 1. Engine: Remotion, extended to 16:9 (decided)

**Choice:** the existing `redirhub/reels` Remotion stack, with a 16:9 `redirect-domain` composition
and a set of shared components for the channel.

Why, in order of weight:
1. **One system.** The reels repo already renders MP4s in GitHub Actions on every push, publishes
   to S3/CloudFront and previews in the Vercel gallery. A YouTube video in the same registry gets
   the same CI, QA script (`scripts/qa/check_reel.py`), fonts, brand tokens and logo marks for free.
2. **16:9 already works.** `homepage-explainer` is a 60 s `LANDSCAPE` composition; nothing in the
   renderer is portrait-specific.
3. **Everything is a function of time.** Remotion's model matches the discipline "the script
   dictates the video": beat times come from a timeline module, and a VO retime changes one file.
4. **Reuse.** The free-coffee reel already recreates the real Links list and Edit form from
   `redirhub/lviv`; the new `Dash.tsx` extends it with Create, Domain Redirect and Connect DNS.
5. **FFmpeg is bundled** (Remotion ships its own), so the final H.264/AAC encode and loudness checks
   run in the same environment.

HeyGen HyperFrames (HTML → MP4, Apache 2.0) would also do the job, but it would be a second
pipeline with no CI, no gallery and no shared components. Not worth splitting the team's system
for a first video. Revisit only if a future video is mostly HTML pages.

Open: the Remotion Company License question from the reels playbook still applies (free up to 3
employees). Unchanged by this decision, but YouTube publishing is public use, so settle it.

## 2. Workflow built this week (reusable)

```
script.md ──(scripts/yt/beats-from-script.py)──▶ src/remotion/reels/<id>/script.ts
                                                       │
voiceover/chunks/*.mp3 + chunks.json + assembly.json    │
      ──(scripts/yt/vo-build.py: align words, cut beats, lay out)──▶ voiceover/timings.json
                                                       │               + public/audio/<id>-vo.mp3
                                                       ▼
scenes read beat times only (local(scene).at(n) / .word(n, 'Those')) ──▶ composition ──▶ stills / render / QA
```

- `scripts/yt/vo-build.py <video> <script.ts> <vo.mp3> [--wav mix.wav]`: word-aligns every take to
  the script, cuts the takes into beats at the pause between them, inserts the silences
  `assembly.json` asks for (lead-in, stillness after "It looks done.", title card, rewind, the
  caption-only wait, the end card) and writes `timings.json` + the VO track. Re-running it after a
  re-take moves the picture with the voice; nothing in the scenes changes.
- `timeline.ts` reads `timings.json`. `local(scene).word(n, 'word')` lands a visual on the spoken
  word instead of a guessed offset (used for three captions so far).
- `scripts/yt/beat-times.py <id>` prints the timeline or the seconds for `beat+offset`.
- `scripts/yt/stills.mjs <id> <dir> <seconds…>` renders stills, bundling once; a failing still is
  reported and the run continues, so one pass lists every hold-rule violation.
- `<OnScreenText>` enforces the hold rule (≥ 1 s, or words ÷ 3 + 1) at render time: five
  violations were caught this way (two in the style-frame pass, three when the real VO arrived) and
  fixed in the script or the assembly, never by hand-waving.

## 3. Voice (Emily, generated; licensing open)

Test line (48 words, same for every candidate):
> "Here's the thing about moving to a new domain. The hard part isn't the move. It's everything
> that still points at the old one. Old links, old emails, a QR code on a menu somewhere. So let's
> make sure none of it breaks. It's simpler than you think."

| Candidate | voice_id | Why shortlisted | Test result |
|---|---|---|---|
| **Emily — Trustworthy, Warm, Conversational** (library, professional) — **chosen** | `zHGX9VSXpW8cGSDRCqy0` | "Trustworthy, warm and conversational… confident, clear and reassuring… product demonstrations". Closest description to the brief's "smart, transparent friend". | Casting: 14.47 s → ~199 wpm on the test line. Full read: 794 words in 299 s of speech = **159 wpm** (the longer sentences and natural pauses slow it; no speed change needed). |
| **Bella — Professional, Bright, Warm** (premade) — runner-up | `hpp4J3VqNfWAUOO0d1Us` | "warm, bright… crisp diction, deliberate rhythmic pace… for long-form listening". Premade = always available. | Casting: 14.89 s → ~193 wpm. `voiceover/casting/bella-….mp3` |
| **Megan — Warm & Trusted Training Voice** (library) | `1FmDfZG0Nx2dCk793S1a` | "Calm confidence and natural authority… explainer videos". | Not generated: ElevenLabs refused the third casting line ("Unusual activity… Free Tier access has been disabled"). |

Leo's "go" came without a voice pick, so the recommendation (Emily) stands.

**How the narration was made** (`voiceover/`):
- `chunks.json`: the script cut into 16 chunks of 1–6 beats (a chunk ends where the picture
  needs air), ~26 s each, so one bad take costs one chunk. Text is the script verbatim; no
  direction tags (`eleven_multilingual_v2` has none; the MCP tool exposes no speed, stability
  or similarity settings, so the voice's defaults are what you hear).
- Flow `FeWrCONVo6cuxKEzu17u`, one generation per chunk, re-runs sent one at a time. Four
  chunks failed outright with the Free-tier block and three sat in "pending (concurrency)";
  every re-run that produced audio was kept, none re-generated after success.
- Word timestamps: ElevenLabs Scribe refused the probe transcription (quota: 4,463 credits
  needed, 2,740 left), so the alignment uses **Vosk** (small English model, local, offline)
  matched to the script with `difflib`; 97 % of words matched directly, the rest interpolated
  between their neighbours (`asr-vosk.json` is the raw recognition). Every cut between beats
  was checked to sit in a pause of the take, and the silences the assembly inserts all fall at
  chunk edges or at matched pauses.
- `assembly.json`: lead-in 0.6 s, 0.3 s at chunk joins, extra silence after beats 3, 10, 11,
  24, 36, 39, 43, 47, 52; silent beats 42 (4.2 s) and 53 (6 s). Film length **325 s (5:25)**.
- **Re-take:** chunk c09 (beats 28–30). The first take read the URL's punctuation ("h t t p s
  colon slash slash my brand dot com", confirmed by the recogniser). The chunk text now writes
  the address as it should be spoken ("Redirect to: HTTPS, mybrand.com."); the script itself is
  unchanged. Rule for next time: write URLs in chunk text the way a person says them.

**Licensing — open item for Kris/Leo.** The connected ElevenLabs workspace reports a 10,000
credit quota and intermittently refuses with the Free-tier message, so this narration should be
treated as **not cleared for commercial use** until the account is confirmed paid. The pipeline
is built for the swap: regenerate the same 16 chunk texts with the same voice on a paid plan,
drop them into `voiceover/chunks/`, delete `asr-vosk.json`, run `vo-build.py` (with
`VOSK_MODEL` set) and re-render. Timings move with the new takes; nothing else changes.

**Pronunciation of "RedirHub":** not documented anywhere I could find. Emily says it as
"re-DIR-hub" (the recogniser heard "reader hub" / "redirect hub"); confirm or correct it.

**Proposed rule.md §7 entry (TESTING until Leo approves):** voice `zHGX9VSXpW8cGSDRCqy0`
(Emily), model `eleven_multilingual_v2`, voice defaults, chunk the script by beats (1–6 per chunk,
≤ 30 s), align with Scribe when the plan allows, Vosk otherwise, never re-generate a chunk that
succeeded, and keep the takes under `voiceover/chunks/` so a re-take is one file.

## 4. Sound (plan; Phase 4)

- **Library** `01_library/audio/`: whoosh, click, pop, error, typing, swipe, riser/hit, success
  from Pixabay (Content License, no attribution needed), skipping anything flagged for YouTube
  Content ID; save each license certificate PDF beside the file; log in `audio-library.md`.
  Pixabay downloads need a browser session; not fetched from this container yet.
- **Fallback that already exists:** the repo's generated SFX (`public/audio/sfx/*.wav`, numpy/scipy,
  reproducible, royalty-free) cover whoosh / impact / alert / success / stinger / snap today.
- **Signature "fixed" chime:** ElevenLabs sound effects (needs the paid plan) → plays only on fix
  moments (beat 35 HTTPS ✓, beat 41 landing, beat 47 all green, beat 52/53 end card).
- **Bed:** a quiet, low pad or none. The reels' drums-only beat is wrong for a 5-minute tutorial with
  narration. Decide in Phase 4; Pixabay track with certificate if used.
- **Mix:** VO on top; -14 LUFS integrated, -1 dBTP; measured with ffmpeg `ebur128` in the QA step.
- The reels rule "no voiceover" is a reels decision (sound-off viewing). YouTube is voice-led.

## 5. The Chrome line (verified 2026-10-06)

| Source | Says |
|---|---|
| Google Security Blog, "HTTPS by default" (Oct 2025) | "with the release of Chrome 154 in October 2026, we will change the default settings of Chrome to enable 'Always Use Secure Connections'" for public sites; Chrome 147 (Apr 2026) first for Enhanced Safe Browsing users; phased. |
| Chromium release schedule API | Chrome 154 stable 2026-09-22; **Chrome 155 stable 2026-10-06 (today)**. Current stable build 155.0.8059.26. |
| Chrome Enterprise release notes (as of this check) | Page still lists 152 as the latest full notes; press summaries place the public-site default in 154 or 155. |

Conclusion: the change is landing now, but I could not confirm it is on for every Chrome user
today. The script therefore says **"Chrome is rolling out a warning before it opens public sites
that aren't secure"**, never "Chrome now warns". Kris to confirm the wording; if Chrome's own
release notes confirm the default by publish day, "has started warning" is fair.

## 6. Product facts: what changed since the brief

| Brief said | Notion Product Facts — Core says now | Effect on the video |
|---|---|---|
| One-click Connect DNS / Domain Connect **not live**; show manual record copying | **Connect DNS (automatic and manual DNS setup)** — LIVE, external use **Approved 2026-10-05**. Automatic = Domain Connect, Cloudflare today; Manual with CNAME / A switch; Nameservers add-on | Video shows **Manual** (works for everyone, teaches the records). Automatic tab is built in `Dash.tsx`; left out of the VO for length; goes in the description. Leo: want a 6 s insert? |
| Links → Create → Domain Redirect LIVE, external use **Needs review** | **Approved 2026-10-06** (product-owner confirmation) | No flag needed any more; noted for the record |
| Root = A + TXT, www = CNAME; root covers www | Confirmed (Connect DNS rules; Whole-domain catch-all row) | As scripted |
| Automatic HTTPS, path forwarding, all plans | Confirmed | As scripted ("Keep path") |

Record formats come from the live `get-host` API on the RedirHub workspace (A → `3.33.236.10`,
TXT → `reh-verify=<edge>.rediredge.com`, CNAME → `<edge>.rediredge.com`). The Notion text writes
`rehd-verify=`; the API writes `reh-verify=`. The video uses the API's format with an illustrative
edge id (`k7m2qx`). **Kris: OK to show the real anycast IP?** It is what every customer sees, and the
VO says "copy yours, not mine".

## 7. UI fidelity

The Notion screenshots (Links list and Create chooser, 2026-10-01; Hostnames and Connect DNS,
2026-10-05) were retrieved on 2026-10-08 and sit in `reference/`. `Dash.tsx` was then redrawn
against them: icon-over-label sidebar, the amber **+ Create** split button, the filter chips and
counts, row avatars with status dots and the green trend pills, the chooser's exact title,
subtitle, four descriptions and examples and its "Import CSV" footer, the Hostnames rows
(provider · added, DNS issue / Connected pills, the bolt **Connect DNS** button, link counts),
and the Connect DNS window (hostname header with status pill, the provider → edge → links strip,
Manual *Recommended* / Automatic ⊘ / Nameservers *Add-on* tabs, steps 1–3, the CNAME / A record
switch, the records table with copy buttons, "We check every few seconds · You can close this.
We email you when it's live.").

Two deliberate deviations, both for the video's fairness rule: the detected provider reads
**"Your DNS provider"** instead of the registrar name, and the helper line says "Your provider
doesn't support automatic setup yet" instead of naming one. Everything else is the product's copy.

Still unverified (no screenshot exists): the **Domain Redirect form** (fields and labels are from
the Product Facts spec: Redirect from / Redirect to / 301 or 302 / Keep path) and the success
toast. Kris: a capture of that form would let me match it exactly before Phase 3.

**Fidelity nits left open after the review** (no screenshot to copy from, or not worth a
re-render alone): the Hostnames sidebar icon (globe in the film, a server icon in the real UI) and
the Connect DNS dialog's footer ("Most providers publish changes within minutes · Later · I've
added the record"). Fix when the dialog is next touched.

## 8. Where things live

The brief's paths are on Kris's machine (`…\Youtube Content Engine\`). This session can't reach
them, so the `youtube/` folder in this repo mirrors that structure (`01_library/`,
`02_videos/2026-W41_redirect-domain/`, `rule-v0.3-proposal.md`). Copy across when convenient; the
repo is the working copy for anything rendered.

Not read (unreachable): `rule.md` v0.2, `brief.md` v1, `script.md` v2, Brand Guidelines v2, the
`01_library` contents, `free-coffee.mp4` in the Claude project. Worked from the brief's summary of
each, the repo's brand tokens (mirrored from `redirhub/marketing`), and the free-coffee source.
Anything in those files that contradicts a choice here wins; tell me and I'll change it.
