# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import cv2, numpy as np, json
ROOT = runtime.workspace()
V = runtime.workspace() / 'vector-input'
A = runtime.workspace() / 'vector-output'

def contours(mask):
    cs, _ = cv2.findContours(mask.astype(np.uint8) * 255, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    ds = []
    for c in cs:
        if abs(cv2.contourArea(c)) < 3:
            continue
        c = cv2.approxPolyDP(c, 0.45, True).reshape(-1, 2)
        if len(c) < 3:
            continue
        ds.append('M' + 'L'.join((f'{x},{y}' for x, y in c)) + 'Z')
    return ''.join(ds)

def write(name, img, layers):
    h, w = img.shape[:2]
    paths = ''.join((f'<path fill="{color}" fill-rule="evenodd" d="{contours(mask)}"/>' for color, mask in layers))
    mask = np.logical_or.reduce([m for _, m in layers])
    ys, xs = np.where(mask)
    x0, y0, x1, y1 = (int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1))
    (A / (name + '.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1 - x0} {y1 - y0}">{paths}</svg>', encoding='utf8')
im = cv2.imdecode(np.fromfile(V / '00_sample-8224c4e8/DemoBrand_logo.jpg', dtype=np.uint8), cv2.IMREAD_COLOR)
b, g, r = cv2.split(im.astype(np.int16))
write('DemoBrand_logosample-d7992255', im, [('#F6E67A', (r - b > 45) & (g - b > 35))])
im = cv2.imdecode(np.fromfile(V / '00_sample-8224c4e8/DemoClubsample-3e410307_logosample-4b1db520.jpg', dtype=np.uint8), cv2.IMREAD_COLOR)
b, g, r = cv2.split(im.astype(np.int16))
green = (g > r * 1.15) & (g > b * 1.03) & (g < 200)
dark = (r + g + b < 420) & ~green
write('DemoClub_logosample-d7992255', im, [('#171E21', dark), ('#20783D', green)])
im = cv2.imdecode(np.fromfile(V / '00_sample-8224c4e8/DemoClub_logo.png', dtype=np.uint8), cv2.IMREAD_UNCHANGED)
write('DemoMark_logosample-d7992255', im, [('#F6E67A', im[:, :, 3] > 128)])
im = cv2.imdecode(np.fromfile(V / '00_sample-8224c4e8/DemoCampus_logo.png', dtype=np.uint8), cv2.IMREAD_UNCHANGED)
valid = im[:, :, 3] > 160
pixels = im[:, :, :3][valid].astype(np.float32)
cv2.setRNGSeed(20261016)
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.25)
_, labels, colors = cv2.kmeans(pixels, 48, None, criteria, 1, cv2.KMEANS_PP_CENTERS)
layers = []
for i, color in enumerate(colors):
    mask = np.zeros(valid.shape, dtype=bool)
    mask[valid] = labels[:, 0] == i
    if mask.sum() < 6:
        continue
    b, g, r = [int(round(c)) for c in color]
    layers.append((f'#{r:02X}{g:02X}{b:02X}', mask))
write('DemoCampus_logosample-d7992255', im, layers)
print('Vectorized original supplied logo contours; no generative logo redraw.')
