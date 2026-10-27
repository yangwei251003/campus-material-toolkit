# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import cv2
import numpy as np
ROOT = archive.source_dir('workflows/assets/edition_0627/prepare_double_sided_flyers.py', 0)
OUT = ROOT / 'field_0628_field_0051'
OUT.mkdir(exist_ok=True)
GEN = archive.input_path('input_0629')
QR1_SRC = archive.input_path('input_0630')
QR2_SRC = archive.input_path('input_0631')
FONT = archive.input_path('input_0632')
W, H = (4500, 6000)
S = W / 1088

def scaled_box(box):
    return tuple((round(v * S) for v in box))

def cover_text(im, box, text, bg, fg, size=34, align='center'):
    box = scaled_box(box)
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle(box, radius=20, fill=bg)
    font = ImageFont.truetype(str(FONT), round(size * S))
    draw.text(((box[0] + box[2]) // 2, (box[1] + box[3]) // 2), text, font=font, fill=fg, anchor='mm', align=align, stroke_width=1)

def qr_crop(path, box=None):
    data = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
    detector = cv2.QRCodeDetector()
    value, points, _ = detector.detectAndDecode(data)
    if not value or points is None:
        raise RuntimeError(f'field_0633: {path}')
    src = points[0].astype(np.float32)
    dst = np.array([[0, 0], [799, 0], [799, 799], [0, 799]], dtype=np.float32)
    warp = cv2.warpPerspective(data, cv2.getPerspectiveTransform(src, dst), (800, 800), borderValue=(255, 255, 255))
    warp = cv2.cvtColor(warp, cv2.COLOR_BGR2RGB)
    return ImageOps.expand(Image.fromarray(warp), border=80, fill='white')

def place_qr(im, qr, box):
    box = scaled_box(box)
    bw, bh = (box[2] - box[0], box[3] - box[1])
    side = min(bw, bh)
    tile = Image.new('RGB', (side, side), 'white')
    fitted = ImageOps.contain(qr, (side - 24, side - 24), Image.Resampling.NEAREST)
    tile.paste(fitted, ((side - fitted.width) // 2, (side - fitted.height) // 2))
    im.paste(tile, (box[0] + (bw - side) // 2, box[1] + (bh - side) // 2))
qr1 = qr_crop(QR1_SRC)
qr2 = qr_crop(QR2_SRC)
configs = {'A': {'front': ROOT / 'A_field_0634_60x80cm_4500x6000.png', 'back': GEN / 'exec-a7ca24e3-8913-4e83-8978-eedcd38eac04.png', 'front_patch': ((625, 1370, 813, 1425), '#075538', '#fff4c4'), 'back_patch': ((235, 1300, 397, 1365), '#07583b', '#fff4c4'), 'q1': (398, 1257, 520, 1382), 'q2': (552, 1242, 707, 1397)}, 'B': {'front': ROOT / 'B_field_0635_60x80cm_4500x6000.png', 'back': GEN / 'exec-8358fa31-f239-44a7-9097-b14183d411ef.png', 'front_patch': ((625, 1360, 817, 1418), '#075538', '#fff4c4'), 'back_patch': ((45, 1252, 282, 1328), '#075538', '#fff4c4'), 'q1': (288, 1231, 431, 1375), 'q2': (458, 1231, 599, 1375)}, 'C': {'front': ROOT / 'C_field_0636_60x80cm_4500x6000.png', 'back': GEN / 'exec-acfdf402-da5a-47c1-b629-fc6cd2139a9e.png', 'front_patch': ((645, 1356, 837, 1418), '#064b36', '#fff4c4'), 'back_patch': ((392, 1270, 592, 1343), '#064b36', '#fff4c4'), 'q1': (589, 1211, 727, 1349), 'q2': (780, 1210, 921, 1351)}}
for key, cfg in configs.items():
    front = Image.open(cfg['front']).convert('RGB')
    cover_text(front, cfg['front_patch'][0], 'field_0102', cfg['front_patch'][1], cfg['front_patch'][2], size=25)
    front_path = OUT / f'{key}_field_0637_field_0638_4500x6000.png'
    front.save(front_path, dpi=(190.5, 190.5))
    back = Image.open(cfg['back']).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    cover_text(back, cfg['back_patch'][0], 'field_0102', cfg['back_patch'][1], cfg['back_patch'][2], size=24)
    place_qr(back, qr1, cfg['q1'])
    place_qr(back, qr2, cfg['q2'])
    back_path = OUT / f'{key}_field_0637_field_0639_4500x6000_field_0640.png'
    back.save(back_path, dpi=(190.5, 190.5))
    pdf_path = OUT / f'{key}_field_0637_field_0641_600x800mm.pdf'
    front.save(pdf_path, 'PDF', resolution=190.5, save_all=True, append_images=[back])
    for label, box, expected in (('field_0102', cfg['q1'], 'https://example.invalid/reference'), ('field_0103', cfg['q2'], 'https://example.invalid/reference')):
        x1, y1, x2, y2 = scaled_box(box)
        crop = cv2.imdecode(np.fromfile(back_path, dtype=np.uint8), cv2.IMREAD_COLOR)[y1:y2, x1:x2]
        decoded = cv2.QRCodeDetector().detectAndDecode(crop)[0]
        print(key, label, 'QR_OK' if decoded == expected else f'QR_FAIL:{decoded}')
