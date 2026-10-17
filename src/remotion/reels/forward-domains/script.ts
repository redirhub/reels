/* GENERATED from youtube/02_videos/2026-W43_forward-multiple-domains/script.md by scripts/yt/beats-from-script.py. One entry per VO beat: the spoken
   line and the visual note. Don't edit here; edit the script and regenerate. */
export type Beat = { n: number; vo: string; visual: string };
export const SCRIPT_BEATS: readonly Beat[] = [
    {
        "n": 1,
        "vo": "Most brands own more than one domain.",
        "visual": "w43-Domains. The headline lands on the left; the right side is empty."
    },
    {
        "n": 2,
        "vo": "The .com. The .net. The .co.",
        "visual": "Three glass pills cascade in on their words: mybrand.com, mybrand.net, mybrand.co."
    },
    {
        "n": 3,
        "vo": "The misspelling you bought, so nobody else could.",
        "visual": "mybrnad.com arrives; \"rna\" takes the red wavy underline; \"the typo you bought\"."
    },
    {
        "n": 4,
        "vo": "The short one you put on flyers.",
        "visual": "The paper flyer drops in with getmybrand.com; \"the short one on flyers\"."
    },
    {
        "n": 5,
        "vo": "Every one of them is a way in. Someone types it, clicks it, or scans it.",
        "visual": "\"Every one is a way in.\" under the headline."
    },
    {
        "n": 6,
        "vo": "But a lot of extra domains lead nowhere. A parking page. An error. A \"Not secure\" warning.",
        "visual": "w43-DeadEnds. Three browser windows on a carousel: parked, can't be reached, then Not secure racks to the centre."
    },
    {
        "n": 7,
        "vo": "Each of those is a visitor who almost reached you.",
        "visual": "\"A visitor who almost reached you.\" under the stage, \"almost\" in red."
    },
    {
        "n": 8,
        "vo": "Here's how to forward every domain you own to one website, with HTTPS on every one. Three steps, and one test at the end.",
        "visual": "w43-Title. Transition 1 of 2. Five dots draw into one; the title; \"With HTTPS on every one.\" in a glass pill on the floor."
    },
    {
        "n": 9,
        "vo": "First, what a domain actually does. It doesn't hold your website. It points to where your website lives.",
        "visual": "w43-Pointer. Room change to light. The headline; the mybrand.com pill."
    },
    {
        "n": 10,
        "vo": "That pointer lives in DNS, the internet's address book.",
        "visual": "The dotted line draws to the paper address book (DNS), then to the site."
    },
    {
        "n": 11,
        "vo": "Pointing five domains at one website sounds easy. There are two ways to do it.",
        "visual": "The address book and site slide away; the pill holds."
    },
    {
        "n": 12,
        "vo": "Way one: point every domain at your hosting, so each one shows your site.",
        "visual": "w43-Perfect. Five sites pop up in a 3 + 2 grid, one per domain."
    },
    {
        "n": 13,
        "vo": "And it looks perfect.",
        "visual": "Each site takes a teal tick. \"It looks perfect.\" Hold."
    },
    {
        "n": 14,
        "vo": "But to Google, that's one website at five addresses. Five copies.",
        "visual": "w43-Copies. The room drops to dark red; the same cards drain to grey and get stamped COPY."
    },
    {
        "n": 15,
        "vo": "And when Google finds copies, it picks one address to show. Maybe not the one you'd pick.",
        "visual": "The magnifier settles on mybrand.net; \"Google shows mybrand.net · Example\"."
    },
    {
        "n": 16,
        "vo": "And the address bar shows whatever they typed. Even the typo.",
        "visual": "w43-AddressBar. Push into the typo's address bar; mybrnad.com fills the frame. \"Same site. A different name every time.\" One second of silence."
    },
    {
        "n": 17,
        "vo": "Way two: one main address. Every other domain sends people there with a 301, the permanent kind.",
        "visual": "Time-reverse (the film's only one), then w43-OneAddress: four pills fan into one node and a teal line to https://mybrand.com."
    },
    {
        "n": 18,
        "vo": "It tells browsers and Google: this moved, go here.",
        "visual": "A 301 tag pops onto each line."
    },
    {
        "n": 19,
        "vo": "Here's how to set that up in RedirHub, with HTTPS: three steps, and one test.",
        "visual": "w43-Steps. \"Here's how\" eyebrow and the goal line \"Set up way two in RedirHub, with HTTPS.\"; three frosted cards rise on \"three\"; \"Then one test: every version of every domain.\""
    },
    {
        "n": 20,
        "vo": "Step one: pick your main address.",
        "visual": "w43-MainAddress. Card 01 becomes the main-address card; the other four dim to chips."
    },
    {
        "n": 21,
        "vo": "Choose it exactly the way you want people to see it. Say, https://mybrand.com.",
        "visual": "\"https\" and \"no www\" land on \"exactly\"."
    },
    {
        "n": 22,
        "vo": "Quick tip: if one of your domains already ranks, or has links from other sites, that's usually the one to keep.",
        "visual": "The tip card slides in beside: \"Keep the one that already ranks, or has links.\""
    },
    {
        "n": 23,
        "vo": "Step two: redirect every other domain. Here's what that looks like in RedirHub.",
        "visual": "Transition 2 of 2, into the dashboard (Links list, empty)."
    },
    {
        "n": 24,
        "vo": "Links. Create. Domain Redirect.",
        "visual": "Create opens the chooser; Domain Redirect opens the New domain redirect form."
    },
    {
        "n": 25,
        "vo": "Redirect from: mybrand.net. Redirect to: https://mybrand.com. Type: 301.",
        "visual": "w43-DomainRedirect. The fields fill on her words; 301 · Permanent is selected."
    },
    {
        "n": 26,
        "vo": "Keep the path on, so mybrand.net/pricing lands on mybrand.com/pricing, not the homepage.",
        "visual": "Keep the path is selected; What happens fills with the example hops."
    },
    {
        "n": 27,
        "vo": "The www version comes along too: a root domain covers its www.",
        "visual": "The form's hint \"A root domain also covers www.\" takes a teal ring."
    },
    {
        "n": 28,
        "vo": "Save. Then the same for the next one: mybrand.co, the typo, and getmybrand.com from the flyers.",
        "visual": "w43-LinksList. The rows arrive one by one, each ↳ https://mybrand.com."
    },
    {
        "n": 29,
        "vo": "Each domain gets its own redirect. All of them point to the same place.",
        "visual": "The four rows hold."
    },
    {
        "n": 30,
        "vo": "Got dozens? Import them all from one CSV: Links, Create, Import CSV. That gets its own video soon.",
        "visual": "The tip card slides in: \"Import them all from one CSV.\""
    },
    {
        "n": 31,
        "vo": "Step three: connect each domain, with HTTPS.",
        "visual": "w43-ConnectDNS. Hostnames, the four domains \"Not connected\"; progress bar 3 of 3."
    },
    {
        "n": 32,
        "vo": "For a redirect to work, the domain has to point at RedirHub in its DNS.",
        "visual": "Hostnames holds."
    },
    {
        "n": 33,
        "vo": "Open Hostnames, and click Connect DNS. RedirHub shows you the exact records for that domain.",
        "visual": "The Connect DNS dialog opens over the dimmed shell, Automatic tab."
    },
    {
        "n": 34,
        "vo": "For a root domain, that's an A record that says where to go, and a TXT record that proves the domain is yours. Plus a CNAME for the www.",
        "visual": "The A, TXT and CNAME rows highlight on their words."
    },
    {
        "n": 35,
        "vo": "Copy the values from your own dashboard, not from this video.",
        "visual": "The values glow; a note: copy yours."
    },
    {
        "n": 36,
        "vo": "If your DNS is at Cloudflare, the Automatic tab adds them for you. You approve on Cloudflare and come straight back.",
        "visual": "The Automatic tab and Continue with Cloudflare are in focus."
    },
    {
        "n": 37,
        "vo": "Quick tip: if a domain handles email, leave its MX records alone. They're your email.",
        "visual": "The MX tip slides in beside the dialog."
    },
    {
        "n": 38,
        "vo": "Once the records are in, RedirHub checks them and issues the HTTPS certificate automatically. That's the padlock, on every domain.",
        "visual": "w43-HttpsIssued. The three steps tick; the room floods with the brand sweep; the padlock grows."
    },
    {
        "n": 39,
        "vo": "Now test it. And here's the part most people skip.",
        "visual": "w43-FourAddresses. The lab room, empty grid."
    },
    {
        "n": 40,
        "vo": "Every domain is really four addresses. With and without www. With and without https.",
        "visual": "One domain splits into four."
    },
    {
        "n": 41,
        "vo": "Four extra domains? That's sixteen ways in.",
        "visual": "The grid fills row by row; \"16 ways in.\""
    },
    {
        "n": 42,
        "vo": "Open RedirHub's free Redirect Checker, and paste each one. Start with the https www versions. They're the easiest to forget.",
        "visual": "The https://www. column takes the amber outline; \"Start here · the easiest to forget\"."
    },
    {
        "n": 43,
        "vo": "One hop. A 301. And it lands on https://mybrand.com. That's a pass.",
        "visual": "w43-Checker. The chain draws; the three checks land; \"That's a pass.\" Fixed chime 1 of 2."
    },
    {
        "n": 44,
        "vo": "Do that for all sixteen, and you're done.",
        "visual": "w43-AllGreen. The grid returns and every pill turns white with a teal tick; \"16 / 16 land on https://mybrand.com\"."
    },
    {
        "n": 45,
        "vo": "Not passing yet? Often it's a DNS record that hasn't caught up. Give it a few minutes, then check again.",
        "visual": "AllGreen holds."
    },
    {
        "n": 46,
        "vo": "One honest note. Forwarding extra domains won't lift your rankings on its own. It catches people.",
        "visual": "w43-Honest. The teal card, then the grey card."
    },
    {
        "n": 47,
        "vo": "And one rule: keep renewing every domain you forward. If one expires, someone else can buy it, along with everyone who types it.",
        "visual": "w43-Renew. The flyer domain and the paper renewal calendar (Example date)."
    },
    {
        "n": 48,
        "vo": "So. One main address. A 301 from every other domain. HTTPS on all of them. Then test all four versions.",
        "visual": "w43-Steps returns; each card ticks as she names it."
    },
    {
        "n": 49,
        "vo": "Every name you own. One website.",
        "visual": "w43-EndCard. \"Five domains.\" / \"One website.\" Fixed chime 2 of 2."
    },
    {
        "n": 50,
        "vo": "Links to everything in this video are in the description. And if you get stuck, reach out. We're happy to help.",
        "visual": "The two lines under the headline; logo; QR slot."
    },
    {
        "n": 51,
        "vo": "Next week: how to change your domain name without losing SEO.",
        "visual": "The end card holds; YouTube's end screen sits in the clear right half."
    },
    {
        "n": 52,
        "vo": "",
        "visual": "The end card holds for the end screen."
    }
];
