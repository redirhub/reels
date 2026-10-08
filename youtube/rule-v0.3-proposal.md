# rule.md v0.3 — proposal from the first video (2026-10-06)

Status: proposal only. Nothing here changes a 🔒 LOCKED rule silently; LOCKED changes are listed
as proposals for Kris. Section numbers follow the brief's references to rule.md v0.2 (§4
disciplines, §6 colors, §7 voice, §8 thumbnails); where I could not read v0.2 itself, the entry
says what it adds rather than what it replaces.

## Changelog entries (what W41 taught us)

- **Facts move faster than briefs.** Between the brief and the build, Connect DNS (automatic
  Domain Connect) went LIVE and Approved, and the Links create flow was approved for external
  use. The script was written against Notion, not the brief. → Rule proposal 1.
- **The hold rule needs a machine.** Two on-screen lines violated (words ÷ 3) + 1 during the
  style-frame pass. Enforcing it in the component caught both before anyone watched a frame.
  → Rule proposal 2.
- **Third-party claims need a date.** "Chrome 154 warns…" was true as a plan and unverifiable as a
  fact on the day. The script hedges ("rolling out"). → Rule proposal 3.
- **Real infrastructure values on screen need a disclaimer in the VO.** The A record IP is real;
  the viewer must not copy it from the video. "Copy yours, not mine." → Rule proposal 4.
- **The voice vendor plan is part of the pipeline.** ElevenLabs Free tier refused generation and
  isn't licensed for commercial use. → Rule proposal 5.
- **Landscape safe areas differ from reels.** Bottom 12 % and the end-screen zones; the end card
  keeps its right half clear. → Rule proposal 6.
- **Transitions need a vocabulary, not a ban list.** Eight named moves with meanings
  (storyboard §Transition grammar). → Rule proposal 7.
- **The script is data.** `script.md` → beats → timeline → scenes; retiming to the VO changes one
  file. → Rule proposal 8.

## Rule proposals

1. 🔒 **LOCKED (process, new): facts are re-read from Notion at script lock and at render.**
   Product facts come only from Product Facts — Core rows that are LIVE with external use Approved,
   *checked on the day the script is locked and again before the final render*. A brief is a
   starting point, never a source. Record the row names and check dates in the storyboard's
   accuracy table.

2. ⚙️ **DEFAULT → tooling: the text-hold rule is enforced in code.** Every on-screen line is
   rendered through `<OnScreenText>` (or a component built on it), which throws when a line holds
   less than max(1 s, words ÷ 3 + 1 s). A render that passes is the audit. Manual measurement in
   the contact sheet remains as the second check.

3. ⚙️ **DEFAULT (new): claims about other companies' products carry a date and a hedge.**
   Browser, registrar and platform behaviour is stated as of a date in the storyboard's accuracy
   table, and the VO uses "is rolling out", "some do, some don't", "as of <month>" unless the
   vendor's own release notes confirm the behaviour on publish day. Never "X can't".

4. ⚙️ **DEFAULT (new): real values on screen come with "copy yours, not mine".** When the
   product UI shows a real IP, hostname, token format or key, the VO (or a caption) tells the
   viewer to copy the value from their own dashboard, and the storyboard notes the value's source.

5. ⚙️ **DEFAULT (new, §7): the narrator pipeline.** Voice **Emily** `zHGX9VSXpW8cGSDRCqy0`,
   `eleven_multilingual_v2`, the voice's default settings (the MCP tool exposes none; Emily reads
   at ~159 wpm on real sentences, inside the 150–160 target). The script is sent in chunks of
   1–6 beats (≤ 30 s) so a re-take is one file; a chunk that succeeded is never re-generated.
   Word timestamps: Scribe when the plan allows, otherwise Vosk (local) aligned to the script
   (`scripts/yt/vo-build.py`). The build masters the voice to -14 LUFS / -1.5 dBTP with a static
   gain and a limiter, never loudnorm's dynamic mode. **Licensing:** free-tier output is not
   licensed for commercial use; W41's narration must be regenerated on a paid plan before
   publishing (same chunks, same voice; the pipeline re-times the film). Pronunciation of
   "RedirHub": Emily says "re-DIR-hub"; 🧪 TESTING until Leo confirms.

6. ⚙️ **DEFAULT (new, §4): landscape safe areas.** Nothing key below y = 950 of 1080 (bottom 12 %),
   side gutters 120 px, and the end card (≥ 6 s, where packaging places the end screen) keeps the
   right half of the frame free of anything that must be read. The end card component encodes
   this. (W41's review measured the "last 20 s" wording against the film and the tip cards broke
   it at 5:03–5:13; the rule is scoped to the end card, which is where the end screen goes.)

7. ⚙️ **DEFAULT (new, §4): transition grammar.** Allowed moves, each with a meaning: cut on the
   beat; shared-element morph (same thing, new understanding); dock (now context); draw (traffic
   moves); time-reverse (redo, once per video); register change (an aside); focus rack (two
   places, one job); silence (done). Anything not on the list is a proposal for the changelog, not
   a thing to try in a video.

8. 🧪 **TESTING (new): the script is the timeline's source.** `script.md` beats are generated into
   `script.ts`; `timeline.ts` estimates durations at 155 wpm until the VO exists, then reads the
   VO's word timestamps (`voiceover/timings.json`). Scenes reference beat numbers, never seconds,
   and a visual that must land on a word uses `local(scene).word(n, 'word')`. Held for W41 end to
   end (five hold-rule catches, zero manual re-timing). Keep for one more video, then LOCK.

9. ⚙️ **DEFAULT (confirm, §6): colors.** Night `#0B1426` canvas, Signal Red `#E5484D` broken,
   Teal `#20A795` fixed, Amber `#E59426` warning (once per scene), Blue `#1C6DB6` product, text
   white / `#B9C6D8` / `#6B7A90`, glass `rgba(255,255,255,.07)` with a `.14` line. **Paper** (printed
   props only: the note, the address book, the menu, the ID card): cream `#FBF7EF` / `#F4EFE6`,
   note yellow `#FFF4D6`, ink `#3B3A36` / `#6B675F` / `#8A8478`, cover `#1E2A44`; a prop's status
   colours are the channel's teal and Signal Red, never a UI green. Night and Signal
   Red remain **pending Kris's approval**; they are the tokens `yt.*` in `src/remotion/brand/tokens.ts`.

10. ⚙️ **DEFAULT (confirm, §4): fonts.** Plus Jakarta Sans (display, captions, UI copy in the film's
    own voice), JetBrains Mono (URLs, records, code). Inter stays **only inside recreated product
    UI**, because the real dashboard uses it; that is fidelity, not a secondary brand font. No
    other face was needed. Flag for Kris as the "secondary font" clause in §4.

11. ⚙️ **DEFAULT (new, §8): thumbnails come from the title card's typography and the two-tone
    "<Problem>. Fixed." treatment**, readable at 168 × 94. Template TH-A from v0.2 could not be read
    in this session; the first thumbnails are drafted after the gate so they can follow it.

12. ⚙️ **DEFAULT (new, §7): sound.** Voice on top; under it a quiet generated pad (`music.json`
    `"kind": "pad"`, about 16 LU below the voice), never a drum beat on a voice-led film. Effects
    only on story beats (problem, fix, result), none on UI micro-actions; the signature **fixed**
    chime plays only when something broken is now right, and the end card. Everything generated
    in-repo unless a licensed file with its certificate is logged in `01_library/audio/`.
    Mix target -14 LUFS integrated, -1 dBTP, measured on the rendered file.

13. ⚙️ **DEFAULT (new, §8): captions ship with the film.** `captions.srt` from the word timestamps
    (`scripts/yt/srt-from-timings.py`): ≤ 42 characters per line, ≤ 2 lines, cues split at
    sentence ends, ≥ 1 s each. Uploaded as English, not left to auto-captions.

## Open items for Kris (carried from the brief)

- **Voiceover licence:** the ElevenLabs workspace behaves like the Free tier (10,000-credit quota,
  intermittent "Free Tier access has been disabled" refusals). Confirm the plan or upgrade, then
  regenerate the 16 chunks before publishing (production-notes §3).

- Signal Red `#E5484D` and Night `#0B1426`: approve as channel tokens.
- Showing the Links → Create → Domain Redirect UI externally: Notion marks it Approved
  (2026-10-06); confirm that covers video.
- Secondary font: none proposed; Inter inside product UI only (see rule 10).
- Chrome line wording (see production-notes §5).
- Real anycast IP on screen (see production-notes §6).
