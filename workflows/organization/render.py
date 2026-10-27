# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=True)
from pathlib import Path
import win32com.client
import pymupdf as fitz
from PIL import Image, ImageDraw
root = runtime.workspace()
p = root / 'DemoCampusDemoClubsample-6c431feb_sample-a90227cb.docx'
app = win32com.client.DispatchEx('Word.Application')
app.Visible = False
app.DisplayAlerts = 0
try:
    d = app.Documents.Open(str(p), ReadOnly=True, AddToRecentFiles=False)
    d.Repaginate()
    print('Pages:', d.ComputeStatistics(2), flush=True)
    d.ExportAsFixedFormat(str(p.with_suffix('.pdf')), 17)
    d.Close(False)
finally:
    app.Quit()
doc = fitz.open(p.with_suffix('.pdf'))
thumbs = []
for i, page in enumerate(doc):
    txt = page.get_text()
    print(i + 1, len(txt), txt[-75:].replace('\n', ' '))
    pix = page.get_pixmap(matrix=fitz.Matrix(0.8, 0.8))
    im = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
    thumbs.append(im)
    page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(root / 'sample-bb0b760a' / f'page-{i + 1:02d}.png')
cols = 3
rows = (len(thumbs) + cols - 1) // cols
cw, ch = (thumbs[0].width, thumbs[0].height)
canvas = Image.new('RGB', (cw * cols, (ch + 25) * rows), '#cfd5d9')
dr = ImageDraw.Draw(canvas)
for i, im in enumerate(thumbs):
    x = i % cols * cw
    y = i // cols * (ch + 25)
    canvas.paste(im, (x, y))
    dr.text((x + 8, y + ch + 3), str(i + 1), fill='black')
canvas.save(root / 'sample-bb0b760a/contact.png')
