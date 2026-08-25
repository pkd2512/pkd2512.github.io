// Pulls the "Talks" CSV data from Google Sheets and writes it into
// src/contents/data/talks.csv, so the sheet is the editable source of truth.
//
// The sheet must have its general access set to "Anyone with the link -> Viewer"
// (Share -> General access, in Google Sheets) for the export URL to work without auth.
//
// Sheet: https://docs.google.com/spreadsheets/d/1O4R439ERDh-MSNHMmPzq_d8sRVzGj0UQJn83kr92adA/edit
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const TALKS_CSV = join(ROOT, 'src', 'contents', 'data', 'talks.csv');

const SHEET_ID = process.env.TALKS_SHEET_ID || '1O4R439ERDh-MSNHMmPzq_d8sRVzGj0UQJn83kr92adA';
const GID = process.env.TALKS_SHEET_GID || '0';
const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

async function main() {
  let res;
  try {
    res = await fetch(EXPORT_URL, { redirect: 'follow' });
  } catch (err) {
    warn(`could not reach Google Sheets (${err.message}).`);
    return;
  }

  if (!res.ok) {
    warn(`Google Sheets export returned HTTP ${res.status}.`);
    return;
  }

  const body = await res.text();

  // A private/unshared sheet redirects to an HTML sign-in page instead of CSV.
  if (body.trimStart().startsWith('<')) {
    warn(
      "the sheet didn't return CSV -- check its sharing is set to " +
        '"Anyone with the link -> Viewer" (Share -> General access).'
    );
    return;
  }

  if (!body.trim()) {
    warn('the sheet export was empty; keeping the existing talks.csv.');
    return;
  }

  writeFileSync(TALKS_CSV, body.endsWith('\n') ? body : body + '\n', 'utf-8');
  console.log(`Synced ${TALKS_CSV} from Google Sheets.`);
}

function warn(msg) {
  console.warn(`[sync-talks-from-sheet] Skipping sync -- ${msg}`);
  if (!existsSync(TALKS_CSV) || !readFileSync(TALKS_CSV, 'utf-8').trim()) {
    console.warn('[sync-talks-from-sheet] No existing talks.csv to fall back on.');
  }
}

main();
