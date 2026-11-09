#!/usr/bin/env python3
"""W46 frame notes: one entry per board. Feeds the canvas stickies and keyframes.md, so both say the same.

    python3 frame_notes.py <live canvas.json> <out canvas.json>   # writes the w46 page, boards and notes
    python3 frame_notes.py --md                                   # prints the frame section of keyframes.md
"""
import json, sys

PAGE = {'id': 'w46', 'name': 'W46 · How to Redirect Hundreds of Domains at Once'}

ROWS = [
    ('w46rowW', 'The world · cast, props and the door-and-knock motif (every frame reuses them)', ['w46-World']),
    ('w46rowA', 'A · Imagine', ['w46-Notebook', 'w46-Glomvo', 'w46-Title']),
    ('w46rowB', 'B · What waiting costs', ['w46-Renewals', 'w46-Parking', 'w46-Weight']),
    ('w46rowC', 'C · The founder who came (the twist)', ['w46-TwoResults', 'w46-Warning', 'w46-Silence']),
    ('w46rowD', 'D · The way out (the motif is born)', ['w46-Door', 'w46-Honest', 'w46-Once']),
    ('w46rowE', 'E · One spreadsheet: list, import, point', ['w46-List', 'w46-Columns', 'w46-Import', 'w46-Fix', 'w46-Review', 'w46-PointDNS', 'w46-Padlocks']),
    ('w46rowF', 'F · Hearing the knock (the reward)', ['w46-Knocks', 'w46-Price', 'w46-Quiet', 'w46-ByTag']),
    ('w46rowG', 'G · Close', ['w46-Recap', 'w46-YourNames', 'w46-EndCard']),
    ('w46rowS', 'The system behind every frame: rooms, colour, type, motion, sound and voice', ['w46-System', 'w46-Sound']),
]

# name: (title, beats, idea, props, move in, move out, voice, sound, feel, room, note)
META = {
    'w46-World': ('The story world', '—', 'The cast, props and motif every frame reuses.', 'all of them', '—', '—', '—', '—', '—', 'reference sheet',
                  'Glomvo (Instrument Serif wordmark, stone palette), its for-sale lander, the portfolio wall (every name DNS-checked), the kipzoo.com thread in its five states, the door-and-knock motif (closed, opening with the padlock lit, a knock, and the broken state used once), the founder (a notebook and a browser, never a person), the generic warning page, three unbranded registrars, the spreadsheet with the real import columns, and the analytics Domains card. World rules at the bottom right.'),
    'w46-Notebook': ('A name that comes first', '1–2', 'The company doesn’t exist yet; its name is the first thing it needs.',
                     'the founder’s notebook: the idea, a crossed-out word, a sketch, and “1. the name” circled with an empty dashed line',
                     'Cold open on the open notebook. On “Imagine” the idea line writes in; on “the first thing they’ll look for is the name” the circle draws around the empty name line (draw).',
                     'Hard cut on “That’s the bet”.', '[softly] then [warm]', 'Pad fades in under the voice. No cue.', 'Lean in: “that empty line is my business.”', 'Evening',
                     'Merges the hook and the notebook moment (beats 1 and 2) into one image: the empty circled line is the hook.'),
    'w46-Glomvo': ('Meet Glomvo', '3', 'Glomvo holds names until the right person comes looking.', 'the Glomvo wordmark on stone; the portfolio wall of twelve tiles, kipzoo.com among them',
                   'Cut on “Glomvo”: the wordmark settles first, then the wall fills tile by tile under “buys names like that” (no sound per tile).',
                   'Shared-element morph: the wall’s tiles flow into the rows of one sheet (into the title).', 'plain, warm', 'None.', 'A serious, small team. Respect.', 'Light', 'kipzoo.com sits in the wall, unmarked: planted, not pointed at.'),
    'w46-Title': ('Title card', '4', 'How to redirect hundreds of domains at once, with one spreadsheet.', 'the title; the sheet the wall became',
                  'The wall’s tiles land as rows of the sheet (shared-element morph: the same names, now one file). The title lands on “how to redirect hundreds of domains at once”.',
                  'Cut to Act B.', '[thoughtful]', 'Whoosh 1 of 2, on the morph.', '“Ah, this is about my portfolio.”', 'Brand sweep', 'The keyword is spoken here and shown in full.'),
    'w46-Renewals': ('Every name asks every year', '5', 'Holding a name isn’t free: every name renews, every year.', 'eight name rows across a year; one Renews chip per name, in its month',
                     'The headline is there on the cut. The Renews chips arrive month by month as a slow left-to-right sweep under “every year, each one asks” (no sound).',
                     'Cut.', 'plain', 'None.', 'A calm, familiar pressure. No numbers, no alarm.', 'Light', 'No dollar figures, on purpose.'),
    'w46-Parking': ('A parking ad surface closes', '6', 'One of the ad surfaces that paid parked names closed this year.', 'a generic parked page on olzik.com, its sponsored-listing blocks; one plain dated line with its source',
                    'The ad blocks fade from the top down while “Parking ads used to pay part of that” is spoken; “February 10, 2026” lands on “February tenth”, the line under it with the voice, the source line last.',
                    'Cut.', '[matter-of-fact]', 'None.', 'Matter-of-fact: a dated change, not alarm.', 'Charcoal',
                    'Worded as Google’s help page words it (support.google.com/google-ads/answer/50002): parked domains stopped being an ad surface on the Search Partner Network on February 10, 2026. Bodis is left out (only secondary reports of a customer email); no claim about parking revenue overall. See script-deltas.md Δ-0 and open-questions.md C-1.'),
    'w46-Weight': ('Each visitor carries weight', '7', 'Sales are rare, so one visitor matters a lot.', 'fifteen name tiles (all different, all checked), dimmed; kipzoo.com lit; one amber visitor dot at its corner with a soft halo',
                   'The tiles dim on “someone buys it. That’s rare”. On “each person who comes looking” one amber dot arrives at kipzoo.com and its halo breathes once.',
                   'Shared-element morph: the dot becomes the founder’s typing caret in the next act.', 'plain, slower', 'None.', 'The weight of one person.', 'Evening',
                   'Amber once: the visitor, the key action of Act B. On screen only the second half of beat 7 (10 words); the voice carries the rest.'),
    'w46-TwoResults': ('Two addresses, two results', '8–9', 'Same name, two results: plain address works, https doesn’t.',
                       'left: Glomvo typed the plain address kipzoo.com and the lander shows (a white tick: it worked); right: the founder’s browser at https://kipzoo.com, an empty padlock waiting',
                       'Focus rack (two places, one job): the left is full brightness on “checked that it worked”; on “asks for the secure version first” the focus racks right and the left settles back a step (opacity only, never blurred, so it doesn’t read as the broken one). Both address bars are large mono. The fairness line lands on “Some registrars’ forwarding includes one”.',
                       'Hold on the spinner, then cut to the warning.', '[curious]', 'None.', 'A small chill: “wait, which one did I test?”', 'Evening',
                       'Fairness on screen: “Some registrars include a padlock with forwarding. Others don’t.” No registrar is said to fail.'),
    'w46-Warning': ('The founder leaves', '10a', 'The founder sees a warning page and picks another name.', 'the generic warning page for https://kipzoo.com; the notebook with kipzoo.com struck through and “try: rimboa.com” under it',
                    'Cut to the warning page on “warning page”. On “picks another name” the notebook slides in from the right (dock) and a pen line strikes kipzoo.com; the next name writes itself.',
                    'Cut to black-blue: the warning leaves, Glomvo’s side remains.', '[quiet]', 'One soft low tone as the warning lands.', 'A quiet loss.', 'Evening',
                    'The only frame with Signal Red. rimboa.com is invented and DNS-checked; it is not on Glomvo’s wall.'),
    'w46-Silence': ('Glomvo never finds out', '10b', 'Glomvo never finds out.', 'kipzoo.com alone; two faint rings that fade before they reach it',
                    'Nothing moves but the rings: they spread and fade before reaching the tile (a knock nobody hears, foreshadowing the motif). The line holds on “never finds out”.',
                    'Silence (done): 1.5 s of nothing, then the cut. The VO’s last clause (“their own check worked only because they typed the plain address”) plays over the hold.',
                    '[quiet]', 'Silence: pad out for 1.5 s.', 'The low point. Restraint.', 'Evening', 'No email, no offer, no notification: the absence is the picture.'),
    'w46-Door': ('A door, and a knock', '11', 'Every name needs a door that opens, and a way to hear the knock.', 'the motif, born: kipzoo.com as an arched door, padlock keystone lit, light spilling; three knock arcs',
                 'Shared-element morph: the kipzoo tile’s small slot grows into the door (same thing, new understanding). On “a door that opens properly” the leaf slides, light spills and the padlock lights teal; on “a way to hear when someone knocks” the knock (new move) sends three arcs from the door’s edge. The two lines land with the words.',
                 'Register change into the honest note.', '[thoughtful]', 'Knock (new cue): a soft two-tap on “knocks”.', '“That’s the whole problem, in one picture.”', 'Charcoal',
                 'The motif’s first full appearance. Before this it hid in every tile as the small slot.'),
    'w46-Honest': ('One honest note', '12', 'A handful of names with a working padlock: you’re done.', 'an aside card; the Redirect Checker on https://bazlio.com: 302, then 200 on Glomvo’s page',
                   'Register change (an aside): the room lightens and the card slides in on “One honest note”. The checker runs on “Check one”: the two hops appear in order (draw: traffic moves).',
                   'Cut back to the story on “But”.', 'plain, generous', 'None.', 'Trust: they’re not selling me something I don’t need.', 'Light',
                   'Checker output is drawn as an example (labelled), its layout unconfirmed (open-questions.md, Q-3).'),
    'w46-Once': ('Three registrars, fixed once', '13', 'Three registrars, so fix every name once, together.', 'three unbranded registrar forms (A, B, C); three lines drawing into one empty sheet, headers only',
                 'The three forms stack on “sat across three registrars”. On “So they fixed them once” the three lines draw from the forms into an empty sheet with only its four headers (draw): the decision. The rows arrive in Step 1, not before.',
                 'Dock: the sheet slides to centre and grows into Step 1.', 'plain, decided', 'None.', 'A decision, not a slide change.', 'Light', 'No registrar named; nobody “can’t”.'),
    'w46-List': ('Step one: the list', '14–15', 'One row per name: the name, and where it goes.', 'the spreadsheet glomvo-portfolio.csv; kipzoo.com’s row ringed; “The name” and “Where it should go” over their columns',
                 'Cut on “Step one”. The progress bar takes its first segment; the source_url column tints on “The name”, the destination column on “Where it should go”.',
                 'Hold; the tint moves right in the next frame.', 'calm, teaching', 'None.', 'Clear: “I can make this file.”', 'Light',
                 'Destinations: Glomvo’s own pages and a generic marketplace.example listing.'),
    'w46-Columns': ('A 302 and a tag', '16–17', 'Two more columns: a 302, and a tag.', 'the same sheet; the type and tags columns tinted; “302” over the type column; Brandables, Short and Premium chips over the tags column',
                    'The tint slides from destination to type on “a 302, the temporary kind”; the headline’s first half lands on “the day a name sells”, the second on “a label for a group”. The three chips light one by one on “Brandables. Short names. Premium.”',
                    'Whoosh into the product (Step 2).', 'calm, teaching', 'None.', '“Of course: temporary, because it will sell.”', 'Light', 'Merges the type and tag beats: one idea, “two more columns”. The reviewer asked for a split; kept as one to hold the frame budget (review.md).'),
    'w46-Import': ('Step two: Import CSV', '18–19', 'Links, Create, Import CSV.', 'the RedirHub dashboard (Links, workspace Glomvo); the Create chooser; “Import CSV” ringed',
                   'Cut into the product on “Step two”. Dock: the chooser comes forward over the dimmed dashboard on “Create”; the Import CSV ring draws on “Import CSV”. The CSV line lands on “plain spreadsheet file”.',
                   'Dock out into the import’s first check.', 'calm', 'Whoosh 2 of 2, into the dashboard.', 'Familiar, easy.', 'Light', 'Labels from the live dashboard (redirhub/lviv).'),
    'w46-Fix': ('One click fixes them all', '20–21a', 'Before saving, it finds the rows to fix; one click fixes them.', 'the import’s fix step: 9 rows missing https://, e.g. glomvo.com/olzik, “Add https:// to all 9”',
                'The step lands on “Before anything is saved”; the error group opens on “any row that needs a fix”; on “One click fixes them all” the button is pressed and the group clears.',
                'Shared element: the dialog stays; its content turns into the review.', 'calm, a little relieved', 'None (the brief keeps the first fixed chime for the padlocks).', 'Relief.', 'Light', 'Counts labelled Example. Script reordered to match the product (script-deltas.md, Δ-1).'),
    'w46-Review': ('It shows what the file will do', '20b–21b', 'It shows what the file will do; www is covered.', 'the import review: Adds 214 domains and 214 links; Leave out 12 www rows their root already covers (ringed)',
                   'The headline counts land on “what the file will do”; the www row rings on “each name covers its www version too”.',
                   'Cut to Step 3.', 'calm', 'None.', 'Confidence before committing.', 'Light', 'Counts labelled Example. No plan usage shown (the review’s plan line is cropped out).'),
    'w46-PointDNS': ('Step three: point the names', '22–23', 'Point the names; Cloudflare connects automatically, elsewhere add records.', 'Hostnames with Waiting for DNS and Connected; Connect DNS for kipzoo.com, Automatic (Cloudflare) ringed, Manual beside it',
                     'Cut on “Step three”; progress takes its third segment. The panel docks in on “DNS is the setting…”; the Cloudflare row rings on “On Cloudflare”; the Manual tab lifts on “Elsewhere”. Rows flip to Connected one at a time on “In batches, if you like”.',
                     'Cut to the padlocks.', 'calm', 'None.', '“I can do these a few at a time.”', 'Light', '“Cloudflare” as a plain word only, as the real UI names it. Caption is the approved fact: a waiting domain doesn’t hold up the others.'),
    'w46-Padlocks': ('Every door opens, padlock included', '24', 'As each name connects, its padlock is set up and renewed.', 'the wall again, as twelve doors, every padlock lit, light spilling',
                     'The doors open one after another on “as each name connects”, each padlock lighting teal; the headline lands on “renewed for it”.',
                     'Hold, then cut to Act F.', 'calm, satisfied', 'Fixed chime, the film’s only one, as the last padlock lights.', 'Done properly.', 'Glow, teal', 'One combined result (“all names connected”): the allowed exception to one idea per frame.'),
    'w46-Knocks': ('Sixty-three knocks', '25–26', 'kipzoo had 63 visits, typed in, and it was on the drop list.', 'the kipzoo.com tile with 63 visits; last year’s “drop list?” sticky, crossed out; Channel: Direct; the kipzoo door knocking, on the right (mirrored from the Door frame)',
                   'On “hear the knocks” the door’s arcs pulse (knock). The count rolls to 63 on “sixty-three visits”; “Channel: Direct” appears on “They typed it in”. On “It had been on last year’s drop list” the “drop list?” sticky arrives and a pen line crosses it out.',
                   'Cut.', '[warm] then [lightly]', 'Knock (second and last).', 'Warm, with one dry smile.', 'Charcoal', '63 is labelled Example. The VO says visits; the dashboard’s label is Clicks (open-questions.md, Q-5).'),
    'w46-Price': ('A real price', '27', 'So kipzoo got a real price.', 'Glomvo’s lander for kipzoo.com: until now only “Interested? Write to us.”; now Buy now (a PRICE chip, never a figure) and Make an offer',
                  'Shared-element morph: the same lander from Act C; “Write to us” gives way to Buy now on “a real price” and Make an offer on “make-offer button”. The headline lands with them.',
                  'Cut.', '[thoughtful]', 'None.', 'Quiet satisfaction.', 'Light', 'No price, no dollar sign.'),
    'w46-Quiet': ('Where to look first', '28', 'At renewal, the quiet names are where to look first.', 'the analytics Domains card, kipzoo.com on top; the three names at 0 bracketed in amber',
                  'Rows sort on “stayed quiet all season”; the amber bracket draws around the zeros on “where to look first”.',
                  'Cut.', 'plain', 'None.', 'Informed, not told.', 'Light', 'Amber once. Counts labelled Example. Nobody is told to drop a name.'),
    'w46-ByTag': ('Filter by the tag, change it once', '29', 'Filter by the tag, change the destination once.', 'Links filtered by Tags: Brandables; 128 links selected; Change destination with a generic marketplace URL; Update 128 links',
                  'The filter applies on “Filter by the tag”; the rows check; the dialog docks forward on “Change it once” and the Update button rings.',
                  'Cut to the recap.', 'plain, light', 'None.', '“The tags were worth it.”', 'Light', '128 labelled Example. The note under the URL is the product’s own line.'),
    'w46-Recap': ('List · Import · Point · Listen', '30', 'List, import, point, listen.', 'four marks: the sheet, Import CSV, a lit door, a knocking door',
                  'One at a time, on the beat: List on “One list”, Import on “One import”, Point on “Point the names”, Listen held for the keyword line.',
                  'Register change into the aside.', 'plain, summing up', 'None.', 'I could do this.', 'Brand radial', 'The voice says three; the fourth word, Listen, is the picture’s (script-deltas.md, Δ-3).'),
    'w46-YourNames': ('Would the door open?', '31–32', 'Picture your own names: would the door open?', 'the aside pill; kipzoo.com’s door, open but stepped back; four closed doors, unlabelled: yours',
                      'The aside pill fades in on “Glomvo isn’t a real company” (register change), and kipzoo’s door steps back. On “Picture your own names” four closed doors rise beside it, unlit, unlabelled; the question lands in two parts on its two sentences. The frame asks; it doesn’t answer.',
                      'Silence, then the end card.', '[lightly] then [thoughtful]', 'Pad thins out.', 'A question that stays with you tonight.', 'Evening',
                      'Calls back to the opening (the evening room, the founder typing tonight). Merges the aside and the final question.'),
    'w46-EndCard': ('End card', '33', 'Every door. Open.', 'the end line; the RedirHub logo; the QR slot “Dynamic QR · link pending”; the right half clear for YouTube’s end screen (W43, W41)',
                    'Cut on “If this helped”. The line holds; logo and QR slot are there from the cut.',
                    'Silence (done).', '[warm]', 'Pad out. Silence.', 'Warm, finished.', 'Glow, teal',
                    'QR: a RedirHub dynamic QR to the domain-parking page with utm_medium=qr, made later. Never a drawn code.'),
    'w46-System': ('System: rooms, colour, type, motion', '—', 'Rooms, colour roles, type, motion grammar, and what changed from W44.', '—', '—', '—', '—', '—', '—', 'board', 'The knock is the one new move.'),
    'w46-Sound': ('Sound, voice and timing', '—', 'Cues, voice tags and timing.', '—', '—', '—', '—', '—', '—', 'board', 'Two whooshes, one fixed chime, two knocks, one low tone, one silence.'),
}

# Gate 2: Idea · Story · Clarity · Craft · Honesty · Fresh (0–2), with what was reworked to reach 2.
AUDIT = {
    'w46-World': 'Gate 1: round 1 the door read as a battery (rounded slab under a lock): redrawn as an arched doorway, padlock keystone, light spill on the floor. Panels that clipped their notes were resized; the F tile was shown twice and is now one.',
    'w46-Notebook': '2·2·2·2·2·2. Round 1 Craft 1: the empty name line was a timid “?”; now a dashed blank line inside the circle, and “the name” no longer wraps.',
    'w46-Glomvo': '2·2·2·2·2·2. Round 1 Craft 1: tiles ran into the right gutter and the group sat high; tiles narrowed and the composition centred.',
    'w46-Title': '2·2·2·2·2·2. Round 1 Craft 1: the sheet was too small to read as a sheet and crossed the gutter; now narrower and larger.',
    'w46-Renewals': '2·2·2·2·2·2.',
    'w46-Parking': '2·2·2·2·2·2. Fact check (Kris, 2026-11-09): narrowed to the one fact Google’s own page states, with its source on screen; Bodis and the industry-wide line removed. Gate 4: the consequence caption is gone (the voice carries it), so the frame holds only the two dated lines.',
    'w46-Weight': '2·2·2·2·2·2. Round 1: the amber dot’s halo counted as a second amber object; the halo is now a gradient, the dot the only amber object. Gate 4 (fresh eyes): names repeated across the grid and the caption ran 23 words; now 15 different names and a 10-word line.',
    'w46-TwoResults': '2·2·2·2·2·2. Round 1 Craft/Honesty 1: the https:// chip was ringed in teal (teal means fixed); now a neutral dark chip. Group moved down to centre. Gate 4 (fresh eyes): the blurred left pane read as the broken one and the spinner as “loading”; now both panes are full brightness, address bars large, and the right pane shows an empty padlock.',
    'w46-Warning': '2·2·2·2·2·2. Round 1 Clarity 1: the notebook was too small to read the strike; now larger, overlapping the page’s empty corner.',
    'w46-Silence': '2·2·2·2·2·2. Rings raised slightly so they read at all.',
    'w46-Door': '2·2·2·2·2·2. Headline size trimmed so “two things” doesn’t orphan.',
    'w46-Honest': '2·2·2·2·2·2. Round 1 Craft 1: top-heavy; card and checker centred and the checker widened.',
    'w46-Once': '2·2·2·2·2·2. Gate 4 (fresh eyes): the finished sheet appeared before Step 1 built it; the sheet is now empty, headers only.',
    'w46-List': '2·2·2·2·2·2. Round 1: seven rows pushed the footer below y 950; now six, labels moved closer to their columns.',
    'w46-Columns': '2·2·2·2·2·2. Round 1: two lines (headline plus caption) crowded the frame; one headline now carries both halves. Gate 4 (fresh eyes): Tag had only an underline; it now carries the three chips and half the headline.',
    'w46-Import': '2·2·2·2·2·2. Round 1 Clarity 1: the dialog was 16 px type inside the scaled dashboard; it now docks forward at 1.45×.',
    'w46-Fix': '2·2·2·2·2·2. Same dock fix as Import.',
    'w46-Review': '2·2·2·2·2·2. Same dock fix; the plan-usage line is left out (no plan claims).',
    'w46-PointDNS': '2·2·2·2·2·2. The Cloudflare row is ringed so “automatically” has a picture.',
    'w46-Padlocks': '2·2·2·2·2·2. Round 1: doors bunched left; now spread across the frame.',
    'w46-Knocks': '2·2·2·2·2·2. Caption narrowed so it doesn’t leave a one-word line. Gate 4 (fresh eyes): same layout as Door (door left, text right); mirrored. The sticky now says “drop list?” so it can’t read as “nearly dropped by accident”.',
    'w46-Price': '2·2·2·2·2·2. Gate 4 (fresh eyes): Make an offer was already on the Act C lander, so nothing changed; the early lander now only says “Write to us”, the price shows as a PRICE chip, and the headline is the beat’s.',
    'w46-Quiet': '2·2·2·2·2·2. Bracket pulled inside the gutter.',
    'w46-ByTag': '2·2·2·2·2·2. Same dock fix as Import.',
    'w46-Recap': '2·2·2·2·2·2. Round 1 Clarity 1: the marks were too small; enlarged.',
    'w46-YourNames': '2·2·2·2·2·2. Door floors aligned. Gate 4 (fresh eyes): kipzoo, lit and knocking, answered the question; it now steps back and the viewer’s four doors stay closed. The aside is a larger chip (not a separate frame, to hold the budget).',
    'w46-EndCard': '2·2·2·2·2·2. Round 1: the line ran into the right half; set on three lines. Gate 4 (fresh eyes): “Hundreds of domains. One file.” repeated the title; now “Every door. Open.”, which closes the motif. The QR stays a labelled slot, as the brief requires.',
    'w46-System': 'Board.',
    'w46-Sound': 'Board.',
}


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
        c['notes'][rid] = {'kind': 'title1', 'maxW': min(14000, max(3920, 2000 * len(files) - 80)), 'page': 'w46', 'text': text, 'w': 240, 'x': 0, 'y': y - 260}
        for k, f in enumerate(files):
            c['boards'][f + '.dc.html'] = {'h': 1080, 'page': 'w46', 'title': META[f][0], 'w': 1920, 'x': 2000 * k, 'y': y}
            c['notes'][f + '-note'] = {'maxH': 640, 'page': 'w46', 'size': 24, 'text': sticky(f), 'w': 1180, 'x': 2000 * k, 'y': y + 1120}
        y += 2300
    for _, _, files in ROWS:
        for f in files:
            c['order'].append(f + '.dc.html')
    c['notes']['w46about'] = {'fill': 'teal', 'maxH': 1100, 'page': 'w46', 'size': 40, 'w': 900, 'x': 3400, 'y': 0, 'text': (
        'How to Redirect Hundreds of Domains at Once (One Spreadsheet) · W46 · key-frame pass for Review 2.\n\n'
        'The kipzoo.com thread: one of Glomvo’s names (A), the name the founder types and leaves (C), a row in the sheet (E), 63 visits and last year’s drop list, then a real price (F), the door in the closing question (G). Always the same white tile and the same mono address.\n\n'
        'The motif: every name is a door that has to open properly, padlock included; a visit is a knock Glomvo needs to hear. It hides in every tile as a small arched slot, is born at beat 11 (Door), opens on every name at beat 24 (Padlocks), knocks in Act F and asks its question in G.\n\n'
        'Files: youtube/02_videos/2026-W46_bulk-domain-redirects/ in redirhub/reels (branch yt/w46-keyframes): keyframes.md, script-deltas.md, open-questions.md, review.md.')}
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
