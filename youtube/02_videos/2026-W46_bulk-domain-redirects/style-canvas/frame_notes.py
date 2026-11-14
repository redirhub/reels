#!/usr/bin/env python3
"""W46 frame notes: one entry per board. Feeds the canvas stickies and keyframes.md, so both say the same.

    python3 frame_notes.py <live canvas.json> <out canvas.json>   # writes the w46 page, boards and notes
    python3 frame_notes.py --md                                   # prints the frame section of keyframes.md
"""
import json, sys

PAGE = {'id': 'w46', 'name': 'W46 · How to Redirect Hundreds of Domains at Once'}

ROWS = [
    ('w46rowW', 'The world · Northway, its domains, the two threads and the door-and-knock motif (every frame reuses them)', ['w46-World']),
    ('w46rowA', 'A · Your company', ['w46-Notebook', 'w46-Northway', 'w46-OneSite', 'w46-Title']),
    ('w46rowB', 'B · The quiet pile', ['w46-Renewals', 'w46-Accounts', 'w46-Weight']),
    ('w46rowC', 'C · The visitor nobody sees (the twist)', ['w46-TwoResults', 'w46-Warning', 'w46-Silence']),
    ('w46rowD', 'D · The way out (the motif is born; the bridge into the spreadsheet)', ['w46-Door', 'w46-Honest', 'w46-Once']),
    ('w46rowE', 'E · One spreadsheet (no steps: it grows out of the story)', ['w46-List', 'w46-Columns', 'w46-Import', 'w46-Fix', 'w46-Review', 'w46-PointDNS', 'w46-Padlocks']),
    ('w46rowF', 'F · Hearing the knock (the reward)', ['w46-Knocks', 'w46-Price', 'w46-Quiet', 'w46-ByTag']),
    ('w46rowG', 'G · Your list', ['w46-Recap', 'w46-YourNames', 'w46-EndCard']),
    ('w46rowS', 'The system behind every frame: rooms, colour, type, motion, sound and voice', ['w46-System', 'w46-Sound']),
]

# name: (title, beats, idea, props, move in, move out, voice, sound, feel, room, note)
META = {
    'w46-World': ('The story world', '—', 'The cast, props and motif every frame reuses.', 'all of them', '—', '—', '—', '—', '—', 'reference sheet',
                  'v6 (Leo, 2026-11-13): Northway, a small software company whose domains piled up (products, countries, misspellings, the old name); its type-only wordmark (Instrument Serif, “software” in small capitals) and its one website on northwaysoft.com (northway.com is live). Two threads: rotawick.com, a retired product people still type (the twist and the closing door), and nortwaysoft.com, “Northway without the h” (the knocks). Every domain invented and DNS-checked on 12 Nov 2026.'),
    'w46-Notebook': ('Buy the domain first', '1–2', 'Every product Northway launched started the same way: the domain first.',
                     'a product notebook: the idea (“A scheduling app for clinics”), a crossed-out idea, a sketch; the plan: “1. the domain” circled round an empty line, then 2–4; “Northway” written at the top of the page',
                     'Cold open on the notebook; “Northway” writes in as she names it. On “buy the domain first” the circle draws round the empty line (draw); “one for each country”, “a few misspellings” and “the old name, too” write in on their words.',
                     'Cut on “Today, Northway owns…”.', 'warm, then plain', 'No cue.', '“That’s how my list started too.”', 'Evening', 'The notebook is Northway’s habit, never a person.'),
    'w46-Northway': ('Meet Northway', '3', 'Today Northway owns over two hundred domains.', 'the Northway wordmark on paper; twelve domain tiles (products, countries, misspellings, the old name)',
                     'The wordmark settles on “Northway”; the wall fills tile by tile on “owns over two hundred domains”; the line lands on “over two hundred”.',
                     'The tiles carry into the next frame (six of them).', 'thoughtful', 'None.', '“Whatever your business is, your list grew the same way.”', 'Light',
                     'The wordmark is never louder than the RedirHub frame around it.'),
    'w46-OneSite': ('One website, every product', '4', 'All the products move to one website, so every domain needs a new destination.',
                    'six domain tiles; Northway’s homepage on northwaysoft.com; six lines and an arrow',
                    'New in v6. The homepage pops in on “on one website” with its line; on “every one of those two hundred domains needs a new destination” each domain draws a line into it, one after another (draw: traffic moves).',
                    'Whoosh into the title.', 'matter-of-fact', 'None.', 'The job is clear: everything points to one place.', 'Light', 'One idea on screen. Uses the existing draw move.'),
    'w46-Title': ('Title card', '5', 'How to redirect hundreds of domains at once, with one spreadsheet.', 'the title; the file the domains became',
                  'The file slides in (whoosh 1 of 2); the title lands on “how do you move hundreds of domains at once” and holds through the question.',
                  'Cut to Act B.', 'thoughtful', 'Whoosh 1 of 2.', '“That’s my question.”', 'Brand sweep', 'The title keeps “redirect” for search; the voice says “move”.'),
    'w46-Renewals': ('Every domain renews', '6', 'Each domain renews every year, used or not.', 'eight Northway domains across a year; one Renews chip each, in its month',
                     'The headline is there on the cut; the Renews chips arrive month by month under “renews every year”; the footer lands on “whether anyone uses it or not”.',
                     'Cut.', 'plain', 'None.', 'A calm, familiar pressure. No numbers.', 'Light', 'No dollar figures.'),
    'w46-Accounts': ('Three registrar accounts', '7', 'The forwards live in three registrar accounts, set up years ago.', 'a generic registrar forwarding settings card (no real brand); one line',
                     'The card arrives on “Most of them forward somewhere”; “Three registrar accounts. Set up years ago.” lands on “Set up years ago”.',
                     'Cut.', 'plain', 'None.', '“Nobody’s looked at these in years.”', 'Charcoal', 'Was w46-Parking (v4). No parking, Bodis or Google claims remain.'),
    'w46-Weight': ('Which ones do people still type?', '8', 'Nobody knows which domains people still type.', 'fifteen Northway domains dimmed; rotawick.com lit; one amber visitor dot',
                   'The line lands on “which ones people still type”; on “a product you retired years ago” one amber dot arrives at rotawick.com and its halo breathes once.',
                   'Cut into the evening.', 'plain', 'None.', 'One domain matters more than it looks.', 'Evening', 'Amber once: the visitor.'),
    'w46-TwoResults': ('Two addresses, two results', '9–10', 'The plain address works; the secure one doesn’t.',
                       'left: Northway checked the plain address rotawick.com and its homepage shows; right: the customer’s browser at https://rotawick.com, an empty padlock',
                       'The customer types the retired product’s domain (right). On “It forwards to Northway’s site” Northway’s own check comes in on the left while the right dims; focus rack on “But the customer’s browser”; on “secure version first” the address becomes https://.',
                       'Cut to the warning.', 'curious', 'None.', 'A small chill: “which one did we test?”', 'Evening',
                       'Fairness on screen: “Some registrars include a padlock with forwarding. Others don’t.”'),
    'w46-Warning': ('The customer leaves', '11', 'The customer sees a warning page; to them, Northway looks broken.', 'the generic warning page for https://rotawick.com',
                    'The page lands on “warning page” (the one low tone) and holds through “it looks like Northway is broken”.', 'On “They leave” the page leaves the room.', 'quiet',
                    'One soft low tone.', 'A quiet loss.', 'Evening', 'The only frame with Signal Red. Now narrated (v6 beat 11 fills the old gap).'),
    'w46-Silence': ('Northway never finds out', '12', 'Northway never finds out.', 'rotawick.com alone; two faint rings that fade before they reach it',
                    'The rings spread and fade before reaching the tile (a knock nobody hears). The line lands on “never finds out”.',
                    'Silence (done), then the door is born from the tile.', 'plain', 'Silence.', 'The low point. Restraint.', 'Evening', 'No email, no notification: the absence is the picture.'),
    'w46-Door': ('A door, and a knock', '13', 'Every domain needs a door that opens, and a way to hear the knock.', 'the motif, born: rotawick.com as an arched door, teal light, the padlock solid; three knock arcs',
                 'Shared-element morph: the tile grows into a closed door; on “a door that opens properly” the light fills it from the top; the two lines land with their words; on “someone knocks” the knock sounds and the arcs leave, one per rap.',
                 'Register change into the honest note.', 'thoughtful', 'Knock 1 of 2.', '“That’s the whole problem, in one picture.”', 'Charcoal', 'The motif’s first full appearance.'),
    'w46-Honest': ('One honest note', '14', 'A handful of domains with a working padlock: you’re done.', 'an aside card; the Redirect Checker on https://clinvane.com: 301, then 200 on Northway’s page',
                   'The card slides in on “One honest note”; the checker comes in on “shows the padlock” and runs on “Check one”: the two hops appear in order.', 'Cut back on “But”.', 'plain, generous', 'None.',
                   'Trust: they’re not selling me something I don’t need.', 'Light', 'Checker drawn as an example (labelled); its layout unconfirmed (open-questions.md Q-3).'),
    'w46-Once': ('Two hundred domains, one file', '15', 'The bridge: write down once where every domain should go.', 'three registrar forms with Northway’s domains; three lines; one empty file',
                 'The forms stack on “in three accounts, one form at a time”; the empty file arrives on “So instead”; on “you write down once” three lines draw into it; the line lands on “once”.',
                 'Dock: the file slides to centre and grows.', 'thoughtful', 'None.', 'Relief: one place for the plan.', 'Light', 'The rows arrive in the next frame, not before.'),
    'w46-List': ('One row per domain', '16', 'Each row is one domain, and where it should go.', 'northway-domains.csv: six rows (the old product, a product, two countries, two misspellings)',
                 'The file docks from Once; the rows arrive on “Each row is one domain”; the domain column tints on “one domain”, the destination column on “where it should go”; a ring walks the old product’s row, the country rows, the misspellings.',
                 'Hold; the tint moves right.', 'calm, teaching', 'None.', '“I can write that.”', 'Light', 'No step label (v6).'),
    'w46-Columns': ('A 301 and a tag', '17–19', 'A 301 because the moves are for good; a tag for the group.', 'the same file; “301”; Product · Country · Typo chips',
                    'The tint slides to type on “A 301, the permanent kind”; the headline’s first half lands on “because these moves are for good”, the second on “a short label for the group”; the chips light on “Product. Country. Typo.”; the file holds through “the whole plan”.',
                    'Whoosh into the product.', 'calm, warm', 'None.', 'The plan is done, and anyone can check it.', 'Light', 'The real import columns: source_url, destination, type, tags.'),
    'w46-Import': ('Import CSV', '20', 'In RedirHub: Links, Create, Import CSV.', 'the Northway workspace’s Links; the Create chooser; the Import CSV link ringed; the CSV line',
                   'Cut into the product (whoosh 2); the chooser docks forward on “Create”; the ring draws on “Import CSV”; the CSV line lands on “plain spreadsheet file”.',
                   'The chooser docks out before the check comes in.', 'calm', 'Whoosh 2 of 2.', 'Familiar, real product.', 'Light', 'The voice says “Redirect Hub” (open-questions.md P-1).'),
    'w46-Fix': ('One click fixes all of them', '21–22a', 'Before saving, it shows what will happen and the rows that need a second look.', 'the import check: 9 rows need a fix; Add https:// to all 9',
                'The check docks in on “Before anything is saved”; the error group opens on “any row that needs a second look”; on “One click fixes all of them” the button is pressed and the group clears.',
                'Shared element: the dialog turns into the review.', 'calm', 'None.', 'Nothing breaks by surprise.', 'Light', 'Real strings (open-questions.md Q-2).'),
    'w46-Review': ('It shows what will happen', '22b', 'Adds 214 domains; each domain’s www comes along.', 'the review: Adds 214 domains and 214 links; Leave out 12 www rows',
                   'The review settles; the www row rings on “each domain’s www version comes along too”.', 'Cut to Hostnames.', 'calm', 'None.', 'Confidence before committing.', 'Light', '214 fits the Pro plan (250); no plan is named.'),
    'w46-PointDNS': ('Point the domains', '23–24', 'DNS points each domain; Cloudflare connects automatically, elsewhere add the records.', 'Hostnames: Northway’s domains, Waiting for DNS / Connected; Connect DNS panel',
                     'The panel docks in on “That’s DNS”; the Cloudflare row rings on “On Cloudflare”; the Manual tab lifts on “Elsewhere”; four domains turn Connected one at a time on “In batches”.',
                     'Cut to the padlocks.', 'calm', 'None.', 'It can be done in batches.', 'Light', 'The caption: a domain still waiting doesn’t hold up the others.'),
    'w46-Padlocks': ('Every door opens, padlock included', '25', 'As each domain connects, its padlock is set up and renewed.', 'twelve doors, Northway’s domains',
                     'The doors open one after another on “as each domain connects”, light filling each; the last lands on “set up” with the fixed chime; the headline on “renewed for it”.',
                     'Hold, then cut to Act F.', 'warm', 'Fixed chime (the fix moment).', 'Done.', 'Glow, teal', 'The chime plays only here.'),
    'w46-Knocks': ('Sixty-three knocks', '26–29a', 'For the first time, Northway hears the knocks: a misspelling with 63 visits.', 'nortwaysoft.com, 0 → 63 visits (Example), “drop at renewal?” crossed out; the open door with arcs',
                   'On “could hear the knocks” the knock sounds and the arcs leave; the tile arrives on “one stood out” and rolls to 63 on “Sixty-three visits”; the door is unlabelled until “A misspelling” names it; the sticky arrives on “nearly been dropped” and a pen line crosses it; the line lands on “Those were customers…”.',
                   'Cut on “Now”.', 'warm, lightly', 'Knock 2 of 2.', '“Real people typed that.”', 'Charcoal', 'The number is an example, labelled.'),
    'w46-Price': ('They land on the homepage', '29b', 'Now they land on the homepage, padlock and all.', 'Northway’s homepage; the address bar from nortwaysoft.com to https://northwaysoft.com',
                  'Cut on “Now”; the headline lands; on “they land on the homepage” the address becomes the padlocked homepage.', 'Cut.', 'thoughtful', 'None.', 'Fixed, and found.', 'Light', 'Was “a real price” (v4).'),
    'w46-Quiet': ('Where to look first', '30', 'The quiet domains: where to look first at renewal.', 'the analytics Domains card, Northway’s domains, sorted; an amber bracket round the zeros',
                  'The rows sort on “stayed quiet all season”; the headline lands on “quiet”, the line on “At renewal time”; the bracket draws on “where to look first”.', 'Cut.', 'plain', 'None.', 'A practical win.', 'Light', 'Amber once. Counts labelled Example.'),
    'w46-ByTag': ('Filter by its tag, change it once', '31', 'Retiring a product? Filter by its tag, change it once.', 'Links filtered by the tag Product; Change destination to a Northway page; Update 46 links',
                  'The filter applies on “Filter by its tag”; the dialog docks forward on “Change it once” and the Update button rings.', 'Cut to the recap.', 'plain', 'None.', 'The tag pays off.', 'Light', '46 is an example.'),
    'w46-Recap': ('One list, one import, point the domains', '32', 'One list. One import. Point the domains. That’s how to move hundreds of domains at once.', 'the film’s own three objects: northway-domains.csv, the import’s review (Adds 214 domains…), Hostnames with every row Connected',
                  'The list is there from the cut; on “One import” a line draws into the review; on “Point the domains” a second line draws into Hostnames and its rows turn Connected, one after another; the spoken summary builds above, phrase by phrase.', 'Register change into the aside.', 'plain', 'None.', 'I can remember that, and I’ve seen each part.', 'Brand radial', 'v6.1 (Leo, 2026-11-14): no door and no “listen”; the summary is the method, in the product.'),
    'w46-YourNames': ('Picture your own list', '33–34', 'Picture your own list: which domain would a customer type tonight, and would the door open?', 'the aside pill and Northway’s wordmark; then your-domains.csv, rows unnamed, one row lit amber; the question',
                      'Northway’s wordmark is there from the cut and the pill fades in on “Northway isn’t a real company”; on “Picture your own list” both leave and the viewer’s list arrives; on “Which domain…” one row lights amber and the question lands in two parts.', 'Silence, then the end card.', 'lightly, thoughtful', 'None.', 'It’s about my own domains.', 'Evening', 'The frame asks; it doesn’t answer.'),
    'w46-EndCard': ('End card', '35', 'Every door. Open.', 'the end line; Links are in the description; the RedirHub logo; the right half clear for YouTube’s end screen',
                    'Cut on “If this helped”; the line and logo are there from the cut; the links line lands with its words.', 'Hold (done).', 'warm', 'None.', 'Calm, complete.', 'Glow, teal', 'v6.1 (Leo, 2026-11-14): no QR slot.'),
    'w46-System': ('System: rooms, colour, type, motion', '—', 'Rooms, colour roles, type, motion grammar, and what changed from W44.', '—', '—', '—', '—', '—', '—', 'board', 'Teal means fixed; Signal Red only on the warning page; amber at most once a frame; Northway’s palette and serif only on its own things.'),
    'w46-Sound': ('Sound, voice and timing', '—', 'Cues, voice tags and timing.', '—', '—', '—', '—', '—', '—', 'board', 'Two whooshes, one fixed chime, two knocks, one low tone, one silence. Voice: Sarah, one take per beat, −14 LUFS mix.'),
}

AUDIT = {k: 'v6 reskin (2026-11-13): checked at its peak moment in the render (Gate 3) and by keyframes-check.' for k in META}
AUDIT['w46-OneSite'] = 'New in v6 (2026-11-13): one idea, the existing draw move; checked at its peak moment (Gate 3) and by keyframes-check.'
AUDIT['w46-World'] = AUDIT['w46-System'] = AUDIT['w46-Sound'] = 'Board.'


def sticky(name):
    t, beats, idea, prop, mi, mo, voice, sound, feel, room, extra = META[name]
    if beats == '—':
        return extra
    lines = [f'Beats {beats}. {idea}', f'IN: {mi}', f'OUT: {mo}', f'VOICE: {voice} · SOUND: {sound}', f'FEEL: {feel} · ROOM: {room}']
    if extra:
        lines.append(extra)
    return '\n'.join(lines)


def build(live_path, out_path):
    c = json.load(open(live_path))
    if not any(p['id'] == 'w46' for p in c['pages']):
        c['pages'].append(dict(PAGE))
    c['launch'] = {'page': 'w46', 'view': 'canvas'}
    for k in [k for k, v in c['boards'].items() if v.get('page') == 'w46']:
        del c['boards'][k]
    for k in [k for k, v in c['notes'].items() if v.get('page') == 'w46']:
        del c['notes'][k]
    c['order'] = [o for o in c['order'] if not o.startswith('w46-')]
    y = 0
    for rid, text, files in ROWS:
        if rid == 'w46rowW':
            c['notes'][rid] = {'kind': 'title1', 'maxW': 5000, 'page': 'w46', 'text': text, 'w': 240, 'x': 0, 'y': -260}
            c['boards']['w46-World.dc.html'] = {'h': 5600, 'page': 'w46', 'title': META['w46-World'][0], 'w': 3280, 'x': 0, 'y': 0}
            c['notes']['w46-World-note'] = {'maxH': 700, 'page': 'w46', 'size': 24, 'text': META['w46-World'][10], 'w': 1180, 'x': 3400, 'y': 1300}
            y = 5980
            continue
        c['notes'][rid] = {'kind': 'title1', 'maxW': min(8000, max(3920, 2000 * len(files) - 80)), 'page': 'w46', 'text': text, 'w': 240, 'x': 0, 'y': y - 260}
        for k, f in enumerate(files):
            c['boards'][f + '.dc.html'] = {'h': 1080, 'page': 'w46', 'title': META[f][0], 'w': 1920, 'x': 2000 * k, 'y': y}
            c['notes'][f + '-note'] = {'maxH': 640, 'page': 'w46', 'size': 24, 'text': sticky(f), 'w': 1180, 'x': 2000 * k, 'y': y + 1120}
        y += 2300
    for _, _, files in ROWS:
        for f in files:
            c['order'].append(f + '.dc.html')
    c['notes']['w46about'] = {'fill': 'teal', 'maxH': 1100, 'page': 'w46', 'size': 40, 'w': 900, 'x': 3400, 'y': 0, 'text': (
        'How to Redirect Hundreds of Domains at Once (One Spreadsheet) · W46 · v6, the corrected cut (Leo, 2026-11-13).\n\n'
        'The story: your company, Northway, has two hundred domains (products, countries, misspellings, the old name) to move to one website. A customer types a retired product’s domain, meets a warning page and leaves; Northway never finds out. You write down once where every domain should go, in one file: import, fix, point, and every padlock lit. Then Northway hears the knocks.\n\n'
        'Two threads: rotawick.com (the retired product: the twist and the closing door) and nortwaysoft.com (“Northway without the h”: the knocks). No step labels: the how-to grows out of the story.\n\n'
        'Files: youtube/02_videos/2026-W46_bulk-domain-redirects/ in redirhub/reels (branch yt/w46-northway): script.md, keyframes.md, script-deltas.md, open-questions.md, review.md, alignment-done.md.')}
    json.dump(c, open(out_path, 'w'), indent=2, ensure_ascii=False, sort_keys=True)
    open(out_path, 'a').write('\n')


def md():
    out = []
    for rid, text, files in ROWS:
        out.append(f'\n## {text}\n')
        for f in files:
            t, beats, idea, prop, mi, mo, voice, sound, feel, room, extra = META[f]
            out.append(f'### `{f}` · {t}\n')
            if beats != '—':
                out.append(f'- **Beats:** {beats} · **Room:** {room}')
                out.append(f'- **The one idea:** {idea}')
                out.append(f'- **Props:** {prop}')
                out.append(f'- **In:** {mi}')
                out.append(f'- **Out:** {mo}')
                out.append(f'- **Voice:** {voice} · **Sound:** {sound}')
                out.append(f'- **The viewer should feel:** {feel}')
            if extra:
                out.append(f'- **Note:** {extra}')
            out.append(f'- **Gate 2 (Idea·Story·Clarity·Craft·Honesty·Fresh):** {AUDIT[f]}')
            out.append('')
    return '\n'.join(out)


if __name__ == '__main__':
    if sys.argv[1:] == ['--md']:
        print(md())
    else:
        build(sys.argv[1], sys.argv[2])
