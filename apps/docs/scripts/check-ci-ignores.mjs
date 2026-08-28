#!/usr/bin/env node
/**
 * Gate: every path in CI's `paths-ignore` is genuinely read by nothing that
 * runs in CI.
 *
 * @heuristic — Carries --self-test. RE-TAGGED 2026-08-28 (Objective grill of
 * 169/170/172). It was `@exact` on the grounds that it "opens each script and
 * looks for a real read", but that IS a recognition step: `readsFile` and
 * `opensPath` decide, from call shapes, whether a mention is a read — and the
 * file's own header already records that a naive version "would fail on every
 * one of those four comments". 169.4 then made it more recognition-heavy by
 * adding directory-prefix matching for globs, whose first version flagged a
 * path inside a `<code>` tag in generated HTML.
 *
 * The tag matters because `check:selftests` EXEMPTS `@exact` gates from having
 * to prove they can fail. A gate is exempted by its own self-declaration and
 * nothing checks the declaration — which is how a sibling gate shipped tagged
 * `@exact` while running a heading-vs-fence state machine, found one grill
 * earlier. Self-declaration is not evidence.
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
import { gate, assertScanned, selfTest } from './gate-report.mjs';
import { REPO_ROOT as ROOT } from './paths.mjs';


/** Directories whose scripts can run inside a CI job. */
const SCRIPT_DIRS = [
  join(ROOT, 'apps', 'docs', 'scripts'),
  join(ROOT, 'packages', 'core', 'scripts'),
  join(ROOT, 'examples', 'erp-suite'),
];

/** Reads a NAME in a way that would break if the file changed. */
/* Four scripts NAME these paths in prose, and a gate matching those could
   never pass. One definition, used by both readers below — it was inlined in
   readsFile and the glob reader needed the same thing. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1 ');
}

/**
 * Does this source OPEN something under a directory? Used for glob entries.
 *
 * Deliberately narrower than `readsFile`: only a real read/join call counts.
 * `readsFile`'s third pattern — `NAME = '…/x.md'`, an identifier bound to the
 * path — cannot be reused here, because a directory prefix starts with a dot
 * and `.` is a regex wildcard, so `.ROUNDTABLE` matches almost anything. That
 * was not reasoned about: the first version of this flagged
 * `examples/erp-suite/build.mjs`, whose only mention is `.roundtable/…` inside
 * a `<code>` tag in generated HTML. Two candidates, both false, before a line
 * of it was believed.
 */
function opensPath(source, prefix) {
  const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const code = stripComments(source);
  return (
    new RegExp(`read[A-Za-z]*\\s*\\([^)]*['"\`][^'"\`]*${esc}`).test(code) ||
    new RegExp(`join\\s*\\([^)]*['"\`][^'"\`]*${esc}`).test(code)
  );
}

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
  return patterns.some((re) => re.test(stripComments(source)));
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
  // Globs are KEPT (roadmap 169.4). They were filtered out with the comment
  // "directory globs have no single file to read", and that was true of the
  // reader but not of the risk: `.roundtable/**` was the only glob entry and
  // it was the one carrying a live violation — check:repo ran a gate that
  // opened .roundtable/RESUME.md. The gate written to catch exactly that was
  // blind to it BY CONSTRUCTION, in the one slot it did not cover.
  //
  // A glob has no single filename, so it is matched by DIRECTORY PREFIX below
  // instead of by name.
  .filter((v, i, a) => a.indexOf(v) === i);

assertScanned(ignored.length, 'ignored file path(s) in ci.yml', 'paths-ignore moved or reformatted?');

const g = gate('ci-ignores check', 'CI-ignored file(s)');
/**
 * The scripts CI actually runs, DERIVED from ci.yml rather than listed.
 *
 * Every `run:` line is expanded through both package.json script maps (one
 * level of `npm run X` indirection, which is all this repo uses), and every
 * `scripts/<file>.mjs` mentioned in the result is a script CI executes. A
 * hand-kept list would rot; this is recomputed each run and `assertScanned`
 * below refuses a suspicious zero.
 */
const ciYml = await readFile(join(ROOT, '.github', 'workflows', 'ci.yml'), 'utf8').catch(() => '');

/* Keyed by WORKSPACE, never flattened. Flattening was the first version and it
   was wrong in a way the red-proof caught: the root package.json is merged last
   and its `build` overrides the docs `build`, so `npm run build -w docs` — the
   line CI actually runs — resolved to the CORE build and the whole
   check:repo chain below it disappeared. The gate then passed for the wrong
   reason. `-w <name>` picks the map. */
const WORKSPACES = {
  docs: join(ROOT, 'apps', 'docs', 'package.json'),
  '@busy-office/ui': join(ROOT, 'packages', 'core', 'package.json'),
  '@busy-office/create-ui': join(ROOT, 'packages', 'create-ui', 'package.json'),
  '': join(ROOT, 'package.json'),
};
const scriptsOf = {};
for (const [ws, file] of Object.entries(WORKSPACES)) {
  scriptsOf[ws] = (await readFile(file, 'utf8').then(JSON.parse).catch(() => ({}))).scripts ?? {};
}

/* Expand `npm run X [-w Y]` recursively, CARRYING THE WORKSPACE.
   A bare `npm run X` inside a workspace script means X in THAT workspace, not
   the root — `docs`'s own `build` chains `npm run check:repo` with no `-w`.
   Resolving those against the root was the second wrong version of this: the
   root has no `check:repo`, so the chain stopped one link short of every gate
   it runs, and the red-proof stayed green twice before this was found. */
const seen = new Set();
function expand(cmd, ws) {
  let out = cmd;
  for (const m of cmd.matchAll(/npm run ([\w:-]+)(?:\s+-w\s+(\S+))?/g)) {
    const target = m[2] ?? ws;
    const key = `${target}::${m[1]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const body = (scriptsOf[target] ?? {})[m[1]];
    if (body) out += '\n' + expand(body, target);
  }
  return out;
}
const ciText = [...ciYml.matchAll(/^\s*run:\s*(.+)$/gm)]
  .map((m) => expand(m[1], ''))
  .join('\n');

const ciRun = new Set();
for (const m of ciText.matchAll(/scripts\/([\w-]+\.mjs)/g)) {
  for (const dir of SCRIPT_DIRS) ciRun.add(join(dir, m[1]));
}
assertScanned(ciRun.size, 'script(s) CI runs, derived from ci.yml', 'ci.yml moved, or npm run indirection changed shape?');

if (process.argv.includes('--self-test')) {
  /* The cases that killed real versions of this detector, kept as the proof it
     can still tell them apart. Every NOT-flagged case below is a false positive
     that actually occurred. */
  selfTest([
    ['a readFile of the name is a read', readsFile("await readFile(join(D,'ROADMAP.md'))", 'ROADMAP.md'), true],
    ['a join toward the name is a read', readsFile("const p = join(ROOT, 'STATUS.md');", 'STATUS.md'), true],
    ['a name in a // comment is NOT a read', readsFile('// ROADMAP.md is read by nothing\nconst x = 1;', 'ROADMAP.md'), false],
    ['a name in a /* */ comment is NOT a read', readsFile('/* see ROADMAP.md */\nconst x = 1;', 'ROADMAP.md'), false],
    ['a glob prefix opened by readFile is a read', opensPath("readFile(join(R,'.roundtable/RESUME.md'))", '.roundtable'), true],
    ['a glob prefix inside a <code> tag is NOT a read', opensPath('const html = `<code>.roundtable/erp-suite-gaps.md</code>`;', '.roundtable'), false],
    ['a glob prefix in a comment is NOT a read', opensPath('// writes to .roundtable/loop-log.md\nconst x = 1;', '.roundtable'), false],
  ]);
}

const SELF = join(ROOT, 'apps', 'docs', 'scripts', 'check-ci-ignores.mjs');

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
      // A script that exists but CI never runs cannot make CI blind, and this
      // gate's claim is specifically "read by nothing THAT RUNS IN CI"
      // (roadmap 169.4). Scanning every file in the directory conflated the
      // two: after the charter check moved off `check:repo` onto the loop's own
      // path, the gate kept flagging it for a read that CI no longer performs.
      if (!ciRun.has(join(dir, e))) continue;
      /* This file necessarily contains reads of the paths it enforces — its
         --self-test fixtures are literal `readFile('.roundtable/…')` strings,
         and its own detector correctly matches them. Same self-reference
         `check-vendor-names` records for the denylist it enforces. Excluded by
         PATH, so a real read added elsewhere in this file is still caught by
         the fixtures being the only thing here. */
      if (join(dir, e) === SELF) continue;
      const isGlob = path.includes('*');
      // For a glob, any read of a file under that directory is a violation —
      // there is no single name to look for, so the directory prefix is the
      // signal. Same comment-stripping as readsFile, for the same reason: four
      // scripts NAME these paths in prose.
      const dirPrefix = path.replace(/\/?\*+$/, '');
      g.check(
        `${join(dir, e).replace(ROOT + '/', '')} does not read ${path}`,
        isGlob ? !opensPath(source, dirPrefix) : !readsFile(source, path.split('/').pop()),
        `A commit touching only ${path} is never built, so this script's ` +
          `dependency on it would be untested. Either stop reading it, or ` +
          `remove ${path} from paths-ignore in .github/workflows/ci.yml.`,
      );
    }
  }
}

assertScanned(scanned, 'script(s) scanned', 'no scripts found — wrong build context?');
g.report(`verified against ${scanned} script(s): ${ignored.join(', ')}`);
