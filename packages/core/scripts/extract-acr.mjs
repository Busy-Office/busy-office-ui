// Generate dist/acr.json — a VPAT-2.5-shaped Accessibility Conformance
// Report: one row per applicable WCAG 2.2 A/AA success criterion. Unlike
// api.json/events.json/keymap.json (structural facts pulled straight from
// source), several rows here need a criterion-specific EVALUATOR — this file
// IS the mapping from "what WCAG asks" to "which shipped fact answers it".
// The criteria list and per-criterion prose are authored (a VPAT is always
// partly narrative — that's normal practice, not a shortcut); what's NOT
// hand-typed is the evidence: every number quoted in a remark is pulled live
// from the same dist/*.json the other gates already produce, and the build
// FAILS if a remark's evidence doesn't match current numbers or names a
// component that doesn't exist — so the report can't quietly go stale.
//
// Verdicts (fixed vocabulary, matches the Slice 15 Accept criteria):
//   Supports              — automated evidence backs the claim directly.
//   Partially Supports     — part of the criterion is gated and part is not,
//                            and the ungated part is the FRAMEWORK's own gap,
//                            not the adopter's. A recognised VPAT 2.x level;
//                            added 374.6 because 1.4.11 had nowhere honest to
//                            land. Conditional-on-adopter would have blamed
//                            the customer for a gap in our token values and
//                            our gate; Not Evaluated would have thrown away
//                            real evidence that does run every build. The
//                            remark must NAME the ungated part.
//   Conditional-on-adopter — the framework provides the mechanism; keeping
//                            the guarantee true requires the adopter's own
//                            markup/content (documented in "Framework's job
//                            vs yours" on the accessibility concept page).
//   Not Evaluated          — needs a human/AT pass this environment can't
//                            perform (screen-reader verbalization, visual
//                            focus-order judgment); never claimed as Supports.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = (f) => JSON.parse(readFileSync(join(root, 'dist', f), 'utf8'));

const api = dist('api.json');
const contrast = dist('contrast.json');
const behaviors = dist('behaviors.json');
const keymap = dist('keymap.json');
const events = dist('events.json');
const componentNames = new Set(Object.keys(api.components));

/* Components with an explicit forced-colors rule — read from api.json, which
   PARSES the CSS (`extract-api.mjs` tests an at-rule's params against
   /forced-colors\s*:\s*active/), rather than scanned again here.

   This used to be its own substring scan, `.includes('forced-colors')` over
   each component's CSS, and it OVERCOUNTED BY FIVE: 23 against the parsed 18.
   All five matched a COMMENT rather than a rule — alert, approval-workflow,
   date, file-upload, richtext — and `date/date.css` is the inversion that
   gives the whole class away, because the sentence it matched on says the
   block has "no forced-colors rule and no density awareness". The claim
   published on /reference/acr was therefore built partly out of components
   documenting that they do NOT do the thing being counted.

   The comment this replaces named the exact hazard — dist CSS is minified and
   "the @media block is easy to lose in a string scan" — identified the risk,
   and then used a string scan anyway. And the framework already had the right
   answer: /concepts/accessibility renders api.json's parsed 18 while
   /reference/acr rendered 23, so two published pages disagreed about one fact.
   A second mechanism for a fact the build already derives is the thing to
   delete, not the regex to patch. */
const forcedColorsComponents = Object.entries(api.components)
  .filter(([, v]) => v.forcedColors)
  .map(([name]) => name)
  .sort();

/* SC 2.5.7 (Dragging Movements): the inventory of AUTHOR-DEFINED dragging in
   the shipped JS, derived here rather than asserted. Scanning source, not
   dist, for the reason the forced-colors scan above gives.

   The scan shortlists by token and then REVIEWS, because a token cannot judge
   intent — `combobox.ts` listens for `pointermove` to keep the hovered option
   in sync with the keyboard-active one, which moves nothing. Every shortlisted
   module must therefore be either a recorded drag surface or a recorded
   non-drag match WITH a reason. A module that is neither throws, so a new drag
   handler cannot quietly widen this claim: it either changes the inventory or
   fails the build. That is the property this row rests on.

   Identity is the SOURCE-RELATIVE PATH, never the basename. Reducing to a
   basename let an unreviewed module inherit an exemption belonging to a
   different file: a `review-fixture/combobox.ts` with a real `dragstart`
   listener matched the real `behaviors/combobox.ts` non-drag reason and the
   generator exited 0, still reporting one surface. Found by review, and the
   collision case is proved rejected rather than argued.

   Matching a quoted event name anywhere (not only inside `addEventListener(`)
   is deliberate: this repo registers listeners from arrays of literals
   (`row-edit.ts`, `table-sum.ts`), and an anchored regex misses both that form
   and `setAttribute('draggable', …)`. */
const DRAG_SCAN_CMD =
  'grep -rlE "[\'\\"](drag(start|enter|over|leave|end)?|drop|pointer(down|move|up|cancel)|mouse(down|move|up)|touch(start|move|end)|draggable)[\'\\"]|\\b(setPointerCapture|releasePointerCapture|DataTransfer|dataTransfer)\\b" packages/core/src/js';
const DRAG_TOKENS = /['"](drag(start|enter|over|leave|end)?|drop|pointer(down|move|up|cancel)|mouse(down|move|up)|touch(start|move|end)|draggable)['"]|\b(setPointerCapture|releasePointerCapture|DataTransfer|dataTransfer)\b/;

/* Shortlisted but NOT dragging. Each entry is a decision with its reason, the
   same shape as check-live-regions' exception map. */
const NON_DRAG_REVIEWED = new Map([
  ['behaviors/combobox.ts', 'pointermove keeps the pointer-hovered option in sync with the keyboard-active one, and mousedown on an option is cancelled only so focus stays in the field (375.10) — nothing is moved, and there is no dragstart or pointer capture'],
  ['behaviors/context-menu.ts', 'pointerdown/pointerup only record whether a press is in progress, so a menu asked for mid-press opens after the release (377.1) — nothing follows the pointer and nothing is moved'],
]);

/* A drag surface may only be claimed under 2.5.7 if its function is also
   reachable WITHOUT dragging, by a single pointer. Keyboard operability is a
   different criterion and does not satisfy this one. */
const NON_DRAG_ALTERNATIVE = new Map([
  ['behaviors/file-dropzone.ts', 'the whole visible `.bo-file-dropzone` is a <label> wrapping the file input, so a single click anywhere in the box opens the picker — native label forwarding, no JS, no path along a screen'],
]);

const jsDir = join(root, 'src/js');
const jsFiles = [];
(function walkJs(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkJs(full);
    else if (entry.endsWith('.ts')) jsFiles.push(full);
  }
})(jsDir);
const dragShortlist = jsFiles
  .filter((f) => DRAG_TOKENS.test(readFileSync(f, 'utf8')))
  .map((f) => f.slice(jsDir.length + 1))
  .sort();
if (!dragShortlist.length)
  throw new Error('ACR 2.5.7: the drag scan over src/js matched nothing — the pattern or the path is wrong, and a zero here would silently claim there is no dragging at all.');
const dragSurfaces = dragShortlist.filter((f) => !NON_DRAG_REVIEWED.has(f));
const unexplained = dragSurfaces.filter((f) => !NON_DRAG_ALTERNATIVE.has(f));
if (unexplained.length)
  throw new Error(
    `ACR 2.5.7: ${unexplained.join(', ')} match the drag scan but have no recorded non-drag alternative. ` +
      'Either record the single-pointer alternative in NON_DRAG_ALTERNATIVE, or record the match in ' +
      'NON_DRAG_REVIEWED with the reason it is not dragging. This row may not be generated while a ' +
      'drag surface is unaccounted for.',
  );
const dragScanned = jsFiles.length;

/* SC 4.1.2: which behaviours actually WRITE an ARIA state, derived the same
   way the drag inventory is. The row used to quote `behaviors.initCount` —
   the total — as though every shipped behaviour synced ARIA, and named
   `aria-sort` among the attributes it keeps in sync. `aria-sort` appears
   nowhere in src/js, and check-claims.mjs asserts the OPPOSITE property as a
   documented behaviour ("the sort header is inert without app code"), pressing
   Enter and checking the attribute does not move. So the report cited as
   evidence a state a green gate certifies is not managed.

   Comments are stripped before matching, for the reason the forced-colors
   count above records: a substring scan counts prose describing the thing. */
/* Scoped to src/js/behaviors, and the denominator is RECONCILED against
   behaviors.json rather than assumed. `jsFiles` walks all of src/js — 31
   modules, of which 26 are behaviours — so counting against it would have
   said "N of the 26 behaviors" while N was drawn from a population of 31.
   The first run of this scan did exactly that and pulled in `reveal.ts`,
   which is not a behaviour. Mixing two populations in one fraction is the
   defect this row is being rewritten to fix; it does not get to reappear in
   the fix. */
const uncomment = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const ARIA_WRITE = /\b(?:setAttribute|removeAttribute|toggleAttribute)\s*\(\s*['"`](aria-[a-z]+)/g;
const behaviorFiles = jsFiles.filter((f) => /[\\/]behaviors[\\/][^\\/]+\.ts$/.test(f));
if (behaviorFiles.length !== behaviors.initCount) {
  throw new Error(`ACR: found ${behaviorFiles.length} behaviour module(s) but behaviors.json counts ${behaviors.initCount} — the ARIA fraction would quote two different populations`);
}
const ariaSetterFiles = behaviorFiles.filter((f) => ARIA_WRITE.test(uncomment(readFileSync(f, 'utf8'))) && (ARIA_WRITE.lastIndex = 0) === 0);
const ariaAttrsManaged = [...new Set(
  ariaSetterFiles.flatMap((f) => [...uncomment(readFileSync(f, 'utf8')).matchAll(ARIA_WRITE)].map((m) => m[1])),
)].sort();

const contrastPassCount = Object.values(contrast.themes).flat().filter((p) => p.pass).length;
const contrastTotal = Object.values(contrast.themes).flat().length;
/* The BRAND readings were computed every build and quoted by nothing: 1.4.3
   said "both themes plus the brand preset" while counting `contrast.themes`
   alone, so the row was singular about six presets and understated its own
   coverage sevenfold. Derived here so the sentence moves when PAIRS does. */
const brandPairs = Object.values(contrast.brands ?? {}).flat();
const brandPassCount = brandPairs.filter((p) => p.pass).length;
const brandPresetCount = new Set(Object.keys(contrast.brands ?? {}).map((k) => k.replace(/-(light|dark)$/, ''))).size;
/* Non-text pairs are the ones gated at 3:1 rather than 4.5 — the split 1.4.11
   turns on. Interpolated rather than typed, because a bare literal is exactly
   what let that row's claim drift out of agreement with the gate. */
const nonTextPairs = Object.values(contrast.themes).flat().filter((p) => p.threshold === 3);
const nonTextPerTheme = nonTextPairs.length / Object.keys(contrast.themes).length;
const pairsPerTheme = contrastTotal / Object.keys(contrast.themes).length;
/* 1.4.11 and 2.4.7 are built from what check-contrast.mjs PUBLISHES (roadmap
   377.8), never from literals. Both rows used to hand-type their figures
   ("1.34-1.70:1", "2.99:1 on bg-muted under forest") and one claim that 374.7
   had already made false ("cannot see a border-color at all"). The gate now
   writes its edge verdicts, each debt pairing's measured ratios in every theme
   and brand, and the focus ring's ratio on each ground it paints on. A token
   change moves the published remark, and a missing section fails this build. */
const edges = contrast.edges;
const ring = contrast.focusRing;
if (!edges?.todo || !ring?.readings?.length) {
  throw new Error('ACR: contrast.json has no edges/focusRing section. Run check-contrast.mjs first; 1.4.11 and 2.4.7 are built from it');
}
const short = (tok) => tok.replace('--bo-color-', '');
const span = (rs) => {
  const v = rs.map((r) => r.ratio);
  const lo = Math.min(...v).toFixed(2);
  const hi = Math.max(...v).toFixed(2);
  return lo === hi ? `${lo}:1` : `${lo}-${hi}:1`;
};
const ringUnder = ring.readings.filter((r) => r.ratio < 3);
const ringLow = ring.readings.reduce((a, b) => (b.ratio < a.ratio ? b : a));
/* `outline: none` anywhere in the shipped source would suppress the ring the
   2.4.7 row describes. Counted here on every build instead of asserted. */
const SRC_CSS = join(root, 'src/css');
const walkCss = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walkCss(p) : n.endsWith('.css') ? [p] : [];
});
const outlineNone = walkCss(SRC_CSS)
  .map((f) => (uncomment(readFileSync(f, 'utf8')).match(/outline\s*:\s*(none|0)\s*[;}]/g) ?? []).length)
  .reduce((a, b) => a + b, 0);

const cite = (comp) => {
  if (!componentNames.has(comp)) throw new Error(`ACR cites unknown component "${comp}"`);
  return comp;
};

const CRITERIA = [
  {
    id: '1.1.1', name: 'Non-text Content', level: 'A',
    verdict: 'Conditional-on-adopter',
    remarks: `Icons (${cite('icon')}) are decorative masks — the adopter's visible label carries the meaning, per the documented aria-hidden convention. An icon-only control must supply its own aria-label; the framework cannot author that text.`,
  },
  {
    id: '1.3.1', name: 'Info and Relationships', level: 'A',
    verdict: 'Conditional-on-adopter',
    remarks: `Structure rides on real semantics — native <table>/<dialog>/<details>, ARIA roles/states in markup contracts across ${Object.keys(api.components).length} components. Relationships the adopter supplies (label text, row data) are outside framework control.`,
  },
  {
    id: '1.4.1', name: 'Use of Color', level: 'A',
    verdict: 'Supports',
    remarks: `Two-channel doctrine: every state signal ships a visible non-color cue (glyph, border, position) alongside color. Be precise about what backs that. The forced-colors list below (${forcedColorsComponents.length} of ${Object.keys(api.components).length} components) is parsed from the CSS, and check-forced-colors.mjs verifies each shipped rule's selector still matches real markup and that emulation changes the declared properties — so the rules are proven LIVE rather than merely present. What no gate checks is the doctrine itself: that every state signal carries a non-color channel. That remains a review rule applied per component, not an automated proof, and this row should not be read as one.`,
  },
  {
    id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA',
    verdict: 'Supports',
    remarks: `${contrastPassCount}/${contrastTotal} token pairs pass across both base themes, and a further ${brandPassCount}/${brandPairs.length} across ${brandPresetCount} brand presets x 2 themes — computed from shipped token values on every build (check-contrast.mjs); a failing pair blocks the release. Read the number precisely: of the ${pairsPerTheme} pairs per theme, ${pairsPerTheme - nonTextPerTheme} are text at the 4.5:1 AA floor and ${nonTextPerTheme} are non-text at 3:1 (those are 1.4.11's, not this row's), so this is not ${contrastTotal} readings all tested at 4.5.`,
  },
  {
    id: '1.4.4', name: 'Resize Text', level: 'AA',
    verdict: 'Conditional-on-adopter',
    remarks: 'Sizing uses rem/relative units throughout; the installation skeleton explicitly forbids user-scalable=no. An adopter who hardcodes px or adds that meta tag overrides this.',
  },
  {
    id: '1.4.10', name: 'Reflow', level: 'AA',
    verdict: 'Supports',
    remarks: 'Every docs page is swept in CI at 390px AND at 1432px under 150% browser zoom, measuring the shell scroller rather than the document (a 100dvh shell never grows, so document scrollWidth silently reports nothing). Wide content scrolls inside its own container instead of the page.',
  },
  {
    id: '1.4.11', name: 'Non-text Contrast', level: 'AA',
    verdict: edges.todo.length ? 'Partially Supports' : 'Supports',
    remarks: `${nonTextPerTheme} of the ${pairsPerTheme} gated token pairs per theme are non-text and run in the same contrast.json gate as the text pairs, at 3:1 — so there is no separate, weaker check. Edges are adjudicated on every build (check-contrast.mjs, roadmap 374.7): of the ${edges.seen} edge pairings the component CSS paints, ${edges.gated} are gated at 3:1, ${edges.exempt} are exempt with a stated reason naming the other channel that identifies the element, and ${edges.todo.length} are tracked as debt because the edge is the only non-text identifier and does not meet 3:1${edges.todo.length ? ': ' + edges.todo.map((t) => `${cite(t.component)} (${short(t.fg)} on ${short(t.bg)}): ${t.readings.filter((r) => r.ratio < 3).length} of ${t.readings.length} theme and brand readings under 3:1, spanning ${span(t.readings)}`).join('; ') : ''}. The focus ring is gated on ${ring.gatedOn.map(short).join(' and ')} alone; its other grounds are 2.4.7's row. Tracked as roadmap 374.4. This verdict is computed from that debt list, and it reads Supports when the list is empty.`,
  },
  {
    id: '1.4.12', name: 'Text Spacing', level: 'AA',
    verdict: 'Supports',
    remarks: 'The user spacing override is applied to every docs page at two widths in CI, comparing clipping BEFORE and AFTER, so a deliberate ellipsis is not misreported and real content loss is. Heights are minimums, never fixed, for this reason.',
  },
  {
    id: '1.4.13', name: 'Content on Hover or Focus', level: 'AA',
    verdict: 'Not Evaluated',
    remarks: `Popover-based surfaces (${cite('combobox')}, ${cite('dropdown')}, ${cite('dialog')}) dismiss via native popover/Esc, which is dismissible/hoverable by construction — but "persistent until dismissed or invalid" per-surface has not had a dedicated manual pass.`,
  },
  {
    id: '2.1.1', name: 'Keyboard', level: 'A',
    verdict: 'Supports',
    remarks: `${keymap.behaviors.length} behaviors ship documented, generated keyboard support (${keymap.behaviors.map((b) => b.name).join(', ')}); everything else is native (a plain input, a native dialog's own focus trap) or has no keyboard surface — see the generated table on JS behaviors.`,
  },
  {
    id: '2.1.2', name: 'No Keyboard Trap', level: 'A',
    verdict: 'Supports',
    remarks: `${cite('dialog')} uses a real focus trap (Tab/Shift+Tab cycle, Escape closes via native showModal()) — never an unclosable trap. ${cite('data-table')}'s grid-nav Escape returns focus from a cell's widget to the cell.`,
  },
  {
    id: '2.4.3', name: 'Focus Order', level: 'A',
    verdict: 'Not Evaluated',
    remarks: `DOM order matches visual order everywhere audited manually this session, but a systematic focus-order sweep across all components has not been performed. ${cite('data-table')}'s row-edit Save/Cancel move focus to the row's first field before hiding themselves (an adversarial-review find: focus previously dropped to <body> mid-table).`,
  },
  {
    id: '2.4.7', name: 'Focus Visible', level: 'AA',
    verdict: ringUnder.length || outlineNone ? 'Partially Supports' : 'Supports',
    remarks: `A single :focus-visible ring token (${ring.token}) is used framework-wide${outlineNone ? `, but ${outlineNone} \`outline: none\` declaration(s) in packages/core/src/css can suppress it` : ` and is never suppressed: 0 \`outline: none\` in packages/core/src/css, counted on every build (not gated)`}. Its contrast FAILS the build only on ${ring.gatedOn.map(short).join(' and ')}; the universal ring rule uses outline-offset, so the ring paints on whatever sits behind the control. Measured on every build against ${ring.grounds.length} grounds (${ring.grounds.map(short).join(', ')}) in both themes and every brand preset, ${ring.readings.length} readings: the lowest is ${ringLow.ratio}:1 (${ringLow.where}, on ${short(ringLow.ground)})${ringUnder.length ? `, and ${ringUnder.length} reading(s) fall under the 3:1 floor: ${ringUnder.map((r) => `${r.ratio}:1 on ${short(r.ground)} (${r.where})`).join(', ')}` : ', and none falls under 3:1'}. Same root cause as 1.4.11 (roadmap 374.4). This verdict is computed from those readings.`,
  },
  {
    id: '2.4.11', name: 'Focus Not Obscured (Minimum)', level: 'AA',
    verdict: 'Supports',
    remarks: 'The sticky action bar is the one surface that could cover a focused control; CI focuses every field on the detail-form pattern and asserts none intersects the bar. Executed, not reasoned about.',
  },
  {
    id: '2.5.7', name: 'Dragging Movements', level: 'AA',
    verdict: 'Conditional-on-adopter',
    remarks: `Derived, not asserted: a scan of the ${dragScanned} shipped source modules under packages/core/src/js shortlists ${dragShortlist.length} (${dragShortlist.join(', ')}); after review the author-defined dragging surface is ${dragSurfaces.length} — ${dragSurfaces.join(', ')} — and ${[...NON_DRAG_REVIEWED.keys()].join(', ')} ${NON_DRAG_REVIEWED.size === 1 ? 'is a non-drag match' : 'are non-drag matches'} (${[...NON_DRAG_REVIEWED.values()].join('; ')}). Reproduce with: ${DRAG_SCAN_CMD}. Each drag surface carries a single-pointer alternative that does not require dragging: ${[...NON_DRAG_ALTERNATIVE.entries()].map(([f, why]) => `${f} — ${why}`).join('; ')}. The framework itself therefore offers no function that REQUIRES a dragging movement. Two limits are part of this claim, not footnotes to it: the scan reads literal event names, so a fully computed listener name, a drag arriving through a dependency, or drag written in an adopter's own screens is invisible to it; and keyboard operability is NOT evidence for this criterion — it is 2.1.1, and the alternative cited above is a pointer path. Adopters own any dragging they add themselves, and the non-drag equivalent for it.`,
  },
  {
    id: '2.5.8', name: 'Target Size (Minimum)', level: 'AA',
    verdict: 'Supports',
    remarks: 'Conformance here rides on the SPACING EXCEPTION, not on a 24px floor: checkboxes, radios, the tag-input remove button and the data-table sort button are 16-18px, and CI runs the actual spec test (a 24px circle centred on each undersized target must not reach another target) across seven control-dense pages in all three densities. Adopters who crowd controls tighter than 24px between centres break this — the framework cannot guarantee it for markup it did not author.',
  },
  {
    id: '3.2.1', name: 'On Focus', level: 'A',
    verdict: 'Not Evaluated',
    remarks: `Reads true on inspection — no shipped behavior appears to trigger navigation or a context change purely on focus, and the state changes (open, filter, activate) are click/keydown-gated. But it is prose: no gate asserts it, and this file's own methodology says rows with no automated evidence are Not Evaluated, never inferred as Supports. Applying that rule to this row rather than exempting it. The check it wants is mechanical — focus every interactive element on the built pages and assert no navigation, no popover open and no ${events.count}-strong intent event fires — so this returns to Supports when that exists, not on re-inspection.`,
  },
  {
    id: '3.3.1', name: 'Error Identification', level: 'A',
    verdict: 'Conditional-on-adopter',
    remarks: `The ${cite('form')} error contract (aria-invalid + aria-describedby + a message element, role="alert" if dynamic) is documented and demoed at both field and cell granularity (editable-grid pattern) — but the adopter writes the actual error text and wires aria-invalid from their own validation.`,
  },
  {
    id: '3.3.2', name: 'Labels or Instructions', level: 'A',
    verdict: 'Conditional-on-adopter',
    remarks: 'Every form field demo shows a real <label for>; the framework enforces nothing at build time that would catch an adopter shipping an unlabeled input (no axe-in-CI gate on consumer apps, only on these docs).',
  },
  {
    id: '4.1.2', name: 'Name, Role, Value', level: 'A',
    verdict: 'Supports',
    remarks: `${ariaSetterFiles.length} of the ${behaviors.initCount} shipped behaviors write ARIA state in response to interaction, and the attributes they manage are derived from source rather than listed by hand: ${ariaAttrsManaged.join(', ')}. The other ${behaviors.initCount - ariaSetterFiles.length} set none, and several are correct that way — dialog uses native showModal(), dropdown the native popover, so the platform owns the state. Two limits are part of this claim: the scan reads literal setAttribute calls, so state written through a computed attribute name is invisible to it; and aria-sort is deliberately NOT in the list above — the data-table sort header is inert without app code, which check-claims.mjs asserts by pressing Enter and confirming the attribute does not move. ${events.count} intent events and the generated event/keymap tables exist so this row has evidence instead of prose.`,
  },
  {
    id: '4.1.3', name: 'Status Messages', level: 'AA',
    verdict: 'Supports',
    remarks: `Live-region behaviors ship for the cases that need one without a focus change: ${cite('data-table')} selection count and RF-scanner confirmation (initScanInput, JS-only — no CSS surface of its own), ${cite('skeleton')} loading regions (role="status").`,
  },
];

/* Consistency gate. `length < 1` was the only assertion here and it could not
   fire: the scan it guarded returned 23 of 40, so "did it return nothing" was
   true of no reachable state while the number was wrong by five. A floor that
   only catches a total wipe-out is not a reconciliation.

   RECONCILE AGAINST THE SOURCE, NOT AGAINST THE ARGUMENT. The first version of
   this check compared the list to `api.components[*].forcedColors` — which is
   where the list is built from, so it agreed with itself by construction.
   Red-proving it by flipping a component's flag in api.json produced a PASS,
   because both sides moved together. That is the exact defect CLAUDE.md names:
   a reconciliation that cannot see past its own caller is a detector that
   cannot fail.

   So re-derive from the CSS on disk — the thing api.json is itself a mirror
   of — and require the two to agree. Now a wrong flag in api.json, a parser
   change in extract-api.mjs, or a rule added to a stylesheet without a rebuild
   all fail here by name. Comments cannot fool it: the at-rule form is matched,
   which is what the deleted substring scan got wrong. */
const cssForcedColors = readdirSync(join(root, 'src/css/components'))
  .filter((name) => statSync(join(root, 'src/css/components', name)).isDirectory())
  .filter((name) => readdirSync(join(root, 'src/css/components', name))
    .filter((f) => f.endsWith('.css'))
    .some((f) => /@media[^{]*forced-colors\s*:\s*active/
      .test(readFileSync(join(root, 'src/css/components', name, f), 'utf8'))))
  .sort();
const fcDisagree = [
  ...cssForcedColors.filter((n) => !forcedColorsComponents.includes(n)).map((n) => `${n} (in CSS, not in api.json)`),
  ...forcedColorsComponents.filter((n) => !cssForcedColors.includes(n)).map((n) => `${n} (in api.json, not in CSS)`),
];
if (fcDisagree.length) {
  throw new Error(`ACR: forced-colors disagrees with the stylesheets — ${fcDisagree.join('; ')}. api.json is a mirror of src/css; one of them is stale.`);
}
const notAComponent = forcedColorsComponents.filter((n) => !componentNames.has(n));
if (notAComponent.length) throw new Error(`ACR: forced-colors list names non-component(s): ${notAComponent.join(', ')}`);
if (forcedColorsComponents.length < 1) throw new Error('ACR: forced-colors component list is empty — check extract-api.mjs');

const report = {
  generated: 'extract-acr.mjs — do not hand-edit',
  standard: 'WCAG 2.2, Level A + AA (applicable subset for a CSS/JS UI toolkit — criteria with no toolkit surface, e.g. captions/audio, are omitted, not silently marked Supports)',
  methodology: 'Automated evidence (contrast, keyboard-map, event/ARIA generation, forced-colors emulation) is cited by number and regenerates every build; rows with no automated evidence are Not Evaluated, never inferred as Supports.',
  forcedColorsComponents,
  dragSurfaces,
  dragShortlist,
  dragScanCommand: DRAG_SCAN_CMD,
  contrastPassCount,
  contrastTotal,
  criteria: CRITERIA,
};

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/acr.json'), JSON.stringify(report, null, 2) + '\n');
/* Tally every verdict PRESENT rather than the three that were known when this
   line was written — it printed 19 of 21 the moment a fourth verdict existed,
   and a summary that silently drops a row is the failure this file's own
   methodology line is about. The total is printed so the parts can be checked
   against it by eye. */
const verdictTally = CRITERIA.reduce((acc, c) => ((acc[c.verdict] = (acc[c.verdict] ?? 0) + 1), acc), {});
const tallied = Object.values(verdictTally).reduce((n, v) => n + v, 0);
if (tallied !== CRITERIA.length) throw new Error(`ACR: verdict tally ${tallied} != ${CRITERIA.length} criteria`);
console.log(`acr.json generated — ${CRITERIA.length} criteria (${Object.entries(verdictTally).sort((a, b) => b[1] - a[1]).map(([v, n]) => `${n} ${v}`).join(', ')})`);
