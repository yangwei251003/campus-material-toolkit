# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import json, io, shutil, zipfile, hashlib
import pymupdf as fitz
from PIL import Image
import numpy as np
import cv2, zxingcpp
R = archive.source_dir('workflows/assets/assemble_posters.py', 0) / 'SYNTHETICfield_0050_field_0051'
items = json.loads((R / 'field_0052.json').read_text(encoding='utf-8'))
MM = 72 / 25.4
W = 210 * MM
H = 297 * MM
tmp = archive.input_path('input_0006')
qr_sources = [('codex-clipboard-6e0643d2-0a43-4acb-ac6c-cfffac912c90.jpg', (145, 466, 950, 1271)), ('codex-clipboard-29718f75-4ca8-420e-a78e-d45cbd486b92.jpg', (108, 352, 716, 960))]
expected = {'https://example.invalid/reference', 'https://example.invalid/reference'}

def slots(path):
    a = np.array(Image.open(path).convert('RGB'))
    h, w = a.shape[:2]
    mask = (np.min(a, axis=2) > 247).astype('uint8') * 255
    mask[:int(h * 0.68)] = 0
    n, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)
    found = []
    for x, y, bw, bh, area in stats[1:]:
        if 0.1 * w < bw < 0.32 * w and 0.75 < bw / bh < 1.3 and (area > 0.85 * bw * bh) and (y > 0.68 * h):
            found.append([int(x), int(y), int(bw), int(bh)])
    if len(found) != 2:
        raise ValueError((path, found))
    return (sorted(found, key=lambda z: z[0]), (w, h))

def overview(docs, path, title, cols=3):
    g = 16
    top = 44
    rows = (len(docs) + cols - 1) // cols
    d = fitz.open()
    p = d.new_page(width=cols * W + (cols + 1) * g, height=rows * H + (rows + 1) * g + top)
    p.draw_rect(p.rect, fill=(0.91, 0.94, 0.9), color=None)
    p.insert_font(fontname='CN', fontfile=str(archive.input_path('input_0017')))
    p.insert_text((g, 28), title, fontname='CN', fontsize=18, color=(0.02, 0.27, 0.15))
    for i, (doc, idx) in enumerate(docs):
        x = g + i % cols * (W + g)
        y = top + g + i // cols * (H + g)
        p.show_pdf_page(fitz.Rect(x, y, x + W, y + H), doc, idx)
    d.save(str(path) + '.pdf')
    p.get_pixmap(dpi=100).save(str(path) + '.png')
all_front = []
all_both = []
checks = []
keep = []
for it in items:
    folder = R / (it['id'] + '_' + it['name'])
    folder.mkdir(exist_ok=True)
    shutil.copy2(it['poster'], folder / 'SYNTHETIC FINANCIAL FIELD: field_0053')
    shutil.copy2(it['poster'], folder / '02_field_0054_field_0055.png')
    shutil.copy2(it['back'], folder / 'field_0056_field_0057.png')
    doc = fitz.open()
    front = doc.new_page(width=W, height=H)
    front.insert_image(front.rect, filename=it['poster'], keep_proportion=False)
    back = doc.new_page(width=W, height=H)
    back.insert_image(back.rect, filename=it['back'], keep_proportion=False)
    boxes, (iw, ih) = slots(it['back'])
    for (x, y, bw, bh), (fn, cr) in zip(boxes, qr_sources):
        qr = Image.open(tmp / fn).crop(cr)
        buf = io.BytesIO()
        qr.save(buf, format='PNG')
        side = min(bw, bh) * 0.97
        xx = x + (bw - side) / 2
        yy = y + (bh - side) / 2
        back.insert_image(fitz.Rect(xx / iw * W, yy / ih * H, (xx + side) / iw * W, (yy + side) / ih * H), stream=buf.getvalue())
    back.get_pixmap(matrix=fitz.Matrix(iw / W, ih / H), alpha=False).save(folder / '03_field_0058_field_0059.png')
    doc.set_metadata({'title': it['name'] + ' SYNTHETICfield_0060', 'subject': 'SYNTHETIC FINANCIAL FIELD: field_0061'})
    doc.save(folder / 'A4field_0062.pdf')
    poster = fitz.open()
    p = poster.new_page(width=297 * MM, height=420 * MM)
    p.show_pdf_page(p.rect, doc, 0)
    poster.save(folder / 'A3field_0063.pdf')
    overview([(doc, 0), (doc, 1)], folder / '00_field_0064', it['id'] + ' ' + it['name'] + ' / field_0065，field_0066', 2)
    decoded = {x.text for x in zxingcpp.read_barcodes(Image.open(folder / '03_field_0058_field_0059.png')) if x.valid}
    assert decoded == expected, (it['id'], decoded)
    assert (folder / 'SYNTHETIC FINANCIAL FIELD: field_0053').read_bytes() == (folder / '02_field_0054_field_0055.png').read_bytes()
    checks.append({'version': it['id'], 'name': it['name'], 'poster_equals_flyer_front_byte_for_byte': True, 'back_both_QR_verified': True, 'QR_slots_pixels': boxes, 'poster_pixels': Image.open(it['poster']).size, 'back_pixels': (iw, ih), 'no_prices_or_QR_on_posters': 'field_0067', 'both_contacts_company_and_logos': 'field_0067'})
    keep.append(doc)
    all_front.append((doc, 0))
    all_both.extend([(doc, 0), (doc, 1)])
overview(all_front, R / '00_field_0068', 'SYNTHETICfield_0069 / A field_0070 · B field_0071 · C field_0072', 3)
overview(all_both, R / '01_field_0073', 'field_0074 / field_0075：field_0076，field_0077', 2)
(R / 'field_0025.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2), encoding='utf-8')
with zipfile.ZipFile(R.parent / 'SYNTHETICfield_0050_field_0078.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for p in R.rglob('*'):
        if p.is_file():
            z.write(p, p.relative_to(R))
print(json.dumps(checks, ensure_ascii=False))
