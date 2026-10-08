# Music and sound library (Leo's RedirHub sounds)

Leo's music backgrounds and sound effects live on his machine at
`C:\Users\word\Music\redirhub-reels\redirhub sounds`. The cloud session that edited W41 could
not reach that folder, so they are not in the repo yet. To use them:

1. **Music beds** → copy the files here (`youtube/01_library/audio/music/`), keeping the names.
2. **Sound effects** → copy them to `public/audio/library/sfx/`.
3. Commit and push to the video's branch (GitHub web upload works: "Add file → Upload files").
4. List each file and its licence in `youtube/01_library/audio/audio-library.md`.

Then, per video:

- **Music:** set `"source"` in `youtube/02_videos/<video>/bed.json` to the track's path and run
  `python3 scripts/yt/bed-build.py youtube/02_videos/<video> <reel id>`. It loops or trims the track
  to the film, ducks it under every spoken word and **refuses to build** if the music ever comes
  within 10 LU of the voice while she speaks, or within 8 LU of her level anywhere. Variations:
  pick a different `"start"` offset into the same track, or a different track per act.
- **Sound effects:** in `src/remotion/reels/<id>/sound.ts`, point a role (error, pop, whoosh,
  success, fixed…) at the file, e.g.
  `error: { name: 'error', src: 'audio/library/sfx/error.mp3', seconds: 0.8 }`.
  Every cue that uses the role switches at once.
