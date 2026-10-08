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

5. ⚙️ **DEFAULT (new, §7): the narrator pipeline runs on a paid ElevenLabs plan.** Free-tier output
   is not licensed for commercial use (see reels playbook) and the API refuses generations.
   §7 records voice_id, model, stability/similarity/style/speed and the pronunciation of
   "RedirHub". Proposed values (🧪 TESTING until Leo approves): see
   `02_videos/2026-W41_redirect-domain/production-notes.md` §3.

6. ⚙️ **DEFAULT (new, §4): landscape safe areas.** Nothing key below y = 950 of 1080 (bottom 12 %),
   side gutters 120 px, and the last 20 s keep the right half of the frame free of anything that
   must be read (YouTube end-screen elements). The end card component encodes this.

7. ⚙️ **DEFAULT (new, §4): transition grammar.** Allowed moves, each with a meaning: cut on the
   beat; shared-element morph (same thing, new understanding); dock (now context); draw (traffic
   moves); time-reverse (redo, once per video); register change (an aside); focus rack (two
   places, one job); silence (done). Anything not on the list is a proposal for the changelog, not
   a thing to try in a video.

8. 🧪 **TESTING (new): the script is the timeline's source.** `script.md` beats are generated into
   `script.ts`; `timeline.ts` estimates durations at 155 wpm until the VO exists, then reads the
   VO's word timestamps. Scenes reference beat numbers, never seconds. Keep for one more video,
   then LOCK if it holds.

9. ⚙️ **DEFAULT (confirm, §6): colors.** Night `#0B1426` canvas, Signal Red `#E5484D` broken,
   Teal `#20A795` fixed, Amber `#E59426` warning (once per scene), Blue `#1C6DB6` product, text
   white / `#B9C6D8` / `#6B7A90`, glass `rgba(255,255,255,.07)` with a `.14` line. Night and Signal
   Red remain **pending Kris's approval**; they are the tokens `yt.*` in `src/remotion/brand/tokens.ts`.

10. ⚙️ **DEFAULT (confirm, §4): fonts.** Plus Jakarta Sans (display, captions, UI copy in the film's
    own voice), JetBrains Mono (URLs, records, code). Inter stays **only inside recreated product
    UI**, because the real dashboard uses it; that is fidelity, not a secondary brand font. No
    other face was needed. Flag for Kris as the "secondary font" clause in §4.

11. ⚙️ **DEFAULT (new, §8): thumbnails come from the title card's typography and the two-tone
    "<Problem>. Fixed." treatment**, readable at 168 × 94. Template TH-A from v0.2 could not be read
    in this session; the first thumbnails are drafted after the gate so they can follow it.

## Open items for Kris (carried from the brief)

- Signal Red `#E5484D` and Night `#0B1426`: approve as channel tokens.
- Showing the Links → Create → Domain Redirect UI externally: Notion marks it Approved
  (2026-10-06); confirm that covers video.
- Secondary font: none proposed; Inter inside product UI only (see rule 10).
- Chrome line wording (see production-notes §5).
- Real anycast IP on screen (see production-notes §6).
