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
 *
 * A READ THAT NAMES NOTHING IS STILL A READ (roadmap 312.1, 2026-09-07). The
 * rule above is right and survives; what it could not see is the second route
 * into a file — an enumeration that fails to EXCLUDE it. Both live gates that
 * were missed reach `.roundtable/**` without the string appearing in their
 * code at all:
 *
 *   - `check-floor.mjs` runs `files(REPO_ROOT)`, a recursive walk past
 *     SOURCE_SKIP_DIRS, which does not contain `.roundtable`.
 *   - `check-slice-refs.mjs` runs `git ls-files` and reads every tracked file.
 *
 * A third, `check-vendor-names.mjs`, has `.roundtable` and `STATUS.md` as bare
 * elements of its own ROOTS array — a string literal eleven lines from the
 * read, matched by no read-shaped call.
 *
 * So there are three routes now, and the detector's verdict was checked
 * against an EMPIRICAL probe rather than against itself: every node process in
 * the CI-runnable suite was run under an fs spy that recorded each access
 * under an ignored path, and each named gate was then driven red by injecting
 * a violation IT can detect into `.roundtable/`. Both sets are in roadmap 313.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gate, assertScanned, selfTest } from './gate-report.mjs';
import { REPO_ROOT as ROOT, SOURCE_SKIP_DIRS } from './paths.mjs';
import { stripComments } from './source-files.mjs';


/** Directories whose scripts can run inside a CI job. */
const SCRIPT_DIRS = [
  join(ROOT, 'apps', 'docs', 'scripts'),
  join(ROOT, 'packages', 'core', 'scripts'),
  join(ROOT, 'examples', 'erp-suite'),
];

/** Reads a NAME in a way that would break if the file changed. */
/* Four scripts NAME these paths in prose, and a gate matching those could
   never pass. One definition, used by both readers below — it was inlined in
   readsFile and the glob reader needed the same thing. Moved to
   `source-files.mjs` on 2026-09-01 when a second gate needed it; the reason it
   exists is unchanged, and the counts this gate reports did not move. */

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

/**
 * Is this path named as a path ROOT — a string literal that IS the path, or
 * that begins with it?
 *
 * `opensPath` needs a read- or join-shaped call around the literal, and
 * `check-vendor-names` has neither: `.roundtable` and `STATUS.md` are bare
 * elements of a `ROOTS` array that `collectSource` walks. Anchoring on the
 * opening quote is what keeps this off the one false positive the file above
 * records — `<code>.roundtable/erp-suite-gaps.md</code>` inside a template
 * literal, where the literal starts with `<code>` and not with the path.
 */
function namesPathRoot(source, path) {
  const esc = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`['"\`]${esc}(?:['"\`]|/)`).test(stripComments(source));
}

/** The local binding of `REPO_ROOT` in this source, honouring `as` aliases. */
function repoRootBinding(code) {
  const m = code.match(/\bREPO_ROOT(?:\s+as\s+(\w+))?/);
  return m ? (m[1] ?? 'REPO_ROOT') : null;
}

/**
 * Does this script enumerate the WHOLE repository? Returns the route, or null.
 *
 * The seed must be `REPO_ROOT` itself — `files(REPO_ROOT)`, `readdir(ROOT, …)`
 * — never a path built from it. The looser form, "REPO_ROOT appears as an
 * argument", was measured first and flagged three more scripts
 * (`check-selftests`, `check-src-css-walkers`, `gen-suite-index`), every one of
 * which passes `join(REPO_ROOT, 'apps/docs/scripts')` and walks a subtree. The
 * fs spy recorded zero accesses under an ignored path from all three, so those
 * were false positives and the tighter seed is what removes them.
 */
function enumeratesRepo(code) {
  if (/execFile\w*\s*\(\s*['"`]git['"`][\s\S]{0,40}ls-files/.test(code)) return 'git ls-files';
  const root = repoRootBinding(code);
  if (!root) return null;
  if (!/\b(?:readdir|opendir)(?:Sync)?\s*\(/.test(code)) return null;
  if (new RegExp(`\\w+\\s*\\(\\s*${root}\\s*\\)`).test(code)) return 'repo walk';
  if (new RegExp(`\\b(?:readdir|opendir)(?:Sync)?\\s*\\(\\s*${root}\\s*[,)]`).test(code)) return 'repo walk';
  return null;
}

/**
 * Extensions a walk keeps, as an ALLOW-list: `['.mjs', '.js']` or
 * `/\.(astro|mjs|md)$/`.
 *
 * Used only to decide whether a repo WALK reaches a single named file, and
 * deliberately not applied to `git ls-files` — that route has no allow-list,
 * only denial regexes, and the two are indistinguishable from source text.
 * Asking a denylist "which extensions do you keep?" would answer with the ones
 * it REJECTS, which is the fail-open direction.
 */
function keptExtensions(code) {
  const exts = new Set();
  for (const m of code.matchAll(/['"`]\.([a-z0-9]{1,5})['"`]/gi)) exts.add(m[1].toLowerCase());
  for (const m of code.matchAll(/\\\.\(([a-z0-9|]+)\)\$/gi)) {
    for (const e of m[1].split('|')) exts.add(e.toLowerCase());
  }
  return exts;
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
/* Scoped to the `paths-ignore:` blocks rather than grepping the whole file for
   single-quoted list items. The global form was correct only because those
   were the only single-quoted entries in ci.yml, and it could not tell an
   EMPTY paths-ignore from a missing one — which is the state this repo is in
   from 312.2 onward, and the state a `assertScanned` would have failed on. */
const ymlLines = yml.split('\n');
const hasKey = /^\s*paths-ignore:\s*$/m.test(yml);
const ignoredRaw = [];
for (let i = 0; i < ymlLines.length; i++) {
  const head = ymlLines[i].match(/^(\s*)paths-ignore:\s*$/);
  if (!head) continue;
  for (let j = i + 1; j < ymlLines.length; j++) {
    const item = ymlLines[j].match(/^(\s*)-\s*'([^']+)'\s*$/);
    if (!item || item[1].length <= head[1].length) break;
    ignoredRaw.push(item[2]);
  }
}
if (!hasKey) {
  console.log(
    'ci-ignores check passed — .github/workflows/ci.yml declares no paths-ignore,\n' +
      '  so no path is exempt from being built and there is nothing to verify.\n' +
      '  (roadmap 312.2: the two entries that used to live here were read by three\n' +
      '  gates CI runs, so the exemption was removed rather than the reads.)',
  );
  process.exit(0);
}
const ignored = ignoredRaw
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

    /* The three routes added by 312.1. Each NOT-flagged case is a live script
       the fs spy recorded making zero accesses under an ignored path, so every
       one of them is a false positive this detector must keep refusing. */
    ['a bare ROOTS-array element is a path root',
      namesPathRoot("const ROOTS = ['README.md', '.roundtable', 'examples'];", '.roundtable'), true],
    ['a single-file ROOTS element is a path root',
      namesPathRoot("const ROOTS = ['README.md', 'STATUS.md'];", 'STATUS.md'), true],
    ['a path root inside a longer literal is NOT one',
      namesPathRoot('const html = `<code>.roundtable/erp-suite-gaps.md</code>`;', '.roundtable'), false],
    ['a path root in a comment is NOT one',
      namesPathRoot('/* .roundtable/ is loop machinery */\nconst x = 1;', '.roundtable'), false],
    ['a walk seeded at REPO_ROOT enumerates the repo',
      enumeratesRepo("import { REPO_ROOT } from './paths.mjs';\nfor await (const f of files(REPO_ROOT)) {}\nawait readdir(dir);") === 'repo walk', true],
    ['an aliased REPO_ROOT seed counts too',
      enumeratesRepo("import { REPO_ROOT as R } from './paths.mjs';\nawait readdir(R, { recursive: true });") === 'repo walk', true],
    ['git ls-files enumerates the repo',
      enumeratesRepo("execFileSync('git', ['ls-files'], { cwd: ROOT })") === 'git ls-files', true],
    ['a walk of a SUBTREE of REPO_ROOT does not',
      enumeratesRepo("import { REPO_ROOT } from './paths.mjs';\nconst d = join(REPO_ROOT, 'apps/docs/scripts');\nawait readdir(d);"), null],
    ['REPO_ROOT with no walk at all does not',
      enumeratesRepo("import { REPO_ROOT } from './paths.mjs';\nawait readFile(join(REPO_ROOT, 'LOOPS.md'));"), null],
    ['an extension allow-list is read as one',
      keptExtensions("const EXTS = ['.mjs', '.js', '.ts'];").has('md'), false],
    ['a regex alternation allow-list is read as one',
      keptExtensions('const KEEP = /\\.(astro|mjs|js|ts|md)$/;').has('md'), true],
  ]);
}

const SELF = join(ROOT, 'apps', 'docs', 'scripts', 'check-ci-ignores.mjs');

/**
 * How does this script reach an ignored path, if it does? Returns the route as
 * a phrase for the failure message, or null.
 *
 * Order matters only for the message. The three routes are independent, and
 * the empirical probe in roadmap 313 names which live gate each one catches.
 */
function readsIgnored(source, path) {
  const isGlob = path.includes('*');
  // For a glob, any read of a file under that directory is a violation —
  // there is no single name to look for, so the directory prefix is the
  // signal. Same comment-stripping as readsFile, for the same reason: four
  // scripts NAME these paths in prose.
  const target = path.replace(/\/?\*+$/, '');

  if (namesPathRoot(source, target)) return `names '${target}' as a path root`;
  if (isGlob ? opensPath(source, target) : readsFile(source, target.split('/').pop())) {
    return `opens ${target} by name`;
  }

  const mode = enumeratesRepo(stripComments(source));
  if (!mode) return null;

  if (isGlob) {
    /* The escape hatch, and the only one that is not "stop reading it": a
       directory the shared skip list excludes is not reached by any walk built
       on it. Consulting SOURCE_SKIP_DIRS rather than looking for the name in
       THIS script is deliberate — the skip decision lives in paths.mjs, so a
       correctly-excluded directory is never mentioned by the walker at all. */
    const top = target.split('/')[0];
    if (SOURCE_SKIP_DIRS.has(top)) return null;
    return `enumerates the repository (${mode}) without excluding ${top}/`;
  }

  /* A single named file. A walk reaches it only if its allow-list keeps that
     extension — `check-imports` walks the whole repo for .mjs/.js/.ts and
     genuinely never reads STATUS.md, which the fs spy confirms. `git ls-files`
     has no allow-list, so it always reaches it. */
  if (mode === 'git ls-files') return `enumerates the repository (${mode}), which has no extension allow-list`;
  const ext = target.includes('.') ? target.split('.').pop().toLowerCase() : null;
  if (ext && !keptExtensions(stripComments(source)).has(ext)) return null;
  return `enumerates the repository (${mode}) and keeps .${ext} files`;
}

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
      const route = readsIgnored(source, path);
      g.check(
        `${join(dir, e).replace(ROOT + '/', '')} does not read ${path}`,
        route === null,
        `It ${route}. A commit touching only ${path} is never built, so this ` +
          `script's dependency on it would be untested. Either stop reading it, or ` +
          `remove ${path} from paths-ignore in .github/workflows/ci.yml.`,
      );
    }
  }
}

assertScanned(scanned, 'script(s) scanned', 'no scripts found — wrong build context?');
g.report(`verified against ${scanned} script(s): ${ignored.join(', ')}`);
