#!/usr/bin/env python3
"""W44 key frames: writes style-canvas/project/w44-*.dc.html from shared props.

    python3 youtube/02_videos/2026-W44_change-domain-seo/style-canvas/build_frames.py

Every frame is literal .dc.html markup (no {{holes}}), so it renders in plain Chromium and in the canvas.
The story props (both logos, the pistachio card, the search page, the browser, the dashboard shell) are
defined once here, so they are identical in every frame they appear in. After Review 2 the canvas is the
source: sync Leo's edits back by hand before regenerating.
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'project')

# ---------------------------------------------------------------- tokens
NIGHT, TEAL, RED, AMBER, BLUE = '#0B1426', '#20A795', '#E5484D', '#E59426', '#1C6DB6'
INK, INK_SOFT, INK_MUTE = '#FFFFFF', '#B9C6D8', '#6B7A90'
CHAR, DARK = '#181D27', '#101828'
G700, G600, G500, G400, G300, G200, G100, G50 = '#344054', '#475467', '#667085', '#98A2B3', '#D0D5DD', '#EAECF0', '#F2F4F7', '#F9FAFB'
# Story world palettes: only inside the shops' own sites, logos and props ([data-shop] / [data-logo]).
FROSTY = dict(ice='#E9F7FD', frost='#A5DCF2', glacier='#5BB3D9', ink='#1E3A4C')
VELVET = dict(cream='#F7EEDF', pistachio='#A9C687', leaf='#6F8F4F', cocoa='#5B3A29')
SHOP_HEX = ' '.join(v[1:] for v in list(FROSTY.values()) + list(VELVET.values()))

OLD, NEW = 'getfrostybites.com', 'getvelvetscoop.com'
PIST = '/flavors/pistachio'
MONO = "font-family: 'JetBrains Mono', monospace"
UI = "font-family: 'Inter', sans-serif"
JAK = "font-family: 'Plus Jakarta Sans', system-ui, sans-serif"
FR = "font-family: 'Fraunces', serif; font-variation-settings: 'SOFT' 100, 'opsz' 144"

FONTS = ('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Inter:wght@400;500;600;700'
         '&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Fraunces:opsz,wght,SOFT@9..144,400..800,0..100&amp;display=swap')


def page(title, body, w=1920, h=1080):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="{FONTS}">
<style>
body{{margin:0}}
[style*="JetBrains"]{{font-variant-ligatures:none}}
</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{}};
  }}
}}
</script>
</body>
</html>
'''


# ---------------------------------------------------------------- rooms (W43 recipes, from redirhub.com's stylesheet)
DOTS = ('<div data-bg style="position: absolute; inset: 0; background-image: radial-gradient(rgba(16,24,40,0.10) 1.5px, rgba(0,0,0,0) 1.5px); '
        'background-size: 32px 32px; -webkit-mask-image: radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%); '
        'mask-image: radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%)"></div>')
GRID80 = ('<div data-bg style="position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.045) 1px, rgba(0,0,0,0) 1px), '
          'linear-gradient(90deg, rgba(255,255,255,0.045) 1px, rgba(0,0,0,0) 1px); background-size: 80px 80px; '
          '-webkit-mask-image: radial-gradient(60% 55% at 50% 30%, #000 30%, rgba(0,0,0,0) 75%); mask-image: radial-gradient(60% 55% at 50% 30%, #000 30%, rgba(0,0,0,0) 75%)"></div>')
GRID60 = ('<div data-bg style="position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px), '
          'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px); background-size: 60px 60px; '
          '-webkit-mask-image: radial-gradient(75% 70% at 50% 45%, #000 35%, rgba(0,0,0,0) 85%); mask-image: radial-gradient(75% 70% at 50% 45%, #000 35%, rgba(0,0,0,0) 85%)"></div>')
FLOOR = ('<div data-bg style="position: absolute; left: -400px; right: -400px; top: 640px; height: 900px; transform: perspective(700px) rotateX(62deg); '
         'transform-origin: top center; background-image: linear-gradient(rgba(255,255,255,0.22) 2px, rgba(0,0,0,0) 2px), linear-gradient(90deg, rgba(255,255,255,0.22) 2px, rgba(0,0,0,0) 2px); '
         'background-size: 120px 120px; -webkit-mask-image: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0) 80%); mask-image: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0) 80%)"></div>')

ROOMS = {
    'light': ('linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%)', CHAR, DOTS),
    'mesh': ('radial-gradient(circle at 20% 10%, rgba(229,148,38,0.20) 0%, rgba(229,148,38,0) 34%), radial-gradient(circle at 82% 18%, rgba(32,167,149,0.16) 0%, rgba(32,167,149,0) 30%), linear-gradient(#181D27 0%, #101828 100%)', INK, GRID80),
    'mesh-teal': ('radial-gradient(ellipse 1000px 700px at 60% 55%, rgba(32,167,149,0.22) 0%, rgba(32,167,149,0) 100%), linear-gradient(#181D27 0%, #101828 100%)', INK, GRID80),
    'sweep': ('linear-gradient(163deg, #1C6DB6 0%, #20A795 86%)', INK, FLOOR),
    'radial': ('radial-gradient(111.83% 100% at 50% 100%, #20A795 0%, #1C6DB6 100%)', INK, ''),
    'lab': ('radial-gradient(ellipse 900px 700px at 70% 45%, rgba(32,167,149,0.16) 0%, rgba(32,167,149,0) 100%), #0B1426', INK, GRID60),
    'lab-teal': ('radial-gradient(ellipse 900px 700px at 78% 45%, rgba(32,167,149,0.22) 0%, rgba(32,167,149,0) 100%), #0B1426', INK, GRID60),
    'twist': ('radial-gradient(ellipse 900px 520px at 70% 8%, rgba(229,72,77,0.20) 0%, rgba(229,72,77,0) 100%), linear-gradient(#181D27 0%, #0B1426 100%)', INK, ''),
    'charcoal': ('linear-gradient(#181D27 0%, #101828 100%)', INK, ''),
    'night': ('radial-gradient(ellipse 700px 500px at 82% 12%, rgba(185,198,216,0.16) 0%, rgba(185,198,216,0) 100%), #0B1426', INK, ''),
}


def frame(room, inner, extra=''):
    bg, fg, deco = ROOMS[room]
    return (f'<div{extra} style="width: 1920px; height: 1080px; box-sizing: border-box; position: relative; overflow: hidden; background: {bg}; '
            f'{JAK}; color: {fg}">\n{deco}\n{inner}\n</div>')


def eyebrow(text, dark=False, dash=TEAL):
    c = INK_SOFT if not dark else CHAR
    return (f'<div style="position: absolute; left: 120px; top: 110px; display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; '
            f'letter-spacing: 0.14em; color: {c}"><span style="width: 36px; height: 3px; border-radius: 2px; background: {dash}"></span>{text}</div>')


def progress(n, light=True):
    off = G300 if light else 'rgba(255,255,255,0.25)'
    bars = ''.join(f'<span style="width: 64px; height: 6px; border-radius: 3px; background: {TEAL if i < n else off}"></span>' for i in range(3))
    return f'<div style="position: absolute; left: 1560px; top: 110px; width: 240px; display: flex; align-items: center; justify-content: flex-end; gap: 12px; height: 30px">{bars}</div>'


def check(size=56, fill=TEAL, mark='#FFFFFF'):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 64 64" aria-hidden="true" style="flex: none"><circle cx="32" cy="32" r="29" fill="{fill}"></circle>'
            f'<path d="M19 33l9 9 17-19" fill="none" stroke="{mark}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path></svg>')


def cross(size=56, fill=RED):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 64 64" aria-hidden="true" style="flex: none"><circle cx="32" cy="32" r="29" fill="{fill}"></circle>'
            '<path d="M22 22l20 20M42 22L22 42" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"></path></svg>')


LOCK = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475467" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>')


SOFT_SHADOW = '0 30px 70px rgba(16,24,40,0.14), 0 0 0 1px rgba(16,24,40,0.06)'
DARK_SHADOW = '0 40px 90px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.10)'


def scaled(html, s, w, h, x=None, y=None, extra=''):
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else 'position: relative; '
    return (f'<div{extra} style="{pos}width: {w * s:.0f}px; height: {h * s:.0f}px">'
            f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: {h}px; transform: scale({s}); transform-origin: top left">{html}</div></div>')


def browser(url, inner, x, y, w, h, extra='', shadow=DARK_SHADOW, bar=64, size=19):
    """A generic browser window (no browser named): three dots, a padlock and the address."""
    return (f'<div data-ui="website"{extra} style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border-radius: 24px; overflow: hidden; '
            f'background: #FFFFFF; box-shadow: {shadow}; {UI}; color: {CHAR}">'
            f'<div style="height: {bar}px; display: flex; align-items: center; gap: 16px; padding: 0 22px; border-bottom: 1px solid {G200}; box-sizing: border-box">'
            '<div style="display: flex; gap: 8px"><span style="width: 13px; height: 13px; border-radius: 50%; background: #F97066"></span>'
            '<span style="width: 13px; height: 13px; border-radius: 50%; background: #FDB022"></span><span style="width: 13px; height: 13px; border-radius: 50%; background: #32D583"></span></div>'
            f'<div style="flex: 1; height: {bar - 24}px; border-radius: {(bar - 24) // 2}px; background: {G100}; display: flex; align-items: center; gap: 10px; padding: 0 18px; {MONO}; font-size: {size}px; color: {G700}">'
            f'{LOCK}{url}</div></div>{inner}</div>')


# ---------------------------------------------------------------- the story world: logos
# Frosty Bites' wordmark is drawn, not typeset: monoline round caps on a 40-unit cap height, the kind of
# lettering a clinic sign uses. Velvet Scoop's wordmark is the one prop typeface (Fraunces, soft axis full).
GLYPHS = {
    'F': ('M0 0V40M0 0H22M0 19H18', 22), 'R': ('M0 40V0H13A10 10 0 0 1 13 20H0M11 20L23 40', 23),
    'O': ('M16 0A16 20 0 1 0 16 40A16 20 0 1 0 16 0', 32),
    'S': ('M22 6C19 1.5 15 0 11 0C5 0 1 4 1 10C1 16 6 18 11 19.5C17 21 22 23.5 22 30C22 36.5 17 40 11 40C6 40 2 38 0 34', 22),
    'T': ('M0 0H24M12 0V40', 24), 'Y': ('M0 0L12 21L24 0M12 21V40', 24),
    'B': ('M0 0V40H14A10 10 0 0 0 14 20H0M0 0H12A10 10 0 0 1 12 20', 24), 'I': ('M0 0V40', 0),
    'E': ('M22 0H0V40H22M0 20H18', 22), 'C': ('M30 7A16 20 0 1 0 30 33', 31),
    'A': ('M0 40L13 0L26 40M5 26H21', 26), 'M': ('M0 40V0L15 26L30 0V40', 30), ' ': ('', 12),
}


def stroke_text(text, color, sw=6, track=9):
    x, parts = sw / 2, []
    for ch in text:
        d, w = GLYPHS[ch]
        if d:
            parts.append(f'<path transform="translate({x:.1f} {sw / 2})" d="{d}"></path>')
        x += w + track + (sw if ch != ' ' else 0)
    width = x - track
    return (f'<svg viewBox="0 0 {width:.0f} {40 + sw}" style="display: block; width: 100%; height: auto; overflow: visible" aria-hidden="true">'
            f'<g fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{"".join(parts)}</g></svg>'), width, 40 + sw


def frosty_mark(size=120):
    f = FROSTY
    # An ice cube with a bite out of the bottom. It is also, unmistakably, a molar.
    return (f'<svg data-logo width="{size}" height="{size * 76 / 70:.0f}" viewBox="-3 -8 70 76" role="img" aria-label="Frosty Bites mark" style="display: block; flex: none; overflow: visible">'
            f'<path d="M6 6Q6 1 11 1H53Q58 1 58 6V34Q58 47 53 56Q49 63 45 55L39.5 45Q32 38 24.5 45L19 55Q15 63 11 56Q6 47 6 34Z" fill="{f["frost"]}" stroke="{f["ink"]}" stroke-width="3" stroke-linejoin="round"></path>'
            f'<path d="M14 9V22M20 9V13" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"></path>'
            f'<path d="M61 -6V4M56 -1H66" stroke="{f["glacier"]}" stroke-width="2.6" stroke-linecap="round"></path></svg>')


def frosty_logo(width=520, stack=True):
    f = FROSTY
    word, ww, wh = stroke_text('FROSTY BITES', f['ink'], sw=6, track=8)
    sub, sw_, sh = stroke_text('ICE CREAM', f['glacier'], sw=5, track=14)
    mark = width * 0.26
    return (f'<div data-logo data-shop aria-label="Frosty Bites" style="display: flex; align-items: center; gap: {width * 0.05:.0f}px; width: {width}px">'
            f'{frosty_mark(mark)}<div style="flex: 1; display: flex; flex-direction: column; gap: {width * 0.03:.0f}px">'
            f'<div style="width: 100%">{word}</div><div style="width: 52%">{sub}</div></div></div>')


def velvet_mark(size=120):
    v = VELVET
    # A pistachio scoop with a soft drip, on a cone whose rim is a smile.
    return (f'<svg data-logo width="{size}" height="{size * 84 / 64:.0f}" viewBox="0 0 64 84" role="img" aria-label="Velvet Scoop mark" style="display: block; flex: none">'
            f'<path d="M14 44L30.5 80Q32 82.5 33.5 80L50 44Z" fill="{v["cocoa"]}"></path>'
            f'<path d="M22 52L40 70M30 48L44 62M40 48L26 74M48 48L30 74" stroke="{v["cream"]}" stroke-opacity="0.35" stroke-width="1.6"></path>'
            f'<path d="M8 34A24 24 0 0 1 56 34V39Q56 44 51.5 44Q48 44 47 48.5Q46 53 42 53Q38 53 37.5 48Q37 44 32 44Q27 44 26 49Q25 53 21 53Q17 53 16.5 48Q16 44 12 44Q8 44 8 39Z" fill="{v["pistachio"]}"></path>'
            f'<path d="M15 26A18 18 0 0 1 30 15" fill="none" stroke="{v["cream"]}" stroke-width="3.4" stroke-linecap="round"></path>'
            f'<path d="M11 45Q32 60 53 45" fill="none" stroke="{v["cream"]}" stroke-width="3" stroke-linecap="round"></path></svg>')


def velvet_logo(width=520, color=None):
    v = VELVET
    c = color or v['cocoa']
    mark = width * 0.22
    return (f'<div data-logo data-shop aria-label="Velvet Scoop" style="display: flex; align-items: center; gap: {width * 0.05:.0f}px; width: {width}px">'
            f'{velvet_mark(mark)}<div style="display: flex; flex-direction: column; gap: {width * 0.012:.0f}px">'
            f'<span style="{FR}; font-weight: 640; font-size: {width * 0.135:.0f}px; line-height: 1; letter-spacing: -0.015em; color: {c}; white-space: nowrap">Velvet Scoop</span>'
            f'<span style="{FR}; font-weight: 520; font-size: {width * 0.042:.0f}px; letter-spacing: 0.32em; color: {v["leaf"]}; white-space: nowrap">ICE CREAM</span></div></div>')


def scoop_icon(size=64, bg=G100):
    """The pistachio page's own icon, the same in both worlds: one scoop in a paper cup, flecked with nuts."""
    v = VELVET
    return (f'<span data-shop style="width: {size}px; height: {size}px; flex: none; border-radius: 50%; background: {bg}; display: inline-flex; align-items: center; justify-content: center">'
            f'<svg width="{size * 0.72:.0f}" height="{size * 0.72:.0f}" viewBox="0 0 48 48" aria-hidden="true">'
            f'<path d="M9 22A15 15 0 0 1 39 22Z" fill="{v["pistachio"]}"></path>'
            f'<circle cx="18" cy="15" r="1.8" fill="{v["leaf"]}"></circle><circle cx="27" cy="12" r="1.6" fill="{v["leaf"]}"></circle><circle cx="31" cy="18" r="1.8" fill="{v["leaf"]}"></circle><circle cx="22" cy="19" r="1.4" fill="{v["leaf"]}"></circle>'
            f'<path d="M8 23H40L36 42Q35.5 44 33.5 44H14.5Q12.5 44 12 42Z" fill="#FFFFFF" stroke="{G600}" stroke-width="2" stroke-linejoin="round"></path>'
            f'<path d="M11 30H37" stroke="{v["pistachio"]}" stroke-width="3"></path></svg></span>')


# ---------------------------------------------------------------- the hero prop: the pistachio card
CARD_COPY = {
    'frosty': ('Frosty Bites', OLD, 'Pistachio ice cream · Frosty Bites'),
    'velvet': ('Velvet Scoop', NEW, 'Pistachio ice cream · Velvet Scoop'),
}
SNIPPET = 'Roasted in-house every morning. The pistachio people drive across town for.'


def pistachio_card(brand='frosty', w=1080, rank=None, extra_style='', ring=None, scale=1.0):
    name, dom, title = CARD_COPY[brand]
    s = scale
    r = ''
    if rank is not None:
        r = (f'<span style="position: absolute; left: {-78 * s:.0f}px; top: {34 * s:.0f}px; width: {52 * s:.0f}px; height: {52 * s:.0f}px; border-radius: 50%; '
             f'background: {CHAR}; color: #FFFFFF; {MONO}; font-size: {24 * s:.0f}px; font-weight: 600; display: flex; align-items: center; justify-content: center">{rank}</span>')
    ring_css = f'0 0 0 {4 * s:.0f}px {ring}, ' if ring else ''
    return (f'<div data-ui="website" style="position: relative; width: {w * s:.0f}px; box-sizing: border-box; padding: {26 * s:.0f}px {32 * s:.0f}px {28 * s:.0f}px; border-radius: {22 * s:.0f}px; background: #FFFFFF; '
            f'box-shadow: {ring_css}0 {24 * s:.0f}px {60 * s:.0f}px rgba(16,24,40,0.16), 0 0 0 1px {G200}; {UI}; color: {CHAR}; display: flex; flex-direction: column; gap: {12 * s:.0f}px; {extra_style}">{r}'
            f'<div style="display: flex; align-items: center; gap: {16 * s:.0f}px">{scoop_icon(int(56 * s))}'
            f'<div style="display: flex; flex-direction: column; gap: {3 * s:.0f}px"><span style="font-size: {21 * s:.0f}px; font-weight: 600">{name}</span>'
            f'<span style="{MONO}; font-size: {18 * s:.0f}px; color: {G600}">{dom} › flavors › pistachio</span></div></div>'
            f'<span style="font-size: {32 * s:.0f}px; font-weight: 700; letter-spacing: -0.01em">{title}</span>'
            f'<span style="font-size: {20 * s:.0f}px; line-height: 1.45; color: {G600}">{SNIPPET}</span></div>')


def skeleton_result(w=1080, s=1.0, alpha=1.0):
    return (f'<div style="width: {w * s:.0f}px; box-sizing: border-box; padding: {22 * s:.0f}px {32 * s:.0f}px; display: flex; gap: {16 * s:.0f}px; align-items: flex-start; opacity: {alpha}">'
            f'<span style="width: {48 * s:.0f}px; height: {48 * s:.0f}px; flex: none; border-radius: 50%; background: {G100}"></span>'
            f'<div style="flex: 1; display: flex; flex-direction: column; gap: {12 * s:.0f}px; padding-top: {4 * s:.0f}px">'
            f'<span style="width: 34%; height: {12 * s:.0f}px; border-radius: 6px; background: {G200}"></span>'
            f'<span style="width: 62%; height: {20 * s:.0f}px; border-radius: 8px; background: {G300}"></span>'
            f'<span style="width: 88%; height: {12 * s:.0f}px; border-radius: 6px; background: {G200}"></span></div></div>')


MAG = ('<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#475467" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">'
       '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg>')


def search_page(first_card, x=320, y=170, w=1280, h=760, label='Example search', after=''):
    """A generic search results page: no search engine's name, colours or interface copy."""
    inner = (f'<div style="padding: 34px 60px 0; display: flex; flex-direction: column; gap: 26px">'
             f'<div style="display: flex; align-items: center; gap: 16px">'
             f'<div style="flex: 1; height: 68px; border-radius: 34px; box-shadow: inset 0 0 0 1.5px {G300}, 0 6px 18px rgba(16,24,40,0.06); display: flex; align-items: center; gap: 16px; padding: 0 28px; font-size: 26px; color: {CHAR}">{MAG}best pistachio ice cream</div>'
             f'<span style="height: 34px; padding: 0 14px; border-radius: 17px; background: {G100}; font-size: 16px; font-weight: 600; color: {G600}; display: inline-flex; align-items: center">{label}</span></div>'
             f'<div style="display: flex; flex-direction: column; gap: 6px; padding-left: 70px">{first_card}{skeleton_result(1040)}{skeleton_result(1040, alpha=0.7)}</div>'
             f'{after}</div>')
    return browser('', inner, x, y, w, h, shadow=SOFT_SHADOW)


# ---------------------------------------------------------------- the shops' own sites
def frosty_home(w=1180, h=640, highlight=True):
    f, v = FROSTY, VELVET
    flavors = [('Vanilla bean', '#FFFFFF'), ('Pistachio', v['pistachio']), ('Mint chip', f['frost']), ('Dark chocolate', '#FFFFFF')]
    tiles = ''
    for name, col in flavors:
        hot = name == 'Pistachio' and highlight
        tiles += (f'<div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 22px 0 18px; border-radius: 18px; '
                  f'background: {"#FFFFFF" if hot else f["ice"]}; box-shadow: {"0 0 0 4px " + f["glacier"] + ", 0 16px 36px rgba(30,58,76,0.18)" if hot else "none"}; '
                  f'transform: {"translateY(-10px)" if hot else "none"}">'
                  f'{scoop_icon(84, bg="#FFFFFF" if not hot else f["ice"]) if name == "Pistachio" else _plain_scoop(84, col)}'
                  f'<span style="font-size: 19px; font-weight: 600; color: {f["ink"]}">{name}</span>'
                  f'{"<span style=" + chr(34) + "font-size: 14px; font-weight: 700; letter-spacing: 0.08em; color: " + f["glacier"] + chr(34) + ">THE FAMOUS ONE</span>" if hot else ""}</div>')
    return (f'<div data-shop style="height: {h - 64}px; background: #FFFFFF; display: flex; flex-direction: column">'
            f'<div style="height: 84px; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 44px; border-bottom: 1px solid {f["ice"]}">'
            f'{frosty_logo(250)}<div style="display: flex; gap: 30px; font-size: 18px; font-weight: 500; color: {f["ink"]}"><span>Flavors</span><span>Visit</span><span>Our story</span></div></div>'
            f'<div style="flex: 1; background: linear-gradient(180deg, {f["ice"]} 0%, #FFFFFF 75%); padding: 40px 44px 0; display: flex; flex-direction: column; gap: 28px">'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 50px; font-weight: 700; letter-spacing: -0.02em; color: {f["ink"]}">Forty flavors. One famous pistachio.</span>'
            f'<span style="font-size: 21px; color: {f["ink"]}; opacity: 0.75">Scooping since 2021 · Open daily, noon till late</span></div>'
            f'<div style="display: flex; gap: 18px">{tiles}</div>'
            f'<div style="display: flex; align-items: center; gap: 14px; font-size: 19px; color: {f["ink"]}">{stars(5, 20, f["ink"])}<span>“Worth the drive. Every time.”</span></div></div></div>')


def _plain_scoop(size, col):
    return (f'<span style="width: {size}px; height: {size}px; flex: none; border-radius: 50%; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center">'
            f'<svg width="{size * 0.72:.0f}" height="{size * 0.72:.0f}" viewBox="0 0 48 48" aria-hidden="true">'
            f'<path d="M9 22A15 15 0 0 1 39 22Z" fill="{col}" stroke="{G300}" stroke-width="1.5"></path>'
            f'<path d="M8 23H40L36 42Q35.5 44 33.5 44H14.5Q12.5 44 12 42Z" fill="#FFFFFF" stroke="{G600}" stroke-width="2" stroke-linejoin="round"></path></svg></span>')


def velvet_home(w=1180, h=640, compact=False):
    v = VELVET
    return (f'<div data-shop style="height: {h - 64}px; background: {v["cream"]}; display: flex; flex-direction: column">'
            f'<div style="height: 84px; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 44px; border-bottom: 1px solid rgba(91,58,41,0.12)">'
            f'{velvet_logo(250)}<div style="display: flex; gap: 30px; font-size: 18px; font-weight: 500; color: {v["cocoa"]}"><span>Flavors</span><span>Visit</span><span>Our story</span></div></div>'
            f'<div style="flex: 1; padding: 40px 44px 0; display: flex; gap: 40px; align-items: flex-start">'
            f'<div style="flex: 1; display: flex; flex-direction: column; gap: 14px"><span style="font-size: 48px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.08; color: {v["cocoa"]}">Same scoops.<br>A smoother name.</span>'
            f'<span style="font-size: 21px; color: {v["cocoa"]}; opacity: 0.75">Forty flavors, made here every morning.</span>'
            f'<span style="margin-top: 10px; width: max-content; height: 54px; padding: 0 28px; border-radius: 27px; background: {v["cocoa"]}; color: {v["cream"]}; font-size: 19px; font-weight: 600; display: inline-flex; align-items: center">See the flavors</span></div>'
            f'<div style="width: 300px; height: 300px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center">{velvet_mark(150)}</div>'
            f'</div></div>')


# ---------------------------------------------------------------- SEO tethers and shop props
LINK_ICON = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"></path><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"></path></svg>')


def stars(n=5, size=22, color=G700):
    one = (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" fill="{color}"></path></svg>')
    return f'<span style="display: inline-flex; gap: 3px">{one * n}</span>'


def blog_card(title, dom=OLD, path=PIST, w=420):
    return (f'<div data-ui="website" style="width: {w}px; box-sizing: border-box; border-radius: 18px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px {G200}; overflow: hidden; {UI}; color: {CHAR}">'
            f'<div style="height: 40px; padding: 0 18px; display: flex; align-items: center; gap: 8px; background: {G50}; border-bottom: 1px solid {G200}; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: {G500}">'
            f'<span style="width: 10px; height: 10px; border-radius: 50%; background: {G300}"></span>A LOCAL FOOD BLOG</div>'
            f'<div style="padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 12px">'
            f'<span style="font-size: 22px; font-weight: 700; line-height: 1.25">{title}</span>'
            f'<span style="width: 92%; height: 10px; border-radius: 5px; background: {G200}"></span><span style="width: 70%; height: 10px; border-radius: 5px; background: {G200}"></span>'
            f'<span style="display: inline-flex; align-items: center; gap: 8px; width: max-content; max-width: 100%; padding: 8px 12px; border-radius: 10px; background: {G100}; color: {G700}; {MONO}; font-size: 15px">{LINK_ICON}{dom}{path}</span>'
            f'</div></div>')


def review_card(quote, who='a regular', w=420):
    return (f'<div data-ui="website" style="width: {w}px; box-sizing: border-box; padding: 20px 22px; border-radius: 18px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px {G200}; {UI}; color: {CHAR}; display: flex; flex-direction: column; gap: 10px">'
            f'<div style="display: flex; align-items: center; gap: 12px"><span style="width: 36px; height: 36px; border-radius: 50%; background: {G200}"></span>'
            f'<span style="font-size: 16px; font-weight: 600; color: {G600}">{who}</span><span style="margin-left: auto">{stars(5, 20)}</span></div>'
            f'<span style="font-size: 20px; line-height: 1.4; font-weight: 500">“{quote}”</span></div>')


def page_card(path, dom=OLD, badge=None, w=420, hero=False, dim=False):
    b = ''
    if badge:
        b = (f'<span style="display: inline-flex; align-items: center; gap: 8px; width: max-content; height: 32px; padding: 0 12px; border-radius: 16px; '
             f'background: {G100}; font-size: 15px; font-weight: 600; color: {G700}">{badge}</span>')
    icon = scoop_icon(44) if hero else f'<span style="width: 44px; height: 44px; flex: none; border-radius: 12px; background: {G100}"></span>'
    return (f'<div data-ui="website" style="width: {w}px; box-sizing: border-box; padding: 16px 18px; border-radius: 16px; background: #FFFFFF; opacity: {0.55 if dim else 1}; '
            f'box-shadow: {"0 0 0 3px " + G300 + ", " if hero else ""}0 18px 44px rgba(16,24,40,0.14), 0 0 0 1px {G200}; {UI}; color: {CHAR}; display: flex; flex-direction: column; gap: 10px">'
            f'<div style="display: flex; align-items: center; gap: 12px">{icon}<span style="{MONO}; font-size: 18px; color: {CHAR}; white-space: nowrap">'
            f'<span style="color: {G500}">{dom}</span>{path}</span></div>{b}</div>')


def bio_card(w=400):
    v = VELVET
    return (f'<div data-shop data-ui="website" style="width: {w}px; box-sizing: border-box; padding: 24px; border-radius: 22px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px {G200}; {UI}; color: {CHAR}; display: flex; flex-direction: column; gap: 14px">'
            f'<div style="display: flex; align-items: center; gap: 16px"><span style="width: 76px; height: 76px; border-radius: 50%; background: {v["cream"]}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 3px #FFFFFF, 0 0 0 5px {G200}">{velvet_mark(40)}</span>'
            f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 20px; font-weight: 700">velvetscoop</span><span style="font-size: 15px; color: {G500}">Ice cream shop</span></div></div>'
            f'<span style="font-size: 17px; line-height: 1.45">Small-batch ice cream. Forty flavors.<br>Yes, that pistachio.</span>'
            f'<span style="display: inline-flex; align-items: center; gap: 8px; color: {G700}; {MONO}; font-size: 16px">{LINK_ICON}{NEW}</span></div>')


QR_GLYPH = ('<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#6B675F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3M21 14v7h-7"></path></svg>')


def menu_card(w=360):
    v = VELVET
    rows = ''.join(f'<span style="display: flex; justify-content: space-between; font-size: 17px; color: #3B3A36"><span>{n}</span><span style="color: #8A8478">·</span></span>'
                   for n in ('Vanilla bean', 'Pistachio', 'Mint chip', 'Dark chocolate'))
    return (f'<div data-shop data-ui="print" style="width: {w}px; box-sizing: border-box; padding: 26px 28px; border-radius: 10px; background: #FBF7EF; box-shadow: 0 24px 50px rgba(16,24,40,0.18), 0 0 0 1px #F4EFE6; transform: rotate(-2deg); {UI}; display: flex; flex-direction: column; gap: 12px">'
            f'{velvet_logo(240)}<span style="height: 1px; background: #F4EFE6; margin: 4px 0"></span>{rows}'
            f'<div style="margin-top: 8px; display: flex; align-items: center; gap: 14px"><span style="width: 84px; height: 84px; border-radius: 10px; box-shadow: inset 0 0 0 2px #8A8478; display: flex; align-items: center; justify-content: center">{QR_GLYPH}</span>'
            f'<span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 14px; font-weight: 600; color: #6B675F">QR slot · menu link</span><span style="{MONO}; font-size: 15px; color: #3B3A36">{NEW}</span></span></div></div>')


def maps_card(w=420):
    v = VELVET
    return (f'<div data-shop data-ui="website" style="width: {w}px; box-sizing: border-box; border-radius: 22px; overflow: hidden; background: #FFFFFF; box-shadow: 0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px {G200}; {UI}; color: {CHAR}">'
            f'<div style="position: relative; height: 150px; background: {G100}; overflow: hidden">'
            f'<svg width="{w}" height="150" viewBox="0 0 420 150" aria-hidden="true" style="position: absolute; inset: 0"><path d="M-10 40L430 90M120 -10L170 160M-10 120L430 70M300 -10L260 160" stroke="#FFFFFF" stroke-width="12"></path></svg>'
            f'<svg width="44" height="56" viewBox="0 0 24 30" aria-hidden="true" style="position: absolute; left: {w / 2 - 22:.0f}px; top: 34px"><path d="M12 29C12 29 22 17 22 10A10 10 0 0 0 2 10C2 17 12 29 12 29Z" fill="{v["cocoa"]}"></path><circle cx="12" cy="10" r="4" fill="{v["cream"]}"></circle></svg></div>'
            f'<div style="padding: 18px 22px 22px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 22px; font-weight: 700">Velvet Scoop</span>'
            f'<span style="display: flex; align-items: center; gap: 8px; font-size: 16px; color: {G600}">Ice cream shop · Open now</span>'
            f'<span style="display: inline-flex; align-items: center; gap: 8px; color: {G700}; {MONO}; font-size: 16px">{LINK_ICON}{NEW}</span></div></div>')


def melt_card(w=1080, scale=1.0):
    """The pistachio card, melting: the same card, sagging, its bottom edge running into drips."""
    s = scale
    card = pistachio_card('frosty', w, scale=s, ring=AMBER, extra_style='transform: rotate(-2.2deg) skewX(-3deg); transform-origin: 30% 100%')
    drips = (f'<svg data-amber-part width="{w * s:.0f}" height="{120 * s:.0f}" viewBox="0 0 1080 120" preserveAspectRatio="none" aria-hidden="true" '
             f'style="position: absolute; left: 0; top: 100%; margin-top: {-18 * s:.0f}px; transform: rotate(-2.2deg) skewX(-3deg); transform-origin: 30% 0">'
             '<path d="M40 0H1040V8Q1030 30 1012 26Q996 22 990 54Q986 82 966 80Q946 78 948 40Q950 14 900 16Q850 18 846 44Q842 66 826 64Q806 62 808 30Q808 12 700 14Q590 16 588 58Q586 104 560 104Q534 104 536 52Q538 18 420 16Q300 14 298 40Q296 62 280 62Q262 62 262 34Q262 14 180 14Q110 14 108 70Q106 112 84 112Q60 112 62 60Q64 20 40 10Z" fill="#FFFFFF"></path>'
             '</svg>')
    puddle = (f'<span style="position: absolute; left: {40 * s:.0f}px; right: {60 * s:.0f}px; top: 100%; margin-top: {96 * s:.0f}px; height: {22 * s:.0f}px; border-radius: 50%; '
              f'background: rgba(255,255,255,0.22); filter: blur(2px)"></span>')
    return f'<div style="position: relative; width: {w * s:.0f}px">{card}{drips}{puddle}</div>'


def pill(text, x=None, y=None, size=34, light=True, ring=None, extra=''):
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else ''
    bg = '#FFFFFF' if light else 'rgba(255,255,255,0.10)'
    fg = CHAR if light else INK
    sh = f'0 0 0 4px {ring}, ' if ring else ''
    return (f'<span{extra} style="{pos}display: inline-flex; align-items: center; gap: 12px; height: {size * 2.1:.0f}px; padding: 0 {size * 0.9:.0f}px; border-radius: {size * 1.05:.0f}px; '
            f'background: {bg}; box-shadow: {sh}0 20px 50px rgba(16,24,40,0.18), inset 0 0 0 1.5px rgba(255,255,255,0.4); {MONO}; font-size: {size}px; font-weight: 500; color: {fg}; white-space: nowrap">{text}</span>')


def tip(kicker, title, sub, x, y, w=420):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; padding: 36px 38px 40px; border-radius: 24px; background: {CHAR}; color: #FFFFFF; '
            f'box-shadow: 0 30px 80px rgba(16,24,40,0.22); display: flex; flex-direction: column; gap: 14px">'
            f'<span style="font-weight: 700; font-size: 20px; letter-spacing: 0.14em; color: {TEAL}">{kicker}</span>'
            f'<span style="font-size: 40px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1">{title}</span>'
            f'<span style="font-size: 22px; font-weight: 500; line-height: 1.4; color: {INK_SOFT}">{sub}</span></div>')


def headline(text, x=120, y=170, size=80, color=None, w=None):
    c = f'color: {color}; ' if color else ''
    ww = f'width: {w}px; ' if w else ''
    return (f'<h2 style="position: absolute; left: {x}px; top: {y}px; {ww}margin: 0; font-size: {size}px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; {c}">{text}</h2>')


def caption(text, y=880, color=None, x=None, w=None, size=40):
    c = f'color: {color}; ' if color else ''
    if x is None:
        return (f'<div style="position: absolute; left: 120px; right: 120px; top: {y}px; text-align: center; font-size: {size}px; font-weight: 700; letter-spacing: -0.02em; {c}">{text}</div>')
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; font-size: {size}px; font-weight: 700; letter-spacing: -0.02em; {c}">{text}</div>')


RH_WORDMARK = '''<svg data-logo viewBox="0 0 1192.13 242.32" role="img" aria-label="RedirHub" style="display: block; width: 100%; height: auto"><path fill="#ffffff" d="M373.09,132.13c16.2-7.79,26.1-22.74,26.1-43.79,0-31.79-21.9-51.79-53.68-51.79h-54.31v149.46h33.26v-48.21h18.1l29.47,48.21h35.16l-34.1-53.88ZM342.15,109.39h-17.68v-42.31h17.68c13.48,0,23.37,5.26,23.37,21.26s-9.89,21.05-23.37,21.05Z"></path><path fill="#ffffff" d="M463.19,74.46c-28.21,0-55.79,20-55.79,57.04s27.37,56.63,57.68,56.63c20,0,35.57-8.21,44.63-19.58l-14.74-15.37c-8,6.11-16.63,8.42-26.31,8.42-14.53,0-25.47-5.89-29.89-17.68h77.88c6.95-50.1-25.68-69.46-53.46-69.460ZM438.13,120.56c3.58-13.06,14.53-18.74,25.48-18.74s22.1,6.11,24.42,18.74h-49.89Z"></path><path fill="#ffffff" d="M612.21,36.56v52.41h-.63c-1.69-4-13.06-14.52-32.42-14.52-24.84,0-52.21,18.73-52.21,56.83s27.37,56.83,52.21,56.83c19.36,0,30.73-10.53,32.42-14.53h.63v12.42h32.63V36.56h-32.63ZM585.9,159.07c-13.89,0-26.73-10.1-26.73-27.78s12.84-27.79,26.73-27.79,27.15,9.89,27.15,27.79-12.84,27.78-27.15,27.78Z"></path><path fill="#ffffff" d="M664.63,36.56v28.42h32.62v-28.42h-32.62ZM664.63,76.55v109.46h32.62v-109.46h-32.62Z"></path><path fill="#ffffff" d="M783.55,74.46c-19.78,0-30.31,14.1-33.89,31.78v-29.68h-32.63v109.46h32.63v-45.04c0-20.63,12.42-35.16,34.1-35.16,2.73,0,5.05.22,7.58.64v-30.95c-2.74-.84-5.26-1.05-7.79-1.05Z"></path><path fill="#ffffff" d="M895.54,36.56v59.16h-56.42v-59.16h-33.26v149.46h33.26v-59.57h56.42v59.57h33.26V36.56h-33.26Z"></path><path fill="#ffffff" d="M1021.84,76.55v58.74c0,13.68-6.95,23.78-20.21,23.78s-20.42-10.1-20.42-23.78v-58.74h-32.63v64.42c0,33.47,18.74,47.15,40.85,47.15,15.58,0,26.31-6.73,32.42-16v13.89h32.62v-109.46h-32.62Z"></path><path fill="#ffffff" d="M1139.92,74.46c-19.37,0-30.73,10.52-32.42,14.52h-.63v-52.41h-32.63v149.46h32.63v-12.42h.63c1.69,4,13.05,14.53,32.42,14.53,24.84,0,52.21-18.73,52.21-56.83s-27.37-56.83-52.21-56.83ZM1133.19,159.07c-14.31,0-27.15-9.89-27.15-27.78s12.84-27.79,27.15-27.79,26.73,10.11,26.73,27.79-12.84,27.78-26.73,27.78Z"></path><path fill="#ffffff" d="M175.01,0H0l12.05,11.66h73.98v5.38H17.61l12.05,11.66h56.37v5.38h-50.81l13.87,13.42h118.75v140.5l48.34-47.35V31.97c0-18.22-17.7-31.97-41.18-31.97Z"></path><polygon fill="#ffffff" points="132.55 78.15 132.55 160.47 113.27 179.76 104.3 188.73 82.38 210.63 50.69 242.32 50.69 161.24 73.42 138.18 82.38 129.07 104.3 106.83 113.27 97.73 132.55 78.15"></polygon></svg>'''

FRAMES = {}


def F(name, title):
    def deco(fn):
        FRAMES[name] = (title, fn)
        return fn
    return deco


# ================================================================ ACT A · Meet Frosty Bites
@F('w44-Shop', 'Meet Frosty Bites')
def _shop():
    f = FROSTY
    stats = ''.join(f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 72px; font-weight: 800; letter-spacing: -0.04em; line-height: 1">{n}</span>'
                    f'<span style="font-size: 24px; font-weight: 600; color: {G600}">{l}</span></div>'
                    for n, l in (('5', 'years of scooping'), ('40', 'flavors'), ('1', 'famous pistachio')))
    inner = (eyebrow('MEET FROSTY BITES', dark=True)
             + browser(f'https://{OLD}', frosty_home(1180, 640), 120, 200, 1180, 640, shadow=SOFT_SHADOW)
             + f'<div style="position: absolute; left: 1400px; top: 250px; width: 400px; display: flex; flex-direction: column; gap: 44px">{stats}</div>')
    return frame('light', inner)


@F('w44-Search', 'Right at the top')
def _search():
    inner = (eyebrow('A SEARCH NEAR THE SHOP', dark=True)
             + search_page(pistachio_card('frosty', 1040, rank=1), x=320, y=170, w=1280, h=700)
             + caption('Right at the top.', y=884, color=CHAR, size=40))
    return frame('light', inner)



def rope(x1, y1, x2, y2, color='rgba(255,255,255,0.55)', w=3, bend=0.45):
    mx = x1 + (x2 - x1) * bend
    return (f'<path d="M{x1} {y1} C{mx:.0f} {y1} {x2 - (x2 - x1) * bend:.0f} {y2} {x2} {y2}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round"></path>'
            f'<circle cx="{x1}" cy="{y1}" r="6" fill="{color}"></circle>')


def group_label(text, x, y, color=INK_SOFT):
    return f'<span style="position: absolute; left: {x}px; top: {y}px; font-size: 20px; font-weight: 700; letter-spacing: 0.14em; color: {color}">{text}</span>'


def place(x, y, html, extra=''):
    return f'<div{extra} style="position: absolute; left: {x}px; top: {y}px">{html}</div>'


@F('w44-SEO', 'What holds the spot')
def _seo():
    pages = [('/', False), ('/flavors', False), (PIST, True)]
    cards = ''.join(place(120, 420 + i * 120, page_card(p, w=500, hero=h)) for i, (p, h) in enumerate(pages))
    ropes = ''.join(rope(620, 458 + i * 120, 700, 640) for i in range(3))
    ropes += rope(1360, 480, 1222, 640) + rope(1360, 720, 1222, 640) + rope(1360, 850, 1222, 640)
    inner = (eyebrow('WHAT HOLDS THE SPOT')
             + headline('SEO: what makes Google pick your page.', size=64)
             + f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">{ropes}</svg>'
             + group_label('PAGES', 120, 380)
             + cards
             + group_label('FOOD BLOGS', 1360, 300) + place(1360, 334, blog_card('Where to find the best pistachio in town', w=440))
             + group_label('REVIEWS', 1360, 610) + place(1360, 644, review_card('Frosty Bites’ pistachio is worth the drive.', w=440))
             + place(1360, 790, review_card('Five stars for Frosty Bites. That pistachio!', 'a first-timer', w=440))
             + pill(OLD, 712, 600, size=34, extra=' data-pill')
             + caption('All tied to one address.', y=700, x=712, w=520, size=32, color=INK_SOFT))
    return frame('mesh', inner)


# ================================================================ ACT B · The name problem
def bubble(text, who, x, y, w=560, tail='left'):
    return (f'<div data-ui="messages" style="position: absolute; left: {x}px; top: {y}px; display: flex; align-items: flex-end; gap: 14px">'
            f'<span style="width: 52px; height: 52px; flex: none; border-radius: 50%; background: {G200}; {UI}; font-size: 16px; font-weight: 600; color: {G600}; display: flex; align-items: center; justify-content: center">{who}</span>'
            f'<span style="max-width: {w}px; padding: 22px 28px; border-radius: 28px 28px 28px 8px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(16,24,40,0.14), 0 0 0 1px {G200}; '
            f'{UI}; font-size: 34px; font-weight: 500; color: {CHAR}; line-height: 1.25">{text}</span></div>')


TOOTH = ('<svg width="150" height="160" viewBox="0 0 64 68" aria-hidden="true" style="display: block">'
         f'<path d="M6 12Q6 2 17 2Q25 2 32 7Q39 2 47 2Q58 2 58 12Q58 26 54 40Q51 52 49 60Q47 66 43 60L38 46Q32 40 26 46L21 60Q17 66 15 60Q13 52 10 40Q6 26 6 12Z" '
         f'fill="none" stroke="{G600}" stroke-width="2.6" stroke-linejoin="round" stroke-dasharray="5 5"></path></svg>')


@F('w44-Dentist', 'Is this a dental clinic?')
def _dentist():
    f = FROSTY
    sign = (f'<div data-shop style="position: absolute; left: 120px; top: 230px; width: 760px; height: 420px; border-radius: 30px; background: #FFFFFF; overflow: hidden; '
            f'box-shadow: {SOFT_SHADOW}">'
            f'<div style="height: 70px; background: repeating-linear-gradient(90deg, {f["frost"]} 0 60px, #FFFFFF 60px 120px)"></div>'
            f'<div style="height: 350px; display: flex; align-items: center; justify-content: center">{frosty_logo(600)}</div></div>')
    gag = (f'<div style="position: absolute; left: 260px; top: 700px; display: flex; align-items: center; gap: 40px">'
           f'<div data-shop>{frosty_mark(130)}</div><span style="font-size: 96px; font-weight: 800; color: {G400}">≈</span>{TOOTH}</div>')
    inner = (eyebrow('THE NAME PROBLEM', dark=True) + sign + gag
             + bubble('Is this a dental clinic?', 'AK', 1000, 300)
             + bubble('Do you treat frostbite?', 'JM', 1080, 470)
             + caption('Fair. It does sound a little… medical.', y=690, x=1000, w=800, size=40, color=CHAR))
    return frame('light', inner)


@F('w44-Rename', 'A new name: Velvet Scoop')
def _rename():
    v = VELVET
    sign = (f'<div data-shop style="position: absolute; left: 520px; top: 220px; width: 880px; height: 440px; border-radius: 30px; background: {v["cream"]}; overflow: hidden; '
            f'box-shadow: {SOFT_SHADOW}">'
            f'<div style="height: 70px; background: repeating-linear-gradient(90deg, {v["pistachio"]} 0 60px, {v["cream"]} 60px 120px)"></div>'
            f'<div style="height: 370px; display: flex; align-items: center; justify-content: center">{velvet_logo(680)}</div></div>')
    ghost = (f'<div style="position: absolute; left: 120px; top: 250px; opacity: 0.32; display: flex; flex-direction: column; gap: 10px">{frosty_logo(300)}</div>'
             f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">'
             f'<path d="M270 380 C 300 470, 400 500, 500 450" fill="none" stroke="{G400}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"></path>'
             f'<path d="M486 438 L503 449 L490 466" fill="none" stroke="{G400}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>')
    inner = (eyebrow('A NEW NAME', dark=True) + ghost + sign
             + f'<div style="position: absolute; left: 520px; width: 880px; top: 720px; display: flex; justify-content: center">{pill(NEW, size=36, ring=None)}</div>')
    return frame('light', inner)


QMARK = (f'<span style="position: absolute; right: -36px; top: -40px; width: 92px; height: 92px; border-radius: 50%; background: #FFFFFF; color: {CHAR}; '
         f'box-shadow: 0 20px 50px rgba(0,0,0,0.35); font-size: 60px; font-weight: 800; display: flex; align-items: center; justify-content: center">?</span>')
MOON = ('<svg data-bg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" style="position: absolute; left: 1640px; top: 90px">'
        '<path d="M80 14A48 48 0 1 0 106 82A40 40 0 1 1 80 14Z" fill="#B9C6D8" fill-opacity="0.85"></path></svg>')


@F('w44-Worry', 'What happens to the spot?')
def _worry():
    card = f'<div style="position: absolute; left: 200px; top: 500px">{pistachio_card("frosty", 1040, rank=1, scale=0.8)}{QMARK}</div>'
    newsite = browser(f'https://{NEW}', scaled(velvet_home(1180, 640), 0.5, 1180, 576), 1180, 400, 590, 338, bar=50, size=16)
    sockets = ''.join(f'<span style="height: 52px; padding: 0 22px; border-radius: 26px; box-shadow: inset 0 0 0 2px rgba(185,198,216,0.45); '
                      f'display: inline-flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: {INK_SOFT}"><span style="width: 12px; height: 12px; border-radius: 50%; box-shadow: inset 0 0 0 2px {INK_MUTE}"></span>{t}</span>'
                      for t in ('no links', 'no reviews', 'no history'))
    inner = (MOON + eyebrow('THE WORRY')
             + headline('What happens to the top spot?', size=72)
             + card + newsite
             + f'<div style="position: absolute; left: 1180px; top: 772px; display: flex; gap: 12px">{sockets}</div>'
             + caption('Done wrong: a total stranger.', y=856, x=1180, w=620, size=36, color=INK))
    return frame('night', inner)


@F('w44-Title', 'Title card')
def _title():
    motif = (f'<div style="display: flex; align-items: center; gap: 0">'
             f'<span style="height: 60px; padding: 0 26px; border-radius: 30px; background: rgba(255,255,255,0.14); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.45); {MONO}; font-size: 26px; display: inline-flex; align-items: center; color: rgba(255,255,255,0.75)">{OLD}</span>'
             f'<svg width="200" height="60" viewBox="0 0 200 60" aria-hidden="true"><path d="M10 30H178" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"></path><path d="M166 18L182 30L166 42" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
             f'<span style="height: 60px; padding: 0 26px; border-radius: 30px; background: #FFFFFF; {MONO}; font-size: 26px; display: inline-flex; align-items: center; color: {CHAR}">{NEW}</span></div>')
    inner = (f'<div data-bg style="position: absolute; left: 50%; top: 520px; width: 1400px; height: 520px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))"></div>'
             f'<div style="position: absolute; left: 0; right: 0; top: 190px; display: flex; flex-direction: column; align-items: center; gap: 44px; text-align: center">{motif}'
             f'<h1 style="margin: 0; font-size: 100px; line-height: 1.02; font-weight: 800; letter-spacing: -0.035em">How to change your domain<br>name without losing SEO.</h1>'
             f'<span style="display: inline-flex; align-items: center; height: 84px; padding: 0 44px; border-radius: 42px; background: rgba(255,255,255,0.18); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.18); font-size: 40px; font-weight: 700">Three steps.</span></div>')
    return frame('sweep', inner)



# ================================================================ ACT C · How Google sees your site
TREE = [  # (x, y, path, badge, hero)
    (120, 520, '/', '5 yrs · 120 links', False),
    (620, 360, '/flavors', '5 yrs · 30 links', False),
    (620, 700, '/blog', '3 yrs · 14 links', False),
    (1180, 290, PIST, '#1 · 48 links · 5 yrs', True),
    (1180, 480, '/flavors/vanilla-bean', '4 yrs · 12 links', False),
    (1180, 700, '/blog/pistachio-secret', '2 yrs · 9 links', False),
]
EDGES = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]


def tree_lines(color='rgba(255,255,255,0.35)', dy=36):
    out = ''
    for a, b in EDGES:
        xa, ya = TREE[a][0] + (440 if a == 0 else 500), TREE[a][1] + dy
        xb, yb = TREE[b][0], TREE[b][1] + dy
        out += f'<path d="M{xa} {ya} C{xa + 50} {ya} {xb - 50} {yb} {xb} {yb}" fill="none" stroke="{color}" stroke-width="3"></path>'
    return f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">{out}</svg>'


def badge(text, hero=False, dim=False):
    bg = '#FFFFFF' if hero else 'rgba(255,255,255,0.12)'
    fg = CHAR if hero else INK
    return (f'<span style="display: inline-flex; align-items: center; gap: 10px; height: 40px; padding: 0 16px; border-radius: 20px; background: {bg}; color: {fg}; opacity: {0.5 if dim else 1}; '
            f'box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); font-size: 19px; font-weight: 700; white-space: nowrap">'
            f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>{text}</span>')


@F('w44-Pages', 'Google ranks pages')
def _pages():
    nodes = ''
    for x, y, path, b, hero in TREE:
        w = 440 if path == '/' else 500 if x == 620 else 560
        nodes += place(x, y, page_card(path, w=w, hero=hero)) + place(x, y + 88, badge(b, hero))
    inner = (eyebrow('HOW GOOGLE SEES YOUR SITE')
             + headline('Google ranks pages. Not domains.', size=72)
             + tree_lines() + nodes
             + f'<span style="position: absolute; left: 1620px; top: 186px; height: 34px; padding: 0 14px; border-radius: 17px; background: rgba(255,255,255,0.10); font-size: 16px; font-weight: 600; color: {INK_SOFT}; display: inline-flex; align-items: center">Example numbers</span>')
    return frame('lab', inner)


@F('w44-Flip', 'Every address changes')
def _flip():
    nodes, breaks = '', ''
    for x, y, path, b, hero in TREE:
        w = 440 if path == '/' else 500 if x == 620 else 560
        nodes += place(x, y, page_card(path, dom=NEW, w=w, hero=hero)) + place(x + 40, y + 112, badge(b, hero, dim=True))
        breaks += (f'<path d="M{x + 24} {y + 76} V{y + 126} H{x + 40}" fill="none" stroke="{RED}" stroke-width="3" stroke-dasharray="6 7"></path>')
    inner = (eyebrow('HOW GOOGLE SEES YOUR SITE')
             + headline('Every address changes.', size=72)
             + tree_lines() + nodes
             + f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">{breaks}</svg>'
             + caption('The history doesn’t follow on its own.', y=860, x=120, w=900, size=40, color=INK))
    return frame('lab', inner)


@F('w44-Steps', 'Three steps')
def _steps():
    cards = ''
    for i, (n, t) in enumerate((('01', 'Map it'), ('02', 'Redirect it'), ('03', 'Tell Google'))):
        bars = ''.join(f'<span style="width: 40px; height: 6px; border-radius: 3px; background: {TEAL if k <= i else G300}"></span>' for k in range(3))
        cards += (f'<div style="position: relative; height: 360px; box-sizing: border-box; padding: 40px; border-radius: 30px; background: linear-gradient(140deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.84) 100%); '
                  f'box-shadow: inset 0 0 0 1.5px #FFFFFF, 0 30px 70px rgba(16,24,40,0.20); color: {CHAR}; display: flex; flex-direction: column; gap: 22px; transform: translateY({i * 30}px)">'
                  f'<span style="{MONO}; font-size: 30px; font-weight: 600; color: {TEAL}">{n}</span>'
                  f'<span style="font-size: 60px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05">{t}</span>'
                  f'<div style="margin-top: auto; display: flex; gap: 8px">{bars}</div></div>')
    inner = (eyebrow('THE MOVE', dash='#FFFFFF')
             + headline('Three steps.', size=80)
             + f'<div style="position: absolute; left: 120px; top: 330px; width: 1680px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px">{cards}</div>'
             + f'<div style="position: absolute; left: 120px; top: 806px; display: flex; align-items: center; gap: 16px; height: 64px; padding: 0 28px; border-radius: 32px; background: rgba(255,255,255,0.16); '
               f'box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.45), 0 20px 50px rgba(16,24,40,0.16); font-size: 30px; font-weight: 700">Then let it settle.</div>')
    return frame('radial', inner)


# ================================================================ ACT D · The three steps
MAP_ROWS = [('/', '/'), ('/flavors', '/flavors'), (PIST, PIST), ('/about', '/about'), ('/blog/pistachio-secret', '/journal/pistachio-secret')]


@F('w44-Map', 'Step one: the map')
def _map():
    rows = ''
    for i, (a, b) in enumerate(MAP_ROWS):
        hero = a == PIST
        changed = a != b
        bg = '#FFFFFF' if hero else 'rgba(0,0,0,0)'
        icon = scoop_icon(40, bg='#FFFFFF') if hero else '<span style="width: 40px"></span>'
        rows += (f'<div style="display: grid; grid-template-columns: 40px minmax(0, 1fr) 60px minmax(0, 1fr); align-items: center; gap: 18px; height: 78px; padding: 0 24px; border-radius: 14px; '
                 f'background: {bg}; box-shadow: {"0 10px 30px rgba(59,58,54,0.10)" if hero else "none"}; border-top: {"0" if i == 0 or hero else "1px solid #F4EFE6"}">'
                 f'{icon}<span style="{MONO}; font-size: 26px; color: #3B3A36; white-space: nowrap">{a}</span>'
                 f'<svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true"><path d="M2 10H34M26 3L34 10L26 17" fill="none" stroke="#8A8478" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
                 f'<span style="{MONO}; font-size: 26px; color: #3B3A36; white-space: nowrap; font-weight: {600 if changed else 400}">{b}</span></div>')
    sheet = (f'<div data-ui="print" style="position: absolute; left: 120px; top: 210px; width: 1160px; box-sizing: border-box; padding: 34px 30px 30px; border-radius: 16px; background: #FBF7EF; '
             f'box-shadow: 0 30px 70px rgba(59,58,54,0.16), 0 0 0 1px #F4EFE6; {UI}">'
             f'<div style="display: grid; grid-template-columns: 40px minmax(0, 1fr) 60px minmax(0, 1fr); gap: 18px; padding: 0 24px 18px; border-bottom: 2px solid #F4EFE6">'
             f'<span></span><span style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 16px; font-weight: 700; letter-spacing: 0.12em; color: #8A8478">OLD ADDRESS</span>'
             f'<span style="{MONO}; font-size: 26px; font-weight: 600; color: #3B3A36">{OLD}</span></span><span></span>'
             f'<span style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 16px; font-weight: 700; letter-spacing: 0.12em; color: #8A8478">NEW ADDRESS</span>'
             f'<span style="{MONO}; font-size: 26px; font-weight: 600; color: #3B3A36">{NEW}</span></span></div>'
             f'<div style="display: flex; flex-direction: column; margin-top: 10px">{rows}</div></div>')
    bracket = (f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">'
               f'<path d="M1300 352 H1318 V650 H1300" fill="none" stroke="{TEAL}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>'
               f'<path d="M1300 668 H1318 V740 H1300" fill="none" stroke="{G500}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
               f'<div style="position: absolute; left: 1340px; top: 500px; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 32px; font-weight: 800; color: {CHAR}">Same paths:</span><span style="font-size: 32px; font-weight: 800; color: {TEAL}">one rule.</span></div>'
               f'<div style="position: absolute; left: 1340px; top: 680px; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 32px; font-weight: 800; color: {CHAR}">Changed:</span><span style="font-size: 32px; font-weight: 800; color: {CHAR}">its own line.</span></div>')
    inner = (eyebrow('STEP ONE · MAP IT', dark=True) + progress(1) + sheet + bracket
             + tip('QUICK TIP', 'Export your page list first.', 'From your sitemap or Search Console.', 1340, 180, 460))
    return frame('light', inner)


CURSOR = ('<svg width="44" height="52" viewBox="0 0 22 26" aria-hidden="true" style="display: block"><path d="M2 2L2 21L7.5 16L11 24L14.5 22.5L11 15L18 15Z" fill="#181D27" stroke="#FFFFFF" stroke-width="1.6" stroke-linejoin="round"></path></svg>')


@F('w44-Shortcut', 'The shortcut looks perfect')
def _shortcut():
    olds = [('/', False), ('/flavors', False), (PIST, True), ('/about', False), ('/blog/pistachio-secret', False)]
    pills_ = ''.join(place(120, 330 + i * 104, page_card(p, w=560, hero=h)) for i, (p, h) in enumerate(olds))
    curves = ''
    for i in range(5):
        y = 368 + i * 104
        curves += (f'<path d="M690 {y} C 850 {y}, 880 560, 1040 560" fill="none" stroke="{TEAL}" stroke-opacity="0.55" stroke-width="3"></path>')
    checks = ''.join(f'<div style="position: absolute; left: 700px; top: {350 + i * 104}px">{check(34)}</div>' for i in range(5))
    home = browser(f'https://{NEW}', scaled(velvet_home(1180, 640), 0.62, 1180, 576), 1060, 330, 732, 420, bar=54, size=17, shadow=SOFT_SHADOW)
    trail = ('<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">'
             '<path d="M1180 700 C 1260 640, 1420 720, 1360 620 C 1300 520, 1560 520, 1600 620 C 1640 720, 1460 760, 1500 660" fill="none" stroke="#181D27" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"></path></svg>')
    hunt = (f'<div style="position: absolute; left: 1490px; top: 640px">{CURSOR}</div>'
            f'<span style="position: absolute; left: 1360px; top: 780px; height: 56px; padding: 0 24px; border-radius: 28px; background: {CHAR}; color: #FFFFFF; font-size: 26px; font-weight: 700; display: inline-flex; align-items: center">Where’s the pistachio?</span>')
    inner = (eyebrow('THE SHORTCUT', dark=True)
             + headline('It looks <span style="color: #20A795">perfect.</span>', size=80, color=CHAR)
             + f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">{curves}</svg>'
             + pills_ + checks + home + trail + hunt)
    return frame('light', inner)


def old_gone(path):
    return (f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="{MONO}; font-size: 22px; color: {INK_MUTE}; text-decoration: line-through; white-space: nowrap">{OLD}{path}</span>'
            f'<span style="font-size: 17px; font-weight: 700; letter-spacing: 0.06em; color: {RED}">TREATED AS GONE</span></div>')


@F('w44-Melt', 'The top spot melts')
def _melt():
    gone = ''.join(old_gone(p) for p in ('/flavors', '/about', '/blog/pistachio-secret'))
    slot = (f'<div style="position: absolute; left: 820px; top: 300px; width: 980px; height: 150px; box-sizing: border-box; border-radius: 22px; box-shadow: inset 0 0 0 3px rgba(185,198,216,0.35); '
            f'background: repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 14px, rgba(255,255,255,0) 14px 28px)">'
            f'<span style="position: absolute; left: -78px; top: 49px; width: 52px; height: 52px; border-radius: 50%; box-shadow: inset 0 0 0 2px {INK_MUTE}; {MONO}; font-size: 24px; color: {INK_SOFT}; display: flex; align-items: center; justify-content: center">1</span></div>')
    drop = (f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">'
            f'<path d="M1720 460 C 1760 500, 1760 540, 1730 570" fill="none" stroke="{INK_SOFT}" stroke-width="3" stroke-dasharray="4 9" stroke-linecap="round"></path>'
            f'<path d="M1718 556 L1730 572 L1746 560" fill="none" stroke="{INK_SOFT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>')
    card = f'<div style="position: absolute; left: 820px; top: 590px">{melt_card(1040, scale=0.94)}</div>'
    rank = (f'<span style="position: absolute; left: 742px; top: 630px; width: 52px; height: 52px; border-radius: 50%; background: #FFFFFF; color: {CHAR}; {MONO}; font-size: 24px; font-weight: 600; '
            f'display: flex; align-items: center; justify-content: center">4</span>')
    inner = (eyebrow('THE TWIST', dash=RED)
             + headline('The top spot starts to melt.', size=72)
             + group_label('HOW GOOGLE SEES THE OLD PAGES', 120, 330)
             + f'<div style="position: absolute; left: 120px; top: 380px; display: flex; flex-direction: column; gap: 30px">{gone}</div>'
             + slot + drop + card + rank
             + f'<span style="position: absolute; left: 1640px; top: 186px; height: 34px; padding: 0 14px; border-radius: 17px; background: rgba(255,255,255,0.10); font-size: 16px; font-weight: 600; color: {INK_SOFT}; display: inline-flex; align-items: center">Example</span>')
    return frame('twist', inner)


@F('w44-OneToOne', 'One to one')
def _onetoone():
    rows, lines = '', ''
    for i, (a, b) in enumerate(MAP_ROWS):
        y = 330 + i * 112
        hero = a == PIST
        rows += place(120, y, page_card(a, dom=OLD, w=640, hero=hero)) + place(1160, y, page_card(b, dom=NEW, w=640, hero=hero))
        lines += (f'<path d="M760 {y + 38} H1160" stroke="{TEAL}" stroke-width="{5 if hero else 3}" stroke-linecap="round"></path>'
                  f'<circle cx="760" cy="{y + 38}" r="8" fill="{TEAL}"></circle><circle cx="1160" cy="{y + 38}" r="8" fill="{TEAL}"></circle>'
                  f'<rect x="926" y="{y + 22}" width="68" height="32" rx="8" fill="#0B1426" stroke="{TEAL}" stroke-width="2"></rect>'
                  f'<text x="960" y="{y + 45}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="18" font-weight="600" fill="#FFFFFF">301</text>')
    inner = (eyebrow('THE RULE')
             + headline('One old page. One matching new page.', size=64)
             + f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">{lines}</svg>' + rows)
    return frame('mesh-teal', inner)


# ================================================================ the RedirHub dashboard (Unified Links prototype, as in W43's Product.tsx)
NAV = [('Analytics', 'M18 20V10M12 20V4M6 20v-6'), ('Links', 'M4 7h13M17 7l-3-3M17 7l-3 3M20 17H7M7 17l3-3M7 17l3 3'),
       ('Monitor', 'M22 12h-4l-3 9L9 3l-3 9H2'), ('Hostnames', 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01')]
WSNAV = [('AI assistants', 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'),
         ('Members', 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'), ('Plan &amp; billing', 'M2 6h20v12H2zM2 10h20')]
RH_MARK = ('<svg data-logo width="26" height="26" viewBox="0 0 120 120" aria-hidden="true" style="flex-shrink: 0"><path d="M3 0H95Q107 0 107 12V70L83 93V23H24Z" fill="#E59426"></path>'
           '<path d="M25 80L66 39V79L25 120Z" fill="#20A795"></path><rect x="9" y="5.5" width="34" height="2.6" fill="#F2F4F7"></rect><rect x="16" y="13.5" width="27" height="2.6" fill="#F2F4F7"></rect></svg>')


def ico(d, size=18, color='currentColor', sw=1.8):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0"><path d="{d}"></path></svg>')


def shell(active, crumbs, right, body, w=1400, h=633):
    nav = ''
    for label, d in NAV:
        on = label == active
        st = 'background: #FFFFFF; font-weight: 600; color: #181D27; box-shadow: 0 1px 2px rgba(16,24,40,0.06), 0 0 0 1px #EAECF0' if on else 'font-weight: 500; color: #414651'
        nav += (f'<span style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 8px; font-size: 14px; white-space: nowrap; {st}">'
                f'<span style="display: inline-flex; color: {"#1C6DB6" if on else "#717680"}">{ico(d)}</span><span style="flex-grow: 1">{label}</span></span>')
    ws = ''.join(f'<span style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #414651">'
                 f'<span style="display: inline-flex; color: #717680">{ico(d)}</span>{label}</span>' for label, d in WSNAV)
    aside = (f'<aside style="width: 236px; height: {h}px; flex-shrink: 0; background: #F2F4F7; display: flex; flex-direction: column; gap: 14px; padding: 14px 12px; box-sizing: border-box">'
             f'<div style="display: flex; align-items: center; gap: 8px; padding-left: 6px; font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: #181D27">{RH_MARK}RedirHub</div>'
             f'<div style="display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: #FFFFFF; border: 1px solid #EAECF0"><span style="width: 28px; height: 28px; border-radius: 8px; background: #E8F0F8; color: #1962A4; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center">VS</span>'
             f'<span style="flex-grow: 1; font-size: 14px; font-weight: 600; color: #181D27">Velvet Scoop</span><span style="display: inline-flex; color: #98A2B3">{ico("M7 15l5 5 5-5M7 9l5-5 5 5", 15)}</span></div>'
             f'<div style="display: flex; flex-direction: column; gap: 2px">{nav}</div>'
             f'<div style="display: flex; flex-direction: column; gap: 2px"><span style="padding: 8px 10px 4px; font-size: 11.5px; font-weight: 600; letter-spacing: 0.06em; color: #98A2B3">WORKSPACE</span>{ws}</div></aside>')
    crumb = '<span style="margin: 0 8px; color: #D5D7DA">/</span>'.join(
        f'<span style="font-size: 14px; {"font-weight: 600; color: #181D27" if k == len(crumbs) - 1 else "color: #717680"}">{c}</span>' for k, c in enumerate(crumbs))
    main = (f'<div style="margin: 8px 8px 8px 0; height: {h - 16}px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(16,24,40,0.05), 0 0 0 1px #EAECF0; overflow: hidden; flex-grow: 1; min-width: 0; display: flex; flex-direction: column">'
            f'<div style="height: 64px; flex-shrink: 0; display: flex; align-items: center; gap: 10px; padding: 0 16px 0 24px; border-bottom: 1px solid #EAECF0; box-sizing: border-box">{crumb}<span style="flex-grow: 1"></span>{right}</div>'
            f'<div style="flex: 1; min-height: 0; display: flex; background: #F9FAFB">{body}</div></div>')
    return f'<div style="width: {w}px; height: {h}px; display: flex">{aside}{main}</div>'


def dashboard(inner, x, y, s, w, h):
    return (f'<div data-ui="dashboard" style="position: absolute; left: {x}px; top: {y}px; width: {w * s:.0f}px; height: {h * s:.0f}px; border-radius: 24px; overflow: hidden; background: #F2F4F7; '
            f'box-shadow: 0 40px 100px rgba(16,24,40,0.16), 0 0 0 1px rgba(16,24,40,0.06); {UI}; color: {CHAR}">'
            f'<div style="width: {w}px; height: {h}px; transform: scale({s}); transform-origin: top left">{inner}</div></div>')


BTN_S = 'display: inline-flex; align-items: center; height: 38px; padding: 0 14px; border: 1px solid #D5D7DA; border-radius: 8px; background: #FFFFFF; font-size: 14px; font-weight: 600; color: #344054'
BTN_P = 'display: inline-flex; align-items: center; height: 38px; padding: 0 16px; border-radius: 8px; background: #1C6DB6; font-size: 14px; font-weight: 600; color: #FFFFFF'
LBL = 'font-size: 14px; font-weight: 500; color: #344054'
INP = 'height: 42px; padding: 0 14px; border: 1px solid #D5D7DA; border-radius: 8px; background: #FFFFFF; font-size: 15px; color: #181D27; display: flex; align-items: center; box-sizing: border-box; white-space: nowrap; overflow: hidden'
TAG301 = '<span style="flex: none; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: #E8F0F8; color: #1C6DB6">301</span>'
TAGSKIP = '<span style="flex: none; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: #FEF0C7; color: #B54708">Skip</span>'


def mig_option(title, sub, ex_a, ex_b, on):
    st = 'border: 1px solid #8EB6DB; background: #F5F9FC; box-shadow: 0 0 0 3px #E8F0F8' if on else 'border: 1px solid #EAECF0; background: #FFFFFF'
    radio = (f'<span style="width: 18px; height: 18px; flex: none; border-radius: 50%; box-sizing: border-box; border: {"5px solid #1C6DB6" if on else "1.5px solid #D5D7DA"}; background: #FFFFFF"></span>')
    return (f'<div style="display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border-radius: 12px; {st}">'
            f'<span style="display: flex; align-items: center; gap: 10px">{radio}<b style="font-size: 14px; font-weight: 600; color: #181D27">{title}</b></span>'
            f'<small style="font-size: 12.5px; line-height: 18px; color: #535862; margin: 2px 0 0 28px">{sub}</small>'
            f'<span style="display: flex; flex-direction: column; gap: 2px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #EAECF0; font-size: 12px; color: #535862">'
            f'<span>{ex_a}</span><span>{ex_b}</span></span></div>')


def what_happens(rows, foot_main, foot_cap='', ring_row=None, w=340, ring_color=TEAL):
    out = ''
    for k, (a, b, tag, warn) in enumerate(rows):
        ring = f'box-shadow: inset 0 0 0 2px {ring_color}; background: #FFFFFF;' if k == ring_row else ''
        out += (f'<div style="display: flex; flex-direction: column; gap: 4px; padding: 12px 16px; border-top: {"0" if k == 0 else "1px solid #EAECF0"}; font-size: 13px; {ring}">'
                f'<span style="color: #414651; white-space: nowrap">{a}</span>'
                f'<span style="display: flex; align-items: center; gap: 6px; color: {"#B54708" if warn else "#181D27"}; font-weight: 500; white-space: nowrap">{tag}{b}</span></div>')
    cap = f'<span style="margin-left: auto; color: #717680; white-space: nowrap">{foot_cap}</span>' if foot_cap else ''
    return (f'<div style="width: {w}px; flex: none; padding: 20px 20px 20px 0; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px">'
            f'<span style="font-size: 12px; font-weight: 600; letter-spacing: 0.06em; color: #717680">WHAT HAPPENS</span>'
            f'<div style="background: #FFFFFF; border: 1px solid #EAECF0; border-radius: 12px; overflow: hidden">{out}'
            f'<div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-top: 1px solid #EAECF0; background: #F9FAFB; font-size: 13px; color: #414651">'
            f'<span style="font-weight: 600; color: #181D27; white-space: nowrap">{foot_main}</span>{cap}</div></div></div>')


def opt_rows(rows, ring=None):
    out = ''
    for k, (icon, label, val) in enumerate(rows):
        r = 'box-shadow: inset 0 0 0 2px #20A795; border-radius: 10px;' if k == ring else ''
        out += (f'<div style="display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 14px; border-top: {"0" if k == 0 else "1px solid #EAECF0"}; font-size: 14px; color: #344054; {r}">'
                f'<span style="width: 28px; height: 28px; border-radius: 8px; background: #F2F4F7; color: #535862; display: inline-flex; align-items: center; justify-content: center">{ico(icon, 16)}</span>{label}'
                f'<span style="margin-left: auto; font-size: 13px; color: #717680">{val}</span>{ico("M9 6l6 6-6 6", 16, "#98A2B3")}</div>')
    return f'<div style="background: #FFFFFF; border: 1px solid #EAECF0; border-radius: 12px">{out}</div>'


OPT_TYPE = ('M4 7h11a4 4 0 0 1 0 8H8', 'Redirect type', '301 · Permanent')
OPT_QUERY = ('M5 12h14M13 6l6 6-6 6', 'Query forwarding', 'Query kept')
OPT_DOM = ('M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18', 'Subdomains &amp; HTTPS', 'HTTPS')


def migration_form(mode='same'):
    same = mode == 'same'
    opts = (f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">'
            + mig_option('Keep the same paths', 'Only the domain changes. One rule covers every URL.', f'{OLD}<b style="color: #181D27; font-weight: 600">{PIST}</b>', f'→ {NEW}<b style="color: #181D27; font-weight: 600">{PIST}</b>', same)
            + mig_option('Map URLs one by one', 'Paths changed. List each old URL and its new home.', f'{OLD}<b style="color: #181D27; font-weight: 600">/blog/pistachio-secret</b>', f'→ {NEW}<b style="color: #181D27; font-weight: 600">/journal/pistachio-secret</b>', not same)
            + '</div>')
    head = f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LBL}">How are the URLs changing?</span>{opts}</div>'
    if same:
        fields = (f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1fr); align-items: end; gap: 12px">'
                  f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LBL}">Old domain</span><span data-ring style="{INP}; border-color: #20A795; box-shadow: 0 0 0 3px rgba(32,167,149,0.25)">{OLD}</span></div>'
                  f'<span style="height: 42px; display: flex; align-items: center; color: #717680">{ico("M5 12h14M13 6l6 6-6 6", 22, "#717680", 2)}</span>'
                  f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LBL}">New base URL</span><span style="{INP}">https://{NEW}</span></div></div>'
                  f'<span style="font-size: 13px; line-height: 19px; color: #535862; margin-top: -6px">Every old path is added after the new base URL. A few pages moved anyway? Map just those one by one.</span>')
        body_opts = f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LBL}">More options</span>{opt_rows([OPT_TYPE, OPT_QUERY, OPT_DOM])}</div>'
        form = f'<div style="flex: 1; min-width: 0; padding: 20px 24px; display: flex; flex-direction: column; gap: 18px">{head}{fields}{body_opts}</div>'
        aside = what_happens([(f'{OLD}/', f'{NEW}/', TAG301, False), (f'{OLD}{PIST}', f'{NEW}{PIST}', TAG301, False),
                              (f'{OLD}/about?ref=menu', f'{NEW}/about?ref=menu', TAG301, False)], '…and every other path', ring_row=1)
        right = f'<span style="{BTN_S}">Cancel</span><span style="{BTN_P}">Create redirect</span>'
    else:
        tabs = (f'<span style="display: inline-flex; gap: 2px; padding: 3px; border-radius: 8px; background: #F2F4F7">'
                f'<span style="display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 6px; font-size: 13px; font-weight: 500; color: #414651">Add manually</span>'
                f'<span style="display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #181D27; background: #FFFFFF; box-shadow: 0 1px 2px rgba(16,24,40,0.08)">Paste</span></span>')
        paste = (f'<div style="padding: 12px 14px; border: 1px solid #D5D7DA; border-radius: 10px; background: #FFFFFF; {MONO}; font-size: 12.5px; line-height: 22px; color: #181D27; white-space: pre">'
                 f'{OLD}/blog/pistachio-secret    {NEW}/journal/pistachio-secret\n{OLD}/p/pistachio-shake        {NEW}/menu/pistachio-shake\n{OLD}/specials/summer</div>')
        maps = (f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="display: flex; align-items: center"><span style="{LBL}">URL mappings</span><span style="margin-left: auto">{tabs}</span></span>{paste}'
                f'<span style="font-size: 13px; color: #535862">Two columns, old URL then new URL, straight from Excel or Google Sheets. <b style="font-weight: 600; color: #344054">3 rows found.</b></span></div>'
                f'<div style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px dashed #D5D7DA; border-radius: 12px">'
                f'<span style="color: #079455; display: inline-flex">{ico("M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M9 13h6M9 17h6", 22, "#079455")}</span>'
                f'<span style="display: flex; flex-direction: column; gap: 2px"><b style="font-size: 14px; font-weight: 600; color: #181D27">Import a CSV file</b>'
                f'<span style="font-size: 12.5px; color: #717680">Hundreds of URLs? Upload two columns, old URL and new URL. You review every row before anything is created.</span></span></div>')
        body_opts = f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="{LBL}">More options</span>{opt_rows([OPT_TYPE], ring=0)}</div>'
        form = f'<div style="flex: 1; min-width: 0; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px">{head}{maps}{body_opts}</div>'
        aside = what_happens([(f'{OLD}/blog/pistachio-secret', f'{NEW}/journal/pistachio-secret', TAG301, False),
                              (f'{OLD}/p/pistachio-shake', f'{NEW}/menu/pistachio-shake', TAG301, False),
                              (f'{OLD}/specials/summer', 'New URL missing, this row is skipped', TAGSKIP, True)], '2 redirects · 1 skipped', ring_row=2, w=380, ring_color=RED)
        right = f'<span style="{BTN_S}">Cancel</span><span style="{BTN_P}">Create 2 redirects</span>'
    return right, form + aside


@F('w44-Migration', 'Step two: Website Migration')
def _migration():
    right, body = migration_form('same')
    dash = dashboard(shell('Links', ['Velvet Scoop', 'Links', 'New website migration'], right, body), 120, 170, 1.1, 1400, 633)
    www = (f'<span style="position: absolute; left: 430px; top: 886px; display: inline-flex; align-items: center; gap: 12px; height: 54px; padding: 0 22px; border-radius: 27px; background: {TEAL}; color: #FFFFFF; '
           f'font-size: 24px; font-weight: 700">{check(28, "#FFFFFF", TEAL)}'
           f'<span style="{MONO}; font-size: 22px; font-weight: 500">www.{OLD}</span>comes along too</span>')
    inner = eyebrow('STEP TWO · REDIRECT IT', dark=True) + progress(2) + dash + www
    return frame('light', inner)


@F('w44-Preview', 'Changed pages, previewed')
def _preview():
    right, body = migration_form('map')
    dash = dashboard(shell('Links', ['Velvet Scoop', 'Links', 'New website migration'], right, body, w=1460, h=660), 120, 170, 1.15, 1460, 660)
    t = (f'<div style="position: absolute; left: 1330px; top: 670px; width: 440px; box-sizing: border-box; padding: 26px 30px 28px; border-radius: 22px; background: {CHAR}; color: #FFFFFF; '
         f'box-shadow: 0 12px 30px rgba(16,24,40,0.22); display: flex; flex-direction: column; gap: 10px">'
         f'<span style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 18px; letter-spacing: 0.14em; color: {TEAL}">'
         f'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="{TEAL}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>THEN</span>'
         f'<span style="font-size: 30px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.12">Point the old domain at RedirHub.</span>'
         f'<span style="font-size: 20px; font-weight: 500; line-height: 1.4; color: {INK_SOFT}">The padlock is automatic. Our earlier videos show how.</span></div>')
    inner = eyebrow('STEP TWO · CHANGED PAGES', dark=True) + progress(2) + dash + t
    return frame('light', inner)


# ---------------------------------------------------------------- step three: a generic search-console-style panel (no Google branding)
def console(x, y, w, h):
    nav = ''.join(f'<span style="display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px; border-radius: 10px; font-size: 16px; font-weight: {600 if on else 500}; '
                  f'color: {CHAR if on else G600}; background: {"#FFFFFF" if on else "rgba(0,0,0,0)"}; box-shadow: {"0 0 0 1px " + G200 if on else "none"}">{t}</span>'
                  for t, on in (('Overview', False), ('Pages', False), ('Sitemaps', False), ('Settings', True)))
    prop = (f'<div style="display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 14px; border-radius: 10px; background: #FFFFFF; box-shadow: 0 0 0 1px {G200}; {MONO}; font-size: 15px; color: {CHAR}">{OLD}</div>')
    move = (f'<div style="padding: 26px 28px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 0 0 1px {G200}; display: flex; flex-direction: column; gap: 18px">'
            f'<span style="font-size: 22px; font-weight: 700">Change of address</span>'
            f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr); align-items: end; gap: 12px">'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; font-weight: 600; color: {G600}">Old site</span><span style="height: 48px; padding: 0 16px; border-radius: 10px; background: {G50}; box-shadow: inset 0 0 0 1px {G300}; display: flex; align-items: center; {MONO}; font-size: 18px">{OLD}</span></div>'
            f'<span style="height: 48px; display: flex; align-items: center; justify-content: center">{ico("M5 12h14M13 6l6 6-6 6", 24, G600, 2)}</span>'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; font-weight: 600; color: {G600}">New site</span><span style="height: 48px; padding: 0 16px; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 0 0 1.5px {G700}; display: flex; align-items: center; justify-content: space-between; {MONO}; font-size: 18px">{NEW}{ico("M6 9l6 6 6-6", 18, G600, 2)}</span></div></div>'
            f'<span style="display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 600; color: {CHAR}">{check(26)}Move requested</span></div>')
    sitemap = (f'<div style="padding: 22px 28px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 0 0 1px {G200}; display: flex; flex-direction: column; gap: 14px">'
               f'<span style="font-size: 22px; font-weight: 700">Sitemaps</span>'
               f'<div style="display: flex; align-items: center; gap: 14px; height: 52px; padding: 0 16px; border-radius: 10px; background: {G50}">'
               f'<span style="{MONO}; font-size: 18px">{NEW}/sitemap.xml</span><span style="margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600">{check(22)}Submitted</span></div></div>')
    inner = (f'<div style="display: flex; height: {h}px">'
             f'<div style="width: 260px; flex: none; padding: 22px 16px; box-sizing: border-box; background: {G100}; display: flex; flex-direction: column; gap: 12px">{prop}<div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px">{nav}</div></div>'
             f'<div style="flex: 1; padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; background: {G50}">'
             f'<span style="font-size: 15px; color: {G500}">Settings › Change of address</span>{move}{sitemap}</div></div>')
    return (f'<div data-ui="console" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border-radius: 24px; overflow: hidden; background: #FFFFFF; '
            f'box-shadow: {SOFT_SHADOW}; {UI}; color: {CHAR}">{inner}</div>')


@F('w44-TellGoogle', 'Step three: tell Google')
def _tell():
    inner = (eyebrow('STEP THREE · TELL GOOGLE', dark=True) + progress(3)
             + console(120, 240, 1180, 520)
             + f'<div style="position: absolute; left: 1360px; top: 240px; width: 440px; display: flex; flex-direction: column; gap: 40px">'
               f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="{MONO}; font-size: 28px; font-weight: 600; color: {TEAL}">1</span><span style="font-size: 40px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1">Point the old site at the new one.</span></div>'
               f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="{MONO}; font-size: 28px; font-weight: 600; color: {TEAL}">2</span><span style="font-size: 40px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1">Submit the new sitemap.</span></div>'
               f'<span style="height: 34px; width: max-content; padding: 0 14px; border-radius: 17px; background: {G100}; font-size: 16px; font-weight: 600; color: {G600}; display: inline-flex; align-items: center">Generic illustration, not the real console</span></div>')
    return frame('light', inner)


def site_links_card(w=400):
    rows = ''.join(f'<span style="display: flex; align-items: center; gap: 10px; {MONO}; font-size: 15px; color: {G700}">{LINK_ICON}{NEW}{p}</span>' for p in ('/flavors', '/visit', '/order'))
    return (f'<div data-shop data-ui="website" style="width: {w}px; box-sizing: border-box; border-radius: 22px; overflow: hidden; background: {VELVET["cream"]}; box-shadow: 0 20px 50px rgba(16,24,40,0.16), 0 0 0 1px {G200}; {UI}; color: {VELVET["cocoa"]}">'
            f'<div style="padding: 22px 24px 16px">{velvet_logo(240)}</div>'
            f'<div style="padding: 16px 24px 22px; background: #FFFFFF; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: {G500}">SITE LINKS</span>{rows}</div></div>')


def ticked(html, x, y):
    return place(x, y, f'<div style="position: relative">{html}<span style="position: absolute; right: -18px; top: -18px">{check(48)}</span></div>')


@F('w44-Everything', 'Update everything you control')
def _everything():
    inner = (eyebrow('AND EVERYTHING YOU CONTROL', dark=True)
             + headline('All of it says Velvet Scoop now.', size=64, color=CHAR)
             + ticked(scaled(site_links_card(380), 1.04, 380, 300), 120, 380)
             + ticked(scaled(bio_card(380), 1.04, 380, 230), 555, 380)
             + ticked(scaled(menu_card(340), 1.04, 340, 470), 990, 360)
             + ticked(scaled(maps_card(400), 1.04, 400, 310), 1370, 380))
    return frame('light', inner)


# ================================================================ ACT E · Proof, wobble, keep
@F('w44-Checker', 'Redirect Checker: a pass')
def _checker():
    ok_row = lambda t: f'<span style="display: flex; align-items: center; gap: 22px; font-size: 40px; font-weight: 700; letter-spacing: -0.02em">{check()}{t}</span>'
    body = (f'<div style="padding: 40px 50px; display: flex; flex-direction: column; gap: 20px">'
            f'<span style="font-size: 38px; font-weight: 700; letter-spacing: -0.02em">Check Any URL Redirect</span>'
            f'<div style="display: flex; gap: 12px"><div style="flex: 1; height: 58px; border-radius: 12px; box-shadow: inset 0 0 0 1.5px {G300}; display: flex; align-items: center; padding: 0 18px; {MONO}; font-size: 19px; white-space: nowrap; overflow: hidden">https://{OLD}{PIST}</div>'
            f'<span style="height: 58px; padding: 0 22px; border-radius: 12px; background: #1C6DB6; color: #FFFFFF; font-size: 19px; font-weight: 600; display: inline-flex; align-items: center">Check Redirect</span></div>'
            f'<div style="margin-top: 10px; border-radius: 16px; box-shadow: inset 0 0 0 1.5px {G200}; overflow: hidden">'
            f'<div style="display: flex; align-items: center; gap: 16px; padding: 20px 22px"><span style="width: 32px; height: 32px; flex: none; border-radius: 50%; background: {G100}; font-size: 15px; font-weight: 600; color: {G700}; display: flex; align-items: center; justify-content: center">1</span>'
            f'<span style="flex: 1; {MONO}; font-size: 18px; white-space: nowrap">https://{OLD}{PIST}</span><span style="padding: 5px 12px; border-radius: 8px; background: #E8F0F8; color: #1C6DB6; {MONO}; font-size: 18px; font-weight: 600">301</span></div>'
            f'<div style="display: flex; align-items: center; gap: 16px; padding: 20px 22px; border-top: 1px solid {G200}"><span style="width: 32px; height: 32px; flex: none; border-radius: 50%; background: {G100}; font-size: 15px; font-weight: 600; color: {G700}; display: flex; align-items: center; justify-content: center">2</span>'
            f'<span style="flex: 1; {MONO}; font-size: 18px; white-space: nowrap">https://{NEW}{PIST}</span><span style="padding: 5px 12px; border-radius: 8px; background: #ECFDF3; color: #067647; {MONO}; font-size: 18px; font-weight: 600">200</span></div></div></div>')
    more = ''.join(f'<span style="height: 44px; padding: 0 18px; border-radius: 22px; background: rgba(255,255,255,0.08); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.22); display: inline-flex; align-items: center; font-size: 20px; font-weight: 600; color: {INK_SOFT}">{t}</span>'
                   for t in ('Your best sellers', 'An old blog post', 'The www version'))
    inner = (eyebrow('NOW TEST IT · FREE REDIRECT CHECKER')
             + browser('redirhub.com/redirect-checker', body, 120, 230, 1080, 520, extra='')
             + f'<div style="position: absolute; left: 120px; top: 800px; display: flex; align-items: center; gap: 12px"><span style="font-size: 20px; font-weight: 700; letter-spacing: 0.12em; color: {INK_SOFT}; margin-right: 6px">TRY A FEW MORE</span>{more}</div>'
             + f'<div style="position: absolute; left: 1270px; top: 250px; width: 530px; display: flex; flex-direction: column; gap: 30px">{ok_row("One hop")}{ok_row("A 301")}'
               f'<div style="display: flex; align-items: flex-start; gap: 22px">{check()}<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 40px; font-weight: 700; letter-spacing: -0.02em; line-height: 56px">Lands on its twin</span>'
               f'<span style="{MONO}; font-size: 22px; font-weight: 600; color: {TEAL}">{NEW}<br>{PIST}</span></div></div>'
               f'<span style="margin-top: 16px; display: inline-flex; align-items: center; width: max-content; height: 96px; padding: 0 40px; border-radius: 48px; background: {TEAL}; box-shadow: 0 0 0 10px rgba(32,167,149,0.20), 0 30px 70px rgba(32,167,149,0.30); font-size: 52px; font-weight: 800; letter-spacing: -0.02em">That’s a pass.</span></div>')
    return frame('lab-teal', inner)


def coaster():
    # weeks 0..5 on x 200..1640; rank 1 at y 360, rank 6 at y 760. The move happens at week 1.
    pts = [(200, 360), (500, 360), (620, 360), (720, 640), (830, 470), (930, 690), (1060, 430), (1170, 540), (1290, 380), (1420, 400), (1640, 360)]
    d = f'M{pts[0][0]} {pts[0][1]}'
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        mx = (x0 + x1) / 2
        d += f' C{mx:.0f} {y0} {mx:.0f} {y1} {x1} {y1}'
    ties = ''.join(f'<line x1="{x}" y1="0" x2="{x}" y2="0"></line>' for x in [])
    svg = (f'<svg width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true" style="position: absolute; inset: 0">'
           f'<path d="M200 800 H1660" stroke="rgba(255,255,255,0.18)" stroke-width="2"></path>'
           + ''.join(f'<path d="M{x} 800 V812" stroke="rgba(255,255,255,0.3)" stroke-width="2"></path>' for x in (620, 860, 1100, 1340, 1580))
           + f'<path d="{d}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="22" stroke-linecap="round" stroke-dasharray="3 22"></path>'
           f'<path d="{d}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" transform="translate(0 -9)"></path>'
           f'<path d="{d}" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" transform="translate(0 9)"></path>'
           f'<path d="M620 300 V820" stroke="{INK_MUTE}" stroke-width="2" stroke-dasharray="6 8"></path></svg>')
    labels = ''.join(f'<span style="position: absolute; left: {x - 60}px; top: 824px; width: 120px; text-align: center; font-size: 22px; font-weight: 600; color: {INK_SOFT}">Week {n}</span>'
                     for n, x in ((1, 860), (2, 1100), (3, 1340), (4, 1580)))
    labels += f'<span style="position: absolute; left: 560px; top: 824px; width: 120px; text-align: center; font-size: 22px; font-weight: 700; color: {INK}">The move</span>'
    labels += f'<span style="position: absolute; left: 120px; top: 344px; font-size: 22px; font-weight: 700; color: {INK_SOFT}">#1</span>'
    cart = (f'<div style="position: absolute; left: 1598px; top: 296px; display: flex; flex-direction: column; align-items: center; gap: 4px">{scoop_icon(76, bg="#FFFFFF")}</div>')
    return svg + labels + cart


@F('w44-Wobble', 'The wobble')
def _wobble():
    inner = (eyebrow('THE PART NOBODY WARNS YOU ABOUT')
             + headline('A few weeks of wobble.', size=72)
             + coaster()
             + f'<span style="position: absolute; left: 1640px; top: 186px; height: 34px; padding: 0 14px; border-radius: 17px; background: rgba(255,255,255,0.10); font-size: 16px; font-weight: 600; color: {INK_SOFT}; display: inline-flex; align-items: center">Example</span>'
             + caption('Normal. Don’t undo the redirects.', y=884, size=44, color=INK))
    return frame('charcoal', inner)


def analytics_body():
    rows = [(NEW, '1,284', '↑ 41%', '#067647'), (OLD, '612', '↓ 18%', G600)]
    tr = ''.join(f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) 90px 80px; align-items: center; gap: 12px; height: 54px; padding: 0 18px; border-top: 1px solid #EAECF0; font-size: 15px">'
                 f'<span style="color: #181D27; font-weight: 500">{d}</span><span style="text-align: right; font-weight: 600">{n}</span><span style="text-align: right; color: {c}">{ch}</span></div>' for d, n, ch, c in rows)
    card = (f'<div style="width: 560px; background: #FFFFFF; border: 1px solid #EAECF0; border-radius: 12px; overflow: hidden">'
            f'<div style="display: flex; align-items: center; gap: 12px; padding: 16px 18px"><span style="font-size: 16px; font-weight: 600">Domains</span>'
            f'<span style="margin-left: auto; display: inline-flex; gap: 2px; padding: 3px; border-radius: 8px; background: #F2F4F7"><span style="padding: 3px 10px; border-radius: 6px; background: #FFFFFF; font-size: 13px; font-weight: 600">Domains</span><span style="padding: 3px 10px; font-size: 13px; color: #717680">Tags</span></span></div>'
            f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) 90px 80px; gap: 12px; padding: 8px 18px; background: #F9FAFB; font-size: 12px; font-weight: 600; color: #717680"><span>DOMAIN</span><span style="text-align: right">CLICKS</span><span style="text-align: right">CHANGE</span></div>'
            f'{tr}<div style="padding: 12px 18px; border-top: 1px solid #EAECF0; font-size: 13px; font-weight: 600; color: #1C6DB6">View details</div></div>')
    top = (f'<div style="display: flex; align-items: center; gap: 10px"><span style="display: inline-flex; align-items: center; height: 36px; padding: 0 12px; border: 1px solid #D5D7DA; border-radius: 8px; background: #FFFFFF; font-size: 14px; font-weight: 600">Last 30 days</span>'
           f'<span style="display: inline-flex; align-items: center; height: 36px; padding: 0 12px; border: 1px solid #D5D7DA; border-radius: 8px; background: #FFFFFF; font-size: 14px; color: #414651">Humans only</span></div>')
    return f'<div style="flex: 1; padding: 22px 24px; display: flex; flex-direction: column; gap: 18px">{top}{card}</div>'


@F('w44-Watch', 'Watch the move happen')
def _watch():
    dash = dashboard(shell('Analytics', ['Velvet Scoop', 'Analytics'], '', analytics_body(), w=900, h=520), 120, 200, 1.4, 900, 520)
    note = (f'<div style="position: absolute; left: 1400px; top: 320px; width: 400px; display: flex; flex-direction: column; gap: 22px">'
            f'<span style="font-size: 52px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.08">See who still uses the old address.</span>'
            f'<span style="height: 34px; width: max-content; padding: 0 14px; border-radius: 17px; background: {G100}; font-size: 16px; font-weight: 600; color: {G600}; display: inline-flex; align-items: center">Example numbers</span></div>')
    inner = eyebrow('WATCH THE MOVE', dark=True) + dash + note
    return frame('light', inner)


CAL = ''.join(f'<span style="height: 44px; border-radius: 8px; background: {"#FFFFFF" if k < 12 else "rgba(0,0,0,0)"}; box-shadow: inset 0 0 0 1px #F4EFE6; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 600; color: #6B675F">{m}</span>'
              for k, m in enumerate(['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']))


@F('w44-Keep', 'Two rules before you go')
def _keep():
    rule1 = (f'<div data-ui="print" style="position: absolute; left: 120px; top: 340px; width: 780px; box-sizing: border-box; padding: 36px; border-radius: 22px; background: #FBF7EF; box-shadow: 0 30px 70px rgba(59,58,54,0.16), 0 0 0 1px #F4EFE6; {JAK}; color: #3B3A36; display: flex; flex-direction: column; gap: 22px">'
             f'<span style="font-size: 18px; font-weight: 700; letter-spacing: 0.14em; color: #8A8478">RULE ONE</span>'
             f'<span style="font-size: 46px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.08">Keep the redirects<br>a year, at least.</span>'
             f'<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px">{CAL}</div>'
             f'<span style="display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 700; color: {CHAR}">{check(34)}Better still: keep them for good.</span></div>')
    rule2 = (f'<div style="position: absolute; left: 980px; top: 340px; width: 820px; box-sizing: border-box; padding: 36px; border-radius: 22px; background: #FFFFFF; box-shadow: {SOFT_SHADOW}; display: flex; flex-direction: column; gap: 22px">'
             f'<span style="font-size: 18px; font-weight: 700; letter-spacing: 0.14em; color: {G500}">RULE TWO</span>'
             f'<span style="font-size: 46px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.08">Keep renewing<br>the old domain.</span>'
             f'<div style="display: flex; align-items: center; gap: 18px; padding: 20px 24px; border-radius: 16px; background: {G50}; box-shadow: inset 0 0 0 1px {G200}">'
             f'<span style="{MONO}; font-size: 26px; font-weight: 600">{OLD}</span><span style="margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 2px"><span style="font-size: 16px; font-weight: 600; color: {G500}">Renews</span><span style="font-size: 22px; font-weight: 700">Oct 2027</span></span></div>'
             f'<span style="font-size: 28px; font-weight: 600; line-height: 1.35; color: {G700}">If it lapses, <span style="color: {RED}">someone else</span> can buy it, and every link that still points to it.</span>'
             f'<span style="height: 32px; width: max-content; padding: 0 12px; border-radius: 16px; background: {G100}; font-size: 15px; font-weight: 600; color: {G600}; display: inline-flex; align-items: center">Example date</span></div>')
    inner = eyebrow('BEFORE YOU GO', dark=True) + headline('Two rules.', size=72, color=CHAR) + rule1 + rule2
    return frame('light', inner)


@F('w44-Return', 'Right where Frosty Bites used to be')
def _return():
    inner = (eyebrow('A FEW WEEKS LATER', dark=True)
             + search_page(pistachio_card('velvet', 1040, rank=1), x=320, y=170, w=1280, h=700)
             + caption('Right where Frosty Bites used to be.', y=884, color=CHAR, size=40))
    return frame('light', inner)


@F('w44-EndCard', 'End card')
def _end():
    v = VELVET
    inner = (f'<div style="position: absolute; left: 140px; top: 200px; display: flex; flex-direction: column">'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em">New name.</span>'
             f'<span style="font-size: 128px; font-weight: 800; line-height: 1.02; letter-spacing: -0.045em; color: {TEAL}">Same spot.</span></div>'
             f'<div style="position: absolute; left: 140px; top: 500px; display: flex; flex-direction: column; gap: 12px; font-size: 34px">'
             f'<span style="color: {INK_SOFT}">Links to everything are in the description.</span><span style="font-weight: 700">Stuck? Reach out. We’re happy to help.</span></div>'
             f'<div style="position: absolute; left: 140px; top: 650px">{pistachio_card("velvet", 1040, scale=0.62)}</div>'
             f'<div style="position: absolute; left: 140px; top: 846px; width: 300px">{RH_WORDMARK}</div>'
             f'<div style="position: absolute; left: 690px; top: 830px; width: 200px; height: 100px; box-sizing: border-box; border-radius: 16px; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.22); background: rgba(255,255,255,0.10); '
             f'display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0 16px">'
             f'<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6B7A90" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3M21 14v7h-7"></path></svg>'
             f'<span style="font-size: 17px; font-weight: 700; color: {INK_SOFT}; line-height: 1.25">Branded QR · link pending</span></div>')
    return frame('mesh', inner, extra=' data-endcard')


# ================================================================ the world, system and sound boards
def swatch(hexv, name, role, dark_text=False):
    return (f'<div style="display: flex; align-items: center; gap: 14px"><span style="width: 64px; height: 64px; flex: none; border-radius: 16px; background: {hexv}; box-shadow: inset 0 0 0 1px rgba(16,24,40,0.10)"></span>'
            f'<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 22px; font-weight: 700; color: {CHAR}">{name}</span>'
            f'<span style="{MONO}; font-size: 17px; color: {G600}">{hexv} · {role}</span></span></div>')


def world_panel(x, y, w, h, kicker, title, body, bg='#FFFFFF'):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; box-sizing: border-box; padding: 44px 48px; border-radius: 32px; background: {bg}; box-shadow: {SOFT_SHADOW}">'
            f'<span style="font-size: 20px; font-weight: 700; letter-spacing: 0.14em; color: {G500}">{kicker}</span>'
            f'<div style="font-size: 48px; font-weight: 800; letter-spacing: -0.03em; margin: 8px 0 28px; color: {CHAR}">{title}</div>{body}</div>')


@F('w44-World', 'The story world')
def _world():
    f, v = FROSTY, VELVET
    W, H = 3280, 2760
    frosty_sw = ''.join(swatch(c, n, r) for c, n, r in ((f['ice'], 'Ice', 'page wash'), (f['frost'], 'Frost', 'the mark'), (f['glacier'], 'Glacier', 'accents'), (f['ink'], 'Frost ink', 'type')))
    velvet_sw = ''.join(swatch(c, n, r) for c, n, r in ((v['cream'], 'Cream', 'page, sign'), (v['pistachio'], 'Pistachio', 'the scoop'), (v['leaf'], 'Leaf', 'accents'), (v['cocoa'], 'Cocoa', 'type, cone')))
    old_home = browser(f'https://{OLD}', scaled(frosty_home(1180, 640), 0.5, 1180, 576), 0, 0, 590, 352, bar=64, size=19, shadow=SOFT_SHADOW).replace('position: absolute; left: 0px; top: 0px; ', 'position: relative; ')
    new_home = browser(f'https://{NEW}', scaled(velvet_home(1180, 640), 0.5, 1180, 576), 0, 0, 590, 352, bar=64, size=19, shadow=SOFT_SHADOW).replace('position: absolute; left: 0px; top: 0px; ', 'position: relative; ')
    a_body = (f'<div style="display: flex; gap: 56px"><div style="display: flex; flex-direction: column; gap: 36px; width: 760px">{frosty_logo(700)}'
              f'<div data-shop style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px">{frosty_sw}</div>'
              f'<span style="font-size: 24px; line-height: 1.5; color: {G700}">Playful, and a little clinical. Monoline caps like a clinic sign, and a mark that is an ice cube with a bite out of it, which is also, unmistakably, a molar. That’s the joke the customers notice.</span></div>'
              f'<div style="display: flex; flex-direction: column; gap: 20px">{old_home}<span style="{MONO}; font-size: 20px; color: {G700}">{OLD}{PIST}</span></div></div>')
    b_body = (f'<div style="display: flex; gap: 56px"><div style="display: flex; flex-direction: column; gap: 36px; width: 760px">{velvet_logo(700)}'
              f'<div data-shop style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px">{velvet_sw}</div>'
              f'<span style="font-size: 24px; line-height: 1.5; color: {G700}">Warmer and smoother: a soft serif (Fraunces, the film’s one prop typeface, in logos only) and a pistachio scoop on a cone whose rim is a smile. Same shop, same flavors, new sign.</span></div>'
              f'<div style="display: flex; flex-direction: column; gap: 20px">{new_home}<span style="{MONO}; font-size: 20px; color: {G700}">{NEW}{PIST}</span></div></div>')
    # the rename morph: five stages
    def blend(k):
        a = 1 - k / 4
        return (f'<div style="position: relative; width: 170px; height: 210px">'
                f'<div style="position: absolute; left: 25px; top: 30px; opacity: {a:.2f}; transform: scale({1 - 0.15 * k / 4:.2f}) translateY({k * 6}px)">{frosty_mark(120)}</div>'
                f'<div style="position: absolute; left: 30px; top: 10px; opacity: {1 - a:.2f}; transform: scale({0.85 + 0.15 * k / 4:.2f})">{velvet_mark(110)}</div></div>')
    stages = ''
    notes = ['Frosty Bites', 'roots soften into drips', 'the cube rounds into a scoop', 'frost warms to pistachio; a cone slides in', 'Velvet Scoop: the rim smiles']
    for k in range(5):
        stages += (f'<div data-shop style="display: flex; flex-direction: column; align-items: center; gap: 18px; width: 300px">{blend(k)}'
                   f'<span style="font-size: 22px; font-weight: 600; color: {G700}; text-align: center">{notes[k]}</span></div>')
        if k < 4:
            stages += f'<svg width="60" height="30" viewBox="0 0 60 30" aria-hidden="true" style="flex: none; margin-top: 90px"><path d="M4 15H50M42 7L52 15L42 23" fill="none" stroke="{G400}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    morph = (f'<div style="display: flex; align-items: flex-start; gap: 20px">{stages}</div>'
             f'<span style="display: block; margin-top: 24px; font-size: 24px; line-height: 1.5; color: {G700}">Shared-element morph on “Velvet Scoop” (beat 13): the mark changes shape in place, the wordmark’s monoline caps loosen into the soft serif, and the domain pill under it rolls to the new address. Same shop, new name.</span>')
    hero = (f'<div style="display: flex; gap: 60px; align-items: flex-start">'
            f'<div style="display: flex; flex-direction: column; gap: 16px">{pistachio_card("frosty", 1040, rank=1, scale=0.8)}<span style="font-size: 22px; font-weight: 600; color: {G600}">Acts A–D: Frosty Bites at #1</span></div>'
            f'<div style="display: flex; flex-direction: column; gap: 16px">{pistachio_card("velvet", 1040, rank=1, scale=0.8)}<span style="font-size: 22px; font-weight: 600; color: {G600}">Act E: Velvet Scoop, the same slot</span></div></div>'
            f'<div style="display: flex; gap: 60px; align-items: flex-start; margin-top: 40px"><div style="padding: 30px 40px 120px; border-radius: 22px; background: {NIGHT}">{melt_card(1040, 0.72)}</div>'
            f'<span style="width: 900px; font-size: 24px; line-height: 1.5; color: {G700}">One object, always the same: the same card, the same path ({PIST}), the same scoop-in-a-cup icon, in both worlds. It ranks (A), it’s what the owner fears losing (B), it’s the example in the map (C, D), it melts in the twist (D), it passes the test and it’s back at #1 (E). The melt is a shape change on the card only: it sags, its bottom edge runs, it slides down the list. Amber ring = the frame’s one amber.</span></div>')
    tethers = (f'<div style="display: flex; gap: 30px; align-items: flex-start">{page_card(PIST, w=480, hero=True, badge="#1 · 48 links · 5 yrs")}'
               f'{blog_card("Where to find the best pistachio in town", w=440)}{review_card("Frosty Bites’ pistachio is worth the drive.", w=440)}</div>'
               f'<span style="display: block; margin-top: 24px; font-size: 24px; line-height: 1.5; color: {G700}">Pages, food-blog links and reviews, roped to the address pill. Blogs and reviews are generic: no real site, reviewer or platform is named. Stars are neutral ink, never amber.</span>')
    props = (f'<div style="display: flex; gap: 40px; align-items: flex-start">{bio_card(380)}{menu_card(340)}{maps_card(400)}</div>'
             f'<span style="display: block; margin-top: 36px; font-size: 24px; line-height: 1.5; color: {G700}">A social bio, a paper menu and a maps-style listing, all generic: no platform logo or trade dress. The menu shows a QR <b>slot</b>, never a code.</span>')
    rules = ('<ul style="margin: 0; padding-left: 28px; display: flex; flex-direction: column; gap: 14px; font-size: 25px; line-height: 1.45; color: #344054">'
             f'<li>Both shops, both logos and both sites are original. Domains are mockups: <span style="{MONO}">{OLD}</span> and <span style="{MONO}">{NEW}</span> (the plain names are registered by others; see open-questions).</li>'
             '<li>Shop palettes live only inside the shops’ sites, logos and props. The film around them stays RedirHub: rooms, glass, tokens.</li>'
             '<li>Teal still means fixed, Signal Red broken, amber once a frame. Pistachio is a pale yellow-green and frost a pale sky: neither reads as teal or product blue.</li>'
             '<li>Search, blogs, reviews, bio, maps and the console are generic: no third-party logos, colours or interface copy.</li></ul>')
    inner = (f'<div style="position: absolute; left: 120px; top: 100px; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {G500}">W44 · CAST AND PROPS</span>'
             f'<span style="font-size: 88px; font-weight: 800; letter-spacing: -0.04em; color: {CHAR}">The story world.</span></div>'
             + world_panel(120, 340, 1470, 760, 'THE OLD NAME', 'Frosty Bites', a_body)
             + world_panel(1690, 340, 1470, 760, 'THE NEW NAME', 'Velvet Scoop', b_body)
             + world_panel(120, 1180, 1470, 620, 'THE RENAME', 'One logo becomes the other', morph)
             + world_panel(1690, 1180, 1470, 620, 'THE RULES', 'Inside the frame, it’s still RedirHub', rules)
             + world_panel(120, 1880, 1960, 800, 'THE HERO PROP', 'The pistachio card', hero)
             + world_panel(2160, 1880, 1000, 800, 'SEO TETHERS', 'What holds the spot', tethers.replace('display: flex; gap: 30px', 'display: flex; flex-wrap: wrap; gap: 24px')))
    props_panel = world_panel(120, 2760, 1470, 0, 'SHOP PROPS', 'Everything the owner controls', props)
    return (f'<div style="width: {W}px; height: {H + 760}px; box-sizing: border-box; position: relative; overflow: hidden; background: linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%); {JAK}; color: {CHAR}">'
            f'{inner}{props_panel.replace("height: 0px", "height: 680px")}'
            + world_panel(1690, 2760, 1470, 680, 'THE SEARCH PAGE', 'Generic, labelled Example',
                          f'<div style="position: relative; width: 1280px; height: 520px; transform: scale(0.6); transform-origin: top left">{search_page(pistachio_card("frosty", 1040, rank=1), x=0, y=0, w=1280, h=700)}</div>')
            + '</div>', W, H + 760)


def board(inner):
    return (f'<div data-solid-bg style="width: 1920px; height: 1080px; box-sizing: border-box; position: relative; overflow: hidden; background: {DARK}; {JAK}; color: #FFFFFF">{inner}</div>')


def room_tile(room, name, use):
    bg, fg, _ = ROOMS[room]
    return (f'<div style="display: flex; flex-direction: column; gap: 12px"><div style="height: 130px; border-radius: 18px; background: {bg}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14); display: flex; align-items: flex-end; padding: 14px 16px; box-sizing: border-box">'
            f'<span style="font-size: 21px; font-weight: 800; color: {fg}">{name}</span></div><span style="font-size: 17px; line-height: 1.35; color: {INK_SOFT}">{use}</span></div>')


@F('w44-System', 'System: rooms, colour, type')
def _system():
    tiles = ''.join(room_tile(*t) for t in (
        ('light', 'Light', 'A · the shop, the search · B · dashboard steps · Keep · Return'),
        ('mesh', 'Dark mesh', 'SEO · End card'),
        ('night', 'Night', 'The worry (literally night)'),
        ('sweep', 'Brand sweep', 'Title'),
        ('lab', 'Lab', 'Pages · Flip · Checker'),
        ('radial', 'Brand radial', 'Steps (and the recap)'),
        ('twist', 'Twist night', 'The melt'),
        ('mesh-teal', 'Teal mesh', 'One to one')))
    roles = ''.join(f'<div style="display: flex; align-items: center; gap: 14px"><span style="width: 44px; height: 44px; flex: none; border-radius: 12px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>'
                    f'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 20px; font-weight: 700">{n}</span><span style="font-size: 16px; color: {INK_SOFT}">{r}</span></div></div>'
                    for c, n, r in ((TEAL, 'Teal', 'fixed, the pass, the snap'), (RED, 'Signal red', 'broken: lost history, the melt'), (AMBER, 'Amber', 'once: the melting card'),
                                    (BLUE, 'Blue', 'inside product UI only'), ('#FBF7EF', 'Paper', 'the map, the menu, the calendar'), (CHAR, 'Charcoal', 'tips')))
    shop = ''.join(f'<span style="width: 44px; height: 44px; border-radius: 12px; background: {c}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)"></span>' for c in list(FROSTY.values()) + list(VELVET.values()))
    inner = (f'<div style="position: absolute; left: 120px; top: 90px; display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {INK_SOFT}"><span style="width: 36px; height: 3px; border-radius: 2px; background: {TEAL}"></span>SYSTEM · W44</div>'
             f'<span style="position: absolute; left: 120px; top: 140px; font-size: 56px; font-weight: 800; letter-spacing: -0.03em">A story world inside the RedirHub frame.</span>'
             f'<span style="position: absolute; left: 120px; top: 218px; font-size: 22px; color: {INK_SOFT}">W43’s rooms, one per beat of the story. The shops bring their own colours, but only inside their own things.</span>'
             f'<div style="position: absolute; left: 120px; top: 280px; width: 1680px; display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 18px">{tiles}</div>'
             f'<div style="position: absolute; left: 120px; top: 540px; width: 1680px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.12)">{roles}</div>'
             f'<div style="position: absolute; left: 120px; top: 660px; width: 1680px; display: grid; grid-template-columns: 1.1fr 1fr 1.1fr; gap: 40px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.12)">'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 18px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">TYPE</span>'
             f'<span style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em">Plus Jakarta Sans: the film’s own words</span>'
             f'<span style="{MONO}; font-size: 19px">JetBrains Mono: every URL and domain</span>'
             f'<span data-ui="sample" style="{UI}; font-size: 21px; color: {INK_SOFT}">Inter: product UI and recreated web UI</span>'
             f'<span data-logo style="{FR}; font-size: 24px; font-weight: 600; color: {INK_SOFT}">Fraunces: the Velvet Scoop logo only</span></div>'
             f'<div style="display: flex; flex-direction: column; gap: 12px"><span style="font-size: 18px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">STORY WORLD ONLY</span>'
             f'<div data-shop style="display: flex; gap: 10px">{shop}</div>'
             f'<span style="font-size: 18px; line-height: 1.45; color: {INK_SOFT}">Frosty: ice, frost, glacier, frost ink. Velvet: cream, pistachio, leaf, cocoa. Never on a room, a caption or a signal.</span></div>'
             f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="font-size: 18px; font-weight: 700; letter-spacing: 0.14em; color: {TEAL}">CHANGED FROM W43</span>'
             f'<span style="font-size: 18px; line-height: 1.5; color: {INK_SOFT}">New: a story world (two shops, one prop typeface in logos, two shop palettes, gated in the checker). New rooms: Night for the worry, Teal mesh for the one-to-one fix. Rooms follow the story beats, not only the acts. Everything else as W43.</span></div></div>')
    return board(inner)


@F('w44-Sound', 'Sound, voice and timing')
def _sound():
    rows = (('Transition', 'Twice: into the title, into the dashboard (Website Migration).'),
            ('Shimmer', 'Once: the logo morph on “Velvet Scoop”.'),
            ('Problem', 'One soft tone as the room drops and the card starts to melt.'),
            ('Rewind', 'Once: the melt runs back and the lines un-bend (One to one).'),
            ('Snap', 'One soft pop per page locking onto its twin; Create redirect.'),
            ('Fixed chime', 'Only two: “That’s a pass” and Velvet Scoop landing in the old slot.'),
            ('Music', 'The W43 pad, start to end, about 16 LU under the voice. Silence on the end card.'))
    srows = ''.join(f'<div style="display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 22px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.12)">'
                    f'<span style="font-size: 24px; font-weight: 700">{a}</span><span style="font-size: 19px; line-height: 1.4; color: {INK_SOFT}">{b}</span></div>' for a, b in rows)
    voice = (('A', 'warm → curious → proud'), ('SEO', 'plain, then [pause] on the address'), ('B', 'amused → laughs softly → sighs → excited'),
             ('Worry', 'worried → reassuring'), ('C', 'clear, teaching'), ('Twist', 'conspiratorial → light → serious → softly'),
             ('Fix', 'firm'), ('Steps', 'calm, product voice'), ('Proof', 'curious → delighted'), ('Wobble', 'gently → reassuring'),
             ('Keep', 'playful'), ('Return', 'warm → proud'))
    vrows = ''.join(f'<div style="display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 16px; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.10)">'
                    f'<span style="font-size: 19px; font-weight: 700">{a}</span><span style="{MONO}; font-size: 17px; color: {TEAL}">{b}</span></div>' for a, b in voice)
    inner = (f'<div style="position: absolute; left: 120px; top: 90px; width: 1680px; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); column-gap: 90px">'
             f'<div style="display: flex; flex-direction: column; gap: 14px"><span style="font-weight: 700; font-size: 22px; letter-spacing: 0.16em; color: {TEAL}">SOUND · ONLY ON STORY BEATS</span><div>{srows}</div>'
             f'<div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px">'
             + ''.join(f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="{MONO}; font-size: 30px; color: {TEAL}">{a}</span><span style="font-size: 18px; color: {INK_SOFT}">{b}</span></div>'
                       for a, b in (('−14 LUFS', 'master, voice on top'), ('words ÷ 3 + 1 s', 'least any line holds'), ('1 s silence', 'after “starts to melt”')))
             + '</div></div>'
             f'<div style="display: flex; flex-direction: column; gap: 14px"><span style="font-weight: 700; font-size: 22px; letter-spacing: 0.16em; color: {TEAL}">VOICE · THE PICTURE MATCHES THE TAG</span><div>{vrows}</div>'
             f'<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px; padding: 16px 20px; border-radius: 14px; background: rgba(255,255,255,0.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14)">'
             f'<span style="font-weight: 700; font-size: 19px; color: {TEAL}">Changed from W43</span><span style="font-size: 18px; line-height: 1.45; color: {INK_SOFT}">ElevenLabs v3 delivery tags drive the voice; each frame’s note names its tag. New cues: one shimmer (rename), one snap per twin. The second fixed chime moves from the end card to the return, where the story clicks shut. No audio made in this pass.</span></div></div></div>')
    return board(inner)

def main():
    import sys
    only = sys.argv[1:]
    os.makedirs(OUT, exist_ok=True)
    for name, (title, fn) in FRAMES.items():
        if only and not any(o in name for o in only):
            continue
        res = fn()
        body, w, h = (res if isinstance(res, tuple) else (res, 1920, 1080))
        open(os.path.join(OUT, name + '.dc.html'), 'w').write(page(f'W44 · {title}', body, w, h))
        print('wrote', name)


if __name__ == '__main__':
    main()
