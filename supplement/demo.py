"""Exercise preserved image/PDF algorithms using newly created geometric inputs."""
from pathlib import Path
import argparse, json, hashlib, subprocess, sys
from PIL import Image, ImageDraw
import pymupdf as fitz

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from supplement.apis.print_geometry import edge_extended_canvas,add_bleed,save_pdf,BLEED

def digest(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--workspace',required=True,type=Path)
    args=parser.parse_args();w=args.workspace.resolve()
    if w.exists() and any(w.iterdir()):parser.error('Use a new empty directory for synthetic fixtures.')
    w.mkdir(parents=True,exist_ok=True)
    (w/'.campus-material-workspace.json').write_text(json.dumps({'synthetic':True,'purpose':'portable algorithm demonstration'}),encoding='utf-8')
    inputs=w/'inputs';inputs.mkdir();out=w/'output';out.mkdir()
    src=Image.new('RGB',(100,160));pixels=src.load()
    for y in range(160):
        for x in range(100):pixels[x,y]=(30+x*2,40+y,100+(x+y)%130)
    ImageDraw.Draw(src).rectangle((8,12,91,147),outline='white',width=3)
    src.save(inputs/'portrait.png')
    trim=edge_extended_canvas(src,300,400)
    fitted=src.resize((250,400),Image.Resampling.LANCZOS)
    assert trim.crop((25,0,275,400)).tobytes()==fitted.tobytes()
    bleed=add_bleed(trim)
    assert bleed.size==(370,470)
    assert bleed.crop((BLEED,BLEED,BLEED+300,BLEED+400)).tobytes()==trim.tobytes()
    for x,y,sx,sy in [(0,0,0,0),(369,0,299,0),(0,469,0,399),(369,469,299,399)]:assert bleed.getpixel((x,y))==trim.getpixel((sx,sy))
    trim.save(out/'portrait-extended.png');bleed.save(out/'portrait-bleed.png')
    save_pdf(out/'portrait-bleed.png',out/'physical-size.pdf',8,10)
    with fitz.open(out/'physical-size.pdf')as pdf:
        assert len(pdf)==1
        assert abs(pdf[0].rect.width-8*72/2.54)<0.001
        assert abs(pdf[0].rect.height-10*72/2.54)<0.001
    rgba=Image.new('RGBA',(160,120),(0,185,123,0));draw=ImageDraw.Draw(rgba)
    draw.ellipse((5,5,155,115),fill=(0,185,123,190));draw.rectangle((65,20,95,100),fill=(255,255,255,255))
    rgba.save(inputs/'alpha-shape.png')
    doc=fitz.open();xref=None
    for index in range(2):
        p=doc.new_page(width=900,height=600)
        for col,color in enumerate([(0.04,0.17,0.25),(0,0.73,0.48),(0.96,0.90,0.48)]):
            p.draw_rect(fitz.Rect(col*300,0,(col+1)*300,600),color=None,fill=color)
        p.insert_text((30,50),f'SYNTHETIC PAGE {index+1} - OWN GEOMETRIC INPUT',fontsize=18,color=(1,1,1))
        if xref is None:xref=p.insert_image(fitz.Rect(60,180,220,300),filename=str(inputs/'alpha-shape.png'))
        else:p.insert_image(fitz.Rect(360,180,520,300),xref=xref)
    doc.set_metadata({'title':'Synthetic two-page input','author':'Synthetic fixture generator'})
    doc.save(inputs/'source.pdf');doc.close()
    before=digest(inputs/'source.pdf');steps=[]
    for filename in ['extract_pdf_assets.py','crop_original_panels.py']:
        result=subprocess.run([sys.executable,str(ROOT/'workflows/assets'/filename),'--execute-archived','--workspace',str(w)],cwd=w,capture_output=True,text=True,encoding='utf-8')
        if result.returncode:raise RuntimeError(filename+' failed: '+result.stderr[-2000:])
        steps.append({'program':filename,'exit_code':result.returncode})
    assert digest(inputs/'source.pdf')==before
    extracted=[p for p in (out/'extracted').glob('p*_xref*.png')]
    assert len(extracted)==1
    with Image.open(extracted[0])as image:assert image.mode=='RGBA'and image.size==(160,120)
    panels=list((out/'panels').glob('*.png'));assert len(panels)==6
    with Image.open(panels[0])as image:assert abs(image.width-300*220/72)<2 and abs(image.height-600*220/72)<2
    summary={'synthetic':True,'original_business_assets_used':False,'image_center_identical_after_extension':True,'bleed_center_and_four_corners_identical':True,'physical_pdf_cm':[8,10],'actual_archived_programs':steps,'unique_pdf_images_extracted':len(extracted),'pdf_alpha_preserved':True,'pdf_panels':len(panels),'input_pdf_unchanged':True,'extension_limitation':'Wide source images may be clipped; this demonstration uses a narrow portrait.','Word_Office_network_download':False}
    (w/'validation.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
    print(json.dumps(summary))

if __name__=='__main__':main()
