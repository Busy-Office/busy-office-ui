/**
 * Gate: a component page's "JS required" row agrees with the behaviors the
 * package actually ships for that component (roadmap 249.20).
 *
 * @exact — reads the `data-js-required` cell from the BUILT pages, extracts
 *   `init*` identifiers from it, and compares two SETS against
 *   behaviors.json's declared `byComponent`. No recognition, no position, no
 *   guess about which row is which. Exempt from --self-test; red-proved by
 *   injection, with the injection confirmed present in the built HTML before
 *   any red was believed.
 *
 * WHY. `ApiTable`'s `js` prop is hand-written and defaults to
 * `'None — CSS-only.'`, so a component whose page never passes it renders a
 * claim about runtime behaviour that nothing checks. Measured on the built
 * tree the day this gate landed, SIX of the 19 components the package ships a
 * behavior for said exactly that:
 *
 *   dashboard    initCollapsibleCards    — and the page's own demo imports it
 *   form         initGroupedNumber, initValidationSummary
 *   offcanvas    initDialogs             — and the page's own API note says
 *                                          "initDialogs() wires it exactly
 *                                          like any other"
 *   quantity     initQuantity, initGroupedNumber
 *   sidebar-nav  initAnchorNav
 *   stepper      initWizard
 *
 * Two of those contradicted their OWN page: the drawer's note and the
 * dashboard's demo script both name the init, three sections above a table row
 * saying the component needs no JS. That is not a wording slip — it is the
 * shape CLAUDE.md's "every documented surface is generated from the shipped
 * artifact" exists to stop, arriving in the one row of `ApiTable` that is
 * still hand-written.
 *
 * THE BASE RATE WAS MEASURED BEFORE THIS WAS WRITTEN (roadmap 94.11: a
 * predicate already true of everything cannot fail). It was 13 of 19 — the
 * gate went red on 6 real pages on its first run, which is why it is a gate
 * and not a report.
 *
 * WHY THE CELL AND NOT THE PAGE. Whole-page, 21 of 41 component pages mention
 * an `init*` name somewhere; the extra mentions are incidental — `button` names
 * `initDropdowns` in a menu-button demo, `richtext` names `initDialogs` because
 * one demo opens a dialog. Anchored to the cell, the reading is 13, and every
 * one of those 13 is a statement ABOUT that component. Both readings are
 * recorded here so a later reader can see why the anchor is load-bearing, and
 * the anchor is an attribute rather than the row's label text, so reading it
 * is membership rather than recognition.
 *
 * WHAT IT DOES NOT CHECK. Whether the prose is any good, and whether the JS is
 * "required" or merely an enhancement — nothing in the repo records that
 * (roadmap 249.9's badge audit; the tier is deliberately not invented here).
 * It checks two things only: no page claims an init that does not serve it,
 * and no served component's cell stays silent about every init that does.
 */
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { DIST, CORE_DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned } from './gate-report.mjs';

const beh = JSON.parse(await readFile(join(CORE_DIST, 'behaviors.json'), 'utf8'));
const byComponent = beh.byComponent ?? {};
assertScanned(
  Object.keys(byComponent).length,
  'components in behaviors.json byComponent',
  'is packages/core built? build:behaviors emits one entry per component, empty array included.',
);

/* The cell, by its attribute. `[^>]*` stops at the tag's own `>`, so the value
   is read from the tag and the text from between the tags — never across a
   neighbouring cell. */
const CELL = /<td[^>]*\bdata-js-required="([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/td>/g;
const INIT = /\binit[A-Z][A-Za-z0-9]*/g;

/** component -> the init names its own JS cell claims, unioned over its pages */
const claimed = new Map();
let cells = 0;
const pages = await distPages(DIST);
const wholePageMentions = new Set();
for (const page of pages) {
  if (/\binit[A-Z]/.test(page.html)) wholePageMentions.add(page.url);
  for (const [, component, text] of page.html.matchAll(CELL)) {
    cells += 1;
    const names = new Set(text.match(INIT) ?? []);
    const prev = claimed.get(component) ?? new Set();
    for (const n of names) prev.add(n);
    claimed.set(component, prev);
  }
}
assertScanned(cells, 'data-js-required cells in built pages', 'did ApiTable render, and did astro build run?');

const g = gate('js-serves check', 'component(s)');
const known = new Set(Object.keys(byComponent));

for (const [component, names] of [...claimed].sort()) {
  const serves = new Set(byComponent[component] ?? []);
  g.check(
    `${component}: its ApiTable exists in api.json/behaviors.json`,
    known.has(component),
    `data-js-required="${component}" names no component behaviors.json knows about`,
  );
  const invented = [...names].filter((n) => !serves.has(n));
  g.check(
    `${component}: its JS row names only behaviors that serve it`,
    invented.length === 0,
    `claims ${invented.join(', ')}; behaviors.json says ${[...serves].join(', ') || 'no behavior serves this component'}` +
      ' — fix the page, or the @serves declaration in packages/core/src/js/behaviors/',
  );
}

for (const [component, serves] of Object.entries(byComponent)) {
  if (serves.length === 0) continue;
  const names = claimed.get(component) ?? new Set();
  g.check(
    `${component}: its JS row names at least one of the ${serves.length} behavior(s) that serve it`,
    serves.some((n) => names.has(n)),
    `behaviors.json says ${serves.join(', ')} serve it; the built JS row names ${[...names].join(', ') || 'nothing'}` +
      ` — the page's ApiTable is rendering a JS claim that disagrees with the shipped package`,
  );
}

console.log(
  `  read ${cells} data-js-required cell(s) over ${pages.length} built page(s); ` +
    `${[...claimed.values()].filter((s) => s.size).length} cell(s) name an init, ` +
    `against ${wholePageMentions.size} page(s) that mention one anywhere (the unanchored reading, for contrast)`,
);
g.report('checked against behaviors.json');
