/**
 * Extracts the JS behavior surface into dist/behaviors.json — the exported
 * init functions, their one-line contract, and the DOM hooks each one reads
 * (data-* attributes and hook classes). The CSS walk (extract-api.mjs) is
 * blind to this surface (site-grill S-3: the API was CSS-true, not JS-true),
 * and the JS surface is semver too. Generated so it cannot drift; a test
 * asserts it against the compiled dist/js/index.d.ts.
 *
 * WHICH COMPONENT A BEHAVIOR SERVES IS DECLARED, NEVER DERIVED (roadmap
 * 249.20). Every module under `src/js/behaviors/` carries `@serves <dir>[,
 * <dir>…]` in its header block comment, naming the component directory (or
 * directories) whose documented affordance it powers, and this script THROWS
 * naming the file when it is missing, empty, or names a component that is not
 * in api.json.
 *
 * Why a declaration rather than a computed relation — measured 2026-09-04, and
 * every figure is re-runnable against the artifacts this script reads:
 *
 *   - Intersecting each component's own classes with the hooks below reads
 *     20 of 40 components, and it is wrong in BOTH directions. `form` matches
 *     16 behaviors and `button` 5, because behaviors hook the shared
 *     primitives (`bo-input`, `bo-btn`) those components define — usage of a
 *     primitive inside another component's widget, not "this component needs
 *     JS". Widening to classes+dataAttrs reads 23 of 40 and adds
 *     `approval-workflow`, which matches on `data-state` alone: a vocabulary
 *     6 components share and 6 behaviors hook, with no approval behavior in
 *     the package at all. Narrowing back to own-classes drops `dialog` and
 *     `scan` — `scan` declares NO classes whatsoever, so no class-based rule
 *     can ever see it.
 *   - Matching the module's filename to a component directory resolves 9 of
 *     26. The other 17 are the interesting ones: file-dropzone→file-upload,
 *     money-field→money, saved-views→filters, wizard→stepper,
 *     anchor-nav→sidebar-nav, collapsible-card→dashboard, load-more→
 *     pagination, scan-input→scan, validation-summary→form, context-menu→
 *     dropdown, and the six data-table behaviors that carry none of its name.
 *
 * So one rule produces false positives and the other false negatives, which is
 * exactly what roadmap 249.9's badge audit concluded: this relation needs a
 * recorded key, not a set intersection.
 *
 * `byComponent` carries an entry for EVERY component in api.json, an empty
 * array for the ones nothing serves (249.3's "absence is rendered, never
 * blank") — a consumer that reads a missing key as "no JS" cannot tell an
 * unserved component from a typo.
 *
 * NOT RECORDED, deliberately: a required/enhanced/optional TIER. 249.9's audit
 * says nothing in the repo distinguishes "JS-required", and re-checking that
 * found only hand-written page prose — which is the surface this key exists to
 * check, so sourcing the tier from it would be circular. Refused rather than
 * invented; the tier stays 249.9's open question.
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

/* The @serves directive is METADATA and must not reach the hook scan.
   Component directories are named exactly like data-* attributes — `data-table`
   is both a component directory and a real documented hook — and the scan reads
   quoted spans anywhere in the file, comments included (deliberately: the
   markup contracts in these headers are where `bo-tree-table`,
   `bo-file-dropzone` and 20-odd other hooks are published from, so blanking
   comments wholesale would delete a semver surface — measured 2026-09-04:
   25 of 33 exports lose hooks under comment-blanking, one of them 12).
   Landing @serves without this line published a phantom `data-table` hook on
   five behaviors, and the manifest diff against the previous build is what
   caught it. */
const stripDirectives = (src) => src.replace(/^.*@serves.*$/gm, '');

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
  const scannable = stripDirectives(source);
  for (const lit of scannable.matchAll(/['"`]([^'"`]*(?:data-|bo-)[^'"`]*)['"`]/g))
    for (const h of lit[1].matchAll(HOOK_RE)) add(h[1]);
  for (const ds of scannable.matchAll(/dataset\.([a-zA-Z]+)/g)) {
    add('data-' + ds[1].replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
  }
  behaviors[e.name] = {
    module: e.from,
    summary: summary || null,
    hooks: [...hooks].sort(),
  };
}

/* ---------------------------------------------------------------------------
   The declared component relation (see this file's header).

   api.json is the authority on what a component name is, and `build:api` runs
   immediately before `build:behaviors` in the package's build chain. That
   ordering is load-bearing and this script must not assume it silently: a
   missing or empty file fails here rather than producing an empty legal set,
   which would make every @serves name "unknown" or — worse, if the check were
   written the other way round — make every name legal.
   --------------------------------------------------------------------------- */
const apiPath = join(pkgRoot, 'dist/api.json');
let componentNames;
try {
  componentNames = Object.keys(JSON.parse(await readFile(apiPath, 'utf8')).components ?? {});
} catch (err) {
  console.error(`behaviors manifest: cannot read ${apiPath} (${err.message}) — build:api must run before build:behaviors`);
  process.exit(1);
}
if (componentNames.length === 0) {
  console.error(`behaviors manifest: ${apiPath} lists no components — wrong artifact, or a stale/partial build`);
  process.exit(1);
}
const legal = new Set(componentNames);

const behaviorDir = join(jsSrc, 'behaviors');
const behaviorFiles = (await readdir(behaviorDir)).filter((f) => f.endsWith('.ts')).sort();
const servesByModule = new Map();
const declErrors = [];
for (const file of behaviorFiles) {
  const source = await readFile(join(behaviorDir, file), 'utf8');
  /* The SAME first-block-comment the summary is read from, so a directive in a
     comment further down the file is not silently accepted as the header's. */
  const doc = source.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
  const line = doc.match(/@serves([^\n]*)/)?.[1];
  if (line === undefined) {
    declErrors.push(`${file}: no @serves in its header comment — name the component directory this behavior powers`);
    continue;
  }
  /* `none` is a real answer and must stay expensive to give. One behavior in 26
     genuinely serves no component: initAnchorNav drives a plain
     [data-anchor-nav] rail of in-page links, documented only on the object-page
     PATTERN — the `.bo-sidebar-nav` in its header names what STYLES the
     aria-current it sets, not markup it requires. Found by reading the
     behavior's own selectors rather than its prose, after this file's first
     draft declared it `sidebar-nav` and was wrong. The reason is required, and
     required to be a sentence, so taking this exit is a decision visible in a
     diff rather than a shrug. */
  const excused = line.match(/^\s*\*?\s*none\b[\s—-]*(.*)$/);
  if (excused) {
    const why = excused[1].trim();
    if (why.length < 20) {
      declErrors.push(`${file}: @serves none needs a reason — say what it drives instead, in a sentence`);
      continue;
    }
    servesByModule.set(`behaviors/${file.replace(/\.ts$/, '')}`, []);
    continue;
  }
  const names = line
    .split(',')
    .map((n) => n.replace(/^[\s*]+/, '').trim())
    .filter(Boolean);
  if (names.length === 0) {
    declErrors.push(`${file}: @serves is empty`);
    continue;
  }
  const unknown = names.filter((n) => !legal.has(n));
  if (unknown.length) {
    declErrors.push(`${file}: @serves names ${unknown.join(', ')} — not a component in api.json`);
    continue;
  }
  if (new Set(names).size !== names.length) {
    declErrors.push(`${file}: @serves repeats a component`);
    continue;
  }
  servesByModule.set(`behaviors/${file.replace(/\.ts$/, '')}`, names);
}
if (declErrors.length) {
  console.error(`behaviors manifest: ${declErrors.length} module(s) with a bad @serves declaration:\n  ${declErrors.join('\n  ')}`);
  process.exit(1);
}

for (const [name, b] of Object.entries(behaviors)) {
  const serves = servesByModule.get(b.module);
  if (serves) b.serves = serves;
}

/* byComponent lists the call-once ENTRY POINTS (`init*`) for a component, not
   every export of the serving module: `refreshDataTable`, `currencyDecimals`
   and `flashScanResult` are helpers a consumer reaches for afterwards, and
   publishing them here would read as "four things to call". A module with no
   init* export would therefore vanish from this map, so that is asserted
   rather than assumed. */
const byComponent = Object.fromEntries(componentNames.sort().map((c) => [c, []]));
for (const [name, b] of Object.entries(behaviors)) {
  if (!name.startsWith('init')) continue;
  for (const c of b.serves ?? []) byComponent[c].push(name);
}
for (const c of Object.keys(byComponent)) byComponent[c].sort();
const initless = [...servesByModule.keys()].filter(
  (m) => !Object.entries(behaviors).some(([n, b]) => b.module === m && n.startsWith('init')),
);
if (initless.length) {
  console.error(`behaviors manifest: module(s) with @serves but no exported init*: ${initless.join(', ')} — they would be invisible in byComponent`);
  process.exit(1);
}

const initCount = Object.keys(behaviors).filter((n) => n.startsWith('init')).length;
const manifest = {
  generated: 'by scripts/extract-behaviors.mjs — do not edit',
  initCount,
  byComponent,
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

const served = Object.values(byComponent).filter((v) => v.length).length;
console.log(
  `behaviors extracted: ${manifest.exports.length} exports, ${initCount} init* — asserted against dist/js/index.d.ts; ` +
    `@serves declared on ${servesByModule.size} module(s), reaching ${served} of ${componentNames.length} components`,
);
