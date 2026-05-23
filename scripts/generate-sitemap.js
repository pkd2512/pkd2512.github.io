import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const CONTENTS = join(ROOT, 'src', 'contents');
const SITEMAP_PATH = join(DOCS, 'sitemap.xml');
const DOMAIN = 'https://prasantakrdutta.com';

const EXCLUDE = [
  /\/blog\//,
  /\/pinterest-/,
  /\/resources\/mapping-in-datawrapper\//,
];

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDir(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function parseFrontmatter(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) return {};
    const fm = {};
    let key = null, arr = null;
    for (const line of m[1].split('\n')) {
      const am = line.match(/^\s*-\s+(.+)/);
      const km = line.match(/^(\w+):\s*(.*)/);
      if (am && key && arr !== null) { arr.push(am[1].replace(/['"]/g, '')); continue; }
      if (km) {
        key = km[1]; arr = null;
        let v = km[2].trim();
        if (v === 'true') v = true; else if (v === 'false') v = false;
        else if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
        if (key === 'categories') { fm[key] = []; arr = fm[key]; }
        else fm[key] = v;
      }
    }
    return fm;
  } catch { return {}; }
}

function getDateFor(urlPath) {
  const slug = urlPath.replace('/projects/', '').replace(/\/$/, '');
  const md = join(CONTENTS, 'projects', slug + '.md');
  if (existsSync(md)) {
    const fm = parseFrontmatter(md);
    if (fm.date) {
      const parts = String(fm.date).split(/[-\/]/).map(Number);
      if (parts.length === 3) {
        return `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
      }
    }
  }
  return null;
}

function priorityFor(url) {
  if (url === '/') return 1.0;
  if (url === '/projects/') return 0.9;
  if (url.startsWith('/projects/')) return 0.8;
  if (url === '/about/') return 0.8;
  if (url === '/community/') return 0.7;
  if (url === '/colophone/') return 0.5;
  return 0.5;
}

function changefreqFor(url) {
  if (url === '/') return 'weekly';
  if (url === '/community/') return 'weekly';
  if (url === '/projects/') return 'weekly';
  if (url.startsWith('/projects/')) return 'monthly';
  return 'monthly';
}

async function main() {
  const files = walkDir(DOCS).filter(f => f.endsWith('.html'));

  const stream = new SitemapStream({ hostname: DOMAIN });

  for (const file of files) {
    const relPath = relative(DOCS, file).replace(/\\/g, '/');

    let url;
    if (relPath === 'index.html') {
      url = '/';
    } else if (relPath.endsWith('/index.html')) {
      url = '/' + relPath.slice(0, -10);
    } else if (relPath.endsWith('.html')) {
      url = '/' + relPath;
    } else {
      continue;
    }

    if (EXCLUDE.some(r => r.test(url))) continue;

    const lastmod = getDateFor(url) || statSync(file).mtime.toISOString().split('T')[0];

    stream.write({
      url,
      lastmod,
      changefreq: changefreqFor(url),
      priority: priorityFor(url),
    });
  }

  stream.end();
  const sitemap = await streamToPromise(stream);
  writeFileSync(SITEMAP_PATH, sitemap.toString());
  console.log(`Sitemap generated: ${SITEMAP_PATH}`);
}

main().catch(console.error);
