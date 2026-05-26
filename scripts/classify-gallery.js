import 'dotenv/config';

import * as p from '@clack/prompts';

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { join, resolve } from 'path';

import { csvFormat, csvParse } from 'd3-dsv';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATIC_MEDIA = resolve(ROOT, 'static', 'media');
const DATA = resolve(ROOT, 'src', 'contents', 'data');
const LOG_DIR = resolve(ROOT, 'script-logs');
const BATCH_SIZE = 10;

function logLine(msg) {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  appendFileSync(join(LOG_DIR, 'classify.log'), `[${ts}] ${msg}\n`);
}

const GRAPHIC_TYPES = ['chart', 'map', 'photo', 'illustration', 'other'];
const CATEGORY_KEYWORDS = [
  { cat: 'covid-19', words: ['covid', 'coronavirus', 'vaccin', 'pandemic'] },
  {
    cat: 'conflict',
    words: [
      'war',
      'conflict',
      'invasion',
      'military',
      'attack',
      'rebel',
      'protest',
      'riot',
      'battle',
      'drone',
    ],
  },
  {
    cat: 'natural-disaster',
    words: [
      'earthquake',
      'flood',
      'cyclone',
      'wildfire',
      'hurricane',
      'tsunami',
      'disaster',
      'locust',
    ],
  },
  {
    cat: 'environment',
    words: [
      'climate',
      'pollution',
      'emission',
      'fossil',
      'renewable',
      'environment',
      'permafrost',
      'plastic',
    ],
  },
  {
    cat: 'politics',
    words: [
      'election',
      'parliament',
      'vote',
      'brexit',
      'president',
      'government',
      'party',
      'annex',
    ],
  },
  {
    cat: 'economy',
    words: [
      'economy',
      'trade',
      'export',
      'market',
      'currency',
      'inflation',
      'gdp',
      'sterling',
      'valuation',
    ],
  },
  {
    cat: 'science',
    words: [
      'space',
      'moon',
      'lunar',
      'nasa',
      'rocket',
      'satellite',
      'chandrayaan',
      'moonshot',
    ],
  },
  {
    cat: 'sports',
    words: [
      'tour de france',
      'fifa',
      'world cup',
      'tennis',
      'football',
      'sport',
      'olympics',
      'grand slam',
    ],
  },
  {
    cat: 'health',
    words: [
      'health',
      'hospital',
      'disease',
      'outbreak',
      'infection',
      'death',
      'mortality',
    ],
  },
  {
    cat: 'energy',
    words: [
      'oil',
      'gas',
      'energy',
      'petrol',
      'mining',
      'mineral',
      'refining',
      'petrochemical',
    ],
  },
  {
    cat: 'society',
    words: [
      'migration',
      'refugee',
      'population',
      'exodus',
      'abortion',
      'gender',
      'race',
      'racism',
    ],
  },
];

const GEMINI_PROMPT = (() => {
  const types = GRAPHIC_TYPES.join('|');
  const cats = [...CATEGORY_KEYWORDS.map((k) => k.cat), 'misc'].join(', ');
  return (
    'You are an expert image analyst tasked with providing detailed accurate and helpful descriptions of images. Your goal is to make visual content accessible through clear comprehensive text descriptions. Be objective and factual using clear descriptive language. Organize information from general to specific and include relevant context. Start with a brief overview of what the image shows then describe the main subjects and setting. Include visual details like colors lighting, textures, style, genre, contrast and composition. Transcribe any visible text accurately. Use specific concrete language and mention spatial relationships. For people, focus on actions, clothing and general appearance respectfully. For data visualizations, explain the information presented and try to include the numbers if present on the graphic. Describe any visible trends or patterns that make the visual memorable. Write as if describing to someone who cannot see the image including important context for understanding. Balance thoroughness with clarity and provide descriptions in natural flowing narrative form. Your description should not be longer than 150 characters. Then classify it. Reply exactly as:\n' +
    `alt=<description>\n` +
    `type=[${types}]\n` +
    `category=category1, category2, ...\n\n` +
    'Type must be one value. Category can be multiple, comma-separated, ordered by relevance. ' +
    `Here are some example categories for your reference: ${cats}`
  );
})();

// ── CSV helpers ──────────────────────────────────────────────────

function ensureColumn(rows, col, defaultValue = '') {
  for (const r of rows) {
    if (!(col in r)) r[col] = defaultValue;
  }
}

// ── Image resolution ─────────────────────────────────────────────

function resolveImagePath(url) {
  let clean = url;
  if (clean.startsWith('$media/')) clean = clean.slice(7);
  else if (clean.startsWith('/media/')) clean = clean.slice(7);

  const candidates = [
    join(STATIC_MEDIA, clean),
    join(STATIC_MEDIA, clean.replace(/\.webp$/, '.jpg')),
    join(STATIC_MEDIA, clean.replace(/\.webp$/, '.png')),
    join(STATIC_MEDIA, clean.replace(/\.webp$/, '.jpeg')),
  ];
  for (const fp of candidates) {
    if (existsSync(fp)) return fp;
  }
  return null;
}

// ── Filename-based category ──────────────────────────────────────

function classifyFromFilename(title) {
  const lower = title.toLowerCase();
  for (const { cat, words } of CATEGORY_KEYWORDS) {
    for (const w of words) {
      if (lower.includes(w)) return cat;
    }
  }
  return '';
}

// ── Sharp heuristic classifier (graphic_type only) ───────────────

async function classifySharp(imagePath) {
  try {
    const img = sharp(imagePath);
    const meta = await img.metadata();
    const { width, height } = meta;
    if (!width || !height) return 'other';

    const aspect = width / height;

    const sample = await img.resize(64, 64, { fit: 'fill' }).raw().toBuffer();

    const pixels = [];
    for (let i = 0; i < sample.length; i += 3)
      pixels.push({ r: sample[i], g: sample[i + 1], b: sample[i + 2] });

    const colorSet = new Set();
    for (const p of pixels) {
      const qr = Math.round(p.r / 32) * 32;
      const qg = Math.round(p.g / 32) * 32;
      const qb = Math.round(p.b / 32) * 32;
      colorSet.add(`${qr},${qg},${qb}`);
    }
    const uniqueColors = colorSet.size;

    let satSum = 0;
    let satSumSq = 0;
    for (const p of pixels) {
      const max = Math.max(p.r, p.g, p.b);
      const min = Math.min(p.r, p.g, p.b);
      const sat = max === 0 ? 0 : (max - min) / max;
      satSum += sat;
      satSumSq += sat * sat;
    }
    const n = pixels.length;
    const satVariance = satSumSq / n - (satSum / n) * (satSum / n);

    const lightPixels = pixels.filter(
      (p) => p.r > 220 && p.g > 220 && p.b > 220
    );
    const lightRatio = lightPixels.length / n;

    const greenBlue = pixels.filter(
      (p) => p.g > 100 && p.b > 100 && p.r < p.g && p.r < p.b
    );
    const gbRatio = greenBlue.length / n;

    const edgeBuffer = await img
      .resize(128, 128, { fit: 'fill' })
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      })
      .raw()
      .toBuffer();

    let edgePixels = 0;
    for (let i = 0; i < edgeBuffer.length; i++)
      if (edgeBuffer[i] > 80) edgePixels++;
    const edgeRatio = edgePixels / edgeBuffer.length;

    if (lightRatio > 0.3 && edgeRatio > 0.08 && uniqueColors > 30)
      return 'chart';
    if (gbRatio > 0.15 && aspect > 1.2 && edgeRatio > 0.05) return 'map';
    if (
      aspect > 1.5 &&
      edgeRatio > 0.04 &&
      uniqueColors > 20 &&
      uniqueColors < 120
    )
      return 'map';
    if (uniqueColors < 30 && satVariance < 0.02) return 'illustration';
    if (satVariance > 0.08 && uniqueColors > 80 && lightRatio < 0.3)
      return 'photo';
    if (uniqueColors > 100 && satVariance > 0.05) return 'photo';
    if (edgeRatio > 0.12) return 'chart';
    if (aspect > 1.8) return 'map';
    return 'other';
  } catch {
    return 'other';
  }
}

// ── Gemini AI (graphic_type + category + alt) ────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

async function analyzeGemini(imagePath) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = imagePath.split('.').pop().toLowerCase();
    const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: GEMINI_PROMPT,
                },
                { inlineData: { mimeType: mime, data: base64 } },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    const altMatch = text.match(/alt\s*=\s*(.+)/i);
    const typeMatch = text.match(/type\s*[=:]\s*(\w+)/i);
    const catMatch = text.match(/category\s*[=:]\s*(.+)/i);

    const graphicType =
      typeMatch && GRAPHIC_TYPES.includes(typeMatch[1].toLowerCase())
        ? typeMatch[1].toLowerCase()
        : 'other';
    const category = catMatch
      ? catMatch[1]
          .split(',')
          .map((c) => c.trim().toLowerCase())
          .filter((c) => c)
          .join(', ')
      : '';
    const alt = altMatch ? altMatch[1].trim().replace(/^["']|["']$/g, '') : '';

    return { graphicType, category, alt };
  } catch {
    return null;
  }
}

// ── Check Gemini availability ────────────────────────────────────

async function checkGemini() {
  if (!GEMINI_API_KEY) {
    p.log.warn(
      'GEMINI_API_KEY not set. Get one at https://aistudio.google.com/apikey'
    );
    return false;
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'reply ok' }] }],
        }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

// ── Alt text fallback ────────────────────────────────────────────

function altFromEntry(entry, graphicType) {
  const t = entry.title || entry.id || 'image';
  const g = graphicType || 'graphic';
  const clean = t.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  return `A ${g} showing ${clean}`;
}

// ─── Main ────────────────────────────────────────────────────────

async function selectCsv() {
  const files = readdirSync(DATA)
    .filter((f) => f.endsWith('.csv'))
    .sort();

  if (files.length === 0) {
    p.log.error('No CSV files found in src/contents/data/');
    process.exit(1);
  }

  const pick = await p.select({
    message: 'Which CSV to classify?',
    options: files.map((f) => ({ value: f, label: f.replace('.csv', '') })),
  });
  if (p.isCancel(pick)) {
    p.cancel();
    process.exit(0);
  }
  return pick;
}

function needsClassify(row, field) {
  return !row[field] || row[field] === 'dataviz';
}

async function main() {
  p.intro('Gallery classifier');

  const csvFile = await selectCsv();
  const csvPath = join(DATA, csvFile);
  const raw = readFileSync(csvPath, 'utf-8');
  const rows = csvParse(raw);

  if (rows.length === 0) {
    p.log.error('CSV is empty');
    process.exit(1);
  }

  const hasType = rows.columns.includes('graphic_type');
  const hasCat = rows.columns.includes('category');
  const hasAlt = rows.columns.includes('alt');

  if (!hasType && !hasCat && !hasAlt) {
    p.log.error("CSV has none of: 'graphic_type', 'category', 'alt'");
    process.exit(1);
  }

  const mode = await p.select({
    message: 'How to handle existing values?',
    options: [
      {
        value: 'fill',
        label: 'Fill missing only',
        hint: 'leave existing values as-is',
      },
      {
        value: 'overwrite',
        label: 'Overwrite all',
        hint: 're-classify every entry',
      },
    ],
  });
  if (p.isCancel(mode)) {
    p.cancel();
    process.exit(0);
  }

  const doAlt = await p.confirm({
    message: 'Generate alt text for images?',
    activeLabel: 'Yes',
    inactiveLabel: 'No',
  });
  if (p.isCancel(doAlt)) {
    p.cancel();
    process.exit(0);
  }

  const toClassify =
    mode === 'overwrite'
      ? rows
      : rows.filter((r) => {
          if (hasType && needsClassify(r, 'graphic_type')) return true;
          if (hasCat && needsClassify(r, 'category')) return true;
          if (doAlt && hasAlt && needsClassify(r, 'alt')) return true;
          return false;
        });

  if (toClassify.length === 0) {
    p.log.info('All entries already have values');
    process.exit(0);
  }

  if (mode === 'overwrite') {
    for (const r of rows) {
      if (hasType) r.graphic_type = '';
      if (hasCat) r.category = '';
      if (doAlt && hasAlt) r.alt = '';
    }
    writeFileSync(csvPath, csvFormat(rows));
    logLine(`${csvFile} — cleared columns for overwrite`);
  }

  p.log.info(`${toClassify.length} / ${rows.length} entries to process`);

  // Only show AI prompt if there's actual image analysis needed (type/category)
  const needsImage = toClassify.some(
    (r) =>
      (hasType && (mode === 'overwrite' || needsClassify(r, 'graphic_type'))) ||
      (hasCat && (mode === 'overwrite' || needsClassify(r, 'category')))
  );

  let useAi = false;
  let geminiOk = false;

  if (needsImage || doAlt) {
    const aiChoice = await p.confirm({
      message:
        'Use Gemini AI?' + (doAlt ? ' (recommended for good alt text)' : ''),
      activeLabel: 'Yes (Gemini)',
      inactiveLabel: 'No (heuristic)',
    });
    if (p.isCancel(aiChoice)) {
      p.cancel();
      process.exit(0);
    }
    useAi = aiChoice;

    if (useAi) {
      const s = p.spinner();
      s.start('Checking Gemini...');
      geminiOk = await checkGemini();
      s.stop(geminiOk ? 'Gemini ready' : 'Gemini not available');

      if (!geminiOk) {
        const proceed = await p.confirm({
          message: 'Gemini not available. Fall back to heuristic?',
          activeLabel: 'Yes',
          inactiveLabel: 'No, cancel',
        });
        if (p.isCancel(proceed) || !proceed) {
          p.cancel();
          process.exit(0);
        }
      }
    }
  }

  // Ensure alt column exists
  if (doAlt && !hasAlt) {
    ensureColumn(rows, 'alt');
  }

  const typeResults = {
    chart: 0,
    map: 0,
    photo: 0,
    illustration: 0,
    other: 0,
    failed: 0,
  };
  const catResults = {};
  let altCount = 0;

  let batchStart = 0;
  while (batchStart < toClassify.length) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, toClassify.length);
    const batch = toClassify.slice(batchStart, batchEnd);

    const prog = p.progress();
    prog.start(batch.length, batch.length);

    for (let i = 0; i < batch.length; i++) {
      const entry = batch[i];
      const imgPath = resolveImagePath(entry.url);
      prog.message(`[${batchStart + i + 1}/${toClassify.length}] ${entry.id}`);

      const needType =
        hasType &&
        (mode === 'overwrite' || needsClassify(entry, 'graphic_type'));
      const needCat =
        hasCat && (mode === 'overwrite' || needsClassify(entry, 'category'));
      const needAlt =
        doAlt && (mode === 'overwrite' || needsClassify(entry, 'alt'));

      if (useAi && geminiOk) {
        if (!imgPath) {
          p.log.warn(`Image not found: ${entry.url}`);
          typeResults.failed++;
          prog.advance();
          continue;
        }

        let result = null;
        let retries = 0;
        while (retries < 5) {
          result = await analyzeGemini(imgPath);
          if (result) break;
          retries++;
          p.log.warn(
            `Gemini failed for ${entry.id} (${retries}/5), retrying in 1 minute...`
          );
          await new Promise((r) => setTimeout(r, 60000));
        }
        if (!result) {
          p.log.warn(`Gemini gave up on ${entry.id} after 5 retries, skipping`);
          typeResults.failed++;
          prog.advance();
          continue;
        }

        if (needType) {
          entry.graphic_type = result.graphicType;
          typeResults[result.graphicType]++;
        }
        if (needCat) {
          const cat =
            result.category || classifyFromFilename(entry.title || entry.id);
          entry.category = cat || 'misc';
          catResults[entry.category] = (catResults[entry.category] || 0) + 1;
        }
        if (needAlt) {
          entry.alt = result.alt || altFromEntry(entry, result.graphicType);
          altCount++;
        }
      } else {
        let gtype = '';
        if (needType) {
          gtype = imgPath ? await classifySharp(imgPath) : 'other';
          entry.graphic_type = gtype;
          typeResults[gtype]++;
        }
        if (needCat) {
          const cat = classifyFromFilename(entry.title || entry.id) || 'misc';
          entry.category = cat;
          catResults[cat] = (catResults[cat] || 0) + 1;
        }
        if (needAlt) {
          gtype = gtype || entry.graphic_type || 'other';
          entry.alt = altFromEntry(entry, gtype);
          altCount++;
        }
      }
      prog.advance();
    }

    prog.stop(
      `Batch ${batchStart / BATCH_SIZE + 1} — ${batchEnd}/${toClassify.length} done`
    );
    writeFileSync(csvPath, csvFormat(rows));
    logLine(
      `${csvFile} — batch ${batchStart / BATCH_SIZE + 1}: ${batchEnd}/${toClassify.length} entries written`
    );

    batchStart = batchEnd;
  }

  if (hasType) {
    const s = Object.entries(typeResults)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ');
    p.log.info(`Types: ${s}`);
  }
  if (hasCat) {
    const s = Object.entries(catResults)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}: ${v}`)
      .join(' · ');
    p.log.info(`Categories: ${s}`);
  }
  if (doAlt) p.log.info(`Alt text generated: ${altCount}`);

  p.outro(`Updated ${csvFile}`);
}

main().catch((err) => {
  p.cancel('Script failed');
  console.error(err);
  process.exit(1);
});
