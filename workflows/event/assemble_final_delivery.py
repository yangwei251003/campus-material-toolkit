# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from urllib.parse import unquote, urlsplit
from PIL import Image, ImageDraw, ImageFont
import json, hashlib, html, re, sys
sys.stdout.reconfigure(encoding='utf-8')
base = Path(runtime.workspace())
out = base / 'output'
visual = out / 'DemoCampussample-316dd056_V2_sample-f061e205'
plan = out / 'DemoCampussample-34147a2e'
images_dir = visual / 'images'
manifest_path = visual / 'manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
assert len(manifest) == 51, f'Expected 51 manifest entries, got {len(manifest)}'
assert len(list(images_dir.glob('*.png'))) == 51, 'Expected 51 independent PNGs'
for item in manifest:
    image_path = visual / item['file']
    assert image_path.is_file(), image_path
    with Image.open(image_path) as im:
        im.verify()
    with Image.open(image_path) as im:
        item['pixels'] = list(im.size)
    item['sha256'] = hashlib.sha256(image_path.read_bytes()).hexdigest()
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
groups = list(dict.fromkeys((x['group'] for x in manifest)))
cards = []
for item in manifest:
    image_path = visual / item['file']
    with Image.open(image_path) as im:
        width, height = im.size
    file_ref = html.escape(item['file'])
    name = html.escape(item['name'])
    group = html.escape(item['group'])
    cards.append(f'<figure data-group="{group}"><a href="{file_ref}" target="_blank"><img loading="lazy" src="{file_ref}" alt="{name}"></a><figcaption><span>{item['id']} · {group}</span><b>{name}</b><small>{width} × {height} px · V2sample-f061e205</small></figcaption></figure>')
filters = '<button class="active" data-group="All">All</button>' + ''.join((f'<button data-group="{html.escape(group)}">{html.escape(group)}</button>' for group in groups))
catalog = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Synthetic material preview</title><style>\n*{box-sizing:border-box}body{margin:0;background:#f1f5f4;color:#102c43;font-family:"Microsoft YaHei",sans-serif}header{padding:42px 5vw;background:#102c43;color:#fff;border-bottom:6px solid #25a66a}h1{margin:8px 0;font-size:30px}header p{max-width:900px;line-height:1.8;color:#dce9e3}header small{color:#f6e67d}.filters{padding:20px 5vw;position:sticky;top:0;background:#f1f5f4ef;backdrop-filter:blur(10px);display:flex;flex-wrap:wrap;gap:8px;z-index:2}button{border:1px solid #bdd2ce;background:#fff;border-radius:20px;padding:9px 15px;color:#102c43;cursor:pointer}button.active{background:#006e72;color:white;border-color:#006e72}main{padding:0 5vw 50px;display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}figure{margin:0;background:white;border:1px solid #dbe5e2;border-radius:12px;overflow:hidden}figure img{width:100%;height:310px;object-fit:contain;background:#e8efec;display:block}figcaption{padding:16px}figcaption span{font-size:12px;color:#006e72}figcaption b{display:block;margin:8px 0;font-size:16px}figcaption small{color:#77878c}footer{padding:25px 5vw;color:#667b82;font-size:13px}a{color:inherit}[hidden]{display:none!important}\n</style><header><small>FPV RACING / V2 VISUAL REVISION</small><h1>Synthetic material toolkit preview</h1><p>Independent synthetic fixtures. No original logo, photograph, QR, personal or business copy is included.</p><p>sample-5f4f58f8；sample-7a92b5dc、sample-80c52260。sample-53763260，sample-8727e5ce；sample-fbd9fbb9，sample-2cb8dc6f、sample-55fb54dblogosample-acfc7a40。</p></header><nav class="filters">FILTERS</nav><main>CARDS</main><footer>sample-8cca4217Wordsample-3d711428PDF；sample-93ba580bWordsample-8560301d。sample-b1a765c8、sample-c209ba7cQAsample-39a1bcbe。</footer><script>document.querySelectorAll(\'button\').forEach(b=>b.onclick=()=>{document.querySelectorAll(\'button\').forEach(x=>x.classList.remove(\'active\'));b.classList.add(\'active\');document.querySelectorAll(\'figure\').forEach(f=>f.hidden=b.dataset.group!==\'All\'&&f.dataset.group!==b.dataset.group)});</script></html>'.replace('FILTERS', filters).replace('CARDS', ''.join(cards))
(visual / '00_sample-44525d5b.html').write_text(catalog, encoding='utf-8')
font = ImageFont.load_default(size=20)
for start in range(0, len(manifest), 12):
    batch = manifest[start:start + 12]
    sheet = Image.new('RGB', (1600, 1800), '#e9efec')
    draw = ImageDraw.Draw(sheet)
    for k, item in enumerate(batch):
        with Image.open(visual / item['file']) as src:
            im = src.convert('RGB')
        im.thumbnail((360, 500))
        x = k % 4 * 400 + 20
        y = k // 4 * 600 + 20
        sheet.paste(im, (x + (360 - im.width) // 2, y))
        draw.text((x, y + 505), f'{item['id']} {item['name']}', font=font, fill='#102c43')
    sheet.save(visual / f'sample-a33db573_{start // 12 + 1:02d}.jpg', quality=90)
ref_source = visual / 'DemoEvent_sample-f8135f18_sample-90a1cb9aV1.docx'
ref_v2 = visual / 'DemoEvent_sample-f8135f18_sample-90a1cb9aV2.docx'
replacements = {'sample-39ca9c08': 'sample-91527c3c', 'sample-21510cb6': 'sample-0d057799', 'sample-8e69aec4（V1）': 'sample-8e69aec4（V2）', 'sample-3df6928c': 'sample-8decdc6f'}
with ZipFile(ref_source, 'r') as zin, ZipFile(ref_v2, 'w', ZIP_DEFLATED) as zout:
    changed = 0
    for member in zin.infolist():
        data = zin.read(member.filename)
        if member.filename == 'word/document.xml':
            xml = data.decode('utf-8')
            for old, new in replacements.items():
                assert old in xml, f'Expected reference text missing: {old}'
                xml = xml.replace(old, new)
                changed += 1
            data = xml.encode('utf-8')
        zout.writestr(member, data)
assert changed == len(replacements)
source_doc = plan / 'DemoEvent_sample-f8135f18.docx'
source_pdf = plan / 'DemoEvent_sample-f8135f18_sample-f421a538.pdf'
assert source_doc.is_file() and source_pdf.is_file()
from xml.etree import ElementTree as ET
with ZipFile(ref_v2) as z:
    rels_name = 'word/_rels/document.xml.rels'
    rel_root = ET.fromstring(z.read(rels_name))
    refs = []
    for rel in rel_root:
        if rel.get('TargetMode') == 'External' and rel.get('Id', '').startswith('rIdVisualRef'):
            target = unquote(rel.get('Target', ''))
            assert not urlsplit(target).scheme, f'Expected relative reference: {target}'
            refs.append(target)
            assert (visual / target).is_file(), f'Broken Word reference: {target}'
    assert len(refs) == 54, f'Expected 54 relative links, got {len(refs)}'
    assert z.testzip() is None
notes = 'DemoEvent｜sample-01b0f3cb\nsample-b58f9a9d: 2026sample-62ef900a10sample-1625179b14sample-85217f7a\n\nsample-e3511d87\n01_sample-f8135f18: sample-f558463fWordsample-e80eddfePDFsample-f421a538。\n02_sample-40085c98V2sample-f061e205: sample-93ba580bWord、sample-d3dc3e4cHTMLsample-a33db573、51sample-508807bcPNG、sample-188bc791、sample-06d6920blogo、sample-f20e548c、sample-adc2795aQAsample-cba1ec75。\n\nsample-a6d0fc6c\n1. sample-06aec1dc，sample-f75f9c83。\n2. sample-c771248e02_sample-40085c98V2sample-f061e205/00_sample-44525d5b.html，sample-495ce45451sample-228e1b2d；sample-400f9ed5。\n3. sample-93ba580bWordsample-8560301d。sample-916b0430imagessample-7c7802d8、sample-a33db573HTMLsample-595378a4；sample-a688181f。\n4. 01_sample-7c6ca668Wordsample-f558463f、PDFsample-4811af90；sample-30672f41Wordsample-cb5d41f4。\n\nsample-2998d928\n51sample-fb38efa12026sample-62ef900a10sample-1625179b13sample-c953a8bd；sample-188bc791、sample-c08c3589、SHA-256sample-25ee8fa4。sample-70d0c1b3、sample-7a92b5dc、sample-9b1cd366、sample-6ad7ad3b。sample-5e7800f5、sample-497b79c6、sample-3b586258logo。\n'
(visual / 'sample-cb4ba40b.txt').write_text(notes, encoding='utf-8-sig')
(visual / 'sample-b341b84a.md').write_text('# sample-f28461bb\n\nsample-f8135f18Wordsample-de1d5dd0PDFsample-82395d42。51sample-49ccde43V2sample-6b4f4773；manifestsample-88de5b14SHA-256、HTMLsample-4fffb879。sample-93ba580bWordsample-30057a25、sample-9cedf70c54sample-0015c386。sample-9dad76a7。\n', encoding='utf-8')
verification = {'visual_version': 'V2sample-f061e205', 'visual_revision_date': '2026-10-13', 'images': len(manifest), 'catalog_cards': len(re.findall('<figure data-group=', catalog)), 'reference_word_relative_links': len(refs), 'reference_word_embedded_images': 0, 'reference_word_sha256': hashlib.sha256(ref_v2.read_bytes()).hexdigest(), 'plan_word_sha256': hashlib.sha256(source_doc.read_bytes()).hexdigest(), 'plan_pdf_sha256': hashlib.sha256(source_pdf.read_bytes()).hexdigest()}
(visual / 'sample-c976ebfe.json').write_text(json.dumps(verification, ensure_ascii=False, indent=2), encoding='utf-8')
archive = out / 'DemoEvent_sample-01b0f3cb_20261014.zip'
package_root = 'DemoEvent_sample-93266061_20261014'
readme = package_root + '/README.txt'
with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=1) as z:
    z.writestr(readme, notes.encode('utf-8-sig'))
    z.write(source_doc, package_root + '/01_sample-f8135f18/' + source_doc.name)
    z.write(source_pdf, package_root + '/01_sample-f8135f18/' + source_pdf.name)
    excluded = {ref_source.name, ref_v2.name}
    for f in sorted(visual.rglob('*')):
        if not f.is_file() or f.name in excluded:
            continue
        rel = f.relative_to(visual).as_posix()
        if rel.startswith('sample-f11274cb/') or rel.startswith('sample-da05253f/'):
            continue
        if re.fullmatch('sample-a33db573_\\d+\\.jpg', f.name):
            pass
        z.write(f, package_root + '/02_sample-40085c98V2sample-f061e205/' + rel)
    z.write(ref_v2, package_root + '/02_sample-40085c98V2sample-f061e205/' + ref_v2.name)
with ZipFile(archive, 'r') as z:
    assert z.testzip() is None, 'Archive CRC check failed'
    names = set(z.namelist())
    expected_images = [n for n in names if '/images/' in n and n.endswith('.png')]
    assert len(expected_images) == 51, f'Archive has {len(expected_images)} PNG images'
    assert any((n.endswith('_sample-f421a538.pdf') for n in names))
    assert any((n.endswith('_sample-f8135f18.docx') for n in names))
    ref_path = package_root + '/02_sample-40085c98V2sample-f061e205/' + ref_v2.name
    with ZipFile(__import__('io').BytesIO(z.read(ref_path))) as rz:
        rel_root = ET.fromstring(rz.read('word/_rels/document.xml.rels'))
        for rel in rel_root:
            if rel.get('TargetMode') == 'External' and rel.get('Id', '').startswith('rIdVisualRef'):
                target = unquote(rel.get('Target', ''))
                assert package_root + '/02_sample-40085c98V2sample-f061e205/' + target in names, target
print(json.dumps({'archive': str(archive), 'bytes': archive.stat().st_size, 'images': len(expected_images), 'catalog_cards': verification['catalog_cards'], 'reference_links': verification['reference_word_relative_links'], 'zip_entries': len(names)}, ensure_ascii=False, indent=2))
