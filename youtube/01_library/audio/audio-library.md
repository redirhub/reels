# Audio library (channel)

Log every sound here: file, source, license (with the certificate file), where it's used.
Status 2026-10-08: **everything in W41 is generated in-repo** (`scripts/audio/generate.py`:
numpy/scipy oscillators and noise, deterministic, original, royalty-free). No Pixabay file was
used (downloads need a browser session) and no ElevenLabs sound effect (the workspace had no
credits left after the narration), so there are no third-party certificates to file yet.

| Role | File | Source | License / certificate | Content ID | Used in (W41) |
|---|---|---|---|---|---|
| **fixed chime** (signature) | `public/audio/sfx/fixed.wav` (1.1 s) | generated (`sfx.py: fixed`) two soft bells a fifth apart | original | n/a | only when something broken is now right: HTTPS issued (beat 35), padlock in the private window (41), all three green (47), "Now it is." (52) |
| rewind | `public/audio/sfx/rewind.wav` (1.1 s) | generated (`sfx.py: rewind`) | original | n/a | the time-reverse (beat 39), once |
| whoosh | `public/audio/sfx/whoosh.wav` | generated | original | n/a | the redirect line draws (2), note → 301 (14) |
| snap | `public/audio/sfx/snap.wav` | generated | original | n/a | the card lands (2), DNS check green (35) |
| alert | `public/audio/sfx/alert.wav` | generated | original | n/a | "Not secure" (5) |
| error | `public/audio/sfx/error.wav` | generated | original | n/a | "gone" (7), "Dead." (9) |
| swish | `public/audio/sfx/swish_r.wav` | generated | original | n/a | title sweep (10) |
| success | `public/audio/sfx/success.wav` | generated | original | n/a | three ideas filled (24), redirect saved (30) |
| stinger | `public/audio/sfx/stinger.wav` | generated | original | n/a | end card (53), low |
| **bed** | `public/audio/redirect-domain-beat.mp3` | generated pad (`scripts/audio/pad.py`, `music.json` kind `pad`, D major, 72 bpm, one chord per two bars) | original | n/a | whole film at volume 0.22 (≈ -30 LUFS under the voice) |
| voiceover | `public/audio/redirect-domain-vo.mp3` | ElevenLabs, Emily `zHGX9VSXpW8cGSDRCqy0`, `eleven_multilingual_v2` | **open**: regenerate on a paid plan before publishing (production-notes §3) | n/a | whole film |

Not used, by design: clicks, typing, pops, swipes (UI micro-actions stay silent; 16 cues in
5:26, well under the `<Sfx>` cap of 6 per 30 s).

Mix target: -14 LUFS integrated, -1 dBTP, voiceover on top. Measured on each render in
`02_videos/<video>/renders/render-log.md`.

If a Pixabay sound is ever added: save the license certificate PDF beside the file, note the
Content ID status, and list it here before it goes into a cue.
