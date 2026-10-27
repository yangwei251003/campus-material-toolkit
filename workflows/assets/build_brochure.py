# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import sys, shutil, json, math, zipfile
from PIL import Image
sys.path.insert(0, str(archive.input_path('input_0079')))
from setup_chinese_pdf import setup_chinese_pdf
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color, white
import pymupdf as fitz
REG, styles = setup_chinese_pdf()
pdfmetrics.registerFont(TTFont('CNBold', str(archive.input_path('input_0080')), subfontIndex=0))
BOLD = 'CNBold'
ROOT = archive.source_dir('workflows/assets/build_brochure.py', 0)
OUT = ROOT / 'field_0081'
OUT.mkdir(exist_ok=True)
ASSET = ROOT / 'field_0082'
ASSET.mkdir(exist_ok=True)
TMP = archive.input_path('input_0006')
school = TMP / 'codex-clipboard-555f71d2-deb7-43c3-a215-8e52a09f6984.png'
club = TMP / 'codex-clipboard-d28394cc-49d0-4491-858f-211be7832cc9.jpg'
qa = TMP / 'codex-clipboard-6e0643d2-0a43-4acb-ac6c-cfffac912c90.jpg'
qb = TMP / 'codex-clipboard-29718f75-4ca8-420e-a78e-d45cbd486b92.jpg'
for f in [school, club, qa, qb]:
    shutil.copy2(f, ASSET / f.name)
gen = archive.input_path('input_0083')
overview = gen / 'exec-147dcf7f-7844-4ea6-98b3-c5cbc5ca638e.png'
hero = gen / 'exec-83372061-e811-4ab2-b1f4-e2e02dbb1cc0.png'
shutil.copy2(overview, ASSET / 'SYNTHETIC FINANCIAL FIELD: field_0084')
shutil.copy2(hero, ASSET / 'field_0085.png')
MM = 72 / 25.4
W, H = (140 * MM, 285 * MM)
G = '#064737'
INK = '#14362C'
MUT = '#50655D'
BG = '#F6F5EE'
LINE = '#D9E1D8'
ORANGE = '#C27419'
LIGHT = '#E6EDE4'
M = 23

def color(v):
    return HexColor(v)
c = canvas.Canvas(str(OUT / 'field_0047_SYNTHETICfield_0086_field_0013.pdf'), pagesize=(W, H))
c.setTitle('field_0047 SYNTHETICfield_0087')
c.setAuthor('field_0088')
alltext = []

def rect(x, y, w, h, fill, stroke=None, r=0):
    c.setFillColor(color(fill))
    c.setStrokeColor(color(stroke or fill))
    if r:
        c.roundRect(x, H - y - h, w, h, r, fill=1, stroke=int(bool(stroke)))
    else:
        c.rect(x, H - y - h, w, h, fill=1, stroke=int(bool(stroke)))

def text(s, x, y, size=10, fill=INK, bold=False):
    c.setFillColor(color(fill))
    c.setFont(BOLD if bold else REG, size)
    c.drawString(x, H - y - size, s)
    alltext.append(s)

def wrap(s, width, size, font):
    result = []
    for raw in s.split('\n'):
        line = ''
        for ch in raw:
            if pdfmetrics.stringWidth(line + ch, font, size) > width and line:
                result.append(line)
                line = ch
            else:
                line += ch
        result.append(line)
    return result

def para(s, x, y, width, size=10, fill=MUT, bold=False, leading=None):
    leading = leading or size * 1.55
    for line in wrap(s, width, size, BOLD if bold else REG):
        text(line, x, y, size, fill, bold)
        y += leading
    return y

def line(y, x=M, w=None, fill=LINE):
    c.setStrokeColor(color(fill))
    c.setLineWidth(0.65)
    c.line(x, H - y, x + (w or W - 2 * M), H - y)

def pic(path, crop, x, y, w, h):
    iw, ih = Image.open(path).size
    a, b, d, e = crop
    sx = w / (d - a)
    sy = h / (e - b)
    c.saveState()
    p = c.beginPath()
    p.rect(x, H - y - h, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(str(path), x - a * sx, H - y - (ih - b) * sy, iw * sx, ih * sy, mask='auto')
    c.restoreState()

def coverpic(path, x, y, w, h):
    iw, ih = Image.open(path).size
    sc = max(w / iw, h / ih)
    cw = w / sc
    ch = h / sc
    pic(path, ((iw - cw) / 2, (ih - ch) / 2, (iw + cw) / 2, (ih + ch) / 2), x, y, w, h)

def logos(y=22, large=False):
    if large:
        pic(school, (90, 160, 2100, 550), M, y, W - 2 * M, 68)
        pic(club, (114, 110, 837, 264), M, y + 83, 205, 43.7)
    else:
        pic(school, (90, 160, 2100, 550), M, y, 211, 41)
        pic(club, (114, 110, 837, 264), W - 135, y + 8, 112, 24)

def base(n, section):
    rect(0, 0, W, H, BG)
    text('SYNTHETIC  /  FLIGHT TRAINING', M, 20, 8, G, True)
    text(f'{n:02d}  /  {section}', W - 123, 20, 8, MUT)
    line(43)

def footer(n, dark=False):
    bg = G if dark else BG
    rect(0, H - 50, W, 50, bg)
    line(H - 48, fill='#658778' if dark else LINE)
    text('field_0047 · SYNTHETICfield_0089', M, H - 34, 8, '#FFFFFF' if dark else MUT)
    text(f'{n:02d} / 06', W - 65, H - 34, 8, '#FFFFFF' if dark else MUT)

def title(a, b, sub=None):
    text(a, M, 68, 29, G, True)
    text(b, M, 108, 29, G, True)
    rect(M, 161, 32, 3, ORANGE)
    if sub:
        para(sub, M, 179, W - 2 * M, 10)

def qr(path, crop, x, y, size):
    rect(x - 6, y - 6, size + 12, size + 12, '#FFFFFF', r=3)
    pic(path, crop, x, y, size, size)
rect(0, 0, W, H, BG)
logos(21)
text('field_0047 · field_0090', M, 86, 10, G, True)
text('field_0091', M, 112, 34, G, True)
text('field_0092', M, 158, 34, G, True)
text('SYNTHETICfield_0093', M, 211, 10.8, G)
rect(M, 245, 75, 23, ORANGE, r=4)
text('field_0094', M + 11, 249, 12, '#FFFFFF', True)
text('field_0095 · field_0096 · field_0097', M, 281, 23, G, True)
text('SYNTHETIC FINANCIAL FIELD: field_0098', M, 324, 31, ORANGE, True)
text('8800', M + 28, 308, 63, ORANGE, True)
text('/ field_0099', M + 223, 348, 13, MUT)
text('SYNTHETIC FINANCIAL FIELD: field_0100', M, 388, 10, G)
pic(hero, (0, 300, 1024, 986), 0, 418, W, 266)
rect(0, 684, W, 4, ORANGE)
rect(0, 688, W, H - 688, G)
text('field_0101', M, 703, 11, '#FFFFFF', True)
text('field_0102  SYNTHETIC_PHONE', M, 727, 14, '#FFFFFF', True)
text('field_0103  SYNTHETIC_PHONE', M, 754, 14, '#FFFFFF', True)
text('field_0104  /  field_0105', M, 665, 7.5, '#FFFFFF')
c.showPage()
base(2, 'field_0106')
title('field_0107', 'field_0108')
items = [('01', 'field_0109', 'field_0110、field_0111（field_0112）field_0113。'), ('02', 'field_0114', 'field_0115；field_0116。'), ('03', 'field_0117', 'field_0118；field_0119。')]
y = 190
for no, head, desc in items:
    text(no, M, y, 20, ORANGE, True)
    text(head, M + 45, y + 1, 14, G, True)
    para(desc, M + 45, y + 27, W - 2 * M - 45, 10)
    y += 89
labels = [('field_0120', 'field_0121'), ('field_0122', 'field_0123'), ('field_0124', 'field_0125'), ('field_0126', 'field_0127'), ('field_0128', 'field_0129'), ('field_0130', 'field_0131')]
crops = [(311, 386, 439, 475), (441, 386, 568, 475), (311, 500, 439, 590), (441, 500, 568, 590), (311, 615, 439, 705), (441, 615, 568, 705)]
cw = (W - 2 * M - 12) / 2
for i, ((head, desc), cr) in enumerate(zip(labels, crops)):
    xx = M + i % 2 * (cw + 12)
    yy = 466 + i // 2 * 80
    pic(overview, cr, xx, yy, 52, 54)
    text(head, xx + 59, yy + 5, 11, G, True)
    para(desc, xx + 59, yy + 24, cw - 59, 8.5)
para('field_0132、field_0133。field_0134，field_0135。', M, 711, W - 2 * M, 8.6)
footer(2)
c.showPage()
base(3, 'field_0136')
title('field_0137', 'field_0138', 'field_0139，field_0140。')
mods = [('01', 'field_0141', 'field_0142、field_0143、field_0144、field_0145、field_0146。'), ('02', 'field_0147', 'field_0148，field_0149。'), ('03', 'field_0150', 'field_0151、field_0152、field_0153、field_0154。'), ('04', 'field_0155', 'field_0156、field_0157、field_0158。')]
for i, (no, head, desc) in enumerate(mods):
    yy = 218 + i * 88
    rect(M, yy, W - 2 * M, 76, '#FFFFFF', r=6)
    text(no, M + 13, yy + 14, 19, ORANGE, True)
    text(head, M + 53, yy + 12, 14, G, True)
    para(desc, M + 53, yy + 37, W - 2 * M - 67, 10)
rect(M, 582, W - 2 * M, 69, LIGHT, r=6)
text('field_0159  /  field_0160', M + 13, 593, 10, G, True)
text('44field_0161', M + 13, 614, 19, G, True)
text('field_0162', M + 105, 622, 9, G)
text('≥56field_0163', M + 182, 614, 19, G, True)
text('field_0164', M + 282, 622, 9, G)
para('field_0165MH/T 000—000：field_016645field_0167，field_0168（field_0169）field_0170；field_0171。', M, 661, W - 2 * M, 8.5)
para('field_0172、field_0173、field_0174。field_0175，field_0176。', M, 709, W - 2 * M, 9, G)
footer(3)
c.showPage()
base(4, 'field_0177')
title('field_0178', 'field_0179')
text('field_0180，field_0181', M, 185, 14, G, True)
para('field_0182；field_0183、field_0184；field_01855field_0186、field_0187、field_0188。field_018918field_0190。', M, 212, W - 2 * M, 10)
text('field_0191', M, 299, 14, G, True)
para('field_0192、field_0193、field_0194、field_0195、field_0196。field_0197、field_0198，field_0199。', M, 326, W - 2 * M, 10)
line(399)
steps = [('01', 'field_0200', 'SYNTHETIC FINANCIAL FIELD: field_0201'), ('02', 'field_0202', 'field_0203、field_0204、field_0205'), ('03', 'field_0206', 'field_0207，field_0208'), ('04', 'field_0209', 'field_0210，field_0211')]
for i, (no, head, desc) in enumerate(steps):
    yy = 417 + i * 64
    text(no, M, yy, 17, ORANGE, True)
    text(head, M + 38, yy, 12, G, True)
    text(desc, M + 38, yy + 23, 9.5, MUT)
rect(M, 685, W - 2 * M, 61, LIGHT, r=5)
para('field_0212。field_0213。field_0214、field_0215，field_0216。', M + 12, 696, W - 2 * M - 24, 9, G)
footer(4)
c.showPage()
base(5, 'SYNTHETIC FINANCIAL FIELD: field_0217')
title('SYNTHETIC FINANCIAL FIELD: field_0218', 'field_0219，field_0220')
rect(M, 191, W - 2 * M, 190, G, r=8)
text('field_0221', M + 17, 207, 11, '#FFFFFF')
text('field_0095 · field_0096 · field_0097', M + 17, 235, 19, '#FFFFFF', True)
text('field_0222：field_0223', M + 17, 264, 8.5, '#FFFFFF')
text('field_0224', M + 17, 278, 10, '#FFFFFF')
text('SYNTHETIC FINANCIAL FIELD: field_0225', M + 17, 296, 47, '#FFFFFF', True)
text('/ field_0099', M + 211, 331, 12, '#FFFFFF')
text('SYNTHETIC FINANCIAL FIELD: field_0226', M + 17, 355, 9.5, '#FFFFFF')
text('field_0227，field_0228', M, 407, 16, G, True)
questions = [('field_0229', 'SYNTHETIC FINANCIAL FIELD: field_0230'), ('field_0231', 'field_0232、field_0233、field_0234'), ('field_0235', 'field_0236、field_0237、field_0238'), ('SYNTHETIC FINANCIAL FIELD: field_0239', 'SYNTHETIC FINANCIAL FIELD: field_0240')]
for i, (head, desc) in enumerate(questions):
    yy = 447 + i * 52
    text(head, M, yy, 11, G, True)
    text(desc, M, yy + 20, 9.5, MUT)
rect(M, 670, W - 2 * M, 60, '#ECE4D4', r=5)
para('SYNTHETIC FINANCIAL FIELD: field_0241', M + 12, 682, W - 2 * M - 24, 10, G)
footer(5)
c.showPage()
rect(0, 0, W, H, BG)
logos(22, True)
pic(hero, (0, 850, 1024, 1288), 0, 179, W, 170)
rect(0, 349, W, H - 349, G)
rect(0, 345, W, 4, ORANGE)
text('field_0242', M, 372, 30, '#FFFFFF', True)
text('field_0243', M, 414, 30, '#FFFFFF', True)
text('SYNTHETIC FINANCIAL FIELD: field_0244', M, 466, 11, '#FFFFFF')
qsize = 118
lx = M + 15
rx = W - M - 15 - qsize
qr(qa, (145, 466, 950, 1271), lx, 510, qsize)
qr(qb, (108, 352, 716, 960), rx, 510, qsize)
text('field_0102', lx, 647, 14, '#FFFFFF', True)
text('SYNTHETIC_PHONE', lx, 674, 13, '#FFFFFF', True)
text('field_0103', rx, 647, 14, '#FFFFFF', True)
text('SYNTHETIC_PHONE', rx, 674, 13, '#FFFFFF', True)
text('SYNTHETIC FINANCIAL FIELD: field_0245', M, 713, 11, '#FFFFFF')
para('field_0246：field_0247＋field_0248＋field_0249\nfield_0250。', M, 743, W - 2 * M, 9, '#DCE7E0')
c.showPage()
c.save()
pdf = fitz.open(OUT / 'field_0047_SYNTHETICfield_0086_field_0013.pdf')
names = ['01_field_0251', '02_field_0252', '03_field_0253', '04_field_0254', 'SYNTHETIC FINANCIAL FIELD: field_0255', '06_field_0256']
for i, p in enumerate(pdf):
    p.get_pixmap(dpi=300, alpha=False).save(OUT / (names[i] + '.png'))
ov = fitz.open()
g = 18
oh = 55
pg = ov.new_page(width=W * 3 + g * 4, height=H * 2 + g * 3 + oh)
pg.draw_rect(pg.rect, color=None, fill=(0.9, 0.92, 0.89))
fontfile = str(archive.input_path('input_0017'))
pg.insert_font(fontname='CN', fontfile=fontfile)
pg.insert_text((g, 31), 'field_0047 SYNTHETICfield_0086  /  field_0018', fontname='CN', fontsize=19, color=(0.02, 0.28, 0.2))
for i in range(6):
    x = g + i % 3 * (W + g)
    y = oh + g + i // 3 * (H + g)
    pg.show_pdf_page(fitz.Rect(x, y, x + W, y + H), pdf, i)
ov.save(OUT / '00_field_0019.pdf')
pg.get_pixmap(dpi=150).save(OUT / '00_field_0019.png')
sp = fitz.open()
for title0, order in [('field_0033：field_0257 P5 → field_0258 P6 → field_0259 P1', [4, 5, 0]), ('field_0034：P2 → P3 → P4', [1, 2, 3])]:
    page = sp.new_page(width=W * 3 + 36, height=H + 65)
    page.insert_font(fontname='CN', fontfile=fontfile)
    page.insert_text((18, 22), title0 + '  /  field_0260，field_0261', fontname='CN', fontsize=11)
    for j, idx in enumerate(order):
        page.show_pdf_page(fitz.Rect(18 + j * W, 40, 18 + (j + 1) * W, 40 + H), pdf, idx)
sp.save(OUT / 'field_0260_field_0261.pdf')
(OUT / 'field_0262.txt').write_text('field_0263：field_0019、field_0264300dpi PNG、field_0265PDFfield_0266。\nfield_0267140×285mm；field_0268PDFfield_0269420×285mm。\nfield_0270，field_0271。field_0272、field_0273/field_02743mmfield_0275，field_0276CMYKfield_0277、field_0278。\nfield_0279：8800field_0280；field_0281，field_0282、field_0283、field_0284。\nfield_0285。field_0286Logofield_0287，field_0288。\nAIfield_0289，field_0290、field_0291。\n', encoding='utf-8')
shutil.copy2(ROOT / 'field_0292.md', OUT / 'field_0292.md')
shutil.copy2(ROOT / 'field_0293.md', OUT / 'field_0293.md')
(ROOT / 'field_0294.txt').write_text('\n'.join(alltext), encoding='utf-8')
with zipfile.ZipFile(ROOT / 'field_0047_field_0295.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for p in OUT.iterdir():
        z.write(p, p.name)
print(json.dumps({'out': str(OUT), 'pages': len(pdf), 'png_px': [pdf[0].get_pixmap(dpi=300).width, pdf[0].get_pixmap(dpi=300).height]}, ensure_ascii=False))
