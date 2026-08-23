/**
 * Gate: every component page's opener says when NOT to use the component.
 *
 * The DSA rubric's `content` dimension asks for one thing above all — does the
 * page name a context where this component is the WRONG choice, and what to
 * use instead? Measured across two families scored after that definition was
 * written, **10 of 11 failed** (roadmap 94.10), and 94.12 then found that 28
 * of the 39 rows predating the definition were never re-read against it. At
 * that scale it is not a series of page-level oversights, it is a missing step
 * in the recipe — so the recipe now requires it (CLAUDE.md) and this enforces
 * it, rather than a third hand-written pass that the next new page undoes.
 *
 * The check is EXACT, not a judgement about prose: the opener must contain a
 * `<strong>` clause beginning "Not " / "Never " / "Do not". That is a
 * convention the recipe mandates, and it earns its prescriptiveness twice —
 * a reader gets the boundary in bold where they are already looking, and a
 * gate can tell whether it is there. What the clause SAYS is still a human
 * judgement no gate should pretend to make.
 *
 * TWO lists below, and the difference matters. `TODO` is debt: pages that
 * should have the clause and do not, shrinking as wakes write them. `EXEMPT`
 * is a decision: components with no wrong context to name, each with its
 * reason. Forcing a sentence onto those would produce filler, which is worse
 * than silence — the point is guidance, not a box ticked.
 *
 * Extended to PATTERN pages in the Standardize sweep of 2026-08-21. The
 * convention had been enforced on components and ignored on screens — one
 * rule applied to half the surface — and **0 of 19 pattern pages** carried a
 * clause. It matters more here, not less: picking the wrong SCREEN costs more
 * than picking the wrong component, and this framework ships four detail
 * screens a reader has to choose between.
 *
 * @exact — a structural check for a required element in a known position.
 * Exempt from --self-test: there is no heuristic to get wrong, only presence.
 */
import { readFile, readdir } from 'node:fs/promises';
import { basename } from 'node:path';
import { gate, assertScanned } from './gate-report.mjs';
import { EXEMPT, hasWrongChoiceClause } from './wrong-choice-rule.mjs';

/**
 * Debt, not exemption: these predate the recipe requirement (roadmap 94.10).
 * Delete a line when its page gains the clause — the list only shrinks.
 */
const TODO = new Set([
  'avatar', 'badge', 'byline', 'calendar',
  'dashboard', 'data-table', 'date', 'icon',
  'inline-editing', 'navbar', 'pagination', 'progress',
  'sidebar-nav', 'state-patterns',
  'stepper', 'table-toolbar', 'tree-table', 'tree',
]);

/** Pattern-page debt, same rule as TODO above: delete a line when it lands. */
const PATTERN_TODO = new Set([]);

const dir = new URL('../src/pages/components/', import.meta.url);
const patternDir = new URL('../src/pages/patterns/', import.meta.url);
const files = (await readdir(dir)).filter((f) => f.endsWith('.astro'));
// index.astro (roadmap 104.1) is the section's front door, not a screen a
// reader picks over another — there is no wrong-choice question to ask of it.
const patternFiles = (await readdir(patternDir)).filter((f) => f.endsWith('.astro') && f !== 'index.astro');

/* ASSERTIONS, not pages — this file makes up to two checks per page, so the
   old 'page(s)' noun printed 79 for 59 pages. Same defect as check-dsa-scores,
   same wake (Objective grill, 2026-08-21). */
const g = gate('wrong-choice check', 'assertion(s)');
assertScanned(files.length, 'component pages', 'No .astro pages found — the gate verified nothing.');
assertScanned(patternFiles.length, 'pattern pages', 'No pattern .astro pages found — the gate verified nothing.');

let carried = 0;
for (const file of files) {
  const slug = basename(file, '.astro');
  const src = await readFile(new URL(file, dir), 'utf8');
  const has = hasWrongChoiceClause(src);

  if (has) carried++;

  /* A page that gained the clause must be removed from TODO, or the list
     rots into a lie about what is outstanding. */
  g.check(`${slug}: is not listed as TODO once it carries the clause`, !(has && TODO.has(slug)),
    'it now has the clause — delete it from TODO in this file');

  if (EXEMPT.has(slug) || TODO.has(slug)) continue;
  g.check(`${slug}: opener names a context where this is the WRONG choice`, has,
    'add a <strong>Not …</strong> clause naming the wrong context and the alternative, or add the page to EXEMPT with a reason');
}

let patternCarried = 0;
for (const file of patternFiles) {
  const slug = basename(file, '.astro');
  const has = hasWrongChoiceClause(await readFile(new URL(file, patternDir), 'utf8'));
  if (has) patternCarried++;
  g.check(`patterns/${slug}: is not listed as TODO once it carries the clause`, !(has && PATTERN_TODO.has(slug)),
    'it now has the clause — delete it from PATTERN_TODO in this file');
  if (PATTERN_TODO.has(slug)) continue;
  g.check(`patterns/${slug}: opener names a screen this is the WRONG choice for`, has,
    'add a <strong>Not …</strong> clause naming the wrong context and which screen to use instead');
}

g.report(`verified across ${files.length + patternFiles.length} pages (components: ${carried} carry / ${TODO.size} outstanding / ${EXEMPT.size} exempt; patterns: ${patternCarried} carry / ${PATTERN_TODO.size} outstanding)`);
