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

## Slice 236 — Objective grill of Slices 232, 233, 234, 235: every published figure reproduces except one, and the two findings are both about what a verification CANNOT see — a corroborating count that measures its own explanation, and a sweep that archived the target of an open item's Accept (2026-09-01)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 (`grep -n 'P0' ROADMAP.md`
returns only closed slice headings) and GitHub intake **0 open issues**
(`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing to triage and no
`Roadmap · plan` row was recorded. Rule 2: `Standardize 0 / 4 since 2026-09-01
05:06`, no drift flagged. Rule 3:
**`Objective 4 / 3 slices OVERDUE [232, 233, 234, 235]` — dispatched.** Rule 4
was not reached. Full report:
`.roundtable/grill-objective-232-233-234-235-2026-09-01.md`.

**Arming set NOT narrowed, and the check is set membership rather than a
recollection.** The last grill is Slice 232 itself, covering 229/230/231; the
armed set is disjoint from it. `ls .roundtable/grill-objective-*.md` reads
**41** (232's own report is the 41st, which is why that slice read 40), and
grepping the four armed numbers out of the other forty returns hits in **4**
files, every one of them incidental — `230 distinct bodies` from a
`report:css-repeats` line, `229 cited` from a `slice-refs` line, `229.4` /
`229.5` as items 232 filed, and a 2026-08-19 class count. **None is a prior
grill OF 232, 233, 234 or 235.** The loose grep is reported rather than hidden
because it is the weak instrument here: it cannot tell a subject from a
coincidence, so its four hits were read individually rather than counted.

**Scope, said honestly: 232 is armed by its own follow-up items, not by being
un-grilled as a grill.** `dispatch_status.py` counts distinct slice numbers
named by Continue/Standardize rows, and 232.1/232.2 were built as Continue
rounds after the grill landed. So what is grilled here is those rounds and
their published numbers, not the 229/230/231 verdicts, which stand untouched.

### What was re-derived, and what it cost to be sure

Every load-bearing figure in the four slices was re-run on an **unshallowed**
clone (`git rev-parse --is-shallow-repository` → `false`, 1,776 commits;
ENVIRONMENT.md §2 — history figures are silently 50x wrong without it). The
container also started **DETACHED** with local `main` stale at `17b3ba67`
against `HEAD` `7bce44ed`, exactly ENVIRONMENT trap 1; `git branch
--show-current` returned empty and `git checkout -B main origin/main` fixed it
before any commit existed.

| slice | claim | re-run | verdict |
|---|---|---|---|
| 235.1 | `--rev d701e619^` reproduces 228.1 | `OPEN: [15, 112]` · `15 closed / 2366 lines` · `62.4%` | **exact** |
| 235.1 | `--rev e29c7c18^` reproduces 214.1 | 7 targets `[213, 212, 210, 209, 208, 201, 200]` · `1568 lines` | **exact** |
| 235.1 | `--self-test` cases A-D discriminate | `self-test OK` on all four | **holds** |
| 235.2 | 5 sections moved byte-identically | **5/5** against `574a863^:ROADMAP.md`, independent parser | **exact** |
| 235.2 | 1,419 body lines moved | **1,419**; archive `+1,424 = 5 headings + 1,419` = measured `1424` | **exact** |
| 235.2 | open checkboxes unchanged | raw `6 → 6` | **exact** |
| 235.2 | 216 untouched live sections, 0 changed | 216 untouched, **1** changed — Slice 235's own write-up | **explained** |
| 235.3 | archive `31,013 → 31,001`, −12 | `git show`: 31013 → 31001, numstat `0 12` | **exact** |
| 235.3 | `677 = 217 + 212 + 248` | 217 live · 212 archive · 250 cited − 2 dangling | **exact** |
| 235.3 | `seen.size` unchanged at 217 | archive-minus-live set difference **empty** | **exact** |
| 235 lane 2 | `74 · 242 · 230 · 8`, shapes unchanged | byte-identical, same eight shapes | **exact** |
| 232.1 | NARROW 2 / tense-inclusive 7 / unanchored 17 | 2 · 7 · 17 (18 without the exclusion it records) | **exact** |
| 232.3 | `ff2b623d^` flags exactly 1, `HEAD` flags 0 | **1** (`concepts/cascade.astro`) and **0** | **exact** |
| 234.1 | per-file at `84eb14ca`: 5 files `branch=0`, `check-notes.mjs` `branch=1` | reproduced for all six files at all four commits | **exact** |
| 234.1 | aggregate `0 → 1 → 6 → 5 → 0` | derives from the same per-file table | **exact** |

**232.3's checkout was confirmed to have taken effect before its result was
believed**, which is the step a green red-proof is a defect in: at
`ff2b623d^` the pre-fix `cascade.astro` reads `throws=0`, and the two pages
230.1 excluded by hand (`scale`, `index`) exclude themselves at `parses=0` in
both trees. `git status` empty after restore.

**235.2's live-side arithmetic reconciles once its own convention is applied,
and that was checked rather than accepted.** The item states `3,569 → 2,165`
while the commit holds **2,269** — the gap ENVIRONMENT.md's "read a figure from
THAT COMMIT" bullet exists to catch. It is not that defect: the item declares
the figure is the file *after the move and before this write-up was appended*,
and the difference is exactly the write-up. `3,569 − 1,419 + 15 = 2,165`, and
`2,165 + 104 = 2,269`, with the 104 landing in the one live section the
independent parser reports as changed — Slice 235's own. Stated because the
tell for the real defect is never arithmetic; here the arithmetic AND the
independent section walk agree.

**233 survives on its own terms.** Its two items are `check:claims` cases, and
the gate is the instrument: it reports **`162 documented behaviours verified
live · 3 NOT VERIFIED`**, which is 233.2's stated `161 → 162` landing, and the
gate names the cause of the three itself — *"this browser reports
`(hover: hover) and (pointer: fine) = false`"*, ENVIRONMENT trap 6b's container
property, **not a regression and not to be "restored" to zero**. No finding
against 233.

1. [ ] **236.1 — 234.1's corroborating count does not reproduce as written, and
       it fails by measuring its own explanation. The five files do not read
       `0` under "any `--self-test` mention"; they read `1`, and that `1` is the
       OWES sentence the item is measuring.**

       234.1's central claim is **correct and reproduces exactly** — that is
       stated first so this is not read as a reopen. At `84eb14ca` five files
       read `sentence=1 branch=0` and `check-notes.mjs` reads `sentence=1
       branch=1`, and `git show 84eb14ca -- apps/docs/scripts/check-notes.mjs`
       confirms 42.1 itself adds `if (process.argv.includes('--self-test')) {`.
       Nothing here touches that, or the aggregate, or 229.3's refusal.

       What does not reproduce is the sentence guarding it against a
       narrow-regex artefact: *"Widening the branch predicate to **any**
       `--self-test` mention confirms the other five carried none at 42.1."*

       ```
       for f in apps/docs/scripts/check-{boost,floor,forced-colors,loop-vocab,notes}.mjs \
                packages/core/scripts/check-markup.mjs; do
         printf '%-30s any=%s excl=%s\n' "$(basename $f)" \
           "$(git show 84eb14ca:$f | grep -c -- '--self-test')" \
           "$(git show 84eb14ca:$f | grep -- '--self-test' | grep -vc 'OWES a --self-test')"
       done
       #   the five:        any=1  excl=0
       #   check-notes.mjs: any=3  excl=2
       ```

       The five read **`any=1`, not 0**. The single match is line 15 of each:
       `OWES a --self-test (roadmap 42.3): a detector this easy to fool must
       prove it can fail.` — the very sentence whose truth the item is
       adjudicating. The claim is true only under `excl`, an exclusion the
       published command does not carry.

       **The substance is unchanged, which is why this is a finding about the
       corroboration and not about the conclusion.** Under `excl` the five read
       `0` and `check-notes.mjs` reads `2`, so the widened predicate does
       support "not a narrow-regex artefact" — once the sentence is excluded.

       **This is a recurrence, not a one-off, and that is the reason to file
       it.** 232.1 — two slices earlier, and the item 234 was filed against —
       records exactly this shape about itself: *"One published figure did NOT
       reproduce as written, and the difference is a missing exclusion … it is
       the same class of defect this item exists to fix."* There the excluded
       file was `check-selftests.mjs`, the meta-gate that names the vocabulary
       by definition. Here it is the sentence itself. CLAUDE.md names the
       general form twice — *"an assertion that trips on its own explanation"*
       and *"verifying a removal: assert on structure, never on raw text"* —
       and a corroborating count is where it keeps landing, because the
       corroboration is written last and inherits none of the care the headline
       figure got. That is 192.1's shape a third time: **the defect lands in
       what shipped BESIDE the number.**

       *Accept* — properties, not predicted values:
       - (a) 234.1's widening sentence agrees with what the command above
         actually prints — either by carrying the exclusion, or by recording
         that the unexcluded count is 1 and why that 1 is the sentence.
         **Both close this.**
       - (b) The command sits beside the claim, per 234.1's own criterion (c) —
         this item exists because a corroborating count was published without
         one.
       - (c) 234.1's central claim and its aggregate are left standing. A change
         that reopens either does not satisfy this item.
       - (d) **Finding the distinction not worth drawing is a satisfying
         outcome**, recorded with its reason: the substance holds under `excl`,
         so "the sentence is imprecise and the conclusion is right" is a
         defensible close.

       **Kind of work needed, so rule 4 sorts it correctly: NOT browser-blocked
       and NOT owner-blocked.** It is a `git show` over six files on an
       unshallowed clone plus a markdown edit. No screenshot is evidence for any
       part of it.

2. [ ] **236.2 — the eighth archive sweep moved Slice 229 while `234.1` was
       open and names 229.3's `RECURRENCE HISTORY` as a thing to amend. That
       text now lives only in `ROADMAP-archive.md`, and none of 235.2's five
       Accept criteria could see it.**

       Measured, not inferred:

       ```
       grep -n 'RECURRENCE HISTORY' ROADMAP.md ROADMAP-archive.md
       #   ROADMAP.md:707, 761, 1059   — all REFERENCES, from 234.1 and 232.2
       #   ROADMAP-archive.md:30520    — the section itself, the only copy
       grep -n '^## Slice 229' ROADMAP.md ROADMAP-archive.md
       #   ROADMAP.md:1161      the 3-line pointer
       #   ROADMAP-archive.md:30194   the real body
       ```

       234.1's Accept (a) reads: *"229.3's `RECURRENCE HISTORY` and 232.2's
       closing text each agree with what the per-file command above actually
       prints, or record why the six-file generalisation is preferred anyway."*
       232.2's closing text is live (`ROADMAP.md:1058`). 229.3's is not. So an
       open item's criterion is half-satisfiable in the live file and half only
       by editing the archive — the file `LOOPS.md` rule 4 calls the place "for
       looking a reason UP", from which *"a dispatch decision never comes"*.

       **235.2 is not careless here; the point is that it could not have
       known.** Its five criteria are byte-identity, two-way line accounting,
       citation neutrality via `check:slice-refs`, a raw open-checkbox count,
       and target derivation at move time. All five passed and all five were
       re-verified above. Every one of them is a property of the MOVE. None
       asks the different question — *does anything still OPEN depend on the
       text being moved?* — and `check:slice-refs` cannot answer it either: it
       asks whether a citation **resolves**, and `229.3` resolves fine from the
       archive. Resolving is exactly the wrong question when the criterion says
       *amend*.

       **Base rate, measured before proposing anything (94.11).** Five items are
       open; three are owner- or hardware-blocked. Of the two dispatchable ones,
       **234.1 requires editing archived text and 232.3 does not** — 232.3 cites
       230.1 (also archived) but its Accept (a)-(e) is entirely about building
       and red-proving a detector, so a citation that resolves is all it needs.
       **1 of 2**, and 1 of 5 overall. That is a real rate on a tiny
       denominator, and it is reported as such rather than as a trend.

       **A gate is NOT proposed, and the reason is measured rather than
       stylistic.** The predicate a gate would need — *"does an open item's
       Accept require amending a section this sweep is about to move?"* — is
       semantic: it turns on the difference between `234.1` cited as a reason
       and `229.3` cited as a target, which is the same "checkable shape vs.
       semantic content" line 94.11 draws and `check:wrong-choice` lives on.
       The shape that IS checkable — "an open item names a slice number whose
       body is archive-only" — fires on 232.3 as well, where it is correct
       behaviour, so a gate over it would be red on a healthy state. What is
       cheap and exact is a **sweep-time report**: list the slice numbers the
       target set contains that any still-open item names, and let the wake
       running the sweep read them. That is a line in `roadmap_scope.py`, which
       already parses both the checkboxes and the headings.

       *Accept* — properties, not predicted values:
       - (a) A wake running an archive sweep is told, from the sweep's own
         instrument, which target slices are named by still-open items — or it
         is recorded that the loop prefers to check this by hand and why. Both
         close this.
       - (b) Whatever is decided, **234.1's Accept (a) is reachable**: either
         the archived text is amendable by an explicit note that says so, or
         (a) is restated against text that is live. Leaving a criterion whose
         target a later wake cannot act on without breaking a doctrine is what
         this item is about.
       - (c) The base rate above is **re-measured** at decision time, not
         carried from here — 1 of 2 is a two-item denominator and the open set
         moves every wake.
       - (d) **Finding the premise false is a satisfying outcome**: if editing
         an archived section for a correction is judged fine — the archive is
         markdown, reviewed and diffed, and 235.3 already deleted from it — then
         record that as the standing answer and close this. It is not obviously
         wrong; what is wrong is that no document says either way.

       **Kind of work needed: NOT browser-blocked and NOT owner-blocked.** A
       parse of two markdown files plus a decision recorded in prose.

**NOT VERIFIED, said plainly:** cloud wake — no Podman and no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
**This slice changes no code**: the diff is `ROADMAP.md` and `.roundtable/`
markdown, no shipped artefact, CSS, markup or rendered output moved, and the
docs site renders neither file. Nothing here rests on a rendered image. The one
browser-driven reading quoted — `check:claims` 162 live / 3 NOT VERIFIED — came
from the gate executing in this container, not from an image.

## Slice 235 — Standardize sweep: lanes 1-3 clean a TENTH time, and lane 4's finding is that the sweep's own instrument has never had a file — five runs, one copy, living inside an archived slice. Committing it exposed two owner calls no run could see, and the sweep it enabled exposed three self-referential stubs in the archive (2026-09-01)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 (`grep -n 'P0' ROADMAP.md`
returns only closed slice headings) and GitHub intake **0 open issues**, asked
via the API (`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing to
triage and no `Roadmap · plan` row was recorded. Rule 2: `dispatch_status.py`
read `Standardize 6 / 4 Continue rounds since 2026-08-31 13:03 OVERDUE` →
**Standardize**. Rule 3 (`3 / 3`, also OVERDUE) and rule 4 were not reached.

**Lanes 1-3: a tenth identical clean result.** The ordinal is checked against
the sweep HEADINGS, not incremented from the last write-up — 228's own warning,
and the reason it and 230 differ by one legitimately: 228 says *"an eighth
time"*, 230 says *"a ninth"*, so this is the tenth.

| lane | command | reading | verdict |
|---|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** on 0 pages; 1,433 live inline declarations | clean |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | 74 files · 242 rules · 230 distinct · **8 repeat groups** | clean — no delta |
| 3 report:prose | `npm run report:prose -w docs` | 118 pages, median 748; 9 over corpus, 12 over a family median, **union 14** | all verdicted |
| **4 loop-prose** | `python3 scripts/loops/report_loop_prose.py` | **the finding, below** | not clean |

**Lane 2's delta is zero, which is the whole reading.** All eight groups map
one-to-one onto `LOOPS.md`'s standing table, shapes
`x4(3) x3(3) x3(9) x2(3) x2(3) x2(6) x2(3) x2(3)`, byte-identical to 228's and
230's readings. The joined-control `x4` is still **two** components (money,
quantity), so its stated reopen trigger — a THIRD component — is unmet.

**Lane 3 checked by SET MEMBERSHIP, not by a cite count**, because the obvious
instrument is a dead one and 228.1 already recorded why: grepping each page's
path out of `ROADMAP.md` + `ROADMAP-archive.md` returns hits for all fourteen,
so it reports full coverage whatever the truth is. Re-measured here rather than
assumed — the range across the fourteen is **10 to 194 hits, minimum 10**, which
is exactly the confident-coverage reading that instrument gives on any input;
three of the fourteen have **zero** hits in the live file and are carried
entirely by the archive. The union (data-table, richtext, which-pattern, form, editable-grid,
list-report, calendar, money, combobox, motion, layouts, js-behaviors,
design-language, scale) resolves entirely against **158.1's twelve**, **161.1's
three** and **178.3's** `/concepts/scale/`; nothing is flagged outside those
sixteen.

**Lane 4 of 4 carries the finding, and it is the signal `LOOPS.md` names
verbatim** — *"a file the loop reads every wake accumulating with no cut behind
it"*. The `ratchet` block, read first per the playbook:

```
python3 scripts/loops/report_loop_prose.py
#   ROADMAP.md   15 up   last cut d701e619 (2026-08-30)
```

230.1, one wake ago, read `4 up, last cut d701e619` and concluded *"the signal
lane 4 carried in 228.1 is discharged and has not returned"*. It has returned:
**4 up → 15 up, same last cut.** Rule 4 reads this file top-to-bottom every wake
and it is walking **3,359 lines to find 5 open items**, four of which are
blocked.

**The regrowth cycle is at the highest per-commit rate in the record**, measured
from the sweep commit rather than from its stated after-figure — which is
`ENVIRONMENT.md`'s rule, and 228.1 is the wake that paid for it:

```
git show d701e619:ROADMAP.md | wc -l            # 1,626   (its message says 1,473)
git rev-list --count d701e619..HEAD -- ROADMAP.md   # 15
wc -l < ROADMAP.md                              # 3,359
#   +1,733 over 15 commits = 115.5 lines/commit
```

against 177's and 228.1's recorded cycle rates of 30.4 / 51.0 / 69.5 / 66.6 /
94.2 / 98.0. **Reported as a rate with its n**, per 214.1: 15 commits is a short
cycle and nothing about convergence is concluded from one point.

The other seven files in the dispatcher region were read for a class change and
none had one. `CLAUDE.md` (29 up, never cut) and `DESIGN.md` (22 up, never cut)
are the standing HONEST verdicts — 193.1 executed 167.1's reopen condition on
`CLAUDE.md` and decided *fold nothing, retire the watch*; `ENVIRONMENT.md` and
`LOOPS-archive.md` carry 224.2's verdicts; both archives are out of scope for
167.1's stated reason.

1. [x] **235.1 — DONE 2026-09-01 (cloud wake). The archive-sweep scope
       instrument is a committed script, `scripts/loops/roadmap_scope.py`. Its
       first run found two owner-call items that every previous run of this
       instrument silently could not see.**

       **The Standardize finding, measured, not asserted.** This instrument has
       been run by five wakes and has never had a file — its only source is a
       fenced code block inside an *archived* slice:

       ```
       grep -c "closed slices carrying" ROADMAP.md ROADMAP-archive.md
       #   ROADMAP.md:1   ROADMAP-archive.md:4        -> five runs on the record
       grep -rln 'OPEN=set(); cur=None' --include='*.md' --include='*.py' .
       #   ./ROADMAP-archive.md                        -> one copy of the source
       ```

       So three separate wakes wrote a pointer of the form *"the command is in
       ROADMAP-archive.md, Slice 177, verbatim"* — into the file `LOOPS.md` rule
       4 calls the place "for looking a reason UP", from which "a dispatch
       decision never comes". That is the duplicated-logic lane this loop exists
       for, and `.roundtable/RESUME.md` had already written the trigger, which
       fired: *"if a wake needs this share a third time, commit the script"*,
       after four consecutive hand-offs deferred re-measuring the share. This
       wake needed it and ran the heredoc by hand, which is the fifth.

       *Accept* — properties, not predicted values:
       - The script's figures agree with what earlier wakes published from the
         same instrument, at the same trees — **met**, below.
       - The detector proves it can fail on each recognition it makes, with each
         injection confirmed to have landed — **met**, `--self-test` cases A-D.
       - Anything the parse cannot attribute is reported rather than dropped,
         and the counts are asserted against a raw scan of the file — **met**,
         and it is what found the two owner calls.

       **Reconciled against an independent record before quoting, per CLAUDE.md**
       — the published figures of two earlier wakes, reproduced at their own
       trees by `--rev`:

       ```
       python3 scripts/loops/roadmap_scope.py --rev d701e619^
       #   OPEN: [15, 112] · 15 closed slice(s) carrying 2366 lines · 62.4%
       #   228.1 published exactly these three.                        EXACT

       python3 scripts/loops/roadmap_scope.py --rev e29c7c18^
       #   7 closed slice(s) carrying 1568 lines
       #   targets [213, 212, 210, 209, 208, 201, 200]
       #   214.1 published exactly this count, this line total and this set. EXACT
       ```

       **Where it disagrees with 214.1 it is the tree, not the parse**, and that
       is checked rather than waved past. 214.1 published `OPEN: [15, 112, 211]`
       and `50.8%`; this run reads `[15, 112, 211, 214]` and `49.0%`. Both
       differences are the same fact: 214.1 measured *before* Slice 214's own
       section — carrying its then-open `214.1` checkbox — was written into the
       file, at 3,085 lines. `1568 / 3085 = 50.8%`, and `1568 / 3197 = 49.0%`.
       The carried-lines figure and the target set, which are what a sweep acts
       on, are identical at both.

       **Both of this script's first outputs were wrong, and both were caught
       before use** — CLAUDE.md's base rate, holding again:

       - The self-test's baseline expectation was off by one, because
         `split('\n')` yields a phantom empty line for the file's trailing
         newline and charges it to the last slice. `splitlines()` throughout;
         `total` now equals `wc -l` by construction rather than by a `- 1`.
       - **The reconciliation REFUSED on the real file — correctly.** 19 raw
         `[x]` markers against 17 attributed. The two it could not see are
         `1. [x] OWNER CALL — 0.2.0 release` and `2. [x] OWNER CALL — (a)
         adoption/DX`, both under `## STATE`, a non-slice H2. **Both are closed
         and nothing is being lost today**, said plainly. What matters is the
         shape: an OPEN item there would be invisible to a slice-keyed pass
         while rule 4 is asking for *"the OLDEST still-open item"* — the exact
         defect CLAUDE.md's storage doctrine records `STATUS.md` shipping for
         weeks, where "OWNER CALL — direction" was a stated release blocker its
         parser's numeric-id requirement hid. They are now printed on every run,
         and an open one is flagged `⚠ OPEN and unattributed`.

       **`--self-test`, red-proved by injection with each injection confirmed to
       have landed before its result was believed:**

       - **A — openness.** Re-open one `[x]` → `[ ]` in a closed fixture slice;
         injection asserted present, then the open set must move `{}` → `{2}`
         and the box counts `[0,2]` → `[1,1]`.
       - **B — attribution (165.1's bug).** Wedge a `## Objective` H2 with two
         body lines between two slices; the per-slice body counts must not move
         at all. A "nearest preceding `## Slice`" parse fails this while looking
         entirely correct.
       - **C — the unattributed lane.** Add an OPEN `OWNER CALL` under a
         `## STATE` H2; it must stay out of every slice figure AND come back as
         exactly one stray flagged open.
       - **D — the reconciliation itself.** Hand `reconcile()` an empty stray
         list for the same fixture; it must refuse. Without D the check would
         agree with whatever its caller passed, which is CLAUDE.md's named
         defect — *"a reconciliation that cannot see past its own caller is a
         detector that cannot fail"*. Each case exits non-zero with the reason
         if the detector stops discriminating.

       **Not a gate, deliberately.** Every figure it prints is legitimately
       non-zero on a healthy day — a sweep is a cadence, not an invariant — so a
       gate over this predicate would fail the build on a correct state. 94.11's
       test, applied before writing one.

       **NOT VERIFIED, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. This item adds
       one Python script that renders nothing and is imported by nothing — no
       markup, no CSS, no docs page — so nothing in it rests on a rendered image.

2. [x] **235.2 — DONE 2026-09-01 (cloud wake). Eighth archive sweep: five
       closed slices moved, `ROADMAP.md` 3,569 → 2,165 lines. And the
       verification parser found a pre-existing defect in the archive that no
       previous sweep's checks could see.**

       Scope from the script committed above, **re-derived at move time** rather
       than read off this entry — which is the first Accept criterion, and it
       moved: Slice 235 itself became open between filing and moving, so `OPEN`
       gained `235` and the share fell to 39.8% as this write-up landed in the
       denominator. The target set and carried lines did not change.

       ```
       python3 scripts/loops/roadmap_scope.py     # at move time
       #   OPEN: [15, 112, 232, 234, 235]
       #   5 closed slice(s) carrying 1419 lines here; 0 already in the archive
       #   closed-history share: 1419/3569 = 39.8%
       #   targets: [233, 231, 230, 229, 228]
       ```

       *Accept* — properties, not predicted values. **All five met:**
       - The target set is DERIVED from the checkboxes at move time, never read
         off this entry — **met**, and it is what caught `235` joining `OPEN`.
       - Every moved section is byte-identical in the archive, verified against
         the git blob rather than against whatever performed the move — **met**.
       - The line accounting reconciles in BOTH directions — **met**.
       - `check:slice-refs` reports the same figures either side — **met**.
       - The open-checkbox count is unchanged across the move, counted raw —
         **met**, 6 before and 6 after.

       **Swept: `ROADMAP.md` 3,569 → 2,165; `ROADMAP-archive.md` 29,589 →
       31,013.** Five slices — 233, 231, 230, 229, 228 — moved verbatim in the
       order they held in the live file, each leaving the standing three-line
       pointer.

       **The line accounting reconciles exactly, in both directions**, which is
       what a move owes over a rewrite: live loses `1,419` body lines and gains
       `5 × 3 = 15` pointer lines = **−1,404**; archive gains 5 headings plus
       the same 1,419 body lines = **+1,424**. Both match the measured deltas to
       the line.

       **Lossless, verified by an independently written parser against the git
       blob** — not against the dict the move built, which would be
       self-consistent by construction. That parser splits on the heading line
       and keys by heading text, where the move script walked line spans:

       ```
       5/5 moved sections byte-identical to HEAD:ROADMAP.md
       216 untouched live sections, 0 changed
       228 pre-existing archive sections, 0 changed
       5/5 pointers exactly the standing 3-line form
       raw checkboxes  before: 6 open / 20 closed   after: 6 open / 9 closed
       ```

       **Citation-neutral, measured rather than asserted** — run against the two
       files either side of the move, every figure identical:

       ```
       npm run check:slice-refs -w docs
       # before: 464 citation(s) checked (249 cited, 2 known-dangling), 217 slice numbers
       # after:  464 citation(s) checked (249 cited, 2 known-dangling), 217 slice numbers
       ```

       **The post-sweep 0% was checked before being believed**, per CLAUDE.md's
       *a 0% is a defect until proven otherwise*. `roadmap_scope.py` now reads
       `0 closed slice(s) carrying 0 lines`, and the corroborating reading is
       the same command with the floor removed: `--min-lines 0` reports **212
       closed slices carrying 636 lines, 212 of them already in the archive** —
       i.e. every one is a three-line pointer sitting under the `>6` floor, not
       a section the parse failed to see.

       **The figures above are the file after the MOVE and before this write-up
       was appended to it** — 209.1's correction, and `ENVIRONMENT.md`'s rule
       that a sweep's stated after-figure predates its own write-up. The
       post-commit figure is in the loop log row and in `.roundtable/RESUME.md`.

       **A pre-existing defect the verification found, filed rather than fixed
       here — see 235.3.** The independent parser refused to build its index at
       all: `AssertionError: duplicate heading: ## Slice 24`. Three slice
       numbers — **17, 23, 24** — each head TWO sections in `ROADMAP-archive.md`,
       and in every case the second is a three-line **pointer into the file it
       is already in**. An earlier sweep moved a live entry that had already been
       reduced to a pointer. This sweep cannot reproduce it: the `>6 lines` floor
       excludes a pointer by construction, which is what that floor is for.

       **NOT VERIFIED, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. This is a
       markdown-only move — no rendered surface changes, and the docs site does
       not render either file — so nothing in this item rests on a rendered
       image.

3. [x] **235.3 — DONE 2026-09-01 (cloud wake). The three self-referential
       pointer stubs are gone, and `check:slice-refs` now asserts uniqueness in
       the archive too — red-proved against the real defect, not only against an
       injection.**

       `ROADMAP-archive.md` carried three self-referential pointer stubs: slices
       17, 23 and 24 each headed two sections there, the second being
       `Closed — archived verbatim in ROADMAP-archive.md.` inside
       `ROADMAP-archive.md`.

       Found by 235.2's verification parser crashing on a duplicate key, not by
       looking for it. The live file's own pointer for each of the three is
       correct and stays; what is wrong is the extra stub in the archive, which
       makes a slice number resolve to two sections in the file that exists so a
       citation can be looked up.

       ```
       grep -n '^## Slice 24 ' ROADMAP-archive.md
       #   6035   the real 183-line body
       #   13815  a 3-line pointer into this same file
       ```

       **`check:slice-refs` does not see this and passes**, which is worth
       stating precisely rather than as a gate proposal: its "each heading one
       section" assertion reads **217** — the live file's slice count — so the
       archive's duplicates are outside what it checks.

       *Accept* — properties, not predicted values. **All four met:**
       - The three stubs are removed and every remaining slice number heads
         exactly one section in `ROADMAP-archive.md`, counted raw — **met**.
       - The real body of each of 17, 23 and 24 is byte-identical afterwards,
         verified against the git blob — **met**.
       - `check:slice-refs` reports consistent figures either side — **met**,
         with one figure that MOVED by design and is accounted for below.
       - Whether this warrants extending a gate is decided by measuring the base
         rate first (94.11) — **met, and the answer is yes.**

       **The deletion took the stubs and nothing else**, checked against the git
       blob by an independently written span parser rather than against the
       script that performed it:

       ```
       archive 31,013 -> 31,001 lines   (3 stubs x 4 lines = -12, exact)
       before 233 sections, after 230; every kept section byte-identical, in order
       3 sections removed — exactly the three stubs, named
       Slice 17 / 23 / 24: 1 real section before -> 1 after, identical each
       slice numbers heading >1 archive section: {}
       ```

       Deleting from this file is the operation whose history includes losing
       7,307 lines to a silent case-collision overwrite, which is why the check
       is the point rather than a formality.

       **The gate was extended, and the base rate is why that is not ceremony.**
       `check-slice-refs.mjs` ran its uniqueness loop over `ROADMAP.md` alone,
       with a header arguing that was sufficient because every archived slice
       leaves a live pointer stub. **That argument holds for CITATIONS and does
       not hold for UNIQUENESS** — nothing looked at the archive's own headings,
       so nothing could see three violations sitting in it. The loop now runs
       over both files. Base rate for the added half at the moment it was
       written: **3 of 233 archive sections**, false of the other 230.

       **Red-proved twice, and the second is the one that matters** — against
       the real defect rather than a synthetic one:

       - **By injection.** A second `## Slice 23` section appended to the
         archive; injection confirmed present first (`grep -c '^## Slice 23 '`
         → **2**), then `slice-refs check FAILED — 1 of 677`, naming
         `slice 23 heads exactly one section in ROADMAP-archive.md`. File
         restored and diffed identical to the byte copy.
       - **Against `HEAD`'s own archive**, i.e. the file as it stood before this
         item: injection confirmed (`Slice 24` → **2** sections), then
         **`FAILED — 3 of 677`**, naming 24, 17 and 23. The gate goes red on the
         defect that was actually there, and green on the fixed file.

       **One reported figure moved, by design, and it is accounted for exactly
       rather than left to be re-derived:** `464 → 677` assertions. That is
       `217` live uniqueness checks + `212` archive uniqueness checks (new) +
       `248` citation checks — and the citation count moved `249 → 250` because
       the gate's own new header names `235.3`, which is CLAUDE.md's
       "an assertion that trips on its own explanation" arriving harmlessly:
       the citation resolves, because this item exists. `seen.size` is unchanged
       at **217** — every archive slice number is also a live one, set
       difference empty, so the union did not grow.

       **Deliberately not folded into 235.2.** Two edits to this file pair in one
       commit — a 1,419-line move and a deletion — is what CLAUDE.md's bulk-edit
       rule counsels against, and the destructive precedent is on this exact
       file. Separate round, separate verification.

       **NOT VERIFIED, said plainly:** no Podman and no `localhost:8081` here, so
       the 1440/390 light-and-dark screenshot lane could not run. This item is a
       build-time gate and markdown the docs site does not render — nothing in
       it rests on a rendered image.

## Slice 234 — 232.2's closing measurement is wrong about its own headline: the defect was introduced by 42.1, the commit that WROTE the sentence, and both dispatchers confirmed the opposite from the same single-file probe (2026-08-31)

**Provenance, because it is what makes this admissible rather than a
re-litigation.** A fourth cloud wake dispatched rule 4 on `232.2` — the oldest
dispatchable item, the three older ones being owner- or hardware-blocked — and
lost the Step 0c race to `606edf88`. Its pre-push `git fetch origin main` showed
`0c3fd9ea..84aa5b93` with 232.2 already closed. **The item is not reopened.** What
is filed is the one thing its independent derivation holds that the landed text
does not, and it is a refutation of a sentence the landed text asserts twice.

**Both dispatchers re-derived the premise and both confirmed it. The premise is
false.** That is the finding: not that anyone was careless, but that the
confirming instrument was the same one in both cases, and it cannot see the
counterexample.

1. [ ] **234.1 — the introducing commit is `84eb14ca` (42.1), not `443348e2`
       (42.3). 42.1 gave `check-notes.mjs` its `--self-test` branch in the SAME
       commit as the header claiming it owed one, so 1 of 6 files was defective
       before "the commit that paid the debt" existed.**

       229.3's landed `RECURRENCE HISTORY` says *"At 42.1 the sentence was
       TRUE"*, its table row reads *"wrote the sentence into 6 files"*, and it
       concludes *"the defect was introduced by the commit that PAID the debt"*.
       232.2's own text says the same. **Five of six files behave that way. The
       sixth does not**, and it is the earliest.

       **Why two independent re-derivations both confirmed it.** Both ran the
       second instrument against **`check-floor.mjs` alone** — the landed text
       publishes exactly that pair of commands — and generalised the result to
       six files. `check-floor.mjs` is one of the five. Run per file:

       ```
       git fetch --unshallow origin     # ENVIRONMENT.md §2 — every figure here is history
       for r in 84eb14ca 443348e2 f1be2485 5754ea02; do
         for f in apps/docs/scripts/check-{boost,floor,forced-colors,loop-vocab,notes}.mjs \
                  packages/core/scripts/check-markup.mjs; do
           printf '%s %-42s sentence=%s branch=%s\n' "$r" "$f" \
             "$(git show $r:$f 2>/dev/null | grep -c 'OWES a --self-test')" \
             "$(git show $r:$f 2>/dev/null | grep -cF "argv.includes('--self-test')")"
         done; echo
       done
       git show 84eb14ca -- apps/docs/scripts/check-notes.mjs | grep -E '^\+.*argv\.includes'
       ```

       At `84eb14ca` five files read `sentence=1 branch=0` and **`check-notes.mjs`
       reads `sentence=1 branch=1`**; the diff confirms 42.1 itself adds
       `if (process.argv.includes('--self-test')) {` to that file. Widening the
       branch predicate to **any** `--self-test` mention confirms the other five
       carried none at 42.1, so this is not a narrow-regex artefact.

       **What does NOT change, said first so the correction is not over-read.**
       The aggregate is unaffected: walking all **1,749** first-parent commits of
       `main` and counting files in the defective state gives
       `0 → 1` (42.1) `→ 6` (42.3) `→ 5` (220, by deletion) `→ 0` (229.2) —
       **one entry, zero recurrences**, exactly as 232.2 reported. Regrowth is
       **0 of 24** by this scope (every `check-*.mjs` created between 42.3 and
       229.2), against the sibling walk's `0 of 8` over heuristic gates — different
       denominators, same zero. **229.3's refusal stands and is not reopened.**

       **What changes is a sentence the refusal leans on rhetorically**: *"the
       single introduction was a same-day side effect of a fix"*. It was not a
       side effect of the fix. The debt was **false from the moment it was
       written**, in 1 of 6 files, twenty minutes and two commits earlier.

       **This correction was reached a third time and died twice before this.**
       The `233.1` hand-off says the sentence entered at 42.1 *"where **5 of 6**
       instances were true when written"* — the same reading, from a 316-commit
       walk, hours earlier. `grep -n '5 of 6' ROADMAP.md` finds nothing about this
       defect: it lived only in `.roundtable/RESUME.md`, which is rewritten
       wholesale every wake, and the durable record went on asserting the
       opposite. **169.3's lesson on live data** — a correction written into the
       handover is a correction that dies there.

       *Accept* — properties, not predicted values:
       - (a) 229.3's `RECURRENCE HISTORY` and 232.2's closing text each agree with
         what the per-file command above actually prints, **or** record why the
         six-file generalisation is preferred anyway. Both close this.
       - (b) The aggregate figures (one entry, zero recurrences) are stated
         separately from the attribution, so a reader can see which part the
         correction touches. Finding the distinction not worth drawing is a
         satisfying outcome, recorded with its reason.
       - (c) Whatever is decided, the per-file command sits beside the claim —
         this item exists because a one-file probe was quoted over six.

       **Requires an unshallowed clone** (`git fetch --unshallow origin`); no
       browser, no owner. Dispatchable by any wake.

## Slice 233 — 231.2's new prose asserts two computed facts and nothing executes either; found by the THIRD independent build of 231.2 (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 232 — Objective grill of Slices 229, 230, 231: 230 and 231 survive entirely, and both findings are against how 229's refusal RECORDED its numbers, not against the refusal (2026-08-31)

**Dispatcher trace, cloud wake.** Rule 1: no open P0, and GitHub intake **0 open
issues** (`list_issues` OPEN → `totalCount: 0`), so Step 1 had nothing to triage.
Rule 2: `Standardize 1 / 4`, no drift flagged. Rule 3:
**`Objective 3 / 3 slices OVERDUE [229, 230, 231]` — dispatched.** Full report:
`.roundtable/grill-objective-229-230-231-2026-08-31.md`.

**Arming set NOT narrowed.** **40** prior grill reports, read **from the HEAD
blobs**; none names 229, 230 or 231. All three genuinely un-grilled. Read from
the blob rather than the tree for 229's own stated reason — the working-tree form
matches this grill's own heading.

**This wake was the LOSING dispatcher of two Step 0c collisions, and that is
recorded because it is the evidence, not an excuse.** It dispatched rule 4 onto
**229.3**, built the refusal and ran the gates green; the mandated pre-commit
`git fetch origin main` found **origin/main 10 commits ahead** with 229.3, 229.4,
229.5, 230 and 231 all landed. It re-dispatched onto **231.2**, built that and
ran the gates green; the next pre-commit fetch found **2 more commits** — 231.2
taken as well. Both discarded per Step 0c, then rule 3 was OVERDUE and this grill
is the third dispatch.

**Both times the loser reached the same substantive answer as the winner**, which
is the first direct *measurement* of Step 0c's central claim rather than an
argument for it:

| item | winner | loser, independently | agreed? |
|---|---|---|---|
| 229.3 | refuse the assertion | refuse the assertion | **yes** |
| 231.2 | keep `--elevated`, document it | keep `--elevated`, document it | **yes** |
| 231.2 numbers | `2 → 5`, low set `17 → 16` | `2 → 5`, low set `17 → 16` | **yes** |
| 231.2 denominator | 89 pairs vs 88 names | 89 pairs vs 88 names | **yes** |

**And it is worse than two, because the PREVIOUS hand-off records the same
loss.** `.roundtable/RESUME.md` at `d32b758c` says that wake dispatched rule 4 on
229.3 and *"did the whole item — measured the base rate, built both candidate
predicates as a throwaway probe, red-proved them by injection"* before its own
pre-commit fetch showed 229.3 already landed. So on 2026-08-31, **229.3 was built
to completion three times by three wakes and landed once**, and 231.2 twice and
landed once. That is not inferred from the log; it is written in three hand-offs,
this one included.

**So redundant coverage paid once and cost at least three times over, in one
day.** It paid in finding 232.1, a defect in a number 229.3 published that only
an independent derivation was ever going to surface. Step 0c's refusal of *"the
local session stops dispatching"* rested on one prior instance; this is the
second time the mechanism has paid, and the first time its cost has been counted
on the same day.

**Not filed as an item** — Step 0c's decision is *accept collisions*, taken with
the cost named, and the decision is the owner's. What is new is only that the
cost is no longer hypothetical: the accepted figure is *"up to one wake's work,
discarded"* and the measured figure for one day is **at least three wakes' work**.
Recorded for the owner in `RESUME.md`'s Direction block, which is the one place
the loop can say so; no fourth option is proposed here, because Step 0c already
records three refusals with a measured reason each and inventing a fourth to fill
the gap is the ceremony 94.11 refuses.

**Slice 230 survives entirely, including a red-proof re-run by this grill.** The
population claim verifies from the blobs — 8 pages read a source file, `scale`
and `index` parse nothing, so the population is **6** and `cascade` threw **0**
before `ff2b623d` and **1** after, making it the sole one-off. `tokens.min.css`
carries **0** comments, so no stripping step was needed. The built table still
renders **5** rows. And case C, the discriminating red-proof, was re-run
independently: injecting `--bo-z-toast: 1600 → 1700` in the source only, with the
injection confirmed present first, fails the build at **exit 1** with **count 5
on both sides** — so a `length < 5` floor would have passed, which is exactly the
claim. Injection reverted, `git status` confirmed empty.

**It also reconciles a figure that reads like a contradiction.** The previous
hand-off recorded *"6 of 8 throw"* while 230 says *"5 of 6"*. Both are right and
count different denominators: 6 of the 8 readers throw (cascade now among them),
and 5 of the 6 *parsers* threw before the fix.

**Slice 231 survives and is corroborated by an independent derivation** — this
wake built 231.2 in full without having read the winner's version and reached the
same decision on the same evidence, including the same 89-vs-88 denominator
correction. No finding against it.

1. [x] **232.1 — DONE 2026-08-31 (cloud wake). Every published figure
       reproduced exactly; 229.3 now carries the tense-inclusive count, the
       command that produces it, and a correction to its red-proof table that
       the replay turned up. The refusal stands and is strengthened. The record
       is at the end of this item.** The finding as filed:
       **229.3's BROAD base rate of 2 is an artefact of `owes?\b` not
       matching `owed`. The tense-inclusive count is 7, and the 5 extra firings
       are exactly the five files 229.2 corrected — the set 229.3's own Accept
       names as the ones it must not fire on.**

       **The refusal is NOT overturned, and that is stated first so this is not
       read as a reopen.** 229.3's decisive argument is its third injection row —
       a *reworded* stale claim leaves both predicates green — and that argument
       is independent of any base rate. Refusing was right. What is wrong is a
       published number beside it, which CLAUDE.md's "a number you report is
       load-bearing" makes worth a slice on its own; 192.1's shape again, the
       defect landing in what shipped BESIDE the carefully-proved claim.

       229.3 publishes this as its reproduction command:

       ```
       grep -rniE 'owes?\b' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs'                    # 2, both correct prose
       ```

       `owes?\b` is `owe` + optional `s` + a word boundary, so it **cannot match
       the past tense** — the boundary fails against the `d`:

       ```
       printf 'this line used to say it was owed\n' | grep -cE 'owes?\b'      # 0
       printf 'this line used to say it was owed\n' | grep -cE 'owe[sd]?\b'   # 1
       ```

       Past tense is not an edge case here — **it is the wording 229.2's own fix
       used.** All five corrected headers read *"the debt is PAID, and this line
       used to say it was owed"*. So the whole-word count is **7**, not 2:

       ```
       grep -rlwE 'owes|owed' apps/docs/scripts packages/core/scripts \
         --include='check-*.mjs' | grep -v check-selftests.mjs | wc -l    # 7
       ```

       **BROAD as 229.3 defines it — "`owes` within 120 chars of `--self-test`
       or `@heuristic`, either order" — fires on all five once the tense is
       included.** The gap is **18 characters**; they sit on adjacent lines,
       which is also why a line-based `grep` reports nothing and a multiline test
       reports five:

       ```
       node -e "const s=require('fs').readFileSync(process.argv[1],'utf8');
         console.log(/owed[\s\S]{0,120}--self-test|--self-test[\s\S]{0,120}owed/.test(s))" \
         apps/docs/scripts/check-floor.mjs      # true, and true for all five
       ```

       So BROAD's complete false-positive set is **7, not 2** — and the five it
       gains are precisely the ones 229.3's Accept forbids it firing on. The
       reason is the sharper form of the same lesson: **a gate reading prose
       about self-tests trips on the correction that fixed the thing it exists to
       catch**, because explaining a paid debt requires naming the debt. That is
       CLAUDE.md's *"verifying a removal: assert on structure, never on raw
       text"*, recorded three times about a removal ASSERTION and here killing a
       proposed GATE.

       **Widening the word is worse, and that was measured too.** `owe[sd]?\b`
       unanchored returns **17** files, because it matches inside *allowed* (9),
       *windowed* (7), *showed* (3), *followed*, *swallowed*, *overflowed*,
       *narrowest*, *slowest*, *lowest*. Only `-w` gives the honest 7.

       *Accept* — properties, not predictions:
       - 229.3's BROAD figure either carries the tense-inclusive count with the
         command that produces it, or records that the published 2 was measured
         with a regex blind to `owed` and says what the complete set is. **Both
         close this.**
       - The refusal itself is left standing. A change that reopens it does not
         satisfy this item — the third injection row is untouched by any of it.

       ---

       **RESOLUTION (2026-08-31, cloud wake). Both Accept bullets are satisfied
       by the same edit: 229.3 now carries the tense-inclusive count AND says
       the published 2 was measured with a regex blind to `owed`.**

       **Every figure this item published was re-run before anything was
       edited** — the premise is a prior wake's measurement, so re-checking it
       is part of the criterion, not a courtesy. All reproduce:

       | claim | re-run |
       |---|---|
       | NARROW/published count is 2, both correct prose | **2** — `check-resume-charter`, `check-resume-slice-ids` |
       | `owes?\b` cannot match `owed` | `0` vs `1` for `owe[sd]?\b`, on the same line |
       | tense-inclusive whole-word count | **7** |
       | the 5 extra are 229.2's corrected files | **5** headers carry *"used to say it was owed"* |
       | BROAD's multiline test fires on all five | **true** on all five |
       | 15 heuristic gates carry a `--self-test` branch | **15**, re-derived from the branch test |

       **Reconciled against an independent instrument before being quoted.**
       The 7 was produced twice by different means — `grep -rlwE` over the
       filenames, and a Node pass applying BROAD's actual 120-char proximity
       predicate to the 15 branch-carrying files. Both return the same seven,
       and all seven are inside the 15, so the false-positive set is not
       inflated by files the proposal would never have walked.

       **One published figure did NOT reproduce as written, and the difference
       is a missing exclusion.** This item states that unanchored `owe[sd]?\b`
       returns 17 files. Run as written it returns **18**; it returns 17 with
       the `grep -v check-selftests.mjs` the 7-count command carries and the
       17-count sentence does not. The excluded file is the meta-gate, which
       names this vocabulary by definition. Recorded rather than quietly
       adjusted — it is the same class of defect this item exists to fix.

       **The replay found a SECOND defect in the same table, which is why this
       took a replay rather than an edit.** 229.3's red-proof reads
       `NARROW 0 BROAD 0` on its third row. Rows 1 and 2 are counts over the 15;
       row 3 is *"did it fire on the injection"*. As a count it is **2** — the
       reworded sentence contains no `owe` word, so BROAD's two standing false
       positives are still there and cannot go anywhere. The `<- both BLIND`
       annotation carries the meaning, so the refusal is unaffected, but the
       number as printed is wrong in the same way the base rate was.

       **And the correction sharpens the refusal rather than weakening it.**
       Under the tense-inclusive predicate the BROAD column reads **7 / 7 / 7**
       — flat across the baseline and both injections — because the red-proof's
       chosen injection site, `check-floor.mjs`, is itself one of the seven
       false positives. So the corrected BROAD not only costs 3.5x the false
       positives; on this test it discriminates nothing at all. 229.3's
       decisive third row is untouched by any of this, and **the refusal is
       explicitly left standing.**

       **Method note, since the replay is itself an instrument.** The injections
       were done in memory — the file is read, the sentence spliced into the
       string, the predicate applied to the string — so no revert could be
       missed. Each mutated string was asserted to CONTAIN the injected sentence
       before it was measured (a green red-proof is a defect in the injection
       until proven otherwise), and the file on disk was asserted byte-identical
       afterwards. The replay is also case-INsensitive, as 229.3 measured it: a
       case-sensitive run reads row 2 as `BROAD 2`, not 3, because the injected
       sentence says `OWES`. That discrepancy was chased down rather than
       averaged over — it is the difference between reproducing a measurement
       and merely getting a similar number.

       **Not verified, said plainly:** cloud wake — no Podman and no
       `localhost:8081`, so the 1440/390 light-and-dark screenshot lane could
       not run. **Nothing here is a code change**: the diff is `ROADMAP.md` and
       the loop-log files only, and no shipped artefact, CSS, markup or rendered
       output moved. Nothing in this item rests on a rendered image.

2. [x] **232.2 — DONE 2026-08-31 (cloud wake). The recurrence history 229.3
       never measured: the defect was
       introduced BY the commit that paid the debt, and has recurred zero times
       since.**

       229.3 rests its ratchet refusal on a base rate of 0 *today*. It never asks
       how often the defect has actually appeared, which is the question a
       ratchet is for. Measured by the losing dispatcher, two independent
       instruments, on an unshallowed clone:

       ```
       git log -S'OWES a --self-test' --format='%h %cs %s' --name-only \
           -- apps/docs/scripts packages/core/scripts        # exactly 3 commits
       ```

       | commit | date | what it did | seen by |
       |---|---|---|---|
       | `84eb14ca` 42.1 | 2026-08-19 | wrote the sentence into **6** files | pickaxe |
       | `443348e2` 42.3 | 2026-08-19 | added the branches — **the claim becomes false** | second instrument only |
       | `f1be2485` 220 | 2026-08-30 | deleted `check-boost.mjs`, the sixth file | pickaxe |
       | `5754ea02` 229.2 | 2026-08-31 | corrected the remaining five | pickaxe |

       **At 42.1 the sentence was TRUE**, which the pickaxe structurally cannot
       see — it finds where the SENTENCE changed, and `443348e2` changed only the
       branch. The instrument that sees it tests sentence AND branch together:

       ```
       git show 84eb14ca:apps/docs/scripts/check-floor.mjs | grep -c "argv.includes('--self-test')"   # 0
       git show 443348e2:apps/docs/scripts/check-floor.mjs | grep -c "argv.includes('--self-test')"   # 1
       ```

       **So the defect was introduced by `443348e2`, titled *"42.3: all seven
       heuristic gates now prove they can fail"* — the commit that paid the
       debt.** It shipped the self-tests and left five sentences saying they were
       owed. One introduction, zero recurrences in the twelve days to 229.2.

       That is the ratchet argument answered on its own terms rather than by
       today's base rate: a ratchet guards recurrence, and the measured
       recurrence rate over the whole history is zero.

       **`check-boost.mjs` is the sixth file and is resolved, not filed** — it
       left the defective state by deletion in Slice 220's htmx-4 migration, not
       by correction, which is why 229.2 corrected five.

       *Accept* — a property: the recurrence history is recorded in 229.3's
       vicinity with the commands above, **or** it is recorded that the loop
       prefers the today-base-rate framing and why. Both close this; finding the
       history irrelevant to the decision is a satisfying outcome.

       **Requires an unshallowed clone** (`git fetch --unshallow origin`) — every
       figure here is a history measurement, and ENVIRONMENT.md §2 says they are
       silently 50x wrong without it.

       ---

       **CLOSED by the first arm.** The history now sits inside 229.3 itself,
       under **RECURRENCE HISTORY**, with both instruments and their commands
       beside it — as a paragraph, not a pointer, for 167.2's reason.

       **Every figure re-derived on an unshallowed clone rather than carried
       across**, per this item's own closing warning:
       `git rev-parse --is-shallow-repository` → **false**; the pickaxe returns
       exactly the three commits claimed, and **`443348e2` is confirmed absent
       from that list**, which is the entire point of needing a second
       instrument; `check-floor.mjs`'s branch count reads **0** at `84eb14ca`
       and **1** at `443348e2`. Nothing moved, so the item's own measurements
       are confirmed rather than merely quoted.

       **The refusal is untouched and better supported**, which is the outcome
       this Accept was written to allow: a ratchet guards recurrence, measured
       recurrence is zero, and the one introduction was a same-day side effect
       of the commit that paid the debt.

       **Its sibling reading is recorded too, because it is a different
       instrument reaching the same verdict.** A third dispatcher's 316-commit
       walk measured **regrowth at 0 of 8** — eight new heuristic gates were
       authored while six sibling headers still carried the stale sentence, and
       none copied it. Recurrence and regrowth are not the same question; both
       read zero, which is why no wake has needed to reopen 229.3.

3. [ ] **232.3 — 230.1's refusal to gate its predicate misapplies 94.11, and
       94.11's own test is what refutes it. Filed by a THIRD dispatcher on the
       same armed set; this grill's §B records "no finding against 230".**

       Provenance first, because it is what makes this admissible rather than a
       re-litigation: a third cloud wake dispatched rule 2 on the same flagged
       drift from `e995891`, built its own `cascade.astro` fix, and lost the Step
       0c race to `d32b758c`; re-dispatching, it drew rule 3 and independently
       grilled the same armed set, losing a **second** race to `dbc41ae2`. Its
       other finding — the 89-vs-88 denominator — **duplicates** what this grill's
       §C already records from two dispatchers, and is dropped rather than
       re-filed. This one does not appear in any landed document.

       **The refusal.** 230.1 fixed the unasserted parse and then declined a gate:
       *"the population is now 6 of 6, so a gate over this predicate would be
       uniformly true and is refused on roadmap 94.11's own test: ceremony, not a
       detector."*

       **94.11's test is about DISCRIMINATION, not today's headcount.** Its
       predicate was refused because it stayed true *under injection* — the
       red-proof injected `letter-spacing: 7px` and the detector still reported
       **0 unexplained**. A detector handed the defect and still reporting clean is
       ceremony. Applied properly here the same test **passes**, and no synthetic
       injection is needed because the defect is in this repo's history:

       ```
       git checkout -q ff2b623d^ -- apps/docs/src/pages
       for f in $(grep -rlE "readFileSync|import\.meta\.glob" apps/docs/src/pages --include=*.astro | sort); do
         fm=$(awk '/^---$/{c++} c==1' "$f")
         echo "throws=$(echo "$fm" | grep -c 'throw new Error') parses=$(echo "$fm" | grep -cE 'matchAll|\.match\(|\.split\(') $f"
       done
       git checkout -q HEAD -- apps/docs/src/pages
       ```

       | tree | flagged by `parses > 0 && throws == 0` |
       |---|---|
       | `ff2b623d^` (pre-fix) | **exactly 1** — `concepts/cascade.astro` |
       | current `HEAD` | **0** |

       **Zero false positives, and no exemption map needed.** `scale.astro` and
       `index.astro` — the two pages 230.1 excluded *by hand* as byte-length-only —
       exclude themselves at `parses=0`. The distinction 230.1 reached by reading
       eight files and reconciling a disputed denominator, the detector reaches
       mechanically.

       **The counter-evidence, carried rather than omitted.** The loop found this
       without a gate (227.1 spotted it, 230.1 fixed it), and the population has
       been **static at 8 for 9 days** after growing 1 → 8 in ten
       (`git log -S'readFileSync'` / `-S'import.meta.glob'`, first appearance per
       page, on an unshallowed clone). A gate's value is about the **9th page**, so
       this is **not urgent and not a P0**. What it is not, is ceremony:
       `cascade.astro` gained its parse on 2026-08-22 and shipped unasserted for
       those same 9 days, read past by three wakes.

       *Accept* — properties, not predicted values:
       - (a) The gate's verdict on the CURRENT tree agrees with what the tree
         carries, measured rather than assumed.
       - (b) Red-proved against the REAL pre-fix tree (`ff2b623d^`), not only a
         synthetic injection, with the checkout confirmed to have taken effect
         before the result is believed.
       - (c) It carries `@heuristic` and a working `--self-test` with a
         `process.argv` branch. Recognising "derives rendered content from a parse"
         is a recognition problem, and this population was read as **6** and as
         **8** by careful passes on the same day.
       - (d) The byte-length-only exclusion is MECHANICAL, not an exemption list.
         Any page exempted by name carries a reason, per `check:wrong-choice`.
       - (e) **Finding the premise false is a satisfying outcome**: if the detector
         cannot be written without an exemption map naming more files than it
         catches, record that and refuse the gate on the measurement.

## Slice 231 — Polish round on `component/alerts`: the reconciliation is a NO-OP, and the sweep that surrounded it found one shipped variant with no recorded reason anywhere (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 230 — Standardize sweep: lanes 1-4 clean a ninth time, and the drift carried for three wakes was a genuine one-off — 5 of 6 parsing pages already asserted (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 229 — Objective grill of Slices 222, 226, 227, 228: every decision survives, the best candidate finding was already gated, and the one mirror no gate can see is fixed (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 228 — Standardize sweep: lanes 1-3 clean an eighth time, and lane 4 carries the finding again — the archive sweep is due a SEVENTH time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 227 — Polish round 1 on `component/icon`: a stale count that was also a DIVISOR (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 226 — the fixed `check:po-app`, run in a cloud container for the first time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 225 — Objective grill of Slices 218, 219, 223, 224: a citation that quoted its own re-run command into permanence, and everything else held (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 224 — Standardize sweep: three of four lanes clean, and the fourth found a stale trap in the file Step 0 reads every wake (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 223 — owner call: move the shipped htmx integration and both example apps to htmx 4, dropping `apps/docs`'s boosted navigation in the process (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 222 — `check:po-app` after 211.1: the previous wake's open question, answered by measurement — 2 of 19 becomes 1 of 19 here, and 19 of 19 on CI (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 221 — Owner direction: pin htmx to 4, and plan the framework update. Slice 114's refusal is SUPERSEDED, and its own reopen condition is half-met (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 220 — Polish round on `breadcrumb`: the count-bearing cite class pays out a second time, and the pick was a filed defect rather than a tie-break (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 219 — the `aria-current` pairing gate stops at the docs dist, and the one violation it would have caught lived outside it (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 218 — Owner-forwarded review: `data-state`/`data-status` conflation, scoped to two components not the framework (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 217 — Polish round on `sidebar-nav`: a cite that was EXACT when written and decayed two days later, and the count-bearing class measured at 6 of 240 (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 216 — Polish round on `data-table`: a DSA cite that was already stale on the day it was scored, and a cloud wake lapped by 37 slices (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 215 — Objective grill of Slices 211, 213, 214: the open item's refusal cites a page that does not say it, and every container htmx measurement ran a version the app does not ship (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 214 — Standardize sweep: lanes 1-3 clean for the sixth time, and lane 4 carries the finding again — the archive sweep is due a SIXTH time, one day after the fifth (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 213 — P0: a windowed-list spacer is sized from ONE sampled row that is not representative, so every evicted chunk is 49px short and re-loading it jumps the scroll (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 212 — Objective grill of the 200/208/209 window: a refusal's own base rate missed the declaration its cited gate names in its header, and the arming set needed narrowing for the third grill running (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 211 — two things 208.3's root-cause turned up: a reference app that cannot run without the public internet, and a scroll-anchor assertion nobody had ever exercised in a container (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 210 — the motion-literal gate refuses itself: 0 of 23 under its own wording, and its only three reds under a wider one are three right answers (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 209 — Objective grill of Slices 205, 208: the sweep proved itself against a state it never committed, and the floor script publishes a prefixed version its sibling filters out (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 208 — Standardize sweep: the fifth clean result came from three lanes, and the fourth lane — unread by all four prior sweeps — was carrying the finding (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 200 — triage: an external "micro-motion UX review" proposal, checked against the shipped CSS before anything was filed (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

