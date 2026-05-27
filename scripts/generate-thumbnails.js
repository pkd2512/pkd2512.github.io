import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { select, text, isCancel, cancel, outro, spinner } from '@clack/prompts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const MEDIA_ROOT = resolve(ROOT, 'static', 'media', 'projects');

async function main() {
  const dirs = readdirSync(MEDIA_ROOT)
    .filter((d) => {
      const p = join(MEDIA_ROOT, d);
      return statSync(p).isDirectory();
    })
    .sort();

  if (!dirs.length) {
    cancel('No project media folders found under static/media/projects/');
    process.exit(1);
  }

  const folder = await select({
    message: 'Which media folder?',
    options: dirs.map((d) => ({ label: d, value: d })),
  });
  if (isCancel(folder)) { cancel('Cancelled'); process.exit(0); }

  const sizeStr = await text({
    message: 'Output width in pixels (height auto)?',
    placeholder: '300',
    validate: (v) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 1) return 'Enter a positive number';
    },
  });
  if (isCancel(sizeStr)) { cancel('Cancelled'); process.exit(0); }

  const SIZE = parseInt(sizeStr, 10);
  const QUALITY = 60;
  const SRC_DIR = join(MEDIA_ROOT, folder);
  const OUT_DIR = join(SRC_DIR, `thumbs_${SIZE}`);

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(SRC_DIR)
    .filter((f) => extname(f).toLowerCase() === '.webp')
    .sort();

  if (!files.length) {
    cancel(`No images found in ${relative(ROOT, SRC_DIR)}`);
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
    const src = join(SRC_DIR, file);
    const out = join(OUT_DIR, file);

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
      spin.message(`${made + skipped}/${files.length} — ${file}`);
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
