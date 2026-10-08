/* GENERATED from youtube/02_videos/2026-W41_redirect-domain/script.md by scripts/yt/beats-from-script.py. One entry per VO beat: the spoken
   line and the visual note. Don't edit here; edit the script and regenerate. */
export type Beat = { n: number; vo: string; visual: string };
export const SCRIPT_BEATS: readonly Beat[] = [
    {
        "n": 1,
        "vo": "When people decide to move to a new domain, most of them do the same thing.",
        "visual": "A browser tab at a generic registrar (\"Your registrar · where you bought the domain\"). \"mybrand.com\" is typed into the search; \"Available\"."
    },
    {
        "n": 2,
        "vo": "They buy the new one, switch on \"forwarding\" at the registrar, type the old address, and land on the new site.",
        "visual": "Buy → \"✓ Yours\". The tab switches to mydomain.com's settings: Forwarding toggles on, \"Forward to https://mybrand.com\". A new address: mydomain.com is typed… and it lands on mybrand.com."
    },
    {
        "n": 3,
        "vo": "And honestly? Fair enough. It looks done.",
        "visual": "Everything settles on the landed tab. \"Fair enough. It looks done.\" A beat of stillness."
    },
    {
        "n": 4,
        "vo": "But here's what a half-done move does, a few weeks later.",
        "visual": "The teal cools. The card slides away; the old pill stays."
    },
    {
        "n": 5,
        "vo": "Some old links open with a warning: \"Not secure.\"",
        "visual": "Browser card: mydomain.com, red dot, the browser's \"Not secure\" interstitial."
    },
    {
        "n": 6,
        "vo": "Others dump people on the homepage, not the page they wanted.",
        "visual": "Pill: mydomain.com/pricing → line → card shows the mybrand.com homepage. The /pricing falls off the line."
    },
    {
        "n": 7,
        "vo": "Some pages are just… gone.",
        "visual": "Card: \"This page doesn't exist.\" Red dot."
    },
    {
        "n": 8,
        "vo": "Google can't follow the move, so your rankings slip.",
        "visual": "A search-result card for the old page fades; its position arrow ticks down."
    },
    {
        "n": 9,
        "vo": "And the QR code you printed? The link in that email from last year? Dead.",
        "visual": "A printed card with a QR; the scan line goes nowhere. An email card with a dead link."
    },
    {
        "n": 10,
        "vo": "So how do you move your domain the right way, and keep it secure? It's simpler than you think.",
        "visual": "Problems sweep off. Title card: \"How to redirect a domain to another domain.\" Second line, smaller: \"With HTTPS that actually works.\""
    },
    {
        "n": 11,
        "vo": "First, you need to understand three concepts. Then we do it together.",
        "visual": "Three numbered cards: 01 The 301 · 02 DNS · 03 HTTPS. Plain type, no icons."
    },
    {
        "n": 12,
        "vo": "Concept one: the 301 redirect.",
        "visual": "Card 01 comes forward. The old address pill, alone."
    },
    {
        "n": 13,
        "vo": "It's a note that says \"moved permanently,\" plus the new address.",
        "visual": "The 301 ticket drops onto the old pill: \"301 · Moved permanently · New address: mybrand.com\"."
    },
    {
        "n": 14,
        "vo": "Browsers follow it instantly, and Google updates its records.",
        "visual": "A line draws from the old pill through the ticket to the new pill. Two chips tick: \"Browsers · follow it instantly\", \"Google · updates its records\"."
    },
    {
        "n": 15,
        "vo": "Concept two: DNS is the internet's address book.",
        "visual": "A closed address book. It opens."
    },
    {
        "n": 16,
        "vo": "Type a domain, and your browser looks it up in that book to find a number: the server to talk to. Those entries are called records.",
        "visual": "Address book page: \"mydomain.com\" and, next to it, a row of digits. The word \"record\" labels the row."
    },
    {
        "n": 17,
        "vo": "Moving the right way means changing a couple of those records, so the old domain points at something that hands out the note.",
        "visual": "The number on the row is replaced; the row now leads to a small \"note dispenser\" (the redirect server) that hands out 301 cards."
    },
    {
        "n": 18,
        "vo": "Concept three: the padlock is an ID card.",
        "visual": "The padlock from a browser bar morphs into an ID card."
    },
    {
        "n": 19,
        "vo": "Over HTTPS, a site shows an ID card first. It's called a certificate. It proves the site is who it says it is, and it keeps the connection private.",
        "visual": "Browser bar ↔ ID card handshake. Padlock closes. Mono: https://"
    },
    {
        "n": 20,
        "vo": "No certificate, no padlock. A warning instead of your page.",
        "visual": "The ID card is missing; the bar turns to \"Not secure,\" red dot."
    },
    {
        "n": 21,
        "vo": "Here's the catch. Your old domain needs its own ID card, even if all it does is point somewhere else. The browser checks the ID before it reads the note.",
        "visual": "Sequence, left to right: browser → ID check → only then the note → new site."
    },
    {
        "n": 22,
        "vo": "And browsers are getting stricter: Chrome is rolling out a warning before it opens public sites that aren't secure.",
        "visual": "A Chrome-style warning card, muted: \"The connection to this site is not secure.\""
    },
    {
        "n": 23,
        "vo": "To be fair to registrars: some forwarding handles the ID card for you. Some doesn't, and the certificate is on you. So, some do, some don't. Here's how to check: type your old address with https in front. Padlock? You're fine. Warning? Keep watching.",
        "visual": "Two pills side by side: https://mydomain.com with a teal padlock, https://mydomain.com with a red \"Not secure.\""
    },
    {
        "n": 24,
        "vo": "That's it: three concepts. The note, the address book, the ID card. Now let's use them.",
        "visual": "The three numbered cards from beat 11 return, each ticked. Then they clear for the dashboard."
    },
    {
        "n": 25,
        "vo": "Here's how to do it the right way, from the RedirHub dashboard.",
        "visual": "Navy clears to the dashboard. A browser card with dash.redirhub.com."
    },
    {
        "n": 26,
        "vo": "It handles the note and the ID card for you, and it works with your DNS, wherever it lives.",
        "visual": "Links page: a few existing rows with teal dots."
    },
    {
        "n": 27,
        "vo": "Old domain: mydomain.com. New site: mybrand.com.",
        "visual": "The two pills from the opening dock into the top of the frame and stay for the whole act."
    },
    {
        "n": 28,
        "vo": "Step one: write the note. Links → Create → Domain Redirect.",
        "visual": "Cursor: Create. The chooser: Branded Link, Dynamic QR Code, Domain Redirect, Website Migration. Click Domain Redirect."
    },
    {
        "n": 29,
        "vo": "Redirect from: mydomain.com. Redirect to: https://mybrand.com. Type: 301. And keep the path on, so every old page lands on its matching new page.",
        "visual": "Form fills field by field. The 301 chip. The \"Keep path\" toggle turns teal. Beside it, a tiny callback: /pricing → /pricing."
    },
    {
        "n": 30,
        "vo": "Save. One down.",
        "visual": "Toast: \"Changes saved\". The rail: note ✓."
    },
    {
        "n": 31,
        "vo": "Step two: the address book. RedirHub shows you exactly which records to change.",
        "visual": "Hostnames: mydomain.com with a \"Connect DNS\" button. Click. The Connect DNS window opens on the Manual tab."
    },
    {
        "n": 32,
        "vo": "For a root domain, that's two: an A record, the number to point at, and a TXT record, which proves the domain is yours. Plus a CNAME for the www version.",
        "visual": "Three record rows: A @ · TXT @ · CNAME www, each with a copy button. The values are the ones the dashboard shows for this domain."
    },
    {
        "n": 33,
        "vo": "Quick tip. Before you touch anything in your DNS, screenshot it. Thirty seconds now, zero regret later.",
        "visual": "Tip card slides in from the right: a camera icon, \"Screenshot your DNS first.\""
    },
    {
        "n": 34,
        "vo": "Now open your DNS, wherever your domain lives, and add those records. Copy and paste. And copy yours, not mine.",
        "visual": "Split: RedirHub on the left, a neutral \"Your DNS provider\" panel on the right. Values fly across one by one."
    },
    {
        "n": 35,
        "vo": "Back in RedirHub, it checks every few seconds. The address book updates… and the ID card is issued automatically. Two green checks: DNS. HTTPS.",
        "visual": "Verifying card: \"Checking DNS\" spinner → ✓. \"Issuing HTTPS certificate\" → ✓. The rail: address book ✓, ID card ✓."
    },
    {
        "n": 36,
        "vo": "That's the whole setup. Concept three took care of itself.",
        "visual": "The three-slot rail, all filled. A quiet beat."
    },
    {
        "n": 37,
        "vo": "Let's test it. Open a browser, type mydomain.com…",
        "visual": "Browser card, address bar typing: mydomain.com"
    },
    {
        "n": 38,
        "vo": "…and it's still the old site.",
        "visual": "The old site loads. The dot stays grey. A beat."
    },
    {
        "n": 39,
        "vo": "Hold on. Your redirect might be fine. It's your test that's wrong.",
        "visual": "Time runs backwards: the page unloads, the typing un-types, back to the empty bar."
    },
    {
        "n": 40,
        "vo": "Browsers keep copies of pages they've seen, so you may be looking at yesterday's site. First rule of testing a move: a private window. No copies, no leftovers.",
        "visual": "A new, darker browser card slides over: private window. Tip badge: \"Test in a private window.\""
    },
    {
        "n": 41,
        "vo": "Same address, private window… and there it is. mybrand.com. Padlock.",
        "visual": "Address bar types mydomain.com; it resolves to https://mybrand.com. Teal dot. Padlock closes."
    },
    {
        "n": 42,
        "vo": "",
        "visual": "Caption under the card, 4 s: \"Still the old site? Give DNS a few minutes.\""
    },
    {
        "n": 43,
        "vo": "Three quick checks.",
        "visual": "Three empty checklist badges."
    },
    {
        "n": 44,
        "vo": "One: the old domain, with https in front, lands on the new site with a padlock.",
        "visual": "Pill https://mydomain.com → line → card https://mybrand.com, padlock. Badge 1 fills teal."
    },
    {
        "n": 45,
        "vo": "Two: an old deep link lands on the same page, not the homepage.",
        "visual": "Pill mydomain.com/pricing → line → card mybrand.com/pricing. Badge 2 fills."
    },
    {
        "n": 46,
        "vo": "Three: the www version works too.",
        "visual": "Pill www.mydomain.com → line → card mybrand.com. Badge 3 fills."
    },
    {
        "n": 47,
        "vo": "All three green.",
        "visual": "The one allowed combined screen: three badges, one teal line under them."
    },
    {
        "n": 48,
        "vo": "Two things before you go.",
        "visual": "Badges slide up; two tip slots."
    },
    {
        "n": 49,
        "vo": "A padlock means the connection is private, not that the site is honest. It's an ID card, not a character reference.",
        "visual": "The ID card from Act B, with the padlock on it. A small \"Private ≠ honest\" caption."
    },
    {
        "n": 50,
        "vo": "And don't let the old domain expire. If it lapses, someone else can register it, and every old link and printed QR code points at them. Keep renewing it as long as anyone might still have the old address.",
        "visual": "The old pill with a renewal date; a calendar page flips; the pill stays teal."
    },
    {
        "n": 51,
        "vo": "Remember the start? Forwarding on, old link opens, looks done.",
        "visual": "Callback: the exact frame from beat 3, small, in the corner."
    },
    {
        "n": 52,
        "vo": "Now it is.",
        "visual": "The small frame expands; the redirect line redraws; every dot on screen turns teal."
    },
    {
        "n": 53,
        "vo": "Everything you need to manage your URLs is linked in the description. And if you get stuck, reach out to us. We're happy to help.",
        "visual": "The end card builds: \"Old domain. Fixed.\" Under it: \"Links in the description · Questions? Reach out.\" Logo, branded QR."
    },
    {
        "n": 54,
        "vo": "",
        "visual": "End card: \"Old domain.\" white. \"Fixed.\" teal. RedirHub logo, white variant. Branded QR with its link underneath. Silence except the \"fixed\" chime."
    }
];
