from w46_base import *

# ================================================================ W46 cast and props (defined once, reused by every frame)
# Glomvo: a small, serious team that holds names. Its logo is the wordmark alone (Leo, Review 2: no icon). Its own palette and its one prop typeface (Instrument Serif) live only
# inside its own things ([data-shop] / [data-logo]); around them the film stays RedirHub.
GLOMVO = dict(ink='#2B2722', stone='#F4F0E8', linen='#E7E0D4', pebble='#A79F92')
SHOP_HEX = ' '.join(v[1:] for v in GLOMVO.values())
SERIF = "font-family: 'Instrument Serif', Georgia, serif"
PAPER, PAPER2, NOTE, PINK_INK, PEN, PEN2, PEN3, COVER = '#FBF7EF', '#F4EFE6', '#FFF4D6', '#3B3A36', '#3B3A36', '#6B675F', '#8A8478', '#1E2A44'

KIP = 'kipzoo.com'
LANDER = 'glomvo.com/kipzoo'
MARKET = 'marketplace.example'
# Every name below was checked on 2026-11-06 (open-questions.md, D-1): NXDOMAIN, and unregistered at the registry,
# except kipzoo.com, which the brief fixes: NXDOMAIN, but registered and on hold (flagged, fallbacks listed).
BRANDABLES = ['tumbrik.com', 'zentvy.com', 'savvlo.com', 'grolvi.com', 'zinnobi.com', 'quellox.com', 'mobvra.com', 'bazlio.com', 'rimboa.com', 'jubrik.com']
SHORTS = ['olzik.com', 'gozvu.com', 'yobzi.com']
WALL = ['tumbrik.com', 'olzik.com', 'zentvy.com', 'savvlo.com', 'gozvu.com', 'grolvi.com', KIP, 'zinnobi.com', 'quellox.com', 'yobzi.com', 'mobvra.com', 'bazlio.com']
TAGOF = {KIP: 'Brandables', 'olzik.com': 'Short', 'gozvu.com': 'Short', 'yobzi.com': 'Premium'}


def ex_label(text='Example', light=True):
    """The small label every number that isn't a fact carries."""
    bg, fg = ('#FFFFFF', G600) if light else ('rgba(255,255,255,0.10)', INK_SOFT)
    sh = 'box-shadow: 0 0 0 1px #EAECF0; ' if light else ''
    return (f'<span style="display: inline-flex; align-self: flex-start; width: max-content; align-items: center; height: 30px; padding: 0 12px; border-radius: 15px; background: {bg}; {sh}font-size: 15px; font-weight: 700; '
            f'letter-spacing: 0.08em; color: {fg}; white-space: nowrap">{text.upper()}</span>')


# ---------------------------------------------------------------- Glomvo: mark, wordmark, lander
def glomvo_logo(size=40, dark=False, note=True):
    g = GLOMVO
    c = g['stone'] if dark else g['ink']
    sub = (f'<span style="{SERIF}; font-style: italic; font-size: {size * 0.36:.0f}px; color: {c}; opacity: 0.72; white-space: nowrap">names, held with care</span>' if note else '')
    return (f'<div data-logo data-shop style="display: inline-flex; flex-direction: column; gap: {size * 0.12:.0f}px">'
            f'<span style="{SERIF}; font-size: {size}px; line-height: 1; letter-spacing: 0.01em; color: {c}">Glomvo</span>{sub}</div>')


def lander(name=KIP, w=980, h=560, price=False, sold=False):
    """Glomvo's for-sale page: the same component every time (the name, a price or make-offer area, a contact line)."""
    g = GLOMVO
    if price:
        # "Write to us" shares the buttons' cell, hidden (--o-write, 0 unset), so a scene can morph one into the other;
        # the buttons are hooks buy and offer
        offer = (f'<div style="display: grid; align-items: center"><span style="grid-area: 1 / 1; font-size: 22px; color: {g["ink"]}; opacity: calc(0.8 * var(--o-write, 0))">Interested? Write to us.</span>'
                 f'<div style="grid-area: 1 / 1; display: flex; align-items: center; gap: 18px">'
                 f'<span data-o="buy" style="display: inline-flex; align-items: center; gap: 12px; height: 64px; padding: 0 28px; border-radius: 32px; background: {g["ink"]}; color: {g["stone"]}; font-size: 22px; font-weight: 600">Buy now'
                 f'<span style="display: inline-flex; align-items: center; height: 34px; padding: 0 14px; border-radius: 17px; background: {g["pebble"]}; color: {g["ink"]}; font-size: 15px; font-weight: 600; letter-spacing: 0.04em">PRICE</span></span>'
                 f'<span data-o="offer" style="display: inline-flex; align-items: center; height: 64px; padding: 0 28px; border-radius: 32px; box-shadow: inset 0 0 0 2px {g["ink"]}; color: {g["ink"]}; font-size: 22px; font-weight: 600">Make an offer</span></div></div>')
    else:
        offer = (f'<span style="font-size: 22px; color: {g["ink"]}; opacity: 0.8">Interested? Write to us.</span>')
    inner = (f'<div data-shop style="position: absolute; inset: 0; background: {g["stone"]}; {UI}; display: flex; flex-direction: column; padding: {h * 0.09:.0f}px {w * 0.08:.0f}px; box-sizing: border-box">'
             f'<div style="display: flex; align-items: center; justify-content: space-between">{glomvo_logo(26, note=False)}'
             f'<span style="font-size: 15px; font-weight: 600; letter-spacing: 0.14em; color: {g["ink"]}; opacity: 0.7">PORTFOLIO</span></div>'
             f'<div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 22px">'
             f'<span style="font-size: 26px; font-weight: 500; letter-spacing: 0.02em; color: {g["ink"]}; opacity: 0.8">This name is available</span>'
             f'<span style="{MONO}; font-size: {w * 0.072:.0f}px; font-weight: 600; letter-spacing: -0.02em; color: {g["ink"]}">{name}</span>{offer}</div>'
             f'<span style="font-size: 17px; color: {g["ink"]}; opacity: 0.75">Questions? <span style="{MONO}">hello@glomvo.com</span></span></div>')
    return f'<div style="position: relative; width: {w}px; height: {h - 64}px">{inner}</div>'


# ---------------------------------------------------------------- the door and the knock (the film's one motif)
# A name is a door: a tall slab with a padlock as its keystone. Closed: dark, outlined. Open: a teal light spills from its
# edge (the padlock is teal). Broken: the light is signal red and the padlock's shackle hangs open. A visit is a knock:
# three arcs leaving the door's edge. The same glyph, small, is the slot on every name tile, so it is there from frame one.
def door(w=200, state='closed', dark=True, knock=0, label=None, uid='', show_knock=True):
    """The motif, kept minimal (Leo, Review 2). A name is an arched doorway with a small padlock at its centre.
    closed: a thin outline, the padlock drawn in outline (unlit). open: the arch fills with teal light, a soft glow
    around it, the padlock solid white (the door opens properly, padlock included). broken (unused in frames): the
    same in signal red, shackle sprung. knock=n: n thin arcs leave the door's right edge (someone came looking).
    No floor, no leaf, no handle: one shape, one lock, one gesture."""
    dw = w * 0.8
    dh = dw * 1.6
    pad = w * 0.12
    x0, y0 = (w - dw) / 2, pad
    r = dw / 2
    yb = y0 + dh
    sw = max(1.5, w * 0.012)
    lit = state in ('open', 'broken')
    c = RED if state == 'broken' else TEAL
    c2 = '#E5484D' if state == 'broken' else '#5FD1BE'
    line = 'rgba(255,255,255,0.42)' if dark else G400
    gid = f'd{state}{int(w)}{knock}{uid}'
    arch = f'M{x0:.1f} {yb:.1f}V{y0 + r:.1f}A{r:.1f} {r:.1f} 0 0 1 {x0 + dw:.1f} {y0 + r:.1f}V{yb:.1f}Z'
    out = ''
    if lit:
        out += (f'<defs><linearGradient id="g{gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="{c2}"></stop><stop offset="1" stop-color="{c}"></stop></linearGradient>'
                f'<radialGradient id="h{gid}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="{c}" stop-opacity="0.32"></stop><stop offset="1" stop-color="{c}" stop-opacity="0"></stop></radialGradient></defs>'
                f'<ellipse cx="{w / 2:.1f}" cy="{y0 + dh * 0.55:.1f}" rx="{dw * 0.95:.1f}" ry="{dh * 0.72:.1f}" fill="url(#h{gid})"></ellipse>'
                f'<path d="{arch}" fill="url(#g{gid})"></path>')
    else:
        fill = 'rgba(255,255,255,0.04)' if dark else 'rgba(30,42,68,0.04)'
        out += f'<path d="{arch}" fill="{fill}" stroke="{line}" stroke-width="{sw:.1f}" stroke-linejoin="round"></path>'
    # the padlock, at the door's centre
    lw = dw * 0.24
    lh = lw * 0.76
    cx, ly = w / 2, y0 + dh * 0.52
    ls = max(1.5, w * 0.014)
    shr = lw * 0.28
    sprung = state == 'broken'
    sh_path = (f'M{cx - shr:.1f} {ly:.1f}V{ly - shr * 0.9:.1f}a{shr:.1f} {shr:.1f} 0 0 1 {2 * shr:.1f} 0' + ('' if sprung else f'V{ly:.1f}'))
    sh_tf = f' transform="translate({shr * 0.9:.1f} {-shr * 0.7:.1f})"' if sprung else ''
    if lit:
        out += (f'<path d="{sh_path}" fill="none" stroke="#FFFFFF" stroke-width="{ls * 1.3:.1f}" stroke-linecap="round"{sh_tf}></path>'
                f'<rect x="{cx - lw / 2:.1f}" y="{ly:.1f}" width="{lw:.1f}" height="{lh:.1f}" rx="{lw * 0.16:.1f}" fill="#FFFFFF"></rect>')
    else:
        out += (f'<path d="{sh_path}" fill="none" stroke="{line}" stroke-width="{ls:.1f}" stroke-linecap="round"></path>'
                f'<rect x="{cx - lw / 2:.1f}" y="{ly:.1f}" width="{lw:.1f}" height="{lh:.1f}" rx="{lw * 0.16:.1f}" fill="none" stroke="{line}" stroke-width="{ls:.1f}"></rect>')
    # the knock: thin arcs from the right edge, centred on the lock's height
    kx, ky = x0 + dw + w * 0.02, ly + lh / 2
    for k in range(knock):
        rr = w * (0.16 + 0.15 * k)
        a = 0.62  # half-angle, radians (about 35 degrees)
        import math
        dx, dy = rr * math.cos(a), rr * math.sin(a)
        # data-o="knock{k}": each arc is its own motion hook (export_scenes.py), so a scene can sound the knock arc by arc
        hook = f' data-o="knock{k}"' if show_knock else ''
        out += (f'<path{hook} d="M{kx + dx:.1f} {ky - dy:.1f}A{rr:.1f} {rr:.1f} 0 0 1 {kx + dx:.1f} {ky + dy:.1f}" fill="none" stroke="{TEAL}" '
                f'stroke-opacity="{(1 - k * 0.3) if show_knock else 0:.2f}" stroke-width="{max(1.5, w * 0.016):.1f}" stroke-linecap="round"></path>')
    vbw = w + (w * (0.16 + 0.15 * (knock - 1)) + w * 0.06 if knock else 0)
    vbh = yb + pad
    svg = (f'<svg width="{vbw:.0f}" height="{vbh:.0f}" viewBox="0 0 {vbw:.1f} {vbh:.1f}" aria-hidden="true" style="display: block; flex: none; overflow: visible">{out}</svg>')
    if label:
        return (f'<div style="display: inline-flex; flex-direction: column; align-items: center; gap: 6px; width: {w:.0f}px">{svg}'
                f'<span style="{MONO}; font-size: {max(18, w * 0.11):.0f}px; font-weight: 600; color: {INK if dark else CHAR}; white-space: nowrap">{label}</span></div>')
    return svg


def slot(state='closed', h=44, dark_tile=False):
    """The small door on every name tile: the same arch, filled. closed navy, open teal, broken red."""
    w = h * 0.62
    r = w / 2
    c = {'closed': '#1E2A44', 'open': TEAL, 'broken': RED}.get(state, '#1E2A44')
    return (f'<svg width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.1f} {h:.1f}" aria-hidden="true" style="display: block; flex: none">'
            f'<path d="M0 {h:.1f}V{r:.1f}A{r:.1f} {r:.1f} 0 0 1 {w:.1f} {r:.1f}V{h:.1f}Z" fill="{c}"></path></svg>')


def name_tile(name=KIP, w=440, state='closed', dark=False, extra='', note=None, tagc=None, visits=None, ring=None, dim=False, strike=False):
    """The name tile: identical everywhere it appears (slot, mono name). Options add a tag chip, a sticky note or a visit count."""
    h = w * 0.27
    bg = '#FFFFFF'
    sh = f'0 0 0 4px {ring}, ' if ring else ''
    op = 'opacity: 0.38; ' if dim else ''
    st = 'text-decoration: line-through; text-decoration-thickness: 3px; ' if strike else ''
    chip = ''
    if tagc:
        chip = (f'<span style="margin-left: auto; display: inline-flex; align-items: center; height: {h * 0.3:.0f}px; padding: 0 {h * 0.12:.0f}px; border-radius: {h * 0.15:.0f}px; '
                f'background: {G100}; font-size: {h * 0.15:.0f}px; font-weight: 700; color: {G600}; white-space: nowrap">{tagc}</span>')
    vis = ''
    if visits is not None:
        vis = (f'<span style="margin-left: auto; display: inline-flex; align-items: baseline; gap: 6px; {MONO}; font-size: {h * 0.3:.0f}px; font-weight: 600; color: {TEAL}"><span data-count="visits">{visits}</span>'
               f'<span style="{JAK}; font-size: {h * 0.14:.0f}px; font-weight: 700; color: {G500}">visits</span></span>')
    tile = (f'<div{extra} style="position: relative; {op}width: {w}px; height: {h:.0f}px; box-sizing: border-box; display: flex; align-items: center; gap: {h * 0.22:.0f}px; '
            f'padding: 0 {h * 0.26:.0f}px; border-radius: {h * 0.2:.0f}px; background: {bg}; box-shadow: {sh}{SOFT_SHADOW}">'
            f'{slot(state, h * 0.42)}<span style="{MONO}; {st}font-size: {h * 0.26:.0f}px; font-weight: 600; letter-spacing: -0.01em; color: {CHAR}; white-space: nowrap">{name}</span>{chip}{vis}</div>')
    return tile


def sticky(text, w=220, strike=False):
    # strike: a pen line through the text (data-clipx="strike", so a scene can draw it left to right)
    line = (f'<span data-clipx="strike" style="position: absolute; left: -1px; right: -1px; top: calc(54% - 1px); height: 3px; background: {PINK_INK}"></span>' if strike else '')
    return (f'<div style="width: {w}px; box-sizing: border-box; padding: 18px 20px; background: {NOTE}; box-shadow: 0 14px 30px rgba(16,24,40,0.18); '
            f'font-size: 26px; font-weight: 700; color: {PINK_INK}"><span style="position: relative; display: inline-block">{text}{line}</span></div>')


# ---------------------------------------------------------------- the founder: a notebook and a browser (never a face)
def circle_mark(w, h, color=PEN, sw=4, hook=''):
    """A hand-drawn circle: an ellipse that doesn't quite close. `hook` names it for the scene's draw-on."""
    hk = f' data-draw="{hook}"' if hook else ''
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" aria-hidden="true" style="position: absolute; left: 0; top: 0; overflow: visible">'
            f'<path{hk} d="M{w * 0.55:.0f} {h * 0.04:.0f}C{w * 0.95:.0f} {h * 0.02:.0f} {w * 1.02:.0f} {h * 0.62:.0f} {w * 0.6:.0f} {h * 0.94:.0f}C{w * 0.25:.0f} {h * 1.08:.0f} {-w * 0.04:.0f} {h * 0.72:.0f} {w * 0.05:.0f} {h * 0.38:.0f}'
            f'C{w * 0.12:.0f} {h * 0.1:.0f} {w * 0.4:.0f} {h * 0.0:.0f} {w * 0.7:.0f} {h * 0.12:.0f}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round"></path></svg>')


def notebook(w=1400, h=760, name=None, gone=False, next_name=None):
    """The founder's idea notebook, open: sketches and crossed-out words on the left, the plan on the right. The name line is
    circled: empty in Act A, kipzoo in Act C (crossed out when the founder leaves)."""
    pw = w / 2
    ln = f'repeating-linear-gradient(transparent 0, transparent 47px, rgba(30,42,68,0.10) 47px, rgba(30,42,68,0.10) 48px)'
    pen = lambda t, size=30, extra='': f'<span style="font-size: {size}px; font-weight: 600; color: {PEN}; {extra}">{t}</span>'
    # left page: the idea, sketched
    sketch = (f'<svg width="300" height="200" viewBox="0 0 300 200" aria-hidden="true"><rect x="8" y="10" width="140" height="180" rx="22" fill="none" stroke="{PEN2}" stroke-width="3"></rect>'
              f'<circle cx="78" cy="70" r="28" fill="none" stroke="{PEN2}" stroke-width="3"></circle><path d="M40 130h76M40 150h52" stroke="{PEN2}" stroke-width="3" stroke-linecap="round"></path>'
              f'<path d="M190 40q40 -10 70 20M190 90q50 0 80 30M190 140q30 10 60 0" fill="none" stroke="{PEN3}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 9"></path></svg>')
    left = (f'<div style="position: absolute; left: 0; top: 0; width: {pw:.0f}px; height: {h}px; box-sizing: border-box; padding: 60px 70px; background: {PAPER}; background-image: {ln}">'
            f'<div style="display: flex; flex-direction: column; gap: 18px">{pen("the idea", 26, f"letter-spacing: 0.12em; text-transform: uppercase; color: {PEN3}")}'
            f'{pen("Snacks for kids who love animals", 36)}'
            f'{pen("subscription box?", 30, "text-decoration: line-through; text-decoration-thickness: 3px; color: " + PEN3)}'
            f'{pen("a little app that comes with it", 30)}'
            f'<div style="margin-top: 14px">{sketch}</div></div></div>')
    # right page: the plan; the first line is the name
    nm = name or ''
    circ_w, circ_h = 420, 104
    name_line = (f'<div style="position: relative; width: {circ_w}px; height: {circ_h}px; display: flex; align-items: center; justify-content: center">'
                 + (f'<span style="{MONO}; font-size: 40px; font-weight: 600; color: {PEN}; {"text-decoration: line-through; text-decoration-thickness: 4px; text-decoration-color: " + PEN2 if gone else ""}">{nm}</span>' if nm else
                    f'<span data-o="blank" style="width: 260px; height: 0; border-bottom: 3px dashed {PEN3}; margin-top: 20px"></span>')
                 + circle_mark(circ_w, circ_h, PEN if not gone else PEN3, 4, hook='circle') + '</div>')
    nxt = ''
    if next_name:
        nxt = (f'<div style="display: flex; align-items: center; gap: 16px; margin-left: 30px">{pen("try:", 26, f"color: {PEN3}")}'
               f'<span style="{MONO}; font-size: 30px; font-weight: 600; color: {PEN}">{next_name}</span></div>')
    plan = ''.join(f'<div style="display: flex; align-items: baseline; gap: 18px">{pen(str(i + 2) + ".", 28, f"color: {PEN3}")}{pen(t, 30)}</div>'
                   for i, t in enumerate(['logo', 'first 100 customers', 'launch in spring']))
    right = (f'<div style="position: absolute; left: {pw:.0f}px; top: 0; width: {pw:.0f}px; height: {h}px; box-sizing: border-box; padding: 60px 70px; background: {PAPER}; background-image: {ln}; '
             f'box-shadow: inset 18px 0 30px -18px rgba(30,42,68,0.25)">'
             f'<div style="display: flex; flex-direction: column; gap: 22px">{pen("the plan", 26, f"letter-spacing: 0.12em; text-transform: uppercase; color: {PEN3}")}'
             f'<div style="display: flex; align-items: center; gap: 22px">{pen("1.", 28, f"color: {PEN3}")}{pen("the name", 34, "white-space: nowrap")}{name_line}</div>{nxt}{plan}</div></div>')
    return (f'<div style="position: relative; width: {w}px; height: {h}px; border-radius: 10px; box-shadow: 0 0 0 10px {COVER}, 0 50px 110px rgba(0,0,0,0.45)">{left}{right}</div>')


def warning_page(w, h, name=KIP):
    """A generic 'this connection isn't private' page: no browser's wording, colours or icon."""
    return (f'<div style="width: {w}px; height: {h - 64}px; background: #F9FAFB; display: flex; align-items: center; justify-content: center">'
            f'<div style="width: {w * 0.62:.0f}px; display: flex; flex-direction: column; gap: 22px">'
            f'<svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="{RED}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"></path><path d="M12 8v5M12 16.5h.01"></path></svg>'
            f'<span style="font-size: {w * 0.036:.0f}px; font-weight: 700; color: #181D27; line-height: 1.15">This connection isn’t secure</span>'
            f'<span style="font-size: {w * 0.019:.0f}px; color: #475467; line-height: 1.5">The site at <span style="{MONO}">{name}</span> didn’t show a valid certificate. Someone could be pretending to be it.</span>'
            f'<div style="display: flex; gap: 14px; margin-top: 8px"><span style="display: inline-flex; align-items: center; height: 48px; padding: 0 22px; border-radius: 10px; background: #344054; color: #FFFFFF; font-size: 18px; font-weight: 600">Go back</span>'
            f'<span style="display: inline-flex; align-items: center; height: 48px; padding: 0 22px; border-radius: 10px; box-shadow: inset 0 0 0 1px #D0D5DD; color: #344054; font-size: 18px; font-weight: 600">Details</span></div></div></div>')


def bar_url(text, lock=True, broken=False):
    """Address-bar content: a generic lock (or a red broken lock) and the address, in mono."""
    if broken:
        ic = (f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="{RED}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 7.5-2"></path></svg>')
        return f'{ic}<span style="color: {RED}; font-weight: 600">Not secure</span><span style="color: #98A2B3">|</span>{text}'
    return text


def browser2(url_html, inner, x, y, w, h, extra='', shadow=DARK_SHADOW, bar=64, size=19):
    """browser() with full control over the address bar (no automatic padlock)."""
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else 'position: relative; '
    return (f'<div data-ui="website"{extra} style="{pos}width: {w}px; height: {h}px; border-radius: 24px; overflow: hidden; '
            f'background: #FFFFFF; box-shadow: {shadow}; {UI}; color: {CHAR}">'
            f'<div style="height: {bar}px; display: flex; align-items: center; gap: 16px; padding: 0 22px; border-bottom: 1px solid {G200}; box-sizing: border-box">'
            '<div style="display: flex; gap: 8px"><span style="width: 13px; height: 13px; border-radius: 50%; background: #D0D5DD"></span>'
            '<span style="width: 13px; height: 13px; border-radius: 50%; background: #D0D5DD"></span><span style="width: 13px; height: 13px; border-radius: 50%; background: #D0D5DD"></span></div>'
            f'<div style="flex: 1; height: {bar - 24}px; border-radius: {(bar - 24) // 2}px; background: {G100}; display: flex; align-items: center; gap: 10px; padding: 0 18px; {MONO}; font-size: {size}px; color: {G700}">'
            f'{url_html}</div></div>{inner}</div>')


# ---------------------------------------------------------------- three registrar accounts: generic forwarding forms, three neutral styles
def registrar(style, names, x=None, y=None, w=500, label='Registrar A', status=None):
    """Three unbranded registrar forwarding forms. style 'a' light card, 'b' dark header, 'c' dense table. No real logos or copy."""
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else 'position: relative; '
    rows = ''
    for n in names:
        st = ''
        if status:
            ok = status.get(n)
            if ok is not None:
                st = (f'<span style="margin-left: auto; font-size: 13px; font-weight: 700; color: {"#067647" if ok else "#B42318"}">{"Saved" if ok else "No HTTPS"}</span>')
        rows += (f'<div style="display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 14px; border-top: 1px solid #EAECF0; font-size: 14px; color: #344054">'
                 f'<span style="{MONO}; font-size: 14px; color: #181D27">{n}</span><span style="color: #98A2B3">forwards to</span>'
                 f'<span style="{MONO}; font-size: 13px; color: #475467; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">glomvo.com/…</span>{st}</div>')
    head = {
        'a': (f'<div style="display: flex; align-items: center; gap: 10px; padding: 16px 16px 12px"><span style="width: 26px; height: 26px; border-radius: 7px; background: #D0D5DD"></span>'
              f'<span style="font-size: 16px; font-weight: 700; color: #181D27">{label}</span><span style="margin-left: auto; font-size: 13px; color: #667085">Domain forwarding</span></div>', '#FFFFFF', '16px'),
        'b': (f'<div style="display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #344054; color: #FFFFFF"><span style="width: 24px; height: 24px; border-radius: 50%; background: #98A2B3"></span>'
              f'<span style="font-size: 16px; font-weight: 700">{label}</span><span style="margin-left: auto; font-size: 13px; color: #D0D5DD">Forwarding</span></div>', '#F9FAFB', '10px'),
        'c': (f'<div style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 2px solid #344054"><span style="width: 22px; height: 22px; background: #667085"></span>'
              f'<span style="font-size: 15px; font-weight: 800; letter-spacing: 0.04em; color: #181D27">{label.upper()}</span><span style="margin-left: auto; font-size: 12px; color: #667085">URL forwarding · Settings</span></div>', '#FFFFFF', '4px'),
    }[style]
    return (f'<div data-ui="registrar" style="{pos}width: {w}px; box-sizing: border-box; overflow: hidden; border-radius: {head[2]}; background: {head[1]}; '
            f'box-shadow: 0 24px 60px rgba(0,0,0,0.30), 0 0 0 1px rgba(16,24,40,0.10); {UI}">{head[0]}{rows}</div>')


# ---------------------------------------------------------------- the spreadsheet (generic: no spreadsheet app's look)
COLS = ['source_url', 'destination', 'type', 'tags']


def sheet_rows():
    rows = [(KIP, f'https://{LANDER}', '302', 'Brandables'),
            ('tumbrik.com', 'https://glomvo.com/tumbrik', '302', 'Brandables'),
            ('olzik.com', 'https://glomvo.com/olzik', '302', 'Short'),
            ('zentvy.com', 'https://glomvo.com/zentvy', '302', 'Brandables'),
            ('yobzi.com', f'https://{MARKET}/yobzi', '302', 'Premium'),
            ('gozvu.com', 'https://glomvo.com/gozvu', '302', 'Short'),
            ('savvlo.com', 'https://glomvo.com/savvlo', '302', 'Brandables'),
            ('grolvi.com', 'https://glomvo.com/grolvi', '302', 'Brandables')]
    return rows


TAG_COL = {'Brandables': ('#E8F0F8', '#1962A4'), 'Short': ('#ECFDF3', '#067647'), 'Premium': ('#F2F4F7', '#344054')}


def tag_chip(t, size=15):
    bg, fg = TAG_COL[t]
    return (f'<span style="display: inline-flex; align-items: center; height: {size * 1.75:.0f}px; padding: 0 {size * 0.7:.0f}px; border-radius: {size * 0.9:.0f}px; background: {bg}; '
            f'color: {fg}; font-size: {size}px; font-weight: 600; white-space: nowrap">{t}</span>')


def sheet(w=1440, rows=None, upto=4, hi_col=None, hi_row=None, file='glomvo-portfolio.csv', show_more=True, row_h=56, fix_col=None, hooks=False):
    """A generic spreadsheet: column letters, a header row in mono (the real import columns), rows in mono.
    hooks: each column's tint follows --tint-k (0 none … 1 tinted; unset = as hi_col) and each body row is data-o="row{i}",
    so a scene can move the tint between columns and bring the rows in (export_scenes.py)."""
    rows = rows or sheet_rows()
    widths = [0.24, 0.42, 0.11, 0.23]
    cw = [w * p for p in widths]
    num_w = 56
    letters = ''.join(f'<span style="width: {c:.0f}px; flex: none; text-align: center; font-size: 13px; color: #98A2B3; border-left: 1px solid #EAECF0">{L}</span>' for c, L in zip(cw, 'ABCD'))
    def cell(text, k, head=False, faded=False):
        on = hi_col is not None and k in (hi_col if isinstance(hi_col, (list, tuple)) else [hi_col])
        bg = 'rgba(32,167,149,0.10)' if on else ('#F9FAFB' if head else 'transparent')
        if hooks:  # the same colours, mixed by the column's tint variable (default: as approved)
            v = f'var(--tint-{k}, {1 if on else 0})'
            bg = (f'color-mix(in srgb, rgba(32,167,149,0.10) calc({v} * 100%), {"#F9FAFB" if head else "transparent"})')
        op = 'opacity: 0.25; ' if (k >= upto) else ''
        if k == 3 and not head and text in TAG_COL:
            body = tag_chip(text, 14)
        else:
            col = '#181D27' if head else '#344054'
            body = f'<span style="{MONO}; font-size: {16 if not head else 16}px; font-weight: {700 if head else 500}; color: {col}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{text}</span>'
        return (f'<div style="width: {cw[k]:.0f}px; flex: none; height: {row_h}px; box-sizing: border-box; display: flex; align-items: center; padding: 0 16px; {op}'
                f'background: {bg}; border-left: 1px solid #EAECF0">{body}</div>')
    head = (f'<div style="display: flex; border-top: 1px solid #EAECF0"><span style="width: {num_w}px; flex: none; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #98A2B3; background: #F9FAFB">1</span>'
            + ''.join(cell(c, k, True) for k, c in enumerate(COLS)) + '</div>')
    body = ''
    for i, r in enumerate(rows):
        ring = hi_row is not None and i == hi_row
        rh = f' data-o="row{i}"' if hooks else ''
        body += (f'<div{rh} style="position: relative; display: flex; border-top: 1px solid #EAECF0{"; box-shadow: inset 0 0 0 3px " + TEAL if ring else ""}">'
                 f'<span style="width: {num_w}px; flex: none; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #98A2B3; background: #F9FAFB">{i + 2}</span>'
                 + ''.join(cell(v, k) for k, v in enumerate(r)) + '</div>')
    more = (f'<div style="display: flex; align-items: center; height: 46px; border-top: 1px solid #EAECF0; padding-left: {num_w + 16}px; font-size: 15px; color: #667085">'
            f'… and {226 - len(rows)} more rows</div>' if show_more else '')
    bar = (f'<div style="display: flex; align-items: center; gap: 12px; height: 54px; padding: 0 18px; background: #F2F4F7; border-bottom: 1px solid #EAECF0">'
           f'<span style="width: 22px; height: 26px; border-radius: 4px; background: #D0D5DD"></span><span style="{MONO}; font-size: 16px; color: #344054">{file}</span></div>')
    return (f'<div data-ui="sheet" style="width: {w + num_w}px; overflow: hidden; border-radius: 18px; background: #FFFFFF; box-shadow: 0 40px 100px rgba(16,24,40,0.20), 0 0 0 1px rgba(16,24,40,0.06); {UI}">'
            f'{bar}<div style="display: flex; height: 30px; align-items: center"><span style="width: {num_w}px; flex: none"></span>{letters}</div>{head}{body}{more}</div>')
