# Voiceover

| File | What |
|---|---|
| `casting/` | The two casting lines (Bella, Emily) on the shared test text. Listening copies only. |
| `chunks.json` | The script cut into 16 chunks (which beats, the exact text sent to ElevenLabs). |
| `chunks/cNN.mp3` | One take per chunk, Emily (`zHGX9VSXpW8cGSDRCqy0`, `eleven_multilingual_v2`, voice defaults). |
| `asr-vosk.json` | Raw word-level recognition of each take (Vosk small English model). Delete to re-run. |
| `assembly.json` | Lead-in, chunk joins, extra silence after beats, silent beats. Edit to re-time. |
| `timings.json` | GENERATED: every beat's start/end and every word's time on the film's clock. `timeline.ts` reads it. |

Build (writes `timings.json` and `public/audio/redirect-domain-vo.mp3`):

```bash
VOSK_MODEL=/path/to/vosk-model-small-en-us-0.15 \
python3 scripts/yt/vo-build.py youtube/02_videos/2026-W41_redirect-domain \
  src/remotion/reels/redirect-domain/script.ts public/audio/redirect-domain-vo.mp3 --wav /tmp/vo.wav
```

Re-take one chunk: replace its mp3, delete `asr-vosk.json`, build, render. Scenes read beat
times, so the picture follows the new take.
