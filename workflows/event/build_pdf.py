# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
import json, re, sys
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
sys.stdout.reconfigure(encoding='utf-8')
root = runtime.workspace() / 'event'
data = json.loads((root / 'plan.json').read_text(encoding='utf-8'))
out = runtime.workspace() / 'output/pdf'
out.mkdir(parents=True, exist_ok=True)
runtime.register_pdf_fonts()
runtime.register_pdf_fonts()
pdfmetrics.registerFontFamily('YaHei', normal='YaHei', bold='YaHeiBold')
navy = colors.HexColor('#162D3B')
teal = colors.HexColor('#006E72')
gray = colors.HexColor('#586870')
W, H = A4
X = 48
CW = W - X * 2
clean = lambda s: re.sub('[—–]', '-', s)

def style(size=10.15, lead=14.2, color=navy, bold=False):
    return ParagraphStyle('s', fontName='YaHeiBold' if bold else 'YaHei', fontSize=size, leading=lead, textColor=color, wordWrap='CJK', spaceAfter=0, allowWidows=0, allowOrphans=0)

def p(text, size=10.15, lead=14.2, color=navy, bold=False):
    return Paragraph(escape(clean(text)), style(size, lead, color, bold))
file = out / 'sample-plan.pdf'
c = canvas.Canvas(str(file), pagesize=A4)
c.setTitle(data['title'])
c.setAuthor('sample-d2ef7e59')

def draw(flow, y, after=7):
    aw, ah = flow.wrap(CW, H)
    if y - ah < 44:
        raise RuntimeError(f'page {page_no} overflow at {y - ah:.1f} with {getattr(flow, 'text', '')[:30]}')
    flow.drawOn(c, X, y - ah)
    return y - ah - after

def banner(label, text):
    tb = Table([[p(label + '  ' + text, 10.1, 14.2, teal)]], colWidths=[CW])
    tb.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E9F4F2')), ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8), ('LINEBEFORE', (0, 0), (0, -1), 3, teal)]))
    return tb
for page_no, page in enumerate(data['pages'], 1):
    c.setFillColor(teal)
    c.rect(X, H - 30, 25, 3, fill=1, stroke=0)
    c.setFillColor(gray)
    c.setFont('YaHei', 8)
    c.drawString(X + 33, H - 31, data.get('header', 'Material tooling | synthetic input'))
    c.setStrokeColor(colors.HexColor('#B5CED0'))
    c.line(X, 35, W - X, 35)
    c.setFont('YaHei', 8)
    c.drawString(X, 22, data.get('footer', 'Synthetic example - no original event date'))
    c.drawRightString(W - X, 22, f'{page_no} / 7')
    y = H - 55
    if page_no == 1:
        y = draw(p(data['title'], 20, 26, colors.black, True), y, 8)
        y = draw(p(data['subtitle'], 10.4, 15, teal), y, 5)
        y = draw(p(data['version'], 8.7, 12, gray), y, 13)
    y = draw(p(page['heading'], 17.5, 23, colors.black, True), y, 9)
    y = draw(p(page['lead'], 10.4, 15, teal), y, 11)
    for b in page['blocks']:
        if b['type'] == 'h2':
            y -= 3
            y = draw(p(b['text'], 11.5, 16, teal, True), y, 6)
        elif b['type'] == 'p':
            size = 9.55 if page_no == 7 else 10.1
            lead = 13.1 if page_no == 7 else 14.0
            text = ('<b>' + escape(clean(b['label'])) + '</b>' if b.get('label') else '') + escape(clean(b['text']))
            y = draw(Paragraph(text, style(size, lead)), y, 6)
        elif b['type'] == 'table':
            size = 8.75 if page_no == 7 else 9.4
            lead = 11.7 if page_no == 7 else 12.8
            rr = [[p(t, size, lead, colors.white, True) for t in b['headers']]] + [[p(t, size, lead) for t in row] for row in b['rows']]
            widths = [CW * v / 100 for v in b['widths']]
            t = Table(rr, colWidths=widths, hAlign='LEFT')
            cmds = [('BACKGROUND', (0, 0), (-1, 0), navy), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5), ('GRID', (0, 0), (-1, -1), 0.35, colors.HexColor('#D5E0E4'))]
            for r in range(1, len(rr)):
                if r % 2 == 0:
                    cmds.append(('BACKGROUND', (0, r), (-1, r), colors.HexColor('#F1F6F7')))
            t.setStyle(TableStyle(cmds))
            y = draw(t, y, 9)
        elif b['type'] == 'callout':
            y = draw(banner(b['label'], b['text']), y, 8)
        elif b['type'] == 'small':
            y = draw(p(b['text'], 7.8, 10.7, gray), y, 5)
        elif b['type'] == 'source':
            text = f'<link href="{escape(b['url'])}" color="#006E72">{escape(b['label'])}</link>: {escape(b['text'])}'
            y = draw(Paragraph(text, style(7.4, 10, gray)), y, 3)
    print('page', page_no, 'bottom', round(y, 1))
    c.showPage()
c.save()
print(file)
