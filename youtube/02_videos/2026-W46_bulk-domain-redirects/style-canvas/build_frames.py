#!/usr/bin/env python3
"""W46 key frames: writes style-canvas/project/w46-*.dc.html from shared props.

    python3 youtube/02_videos/2026-W46_bulk-domain-redirects/style-canvas/build_frames.py [names...]

Every frame is literal .dc.html markup (no {{holes}}), so it renders in plain Chromium and in the canvas.
w46_base.py holds the house system (from W44), w46_props.py the cast: Glomvo, the kipzoo tile, the door and
knock, the founder's notebook, the registrars, the warning page and the spreadsheet. Every frame builds from
them, so kipzoo.com is the same object everywhere it appears. After Review 2 the canvas is the source: sync
Leo's edits back by hand before regenerating.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from w46_props import *  # noqa: F401,F403  (w46_props re-exports w46_base)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'project')


# ================================================================ product UI pieces (labels from the live dashboard, redirhub/lviv)
def visits_card(rows, w=760, hi=KIP, title='Domains', metric='Clicks', tabs=('Domains', 'Tags'), on=0, row_h=58):
    """The analytics breakdown card: tabs Domains / Tags, one row per domain with a bar and its count."""
    top = max(v for _, v in rows) or 1
    tab = ''.join(f'<span style="display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 8px; font-size: 14px; font-weight: 600; '
                  f'{"background: #FFFFFF; color: #181D27; box-shadow: 0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0" if k == on else "color: #717680"}">{t}</span>'
                  for k, t in enumerate(tabs))
    body = ''
    for n, v in rows:
        ring = n == hi
        body += (f'<div style="position: relative; display: flex; align-items: center; gap: 14px; height: {row_h}px; padding: 0 20px; border-top: 1px solid #EAECF0; '
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


def lander_browser(w=980, h=600, price=False, shadow=SOFT_SHADOW, name=KIP):
    return browser2(lock_url(f'https://{LANDER}' if name == KIP else f'https://glomvo.com/{name.split(".")[0]}'), lander(name, w, h, price=price), None, None, w, h, shadow=shadow)


def typing_browser(w=900, h=420, text=KIP, caret=True, shadow=SOFT_SHADOW, body=''):
    """The founder's browser: nothing but the address bar being typed into (a generic browser, no brand)."""
    car = f'<span style="width: 2px; height: 22px; background: {CHAR}"></span>' if caret else ''
    inner = body or f'<div style="height: {h - 64}px; background: #FFFFFF"></div>'
    return browser2(f'<span style="color: #181D27">{text}</span>{car}', inner, None, None, w, h, shadow=shadow)


# ================================================================ the world board
@F('w46-World', 'The story world')
def _world():
    g = GLOMVO
    W = 3280
    note = lambda t, c=G700: f'<span style="font-size: 24px; line-height: 1.5; color: {c}">{t}</span>'
    dnote = lambda t: note(t, INK_SOFT)

    # 1 · Glomvo
    glomvo = (f'<div style="display: flex; gap: 60px; align-items: flex-start"><div style="display: flex; flex-direction: column; gap: 34px; width: 520px">'
              f'<div data-shop style="padding: 44px 40px; border-radius: 24px; background: {g["stone"]}">{glomvo_logo(64)}</div>'
              + note('A small team that buys short, sayable names and holds them until the right founder comes looking. Quiet, careful, a little old-fashioned: a serif wordmark, stone and ink, no colour.')
              + f'<div data-shop style="display: flex; gap: 14px">' + ''.join(f'<span style="width: 56px; height: 56px; border-radius: 14px; background: {c}; box-shadow: inset 0 0 0 1px rgba(16,24,40,0.12)"></span>' for c in g.values()) + '</div>'
              + f'<span style="{MONO}; font-size: 18px; color: {G600}">ink #2B2722 · stone #F4F0E8 · linen #E7E0D4 · pebble #A79F92</span></div>'
              f'<div style="display: flex; flex-direction: column; gap: 18px">{lander_browser(820, 520)}'
              f'<span style="font-size: 22px; font-weight: 600; color: {G600}">The for-sale page: the same page for every name. Act F adds Buy now (price shown as a bar, never a figure).</span></div></div>')

    # 2 · the portfolio wall
    wall = ''.join(name_tile(n, 430, tagc=None) for n in WALL)
    wall = (f'<div style="display: grid; grid-template-columns: repeat(3, 430px); gap: 22px">{wall}</div>'
            f'<span style="display: block; margin-top: 30px">' + note('Every name is invented and was DNS-checked on 6 Nov 2026 (open-questions.md, D-1). Each tile carries a slot: the small door it will become in Act D. kipzoo is the only one we follow.') + '</span>')

    # 3 · the thread
    stick = (f'<div style="position: relative; width: 470px; height: 190px">{place(0, 60, name_tile(KIP, 440, visits=63))}'
             f'{place(310, 0, sticky("drop?", 140, strike=True))}</div>')
    thread_items = [
        ('A', 'One of the names', name_tile(KIP, 440)),
        ('C', 'The founder types it', typing_browser(560, 150, body=f'<div style="height: 86px; background: #FFFFFF"></div>')),
        ('E', 'A row in the sheet', sheet(560, rows=sheet_rows()[:1], show_more=False, row_h=52)),
        ('F', '63 visits · last year’s drop list', f'<div style="display: flex; flex-direction: column; gap: 14px">{stick}{ex_label()}</div>'),
        ('G', 'The door in the question', door(140, 'open', dark=False, knock=2, label=KIP)),
    ]
    thread = (f'<div style="display: flex; gap: 46px; align-items: flex-start">'
              + ''.join(f'<div style="display: flex; flex-direction: column; gap: 18px"><span style="font-size: 22px; font-weight: 800; color: {TEAL}">{a}</span>'
                        f'<span style="font-size: 24px; font-weight: 700; color: {CHAR}">{b}</span>{c}</div>' for a, b, c in thread_items) + '</div>'
              + f'<span style="display: block; margin-top: 34px; width: 2900px">' + note(f'One object, always the same: a white tile, a slot, <span style="{MONO}">kipzoo.com</span> in JetBrains Mono. The narrator says “kipzoo”; the screen always shows the full address. It is one of Glomvo’s names (A), the name the founder types and leaves (C), a row in the spreadsheet (E), the name with 63 visits that had been on last year’s drop list (F), and the door in the closing question (G).') + '</span>')

    # 4 · the motif (dark panel)
    st = [('closed', 0, '1 · Closed', 'A name with nowhere safe to go. Dark slab, quiet outline, padlock unlit.'),
          ('open', 0, '2 · Opening, padlock lit', 'The fix: teal light from its edge, the padlock lit teal. Opens properly.'),
          ('open', 3, '3 · A knock', 'Someone came looking: three arcs leave the door. Glomvo hears it.'),
          ('broken', 0, 'Only once · Broken', 'The warning page in Act C: red light, the shackle sprung. Never elsewhere.')]
    motif = (f'<div style="display: flex; gap: 70px; align-items: flex-end">'
             + ''.join(f'<div style="display: flex; flex-direction: column; gap: 22px; width: {440 if k else 300}px">{door(200, s, knock=k)}'
                       f'<span style="font-size: 26px; font-weight: 800; color: {INK}">{t}</span><span style="font-size: 21px; line-height: 1.45; color: {INK_SOFT}">{d}</span></div>' for s, k, t, d in st)
             + '</div>'
             + f'<span style="display: block; margin-top: 34px; width: 2900px">' + dnote('Every name is a door that has to open properly, padlock included; a visit is a knock Glomvo needs to hear. Born on beat 11 (Act D), paid off in Act F (the knocks) and in the closing question (G). Drawn, never cartoon: no handle, hinges or wood. The new move, “knock”, means only one thing: someone came looking.') + '</span>')

    # 5 · the founder
    founder = (f'<div style="display: flex; gap: 50px; align-items: flex-start">'
               f'<div style="padding: 10px">{scaled(notebook(1400, 760), 0.62, 1400, 760)}</div>'
               f'<div style="display: flex; flex-direction: column; gap: 26px; width: 560px">{typing_browser(560, 300)}'
               + note(f'Never a face or a person: the founder is a notebook and a browser. Sketches, a crossed-out idea, and one circled line, “the name”, empty in Act A. In Act C it holds <span style="{MONO}">kipzoo.com</span>, then a strike and another name.')
               + '</div></div>')

    # 6 · the warning page
    warn = (f'<div style="display: flex; flex-direction: column; gap: 24px">{browser2(bar_url(f"https://{KIP}", broken=True), warning_page(900, 500), None, None, 900, 500, shadow=SOFT_SHADOW)}'
            + note('Generic wording, no browser’s colours, icon or layout. The only place Signal Red appears in the film.') + '</div>')

    # 7 · three registrars
    regs = (f'<div style="display: flex; gap: 26px; align-items: flex-start">'
            f'{registrar("a", ["kipzoo.com", "tumbrik.com", "olzik.com"], w=420, label="Registrar A")}'
            f'{registrar("b", ["zentvy.com", "gozvu.com", "savvlo.com"], w=420, label="Registrar B")}'
            f'{registrar("c", ["yobzi.com", "grolvi.com", "zinnobi.com"], w=420, label="Registrar C")}</div>'
            + f'<span style="display: block; margin-top: 30px">' + note('Three unbranded forwarding forms, three neutral styles (card, dark header, dense table). No logo, colour or copy from any real registrar, and nobody is said to “not be able to”.') + '</span>')

    # 8 · the spreadsheet
    chips = ''.join(tag_chip(t, 22) for t in ('Brandables', 'Short', 'Premium'))
    sheet_b = (f'{sheet(1340, rows=sheet_rows()[:5])}<div style="display: flex; align-items: center; gap: 18px; margin-top: 30px">{chips}'
               f'<span style="margin-left: 20px">' + note('The real import columns: source_url, destination, type, tags. Generic grid, no spreadsheet app’s look.') + '</span></div>')

    # 9 · visits
    vis_rows = [(KIP, 63), ('tumbrik.com', 21), ('olzik.com', 9), ('zentvy.com', 4), ('gozvu.com', 0)]
    visits = (f'<div style="display: flex; gap: 40px; align-items: flex-start"><div style="display: flex; flex-direction: column; gap: 16px">{visits_card(vis_rows, 640)}{ex_label()}</div>'
              f'<div style="width: 340px">' + note('The analytics Domains card, as in the dashboard (Inter, product blue reserved). Counts labelled Example. The VO says “visits”; the card’s real label is Clicks (open-questions.md).') + '</div></div>')

    rules = ('<ul style="margin: 0; padding-left: 28px; display: flex; flex-direction: column; gap: 14px; font-size: 24px; line-height: 1.45; color: #344054">'
             '<li>No face or realistic person. The founder is never drawn: a notebook and a browser stand in.</li>'
             '<li>No real logo, colour or copy for any registrar, marketplace, browser, Google, Bodis or Cloudflare. “Cloudflare” appears once, as a plain word, in Connect DNS.</li>'
             '<li>No dollar figure, price, plan name or free-plan wording. A price is a bar.</li>'
             '<li>Glomvo’s stone palette and Instrument Serif stay on Glomvo’s own things. Teal means fixed; Signal Red lives only on the warning page; amber at most once a frame; product blue only in product UI.</li>'
             '<li>Nothing tilts, spins or bounces.</li></ul>')
    inner = (f'<div style="position: absolute; left: 120px; top: 100px; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {G500}">W46 · CAST, PROPS AND MOTIF</span>'
             f'<span style="font-size: 88px; font-weight: 800; letter-spacing: -0.04em; color: {CHAR}">The story world.</span></div>'
             + world_panel(120, 340, 1560, 820, 'THE TEAM', 'Glomvo', glomvo)
             + world_panel(1760, 340, 1400, 820, 'THE PORTFOLIO', 'Names, held', wall)
             + world_panel(120, 1240, 3040, 820, 'THE THREAD', f'<span style="{MONO}; font-weight: 600; letter-spacing: -0.02em">{KIP}</span>, the same object everywhere', thread)
             + world_panel(120, 2140, 3040, 900, 'THE MOTIF', 'A door, and a knock', motif, dark=True)
             + world_panel(120, 3120, 1560, 760, 'THE FOUNDER', 'A notebook and a browser', founder)
             + world_panel(1760, 3120, 1400, 760, 'THE WARNING', 'What the founder saw', warn)
             + world_panel(120, 3960, 1440, 800, 'BEFORE', 'Three registrars', regs)
             + world_panel(1640, 3960, 1520, 800, 'THE LIST', 'One row per name', sheet_b)
             + world_panel(120, 4840, 1560, 640, 'HEARING THE KNOCK', 'Visits, by domain', visits)
             + world_panel(1760, 4840, 1400, 640, 'WORLD RULES', 'What never appears', rules))
    H = 5600
    return (f'<div style="width: {W}px; height: {H}px; box-sizing: border-box; position: relative; overflow: hidden; background: linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%); {JAK}; color: {CHAR}">{inner}</div>', W, H)


# ================================================================ ACT A · Imagine
@F('w46-Notebook', 'A name that comes first')
def _notebook():
    nb = scaled(notebook(1400, 760), 1.0, 1400, 760)
    inner = (f'<div style="position: absolute; left: 260px; top: 150px">{nb}</div>')
    return frame('evening', inner)


@F('w46-Glomvo', 'Meet Glomvo')
def _glomvo():
    g = GLOMVO
    tiles = ''.join(name_tile(n, 310) for n in WALL)
    inner = (f'<div data-shop style="position: absolute; left: 120px; top: 300px; padding: 56px 52px; border-radius: 28px; background: {g["stone"]}">{glomvo_logo(78)}</div>'
             + caption('A small team that buys names like these, and holds them until the right person comes looking.', y=620, x=120, w=640, size=40, color=CHAR)
             + f'<div style="position: absolute; left: 820px; top: 330px; display: grid; grid-template-columns: repeat(3, 310px); gap: 20px">{tiles}</div>')
    return frame('light', inner)


@F('w46-Title', 'Title card')
def _title():
    inner = (f'<div style="position: absolute; left: 120px; top: 250px; width: 840px; display: flex; flex-direction: column; gap: 26px">'
             f'<span style="font-size: 92px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em">How to redirect hundreds of domains at once</span>'
             f'<span style="font-size: 44px; font-weight: 700; letter-spacing: -0.02em; color: rgba(255,255,255,0.86)">with one spreadsheet</span></div>'
             + scaled(sheet(960, rows=sheet_rows()[:6]), 0.76, 1016, 560, x=1020, y=300))
    return frame('sweep', inner)


# ================================================================ ACT B · What waiting costs
@F('w46-Renewals', 'Every name asks every year')
def _renewals():
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    names = [('tumbrik.com', 2), ('olzik.com', 4), ('zentvy.com', 0), (KIP, 8), ('savvlo.com', 5), ('gozvu.com', 10), ('grolvi.com', 7), ('yobzi.com', 1)]
    x0, cw, y0, rh = 470, 110, 360, 62
    head = ''.join(f'<span style="position: absolute; left: {x0 + i * cw}px; top: {y0 - 50}px; width: {cw}px; text-align: center; font-size: 20px; font-weight: 700; color: {G500}">{m}</span>' for i, m in enumerate(months))
    rows = ''
    for k, (n, m) in enumerate(names):
        y = y0 + k * rh
        rows += (f'<span style="position: absolute; left: 120px; top: {y + 14}px; {MONO}; font-size: 24px; font-weight: 600; color: {CHAR}">{n}</span>'
                 f'<span style="position: absolute; left: {x0}px; top: {y + rh // 2}px; width: {12 * cw}px; height: 2px; background: {G200}"></span>'
                 f'<span style="position: absolute; left: {x0 + m * cw + 18}px; top: {y + 10}px; height: 40px; padding: 0 14px; border-radius: 20px; background: #1E2A44; color: #FFFFFF; '
                 f'display: inline-flex; align-items: center; font-size: 17px; font-weight: 700; white-space: nowrap">Renews</span>')
    rows += f'<span style="position: absolute; left: 120px; top: {y0 + len(names) * rh + 12}px; font-size: 22px; font-weight: 600; color: {G500}">… and every other name, every year</span>'
    inner = headline('Holding a name isn’t free.', y=150, size=72) + head + rows
    return frame('light', inner)


@F('w46-Parking', 'Parking ads went away')
def _parking():
    def ad(w, h, op):
        return f'<div style="width: {w}px; height: {h}px; border-radius: 12px; background: {G200}; opacity: {op}"></div>'
    parked = (f'<div style="height: 476px; box-sizing: border-box; padding: 34px; display: flex; flex-direction: column; gap: 18px; background: #FFFFFF">'
              f'<span style="font-size: 15px; font-weight: 600; letter-spacing: 0.08em; color: {G400}">SPONSORED LISTINGS</span>'
              + ''.join(ad(w, 70, op) for w, op in ((640, 0.9), (600, 0.6), (620, 0.35), (560, 0.15))) + '</div>')
    lines = ''.join(f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 24px; font-weight: 700; letter-spacing: 0.12em; color: {INK_SOFT}">{m}</span>'
                    f'<span style="font-size: 44px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15">{t}</span></div>'
                    for m, t in (('JANUARY', 'Bodis closed.'), ('FEBRUARY', 'Google pulled its ads from parked domains.')))
    inner = (browser2(lock_url('https://olzik.com'), parked, 120, 230, 720, 540)
             + f'<div style="position: absolute; left: 960px; top: 330px; width: 820px; display: flex; flex-direction: column; gap: 56px">{lines}</div>')
    return frame('charcoal', inner)


@F('w46-Weight', 'Each visitor carries weight')
def _weight():
    import itertools
    names = ['tumbrik.com', 'olzik.com', 'zentvy.com', 'savvlo.com', 'gozvu.com', 'grolvi.com', 'zinnobi.com', 'quellox.com', 'yobzi.com', 'mobvra.com',
             'bazlio.com', 'jubrik.com', 'bvoko.com', 'ubvex.com']
    cyc = iter(names)
    tiles = ''
    for r in range(3):
        for c in range(5):
            x, y = 120 + c * 340, 230 + r * 120
            tiles += place(x, y, name_tile(KIP, 310) if (r, c) == (1, 2) else name_tile(next(cyc), 310, dim=True))
    dx, dy = 120 + 2 * 340 + 290, 230 + 120 - 30
    dot = (f'<div style="position: absolute; left: {dx - 40}px; top: {dy - 40}px; width: 136px; height: 136px; border-radius: 50%; background: radial-gradient(closest-side, rgba(229,148,38,0.35), rgba(229,148,38,0))"></div>'
           f'<div style="position: absolute; left: {dx}px; top: {dy}px; width: 56px; height: 56px; border-radius: 50%; background: {AMBER}"></div>')
    inner = tiles + dot + caption('Each person who comes looking carries a lot of weight.', y=700, size=48, x=120, w=1500)
    return frame('evening', inner)


# ================================================================ ACT C · The founder who came
@F('w46-TwoResults', 'Two addresses, two results')
def _two():
    big = 'font-size: 26px'
    pad = (f'<div style="height: 406px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px">'
           f'<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="{G400}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>'
           f'<span style="font-size: 22px; font-weight: 600; color: {G500}">Secure version first…</span></div>')
    left = (f'<div style="position: absolute; left: 120px; top: 220px; display: flex; align-items: center; gap: 14px; font-size: 28px; font-weight: 700; color: {INK_SOFT}">'
            f'{check(36, fill="rgba(255,255,255,0.18)")}Glomvo typed the plain address</div>'
            f'<div style="position: absolute; left: 120px; top: 300px; opacity: 0.82">{browser2(f"<span style=\"color: #181D27\">{KIP}</span>", lander(KIP, 760, 470), None, None, 760, 470, shadow=DARK_SHADOW, bar=76, size=26)}</div>')
    https = f'<span style="color: #181D27; font-weight: 700">https://</span><span style="color: #181D27">{KIP}</span>'
    right = (f'<div style="position: absolute; left: 960px; top: 220px; font-size: 28px; font-weight: 700; color: {INK}">The founder’s browser asks for the padlock</div>'
             + browser2(https, pad, 960, 300, 840, 470, shadow=DARK_SHADOW, bar=76, size=26))
    inner = left + right + caption('Some registrars include a padlock with forwarding. Others don’t.', y=840, size=38)
    return frame('evening', inner)


@F('w46-Warning', 'The founder leaves')
def _warning():
    inner = (browser2(bar_url(f'https://{KIP}', broken=True), warning_page(1040, 640), None, None, 1040, 640)
             .replace('position: relative; width: 1040px', 'position: absolute; left: 120px; top: 180px; width: 1040px')
             + scaled(notebook(1400, 760, name=KIP, gone=True, next_name='rimboa.com'), 0.56, 1400, 760, x=1010, y=520))
    return frame('evening', inner)


@F('w46-Silence', 'Glomvo never finds out')
def _silence():
    arc = ''.join(f'<span style="position: absolute; left: {960 - r}px; top: {470 - r}px; width: {2 * r}px; height: {2 * r}px; border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(255,255,255,{op})"></span>'
                  for r, op in ((300, 0.09), (420, 0.05)))
    inner = (arc + place(700, 425, name_tile(KIP, 520))
             + caption('Glomvo never finds out.', y=760, size=44, color=INK_SOFT))
    return frame('evening', inner)

# ================================================================ ACT D · The way out
@F('w46-Door', 'A door, and a knock')
def _door():
    items = ''.join(f'<div style="display: flex; gap: 22px; align-items: baseline"><span style="font-size: 40px; font-weight: 800; color: {TEAL}">{n}</span>'
                    f'<span style="font-size: 46px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15">{t}</span></div>'
                    for n, t in (('1', 'A door that opens properly, padlock included.'), ('2', 'A way to hear when someone knocks.')))
    inner = (place(190, 170, door(320, 'open', knock=3, label=KIP))
             + headline('Every name needed two things.', x=880, y=260, size=58, w=920)
             + f'<div style="position: absolute; left: 880px; top: 440px; width: 900px; display: flex; flex-direction: column; gap: 40px">{items}</div>')
    return frame('charcoal', inner)


def checker_card(url='https://bazlio.com', w=820):
    hop = lambda k, u, code, ok: (f'<div style="display: flex; align-items: center; gap: 16px; height: 64px; padding: 0 22px; border-top: 1px solid #EAECF0">'
                                   f'<span style="width: 30px; height: 30px; border-radius: 50%; background: #F2F4F7; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #475467">{k}</span>'
                                   f'{LOCK}<span style="{MONO}; font-size: 18px; color: #181D27">{u}</span><span style="flex: 1"></span>'
                                   f'<span style="font-size: 14px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: {"#ECFDF3" if ok else "#E8F0F8"}; color: {"#067647" if ok else "#1C6DB6"}">{code}</span></div>')
    return (f'<div data-ui="checker" style="width: {w}px; border-radius: 20px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; overflow: hidden; {UI}; color: #181D27">'
            f'<div style="padding: 24px 22px 18px; display: flex; flex-direction: column; gap: 14px"><span style="font-size: 18px; font-weight: 600">Redirect Checker</span>'
            f'<div style="display: flex; gap: 10px"><div style="{INP}; flex: 1; {MONO}; font-size: 17px">{url}</div><span style="{BTN_P}; height: 42px">Check</span></div></div>'
            + hop(1, url, '302', False) + hop(2, f'https://glomvo.com/{url.split("//")[1].split(".")[0]}', '200', True) + '</div>')


@F('w46-Honest', 'One honest note')
def _honest():
    inner = (tip('ONE HONEST NOTE', 'A handful of names, and the padlock shows? You’re done.', 'Check one in our free Redirect Checker.', 120, 360, w=660)
             + f'<div style="position: absolute; left: 900px; top: 380px; display: flex; flex-direction: column; gap: 18px">{checker_card(w=880)}{ex_label()}</div>')
    return frame('light', inner)


@F('w46-Once', 'Three registrars, fixed once')
def _once():
    regs = (registrar('a', ['kipzoo.com', 'tumbrik.com', 'olzik.com'], 120, 230, 470, 'Registrar A')
            + registrar('b', ['zentvy.com', 'gozvu.com', 'savvlo.com'], 120, 450, 470, 'Registrar B')
            + registrar('c', ['yobzi.com', 'grolvi.com', 'zinnobi.com'], 120, 670, 470, 'Registrar C'))
    arrow = (f'<svg style="position: absolute; left: 640px; top: 300px" width="200" height="520" viewBox="0 0 200 520" aria-hidden="true" fill="none" stroke="{G400}" stroke-width="3" stroke-linecap="round">'
             '<path d="M0 30C90 30 100 260 180 260M0 260H180M0 490C90 490 100 260 180 260"></path><path d="M164 246l18 14-18 14"></path></svg>')
    empty = [('', '', '', '')] * 6
    inner = (regs + arrow + scaled(sheet(960, rows=empty, show_more=False), 0.9, 1016, 560, x=880, y=300)
             + caption('Three registrars. Fixed once, for all of them.', x=880, y=200, w=920, size=44, color=CHAR))
    return frame('light', inner)


# ================================================================ ACT E · One spreadsheet
def col_label(text, x, y, w, sub=None):
    s = f'<span style="font-size: 22px; font-weight: 600; color: {G600}">{sub}</span>' if sub else ''
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; display: flex; flex-direction: column; gap: 4px; padding-bottom: 10px; border-bottom: 3px solid {TEAL}">'
            f'<span style="font-size: 30px; font-weight: 800; letter-spacing: -0.02em; color: {CHAR}">{text}</span>{s}</div>')


SW = 1560


def big_sheet(hi_col, hi_row=0):
    return place(122, 360, sheet(SW, rows=sheet_rows()[:6], hi_col=hi_col, hi_row=hi_row, row_h=56))


def col_x(k):
    widths = [0.24, 0.42, 0.11, 0.23]
    return 122 + 56 + sum(SW * p for p in widths[:k]), SW * widths[k]


@F('w46-List', 'Step one: the list')
def _list():
    (ax, aw), (bx, bw) = col_x(0), col_x(1)
    inner = (eyebrow('STEP 1 · THE LIST', dark=True) + progress(1)
             + headline('One row per name.', y=150, size=64)
             + col_label('The name', ax, 280, aw - 20) + col_label('Where it should go', bx, 280, bw - 20)
             + big_sheet([0, 1]) + place(1680, 900, ex_label()))
    return frame('light', inner)


@F('w46-Columns', 'A 302 and a tag')
def _columns():
    (cx, cw), (dx, dw) = col_x(2), col_x(3)
    chips = ''.join(tag_chip(t, 17) for t in ('Brandables', 'Short', 'Premium'))
    inner = (eyebrow('STEP 1 · THE LIST', dark=True) + progress(1)
             + headline('A 302, because it will sell. A tag, for the group.', y=150, size=56, w=1680)
             + col_label('302', cx, 280, cw - 10) + f'<div style="position: absolute; left: {dx:.0f}px; top: 278px; display: flex; gap: 10px">{chips}</div>'
             + f'<span style="position: absolute; left: {dx:.0f}px; top: 334px; width: {dw - 20:.0f}px; height: 3px; background: {TEAL}"></span>'
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
            f'<span style="font-weight: 600; color: #1C6DB6; box-shadow: 0 0 0 3px {TEAL}; border-radius: 6px; padding: 3px 6px">Import CSV</span></div>')


@F('w46-Import', 'Step two: Import CSV')
def _import():
    m = modal(chooser(), 640, 70)
    inner = (eyebrow('STEP 2 · THE IMPORT', dark=True) + progress(2)
             + dash_with_modal('Links', ['Links'], links_page(), m)
             + caption('CSV: the plain spreadsheet file Excel or Google Sheets can save.', y=910, size=28, color=G600))
    return frame('light', inner)


def errors_step():
    return (f'<div style="padding: 22px 24px 14px; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 18px; font-weight: 600; color: #181D27">9 rows need a fix before they can import</span>'
            f'<span style="font-size: 14px; color: #535862">The other 217 rows are fine. Row numbers match your spreadsheet.</span></div>'
            f'<div style="margin: 4px 24px 0; padding: 16px 18px; border-radius: 12px; box-shadow: inset 0 0 0 1px #FECDCA; background: #FEF3F2; display: flex; flex-direction: column; gap: 12px">'
            f'<span style="font-size: 15px; font-weight: 600; color: #B42318">Destination must start with https:// or http://.</span>'
            f'<span style="font-size: 13px; color: #535862">e.g. <span style="{MONO}; color: #181D27">glomvo.com/olzik</span></span>'
            f'<span style="{BTN_P}; align-self: flex-start; box-shadow: 0 0 0 4px {TEAL}">Add https:// to all 9</span></div>'
            f'<div style="margin-top: 18px; padding: 14px 24px; border-top: 1px solid #EAECF0; display: flex; gap: 10px; align-items: center; font-size: 13px">'
            f'<span style="{BTN_S}; height: 34px; font-size: 13px">Download the rows with a note on each</span><span style="{BTN_S}; height: 34px; font-size: 13px">Upload fixed file</span>'
            f'<span style="flex: 1"></span><span style="font-weight: 600; color: #535862">Skip 9 rows and review</span></div>')


@F('w46-Fix', 'One click fixes them all')
def _fix():
    m = modal(errors_step(), 660, 110)
    inner = (eyebrow('STEP 2 · THE IMPORT', dark=True) + progress(2)
             + dash_with_modal('Links', ['Links', 'Import CSV'], links_page(), m)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


def review_step():
    row = lambda a, b, c: (f'<div style="display: grid; grid-template-columns: 1fr 80px 120px; padding: 9px 0; border-top: 1px solid #EAECF0; font-size: 14px; color: #344054">'
                           f'<span>{a}</span><span style="text-align: right">{b}</span><span style="text-align: right">{c}</span></div>')
    return (f'<div style="padding: 20px 24px 10px; display: flex; flex-direction: column; gap: 12px"><span style="font-size: 18px; font-weight: 600; color: #181D27">Adds 214 domains and 214 links, updates 0 links</span>'
            f'<div><div style="display: grid; grid-template-columns: 1fr 80px 120px; padding-bottom: 6px; font-size: 12px; font-weight: 500; color: #717680"><span>In this file</span><span style="text-align: right">Rows</span><span style="text-align: right">New · updated</span></div>'
            + row('Whole-domain links', '226', '214 · 0') + row('Path links', '0', '0 · 0') + '</div>'
            f'<div style="display: flex; gap: 12px; padding: 12px 14px; border-radius: 12px; box-shadow: 0 0 0 3px {TEAL}"><span style="width: 18px; height: 18px; flex: none; margin-top: 2px; border-radius: 5px; background: #1C6DB6"></span>'
            f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 14px; font-weight: 600; color: #181D27">Leave out 12 www rows their root already covers</span>'
            f'<span style="font-size: 13px; color: #535862; line-height: 1.45"><span style="{MONO}">kipzoo.com</span> covers <span style="{MONO}">www.kipzoo.com</span> automatically, so rows going to the same place add nothing.</span></div></div>'
            f'<div style="display: flex; justify-content: space-between; font-size: 14px; color: #344054"><span style="font-weight: 600">Where the links are</span><span>214 domains, 214 new</span></div>'
            f'<span style="font-size: 13px; color: #535862">214 new domains need a DNS record before their links work. They are added to Hostnames on import, so you can set DNS right after.</span></div>'
            f'<div style="padding: 12px 24px; border-top: 1px solid #EAECF0; display: flex; justify-content: flex-end; gap: 10px"><span style="{BTN_S}">Cancel</span><span style="{BTN_P}">Import 214 changes</span></div>')


@F('w46-Review', 'It shows what the file will do')
def _review():
    m = modal(review_step(), 640, 20)
    inner = (eyebrow('STEP 2 · THE IMPORT', dark=True) + progress(2)
             + dash_with_modal('Links', ['Links', 'Import CSV'], links_page(), m)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


def hostnames_body():
    hosts = [(KIP, 'Waiting for DNS'), ('tumbrik.com', 'Connected'), ('olzik.com', 'Connected'), ('zentvy.com', 'Waiting for DNS'), ('yobzi.com', 'Waiting for DNS'),
             ('gozvu.com', 'Connected'), ('savvlo.com', 'Waiting for DNS'), ('grolvi.com', 'Waiting for DNS')]
    badge = lambda s: (f'<span style="font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; '
                       + ('background: #ECFDF3; color: #067647' if s == 'Connected' else 'background: #F2F4F7; color: #475467') + f'">{s}</span>')
    rows = ''.join(f'<div style="display: flex; align-items: center; gap: 14px; height: 54px; padding: 0 20px; border-bottom: 1px solid #EAECF0; background: {"#F5F9FC" if n == KIP else "#FFFFFF"}">'
                   f'<span style="{MONO}; font-size: 15px; width: 230px; color: #181D27">{n}</span>{badge(s)}<span style="flex: 1"></span>'
                   + (f'<span style="{BTN_S}; height: 32px; font-size: 13px">Connect DNS</span>' if s != 'Connected' else '') + '</div>' for n, s in hosts)
    tab = lambda t, on: (f'<span style="flex: 1; text-align: center; padding: 8px 0; border-radius: 8px; font-size: 14px; font-weight: 600; '
                         + ('background: #FFFFFF; color: #181D27; box-shadow: 0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0' if on else 'color: #717680') + f'">{t}</span>')
    panel = (f'<div style="width: 420px; flex: none; border-left: 1px solid #EAECF0; background: #FFFFFF; padding: 22px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px">'
             f'<span style="font-size: 16px; font-weight: 600; color: #181D27">Connect DNS · <span style="{MONO}">{KIP}</span></span>'
             f'<div style="display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #F2F4F7">{tab("Automatic", True)}{tab("Manual", False)}</div>'
             f'<div style="display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; box-shadow: 0 0 0 3px {TEAL}">'
             f'<span style="width: 34px; height: 34px; border-radius: 8px; background: #F2F4F7"></span><span style="font-size: 15px; font-weight: 600; color: #181D27">Cloudflare</span>'
             f'<span style="flex: 1"></span><span style="{BTN_P}; height: 34px">Connect</span></div>'
             f'<span style="font-size: 13px; color: #535862; line-height: 1.5">Elsewhere: Manual shows the record to add at your DNS host.</span></div>')
    return f'<div style="flex: 1; display: flex"><div style="flex: 1; padding: 18px 24px"><div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{rows}</div></div>{panel}</div>'


@F('w46-PointDNS', 'Step three: point the names')
def _point():
    sh = shell('Hostnames', ['Hostnames'], '', hostnames_body())
    inner = (eyebrow('STEP 3 · POINT THE NAMES', dark=True) + progress(3)
             + dashboard(sh, 120, 170, 1.15, 1400, 633)
             + caption('A domain that is still waiting doesn’t hold up the others.', y=910, size=28, color=G600))
    return frame('light', inner)


@F('w46-Padlocks', 'Every door opens, padlock included')
def _padlocks():
    names = WALL
    doors = ''.join(place(150 + (k % 6) * 290, 260 + (k // 6) * 330, door(120, 'open', label=n, uid=str(k))) for k, n in enumerate(names))
    inner = headline('Each padlock set up, and renewed for it.', y=130, size=60, w=1600) + doors
    return frame('glow-teal', inner)


# ================================================================ ACT F · Hearing the knock
@F('w46-Knocks', 'Sixty-three knocks')
def _knocks():
    inner = (f'<div style="position: absolute; left: 120px; top: 260px; width: 640px; height: 230px">{place(0, 70, name_tile(KIP, 600, visits=63))}{place(400, 0, sticky("drop list?", 200, strike=True))}</div>'
             + f'<div style="position: absolute; left: 120px; top: 520px; display: flex; align-items: center; gap: 16px">{ex_label(light=False)}'
             f'<span style="font-size: 24px; color: {INK_SOFT}">Channel: Direct</span></div>'
             + caption('Nobody sent those people. They typed it in.', x=120, y=640, w=740, size=44)
             + place(1150, 190, door(300, 'open', knock=3, label=KIP)))
    return frame('charcoal', inner)


@F('w46-Price', 'A real price')
def _price():
    inner = (headline('So kipzoo got a real price.', y=150, size=60)
             + f'<div style="position: absolute; left: 360px; top: 270px">{lander_browser(1200, 640, price=True, shadow="0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06)")}</div>')
    return frame('light', inner)


@F('w46-Quiet', 'Where to look first')
def _quiet():
    rows = [(KIP, 63), ('tumbrik.com', 21), ('olzik.com', 9), ('zentvy.com', 4), ('savvlo.com', 2), ('gozvu.com', 0), ('grolvi.com', 0), ('yobzi.com', 0)]
    card = visits_card(rows, 820, row_h=60)
    bracket = f'<div style="position: absolute; left: 126px; top: {200 + 60 + 44 + 5 * 60 + 6}px; width: 808px; height: 172px; border-radius: 14px; box-shadow: 0 0 0 3px {AMBER}"></div>'
    inner = (place(120, 200, card) + bracket + place(120, 900, ex_label())
             + headline('Quiet all season?', x=1060, y=520, size=56, w=740)
             + caption('At renewal time, Glomvo knows where to look first.', x=1060, y=610, w=740, size=36, color=G600))
    return frame('light', inner)


def bulk_modal():
    return (f'<div style="padding: 22px 24px 8px; display: flex; flex-direction: column; gap: 14px"><span style="font-size: 18px; font-weight: 600; color: #181D27">Change destination</span>'
            f'<div style="display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #F2F4F7"><span style="flex: 1; text-align: center; padding: 7px 0; border-radius: 8px; font-size: 14px; font-weight: 600; background: #FFFFFF; color: #181D27; box-shadow: 0 0 0 1px #EAECF0">Replace URL</span>'
            f'<span style="flex: 1; text-align: center; padding: 7px 0; font-size: 14px; font-weight: 600; color: #717680">Find and replace</span></div>'
            f'<span style="{LBL}">New destination URL</span><div style="{INP}; {MONO}; font-size: 15px">https://{MARKET}/glomvo</div>'
            f'<span style="font-size: 13px; color: #535862; line-height: 1.45">Domain redirects keep their path and query forwarding. Only the target changes.</span></div>'
            f'<div style="padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px"><span style="{BTN_S}">Cancel</span><span style="{BTN_P}; box-shadow: 0 0 0 4px {TEAL}">Update 128 links</span></div>')


@F('w46-ByTag', 'Filter by the tag, change it once')
def _bytag():
    top = (f'<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px"><span style="{BTN_S}; height: 34px; font-size: 13px">Tags: {tag_chip("Brandables", 12)}</span>'
           f'<span style="font-size: 14px; font-weight: 600; color: #181D27">128 links selected</span><span style="{BTN_S}; height: 34px; font-size: 13px">Change destination</span></div>')
    body = f'<div style="flex: 1; display: flex; flex-direction: column; padding: 18px 24px">{top}<div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{links_rows(8, sel=True, tagf="Brandables")}</div></div>'
    inner = (headline('Filter by the tag. Change it once.', y=100, size=52, w=1500)
             + dash_with_modal('Links', ['Links'], body, modal(bulk_modal(), 560, 90), s=1.12, y=200)
             + place(1680, 910, ex_label()))
    return frame('light', inner)


# ================================================================ ACT G · Close
@F('w46-Recap', 'List · Import · Point · Listen')
def _recap():
    icons = [scaled(sheet(420, rows=sheet_rows()[:3], show_more=False, row_h=40), 0.62, 476, 260),
             f'<div style="width: 296px; height: 200px; display: flex; align-items: center; justify-content: center"><span style="{BTN_P}; height: 64px; font-size: 26px; padding: 0 30px">Import CSV</span></div>',
             f'<div style="width: 238px; height: 130px; display: flex; align-items: center; justify-content: center">{door(110, "open", uid="r")}</div>',
             f'<div style="width: 238px; height: 130px; display: flex; align-items: center; justify-content: center">{door(110, "open", knock=2, uid="r2")}</div>']
    steps = ''.join(f'<div style="display: flex; flex-direction: column; align-items: center; gap: 28px; width: 360px"><div data-ui="icon" style="height: 240px; display: flex; align-items: center">{ic}</div>'
                    f'<span style="font-size: 64px; font-weight: 800; letter-spacing: -0.03em">{t}</span></div>' for ic, t in zip(icons, ('List', 'Import', 'Point', 'Listen')))
    inner = f'<div style="position: absolute; left: 120px; top: 300px; width: 1680px; display: flex; justify-content: space-between">{steps}</div>'
    return frame('radial', inner)


@F('w46-YourNames', 'Would the door open?')
def _yours():
    doors = f'<div style="position: absolute; left: 160px; top: 170px; opacity: 0.45">{door(170, "open", label=KIP, uid="y")}</div>'
    doors += ''.join(place(620 + k * 280, 170, door(190, 'closed', uid=f'y{k}')) for k in range(4))
    inner = (f'<span style="position: absolute; left: 120px; top: 92px; display: inline-flex; align-items: center; height: 52px; padding: 0 24px; border-radius: 26px; background: rgba(255,255,255,0.10); '
             f'font-size: 25px; font-weight: 600; color: {INK_SOFT}">An aside: Glomvo isn’t a real company.</span>'
             + doors
             + headline('Your names. Which one would a founder type in tonight? And would the door open?', x=120, y=680, size=56, w=1560))
    return frame('evening', inner)


QR_SLOT = ('<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B7A90" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect>'
           '<rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3M21 14v.01M14 21h7v-4"></path></svg>')


@F('w46-EndCard', 'End card')
def _end():
    inner = (f'<div style="position: absolute; left: 140px; top: 170px; display: flex; flex-direction: column">'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em">Every door.</span>'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em; color: {TEAL}">Open.</span></div>'
             f'<span style="position: absolute; left: 140px; top: 480px; font-size: 32px; color: {INK_SOFT}">Links are in the description.</span>'
             f'<div style="position: absolute; left: 140px; top: 820px; width: 300px">{RH_WORDMARK}</div>'
             f'<div style="position: absolute; left: 560px; top: 800px; width: 230px; height: 100px; box-sizing: border-box; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.22); background: rgba(255,255,255,0.10); '
             f'display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0 16px">{QR_SLOT}'
             f'<span style="font-size: 17px; font-weight: 700; color: {INK_SOFT}; line-height: 1.25">Dynamic QR · link pending</span></div>')
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
        ('light', 'Light', 'Glomvo, renewals, the honest note, the steps, price, quiet'),
        ('evening', 'Evening (new)', 'The notebook, the weight, all of Act C, your names'),
        ('charcoal', 'Charcoal', 'Parking, the door is born, the knocks'),
        ('glow-teal', 'Glow, teal', 'Every padlock lit, end card'),
        ('sweep', 'Brand sweep', 'Title'),
        ('radial', 'Brand radial', 'The recap')))
    roles = ''.join(f'<div style="display: flex; align-items: center; gap: 12px"><span style="width: 40px; height: 40px; flex: none; border-radius: 11px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>'
                    f'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 19px; font-weight: 700">{n}</span><span style="font-size: 15px; color: {INK_SOFT}">{r}</span></div></div>'
                    for c, n, r in ((TEAL, 'Teal', 'fixed: a lit door, the fix'), (RED, 'Signal red', 'the warning page only'), (AMBER, 'Amber', 'twice in the film: one visitor, the quiet names'),
                                    (BLUE, 'Blue', 'inside product UI only'), ('#FBF7EF', 'Paper', 'the founder’s notebook'), ('#1E2A44', 'Door navy', 'the closed leaf, every slot')))
    grammar = (('Cut on the beat', 'every act break'), ('Shared-element morph', 'the wall becomes the sheet (Title); the tile becomes a door (Door)'),
               ('Dock', 'dialogs come forward over the dimmed dashboard'), ('Draw', 'three registrar lines merge into one sheet (Once)'),
               ('Focus rack', 'plain address vs https (Two results)'), ('Register change', 'the honest note; “isn’t a real company”'),
               ('Silence', 'after “Glomvo never finds out”; the end card'), ('Knock (new)', 'three arcs leave a door’s edge: someone came looking. Never decoration.'))
    grows = ''.join(f'<div style="display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 14px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.10)">'
                    f'<span style="font-size: 17px; font-weight: 700; color: {TEAL if "new" in a else INK}">{a}</span><span style="font-size: 16px; line-height: 1.35; color: {INK_SOFT}">{b}</span></div>' for a, b in grammar)
    g = ''.join(f'<span style="width: 40px; height: 40px; border-radius: 11px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>' for c in GLOMVO.values())
    inner = (f'<div style="position: absolute; left: 120px; top: 70px; font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {INK_SOFT}">SYSTEM · W46</div>'
             f'<span style="position: absolute; left: 120px; top: 112px; font-size: 52px; font-weight: 800; letter-spacing: -0.03em">A quiet portfolio inside the RedirHub frame.</span>'
             f'<div style="position: absolute; left: 120px; top: 210px; width: 1680px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px">{tiles}</div>'
             f'<div style="position: absolute; left: 120px; top: 440px; width: 1680px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12)">{roles}</div>'
             f'<div style="position: absolute; left: 120px; top: 550px; width: 1680px; display: grid; grid-template-columns: 0.9fr 1.35fr 0.9fr; gap: 44px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12)">'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">TYPE</span>'
             f'<span style="font-size: 23px; font-weight: 800; letter-spacing: -0.02em">Plus Jakarta Sans: the film’s words</span>'
             f'<span style="{MONO}; font-size: 18px">JetBrains Mono: every domain, in full</span>'
             f'<span data-ui="sample" style="{UI}; font-size: 19px; color: {INK_SOFT}">Inter: product and recreated web UI</span>'
             f'<span data-logo style="{SERIF}; font-size: 26px; color: {INK_SOFT}">Instrument Serif: Glomvo’s wordmark only</span>'
             f'<span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}; margin-top: 12px">GLOMVO ONLY</span><div data-shop style="display: flex; gap: 10px">{g}</div></div>'
             f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">MOTION GRAMMAR</span>{grows}</div>'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">CHANGED FROM W44</span>'
             f'<span style="font-size: 17px; line-height: 1.5; color: {INK_SOFT}">Quieter: Glow red is gone (no melt here); an Evening room carries Act C. Browsers lose their coloured dots. Fredoka and the pink-and-blue shop palette give way to Glomvo’s serif and stone. One new move, the knock. Dialogs dock forward at 1.45× so their words read. Nothing tilts.</span></div></div>')
    return board(inner)


@F('w46-Sound', 'Sound, voice and timing')
def _sound():
    rows = (('Whoosh', 'Twice only: into the title (beat 4), into the dashboard (beat 18).'),
            ('Low tone', 'One soft tone as the warning page lands (beat 10).'),
            ('Silence', '1.5 s after “Glomvo never finds out.” No pad, no cue.'),
            ('Knock (new)', 'A soft two-tap, felt more than heard: on “hear when someone knocks” (beat 11) and on the 63 visits (beat 25).'),
            ('Fixed chime', 'Once: the padlocks lighting (beat 24), the first and only fix the film celebrates.'),
            ('Music', 'A generated pad (kind “pad”), about 16 LU under the voice. Out for the end card.'))
    srows = ''.join(f'<div style="display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 20px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.12)">'
                    f'<span style="font-size: 23px; font-weight: 700">{a}</span><span style="font-size: 18px; line-height: 1.4; color: {INK_SOFT}">{b}</span></div>' for a, b in rows)
    voice = (('A · Imagine', 'softly · warm · thoughtful'), ('B · Waiting', 'plain · matter-of-fact'), ('C · Founder', 'plain · curious · quiet'),
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
             f'<span style="font-weight: 700; font-size: 19px; color: {TEAL}">Changed from W44</span><span style="font-size: 17px; line-height: 1.45; color: {INK_SOFT}">No shimmer, rewind, snap or sparkle. One new cue, the knock. The chime keeps its meaning (fixed). The narrator says “kipzoo”, never https, www or a path. No audio made in this pass.</span></div></div></div>')
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
