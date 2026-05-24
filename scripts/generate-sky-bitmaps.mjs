import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "public", "sky-bitmaps");
const tmpDir = join(outDir, ".tmp-svg");

mkdirSync(outDir, { recursive: true });
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const python = process.env.PYTHON ?? "python3";

const run = (cmd, args) => {
  execFileSync(cmd, args, { stdio: "pipe" });
};

const renderSvgToPng = (name, svg) => {
  const svgPath = join(tmpDir, `${name}.svg`);
  const pngPath = join(outDir, `${name}.png`);
  writeFileSync(svgPath, svg);
  run("sips", ["-s", "format", "png", svgPath, "--out", pngPath]);
  return pngPath;
};

const convertBitmap = (src, dest, format, options = {}) => {
  const bg = options.background ?? "#ffffff";
  const quality = String(options.quality ?? (format === "WEBP" ? 82 : 88));
  run(python, [
    "-c",
    `
from PIL import Image
import sys

src, dest, fmt, bg, quality = sys.argv[1:]
quality = int(quality)
img = Image.open(src).convert("RGBA")

def hex_to_rgba(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i+2], 16) for i in (0, 2, 4)) + (255,)

if fmt in ("JPEG",):
    base = Image.new("RGBA", img.size, hex_to_rgba(bg))
    base.alpha_composite(img)
    img = base.convert("RGB")
    img.save(dest, fmt, quality=quality, optimize=True, progressive=True)
elif fmt == "WEBP":
    img.save(dest, fmt, quality=quality, method=6, lossless=False, exact=True)
elif fmt == "PNG":
    img.save(dest, fmt, optimize=True)
`,
    src,
    dest,
    format,
    bg,
    quality,
  ]);
};

const pngToOptimizedPng = (src) => convertBitmap(src, src, "PNG");
const pngToJpg = (src, dest, options) => convertBitmap(src, dest, "JPEG", options);
const pngToWebp = (src, dest, options) => convertBitmap(src, dest, "WEBP", options);

const svg = ({ width, height, body, defs = "" }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <filter id="tinyShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#44607a" flood-opacity=".16"/>
    </filter>
    ${defs}
  </defs>
  ${body}
</svg>`;

const cloud = (x, y, scale = 1, fill = "#ffffff", opacity = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}" filter="url(#tinyShadow)">
    <ellipse cx="142" cy="95" rx="118" ry="58" fill="${fill}"/>
    <circle cx="82" cy="92" r="56" fill="${fill}"/>
    <circle cx="146" cy="62" r="72" fill="${fill}"/>
    <circle cx="222" cy="86" r="60" fill="${fill}"/>
    <ellipse cx="152" cy="132" rx="142" ry="38" fill="${fill}"/>
  </g>`;

const sparkle = (x, y, r, fill = "#fff7bd", opacity = 1) => `
  <path d="M ${x} ${y - r} C ${x + r * .18} ${y - r * .22} ${x + r * .22} ${y - r * .18} ${x + r} ${y}
           C ${x + r * .22} ${y + r * .18} ${x + r * .18} ${y + r * .22} ${x} ${y + r}
           C ${x - r * .18} ${y + r * .22} ${x - r * .22} ${y + r * .18} ${x - r} ${y}
           C ${x - r * .22} ${y - r * .18} ${x - r * .18} ${y - r * .22} ${x} ${y - r} Z"
        fill="${fill}" opacity="${opacity}"/>`;

const star = (cx, cy, outer, inner, fill, stroke = "#d89e38") => {
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(2, outer * .06)}" stroke-linejoin="round"/>`;
};

const skyWorld = svg({
  width: 1600,
  height: 1000,
  defs: `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#79c7ff"/>
      <stop offset=".5" stop-color="#c8ecff"/>
      <stop offset="1" stop-color="#fff3c7"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff7ae"/>
      <stop offset=".55" stop-color="#ffe078" stop-opacity=".75"/>
      <stop offset="1" stop-color="#ffd36b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9e9a7"/>
      <stop offset="1" stop-color="#86cfa7"/>
    </linearGradient>
  `,
  body: `
    <rect width="1600" height="1000" fill="url(#sky)"/>
    <circle cx="1268" cy="214" r="208" fill="url(#sunGlow)"/>
    <circle cx="1268" cy="214" r="112" fill="#ffd96a" stroke="#fff2a9" stroke-width="10"/>
    <path d="M1175 220c33 35 151 35 184 0" fill="none" stroke="#ac7143" stroke-width="11" stroke-linecap="round"/>
    <circle cx="1230" cy="185" r="12" fill="#895b41"/><circle cx="1308" cy="185" r="12" fill="#895b41"/>
    <path d="M285 780 A520 520 0 0 1 1320 780" fill="none" stroke="#f06d83" stroke-width="42" stroke-linecap="round"/>
    <path d="M345 780 A460 460 0 0 1 1260 780" fill="none" stroke="#ffcf6c" stroke-width="42" stroke-linecap="round"/>
    <path d="M405 780 A400 400 0 0 1 1200 780" fill="none" stroke="#74c98e" stroke-width="42" stroke-linecap="round"/>
    <path d="M465 780 A340 340 0 0 1 1140 780" fill="none" stroke="#69aee8" stroke-width="42" stroke-linecap="round"/>
    ${cloud(74, 190, 1.12, "#ffffff", .92)}
    ${cloud(980, 452, .92, "#f9fdff", .94)}
    ${cloud(515, 96, .72, "#ffffff", .82)}
    ${sparkle(232, 126, 34, "#fff8c9", .95)}
    ${sparkle(416, 302, 22, "#ffffff", .85)}
    ${sparkle(1420, 392, 24, "#fff8c9", .9)}
    ${star(1045, 186, 38, 17, "#ffe685")}
    ${star(210, 492, 31, 14, "#fff2a1")}
    <path d="M0 820 C210 710 385 770 557 825 C740 882 925 800 1092 770 C1280 736 1432 778 1600 722 L1600 1000 L0 1000 Z" fill="url(#hill)"/>
    <path d="M0 900 C305 812 530 910 806 858 C1090 804 1307 922 1600 846 L1600 1000 L0 1000 Z" fill="#75bf96" opacity=".82"/>
  `,
});

const cloudFamily = svg({
  width: 1200,
  height: 520,
  body: `
    <rect width="1200" height="520" fill="none"/>
    ${cloud(64, 176, 1.55, "#ffffff", 1)}
    ${cloud(502, 82, 1.15, "#fbfdff", .98)}
    ${cloud(785, 238, .83, "#ffffff", .94)}
    <ellipse cx="468" cy="392" rx="300" ry="44" fill="#bcd8ea" opacity=".18" filter="url(#soft)"/>
  `,
});

const smilingSun = svg({
  width: 720,
  height: 720,
  defs: `
    <radialGradient id="warmSun" cx=".45" cy=".38" r=".62">
      <stop offset="0" stop-color="#fff7ae"/>
      <stop offset=".7" stop-color="#ffd35f"/>
      <stop offset="1" stop-color="#f7aa49"/>
    </radialGradient>
  `,
  body: `
    <rect width="720" height="720" fill="none"/>
    <g transform="translate(360 360)">
      ${Array.from({ length: 18 }, (_, i) => {
        const angle = (i * 20 * Math.PI) / 180;
        const x1 = Math.cos(angle) * 190;
        const y1 = Math.sin(angle) * 190;
        const x2 = Math.cos(angle) * 292;
        const y2 = Math.sin(angle) * 292;
        return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#ffd15e" stroke-width="30" stroke-linecap="round" opacity=".72"/>`;
      }).join("")}
      <circle r="190" fill="url(#warmSun)" stroke="#fff0a4" stroke-width="12" filter="url(#tinyShadow)"/>
      <circle cx="-66" cy="-44" r="19" fill="#865942"/>
      <circle cx="66" cy="-44" r="19" fill="#865942"/>
      <circle cx="-115" cy="18" r="26" fill="#ffae78" opacity=".46"/>
      <circle cx="115" cy="18" r="26" fill="#ffae78" opacity=".46"/>
      <path d="M-75 58 C-30 108 32 108 77 58" fill="none" stroke="#865942" stroke-width="16" stroke-linecap="round"/>
    </g>
  `,
});

const rainbowArc = svg({
  width: 1200,
  height: 720,
  body: `
    <rect width="1200" height="720" fill="none"/>
    <path d="M115 620 A485 485 0 0 1 1085 620" fill="none" stroke="#f37786" stroke-width="62" stroke-linecap="round"/>
    <path d="M190 620 A410 410 0 0 1 1010 620" fill="none" stroke="#ffc95d" stroke-width="62" stroke-linecap="round"/>
    <path d="M265 620 A335 335 0 0 1 935 620" fill="none" stroke="#78cc91" stroke-width="62" stroke-linecap="round"/>
    <path d="M340 620 A260 260 0 0 1 860 620" fill="none" stroke="#6eafe7" stroke-width="62" stroke-linecap="round"/>
    ${cloud(38, 520, .82, "#ffffff", 1)}
    ${cloud(870, 520, .82, "#ffffff", 1)}
  `,
});

const sparkleStars = svg({
  width: 900,
  height: 560,
  body: `
    <rect width="900" height="560" fill="none"/>
    ${star(155, 132, 62, 29, "#ffe789")}
    ${star(444, 92, 42, 20, "#fff2a6")}
    ${star(712, 164, 70, 31, "#ffd978")}
    ${star(308, 360, 53, 24, "#fff0a1")}
    ${star(617, 390, 46, 22, "#ffe38a")}
    ${sparkle(78, 320, 28, "#ffffff", .95)}
    ${sparkle(814, 326, 36, "#fff7bf", .95)}
    ${sparkle(500, 242, 24, "#ffffff", .9)}
    ${sparkle(238, 226, 18, "#fff8c9", .9)}
  `,
});

const treasureInstruments = svg({
  width: 1400,
  height: 900,
  defs: `
    <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#516aa3"/>
      <stop offset=".62" stop-color="#8bc0dd"/>
      <stop offset="1" stop-color="#f5d493"/>
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c47a43"/>
      <stop offset="1" stop-color="#91542f"/>
    </linearGradient>
  `,
  body: `
    <rect width="1400" height="900" rx="0" fill="url(#night)"/>
    <circle cx="1160" cy="142" r="92" fill="#ffe18a"/>
    ${cloud(70, 106, .75, "#ffffff", .66)}
    ${cloud(995, 292, .65, "#ffffff", .7)}
    ${star(192, 162, 45, 21, "#ffe98e")}
    ${star(410, 104, 32, 15, "#fff3aa")}
    ${star(756, 195, 38, 18, "#ffe98e")}
    ${sparkle(1332, 104, 28, "#ffffff", .84)}
    <g transform="translate(118 494)" filter="url(#tinyShadow)">
      <path d="M52 108 h356 l-32 216 H84 Z" fill="url(#wood)" stroke="#744125" stroke-width="9" stroke-linejoin="round"/>
      <path d="M86 60 h286 q46 0 54 48 l13 82 H21 l13-82 q8-48 52-48 Z" fill="#d8934f" stroke="#744125" stroke-width="9"/>
      <rect x="42" y="170" width="384" height="54" fill="#f2bd68" opacity=".55"/>
      <rect x="204" y="44" width="58" height="302" fill="#f3c268" stroke="#744125" stroke-width="8"/>
      <circle cx="234" cy="200" r="34" fill="#ffe07b" stroke="#744125" stroke-width="7"/>
      ${sparkle(326, 150, 34, "#fff4a8", 1)}
      ${sparkle(132, 262, 26, "#fff4a8", 1)}
    </g>
    <g transform="translate(626 540)" filter="url(#tinyShadow)">
      <rect x="10" y="210" width="390" height="28" rx="14" fill="#7b5946"/>
      <rect x="36" y="176" width="24" height="106" rx="12" fill="#7b5946"/>
      <rect x="342" y="176" width="24" height="106" rx="12" fill="#7b5946"/>
      ${["#f26f72","#ffb85c","#f7df6b","#78c986","#5fb0e5","#8c83d8"].map((color, i) => {
        const x = 40 + i * 58;
        const h = 122 - i * 10;
        return `<rect x="${x}" y="${78 + i * 9}" width="48" height="${h}" rx="18" fill="${color}" stroke="#5e5a63" stroke-width="5"/>`;
      }).join("")}
      <line x1="96" y1="60" x2="212" y2="20" stroke="#6b5141" stroke-width="14" stroke-linecap="round"/>
      <circle cx="226" cy="16" r="20" fill="#ffe08a" stroke="#6b5141" stroke-width="6"/>
    </g>
    <g transform="translate(1024 564)" filter="url(#tinyShadow)">
      <ellipse cx="134" cy="152" rx="104" ry="62" fill="#da8f67" stroke="#6d4a3b" stroke-width="8"/>
      <ellipse cx="134" cy="98" rx="104" ry="62" fill="#ffe1a5" stroke="#6d4a3b" stroke-width="8"/>
      <path d="M31 96 v58 c0 36 46 65 103 65s103-29 103-65 V96" fill="#c87154" opacity=".95"/>
      <path d="M50 178 C94 204 177 204 220 178" fill="none" stroke="#8f4f40" stroke-width="8" stroke-linecap="round"/>
      <line x1="44" y1="36" x2="10" y2="2" stroke="#705044" stroke-width="12" stroke-linecap="round"/>
      <line x1="224" y1="36" x2="258" y2="2" stroke="#705044" stroke-width="12" stroke-linecap="round"/>
    </g>
    <g transform="translate(706 294) rotate(-14)" filter="url(#tinyShadow)">
      <rect x="0" y="0" width="405" height="34" rx="17" fill="#e9cd90" stroke="#6d5941" stroke-width="6"/>
      <circle cx="376" cy="17" r="34" fill="#f2d998" stroke="#6d5941" stroke-width="6"/>
      <circle cx="377" cy="17" r="13" fill="#8a6749"/>
    </g>
  `,
});

const assets = [
  {
    name: "sky-world",
    source: skyWorld,
    jpg: { background: "#bfe7ff", quality: 88 },
    webp: { quality: 82 },
  },
  {
    name: "cloud-family",
    source: cloudFamily,
    webp: { quality: 84 },
  },
  {
    name: "sun-smile",
    source: smilingSun,
    webp: { quality: 86 },
  },
  {
    name: "rainbow-arc",
    source: rainbowArc,
    jpg: { background: "#d9f2ff", quality: 88 },
    webp: { quality: 84 },
  },
  {
    name: "star-sparkles",
    source: sparkleStars,
    webp: { quality: 86 },
  },
  {
    name: "treasure-instruments",
    source: treasureInstruments,
    jpg: { background: "#8bc0dd", quality: 88 },
    webp: { quality: 82 },
  },
];

for (const asset of assets) {
  const png = renderSvgToPng(asset.name, asset.source);
  pngToOptimizedPng(png);
  if (asset.jpg) {
    pngToJpg(png, join(outDir, `${asset.name}.jpg`), asset.jpg);
  }
  if (asset.webp) {
    pngToWebp(png, join(outDir, `${asset.name}.webp`), asset.webp);
  }
}

rmSync(tmpDir, { recursive: true, force: true });
