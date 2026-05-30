import * as p from '@clack/prompts';

import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
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

/**
 * Resolve the source-images directory for a project.
 *
 * New layout: `<project>/images/` holds the originals.
 * Legacy layout: originals lived directly in `<project>/`.
 *
 * We prefer `<project>/images/` when present; otherwise we fall back
 * to the project root and warn the caller (the URL produced will not
 * include the `/images/` segment in that case, so downstream consumers
 * keep working).
 *
 * Returns `{ srcDir, urlPrefix }` where `urlPrefix` is what should be
 * embedded into CSV `url` values (relative to `static/media/`).
 */
function resolveImageLayout(projectDir, dirInput) {
  const normalizedDir = dirInput.replace(/\\/g, '/');
  const imagesDir = join(projectDir, 'images');
  if (existsSync(imagesDir) && statSync(imagesDir).isDirectory()) {
    return {
      srcDir: imagesDir,
      urlPrefix: `${normalizedDir}/images`,
      hasImagesSubdir: true,
    };
  }
  return {
    srcDir: projectDir,
    urlPrefix: normalizedDir,
    hasImagesSubdir: false,
  };
}

/**
 * Build a single CSV row from an image file on disk.
 *
 * The on-disk filename is preserved in `title` (so a human can still
 * cross-reference the source), but the public `url` is composed from
 * the slugified id + the original extension under the project's
 * canonical URL prefix (e.g. `<dir>/images/<slug><ext>`).
 *
 * NOTE: the file on disk must eventually be renamed to match the
 * slugified URL (or a build step has to copy it). The merge step
 * compares CSV URLs against `<urlPrefix>/<slug><ext>`, so renaming
 * files to the slug form makes future re-runs no-ops.
 */
function makeEntry(file, urlPrefix, defaults) {
  const ext = extname(file);
  const name = file.slice(0, -ext.length);
  const slug = slugify(name, { lower: true, strict: true });
  return {
    id: slug,
    title: name,
    img_url: `${urlPrefix}/${slug}${ext}`,
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
  return new Set(rows.map((r) => r.img_url));
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

async function mergeEntries(imageFiles, urlPrefix, existingRows) {
  const existingUrls = getExistingUrls(existingRows);
  const existingIdMap = new Map(existingRows.map((r) => [r.id, r]));

  // URLs are derived from the slugified id, not the raw filename, so
  // build a slug-form URL per on-disk file to compare against the CSV.
  const fileMeta = imageFiles.map((file) => {
    const ext = extname(file);
    const name = file.slice(0, -ext.length);
    const slug = slugify(name, { lower: true, strict: true });
    return {
      file,
      slug,
      ext,
      url: `${urlPrefix}/${slug}${ext}`,
    };
  });

  const missingFiles = [];
  const potentialRenames = [];

  for (const m of fileMeta) {
    if (existingUrls.has(m.url)) continue;
    if (existingIdMap.has(m.slug)) {
      potentialRenames.push({ file: m.file, slug: m.slug, newUrl: m.url });
    } else {
      missingFiles.push(m.file);
    }
  }

  const fileUrls = new Set(fileMeta.map((m) => m.url));
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
      const entry = makeEntry(file, urlPrefix, {
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
      makeEntry(f, urlPrefix, defaults)
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

async function regenerateAll(imageFiles, urlPrefix) {
  const defaults = await promptDefaults();
  if (!defaults) return null;
  return imageFiles.map((f) => makeEntry(f, urlPrefix, defaults));
}

// ── Mode: Regenerate URLs / ref_urls ────────────────────────────
//
// Bulk update `url` or `ref_url` across many entries. Three actions:
//
//   • set      — overwrite all selected entries with a single value
//                (useful for `ref_url` when many tiles share a source).
//   • replace  — substring or regex find-and-replace within existing
//                values (useful when a media folder is renamed and
//                every `url` needs its prefix swapped).
//   • rebuild  — only for `url`: re-derive from the entry's existing
//                filename plus a new directory prefix.
//                e.g.  `old/foo.webp` → `<new-dir>/foo.webp`.
//
// Filename for `rebuild` is taken from the last path segment of the
// current `url`, so it works even if the file isn't currently on disk.

async function regenerateUrlsMode(entries) {
  const field = await p.select({
    message: 'Which field to regenerate?',
    options: [
      { value: 'url', label: 'url (image path under /media/)' },
      { value: 'ref_url', label: 'ref_url (external source link)' },
    ],
  });
  if (p.isCancel(field)) return null;

  const action = await p.select({
    message: 'Action',
    options: [
      { value: 'set', label: 'Set all selected entries to a single value' },
      {
        value: 'replace',
        label: 'Find & replace within existing values (substring or regex)',
      },
      ...(field === 'url'
        ? [
            {
              value: 'rebuild',
              label: 'Rebuild from filename + new directory prefix',
            },
          ]
        : []),
    ],
  });
  if (p.isCancel(action)) return null;

  // ── Scope ────────────────────────────────────────────────────
  const scope = await p.select({
    message: 'Scope',
    options: [
      { value: 'all', label: 'All entries' },
      { value: 'empty', label: 'Only entries with empty value' },
      { value: 'regex', label: 'Match by regex on id/title/url' },
    ],
  });
  if (p.isCancel(scope)) return null;

  let selected = [];
  if (scope === 'all') {
    selected = entries;
  } else if (scope === 'empty') {
    selected = entries.filter((e) => !e[field]);
  } else {
    const pattern = await p.text({
      message: 'Regex pattern (matched against id, title, or url)',
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
    selected = entries.filter(
      (e) => re.test(e.id) || re.test(e.title) || re.test(e.url)
    );
  }

  p.log.info(`${selected.length} entrie(s) selected`);
  if (selected.length === 0) return false;

  // ── Apply action ─────────────────────────────────────────────
  let changed = 0;

  if (action === 'set') {
    const value = await p.text({
      message: `New ${field} for ${selected.length} entrie(s)`,
      placeholder:
        field === 'url'
          ? 'e.g., projects/foo/bar.webp'
          : 'https://... (leave empty to clear)',
    });
    if (p.isCancel(value)) return null;
    for (const e of selected) {
      if (e[field] !== value) {
        e[field] = value;
        changed++;
      }
    }
  } else if (action === 'replace') {
    const useRegex = await p.confirm({
      message: 'Treat pattern as regex? (otherwise plain substring)',
      activeLabel: 'Regex',
      inactiveLabel: 'Substring',
    });
    if (p.isCancel(useRegex)) return null;

    const find = await p.text({
      message: useRegex ? 'Regex to find' : 'Substring to find',
      placeholder: useRegex
        ? 'e.g., ^projects/old-name/'
        : 'e.g., projects/old-name/',
      validate: (v) => {
        if (!v) return 'Required';
        if (useRegex) {
          try {
            new RegExp(v);
          } catch {
            return 'Invalid regex';
          }
        }
        return undefined;
      },
    });
    if (p.isCancel(find)) return null;

    const replace = await p.text({
      message: 'Replace with',
      placeholder: 'e.g., projects/new-name/',
    });
    if (p.isCancel(replace)) return null;

    const re = useRegex ? new RegExp(find, 'g') : null;
    let matched = 0;
    for (const e of selected) {
      const cur = e[field] || '';
      let next;
      if (useRegex && re) {
        if (!re.test(cur)) continue;
        re.lastIndex = 0;
        next = cur.replace(re, replace);
      } else {
        if (!cur.includes(find)) continue;
        next = cur.split(find).join(replace);
      }
      matched++;
      if (next !== cur) {
        e[field] = next;
        changed++;
      }
    }
    p.log.info(`${matched} entrie(s) matched the pattern`);
  } else if (action === 'rebuild') {
    // url rebuild: compose `<new-dir>/<id><ext>` for each entry, where
    // `<ext>` is preserved from the current url (defaults to `.webp`
    // if the current url is empty or extension-less). The entry `id`
    // is already slugified, so this produces the canonical slug-form
    // URL the rest of the pipeline expects.
    const newDir = await p.text({
      message:
        'New directory prefix (relative to static/media/, no leading/trailing slash)',
      placeholder: 'e.g., projects/dataviz-gallery',
      validate: (v) => (v ? undefined : 'Required'),
    });
    if (p.isCancel(newDir)) return null;
    const normalized = newDir.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

    for (const e of selected) {
      if (!e.id) continue;
      const cur = e[field] || '';
      const curExt = extname(cur);
      const ext = curExt || '.webp';
      const next = `${normalized}/${e.id}${ext}`;
      if (next !== cur) {
        e[field] = next;
        changed++;
      }
    }
  }

  if (changed > 0) {
    p.log.info(`Updated ${field} on ${changed} entrie(s)`);
  } else {
    p.log.info('No values were changed.');
  }
  return changed > 0;
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
    message: 'Project directory relative to static/media/',
    placeholder: 'e.g., projects/dataviz-gallery',
    validate: (v) => {
      if (!v) return 'Required';
      const fp = join(STATIC_MEDIA, v);
      if (!existsSync(fp)) return `Directory not found: static/media/${v}`;
      // Accept either layout: `<project>/images/*.webp` (new) or
      // `<project>/*.webp` (legacy) — we'll resolve which after.
      const imagesDir = join(fp, 'images');
      const candidate = existsSync(imagesDir) ? imagesDir : fp;
      if (
        !readdirSync(candidate).some((f) =>
          WEBP_ONLY.has(extname(f).toLowerCase())
        )
      )
        return existsSync(imagesDir)
          ? 'No .webp files found in this directory’s `images/` subfolder'
          : 'No .webp files found in this directory';
    },
  });
  if (p.isCancel(dirInput)) {
    p.cancel();
    process.exit(0);
  }

  const dirPath = join(STATIC_MEDIA, dirInput);
  // Originals live in `<project>/images/` (preferred) or `<project>/`
  // (legacy fallback). `urlPrefix` is what gets embedded into CSV
  // `url` values so the gallery component can resolve them correctly.
  const { srcDir, urlPrefix, hasImagesSubdir } = resolveImageLayout(
    dirPath,
    dirInput
  );
  if (!hasImagesSubdir) {
    p.log.warn(
      'No `images/` subfolder — reading originals from the project root (legacy layout). ' +
        'Move them into `images/` to adopt the new layout.'
    );
  }

  const webpFiles = getWebpFiles(srcDir);
  const nonWebp = getNonWebpFiles(srcDir);

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
        {
          value: 'regenerate-urls',
          label: 'Regenerate url / ref_url (bulk set, replace, or rebuild)',
        },
        { value: 'cancel', label: 'Cancel' },
      ],
    });
    if (p.isCancel(chosen) || chosen === 'cancel') {
      p.cancel();
      process.exit(0);
    }

    if (chosen === 'merge') {
      const result = await mergeEntries(webpFiles, urlPrefix, existing);
      if (!result) process.exit(0);
      if (!result.changed) return;
      entries = result.entries;
      previousEntries = existing;
      await confirmAndWrite(outFile, entries, previousEntries, 'merge');
      await postFillEntries(entries, outFile);
    } else if (chosen === 'overwrite') {
      const result = await regenerateAll(webpFiles, urlPrefix);
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
    } else if (chosen === 'regenerate-urls') {
      const changed = await regenerateUrlsMode(existing);
      if (changed === null) process.exit(0);

      if (changed) {
        await confirmAndWrite(outFile, existing, null, 'regenerate-urls');
      } else {
        p.log.info('No changes made.');
      }
      return;
    }
  } else {
    const result = await regenerateAll(webpFiles, urlPrefix);
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
