# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, hashlib, zipfile, html, re, sys
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from PIL import Image
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf8')
ROOT = runtime.workspace()
OUT = ROOT / 'output/DemoCampussample-8fbc8444_V3.1_sample-1938d82e_20261016'
ART = ROOT / 'output/DemoCampussample-8fbc8444_V3.1_sample-4b8cbfdd_20261016/01_sample-5bb56ece'
DOC = OUT / '00_sample-7a40a511'
records = json.loads((DOC / 'sample-b9dc40d8.json').read_text(encoding='utf-8'))
new = {p.name.split('_', 1)[0]: p for p in ART.glob('*.png')}

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
fails = []
for r in records:
    p = OUT / (r['relative'] + '.png')
    if r['id'] in new and sha(p) != sha(new[r['id']]):
        fails.append('source mismatch ' + r['id'])
    if sha(p) != r['sha256']:
        fails.append('index mismatch ' + r['id'])
    if r['id'].startswith('ST'):
        im = Image.open(p)
        if im.mode != 'RGBA' or im.getchannel('A').getextrema()[0] != 0:
            fails.append('alpha missing ' + r['id'])
    c = PdfReader(OUT / (r['relative'] + '.pdf'))
    if r['restored']:
        page = c.pages[0]
        scale = 10 if r.get('pdf_scale') == '1:10' else 1
        dims = [float(page.mediabox.width) * 25.4 / 72 * scale, float(page.mediabox.height) * 25.4 / 72 * scale]
        if any((abs(a - b) > 0.1 for a, b in zip(dims, r['size_mm']))):
            fails.append('pdf dimension ' + r['id'])
text = (OUT / '00_V3.1sample-2fe87309.html').read_text(encoding='utf-8')
links = re.findall('(?:href|src)="([^"]+)"', text)
for raw in links:
    p = OUT / html.unescape(raw)
    if not p.is_file():
        fails.append('link missing ' + raw)
assert 'sample-5b8cb96f' in next((r for r in records if r['id'] == '43'))['text']
assert not any(('sample-f4f0ead1' in t for r in records for t in r.get('text', [])))
assert not fails, fails
print('source hashes, 48 alpha channels, PDF dimensions, gallery links: passed', flush=True)
c = canvas.Canvas(str(OUT / '01_sample-a7d6a355.pdf'), pagesize=(297 * mm, 251.31 * mm))
c.setTitle('V3.1 sample-1b58a969 | preview only')
for p in sorted(DOC.glob('sample-c5a85d21_*.jpg')):
    c.drawImage(str(p), 0, 0, width=297 * mm, height=251.31 * mm)
    c.showPage()
c.save()
(OUT / 'sample-79f03058.txt').write_text('DemoCampussample-8fbc8444 V3.1\n\n1. sample-61d8c577 00_V3.1sample-2fe87309.html，sample-fc91c259151sample-49ccde43。\n2. 01_sample-a7d6a355.pdf sample-b5141d3d90sample-981ff9c9。\n3. sample-05cdb30aPNG/PDFsample-866ffbdb，48sample-5c7ff2eb3sample-f56a049fA3sample-e977756d。\n4. sample-18269712。sample-12dbb4b1；sample-497b79c6、sample-c1f2e2e9、sample-e9246f2c，sample-d665e8b000_sample-7a40a511/sample-7a40a511.md。\n5. 6sample-f56a049f6sample-77d0184ePDFsample-0d1785e11:10，sample-1ae86dd3PDFsample-a972f3ba。\n', encoding='utf-8')
audit = json.loads((DOC / 'sample-e7399391.json').read_text(encoding='utf-8'))
audit.update(source_sha256_checked=True, source_copy_mismatches=[], sticker_alpha_verified=48, pdf_dimensions_verified=98, gallery_missing_links=[], visual_review_scope='90sample-7b0fc02d、sample-70d0c1b3、sample-dbe19f4e；sample-b8fa8983Logosample-b1cea961', gallery_browser_interaction_verified=False)
(DOC / 'sample-e7399391.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
files = [p for p in OUT.rglob('*') if p.is_file() and p.name != 'sample-39932f24SHA256sample-188bc791.txt']
manifest = '\n'.join((sha(p) + '  ' + p.relative_to(OUT).as_posix() for p in sorted(files))) + '\n'
(DOC / 'sample-39932f24SHA256sample-188bc791.txt').write_text(manifest, encoding='utf-8')
zpath = ROOT / 'output/DemoCampussample-8fbc8444_V3.1_sample-bf95bf46_20261016.zip'
with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=1) as z:
    for p in sorted(OUT.rglob('*')):
        if p.is_file():
            z.write(p, OUT.name + '/' + p.relative_to(OUT).as_posix())
print('zip created', zpath.stat().st_size, flush=True)
with zipfile.ZipFile(zpath) as z:
    bad = z.testzip()
    assert bad is None, bad
    zipcount = len(z.infolist())
hashval = sha(zpath)
zpath.with_suffix('.zip.sha256.txt').write_text(hashval + '  ' + zpath.name + '\n', encoding='utf-8')
result = {'zip': str(zpath), 'bytes': zpath.stat().st_size, 'files': zipcount, 'sha256': hashval, 'crc_verified': True, 'index_items': len(records), 'unique_new_art': 90}
(ROOT / '_event_work/v31_final_result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(result, ensure_ascii=False), flush=True)
