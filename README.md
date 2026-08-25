### Personal Portfolio website

View it live at <http://prasantakrdutta.com>

### Talks data

`src/contents/data/talks.csv` is kept in sync with a Google Sheet, so talks can be
added/edited from the sheet instead of hand-editing the CSV:

- Sheet: <https://docs.google.com/spreadsheets/d/1O4R439ERDh-MSNHMmPzq_d8sRVzGj0UQJn83kr92adA/edit>
- The sheet's sharing must be set to **Anyone with the link → Viewer** (Share →
  General access) so the sync script can fetch it without authentication.
- `pnpm run sync:talks` pulls the latest rows from the sheet into `talks.csv`.
  This also runs automatically before `pnpm run build` (see `prebuild` in
  `package.json`); if the sheet is unreachable or not public, the sync is
  skipped and the existing `talks.csv` is left as-is.
- Columns must stay `date,place,topic,url` in that order, matching the CSV header.
