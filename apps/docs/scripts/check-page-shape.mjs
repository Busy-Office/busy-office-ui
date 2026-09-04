/**
 * Fails the build if a shipped component's docs page is missing, or missing
 * a piece of the CLAUDE.md "how to document a component" skeleton (opener,
 * a hand-authored demo section, ClassRef, ApiTable, a non-empty Related
 * footer — demo-first, spec-last) or its sidebar entry. Turns that documented
 * convention into
 * something a page literally cannot violate — the roadmap's "scaffold
 * generator + page-shape gate" pairing (new-component.mjs stamps the shape,
 * this gate guards it).
  *
 * @heuristic — MOSTLY exact (the presence checks are lookups with no judgement
 * to get wrong), but the demo-first/spec-last assertion added 2026-08-23 decides
 * its verdict from POSITIONS in the source, which is precisely what this
 * project's taxonomy calls heuristic: it can be fooled by a page shape nobody
 * anticipated, and its own first draft WAS fooled — component-scoped, it
 * false-positived on state-patterns, a page documenting two components. One
 * heuristic check makes the file heuristic; the tag names the weakest link, not
 * the average.
 *
 *   Carries --self-test: the order detector is run against pages it must
 *   classify correctly — compliant, violating, and the composite shape that
 *   broke the first draft — and exits non-zero if it cannot tell them apart.
*/
import { readFile, readdir } from 'node:fs/promises';
import { assertScanned, selfTest } from './gate-report.mjs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_ROOT, REPO_ROOT } from './paths.mjs';

const docsRoot = DOCS_ROOT;
const repoRoot = REPO_ROOT;
const coreRoot = join(repoRoot, 'packages/core');
const pagesDir = join(docsRoot, 'src/pages/components');
const galleryPath = join(docsRoot, 'src/layouts/Gallery.astro');

/* The sidebar's component entries, from the ONE module that builds them
   (roadmap 249.8) — never re-derived here. The anchor entries carry a
   fragment, which is a link INTO a page rather than the page's own entry, so
   they are stripped before the membership test. */
const { ALL_ITEMS } = await import(new URL('../src/data/component-nav.mjs', import.meta.url));
const sidebarSlugs = new Set(
  ALL_ITEMS.filter((i) => !i.href.includes('#')).map((i) => i.href.replace('/components/', '')),
);

// PAGE_SLUG lives on the generated api.json (extract-api.mjs) — the single
// source; this used to be a hand-maintained copy that drifted out of sync
// with a THIRD copy in gen-llms.mjs (Slice 6 item 1 caught it the hard way).
const require = createRequire(import.meta.url);
/* The demo-first/spec-last detector, as a pure function so --self-test can
   run it on inputs whose right answer is known. Stated against the LAST spec
   block on the page rather than a given component's own: a page may document
   two components (state-patterns carries both skeleton and state, each with
   its own pair, the same way alert→alerts aliases a slug), and there the first
   component's tables correctly sit mid-page ahead of the second's demos. What
   must never happen is a demo section opening after the FINAL spec table. */
export function demoAfterSpec(page) {
  const lastDemo = page.lastIndexOf('<section class="demo"');
  const lastSpec = Math.max(page.lastIndexOf('<ClassRef'), page.lastIndexOf('<ApiTable'));
  return lastDemo >= 0 && lastSpec >= 0 && lastDemo > lastSpec;
}

if (process.argv.includes('--self-test')) {
  const demo = (n) => `<section class="demo"><h2>${n}</h2></section>`;
  const spec = (c) => `<ClassRef component="${c}" /><ApiTable component="${c}" />`;
  selfTest([
    ['demo-first, spec-last passes',
      demoAfterSpec(`${demo('Basic')}${demo('Markup')}${spec('badge')}<Related />`), false],
    ['a demo section after the spec tables is caught',
      demoAfterSpec(`${demo('Basic')}${spec('badge')}${demo('Markup')}<Related />`), true],
    ['a composite page — two components, the first spec block mid-page — is NOT caught (the shape that broke the first draft)',
      demoAfterSpec(`${demo('Skeletons')}${spec('skeleton')}${demo('States')}${spec('state')}<Related />`), false],
    ['a page with no spec tables at all is not caught (behavior-doc pages have none)',
      demoAfterSpec(`${demo('Basic')}${demo('Markup')}<Related />`), false],
  ]);
}

const api = JSON.parse(await readFile(require.resolve('@busy-office/ui/api'), 'utf8'));
const { pageSlug: PAGE_SLUG } = api;

const componentsDir = join(coreRoot, 'src/css/components');
const dirs = (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory());
const gallery = await readFile(galleryPath, 'utf8');

const failures = [];
/* A composite page is visited once per component it documents; the order
   failure is a property of the PAGE, so report it once. */
const orderReported = new Set();
let checked = 0;

for (const d of dirs) {
  const cssFileNames = (await readdir(join(componentsDir, d.name))).filter((f) => f.endsWith('.css'));
  const cssBodies = await Promise.all(
    cssFileNames.map((f) => readFile(join(componentsDir, d.name, f), 'utf8')),
  );
  /* A component with no rules yet is a slice stub, not shipped — so the docs
     cannot exist yet either. "Shipped" means what extract-api.mjs means by it,
     and that definition moved: 126.2 generalized it to
     `if (!sets.classes.size && !sets.dataAttrs.size) continue`, because a
     surface can be entirely attribute-driven. This gate kept the OLD half of
     the rule and therefore skipped `scan` — whose CSS is 100%
     `body[data-scan-result]::after` and contains no `.bo-` selector at all —
     for its whole life. It went unnoticed because a skipped page looks exactly
     like a passing one; scan.astro was missing <DsaScore> the entire time
     (Objective grill, 2026-08-23). Read membership from api.json, which is
     generated from the shipped artifact and already knows the answer, rather
     than re-deriving it from a regex here — the same reason PAGE_SLUG is read
     and not guessed. */
  const apiEntry = api.components?.[d.name];
  const hasRules =
    cssBodies.some((css) => /\.bo-[a-z0-9]/i.test(css)) ||
    (apiEntry?.dataAttrs?.length ?? 0) > 0;
  if (!hasRules) continue;
  checked++;

  const slug = PAGE_SLUG[d.name] ?? d.name;
  const pagePath = join(pagesDir, `${slug}.astro`);
  let page;
  try {
    page = await readFile(pagePath, 'utf8');
  } catch {
    failures.push(`${d.name}: no docs page at apps/docs/src/pages/components/${slug}.astro`);
    continue;
  }

  const checks = [
    [/<Gallery[\s>]/, 'wraps its content in <Gallery>'],
    [/class="demo-note"/, 'a one-line <p class="demo-note"> opener'],
    [new RegExp(`<ClassRef\\s+component="${d.name}"`), `<ClassRef component="${d.name}" />`],
    [/<section\s+class="demo"/, 'at least one hand-authored <section class="demo"> block'],
    [new RegExp(`<ApiTable[\\s\\S]{0,40}?component="${d.name}"`), `<ApiTable component="${d.name}" ... />`],
    /* Required so DsaScore's "not yet scored" branch is reachable BY
       CONSTRUCTION. It had never rendered on any page (roadmap 94.5): the
       component was only ever added to a page at the moment that component
       got scored, so absence read as "this page forgot", never as "not done
       yet" — which is the opposite of the judgment 93.1 recorded. With every
       component now scored the branch would have been dead forever; requiring
       the section here means the next component ships with it and shows the
       honest line until someone scores it. */
    [new RegExp(`<DsaScore\\s+component="${d.name}"`), `<DsaScore component="${d.name}" />`],
    [/<Related[\s\S]{0,10}?links=\{\[\s*\[/, 'a <Related> footer with at least one link'],
  ];
  for (const [re, desc] of checks) {
    if (!re.test(page)) failures.push(`${slug}.astro: missing ${desc}`);
  }

  /* ORDER, not just presence. The header above has said "demo-first,
     spec-last" since this gate was written, and the recipe in CLAUDE.md
     calls it the single highest-leverage structural fix found in the
     2026-08-16 docs-IA comparison — but the checks above are independent
     .test() calls, so a page could satisfy every one of them with its
     spec tables on top. Two did: dialog.astro and data-table.astro each
     kept a "Markup — the canonical recipe" section AFTER ClassRef and
     ApiTable, and the build passed for months (found by a Standardize
     sweep, 2026-08-23). Comparing source positions is exact — the last
     demo section must open before the spec tables do. The detector and
     the shape that broke its first draft are documented on
     demoAfterSpec() above, which --self-test exercises. */
  if (demoAfterSpec(page) && !orderReported.has(slug)) {
    orderReported.add(slug);
    failures.push(
      `${slug}.astro: a <section class="demo"> opens AFTER the last ClassRef/ApiTable — the skeleton is demo-first, spec-last, so the spec tables sit together at the end right before <Related>`,
    );
  }

}

/* ---------- every component PAGE is reachable from the sidebar ----------
   An unlisted page is unreachable, not retired. Since 2026-09-03 (roadmap
   249.8) the component groups are GENERATED from each component's CSS header,
   so this asks the same question of the same two places the sidebar is built
   from — api.nav for the generated entries, and component-nav.mjs's four
   documented extras for the pages with no CSS directory of their own.

   It walks the PAGES, not the CSS directories, and that is the fix rather
   than an incidental restatement. The assertion this replaces lived inside
   the loop above, which iterates `src/css/components/*` — so the two docs
   pages that document data-table BEHAVIOUR rather than a stylesheet,
   `inline-editing` and `table-toolbar`, were never reachability-checked at
   all. Measured by injection 2026-09-03: deleting the `inline-editing` entry
   from COMPONENT_NAV_EXTRAS (its mentions in the module went 1 -> 0) left
   this gate GREEN. That is the "a skipped page looks exactly like a passing
   one" failure the `scan` comment above records, in a second place. */
const PAGE_DIR_ONLY = new Set(['demos']);
let reachability = 0;
for (const entry of await readdir(pagesDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.astro') || PAGE_DIR_ONLY.has(entry.name)) continue;
  const slug = entry.name.replace(/\.astro$/, '');
  reachability++;
  if (!sidebarSlugs.has(slug)) {
    failures.push(
      `${slug}.astro: no sidebar entry — declare @category in the component's CSS header ` +
        `(packages/core/src/css/components/…), or, for a page with no CSS directory, add it to ` +
        `COMPONENT_NAV_EXTRAS in src/data/component-nav.mjs`,
    );
  }
}


/* ---------- PATTERN pages (Slice 23 item 3) ----------
   A pattern page is documentation of a SCREEN, not a gallery entry: ten
   of thirteen used to stop at "live demo + one caption" (owner docs
   review, 2026-08-16). Four sections are load-bearing and gated here —
   Anatomy (which component provides which region), Data contract (what
   the server must return; the HTMX story is meaningless without it),
   States (loading/empty/error/permission — the states real screens
   spend most of their life in), and Components used (the checklist a
   reader follows outward). Keyboard walkthrough, print behaviour and
   scaling notes are in the template but NOT gated: some screens
   genuinely have nothing to say about print, and a gate that forces
   filler buys nothing. */
const patternsDir = join(docsRoot, 'src/pages/patterns');
const PATTERN_SECTIONS = [
  [/<h2>\s*Anatomy/i, 'an <h2>Anatomy</h2> section'],
  [/<h2>\s*Data contract/i, 'an <h2>Data contract</h2> section'],
  [/<h2>\s*States/i, 'an <h2>States</h2> section'],
  [/<h2>\s*Components used/i, 'an <h2>Components used</h2> section'],
];
// index.astro (roadmap 104.1) is the section's front door — a generated
// tile grid over the pages below, not a pattern doc itself, so the
// PATTERN_SECTIONS skeleton doesn't apply to it. It still carries its own
// Related footer, so it isn't exempt from that check below.
const PATTERN_SECTIONS_EXEMPT = new Set(['index.astro']);
let patternsChecked = 0;
for (const f of (await readdir(patternsDir)).filter((f) => f.endsWith('.astro') && !PATTERN_SECTIONS_EXEMPT.has(f))) {
  const page = await readFile(join(patternsDir, f), 'utf8');
  patternsChecked++;
  for (const [re, desc] of PATTERN_SECTIONS) {
    if (!re.test(page)) failures.push(`patterns/${f}: missing ${desc}`);
  }
  if (!/<Related[\s\S]{0,10}?links=\{\[\s*\[/.test(page)) {
    failures.push(`patterns/${f}: missing a <Related> footer with at least one link`);
  }
}

/* ---------- an RF screen renders ONCE, in its mirror (roadmap 135.2) ------
   The owner reported the same defect twice: an RF pattern page showing its
   screen inline AND again in the device mirror below it — "it is kind of
   redundant that you show HTML form and also show iframe".

   It took three passes to actually clear, and the reason is worth the gate.
   131.1 found the instances by grepping for the `.demo-rf-screen` wrapper
   class, which is a PROXY for "this page renders a screen", not the thing
   itself: goods-receipt wrapped its copy in nothing, and rf-landing/rf-list
   wrapped theirs in nothing either, so a class-name search reported 3 when
   the answer was 6.

   This asks the exact question instead — does a pattern page IMPORT a screen
   component? — because the import is what renders it, and there is no
   spelling of it a grep for a class can miss. The mirrors under
   `patterns/rf/` are where those components belong; nothing else may pull
   one in. */
const RF_SCREENS = ['RfTaskMenu', 'RfTaskQueue', 'ScanToReceive', 'PickScreen', 'PutawayScreen', 'CountScreen'];
let rfChecked = 0;
for (const f of (await readdir(patternsDir)).filter((f) => f.endsWith('.astro'))) {
  const src = await readFile(join(patternsDir, f), 'utf8');
  rfChecked++;
  for (const screen of RF_SCREENS) {
    if (new RegExp(`^import\\s+${screen}\\s+from`, 'm').test(src)) {
      failures.push(
        `patterns/${f}: imports ${screen} — an RF screen renders ONCE, in its ` +
          `mirror under patterns/rf/. A second copy on the pattern page is the ` +
          `duplication roadmap 131.1/135.1c/135.2 removed three times.`,
      );
    }
  }
}

/* ---------- EVERY docs page ends with Related (Slice 23 item 8) ----------
   The owner review measured Related on ~75% of pages and asked for 100%:
   it is the only outward path from a page, and the pages missing it were
   the thin ones nobody could navigate away from. Landing pages and the
   generated 404 are exempt (they have their own navigation).

   patterns/rf/goods-receipt-rf.astro (roadmap 59.4) is exempt for the
   OPPOSITE reason: it deliberately has NO navigation chrome, because it is
   an isolated document embedded via <iframe> from /patterns/goods-receipt
   to prove the rf-essentials CSS profile is sufficient on its own — the
   docs shell, sidebar, and a Related footer all live in the framework's
   MAIN bundle, and pulling any of them in would defeat the page's whole
   purpose. A reader never lands on it directly; the parent page is the
   navigation. rf-landing-rf.astro and rf-list-rf.astro (roadmap 109.7) are
   the same fixture shape for the two new RF-track patterns — same reason,
   same exemption. */
const RELATED_EXEMPT = new Set([
  'patterns/rf/rf-pick-rf.astro',
  'patterns/rf/rf-putaway-rf.astro',
  'patterns/rf/rf-count-rf.astro',
  'index.astro',
  '404.astro',
  'patterns/rf/goods-receipt-rf.astro',
  'patterns/rf/rf-landing-rf.astro',
  'patterns/rf/rf-list-rf.astro',
  // Same shape, same reason (roadmap 119.1): isolated full-screen preview
  // opened directly, not embedded — a reader lands on /patterns/schedule
  // first and follows a real link here, so the parent page is still the
  // navigation.
  'patterns/schedule/full.astro',
  /* components/demos/* (roadmap 143.2) — the RF-mirror shape applied to two
     components that cannot be demonstrated inline. sidebar-nav collapses
     under `@container bo-shell`, so it needs a real .bo-app-shell sized by
     the frame; offcanvas is a <dialog>, so demonstrating it inline covered
     the docs page. Both are embedded via <iframe> from their component page,
     which is the navigation — a reader never lands here directly, and adding
     docs chrome would give the shell demo a SECOND shell and change the very
     container width the demo exists to show. */
  'components/demos/sidebar-nav-wide.astro',
  'components/demos/sidebar-nav-narrow.astro',
  'components/demos/offcanvas.astro',
]);
async function* allPages(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) yield* allPages(join(dir, e.name), `${rel}${e.name}/`);
    else if (e.name.endsWith('.astro')) yield [rel + e.name, join(dir, e.name)];
  }
}
let relatedChecked = 0;
/* ---------- EVERY docs page describes itself (roadmap 249.2) ----------
   The description becomes <meta name="description"> — the text a search result
   and a shared link show. Before 249.2, 1 of 165 built HTML files carried one
   (the landing page, which had always hand-written its own head), so every
   other page was described by whatever an engine guessed from its body.

   NO EXEMPT SET, deliberately. The Related footer above has eleven exemptions
   because a page with no navigation chrome is a real, argued shape here; a page
   nobody should be able to describe in one sentence is not. The eleven pages
   that own their own <head> — the RF profile mirrors, the iframe demos, the
   full-screen schedule, the landing page — are precisely the ones Gallery's
   own throw cannot see, which is why this arm reads the source of ALL of them
   rather than only the Gallery callers.

   THREE spellings, because there are three ways a page gets a head: the
   `description` prop on <Gallery>, a literal tag on a page that builds its own,
   or — since 249.17 — that literal HOISTED into a frontmatter constant, so the
   <title>, the description tag and the og:/twitter: tags all read one string
   and cannot drift. Checked at the SOURCE so the failure names a file a person
   can open — check-metadata.mjs asserts the same property on the built
   artifact, where it can also see length and uniqueness.

   THE THIRD SPELLING RESOLVES THE IDENTIFIER; it does not merely accept one.
   `content={anything}` passing would turn this arm into a detector that cannot
   fail, since a page can always name a constant it never defines — the exact
   shape this repo's gates keep being written to avoid. It finds the constant's
   own declaration and applies the same 40-character floor to the literal there,
   so a hoisted page that ships a two-word description still fails. Red-proved
   by shortening one, not by reading the code. */
const DESCRIBES_ITSELF = [
  (page) => /<Gallery[^>]*\sdescription="[^"]{40,}"/.test(page),
  (page) => /<meta\s+name="description"\s+content="[^"]{40,}"/.test(page),
  (page) => {
    const name = page.match(/<meta\s+name="description"\s+content=\{([A-Za-z_$][\w$]*)\}/)?.[1];
    if (!name) return false;
    const decl = page.match(new RegExp(`\\bconst ${name} = (['"])([^'"]{40,})\\1;`));
    return decl !== null;
  },
];
let describedChecked = 0;
for await (const [rel, file] of allPages(join(docsRoot, 'src/pages'))) {
  const page = await readFile(file, 'utf8');
  describedChecked++;
  if (!DESCRIBES_ITSELF.some((describes) => describes(page))) {
    failures.push(
      `${rel}: no page description — add description="…" to its <Gallery> call, or a ` +
        '<meta name="description" content="…"> if the page builds its own <head> ' +
        '(a frontmatter `const x = \'…\'` passed as content={x} counts). ' +
        'At least 40 characters; it is what a search result and a shared link show.',
    );
  }
  if (RELATED_EXEMPT.has(rel)) continue;
  relatedChecked++;
  if (!/<Related[\s\S]{0,10}?links=\{\[\s*\[/.test(page)) {
    failures.push(`${rel}: missing a <Related> footer with at least one link`);
  }
}

if (failures.length) {
  console.error(`page-shape check FAILED — ${failures.length} page(s) drift from the CLAUDE.md skeleton:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
assertScanned(checked, 'component pages', 'the page source directory is empty or moved');
console.log(`page-shape check passed: ${checked} component page(s) + ${patternsChecked} pattern page(s), ${rfChecked} checked for a duplicated RF screen verified against the CLAUDE.md skeletons, ${relatedChecked} page(s) carry a Related footer, ${describedChecked} page(s) describe themselves, ${reachability} reachable from the sidebar`);
