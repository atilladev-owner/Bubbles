/**
 * Rasterises the bubbles mark to the app icon sizes and writes the favicon.
 * Run through `npm run icons`, and by `npm run build` before Vite copies public/.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { markSvg } from '../src/lib/mark.ts';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '..', 'public');
const iconsDir = join(publicDir, 'icons');

const SIZES = [512, 192, 180];

async function main(): Promise<void> {
  await mkdir(iconsDir, { recursive: true });

  const svg = Buffer.from(markSvg(true));
  for (const size of SIZES) {
    const out = join(iconsDir, 'icon-' + size + '.png');
    await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
    console.log('wrote', out);
  }

  const favicon = join(publicDir, 'favicon.svg');
  await writeFile(favicon, markSvg(true) + '\n', 'utf8');
  console.log('wrote', favicon);
}

await main();
