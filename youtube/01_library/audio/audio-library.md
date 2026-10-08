# Audio library (channel)

Log every sound here: file, source, license (with the certificate file), where it's used.
Status 2026-10-06: **planned, not yet sourced** (Pixabay downloads need a browser session; the
ElevenLabs account needs a paid plan for the signature chime). The reels repo's generated effects
(`public/audio/sfx/`, royalty-free, reproducible) are the fallback and may be used as-is.

| Role | File | Source | License / certificate | Content ID | Used in |
|---|---|---|---|---|---|
| whoosh | — | Pixabay (to pick) | Pixabay Content License · certificate.pdf | must be clear | transitions (draw, dock) |
| click | — | Pixabay | | | UI actions in the walkthrough (sparingly) |
| pop | — | Pixabay | | | pills / badges appearing |
| error | — | Pixabay | | | beats 5–9 problems |
| typing | — | Pixabay | | | form fields (very low) |
| swipe | — | Pixabay | | | tip cards in/out |
| riser / hit | — | Pixabay | | | into the title; "All three green" |
| success | — | Pixabay | | | checks |
| **fixed chime** (signature) | — | ElevenLabs SFX (paid plan) | ElevenLabs commercial terms | n/a | fix moments and the end card only |
| fallback set | `public/audio/sfx/*.wav` | generated in-repo (`scripts/audio/generate.py`) | original, royalty-free | n/a | any of the above |

Mix target: -14 LUFS integrated, -1 dBTP, voiceover on top.
