from pathlib import Path
import sys

from collections import deque

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

try:
    from rembg import new_session, remove
except ImportError:
    new_session = None
    remove = None


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "animal-friends"
OUT_CUTOUTS = OUT / "cutouts"
REMBG_MODEL = "u2net"

CHARACTERS = [
    {"slug": "ella-elefant", "name": "Ella", "box": (0, 5, 242, 215), "shrink": 8},
    {"slug": "pino-pinguin", "name": "Pino", "box": (232, 35, 505, 228), "shrink": 7},
    {"slug": "mika-katze", "name": "Mika", "box": (495, 42, 750, 252), "shrink": 8},
    {"slug": "balu-hund", "name": "Balu", "box": (0, 208, 238, 430), "shrink": 8},
    {"slug": "kiki-kaenguru", "name": "Kiki", "box": (248, 238, 510, 462), "shrink": 8},
    {
        "slug": "bruno-baer",
        "name": "Bruno",
        "box": (505, 252, 748, 490),
        "shrink": 8,
        "mask": [(28, 78), (58, 35), (122, 10), (188, 42), (229, 92), (220, 165), (198, 198), (165, 214), (128, 202), (92, 212), (54, 214), (18, 190), (8, 132)],
    },
    {
        "slug": "luna-hase",
        "name": "Luna",
        "box": (0, 425, 270, 690),
        "shrink": 9,
        "mask": [(14, 100), (38, 24), (92, 0), (132, 106), (180, 0), (236, 28), (232, 122), (262, 172), (238, 238), (170, 260), (55, 252), (4, 212)],
    },
    {"slug": "fina-fuchs", "name": "Fina", "box": (260, 485, 520, 710), "shrink": 8},
    {
        "slug": "roni-waschbaer",
        "name": "Roni",
        "box": (512, 492, 752, 738),
        "shrink": 9,
        "mask": [(4, 58), (38, 28), (91, 12), (144, 20), (174, 52), (202, 82), (216, 140), (208, 210), (182, 240), (55, 238), (12, 200), (0, 120)],
    },
    {"slug": "dari-reh", "name": "Dari", "box": (8, 688, 245, 1000), "shrink": 8},
    {
        "slug": "nuri-fledermaus",
        "name": "Nuri",
        "box": (280, 720, 575, 988),
        "shrink": 9,
        "mask": [
            [(6, 100), (62, 34), (130, 14), (188, 28), (226, 60), (238, 94), (222, 144), (204, 190), (156, 252), (76, 226), (34, 166)],
            [(222, 60), (254, 50), (286, 74), (276, 104), (240, 104)],
        ],
    },
]


def foreground_seed(crop):
    rgb = crop.convert("RGB")
    gray = ImageOps.grayscale(rgb)
    hsv = rgb.convert("HSV")
    sat = hsv.getchannel("S")
    val = hsv.getchannel("V")
    mask = Image.new("L", crop.size, 0)

    mp = mask.load()
    gp = gray.load()
    sp = sat.load()
    vp = val.load()
    w, h = crop.size
    for y in range(h):
        for x in range(w):
            dark_line = gp[x, y] < 182
            colored_pencil = sp[x, y] > 28 and vp[x, y] < 250
            if dark_line or colored_pencil:
                mp[x, y] = 255

    return mask


def fill_closed_shape(seed):
    expanded = seed.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.MedianFilter(5))
    pix = expanded.load()
    w, h = expanded.size
    seen = bytearray(w * h)
    queue = deque()

    def push(x, y):
        idx = y * w + x
        if seen[idx] or pix[x, y] > 0:
            return
        seen[idx] = 1
        queue.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)

    filled = Image.new("L", (w, h), 0)
    fp = filled.load()
    for y in range(h):
        for x in range(w):
            if pix[x, y] > 0 or not seen[y * w + x]:
                fp[x, y] = 255

    return largest_component(filled).filter(ImageFilter.MedianFilter(5))


def fill_holes(mask):
    pix = mask.load()
    w, h = mask.size
    seen = bytearray(w * h)
    queue = deque()

    def push(x, y):
        idx = y * w + x
        if seen[idx] or pix[x, y] > 0:
            return
        seen[idx] = 1
        queue.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)

    filled = Image.new("L", (w, h), 0)
    fp = filled.load()
    for y in range(h):
        for x in range(w):
            if pix[x, y] > 0 or not seen[y * w + x]:
                fp[x, y] = 255

    return filled


def largest_component(mask):
    src = mask.load()
    w, h = mask.size
    seen = bytearray(w * h)
    components = []

    for sy in range(h):
        for sx in range(w):
            idx = sy * w + sx
            if seen[idx] or src[sx, sy] == 0:
                continue
            seen[idx] = 1
            queue = deque([(sx, sy)])
            pixels = []
            while queue:
                x, y = queue.popleft()
                pixels.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        nidx = ny * w + nx
                        if not seen[nidx] and src[nx, ny] > 0:
                            seen[nidx] = 1
                            queue.append((nx, ny))
            components.append(pixels)

    if not components:
        return mask

    keep = max(components, key=len)
    out = Image.new("L", mask.size, 0)
    op = out.load()
    for x, y in keep:
        op[x, y] = 255
    return out


def rough_mask(size, points):
    mask = Image.new("L", size, 0)
    if not points:
        return Image.new("L", size, 255)

    high_res = 3
    polygons = points if isinstance(points[0], list) else [points]
    large = Image.new("L", (size[0] * high_res, size[1] * high_res), 0)
    draw = ImageDraw.Draw(large)
    for polygon in polygons:
        scaled = [(x * high_res, y * high_res) for x, y in polygon]
        draw.polygon(scaled, fill=255)
    return large.resize(size, Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.5))


def clean_alpha(shape, seed, shrink):
    kernel = max(3, shrink * 2 + 1)
    if kernel % 2 == 0:
        kernel += 1

    body = shape.filter(ImageFilter.MinFilter(kernel))
    ink = seed.filter(ImageFilter.MaxFilter(5))
    alpha = ImageChops.lighter(body, ink)
    return alpha.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.8))


def model_alpha(crop, session):
    raw = remove(crop, session=session, alpha_matting=False).getchannel("A")
    binary = raw.point(lambda a: 255 if a > 96 else 0)
    binary = binary.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MedianFilter(3))
    alpha = fill_holes(binary)
    return alpha.filter(ImageFilter.GaussianBlur(0.55))


def remove_light_edge(image):
    cleaned = image.copy()
    pixels = cleaned.load()
    w, h = cleaned.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            brightness = (r + g + b) / 3
            saturation = max(r, g, b) - min(r, g, b)
            if a < 40 or (a < 210 and brightness > 215 and saturation < 36):
                pixels[x, y] = (r, g, b, 0)
    return cleaned


def make_cutout(source, character, session):
    slug = character["slug"]
    box = character["box"]
    crop = source.crop(box)
    if session:
        mask = model_alpha(crop, session)
    else:
        seed = foreground_seed(crop)
        mask = clean_alpha(fill_closed_shape(seed), seed, character.get("shrink", 8))
    mask = ImageChops.multiply(mask, rough_mask(crop.size, character.get("mask")))
    bbox = mask.getbbox()
    if bbox:
        pad = 8
        x1, y1, x2, y2 = bbox
        bbox = (max(0, x1 - pad), max(0, y1 - pad), min(crop.width, x2 + pad), min(crop.height, y2 + pad))
        crop = crop.crop(bbox)
        mask = mask.crop(bbox)

    cutout = crop.convert("RGBA")
    cutout.putalpha(mask)
    cutout = ImageOps.contain(cutout, (330, 330), method=Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
    x = (360 - cutout.width) // 2
    y = (360 - cutout.height) // 2
    canvas.alpha_composite(cutout, (x, y))
    canvas = remove_light_edge(canvas)
    canvas.save(OUT / f"{slug}.webp", "WEBP", lossless=True, method=6, exact=True)
    canvas.save(OUT_CUTOUTS / f"{slug}.png", "PNG", optimize=True)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: extract-animal-friends.py SOURCE_IMAGE")
    OUT.mkdir(parents=True, exist_ok=True)
    OUT_CUTOUTS.mkdir(parents=True, exist_ok=True)
    source = Image.open(sys.argv[1])
    source = ImageOps.exif_transpose(source).convert("RGBA")
    source.thumbnail((768, 1024), Image.Resampling.LANCZOS)

    source_out = OUT / "animal-sheet-source.jpg"
    if Path(sys.argv[1]).resolve() != source_out.resolve():
        source.convert("RGB").save(source_out, quality=86, optimize=True, progressive=True)
    session = new_session(REMBG_MODEL) if new_session else None
    for character in CHARACTERS:
        make_cutout(source, character, session)


if __name__ == "__main__":
    main()
