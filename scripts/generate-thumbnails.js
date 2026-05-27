/**
 * Generate 50x50 thumbnails for gallery images.
 *
 * Reads every .webp in static/media/projects/dataviz-gallery/ and writes a
 * cover-cropped 50x50 thumbnail to static/media/projects/dataviz-gallery/thumbs/.
 *
 * Idempotent: skips thumbs that already exist and are newer than the source.
 * Pass --force to regenerate.
 */
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import { extname, join, relative, resolve } from 'path';

import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATIC_MEDIA = resolve(ROOT, 'static', 'media');
const SRC_DIR = resolve(STATIC_MEDIA, 'projects', 'dataviz-gallery');
const OUT_DIR = resolve(SRC_DIR, 'thumbs');
const LOGS = resolve(ROOT, 'script-logs');
const LOG_FILE = join(LOGS, 'thumbnails.log');

const SIZE = 50;
const QUALITY = 60;
const force = process.argv.includes('--force');

function ensureDir(d) {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}

function logLine(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  try {
    appendFileSync(LOG_FILE, `[${ts}] ${msg}\n`);
  } catch {}
}

async function main() {
  ensureDir(LOGS);
  if (!existsSync(SRC_DIR)) {
    console.error(`Source not found: ${SRC_DIR}`);
    process.exit(1);
  }
  ensureDir(OUT_DIR);

  const files = readdirSync(SRC_DIR)
    .filter((f) => extname(f).toLowerCase() === '.webp')
    .sort();

  console.log(
    `Found ${files.length} source images in ${relative(ROOT, SRC_DIR)}`
  );

  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const src = join(SRC_DIR, file);
    const out = join(OUT_DIR, file);

    if (!force && existsSync(out)) {
      const sStat = statSync(src);
      const oStat = statSync(out);
      if (oStat.mtimeMs >= sStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    try {
      await sharp(src)
        .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(out);
      made++;
      process.stdout.write(`\r  generating ${i + 1}/${files.length}`);
    } catch (err) {
      failed++;
      logLine(`FAIL ${file} — ${err.message}`);
    }
  }

  if (files.length) process.stdout.write('\n');

  const summary = `Done — ${made} generated · ${skipped} skipped · ${failed} failed`;
  console.log(summary);
  logLine(summary);
}

main().catch((err) => {
  console.error(err);
  logLine(`FATAL: ${err.message}`);
  process.exit(1);
});
