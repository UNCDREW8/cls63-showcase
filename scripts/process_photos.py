"""Turn the 2013 CLS63 AMG photo set into black-car-on-black assets.

usage: python3 process_photos.py <originals_dir> <out_dir>
Originals are the Wikimedia files named as in SOURCES below.
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session

SRC, OUT = map(pathlib.Path, sys.argv[1:3])
OUT.mkdir(parents=True, exist_ok=True)
session = new_session('isnet-general-use')
BG = np.array([8, 8, 8], dtype=np.float32)

# slot: (file, out size or None = keep, cutout?, crop gravity y 0..1)
SOURCES = {
    'profile':   ('Side_View.jpg',       None,         True,  0.5),
    'rear':      ('Rear.jpg',            (2400, 1350), True,  0.55),
    'hero':      ('Front_Overhead.jpg',  (2400, 1350), True,  0.42),
    'headlight': ('Headlight.jpg',       (2400, 1350), False, 0.45),
    'wheel':     ('Front_Wheel.jpg',     (1200, 1500), False, 0.5),
    'engine':    ('Engine_Close-up.jpg', (1200, 1500), False, 0.5),
    'pause':     ('Engine.jpg',          (2400, 1200), False, 0.5),
    'interior':  ('Steering_Wheel.jpg',  (1600, 1200), False, 0.5),
}


def to_black(rgb: np.ndarray) -> np.ndarray:
    """Paint → black: luminance-only, crushed, highlights kept as reflections.
    Strongly red pixels (calipers, taillamps) keep a restrained red."""
    f = rgb.astype(np.float32) / 255
    lum = 0.2126 * f[..., 0] + 0.7152 * f[..., 1] + 0.0722 * f[..., 2]
    dark = np.clip(lum, 0, 1) ** 2.1 * 0.95  # deep paint, specular highlights survive
    out = np.stack([dark] * 3, -1)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    red = np.clip((r - np.maximum(g, b) - 0.18) * 3, 0, 1)[..., None]
    red_tone = np.stack([np.clip(r * 0.8, 0, 1), g * 0.18, b * 0.18], -1)
    out = out * (1 - red) + red_tone * red
    return out * 255


def cover(img: Image.Image, size, gy):
    W, H = size
    s = max(W / img.width, H / img.height)
    im = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x = (im.width - W) // 2
    y = int((im.height - H) * gy)
    return im.crop((x, y, x + W, y + H))


def vignette(w, h, strength=0.85):
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h * 0.55) / (h / 2)) ** 2) / 1.25
    return np.clip((d - 0.35) / 0.65, 0, 1)[..., None] * strength


for slot, (name, size, cut, gy) in SOURCES.items():
    src = Image.open(SRC / name).convert('RGB')
    rgb = np.asarray(src)
    if cut:
        mask = remove(src, session=session, only_mask=True, post_process_mask=True)
        m = np.asarray(mask.filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)[..., None] / 255
        car = to_black(rgb)
        # soft ground shadow so the car sits on the black, not floats
        sh = np.asarray(mask.filter(ImageFilter.GaussianBlur(18)), dtype=np.float32)[..., None] / 255
        base = BG * (1 - 0.6 * sh)
        out = car * m + base * (1 - m)
    else:
        g = to_black(rgb)
        v = vignette(rgb.shape[1], rgb.shape[0])
        out = g * (1 - v) + BG * v
    im = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    if size:
        im = cover(im, size, gy)
    im.save(OUT / f'{slot}.jpg', quality=84, optimize=True, progressive=True)
    if im.width > 1200:
        im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS).save(
            OUT / f'{slot}-1200w.jpg', quality=82, optimize=True, progressive=True)
    print(slot, im.size)
