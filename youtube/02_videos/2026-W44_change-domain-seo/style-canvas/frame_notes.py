#!/usr/bin/env python3
"""W44 frame notes: one entry per board. Feeds the canvas stickies and keyframes.md, so both say the same.

    python3 frame_notes.py <live canvas.json> <out canvas.json>   # writes the w44 page, boards and notes
    python3 frame_notes.py --md                                   # prints the frame section of keyframes.md

Round 2 (Leo, 2026-10-25): Frosty Fusion becomes Frosty Bites, strawberry is the hero flavor, the smoothie-bar
mix-up replaces the dental clinic, the sweet surprise is the twist, nothing tilts.
"""
import json, sys

ROWS = [
    ('w44rowW', 'The world · cast and props (every frame reuses them)', ['w44-World']),
    ('w44rowA', 'A · Meet Frosty Fusion', ['w44-Shop', 'w44-Search', 'w44-SEO']),
    ('w44rowB', 'B · The name problem', ['w44-Smoothie', 'w44-Rename', 'w44-Worry', 'w44-Title']),
    ('w44rowC', 'C · How Google sees your site', ['w44-Pages', 'w44-Flip', 'w44-Steps']),
    ('w44rowD', 'D · The three steps, the shortcut and the catch', ['w44-Map', 'w44-Shortcut', 'w44-Melt', 'w44-OneToOne', 'w44-Migration', 'w44-Preview', 'w44-TellGoogle', 'w44-Everything']),
    ('w44rowE', 'E · Proof, the sweet surprise, and the same spot', ['w44-Checker', 'w44-OldMenu', 'w44-Wobble', 'w44-Watch', 'w44-Keep', 'w44-Return', 'w44-EndCard']),
    ('w44rowS', 'The system behind every frame: rooms, colour, type, sound and voice', ['w44-System', 'w44-Sound']),
]
REMOVED = ['w44-Dentist']  # round 1 board, replaced by w44-Smoothie

# name: (title, beats, idea, prop, move in, move out, voice, sound, feel, room, extra)
META = {
    'w44-World': ('The story world', '—', 'The cast and props every frame reuses: both names and logos, the rename morph, the shared pink-and-blue palette, the strawberry card, tethers, shop props, the search page.',
                  'all of them', '—', '—', '—', '—', '—', 'reference sheet', 'Both logos are built on Leo’s cup-of-scoops reference: Frosty Fusion holds one blue-and-pink swirl, Frosty Bites two scoops (one smiles). Fredoka is the one prop typeface, logos only. The palette is gated to the shop world by the checker.'),
    'w44-Shop': ('Meet Frosty Fusion', '1–2', 'This is Frosty Fusion, and its strawberry is famous.', 'the Frosty Fusion homepage at https://getfrostyfusion.com, the strawberry tile',
                 'Cut on “Meet” (cold open). The site is already there; on “strawberry” the strawberry tile lifts and takes its ring. The three number stickers pop on her three numbers.',
                 'Shared-element morph: the strawberry tile’s scoop icon flies out of the site and becomes the icon on the search result.', '[warm]', 'Pad only.', '“I’d go there.”', 'Light', ''),
    'w44-Search': ('Right at the top', '3–4', 'Search for the best strawberry ice cream near the shop, and Frosty Fusion is #1.', 'the generic search page; the strawberry card in slot 1',
                   'The scoop icon lands in the card; the query writes itself on “best strawberry ice cream” (no typing sound); the card rises into slot 1 on “there they are”.',
                   'Dock: the card shrinks into the address pill at the centre of the next frame.', '[curious] then [proud]', 'Pad only.', 'Pride, theirs.', 'Light', 'Generic (no search engine named or drawn), labelled “Example search”.'),
    'w44-SEO': ('What holds the spot', '5–8', 'SEO is what makes Google pick your page, and for Frosty Fusion all of it is tied to one address.', 'the address pill getfrostyfusion.com, page cards, a food-blog card, review cards',
                'The headline lands on “SEO”. The ropes draw out from the pill as she names them: pages, food blogs, reviews.',
                'On “[pause] … getfrostyfusion.com” everything holds, then cut.', 'plain, then [pause] on the address', 'Pad only; the pause is the beat.', '“So that’s what SEO is.”', 'Glow', 'Blogs and reviews are generic; no reviewer or platform named. Stars are ink, not amber.'),
    'w44-Smoothie': ('Is this a smoothie bar?', '9–12', 'The name has a problem: “Fusion” sounds like a smoothie bar.', 'the Frosty Fusion sign; two customer messages; the swirl with a straw in it',
                     'Register change (an aside): the sign hangs in the light room; bubble one pops on “smoothie bar”, bubble two on “green detox”. On [sighs] a striped straw drops into the Frosty Fusion swirl. One gag only.',
                     'Cut to the rename.', '[amused] then [laughs softly] then [sighs]', 'None. Her laugh is the sound.', 'A giggle, and sympathy.', 'Light', 'Replaces round 1’s dental-clinic frame.'),
    'w44-Rename': ('A new name: Frosty Bites', '13', 'Same shop, new name: Frosty Bites.', 'both logos; BEFORE and NOW tags; the new pill getfrostybites.com',
                   'Shared-element morph on “Frosty Bites”: the swirl splits into two scoops, the blue one opens its eyes and smiles, a drip runs over the rim, and “Fusion” rolls to “Bites”. The old logo slides left and fades to BEFORE; the domain pill rolls to the new address.',
                   'The new pill slides right and becomes the new site in the next frame.', '[excited]', 'One shimmer on the morph.', 'Delight: the shop smiles, literally.', 'Light', 'Labels (BEFORE / NOW) instead of an arrow.'),
    'w44-Worry': ('What happens to the spot?', '14–17', 'Will the #1 spot survive the move?', 'the strawberry card with a question mark; the new site alone, with empty sockets',
                  'The room changes to the Glow. The card from Search slides back in with a “?”; on “total stranger” the new site arrives with three empty sockets: no links, no reviews, no history.',
                  'Transition (1 of 2) into the title on “three steps”.', '[pause] [worried] then [reassuring]', 'Transition whoosh into the title.', 'The real worry, said out loud.', 'Glow', 'Round 1’s moon is gone. VO #17 needs a hedge (script-deltas #6).'),
    'w44-Title': ('Title card', '18', 'The promise: how to change your domain name without losing SEO, in three steps.', 'the two domain pills',
                  'Transition (1 of 2). The two pills land with “becomes” between them (no arrow); the title lands, then “Three steps.”',
                  'Cut.', '[curious], even', 'Transition (1 of 2).', 'A promise, not a pitch.', 'Brand sweep (no floor)', 'Hold ≥ 4.7 s (11 words on screen); beat 18 runs about 6 s.'),
    'w44-Pages': ('Google ranks pages', '19–21', 'Google ranks pages, not domains: the site is a map of pages, each with its own history.', 'the site map; history badges; the strawberry page as the example',
                  'Cut. The tree draws out from “/” as she names the homepage, the flavor menu and the strawberry page; history badges pop on #21.',
                  'Shared-element morph into the next frame (same tree).', 'clear, teaching', 'Pad only.', '“Oh, it’s pages.”', 'Charcoal', 'Numbers labelled “Example numbers”.'),
    'w44-Flip': ('Every address changes', '22–23', 'Change the domain and every address changes; the history doesn’t follow on its own.', 'the same tree, now at getfrostybites.com; the badges left behind',
                 'Same tree. On “every one of those addresses changes too” the domain part of each card rolls to the new one, left to right; each history badge drops off on a red broken line. The room warms to the Glow. The caption lands on #23.',
                 'Dock: the tree shrinks into card 01 of the steps.', 'clear, a little grave', 'One soft problem tone as the badges drop.', '“So that’s the risk.”', 'Glow', ''),
    'w44-Steps': ('Three steps', '24 (+58 recap)', 'Three steps: map it, redirect it, tell Google.', 'three step cards',
                  'The tree docks into card 01; the three cards rise on her three words. “Then let it settle.” waits for the recap.',
                  'Card 01 opens into the map sheet (shared element). At the recap (#58) the frame returns and each card takes a teal check as she names it.', 'clear', 'Pad only.', 'A plan you can hold.', 'Brand radial', 'The cards sit at three heights (a staircase); none is tilted.'),
    'w44-Map': ('Step one: the map', '25–28', 'Old address on the left, new on the right; same paths are one rule, changed pages get their own line.', 'the paper map; the strawberry row; the export tip',
                'Card 01 opens into the sheet. Rows write in; the strawberry row lifts on her example. The teal bracket draws on “one rule covers every page”, the grey one on “its own line”, where the CHANGED tag pops. The tip slides in on “Quick tip” (register change).',
                'Cut to the shortcut.', 'clear, then an aside for the tip', 'Pad; one pop for the tip.', '“I can do that.”', 'Light + paper', 'Columns and tags instead of row arrows. Progress bar 1 of 3.'),
    'w44-Shortcut': ('The shortcut looks perfect', '29–32', 'Sending every old page to the new homepage looks perfect, and strands the visitor.', 'the old page cards; the new homepage; a strawberry fan’s cursor',
                     'On “send everything to the new homepage” every line bends into one homepage (draw). Teal ticks on “No errors” (it really does look fixed). [pause], then the cursor wanders the homepage in a loop: “Where’s the strawberry?”',
                     'The room drops to the Glow; the old cards stay, the homepage falls away.', '[conspiratorial] then [light] then [pause]', 'Pad only.', 'Smug, then uh-oh.', 'Light', 'Same old cards as the one-to-one frame, so the fix reads as a reversal.'),
    'w44-Melt': ('The top spot melts', '33–34', 'Google can treat those pages as gone, and the strawberry ranking starts to melt.', 'the strawberry card, melting; its old spot empty',
                 'The room drops to the Glow. On #33 the old pages strike through: “treated as gone”. On “melt” the card’s bottom edge runs into drips and it slides from its old spot down to #4, upright (amber ring, the frame’s one amber). Then one second of silence.',
                 'Time-reverse into the next frame.', '[serious] then [softly]', 'One soft problem tone; then silence.', 'The floor shifts.', 'Glow', 'The catch, not the twist (Leo). A shape change only: no tilt. Positions labelled “Example”.'),
    'w44-OneToOne': ('One to one', '35', 'One old page, one matching new page: that’s the rule.', 'the old cards, their twins, 301 tags',
                     'Time-reverse, the film’s only one: the drips run back up, the card lifts, and the bent lines un-bend; each old page snaps onto its twin, one per row, with a 301 tag. The strawberry row snaps last and thickest.',
                     'Transition (2 of 2) into the dashboard.', '[firm]', 'Rewind (once); one soft snap per row.', 'Click. Relief.', 'Glow, teal', 'Plain lines with a 301 tag, no arrowheads.'),
    'w44-Migration': ('Step two: Website Migration', '36–39', 'In RedirHub: one Website Migration, same paths, from getfrostyfusion.com to getfrostybites.com.', 'the real “New website migration” form; What happens with the strawberry row',
                      'Transition (2 of 2). Links, Create, Website Migration as three quick cuts on her three words (the real create chooser). Old domain and New base URL fill on #38; “Keep the same paths” rings on #39; What happens fills, the strawberry row rings; the www pill lands on “The www version comes along too”.',
                      'The form switches to “Map URLs one by one”.', 'calm, product voice', 'Transition (2 of 2); a click on Create and on Website Migration.', 'Easy.', 'Light (product)', 'UI: Dashboard (lviv) prototype 03-create-migration (Oct 25); its arrows are the product’s own. The www line is unconfirmed for migrations (open-questions UI-3).'),
    'w44-Preview': ('Changed pages, previewed', '40–43', 'Paste the changed pages; RedirHub shows what it will create and flags a problem row before anything is created.', 'the paste box, the CSV card, What happens with a skipped row, 301 · Permanent',
                    'On “Paste your map” the rows paste in; the CSV card rings on “spreadsheet file”. What happens fills; the skipped row takes a red ring on “flags every row with a problem”. Redirect type rings teal on “301”. The DNS-and-padlock tip slides in on #43 (register change).',
                    'Create 2 redirects, a success, then cut to step three.', 'calm', 'Click on Create; one success.', 'Safe: nothing goes live by accident.', 'Light (product)', 'The skip wording is the prototype’s. Tags and Monitoring rows are cropped (open-questions UI-4).'),
    'w44-TellGoogle': ('Step three: tell Google', '44–46', 'Tell Google you’ve moved: change of address, then the new sitemap.', 'a generic search-console-style panel',
                       'Cut. The old site sits in the panel; the new site is picked on #45 and “Move requested” ticks; the sitemap row ticks “Submitted” on #46. The two numbered lines land beside it.',
                       'The panel docks; the shop props fly in.', 'calm', 'One pop per tick (2).', '“Done, that was easy.”', 'Light', 'Generic, labelled “Generic illustration, not the real console”. “to” between the fields, no arrow. Progress bar 3 of 3.'),
    'w44-Everything': ('Update everything you control', '47', 'Everything the owner controls now says Frosty Bites.', 'the site’s own links, a social bio, the paper menu with its QR slot, a maps-style listing',
                       'Each prop flips from Frosty Fusion to Frosty Bites as she names it (a mini logo morph on each) and takes a teal check.',
                       'Cut to the test.', 'brisk', 'None (four checks would be noise).', 'Thorough.', 'Light', 'All generic: no platform logos. The menu shows a QR slot, not a code.'),
    'w44-Checker': ('Redirect Checker: a pass', '48–51', 'Test it the way Google sees it: one hop, a 301, lands on its twin.', 'redirhub.com/redirect-checker; the old strawberry URL',
                    'Shared element: the strawberry card’s URL flies into the checker’s input. Check Redirect; the chain draws: hop 1 301, hop 2 200. The checks land on “One hop. A 301. And it lands…”; “That’s a pass.” on her words. The three chips pop on #51.',
                    'Cut to the surprise.', '[curious] then [delighted]', 'Fixed chime (1 of 2) on “That’s a pass”.', 'Proof, not promise.', 'Glow, teal', 'The result layout is drawn, not captured (open-questions UI-7).'),
    'w44-OldMenu': ('The sweet surprise: old menus still work', 'new (after 51)', 'The twist: even a menu printed in 2021, with the old name and the old QR, still lands on the strawberry.', 'an old Frosty Fusion paper menu; a phone opening the Frosty Bites strawberry page',
                    'Cut to colour (the brand sweep). The old menu slides in with its “PRINTED IN 2021” tag. A phone scans its QR slot; the explainer fills line by line (THE OLD MENU SAYS, THE PHONE OPENS) and the phone lands on the strawberry page with a teal check.',
                    'Silence for a beat, then cut to the wobble.', '[delighted], a little amazed', 'One sparkle when the phone lands.', 'Joy: “oh, that still works?”', 'Brand sweep', 'New frame and new VO (script-deltas #18). The joyful twist Leo asked for: unexpected, and it teaches that redirects catch printed links too.'),
    'w44-Wobble': ('The wobble', '52–53', 'Rankings may wobble for a few weeks; that’s normal, don’t undo the redirects.', 'the ranking line as a tiny rollercoaster, the scoop riding it',
                   'The track draws left to right; the scoop rides it down after “the move”, dips twice, and settles back at #1 by week 4 on “It’s normal”. The caption lands on “don’t undo the redirects”.',
                   'Cut.', '[gently] then [reassuring]', 'Pad only.', 'Calm. Nobody panics.', 'Charcoal', 'Labelled “Example”: no timing or recovery is promised.'),
    'w44-Watch': ('Watch the move happen', '54', 'RedirHub analytics show how many people still come in through the old domain.', 'the Analytics page, Domains card',
                  'Cut to Analytics. The old domain’s row rings as she says it.', 'Cut.', 'calm', 'Pad only.', '“I can watch it.”', 'Light (product)', 'VO proposed per domain, not per path (script-deltas #22). Numbers are “Example numbers”.'),
    'w44-Keep': ('Two rules before you go', '55–57', 'Keep the redirects a year at least (better, for good), and keep renewing the old domain.', 'a paper calendar; the old domain’s renewal card',
                 'Rule one lands, its months tick, “Better still: keep them for good.” Rule two lands; “someone else” in red on #57, said kindly.',
                 'The steps return ticked for the recap (#58).', '[playful]', 'Pad only.', 'Looked after.', 'Light + paper', 'Renewal date labelled “Example date”.'),
    'w44-Return': ('Right where Frosty Fusion used to be', '59–61', 'A few weeks later, the same search: Frosty Bites in the exact slot Frosty Fusion held.', 'the same search page; the strawberry card, now Frosty Bites',
                   'Shared-element morph with Search: the identical page, the identical slot. The card re-freezes into place and its name and address roll from Frosty Fusion to Frosty Bites in place.',
                   'Dock: the card shrinks under the end-card headline.', '[warm] then [proud]', 'Fixed chime (2 of 2) on “right where Frosty Fusion used to be”.', 'The story clicks shut.', 'Light', 'Same “Example search” label as Search.'),
    'w44-EndCard': ('End card', '61–63', 'New name. Same spot.', 'the Frosty Bites strawberry card, small; logo; QR slot',
                    'The card docks under “New name. Same spot.” The links line and the help line land.', 'Silence (done) under the end screen.', '[warm]', 'Pad, then silence.', 'Done, and pleased.', 'Glow', 'Right half clear for YouTube’s end screen. QR slot until a branded link is given.'),
    'w44-System': ('System: rooms, colour, type', '—', 'Gradient rooms only, colour roles, type, the shop palette.', '—', '—', '—', '—', '—', '—', '—', 'Changed in round 2: noted on the board.'),
    'w44-Sound': ('Sound, voice and timing', '—', 'Effects only on story beats; the voice tag each frame plays under.', '—', '—', '—', '—', '—', '—', '—', 'No audio made in this pass.'),
}

# The self-audit each board went through in round 2: what was checked by eye after the automatic checks, and what it caught.
AUDIT = {
    'w44-World': 'Wordmark “Fusion” in sky blue was 1.8:1 on white: added an ink outline. Middle morph stage was a double exposure: drew a real in-between (two plain scoops).',
    'w44-Shop': 'One idea, stickers read in order; no tilt; strawberry tile is the only ring.',
    'w44-Search': 'Same layout as Return (shared element) confirmed; label “Example search”.',
    'w44-SEO': 'Moved off Dark mesh to the Glow; ropes are plain lines, no arrowheads; review copy fixed after the rename.',
    'w44-Smoothie': 'Wordmark touched the sign edge: logo shrunk. Straw gag dipped 4 px below y 950: moved up. One gag only.',
    'w44-Rename': 'BEFORE/NOW tags were invisible on the light room and stretched full width: white chips, sized to content. Rebalanced: the sign fills the right two thirds.',
    'w44-Worry': 'Moon removed. Content sat low: lifted 60 px.',
    'w44-Title': 'Floor and arrow removed; “becomes” joins the pills.',
    'w44-Pages': '“Example numbers” crossed the right gutter: moved in. Grid removed (charcoal).',
    'w44-Flip': 'Red broken lines are the only red; caption within 900 px.',
    'w44-Steps': 'Staircase is margin, not a tilt (the tilt check confirms).',
    'w44-Map': 'Row arrows replaced by columns and a CHANGED tag; tag enlarged to 16 px.',
    'w44-Shortcut': 'Curves are plain lines; the cursor loop crosses the strawberry tile on purpose.',
    'w44-Melt': 'Card upright (round 1 was skewed); drop arrow replaced by the labelled empty spot; one amber.',
    'w44-OneToOne': 'Grid removed; plain lines with 301 tags.',
    'w44-Migration': 'Only product-UI arrows remain (the real form); www pill clear of y 950.',
    'w44-Preview': 'Skipped row ringed red (problem), redirect type ringed teal (fix): signals match.',
    'w44-TellGoogle': 'Arrow between the fields replaced by “to”.',
    'w44-Everything': 'Props re-centred vertically; four checks, no extra arrows.',
    'w44-Checker': 'Lab grid removed (teal glow); chips readable on dark.',
    'w44-OldMenu': 'QR label overflowed the menu: split onto two lines. Explainer uses labelled lines instead of an arrow.',
    'w44-Wobble': 'Track reads as a coaster; “Example” label inside the gutter.',
    'w44-Watch': 'Real Analytics card; numbers labelled.',
    'w44-Keep': '“Example date” tag readable (white chip).',
    'w44-Return': 'Identical to Search except the card, as intended.',
    'w44-EndCard': 'Dark mesh replaced by the Glow; right half clear.',
    'w44-System': 'Lists the six rooms now in use; no grid tiles.',
    'w44-Sound': 'Voice table uses separators, not arrows.',
}


def sticky(name):
    t, beats, idea, prop, mi, mo, voice, sound, feel, room, extra = META[name]
    lines = [f'Beats {beats}. {idea}', f'IN: {mi}', f'OUT: {mo}', f'VOICE: {voice} · SOUND: {sound}', f'FEEL: {feel} · ROOM: {room}']
    if extra:
        lines.append(extra)
    return '\n'.join(lines)


def build(live_path, out_path):
    c = json.load(open(live_path))
    if not any(p['id'] == 'w44' for p in c['pages']):
        c['pages'].append({'id': 'w44', 'name': 'W44 · How to Change Your Domain Name Without Losing SEO'})
    c['launch'] = {'page': 'w44', 'view': 'canvas'}
    # rewrite this page's boards and notes only
    for k in [k for k, v in c['boards'].items() if v.get('page') == 'w44']:
        del c['boards'][k]
    for k in [k for k, v in c['notes'].items() if v.get('page') == 'w44']:
        del c['notes'][k]
    c['order'] = [o for o in c['order'] if not o.startswith('w44-')]
    y = 0
    for rid, text, files in ROWS:
        if rid == 'w44rowW':
            c['notes'][rid] = {'kind': 'title1', 'maxW': 5000, 'page': 'w44', 'text': text, 'w': 240, 'x': 0, 'y': -260}
            c['boards']['w44-World.dc.html'] = {'h': 3520, 'page': 'w44', 'title': META['w44-World'][0], 'w': 3280, 'x': 0, 'y': 0}
            c['notes']['w44-World-note'] = {'maxH': 600, 'page': 'w44', 'size': 24, 'text': META['w44-World'][10], 'w': 1180, 'x': 3400, 'y': 1300}
            y = 3900
            continue
        c['notes'][rid] = {'kind': 'title1', 'maxW': min(8000, max(3920, 2000 * len(files) - 80)), 'page': 'w44', 'text': text, 'w': 240, 'x': 0, 'y': y - 260}
        for k, f in enumerate(files):
            c['boards'][f + '.dc.html'] = {'h': 1080, 'page': 'w44', 'title': META[f][0], 'w': 1920, 'x': 2000 * k, 'y': y}
            c['notes'][f + '-note'] = {'maxH': 560, 'page': 'w44', 'size': 24, 'text': sticky(f), 'w': 1180, 'x': 2000 * k, 'y': y + 1120}
        y += 2200
    for _, _, files in ROWS:
        for f in files:
            c['order'].append(f + '.dc.html')
    c['notes']['w44about'] = {'fill': 'teal', 'maxH': 1100, 'page': 'w44', 'size': 40, 'w': 900, 'x': 3400, 'y': 0, 'text': (
        'How to Change Your Domain Name Without Losing SEO · W44 · key-frame pass for Review 2, round 2.\n\n'
        'The story: Frosty Fusion (customers keep ordering smoothies) becomes Frosty Bites without losing its place on Google. '
        'The thread is the strawberry page: it ranks #1, the owner fears losing it, it’s the example in the map, it melts, it passes the test, an old printed menu still finds it, and it’s back in the same slot at the end.\n\n'
        'Round 2, from Leo’s notes: new names and pink-and-blue logos on the cup-of-scoops reference; strawberry; nothing tilted; no Dark mesh, grids or floors; no eyebrow dash; fewer arrows; a joyful twist (old menus still work).\n\n'
        'Files: youtube/02_videos/2026-W44_change-domain-seo/ in redirhub/reels (branch yt/w44-keyframes): keyframes.md, script-deltas.md, open-questions.md.')}
    json.dump(c, open(out_path, 'w'), indent=2, ensure_ascii=False, sort_keys=True)
    open(out_path, 'a').write('\n')


def md():
    out = []
    for rid, text, files in ROWS:
        out.append(f'\n## {text}\n')
        for f in files:
            t, beats, idea, prop, mi, mo, voice, sound, feel, room, extra = META[f]
            out.append(f'### `{f}` · {t}\n')
            out.append(f'- **Beats:** {beats} · **Room:** {room}')
            out.append(f'- **The one idea:** {idea}')
            out.append(f'- **Story prop:** {prop}')
            out.append(f'- **In:** {mi}')
            out.append(f'- **Out:** {mo}')
            out.append(f'- **Voice:** {voice} · **Sound:** {sound}')
            out.append(f'- **The viewer should feel:** {feel}')
            if extra:
                out.append(f'- **Note:** {extra}')
            out.append(f'- **Self-audit:** {AUDIT[f]}')
            out.append('')
    return '\n'.join(out)


if __name__ == '__main__':
    if sys.argv[1:] == ['--md']:
        print(md())
    else:
        build(sys.argv[1], sys.argv[2])
