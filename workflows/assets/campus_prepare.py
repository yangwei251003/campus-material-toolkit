# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
from PIL import Image
import json, sys, shutil
ROOT = archive.source_dir('workflows/assets/campus_prepare.py', 0) / 'field_0565_imagegenfield_0566'
ROOT.mkdir(exist_ok=True)
gen = archive.input_path('input_0083')
if len(sys.argv) > 2:
    edition = sys.argv[1]
    src = Path(sys.argv[2])
    target = ROOT / edition
    target.mkdir(exist_ok=True)
    shutil.copy2(src, target / '00_field_0567.png')
    im = Image.open(src)
    w, h = im.size
    for i in range(6):
        col, row = (i % 3, i // 3)
        box = (round(col * w / 3), round(row * h / 2), round((col + 1) * w / 3), round((row + 1) * h / 2))
        im.crop(box).save(target / f'field_0568_{i + 1:02}.png')
    print(json.dumps({'folder': str(target), 'source_size': im.size}, ensure_ascii=False))
