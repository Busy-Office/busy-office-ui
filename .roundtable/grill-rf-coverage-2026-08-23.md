# Grill: RF coverage — which components does the RF track need? (2026-08-23)

Owner's ask: "before design, please grill the idea — RF coverage, for
components needed … same as other components — pls ensure the
comprehensive design as well." Design-tree grill, rounds per the grilling
skill. Evidence base: local ground truth (below) + the RF-references
research (Zebra / SAP EWM-ITSmobile / Ivanti / Honeywell), report to land
alongside this file.

## Ground truth (verified, not assumed)

- `rf-essentials`: 13 components, 34.1 kB min, Chrome/WebView 108 floor,
  360×640 target. The three RF patterns compose only ~8 of the 13.
- Only RF behavior: `initScanInput()` — keyboard-wedge; already ships a
  `data-scan-status` live-region contract and a `bo:scan` event.
- The RF pages PROMISE offline ("queue scans locally and replay") in
  their state tables; nothing shipped implements or signals it.
- NOT in the profile today: progress, stepper, kbd, toast, segmented,
  icon. `bo-btn-group` lives in button.css (which IS in the profile).
- `alert` carries `bo-toast-in` (motion-token entrance) inside the
  profile already — a scan-feedback flash has raw material.

## Round 1 — settled 2026-08-23 (owner: proceed on recommendations)

- **Q1 · Workflow scope** → target the canonical WMS six (receive,
  putaway, pick, count, pack, ship), FILTERED by the reference evidence:
  only workflows the references agree recur earn a pattern (the Slice
  121 bar). Picking is the known first gap.
- **Q2 · Doctrine boundary** → framework ships VISUALS + CONTRACTS only:
  the sync/queue signal surface and documented contracts — never the
  queue engine, audio, or scanner SDKs. (Also serves mobile-audit
  candidate #1 with one design.)
- **Q3 · New components vs settings** → settings on the existing 13
  first; a new component only on measured failure to compose. Binding
  precedents: `data-density="spacious"` IS the warehouse variant; the
  numeric-family grill refused `--large`.
- **Q4 · Comprehensive-design bar** → every outcome carries the FULL
  recipe (docs page + wrong-choice clause, DSA-scored, gates, two-channel
  states, RF-floor-guarded CSS) **and** the rf-essentials profile gains a
  stated SIZE BUDGET with the gzip-tolerance rule, so RF growth is gated
  like the main bundle.
- **Q5 · Camera scope** → folded in as a boundary item: wedge is the RF
  hardware path (shipped); camera-barcode is documented as the
  consumer-phone fallback RECIPE on the RF pages — not a component.
- **Q6 · Offline signal placement** → one named slot in the shell/frame,
  not per-screen chrome (the Dynamics Field Service evidence).

## Round 2 — OPEN (fires when the reference report lands)

Per-element verdicts to test, each against Q3's compose-first rule:

| candidate element | compose material in-profile today | prior |
|---|---|---|
| scan-result feedback (visible flash + live region) | `alert` (+ its in-profile `bo-toast-in`), `data-scan-status` contract already in scan-input | compose |
| verification / check-digit field | `input--code` + a compare contract | compose |
| exception / function-key bar | `bo-btn-group` (in profile via button.css) | compose |
| progress-through-task ("line 3 of 12") | `progress` and `stepper` are OUT of profile; `kv`/`badge` are in | open — size delta vs text-only |
| pick-quantity confirm w/ short-pick reasons | `quantity` + `select`/`btn-group` | compose |
| tote / license-plate entry | `input--code` + scan-input | compose |
| offline / queue badge | `badge` + the Q6 slot | compose (signal only) |
| numeric keypad for gloved hands | nothing (no keypad component) | open — likely refuse: `inputmode` summons the device keypad; a custom keypad is device-app territory |

Round 2 asks the owner: the workflow-pattern shortlist (per evidence),
the per-element verdicts above where "open", and the profile size budget
number.
