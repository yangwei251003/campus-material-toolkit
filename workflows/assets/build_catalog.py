# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
src = Path(__file__).with_name('build_brochure.py').read_text(encoding='utf-8').split('# 01 Cover')[0]
src = src.replace("OUT=ROOT/'field_0081'", "OUT=ROOT/'field_0296_field_0297'")
src = src.replace('field_0047_SYNTHETICfield_0086_field_0013.pdf', 'field_0298.pdf')
exec(compile(src, str(Path(__file__)), 'exec'))

def price_table(y, rows):
    xs = [M + 9, M + 51, M + 111, M + 193, M + 270]
    rect(M, y, W - 2 * M, 35, G, r=4)
    for x, t in zip(xs, ['field_0299', 'field_0300', 'field_0301*', 'field_0302', 'field_0303']):
        text(t, x, y + 11, 9, '#FFFFFF', True)
    y += 35
    for row in rows:
        hi = row[:2] == ('field_0095', 'field_0097') and row[4] == 8800
        rect(M, y, W - 2 * M, 54, '#F0E0C5' if hi else '#FFFFFF')
        for j, (x, v) in enumerate(zip(xs, row)):
            text(str(v), x, y + 17, 12 if j > 1 else 10.5, ORANGE if hi and j == 4 else G, j == 4 or hi)
        line(y + 54, x=M, w=W - 2 * M)
        y += 54
    return y
rect(0, 0, W, H, BG)
logos(21)
text('field_0304  /  field_0305', M, 89, 11, G, True)
text('SYNTHETIC', M, 118, 51, G, True)
text('field_0306', M, 183, 24, G, True)
text('field_0307', M, 222, 29, G, True)
text('field_0308 / field_0095 · field_0096 / field_0309', M, 275, 10.5, MUT)
text('field_0310 / field_0097 / field_0311', M, 297, 10.5, MUT)
rect(M, 336, W - 2 * M, 128, G, r=6)
text('field_0094  field_0095 · field_0096 · field_0097', M + 14, 350, 13, '#FFFFFF', True)
text('SYNTHETIC FINANCIAL FIELD: field_0225', M + 14, 377, 43, '#FFFFFF', True)
text('/ field_0099  field_0224', M + 191, 411, 10, '#FFFFFF')
text('SYNTHETIC FINANCIAL FIELD: field_0312', M + 14, 441, 8.5, '#FFFFFF')
pic(hero, (0, 290, 1024, 955), 0, 493, W, 258)
rect(0, 751, W, H - 751, G)
text('field_0102 SYNTHETIC_PHONE   field_0103 SYNTHETIC_PHONE', M, 769, 10.1, '#FFFFFF', True)
text('AIfield_0104 · field_0105', M, 731, 7.5, '#FFFFFF')
c.showPage()
base(2, 'field_0313')
title('field_0314', 'field_0315')
groups = [('01', 'field_0316', 'field_0317。field_0110、field_0111（field_0112）field_0113。'), ('02', 'field_0318', 'field_0319；field_0320，field_0321、field_0322。'), ('03', 'field_0323', 'field_0324。field_0325，field_0326、field_0327。'), ('04', 'field_0328', 'field_0329、field_0330，field_0331，field_0332。')]
for i, (no, head, body) in enumerate(groups):
    yy = 191 + i * 114
    text(no, M, yy, 19, ORANGE, True)
    text(head, M + 43, yy + 1, 13.5, G, True)
    para(body, M + 43, yy + 31, W - 2 * M - 43, 10)
rect(M, 659, W - 2 * M, 79, LIGHT, r=6)
text('field_0333', M + 12, 671, 11, G, True)
para('field_0334 · field_0122 · field_0124 · field_0335\nfield_0336、field_0133；field_0337。', M + 12, 696, W - 2 * M - 24, 9, G)
footer(2)
c.showPage()
base(3, 'SYNTHETIC FINANCIAL FIELD: field_0338')
title('field_0096', 'SYNTHETIC FINANCIAL FIELD: field_0339', 'SYNTHETIC FINANCIAL FIELD: field_0340')
multi = [('field_0308', 'field_0310', 8800, 7300, 6500), ('field_0308', 'field_0097', 10800, 8800, 7800), ('field_0308', 'field_0341', 17800, 15800, 13800), ('field_0095', 'field_0310', 10800, 9300, 7500), ('field_0095', 'field_0097', 12800, 9800, 8800), ('field_0095', 'field_0341', 19800, 17800, 15800)]
price_table(222, multi)
rect(M, 602, W - 2 * M, 65, G, r=5)
text('field_0094：field_0342', M + 12, 613, 13, '#FFFFFF', True)
para('field_0109 · field_0343\nfield_0344、field_0345。', M + 12, 637, W - 2 * M - 24, 9, '#FFFFFF')
para('SYNTHETIC FINANCIAL FIELD: field_0346', M, 685, W - 2 * M, 8.8)
footer(3)
c.showPage()
base(4, 'SYNTHETIC FINANCIAL FIELD: field_0347')
text('field_0309', M, 69, 27, G, True)
text('SYNTHETIC FINANCIAL FIELD: field_0339', M, 109, 29, G, True)
rect(M, 161, 32, 3, ORANGE)
text('field_0348：field_0349 / field_0099   ·   field_0350', M, 181, 10, MUT)
vtol = [('field_0308', 'field_0097', 15800, 13800, 12800), ('field_0308', 'field_0341', 19800, 17000, 15000), ('field_0095', 'field_0097', 17800, 16000, 12800), ('field_0095', 'field_0341', 25800, 22000, 19800)]
price_table(222, vtol)
text('field_0351，field_0352', M, 499, 16, G, True)
para('field_0353，field_0354，field_0355。field_0356。', M, 530, W - 2 * M, 10)
rect(M, 607, W - 2 * M, 55, LIGHT, r=5)
para('field_0357。field_0358、field_0359、field_0360，field_0361。', M + 12, 619, W - 2 * M - 24, 9.5, G)
para('SYNTHETIC FINANCIAL FIELD: field_0346', M, 685, W - 2 * M, 8.8)
footer(4)
c.showPage()
base(5, 'field_0362')
title('field_0363', 'field_0364')
text('field_0365', M, 184, 13, G, True)
para('field_0366；field_0183、field_0184；field_03675field_0368。field_018918field_0369。', M, 210, W - 2 * M, 10)
text('field_0370', M, 284, 13, G, True)
para('field_0192、field_0193、field_0194、field_0371、field_0196。field_0372。', M, 309, W - 2 * M, 10)
line(374)
steps = [('01', 'field_0373', 'field_0374、field_0144、field_0375'), ('02', 'field_0376', 'field_0377'), ('03', 'field_0378', 'field_0379'), ('04', 'field_0380、field_0381', 'field_0210，field_0382')]
for i, (no, head, desc) in enumerate(steps):
    yy = 392 + i * 58
    text(no, M, yy, 16, ORANGE, True)
    text(head, M + 35, yy, 11.5, G, True)
    text(desc, M + 35, yy + 23, 9, MUT)
para('field_0383。field_0384：field_016244field_0161、field_038556field_0163；field_0386。field_0387、field_0388。', M, 641, W - 2 * M, 8.7)
rect(M, 705, W - 2 * M, 40, '#ECE4D4', r=5)
para('SYNTHETIC FINANCIAL FIELD: field_0389', M + 10, 714, W - 2 * M - 20, 8.8, G)
footer(5)
c.showPage()
rect(0, 0, W, H, BG)
logos(22, True)
pic(hero, (0, 850, 1024, 1288), 0, 179, W, 170)
rect(0, 349, W, H - 349, G)
rect(0, 345, W, 4, ORANGE)
text('field_0390？', M, 372, 28, '#FFFFFF', True)
text('field_0391', M, 414, 26, '#FFFFFF', True)
text('SYNTHETIC FINANCIAL FIELD: field_0392', M, 466, 10.4, '#FFFFFF')
qsize = 118
lx = M + 15
rx = W - M - 15 - qsize
qr(qa, (145, 466, 950, 1271), lx, 510, qsize)
qr(qb, (108, 352, 716, 960), rx, 510, qsize)
text('field_0102', lx, 647, 14, '#FFFFFF', True)
text('SYNTHETIC_PHONE', lx, 674, 13, '#FFFFFF', True)
text('field_0103', rx, 647, 14, '#FFFFFF', True)
text('SYNTHETIC_PHONE', rx, 674, 13, '#FFFFFF', True)
text('field_0393、field_0394', M, 713, 11, '#FFFFFF')
para('SYNTHETIC FINANCIAL FIELD: field_0395', M, 743, W - 2 * M, 9, '#DCE7E0')
c.showPage()
c.save()
temp = OUT / 'field_0298.pdf'
pdf = fitz.open(temp)
pdf.save(OUT / 'field_0047_SYNTHETICfield_0304_field_0013.pdf')
names = ['01_field_0396', '02_field_0313', 'SYNTHETIC FINANCIAL FIELD: field_0397', 'SYNTHETIC FINANCIAL FIELD: field_0398', 'SYNTHETIC FINANCIAL FIELD: field_0399', '06_field_0256']
for i, p in enumerate(pdf):
    p.get_pixmap(dpi=300, alpha=False).save(OUT / (names[i] + '.png'))
ov = fitz.open()
g = 18
oh = 55
pg = ov.new_page(width=W * 3 + g * 4, height=H * 2 + g * 3 + oh)
pg.draw_rect(pg.rect, color=None, fill=(0.9, 0.92, 0.89))
fontfile = str(archive.input_path('input_0017'))
pg.insert_font(fontname='CN', fontfile=fontfile)
pg.insert_text((g, 31), 'field_0047 SYNTHETICfield_0304  /  field_0018', fontname='CN', fontsize=19, color=(0.02, 0.28, 0.2))
for i in range(6):
    x = g + i % 3 * (W + g)
    y = oh + g + i // 3 * (H + g)
    pg.show_pdf_page(fitz.Rect(x, y, x + W, y + H), pdf, i)
ov.save(OUT / '00_field_0400.pdf')
pg.get_pixmap(dpi=150).save(OUT / '00_field_0400.png')
sp = fitz.open()
for title0, order in [('field_0033：field_0257 P5 → field_0258 P6 → field_0259 P1', [4, 5, 0]), ('field_0034：P2 → P3 → P4', [1, 2, 3])]:
    p = sp.new_page(width=W * 3 + 36, height=H + 65)
    p.insert_font(fontname='CN', fontfile=fontfile)
    p.insert_text((18, 22), title0 + '  /  field_0260，field_0261', fontname='CN', fontsize=11)
    for j, idx in enumerate(order):
        p.show_pdf_page(fitz.Rect(18 + j * W, 40, 18 + (j + 1) * W, 40 + H), pdf, idx)
sp.save(OUT / 'field_0260_field_0261.pdf')
shutil.copy2(ROOT / 'field_0401.md', OUT / 'SYNTHETIC FINANCIAL FIELD: field_0402')
(OUT / 'field_0262.txt').write_text('SYNTHETIC FINANCIAL FIELD: field_0403', encoding='utf-8')
(OUT / 'SYNTHETIC FINANCIAL FIELD: field_0404').write_text(json.dumps({'source': 'SYNTHETIC FINANCIAL FIELD: field_0405', 'columns': ['field_0299', 'field_0300', 'field_0406', 'field_0302', 'field_0303'], 'field_0096': multi, 'field_0309': vtol}, ensure_ascii=False, indent=2), encoding='utf-8')
pdf.close()
try:
    temp.unlink()
except PermissionError:
    pass
print(json.dumps({'out': str(OUT), 'courses': len(multi) + len(vtol), 'price_values': 3 * (len(multi) + len(vtol))}, ensure_ascii=False))
