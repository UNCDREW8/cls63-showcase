/**
 * Quick option: downloads the site's photographs from Wikimedia Commons
 * (free licence), crops them to each slot, applies a dark monochrome grade
 * and writes
 * them (plus a 1200w variant) to src/assets/cls63/.
 *
 *   npm run images          # skips slots that already have a file
 *   npm run images -- --force
 *
 * For the full black-car-on-black look (background removal), use
 * scripts/process_photos.py instead.
 *
 * Credits for every photo are listed in src/data/site.ts (`credits`)
 * and shown in the footer, as the CC BY / BY-SA licences require.
 */
import sharp from 'sharp';
import { mkdir, access, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/cls63');
const force = process.argv.includes('--force');
const C = 'https://upload.wikimedia.org/wikipedia/commons/';

/** slot → source + output size + crop gravity (sharp `position`) */
const jobs = [
  // Every photo: the same 2013 CLS63 AMG, by Michael Sheehan (CC BY 2.0).
  { slot: 'hero', src: C + 'a/af/Front_Overhead_-_2013_Mercedes_CLS_63_AMG_%289267459941%29.jpg', w: 2400, h: 1350, position: 'centre' },
  // profile stays uncropped at 1200×742: the light trace is drawn on it
  { slot: 'profile', src: C + '6/61/Side_View_-_2013_Mercedes_CLS_63_AMG_%289270241280%29.jpg', w: 1200, h: 742, position: 'centre' },
  { slot: 'headlight', src: C + '3/3a/Headlight_-_2013_Mercedes_CLS_63_AMG_%289267460829%29.jpg', w: 2400, h: 1350, position: 'centre' },
  { slot: 'rear', src: C + 'b/bd/Rear_-_2013_Mercedes_CLS_63_AMG_%289270242342%29.jpg', w: 2400, h: 1350, position: 'centre' },
  { slot: 'engine', src: C + 'e/e2/Engine_Close-up_-_2013_Mercedes_CLS_63_AMG_%289270242990%29.jpg', w: 1200, h: 1500, position: 'centre' },
  { slot: 'pause', src: C + '6/6e/Engine_-_2013_Mercedes_CLS_63_AMG_%289267461479%29.jpg', w: 2400, h: 1200, position: 'centre' },
  { slot: 'wheel', src: C + '9/98/Front_Wheel_-_2013_Mercedes_CLS_63_AMG_%289267460745%29.jpg', w: 1200, h: 1500, position: 'centre' },
  { slot: 'interior', src: C + '4/4e/Steering_Wheel_-_2013_Mercedes_CLS_63_AMG_%289267460443%29.jpg', w: 1600, h: 1200, position: 'centre' },
];

/** Soft vignette that pulls busy backgrounds down toward #080808. */
const vignette = (w, h) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><radialGradient id="v" cx="50%" cy="55%" r="75%">
      <stop offset="45%" stop-color="#080808" stop-opacity="0"/>
      <stop offset="100%" stop-color="#080808" stop-opacity="0.85"/>
    </radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#v)"/></svg>`);

export async function grade(input, { w, h, position }) {
  const base = await sharp(input)
    .rotate()
    .resize(w, h, { fit: 'cover', position, withoutEnlargement: false })
    .modulate({ saturation: 0.08, brightness: 0.74 }) // near-monochrome, darker
    .linear(1.18, -18) // a touch more contrast, deeper blacks
    .toBuffer();
  return sharp(base).composite([{ input: vignette(w, h) }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const job of jobs) {
    const target = path.join(OUT, `${job.slot}.jpg`);
    if (!force && (await exists(target))) {
      console.log(`skip  ${job.slot} (exists)`);
      continue;
    }
    process.stdout.write(`fetch ${job.slot} … `);
    const res = await fetch(job.src, { headers: { 'User-Agent': 'cls63-showcase/1.0 (image setup script)' } });
    if (!res.ok) throw new Error(`${job.slot}: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const full = await grade(buf, job);
    await writeFile(target, full);
    const small = await sharp(full).resize(1200).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    await writeFile(path.join(OUT, `${job.slot}-1200w.jpg`), small);
    console.log('done');
  }
  console.log(`\nImages written to ${OUT}. Rebuild with: npm run build`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
