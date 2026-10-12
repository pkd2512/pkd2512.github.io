// Writes src/lib/data/media-manifest.json: a short content hash for every file
// in static/media. src/utils/media.js appends it to image URLs as ?v=<hash>, so
// a replaced image gets a new URL and no browser can serve the old copy, which
// is what lets /media be cached for a year (see vercel.json).
//
// Runs as part of `pnpm build`. The generated file is committed so that dev
// and a plain `vite build` work without it.
import { createHash } from 'crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MEDIA = join(ROOT, 'static', 'media');
const OUT = join(ROOT, 'src', 'lib', 'data', 'media-manifest.json');

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

/** @type {Record<string, string>} */
const manifest = {};
for (const file of walk(MEDIA).sort()) {
  const key = relative(MEDIA, file).split('\\').join('/');
  manifest[key] = createHash('md5')
    .update(readFileSync(file))
    .digest('hex')
    .slice(0, 8);
}

const json = JSON.stringify(manifest, null, 0) + '\n';
mkdirSync(dirname(OUT), { recursive: true });

// Leave the file alone when nothing changed, so builds don't touch git.
if (!existsSync(OUT) || readFileSync(OUT, 'utf-8') !== json) {
  writeFileSync(OUT, json);
  console.log(`media manifest: wrote ${Object.keys(manifest).length} files`);
} else {
  console.log(`media manifest: up to date (${Object.keys(manifest).length} files)`);
}
