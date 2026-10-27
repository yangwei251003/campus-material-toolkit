# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import pymupdf as fitz
from PIL import Image
import io, json, shutil, zipfile
import zxingcpp
root = archive.source_dir('workflows/assets/assemble_green_original.py', 0) / 'field_0001_field_0002'
manifest = json.loads((root / 'field_0003.json').read_text(encoding='utf-8'))
W = 140 * 72 / 25.4
H = 285 * 72 / 25.4
raw = root / 'imagegenfield_0004'
raw.mkdir(exist_ok=True)
single = root / 'field_0005'
single.mkdir(exist_ok=True)
doc = fitz.open()
for i, it in enumerate(manifest):
    src = Path(it['file'])
    dest = raw / f'{i + 1:02d}_{it['name']}.png'
    shutil.copy2(src, dest)
    p = doc.new_page(width=W, height=H)
    p.insert_image(p.rect, filename=str(dest), keep_proportion=False)
    if i == 5:
        tmp = archive.input_path('input_0006')
        for fn, crop, x in [('codex-clipboard-6e0643d2-0a43-4acb-ac6c-cfffac912c90.jpg', (145, 466, 950, 1271), 0.186), ('codex-clipboard-29718f75-4ca8-420e-a78e-d45cbd486b92.jpg', (108, 352, 716, 960), 0.566)]:
            im = Image.open(tmp / fn).crop(crop)
            buffer = io.BytesIO()
            im.save(buffer, format='PNG')
            side = 0.245 * W
            y = 0.6 * H
            p.insert_image(fitz.Rect(x * W, y, x * W + side, y + side), stream=buffer.getvalue())
    if i < 5:
        shutil.copy2(dest, single / f'{i + 1:02d}_{it['name']}.png')
    else:
        p.get_pixmap(matrix=fitz.Matrix(Image.open(src).width / W, Image.open(src).width / W), alpha=False).save(single / f'{i + 1:02d}_{it['name']}.png')
doc.set_metadata({'title': 'field_0007·field_0001·field_0002', 'author': 'field_0008', 'subject': 'field_0009，imagegenfield_0010，field_0011'})
doc.save(root / 'field_0012_field_0013.pdf')
spread = fitz.open()
for si, order in enumerate([[1, 5, 0], [2, 3, 4]]):
    p = spread.new_page(width=W * 3, height=H)
    for col, idx in enumerate(order):
        p.show_pdf_page(fitz.Rect(col * W, 0, (col + 1) * W, H), doc, idx)
    p.get_pixmap(dpi=150).save(root / ('01_field_0014.png' if si == 0 else '02_field_0015.png'))
spread.save(root / 'field_0012_field_0016.pdf')
ov = fitz.open()
gap = 12
top = 38
p = ov.new_page(width=W * 3 + gap * 4, height=H * 2 + gap * 3 + top)
p.draw_rect(p.rect, color=None, fill=(0.89, 0.94, 0.89))
p.insert_font(fontname='CN', fontfile=str(archive.input_path('input_0017')))
p.insert_text((gap, 25), 'field_0001 · field_0002 · field_0018', fontname='CN', fontsize=16, color=(0.02, 0.25, 0.13))
for i in range(6):
    x = gap + i % 3 * (W + gap)
    y = top + gap + i // 3 * (H + gap)
    p.show_pdf_page(fitz.Rect(x, y, x + W, y + H), doc, i)
ov.save(root / '00_field_0019.pdf')
p.get_pixmap(dpi=110).save(root / '00_field_0019.png')
expected = {'https://example.invalid/reference', 'https://example.invalid/reference'}
decoded = {b.text for b in zxingcpp.read_barcodes(Image.open(single / '06_field_0020.png')) if b.valid}
assert decoded == expected, decoded
check = {'panels': 6, 'original_layout_preserved': True, 'original_outside_order': [2, 6, 1], 'original_inside_order': [3, 4, 5], 'two_original_QR_codes_decoded_and_matched': True, 'image_generation': 'field_0021imagegen，field_0022；field_0023PDFfield_0024', 'source_images': [Image.open(it['file']).size for it in manifest]}
(root / 'field_0025.json').write_text(json.dumps(check, ensure_ascii=False, indent=2), encoding='utf-8')
(root / 'field_0026.txt').write_text('field_0027。\nfield_0028；imagegenfield_0029。\nfield_0030PDF，field_0031。\nfield_0032PDFfield_0033P2/P6/P1、field_0034P3/P4/P5field_0035。field_0036P1field_0037P6field_0038。\nfield_0039；field_0040，field_0041CMYKfield_00423mmfield_0043。\nfield_0044、field_0045，field_0046。\n', encoding='utf-8')
with zipfile.ZipFile(root.parent / 'field_0047_field_0048_field_0049.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for file in root.rglob('*'):
        if file.is_file():
            z.write(file, file.relative_to(root))
print(json.dumps(check, ensure_ascii=False))
