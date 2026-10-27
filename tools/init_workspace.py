"""Initialize an empty independent directory for explicitly authorized material inputs; does not copy or operate any real business files."""
from pathlib import Path
import argparse,json
ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--workspace',type=Path,required=True);args=ap.parse_args();p=args.workspace.resolve()
if p.exists() and any(p.iterdir()):ap.error('choose a fresh empty directory; existing inputs are never marked or changed automatically')
p.mkdir(parents=True,exist_ok=True);(p/'.campus-material-workspace.json').write_text(json.dumps({'synthetic':False,'user_selected_authorized_workspace':True}),encoding='utf-8')
print('Initialized an empty independent workspace. Supply your own authorized inputs before selecting a workflow.')
