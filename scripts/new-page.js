import * as p from '@clack/prompts';

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEMPLATE = resolve(ROOT, 'src/contents/template.md');
const CONTENTS = resolve(ROOT, 'src/contents');

async function main() {
  p.intro('New content');

  const name = await p.text({
    message: 'Filename (without .md)',
    placeholder: 'e.g., my-new-project',
    validate: (v) => {
      if (!v) return 'Required';
      if (!/^[a-z0-9][a-z0-9-]*$/.test(v))
        return 'Use lowercase kebab-case (a-z, 0-9, hyphens)';
      return undefined;
    },
  });
  if (p.isCancel(name)) {
    p.cancel();
    process.exit(0);
  }

  const subdirs = [];
  for (const entry of await import('fs').then((m) =>
    m.readdirSync(CONTENTS, { withFileTypes: true })
  )) {
    if (entry.isDirectory()) subdirs.push(entry.name);
  }

  const location = await p.select({
    message: 'Location',
    options: [
      { value: '', label: '(root) — src/contents/' },
      ...subdirs.map((d) => ({
        value: d,
        label: `${d}/ — src/contents/${d}/`,
      })),
    ],
  });
  if (p.isCancel(location)) {
    p.cancel();
    process.exit(0);
  }

  const outDir = join(CONTENTS, location);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const outFile = join(outDir, `${name}.md`);
  if (existsSync(outFile)) {
    const overwrite = await p.confirm({
      message: `${outFile.replace(ROOT + '/', '')} already exists. Overwrite?`,
      activeLabel: 'Overwrite',
      inactiveLabel: 'Cancel',
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel();
      process.exit(0);
    }
  }

  const template = readFileSync(TEMPLATE, 'utf-8');
  writeFileSync(outFile, template);

  p.outro(`Created ${outFile.replace(ROOT + '/', '')}`);
}

main().catch((err) => {
  p.cancel('Script failed');
  console.error(err);
  process.exit(1);
});
