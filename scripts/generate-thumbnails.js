import {
  cancel,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { extname, join, relative, resolve } from 'path';

import { fileURLToPath } from 'url';
import sharp from 'sharp';
import slugify from 'slugify';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const MEDIA_ROOT = resolve(ROOT, 'static', 'media', 'projects');

/**
 * Originals live in `<project>/images/` and thumbnails go into sibling
 * folders `<project>/thumbs_<w>/`. Output filenames are slugified so
 * the gallery component can build URLs from the entry's id without
 * worrying about the original (possibly messy) filename.
 *
 * Legacy fallback: if `<project>/images/` doesn't exist, we read from
 * the project directory root (the pre-refactor layout) and warn.
 */
async function main() {
  const projects = readdirSync(MEDIA_ROOT)
    .filter((d) => {
      const p = join(MEDIA_ROOT, d);
      return statSync(p).isDirectory();
    })
    .sort();

  if (!projects.length) {
    cancel('No project media folders found under static/media/projects/');
    process.exit(1);
  }

  const folder = await select({
    message: 'Which project folder?',
    options: projects.map((d) => ({ label: d, value: d })),
  });
  if (isCancel(folder)) {
    cancel('Cancelled');
    process.exit(0);
  }

  const PROJECT_DIR = join(MEDIA_ROOT, folder);
  const IMAGES_DIR = join(PROJECT_DIR, 'images');
  const SRC_DIR = existsSync(IMAGES_DIR) ? IMAGES_DIR : PROJECT_DIR;

  if (SRC_DIR === PROJECT_DIR) {
    log.warn(
      'No `images/` subfolder found — falling back to the project root.\n' +
        'Move source images into `images/` to use the new layout.'
    );
  }

  const sizeStr = await text({
    message: 'Output width in pixels (height auto)?',
    placeholder: '600',
    validate: (v) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 1) return 'Enter a positive number';
    },
  });
  if (isCancel(sizeStr)) {
    cancel('Cancelled');
    process.exit(0);
  }

  const SIZE = parseInt(sizeStr, 10);
  const QUALITY = 60;
  const OUT_DIR = join(PROJECT_DIR, `thumbs_${SIZE}`);

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(SRC_DIR)
    .filter((f) => extname(f).toLowerCase() === '.webp')
    .sort();

  if (!files.length) {
    cancel(`No .webp images found in ${relative(ROOT, SRC_DIR)}`);
    process.exit(0);
  }

  outro(`Found ${files.length} images → ${relative(ROOT, OUT_DIR)}/`);

  const spin = spinner();
  spin.start('Generating thumbnails');

  let made = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = extname(file);
    const name = file.slice(0, -ext.length);
    // Output is named after the slug, not the source filename, so the
    // gallery URL `<dir>/images/<slug>.webp` and the corresponding
    // thumb `<dir>/thumbs_<w>/<slug>.webp` always match.
    const slug = slugify(name, { lower: true, strict: true });
    const outFile = `${slug}${ext}`;

    const src = join(SRC_DIR, file);
    const out = join(OUT_DIR, outFile);

    if (existsSync(out)) {
      const sStat = statSync(src);
      const oStat = statSync(out);
      if (oStat.mtimeMs >= sStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    try {
      await sharp(src)
        .resize({ width: SIZE })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(out);
      made++;
      spin.message(`${made + skipped}/${files.length} — ${outFile}`);
    } catch (err) {
      failed++;
    }
  }

  spin.stop(`Done — ${made} generated · ${skipped} skipped · ${failed} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
