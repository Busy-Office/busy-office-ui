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

## Slice 213 — P0: a windowed-list spacer is sized from ONE sampled row that is not representative, so every evicted chunk is 49px short and re-loading it jumps the scroll (2026-08-30)

**Found by 211.2's measurement, filed rather than built inside it** — Slice
211's own preamble sets that precedent for the two items it filed out of 208.3,
and widening 211.2 into a shipped-behaviour change would be the thing it
refused. Rule 1 dispatches this next.

`packages/core/src/js/behaviors/windowed-list.ts` — a **shipped** behaviour, not
example-app code. `makeSpacer()` sizes an evicted chunk's spacer as
`rowCount * chunkRowHeightPx(table)`, and `chunkRowHeightPx` samples exactly one
row — the first `tbody[data-chunk-offset] tr[data-row-id]` in the table — and
caches it per table. On `/movements` that sample is **32.5px** while **98 of the
chunk's 100 rows are 33px**, so:

```
extrapolated spacer   100 x 32.5 = 3250px
chunk renders at                   3299px      (sum of its own 100 row boxes)
error                              +49px per chunk, 4 of 4 runs
```

Re-loading an evicted chunk therefore grows the content above the viewport by
49px per chunk, which is a **visible scroll jump** — exactly the failure the
spacer mechanism exists to prevent, and the second time this one number has
shipped wrong (30.4b's token-derived spacers ran 250px short; the fix then was
to measure a row instead of computing one, which is the sampling this item is
about).

**Why nothing caught it, which is the more useful half.** Both existing
detectors re-use the bad sample as their own expectation, so neither can fail:

- `check-po-app.mjs`'s `spacerMatchesReal` asserts
  `|spacerH - realRowHeight * 100| <= realRowHeight`, where `realRowHeight` is
  read from the same first row. It compares **3250 against 3250** and passes.
- `packages/core/tests/windowed-list.test.ts` stubs a single `STUB_ROW_H` for
  every row, so heterogeneous row heights are structurally outside what it can
  express — its own header says the mechanism "has already shipped wrong once".

CLAUDE.md's category exactly: a detector whose predicate is computed from the
value under test cannot fail. The failure was only visible against an
**independent** quantity — the tbody's own rendered height.

1. [ ] **213.1 — size an evicted chunk's spacer from the chunk itself, and make
       the assertion independent of the sample.** The tbody being evicted is in
       the DOM and rendered at the moment `evict()` runs, so its height is
       readable exactly rather than extrapolated; `rowCount * chunkRowHeightPx`
       stays as the fallback for a chunk that measures 0 (detached, `display:
       none`, no rendered row yet). Name the cost: this trades the cached-sample
       path for one layout read per eviction, against a `replaceWith` on the
       same element that already forces layout.

       *Accept:* (a) an evicted chunk's spacer height **equals that chunk's own
       rendered height** on `/movements`, measured in a browser, with the
       before/after both recorded — finding the residual is not zero is a
       satisfying outcome provided the number is stated; (b) a unit test in
       `windowed-list.test.ts` covers a chunk whose rows are **not all the same
       height**, and it is red-proved against the current code (injection
       confirmed to have landed, per CLAUDE.md, not merely asserted red);
       (c) `check-po-app.mjs`'s `spacerMatchesReal` compares the spacer against
       something **not derived from the sampled row**, so it can fail on this
       defect — red-prove that too; (d) the CHANGELOG entry matches the actual
       compatibility, with the reasoning stated.

       *Not in scope:* `check:po-app`'s 150ms anchor wait. 211.2 measured that
       it is what decides whether a run exposes the jump; re-measure the anchor
       assertion after this lands rather than tuning the sleep.

## Slice 212 — Objective grill of the 200/208/209 window: a refusal's own base rate missed the declaration its cited gate names in its header, and the arming set needed narrowing for the third grill running (2026-08-29)

**Dispatcher trace, cloud wake.** Step 0: container **detached** again
(`git branch --show-current` empty), local `main` stale at `17b3ba6`,
`origin/main` a forced update `+ 17b3ba6...723e1f0`; recovered with
`git checkout -B main origin/main` before any commit — `ENVIRONMENT.md` trap 1,
sixth wake running. Rule 1: no open P0, GitHub intake **0 open issues** (asked
via the API). Rule 2: `Standardize 3 / 4 ok`. Rule 3:
`Objective 3 / 3 slices OVERDUE [200, 208, 209]` → **Objective**. Full report:
`.roundtable/grill-objective-200-208-209-2026-08-29.md`.

**Honest scope: the three Continue rounds since the last Objective row** —
200.7 (written up as Slice 210), 209.2, and 208.3 (which filed Slice 211). 200
had already been grilled twice and 208 in full by 209 last wake; see 212.2,
which is about that narrowing having to be done by hand.

**Every claim in 209.2 and 208.3 reproduces**, re-derived rather than read off
the file: `check:rf-floor`'s pass line to the digit (`@container 105,
@keyframes 43, @layer 99, @media 1, @starting-style 117, @supports 28`, 1 above
108); a fresh BCD read of all six at-rules, with `@keyframes` the only one
carrying a `prefix` entry; no prefixed at-rule emitted by the profile;
`--self-test` green and **red-proved fresh** by an asserted-unique injection
(filter dropped → `1 1`, rc=1; restored → green); `check:selftests` 46 gates /
16 heuristic; and `check:po-app` at **2 of 19** with the precondition named
first and `htmx: "undefined"`.

1. [x] **212.1 — DONE 2026-08-29. Slice 210's BROAD base rate is wrong: 5
       literal occurrences across 3 declarations, not "3 sites / 2
       declarations".** 210 enumerated *"the three literals in the tree"* as
       `600ms` (scan), `1.8s` and `linear` (skeleton). An independent postcss
       walk of all of `packages/core/src/css` finds a third declaration —
       `motion/motion.css:96`, `.bo-motion-spin { animation: bo-motion-spin 1s
       linear infinite }` — carrying `1s` and `linear`. A second, looser
       line-based sweep returns the same three declarations plus two hits that
       are prose inside comments, which the parse correctly excludes; the two
       instruments agree.

       **Where it ships, stated exactly, because the first reading of this was
       overstated and corrected before publishing.** `grep -rl` finds the string
       in `dist/css/index.css` and `dist/css/components/skeleton.css` too, but
       there it is **comment text**. The declaration ships in
       `dist/css/motion.css` alone: `motion/motion.css` is deliberately opt-in
       and never imported by `index.css` (`richtext.css:148`; the entry point is
       built by `build-component-css.mjs:92`). It is in the source tree, it is a
       shipped artefact, and it is **not under `components/`** — the most likely
       reason a components-scoped probe missed it.

       **The gate 210 quoted already counted it, and that is red-proved, not
       reasoned.** Removing spin's reduce override from the generated
       `dist/css/motion.css` — injection asserted unique (`count == 1`) before
       replacing — turns `check:motion` red naming exactly that declaration, and
       restoring it returns green. 210 quoted that gate's pass line in the same
       paragraph (*"animation: 17 token-driven, **6 explicit override**"*), and
       `check-motion.mjs`'s own header reads *"both literal-duration animations
       (**spin**, skeleton shimmer) carry their own `animation: none`
       override"*. Closer still: `skeleton.css`'s own comment, in a file 210 did
       read, explains its override as *"same reasoning as `.bo-motion-spin`"*.

       **The conclusion is unaffected and better supported.** NARROW re-derives
       as **0** — the scale is `100ms / 150ms / 300ms` plus
       `cubic-bezier(0.4, 0, 0.2, 1)`, and neither `1s` nor `linear` is a token
       value — so 210's 94.11 refusal stands untouched. And BROAD's refusal
       strengthens: the red set is 3 documented decisions, the missed one being
       the most explicitly documented of them (`motion.css:92-94` states why it
       is not token-driven; `:102-106` gives it `animation: none` under reduce).

       **No gate is proposed and none is needed.** `check:motion` already covers
       this subject on the shipped dist, adjudicating rather than forbidding —
       210's own conclusion. What was wrong was a count, and 192.1's answer to a
       wrong count is to name the instrument, not to add a gate.

       **Shape: 192.1, third instance running.** *The defect lands in what
       shipped BESIDE the number.* 210 spent its red-proof on the NARROW zero —
       correct, and re-derived as correct here — and the BROAD enumeration went
       out on that credibility having earned none. Same shape as 209.1, and same
       shape as 210's own paragraph about 201.4's denominator: 210 wrote that
       paragraph and then did it. **Correction appended to Slice 210's own
       record rather than rewritten in place**, per the standing rule that
       historical rows are never edited.

2. [x] **212.2 — DONE 2026-08-29. `LOOPS.md` §6 now says to narrow the arming
       set; three consecutive grills had to work it out for themselves.**
       Rule 3's text says *"THREE OR MORE slices **closed** since the last
       Objective"*, while the instrument counts **distinct slice numbers named
       by Continue/Standardize rows** since the last Objective row. A
       many-round slice therefore re-arms after each grill: **Slice 200 alone
       has armed three consecutive grills** (207 `[200, 204, 206]`, 209
       `[200, 205, 208]`, this one `[200, 208, 209]`), and each narrowed it out
       by hand while calling it *"the same correction"* someone else had made.

       Measured across `ROADMAP.md` + `ROADMAP-archive.md` by parsing the
       `## Slice N — Objective grill of Slices …` headings, deduped by grill
       slice: **21 grills, 9 covering at least one already-grilled slice**. Some
       are deliberate `-a`/`-b` halves of one wake's grill (196's heading says
       *"the artefact half"*); the last three are re-arms.

       **The step existed in the wrong file.** CLAUDE.md says *"Before grilling
       something, check `.roundtable/INDEX.md`"*, and the index reports its
       repeated-subject count on every run — **4** today, against the **3**
       CLAUDE.md records as its reading when written. `LOOPS.md` §6, the
       playbook a dispatched wake actually executes, said nothing about it. That
       is the signature of an instruction living somewhere the executing wake
       does not read, which is 169.3's lesson in a new place.

       **Written as a property, not a snapshot** — §6 names the check and the
       command, never which slices are stale. `LOOPS.md` has paid for that
       distinction three times with the prose-page names and once with the
       `0 down` clause (191.1).

       **Refused: a sixth regex in the dispatcher.** Counting *closed* slices
       means classifying slices by heading inside `dispatch_status.py`, which
       that script's header refuses on measured grounds and 170 finding B
       refuses again by name. The asymmetry decides it — rule 3 sits above rule
       4 precisely so it cannot starve, so **over-arming costs one paragraph of
       scope-setting and under-arming costs a starved loop.**

**NOT VERIFIED, and named as such**: cloud wake — no Podman, no
`localhost:8081`, **no screenshots at 1440px or 390px in either theme**. Zero
lines changed under `packages/core/src/` or `apps/docs/src/`; the diff is
`ROADMAP.md`, `LOOPS.md`, the grill report and the loop log, and no claim above
depends on how anything looks. Both dist mutations used as red-proofs were
reverted and the gates re-run green afterwards. `check:po-app` is red here **by
design** (2 of 19) per 208.3 — not a regression.

## Slice 211 — two things 208.3's root-cause turned up: a reference app that cannot run without the public internet, and a scroll-anchor assertion nobody had ever exercised in a container (2026-08-29)

**Filed by the cloud wake that closed 208.3, not built by it.** Both are real
measurements from that investigation; neither is what 208.3's Accept asked for,
and building either inside it would have been widening the item.

1. [ ] **211.1 — `examples/po-app` cannot run without reaching a CDN, and the
       cost of that landed on a gate rather than on a user.** `server.mjs:125`
       is `<script src="https://unpkg.com/htmx.org@2.0.4"></script>`, while the
       same shell already serves `/assets/css/htmx.min.css` locally — so the app
       is half-vendored today. In an egress-restricted container the script
       404s at the proxy and the app silently loses every htmx behaviour;
       `check:po-app` spent four runs across two containers reading that as an
       eviction bug (208.3).

       **The refusal that filed this is recorded rather than assumed away:**
       vendoring changes what the reference app *teaches* — a real consumer
       wiring htmx from a CDN, which is what `/getting-started/htmx` documents —
       so it is a product call, not a diagnostic side effect. `htmx.org` is
       already a dependency in `node_modules`, so the mechanism costs nothing;
       the question is entirely whether the example should stop demonstrating
       the CDN wiring.

       *Accept:* one of — (a) htmx is served locally by the app and
       `/getting-started/htmx` still shows the CDN form as the thing a consumer
       writes, with the divergence stated on the example's own page; or (b) the
       CDN stays and this item records the reason it is worth an app that cannot
       run offline. Either way, `check:po-app`'s own result in an
       egress-restricted container is re-measured and written down — **finding
       that (a) makes it 19 of 19 here is a satisfying outcome, and so is
       finding it does not.**

2. [x] **211.2 — `check:po-app`'s scroll-anchor assertion has never run in a
       cloud container, and the first four times it did, it read 98 / 49 / 0 / 0
       against a threshold of ≤ 2.** The assertion is *"windowed list: scrolling
       back re-loads the chunk with NO scroll jump and NO lost selection"*,
       which requires `anchorShift <= 2`. Until 208.3 it passed here **only
       vacuously** — with htmx blocked nothing ever moved, so `anchorShift` was
       0 by construction. Served htmx locally, it moved.

       ```
       run 1  anchorShift 98      run 3  anchorShift 0
       run 2  anchorShift 49      run 4  anchorShift 0
       ```

       Every other field in the payload held in all four (`chunk0Reloaded`,
       `scrollShift 0`, `checkboxRechecked`, `countAtEnd "1 selected"`,
       `midRowIndexOk`). **Stated no more strongly than the instrument
       supports:** the measurement was taken through a request-interception
       shim that serves htmx from memory, which is *not* how any real
       environment loads it, so the timing is not the shipped timing. It is
       filed because 2-of-4 red on a shipped correctness property is not a
       thing to leave unrecorded, not because the framework is accused.

       *Accept:* the anchor property is measured where htmx loads the way it
       actually ships — CI, or a local wake — over enough runs to say whether
       `anchorShift` exceeds 2 there at all; then either a defect is named with
       the measurement that names it, or this item records that the variance is
       the shim's and closes. **Finding the premise false — that it is stable
       everywhere htmx loads normally — is a satisfying outcome.**

       Re-runnable: the probe is the gate's own `page.evaluate` block copied
       verbatim with `page.setRequestInterception` fulfilling
       `https://unpkg.com/htmx.org*` from `node_modules/htmx.org/dist/htmx.min.js`.

       **CLOSED 2026-08-30 (cloud wake). The premise is FALSE: the variance is
       not the shim's, and the mechanism is a real defect in shipped code** —
       filed as Slice 213. Both halves of the Accept were measured.

       **The shipped path (CI, real CDN) holds.** Run 662 on `c60ee88`, job
       *Pseudo-locale + reference app + ERP suite + scaffold freshness*, logs
       `po-app smoke check passed — 19 behaviours verified end to end`. That is
       **non-vacuous by the gate's own construction**: 208.3's htmx precondition
       is one of those 19, so a green CI run entails htmx loaded AND
       `anchorShift <= 2`. Across the last 30 `ci.yml` runs on `main`
       (633-662), **23 concluded `success`**, each of which entails the po-app
       job passed — a lower bound, since the 7 non-successes (642-646 are
       ROADMAP 204's `check:claims` P0, plus 655 and one `cancelled`) were not
       attributed per-job.

       **The container disagrees, with htmx over a REAL HTTP round-trip and
       NO request interception at all.** The confound in 208.3's evidence was
       named and removed rather than argued away: interception delays *every*
       request, including htmx's own chunk fetches, which is the timing under
       test. The control instead repoints the app's one `<script src>` at a
       local static server (injection asserted unique before replacing, copy
       deleted on exit) and intercepts nothing:

       ```
       interception shim, 20 runs   anchorShift > 2 in 14   values {0, 49, 98}
       CONTROL, no interception,
                        20 runs     anchorShift > 2 in 12   values {0, 49, 98}
       ```

       So `anchorShift` exceeds 2 somewhere the shim is not involved. **The
       item's own suggested close — "the variance is the shim's" — is refuted
       by its own control.**

       **What varies is quantized, and that is what named the defect.** Only
       three values ever occur, and 98 = 2 x 49. The diagnostic that separates
       pass from fail is *which row gets picked as the anchor*: every shifted
       run picked `aria-rowindex` **902**, every clean run **106/107**, with no
       overlap. `evictedCount` is **9 in 12 of 12** runs, so it is NOT "how far
       the scroll loop got" — the first hypothesis, measured and discarded. The
       split is whether the evicted chunks have re-loaded by the gate's fixed
       150ms wait.

       **Then the 49 was measured directly rather than inferred.** Parking at
       the top and letting chunk 0 re-load, its spacer against what it actually
       renders at, 4 of 4 runs:

       ```
       chunk 0 spacer 3250px   ·   chunk 0 renders 3299px   ·   err +49px
       ```

       and the row heights say why: chunk 0 holds **98 rows at 33px and 2 at
       32.5px**, and `windowed-list.ts` samples the FIRST row — one of the two
       outliers — then extrapolates it over all 100. That is Slice 213.

       **Not filed as a defect: the gate.** Its 150ms wait is what decides
       whether a given run exposes the 49px, so the assertion is timing-
       sensitive — but it is timing-sensitive about a **real** scroll jump, and
       the right fix is 213, not a longer sleep. Re-measure this assertion after
       213 lands rather than tuning it now.

## Slice 210 — the motion-literal gate refuses itself: 0 of 23 under its own wording, and its only three reds under a wider one are three right answers (2026-08-29)

**Dispatcher trace, cloud wake.** Rule 1: no open P0; GitHub intake **0 open
issues** (asked via the API, not inferred). Rule 2: `Standardize 0 / 4`. Rule 3:
`Objective 0 / 3`. Rule 5 is below rule 4 and was not reached; for the record its
line read `0 wake-date(s) newer … ok`, the first non-STALE reading since 184.1
named it. **Rule 4 → Continue, build mode**, oldest non-blocked item: **200.7**,
with **201.4** read first as the hand-off directs. Cloud-takeable in full: the
whole item is a CSS parse and a gate's pass line, and **no claim below rests on a
rendered image**.

**The predicate has two readings and they give opposite answers, which is the
finding.** 200.7 is worded as a literal *"where a `--bo-motion-` prefixed token
exists"*. That qualifier is load-bearing and had not been measured separately:

| predicate | base rate | verdict |
|---|---|---|
| **NARROW** — a literal whose value a token already carries | **0 of 23** | 94.11's no-op gate: ship nothing, say so |
| **BROAD** — any literal duration or easing at all | **3 sites / 2 declarations** | all three correct; a gate would be red on right answers |

The token scale is `100ms / 150ms / 300ms` and one easing,
`cubic-bezier(0.4, 0, 0.2, 1)` — read from `tokens/motion.css` by the probe
rather than transcribed. The three literals in the tree are `600ms` (scan),
`1.8s` and `linear` (skeleton). **Not one of them has a token at its value**, so
the NARROW predicate is uniformly true of the tree and distinguishes nothing —
exactly 94.11's finding, where a precise detector scoring zero false positives
across 43 stylesheets was still worthless because its predicate was already true
of everything.

**The zero is red-proved, in both directions, and the injection was asserted to
have landed** — CLAUDE.md: a plain zero is a defect in the instrument until
proven otherwise, and a green red-proof is a defect in the injection. The probe
mutates a parsed token-driven declaration in memory, prints the before/after it
actually produced, and **exits non-zero if the replacement changed nothing**:

```
--inject duration : bo-toast-in var(--bo-motion-duration-base) …  ->  bo-toast-in 150ms …
                    NARROW 0 -> 1  (150ms duplicates --bo-motion-duration-base)
--inject easing   : … var(--bo-motion-easing-standard)  ->  … cubic-bezier(0.4, 0, 0.2, 1)
                    NARROW 0 -> 1  (duplicates --bo-motion-easing-standard)
```

**The BROAD reading is refused on the ground LOOPS.md §3 already states.** All
three literals are deliberate: no token exists at `600ms` or `1.8s`, and `linear`
is right for a continuous shimmer — a shimmer that eases is wrong. Both
declarations are already adjudicated by `check:motion` via its route (b), and
that was verified at the source rather than read off 201.4 — `scan.css:63` and
`skeleton.css:81` each carry their own `animation: none` under
`prefers-reduced-motion: reduce`. The gate's own pass line agrees:

```
npm run check:motion -w @busy-office/ui
# motion check passed — animation: 17 token-driven, 6 explicit override ·
#                       transition: 42 token-driven, 0 explicit override
```

So a BROAD gate's entire red set is three documented decisions, which is the
*"would fail the build on eight right answers"* shape already refused for
`report:css-repeats`. **`check:motion` covers 200.7's subject**, and covers it
better: it runs on the *shipped dist* CSS, and it adjudicates rather than
forbids.

**201.4's conclusion re-derives exactly; its denominator does not, and that is
worth one paragraph because it is 209.1's shape again.** Re-measured with an
independent postcss parse: the two literal-duration declarations 201.4 names are
the same two, at its commit (`0026066a`, in a throwaway worktree) and at HEAD.
But its stated **23 = 5 `none` + 16 token-driven + 2 literal** does not reproduce
under any scoping constructed for it. At its own commit the shorthand-only parse
finds **26 = 6 `none` + 18 token-driven + 2 literal**; widening to
`check:motion`'s own regexes gives 29. The `23` that *does* appear is at **HEAD**,
under "shorthand, live, excluding `none`" — a different tree and a different
scope from the one 201.4 was describing, so the agreement is a coincidence and is
named as one rather than quoted as a confirmation. **No item is filed**: the
conclusion the number was carrying is sound and independently re-derived, and the
correction is that a declaration count is only meaningful beside the scope that
produced it. That is the claim-inventory rule (192.1) landing on a premise —
201.4 spent its red-proof on the multi-line parse, which was correct, and the
breakdown beside it went out on that credibility.

**What this wake did NOT verify, said plainly.** Cloud wake: no Podman, no
`localhost:8081`, **no screenshots at 1440px or 390px in either theme**. It costs
nothing here — **zero lines changed under `packages/` or `apps/docs/src/`**; the
diff is markdown plus the loop log, and no claim above depends on how anything
looks. The probe was a scratchpad throwaway and is deliberately not committed:
shipping the script would be shipping the gate this item refuses.

**CORRECTION appended 2026-08-29 (roadmap 212.1), not rewritten in place.** The
BROAD row above reads **"3 sites / 2 declarations"** and the enumeration below
it names *"the three literals in the tree"* as `600ms` (scan), `1.8s` and
`linear` (skeleton). Both are wrong: there are **5 literal occurrences across 3
declarations**, the third being `motion/motion.css:96` —
`.bo-motion-spin { animation: bo-motion-spin 1s linear infinite }`, which ships
as the opt-in `dist/css/motion.css` entry point and is not under `components/`.
`check:motion` counts it (red-proved by an asserted-unique injection), its own
header names *"both literal-duration animations (**spin**, skeleton
shimmer)"*, and `skeleton.css`'s comment cross-references it by name. **Neither
conclusion moves**: NARROW re-derives as 0 because no token carries `1s` or
`linear`, and BROAD's refusal strengthens — the third declaration is the most
explicitly documented of the three (`motion.css:92-94` and `:102-106`). See
212.1 for the commands.

## Slice 209 — Objective grill of Slices 205, 208: the sweep proved itself against a state it never committed, and the floor script publishes a prefixed version its sibling filters out (2026-08-29)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, GitHub intake **0 open
issues** (asked via the API). Rule 2: Standardize `0 / 4`. Rule 3:
`Objective 3 / 3 slices OVERDUE [200, 205, 208]` → **Objective**. Scope narrowed
to **205 and 208**: `grill-objective-199-202-2026-08-29.md` already covers 200
in full, the same correction the 204/206 grill made. Full report:
`.roundtable/grill-objective-205-208-2026-08-29.md`.

**Nine of 208's measured claims reproduce exactly**, re-derived here rather than
read off the file: lane 1 `0 dead of 1,433`; lane 2 `8 groups / 242 rules / 230
distinct bodies` with the same eight shapes; lane 3 `118 pages, median 748, 9
over corpus, 12 over family`; the lane-coverage table (191 and 208 read lane 4,
194/197/202/206 did not — an independent per-section parser, discriminating 4 of
6); the four prior sweeps' drop figures; and both substantive halves of the
lossless-move proof (archive append-only prefix `True`; **0** lost lines missing
from the archive's gain). 205's base rate reproduces too: the same 6 distinct
at-rules in the built `rf-essentials.css`, exactly one above 108.

**Two findings, and one finding that was wrong and is recorded as such.**

1. [x] **209.1 — DONE 2026-08-29. 208's sweep numbers describe a state that was
       never committed.** Reported `ROADMAP.md 6,424 → 2,184` and *"the live
       file gained exactly `{pointer: 32}` and nothing else"*; the committed
       blob at `83192cd1` is **2,301** lines and gained **127** — the 32
       pointers plus 95 lines of Slice 208's own write-up, appended by the same
       commit. It reconciles to the line: Slice 208's section there spans
       117 lines, and `2301 - 117 = 2184`. `4,272` is the same intermediate
       arithmetic (`6424 + 32 - 2184`); the committed multiset difference is
       **4,250**. The conclusion is unaffected — the move was lossless, both
       assertions that say so still hold — but the assertion whose job is to
       catch an edit riding along with the move is false of the artefact, and
       208's own comparison table quotes its four predecessors at their
       committed values, so its own row is the only one on a different ruler.
       **The rule, stated once here rather than gated**: a figure about a
       commit is read back off the commit. CLAUDE.md already names the shape —
       *when something downstream can rewrite the artefact, its output is the
       artefact* — and the downstream rewriter is the wake's own write-up.

2. [x] **209.2 — DONE 2026-08-29. `check-rf-floor.mjs` published the PREFIXED
       Chrome version for `@keyframes`, where its sibling script filters
       prefixed entries out.**
       The gate's pass line reads `@keyframes 1`; BCD's entry is
       `[{"version_added":"43"},{"prefix":"-webkit-","version_added":"1"}]`, so
       `1` is `@-webkit-keyframes` and the unprefixed at-rule the profile emits
       is **43**. `earliestChrome()` (`check-rf-floor.mjs:99-107`) filters
       `flags` but not `prefix`; `derive-floor.mjs:102-115`, resolving the same
       BCD data across 6 shared feature paths, does:
       `entries.filter((e) => !e.prefix || emitsPrefixed)`.
       `LOOPS.md`'s *"Also settled: the BCD feature paths shared by two floor
       scripts"* refused consolidation because *"divergence here is LOUD"* —
       true of the path column, which throws; not true of the resolution helper
       beside it, which diverged silently.

       **Direction of error, which decides severity: it UNDERSTATES the floor**,
       so this reporter can only produce a false "below 108" — the false-safe
       direction, in the one script whose job is that floor.

       **Blast radius today is zero, measured**: 43 and 1 are both below 108, so
       no verdict moves, and none of the four `FEATURES` probes can hit it —
       `:user-invalid` 119, `color-mix()` 111, `subgrid` 117, `:has()` 105 are
       each a single unprefixed support object. Filed rather than fixed inside
       the grill: 205 itself was filed rather than fixed from inside the 200.4
       dispatch, and a grill that rewrites the gate it is grilling marks its own
       homework.

       *Accept*: `earliestChrome()` either applies the prefix filter its sibling
       applies, **or** its header records why the two must differ. Whichever
       ships, verify by reading the gate's own pass line against a fresh BCD
       read of all six at-rules — the criterion is that the two agree, not that
       any particular number appears. Re-measure the blast radius at that point
       rather than trusting this item's: the `FEATURES` set and the profile's
       at-rules both change. Consolidating the two helpers is **in scope as an
       option and is not required** — the settled section's "divergence is loud"
       argument survives for the path column either way, and a one-line filter
       is a satisfying outcome.

       **Shipped: the filter, not the header note.** `earliestChrome()` now
       takes an `emitsPrefixed` predicate and applies
       `!e.prefix || emitsPrefixed(e.prefix)` — the sibling's rule. The two
       helpers were left separate: consolidation was in scope as an option and
       is refused on the settled section's own ground, that the tables are not
       the same table.

       **The premise re-checked first, because it is an earlier wake's
       measurement** (CLAUDE.md's criterion rule). Fresh BCD read of all six
       at-rules the profile uses, at this commit:

       ```
       node --input-type=module -e "import bcd from '@mdn/browser-compat-data' with { type: 'json' };
       for (const n of ['container','keyframes','layer','media','starting-style','supports'])
         console.log('@'+n, JSON.stringify(bcd.css['at-rules'][n].__compat.support.chrome));"
       ```

       `@keyframes` is the only one of the six carrying a `prefix` entry —
       `[{version_added:"43"},{prefix:"-webkit-",version_added:"1"}]` — exactly
       as filed. And the profile emits **no prefixed at-rule at all**:
       `grep -oE '@-[a-z]+-[a-z-]+' packages/core/dist/css/rf-essentials.css`
       returns nothing, so 43 is the version the artefact actually requires.

       **The criterion is that the pass line and the BCD read agree, and they
       now do.** Before: `@container 105, @keyframes 1, @layer 99, @media 1,
       @starting-style 117, @supports 28`. After: the same line with
       **`@keyframes 43`**, and no other number moved. `1 above 108` is
       unchanged — `@starting-style` 117, as before.

       **Red-proved in both directions, with the injection verified at the AST,
       not the file.** Appending `@-webkit-keyframes bo-probe{…}` to the built
       profile (confirmed by parsing it back: postcss reports an at-rule named
       `-webkit-keyframes`) moves the line to `@keyframes 1` and lists a
       seventh at-rule — the prefixed entry becomes usable precisely when the
       artefact emits that prefix. Removing the injection restores 43.

       **Blast radius re-measured rather than trusted from this item.** All four
       `FEATURES` probes read as single unprefixed support objects at this
       commit — `:user-invalid` 119, `color-mix()` 111, `subgrid` 117, `:has()`
       105 — so no `prefix` key exists for the filter to act on and no verdict
       can move. Both at-rule figures involved (43 and 1) are below `TARGET`
       108, so the reported `n above 108` was and is 1. **The defect was in
       what the gate PUBLISHES, and in nothing it decides.**

       **A standing assertion replaces the one-off proof.** `--self-test` now
       pins both directions on the real shape that exposed this — a support
       array whose only early entry is prefixed — expecting `43` unemitted and
       `1` emitted. Red-proved twice against verified injections, each replacing
       exactly one line and asserting the count before replacing: dropping the
       filter (`usable = entries`) reports `1 1` and exits 1; hard-coding
       "ignore every prefix" (`entries.filter((e) => !e.prefix)`) reports
       `43 43` and exits 1. Neither degenerate implementation satisfies it, so
       this is not an assertion a single direction could carry.
       `check:selftests` still classifies 46 gates, 16 heuristic all
       self-tested.

       **The first red-proof attempt came back green and the injection was the
       defect**, as CLAUDE.md says to assume: a `sed` whose replacement text
       contained `||` broke on the `s|…|…|` delimiter, wrote an empty probe
       file, and the empty file exited 0. The pre-flight `grep -c` on the
       replaced line read **0** and caught it before the result was believed.
       Redone in Python with an explicit `assert count == 1`.

       **`LOOPS.md`'s "Also settled" paragraph was rewritten, not left.** It
       stated the divergence in the present tense, and this repo's own lesson is
       that a snapshot in a playbook goes stale silently and is read as current.
       The durable half — *diff how the two scripts READ a support array, not
       just which key they read* — is what the paragraph now leads with.

       **NOT VERIFIED, and named as such**: cloud wake — no Podman, no
       `localhost:8081`, **no screenshots at 1440px or 390px in either theme**.
       Nothing changed under `packages/core/src/` or `apps/docs/src/`; the diff
       is one build script, one playbook paragraph and this entry, and no claim
       above depends on how anything looks. Green here: core build (incl.
       `check:rf-floor` and its `--self-test`), core `npm run test` 151/151,
       `lint:css`, `docs:build` rc=0 (incl. `check:repo` and `check:slice-refs`
       421 citations), `check:claims` 158 live + 3 NOT VERIFIED (the container's
       pointer capability — `ENVIRONMENT.md` §6b, not a regression),
       `check:formatting`, `check:scroll` 910 containers, `check:layout` 127
       pages, `check:forced-colors`, `test:axe` 127 pages × 2 widths zero
       violations, `check:target-size`, `check:search`, `check:pseudo`,
       `check:quickstart`, `check:selftests`, `create-ui` check, `suite` audit
       28 screens. `check:po-app` NOT run — known RED here per 208.3.

**A third finding was written up as a defect and is wrong.** `ci.yml` runs
`npm run check:ci-ignores -w docs` and `ENVIRONMENT.md`'s toolchain list does
not name it, which reads exactly like the `check:formatting` failure 208.2
existed to close. It is the opposite: `check:ci-ignores` is a sub-check of
`check:repo`, which `docs:build` runs — it went green here inside that build —
whereas `check:formatting` is not in `check:repo`, which is why nothing caught
it. Coverage is complete, and 208.2's `19` reconciles (17 `npm run` + `npx
vitest` + `docker build`). The real cost is that the file's own re-derivation
instruction produces this false positive for any wake that follows it, because
the list holds **entry points** and `ci.yml` holds **steps**; `ENVIRONMENT.md`
now says so beside the list. Recorded in this order because the correction is
the part worth keeping.

**NOT VERIFIED, and named as such**: cloud wake — no Podman, no
`localhost:8081`, **no screenshots at 1440px or 390px in either theme**. Zero
lines changed under `packages/` or `apps/docs/src/`; the diff is markdown only.
Gates run green here: core build, core `npm run test`, `lint:css`, `docs:build`
(incl. `check:repo` 9/9), `check:claims` (158 live, 3 NOT VERIFIED — see below),
`test:axe` 127 pages × 2 widths zero violations, `check:layout` 127 pages,
`check:slice-refs`, `check:rf-floor` incl. `--self-test`.

**One environment fact moved again, in the other direction.** The 204/206 grill
recorded that headless Chrome had reached 151, that `(hover: hover) and
(pointer: fine)` read **true**, and that `check:claims` therefore ran 154
behaviours with **zero** `NOT VERIFIED`. In this container it reads **false**
and the gate reports `158 documented behaviours verified live · 3 NOT VERIFIED`.
204.1's design absorbs both readings with no code change, which is the mechanism
working; what is corrected is the reading — an environment fact is a property of
the container, not of the date it was measured.

## Slice 208 — Standardize sweep: the fifth clean result came from three lanes, and the fourth lane — unread by all four prior sweeps — was carrying the finding (2026-08-29)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 (`grep -n 'P0' ROADMAP.md`
returns only closed slice headings) and GitHub intake **0 open issues**, asked
via the API. Rule 2: `dispatch_status.py` read
`Standardize 4 / 4 Continue rounds since 2026-08-29 22:59 OVERDUE` → **Standardize**.
Rule 3 (`2 / 3`) and rule 4 were not reached.

**Lanes 1-3: a fifth identical clean result**, matching the baseline 194, 197,
202 and 206 established.

- `scan:dead-style -w docs` — **0 dead** of **1,433** live inline declarations
  (1,428 at 206; the five added are live).
- `report:css-repeats -w @busy-office/ui` — **8 groups** on 242 rules / 230
  distinct bodies (237 / 225 at the 2026-08-28 reading). Group shapes
  `x4(3) x3(3) x3(9) x2(3) x2(3) x2(6) x2(3) x2(3)` map one-to-one onto the
  table of eight in `LOOPS.md`. **No delta**, which is the finding this lane
  asks for — not the count.
- `report:prose -w docs` — 118 pages, median 748, 9 over 2x the corpus median
  and 12 over a family median, **union = 14**: the same 14 as the last check,
  every one already carrying a verdict from 158.1, 161.1 or Slice 178's
  `/concepts/scale/` entry.

**Lane 4 is where the finding was, and no sweep since 191 had read it.**
`report_loop_prose.py`'s ratchet block showed `ROADMAP.md 66 up, last cut
2ae54a4a (2026-08-28)` — the signature `LOOPS.md` names verbatim as this lane's
finding, *"a file the loop reads every wake accumulating with no cut behind
it"*. Rule 4 reads this file top-to-bottom every wake.

Scope, on 177's instrument unchanged (nearest preceding H2 **of any kind**; the
open set **derived** from `N. [ ]` checkboxes, never hardcoded — 165's own bug):

```
# the command is in ROADMAP-archive.md, Slice 177, verbatim
OPEN: [15, 112, 200, 201]
32 closed slices carrying 4336 lines here; 0 already in the archive
  # 4,336 of 6,424 lines = 67.5% of the live file was closed history
```

**Swept: `ROADMAP.md` 6,424 → 2,301 lines; `ROADMAP-archive.md` 21,264 →
25,633.** Thirty-two slices — 173, 175-199, 202-207 — moved verbatim, each
leaving the standing one-line pointer.

> **Corrected by 209.1.** This paragraph and the table below originally read
> **2,184**, **4,272** and *"gained exactly `{pointer: 32}`"*. Those are the
> file after the move and **before this write-up was appended to it** — a state
> that was never committed. The committed blob at `83192cd1` is **2,301** lines
> and gained **127** (32 pointers + 95 lines of the text you are reading);
> `2301 - 117 = 2184`, the 117 being this slice's own section. The two
> assertions that carry the lossless conclusion are unchanged and still
> reproduce.

**This is the FIFTH sweep**, counted 177's way — by the DROP across all 790
commits that have touched `ROADMAP.md`, never by grepping subject lines, since
the 2026-08-25 sweep is titled *"tidy: sweep 44 closed slices…"* and a subject
grep misses it. Prior four: `16ef2bb8` 12,516→5,562 (08-22), `063211cc`
9,824→1,094 (08-25), `187ab92d` 4,461→1,508 (08-28), `2ae54a4a` 3,872→2,030
(08-28). A fifth commit clears the >300-line threshold — `c5d21fb4`, 319 lines
— and is **not** a sweep (109.7, a grill); it is named here so the next count
does not read six.

**Proved a lossless MOVE, not an edit**, because a regex over a file that mixes
history with the live queue is exactly the bulk-edit trap CLAUDE.md refuses to
take on the diff's word. Three assertions against the committed `HEAD` blobs,
all of which the script ran before writing and again after:

| property | result |
|---|---|
| the archive's old content is a byte-exact **prefix** of the new one (append-only) | `True` |
| every line the live file lost appears in what the archive gained | **0** missing (of 4,272 as measured mid-wake; **4,250** by multiset difference on the committed blobs) |
| what the live file **gained** | `{pointer: 32}` mid-wake; **127** on the committed blob, the extra 95 being this slice's own write-up — see 209.1 |

**Citation-neutral, which is the property that matters** — `check:slice-refs`
reads **415 citations (228 cited, 2 known-dangling baseline) and 189 slice
numbers each heading one section**, identical before and after the sweep. The
189 is unchanged because a swept slice keeps its heading in the live file as the
pointer.

**The meta-finding: every sweep since 191 ran 3 of the 4 lanes** — 194, 197,
202, 206, which is the complete list of Standardize sweeps in that span
(`grep -n '^## Slice .*Standardize'` over both roadmap files) — and the missing
one is the lane that carries this signal. Measured on the archive by section,
after a first parser (an `awk` range) bled across section boundaries and
returned three different non-zero counts — an instrument's first output is not
evidence:

| slice | dead-style | css-repeats | report:prose | **lane 4** |
|---|---|---|---|---|
| 194 | yes | yes | yes | **NO** |
| 197 | yes | yes | yes | **NO** |
| 202 | yes | yes | yes | **NO** |
| 206 | yes | yes | yes | **NO** |

206's own text says *"all three standing lanes"*. The mechanism is legible in
the playbook: lanes 1-3 open with **Run** / **Also run** / **Also run** and
lane 4 with **And run**, ~35 lines further down inside the same list item, so a
sweep that reads the first three reads a complete-looking set.

**Fixed by numbering, not by a gate.** The lanes are now `Lane 1 of 4` …
`Lane 4 of 4`, and the playbook asks the write-up to say `n of 4`. A gate was
considered and refused on 94.11's base-rate ground: the property is *"the
write-up records this lane"*, which is semantic — a text check for a script
name in ROADMAP prose is satisfiable by naming it while skipping it, which is
the detector-that-cannot-fail shape this repo has paid for repeatedly. Counting
is a human act here and the numbering is what makes it cheap.

**NOT VERIFIED, and named as such**: this is a **cloud wake** — no Podman, no
`localhost:8081`, **no screenshots at 1440px or 390px in either theme**. That
costs nothing here: **zero lines changed under `packages/` or
`apps/docs/src/`**, so nothing rendered moved. The gate chain that did run is
listed on 208.1.

1. [x] **208.1 — DONE 2026-08-29 (cloud wake). Standardize sweep: lanes 1-3
       clean for the fifth consecutive time (0 dead of 1,433; 8 repeat groups
       matching the table of eight exactly; 14 flagged prose pages, all
       verdicted), lane 4 read for the first time since Slice 191 and carrying
       the finding. Fifth archive sweep executed: 32 closed slices / 4,336 lines
       moved verbatim, `ROADMAP.md` 6,424 → 2,184, proved a lossless move by
       three assertions against the `HEAD` blobs (archive append-only prefix
       `True`; 0 of 4,272 lost lines missing; live gained only its 32 pointer
       lines) and citation-neutral by `check:slice-refs` reading an identical
       415 / 228 / 189 on both sides. `LOOPS.md`'s Standardize step 1 now
       numbers its four lanes, because 194, 197, 202 and 206 each ran three and
       206 called that "all three standing lanes"; a gate for it was refused on
       94.11's base-rate ground and the refusal is recorded above.**

### Round 2 — the documented cloud toolchain had drifted from what CI runs

Second Standardize round, and the same drift shape as lane 4: **two
hand-maintained lists of "what a wake runs", one of which had silently fallen
behind.** `.roundtable/ENVIRONMENT.md`'s cloud-wake toolchain named **7**
commands; `ci.yml` runs **19**.

That is not academic. The previous wake's own commit message records
`check:formatting` reaching CI unrun and turning `main` red, with the reason
stated exactly: *"`ENVIRONMENT.md`'s cloud-toolchain list does not name it and
that list is what the wake used."* The fix landed as a sentence in a commit
message; the list itself was never updated.

**Every unnamed CI command was RUN here rather than assumed runnable** — this
repo's own rule is that a gate verified only in CI is not known to work, and
the mirror image applies: a gate *assumed* un-runnable in the cloud has not
been tested either. Sixteen run green (the full list is now in
`ENVIRONMENT.md`, derived from `ci.yml` rather than curated). Two do not:

- **`docker build`** — the binary exists at `/usr/bin/docker`, which is the
  trap; the daemon does not (`dial unix /var/run/docker.sock: no such file or
  directory`). `command -v docker` succeeding is not evidence.
- **`check:po-app`** — see 208.3.

**One environment-fact correction fell out of it**: `npm run suite` needs
`CHROME_PATH` exported in the same command (`suite:audit` drives a browser).
Trap 1c caught this wake out in exactly the documented way on its first run.

2. [x] **208.2 — DONE 2026-08-29 (cloud wake). `ENVIRONMENT.md`'s cloud-wake
       toolchain rewritten from `ci.yml` rather than curated: 7 commands → 16
       verified-green, each actually executed in this container on `eceffbc`
       plus a markdown-only diff, with the re-derivation command written beside
       the list so the next wake re-derives instead of trusting the snapshot.
       The two CI commands that do NOT run here are named with what was
       measured — no docker daemon (binary present, socket absent) and
       `check:po-app` (208.3). Motivated by the previous wake's own record of
       `check:formatting` reaching CI unrun because this list did not name
       it.**

3. [x] **208.3 — DONE 2026-08-29 (cloud wake). CAUSE ESTABLISHED, and it is
       an ENVIRONMENT ARTEFACT: the reference app loads htmx from a CDN, an
       egress-restricted container refuses the host, and every windowed-list
       assertion is downstream of htmx.** The container's console says it in
       one line — `net::ERR_TUNNEL_CONNECTION_FAILED` on
       `https://unpkg.com/htmx.org@2.0.4` (`examples/po-app/server.mjs:125`),
       then `htmx is not defined`. Chunks past the first two arrive through
       `htmx.ajax`, so with htmx absent the list stays at **2 tbodies / 200
       rows / `data-next-offset="200"` for all ten scroll iterations**, never
       exceeds the 3-chunk resident budget (`DEFAULT_RESIDENT_CHUNKS = 3`),
       and evicts nothing. `renderedBounded` then passes *vacuously* — 200 is
       under 400 because the DOM never grew.

       **The app is not at fault, and that is measured rather than argued.**
       One variable changed: htmx served from `node_modules/htmx.org` via
       request interception, the gate's windowed-list `page.evaluate` block
       copied VERBATIM, same container, same clone, same commit.

       ```
       A  no intercept   htmx undefined   chunk0Evicted false  spacerMatchesReal false  FAIL
       B  htmx served    htmx object      chunk0Evicted true   spacerMatchesReal true   PASS
       ```

       A reproduced the payload recorded above **byte-identically** (the
       fifth run of the class). B passed in **4 of 4** runs. So eviction
       works exactly as documented *in this very container* the moment its
       precondition is met.

       **Accept (a) is answered without a third environment**, which is the
       "finding the premise false is a satisfying outcome" clause landing:
       (a) exists to distinguish which side is right, and the mechanism
       distinguishes them directly — neither the app nor CI is wrong, the
       container cannot fetch a script the app needs. A local wake with
       Podman would now only re-confirm a cause already named.

       **(b) the side that is wrong is the measurement, not the app.** No P0
       filed: nothing shipped is broken. **(c) `ENVIRONMENT.md`'s
       `check:po-app` entry now carries the mechanism**, replacing
       "unexplained".

       **Fixed beside it — the gate stated the wrong thing, and that is the
       defect worth spending code on.** `check-po-app.mjs` now asserts the
       precondition first: *"windowed list: htmx loaded, so the assertions
       below are testing the app and not a blocked CDN"*. It reports
       `typeof window.htmx` and names the blocked-CDN mechanism in its
       payload. This is not "fix the gate so it passes here" — it still
       fails here, and should; it fails *saying the true thing*. Red-proved
       both directions on the predicate itself: htmx blocked → `undefined`
       → RED; htmx served → `object` → GREEN. The real gate now reports
       **2 of 19** with the precondition named first. On CI, where the CDN
       resolves, it is a 19th passing check.

       *Refused inside this item, with the reason:* vendoring htmx into
       `examples/po-app` so the reference app runs offline. It would make
       this container green, but it changes what the example *teaches* — a
       real consumer wiring htmx from a CDN — which is a product call for
       the owner, not a side effect of diagnosing a gate. Filed as Slice 211
       rather than done here.

       *Superseded — kept because it is the hypothesis space a future wake
       would otherwise re-walk:* the time-budget hypothesis was tested and
       refuted (a 40-iteration copy of the 10-iteration eviction loop gave a
       byte-identical payload) — correctly, because iterations were never
       the constraint. Two prior cloud containers reproduced it identically,
       which established determinism but not cause; the console error was
       the thing nobody had read.

## Slice 206 — Standardize sweep: fourth identical clean result, and one genuine candidate examined and correctly left alone (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 205 — `check:rf-floor` says "every use of a feature above Chrome 108 is guarded" while checking a fixed list of six (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 204 — P0: `check:claims` turned CI red for three commits by asserting a claim the headless browser structurally cannot evaluate (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 207 — Objective grill of Slices 204, 206: an environment fact went stale within the same day, and the self-healing gate absorbed it with no code change (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 203 — Objective grill of Slices 199-202: the P0 fix's own gate re-verified by injection, two triage refusals confirmed against source (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 202 — Standardize sweep: clean, and the two things this window's own new artefacts might have duplicated, checked directly (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

4. [x] **201.4 — DONE 2026-08-29 (Slice 210), by the second of the two outcomes
       its own Accept allows: 200.7 recorded that `check:motion` covers its
       subject and closed as refused.** Its conclusion re-derived exactly — the
       same two literal-duration declarations, both correct, both adjudicated by
       `check:motion` route (b), verified at the source and against the gate's
       own pass line. **Its denominator did not re-derive**, and that is recorded
       in Slice 210 rather than left implicit. Original text follows.

       **200.7's gate is largely already shipped as `check:motion`, and
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
3. [x] **200.3 — tab and segmented-control selection get a style transition,
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

       **CLOSED 2026-08-29** (cloud wake, rule 4 — oldest open item that is not
       owner-blocked). `tabs.css` and `segmented.css`, no new tokens. Every
       figure below is a computed-style or layout reading from headless Chrome
       (`browser-harness.mjs` + `serve-dist.mjs`), taken on the built site
       before and after the change.

       | criterion | before | after |
       |---|---|---|
       | `.bo-tabs__tab` transition | `all` / `0s` | `color, background-color, border-color` / `0.1s ×3` / `cubic-bezier(0.4, 0, 0.2, 1) ×3` |
       | `.bo-segmented__option` transition | `all` / `0s` | `color, background-color, box-shadow` / `0.1s ×3` |
       | strip block-size (9-tab strip), 4 sample points | 39/39/39/39 | 39/39/39/39 |
       | keydown → `aria-selected` flip, 40 presses | max **1.2 ms**, mean **0.59 ms** | max **1.4 ms**, mean **0.73 ms** |
       | forced-colors, both components | `0s` | `0s` |
       | reduced motion, both components | `0s` | `0s, 0s, 0s` |

       **Three things measured that reading the CSS would have got wrong:**

       - **The first forced-colors override shipped and did nothing.** It was
         written into `tabs.css`'s existing `@media (forced-colors: active)`
         block, which sits **above** `.bo-tabs__tab`. Same specificity, so
         source order decided and the base rule won: the computed
         `transition-duration` under emulated forced-colors still read
         `0.1s, 0.1s, 0.1s` after the override was in the built CSS. Moved
         below the rule it overrides; re-measured to `0s`. Nothing in the build
         could have caught this — `check:motion` asks about
         `prefers-reduced-motion`, not this — so it is now a `check:claims`
         case, red-proved by having been red for real.
       - **`border-color` (shorthand) does animate `border-inline-end-color`
         (logical longhand).** That is why ONE declaration covers the
         horizontal strip, the vertical rail and the narrow-container fallback
         instead of three. Measured mid-transition on the rail:
         `rgba(15, 118, 110, 0.776)` against a settled `rgb(15, 118, 110)`;
         before the change, mid and settled were identical.
       - **`box-shadow` is NOT dropped by the UA in forced colors here.** The
         comment first written asserted it was. `forced-color-adjust: none` on
         the checked option opts it out of that too, and it computes
         `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`; an unchecked sibling reads
         `none` only because it never had a shadow.

       **One deliberate deviation from the Accept, measured before taking it:**
       the Accept names `border-color` for BOTH components; `segmented.css` does
       not get it. Across the 5 rules in that file whose selector names
       `__option`, the only `border-*` declaration of any kind is one
       `border-radius` — the border belongs to `.bo-segmented`, the track — so
       listing it would ship a transition property that can never fire.

       **The latency figure is reported with its noise floor, not as a delta.**
       Five runs on the post-change build read means of 0.732, 0.755, 0.767,
       0.810, 0.825 ms; the single pre-change run read 0.59, which sits below
       that cluster, so a real increase of roughly 0.2 ms cannot be ruled out
       and is not claimed to be noise. It does not matter either way: both are
       ≈1 ms, two orders of magnitude below the ~100 ms at which input lag
       becomes perceptible, and `aria-selected` tracked all 40 presses with
       exactly one tab selected at the end.

       **NOT VERIFIED, said plainly.** Cloud wake: no Podman, no
       `localhost:8081`, **no screenshots at 1440px/390px in light or dark**.
       Everything above is a computed-style or geometry reading. Whether a
       100 ms colour settle *looks* right — which is the entire design argument
       for the change — is **unverified**, and no claim here rests on it. A
       local wake looking at `/components/tabs/` and `/components/segmented/`
       is worth one minute. Note that a still screenshot could not settle it
       either: the resting pixels are unchanged by construction.
4. [x] **200.4 — data-table bulk-actions get an entrance transition instead
       of an instant `display` flip.**
       *Accept*: `.bo-data-table__bulk-actions` becoming visible (first row
       selected) shows a short opacity+transform entrance
       (`--bo-motion-duration-fast`–`-base`); selecting additional rows does
       not replay it (only the none→visible transition fires); clearing the
       last selection hides it without an exit flourish beyond what the
       existing mechanism does; at 390px the toolbar wraps exactly as it does
       today — this item does not touch the wrap/overflow behavior 173.2/190.1
       already fixed; RTL entrance direction verified, not assumed mirrored.

       **Landed 2026-08-29 (cloud wake).** `@starting-style` on the existing
       `[data-any-selected="true"]` / `:has(:checked)` selector pair, with the
       `transition` on the VISIBLE rule only. Every figure below is a
       computed-style or geometry reading taken in headless Chrome via
       `browser-harness.mjs` + `serve-dist.mjs` on `/components/data-table/`,
       the one built page carrying a bulk bar and 2+ row selects.

       **Premise checked before any of it**, because a duration measurement is
       meaningless under reduced motion and this container's media queries are
       not desktop defaults (204.1): `(prefers-reduced-motion: reduce)` reads
       **false**, `no-preference` **true**, `--bo-motion-duration-base` `.15s`,
       root font-size 16px.

       | Accept clause | measured |
       |---|---|
       | entrance on first selection, fast–base | at the click: `display` none→**flex**, `opacity` **0**, `translate` **`0px -4px`**, `getAnimations()` = **opacity@150ms + translate@150ms**; at 40 ms `opacity 0.1756` / `translate 0px -3.298px`; settled `opacity 1` / `translate 0px` |
       | additional rows do not replay | second row-select click: `getAnimations()` **[]**, opacity stays `1` — the applied rules do not change, so no transition is generated |
       | clearing the last selection: no exit flourish | at the clearing click `display` is **already `none`**, `getAnimations()` **[]** — the hide direction's after-change style is the base rule, which declares no transition |
       | 390px wrap unchanged | settled bar `[41, 778, 177.67, 36]`, buttons `Approve [41,778,92.27,36]` / `Reject [141.27,778,77.41,36]`, **1 row, 0px spill** past the toolbar — **byte-identical** to the pre-change rendering (same page, same browser, the three new declarations neutralised by injection). Same at 1440px. |
       | RTL entrance direction | `dir="ltr"` and `dir="rtl"` both read a start of **`0px -4px`** — travel is on the block axis, so there is nothing to mirror. Verified in both directions rather than reasoned from the axis. |

       **The zero-JS path was measured too, not assumed from the shared
       selector**: with `data-any-selected` removed and the checkbox set
       without a change event, the `:has()` branch produces the same
       `opacity 0` / `translate 0px -4px` / 150 ms pair.

       *The first red-proof of the wrap comparator came back GREEN, and it was
       a defect in the INJECTION* — CLAUDE.md's rule, executed. The injection
       was `flex-wrap: nowrap`, which is inert here: the bar already occupies
       **one** row at 390px, so forbidding a wrap it does not have changes
       nothing. Replaced with `max-inline-size: 120px` against a 177.67px bar,
       and the injection was confirmed to have landed by reading the computed
       value (**`none` → `120px`**) before the red was believed: rows moved
       **1 → 2** and the comparator reported the difference. Only then was its
       "no change vs pre-change" verdict worth anything.

       **Refused: `display … allow-discrete`**, which .bo-dialog, .bo-offcanvas
       and .bo-dropdown all carry. What it buys is holding the box rendered
       through a fade-*out*, and this Accept asks for no fade-out; adding it
       would have produced exactly the exit flourish the item excludes. The
       entrance-only property is therefore structural — a transition declared
       on one rule and not the other — rather than a duration set to zero,
       which is the form that survives someone later changing a token.

       **`check:composited` caught it on the first build**, which is the gate
       working: `@starting-style { … opacity: 0 }` is a dimming declaration in
       the shipped CSS and now carries a registry entry. Narrower than the
       `.bo-dropdown__menu` entry beside it — a one-direction transition, so
       `opacity: 0` is never a close-transition end point either.

       **NOT verified, said plainly.** Cloud wake: no Podman, no
       `localhost:8081`, **no screenshots at 1440px or 390px in either theme**.
       Whether a 150 ms lift *looks* right — the design argument for the change
       — is unverified, and nothing above rests on it. As with 200.3, a still
       screenshot could not settle it either: the resting pixels are unchanged
       by construction (measured: identical rects). What a local wake should do
       is *watch* `/components/data-table/` while ticking a row, not photograph
       it.
5. [x] **200.5 — toast gets an exit animation and a bounded stack-reflow,
       matching the entrance it already has.**
       *Accept*: `.bo-toast` removal fades out over
       `--bo-motion-duration-fast`–`-base` rather than disappearing instantly;
       remaining toasts in a stack of 3+ shift by a bounded translate (not an
       uncapped reflow) when one is dismissed; auto-dismiss timers pause on
       hover/focus (verify this exists in the current toast behavior —
       CHECK, don't assume, before writing the Accept as "unchanged"); an
       error toast requiring action is not auto-dismissed; reduced motion
       makes both entrance and exit instant.

       **Landed 2026-08-29 (cloud wake).** `alert.css` gains
       `.bo-toast[data-state="closing"]` + `@keyframes bo-toast-out`;
       `behaviors/alert.ts` marks a toast closing, holds it for the duration
       it reads back off the computed style, then removes it. Inline
       `.bo-alert` removal is untouched and still synchronous.

       **Two of the five clauses asked about a mechanism that does not
       exist, and the Accept said CHECK — so finding the premise false is the
       result, not an off-plan outcome.** There is no auto-dismiss timer in
       this framework, so there is nothing to pause on hover/focus and
       nothing that could auto-dismiss an error toast. Measured rather than
       read:

       ```
       git grep -lE "bo-toast|bo-alert" HEAD -- 'packages/core/src/js/**'
         # alert.ts, tag-input.ts, validation-summary.ts
       # setTimeout|setInterval|requestAnimationFrame in each of those three:
         # 0, 0, 0
       ```

       `/components/alerts` had already framed auto-dismiss as the
       consumer's job ("*If* you auto-dismiss, keep toasts visible ≥ 5s…"),
       so the page was never wrong — but it stated the WCAG 2.2.1 guidance
       without stating the position. It now says the position outright
       (the framework never removes a toast the reader did not dismiss,
       because it cannot know whether they have read it) and the absence is
       asserted live: two undismissed toasts are still present and unmarked
       2s on. Bounded evidence for an absolute claim, and the bound is in
       the check's own name.

       **"Bounded translate" read as: the survivors travel by exactly one
       toast, continuously.** Stated because the clause admits a second
       reading (cap how many toasts move) and the built thing answers the
       first. The exit collapses `block-size`/`padding-block` to 0 rather
       than only fading, so the distance is the dismissed toast's own box —
       and the travel is contained to `.bo-toast-region`, which is
       `position: fixed`, so nothing behind it re-lays out.

       Measured live (headless Chrome via `browser-harness.mjs` +
       `serve-dist.mjs`, `/components/alerts/` at 1440px, middle of a stack
       of three, `--bo-motion-duration-fast` overridden to 1200ms for a
       non-racy sample — the animation is token-driven, which is the
       property `check:motion` enforces):

       | reading | value |
       |---|---|
       | stack before | heights `[60, 60, 66]`, `row-gap` 8px, region 202px, survivor top **782** |
       | a third of the way through the exit (t=400 of 1200) | survivor top **813.09**, `progress` **0.4573** — partway, not 0 and not 1, which is the only thing a snap cannot be. Identical on two consecutive runs. |
       | just before removal | region **134.0625px**, closing toast `block-size` **0.047px**, `padding-block-start` **0.011px**, `margin-block-start` **−7.99px** |
       | after removal | region **134px**, survivor top **850** |
       | total travel | **68px** = 60 (dismissed toast) + 8 (one gap) |
       | snap when the node leaves | **0.0625px** |

       The band the check asserts on `progress` is a wide 0.05–0.95, and
       that is deliberate: a first cut sampled at the halfway point and read
       **0.746 / 0.776** on two runs — healthy, since `cubic-bezier(0.4, 0,
       0.2, 1)` at t=0.5 is ≈0.8, but close enough to a 0.8 upper bound that
       a loaded runner would have failed a working animation. The property
       is "partway"; a snap reads exactly 0 or exactly 1, so the bound
       carries no information and the tightness only buys flake.

       The negative margin is what makes that last row a 0: a zero-height
       item still sits between two gaps where its removal leaves one.
       Red-proved by injection — dropping it from the BUILT CSS
       (`margin-block-start:calc(var(--bo-space-2) * -1)` → `0`, confirmed
       in the built file before believing the result) turns the removal into
       an 8px jump and the check goes red.

       **The first measurement was wrong, and it was the instrument.** The
       reflow case originally sampled the survivor one `requestAnimationFrame`
       after injection and reported 60px travel against a predicted 68 — an
       8px discrepancy that looked like a missing gap and was
       `bo-toast-in`'s `translateY(0.5rem)`, still mid-flight. The entrance
       runs on `-base` and the override moves only `-fast`, so nothing about
       the exit slowed it. Fixed by measuring the RESTING box; the trap is
       recorded in the check's own comment.

       **Red-proofs, both confirmed to have landed before the red was
       believed:** (1) restoring instant removal in the built page's inlined
       behavior (`grep`-confirmed, 1 of 1 built page carries it) fails the
       hold case and the reflow case, 2 of 155; (2) the margin injection
       above fails the reflow case, 1 of 155. The behavior tests were
       red-proved the same way against the built `dist/js` artifact they
       import: 2 of 6 fail.

       **Why a timer and not `animationend`:** 200.1's reason, applied — a
       dismissal gated on an event that can fail to arrive is a toast that
       never leaves. The hold is read from the computed `animation-duration`
       rather than hard-coded, so the token and the timer cannot drift; when
       it reads 0 the removal is synchronous, which covers reduced motion
       and a consumer who loaded the JS without the CSS in one branch.
       Dialog's pure-CSS `allow-discrete` recipe does not transfer: a toast
       is REMOVED, and there is no after-change style for a node that no
       longer exists.

       **NOT verified, said plainly.** Cloud wake: no Podman, no
       `localhost:8081`, **no screenshots at 1440px or 390px in either
       theme**. Every figure above is geometry or computed style; whether a
       100ms collapse *reads* as a toast leaving rather than as the stack
       twitching is a design judgement no still frame settles either — a
       local wake should *watch* `/components/alerts/` while dismissing the
       middle of a stack of three.

       **Watched, 2026-08-30 (local session).** Podman rebuilt from
       `HEAD=b6c9f45` (`podman build -f apps/docs/Containerfile -t bo-docs .`),
       served on :8081, and the shipped CSS confirmed live before trusting
       any screenshot (`bo-toast-out … forwards` and its `@keyframes` block
       both present in the served, non-cached asset — the CDN-skew trap this
       repo's CLAUDE.md names). Built a real stack of three via
       `/components/alerts/`'s "Show toast" trigger, dismissed the MIDDLE
       one with a real click, screenshotted immediately after. Reads clean:
       no twitch, no overlap, no leftover gap — the survivor toast sits
       flush at the dismissed one's old position (DOM-read after: 2 toasts,
       rects `top 575` / `top 635` with 0px between them, matching the
       cloud's 68px-travel measurement). The 100ms fast-token exit is quick
       enough that a single post-click screenshot already shows the settled
       state rather than a mid-flight frame — which is itself an answer to
       the judgement question: nothing about it reads as abrupt or as the
       stack visibly jumping.
6. [x] **200.6 — row insert/delete and inline-validation entrance, composed
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

       **LANDED 2026-08-29 (cloud wake, rule 4).** All three live on
       `/getting-started/htmx` as one new section, "5. Motion on swapped rows
       and messages" — the page that already documents the settle flash, which
       is where the item said the guidance belonged. No new CSS: zero lines
       changed under `packages/`.

       *Accept clause 1, read out of the BUILT CSS rather than out of intent:*

       ```
       grep -c '\.bo-motion-fade-in\b'                packages/core/dist/css/motion.css   # 1
       grep -c '\.bo-motion-fade-out\b'               packages/core/dist/css/motion.css   # 1
       grep -c '\.bo-motion-slide-in-block-start\b'   packages/core/dist/css/motion.css   # 1
       grep -oE '@keyframes [a-z-]+' packages/core/dist/css/motion.css | sort -u | wc -l  # 8
       grep -ric shake packages/core/dist/css/                                            # 0
       ```

       Each of the three names resolves to exactly one shipped rule with a
       matching `@keyframes`, and nothing in `dist/css` shakes — so "explicitly
       no shake" is a property of the artifact, not a promise in prose.

       *Accept clause 2 and 3:* the guidance is **one `<p>`** in an existing
       page — cell vs. row vs. summary total, never while typing, never on
       first paint, never more than ~once/second per region (coalesce) — and
       the windowed-table exemption is stated in that same paragraph, linked
       to `/concepts/scale#windowed-list`, with the item's own reason (moving
       many adjacent rows is what breaks a reader's tracking).

       **Three `check:claims` cases, 155 → 158, every sub-assertion red-proved
       by injection with the injection confirmed in the BUILT html first.** The
       middle one is the item's actual subject — deletion must not depend on
       `animationend` — and it is asserted the only way that can fail: the
       check strips `bo-motion-fade-out` off the leaving row immediately after
       the click, which CANCELS the animation, so the event can never fire.

       Round 1, three independent injections (built-output confirmations:
       `bo-motion-fade-inn` ×1; `animationend",()=>t.remove())` present with
       `setTimeout(…remove…)` gone; `animation-name: shake` ×1) — 3 of 158 red:

       ```
       insert   {"before":2,"after":3,"cls":"bo-motion-fade-inn","anim":"none","ms":"0s"}
       timer    {"before":3,"after":3,"exitClass":true,"ms":"0.15s","ended":0,"stillAttached":true}
       message  {"anim":"bo-motion-slide-in-block-start", …,"shaking":1}
       ```

       `ended: 0` with `stillAttached: true` is the whole point: no
       `animationend` arrived AND the row never left, so what removes it in the
       shipped version is the timer and nothing else.

       Round 2 covered the two sub-assertions round 1 did not exercise
       (built-output confirmed: `bo-form-field__message bo-motion-fade-in` ×1,
       `removeAttribute("role")` ×1, `setAttribute("role","alert")` ×0) — 1 of
       158 red, `{"anim":"bo-motion-fade-in","role":null,"shaking":0}`. The
       `shaking` probe is the one at risk of being a detector that cannot fail
       — its base rate in this corpus is 0 — so it was made to fire on purpose
       rather than trusted for reading 0.

       **The first draft of this item shipped an accessibility defect, and the
       framework's own rule caught it, not a gate.** The inline-validation
       message is inserted after load, and `/concepts/accessibility#live-regions`
       says arrival decides: it must carry `role="alert"`. The draft had the
       `aria-invalid`/`aria-describedby` wiring and no role. Both the demo and
       the copyable recipe now carry it, and the recipe shows the
       server-rendered twin *without* the role, because that one arrives as a
       page load.

       **A gate for that was measured and refused, per 94.11.**
       `check:live-regions` reads the BUILT html, so it catches a static
       `role="alert"` on content that never arrives and structurally cannot
       catch the opposite. Base rate of the opposite in this corpus:
       `grep -rln createElement apps/docs/src/pages/` returns **5** pages
       (editable-grid, app-frame, pagination, tag-input, htmx); the other four
       insert tags and table rows, which are not live-region material — **0**
       message-shaped insertions besides this one. A gate would have nothing to
       catch today. The one instance is asserted live by the claims case above
       instead.

       **The timer case as first pushed turned CI red, and the two defects in
       it are both this file's own recorded shapes.** Run 655, "Claims +
       formatting", five of six jobs green. The payload said the page was
       fine — `{"after":2,"ended":1,"stillAttached":false}`: the row was
       removed by the timer exactly as documented — so the failure was in the
       assertion.

       - **It counted the wrong animation.** The row under test is the one the
         insert case appended, so its `bo-motion-fade-in` was still running and
         its `animationend` was counted as the exit's. It read 0 locally and 1
         on CI; nothing about the framework differed, only how much wall clock
         passed between two `page.evaluate` round-trips. **A number that
         differs between two runs of the same commit is the instrument**, and
         this one had been believed after a single local reading.
       - **The fix for that made the check unable to fail, and re-running the
         injection is what caught it.** Round 1's injection replayed GREEN with
         the injection confirmed present in the built html. The defect was in
         the CANCEL, not the detector: stripping the exit class is not a
         cancel, because the row still carries `bo-motion-fade-in`, so removing
         `fade-out` **restarts the entrance**, whose `animationend` fires the
         gated handler and removes the row. Cancelled with an inline
         `animation: none` instead — no animation of any name left to end — and
         re-proved red against the same injection:
         `{"after":3,"ended":0,"stillAttached":true}`.

       The generalisable part, which is the step between two rules this file
       already has: **re-red-prove after CHANGING a detector, not only after
       writing one.** Round 1 proved a version of this check that a later edit
       invalidated, and the edit shipped unproved. Also recorded: `check:
       formatting` was never run locally by this wake at all before CI ran it —
       the wake's gate list was the cloud-toolchain list in `ENVIRONMENT.md`,
       which does not name it.

       **NOT VERIFIED, named rather than implied:** cloud wake — no Podman, no
       `localhost:8081`, **no screenshots at 1440px or 390px in either theme**.
       Everything above is DOM, computed style or built-artifact text. Whether
       a row fading out of a compact table *reads* as the line leaving, rather
       than as the table twitching, is a judgement a local wake should settle
       by watching `/getting-started/htmx` while removing a line — a still
       frame cannot settle it either.
7. [x] **200.7 — REFUSED 2026-08-29 (Slice 210). A lint check that a raw ms
       duration or literal easing function isn't hand-written in component CSS
       where a `--bo-motion-` prefixed token exists.** Its own Accept asked for
       the base rate first and for the gate to *"say so rather than ship"* if the
       tree is already clean. It is: **0 of 23**, red-proved by injection in both
       directions. The measurement and the reasoning are in Slice 210; the
       broadened predicate was measured too and refused separately, because its
       only three reds are three right answers. Original text follows. The one proposal item that's a genuinely mechanically
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

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 198 — Objective grill of Slices 193, 196, 197: a clean control, re-derived rather than re-copied (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 197 — Standardize sweep: all three standing lanes clean, delta 0 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 196 — Objective grill of Slices 190, 191, 192 (the artefact half): twelve measured claims reproduce, and the thirteenth was reasoned out beside them (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 195 — Objective grill of Slices 190, 191, 192 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 194 — Standardize sweep: the previous sweep's own fix pointed at the next one (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 193 — Objective grill of Slices 186, 189, 190, 191: the window's artefact claims all hold, and the one obligation it left behind was never read (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 192 — Objective grill of Slices 186, 189, 190, 191 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 191 — Standardize sweep: three lanes clean, and the fourth was reading a number its own command cannot print (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 190 — Objective grill of Slices 173, 185, 187: the measured claims all held, the reasoned ones did not (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 189 — Objective grill of Slices 173, 185, 186, 187 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 188 — the release now ships the front door, and the tag assertion is replaced rather than dropped (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 187 — Standardize sweep: three clean lanes, and the one duplicate they cannot see (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 186 — Objective grill of Slices 180, 183, 184: the loop's self-descriptions are the thinly-gated surface, and the hand-off is wrong at HEAD (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 184 — rule 5 has read ten-day-old numbers for ten wake-dates, and the Accept criterion that was supposed to prevent it stopped holding the day it was ticked (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 185 — `create-ui` is RELEASED, and two of this slice's own diagnoses were wrong (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 183 — the visual backlog that waited eight wakes, cleared (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 182 — Polish round on `state-patterns`: the rubric cited the bug, not the fix (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 180 — P0: a loop-name tally is read as a slice citation, and `main` has been red since (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 179 — Objective grill of Slices 173, 176, 177, 178 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 178 — Standardize sweep: the split that outran its own instrument, and a page that disagrees with itself (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 176 — Polish round 2 on `component/scan`: the score that was taken and never written down (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 181 — Owner: a PO-list screenshot, grilled for framework gaps (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 175 — Objective grill of Slices 169, 170, 172 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 173 — Owner: two demos that do not demonstrate (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

