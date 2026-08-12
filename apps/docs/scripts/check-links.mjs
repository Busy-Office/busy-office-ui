/**
 * Verifies every internal link in the BUILT site resolves to a built file —
 * including redirect-stub destinations. Run against a DOCS_BASE build in CI:
 * both live 404s the site grill found (base-blind redirects, a generated slug
 * with no page) were link-rot in build output nothing re-read (S-1/S-2/S-7).
 */
import { readFile, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

async function exists(urlPath) {
  const clean = urlPath.replace(/[#?].*$/, '').replace(/\/$/, '');
  const rel = clean === '' ? 'index.html' : clean.replace(/^\//, '');
  for (const candidate of [rel, `${rel}/index.html`, `${rel}.html`]) {
    try {
      await access(join(dist, candidate));
      return true;
    } catch {}
  }
  return false;
}

let checked = 0;
const failures = [];
for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const targets = [
    ...[...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/content="0;url=([^"]+)"/g)].map((m) => m[1]),
  ].filter((u) => !u.startsWith('//'));
  for (const t of new Set(targets)) {
    checked++;
    if (base && !t.startsWith(base + '/') && t !== base) {
      failures.push(`${file.replace(dist, '')}: link outside base path: ${t}`);
      continue;
    }
    const pathInSite = base ? t.slice(base.length) : t;
    if (!(await exists(pathInSite))) {
      failures.push(`${file.replace(dist, '')}: broken internal link: ${t}`);
    }
  }
}

if (failures.length) {
  console.error(`link check FAILED (${failures.length}):`);
  for (const f of [...new Set(failures)]) console.error('  ' + f);
  process.exit(1);
}
console.log(`link check passed: ${checked} internal links verified against dist`);
