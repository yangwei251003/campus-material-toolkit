# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import pymupdf as fitz
from PIL import Image, ImageDraw
import json
root = archive.workspace()
out = archive.workspace() / 'output/extracted'
out.mkdir(parents=True, exist_ok=True)
d = fitz.open(archive.workspace() / 'inputs/source.pdf')
items = []
seen = set()
for pi, p in enumerate(d):
    for im in p.get_images(full=True):
        xref = im[0]
        if xref in seen:
            continue
        seen.add(xref)
        data = d.extract_image(xref)
        if data['width'] < 70 or data['height'] < 50:
            continue
        f = out / f'p{pi + 1}_xref{xref}.{data['ext']}'
        f.write_bytes(data['image'])
        if im[1] and data['ext'] == 'png':
            base = fitz.Pixmap(d, xref)
            mask = fitz.Pixmap(d, im[1])
            combined = fitz.Pixmap(base, mask)
            combined.save(f)
        items.append({'file': str(f), 'xref': xref, 'page': pi + 1, 'width': data['width'], 'height': data['height']})
sheet = Image.new('RGB', (1000, 180 * ((len(items) + 4) // 5)), 'white')
draw = ImageDraw.Draw(sheet)
for i, it in enumerate(items):
    im = Image.open(it['file']).convert('RGB')
    im.thumbnail((184, 145))
    x = i % 5 * 200
    y = i // 5 * 180
    sheet.paste(im, (x + (200 - im.width) // 2, y))
    draw.text((x + 5, y + 148), f'xref{it['xref']} {it['width']}x{it['height']}', fill='black')
sheet.save(out / 'field_0574.jpg')
(out / 'field_0575.json').write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'count': len(items), 'index': str(out / 'field_0574.jpg')}, ensure_ascii=False))
