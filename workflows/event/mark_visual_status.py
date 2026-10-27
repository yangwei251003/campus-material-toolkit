# Local workflow source; input/business literals replaced with synthetic placeholders.
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[2]))
from public_runtime import runtime
runtime.configure(word_required=False)
from pathlib import Path
import json, re
p = Path(runtime.workspace() / 'output/DemoCampussample-f1811f58_V1')
a = json.loads((p / 'manifest.json').read_text(encoding='utf-8'))
for i in a:
    f = p / 'images' / f'{i['id']}_{i['name']}.png'
    if f.exists():
        i.update(status='generated', file=f'images/{f.name}')
(p / 'manifest.json').write_text(json.dumps(a, ensure_ascii=False, indent=2), encoding='utf-8')
md = p / 'sample-3e0969f8.md'
if md.exists():
    s = md.read_text(encoding='utf-8')
    for i in a:
        state = 'generated' if i['status'] == 'generated' else 'pending'
        s = re.sub('(\\|' + i['id'] + '\\|[^\\n]+\\|)(pending|generated)(\\|)', lambda m: m.group(1) + state + m.group(3), s)
    md.write_text(s, encoding='utf-8')
done = sum((i['status'] == 'generated' for i in a))
(p / 'sample-b341b84a.md').write_text(f'# sample-b341b84a\n\nsample-95e35aabimagegensample-6446454e: {done}/51sample-1bd91a7d。sample-09680c3fmanifest.jsonsample-4c94558eimagessample-2d2b116e。sample-fde55d3d。sample-fdaec686Wordsample-a20c4899，sample-bc3abef4；sample-06d6920blogosample-12404a0blogossample-52daa71e。\n\nsample-acfc4e74: sample-7c969119pendingsample-9af69965，sample-436dc91d，sample-e70c621704sample-de1d5dd005sample-7b5a5d75，sample-2e81b3df51sample-7ef8ba80。\n', encoding='utf-8')
print(f'{done}/51')
