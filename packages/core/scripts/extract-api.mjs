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
    /* The VALUES each data-* attribute is switched on, not just its name
       (roadmap 32.1). `data-row-state` alone tells a reader nothing about
       whether "selected" is legal — it is not; the framework styles dirty,
       error and warning — and that gap is exactly how an invented value gets
       written and silently does nothing. */
    dataAttrValues: new Map(),
    ariaAttrs: new Set(),
    tokensConsumed: new Set(),
    tokensDefined: new Set(),
    containers: new Set(),
    // Which components ship an explicit forced-colors (Windows High
    // Contrast) rule. The accessibility page used to hand-list these and
    // had drifted to 10 of 15 while claiming the list was exhaustive
    // (2026-08-17) — generated now, like every other documented surface.
    forcedColors: false,
  };
  for (const file of files) {
    const css = await readFile(file, 'utf8');
    const root = postcss.parse(css);
    // A data attribute the CSS READS is as much a documented contract as one
    // it selects on: `content: attr(data-placeholder)` is the entire public
    // surface of the richtext placeholder, and it appears in no selector, so
    // walkRules alone reported it as undocumented (137.3).
    root.walkDecls((decl) => {
      for (const m of decl.value.matchAll(/\battr\(\s*(data-[\w-]+)/g)) out.dataAttrs.add(m[1]);
    });
    root.walkRules((rule) => {
      for (const m of rule.selector.matchAll(CLASS_RE)) out.classes.add(m[1]);
      for (const m of rule.selector.matchAll(DATA_RE)) {
        out.dataAttrs.add(m[1]);
        if (!m[2]) continue;                       // bare [data-foo], no value to record
        const raw = m[2].replace(/^["']|["']$/g, '').trim();
        if (!raw) continue;
        if (!out.dataAttrValues.has(m[1])) out.dataAttrValues.set(m[1], new Set());
        out.dataAttrValues.get(m[1]).add(raw);
      }
      for (const m of rule.selector.matchAll(ARIA_RE)) out.ariaAttrs.add(m[1]);
    });
    root.walkAtRules('media', (at) => {
      if (/forced-colors\s*:\s*active/.test(at.params)) out.forcedColors = true;
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
    dataAttrValues: Object.fromEntries(
      [...sets.dataAttrValues].sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, [...v].sort()]),
    ),
    ariaAttrs: [...sets.ariaAttrs].sort(),
    tokensConsumed: [...sets.tokensConsumed].sort(),
    tokensDefined: [...sets.tokensDefined].sort(),
    containers: [...sets.containers].sort(),
    forcedColors: sets.forcedColors,
  };
}

const api = { generated: 'by scripts/extract-api.mjs — do not edit', components: {}, primitives: {}, utilities: {} };

// JS-only hook classes: consumed by the behaviors, never styled, so the CSS
// walk cannot see them (site-grill A-4/S-3 — the CSS-true API wasn't JS-true).
// Kept here until the behaviors manifest generates them.
const JS_HOOKS = {
  dashboard: { classes: [], dataAttrs: ['data-collapse-trigger'] },
  'data-table': { classes: ['bo-data-table__select-all'], dataAttrs: ['data-grid-nav'] },
  dialog: { classes: [], dataAttrs: ['data-dialog-trigger', 'data-dismissible'] },
  filters: { classes: [], dataAttrs: ['data-saved-views'] },
  /* Read by initDropdowns() to flip the menu's alignment; it has no CSS of its
     own, so the walk cannot see it and a markup validator would call it
     invented (roadmap 32.2). */
  dropdown: { classes: ['bo-dropdown__menu--end'], dataAttrs: [] },
  /* initScanInput()'s hooks live on the input, not in scan.css — without
     this the attr-only scan component's API would show its CSS attr
     (data-scan-result) but not the hooks a consumer actually writes. */
  scan: { classes: [], dataAttrs: ['data-scan-input', 'data-scan-flash', 'data-scan-status', 'data-scan-terminator'] },
};

/* Values that are LEGAL but that the CSS never needs a rule for. Level 1 of a
   tree is the un-indented default, so `[data-tree-level="1"]` styles nothing —
   which made a validator built on the CSS call a correct document wrong. */
const EXTRA_VALUES = { 'data-tree-level': ['1'] };

const componentsDir = join(srcCss, 'components');
for (const dir of (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const files = (await readdir(join(componentsDir, dir.name)))
    .filter((f) => f.endsWith('.css'))
    .map((f) => join(componentsDir, dir.name, f));
  const sets = await analyze(files);
  /* A component whose whole surface is a data-* contract (scan's
     body[data-scan-result] flash, 126.2) has zero bo-* classes and is
     still API — the attribute idiom IS this framework's state channel.
     Skip only true stubs: no classes AND no data attrs. */
  if (!sets.classes.size && !sets.dataAttrs.size) continue; // slice stubs
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

// Motion module: opt-in, never in index.css, so it gets its own section
// rather than folding into api.utilities (which the class index attributes
// to base/utilities).
const motionSets = await analyze([join(srcCss, 'motion/motion.css')]);
api.motion = shape(motionSets);

// Global class index: class -> owning page slug. Docs page slugs differ from
// CSS dir names when a component shares a page (site-grill S-2; skeleton +
// state share one page). Published on api.pageSlug — the SINGLE source of
// this alias; gen-llms.mjs and check-page-shape.mjs both read it from
// dist/api.json rather than keeping their own copies (that drifted once
// already — Slice 6 item 1 added an alias here and missed gen-llms.mjs's
// copy until its build broke).
const PAGE_SLUG = { alert: 'alerts', skeleton: 'state-patterns', state: 'state-patterns' };
/* GLOBAL legal values for every data-* attribute, unioned across all shipped
   CSS including tokens/ (roadmap 32.1). The per-component maps answer "what
   does THIS component switch on"; a validator needs "what is legal anywhere",
   and the two genuinely differ: `data-density` is switched in
   tokens/density.css, so the data-table entry correctly shows it bare while the
   real answer is compact|comfortable|spacious. Without this union a checker
   would reject the framework's single most-used attribute. */
{
  const all = [];
  for (const dir of (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory())) {
    for (const f of (await readdir(join(componentsDir, dir.name))).filter((f) => f.endsWith('.css'))) {
      all.push(join(componentsDir, dir.name, f));
    }
  }
  for (const sub of ['tokens', 'primitives', 'utilities', 'motion', 'base', 'print']) {
    try {
      for (const f of (await readdir(join(srcCss, sub))).filter((f) => f.endsWith('.css'))) {
        all.push(join(srcCss, sub, f));
      }
    } catch { /* not every dir exists */ }
  }
  const globalSets = await analyze(all);
  api.dataAttrValues = shape(globalSets).dataAttrValues;
  for (const [attr, extra] of Object.entries(EXTRA_VALUES)) {
    api.dataAttrValues[attr] = [...new Set([...(api.dataAttrValues[attr] ?? []), ...extra])].sort();
  }
}

api.pageSlug = PAGE_SLUG;
const index = {};
// Primitives claim first: components REFERENCE primitive classes (e.g. a
// form-section rule mentioning the app shell) but primitives define them —
// attribution follows definition (site-grill A-3 mis-attribution).
for (const [, p] of Object.entries(api.primitives)) for (const cls of p.classes) index[cls] = 'base/primitives';
for (const [name, c] of Object.entries(api.components))
  for (const cls of c.classes) index[cls] ??= `components/${PAGE_SLUG[name] ?? name}`;
for (const cls of api.utilities.classes) index[cls] ??= 'base/utilities';
for (const cls of api.motion.classes) index[cls] ??= 'base/motion';
api.index = index;

await mkdir(join(pkgRoot, 'dist'), { recursive: true });
await writeFile(join(pkgRoot, 'dist/api.json'), JSON.stringify(api, null, 2));
console.log(
  `API extracted: ${Object.keys(api.components).length} components, ${Object.keys(api.index).length} classes indexed`,
);
