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
 * @exact — asserts named sections and components are present. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { readFile, readdir } from 'node:fs/promises';
import { assertScanned } from './gate-report.mjs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_ROOT, REPO_ROOT } from './paths.mjs';

const docsRoot = DOCS_ROOT;
const repoRoot = REPO_ROOT;
const coreRoot = join(repoRoot, 'packages/core');
const pagesDir = join(docsRoot, 'src/pages/components');
const galleryPath = join(docsRoot, 'src/layouts/Gallery.astro');

// PAGE_SLUG lives on the generated api.json (extract-api.mjs) — the single
// source; this used to be a hand-maintained copy that drifted out of sync
// with a THIRD copy in gen-llms.mjs (Slice 6 item 1 caught it the hard way).
const require = createRequire(import.meta.url);
const { pageSlug: PAGE_SLUG } = JSON.parse(
  await readFile(require.resolve('@busy-office/ui/api'), 'utf8'),
);

const componentsDir = join(coreRoot, 'src/css/components');
const dirs = (await readdir(componentsDir, { withFileTypes: true })).filter((d) => d.isDirectory());
const gallery = await readFile(galleryPath, 'utf8');

const failures = [];
let checked = 0;

for (const d of dirs) {
  const cssFileNames = (await readdir(join(componentsDir, d.name))).filter((f) => f.endsWith('.css'));
  const cssBodies = await Promise.all(
    cssFileNames.map((f) => readFile(join(componentsDir, d.name, f), 'utf8')),
  );
  // A component with no rules yet is a slice stub, not shipped — extract-api.mjs
  // skips these too (`if (!sets.classes.size) continue`), so the docs can't
  // exist yet either.
  const hasRules = cssBodies.some((css) => /\.bo-[a-z0-9]/i.test(css));
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

  if (!gallery.includes(`href: '/components/${slug}'`)) {
    failures.push(`${slug}.astro: no sidebar entry in Gallery.astro`);
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
   navigation. */
const RELATED_EXEMPT = new Set(['index.astro', '404.astro', 'patterns/rf/goods-receipt-rf.astro']);
async function* allPages(dir, rel = '') {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) yield* allPages(join(dir, e.name), `${rel}${e.name}/`);
    else if (e.name.endsWith('.astro')) yield [rel + e.name, join(dir, e.name)];
  }
}
let relatedChecked = 0;
for await (const [rel, file] of allPages(join(docsRoot, 'src/pages'))) {
  if (RELATED_EXEMPT.has(rel)) continue;
  const page = await readFile(file, 'utf8');
  relatedChecked++;
  if (!/<Related[\s\S]{0,10}?links=\{\[\s*\[/.test(page)) {
    failures.push(`${rel}: missing a <Related> footer with at least one link`);
  }
}

if (failures.length) {
  console.error(`page-shape check FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
assertScanned(checked, 'component pages', 'the page source directory is empty or moved');
console.log(`page-shape check passed: ${checked} component page(s) + ${patternsChecked} pattern page(s) verified against the CLAUDE.md skeletons, ${relatedChecked} page(s) carry a Related footer`);
