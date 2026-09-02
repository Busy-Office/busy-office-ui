/**
 * The shared mechanism for CHOKEPOINT GATES — gates that read a directory of
 * scripts as source text and fail when one of them re-rolls a walk that a
 * single module already owns.
 *
 * WHY THIS EXISTS RATHER THAN A SECOND COPY OF check-dist-walkers.mjs
 * (roadmap 244.4's second Accept criterion, decided 2026-09-02). This repo has
 * FOUR such chokepoints, not two:
 *
 *   dist-pages.mjs    apps/docs/dist          gated since 103.2
 *   src-css-files.mjs packages/core/src/css   gated by check-src-css-walkers.mjs
 *   source-files.mjs  the repo source tree    NOT gated — its own header says
 *                       "`dist-pages.mjs` already owns dist enumeration, and
 *                       `check:dist-walkers` enforces that nothing re-rolls it.
 *                       Source had no equivalent, so the first two scripts that
 *                       needed one each hand-rolled a recursive walk."
 *   dist-css.mjs      packages/core/dist/css  NOT gated
 *
 * So "a second gate by copying the first" was never the choice on offer: it is
 * the second of four, and four hand-copied drivers is precisely the drift
 * Slice 244 removed, re-created one layer up. What is shared here is the
 * DRIVER and the comment-blanking rule. What is NOT shared is the predicate —
 * see below, because that distinction is measured rather than tasteful.
 *
 * WHY ONE FILE PER CHOKEPOINT AND NOT ONE TABLE-DRIVEN GATE. `check-selftests.mjs`
 * enforces `@heuristic`/`@exact` + a real `--self-test` per `check-*.mjs` FILE.
 * A table of rows inside one gate would satisfy that meta-gate once and then
 * accept a third and fourth predicate with no new obligation to prove either
 * can fail — in a repo whose Slice 39.2 shipped four detectors in a row that
 * could not fail. One file per chokepoint makes the meta-gate demand a
 * self-test from every new predicate. That is the whole argument, and it is
 * why the driver moved here instead of the rows moving into one file.
 *
 * THE PREDICATES CANNOT BE SHARED, red-proved rather than asserted. Running
 * check-dist-walkers' own `walksDist` against the exact body 244.2 removed
 * from three core scripts (`git show 71a61679`) returns FALSE, while it
 * returns TRUE on the dist offender it was written for:
 *
 *   walksDist("async function* cssFiles(dir) { … readdir(dir) … }")  -> false
 *   walksDist("fs.readdirSync(join(DIST,'patterns'))")               -> true
 *
 * The dist signal is "a directory-listing call whose ARGUMENT names the tree".
 * A recursive src/css walker names the tree only at its CALL SITE — the
 * readdir inside it takes `dir`. A retargeted copy of that predicate would
 * have been a detector that cannot fail on the drift it was written for, which
 * is the defect this repo's doctrine names most often. Each chokepoint brings
 * its own predicate and its own self-test; only the plumbing is common.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { assertScanned } from './gate-report.mjs';

/**
 * Blank comments (line + block) so a walker named in PROSE never matches —
 * the string shape stays, offsets survive for error reporting.
 *
 * Lived in check-dist-walkers.mjs until 244.4. It is here, and applied by the
 * driver rather than remembered by each detector, because "comments are
 * blanked before matching" is a DECISION with a bug history — the sweep's own
 * literal-detector was wrong six times before it learned it (94.6b) — and a
 * decision stored twice is the failure `paths.mjs` records about
 * `SOURCE_SKIP_DIRS`.
 *
 * Idempotent: blanking already-blanked source is a no-op, so a detector that
 * blanks defensively before its own matching stays correct.
 */
export function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, pre) => pre + m.slice(pre.length).replace(/[^\n]/g, ' '));
}

/**
 * Every named function-ish declaration in `code`, with its body brace-matched.
 *
 * Needed because RECURSION is the signal that separates "walks the tree" from
 * "lists one directory", and recursion is a property of a function body, not
 * of a file. A character-window around the match would be a POSITION filter
 * wearing a context regex's clothes, which CLAUDE.md records as worse than a
 * dead detector because it reports a confident ABSENCE.
 *
 * Both spellings in use here are matched — a `function`/`function*`
 * declaration, and a `const NAME = (…) => {` / `= async function* (…) {`
 * binding — so rewriting the walker as an arrow is not an escape hatch.
 * String and template literals are skipped while matching braces.
 */
export function* namedFunctions(code) {
  const DECL = /(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g;
  const BIND = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\s*\*?\s*)?\([^)]*\)\s*(?:=>\s*)?\{/g;
  for (const re of [DECL, BIND]) {
    for (const m of code.matchAll(re)) {
      const open = m.index + m[0].length - 1;
      const close = matchBrace(code, open);
      if (close !== -1) yield { name: m[1], body: code.slice(open + 1, close) };
    }
  }
}

/** Index of the `}` closing the `{` at `open`, or -1. Quotes are skipped. */
function matchBrace(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i += 1) {
    const c = code[i];
    if (c === "'" || c === '"' || c === '`') {
      i = skipQuoted(code, i);
      continue;
    }
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Index of the quote closing the one at `i` (template `${…}` spans included). */
function skipQuoted(code, i) {
  const q = code[i];
  for (let j = i + 1; j < code.length; j += 1) {
    if (code[j] === '\\') {
      j += 1;
      continue;
    }
    if (code[j] === q) return j;
    if (q === '`' && code[j] === '$' && code[j + 1] === '{') {
      let depth = 1;
      j += 2;
      while (j < code.length && depth) {
        if (code[j] === '{') depth += 1;
        else if (code[j] === '}') depth -= 1;
        j += 1;
      }
      j -= 1;
    }
  }
  return code.length;
}

/** Does `body` call `name`? Used to recognise self-recursion. `$` is a legal
 *  identifier character AND a regex anchor, so it is escaped rather than
 *  interpolated raw. */
export function callsItself(name, body) {
  const esc = name.replace(/[$]/g, '\\$&');
  return new RegExp(String.raw`(?:^|[^\w$.])${esc}\s*\(`).test(body);
}

/**
 * Run one chokepoint gate: every `.mjs` in `scriptDir` except the exempt ones
 * is read and handed to `detect`; any that matches is an offender.
 *
 * `exempt` is a Map rather than a Set so each exemption carries its REASON in
 * the same expression that grants it — 244.4 asks for the reason to be stated
 * in the gate, and a comment above a Set can drift from the Set.
 *
 * Never returns when something failed.
 */
export async function chokepointGate({ label, scriptDir, tree, chokepoint, exempt, detect, hint }) {
  const names = (await readdir(scriptDir)).filter((f) => f.endsWith('.mjs') && !exempt.has(f));
  assertScanned(names.length, `scripts in ${scriptDir}`, 'no scripts found — the gate verified nothing');

  const offenders = [];
  for (const name of names) {
    if (detect(await readFile(join(scriptDir, name), 'utf8'))) offenders.push(name);
  }

  if (offenders.length) {
    console.error(`${label} check FAILED — ${offenders.length} script(s) enumerate ${tree} outside the chokepoint:`);
    for (const name of offenders) console.error(`  ${name} — ${hint}`);
    console.error(`  Exempt today, with reasons: ${[...exempt].map(([f, why]) => `${f} (${why})`).join('; ')}`);
    process.exit(1);
  }
  console.log(
    `${label} check passed — ${names.length} scripts, all ${tree} enumeration goes through ${chokepoint}` +
      ` (${exempt.size} exempt)`,
  );
}
