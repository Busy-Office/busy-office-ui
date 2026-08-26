/**
 * A screen's `<main>` as copyable markup — one implementation, two callers.
 *
 * `copy-suite.mjs` writes one of these per screen for the docs' screen kit
 * (147.2) and `create-ui/build.mjs` snapshots one into the scaffold template
 * (148.2). Both were written on 2026-08-26, hours apart, with byte-identical
 * extraction and de-indent logic — the second copy made by the author of the
 * first, on the same day they added a gate against exactly this
 * (`check:paths`). Convention loses to habit; a shared function does not.
 *
 * Lives beside `pages.mjs` and `kinds.mjs` because the shape of a suite screen
 * is the suite's business, not its consumers'.
 */

/**
 * @param {string} html  a built suite page
 * @returns {string|null} the `<main>` contents, de-indented, or null if absent
 */
export function screenFragment(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if (!main) return null;
  /* De-indent so what a reader copies is not wearing the shell's whitespace. */
  const lines = main.replace(/^\n+|\s+$/g, '').split('\n');
  const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(pad)).join('\n') + '\n';
}
