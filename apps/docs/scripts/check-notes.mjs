/**
 * Gate: an `ApiTable` note is PROSE, and must render as prose.
 *
 * Notes are injected with `set:html` so an author can write `<code>` — 208 uses
 * across the site, so escaping them wholesale is not an option. The cost of
 * that convenience is that a note is silently a fragment of HTML, and nothing
 * about writing one says so.
 *
 * Two ways that has already gone wrong in this repo:
 *
 *  - `A day may be a <span>, an <a> or a <button>` (roadmap 40.3) was written as
 *    prose. The unclosed `<a>` triggered the parser's adoption-agency algorithm,
 *    which HOISTED an `<a>` element out of its `<li>` to sit as a direct child
 *    of the `<ul>` — measured, `[LI, LI, LI, A]`. axe reported it as a SERIOUS
 *    `list` violation, several steps away from the note that caused it.
 *  - `they're real \`<button>\`s` in tag-input put a real, focusable button in
 *    the middle of a sentence. Backticks are not escaping; they are just
 *    characters. axe never complained because a stray button is valid HTML —
 *    it is simply not what the author wrote.
 *
 * So the rule is narrow and about INTENT: a note may use inline formatting, and
 * may not introduce interactive or structural elements. Anything else is a
 * sentence that the browser read as markup.
 *
 * Runs on the BUILT html on purpose. A source-level version of this check
 * reported six false positives immediately — notes are assembled from Astro
 * expressions (`<a href={base + '/x'}>…`), so the source is not HTML and cannot
 * be parsed as if it were. The rendered artifact is the only place the question
 * is well posed.
  *
 * @heuristic — decides "prose or markup" from regex-extracted <li> innards; a dead hoisting detector already shipped here.
 * Self-tested (roadmap 42.3 — the debt is PAID, and this line used to say it was owed): run
 * with `--self-test`. `check:selftests` enforces the `process.argv` branch itself, never the
 * tag text, which is how it once passed on all of them at once.
*/
import { readFile } from 'node:fs/promises';
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { assertScanned, selfTest } from './gate-report.mjs';

/** Inline formatting a note may legitimately contain. */
const ALLOWED = new Set(['code', 'kbd', 'em', 'strong', 'a', 'abbr', 'span', 'br']);
/** Elements that mean the author's prose was parsed as markup. */
const NEVER = new Set(['button', 'input', 'select', 'textarea', 'form', 'table', 'ul', 'ol', 'li', 'div', 'p', 'h1', 'h2', 'h3']);

/**
 * Classify one note's inner HTML. Extracted so `--self-test` can drive it: the
 * first hoisting detector here was dead code (it searched the built file for a
 * stray sibling, which parse-time hoisting never produces), and it passed
 * cleanly against a deliberately broken note.
 */
export function classifyNote(inner) {
  const VOID = new Set(['br', 'hr', 'img', 'input', 'wbr']);
  const stack = [];
  const bad = [];
  for (const t of inner.matchAll(/<(\/?)([a-z][a-z0-9]*)[^>]*?(\/?)>/g)) {
    const [, closing, name, selfClosing] = t;
    if (NEVER.has(name)) bad.push(name);
    if (VOID.has(name) || selfClosing) continue;
    if (closing) {
      if (stack.pop() !== name) stack.push('!' + name);
    } else stack.push(name);
  }
  return { unclosed: stack, forbidden: bad };
}

if (process.argv.includes('--self-test')) {
  const kind = (note) => {
    const r = classifyNote(note);
    return r.unclosed.length ? 'unclosed' : r.forbidden.length ? 'forbidden' : 'clean';
  };
  selfTest([
    ['an unclosed inline tag', kind('A day may be a <span>, an <a> or a plain one.'), 'unclosed'],
    ['a forbidden element', kind('they are real <button>x</button> elements'), 'forbidden'],
    ['ordinary prose with <code>', kind('use <code>data-day</code> for state'), 'clean'],
  ]);
}

const failures = [];
let notesChecked = 0;

for (const page of await distPages(DIST)) {
  for (const m of page.html.matchAll(/<ul[^>]*data-api-notes[^>]*>([\s\S]*?)<\/ul>/g)) {
    const inner = m[1];

    /* 1. Every tag a note opens, it closes.
       This is the CAUSE of the hoisting bug, and the only form of it a static
       check can see: an unclosed `<a>` is hoisted out of its `<li>` by the
       browser's adoption-agency algorithm, but that happens at PARSE time — the
       built file still reads `<li>…<a>…</li>`, so looking for a stray sibling in
       the HTML text can never fire. (It was written that way first, and passed
       against a deliberately broken note; a detector that cannot fail is worse
       than none.) axe catches the parsed result; this catches the sentence that
       caused it, and names the note. */
    for (const li of inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
      notesChecked += 1;
      /* The SAME function the --self-test drives. It held a duplicate before,
         so breaking one left the other happily green. */
      const { unclosed, forbidden } = classifyNote(li[1]);
      if (unclosed.length) {
        failures.push(
          `${page.url}\n     a note leaves <${unclosed[0].replace('!', '/')}> unclosed` +
            `\n     ${li[1].replace(/<[^>]*>/g, '').trim().slice(0, 80)}` +
            '\n     an unclosed inline tag is hoisted out of its <li> by the parser (axe: list)',
        );
      }
      for (const name of forbidden) {
        failures.push(
          `${page.url}\n     a note rendered a <${name}> element` +
            `\n     ${li[1].replace(/<[^>]*>/g, '').trim().slice(0, 80)}` +
            `\n     write &lt;${name}&gt; or <code>${name}</code> — backticks do not escape HTML`,
        );
      }
    }
  }
}

assertScanned(notesChecked, 'ApiTable notes', 'no component page rendered a notes list — has ApiTable changed?');

if (failures.length) {
  console.error(`notes check FAILED — ${failures.length} note(s) rendered as markup:`);
  for (const f of [...new Set(failures)]) console.error('  ' + f);
  process.exit(1);
}
console.log(`notes check passed — ${notesChecked} ApiTable note(s) render as prose, not markup`);
