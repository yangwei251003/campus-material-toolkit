# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import sys, json, zipfile, shutil, io
from PIL import Image
import pymupdf as fitz
import zxingcpp
sys.path.insert(0, str(archive.input_path('input_0079')))
from setup_chinese_pdf import setup_chinese_pdf
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
REG, _ = setup_chinese_pdf()
pdfmetrics.registerFont(TTFont('BoldCN', str(archive.input_path('input_0080')), subfontIndex=0))
BOLD = 'BoldCN'
ROOT = archive.source_dir('workflows/assets/build_pdf_refined.py', 0)
OUT = ROOT / 'field_0268PDFfield_0407'
ASSET = OUT / 'field_0408'
SVG = OUT / 'SVGfield_0409'
SVG.mkdir(exist_ok=True)
TMP = archive.input_path('input_0006')
MM = 72 / 25.4
W = 140 * MM
H = 285 * MM
M = 24
G = '#064737'
BG = '#F6F5EE'
INK = '#143D32'
MUT = '#53665F'
GOLD = '#C88C32'
LIGHT = '#E5EDE5'
school = TMP / 'codex-clipboard-555f71d2-deb7-43c3-a215-8e52a09f6984.png'
club = TMP / 'codex-clipboard-d28394cc-49d0-4491-858f-211be7832cc9.jpg'
qa = TMP / 'codex-clipboard-6e0643d2-0a43-4acb-ac6c-cfffac912c90.jpg'
qb = TMP / 'codex-clipboard-29718f75-4ca8-420e-a78e-d45cbd486b92.jpg'
campus = TMP / 'codex-clipboard-baf8bfb0-a57a-4e49-8155-366ad373ceea.jpg'
campus2 = TMP / 'codex-clipboard-5f98bbe5-4d47-48c6-a646-474bc6480859.jpg'
media = lambda n: next(ASSET.glob(f'*_xref{n}.*'))
overflows = []
used = {}
edition = 'A'
page = 1

def svgfile(name, body, view='0 0 400 180'):
    p = SVG / (name + '.svg')
    p.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">{body}</svg>', encoding='utf-8')
    return p
svgfile('SYNTHETIC FINANCIAL FIELD: field_0410', '<path d="M4 145 Q110 20 215 130 T397 70" fill="none" stroke="#D4B171" stroke-width="3"/><rect x="34" y="32" width="104" height="135" rx="12" fill="#FFF" stroke="#CCDAD0"/><rect x="63" y="20" width="46" height="22" rx="5" fill="#064737"/><path d="M54 65l6 7 11-15M54 95l6 7 11-15M54 125l6 7 11-15" fill="none" stroke="#43816B" stroke-width="4"/><path d="M84 67h35M84 97h35M84 127h35" stroke="#C7D7CB" stroke-width="5"/><rect x="158" y="56" width="112" height="105" rx="10" fill="#E5EDE5" stroke="#B7CBBE"/><path d="M158 83h112" stroke="#064737" stroke-width="18"/><path d="M182 45v26M245 45v26" stroke="#C88C32" stroke-width="6" stroke-linecap="round"/><g fill="#FFF"><rect x="179" y="104" width="17" height="14"/><rect x="206" y="104" width="17" height="14"/><rect x="233" y="104" width="17" height="14"/><rect x="179" y="130" width="17" height="14"/><rect x="206" y="130" width="17" height="14"/></g><circle cx="319" cy="99" r="43" fill="#064737"/><path d="M299 99l14 14 27-33" fill="none" stroke="#FFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>')
svgfile('field_0411', '<path d="M25 99C25 8 145 9 200 90S373 180 373 91 247 8 200 90 25 190 25 99Z" fill="none" stroke="#C8D9CD" stroke-width="17"/><path d="M25 99C25 8 145 9 200 90S373 180 373 91 247 8 200 90 25 190 25 99Z" fill="none" stroke="#43816B" stroke-width="2" stroke-dasharray="7 6"/><g fill="#C88C32" stroke="#FFF" stroke-width="4"><circle cx="25" cy="99" r="11"/><circle cx="126" cy="33" r="11"/><circle cx="279" cy="152" r="11"/><circle cx="372" cy="90" r="11"/></g><path d="M192 76l22 16-26 9 5-11Z" fill="#064737"/><circle cx="200" cy="171" r="6" fill="#064737"/>')
svgfile('field_0412', '<path d="M38 104H366" fill="none" stroke="#C88C32" stroke-width="3"/><g fill="#E5EDE5" stroke="#AAC4B4" stroke-width="2"><circle cx="52" cy="91" r="40"/><circle cx="199" cy="91" r="40"/><circle cx="345" cy="91" r="40"/></g><g fill="none" stroke="#064737" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="32" y="65" width="40" height="50" rx="4"/><path d="M41 79h21M41 91h21M41 103h14"/><circle cx="199" cy="79" r="10"/><path d="M179 114v-8q20-28 40 0v8"/><path d="M326 91l13 14 23-31"/></g>')
svgfile('field_0413', '<path d="M200 40V72M65 105V73H335V105M200 72V105" fill="none" stroke="#88AE98" stroke-width="3"/><rect x="143" y="9" width="114" height="41" rx="9" fill="#064737"/><g fill="#E5EDE5" stroke="#AAC4B4" stroke-width="2"><rect x="18" y="105" width="94" height="53" rx="9"/><rect x="153" y="105" width="94" height="53" rx="9"/><rect x="288" y="105" width="94" height="53" rx="9"/></g><g fill="#C88C32"><circle cx="65" cy="131" r="10"/><circle cx="200" cy="131" r="15"/><circle cx="335" cy="131" r="20"/></g>')
svgfile('field_0414', f'<rect width="1200" height="815" fill="{BG}"/><path d="M0 700C210 640 420 768 600 705S980 650 1200 720V815H0Z" fill="#E5EDE5"/><path d="M0 749C250 696 460 809 650 749S990 702 1200 750V815H0Z" fill="#CEDFD1"/><path d="M0 779C250 750 480 805 660 775S990 750 1200 780V815H0Z" fill="{G}"/><path d="M0 779C250 750 480 805 660 775S990 750 1200 780" fill="none" stroke="{GOLD}" stroke-width="2"/>', '0 0 1200 815')

def rect(x, y, w, h, fill, stroke=None, r=0):
    c.setFillColor(HexColor(fill))
    c.setStrokeColor(HexColor(stroke or fill))
    c.roundRect(x, H - y - h, w, h, r, fill=1, stroke=bool(stroke)) if r else c.rect(x, H - y - h, w, h, fill=1, stroke=bool(stroke))

def txt(s, x, y, size=10, fill=INK, bold=False):
    c.setFillColor(HexColor(fill))
    c.setFont(BOLD if bold else REG, size)
    c.drawString(x, H - y - size, s)
    if x + pdfmetrics.stringWidth(s, BOLD if bold else REG, size) > W - M + 2:
        overflows.append((edition, page, s))

def para(s, x, y, width, size=10, fill=MUT, bold=False, lead=None):
    lead = lead or size * 1.5
    for raw in s.split('\n'):
        line = ''
        for ch in raw:
            if pdfmetrics.stringWidth(line + ch, BOLD if bold else REG, size) > width and line and (ch not in '，。；：、）！？”'):
                txt(line, x, y, size, fill, bold)
                y += lead
                line = ch
            else:
                line += ch
        txt(line, x, y, size, fill, bold)
        y += lead
    return y

def pic(path, box, x, y, w, h):
    iw, ih = Image.open(path).size
    a, b, d, e = box
    sx = w / (d - a)
    sy = h / (e - b)
    c.saveState()
    p = c.beginPath()
    p.rect(x, H - y - h, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(str(path), x - a * sx, H - y - (ih - b) * sy, iw * sx, ih * sy, mask='auto')
    c.restoreState()
    used.setdefault(edition, []).append({'page': page, 'source': str(path), 'crop': box})

def contain(path, x, y, w, h):
    iw, ih = Image.open(path).size
    s = min(w / iw, h / ih)
    pic(path, (0, 0, iw, ih), x + (w - iw * s) / 2, y + (h - ih * s) / 2, iw * s, ih * s)

def photo(path, x, y, w, h):
    iw, ih = Image.open(path).size
    s = max(w / iw, h / ih)
    cw = w / s
    ch = h / s
    pic(path, ((iw - cw) / 2, (ih - ch) / 2, (iw + cw) / 2, (ih + ch) / 2), x, y, w, h)

def svg(name, x, y, w, h):
    d = svg2rlg(str(SVG / (name + '.svg')))
    d.scale(w / d.width, h / d.height)
    renderPDF.draw(d, c, x, H - y - h)

def bg(n, section):
    global page
    page = n
    slot = {5: 0, 6: 1, 1: 2, 2: 0, 3: 1, 4: 2}[n]
    d = svg2rlg(str(SVG / 'field_0414.svg'))
    d.scale(W * 3 / d.width, H / d.height)
    c.saveState()
    p = c.beginPath()
    p.rect(0, 0, W, H)
    c.clipPath(p, stroke=0, fill=0)
    renderPDF.draw(d, c, -slot * W, 0)
    c.restoreState()
    if n not in [1, 6]:
        txt('SYNTHETIC  /  SYNTHETIC TRAINING', M, 22, 8, G, True)
        txt(f'{n:02d}  /  {section}', W - 130, 22, 8, MUT)
        rect(M, 44, W - 2 * M, 0.6, '#C9D8CD')
    txt('field_0415 · field_0416 · field_0417 · field_0418', M, H - 24, 8, '#FFFFFF')
    txt(f'{n:02d} / 06', W - 62, H - 24, 8, '#FFFFFF')

def logos(y=20):
    pic(school, (90, 160, 2100, 550), M, y, 210, 40.7)
    pic(club, (114, 110, 837, 264), W - 132, y + 8, 108, 23)

def company(y):
    txt('field_0419（field_0420）', M, y, 17, G, True)
    txt('field_0421', M, y + 26, 14, G, True)

def title(a, b, sub=None):
    txt(a, M, 68, 28, G, True)
    txt(b, M, 108, 28, G, True)
    rect(M, 157, 38, 3, GOLD)
    if sub:
        para(sub, M, 174, W - 2 * M, 9.5)

def badge(no, head, body, y, h=85):
    rect(M, y, W - 2 * M, h, '#FFFFFF', r=6)
    txt(no, M + 12, y + 11, 18, GOLD, True)
    txt(head, M + 52, y + 12, 13, G, True)
    para(body, M + 52, y + 37, W - 2 * M - 64, 9.7)

def notes(s, y):
    para(s, M, y, W - 2 * M, 8.3)

def prices(rows, y, rh=47):
    xs = [M + 10, M + 55, M + 122, M + 201, M + 278]
    width = W - 2 * M
    rect(M, y, width, 34, G, r=4)
    for x, t in zip(xs, ['field_0299', 'field_0300', 'field_0301*', 'field_0302', 'field_0303']):
        txt(t, x, y + 10, 9, '#FFFFFF', True)
    y += 34
    for row in rows:
        rect(M, y, width, rh, '#FFFFFF')
        hi = row[:2] == ('field_0095', 'field_0097') and row[4] == 8800
        if hi:
            rect(M + 264, y, 85, rh, '#F2DFC0')
        for j, (x, t) in enumerate(zip(xs, row)):
            txt(str(t), x, y + (rh - 12) / 2, 11.5 if j > 1 else 9.5, GOLD if hi and j == 4 else G, hi or j == 4)
        rect(M, y + rh, width, 0.55, '#D7E1D8')
        y += rh
    return y

def cover(full=False):
    bg(1, 'field_0259')
    logos()
    company(76)
    if full:
        txt('SYNTHETIC', M, 145, 51, G, True)
        txt('field_0306', M, 209, 23, G, True)
        txt('field_0307', M, 243, 27, G, True)
        txt('field_0304', M, 286, 13, GOLD, True)
        txt('field_0308 / field_0095 · field_0096 / field_0309', M, 315, 10, MUT)
        y = 354
    else:
        txt('field_0091', M, 143, 35, G, True)
        txt('field_0092', M, 191, 35, G, True)
        txt('SYNTHETICfield_0093', M, 246, 10, G)
        y = 290
    rect(M, y, W - 2 * M, 134, G, r=8)
    txt('field_0094  field_0095 · field_0096 · field_0097', M + 14, y + 13, 14, '#FFFFFF', True)
    txt('SYNTHETIC FINANCIAL FIELD: field_0225', M + 14, y + 38, 48, '#FFFFFF', True)
    txt('/ field_0099', M + 230, y + 73, 11, '#FFFFFF')
    txt('SYNTHETIC FINANCIAL FIELD: field_0422', M + 14, y + 109, 9.3, '#FFFFFF')
    yy = 504 if full else 446
    contain(media(265), M, yy, W - 2 * M, 121)
    notes('field_0268PDFfield_0423 · field_0424，field_0425', yy + 119)
    if not full:
        photo(campus, M, 602, W - 2 * M, 98)
    else:
        para('field_0426 · field_0427\nfield_0428，field_0429。', M, 660, W - 2 * M, 11, G, True)
    rect(M, 712, W - 2 * M, 44, G, r=5)
    txt('field_0102 SYNTHETIC_PHONE', M + 12, 717, 11, '#FFFFFF', True)
    txt('field_0103 SYNTHETIC_PHONE', M + 12, 737, 11, '#FFFFFF', True)
    c.showPage()

def contact(full=False):
    bg(6, 'field_0430')
    logos()
    company(76)
    txt('field_0390？' if full else 'field_0431', M, 153, 27, G, True)
    txt('field_0391' if full else 'field_0432 · field_0433 · field_0434', M, 197, 18, G, True)
    photo(campus2, M, 244, W - 2 * M, 128)
    qsize = 125
    lx = M + 11
    rx = W - M - 11 - qsize
    for src, cr, x, name, phone in [(qa, (145, 466, 950, 1271), lx, 'field_0102', 'SYNTHETIC_PHONE'), (qb, (108, 352, 716, 960), rx, 'field_0103', 'SYNTHETIC_PHONE')]:
        rect(x - 7, 403, qsize + 14, qsize + 14, '#FFFFFF', r=5)
        pic(src, cr, x, 410, qsize, qsize)
        txt(name, x, 555, 17, G, True)
        txt(phone, x, 586, 12.5, G, True)
    rect(M, 632, W - 2 * M, 54, G, r=6)
    para('field_0435\nfield_0436：field_0247＋field_0248＋field_0249', M + 13, 642, W - 2 * M - 26, 10, '#FFFFFF')
    para('SYNTHETIC FINANCIAL FIELD: field_0437', M, 701, W - 2 * M, 9, G)
    c.showPage()

def a_pages():
    cover()
    bg(2, 'field_0438')
    title('field_0107', 'field_0108')
    badge('01', 'field_0109', 'field_0110、field_0111（field_0112）field_0113。', 187)
    badge('02', 'field_0439', 'field_0440、field_0441，field_0442。', 285)
    badge('03', 'field_0443', 'field_0444。field_0445。', 383)
    photo(media(250), M, 486, W - 2 * M, 165)
    txt('field_0120 / field_0122 / field_0124', M, 668, 11, G, True)
    txt('field_0126 / field_0128 / field_0130', M, 692, 11, G, True)
    notes('field_0268PDFfield_0446，field_0447。field_0132、field_0133，field_0448。', 719)
    c.showPage()
    bg(3, 'field_0136')
    title('field_0137', 'field_0138')
    mods = [('field_0141', 'field_0374、field_0144、field_0143、field_0449。'), ('field_0147', 'field_0450、field_0451、field_0452。'), ('field_0150', 'field_0151、field_0152、field_0453。'), ('field_0155', 'field_0156、field_0454、field_0455。')]
    for i, (head, body) in enumerate(mods):
        badge(f'{i + 1:02d}', head, body, 186 + i * 85, 74)
    svg('field_0411', M + 56, 539, W - 2 * M - 112, 80)
    txt('field_0456，field_0457“field_0458”field_0459', M, 636, 15, G, True)
    para('field_0172、field_0173、field_0174。field_0460，field_0461。', M, 666, W - 2 * M, 10, G)
    notes('field_0462，field_0463。field_0464、field_0465。', 719)
    c.showPage()
    bg(4, 'field_0466')
    title('field_0178', 'field_0179')
    txt('field_0467', M, 188, 14, G, True)
    para('field_0366；field_0183、field_0468，field_04695field_0470。field_018918field_0369。', M, 216, W - 2 * M, 10)
    para('field_0471、field_0472、field_0473、field_0474；field_0197，field_0475。', M, 294, W - 2 * M, 10)
    steps = [('field_0476', 'SYNTHETIC FINANCIAL FIELD: field_0477'), ('field_0478', 'field_0479，field_0480'), ('field_0207', 'field_0481'), ('field_0482', 'field_0210，field_0483')]
    for i, (head, body) in enumerate(steps):
        badge(f'{i + 1:02d}', head, body, 370 + i * 72, 62)
    svg('field_0412', M + 50, 650, W - 2 * M - 100, 60)
    notes('field_0212。field_0213；field_0484、field_0485。', 718)
    c.showPage()
    bg(5, 'SYNTHETIC FINANCIAL FIELD: field_0217')
    title('SYNTHETIC FINANCIAL FIELD: field_0218', 'field_0219，field_0220')
    rect(M, 187, W - 2 * M, 141, G, r=7)
    txt('field_0095 · field_0096 · field_0097', M + 14, 201, 18, '#FFFFFF', True)
    txt('field_0224', M + 14, 240, 10, '#FFFFFF')
    txt('SYNTHETIC FINANCIAL FIELD: field_0225', M + 14, 260, 34, '#FFFFFF', True)
    txt('field_0486', M + 206, 240, 9, '#FFFFFF')
    txt('SYNTHETIC FINANCIAL FIELD: field_0487', M + 206, 269, 25, '#FFFFFF', True)
    notes('SYNTHETIC FINANCIAL FIELD: field_0488', 340)
    asks = [('field_0489', 'field_0490、field_0491。'), ('field_0231', 'field_0492、field_0493。'), ('field_0235', 'SYNTHETIC FINANCIAL FIELD: field_0494'), ('SYNTHETIC FINANCIAL FIELD: field_0239', 'SYNTHETIC FINANCIAL FIELD: field_0495')]
    for i, (head, body) in enumerate(asks):
        yy = 376 + i * 54
        txt(f'{i + 1:02d}', M, yy, 16, GOLD, True)
        txt(head, M + 37, yy, 12, G, True)
        txt(body, M + 37, yy + 24, 9.4, MUT)
    svg('SYNTHETIC FINANCIAL FIELD: field_0410', M + 34, 599, W - 2 * M - 68, 113)
    rect(M, 721, W - 2 * M, 37, G, r=5)
    txt('SYNTHETIC FINANCIAL FIELD: field_0496', M + 18, 731, 12, '#FFFFFF', True)
    c.showPage()
    contact()

def b_pages():
    cover(True)
    bg(2, 'field_0497')
    title('field_0498', 'field_0499，field_0500')
    groups = [('field_0501', 'field_0502，field_0503。field_0504、field_0133。'), ('field_0505', 'field_0506、field_0095、field_0507、field_0508；field_0509、field_0510。field_0511。'), ('field_0310、field_0097、field_0341', 'field_0512；field_0513。field_0514。'), ('field_0515，field_0516', 'field_0517；field_0518；field_0519。field_0520，field_0521。')]
    for i, (head, body) in enumerate(groups):
        badge(f'{i + 1:02d}', head, body, 185 + i * 112, 102)
    svg('field_0413', M + 60, 645, W - 2 * M - 120, 82)
    notes('field_0522：field_0096 / field_0309。field_0523、field_0524、field_0525。', 725)
    c.showPage()
    bg(3, 'field_0526')
    title('field_0096', 'SYNTHETIC FINANCIAL FIELD: field_0339', 'SYNTHETIC FINANCIAL FIELD: field_0527')
    multi = [('field_0308', 'field_0310', 8800, 7300, 6500), ('field_0308', 'field_0097', 10800, 8800, 7800), ('field_0308', 'field_0341', 17800, 15800, 13800), ('field_0095', 'field_0310', 10800, 9300, 7500), ('field_0095', 'field_0097', 12800, 9800, 8800), ('field_0095', 'field_0341', 19800, 17800, 15800)]
    prices(multi, 213, 50)
    contain(media(271), M, 569, 141, 120)
    txt('field_0094', M + 165, 580, 13, GOLD, True)
    para('field_0095 · field_0096\nfield_0097', M + 165, 610, 175, 18, G, True)
    para('SYNTHETIC FINANCIAL FIELD: field_0528', M + 165, 667, 180, 9.8, G)
    notes('SYNTHETIC FINANCIAL FIELD: field_0529', 717)
    c.showPage()
    bg(4, 'field_0530')
    title('field_0309', 'SYNTHETIC FINANCIAL FIELD: field_0339', 'field_0348：field_0349 / field_0099  ·  field_0531')
    vtol = [('field_0308', 'field_0097', 15800, 13800, 12800), ('field_0308', 'field_0341', 19800, 17000, 15000), ('field_0095', 'field_0097', 17800, 16000, 12800), ('field_0095', 'field_0341', 25800, 22000, 19800)]
    prices(vtol, 213, 48)
    notes('SYNTHETIC FINANCIAL FIELD: field_0532', 452)
    txt('field_0533', M, 489, 20, G, True)
    jobs = [('field_0120', 'field_0534、field_0535'), ('field_0122', 'field_0536'), ('field_0124', 'field_0537'), ('field_0538', 'field_0539、field_0540')]
    for i, (head, body) in enumerate(jobs):
        x = M + i % 2 * 178
        y = 523 + i // 2 * 70
        rect(x, y, 170, 61, '#FFFFFF', r=5)
        txt(head, x + 11, y + 10, 12, G, True)
        txt(body, x + 11, y + 36, 9, MUT)
    para('field_0541；field_0542、field_0543。field_0357。', M, 672, W - 2 * M, 10, G)
    notes('field_0544，field_0545。', 722)
    c.showPage()
    bg(5, 'field_0546')
    title('field_0546', 'field_0547')
    req = [('field_0365', 'field_0366；field_0183、field_0468，field_0548。field_018918field_0549。'), ('field_0550', 'field_0192、field_0472、field_0473、field_0196；field_0551。'), ('field_0552', 'field_0553，field_0554。field_0555；field_0556。'), ('SYNTHETIC FINANCIAL FIELD: field_0557', 'SYNTHETIC FINANCIAL FIELD: field_0558')]
    for i, (head, body) in enumerate(req):
        badge(f'{i + 1:02d}', head, body, 185 + i * 110, 101)
    svg('field_0412', M + 22, 643, W - 2 * M - 44, 106)
    c.showPage()
    contact(True)

def export(folder, pdfpath):
    d = fitz.open(pdfpath)
    for i, p in enumerate(d):
        p.get_pixmap(dpi=300, alpha=False).save(folder / f'{i + 1:02d}_field_0559.png')
        (folder / f'{i + 1:02d}_field_0560.svg').write_text(p.get_svg_image(text_as_path=True), encoding='utf-8')
    ov = fitz.open()
    gap = 14
    top = 43
    p = ov.new_page(width=W * 3 + gap * 4, height=H * 2 + gap * 3 + top)
    p.draw_rect(p.rect, fill=(0.9, 0.93, 0.9), color=None)
    p.insert_font(fontname='CN', fontfile=str(archive.input_path('input_0017')))
    p.insert_text((gap, 28), folder.name + ' · field_0018', fontname='CN', fontsize=16, color=(0.02, 0.28, 0.2))
    for i in range(6):
        x = gap + i % 3 * (W + gap)
        y = top + gap + i // 3 * (H + gap)
        p.show_pdf_page(fitz.Rect(x, y, x + W, y + H), d, i)
    ov.save(folder / '00_field_0019.pdf')
    p.get_pixmap(dpi=120).save(folder / '00_field_0019.png')
    sp = fitz.open()
    for order in [[4, 5, 0], [1, 2, 3]]:
        p = sp.new_page(width=W * 3, height=H)
        for j, idx in enumerate(order):
            p.show_pdf_page(fitz.Rect(j * W, 0, (j + 1) * W, H), d, idx)
    sp.save(folder / 'field_0561.pdf')
    qrs = {x.text for x in zxingcpp.read_barcodes(Image.open(folder / '06_field_0559.png')) if x.valid}
    assert qrs == {'https://example.invalid/reference', 'https://example.invalid/reference'}, qrs
    text = ''.join((p.get_text() for p in d))
    assert 'field_0102' in text and 'SYNTHETIC_PHONE' in text and ('SYNTHETIC_PHONE' in text)
    assert 'field_0419（field_0420）' in text and 'field_0421' in text
    return {'pages': len(d), 'qr_verified': True, 'contacts_verified': True, 'company_verified': True, 'pixels': Image.open(folder / '01_field_0559.png').size}
checks = {}
for edition, foldername, build in [('A', 'A_8800field_0562', a_pages), ('B', 'B_field_0304', b_pages)]:
    folder = OUT / foldername
    folder.mkdir(exist_ok=True)
    pdfpath = folder / 'field_0013.pdf'
    c = canvas.Canvas(str(pdfpath), pagesize=(W, H))
    c.setTitle(foldername + ' · field_0268PDFfield_0563')
    build()
    c.save()
    checks[edition] = export(folder, pdfpath)
(OUT / 'field_0564.json').write_text(json.dumps(used, ensure_ascii=False, indent=2), encoding='utf-8')
(OUT / 'field_0025.json').write_text(json.dumps({'editions': checks, 'text_overflow': overflows}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'checks': checks, 'overflows': overflows}, ensure_ascii=False))
