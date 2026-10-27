# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, shutil
base = runtime.workspace() / 'club'
out = runtime.workspace() / 'output/posters/posters'
out.mkdir(parents=True, exist_ok=True)
items = json.loads((base / 'poster_manifest.json').read_text(encoding='utf-8'))
for item in items:
    target = out / (item['name'] + '.png')
    shutil.copy2(item['src'], target)
print(f'Saved {len(list(out.glob('*.png')))} posters')
