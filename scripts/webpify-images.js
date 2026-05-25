import {
  appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync,
} from 'fs';
import { extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import * as p from '@clack/prompts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATIC = resolve(ROOT, 'static');
const STATIC_MEDIA = resolve(STATIC, 'media');
const SRC = resolve(ROOT, 'src');
const LOGS = resolve(ROOT, 'script-logs');
const LOG_FILE = join(LOGS, 'webpify.log');

if (!existsSync(LOGS)) mkdirSync(LOGS, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.tif', '.bmp'];
const ALL_IMAGE_EXTS = [...IMAGE_EXTS, '.webp', '.svg'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.svelte-kit', 'build', 'docs', 'package', '.vscode']);

function sep(ch = '─') { return ch.repeat(60); }

function fmtBytes(b) {
  if (b < 1024) return b + 'B';
  if (b < 1048576) return (b / 1024).toFixed(1) + 'KB';
  return (b / 1048576).toFixed(1) + 'MB';
}

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function readText(fp) {
  try { return readFileSync(fp, 'utf-8'); } catch { return ''; }
}

// ── Logging (console + file) ─────────────────────────────────────

function log(msg) {
  p.log.message(msg);
  try { appendFileSync(LOG_FILE, msg + '\n'); } catch {}
}

function logRaw(msg) {
  try { appendFileSync(LOG_FILE, msg + '\n'); } catch {}
}

function logBlock(title, lines) {
  const h = `  ${title}`;
  const b = lines.map(l => `    ${l}`);
  logRaw('');
  logRaw(sep('═'));
  logRaw(h);
  logRaw(sep('─'));
  b.forEach(l => logRaw(l));
  logRaw(sep('═'));
  logRaw('');
}

// ── Convert images ───────────────────────────────────────────────

async function runConvert(force) {
  const t0 = Date.now();
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const scanDir = await promptScanDir('convert');
  if (!scanDir) process.exit(0);

  const s = p.spinner();
  s.start('Scanning images...');

  const allFiles = walkDir(scanDir);
  const images = allFiles.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()));
  const existingWebps = allFiles.filter(f => f.endsWith('.webp')).length;

  const needConvert = force
    ? images
    : images.filter(f => !existsSync(f.replace(extname(f).toLowerCase(), '.webp')));

  const label = scanDir === STATIC ? 'static/' : relative(STATIC, scanDir);
  s.stop(`${label}: ${images.length} images · ${existingWebps} existing webp · ${needConvert.length} to convert`);

  const logLines = [
    `WebP conversion  ·  ${ts}  ·  mode: ${force ? 'force' : 'missing'}  ·  dir: ${label}`,
    `Source images: ${images.length}  |  Existing .webp: ${existingWebps}  |  To convert: ${needConvert.length}`,
  ];

  if (needConvert.length === 0) {
    log('✓ All images already have corresponding .webp files (use --force to reconvert).');
    logBlock('WebP conversion', logLines);
    return;
  }

  const prog = p.progress();
  prog.start(needConvert.length, needConvert.length);
  let converted = 0;
  let failed = 0;
  let totalSrc = 0;
  let totalOut = 0;

  for (let i = 0; i < needConvert.length; i++) {
    prog.message(`Converting ${i + 1}/${needConvert.length}`);
    const file = needConvert[i];
    const ext = extname(file).toLowerCase();
    const outPath = file.replace(ext, '.webp');
    let srcStat;
    try { srcStat = statSync(file); } catch { continue; }

    const rel = relative(STATIC, file);
    try {
      const img = sharp(file);
      const metadata = await img.metadata();
      await img.webp({ quality: metadata.quality || 80, effort: 4 }).toFile(outPath);

      const outSize = statSync(outPath).size;
      const srcSize = srcStat.size;
      const saved = ((1 - outSize / srcSize) * 100).toFixed(1);
      const line = `+ ${rel}  ${fmtBytes(srcSize)} → ${fmtBytes(outSize)}  (${saved}% saved)`;
      logRaw(line);
      converted++;
      totalSrc += srcSize;
      totalOut += outSize;
    } catch (err) {
      logRaw(`✗ ${rel}  ${err.message}`);
      failed++;
    }
    prog.advance();
  }

  prog.stop(`Converted ${converted}, failed ${failed}`);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const summary = converted > 0
    ? `Total: ${fmtBytes(totalSrc)} → ${fmtBytes(totalOut)} (${((1 - totalOut / totalSrc) * 100).toFixed(1)}% saved)`
    : '';
  logLines.push(`${converted} converted, ${failed} failed, ${needConvert.length - converted - failed} skipped  ·  ${elapsed}s`);
  if (summary) logLines.push(summary);
  logBlock('WebP conversion', logLines);
}

// ── Check references ─────────────────────────────────────────────

function gatherRefs(srcFiles) {
  const refs = new Set();
  const dynamicDirs = new Map();

  for (const f of srcFiles) {
    const content = readText(f);
    if (!content) continue;

    for (const m of content.matchAll(/asset\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g))
      refs.add(m[1].replace(/^\//, ''));

    for (const m of content.matchAll(/['"`(](\/media\/[^'"`)\s?#]+)/g))
      refs.add(m[1].replace(/^\//, ''));

    for (const m of content.matchAll(/%sveltekit\.assets%\/([^'"`\s?#]+)/g))
      refs.add(m[1]);

    for (const m of content.matchAll(/^(?:image|img):\s+(.+)$/gm)) {
      const v = m[1].trim().replace(/['"]/g, '');
      refs.add(v);
      const ext = extname(v).toLowerCase();
      if (ext && ALL_IMAGE_EXTS.includes(ext) && !v.includes('/'))
        refs.add('media/share-images/' + v);
    }

    for (const m of content.matchAll(/(?:^|,|\s|['"`]|>)([\w@\-]+\.(?:webp|png|jpg|jpeg|gif|svg))\b/g))
      refs.add(m[1]);

    if (content.includes('soulace') && content.includes('screens') && content.includes('.webp'))
      dynamicDirs.set('media/projects/soulace/screens', true);
  }

  if (dynamicDirs.size > 0) {
    const allStatic = walkDir(STATIC);
    for (const dir of dynamicDirs.keys()) {
      for (const f of allStatic) {
        const rel = relative(STATIC, f).replace(/\\/g, '/');
        if (rel.startsWith(dir + '/')) refs.add(rel);
      }
    }
  }

  return refs;
}

function isReferenced(webPath, refs) {
  if (refs.has(webPath)) return true;
  const filename = webPath.split('/').pop();
  if (refs.has(filename)) return true;
  for (const r of refs) {
    if (webPath === r || webPath.startsWith(r + '/') || r.startsWith(webPath + '/') || webPath.endsWith('/' + r))
      return true;
  }
  return false;
}

function findRefLines(webPath, files) {
  const results = [];
  const filename = webPath.split('/').pop();
  const patterns = [webPath, filename];
  if (webPath.startsWith('media/')) patterns.push('/' + webPath);

  for (const f of files) {
    const content = readText(f);
    if (!content) continue;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const p of patterns) {
        if (lines[i].includes(p)) {
          results.push([relative(SRC, f).replace(/\\/g, '/'), i + 1]);
          break;
        }
      }
    }
  }
  return results;
}

async function runCheck() {
  const t0 = Date.now();
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const scanDir = await promptScanDir('check');
  if (!scanDir) process.exit(0);

  const s = p.spinner();
  s.start('Scanning source files...');

  const allStatic = walkDir(scanDir);
  const staticImages = allStatic.filter(f => ALL_IMAGE_EXTS.includes(extname(f).toLowerCase()));

  const srcFiles = walkDir(SRC).filter(f =>
    ['.svelte', '.md', '.js', '.ts', '.html', '.css', '.scss', '.csv', '.json'].includes(extname(f).toLowerCase()),
  );

  const refs = gatherRefs(srcFiles);
  const label = scanDir === STATIC ? 'static/' : relative(STATIC, scanDir);
  s.stop(`${label}: ${staticImages.length} images, ${srcFiles.length} source files`);

  const staticMap = new Map();
  for (const f of staticImages)
    staticMap.set(relative(STATIC, f).replace(/\\/g, '/'), f);

  const jpegPngReferenced = [];
  const jpegPngUnreferenced = [];
  const otherUnreferenced = [];

  for (const [webPath, fullPath] of staticMap) {
    const ext = extname(webPath).toLowerCase();
    const isJpegPng = ['.jpg', '.jpeg', '.png'].includes(ext);
    const refd = isReferenced(webPath, refs);
    if (isJpegPng && refd) jpegPngReferenced.push({ webPath, fullPath });
    else if (isJpegPng) jpegPngUnreferenced.push({ webPath, fullPath });
    else if (!refd) otherUnreferenced.push({ webPath, fullPath });
  }

  const logLines = [
    `Image reference report  ·  ${ts}`,
    `Static images: ${staticImages.length}  ·  Source files: ${srcFiles.length}`,
    `Referenced: ${jpegPngReferenced.length + (staticImages.length - jpegPngUnreferenced.length - otherUnreferenced.length)}  ·  Unreferenced: ${jpegPngUnreferenced.length + otherUnreferenced.length}`,
  ];

  logLines.push('');
  if (jpegPngReferenced.length > 0) {
    logLines.push(`⚠ JPEG/PNG still referenced from code (${jpegPngReferenced.length}):`);
    for (const u of jpegPngReferenced) {
      const lines = findRefLines(u.webPath, srcFiles);
      const size = statSync(u.fullPath).size;
      logLines.push(`  ${u.webPath}  (${fmtBytes(size)})`);
      for (const [file, line] of lines.slice(0, 2))
        logLines.push(`    → ${file}:${line}`);
      if (lines.length > 2) logLines.push(`    → … and ${lines.length - 2} more`);
      logLines.push('');
    }
  } else {
    logLines.push('✓ No JPEG/PNG referenced — all images use webp in source.');
    logLines.push('');
  }

  if (jpegPngUnreferenced.length > 0) {
    logLines.push(`JPEG/PNG not referenced (${jpegPngUnreferenced.length}) — can be removed:`);
    for (const u of jpegPngUnreferenced) {
      const size = statSync(u.fullPath).size;
      logLines.push(`  ${u.webPath}  (${fmtBytes(size)})`);
    }
    logLines.push('');
  }

  if (otherUnreferenced.length > 0) {
    logLines.push(`Other (webp/gif/svg) not referenced (${otherUnreferenced.length}):`);
    for (const u of otherUnreferenced) {
      const size = statSync(u.fullPath).size;
      logLines.push(`  ${u.webPath}  (${fmtBytes(size)})`);
    }
  }

  logLines.push(`Done  ·  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  logBlock('Image reference report', logLines);

  // Also print key findings to console
  if (jpegPngReferenced.length > 0) {
    p.note(
      jpegPngReferenced.map(u => `  ${u.webPath}`).join('\n'),
      `⚠ JPEG/PNG still referenced (${jpegPngReferenced.length})`,
    );
  } else {
    p.log.success('✓ No JPEG/PNG referenced — all images use webp in source.');
  }

  if (jpegPngUnreferenced.length > 0) {
    p.log.info(`JPEG/PNG not referenced: ${jpegPngUnreferenced.length} files can be removed`);
  }
}

// ── Directory prompt ────────────────────────────────────────────

async function promptScanDir(forWhat) {
  // Start by listing subdirs of static/media/
  const topDirs = readdirSync(STATIC_MEDIA, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name)
    .sort();

  const options = [
    { value: '__all_static__', label: 'Entire static/', hint: 'all images' },
    ...topDirs.map(d => ({ value: d, label: d, hint: 'static/media/' + d })),
    { value: '__custom__', label: 'Custom subdirectory' },
  ];

  const pick = await p.select({
    message: `Which directory to ${forWhat}?`,
    options,
  });
  if (p.isCancel(pick)) return null;

  if (pick === '__all_static__') return STATIC;
  if (pick === '__custom__') {
    const custom = await p.text({
      message: 'Path relative to static/',
      placeholder: 'e.g., media/textures',
      validate: (v) => {
        if (!v) return 'Required';
        const fp = join(STATIC, v);
        if (!existsSync(fp)) return `Not found: static/${v}`;
        return;
      },
    });
    if (p.isCancel(custom)) return null;
    return join(STATIC, custom);
  }

  return drillInto(join(STATIC_MEDIA, pick), forWhat);
}

async function drillInto(dir, forWhat) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name).sort();
  const hasImages = entries.some(e => e.isFile() && IMAGE_EXTS.includes(extname(e.name).toLowerCase()));

  const label = relative(STATIC, dir);

  // Leaf: no subdirs, just use it
  if (subdirs.length === 0) return dir;

  // Has subdirs — ask what to do
  const options = [];
  if (hasImages) {
    options.push({ value: '__all__', label: `All images in ${label}`, hint: 'scan this dir too' });
  }
  for (const sd of subdirs) {
    options.push({ value: sd, label: sd, hint: join(label, sd) });
  }

  const pick = await p.select({
    message: `${label} has subdirectories. Scan all or pick one?`,
    options,
  });
  if (p.isCancel(pick)) return null;

  if (pick === '__all__') return dir;
  return drillInto(join(dir, pick), forWhat);
}

// ── Main CLI ─────────────────────────────────────────────────────

async function main() {
  p.intro('⚡ webpify');

  const hasFlags = process.argv.includes('--force') || process.argv.includes('--check') || process.argv.includes('--convert');

  if (hasFlags) {
    // Non-interactive mode
    if (process.argv.includes('--check')) {
      await runCheck();
    } else {
      const force = process.argv.includes('--force');
      await runConvert(force);
    }
  } else {
    // Interactive mode with clack prompts
    const action = await p.select({
      message: 'What do you want to do?',
      options: [
        { value: 'convert', label: 'Convert images', hint: 'jpg/png/gif → webp' },
        { value: 'check', label: 'Check references', hint: 'find unused & non-webp references' },
        { value: 'both', label: 'Do both', hint: 'convert then check' },
      ],
    });

    let force = false;
    if (action === 'convert' || action === 'both') {
      force = await p.confirm({
        message: 'Force reconvert all images?',
        activeLabel: 'Yes (overwrite existing .webp)',
        inactiveLabel: 'No (only convert missing)',
      });
    }

    if (action === 'convert') {
      await runConvert(force);
    } else if (action === 'check') {
      await runCheck();
    } else {
      await runConvert(force);
      await runCheck();
    }
  }

  p.outro(`Done · log: ${relative(ROOT, LOG_FILE)}`);
}

main().catch(err => {
  p.cancel('Script failed');
  console.error(err);
  try { appendFileSync(LOG_FILE, `\nFATAL: ${err.message}\n`); } catch {}
  process.exit(1);
});
