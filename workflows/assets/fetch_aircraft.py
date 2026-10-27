# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='Network acquisition archive is disabled; provide your own authorized input instead.')
import urllib.request, re
from pathlib import Path
d = archive.source_dir('workflows/assets/fetch_aircraft.py', 0) / 'aircraft_refs'
d.mkdir(exist_ok=True)
for name, u in [('dji', 'https://example.invalid/reference'), ('jouav', 'https://example.invalid/reference')]:
    try:
        b = urllib.request.urlopen(u, timeout=25).read()
        (d / (name + '.html')).write_bytes(b)
        s = b.decode('utf-8', errors='ignore').replace('\\/', '/')
        urls = list(dict.fromkeys(re.findall('https?[^\\s<>"\\x27]+?\\.(?:png|jpg|webp|jpeg)', s)))
        (d / (name + '_images.txt')).write_text('\n'.join(urls), encoding='utf-8')
        print(name, '\n'.join(urls)[:13000])
    except Exception as e:
        print(name, e)
