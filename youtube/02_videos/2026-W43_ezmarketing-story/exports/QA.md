# EZMarketing story: QA (final, v1)

`ezmarketing-story_9x16_v1.mp4`: text-only cut, composition `ezmarketing-story`
(`src/remotion/reels/ezmarketing-story/`). Checked 2026-10-17 on the mastered export.

| Check | Result |
|---|---|
| Format | H.264 High, yuv420p, 1080×1920, 30 fps (1707 frames). AAC-LC, 48 kHz, stereo, 256 kb/s |
| Length | **56.90 s**: over the brief's 44–52 s. The owner asked for slower pacing at the animatic ("even if the reel was a bit longer") |
| Loudness | Integrated **−14.1 LUFS**, true peak **−1.7 dBTP**, LRA 3.8 LU (`ffmpeg -af ebur128=peak=true`). Target ≈ −14 LUFS, ≤ −1 dBTP: **pass** |
| Beat midpoints | **Pass.** One frame per beat midpoint, checked against the safe band (y 260–1500, x 80–1000). All text sits inside it, nothing is clipped, and nothing overlaps a caption |
| Holds | **Pass.** Every card meets max(1 s, words ÷ 3 + 1 s); the render also asserts this and fails otherwise. Table below |
| Captions | **Pass.** All 11 captions match the brief's script word for word (checked by string match against the brief). The SRT is generated from the same timeline the render uses (`scripts/reel-srt.mts`); regenerated after the final render, it is identical |
| Banned strings | **Pass.** `displaycraft, obrist, godaddy, virtua, 1,800, 1800`: no match (case-insensitive) in the reel's source, props, timing, shared Links list, SRT, this file, the storyboard notes or the registry |
| Beat 10 vs beat 2 | **Pass.** Beat 10 rewinds to beat 2's own frame (0/0, red dot) and replays the same tap on the same phone, at the same camera and clock. At the tap frame (beat 2 at 4.90 s vs beat 10 at 46.37 s), the phone area differs by a mean of 4 grey levels (the tap ring and caption fade); after the tap the two cuts split on purpose: homepage vs Jobs |
| Muted | **Pass.** No voiceover; every beat carries its script line as a caption plus a ≤ 6-word card, and every fact is on screen (0/0, the handover ticks, the client's question, three identical pages, the three redirect rows, the chips, 201, the Jobs page). No story point lives only in the sound. Checked on the midpoint frames and the frame strips of each transition |
| Motion | `scripts/qa/flash_check.py` and `stutter_check.py` findings each looked at frame by frame: sequential scene hand-offs (out, then in), the counter's digits, and the rewind's scan lines and shake, all intended. One real issue found and fixed before this render: going into the end card, the teal room and the light room crossfaded through the dark base for about 0.2 s (a dark dip, up to 24.7 grey levels a frame). The light room now fills in under the teal first, and the teal lifts off over 0.6 s (now at most 9.7 a frame, no dip) |
| QR | None in this reel |

## Holds

| On-screen text | Words | On screen (s) | Held | Rule | |
|---|---|---|---|---|---|
| Still getting clicked. | 3 | 0.60–4.73 | 4.13 s | 2.00 s | pass |
| Where are the jobs? | 4 | 5.23–9.07 | 3.83 s | 2.33 s | pass |
| EZMarketing · Agency · Lancaster, PA | 5 | 9.27–13.40 | 4.13 s | 2.67 s | pass |
| Handover: done. | 2 | 13.60–18.40 | 4.80 s | 1.67 s | pass |
| Can Careers still work? | 4 | 18.60–23.07 | 4.47 s | 2.33 s | pass |
| Every link → one page. | 5 | 23.27–28.07 | 4.80 s | 2.67 s | pass |
| 3 redirects. | 2 | 31.77–34.52 | 2.75 s | 1.67 s | pass |
| 10 minutes | 2 | 34.82–36.82 | 2.00 s | 1.67 s | pass |
| HTTPS ✓ | 2 | 36.82–38.82 | 2.00 s | 1.67 s | pass |
| No server | 2 | 38.82–40.82 | 2.00 s | 1.67 s | pass |
| 201 visits · Old Careers link · 20 days | 8 | 41.17–45.30 | 4.13 s | 3.67 s | pass |
| Right page. | 2 | 46.10–49.10 | 3.00 s | 1.67 s | pass |
| The old links still work. | 5 | 49.20–53.10 | 3.90 s | 2.67 s | pass |
| Old links. Fixed. Full story ↓ | 6 | 53.20–56.90 | 3.70 s | 3.00 s | pass |

Word counts include symbols (→, ·, ✓), which is stricter than the rule. Captions hold for their whole beat, at
words ÷ 3 + 1 s or longer.

## Beats

| Beat | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Start (s) | 0.40 | 4.73 | 9.07 | 13.40 | 18.40 | 23.07 | 28.07 | 34.52 | 40.97 | 45.30 | 49.10 | 53.10 |

## Mix

The Remotion render comes out at −16.3 LUFS (the beat is fitted to −16 LUFS, with the SFX on top). The export is
mastered from it with the video stream copied: `volume=+2.7 dB`, then `alimiter` (limit 0.80, 1 ms attack, 60 ms
release) at 192 kHz oversampling, back to 48 kHz, AAC 256 kb/s. The music bed dips 65 % under the rewind.
There is no voiceover, so the music sits a little higher, as the brief allows for the text-only cut. 21 SFX cues
(budget raised to 22 with a stated reason, per AGENTS.md).

## Audio credits

All files are logged in `docs/audio-licenses.md`. Mixkit terms were read on mixkit.co on 2026-10-16: sound effects
are free for commercial use, including YouTube and social video; music is allowed on social media and YouTube
(not CDs, DVDs, games or TV/radio). No attribution is required.

| In the reel | Source | Licence |
|---|---|---|
| Music bed | "Close Up", Mixkit #1167 (corporate/tech, ~104 BPM, instrumental), https://mixkit.co/free-stock-music/corporate-music/ | Mixkit Stock Music Free License |
| tap_soft | "Pop Click" by andressamd, https://pixabay.com/sound-effects/pop-click-576326/ | Pixabay Content License |
| error_thunk | "UI Error Denied Sound 4" by vadim_makes_sound, https://pixabay.com/sound-effects/ui-error-denied-sound-4-547863/ | Pixabay Content License |
| tick_soft | "Modern click box check", Mixkit #1120, https://mixkit.co/free-sound-effects/click/ | Mixkit Sound Effects Free License |
| notif_pop | "Dry pop up notification alert", Mixkit #2356, https://mixkit.co/free-sound-effects/pop/ | Mixkit Sound Effects Free License |
| problem_tone | "Wrong answer fail notification", Mixkit #946, https://mixkit.co/free-sound-effects/notification/ | Mixkit Sound Effects Free License |
| swipe_line | "Transition Coat" by trading_nation, https://pixabay.com/sound-effects/transition-coat-121423/ | Pixabay Content License |
| click_ui | "Computer Mouse Click" by Universfield, https://pixabay.com/sound-effects/computer-mouse-click-352734/ | Pixabay Content License |
| pop_glass | "Long pop", Mixkit #2358, https://mixkit.co/free-sound-effects/pop/ | Mixkit Sound Effects Free License |
| count_tick / count_roll | "Plastic bubble click", Mixkit #1124, https://mixkit.co/free-sound-effects/click/ | Mixkit Sound Effects Free License |
| rewind_tape | "Fast tape rewind cinematic transition", Mixkit #1092, https://mixkit.co/free-sound-effects/rewind/ | Mixkit Sound Effects Free License |
| fixed_chime | "Alert quick chime", Mixkit #766, https://mixkit.co/free-sound-effects/chime/ (the W43 signature chime) | Mixkit Sound Effects Free License |
