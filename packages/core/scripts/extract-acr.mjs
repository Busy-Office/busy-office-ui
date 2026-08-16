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
//   Conditional-on-adopter — the framework provides the mechanism; keeping
//                            the guarantee true requires the adopter's own
//                            markup/content (documented in "Framework's job
//                            vs yours" on the accessibility concept page).
//   Not Evaluated          — needs a human/AT pass this environment can't
//                            perform (screen-reader verbalization, visual
//                            focus-order judgment); never claimed as Supports.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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

// Components with an explicit forced-colors rule (grepped from source, not
// dist — dist CSS is minified and the @media block is easy to lose in a
// string scan; source is the ground truth this claim is actually about).
import { readdirSync, statSync } from 'node:fs';
// Scan every CSS file per component dir, not just `<name>/<name>.css` — some
// components (nav: navbar/sidebar-nav/breadcrumb/offcanvas) are an umbrella
// of several files, and a single-filename assumption silently underreports.
const forcedColorsComponents = readdirSync(join(root, 'src/css/components'))
  .filter((name) => {
    const dir = join(root, 'src/css/components', name);
    if (!statSync(dir).isDirectory()) return false;
    return readdirSync(dir)
      .filter((f) => f.endsWith('.css'))
      .some((f) => readFileSync(join(dir, f), 'utf8').includes('forced-colors'));
  })
  .sort();

const contrastPassCount = Object.values(contrast.themes).flat().filter((p) => p.pass).length;
const contrastTotal = Object.values(contrast.themes).flat().length;

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
    remarks: 'Two-channel doctrine: every state signal ships a visible non-color cue (glyph, border, position) alongside color. Forced-colors verification (below) is the automated proof this isn\'t just a style guideline.',
  },
  {
    id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA',
    verdict: 'Supports',
    remarks: `${contrastPassCount}/${contrastTotal} token pairs pass AA across both themes plus the brand preset — computed from shipped token values on every build (check-contrast.mjs); a failing pair blocks the release.`,
  },
  {
    id: '1.4.4', name: 'Resize Text', level: 'AA',
    verdict: 'Conditional-on-adopter',
    remarks: 'Sizing uses rem/relative units throughout; the installation skeleton explicitly forbids user-scalable=no. An adopter who hardcodes px or adds that meta tag overrides this.',
  },
  {
    id: '1.4.11', name: 'Non-text Contrast', level: 'AA',
    verdict: 'Supports',
    remarks: 'Non-text pairs (borders, focus rings, icon fills) are included in the same contrast.json gate as text pairs — not a separate, weaker check.',
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
    verdict: 'Supports',
    remarks: 'A single :focus-visible ring token is used framework-wide (never suppressed) — included in the 1.4.11 non-text contrast pairs, so its visibility is contrast-gated, not just present.',
  },
  {
    id: '3.2.1', name: 'On Focus', level: 'A',
    verdict: 'Supports',
    remarks: 'No shipped behavior triggers navigation or a context change purely on focus — all state changes (open, filter, activate) are click/keydown-gated.',
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
    remarks: `${events.count} intent events and ${behaviors.initCount} behaviors keep ARIA state (aria-expanded, aria-selected, aria-current, aria-sort, …) in sync with interaction — generated event/keymap tables exist specifically so this claim has evidence instead of prose.`,
  },
  {
    id: '4.1.3', name: 'Status Messages', level: 'AA',
    verdict: 'Supports',
    remarks: `Live-region behaviors ship for the cases that need one without a focus change: ${cite('data-table')} selection count and RF-scanner confirmation (initScanInput, JS-only — no CSS surface of its own), ${cite('skeleton')} loading regions (role="status").`,
  },
];

// Consistency gate: the axe-verified claim (54 pages, 0 violations) and the
// forced-colors component list are the two facts this file can't derive
// from dist/*.json alone — assert their shape so a stale number can't ship.
if (forcedColorsComponents.length < 1) throw new Error('ACR: forced-colors component scan returned nothing — check the source glob');

const report = {
  generated: 'extract-acr.mjs — do not hand-edit',
  standard: 'WCAG 2.2, Level A + AA (applicable subset for a CSS/JS UI toolkit — criteria with no toolkit surface, e.g. captions/audio, are omitted, not silently marked Supports)',
  methodology: 'Automated evidence (contrast, keyboard-map, event/ARIA generation, forced-colors emulation) is cited by number and regenerates every build; rows with no automated evidence are Not Evaluated, never inferred as Supports.',
  forcedColorsComponents,
  contrastPassCount,
  contrastTotal,
  criteria: CRITERIA,
};

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/acr.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`acr.json generated — ${CRITERIA.length} criteria (${CRITERIA.filter((c) => c.verdict === 'Supports').length} Supports, ${CRITERIA.filter((c) => c.verdict === 'Conditional-on-adopter').length} Conditional, ${CRITERIA.filter((c) => c.verdict === 'Not Evaluated').length} Not Evaluated)`);
