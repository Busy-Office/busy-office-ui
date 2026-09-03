#!/usr/bin/env node
/**
 * README facts that live somewhere else and drift — derived, never typed.
 *
 * The npm README is the framework's front door and it is a documented surface
 * like any other: `stamp-readme.mjs` already stamps size, behaviors, events and
 * the browser floor from `dist/`. Three more claims belong to it and could not
 * come from `dist/`, because they are facts about the REPO rather than about
 * the shipped bytes:
 *
 *   gates   — how many gate scripts this build runs, and how many of them are
 *             heuristic detectors that ship a `--self-test`.
 *   notfor  — what the framework deliberately does not ship, from the
 *             `Not in scope` table on `getting-started/scope.astro`.
 *   faq     — what `getting-started/troubleshooting.astro` actually answers.
 *
 * ROADMAP 249.4 (2026-09-03) — and TWO of its three stated premises were
 * refuted by measuring them before building on them:
 *
 *   1. "count of `check-*.mjs` carrying `--self-test`" is the exact predicate
 *      CLAUDE.md records as a detector that cannot fail. 48 gate files contain
 *      the literal string; only 18 contain the `process.argv` branch that runs
 *      one, because the tag TEXT says "Carries --self-test". So this script does
 *      not count anything: it imports `scanGates()` from the gate itself, which
 *      already draws that distinction and was already wrong once in this exact
 *      way.
 *   2. "the two 'Not for' clauses from `scope.astro`" — `grep -c 'Not for'`
 *      on that file returns **0**. The page has an `In scope` list of 5 and a
 *      `Not in scope — decided, not forgotten` table of **7**; neither is
 *      spelled "Not for".
 *   3. "the five `troubleshooting.astro` headings" — that page carries
 *      **3** headings (2 `<h2>`, 1 `<h3>`), and its substance is an
 *      11-row symptom table that has no heading at all.
 *
 * WHY THIS PARSES THE SOURCE PAGE AND NOT THE BUILT ONE, which looks like the
 * lazier choice and is not: the built page carries **3** `<h2>`, and the third
 * is `Related` — the layout's own footer heading, not an authored question.
 * That is exactly the chrome-counted-as-content failure CLAUDE.md's instrument
 * section records (the docs shell's own menu button is a real `.bo-btn`).
 * Reading the source is what keeps the shell out of the count.
 *
 *   grep -oE '<h[123][^>]*>[^<]{0,70}' apps/docs/dist/getting-started/troubleshooting/index.html
 *
 * The same command shows **no `id` attribute on any heading** — raw `<h2>` in a
 * `.astro` file gets no auto-slug — so the README links to the page, not to an
 * anchor. Add ids first if a deep link is ever wanted.
 *
 * TWO MODES, for the same reason `derive-introduced.mjs` has two: this package
 * builds in contexts that copy only `packages/` (the po-app consumer image,
 * which exists to prove the real npm package boundary). `check:rtl` already
 * broke that build once by asserting on a repo file that is legitimately absent
 * there.
 *
 *   (default)  full repo. Re-derives every fact and rewrites the committed
 *              record `src/data/readme-facts.json`.
 *   (degraded) a source directory is missing. Does NOT rewrite the record and
 *              does NOT silently report smaller numbers — it says on stderr
 *              which input was absent and that the facts were NOT re-derived
 *              in this context, then exits 0 so the packages-only build can
 *              proceed on the committed record. A gate that cannot run must
 *              fail loudly, never skip quietly.
 *
 * `--check` exits non-zero if a re-derivation disagrees with the record, so CI
 * cannot drift; in the degraded context it reports that it could not check.
 *
 * @exact — set membership and string equality over parsed markup and a JSON
 * record; the one judgement in it (which gate is heuristic) is delegated to
 * `check-selftests.mjs`, which owns it. Exempt from --self-test.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const REPO = join(ROOT, '..', '..');
const RECORD = join(ROOT, 'src', 'data', 'readme-facts.json');

const SCOPE_PAGE = join(REPO, 'apps/docs/src/pages/getting-started/scope.astro');
const TROUBLE_PAGE = join(REPO, 'apps/docs/src/pages/getting-started/troubleshooting.astro');
const GATE_MODULE = join(REPO, 'apps/docs/scripts/check-selftests.mjs');

const exists = async (p) => access(p).then(() => true, () => false);

/* Structural, not textual: take the ONE `<section class="demo">` whose heading
   names the table, then the FIRST `<td>` of each body row inside it. A
   file-wide `<td>` sweep happens to give the same answer today because
   scope.astro carries exactly one table — which is precisely why it is not
   what this does. `<thead>` uses `<th>`, so header cells cannot leak in. */
function sectionByHeading(src, heading) {
  const sections = src.split('<section class="demo">').slice(1);
  const hit = sections.filter((s) => s.includes(heading));
  if (hit.length !== 1)
    throw new Error(`expected exactly 1 section containing ${JSON.stringify(heading)}, found ${hit.length}`);
  return hit[0].split('</section>')[0];
}

const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function firstCells(sectionSrc) {
  return [...sectionSrc.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map(([, row]) => /<td>([\s\S]*?)<\/td>/.exec(row))
    .filter(Boolean)
    .map(([, cell]) => stripTags(cell));
}

async function derive() {
  /* Dynamic, and by absolute path — not a static `import` and not a bare
     specifier. Static would throw at module load in the packages-only context
     below, before the presence check could report anything; a bare specifier
     would need this workspace to depend on the docs one, which it must not.
     The chain it pulls in is npm-free: check-selftests → paths.mjs (node:path,
     node:url) → gate-report.mjs (no imports at all), so it resolves in any
     context where the files exist, whatever the node_modules layout is. */
  const { scanGates } = await import(GATE_MODULE);
  const { checked, heuristic, untagged, owed } = await scanGates();
  /* Reconcile against the SOURCE, not against what was handed in: if the gate
     itself is reporting problems, the count on the front page would be a claim
     about a tree that does not pass its own meta-gate. */
  if (untagged.length || owed.length)
    throw new Error(`check:selftests reports ${untagged.length + owed.length} problem(s) — fix those before stamping a gate count`);

  const scopeSrc = await readFile(SCOPE_PAGE, 'utf8');
  const notInScope = firstCells(sectionByHeading(scopeSrc, 'Not in scope'));
  /* Count the raw thing in the source and refuse to write if fewer were
     parsed — a derived artefact may not decide on its own what it failed to
     see. `<tr>` minus the one `<thead>` row is the raw count. */
  const rawScopeRows = (scopeSrc.match(/<tr>/g) || []).length - (scopeSrc.match(/<thead>/g) || []).length;
  if (notInScope.length !== rawScopeRows)
    throw new Error(`scope.astro: parsed ${notInScope.length} not-in-scope rows but the file has ${rawScopeRows}`);

  const troubleSrc = await readFile(TROUBLE_PAGE, 'utf8');
  const questions = [...troubleSrc.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(([, h]) => stripTags(h));
  const rawH2 = (troubleSrc.match(/<h2[^>]*>/g) || []).length;
  if (questions.length !== rawH2)
    throw new Error(`troubleshooting.astro: parsed ${questions.length} h2 but the file has ${rawH2}`);
  const symptoms = firstCells(troubleSrc).length;
  if (symptoms === 0) throw new Error('troubleshooting.astro: parsed 0 symptom rows');

  return {
    gates: `${checked} build gates, ${heuristic} of them heuristic detectors that each ship a \`--self-test\``,
    /* Verbatim subjects, joined. Deliberately NOT article-stripped: the first
       four rows open with "A " and the last three do not, so a `^A ` strip
       produced "charting engine · … · Icons as a shipped set" — a casing
       mismatch invented by the deriver out of nothing wrong in the source. */
    notfor: notInScope.join(' · '),
    /* One h2 is quoted in the source and one is not, so normalise BOTH rather
       than passing one through: strip any straight quotes the source carries,
       then wrap every question the same way. */
    faq: `${symptoms} symptom→cause entries, plus ${questions.map((q) => `“${q.replace(/^"|"$/g, '')}”`).join(' and ')}`,
  };
}

const missing = [];
for (const [label, path] of [
  ['apps/docs/src/pages/getting-started/scope.astro', SCOPE_PAGE],
  ['apps/docs/src/pages/getting-started/troubleshooting.astro', TROUBLE_PAGE],
  ['apps/docs/scripts/check-selftests.mjs', GATE_MODULE],
])
  if (!(await exists(path))) missing.push(label);

const check = process.argv.includes('--check');

if (missing.length) {
  console.error(
    `readme facts NOT re-derived — this build context is missing ${missing.length} input(s):`,
  );
  for (const m of missing) console.error(`  ${m}`);
  console.error(
    '  A context that copies only packages/ legitimately has none of them. The committed',
  );
  console.error(
    `  record (src/data/readme-facts.json) is used as-is and was ${check ? 'NOT verified' : 'NOT rewritten'} here.`,
  );
  process.exit(0);
}

const facts = await derive();
const serialised = JSON.stringify(facts, null, 2) + '\n';
const existing = await readFile(RECORD, 'utf8').catch(() => null);

if (check) {
  if (existing !== serialised) {
    console.error('readme facts check FAILED — the record has drifted from the repo:');
    for (const k of Object.keys(facts)) {
      const was = existing ? (JSON.parse(existing)[k] ?? '(absent)') : '(no record)';
      if (was !== facts[k]) console.error(`  ${k}:\n    record: ${was}\n    repo:   ${facts[k]}`);
    }
    console.error('  Run: npm run build:readme-facts -w @busy-office/ui');
    process.exit(1);
  }
  console.log(`readme facts check passed — ${Object.keys(facts).length} derived fact(s) match the repo`);
} else if (existing !== serialised) {
  await writeFile(RECORD, serialised);
  console.log(`wrote ${RECORD}`);
} else {
  console.log(`readme facts unchanged — ${Object.keys(facts).length} fact(s)`);
}
