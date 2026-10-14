#!/usr/bin/env python3
"""Turn a key frame's markup (.dc.html) into JSX, so a Remotion scene starts from the exact
approved layout instead of a redraw.

    python3 scripts/yt/html2jsx.py <frame.dc.html> [--inner]   → JSX on stdout

Inline style strings become style objects, SVG attributes become camelCase props, class → className,
data-* and aria-* stay. --inner drops the 1920×1080 root div and prints its children only.
"""
import re, sys, html as H
from html.parser import HTMLParser

VOID = {'br', 'img', 'input', 'meta', 'link', 'hr', 'path', 'rect', 'circle', 'polygon', 'line', 'stop', 'ellipse', 'polyline'}
SVG_ATTR = {'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'stroke-opacity': 'strokeOpacity',
            'fill-opacity': 'fillOpacity', 'stroke-dasharray': 'strokeDasharray', 'shape-rendering': 'shapeRendering', 'viewbox': 'viewBox',
            'stop-color': 'stopColor', 'class': 'className', 'for': 'htmlFor', 'font-family': 'fontFamily', 'font-size': 'fontSize', 'font-weight': 'fontWeight',
            'text-anchor': 'textAnchor', 'clip-path': 'clipPath', 'fill-rule': 'fillRule', 'clip-rule': 'clipRule'}

def camel(p):
    if p.startswith('-webkit-'): p = 'Webkit-' + p[8:]
    parts = p.split('-'); return parts[0] + ''.join(x[:1].upper() + x[1:] for x in parts[1:])

def style_obj(s):
    out = []
    # split on ; not inside parentheses or quotes
    depth, cur, q = 0, '', None
    for ch in s:
        if q:
            cur += ch; q = None if ch == q else q; continue
        if ch in '"\'': q = ch; cur += ch; continue
        if ch == '(': depth += 1
        if ch == ')': depth -= 1
        if ch == ';' and depth == 0: out.append(cur); cur = ''; continue
        cur += ch
    out.append(cur)
    items = []
    for d in out:
        if ':' not in d: continue
        k, v = d.split(':', 1); k, v = k.strip(), v.strip()
        if not k: continue
        num = re.fullmatch(r'-?\d+(\.\d+)?px', v)
        if num and k not in ('line-height',): val = v[:-2]
        elif re.fullmatch(r'-?\d+(\.\d+)?', v) and k in ('opacity', 'font-weight', 'flex-grow', 'flex-shrink', 'z-index', 'line-height', 'flex'): val = v
        else: val = repr(v).replace("\\'", "'") if "'" not in v else '"' + v.replace('"', '\\"') + '"'
        items.append(f'{camel(k)}: {val}')
    return '{{ ' + ', '.join(items) + ' }}'

class P(HTMLParser):
    def __init__(s): super().__init__(convert_charrefs=True); s.out = []; s.depth = 0
    def attrs(s, tag, a):
        r = []
        for k, v in a:
            if k == 'style': r.append(f'style={style_obj(v or "")}'); continue
            kk = SVG_ATTR.get(k, k)
            if kk.startswith('on'): continue
            if v is None: v = ''
            r.append(f'{kk}="{H.escape(v, quote=True)}"' if '{' not in v else f'{kk}={{{repr(v)}}}')
        return (' ' + ' '.join(r)) if r else ''
    def handle_starttag(s, tag, a):
        if tag in ('helmet', 'script', 'style', 'link'): s.skip = getattr(s, 'skip', 0) + (0 if tag == 'link' else 1); return
        if getattr(s, 'skip', 0): return
        s.out.append(f'<{tag}{s.attrs(tag, a)}' + (' />' if tag in VOID else '>'))
    def handle_startendtag(s, tag, a):
        if getattr(s, 'skip', 0) or tag == 'link': return
        s.out.append(f'<{tag}{s.attrs(tag, a)} />')
    def handle_endtag(s, tag):
        if tag in ('helmet', 'script', 'style'): s.skip -= 1; return
        if getattr(s, 'skip', 0) or tag in VOID or tag == 'link': return
        s.out.append(f'</{tag}>')
    def handle_data(s, d):
        if getattr(s, 'skip', 0): return
        if not d.strip(): s.out.append(' ' if ' ' in d and s.out and not s.out[-1].endswith('>') else ''); return
        s.out.append(d.replace('{', '{"{"}').replace('}', '{"}"}').replace('<', '&lt;').replace('>', '&gt;'))

src = open(sys.argv[1]).read()
body = src[src.index('<x-dc>') + 6: src.index('</x-dc>')]
p = P(); p.feed(body)
jsx = ''.join(p.out).strip()
if '--inner' in sys.argv:
    m = re.match(r'<div style=\{\{[^}]*\}\}>(.*)</div>\s*$', jsx, re.S)
    jsx = m.group(1) if m else jsx
print(jsx)
