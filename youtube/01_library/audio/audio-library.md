# Audio library (channel)

Log every sound here: file, source, license (with the certificate file), where it's used.

**Leo's RedirHub sounds:** Leo sent four Pixabay effects on 2026-10-08 (originals in `sfx/`, licences in
`docs/audio-licenses.md`); W41 uses them for the click, pop, transition and rewind. His music
backgrounds are still on his machine (see `music/README.md`); until they land, the bed is the generated pad.
The "typing on a laptop" file that came with them is the ElevenLabs free-plan generation (not cleared
for commercial use), so typing stays generated.

Status 2026-10-08 (revision 3): four Pixabay one-shots (Pixabay Content License; the page URL is the
record, licence certificates not on file: Leo can download them from each page while signed in), everything else generated in-repo
(`scripts/audio/generate.py`: numpy/scipy, deterministic, original, royalty-free).

| Role | File | Source | License / certificate | Content ID | Used in (W41) |
|---|---|---|---|---|---|
| **click** | `public/audio/redirect-domain/click.wav` (0.18 s) | Pixabay: Universfield, "Computer Mouse Click" | Pixabay Content License | none known | every button press on screen: Buy, forwarding, Create, Domain Redirect, 301, keep path, Save, Hostnames, Connect DNS |
| **typing** | `public/audio/sfx/typing.wav` (1.65 s) | generated (`sfx.py: typing`) | original | n/a | each field that fills: the search, the old address, redirect from/to, the test, the private window |
| **pop** | `public/audio/redirect-domain/pop.wav` (0.25 s) | Pixabay: joe_bou_khalil, "Micro Transient Balloon Burst" | Pixabay Content License | none known | cards and chips arriving, tips, the three checks |
| **transition** | `public/audio/redirect-domain/transition.wav` (1.0 s) | Pixabay: trading_nation, "Transition Coat" | Pixabay Content License | none known | twice only: the title card (10) and into the dashboard (25). Leo: "the whoosh sound is everywhere" |
| **rewind** | `public/audio/redirect-domain/rewind.wav` (1.0 s) | Pixabay: Universfield, "Swoosh Back Motion" | Pixabay Content License | none known | the time-reverse (39), once |
| **denied** (problem) | `public/audio/sfx/denied.wav` (0.75 s) | generated (`sfx.py: denied`) | original | n/a | "Dead." (9), no certificate (20) |
| **fixed chime** (signature) | `public/audio/sfx/fixed.wav` (1.1 s) | generated (`sfx.py: fixed`) | original | n/a | only when something broken is now right: HTTPS issued (35), padlock in the private window (41), all three green (47), "Now it is." (52) |
| snap | `public/audio/sfx/snap.wav` | generated | original | n/a | the records change (17), DNS check green (35) |
| alert | `public/audio/sfx/alert.wav` | generated | original | n/a | "Not secure" (5), Chrome's warning (22) |
| success | `public/audio/sfx/success.wav` | generated | original | n/a | lands on the new site (2), three concepts ticked (24), redirect saved (30) |
| stinger | `public/audio/sfx/stinger.wav` | generated | original | n/a | end card (53), low |
| **bed** | `public/audio/redirect-domain-bed.mp3`, built from `redirect-domain-beat.mp3` | generated pad (`scripts/audio/pad.py`) fitted and ducked by `scripts/yt/bed-build.py` | original | n/a | whole film at a steady ≈ −31 LUFS (16 LU under the voice), dipping under quiet words; never within 11 LU of her while she speaks, 8 LU of her level anywhere (checked on every build) |
| voiceover | `public/audio/redirect-domain-vo.mp3` | ElevenLabs, Emily `zHGX9VSXpW8cGSDRCqy0`, `eleven_multilingual_v2` | **open**: regenerate on a paid plan before publishing (production-notes §3) | n/a | whole film |

47 cues in 5:09: one per story beat plus a click or typing sound per on-screen UI action, which Leo asked for
(`<Sfx budget>` with that reason). Two transitions in the whole film; no hover sounds.

Mix target: -14 LUFS integrated, -1 dBTP, voiceover on top. Measured on each render in
`02_videos/<video>/renders/render-log.md`.

Before a Pixabay sound goes into a cue: keep the original in `sfx/` or `music/` under its Pixabay file
name, add its page URL to `docs/audio-licenses.md`, note any Content ID claim, and list it here.
