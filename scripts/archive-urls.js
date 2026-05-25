import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { extname, join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { archiveUrls } from 'archive-url';
import * as p from '@clack/prompts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENTS = resolve(ROOT, 'src', 'contents');
const LOGS = resolve(ROOT, 'script-logs');
const LOG_FILE = join(LOGS, 'archive-urls.log');

if (!existsSync(LOGS)) mkdirSync(LOGS, { recursive: true });

const SCAN_EXTS = ['.md', '.csv', '.yml', '.yaml'];
const SKIP_DIRS = new Set(['node_modules', '.git', '.svelte-kit', '.vscode']);

const URL_RE = /https?:\/\/[^\s"'<>,]+/g;

function sep(ch = '─') { return ch.repeat(60); }

function walkDir(dir) {
  const files = [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return files; }
  for (const entry of entries) {
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

function cleanUrl(url) {
  let u = url.replace(/[.,;)\]!@]+$/, '').replace(/['"]+$/, '');
  const idx = u.slice(10).search(/https?:\/\//);
  if (idx >= 0) u = u.slice(0, idx + 10);
  return u;
}

function logBlock(title, lines) {
  const h = `  ${title}`;
  const b = lines.map(l => `    ${l}`);
  try {
    appendFileSync(LOG_FILE, '\n' + sep('═') + '\n' + h + '\n' + sep('─') + '\n');
    b.forEach(l => appendFileSync(LOG_FILE, l + '\n'));
    appendFileSync(LOG_FILE, sep('═') + '\n\n');
  } catch {}
}

function logRaw(msg) {
  try { appendFileSync(LOG_FILE, msg + '\n'); } catch {}
}

function parseCsvRow(line) {
  const fields = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { fields.push(cur); cur = ''; }
    else { cur += ch; }
  }
  fields.push(cur);
  return fields;
}

function fmtCsvField(v) {
  if (v.includes(',') || v.includes('"') || v.startsWith(' ') || v.endsWith(' ') || v.includes('\n'))
    return '"' + v.replace(/"/g, '""') + '"';
  return v;
}

function csvToJson(csv) {
  const lines = csv.split('\n');
  const nonEmpty = lines.filter(l => l.trim());
  if (nonEmpty.length < 2) return null;
  const headers = parseCsvRow(nonEmpty[0]).map(h => h.trim());
  const rows = [];
  for (let i = 1; i < nonEmpty.length; i++) {
    const fields = parseCsvRow(nonEmpty[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) row[headers[j]] = (fields[j] || '').trim();
    rows.push(row);
  }
  return { headers, rows };
}

function jsonToCsv(headers, rows) {
  const esc = v => fmtCsvField(v);
  const h = headers.map(esc).join(',');
  return h + '\n' + rows.map(r => headers.map(h => esc(r[h] || '')).join(',')).join('\n') + '\n';
}

function writeArchivedToCSVs(updates) {
  const byFile = new Map();
  for (const u of updates) {
    if (!byFile.has(u.file)) byFile.set(u.file, []);
    byFile.get(u.file).push(u);
  }

  for (const [file, fileUpdates] of byFile) {
    const fp = join(CONTENTS, file);
    const content = readText(fp);
    if (!content) continue;

    const parsed = csvToJson(content);
    if (!parsed) continue;

    const { headers, rows } = parsed;
    const hasCol = headers.some(h => h.toLowerCase() === 'archive_url');

    if (!hasCol) {
      headers.push('archive_url');
      for (const r of rows) r.archive_url = '';
    }

    let updated = 0;
    for (const u of fileUpdates) {
      for (const r of rows) {
        if (r.url === u.url) {
          r.archive_url = u.archiveUrl;
          updated++;
        }
      }
    }

    writeFileSync(fp, jsonToCsv(headers, rows), 'utf-8');
    logRaw(`  → ${file}: ${!hasCol ? 'archive_url column added, ' : ''}${updated} row(s) updated`);
  }
}

function scanCSV(fp, relFile, force) {
  const content = readText(fp);
  if (!content) return { active: [], skipped: 0 };
  const parsed = csvToJson(content);
  if (!parsed) return { active: [], skipped: 0 };

  const { headers, rows } = parsed;
  const hasArchiveCol = headers.some(h => h.toLowerCase() === 'archive_url');

  const active = [];
  let skipped = 0;

  for (const row of rows) {
    const rawUrl = (row.url || '').trim();
    if (!rawUrl || !rawUrl.startsWith('http')) continue;
    const url = cleanUrl(rawUrl);
    if (!url) continue;

    if (hasArchiveCol && !force && (row.archive_url || '').trim().length > 0) {
      skipped++;
      continue;
    }

    active.push({ file: relFile, url });
  }

  return { active, skipped };
}

function scanFiles(files, force) {
  const allActive = [];
  let totalSkipped = 0;

  for (const fp of files) {
    const ext = extname(fp).toLowerCase();
    const relFile = relative(CONTENTS, fp);

    if (ext === '.csv') {
      const result = scanCSV(fp, relFile, force);
      allActive.push(...result.active);
      totalSkipped += result.skipped;
    } else {
      const content = readText(fp);
      if (!content) continue;
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const matches = lines[i].matchAll(URL_RE);
        for (const m of matches) {
          let url = cleanUrl(m[0].trim());
          if (!url) continue;
          allActive.push({ file: relFile, url });
        }
      }
    }
  }

  return { active: allActive, totalSkipped };
}

function dedup(results) {
  const seen = new Set();
  return results.filter(r => {
    const key = r.url + r.file;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueUrls(results) {
  const seen = new Set();
  return results.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const archiveMode = args.includes('--archive');
  const forceNew = args.includes('--force');
  const urlIdx = args.indexOf('--url');
  const inlineUrl = urlIdx !== -1 && args[urlIdx + 1] ? args[urlIdx + 1] : null;

  p.intro('🔗 Archive URLs');

  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);

  async function runArchive(urls, label, csvResults) {
    const t0 = Date.now();
    const total = urls.length;

    logRaw(`\n${sep('═')}`);
    logRaw(`  ${label}  ·  ${ts}`);
    logRaw(sep('─'));

    const prog = p.progress();
    prog.start(total, total);

    let archived = 0;
    let failed = 0;
    let resultsList = [];

    try {
      resultsList = await archiveUrls(urls, { forceNew, timeout: 60000 }, (completed, totalCount, result) => {
        if (result.success) archived++;
        else failed++;
        prog.message(`[${completed}/${totalCount}] Archived: ${archived}  Failed: ${failed}`);
        prog.advance();
      });
    } catch (err) {
      prog.stop('Archive API error');
      p.log.error(`archiveUrls failed: ${err.message}`);
      logRaw(`\nFATAL: ${err.message}`);
      logBlock('Archive URLs', [`Archive URLs  ·  ${ts}`, `FATAL: ${err.message}`]);
      p.outro('Failed');
      process.exit(1);
    }

    prog.stop(`Archived ${archived}, failed ${failed}`);

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    if (!csvResults) {
      for (const ar of resultsList) {
        if (ar.success) {
          p.log.message(`${ar.originalUrl}`);
          p.log.message(`  → ${ar.archiveUrl}`);
        } else {
          p.log.warn(`${ar.originalUrl}`);
          p.log.warn(`  → ${ar.error || 'failed'}`);
        }
      }
    }

    if (csvResults && csvResults.length > 0) {
      const urlToSrc = new Map();
      for (const r of csvResults) {
        if (!urlToSrc.has(r.url)) urlToSrc.set(r.url, []);
        urlToSrc.get(r.url).push(r);
      }

      const csvUpdates = [];
      for (const ar of resultsList) {
        if (!ar.success) continue;
        const srcs = urlToSrc.get(ar.originalUrl) || [];
        for (const s of srcs) {
          if (extname(s.file).toLowerCase() === '.csv')
            csvUpdates.push({ file: s.file, url: s.url, archiveUrl: ar.archiveUrl });
        }
      }

      if (csvUpdates.length > 0) {
        p.log.message('Writing archive URLs back to CSVs…');
        writeArchivedToCSVs(csvUpdates);
      }
    }

    const summary = [
      `${label}  ·  ${ts}`,
      `Total URLs: ${total}  ·  Archived: ${archived}  ·  Failed: ${failed}  ·  ${elapsed}s`,
    ];
    logBlock('Archive URLs', summary);

    p.log.success(`Archived: ${archived}  Failed: ${failed}`);
    p.note(`Log written to ${relative(ROOT, LOG_FILE)}`, 'Complete');
    p.outro(`Done  ·  ${elapsed}s`);
  }

  function runCheck(r) {
    logBlock('URL scan', [
      `Scan  ·  ${ts}`,
      `URLs: ${r.length}  ·  Unique: ${new Set(r.map(x => x.url)).size}`,
    ]);
    p.note(`Log written to ${relative(ROOT, LOG_FILE)}`, 'Check complete');
    p.outro('Done');
  }

  if (inlineUrl) {
    logBlock('URL scan', ['Inline URL archived:', `  ${inlineUrl}`]);
    await runArchive([inlineUrl], 'Archive URL', null);
    return;
  }

  if (!archiveMode && !checkOnly) {
    const mode = await p.select({
      message: 'How do you want to provide URLs?',
      options: [
        { value: 'scan', label: 'Scan files', hint: 'find URLs in src/contents/' },
        { value: 'paste', label: 'Paste a URL', hint: 'manually enter one or more URLs' },
      ],
    });

    if (p.isCancel(mode)) {
      p.cancel('Cancelled');
      process.exit(0);
    }

    if (mode === 'paste') {
      const input = await p.text({
        message: 'Paste URL(s) to archive (one per line, or comma-separated)',
        placeholder: 'https://example.com',
        validate: v => (v.trim().length === 0 ? 'Please enter at least one URL' : undefined),
      });

      if (p.isCancel(input)) {
        p.cancel('Cancelled');
        process.exit(0);
      }

      const urls = input.split(/[\n,]+/).map(s => s.trim()).filter(s => s.startsWith('http'));
      if (urls.length === 0) {
        p.log.error('No valid URLs found in input.');
        p.outro('Done');
        return;
      }

      logBlock('URL scan', [`Pasted URLs: ${urls.length} URL(s) to archive`]);
      await runArchive(urls, 'Archive URLs (pasted)', null);
      return;
    }
  }

  const spinner = p.spinner();
  spinner.start('Scanning for absolute URLs...');

  const allFiles = walkDir(CONTENTS);
  const scanTargets = allFiles.filter(f => SCAN_EXTS.includes(extname(f).toLowerCase()));

  const { active: allResults, totalSkipped } = scanFiles(scanTargets, forceNew);
  const results = dedup(allResults);
  const unique = uniqueUrls(results);

  const skippedNote = totalSkipped
    ? ` · ${totalSkipped} already archived (--force to include)`
    : '';
  spinner.stop(`Found ${allResults.length} URL occurrences · ${unique.length} unique · ${scanTargets.length} files${skippedNote}`);

  if (results.length === 0) {
    p.log.success(`${totalSkipped ? 'All URLs already archived. Use --force to include them.' : 'No absolute URLs found.'}`);
    p.outro('Done');
    return;
  }

  const byFile = new Map();
  for (const r of results) {
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push(r);
  }

  p.log.message('URLs by file:');
  for (const [file, urls] of byFile) {
    p.log.message(`  ${file}  (${urls.length} URLs)`);
  }

  if (checkOnly) {
    runCheck(results);
    return;
  }

  if (archiveMode) {
    await runArchive(unique.map(r => r.url), 'Archive URLs', results);
    return;
  }

  const action = await p.select({
    message: `${unique.length} unique URLs found. What would you like to do?`,
    options: [
      { value: 'archive', label: 'Archive all URLs', hint: 'save snapshots to Wayback Machine' },
      { value: 'archive-force', label: 'Archive all (force new)', hint: 'create fresh snapshots' },
      { value: 'select', label: 'Select files to archive', hint: 'choose which files to process' },
      { value: 'check', label: 'Just list URLs', hint: 'log without archiving' },
      { value: 'cancel', label: 'Cancel' },
    ],
  });

  if (p.isCancel(action) || action === 'cancel') {
    p.cancel('Cancelled');
    process.exit(0);
  }

  if (action === 'check') {
    runCheck(results);
    return;
  }

  if (action === 'archive-force') forceNew = true;

  if (action === 'select') {
    const fileOptions = [...byFile.entries()].map(([file, urls]) => ({
      value: file,
      label: `${file}  (${urls.length} URLs)`,
    }));

    const selected = await p.multiselect({
      message: 'Select files to archive URLs from',
      options: fileOptions,
      required: true,
    });

    if (p.isCancel(selected)) {
      p.cancel('Cancelled');
      process.exit(0);
    }

    const selectedResults = results.filter(r => selected.includes(r.file));
    const selectedUrls = [...new Set(selectedResults.map(r => r.url))];
    const fileLabel = selected.length === 1 ? selected[0] : `${selected.length} files`;
    await runArchive(selectedUrls, `Archive URLs (${fileLabel})`, selectedResults);
    return;
  }

  await runArchive(unique.map(r => r.url), 'Archive URLs', results);
}

main().catch(err => {
  p.cancel('Script failed');
  console.error(err);
  try { appendFileSync(LOG_FILE, `\nFATAL: ${err.message}\n`); } catch {}
  process.exit(1);
});
