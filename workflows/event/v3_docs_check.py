# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import json, sys, subprocess, shutil
from pypdf import PdfReader
from PIL import Image
sys.stdout.reconfigure(encoding='utf8')
V = Path(runtime.workspace() / 'output/DemoCampussample-8fbc8444_V3')
O = V / 'V3_sample-846f8c41_20261016'
R = V / 'sample-22298da3'
q = R / 'sample-790abf39'
q.mkdir(exist_ok=True)

class Links(HTMLParser):

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ['src', 'href']:
                self.links.append(v)
p = Links()
p.feed((O / '00_V3sample-be8e4e25.html').read_text('utf8'))
missing = [x for x in p.links if not urlsplit(x).scheme and (not (O / unquote(x)).exists())]
assert not missing, missing
for f in (O / '08_sample-2a649a44').glob('*.png'):
    assert Image.open(f).size == (1920, 1080)
docs = []
for name in ['sample-7d7573a6.pdf', 'V3Allsample-92321aa8.pdf', 'GUIDE01_sample-dd6eb38f.pdf']:
    pdf = O / '00_sample-7a40a511' / name
    rd = PdfReader(pdf)
    docs.append({'file': name, 'pages': len(rd.pages), 'page_text_lengths': [len(p.extract_text() or '') for p in rd.pages]})
    if name != 'V3Allsample-92321aa8.pdf':
        r = subprocess.run([shutil.which('pdftoppm'), '-png', '-scale-to', '1100', str(pdf), str(q / name.replace('.pdf', ''))], capture_output=True)
        assert not r.returncode, r.stderr
    else:
        for n in [1, 16, 26]:
            r = subprocess.run([shutil.which('pdftoppm'), '-png', '-singlefile', '-f', str(n), '-l', str(n), '-scale-to', '1400', str(pdf), str(q / f'sample-a33db573_{n:02d}')], capture_output=True)
            assert not r.returncode, r.stderr
j = {'HTML_links_checked': len(p.links), 'missing_links': missing, 'screens': '2 × 1920×1080', 'documents': docs}
(R / 'sample-86248ab2.json').write_text(json.dumps(j, ensure_ascii=False, indent=2), encoding='utf8')
print(j)
