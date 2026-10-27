"""Explicit isolated-workspace parameters for the archived local workflows; not a sandbox for untrusted input."""
from pathlib import Path
import argparse,json
class Runtime:
    def configure(self,word_required=False):
        ap=argparse.ArgumentParser(description='Archived material workflow. Requires an explicit initialized independent workspace; never targets the original business folder.')
        ap.add_argument('--workspace',type=Path,required=True)
        ap.add_argument('--allow-word',action='store_true',help='Explicitly permit Microsoft Word COM automation for your own authorized input')
        ap.add_argument('--docx-tools',type=Path,help='Independently installed compatible docx validation/pack toolkit, required only by certain historical workflows')
        self.args,self.extra=ap.parse_known_args()
        self.root=self.args.workspace.resolve()
        marker=self.root/'.campus-material-workspace.json'
        if not marker.is_file():ap.error('workspace marker missing; create a fresh demo with tools/demo.py, or initialize your own authorized workspace explicitly')
        if word_required and not self.args.allow_word:ap.error('this workflow requires Word; not executed unless --allow-word is explicit')
        if self.args.docx_tools and not self.args.docx_tools.is_dir():ap.error('docx-tools directory does not exist')
    def workspace(self):return self.root
    def asset_path(self,key):return self.root/'inputs'/key
    def tool_path(self,key):
        if key!='docx-tools' or self.args.docx_tools is None:raise RuntimeError('Pass --docx-tools for this historical dependency; no private/global tool path is assumed')
        return str(self.args.docx_tools.resolve())
    def register_pdf_fonts(self):
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.pdfmetrics import Font
        pdfmetrics.registerFont(Font('YaHei','Helvetica','WinAnsiEncoding'))
        pdfmetrics.registerFont(Font('YaHeiBold','Helvetica-Bold','WinAnsiEncoding'))
runtime=Runtime()
