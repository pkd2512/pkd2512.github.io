import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import * as p from '@clack/prompts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const STATIC_MEDIA = resolve(ROOT, 'static', 'media');
const DATA = resolve(ROOT, 'src', 'contents', 'data');

const GRAPHIC_TYPES = ['chart', 'map', 'photo', 'illustration', 'other'];
const CATEGORY_KEYWORDS = [
  { cat: 'covid-19', words: ['covid', 'coronavirus', 'vaccin', 'pandemic'] },
  { cat: 'conflict', words: ['war', 'conflict', 'invasion', 'military', 'attack', 'rebel', 'protest', 'riot', 'battle', 'drone'] },
  { cat: 'natural-disaster', words: ['earthquake', 'flood', 'cyclone', 'wildfire', 'hurricane', 'tsunami', 'disaster', 'locust'] },
  { cat: 'environment', words: ['climate', 'pollution', 'emission', 'fossil', 'renewable', 'environment', 'permafrost', 'plastic'] },
  { cat: 'politics', words: ['election', 'parliament', 'vote', 'brexit', 'president', 'government', 'party', 'annex'] },
  { cat: 'economy', words: ['economy', 'trade', 'export', 'market', 'currency', 'inflation', 'gdp', 'sterling', 'valuation'] },
  { cat: 'science', words: ['space', 'moon', 'lunar', 'nasa', 'rocket', 'satellite', 'chandrayaan', 'moonshot'] },
  { cat: 'sports', words: ['tour de france', 'fifa', 'world cup', 'tennis', 'football', 'sport', 'olympics', 'grand slam'] },
  { cat: 'health', words: ['health', 'hospital', 'disease', 'outbreak', 'infection', 'death', 'mortality'] },
  { cat: 'energy', words: ['oil', 'gas', 'energy', 'petrol', 'mining', 'mineral', 'refining', 'petrochemical'] },
  { cat: 'society', words: ['migration', 'refugee', 'population', 'exodus', 'abortion', 'gender', 'race', 'racism'] },
];

// ── CSV helpers ──────────────────────────────────────────────────

function csvParse(text) {
  const rows = [];
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return [[], []];
  const header = parseLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length === 0) continue;
    const row = {};
    header.forEach((h, j) => { row[h] = vals[j] || ''; });
    rows.push(row);
  }
  return [header, rows];
}

function parseLine(line) {
  const vals = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { cur += c; }
    } else {
      if (c === '"') { inQ = true; }
      else if (c === ',') { vals.push(cur); cur = ''; }
      else { cur += c; }
    }
  }
  vals.push(cur);
  return vals;
}

function csvEscape(val) {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n'))
    return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function toCsv(rows) {
  if (rows.length === 0) return '';
  const header = Object.keys(rows[0]);
  const lines = [header.map(csvEscape).join(',')];
  for (const row of rows)
    lines.push(header.map(k => csvEscape(row[k] ?? '')).join(','));
  return lines.join('\n') + '\n';
}

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

    const sample = await img
      .resize(64, 64, { fit: 'fill' })
      .raw()
      .toBuffer();

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

    const lightPixels = pixels.filter(p => p.r > 220 && p.g > 220 && p.b > 220);
    const lightRatio = lightPixels.length / n;

    const greenBlue = pixels.filter(p => p.g > 100 && p.b > 100 && p.r < p.g && p.r < p.b);
    const gbRatio = greenBlue.length / n;

    const edgeBuffer = await img
      .resize(128, 128, { fit: 'fill' })
      .greyscale()
      .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
      .raw()
      .toBuffer();

    let edgePixels = 0;
    for (let i = 0; i < edgeBuffer.length; i++)
      if (edgeBuffer[i] > 80) edgePixels++;
    const edgeRatio = edgePixels / edgeBuffer.length;

    if (lightRatio > 0.3 && edgeRatio > 0.08 && uniqueColors > 30) return 'chart';
    if (gbRatio > 0.15 && aspect > 1.2 && edgeRatio > 0.05) return 'map';
    if (aspect > 1.5 && edgeRatio > 0.04 && uniqueColors > 20 && uniqueColors < 120) return 'map';
    if (uniqueColors < 30 && satVariance < 0.02) return 'illustration';
    if (satVariance > 0.08 && uniqueColors > 80 && lightRatio < 0.3) return 'photo';
    if (uniqueColors > 100 && satVariance > 0.05) return 'photo';
    if (edgeRatio > 0.12) return 'chart';
    if (aspect > 1.8) return 'map';
    return 'other';
  } catch {
    return 'other';
  }
}

// ── Ollama AI (graphic_type + category + alt) ────────────────────

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function analyzeOllama(imagePath) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava',
        prompt: 'Write alt text for this image (max 12 words). Then classify it. Reply exactly as:\nalt=<description>\ntype=[chart|map|photo|illustration|other]\ncategory=[covid-19|conflict|natural-disaster|environment|politics|economy|science|sports|health|energy|society|misc]',
        images: [base64],
        stream: false,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.response?.trim() || '';

    const altMatch = text.match(/alt\s*=\s*(.+)/i);
    const typeMatch = text.match(/type\s*[=:]\s*(\w+)/i);
    const catMatch = text.match(/category\s*[=:]\s*([\w-]+)/i);

    const graphicType = typeMatch && GRAPHIC_TYPES.includes(typeMatch[1].toLowerCase())
      ? typeMatch[1].toLowerCase() : 'other';
    const category = catMatch && catMatch[1].toLowerCase() !== 'misc' ? catMatch[1].toLowerCase() : '';
    const alt = altMatch ? altMatch[1].trim().replace(/^["']|["']$/g, '') : '';

    return { graphicType, category, alt };
  } catch {
    return null;
  }
}

// ── Alt text fallback ────────────────────────────────────────────

function altFromEntry(entry, graphicType) {
  const t = entry.title || entry.id || 'image';
  const g = graphicType || 'graphic';
  const clean = t.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  return `A ${g} showing ${clean}`;
}

// ── Check Ollama availability ────────────────────────────────────

async function checkOllama() {
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    if (!res.ok) return false;
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);
    if (models.length === 0) {
      p.log.warn('Ollama running but no models found. Run: ollama pull llava');
      return false;
    }
    const hasVision = models.some(m => /llava|llama.*vision|bakllava|moondream/.test(m));
    if (!hasVision) {
      p.log.warn('No vision model detected. Run: ollama pull llava');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Main ────────────────────────────────────────────────────────

async function selectCsv() {
  const files = readdirSync(DATA)
    .filter(f => f.endsWith('.csv'))
    .sort();

  if (files.length === 0) {
    p.log.error('No CSV files found in src/contents/data/');
    process.exit(1);
  }

  const pick = await p.select({
    message: 'Which CSV to classify?',
    options: files.map(f => ({ value: f, label: f.replace('.csv', '') })),
  });
  if (p.isCancel(pick)) { p.cancel(); process.exit(0); }
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
  const [header, rows] = csvParse(raw);

  if (rows.length === 0) {
    p.log.error('CSV is empty');
    process.exit(1);
  }

  const hasType = header.includes('graphic_type');
  const hasCat = header.includes('category');
  const hasAlt = header.includes('alt');

  if (!hasType && !hasCat && !hasAlt) {
    p.log.error("CSV has none of: 'graphic_type', 'category', 'alt'");
    process.exit(1);
  }

  const mode = await p.select({
    message: 'How to handle existing values?',
    options: [
      { value: 'fill', label: 'Fill missing only', hint: 'leave existing values as-is' },
      { value: 'overwrite', label: 'Overwrite all', hint: 're-classify every entry' },
    ],
  });
  if (p.isCancel(mode)) { p.cancel(); process.exit(0); }

  const doAlt = await p.confirm({
    message: 'Generate alt text for images?',
    activeLabel: 'Yes',
    inactiveLabel: 'No',
  });
  if (p.isCancel(doAlt)) { p.cancel(); process.exit(0); }

  const toClassify = mode === 'overwrite'
    ? rows
    : rows.filter(r => {
        if (hasType && needsClassify(r, 'graphic_type')) return true;
        if (hasCat && needsClassify(r, 'category')) return true;
        if (doAlt && hasAlt && needsClassify(r, 'alt')) return true;
        return false;
      });

  if (toClassify.length === 0) {
    p.log.info('All entries already have values');
    process.exit(0);
  }

  p.log.info(`${toClassify.length} / ${rows.length} entries to process`);

  // Only show AI prompt if there's actual image analysis needed (type/category)
  const needsImage = toClassify.some(r =>
    (hasType && (mode === 'overwrite' || needsClassify(r, 'graphic_type'))) ||
    (hasCat && (mode === 'overwrite' || needsClassify(r, 'category')))
  );

  let useAi = false;
  let ollamaOk = false;

  if (needsImage || doAlt) {
    const aiChoice = await p.confirm({
      message: 'Use Ollama AI?' + (doAlt ? ' (recommended for good alt text)' : ''),
      activeLabel: 'Yes (Ollama)',
      inactiveLabel: 'No (heuristic)',
    });
    if (p.isCancel(aiChoice)) { p.cancel(); process.exit(0); }
    useAi = aiChoice;

    if (useAi) {
      const s = p.spinner();
      s.start('Checking Ollama...');
      ollamaOk = await checkOllama();
      s.stop(ollamaOk ? 'Ollama ready' : 'Ollama not available');

      if (!ollamaOk) {
        const proceed = await p.confirm({
          message: 'Ollama not available. Fall back to heuristic?',
          activeLabel: 'Yes',
          inactiveLabel: 'No, cancel',
        });
        if (p.isCancel(proceed) || !proceed) { p.cancel(); process.exit(0); }
      }
    }
  }

  // Ensure alt column exists
  if (doAlt && !hasAlt) {
    ensureColumn(rows, 'alt');
  }

  const typeResults = { chart: 0, map: 0, photo: 0, illustration: 0, other: 0, failed: 0 };
  const catResults = {};
  let altCount = 0;
  const prog = p.progress();
  prog.start(toClassify.length, toClassify.length);

  for (let i = 0; i < toClassify.length; i++) {
    const entry = toClassify[i];
    const imgPath = resolveImagePath(entry.url);
    prog.message(`[${i + 1}/${toClassify.length}] ${entry.id}`);

    const needType = hasType && (mode === 'overwrite' || needsClassify(entry, 'graphic_type'));
    const needCat = hasCat && (mode === 'overwrite' || needsClassify(entry, 'category'));
    const needAlt = doAlt && (mode === 'overwrite' || needsClassify(entry, 'alt'));

    if (useAi && ollamaOk) {
      if (!imgPath) {
        p.log.warn(`Image not found: ${entry.url}`);
        typeResults.failed++;
        prog.advance();
        continue;
      }

      const result = await analyzeOllama(imgPath);
      if (!result) {
        p.log.warn(`Ollama failed for ${entry.id}, skipping`);
        typeResults.failed++;
        prog.advance();
        continue;
      }

      if (needType) {
        entry.graphic_type = result.graphicType;
        typeResults[result.graphicType]++;
      }
      if (needCat) {
        const cat = result.category || classifyFromFilename(entry.title || entry.id);
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

  prog.stop(`Done — ${toClassify.length} processed`);

  if (hasType) {
    const s = Object.entries(typeResults).filter(([, v]) => v > 0).map(([k, v]) => `${k}: ${v}`).join(' · ');
    p.log.info(`Types: ${s}`);
  }
  if (hasCat) {
    const s = Object.entries(catResults).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · ');
    p.log.info(`Categories: ${s}`);
  }
  if (doAlt) p.log.info(`Alt text generated: ${altCount}`);

  writeFileSync(csvPath, toCsv(rows));
  p.outro(`Updated ${csvFile}`);
}

main().catch(err => {
  p.cancel('Script failed');
  console.error(err);
  process.exit(1);
});
