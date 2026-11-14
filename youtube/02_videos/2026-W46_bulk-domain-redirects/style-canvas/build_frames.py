#!/usr/bin/env python3
"""W46 key frames: writes style-canvas/project/w46-*.dc.html from shared props.

    python3 youtube/02_videos/2026-W46_bulk-domain-redirects/style-canvas/build_frames.py [names...]

Every frame is literal .dc.html markup (no {{holes}}), so it renders in plain Chromium and in the canvas.
w46_base.py holds the house system (from W44), w46_props.py the cast (v6, 2026-11-13): Northway's wordmark and
homepage, its domains (the retired product rotawick.com and the misspelling nortwaysoft.com are the two threads),
the door and knock, the product notebook, the registrars, the warning page and the spreadsheet. Every frame builds
from them, so a domain is the same object everywhere it appears. The canvas page w46 shows these frames.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from w46_props import *  # noqa: F401,F403  (w46_props re-exports w46_base)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'project')


# ================================================================ product UI pieces (labels from the live dashboard, redirhub/lviv)
def visits_card(rows, w=760, hi=TYPO, title='Domains', metric='Clicks', tabs=('Domains', 'Tags'), on=0, row_h=58, hooks=False):
    """The analytics breakdown card: tabs Domains / Tags, one row per domain with a bar and its count. hooks: each row
    is data-o="vr{i}" (a scene can sort them)."""
    top = max(v for _, v in rows) or 1
    tab = ''.join(f'<span style="display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 8px; font-size: 14px; font-weight: 600; '
                  f'{"background: #FFFFFF; color: #181D27; box-shadow: 0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0" if k == on else "color: #717680"}">{t}</span>'
                  for k, t in enumerate(tabs))
    body = ''
    for i, (n, v) in enumerate(rows):
        ring = n == hi
        rh = f' data-o="vr{i}"' if hooks else ''
        body += (f'<div{rh} style="position: relative; display: flex; align-items: center; gap: 14px; height: {row_h}px; padding: 0 20px; border-top: 1px solid #EAECF0; '
                 f'{"box-shadow: inset 0 0 0 2px " + TEAL + "; border-radius: 10px; background: rgba(32,167,149,0.06)" if ring else ""}">'
                 f'<span style="position: absolute; left: 0; top: 10px; bottom: 10px; width: {max(4, (w - 40) * v / top * 0.62):.0f}px; border-radius: 0 8px 8px 0; background: {"rgba(32,167,149,0.16)" if ring else "#F2F4F7"}"></span>'
                 f'<span style="position: relative; {MONO}; font-size: 17px; font-weight: {600 if ring else 500}; color: #181D27">{n}</span><span style="flex: 1"></span>'
                 f'<span style="position: relative; font-size: 17px; font-weight: 600; color: {"#067647" if ring else "#344054"}; font-variant-numeric: tabular-nums">{v}</span></div>')
    return (f'<div data-ui="analytics" style="width: {w}px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(16,24,40,0.05), 0 0 0 1px #EAECF0; overflow: hidden; {UI}; color: #181D27">'
            f'<div style="display: flex; align-items: center; gap: 10px; padding: 16px 20px 12px"><span style="font-size: 16px; font-weight: 600">{title}</span><span style="flex: 1"></span>'
            f'<div style="display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #F2F4F7">{tab}</div></div>'
            f'<div style="display: flex; justify-content: space-between; padding: 0 20px 8px; font-size: 13px; font-weight: 500; color: #717680"><span>Domain</span><span>{metric}</span></div>{body}</div>')


def swatch(hexv, name, role, dark=False):
    c1, c2 = (INK, INK_SOFT) if dark else (CHAR, G600)
    return (f'<div style="display: flex; align-items: center; gap: 14px"><span style="width: 64px; height: 64px; flex: none; border-radius: 16px; background: {hexv}; box-shadow: inset 0 0 0 1px rgba(16,24,40,0.10)"></span>'
            f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 22px; font-weight: 700; color: {c1}">{name}</span>'
            f'<span style="{MONO}; font-size: 17px; color: {c2}">{hexv} · {role}</span></span></div>')


def world_panel(x, y, w, h, kicker, title, body, dark=False):
    bg, tc, kc = (NIGHT, INK, INK_SOFT) if dark else ('#FFFFFF', CHAR, G500)
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; box-sizing: border-box; padding: 44px 48px; border-radius: 32px; background: {bg}; box-shadow: {SOFT_SHADOW}; overflow: hidden">'
            f'<span style="font-size: 20px; font-weight: 700; letter-spacing: 0.14em; color: {kc}">{kicker}</span>'
            f'<div style="font-size: 48px; font-weight: 800; letter-spacing: -0.03em; margin: 8px 0 28px; color: {tc}">{title}</div>{body}</div>')


def lock_url(text, size=19):
    return f'{LOCK}<span>{text}</span>'


def home_browser(w=980, h=600, shadow=SOFT_SHADOW, url=MAIN, extra_bar=''):
    """Northway's homepage in a browser, padlock and all."""
    return browser2(lock_url(f'https://{url}') + extra_bar, homepage(w, h), None, None, w, h, shadow=shadow)


def typing_browser(w=900, h=420, text=RETIRED, caret=True, shadow=SOFT_SHADOW, body=''):
    """The customer's browser: nothing but the address bar being typed into (a generic browser, no brand)."""
    car = f'<span style="width: 2px; height: 22px; background: {CHAR}"></span>' if caret else ''
    inner = body or f'<div style="height: {h - 64}px; background: #FFFFFF"></div>'
    return browser2(f'<span style="color: #181D27">{text}</span>{car}', inner, None, None, w, h, shadow=shadow)


# ================================================================ the world board
@F('w46-World', 'The story world')
def _world():
    g = NORTHWAY
    W = 3280
    note = lambda t, c=G700: f'<span style="font-size: 24px; line-height: 1.5; color: {c}">{t}</span>'
    dnote = lambda t: note(t, INK_SOFT)
    mono = lambda t: f'<span style="{MONO}">{t}</span>'

    # 1 · Northway
    team = (f'<div style="display: flex; gap: 60px; align-items: flex-start"><div style="display: flex; flex-direction: column; gap: 34px; width: 520px">'
            f'<div data-shop style="padding: 48px 44px; border-radius: 24px; background: {g["paper"]}; box-shadow: inset 0 0 0 1px {g["line"]}">{northway_logo(72)}</div>'
            + note('A small software company: scheduling, rosters and notes for clinics. You are its owner. The wordmark is type only (Instrument Serif, “software” in small tracked capitals): premium, quiet, never louder than RedirHub around it.')
            + f'<div data-shop style="display: flex; gap: 14px">' + ''.join(f'<span style="width: 56px; height: 56px; border-radius: 14px; background: {c}; box-shadow: inset 0 0 0 1px rgba(16,24,40,0.12)"></span>' for c in g.values()) + '</div>'
            + f'<span style="{MONO}; font-size: 18px; color: {G600}">ink #1B2333 · paper #F6F5F1 · line #E4E2DC · slate #7C8596</span></div>'
            f'<div style="display: flex; flex-direction: column; gap: 18px">{home_browser(820, 520)}'
            f'<span style="font-size: 22px; font-weight: 600; color: {G600}">The one website, {mono(MAIN)}: where every domain goes after the move.</span></div></div>')

    # 2 · the domains
    wall = ''.join(name_tile(n, 430) for n in WALL)
    wall = (f'<div style="display: grid; grid-template-columns: repeat(3, 430px); gap: 22px">{wall}</div>'
            f'<span style="display: block; margin-top: 30px">' + note(f'Products, countries, misspellings and the old name, from before the rebrand. Every domain is invented and DNS-checked on 12 Nov 2026 (open-questions.md, D); {mono("northway.com")} is live, so the site is {mono(MAIN)}.') + '</span>')

    # 3 · the two threads
    stick = (f'<div style="position: relative; width: 470px; height: 190px">{place(0, 60, name_tile(TYPO, 440, visits=63))}'
             f'{place(270, 0, sticky("drop at renewal?", 230, strike=True))}</div>')
    thread_items = [
        ('B', 'A product retired years ago', name_tile(RETIRED, 440)),
        ('C', 'A customer types it', typing_browser(560, 150, body=f'<div style="height: 86px; background: #FFFFFF"></div>')),
        ('E', 'A row in the file', sheet(560, rows=sheet_rows()[:1], show_more=False, row_h=52)),
        ('F', 'Northway without the h: 63 visits', f'<div style="display: flex; flex-direction: column; gap: 14px">{stick}{ex_label()}</div>'),
        ('G', 'Connected at last', recap_hosts_row(RETIRED)),
    ]
    thread = (f'<div style="display: flex; gap: 46px; align-items: flex-start">'
              + ''.join(f'<div style="display: flex; flex-direction: column; gap: 18px"><span style="font-size: 22px; font-weight: 800; color: {TEAL}">{a}</span>'
                        f'<span style="font-size: 24px; font-weight: 700; color: {CHAR}">{b}</span>{c}</div>' for a, b, c in thread_items) + '</div>'
              + f'<span style="display: block; margin-top: 34px; width: 2900px">' + note(f'Two domains carry the story, each always the same white tile in JetBrains Mono. {mono(RETIRED)}, a retired product, is the one people still type (B), the customer who meets a warning page (C), a row in the file (E) and, in the summary, one of the hostnames connected at last (G). {mono(TYPO)}, “Northway without the h”, is the misspelling with 63 visits that had nearly been dropped (F). The narrator never reads a domain aloud.') + '</span>')

    # 4 · the motif (dark panel)
    st = [('closed', 0, '1 · Closed', 'A domain with nowhere safe to go: a thin outline, the padlock unlit.'),
          ('open', 0, '2 · Open, padlock lit', 'The fix: the arch fills with teal light, the padlock solid. Opens properly.'),
          ('open', 3, '3 · A knock', 'Someone came looking: three arcs leave the door. Northway hears it.'),
          ('broken', 0, 'Reference only · Broken', 'Red, the shackle sprung. Not used in any frame: the warning page carries that moment.')]
    motif = (f'<div style="display: flex; gap: 70px; align-items: flex-start">'
             + ''.join(f'<div style="display: flex; flex-direction: column; gap: 22px; width: {440 if k else 300}px">{door(200, s_, knock=k)}'
                       f'<span style="font-size: 26px; font-weight: 800; color: {INK}">{t}</span><span style="font-size: 21px; line-height: 1.45; color: {INK_SOFT}">{d}</span></div>' for s_, k, t, d in st)
             + '</div>'
             + f'<span style="display: block; margin-top: 34px; width: 2900px">' + dnote('Every domain is a door that has to open properly, padlock included; a visit is a knock Northway needs to hear. Born at “Every domain needed two things” (beat 13), paid off in “Hearing the knock” (F). The film then leaves it: the summary and the question are about the method and the viewer’s own list. Drawn, never cartoon: no handle, hinges or wood. The move “knock” means only one thing: someone came looking.') + '</span>')

    # 5 · the notebook and the customer
    people = (f'<div style="display: flex; gap: 50px; align-items: flex-start">'
              f'<div style="padding: 10px">{scaled(notebook(1400, 760), 0.62, 1400, 760)}</div>'
              f'<div style="display: flex; flex-direction: column; gap: 26px; width: 560px">{typing_browser(560, 300)}'
              + note('Never a face or a person. The habit is a product notebook (the plan starts with “the domain”); the customer is a browser and an address bar.')
              + '</div></div>')

    # 6 · the warning page
    warn = (f'<div style="display: flex; flex-direction: column; gap: 24px">{browser2(bar_url(f"https://{RETIRED}", broken=True), warning_page(900, 500), None, None, 900, 500, shadow=SOFT_SHADOW)}'
            + note('Generic wording, no browser’s colours, icon or layout. The only place Signal Red appears in the film.') + '</div>')

    # 7 · three registrar accounts
    regs = (f'<div style="display: flex; gap: 26px; align-items: flex-start">'
            f'{registrar("a", [RETIRED, "clinvane.com", "northwaysoft.de"], w=420, label="Registrar A")}'
            f'{registrar("b", ["rostavia.com", "northwaysoft.fr", TYPO], w=420, label="Registrar B")}'
            f'{registrar("c", ["notevane.com", "northwaysft.com", OLD], w=420, label="Registrar C")}</div>'
            + f'<span style="display: block; margin-top: 30px">' + note('Three unbranded forwarding forms, three neutral styles (card, dark header, dense table): the accounts the domains were bought in. No logo, colour or copy from any real registrar.') + '</span>')

    # 8 · the spreadsheet
    chips = ''.join(tag_chip(t, 22) for t in ('Product', 'Country', 'Typo'))
    sheet_b = (f'{sheet(1340, rows=sheet_rows()[:5])}<div style="display: flex; align-items: center; gap: 18px; margin-top: 30px">{chips}'
               f'<span style="margin-left: 20px">' + note('The real import columns: source_url, destination, type (301), tags. Generic grid, no spreadsheet app’s look.') + '</span></div>')

    # 9 · visits
    vis_rows = [(TYPO, 63), ('clinvane.com', 21), ('northwaysoft.de', 9), ('rostavia.com', 4), (OLD, 0)]
    visits = (f'<div style="display: flex; gap: 40px; align-items: flex-start"><div style="display: flex; flex-direction: column; gap: 16px">{visits_card(vis_rows, 640)}{ex_label()}</div>'
              f'<div style="width: 340px">' + note('The analytics Domains card, as in the dashboard (Inter, product blue reserved). Counts labelled Example. The VO says “visits”; the card’s real label is Clicks (open-questions.md).') + '</div></div>')

    rules = ('<ul style="margin: 0; padding-left: 28px; display: flex; flex-direction: column; gap: 14px; font-size: 24px; line-height: 1.45; color: #344054">'
             '<li>No face or realistic person: a notebook and a browser stand in.</li>'
             '<li>No real company’s domain, logo, colour or copy for any registrar, browser or Cloudflare. “Cloudflare” appears only as a plain word, in Connect DNS (the dashboard’s own copy).</li>'
             '<li>No dollar figure, price, plan name or free-plan wording. No step labels or numbered steps: the how-to grows out of the story.</li>'
             '<li>Northway’s palette and Instrument Serif stay on Northway’s own things. Teal means fixed; Signal Red lives only on the warning page; amber at most once a frame; product blue only in product UI.</li>'
             '<li>Nothing tilts, spins or bounces.</li></ul>')
    inner = (f'<div style="position: absolute; left: 120px; top: 100px; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {G500}">W46 · CAST, PROPS AND MOTIF</span>'
             f'<span style="font-size: 88px; font-weight: 800; letter-spacing: -0.04em; color: {CHAR}">The story world.</span></div>'
             + world_panel(120, 340, 1560, 820, 'YOUR COMPANY', 'Northway', team)
             + world_panel(1760, 340, 1400, 820, 'THE DOMAINS', 'Over two hundred, piled up', wall)
             + world_panel(120, 1240, 3040, 820, 'THE THREADS', 'Two domains, the same objects everywhere', thread)
             + world_panel(120, 2140, 3040, 900, 'THE MOTIF', 'A door, and a knock', motif, dark=True)
             + world_panel(120, 3120, 1560, 760, 'THE PEOPLE', 'A notebook and a browser', people)
             + world_panel(1760, 3120, 1400, 760, 'THE WARNING', 'What the customer saw', warn)
             + world_panel(120, 3960, 1440, 800, 'BEFORE', 'Three registrar accounts', regs)
             + world_panel(1640, 3960, 1520, 800, 'THE LIST', 'One row per domain', sheet_b)
             + world_panel(120, 4840, 1560, 640, 'HEARING THE KNOCK', 'Visits, by domain', visits)
             + world_panel(1760, 4840, 1400, 640, 'WORLD RULES', 'What never appears', rules))
    H = 5600
    return (f'<div style="width: {W}px; height: {H}px; box-sizing: border-box; position: relative; overflow: hidden; background: linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%); {JAK}; color: {CHAR}">{inner}</div>', W, H)


# ================================================================ ACT A · Your company
@F('w46-Notebook', 'Buy the domain first')
def _notebook():
    nb = scaled(notebook(1400, 760), 1.0, 1400, 760)
    inner = (f'<div style="position: absolute; left: 260px; top: 150px">{nb}</div>')
    return frame('evening', inner)


@F('w46-Northway', 'Meet Northway')
def _northway():
    g = NORTHWAY
    tiles = ''.join(name_tile(n, 310, extra=f' data-o="t{i}"') for i, n in enumerate(WALL))
    inner = (f'<div data-shop style="position: absolute; left: 120px; top: 300px; padding: 56px 52px; border-radius: 28px; background: {g["paper"]}; box-shadow: inset 0 0 0 1px {g["line"]}">{northway_logo(78)}</div>'
             + caption('Over two hundred domains, and counting.', y=600, x=120, w=600, size=44, color=CHAR)
             + f'<div style="position: absolute; left: 820px; top: 250px; display: grid; grid-template-columns: repeat(3, 310px); gap: 20px">{tiles}</div>')
    return frame('light', inner)


ONE_SITE = [PRODUCTS[0], PRODUCTS[1], COUNTRIES[0], COUNTRIES[1], TYPO, OLD]


@F('w46-OneSite', 'One website, every product')
def _onesite():
    """New in v6 (beat 4): six of the domains each draw a line into Northway's one website."""
    tiles = ''.join(place(120, 230 + i * 104, name_tile(n, 330, extra=f' data-o="s{i}"')) for i, n in enumerate(ONE_SITE))
    ends = [230 + i * 104 + 44 for i in range(6)]
    lines = ''.join(f'<path data-draw="w{i}" d="M0 {y - 200}C160 {y - 200} 200 360 360 360"></path>' for i, y in enumerate(ends))
    svg = (f'<svg style="position: absolute; left: 470px; top: 200px" width="380" height="720" viewBox="0 0 380 720" aria-hidden="true" fill="none" stroke="{G400}" stroke-width="3" stroke-linecap="round">'
           f'{lines}<path data-o="whead" d="M344 346l18 14-18 14"></path></svg>')
    inner = (tiles + svg + f'<div style="position: absolute; left: 860px; top: 270px">{home_browser(940, 560)}</div>'
             + caption('One website, every product.', x=860, y=150, w=940, size=48, color=CHAR))
    return frame('light', inner)


@F('w46-Title', 'Title card')
def _title():
    inner = (f'<div style="position: absolute; left: 120px; top: 250px; width: 840px; display: flex; flex-direction: column; gap: 26px">'
             f'<span style="font-size: 92px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em">How to redirect hundreds of domains at once</span>'
             f'<span style="font-size: 44px; font-weight: 700; letter-spacing: -0.02em; color: rgba(255,255,255,0.86)">with one spreadsheet</span></div>'
             + scaled(sheet(960, rows=sheet_rows()[:6]), 0.76, 1016, 560, x=1020, y=300))
    return frame('sweep', inner)


# ================================================================ ACT B · The quiet pile
@F('w46-Renewals', 'Every domain renews')
def _renewals():
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    names = [('clinvane.com', 2), (RETIRED, 4), ('northwaysoft.de', 0), (TYPO, 8), ('rostavia.com', 5), ('northwaysoft.fr', 10), (OLD, 7), ('notevane.com', 1)]
    x0, cw, y0, rh = 520, 106, 360, 62
    head = ''.join(f'<span style="position: absolute; left: {x0 + i * cw}px; top: {y0 - 50}px; width: {cw}px; text-align: center; font-size: 20px; font-weight: 700; color: {G500}">{m}</span>' for i, m in enumerate(months))
    rows = ''
    for k, (n, m) in enumerate(names):
        y = y0 + k * rh
        rows += (f'<span style="position: absolute; left: 120px; top: {y + 14}px; {MONO}; font-size: 24px; font-weight: 600; color: {CHAR}">{n}</span>'
                 f'<span style="position: absolute; left: {x0}px; top: {y + rh // 2}px; width: {12 * cw}px; height: 2px; background: {G200}"></span>'
                 f'<span style="position: absolute; left: {x0 + m * cw + 16}px; top: {y + 10}px; height: 40px; padding: 0 14px; border-radius: 20px; background: #1E2A44; color: #FFFFFF; '
                 f'display: inline-flex; align-items: center; font-size: 17px; font-weight: 700; white-space: nowrap">Renews</span>')
    rows += f'<span style="position: absolute; left: 120px; top: {y0 + len(names) * rh + 12}px; font-size: 22px; font-weight: 600; color: {G500}">… and every other domain, every year</span>'
    inner = headline('Every domain renews.', y=150, size=72) + head + rows
    return frame('light', inner)


@F('w46-Accounts', 'Three registrar accounts')
def _accounts():
    """Was w46-Parking (v4). A generic registrar forwarding settings card, and one line: where the forwards live."""
    card = scaled(registrar('b', [RETIRED, 'clinvane.com', 'northwaysoft.de', TYPO, OLD], w=520, label='Registrar B'), 1.45, 520, 262, x=120, y=330)
    line = (f'<div style="display: flex; flex-direction: column; gap: 18px"><span style="font-size: 24px; font-weight: 700; letter-spacing: 0.12em; color: {INK_SOFT}">FORWARDING</span>'
            f'<span style="font-size: 56px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.12">Three registrar accounts. Set up years ago.</span></div>')
    inner = card + f'<div style="position: absolute; left: 960px; top: 330px; width: 840px">{line}</div>'
    return frame('charcoal', inner)


@F('w46-Weight', 'Which ones do people still type?')
def _weight():
    others = [n for n in WALL if n != RETIRED] + ['northwaysoft.es', 'northwaysoft.nl', 'nrthwaysoft.com']
    cyc = iter(others)
    tiles = ''
    for r in range(3):
        for c in range(5):
            x, y = 120 + c * 340, 230 + r * 120
            tiles += place(x, y, name_tile(RETIRED, 310) if (r, c) == (1, 2) else name_tile(next(cyc), 310, dim=True))
    dx, dy = 120 + 2 * 340 + 290, 230 + 120 - 30
    dot = (f'<div style="position: absolute; left: {dx - 40}px; top: {dy - 40}px; width: 136px; height: 136px; border-radius: 50%; background: radial-gradient(closest-side, rgba(229,148,38,0.35), rgba(229,148,38,0))"></div>'
           f'<div style="position: absolute; left: {dx}px; top: {dy}px; width: 56px; height: 56px; border-radius: 50%; background: {AMBER}"></div>')
    inner = tiles + dot + caption('Which ones do people still type?', y=700, size=48, x=120, w=1500)
    return frame('evening', inner)


# ================================================================ ACT C · The visitor nobody sees
@F('w46-TwoResults', 'Two addresses, two results')
def _two():
    pad = (f'<div style="height: 406px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px">'
           f'<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="{G400}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>'
           f'<span style="font-size: 22px; font-weight: 600; color: {G500}">Secure version first…</span></div>')
    left = (f'<div style="position: absolute; left: 120px; top: 220px; display: flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 700; color: {INK_SOFT}">'
            f'{check(36, fill="rgba(255,255,255,0.18)")}Northway checked the plain address</div>'
            f'<div style="position: absolute; left: 120px; top: 300px; opacity: 0.82">{browser2(f"<span style=\"color: #181D27\">{RETIRED}</span>", homepage(760, 470), None, None, 760, 470, shadow=DARK_SHADOW, bar=76, size=26)}</div>')
    https = f'<span style="color: #181D27; font-weight: 700">https://</span><span style="color: #181D27">{RETIRED}</span>'
    right = (f'<div style="position: absolute; left: 960px; top: 220px; font-size: 28px; font-weight: 700; color: {INK}">The customer’s browser asks for the padlock</div>'
             + browser2(https, pad, 960, 300, 840, 470, shadow=DARK_SHADOW, bar=76, size=26))
    inner = left + right + caption('Some registrars include a padlock with forwarding. Others don’t.', y=840, size=38)
    return frame('evening', inner)


@F('w46-Warning', 'The customer leaves')
def _warning():
    inner = (browser2(bar_url(f'https://{RETIRED}', broken=True), warning_page(1200, 680), None, None, 1200, 680)
             .replace('position: relative; width: 1200px', 'position: absolute; left: 360px; top: 190px; width: 1200px'))
    return frame('evening', inner)


@F('w46-Silence', 'Northway never finds out')
def _silence():
    arc = ''.join(f'<span style="position: absolute; left: {960 - r}px; top: {470 - r}px; width: {2 * r}px; height: {2 * r}px; border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(255,255,255,{op})"></span>'
                  for r, op in ((300, 0.09), (420, 0.05)))
    inner = (arc + place(700, 425, name_tile(RETIRED, 520))
             + caption('Northway never finds out.', y=760, size=44, color=INK_SOFT))
    return frame('evening', inner)

# ================================================================ ACT D · The way out
@F('w46-Door', 'A door, and a knock')
def _door():
    items = ''.join(f'<div data-o="item{n}" style="display: flex; gap: 22px; align-items: baseline"><span style="font-size: 40px; font-weight: 800; color: {TEAL}">{n}</span>'
                    f'<span style="font-size: 46px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15">{t}</span></div>'
                    for n, t in (('1', 'A door that opens properly, padlock included.'), ('2', 'A way to hear when someone knocks.')))
    inner = (place(210, 190, door(390, 'open', knock=3, label=RETIRED))
             + headline('Every domain needed two things.', x=880, y=260, size=58, w=920)
             + f'<div style="position: absolute; left: 880px; top: 440px; width: 900px; display: flex; flex-direction: column; gap: 40px">{items}</div>')
    return frame('charcoal', inner)


def checker_card(url='https://clinvane.com', w=820):
    hop = lambda k, u, code, ok: (f'<div data-o="hop{k}" style="display: flex; align-items: center; gap: 16px; height: 64px; padding: 0 22px; border-top: 1px solid #EAECF0">'
                                   f'<span style="width: 30px; height: 30px; border-radius: 50%; background: #F2F4F7; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #475467">{k}</span>'
                                   f'{LOCK}<span style="{MONO}; font-size: 18px; color: #181D27">{u}</span><span style="flex: 1"></span>'
                                   f'<span style="font-size: 14px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: {"#ECFDF3" if ok else "#E8F0F8"}; color: {"#067647" if ok else "#1C6DB6"}">{code}</span></div>')
    return (f'<div data-ui="checker" style="width: {w}px; border-radius: 20px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; overflow: hidden; {UI}; color: #181D27">'
            f'<div style="padding: 24px 22px 18px; display: flex; flex-direction: column; gap: 14px"><span style="font-size: 18px; font-weight: 600">Redirect Checker</span>'
            f'<div style="display: flex; gap: 10px"><div style="{INP}; flex: 1; {MONO}; font-size: 17px">{url}</div><span style="{BTN_P}; height: 42px">Check</span></div></div>'
            + hop(1, url, '301', False) + hop(2, f'https://{MAIN}/{url.split("//")[1].split(".")[0]}', '200', True) + '</div>')


@F('w46-Honest', 'One honest note')
def _honest():
    inner = (tip('ONE HONEST NOTE', 'A handful of domains, and the padlock shows? You’re done.', 'Check one in our free Redirect Checker.', 120, 360, w=660)
             + f'<div style="position: absolute; left: 900px; top: 380px; display: flex; flex-direction: column; gap: 18px">{checker_card(w=880)}{ex_label()}</div>')
    return frame('light', inner)


@F('w46-Once', 'Two hundred domains, one file')
def _once():
    regs = (registrar('a', [RETIRED, 'clinvane.com', 'northwaysoft.de'], 120, 230, 470, 'Registrar A')
            + registrar('b', ['rostavia.com', 'northwaysoft.fr', TYPO], 120, 450, 470, 'Registrar B')
            + registrar('c', ['notevane.com', 'northwaysft.com', OLD], 120, 670, 470, 'Registrar C'))
    arrow = (f'<svg style="position: absolute; left: 640px; top: 300px" width="200" height="520" viewBox="0 0 200 520" aria-hidden="true" fill="none" stroke="{G400}" stroke-width="3" stroke-linecap="round">'
             '<path data-draw="l1" d="M0 30C90 30 100 260 180 260"></path><path data-draw="l2" d="M0 260H180"></path><path data-draw="l3" d="M0 490C90 490 100 260 180 260"></path>'
             '<path data-o="head" d="M164 246l18 14-18 14"></path></svg>')
    empty = [('', '', '', '')] * 6
    inner = (regs + arrow + scaled(sheet(960, rows=empty, show_more=False), 0.9, 1016, 560, x=880, y=300)
             + caption('Two hundred domains. One file.', x=880, y=200, w=920, size=44, color=CHAR))
    return frame('light', inner)


# ================================================================ ACT E · One spreadsheet
def col_label(text, x, y, w, sub=None):
    s = f'<span style="font-size: 22px; font-weight: 600; color: {G600}">{sub}</span>' if sub else ''
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; display: flex; flex-direction: column; gap: 4px; padding-bottom: 10px; border-bottom: 3px solid {TEAL}">'
            f'<span style="font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: {CHAR}">{text}</span>{s}</div>')


SW = 1560


def big_sheet(hi_col, hi_row=None):
    return place(122, 360, sheet(SW, rows=sheet_rows()[:6], hi_col=hi_col, hi_row=hi_row, row_h=56, hooks=True))


def col_x(k):
    widths = [0.24, 0.42, 0.11, 0.23]
    return 122 + 56 + sum(SW * p for p in widths[:k]), SW * widths[k]


@F('w46-List', 'One row per domain')
def _list():
    (ax, aw), (bx, bw) = col_x(0), col_x(1)
    inner = (headline('One row per domain.', y=150, size=64)
             + col_label('The domain', ax, 280, aw - 20) + col_label('Where it should go', bx, 280, bw - 20)
             + big_sheet([0, 1]) + place(1680, 900, ex_label()))
    return frame('light', inner)


@F('w46-Columns', 'A 301 and a tag')
def _columns():
    (cx, cw), (dx, dw) = col_x(2), col_x(3)
    chips = ''.join(f'<span data-o="chip{i}" style="display: inline-flex">{tag_chip(t, 17)}</span>' for i, t in enumerate(('Product', 'Country', 'Typo')))
    inner = (headline('<span data-o="h1" style="display: inline-block">A 301, because these moves are for good.</span> <span data-o="h2" style="display: inline-block">A tag, for the group.</span>', y=150, size=48, w=1680)
             + col_label('301', cx, 280, cw - 10) + f'<div style="position: absolute; left: {dx:.0f}px; top: 278px; display: flex; gap: 10px">{chips}</div>'
             + f'<span data-o="uline" style="position: absolute; left: {dx:.0f}px; top: 334px; width: {dw - 20:.0f}px; height: 3px; background: {TEAL}"></span>'
             + big_sheet([2, 3]) + place(1680, 900, ex_label()))
    return frame('light', inner)


def links_rows(n=7, sel=False, tagf=None):
    rows = sheet_rows()[:n]
    out = ''
    for src, dst, typ, tg in rows:
        if tagf and tg != tagf:
            continue
        box = (f'<span style="width: 18px; height: 18px; border-radius: 5px; flex: none; {"background: #1C6DB6" if sel else "box-shadow: inset 0 0 0 1.5px #D5D7DA"}"></span>')
        out += (f'<div style="display: flex; align-items: center; gap: 16px; height: 52px; padding: 0 20px; border-bottom: 1px solid #EAECF0; background: #FFFFFF">{box}'
                f'<span style="{MONO}; font-size: 15px; width: 210px; color: #181D27">{src}</span><span style="color: #98A2B3">→</span>'
                f'<span style="{MONO}; font-size: 14px; flex: 1; color: #475467; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{dst.replace("https://", "")}</span>'
                f'<span style="font-size: 12px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: #E8F0F8; color: #1C6DB6">{typ}</span>{tag_chip(tg, 12)}</div>')
    return out


def links_page(extra_top=''):
    return f'<div style="flex: 1; display: flex; flex-direction: column; padding: 18px 24px; gap: 0">{extra_top}<div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{links_rows()}</div></div>'


def modal(inner, w=760, top=40):
    """A dialog card: docked forward over the dimmed dashboard by dash_with_modal (dock = now the context)."""
    return (w, top, f'<div style="width: {w}px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 30px 80px rgba(16,24,40,0.35), 0 0 0 1px rgba(16,24,40,0.08); overflow: hidden; {UI}; color: #181D27">{inner}</div>')


def dash_with_modal(active, crumbs, body, m, s=1.15, y=170, ms=1.45):
    w, top, card = m
    sh = shell(active, crumbs, f'<span style="{BTN_P}">Create</span>', body)
    scrim = '<div style="position: absolute; inset: 0; background: rgba(16,24,40,0.45)"></div>'
    x = round(120 + 1400 * s / 2 - w * ms / 2)
    return (dashboard(f'<div style="position: relative; width: 1400px; height: 633px">{sh}{scrim}</div>', 120, y, s, 1400, 633)
            + scaled(card, ms, w, 600, x=x, y=y + top, extra=' data-ui="dialog"'))


def chooser():
    card = lambda t, d=None, ex=None, on=False: (
        f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; border-radius: 12px; box-shadow: inset 0 0 0 1px #EAECF0; background: #FFFFFF">'
        f'<span style="font-size: 15px; font-weight: 600; color: #181D27">{t}</span>'
        + (f'<span style="font-size: 13px; color: #535862; line-height: 1.4">{d}</span>' if d else '<span style="width: 80%; height: 9px; border-radius: 5px; background: #F2F4F7"></span><span style="width: 55%; height: 9px; border-radius: 5px; background: #F2F4F7"></span>')
        + (f'<span style="{MONO}; font-size: 12px; color: #717680">{ex}</span>' if ex else '') + '</div>')
    grid = (f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 24px">{card("Branded Link")}{card("Dynamic QR Code")}'
            f'{card("Domain Redirect", "Redirect a domain, subdomain or path — 301 or 302.", "old-acme.com → acme.com")}{card("Website Migration")}</div>')
    return (f'<div style="padding: 22px 24px 16px; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 18px; font-weight: 600; color: #181D27">What do you want to create?</span>'
            f'<span style="font-size: 14px; color: #535862">Pick the job. Everything you create here is managed together in Links.</span></div>{grid}'
            f'<div style="margin-top: 18px; padding: 16px 24px; border-top: 1px solid #EAECF0; background: #F9FAFB; font-size: 14px; color: #535862">Already have a spreadsheet of links? '
            f'<span style="font-weight: 600; color: #1C6DB6; box-shadow: 0 0 0 3px rgba(32,167,149,var(--ring-csv, 1)); border-radius: 6px; padding: 3px 6px">Import CSV</span></div>')


@F('w46-Import', 'Import CSV')
def _import():
    m = modal(chooser(), 640, 70)
    inner = (dash_with_modal('Links', ['Links'], links_page(), m)
             + caption('CSV: the plain spreadsheet file Excel or Google Sheets can save.', y=910, size=28, color=G600))
    return frame('light', inner)


def errors_step():
    return (f'<div style="padding: 22px 24px 14px; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 18px; font-weight: 600; color: #181D27">9 rows need a fix before they can import</span>'
            f'<span style="font-size: 14px; color: #535862">The other 217 rows are fine. Row numbers match your spreadsheet.</span></div>'
            f'<div data-clip="errs" data-o="errs" style="margin: 4px 24px 0; padding: 16px 18px; border-radius: 12px; box-shadow: inset 0 0 0 1px #FECDCA; background: #FEF3F2; display: flex; flex-direction: column; gap: 12px">'
            f'<span style="font-size: 15px; font-weight: 600; color: #B42318">Destination must start with https:// or http://.</span>'
            f'<span style="font-size: 13px; color: #535862">e.g. <span style="{MONO}; color: #181D27">northwaysoft.com/fr</span></span>'
            f'<span data-o="btn" style="{BTN_P}; align-self: flex-start; box-shadow: 0 0 0 4px rgba(32,167,149,var(--ring-fix, 1))">Add https:// to all 9</span></div>'
            f'<div style="margin-top: 18px; padding: 14px 24px; border-top: 1px solid #EAECF0; display: flex; gap: 10px; align-items: center; font-size: 13px">'
            f'<span style="{BTN_S}; height: 34px; font-size: 13px">Download the rows with a note on each</span><span style="{BTN_S}; height: 34px; font-size: 13px">Upload fixed file</span>'
            f'<span style="flex: 1"></span><span style="font-weight: 600; color: #535862">Skip 9 rows and review</span></div>')


@F('w46-Fix', 'One click fixes them all')
def _fix():
    m = modal(errors_step(), 660, 110)
    inner = (dash_with_modal('Links', ['Links', 'Import CSV'], links_page(), m)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


def review_step():
    row = lambda a, b, c: (f'<div style="display: grid; grid-template-columns: 1fr 80px 120px; padding: 9px 0; border-top: 1px solid #EAECF0; font-size: 14px; color: #344054">'
                           f'<span>{a}</span><span style="text-align: right">{b}</span><span style="text-align: right">{c}</span></div>')
    return (f'<div style="padding: 20px 24px 10px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 18px; font-weight: 600; color: #181D27">Adds 214 domains and 214 links, updates 0 links</span>'
            f'<div><div style="display: grid; grid-template-columns: 1fr 80px 120px; padding-bottom: 6px; font-size: 12px; font-weight: 500; color: #717680"><span>In this file</span><span style="text-align: right">Rows</span><span style="text-align: right">New · updated</span></div>'
            + row('Whole-domain links', '226', '214 · 0') + row('Path links', '0', '0 · 0') + '</div>'
            f'<div style="display: flex; gap: 12px; padding: 12px 14px; border-radius: 12px; box-shadow: 0 0 0 3px rgba(32,167,149,var(--ring-www, 1))"><span style="width: 18px; height: 18px; flex: none; margin-top: 2px; border-radius: 5px; background: #1C6DB6"></span>'
            f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 14px; font-weight: 600; color: #181D27">Leave out 12 www rows their root already covers</span>'
            f'<span style="font-size: 13px; color: #535862; line-height: 1.45"><span style="{MONO}">{RETIRED}</span> covers <span style="{MONO}">www.{RETIRED}</span> automatically, so rows going to the same place add nothing.</span></div></div>'
            f'<div style="display: flex; justify-content: space-between; font-size: 14px; color: #344054"><span style="font-weight: 600">Where the links are</span><span>214 domains, 214 new</span></div>'
            f'<span style="font-size: 13px; color: #535862">214 new domains need a DNS record before their links work. They are added to Hostnames on import, so you can set DNS right after.</span></div>'
            f'<div style="padding: 12px 24px; border-top: 1px solid #EAECF0; display: flex; justify-content: flex-end; gap: 10px"><span style="{BTN_S}">Cancel</span><span style="{BTN_P}">Import 214 changes</span></div>')


@F('w46-Review', 'It shows what the file will do')
def _review():
    m = modal(review_step(), 640, 20)
    inner = (dash_with_modal('Links', ['Links', 'Import CSV'], links_page(), m)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


def hostnames_body():
    hosts = [(RETIRED, 'Waiting for DNS'), ('clinvane.com', 'Connected'), ('northwaysoft.de', 'Connected'), ('rostavia.com', 'Waiting for DNS'), ('northwaysoft.fr', 'Waiting for DNS'),
             (TYPO, 'Connected'), ('notevane.com', 'Waiting for DNS'), (OLD, 'Waiting for DNS')]
    badge = lambda s: (f'<span style="font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; '
                       + ('background: #ECFDF3; color: #067647' if s == 'Connected' else 'background: #F2F4F7; color: #475467') + f'">{s}</span>')
    waiting = [n for n, s in hosts if s != 'Connected']

    def status(n, s):
        """A waiting row can turn Connected: both badges share one grid cell (the wider one sets the layout), the
        Connected one through --conn-i (0 unset), the waiting one and its button through 1 - it."""
        if s == 'Connected':
            return badge(s) + '<span style="flex: 1"></span>'
        i = waiting.index(n)
        return (f'<span style="display: inline-grid"><span style="grid-area: 1 / 1; display: flex; opacity: calc(1 - var(--conn-{i}, 0))">{badge(s)}</span>'
                f'<span style="grid-area: 1 / 1; display: flex; justify-self: start; opacity: var(--conn-{i}, 0)">{badge("Connected")}</span></span><span style="flex: 1"></span>'
                f'<span style="{BTN_S}; height: 32px; font-size: 13px; opacity: calc(1 - var(--conn-{i}, 0))">Connect DNS</span>')
    rows = ''.join(f'<div style="display: flex; align-items: center; gap: 14px; height: 54px; padding: 0 20px; border-bottom: 1px solid #EAECF0; background: {"#F5F9FC" if n == RETIRED else "#FFFFFF"}">'
                   f'<span style="{MONO}; font-size: 15px; width: 230px; color: #181D27">{n}</span>{status(n, s)}</div>' for n, s in hosts)

    def tab(t, on):
        """The selected tab is lifted (white, a hairline, dark text); --tab-<name> moves it (unset = as drawn)."""
        v = f'var(--tab-{t.lower()}, {1 if on else 0})'
        return (f'<span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 8px; font-size: 14px; font-weight: 600; '
                f'background: rgba(255,255,255,{v}); color: color-mix(in srgb, #181D27 calc({v} * 100%), #717680); '
                f'box-shadow: 0 1px 2px rgba(16,24,40,calc(0.06 * {v})), 0 0 0 1px rgba(234,236,240,{v})">{t}</span>')
    panel = (f'<div data-o="panel" style="width: 420px; flex: none; border-left: 1px solid #EAECF0; background: #FFFFFF; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px">'
             f'<span style="font-size: 16px; font-weight: 600; color: #181D27">Connect DNS · <span style="{MONO}">{RETIRED}</span></span>'
             f'<div style="display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #F2F4F7">{tab("Automatic", True)}{tab("Manual", False)}</div>'
             # the dashboard's own copy for an automatic connection (lviv: auto-sub-body, continue-with); fact check 2026-11-14
             f'<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px; border-radius: 12px; box-shadow: 0 0 0 3px rgba(32,167,149,var(--ring-cf, 1))">'
             f'<span style="font-size: 14px; color: #535862; line-height: 1.5">Approve once at Cloudflare and it adds this record for you. About a minute, nothing to copy.</span>'
             f'<span style="{BTN_P}; height: 36px">Continue with Cloudflare</span></div></div>')
    return f'<div style="flex: 1; display: flex"><div style="flex: 1; padding: 18px 24px"><div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{rows}</div></div>{panel}</div>'


@F('w46-PointDNS', 'Point the domains')
def _point():
    sh = shell('Hostnames', ['Hostnames'], '', hostnames_body())
    inner = (dashboard(sh, 120, 170, 1.15, 1400, 633)
             + caption('A domain that is still waiting doesn’t hold up the others.', y=910, size=28, color=G600))
    return frame('light', inner)


@F('w46-Padlocks', 'Every door opens, padlock included')
def _padlocks():
    names = WALL
    doors = ''.join(place(140 + (k % 6) * 280, 250 + (k // 6) * 320, door(150, 'open', label=n, uid=str(k))) for k, n in enumerate(names))
    inner = headline('Each padlock set up, and renewed for it.', y=130, size=60, w=1600) + doors
    return frame('glow-teal', inner)


# ================================================================ ACT F · Hearing the knock
@F('w46-Knocks', 'Sixty-three knocks')
def _knocks():
    inner = (f'<div style="position: absolute; left: 120px; top: 260px; width: 760px; height: 230px">{place(0, 70, name_tile(TYPO, 720, visits=63, h=150))}{place(440, 0, sticky("drop at renewal?", 260, strike=True), extra=' data-o="sticky"')}</div>'
             + f'<div style="position: absolute; left: 120px; top: 520px; display: flex; align-items: center; gap: 16px">{ex_label(light=False)}'
             f'<span style="font-size: 24px; color: {INK_SOFT}">Channel: Direct</span></div>'
             + caption('Customers, typing the name a little wrong.', x=120, y=640, w=740, size=44)
             + place(1170, 200, door(370, 'open', knock=3, label=TYPO, label_hook='dlabel')))
    return frame('charcoal', inner)


@F('w46-Price', 'They land on the homepage')
def _price():
    """Was "a real price" (v4). The misspelling now lands on Northway's homepage, padlock and all: the address bar
    shows what was typed (--o-typed, hidden unset) and what it became (the hook url)."""
    bar = (f'<span style="display: inline-grid; align-items: center"><span style="grid-area: 1 / 1; opacity: var(--o-typed, 0)">{TYPO}</span>'
           f'<span data-o="url" style="grid-area: 1 / 1; display: inline-flex; align-items: center; gap: 10px">{lock_url(f"https://{MAIN}")}</span></span>')
    site = browser2(bar, homepage(1200, 640), None, None, 1200, 640, shadow="0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)")
    inner = (headline('Now they land on the homepage.', y=150, size=60)
             + f'<div style="position: absolute; left: 360px; top: 270px">{site}</div>')
    return frame('light', inner)


@F('w46-Quiet', 'Where to look first')
def _quiet():
    rows = [(TYPO, 63), ('clinvane.com', 21), ('northwaysoft.de', 9), ('rostavia.com', 4), ('northwaysoft.fr', 2), ('northwaysft.com', 0), ('notevane.com', 0), (OLD, 0)]
    card = visits_card(rows, 820, row_h=60, hooks=True)
    bracket = f'<div style="position: absolute; left: 126px; top: {200 + 60 + 44 + 5 * 60 + 6}px; width: 808px; height: 172px; border-radius: 14px; box-shadow: 0 0 0 3px {AMBER}"></div>'
    inner = (place(120, 200, card) + bracket + place(120, 900, ex_label())
             + headline('Quiet all season?', x=1060, y=520, size=56, w=740)
             + caption('At renewal time, Northway knows where to look first.', x=1060, y=610, w=740, size=36, color=G600))
    return frame('light', inner)


def bulk_modal():
    return (f'<div style="padding: 22px 24px 8px; display: flex; flex-direction: column; gap: 14px"><span style="font-size: 18px; font-weight: 600; color: #181D27">Change destination</span>'
            f'<div style="display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #F2F4F7"><span style="flex: 1; text-align: center; padding: 7px 0; border-radius: 8px; font-size: 14px; font-weight: 600; background: #FFFFFF; color: #181D27; box-shadow: 0 0 0 1px #EAECF0">Replace URL</span>'
            f'<span style="flex: 1; text-align: center; padding: 7px 0; font-size: 14px; font-weight: 600; color: #717680">Find and replace</span></div>'
            f'<span style="{LBL}">New destination URL</span><div style="{INP}; {MONO}; font-size: 15px">https://{MAIN}/products</div>'
            f'<span style="font-size: 13px; color: #535862; line-height: 1.45">Domain redirects keep their path and query forwarding. Only the target changes.</span></div>'
            f'<div style="padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px"><span style="{BTN_S}">Cancel</span><span style="{BTN_P}; box-shadow: 0 0 0 4px rgba(32,167,149,var(--ring-upd, 1))">Update 46 links</span></div>')


@F('w46-ByTag', 'Filter by the tag, change it once')
def _bytag():
    top = (f'<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px"><span style="{BTN_S}; height: 34px; font-size: 13px">Tags: {tag_chip("Product", 12)}</span>'
           f'<span style="font-size: 14px; font-weight: 600; color: #181D27">46 selected</span><span style="{BTN_S}; height: 34px; font-size: 13px">Change destination</span></div>')
    body = f'<div style="flex: 1; display: flex; flex-direction: column; padding: 18px 24px">{top}<div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{links_rows(8, sel=True, tagf="Product")}</div></div>'
    inner = (headline('Filter by its tag. Change it once.', y=100, size=52, w=1500)
             + dash_with_modal('Links', ['Links'], body, modal(bulk_modal(), 560, 90), s=1.12, y=200)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


# ================================================================ ACT G · Close
RECAP_HOSTS = ['clinvane.com', 'rostavia.com', 'northwaysoft.de', TYPO, RETIRED]
LOCK_T = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20A795" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
          '<rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>')


def recap_hosts_row(name):
    """One Hostnames row, Connected, with its padlock (the World board's thread, G)."""
    return (f'<div data-ui="card" style="width: 460px; display: flex; align-items: center; gap: 12px; height: 58px; padding: 0 22px; border-radius: 14px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; {UI}">'
            f'{LOCK_T}<span style="{MONO}; font-size: 16px; flex: 1; color: #181D27">{name}</span>'
            f'<span style="font-size: 13px; font-weight: 700; padding: 4px 9px; border-radius: 6px; background: #ECFDF3; color: #067647">Connected</span></div>')


def recap_import():
    """The import's review, small: the real strings ("Adds {d} domains and {l} links, updates {u} links", "Import {n}
    changes"), the file it came from."""
    return (f'<div data-ui="card" style="width: 410px; border-radius: 18px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; {UI}; color: #181D27; overflow: hidden">'
            f'<div style="padding: 24px 26px 18px; display: flex; flex-direction: column; gap: 12px">'
            f'<span style="font-size: 19px; font-weight: 600">Import CSV</span>'
            f'<span style="align-self: flex-start; {MONO}; font-size: 14px; padding: 5px 10px; border-radius: 8px; background: #F2F4F7; color: #344054">northway-domains.csv</span>'
            f'<span style="font-size: 22px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; margin-top: 6px">Adds 214 domains and 214 links, updates 0 links</span></div>'
            f'<div style="padding: 16px 26px; border-top: 1px solid #EAECF0; background: #F9FAFB; display: flex; justify-content: flex-end">'
            f'<span style="{BTN_P}; height: 42px; font-size: 15px">Import 214 changes</span></div></div>')


def recap_hosts():
    """Hostnames, small: every row Connected with its padlock. A row turns from Waiting for DNS to Connected through
    --rc<i> (unset = Connected, the frame's settled state)."""
    def badge(t, on):
        return (f'<span style="font-size: 13px; font-weight: 700; padding: 4px 9px; border-radius: 6px; '
                + ('background: #ECFDF3; color: #067647' if on else 'background: #F2F4F7; color: #475467') + f'">{t}</span>')
    rows = ''.join(
        f'<div style="display: flex; align-items: center; gap: 12px; height: 58px; padding: 0 22px; border-top: 1px solid #EAECF0">'
        f'<span style="display: flex; opacity: var(--rc{i}, 1)">{LOCK_T}</span>'
        f'<span style="{MONO}; font-size: 16px; flex: 1; color: #181D27">{n}</span>'
        f'<span style="display: inline-grid; justify-items: end"><span style="grid-area: 1 / 1; display: flex; opacity: calc(1 - var(--rc{i}, 1))">{badge("Waiting for DNS", False)}</span>'
        f'<span style="grid-area: 1 / 1; display: flex; opacity: var(--rc{i}, 1)">{badge("Connected", True)}</span></span></div>'
        for i, n in enumerate(RECAP_HOSTS))
    return (f'<div data-ui="card" style="width: 500px; border-radius: 18px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; {UI}; overflow: hidden">'
            f'<div style="padding: 22px 22px 18px; display: flex; align-items: center; justify-content: space-between">'
            f'<span style="font-size: 19px; font-weight: 600; color: #181D27">Hostnames</span>'
            f'<span style="font-size: 14px; color: #535862">214 domains</span></div>{rows}</div>')


@F('w46-Recap', 'One list, one import, point the domains')
def _recap():
    """v6.1 (Leo, 2026-11-14): the summary is the film's own three objects, not a row of icons, and no door. The list,
    the import and the pointed domains, joined by the film's draw move (as w46-OneSite); the spoken summary builds
    above them, phrase by phrase."""
    head = headline('<span data-o="r0">One list.</span> <span data-o="r1">One import.</span> <span data-o="r2">Point the domains.</span>',
                    x=120, y=180, size=64, w=1680)
    lst = scaled(sheet(960, rows=sheet_rows()[:5], show_more=False, row_h=52), 0.62, 595, 332, x=120, y=420)
    links = (f'<svg style="position: absolute; left: 712px; top: 446px" width="600" height="300" viewBox="0 0 600 300" aria-hidden="true" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="3" stroke-linecap="round">'
             f'<path data-draw="k1" d="M8 140H88"></path><path data-o="kh1" d="M76 128l14 12-14 12"></path>'
             f'<path data-draw="k2" d="M508 140H580"></path><path data-o="kh2" d="M568 128l14 12-14 12"></path></svg>')
    inner = (head + lst + links + place(810, 470, recap_import()) + place(1300, 410, recap_hosts()))
    return frame('radial', inner)


@F('w46-YourNames', 'Picture your own list')
def _yours():
    """v6.1 (Leo, 2026-11-14): no doors here. The aside shows Northway's wordmark (it isn't real); then the viewer's own
    list, unnamed rows, one of them lit: the one a customer types tonight."""
    g = NORTHWAY
    card = (f'<div data-shop style="position: absolute; left: 660px; top: 300px; width: 600px; height: 300px; box-sizing: border-box; border-radius: 28px; '
            f'background: {g["paper"]}; box-shadow: inset 0 0 0 1px {g["line"]}; display: flex; align-items: center; justify-content: center">{northway_logo(78)}</div>')
    blank = [('', '', '', '')] * 5
    yours = scaled(sheet(960, rows=blank, show_more=False, row_h=56, file='your-domains.csv'), 0.9, 864, 410, x=528, y=200)
    # the row a customer types tonight: amber, the film's one colour for a visitor (once in this frame)
    hot = f'<div data-o="hot" style="position: absolute; left: 528px; top: 380px; width: 864px; height: 51px; border-radius: 10px; box-shadow: 0 0 0 4px {AMBER}"></div>'
    inner = (f'<span style="position: absolute; left: 120px; top: 92px; display: inline-flex; align-items: center; height: 52px; padding: 0 24px; border-radius: 26px; background: rgba(255,255,255,0.10); '
             f'font-size: 25px; font-weight: 600; color: {INK_SOFT}">An aside: Northway isn’t a real company.</span>'
             + card + yours + hot
             + headline('<span data-o="q1">Your domains. Which one would a customer type tonight?</span><br /><span data-o="q2">And would the door open?</span>', x=120, y=700, size=56, w=1680))
    return frame('evening', inner)


@F('w46-EndCard', 'End card')
def _end():
    """v6.1 (Leo, 2026-11-14): no QR slot. The line, where the links are, and the RedirHub logo; the right half stays
    clear for YouTube's end screen."""
    inner = (f'<div style="position: absolute; left: 140px; top: 220px; display: flex; flex-direction: column">'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em">Every door.</span>'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em; color: {TEAL}">Open.</span></div>'
             f'<span style="position: absolute; left: 140px; top: 530px; font-size: 32px; color: {INK_SOFT}">Links are in the description.</span>'
             f'<div style="position: absolute; left: 140px; top: 780px; width: 300px">{RH_WORDMARK}</div>')
    return frame('glow-teal', inner, extra=' data-endcard')

# ================================================================ system and sound boards
def board(inner):
    return (f'<div data-solid-bg style="width: 1920px; height: 1080px; box-sizing: border-box; position: relative; overflow: hidden; background: {DARK}; {JAK}; color: #FFFFFF">{inner}</div>')


def room_tile(room, name, use):
    bg, fg, _ = ROOMS[room]
    return (f'<div style="display: flex; flex-direction: column; gap: 12px"><div style="height: 120px; border-radius: 18px; background: {bg}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14); display: flex; align-items: flex-end; padding: 14px 16px; box-sizing: border-box">'
            f'<span style="font-size: 21px; font-weight: 800; color: {fg}">{name}</span></div><span style="font-size: 16px; line-height: 1.35; color: {INK_SOFT}">{use}</span></div>')


@F('w46-System', 'System: rooms, colour, type, motion')
def _system():
    tiles = ''.join(room_tile(*t) for t in (
        ('light', 'Light', 'Northway, one website, renewals, the honest note, the spreadsheet and product, the homepage, quiet'),
        ('evening', 'Evening (new)', 'The notebook, the weight, all of Act C, your names'),
        ('charcoal', 'Charcoal', 'Three registrar accounts, the door is born, the knocks'),
        ('glow-teal', 'Glow, teal', 'Every padlock lit, end card'),
        ('sweep', 'Brand sweep', 'Title'),
        ('radial', 'Brand radial', 'The recap')))
    roles = ''.join(f'<div style="display: flex; align-items: center; gap: 12px"><span style="width: 40px; height: 40px; flex: none; border-radius: 11px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>'
                    f'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 19px; font-weight: 700">{n}</span><span style="font-size: 15px; color: {INK_SOFT}">{r}</span></div></div>'
                    for c, n, r in ((TEAL, 'Teal', 'fixed: a lit door, the fix'), (RED, 'Signal red', 'the warning page only'), (AMBER, 'Amber', 'twice in the film: one visitor, the quiet names'),
                                    (BLUE, 'Blue', 'inside product UI only'), ('#FBF7EF', 'Paper', 'the product notebook'), ('#1E2A44', 'Door navy', 'every domain tile’s slot')))
    grammar = (('Cut on the beat', 'every act break'), ('Shared-element morph', 'the wall becomes the sheet (Title); the tile becomes a door (Door)'),
               ('Dock', 'dialogs come forward over the dimmed dashboard'), ('Draw', 'domains into one website; registrars into one file'),
               ('Focus rack', 'plain address vs https (Two results)'), ('Register change', 'the honest note; “isn’t a real company”'),
               ('Silence', 'after “Northway never finds out”; the end card'), ('Knock (new)', 'three arcs leave a door’s edge: someone came looking. Never decoration.'))
    grows = ''.join(f'<div style="display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 14px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.10)">'
                    f'<span style="font-size: 17px; font-weight: 700; color: {TEAL if "new" in a else INK}">{a}</span><span style="font-size: 16px; line-height: 1.35; color: {INK_SOFT}">{b}</span></div>' for a, b in grammar)
    g = ''.join(f'<span style="width: 40px; height: 40px; border-radius: 11px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>' for c in NORTHWAY.values())
    inner = (f'<div style="position: absolute; left: 120px; top: 70px; font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {INK_SOFT}">SYSTEM · W46</div>'
             f'<span style="position: absolute; left: 120px; top: 112px; font-size: 52px; font-weight: 800; letter-spacing: -0.03em">A quiet software company inside the RedirHub frame.</span>'
             f'<div style="position: absolute; left: 120px; top: 210px; width: 1680px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px">{tiles}</div>'
             f'<div style="position: absolute; left: 120px; top: 440px; width: 1680px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12)">{roles}</div>'
             f'<div style="position: absolute; left: 120px; top: 550px; width: 1680px; display: grid; grid-template-columns: 0.9fr 1.35fr 0.9fr; gap: 44px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12)">'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">TYPE</span>'
             f'<span style="font-size: 23px; font-weight: 800; letter-spacing: -0.02em">Plus Jakarta Sans: the film’s words</span>'
             f'<span style="{MONO}; font-size: 18px">JetBrains Mono: every domain, in full</span>'
             f'<span data-ui="sample" style="{UI}; font-size: 19px; color: {INK_SOFT}">Inter: product and recreated web UI</span>'
             f'<span data-logo style="{SERIF}; font-size: 26px; color: {INK_SOFT}">Instrument Serif: Northway’s wordmark only</span>'
             f'<span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}; margin-top: 12px">NORTHWAY ONLY</span><div data-shop style="display: flex; gap: 10px">{g}</div></div>'
             f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">MOTION GRAMMAR</span>{grows}</div>'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">CHANGED FROM W44</span>'
             f'<span style="font-size: 17px; line-height: 1.5; color: {INK_SOFT}">Quieter: Glow red is gone (no melt here); an Evening room carries Act C. Browsers lose their coloured dots. Fredoka and the pink-and-blue shop palette give way to Northway’s serif wordmark and quiet ink. One new move, the knock. No step labels (v6). Dialogs dock forward at 1.45× so their words read. Nothing tilts.</span></div></div>')
    return board(inner)


@F('w46-Sound', 'Sound, voice and timing')
def _sound():
    rows = (('Whoosh', 'Twice only: into the title (beat 5), into the dashboard (beat 20).'),
            ('Low tone', 'One soft tone as the warning page lands (beat 11).'),
            ('Silence', 'After “Northway never finds out.” No cue.'),
            ('Knock', 'Three knocks on a wooden door: after “hear when someone knocks” (beat 13) and “could hear the knocks” (beat 26).'),
            ('Fixed chime', 'Once: the padlocks lighting (beat 25), the fix the film celebrates.'),
            ('Music', 'Moon Walk (Mixkit), at least 11 LU under every word.'))
    srows = ''.join(f'<div style="display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 20px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.12)">'
                    f'<span style="font-size: 23px; font-weight: 700">{a}</span><span style="font-size: 18px; line-height: 1.4; color: {INK_SOFT}">{b}</span></div>' for a, b in rows)
    voice = (('A · Company', 'warm · thoughtful · plain'), ('B · The pile', 'plain · matter-of-fact'), ('C · Visitor', 'plain · curious · quiet'),
             ('D · Way out', 'thoughtful, then plain (the honest note)'), ('E · Sheet', 'calm, teaching'), ('F · Knock', 'warm · lightly · thoughtful'),
             ('G · Close', 'plain · lightly · thoughtful · warm'))
    vrows = ''.join(f'<div style="display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 16px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.10)">'
                    f'<span style="font-size: 19px; font-weight: 700">{a}</span><span style="{MONO}; font-size: 17px; color: {TEAL}">{b}</span></div>' for a, b in voice)
    inner = (f'<div style="position: absolute; left: 120px; top: 90px; width: 1680px; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); column-gap: 90px">'
             f'<div style="display: flex; flex-direction: column; gap: 12px"><span style="font-weight: 700; font-size: 22px; letter-spacing: 0.16em; color: {TEAL}">SOUND · ONLY ON STORY BEATS</span><div>{srows}</div>'
             f'<div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px">'
             + ''.join(f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="{MONO}; font-size: 28px; color: {TEAL}">{a}</span><span style="font-size: 17px; color: {INK_SOFT}">{b}</span></div>'
                       for a, b in (('−14 LUFS', 'master, voice on top'), ('words ÷ 3 + 1 s', 'least any frame holds'), ('≤ 6 / 30 s', 'cues, never clicks or typing')))
             + '</div></div>'
             f'<div style="display: flex; flex-direction: column; gap: 12px"><span style="font-weight: 700; font-size: 22px; letter-spacing: 0.16em; color: {TEAL}">VOICE · CALMER THAN W44</span><div>{vrows}</div>'
             f'<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px; padding: 14px 20px; border-radius: 14px; background: rgba(255,255,255,0.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14)">'
             f'<span style="font-weight: 700; font-size: 19px; color: {TEAL}">Changed from W44</span><span style="font-size: 17px; line-height: 1.45; color: {INK_SOFT}">No shimmer, rewind, snap or sparkle. One new cue, the knock. The chime keeps its meaning (fixed). The narrator never reads a domain aloud (“that old product domain”, “Northway without the h”).</span></div></div></div>')
    return board(inner)


# ================================================================ write
def main():
    only = sys.argv[1:]
    os.makedirs(OUT, exist_ok=True)
    for name, (title, fn) in FRAMES.items():
        if only and not any(o in name for o in only):
            continue
        res = fn()
        body, w, h = (res if isinstance(res, tuple) else (res, 1920, 1080))
        open(os.path.join(OUT, name + '.dc.html'), 'w').write(page(f'W46 · {title}', body, w, h))
        print('wrote', name)


if __name__ == '__main__':
    main()
