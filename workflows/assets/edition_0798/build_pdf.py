# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
from PIL import Image
folder = archive.source_dir('workflows/assets/edition_0798/build_pdf.py', 0)
sources = [folder / f'{number:02d}.png' for number in range(1, 7)]
pages = []
for source in sources:
    image = Image.open(source).convert('RGB')
    image.info['dpi'] = (300, 300)
    pages.append(image)
output = folder / 'field_0799.pdf'
pages[0].save(output, 'PDF', save_all=True, append_images=pages[1:], resolution=300.0)
print(output)
