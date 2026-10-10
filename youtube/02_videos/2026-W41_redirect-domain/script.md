# Script v3 — How to Redirect a Domain to Another Domain (With HTTPS That Actually Works)

**Status:** v3, for Leo's checkpoint. Supersedes v2 (Leo's draft, 2026-W41). v2 lives on Kris's
machine (`Youtube Content Engine\02_videos\2026-W41_redirect-domain\script.md`); this session could
not reach that folder, so `script-v2.md` here is a pointer, not a copy.
**Format:** 16:9, 3–6 min target. Voiceover only (one female narrator, ~150–160 wpm). Motion graphics.
**Length:** ~800 spoken words → about 5:10 at 155 wpm, plus roughly 30 s of visual-only beats
(title, rewind, end card) → **≈ 5:40 finished**. Inside 3–6 min; trims marked ✂ bring it to ~5:00.
**Demo domains:** `mydomain.com` (old) → `mybrand.com` (new), per the brand convention.

How to read: each numbered line is one VO beat and one screen (one idea per screen). Text in
`[brackets]` is the visual, written so a reader can see the film without the storyboard. The
storyboard (`storyboard.md`) has transitions, timing and components for each beat.

Leo's §3 notes are applied and marked ★ where a line is mandated or a cut was requested.

---

## ACT A — The hook (0:00–0:50)

**1.** When people decide to move to a new domain, most of them do the same thing. ★
`[A browser tab at a generic registrar ("Your registrar · where you bought the domain"). "mybrand.com" is typed into the search; "Available".]`

**2.** They buy the new one, switch on "forwarding" at the registrar, type the old address, and land on the new site.
`[Buy → "✓ Yours". The tab switches to mydomain.com's settings: Forwarding toggles on, "Forward to https://mybrand.com". A new address: mydomain.com is typed… and it lands on mybrand.com.]`

**3.** And honestly? Fair enough. It looks done. ★
`[Everything settles on the landed tab. "Fair enough. It looks done." A beat of stillness.]`

**4.** But here's what a half-done move does, a few weeks later.
`[The teal cools. The card slides away; the old pill stays.]`

**5.** Some old links open with a warning: "Not secure."
`[Browser card: mydomain.com, red dot, the browser's "Not secure" interstitial.]`

**6.** Others dump people on the homepage, not the page they wanted.
`[Pill: mydomain.com/pricing → line → card shows the mybrand.com homepage. The /pricing falls off the line.]`

**7.** Some pages are just… gone.
`[Card: "This page doesn't exist." Red dot.]`

**8.** Google can't follow the move, so your rankings slip.
`[A search-result card for the old page fades; its position arrow ticks down.]`

**9.** And the QR code you printed? The link in that email from last year? Dead.
`[A printed card with a QR; the scan line goes nowhere. An email card with a dead link.]`

**10.** So how do you move your domain the right way, and keep it secure? It's simpler than you think. ★
`[Problems sweep off. Title card: "How to redirect a domain to another domain." Second line, smaller: "With HTTPS that actually works."]`

> ✂ If we need 20 s: merge 7 into 6 ("…or on a page that's just gone.").

---

## ACT B — Three concepts (0:50–2:30)

**11.** First, you need to understand three concepts. Then we do it together.
`[Three numbered cards: 01 The 301 · 02 DNS · 03 HTTPS. Plain type, no icons.]`

**12.** Concept one: the 301 redirect.
`[Card 01 comes forward. The old address pill, alone.]`

**13.** It's a note that says "moved permanently," plus the new address.
`[The 301 ticket drops onto the old pill: "301 · Moved permanently · New address: mybrand.com".]`

**14.** Browsers follow it instantly, and Google updates its records.
`[A line draws from the old pill through the ticket to the new pill. Two chips tick: "Browsers · follow it instantly", "Google · updates its records".]`

**15.** Concept two: DNS is the internet's address book.
`[A closed address book. It opens.]`

**16.** Type a domain, and your browser looks it up in that book to find a number: the server to talk to. Those entries are called records.
`[Address book page: "mydomain.com" and, next to it, a row of digits. The word "record" labels the row.]`

**17.** Moving the right way means changing a couple of those records, so the old domain points at something that hands out the note.
`[The number on the row is replaced; the row now leads to a small "note dispenser" (the redirect server) that hands out 301 cards.]`

**18.** Concept three: the padlock is an ID card.
`[The padlock from a browser bar morphs into an ID card.]`

**19.** Over HTTPS, a site shows an ID card first. It's called a certificate. It proves the site is who it says it is, and it keeps the connection private.
`[Browser bar ↔ ID card handshake. Padlock closes. Mono: https://]`

**20.** No certificate, no padlock. A warning instead of your page.
`[The ID card is missing; the bar turns to "Not secure," red dot.]`

**21.** Here's the catch. Your old domain needs its own ID card, even if all it does is point somewhere else. The browser checks the ID before it reads the note.
`[Sequence, left to right: browser → ID check → only then the note → new site.]`

**22.** And browsers are getting stricter: Chrome is rolling out a warning before it opens public sites that aren't secure. ★ *(verified wording, see storyboard §Accuracy)*
`[A Chrome-style warning card, muted: "The connection to this site is not secure."]`

**23.** To be fair to registrars: some forwarding handles the ID card for you. Some doesn't, and the certificate is on you. So, some do, some don't. Here's how to check: type your old address with https in front. Padlock? You're fine. Warning? Keep watching. ★
`[Two pills side by side: https://mydomain.com with a teal padlock, https://mydomain.com with a red "Not secure."]`

**24.** That's it: three concepts. The note, the address book, the ID card. Now let's use them.
`[The three numbered cards from beat 11 return, each ticked. Then they clear for the dashboard.]`

> ✂ If we need 15 s: cut the second sentence of 19 to "It's called a certificate, and it proves the site is who it says it is."

---

## ACT C — The walkthrough, in RedirHub (2:30–4:20)

**25.** Here's how to do it the right way, from the RedirHub dashboard. ★
`[Navy clears to the dashboard. A browser card with dash.redirhub.com.]`

**26.** It handles the note and the ID card for you, and it works with your DNS, wherever it lives.
`[Links page: a few existing rows with teal dots.]`

**27.** Old domain: mydomain.com. New site: mybrand.com.
`[The two pills from the opening dock into the top of the frame and stay for the whole act.]`

**28.** Step one: write the note. Links → Create → Domain Redirect.
`[Cursor: Create. The chooser: Branded Link, Dynamic QR Code, Domain Redirect, Website Migration. Click Domain Redirect.]`

**29.** Redirect from: mydomain.com. Redirect to: https://mybrand.com. Type: 301. And keep the path on, so every old page lands on its matching new page.
`[Form fills field by field. The 301 chip. The "Keep path" toggle turns teal. Beside it, a tiny callback: /pricing → /pricing.]`

**30.** Save. One down.
`[Toast: "Changes saved". The rail: note ✓.]`

**31.** Step two: the address book. RedirHub shows you exactly which records to change.
`[Hostnames: mydomain.com with a "Connect DNS" button. Click. The Connect DNS window opens on the Manual tab.]`

**32.** For a root domain, that's two: an A record, the number to point at, and a TXT record, which proves the domain is yours. Plus a CNAME for the www version.
`[Three record rows: A @ · TXT @ · CNAME www, each with a copy button. The values are the ones the dashboard shows for this domain.]`

**33.** Quick tip. Before you touch anything in your DNS, screenshot it. Thirty seconds now, zero regret later. ★
`[Tip card slides in from the right: a camera icon, "Screenshot your DNS first."]`

**34.** Now open your DNS, wherever your domain lives, and add those records. Copy and paste. And copy yours, not mine.
`[Split: RedirHub on the left, a neutral "Your DNS provider" panel on the right. Values fly across one by one.]`

**35.** Back in RedirHub, it checks every few seconds. The address book updates… and the ID card is issued automatically. Two green checks: DNS. HTTPS.
`[Verifying card: "Checking DNS" spinner → ✓. "Issuing HTTPS certificate" → ✓. The rail: address book ✓, ID card ✓.]`

**36.** That's the whole setup. Concept three took care of itself.
`[The three-slot rail, all filled. A quiet beat.]`

> Note: the Cloudflare automatic option (LIVE, approved 2026-10-05) is left out of the VO for length and goes in the description; see storyboard.

---

## ACT D — The test, the twist, the checks (4:20–5:50)

**37.** Let's test it. Open a browser, type mydomain.com…
`[Browser card, address bar typing: mydomain.com]`

**38.** …and it's still the old site.
`[The old site loads. The dot stays grey. A beat.]`

**39.** Hold on. Your redirect might be fine. It's your test that's wrong. ★
`[Time runs backwards: the page unloads, the typing un-types, back to the empty bar.]`

**40.** Browsers keep copies of pages they've seen, so you may be looking at yesterday's site. First rule of testing a move: a private window. No copies, no leftovers. ★
`[A new, darker browser card slides over: private window. Tip badge: "Test in a private window."]`

**41.** Same address, private window… and there it is. mybrand.com. Padlock.
`[Address bar types mydomain.com; it resolves to https://mybrand.com. Teal dot. Padlock closes.]`

**42.** *(no VO)*
`[Caption under the card, 4 s: "Still the old site? Give DNS a few minutes."]`

**43.** Three quick checks.
`[Three empty checklist badges.]`

**44.** One: the old domain, with https in front, lands on the new site with a padlock.
`[Pill https://mydomain.com → line → card https://mybrand.com, padlock. Badge 1 fills teal.]`

**45.** Two: an old deep link lands on the same page, not the homepage.
`[Pill mydomain.com/pricing → line → card mybrand.com/pricing. Badge 2 fills.]`

**46.** Three: the www version works too.
`[Pill www.mydomain.com → line → card mybrand.com. Badge 3 fills.]`

**47.** All three green.
`[The one allowed combined screen: three badges, one teal line under them.]`

**48.** Two things before you go.
`[Badges slide up; two tip slots.]`

**49.** A padlock means the connection is private, not that the site is honest. It's an ID card, not a character reference. ★
`[The ID card from Act B, with the padlock on it. A small "Private ≠ honest" caption.]`

**50.** And don't let the old domain expire. If it lapses, someone else can register it, and every old link and printed QR code points at them. Keep renewing it as long as anyone might still have the old address. ★
`[The old pill with a renewal date; a calendar page flips; the pill stays teal.]`

**51.** Remember the start? Forwarding on, old link opens, looks done.
`[Callback: the exact frame from beat 3, small, in the corner.]`

**52.** Now it is.
`[The small frame expands; the redirect line redraws; every dot on screen turns teal.]`

**53.** Everything you need to manage your URLs is linked in the description. And if you get stuck, reach out to us. We're happy to help.
`[The end card builds: "Old domain. Fixed." Under it: "Links in the description · Questions? Reach out." Logo, branded QR.]`

**54.** *(no VO)*
`[End card: "Old domain." white. "Fixed." teal. RedirHub logo, white variant. Branded QR with its link underneath. Silence except the "fixed" chime.]`

---

## Notes to self (read-aloud pass)

- Every beat joins the next with *but* or *therefore*. Checked: 3→4 (but), 10→11 (therefore),
  20→21 (but, "here's the catch"), 36→37 (therefore), 38→39 (but), 47→48 (therefore).
- Loops opened and closed: "It looks done" (3) → "Now it is" (52). "Three concepts, then we do it"
  (11) → rail complete (36). "Keep watching" (23) → the three checks (44–47). The twist (38) →
  (41).
- Terms taught before use: 301 (14, used 29), DNS/records (15–17, used 31–32), HTTPS/certificate
  (19, used 35), A/TXT/CNAME introduced where they appear (32). "Padlock" is used before beat 18
  only as the familiar browser icon, never as a term.
- Removed per Leo: "Let's do it together", "And look, it's not your fault", "Let's set it up",
  "Something quietly starts going wrong". Nothing assumes the viewer's situation or feelings.
- No pricing, no plan names, no free-plan claims, no "Start free".
- Fair to others: no registrar is named as unable; GoDaddy and Namecheap are not named at all.
