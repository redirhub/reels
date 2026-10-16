# EZMarketing story: storyboard (checkpoint 1)

Text-only cut, 1080×1920, 30 fps. Composition `ezmarketing-story` (`src/remotion/reels/ezmarketing-story/`).
One still per beat, taken at each beat's settled state: `beat-NN_<seconds>.png`. `contact-sheet.png` shows the
safe band (pink: y 260–1500, x 80–1000).

## Timing (from `timing.json`, the only timing file)

Each script line is its beat's caption, held at reading pace: words ÷ 3 + 0.75 s. Picture events land when a
reader reaches the word that names them (e.g. the ticks on "forwarded" and "shut"). A VO cut swaps those word
times for the VO's timestamps; nothing else changes.

| Beat | Start | Length | On-screen text |
|---|---|---|---|
| 1 | 0.40 | 4.08 | Still getting clicked. |
| 2 | 4.48 | 4.08 | Where are the jobs? |
| 3 | 8.57 | 4.08 | EZMarketing · Agency · Lancaster, PA |
| 4 | 12.65 | 4.75 | Handover: done. |
| 5 | 17.40 | 4.42 | Can Careers still work? (in the client's bubble) |
| 6 | 21.82 | 4.75 | Every link → one page. |
| 7 | 26.57 | 4.75 | 3 redirects. |
| 8 | 31.32 | 5.78 | 10 minutes → HTTPS ✓ → No server |
| 9 | 37.10 | 4.08 | 201 visits · Old Careers link · 20 days |
| 10 | 41.18 | 3.42 | Right page. |
| 11 | 44.60 | 3.75 | The old links still work. |
| 12 | 48.35 | 3.00 | End card |

**Total 51.35 s** (target 44–52). Beat 8 is longer than its reading time because each chip must hold its own
minimum (1.67 s each). Every hold is checked at render time: a card that holds less than the rule fails the
render.

## Changes from the sync sheet (and why)

1. **Beat 6 sources:** `/careers`, `/contact` and the domain itself, not `/products`. `/products` isn't one
   of the approved demo paths (section 1 allows `/careers`, `/jobs`, `/contact` only). These three are
   also the three redirects in beat 7.
2. **Reading pace:** words ÷ 3 + 0.75 s per caption line. The card hold formula (+1 s) applied to whole
   script lines gives 53.9 s, over the 52 s cap. Captions are 8–12 words, so they aren't ≤ 6-word cards; the
   cards themselves still use words ÷ 3 + 1 s.
3. **Beat 5:** the on-screen text sits in the client's message bubble (labelled "Client") instead of in the
   text column. That avoids showing the same words twice on screen.
4. **Beat 7 rows:** they show what the real Links list shows: source, destination, a green status dot,
   "0 Clicks". The real list has no "301 · Live" label on rows (see the open questions).
5. **Labels added for legibility, with no new facts:** "HANDOVER" on the checklist card; "Welcome" and "Jobs"
   as the demo pages' headings; "DNS" on the line to RedirHub.

## Open questions

1. **"301 · Live" on the beat 7 rows.** The Links list in this repo is drawn from the real app's
   `LinksList.tsx`, `BaseListItem` and `RowStatusPill`, and its rows show the status dot and clicks, not a
   "301 · Live" pill. Keep it faithful as now, or send a dashboard screenshot that shows the label and I'll
   match it.
2. **`rule.md` locked rules.** Not readable from this session. I used the repo's mirror of them: the Night
   canvas, the yt tokens and the "Old links. / Fixed." two-tone end card in the channel's family. Paste the
   🔒 lines if any should be checked word for word.
