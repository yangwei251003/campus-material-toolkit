# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, html, sys, hashlib
from PIL import Image, ImageDraw, ImageFont
sys.stdout.reconfigure(encoding='utf-8')
r = runtime.workspace() / 'output/catalog'
a = json.loads((r / 'manifest.json').read_text(encoding='utf-8'))
groups = list(dict.fromkeys((x['group'] for x in a)))
cards = []
for x in a:
    f = r / x.get('file', 'missing')
    if not f.is_file():
        continue
    im = Image.open(f)
    im.verify()
    im = Image.open(f)
    x['pixels'] = list(im.size)
    x['sha256'] = hashlib.sha256(f.read_bytes()).hexdigest()
    cards.append(f'<figure data-group="{html.escape(x['group'])}"><a href="{html.escape(x['file'])}" target="_blank"><img loading="lazy" src="{html.escape(x['file'])}" alt="{html.escape(x['name'])}"></a><figcaption><span>{x['id']} · {html.escape(x['group'])}</span><b>{html.escape(x['name'])}</b><small>{im.width} × {im.height} px · V1</small></figcaption></figure>')
(r / 'manifest.json').write_text(json.dumps(a, ensure_ascii=False, indent=2), encoding='utf-8')
filters = '<button class="active" data-group="All">All</button>' + ''.join((f'<button data-group="{html.escape(g)}">{html.escape(g)}</button>' for g in groups))
doc = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic material preview</title><style>\n*{box-sizing:border-box}body{margin:0;background:#f1f5f4;color:#102c43;font-family:"Microsoft YaHei",sans-serif}header{padding:42px 5vw;background:#102c43;color:#fff;border-bottom:6px solid #25a66a}h1{margin:8px 0;font-size:30px}header p{max-width:900px;line-height:1.8;color:#dce9e3}header small{color:#f6e67d}.filters{padding:20px 5vw;position:sticky;top:0;background:#f1f5f4eF;backdrop-filter:blur(10px);display:flex;flex-wrap:wrap;gap:8px;z-index:2}button{border:1px solid #bdd2ce;background:#fff;border-radius:20px;padding:9px 15px;color:#102c43;cursor:pointer}button.active{background:#006e72;color:white;border-color:#006e72}main{padding:0 5vw 50px;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}figure{margin:0;background:white;border:1px solid #dbe5e2;border-radius:12px;overflow:hidden}figure img{width:100%;height:310px;object-fit:contain;background:#e8efec;display:block}figcaption{padding:16px}figcaption span{font-size:12px;color:#006e72}figcaption b{display:block;margin:8px 0;font-size:16px}figcaption small{color:#77878c}footer{padding:25px 5vw;color:#667b82;font-size:13px}a{color:inherit}[hidden]{display:none!important}\n</style><header><small>FPV RACING / FIRST VISUAL CONCEPT</small><h1>Synthetic material toolkit preview</h1><p>Independent synthetic fixtures. No original logo, photograph, QR, personal or business copy is included.</p><p>sample-5f4f58f8；sample-7a92b5dc、sample-80c52260。sample-15a719f1，sample-3897f01b；sample-fbd9fbb9，sample-2cb8dc6f、sample-55fb54dblogosample-acfc7a40。</p></header><nav class="filters">FILTERS</nav><main>CARDS</main><footer>sample-89526ccdWordsample-354b28c8。sample-4fb35a1eimagegensample-1ad1463f，sample-a6fe77adpromptssample-52daa71e。</footer><script>document.querySelectorAll(\'button\').forEach(b=>b.onclick=()=>{document.querySelectorAll(\'button\').forEach(x=>x.classList.remove(\'active\'));b.classList.add(\'active\');document.querySelectorAll(\'figure\').forEach(f=>f.hidden=b.dataset.group!==\'All\'&&f.dataset.group!==b.dataset.group)});</script></html>'.replace('FILTERS', filters).replace('CARDS', ''.join(cards))
(r / '00_sample-44525d5b.html').write_text(doc, encoding='utf-8')
font = ImageFont.load_default(size=20)
valid = [x for x in a if x.get('file')]
for start in range(0, len(valid), 12):
    batch = valid[start:start + 12]
    sheet = Image.new('RGB', (1600, 1800), '#e9efec')
    draw = ImageDraw.Draw(sheet)
    for k, x in enumerate(batch):
        im = Image.open(r / x['file']).convert('RGB')
        im.thumbnail((360, 500))
        xx = k % 4 * 400 + 20
        yy = k // 4 * 600 + 20
        sheet.paste(im, (xx + (360 - im.width) // 2, yy))
        draw.text((xx, yy + 505), x['id'] + ' ' + x['name'], font=font, fill='#102c43')
    sheet.save(r / f'sample-a33db573_{start // 12 + 1:02d}.jpg', quality=90)
print('Catalog images verified', len(valid))
