/**
 * Generates dist/llms.txt — a single machine-readable reference for coding
 * agents, from the same generated data the human docs use (api.json /
 * contrast.json), so it cannot drift either.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const api = JSON.parse(await readFile(require.resolve('@busy-office/ui/api'), 'utf8'));
const bh = JSON.parse(await readFile(require.resolve('@busy-office/ui/behaviors-manifest'), 'utf8'));
const pkg = JSON.parse(await readFile(require.resolve('@busy-office/ui/package.json'), 'utf8'));
const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://busy-office.github.io/busy-office-ui';

let out = `# busy-office-ui v${pkg.version}

> CSS-first UI framework for ERP and back-office applications. Semantic components,
> density as a dimension (data-density="compact|comfortable|spacious" on <html> or any
> wrapper), dark mode via [data-theme="dark"], all framework CSS in @layer (unlayered
> consumer CSS always wins). Browser floor: Chrome/Edge 119, Firefox 128, Safari 17.4.

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

- State is two-channel: visible non-color cue (glyph, aria-hidden) AND programmatic
  (visually-hidden text like "Completed: ", aria-current, ARIA attributes).
- Forms: aria-invalid + aria-describedby -> message id (+ role="alert" if dynamic).
- Dialogs: aria-labelledby -> title id. Icon-only buttons: aria-label.
- Row-select checkboxes need name/value to POST. Styled lists get role="list".
- Sorting: YOUR code re-orders rows and sets aria-sort on <th>; CSS draws indicator.
- Never user-scalable=no. Never override html font-size (rem-based framework).
- Columns hidden by container compaction (__col--secondary) must stay reachable.

## Components (classes generated from shipped CSS)

`;

// Page slug = the component's OWN page (name, with the alert->alerts alias) —
// NOT api.index[classes[0]], whose first class may be owned by another
// component (site-grill slice-4: record-card's classes[0] is bo-badge).
const slugOf = (name) => `components/${api.pageSlug[name] ?? name}`;

for (const [name, c] of Object.entries(api.components)) {
  out += `### ${name} — ${site}/${slugOf(name)}/\n`;
  out += `classes: ${c.classes.join(' ')}\n`;
  if (c.dataAttrs.length) out += `data attrs: ${c.dataAttrs.join(' ')}\n`;
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
