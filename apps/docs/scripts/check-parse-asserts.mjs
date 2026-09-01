/**
 * Gate: a docs page that renders content derived from PARSING a file it reads
 * must assert, at build time, that the parse found something.
 *
 * WHY. A page's frontmatter runs at build time. When it reads a shipped artifact
 * and pulls structure out of it with a regex or a split, the failure mode is not
 * a crash — it is a page that renders an EMPTY table, a zero, or a silently
 * short list, and looks fine. `concepts/cascade.astro` gained a z-index parse on
 * 2026-08-22 and shipped unasserted for nine days, read past by three wakes,
 * until 227.1 spotted it and 230.1 fixed it (`ff2b623d`).
 *
 * 230.1 then declined to gate the predicate: the population had become 6 of 6
 * asserting, so a gate "would be uniformly true and is refused on roadmap
 * 94.11's own test: ceremony, not a detector." **Roadmap 232.3 refuted that**,
 * and this file is the correction. 94.11's test is about DISCRIMINATION, not
 * today's headcount: its predicate was refused because it stayed true UNDER
 * INJECTION — handed `letter-spacing: 7px`, the detector still reported 0
 * unexplained. This one is handed the real defect and goes red on it. The
 * red-proof needs no synthetic injection, because the defect is in this repo's
 * history: at `ff2b623d^` this gate flags exactly one page, `concepts/cascade.astro`,
 * and at `HEAD` it flags none.
 *
 * The population has been static at 8 pages for nine days, so this is not
 * urgent and is not a P0. Its value is about the ninth page.
 *
 * WHAT IT DOES NOT CHECK, said plainly. It asks whether the page asserts AT
 * ALL, never whether each individual parse is guarded by the assertion next to
 * it. That is semantic — the same wall roadmap 94.11 hit — and a gate can
 * enforce the shape that carries a property, not the property itself. The shape
 * here is: read + parse => at least one build-time throw.
 *
 * @heuristic — three recognitions, each a pattern over source text: a build-time
 *   read, a parse of what was read, and a build-time assertion. Each can be
 *   fooled; this same population was read as 6 and as 8 by careful passes on the
 *   same day. Self-tested: run with `--self-test`.
 */
import { readFile } from 'node:fs/promises';
import { assertScanned, selfTest } from './gate-report.mjs';
import { collectSource, byExt, stripComments } from './source-files.mjs';

/** Opens a file at build time. `readFileSync` does not match `readFile\s*\(`. */
const READS = /readFileSync|readFile\s*\(|import\.meta\.glob/;

/** Pulls structure out of what was read. A `.replace()` is not here on purpose:
 *  it rewrites text, it does not derive a list whose emptiness goes unnoticed. */
const PARSES = /\.matchAll\s*\(|\.match\s*\(|\.split\s*\(|\.exec\s*\(/;

/** Any build-time throw. Narrower spellings than `throw` were considered and
 *  refused: all six current pages use `throw new Error`, but a gate that only
 *  recognises that spelling fails a page for asserting with a TypeError. */
const ASSERTS = /\bthrow\b/;

/**
 * Split an `.astro` file into its build-time frontmatter and its template body.
 * Returns null when the file has no frontmatter — nothing in it runs at build
 * time, so it cannot hold this defect.
 */
export function frontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  return m ? { fm: m[1], body: src.slice(m[0].length) } : null;
}

/**
 * The detector, as a pure function so `--self-test` can hand it inputs.
 *
 * Returns null for a file this gate has no opinion about, otherwise the three
 * signals and the verdict.
 *
 * ALL THREE SIGNALS ARE READ FROM THE FRONTMATTER ONLY, and that is a measured
 * choice rather than an oversight. Scanning the body as well was tried first and
 * rejected: across the 8 pages that read a file, the body contributes exactly
 * ONE parse — `name.split('-')[3]` in `base/primitives.astro`, on a value whose
 * own parse is already guarded upstream — so it moves no verdict on the current
 * tree, while it opens a false-positive class the gate cannot mechanically
 * close: a `<pre><code>` sample in a body legitimately contains `.split(`.
 * A build-time assertion can only live in the frontmatter anyway.
 *
 * The known gap this leaves, stated rather than hidden: a page whose read is in
 * the frontmatter and whose ONLY parse is in the body would not be flagged. No
 * page does that today.
 */
export function classify(src) {
  const parts = frontmatter(src);
  if (!parts) return null;
  /* Comment-stripped, per CLAUDE.md's "assert on structure, never on raw text".
     The fail-open direction is the one that matters: `components/icon.astro`'s
     header explains a past bug by naming `iconCss.match(...)` in prose, and a
     commented-out `throw` left behind by a refactor would otherwise clear a page
     that asserts nothing. */
  const fm = stripComments(parts.fm);
  if (!READS.test(fm)) return null;
  const parses = PARSES.test(fm);
  const asserts = ASSERTS.test(fm);
  return { parses, asserts, flagged: parses && !asserts };
}

if (process.argv.includes('--self-test')) {
  const READ = `const css = readFileSync(p, 'utf8');`;
  const wrap = (fm, body = '<p>x</p>') => `---\n${fm}\n---\n${body}\n`;
  const v = (fm, body) => {
    const c = classify(wrap(fm, body));
    return c === null ? null : c.flagged;
  };
  /* Two ways to be wrong, and they are not symmetric. Missing a real unasserted
     parse is the defect this exists to catch; flagging a page that reads a file
     only for its byte length is the false positive 230.1 excluded BY HAND, and
     which must here exclude itself with no exemption map. Both are exercised,
     in both comment directions. */
  selfTest([
    ['an unasserted parse is caught', v(`${READ}\nconst n = css.match(/x/g).length;`), true],
    [
      'an asserted parse is not',
      v(`${READ}\nconst n = css.match(/x/g);\nif (!n) throw new Error('no x');`),
      false,
    ],
    ['a split counts as a parse', v(`${READ}\nconst a = css.split('\\n')[1];`), true],
    ['byte length only excludes ITSELF', v(`${READ}\nconst kb = css.length / 1024;`), false],
    ['a glob read counts as a read', v(`const f = import.meta.glob('*.css');\nconst a = f.x.match(/y/);`), true],
    ['a parse with no read is not ours', v(`const a = 'a,b'.split(',');`), null],
    ['a page with no frontmatter is not ours', classify('<p>hello</p>\n'), null],
    // Fail-OPEN direction: a throw that only exists in a comment must not clear.
    [
      'a commented-out throw does NOT clear',
      v(`${READ}\nconst n = css.match(/x/g);\n// if (!n) throw new Error('no x');`),
      true,
    ],
    [
      'a throw inside a block comment does NOT clear',
      v(`${READ}\n/* was: if (!n) throw new Error() */\nconst n = css.match(/x/g);`),
      true,
    ],
    // Fail-CLOSED direction: a parse only PROSE mentions must not flag.
    [
      'a parse only a comment mentions does not flag',
      v(`${READ}\n// once this said css.match(/x/g) and shipped empty\nconst kb = css.length;`),
      false,
    ],
    // The assertion must be a BUILD-TIME one: the body renders, it cannot guard.
    [
      'a throw in the BODY does not count as a build-time assert',
      v(`${READ}\nconst n = css.match(/x/g);`, '<p>throw new Error()</p>'),
      true,
    ],
  ]);
}

const { files, missing } = await collectSource(['apps/docs/src'], { keep: byExt('.astro') });
if (missing.length) {
  console.error(`parse-assert check FAILED — root(s) absent from this build context: ${missing.join(', ')}`);
  console.error('  Reporting rather than passing: a gate that cannot run must fail loudly.');
  process.exit(1);
}

const flagged = [];
let scanned = 0;
let reading = 0;
for (const f of files) {
  scanned += 1;
  const c = classify(await readFile(f.abs, 'utf8'));
  if (c === null) continue;
  reading += 1;
  if (c.flagged) flagged.push(f.rel);
}

assertScanned(scanned, '.astro files', 'has apps/docs/src moved?');

if (flagged.length) {
  console.error(`parse-assert check FAILED — ${flagged.length} page(s) parse a file they read and assert nothing:`);
  for (const f of flagged) console.error(`  ${f}`);
  console.error('  A regex or split that matches nothing renders an empty table, not an error.');
  console.error("  Throw in the frontmatter when the parse comes up short — e.g. `if (rows.length < 3)");
  console.error("  throw new Error('<page>: <file> parse came up short')` — so the build fails instead of the page.");
  process.exit(1);
}

console.log(
  `parse-assert check passed — ${scanned} .astro file(s) scanned, ${reading} read a file at build time, none parses without asserting`,
);
