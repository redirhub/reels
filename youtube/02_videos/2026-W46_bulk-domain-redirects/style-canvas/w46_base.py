"""W46 house system: tokens, rooms, frame helpers and the RedirHub dashboard shell.

Started from W44's build_frames.py (tokens, page(), rooms, browser, pill/tag/tip/headline/caption, shell).
Changed for W46: Fredoka and the shop palette are gone (Glomvo brings Instrument Serif and its own stone
palette, in w46_props.py); the dashboard workspace is Glomvo; a new 'evening' room for Act C.
"""
import os

# ---------------------------------------------------------------- tokens
NIGHT, TEAL, RED, AMBER, BLUE = '#0B1426', '#20A795', '#E5484D', '#E59426', '#1C6DB6'
INK, INK_SOFT, INK_MUTE = '#FFFFFF', '#B9C6D8', '#6B7A90'
CHAR, DARK = '#181D27', '#101828'
G700, G600, G500, G400, G300, G200, G100, G50 = '#344054', '#475467', '#667085', '#98A2B3', '#D0D5DD', '#EAECF0', '#F2F4F7', '#F9FAFB'
MONO = "font-family: 'JetBrains Mono', monospace"
UI = "font-family: 'Inter', sans-serif"
JAK = "font-family: 'Plus Jakarta Sans', system-ui, sans-serif"

FONTS = ('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Inter:wght@400;500;600;700'
         '&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Instrument+Serif:ital@0;1&amp;display=swap')


def page(title, body, w=1920, h=1080):
    return f"""<!doctype html>
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
"""


# ---------------------------------------------------------------- rooms: gradients only (no grids, floors or tilted planes)
DOTS = ('<div data-bg style="position: absolute; inset: 0; background-image: radial-gradient(rgba(16,24,40,0.10) 1.5px, rgba(0,0,0,0) 1.5px); '
        'background-size: 32px 32px; -webkit-mask-image: radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%); '
        'mask-image: radial-gradient(70% 70% at 60% 50%, #000 20%, rgba(0,0,0,0) 80%)"></div>')

ROOMS = {
    # Light: the website's light gradient with a soft dot texture.
    'light': ('linear-gradient(160deg, #F2F7FC 0%, #EEF8F6 100%)', CHAR, DOTS),
    # Glow: the gradient Leo kept from W44 round 1 ("The top spot melts"): a warm glow over charcoal to night.
    'glow': ('radial-gradient(ellipse 900px 520px at 70% 8%, rgba(229,72,77,0.20) 0%, rgba(229,72,77,0) 100%), linear-gradient(#181D27 0%, #0B1426 100%)', INK, ''),
    # The same recipe with the glow in teal: for the fix and the proof.
    'glow-teal': ('radial-gradient(ellipse 900px 520px at 70% 8%, rgba(32,167,149,0.22) 0%, rgba(32,167,149,0) 100%), linear-gradient(#181D27 0%, #0B1426 100%)', INK, ''),
    'sweep': ('linear-gradient(163deg, #1C6DB6 0%, #20A795 86%)', INK, ''),
    'radial': ('radial-gradient(111.83% 100% at 50% 100%, #20A795 0%, #1C6DB6 100%)', INK, ''),
    'charcoal': ('linear-gradient(#181D27 0%, #101828 100%)', INK, ''),
    # Evening (new in W46): Act C, the founder at night. Navy to night, no glow: the quietest room.
    'evening': ('linear-gradient(170deg, #1A2A55 0%, #0B1426 70%)', INK, ''),
}


def frame(room, inner, extra=''):
    bg, fg, deco = ROOMS[room]
    return (f'<div{extra} style="width: 1920px; height: 1080px; box-sizing: border-box; position: relative; overflow: hidden; background: {bg}; '
            f'{JAK}; color: {fg}">\n{deco}\n{inner}\n</div>')


def eyebrow(text, dark=False):
    c = INK_SOFT if not dark else G600
    return (f'<div style="position: absolute; left: 120px; top: 110px; font-size: 22px; font-weight: 700; letter-spacing: 0.14em; color: {c}">{text}</div>')


def progress(n, light=True):
    off = G300 if light else 'rgba(255,255,255,0.25)'
    # the newest segment (n) fills through --prog (0 off … 1 lit; unset = lit), so a step can take its segment
    fill = lambda i: (f'color-mix(in srgb, {TEAL} calc(var(--prog, 1) * 100%), {off})' if i == n - 1 else TEAL if i < n else off)
    bars = ''.join(f'<span style="width: 64px; height: 6px; border-radius: 3px; background: {fill(i)}"></span>' for i in range(3))
    return f'<div style="position: absolute; left: 1560px; top: 110px; width: 240px; display: flex; align-items: center; justify-content: flex-end; gap: 12px; height: 30px">{bars}</div>'


def check(size=56, fill=TEAL, mark='#FFFFFF'):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 64 64" aria-hidden="true" style="flex: none"><circle cx="32" cy="32" r="29" fill="{fill}"></circle>'
            f'<path d="M19 33l9 9 17-19" fill="none" stroke="{mark}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path></svg>')


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
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else 'position: relative; '
    return (f'<div data-ui="website"{extra} style="{pos}width: {w}px; height: {h}px; border-radius: 24px; overflow: hidden; '
            f'background: #FFFFFF; box-shadow: {shadow}; {UI}; color: {CHAR}">'
            f'<div style="height: {bar}px; display: flex; align-items: center; gap: 16px; padding: 0 22px; border-bottom: 1px solid {G200}; box-sizing: border-box">'
            '<div style="display: flex; gap: 8px"><span style="width: 13px; height: 13px; border-radius: 50%; background: #F97066"></span>'
            '<span style="width: 13px; height: 13px; border-radius: 50%; background: #FDB022"></span><span style="width: 13px; height: 13px; border-radius: 50%; background: #32D583"></span></div>'
            f'<div style="flex: 1; height: {bar - 24}px; border-radius: {(bar - 24) // 2}px; background: {G100}; display: flex; align-items: center; gap: 10px; padding: 0 18px; {MONO}; font-size: {size}px; color: {G700}">'
            f'{LOCK}{url}</div></div>{inner}</div>')


def pill(text, x=None, y=None, size=34, light=True, ring=None, extra=''):
    pos = f'position: absolute; left: {x}px; top: {y}px; ' if x is not None else ''
    bg = '#FFFFFF' if light else 'rgba(255,255,255,0.10)'
    fg = CHAR if light else INK
    sh = f'0 0 0 4px {ring}, ' if ring else ''
    return (f'<span{extra} style="{pos}display: inline-flex; align-items: center; gap: 12px; height: {size * 2.1:.0f}px; padding: 0 {size * 0.9:.0f}px; border-radius: {size * 1.05:.0f}px; '
            f'background: {bg}; box-shadow: {sh}0 20px 50px rgba(16,24,40,0.18), inset 0 0 0 1.5px rgba(255,255,255,0.4); {MONO}; font-size: {size}px; font-weight: 500; color: {fg}; white-space: nowrap">{text}</span>')


def tag(text, light=True, color=None):
    bg = '#FFFFFF; box-shadow: 0 0 0 1px #EAECF0' if light else 'rgba(255,255,255,0.10)'
    fg = color or (G600 if light else INK_SOFT)
    return (f'<span style="display: inline-flex; align-self: flex-start; width: max-content; align-items: center; height: 34px; padding: 0 14px; border-radius: 17px; background: {bg}; font-size: 16px; font-weight: 700; '
            f'letter-spacing: 0.06em; color: {fg}; white-space: nowrap">{text}</span>')


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


def place(x, y, html, extra=''):
    return f'<div{extra} style="position: absolute; left: {x}px; top: {y}px">{html}</div>'


def group_label(text, x, y, color=INK_SOFT):
    return f'<span style="position: absolute; left: {x}px; top: {y}px; font-size: 20px; font-weight: 700; letter-spacing: 0.14em; color: {color}">{text}</span>'


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
             f'<div style="display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: #FFFFFF; border: 1px solid #EAECF0"><span style="width: 28px; height: 28px; border-radius: 8px; background: #E8F0F8; color: #1962A4; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center">G</span>'
             f'<span style="flex-grow: 1; font-size: 14px; font-weight: 600; color: #181D27">Glomvo</span><span style="display: inline-flex; color: #98A2B3">{ico("M7 15l5 5 5-5M7 9l5-5 5 5", 15)}</span></div>'
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
