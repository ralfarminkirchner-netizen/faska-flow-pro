from pathlib import Path
from math import sin, cos, pi
from random import Random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "premium-sky"
BG = OUT / "backgrounds"
SPRITES = OUT / "sprites"


def ensure_dirs():
    BG.mkdir(parents=True, exist_ok=True)
    SPRITES.mkdir(parents=True, exist_ok=True)


def lerp(a, b, t):
    return int(a + (b - a) * t)


def gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        col = tuple(lerp(top[i], bottom[i], t) for i in range(3))
        for x in range(w):
            px[x, y] = col
    return img


def soft_blob(layer, box, fill, blur=18):
    blob = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(blob)
    d.ellipse(box, fill=fill)
    layer.alpha_composite(blob.filter(ImageFilter.GaussianBlur(blur)))


def draw_cloud(draw, cx, cy, scale, fill=(255, 255, 255, 230), shade=(220, 236, 255, 130)):
    parts = [
        (-110, 20, 155, 100),
        (-70, -20, 45, 75),
        (0, -48, 122, 72),
        (88, -12, 205, 92),
        (-150, 18, -40, 92),
    ]
    for x1, y1, x2, y2 in parts:
        draw.ellipse(
            (
                cx + x1 * scale,
                cy + y1 * scale,
                cx + x2 * scale,
                cy + y2 * scale,
            ),
            fill=fill,
        )
    draw.ellipse((cx - 118 * scale, cy + 52 * scale, cx + 172 * scale, cy + 118 * scale), fill=shade)


def draw_sun(layer, cx, cy, radius):
    d = ImageDraw.Draw(layer)
    for i in range(20):
        angle = i * pi / 10
        r1 = radius * 1.15
        r2 = radius * 1.52
        x1 = cx + cos(angle) * r1
        y1 = cy + sin(angle) * r1
        x2 = cx + cos(angle) * r2
        y2 = cy + sin(angle) * r2
        d.line((x1, y1, x2, y2), fill=(255, 202, 81, 110), width=max(4, radius // 8))
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(255, 222, 97, 255))
    d.ellipse((cx - radius * 0.62, cy - radius * 0.72, cx + radius * 0.35, cy + radius * 0.25), fill=(255, 244, 160, 155))


def rainbow(layer, center, radius, width):
    colors = [
        (244, 114, 182, 230),
        (251, 146, 60, 230),
        (250, 204, 21, 230),
        (74, 222, 128, 230),
        (56, 189, 248, 230),
        (168, 85, 247, 220),
    ]
    d = ImageDraw.Draw(layer)
    cx, cy = center
    for i, color in enumerate(colors):
        r = radius - i * width
        d.arc((cx - r, cy - r, cx + r, cy + r), 180, 360, fill=color, width=width)


def hills(layer, palette):
    w, h = layer.size
    d = ImageDraw.Draw(layer)
    for idx, color in enumerate(palette):
        y = h * (0.74 + idx * 0.07)
        points = [(0, h)]
        for x in range(0, w + 160, 160):
            points.append((x, y + sin(x / 170 + idx) * 42))
        points.append((w, h))
        d.polygon(points, fill=color)


def make_backgrounds():
    size = (1440, 900)
    scenes = [
        ("sky-morning.jpg", (126, 206, 255), (248, 237, 199)),
        ("sky-rainbow.jpg", (102, 194, 255), (246, 235, 216)),
        ("sky-rain.jpg", (113, 151, 184), (213, 228, 238)),
        ("sky-night.jpg", (30, 45, 92), (78, 90, 145)),
        ("sky-sunset.jpg", (255, 165, 118), (115, 126, 216)),
        ("sky-aurora.jpg", (44, 63, 132), (133, 222, 210)),
    ]

    for filename, top, bottom in scenes:
        img = gradient(size, top, bottom).convert("RGBA")
        glow = Image.new("RGBA", size, (0, 0, 0, 0))
        if "night" in filename:
            rng = Random(11)
            d = ImageDraw.Draw(img)
            for _ in range(160):
                x, y = rng.randint(0, size[0]), rng.randint(20, 520)
                r = rng.choice([1, 1, 2])
                d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 245, 190, rng.randint(150, 240)))
            draw_sun(glow, 1110, 165, 60)
            glow = glow.point(lambda p: min(p, 190))
        else:
            draw_sun(glow, 1150, 145, 86)
        img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(2)))

        d = ImageDraw.Draw(img)
        if "rainbow" in filename:
            rainbow(img, (720, 790), 520, 28)
        if "aurora" in filename:
            aur = Image.new("RGBA", size, (0, 0, 0, 0))
            ad = ImageDraw.Draw(aur)
            for x in range(-120, size[0] + 120, 28):
                y = 250 + sin(x / 95) * 48
                ad.line((x, y, x + 155, y + 180), fill=(132, 255, 209, 60), width=34)
            img.alpha_composite(aur.filter(ImageFilter.GaussianBlur(16)))
        if "rain" in filename:
            rng = Random(18)
            for _ in range(120):
                x, y = rng.randint(0, size[0]), rng.randint(80, size[1] - 120)
                d.line((x, y, x - 18, y + 44), fill=(230, 245, 255, 130), width=3)

        cloud_layer = Image.new("RGBA", size, (0, 0, 0, 0))
        cd = ImageDraw.Draw(cloud_layer)
        for cx, cy, sc in [(260, 145, 0.75), (565, 210, 0.55), (940, 250, 0.68), (1240, 330, 0.48)]:
            draw_cloud(cd, cx, cy, sc)
        img.alpha_composite(cloud_layer.filter(ImageFilter.GaussianBlur(0.3)))
        hills(img, [(116, 206, 159, 190), (68, 179, 139, 210), (34, 145, 122, 230)])
        img.convert("RGB").save(BG / filename, quality=88, optimize=True, progressive=True)


def sprite_canvas(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def save_png(img, path):
    img.save(path, optimize=True)


def make_cloud_sprite(filename, scale=1.0, tint=(255, 255, 255, 235)):
    img = sprite_canvas((620, 360))
    d = ImageDraw.Draw(img)
    draw_cloud(d, 300, 130, scale, fill=tint, shade=(205, 224, 248, 90))
    soft_blob(img, (120, 85, 510, 255), (255, 255, 255, 48), blur=24)
    save_png(img, SPRITES / filename)


def make_simple_icon(filename, kind):
    img = sprite_canvas((512, 512))
    d = ImageDraw.Draw(img)
    if kind == "sun":
        draw_sun(img, 256, 256, 112)
    elif kind == "rainbow":
        rainbow(img, (256, 462), 340, 30)
        d.ellipse((60, 330, 250, 455), fill=(255, 255, 255, 230))
        d.ellipse((250, 330, 450, 455), fill=(255, 255, 255, 230))
    elif kind == "moon":
        d.ellipse((135, 94, 385, 370), fill=(255, 241, 170, 255))
        d.ellipse((218, 60, 450, 335), fill=(255, 255, 255, 0))
        mask = Image.new("L", img.size, 0)
        md = ImageDraw.Draw(mask)
        md.ellipse((218, 60, 450, 335), fill=255)
        cut = Image.new("RGBA", img.size, (0, 0, 0, 0))
        img.paste(cut, mask=mask)
        d.ellipse((118, 120, 354, 390), fill=(255, 241, 170, 245))
        d.ellipse((206, 78, 426, 345), fill=(0, 0, 0, 0))
    elif kind == "star":
        pts = []
        for i in range(10):
            a = -pi / 2 + i * pi / 5
            r = 150 if i % 2 == 0 else 66
            pts.append((256 + cos(a) * r, 252 + sin(a) * r))
        d.polygon(pts, fill=(255, 221, 89, 255))
        d.line(pts + [pts[0]], fill=(221, 149, 39, 180), width=8)
    elif kind == "drop":
        d.pieslice((160, 90, 352, 365), 200, -20, fill=(94, 198, 255, 240))
        d.polygon([(256, 65), (170, 250), (342, 250)], fill=(94, 198, 255, 240))
        d.ellipse((207, 168, 253, 215), fill=(236, 250, 255, 150))
    elif kind == "gem":
        d.polygon([(256, 70), (392, 170), (338, 380), (174, 380), (120, 170)], fill=(78, 205, 196, 245))
        d.polygon([(256, 70), (318, 170), (256, 380), (194, 170)], fill=(193, 255, 245, 145))
    elif kind == "kite":
        d.polygon([(256, 55), (408, 226), (256, 405), (104, 226)], fill=(255, 144, 178, 245))
        d.polygon([(256, 55), (408, 226), (256, 226)], fill=(255, 218, 92, 230))
        d.line((256, 405, 238, 455, 272, 492), fill=(89, 72, 130, 180), width=6)
        d.text((225, 190), "A", fill=(255, 255, 255, 255), anchor="mm")
    elif kind == "balloon":
        d.ellipse((132, 70, 380, 345), fill=(95, 202, 255, 245))
        d.ellipse((178, 110, 235, 175), fill=(255, 255, 255, 115))
        d.polygon([(230, 342), (282, 342), (256, 388)], fill=(95, 202, 255, 245))
        d.line((256, 388, 256, 492), fill=(104, 88, 140, 150), width=5)
        d.text((256, 220), "7", fill=(255, 255, 255, 255), anchor="mm")
    elif kind == "heart":
        d.ellipse((120, 110, 270, 260), fill=(248, 113, 160, 245))
        d.ellipse((242, 110, 392, 260), fill=(248, 113, 160, 245))
        d.polygon([(126, 196), (386, 196), (256, 410)], fill=(248, 113, 160, 245))
    elif kind == "music":
        d.ellipse((125, 310, 210, 395), fill=(168, 85, 247, 245))
        d.rectangle((190, 95, 220, 350), fill=(168, 85, 247, 245))
        d.ellipse((292, 280, 377, 365), fill=(236, 72, 153, 245))
        d.rectangle((357, 75, 387, 320), fill=(236, 72, 153, 245))
        d.polygon([(220, 100), (387, 75), (387, 125), (220, 150)], fill=(217, 70, 239, 220))
    elif kind == "book":
        d.rounded_rectangle((105, 130, 255, 390), radius=30, fill=(99, 102, 241, 245))
        d.rounded_rectangle((257, 130, 407, 390), radius=30, fill=(14, 165, 233, 245))
        d.line((256, 140, 256, 388), fill=(255, 255, 255, 160), width=8)
    elif kind == "leaf":
        d.ellipse((110, 125, 405, 350), fill=(74, 222, 128, 235))
        d.line((148, 316, 380, 165), fill=(22, 101, 52, 150), width=9)
    elif kind == "drum":
        d.ellipse((128, 112, 384, 218), fill=(255, 255, 255, 245))
        d.rounded_rectangle((128, 165, 384, 382), radius=34, fill=(251, 113, 133, 245))
        d.ellipse((128, 320, 384, 425), fill=(190, 18, 60, 220))
        d.line((155, 170, 212, 365), fill=(255, 255, 255, 120), width=8)
        d.line((356, 170, 300, 365), fill=(255, 255, 255, 120), width=8)
    elif kind == "compass":
        d.ellipse((100, 100, 412, 412), fill=(255, 251, 235, 245), outline=(14, 165, 233, 180), width=16)
        d.polygon([(256, 128), (298, 260), (256, 384), (214, 260)], fill=(244, 63, 94, 230))
        d.polygon([(128, 256), (260, 214), (384, 256), (260, 298)], fill=(34, 197, 94, 210))
    save_png(img.filter(ImageFilter.GaussianBlur(0.2)), SPRITES / filename)


def make_sprites():
    make_cloud_sprite("cloud-soft-1.png", 1.0, (255, 255, 255, 235))
    make_cloud_sprite("cloud-soft-2.png", 0.78, (240, 250, 255, 235))
    make_cloud_sprite("cloud-peach.png", 0.86, (255, 239, 213, 232))
    for name, kind in [
        ("sun-medallion.png", "sun"),
        ("rainbow-arc.png", "rainbow"),
        ("moon-crescent.png", "moon"),
        ("star-gold.png", "star"),
        ("rain-drop.png", "drop"),
        ("aqua-gem.png", "gem"),
        ("letter-kite.png", "kite"),
        ("number-balloon.png", "balloon"),
        ("heart-balloon.png", "heart"),
        ("music-notes.png", "music"),
        ("story-book.png", "book"),
        ("leaf-glider.png", "leaf"),
        ("drum-cloud.png", "drum"),
        ("compass-orb.png", "compass"),
    ]:
        make_simple_icon(name, kind)


def main():
    ensure_dirs()
    make_backgrounds()
    make_sprites()


if __name__ == "__main__":
    main()
