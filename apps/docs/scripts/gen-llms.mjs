/**
 * Generates dist/llms.txt — a single machine-readable reference for coding
 * agents, from the same generated data the human docs use (api.json /
 * contrast.json), so it cannot drift either.
 */
import { readFile, writeFile } from 'node:fs/promises';
import floorData from '@busy-office/ui/floor.json' with { type: 'json' };
const floorLabel = floorData.label;
import { MARKUP_RULES } from '../src/data/markup-rules.mjs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_ROOT } from './paths.mjs';

const require = createRequire(import.meta.url);
const api = JSON.parse(await readFile(require.resolve('@busy-office/ui/api'), 'utf8'));
const bh = JSON.parse(await readFile(require.resolve('@busy-office/ui/behaviors-manifest'), 'utf8'));
const pkg = JSON.parse(await readFile(require.resolve('@busy-office/ui/package.json'), 'utf8'));
const docsRoot = DOCS_ROOT;
const site = 'https://busy-office.github.io/busy-office-ui';

let out = `# busy-office-ui v${pkg.version}

> CSS-first UI framework for ERP and back-office applications. Semantic components,
> density as a dimension (data-density="compact|comfortable|spacious" on <html> or any
> wrapper), dark mode via [data-theme="dark"], all framework CSS in @layer (unlayered
> consumer CSS always wins). Browser floor: ${floorLabel}.

## Install

npm i @busy-office/ui
import "@busy-office/ui/css";                      # all-in-one
# a la carte, ORDER MATTERS: tokens -> reset -> components
import "@busy-office/ui/css/tokens"; import "@busy-office/ui/css/reset";
import "@busy-office/ui/css/components/data-table";

## JS behaviors (call each ONCE — document delegation survives all DOM swaps)

import { initDialogs, initDataTables, initTabs, initDropdowns, initAlerts,
         refreshDataTable, trapFocus } from "@busy-office/ui/js";
- initDialogs(): REQUIRED for <dialog class="bo-dialog"> + [data-dialog-trigger].
- initDataTables(): select-all, live "n selected" count, O(1) toolbar reveal;
  re-derives on htmx:afterSwap; refreshDataTable(container) for other swaps.
- initTabs(): REQUIRED for tabs (roving tabindex, RTL-aware arrows).
- initDropdowns(): anchors [popover] menus to their invoker; close-on-select.
- initAlerts(): .bo-alert__dismiss removes its alert/toast.

## Behavior hooks (generated — the DOM each init reads)
${Object.entries(bh.behaviors)
  .map(([name, b]) => `- ${name}(): ${b.summary ?? ''}${b.hooks?.length ? ` [hooks: ${b.hooks.join(' ')}]` : ''}`)
  .join('\n')}

## Rules your markup must follow

${MARKUP_RULES.map((r) => `- ${r}`).join('\n')}

## Components (classes generated from shipped CSS)

`;

// Page slug = the component's OWN page (name, with the alert->alerts alias) —
// NOT api.index[classes[0]], whose first class may be owned by another
// component (site-grill slice-4: record-card's classes[0] is bo-badge).
const slugOf = (name) => `components/${api.pageSlug[name] ?? name}`;

for (const [name, c] of Object.entries(api.components)) {
  out += `### ${name} — ${site}/${slugOf(name)}/\n`;
  out += `classes: ${c.classes.join(' ')}\n`;
  /* Values, not just names (roadmap 33.3). 32.1 put them in api.json and the
     rendered ApiTable but not here — and llms.txt is the artefact a consumer's
     assistant actually reads. Measured: building a screen from this file alone
     produced exactly one machine-detectable error, an invented
     data-row-state="approved", because the name was published and the values
     were not. */
  if (c.dataAttrs.length) {
    const withValues = c.dataAttrs.map((a) => {
      const v = api.dataAttrValues?.[a];
      return v?.length ? `${a}="${v.join('|')}"` : a;
    });
    out += `data attrs: ${withValues.join(' ')}\n`;
  }
  if (c.ariaAttrs.length) out += `aria styled: ${c.ariaAttrs.join(' ')}\n`;
  out += '\n';
}

out += `## Primitives — ${site}/base/primitives/\n`;
for (const [name, p] of Object.entries(api.primitives)) {
  out += `${name}: ${p.classes.join(' ')}\n`;
}
out += `\n## Utilities\n${api.utilities.classes.join(' ')}\n`;

// Semantic token vocabulary — what a re-brand remaps (from the shipped tokens).
const tokensCss = await readFile(require.resolve('@busy-office/ui/css/tokens'), 'utf8');
const tokenNames = [...new Set([...tokensCss.matchAll(/(--bo-(?!palette)[a-z0-9-]+)\s*:/g)].map((m) => m[1]))].sort();
out += `\n## Semantic tokens (re-brand = remap these in UNLAYERED :root; re-set in your [data-theme="dark"] block — unlayered beats the framework's dark remaps)\n${tokenNames.join(' ')}\n`;
out += `\n## Key docs\n`;
for (const p of [
  'getting-started/installation', 'getting-started/first-screen',
  'getting-started/htmx', 'getting-started/troubleshooting',
  'concepts/tokens', 'concepts/density', 'concepts/cascade',
  'concepts/js-behaviors', 'concepts/accessibility', 'concepts/theming',
  'base/colors', 'reference/classes', 'patterns/invoice-list', 'patterns/approval',
]) out += `${site}/${p}/\n`;

/* "Deliberately absent" — generated from DESIGN.md's canonical table (roadmap
   32.3). An absence is invisible: an assistant asked for a data grid will build
   one unless something tells it the answer was considered and declined. This
   is the half `llms.txt` was missing — it said what exists and never what does
   not, so the most expensive mistakes were the ones it could not warn about.

   Parsed rather than restated, and it THROWS if the table is missing or empty:
   a silently-dropped section would be worse than none, because the file would
   still look complete. */
{
  const design = await readFile(join(docsRoot, '..', '..', 'DESIGN.md'), 'utf8');
  const section = design.split('## Deliberately absent')[1]?.split('\n## ')[0] ?? '';
  const rows = [...section.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm)]
    .filter((m) => !/^-+$/.test(m[1].trim()) && m[1].trim() !== 'Deliberately absent');
  if (rows.length < 3) {
    throw new Error('gen-llms: DESIGN.md "Deliberately absent" table is missing or too small — llms.txt would silently lose the refusals section');
  }
  const strip = (t) => t.replace(/`/g, '').trim();
  out += `\n## Deliberately absent — do not build these, use the alternative\n\n`;
  for (const m of rows) out += `- ${strip(m[1])} -> ${strip(m[2])}\n`;
  out += `\nThese were considered and declined on purpose; see DESIGN.md and ROADMAP.md for the reasoning.\n`;
}

// Assert every URL we publish resolves to a built page (site-grill S-2:
// generated links must be verified against output, not assumed).
const { access } = await import('node:fs/promises');
const urls = [...out.matchAll(new RegExp(`${site}/([a-z0-9/-]+)/`, 'g'))].map((m) => m[1]);
for (const slug of new Set(urls)) {
  try {
    await access(join(docsRoot, 'dist', slug, 'index.html'));
  } catch {
    throw new Error(`llms.txt links to a page that was not built: /${slug}/`);
  }
}

await writeFile(join(docsRoot, 'dist/llms.txt'), out);
console.log(`llms.txt generated (${(out.length / 1024).toFixed(1)} kB, ${new Set(urls).size} URLs verified)`);
