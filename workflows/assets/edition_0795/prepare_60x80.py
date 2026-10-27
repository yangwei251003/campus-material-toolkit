# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import fitz
ROOT = archive.input_path('input_0796')
GEN = archive.input_path('input_0797')
OUT = ROOT / 'output' / 'field_0798_60x80_field_0051'
QR1 = ROOT / 'output' / 'field_0799' / 'field_0779' / 'field_0643' / 'qr1.jpg'
QR2 = ROOT / 'output' / 'field_0799' / 'field_0779' / 'field_0643' / 'qr2.jpg'
W, H = (4500, 6000)
PAGE_W = 600 * 72 / 25.4
PAGE_H = 800 * 72 / 25.4
variants = {'A_field_0565': {'poster': GEN / 'exec-4fa8757e-ff2f-48ec-a87a-326d5604b0ce.png', 'back': GEN / 'exec-bcb17d87-dc6e-4ab5-b16a-1d6af73f1ed3.png', 'qr_boxes': [(1838, 4914, 650), (3252, 4914, 650)]}, 'B_field_0800': {'poster': GEN / 'exec-320cd4f1-5f6d-4aee-887e-e93646001929.png', 'back': GEN / 'exec-ea795678-ae86-44f0-9521-9f307b60e656.png', 'qr_boxes': [(1289, 4985, 650), (2583, 4985, 650)]}, 'C_field_0801': {'poster': GEN / 'exec-17df6962-b481-4eda-aef4-ef32254dedc6.png', 'back': GEN / 'exec-a83333ca-e1a6-4520-9ae4-572d5658af31.png', 'qr_boxes': [(1379, 4883, 710), (2408, 4883, 710)]}}

def open_print(path: Path) -> Image.Image:
    im = Image.open(path).convert('RGB')
    return ImageOps.fit(im, (W, H), method=Image.Resampling.LANCZOS)

def qr_crop(path: Path, box) -> Image.Image:
    im = Image.open(path).convert('RGB')
    qr = im.crop(box)
    qr = ImageOps.expand(qr, border=22, fill='white')
    return qr
QR_LEFT = qr_crop(QR1, (170, 495, 935, 1260))
QR_RIGHT = qr_crop(QR2, (120, 280, 705, 865))

def save_pdf(paths, target: Path):
    doc = fitz.open()
    for image_path in paths:
        page = doc.new_page(width=PAGE_W, height=PAGE_H)
        page.insert_image(page.rect, filename=str(image_path), keep_proportion=False)
    doc.save(target, deflate=True, garbage=4)
    doc.close()
poster_previews = []
for name, spec in variants.items():
    folder = OUT / name
    folder.mkdir(parents=True, exist_ok=True)
    poster = open_print(spec['poster'])
    poster_path = folder / '01_field_0602_60x80cm_4500x6000.png'
    poster.save(poster_path, optimize=True)
    front_path = folder / '02_field_0802_field_0055.png'
    poster.save(front_path, optimize=True)
    back = open_print(spec['back'])
    for qr, (x, y, size) in zip((QR_LEFT, QR_RIGHT), spec['qr_boxes']):
        q = ImageOps.fit(qr, (size, size), method=Image.Resampling.LANCZOS)
        back.paste(q, (x, y))
    back_path = folder / '03_field_0803_field_0059.png'
    back.save(back_path, optimize=True)
    save_pdf([poster_path], folder / 'A_field_0602_600x800mm.pdf')
    save_pdf([front_path, back_path], folder / 'B_field_0804_600x800mm.pdf')
    thumb = poster.copy()
    thumb.thumbnail((750, 1000), Image.Resampling.LANCZOS)
    poster_previews.append((name, thumb, back.copy()))
canvas = Image.new('RGB', (2400, 2200), '#eae3d3')
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype(str(archive.input_path('input_0632')), 34)
for index, (name, poster, back) in enumerate(poster_previews):
    x = 50 + index * 790
    poster.thumbnail((720, 960), Image.Resampling.LANCZOS)
    back.thumbnail((720, 960), Image.Resampling.LANCZOS)
    canvas.paste(poster, (x, 70))
    canvas.paste(back, (x, 1120))
    draw.text((x, 24), name, fill='#004c39', font=font)
canvas.save(OUT / '00_field_0051_field_0805.jpg', quality=92)
print(OUT)
