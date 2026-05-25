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

// ── CSV helpers ──────────────────────────────────────────────────

function csvParse(text) {
  const rows = [];
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return rows;
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

// ── Image resolution ─────────────────────────────────────────────

function resolveImagePath(url) {
  // Supports: $media/…, /media/…, or bare relative (e.g. projects/…)
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

// ── Sharp heuristic classifier ───────────────────────────────────

async function classifySharp(imagePath) {
  try {
    const img = sharp(imagePath);
    const meta = await img.metadata();
    const { width, height } = meta;
    if (!width || !height) return 'other';

    const aspect = width / height;
    const totalPixels = width * height;

    // Resize to a small sample for analysis
    const sample = await img
      .resize(64, 64, { fit: 'fill' })
      .raw()
      .toBuffer();

    // Analyze pixel data
    const pixels = [];
    for (let i = 0; i < sample.length; i += 3) {
      pixels.push({ r: sample[i], g: sample[i + 1], b: sample[i + 2] });
    }

    // Count unique colors (quantized)
    const colorSet = new Set();
    for (const p of pixels) {
      const qr = Math.round(p.r / 32) * 32;
      const qg = Math.round(p.g / 32) * 32;
      const qb = Math.round(p.b / 32) * 32;
      colorSet.add(`${qr},${qg},${qb}`);
    }
    const uniqueColors = colorSet.size;

    // Calculate saturation statistics
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
    const meanSat = satSum / n;
    const satVariance = satSumSq / n - meanSat * meanSat;

    // White/light background detection
    const lightThreshold = 220;
    const lightPixels = pixels.filter(p => p.r > lightThreshold && p.g > lightThreshold && p.b > lightThreshold);
    const lightRatio = lightPixels.length / n;

    // Green and blue dominance (for maps)
    const greenBlue = pixels.filter(p => p.g > 100 && p.b > 100 && p.r < p.g && p.r < p.b);
    const gbRatio = greenBlue.length / n;

    // Edge density via convolution
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
    for (let i = 0; i < edgeBuffer.length; i++) {
      if (edgeBuffer[i] > 80) edgePixels++;
    }
    const edgeRatio = edgePixels / edgeBuffer.length;

    // ── Classification logic ──

    const isWide = aspect > 1.2;
    const isTall = aspect < 0.8;

    // Chart: white/light bg, many edges (text/lines), moderate unique colors
    if (lightRatio > 0.3 && edgeRatio > 0.08 && uniqueColors > 30) {
      return 'chart';
    }

    // Map: green-blue dominant, wide, moderate edges
    if (gbRatio > 0.15 && isWide && edgeRatio > 0.05) {
      return 'map';
    }

    // Map: also if very wide with moderate edges and not too many unique colors
    if (aspect > 1.5 && edgeRatio > 0.04 && uniqueColors > 20 && uniqueColors < 120) {
      return 'map';
    }

    // Illustration: very few unique colors, flat saturation
    if (uniqueColors < 30 && satVariance < 0.02) {
      return 'illustration';
    }

    // Photo: high saturation variance, low light ratio, high unique colors
    if (satVariance > 0.08 && uniqueColors > 80 && lightRatio < 0.3) {
      return 'photo';
    }

    // Photo: also high color diversity with natural gradients
    if (uniqueColors > 100 && satVariance > 0.05) {
      return 'photo';
    }

    // Chart fallback: lots of edges (text-heavy)
    if (edgeRatio > 0.12) {
      return 'chart';
    }

    // Map fallback: very wide
    if (aspect > 1.8) {
      return 'map';
    }

    return 'other';
  } catch {
    return 'other';
  }
}

// ── Ollama AI classifier ─────────────────────────────────────────

const OLLAMA_URL = 'http://localhost:11434/api/generate';

async function classifyOllama(imagePath) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava',
        prompt: 'Is this image a chart, map, photo, illustration, or other? Reply with one word only.',
        images: [base64],
        stream: false,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.response?.trim().toLowerCase() || '';
    const matched = GRAPHIC_TYPES.find(t => text.includes(t));
    return matched || 'other';
  } catch {
    return null;
  }
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
    // Check if llava or similar vision model exists
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

async function selectBackend() {
  const useAi = await p.confirm({
    message: 'Use Ollama AI for classification? (more accurate, requires ollama running)',
    activeLabel: 'Yes (Ollama)',
    inactiveLabel: 'No (sharp heuristic)',
  });
  if (p.isCancel(useAi)) return null;
  return useAi;
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

  if (!header.includes('graphic_type')) {
    p.log.error("CSV missing 'graphic_type' column");
    process.exit(1);
  }

  const mode = await p.select({
    message: 'How to handle existing values?',
    options: [
      { value: 'fill', label: 'Fill missing only', hint: 'leave existing graphic_type and category as-is' },
      { value: 'overwrite', label: 'Overwrite all', hint: 're-classify every entry' },
    ],
  });
  if (p.isCancel(mode)) { p.cancel(); process.exit(0); }

  const toClassify = mode === 'overwrite'
    ? rows
    : rows.filter(r => !r.graphic_type || r.graphic_type === 'dataviz');

  if (toClassify.length === 0) {
    p.log.info('All entries already have a specific graphic_type');
    process.exit(0);
  }

  p.log.info(`${toClassify.length} / ${rows.length} entries to classify`);

  const useAi = await selectBackend();
  if (useAi === null) process.exit(0);

  let ollamaOk = false;
  if (useAi) {
    const s = p.spinner();
    s.start('Checking Ollama...');
    ollamaOk = await checkOllama();
    s.stop(ollamaOk ? 'Ollama ready' : 'Ollama not available');

    if (!ollamaOk) {
      const proceed = await p.confirm({
        message: 'Ollama not available. Fall back to sharp heuristic?',
        activeLabel: 'Yes',
        inactiveLabel: 'No, cancel',
      });
      if (p.isCancel(proceed) || !proceed) { p.cancel(); process.exit(0); }
    }
  }

  const results = { chart: 0, map: 0, photo: 0, illustration: 0, other: 0, failed: 0 };
  const prog = p.progress();
  prog.start(toClassify.length, toClassify.length);

  for (let i = 0; i < toClassify.length; i++) {
    const entry = toClassify[i];
    const imgPath = resolveImagePath(entry.url);
    prog.message(`[${i + 1}/${toClassify.length}] ${entry.id}`);

    if (!imgPath) {
      results.failed++;
      p.log.warn(`Image not found: ${entry.url}`);
      prog.advance();
      continue;
    }

    let type;
    if (useAi && ollamaOk) {
      type = await classifyOllama(imgPath);
      if (!type) {
        p.log.warn(`Ollama failed for ${entry.id}, skipping`);
        results.failed++;
        prog.advance();
        continue;
      }
    } else {
      type = await classifySharp(imgPath);
    }

    entry.graphic_type = type;
    results[type]++;
    prog.advance();
  }

  prog.stop(`Done — ${toClassify.length} processed`);

  // Summary
  const summary = Object.entries(results)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ');
  p.log.info(summary);

  // Save
  writeFileSync(csvPath, toCsv(rows));
  p.outro(`Updated ${csvFile}`);
}

main().catch(err => {
  p.cancel('Script failed');
  console.error(err);
  process.exit(1);
});
