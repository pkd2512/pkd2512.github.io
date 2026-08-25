// Pulls all site data CSVs from named tabs in one Google Sheet into
// src/contents/data/*.csv, so the sheet is the editable source of truth.
//
// The sheet must have its general access set to "Anyone with the link -> Viewer"
// (Share -> General access, in Google Sheets) for the export URLs to work
// without auth.
//
// Sheet: https://docs.google.com/spreadsheets/d/1Tpi2NBoq7Oxo-LJpNOgonCEcRB3zVr4dpdnkOdOVR7o/edit
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'contents', 'data');

const SHEET_ID = process.env.SITE_DATA_SHEET_ID || '1Tpi2NBoq7Oxo-LJpNOgonCEcRB3zVr4dpdnkOdOVR7o';

// Tab name (in the sheet) -> local CSV filename it feeds.
const TABS = {
  Talks: 'talks.csv',
  Awards: 'awards.csv',
  Resources: 'resources.csv',
  Mentions: 'mentions.csv',
  NavLinks: 'navlinks.csv',
  Teachings: 'teachings.csv',
  SocialUrls: 'socialurls.csv',
  Testimonials: 'testimonials.csv',
};

function exportUrl(tabName) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
}

async function syncTab(tabName, filename) {
  const csvPath = join(DATA_DIR, filename);

  let res;
  try {
    res = await fetch(exportUrl(tabName), { redirect: 'follow' });
  } catch (err) {
    warn(filename, `could not reach Google Sheets (${err.message}).`);
    return;
  }

  if (!res.ok) {
    warn(filename, `sheet export for tab "${tabName}" returned HTTP ${res.status}.`);
    return;
  }

  const body = await res.text();

  // A private/unshared sheet (or a missing tab) returns an HTML page instead of CSV.
  if (body.trimStart().startsWith('<')) {
    warn(
      filename,
      `tab "${tabName}" didn't return CSV -- check the sheet is shared as ` +
        '"Anyone with the link -> Viewer" and the tab name matches exactly.'
    );
    return;
  }

  if (!body.trim()) {
    warn(filename, `tab "${tabName}" export was empty; keeping the existing file.`);
    return;
  }

  writeFileSync(csvPath, body.endsWith('\n') ? body : body + '\n', 'utf-8');
  console.log(`Synced ${filename} from "${tabName}" tab.`);
}

function warn(filename, msg) {
  console.warn(`[sync-data-from-sheet] Skipping ${filename} -- ${msg}`);
}

async function main() {
  for (const [tabName, filename] of Object.entries(TABS)) {
    await syncTab(tabName, filename);
  }
}

main();
