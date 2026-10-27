# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, zipfile, html
from PIL import Image
base = runtime.workspace() / 'club'
root = runtime.workspace() / 'output/posters'
out = root / 'posters'
items = json.loads((base / 'poster_manifest.json').read_text(encoding='utf-8'))
assert len(items) == 16
cards = []
for item in items:
    file = out / (item['name'] + '.png')
    with Image.open(file) as im:
        im.verify()
    with Image.open(file) as im:
        print(item['name'], im.size)
    cards.append(f'<article><a href="posters/{html.escape(file.name)}" target="_blank"><img loading="lazy" src="posters/{html.escape(file.name)}" alt="{html.escape(item['name'])}"></a><p>{html.escape(item['name'].replace('_', ' · '))}</p></article>')
page = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic material preview</title><style>body{margin:0;background:#edf0f4;color:#192839;font:16px "Microsoft YaHei",sans-serif}header{padding:40px 4vw 24px}h1{font-size:30px;margin:0 0 12px}header p{line-height:1.8;color:#526173}main{padding:0 4vw 40px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}article{background:white;border-radius:12px;overflow:hidden;box-shadow:0 5px 22px #172b4010}img{display:block;width:100%;height:auto}article p{padding:0 16px;font-size:14px}a:focus{outline:3px solid #247bd5}@media(max-width:900px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){main{grid-template-columns:1fr}}</style><header><h1>Synthetic material toolkit preview</h1><p>Independent synthetic fixtures. No original logo, photograph, QR, personal or business copy is included.</p></header><main>' + ''.join(cards) + '</main></html>'
(root / 'index.html').write_text(page, encoding='utf-8')
readme = 'Synthetic geometric fixture delivery. 16 images. No original brand, logo, student, QR, photograph or business copy is included.\n'
(root / 'README.txt').write_text(readme, encoding='utf-8')
with zipfile.ZipFile(root / 'posters.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for item in items:
        file = out / (item['name'] + '.png')
        z.write(file, file.relative_to(root))
    for name in ['index.html', 'README.txt', 'prompts.json']:
        z.write(root / name, name)
with zipfile.ZipFile(root / 'posters.zip') as z:
    assert len([n for n in z.namelist() if n.endswith('.png')]) == 16
    assert z.testzip() is None
print('Verified: 16 PNG images and ZIP package')
