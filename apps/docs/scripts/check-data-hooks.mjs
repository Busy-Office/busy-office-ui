#!/usr/bin/env node
/**
 * Gate: every `data-*` hook used in built docs markup is one the framework
 * documents — or is on the explicit, commented exception list below.
 *
 * @exact — extracts attribute names from real tags and checks set membership.
 * Exempt from --self-test; red-proved by re-introducing `data-dialog-close`.
 *
 * WHY. `data-dialog-close` was invented in Slice 31, extended in 45.2 and
 * removed in 53.1 — a hook `initDialogs` never implemented and `api.json`
 * never listed. It left THREE dead buttons (×, Cancel, Save) in a shipped
 * pattern, and it survived `check:components-used` because that gate compares
 * components LISTED against components RENDERED and never asks whether what is
 * rendered WORKS. The drawer's claim tested Escape, so it passed throughout.
 * An undocumented hook in docs markup is a promise nothing keeps; this gate
 * makes inventing one a build failure on day one (roadmap 56.1).
 *
 * TAGS ONLY, NEVER TEXT. The first enumeration for this gate matched prose —
 * "the data-table component" in a caption has whitespace before `data-` and
 * reported a phantom hook on 7 pages (116 matches, all text). Attributes are
 * extracted from within `<tag …>` bounds; escaped markup in code samples is
 * text and never matches.
 */
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

/** Auto-generated / third-party attribute namespaces — not ours to police. */
const EXEMPT_PREFIXES = ['data-astro-', 'data-pagefind-'];

/**
 * Hooks that are deliberately NOT framework API. Adding a row here is a
 * decision someone makes in a diff — that visibility is the point.
 */
const EXCEPTIONS = new Set([
  // docs-site chrome (search, nav, reference tooling) — never shipped to consumers
  'data-cmdk-hint', 'data-cmdk-open', 'data-navgroup', 'data-search-keep',
  'data-api-notes', 'data-copy', 'data-hex', 'data-var',
  // demo-local wiring: page scripts driving their own fixtures
  'data-vh-pick', 'data-vh-row', 'data-group',          // value-help picker demo
  'data-line-remove', 'data-line-total',                // editable-grid totals demo
  'data-any-dirty',                                     // field-editor dirty demo
  'data-maintenance',                                   // master-detail fixture flag
  'data-richtext-cmd',                                  // richtext toolbar demo
]);

const api = JSON.parse(await readFile(join(DIST, '..', '..', '..', 'packages/core/dist/api.json'), 'utf8'));
const beh = JSON.parse(await readFile(join(DIST, '..', '..', '..', 'packages/core/dist/behaviors.json'), 'utf8'));

const documented = new Set();
for (const c of Object.values(api.components)) (c.dataAttrs ?? []).forEach((a) => documented.add(a));
for (const b of Object.values(beh.behaviors)) (b.hooks ?? []).forEach((h) => { if (h.startsWith('data-')) documented.add(h); });

if (!documented.size) {
  console.error('data-hooks check FAILED — no documented data-* hooks found at all; wrong artifact?');
  process.exit(1);
}

const offenders = new Map();
let scanned = 0;

for (const page of await distPages(DIST)) {
  scanned += 1;
  for (const tag of page.html.match(/<[a-z][^>]*>/g) ?? []) {
    for (const m of tag.matchAll(/[\s"'](data-[a-z][a-z0-9-]*)(?:=|[\s>/])/g)) {
      const attr = m[1];
      if (documented.has(attr) || EXCEPTIONS.has(attr)) continue;
      if (EXEMPT_PREFIXES.some((p) => attr.startsWith(p))) continue;
      if (!offenders.has(attr)) offenders.set(attr, new Set());
      offenders.get(attr).add(page.url);
    }
  }
}

if (!scanned) {
  console.error('data-hooks check FAILED — scanned zero pages; is dist built?');
  process.exit(1);
}

if (offenders.size) {
  console.error(`data-hooks check FAILED — ${offenders.size} undocumented data-* hook(s) in docs markup:`);
  for (const [attr, pages] of offenders) {
    console.error(`  ${attr}  (${pages.size} page(s), e.g. ${[...pages][0]})`);
  }
  console.error('  A hook the framework does not document is a promise nothing keeps —');
  console.error('  data-dialog-close shipped three dead buttons this way. Document it in the');
  console.error('  component/behavior, or add a commented exception in check-data-hooks.mjs.');
  process.exit(1);
}
console.log(`data-hooks check passed — ${scanned} page(s): every data-* hook is documented or an explicit exception (${documented.size} documented, ${EXCEPTIONS.size} exceptions)`);
