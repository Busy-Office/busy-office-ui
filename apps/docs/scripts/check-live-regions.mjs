/**
 * Gate: no assertive live region ships for content that was there all along.
 *
 * `role="alert"` announces a CHANGE. Content already in the HTML when the page
 * is parsed has not changed, so screen readers commonly do not announce it —
 * and where one does fire, it interrupts whatever the user was reading. The
 * role is therefore a claim about ARRIVAL, and the framework was making that
 * claim eight times for markup that never arrives (roadmap 97.1).
 *
 * The cause was not eight independent slips. Four statements of the rule
 * shipped and two of them were wrong in the same way: `alert.css` and the
 * alerts page said the role was picked by SEVERITY ("role=alert for errors"),
 * while `form-field.css` and the accessibility page said it was picked by
 * arrival ("if dynamic"). Severity is the right answer to the second question
 * — assertive or polite, once something does arrive — and it was being used to
 * answer the first. The rule now lives in one place,
 * /concepts/accessibility#live-regions, and this gate holds the artifact to it.
 *
 * Why this matters beyond tidiness: the most common ERP case is a server
 * re-rendering a form with errors after a failed POST. That error IS new
 * information, but it arrives as a page LOAD, so the mechanism is focus
 * management and a summary the user lands on — /patterns/validation-summary —
 * not a live region. The docs are the recipe consumers copy, so teaching the
 * wrong shape here propagates into real ERP screens.
 *
 * Reads the BUILT html, not the source, for the reason check-notes.mjs gives:
 * the source is Astro, not HTML, so the question is only well posed on the
 * rendered artifact. `<pre>` blocks are stripped before scanning — a code
 * sample SHOULD show `role="alert"`, because the dynamic case is exactly what
 * a sample is teaching. (In practice Astro escapes them so they never match a
 * tag regex; stripping means the gate does not depend on that staying true.)
 *
 * The gate cannot quietly measure nothing: EXCEPTIONS is non-empty, and every
 * entry asserts that its page still HAS an unhidden role="alert". If the scan
 * ever stops matching — a changed dist layout, a regex that no longer fires —
 * those assertions go red rather than the gate reporting a clean zero.
 *
 * @exact — attribute presence on a parsed tag, plus membership in the
 * exception map below. Nothing is recognised or positionally guessed, so it
 * ships no --self-test.
 */
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gate, assertScanned } from './gate-report.mjs';
import { distPages } from './dist-pages.mjs';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/**
 * Pages allowed to ship an unhidden `role="alert"`, each with the reason.
 * An entry is a DECISION, not debt: in a real screen the banner is the result
 * of the user's action and does arrive by swap. The docs can only render the
 * post-action state statically — a limitation of the page, not of the markup a
 * consumer copies. Every entry is spelled out in a comment at the markup too.
 */
const EXCEPTIONS = new Map([
  ['patterns/bulk-actions/index.html',
   'the partial-failure banner is what POST /approve swaps in — the hx-swap-oob sample on the same page is this element'],
  ['patterns/staging/index.html',
   'the counts banner is the response to POST /import action=validate, per the page\'s own data contract'],
]);

const files = await distPages(DIST);
const g = gate('live-regions check', 'live-region claim(s)');
assertScanned(files.length, 'built HTML pages', 'dist held no .html — the gate verified nothing.');

let unhidden = 0;
let hidden = 0;
const seenExceptions = new Set();

for (const page of files) {
  const rel = relative(DIST, page.file);
  /* Blank <pre> to same-length spaces rather than deleting: a code sample is
     allowed to teach the dynamic case, and same-length keeps any offset in a
     failure message pointing at the real line. */
  const html = page.html.replace(/<pre[\s\S]*?<\/pre>/g, (m) => ' '.repeat(m.length));

  for (const m of html.matchAll(/<[a-zA-Z][^>]*\brole="alert"[^>]*>/g)) {
    if (/\bhidden\b/.test(m[0])) { hidden++; continue; }
    unhidden++;
    const allowed = EXCEPTIONS.has(rel);
    if (allowed) seenExceptions.add(rel);
    g.check(
      `${rel}: unhidden role="alert" is a documented exception`,
      allowed,
      `${m[0].slice(0, 90)} — it is present at load, so it announces nothing and interrupts where it does fire. Drop the role and wire the message with aria-describedby (see /concepts/accessibility#live-regions), or add this page to EXCEPTIONS with a reason.`,
    );
  }
}

/* An exception that no longer fires is a stale allowance — the same rot the
   wrong-choice TODO lists are kept honest against. */
for (const rel of EXCEPTIONS.keys()) {
  g.check(`${rel}: its EXCEPTIONS entry still applies`, seenExceptions.has(rel),
    'no unhidden role="alert" here any more — delete the entry from EXCEPTIONS in this file');
}

g.report(`verified across ${files.length} built pages (${unhidden} unhidden role="alert", all ${EXCEPTIONS.size} documented; ${hidden} hidden-until-used)`);
