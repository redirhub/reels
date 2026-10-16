# Script v2 — How to Forward Multiple Domains to One Website (With HTTPS)

**Status:** v3, 2026-10-15 (Leo's review of the first cut: beat 19 opens the steps with what they do). v2, 2026-10-14. Script v1 (Leo's draft, 52 beats, in the W43 brief) with every change from
`script-deltas.md` applied after the key frames were approved on the canvas (Review 2). This file is the
source of truth for the build: `scripts/yt/beats-from-script.py` turns it into
`src/remotion/reels/forward-domains/script.ts`.
**Format:** 16:9, voice-led (one female narrator, Emily), about 4:45 finished.
**Demo domains:** `mybrand.com` (main), `mybrand.net`, `mybrand.co`, `mybrnad.com` (the typo), `getmybrand.com` (the flyer).

How to read: each numbered line is one VO beat; the line in `[brackets]` is the picture (frame names
from `keyframes.md`). Beat numbers are v2's own; `script-deltas.md` uses v1's.

---

## ACT A — Many names, one problem

**1.** Most brands own more than one domain.
`[w43-Domains. The headline lands on the left; the right side is empty.]`

**2.** The .com. The .net. The .co.
`[Three glass pills cascade in on their words: mybrand.com, mybrand.net, mybrand.co.]`

**3.** The misspelling you bought, so nobody else could.
`[mybrnad.com arrives; "rna" takes the red wavy underline; "the typo you bought".]`

**4.** The short one you put on flyers.
`[The paper flyer drops in with getmybrand.com; "the short one on flyers".]`

**5.** Every one of them is a way in. Someone types it, clicks it, or scans it.
`["Every one is a way in." under the headline.]`

**6.** But a lot of extra domains lead nowhere. A parking page. An error. A "Not secure" warning.
`[w43-DeadEnds. Three browser windows on a carousel: parked, can't be reached, then Not secure racks to the centre.]`

**7.** Each of those is a visitor who almost reached you.
`["A visitor who almost reached you." under the stage, "almost" in red.]`

**8.** Here's how to forward every domain you own to one website, with HTTPS on every one. Three steps, and one test at the end.
`[w43-Title. Transition 1 of 2. Five dots draw into one; the title; "With HTTPS on every one." in a glass pill on the floor.]`

## ACT B — How it works, the shortcut, and the twist

**9.** First, what a domain actually does. It doesn't hold your website. It points to where your website lives.
`[w43-Pointer. Room change to light. The headline; the mybrand.com pill.]`

**10.** That pointer lives in DNS, the internet's address book.
`[The dotted line draws to the paper address book (DNS), then to the site.]`

**11.** Pointing five domains at one website sounds easy. There are two ways to do it.
`[The address book and site slide away; the pill holds.]`

**12.** Way one: point every domain at your hosting, so each one shows your site.
`[w43-Perfect. Five sites pop up in a 3 + 2 grid, one per domain.]`

**13.** And it looks perfect.
`[Each site takes a teal tick. "It looks perfect." Hold.]`

**14.** But to Google, that's one website at five addresses. Five copies.
`[w43-Copies. The room drops to dark red; the same cards drain to grey and get stamped COPY.]`

**15.** And when Google finds copies, it picks one address to show. Maybe not the one you'd pick.
`[The magnifier settles on mybrand.net; "Google shows mybrand.net · Example".]`

**16.** And the address bar shows whatever they typed. Even the typo.
`[w43-AddressBar. Push into the typo's address bar; mybrnad.com fills the frame. "Same site. A different name every time." One second of silence.]`

**17.** Way two: one main address. Every other domain sends people there with a 301, the permanent kind.
`[Time-reverse (the film's only one), then w43-OneAddress: four pills fan into one node and a teal line to https://mybrand.com.]`

**18.** It tells browsers and Google: this moved, go here.
`[A 301 tag pops onto each line.]`

**19.** Here's how to set that up in RedirHub, with HTTPS: three steps, and one test.
`[w43-Steps. "Here's how" eyebrow and the goal line "Set up way two in RedirHub, with HTTPS."; three frosted cards rise on "three"; "Then one test: every version of every domain."]`

## ACT C — The three steps, in RedirHub

**20.** Step one: pick your main address.
`[w43-MainAddress. Card 01 becomes the main-address card; the other four dim to chips.]`

**21.** Choose it exactly the way you want people to see it. Say, https://mybrand.com.
`["https" and "no www" land on "exactly".]`

**22.** Quick tip: if one of your domains already ranks, or has links from other sites, that's usually the one to keep.
`[The tip card slides in beside: "Keep the one that already ranks, or has links."]`

**23.** Step two: redirect every other domain. Here's what that looks like in RedirHub.
`[Transition 2 of 2, into the dashboard (Links list, empty).]`

**24.** Links. Create. Domain Redirect.
`[Create opens the chooser; Domain Redirect opens the New domain redirect form.]`

**25.** Redirect from: mybrand.net. Redirect to: https://mybrand.com. Type: 301.
`[w43-DomainRedirect. The fields fill on her words; 301 · Permanent is selected.]`

**26.** Keep the path on, so mybrand.net/pricing lands on mybrand.com/pricing, not the homepage.
`[Keep the path is selected; What happens fills with the example hops.]`

**27.** The www version comes along too: a root domain covers its www.
`[The form's hint "A root domain also covers www." takes a teal ring.]`

**28.** Save. Then the same for the next one: mybrand.co, the typo, and getmybrand.com from the flyers.
`[w43-LinksList. The rows arrive one by one, each ↳ https://mybrand.com.]`

**29.** Each domain gets its own redirect. All of them point to the same place.
`[The four rows hold.]`

**30.** Got dozens? Import them all from one CSV: Links, Create, Import CSV. That gets its own video soon.
`[The tip card slides in: "Import them all from one CSV."]`

**31.** Step three: connect each domain, with HTTPS.
`[w43-ConnectDNS. Hostnames, the four domains "Not connected"; progress bar 3 of 3.]`

**32.** For a redirect to work, the domain has to point at RedirHub in its DNS.
`[Hostnames holds.]`

**33.** Open Hostnames, and click Connect DNS. RedirHub shows you the exact records for that domain.
`[The Connect DNS dialog opens over the dimmed shell, Automatic tab.]`

**34.** For a root domain, that's an A record that says where to go, and a TXT record that proves the domain is yours. Plus a CNAME for the www.
`[The A, TXT and CNAME rows highlight on their words.]`

**35.** Copy the values from your own dashboard, not from this video.
`[The values glow; a note: copy yours.]`

**36.** If your DNS is at Cloudflare, the Automatic tab adds them for you. You approve on Cloudflare and come straight back.
`[The Automatic tab and Continue with Cloudflare are in focus.]`

**37.** Quick tip: if a domain handles email, leave its MX records alone. They're your email.
`[The MX tip slides in beside the dialog.]`

**38.** Once the records are in, RedirHub checks them and issues the HTTPS certificate automatically. That's the padlock, on every domain.
`[w43-HttpsIssued. The three steps tick; the room floods with the brand sweep; the padlock grows.]`

## ACT D — Prove it, then close

**39.** Now test it. And here's the part most people skip.
`[w43-FourAddresses. The lab room, empty grid.]`

**40.** Every domain is really four addresses. With and without www. With and without https.
`[One domain splits into four.]`

**41.** Four extra domains? That's sixteen ways in.
`[The grid fills row by row; "16 ways in."]`

**42.** Open RedirHub's free Redirect Checker, and paste each one. Start with the https www versions. They're the easiest to forget.
`[The https://www. column takes the amber outline; "Start here · the easiest to forget".]`

**43.** One hop. A 301. And it lands on https://mybrand.com. That's a pass.
`[w43-Checker. The chain draws; the three checks land; "That's a pass." Fixed chime 1 of 2.]`

**44.** Do that for all sixteen, and you're done.
`[w43-AllGreen. The grid returns and every pill turns white with a teal tick; "16 / 16 land on https://mybrand.com".]`

**45.** Not passing yet? Often it's a DNS record that hasn't caught up. Give it a few minutes, then check again.
`[AllGreen holds.]`

**46.** One honest note. Forwarding extra domains won't lift your rankings on its own. It catches people.
`[w43-Honest. The teal card, then the grey card.]`

**47.** And one rule: keep renewing every domain you forward. If one expires, someone else can buy it, along with everyone who types it.
`[w43-Renew. The flyer domain and the paper renewal calendar (Example date).]`

**48.** So. One main address. A 301 from every other domain. HTTPS on all of them. Then test all four versions.
`[w43-Steps returns; each card ticks as she names it.]`

**49.** Every name you own. One website.
`[w43-EndCard. "Five domains." / "One website." Fixed chime 2 of 2.]`

**50.** Links to everything in this video are in the description. And if you get stuck, reach out. We're happy to help.
`[The two lines under the headline; logo; QR slot.]`

**51.** Next week: how to change your domain name without losing SEO.
`[The end card holds; YouTube's end screen sits in the clear right half.]`

**52.** *(no VO)*
`[The end card holds for the end screen.]`

## Notes to self

- Chunk texts (`voiceover/chunks.json`) write URLs the way a person says them ("HTTPS, mybrand dot com").
- Beat 52 is silent (assembly.json → silentBeats).
