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
 *
 * Uses the shared `gate()` contract, not a hand-rolled collect/print/exit —
 * this gate hand-rolled its own on first landing, the one thing
 * `gate-report.mjs` exists to prevent two copies of (Standardize sweep,
 * 2026-08-20). `assertScanned` replaces this file's own zero-pages guard.
 */
import { DIST, CORE_DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { gate, assertScanned } from './gate-report.mjs';

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
  'data-any-dirty',                                     // detail-form's field-per-row variant dirty demo
  'data-maintenance',                                   // master-detail fixture flag
  'data-sync-chip',                                     // app-frame's sync-slot demo cycler target (127.1) — the SLOT is the pattern; the hook is demo wiring
  'data-richtext-cmd', 'data-richtext-value',           // richtext toolbar demo (113.1: value-taking commands)
  'data-richtext-toggle',                               // richtext toolbar collapse demo (137.3) — the PART is the surface, this is page wiring
  'data-motion-play',                                   // /base/motion showcase replay (137.18) — page wiring; the CLASSES are the surface
  'data-cell-link-demo',                                // handle for the cell-link claims case (135.3b) — the part needs no attribute
  'data-grouped-head',                                  // handle for the grouped-header claims case (130.2 GAP-4a) — the FEATURE needs no attribute, which is the point; this only lets the check find the demo
]);

const api = JSON.parse(await readFile(join(CORE_DIST, 'api.json'), 'utf8'));
const beh = JSON.parse(await readFile(join(CORE_DIST, 'behaviors.json'), 'utf8'));

const documented = new Set();
for (const c of Object.values(api.components)) (c.dataAttrs ?? []).forEach((a) => documented.add(a));
for (const b of Object.values(beh.behaviors)) (b.hooks ?? []).forEach((h) => { if (h.startsWith('data-')) documented.add(h); });

assertScanned(documented.size, 'documented data-* hooks', 'wrong artifact?');

const g = gate('data-hooks check', 'data-* hook(s) used in docs markup');
const seen = new Set();
let scanned = 0;

for (const page of await distPages(DIST)) {
  scanned += 1;
  for (const tag of page.html.match(/<[a-z][^>]*>/g) ?? []) {
    for (const m of tag.matchAll(/[\s"'](data-[a-z][a-z0-9-]*)(?:=|[\s>/])/g)) {
      const attr = m[1];
      if (EXEMPT_PREFIXES.some((p) => attr.startsWith(p))) continue;
      seen.add(attr);
      const key = `${attr}@${page.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      g.check(
        `${attr} on ${page.url}`,
        documented.has(attr) || EXCEPTIONS.has(attr),
        `${attr} is not in api.json/behaviors.json and not a listed exception.\n     ` +
          'A hook the framework does not document is a promise nothing keeps — ' +
          'data-dialog-close shipped three dead buttons this way. Document it in the ' +
          'component/behavior, or add a commented exception in check-data-hooks.mjs.',
      );
    }
  }
}

assertScanned(scanned, 'docs page(s)', 'is dist built?');
g.report(`checked (${documented.size} documented, ${EXCEPTIONS.size} exceptions)`);
