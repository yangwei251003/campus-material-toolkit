# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
import pymupdf as f
import json
r = archive.workspace()
o = archive.workspace() / 'output/panels'
o.mkdir(exist_ok=True)
d = f.open(archive.workspace() / 'inputs/source.pdf')
mapping = [(0, 2, 'field_0259'), (0, 0, 'field_0569'), (1, 0, 'field_0570'), (1, 1, 'field_0533'), (1, 2, 'field_0571'), (0, 1, 'field_0020')]
out = []
for i, (pi, col, name) in enumerate(mapping, 1):
    p = d[pi]
    w = p.rect.width / 3
    clip = f.Rect(col * w, 0, (col + 1) * w, p.rect.height)
    path = o / f'field_0572_{i:02d}_{name}.png'
    p.get_pixmap(clip=clip, dpi=220, alpha=False).save(path)
    out.append({'n': i, 'name': name, 'file': str(path), 'source_pdf_page': pi + 1, 'column': col + 1})
(o / 'field_0573.json').write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(out, ensure_ascii=False))
