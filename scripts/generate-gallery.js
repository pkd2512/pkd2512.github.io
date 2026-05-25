import * as p from '@clack/prompts';

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { basename, extname, join, resolve } from 'path';

import { fileURLToPath } from 'url';
import slugify from 'slugify';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATIC_MEDIA = resolve(ROOT, 'static', 'media');
const DATA = resolve(ROOT, 'src/contents/data');
const LOGS = resolve(ROOT, 'script-logs');
const LOG_FILE = join(LOGS, 'gallery.log');

const WEBP_ONLY = new Set(['.webp']);
const ALL_IMAGE_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.tiff',
  '.tif',
]);

const COLUMNS = ['id', 'title', 'url', 'ref_url', 'graphic_type', 'category'];

// ── Logging ───────────────────────────────────────────────────────

function ensureLogs() {
  if (!existsSync(LOGS)) mkdirSync(LOGS, { recursive: true });
}

function logLine(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  try {
    appendFileSync(LOG_FILE, `[${ts}] ${msg}\n`);
  } catch {}
}

// ── CSV helpers ──────────────────────────────────────────────────

function csvParse(text) {
  const rows = [];
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return rows;
  const header = parseLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length === 0) continue;
    const row = {};
    header.forEach((h, j) => {
      row[h] = vals[j] || '';
    });
    rows.push(row);
  }
  return rows;
}

function parseLine(line) {
  const vals = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQ = true;
      } else if (c === ',') {
        vals.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
  }
  vals.push(cur);
  return vals;
}

function csvEscape(val) {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(rows) {
  const lines = [COLUMNS.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(COLUMNS.map((k) => csvEscape(row[k] ?? '')).join(','));
  }
  return lines.join('\n') + '\n';
}

// ── Image helpers ────────────────────────────────────────────────

function getWebpFiles(dirPath) {
  return readdirSync(dirPath)
    .filter((f) => WEBP_ONLY.has(extname(f).toLowerCase()))
    .sort();
}

function getNonWebpFiles(dirPath) {
  return readdirSync(dirPath)
    .filter(
      (f) =>
        ALL_IMAGE_EXTS.has(extname(f).toLowerCase()) &&
        !WEBP_ONLY.has(extname(f).toLowerCase())
    )
    .sort();
}

function makeEntry(file, dirInput, defaults) {
  const ext = extname(file);
  const name = file.slice(0, -ext.length);
  return {
    id: slugify(name, { lower: true, strict: true }),
    title: name,
    url: `${dirInput.replace(/\\/g, '/')}/${file}`,
    ref_url: defaults.refUrl || '',
    graphic_type: defaults.graphicType || '',
    category: defaults.category || '',
  };
}

// ── Graphic type helper ─────────────────────────────────────────

async function promptGraphicType(message, skipLabel) {
  const pick = await p.select({
    message,
    options: [
      { value: '', label: skipLabel },
      { value: 'chart', label: 'Chart' },
      { value: 'map', label: 'Map' },
      { value: 'illustration', label: 'Illustration' },
      { value: 'photo', label: 'Photo' },
      { value: 'dataviz', label: 'Dataviz' },
      { value: '__other__', label: 'Other' },
    ],
  });
  if (p.isCancel(pick)) return null;
  if (pick !== '__other__') return pick;

  const custom = await p.text({
    message: 'Specify graphic type',
    placeholder: 'e.g., diagram, screenshot, ...',
    validate: (v) => (v ? undefined : 'Required'),
  });
  if (p.isCancel(custom)) return null;
  return custom;
}

// ── Prompt helpers ───────────────────────────────────────────────

async function promptDefaults() {
  const refUrl = await p.text({
    message: 'Source/ref_url (applied to new entries)',
    placeholder: 'https://... (optional)',
  });
  if (p.isCancel(refUrl)) return null;

  const graphicType = await promptGraphicType('Graphic type', '(none)');
  if (graphicType === null) return null;

  const category = await p.text({
    message: 'Category',
    placeholder: 'e.g., dataviz (optional)',
  });
  if (p.isCancel(category)) return null;

  return { refUrl, graphicType, category };
}

function getExistingUrls(rows) {
  return new Set(rows.map((r) => r.url));
}

async function fillMissingFields(entries) {
  let changed = false;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const missing = [];
    if (!e.ref_url) missing.push('ref_url');
    if (!e.graphic_type) missing.push('graphic_type');
    if (!e.category) missing.push('category');
    if (missing.length === 0) continue;

    p.log.step(
      `[${i + 1}/${entries.length}] ${e.id} — missing: ${missing.join(', ')}`
    );
    const fill = await p.confirm({
      message: `Fill missing fields for "${e.title}"?`,
      activeLabel: 'Yes',
      inactiveLabel: 'Skip',
    });
    if (p.isCancel(fill)) return null;
    if (!fill) continue;

    if (!e.ref_url) {
      const val = await p.text({ message: 'ref_url', initialValue: e.ref_url });
      if (p.isCancel(val)) return null;
      e.ref_url = val;
    }
    if (!e.graphic_type) {
      const val = await promptGraphicType('graphic_type', '(none)');
      if (val === null) return null;
      e.graphic_type = val;
    }
    if (!e.category) {
      const val = await p.text({
        message: 'category',
        initialValue: e.category,
      });
      if (p.isCancel(val)) return null;
      e.category = val;
    }
    changed = true;
  }
  return changed;
}

async function fillAllShared(entries) {
  p.log.step('Apply shared values to all entries with missing fields');

  const refUrl = await p.text({
    message: 'Source/ref_url for all empty entries',
    placeholder: 'https://... (leave empty to skip)',
  });
  if (p.isCancel(refUrl)) return null;

  const graphicType = await promptGraphicType(
    'Graphic type for all empty entries',
    '(skip)'
  );
  if (graphicType === null) return null;

  const category = await p.text({
    message: 'Category for all empty entries',
    placeholder: 'Leave empty to skip',
  });
  if (p.isCancel(category)) return null;

  let count = 0;
  for (const e of entries) {
    if (!e.ref_url && refUrl) {
      e.ref_url = refUrl;
      count++;
    }
    if (!e.graphic_type && graphicType) {
      e.graphic_type = graphicType;
      count++;
    }
    if (!e.category && category) {
      e.category = category;
      count++;
    }
  }
  return count > 0;
}

// ── Mode: generate new entries ───────────────────────────────────

async function generateEntries(imageFiles, dirInput, existingRows) {
  const existingUrls = getExistingUrls(existingRows);
  const missing = imageFiles.filter((f) => {
    const url = `${dirInput.replace(/\\/g, '/')}/${f}`;
    return !existingUrls.has(url);
  });

  if (missing.length === 0) {
    p.log.info('All images already have entries in the CSV.');
    return existingRows;
  }

  p.log.info(`${missing.length} new image(s) to add`);
  const defaults = await promptDefaults();
  if (!defaults) return null;

  const newEntries = missing.map((f) => makeEntry(f, dirInput, defaults));
  return [...existingRows, ...newEntries];
}

async function regenerateAll(imageFiles, dirInput) {
  const defaults = await promptDefaults();
  if (!defaults) return null;
  return imageFiles.map((f) => makeEntry(f, dirInput, defaults));
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  ensureLogs();
  p.intro('Gallery CSV generator');

  const dirInput = await p.text({
    message: 'Directory path relative to static/media/',
    placeholder: 'e.g., projects/dataviz-gallery',
    validate: (v) => {
      if (!v) return 'Required';
      const fp = join(STATIC_MEDIA, v);
      if (!existsSync(fp)) return `Directory not found: static/media/${v}`;
      if (!readdirSync(fp).some((f) => WEBP_ONLY.has(extname(f).toLowerCase())))
        return 'No .webp files found in this directory';
    },
  });
  if (p.isCancel(dirInput)) {
    p.cancel();
    process.exit(0);
  }

  const dirPath = join(STATIC_MEDIA, dirInput);
  const webpFiles = getWebpFiles(dirPath);
  const nonWebp = getNonWebpFiles(dirPath);

  if (nonWebp.length > 0) {
    p.log.warn(
      `Found ${nonWebp.length} non-webp image(s) — only .webp files will be processed`
    );
    logLine(`WARN: ${dirInput} — ${nonWebp.length} non-webp images skipped`);
  }

  const outName = basename(dirInput) || 'gallery';
  const outFile = join(DATA, `${outName}.csv`);

  if (!existsSync(DATA)) mkdirSync(DATA, { recursive: true });

  let entries = [];
  let action = 'generated';

  if (existsSync(outFile)) {
    const existing = csvParse(readFileSync(outFile, 'utf-8'));
    p.log.warn(
      `CSV exists at data/${outName}.csv (${existing.length} entries)`
    );

    const chosen = await p.select({
      message: 'What to do?',
      options: [
        { value: 'add-missing', label: 'Add missing images only' },
        { value: 'overwrite', label: 'Overwrite all entries' },
        {
          value: 'fill-fields',
          label: 'Fill empty fields on existing entries',
        },
        { value: 'cancel', label: 'Cancel' },
      ],
    });
    if (p.isCancel(chosen) || chosen === 'cancel') {
      p.cancel();
      process.exit(0);
    }

    if (chosen === 'add-missing') {
      const result = await generateEntries(webpFiles, dirInput, existing);
      if (!result) process.exit(0);
      entries = result;
      action = `add-missing (${entries.length - existing.length} new)`;
    } else if (chosen === 'overwrite') {
      const result = await regenerateAll(webpFiles, dirInput);
      if (!result) process.exit(0);
      entries = result;
      action = 'overwrite';
    } else if (chosen === 'fill-fields') {
      const mode = await p.select({
        message: 'Fill mode',
        options: [
          { value: 'one-by-one', label: 'One by one (prompt per entry)' },
          { value: 'shared', label: 'Apply shared values to all empty fields' },
        ],
      });
      if (p.isCancel(mode)) {
        p.cancel();
        process.exit(0);
      }

      let changed;
      if (mode === 'one-by-one') {
        changed = await fillMissingFields(existing);
      } else {
        changed = await fillAllShared(existing);
      }
      if (changed === null) process.exit(0);

      if (changed) {
        writeFileSync(outFile, toCsv(existing));
        p.outro(`Updated data/${outName}.csv`);
        logLine(
          `${dirInput} — filled empty fields (${mode}), ${existing.length} entries`
        );
      } else {
        p.log.info('No changes made.');
        logLine(`${dirInput} — no empty fields to fill`);
      }
      return;
    }
  } else {
    const result = await regenerateAll(webpFiles, dirInput);
    if (!result) process.exit(0);
    entries = result;
    action = 'fresh';
  }

  writeFileSync(outFile, toCsv(entries));
  p.outro(`Wrote ${entries.length} entries → data/${outName}.csv`);
  logLine(
    `${dirInput} — ${action}, ${entries.length} entries → data/${outName}.csv`
  );

  // Offer to fill missing fields after generation
  const hasEmpty = entries.some(
    (e) => !e.ref_url || !e.graphic_type || !e.category
  );
  if (hasEmpty) {
    const doFill = await p.confirm({
      message: 'Some entries have empty fields. Fill them now?',
      activeLabel: 'Yes',
      inactiveLabel: 'No',
    });
    if (p.isCancel(doFill)) process.exit(0);

    if (doFill) {
      const mode = await p.select({
        message: 'Fill mode',
        options: [
          { value: 'one-by-one', label: 'One by one' },
          { value: 'shared', label: 'Apply shared values to all' },
        ],
      });
      if (p.isCancel(mode)) {
        p.cancel();
        process.exit(0);
      }

      let changed;
      if (mode === 'one-by-one') {
        changed = await fillMissingFields(entries);
      } else {
        changed = await fillAllShared(entries);
      }
      if (changed === null) process.exit(0);

      if (changed) {
        writeFileSync(outFile, toCsv(entries));
        logLine(`${dirInput} — post-fill empty fields (${mode})`);
      }
      p.outro(`Updated data/${outName}.csv`);
    }
  }
}

main().catch((err) => {
  p.cancel('Script failed');
  console.error(err);
  logLine(`ERROR: ${err.message}`);
  process.exit(1);
});
