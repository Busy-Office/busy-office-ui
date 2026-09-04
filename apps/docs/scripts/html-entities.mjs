/**
 * The ONE HTML-entity decoder the docs scripts read from (Standardize sweep,
 * roadmap 263.1).
 *
 * It was three, in one directory, under three names — so no name-collision
 * scan could see them, which is 257.1's lesson arriving a second time:
 *
 *   highlight-code.mjs  `unescapeHtml()`   7 chained replaceAll, ampersands last
 *   check-maturity.mjs  (inline, unnamed)  4 chained replace, numeric first
 *   check-metadata.mjs  `decode()`         one pass, named + decimal + hex
 *
 * THEY DISAGREED ON 8 OF 11 INPUTS, measured rather than reasoned about. The
 * number was produced by copying each body verbatim out of the three files at
 * `7691dec3`, the revision before this module existed, and running all three
 * over one input list:
 *
 *   git show 7691dec3:apps/docs/scripts/highlight-code.mjs | sed -n '44,53p'
 *   git show 7691dec3:apps/docs/scripts/check-maturity.mjs | sed -n '95,98p'
 *   git show 7691dec3:apps/docs/scripts/check-metadata.mjs | sed -n '198,204p'
 *
 * WHY ONE PASS, AND WHY THIS IS NOT A STYLE PREFERENCE. A chain of replaces
 * re-reads its own output, so it is wrong in one of the two mirror directions
 * whichever order it picks — and the two copies here had picked opposite
 * orders, so each was wrong where the other was right:
 *
 *   input        means the text   chain, ampersand last   chain, numeric first
 *   `&#38;amp;`  `&amp;`          `&amp;`  ✓               `&`       ✗
 *   `&amp;#38;`  `&#38;`          `&`      ✗               `&#38;`   ✓
 *
 * `highlight-code.mjs` carried a comment crediting a grill (H1) for putting the
 * ampersand forms last — which fixes the first row and is what breaks the
 * second. There is no order that gets both. One pass gets both, because a
 * replacement it emits is never scanned again.
 *
 * WHAT CHANGED FOR EACH CONSUMER, measured before the switch rather than
 * asserted after it:
 *
 * - `check-maturity.mjs` — output-neutral by base rate. Its input is the text
 *   of every `<h2>Maturity …</section>` block in `dist/`, and a walk of the
 *   built site found **0 entity references of any form in all 40 blocks**. Its
 *   copy has never decoded anything.
 * - `check-metadata.mjs` — unchanged by construction; this module IS its
 *   implementation, moved.
 * - `highlight-code.mjs` — gains hex (`&#x3C;`), `&nbsp;`, `&apos;` and
 *   arbitrary numeric forms, and loses the `&amp;#38;` bug above. Proved
 *   output-neutral on the current corpus by rebuilding `dist/` and diffing all
 *   138 built pages against the pre-change build: identical.
 *
 * NO `--self-test` HERE, deliberately. `check-selftests.mjs` walks `check-*`
 * files only, so a self-test on this module is a test nothing runs — the same
 * "not-a-gate report that rots because no lane runs it" the Standardize
 * playbook names. The durable form is the reproduction command above, written
 * beside the claim.
 *
 * NOT FOLDED IN: `check-po-app.mjs`'s `removeHref.replace(/&amp;/g, '&')`. That
 * is one entity on one URL taken from one attribute, and the file is a smoke
 * test that boots the app — a shared import there would be a dependency added
 * for a single `&`, not a duplication removed.
 */

/** The named entities this repo's own markup actually produces. An unknown
 *  name is left verbatim rather than guessed at: a decoder that invents a
 *  character for `&foo;` reports a difference in CONTENT where there is only a
 *  name it does not know. */
const NAMED = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&', nbsp: ' ' };

/**
 * Decode HTML entity references — named, decimal (`&#38;`) and hex (`&#x26;`)
 * — in ONE pass, so a character produced by one replacement is never re-read
 * as the start of another.
 */
export const decodeEntities = (s) =>
  s.replace(/&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z]+));/g, (whole, dec, hex, name) => {
    if (dec !== undefined) return String.fromCodePoint(Number(dec));
    if (hex !== undefined) return String.fromCodePoint(parseInt(hex, 16));
    return name in NAMED ? NAMED[name] : whole;
  });
