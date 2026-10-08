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
timeline.ts: 155 wpm + breath + visual extras ─────────┤   Phase 3: voiceover/timings.json
                                                       ▼
scenes read beat times only (local(scene).at(n)) ──▶ composition ──▶ stills / render / QA
```

- `scripts/yt/beat-times.py <id>` prints the estimated timeline or the seconds for `beat+offset`.
- `scripts/yt/stills.mjs <id> <dir> <seconds…>` renders stills, bundling once.
- `<OnScreenText>` enforces the hold rule (≥ 1 s, or words ÷ 3 + 1) at render time: two violations
  were caught this way during the style-frame pass and fixed in the script, not by hand-waving.

## 3. Voice (shortlist; blocked on the ElevenLabs plan)

Test line (48 words, same for every candidate):
> "Here's the thing about moving to a new domain. The hard part isn't the move. It's everything
> that still points at the old one. Old links, old emails, a QR code on a menu somewhere. So let's
> make sure none of it breaks. It's simpler than you think."

| Candidate | voice_id | Why shortlisted | Test result |
|---|---|---|---|
| **Bella — Professional, Bright, Warm** (premade) | `hpp4J3VqNfWAUOO0d1Us` | ElevenLabs tags it informative/educational; "warm, bright… crisp diction, deliberate rhythmic pace… for long-form listening". Premade = always available, stable across weeks. | Generated: 14.89 s → ~193 wpm at default speed. `voiceover/casting/bella-….mp3` |
| **Emily — Trustworthy, Warm, Conversational** (library, professional) | `zHGX9VSXpW8cGSDRCqy0` | "Trustworthy, warm and conversational… confident, clear and reassuring… product demonstrations". Closest description to the brief's "smart, transparent friend". | Generated: 14.47 s → ~199 wpm. `voiceover/casting/emily-….mp3` |
| **Megan — Warm & Trusted Training Voice** (library) | `1FmDfZG0Nx2dCk793S1a` | "Calm confidence and natural authority… not stiff or corporate… explainer videos". | **Failed:** ElevenLabs refused the third generation: "Unusual activity has been detected on your account, so Free Tier access has been disabled… Please upgrade to a paid subscription." |

**Recommendation:** Leo listens to the two files and picks. My default if you want one now:
**Emily** for the brief's tone ("friend over coffee"), Bella as the safer long-form educator. Both
run fast at default settings, so the channel setting should slow them.

**Proposed rule.md §7 entry (TESTING until Leo approves):**
- Model `eleven_multilingual_v2` (v3 only if we need inline direction tags).
- Settings: stability 0.50, similarity 0.75, style 0.15, speaker boost on, **speed 0.85** (brings
  ~195 wpm to the 150–160 wpm target; verify on the first full read and adjust ±0.05).
- Punctuation drives pauses: full stops, not commas, between ideas; an ellipsis for the twist.
- Word-level timestamps from the `with-timestamps` endpoint → `voiceover/timings.json`.
- Pronunciation of "RedirHub": **not documented anywhere I could find** (Notion, repo). Ask Leo.
  Candidates: "REE-dur-hub" or "re-DIRECT-hub"-style "re-DIR-hub".

**Blocker:** the connected ElevenLabs account is on the Free tier, and the API now refuses
generations. The reels playbook already notes that free-tier output is **not licensed for
commercial use**. Phase 3 needs a paid plan before the real narration is generated. Casting files
above are for listening only.

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

## 8. Where things live

The brief's paths are on Kris's machine (`…\Youtube Content Engine\`). This session can't reach
them, so the `youtube/` folder in this repo mirrors that structure (`01_library/`,
`02_videos/2026-W41_redirect-domain/`, `rule-v0.3-proposal.md`). Copy across when convenient; the
repo is the working copy for anything rendered.

Not read (unreachable): `rule.md` v0.2, `brief.md` v1, `script.md` v2, Brand Guidelines v2, the
`01_library` contents, `free-coffee.mp4` in the Claude project. Worked from the brief's summary of
each, the repo's brand tokens (mirrored from `redirhub/marketing`), and the free-coffee source.
Anything in those files that contradicts a choice here wins; tell me and I'll change it.
