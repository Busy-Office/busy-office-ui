/**
 * The single definition of "this page says when NOT to use the component".
 *
 * Two gates ask that question and they must never answer it differently:
 * `check-wrong-choice.mjs` enforces the clause on the page, and
 * `check-dsa-scores.mjs` asserts that the `content` score agrees with it
 * (roadmap 94.12). When this landed the detector regex was byte-identical in
 * both files and the EXEMPT list was a Map in one and a hardcoded Set in the
 * other, under a comment reading "kept in step with…" — which is a promise a
 * human has to keep, i.e. drift with a date on it.
 *
 * That is the same defect `gate-report.mjs` was extracted for, and it is worse
 * here: two gates disagreeing about the rule would make the cross-check assert
 * an equivalence between two different questions, and it would still pass.
 *
 * Standardize sweep, 2026-08-21.
 */

/**
 * Components with no wrong context to name. Each entry is a DECISION and
 * carries its reason — forcing a sentence where none is true produces filler,
 * which is worse than silence.
 * @type {Map<string, string>} page slug → why it is exempt
 */
export const EXEMPT = new Map([
  ['button', 'the action primitive every other component defers to; there is no "use X instead of a button"'],
  ['form', 'the entry-context anchor the field matrix points at — the thing others are the wrong choice VERSUS'],
  ['prose', 'renders whatever stored rich text a server sends; the choice is upstream of this class'],
]);

/** The opener, or '' when a page has none. */
export function opener(src) {
  return /<p class="demo-note"[^>]*>([\s\S]*?)<\/p>/.exec(src)?.[1] ?? '';
}

/**
 * Does this page source carry the required wrong-choice clause?
 *
 * Deliberately structural rather than a judgement about prose: a `<strong>`
 * clause beginning "Not " / "Never " / "Do not". What the clause SAYS is a
 * human call no gate should pretend to make; whether it is there is not.
 */
export function hasWrongChoiceClause(src) {
  return [...opener(src).matchAll(/<strong>([\s\S]*?)<\/strong>/g)]
    .some((m) => /^\s*(Not|Never|Do not|Don'?t)\b/.test(m[1].replace(/<[^>]+>/g, '')));
}
