# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import sys, json, shutil, hashlib, html, csv, math, re
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import mm
from pypdf import PdfReader
import pypdfium2 as pdfium
sys.stdout.reconfigure(encoding='utf8')
ROOT = runtime.workspace()
OLD = ROOT / 'output/DemoCampussample-8fbc8444_V3/V3_sample-846f8c41_20261016'
WORK = ROOT / 'output/DemoCampussample-8fbc8444_V3.1_sample-4b8cbfdd_20261016'
ART = WORK / '01_sample-5bb56ece'
OUT = ROOT / 'output/DemoCampussample-8fbc8444_V3.1_sample-1938d82e_20261016'
DOC = OUT / '00_sample-7a40a511'
DOC.mkdir(parents=True, exist_ok=True)
idx = json.loads((OLD / '00_sample-7a40a511/sample-b9dc40d8.json').read_text(encoding='utf-8-sig'))
new = {p.name.split('_', 1)[0]: p for p in ART.glob('*.png')}
aliases = {'491': 'ST13', '492': 'ST21', '493': 'ST16', '494': 'ST01', '495': 'ST02'}
records = []

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def geometry(p):
    with Image.open(p) as im:
        w, h = im.size
        alpha = im.getchannel('A') if im.mode == 'RGBA' else None
        bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox() if alpha else (0, 0, w, h)
        return ((w, h), bbox, alpha)

def place(c, p, x, y, w, h, bbox=None):
    size, bbox0, _ = geometry(p)
    bbox = bbox or bbox0
    l, t, r, b = bbox
    bw, bh = (r - l, b - t)
    s = min(w / bw, h / bh)
    dw, dh = (bw * s, bh * s)
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    c.saveState()
    path = c.beginPath()
    path.rect(dx, dy, dw, dh)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(str(p), dx - l * s, dy - (size[1] - b) * s, width=size[0] * s, height=size[1] * s, mask='auto')
    c.restoreState()
    return (dx, dy, dw, dh)

def outline(p, dest, size_mm, bbox):
    with Image.open(p) as im:
        if im.mode != 'RGBA':
            return False
        a = np.array(im.getchannel('A'))
        mask = (a > 24).astype('uint8') * 255
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        if hierarchy is None:
            return False
        l, t, r, b = bbox
        bw, bh = (r - l, b - t)
        w, h = size_mm
        s = min(w / bw, h / bh)
        ox = (w - bw * s) / 2
        oy = (h - bh * s) / 2
        paths = []
        for k, cont in enumerate(contours):
            area = cv2.contourArea(cont)
            if area < max(100, bw * bh * 0.004):
                continue
            approx = cv2.approxPolyDP(cont, max(0.7, max(bw, bh) / 1600), True).reshape(-1, 2)
            pts = [f'{(x - l) * s + ox:.3f},{(y - t) * s + oy:.3f}' for x, y in approx]
            paths.append('M' + 'L'.join(pts) + 'Z')
        body = ''.join((f'<path d="{d}"/>' for d in paths))
        dest.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}mm" height="{h}mm" viewBox="0 0 {w} {h}"><title>sample-0910e4b9，sample-78b25ba1、sample-74deb962</title><g fill="none" stroke="#ff00ff" stroke-width="0.2">{body}</g></svg>', encoding='utf-8')
        return True
for item in idx:
    if item['id'].startswith('A3_'):
        continue
    item = dict(item)
    id = item['id']
    source = new.get(aliases.get(id, id))
    restored = source is not None
    if restored:
        if id not in aliases:
            item['name'] = source.stem.split('_', 1)[1]
        item['stem'] = id + '_' + item['name']
        item['relative'] = item['group'] + '/' + item['stem']
    dest = OUT / item['relative']
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not restored:
        original = OLD / item['relative']
        for p in original.parent.glob(original.name + '*'):
            if p.is_file() and (p.stem == original.name or p.stem.startswith(original.name + '_sample-e9f8face')):
                shutil.copy2(p, dest.parent / p.name)
        source = dest.with_suffix('.png')
    else:
        shutil.copy2(source, dest.with_suffix('.png'))
        source = dest.with_suffix('.png')
        size, bbox, alpha = geometry(source)
        w, h = item['size_mm']
        if id.startswith('ST') or id in aliases or id in ['20', '21', '22', '23', '24', '25'] or id.startswith('KT'):
            longest = 60 if id.startswith('ST') or id in aliases else 800 if item['size_mm'][0] == 800 else 500
            bw, bh = (bbox[2] - bbox[0], bbox[3] - bbox[1])
            z = longest / max(bw, bh)
            w, h = (round(bw * z, 2), round(bh * z, 2))
        item['size_mm'] = [w, h]
        scale = 10 if max(w, h) > 5000 else 1
        c = canvas.Canvas(str(dest.with_suffix('.pdf')), pagesize=(w * mm / scale, h * mm / scale), pageCompression=1)
        c.setTitle(item['stem'] + f' | V3.1 | scale 1:{scale}')
        c.setSubject('sample-a4681e0fPDF；sample-e3ddfb46，sample-f2c2c073；sample-28377fd0，sample-3353fbe4。')
        place(c, source, 0, 0, w * mm / scale, h * mm / scale, bbox)
        c.showPage()
        c.save()
        item['pdf_scale'] = '1:' + str(scale)
        item['bleed_mm'] = 0
        item['cut'] = outline(source, dest.parent / (dest.name + '_sample-2f788823.svg'), [w, h], bbox)
        item['text'] = [s.replace('sample-f5346a3f', 'sample-725b2f05') for s in item.get('text', []) if 'sample-1a9b170dDemoCampussample-71281ba4' not in s]
        if id in aliases:
            item['note'] = 'sample-b1b82537' + aliases[id] + 'sample-872126ed'
    size, bbox, alpha = geometry(source)
    w, h = item['size_mm']
    bw, bh = (bbox[2] - bbox[0], bbox[3] - bbox[1])
    item.update(pixels=list(size), alpha_bbox=list(bbox), transparent=alpha is not None, sha256=digest(source), restored=restored)
    item['effective_ppi'] = round(max(bw / (w / 25.4), bh / (h / 25.4)), 1)
    item['status'] = 'sample-fcd89de8' if item.get('pending') else 'sample-1af4ed3a；sample-429b55fe' if restored else 'sample-e2784c94'
    records.append(item)
    print('assembled', id, flush=True)
for sheet in range(3):
    id = f'A3_{sheet + 1:02d}'
    item = dict(next((x for x in idx if x['id'] == id)))
    dest = OUT / item['relative']
    dest.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(dest.with_suffix('.pdf')), pagesize=(297 * mm, 420 * mm), pageCompression=1)
    c.setTitle(f'V3.1 A3 sticker sheet {sheet + 1} | 1:1')
    for n in range(16):
        sid = f'ST{sheet * 16 + n + 1:02d}'
        rec = next((x for x in records if x['id'] == sid))
        p = OUT / (rec['relative'] + '.png')
        col, row = (n % 4, n // 4)
        x = (16.5 + col * 68) * mm
        y = (72 + (3 - row) * 72) * mm
        place(c, p, x, y, 60 * mm, 60 * mm)
    c.showPage()
    c.save()
    pdf = pdfium.PdfDocument(str(dest.with_suffix('.pdf')))
    page = pdf[0]
    bitmap = page.render(scale=2)
    bitmap.to_pil().save(dest.with_suffix('.png'))
    page.close()
    pdf.close()
    size, bbox, alpha = geometry(dest.with_suffix('.png'))
    item.update(pixels=list(size), alpha_bbox=list(bbox), transparent=False, sha256=digest(dest.with_suffix('.png')), restored=True, status='sample-9635a257A3sample-382b20ac；sample-f780812e', cut=False, bleed_mm=0, effective_ppi=144, pdf_scale='1:1')
    records.append(item)
brand = OUT / '09_sample-9b962eac'
brand.mkdir(exist_ok=True)
src = ROOT / 'output/DemoCampussample-8fbc8444_V3/00_sample-8224c4e8'
for name in ['DemoCampus_logo.png', 'DemoClub_logo.png', 'DemoClubsample-3e410307_logosample-e1f38925.png', 'DemoBrand_logo.jpg', 'sample-ee2f8b0a_sample-6bed5124.png', 'sample-ee2f8b0a_sample-e5910c7645sample-e24a9725.jpg']:
    shutil.copy2(src / name, brand / name)
thumbdir = DOC / 'sample-96c6437c'
thumbdir.mkdir(exist_ok=True)
font = ImageFont.load_default(size=18)
for rec in records:
    p = OUT / (rec['relative'] + '.png')
    with Image.open(p) as im:
        im.thumbnail((520, 390))
        bg = Image.new('RGB', (520, 390), '#e8edf1')
        bg.paste(im, ((520 - im.width) // 2, (390 - im.height) // 2), im if im.mode == 'RGBA' else None)
        bg.save(thumbdir / (rec['id'] + '.jpg'), quality=87)
newrecs = [r for r in records if r['restored'] and (not r['id'].startswith('A3_')) and (r['id'] not in aliases)]
for s in range(math.ceil(len(newrecs) / 12)):
    chunk = newrecs[s * 12:s * 12 + 12]
    contact = Image.new('RGB', (1560, 1320), 'white')
    d = ImageDraw.Draw(contact)
    for j, rec in enumerate(chunk):
        x, y = (j % 3 * 520, j // 3 * 330)
        im = Image.open(thumbdir / (rec['id'] + '.jpg'))
        im.thumbnail((510, 290))
        contact.paste(im, (x + (520 - im.width) // 2, y))
        d.text((x + 12, y + 292), rec['id'] + ' ' + rec['name'][:22], font=font, fill='#102d3b')
    contact.save(DOC / f'sample-c5a85d21_{s + 1:02d}.jpg', quality=90)
groups = list(dict.fromkeys((r['group'] for r in records)))
cards = []
for rec in records:
    rel = html.escape(rec['relative'], quote=True)
    title = html.escape(rec['id'] + ' ' + rec['name'])
    g = html.escape(rec['group'], quote=True)
    cards.append(f'<article data-group="{g}" data-new="{int(rec['restored'])}"><a href="{rel}.png"><img loading="lazy" src="00_sample-7a40a511/sample-96c6437c/{rec['id']}.jpg" alt="{title}"></a><h3>{title}</h3><p>{rec['size_mm'][0]} × {rec['size_mm'][1]} mm · {rec['pixels'][0]} × {rec['pixels'][1]} px</p><small>{rec['status']}</small><nav><a href="{rel}.png">sample-4b1db520 PNG</a><a href="{rel}.pdf">PDF</a></nav></article>')
buttons = '<button onclick="filter(\'all\')">All151sample-49ccde43</button><button onclick="filter(\'new\')">sample-3b67cc04</button>' + ''.join((f"""<button onclick="filter('{html.escape(g)}')">{html.escape(g[3:])}</button>""" for g in groups))
page = '<!DOCTYPE html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic material preview</title><style>body{margin:0;background:#f0f4f6;color:#092b3b;font:15px/1.6 system-ui,"Microsoft YaHei",sans-serif}header{background:#062d3d;color:white;padding:38px 5vw}h1{margin:0;font-size:32px}header p{max-width:1000px;color:#d2e2e9}header a{color:#f6e67a}.filters{position:sticky;top:0;background:#fff;padding:12px 4vw;z-index:2;display:flex;gap:8px;flex-wrap:wrap}button{border:1px solid #d2dfe3;background:#fff;border-radius:18px;padding:7px 13px;cursor:pointer}button:hover,button.active{background:#00a779;color:white}.grid{padding:24px 4vw;display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px}article{background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px #062d3d12}article img{width:100%;aspect-ratio:4/3;object-fit:contain;background:#e8edf1}h3,article p,small,nav{display:block;margin:10px 16px}h3{font-size:17px}article p,small{font-size:12px;color:#607985}nav{display:flex;gap:18px;padding-bottom:10px}nav a{color:#008b63}article[hidden]{display:none}</style><header><h1>Synthetic material toolkit preview</h1><p>Independent synthetic fixtures. No original logo, photograph, QR, personal or business copy is included.</p><p>sample-0d02eb00。sample-b2300368、sample-0effe0d0、KTsample-509fc80d；sample-cd29ac97PDFsample-b064a9f7。1:10sample-fced2ed0PDFsample-fa7944d2、sample-30444436。sample-b472008fLogosample-6dedc6fb。</p><a href="00_sample-7a40a511/sample-7a40a511.md">sample-7a40a511</a> · <a href="00_sample-7a40a511/sample-a4f2d713.csv">sample-e4c4f13c</a></header><div class="filters">BUTTONS</div><main class="grid">CARDS</main><script>function filter(x){document.querySelectorAll(\'article\').forEach(e=>e.hidden=!(x===\'all\'||x===\'new\'&&e.dataset.new===\'1\'||e.dataset.group===x));document.querySelectorAll(\'button\').forEach(e=>e.classList.toggle(\'active\',e.getAttribute(\'onclick\')===`filter(\'${x}\')`))}filter(\'new\')</script></html>'.replace('BUTTONS', buttons).replace('CARDS', ''.join(cards))
(OUT / '00_V3.1sample-2fe87309.html').write_text(page, encoding='utf-8')
(DOC / 'sample-b9dc40d8.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
with (DOC / 'sample-a4f2d713.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['sample-fc147721', 'sample-d44e9b3d', 'sample-8dd966admm', 'sample-b1c27820mm', 'sample-289dad1b', 'sample-09388805', 'sample-11afd2a5PPIsample-c6f305e9', 'PDFsample-82a59f3d', 'sample-0ef2b8f6', 'sample-daede988'])
    for r in records:
        writer.writerow([r['id'], r['name'], *r['size_mm'], *r['pixels'], r['effective_ppi'], r.get('pdf_scale', 'sample-109c3c1fV3sample-9fe641aa'), r['restored'], r['status']])
fail = []
for r in records:
    p = OUT / (r['relative'] + '.png')
    pdf = OUT / (r['relative'] + '.pdf')
    try:
        with Image.open(p) as im:
            im.verify()
        reader = PdfReader(pdf)
        assert len(reader.pages) == 1
    except Exception as e:
        fail.append({'id': r['id'], 'error': str(e)})
audit = {'items': len(records), 'updated_items': sum((r['restored'] for r in records)), 'unique_new_art': len(newrecs), 'new_source_images': len(new), 'stickers': sum((r['id'].startswith('ST') for r in records)), 'open_failures': fail, 'source_sha256_checked': True, 'physical_print_verified': False, 'press_bleed_for_new_images': False, 'logo_pixel_exactness_verified': False}
(DOC / 'sample-e7399391.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(audit, ensure_ascii=False), flush=True)
