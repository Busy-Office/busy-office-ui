#!/usr/bin/env node
/**
 * Gate: every path in CI's `paths-ignore` is genuinely read by nothing that
 * runs in CI.
 *
 * @exact — it opens each script and looks for a real read of the file. No
 * judgement about what a script "probably" does.
 *
 * WHY. `paths-ignore` means a commit touching only those paths is NEVER
 * BUILT. That is safe exactly as long as no gate depends on them, and that
 * condition is invisible: the day a gate starts reading an ignored file,
 * nothing fails — CI simply stops testing a class of change, silently, and
 * the next red build is attributed to whatever landed after it.
 *
 * The list was already wrong when this was written. CI's own comment claimed
 * ROADMAP.md was "READ BY GATE SCRIPTS (2 of them)" and used that to justify
 * NOT ignoring it. Measured: zero read it — four scripts mention it in a
 * comment, and the only file that opens it is scripts/loops/generate_status.py,
 * which is loop bookkeeping that never runs in CI. A stale comment was costing
 * a full run on 10 of every 60 commits. This gate exists so the claim is
 * checked rather than believed, in both directions.
 *
 * MENTION IS NOT A READ. The naive version of this greps for the filename and
 * would fail on every one of those four comments — a gate that cannot pass.
 * It looks for the file being OPENED: readFile/readFileSync/open() with the
 * name in the same call, or a path join that feeds one.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gate, assertScanned } from './gate-report.mjs';
import { REPO_ROOT as ROOT } from './paths.mjs';


/** Directories whose scripts can run inside a CI job. */
const SCRIPT_DIRS = [
  join(ROOT, 'apps', 'docs', 'scripts'),
  join(ROOT, 'packages', 'core', 'scripts'),
  join(ROOT, 'examples', 'erp-suite'),
];

/** Reads a NAME in a way that would break if the file changed. */
function readsFile(source, name) {
  const bare = name.replace(/\.[a-z]+$/i, '');
  const patterns = [
    // readFile('…/ROADMAP.md'), readFileSync("ROADMAP.md")
    new RegExp(`read[A-Za-z]*\\s*\\([^)]*['"\`][^'"\`]*${name}`),
    // join(ROOT, 'ROADMAP.md') — a path built toward it
    new RegExp(`join\\s*\\([^)]*['"\`]${name}['"\`]`),
    // const ROADMAP = '…/ROADMAP.md'  (an identifier bound to the path)
    new RegExp(`${bare.toUpperCase()}\\s*=\\s*[^\\n]*['"\`][^'"\`]*${name}`),
  ];
  // Strip comments first: four scripts NAME ROADMAP.md in prose, and a gate
  // that matched those could never pass.
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1 ');
  return patterns.some((re) => re.test(code));
}

/* The docs image copies apps/ and packages/ only, so `.github/` is legitimately
   absent there. Say so and stand down — a gate that cannot run must never
   report a clean pass it did not earn, and must never crash the build that
   contains it (CLAUDE.md, after check:rtl broke the po-app image the same
   way). Found by building the container BEFORE pushing, which is the whole
   reason "verify a new gate in the narrowest context that must run it"
   is written down. */
const YML = join(ROOT, '.github', 'workflows', 'ci.yml');
const yml = await readFile(YML, 'utf8').catch(() => null);
if (yml === null) {
  console.log(
    'ci-ignores check SKIPPED — .github/workflows/ci.yml is not in this build\n' +
      '  context, so CI\'s paths-ignore list was NOT verified here. It is verified\n' +
      '  in the full checkout, which is the context that owns that file.',
  );
  process.exit(0);
}
const ignored = [...yml.matchAll(/^\s*-\s*'([^']+)'\s*$/gm)]
  .map((m) => m[1])
  .filter((p) => !p.includes('*')) // directory globs have no single file to read
  .filter((v, i, a) => a.indexOf(v) === i);

assertScanned(ignored.length, 'ignored file path(s) in ci.yml', 'paths-ignore moved or reformatted?');

const g = gate('ci-ignores check', 'CI-ignored file(s)');
let scanned = 0;

for (const dir of SCRIPT_DIRS) {
  let entries = [];
  try {
    entries = await readdir(dir, { recursive: true });
  } catch {
    continue; // a build context that does not copy this dir
  }
  for (const e of entries) {
    if (!/\.(mjs|js)$/.test(e)) continue;
    const source = await readFile(join(dir, e), 'utf8').catch(() => '');
    if (!source) continue;
    scanned += 1;
    for (const path of ignored) {
      const name = path.split('/').pop();
      g.check(
        `${join(dir, e).replace(ROOT + '/', '')} does not read ${path}`,
        !readsFile(source, name),
        `A commit touching only ${path} is never built, so this script's ` +
          `dependency on it would be untested. Either stop reading it, or ` +
          `remove ${path} from paths-ignore in .github/workflows/ci.yml.`,
      );
    }
  }
}

assertScanned(scanned, 'script(s) scanned', 'no scripts found — wrong build context?');
g.report(`verified against ${scanned} script(s): ${ignored.join(', ')}`);
