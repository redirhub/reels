# EZMarketing story: storyboard (checkpoint 1, round 2)

Text-only cut, 1080×1920, 30 fps, **51.35 s**. Composition `ezmarketing-story` (`src/remotion/reels/ezmarketing-story/`).
`contact-sheet.png` holds 18 stills: one per beat plus the "show" moments inside beats 2, 7, 8 and 10. Pink
lines mark the safe band (y 260–1500, x 80–1000). Script, facts and on-screen text are unchanged.

## Round 2 brief (owner, after round 1)

The round-1 cut was clean but had no spark, no RedirHub orange, little visual variation, and it told rather
than showed.

## Audit and changes, beat by beat

| Beat | Round 1 | Round 2 |
|---|---|---|
| 1 | A small pill alone in empty space | A larger pill, with taps streaming in from off-screen; it flies into the phone's address bar in beat 2 |
| 2 | Tell: a flat browser card reading "Welcome" | **Show:** a phone opens `mydomain.com/careers`; the camera pushes in as the address flips to `yourcompany.com`; the page scrolls; find-in-page types "jobs" and returns **0/0** with a red dot |
| 3 | A glass card, like every other beat | Kinetic type: the name wipes in behind a teal cursor over a faint map grid; an **orange** location pin |
| 4 | A glass card | A white handover ticket (a contrast change); globe and server icons; the server's lights go out on "shut" |
| 5 | A plain bubble | The client's bubble gets an **amber** "pending" dot; the ticket dims behind it |
| 6 | A diagram that tells | **Show:** three old links open side by side and all show the identical homepage. An **amber** bracket marks the catch: `= yourcompany.com`. The room takes an amber glow |
| 7 | The same dark room | The DNS line reaches the RedirHub mark (full colour, **orange** and teal) and the room turns **light**; the real Links list fills in |
| 8 | Text chips | **Show:** a stopwatch sweeps to 10 minutes, a padlock clicks shut, a server is struck out. Light room |
| 9 | A bare counter | **Show:** visits stream down the redirect from the old link to `/jobs` while the count rolls to 201 |
| 10 | A callback with no spark | **The twist:** the film rewinds (◀◀, scan lines, a shudder) to beat 2's exact frame (0/0, red), then replays the same tap. The camera pushes in on `yourcompany.com/jobs` and the room floods **teal** |
| 11 | The same room | Pull back about 3% in the teal room |
| 12 | Dark end card, no orange | A **light** end card with the full-colour logo (its orange and teal, the only legal way to show the logo in colour) |

**Rooms:** Night (problem), amber-lit Night (the catch), light (the product), teal (the fix), light (the end).
Captions get a dark backing on the light and teal rooms, so white text stays readable.

**Orange:** at most once per scene, as the rule allows for amber: the pin (3), the client's dot (5), the catch
bracket (6), the RedirHub mark (7) and the end-card logo (12).

## Timing (from `timing.json`, the only timing file)

Captions hold at reading pace (words ÷ 3 + 0.75 s); picture events land on the words that name them.
Beat 10 spends its first 0.8 s rewinding. "Right page." holds 2.6 s after the rewind, above its 1.67 s
minimum. Every hold is checked at render time.

| Beat | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Start (s) | 0.40 | 4.48 | 8.57 | 12.65 | 17.40 | 21.82 | 26.57 | 31.32 | 37.10 | 41.18 | 44.60 | 48.35 |

## Changes from the sync sheet (and why)

1. **Beat 6** shows the domain, `/careers` and `/contact`, not `/products`, because only the approved demo
   paths may appear. It is now shown (three pages) instead of drawn (a fan of lines).
2. **Beats 2 and 10** use a phone instead of a browser card. Beat 10 still reuses beat 2's exact
   composition: it rewinds to that very frame.
3. **Beat 10 adds a rewind** before the replay. This needs a rewind sound. The sync sheet says the only
   whoosh in the film goes into the UI (beat 7), so I'll pick a tape-rewind sound, not a second whoosh, unless
   you'd rather it be silent.
4. **Reading pace** is words ÷ 3 + 0.75 s. The +1 s card formula on whole lines would give 53.9 s, over the
   52 s cap.
5. **Small labels with no new facts:** "HANDOVER", "Client", "DNS", "Welcome", "Jobs", "Your Company" and
   the "Home · About · Contact" nav on the demo site, and "Apply" on the demo job rows.

## Open questions

1. **"301 · Live" on the beat 7 rows.** The real Links list (`LinksList.tsx`, `BaseListItem`,
   `RowStatusPill`) shows a green status dot and clicks, not a "301 · Live" label. Keep it faithful, or send a
   screenshot that shows the label.
2. **`rule.md` locked rules.** Not readable from this session; I used the repo's mirror. Paste the 🔒 lines to
   check word for word.
