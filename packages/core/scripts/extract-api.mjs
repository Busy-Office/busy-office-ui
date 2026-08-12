/**
 * Extracts the public API surface from the source CSS into dist/api.json.
 * The docs render API tables and the class index FROM this file, so the
 * documented API cannot drift from the shipped CSS (site-proposal grill F1:
 * the API tables are the semver contract — they must be machine-true).
 *
 * Per component: classes (block/part/variant), data-* attributes, ARIA
 * attributes styled, tokens consumed, component-local tokens defined.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcCss = join(pkgRoot, 'src/css');

const CLASS_RE = /\.(bo-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?)/g;
const DATA_RE = /\[(data-[a-z-]+)(?:[$^*~|]?=("[^"]*"|'[^']*'|[^\]]*))?\]/g;
const ARIA_RE = /\[(aria-[a-z-]+)(?:[$^*~|]?=("[^"]*"|'[^']*'|[^\]]*))?\]/g;
const VAR_USE_RE = /var\(\s*(--bo-[a-z0-9-]+)/g;

async function analyze(files) {
  const out = {
    classes: new Set(),
    dataAttrs: new Set(),
    ariaAttrs: new Set(),
    tokensConsumed: new Set(),
    tokensDefined: new Set(),
    containers: new Set(),
  };
  for (const file of files) {
    const css = await readFile(file, 'utf8');
    const root = postcss.parse(css);
    root.walkRules((rule) => {
      for (const m of rule.selector.matchAll(CLASS_RE)) out.classes.add(m[1]);
      for (const m of rule.selector.matchAll(DATA_RE)) out.dataAttrs.add(m[1]);
      for (const m of rule.selector.matchAll(ARIA_RE)) out.ariaAttrs.add(m[1]);
    });
    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--bo-')) out.tokensDefined.add(decl.prop);
      for (const m of decl.value.matchAll(VAR_USE_RE)) out.tokensConsumed.add(m[1]);
      if (decl.prop === 'container-name') out.containers.add(decl.value.trim());
    });
  }
  return out;
}

function shape(sets) {
  const classes = [...sets.classes].sort();
  const blocks = [...new Set(classes.map((c) => c.split('__')[0].split('--')[0]))];
  return {
    blocks,
    classes,
    parts: classes.filter((c) => c.includes('__') && !c.includes('--')),
    variants: classes.filter((c) => c.includes('--')),
    dataAttrs: [...sets.dataAttrs].sort(),
    ariaAttrs: [...sets.ariaAttrs].sort(),
    tokensConsumed: [...sets.tokensConsumed].sort(),
    tokensDefined: [...sets.tokensDefined].sort(),
    containers: [...sets.containers].sort(),
  };
}

const api = { generated: 'by scripts/extract-api.mjs — do not edit', components: {}, primitives: {}, utilities: {} };

// JS-only hook classes: consumed by the behaviors, never styled, so the CSS
// walk cannot see them (site-grill A-4/S-3 — the CSS-true API wasn't JS-true).
// Kept here until the behaviors manifest generates them.
const JS_HOOKS = {
  'data-table': { classes: ['bo-data-table__select-all'], dataAttrs: [] },
  dialog: { classes: [], dataAttrs: ['data-dialog-trigger', 'data-dismissible'] },
};

const componentsDir = join(srcCss, 'components');
for (const dir of (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const files = (await readdir(join(componentsDir, dir.name)))
    .filter((f) => f.endsWith('.css'))
    .map((f) => join(componentsDir, dir.name, f));
  const sets = await analyze(files);
  if (!sets.classes.size) continue; // slice stubs
  for (const c of JS_HOOKS[dir.name]?.classes ?? []) sets.classes.add(c);
  for (const d of JS_HOOKS[dir.name]?.dataAttrs ?? []) sets.dataAttrs.add(d);
  api.components[dir.name] = shape(sets);
}

const primDir = join(srcCss, 'primitives');
for (const f of (await readdir(primDir)).filter((f) => f.endsWith('.css') && f !== 'index.css')) {
  const sets = await analyze([join(primDir, f)]);
  api.primitives[f.replace('.css', '')] = shape(sets);
}

// Utilities: the print layer REFERENCES component classes in its rules —
// filter to the utility namespaces so the listing isn't contaminated.
const utilSets = await analyze([join(srcCss, 'utilities/index.css'), join(srcCss, 'print/index.css')]);
utilSets.classes = new Set(
  [...utilSets.classes].filter((c) => /^bo-(u-|print|visually-hidden)/.test(c)),
);
api.utilities = shape(utilSets);

// Global class index: class -> owning page slug. Docs page slugs differ from
// CSS dir names in one case (site-grill S-2); gen-llms.mjs asserts every slug
// resolves to a built page.
const PAGE_SLUG = { alert: 'alerts' };
const index = {};
// Primitives claim first: components REFERENCE primitive classes (e.g. a
// form-section rule mentioning the app shell) but primitives define them —
// attribution follows definition (site-grill A-3 mis-attribution).
for (const [, p] of Object.entries(api.primitives)) for (const cls of p.classes) index[cls] = 'base/primitives';
for (const [name, c] of Object.entries(api.components))
  for (const cls of c.classes) index[cls] ??= `components/${PAGE_SLUG[name] ?? name}`;
for (const cls of api.utilities.classes) index[cls] ??= 'base/utilities';
api.index = index;

await mkdir(join(pkgRoot, 'dist'), { recursive: true });
await writeFile(join(pkgRoot, 'dist/api.json'), JSON.stringify(api, null, 2));
console.log(
  `API extracted: ${Object.keys(api.components).length} components, ${Object.keys(api.index).length} classes indexed`,
);
