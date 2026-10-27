# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, csv, hashlib, zipfile, sys, shutil, collections
sys.stdout.reconfigure(encoding='utf8')
ROOT = Path(runtime.workspace())
V = ROOT / 'output/DemoCampussample-8fbc8444_V3'
O = V / 'V3_sample-846f8c41_20261016'
R = V / 'sample-22298da3'
INFO = O / '00_sample-7a40a511'
assert O.is_dir() and O.resolve().is_relative_to((ROOT / 'output').resolve())
qa = json.loads((R / 'V3sample-250b556e.json').read_text('utf8'))
ca = json.loads((R / 'sample-bc2a1719.json').read_text('utf8'))
docs = json.loads((R / 'sample-86248ab2.json').read_text('utf8'))
assert not qa['errors'] and (not ca['failures']) and (not docs['missing_links'])
assert next((d for d in docs['documents'] if d['file'] == 'V3Allsample-92321aa8.pdf'))['pages'] == 26
shutil.copy2(R / 'sample-86248ab2.json', INFO / 'sample-86248ab2.json')
manifest = INFO / 'sample-39932f24SHA256sample-188bc791.csv'
files = sorted((p for p in O.rglob('*') if p.is_file() and p != manifest))
entries = []
for p in files:
    entries.append({'relative': p.relative_to(O).as_posix(), 'size': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()})
with manifest.open('w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f)
    w.writerow(['sample-f297dc0b', 'sample-42a1d9e5', 'SHA256'])
    w.writerows(((e['relative'], e['size'], e['sha256']) for e in entries))
dest = ROOT / 'output/DemoCampussample-8fbc8444_V3_sample-b26db186_20261016.zip'
files = sorted((p for p in O.rglob('*') if p.is_file()))
print('Packaging', len(files), 'files', round(sum((p.stat().st_size for p in files)) / 1024 ** 2, 1), 'MiB', flush=True)
with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6, allowZip64=True) as z:
    for i, p in enumerate(files):
        z.write(p, O.name + '/' + p.relative_to(O).as_posix())
        if i % 100 == 0:
            print('Added', i, flush=True)
print('Verifying ZIP CRC and every member hash', flush=True)
with zipfile.ZipFile(dest) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert len(names) == len(set(names)) == len(files)
    for e in entries:
        name = O.name + '/' + e['relative']
        data = z.read(name)
        assert len(data) == e['size'] and hashlib.sha256(data).hexdigest() == e['sha256'], name
    assert not any(('sample-53511c82' in x or '/32_' in x or '/33_' in x or ('/34_' in x) or ('/35_' in x) or ('/36_' in x) or ('/37_' in x) or ('/38_' in x) or ('/39_' in x) or ('/40_' in x) or ('/41_' in x) for x in names))
digest = hashlib.sha256(dest.read_bytes()).hexdigest()
check = {'zip': str(dest), 'zip_bytes': dest.stat().st_size, 'zip_sha256': digest, 'files': len(files), 'crc': 'passed', 'all_member_sha256': 'matched', 'duplicate_entries': 0, 'artwork_components': 151, 'standard_components': 147, 'pending_gate_reference_components': 4}
(R / 'V3sample-818762da.json').write_text(json.dumps(check, ensure_ascii=False, indent=2), encoding='utf8')
(dest.parent / (dest.name + '.sha256.txt')).write_text(digest + '  ' + dest.name + '\n', encoding='utf8')
print(json.dumps(check, ensure_ascii=False, indent=2), flush=True)
