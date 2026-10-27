"""Run selected original workflow algorithms against a fresh synthetic workspace, never original business inputs."""
from pathlib import Path
import argparse,ast,json,shutil,subprocess,sys,zipfile,hashlib,xml.etree.ElementTree as E
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
def write_json(path,value):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--workspace',type=Path,required=True);ap.add_argument('--skip-docx',action='store_true',help='Skip optional Node/docx layout smoke');args=ap.parse_args()
 W=args.workspace.resolve()
 if W.exists() and any(W.iterdir()):ap.error('choose a fresh empty workspace; no existing files are changed')
 W.mkdir(parents=True,exist_ok=True);write_json(W/'.campus-material-workspace.json',{'synthetic':True,'original_business_assets':False})
 jobs=[]
 def run(file):
  result=subprocess.run([sys.executable,'-u',str(ROOT/'workflows'/file),'--workspace',str(W)],cwd=ROOT,capture_output=True)
  log=W/'logs'/Path(file).with_suffix('.txt');log.parent.mkdir(parents=True,exist_ok=True);log.write_bytes(result.stdout+b'\n'+result.stderr)
  jobs.append({'workflow':file,'exit_code':result.returncode})
  if result.returncode:raise RuntimeError('fixture workflow failed: '+file+'; see '+str(log.relative_to(W)))
 items=[]
 for i in range(16):
  img=Image.new('RGB',(480,640),('#102c43','#123b55','#19334d','#244157')[i%4]);draw=ImageDraw.Draw(img)
  draw.rectangle((28,28,452,612),outline='#67ddc1',width=5);draw.ellipse((100,130,380,410),fill=('#24a68f','#e5c875','#70a9d1','#d08f7a')[i%4]);draw.rectangle((180,210,300,330),fill='#102c43')
  draw.text((60,75),'SYNTHETIC FIXTURE',fill='white');draw.text((65,480),f'SAMPLE {i+1:02d} / NO BUSINESS ASSETS',fill='white')
  p=W/'inputs/posters'/f'poster-{i+1:02d}.png';p.parent.mkdir(parents=True,exist_ok=True);img.save(p)
  items.append({'name':f'poster-{i+1:02d}','src':str(p)})
 write_json(W/'club/poster_manifest.json',items)
 out=W/'output/posters';out.mkdir(parents=True,exist_ok=True);write_json(out/'prompts.json',{'origin':'deterministic synthetic geometry, no AI/brand/photo claim'})
 run('club/save_posters.py');run('club/package_posters.py')
 archive=out/'posters.zip'
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None;pngs=[p for p in z.namelist() if p.endswith('.png')];assert len(pngs)==16
  for p in pngs:assert hashlib.sha256(z.read(p)).digest()==hashlib.sha256((out/p).read_bytes()).digest()
 pages=[]
 for i in range(7):
  pages.append({'heading':f'Synthetic page {i+1}','lead':'Layout fixture only. No source plan or private information.', 'blocks':[{'type':'h2','text':'Workflow checks'},{'type':'p','label':'Sample: ','text':'This synthetic paragraph exercises the original paragraph drawing and overflow check.'},{'type':'table','headers':['Item','Status'],'rows':[['Synthetic asset','Ready'],['Business input','Excluded']],'widths':[55,45]},{'type':'callout','label':'Fixture','text':'Independent generated geometric inputs only.'},{'type':'small','text':'No hardware, organization or commercial delivery is represented.'},{'type':'source','url':'https://example.invalid/fixture','label':'Synthetic reference','text':'Non-production URL.'}]})
 write_json(W/'event/plan.json',{'title':'Synthetic material pipeline','subtitle':'Seven-page layout fixture','version':'Demo only','pages':pages})
 run('event/build_pdf.py')
 import pymupdf as fitz
 with fitz.open(W/'output/pdf/sample-plan.pdf') as pdf:
  assert len(pdf)==7
  assert all(len(p.get_text().strip())>200 for p in pdf)
  (W/'previews').mkdir(exist_ok=True);pdf[0].get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(W/'previews/pdf-first-page.png')
 catalog=W/'output/catalog';manifest=[]
 for i,item in enumerate(items[:4]):
  f=catalog/'images'/f'sample-{i+1}.png';f.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(item['src'],f)
  manifest.append({'id':f'F{i+1:02d}','name':f'Sample {i+1}','group':'Group A' if i%2==0 else 'Group B','file':f.relative_to(catalog).as_posix()})
 write_json(catalog/'manifest.json',manifest);run('event/build_visual_catalog.py')
 with (catalog/'manifest.json').open(encoding='utf-8') as f:checked=json.load(f)
 assert all(x['pixels']==[480,640] and len(x['sha256'])==64 for x in checked)
 # Discover the four retained legacy mask-profile filenames without executing the workflow.
 tree=ast.parse((ROOT/'workflows/event/vectorize_brand.py').read_text(encoding='utf-8'))
 inputs=[]
 for node in ast.walk(tree):
  if isinstance(node,ast.Call) and isinstance(node.func,ast.Attribute) and node.func.attr=='fromfile':
   expr=node.args[0]
   if isinstance(expr,ast.BinOp) and isinstance(expr.left,ast.Name) and expr.left.id=='V' and isinstance(expr.right,ast.Constant):inputs.append(expr.right.value)
 assert len(inputs)==4
 for i,rel in enumerate(inputs):
  p=W/'vector-input'/rel;p.parent.mkdir(parents=True,exist_ok=True)
  image=Image.new('RGBA' if p.suffix.lower()=='.png' else 'RGB',(400,300),(255,255,255,0) if p.suffix.lower()=='.png' else 'white');draw=ImageDraw.Draw(image)
  if i<3:draw.ellipse((55,40,345,260),fill=(32,120,61,255) if i==1 else (246,230,122,255))
  else:
   for y in range(8):
    for x in range(8):draw.rectangle((40+x*40,25+y*30,80+x*40,55+y*30),fill=(30+x*27,30+y*27,30+(x+y)*13,255))
  image.save(p)
 (W/'vector-output').mkdir(exist_ok=True);run('event/vectorize_brand.py')
 vectors=list((W/'vector-output').glob('*.svg'));assert len(vectors)==4
 for p in vectors:assert E.parse(p).getroot().find('{http://www.w3.org/2000/svg}path') is not None
 docx_info={'executed':False}
 if not args.skip_docx:
  dest=W/'organization';dest.mkdir(exist_ok=True);shutil.copyfile(ROOT/'fixtures/organization-copy.json',dest/'content.json')
  result=subprocess.run(['node',str(ROOT/'workflows/organization/build.js'),'--workspace',str(W)],cwd=ROOT,capture_output=True)
  (W/'logs/organization-build.txt').write_bytes(result.stdout+b'\n'+result.stderr);jobs.append({'workflow':'organization/build.js','exit_code':result.returncode})
  if result.returncode:raise RuntimeError('Node docx layout fixture failed; see logs/organization-build.txt')
  p=dest/'sample-organization.docx'
  with zipfile.ZipFile(p) as z:
   assert z.testzip() is None
   xml=E.fromstring(z.read('word/document.xml'));ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
   text=''.join(n.text or '' for n in xml.findall('.//w:t',ns))
   assert 'Synthetic content' in text;assert not [n for n in z.namelist() if n.startswith('word/media/')]
   docx_info={'executed':True,'zip_entries':len(z.namelist()),'paragraphs':len(xml.findall('.//w:p',ns)),'tables':len(xml.findall('.//w:tbl',ns)),'embedded_images':0,'actual_Word_rendering':False}
 summary={'synthetic_only':True,'jobs':jobs,'poster_images':16,'poster_zip_member_hashes_match':True,'pdf_pages':7,'catalog_items':4,'vector_mask_profiles':4,'docx':docx_info,'actual_business_archive_recreated':False,'word_COM_executed':False}
 write_json(W/'demo-validation.json',summary);print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':main()
