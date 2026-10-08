# Packaging — W41 "How to Redirect a Domain to Another Domain (With HTTPS That Actually Works)"

Film: 5:17 (317 s), 1920×1080, 30 fps, H.264 + AAC 48 kHz. Captions: `captions.srt` (from the
word timestamps, regenerated with every voice change). Thumbnails: `thumbnails/thumb-a.png`, `thumbnails/thumb-b.png`
(1280×720) with 168×94 proofs beside them.

## Title

**Primary (A):** How to Redirect a Domain to Another Domain (With HTTPS That Actually Works)

**B test:** Moving to a New Domain? Do the Redirect Right (301 + HTTPS, Step by Step)

Both under 70 characters before the parenthesis, keyword first ("redirect a domain"), the promise
second. A names the pain (HTTPS that "actually works"); B names the moment (moving) and the method.
Pair A with thumbnail A (outcome) and B with thumbnail B (problem → fix) so each test changes one idea.

## Thumbnails

| | Headline | Object | Why |
|---|---|---|---|
| A | "Old domain. **Fixed.**" (white + teal) | one URL pill, padlock, `https://mybrand.com` | The end card's line; outcome-led. Reads at 168×94. |
| B | "**Not secure?** Fixed." (Signal Red + white) | red `mydomain.com` pill → teal padlock `mybrand.com` | Problem-led, the warning every viewer has seen. Reads at 168×94. |

Plus Jakarta Sans 800, JetBrains Mono for the pills, Night background, the official icon top-right,
one amber (inside the icon only). No faces, no arrows bigger than the text, no "NEW".

## Description

```
Moving your site to a new domain? Registrar "forwarding" looks done, but a few weeks later old
links open with "Not secure", deep links dump people on the homepage, and the QR code on your
menu is dead. This is the right way: a 301 redirect, the DNS records that make it work, and the
certificate that keeps the padlock, with the test most people get wrong.

Manage your URLs with RedirHub: https://redirhub.com/qr?utm_source=youtube&utm_medium=video&utm_campaign=w41-redirect-domain
(↑ placeholder: replace with the branded link once it exists in Links; keep the UTM tags.)

Stuck, or moving something bigger than one domain? Reach out and we'll help:
[contact link placeholder: Leo/Kris to confirm the support page or email]

Chapters
0:00 The move most people make
0:16 Why it breaks
0:35 The promise
0:48 Concept 1: the 301 redirect
1:01 Concept 2: DNS, the address book
1:20 Concept 3: HTTPS, the ID card
2:20 In the RedirHub dashboard
2:35 Step 1: write the note
2:55 Step 2: update the address book
3:46 The test (and the twist)
4:18 Three checks
4:35 Two things before you go
4:58 Remember the start

What you'll learn
• What a 301 redirect is and why "moved permanently" matters for Google
• Which DNS records to change (A, TXT, CNAME) and where they live
• Why the padlock comes from a certificate, and who issues it
• How to test a redirect without your browser lying to you (private window)
• Why you should never let the old domain expire

Domains in the video are examples (mydomain.com → mybrand.com). Copy the records your own
dashboard shows, not the ones on screen.

RedirHub: https://redirhub.com
```

The first two lines are what shows before "more"; they carry the keyword and the promise.
The UTM link is a placeholder until the branded link exists (open item: Links UI external use).

## Tags (optional)

domain redirect, 301 redirect, redirect domain to another domain, HTTPS redirect, DNS records,
CNAME, A record, website migration, change domain name, RedirHub

## Pinned comment

```
The three checks from the end, so you can copy them:
1. https:// + old domain → lands on the new site, with a padlock
2. An old deep link (old domain + a path) → the same page on the new site, not the homepage
3. The www version → works too

Testing and still seeing the old site? Open a private window first: your browser keeps copies.
Questions about your setup? Ask below and we'll answer.
```

## Captions

`captions.srt` is generated from the voiceover's word timestamps
(`scripts/yt/srt-from-timings.py`): one or two lines per cue, ≤ 42 characters per line, cues
split at sentence ends, each on screen ≥ 1 s. Upload as English (not auto-generated); YouTube's
auto captions will mis-hear "RedirHub".

## Publish checklist

- [ ] The video now ends by pointing to the description ("Everything you need to manage your URLs is
      linked in the description. And if you get stuck, reach out to us."): the description must
      carry both links before publishing (the manage-URLs link and the contact link).
- [ ] Branded link created in Links; replace the placeholder URL in the description and the QR
      target if it changes (`props.ts` → `qr`); re-render if the QR changes.
- [ ] Voiceover regenerated on a paid ElevenLabs plan (see production-notes §3) before publishing.
- [ ] Kris: Signal Red / Night tokens, the Chrome line ("rolling out"), the Links UI external use.
- [ ] Upload: title A, thumbnail A, description, chapters verified in the player, captions.srt,
      pinned comment, end screen (subscribe + the next video) at 5:19, on the end card.
- [ ] A/B: YouTube's "Test & compare" with thumbnails A and B (title stays A for the test).
