/**
 * Extracts the JS behavior surface into dist/behaviors.json — the exported
 * init functions, their one-line contract, and the DOM hooks each one reads
 * (data-* attributes and hook classes). The CSS walk (extract-api.mjs) is
 * blind to this surface (site-grill S-3: the API was CSS-true, not JS-true),
 * and the JS surface is semver too. Generated so it cannot drift; a test
 * asserts it against the compiled dist/js/index.d.ts.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsSrc = join(pkgRoot, 'src/js');

// Public exports (the semver surface) come from the barrel.
const barrel = await readFile(join(jsSrc, 'index.ts'), 'utf8');
const exported = [...barrel.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)]
  .flatMap(([, names, from]) =>
    names.split(',').map((n) => ({ name: n.trim(), from: from.replace(/^\.\//, '').replace(/\.js$/, '') })),
  )
  .filter((e) => e.name);

const HOOK_RE = /(data-[a-z-]+|bo-[a-z0-9-]+(?:__[a-z0-9-]+)?)/g;

const behaviors = {};
for (const e of exported) {
  const file = join(jsSrc, `${e.from}.ts`);
  let source;
  try {
    source = await readFile(file, 'utf8');
  } catch {
    behaviors[e.name] = { module: e.from };
    continue;
  }
  // Leading block comment = the contract; first sentence is the summary.
  const doc = source.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
  const firstSentence = doc
    .replace(/\n\s*\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\.\s/)[0];
  // Cut on a word boundary (never mid-word) and mark truncation explicitly.
  const summary =
    firstSentence.length <= 200
      ? firstSentence
      : firstSentence.slice(0, firstSentence.lastIndexOf(' ', 200)) + '…';
  // Hooks the behavior reads: string/selector literals + dataset.* access.
  const hooks = new Set();
  for (const lit of source.matchAll(/['"`]([^'"`]*(?:data-|bo-)[^'"`]*)['"`]/g))
    for (const h of lit[1].matchAll(HOOK_RE)) hooks.add(h[1]);
  for (const ds of source.matchAll(/dataset\.([a-zA-Z]+)/g)) {
    const kebab = 'data-' + ds[1].replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    if (kebab !== 'data-eof-dialog-bound') hooks.add(kebab);
  }
  behaviors[e.name] = {
    module: e.from,
    summary: summary || null,
    hooks: [...hooks].sort(),
  };
}

const initCount = Object.keys(behaviors).filter((n) => n.startsWith('init')).length;
const manifest = {
  generated: 'by scripts/extract-behaviors.mjs — do not edit',
  initCount,
  exports: Object.keys(behaviors).sort(),
  behaviors,
};

await writeFile(join(pkgRoot, 'dist/behaviors.json'), JSON.stringify(manifest, null, 2));

// Assert the manifest matches the compiled type surface (nothing shipped that
// the manifest missed, nothing manifested that isn't exported).
const dts = await readFile(join(pkgRoot, 'dist/js/index.d.ts'), 'utf8');
const dtsExports = new Set([...dts.matchAll(/export\s*\{\s*([A-Za-z]+)/g)].map((m) => m[1]));
// (index.d.ts re-exports may list one name per line; also catch `export { X }`)
for (const m of dts.matchAll(/\b([a-zA-Z]+)\s*(?:,|\})/g)) if (/^(init|refresh|trap)/.test(m[1])) dtsExports.add(m[1]);
const missing = manifest.exports.filter((n) => !dtsExports.has(n));
if (missing.length) {
  console.error(`behaviors manifest: exports not found in dist/js/index.d.ts: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`behaviors extracted: ${manifest.exports.length} exports, ${initCount} init* — asserted against dist/js/index.d.ts`);
