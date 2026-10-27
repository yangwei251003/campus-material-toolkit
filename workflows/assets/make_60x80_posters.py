# Local workflow archive; private inputs and copy replaced. See supplement/README.md.
import sys as _archive_sys
from pathlib import Path as _ArchivePath
_archive_root=next(p for p in _ArchivePath(__file__).resolve().parents if (p/'supplement/archive_runtime.py').exists())
_archive_sys.path.insert(0,str(_archive_root))
from supplement.archive_runtime import archive
archive.configure(disabled='')
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import fitz
ROOT = archive.input_path('input_0590')
OUT = archive.input_path('input_0591')
TRIM_W = 7087
TRIM_H = 9449
BLEED = 35
POSTERS = {'A_field_0565': ROOT / 'A_field_0565' / 'SYNTHETIC FINANCIAL FIELD: field_0053', 'B_field_0592': ROOT / 'B_field_0592' / 'SYNTHETIC FINANCIAL FIELD: field_0053', 'C_field_0593': ROOT / 'C_field_0593' / 'SYNTHETIC FINANCIAL FIELD: field_0053'}

def valid_image(path: Path) -> bool:
    if not path.exists():
        return False
    try:
        with Image.open(path) as probe:
            probe.verify()
        return True
    except Exception:
        path.unlink(missing_ok=True)
        return False

def edge_extended_canvas(img: Image.Image, width: int, height: int) -> Image.Image:
    """Fit without crop or distortion and extend only the side background."""
    scale = height / img.height
    fitted_w = round(img.width * scale)
    fitted = img.resize((fitted_w, height), Image.Resampling.LANCZOS)
    background = fitted.resize((width, height), Image.Resampling.BICUBIC)
    background = background.filter(ImageFilter.GaussianBlur(radius=max(10, width // 350)))
    background = ImageEnhance.Contrast(background).enhance(0.92)
    x = (width - fitted_w) // 2
    background.paste(fitted, (x, 0))
    return background

def add_bleed(trim: Image.Image) -> Image.Image:
    canvas = Image.new('RGB', (trim.width + 2 * BLEED, trim.height + 2 * BLEED))
    canvas.paste(trim, (BLEED, BLEED))
    canvas.paste(trim.crop((0, 0, 1, trim.height)).resize((BLEED, trim.height)), (0, BLEED))
    canvas.paste(trim.crop((trim.width - 1, 0, trim.width, trim.height)).resize((BLEED, trim.height)), (BLEED + trim.width, BLEED))
    canvas.paste(trim.crop((0, 0, trim.width, 1)).resize((trim.width, BLEED)), (BLEED, 0))
    canvas.paste(trim.crop((0, trim.height - 1, trim.width, trim.height)).resize((trim.width, BLEED)), (BLEED, BLEED + trim.height))
    canvas.paste(trim.getpixel((0, 0)), (0, 0, BLEED, BLEED))
    canvas.paste(trim.getpixel((trim.width - 1, 0)), (BLEED + trim.width, 0, canvas.width, BLEED))
    canvas.paste(trim.getpixel((0, trim.height - 1)), (0, BLEED + trim.height, BLEED, canvas.height))
    canvas.paste(trim.getpixel((trim.width - 1, trim.height - 1)), (BLEED + trim.width, BLEED + trim.height, canvas.width, canvas.height))
    return canvas

def save_pdf(image_path: Path, pdf_path: Path, width_cm: float, height_cm: float) -> None:
    points_per_cm = 72 / 2.54
    doc = fitz.open()
    page = doc.new_page(width=width_cm * points_per_cm, height=height_cm * points_per_cm)
    page.insert_image(page.rect, filename=str(image_path))
    doc.set_metadata({'title': 'SYNTHETICfield_0594', 'subject': f'{width_cm:.1f} × {height_cm:.1f} cm', 'keywords': 'SYNTHETIC, field_0595, field_0596, 60x80cm'})
    doc.save(pdf_path, deflate=True)
    doc.close()

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for label, source in POSTERS.items():
        target_dir = OUT / label
        target_dir.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as opened:
            original = opened.convert('RGB')
        trim = edge_extended_canvas(original, TRIM_W, TRIM_H)
        trim_path = target_dir / '60x80cm_300dpi_field_0597.png'
        if not valid_image(trim_path):
            trim.save(trim_path, dpi=(300, 300), compress_level=1)
        trim_pdf = target_dir / '60x80cm_field_0598.pdf'
        if not trim_pdf.exists():
            save_pdf(trim_path, trim_pdf, 60.0, 80.0)
        bleed = add_bleed(trim)
        bleed_path = target_dir / '60x80cm_300dpi_field_05993mmfield_0275.png'
        if not valid_image(bleed_path):
            bleed.save(bleed_path, dpi=(300, 300), compress_level=1)
        bleed_pdf = target_dir / '60x80cm_field_05993mmfield_0275.pdf'
        if not bleed_pdf.exists():
            save_pdf(bleed_path, bleed_pdf, 60.6, 80.6)
        preview = trim.resize((900, 1200), Image.Resampling.LANCZOS)
        preview.save(target_dir / '60x80cm_field_0600.jpg', quality=92, subsampling=0)
    readme = OUT / 'field_0601.txt'
    readme.write_text('SYNTHETICfield_0602 60×80field_0603\n\n1. field_0604，field_0605、field_0606。\n2. field_06073:4field_0608，field_0609。\n3. field_0610：60×80field_0611，000×9449field_0612，field_0613300 DPI。\n4. field_0614：field_06153field_0616，field_061760.6×80.6field_0611。\n5. field_0618“field_05993mmfield_0275.pdf”；field_061960×80field_0611。\n6. field_0620RGBfield_0621。field_0622CMYKfield_0623，field_0624。\n', encoding='utf-8')
    previews = []
    for label in POSTERS:
        with Image.open(OUT / label / '60x80cm_field_0600.jpg') as preview:
            previews.append(preview.convert('RGB'))
    comparison = Image.new('RGB', (sum((p.width for p in previews)), max((p.height for p in previews))), 'white')
    x = 0
    for preview in previews:
        comparison.paste(preview, (x, 0))
        x += preview.width
    comparison.save(OUT / '00_field_062560x80field_0626.jpg', quality=94, subsampling=0)
if __name__ == '__main__':
    main()
