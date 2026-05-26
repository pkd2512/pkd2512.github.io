import * as p from '@clack/prompts';

import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { basename, extname, join, resolve } from 'path';
import { csvFormat, csvParse } from 'd3-dsv';

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

const BASE_COLUMNS = [
  'id',
  'title',
  'url',
  'ref_url',
  'graphic_type',
  'category',
  'alt',
];

function getAllColumns(rows) {
  const seen = new Set(BASE_COLUMNS);
  const extra = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        extra.push(key);
      }
    }
  }
  return [...BASE_COLUMNS, ...extra];
}

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

// ── Backup ────────────────────────────────────────────────────────

function backupCsv(filePath) {
  if (!existsSync(filePath)) return null;
  const bak = filePath + '.bak';
  copyFileSync(filePath, bak);
  return bak;
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
    alt: '',
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

// ── Fill missing fields ──────────────────────────────────────────

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

// ── Mode: Merge (smart add-missing + renames + orphans) ─────────

async function mergeEntries(imageFiles, dirInput, existingRows) {
  const existingUrls = getExistingUrls(existingRows);
  const existingIdMap = new Map(existingRows.map((r) => [r.id, r]));
  const normalizedDir = dirInput.replace(/\\/g, '/');

  const missingFiles = [];
  const potentialRenames = [];

  for (const file of imageFiles) {
    const url = `${normalizedDir}/${file}`;
    if (existingUrls.has(url)) continue;

    const ext = extname(file);
    const name = file.slice(0, -ext.length);
    const slug = slugify(name, { lower: true, strict: true });

    if (existingIdMap.has(slug)) {
      potentialRenames.push({ file, slug, newUrl: url });
    } else {
      missingFiles.push(file);
    }
  }

  const fileUrls = new Set(imageFiles.map((f) => `${normalizedDir}/${f}`));
  const orphans = existingRows.filter((r) => !fileUrls.has(r.url));

  const summary = [];
  if (missingFiles.length) summary.push(`${missingFiles.length} new`);
  if (potentialRenames.length)
    summary.push(`${potentialRenames.length} renames`);
  if (orphans.length) summary.push(`${orphans.length} orphans`);

  if (summary.length === 0) {
    p.log.info('Everything is already in sync — no changes needed.');
    return { entries: existingRows, changed: false };
  }

  p.log.info(`Merge summary: ${summary.join(', ')}`);

  let entries = [...existingRows];

  if (orphans.length > 0) {
    p.log.warn(`${orphans.length} CSV entrie(s) have no matching file:`);
    orphans.forEach((o) => p.log.warn(`  • ${o.url} (${o.id})`));
    const removeOrphans = await p.confirm({
      message: 'Remove orphaned entries from CSV?',
      activeLabel: 'Remove',
      inactiveLabel: 'Keep',
    });
    if (p.isCancel(removeOrphans)) return null;
    if (removeOrphans) {
      const orphanUrls = new Set(orphans.map((o) => o.url));
      entries = entries.filter((e) => !orphanUrls.has(e.url));
    }
  }

  for (const { file, slug, newUrl } of potentialRenames) {
    const existing = existingIdMap.get(slug);
    p.log.step(`Possible rename: "${existing.url}" → "${newUrl}"`);
    const action = await p.select({
      message: `What to do with "${existing.title}"?`,
      options: [
        { value: 'update', label: 'Update to new filename' },
        { value: 'skip', label: 'Skip (keep existing entry)' },
        { value: 'add-new', label: 'Add as new entry (keep both)' },
      ],
    });
    if (p.isCancel(action)) return null;

    if (action === 'update') {
      const row = entries.find((r) => r.id === slug);
      if (row) {
        const ext = extname(file);
        const name = file.slice(0, -ext.length);
        row.url = newUrl;
        row.title = name;
      }
    } else if (action === 'add-new') {
      const entry = makeEntry(file, dirInput, {
        refUrl: '',
        graphicType: '',
        category: '',
      });
      entries.push(entry);
    }
  }

  if (missingFiles.length > 0) {
    p.log.info(`${missingFiles.length} new image(s) to add`);
    const defaults = await promptDefaults();
    if (!defaults) return null;
    const newEntries = missingFiles.map((f) =>
      makeEntry(f, dirInput, defaults)
    );
    entries = [...entries, ...newEntries];
  }

  return { entries, changed: true };
}

// ── Mode: Update field ──────────────────────────────────────────

async function updateFieldMode(entries) {
  const field = await p.select({
    message: 'Which field to update?',
    options: [
      { value: 'ref_url', label: 'ref_url' },
      { value: 'graphic_type', label: 'graphic_type' },
      { value: 'category', label: 'category' },
    ],
  });
  if (p.isCancel(field)) return null;

  const scope = await p.select({
    message: 'Scope?',
    options: [
      { value: 'all', label: 'All entries' },
      { value: 'empty', label: 'Only empty entries' },
      { value: 'regex', label: 'Match by regex on id/title' },
    ],
  });
  if (p.isCancel(scope)) return null;

  let selected = [];
  if (scope === 'all') {
    selected = entries;
  } else if (scope === 'empty') {
    selected = entries.filter((e) => !e[field]);
  } else if (scope === 'regex') {
    const pattern = await p.text({
      message: 'Regex pattern to match against id or title',
      placeholder: 'e.g., covid|pandemic',
      validate: (v) => {
        if (!v) return 'Required';
        try {
          new RegExp(v, 'i');
          return undefined;
        } catch {
          return 'Invalid regex';
        }
      },
    });
    if (p.isCancel(pattern)) return null;
    const re = new RegExp(pattern, 'i');
    selected = entries.filter((e) => re.test(e.id) || re.test(e.title));
    p.log.info(`${selected.length} entrie(s) matched`);
  }

  if (selected.length === 0) {
    p.log.info('No entries match the selected scope.');
    return false;
  }

  const applyMode = await p.select({
    message: 'Apply how?',
    options: [
      { value: 'bulk', label: 'Same value for all selected (overwrite)' },
      { value: 'append', label: 'Append to existing values' },
      { value: 'one-by-one', label: 'Prompt per entry' },
    ],
  });
  if (p.isCancel(applyMode)) return null;

  const SEP = ', ';

  function applyValue(e, value) {
    if (applyMode === 'append' && value) {
      const cur = e[field];
      const appended = cur ? `${cur}${SEP}${value}` : value;
      if (e[field] !== appended) {
        e[field] = appended;
        return true;
      }
      return false;
    }
    if (e[field] !== value) {
      e[field] = value;
      return true;
    }
    return false;
  }

  let changed = false;
  if (applyMode === 'bulk' || applyMode === 'append') {
    let value;
    if (field === 'graphic_type') {
      const label =
        applyMode === 'append'
          ? `Append graphic_type for ${selected.length} entrie(s)`
          : `Set graphic_type for ${selected.length} entrie(s)`;
      value = await promptGraphicType(label, '(clear)');
      if (value === null) return null;
    } else {
      const label =
        applyMode === 'append'
          ? `Value to append to ${field}`
          : `Set ${field} for ${selected.length} entrie(s)`;
      value = await p.text({
        message: label,
        placeholder:
          applyMode === 'append'
            ? 'e.g., health'
            : 'Value (leave empty to clear)',
      });
      if (p.isCancel(value)) return null;
    }
    for (const e of selected) {
      if (applyValue(e, value)) changed = true;
    }
    if (changed) p.log.info(`Updated ${field} on ${selected.length} entrie(s)`);
  } else {
    for (let i = 0; i < selected.length; i++) {
      const e = selected[i];
      p.log.step(
        `[${i + 1}/${selected.length}] ${e.id} (current: ${e[field] || '(empty)'})`
      );
      let value;
      if (field === 'graphic_type') {
        value = await promptGraphicType(
          `graphic_type for "${e.title}"`,
          '(keep)'
        );
        if (value === null) return null;
      } else {
        value = await p.text({
          message: `${field} for "${e.title}"`,
          initialValue: e[field],
        });
        if (p.isCancel(value)) return null;
      }
      if (applyValue(e, value)) changed = true;
    }
  }
  return changed;
}

// ── Mode: Add column ───────────────────────────────────────────

async function addColumnMode(entries) {
  const name = await p.text({
    message: 'New column name',
    placeholder: 'e.g., alt',
    validate: (v) => {
      if (!v) return 'Required';
      if (BASE_COLUMNS.includes(v))
        return `Column "${v}" is already a base column`;
      return undefined;
    },
  });
  if (p.isCancel(name)) return null;

  const alreadyExists = entries.some((e) => name in e);
  if (alreadyExists) {
    p.log.warn(
      `Column "${name}" already exists on some entries — values will be preserved`
    );
  }

  const defaultValue = await p.text({
    message: `Default value for "${name}"`,
    placeholder: '(leave empty)',
  });
  if (p.isCancel(defaultValue)) return null;

  let changed = false;
  for (const e of entries) {
    if (!(name in e)) {
      e[name] = defaultValue;
      changed = true;
    }
  }

  if (changed) {
    p.log.info(`Added column "${name}" to ${entries.length} entrie(s)`);
  } else {
    p.log.info(
      `Column "${name}" already present on all entries — no changes needed`
    );
  }
  return changed;
}

// ── Mode: Regenerate all ────────────────────────────────────────

async function regenerateAll(imageFiles, dirInput) {
  const defaults = await promptDefaults();
  if (!defaults) return null;
  return imageFiles.map((f) => makeEntry(f, dirInput, defaults));
}

// ── Dry-run diff preview ────────────────────────────────────────

function showDiffPreview(oldRows, newRows) {
  const oldUrls = new Set(oldRows.map((r) => r.url));
  const newUrls = new Set(newRows.map((r) => r.url));

  const added = newRows.filter((r) => !oldUrls.has(r.url));
  const removed = oldRows.filter((r) => !newUrls.has(r.url));

  const cols = getAllColumns(newRows);
  const oldMap = new Map(oldRows.map((r) => [r.url, r]));
  const modified = newRows.filter((r) => {
    if (!oldUrls.has(r.url)) return false;
    const o = oldMap.get(r.url);
    return cols.some((k) => o[k] !== r[k]);
  });

  p.log.info('─'.repeat(40));
  p.log.info('Dry-run preview:');
  if (added.length) p.log.info(`  + ${added.length} new`);
  if (removed.length) p.log.info(`  - ${removed.length} removed`);
  if (modified.length) p.log.info(`  ~ ${modified.length} modified`);
  if (!added.length && !removed.length && !modified.length)
    p.log.info('  No changes');
  p.log.info('─'.repeat(40));
  return { added, removed, modified };
}

// ── Confirm & write ────────────────────────────────────────────

async function confirmAndWrite(outFile, rows, oldRows, action) {
  if (oldRows) {
    const { added, removed, modified } = showDiffPreview(oldRows, rows);
    if (!added.length && !removed.length && !modified.length) {
      p.log.info('No changes to write.');
      return false;
    }
  }

  if (oldRows) {
    const proceed = await p.confirm({
      message: 'Write changes to CSV?',
      activeLabel: 'Write',
      inactiveLabel: 'Cancel',
    });
    if (p.isCancel(proceed) || !proceed) {
      p.log.info('Cancelled — no changes written.');
      p.cancel();
      return false;
    }
  }

  const csv = csvFormat(rows, getAllColumns(rows));
  const bak = backupCsv(outFile);
  writeFileSync(outFile, csv);
  const bakMsg = bak ? ` (backup: ${basename(bak)})` : '';
  p.outro(`Wrote ${rows.length} entries → data/${basename(outFile)}${bakMsg}`);
  logLine(`${basename(outFile)} — ${action}, ${rows.length} entries`);
  return true;
}

// ── Post-generation: fill empty fields ─────────────────────────

async function postFillEntries(entries, outFile) {
  const hasEmpty = entries.some(
    (e) => !e.ref_url || !e.graphic_type || !e.category
  );
  if (!hasEmpty) return;

  const doFill = await p.confirm({
    message: 'Some entries have empty fields. Fill them now?',
    activeLabel: 'Yes',
    inactiveLabel: 'No',
  });
  if (p.isCancel(doFill)) return;
  if (!doFill) return;

  const mode = await p.select({
    message: 'Fill mode',
    options: [
      { value: 'one-by-one', label: 'One by one' },
      { value: 'shared', label: 'Apply shared values to all' },
    ],
  });
  if (p.isCancel(mode)) return;

  let changed;
  if (mode === 'one-by-one') {
    changed = await fillMissingFields(entries);
  } else {
    changed = await fillAllShared(entries);
  }
  if (changed === null) return;

  if (changed) {
    const csv = csvFormat(entries, getAllColumns(entries));
    backupCsv(outFile);
    writeFileSync(outFile, csv);
    logLine(`${basename(outFile)} — post-fill empty fields (${mode})`);
  }
  p.outro(`Updated data/${basename(outFile)}`);
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
  let previousEntries = null;

  if (existsSync(outFile)) {
    const existing = csvParse(readFileSync(outFile, 'utf-8'));
    p.log.warn(
      `CSV exists at data/${outName}.csv (${existing.length} entries)`
    );

    const chosen = await p.select({
      message: 'What to do?',
      options: [
        {
          value: 'merge',
          label: 'Merge — add new, detect renames, warn orphans',
        },
        { value: 'overwrite', label: 'Overwrite all entries from scratch' },
        {
          value: 'fill-fields',
          label: 'Fill empty fields on existing entries',
        },
        {
          value: 'update-field',
          label: 'Update a specific field across entries',
        },
        { value: 'add-column', label: 'Add a new column to all entries' },
        { value: 'cancel', label: 'Cancel' },
      ],
    });
    if (p.isCancel(chosen) || chosen === 'cancel') {
      p.cancel();
      process.exit(0);
    }

    if (chosen === 'merge') {
      const result = await mergeEntries(webpFiles, dirInput, existing);
      if (!result) process.exit(0);
      if (!result.changed) return;
      entries = result.entries;
      previousEntries = existing;
      await confirmAndWrite(outFile, entries, previousEntries, 'merge');
      await postFillEntries(entries, outFile);
    } else if (chosen === 'overwrite') {
      const result = await regenerateAll(webpFiles, dirInput);
      if (!result) process.exit(0);
      entries = result;
      previousEntries = existing;
      await confirmAndWrite(outFile, entries, previousEntries, 'overwrite');
      await postFillEntries(entries, outFile);
    } else if (chosen === 'fill-fields') {
      const mode = await p.select({
        message: 'Fill mode',
        options: [
          { value: 'one-by-one', label: 'One by one (prompt per entry)' },
          { value: 'shared', label: 'Apply shared values to all empty fields' },
        ],
      });
      if (p.isCancel(mode)) process.exit(0);

      let changed;
      if (mode === 'one-by-one') {
        changed = await fillMissingFields(existing);
      } else {
        changed = await fillAllShared(existing);
      }
      if (changed === null) process.exit(0);

      if (changed) {
        await confirmAndWrite(outFile, existing, null, `fill-fields (${mode})`);
      } else {
        p.log.info('No changes made.');
        logLine(`${dirInput} — no empty fields to fill`);
      }
      return;
    } else if (chosen === 'update-field') {
      const changed = await updateFieldMode(existing);
      if (changed === null) process.exit(0);

      if (changed) {
        await confirmAndWrite(outFile, existing, null, 'update-field');
      } else {
        p.log.info('No changes made.');
      }
      return;
    } else if (chosen === 'add-column') {
      const changed = await addColumnMode(existing);
      if (changed === null) process.exit(0);

      if (changed) {
        await confirmAndWrite(outFile, existing, null, 'add-column');
      } else {
        p.log.info('No changes made.');
      }
      return;
    }
  } else {
    const result = await regenerateAll(webpFiles, dirInput);
    if (!result) process.exit(0);
    entries = result;
    await confirmAndWrite(outFile, entries, null, 'fresh');
    await postFillEntries(entries, outFile);
  }
}

main().catch((err) => {
  p.cancel('Script failed');
  console.error(err);
  logLine(`ERROR: ${err.message}`);
  process.exit(1);
});
