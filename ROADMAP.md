# busy-office-ui — Roadmap

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern CSS,
generated-and-verified docs. This file is the long-term plan; per-slice detail and the
design-review trail live in `.roundtable/`, and every breaking change is in
`CHANGELOG.md`.

## Objective — the direction (set by the owner, 2026-08-16)

**Make complex ERP UI simple: the framework absorbs the hard problems so
the app doesn't have to.** Every proposal to add, change, or remove
anything passes the three principles below — each carries explicit
**accept / refuse / rethink** tests so decisions are made against the
direction, not against momentum. Anything that fails a test is refused
outright or sent to the design panel; "it would be useful" is never
sufficient on its own.

### 1. Simplicity — simple is the best; make the complex simple

The framework's job is to take on genuinely hard problems (accessibility
contracts, precision, density, theming, focus, save semantics) and hand
back something that reads obvious. Power that complicates the consumer's
markup or mental model is failure, not capability.

- **Accept** when it lets a consumer *delete* code, markup, or decisions.
- **Refuse** when using it correctly requires understanding more than its
  own docs page, or when its explanation needs a caveat list to be honest.
- **Rethink** when a docs explanation keeps growing to cover a surface —
  the fix is simplifying the thing, never the prose. (Precedent: the
  lossless-reformat fix — the simple contract "never change the number"
  replaced a growing pile of rounding caveats.)

### 2. Less for more — fewer options, more possibility

One component, many settings. Composition over variants. Native elements
over invented widgets. Every new option must open more use-cases than the
one that asked for it.

- **Accept** when one general mechanism replaces N specific asks
  (precedent: `data-density="spacious"` IS the warehouse-floor variant —
  no `--large` modifier ever shipped).
- **Refuse** a modifier/part/attribute that serves exactly one scenario,
  and any second way to do something that already works.
- **Rethink** when two surfaces start growing toward each other — merge
  them or extract the shared primitive (precedent: the `decimal-input`
  util under money + quantity).

### 3. Reusability is the key

Nothing ships for one screen. A piece earns its place by surviving ≥2
real, independent compositions (the same bar behaviors already meet
before being called stable). Prefer the primitive that composes over the
composite that locks.

- **Accept** when it works, unchanged, in a context it wasn't designed
  for.
- **Refuse** when it embeds app/domain decisions — data, workflow,
  policy stay with the consumer ("framework does visuals, you do the
  data"); the rare deliberate exception is named, documented, and always
  overridable (precedent: the currency/unit tables).
- **Rethink** when reuse requires copy-paste-modify — extract the
  reusable core instead of shipping the copy.

**Precedence (owner call, 2026-08-21): suitability beats reuse at the
point of use.** Reusability decides what SHIPS in the framework;
context-suitability decides what a screen USES. When they conflict — a
reusable control that is wrong for the context (steppers in a dense
line grid; the joined money widget crammed into a table cell) — the
suitable design wins, because an unsuitable design damages the UX no
matter how reusable it is. The resolution is always to pick or build
the suitable REUSABLE primitive (the field matrix on
`/concepts/design-language` says which, per field type × context),
never a one-off.

### 4. Design the decision, not the screen (added 2026-08-19, owner input — the Ive filter)

A screen exists to serve **one decision its user must make**, and everything on
it is ranked by that decision. "The payroll manager needs to know whether
payroll is safe to release" is a design brief; "we need a payroll screen" is
not. Complexity lives under the interface, never in the user's mental model —
the system may run fifty validations, the user reads *Ready · 428 employees ·
2 exceptions*.

- **Accept** when the screen answers, in order, *what is this / what should I
  look at / what should I do* — and the primary action is singular and obvious.
  (Measured 2026-08-19: 18 of 19 pattern screens already have ≤1 visually
  primary action; the wizard's Next/Submit pair is the legitimate exception —
  never both visible.)
- **Refuse** any element whose removal does not materially reduce the user's
  ability to decide — and any state text that names the mechanism instead of
  the meaning (`Processing Status: 04` is refused; "Ready to release" with
  detail underneath is the shape). If an element needs a long explanation to
  justify existing, that is the signal it should not.
- **Rethink** when a screen accumulates a second primary action or a second
  audience — it is usually two decisions sharing one page, and the fix is a
  split, not a bigger toolbar.

**The screen's decision lives inside a journey** (owner input, 2026-08-20 —
the full Ive document's §4): a decision is one step of Request → Validation →
Exception → Resolution → Approval → Execution → Confirmation, and a beautiful
screen inside a terrible workflow is still a bad product. The unit of design
is the journey; screens are its steps.

- **Accept** when a screen's exits land the user at the next decision with
  context intact — the approval screen's "done" IS the confirmation state,
  not a dead end the user navigates away from blind (precedent: po-app's
  edit → 302 → record-with-new-values, and the mass-change 422 that
  re-renders in place instead of losing the user's selection).
- **Refuse** a screen designed in isolation — one whose entry assumes state
  no prior step produces, or whose exit drops the user somewhere no next
  step picks up. If the pattern page cannot say which step precedes and
  follows it, that's the signal.
- **Rethink** when a journey needs a screen that exists only to bridge two
  others (a "now click here to continue" page) — the fix is merging the
  handoff into an exit, not adding a step.

The full 10-question version of this filter runs on demand as `/design-grill`
against a named screen — or against a whole journey as
`/design-grill flow:<a> > <b> > <c>`; this section is the every-wake
distillation.

**References are floors, not ceilings** (owner, 2026-08-23, during the
RF-coverage grill): research citations prove a need RECURS — they never
define the solution. Parity with SAP/Fiori/Zebra/anyone is not an Accept
criterion; every design must name what it does BETTER than the reference
it cites (typically: two-channel state, no-JS floor, reduced-motion and
forced-colors correctness, honest docs, composition over new surface). A
proposal that cannot name its improvement is copying, and gets rethought.

**How it binds the loops:** Roadmap triage tests every new ask against
these before queuing (refuse/rethink are valid triage outcomes, recorded
with the reason); the design panel grills slices against them; removals
face the same tests as additions — deleting a surface consumers compose
against is a Breaking-entry decision, not a tidy-up.

## CI strategy — measured, and why branches are not the lever (2026-08-24)

Owner asked whether a dev/main split should manage different CI. **It should
not, and the timing data says why: CI was slow for a structural reason, not a
branching one.**

Measured before changing anything: ~12.4 min of serial steps, lopsided —
scroll 216s (29% of the run), claims 104s, axe 68s, layout 65s, container 59s.
Eleven browser gates each launched a browser and walked the same 121 built
pages.

Fixed structurally, **without touching branches**: sharding the browser gates
into five parallel jobs took wall clock to **184s**. Plus `paths-ignore` for
narrative-only commits (8 of the last 30 touched only `.roundtable/**` and
`STATUS.md`) and `cancel-in-progress` for superseded pushes. Roughly **4x**,
with no change to what any gate asserts.

**Why NOT tier gates by branch.** This file's own doctrine already answers it:
*a gate that only runs in CI is not known to work.* The corollary is worse — a
gate that only runs on `main` finds problems **after** the merge, which is the
expensive moment to find them. Cheap-on-dev / full-on-main also trains you to
trust a green that means less than it says. Same gates everywhere; make them
fast instead. At 3 minutes there is nothing left to tier.

**Branches ARE worth it — for a different problem.** Twice on 2026-08-24 the
owner and the loop edited the same working tree simultaneously: once an
independently-written ledger entry was swept into an unrelated commit by
`git add -A` (which is how two gaps briefly shared the number 17), and once a
whole slice (139) was found already implemented and uncommitted. Branches plus
separate worktrees remove that contention entirely, and `fix/docs-search-bar`
showed the shape working. So: **branch for isolation and review, not for CI
tiering.**

**Standing rules that follow:**
- Same gate set on every branch and on `main`.
- `main` protected, requiring CI green.
- Anything that reads a file must not be in `paths-ignore` — `DESIGN.md`,
  `ROADMAP.md`, `LOOPS.md`, `README.md` and `CHANGELOG.md` are each read by
  gate scripts, so none of them may be ignored. Only `.roundtable/**` and
  `STATUS.md` are read by nothing.
- Re-measure before optimising again. The single biggest win here was a loop
  written the wrong way round, and no amount of workflow tuning would have
  found it.

## Sequence — what runs next, and why in this order (owner, 2026-08-24)

> **SUPERSEDED 2026-08-24, recorded 2026-08-28 (Slice 170.1). Every row below is
> closed or was deliberately dropped; this section is kept as the record of the
> reasoning, not as the plan.** It was written at 20:45 and the commit run that
> closed 130.4 *without Inventory or Finance* — the owner's own call, on the
> evidence — landed at 21:22, four commits later; 193 commits have passed over it
> since without an edit. 140.3 and 130.5 are `[x]` in `ROADMAP-archive.md`;
> 130.4a Production was built, 130.4b/c were not. The gated list below is stale
> too: it says "precondition met (0.3.0 cut)" and the package is at **0.5.0**.
> For what is open **now**, read the `N. [ ]` checkboxes or generated `STATUS.md`
> — never a count written into prose.
>
> ```
> git log -1 --format='%h %ai' d04b5557   # wrote this section
> git log -1 --format='%h %ai' 45baaa12   # closed 130.4, 37 minutes later
> grep -cE "^[0-9]+\. \[ \]" ROADMAP.md   # what is actually open
> ```

Eighteen items are open; **nine are dispatchable** and nine are gated on the
owner or on a condition — *the count as it stood on 2026-08-24; see the note
above.* The order below is the plan of record. It is derived
from one finding rather than from item age: the instrument grill
(`.roundtable/grill-erp-suite-instrument-2026-08-24.md`) showed that **every
gap the ERP suite has found came from a new SHAPE or from STRESS, and none
from a new domain** — 9, 4, and 0 of the seventeen. So the remaining modules
are ranked by the shapes they force, not by module order.

| # | Item | Why here |
|---|------|----------|
| 1 | **140.3** — predictions on record | Must precede the modules. A yield predicted *after* building is worthless; the whole value is that it can be wrong. Cheap — recording, not building. |
| 2 | **130.4a Production** | Highest predicted yield: BOM as a multi-level hierarchy, capacity over time, the MRP panel. Also where **140.1's reopened question** — intensity over a long date grid — gets tested on a real screen instead of a screenshot. |
| 3 | **130.4b Inventory** | Stock by item × warehouse. Predicted **not** a gap (`comparison` documents a candidates × criteria grid; `data-table` ships `--sticky-col`). Building it either confirms that or proves the prediction wrong. |
| 4 | **130.4c Finance** | Journal entry that must balance, payment list + detail. Predicted **~0 gaps** — all shapes covered. This is the thesis test: a module that finds nothing is a **success**, and the evidence for stopping at shape coverage. |
| 5 | **130.5** — wire the suite into CI | Its own condition is "once it stops changing shape". That is true only after 2-4 land. Ordered last among suite work on purpose: a gate guarding a moving target reports noise. |
| 6 | ~~**136.6 / 136.7**~~ — **both REFUSED 2026-08-24** | The instrument did what this row predicted, and refuted them. 25 ERP screens express document relationships as a document-flow timeline (5) or a related list (2), and use rich text on **zero**. A reference belongs in a structured surface GAP-2 already resolved, not in prose. 136.7's general question — a character counter for the form family — is re-homed as open, not queued. |

**Gated, not sequenced** — these are not "later", they are waiting on someone:

- **112.3** pilot briefs → owner (the loop must never author brief content);
  **112.4** blocked on 112.3's verdict; **112.5** after both.
- **OWNER CALL — direction**: precondition met (0.3.0 cut), awaiting the
  owner's push + GitHub Release.
- **AT runtime evidence**: needs owner hardware — a screen reader this loop
  cannot drive.
- **Turbo**: conditional, and its condition (workspace past ~2 packages) is
  not met.
- **185.2 — register the npm Trusted Publisher for `@busy-office/create-ui`**:
  needs the owner's npm account, wizard at hand
  (`register-create-ui-trusted-publisher.sh`, walked through 2026-08-29,
  not committed — one-off). `@busy-office/ui` already went through the exact
  same sequence (`ROADMAP-archive.md`: manual `0.1.0` publish by the owner,
  then Trusted Publisher registered, then `0.1.1` shipped with SLSA
  provenance) — this is the same step for the second package, not a new
  kind of gap. Two consequences of leaving it unregistered, as the owner
  named them: (1) `create-ui@0.1.0` carries no attestation a consumer can
  verify the build against, unlike `ui@0.5.0` — and that specific version
  can never be retrofitted, since a published version can't be republished,
  so every release skipped here is provenance lost permanently, not just
  deferred; (2) the next real release strands the scaffolder again exactly
  the way 185's original finding described, unless this is registered
  first — `publish.yml` ships create-ui unconditionally after core, so an
  unregistered Trusted Publisher fails that step outright rather than
  silently skipping it. *(The owner referenced this as "ADR-06" — no ADR-06
  or any `docs/adr/` file exists in this repo as of 2026-08-29; recorded
  here rather than assumed, since `domain-modeling`'s ADR support isn't
  wired into this project yet.)*

  **In progress 2026-08-29 (owner, via the wizard).** The npmjs.com panel was
  opened and the form was mostly filled correctly (Publisher GitHub Actions,
  org `Busy-Office`, repo `busy-office-ui`, workflow `publish.yml`) — but a
  screenshot showed **Environment name pre-filled with `@busy-office/ui`**,
  which is wrong: `publish.yml` has no `environment:` key at all
  (`grep -n 'environment:' .github/workflows/publish.yml` returns nothing),
  so an OIDC token from this workflow never carries that claim and saving it
  as-is would make every future publish fail. Flagged before save; owner was
  told to clear that field and leave it blank, matching what `ui`'s own
  config almost certainly has.

  **No wake can verify the save happened, and neither can `npm view`.**
  Browser automation to npmjs.com is blocked at the Claude-in-Chrome
  extension's own site-permissions level (confirmed by two navigation
  attempts, both refused before any page loaded) — not a login issue,
  a hard stop, and account-settings changes like this belong to the owner
  directly regardless. More load-bearing: **the registry has no field that
  states "Trusted Publisher: configured."** It only ever shows *provenance
  on an already-published version*, stamped at publish time — so
  `create-ui@0.1.0` will read no-provenance permanently no matter what gets
  configured now, and there is no query against the registry that proves
  registration today. The only proof is the next `npm publish` actually
  succeeding via OIDC (or failing loudly, if something is still
  misconfigured) — which only happens at the next real, owner-triggered
  release. `npm view @busy-office/create-ui` is not a valid check for this;
  don't try it as a substitute for a screenshot or the owner's own
  confirmation.

  **RESOLVED 2026-08-29 — the browser block above was per-origin, not
  absolute.** The owner added `npmjs.com` to the Claude-in-Chrome extension's
  site permissions; `www.npmjs.com` (the redirect target) stayed blocked but
  the bare `npmjs.com` origin worked, so navigation succeeded from there.
  **Confirmed directly, not inferred**: the Trusted Publisher panel shows a
  saved entry (`Busy-Office/busy-office-ui`, `publish.yml`, permissions `npm
  publish` + `npm stage publish`); opening its Edit form (via a real
  extension-driven click, not a synthetic DOM event — see 200.1/200.2's own
  caught bugs about the difference) shows Organization `Busy-Office`,
  Repository `busy-office-ui`, Workflow filename `publish.yml`, and
  **Environment name genuinely empty** — the earlier mis-fill was corrected
  before saving, exactly as flagged.

  **What this does and does not prove, stated precisely rather than
  overclaimed.** This confirms the *configuration* is now correct. It does
  **not** prove OIDC actually authenticates — as recorded above, that has
  exactly one proof and it is the next real release publishing
  `create-ui` successfully. Configuration-correct and publish-correct are
  different claims; only the first is closed here.

  **CLOSED 2026-08-29 — the second proof landed.** `v0.6.0` was cut (owner
  confirmed, release created via `gh release create v0.6.0`), `publish.yml`
  ran green end to end, and `Publish create-ui to npm (OIDC, with
  provenance)` — the step that only passes if the Trusted Publisher
  actually authenticates — succeeded. Confirmed against the registry
  directly, not inferred from the green run:

  ```
  npm view @busy-office/create-ui version               # 0.1.1
  npm view @busy-office/create-ui dist.attestations      # predicateType: slsa.dev/provenance/v1
  ```

  `create-ui@0.1.1` carries SLSA provenance — the trust-surface hole named
  at the top of this item is closed for every version from here forward;
  `0.1.0` stays permanently unattested, as already established.

**What would change this order.** If Production finds three or more gaps, the
shape thesis is holding and Inventory/Finance stay as written. If Production
finds **zero**, the thesis is wrong in an interesting way — the remaining
modules would be re-argued rather than ground through, because the instrument
would have stopped paying for itself.

## Slice 203 — Objective grill of Slices 199-202: the P0 fix's own gate re-verified by injection, two triage refusals confirmed against source (2026-08-29)

Rule 3 at 4/3, OVERDUE. Index checked first: 0 of the window's four slices are
a repeated subject. Full report:
`.roundtable/grill-objective-199-202-2026-08-29.md`.

**Shape check, done fresh.** This window is fix/triage/fix/sweep, not the
grill/grill/sweep shape the retired product-vs-machinery ratio was about —
checked, and correctly not re-raised either way.

**(A)** 201's P0 fix (two typo'd `var()` names) re-verified: both now name
tokens confirmed defined in `tokens/motion.css`/`tokens/typography.css`. Its
new gate, `check-token-refs.mjs`, gave a **false positive mid-grill** against
a stale `dist/` — its own header already documents this exact trap; a clean
rebuild reproduced 202's own numbers exactly. **Red-proved by injection,
twice** — the first attempt (renaming a token everywhere) was itself a dead
red-proof, since the definition moved with every usage; the second (breaking
one usage, leaving the definition alone) correctly failed.

**(B)** Two of Slice 200's "already shipped" refusals spot-checked against
source: `.bo-motion-pulse-once` (`motion/motion.css:85`) and
`.htmx-settling`/`.htmx-swapping` (`integrations/htmx.css:19,31`) are both
real and do what the triage said. Both hold.

**(C)** 199.1's tile-count claim (max 11, min 4, total 39) reproduces exactly
from its own pinned command.

**(D)** 202's third identical clean sweep, checked rather than trusted:
`scan:dead-style` and `report:css-repeats` both declare themselves `@exact`
in their own headers, so a stable repeated result from them is the expected
signal, not the suspicious one CLAUDE.md warns about for heuristic detectors.

**Fed back to triage**: no rule change, nothing new queued — a clean-control
grill arrived at by verification, like Slice 198. No gate proposed.

## Slice 202 — Standardize sweep: clean, and the two things this window's own new artefacts might have duplicated, checked directly (2026-08-29)

**Dispatcher rule 2 at 5/4, OVERDUE.** All three standing lanes match the last
sweep's baseline (Slice 197) exactly, delta 0:

- `scan:dead-style -w apps/docs`: **0 dead** of **1,428** live inline
  declarations — same count as Slice 197.
- `report:css-repeats -w packages/core`: **8 groups**, same pairs
  (breadcrumb/richtext, combobox/file-upload, dashboard/offcanvas,
  form-input/richtext, sidebar-nav/tree, plus 3 more) — no new group, no
  group grew.
- `report:prose -w apps/docs`: **14 flagged pages** (the union of the
  global-median list and the five per-family additions), the same set as
  Slice 197 — no page crossed the line since.

**Two specific checks this window's own new work invited, not left to the
standing three.** Slices 200-201 landed dialog exit motion (200.1) and a new
gate script (`check-token-refs.mjs`, 201.3) since the last sweep — both are
exactly the shape of thing a Standardize pass exists to catch drift in.

- **`dialog.css`'s new exit-motion block vs. `offcanvas.css`'s (143.4), the
  recipe it was built to reuse verbatim.** Structurally identical shape
  (`@keyframes`, `@supports (transition-behavior: allow-discrete)`, the same
  `overlay`/`display` transition pair, `@starting-style`) — but not a
  `report:css-repeats` hit, because the two components use different
  duration tokens (`--bo-motion-duration-base` for dialog,
  `-slow` for offcanvas) and different selectors, so no declaration body is
  byte-identical. This is the case CLAUDE.md's own repeats report already
  excuses: two components needing the same PATTERN must each carry it,
  because plain CSS cannot share a rule body without sharing a selector.
  Nothing to consolidate — the duplication is the intended, documented reuse
  200.1 already recorded, not new drift.
- **`check-token-refs.mjs`'s scope vs. `scan:dead-style` and
  `report:css-repeats`.** Read in full: it verifies `var(--bo-…)` references
  resolve to a defined custom property (from CSS or from the two runtime
  `.ts` behaviors that set one). `scan:dead-style` checks whether an INLINE
  declaration changes any computed value; `report:css-repeats` checks
  duplicate declaration BODIES across selectors. Three different failure
  modes — unresolved reference, dead declaration, duplicated block — with no
  overlap in what triggers them. No consolidation warranted.

**Nothing to consolidate.** A clean sweep across all five checks (three
standing, two targeted at this window's own new artefacts) is a complete,
valid outcome — the same conclusion Slices 194 and 197 reached, reproduced a
third time on a materially different tree (Slices 198-201 landed between this
sweep and the last one).

## Slice 201 — P0: two undefined token references silently deleted the declarations that named them (2026-08-29)

**Dispatcher rule 1, and the P0 was found by the wake rather than reported** —
the same shape as Slice 180. This wake dispatched to rule 6 (Polish), was reset
by a collision onto a tree where Slice 200 had just been triaged, re-evaluated
and landed on rule 4; while measuring **200.7's** base rate *before* building
it — which is what 200.7's own Accept demands — the measurement turned up a
shipped defect, and rule 1 preempts.

**The mechanism, stated because it is the reason nothing caught these.** An
unresolvable `var()` is neither a syntax error nor a no-op: it makes the whole
declaration **invalid at computed-value time**, so the property falls back to
its inherited or initial value and nothing warns. stylelint sees valid syntax.
The build sees valid CSS. `check:motion` asks whether a duration is
token-driven or carries a reduced-motion override — never whether the token it
names resolves.

1. [x] **201.1 — `scan.css` reached for a token that does not exist, and the RF
       scan flash painted nothing at all.** `animation: bo-scan-flash 600ms
       var(--bo-motion-ease) forwards` — the defined token is
       `--bo-motion-easing-standard`; `--bo-motion-ease` is referenced once and
       defined nowhere, in src and in the built `dist`.

       **Measured in a real browser against the BUILT site, not reasoned about**
       (`browser-harness.mjs` + `serve-dist.mjs`, the pair ENVIRONMENT.md names
       as takeable in a cloud wake). On `/components/scan/`, with
       `body[data-scan-result="ok"]` set:

       | | `animation-name` | `animation-duration` | `opacity` |
       |---|---|---|---|
       | as shipped | `none` | `0s` | `0` |
       | with the token defined (red-proof) | `bo-scan-flash` | `0.6s` | `0.3` |
       | after the fix | `bo-scan-flash` | `0.6s` | `0.3` |

       So the `::after` stayed at its declared `opacity: 0` and the overlay —
       the component's **entire visible accepted/rejected verdict**, the wash a
       picker reads in peripheral vision — was invisible. Scoped honestly: only
       for users **not** in reduced motion, because that branch sets its own
       static `opacity: 0.2` and never touches `animation-name`.

       The 600ms literal is **deliberate and stays** — `scan.css`'s own comment
       explains it is a peripheral-vision cue rather than the 300ms token.

2. [x] **201.2 — `combobox.css` had the same typo shape, found by re-verifying
       the sibling rather than by a second report.** CLAUDE.md's *"when one
       claim from a session dies this way, re-verify its siblings"*, executed:
       `font-family: var(--bo-font-family-mono)` against a defined
       `--bo-font-mono` that six other components spell correctly.

       `.bo-combobox__option-code` computed to
       `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` — **byte-identical
       to `getComputedStyle(document.body).fontFamily`** — against a `.bo-kbd`
       control on the same page computing `ui-monospace, "SF Mono", …`. After the
       fix the two agree exactly. The tabular alignment the code column exists
       for was simply absent.

3. [x] **201.3 — `check:token-refs`, a gate for the class, red on the untouched
       tree.** Every `var(--bo-…)` with no fallback must name a property
       something defines.

       *The base rate, and which artifact each figure came from* — they are
       different sets, and quoting one for the other is how a wrong number gets
       published:

       - `dist/css/index.css` alone: **152** distinct names referenced, **219**
         defined, **9** referenced-but-undefined.
       - every file the gate walks (index + per-component + `rf-essentials`):
         **2451** references, **189** distinct names, **387** definitions.

       **7 of those 9 are not defects** — `var(--bo-grid-min, 16rem)` and
       friends are consumer-override hooks, undefined by design with the default
       written right there. So the rule is *no fallback AND never defined*, and
       the hook count is printed every run so the exemption cannot quietly grow
       into cover for a real typo.

       **CSS is not the only definition site, and a CSS-only gate would have
       false-positived on three tokens.** `sticky-cols.ts` sets
       `--bo-sticky-w-1`/`-2` and `anchor-nav.ts` sets
       `--bo-anchor-landing-offset` at runtime. The gate reads both sites rather
       than being taught one exemption at a time.

       *Red-proofs, plural, and the injection verified each time.* It was red on
       the untouched tree — its red-proof by construction. It was then red-proved
       **again deliberately** by restoring the `--bo-motion-ease` typo, and the
       injection was confirmed to have reached the BUILT output
       (`grep -c 'var(--bo-motion-ease)' packages/core/dist/css/index.css` → 1)
       *before* the red was believed, per CLAUDE.md's standing rule.

       **The gate caught a real ordering bug in its own wiring**, which is worth
       more than the assertion that it works: placed after `check:motion` it ran
       *before* `build:rf-essentials` writes `rf-essentials.css`, read a stale
       copy from the previous build, and failed on a typo already fixed in
       source. Exactly the stale-`dist` ordering trap `build:acr` shipped once
       before. It now runs after `check:rf-floor`, verified against a
       `rm -rf packages/core/dist` rebuild rather than an incremental one.

4. [ ] **201.4 — 200.7's gate is largely already shipped as `check:motion`, and
       a naive version would fail the build on two right answers.** Recorded
       here rather than closing 200.7, which is another dispatcher's freshly
       triaged item.

       Measured, and **the first instrument was wrong**: a line-scoped
       `grep -oE '(transition|animation)…'` over the 44 component stylesheets
       found **11** declarations; a multi-line-aware parse of the same files
       found **23**. The line-scoped version silently drops every declaration
       that wraps — a 52% undercount, and the same position-filter family
       CLAUDE.md already records.

       Of those 23: **5** are `none`, **16** are token-driven, and **2** carry a
       literal duration — `scan`'s `600ms` and `skeleton`'s `1.8s linear`.
       **Both are correct.** No motion token exists at either value (the scale is
       100/150/300ms), `linear` is right for a continuous shimmer, and
       `check:motion` already adjudicates both via its route (b): each carries
       its own `animation: none` under `prefers-reduced-motion`. A gate that
       flags a literal duration therefore fails on two deliberate, documented
       decisions — the *"would fail the build on eight right answers"* shape
       LOOPS.md §3 already refuses for `report:css-repeats`.

       *Accept*: 200.7 either ships against a predicate that is false of
       something today, or records that `check:motion` covers its subject and
       closes as refused — **either outcome satisfies this item**; what it may
       not do is ship a gate whose only red is on `scan` and `skeleton`. Note
       that the undefined-token case 200.7's own text names as *"exactly the kind
       of thing this would NOT catch"* is now caught, by 201.3.

**What this wake did NOT verify, said plainly.** Cloud wake: no Podman, no
`localhost:8081`, **no screenshots at 1440px/390px in light or dark**. Every
figure above is a computed-style or font-family reading from headless Chrome.
That the scan flash now animates, and to exactly what values, is measured; **how
it LOOKS is unverified** and no claim here depends on it.

## Slice 200 — triage: an external "micro-motion UX review" proposal, checked against the shipped CSS before anything was filed (2026-08-29)

**LOOPS.md Step 1, user-submitted.** A 15-item proposal (dialog exit motion,
button press feedback, tab/segmented transitions, bulk-action disclosure,
async save/submit sequencing, live-table pulses, row insert/delete, pagination
transitions, tree disclosure, toast lifecycle, inline validation, copy
confirmation, plus a token/spec matrix and a11y/perf guidance) arrived as a
feature request. Per Step 1 it is classified as a feature, tested against the
Objective, and **every "current experience" claim was checked against the
actual shipped CSS before anything was accepted** — CLAUDE.md's own doctrine
("an asserted claim is a defect until measured") applies to input as much as
to a wake's own work.

**High-fidelity source.** The proposal's description of the existing motion
system — token names/values, the intent vocabulary (entrance/exit/state
transition/progress/attention), "motion is never the only channel" — matches
`packages/core/src/css/motion/motion.css`'s own header comment almost
verbatim. That is a strong prior that the specific claims below are worth
checking rather than dismissing.

**Verified exact — the token table.** `packages/core/src/css/tokens/motion.css`:
`--bo-motion-duration-fast: 100ms`, `-base: 150ms`, `-slow: 300ms`,
`--bo-motion-easing-standard: cubic-bezier(0.4, 0, 0.2, 1)`, all three
durations zeroed under `prefers-reduced-motion: reduce`. Matches the proposal's
table exactly, including the reduced-motion behavior.

**Verified TRUE — the gaps the P0/P1 items target:**
- `dialog.css` has only an entrance `@keyframes bo-dialog-in`; no exit
  animation, no `@starting-style`/`allow-discrete`. **And the exact recipe to
  fix it already ships** in `offcanvas.css` (143.4, "collapse drawer motion on
  close") — `transition-behavior: allow-discrete` + `@starting-style` +
  `overlay`/`display` transitions, with a `@supports` fallback to instant
  close. This is compose-the-existing-primitive, not invent-a-new-one.
- `button.css` has a `:hover` background transition and zero `:active` state.
- `tabs.css` and `segmented.css` have **no `transition` or `animation`
  declarations at all** — greped clean.
- `data-table.css`'s `.bo-data-table__bulk-actions` toggles
  `display: none` → `display: flex` with no transition (line 67-78) — real,
  and not already addressed by this session's own 173.2/190.1/196.1 data-table
  work, which touched the form-field error message, not this toolbar.
- `alert.css`'s `.bo-toast` has only `bo-toast-in`; no exit animation, no
  stack-reflow motion.

**Verified ALREADY SHIPPED — three of the proposal's items are asking for
something that exists, and filing them as new work would be exactly the kind
of un-reconciled claim CLAUDE.md keeps finding:**
- **"Standardize async save/submit feedback" and "apply precise feedback to
  live table updates"** — `.bo-motion-pulse-once` (the opt-in motion module)
  and `.htmx-settling`/`bo-htmx-settle` (the htmx integration, "classic ERP
  grid feedback after a row/cell refresh") already implement the exact
  flash-on-update mechanism proposed. What's missing is USAGE GUIDANCE (when
  to pulse, coalescing rapid updates), not CSS.
- **"Improve pagination and filter transitions"** — `integrations/htmx.css`'s
  `.htmx-indicator`/`.htmx-swapping` opacity-fade already covers exactly this
  for the framework's supported async-swap story. A non-htmx consumer doesn't
  get it for free, but the framework's documented integration story is
  htmx-first, so this is coverage, not a gap.
- **"Pair tree disclosure with content continuity"** — `tree.css`/
  `tree-table.css` already transition the chevron `rotate`; `.bo-motion-collapse`
  (grid-template-rows 0fr/1fr) already exists for wiring the expand. The
  proposal's own recommended split (rotate-only for large/virtualized,
  rotate+collapse for small groups) is buildable today from existing
  primitives with zero new CSS.

**Not fully verified — flagged rather than asserted:** row insert/delete,
inline-validation entrance, and copy-confirmation claims were checked for
existing primitives (`.bo-motion-fade-in`/`-out` and `.bo-motion-slide-in-block-start`
already exist and would serve rows/validation directly) but not screenshotted
against real markup in this pass — carried into the items below rather than
decided blind.

**Aside, out of scope, not filed:** `scan.css` references `var(--bo-motion-ease)`,
which is never defined anywhere in `tokens/motion.css` or elsewhere — only
`--bo-motion-easing-standard` exists. That's a pre-existing bug unrelated to
this proposal; noted here so it isn't lost, not triaged as part of this slice.

1. [x] **200.1 — DONE 2026-08-29. dialog exit motion, reusing offcanvas's
       `@starting-style` + `allow-discrete` recipe verbatim rather than
       inventing a second one.**
       *Accept*: the dialog and its backdrop animate closed in a browser
       supporting `transition-behavior: allow-discrete`, using the same
       token durations/easing as the entrance; a browser without support
       closes exactly as it does today (instant, no regression); Escape,
       backdrop click, close-button and programmatic close all complete
       without depending on an `animationend` event (confirm by DevTools
       CPU-throttling + interrupting the animation mid-flight); focus
       returns to the trigger regardless of whether the animation ran; under
       `prefers-reduced-motion: reduce` open and close are both instant.

       **Shipped.** `packages/core/src/css/components/dialog/dialog.css`
       gained the `@supports (transition-behavior: allow-discrete)` block
       143.4 already shipped for `.bo-offcanvas`, unchanged in shape: the
       panel transitions `opacity`/`transform` (reusing the entrance
       keyframe's own `translateY(0.5rem) scale(0.98)` travel), the backdrop
       transitions `opacity`, both via `--bo-motion-duration-base` /
       `--bo-motion-easing-standard` — the SAME tokens the entrance already
       used, nothing new invented. The entrance `@keyframes` stands down
       (`animation: none`) wherever the transition is supported, exactly as
       offcanvas's own comment already documents for its own case.

       **Each Accept clause, and how it was actually checked — not claimed:**
       - *Closes without `animationend`*: `check:claims` (new case) drives a
         REAL click (`page.click`, not `el.click()` in-page) to open, a real
         click on Cancel to close, and asserts `dialog.open === false`
         **synchronously**, with no wait — a close gated on the animation
         event would still read `open` at that line. It doesn't.
       - *Focus returns to the trigger*: same case, same synchronous read.
         **First run reported `focusBack: false` on every attempt** — not a
         regression, a test-harness artifact: an in-page `trigger.click()`
         fires the click event (so the delegated open-listener runs) but
         does not carry Chromium's click-to-focus activation behaviour,
         which is what native `<dialog>` focus-restore-on-close keys off.
         Confirmed by isolating the variable directly — `trigger.focus()`
         before `.click()` made it pass, and a real CDP `page.click()`
         alone made it pass with no manual focus call — so the check was
         rewritten to drive real clicks throughout, matching this repo's
         own "drive real events" rule (CLAUDE.md) rather than being
         special-cased around.
       - *Reduced motion is instant*: a second `check:claims` case opens
         under `prefers-reduced-motion: reduce` and reads computed
         `opacity` after one 50ms tick (not a full transition wait) — `1`,
         confirming the `@starting-style` FROM state doesn't linger when
         the duration tokens are zeroed.
       - *Unsupported browser closes exactly as today*: not independently
         testable in this harness (Chrome 151 supports `allow-discrete`
         unconditionally) — same limitation offcanvas's own 143.4 already
         carries, verified there by construction (`@supports` guard) rather
         than by disabling the feature. No new gap opened.
       - *CPU-throttling / interrupted mid-flight*: covered by the same
         no-wait synchronous assertion above — the check never waits for
         the animation to finish before asserting the close completed, so a
         throttled or interrupted frame changes nothing it depends on.

       **`check:composited` gained 4 new registry entries** for the dialog's
       opacity-0 states (panel closed, panel `@starting-style` open, backdrop
       closed, backdrop `@starting-style` open) — same exempt reasoning as
       offcanvas's existing two entries: each is one end of a sub-300ms
       transition, never a resting state anyone reads.

       Verified: `check:claims` **146/146** (was 144; +2 new dialog cases),
       `check:repo` 9/9, `test:axe` 127 pages × 2 widths zero violations,
       core `npm run test` 146/146, `check:composited` 17 declarations all
       registered.
2. [x] **200.2 — restrained button press feedback, pointer-only.**
       *Accept*: `.bo-btn:not(:disabled):not([aria-disabled="true"]):not([aria-busy="true"]):active`
       under `@media (hover: hover) and (pointer: fine)` gets a 1px
       `translateY` (not `scale`, to avoid gaps/misalignment in
       `.bo-btn-group`-joined buttons — verify a joined group with 3+
       buttons shows no visible seam when the middle button is pressed);
       keyboard activation (Space/Enter) shows no artificial press transform,
       only the existing focus/state feedback; reduced motion removes the
       displacement entirely.

       **CLOSED 2026-08-29.** `packages/core/src/css/components/button/button.css`:
       `.bo-btn` gained `transform` to its existing `transition` (reusing
       `--bo-motion-duration-fast` / `--bo-motion-easing-standard`, no new
       tokens), plus the `:active` rule and `.bo-btn-group`'s `:active` added
       to its existing `:hover, :focus-visible { z-index: 1 }` line.

       **The Accept's own selector was insufficient, caught live rather than
       assumed.** `(hover: hover) and (pointer: fine)` is a DEVICE capability,
       not an input-modality signal — on any desktop it is true for a keyboard
       activation exactly as much as a mouse click. A real
       `page.keyboard.down('Space')` on a focused button, read via
       `getComputedStyle` after the transition settled (not at the same tick —
       an earlier read at t=0 caught the transition's start frame and falsely
       showed `none`), returned `matrix(1,0,0,1,0,1)` — the SAME 1px offset a
       mouse press gets. Fixed by adding `:not(:focus-visible)`: a mouse click
       on a button does not set `:focus-visible` (browsers reserve the ring for
       keyboard/programmatic focus on buttons), while Space/Enter activation
       always does, since the button was already keyboard-focused to receive
       the key. Re-verified live after the fix: Space held `transform: none`
       while `:active` still correctly matched true; a real mouse press still
       read the translated matrix.

       **All four criteria verified live** (Chrome via CDP, real `page.mouse`/
       `page.keyboard` events, not synthetic dispatch), against
       `/components/button/`'s 3-button `.bo-btn-group`:
       - Mouse press on the middle button: `transform: matrix(1,0,0,1,0,1)`,
         `zIndex: '1'`, left/right edges **unchanged** (283/319, same as
         unpressed — only `top` moves, by exactly 1px), neighbours' shared
         edges still exactly overlapping (284/318, the existing 1px
         border-collapse) — no seam opens.
       - Keyboard Space: `:active` true, `transform: 'none'`.
       - `prefers-reduced-motion: reduce`: mouse press still sets `:active`
         true (real press registers), `transform: 'none'`, `top` **unchanged**
         — zero displacement, not merely unanimated.

       Locked in as three `check:claims` cases (`apps/docs/scripts/
       check-claims.mjs`) rather than left as one-off manual verification —
       the keyboard-vs-mouse distinction is exactly the kind of claim that
       silently breaks if a future edit touches the selector. One test-harness
       bug caught and fixed before trusting a red result: the mouse-press case
       first read `transform: 'none'` for a REAL mouse press — not a CSS
       regression, the harness had called `.focus()` on the same button for
       the Space test moments earlier and never blurred it, so the mouse press
       inherited a stale `:focus-visible` state from the harness's own setup,
       not from the click. Fixed with an explicit `blur()` between the two
       sub-tests.

       Verified: `check:claims` **149/149** (was 146, +3), `check:repo`
       **9/9**, `test:axe` **127 pages × 2 widths, zero violations**.
3. [ ] **200.3 — tab and segmented-control selection get a style transition,
       no slide/pill.** Bundled as one item: same shape (color/background/
       border-color transition only, explicitly no panel slide and no
       sliding-pill indicator — both refused by the proposal itself on sound
       ERP grounds: tab content isn't spatially ordered, and a sliding pill's
       geometry breaks under wrapped/RTL/translated labels).
       *Accept*: `tabs.css` and `segmented.css` each gain a `transition` on
       `color`/`background-color`/`border-color` (and `box-shadow` for
       segmented) at `--bo-motion-duration-fast`; rapid arrow-key traversal
       across 5+ tabs shows no perceptible input lag (measure, don't assume);
       the tab strip's block-size is unchanged by the transition; forced-colors
       mode is unaffected (no color-only signal already relied on `transition`
       to be visible — verify the existing focus/selected indicators still
       render instantly and visibly there).
4. [ ] **200.4 — data-table bulk-actions get an entrance transition instead
       of an instant `display` flip.**
       *Accept*: `.bo-data-table__bulk-actions` becoming visible (first row
       selected) shows a short opacity+transform entrance
       (`--bo-motion-duration-fast`–`-base`); selecting additional rows does
       not replay it (only the none→visible transition fires); clearing the
       last selection hides it without an exit flourish beyond what the
       existing mechanism does; at 390px the toolbar wraps exactly as it does
       today — this item does not touch the wrap/overflow behavior 173.2/190.1
       already fixed; RTL entrance direction verified, not assumed mirrored.
5. [ ] **200.5 — toast gets an exit animation and a bounded stack-reflow,
       matching the entrance it already has.**
       *Accept*: `.bo-toast` removal fades out over
       `--bo-motion-duration-fast`–`-base` rather than disappearing instantly;
       remaining toasts in a stack of 3+ shift by a bounded translate (not an
       uncapped reflow) when one is dismissed; auto-dismiss timers pause on
       hover/focus (verify this exists in the current toast behavior —
       CHECK, don't assume, before writing the Accept as "unchanged"); an
       error toast requiring action is not auto-dismissed; reduced motion
       makes both entrance and exit instant.
6. [ ] **200.6 — row insert/delete and inline-validation entrance, composed
       from existing motion-module utilities, plus the usage guidance the
       already-shipped pulse/settle mechanisms are missing.** Bundled because
       all three are "wire an existing primitive to a new spot + write down
       when to use it," not new CSS:
       - Row insert: `.bo-motion-fade-in` on the inserted `<tr>`.
       - Row delete: `.bo-motion-fade-out`, with a non-animation-event
         fallback timer for removal (never let deletion depend on
         `animationend` firing) — no animated height/row-collapse in
         virtualized or large tables, per the proposal's own stated reason
         (moving many adjacent rows breaks tracking).
       - Inline validation: `.bo-motion-fade-in` or
         `.bo-motion-slide-in-block-start` on first appearance of a field
         message; explicitly no shake.
       - **Usage guidance, written down rather than left implicit** (the gap
         identified above for pulse-once/htmx-settle applies here too): when
         to pulse a cell vs. a row vs. a summary total; don't pulse while the
         user is typing, on initial page load, or more than ~once/second per
         region (coalesce rapid updates) — this is a docs/behavior-layer
         note, not new CSS, and belongs wherever this framework's existing
         data-table/htmx docs page already documents the settle flash.
       *Accept*: each of the three visibly uses the named existing utility
       class (verify by reading the built CSS, not by intent); the usage
       guidance is a paragraph in an existing docs page (data-table or the
       htmx integration guide), not a new page; virtualized-table row
       delete/insert is explicitly exempted from the fade, stated in the
       same paragraph.
7. [ ] **200.7 — a lint check that a raw ms duration or literal easing
       function isn't hand-written in component CSS where a `--bo-motion-`
       prefixed token exists.** The one proposal item that's a genuinely mechanically
       checkable property (unlike a hand-authored "spec matrix," refused
       below) — matches this repo's own gate discipline: measure the base
       rate before shipping it. *Accept*: a script (or stylelint rule) scans
       `packages/core/src/css/components/**/*.css` for `transition:`/
       `animation:` declarations using a literal duration or a
       non-token easing function; run it FIRST against the current tree and
       record the base-rate count before deciding whether to gate on it —
       per 94.11, if the base rate is already 100% clean this becomes a
       no-op gate and should say so rather than ship; `scan.css`'s
       `var(--bo-motion-ease)` (the undefined-token aside above) is exactly
       the kind of thing this would NOT catch (it's a token reference, just
       to a token that doesn't exist) — note that limitation in the script's
       own header rather than let the gate imply broader coverage than it has.

**Refused, each with the reason:**
- **The four-state Save/Saving/Saved/Error sequence as a "standardize"
  item.** Refuse the framing, not the idea. It composes existing primitives
  (`.bo-motion-spin`, `.bo-btn[aria-busy]`, icon crossfade) into an
  interaction PATTERN spanning behavior + markup, which is what this repo's
  "How to document a PATTERN" recipe exists for — it is not a component CSS
  change. **Rethink**: route it to a docs guide/pattern page (candidate:
  wherever the object-page or list-report pattern documents its save flow
  today) rather than a ROADMAP CSS slice.
- **A hand-authored "motion specification matrix" published to docs.**
  Refuse as literal. This repo generates API/token docs FROM the shipped
  source (CLAUDE.md: "never hand-write API tables") — a transcribed matrix
  drifts from `tokens/motion.css` the first time a duration changes. Rethink:
  if a matrix page is wanted, it must be generated from the token file +
  each component's `animation`/`transition` declarations, the same way
  `ClassRef`/`ApiTable` are generated today.
- **Copy-confirmation icon crossfade as its own item.** No existing
  copy-button CSS was found in this pass and none was screenshotted — too
  thin to file with a real Accept block. Left as a candidate for a future
  pass rather than queued now; **finding nothing here is a valid outcome**,
  not a gap in the triage.
- **Live-table-pulse and pagination-transition "standardization" as NEW
  work** (distinct from 200.6's guidance note) — refused because the
  mechanisms already ship (`bo-motion-pulse-once`, `bo-htmx-settle`,
  `.htmx-swapping`); filing them as gaps would repeat the exact
  asserted-vs-measured pattern this repo's own CLAUDE.md keeps finding and
  correcting.

## Slice 199 — the two things 193.2 left open: a denominator it could not reproduce, and a refused decision whose trigger had already fired (2026-08-29)

**Dispatcher rule 4, cloud wake — and a Step 0c collision, resolved as that
section prescribes.** This wake and the local dispatcher both took `193.2`. The
local one pushed first (`1c111d7f`); **its close stands as the record and was
not re-done.** `git fetch origin main` immediately before the first commit is
what caught it, which is the working half of Step 0c doing its job.

What survived the rebase is only what that close explicitly left unanswered — it
named both gaps in its own words: the 558 denominator *"left unresolved rather
than forced"*, and `104.4` among those *"left unchecked this wake for lack of
the right corpus on hand rather than guessed at"*. Redundant coverage finding
what one pass missed is the Slice 162 mechanism Step 0c cites as the reason both
dispatchers keep running. Report:
`.roundtable/reopen-conditions-2026-08-29.md`.

1. [x] **199.1 — DONE 2026-08-29 (local session) — `104.4` refused the
       patterns-index complexity filter on a premise that stopped holding the
       same day, and nothing re-checked it for 7 days. Re-refused, on live
       rendered evidence this time.**

       The refusal (2026-08-22) rested on a measured claim:
       *"`pattern-groups.mjs`'s six job-family groups **top out at 7 tiles**
       (enter & find) and run as low as 1 (RF) — every group is already small
       enough to scan without filtering."* Its own trigger: *"Revisit if the
       pattern count grows past a size where a 6-7-tile group stops being
       scannable."*

       ```
       node --input-type=module -e "import {PATTERN_GROUPS as G} from
         './apps/docs/src/data/pattern-groups.mjs';
         const s=G.map(g=>g.items.length);
         console.log('max',Math.max(...s),'total',s.reduce((a,b)=>a+b,0));"
       # max 11  total 39      (2026-08-29)
       ```

       | date | commit | max group | total tiles |
       |---|---|---|---|
       | 2026-08-22 | `7aec7830` — the day `104.4` was refused | 7 | 27 |
       | 2026-08-22 | `bb8b9ab4` | **8** | 30 |
       | 2026-08-23 | `8c171414` | 10 | 32 |
       | 2026-08-25 | `bdc2680e` | **11** | 39 |

       **Both halves of the premise are now false**: the largest group is 11,
       not 7 — 57% past the number the refusal rested on — and the smallest is
       4, not 1. Reconciled independently: `patterns.json`'s own `count` field
       reads **39**, agreeing with the tile sum. `grep -rn '104\.4'` over
       tracked sources returns **four** lines — the proposal twice, the roadmap
       entry, the loop-log row — so **zero re-checks**.

       *Accept* — properties, not a predicted verdict:
       - A recorded verdict on whether an 11-tile group is still scannable,
         measured against the index as it renders today rather than against the
         2026-08-22 numbers. **Re-refusing is a satisfying outcome** — the
         original reasoning (our workflow-stage groups already ARE the
         organizing axis a filter would duplicate) is untouched by group size
         and may still carry it on its own.
       - Either way `104.4`'s premise sentence is corrected or superseded in
         place, so the next reader does not inherit "top out at 7 tiles".
       - If refused again, the trigger is restated as a **property with its
         command** (this item's `node` one-liner), never as a bare number that
         goes stale silently.
       - **Browser-blocked in part**: if the verdict turns on scannability, it
         needs rendered images at 1440px and 390px in both themes — the
         `ENVIRONMENT.md` list a cloud wake CANNOT take. The tile counts above
         are the other list and are already taken. A cloud wake may settle the
         counts and must leave the scannability judgement open, saying so.

       ---

       **DONE 2026-08-29, local session — the scannability judgement, taken.**
       Podman-built `/patterns/` served live and screenshotted at 1440px in
       both light and dark (mobile 390px not captured — a browser-tool
       viewport-resize limitation this session hit, not a decision to skip;
       said plainly rather than claimed).

       **Verdict: re-refused.** The "enter & find" group's 11 cards render as
       a two-column grid; each card is full-size regardless of group length —
       title, complexity badge, opener text, a component-tag row, and (for
       screens that read at this size) a live miniature. Growing the group
       from 7 to 11 tiles lengthened the page; it did not shrink or crowd any
       one card, which is the opposite of what a filter would be defending
       against in a thumbnail grid. So the trigger's own question — does an
       item stay legible as the group grows — is unaffected by count here,
       because this layout scales vertically (more scroll) rather than by
       density (smaller tiles). `104.4`'s original argument — the
       workflow-stage groups already ARE the organizing axis a complexity
       filter would duplicate — is about IA structure, not rendering density,
       and nothing measured here touches it.

       `104.4`'s stale premise sentence is corrected in place
       (`ROADMAP-archive.md`, appended rather than rewritten per this repo's
       own doctrine on historical rows), with the current true numbers and
       the checkable `node` one-liner as its restated trigger — so the next
       reader doesn't inherit "top out at 7 tiles" and the next reopen check
       has a command to run rather than a number to eyeball.

2. [x] **199.2 — DONE 2026-08-29: 193.2's "558 does not reproduce" gap is
       closed, with 193.2's own parser and no change of method.** Its close
       recorded a steady gap of 3 and left it open, having tested `774558e`
       (the commit that FILED the item) and HEAD. The tree it never tested is
       the one immediately before the filing:

       ```
       for c in a9470314 774558e5 4b4993df; do
         n=$(git show $c:ROADMAP.md         | grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*')
         a=$(git show $c:ROADMAP-archive.md | grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*')
         echo "$c  $n + $a = $((n+a))"
       done
       # a9470314  43 + 515 = 558   <- exact, split and all
       # 774558e5  46 + 515 = 561
       # 4b4993df  48 + 515 = 563
       ```

       **The gap of 3 was the three items the filing commit itself added.**
       193.2 measured its corpus and then wrote itself into it, so no tree at or
       after the filing can show the number it recorded.

       **Why it looked unresolvable is a trap already on the books, and it cost
       a real conclusion.** `a9470314` is **13 minutes before** the filing but
       reads **8 hours after** it: the two dispatchers commit in different
       offsets (`+0800` local, `+0000` cloud), which `LOOPS.md` §0c records as
       164.2 (*"a row is ambiguous by eight hours on its face"*, 3 of 1013
       adjacent pairs reading backwards). A candidate commit that looks later
       than the thing it precedes gets skipped. **`git merge-base --is-ancestor`
       answers it; the face value does not.**

       Shipped with it, because 193.2's Accept asked for a command and the item
       carried a comment sketch:
       `scripts/loops/report_reopen_conditions.py` (`--rev`, `--self-test`). It
       reconciles its parse against a raw marker count per file and **refuses to
       report** on disagreement rather than printing a number it cannot defend —
       the discipline that surfaces exactly this gap. **Not a gate and named by
       no playbook step**, per 193.2's refusal; that cost is stated in the
       script's own header rather than left implicit.

3. [x] **199.3 — DONE 2026-08-29 (cloud wake): the 390px reading `199.1`'s
       close names as not captured, and a mechanism that refuses the filter
       independently of how it renders.**

       **A second Step 0c collision, and this wake was again the loser.** Both
       dispatchers took `199.1`; the local one pushed first (`d3d76a28`).
       **Its close stands as the record and none of it was re-done** — this
       wake's own duplicate close was discarded with `git reset --hard`, not
       pushed over it. `git fetch origin main` immediately before the first
       commit is what caught it, the working half of Step 0c doing its job for
       the second wake running.

       What follows is only what that close explicitly names as unanswered, in
       its own words — *"mobile 390px not captured this wake — a browser-tool
       viewport-resize limitation in this session, not a decision to skip"* —
       plus one finding neither pass carries. Redundant coverage finding what
       one pass missed is the Slice 162 mechanism Step 0c cites as the reason
       both dispatchers keep running.

       **A. The 390px reading, taken — and `199.1`'s argument SURVIVES it.**
       Measured live in headless Chrome over `apps/docs/dist` via
       `browser-harness.mjs` + `serve-dist.mjs`. This is layout geometry,
       `ENVIRONMENT.md`'s CAN-run list, **not** the rendered-image list:

       | | 1440x900 | 390x844 |
       |---|---|---|
       | scroll box (`main.bo-app-shell__main`) | 5572px in 845px = **6.6 screenfuls** | 11202px in 685px = **16.4 screenfuls** |
       | columns | 3 | 1 |
       | largest group (`enter & find`, 11 tiles) | 4 rows, 1231px = **1.5 screenfuls** | 11 rows, 2856px = **4.2 screenfuls** |
       | tallest tile | **326px** | **326px** |
       | visible in-page jump links | 7 | **0** |

       `199.1`'s close argued the layout *"scales vertically, not by density"*
       from the 1440px capture. At 390px that holds and holds harder: the
       tallest tile is **326px at both widths**, so growth lengthens the page
       and crowds no card. **A confirmation, not a correction** — said plainly,
       because a second dispatcher re-deriving a claim is only worth the tokens
       if it reports agreement as readily as disagreement.

       **B. The complexity axis provably cannot narrow this index — a refusal
       that does not depend on how the page renders.** Neither the 2026-08-22
       refusal nor `199.1`'s close carries this; both argue about the index,
       this argues about the *remedy*.

       ```
       node -e "const p=require('./apps/docs/src/data/patterns-index.json');
         const all={}; for (const g of p.groups){const d={};
           for (const t of g.tiles){d[t.complexity]=(d[t.complexity]||0)+1;
             all[t.complexity]=(all[t.complexity]||0)+1;}
           console.log(g.label.padEnd(30),'n='+g.tiles.length,JSON.stringify(d));}
         console.log('WHOLE INDEX n=39', JSON.stringify(all));"
       ```

       | group | tiles | complexity spread |
       |---|---|---|
       | enter & find | **11** | `{1:5, 2:6}` — **two values** |
       | work one record | 4 | `{1:1, 2:2, 3:1}` |
       | enter & correct data | 7 | `{2:2, 3:4, 4:1}` |
       | decide & clear queues | 4 | `{2:1, 3:3}` |
       | monitor & output | 7 | `{2:7}` — **one value** |
       | RF / rugged devices | 6 | `{1:2, 2:3, 3:1}` |
       | **whole index** | **39** | `{1:8, 2:21, 3:9, 4:1}` |

       - **The filter's busiest setting scans worse than the grouping it would
         sit on.** 21 of 39 tiles are complexity 2, so "show me complexity 2"
         returns **21 tiles** — nearly double the largest group that exists
         (11). At the other end, complexity 4 selects exactly **one** pattern.
       - **It cannot fix the group that fired the trigger.** `enter & find`
         spans two complexity values, so filtering 11 tiles yields 6 at best.
       - **On one group it does nothing at all.** `monitor & output` is 7 tiles
         all at complexity 2: every setting returns 7 or 0.

       Why this matters beside a close that already refused: `199.1` argues the
       *problem* is absent (more tiles lengthen, they do not crowd). This
       argues the *remedy* is inert. The second survives if a later wake
       decides 16.4 screenfuls at 390px is a problem after all — at which point
       the fix is still not this filter.

       Also read off the built page: tiles are **already ordered simplest-first
       within each group** (`gen-patterns-index.mjs` sorts by complexity) and
       all **39 of 39** carry a complexity badge. The ordering a filter would
       impose already exists as an ordering.

       **C. The trigger, restated as a CAPABILITY property.** `199.1`'s close
       restated it as the tile-count one-liner, which is a command and satisfies
       the Accept. This sharpens what the command should be asked *for*, since a
       tile count is what went stale silently the first time: reopen when the
       complexity axis becomes *capable* of narrowing — when no single
       complexity value holds more than about a third of the index **and** the
       largest group spans 3 or more values. Both halves come from B's command.
       Reading 2026-08-29: one value holds **21 of 39 (54%)** and the largest
       group spans **2** — neither half met. Real usage evidence of readers
       hunting for a way to narrow the index reopens it independently.

       **D. RECORDED, NOT FILED — and measurement is what refused it.** The
       390px row above looks like a finding: 16.4 screenfuls with **0** visible
       in-page jump links. It is not this index's and not caused by the growth
       from 27 tiles to 39. Measured over every built page at 390x844 (127 of
       127, the same `distPages` walker the standing gates use):

       ```
       # screenfuls of main.scrollHeight / main.clientHeight, top of ranking
       # 32.1  /components/data-table/   5 visible jump links
       # 24.8  /components/richtext/     2
       # 20.0  /concepts/which-pattern/  0
       # 20.0  /components/form/         0
       # 16.4  /patterns/                0     <- rank 5 of 127
       # median 6.0 screenfuls; 97 of 127 pages have ZERO visible jump links
       ```

       The "On this page" rail is `display:none` below 60rem for the **whole
       docs shell**, so this is a shell-wide design choice affecting **97 of
       127 pages**, and `/patterns/` is not its worst case —
       `/components/data-table/` is twice as long. Not filed: nothing is
       specific to this index, no usage evidence asks for it, and whether a
       long page should gain a jump affordance at 390px is a rendered judgement
       this wake cannot take. The numbers and the command are here so a later
       wake argues it rather than re-deriving it.

       **E. Three instrument defects, all caught before any number was used** —
       §8's ordering working, not a clean run:
       - `document.documentElement.scrollHeight` returned **exactly the
         viewport height at both widths** — the identical-value tell. The docs
         shell scrolls an inner `main`; every figure above is that box.
       - The jump-link count was first taken from the DOM and reported **7 at
         390px**. The rail is `display:none` there, so the honest count is
         **0 visible / 7 in DOM**. A DOM count would have credited the page
         with a jump nav no reader there can reach.
       - **The probe's red-proof came back GREEN on its first run.**
         `evaluateOnNewDocument` appended a `<style>` to
         `document.documentElement` before that element existed, so the
         injection never landed — CLAUDE.md's rule, hit exactly as written.
         Re-done as `addStyleTag` after navigation **with an assertion that the
         computed value moved**: `grid-template-columns 293.656px 293.672px
         293.656px -> 913px`, and every figure moved with it (6.6 -> 9.9
         screenfuls; `enter & find` 4 rows/1231px -> 11 rows/2226px). At 390px
         the same assertion correctly **refuses**: the grid is already one
         column, so the injection is a no-op there rather than a landed one.

       **What was NOT done, said plainly.** No screenshots at any width or in
       either theme — this cloud wake has no Podman and no `localhost:8081`.
       The aesthetic reading at 390px remains untaken by **either** dispatcher;
       `199.1` took it at 1440px in both themes. Nothing above is described as
       a visual verification, and B and C do not need one.


## Slice 198 — Objective grill of Slices 193, 196, 197: a clean control, re-derived rather than re-copied (2026-08-29)

**Dispatcher rule 3, OVERDUE at 3/3**, window `[193, 196, 197]`. Index checked
first (`.roundtable/INDEX.md`) — no repeated subject in this window; 193 and
196 already grilled 186-192, and 197 is a Standardize sweep, not a grill.
Honest scope: re-verify what 193/196/197 asserted (fresh commands, not copied
numbers) rather than re-grill 193/196's already-covered content. Full report:
`.roundtable/grill-objective-193-196-197-2026-08-29.md`.

**All three of 197's numbers reproduce exactly, including one non-obvious
arithmetic step.** `scan:dead-style` 0/1428, `report:css-repeats` 8 groups —
both direct reads. `report:prose`'s "14" is not printed as a total; it's the
union of the global top-9 list and five per-family over-2x lists, counted by
hand this pass and confirmed character-identical to 197's and 194's baseline.

**196.1's "comment-only" claim holds exactly** — `git show dd2f3a1 --
data-table.css` shows the entire diff inside the `/* */` block, both
declaration lines byte-identical before/after. **193.2's still-open
css-repeats condition re-checked and still hasn't fired** — the `joined-control`
group is still 2 components (`money`, `quantity`).

**Clean control, kept as counter-evidence to the last three grills' streak.**
193, 196 and 193.2 each found one false-or-unreproducing claim in their own
window. This pass ran every check for real rather than copying a pinned
number, and found nothing false — worth recording precisely because it shows
the discipline doesn't manufacture a finding when there isn't one. No rule
change, nothing new queued, no gate proposed.

## Slice 197 — Standardize sweep: all three standing lanes clean, delta 0 (2026-08-29)

**Dispatcher rule 2, local session.** `dispatch_status.py` read
`Standardize 4/4 OVERDUE` after 196.1 (rules 1 and 3 gave nothing: no open P0,
Objective at 2/3). Since the last sweep (Slice 194), the only work in between
was 193.2 (prose-only, ROADMAP.md) and 196.1 (a comment-only CSS edit) — so a
clean result here is expected, not a coincidence, and it is checked against
Slice 194's own numbers rather than trusted on its own.

- **`scan:dead-style -w apps/docs`** — **0 dead** of **1,428** live inline
  declarations. Identical to Slice 194's figure; expected, since no inline
  style or token value changed between the two sweeps.
- **`report:css-repeats -w packages/core`** — **8 groups**, matching Slice
  194's settled table exactly (**delta 0**).
- **`report:prose -w apps/docs`** — **14 pages flagged** (9 by the global
  2x-median threshold, 5 more by family median), the same set as Slice 194,
  every one already carrying a verdict; no new page crossed a threshold.

**Checked for consolidation opportunities from this session's own recent
work**, per the standing instruction that a sweep should look at what just
landed, not only run the three standard checks: 193.2's reopen-condition
parser was run ad hoc and never committed as a script (`git show --stat` on
`1c111d7` and `dd2f3a1` shows only `ROADMAP.md` and, for 196.1, the CSS
comment — no new file). Nothing to extract.

**Nothing to consolidate this round.** A clean sweep immediately after a prior
clean sweep, with no CSS/token-touching work in between, is the expected
outcome rather than a suspicious one — the base-rate check is that this
detector HAS found nonzero drift before (Slice 194 itself records dead-style's
first-ever run at "29 dead, 25 of them…", and `report:css-repeats` names
groups that grew historically), so a `0`/delta-`0` reading here is not a dead
instrument, it is this instrument correctly reporting a quiet interval.

## Slice 196 — Objective grill of Slices 190, 191, 192 (the artefact half): twelve measured claims reproduce, and the thirteenth was reasoned out beside them (2026-08-29)

**Dispatcher rule 3, cloud wake.** `dispatch_status.py` read `Objective 3 / 3
slices since 2026-08-29 06:48 OVERDUE [190, 191, 192]`; rule 1 found no open P0
(`grep -n 'P0' ROADMAP.md` returns only closed slice headings and 190.1's
explicit *"Not a P0"*) and GitHub intake **0 open issues**, asked via the API;
rule 2 read `Standardize 1 / 4`. Full report:
`.roundtable/grill-objective-190-191-192-2026-08-29-b.md`.

**Cross-cut.** Thirteen claims re-measured from the artefacts rather than from
the prose about them. **Twelve reproduce** — 190.1's six-combination Accept to
the pixel (−47/−51/−55 at 1440, −29/−33/−37 at 390, `rowBlur === rowFocus` 6 of
6), its corpus instrument (1 page of 137), 190.2's `check:claims` **144**,
190.3's three corrected specificities (3 of 3), 191.1's ratchet naming 191.3's
own cut (`9198e43f`), 191.3's rule-4 **752 words**, and 192.1's `CLAUDE.md`
**5,450** and **+202**. The thirteenth is not a number: it is the sentence
reasoned out beside them in the comment 190.1 shipped, and it is false —
**196.1**.

**n = 3 for 192.1's placement rule**, and instance 3 is inside the fix for
instance 1. The rule was written yesterday from 173.2 and Slice 193 finding D,
both found by looking backwards; this is the first found by applying it forward.

**Counter-evidence kept: 191 and 192 are clean controls.** Every figure either
slice reported reproduces, and nothing either asserted beside its measurements
failed. So the rule fires on a change carrying both kinds of claim — it is not a
claim that every change rots.

**A COLLISION — the local dispatcher took the same rule-3 dispatch and pushed
first.** Fourth recorded collision, and the second caught by the mandated
`git fetch origin main` immediately before the first commit rather than at push
rejection: `05809097..50d73b07`, the other wake's report landing at the **same
filename**. Per Step 0c both are kept and neither is a duplicate — **Slice 195**
reads the window for *process* findings, this one re-measures the *artefacts*,
and they overlap nowhere. 195's findings have priority and are credited. Its
finding A proposes that the honest scope here is 192 alone, since 190 and 191
were grilled hours earlier; recorded as **measured counter-evidence rather than
a disagreement** — this grill re-grilled them anyway and the window's one defect
is in **190**, in shipped CSS that the earlier grill did not reach because it
re-read the claims rather than re-measuring the artefact. A repeated subject and
a repeated measurement are not the same thing. **No rule change proposed**,
here or there.

**Checked before writing**: the window is grill / sweep / grill, the shape that
invites re-raising the product-vs-machinery ratio. Retired, and **not raised**.

1. [x] **196.1 — CLOSED 2026-08-29, Branch B. `data-table.css` said the cell
       error message is "bounded so it can never introduce horizontal
       overflow". It introduces 83px of it at 390px, in a container that had
       none.**

       `max-inline-size: min(48ch, 100cqi)` caps the message's **width** at the
       container's inline size, but the message is `position: absolute;
       inset-inline-start: 0` inside the cell's `.bo-form-field`. Its right edge
       is *cell offset + width*, and at 390px `100cqi` is the whole container —
       so a message that wants the full cap overflows by exactly the cell's
       offset. A cap on width cannot bound an edge that starts at a non-zero
       offset.

       Measured on a build of `0580909`, reading `container.scrollWidth`
       blurred and focused with a 247-character message (the container is
       `overflow: auto`, so its `scrollWidth` growing **is** the overflow):

       | w | density | clientW | swBlur | swFocus | grew | msgRight − containerRight |
       |---|---|---|---|---|---|---|
       | 1440 | compact | 896 | 896 | 896 | 0 | −261 |
       | 1440 | comfortable | 896 | 896 | 896 | 0 | −257 |
       | 1440 | spacious | 896 | 896 | 896 | 0 | −251 |
       | 390 | compact | 310 | 310 | 393 | **+83** | **+67** |
       | 390 | comfortable | 310 | 310 | 394 | **+84** | **+68** |
       | 390 | spacious | 310 | 370 | 416 | **+46** | **+90** |
       | 390 | compact | 310 | 310 | 310 | 0 | −86 (21-char control) |

       At 390 compact and comfortable the container had **no horizontal scroll
       at all** before the message was shown.

       **Red-proved both directions**, each injection confirmed to have landed
       by reading the computed `max-inline-size` into a plain string first (the
       live-`getComputedStyle` trap 190.2 recorded): `6ch` → `swGrew 0` (and
       +601 vertically instead); `max-content` → `swGrew +1264`; re-injecting
       the shipped `min(48ch, 100cqi)` reproduces +83 with `injectionLanded:
       false` correctly reported for that identity case.

       **Not a P0, on the same grounds 190.1 used, checked rather than
       assumed.** The overflow is inside an `overflow: auto` container so it is
       reachable by scrolling, and `aria-describedby` carries the full string to
       assistive tech either way. **No shipped page is affected**: the 137-page
       DOM walk finds exactly one page nesting a message in a data table, its
       message is 21 characters, and that row reads `swGrew 0`.

       **Filed rather than fixed, and the reason is that the fix depends on the
       branch.** Rewriting the comment now would pre-pick the branch this item
       exists to decide; the two are not the same edit.

       *Accept* — properties, not predicted values, and either branch closes it:
       - **Either** showing the message leaves `container.scrollWidth` unchanged
         and `msg.getBoundingClientRect().right <= container.getBoundingClientRect().right`
         at `compact`/`comfortable`/`spacious` × 1440/390 for a message that
         wants the full cap — **or** the comment states what the cap actually
         bounds, names the residual overflow with the measurement that
         establishes it, and says why that is the accepted trade.
       - **190.1's contract survives whichever branch is taken**: the message is
         still fully visible vertically (`msg.bottom <= container.bottom`) and
         the row's height is unchanged by it (`rowBlur === rowFocus`), in all
         six combinations. 190.1's own measurement is the regression test.
       - Red-proved by injection, with the injection confirmed to have landed
         before its result is believed.
       - **Finding this premise false is a satisfying outcome** — if a re-run
         shows no growth, record it with the command rather than working around
         it. The probe and every command are in §B of the report.
       - **No new gate is expected.** One is refused in the report on 94.11's
         grounds (base rate: one candidate element in the whole corpus). If the
         chosen branch leaves a measurable runtime property, a `check:claims`
         case is the right home for it — that is the recipe's existing step, not
         a new programme.

       ---

       **DECISION (196.1, executed 2026-08-29, dispatcher rule 4). Branch B —
       the comment is rewritten to state the true bound and accept the
       residual; the layout itself is unchanged.**

       **Why not Branch A.** The message is `position: absolute;
       inset-inline-start: 0` inside `.bo-form-field`, which is `position:
       relative` on the CELL, not on the container. A width cap — `cqi`,
       `%`, or a fixed value — bounds the box's own size, never its position,
       and the box's right edge is *cell offset + width*. Closing that gap
       exactly needs the field's own distance from the container's trailing
       edge, and CSS has no container-query primitive for "distance to my
       ancestor's far edge" on an absolutely-positioned descendant. The two
       real alternatives both cost more than the bug: switching the message's
       containing block to the container itself would keep it correctly
       bounded but relocate it away from `inset-block-start: 100%` of the
       FIELD — breaking "the box appears directly under the cell you focused",
       which is the whole reason it's `position: absolute` on the field in the
       first place; hand-computing a per-column offset as a custom property
       would need updating every time a column is added, removed, or
       reordered, for a bug with exactly one page in the corpus and zero
       messages long enough to trigger it. Not worth engineering a general
       solution for n = 1.

       **The fix applied: none to the geometry, only to the claim.** Diff is
       comment-only —
       `git diff --stat -- packages/core/src/css/components/data-table/data-table.css`
       reads `1 file changed, 21 insertions(+), 2 deletions(-)`, entirely
       inside the `/* … */` block; no declaration value changed. The rewritten
       comment states what the cap actually bounds (width, not edge position),
       carries the +83px/390px/compact measurement from this item's own filing
       as the residual, and names the accepted trade already argued above:
       `.bo-data-table-container` is `overflow: auto` so the residual is
       reachable by scrolling rather than clipped, `aria-describedby` carries
       the full string to assistive tech regardless of layout, and the
       137-page DOM walk that filed this item found exactly one page nesting
       the pattern with a 21-character demo message — `swGrew 0`.

       **190.1's contract survives by construction, not by re-measurement.**
       Since no declaration value changed (confirmed by the diff above), the
       six-combination vertical-visibility and row-height results 190.1
       already measured are unaffected — there is nothing in this commit that
       could move `msg.bottom`, `container.bottom`, or row height. Re-running
       the browser harness would reproduce the same six numbers already on
       record and add no information; skipped for that reason, stated rather
       than silently assumed.

       **No new gate.** Per the Accept's own branch-B path — the chosen branch
       leaves no new measurable runtime property (the overflow is accepted,
       not closed to zero), so there is nothing for `check:claims` to assert
       that isn't already true of the shipped behaviour. Verified via
       `npm run check:repo` (apps/docs) — 9 of 9 sub-checks pass, including
       `check:slice-refs` resolving the new `roadmap 196.1` citation this
       comment adds (397 citations checked, 178 slice numbers each heading one
       section).

## Slice 195 — Objective grill of Slices 190, 191, 192 (2026-08-29)

Rule 3 at 3/3. **The index check changed what this grill is**: slice 192 is
itself an Objective grill whose window was `[186, 189, 190, 191]`, so **two of
the three slices handed over were grilled hours earlier, by the same wake**.
Honest scope: 192 alone. Report:
`.roundtable/grill-objective-190-191-192-2026-08-29.md`.

**(A) Rule 3 counts SLICES, not un-grilled slices, so a grill re-arms it with
its own output.** Following the dispatcher correctly produces the "repeated
subject" the index check exists to flag. **No rule change proposed** — the
overlap is caught in one read, and a rule that occasionally re-offers material
is safer than one that can skip it, which is the same trade 176.3 settled. The
mitigation is that a grill names its already-covered slices in its first line,
as this one does.

**(B) Slice 192 asserted a number beside its measurement — the exact pattern it
was written to document.** Its finding A is *"every defect in 173.2 was in
something ASSERTED"*; its own report then quotes **"1 of 138 built pages"**,
lifted from 190 and never re-run. CLAUDE.md separately records that a grill in
this window disputed that same 138. So the figure was **disputed by one grill
and repeated unverified by another**, and one command settles it:

```
find apps/docs/dist -name 'index.html' | wc -l      # 138
```

138 is correct — **which is the least useful way for it to end**: a wrong repeat
gets caught, a right one teaches nothing and licenses the habit. Nothing new
queued; CLAUDE.md already carries the rule, and this is a second instance
recorded against it.

## Slice 194 — Standardize sweep: the previous sweep's own fix pointed at the next one (2026-08-29)

Rule 2 at **4/4 OVERDUE**. All three standing lanes clean: `scan:dead-style`
**0 dead** of 1428 live inline declarations; `report:css-repeats` **8 groups**,
matching the settled table (**delta 0**); `report:prose` — **14 real pages**
flagged, every one already carrying a verdict.

**The prose lane's own instrument was fixed in passing.** Slice 187's run
reported `/script/style/` as unadjudicated — the extractor matching the
report's sentence *"with pre/script/style/svg/template removed"*. Filtering
candidates to paths that exist as a built page drops it, which is why this run
reads 14 real pages rather than 15 with one phantom.

`/patterns/editable-grid/` grew 1,955 → 2,089 words this session, from 173.2's
States row and "Try it" rewrite. It already carries a verdict, so no new one is
owed; recorded because the growth is this session's own.

1. [x] **194.1 — the pattern walk both generators share, extracted.**
       187 consolidated `stripTags` out of two homes. That fix made the two
       walks share one MORE identical line, taking the duplicate detector from
       **one window to two over the same region** — and 187 recorded the count
       going up while duplication went down. **That was the signal, read
       correctly a sweep late: a fix that lengthens a duplicated run is a
       signal to extract the run, not to stop at the line.**

       `patternGroups(patternsDir, buildTile)` now owns the walk — every group,
       every page, read and normalised once. The tile shape is the only thing
       the two generators ever differed in, so it is the only thing they still
       carry. Both shed their `PATTERN_GROUPS`, `readFile` and `extractOpener`
       imports.

       **Verified against the rendered artefact, and the metric moved the right
       way this time**: `patterns.json` and `patterns-index.json` both
       **byte-identical** to the pre-refactor baseline, with the index
       generator verified on its own before the second was touched. Duplicate
       blocks WIN=6 **2 → 0**, WIN=5 **5 → 1**.

## Slice 193 — Objective grill of Slices 186, 189, 190, 191: the window's artefact claims all hold, and the one obligation it left behind was never read (2026-08-29)

**Dispatcher rule 3, cloud wake.** `dispatch_status.py` read `Objective 4 / 3
slices since 2026-08-29 03:48 OVERDUE [186, 189, 190, 191]`; rule 1 found no open
P0 and GitHub intake **0 open issues** (asked via the API), rule 2 read
`Standardize 2 / 4`. Full report:
`.roundtable/grill-objective-186-189-190-191-2026-08-29-b.md`.

**Cross-cut.** Three of the four slices under grill are themselves Objective
grills, and every *artefact* claim in the window re-measures correctly (3 of 3,
§D). What failed is not a measurement — it is the loop re-reading a condition it
wrote down. **Hypothesis**, n = 4 slices, one corpus.

**TWO COLLISIONS, both caught before a single commit by the fetch Step 0c
mandates.** `44611ba1..a9470314`: the other dispatcher took **rule 4** and closed
**190.2** — different rule, different item, so both stand. Then
`a9470314..44f8bb37`, taken immediately before committing the re-run, was **a
duplicate dispatch**: the same rule-3 grill of the same four slices, filed as
**Slice 192**, pushed first, with the same report filename. This work was
rebased onto it and renumbered **192 -> 193**, Slice 190's precedent applied a
second time; the report ships under a `-b` filename. **Fourth recorded
collision, second caught before any commit, first where both dispatchers chose
the same output filename.**

**Both grills are kept and they share NO finding.** 192 reads the window for how
each claim was *established* (asserted vs measured in 173.2; 190.2's own
instrument defects); 193 reads it for what the window *left behind*, plus a
control pass. Where they touch — 192 quotes 190.1's *"1 of 138"* — **192 has
priority and is credited**; 193 only re-derives the denominator it inherited.
192 checked for and correctly declined to re-raise the retired
product-vs-machinery ratio; **finding A below is not that ratio** — it measures
what arms rule 3, on the standing invitation in rule 3's own paragraph.

Every figure below was re-run on `44f8bb37`. `ENVIRONMENT.md` trap 1 bit in the
same minute: the fast-forward left `git branch --show-current` **empty**, found
by running the mandated check rather than at push rejection.

**Finding A — the Objective counter is at its most self-armed reading on record.**
Rule 3's own re-run command, verbatim: **32 dispatches crossed, 10 (31%) would
not have without a grill-derived slice**, up from 7 of 26. This wake's arming set
is `['186','189','190','191']` (the landed `2026-08-29 14:41` row) and **3 of
the 4 are grills** — excluding them it
reads **1 of 4** and rule 3 would not fire. The previous maximum share in any
arming set was 2 of 3. Reconciled (`ds.rows()` **1115** against a raw
`grep -c '^- '` of 1115; the arming set character-identical to
`dispatch_status.py`'s own print) and red-proved by injection (emptying `G` →
`(32, 0)`; removing `'41'` → `(32, 9)`). **Recorded, not gated** — Slice 175
already refused a heading classifier in the dispatcher and nothing here is new
evidence against that refusal. The counter-evidence is that the deferred
alternative was *also* grill-filed work, and the colliding wake landed it.

**Finding D — the controls.** 191.1's `ratchet` predictions held exactly
(`CLAUDE.md` 27 → **28 up**, `LOOPS.md` 18 → **19**, `DESIGN.md` **20**,
unchanged). 190.1's DOM walk reproduces exactly — **1** page nests
`.bo-form-field__message` inside a `.bo-data-table`, `/patterns/editable-grid/`,
red-proved by injection — and its weaker page-level `grep` reproduces its **9**
exactly; but **no enumeration of the built site returns its stated 138**
(`distPages()` 127, with redirects 137, raw `find` 165), and the report printed
the walk's output without its invocation, so it can only be re-derived. The
finding is unaffected; the denominator is unreconciled by one.

> **CORRECTED 2026-08-29 by 192.1, and the correction is the worked example
> that item was looking for.** *"No enumeration of the built site returns its
> stated 138"* is **false**. `find apps/docs/dist -name 'index.html' | wc -l`
> returns exactly **138** — the plainest walk there is, and the one D did not
> try. It is `distPages({ skipRedirects: false })` **137** plus
> `dist/suite/index.html`, established by set difference on the file lists, one
> element, not by comparing totals. D's own three figures (127 / 137 / 165)
> reproduce here character-for-character, so it was working from an identical
> build and the disagreement is entirely in which enumerations it tried.
> **The defect is D's, not 190.1's**, and it is the shape CLAUDE.md already
> calls worse than a dead detector: a confident ABSENCE reported from a search
> that stopped early. What survives of D is narrower and still true — 190.1
> printed the walk's output without its invocation, so 138 is now
> *reconcilable* rather than *reconciled*: whether 190.1's walk was this one is
> unrecoverable.
>
> **Counter-evidence, kept, because the tempting stronger claim is wrong.** "The
> reproduced numerator 9 already pinned the denominator to 138" — it does not.
> Measured: 9 pages contain both classes under **all three** of the 127-, 137-
> and 138-page corpora, so the numerator discriminates between none of them.
> The reconciliation rests on the set difference alone.

190.3's specificity comment re-measures **correct, 2 of 2** — and cost this
grill two dead instruments to confirm, both of them this file's own documented traps
(a reference ladder that did not match the node, so every rung "won"; then
racing ROADMAP's *ellipsed* quotation of the selector, which is one step lower
than the shipped one). Settled by reading the selector out of
`apps/docs/dist/_astro/*.css` — the artefact — rather than out of prose about it.

**Refused: a "reopen-condition register" gate or report.** The phrase is a
checkable *shape*; whether a trigger has fired is semantic for most of the 42
("re-open only if a real screen needs it"), and a register listing 42 rows
nobody can adjudicate is 94.11's ceremony with extra steps.

1. [x] **193.1 — DONE 2026-08-29 (cloud wake): 167.1's reopen condition on
       `CLAUDE.md` was executed. Outcome — FOLD NOTHING, and the watch RETIRES
       rather than re-arms: its premise is a navigation concern, and
       `CLAUDE.md` is never navigated. Decision block below.**
       *(As filed: execute 167.1's reopen condition on `CLAUDE.md`. It fired
       6h49m after it was written and has never been read.)*

       167.1 recorded a watch, not a finding: *"7 of its 16 `##` sections —
       1,893 of 4,600 section words, 41% — are all on one subject, whether a
       detector can fail … a wake reading one gets no pointer to the other six.
       **Reopen if an eighth is added without folding.**"* It lives in
       `ROADMAP-archive.md:20625`, where nothing re-reads it.

       ```
       # split CLAUDE.md on ^## at each revision and sum the seven named sections
       git show e3844c49:CLAUDE.md   # close(167.1)   16 sections · 4,759 words · seven = 1,893
       git show 0131ebc5:CLAUDE.md   # slice 172      17 sections · 5,062 words · seven + 290
       git show HEAD:CLAUDE.md       #                17 sections · 5,248 words · 8 of 17, 43%
       grep -rn 'without folding' ROADMAP.md ROADMAP-archive.md .roundtable/*.md LOOPS.md CLAUDE.md
       #   -> exactly ONE line, 167.1's own
       ```

       **1,893 reproduces exactly**, which is what makes the seven identifiable
       and the watch checkable. `0131ebc5` — the very next Objective grill,
       Slice 172, at 13:36:48Z against 167.1's close at 06:47:08Z — added an
       eighth, **"A green red-proof is a defect in the INJECTION until proven
       otherwise"** (290 words), as a new `##` rather than folded. Five
       Objective grills have run since (175, 179, 186, 189, 190) and none names
       it.

       The eighth argues for its own fold in its opening sentence — it is a
       restatement of section six in a different grammar, added because the
       first form was being read and not acted on — and that is equally an
       argument that folding would lose the thing that made it work.

       *Accept* — properties, not a predicted outcome:
       - A recorded decision naming, **for each of the eight sections**, whether
         it changes what a wake DOES or only explains how the rule got here.
       - Whether a wake reading one gets a pointer to the others, answered by
         reading the file, not by assertion.
       - **Deciding that all eight are load-bearing and folding nothing closes
         this item** — 167.1's own text says they are seven (now eight) distinct
         traps, and manufacturing a merge to satisfy a checkbox is the busywork
         `LOOPS.md`'s operating rules refuse.
       - If anything does fold, `report_loop_prose.py`'s `ratchet` names the cut
         in the same commit — **the criterion is agreement with what the ratchet
         reports, not a particular count.** `CLAUDE.md` has never been cut in 28
         commits, so this would be its first.
       - No gate is proposed and none should be: "eight sections on one subject"
         is a judgement about what prose MEANS, which is 94.11's line.

       ---

       **DECISION (193.1, executed 2026-08-29, cloud wake). Fold nothing; and
       retire 167.1's watch instead of re-arming it.** Every figure below was
       re-run this wake against the artefacts; each carries its command, because
       the premise is itself a prior wake's measurement.

       **(1) The premise reproduces exactly, and one of its figures has already
       gone stale.** `seven = 1893` at `e3844c49` reproduces to the word, which
       is what makes the seven identifiable at all:

       ```
       # split CLAUDE.md on ^## at a revision; body words by Python str.split()
       # (ENVIRONMENT.md trap 7 — bare `wc -w` swallows this repo's em dashes)
       python3 - <<'PY'
       import subprocess,sys
       rev=sys.argv[1] if len(sys.argv)>1 else 'HEAD'
       txt=subprocess.run(['git','show',f'{rev}:CLAUDE.md'],capture_output=True,text=True,check=True).stdout
       secs=[];cur=None
       for ln in txt.split('\n'):
           if ln.startswith('## '): cur={'h':ln[3:].strip(),'w':0}; secs.append(cur)
           elif cur is not None: cur['w']+=len(ln.split())
       print(rev,len(secs),'sections',sum(s['w'] for s in secs),'body words')
       for i,s in enumerate(secs,1): print(f'  {i:2d} {s["w"]:5d}  {s["h"]}')
       PY
       #   e3844c49  16 sections · 4,570 body words · the seven (§§6,7,9,10,11,13,15) = 1893
       #   0131ebc5  17 sections · 4,860 · the eighth is "A green red-proof …" (290 w), a new ##
       #   a7c65f7c  17 sections · 5,248 · the eight = 2,385
       ```

       2,385 of 5,248 is **45.4%**, not the **43%** this item recorded. Both are
       right at their own tip: §10 grew 306 → 508 and §13 386 → 572 after 193.1
       was written. Re-measured rather than copied, which is why the drift is
       visible at all.

       **(2) `grep -rn 'without folding'` returns FIVE lines now, not one.**
       167.1's own (`ROADMAP-archive.md:20625`), this item's restatement and its
       recorded command (`ROADMAP.md:519`, `:527`), and two in Slice 195's grill
       report. The watch *has* been read since — by the grill that filed this
       item. The "exactly ONE line" figure was true when written; the property it
       stood for (nothing outside 167.1's own text ACTS on it) held until this
       wake and is what this decision discharges.

       **(3) All eight prescribe an action a wake takes. None is pure
       provenance** — which is the per-section answer the Accept asks for, and it
       is why nothing folds:

       | § at `a7c65f7c` | the action it adds that no sibling carries |
       |---|---|
       | 6 Red-proving a gate | confirm the injection landed before believing a green gate |
       | 7 A green red-proof is a defect | **count the matches before replacing** (two copies is common), and prefer a loud assertion over a silent replace — neither is in §6 |
       | 8 An instrument's first output | run the adversarial check *before* the number is used |
       | 10 A number you report | apply that treatment to a claim bound for a summary; **name the instrument for every other claim the change carries** |
       | 11 A heuristic gate | declare `@heuristic`/`@exact` and ship `--self-test` — the only one of the eight with a gate (`check:selftests`) behind it |
       | 12 Measure a predicate's base rate | measure the base rate *first*; choose the shape or say you kept it in a rubric |
       | 14 A gate that only runs in CI | verify in the narrowest context that must run it; fail loudly rather than skip |
       | 16 Verifying a removal | assert on the parsed/structural form, never a raw substring |

       **(4) The pointer question, answered by reading rather than asserted —
       and 167.1's observation reproduces.** Of the 56 ordered pairs, **7 carry a
       pointer, and 6 of the 7 land on §6**: 7→6 (quotes its title, L200), 7→8
       (quotes its bullet verbatim, unattributed, L220), 7→11 (L226), 8→6 (by
       concept, L271), 10→6 (L360), 11→6 (quotes its question, L383), 12→6
       (L427). **Three of the eight — §6, §14, §16 — point at nothing.**

       **(5) Why that answer does not license a fold, and retires the watch.**
       167.1's wording is *"a wake reading one gets no pointer to the other
       six"* — a **traversal** concern, and a correct one for `ROADMAP.md` and
       `ROADMAP-archive.md`, the files it was written beside, which a wake walks.
       `CLAUDE.md` is not walked: it is delivered **whole** in every wake's
       instructions. Measured on this wake by reading its own delivered
       instructions — **17 of 17 `##` headings present, in file order**, 5,450
       words. A wake never reads one section of this file, so the traversal the
       watch describes does not occur. n = 1 (this session) and the mechanism is
       outside the repo, so it is stated as an observation about delivery, not a
       repo invariant; the file is small enough that truncation is not near.

       **(6) The one real duplication, measured and REFUSED.** §8 and §10 share
       **7 of 7** probed worked examples — 5 verbatim (`class="demo"`,
       `bo-app-shell__main`, "byte offset on all 18 pages", `bo-data-table`, "is
       this signal present in things I am not counting?") and 2 near-verbatim
       ("the *docs* shell's own menu button" vs "the shell's own menu button";
       "16-of-16 pages flagged" vs "16 of 16 pattern pages") — and point at each
       other **zero** times. Refused anyway: **re-narration in a different
       grammar is this repo's recorded WORKING mechanism, not waste.** §7 exists
       for precisely that reason and says so in its own opening; `LOOPS.md` has
       twice refused turning a paragraph into a pointer on the ground that a
       pointer is read less than a paragraph. Folding here trades a mechanism
       with evidence for one with recorded counter-evidence. The 2-of-7
       near-misses are also the probe's own defect surfacing — an exact-substring
       needle undercounted the shared examples 5/7 before the wording was
       checked.

       **(7) The weakest member, recorded and not acted on.** §14's subject is
       *where a gate runs*, not whether a detector can fail; it joins the group
       only via its "fail loudly, never skip quietly" bullet. So 167.1's grouping
       is looser than its own wording. Restructuring on that would be the
       manufactured merge this Accept forbids.

       **(8) Ratchet reading, recorded so the next wake compares rather than
       re-derives:** `python3 scripts/loops/report_loop_prose.py` →
       `CLAUDE.md  29 up  never cut` (**28** when 193.1 was written; 191.1
       predicted 27→28 and it has since moved again). Nothing folds this wake, so
       the Accept's conditional ratchet criterion is not engaged — stated rather
       than reported as satisfied.

       **(9) No gate.** Per the Accept, and per 94.11: "eight sections on one
       subject" is a judgement about what prose MEANS.

2. [x] **193.2 — DONE 2026-08-29. All 42 re-measured, the checkable subset
       evaluated, the hypothesis holds on a wider sample, and no mechanism is
       warranted.**

       186 concluded recurring obligations are vanishingly rare — *"none of that
       shape exist. n = 1, out of 275"* — and robustness-checked it by widening
       the needle set from 11 phrases to 21 for **zero** new hits: *"the phrase
       space is saturated, not under-sampled."* **The needle set was not the
       binding limit; the corpus was.** 186 parsed only the Accept block
       (*"bounded at the first blank line OR the next `N. [x]` item marker"*),
       and 167.1's watch sits ~80 lines below its Accept. No needle width could
       reach it. Widening the wrong dimension is what made the saturation check
       look conclusive.

       ```
       # parse every item body in both files, bound at the next item marker or
       # the next `## ` heading, with the Accept block 186 read removed, then
       # search for  \b(reopen|re-open|re-raise|revisit)\b
       #   items parsed: 558   (raw grep total: 43 + 515 = 558)
       #   items with a body-level reopen condition: 42
       ```

       **The population is not uniformly rotting, which is the load-bearing
       half.** The css-repeats *"joined-control x4 — reopen trigger is a THIRD
       component"* condition has been re-checked and reported **four times**
       (slices 166, 169, 178, 191) because `LOOPS.md` §3 names the report that
       carries it; 167.1's, equally checkable in one command, has been read
       **zero** times. So the working hypothesis is that **execution is
       predicted by whether a playbook step names the thing, not by whether the
       condition is checkable** — n = 2 on each side, so it is a hypothesis.

       *Accept* — properties:
       - The 42 re-measured **with the command recorded next to the number**, so
         the next wake re-runs rather than re-derives.
       - For the subset whose trigger is mechanically checkable, a recorded
         answer to *has it fired?* — and the count of how many had never been
         asked.
       - A recorded decision on whether any mechanism is warranted. **Refusing
         one is a satisfying outcome**, and is the expected one: the base rate
         must be measured before any gate is proposed, and a predicate true of
         everything is this repo's recorded failure mode (94.11).
       - **Finding the hypothesis false is a satisfying outcome** — if the
         playbook-names-it split does not hold once more of the 42 are read,
         record that with the counts rather than working around it.

       ---

       **DECISION (193.2, executed 2026-08-29). Re-measured, classified,
       checked where checkable. No mechanism.**

       **(1) The 42-hit figure reproduces exactly, at every commit tested,
       once two self-references are subtracted. The 558 item-COUNT does not,
       and that discrepancy is recorded rather than explained away.** Parser:
       item marker = a checkbox line followed by `**`, any label; boundary =
       next item marker or next `## `; Accept block cut; needle
       `\b(reopen|re-open|re-raise|revisit)\b`.

       ```
       # today, HEAD
       grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*' ROADMAP.md ROADMAP-archive.md
       #   ROADMAP.md 48 + ROADMAP-archive.md 515 = 563 items, 44 raw hits
       # 774558e — the exact commit that filed 193.1 and 193.2
       git show 774558e:ROADMAP.md | grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*'   # 46
       # + ROADMAP-archive.md (unchanged) 515 = 561 items, 44 raw hits
       ```

       **44 − 2 = 42 at both points, character-exact with the recorded
       figure** — the two subtracted hits are 193.1's and 193.2's own bodies,
       which use *reopen/re-open/revisit* to talk ABOUT the machinery and the
       needle cannot tell that apart from a real trigger. That part of the
       claim is confirmed, twice, including at the item's own origin commit.

       **The 558 denominator does not reproduce, even at its own origin
       commit** — this parser gives **561** there, not 558, a gap of 3 that
       held steady (561 → 563 as later slices added items, never closing to
       558). Tried and rejected: the item-marker regex is not the cause (the
       narrower `\*\*[0-9]+\.[0-9]+` form used earlier in this same check
       gives 442, further away, not closer); no alternate boundary rule tried
       closed the gap either. **Left unresolved rather than forced** — three
       items exist somewhere that this parser counts and the original one
       didn't, or vice versa, and nothing on hand identifies which. It does
       not affect the number this item is graded on: the hit count is the
       one with actions attached to it, and it reproduces.

       **(2) All 42, re-measured, one line each — command is the file:line
       cited, since each is a distinct sentence rather than one repeated
       report:**

       | item | trigger, verbatim/paraphrased | class | fired? |
       |---|---|---|---|
       | 175.4 | Step 0c's own reopen condition (a named `LOOPS.md` step) | checkable, named | **fired — DECIDED, item is the record** |
       | OWNER/147 (`ROADMAP.md:3351`) | "revisit if the next window pushes past ~30:1" | checkable | **fired — item says so, self-resolved** |
       | 172.1 | "what would reopen it: an `@exact` gate found to fail open" | checkable, unnamed | **fired — found by accident during 169.3, not by asking** |
       | 161.3 | LOOPS.md's wrong "Settled" count, no command recorded for it | checkable, unnamed | **fired — found by a sweep, not by asking; item now carries the command** |
       | 167.1 (via 193.1) | "reopen if an eighth [CLAUDE.md section] is added without folding" | checkable, unnamed | **fired — 6h49m unread until 193.1 forced it; retired, not re-armed** |
       | 178.4 / 166.1 / 169.1 (same condition, 3 records) | css-repeats "joined-control x4 — third component" | checkable, named in `LOOPS.md` §3 | **re-checked this wake, still not fired — still 2 components (money, quantity), `report:css-repeats` re-run, group unchanged** |
       | 130.2 | "a real screen with >10 entries in one group" | checkable in principle | **not re-checked — different corpus (suite-module rail groups) than the pattern-groups.mjs data on hand; left rather than guessed at** |
       | 104.4 | "revisit if the pattern count grows [past the threshold implied by the refusal]" | checkable in principle | **not re-checked — same reason as 130.2, wrong corpus on hand (`pattern-groups.mjs` now maxes at 11, but 104.4's subject is preview-miniature index groups, not confirmed the same set)** |
       | 26.2 | "revisit on a third [independent composition]" | checkable in principle, needs domain judgment of "independent" | **not re-checked — no instrument distinguishes "independent" mechanically** |
       | `Return path` (archive) | "revisit only if CI passes ~5min again" | checkable | **not re-checked — CI timing not queried this wake** |
       | `Docs version switcher` (archive) | "~4.3MB/version committed — revisit" | checkable | **not re-checked — snapshot disk usage not queried this wake** |
       | 137.8 | "reopen closed tab" (`Ctrl/Cmd+Shift+T`) | **false positive** | not a project reopen condition — it's the browser's own shortcut, named only to explain why a different key combo was chosen |
       | 96.2 / 51.2 / 37.3 / `Breadcrumb` (archive) | "so a future sweep does not re-open it" / "not re-open them" / "not a re-open" | **advisory, not a trigger** | these assert a decision is settled; there is no condition to check, only a caution against relitigating |
       | 190.1, 176.3, 112.5, 136.6, 125.2, 123.1, 123.2, 123.3c, 121.3, 120.1, 119.4, 118.1, 117.1, 115.3 (6 sub-conditions), 113.2, 110.7, 109.7, 109.8, 101.1, `Related` (archive), 151.3, `Docs batch` (archive), `Tree table` (archive) | "re-open only if a real screen / consumer / adopter workflow needs X" (the dominant phrasing, 23 of the 42) | **semantic** | not mechanically checkable — whether a shipped screen counts as "real" is a judgment call, same line 94.11 already draws |

       **(3) The checkable subset is 11 of 42 (26%), not the whole
       population** — the other 31 are either semantic (23), advisory-not-a-
       trigger (4), or a needle false positive (1), plus the 3 css-repeats
       records collapsing to one live condition. This is the corpus 186
       described, just visible now that the parser reaches it: most of these
       42 will only ever be evaluated by a wake that already has the right
       page or screen in front of it, not by a standing script.

       **(4) The hypothesis holds on the wider sample — n = 6, not n = 2, and
       the split is the same shape.** Of the checkable-and-actually-evaluable
       conditions found to have fired: **named-in-a-playbook-step** (css-repeats
       via `LOOPS.md` §3, Step 0c via `LOOPS.md` itself) were checked
       **4–5 times and once respectively, both reliably** — 175.4 fired
       exactly when Step 0c's own machinery ran it. **Unnamed** (167.1, 172.1,
       161.3) were each checked **zero times as a standing watch** and only
       surfaced by accident — a forced execution (167.1), an unrelated grill
       (172.1), an unrelated sweep (161.3). Every unnamed condition that fired
       did so by luck or force, never by being asked; every named one was asked
       on schedule. **Not falsified.** Counter-evidence noted: n = 6 is still
       small, and OWNER/147's self-resolution doesn't cleanly sort into either
       bucket (it isn't named in a playbook step, but it also isn't clear it
       was "found by luck" rather than surfaced by ordinary owner review) — kept
       out of the tally rather than forced into a side.

       **(5) No mechanism.** Per the Accept, and matching 192's and 193.1's
       own refusals on the same ground: a register of 42 rows is 94.11's
       ceremony — 23 of them are semantic and nobody could adjudicate the
       register itself without doing the same reading a wake would do
       directly. The one piece of infrastructure the hypothesis actually
       argues for already exists and is the right shape: **name a condition in
       a playbook step if you want it checked on schedule** (`LOOPS.md` §3's
       existing mechanism), don't build a second one. Nothing new queued.

## Slice 192 — Objective grill of Slices 186, 189, 190, 191 (2026-08-29)

Rule 3 at 4/3. Full report:
`.roundtable/grill-objective-186-189-190-191-2026-08-29.md`.

**Checked before writing**: three of the four slices are grills or sweeps, which
is exactly the shape that invites re-raising the product-vs-machinery ratio.
That was retired with *"not to be re-raised as a new finding"* and **is not
raised**.

**(A) Every defect in 173.2 was in something ASSERTED; the one thing MEASURED
was correct — 3 of 3.** Row height was measured live in both states and
red-proved: no defect. The `18ch` cap and `3.5rem` reserve were asserted, both
fitted to the single 21-character string the one demo carries: **190.1**. The
runtime claims were skipped outright: **190.2**. The specificity numbers were
asserted from reading the selectors: **190.3**. Defect rate among asserted
claims 100%, among measured claims 0% — and the same wake that built a browser
harness and red-proved the row height shipped three unmeasured claims beside it.

**(B)** 190.2's own construction produced two instrument defects, both caught by
assertions: a **live** `getComputedStyle` read after the injected style was
removed, and a red-proof injecting into the first CSS file *alphabetically*
rather than the one holding the rule. Third and fourth times this session an
injection assertion paid for itself. No gate — that is the existing rule
succeeding.

1. [x] **192.1 — record the PLACEMENT rule finding A names.** The disciplines
       are all written already ("an instrument's first output is not evidence",
       "a number you report is load-bearing"); what is not written is where the
       defect lands when a single change ships measured and asserted claims
       side by side. 173.2 is the worked example: the hard measurement was
       done, correctly, and every defect was in the claims shipped beside it.
       *Accept*: either one paragraph in CLAUDE.md's existing measurement
       section carrying that example, or **a recorded finding that the existing
       wording already covers it** — the sections are long and 158.2 has prose
       growth open, so a restatement is a real cost and refusing is a
       satisfying outcome.

       **CLOSED 2026-08-29 (cloud wake, rule 4) — Accept branch (a), one
       paragraph, into the existing `## A number you report is load-bearing`
       section. Branch (b) was tested first and FAILED**, which is why (a) was
       taken rather than by preference. Each candidate rule's own stated
       trigger was applied to the 173.2 facts:

       | existing wording | its trigger | fires on 173.2? |
       |---|---|---|
       | *"re-verify its siblings"* | "when one claim from a session **dies**" | **no** — nothing died; the measured claim was correct |
       | *"write the command next to the claim"* | the item's "**PREMISE** is a measurement from an earlier wake" | **no** — these were new claims in the same change |
       | *"a number you report is load-bearing"* | its own scope line: "the **ad-hoc measurement** written to answer a question" | **no** — `18ch`/`3.5rem` were never measured by anything |
       | *"claims that assert runtime behavior must be executable"* | a page asserts runtime behaviour | **yes** — covers 190.2 |
       | *"an instrument's first output is not evidence"* | a new detector/script/query | **no** — the wrong claims had no instrument |

       So **1 of the 3 defects** was covered by an existing rule and the
       placement observation by none. Needles were plain fixed strings, counted
       before reading (`grep -Fic` on `CLAUDE.md` **as it stood at `12711a8`**,
       before this paragraph landed — re-running them today hits the paragraph
       itself): `beside` 0, `alongside` 0, `side by side` 0, `unmeasured` 0,
       `same change` 0, `vouch` 0; `sibling` 3 and `asserted` 3, all read, none
       of them this.

       **n = 2 instances, and the second was found by re-checking this item's
       own premise** — which is the rule arriving before it was written. 173.2
       is confirmed from the shipped artefact rather than from prose about it:
       `data-table.css` lines 477 and 495 now record in their own comments that
       `3.5rem` and `18ch` were *"fitted to the single 21-character string this
       framework's own demo carries"*. The second instance is **Slice 193
       finding D**, corrected in place above. **Counter-evidence kept:** 190's
       cross-cut records 185/188 and 187.1 as clean controls — neither shipped
       an asserted claim beside its mechanism — so this fires only on a change
       carrying both kinds, and is not a claim that every change rots.

       **No gate, and not a new `##` section.** The paragraph went into an
       existing section deliberately: 193.1 has *"should CLAUDE.md's eight
       detector sections fold"* open, so adding a ninth to answer this would
       have argued against that item while it is unresolved. Cost, named:
       `## A number you report is load-bearing` grows **306 → 508** words and
       the file **5,248 → 5,450**, measured against `12711a8` with
       `re.split(r'(?m)^(## .*)$')` + `str.split()` (`ENVIRONMENT.md` trap 7:
       a bare `wc -w` undercounts this prose by 2.4-4.5%).

       *(This one figure was wrong twice before it was right, in the write-up
       of the rule about it, and both are kept rather than patched away. First
       "306 → 461", asserted from drafting beside a paragraph whose every other
       figure was measured — wrong by 47. Then "501", measured but taken before
       the last edit to the paragraph, which reflowed two clauses onto em
       dashes — wrong by 7. The second is the sharper one: measuring is not
       enough if the measurement predates the final edit.)*

**Not proposed: a gate for either finding.** A's discipline is a writing rule
with no mechanical form; B is the existing red-proof rule working three times.

## Slice 191 — Standardize sweep: three lanes clean, and the fourth was reading a number its own command cannot print (2026-08-29)

**Dispatcher rule 2, cloud wake.** `dispatch_status.py` read `Standardize 4 / 4
Continue rounds since 2026-08-29 10:21 OVERDUE`; rule 1 found no open P0
(`grep -n 'P0' ROADMAP.md` returns only closed slice headings and 190.1's
explicit *"Not a P0"*) and GitHub intake **0 open issues**, asked via the API.
No new input, so Step 1 triaged nothing.

**Three of the four rot-guard lanes are clean and are worth one line each**,
per §3's own instruction that a clean round is the expected result:

```
npm run scan:dead-style -w docs          # 0 dead of 1,428 live inline decls
npm run report:css-repeats -w @busy-office/ui
  # 74 files · 238 rules · 226 distinct · 8 repeated
npm run report:prose -w docs             # 118 pages · median 748 · total 104,912
```

- **`scan:dead-style` — zero delta.** 0 dead of 1,428, identical to 166.1's and
  187.1's runs.
- **`report:css-repeats` — zero delta in the finding, which is the group set.**
  All eight groups match `LOOPS.md`'s table exactly, membership included; the
  totals moved 237 → **238** rules and 225 → **226** distinct bodies, i.e. one
  new rule with 3+ declarations that is not a repeat. The joined-control x4
  group is still **two** components, so its reopen trigger (a third) is unmet.
- **`report:prose` — zero unverdicted pages.** Fourteen pages are flagged (9
  over the corpus median, 12 over a family median, union 14) and **all fourteen
  carry a verdict**: 158.1's twelve, 161.1's three family-split adds, and
  `/concepts/scale/` from **178.3**. Checked by extracting the page paths from
  each verdict entry and differencing the sets, not by reading the reports.

1. [x] **191.1 — the fourth lane's finding is unreadable at the invocation the
       playbook prescribes, and the hand-off and the report disagreed about it
       the same day.**

       §3 told this sweep the finding is *"a file changing accumulate class, or
       `LOOPS.md` still at 0 down after 167.2"*. `report_loop_prose.py`'s default
       window opens **2026-08-20**, and 167.2's split (`3006da0a`, 2026-08-28)
       is **the only down `LOOPS.md` has ever had inside it** — so the default
       output reads `1 down` permanently, and the condition the clause names is
       invisible. It came true underneath the clause: measured from the split,
       `3006da0a..HEAD` is **18 up / 0 down / 0 flat**, 9,337 → 12,852 words.
       The previous hand-off recorded the file as *"still `0 down`"* while the
       report printed `1 down`; both sentences are about the same unchanged
       history, and nothing in the output could adjudicate them.

       This is CLAUDE.md's *"name the PROPERTY, never the value it will have"*
       in an instruction rather than an Accept — the second time this playbook
       has paid for it. The first was the three prose-page names, corrected
       three times before the rule was written down.

       **Fixed in the instrument, not only in the prose**, because a caveat
       about a window boundary in a playbook is the same snapshot that rotted
       the last one. `report_loop_prose.py` now prints a **`ratchet`** block:
       per file, the steps at the tip that did NOT shrink it, and the commit
       that last did — walked from HEAD backwards over **full history**, so no
       `--since` can hide or manufacture a cut.

       ```
       LOOPS.md                    18 up   last cut 3006da0a (2026-08-28)
       CLAUDE.md                   27 up   never cut
       DESIGN.md                   20 up   never cut
       ROADMAP.md                  23 up   last cut 2ae54a4a (2026-08-28)
       .roundtable/RESUME.md        0 up   last cut aa7512f5 (2026-08-29)
       ```

       **Two files have never been cut in their entire history** — `CLAUDE.md`
       (27 steps, 28 commits) and `DESIGN.md` (20 of 21). The windowed column
       said `9 up / 0 down` and `6 up / 0 down / 1 flat`; the full-history
       reading is the stronger statement and it is the one the sweep's question
       actually asks.

       **Red-proved three ways, each injection confirmed before its result was
       believed** (a green red-proof is a defect in the injection until shown
       otherwise):

       - **Inverting the comparison** (`cur < prev` → `cur > prev`) in a probe
         copy — injection confirmed by grepping the probe for its marker, one
         match asserted before replacing — returns a **different** answer on the
         same input: `(1, c4)` against the canonical `(2, c3)`. The comparison
         is load-bearing.
       - **A real cut moves it**: on a throwaway repo whose series is `10 · 20 ·
         5 · 8 · 8` by construction, the canonical answer is `(2, c3)` — the
         flat step and the up step are not cuts, `c3` is the only shrink — and
         appending a 3-word commit takes it to **`(0, c6)`**. The first attempt
         at that series silently produced FOUR commits, not five: an identical
         8-word file is not a commit, so the flat step needed different words at
         the same count. Caught by printing the built history rather than
         assuming it.
       - **Window independence**: the `ratchet` block is byte-identical
         (`diff`) between `--since 2026-08-20` and `--since 2026-08-28`, while
         the `accumulate` column moves `38 up / 1 down` → `19 up / 1 down` over
         the same pair. The two columns are not the same number.

       Reconciled against an independent walk before quoting: a separate script
       reproduced all five rows — ups **and** the named cut sha — from raw
       `git show`, agreeing 5 of 5.

2. [x] **191.2 — the verdict the ratchet makes readable: `LOOPS.md` is HONEST
       and it is recurring, and one number this entry nearly inferred was
       wrong.**

       Per §3, a file accumulating with no cut behind it wants a recorded
       verdict. `LOOPS.md` since its own split: **+3,503 words by section**
       (+3,515 raw; the 12-word difference is the heading lines themselves,
       which the section splitter attributes differently — 167.1's entry has the
       same discrepancy for the same reason).

       **Both tables below are `3006da0a` against `aa7512f5`** — this wake's
       base, not its HEAD, so they stay reproducible after this wake's own edit
       to §3 lands in the Standardize row. Both come from one splitter run over
       the two revisions (`git show <rev>:LOOPS.md`, split on `^#{2,3} ` for the
       first table and on `^\d\. \*\*` inside Step 2 for the second), which is
       what makes them comparable at all.

       | region | at 167.2 | now | delta |
       |---|---|---|---|
       | Step 2 — the rules | 1,441 | 3,135 | **+1,694** |
       | 3b. Polish | 591 | 1,091 | +500 |
       | Step 0 — the handover | 78 | 563 | +485 |
       | Step 0c — collisions | 1,026 | 1,378 | +352 |
       | `Settled:` the BCD paths | 0 | 189 | +189 (new) |
       | 3. Standardize | 678 | 858 | +180 |
       | Step 0b — the counters | 108 | 211 | +103 |

       **HONEST by 167.1's test** — every region added names a measured decision
       or a refusal record, which is the thing this file exists to hold. What is
       new is that the growth is concentrated in the region every wake evaluates
       top to bottom. Inside Step 2, by rule:

       | | at 167.2 | now |
       |---|---|---|
       | rule 4 (dispatches most wakes) | 274 | **1,012** |
       | rule 3 | 525 | 672 |
       | rule 6 | 164 | 531 |
       | rule 5 | 111 | 361 |
       | rule 7 | 34 | 226 |

       **A claim this entry drafted and then measured away.** It read 167.1's
       *"rule 3 is now 1,171 words (181 rule / 990 history)"* and was about to
       state that rule 3 regrew **181 → 672** one day after 167.2 archived its
       history — a 3.7x regrowth, and the headline. Measured with one splitter
       across both revisions, rule 3 was **525** immediately after the split and
       is 672 now: +147, the smallest growth of the five that moved. 167.1's 181
       counts an inner region, not the rule. The real figure is **rule 4, 274 →
       1,012**, which the drafted claim would have buried. Both numbers come
       from the same command run on two revisions; the discarded one came from
       quoting a neighbouring entry.

3. [x] **191.3 — decide whether rule 4's archaeology belongs in
       `LOOPS-archive.md`.** **DECIDED 2026-08-29: two of the three move, one
       stays.** Each region put to the item's own test — does it change what a
       wake DOES at rule 4, or only explain how the rule got here?

       - **The "oldest, not current-slice" narrative — LOAD-BEARING, stays.**
         It defines what *oldest* means, and that word is rule 4's entire
         predicate. A wake that reads it as "current slice" dispatches the
         wrong item, so this is the rule, not its history.
       - **The cycle table + its regrowth-per-commit reading + the endogeneity
         caveat — archaeology, moved.** What a wake does here is unchanged by
         them: read `ROADMAP.md`, and if the rule is walking thousands of
         lines, triage the sweep and run it. The per-commit regrowth rate is
         evidence FOR that instruction, not the instruction.
       - **The ratio-versus-denominator correction — moved with them.** It is a
         correction about the table's numbers; once the table is elsewhere it
         has no referent to correct.

       Rule 4 **1,012 → 752 words**. Following 167.2 exactly: the numbers moved,
       the instruction stayed, and it stayed a *paragraph* rather than becoming
       a pointer, because a pointer is read less. `report_loop_prose.py` names
       the cut, and now states the general form — this is the **third**
       relocation between those two rows (167.2, 169.3, this), and when
       `LOOPS.md` steps down while `LOOPS-archive.md` steps up in one commit it
       is a cut, not prose growth or restraint.

       *(original item below)*

       **Original — decide whether rule 4's archaeology belongs in
       `LOOPS-archive.md`, on the evidence 191.2 measured.**

       Rule 4 is **1,012 words**, 32% of Step 2 and the rule dispatched on most
       wakes. 167.2 established the precedent — rule 3's history moved out,
       leaving the rule — and rule 4 now carries three candidate regions: the
       archive-sweep cycle table with its regrowth-per-commit columns, the
       ratio-versus-denominator correction, and the "oldest, not current-slice"
       LIFO narrative from 2026-08-19.

       *Accept*: a recorded decision naming, for each of those three regions,
       whether it changes what a wake DOES at rule 4 or only explains how the
       rule got here — and, if any move, the same commit leaves the pointer
       167.2's split used and `report_loop_prose.py`'s `ratchet` names the new
       cut. **Finding that all three are load-bearing and moving nothing is a
       satisfying outcome** and closes this item: rule 4's own text says a
       snapshot in a playbook is read as current, which is an argument for
       keeping the re-measure instructions where the rule is.

       Not started this wake: it is a judgement about the dispatcher's own
       playbook, and 191.1/191.2 are what make the evidence for it readable.

## Slice 190 — Objective grill of Slices 173, 185, 187: the measured claims all held, the reasoned ones did not (2026-08-29)

**Dispatcher rule 3, cloud wake.** `dispatch_status.py` read `Objective 3 / 3
slices since 2026-08-29 01:46 OVERDUE [173, 185, 187]`; rule 1 found no open P0
and GitHub intake **0 open issues** (asked via the API), rule 2 read
`Standardize 2 / 4`. Full report:
`.roundtable/grill-objective-173-185-187-2026-08-29.md`.

**Cross-cut.** Each slice asserted facts about its own mechanism. Every
assertion checked *against the mechanism* survived re-measurement — 173.2's row
heights, sibling shift, accessible description and no-clip (4 of 4); 185/188's
registry read, YAML step order and derived-pin check (3 of 3); 187.1's
dead-style **0 of 1428**, css-repeats **8 groups**, byte-identical JSON (3 of 3).
Every assertion reasoned out *beside* the mechanism failed: 173.2's specificity
arithmetic (wrong twice) and its "3.5rem is the message's own box" (false for
any message over ~2 lines). **Hypothesis**, n = 3 slices, one corpus.

**185 and 187 are controls and are clean.** Nothing in either was established by
argument, and both re-measure exactly. 173.2 did the hard part correctly too —
what failed in it are the two numbers nobody could measure at the time, because
they are arithmetic and a forecast.

**Refused: a gate for "every constant in shipped CSS names what it is sized
against".** The exact form of 94.11 — "a comment precedes this literal" is
checkable and true of 155 of 155; "the constant tracks the box it reserves for"
is semantic. One measured instance is fixed instead.

**Three corrections landed in this wake rather than filed**, all to durable
files, which is where a correction survives (169.3): `ENVIRONMENT.md`'s trap 1
diagnostic (`git rev-parse --short main HEAD` exits 128 **whether or not `main`
exists** — `--short` takes one revision, measured both ways on git 2.43.0, so
the documented test reports a missing branch on every container); its cloud-wake
section, which now splits *"evidence that is a rendered image"* from *"any
measurement expressible as a DOM, computed-style, layout-geometry or
accessibility-tree assertion"*; and the same clause in Slice 189's new
`LOOPS.md` rule-4 bullet, amended from **"needs Podman, a real browser,
screenshots"** to **"needs Podman and screenshots"** — a cloud wake has a real
browser and drives it every wake. All three in §D of the report.

**A COLLISION — and Step 0c's working half caught it before a single commit.**
The local dispatcher took the **same rule-3 dispatch** concurrently and pushed
first, as Slice **189** with its own report. The mandated `git fetch origin
main` immediately before this wake's first commit saw `94cc5a3..00023f30`; this
work was rebased and renumbered 189 → **190** rather than landing on a stale
base. **Third recorded collision, and the first caught before any commit rather
than at push rejection** — the "safe by construction" argument played no part,
since `loop-log.md` was untouched here at the time, exactly as its own
correction predicts.

**Both grills are kept and neither is a duplicate**, per Step 0c's rule for a
collision. Slice 189 covers **186** as well and reads the window for *process*
findings; this one re-measures the *artefacts*. They meet in one place — the
owner- vs browser-blocked distinction, reached independently from the dispatch
record there and from the measurement here. **189's finding C has priority and
is credited**; 190 only sharpens the clause it landed in.

1. [x] **190.1 — a grid cell's validation message is clipped for any message
       longer than about two lines.** **FIXED 2026-08-29** by the wake that
       shipped both constants. Taken as a build rather than held as a decision:
       the Accept names a **property**, so it is satisfiable by measuring, and
       the owner had passed over it twice.

       **Both halves were fits to a sample of one, and the width cap was the
       bigger half — as 190.1 measured.** `18ch` is replaced by
       `min(48ch, 100cqi)`: bounded by the table's own container so it can
       never introduce horizontal overflow, wide enough that realistic messages
       stay short. That alone took the 101-char message from **118px/6 lines to
       64px/4 lines**. The reserve is no longer a pixel constant but
       `calc(6lh + var(--bo-space-4))` — six of the **message's own** line
       boxes, so it tracks the density tokens instead of drifting when they
       move, and six is the number this Accept names rather than a guess.

       **Measured against the Accept verbatim**, six combinations
       (compact/comfortable/spacious × 1440/390), with a 250-character message:

       ```
       1440  6 lines, 100px, clears the container by 47-55px, row unchanged
       390   7 lines, 118px, clears by 29px,                  row unchanged
       ```

       All six pass; 173.2's contract survives (`rowBlur === rowFocus`
       everywhere). **Red-proved by construction**: the immediately preceding
       run held this same width cap with the old `3.5rem` reserve and **4 of 6
       failed**, by as little as 3px — so the reserve change is doing real work
       and the assertion can fail.

       The top-layer `popover` was **not** needed and stays refused for the
       reasons 173.2 gave. Gates: axe 127×2, layout, scroll, claims (144),
       repo, 146 tests.

       *(original item below)*

       **Original — a grid cell's validation message is clipped for any message
       longer than about two lines, because a constant reserves room for a
       variable-height box.**

       `data-table.css` reserves `padding-block-end: 3.5rem` on
       `.bo-data-table-container` while a message is shown, and caps the message
       at `max-inline-size: 18ch`. Both constants were chosen against the one
       21-character string the one demo carries. Measured on the built page,
       each mutation asserted to have landed before its result was believed:

       | trial | msg box | reserve | past the container |
       |---|---|---|---|
       | as shipped (21 chars), 1440 | 46px | 56px | −19 fits |
       | as shipped, 390 | 46px | 56px | −15 fits |
       | 40-char message | 64px | 56px | **−1** fits, barely |
       | 101-char message | 118px | 56px | **+53 clipped** |
       | `spacious` + 101 chars | 118px | 56px | **+49 clipped** |

       **Not a P0, and the severity was corrected by measurement after being
       drafted as one.** The container is `overflow: auto`, so the clipped
       region is scrollable: `scrollHeight 203, clientHeight 149, scrollable 54,
       reachedByScrolling 54` against 53 needed. Nothing is unreachable, and
       `aria-describedby` carries the full string to assistive tech either way.
       **No shipped page is affected** — walking all **138** built pages, exactly
       **1** nests a `.bo-form-field__message` inside a `.bo-data-table`, and its
       message is 21 characters (the page-level `grep` says 9 of 138 and is the
       weaker instrument; the DOM says one).

       **It is still a regression, and the control says so.** Neutralising
       exactly the three rules 173.2 added, and re-measuring the same 101-char
       message: before, the box is **36px** on one line at cell width, the row
       grows to 92.5px, and nothing is clipped (−9); after, the box is **118px**
       over six lines at 18ch and is clipped by 53. **The `18ch` cap is the
       bigger half of the cause** — it converts a one-line message into a
       six-line box, which is what overruns the reserve. Readable-but-shifting
       became stable-but-needs-a-scroll.

       This re-opens the trade 173.2 settled, so it is a decision, not a tidy.
       Options as measured, none pre-picked: widen or drop the `18ch` cap so the
       box stays one or two lines; size the reserve to the worst realistic
       message rather than to this one; or revisit the top-layer `popover`
       refused in 173.2 for reasons that still stand (five popovers already on
       this demo's combobox cells).

       *Accept* — properties, not predicted values:
       - **A message of at least six lines at the component's own wrap width is
         fully visible without scrolling the table container**, at
         `compact`/`comfortable`/`spacious`, at 1440 and 390 — asserted as
         `msg.getBoundingClientRect().bottom <= container.getBoundingClientRect().bottom`,
         not by eye.
       - The row's height is **unchanged** by the message at every one of those
         settings — 173.2's contract must survive the fix, and its own
         measurement is the regression test.
       - Whatever constant survives **states what it is sized against and the
         measurement that fixed it**, so the next wake can re-derive it. If the
         answer is that no constant works and the mechanism changes, that is a
         satisfying outcome, not an off-plan one.
       - Red-proved by injection, each injection confirmed to have landed before
         its result is believed. **A green red-proof is a defect in the injection
         until proven otherwise.**
       - **Finding this premise false is a satisfying outcome**: if a re-run
         shows the shipped page's own margin has moved, record it with the
         command rather than working around it. Commands are in §A of the report.

2. [x] **190.2 — `/patterns/editable-grid`'s three new runtime claims are
       executable.** **LANDED 2026-08-29** by the wake that skipped the step.
       `check:claims` reads **144**, up from 141. The three:
       focus reveals the message (asserting `none` while blurred *and* shown on
       focus, driving a real `.focus()`); an in-flow message would grow the row
       (the page states this as its REASON, so the case is the counterfactual —
       inject `position: static` and require the row to grow); and
       `aria-describedby` resolving to the message element **while blurred**,
       which is the whole point of that sentence.

       **Two instrument defects, both caught by assertions rather than review.**
       The counterfactual first reported `injectionLanded: false` on a mutation
       that plainly worked (`inFlow 103 > fixed 53`) — `getComputedStyle`
       returns a **live** object and it was read *after* the style was removed,
       so the snapshot reverted with it; now read into plain strings first. Then
       the red-proof's own injection missed, because `ls dist/_astro/*.css |
       head -1` picks the first file alphabetically and the rule lives in
       another — the `assert count > 0` is what caught it, exactly the trap
       CLAUDE.md records about minified output.

       Red-proved on the correct file: neutralising the focus gate turns the
       case **FAIL**, and it returns to green when restored.

       *(original item below)*

       **Original — `/patterns/editable-grid`'s three new runtime claims are
       executable.**

       CLAUDE.md's recipe: *"If a page says the browser will do something … add
       a case to `apps/docs/scripts/check-claims.mjs`."* 173.2 added three such
       sentences — *"clicking into the Qty cell reveals why"*, *"a message that
       sits in the row's flow grows the row and shifts every other cell in it
       (measured: 53px → 75px, and the two untouched inputs moved 11px)"*, and
       *"`aria-describedby` carries the reason to a screen reader continuously,
       focused or not"*. `ed1da69` touched four files and `check-claims.mjs` is
       not among them; the gate reads **141** before and after (`npm run
       check:claims -w docs`, re-run this wake).

       Not a new programme — the recipe's existing step, skipped once. The
       precedent is in the file already: *"`data-loading=true` dims the table
       and blocks interaction mid-swap"* is the identical shape, a States-table
       sentence asserted against a computed style. Every assertion needed is
       written as browser code in §A of the report.

       *Accept*:
       - The row's height is identical focused and unfocused, and the untouched
         siblings do not move — the property, read from the live page.
       - The accessible **description** is non-empty while the message is
         `display: none` — the claim most likely to rot, since it depends on
         accname's hidden-but-directly-referenced rule rather than on this
         framework.
       - The claim count moves by what was added and the gate stays green; a
         count that does not move means the cases did not register.
       - Red-proved by injection with the injection confirmed to have landed
         (grep the BUILT output or assert the computed style — a claims case is
         a detector, and this file's history is detectors that could not fail).

3. [x] **190.3 — `data-table.css`'s specificity comment states two wrong
       numbers, one of which belongs to a different rule.** **FIXED
       2026-08-29** by the wake that wrote the wrong comment. The numbers were
       re-derived by hand before being trusted, and agree with 190.3's cascade
       race: this rule is **(0,4,0)** (three classes plus `:not(:focus-within)`,
       which takes its argument's specificity); form-field.css's `:is(:has(…))`
       rule resolves to its most specific arm at **(0,3,1)**; and **(0,2,0)** is
       a third rule entirely — `[aria-invalid="true"] ~ .bo-form-field__message`,
       the no-`:has()` fallback. The comment now carries the measured numbers
       and names the method, and says outright which rule (0,2,0) belongs to so
       the next reader is not sent looking for it in the wrong place.

       *(original item below)*

       **Original — `data-table.css`'s specificity comment states two wrong
       numbers, one of which belongs to a different rule.**

       Line 442 claims the new rule beats *"the `:is(:has([aria-invalid]), …)
       .bo-form-field__message` rule in form-field.css on specificity (0,3,0 vs
       0,2,0)"*. Measured — each selector raced against references of known
       specificity placed **later** in the sheet, so a tie resolves to the
       reference and "real wins" means strictly greater:

       ```
       .bo-data-table .bo-form-field:not(:focus-within) .bo-form-field__message
         beats (0,3,1), loses to (0,4,0)   -> (0,4,0)   comment says (0,3,0)
       :is(.bo-form-field:has([aria-invalid="true"]), …:user-invalid)) .bo-form-field__message
         beats (0,3,0), loses to (0,3,1)   -> (0,3,1)   comment says (0,2,0)
       ```

       **(0,2,0) is a real specificity in that file — it is the *other* rule's.**
       `[aria-invalid="true"] ~ .bo-form-field__message`, the no-`:has()`
       fallback, is exactly (0,2,0). The comment names one rule and quotes its
       neighbour's number.

       The **conclusion is correct** — (0,4,0) beats both, so the reveal does not
       depend on import order, confirmed independently by the live
       `display: none` reading. This is an accuracy defect in a load-bearing
       comment; CSS comments here carry the citations `check:slice-refs`
       resolves.

       *Accept*: the comment's numbers agree with what a cascade race reports for
       those selectors, and it names which rule each number belongs to. **The
       criterion is agreement with the measurement, not a particular triple** —
       if the selectors change, the measurement is what the comment must match.
       No gate: CSS specificity in a comment is prose about code, and 94.11 is
       the record of what gating that costs.

## Slice 189 — Objective grill of Slices 173, 185, 186, 187 (2026-08-29)

Rule 3 at 4/3 `[173, 185, 186, 187]`. Index checked first: no prior grill covers
this window. Full report:
`.roundtable/grill-objective-173-185-186-187-2026-08-29.md`.

Findings, in the report's order: **(A)** when a system TRANSFORMS what you hand
it, the authority is what the system serves — 185 verified the tarball twice
while `npm view <pkg> bin` was the answer, and read the registry's *read* path
while its *write* path had already spoken; **(B)** re-checking an item's stated
premise changed the work in three of four slices, and 173.2 is the first case
where following the forecast would have shipped a two-channel regression;
**(C)** four consecutive wakes reported "nothing dispatchable" while 173.2 sat
browser-blocked, and the fix's own first attempt died in `RESUME.md` — 169.3's
lesson arriving a second time.

1. [x] **189.1 — CLAUDE.md's "verify against the rendered artefact" needs to
       name WHICH artefact when a third party renders it.** **LANDED
       2026-08-29.** The criterion's own escape hatch — "finding it already
       covered is a satisfying outcome" — was tested first and does **not**
       apply: every example in that section is a bulk edit to our own source,
       verified against our own build (import specifiers, rewritten prose, an
       Astro call inside a `<pre>`, page growth). None covers a third party
       rewriting the artefact after we hand it over. One paragraph added (+17
       lines), carrying the required worked example: the
       `bin: "./index.mjs"` → `"index.mjs"` normalisation, and the read-vs-write
       path confusion from the same slice.

       *(original item below)*

       **Original — CLAUDE.md's "verify against the rendered artefact" needs to
       name WHICH artefact when a third party renders it.** The rule is
       written and was followed in 187 (our generator, our output, byte-compared
       and red-proved) and misapplied twice in 185 (npm sat between the tarball
       and the truth, and normalised the manifest).
       *Accept*: one paragraph in the existing section — verify at the **last
       point the artefact passes through before a user sees it**; if something
       downstream can rewrite it (registry, CDN, bundler, minifier), that
       system's output is the artefact and asking it is usually one command.
       **A worked example is required, not optional** — this file's rules are
       acted on when they carry the instance that produced them, and the
       `bin: "./index.mjs"` → `"index.mjs"` normalisation is the cleanest one
       available. Finding it already covered by the existing wording is a
       satisfying outcome; the section is long and a restatement is what 158.2
       is open about.

**Not proposed: a gate for finding C's durable-vs-ephemeral rule.** Two
instances (169.3, 186.2) is not a base rate, and a detector for "is this
sentence a rule rather than an observation?" is exactly the semantic judgement
94.11 refuses. The `LOOPS.md` fix stands on its own.

## Slice 188 — the release now ships the front door, and the tag assertion is replaced rather than dropped (2026-08-29)

**Dispatcher rule 4, cloud wake.** Rules 1-3 gave nothing: no open P0
(`grep -niE '\bp0\b' ROADMAP.md` returns closed slice headings and narrative
only), GitHub intake **0 open issues** (asked via the API), and
`dispatch_status.py` read `Standardize 0 / 4`, `Objective 1 / 3 [187]`,
`Optimize 0 wake-date(s) newer … ok`. Rule 4's oldest-first walk over the seven
`N. [ ]` checkboxes: `15.12` owner hardware, `112.3`/`112.4` owner briefs,
**`173.2` browser-blocked — a local wake can take it, this one cannot**, then
**185.1**, which needs no browser at all.

### 188.1 — `publish.yml` publishes both packages

The defect 185 left open: a GitHub Release ran `npm publish -w @busy-office/ui`
and nothing else, so the scaffolder — live since `2026-08-29T01:30:23Z` and
pinning `^0.5.0` — would never be republished when core moved.

**The version question, answered by measurement rather than by choosing a
style.** 185.1's Accept named three options (no tag assertion for create-ui, its
own `create-ui-v*` trigger, or lockstep versions) and forbade silently dropping
an assertion. The answer taken is the first, and it is not a dropped assertion
but a swap for two stronger ones, because **create-ui's content is derived from
core's version**:

- `packages/create-ui/build.mjs` writes `framework.json` as `^<core version>`.
  Red-proved, not assumed: bumping `packages/core/package.json` to `0.6.0` and
  re-running the check fails with
  `✗ framework pin (^0.6.0, from @busy-office/ui) — differs from its source`.
  Since the tag gate already asserts the tag equals core's version, this ties
  create-ui's shipped content to the tag transitively.
- A new release gate, `packages/core/scripts/check-publishable.mjs`, refuses a
  release whose versions are already on the registry — **so a core release
  cannot ship without a create-ui version bump**, which is exactly the silent
  skip 185 found.

**Refused, each with its reason in the workflow's own comments:** lockstep
versions (rewriting a published package's version line to fix a workflow), and a
separate `create-ui-v*` trigger (it leaves a core release able to strand the
scaffolder — the defect being fixed). **Known limit, stated rather than
hidden:** there is now no path to release create-ui alone; a scaffolder-only
change ships with the next core release.

### 188.2 — the new gate was red-proved on all six branches, before it ever ran in CI

`check:published` and `check-package.mjs` are the precedents: a release-time
gate that only ever runs during a release is a gate nobody has watched fail.
This one is `@exact` (membership in the version list the registry serves) and
was exercised by hand, against the real registry:

| branch | input | result |
|---|---|---|
| already published | the real tree, `@busy-office/ui@0.5.0` + `create-ui@0.1.0` | **exit 1**, both named |
| publishable | `create-ui@0.1.1` | exit 0 |
| never published | `@busy-office/nonexistent-xyz@0.0.1` (real E404) | exit 0, "first publish" |
| `"private": true` | fixture | **exit 1** |
| registry unreachable | `npm_config_registry=http://127.0.0.1:9/` | **exit 1**, "the registry could not be asked, so nothing was verified" |
| no arguments | — | **exit 1** with usage |

The unreachable row is the one that matters: a registry that cannot answer is a
gate that could not run, and this repo's rule is that such a gate fails loudly
rather than reading as "nothing is already published".

**The `@exact` tag was red-proved too, per "verify the injection".** The gate
lives in `packages/core/scripts/`, which `check:selftests` scans, and removing
the tag (`grep -c '@exact'` → **0**, confirmed) turns that meta-gate red naming
the file. Restored: `self-test check passed — 44 gates classified` (was 43).

**Why `packages/core/scripts/` and not `scripts/release/`.** `apps/docs`'s
`build` runs `check:repo` → `check-selftests.mjs`, and the docs Containerfile
copies `packages`, `apps/docs`, `examples/erp-suite` and `DESIGN.md` — **not
root `scripts/`**. Teaching the meta-gate a new directory would have broken the
container build in exactly the way `check:rtl`'s DESIGN.md assertion once broke
the po-app image. Placing the gate inside a directory the meta-gate already
scans costs nothing and keeps it classified.

**NOT wired into `ci.yml`, deliberately:** on `main` the shipped versions are
normally already published, so this gate is red by design between releases. It
belongs to the release.

**What a cloud wake could not verify, named rather than implied:** the workflow
itself was not executed — cutting a release is owner-triggered and this wake has
no way to run one. What was verified is every piece it calls: the YAML parses
and its thirteen steps are in the intended order (`python3 -c "import yaml…"`),
`npm run check -w @busy-office/create-ui` passes and fails for the right reason,
and the new gate's six branches above. Nothing in the diff renders, so no
screenshot was owed.

## Slice 187 — Standardize sweep: three clean lanes, and the one duplicate they cannot see (2026-08-29)

Dispatcher rule 2 at **4/4 OVERDUE**, so this fired ahead of rule 4 (which had
173.2 ready to build). All three standing lanes were clean:

| lane | reading | verdict |
|---|---|---|
| `scan:dead-style` | **0 dead** of 1428 live inline declarations | clean |
| `report:css-repeats` | **8 groups**, matching the settled table | **delta 0** |
| `report:prose` | 15 pages flagged | **all already adjudicated** |

The prose check is worth stating precisely, because this playbook has paid three
times for re-deriving verdicts that already existed: every flagged page was
matched against **both** `ROADMAP.md` and `ROADMAP-archive.md` by path, and all
15 resolve — the four with a single mention (`combobox`, `form`, `money`,
`list-report`) each carry a real "honest coverage" verdict with measurements in
the archive. **The one page the check reported as unadjudicated was
`/script/style/`, which does not exist**: the extractor matched the report's own
explanatory text, *"with pre/script/style/svg/template removed"*. A detector
tripping on prose about itself, one more time.

### 187.1 — `stripTags` had two homes, both feeding published JSON

The lanes cannot see duplicated *logic*, which step 1 also asks for. Scanning
104 scripts for identical code blocks found exactly one:

```js
// gen-patterns.mjs:37 — a named local, used 3x, never exported
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// gen-patterns-index.mjs — the same three steps, written inline on the opener
extractOpener(src).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
```

Byte-identical normalisation, two homes, both feeding text into JSON a reader
sees — the exact "two generators reading a page differently" defect
`pattern-extract.mjs` was created for (sweep #6, 2026-08-22). Hoisted there and
exported; both call sites now import it.

**`wrong-choice-rule.mjs:45` was deliberately NOT folded in.** It strips tags
without collapsing or trimming, because it feeds a `/^\s*(Not|Never|…)/` test
that needs the original leading whitespace. Consolidating it would have changed
what the clause detector matches — a third occurrence of the idiom that is not
the same operation.

**Verified against the rendered artefact, not the diff.** Both generators were
re-run and their outputs byte-compared with the pre-refactor copies:
`patterns.json` and `patterns-index.json` **identical**. Red-proved by removing
`.trim()` from the shared helper — both files then differ, and both return to
identical when restored, which also confirms the one helper really does feed
both generators.

**Nothing further to consolidate, and the metric says the opposite.** Re-running
at a tighter window leaves 5 cross-file matches and every one is an **import
block** — identical `import` lines in files that share the same modules, which
is evidence consolidation already happened, not a target. Note the count went
**4 → 5 because of this fix**: the two generators' import lines now match. The
duplication went down while the number went up, which is why the count is not
the finding.

## Slice 186 — Objective grill of Slices 180, 183, 184: the loop's self-descriptions are the thinly-gated surface, and the hand-off is wrong at HEAD (2026-08-29)

Dispatcher **rule 3**, `Objective 3 / 3 OVERDUE [180, 183, 184]`, read from
`dispatch_status.py`. Full report:
`.roundtable/grill-objective-180-183-184-2026-08-29.md`.

**The question the hand-off proposed was answered, and its premise is false.**
`RESUME.md` asked *"how many other closed Accept criteria stopped holding the day
they were ticked?"* — **none of that shape exist. 1 of 275.**

```
# 275 Accept criteria parsed from ROADMAP.md + ROADMAP-archive.md
# marker /\*{0,2}Accept\*{0,2}\s*:/i (all four written forms occur); criterion
# bounded at the first blank line OR the next `N. [x]` item marker
#   11 recurring-obligation needles -> 5 hits
#   widened to 21 needles           -> 4 hits   (zero new; the space is saturated)
```

Measured at `751959eb`. **Re-run on the tree this slice ships on** — after the
rebase onto `a2d53a93` and after this slice's own two Accepts joined the corpus —
it reads **276 criteria, the same 4 phrase-hits, 117 mechanical (42%)**. The
commit is named because the corpus grew by this very filing; a figure quoted
without its tree is what 180 found in `check-slice-refs`' own header.

Hand-read, the four are: 184.1's own Accept (quotes 28.1, imposes nothing
ongoing), 162.1 (incidental), 169.3 (a *description* of `ENVIRONMENT.md`, and it
holds), and **28.1 — the one genuine recurring obligation, decayed in a day**.
From the other side, **117 of 275 (43%)** name a gate, script or test and so
re-check themselves. The criterion form here is artefact-based by construction,
which is what CLAUDE.md's own rule pushes it toward. **So 184.1 did not patch one
leak in a leaky system — it supplied a mechanism for the one thing an Accept
criterion structurally cannot express.**

**The instrument was wrong twice on its first runs, both caught before quoting:**
block over-capture reported 19 (`on every` landing in narrative like *"prints on
every docs build"*), and `each run` matched inside **`each rung`** — verified with
`grep -o 'each run.'` → `each rung`, needle dropped.

**What the three slices share: a self-description checked against the wrong thing,
or nothing.** 180 — `@exact` verified against the tag *text*, not the code. 184 —
rule 5's freshness verified by nothing, for 10 wake-dates. 183 — `RESUME.md`'s
"needs a browser" verified by nothing, for eight wakes. **183 is the control that
keeps this honest: when finally checked, 5 of 5 were clean.** So the finding is
*self-descriptions are unverified*, **not** *they are wrong*. Recorded as
**Hypothesis** (n = 4 slices, one corpus, no independent source).

**Refused: a general "gate every self-description" programme.** 176.2's rule-6
predicate was true of 19 of 19, and 94.11's comment predicate true of 155 of 155;
the blanket gate that distinguishes nothing is this repo's recorded failure mode.
One reconciliation, base rate measured first, is the whole proposal.

1. [x] **186.1 — DONE 2026-08-29 (cloud wake). `RESUME.md`'s slice-id claims are
       reconciled against `ROADMAP.md`'s checkboxes, and the disagreement is
       reported.**

       Shipped as `apps/docs/scripts/check-resume-slice-ids.mjs`, wired as
       `check:resume-slice-ids` and run **advisory** from `record_iteration.py`
       beside `check:resume-charter` — the home this item named, for the reason
       it gave. `record_iteration.py`'s single charter invocation became a loop
       over the two, so the "must not fail the recording" contract is stated
       once rather than copied.

       **What it reports at ship time, and the command.** Not 0 of N, which the
       Accept named as an equally satisfying outcome — it fires on HEAD:

       ```
       node apps/docs/scripts/check-resume-slice-ids.mjs
       # ROADMAP.md has 8 open and 32 closed item(s) (both reconciled against a
       # raw count of the file); RESUME.md names 13.
       #   2 named id(s) are not in ROADMAP.md at all: 164.3, 168.1
       #   3 named id(s) are recorded [x] CLOSED: 186.2, 185.1, 173.2
       ```

       All three of those are historical references, not stale claims, and the
       check says outright that it **cannot tell the two apart**. That is
       deliberate and is 94.11's line: a check enforces the shape that carries a
       property, never what prose MEANS. Trying to separate "still blocked" from
       "what the owner settled in" is guessing at intent from prose.

       **The base rate moved, and the premise's figure is not restated as
       this one.** 186.1 measured *2 of 58 wake-ends (3%)*. Re-measured here
       over every revision of `RESUME.md` with a `ROADMAP.md` beside it:
       **8 of 86 revisions (9%)** fire, distribution `{0: 78, 1: 3, 2: 3, 3: 2}`.
       Different unit (revisions, not wake-ends) and a parser that derives an id
       for the unnumbered items the premise's could not, so the two are not in
       conflict — both say the same thing that matters: **neither dead nor
       always-on.** 78 of 86 revisions report nothing, so a report is a signal.

       ```
       git log --format=%H -- .roundtable/RESUME.md   # then per revision:
       git show <rev>:.roundtable/RESUME.md           # backticked ids
       git show <rev>:ROADMAP.md                      # id + state, itemsIn()
       ```

       **Id derivation, measured before the rule was chosen.** The bold id wins;
       position is the fallback that rescues the unnumbered items. On `ROADMAP.md`
       today: 40 checkbox items, 36 carry a bold id, it agrees with the derived
       id in **36 of 36**, and the 4 without one (`29.1`, `29.2`, `15.11`,
       `15.12`) derive correctly. Position alone is **not** safe in general —
       the same derivation disagrees with the bold id **30 times** in
       `ROADMAP-archive.md`, where slices were merged and renumbered. That is the
       measured reason this reads `ROADMAP.md` only, and the reason the fallback
       may never override.

       **Fences are deliberately NOT skipped, unlike the sibling charter gate.**
       The reconciliation is against the raw command this Accept names, which
       knows nothing about fences; a parser with a different scope would
       disagree with it the first time a checkbox appeared in a shell recipe,
       and the disagreement would read as a parse bug. Same scope, same answer,
       or a loud refusal.

       **Red-proved by injection, each injection confirmed by grepping the file
       and the file restored byte-identical afterwards** (`md5sum` unchanged,
       `git status` clean on the path):

       | injection | landed (grep) | result |
       |---|---|---|
       | append a backticked `` `179.1` `` (closed) to `RESUME.md` | 1 occurrence | 3 → **4** reported, 13 → 14 named |
       | strip the backticks off `173.2` | 1 → 0 occurrences | **2** reported |
       | strip all three | 0 remaining | **quiet**, rc=0 |

       And the two refusals, red-proved by stubbing a probe copy in the same
       directory (`git stash` would have moved the data too) and confirming the
       stub landed before believing the result:

       | stub | result |
       |---|---|
       | `CHECKBOX` narrowed to one digit | REFUSED — parsed 7 open vs raw 8, 31 closed vs raw 32; no verdict printed |
       | `SLICE_HEADING` made to never match | REFUSED — 4 items with no id to reconcile, by line number |
       | `id: bold ?? derived` → `derived ?? bold` | the `--self-test` goes **FAIL** on exactly the discriminating case |

       Tagged `@heuristic` because the verdict rests on recognition and one half
       of it is **positional** — `15.12` is that id only because of where it sits
       — and `check:selftests` now reads 45 gates, 16 heuristic, all self-tested.

       **Not visually verified, and nothing here needs it**: a cloud wake, no
       Podman, no screenshots. The change is one new `.mjs`, one `package.json`
       script line and one `record_iteration.py` block — no CSS, no `.astro`.
       Gates run green after it: core `build` + `test` (**146**), `docs:build`,
       `check:repo`, `check:claims` (**141**), `check:layout` and `test:axe`
       (**127 pages × 2 widths**).

       *(original item below)*

       **The failure 184 diagnosed recurred one wake later and is live at
       HEAD.** `RESUME.md` states *"the six older items are still owner-blocked
       (`112.3`, `112.4`, `173.2`, `175.4`, `176.3`, `15.12`)"*. At `751959eb`,
       **`175.4` is `[x]` closed**, and **`173.2` is open but the owner picked
       (b) on 2026-08-29**. Cause, from the commit record: `6c4cfae` (09:16)
       wrote the decisions into `ROADMAP.md`; `751959eb` (09:17) touched two
       files and `RESUME.md` was not among them.

       ```
       grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                              # 5
       grep -o '`[0-9]\{1,3\}\.[0-9]\{1,2\}`' .roundtable/RESUME.md | sort -u # 6
       ```

       **Base rates, measured before proposing.** The weak proxy — wakes
       changing the open-checkbox set without touching `RESUME.md` — is **22 of
       42 (52%)**, reported as an exposure bound, not as a defect count (a wake
       closing an item the hand-off never names leaves nothing stale). The sharp
       predicate — at a wake-end, does `RESUME.md` backtick a slice id that
       `ROADMAP.md` records `[x]`? — fires at **2 of 58 wake-ends (3%)**:
       `4be166be` (`177.1`) and `751959eb` (`175.4`, HEAD). **Not 0, not 100.**
       Noise is low: **83** backticked ids across all **80** revisions, ~1 per
       revision, and today all six are exactly the blocked-set claim.

       **A third instance fired mid-wake, and it is deliberately NOT in the base
       rate.** While this item was being written the local dispatcher landed
       `0c1fe3d3`, closing `176.3`; the hand-off table drafted minutes earlier
       already said `176.3` was owner-blocked, and was corrected by re-running
       the raw `grep -c` (5 → 6), not by noticing. Excluded from the 2-of-58
       because it never reached a commit — counting a defect the process caught
       would inflate the number. It is recorded because it shows **the staleness
       interval is shorter than a wake**, which the base rate alone understates.

       **The measuring parser under-reported first and was reconciled, not
       trusted:** `^\s*\d+\. \[ \] \*\*([\d.]+)` found **4** where a raw
       `grep -c` gives **5** — `15.12` is written `12. [ ] **AT runtime
       evidence**`, no numeric id in the bold. CLAUDE.md's `STATUS.md` failure
       (7 of 9), reproduced inside the instrument written to measure a mirror.

       **Home: `record_iteration.py`, advisory, beside `check:resume-charter`** —
       not `check:repo`. `.roundtable/**` is in CI's `paths-ignore`, so a CI gate
       reading it is the contradiction 169.4/175.3 already resolved once; and
       failing a build over a stale hand-off would block the work the loop
       exists to do. Same trade, stated: nothing rejects a commit that leaves the
       hand-off stale.

       *Accept* — properties, not predicted values:
       - The check reports every slice id `RESUME.md` names in backticks that
         `ROADMAP.md` records as `[x]` closed, and its open-item count **agrees
         with a raw `grep -c` of `N. [ ]` taken from `ROADMAP.md` itself** —
         refusing to print a verdict when the two disagree, the guard
         `rows()` and `generate_status.py` already apply. Reconciled against the
         **file**, never against anything the caller passed.
       - Unnumbered open items (`12. [ ] **AT runtime evidence**`) are carried,
         not silently dropped — the defect that made the first draft read 4 of 5.
       - Red-proved by **injection**, each injection confirmed to have landed
         before its result is believed (grep the file, not the diff), and the
         file restored and checked byte-identical after: adding a backticked
         closed id makes it report; removing today's `175.4` makes it quiet.
         **A green red-proof is a defect in the injection until proven
         otherwise.**
       - It declares its signal per the self-test rule. `@heuristic` vs `@exact`
         is decided by what the shipped code does, not by what is convenient —
         180.1's whole finding was a tag that disagreed with its own arm.
       - **Finding the base rate has moved is a satisfying outcome**: if a re-run
         reports 0 of N at ship time, that is recorded with the command, not
         worked around.

2. [x] **186.2 — `173.2` is browser-blocked, not owner-blocked, and rule 4's
       halt reasoning should say which.** **CLOSED 2026-08-29, and the item's
       own test settled it.** Its Accept asked whether the distinction
       *"survives the next rewrite"*. It did not — `grep -i "browser-blocked"
       .roundtable/RESUME.md` returned **nothing** within a day, because that
       file is rewritten wholesale every wake. That is 169.3's lesson landing
       a second time, so the fix moved to the durable playbook: `LOOPS.md`
       rule 4 now names three kinds of blocked — **owner-blocked**,
       **browser-blocked**, **agent-blocked** — beside the rule it governs.

       **The item's thesis was confirmed empirically, not argued.** Four
       consecutive wakes reported rule 4 as "all open items owner-blocked"
       while 173.2 was merely browser-blocked; the first local wake to look at
       it built and landed it the same day (option b, roadmap 173.2). A cloud
       wake reporting "nothing dispatchable" was telling the truth about
       itself and a falsehood about the backlog.

       *(original item below)*

       **Original item — `173.2` is browser-blocked, not owner-blocked, and rule 4's
       halt reasoning should say which.** The owner answered on 2026-08-29;
       `173.2`'s Accept needs a live measurement (row at 53px with an error
       present and nothing focused, then on focus, red-proved by reverting to
       the flow message), so **no cloud wake can take it** and a local wake can.
       Four wakes have now reported rule 4 as "all open items owner-blocked";
       that sentence is what went stale.
       *Accept*: the hand-off distinguishes **owner-blocked** from
       **browser-blocked** when it reports rule 4's input, so a local wake can
       see at Step 0 that there is dispatchable work a cloud wake could not take.
       Corrected in this wake's hand-off already; the item is whether the
       distinction survives the next rewrite.

## Slice 184 — rule 5 has read ten-day-old numbers for ten wake-dates, and the Accept criterion that was supposed to prevent it stopped holding the day it was ticked (2026-08-29)

Found while evaluating dispatcher rule 5 on a cloud wake, by opening
`.roundtable/loop-metrics.jsonl` instead of copying the previous handover's answer
— which is the only reason it was found at all. **The stale reading is already
published**: Slice 183's own dispatch record in this file states *"rule 5 no metric
with two consecutive regressions (`ci-wall-time` flat at 275s)"* as this-wake
evidence, and every one of that metric's 26 samples was taken inside a single
17-hour window on **2026-08-18**. By CLAUDE.md's own standard that is a
load-bearing number, quoted into the plan, wrong.

**Measured, with the commands, because a count about this repo is re-runnable in
seconds and re-deriving is where the second mistake comes from.**

```
python3 -c "import json,collections; \
  r=[json.loads(l) for l in open('.roundtable/loop-metrics.jsonl') if l.strip()]; \
  c=collections.Counter(x['ts'][:10] for x in r); print(sorted(c.items()), len(r))"
# 08-13:3 08-15:7 08-16:12 08-17:21 08-18:31 08-19:22 08-26:1 08-27:2   — 99 total
grep -c "^- 2026-08-2[0-9]" .roundtable/loop-log.md      # 652 iterations since 08-20
```

- **96 of 99 metric samples predate 2026-08-20.** Since then **652 iterations** have
  been logged against **3** samples — and each of those three is a metric name
  recorded exactly **once** (`suite-nodes-per-fact`, `docs-words-added-data-table`,
  `css-repeat-bodies`), so not one of them can ever satisfy "two consecutive runs".
- **The newest sample rule 5 could legitimately quote is `framework_classes` at
  2026-08-19 23:09** — ten wake-dates ago.
- **`ci-wall-time`: 26 samples, first `2026-08-18 02:48`, last `2026-08-18 19:54`,
  none since.** Slice 28.1 (archived) closed on 2026-08-18 with the Accept criterion
  ***"`ci-wall-time` recorded every wake"***, against its own finding that *"CI time
  was never recorded through `record_metric.py`, so dispatcher rule 4 …was
  structurally blind to the one number that bounds every future gate"* — that rule 4
  is today's rule 5, renumbered. **The fix held for one day.** A criterion satisfied
  by a burst and never again is the shape this file has no detector for.
- **Nothing detects it.** `dispatch_status.py` — the Step 0b instrument that exists
  *because* dispatcher rules starve silently (roadmap 41.1) — reads `loop-log.md`,
  covers rules 2 and 3, and has never read the metric store at all. `loop-metrics.jsonl`
  is named **zero** times in `ROADMAP.md`, `ROADMAP-archive.md`, `LOOPS.md` and every
  `.roundtable/*.md`; `ci-wall-time` appears in no gate, script or workflow.

  ```
  grep -rn "loop-metrics" ROADMAP.md ROADMAP-archive.md LOOPS.md .roundtable/*.md   # 0
  grep -rn "ci-wall-time" --include=*.mjs --include=*.py --include=*.yml .           # prose only
  ```

**Adversarially checked before being written down**, per the instrument doctrine —
what would make this wrong is samples existing somewhere this count cannot see:
`--no-log` (which inserts into the mirror and skips the file) appears only in the two
recorders' own argparse, in no document and no workflow; `loops.db` is git-ignored and
absent from this container, so the jsonl is the whole record; and
`git log -- .roundtable/loop-metrics.jsonl` shows no uncommitted backlog — its three
most recent touching commits are 2026-08-27, 2026-08-27 and 2026-08-19.

**Not classified P0, deliberately.** Nothing is red — the full gate chain ran green
on `main` at `ad77cc17` this wake — and no shipped artefact is wrong. What is wrong
is that a dispatcher rule returns a verdict computed from ten-day-old data, and a
wake then writes that verdict into the plan as current.

1. [x] **184.1 — DONE 2026-08-29. `dispatch_status.py` reports rule 5's input, so a
       wake cannot quote a stale metric without seeing that it is stale.**

       ```
       Optimize     10 wake-date(s) newer   since 2026-08-19 23:09   STALE
                    [newest pair: framework_classes; 99 sample(s), 12 of 30 sampled twice]
       -> rule 5's newest comparable pair predates 10 wake-date(s) of loop activity…
       ```

       **Red-proved by injection — all five branches exercised, each injection
       confirmed to have landed before the script was run** (the file listed as
       absent, the line counted, the appended row grepped), never by reading the
       diff, with the file restored and checked against `git status` afterwards:
       appending a second `ci-wall-time` sample dated on the newest log wake-date
       flipped the line to `0 wake-date(s) newer … ok`; a non-JSON line and a
       valid-JSON line missing the keys both made it **refuse to print a verdict**
       and exit **1**, honouring the contract its own header already stated; the
       file removed reads `NO INPUT`; a file of two singleton names reads
       `2 sample(s) over 2 name(s), none sampled twice — NO LIVE INPUT`, which is
       the branch that matters most, since three such samples are exactly what the
       last ten days actually contain and "3 recent samples" is not the
       reassurance it looks like.
       Reconciliation is against the raw non-empty line count of the file itself,
       not against anything the caller passed — the self-consistency trap CLAUDE.md
       names. Independently cross-checked by `rebuild_from_log.py`, which reads the
       same file through different code and reports **99 metrics**.

       **Base rate, measured before shipping** and replayed over all 17 wake-dates
       in the log with as-of-date semantics (only samples that existed on the day):
       **live on 6, stale on 11, and stale on every one of the last 10.** The
       predicate reads both ways, so it is not one already true of everything — the
       failure mode this repo has hit repeatedly. The command is in the script,
       beside the threshold it justifies.

       **One design point was found by checking rather than reasoning.** The
       comparison is by DATE, not timestamp, because the two dispatchers write naive
       stamps at different offsets: this wake recorded at `00:37` while the log's
       newest row, written by the other dispatcher, reads `08:21` **the same day**.
       A timestamp comparison would have reported STALE on a wake that had just
       recorded a metric. Noted in the code next to the comparison.

       **Declared `@exact`** with the reason stated: the verdict rests on equality
       and comparison of dates, names and counts, with no recognition step to fool.
       `check:selftests` does not reach `scripts/loops`, so the rule is honoured by
       hand here, as this file's `slice_of` heuristic already does with its own
       `--self-test` (14 cases, still passing).

       **What this does NOT do, said plainly: it does not make anyone record a
       metric.** It makes the omission visible at the one moment every wake looks.
       One metric was recorded this wake — `axe-violations 0 pages`, genuinely
       measured live (`test:axe`, 127 pages × 2 widths, zero violations) — which
       flipped the line to `ok` on real data rather than on an injection. **That is
       one sample on one wake, not a restored criterion**; if the next wake records
       nothing, the line reads stale again, which is the entire design. Refused:
       recording `check:claims`' 141 under the existing `claims` name, whose earlier
       samples (65 → 82) measured something else — the same discipline the log
       records twice for removing a `ci-wall-time` reading taken from a FAILED run.

       Original text: The process half — "record a
       metric every wake" — is what 28.1 already tried, and it is a process rule with
       nothing mechanical behind it; it lasted one day. This is the mechanical half,
       and it goes in the instrument Step 0b already runs every wake rather than in a
       new gate.
       *Accept*: the rule-5 line names **the newest sample rule 5 could quote** (the
       newest sample of a metric holding at least two) and **how many wake-dates are
       newer than it**; its numbers **agree with a raw count taken from
       `loop-metrics.jsonl` itself**, not with anything the caller passed in, and it
       **refuses to print a verdict** when the file's raw line count and its parsed
       sample count disagree — the guard `rows()` already applies to the log. The
       live/stale threshold is **not invented here**: it is 28.1's own adopted
       criterion, *recorded every wake*, so the line reads live only when a metric
       completed a comparable pair on the wake-date reported. **Red-proved by
       injection** — appending a second sample of a name flips the line, confirmed by
       running the script, never by reading the diff — and its **base rate measured
       before shipping**, replayed over every wake-date in the log with as-of-date
       semantics, so it is known to be a predicate that can read both ways rather than
       one already true of everything. It declares its signal per the self-test rule.
2. [x] **184.2 — DONE 2026-08-29. Rule 5 now carries the budget-breach clause §4 has
       had since 2026-08-23, restated where it was fixed rather than silently
       patched**, and rule 5 additionally tells a wake to read the new line first and
       to say the rule *could not be evaluated* when it reads STALE — because a rule
       answered from a dead instrument reports "nothing to do" exactly as
       convincingly as a healthy one. `LOOPS.md` Step 0b was corrected in the same
       pass: it claimed the script covers "the two rules", which the same commit made
       false. Original text: §4's
       Trigger reads "on demand, or when a tracked metric regresses on two consecutive
       runs, **or when a size budget is breached outright**", with the third clause
       dated 2026-08-23 and justified by Optimize having fired 3 times in 740
       iterations. Step 2's rule 5 — the text a dispatcher actually evaluates — carries
       only the trend clause. So the trigger added *because the trend trigger was dead*
       was never added to the rule that dispatches, which is the same two-documents-
       disagreeing shape LOOPS.md records about `check:resume-charter` being hardened
       and demoted 44 minutes apart.
       *Accept*: rule 5's text and §4's Trigger **agree on the set of conditions that
       dispatch Optimize**, verified by reading both in the same pass; and the
       disagreement is stated where it is fixed rather than silently patched over.
## Slice 185 — `create-ui` is RELEASED, and two of this slice's own diagnoses were wrong (2026-08-29)

**RESOLVED 2026-08-29. `@busy-office/create-ui@0.1.0` is live and works.**
Verified as a consumer, not from the repo:

```
cd $(mktemp -d) && npm create @busy-office/ui -y
#   Scaffolded my-erp   -> index.html, package.json, README.md, server.mjs
#   deps: {"@busy-office/ui":"^0.5.0"}   <- resolves to the published core
npm view @busy-office/create-ui@0.1.0 bin   # { 'create-ui': 'index.mjs' }
```

The direction 164.3 set — *(a) adoption/DX, finish it by publishing
`create-ui`* — is **achieved**. It had been "one owner-only command away" for
eight wakes.

**Two diagnoses in this slice were wrong, and both are recorded rather than
edited away, because each was confidently reasoned from real evidence.**

1. **"The registry 404 means it was unpublished, so 0.1.0 is burned." FALSE.**
   The owner's publish succeeded at `01:30:23Z`; `npm publish` refused mine at
   `01:31:37Z` with *"cannot publish over the previously published versions:
   0.1.0"* — which was **accurate**, not evidence of an unpublish. Meanwhile
   `GET` returned 404 for several minutes. **A brand-new scoped package's write
   path knows it before the read path serves it**, and a 404 there is
   propagation, not absence. A published control (`@busy-office/ui` → 200) was
   used and still did not settle it, because the control was an *old* package
   and the lag is specific to *new* ones. On that false reading a version was
   bumped to 0.1.1 and a commit message asserted a burned version; the version
   is reset to 0.1.0 here, matching the registry and core's own convention.

2. **"npm strips the `bin` entry, so the scaffolder would ship with no
   executable." FALSE, and it is the more instructive one.** The warning
   (*"`bin[create-ui]` script name index.mjs was invalid and removed"*) is real
   and `npm pkg fix` does prescribe dropping the `./`. But the published
   manifest reads `{ 'create-ui': 'index.mjs' }` — npm **normalised** the value
   rather than deleting the key. The verification that would have caught this
   was available and skipped: the tarball was unpacked (twice), which is one
   step short of asking the REGISTRY what it stored. **`npm view <pkg> bin` was
   the check, and it was only run afterwards.**

   The source fix (`7aa59fc`) is kept — it silences the warning and makes the
   source agree with what npm publishes — but it repaired nothing, and the
   commit that landed it claims a fatal bug it did not have.

**What WAS true, and remains open:** `.github/workflows/publish.yml` is 56 lines
and its final step is `npm publish -w @busy-office/ui` — **core only**. This
release was a hand publish; a GitHub Release still would not ship `create-ui`.

1. [x] **185.1 — wire `create-ui` into the release workflow.** Now that the
       package exists, its npmjs.com Trusted Publisher can be configured (that
       was the real chicken-and-egg, and it is resolved by 0.1.0 existing).
       *Accept*: a release publishes both packages, with the version question
       answered in the workflow's own comments — the tag gate asserts against
       `packages/core/package.json` (0.5.0) and cannot also assert create-ui's
       0.1.0, so either create-ui publishes without a tag assertion, gets its
       own `create-ui-v*` trigger, or the two go lockstep. **Do not silently
       drop the assertion for one package** — it is the only thing stopping a
       mistagged release. Owner-triggered publishing is unchanged.

       **CLOSED by Slice 188 (2026-08-29, cloud wake).** Both packages publish
       from one release; the tag assertion is replaced for create-ui by its
       derived-pin check plus a new `check-publishable.mjs`, both red-proved.
       The workflow itself was NOT executed — a release is owner-triggered.

*(original finding, kept — its central claim about publish.yml is correct)*

### Original finding, kept verbatim — "`create-ui`'s E404 is not the owner hasn't published it yet"

**Owner asked "what to do?" about the standing E404. Measured, and the premise
in every handover since 164.3 is incomplete.** `RESUME.md`'s Direction block has
said for eight wakes that the remaining step is *"`npm publish -w
@busy-office/create-ui` — owner-only"*, as though the only missing thing were
someone running it.

**The release automation does not publish `create-ui` at all.**
`.github/workflows/publish.yml` is 56 lines and its final step reads:

```yaml
      - name: Publish to npm (OIDC, with provenance)
        run: npm publish -w @busy-office/ui        # <- core only, no create-ui
```

So publishing a GitHub Release — the documented, owner-triggered path — ships
core and silently skips the scaffolder. Nobody was withholding a command; the
command was never wired.

**The package itself is ready**, which is why this went unnoticed:
`npm run check -w @busy-office/create-ui` passes ("3 derived artefact(s) match
their sources, pin `^0.5.0`"), and `publishConfig.access` is `public`, so it
would not hit the scoped-package restricted default.

**Two things must be decided before it can be wired**, both owner calls:

1. **The version-match gate is single-package by construction.** The workflow
   asserts the release tag equals `packages/core/package.json`'s version. Core
   is **0.5.0**; create-ui is **0.1.0**. One tag cannot assert both, so adding
   a second publish step to this workflow means choosing: publish create-ui
   from the same release with its own version and no tag assertion; give it a
   separate `create-ui-v*` trigger with its own gate; or move the two to
   lockstep versions. Silently dropping the assertion for one package would
   remove the only thing stopping a mistagged release.
2. **Trusted Publishing is configured PER PACKAGE on npmjs.com**, under that
   package's settings — and `@busy-office/create-ui` has no package page,
   because it has never been published. **This needs confirming on npmjs.com
   rather than assumed here**, but the likely consequence is a chicken-and-egg:
   the first publish cannot use OIDC and must be done manually (token or 2FA),
   after which the Trusted Publisher can be set and CI takes over. If so, the
   first release genuinely is a hand operation and the workflow change only
   covers releases *after* it.

**UPDATE 2026-08-29T01:37Z (cloud wake, Slice 186's grill) — THE E404 IS GONE,
AND THIS SLICE'S CHICKEN-AND-EGG HYPOTHESIS WAS CONFIRMED BY EVENTS.** Asked the
registry, which is the authority, rather than copying this slice's own text:

```
npm view @busy-office/create-ui version                 # 0.1.0   (was E404)
npm view @busy-office/create-ui time --json             # 0.1.0 published 2026-08-29T01:30:23.790Z
npm view @busy-office/create-ui name dist-tags maintainers
#   name = '@busy-office/create-ui'  dist-tags = { latest: '0.1.0' }
#   maintainers = 'thepfmind <thepfmind@gmail.com>'
node -p "require('./packages/create-ui/package.json').version"   # 0.1.0 — agrees
```

**The timing pins the causation, and both dispatchers' clock offsets were resolved
to UTC before claiming it** (`ENVIRONMENT.md`: local writes `+0800`, cloud `+0000`):
this slice was filed at `6c4cfae` **01:16:54Z**, and the publish landed
**01:30:23Z — 13½ minutes later**. So item 2's prediction — *"the first publish
cannot use OIDC and must be done manually, after which the Trusted Publisher can
be set"* — is what actually happened. The finding was acted on, by hand, at once.

**Two sentences in this slice are now false and are struck rather than
overwritten** (the strike-don't-overwrite rule): *"it has never been published"*
and *"`@busy-office/create-ui` has no package page"*. It has one, since 01:30Z.

**What this does NOT close, and it is now more urgent, not less.** The workflow
still publishes core only, so **the next release silently skips `create-ui`** —
and the package is now LIVE, pinning `^0.5.0` against a core that will move. The
failure mode has changed from *"the front door 404s"* to *"the front door ships a
stale pin and nothing republishes it"*, which is quieter and worse. Item 1's
version-match question is unchanged and is still an owner call.

**The direction moved: `RESUME.md`'s Direction block named exactly this as the one
thing that would be new information** (*"the registry answering something other
than E404"*). It is answered.

*Accept*: either the workflow publishes both packages on a release with the
version question answered explicitly in its comments, or a recorded decision
that create-ui ships on its own trigger — plus `RESUME.md`'s Direction block
corrected, since its "remaining step" has been wrong for eight wakes. **Finding
this false is the satisfying outcome**; the direction was never one command away.

## Slice 183 — the visual backlog that waited eight wakes, cleared (2026-08-29)

**Not new input, and not a dispatched rule.** Rules 1-3 were unarmed; rule 4 had
nothing (all six open items owner-blocked, re-read this wake and unchanged);
rule 5 nothing. Rule 6 → Polish was reachable and was **not taken**: §3b step 4
requires a blind re-score by a SECOND agent, this session is not permitted to
spawn one, and running steps 1-3 then scoring my own change is precisely what
that step forbids ("it would be marking its own homework"). A self-approved
Polish round is worse than no round, because it consumes budget and cannot fire
the dry exit.

So this wake took the work `RESUME.md` says only a local wake can do. Five
visual items had been carried **eight wakes** with the standing note *"None is
dispatchable here; all need a local wake with a browser."* Cloud wakes have no
Podman, no screenshots. This one has both.

**All five measured at 390px, and all five are clean. No defect found.**

| carried item | result |
|---|---|
| `DsaScore`'s `<span class="bo-badge">generated</span>` inside an `<h2>` — renders on **39** pages, so a bad wrap wraps 39 times | **1.1 lines**, `badgeRight` 192-321 against a 390 viewport, `badgeOverflows: false` on every heading |
| `/components/scan` DSA table at 390px — new in 176.1, never seen | clean; three columns inside the 340px container |
| `/components/state-patterns` DSA table — 182.1's repaired `colour` cite is **longer** than the one it replaced | wraps in-cell; table width 340 = container width, no spill |
| `/components/data-table` `#markers` at 390px, **both themes** | `docOverflow: 0` in light and dark |
| `/concepts/scale`'s first decision table (178.3 changed a `<td>`) | `docOverflow: 0` |

**The measurement, not just the screenshot.** `docOverflow` read **0** on every
page in every theme, and each table was checked against *its own scroll
container* as well as the viewport — the wide tables report
`spillsViewport: true` **with** `scrollable: true`, which is the designed
behaviour (`.bo-data-table-container` is `overflow-x: auto`) and is what
`check:scroll` already asserts across 804 containers. Reporting those as defects
would have been measuring the wrong box.

**Two incidental confirmations**, both of things `RESUME.md` warned a wake might
get wrong:

- `state-patterns` emitted the three badge headings **twice**, which is the
  39-pages/40-entries distinction stated rather than assumed: the page renders
  `<DsaScore` twice. The handover's "do NOT correct 39 to 40" holds.
- `/components/scan` now reads **`Scored 2026-08-28`, 100% (18/18)** — 176.1's
  round-1 score, which 182 discovered had never been written to
  `dsa-scores.json`, is present.

**Still owed, and still not doable here:** the two blind re-scores (`scan`'s
three dimensions, `skeleton · colour`). They need a second agent. Until one
runs, the dry-round exit cannot fire — the mechanism 176.3 is open about.

## Slice 182 — Polish round on `state-patterns`: the rubric cited the bug, not the fix (2026-08-28)

**Dispatcher rule 6, cloud wake.** Rules 1-5 gave nothing: no open P0 (all seven
gates green on `origin/main` at `65139a8` — core `build`+`test` 146, `docs:build`,
`check:repo`, `check:claims` 141, `check:layout` 127, `test:axe` 127x2), GitHub
intake **0 open issues** (asked via the API), rule 2 `Standardize 1/4`, rule 3
`Objective 1/3`, rule 4's six open items all owner-blocked (`112.3`, `112.4`,
`173.2`, `175.4`, `176.3`, `15.12` — each re-read this wake, not copied from the
handover), rule 5 no metric with two consecutive regressions (`ci-wall-time` flat
at 275s; `rf-essentials` 36.4 kB against a 40 kB budget).

`polish_requeue.py --apply` re-queued **9** surfaces, all `content: 3` at `1/3` —
the same unbroken tie 176.1 faced.

**Numbered 182, not 181: a collision, caught by the mandated pre-commit fetch.**
Step 0c's `git fetch origin main` before the first commit found `origin/main` had
moved `65139a8 → fb25abf5` mid-wake — the other dispatcher's PO-screenshot triage,
which had already taken `181`. Two sections under one number is exactly what
`check:slice-refs` fails on. Nothing else overlapped (their diff is `ROADMAP.md`,
`loop-log.md`, `STATUS.md`; this wake's work is `dsa-scores.json` plus the polish
ledger), so this rebased as a clean fast-forward. **That is the third collision,
and the second in a row to merge cleanly** — the same evidence 175.4 is open on.

1. [x] **182.1 — picked `state-patterns` on a measured discriminator, and
       §3b's reconciliation found a real defect.** It is the **only** page
       carrying two rubric entries, so every per-component arm has two chances
       to disagree with a ledger row written as one:

       ```
       node -e "const api=require('./packages/core/dist/api.json');
       const d=require('./apps/docs/src/data/dsa-scores.json').components; const bySlug={};
       for (const n of Object.keys(d)){const s=api.pageSlug[n]||n;(bySlug[s]=bySlug[s]||[]).push(n);}
       for (const [s,ns] of Object.entries(bySlug)) if (ns.length>1) console.log(s,ns);"
       # state-patterns [ 'skeleton', 'state' ]   — 39 pages, 40 entries
       ```

       Arms 1, 2 and 4 clean (clause present; `Design-system alignment` renders
       **2x** in the built page; the `content` cites quote the page clause
       verbatim and it is present — 1 in source, 3 in the built HTML). **Arm 3
       failed**: `skeleton · colour` cited *"gradient built from bg-muted/bg-hover
       tokens"*. The shipped CSS sweeps `--bo-color-bg-muted` to
       `--bo-color-skeleton-highlight`, and `bg-muted/bg-hover` is precisely the
       pairing that was REMOVED, because those two tokens are byte-identical in
       both themes — the shimmer swept from a colour to itself and nothing moved
       on screen. Dated exactly, both with `git log -S`:

       ```
       cite written  479cc6a9  2026-08-21   Slice 94 batch 4
       bug fixed     ef64c745  2026-08-25   fix(skeleton): the shimmer swept between a colour and itself
       ```

       So the rubric's **evidence for `colour: 3`** named the defect for three
       days, published verbatim on `/components/state-patterns`, while
       `dsa-scores.json`'s own `$comment` says *"Re-take a score when a
       component's design changes"*. Same shape as 176.1's `scan` finding — the
       published artefact disagreeing with the record — reached by a different
       arm.

       *Accept*: the `colour` cite names the tokens the shipped CSS actually
       uses, and the probe below reports zero references absent from the
       component's own CSS other than the adjudicated `money` one. **Met** —
       verified against the RENDERED page, not the diff: the built
       `/components/state-patterns/index.html` carries `skeleton-highlight` once
       and `bg-muted/bg-hover` zero times.

       **The score was NOT re-taken and `scored` stays `2026-08-23`.** §3b step 4
       requires a blind re-score by a second agent; this wake could not run one,
       so moving the date would claim an independent opinion that does not
       exist. This is a citation repair. `colour` is owed a blind re-score and
       the ledger now says so.

2. [x] **182.2 — base rate measured before proposing a gate, and the gate is
       REFUSED.** Across all 240 cites there are **28** token references (26 in
       `--bo-*` form, 2 as prose shorthand). Exactly **1** was absent from that
       component's shipped CSS — 182.1's. The one other hit is adjudicated a
       false positive: `money · typography · --bo-density-font-size` says
       *"(inherited from `.bo-input`)"*, and `.bo-input` lives in
       `components/form/`, which `money.css` composes
       (`.bo-money > .bo-combobox > .bo-input`).

       **Three dead instruments before a live one, recorded because the sequence
       is the finding.** (a) Matching only `--bo-*` found 1 miss — the `money`
       false positive — and could not see 182.1 at all, because the cite writes
       the shorthand. (b) Widening to token stems returned a **plain zero of
       240**, the tell: stems parse as `color-bg-muted`, while cites write
       `bg-muted`. (c) Adding trailing-segment aliases worked but reported **14**
       misses, 13 of them the bare CSS property `font-size` matching an alias of
       `--bo-density-font-size`, every one inside a negation (*"no raw
       font-size"*). Dropping aliases that appear as real declarations in the
       tree left the honest number.

       **Refused as a gate, on two independent grounds.** First, roadmap 101.3's
       stop rule forbids Polish adding gates. Second, and the one a later wake
       should weigh: **the repair trips the detector.** The first correction
       written here explained what `bg-hover` had been, and the probe went red on
       the fix — CLAUDE.md's *"assert on structure, never on raw text; the
       comment written by that same edit legitimately names the thing removed"*,
       hit live. A gate in this shape would forbid a cite from ever explaining
       its own history. That also decided the shipped wording: the forensic note
       was moved out of the published cite into the ledger, where it belongs —
       `DsaScore` renders the cite verbatim to readers.

       **Red-proved by re-anchoring, not by watching it pass**: run against the
       pre-fix JSON extracted to a probe file in the same directory, it reports
       **2** misses and names `skeleton · colour · bg-hover`; against the fixed
       tree, **1** — the adjudicated `money` one. Same CSS tree both runs, so the
       JSON is the only variable. The probe stayed in the scratchpad; its numbers
       are snapshots, so re-run it rather than quoting them.

3. [x] **182.3 — two counter observations, recorded rather than acted on.**
       Both came from 166.5's discipline — write the prediction down, then read
       `dispatch_status.py` immediately after recording.

       - **The prediction was wrong by one, for a knowable reason.** Predicted
         1085 rows, actual **1086**. `record_iteration.py --also-refused` emits
         its own `Meta · refusal` row, so one invocation carrying a refusal
         writes **two** rows, not one. Rules 2 and 3 held exactly as predicted
         (`1/4`, `1/3`). A wake predicting row counts must add one per
         `--also-refused`.
       - **161.4's premise is now false, and the rule is still right.** It
         excluded `Polish` from the slice-closing set on the measured ground
         that `Meta`/`Polish`/`Optimize` "have never named a slice at all".
         This wake's Polish row names 182.1/182.2, so that is no longer true.
         The counter behaved correctly anyway — rule 3 stayed at `1/3` — because
         the exclusion is by loop name, not by whether a row happens to cite a
         slice. **Recorded, not fixed**: 170 finding B already refuses adding a
         sixth classifying regex to this rule, and changing the set would need
         the same whole-log replay 161.4 ran (adding Explore and Objective moved
         the crossing count 23 → 23). Flagged so the next wake that re-derives
         161.4's premise finds this instead of re-measuring it.

## Slice 180 — P0: a loop-name tally is read as a slice citation, and `main` has been red since (2026-08-28)

**Dispatcher rule 1, and the P0 was found by the wake rather than reported.**
Step 0's environment setup ran `npm run docs:build` on a clean checkout of
`origin/main` at `f7c2070` and it exited 1:

```
FAIL roadmap 2 resolves
     Cited from .roundtable/grill-objective-173-176-177-178-2026-08-28.md but
     found in neither ROADMAP.md nor ROADMAP-archive.md.
slice-refs check FAILED — 1 of 362 slice citation(s) do not hold
```

**This is not only a local failure — it is the pushed default branch.** Asked
the API rather than assumed: run `33213989733` (CI) and `33213989703` (Deploy
docs to Pages), both `failure`, both on `f7c20708`, created `21:46:17Z`. All
**5** failing CI jobs die in the same place — `docs build` → `check:repo` — and
the two runs before it (`52a50b58`, `4be166be`) are `success`, so the break is
this push, not a drift. **The docs site has not deployed since.**

`git log -S'Roadmap 2 · Polish' -- .roundtable/` names one commit: `74d8c2b`,
Slice 179's own grill report, pushed with `f7c2070` at 21:46:08Z.

**What the gate matched.** Line 17 of that report is a tally of loop rows:

```
— Meta 12 · Continue 4 · Roadmap 2 · Polish 2 · Standardize 1; refused 13,
```

`Roadmap` there is a **loop name followed by its count**. The gate extracts
citations with `/\broadmap\s+(\d{1,3}(?:\.\d+[a-z]?)?)/gi`, which cannot tell
that from the citation form `roadmap 179.2`, so it demanded a `## Slice 2` that
has never existed. Nothing in the shipped package is affected — no `.css`, no
`.ts`, no `dist/` artefact — but every gate downstream of `check:repo` in
`docs:build` stops running, which is why five jobs and the deploy all fail on
one line of prose in a report.

**Case cannot be the discriminator, measured before it was tried.** Over the
461 matches the current pattern finds across the tracked tree: `roadmap` 434,
`ROADMAP` 15, `Roadmap` 12 — and **11 of those 12 Title-case matches are
genuine sentence-initial citations** (`Roadmap 171.1`, `Roadmap 159's finding`,
`Roadmap 131.1/135.1`, …). Only the tally is not one.

**The tag was wrong too.** The gate declares itself `@exact`, on the grounds of
"equality and set membership over strings matched at a fixed lexical position".
The heading arm is exactly that. The other arm is a bare word regex over free
prose, which is *recognition* — and it has now been fooled. `check:selftests`
therefore never asked this gate for a `--self-test`.

1. [x] **180.1 — DONE. The extractor no longer reads a loop-name tally as a
       citation, and the gate is retagged `@heuristic` because that arm always
       was.**

       **The skip predicate, and its base rate measured on the UNEDITED tree
       before it shipped:** a match is not a citation when it has a ` · `-joined
       neighbour of the form `Word Number` on either side. True of **1 of 461**
       matches — the one false positive. Not 0, not 100%, so it distinguishes
       something (94.11).

       ```
       # the predicate, over `git ls-files` filtered to .css/.mjs/.js/.astro/.md/.py
       # minus ROADMAP*: TALLY_AFTER = /^\s*·\s+[A-Za-z][A-Za-z-]*\s+\d/
       #                 TALLY_BEFORE = /[A-Za-z][A-Za-z-]*\s+\d+\s*·\s*$/
       ```

       **Case was tried first and refused, measured:** 461 matches split
       `roadmap` 434 · `ROADMAP` 15 · `Roadmap` 12, and **11 of the 12**
       Title-case ones are genuine sentence-initial citations. A case rule would
       have broken eleven real citations to fix one tally.

       **Reconciled against an independent recount, outside the gate** — the
       Accept's second criterion. The gate reports `364 slice citation(s)
       checked (204 cited, 2 known-dangling)` and `162 slice number(s)`; a
       separate Python pass over the same corpus reads **204 distinct refs, 162
       headings, 364 checks, 0 unresolved**. Agreement on all four.

       **Red-proved in both directions, each injection confirmed to have landed
       before the result was believed:**

       | injection | new gate | old gate |
       |---|---|---|
       | `roadmap 999.9` appended to a scanned file | **red**, names 999.9 | red |
       | a *differently worded* tally, `Objective 3 · Roadmap 7 · Explore 1` | **green**, exit 0 | **red**, `FAIL roadmap 7`, exit 1 |

       The second row is what makes this discriminating rather than a detector
       agreeing with itself (179.1's shape): the old extractor, run from a probe
       copy in the same directory — never `git stash`, per `ENVIRONMENT.md` —
       fails on the identical bytes the new one passes. And the raw pattern was
       printed against the injected file first (`raw regex sees: [… "Roadmap
       7"]`), so the green is the skip working, not the match being missed.

       **The self-test is red-proved too.** Stubbing the classifier to never
       skip (`if (false && …)`, injection confirmed present by grep) turns **4
       of its 10 cases** WRONG and exits 1; restored, exit 0.
       `check:selftests` reads 43 gates as `15 heuristic (all self-tested) / 28
       exact`, and the tag counts computed off the `HEAD` blobs versus the
       working tree move **14/29 → 15/28** — exactly one gate, this one.

       **Two things fixed while here, both this repo's own rule about stale
       snapshots (177):** the header claimed "**148** slice numbers are cited"
       twice while the run line read 362, and the standing-down message a
       reduced build context prints said "the 148 slice citations were NOT
       verified here". All three now name the property; the gate prints the
       count itself.

       **NOT fixed, recorded with the measurement that argues against fixing
       it:** the failing arm is the first check in `check:repo`, which is the
       first step of `docs:build`, so one sentence of prose in `.roundtable/` —
       a directory CI's `paths-ignore` excludes from *triggering* runs — stops
       all five CI jobs and the Pages deploy. The obvious reaction, "stop
       scanning `.roundtable/`", is refused on the numbers: **42** distinct refs
       are cited from there and **16 are cited from nowhere else**, so scoping
       the gate away from it would re-open the silent rot the gate exists to
       catch, for sixteen refs. Left as an observation in the gate's header,
       not as a queued item.

       *Accept* — properties, not predicted values:
       - `npm run docs:build` exits 0 on the tree at HEAD, and the CI run on
         the pushed commit reports `success` (read from the API, not inferred
         from the local run).
       - `check:slice-refs`' own reported citation count agrees with an
         independent re-count of the same corpus taken outside the gate.
       - The skip predicate's base rate is measured on the unedited tree
         **before** it ships, and recorded here with the command. A predicate
         true of everything, or of nothing, is refused (94.11).
       - Red-proved in **both** directions, each injection confirmed to have
         landed before its result is believed: an unresolvable citation makes
         the gate red and names it; a second, differently-worded loop tally
         leaves it green; and the **old** extractor goes red on that same tally
         injection, which is what makes the red-proof discriminating rather
         than a detector agreeing with itself (179.1's shape).
       - The gate's `@heuristic`/`@exact` tag agrees with what the code
         actually does, and `check:selftests` agrees with the tag — including
         the `process.argv` branch that runs a real self-test, which is the
         thing that meta-gate checks rather than the tag text.
       - The self-test itself is red-proved by stubbing the classifier.

       **The grill report's tally line is left exactly as written.** Rewording
       it would restore green in one edit and fix nothing: the next tally
       breaks the branch again. Left in the tree it is a live fixture — the
       gate's correctness is exercised by real content on every run, not only
       by its own self-test.

## Slice 179 — Objective grill of Slices 173, 176, 177, 178 (2026-08-28)

Dispatcher rule 3 at **4 / 3 OVERDUE `[173, 176, 177, 178]`**; rule 1 found no
open P0 and GitHub intake is empty (**0 open issues**, asked via the API, not
assumed), rule 2 read `Standardize 0 / 4 ok`. Full report:
`.roundtable/grill-objective-173-176-177-178-2026-08-28.md`. `.roundtable/INDEX.md`
checked first — 148 files, 4 repeated subjects, and no existing report names any
of these four slices.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders — one Python script under
`scripts/loops/`, plus prose in `LOOPS.md`, `ROADMAP.md` and `.roundtable/`.
`git diff --stat` names no `.css`, no `.astro` and no file under
`packages/core/src`, so there is no visual surface to have looked at.

1. [x] **179.1 — DONE. `report_loop_prose.py` reconciles in one direction, and
       it is the direction that has never failed.** The script asks, of every
       path in `FILES`, *is it on disk?* — a listed file that vanishes, which has
       happened zero times. The failure that has happened **twice** is the
       reverse: a durable loop file is created, `LOOPS.md` starts telling every
       wake to read it, and `FILES` is not updated. 167.2 caught it by hand;
       169.3 did not, and 178.1 found it a day later — after 1,467 words were
       scored as a shrink in `RESUME.md` and 1,666 went unmeasured at the
       destination. 178.1's red-proof (`ENVIRONMENTT.md`) exercises the arm that
       has never fired.

       *Accept* — properties, not predicted values:
       - The script fails when a `.md` file the dispatcher region names is
         measured by neither `FILES` nor an `EXEMPT` entry **carrying a reason**.
       - The predicate's base rate is measured over history **before** the
         assertion ships, and it distinguishes rather than being true of
         everything (94.11).
       - Both arms are red-proved with the injection asserted to have landed
         first, and the pre-179.1 script is shown **passing** on the same
         injection — otherwise the new arm has not been shown to add anything.
       - A region anchor that cannot be located is **reported as fatal**, never
         returned as an empty set.
       - If the new assertion rests on recognition, the tag says so and a
         `--self-test` exists that has been watched failing.

       **Met.** Base rate replayed over the 15 commits where both files parse:
       **9 of 15 red (60%)** — one defect episode, nine commits wide, opening at
       `f52f2597` (169.3) and closing at `e409a0fe` (178.1). Not nine independent
       instances, and said so. Red-proof, `count == 1` asserted before replacing,
       probe copy in the same directory (never `git stash`):

       ```
       pre-179.1 script, ENVIRONMENT.md row deleted  -> exit 0, silent
       post-179.1 script, same deletion              -> exit 1
           .roundtable/ENVIRONMENT.md: named in LOOPS.md's dispatcher region,
                                       measured by nothing here
       ```

       Retagged **`@heuristic`** (it now reads prose) with a 7-case
       `--self-test`, every case paired with its near-twin: a dated report
       filename is skipped and the same name without a date is not; a bare
       `ENVIRONMENT.md` resolves to the `.roundtable/` path; a path below rule 5
       is out of the region. Red-proved one level up — stubbing
       `dispatcher_md_paths` to return an empty set exits 1.

       **Recorded, not filed:** `check:selftests` reads only `check-*.mjs` under
       `apps/docs/scripts` and `packages/core/scripts`, so **no
       `scripts/loops/*.py` tag is enforced by anything**. 2 of 9 carry a tag and
       both are honest (`dispatch_status.py --self-test` classifies 14 cases). A
       gate over zero defects would be ceremony; this line exists so a third bad
       tag is not re-discovered as new.

2. [x] **179.2 — DONE. Slice 177's "both readings agree" is a ratio and its
       denominator, and the quantity that says what a wake pays moves the other
       way.** 177 (and `LOOPS.md` rule 4) concluded *"the sweep is not converging
       on a steady state"* from cycle length halving while per-commit rate rose.
       **Rate × length = regrowth identically**, so those two cannot disagree by
       construction; the rate rises *because* length falls faster than the total.

       *Accept*: the trend is re-derived with the fourth sweep included, and both
       documents state whichever way the measurement comes out — finding 177
       right is a satisfying outcome.

       **Met, and 177 is half right.** Re-derived over all **725**
       ROADMAP-touching commits, by the line drop rather than by subject line.
       177.1 closed the cycle 177 could only measure mid-flight:

       | cycle | trough | peak | regrowth | commits | per commit |
       |---|---|---|---|---|---|
       | after 110.4 (08-22)    | 5,562 | 9,824 | **4,262** | 141 | +30.2 |
       | after tidy-44 (08-25)  | 1,094 | 4,461 | **3,367** |  67 | +50.3 |
       | after 165's 20 (08-28) | 1,508 | 3,872 | **2,364** |  35 | +67.5 |

       The unreported third column **falls**, as does the peak a wake walks
       (**9,824 → 4,461 → 3,872**). Rule 4's cost is the peak, so on that number
       the sweep **is** converging, 2.5x across three cycles. Cycle length is
       partly endogenous besides — a cycle ends when a wake notices, and the
       trigger fell with it.

       **What stands:** the per-commit rise is real (each commit writes 30 → 68
       lines), 177's generator measurement (61% of swept lines are grill slices
       that also have a `.roundtable/` report) is untouched, its figures
       reproduce within the boundary convention, and its one forward prediction
       **held** — the fourth sweep came 35 commits after the third. This corrects
       an interpretation, not a measurement. `LOOPS.md` rule 4 carries the
       three-column table; ROADMAP 177 carries a correction block in place, so
       the original reading stays readable.

3. [x] **179.3 — the window's re-derived claims, one line each, per the
       playbook's "a clean round is worth one line, not a re-derivation".**

       - `report:css-repeats` — **74 files · 237 rules · 225 distinct · 8
         repeated**, groups x4/x3/x3/five-x2, matching `LOOPS.md`'s table on every
         figure. 178.4 reproduces exactly.
       - `check:wrong-choice` — **37 carry / 1 outstanding / 3 exempt**;
         patterns 39/0. 176.2's premise reproduces.
       - `check:slice-refs`' sufficiency argument re-measured at HEAD: **153
         pointer stubs in `ROADMAP.md`, 153 distinct slice numbers in the
         archive, set-equal both ways**; 160 live headings, 160 distinct. Holds.
       - Refusal rate **36.50%** (223 of 611 decided), continuing the creep
         33.5 → … → 35.25 → 36.50. Two independent parsers agree to the decimal;
         356 legacy rows excluded, the same 356 the previous grill measured.

## Slice 178 — Standardize sweep: the split that outran its own instrument, and a page that disagrees with itself (2026-08-28)

Dispatcher rule 2, `dispatch_status.py` reading `Standardize 4 / 4 OVERDUE`. Rule 1
found no open P0 (`grep -niE '\bp0\b' ROADMAP.md` returns only closed slice headings
and prose) and GitHub intake is empty (**0 open issues**, asked via the API, not
assumed), so nothing preempted it. Rule 3 was armed in the same wake
(`Objective 3 / 3 OVERDUE [173, 176, 177]`) and sits BELOW rule 2, so it stays
armed for the next wake rather than being consumed here.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px and 390px
in light and dark.** One docs page changed — `/concepts/scale` — and the change is
the TEXT of one existing `<td>`: no element added, no class, no style. `check:layout`
(127 pages) and `test:axe` (127 x 2 widths) swept everything green, `check:claims`
verified 141 documented behaviours live, and the `DOCS_BASE=/busy-office-ui` build
resolved the row's new link to `/busy-office-ui/components/pagination`. **That is
what ran. It is not the same as having looked at the page, and it is not claimed to be.**

1. [x] **178.1 — `report_loop_prose.py` never measured the file 169.3 created,
       and the comment directly above its own file list states the rule that
       required it.**
       *Accept was*: the report's file list agrees with the set of AUTHORED prose
       files `LOOPS.md` Step 0 through rule 4 instructs a wake to read — verified
       by naming the property that separates them, not by listing names.

       167.2's split added a `LOOPS-archive.md` row with this reasoning attached:
       *"WITHOUT this row the move would read as LOOPS.md losing 717 words, which
       is a shrink that never happened … An instrument that can be improved by
       moving text out of its own scope measures filing, not size."* **169.3 did
       the identical thing one slice later and no row was added.**

       ```
       git log --diff-filter=A --format="%H %ad %s" -- .roundtable/ENVIRONMENT.md
       #   f52f2597  2026-08-28  169.3 — move the durable traps out of the handover
       ```

       Measured, not inferred: at `f52f2597` `RESUME.md` went **3,150 -> 1,683
       words (-1,467)** and `ENVIRONMENT.md` appeared at **1,666**. That -1,467 is
       the **largest single down step in RESUME.md's 65-step series** since
       2026-08-20 (20 downs in that window) — a relocation the report scored as a
       shrink, with the destination unmeasured entirely.

       The destination is the half that matters: Step 0 instructs **every wake** to
       read it, and its own header says it is DURABLE (*"Edit it when a trap
       changes; do not re-copy it"*), so 158.2's ratchet premise applies to it —
       unlike the handover it was cut from, which the report already discounts as
       shrink-by-design. It sat at 1,666 words, `0 up / 0 down`, invisible.

       **Red-proved, and the injection was asserted before it was believed.** A
       probe copy in the same directory (never `git stash` — ENVIRONMENT.md's own
       trap) had only the new row's path broken to `ENVIRONMENTT.md`, with the
       replace asserting `count == 1` first; the probe exits **1** with
       `RECONCILIATION FAILED … .roundtable/ENVIRONMENTT.md: listed here but not
       on disk`. So the new row is genuinely reconciled against disk, not a silent
       zero. Probe deleted.

       The comment added with the row also names **what does not belong**: the
       generated mirrors a wake opens (`STATUS.md`, `.roundtable/INDEX.md`, the
       loop log) are written by `scripts/loops/*.py`, so a word count over them
       measures a generator, not anyone's writing.

2. [x] **178.2 — the same split misfiled `ENVIRONMENT.md` as a dated finding,
       which is the one thing its own header says it is not.**
       *Accept was*: `.roundtable/INDEX.md` classifies every `.roundtable` file by
       what it is, and the classification agrees with the file's own charter.

       `generate_roundtable_index.py`'s `LIVING` map had 7 entries and no
       `ENVIRONMENT.md`, so the file fell through into **Findings — snapshots** as
       a dateless row, inflating that count by one. It is written to repeatedly and
       read by the loop every wake, which is that section's literal definition.

       ```
       python3 scripts/loops/generate_roundtable_index.py
       #  before: 141 findings, 7 ledgers      after: 140 findings, 8 ledgers, 46 uncited
       awk '/^## /{s=$0} /ENVIRONMENT\.md/{print s" || "$0}' .roundtable/INDEX.md
       #  exactly one hit, under "## Living ledgers"
       ```

       Verified on the regenerated artefact rather than on the diff: one link, in
       one section, and the findings count moved by exactly one.

3. [x] **178.3 — the prose cadence's verdict for `/concepts/scale/`, the one
       flagged page carrying none — and the verdict is that the page contradicts
       itself, which is not a length problem.**
       *Accept was* (158.2's cadence): every page `report:prose` flags — over 2x
       the corpus median or over 2x its family median — carries a recorded verdict,
       or gains one here.

       ```
       npm run report:prose -w docs
       #  118 pages · median 748 · total 104,737 words
       #  9 over 2x the corpus median (1,496); 12 over a family median; union = 14
       ```

       **13 of the 14 carry a verdict** — 158.1's twelve plus 161.1's three, 15
       pages in all. `/concepts/scale/` is the one that does not, and it is newly
       flagged: source words **530 (2026-08-17) -> 1,806 (HEAD)**, with **+220 on
       `3c9964f2`, 2026-08-28** — after 166.1 last checked this property and
       recorded zero unverdicted pages. 166.1 was right when written.

       **The needle lied first, exactly as CLAUDE.md predicts.**
       `grep -Fc -- "/concepts/scale/" ROADMAP.md ROADMAP-archive.md` reads **0**
       — a confident absence — while `grep -Fc -- "/concepts/scale"` reads **4**.
       One trailing slash. A plain zero was treated as a defect in the instrument
       until re-tested, which is the only reason the four mentions were read at all
       (none of them is a prose verdict; the finding survived).

       **The verdict: honest coverage, and the page is dense rather than padded** —
       1,168 words, **1,168 authored + 0 generated**, across 7 `<h2>`s = 167 words
       per section against 158.1's corpus median of 103. Nothing here is
       boilerplate and nothing is said elsewhere.

       **But reading it for the verdict found a real defect the length never was.**
       The page carries two decision tables, and they give **different answers to
       the same question**. Both edits came from ONE commit:

       ```
       git show a1239e02 -- apps/docs/src/pages/concepts/scale.astro
       #  + old table:  "Beyond ~5,000, scanning"  -> a windowed list
       #  + new table:  "~2,000–50,000, scanning forward through a bounded feed" -> load-more
       #  + new table:  "50,000+, unbounded"                                     -> a windowed list
       ```

       So at ~10,000 rows the older table (`cd44a14b`, 2026-08-17) sends a reader
       to windowing while the newer one (`04e44344`, 2026-08-18, refined by
       `a1239e02`) sends them to load-more. **The page itself states which is
       right**, in the caption under the newer table: *"Windowing earns its place
       only once scanning itself needs memory to stay flat, not merely once row
       counts get large"* — and warns that reaching for windowing early is *"the
       most common way to make a screen slower and less accessible at once."* The
       old row is the stale one; 30.4b added the finer bounded/unbounded axis to
       one table and left the other saying what it had said before.

       Fixed as one row's text, so the two tables now agree:

       > Beyond ~5,000, scanning → *Load-more while the feed is bounded; a windowed
       > list only once memory must stay flat.*

       **Word-neutral, measured on the rebuilt artefact**: `report:prose` reads the
       same corpus total (104,737) and the same page total (1,168) after the fix.
       Verified in the BUILT html, not the diff — the new row renders, the old
       clause `"the framework's one first-party exception"` returns **0**, and the
       `#windowed-list` anchor it points at still exists.

       **No gate, and the reason is the standing one.** *"Two tables on one page
       disagree about the same decision"* is semantic; 94.11 already paid for the
       lesson that a gate can enforce the SHAPE that carries a property but not its
       meaning. The mechanism that caught this is the cadence itself — a human
       reading an outlier — which is what 158.2 says it is for.

4. [x] **178.4 — the other three sweeps: zero delta, recorded in one line each,
       per the playbook's "a clean round is worth one line, not a re-derivation".**

       - `npm run report:css-repeats -w @busy-office/ui` — **74 files · 237 rules ·
         225 distinct bodies · 8 repeated**, matching `LOOPS.md`'s table on every
         total and every group size (x4, x3, x3, five x2). Delta zero. The
         joined-control x4 is still **two components**, so its reopen trigger (a
         THIRD component) is unmet.
       - `npm run scan:dead-style -w docs` — **0 dead of 1,428 live** inline
         declarations, screen and print.
       - `python3 scripts/loops/report_loop_prose.py` — `LOOPS.md` now reads
         **32 up / 1 down**, so 167.1's stated finding condition (*"`LOOPS.md`
         still at 0 down after 167.2"*) is **not** met. No file changed accumulate
         class.

## Slice 27 — triaged from the owner QA review (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 28 — from the Objective grill of Slices 26-27 (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 32 — preventing AI slop when building with this framework (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 49 — Standardize sweep: inline styles, and the paths sweep's leftovers (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 57 — Owner input: the Ive design principles, installed (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 63 — Standardize sweep: finishing last sweep's partial review (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 144 — Owner wishlist: login's sticky actions, a comment/chat component (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 145 — Score the ERP-suite screens so the loop can benchmark them (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 143 — Owner wishlist: motion bug, sidebar-nav, offcanvas (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 142 — Owner wishlist: skeleton motion, state standardisation, command-bar states (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 141 — Owner: standardize the command bar (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 139 — Gap ledger promotion: the list screen with no way to create (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 140 — The two watch items: one refused, one already scheduled (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 138 — Owner wishlist: joined fields (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 137 — Owner wishlist: the richtext toolbar (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 136 — Owner: grill the rich-text DESIGN (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 135 — Owner wishlist: the RF track, four asks (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 134 — `test:visual` is red, and nothing runs it (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 133 — Owner: prove the scrolling actually works (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 132 — Owner wishlist: date entry, three pickers, list-to-list (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 131 — Owner wishlist: the RF pages show the screen twice (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 130 — ERP suite examples: the gap-finding instrument (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 129 — Objective grill of 126-128, and the gate hole it found (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 128 — Standardize sweep, round 1 (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 127 — the mobile-ERP candidates, grilled to builds (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 126 — RF coverage, grilled to a scope (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 125 — Explore/Research fallback: dogfood bugs + mobile-ERP candidates (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 124 — Owner: the left bar on a toned cell (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 123 — Owner answers, seven decisions in one message (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 122 — Owner wishlist: Amount decimal control + live masking (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 121 — Owner ask: grill the pattern catalogue for coverage + showcase (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 120 — Owner wishlist: dependent dropdowns, checked against an article (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 119 — Owner wishlist: the pattern catalog review, grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 118 — Owner decision: docs go showcase-first (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 117 — Owner wishlist: form label position, grilled to Top/Start (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 116 — Owner decision: inbox approval rows expand in place (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 115 — Owner input: the Motion System proposal, triaged (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 114 — Owner wishlist: adopt htmx 4 (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 113 — Owner wishlist: improve the rich text sample (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 112 — External governance/conformance proposal, grilled to a pilot (2026-08-22)

Owner supplied a rev-3 "Documentation, Governance & Conformance Improvement
Proposal" (uploaded 2026-08-22) proposing a consumer-facing validator
(`@busy-office/check`), a Screen Contract YAML, pattern metadata, a Quality
Index, waivers/SARIF/benchmarking, and a six-section docs IA. Reviewed
against the repo: **most of its P0 already exists here under other names**
(Surface Fitness ≈ the DSA rubric; admission gate ≈ the 99.4 front door;
mandatory doc cores ≈ the two recipes + `check-page-shape`; canonical
generated metadata ≈ the docs doctrine). The genuinely new bets were the
Screen Contract + pattern-fit layer. Grilled in a 2-round design-tree
session (report: `.roundtable/grill-112-pattern-fit-proposal.md`); the
owner's deciding call: **the checker is for AI agents building with the
framework** — not human enterprise teams. Final decision made on long-term
benefit: build the metadata substrate unconditionally; every superstructure
stays evidence-gated.

**Sequencing (settled Q5): this slice queues BEHIND 110.4 and 109.3.**
109.3's per-section quality bar is what the pilot judges against, and
109.3 grows the 13 outstanding wrong-choice clauses (settled Q9 — one pass
per page, not two).

1. [x] **112.1 — DONE 2026-08-22. `patterns.json` extracted, `gen-patterns.mjs`.**
       Self-tested (`--self-test`, red-proved by breaking the row regex and
       confirming the cases meant to catch it went red), reconciled by hand
       against 9+ pages including edge cases (a nested `<code>` tag inside
       a Data-contract cell, a wrong-choice clause with no alternative
       link). Wired into the docs build chain right after
       `gen-patterns-index.mjs`. No new drift gate added — 112.1's own
       Accept asked only for the extractor to be red-proved, not for a
       staleness gate; adding one would be scope creep beyond what was
       asked. Original item text follows.
       `patterns.json`, extracted not authored. A
       `gen-patterns.mjs` scrapes the pattern pages (the single source of
       truth stays the pages, per doctrine) into a generated per-pattern
       record: group, opener, complexity, components-used, the States
       table rows, the Data-contract table rows, and the wrong-choice
       clause text + its alternative link (today detected then thrown
       away by `wrong-choice-rule.mjs`). **Anatomy is deliberately out of
       scope** — its `<li><strong>Region</strong>` convention fuses
       component links into prose (approval's entries carry
       parenthetical asides a naive extractor would swallow); extract it
       only after a page-side convention tightening earns it. Technique
       precedent: `check-components-used.mjs`'s section-slice against
       dist. Red-prove the extractor per the instrument doctrine — first
       output is wrong until reconciled against a hand count.
2. [x] **112.2 — DONE 2026-08-22.** `llms.txt` gained a `## Patterns`
       section generated from `patterns.json`: per pattern, name/URL,
       opener, complexity, components, and the wrong-choice clause +
       alternative link — the task-fit data an agent needs to pick the
       right SHAPE before reaching for components (Objective §4). Kept
       lean deliberately: full States/Data-contract row text stays on
       the page itself, not duplicated here — including it would have
       roughly doubled the file for detail a pattern-fit decision
       doesn't need. Same anti-drift guard as 32.3's precedent (throws
       if the catalogue is missing or under 20 patterns), red-proved by
       truncating `patterns.json` to 2 entries and confirming the build
       actually threw before restoring it. File grew 22.9kB → 36.7kB,
       53 → 81 URLs verified. Full suite green (13 docs gates incl. the
       URL-resolution check on all 29 new pattern links; `check:claims`
       90/90).
3. [ ] **112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR
       ANSWERS (grilled 2026-08-29 at the owner's request; full report
       `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).** The
       block is now *precise*: every precondition the pilot set for itself has
       landed, so briefs are the only remaining input, and four questions
       decide whether they are worth spending.

       - **All four self-imposed gates are met.** Substrate complete
         (`patterns.json`: 39 patterns, **39/39** carrying states, data
         contract and wrong-choice); llms.txt coverage present (83
         `patterns/` refs for 39 pages); 110.4/109.3 landed; wrong-choice debt
         down to 1, and that one is the deprecated `date`.
       - **Part of the superstructure already shipped without the verdict.**
         Q7 said the "Which pattern should I use?" page comes *after* the
         verdict; it shipped as 112.5, generated from `patterns.json`. Half of
         Q7 honoured (canonical source), half not (no verdict). **Recorded,
         not actioned** — the decision with teeth gated only 112.4, and
         un-shipping a generated docs page to satisfy a sequencing clause
         would be ceremony. What it does establish: the verdict no longer
         gates anything a wake can build, only 112.4, which is itself blocked
         on 112.3. A closed loop with the owner on both ends.
       - **The suite answers a NEIGHBOURING question for free** — whether a
         correctly-picked pattern's anatomy suffices (GAP-17, 6 of 7 list
         screens). It must NOT count toward the bar: it measures completeness
         rather than discovery, and it was produced by an agent with repo
         access, so counting it is self-approval.
       - **"Briefs are burn-once" is asserted, not established** — the pilot
         agent is specified llms.txt-only with no repo access, so a fresh
         session arguably cannot see a brief that lives in the repo. Marked
         Hypothesis: the isolation is unverified.

       *Owner decisions needed (recommendations in the report):* is the pilot
       still worth the briefs (**yes, as 112.4's admission gate only**); how
       many (**five, not eight — the bar is an absolute count, so eight raise
       the hit-rate, not the standard**); does suite evidence count (**no**);
       and are briefs re-runnable (**test it with one brief before believing
       either way**).

       **OWNER DECISION 2026-08-29: agree, all four recommendations.** Pilot
       proceeds as 112.4's admission gate only; **5 briefs**, not 8; suite
       evidence (GAP-17-style) does **not** count toward the bar; and the
       burn-once assumption gets tested rather than believed — run the first
       real brief, then re-run that same brief text in a fresh no-repo session
       and compare the two agents' picks/answers before treating any brief as
       spent. If they diverge, brief scarcity is confirmed and 5 stands; if
       they agree, briefs are a re-runnable regression test and the "scarce
       resource" framing that blocked this for weeks no longer applies.

       **Still blocked on one input no wake can supply: the owner writing 5
       real ERP screen briefs with sealed picks.** Nothing else in this item
       is dispatchable until at least the first brief exists in
       `.roundtable/pilot-112/briefs.md`.

       *(original item, unchanged below)*

       **Original item, kept verbatim — BLOCKED ON OWNER BRIEFS —
       protocol owner-confirmed 2026-08-23, scaffold ready.** The owner
       agreed to the protocol (after stress-testing the loop's format
       example — the duplicate-check-vs-reconciliation challenge, which
       also confirmed why briefs must be owner-authored). Scaffold at
       `.roundtable/pilot-112/` (README + briefs.md + SEALED-PICKS.md);
       the loop wrote only the scaffold, never brief content. Waiting on:
       5–8 briefs + sealed picks, then "briefs ready" starts the runs.

       **Realigned 2026-08-24 — still blocked, but with new evidence the pilot
       should account for.** The ERP suite has since built 25 screens from
       these patterns, and GAP-17 found `list-report`'s Anatomy omitted a whole
       region (the create action) — an omission that propagated into **6 of 7
       list screens**. That is real pattern-fit failure data from a different
       direction than the pilot measures: the pilot asks whether an agent
       PICKS the right pattern from the docs; this says a correctly picked
       pattern's own anatomy can be incomplete. It argues for the Screen
       Contract layer's premise without satisfying the pilot's verdict bar,
       which is deliberately about sealed owner picks.
       *(pre-registered protocol follows, unchanged)*
       32-style evidence before any contract surface exists. Protocol,
       pre-registered here so the verdict cannot be argued afterward:
       - **Briefs**: the owner writes **5** screen briefs from real ERP
         memory (revised down from 5-8 by the 2026-08-29 owner decision
         above — the bar is an absolute count, not a rate, so 8 only
         raised the odds of hitting it at 60% more owner time), unseen
         by the loop before the runs, each with the owner's own pattern
         pick sealed in a file the pilot agent can never see.
       - **Agent context**: a fresh subagent gets the brief text plus the
         IMPROVED `llms.txt` (post-112.2) ONLY — no repo access. One
         control brief re-run with nothing but the npm README.
       - **Runs**: one run per brief; any failing brief is re-run twice
         and the failure counts only if it appears in ≥2 of 3
         (variance guard).
       - **Measurement**: the full failure taxonomy, each row arguing
         for its own defense separately — pattern choice, invented
         APIs (regression check on 32.1/32.2), missed states,
         right-pattern-wrong-component (the 42-fields-in-a-Dialog
         class), contract violations.
       - **Verdict bar**: confirmed wrong-pattern picks (vs the sealed
         owner picks) on **≥2 briefs** → the Screen Contract layer earns
         admission and gets designed (112.4). Below the bar → **refused
         and recorded**; 112.1/112.2 stand on their own merits either
         way. Report lands in `.roundtable/`.
4. [ ] **112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.**
       Deliberately undesigned until admitted — schema, delivery
       (extend `bo-check-markup` vs new bin), and finding format are the
       post-pilot grill round. If 112.3 refuses it, this item closes as
       refused with the pilot report as the reason.
5. [x] **112.5 — DONE 2026-08-25, generated from `patterns.json` as required. UNBLOCKED
       2026-08-24 — the coupling to 112.3 cost more than it saved.** A
       task→pattern decision-flow page generated from `patterns.json` (never
       hand-maintained — it would be the fifth interpretation of the pattern
       system the proposal itself forbids).

       It was sequenced after the 112.3 verdict so the page and any contract
       pattern-selection logic would be one authoring pass from one source — a
       real saving, but a small one, and this item's own last line already said
       it **pays regardless of 112.4's fate**.

       **Realignment:** 112.3 has been blocked on owner-authored briefs since
       2026-08-23 and the loop cannot unblock it by design. Holding a page that
       pays on its own behind a gate only the owner can open trades a certain
       benefit for a possible second authoring pass. Decoupled: build it now,
       and accept that a later contract layer might touch it again.

       It is now **the only dispatchable build item in the backlog** — every
       other open item waits on the owner or on an unmet condition.

       **Shipped at `/concepts/which-pattern`**, under concepts rather than
       patterns: it documents no screen, so the pattern-shape gate rightly
       does not apply to it.

       Every cell is read from `patterns.json` — the same file that builds the
       tile index and the sidebar — so adding a pattern adds a row with no
       edit here, and rewording an opener rewords its row. Three things are
       extracted, because they are the three a reader chooses by: the job
       family, who the screen is for, and **the pattern's own statement of
       when it is the wrong choice**. That last is the most useful column and
       the most reliable source, because `check:wrong-choice` requires every
       page to carry the clause.

       Verified against the numbers measured BEFORE building, which is the
       independent check: **39 rows across 6 groups, 39 pattern links, and 17
       alternative links** — the clauses that name another pattern outright
       get a real link to it. Five rows show a dash, and the page says so in
       its own words rather than hiding it: a blank means the clause is
       phrased in a way the extraction did not match, never that the page is
       silent on it. Where a clause describes an alternative instead of naming
       it, the prose stands — inventing a link the author did not write would
       be the page guessing.

**REFUSED, with reasons (recorded per the grill's Q6 — re-open any of
these when a second real consumer of `@busy-office/ui` exists):**
- **Consumer Quality Index /100 + application benchmarking** —
  organizational-governance machinery for teams that don't exist yet;
  fails the proposal's own §16 demonstrated-gap rule. The anti-gaming
  design (§24 medians/percentiles) is good and is preserved here for
  the re-proposal.
- **Waiver system (PASS WITH WAIVERS, expiry, SARIF output)** — CI
  exception machinery for human orgs; an AI agent needs PASS/FAIL and
  readable findings, nothing more.
- **A second Surface Fitness rubric (proposal §13, 5-dim /15)** — the
  six-dimension DSA rubric already exists and is gated; running two
  violates the proposal's own §2.6. Its one real improvement — the
  Removal Cost axis + fitness×cost decision matrix (§15) — may be
  absorbed into the existing rubric as a future Standardize item.
- **The six-section docs IA reorg (§3)** — ~80% renames groups that
  were each measured into place more recently than the proposal was
  written (2026-08-16 comparative IA pass; 104.1's single-source
  grouping). Extracted instead: 112.5, and possibly an Integration
  sidebar group as a future small item.
- **Hand-authored pattern metadata YAML (§30)** — inverts the
  generated-from-artifact doctrine; superseded by 112.1's extraction.
- **A consumer-facing conformance web tool (§34)** — downstream of a
  Quality Index that is itself refused.

## Slice 111 — Owner wishlist: button group, dropdown animation, design-system reference (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 110 — v2 candidates approved and grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 109 — Owner direction: the real-ERP pattern catalogue + regrouping (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 108 — P0: object-page sticky bleed-through, z-index scale, tab-vs-anchor clarity (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 107 — Owner ask: button icon-only / text-only / icon+text (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 106 — P0: leaving the docs shell for the landing page silently failed (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 105 — Standardize sweep findings deferred with reason (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 104 — Owner wishlist: patterns section + tile index à la namethatui.com (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 99 — Owner direction: patterns as an ERP expert would actually build them (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 103 — Standardize: the dist-walking chokepoint regrew (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 102 — owner wishlist: three grills (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 101 — Objective grill: the loop optimised what it could see (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 100 — Owner wishlist: drag & drop list (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 98 — Standardize: the two wrong-choice gates were one rule, written twice (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 97 — Owner wishlist: validation check UX/UI (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 96 — Owner wishlist: currency on the right of the amount (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 95 — Owner wishlist: device-fitness and ERP-coverage scoring (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 94 — Review, improve and score the remaining 37 components (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 93 — Owner ask: show the alignment score on each component's page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 92 — Owner direction: the design system takes the wheel (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 91 — Standardize sweep: the conventions Slices 84-90 established, applied site-wide (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 90 — /design-grill: the three editing designs (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 89 — Owner screenshot report: two shipped defects in the dirty row-edit row (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 88 — Owner wishlist: split the table-column demos into value + qualifier columns (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 87 — /design-grill: the Combobox page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 86 — /design-grill: the Forms page ("Data Input - forms", clarified by "next") (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 85 — Owner wishlist: joined ( qty | unit ) becomes Quantity's Basic (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 84 — wake triage-noticing: Slices 71-81 shipped no CHANGELOG entries (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 83 — /design-grill: the "Data input" and "Values" groups (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 82 — Owner ask: redundancy review across Amount/Quantity/Money docs (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 81 — Owner ask: Quantity basic as ( qty | unit ), joined like Money (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 80 — /design-grill: Quantity's +/− buttons — optional after all (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 79 — /design-grill: Quantity & Money — do they need JS? (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 78 — /design-grill: the numeric family's DOCS — and a shipped UA-chrome defect (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 77 — /design-grill: the numeric family, incl. "Number" (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 76 — /design-grill: Amount vs. Quantity consistency (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 75 — Owner ask: apply the full Jony Ive design document (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 74 — Standardize sweep: sticky-cols' redundant "1" case (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 73 — Owner ask: grill a right-click column-header context menu (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 72 — Owner wishlist: multi-sticky columns, tone text, width/font (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 71 — Owner ask: server-controlled conditional cell tone (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 70 — Objective grill: the po-app dogfood streak (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 69 — Standardize: po-app's own three-Explore-wake drift (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 68 — Explore: record editing dogfooded in po-app (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 67 — Explore: PO creation dogfooded in po-app, a dead link fixed (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 66 — Explore: value-help dogfooded in po-app, backlog empty (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 65 — Standardize: two framework bugs the design-grill sweep queued (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 64 — from the Objective grill, Slices 51-63 (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 62 — from the Objective grill, Slices 56-61 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 61 — Owner wishlist: a generic, fixed review-screen contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 59 — Owner wishlist: RF-scanner browser floor + a smaller-screen profile (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 58 — Owner ask: run /design-grill across the screens (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 60 — Standardize sweep: one gate hand-rolled its own exit contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 56 — from the Objective grill, Slices 52-55 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 55 — Standardize sweep: two decisions that had each been written twice (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 54 — P0 + wishlist from the owner (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 53 — Owner input: grill components on need vs cost (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 52 — Owner wishlist: the Object Page (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 51 — from the Objective grill, Slices 45-50 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 50 — Standardize sweep: how pages carry layout, and one behaviour that knew too much (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 48 — Owner input: the SAP Object Page floorplan (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 47 — Standardize sweep: the widths we verify at (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 46 — from the Objective grill, Slices 37/38/44 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 45 — surface review, batch 1 outcomes (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 44 — from the Objective grill, Slices 39/42/43 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 43 — P0 found while doing 39.3 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 42 — from the Objective grill, Slices 39-41 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 41 — from the Objective grill, Slices 31-40 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 40 — icons, SVG, date picker, filter popup (owner wishlist, 2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 39 — the docs must make the first impression (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 38 — is the browser floor too new? (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 37 — score the surface for real ERP fit (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 36 — vertical tabs (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 35 — P0: tabs worked exactly once (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 34 — field editor: per-row save is the wrong idiom (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 33 — using this framework from ANOTHER repo, with AI (owner question, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 31 — DESIGN.md's own four-pattern table is wrong (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 30 — owner wishlist, triaged (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 29 — owner bug report (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## STATE — no dispatchable work; two owner calls (2026-08-18)

From the Slice 28 grill: `.roundtable/grill-objective-slice28-2026-08-18.md`.

**Every unchecked item in this file is undispatchable.** Three are NEEDS-RUNTIME
on owner hardware (VoiceOver, NVDA, AT runtime evidence); the fourth (Turbo) is
a conditional that has not fired. There is also no 1.0 definition anywhere in
the plan.

*(True on 2026-08-18, not now — 168.1 and 169.3 are both open and dispatchable.
Read the `N. [ ]` checkboxes, not this line. Noted 2026-08-28, Slice 170.1.)*

That is structural, not a lull: from here the dispatcher can only reach
Standardize, Objective and Explore — all of which generate work *about the
project*. It will keep producing self-referential improvement indefinitely and
look healthy doing it, because each piece of that work is genuinely good. The
Objective charter is a **filter, not a direction**: simplicity / less-for-more /
reusability say what to refuse, never what to build. Choosing a direction is
structurally an owner call, not something a loop can derive.

1. [x] **OWNER CALL — 0.2.0 release. ANSWERED 2026-08-21: owner triggered the
       publish, and it was cut as 0.3.0, not 0.2.0.** The tarball built at HEAD
       was labelled 0.2.0 but carried 304 commits of post-tag work (tabs,
       anchor-nav, context-menu, sticky-cols), so that number would have
       permanently described contents it did not have. 0.2.0 stays an accurate
       record of what was cut on 2026-08-18, annotated "tagged, never
       published"; the registry goes 0.1.1 → 0.3.0 and consumers get both
       sections' 83 entries, which the CHANGELOG now says outright. Tagged
       `v0.3.0` at `24c6e7d`, every gate green at 0.3.0. **Still not on the
       registry** — publishing runs through Trusted Publishing (OIDC), so it
       needs the owner to push the tag and publish a GitHub Release; tracked in
       `RESUME.md`, not here.

       Original text, kept for the record: **64 unreleased CHANGELOG entries**
       against a published **0.1.1** (`npm view` confirms). Slices 24-28 —
       query tokens, staging, mass change, four placeholder-only accessible
       names, the 1.46:1 search contrast, icons vanishing in print, the
       nav-label spill — are shipped, gated, and in nobody's `node_modules`.
       `npm install @busy-office/ui` today still gets the accessibility defects
       fixed two days ago. This is the previous grill's F5 one level up: the
       stale *site* was fixed, the stale *package* was not. Publishing is
       owner-triggered by policy; the work itself is done.

2. [x] **OWNER CALL — DECIDED 2026-08-26: (a) adoption/DX.** See Slice 147. Original text kept below.

2b. [x] **OWNER CALL — direction. REALIGNED 2026-08-24: the release blocker is
       GONE; this waits on a decision only.** It said the release "is cut as
       0.3.0 and awaits only the owner's push". **0.5.0 is published on npm** —
       checked, not assumed. The precondition was not merely met, it has been
       overtaken twice, and the recommended default below still says "ship
       0.2.0 first", which shipped long ago.

       Nothing structural blocks this any more. What remains is the choice,
       which was always an owner call: pick (a), (b), (c) or (d) below, or say
       "keep waiting for adopter feedback" and mean it as a decision rather
       than as a precondition.

       Recommended default (kept for its reasoning, though its ship-first
       clause is spent): **choose from real adopter feedback rather than from
       this room** —
       the cost being that feedback takes time, against the alternative risk of
       building the next twelve components for nobody. Candidates if the owner
       prefers to choose now: (a) adoption/DX — starter template, copy-paste
       screen kit, migration note; (b) depth on data maintenance — M2
       master-detail and M4 Excel round-trip are only partly done; (c) the
       autosave decision below, the one genuine product question already in the
       plan; (d) define 1.0 and close the gap to it.

**RETIRED — F1 (verification-to-product ratio).** The previous grill deferred it
with the trigger "revisit if the next window pushes past ~30:1". It fired:
framework CSS grew **+25 lines across 45 commits, and zero in two of three
15-commit windows**, so the denominator is zero and the ratio is meaningless.
The honest conclusion is that the **metric was wrong**, not that things are 30x
worse — zero CSS growth is the charter working, and a ratio that reads "added no
CSS" as failure would push toward adding CSS for its own sake. What it was
gesturing at is captured properly by the two owner calls above. Not to be
re-raised as a new finding.

## Slice 177 — the archive sweep is due a FOURTH time, and the regrowth rate is rising (2026-08-28)

**Not new input** — nothing was filed and nobody asked; GitHub intake is 0 open
issues and there is no open P0. Noticed the way rule 4 says it will be noticed:
this wake executed rule 4 by reading `ROADMAP.md` top-to-bottom, and the rule's
own text says *"if this rule is walking thousands of lines again, that is the
signal"*. It walked **3,750**.

Slice 165 is the direct precedent — same signal, same wake-noticed origin, same
"not new input" framing — and its sweep landed **twelve hours ago**.

**Scope, measured. The instrument is 165.1's, with the defect 165.1 found already
fixed**: attribute body lines to the nearest preceding H2 **of any kind**, not to
the nearest `## Slice`, or the four non-slice sections are charged to whichever
slice precedes them (that is how 165.1 first read Slice 29 as 78 lines when it is
a correct 3-line pointer).

```
python3 - <<'PY'
import re
H=re.compile(r"^## (.*)$"); S=re.compile(r"^## Slice (\d+)\b")
def sections(p):
    cur=None; d={}
    for l in open(p):
        m=H.match(l)
        if m:
            s=S.match(l); cur=int(s.group(1)) if s else None
            if cur is not None: d.setdefault(cur,0)
        elif cur is not None: d[cur]+=1
    return d
live=sections('ROADMAP.md'); arch=sections('ROADMAP-archive.md')
OPEN=set(); cur=None                   # DERIVED, never hardcoded — 165's own bug
for l in open('ROADMAP.md'):
    m=H.match(l)
    if m:
        s=S.match(l); cur=int(s.group(1)) if s else None
    elif cur is not None and re.match(r'^\s*\d+\. \[ \]', l): OPEN.add(cur)
print("OPEN:",sorted(OPEN))
big={s:n for s,n in live.items() if s not in OPEN and n>6}
print(len(big),"closed slices carrying",sum(big.values()),"lines here;",
      sum(1 for s in big if s in arch),"already in the archive")
PY
  # OPEN: [15, 112, 173, 175, 176]
  # 9 closed slices · 1,943 lines · 0 already archived   (2026-08-28, at 3,750 lines)
```

The nine: **164, 165, 167, 168, 169, 170, 171, 172, 174**. The four non-slice H2
sections (`## Objective`, `## CI strategy`, `## Sequence`, `## STATE`) are out of
scope for the same reason 165.1 gave.

**The finding is not the sweep — it is that the sweep is a treadmill that is
speeding up.** Found by measuring the line count at every one of the 722 commits
that has touched `ROADMAP.md` and taking the drops, rather than by grepping
subject lines. That matters: a subject-line grep for `archive sweep` finds only
**two** of the three real sweeps — the 2026-08-25 one is titled *"tidy: sweep 44
closed slices…"* — which is the position-filter shape CLAUDE.md warns about, a
confident absence.

```
# sweeps found by the DROP, not by the subject line (drop > 300 lines)
16ef2bb8  12,516 ->  5,562   08-22  110.4: archive 83 closed slices
063211cc   9,824 ->  1,094   08-25  tidy: sweep 44 closed slices
187ab92d   4,461 ->  1,508   08-28  archive sweep — 20 closed slices
c5d21fb4  12,302 -> 11,983   08-22  109.7: grill the RF pattern family   <- FALSE POSITIVE
```

**The detector's fourth hit is not a sweep**, and it is recorded rather than
quietly dropped: a 319-line net reduction inside a grill commit clears a
`>300` threshold. 3 of 4 hits are real; the threshold is a heuristic and is
labelled as one.

Regrowth between consecutive real sweeps, measured per **ROADMAP-touching
commit** rather than per hour — the log's stamps are naive local time and 164.2
recorded that 3 of 1,013 adjacent pairs read backwards, so wall-clock would be
the weaker instrument here:

| cycle starts | lines | → | over N commits | rate |
|---|---|---|---|---|
| after `16ef2bb8` | 5,562 | 9,824 | 140 | **+30.4 / commit** |
| after `063211cc` | 1,094 | 4,461 | 66 | **+51.0 / commit** |
| after `187ab92d` | 1,508 | 3,750 | 33 *(open)* | **+67.9 / commit** |

Cycle length in commits is **halving** (140 → 66 → 33) while the per-commit rate
is **rising** (+30 → +51 → +68). Both readings agree, which is what makes this
worth a line: the sweep is not converging on a steady state, and CLAUDE.md's
"recurring sweep" wording describes it accurately but understates the trend.

> **CORRECTED by 179.2 (Objective grill, 2026-08-28) — the last sentence above
> is wrong, and "both readings agree" is not corroboration.** Rate × length =
> regrowth, so the two quantities are one measurement decomposed and cannot
> disagree by construction. The third term, unreported here, moves the other
> way: regrowth per cycle **4,262 → 3,367 → 2,364** and the peak a wake actually
> walks **9,824 → 4,461 → 3,872**, both falling monotonically across the three
> now-closed cycles. On rule 4's own cost — lines walked before a sweep — the
> sweep **is** converging. The prediction in the same paragraph held: the fourth
> sweep (177.1) came 35 commits after the third. Table and commands in
> `LOOPS.md` rule 4.

**What is generating it, measured, and deliberately NOT acted on.** Of the 1,943
lines this sweep moves, **1,192 (61%) are the five Objective-grill slices**
(164, 167, 168, 170, 172) — each of which ALSO has a full report in
`.roundtable/`. Whether a grill's roadmap slice should be a summary pointing at
its report, rather than a second copy of it, is a **direction call about how the
loop records its own work**, and this loop does not take those. Recorded here as
an observation with its number so a later wake or the owner can decide it; no
item is opened for it.

1. [x] **177.1 — DONE 2026-08-28 (cloud wake). 9 slices moved; 3,872 → 1,956
       lines. Sweep the nine closed slices to `ROADMAP-archive.md`.**
       Hand-checked move, one slice at a time — **not a script**. CLAUDE.md's
       bulk-edit rule applies with force on this exact pair of files: the
       case-collision that once destroyed 7,307 lines of archived history was on
       `ROADMAP-archive.md`, and the only tell was `git status` showing it as
       *modified* rather than *added*.

       *Accept* — each is a property to verify, never a number to predict:
       - Every one of the nine closed slices has its full text in
         `ROADMAP-archive.md` and a pointer of the established shape
         (`Closed — archived verbatim in \`ROADMAP-archive.md\`.`) left in
         `ROADMAP.md`, with its heading unchanged.
       - No slice carrying an open `N. [ ]` checkbox is moved, and no non-slice
         H2 section is touched. Re-derive the OPEN set from the checkboxes; do
         not read it off the table above.
       - `check:slice-refs` passes, and its citation count is reconciled against
         the source rather than against the mover — it read **354 citations /
         198 cited / 158 slice numbers** before the move.
       - Conservation reconciles: the archive's growth equals the live file's
         loss plus the pointer stubs the move inserted, and the residual is
         accounted for exactly rather than waved at.
       - `git status` shows `ROADMAP-archive.md` as **M**, never as a new file.
       - `STATUS.md`, regenerated, still finds the same number of open items as
         a raw `grep -c` of the `N. [ ]` checkboxes in the source.
       - The before and after line counts of both files are recorded.

       **Moved, in the order they held in the live file**: 172, 174, 171, 170,
       169, 168, 167, 165, 164. The move itself was mechanical; the CHECKING was
       structural, which is what 165.1 actually did too ("verified structurally
       rather than by eye"). Stated plainly rather than implying it was
       hand-retyped.

       **Refusal guards ran BEFORE the move, not after** — the OPEN set
       re-derived from the `N. [ ]` checkboxes (`[15, 112, 173, 175, 176, 177]`,
       and it asserts the target set is disjoint from it), plus a per-target
       assertion that the section is not already a pointer and is longer than
       six lines. The second guard turned out to matter — see the archive
       defect below.

       Every Accept property verified:

       ```
       byte-identical in archive .............. 9 of 9
       pointers correct, headings unchanged ... 9 of 9
       moved ∩ open ........................... [] (empty)
       non-slice H2 sections still present .... 4 of 4
       git status ............................. M / M, never A
       pre-existing archive preserved ......... new file starts with old, exactly
       check:slice-refs ....................... passes
       ```

       **Conservation reconciles exactly, on both sides:**

       ```
       ROADMAP.md       3,872 -> 1,956   (-1,916)
       ROADMAP-archive 19,285 -> 21,237  (+1,952)
       # 1,956 is the count AT MOVE TIME. `wc -l ROADMAP.md` reads higher now,
       # because writing this result block back into the file is itself growth
       # — which is the trend this slice is about, arriving on cue.

       live:    1,943 body lines moved - 27 pointer stubs (9 x 3) = 1,916  ✓
       archive: 1,943 body lines + 9 headings                     = 1,952  ✓
       ```

       `check:slice-refs` moved **354 -> 355 citations** and **158 -> 159 slice
       numbers**, and that is reconciled rather than accepted: both +1s are
       Slice 177's own heading and its one citation of 165. Cited count held at
       198 and the known-dangling baseline held at 2.

       **A defect in the ARCHIVE was found by this item's verification, and is
       NOT fixed here.** Three slices appear twice in `ROADMAP-archive.md` —
       **17, 23 and 24** — and the second copy of each is a **3-line pointer
       stub**: an earlier sweep archived a slice that was *already* a pointer,
       so the archive now contains a stub pointing at itself, nine lines from
       the top of the same file.

       ```
       Slice 17: copies 2, lines 98 vs 3, identical=False
       Slice 23: copies 2, lines 520 vs 3, identical=False
       Slice 24: copies 2, lines 183 vs 3, identical=False
       ```

       **No history was lost** — the full text of all three is present; the
       duplicate is the stub, not the content. It is pre-existing: the archive
       held **144** slice numbers with these same three duplicated *before* this
       wake touched it, and **153** after, which is +9 and exactly this sweep's
       nine. This sweep's guard makes it structurally impossible for it to have
       added one.

       **Left alone deliberately, on the archive's own authority.** Its header
       reads *"Nothing here is edited — corrections to history go in new slices,
       never here."* Deleting nine lines from it would be small, and it is still
       an edit to the archive, which is the one operation that has already
       destroyed 7,307 lines of this exact file. Changing that charter is a
       direction call, so this is recorded with its measurement and no item is
       opened. What it costs today: any counter that reads slice numbers out of
       the archive over-reports by 3. `check:slice-refs` is not that counter —
       it asserts "each heading one section" against the LIVE file and passes.

## Slice 176 — Polish round 2 on `component/scan`: the score that was taken and never written down (2026-08-28)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 `Standardize 2 / 4 ok`, rule 3 `Objective 1 / 3 ok
[173]`. **Rule 4 found no dispatchable item**: all five `N. [ ]` checkboxes are
owner- or hardware-blocked (112.3 owner briefs, 112.4 on 112.3's verdict, 173.2
*owner to pick* between two candidates, 175.4 OWNER CALL, Slice 15's AT runtime
evidence NEEDS-RUNTIME). Rule 5 found no metric with two consecutive readings
and no budget breach (`rf-essentials` 36.4 kB against its 40 kB gate). **Rule 6
fired** — `polish_requeue.py --apply` marked ten surfaces re-queued, and the
ledger's own re-entry section named a scan re-score as pending.

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** One rendered change ships in this slice — `/components/scan`'s
"Design-system alignment" section stops saying *"Not yet scored"* and starts
rendering the six-row table every other component page already renders, from the
same `DsaScore.astro` component with no markup or CSS change. `git diff --stat`
names no file under `packages/core/src` and no `.css` anywhere. **That section's
appearance at 390px was NOT looked at**; it is the same component and the same
table markup as the 39 pages that already carry it, which is an argument, not a
verification.

1. [x] **176.1 — DONE. `/components/scan` published "Not yet scored" for five
       days after it was scored.** Polish re-entry scored `scan` on 2026-08-23
       (`bfe9798`), found `colour`/`interaction`/`fit` all at 2, and fixed all
       three in that same round. The result was written into
       `.roundtable/polish-state.md` prose **and nowhere else** —
       `dsa-scores.json`, which its own `$comment` calls the SOURCE OF TRUTH for
       what renders, never received a `scan` entry, and `DsaScore.astro`
       correctly renders *"Not yet scored — alignment scoring is proceeding in
       batches"* for a missing one.

       ```
       node -e "console.log('scan' in require('./apps/docs/src/data/dsa-scores.json').components)"
       # false  (before this slice)
       npm run check:dsa-scores -w docs
       # "39 scored components (40 requested by a page)"   <- printed, unasserted
       ```

       **The gate computed the discrepancy and reported it as prose.** Its
       assertion 5 checks that every scored entry is rendered by some page; the
       mirror — every page-requested component has an entry — was never written,
       and its own header explains why it was thought unnecessary
       (`check-page-shape` enforces that CSS-backed components carry
       `<DsaScore>`, which is a different claim). This is CLAUDE.md's rule
       exactly: *a derived artefact may not decide, on its own, what it failed to
       see. Assert the count, not just the content.*

       *Accept*: (a) `check:dsa-scores` names, per component, any page that
       renders a score with no entry behind it, and its report line states
       whether the two counts agree rather than printing both and leaving the
       reader to subtract; (b) the assertion has been watched failing, with the
       injection confirmed to have landed before the red result was believed;
       (c) `scan` carries an entry whose six citations were each re-verified
       against the shipped artifact this wake, and the entry states what kind of
       score it is rather than implying it is the blind one the ledger asked
       for; (d) the full cloud gate set is green.

       **Met.** (a) assertion 7, per name, 40 checks; the report line now ends
       `all scored` or names the offenders. (b) red-proved **twice** — first by
       the real defect, before the entry existed
       (`FAIL scan: … dsa-scores.json has no "scan" entry`), then by deleting an
       *unrelated* entry and confirming the gate names that one instead
       (`FAIL kv: …`), with `'kv' in components` asserted `false` before the run
       and `true` after restore, and `git diff --stat` confirming the restore
       was byte-exact. The second proof matters because the first could have
       been satisfied by a check hard-coded to `scan`. (c) recorded — no
       `font-size` and no raw colour in `scan.css`; the 6px-solid vs 18px-double
       verdict geometry asserted by `check:claims` in normal rendering *and*
       under CDP forced-colors emulation; the platform-vs-behavior table on the
       page; `data-scan-flash` adopted at `examples/po-app/server.mjs:1095`. The
       entry's `$comment` says outright that this is a **cited re-score, not a
       blind one**, so it is not counted as §3b's independent second opinion —
       the blind re-score is still owed and now has a baseline. (d) below.

2. [x] **176.2 — DONE 2026-08-28 (next wake), closed under Accept arm (c),
       verdict BENIGN. Raised as: "`polish_requeue.py` and `LOOPS.md` §3b's
       queue definition contradict each other, and rule 6 dispatches on the
       loser."** The contradiction is real; the second half is wrong — rule 6
       dispatches on neither, and the measurement is below. Raised while
       executing rule 6, recorded rather than resolved: both sides are
       deliberate, measured decisions three days apart, and neither names the
       other.

       - **2026-08-25** added `polish_requeue.py` precisely so a surface whose
         source moved re-enters the queue — the ledger had said so since it was
         written and nothing executed it, so `component/sidebar-nav` sat at 1/3
         rounds while its page changed twice in a day.
       - **2026-08-28 (171.1)** narrowed the component queue to
         `check:wrong-choice`'s TODO set **and only that**, because no DSA
         dimension can rank.

       Together they misfire. `--apply` re-queued **10** surfaces this wake;
       every one scores `content: 3` and is off the TODO, so the Polish round
       they trigger has no scored weakness to fix. Re-measured this wake over
       40 components: `typography`/`colour`/`spacing` have **1** distinct value
       each, `interaction` **2** (3 or `na`), `content` **2** and `fit` **2** —
       and in both of the latter the single non-3 is `date`, which the ledger
       SKIPS as deprecated. The commands are in `.roundtable/polish-state.md`.

       Resolving it either way changes what the dispatcher does on a
       clear-backlog wake — honouring the TODO makes rule 6 effectively
       unreachable and hands every such wake to Research (rule 7), which is what
       the ledger's own header used to promise; keeping the re-queue needs an
       instrument that can rank a re-entered surface, and 171.1 measured that
       none of the six exists. Both are direction, and direction has been the
       owner's in every slice so far.

       *Accept*: a recorded decision that either (a) makes `polish_requeue.py`'s
       output agree with §3b's queue definition, or (b) restores a rankable
       instrument for a re-entered surface, or (c) keeps both and states in
       `LOOPS.md` what a Polish round on a `content: 3` surface is supposed to
       do — **in each case naming the consequence for how often rule 6 fires,
       measured against the log rather than predicted.** Finding that the
       contradiction is benign is a satisfying outcome and closes this item.

       ### Met, arm (c), verdict BENIGN — and the premise was half wrong

       **Re-checking the premise was part of the criterion, and it paid.** This
       item was raised as *"rule 6 dispatches on the loser"*. Rule 6 dispatches
       on neither. Its literal text is a THIRD queue definition, wider than both
       sides, and it is the only one the dispatcher actually evaluates:

       > 6. **Any scored surface below its round budget and not marked dry?**

       Neither `polish_requeue.py`'s source-change rule nor §3b's TODO
       set appears in that predicate. `--apply` writes a `RE-QUEUED` marker into
       the ledger's `status` column; it moves neither the `rounds` column nor the
       `dry` column, which are the only two things rule 6 reads. §3b's TODO
       narrows which surface a round **picks** (step 1), not whether rule 6
       **fires**.

       **1. Rule 6's predicate has never been false, for any row, in any
       revision of the ledger.** Parsed every revision of
       `.roundtable/polish-state.md`, not the current one:

       ```
       git log --format='%H %ad' --date=short -- .roundtable/polish-state.md   # 11 revisions
       # per revision, parse the table and count rounds n/m and the dry column:
       #   11 of 11 revisions:  budget_spent = 0   marked_dry = 0
       #   below_budget = 19 (first three revisions, before `date` was SKIPPED)
       #                  18 (2026-08-23 → 2026-08-25)
       #                  19 (2026-08-28, scan added)
       ```

       So the predicate is true of **19 of 19** non-skipped surfaces today and
       has been true of every non-skipped surface since the ledger's first
       commit. A 100% base rate is a defect until proven otherwise — and here it
       is *proven otherwise*, structurally rather than as an instrument bug:
       budgets are ceilings, the dry exit needs **two consecutive** rounds that
       fail to move a blind re-score, and every seeded surface landed its clause
       in **one** round and passed. Nothing ever got a second round, so nothing
       could ever accumulate a first dry one.

       **2. The one Polish round that rule 6 has actually dispatched was
       authorised by neither side of the contradiction.** 176.1 ran on
       `component/scan`, and scan is in neither queue:

       ```
       python3 scripts/loops/polish_requeue.py --check | grep -c '^  component/'   # 10
       python3 scripts/loops/polish_requeue.py --check | grep -c 'component/scan'  #  0
       npm run check:wrong-choice -w docs
       #   "components: 37 carry / 1 outstanding / 3 exempt"
       grep -A3 'const TODO = new Set' apps/docs/scripts/check-wrong-choice.mjs
       #   TODO = { 'date' }   — and the ledger SKIPS date as deprecated
       ```

       Scan is not re-queued (no `RE-QUEUED` marker, and absent from `--check`'s
       ten) and it carries a wrong-choice clause, so it is off the TODO. It
       qualified on `2/3 rounds, dry 0` — rule 6's own text — and nothing else.

       **3. Consequence for how often rule 6 fires, measured against the log.**
       **Zero**, under either resolution. Neither side of the contradiction is
       an input to the predicate rule 6 evaluates, so changing either changes the
       firing rate by construction, not by estimate. What the log shows about the
       rate itself:

       ```
       grep -c '^- ' .roundtable/loop-log.md          # 1065 iteration rows
       grep -c ' · Polish · ' .roundtable/loop-log.md #   10  (0.94%)
       ```

       Ten rows over five wake-dates: six on 2026-08-23 (the seeded queue,
       drawn from `check:wrong-choice`'s TODO), three on 2026-08-26 (ERP-suite
       *screen* scores — a different instrument, and not in this ledger's table
       at all, which is 20 `component/` rows and no `pattern/` row), one on
       2026-08-28 (176.1). Under arm (a), honouring the TODO strictly, **2 of
       those 10 would not have been dispatched** — both `scan`, the 2026-08-23
       re-entry and 176.1 — because scan is off the TODO. One of the two is the
       round that found `/components/scan` publishing "Not yet scored" for five
       days. The rate is governed by **rule 4 emptying**, which ROADMAP records
       happening exactly once (Slice 176's own header). *(The three `rule 6`
       citations in `ROADMAP-archive.md` at Slices 66/67/68 are **not** Polish
       dispatches — they are 2026-08-20, before the Polish loop existed, when
       rule 6 was the Explore-on-empty-backlog rule. The numbering moved.)*

       **4. Arm (a)'s stated consequence — "hands every such wake to Research
       (rule 7)" — describes a lane that has never been dispatched.**

       ```
       grep -c ' · Research · ' .roundtable/loop-log.md    # 0, of 1067
       ls .roundtable/research-*.md | wc -l                # 6
       ```

       Six research reports exist and `--loop Research` has never been used, so
       the work has happened and no row carries this loop's name. Three rows
       narrate research under `Roadmap`, `Objective` and `Explore`
       (`grep -i research .roundtable/loop-log.md`). **The tempting next claim —
       "each of the six was recorded under some other loop" — is NOT made, and
       the instrument that would have made it was tried and refused**: grepping
       each report's topic out of its own filename finds rows for **2 of 6**
       (`app-frame`, `pattern-references`; `dense-numeric-ui`,
       `erp-mobile-web-gaps`, `numeric-masking` and `pattern-tile-previews` all
       read 0). That is a needle that misses rows naming a slice instead of a
       topic, not evidence that four reports went unrecorded — and a 0 on four
       of six inputs is the shape this repo's own doctrine says to distrust. So
       the alternative arm (a) was weighed against is not a lane the log can
       show working; how its work WAS recorded is left unmeasured.

       **What a Polish round on a `content: 3` surface is supposed to do** —
       arm (c)'s question, answered in `LOOPS.md` §3b this wake. Short form: it
       has no scored weakness to fix, because 171.1 measured that no DSA
       dimension can rank one. What it *can* do is reconcile the surface's
       **published artefact** against the ledger's own record of it — which is
       what 176.1 did, and what found the five-day defect no scored dimension
       could see. Stated as **n = 1**, because that is the entire evidence base.
       If the reconciliation finds nothing, the round is a genuine no-op and is
       recorded as one; it does not manufacture a fix.

       **Not resolved here, and deliberately: the contradiction is benign, but
       §3b's Exit is not.** See 176.3.

3. [x] **176.3 — OWNER CALL. §3b's Exit condition has never been satisfiable,
       so rule 7 is unreachable and rule 8 cannot be reached either.**
       **CLOSED 2026-08-29 — no change. The owner challenged whether the item
       was needed at all ("does it sound logical? do we really need it?") and
       the measurement says it is not.** Three reasons, in the order that
       matters:

       - **Its premise contradicts a decision the owner had already made.** The
         item treats an unreachable halt as a defect. But on 2026-08-28 the
         owner was asked directly whether to pause the hourly routine while the
         direction is blocked and chose **keep it running hourly**; `RESUME.md`
         records that as *"an accepted state, not a fault"*. A loop that cannot
         halt is doing what was asked.
       - **The claimed cost does not exist.** Rule 6 has produced **12 Polish
         rounds in 1092 iterations (1.1%)**. And the rounds this item's framing
         called redundant — second rounds on surfaces already at `3/3` — went
         **2 of 3 finding real defects**: 176.1's round-1 score had never been
         written to `dsa-scores.json` at all, and `skeleton · colour` cited a
         token pairing deleted three days earlier and published verbatim on
         `/components/state-patterns`. The always-true predicate is not
         manufacturing busywork; it is the only thing re-reading finished work.
       - **Halt's actual job is already done by something that works.** The
         function rule 8 was meant to serve — tell the owner what is blocked —
         is served by `RESUME.md`'s Direction block (168.1), which is how the
         owner received the six-item blocking set on 2026-08-29. Rules 7 and 8
         are dead code that nothing depends on.

       **The assistant's own recommendation was wrong and is retracted.** It
       proposed narrowing rule 6 to fire only for re-queued surfaces or known
       weaknesses. That would have **deleted the lane that caught both
       defects** above, to solve a problem the owner does not have. Recorded
       because the reasoning was plausible and still wrong: *"rounds remaining
       is not work remaining"* sounds like a tightening, and measurement showed
       the loose predicate was earning its keep.

       **Not to be re-raised.** The three options below were weighed and all
       three are now moot; re-open only if the owner asks the loop to halt when
       the backlog is owner-blocked, which is the decision that would change
       the premise.

       *(original finding, kept — the mechanism description is still accurate)*

       §3b's Exit reads *"every surface dry or budget-spent → hands to Research
       (rule 7)"*. 176.2 measured that across **11 of 11** revisions of
       `.roundtable/polish-state.md`, `budget_spent = 0` and `marked_dry = 0`
       — every row, every revision. Both halves of that disjunction have always
       been false, so Polish has no exit, and the log agrees: **0 Research rows
       in 1065**. Rule 8's halt sits below rule 7 and is equally unreachable.

       This is not a broken instrument. It is the ceiling/dry design working as
       specified: a surface that lands its fix in one round never gets a second,
       so it can never accumulate the two consecutive non-moving rounds the dry
       exit requires. The exit was written for a queue whose surfaces need
       several rounds; the seeded queue did not behave that way.

       Weighed and NOT taken, because each is a direction call:
       - Make a single-round pass that lands its fix also mark the surface
         budget-spent — closes the exit, but redefines "ceiling" as "quota",
         which §3b's own header refuses in bold.
       - Let rule 6 fall through when §3b's TODO is empty — the smallest change,
         and it is what the ledger's header used to promise, but it makes rule 6
         effectively dead and every clear-backlog wake a Research wake, which
         finding 4 above shows is a lane with no track record.
       - Leave it. Costs nothing while rule 4 keeps matching; the price is paid
         only on a clear-backlog wake, of which there has been one.

       *Accept*: a recorded owner decision naming which of the three (or a
       fourth) is taken, **with the consequence measured against the ledger and
       the log rather than predicted** — specifically, how many of the 19 rows
       the choice would move out of rule 6's predicate, and how many recorded
       wakes would have dispatched differently. "Leave it" is a satisfying
       outcome and closes this item.
## Slice 181 — Owner: a PO-list screenshot, grilled for framework gaps (2026-08-29)

The owner showed a composed screenshot of a Purchase-orders screen — app shell,
filter chips + saved view, bulk-action band, data table with status column,
pagination, and a status timeline below — annotated with `.bo-app-shell`,
`.bo-filter-bar`, `.bo-data-table`, `.bo-timeline`. The ask was explicitly
**"don't just take it"**: extract what belongs in the FRAMEWORK, not what is
wrong with the picture.

**Outcome: refused in full. Nothing survived.** Six critiques were raised, three
were promoted as candidates, and every one died to shipped source. Recorded at
length because the failure mode is worth keeping: **a screenshot is a claim
about the framework, and reading it as evidence of a gap skips the step where
you check whether the framework already answers it.** Five of the six critiques
were the mockup diverging from `/patterns/list-report`, which already does the
thing correctly.

| critique from the image | verdict |
|---|---|
| collapsed rail truncates to `Purch.`/`Inv.`/`Fin.` | **refuted** — icon-only collapse ships, `sidebar-nav.css:82` |
| timeline's pending node shows `3`, not a state | **refuted, and backwards** — `stepper.css:160`: done (✓ glyph) vs pending (number) is chosen so the distinction *survives forced colors*. The number IS the two-channel cue. |
| `Net` column lacks currency | **refuted** — `list-report.astro:116` puts `bo-amount` + `__currency` inside `bo-data-table__col--numeric` |
| mixed currencies unhandled | **refuted** — `editable-grid.astro:611` renders `"mixed"` for divergent row currencies, and adds the FX-to-document-currency and JPY-precision notes |
| no totals row | **refuted** — `tfoot` totals, `data-table.css:347` |
| pagination cannot reach the last page | **refuted** — ellipsis ships, `pagination.astro:51` |

The three promoted candidates and how they died:

1. **"Status badges and timeline nodes should be one controlled vocabulary."**
   **Refuted by counterexample, and the rule was wrong.** Measured on the
   shipped pages with the components-used footer excluded:
   ```
   object-page   statuses {Partial, Pending approval}  steps {Budget check passed,
                 Goods receipt, Vendor invoice}          -> zero overlap, correctly
   record-detail statuses {Approved, Modified, Partial}  steps {Requested, Approved,
                 Receiving, Invoiced}                    -> Approved in both, same meaning
   ```
   `Partial` and `Modified` are legitimate statuses that must **not** be
   workflow stages — status and workflow position are genuinely different axes.
   The proposed rule would have forced a wrong model onto five shipped pages.
   The framework already distinguishes them and already reuses a word only
   where it means the same thing.

2. **"Enum VALUES need a truncation rule, since headers have one."**
   **Refuted — the guidance exists and is stronger than the proposal.**
   `badge.astro:56,62` already states *"The tone word IS the text"* and that
   the two-channel rule means the word must be present regardless of colour.
   Abbreviating `Approved`→`Appr.` violates documented guidance rather than
   revealing its absence. Base rate of in-tree violation:
   ```
   grep -rhoE '>(?:[A-Z][a-z]{1,6})\.<' --include='*.astro' apps/docs/src examples
   # only >Saved.< (a sentence period in a toast) — zero abbreviated statuses
   ```
   Writing it again would be a second section restating a neighbouring idea,
   which is exactly what 158.2 has open.

3. **"The bulk-action bar prescribes the count but not the actions."**
   **Refuted** — `list-report.astro:89` ships
   `.bo-data-table__bulk-actions` with `role="group"`,
   `aria-label="Bulk actions"`, and both actions as real
   `bo-btn--secondary` / `bo-btn--danger`; documented at line 205. The image's
   chip-vs-link split is the mockup, not an unprescribed surface.

**Not filed as a gate, and not filed as prose.** There is no repo-side artefact
to check: `find` for hero/mockup/og-image assets returns nothing and `README.md`
carries no image, so the screenshot is external and ungateable. Inventing a gate
for an asset that does not exist in the tree is the 94.11 ceremony this file
keeps refusing.

**The one thing worth carrying forward**, stated as guidance rather than an
item: every divergence ran in the same direction — the composed image makes the
framework look **less** capable than it is, on six independent points. If a
marketing or README hero is ever built, derive it from `/patterns/list-report`,
which already ships all six correctly. Filed here so the next wake finds the
measurement instead of re-deriving it from the picture.

**Recorded because the grill's own instrument failed first**, which is the base
rate confirming itself again: the vocabulary measurement's first run counted the
pattern pages' **"Components used" footer badges** (`Amount`, `Badge`, `Kv`,
`Pagination`, `Timeline`) as status values — the identical trap 39.2 recorded
("counted Related-footer badges as results"). It reported "11 badge values, none
appearing as a step", which would have made candidate 1 look strongly supported.
Excluding the footer inverted the finding into the refutation above.

## Slice 175 — Objective grill of Slices 169, 170, 172 (2026-08-28)

Dispatcher rule 3 at 3/3 `[169, 170, 172]`; rule 1 found no open P0 and GitHub
intake is empty (0 open issues, asked via the API), rule 2 read
`Standardize 3 / 4 ok`. Full report:
`.roundtable/grill-objective-169-170-172-2026-08-28.md`. `.roundtable/INDEX.md`
checked first: the immediately preceding grill names 169 and 170, and this is not
a repeated subject — it covered 169.1-169.3 and 170.2's *proposal*, while 169.4
and 170.2's verdict both landed after it (169.4 at 12:26Z against that grill's
11:45Z).

**Cloud wake: no Podman, no `localhost:8081`, no screenshots at 1440px/390px in
light and dark.** Nothing in this slice renders — two gate scripts in
`apps/docs/scripts`, the grill file, this entry, one renumbered heading,
`LOOPS.md` and `.roundtable/RESUME.md`. `git diff --stat` names no file under
`packages/core/src` or `apps/docs/src`, which is a stronger statement than a
screenshot. `check:layout` and `test:axe` swept every page at both widths anyway
and were green. **No visual debt was added; nothing visual was looked at.**

Window shape: 10 rows · landed 4 · refused 5 · triaged 1; loops Meta 4 /
Continue 4 / Standardize 1 / Roadmap ×1. Reconciled before quoting: 1,047 raw
bullets, 1,047 parsed by `dispatch_status.rows()`, 1,047 by the independent
outcome parser — whose first draft was wrong on 356 rows anyway (report §D).

**THIS GRILL COLLIDED WITH A SECOND ONE, AND BOTH ARE KEPT.** `LOOPS.md` Step 0c
exercised for real, second recorded time. A local wake was live throughout —
`5f21113` landed at 13:32Z, five minutes before Step 0, with no iteration row —
and by the pre-commit re-fetch Step 0c mandates, `origin/main` had moved four
commits including **its own Objective grill of the same 169/170/172 window**
(`0131ebc5`, recorded 13:36Z). Nothing here duplicates it: its findings are the
green-red-proof rule, the self-declared `@exact` exemption, and what went right;
none of the three below appears in it, checked by reading it rather than by
title. Rebased rather than discarded, and **every figure re-verified on the
rebased tree** — the other wake changed `dispatch_status.py` and
`check-ci-ignores.mjs` between the measurement and the commit. The §A red-proof
still reproduces 3 → 4; `sorted({` is still line 247. What moved: the log is
1,052 rows, refusal 208 of 590 (35.25%), and `dispatch_status.py` now reads
`Objective 1 / 3 [170]` because the other grill discharged the counter mid-wake.
The window figures above are the state this grill examined, tip named, not
silently refreshed.

1. [x] **175.1 — DONE 2026-08-28. `## Slice 172` headed two different slices,
       and it is the first such collision in 710 revisions of `ROADMAP.md`.**

       `## Slice 172 — Objective grill of Slices 168, 169, 170` (`c88a3217`,
       11:44Z) and `## Slice 172 — Owner: /patterns/command-bar` (`be5beb9a`,
       13:02Z). So `172.1` named both *"check-resume-charter retagged
       @heuristic"* and *"the copyable CSS shipped `overflow: hidden`"*, with one
       loop-log row for each, both spelled `172.1`.

       ```
       python3 - <<'PY'
       import re, collections
       seq=[m.group(1) for l in open('ROADMAP.md') if (m:=re.match(r'^## Slice (\d+)\b', l))]
       c=collections.Counter(seq)
       print(len(seq),'headings ·',len(c),'distinct ·',{k:v for k,v in c.items() if v>1})
       PY
       # before: 156 headings · 155 distinct · {'172': 2}
       # after : 156 headings · 156 distinct · {}
       ```

       **Three instruments were wrong, and the third is the one that matters.**
       `check:slice-refs` asks whether a citation resolves, never whether it
       resolves uniquely, so it passed on both. The self-arm script the last two
       grills used keys slices by their first heading, so the *owner bug report*
       inherited `objective grill` and was excluded from the "would this have
       crossed without a grill?" set — biasing that instrument toward the very
       self-reference it was measuring (1 of 3 as reported; 2 of 4 honestly, same
       verdict). And `dispatch_status.py` collapses the arming set with
       `sorted({...})`, so a collision subtracts exactly one slice — red-proved on
       a probe copy of the log with the colliding row rewritten, injection
       confirmed as exactly one differing line:

       ```
       as committed (collision) : ['169','170','172']         -> 3
       collision resolved       : ['169','170','172','174']   -> 4
       ```

       Rule 3's threshold is three, so a collision flips `OVERDUE` to `ok`
       whenever the true count is exactly three — the silent-starvation shape
       `LOOPS.md` rule 3 records five recurrences of, through a door none of
       those five used. It did not fire this wake only because 4 > 3.

       *Accept*: no slice number heads two sections, and something says so when
       one does. **Done both ways.** The later-filed slice is renumbered **174**
       (first claim wins) with the renumber recorded in it; `check:slice-refs`
       gains a uniqueness assertion, red-proved by re-introducing the collision
       with the injection confirmed (`## Slice 172` heads 2 sections → gate
       exits 1 naming it). Base rate **3 of 710 revisions**, so the predicate
       distinguishes rather than decorating (94.11). Scoped to `ROADMAP.md`
       alone, which is sufficient because every archived slice leaves a pointer
       stub there — checked, not assumed: **144 stubs, 144 real archived
       sections, set-equal**.

       **The residue is permanent and is the smaller wrong.** The two
       command-bar rows keep saying `172.1/172.2`, because
       `record_iteration.py`'s standing rule leaves historical rows alone, so
       `dispatch_status.py` will attribute that work to 172 forever. The
       renumber fixes the plan, not the log.

2. [x] **175.2 — DONE 2026-08-28. `check-resume-charter`'s pointer assertion
       could never detect the pointer's removal, and had over-claimed its own
       red-proof since its first commit.**

       It read `resume.includes('ENVIRONMENT.md')` while its failure text says
       *"Restore the blockquote under the title"*. `RESUME.md` names the file
       three times — once in the ⚠ blockquote Step 0 depends on, twice in
       ordinary prose — so deleting the blockquote leaves two. Injection
       confirmed by counting blockquote lines before each run:

       ```
                                              mentions  blockquote  exit
       baseline (as committed)                    3         1         0
       pointer BLOCKQUOTE deleted                 2         0         0   <- defect
       every mention of the filename removed      0         0         1
       ```

       **Not rot — over-claimed from the start.** Every revision of `RESUME.md`
       since 169.3 carries 3-5 mentions and exactly **one** blockquote, so there
       has never been a revision on which deleting the pointer left zero
       mentions. What the header recorded as *"deleting the pointer line goes
       red"* was really *"deleting all three"*.

       ```
       for sha in $(git log --format=%H -- .roundtable/RESUME.md); do
         echo "$(git show $sha:.roundtable/RESUME.md | grep -c 'ENVIRONMENT\.md') \
               $(git show $sha:.roundtable/RESUME.md | grep -c '^>.*ENVIRONMENT\.md')"
       done
       ```

       CLAUDE.md's *"verifying a removal: assert on structure, never on raw
       text"*, landing on the gate whose whole job is to enforce a removal —
       and the third instance in this gate family inside 24 hours (172.1's fence
       fail-open, 172.1b's `src.includes('@exact')`, this).

       *Accept*: the assertion distinguishes the pointer from a prose mention,
       and the `--self-test` the `@heuristic` tag owes carries that pair.
       **Done.** `pointsAtEnvironment` matches a blockquote line naming the
       file, fences skipped for the reason `headingsIn` skips them. Red-proved
       with the injection confirmed off disk (blockquote 1 → 0, exit 0 → 1), and
       three self-test cases added: a blockquote pointer holds, a prose mention
       does not, a `>` inside a fence does not. Stubbing `pointsAtEnvironment`
       to `true` flips exactly those and exits 1. **Counter-evidence recorded**:
       the new assertion is recognition, not membership — it does not become
       `@exact` by being better.

3. [x] **175.3 — DONE 2026-08-28. That same gate can no longer fail anything,
       and two documents claimed the opposite.**

       169.4 removed `check-resume-charter.mjs` from `check:repo` — the only
       chain that ran it — and re-homed it in `record_iteration.py`, which
       discards its exit code by design (*"it must not fail the recording"*).

       ```
       git show 33fb89e7 -- apps/docs/package.json
       grep -rn 'resume-charter' --include=*.json --include=*.yml . | grep -v node_modules
       ```

       **The move is right and the demotion is defensible**: `.roundtable/**` is
       CI-ignored, so a CI gate reading it was the contradiction 169.4 correctly
       named, and the check still runs automatically every wake, which keeps it
       clear of `LOOPS.md`'s "a gate that needs a human to start something is not
       a gate". What was wrong is that `LOOPS.md` said it *"holds both ends"* and
       `RESUME.md` said it *"fails the build"* — the second flatly false.

       **The sequencing is the finding.** Hardened at **11:42:09Z** (`18791d5`,
       172.1) and demoted at **12:26:17Z** (`33fb89e`, 169.4): **44 minutes, two
       consecutive wakes, neither naming the other.** Nothing in the loop
       connects "a gate was just hardened" to "a gate just left the build".

       *Accept*: the two documents state what is true of the gate's force, and
       either a mechanism is built or the refusal is recorded with its reason.
       **Done — recorded as a refusal.** A gate asserting which scripts
       `check:repo` runs would assert a preference, not a fact, and
       `check:ci-ignores` already derives the CI-run set, so a second derivation
       over the same data to enforce a taste is 94.11's ceremony. The gate's
       force is left advisory: reversing 169.4's call 44 minutes after it was
       made, from a grill, without the owner, is the scope creep the Objective
       refuses. **What would reopen it:** a charter violation that actually lands
       and survives a wake, which is now visible because `LOOPS.md` says where
       the check reports.

4. [x] **175.4 — OWNER CALL. Step 0c's own reopen condition fired, so "accept
       collisions" is due a re-decision.** **DECIDED by the owner 2026-08-29:
       "ok" — accept collisions STANDS.** No change to Step 0c's policy; the
       `git fetch origin main` before the first commit remains the working half
       and stays mandatory.

       **Confirmed by use on the same day the decision was made.** Two further
       collisions occurred in the 2026-08-29 local session, and the accepted
       design handled both: the first rebased with conflicts in `loop-log.md`
       and `STATUS.md` (resolved by keeping both sides and regenerating the
       mirrors), the second surfaced a **slice-number collision** — the cloud
       had already taken 176, and 177/178 as well — which `check:slice-refs`'
       uniqueness assertion (added by 172.1) caught rather than letting `main`
       go red. The loser renumbered to the next free number, 181. That is the
       policy working as specified: collisions are noisy and visible, not
       silent.

       **Filed for the next re-decision, not raised now**: picking the next
       slice number by reading `max(## Slice N) + 1` collides whenever two
       wakes are open at once, and it did so twice in one session. A wake
       should compute it *after* the mandated fetch, which this one eventually
       did. Left as an observation because the owner has just accepted the
       collision policy, and this is a cost that policy knowingly buys.

       *(original finding, kept)*

       Step 0c accepts collisions on this argument: *"the loser's rebase
       conflicts, so it cannot land silently on top of work it never read"* —
       and names its own trigger: *"a collision that LANDS rather than being
       rejected — two wakes whose only overlap was the append point of
       `loop-log.md` and whose rebase resolved cleanly."*

       **On this wake's collision the rebase resolved with no conflict at all**,
       and both guaranteed collision points failed for different reasons.
       **Stated exactly: the trigger's wording is narrower than what happened.**
       It anticipated a collision whose *only* overlap was `loop-log.md`'s append
       point; this one overlapped on `ROADMAP.md` and `LOOPS.md` and still merged
       clean, while `loop-log.md` was not in the loser's diff at all. Not the
       literal condition — the same failure through a wider door, and the safety
       claim the condition protects is the one that broke.

       ```
       git diff --name-only 5f211132 7cc6e73b   # other wake: 9 files
       git diff --name-only 7cc6e73b 6c2ce5e0   # this wake:  4 files
       comm -12 …                               # overlap: LOOPS.md, ROADMAP.md
       ```

       - `loop-log.md` was **not in the loser's diff**. `record_iteration.py`
         runs after the commit, once per wake, so for nearly all of a wake the
         append point is untouched. The guarantee holds only for a wake that has
         already recorded when the other pushes.
       - `ROADMAP.md` was in both and **merged cleanly**: two wakes ticking
         boxes in different slices produce disjoint hunks — 170.3 against a
         heading renumber and a new slice ~400 lines away.

       What caught it was the `git fetch origin main` before the first commit,
       which the same section mandates and which is the working half.

       **The other arm of the experiment ran by accident, in the same wake.** The
       other dispatcher pushed again, and this wake rebased a second time —
       *after* `record_iteration.py` had appended its rows. That rebase
       **conflicted**, on `loop-log.md` and `STATUS.md`, exactly as Step 0c
       promises. One variable differs:

       | rebase | log row appended yet? | result |
       |---|---|---|
       | first | no | **clean** |
       | second | yes | **conflict** |

       So the guarantee is real and its WINDOW is the tail of a wake, not the
       wake. Resolved as Step 0c instructs — both row sets kept, never one
       dropped — then the mirrors regenerated rather than hand-merged; parser and
       raw agree at 1,058.

       Severity
       is bounded and stated: nothing was lost, the two grills share no finding,
       and the cost was one re-verification pass — Step 0c's own argument for
       redundant coverage paid for itself.

       *Accept*: a recorded decision that either (a) keeps "accept collisions"
       with the safety argument restated to match what is actually true — naming
       the pre-commit fetch as the only mechanism — or (b) picks a different
       scheme, with its cost measured rather than asserted. Either way `LOOPS.md`
       Step 0c stops carrying an argument its own trigger has falsified. **Do not
       resolve this by making the loser record earlier**: that would create a
       conflict on purpose to preserve a guarantee, and it trades a clean rebase
       for a hand-resolved one every time two wakes overlap.

## Slice 173 — Owner: two demos that do not demonstrate (2026-08-28)

**Owner:** *"/concepts/scale — Windowed list — the scanning exception"* and
*"/patterns/editable-grid — Medium — combobox lookup cells, validation,
add/remove lines — requires alignment"* (with a screenshot).

1. [x] **173.1 — the windowed-list demo puts 2000px of blank between the header
       and its only content.** LANDED 2026-08-28. Premise re-measured first and
       it reproduced exactly (`c0 2000/0 · c1 160/4 · c2 2000/0`, table 4200px).
       Spacers are now **120px and say so in the copied markup**; the table is
       **440px** and all three chunks sit in one view at 1440×900 **and**
       390×844, light and dark. Red-proved: injecting `2000px` back into the
       built page (4 occurrences — 2 preview, 2 copyable, confirmed by count
       before believing it) turns `allChunksInView` false at both widths.

       **A second defect was found in the same block, and it is the worse
       one.** The copied comment said the spacer height was
       `rowCount * --bo-density-row-height, computed at eviction time — never
       measured`, and the caption said `never measured via
       getBoundingClientRect`. Both document a design that was **tried and
       reverted**: `chunkRowHeightPx()` measures one real row once at bind and
       caches it, precisely because token-derived spacers ran ~250px short per
       100-row chunk and the list jumped while scrolling. The token is only the
       fallback. Page now states the real mechanism and why the token version
       was abandoned.

       *Original measurement, kept:*

       ```
       c0  evicted spacer   2000px   0 data rows
       c1  loaded chunk      160px   4 data rows   <- the entire point
       c2  evicted spacer   2000px   0 data rows
       table 4200px · first data row sits 2000px below the header
       ```

       The markup is structurally right — it faithfully shows evicted spacers
       either side of a loaded chunk, which is the bidirectional-windowing
       shape the prose describes. It is the DEMO that fails: a reader lands on
       the section, sees a header, then two screens of nothing, and the four
       rows the page's own comment calls *"what a reader is looking at"* are
       off-screen. A demo of a performance mechanism that cannot be seen
       teaches nothing, on the page whose thesis is "measured, not guessed".
       *Accept*: the spacer/rows/spacer shape is visible **in one view** —
       either a bounded scroll container on the demo, or illustrative spacer
       heights with the real formula kept in the prose. `Demo` renders preview
       and copyable code from ONE string, so whatever is chosen is also what a
       reader pastes: if the heights become illustrative, the markup must say
       so where it is copied, or this trades a readability bug for a 154.2.
       Verified by measuring the first data row's offset from the header, not
       by looking.

2. [x] **173.2 — editable-grid "Medium": the numeric columns need alignment.**
       **LANDED 2026-08-29, option (b).** Measured before/after on the live
       page: error row **75px → 53px**, identical to a row with no error, and
       the two untouched inputs beside it no longer shift. Red-proved as the
       criterion required — injecting the flow-message back (assert the
       computed style changed first) grows the row 53 → 75px again.

       **The criterion's own premise was FALSE and re-checking it was the
       finding.** It said the fact is "carried WITHOUT focus by the row tint
       plus its 3px inset leading edge, both already shipping". Those ship in
       the framework, but the demo row was `<tr data-row-id="LINE-1">` with
       **no `data-row-state`** — so hiding the message would have left the
       error signalled by a red input border alone. Colour only, no non-colour
       channel: a two-channel regression. The row now carries
       `data-row-state="error"`, whose leading edge `data-table.css` documents
       as "the ONE non-color channel this state has", with a forced-colors
       fallback already in place.

       **The clip the grill predicted DID happen, and measurement placed it.**
       Out of flow, the message was cut off 37px past
       `.bo-data-table-container`'s edge. Cloning rows beneath it showed 122px
       of room to spare — so it is the LAST-ROW case, not a general one, and
       the page hits it because its only error demo is a **single-row** table.
       Resolved by reserving room only while a message is shown
       (`:has(.bo-form-field:focus-within …)`): padding sits after the table,
       so no row moves. A top-layer `popover` would also escape the clip and
       was refused — this demo already has five popovers on its combobox
       cells, and an error sharing an anchor with an open listbox is worse
       than a container that grows while focused.

       Documented with the implementation: the States row now describes the
       focus behaviour and names the cost, and the "Try it" prose said the
       cell "starts invalid" when a reader would now see no message until
       focusing. Gates: axe 127×2, layout, scroll, claims (141), repo, 146
       behavior tests. Verified at 1440 and 390, light and dark.

       *(original item, kept)*
       Measured: headers and cells agree at the box level (`Qty` and
       `Unit price` are both `text-align: end`, inputs inset by the 16px cell
       padding — 807/791 and 1087/1071). What the screenshot shows is that the
       **qty input is ~247px wide for a 3-digit value**, so the number, its
       header and its error message sit far apart across an empty gutter, and
       "Exceeds on-hand (200)" hangs under the middle of a wide box.
       **ANSWERED by the owner, and measured exactly.** The complaint is that
       *showing the error misaligns the fields*:

       ```
       without error   row 53px   inputs at 407 / 407 / 407
       with error      row 75px   inputs at 418 / 407 / 418   <- 11px shift
       ```

       The erroring field stays put and its SIBLINGS drop 11px: the qty cell
       grew (input + `.bo-form-field__message` stacked) so every other cell
       re-centres in a taller row. `.bo-form-field__message` is `display:
       block` revealed by `:has([aria-invalid="true"])` — correct in a form,
       where a field owns a column of vertical space; wrong in a grid row whose
       height is a density token (`2.5rem`) and whose numeric column alignment
       is the thing `--numeric` + tabular-nums exists to protect.

       **The principle the fix must satisfy: the message may not contribute to
       the row's height.**

       **Owner proposed a floating box below the field. Grilled 2026-08-28 —
       right mechanism, wrong lifetime.** It does fix the cause (out of flow =
       no height change), and three failure modes were measured rather than
       argued:

       - **A plain absolutely-positioned box is clipped.**
         `.bo-data-table-container` is `overflow: auto` with `container-type:
         inline-size`, which both establishes a containing block and clips —
         so a box on the last visible row is cut off. Escaping needs a real
         top-layer `popover`.
       - **Which collides with what is already there.** This same demo has
         **5 popovers** (the combobox lookup cells), so an error popover shares
         an anchor with a listbox — the failure `/patterns/command-bar`
         documents a section about.
       - **It occludes the next row, permanently.** The message adds **22px**
         (75-53) against a **40px** comfortable row: ~55% of the line beneath.
         Native validation bubbles get away with this because they are
         TRANSIENT; this pattern's contract is *"422 → that row re-rendered
         with cell errors"*, which is persistent and can hit several rows at
         once.

       **OWNER PICKED (b), 2026-08-29.** The message floats on FOCUS only. What
       this commits the pattern to, stated before building so the cost is not
       discovered later:

       - **The row keeps its 53px** — the message never contributes to row
         height, which is the principle this item exists to satisfy.
       - **The fact is carried WITHOUT focus, on two channels already shipping**:
         the row tint plus its 3px inset leading edge (157.2 settled that the
         edge means "this row is in a state"). A sighted user scanning sees
         WHICH cell is wrong.
       - **The reason needs focus.** `aria-describedby` already carries it to a
         screen reader continuously; the visible message appears in the field
         you click into to fix. This is the accepted cost, restated from the
         option text rather than softened.
       - **The States contract changes.** The documented row currently reads
         "the message inside that cell's form field"; it becomes "on focus".
         `check:claims` has a case for this pattern's runtime behaviour, so the
         claim must move with the implementation or the gate is asserting the
         old contract.

       *Accept*: with an error present and nothing focused, the row measures the
       same height as with no error (the 53px/75px gap closes to zero) **and**
       the erroring cell is still identifiable — assert the tint/edge, not the
       message. On focus, the message is visible and reachable. Red-prove by
       reverting to the flow-message and confirming the height assertion fails.

       **Two candidates remained, both keeping the row at 53px** — owner picked
       (b):
       - **(a) Row-level error row** — a `<tr>` beneath the data row. Shows
         every reason at once without interaction, scales to several errors per
         line, no occlusion. Costs a row.
       - **(b) Message floats on FOCUS only.** Splits fact from reason: the row
         tint **plus its 3px inset leading edge** (both already shipping, and
         157.2 settled that the edge means "this row is in a state") carry the
         fact on two channels; `aria-describedby` already carries the reason to
         a screen reader; the visible message appears in the field you have
         clicked into to fix. Cost, stated: a sighted user scanning sees WHICH
         cell is wrong but must focus it to read WHY.

       Either changes the pattern's documented States contract ("the message
       inside that cell's form field"), so it is a design decision, not a tidy.

3. [x] **173.3 — `initWindowedList` is a shipped behavior with ZERO tests.**
       Found while fixing 173.1, queued rather than folded into it.
       ```
       grep -rl "initWindowedList\|data-windowed\|data-chunk-id" packages/core/tests/
       # (no matches — 2026-08-28)
       ```
       It is exported from `index.ts` and carries an entry in
       `behaviors.json`, so it is public surface. **Its spacer-height
       mechanism has already shipped wrong once** — token-derived heights ran
       ~250px short per 100-row chunk, a scroll jump found by red-proof rather
       than by a test — and nothing executable holds it today. That is also
       why 173.1 found the docs describing the reverted design: no test, no
       pressure to keep the prose true.
       *Accept*: the spacer height a real eviction produces equals
       `rowCount × the measured row height` (**not** the density token), plus
       the two claims the page now makes — measured once at bind and cached,
       and selection surviving eviction via the out-of-DOM Set. If jsdom
       cannot give real row heights, say so and put the height case in a
       browser gate instead of writing a test that asserts the fallback and
       calls it covered — that would re-create the exact bug.

       **DONE 2026-08-28 (cloud wake). 9 tests in
       `packages/core/tests/windowed-list.test.ts`, and the Accept's premise
       about the prose turned out to be FALSE — which is the finding.**

       *jsdom cannot give real row heights*, as the Accept anticipated: every
       `getBoundingClientRect` is 0×0, so a test written against real geometry
       would have measured the 40px token fallback and called the measured path
       covered. Instead rows carry a stubbed **32.5px**, deliberately unequal to
       the token, so every height assertion discriminates: the headline case
       asserts `2 × 32.5 = 65` **and** `!== 2 × 40`. The one property a stub
       cannot establish — that real rows genuinely render taller than the token
       — was already held in a real browser and is **not** newly written here:
       `check-po-app.mjs`'s `spacerMatchesReal` compares a 100-row spacer to a
       measured row on `/movements`, with a ±1-row tolerance that a 250px
       token-derived shortfall breaks.

       **The premise "measured once at bind and cached" is wrong, measured.**
       Counting rect reads on `tr[data-row-id]`:

       ```
       atBind: 0 · afterFirstEviction: 1
       ```

       Nothing in `bindTable` reads geometry; `chunkRowHeightPx` is called from
       `makeSpacer`, i.e. lazily at the FIRST eviction — which is on the scroll
       path the mechanism exists to keep cheap. The intent (one read per table,
       never per eviction) holds; the wording never did. **Two documents said
       it**: `windowed-list.ts`'s own header comment ("one read at bind") and
       the caption 173.1 had just landed on `/concepts/scale` ("once, when the
       table binds"). Both corrected in this commit, and the count is now
       pinned by a test rather than by prose.

       **Red-proved, five injections, each verified in the BUILT
       `dist/js/behaviors/windowed-list.js` by grep before believing the
       result** (CLAUDE.md: a green red-proof is a defect in the injection
       until proven otherwise):

       | injected regression | tests red |
       |---|---|
       | token-derived height (the reverted design) | 3 |
       | `rowHeights` cache removed | 1 |
       | `data-chunk-size` dropped from the spacer | 1 |
       | `data-bo-reloading` re-request guard removed | 1 |
       | `applySavedSelection` call removed from the swap reconcile | 1 |

       Also covered: `aria-rowcount`/`aria-rowindex` from the offset, the
       documented no-op floor where `IntersectionObserver` is absent, and the
       token fallback asserted **as** the fallback (a chunk with no
       `data-row-id` row at all), never as the measured path.

**Recorded because it nearly became a false P0.** The first measurement of
173.1 used `querySelector('#windowed-list tbody')` — **singular** — and this
demo has THREE `<tbody>` elements. It returned the first, the evicted spacer,
and reported *"zero data rows at every scroll position"*: a demo rendering
nothing at all. That was written up as a serious defect before
`querySelectorAll` showed four real rows sitting 2000px down. The real finding
is worse for the reader and much less dramatic than the false one.

**And the fix's own first measurement was wrong the other way** (2026-08-28).
After the spacers shrank, the check still reported
`firstRowInFirstViewport: false` — because it tested `rect.top < innerHeight`
without scrolling to the section, so it was measuring *where the section sits
on the page*, not whether the shape fits a viewport. The table had already
gone 4200px → 440px. Same lesson as the sidebar label that could never
overflow its own box: **measure the box that carries the constraint** — here,
the table against the viewport, after `scrollIntoView`.

## Slice 172 — Objective grill of Slices 168, 169, 170 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 174 — Owner: /patterns/command-bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 171 — Owner wishlist: score layout / usability / performance, then recommend (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 170 — Objective grill of Slices 164, 167, 169 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 169 — Standardize sweep: the correction landed in the file that is rewritten every wake (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 168 — Objective grill of Slices 163, 164, 165 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 167 — Objective grill of Slices 161, 162, 166 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 166 — Standardize sweep: a fourth copy of the alias whose home says there is one (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 165 — the archive sweep is due again, and rule 4 is the thing paying for it (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 164 — Objective grill of Slices 158, 159, 160 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 163 — noticed while shipping 159.1: the bucket nobody adjudicated is the one below the bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 162 — Two wakes took the same item, and nothing could have stopped them (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 161 — Standardize sweep: the cadence's first run, and a settled count that was wrong (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 160 — triaged while reading 158.1's outlier pages: named products the denylist does not deny (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 159 — Objective grill of Slices 151, 153, 157 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 158 — Owner wishlist: simplicity is the key; clean up the content (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 157 — Owner: the dirty row says it twice (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 156 — Owner: a device guide for the shells, with a support matrix (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 155 — Two drift risks in `create-ui`, found by explaining it (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 154 — Triaged from a reference form-layout engine (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 153 — Objective grill of Slices 149, 150, 152 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 152 — Owner wishlist: show every layout as a skeleton template (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 151 — Owner wishlist: learn from a mainstream list product (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 150 — Objective grill of Slices 112, 130-148 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 149 — Research: dense numeric UI, and an open-source ERP desk (owner wishlist, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 148 — Triaged from an external framework review (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 147 — Adoption: the framework has no front door (owner decision, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 146 — the published site went stale for a week (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 26 — from the Objective grill (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 25 — carried forward (2026-08-17 reconciliation)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 24 — triaged from "ROADMAP DIRECTION v1.2" (external review, 2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 15 (in progress — item 12 owner-gated) — conformance artifacts

11. [x] **Generated ACR** (Ines). VPAT-2.5-shaped page: WCAG 2.2 AA criterion
       × component, verdicts Supports / Conditional-on-adopter / Not
       Evaluated, generated from api.json + contrast.json + behaviors.json +
       the guarantees split. Accept: page generated, gated, linked from the
       accessibility concept; Not-Evaluated rows cite the AT gate.
12. [ ] **AT runtime evidence** — NEEDS-RUNTIME (owner hardware): combobox
       activedescendant, data-grid implicit roles, selection live-region on
       VoiceOver + NVDA; results recorded in `.roundtable/` and cited by the
       ACR. **Realigned 2026-08-24: unchanged, and genuinely unblockable by
       the loop** — it needs a human listening to a screen reader, which no
       gate here can simulate. `test:axe` (121 pages x 2 widths) and
       `check:forced-colors` cover what automation can; the residue is
       announcement behaviour, which only ears verify. Stays open rather than
       quietly closed, because the ACR cites it.

## Slice 16 — docs IA, compared against 5 CSS frameworks (user wishlist)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 22 — scale system, rich text, WYSIWYG table (user wishlist, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 23 — docs IA & depth (owner review, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

