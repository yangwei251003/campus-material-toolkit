# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import pymupdf as f
import shutil, json, hashlib
O = archive.source_dir('workflows/assets/edition_0647/build_brochure.py', 0)
B = O.parent.parent.parent
AS = O / 'field_0648'
AS.mkdir(exist_ok=True)
wx = archive.input_path('input_0649')
assets = {'single': archive.input_path('input_0650'), 'class': archive.input_path('input_0651'), 'logo': wx / '3bdb5ee1d16b365795499974ca89c3b7.jpg', 'qr1': wx / 'e46984f3dc2e93c862627ffec5d055f0.jpg', 'qr2': wx / 'f6f0851f1e2a327a356cb94b18d3c201.jpg', 'cert': O.parent.parent / 'image1.png'}
manifest = {}
for k, v in assets.items():
    dest = AS / (k + v.suffix)
    shutil.copy2(v, dest)
    manifest[k] = {'source': str(v), 'sha256': hashlib.sha256(v.read_bytes()).hexdigest()}
    assets[k] = dest
(O / 'field_0652.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

def rgb(h):
    return tuple((int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)))
G = rgb('063B2C')
W = rgb('F4F3EA')
L = rgb('D8F26A')
M = rgb('526C61')
P = rgb('E5E9DF')
WHITE = (1, 1, 1)
doc = f.open()
overflows = []

def rect(p, x, y, w, h, c):
    p.draw_rect(f.Rect(x, y, x + w, y + h), color=None, fill=c)

def text(p, s, x, y, size=26, bold=False, color=G, w=604, h=None, align=0):
    if h is None:
        h = (s.count('\n') + 1) * size * 1.6 + 5
    r = p.insert_textbox(f.Rect(x, y, x + w, y + h), s, fontname='b' if bold else 'r', fontsize=size, color=color, lineheight=1.35, align=align)
    if r < 0:
        overflows.append((len(doc), s, r))

def line(p, y, color=M):
    p.draw_line((48, y), (652, y), color=color, width=0.7)

def photo(p, key, x, y, w, h):
    p.insert_image(f.Rect(x, y, x + w, y + h), filename=str(assets[key]), keep_proportion=True)

def clipped_original(p, key, clip, x, y, w, h):
    im = f.open(assets[key])
    pd = f.open('pdf', im.convert_to_pdf())
    sr = pd[0].rect
    cw, ch = (clip[2] - clip[0], clip[3] - clip[1])
    pix = f.Pixmap(str(assets[key]))
    sx, sy = (sr.width / pix.width, sr.height / pix.height)
    cr = f.Rect(clip[0] * sx, clip[1] * sy, clip[2] * sx, clip[3] * sy)
    p.show_pdf_page(f.Rect(x, y, x + w, y + h), pd, 0, clip=cr, keep_proportion=True)

def page(n, dark=False):
    p = doc.new_page(width=700, height=1425)
    p.insert_font(fontname='r', fontfile=str(archive.input_path('input_0653')))
    p.insert_font(fontname='b', fontfile=str(archive.input_path('input_0637')))
    rect(p, 0, 0, 700, 1425, G if dark else W)
    text(p, 'SYNTHETIC FPV CLUB', 48, 35, 17, color=W if dark else G)
    text(p, f'{n:02}', 589, 26, 35, True, W if dark else G, w=63)
    rect(p, 48, 1367, 45, 5, L)
    text(p, 'field_0654', 110, 1354, 15, color=W if dark else M)
    return p

def heading(p, k, s):
    text(p, k, 48, 102, 54, True)
    text(p, s, 48, 187, 43, True)
    rect(p, 48, 325, 76, 7, L)
p = page(1, True)
photo(p, 'logo', 48, 88, 405, 162)
text(p, 'field_0600', 48, 286, 100, True, W)
text(p, 'field_0655', 48, 430, 75, True, W)
rect(p, 48, 559, 604, 57, L)
text(p, 'field_0656 · field_0657', 64, 568, 31, True)
text(p, 'field_0658，field_0659', 48, 656, 40, True, W)
photo(p, 'single', 0, 747, 700, 390.25)
rect(p, 48, 1174, 5, 91, L)
text(p, 'field_0660 / field_0661 / field_0662 / field_0663', 73, 1166, 31, True, W)
text(p, 'field_0422（field_0423）\nfield_0424', 73, 1227, 24, False, W)
p = page(2)
heading(p, 'field_0664', 'field_0665\nfield_0666')
text(p, 'field_0667，field_0668。', 48, 355, 25)
photo(p, 'single', 0, 418, 700, 390.25)
for i, (t, s) in enumerate([('field_0669', 'field_0670、field_0671、field_0672。'), ('field_0673', 'field_0674、field_0675。'), ('field_0676', 'field_0677，field_0678。')]):
    y = 845 + i * 119
    text(p, f'0{i + 1}', 48, y, 47, True, w=95)
    text(p, t, 158, y + 1, 29, True, w=500)
    text(p, s, 158, y + 48, 22, w=500)
rect(p, 48, 1213, 604, 90, L)
text(p, 'field_0679 + field_0680', 68, 1229, 30, True)
p = page(3)
heading(p, 'field_0681', 'field_0109\nfield_0682')
photo(p, 'cert', 48, 371, 225, 168)
text(p, 'field_0683', 301, 382, 29, True, w=350)
text(p, 'field_0684：\nfield_0685\nfield_0686', 301, 434, 22, w=350)
text(p, 'field_0687', 48, 553, 16, color=M)
for y, title, num, body in [(605, 'field_0688 · field_0689', '80', 'field_0690、field_0691、\nfield_0692、field_0693。'), (813, 'field_0694 · field_0695', '96', 'field_0696、field_0697、\nfield_0698、field_0699。')]:
    rect(p, 48, y, 604, 185, P)
    text(p, title, 68, y + 16, 27, True)
    text(p, num, 67, y + 61, 64, True, w=150)
    text(p, 'field_0163', 197, y + 102, 22, w=60)
    text(p, body, 299, y + 79, 23, w=330)
text(p, 'field_0700 · field_0701', 48, 1036, 28, True)
text(p, 'field_0702。', 48, 1085, 23)
line(p, 1150)
text(p, 'field_0703 ≠ SYNTHETICfield_0704', 48, 1175, 28, True)
text(p, 'field_0705。\nfield_0706。', 48, 1233, 19, color=M)
p = page(4)
heading(p, 'field_0707', 'field_0708\nfield_0709')
photo(p, 'class', 0, 368, 700, 397.25)
rect(p, 0, 792, 700, 65, L)
text(p, 'field_0710 → field_0711 → field_0712 → field_0713 → field_0714 → field_0715 → field_0716', 36, 807, 30, True, w=650)
for i, (t, s) in enumerate([('field_0717', 'field_0718 · field_0719 · field_0720'), ('field_0721', 'field_0722 · field_0697 · field_0723'), ('field_0724', 'field_0725 · field_0698 · field_0726'), ('field_0727', 'field_0728 · field_0729 · field_0730')]):
    y = 889 + i * 83
    text(p, t, 48, y, 26, True)
    text(p, s, 220, y + 3, 22, w=440)
    line(p, y + 61, P)
rect(p, 48, 1235, 604, 92, G)
text(p, 'field_0731 + field_0732', 65, 1247, 25, True, W)
text(p, 'field_0733，field_0734。', 65, 1289, 19, color=W)
p = page(5)
heading(p, 'field_0735', 'field_0736\nfield_0737')
photo(p, 'class', 48, 371, 604, 343)
for i, (t, s) in enumerate([('field_0738', 'field_0691 · field_0739 · field_0740'), ('field_0741', 'field_0742 · field_0743 · field_0744'), ('field_0745', 'field_0746 · field_0747 · field_0748'), ('field_0749', 'field_0750 · field_0751 · field_0752')]):
    y = 757 + i * 94
    text(p, f'0{i + 1}', 48, y, 29, True, w=70)
    text(p, t, 128, y, 27, True, w=450)
    text(p, s, 128, y + 43, 22, w=525)
rect(p, 48, 1161, 604, 53, L)
text(p, 'field_0753 / field_0122 / field_0754 / field_0755', 63, 1174, 24, True)
text(p, 'field_0756  ·  field_0757“field_0758 + field_0716”field_0759\nfield_0760', 48, 1243, 22)
text(p, 'field_0761。', 48, 1313, 17, color=M)
p = page(6, True)
text(p, 'field_0762', 48, 104, 62, True, W)
text(p, 'field_0763\nfield_0764', 48, 200, 43, True, W)
line(p, 363, L)
text(p, 'field_0688  80field_0163', 48, 387, 26, True, W, w=290)
text(p, 'field_0694  96field_0163', 365, 387, 26, True, W, w=290)
text(p, '8800', 48, 440, 66, True, L, w=290)
text(p, '12800', 365, 440, 66, True, L, w=290)
text(p, 'field_0351 / field_0101', 48, 533, 22, color=W)
text(p, 'field_0351 / field_0101', 365, 533, 22, color=W, w=270)
line(p, 585, L)
text(p, 'SYNTHETIC FINANCIAL FIELD: field_0765', 48, 609, 29, True, W)
text(p, 'field_0766、field_0767、field_0768、\nfield_0769、field_0770。\nfield_0771。\nfield_0772：field_0205240field_0351 / field_0773460field_0351。', 48, 661, 24, color=W)
text(p, 'field_0774 → field_0775 → field_0776 → field_0777', 48, 827, 23, True, L)
text(p, 'field_0778、field_0779、field_0780。\nfield_0389、field_0781。', 48, 877, 21, color=W)
clipped_original(p, 'qr1', (142, 464, 952, 1274), 61, 970, 218, 218)
clipped_original(p, 'qr2', (105, 348, 722, 965), 421, 970, 218, 218)
text(p, 'field_0104', 40, 1210, 27, True, W, w=300, align=1)
text(p, 'field_0105', 360, 1210, 27, True, W, w=300, align=1)
text(p, 'SYNTHETIC_PHONE', 40, 1259, 29, True, L, w=300, align=1)
text(p, 'SYNTHETIC_PHONE', 360, 1259, 29, True, L, w=300, align=1)
text(p, 'SYNTHETIC FINANCIAL FIELD: field_0782', 48, 1317, 17, color=W)
if overflows:
    raise RuntimeError(overflows)
final = f.open()
for i in range(6):
    p = final.new_page(width=140 / 25.4 * 72, height=285 / 25.4 * 72)
    p.show_pdf_page(p.rect, doc, i)
final.subset_fonts()
final.save(O / 'field_0783-field_0784.pdf', garbage=4, deflate=True)
names = ['field_0261', 'field_0664', 'field_0681', 'field_0707', 'field_0735', 'field_0762']
for i, p in enumerate(final):
    p.get_pixmap(matrix=f.Matrix(2.5, 2.5)).save(O / f'{i + 1:02d}-{names[i]}.png')
overview = f.open()
pg = overview.new_page(width=1260, height=1735)
rect(pg, 0, 0, 1260, 1735, rgb('DDE1D8'))
for i in range(6):
    x = 15 + i % 3 * 415
    y = 15 + i // 3 * 857
    pg.show_pdf_page(f.Rect(x, y, x + 400, y + 814.286), final, i)
overview.save(O / 'field_0019-field_0784.pdf', deflate=True)
overview[0].get_pixmap(matrix=f.Matrix(1.4, 1.4)).save(O / '00-field_0019-field_0784.png')
alltext = '\n'.join((p.get_text() for p in final))
assert 'SYNTHETIC_PHONE' in alltext and 'SYNTHETIC_PHONE' in alltext
assert 'SYNTHETIC_PHONE' not in alltext and 'field_0785' not in alltext
assert len(final) == 6
(O / 'field_0786.txt').write_text('field_0787；field_0788；field_0789，field_0790。\nfield_0791、field_0792、field_0793PDF，field_0794。\nfield_0795，field_0796；field_0797。\n', encoding='utf-8')
print('DONE', str(O))
