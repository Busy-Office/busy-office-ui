#!/usr/bin/env node
/**
 * Scaffolds a new component: the CSS file + its @import, the docs page
 * skeleton + sidebar entry, and (with --behavior) a stub behavior test.
 * Stamps the CLAUDE.md "how to document a component" recipe so a new page
 * starts in the shape check-page-shape.mjs checks for — turning the
 * documented convention into something that can't be gotten wrong.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultLabel } from './component-label.mjs';

const coreRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(coreRoot, '..', '..');
const docsRoot = join(repoRoot, 'apps/docs');

const [, , rawName, ...flags] = process.argv;
const behavior = flags.includes('--behavior');
const labelFlag = flags.find((f) => f.startsWith('--label='));
const groupFlag = flags.find((f) => f.startsWith('--group='));
const taglineFlag = flags.find((f) => f.startsWith('--tagline='));
// Sidebar is grouped by task (2026-08-16, docs-IA pass) — a new component
// must be placed deliberately, not silently defaulted into the wrong group.
/* Derived from the shipped taxonomy, never hardcoded.
 *
 * This list said 'Data display' — a group that does not exist — and omitted
 * 'Tables & lists', 'Values' and 'Display', which do. The sidebar was
 * reorganised by the 2026-08-16 docs-IA pass and this copy was not, so the
 * documented way to add a component rejected every valid answer and accepted
 * one that then failed deeper in the script (roadmap 40.3, found by using it).
 * A hand-maintained mirror of another file's contents is a stale list waiting
 * to happen.
 *
 * It read Gallery.astro's array until 2026-09-03 (roadmap 249.8); that array
 * is now generated FROM the CSS headers this script writes, so scraping it
 * would be reading this script's own output. `api.categories` is where the
 * taxonomy actually lives — `extract-api.mjs` validates every @category
 * against it and fails the build on a typo.
 *
 * 'Reference' is excluded: it is where a DEPRECATED component is parked
 * (roadmap 135/132.1), not a group a new component belongs in. */
const GROUPS = (() => {
  const apiPath = join(coreRoot, 'dist/api.json');
  let categories;
  try {
    categories = JSON.parse(readFileSync(apiPath, 'utf8')).categories;
  } catch {
    console.error(`new:component: ${apiPath} is missing — run \`npm run build -w @busy-office/ui\` first.`);
    process.exit(1);
  }
  const groups = (categories ?? []).filter((c) => c !== 'Reference');
  if (!groups.length) {
    console.error('new:component: dist/api.json carries no categories — has extract-api.mjs changed shape?');
    process.exit(1);
  }
  return groups;
})();

if (!rawName || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(rawName)) {
  console.error(
    'Usage: npm run new:component -w @busy-office/ui -- <kebab-case-name> --group="<one of: '
      + GROUPS.join(', ') + '>" --tagline="One plain sentence." [--behavior] [--label="Human Label"]',
  );
  process.exit(1);
}
if (!groupFlag || !GROUPS.includes(groupFlag.slice('--group='.length))) {
  console.error(`--group is required, one of: ${GROUPS.join(', ')}`);
  process.exit(1);
}
const group = groupFlag.slice('--group='.length);
/* The tagline is a REQUIRED CSS-header directive (roadmap 249.8) — the build
   refuses a component without one — so the scaffolder asks for it here rather
   than stamping a TODO that would fail the very next build. Bounds match
   extract-api.mjs's TAGLINE_MIN/TAGLINE_MAX; a comment-closing delimiter is
   refused because the tagline is written into a CSS comment. */
const tagline = taglineFlag ? taglineFlag.slice('--tagline='.length).trim() : '';
if (tagline.length < 30 || tagline.length > 120) {
  console.error(
    `--tagline is required: one plain sentence of 30-120 characters saying what the component is ` +
      `and what decides its use (got ${tagline.length}).`,
  );
  process.exit(1);
}
if (tagline.includes('*/') || tagline.includes('\n')) {
  console.error('--tagline must be a single line and must not contain "*/" — it is written into a CSS comment.');
  process.exit(1);
}
const name = rawName;
const pascal = name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
/* The default label must be the SAME value extract-api.mjs derives, or the
   scaffolder stamps an @label that says exactly what the derived default
   already says. It did: the old default was `pascal.replace(/([a-z])([A-Z])/g,
   '$1 $2')`, which gave "Probe Widget" where the extractor derives
   "Probe widget", so a probe run on 2026-09-03 wrote a redundant @label into a
   brand-new component. 249.8 fixed that by hand-copying the extractor's
   derivation here; the copy is now gone and both call one function
   (component-label.mjs, Standardize sweep 2026-09-04) — so the equality test
   below compares one rule against itself rather than two spellings of it.
   NOTE the full expression, not `pascal` alone: `pascal` gives "ProbeWidget"
   and is still live below for `init${pascal}`, so blaming it for the spaced
   value names an identifier that does not produce it (roadmap 258.1). */
const derivedLabel = defaultLabel(rawName);
const label = labelFlag ? labelFlag.slice('--label='.length) : derivedLabel;
// The label is interpolated into an Astro attribute and a JS string literal
// in Gallery.astro — a quote would emit invalid output into a SHARED file
// (breaking every docs build until hand-fixed), so refuse rather than escape.
if (/["'`\\]/.test(label)) {
  console.error(`--label must not contain quotes or backslashes (got: ${label})`);
  process.exit(1);
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const cssDir = join(coreRoot, 'src/css/components', name);
const cssFile = join(cssDir, `${name}.css`);
const pagePath = join(docsRoot, 'src/pages/components', `${name}.astro`);

if ((await exists(cssDir)) || (await exists(pagePath))) {
  console.error(`"${name}" already exists (${(await exists(cssDir)) ? cssFile : pagePath}).`);
  process.exit(1);
}

// 1. CSS file — its header IS the component's registration (roadmap 249.8):
// @tagline/@category/@label/@order are lifted into api.json by extract-api.mjs
// and drive the docs sidebar, the homepage task tiles and llms.txt. @label is
// stamped only when the derived default (the directory name, title-cased) is
// wrong, and @order is left off so the component appends to the end of its
// group — move it by adding one.
await mkdir(cssDir, { recursive: true });
await writeFile(
  cssFile,
  `/* @tagline ${tagline}
   @category ${group}${label === derivedLabel ? '' : `\n   @label ${label}`} */
@layer bo-components {
  /* Block */
  .bo-${name} {
    /* TODO: base styles */
  }

  /* Parts */
  /* .bo-${name}__part { } */

  /* Variants */
  /* .bo-${name}--variant { } */
}
`,
);

// 2. @import in index.css, appended after the last component import (matches
// the existing add-at-the-bottom convention — imports aren't alphabetical).
const indexPath = join(coreRoot, 'src/css/index.css');
const indexCss = await readFile(indexPath, 'utf8');
const importLine = `@import "./components/${name}/${name}.css";`;
const lines = indexCss.split('\n');
const lastComponentImportLine = lines
  .map((l, i) => [l, i])
  .filter(([l]) => l.startsWith('@import "./components/'))
  .pop();
if (!lastComponentImportLine) throw new Error('No existing component imports found in index.css');
lines.splice(lastComponentImportLine[1] + 1, 0, importLine);
await writeFile(indexPath, lines.join('\n'));

// 3. Docs page skeleton — the fixed shape from CLAUDE.md's "how to document a
// component" recipe: opener, >=1 demo section, Markup, ClassRef, ApiTable,
// Related. Demo-first, spec-last (2026-08-16) — the gate checks for exactly
// these pieces, not their order, but ClassRef/ApiTable stay together at the
// end so a first-time visitor sees the thing before the full API surface.
await mkdir(dirname(pagePath), { recursive: true });
await writeFile(
  pagePath,
  `---
import Gallery from '../../layouts/Gallery.astro';
import ClassRef from '../../components/ClassRef.astro';
import Related from '../../components/Related.astro';
import ApiTable from '../../components/ApiTable.astro';
import DsaScore from '../../components/DsaScore.astro';
import Demo from '../../components/Demo.astro';
const example = \`<div class="bo-${name}">TODO</div>\`;
const canonical = \`<div class="bo-${name}">
  <!-- TODO -->
</div>\`;
---
<Gallery title="${label}" description="TODO: one sentence describing ${label} — this becomes the page's meta description, the text a search result and a shared link show.">
  <p class="demo-note">
    TODO: one line — what it is + when to use.
  </p>
  <section class="demo">
    <h2>TODO</h2>
    <Demo code={example} />
  </section>
  <section class="demo">
    <h2>Markup</h2>
    <pre><code>{canonical}</code></pre>
  </section>
  <ClassRef component="${name}" />
  <ApiTable component="${name}" notes={[]} />
  <DsaScore component="${name}" />
  <Related links={[["/reference/classes", "Class index"]]} />
</Gallery>
`,
);

// 4. Sidebar entry — nothing to do. Until 2026-09-03 this step spliced an
// entry into Gallery.astro's hand-written array, at the END of the group so
// that scaffolding could not displace the established component from pole
// position (drift found + fixed 2026-08-16 Standardize sweep: Segmented
// control had displaced Button in "Actions"). Both concerns now live in the
// CSS header stamped in step 1: @category picks the group, and omitting
// @order appends, which is the same rule that comment describes.

// 5. Stub behavior test — only interactive components get one; there's no
// per-component test file, all behaviors live in one describe-block file.
if (behavior) {
  const testPath = join(coreRoot, 'tests/behaviors.test.ts');
  const test = await readFile(testPath, 'utf8');
  await writeFile(
    testPath,
    test.trimEnd() +
      `

describe('init${pascal}', () => {
  it.todo('TODO: behavior contract for ${name}');
});
`,
  );
}

console.log(`Scaffolded "${name}":
  ${cssFile.replace(repoRoot + '/', '')}
  ${pagePath.replace(repoRoot + '/', '')}
  sidebar entry + homepage tile + llms.txt entry — generated from the CSS
  header's @tagline/@category, so no shared file was edited${
    behavior ? '\n  stub test in packages/core/tests/behaviors.test.ts' : ''
  }

Next: fill in the CSS, write real demo markup, replace the placeholder
Related link with real cross-references, then run \`npm run build\` (core) and
\`npm run docs:build\` — that regenerates api.json/contrast.json and runs the
page-shape gate against what you wrote. New colour pairing? add it to PAIRS
in check-contrast.mjs.`);
