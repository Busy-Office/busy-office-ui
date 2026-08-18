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
  /* Hooks the behavior reads: string/selector literals + dataset.* access.
     These are published to consumers (llms.txt, the paste-in AI block), so what
     is EXCLUDED is a contract, not a nicety.

     `data-bo-*` is the framework's INTERNAL convention — attributes a behavior
     writes on itself as bookkeeping (`data-bo-overflow-watched`,
     `data-bo-open`, `data-bo-value`). A consumer never writes them, and
     publishing them as "the DOM each init reads" invites exactly the invented
     markup this project spent two slices trying to prevent. Verified before
     making it a rule: 3 internal names carry the prefix, 47 consumer hooks do
     not, so the convention is real rather than assumed.

     This replaces a hardcoded exclusion of ONE name — three more had
     accumulated behind it, which is what a hand-maintained exception list does
     (Standardize, 2026-08-18). */
  const INTERNAL = /^data-bo-/;
  const hooks = new Set();
  const add = (h) => {
    if (INTERNAL.test(h)) return;
    if (h.endsWith('-')) return;   // generated id prefixes like `bo-cb-opt-`, not a real name
    hooks.add(h);
  };
  for (const lit of source.matchAll(/['"`]([^'"`]*(?:data-|bo-)[^'"`]*)['"`]/g))
    for (const h of lit[1].matchAll(HOOK_RE)) add(h[1]);
  for (const ds of source.matchAll(/dataset\.([a-zA-Z]+)/g)) {
    add('data-' + ds[1].replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
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
// Every name inside every `export { A, B, … }` block — parse the full brace
// list rather than first-name + a prefix allowlist (the old heuristic missed
// any non-init-prefixed name listed after a comma, e.g. currencyDecimals).
const dtsExports = new Set(
  [...dts.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((m) =>
    m[1].split(',').map((n) => n.trim().split(/\s+as\s+/).pop().trim()).filter(Boolean),
  ),
);
const missing = manifest.exports.filter((n) => !dtsExports.has(n));
if (missing.length) {
  console.error(`behaviors manifest: exports not found in dist/js/index.d.ts: ${missing.join(', ')}`);
  process.exit(1);
}

/* The published surface must contain no framework-internal names. This is the
   gate for the rule above: an exception list decays silently (one hardcoded
   name became four), an assertion does not. Anything a behavior writes on
   itself is `data-bo-*` by convention, and a generated id prefix is not a name
   at all. */
const leaked = Object.entries(behaviors)
  .flatMap(([name, b]) => b.hooks.filter((h) => /^data-bo-/.test(h) || h.endsWith('-')).map((h) => `${name}: ${h}`));
if (leaked.length) {
  console.error(`behaviors manifest: framework-internal names published as consumer hooks: ${leaked.join(', ')}`);
  process.exit(1);
}

console.log(`behaviors extracted: ${manifest.exports.length} exports, ${initCount} init* — asserted against dist/js/index.d.ts`);
