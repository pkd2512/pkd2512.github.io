// Pulls every tab of one Google Sheet into src/contents/data/<tabname>.csv,
// so the sheet is the editable source of truth.
//
// There is no tab -> filename table. The tabs are discovered from the sheet
// itself and each one lands in its own lowercased file: "Talks" -> talks.csv,
// "SocialUrls" -> socialurls.csv. Add a tab and it syncs; no code change.
//
// Because the filename follows the tab name, RENAMING a tab writes a new file
// and strands the old one. The drift check at the end catches that and fails
// the run rather than letting a page keep importing a CSV nothing updates.
//
// The sheet must have its general access set to "Anyone with the link -> Viewer"
// (Share -> General access, in Google Sheets) for the export URLs to work
// without auth.
//
// Sheet: https://docs.google.com/spreadsheets/d/1Tpi2NBoq7Oxo-LJpNOgonCEcRB3zVr4dpdnkOdOVR7o/edit
//
// NOTE: this runs in CI with bare `node` and no install step (see
// .github/workflows/deploy.yml), so it must stay free of npm dependencies.
// That is why the CSV reader below is hand-rolled rather than d3-dsv.
//
// Self-check, no network and no writes:  node scripts/sync-data-from-sheet.js --selftest
import {
  writeFileSync,
  readFileSync,
  readdirSync,
  renameSync,
  existsSync,
  unlinkSync,
} from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'contents', 'data');

const SHEET_ID =
  process.env.SITE_DATA_SHEET_ID ||
  '1Tpi2NBoq7Oxo-LJpNOgonCEcRB3zVr4dpdnkOdOVR7o';

// `headers=1` is load-bearing, do not drop it. Without it gviz GUESSES how
// many header rows a tab has, and it guesses from the data: when every value
// in the leading columns is text, it can decide that dozens of rows are all
// one multi-row header. It then joins those rows' values together, space
// separated, into the column labels and returns only what is left as data.
// That is exactly what happened to the Talks tab -- 21 rows came back as 2,
// with a header reading "date 2021-03-17 2021-11-20 ...". The sheet was fine
// the whole time; only the export was wrong.
function exportUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&gid=${encodeURIComponent(gid)}`;
}

/** The tab list is embedded in this page as JS, which is why it is scraped. */
function tabsUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
}

/** The page emits JS string literals, not JSON: \x3d, \/ and friends. */
function unescapeJs(s) {
  return s
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/\\(.)/g, '$1');
}

/**
 * Tab name -> the file it owns. Lowercased, with anything that is not a
 * letter or digit collapsed to a dash, so "Nav Links" and "NavLinks" cannot
 * both quietly target navlinks.csv.
 */
export function fileNameFor(tabName) {
  const slug = tabName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `${slug}.csv` : null;
}

/** Pull {name, gid} for every tab out of the sheet's htmlview page. */
export function parseTabs(html) {
  const re =
    /items\.push\(\{name:\s*"((?:[^"\\]|\\.)*)"\s*,\s*pageUrl:\s*"((?:[^"\\]|\\.)*)"/g;
  const tabs = [];
  let m;
  while ((m = re.exec(html))) {
    const name = unescapeJs(m[1]);
    const gid = (m[2].match(/gid=(\d+)/) || [])[1];
    if (name && gid) tabs.push({ name, gid });
  }
  return tabs;
}

async function listTabs() {
  const res = await fetch(tabsUrl(), { redirect: 'follow' });
  if (!res.ok) throw new Error(`htmlview returned HTTP ${res.status}`);
  const tabs = parseTabs(await res.text());
  if (!tabs.length) {
    throw new Error(
      'no tabs found on the sheet page -- it may not be shared as ' +
        '"Anyone with the link -> Viewer", or Google changed the page markup'
    );
  }
  return tabs;
}

/**
 * Minimal RFC 4180 reader — enough for Google's export, which quotes any field
 * containing a comma, a quote or a newline. Returns an array of row arrays.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let started = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      quoted = true;
      started = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
      started = true;
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      started = false;
    } else if (c !== '\r') {
      field += c;
      started = true;
    }
  }
  if (started || field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Decide whether an export is safe to write over `existingText`.
 * Returns a reason string when it is NOT safe, or null when it is.
 *
 * This exists because a bad export once overwrote talks.csv with every column
 * flattened into one space-joined cell: 20 rows became 3, the header row was
 * destroyed, and the page that reads it threw on the first undefined field.
 * Nothing in the old script looked at the body beyond "is it HTML, is it
 * empty", so the corruption was written out silently.
 */
export function rejectReason(incoming, existingText) {
  const rows = parseCsv(incoming);

  if (rows.length < 2) {
    return `parsed as ${rows.length} row(s); expected a header plus at least one row`;
  }

  const header = rows[0];
  if (header.length < 2) {
    return `header has ${header.length} column(s)`;
  }
  if (header.some((h) => h.trim() === '')) {
    return `header has an empty column name: [${header.join(', ')}]`;
  }

  const ragged = rows.findIndex((r) => r.length !== header.length);
  if (ragged > 0) {
    return `row ${ragged + 1} has ${rows[ragged].length} fields but the header has ${header.length}`;
  }

  if (!existingText) return null;

  const existing = parseCsv(existingText);
  const was = existing[0];

  // The check that catches the flattening: a mangled export loses the real
  // column names, so the header stops matching the file being replaced.
  if (was && was.join('\u0000') !== header.join('\u0000')) {
    return `header changed from [${was.join(', ')}] to [${header.join(', ')}]`;
  }

  // Losing half the rows in one sync is far more likely to be a broken export
  // than a real edit. Deliberate bulk deletions can go straight into the file.
  const wasRows = existing.length - 1;
  const nowRows = rows.length - 1;
  if (wasRows >= 4 && nowRows < wasRows / 2) {
    return `row count fell from ${wasRows} to ${nowRows}`;
  }

  return null;
}

/**
 * Compare the files the sheet claims to own against the CSVs on disk.
 * A file with no tab behind it is the dangerous case: a page still imports
 * it, but nothing updates it any more.
 */
export function driftReport(expectedFiles, onDiskFiles) {
  const expected = new Set(expectedFiles);
  const onDisk = new Set(onDiskFiles);
  const stranded = onDiskFiles.filter((f) => !expected.has(f)).sort();
  const added = expectedFiles.filter((f) => !onDisk.has(f)).sort();
  // One in, one out, in the same run is a rename far more often than it is a
  // coincidence, so say so rather than making someone infer it.
  const looksLikeRename = stranded.length > 0 && added.length > 0;
  return { stranded, added, looksLikeRename };
}

/** Write via a temp file so a crash mid-write cannot truncate a good CSV. */
function writeAtomic(path, contents) {
  const tmp = `${path}.tmp`;
  try {
    writeFileSync(tmp, contents, 'utf-8');
    renameSync(tmp, path);
  } catch (err) {
    if (existsSync(tmp)) {
      try {
        unlinkSync(tmp);
      } catch {
        // best effort; the rename is what matters
      }
    }
    throw err;
  }
}

async function syncTab(tab) {
  const filename = fileNameFor(tab.name);
  if (!filename) {
    return reject(
      `"${tab.name}"`,
      'tab name has no letters or digits to make a filename from.'
    );
  }
  const csvPath = join(DATA_DIR, filename);

  let res;
  try {
    res = await fetch(exportUrl(tab.gid), { redirect: 'follow' });
  } catch (err) {
    return skip(filename, `could not reach Google Sheets (${err.message}).`);
  }

  if (!res.ok) {
    return skip(
      filename,
      `export for tab "${tab.name}" returned HTTP ${res.status}.`
    );
  }

  const body = await res.text();

  // A private/unshared sheet (or a missing tab) returns an HTML page instead of CSV.
  if (body.trimStart().startsWith('<')) {
    return skip(
      filename,
      `tab "${tab.name}" didn't return CSV -- check the sheet is shared as ` +
        '"Anyone with the link -> Viewer".'
    );
  }

  if (!body.trim()) {
    return skip(filename, `tab "${tab.name}" export was empty.`);
  }

  const existingText = existsSync(csvPath)
    ? readFileSync(csvPath, 'utf-8')
    : '';
  const reason = rejectReason(body, existingText);
  if (reason) {
    return reject(
      filename,
      `tab "${tab.name}" returned CSV that looks wrong: ${reason}.`
    );
  }

  writeAtomic(csvPath, body.endsWith('\n') ? body : body + '\n');
  console.log(`Synced ${filename} from "${tab.name}" tab.`);
  return 'ok';
}

function skip(filename, msg) {
  console.warn(
    `[sync-data-from-sheet] Skipping ${filename} -- ${msg} Keeping the existing file.`
  );
  return 'skipped';
}

function reject(filename, msg) {
  console.error(
    `[sync-data-from-sheet] REJECTED ${filename} -- ${msg} Keeping the existing file.`
  );
  return 'rejected';
}

function selftest() {
  let failures = 0;
  const check = (name, pass, detail = '') => {
    if (pass) console.log(`ok    ${name}${detail ? ` -> ${detail}` : ''}`);
    else {
      console.error(`FAIL  ${name} -> ${detail}`);
      failures++;
    }
  };

  // --- tab name -> filename ---
  for (const [input, want] of [
    ['Talks', 'talks.csv'],
    ['NavLinks', 'navlinks.csv'],
    ['SocialUrls', 'socialurls.csv'],
    ['  Testimonials  ', 'testimonials.csv'],
    ['Nav Links', 'nav-links.csv'],
    ['Talks (2026)', 'talks-2026.csv'],
    ['   ', null],
  ]) {
    const got = fileNameFor(input);
    check(`fileNameFor(${JSON.stringify(input)})`, got === want, `${got}`);
  }

  // --- tab discovery ---
  const sample =
    'var items = [];items.push({name: "Talks", pageUrl: "https:\\/\\/x\\/edit?headers\\x3dtrue&gid=111"});' +
    'items.push({name: "Nav\\/Links", pageUrl: "https:\\/\\/x\\/edit?gid=222"});';
  const tabs = parseTabs(sample);
  check(
    'parseTabs finds both tabs with gids',
    tabs.length === 2 && tabs[0].gid === '111' && tabs[1].name === 'Nav/Links',
    JSON.stringify(tabs)
  );
  check(
    'parseTabs on junk returns nothing',
    parseTabs('<html>nope</html>').length === 0
  );

  // --- drift ---
  const same = driftReport(['a.csv', 'b.csv'], ['a.csv', 'b.csv']);
  check('drift: no change', !same.stranded.length && !same.added.length);

  const renamed = driftReport(['a.csv', 'c.csv'], ['a.csv', 'b.csv']);
  check(
    'drift: a rename is flagged as stranded + added',
    renamed.stranded[0] === 'b.csv' &&
      renamed.added[0] === 'c.csv' &&
      renamed.looksLikeRename,
    JSON.stringify(renamed)
  );

  const grew = driftReport(['a.csv', 'b.csv', 'c.csv'], ['a.csv', 'b.csv']);
  check(
    'drift: a brand new tab adds a file, strands nothing',
    grew.added[0] === 'c.csv' && !grew.stranded.length && !grew.looksLikeRename,
    JSON.stringify(grew)
  );

  // --- CSV validation ---
  const good =
    '"date","place","topic","url","archive_url"\n' +
    '"2021-03-17","IIM Lucknow","A talk","",""\n' +
    '"2026-01-30","NID Bangalore","Maps","",""\n' +
    '"2026-07-03","VizChitra 2026","Tables to Maps","",""\n' +
    '"2026-07-30","Gyaan Adda","Seeing the invisible","",""\n';

  // The real corruption: every column flattened into one space-joined cell,
  // taking the header with it, then the new rows appended below.
  const flattened =
    '"date 2021-03-17 2026-01-30","place IIM Lucknow NID Bangalore","topic A talk Maps","url","archive_url"\n' +
    '"2026-07-03","VizChitra 2026","Tables to Maps","",""\n' +
    '"2026-07-30","Gyaan Adda","Seeing the invisible","",""\n';

  for (const [name, incoming, existing, expected] of [
    ['accepts an unchanged export', good, good, null],
    [
      'accepts a row being added',
      good + '"2026-08-01","X","Y","",""\n',
      good,
      null,
    ],
    [
      'rejects the flattening that broke talks.csv',
      flattened,
      good,
      /header changed/,
    ],
    [
      'rejects a renamed column',
      good.replace('"topic"', '"subject"'),
      good,
      /header changed/,
    ],
    [
      'rejects losing most rows',
      '"date","place","topic","url","archive_url"\n"2021-03-17","a","b","",""\n',
      good,
      /row count fell/,
    ],
    [
      'rejects a ragged row',
      good + '"2026-08-01","only-two"\n',
      good,
      /fields but the header has/,
    ],
    [
      'rejects a header-only export',
      '"date","place","topic","url","archive_url"\n',
      good,
      /expected a header plus/,
    ],
  ]) {
    const got = rejectReason(incoming, existing);
    const pass =
      expected === null ? got === null : got !== null && expected.test(got);
    check(name, pass, got === null ? 'accepted' : got);
  }

  const multiline = '"a","b"\n"line one\nline two","x"\n';
  const parsed = parseCsv(multiline);
  check(
    'parses a quoted newline as one field',
    parsed.length === 2 && parsed[1][0] === 'line one\nline two',
    JSON.stringify(parsed)
  );

  // --- the real files ---
  // They must validate against themselves, or a parser bug would start
  // rejecting perfectly good exports.
  for (const filename of readdirSync(DATA_DIR).filter((f) =>
    f.endsWith('.csv')
  )) {
    const text = readFileSync(join(DATA_DIR, filename), 'utf-8');
    const rows = parseCsv(text);
    const got = rejectReason(text, text);
    check(
      `${filename} (${rows.length - 1} rows x ${rows[0].length} cols)`,
      got === null,
      got || ''
    );
  }

  console.log(
    failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.'
  );
  process.exit(failures ? 1 : 0);
}

async function main() {
  if (process.argv.includes('--selftest')) return selftest();

  let tabs;
  try {
    tabs = await listTabs();
  } catch (err) {
    // Without the tab list there is nothing safe to do: syncing a guessed
    // subset would silently leave the rest stale.
    console.error(
      `[sync-data-from-sheet] Could not list the sheet's tabs -- ${err.message}. ` +
        'Nothing was synced; the existing CSVs are untouched.'
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `Found ${tabs.length} tab(s): ${tabs.map((t) => t.name).join(', ')}`
  );

  const results = [];
  for (const tab of tabs) {
    results.push([fileNameFor(tab.name), await syncTab(tab)]);
  }

  const rejected = results.filter(([, r]) => r === 'rejected').map(([f]) => f);
  if (rejected.length) {
    console.error(
      `\n[sync-data-from-sheet] ${rejected.length} tab(s) rejected: ${rejected.join(', ')}. ` +
        'The sheet needs fixing; those CSVs were left untouched.'
    );
    process.exitCode = 1;
  }

  const { stranded, added, looksLikeRename } = driftReport(
    tabs.map((t) => fileNameFor(t.name)).filter(Boolean),
    readdirSync(DATA_DIR).filter((f) => f.endsWith('.csv'))
  );

  if (added.length) {
    console.log(
      `\n[sync-data-from-sheet] New file(s) from new tab(s): ${added.join(', ')}.`
    );
  }

  if (stranded.length) {
    console.error(
      `\n[sync-data-from-sheet] ${stranded.join(', ')} ` +
        `${stranded.length === 1 ? 'has' : 'have'} no matching tab in the sheet. ` +
        (looksLikeRename
          ? `This looks like a rename (${stranded.join(', ')} -> ${added.join(', ')}): ` +
            'rename the tab back, or update the imports and delete the old file.'
          : 'A tab was renamed or deleted; nothing updates this file any more.')
    );
    process.exitCode = 1;
  }
}

main();
