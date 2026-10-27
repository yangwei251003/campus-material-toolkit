"""Extracted local image algorithms. Portrait extension assumes fitted width <= canvas width.
This module contains no deletion, network acquisition, business copy, fonts or QR data.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import pymupdf as fitz
BLEED=35

def edge_extended_canvas(img: Image.Image, width: int, height: int) -> Image.Image:
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
    doc.set_metadata({'title': 'Synthetic print-size demonstration', 'subject': 'Generated geometric input only', 'keywords': 'SYNTHETIC'})
    doc.save(pdf_path, deflate=True)
    doc.close()
