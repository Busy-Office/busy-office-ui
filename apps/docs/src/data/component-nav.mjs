/**
 * Single source for the COMPONENT sidebar groups and the homepage task tiles,
 * built from the shipped CSS (roadmap 249.8).
 *
 * Every entry below that names a component comes from that component's own CSS
 * header — `@tagline`, `@category`, `@label`, `@order`, lifted into
 * `api.nav` / `api.components[…].meta` by `packages/core/scripts/extract-api.mjs`.
 * Adding a component's header is its whole registration: the sidebar, the
 * homepage tiles and `llms.txt` all pick it up on the next build with no hand
 * edit, and omitting the header fails the core build naming the file.
 *
 * WHAT THIS REPLACED, and why it was worth replacing. Until 2026-09-03 the
 * sidebar was a 43-entry hand-written array here in `Gallery.astro` and the
 * tile prose was five hand-written strings in `index.astro`. Neither was
 * policed the way the item that queued this assumed:
 *
 *   - the sidebar array was checked in ONE direction only — `check-page-shape`
 *     fails when a component PAGE has no entry, and reads neither the label
 *     nor the group;
 *   - the tile prose was policed by nothing at all (`grep -c "Find it by task"`
 *     over `apps/docs/scripts` and `packages/core/scripts` read 0 on
 *     2026-09-03; the one script hit for a tile string is a comment in
 *     `new-component.mjs`).
 *
 * And the drift that predicts had already happened: the "Actions" tile listed
 * Combobox, which the sidebar groups under Data input.
 *
 * Plain ESM (no Astro syntax), same as `pattern-groups.mjs`, so it loads
 * identically from `.astro` frontmatter and from a plain Node script —
 * `check-page-shape.mjs` is the plain-Node consumer, and it is why api.json
 * arrives through `createRequire` rather than `import … from`: a bare ESM
 * import of JSON needs an import attribute in Node and would load only under
 * Vite. `gen-llms.mjs` reads it the same way.
 */
import { createRequire } from 'node:module';

const api = createRequire(import.meta.url)('@busy-office/ui/api');

/**
 * The four sidebar entries that are NOT a component directory, and therefore
 * have no CSS header to carry their metadata. Measured 2026-09-03: 43 sidebar
 * `/components/*` entries, 40 CSS dirs, 39 page slugs (skeleton + state share
 * one page, alert aliases to `alerts`) — these four are the difference.
 *
 * Two are ANCHORS into a component page a reader would otherwise not think to
 * open; two are docs pages that document behaviour on `data-table` rather than
 * a stylesheet of their own. Both kinds are editorial, so they stay written
 * down — but they are four lines with reasons instead of forty-three without.
 * `check-page-shape` still fails if a component page has no entry here or in
 * the generated set, so a page cannot go unreachable either way.
 */
export const COMPONENT_NAV_EXTRAS = [
  // Anchor: date/time inputs are a section of the Forms page, not a component.
  { href: '/components/form#dates', label: 'Date & time', category: 'Data input', order: 70 },
  // Page-only: inline editing is a data-table behaviour (row-edit.ts), no CSS dir.
  { href: '/components/inline-editing', label: 'Inline editing', category: 'Tables & lists', order: 20 },
  // Page-only: the toolbar + grid-nav story spans data-table, button and dropdown.
  { href: '/components/table-toolbar', label: 'Toolbar & grid nav', category: 'Tables & lists', order: 30 },
  // Anchor: the card is a part of the dashboard component (.bo-widget).
  { href: '/components/dashboard#card', label: 'Card', category: 'Display', order: 20 },
];

for (const extra of COMPONENT_NAV_EXTRAS) {
  if (!api.categories.includes(extra.category)) {
    throw new Error(
      `component-nav: extra "${extra.href}" declares @category "${extra.category}", which is not one of: ${api.categories.join(', ')}`,
    );
  }
}

/** Every nav entry — generated and extra alike — in one shape. */
export const ALL_ITEMS = [
  ...api.nav.map((n) => ({ href: `/components/${n.slug}`, label: n.label, category: n.category, order: n.order })),
  ...COMPONENT_NAV_EXTRAS,
];

const inCategory = (category) =>
  ALL_ITEMS.filter((i) => i.category === category)
    // Same comparator as `extract-api.mjs`'s: declared order first, then label,
    // so a component that never declares @order lands at the end of its group
    // in a stable place rather than wherever `readdir` put it.
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
    .map(({ href, label }) => ({ href, label }));

/**
 * Components live under Reference only when they are DEPRECATED — an unlisted
 * page is unreachable rather than retired (owner call, roadmap 135/132.1) —
 * so that category is appended to the sidebar's hand-written Reference group
 * instead of becoming a task group of its own.
 */
export const REFERENCE_COMPONENT_ITEMS = inCategory('Reference');

/** The task groups, in the order `extract-api.mjs` declares the taxonomy. */
export const COMPONENT_GROUPS = api.categories
  .filter((c) => c !== 'Reference')
  .map((label) => ({ label, items: inCategory(label) }));

/**
 * The homepage's "Find it by task" tiles. The tile GROUPING is editorial and
 * coarser than the sidebar's — one tile spans three categories — so which
 * categories a tile covers is written here; the component names inside it are
 * generated, which is the half that had drifted.
 *
 * `TILE_NAMES` is the cap on how many names a tile prints before eliding.
 * Five matches the shape the hand-written prose already had (it ran 4-6 names,
 * one of them ending in an ellipsis) and keeps the card to two lines at the
 * 19rem `--bo-widget-min` the grid is laid out on.
 */
export const TILE_NAMES = 5;

export const TASK_TILES = [
  { label: 'Actions', href: '/components/button', categories: ['Actions'] },
  { label: 'Data input', href: '/components/form', categories: ['Data input'] },
  { label: 'Data display', href: '/components/data-table', categories: ['Tables & lists', 'Values', 'Display'] },
  { label: 'Feedback', href: '/components/alerts', categories: ['Feedback'] },
  { label: 'Navigation & layout', href: '/components/sidebar-nav', categories: ['Navigation & layout'] },
].map((tile) => {
  const names = tile.categories.flatMap((c) => inCategory(c).map((i) => i.label));
  return { ...tile, names: names.slice(0, TILE_NAMES), elided: names.length > TILE_NAMES };
});
