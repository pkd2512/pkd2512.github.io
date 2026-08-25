### Personal Portfolio website

View it live at <http://prasantakrdutta.com>

### Site data (CSVs synced from Google Sheets)

All CSVs under `src/contents/data/` are kept in sync with named tabs in one
Google Sheet, so this data can be added/edited from the sheet instead of
hand-editing the CSVs:

- Sheet: <https://docs.google.com/spreadsheets/d/1Tpi2NBoq7Oxo-LJpNOgonCEcRB3zVr4dpdnkOdOVR7o/edit>
- The sheet's sharing must be set to **Anyone with the link → Viewer** (Share →
  General access) so the sync script can fetch it without authentication.
- `pnpm run sync:data` pulls the latest rows from every tab into its matching
  CSV. This also runs automatically before `pnpm run build` (see `prebuild` in
  `package.json`); any tab that's unreachable, not public, or missing is
  skipped for that file only, leaving the existing CSV as-is.
- Tab name ↔ file mapping (`scripts/sync-data-from-sheet.js`):

  | Tab          | File                 |
  | ------------ | -------------------- |
  | Talks        | `talks.csv`          |
  | Awards       | `awards.csv`         |
  | Resources    | `resources.csv`      |
  | Mentions     | `mentions.csv`       |
  | NavLinks     | `navlinks.csv`       |
  | Teachings    | `teachings.csv`      |
  | SocialUrls   | `socialurls.csv`     |
  | Testimonials | `testimonials.csv`   |

- Each tab's header row must stay in the same column order as its CSV's
  existing header (e.g. Talks stays `date,place,topic,url`) — don't rename,
  reorder, or delete columns in the sheet.
- Don't rename the tabs themselves, or the sync for that tab will start
  skipping (mismatched tab name → no CSV export for it).
