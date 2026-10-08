# Audio library (channel)

Log every sound here: file, source, license (with the certificate file), where it's used.

**Leo's RedirHub sounds (pending):** Leo has a folder of music backgrounds and effects on his
machine. They are the intended music and effects for every video; see `music/README.md` for how to
drop them in. Until they land, W41 uses the generated set below.

Status 2026-10-08 (revision 2): **everything in W41 is generated in-repo** (`scripts/audio/generate.py`:
numpy/scipy oscillators and noise, deterministic, original, royalty-free). No Pixabay file was
used (downloads need a browser session) and no ElevenLabs sound effect (the workspace had no
credits left after the narration), so there are no third-party certificates to file yet.

| Role | File | Source | License / certificate | Content ID | Used in (W41) |
|---|---|---|---|---|---|
| **denied** (problem) | `public/audio/sfx/denied.wav` (0.75 s) | generated (`sfx.py: denied`), two soft tones stepping down | original | n/a | every problem beat (wrong page, gone, rankings, dead QR, no certificate). Replaced the square-wave `error`, which Leo found harsh |
| **pop** | `public/audio/sfx/pop.wav` (0.3 s) | generated (`sfx.py: pop`) | original | n/a | cards and chips arriving, the three checks |
| **fixed chime** (signature) | `public/audio/sfx/fixed.wav` (1.1 s) | generated (`sfx.py: fixed`) two soft bells a fifth apart | original | n/a | only when something broken is now right: HTTPS issued (beat 35), padlock in the private window (41), all three green (47), "Now it is." (52) |
| rewind | `public/audio/sfx/rewind.wav` (1.1 s) | generated (`sfx.py: rewind`) | original | n/a | the time-reverse (beat 39), once |
| whoosh | `public/audio/sfx/whoosh.wav` | generated | original | n/a | the redirect line draws (2), note → 301 (14) |
| snap | `public/audio/sfx/snap.wav` | generated | original | n/a | the card lands (2), DNS check green (35) |
| alert | `public/audio/sfx/alert.wav` | generated | original | n/a | "Not secure" (5) |
| error | `public/audio/sfx/error.wav` | generated | original | n/a | "gone" (7), "Dead." (9) |
| swish | `public/audio/sfx/swish_r.wav` | generated | original | n/a | title sweep (10) |
| success | `public/audio/sfx/success.wav` | generated | original | n/a | three ideas filled (24), redirect saved (30) |
| stinger | `public/audio/sfx/stinger.wav` | generated | original | n/a | end card (53), low |
| **bed** | `public/audio/redirect-domain-bed.mp3`, built from `redirect-domain-beat.mp3` | generated pad (`scripts/audio/pad.py`) fitted and ducked by `scripts/yt/bed-build.py` | original | n/a | whole film, ≈ 20 LU under the voice; never within 10 LU of her while she speaks (checked) |
| voiceover | `public/audio/redirect-domain-vo.mp3` | ElevenLabs, Emily `zHGX9VSXpW8cGSDRCqy0`, `eleven_multilingual_v2` | **open**: regenerate on a paid plan before publishing (production-notes §3) | n/a | whole film |

39 cues in 5:17 (cap 63), one per story beat; no typing or hover sounds.

Mix target: -14 LUFS integrated, -1 dBTP, voiceover on top. Measured on each render in
`02_videos/<video>/renders/render-log.md`.

If a Pixabay sound is ever added: save the license certificate PDF beside the file, note the
Content ID status, and list it here before it goes into a cue.
