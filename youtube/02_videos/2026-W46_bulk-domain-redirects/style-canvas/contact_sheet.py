#!/usr/bin/env python3
"""Gate 4: stills/w46-contact-sheet.png, every frame in film order (run build_frames.py and keyframes-check.py first)."""
import os, re
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
names = [n for n in re.findall(r"@F\('(w46-[A-Za-z]+)'", open(os.path.join(HERE, 'build_frames.py')).read()) if n not in ('w46-World', 'w46-System', 'w46-Sound')]
cols, W, H, pad, lab = 5, 576, 324, 16, 34
rows = (len(names) + cols - 1) // cols
im = Image.new('RGB', (cols * (W + pad) + pad, rows * (H + lab + pad) + pad), '#101828')
d = ImageDraw.Draw(im)
fp = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f = ImageFont.truetype(fp, 20) if os.path.exists(fp) else ImageFont.load_default()
for i, n in enumerate(names):
    x, y = pad + (i % cols) * (W + pad), pad + (i // cols) * (H + lab + pad)
    im.paste(Image.open(os.path.join(HERE, 'stills', n + '.png')).convert('RGB').resize((W, H), Image.LANCZOS), (x, y + lab))
    d.text((x, y + 6), f'{i + 1:02d}  {n[4:]}', fill='#B9C6D8', font=f)
im.save(os.path.join(HERE, 'stills', 'w46-contact-sheet.png'))
print(len(names), 'frames', im.size)
