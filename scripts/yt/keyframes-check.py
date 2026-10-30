#!/usr/bin/env python3
"""Render a video's key frames (.dc.html) to PNG and audit them against the channel's fit rules.

    python3 scripts/yt/keyframes-check.py <video>/style-canvas/project <video>/style-canvas/stills [names...]

Checks every w43-/wNN- prefixed frame (set PREFIX below): text inside the 120 px gutters and above y 950,
fonts (Jakarta / JetBrains Mono for every domain / Inter only inside [data-ui]), colours on the token list,
amber on at most one object, ink outside the safe area. Mark product UI with data-ui, the end card with
data-endcard, solid boards with data-solid-bg, the logo with data-logo, and decorative background
layers (grids, floors, glows) with data-bg: the ink check compares each frame with a render of its background
only, so those layers may reach the edge.

A story world (W44 on) may add one prop typeface for its fictional logos and a palette for its fictional
shops: PROP_FONT=<family> PROP_FONT_FILE=<woff2> allows that family only inside [data-logo], and SHOP_HEX="AABBCC ..."
allows those colours only inside [data-shop] or [data-logo]. A board that is not 1920 x 1080 (a world or
reference sheet) skips the safe-area and ink checks; fonts, colours and amber still apply. NO_TILT=1 flags any element
that is rotated, skewed or put in perspective (Leo, W44: nothing on screen is tilted).

Each frame is written with literal markup (no {{holes}}), so it renders in plain Chromium once the
canvas runtime line is dropped and the brand fonts are loaded from public/fonts. The audit runs in
the page (computed fonts, text boxes, colours) and on the PNG (ink outside the safe area).
"""
import json, os, re, subprocess, sys, html
from PIL import Image, ImageChops

PROJ, STILLS = sys.argv[1], sys.argv[2]
NAMES = sys.argv[3:]
HS = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
FONTS = '/home/user/reels/public/fonts'
import tempfile
WORK = os.path.join(tempfile.gettempdir(), 'keyframes-check')
PREFIX = os.environ.get('PREFIX', 'w43-')
PROP_FONT = os.environ.get('PROP_FONT', '')
PROP_FONT_FILE = os.environ.get('PROP_FONT_FILE', '')
SHOP_HEX = os.environ.get('SHOP_HEX', '').split()
NO_TILT = os.environ.get('NO_TILT', '') == '1'
os.makedirs(WORK, exist_ok=True); os.makedirs(STILLS, exist_ok=True)

FACES = f"""
@font-face{{font-family:'Plus Jakarta Sans';font-weight:100 900;src:url(file://{FONTS}/plus-jakarta-sans-latin-wght-normal.woff2) format('woff2')}}
@font-face{{font-family:'Inter';font-weight:100 900;src:url(file://{FONTS}/inter-latin-wght-normal.woff2) format('woff2')}}
@font-face{{font-family:'JetBrains Mono';font-weight:100 900;src:url(file://{FONTS}/jetbrains-mono-latin-wght-normal.woff2) format('woff2')}}
x-dc{{display:block}} html,body{{margin:0;background:#000}}
"""
if PROP_FONT and PROP_FONT_FILE:
    FACES += f"@font-face{{font-family:'{PROP_FONT}';font-weight:100 900;src:url(file://{os.path.abspath(PROP_FONT_FILE)}) format('woff2')}}\n"

AUDIT = r"""
<script>
window.addEventListener('load', () => setTimeout(() => {
  const root = document.querySelector('x-dc > div');
  const R = root.getBoundingClientRect();
  const out = { texts: [], viol: [], colors: {}, amber: [] };
  const ok = ['Plus Jakarta Sans', 'JetBrains Mono', 'Inter'];
  const PROP = '__PROP__', SHOP = __SHOP__;
  const film = Math.round(R.width) === 1920 && Math.round(R.height) === 1080;
  out.film = film;
  const end = !!root.closest('[data-endcard]') || !!document.querySelector('[data-endcard]');
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const n = w.currentNode, t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement, cs = getComputedStyle(el);
    let hidden = false; for (let e = el; e && e !== root.parentElement; e = e.parentElement) { const c = getComputedStyle(e); if (c.visibility === 'hidden' || c.display === 'none') hidden = true; }
    if (hidden) continue;
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const ui = !!el.closest('[data-ui]');
    const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect();
    const box = { x: Math.round(b.left - R.left), y: Math.round(b.top - R.top), r: Math.round(b.right - R.left), b: Math.round(b.bottom - R.top) };
    out.texts.push({ t: t.slice(0, 70), fam, ui, px: cs.fontSize, ...box });
    const logo = !!el.closest('[data-logo]');
    if (!ok.includes(fam) && !(PROP && fam === PROP && logo)) out.viol.push(`font ${fam}${fam === PROP ? ' outside a logo' : ''}: ${t}`);
    if (fam === 'Inter' && !ui) out.viol.push(`Inter outside product UI: ${t}`);
    if (!ui && /([a-z0-9-]+\.)+(com|net|co)\b|https?:\/\//.test(t) && fam !== 'JetBrains Mono') out.viol.push(`domain/URL not mono: ${t}`);
    if (film && box.b > 950) out.viol.push(`text below y=950 (b=${box.b}): ${t}`);
    if (film && (box.x < 120 || box.r > 1800)) out.viol.push(`text outside the 120px gutters (x ${box.x}-${box.r}): ${t}`);
    if (end && box.r > 960 && !el.closest('[data-allow-right]')) out.viol.push(`end card text in the right half: ${t}`);
  }
  if (__NOTILT__) root.querySelectorAll('*').forEach(el => {
    const t = getComputedStyle(el).transform;
    if (!t || t === 'none') return;
    if (t.startsWith('matrix3d')) { out.viol.push(`tilted (3D) element: ${el.tagName.toLowerCase()} ${(el.textContent || '').trim().slice(0, 30)}`); return; }
    const m = t.match(/matrix\(([^)]+)\)/); if (!m) return;
    const [a, b, c, d] = m[1].split(',').map(Number);
    if (Math.abs(b) > 1e-3 || Math.abs(c) > 1e-3) out.viol.push(`tilted element: ${el.tagName.toLowerCase()} ${(el.textContent || '').trim().slice(0, 30)}`);
  });
  const AMBER = 'rgb(229, 148, 38)';
  root.querySelectorAll('*').forEach(el => {
    if (el.closest('[data-logo]')) return;
    const cs = getComputedStyle(el);
    const props = ['backgroundColor', 'borderTopColor', 'borderLeftColor', 'outlineColor', 'fill', 'stroke'];
    if ([...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) props.push('color');
    for (const p of props) {
      const v = cs[p]; if (!v || v === 'none' || v === 'rgba(0, 0, 0, 0)') continue;
      if (p.startsWith('border') && parseFloat(cs[p.replace('Color', 'Width')]) === 0) continue;
      if (p === 'outlineColor' && cs.outlineStyle === 'none') continue;
      if ((p === 'fill' || p === 'stroke') && !(el instanceof SVGElement)) continue;
      out.colors[v] = (out.colors[v] || 0) + 1;
      if (SHOP.includes(v.replace(/rgba?\(([^)]+)\)/, (m, a) => 'rgb(' + a.split(',').slice(0, 3).map(s => s.trim()).join(', ') + ')')) && !el.closest('[data-shop],[data-logo]'))
        out.viol.push(`shop colour ${v} outside the shop world: ${el.tagName.toLowerCase()} ${(el.textContent || '').trim().slice(0, 30)}`);
      if (v.replace(/rgba?\(([^)]+)\)/, (m, a) => 'rgb(' + a.split(',').slice(0, 3).map(s => s.trim()).join(', ') + ')') === AMBER && !el.closest('[data-amber-part]'))
        { const k = `${el.tagName.toLowerCase()}: ${(el.textContent || '').trim().slice(0, 40)}`; if (!out.amber.includes(k)) out.amber.push(k); }
    }
    const bi = cs.backgroundImage; if (bi && bi !== 'none') (bi.match(/rgba?\([^)]+\)/g) || []).forEach(c => { out.colors[c] = (out.colors[c] || 0) + 1; if (SHOP.includes(c.replace(/rgba?\(([^)]+)\)/, (m, a) => 'rgb(' + a.split(',').slice(0, 3).map(s => s.trim()).join(', ') + ')')) && !el.closest('[data-shop],[data-logo]')) out.viol.push(`shop colour ${c} outside the shop world (gradient)`); });
    const sh = cs.boxShadow; if (sh && sh !== 'none') (sh.match(/rgba?\([^)]+\)/g) || []).forEach(c => { out.colors['shadow ' + c] = 1; if (/^rgba?\(229, 148, 38/.test(c) && !el.closest('[data-amber-part]')) { const k = `${el.tagName.toLowerCase()} shadow: ${(el.textContent || '').trim().slice(0, 40)}`; if (!out.amber.includes(k)) out.amber.push(k); } });
  });
  const pre = document.createElement('pre'); pre.id = 'audit'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
}, 300));
</script>
"""

HEX = """0B1426 1A2A55 20A795 E5484D E59426 1C6DB6 FFFFFF B9C6D8 6B7A90
E8F0F8 D1E9FF 181D27 101828 344054 475467 667085 98A2B3 D0D5DD EAECF0 F2F4F7 F9FAFB D92D20 FEF3F2 FECDCA B42318 ECFDF3 ABEFC6 067647
FBF7EF F4EFE6 FFF4D6 3B3A36 6B675F 8A8478 1E2A44 F97066 FDB022 32D583 000000
F2F7FC EEF8F6 7FB6E6 5FD1BE FFD9A3 1D81AB 1962A4 CC7D1F B26A12 1D7BAD
337CBD D5D7DA 414651 717680 8EB6DB F5F9FC FFFAEB FEDF89 B54708 7A2E0E 027A48 12B76A 535862 FCFCFD
FEF0C7 079455""".split()
ALLOWED = {tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) for h in HEX + SHOP_HEX}

def rgb_of(v):
    m = re.search(r'rgba?\(([^)]+)\)', v)
    if not m: return None
    p = [float(x) for x in m.group(1).replace('/', ',').split(',') if x.strip()]
    return tuple(int(round(x)) for x in p[:3]), (p[3] if len(p) > 3 else 1.0)

def page(src, bg_only=False):
    s = open(src).read()
    if bg_only:
        s = s.replace('<head>', '<head><style>x-dc > div > *:not([data-bg]){visibility:hidden !important}</style>', 1)
    s = s.replace('<script src="./support.js"></script>', '')
    s = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>', '', s)
    s = s.replace('<head>', '<head><style>' + FACES + '</style>', 1)
    shop = '[' + ', '.join("'rgb(%d, %d, %d)'" % tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) for h in SHOP_HEX) + ']'
    s = s.replace('</body>', AUDIT.replace('__PROP__', PROP_FONT).replace('__SHOP__', shop).replace('__NOTILT__', 'true' if NO_TILT else 'false') + '</body>')
    return s

def chrome(args, size=(1920, 1080)):
    return subprocess.run([HS, '--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files',
                           '--virtual-time-budget=5000', f'--window-size={size[0]},{size[1]}', *args], capture_output=True, text=True, timeout=120)

def board_size(src):
    m = re.search(r'"\$preview":\{"width":(\d+),"height":(\d+)\}', open(src).read())
    return (int(m.group(1)), int(m.group(2))) if m else (1920, 1080)

files = sorted(f for f in os.listdir(PROJ) if f.endswith('.dc.html') and f.startswith(PREFIX))
if NAMES: files = [f for f in files if any(n in f for n in NAMES)]
report = {}
for f in files:
    name = f[:-8]
    tp = os.path.join(WORK, f + '.html'); open(tp, 'w').write(page(os.path.join(PROJ, f)))
    png = os.path.join(STILLS, name + '.png')
    size = board_size(os.path.join(PROJ, f))
    chrome([f'--screenshot={png}', f'file://{tp}'], size)
    dom = chrome(['--dump-dom', f'file://{tp}'], size).stdout
    m = re.search(r'<pre id="audit">(.*?)</pre>', dom, re.S)
    a = json.loads(html.unescape(m.group(1))) if m else {'viol': ['AUDIT DID NOT RUN'], 'texts': [], 'colors': {}, 'amber': []}
    off = []
    for v in a['colors']:
        r = rgb_of(v)
        if r and r[0] not in ALLOWED and r[1] > 0.02: off.append(v)
    img = Image.open(png).convert('RGB')
    plain = 'data-solid-bg' in open(os.path.join(PROJ, f)).read()
    issues = []
    if not plain and a.get('film', True):
        bp = os.path.join(WORK, f + '.bg.html'); open(bp, 'w').write(page(os.path.join(PROJ, f), bg_only=True))
        chrome([f'--screenshot={WORK}/{name}.bg.png', f'file://{bp}'])
        BG = Image.open(f'{WORK}/{name}.bg.png').convert('RGB')
        diff = ImageChops.difference(img, BG).convert('L').point(lambda p: 255 if p > 28 else 0)
        low = diff.crop((0, 951, 1920, 1080)).getbbox()
        if low: issues.append(f'ink below y=950 at {(low[0], low[1] + 951, low[2], low[3] + 951)}')
        side = [diff.crop((0, 0, 110, 1080)).getbbox(), diff.crop((1810, 0, 1920, 1080)).getbbox()]
        if side[0]: issues.append(f'ink in the left gutter {side[0]}')
        if side[1]: issues.append(f'ink in the right gutter (x+1810) {side[1]}')
    report[name] = {'viol': a['viol'], 'pixels': issues, 'off_token_colours': off, 'amber': a['amber'],
                    'lines': [x for x in a['texts'] if not x['ui']]}
    flag = 'OK ' if not (a['viol'] or issues or off) and len(a['amber']) <= 1 else 'FIX'
    print(f"{flag} {name}: {len(a['viol'])} rule hits, {len(issues)} pixel hits, {len(off)} off-token colours, amber objects {len(a['amber'])}")
    for v in a['viol'] + issues: print('     -', v)
    for v in off: print('     - off-token colour', v)
    if len(a['amber']) > 1: print('     - amber:', a['amber'])
json.dump(report, open(os.path.join(WORK, 'report.json'), 'w'), indent=1)
