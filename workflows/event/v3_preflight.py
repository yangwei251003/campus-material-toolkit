# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import sys, json, hashlib, re, math, subprocess, shutil, concurrent.futures, xml.etree.ElementTree as ET, base64, io
import numpy as np, cv2
from PIL import Image
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf8')
ROOT = Path(runtime.workspace())
V = ROOT / 'output/DemoCampussample-8fbc8444_V3'
OUT = V / 'V3_sample-846f8c41_20261016'
REC = V / 'sample-22298da3'
records = []
geometries = []
for f in ['sample-8deba3b0.json', 'sample-82349c7f.json', 'sample-58ae6943.json']:
    j = json.loads((REC / f).read_text('utf8'))
    records += j['records']
    geometries += j.get('geometries', [])
errors = []
rows = []
photos = []

def mat(s):
    a = np.eye(3)
    for op, nums in re.findall('(translate|rotate|scale|skewX|matrix)\\(([^)]*)\\)', s or ''):
        n = [float(v) for v in re.split('[ ,]+', nums.strip()) if v]
        b = np.eye(3)
        if op == 'translate':
            b[:2, 2] = [n[0], n[1] if len(n) > 1 else 0]
        elif op == 'scale':
            b[0, 0] = n[0]
            b[1, 1] = n[-1]
        elif op == 'rotate':
            r = math.radians(n[0])
            b[:2, :2] = [[math.cos(r), -math.sin(r)], [math.sin(r), math.cos(r)]]
        elif op == 'skewX':
            b[0, 1] = math.tan(math.radians(n[0]))
        elif op == 'matrix':
            b = np.array([[n[0], n[2], n[4]], [n[1], n[3], n[5]], [0, 0, 1]])
        a = a @ b
    return a
source = Image.open(REC / 'sample-a61c86f2_R2sample-9af69965/sample-dca037f7_sample-cd2d576f.png')
alpha = np.array(source.getchannel('A'))
contours, _ = cv2.findContours((alpha > 32).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
pts = np.concatenate([c.reshape(-1, 2) for c in contours if len(c) > 5])
pts = np.c_[pts, np.ones(len(pts))]
for r in records:
    p = OUT / r['relative']
    png = p.with_suffix('.png')
    svg = p.with_suffix('.svg')
    pdf = p.with_suffix('.pdf')
    checks = []
    for f in [png, svg, pdf]:
        if not f.exists():
            errors.append(f'Missing {f}')
    im = Image.open(png)
    im.verify()
    im = Image.open(png)
    if list(im.size) != r['pixels']:
        errors.append(f'pixel size {r['id']}')
    if hashlib.sha256(png.read_bytes()).hexdigest() != r['sha256']:
        errors.append(f'PNG changed without matching manifest: {r['id']}')
    extrema = im.getchannel('A').getextrema() if im.mode == 'RGBA' else (255, 255)
    if r['transparent'] and extrema[0] != 0 and (r['id'] != '26C'):
        errors.append(f'No true transparency {r['id']}')
    raw = svg.read_text('utf8')
    root = ET.fromstring(raw)
    vb = list(map(float, root.attrib['viewBox'].split()))
    W, H = vb[2:]
    for word in ['sample-a61eec24', 'sample-acd23e57', 'sample-1eb2bf07', 'sample-9955f2af', 'sample-680f883b', 'sample-fb90fb3d', 'sample-e27427c9']:
        if word in raw:
            errors.append(f'Internal copy {r['id']}: {word}')
    if '<text' in raw:
        errors.append(f'Unoutlined font {r['id']}')
    pg = PdfReader(pdf).pages[0]
    unit = float(pg.get('/UserUnit', 1))
    trim = pg.trimbox
    actual = [float(trim.width) * unit * 25.4 / 72, float(trim.height) * unit * 25.4 / 72]
    if any((abs(a - b) > 0.15 for a, b in zip(actual, r['size_mm']))):
        errors.append(f'PDF trim size {r['id']} {actual}')
    if not pg.get_contents().get_data():
        errors.append(f'empty PDF {r['id']}')
    mmUnit = min(r['size_mm'][0] / W, r['size_mm'][1] / H)

    def walk(e, acc):
        acc = acc @ mat(e.get('transform'))
        if e.get('data-aircraft'):
            m = acc
            sing = np.linalg.svd(m[:2, :2])[1]
            if abs(sing[0] - sing[1]) > 1e-05:
                errors.append(f'Aircraft deformed {r['id']}')
            pp = (m @ pts.T).T
            if pp[:, 0].min() < -0.5 or pp[:, 1].min() < -0.5 or pp[:, 0].max() > W + 0.5 or (pp[:, 1].max() > H + 0.5):
                errors.append(f'Aircraft canvas clipping {r['id']}: {pp.min(axis=0)} {pp.max(axis=0)}')
        if e.tag.endswith('image'):
            href = e.get('href') or e.get('{http://www.w3.org/1999/xlink}href', '')
            if href.startswith('data:image'):
                b = base64.b64decode(href.split(',', 1)[1])
                ii = Image.open(io.BytesIO(b))
                sw, sh = ii.size
                fit = min(float(e.get('width')) / sw, float(e.get('height')) / sh)
                sv = np.linalg.svd(acc[:2, :2])[1].max()
                ppi = 25.4 / (fit * mmUnit * sv)
                photos.append({'id': r['id'], 'name': r['name'], 'source_pixels': [sw, sh], 'effective_ppi': round(ppi, 1), 'whole_real_aircraft': (sw, sh) == source.size})
        for c in e:
            walk(c, acc)
    walk(root, np.eye(3))
    rows.append({'id': r['id'], 'name': r['name'], 'size_mm': actual, 'alpha_min': extrema[0], 'alpha_max': extrema[1], 'cut_path': r['cut'], 'bleed_mm': r['bleed_mm'], 'pdf_pages': 1, 'pending': r['pending']})
ids = {r['id'] for r in records}
assert {f'ST{i:02d}' for i in range(1, 49)} <= ids
assert {f'KT{i:02d}' for i in range(1, 13)} <= ids
assert {'F' + i for i in ['01', '02', '05', '06', '07', '14', '15', '16']} <= ids and {'F26A', 'F26B'} <= ids
assert len(records) == 151, len(records)
rule = (OUT / '01_sample-58593538/43_sample-f2783946.svg').read_text('utf8')
assert 'sample-5b8cb96f' in rule
result = {'date': '2026-10-16', 'artwork_components': len(records), 'standard_components': sum((not r['pending'] for r in records)), 'gate_reference_components': sum((r['pending'] for r in records)), 'errors': errors, 'checks': rows, 'raster_physical_resolution': photos, 'aircraft_transform_instances': len(geometries)}
(REC / 'V3sample-250b556e.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
print('Preflight', len(records), 'errors', len(errors))
[print(e) for e in errors]
if '--render-pdf' in sys.argv:
    dest = REC / 'PDFsample-0dee1bee'
    dest.mkdir(exist_ok=True)
    exe = shutil.which('pdftoppm')

    def render(pair):
        i, r = pair
        p = OUT / (r['relative'] + '.pdf')
        out = dest / f'{i:03d}_{r['id']}'
        run = subprocess.run([exe, '-png', '-singlefile', '-scale-to', '900', '-cropbox', str(p), str(out)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return {'id': r['id'], 'returncode': run.returncode, 'file': str(out.with_suffix('.png')), 'error': run.stderr.decode('utf8', errors='replace')[-1000:]}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        renders = list(pool.map(render, enumerate(records)))
    (REC / 'PDFsample-fbd80b89.json').write_text(json.dumps(renders, ensure_ascii=False, indent=2), encoding='utf8')
    print('PDF renders', len(renders), 'failures', sum((r['returncode'] != 0 for r in renders)))
sys.exit(bool(errors))
