# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.parse import unquote, urlsplit
import sys, json, hashlib, xml.etree.ElementTree as E
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, runtime.tool_path('docx-tools'))
from validators import DOCXSchemaValidator
from pack import pack
root = Path(runtime.workspace() / 'output/DemoCampussample-f1811f58_V1')
unpacked = Path(runtime.workspace() / '_event_work/visual_docx/unpacked')
source = root / 'sample-c0e8892d_sample-70e372ab.docx'
doc = root / 'DemoEvent_sample-f8135f18_sample-90a1cb9aV1.docx'

class ExternalAwareValidator(DOCXSchemaValidator):

    def validate_file_references(self):
        count = 0
        for f in self.unpacked_dir.rglob('*.rels'):
            for rel in E.parse(f).getroot():
                t = rel.get('Target', '')
                if rel.get('TargetMode') == 'External':
                    if rel.get('Id', '').startswith('rIdVisualRef'):
                        dest = (root / unquote(t)).resolve()
                        assert dest.is_relative_to(root.resolve()) and dest.is_file(), t
                        count += 1
                    continue
                base = self.unpacked_dir if f.name == '.rels' else f.parent.parent
                target = self.unpacked_dir / t.lstrip('/') if t.startswith('/') else base / unquote(t)
                assert target.resolve().is_file(), str(target)
        print('Relative external links verified:', count)
        return True
v = ExternalAwareValidator(unpacked, source)
assert v.validate(), 'DOCX structural validation failed'
_, message = pack(str(unpacked), str(doc), str(source), validate=False)
print(message)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def paragraphs(file):
    with ZipFile(file) as z:
        xml = E.fromstring(z.read('word/document.xml'))
        return ([''.join((t.text or '' for t in p.findall('.//w:t', ns))) for p in xml.findall('.//w:p', ns)], len(xml.findall('.//w:drawing', ns)))
old, _ = paragraphs(source)
new, drawings = paragraphs(doc)
j = 0
for s in new:
    if j < len(old) and s == old[j]:
        j += 1
assert j == len(old), 'Source paragraph content changed'
assert drawings == 0
with ZipFile(doc) as z:
    assert not [n for n in z.namelist() if n.startswith('word/media/')]
    assert z.testzip() is None
print('Original paragraphs retained', j, '; embedded images', drawings, '; DOCX bytes', doc.stat().st_size)
items = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
assert len(items) == 51 and all(((root / x['file']).is_file() for x in items))
readme = 'DemoEvent｜sample-40085c98 V1\nsample-b58f9a9d: 2026sample-62ef900a10sample-1625179b12sample-85217f7a\n\nsample-a6d0fc6c\n1. sample-06aec1dc，sample-f75f9c83。\n2. sample-26d7c24f“00_sample-44525d5b.html”sample-a8c81f93All51sample-49ccde43；sample-20d40671，sample-025a166d。\n3. Wordsample-ba21a10c，sample-c5818728，sample-9b02ab5104/05sample-e1a28564，sample-b9ec5481。\n4. sample-05cdb30aPNGsample-12404a0bimagessample-7c7802d8，sample-d1bc24f6Word、sample-a1b9deaa。\n5. sample-3e0969f8.mdsample-37774a0751sample-49ccde43；promptssample-2c45da83imagegensample-c4f7be49；logossample-df567456logo。\n\nsample-a786f28a\nsample-e54d2ae913sample-49ccde43、sample-fced2ed03sample-39d567f3、sample-9b1eae1f3sample-f2ee5808、KTsample-7483f8ec6sample-f2ee5808、sample-b3f690173sample-49ccde43、sample-14956abe3sample-49ccde43、sample-6dbbdd9e13sample-49ccde43、sample-be24524d2sample-f2ee5808、sample-c70b8d503sample-f2ee5808、sample-a9b1f1472sample-49ccde43，sample-76e547a851sample-49ccde43。\nsample-f649fa4d。sample-c7ea7ebd、sample-9b1cd366、sample-7f501d44，sample-5f4f58f8；sample-35188776。sample-068b013c、sample-497b79c6、sample-3b586258logosample-acfc7a40。\nsample-8cb7c0a5Wordsample-f0030f8f。sample-c3ff58aa，sample-32cc9bdd，sample-b8da2a84。\n'
(root / 'sample-cb4ba40b.txt').write_text(readme, encoding='utf-8-sig')
(root / 'sample-b341b84a.md').write_text('# sample-f28461bb\n\n51/51sample-05cdb30aPNGsample-3016130d。Wordsample-2c96d90e，sample-eb896e3b，sample-28ec6eb7。sample-a33db573HTML、sample-4b47dbae、logosample-909f172d。\n', encoding='utf-8')
verification = {'images': 51, 'original_paragraphs_retained': j, 'word_embedded_images': 0, 'word_bytes': doc.stat().st_size, 'relative_links_verified': 54, 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'word_sha256': hashlib.sha256(doc.read_bytes()).hexdigest()}
(root / 'sample-c976ebfe.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2), encoding='utf-8')
archive = root.parent / 'DemoEvent_sample-40085c98V1_51sample-49ccde43_20261012.zip'
package_root = 'DemoEvent_sample-40085c98V1_20261012'
files = [doc, root / '00_sample-44525d5b.html', root / 'sample-3e0969f8.md', root / 'sample-cb4ba40b.txt', root / 'manifest.json', root / 'sample-c976ebfe.json']
files += sorted((root / 'images').glob('*.png')) + sorted((root / 'prompts').glob('*.txt')) + sorted((root / 'logos').glob('*')) + sorted(root.glob('sample-a33db573_*.jpg'))
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=1) as z:
    for f in files:
        z.write(f, package_root + '/' + f.relative_to(root).as_posix())
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert len([n for n in z.namelist() if '/images/' in n and n.endswith('.png')]) == 51
print('ZIP verified:', archive, 'MB', round(archive.stat().st_size / 1024 ** 2, 1))
