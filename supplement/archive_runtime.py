"""Keep archived one-off workflows away from real business inputs by default."""
from pathlib import Path
import argparse
import json
import sys

class ArchiveRuntime:
    root = None

    def configure(self, disabled=''):
        if disabled:
            raise SystemExit('ARCHIVE_DISABLED: '+disabled)
        if self.root is not None:
            return
        parser=argparse.ArgumentParser(description='Historical workflow: use the portable demo first.')
        parser.add_argument('--execute-archived',action='store_true')
        parser.add_argument('--workspace',type=Path)
        args,remaining=parser.parse_known_args()
        if not args.execute_archived or args.workspace is None:
            parser.exit(2,'ARCHIVE_GUARD: use supplement/demo.py. Historical workflows need --execute-archived --workspace and synthetic inputs; they are not a complete business delivery.\n')
        root=args.workspace.resolve()
        marker=root/'.campus-material-workspace.json'
        if not marker.is_file() or json.loads(marker.read_text(encoding='utf-8')).get('synthetic') is not True:
            parser.exit(2,'ARCHIVE_GUARD: workspace must have a synthetic=true marker.\n')
        self.root=root
        sys.argv=[sys.argv[0],*remaining]

    def workspace(self):
        if self.root is None:
            raise RuntimeError('Archive runtime not configured')
        return self.root

    def source_dir(self, alias, ascend=0):
        path=self.workspace()/'legacy'/Path(alias).parent
        for _ in range(ascend):
            path=path.parent
        path=path.resolve()
        if not path.is_relative_to(self.workspace()):
            raise ValueError('Archive path escapes the synthetic workspace')
        path.mkdir(parents=True,exist_ok=True)
        return path

    def input_path(self, key):
        return self.workspace()/'inputs'/key

archive=ArchiveRuntime()
