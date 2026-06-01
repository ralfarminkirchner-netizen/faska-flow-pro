import { readFile, writeFile } from 'node:fs/promises';

const files = process.argv.slice(2);
const responsiveCss = `
html, body {
\twidth: 100%;
\theight: 100%;
\tmin-height: 100vh;
}

#canvas {
\twidth: 100vw !important;
\theight: 100vh !important;
\timage-rendering: pixelated;
\timage-rendering: crisp-edges;
}
`;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (source.includes('width: 100vw !important')) {
    continue;
  }
  const patched = source.replace('</style>', `${responsiveCss}\n\t\t</style>`);
  await writeFile(file, patched);
}
