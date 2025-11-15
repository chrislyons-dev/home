/* eslint-env node */

import { Buffer } from 'node:buffer';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));
const { console } = globalThis;

const svgSources = [
  {
    input: 'cl_dark_graphite-green.svg',
    basename: 'cl_dark_graphite-green',
  },
  {
    input: 'cl_light_graphite-green.svg',
    basename: 'cl_light_graphite-green',
  },
];

const rasterSizes = [32, 64, 180];
const icoSizes = [16, 32, 48];

const resolvePublicPath = (relativePath) => path.join(PUBLIC_DIR, relativePath);

const createPng = async (input, output, size) => {
  const buffer = await sharp(input)
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  await fs.writeFile(output, buffer);
};

const createIcoBuffer = (images) => {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const directoryEntries = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bit depth
    entry.writeUInt32LE(buffer.length, 8); // size of bitmap
    entry.writeUInt32LE(offset, 12); // offset to bitmap

    offset += buffer.length;
    directoryEntries.push(entry);
  }

  const imageBuffers = images.map(({ buffer }) => buffer);
  return Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
};

const createIconSet = async ({ input, basename }) => {
  const inputPath = resolvePublicPath(input);

  for (const size of rasterSizes) {
    const outputPath = resolvePublicPath(`${basename}_${size}.png`);
    await createPng(inputPath, outputPath, size);
  }

  const icoImages = [];
  for (const size of icoSizes) {
    const buffer = await sharp(inputPath)
      .resize(size, size, { fit: 'contain' })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    icoImages.push({ size, buffer });
  }

  const icoBuffer = createIcoBuffer(icoImages);
  const icoPath = resolvePublicPath(`${basename}.ico`);
  await fs.writeFile(icoPath, icoBuffer);
};

const main = async () => {
  await Promise.all(svgSources.map(createIconSet));
  console.log('Graphite-green icon set generated.');
};

main().catch((error) => {
  console.error('Failed to generate graphite-green icons:', error);
  process.exitCode = 1;
});
