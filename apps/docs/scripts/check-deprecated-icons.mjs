/**
 * No docs SOURCE page hands a reader a glyph the framework tells them to stop
 * using.
 *
 * @heuristic — the verdict rests on recognising two things a literal scan can
 *   get wrong: which region of an `.astro` file a match sits in, and whether it
 *   sits in code or in prose ABOUT code. Both have been wrong here before, so
 *   this ships `--self-test`.
 *
 * WHY (roadmap 292.9). 292.4 landed a guard on `/components/icon` asserting that
 * the page teaching the deprecation does not simultaneously teach the deprecated
 * class. The property is tree-wide and that guard is page-local: measured the
 * day it landed, four OTHER docs pages handed a reader a deprecated glyph across
 * five sites, one of them inside a copyable markup string — the exact shape
 * 292.4 had just fixed, one page over.
 *
 *   for g in settings barcode building user; do
 *     grep -rn "bo-icon--$g" apps/docs/src --include='*.astro'; done
 *
 * The five were resolved by replacement rather than by an exemption (the
 * reasons are in ROADMAP 292.9), so this gate went green on a tree that had
 * just been made green — which is precisely the state a red-proof exists for.
 *
 * WHAT IT IS NOT. A deprecation's own text says existing renders keep working,
 * so a bare render is not by itself a defect and this gate does not claim it is.
 * What it asserts is narrower and is the thing a docs page is FOR: a class a
 * human typed into a page a reader copies from. The two generated showcases on
 * `/components/icon` build their class through an interpolation and are exempt
 * for free rather than by an exception — the deprecated showcase must keep
 * rendering the four to show what they look like.
 *
 * TWO PHASES, because one of them was not enough and that was measured, not
 * foreseen. The source phase alone reported a clean tree while
 * `/components/demos/sidebar-nav-narrow` and `-wide` were both rendering
 * `bo-icon--user`: `SidebarNavShellDemo.astro` hand-writes the glyph NAME in a
 * tuple array (`['user', 'CRM']`) and interpolates it into the class, so no
 * scan for a literal class can ever see it. It was caught by grepping the BUILT
 * pages — CLAUDE.md's "verify against the RENDERED artefact, not the diff" —
 * after this gate had already gone green.
 *
 * The blind spot was NAMED in this header before it was closed, with a
 * measurement beside it, and the measurement was wrong in the ordinary way: the
 * needle was `icon: '<name>'`, an object-property spelling, and the live site is
 * a tuple. A needle that assumes one syntax reports a confident absence about
 * the other, which is the position-filter failure CLAUDE.md records. So the
 * second phase does not trace values at all — it reads the artefact.
 *
 *   1. SOURCE — every `.astro` file under `apps/docs/src`. Answers "did a human type this class
 *      into a page a reader copies from", which is the distinction that makes a
 *      deprecated glyph a defect rather than a surviving render.
 *      That phase reads SOURCE, so it also covers a copyable string a page
 *      declares but does not render — `/base/motion`'s `savingMarkup` is one,
 *      and phase 2 cannot see it because nothing puts it in the HTML.
 *   2. DIST — every built page. Exact for anything the build emits, whatever
 *      route the glyph name took. Exemptions are per-page and carry a reason,
 *      because a deprecation's own text says existing renders keep working.
 *
 *      It reaches inside highlighted code blocks, and that is MEASURED rather
 *      than assumed: `highlight-code.mjs` keeps a whole attribute value in one
 *      token, so `/components/icon`'s built markup block carries
 *      `class="bo-icon bo-icon--invoice bo-sidebar-nav__icon"` as contiguous
 *      text (2 of that page's 81 occurrences sit inside a `<pre>`). A
 *      highlighter that split an attribute value across tokens would silently
 *      end that — which is why phase 1 is not redundant.
 *
 * This runs in the docs BUILD chain, not in `check:repo`, for the same reason
 * `check:links` does: phase 2 needs `dist/`, and a gate that quietly skips half
 * of itself when its input is absent is the failure `check:rtl` records.
 *
 * SCOPE, and what it deliberately leaves uncovered:
 *   - `apps/docs/versions/**` is frozen published snapshots — excluded from the
 *     source walk by `SOURCE_SKIP_DIRS`, and not built into `dist/`.
 *   - `examples/erp-suite` and `examples/po-app` are OUT of scope as SOURCE and
 *     are NOT clean (4 literal + 2 interpolated sites on 2026-09-07). They are
 *     consumer applications, not pages that teach, and whether that distinction
 *     holds is a separate question — filed rather than decided here. The suite
 *     is copied into `dist/suite/`, so it is exempted by name in phase 2 rather
 *     than silently passing.
 */
import { readFile } from 'node:fs/promises';
import { collectSource, byExt, stripComments } from './source-files.mjs';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';
import { gate, assertScanned, selfTest } from './gate-report.mjs';
import { deprecatedGlyphs } from './deprecated-glyphs.mjs';

/**
 * A site that must keep its deprecated glyph, with the reason.
 *
 * Keyed `<repo-relative path>::<glyph>`. EMPTY today, and that is a finding
 * rather than an oversight: all five sites 292.9 measured were resolved by
 * choosing a shipped glyph, because every one was a demo rail or a spinner
 * where the glyph is editorial. The map exists because 292.9's Accept says
 * finding that a site should legitimately keep its glyph is a satisfying
 * outcome — a gate forced over a true exception is the ceremony CLAUDE.md's
 * base-rate rule refuses.
 */
const KEEPS_ITS_GLYPH = new Map([]);

/**
 * `.astro` frontmatter that is GATE CODE about this very class prefix.
 *
 * MEASURED, not assumed, and re-measured after the parse it originally cited
 * moved out to `deprecated-glyphs.mjs`: dropping this entry fails the
 * reconciliation `1 of 34`, naming icon.astro and no other file, at
 * `2 named + 2 interpolated against 9 bare`. Seven of those nine are the
 * 292.4/292.5 guard's own regex literals (`/bo-icon--([a-z0-9-]+)/g`,
 * `/bo-icon--\$\{/g`, `/bo-icon--/g`, `.startsWith('bo-icon--')`) plus a
 * `bo-icon--${g}` built into two error strings. Code, so comment-stripping
 * cannot reach it; not a class handed to any reader either.
 *
 * WHAT THIS COSTS, said plainly: the other two of the nine ARE hand-written
 * classes, in that page's copyable `markup` const, and they are the one
 * copyable block in `apps/docs/src` this gate does not read. They are not
 * unchecked — 292.4's guard asserts exactly this property over that const, from
 * the page's own source, and throws at build time. The exemption removes a
 * duplicate reading, not a check. Its TEMPLATE is still scanned here.
 */
const FRONTMATTER_EXEMPT = new Map([
  [
    'apps/docs/src/pages/components/icon.astro',
    "its frontmatter IS the 292.4/292.5 guard — it holds this class prefix in four regex literals and two error strings; the page's template is still scanned here, and 292.4 covers its markup const",
  ],
]);

/**
 * Built pages that may RENDER a deprecated glyph, with the reason.
 *
 * Matched as a prefix of the page url. A deprecation's own text says existing
 * renders keep working, so this map is not a loophole — it is the difference
 * between the two claims, and each entry has to say which side it is on.
 */
const MAY_RENDER = new Map([
  ['/components/icon/', 'the page that PUBLISHES the deprecation — its Deprecated showcase must render all four to show what a reader is being asked to stop using'],
  ['/reference/classes/', 'the generated index of every class the framework ships; a deprecated class is still shipped, and omitting it would make the index wrong'],
]);

/* A `/suite/` entry was written here and REMOVED as dead, measured rather than
   reasoned: `dist-pages.mjs` skips `suite` by name (roadmap 147.1), so the walk
   returns 0 pages under it and the exemption could never have matched. An
   exemption that cannot fire reads as coverage this gate does not have — the
   ceremony CLAUDE.md's base-rate rule refuses. `npm run suite` is what audits
   those screens; their deprecated glyphs are filed as their own item. */

/** Strip the comment forms an `.astro` template can carry. */
const stripTemplateComments = (t) =>
  t.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ');

/**
 * Split one `.astro` source into the text a reader can be handed, with prose
 * about glyphs removed from both regions.
 *
 * Comment-stripping is CLAUDE.md's "assert on structure, never on raw text":
 * the comment written to explain a replacement legitimately names the glyph
 * replaced, and an assertion that trips on its own explanation is a detector
 * that cannot pass. That is live, not hypothetical — `/base/motion` now carries
 * a frontmatter comment naming `--settings` directly above the line this gate
 * cleared.
 *
 * Exported so `--self-test` drives the real thing.
 */
export function readableRegions(src) {
  const fence = src.startsWith('---') ? src.indexOf('\n---', 3) : -1;
  if (fence === -1) return { frontmatter: '', template: stripTemplateComments(src) };
  return {
    frontmatter: stripComments(src.slice(3, fence)),
    template: stripTemplateComments(src.slice(fence + 4)),
  };
}

/**
 * Count what one region says about `bo-icon--`, reconciled.
 *
 * `named + interpolated` must equal a raw count of the bare prefix. A regex
 * that silently stopped matching would report a clean region rather than fail,
 * and this gate's whole verdict is an ABSENCE — the one kind of claim that
 * looks identical whether the instrument works or not.
 *
 * Exported so `--self-test` drives the real thing.
 */
export function scanRegion(text) {
  const named = [...text.matchAll(/bo-icon--([a-z0-9-]+)/g)].map((m) => m[1]);
  const interpolated = (text.match(/bo-icon--\$\{/g) ?? []).length;
  const bare = (text.match(/bo-icon--/g) ?? []).length;
  return { named, interpolated, bare, reconciles: named.length + interpolated === bare };
}

if (process.argv.includes('--self-test')) {
  const DEP = ['settings', 'building'];
  const taught = (src) => {
    const r = readableRegions(src);
    const names = [...scanRegion(r.frontmatter).named, ...scanRegion(r.template).named];
    return names.filter((g) => DEP.includes(g)).sort();
  };
  const page = (body) => `---\nconst x = 1;\n---\n${body}`;
  selfTest([
    ['a template teaching a deprecated glyph', taught(page('<span class="bo-icon bo-icon--settings"></span>')), ['settings']],
    ['a template using a shipped glyph', taught(page('<span class="bo-icon bo-icon--truck"></span>')), []],
    ['a deprecated glyph named in an HTML comment', taught(page('<!-- was bo-icon--settings -->')), []],
    ['a deprecated glyph named in an {/* astro */} comment', taught(page('{/* was bo-icon--building */}')), []],
    ['a deprecated glyph in a frontmatter JS comment', taught('---\n/* was bo-icon--settings */\nconst x = 1;\n---\n<p>hi</p>'), []],
    ['a copyable markup string in frontmatter', taught('---\nconst m = `<span class="bo-icon bo-icon--building"></span>`;\n---\n<pre>{m}</pre>'), ['building']],
    ['reconciliation catches a prefix the name regex misses', scanRegion('bo-icon--(x)').reconciles, false],
    ['reconciliation accepts an interpolated site', scanRegion('bo-icon--${icon}').reconciles, true],
  ]);
}

const deprecated = deprecatedGlyphs();
/* The noun is what `report()` counts, and what it counts is ASSERTIONS, not
   glyphs — one reconciliation per region plus one per deprecated glyph found.
   Naming it "glyph classes" would have printed "33 hand-written glyph classes
   verified" beside a summary line reading 88, two numbers for one thing with
   nothing to say they measure different sets. */
const g = gate('deprecated-icon check', 'region + glyph assertions');

const { files, missing } = await collectSource(['apps/docs/src'], { keep: byExt('.astro') });
if (missing.length) {
  console.error(`gate FAILED — root(s) absent from this build context: ${missing.join(', ')}`);
  console.error('  Reporting that rather than a pass it did not earn.');
  process.exit(1);
}
assertScanned(files.length, '.astro source files', 'Is apps/docs/src checked out?');
assertScanned(deprecated.length, 'deprecated glyphs in the shipped css', 'Did icon.css lose its DEPRECATED blocks?');

let handWritten = 0;
let interpolated = 0;
let filesWithGlyphs = 0;

for (const f of files) {
  const src = await readFile(f.abs, 'utf8');
  if (!src.includes('bo-icon--')) continue;
  filesWithGlyphs += 1;

  const regions = readableRegions(src);
  const exemptReason = FRONTMATTER_EXEMPT.get(f.rel);
  const scanned = [['the template', regions.template]];
  if (!exemptReason) scanned.push(['the frontmatter', regions.frontmatter]);

  for (const [label, text] of scanned) {
    const r = scanRegion(text);
    g.check(
      `${f.rel} — ${label} parses every bo-icon-- occurrence`,
      r.reconciles,
      `parsed ${r.named.length} named + ${r.interpolated} interpolated against ${r.bare} bare occurrence(s). ` +
        'This gate publishes an ABSENCE, so a partial parse must fail rather than under-report.',
    );
    handWritten += r.named.length;
    interpolated += r.interpolated;

    for (const glyph of new Set(r.named.filter((n) => deprecated.includes(n)))) {
      const keep = KEEPS_ITS_GLYPH.get(`${f.rel}::${glyph}`);
      g.check(
        `${f.rel} — ${label} does not hand a reader bo-icon--${glyph}`,
        Boolean(keep),
        `icon.css marks --${glyph} DEPRECATED, so this page teaches a class its own docs say to stop ` +
          'using. Choose a shipped glyph (relabelling a demo rail is usually the cheapest fix), point ' +
          '--bo-icon-src at your own SVG, or add an entry to KEEPS_ITS_GLYPH with the reason it must stay.',
      );
    }
  }
}

assertScanned(handWritten, 'hand-written glyph classes', 'Did the name regex stop matching?');

/* Phase 2 — the artefact. `distPages` throws on an empty walk, so "the build
   has not run" fails here rather than passing over nothing. */
const pages = await distPages(DIST);
let rendered = 0;
let exempted = 0;
const glyphRe = new RegExp(`bo-icon--(${deprecated.join('|')})(?![a-z0-9-])`, 'g');

for (const page of pages) {
  const found = new Set([...page.html.matchAll(glyphRe)].map((m) => m[1]));
  if (!found.size) continue;
  const exempt = [...MAY_RENDER].find(([prefix]) => page.url.startsWith(prefix));
  if (exempt) {
    exempted += found.size;
    continue;
  }
  rendered += found.size;
  for (const glyph of found)
    g.check(
      `${page.url} — built page does not render bo-icon--${glyph}`,
      false,
      'icon.css marks it DEPRECATED. Phase 1 saw nothing, so the class was most likely BUILT from a ' +
        'glyph name written somewhere this scan does not read — a tuple, a data file, a prop. Fix it at ' +
        'that source, or add a prefix to MAY_RENDER with the reason this page may render it.',
    );
}
assertScanned(exempted, 'exempt deprecated renders', 'MAY_RENDER matched nothing — has a docs route moved?');

console.log(
  `deprecated-icon check — SOURCE: ${files.length} .astro file(s), ${filesWithGlyphs} carrying glyphs, ` +
    `${handWritten} hand-written + ${interpolated} interpolated (never classified). ` +
    `DIST: ${pages.length} built page(s), ${rendered} unexplained deprecated render(s), ${exempted} exempt. ` +
    `Against ${deprecated.length} deprecated glyph(s): ${deprecated.join(', ')}`,
);
g.report();
