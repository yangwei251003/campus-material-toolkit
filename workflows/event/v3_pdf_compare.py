# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, io, sys
from PIL import Image
import numpy as np, cv2
sys.stdout.reconfigure(encoding='utf8')
V = Path(runtime.workspace() / 'output/DemoCampussample-8fbc8444_V3')
O = V / 'V3_sample-846f8c41_20261016'
R = V / 'sample-22298da3'
rows = []
for f in ['sample-8deba3b0.json', 'sample-82349c7f.json', 'sample-58ae6943.json']:
    rows += json.loads((R / f).read_text('utf8'))['records']
checks = []
for i, r in enumerate(rows):
    p = Image.open(R / 'PDFsample-0dee1bee' / f'{i:03d}_{r['id']}.png').convert('RGB')
    w, h = p.size
    b = r['bleed_mm']
    mw, mh = r['size_mm']
    dx = w * b / (mw + 2 * b)
    dy = h * b / (mh + 2 * b)
    p = p.crop((round(dx), round(dy), round(w - dx), round(h - dy))).resize((420, 420))
    a = Image.open(O / (r['relative'] + '.png')).convert('RGBA')
    base = Image.new('RGBA', a.size, 'white')
    base.alpha_composite(a)
    a = base.convert('RGB').resize((420, 420))
    aa = np.asarray(a, dtype=float)
    bb = np.asarray(p, dtype=float)
    diff = np.abs(aa - bb)
    large = (diff.mean(axis=2) > 40).mean()
    mae = diff.mean()
    checks.append({'id': r['id'], 'mean_abs_rgb_error': round(mae, 3), 'large_difference_fraction': round(large, 5)})
(R / 'PDFsample-de1d5dd0PNGsample-b4013cc4.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2), encoding='utf8')
print('Compared', len(checks), 'pairs')
print(sorted(checks, key=lambda x: x['large_difference_fraction'], reverse=True)[:12])
