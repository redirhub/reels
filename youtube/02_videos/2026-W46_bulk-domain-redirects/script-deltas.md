# W46 script deltas · v6 (2026-11-13), v6.1 (2026-11-14)

The narration is `script.md` v6, word for word: no line was reworded. The order, the bridge (beat 15), the twist
(beats 9–12), the honest note (beat 14) and the facts are untouched. What follows is every place where the
recording or the screen says something in a different form than the script's text, and why. (The v3 → v4 deltas
about the Glomvo story are in git history: `git log -- script-deltas.md`.)

## v6.1 · Leo's review (2026-11-14)

Two lines changed in `script.md`, at Leo's request; each beat was regenerated alone (same voice, model, seed and
settings), so the rest of the recording is untouched.

| Beat | v6 | v6.1 | Why |
|---|---|---|---|
| 1 | "Imagine your company." | "Imagine you have a company." | Leo. |
| 32 | "So. One list. One import. Point the domains. And listen for the knock. That's how to move hundreds of domains at once." | "So. One list. One import. Point the domains. That's how to move hundreds of domains at once." | Leo: the summary drops the listen idea and the door picture ("over used"). The knock still pays off in Act F. |

On screen, the question in beat 34 keeps the voice's words ("And would the door open?"), but no door is drawn after
the knocks: the aside shows Northway's wordmark and the question plays over the viewer's own list. The end card keeps
"Every door. Open." and loses the QR slot.

## Spoken forms (what the narrator is sent; `voiceover/make_chunks.py` SAY)

| Beat | Script | Sent to the voice | Why |
|---|---|---|---|
| 17 | "A 301," | "A three-oh-one," | Said as a person says it. |
| 20 | "In RedirHub," | "In Redirect Hub," | Whisper hears the plain take as "Reader Hub" (Leo's 2:16 note). No confirmed pronunciation exists (open-questions.md P-1), so the respelled take is used and the plain take is kept. |
| 22 | "its https?" | "its H T T P S?" | Letter by letter, as before. |
| 22 | "each domain's www version" | "each domain's double-u double-u double-u version" | As before. |
| 27 | "without the h." | "without the H." | So the letter is said, not swallowed. |
| all | `[warm]`, `[thoughtful]` … | no tags | The narrator setting (Sarah, eleven_v4) carries no delivery tags: "[softly]" was performed as a whisper (2026-11-11). The tone comes from the words; one take per beat. |

## On-screen text (the frames; the map in Leo's brief §4)

| Frame | On screen | Note |
|---|---|---|
| Notebook | the idea "A scheduling app for clinics" (crossed out: "booking by phone?", then "reminders by text"); the plan "1. the domain" (circled), "2. one for each country", "3. a few misspellings", "4. and the old name, too" | The map kept the plan's other lines (logo, first customers, launch). They now write in on beat 2's own words, so the notebook says what the voice says. Revert by changing three strings in `w46_props.notebook` if Leo prefers the old lines. |
| Northway | "Over two hundred domains, and counting." | A line for beat 3 (the map named only the wordmark and tiles). |
| OneSite (new) | "One website, every product." | As the map. |
| Renewals | "Every domain renews." / "… and every other domain, every year" | As the map. |
| Accounts | "FORWARDING · Three registrar accounts. Set up years ago." | As the map. |
| Weight | "Which ones do people still type?" | As the map. |
| TwoResults | "Northway checked the plain address" / "The customer's browser asks for the padlock" | As the map. |
| Warning | the warning page alone | The founder's notebook (v4) is gone with the founder. |
| Silence | "Northway never finds out." | As the map. |
| Door | "Every domain needed two things." | As the map. |
| Honest | "A handful of domains, and the padlock shows? You're done." Checker: clinvane.com, 301, then 200 on northwaysoft.com/clinvane | As the map; the first hop shows 301 to match the film's file. |
| Once | "Two hundred domains. One file." | As the map. |
| List | "One row per domain." / "The domain" / "Where it should go" | "The name" became "The domain" to match the voice. |
| Columns | "A 301, because these moves are for good. A tag, for the group." / "301" / Product · Country · Typo | As the map; the headline is 48 px so both halves fit one line. |
| ByTag | "Filter by its tag. Change it once." · Tags: Product · 46 links selected · https://northwaysoft.com/products · Update 46 links | "its" follows beat 31 ("Filter by its tag"). 46 is an example count. |
| Knocks | "Customers, typing the name a little wrong." · "drop at renewal?" crossed out | As the map. |
| Price | "Now they land on the homepage." | As the map. |
| Quiet | "At renewal time, Northway knows where to look first." | As the map. |
| YourNames | "An aside: Northway isn't a real company." / "Your domains. Which one would a customer type tonight? And would the door open?" | As the map. |
| EndCard | "Every door. Open." / "Links are in the description." / "Dynamic QR · link pending" | The QR slot is back (the brief); it never draws a code. |
| List, Columns, Import, Fix, Review, PointDNS | — | "STEP 1/2/3" labels and the progress bars are removed everywhere. |
