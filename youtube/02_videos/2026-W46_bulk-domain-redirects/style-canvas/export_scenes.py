#!/usr/bin/env python3
"""Export the approved W46 key frames as Remotion layers: src/remotion/reels/bulk-redirects/frames.gen.tsx.

    python3 youtube/02_videos/2026-W46_bulk-domain-redirects/style-canvas/export_scenes.py

Each frame in build_frames.py is a room plus a list of top-level elements; every element becomes one layer
(`F.Door[0]`, `F.Door[1]`, …), converted to JSX by scripts/yt/html2jsx.py's parser, so a scene starts from the
exact approved markup and only adds motion. VARIANTS adds states a scene morphs between (a closed door, a sheet
before its rows), drawn with the same props. Regenerate after any change to build_frames.py or w46_props.py.
"""
import os, re, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, HERE)
import build_frames as bf  # noqa: E402

# html2jsx's parser, without running its command line.
src = open(os.path.join(ROOT, 'scripts', 'yt', 'html2jsx.py')).read()
ns = {}
exec(src[:src.index('src = open(sys.argv[1])')], ns)
P = ns['P']


def hooks(jsx):
    """Motion hooks, set in the frame markup and driven by a scene through CSS variables (unset = as approved):
    data-draw="n": a path that draws on (--draw-n: 1 hidden … 0 drawn); data-o="n": an element's opacity and lift
    (--o-n, --y-n); data-clip="n": an element revealed top-down (--clip-n: % hidden from the bottom)."""
    def tag(m):
        t = m.group(0)
        d = re.search(r'data-draw="(\w+)"', t)
        if d:
            n = d.group(1)
            t = t.replace(d.group(0), f'{d.group(0)} pathLength={{1}} strokeDasharray="1 1"', 1)
            t = t[:-2] + f" style={{{{strokeDashoffset: 'var(--draw-{n}, 0)'}}}} />" if t.endswith('/>') else t[:-1] + f" style={{{{strokeDashoffset: 'var(--draw-{n}, 0)'}}}}>"
        for kind, css in (('o', lambda n: f"opacity: 'var(--o-{n}, 1)', translate: '0 var(--y-{n}, 0px)', "),
                          ('clip', lambda n: f"clipPath: 'inset(0 0 var(--clip-{n}, 0%) 0)', "),
                          ('clipx', lambda n: f"clipPath: 'inset(0 var(--clipx-{n}, 0%) 0 0)', ")):
            h = re.search(rf'data-{kind}="(\w+)"', t)
            if h:
                ins = css(h.group(1))
                own = re.search(r"(?<![a-zA-Z])opacity: ([0-9.]+)", t) if kind == 'o' else None
                if own:  # a hooked element that is already dimmed: the hook multiplies into its own opacity
                    t = t.replace(own.group(0) + ', ', '', 1).replace(', ' + own.group(0), '', 1)
                    ins = ins.replace(f"'var(--o-{h.group(1)}, 1)'", f"'calc(var(--o-{h.group(1)}, 1) * {own.group(1)})'")
                t = t.replace('style={{', 'style={{' + ins, 1) if 'style={{' in t else (t[:-2] + f' style={{{{{ins}}}}} />' if t.endswith('/>') else t[:-1] + f' style={{{{{ins}}}}}>')
        return t
    return re.sub(r'<[a-zA-Z][^<>]*?data-(?:draw|o|clip|clipx)="\w+"[^<>]*?/?>', tag, jsx)


SVG_TAGS = {'lineargradient': 'linearGradient', 'radialgradient': 'radialGradient', 'clippath': 'clipPath', 'fegaussianblur': 'feGaussianBlur',
            'feturbulence': 'feTurbulence', 'fecolormatrix': 'feColorMatrix', 'textpath': 'textPath'}


def split_top(s, sep=','):
    out, depth, q, cur = [], 0, None, ''
    for ch in s:
        if q:
            cur += ch; q = None if ch == q else q; continue
        if ch in '"\'': q = ch
        elif ch in '([{': depth += 1
        elif ch in ')]}': depth -= 1
        if ch == sep and depth == 0: out.append(cur); cur = ''; continue
        cur += ch
    if cur.strip(): out.append(cur)
    return out


def dedupe_styles(jsx):
    """CSS keeps the last of two equal properties; a JS object may not repeat a key. Keep the last, like CSS."""
    def fix(m):
        items, seen = split_top(m.group(1)), {}
        for it in items:
            k = it.split(':', 1)[0].strip()
            seen[k] = it.strip()
        return 'style={{ ' + ', '.join(seen.values()) + ' }}'
    return re.sub(r'style=\{\{(.*?)\}\}(?=[ />])', fix, jsx)


def counts(jsx):
    """data-count="n": a number a scene can roll. Its text becomes a CSS counter set from --count-n (unset = the approved
    number), drawn by the composition's `.w46-count::after { content: counter(w46n) }` rule."""
    return re.sub(r'<span data-count="(\w+)"\s*>(\d+)</span>',
                  lambda m: f"<span data-count=\"{m.group(1)}\" className=\"w46-count\" style={{{{counterReset: 'w46n var(--count-{m.group(1)}, {m.group(2)})'}}}} />", jsx)


def to_jsx(html):
    p = P(); p.feed(html); j = ''.join(p.out).strip()
    for a, b in SVG_TAGS.items():
        j = j.replace(f'<{a}', f'<{b}').replace(f'</{a}>', f'</{b}>')
    return counts(hooks(dedupe_styles(j)))


TAG = re.compile(r'<(/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"\']|"[^"]*"|\'[^\']*\')*?)(/?)>')


def top_level(html):
    """Split markup into its top-level elements (our generator always closes its tags)."""
    out, depth, start = [], 0, None
    for m in TAG.finditer(html):
        closing, selfclose = m.group(1) == '/', m.group(4) == '/'
        if not closing:
            if depth == 0: start = m.start()
            if not selfclose: depth += 1
            elif depth == 0: out.append(html[start:m.end()])
        else:
            depth -= 1
            if depth == 0: out.append(html[start:m.end()])
    return out


ROOM_KEY = {'light': 'light', 'glow': 'glow', 'glow-teal': 'glowTeal', 'sweep': 'sweep', 'radial': 'radial', 'charcoal': 'charcoal', 'evening': 'evening'}
captured = {}


def capture(room, inner, extra=''):
    captured['room'], captured['inner'] = room, inner
    return ''


bf.frame = capture

# Extra states a scene morphs between, drawn with the same props as the frames (placed exactly like them).
P_ = bf


def V(html):
    return html


def _bytag_dash(tag):
    """w46-ByTag's dashboard without its dialog: all links (tag None), or filtered to a tag and selected."""
    if tag:
        top = (f'<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px"><span style="{P_.BTN_S}; height: 34px; font-size: 13px">Tags: {P_.tag_chip(tag, 12)}</span>'
               f'<span style="font-size: 14px; font-weight: 600; color: #181D27">128 links selected</span><span style="{P_.BTN_S}; height: 34px; font-size: 13px">Change destination</span></div>')
        rows = P_.links_rows(8, sel=True, tagf=tag)
    else:
        top = f'<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px"><span style="{P_.BTN_S}; height: 34px; font-size: 13px">Tags</span></div>'
        rows = P_.links_rows(8)
    body = f'<div style="flex: 1; display: flex; flex-direction: column; padding: 18px 24px">{top}<div style="border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px #EAECF0">{rows}</div></div>'
    sh = P_.shell('Links', ['Links'], f'<span style="{P_.BTN_P}">Create</span>', body)
    return P_.dashboard(f'<div style="position: relative; width: 1400px; height: 633px">{sh}</div>', 120, 200, 1.12, 1400, 633)


VARIANTS = {
    # Act A
    # Act C: the founder's browser while they type the plain address (before it asks for https), and the notebook
    # before kipzoo.com is crossed out.
    'TwoPlain': lambda: P_.browser2('<span data-clipx="kip" style="color: #181D27; display: inline-block">kipzoo.com</span>'
                                    '<span data-o="caret" style="width: 2px; height: 26px; background: #181D27"></span>',
                                    '<div style="height: 394px; background: #FFFFFF"></div>', 960, 300, 840, 470, shadow=P_.DARK_SHADOW, bar=76, size=26),
    'WarnNamed': lambda: P_.scaled(P_.notebook(1400, 760, name=P_.KIP), 0.56, 1400, 760, x=1010, y=520),
    # Act D: the door before it opens (the frame's own layer is the open door; its knock arcs are hooks knock0-2).
    'DoorClosed': lambda: P_.place(210, 190, P_.door(390, 'closed', knock=3, label=P_.KIP, uid='c', show_knock=False)),
    # Act F: the Links page before the filter, and filtered and selected before the dialog (no scrim yet).
    'ByTagAll': lambda: _bytag_dash(None),
    'ByTagPicked': lambda: _bytag_dash('Brandables'),
    # Act E: the padlock wall before its doors open, each closed door its own hook (--o-pc{k}), placed like w46-Padlocks.
    'PadClosed': lambda: ''.join(P_.place(140 + (k % 6) * 280, 250 + (k // 6) * 320, P_.door(150, 'closed', label=n, uid=f'c{k}'), extra=f' data-o="pc{k}"')
                                 for k, n in enumerate(P_.WALL)),
}

layers, rooms, notes = {}, {}, {}
for name, (title, fn) in bf.FRAMES.items():
    if name in ('w46-World', 'w46-System', 'w46-Sound'):
        continue
    captured.clear()
    fn()
    key = name[4:]
    rooms[key] = ROOM_KEY[captured['room']]
    parts = top_level(captured['inner'])
    layers[key] = [to_jsx(h) for h in parts]
    notes[key] = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h)).strip()[:60] for h in parts]
extras = {k: to_jsx(fn()) for k, fn in VARIANTS.items()}

out = ['/* GENERATED by youtube/02_videos/2026-W46_bulk-domain-redirects/style-canvas/export_scenes.py from the approved',
       '   key frames (build_frames.py). Do not edit: change the frame or its props and regenerate. Each frame is its room',
       '   plus its top-level layers, in paint order; scenes animate the layers. */',
       '/* eslint-disable */',
       "import type { ReactElement } from 'react';",
       "import type { Room } from './kit';",
       '',
       'export type Layer = () => ReactElement;']
for key, ls in layers.items():
    out.append(f'\n/** w46-{key} · room {rooms[key]}. Layers: ' + ' | '.join(f'[{i}] {n}' for i, n in enumerate(notes[key])) + ' */')
    out.append(f'const {key}: Layer[] = [')
    for j in ls:
        out.append(f'    () => (<>{j}</>),')
    out.append('];')
out.append('\nexport const F = {' + ', '.join(layers) + '} as const;')
out.append('export const ROOM: Record<keyof typeof F, Room> = ' + json.dumps(rooms) + ';')
out.append('\n/** Extra states (VARIANTS in export_scenes.py). */')
out.append('export const X = {')
for k, j in extras.items():
    out.append(f'    {k}: (() => (<>{j}</>)) as Layer,')
out.append('} as const;\n')
dst = os.path.join(ROOT, 'src', 'remotion', 'reels', 'bulk-redirects', 'frames.gen.tsx')
open(dst, 'w').write('\n'.join(out))
print(f'{len(layers)} frames, {sum(len(v) for v in layers.values())} layers, {len(extras)} variants → {dst} ({os.path.getsize(dst) // 1024} KB)')
for k in layers:
    print(f'  {k:11s} {rooms[k]:9s}', ' | '.join(f'[{i}] {n[:28]}' for i, n in enumerate(notes[k])))
