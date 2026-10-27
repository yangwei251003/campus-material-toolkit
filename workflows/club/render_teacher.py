# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=True)
from pathlib import Path
import win32com.client, fitz, json
root = runtime.workspace() / 'output' / 'DemoClubsample-27a3de06'
docx = root / 'DemoClub_sample-6ddf9101_sample-4ba52f36.docx'
pdf = docx.with_suffix('.pdf')
app = win32com.client.DispatchEx('Word.Application')
app.Visible = False
app.DisplayAlerts = 0
try:
    doc = app.Documents.Open(str(docx), ReadOnly=True, AddToRecentFiles=False)
    doc.Repaginate()
    print('Word pages:', doc.ComputeStatistics(2), flush=True)
    doc.ExportAsFixedFormat(str(pdf), 17)
    doc.Close(False)
finally:
    app.Quit()
d = fitz.open(pdf)
stats = []
for i, page in enumerate(d):
    page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3)).save(str(Path(__file__).parent / f'teacher-page-{i + 1:02}.png'))
    txt = page.get_text()
    stats.append({'page': i + 1, 'chars': len(txt), 'start': txt[:110], 'end': txt[-140:]})
(Path(__file__).parent / 'teacher-page-check.json').write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding='utf-8')
print('PDF pages:', len(d), 'links:', sum((len(p.get_links()) for p in d)))
print(json.dumps(stats, ensure_ascii=False, indent=2))
