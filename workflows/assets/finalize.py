# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import sys, re, html, json, zipfile, shutil
from PIL import Image
import pymupdf as fitz
import zxingcpp
sys.path.insert(0, str(archive.input_path('input_0079')))
from setup_chinese_pdf import setup_chinese_pdf
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, LongTable, TableStyle, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
font, styles = setup_chinese_pdf()
R = archive.source_dir('workflows/assets/finalize.py', 0)
styles.add(ParagraphStyle('ReportBody', parent=styles['BodyText'], fontName=font, fontSize=9, leading=14, spaceAfter=6, wordWrap='CJK'))
styles.add(ParagraphStyle('ReportCell', parent=styles['BodyText'], fontName=font, fontSize=8, leading=12, wordWrap='CJK'))
for key, size in [('Title', 21), ('Heading1', 16), ('Heading2', 12)]:
    styles[key].fontName = font
    styles[key].fontSize = size
    styles[key].leading = size * 1.4
    styles[key].textColor = HexColor('#064737')

def fmt(s):
    s = html.escape(s)
    s = re.sub('\\[([^\\]]+)\\]\\((https?://[^)]+)\\)', '<link href="\\2" color="#08785a">\\1</link>', s)
    s = re.sub('\\*\\*(.*?)\\*\\*', '<b>\\1</b>', s)
    return s
lines = (R / 'field_0292.md').read_text(encoding='utf-8').splitlines()
story = []
i = 0
while i < len(lines):
    s = lines[i].strip()
    if not s:
        i += 1
        continue
    if s.startswith('|'):
        rows = []
        while i < len(lines) and lines[i].strip().startswith('|'):
            cells = [v.strip() for v in lines[i].strip().strip('|').split('|')]
            if not all((re.fullmatch('[-: ]+', v) for v in cells)):
                rows.append(cells)
            i += 1
        n = len(rows[0])
        widths = {3: [105, 100, 294], 4: [62, 125, 151, 161]}.get(n, [499 / n] * n)
        if rows[0][0] == 'field_0576':
            widths = [126, 45, 85, 243]
        data = [[Paragraph(fmt(v), styles['ReportCell']) for v in row] for row in rows]
        t = LongTable(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), HexColor('#E6EDE4')), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, 0), 0.7, HexColor('#064737')), ('LINEBELOW', (0, 1), (-1, -1), 0.35, HexColor('#D9E1D8')), ('LEFTPADDING', (0, 0), (-1, -1), 5), ('RIGHTPADDING', (0, 0), (-1, -1), 5), ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
        story.extend([t, Spacer(1, 12)])
        continue
    st = styles['Title'] if s.startswith('# ') else styles['Heading1'] if s.startswith('## ') else styles['ReportBody']
    txt = re.sub('^#{1,3} ', '', s)
    if txt.startswith('- '):
        txt = '• ' + txt[2:]
    story.append(Paragraph(fmt(txt), st))
    i += 1

def footer(c, d):
    c.setFont(font, 8)
    c.setFillColor(HexColor('#50655D'))
    c.drawString(48, 26, 'field_0577 · 000-09-21')
    c.drawRightString(A4[0] - 48, 26, str(d.page))
doc = SimpleDocTemplate(str(R / 'field_0086_field_0578.pdf'), pagesize=A4, leftMargin=48, rightMargin=48, topMargin=42, bottomMargin=43, title='field_0579')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
expected_qr = {'https://example.invalid/reference', 'https://example.invalid/reference'}
validation = {}
folders = [R / 'field_0081', R / 'field_0296_field_0297']
for folder in folders:
    pdf_path = next(folder.glob('*field_0013.pdf'))
    d = fitz.open(pdf_path)
    assert len(d) == 6
    txt = ''.join((p.get_text() for p in d))
    assert 'SYNTHETIC_PHONE' in txt and 'SYNTHETIC_PHONE' in txt
    qrs = {x.text for x in zxingcpp.read_barcodes(Image.open(next(folder.glob('06*.png')))) if x.valid}
    assert qrs == expected_qr, (folder, qrs)
    sizes = []
    outside = []
    for pi, p in enumerate(d):
        for b in p.get_text('dict')['blocks']:
            for ln in b.get('lines', []):
                for s in ln['spans']:
                    sizes.append(s['size'])
                    bb = s['bbox']
                    if bb[0] < 0 or bb[2] > p.rect.width + 0.5 or bb[3] > p.rect.height:
                        outside.append((pi + 1, s['text']))
    assert not outside
    validation[folder.name] = {'pages': 6, 'both_contact_numbers': True, 'original_QR_payloads_match': True, 'text_outside_page': outside, 'minimum_typeset_font_pt': min(sizes), 'single_page_pixels': Image.open(next(folder.glob('01*.png'))).size, 'render_dpi': 300, 'review': 'field_0580；field_0581。'}
    if 'field_0296' in folder.name:
        wanted = [[8800, 7300, 6500, 10800, 8800, 7800, 17800, 15800, 13800, 10800, 9300, 7500, 12800, 9800, 8800, 19800, 17800, 15800], [15800, 13800, 12800, 19800, 17000, 15000, 17800, 16000, 12800, 25800, 22000, 19800]]
        for pidx, vals in zip([2, 3], wanted):
            found = [int(x) for x in re.findall('^\\d{4,5}$', d[pidx].get_text(), re.M)]
            assert found == vals, (pidx, found, vals)
        validation[folder.name]['all_30_prices_match_source_transcription'] = True
    d.close()
(R / 'field_0582.json').write_text(json.dumps(validation, ensure_ascii=False, indent=2), encoding='utf-8')
concept = archive.input_path('input_0583')
if concept.exists():
    shutil.copy2(concept, R / 'field_0082' / 'field_0584_field_0585.png')
temp = folders[1] / 'field_0298.pdf'
if temp.exists():
    temp.unlink()
for folder in folders:
    with zipfile.ZipFile(R / (('field_0586_8800field_0587' if folder == folders[0] else 'field_0296_field_0297') + '.zip'), 'w', zipfile.ZIP_DEFLATED) as z:
        for p in folder.iterdir():
            if p.is_file():
                z.write(p, p.name)
with zipfile.ZipFile(R / 'field_0047_field_0588.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for folder in folders:
        for p in folder.iterdir():
            if p.is_file():
                z.write(p, str(Path(folder.name) / p.name))
    for name in ['field_0086_field_0578.pdf', 'field_0292.md', 'field_0582.json', 'field_0293.md']:
        z.write(R / name, name)
report = fitz.open(R / 'field_0086_field_0578.pdf')
report[0].get_pixmap(dpi=100).save(R / 'field_0589.png')
print(json.dumps({'report_pages': len(report), 'verification': validation, 'bundle_mb': round((R / 'field_0047_field_0588.zip').stat().st_size / 1024 ** 2, 1)}, ensure_ascii=False))
