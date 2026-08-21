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
  'alerts', 'avatar', 'badge', 'byline', 'calendar',
  'combobox', 'dashboard', 'data-table', 'date', 'icon',
  'inline-editing', 'money', 'navbar', 'pagination', 'progress',
  'quantity', 'richtext', 'sidebar-nav', 'state-patterns',
  'stepper', 'table-toolbar', 'tree-table', 'tree',
]);

const dir = new URL('../src/pages/components/', import.meta.url);
const files = (await readdir(dir)).filter((f) => f.endsWith('.astro'));

const g = gate('wrong-choice check', 'component page(s)');
assertScanned(files.length, 'component pages', 'No .astro pages found — the gate verified nothing.');

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

g.report(`verified (${carried} carry the clause, ${TODO.size} outstanding, ${EXEMPT.size} exempt)`);
