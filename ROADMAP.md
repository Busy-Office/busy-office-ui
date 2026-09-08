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
  gate scripts, so none of them may be ignored. **`.roundtable/**` and
  `STATUS.md` were the two exceptions and they are not exceptions: both are
  read, and `paths-ignore` is gone entirely** (312.2, 2026-09-07). The rule
  survives; only its exception list died. The `~4x` above still holds — it was
  sharding, not the ignore: sharding took wall clock 12.4 min → 184s, and one
  run today measures ~3 min wall / ~14.7 machine-minutes. What the removal
  costs is *more runs*, not slower ones.
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

## Slice 342 — 320.2: `scan:dead-style` judges each declaration on its own, and the blind spot was not empty — **52 dead declarations** were hiding behind live siblings, invisible to every sweep that has ever read this instrument (2026-09-08)

**Dispatched by rule 4** on the oldest still-open cloud-takeable item, cloud
wake. Step 0: container **DETACHED** again (`git branch --show-current` empty),
`ENVIRONMENT.md` trap 1, fixed with `git checkout -B main origin/main` before
any commit; `origin/main` again arrived as a **forced update**
(`26447ba...e214bd7`). Trap 2 clean in one `--unshallow`, no `shallow.lock`,
and it again brought the tags — `git tag | wc -l` -> **8**, §2's mandated count,
run rather than assumed. Trap 1c respected: `CHROME_PATH` exported in the same
command as every browser-driven gate.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` -> **0**.
Step 1 read **both** intakes with `ENVIRONMENT.md` §8's controls
(`/discussions` -> 200 len **0**; `/not-a-real-route` -> **404**;
`/issues?state=open` -> 200 len **1**, issue #2, `updated_at` unmoved at
2026-09-06T15:10:34Z, already triaged) and triaged nothing: no new input.
Rule 2 `Standardize 1 / 4` did not match. Rule 3 `Objective 0 / 3` did not
match — spent by Slice 341. **Rule 4 matched.** Rule 5 was not reached, and its
line reads `ok` rather than STALE for the first time in a while: the comparable
set carries `dispatch-region-words 7298 -> 7492`, a **single** pair, and one
pair cannot fire a rule that needs two consecutive.

**The archive sweep was evaluated and declined, on the trigger the last two
sweeps actually used.** `roadmap_scope.py` at `e214bd7d` reports closed-history
share **2,946 / 8,908 = 33.1%** with 13 eligible targets. 252.1 dispatched the
tenth sweep at **55.1%** and 272.1 the eleventh at **56.7%**; 279.3 declined the
twelfth at **40.6%**. 33.1% is below every one of those, so sweeping here would
be a wake lowering the threshold by its own initiative — which is precisely what
`249.12`, the open **OWNER OR ARCHITECTURE CALL** on the archival trigger,
exists to prevent. Re-run the script; these are snapshots and this commit moves
them.

### What 320.2 asked for, and what it turned out to be worth

The scan's verdict joined every property an attribute names into ONE string, so
an attribute was dead only if **all** of its declarations were. Slice 320
red-proved the gap on injected controls and filed it rather than building it,
because closing it moves a headline number that (per Slice 322's correction)
**17 sweeps had quoted** — 208 through 314, none of them correctly. There are
now two verdicts per attribute:

- the **attribute** verdict, byte-for-byte the old logic, so the series stays
  comparable;
- the **declaration** verdict — drop one declaration, leave the siblings in
  place, and read back only the properties that declaration names.

**The finding is that the blind spot was not empty.** 320.2's Accept says
outright that *"finding that the gap yields zero real dead declarations is a
satisfying outcome"*. It does not:

```
before   0 dead style attribute(s) on 0 page(s); 1365 live; 1854 declaration(s); 357 multi
after    0 dead style attribute(s) on 0 page(s); 1365 live; 1854 declaration(s); 357 multi
         per declaration — 52 dead declaration(s) on 13 page(s)
         reconciliation — 52 of those sit in 50 attribute(s) the attribute verdict
                          calls LIVE, out of 357 multi-declaration attribute(s);
                          0 dead attribute(s) hold a declaration that reads live alone
```

**The reconciliation is against the re-measured corpus, not against the number
this item was handed.** 320.2 cites *"the 273 attributes named above"*; 273 was
Slice 320's reading on 2026-09-07 against 1,272 attributes, and the tree has
moved since — today it is **357 of 1,365**, which Slice 332's grill independently
recorded as `0 dead / 1,365 live / 357 multi` on the same corpus. Reconciling
against the stale 273 would have been the *"reconciles against its own caller"*
failure CLAUDE.md's storage doctrine names.

Two internal checks hold, and both could have failed:

- **All 52 sit inside live attributes.** They must, and it is checked rather
  than assumed: a dead declaration in a *single*-declaration attribute would
  make that attribute dead, and the attribute count is still **0**.
- **`deadAttrLiveDecl` is 0** — no attribute that reads dead as a whole holds a
  declaration that reads live alone. That disagreement is possible in principle
  and is now reported rather than waved away.

**Reconciled against an independent count before quoting** (CLAUDE.md), and the
first instrument for it was wrong, which is the base rate arriving on schedule:
a per-page grep was written that conflated the *global* `by dead declaration`
tally with the *per-page* list, and reported `raw=0` against `scan said 10`.
Corrected to a whole-`dist` declaration census, every dead count is bounded above
by what is actually present:

| declaration | present in `dist` | called dead |
|---|---|---|
| `display:inline-block` | 10 | 10 |
| `color: var(--bo-color-accent)` | 19 | **17** |
| `margin: 0` | 12 | 12 |
| `display: block` | 7 | **4** |
| `inline-size: 100%` | 6 | **3** |
| `inline-size:var(--bo-space-0)` | 1 | 1 |
| `display: inline-block` | 1 | 1 |

**The three splits are the discriminating evidence, not the three matches.** The
same declaration text is dead in some places and live in others, which is what a
per-*element* verdict must produce; had every row read `dead == present`, that
would be the "identical value across many inputs" tell this repo treats as a
defect until proven otherwise.

**The print branch also stopped reading as a branch that never runs.** At the
attribute unit it reports **0** dead-on-screen-but-live-in-print, every sweep,
forever. At the declaration unit it reports **6** — the same both-media rule,
finer input, and the first non-zero this instrument has produced there.

### The red-proof, and it is precise rather than broad

Per the standing rule that a green red-proof is a defect in the injection, the
injection was verified before the result was believed: a throwaway copy of the
script in `apps/docs/scripts/` had its per-declaration verdict replaced by the
attribute one, with the target's occurrence count asserted as exactly **1**
before the replace and the marker asserted present after.

```
- mixed control's dead declaration read live — 'margin: 0' inside
  'padding: 40px; margin: 0' → dead=false. This is exactly what judging the
  attribute AS A WHOLE produces (roadmap 320.2)                          rc=1
```

**Exactly one of the five controls failed** — the live control, the dead
control, the mixed attribute and the mixed live declaration all still passed.
That matters because `ENVIRONMENT.md` already carries the sibling trap: *a
red-proof that goes red TOO BROADLY certifies nothing either*. The probe file
was deleted and its absence confirmed (`ls apps/docs/scripts | grep -c redproof`
-> **0**, `git status --short` showing only the one modified file).

The mixed control is `padding: 40px; margin: 0` rather than Slice 320's
`margin: 40px; padding: 0`, deliberately: `margin: 0` is dead for a reason this
script's **existing** dead control already proves (the reset's `* { margin: 0 }`),
whereas a `<p>`'s zero padding is an assumption about the docs cascade that
nothing here had tested.

1. [ ] **342.1 — the 52 are a lane-1 finding, not this item's to spend.**
       `scan:dead-style` is a report the Standardize sweep consumes; 320.2 was
       scoped to the instrument, and fixing 13 pages inside it would mix an
       instrument change with a corpus change in one commit and widen the item.
       The 52 need judgement per site, not a regex: `/reference/tokens/` and
       `/reference/events/` are generated swatch/table pages, and 292.8's rule
       puts a declaration inside a copyable template literal out of scope.
       - **Accept:** lane 1 of the next Standardize sweep records a verdict for
         every dead declaration the scan reports — converted, or refused with a
         reason — and the re-run count is reconciled against the count it
         started from. **Finding that most are out of scope is a satisfying
         outcome** if it carries the per-site reasons.

**Refused inside this round, measured rather than argued:** a depth-aware
declaration splitter, so a `;` inside a `url()` or a quoted value cannot break
the parse. Base rate first, per 94.11: **0 of 30,483** style attributes in the
built site carry one, so the predicate distinguishes nothing today, and shipping
it would move a headline number for a case that does not exist. The refusal and
the command are in the script's header so the next wake re-measures instead of
rebuilding it.

**Gates: all 17 cloud-runnable entry points green** on the committed tree.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed**, and that is structural rather than a
judgement call: the diff is one `.mjs` scan script that is not a build step, not
a gate, and not imported anywhere. Checked rather than asserted —
`grep -rln scan-dead-style` finds it in `apps/docs/package.json` (its own entry)
and, as **prose in a header comment**, in `check-viewport-forks.mjs` and
`viewports.mjs`; neither imports it, and `check:viewport-forks` passes on the
edited tree (76 docs scripts, no literal spelling of 390/1440 outside
`viewports.mjs` — this script's one `DESKTOP_WIDTH` use is untouched). No CSS
rule, no docs page and no component changed, so no rendering can move.

## Slice 341 — Objective grill of Slices 316, 319, 339: 17 of 17 published assertions reproduce, and the finding is that Slice 339's generator thesis was confirmed by the very NEXT commit — Step 0c's cut lasted one wake, with the charter followed exactly (2026-09-08)

**Dispatched by rule 3** at `Objective 3 / 3 OVERDUE [316, 319, 339]`, cloud
wake — **on the second dispatch of this wake.** The first was rule 4 on
`319.3` and it was **lost to collision 5** (`LOOPS.md` Step 0c): the other
dispatcher ran the same rule on the same item, reached the same verdict, and
also numbered it Slice 340. The loser's pre-commit `git fetch origin main` saw
`273c7ae3..1a973395` after the analysis was complete and all 17 gates were
green; it discarded, recorded the collision per 274.2's charter, and
re-dispatched. Closing 319.3 moved rule 3 from `2 / 3` to `3 / 3`, so **the
collision is what armed this grill.**

Step 0: container **DETACHED** again (`git branch --show-current` empty),
`ENVIRONMENT.md` trap 1, fixed with `git checkout -B main origin/main` before
any commit; `origin/main` arrived as a **forced update** (`26447ba...273c7ae`).
Trap 2 clean in one `--unshallow`, no `shallow.lock`, tags arrived with it
(`git tag | wc -l` → **8**, §2's mandated count). Step 1 read **both** intakes
in the REST form with its 404 control — `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1** (#2,
`updated_at` unmoved at `2026-09-06T15:10:34Z`) — so **Step 1 committed
nothing**. Rule 5 read `SKEW, 0 wake-date(s) newer`: evaluable, and no name in
the comparable set regresses on two consecutive runs.

**Scope, per §6 step 0: nothing dropped.** None of 316, 319 or 339 is named by
an existing grill heading. Slice 319 is itself a grill (of 298/300/318);
auditing a grill's own numbers is in scope. Full report:
`.roundtable/grill-objective-316-319-339-2026-09-08.md`.

**The result is 17 of 17 reproducing and NO defect**, which is unusual here and
is the first thing the report distrusts about itself — the scope is narrow by
selection (only mechanically re-runnable assertions), and what was not re-run is
named there rather than left implied.

1. [ ] **341.1 — Step 0c's generator has TWO outputs and its charter throttles
       only one. The cut lasted exactly one commit.** 339.1 concluded that Step
       0c has a *generator* — a recurring event each instance of which writes a
       narrative there — and that *"no cut can hold against one"*. **The next
       revision of `LOOPS.md` after 339's fix confirmed it**, and this grill is
       the evidence rather than a prediction.

       The per-revision series re-derived over the last 22 revisions of
       `LOOPS.md` (Step 0c, `### Step 0c` .. `### Step 1`, Python `str.split()`
       per `ENVIRONMENT.md` §7, **heading line excluded — 339's own convention,
       which is what makes its figures reproduce**; including it reads 13 more,
       and 13 is exactly the heading's length):

       ```
       aa550d2c 2026-09-05  1378
       8848ed55 2026-09-05   936  -442   ← 274.2's cut
       632bfc46 … ac0fc752         +0    ← FLAT at 936, 15 consecutive commits
       534b097a 2026-09-07  1300  +364   ← collision 3's forensics
       86f034ce 2026-09-07  1500  +200   ← collision 4's
       f9e0f17d 2026-09-07  1322  -178   ← Slice 339's fix
       7e2c61c0 2026-09-08  1516  +194   ← collision 5, this wake
       ```

       **Every figure Slice 339 published is in that column** — 936, the 15 flat
       commits, +364, +200, 1,500, 1,322 — nothing off by anything. The new
       point puts Step 0c **16 words above the 1,500 that made 339 diagnose the
       problem** and **138 above the 1,378 it was originally cut from**, one
       wake later.

       **And the charter was followed exactly, which is the whole point.** The
       easy reading — "the wake was undisciplined" — is false and would send the
       next wake to the wrong fix. `LOOPS-archive.md` took the 40 lines of
       forensics as 274.2 requires; only what the charter says stays inline
       stayed. The **+194 splits two ways**:

       | what | words | mandated by |
       |---|---|---|
       | the one-line list entry for collision 5 | **115** | Step 0c's *"a new collision adds a LINE here"* |
       | correcting the counts the incident falsified | **79** net (36 replaced) | **nothing — this half is unnamed** |

       **The unnamed half is the contribution.** An incident does not merely add
       a line; it **falsifies the prose around the line**. Collision 5 made
       *"Four as of 2026-09-07"* wrong, *"Three of the four now cost less
       than…"* wrong, and *"the sample is four, and collision 1 did cost a whole
       wake"* wrong. Correcting each is required by this repo's standing rule
       against stale counts — the same rule Slice 339 itself applied twice — so
       the 79 is not slack that discipline removes.

       **The tension is real in both directions, which is why this is filed and
       not fixed:** replacing the per-incident list with a count plus a pointer
       is what Step 0c **already refuses in its own words** (*"Count them by
       re-reading the list below rather than trusting a number in prose"* —
       written because *"it has happened once"* stood stale for ten days);
       keeping the list costs ~115 words per collision plus whatever the
       incident falsifies, forever.
       - **Accept:** either a shape is found that keeps the list re-readable
         while removing the per-incident cost from the section every wake reads
         (a generated line? the list itself in `LOOPS-archive.md` with the
         *decision* inline?), or this closes as **refused with the reason** —
         the likeliest being that Step 0c is read by every wake and 1,516 words
         of it is not waste, so the growth is the price of a record that is
         never stale. **Refusing is a satisfying outcome.**
       - **Re-measure first, do not quote:** re-run the series above; these are
         snapshots, and a sixth collision moves them.
       - **Related, not duplicate:** `339.2` is the same *signature* (one step,
         then flat) on **rule 3's** section and turns on whether that +303 is
         instruction. This item is about a section with a live generator and a
         charter that already governs it.
       - **Lane:** cloud-takeable. A git-history word count, no browser.

**NOT VERIFIED, said plainly.** No 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **This slice owes none, and that is structural rather than a
judgement call:** the diff is **`ROADMAP.md`, `LOOPS.md`, `LOOPS-archive.md` and
one new `.roundtable/` report**. No CSS rule, no docs page and no script
changed, so no rendering can move; `git diff --stat` was read to confirm that,
not assumed. The wake's throwaway probes (a 21-page copy of
`check-target-size.mjs`, two style injections into built pages) were reverted
and confirmed gone before any commit.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

## Slice 340 — 319.3: the four-page "overlap" was never coverage. `check:target-size` cannot see a named pixel size by construction, so growing it is refused on a red-proof, and the six claims move to the gate that CAN see them (2026-09-08)

**Dispatched by rule 4** on the oldest still-open item, cloud wake. Rule 1 no
open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**); rule 2
`Standardize 0 / 4 ok`; rule 3 `Objective 2 / 3 ok [316, 339]`; rule 5
`SKEW, 0 wake-date(s) newer` — evaluable, and no name in the comparable set
regresses on two consecutive runs. Step 0: `origin/main` arrived as a **forced
update** again (`26447ba...273c7ae`) — `ENVIRONMENT.md` trap 1 — fixed with
`git checkout -B main origin/main`, `git branch --show-current` re-read as
`main` before committing. Trap 2 clean in one `--unshallow`, no `shallow.lock`,
tags again arrived with it (`git tag | wc -l` → **8**, the seventh consecutive
container to contradict the value §2 used to assert). Step 1 read **both**
intakes in the REST form with its 404 control: `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. **No new
untriaged input** — issue #2's `updated_at` unmoved at `2026-09-06T15:10:34Z`
for a seventh consecutive hand-off — so **Step 1 committed nothing**. The nine
older open items were re-derived from their own text as owner-blocked before
rule 4 reached this one.

**The item's own premise was re-run first, as its Accept requires, and it
holds:** the vocabulary grep still finds **18** pages, the sweep is still
**7**, and the overlap is still the same **4** (`button`, `data-table`, `form`,
`quantity`).

1. [x] **340.1 — the overlap of 4 is not coverage, and the sweep cannot be
       grown into it.** `check-target-size.mjs`'s loop skips every target at or
       above 24px (`if (t.w >= 24 && t.h >= 24) continue;`) and fails only when
       an undersized one is crowded. Its predicate is SC 2.5.8 conformance;
       a page's *named pixel value* is a different predicate, and no page list
       converts one into the other.

       **Red-proved by injection, with the injection asserted in the DOM before
       the gate was believed.** `#main-content .bo-btn` on the swept
       `/components/button/` was forced to `block-size: 30px` in the built page:

       ```
       injection landed?  styleTagInDom true · n=24 buttons · heights [30]
                          at compact AND spacious (shipped: 28 and 44)
       check:target-size  PASSED, rc 0 — byte-identical output, the same 9
                          exempted control types and the same distances
       ```

       So a page may claim 44px, render 30px, and this gate stays green — and
       `/components/button/`'s own *"`--sm` is a 24px control"* sits INSIDE the
       sweep and was unverified by it. Coverage of the pixel claims was
       **0 of 18**, not 4 of 18.

       **The growth was costed anyway, because the Accept asks for it.** Adding
       the seven claim-making pages, 7 → 14 pages × 3 densities:

       ```
       7 pages   real 0m10.4s    9 undersized control type(s)
       14 pages  real 0m19.4s    the IDENTICAL 9, same distances
       ```

       **+9.0s, +86%, for zero new information.** Refused.

2. [x] **340.2 — the six claims are now executable, in the gate whose own header
       already said where they belong.** `check-claims.mjs` says *"add a case
       whenever a page claims something a browser can check"*, and CLAUDE.md's
       standing rule is that a claim asserting runtime behaviour must be
       executable. Six cases added; `check:claims` reads **176** live (was 170),
       3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact.

       **Every one was MEASURED TRUE before it was written down**, so none is a
       speculative assertion — there was no lurking defect for the refused
       growth to have caught:

       | page | the sentence | measured |
       |---|---|---|
       | `/concepts/density`, `/concepts/layouts` | rows 30/40/48, controls 28/36/44 | 30/40/48 · 28/36/44 |
       | `/components/button`, `/patterns/kanban` | `--sm` is 24px, in every tier | 24 in all three, n=4 and n=5 |
       | `/components/filters` | chip remove: "24px hit area" | 24×24 in all three |
       | `/components/richtext` | 28px compact → 44px spacious, above the 24 floor | 28/36/44, square, n=29 |
       | `/components/segmented` | a badge is 24px tall inside a 24px segment | badge 24, option 24, at compact |
       | `/components/money` | spacious is "44px controls" | every control 44 at spacious |

       **The tokens are authored in `rem`, and the first version of the density
       case went red on it** — `getPropertyValue` returns `1.875rem`, not the
       `30px` the page promises a reader. It now applies each token to a real
       box and measures it, resolving through the live root font size instead of
       assuming 16px. That failure is kept here because it is the case's whole
       point: the page names a pixel and the source names a ratio.

       **Red-proof, six injections at once, each on a different page and a
       different selector:** exactly **6 of 176** went red and they were exactly
       the six new names — no collateral, and no case survived its own
       injection. Because each injection sits on a page no other injection
       touches, that pairs each case to its own subject rather than proving only
       that something broke. Restored and re-run green (`rp3193` occurrences
       back to 0 in all six files, checked rather than assumed), and the whole
       proof was re-run against the FINAL code after the two corrections below,
       not just the first draft.

       **The by-hand verifier pass caught a real defect in this slice's own
       diff, and it is the shape this repo keeps finding.** The `--sm` case was
       named `button/kanban` and visited **only** `/components/button/` — a case
       naming a page it never loads, which is a detector that cannot fail for
       half of what its name claims. It now loops both pages and requires both.
       Red-proved on the half that was missing: an injection into
       `/patterns/kanban/` **alone** turns that case red, **1 of 176**, so the
       kanban half is genuinely read.

       **A second correction, to the plumbing rather than a claim.** The first
       draft passed selectors by string-substituting into a stringified function
       (`.replace(/SELECTOR/g, …)` fed to `new Function`). It worked and it is
       exactly the kind of cleverness that fails silently later; it is now an
       ordinary `page.evaluate(SIZES, sel)` argument. `check:claims` was re-run
       green and the six-injection proof re-run red after the change, because a
       refactor of how a value is OBTAINED invalidates a red-proof taken before
       it.

3. [x] **340.3 — what the 18 does NOT contain, which is the judgement the item
       said the list was only an input to.** Of the 14 pages outside the sweep,
       **seven** make a pixel claim (the six cases above plus `/concepts/layouts`
       restating density's), and **seven do not**:

       - `/patterns/goods-receipt`, `/patterns/rf-landing`, `/patterns/rf-list`,
         `/patterns/rf-pick` — "gloved thumb", "glove-sized tap targets",
         "big steppers". Qualitative; they name no pixel, so there is nothing to
         falsify. `/patterns/rf-list` says outright its row tap target is *"not
         in this demo"*.
       - `/patterns/record-detail` — `124px`/`277px` are facts-strip **widths**,
         not target sizes.
       - `/patterns/inbox` — "nitrile gloves" is a line item in a receiving
         demo. **Demo data, not a claim**, and the clearest evidence that the 18
         is a vocabulary count.
       - `/concepts/accessibility` — asserts the *verification* ("SC 2.5.8 …
         verified in CI by the real spec test … met via the spacing exception,
         NOT a 24px floor"), which is an accurate description of what
         `check:target-size` does. Examined and left alone.

       So the item's caution was right and the number it was right about is
       **7 of 14**, not 14.

4. [x] **340.4 — the assumption is written where it was made.**
       `check-target-size.mjs`'s header now carries a "what this gate does not
       check" block with the red-proof and the two timings, because the header
       is what the next wake reads before reaching for the page list again.
       Nothing else records it: the misreading is what made `319.3`'s Accept
       offer "grow the sweep" as a live branch at all, and the header is the one
       place a wake looks before reaching for that branch a second time.

## Slice 339 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's regrowth is a THIRD case 308.1's fork does not name — the cut held perfectly and the charter behind it was never executed (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE`, cloud
wake. Rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**).
Step 0: `origin/main` arrived as a **forced update** again
(`26447ba...c87fc52`) — `ENVIRONMENT.md` trap 1 — fixed with `git checkout -B
main origin/main`; `git branch --show-current` re-read as `main` before
committing. Trap 2 clean in one `--unshallow`, no `shallow.lock`, tags again
arrived with it (`git tag | wc -l` → **8**). Step 1 read **both** intakes in the
REST form with its 404 control: `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. **No new
untriaged input** — issue #2's `updated_at` is unmoved at
`2026-09-06T15:10:34Z` for a sixth consecutive hand-off — so **Step 1 committed
nothing**.

**Lanes 1-3 clean, and `n of 4` is said as the playbook requires.**

```
npm run scan:dead-style -w docs          # 0 dead of 1,365 attrs / 1,854 decls
npm run report:css-repeats -w @busy-office/ui   # 74 files · 242 rules · 230 bodies · 8 repeats
npm run report:prose -w docs             # 119 pages · median 798 · total 113,787
python3 scripts/loops/report_loop_prose.py
```

Lane 1 ran green **with `CHROME_PATH` exported in the same command** and the
workspace spelled `docs` — `337.1`'s live trap, avoided rather than met. Lane 2
is the **fifth** consecutive reading of `74/242/230/8`; the finding is the delta
and there is none. Lane 3's flagged union is **15** (10 over 2x the corpus
median, 11 over a family median), every one inside the pinned 16-set —
`158.1`'s twelve resolve to twelve page paths in the archive, `161.1`'s three,
`178.3`'s `/concepts/scale/`; the unflagged member is `/patterns/output-form/`.
Membership was checked against **the enumeration**, never the grep `326.1`
red-proved dead.

1. [x] **339.1 — lane 4: Step 0c regrew past its pre-cut size in one day, and
       neither branch of 308.1's fork describes what happened.**

       Lane 4 reports the dispatch region growing faster than the file (1,525 →
       **7,532** words, 42.3% of it). `308.1` says a rising region number is not
       a regrowth reading until it is attributed per section, so it was — on
       headings only, which is what that clause asks for.

       **Every per-section figure below is the SPLITTER's, and lane 4's 7,532 is
       the report's**; the two differ because the report counts heading lines and
       a body split does not. They reconcile at the constant the playbook names —
       7,532 − 7,476 = **56** — so the deltas agree exactly and the totals do
       not. Quoting one against the other would invent a delta that is not there:

       ```
       # per-section body words, dispatch region, at each revision since the cut
       git show <rev>:LOOPS.md | awk '/^## Playbooks/{exit} {print}'   # split on ^#{2,4}
       ```

       **Every changed section grew and none shrank** since the last cut
       (`8848ed55`, 274.2, 2026-09-05): Step 0c **+564**, Step 1 **+580**, Step 2
       **+527**, Step 0 **+151**, and the loops table +52 net as *eight* became
       *nine*. The largest is the section **274.2 cut**, which is 308.1's first
       branch — *the fold did not hold, another cut is the answer*.

       **The per-revision series says that verdict is wrong.** Step 0c held
       **flat at 936 across 15 consecutive commits** over two days, then moved
       twice on 2026-09-07: `534b097a` **+364** (collision 3's forensics) and
       `86f034ce` **+200** (collision 4's). It reached **1,500** — **122 words
       above the 1,378 it was cut from**.

       ```
       8848ed55  2026-09-05   936        274.2's cut: 1,378 -> 936
       … 15 commits …         936    +0  through 2026-09-07 (Slice 327)
       534b097a  2026-09-07  1300  +364  collision 3 written up in full
       86f034ce  2026-09-07  1500  +200  collision 4 written up in full
       ```

       **So the cut held perfectly and the charter behind it was never
       executed.** `LOOPS-archive.md`'s own Step 0c charter — written by 274.2 —
       says the decision, the cost, the fetch rule, the conflict recipe and the
       reopen condition stay inline and **the forensics move**. Collisions 3 and
       4 wrote their forensics inline anyway. Nothing executes that charter when
       the next incident is recorded, exactly like the polish re-queue rule that
       "was a rule a human had to notice. It was not noticed."

       **This is a third case, and the first two branches send a wake the wrong
       way on it.** Branch 1 buys another 15 commits; branch 2 ("other sections
       grew — do not reach for a cut") is false here. The distinguishing tell is
       that the regrowth is **new material**, so it is invisible in the
       endpoints and obvious in the series. Added to the lane-4 clause as a
       third branch, with the general form: **check whether the section has a
       GENERATOR** — a recurring event each instance of which writes a narrative
       there — because no cut can hold against one.

       **What was done about it: the charter applied, not a second cut.**
       Collisions 3 and 4 keep a one-line record inline, in the shape 274.2 left
       collisions 1 and 2 in; their forensics, the decision-time fixed-string
       re-check and the "it has happened once" stale-snapshot incident moved to
       `LOOPS-archive.md`. What CHANGES what a wake does stayed inline and is
       named: the pre-commit `git fetch origin main`, the renumber mechanic, the
       keep-both-rows recipe, "check the loser's output before discarding", and
       the guaranteed-conflict refutation.

       **Measured, and the first attempt did not work.** Applying the charter
       moved Step 0c **1,500 → 1,487**, a 13-word reduction: the narrative that
       came out was replaced by a paragraph explaining why it came out, which is
       the same accretion by another name. Tightened to the instruction, and the
       explanation put here and in the archive, it reads **1,322** — **178 below
       where this wake found it and 56 below the pre-cut 1,378**, with the
       dispatch region 7,476 → **7,298**. It is **still 386 above the 936 the cut
       achieved**, and that is stated rather than rounded off: the residual is
       instruction that landed after the cut (the renumber mechanic above all),
       not narrative, and cutting to 936 would remove what a colliding wake
       executes.

       **Two stale counts fixed in passing, same defect class as lane 3's
       "Verdicts to date" list**: `LOOPS.md` pointed at "the forensics of the
       first two collisions" and `LOOPS-archive.md`'s heading read "The two
       collisions" — both written when two was right, both stale from the moment
       a third landed. Both now name the subject rather than a count.

       *Accept was*: the region's rise is attributed per section before any
       verdict; the verdict names which of 308.1's cases it is, or records that
       none of them fits; and whatever is done leaves Step 0c's
       behaviour-changing content inline, verified by naming it. Finding the
       premise ("the fold did not hold") FALSE is a satisfying outcome and is
       what happened.

2. [ ] **339.2 — the sweep's re-scan found a SECOND section with the same
       unexecuted charter, and this item is deliberately not the fix.**

       `LOOPS.md` §3 step 4 says a round re-scans for another instance of the
       same drift. Applying 339.1's own general question — *does this section
       have a generator?* — to the other sections that grew since `8848ed55`
       finds one, with the identical signature:

       ```
       # rule 3's body words, per revision since 274.2's cut
       8848ed55  2026-09-05   660
       632bfc46  2026-09-05   963  +303   Slice 279.4
       … 18 commits …         963    +0   through 339 (2026-09-07)
       ```

       **One step, then flat for 18 commits** — the same series Step 0c showed,
       one narrative instead of two. Rule 3 carries an archive charter of its own
       (*"The five recurrence narratives — what each parser did, the replay
       figures, the counts that were snapshots — are in `LOOPS-archive.md`"*),
       and 279.4's +303 is a sixth blind spot written inline, replay figures
       included (`18 Polish rows naming 17 slices`, `crossings 51 → 52`, the
       12-slice list). Those figures already have a home the text itself names —
       *"in `dispatch_status.py` beside `CLOSES_A_SLICE`; re-run them, they are
       snapshots"* — so they are duplicated, not merely inline.

       **Why this is filed rather than cut in the same wake, which is 339.1's
       own third branch applied to itself.** That branch says: when other
       sections grew, *"a second cut would remove instruction rather than
       narrative … say so and file the structural question; do not reach for a
       cut."* And 279.4 **argues explicitly for its inline placement** — that its
       mechanism is the loop SET rather than a parser, that *"no widening of any
       regex could have found it"*, and that this is "the point". Overriding a
       stated argument is its own decision with its own reasoning; it is not a
       tidy-up at the tail of a sweep, and making it at speed is how instruction
       gets cut.

       **So the sweep exits with a KNOWN open item, and does not claim a clean
       pass.** `LOOPS.md` §3's exit is *"a clean pass finds nothing to
       consolidate"*; this pass found something and left it, which is stated here
       rather than implied by silence.

       *Accept*: the item names, sentence by sentence, which of rule 3's +303 is
       instruction (a lesson that changes what the next wake does) and which is
       forensics under its own charter, and either moves the forensics or records
       why 279.4's inline argument beats the charter. **Finding that the whole
       +303 is instruction is a satisfying outcome** and closes this item — the
       premise is that some of it is not, and that premise is checkable against
       the charter's own wording rather than against a word count. Re-measure the
       series first (the numbers above are snapshots, and the command is the
       block above them).

## Slice 338 — 316.1 built: `check:print-tokens` ships red-proved, the exemption list it was expected to need is refused on a measurement, and the gap it CANNOT see is filed rather than quietly widened (2026-09-08)

**Dispatched by rule 4**, cloud wake. Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...0ba54ba`), carrying Slice 337, which
the previous hand-off predates. Trap 2 clean in one `--unshallow`, no
`shallow.lock`, and it again brought the tags; `git tag | wc -l` → **8**.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**
across the 31 open items. Step 1 read **both** intakes with `ENVIRONMENT.md`
§8's controls in one run — `/discussions` → 200 len **0**; `/not-a-real-route`
→ **404**, so the zero is a served zero; `/issues?state=open` → 200 len **1**,
issue #2, `updated_at` still `2026-09-06T15:10:34Z` and already triaged as
`300.2` — and triaged nothing: no new input, so Step 1 committed nothing.
Rule 2 `Standardize 3 / 4 … ok`; rule 3 `Objective 0 / 3 … ok`, spent by 337.
Rule 5 reports **STALE** (`1 wake-date(s) newer`), so per `LOOPS.md` it **could
not be evaluated** and is not reported clear. **Rule 4 dispatched Continue,
build mode**, on `316.1` — the oldest still-open item that any wake can take.
Everything older was re-derived from its own item text rather than carried from
the hand-off: Slice 15 (owner hardware), `112.3`/`112.4` (owner briefs),
`249.7` (its own text holds it for `249.10`, owner vocabulary),
`249.10`–`249.13`, `273.2`, `296.3` — all **OWNER CALL**.

### The base rate reproduced, and the denominator did not

`316.1`'s own text says *"Re-run the base rate first; it is a snapshot."* Under
its stated narrow property list (`color|background|background-color|
border-color|fill|stroke|outline-color`) it reproduces **exactly**: **11
literal, 0 token**, across **6** files, with the per-file tally matching to the
digit — `approval-workflow` 1, `badge` 2, `data-table` 2, `stepper` 3,
`print/index.css` 1, `reset/index.css` 2.

**The shipped gate counts 14, and that is a different population, not a
disagreement.** Adding the `border` shorthand finds three more —
`badge.css:115`, `data-table.css:815`, `stepper.css:95`, every one a `border:
… solid <literal>`. The wide list is the right denominator for the gate,
because `border: 1px solid var(--bo-color-border)` inside `@media print` is
exactly the regression and the narrow list cannot see it. Both numbers, and
which is which, are in the gate's header — Slice 336's three defects were every
one of them a number faithfully reading a different population than the noun
beside it named, and this is that lesson applied on the next wake rather than
discovered by the next grill. **Neither number is the verdict**; the verdict is
the **0**, and it is identical under both lists.

### The anticipated exemption list is REFUSED, on a measurement

`316.1` named the likeliest reason to refuse the gate: *"a blanket ban is wrong
for a fill whose colour IS content (`print-color-adjust: exact` markers), which
would need the exemption list this repo's other gates carry."* All three such
rules were read:

| rule | file | declares |
|---|---|---|
| `.bo-icon` | `icon.css:296` | `-webkit-print-color-adjust`, `print-color-adjust` |
| `.bo-timeline__marker, .bo-stepper__marker` | `print/index.css:91` | `print-color-adjust` |
| `.bo-u-print-exact` | `print/index.css:113` | `-webkit-print-color-adjust`, `print-color-adjust` |

**None of them restates a colour inside `@media print` at all**, and that is
structural rather than lucky: the entire point of `print-color-adjust: exact`
is to preserve the colour the ordinary cascade already gave the element, so an
exact-fill rule has no reason to name a colour a second time. So the exemption
is not needed, and shipping an empty exemption map "just in case" would be the
ceremony 94.11 refuses. If a real case ever arrives the gate goes red and the
exemption is argued deliberately — the right way for that decision to be made,
rather than silently exercised.

### The predicate is the token reference, not a property allowlist

The first draft keyed on a list of colour-bearing properties. That list is an
escape hatch with a live example one hop away: `approval-workflow.css:69` sets
`--bo-timeline-marker-fg: var(--bo-color-text-muted)`, a **custom property** no
such list names. Written inside `@media print` it is the identical regression
and the identical 2.54:1, and the allowlist would have passed it. `--bo-color-*`
is a colour family by definition, so keying on the token reference loses nothing
and closes the door. It is red-proved in both places — self-test case 3, and a
live injection into a real component file (below).

1. [ ] **338.1 — the gap `check:print-tokens` cannot see: a theme token that
       reaches paper through the ORDINARY CASCADE.** FILED, not built. The
       gate catches a token *restated* inside `@media print`. The mechanism it
       misses is specificity, not any print property:
       `reset/index.css:96` ships
       `@media print { body { background: #fff; color: #000 } }`, which covers
       everything that INHERITS its colour — most text, which is why this is a
       narrow gap and not a framework-wide one. It does not cover an element
       that sets its own colour, because `body { color: #000 }` loses to any
       more specific rule. `.bo-timeline__marker` is such an element:
       `approval-workflow.css:106` sets `color: var(--bo-timeline-marker-fg)`,
       and `:69` defines that as `var(--bo-color-text-muted)` — the token
       298.1 measured at **2.54:1 on white paper**. Nothing inside
       `@media print` overrides it.

       **The source path above is grepped. The printed contrast is NOT
       measured** — saying so rather than letting a source trace imply a
       rendered result, and it is why this is filed rather than folded into
       the gate: a source scan is the wrong instrument, a computed-style
       reading under print emulation is the right one, and a cloud wake can
       take that (`ENVIRONMENT.md`'s "can run" list).
       - **Accept — the property, and finding the premise FALSE is a
         satisfying outcome.** Re-measure first, under print emulation on the
         built site in the dark theme, exactly as 298.1 did: read the computed
         `color` of a rendered `.bo-timeline__marker` and its contrast against
         the printed background. Then EITHER the reading is a real
         below-AA value and this closes with the fix plus its base rate — how
         many elements set their own colour from a `--bo-color-*` token and
         are not overridden in print — OR the reading is benign (the UA, the
         reset, or the marker's own background rescues it) and this closes as
         **refused with the measurement**, and the gate header's "what this
         does not see" paragraph is corrected to say so. Do not widen
         `check:print-tokens` on the strength of the source trace alone.

## Slice 337 — Objective grill of Slice 297: `config.yml` is the router, not a third template, and the slice counted the escape hatch as an enforcer (2026-09-08)

**Dispatched by rule 3**, `Objective 4 / 3 … OVERDUE [297, 315, 332, 333]`.
Rule 1 no open P0 (**0**). Step 1 read both intakes in Slice 332's REST form
with §8's controls — issues **1** (#2, already triaged as `300.2`),
discussions **0**, `/discussionz` **404** — and triaged nothing. Rule 2
`Standardize 3 / 4 ok`. Rule 5 **STALE**, so it could not be evaluated and is
not reported clear.

### Collision 5, and the first where both dispatchers ran the SAME rule

This wake grilled all four overdue slices. Mid-write-up the scheduled cloud
dispatcher pushed **Slice 336**, an Objective grill of **315, 332, 333** — 29
assertions, three defects, deeper on those three than this one was. Per Step 0c
the loser discards, so **315/332/333 are ceded to 336** and this slice keeps
**297**, which was in this wake's overdue list and not in that one's.

**The two do not contradict, and one overlap is worth keeping.** Both wakes
re-ran 332's three lane figures independently, on different machines, and both
got them to the digit — `0 / 1,365 / 357`, `74 · 242 · 230 · 8`,
`119 · 798 · 113,787 · 10`. A figure reproduced twice by two dispatchers that
had not seen each other's run is better evidence than either run alone.

**Full report:** `.roundtable/grill-objective-297-2026-09-08.md`.

### The defect

Slice 297 wrote that *"three templates enforce version/browser/theme/density
plus a minimal repro on bugs and a real ERP scenario on features"*. There are
**two**, and no third was ever deleted:

```
git log --all --pretty=format: --name-only -- '.github/ISSUE_TEMPLATE/*' | sort -u
#   bug_report.yml   config.yml   feature_request.yml
```

`config.yml` enforces nothing. It is the router, and **its first line is
`blank_issues_enabled: true`** — so the file folded into the count of things
that enforce is the one file that lets a reporter skip enforcement.

**The correct fact was already written down.** `ROADMAP-archive.md:15107`, the
entry 297 was compressing, reads *"bug report form (…) + feature request form
(…) + `config.yml` (**blank issues on**, docs link)"* — two forms named
separately, with the blank-issue setting stated. 297 lost both in one word.

**And the loss cost a slice.** `297.1` asked whether the router worked; Slice
335 answered it by pulling the API, finding **zero labels** on both issues, and
reasoning from the forms' `labels:` keys that neither form had rendered. That
conclusion is what `blank_issues_enabled: true` says outright. The archive knew
it on 2026-08-30, 297 dropped it on 2026-09-06, 335 rediscovered it on
2026-09-08.

**Corrected in place** — 236.2's precedent, the same one Slice 336 invoked
hours earlier for its own three. **No gate**: a detector for one sentence in
one slice is the ceremony 94.11 refuses, and *"the noun matches the
population"* is the same semantic wall 336 hit. Filed as an instance of the
rule `CLAUDE.md` already carries — *re-checking an earlier wake's measurement
is part of the criterion* — not as a new section, because `158.2` has prose
growth open.

### Instrument note: the removal check nearly produced a false finding

Re-running 333 (before it was ceded), the first pass grepped the five deleted
const names in `motion.astro` and found **2–3 hits each**, which reads as *the
deletion never happened*. They are the comment the deleting edit wrote to
explain itself, at lines 44, 60 and 302. This is `CLAUDE.md`'s *"verifying a
removal: assert on structure, never on raw text"* in its exact predicted form —
`grep -nE "const (name) ="` returns nothing and the deletion holds. **The rule
caught a live case in the session that had just re-read it.**

1. [ ] **337.1 — A Standardize lane that never RAN is recorded as clean, and
       nothing in the sweep can tell the two apart.** Re-running 332's lanes,
       `npm run -s scan:dead-style -w @busy-office/docs` printed **nothing at
       all** and did not visibly fail — the workspace is named `docs`, and
       `-s` swallowed npm's `No workspaces found` error. Empty stdout is
       indistinguishable from a clean lane, and the Standardize sweep IS these
       four commands. Neither 332 nor Slice 336's grill of it was affected —
       every figure reproduces twice — so this is a live trap, not a past
       failure. It is the workspace trap `CLAUDE.md` records, compounded by
       `-s`.
       - **Accept** — the property, not a fix I am predicting: each lane's
         entry in the sweep quotes **a figure the lane itself printed**, so a
         lane that produced no output cannot be written up as clean. Whether
         that comes from a wrapper that exits non-zero on empty stdout, from
         dropping `-s`, or from the sweep's own write-up rule is open.
         **Finding that the sweep already cannot record an empty lane is a
         satisfying outcome** — verify by actually running a lane with a wrong
         workspace name and seeing what the sweep does with it, not by reading
         the procedure.

## Slice 336 — Objective grill of Slices 315, 332, 333: 26 of 29 assertions reproduce, and all three defects are a number that is a faithful reading of a DIFFERENT population than the noun beside it names (2026-09-07)

**Dispatched by rule 3**, `Objective 3 / 3 slices … OVERDUE [315, 332, 333]`,
read from `dispatch_status.py` this wake rather than carried from the hand-off.
Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 29 open items. Rule 2: `Standardize 2 / 4 … ok`. Rule 5 was **evaluated
and does not fire** — `0 wake-date(s) newer`, comparable set's only mover is
`claims`, already day-paired `2026-09-06 169 → 2026-09-07 170`.

Step 1 read **both** intakes with `ENVIRONMENT.md` §8's controls:
`/issues?state=open` → `200 len 1` (issue #2, `updated_at`
`2026-09-06T15:10:34Z` — the same value the previous hand-off recorded, which
had already recorded it unmoved for a third time), `/discussions` → `200 len 0`,
`/not-a-real-route` → `404`. **No new input; triage committed nothing.**

**Scope per §6 step 0: nothing dropped.** None of the three is named by any
grill in either roadmap file or in `.roundtable/`. Slice 315 is itself a grill;
what is grilled here is its own three items. `315.3` was deferred out of it and
**built by Slice 334**, so 334's text is read where it settles a 315.3 claim.

**Full report:** `.roundtable/grill-objective-315-332-333-2026-09-07.md`.

**This wake collided, and it is `LOOPS.md` Step 0c's FOURTH — the first where
the two dispatchers ran different rules.** The pre-commit fetch mandated there
returned `6a009a4b..9c7bac19`: the other dispatcher had landed `297.1` under
rule 4 while this one ran rule 3. **Nothing was duplicated and nothing was
discarded** — the only shared resource they contended for was the slice
*number*, which that section never names. Both wrote `## Slice 335`. This slice
renumbered to **336**, rebased (one `ROADMAP.md` conflict, both hunks kept,
ordered 336 / 335 / 334) and landed intact. Recorded in Step 0c with the one way
the renumber goes wrong: a blind `sed 's/335/336/g'` also rewrites the live
arithmetic `396 − 61 = 335` elsewhere in this file, so the replace was scoped to
`335\.` plus the heading, with the hits counted before and after (8 + 1 here, 2
in the report).

**26 of 29 re-run assertions reproduce exactly** — including every line number
in 315.1 (`219` and `293` at `066d9878^`), all six of 315.2's hex spellings
(`142, 142, 123, 141, 114, 134`), all three of 332's lane figures to the digit
(`0 / 1,365 / 357`, `74 · 242 · 230 · 8`, `119 · 798 · 113,787 · 10`), and 333's
built-page identity (md5 `f8886e3e9ee20f6464ae9545cd44d7aa`, **87,802** bytes,
**139** pages) — which still matches **three** commits later
(`git rev-list --count 422601c4..HEAD` → 3), a reproduction the instrument could
not fake.

**The three that do not share a mechanism.** In none of them is the measurement
wrong; in each, the number faithfully reads a **different population or quantity
than the noun next to it names**, and in all three the conclusion is unaffected
— which is why review passed them.

| | the noun | what was counted |
|---|---|---|
| A | "top-level **sections**" | headings, `^#`, which includes the H1 title |
| B | "the 10 **flagged pages**" | the corpus half of a corpus-∪-family definition |
| C | "the cost … **for twenty child processes**" | a superseded reading, of the total rather than the delta |

Two of the three were inside their own commit's reach: C's correction was made
in `ac4a9a0f` and not propagated, and A is one `grep -c` from the right answer.

1. [x] **336.1 — the three numbers are corrected in place**, which is 315.2's
       own precedent (236.2: live and archived text alike may be amended for a
       correction). No gate is added for any of them — *"the noun matches the
       population"* is semantic, which is 94.11's wall.

       - **A — `332.1` says `ENVIRONMENT.md` has 18 top-level sections; it has
         17.** `grep -c '^## '` → **17**; `grep -c '^#'` → **18**, the extra one
         being the document's own title. It is load-bearing because `332.1` is
         **open** and its Accept audits *each section*, one of which cannot move
         because it is the title. Taken the same way at the last cut the figure
         is **14**, so the growth is 14 → 17 sections.
       - **B — Slice 332's lane 3 asserts cleanliness over 10 pages where the
         lane is defined on 15.** `LOOPS.md` §3 lane 3 flags *"over 2x the
         CORPUS median, **or** over 2x its FAMILY median"*. Re-run: corpus 10,
         family 11, **union 15**; all 15 are in the 16-set enumeration, so **the
         lane is genuinely clean** and only the population is misstated. The
         five unchecked by 332 are `/base/motion/`, `/concepts/layouts/`,
         `/concepts/js-behaviors/`, `/concepts/design-language/`,
         `/concepts/scale/`. Slice **326**, the sweep immediately before it,
         printed `union = 15` in its own entry — the definition was not obscure;
         the report is what buried it, which is `336.2`.
       - **C — `1.38 s` in 315.3's DONE bullet was superseded by its own
         commit.** `git show ac4a9a0f -- ROADMAP.md | grep -nE '^\+.*(1\.38|1\.23|1355)'`
         returns all three as ADDED lines of that one commit. Read as file
         positions in `git show ac4a9a0f:ROADMAP.md`, Slice 334's readings are
         at lines **411** and **414** and 315.3's `1.38 s` at line **2611** —
         **2,200 lines apart, in one commit.** `RESUME.md` records the by-hand verifier
         pass making exactly this correction. Both halves of the label were
         wrong: the quantity 315.3's question wants is what the change **adds**,
         and no whole-gate reading is 1.38 s either. Re-timing here reads
         `2,649 / 2,258 / 2,032 ms` for the whole gate, which settles nothing
         across containers and is *why* the delta is the right form.

       - **Not filed, recorded:** 333's *"the 'In context' section carries no
         copyable block, **alone** among the page's sections"* — **4 of the 8**
         sections carry no `<pre>` (Motion intent, Quick reference, In context,
         Related). True of the four demo sections, false as written, and nothing
         rests on it.

2. [ ] **336.2 — should `report:prose` print the flagged UNION, since that is
       what its lane is defined on?** Today it prints the corpus flags under a
       headline (*"over 2x the median — 10 page(s)"*) and the family flags
       inside a per-family breakdown, and **never prints the union** — so the
       report's most prominent number is half the population the lane asks a
       sweep to verdict. That is how 336.1B happened, and it is an instrument
       shape rather than a wake's oversight: the sweep read the number the tool
       made prominent.

       **Against, and it is not weak**: the union is derivable from what the
       report already prints, this is one line of arithmetic a sweep can do, and
       326 did do it. Adding a third list risks the report growing faster than
       the thing it measures. **For**: the lane's own text is a two-clause
       definition and the tool answers only the first clause; **2 of the last 2
       sweeps mishandled lane 3** — 326 on a stale enumeration (recorded in its
       own entry), 332 on the population. **n = 2**, said plainly: that is two
       consecutive sweeps, not an established rate, and the wake that takes this
       should re-measure it over however many sweeps exist by then.

       - **Accept** — the property, not a predicted outcome: one wake records
         which it is (print the union / leave the report alone / something
         else) **with the two-sweep base rate re-measured at that revision**,
         and says what the choice costs. **Refusing is a satisfying outcome**,
         and so is finding that a third sweep handled the union correctly and
         the base rate is 2 of 3.
       - **Lane**: cloud-takeable — `report-prose.mjs` is node, and the base
         rate is a read of two roadmap entries.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **None are owed by this slice**, and that is structural: it
reads and re-measures, and its only writes are `ROADMAP.md` prose and a
`.roundtable/` report. No `.astro`, `.css`, docs page or generated artefact is
touched. The six visual debts carried forward are unchanged and unspent.

## Slice 335 — 297.1 answered: both issues landed in the right channel, and the router that was supposed to put them there was never used (2026-09-08)

**Dispatched by rule 4** as the oldest item that is not owner-blocked. `297.1`
became answerable only recently: it needed a real filed item, and Slice 332
had to fix the intake command before a wake could reliably read one.

**Its Accept asked for the property, not a happy answer**: *"one wake reports
on a real filed item, naming which intake it arrived in and whether that was
the right one. Finding that the router sent it to the wrong place is a
satisfying outcome."* The measurement is better than either branch it
anticipated.

### The channel was right. The router was bypassed.

Two issues exist, `#1` (closed) and `#2` (open). Both belong in Issues on
substance — `#1` is a defect with a pasted repro, `#2` is a feature request
carrying the real ERP scenario the template asks for. **So the channel choice
was correct both times.**

**But neither used a template.** Measured on the API rather than inferred:

```
curl .../issues?state=all   ->  #1 labels: NONE   body starts "## What happens"
                                #2 labels: NONE   body starts "## The gap"
```

`bug_report.yml` declares `labels: ["bug"]` and `feature_request.yml` declares
`labels: ["enhancement"]`, and **GitHub applies those automatically to anything
filed through the form**. Zero labels on both is therefore not a tidiness
detail — it is proof the forms were never rendered. `blank_issues_enabled:
true` is what let them through.

**So the six enforced fields never fired.** The bug form would have demanded
Version, Browser + version, Theme, Density, a minimal HTML repro, and
expected-vs-actual. Issue `#1` supplied a version, a repro and exact command
output **voluntarily** — which is the finding's sharpest edge: the intake
produced excellent input, and **the machinery I built is not what made it
good.** A disciplined reporter was.

### The verdict on `blank_issues_enabled`

**Left `true`, deliberately.** Both real issues are *better* than the form
would have produced — `#1` reasons about why the rough edge is worth fixing
and quotes the tool's own docstring; a six-field form has nowhere to put that.
Forcing every reporter through a form to protect against the ones who would
under-report is the ceremony this repo's base-rate rule refuses, and the
measured base rate here is **2 of 2 filed well without it**. The templates
stay as a floor for someone who needs the prompts, not a gate on someone who
does not.

### What is still untested, stated rather than quietly closed

- **The Issues-vs-Discussions router has still never been exercised.** Both
  issues were filed by the owner's own agent, which had no reason to consult a
  contact link. A stranger choosing a door remains unobserved.
- **The Discussions half is untested twice over.** Zero have been filed, and
  until Slice 332 the command that reads them **could not run in a cloud
  wake** — so a discussion filed any time before yesterday would have been
  silently missed by most wakes. The intake was broken for the whole period
  `297.1` was open waiting to test it.

1. [x] **297.1 — DONE.** A real filed item is reported, naming the intake it
       arrived in (Issues, twice, correctly) and whether the routing worked —
       it was **bypassed**, which the Accept explicitly names as a satisfying
       outcome. The config was not the thing that worked.

1. [ ] **335.1 — The Discussions intake has never returned a non-empty list,
       in either environment.** `332`'s REST fix is verified by controls (a
       404 on an unserved route, a known-content issues list) but never by an
       actual discussion, and `ENVIRONMENT.md` §8 says so outright.
       - **Accept** — the property: the day a discussion exists, a wake re-runs
         the REST command and confirms it appears with its number and title,
         then records that the intake is proved end-to-end. **Filing one to
         test it is explicitly allowed** and is cheaper than waiting — a
         throwaway Q&A discussion, checked, then closed, would settle it. What
         is NOT allowed is closing this on the controls alone; they prove the
         route is served, not that a real item surfaces.

## Slice 334 — 315.3: `check:selftests` now RUNS each self-test, because the third rung of its own ladder was open — and the two costs that were expected to refuse it both measure zero (2026-09-07)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item. Rule 1
no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**); rule 2
`Standardize 1 / 4 ok`; rule 3 `Objective 2 / 3 ok [332, 333]`; rule 5
`Optimize 0 wake-date(s) newer — ok`, so it was EVALUATED and does not fire —
its comparable set's only mover is `claims`, already day-paired at
`2026-09-06 169 -> 2026-09-07 170`. Rule 4's oldest open item is Slice 15, and
everything from there to `315.3` is owner- or input-blocked, re-derived from
each item's own text rather than carried from the hand-off: **15**
NEEDS-RUNTIME (owner hardware), **112.3** "BLOCKED ON OWNER BRIEFS", **112.4**
blocked on 112.3's verdict, **249.7** holds its remaining rows for 249.10 with
its first Accept clause already executed, **249.10-13** each `OWNER CALL`,
**273.2** `OWNER CALL` in its own heading, **296.3** `OWNER CALL`, **297.1**
waits on a filer who is not the owner. `315.3` is the oldest cloud-takeable
one, and its own Lane line says so.

**Step 1 read both intakes, with `ENVIRONMENT.md` §8's controls:**
`/discussions` → `HTTP 200, len 0`; `/not-a-real-route` → `HTTP 404` (so the
`200 []` means *served and empty*); `/issues?state=open` → `HTTP 200, len 1` —
issue #2, `updated_at` **2026-09-06T15:10:34Z**, unmoved for a third
consecutive hand-off. No new untriaged input, so Step 1 committed nothing.

### The Accept's own re-measurement first, and the base rate has moved twice

The item asks for the per-gate `--self-test` sweep re-run **with `dist` built**,
reading each gate's raw output rather than grepping one format. Run that way
(`selftest-sweep.py`, which dumps rc + stdout + stderr per gate and classifies
nothing):

| reading | figure |
|---|---|
| 315.3's honest row (snapshot) | **1 of 20** ran zero cases — `check-ci-ignores`, which **315.1 fixed** |
| here, at `1363ffb` | **0 of 20**. All twenty exit 0, classifying **157** cases between them |

And the *other* half of 315.3's first wrong reading — *"taken with no
`apps/docs/dist` — 4 gates died before their own branch"* — **no longer
reproduces at all**. With `apps/docs/dist` moved aside, all twenty
self-tests produce **byte-identical output** to the built-tree run. So do they
with `CHROME_PATH` unset, and so do they in the **docs-image context**
(`ROADMAP.md`, `LOOPS.md`, `CLAUDE.md`, `.roundtable/`, `.github/` and `dist`
all absent — exactly what `apps/docs/Containerfile` does not copy). Twenty
identical outputs across four contexts is a suspiciously tidy number, so it
carries a **control**: with `dist` parked, the *plain* runs of
`check-escaped-entities`, `check-learning-path`, `check-components-used` and
`check-notes` all exit **1** with an ENOENT under `dist`, while the same four
gates' `--self-test` exits **0** in the same tree. The absence was real and
consequential; the self-tests are simply independent of it.

That kills the objection that would have refused this outright.
`check-selftests.mjs` runs **first** in `check:repo`, which runs **first** in
`docs:build` — before `astro build` — so if any self-test needed `dist`,
executing them here could not work at all. None does.

### The decision: EXECUTE, with a marker — and why exit code alone is not enough

`315.1`'s defect is the argument. That gate had a real, correct, fully-written
`--self-test` block sitting **below** a `ci.yml` read that returned first, so
`node check-ci-ignores.mjs --self-test` exited **0 having classified nothing**.
A grep for the `process.argv` branch sees the branch; an exit code sees a zero.
Neither can see **reachability**, which is the only thing that was wrong.

So the contract is a **count**: a passing `--self-test` prints a line saying
`self-test passed` and naming how many cases it classified. A branch that never
runs cannot print one.

**It is a FORMAT, not a shared function, and that is forced rather than
chosen.** Three of the twenty live in `packages/core/scripts`, and core must
not import from `apps/docs` — `check-markup.mjs` says so in its own comment,
because it ships as a `bin`. A format is the only contract both packages can
hold. It was written to accept both shapes already in the tree, so adopting it
moved **3 gates, not 20**:

| shape | gates | change |
|---|---|---|
| `self-test passed — the detector can fail (18 cases)` | 15, via `gate-report.mjs`'s `selfTest()` | none |
| `resume charter self-test passed — 9 cases classified correctly` | `check-resume-charter`, `check-resume-slice-ids` | none |
| a passing verdict with **no count** | `check-markup`, `check-size`, `check-rf-floor` | one line each |

`check-rf-floor` is the one that needed more than a count appended: it folded
three assertions into a boolean chain and printed one sentence, so its three
booleans became a named `cases` array and the count is now derived from it.
Its failure diagnostics are unchanged.

**Cost, measured rather than feared.** Three runs each, same container:

```
scan only (scanGates, node startup included)    69 / 68 / 65 ms
the whole gate, twenty child processes        1355 / 1295 / 1300 ms
```

So `check:repo` grows by about **1.23 s**. `scanGates()` stays a pure read —
`derive-readme-facts` imports it to stamp a number on the npm front page and
must not spawn twenty processes to do so — and the execution lives behind the
run guard.

### Red-proved three ways, each with the injection confirmed present first

The control is the unmodified tree: `20 heuristic (all self-tested; 160 cases
actually run), 34 exact`, rc 0. **160 reconciles against an independent count**:
the sweep counted **157** per-case output *lines*, and `check-rf-floor` prints
none while now declaring **3**.

| injection | landed? | new gate | old grep-only logic |
|---|---|---|---|
| the argv branch made **unreachable** (an early `process.exit(0)` above it — 315.1's exact defect) | `grep -c -F ZZINJECT` = 1, and the argv branch is still in the source, = 1 | **rc 1**, *"exited 0 but printed no case count"* | **PASS** — `untagged 0, owed 0` |
| the count stripped from a passing verdict | 1 | **rc 1** | n/a |
| one fixture's expectation made wrong | 1 | **rc 1**, printing the WRONG case | n/a |

The first row is the whole point: **on an identical tree the new rung is red and
the old one is green.** Both were driven by an env var so the injected file was
byte-identical in the control run, and each was reverted with `git checkout`
plus a `grep -c` reading **0**.

**One thing this cost, recorded because it is the bulk-edit rule's cousin:** the
second revert used `git checkout <file>` on a file this slice had *also*
legitimately edited, and silently took the real edit with it. The gate went
green again only because the edit was re-applied; nothing would have reported
it. **Stage before injecting** — `git add -A` first, and `git checkout` then
restores the intended state rather than `HEAD`'s.

1. [ ] **334.1 — should `check-selftests.mjs` itself be `@heuristic` now?** Its
       verdict used to rest on a `readdir` and a tag comparison. It now also
       rests on matching `SELF_TEST_MARKER` against a child process's prose,
       which is recognising a pattern — a per-case *label* containing the words
       "self-test passed — 3 cases" would satisfy it. Filed rather than taken,
       because the retag is not a one-word edit: this file is **excluded from
       its own scan**, so it would have to stop being, which moves the two
       counts `derive-readme-facts.mjs` stamps onto the npm front page and
       requires a README re-stamp that `stamp-readme.mjs --check` gates inside
       the core build. Measured rather than forecast — `scanGates()` reports
       **54 / 20 / 34** today, so counting this file as a heuristic gate makes
       it **55 / 21 / 34**.

       - **Accept:** a recorded decision — either the retag, its `--self-test`,
         and both READMEs re-stamped in one commit; or a refusal naming what
         makes the marker match a format comparison rather than a judgement.
         **Refusing is a satisfying outcome**, and so is finding the premise
         false: re-read the tag definitions in this file's header before
         deciding, and say which one the marker match actually is.
       - **Lane:** cloud-takeable. No browser, no screenshot.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. **Nothing in this slice renders**: the diff is four gate
scripts and roadmap prose, and no `.astro`, `.css` or docs page is touched. The
six visual debts carried in the hand-off are unchanged and unspent.

## Slice 333 — 310.2: the five unrendered markup consts are deleted, and the reason is not tidiness — 3 of the 5 had already drifted from the showcase they describe (2026-09-07)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item.
Rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**);
rule 2 `Standardize 0 / 4 ok` — Slice 332 reset it at `14:24:44Z`, roughly six
minutes before this wake's first fetch, so the hand-off this wake read (written
at `534b097a`, two commits back) telling it *"the next wake dispatches rule 2"*
was already out of date; the counters were re-read rather than trusted. Rule 3
`Objective 1 / 3 ok`; rule 5 `Optimize 0 wake-date(s) newer — ok`, so it was
EVALUATED and does not fire. Rule 4's oldest open item is Slice 15, and
everything from there to `310.2` is owner- or input-blocked, re-derived from
each item's own text rather than carried from the hand-off: **15** NEEDS-RUNTIME
(owner hardware), **112.3** "BLOCKED ON OWNER BRIEFS", **112.4** blocked on
112.3's verdict, **249.7** holds its remaining rows for 249.10 (owner
vocabulary) with its first Accept clause already executed, **249.10-13** each
`OWNER CALL`, **273.2** `OWNER CALL` in its own heading, **296.3**
`OWNER CALL`, **297.1** waits on a filer who is not the owner. `310.2` is the
oldest cloud-takeable one, and its own Lane line says it is cloud-takeable
**in its delete form**.

### The premise reproduces exactly

```
for c in toastMarkup menuMarkup rowMarkup savingMarkup removeMarkup; do
  echo "$c $(grep -o "$c" apps/docs/src/pages/base/motion.astro | wc -l)"; done
#  each 1 — the declaration itself
```

And in the built page, each const's own comment text — `Entrance: a toast
arrives from the top edge`, and the four siblings — occurs **0** times in
`dist/base/motion/index.html`. The page ships **4** `<pre><code>` blocks, all
from the other four consts (entrance, collapse, pulse, spin).

### The deciding measurement: they are a second copy, and it has already rotted

The reason to delete rather than render is not that the code is dead. It is
that these five were a **hand-maintained second copy of markup the page
already renders live** in its "In context" section — the shape CLAUDE.md's
recipe forbids in one sentence: *"`Demo` renders a preview **and** its copyable
code from ONE string — never write the preview and code twice."* The predicted
consequence of writing it twice is drift, and the drift is here. Measured
against the BUILT page's own DOM, not the source diff:

| const | source declares | the page renders | |
|---|---|---|---|
| `toastMarkup` | `<div class="bo-alert bo-alert--success bo-motion-slide-in-block-start">` | same | MATCHES |
| `menuMarkup` | `<div class="bo-motion-scale-in">` | `<div class="bo-motion-scale-in bo-alert">` (+ `role="group"`, `<p>` not `<div class="bo-card">`) | **DIFFERS** |
| `rowMarkup` | `<tr class="bo-motion-pulse-once">` | `<tr class="">` — the class is applied by JS via `data-motion-class`, which is the *point* of that showcase | **DIFFERS** |
| `savingMarkup` | `<button class="bo-btn" … aria-busy="true">` + spinner span | identical after driving the click; inner markup equal after whitespace collapse | MATCHES |
| `removeMarkup` | `<tr class="bo-motion-fade-out">…</tr>` | `<div class="bo-alert bo-motion-fade-out">Line 30 — Anode kit</div>` | **DIFFERS** |

**3 of 5.** Rendering them — the other half of the Accept — would have shipped
three copyable samples that contradict the live showcase standing beside them.
That is worse than shipping nothing, and it is the answer to the item's own
"either rendered or deleted".

**The probe was wrong on its first run, and the failure is the one this repo
names.** v1's claim table was hand-transcribed, and its `removeMarkup` row
carried the *rendered* value in the "const claims" column — so it reported
`MATCHES` for a pair that differs. The instrument agreed with itself because
both columns came from the same side. v2 parses the const out of the source
with a regex whose failure throws, so the left column cannot be typed wrong,
and it carries a **control**: `entranceMarkup` IS rendered and must come back
`MATCHES`, which it does. 3-of-5 with a passing control discriminates; 5-of-5
would not have.

### Is this a class of defect? Measured: no — one page, and now zero

```
# frontmatter `const <name> = ` whose identifier occurs once in its own file
5 never-used const(s) across 152 .astro files   (before — all five on motion.astro)
0 never-used const(s) across 152 .astro files   (after)
```

So it is a one-page problem, not a pattern. **No gate was built** — see 333.1.

### Verifying the removal: the raw grep is the WRONG check here

The Accept says *"re-run the count above afterwards; it must read 0 for every
name that remains"*. Run literally it reads **2, 2, 2, 3, 2** — because the
comment this edit wrote to explain the deletion legitimately names all five
consts. That is CLAUDE.md's *"verifying a removal: assert on structure, never
on raw text"*, arriving in the criterion itself rather than in a script. The
structural forms both read clean:

- **comment-stripped identifier count** on the page: `0` for each of the five,
  and `2` for each of the four that legitimately remain (declared + rendered)
  — the controls are what make the zeros mean something.
- **the frontmatter's own declaration list**: `base, classes, DESC, INTENT,
  entranceMarkup, collapseMarkup, pulseMarkup, spinMarkup`.

### NOT VERIFIED does not apply to this one, and that is measured rather than argued

A cloud wake has no Podman, so no 1440/390 light-and-dark screenshots were
taken. **They are not owed here**: the built page is **byte-identical** before
and after — `md5sum` `f8886e3e9ee20f6464ae9545cd44d7aa` on both, 87,802 bytes
each, from a fresh `rm -rf apps/docs/dist && npm run docs:build` (all 139
built pages rewritten, mtimes 14:34:21-24Z). Which is the expected consequence
of deleting strings that reached the HTML zero times, and the two facts
corroborate each other.

Byte-identical is a suspiciously tidy number, so the comparison was
red-proved: `diff` of the same saved page against a *different* built page
reports a difference, so the instrument discriminates.

### Two things kept rather than deleted with the consts

- **The `--grid`-not-`--settings` reasoning (roadmap 292.9)** sat in a comment
  above `savingMarkup`. The live "Saving…" swap in the page's own `<script>`
  makes the identical choice, so deleting the const would have deleted the only
  record of why. Re-homed onto that handler, trimmed to the half that is still
  true, and it now says outright that it is the last site carrying the choice.
- **`check-deprecated-icons.mjs`'s header** used `savingMarkup` as its worked
  example of why phase 1 (SOURCE) is not redundant with phase 2 (DIST) — "a
  copyable string a page declares but does not render". That example no longer
  exists. The header now says the coverage claim is **prospective**, gives the
  before/after base rate, and warns against reading the empty population as
  evidence the phase is redundant. Found by grepping the const names repo-wide
  before editing, which is the step that keeps a snapshot in a comment from
  going stale silently.

### The gap this leaves, stated rather than left to be rediscovered

The "In context" section now carries **no copyable block**, alone among the
page's sections. That is recorded in a template-adjacent comment in
`motion.astro` itself, with the condition for closing it: render preview and
code from one string, never re-add a hand-copy. Doing that adds `<pre>` blocks
to a built page — the half `310.2`'s own Lane line assigns to a local wake.

1. [ ] **333.1 — should a gate forbid a never-used frontmatter `const` in an
       `.astro` page?** Not built in this item, and the reason is that the
       evidence points both ways and neither direction is this item's to
       settle. **For**: the predicate is *exact*, not semantic — an identifier
       occurring once in its own file — so 94.11's wall does not apply, the
       failure took roughly a month to notice, and it produced three drifted
       samples. `310.1`'s own precedent is the strongest argument: a gate there
       earned its place at a clean base rate *because the population had held a
       violation a day earlier*, which is exactly this population. **Against**:
       the base rate after this fix is **0 of 152**, so an empty exemption map
       would be the gate's steady state from birth, and the ordinary tool for
       it is `noUnusedLocals`, which nothing here sets. **Say precisely what
       the tsconfig situation is, because a first pass here got it wrong and
       the correction changes the argument**: `tsconfig.base.json` and
       `packages/core/tsconfig.json` both exist (`strict: true`, no
       `noUnusedLocals`), but the core one's `include` is `src/js/**/*.ts`, and
       `apps/docs/` has **no `tsconfig.json`** and no `astro check` step — so
       no TypeScript configuration in this repo has ever looked at a docs
       `.astro` file. The cheaper fix may still be a compiler flag plus the
       config that would make it apply, rather than a 54th gate; that is more
       than a one-line change, which is part of what this item weighs.
       - **Accept** — the property, not a predicted outcome: one wake records
         which of the three it is (gate / `tsconfig` / neither) **with the
         base rate re-measured at that revision**, and says what the choice
         costs. **Deciding to build nothing is a satisfying outcome**, and so
         is finding the base rate has moved off zero.
       - **Lane**: cloud-takeable — the scan, the `tsconfig` spike and the
         decision are all text and node.

## Slice 332 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 led to a mandated intake command that CANNOT RUN where most wakes run (2026-09-07)

**Dispatched by rule 2**, OVERDUE at `4 / 4`. Say `n of 4`: **4 of 4 lanes
run.**

- **Lane 1 — `scan:dead-style`: clean.** 0 dead style attributes across
  **1,365** live ones. The instrument changed under this lane since the last
  sweep — it now counts style *attributes* and reports separately that 357 of
  them carry more than one declaration, which it cannot judge individually.
  Noted so a later reader does not compare 1,365 against an older sweep's
  1,433 and read a drop that is a unit change.
- **Lane 2 — `report:css-repeats`: clean, no delta.** `74 · 242 · 230 · 8`,
  unchanged for a fourth consecutive sweep.
- **Lane 3 — `report:prose`: clean.** 119 pages, median **798**, **113,787**
  words, 10 over 2x. Every one of the 10 flagged pages carries a verdict in
  `ROADMAP.md` or the archive — checked per page rather than assumed from the
  count.

  **Amended 2026-09-07 by 336.1B — the flagged set is 15, not 10, and this
  sweep checked the corpus half.** The lane flags *"over 2x the CORPUS median,
  **or** over 2x its FAMILY median"*: corpus 10, family 11, **union 15** —
  re-run at `6a009a4b`, not at this slice's own commit, and it reproduces this
  sweep's corpus half exactly (`119 · 798 · 113,787 · 10`), which is what
  licenses reading the family half back onto it. The
  five never checked here are `/base/motion/`, `/concepts/layouts/`,
  `/concepts/js-behaviors/`, `/concepts/design-language/` and
  `/concepts/scale/`. **The verdict stands** — all 15 are in the 16-set
  enumeration, so the lane is genuinely clean; what was wrong is the population
  the cleanliness was asserted over, and the *"checked per page"* sentence is
  what made the gap invisible. Slice 326 printed `union = 15` in its own entry.
  Whether the report should print the union is `336.2`.
- **Lane 4 — the ratchet: carried the finding**, via `ENVIRONMENT.md`.

### The finding: Step 1 mandates a command no cloud wake can execute

`ENVIRONMENT.md` read **16 up, last cut 2026-08-30** — 8 days, and it has
**doubled**: 391 → 731 lines, 3,130 → 6,316 words, in the file Step 0 makes
every wake read before it does anything. Reading what had accumulated found
its §8, and §8 is about a defect **this author shipped**.

`LOOPS.md` Step 1 mandated the two intake commands as `gh` invocations —
including the Discussions GraphQL query added in Slice 297. **Neither runs in a
cloud wake**: there is no `gh` binary in that container, and its GraphQL
endpoint is refused outright (*"only the pinned set of PR-review operations is
served"*). The issues half has an MCP tool and merely looks different; **the
Discussions half has none**, and a cloud hand-off recorded the honest
consequence — *"Discussions were not checked this wake."*

**This is the "a gate that only runs in CI is not known to work" rule pointing
the other way.** The commands were written and verified on a local Mac, and
never in the environment that runs most wakes. A mandated intake that silently
cannot execute is exactly what that rule exists to prevent, and Slice 297's own
`297.1` — *"the router is still untested"* — was open the whole time without
anyone noticing the intake itself was the untested half.

**Fixed, with a form verified in BOTH environments.** Step 1 now mandates the
REST route (roadmap 302.1 found it; this slice applies it), with its controls:

```
curl -sS -H "$H" "$R/issues?state=open"       200, len 1
curl -sS -H "$H" "$R/discussions"             200, len 0
curl -sS -o /dev/null -w '%{http_code}' "$R/not-a-real-route"   404
```

**The 404 line is the load-bearing one.** An empty `[]` is what *"no open
discussions"* looks like AND what an unserved route looks like; the 404 is what
makes the `200 []` mean **served and empty** rather than *not answered*. Same
shape as trap 2, one API over. Re-run locally for this slice: identical
`200 len 0` / `404` / `200 len 1`, so the command is portable rather than
merely documented as such.

**Not red-proved, and said plainly**: nothing has ever been filed in this
repo's Discussions, so the route has never been seen returning a non-empty
list. The controls are the strongest evidence available without filing one,
and `297.1` already carries the obligation to check on the day one appears.

1. [ ] **332.1 — `ENVIRONMENT.md` doubled in 8 days and every wake reads all
       of it.** 391 → 731 lines, 3,130 → 6,316 words since its last cut, with
       **17** top-level sections — **amended 2026-09-07 by 336.1A, which read
       18**: `grep -c '^## '` → 17, `grep -c '^#'` → 18, the extra one being
       the file's own H1 title, which cannot move. Taken the same way at the
       last cut the figure is 14, so the growth is **14 → 17 sections**. It is
       Step 0's first read, so its length is a
       tax on every wake, and 169.3 already split it out of `RESUME.md` for
       exactly this reason once.
       - **Accept** — the property, not a target size: each section either
         still describes a trap that can bite a wake TODAY, or moves to
         `LOOPS-archive.md` with a pointer. **Finding that all 18 still bite
         is a satisfying outcome** and closes this — the file is long because
         the environment is hostile, not because it is untidy. Measure before
         cutting: a section whose trap is fixed in the toolchain is the only
         safe cut, and §1c is the worked example of one that looked stale and
         was not.

## Slice 331 — 294.2: the input block is fixed rather than reported, and all six proposals carry a verdict (2026-09-07)

**Dispatched by rule 4** as the oldest genuinely dispatchable item. `249.7`
and everything between it and here is owner-blocked; `294.2` was the oldest
that was not — except it was **INPUT-BLOCKED**, and had been for **eleven
hand-offs** before Slice 316 diagnosed it.

### The block was fixable, and reporting it a twelfth time was the wrong move

`294.2` could not be worked because the six proposals live in an owner-supplied
zip no wake in this repo could read; ranking them would have meant inventing
verdicts. Slice 316 was right to refuse on that ground. What none of the twelve
wakes did was **make the material readable**.

**It is now on a branch**: `contribution/upstream-2026-09-06`, the zip's
`upstream-contribution/` tree byte-for-byte under `.contribution/`, 31 files,
416 kB, scanned for secrets first (the only `token` hits are *"semantic token
tier"* in prose). **Not on `main`, and nothing is adopted** — that is this
item's own first clause. Every verdict below cites a path a later reader can
open, which is the whole point.

**This is `321.1`'s defect fixed as a class rather than an instance.** That
finding — a gauntlet verdict whose artifact lived in a session scratchpad and
is now unreproducible at every revision — is the same shape: evidence a later
wake cannot re-read. Landing the folder is the general fix.

### The six verdicts

| # | Proposal | Verdict |
|---|---|---|
| 1 | Brand mark | **OWNER CALL** — deferred, not refused |
| 2 | `registry.json` + `install-prompts.md` | **SPLIT**: refuse the registry, adopt-with-changes the prompts |
| 3 | Gauntlet bar | **ADOPTED WITH CHANGES** — already landed, Slice 296 |
| 4 | Static reference consumer | **REFUSED** — duplicates a shipped capability |
| 5 | Modern CSS layer | **SPLIT** — one part landed, one blocked by its own gate, one withdrawn by its author |
| 6 | `proposals/` | **REFUSED as product**, kept as reference |

**1. Brand mark — OWNER CALL, and the contribution is right that it is one.**
It is the single decision in the folder with no traceable source; everything
else can be checked against the repo. Nothing a wake measures can settle a
mark's taste, so it is deferred rather than refused.

**2. Registry + install prompts — the two halves get opposite verdicts.**
`registry.json` carries `$schema: ui.shadcn.com/schema/registry.json`; publishing
into that ecosystem advertises this framework to consumers expecting React
components, which Slice 296 already refused and which nothing here reopens.
**`install-prompts.md` is the transferable half and it survives inspection**:
its 59 `bo-*` classes were checked against the shipped `api.json`, and
`check-markup` over its 53 extracted markup blocks reports only placeholder
syntax (`data-overflow="start|end|both"` — the prompt's "pick one" notation,
not a claimed value). *(A first pass reported `bo-dropdown` and `bo-tabs` as
missing; that was this wake's own extraction, not the prompts — both exist,
in `data-table.css` and `tabs.css`. The instrument's first output was wrong,
as usual.)* **The change it needs is that it must be GENERATED.** The
contribution's own header says it is generated from `react/*/*.prompt.md`,
sources deliberately excluded upstream — so as landed it would be a
hand-maintained file duplicating `api.json`, which is the drift shape Slice
244 and the `registry.ts` refusal both name. Adopt only when generated from
`api.json`; filed as `331.1`.

**3. Gauntlet bar — adopted with changes, and already shipped.** Slice 296
landed `BAR.md` / `CRITIC.md` / `ROUNDS.md` adapted to references that exist
here, and Slice 305 ran the full three-round budget through them. Recorded so
the verdict table is complete.

**4. Static reference consumer — REFUSED, on a measured duplication.**
Its stated value is a no-server HTML+HTMX consumer. **`examples/erp-suite`
already ships a static `dist/index.html`** openable with `file://` and has no
`package.json` or server at all, so the no-server demonstration exists. A
second consumer is coverage duplication — the "re-photographing" the pattern
recipe refuses — and it would carry a hand-transcribed `behaviors.js` copy of
three real behaviours, a second source for shipped code.

**5. Modern CSS layer — three parts, three states**, and the contribution's
own instructions are what decide two of them. Its `derive-floor` probes for
`light-dark()` / `oklch()` / `scroll-state()` **landed as `294.1` in Slice
311**. The **OKLCH PR stays blocked** on the ΔE00 round-trip its own `PR.md`
requires — *"do not merge it on the promise of measuring later"*, which is
this repo's rule too. **`surface.css` is withdrawn by its own author** as not
proposed upstream, since it changes shipped visuals for every consumer. The
live remainder is the guarded-feature edits, which must land as the seven-PR
split rather than a `modern/` folder; not opened here.

**6. `proposals/` — refused as product**, which is what its author says it is:
`future-erp/` is two exploration screens and `DESIGN-md-additions.md` is prose
distilled from this repo's own docs. Kept on the branch as reference.

2. [x] **294.2 — DONE.** All six carry a recorded verdict with its reason, and
       the refusals are as complete as the adoptions, which the Accept asked
       for. The brand mark remains the one **OWNER CALL**, as the contribution
       itself identified.

1. [ ] **331.1 — `install-prompts.md`, generated from `api.json`.** The only
       proposal that survives inspection and is not already landed, blocked,
       or withdrawn. Its content checks out; its provenance does not — as
       supplied it is hand-maintained and duplicates data `api.json` already
       carries, which is the drift the `registry.ts` refusal names.
       - **Accept** — the property: a prompt block is derived from `api.json`
         for every component, so adding a component produces its prompt with
         no hand edit, and `check-markup` passes over every emitted block.
         **Measure the base rate first**: if the generated output would differ
         materially from the 40 hand-written blocks, that difference is the
         finding and is worth reading before shipping either. **Refusing on
         the ground that the docs pages already carry copyable markup is a
         satisfying outcome** — `Demo` renders preview and code from one
         string today, and a second copyable surface may be the duplication
         this item exists to avoid.

## Slice 330 — Objective grill of Slices 310, 328, 329: 23 of 25 reproduce, and the figure that does not is the one a design refusal rests on (2026-09-07)

Dispatched by rule 3, OVERDUE at `3 / 3`. No prior grill names any of the
three, so nothing was dropped. **Two of the three are this author's own**, so
verification went to a **fresh-context agent, not a fork** — a fork inherits
the builder's reasoning, which is the shape §3b step 4 exists to prevent.

### The finding: a refusal justified by an unstable extrapolation

Slice 329 refused 249.9's build-time miniature and published the cost that
decided it: *"29 kB per PNG · ~1.1 MB for 40"*, extrapolated from **five**
components. The verifier's own five-component sample read **49 kB and
1.91 MB**. Neither is right. Measured as a **census over all 39** component
pages that have a demo section:

```
39.1s · 0.89 MB total · per PNG 2.2 kB min, 60.7 kB max, 23.3 kB mean
```

**Per-PNG size spans a 28x range**, so a five-sample mean is not a statistic —
which is precisely what CLAUDE.md says about a suspiciously convenient number,
and the two independent samples landing on either side of the truth is the
cleanest possible demonstration. **The slice recorded no command**, so the
discrepancy could not even be attributed until someone re-measured from
scratch.

**The conclusion survives and the number did not.** 0.89 MB is ~10x the
framework's own 93 KiB, so the refusal is unchanged — a still picture of a
demo that is live one click away still does not earn ten framework-sizes of
repo weight. But the figure was **written into the shipped page header** as
the reason the design looks the way it does, which is the one place a wrong
number does real work. Corrected in both places, with the command shape now
beside it.

**This is 192.1 landing again**: the defect is in what shipped BESIDE the
verified thing. 329 red-proved its gate edit properly and got that right; the
number it did not red-prove is the one that was wrong.

**Second correction, wording only:** 329 said *"42 cards across 8 groups"*.
`COMPONENT_GROUPS` has **7**; the eighth `<h2>` is the `Related` footer. The
probe counted headings, not categories.

### What held

**Slice 310 — 8 of 8**, including the deprecated-glyph site counts at their
own revision, the 26 shipped glyphs, and `check-markup` at 4,229 across 28
files.

**Slice 328 — every load-bearing figure to the digit.** An independent browser
probe reproduced **103 / 11 / 8 / 14** live framework elements inside
`section.demo`, and the **30 of 30** base rate that refused its gate. The
verifier's own first reading was 31/31 — it had followed a redirect
(`base/tokens` → `/reference/tokens`) — and it caught and reported that as its
own instrument error rather than filing it against the slice.

**Slice 329's gate red-proof reproduces under an independent injection.** The
verifier injected its own orphan component page twice; the gate failed both
times naming the file, on the reachability arm and the `Related` arm, and
returned green at *40 component pages … 41 reachable* after removal.

### Refused

- **A gate over "a published figure carries the command that produces it".**
  The predicate is semantic — no regex separates a figure that needs a command
  from prose that mentions a number — and this repo has refused that shape
  six times on 94.11. The fix that works is the one applied: put the command
  next to the claim.
- **Re-filing 329's group count as a defect.** It is wording; the conclusion
  (every field generated) never depended on it.

1. [ ] **330.1 — Sampling is now a named failure mode here, twice.** 301 quoted
       a working tree as a commit's state; 329 quoted a five-sample mean as a
       population. Both were caught by re-measurement, neither by review, and
       both were figures that justified a decision rather than described one.
       - **Accept** — measure before proposing anything: count how many
         published figures in the live `ROADMAP.md` rest on a sample or an
         extrapolation rather than a census, and whether any is load-bearing
         for a still-open decision. **Finding that this is two instances and
         not a pattern closes it** — two occurrences by one author in one day
         may be a habit to correct rather than a systemic gap, and a gate over
         "is this number a census" is the semantic wall 94.11 names.

### AMENDED by the colliding wake, 2026-09-07 — one finding this grill did not cover

**A second dispatcher ran this same grill concurrently and lost the race**
(Step 0c, collision #3 — see `LOOPS.md`). Its census and its group count were
both **wrong where this slice is right**, and that is recorded here rather than
discarded, because the two errors are the ones this slice's own findings
predict:

- its census read **42 components / 1.03 MB / 25.1 kB mean** against the 39 /
  0.89 MB / 23.3 kB above, because it enumerated `readdir(dist/components)` and
  swallowed **`demos/` and `nav/`** — two directories that are not component
  pages. The population came from a *convention* (a directory listing) instead
  of from `api.nav`, which is CLAUDE.md's *derive names from the generated
  source, never from a convention*, arriving in a denominator.
- it recorded *"42 cards across 8 groups ✓"* as reproducing. `COMPONENT_GROUPS`
  is **7**; the eighth `<h2>` is the `Related` footer, exactly as this slice
  says. A heading count is not a category count — the same detector shape
  39.2 produced four of.

**Amended per 236.2** (the archive and closed text may be corrected), and it is
worth the paragraph because two independent censuses disagreeing by 3 pages is
the strongest available evidence for 330.1's premise: the population is as easy
to get wrong as the sample was.

**The one finding that survives, and it is not about sampling.** Slice 328
re-publishes a figure banked from `249.6` — *"the anchored predicate the item
banked (17 of 31, which does discriminate)"* — with **no command beside it**.
Re-deriving it takes four attempts, because *"31 learning-path pages"* names a
corpus that does not exist:

| reading | count |
|---|---|
| source `.astro` under gs+concepts+base | 18 of **30** |
| `check-learning-path`'s OWN corpus (`ON_PATH = /^\/(getting-started\|concepts)\//`) | 16 of **24** |
| built pages, gs+concepts+base | 18 of **30** |
| built pages, gs+concepts+base, **`skipRedirects: false`** | 18 of **31** ✓ |

Only the fourth resolves the 31, and it needs two undisclosed choices at once:
include `base/`, which `ON_PATH` excludes and which the name *learning-path*
therefore contradicts, **and** stop skipping redirect pages, which `distPages`
does by default. The predicate itself is faithful — the gate's own `contentOf`
anchor, `html.slice(html.indexOf('<section class="demo"'))`.

**The +1 on the numerator is drift, not error.** 30 of the 31 pages changed
since `856ede33` while the corpus size did not move (24 + 6, then and now), so
one page gained a pattern link inside its demo region. And `17/31 = 55%` — the
percentage the slice prints beside it. CLAUDE.md's tell exactly: *a commit's
own numbers always reconcile*, so review could not catch this and only
re-running could.

**The conclusion is untouched.** 18/31, 18/30 and 16/24 all discriminate, so
Slice 328's argument — that the anchored predicate discriminates on *which
mechanism* rather than *whether* — stands whole. The sibling figure in the same
249.6 paragraph reproduces sharply: whole-page, *"the page contains a pattern
link"* reads **24 of 24** uniformly true, per-page minimum exactly the published
**78** (the upper bound is now 136; those pages have grown). That is what makes
this a **retrievability** defect and not a sloppy wake.

**No new item, deliberately.** The remedy is already this slice's own — *put
the command next to the claim* — and the gate over it is already **Refused**
above on the semantic wall. Re-proposing it under a second id would be the
duplicate this amendment exists to avoid. The redirect mechanism is also the
same one this slice records its verifier stumbling over on `base/tokens`, one
paragraph up: **two wakes, two instruments, one undisclosed corpus choice.**

## Slice 329 — 249.9 built: the component catalogue ships with every field generated, and the miniature it specified is refused with the cost it asked for (2026-09-07)

**Dispatched by rule 4.** The oldest open item is `249.7`, and it is
**owner-blocked in substance though it does not look it**: its first Accept
clause is already executed (the seed spot-check ran, four of five rows
refuted), and its own text says settling the rest before `249.10` — an OWNER
CALL for the SAP/Fiori vocabulary — *"would decide it on the thinnest version
of the input"*. Reported per rule 4's instruction to say **which kind** of
blocked, and skipped. `249.9` is next, its dependencies (`249.8` tagline,
`249.3` maturity labels) both landed.

### The miniature is refused, with the measurement the Accept demanded

`249.9` specified *"a build-time miniature via `browser-harness.mjs`"* and its
Accept required *"the cost of miniature rendering measured and written into
the item before it closes"*. Measured first, rendering the first demo section
of five real component pages at 640px:

```
39 components (one has no demo section) · 39.1s
0.89 MB total · per PNG 2.2 kB min, 60.7 kB max, 23.3 kB mean
```

**⚠ THOSE ARE THE CORRECTED FIGURES (Slice 330).** As first published this
read *"29 kB per PNG · ~1.1 MB for 40"*, extrapolated from five components,
and it **does not reproduce**: an independent five-component sample read 49 kB
and 1.91 MB. Both estimates are wrong, in opposite directions, because per-PNG
size spans **2.2 kB to 60.7 kB** — a 28x range — so no five-sample mean is
stable. The census above replaces both. The slice also recorded **no command**
for the original figure, which is why the discrepancy could not be attributed;
the page header now carries the command shape.

**0.89 MB is roughly ten times the framework's own 93 KiB minified**,
carried in the repo and shipped in `dist`, to show a still picture of a demo
that is live, interactive, and one click away on the card's own link. That is
**re-photographing** — the same thing the pattern recipe already refuses when
it bars per-domain demo variants. Refused; the card links to the living thing
instead, and the page says so in its own opener rather than leaving a reader
to wonder where the pictures are.

### What shipped

`/components/` — the section front door, the role `patterns/index.astro`
already plays. **Every field on every card is generated**: tagline and
category from `api.json`'s `meta` (249.8), JS status from `behaviors.json`'s
`byComponent` (0.8.0's `serves` work), the CSS floor from `floor.json`'s
`perComponent` (249.3), the DSA score and date from `dsa-scores.json`. 42
cards across **7** groups (published as 8 — the eighth `<h2>` on the page is
the `Related` footer, not a category; corrected in Slice 330).

The per-component floor is the field that earns its place: **Button reads
Chrome/Edge 99 and Dropdown reads 117**, which is exactly the distinction
`249.3` built `perComponent` for — a consumer importing one component is not
held to the framework's whole floor.

**Two badges, not three, and the floor demoted to muted text.** Three heavy
badges per card made the grid unreadable. The two that remain are the ones a
reader decides *from* — does it need JS, how is it scored; the floor is a fact
you check rather than scan.

### A defect in this wake's own code, caught before it shipped

The first render showed **six** cards reading *"No tagline in its CSS header
yet"*. Four were honest (anchors and page-only entries with no CSS directory).
**Two were wrong**: `/components/alerts` and `/components/state-patterns` are
real components whose PAGE slug differs from their CSS directory (`alert`,
`state`). Looking up `api.components[pageSlug]` silently missed them.

This is CLAUDE.md's named trap — *"page slugs are not class names: `alerts` →
`bo-alert`"* — and `api.json` ships a `pageSlug` map for exactly it. Inverted
that map rather than special-casing the two, so a third alias is handled
without an edit. After the fix, cards reading "no tagline" went **6 → 0**, and
the two remaining absences are the genuine anchor entries, whose text now says
*why* ("a section of another component's page — no stylesheet of its own")
rather than implying a gap that is not there.

### The gate edit, and its red-proof

`check-page-shape` failed the new page: it requires every `.astro` under
`pages/components/` to have a sidebar entry, and a front door belongs in no
category. Fixed on both sides rather than by exemption alone —

- **Reachability made real**: the landing nav and CTA now point at
  `/components/`. They pointed at `/components/data-table` and
  `/components/button`, arbitrary components, because no index existed.
- **The gate stops treating a front door as a component**, mirroring the
  `PATTERN_SECTIONS_EXEMPT` the patterns index already has, with the reason in
  the code.

**Red-proved, because the edit was to a gate**: injecting an orphan component
page with no sidebar entry still fails it, naming the file on both the
reachability and Related arms; removing the probe returns it to green at 40
component pages and 41 reachable. The gate's property — no COMPONENT page goes
unreachable — is unchanged.

Full docs build green, `check:links` verifies **14,586** internal links, 2
columns at 1440px and 1 at 390px.

9. [x] **249.9 — DONE.** Every badge traces to a JSON key, or the card renders
       the absence and names its reason, which is 249.3's standing rule. The
       miniature cost is measured and written into the page's own header —
       the Accept's other half — and the miniature refused on it.

## Slice 328 — 249.6 built: the router lands, its "three rows have no rendered result" premise was FALSE, and the gate its Accept asks for cannot discriminate (2026-09-07)

**Dispatched by rule 4** on the oldest open item. Counters clear
(`Standardize 0/4`, `Objective 0/3`). `249.6` had been **declined twice by
cloud wakes** as browser-blocked in the screenshot sense — a six-row block
lands on the site's front door — and explicitly reserved for a local wake.
This is that wake, so there was no collision to lose.

### The premise was wrong, for the third time in this item's history

`249.6` recorded, from a cloud measurement, that **three of six rows lack a
qualifying terminal page** — `getting-started/scope`, `concepts/js-behaviors`
and `concepts/theming` each reading 0 `Demo` and 0 `/patterns/` links. Re-run
before building, per the item's own premise rule. The pages are **not** prose
stubs. Measured in the DOM, inside `section.demo`, with docs-shell chrome and
`<pre>` samples excluded:

| page | demo sections | live framework elements |
|---|---|---|
| `concepts/js-behaviors` | 8 | **103** |
| `concepts/theming` | 6 | **11** |
| `getting-started/scope` | 4 | **8** |
| `getting-started/installation` *(this one PASSED)* | 8 | **14** |

**All three "✗" pages render more than one that passed.** `theming` renders a
real shipped `brand-indigo` preset; the detector missed it because it looks
for the `Demo` **component** and `/patterns/` hrefs, not for a page that shows
something.

**This is CLAUDE.md's own recorded error, repeating.** *"Only 1 of 18
learning-path pages shows anything working"* — the true figure was **16 of
18**, because the detector counted uses of the `Demo` component rather than
pages that show anything. Same instrument, same mistake, one item later. It is
the third wrong measurement inside `249.6` specifically: first the CTA count
(refuted by Slice 253), then *"the theming row has none"*, now this.

### The Accept's gate is refused, on a base rate

The Accept asks for a `check-learning-path`-style arm asserting each row's
terminal page shows a result. Measured before writing anything, per 94.11 —
the predicate *"renders ≥1 live framework element inside a demo section"*,
across every `getting-started`, `concepts` and `base` page:

```
pages checked: 30 | renders something: 30 | renders nothing: 0
```

**30 of 30. Uniformly true, so it distinguishes nothing** — a detector that
cannot fail, which is the shape this repo refuses. And the anchored predicate
the item banked (17 of 31, which *does* discriminate) discriminates on the
wrong thing: it separates pages by **which mechanism** they use to show a
result, not by **whether** they show one. It would fail `js-behaviors` at 103
live elements while passing a page that renders nothing and carries a single
pattern link. Gating that would be fitting the pages to the gate, which the
item itself names as the thing not to do.

**So: no gate, and no new demos.** The property the Accept wanted is already
true of all six rows; it was the measurement that said otherwise.

### What shipped

A six-row **adoption-scenario router** on `index.astro`, headed *"Start from
where you are"*. Every other router on the site — nav, sidebar, task tiles —
sorts by component category, which answers *"where is the thing called X"*.
None answered *"I am in situation Y, where do I start"*, which is the question
someone arriving from npm has. No rows cut.

Verified live at both mandated widths: **3 columns at 1440px** (a clean 3+3,
after `--bo-widget-min` was raised from 17rem where 4+2 left two orphans) and
**1 column at 390px**. All six hrefs resolve — `check:links` verifies 14,458
internal links against `dist`. Full docs build green.

6. [x] **249.6 — DONE.** The router ships with all six rows. The Accept's gate
       is **refused** with the base rate that decided it (30/30 uniformly
       true), and the three-✗ premise it rested on is refuted with the DOM
       measurement above. Its open question — *"or three of the six rows
       cut"* — is answered: nothing is cut, because nothing was missing.

1. [ ] **328.1 — The `Demo`-component detector has now produced a wrong count
       twice, a month apart, and nothing stops a third.** Once as *"1 of 18
       learning-path pages"* (true figure 16 of 18) and once as `249.6`'s
       three-✗ table. Both times the fix was local to the item; the detector
       shape survives.
       - **Accept** — measure before building: count how many live instruments
         still ask *"does this page use `Demo`"* when the question they are
         answering is *"does this page show a result"*. **If the answer is one,
         close this as not-a-pattern with the count** — two occurrences a month
         apart in the same item family may be one habit rather than a
         systematic gap, and a gate over it would be the ceremony 94.11 names.

## Slice 327 — Objective grill of Slices 309, 323, 326: 74 of 75 published assertions reproduce, and both defects are in prose sitting BESIDE a measurement that is correct — one route claim nobody ran a command for, and a negative control whose own record destroyed it (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, local `main` stale at the pre-rebase
`26447ba9` while `HEAD` sat on `48e181a3`), fixed with `git checkout -B main
origin/main` before any commit. `origin/main` again a **forced update**
(`26447ba...48e181a`). **This entry first said the trap had NOT bitten**, on the
strength of `git rev-parse HEAD origin/main` agreeing at Step 0 — which is
`ENVIRONMENT.md` §1's named false comfort, published inside a grill about
unmeasured sentences and caught by re-running the one command that answers it.
Trap 2 clean in one
`--unshallow` (**2,013** commits, no `shallow.lock`), tags again arrived with it;
`git tag | wc -l` → **8**. Working tree clean, `RESUME.md` reporting nothing in
flight. Step 1: both intakes read via `ENVIRONMENT.md` §8's REST substitute with
both controls in the same run — `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. Issue #2's
`updated_at` unmoved at `2026-09-06T15:10:34Z`; **no new input, so Step 1
committed nothing.** Step 2: rule 1 **0** open P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0'`); rule 2 `Standardize 0 / 4 ok`; **rule 3
matched at `Objective 4 / 3 OVERDUE [307, 309, 323, 326]`**.

**Scope narrowed per §6 step 0.** **307 is dropped** — grilled in full by Slice
309, which is itself in this arming set (`grep -hoE '^## Slice [0-9]+ — Objective
grill of Slices [0-9, -]+'` over both roadmap files names it). Grilled here:
**309, 323 and 326**. That leaves a grill inside the set, which is legitimate —
its published findings are claims like any other — and 309 is where the one
false assertion is.

**What was re-derived, and how much of it.** Every figure below was run, not
read off the slice: **75 published assertions**, 49 in Slice 326, 9 in Slice 323,
17 in Slice 309. **74 reproduce.** The commands are in
`.roundtable/grill-objective-309-323-326-2026-09-07.md`.

Two of the three slices are clean:

- **Slice 326 — 49 of 49.** `report:prose` still reads 118 pages of 127 · median
  792 · mean 953 · total 112,395; 10 over 2x the corpus median (1,584), 11 over
  a family median, **union 15**, and all 15 sit inside the 16-set the fixed
  clause enumerates (`158.1`'s twelve resolve to twelve page paths in the
  archive; `161.1`'s three; `178.3`'s `/concepts/scale/`). The commit forensics
  reproduce to the second (`87bf0f54` 07:42:07Z, `e5edf61f` 19:46:14Z, ancestor
  true). Lane 1 `0` dead of **1,272** attributes / 1,677 declarations / 273
  multi; lane 2 74 files · 242 rules · 230 bodies · **8** repeats in the shape
  one x4, two x3, five x2, the x4 group still money ×2 + quantity ×2. Lane 4's
  per-section table reproduces **row for row** against an independently written
  splitter — Step 1 300→671, rule 3 660→963, rule 5 349→573, Step 0 563→714, the
  loops table 214→266, and **Step 0c flat at 936**, which is the row the whole
  "not regrowth" verdict rests on. The region reads **6,759** words, `+1,101`
  since `8848ed55` (confirmed to BE 274.2's cut), and — checked because
  `ENVIRONMENT.md`'s figure rule predicts the opposite — **6,759 at the slice's
  own commit as well as at its parent**, because 326's `LOOPS.md` edit landed
  below `## Playbooks`.
- **Slice 323 — 9 of 9.** The commit-granularity replay run against the slice's
  own commit reads `958 revisions -> 581 STALE, 323 ok, 51 SKEW` exactly, and
  the 51 resolve to the **seven** occasions the script's header names, dates and
  metric names matching. The as-of-DATE replay it refused reads **26 wake-dates,
  13 ok / 13 STALE, zero SKEW** — so the "the obvious replay says refuse this"
  claim is reproducible, which is the part that made the finding.

1. [x] **327.1 — Slice 309 published a three-route claim that is true of one
       route, and no command was ever run for it. Corrected in place.**

       The blast-radius table above it is right and reproduces: exactly **two**
       routes carry a `.bo-data-table__select-all` (`/pos` at
       `server.mjs:458`, `/stress` at `1462`), and `grep -rc 'bo-alert__dismiss'`
       over `examples/po-app/` still reads **0**, so `initAlerts` was inert. The
       sentence beside it is not:

       > `/movements`, `/inbox` and `/receive` were unaffected: each runs its own
       > inline `initDataTables()`.

       ```
       grep -n 'initDataTables()' examples/po-app/server.mjs
       #  158   the shared page() template (the line 1f75dab4 broke, since fixed)
       #  1006  movementsScreen — the ONLY inline call in the file
       ```

       `/receive` and `/inbox` run none. Worse for the stated reason: counted
       inside each screen's own source span, **each renders exactly one
       `.bo-data-table-container`** — precisely the element `initDataTables`
       binds (`packages/core/src/js/behaviors/data-table.ts:98-101`,
       `querySelectorAll('.bo-data-table-container')`). Both were **unbound for
       the same 15 days**, which is the opposite of what the sentence says.

       **The conclusion survives, and that is the whole shape of the defect.**
       Neither screen carries a `.bo-data-table__select-all` or a
       `.bo-data-table__row-select` (measured: 0 and 0 on both), so
       `bindContainer`'s two listeners had no surface — they were unaffected for
       the same reason `initAlerts` was inert, one row up in the same table.

       This is **192.1** landing again, in the slice that itself found a
       measurement of nothing: the table was probed live over all 10 GET routes
       and is exact; the sentence next to it was read off the code and is wrong
       about two thirds of its subject. The instrument for the number was named;
       the instrument for the sentence was *"I read it"*, which is the answer
       CLAUDE.md says predicts the defect.

       Corrected in Slice 309's own text (archived text may be amended for a
       correction — 236.2), naming what is wrong, what replaces it, and why
       `check:po-app`'s 19-behaviours-green line is unaffected.

2. [x] **327.2 — `326.1`'s negative control names its own subject, so it reads
       `7 of 7` from its own commit onward. The revision is now pinned.**

       Found by reproducing it rather than by reading it. At **`7c6f7ecd`**, the
       revision the wake actually measured, all seven controls reproduce to the
       digit:

       ```
       git show <rev>:ROADMAP.md; git show <rev>:ROADMAP-archive.md
       grep -Fc -- "<page path>"      # summed over the two files
                                7c6f7ecd   e1f5a12f
         /patterns/kanban             13         14
         /components/badge             8          9
         /getting-started/install      6          7
         /components/breadcrumb        5          6
         /base/tokens                  2          3
         /components/skeleton          1          2
         /components/tooltip           0          1   ← the control
       ```

       Every control is up by exactly one, and the reason is in the corpus:
       `grep -Fn -- "/components/tooltip" ROADMAP.md ROADMAP-archive.md` returns
       **one line**, and it is `326.1`'s own record of the zero. The one page
       that proved the detector *could* report an absence can no longer do it.

       **The conclusion is untouched — a detector that now hits 7 of 7 is more
       dead, not less** — so this is a defect in the record's re-runnability, not
       in the finding. It matters because the finding's whole weight is that a
       grep cannot discriminate, and the evidence for that is a table a later
       wake re-runs and gets a different answer from, with nothing in the text
       saying why.

       Fixed where it is read: `LOOPS.md`'s lane 3 now pins the figures to
       `7c6f7ecd`, states that re-running at `e1f5a12f` gives 7 of 7 and why, and
       carries the transferable rule — **name the revision beside any negative
       control whose subject is a string this repo will then write down.** Ten
       lines, added below `## Playbooks`, so the dispatch region `326.3` is open
       about does not move.

       **Refused here, deliberately, and recorded so it is not re-proposed:** a
       new `CLAUDE.md` section for this shape. That file already carries the
       mirror image of it — *"an assertion that can be tripped by its own
       explanation is a detector that cannot pass"* — under the removal rule, and
       `326.3` is open precisely on the loop's prose growing because rules keep
       being added. One pinned revision and one sentence in the lane that uses it
       is the smaller fix.

3. [ ] **327.3 — the one instrument gap this grill could not close: nothing
       distinguishes a claim that was MEASURED from one that was read off the
       code, inside a slice whose other claims were measured.**
       Both defects here, and both in `322`, `319` and `291` before them, are the
       same shape: correct measured number, wrong unmeasured sentence beside it,
       shipped under the credibility of the number. CLAUDE.md already states the
       rule (*"list the other claims a change is carrying and name the instrument
       for each"* — 192.1) and it did not fire in any of the four.
       - **Accept** — the property, not a mechanism: a recorded answer to
         *why an existing written rule is not being executed*, resting on a count
         of how many slices since 192.1 landed actually carry a per-claim
         instrument line, taken from the slices themselves. **Concluding that the
         rule is fine and the practice is the gap — and that nothing should be
         built — is a satisfying outcome** if the count is recorded with the
         command that produced it. Do not propose a gate before the base rate is
         measured: *"this claim names its instrument"* is semantic, which is
         94.11's rule, and the checkable shape (a slice contains the word
         "instrument") would be true of nearly every slice this loop writes.
       - **Lane:** cloud-takeable — git history and text, no browser.

## Slice 326 — Standardize sweep, 4 of 4 lanes: the lane that warns against stale name lists carried one, and following it produced a false finding on a page verdicted ten days earlier (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, fixed with `git checkout -B main
origin/main`), `origin/main` a **forced update** (`26447ba...7c6f7ec`). Trap 2
clean in one `--unshallow` (**2,011** commits, no `shallow.lock`), tags again
arrived with it — the **thirty-ninth** consecutive container; `git tag | wc -l`
→ **8**. Step 1: both intakes read via the REST substitute with
`ENVIRONMENT.md` §8's two controls in the same run — `/discussions` **200 len
0**, `/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. Issue #2's
`updated_at` unmoved at `2026-09-06T15:10:34Z`; **no new input, so Step 1
committed nothing.** Step 2: rule 1 **0** open P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0'`); **rule 2 matched at 4 / 4 OVERDUE** →
Standardize.

**All four lanes ran.** The playbook's own warning — four consecutive sweeps ran
three — is why the count is stated: **4 of 4**.

1. [x] **326.1 — lane 3's own "Verdicts to date" line was a stale snapshot, and
       it is the FOURTH recurrence of the failure the paragraph directly above
       it documents three of.**

       *Accept was* (§3 lane 3): every page `report:prose` flags — over 2x the
       corpus median or over 2x its family median — carries a recorded verdict,
       or gains one here.

       ```
       npm run report:prose -w docs
       #  118 pages of 127 built · median 792 · mean 953 · total 112,395 words
       #  10 over 2x the corpus median (1,584); 11 over a family median; union = 15
       ```

       **The lane is CLEAN — all 15 flagged pages carry a verdict.** But
       reaching that answer required disbelieving this playbook, which is the
       finding.

       **What the clause said.** *"Verdicts to date: 158.1 the twelve over the
       corpus median, 161.1 the three the family split added. As of Slice 169
       every flagged page in both lists carries one."* Fifteen pages, two
       sources.

       **It was falsified twelve hours after it was written, and the two commits
       do not name each other.**

       ```
       git log -S'Verdicts to date' -- LOOPS.md     # ONE commit, never amended since
       87bf0f54  2026-08-28 07:42:07 +0000   Standardize (169): the clause is written
       e5edf61f  2026-08-28 19:46:14 +0000   Slice 178: 178.3 verdicts /concepts/scale/
       git merge-base --is-ancestor 87bf0f54 e5edf61f   # true — clause predates the verdict
       ```

       It then read fifteen for **ten days** and roughly 150 slices. This is the
       same shape `LOOPS.md` Step 0 already records for `check:resume-charter` —
       hardened at 11:42:09Z and demoted at 12:26:17Z, 44 minutes apart, neither
       document naming the other.

       **The cost, incurred in this wake rather than hypothesised.** Following
       the clause literally, the verdicted set was built from the two ids it
       names and diffed against the flagged union. It returned
       `/concepts/scale/` as **flagged, carrying no verdict** — a false finding
       against a page verdicted ten days earlier, and the next step would have
       been to write a duplicate verdict for it. It survived only because the
       absence was grepped before being believed, which is CLAUDE.md's base-rate
       rule doing exactly its job.

       **The counts were equal and the sets were not** — 15 verdicted, 15
       flagged, which reads as a match and is a coincidence of `/concepts/scale/`
       swapping in as `/patterns/output-form/` swapped out. 158.1's own entry
       warns of this in the same shape (*"the sets are printed, not the counts,
       for that reason"*).

       **The fix is NOT "replace the list with a command", and that matters more
       than the correction itself**, because the paragraph above the list
       (*"name the PROPERTY, not a list of page names"*) points a wake straight
       at a grep. 228.1 recorded that a per-path grep *"returns hits for
       everything whatever the truth is"*, and a later sweep leaned on that to
       check lane 3 by set membership. **No record carries a negative control
       for it**, so the claim was re-measured here rather than quoted:

       ```
       grep -Fc -- "<page path>" ROADMAP.md ROADMAP-archive.md   # no trailing slash (178.3)
       #  flagged pages, all 16-set verdicted:  15 of 15 hit
       #  CONTROLS carrying no prose verdict:    6 of 7 hit
       #    /patterns/kanban 13 · /components/badge 8 · /getting-started/install 6
       #    /components/breadcrumb 5 · /base/tokens 2 · /components/skeleton 1
       #    /components/tooltip 0   ← the only control that reads absent
       ```

       A mention is not a verdict, so the detector reports "verdicted" for
       anything the roadmap has ever discussed — nearly everything. *"This page
       carries a verdict"* is semantic, which is roadmap **94.11**'s rule, so
       **no gate**: the shape is checkable and the meaning is not.

       **So the enumeration is load-bearing and the obligation is the
       mechanism.** `LOOPS.md` now names all sixteen with their three sources,
       states that a round recording a new verdict amends the list **in the same
       commit**, and says outright that this is the one place CLAUDE.md's "name
       the property, never the value" does not apply — because here the property
       is not checkable, and a wake following that rule alone ships the dead
       detector. The first three recurrences moved to `LOOPS-archive.md` on its
       charter (archaeology moves, the behaviour-changing lesson stays inline).

       **Net prose:** `LOOPS.md` **+10** lines, `LOOPS-archive.md` **+24**.
       Stated rather than dressed up as a cut — this is instruction added, which
       is the kind 308.1 licenses, not narrative trimmed.

2. [x] **326.2 — lanes 1, 2 and 4: two clean, and lane 4's rising region number
       is NOT regrowth, attributed per section as 308.1 requires.**

       **Lane 1 — `scan:dead-style`: clean.** `0` dead style attribute(s) on `0`
       pages, of **1,272** live inline `style` attributes (1,677 declarations;
       273 attributes carry more than one, which the scan cannot judge
       separately). Screen **and** print measured; 0 dead-on-screen-but-live-in-
       print.

       **Lane 2 — `report:css-repeats`: zero delta, exactly the standing
       eight.** 74 source files · **242** rules with 3+ declarations · **230**
       distinct bodies · **8** repeated — one x4, two x3, five x2, and every
       group's members match `LOOPS.md`'s table. Totals moved 237→242 rules and
       225→230 bodies since the table was written; the repeat count did not. The
       joined-control x4 group is still **two components** (money, quantity,
       twice each), so its reopen trigger — a THIRD component — is unmet.

       **Lane 4 — `report_loop_prose.py`, `ratchet` block read first.**
       `CLAUDE.md` **33 up / never cut** and `DESIGN.md` **23 up / never cut**
       are 167.1's standing verdicts (HONEST; `DESIGN.md` is its control, and
       `CLAUDE.md`'s watch was retired by 193.1). No file changed accumulate
       class. `LOOPS.md` reads **13 up, last cut `8848ed55` (2026-09-05)**, and
       its `by region` block reports the dispatch region growing **faster** than
       the file (+343.2% vs +283.4% against the 2026-08-20 base).

       **308.1 forbids calling that regrowth without per-section attribution,
       and the attribution changes the answer.** Splitting the region on its own
       headings at `8848ed55` and at `HEAD`:

       ```
       git show <rev>:LOOPS.md | awk '/^## Playbooks/{exit} {print}'
       #   split on ^#{2,4} and on ^[0-9]+\. \*\*, sum each section
       ```

       | section | was | now | delta |
       |---|---|---|---|
       | `Step 1 — Triage new input` | 300 | 671 | **+371** |
       | rule 3 (Objective counter) | 660 | 963 | **+303** |
       | rule 5 (Optimize) | 349 | 573 | **+224** |
       | `Step 0 — Read the handover` | 563 | 714 | **+151** |
       | `The eight loops` → `The nine loops` | 214 | 266 | +52 (rename) |

       **The section that was cut did not regrow** — `8848ed55`'s cut is the
       loop-table rename, and it is the smallest mover. Every one of the four
       real risers is a section nothing cut, each carrying a rule that genuinely
       changed since 2026-09-05: **302.1**'s intake substitute (Step 1),
       **279.4**'s Polish amendment (rule 3), **307.1/306.1**'s comparable-set
       and SKEW blocks (rule 5), **283.2**'s third advisory check (Step 0).

       That is 308.1's second branch verbatim — *"other sections grew → a second
       cut would remove instruction rather than narrative; say so and file the
       structural question; do not reach for a cut."* **So no cut is proposed
       here**, and the structural question is filed as `326.3`. First execution
       of 308.1's attribution step since it landed.

3. [ ] **326.3 — the dispatch region has grown +1,101 words in two days with no
       narrative left in it to cut. What is the answer when the region a wake
       must read grows because the RULES grew?**

       *Accept*: a recorded decision, or a recorded refusal with its reason.
       Either outcome closes this. Do **not** treat "cut something" as the
       default — 326.2 measured that the four rising sections are rules that
       changed, and 274.1 already refused a cut that would move the file's
       number while leaving what a wake reads untouched.

       The shape of the question, so a later wake does not re-derive it: the
       dispatch region is now **6,759 words** and is what every wake reads
       before deciding anything. Its growth is legitimate — each riser is a rule
       correcting itself, and this repo's doctrine says a correction that
       changes behaviour stays inline rather than becoming a pointer. Those two
       facts are in tension and nothing currently resolves it. Candidate
       answers worth weighing rather than assumed: a per-rule word ceiling that
       forces the *decision content* to stay short while the evidence moves to
       `LOOPS-archive.md`; a split of Step 2's rules into a rules file the
       dispatcher reads and a rationale file it does not; or accepting the
       growth outright and saying so, which is a legitimate outcome and would
       retire lane 4's `by region` finding rather than leaving it to fire every
       sweep.

       **Owner-relevant, not owner-blocked** — a wake can decide this, but it is
       a structural call about the loop's own machinery, which is the kind
       `LOOPS.md` says to file rather than to take mid-sweep.

## Slice 325 — 309.5: the `/stress` measurement is committed, and its own style-flush column shipped dead first — an identical ~0 across inputs differing 20-fold, because the event loop pays the recalculation between tasks (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, fixed with `git checkout -B main
origin/main` before any commit), and `origin/main` again arrived as a **forced
update** (`26447ba...14a0dbd`). Trap 2 clean in one `--unshallow` (**2,009**
commits, no `shallow.lock`), and it again brought the tags — the
**thirty-eighth** consecutive container to do so; `git tag | wc -l` → **8**.
Step 0b counters read `Standardize 3/4`, `Objective 2/3 [307, 323]`, `Optimize
1 wake-date newer STALE`. Step 1: both intakes read with `ENVIRONMENT.md` §8's
controls (`/discussions` 200 len 0, `/not-a-real-route` 404,
`/issues?state=open` 200 len 1) — **issues 1 open, discussions 0 open**, issue
#2's `updated_at` unmoved at `2026-09-06T15:10:34Z`, so **no new input and Step
1 committed nothing**. Step 2: rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[
\].*P0' ROADMAP.md` → **0**), rule 2 `3/4`, rule 3 `2/3`, **rule 4** on the
oldest still-open item no other kind of block covers — `309.5`.

**Every older open item was re-checked in `ROADMAP.md` itself, not carried
from the hand-off**, and one of those re-checks is worth recording rather than
asserting. **`297.1` reads as newly takeable and is not.** Its Accept is *"one
wake reports on a real filed item, naming which intake it arrived in and
whether that was the right one"*, and an intake is now non-empty — but the
question it asks is whether the **template or the contact link** routed the
filer, and both issues ever filed were authored by **`ThePFMind`**, the owner,
who does not pass through either. Measured, not inferred:
`/issues?state=all` reports `#1` and `#2`, `user.login` `ThePFMind` on both.
So it stays **input-blocked** — the fourth kind — on an external filer, and
that is the item's own measurement rather than the previous hand-off's claim
repeated.

`309.5` is closed above with its Accept table, its red-proof and its readings.
The two things that outlive it are below.

1. [ ] **325.1 — a docs page can name an `npm run` command and nothing checks
       the command exists.** The page edited by `309.5` now cites `npm run
       measure:stress -w docs`, which is precisely the defect `309.5` existed
       to fix, one level over: Slice 307 recorded a re-run command
       (`node examples/po-app/server.mjs`) that exits `MODULE_NOT_FOUND` from a
       clean clone, and nothing caught it for a day.

       **Base rate measured before proposing a gate, per CLAUDE.md, and it is
       what makes this a question rather than a build:**

       ```
       grep -roh 'npm run [a-z:@/-]*' apps/docs/src/pages/ | sort | uniq -c
         #   2 npm run check:markup
         #   2 npm run build
       grep -rl 'npm run ' apps/docs/src/pages/ | wc -l    # 2 pages
       ```

       **4 occurrences on 2 pages, 4 of 4 valid today** — so the predicate is
       100% true of the tree, which is the shape 94.11 refuses a gate over.
       Unlike 94.11's case it is *not* structurally unfalsifiable — renaming a
       cited script would drive it red — so the refusal is not automatic. The
       question is whether a corpus of four earns a gate, or whether the
       honest answer is that citing a command in a docs page is rare enough to
       stay a review matter.
       - **Accept** — the property, not a verdict: a decision recorded with the
         base rate re-measured at execution time (the two commands above are a
         snapshot). **Refusing the gate is a satisfying outcome** if the reason
         is the corpus size; building it is satisfying if the corpus has grown.
         Either way the decision names what happens when a cited script is
         renamed.

2. [ ] **325.2 — `measure:stress`'s render columns have no counterpart in the
       published table, and the published table's method is unrecoverable.**
       `render-dcl` / `render-load` are `domContentLoadedEventEnd` and
       `loadEventEnd` minus `responseEnd`; the 2026-08-15 *Initial render*
       column is 85 / 174 / 558 ms with no definition written anywhere. The
       probe's header and the docs page both say outright that the two are not
       comparable, which is honest and also means the published column can
       never be re-run — it is a number with a shape and no method, exactly the
       state `309.3` withdrew a different number for.
       - **Accept** — the property, not a predicted outcome: either the
         published *Initial render* column gains a definition the probe can
         reproduce, **or** it is withdrawn the way the 2026-09 re-run was, with
         the reason. **Finding that the original method is recoverable from
         Slice 30-era history is a satisfying outcome** and closes it by
         writing the definition down; finding it is not is equally satisfying
         and closes it by withdrawal. A third reading — that a shape-only
         column is worth keeping undefined — is admissible only if it says what
         a reader is supposed to do with it.

## Slice 324 — rule 5's pairing test counted SAMPLES, so a 26-sample afternoon read as a series; re-scoped to distinct days its actionable input set is one metric, and the reason nobody records that one was a premise this wake refuted (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty, fixed with `git checkout -B main
origin/main` before any commit). `origin/main` again arrived as a **forced
update** (`26447ba...97a3137`). Trap 2 clean in one `--unshallow` (**2,006**
commits, no `shallow.lock`), and it again brought the tags — the
**thirty-seventh** consecutive container to do so; `git tag | wc -l` → **8**.
Step 0b counters read `Standardize 2/4`, `Objective 1/3 [323]`, `Optimize 1
wake-date newer STALE`. Step 1: both intakes read with `ENVIRONMENT.md` §8's
controls (`/discussions` 200 len 0, `/not-a-real-route` 404, `/issues?state=open`
200 len 1) — **issues 1 open, discussions 0 open**, issue #2's `updated_at`
unmoved at `2026-09-06T15:10:34Z`, so **no new input and Step 1 committed
nothing**. Step 2: rule 1 no P0, rule 2 `2/4`, rule 3 `1/3`, **rule 4** on the
oldest still-open item no other kind of block covers — `307.1`, every older
open item being owner-, browser- or input-blocked (re-checked in the file, not
carried from the hand-off).

**Rule 5 was the subject of this wake and could not be evaluated as a rule** —
its line reads a genuine `STALE`, which is no input. That is the item, not an
obstacle to it.

### The narrowing, and each step is a different mechanism

`44 names → 7 day-paired → 3 alive → 1 actionable.` The full measurement, the
command that reproduces it, the base-rate replay and the red-proof are in
`307.1` above, closed by this slice. **A fifth step was drafted — `→ 0
samplable`, on a refusal row's "no generator anywhere" — and refuted inside
this wake**: the generator exists, it simply does not carry the metric's name,
so a grep for the name could never find it. The two findings that outlive the
re-scoping are filed below; neither is fixed by it, and both are what stop
rule 5 from firing once its input is honest.

1. [ ] **324.1 — a sample records no DIRECTION, so even a fresh, well-paired
       metric cannot yield a verdict.** `record_metric.py` writes `{ts, name,
       value, unit}`. On this tree `claims` rises 35 → 169 (the goal) and
       `bundle-gz-kb` rises 7.2 → 15.1 kB (the regression) and both are a
       positive delta on a number. `dispatch_status.py` now prints the movement
       and says outright that the verdict is the wake's, which is honest and is
       not the same as rule 5 being answerable by the dispatcher.
       - **Accept** — the property: either a sample carries which direction is
         a regression and the line states a verdict where it can, or the
         reason a direction cannot be recorded is written down where the next
         wake reads it. **Concluding that the reader supplies the direction and
         that the printed movement is the right stopping point is a satisfying
         outcome** — 132 existing samples carry none, and a field only future
         samples fill leaves the three live names undirected either way.
       - Measure before building: how many of the day-paired names have a
         direction that is *obvious from the unit alone* (`kB`, `ms` — lower
         better) versus one that needs a per-name declaration. If the answer is
         "all of them from the unit", the field is ceremony and the fix is a
         unit convention.

2. [ ] **324.2 — `bundle-gz-kb` is the only metric rule 5 can act on, its
       generator exists, and its noise floor is wider than three of its four
       historical moves.** The "no generator" premise died in `307.1` above:
       `check:size` prints `css/index.min.css … 15.10 kB gz` and
       `stamp-readme.mjs` stamps the same figure into both READMEs, matching
       the newest hand-recorded sample (15.1, 2026-09-03). What remains is the
       part a grep never reached — `GZIP_TOLERANCE_KB = 0.3` exists because the
       same bytes gzip differently across Node builds, and the two dispatchers
       run different containers.
       - **Accept** — the property: the metric's definition is written down
         where a wake recording it will read it (which artifact, which command,
         which environment), AND the record says what delta is large enough to
         mean anything against the 0.3 kB cross-environment floor. **Concluding
         that a gzip-byte series cannot support a cross-environment
         two-consecutive verdict, and re-pointing the name at the minified byte
         count (`93 kB`, deterministic) or retiring it, is a satisfying
         outcome** — the reason to keep gzip is that gzip is what users
         download, and that reason is about the BUDGET, which `check:size`
         already gates, not about rule 5.
       - **Do not re-baseline the existing 11 samples**, and do not record a
         sample to un-STALE the line before the convention is written down —
         that is what 2026-09-04 refused, and its stated reason being wrong
         does not make the action right.
       - Measure first: which of the 11 samples were taken on which
         dispatcher's clock (`git blame --line-porcelain` on
         `loop-metrics.jsonl` gives the author offset per line, the method
         164.2 established). A series taken entirely at one offset has no
         cross-environment problem at all, and that would shrink this item to
         one sentence.

3. [x] **324.3 — DONE. Archive sweep, taken from inside the dispatch because
       `249.12`'s stated trigger crossed BOTH halves for the first time — and
       its first attempt silently truncated a slice.** `roadmap_scope.py` read
       **8,188 lines / 41.5%** after this wake's own item closed, against the
       trigger the hand-offs carry (*"past 5,450 lines / 40.6%"*). Thirteen
       consecutive wakes had declined on the share half; with both halves past,
       the AND-vs-OR question `249.12` is open on no longer decides anything,
       so `LOOPS.md` rule 4's own instruction — *if this rule is walking
       thousands of lines, triage the sweep and run it* — applies unambiguously.

       **15 slices moved** (321, 318, 317, 314, 313, 312, 311, 308, 306, 305,
       304, 303, 302, 301, 300), each byte-identical in the archive, each
       leaving the pointer line. The 4 remaining targets — 307, 298, 292, 283 —
       are every one of them **named by a still-open item** (236.2's pins), so
       nothing eligible was left behind. Reconciled both ways, read at the
       commit rather than the working tree (`25b9fdd3` → `67fc6659`): live
       closed items **67 → 52** and archive **714 → 730** — 16 moved, and the
       live side keeps a 52nd because this entry is itself a new `[x]`; open
       **26 → 26** unchanged; slice headings **306 → 306**; live lines
       **8,188 → 6,476**; share **41.5% → 24.6%**.

       **The finding is the first attempt, and it is CLAUDE.md's bulk-edit rule
       landing with its own reconciliation clause.** Section boundaries were
       taken as *any line starting with `## `*. That is wrong here:
       `report_loop_prose.py`'s output contains a row spelled
       `## the loops table   214   214   214`, and Slices 309 and 308 each quote
       one **inside a code fence**. So the mover cut Slice 308's body at that
       row, archived the first half, and left the remainder in the live file
       under a heading that is not a heading — after which `roadmap_scope.py`
       read **17 slice sections, 12 open / 12 closed** where the raw file has
       306 / 26 / 52, and seven whole slices (15, 112, 249, 273, 294, 296, 297)
       vanished from the OPEN set rule 4 reads.

       **The verification passed anyway, and the reason is the rule: a
       reconciliation that re-uses the parser it is checking cannot fail.** The
       byte-identity check was written with the same section splitter, so it
       compared a truncated body against a truncated body and reported *"ALL 15
       OK"*. What caught it was an INDEPENDENT instrument — `roadmap_scope.py`,
       which is fence-aware — disagreeing with a number that had just been
       written down by hand. Reverted whole (`git checkout --`, not a patch),
       re-run fence-aware, and re-verified against that same independent
       instrument: the OPEN set after the sweep is identical to the OPEN set
       before it, name for name.

       **The mover now refuses rather than truncating**: it toggles fence depth,
       treats `## ` at depth zero only, asserts the file's fences balance, and
       asserts each moved section's own fence count is even — the condition that
       would mean a fence spans a section boundary. All three are asserts, not
       filters, per *prefer an assertion that fails loudly over a replace that
       silently matches nothing*.

## Slice 323 — rule 5's staleness line compared naive stamps from two clocks, so a calendar boundary read as missing input; the fix states the skew rather than removing it, and the base rate that justifies it is invisible at date granularity (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty), fixed with `git checkout -B main
origin/main` before any commit. `origin/main` again a **forced update**
(`26447ba...152b9bc`). Trap 2 clean in one `--unshallow` (**2,004** commits, no
`shallow.lock`) and it again brought the tags — the **thirty-sixth** consecutive
container to do so; `git tag | wc -l` → **8**. `origin/main` was `152b9bc9` at
Step 0 and `152b9bc9` again immediately before the first commit, so no
collision. Step 1: both intakes read via the REST substitute with
`ENVIRONMENT.md` §8's two controls — **issues 1 open** (#2, already triaged as
`300.2`, unchanged since 2026-09-06), **discussions 0 open**,
`/not-a-real-route` **404**. No new input, so Step 1 committed nothing.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**
across the 25 open items. Rule 2: `Standardize 1 / 4`. Rule 3: `Objective 0 / 3`
(reset by Slice 322's own row, one wake back). Rule 4: the oldest still-open
item no other rule blocks is **`306.1`** — everything older is owner-blocked
(Slice 15, `112.3`, `112.4`, `249.7`, `249.10`-`249.13`, `273.2`, `296.3`),
browser-blocked in the screenshot sense (`249.6`, `249.9`) or input-blocked
(`294.2`, `297.1`) — so **Continue, build mode**.

### The finding: "immune to the eight-hour ambiguity" was true within a date and false across one

`dispatch_status.py`'s own header argued date granularity was *"immune to the
whole eight-hour ambiguity"*, and it is — for two stamps that land on the same
date. Slice 306 caught the other case live: a metric this container wrote at
`2026-09-06 16:56` (+0000) sat one calendar day behind log rows the other
dispatcher wrote at `2026-09-07 00:21` (+0800), the **same wall-clock moment**,
and the line reported `1 wake-date(s) newer   STALE`. The remedy a wake reaches
for on reading that — record another metric — cannot help, because the residual
is not missing input.

Neither file can be converted to a shared basis from its own contents: both
carry naive local stamps, and `LOOPS.md` 164.2 already refused to add `%z` and
refused to backfill. So the fix takes the Accept's second branch and states the
skew. The full mechanism, the reconciliation, both red-proofs and the
one-directional-softening argument are in `306.1` above and in the script's own
header.

### The base rate is the part worth carrying, because the first measurement said "refuse this"

CLAUDE.md requires the base rate before a predicate ships. The obvious replay —
as-of-DATE over the log's 26 wake-dates, the form the script's existing base-rate
command already uses — returned **zero** SKEW verdicts and an identical 13 ok /
13 STALE split. Read literally that is *"the discrimination fires on nothing"*,
which is this repo's own reason to refuse a gate (94.11).

It was the wrong instrument, and the tell was that Slice 306 had **watched the
state happen**. An as-of-date replay includes every row on the later date,
including rows written hours after the wake read the line, so each occasion
resolves to provably-newer by the end of its own day. Replayed at the
granularity a wake actually reads — both files taken **at each commit** of
`loop-log.md` — it reads `958 revisions -> 581 STALE, 323 ok, 51 SKEW`, and the
51 are **seven distinct occasions**, the last being 306's own.

**Two lessons, and the second is the transferable one.** A replay's granularity
is part of the instrument, not a detail of it: a state that exists for four
hours is invisible to a daily sampler however many days it sweeps. And **a base
rate of zero is a claim about the instrument first** — the same grammar as *a
0%, a 100%, or an identical value across many inputs is a defect until proven
otherwise*, which this repo already writes down and which pointed at the replay
rather than at the predicate. Had the tell been absent, refusing would have been
correct on that evidence; what licensed looking again was a recorded observation
the instrument could not see, not a preference for shipping.

1. [ ] **323.1 — the script's existing base-rate command, the one quoted above
       `metric_samples`, is an as-of-DATE replay and is now known to be blind to
       states that live less than a day.** It was written for rule 5's own
       liveness question, where a date is arguably the right unit, so this is
       not a defect in it — but it sits three screens above a second replay that
       had to be written at commit granularity for exactly this reason, with
       nothing saying why they differ.
       - **Accept** — the property: a reader of either command can tell from the
         file which question each answers and why the units differ, OR the two
         are reconciled into one. **Concluding that the two units are both
         correct for their own questions and that a sentence naming the
         difference is the whole fix is a satisfying outcome** — measure what
         the date-granularity command would report on the seven occasions
         before proposing anything larger. No gate: "the right granularity was
         chosen" is not a checkable shape (94.11).
       - **Lane:** cloud-takeable — Python, git history, no browser.

## Slice 322 — Objective grill of Slices 304, 305, 320: 26 of 29 assertions reproduce, and both defects are a COUNT published beside a correctly red-proved fix. One of them the grill's own first instrument reproduced, by the same mechanism (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again (trap 1;
`git branch --show-current` empty), fixed with `git checkout -B main
origin/main` before any commit. `origin/main` again a **forced update**
(`26447ba...203f0a6`). Trap 2 clean in one `--unshallow` (**2,002** commits, no
`shallow.lock`) and it again brought the tags — the **thirty-fifth**
consecutive container to do so; `git tag | wc -l` -> **8**. Trap 1c did not
bite (`CHROME_PATH` exported in the same command as every browser-driven gate).

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**
across the 24 open items. Step 1 read **both** intakes with `ENVIRONMENT.md`
§8's controls in one run (`/discussions` -> 200 len **0**; `/not-a-real-route`
-> **404**; `/issues?state=open` -> 200 len **1**, issue #2, already triaged as
`300.2` and closed by Slice 317) and triaged nothing: no new input, so Step 1
committed nothing. Rule 2 `1 / 4` did not match. **Rule 3 matched** —
`dispatch_status.py` read `Objective 3 / 3 slices [304, 305, 320] OVERDUE`.
Rules 4-8 not reached. Rule 5 reports **STALE** (`1 wake-date newer`), so per
`LOOPS.md` it **could not be evaluated** and is not reported clear; `306.1` is
the open item saying why a cloud wake cannot drive it to `ok`.

**Scope, per §6 step 0: the armed set is taken WHOLE, three of three.** The
step exists because the counter names slices rather than rounds, so a slice an
earlier grill already covered can re-arm. It has not happened here — `grep -hoE
'^## Slice [0-9]+ — Objective grill of Slices [0-9, -]+' ROADMAP.md
ROADMAP-archive.md` returns no grill naming 304, 305 or 320. Two properties of
this set are worth stating rather than leaving for a reader to notice. **304 is
itself a grill**, so this is a grill of a grill — legitimate, and its one built
item (`304.1`) is ordinary buildable work. And **305's two open items were
closed by Slice 321**, which is *not* in the armed set: the counter attributed
that closure to 305 because the recording row's `--item` text leads with
`305.1`. So grilling 305 necessarily grills what 321 concluded about it, and
321's own conclusions are in scope here for that reason and no other.

### The through-line: both defects are in a count that shipped BESIDE a fix that was red-proved correctly

Neither slice's *fix* is wrong. `roadmap_scope.py`'s header works and its case-G
red-proof re-does exactly; `scan:dead-style`'s corrected line prints the triple
it claims. Both defects are in the number published alongside — which is
CLAUDE.md's 192.1 (*the defect lands in what shipped BESIDE the number*) landing
twice in one armed set, and in both cases in the count that describes **how big
the problem was**, the one figure nobody re-runs because the fix is already in
hand.

### Defect A — Slice 320 published a blast radius of 5; the corpus says 17, and they are not consecutive

320's own headline is that lane 1's number counts attributes while saying
"declarations". It then reported the wrong noun as *"quoted as a declaration
count in five consecutive sweep write-ups (214, 284, 290, 301, 314)"*.

Whitespace-normalised and attributed to the containing `## Slice` heading, the
figure `1,433` is quoted with that noun by **17** slices — 208, 214, 230, 235,
237, 244, 252, 255, 257, 263, 274, 284, 290, 293, 301, 308, 314 — and **all 17
are Standardize sweeps**, classified from their own headings, with nothing else
in the set. Ten of them sit *between* 214 and 314, so "consecutive" is false as
well as low. Widening to any value of the number (the era before 1,428 became
1,433) adds 161, 166, 169, 187, 191, 194, 197, 202 and 206, for **23**.

**The correct statement is stronger than the published one**, which is what
makes the undercount worth correcting rather than shrugging at: *no Standardize
sweep has ever quoted this number correctly* — every sweep since 208, without
exception, for the whole life of the instrument. Corrected in place at Slice
320 per 236.2, original struck, with the command recorded beside it.

**And the grill's own first instrument made the same mistake, which is the
reusable half.** A line-based scan returned **16** of the 17 and missed exactly
**301** — whose `live inline` and `declarations` straddle a newline. That is not
a coincidence with 320's undercount, it is the same mechanism: this repo's prose
wraps at ~78 columns, and a phrase-count taken per line silently drops every
wrapped instance. Caught here only because 320 *named* 301 and the scan did not
find it — a hand-written list disagreeing with an instrument, which is
`LOOPS.md`'s own stated way this class of bug gets found.

### Defect B — Slice 304's base rate is not reproducible, and an independent re-derivation disagrees

304.1's decision rests on a base rate: *"Of the **11** published full-ratio
figures (`N / M = P%`) …, **7 reproduce at the PARENT** of the commit carrying
them and **4 at the commit itself**, and only **3 of the 11** name a revision."*
It is the number that refused the refusal — i.e. the number that authorised
building the fix.

**No command was recorded beside it.** That is the precise omission 304 itself
diagnoses in Slice 301, two paragraphs earlier in the same item, and quotes
CLAUDE.md for: *"had the command sat beside the claim, its `--rev` flag would
have made the error visible while writing."* The consequence is not
hypothetical — this grill could not re-run it, only re-derive it, and the
re-derivation disagrees:

| | published | re-derived at `8beee329` |
|---|---|---|
| corpus | 11 | **10** (`RESUME.md` contributes 0 — it spells its share as prose, not `N / M = P%`) |
| reproduce at the parent | 7 | **8** |
| reproduce at the commit itself | 4 | **0** |
| reproduce at neither | (0, implied by 7+4=11) | **2** |

The two "neither" figures are the pair on `ROADMAP-archive.md:31573`
(`1568 / 3085 = 50.8%`, `1568 / 3197 = 49.0%`), which are a later grill's
arithmetic *about* 214.1's published figure rather than readings of the tree
carrying them — so they are arguably outside the corpus, and are reported rather
than quietly dropped.

**This does not show 304's number is wrong; it shows it cannot be checked**,
which is what this repo's doctrine says a load-bearing number may not be. And
the conclusion it supports is untouched — under the re-derivation *every*
reproducible figure describes the parent while printing identically to a
mid-edit reading, which strengthens the argument for the header rather than
weakening it. The `3 of 11 name a revision` half is **not adjudicated**: it
depends on how wide a window counts as "surrounding text", and ±3 lines returns
4 of 9 here. Corrected in place at Slice 304 per 236.2, with both commands.

### What held — 26 of 29

**Slice 320 — 15 of 16.** Lane 1's corrected triple reproduces exactly
(`1272 / 1677 / 273`); lane 2 `74 files · 242 rules · 230 distinct · 8 repeats`;
lane 3 `118 pages · median 792 · 112,297 words`, 10 over the corpus median and
11 over a family median. Of the two inline spellings, only the two *comments* in
`Gallery.astro` survive. `--bo-space-0` is still used nowhere but its own
definition. The after-state of the custom-property base rate is **0 of 41**,
exact. `ApiTable.astro:57` now reads `var(--bo-space-2)` and `ClassRef.astro:44`
still `.4rem`, so `320.3`'s premise holds. `273 / 1,272 = 21.5%`.

Two of those deserve their commands, because an independently written instrument
landed on the digit:

- **`.docs-list` 59 files / `.docs-list-bare` 40** reproduce **exactly** at
  `7dacd80b~1` — the pre-conversion state, which is the tree the claim
  describes — under a class-attribute matcher written without reading 320's.
  At `7dacd80b` both read 60 / 41, the +1/+1 being the two files converted.
- **The 161 decomposition reconciles component by component.** `<Related` 116
  and `<ApiTable` 40 occurrences in `src/pages`, the latter confirmed
  independently in the built DOM (`data-api-notes`, 40 occurrences on 39 pages).
  The **5 page-level sites** are the knob-to-own-fallback removals whose
  attribute held nothing else: of the 6 such declarations at `7dacd80b~1`,
  **5 are sole occupants** and the sixth is inside `Related.astro`'s own
  attribute, already counted in the 116. 116 + 40 + 5 = 161, exact.

**Slice 305 — 5 of 5.** All five classes the round-3 critic named as missing do
ship: `bo-data-table__col--code`, `bo-data-table__col--tertiary`,
`bo-data-table__col--secondary`, `bo-u-text-truncate` and `bo-pagination` are
all in `dist/api.json`, and the two *invented* ones (`bo-segmented__label`,
`bo-u-text-end`) are not. So the slice's headline — *the framework was never the
gap* — reproduces. `check-markup` catches both invented classes and suggests
`bo-segmented__option` and `bo-u-text-right`, i.e. the correct names, in one
run. `git log --all -- '*gauntlet-a*'` is still empty, and
`.roundtable/gauntlet/` now carries the committed path `321.1` added.

**Slice 304 — 6 of 7 (the base rate is Defect B).** The header names its tree
(`at HEAD 203f0a64 (ROADMAP.md and ROADMAP-archive.md clean)`). Case G was
red-proved **by discrimination, re-done independently**: a probe copy with
`line[3:]` restored fails naming `OADMAP.md` and exits **1**; the shipped script
exits 0. `roadmap_scope.py` still has no machine consumers — only its own header
and `_common.py`'s docstring. Slice 301's figures reproduce at both revisions
(`384e6a8b` -> 4,738 / 396; `~1` -> 6,839 / 2,534), and the arithmetic
`4,738 − 62 = 4,676`, `396 − 61 = 335` holds.

**Four of this grill's own instruments were wrong on their first output**, which
is CLAUDE.md's base rate holding rather than an aside: a `bo.css` grep against a
file that does not exist (dist ships per-file CSS under `dist/css/`); a
`grep -rl 'ApiTable[^>]*notes='` that cannot span lines and reported 5 where the
built DOM says 40; a `docs-list\b` matcher whose `\b` matches inside
`docs-list-bare`; and the line-based phrase scan above. Every one was caught by
reconciling against a second, differently-shaped reading before the number was
used.

1. [x] **322.1 — Slice 320's blast-radius count corrected in place**: 17
       sweeps, not five; the list, the classification and the command are
       recorded beside the struck original, per 236.2.
2. [x] **322.2 — Slice 304's base rate re-measured in place** and marked NOT
       REPRODUCIBLE rather than replaced, since this grill can show the figure
       cannot be re-run but not which split is right. Both commands recorded.
3. [ ] **322.3 — should a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md`
       be taken whitespace-normalised by default?** Two instruments made the
       same wrapped-phrase mistake in two days — 320's published 5 and this
       grill's own first scan — and the mechanism is mechanical, not a lapse:
       the corpus is hand-wrapped at ~78 columns, so any phrase longer than a
       few words straddles a newline somewhere.
       - **Accept** — the property, not a prediction: **measure the base rate
         first** (94.11). Take the phrase-counts published across the last N
         slices that are re-derivable, re-run each line-based and
         whitespace-normalised, and report how many change. If few change, a
         helper is ceremony and **recording the refusal with the number is a
         satisfying outcome**; if many do, ship one shared normaliser in
         `scripts/loops/` and name its callers. Either way the closing text
         carries the command, which is the thing both defects above lacked.
       - **Not a gate, and that is decided rather than deferred**: "this count
         was taken correctly" is not a checkable shape — the gate would have to
         re-run every count in the corpus against an instrument nobody wrote
         down. `check:slice-refs` is the precedent for what IS checkable here
         (does a citation resolve), and it is silent on whether the number
         beside it is right.

**Gates: all 17 cloud-runnable entry points green** on the committed tree, the
list re-derived from `ci.yml` rather than read off a snapshot (the two
documented set differences still hold: `check:ci-ignores` is covered by
`check:repo`, and `npm run test -w @busy-office/ui` is CI's
`npx vitest run --root packages/core`).

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing rendered changed and no claim here rests on
rendering: the diff is **markdown only** — `ROADMAP.md`, the grill report and
the hand-off — with no CSS, no `.astro` and no script touched. The visual debts
carried forward are unchanged and unspent: `292.4/292.5`'s screenshot lane on
`/components/icon`, the withdrawn-claim paragraph on `/components/data-table`,
Slice 319's paragraph on `/patterns/kanban` at 390px, and `320.3`'s
`ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem` — whose premise this
grill re-confirmed by grep but cannot judge, because judging it is exactly the
rendered comparison a cloud wake cannot make.

## Slice 321 — rule 4's oldest item asked a wake to re-measure an artifact that exists in no commit: the Gauntlet's bar protected the REFERENCE and never the graded thing, so three blind critic rounds bought findings nobody can check (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 320 — Standardize sweep, 4 of 4 lanes: two shared components carried the LAST inline spellings of two classes a 2026-08-17 sweep created to replace them, and lane 1's own headline number counts attributes while saying "declarations" (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...e3de656`). Trap 2 clean in one
`--unshallow` (**1,998** commits, no `shallow.lock`), and it again brought the
tags — the **thirty-third** consecutive container to do so; `git tag | wc -l`
-> **8**. Trap 1c did not bite (`CHROME_PATH` exported in the same command as
every browser-driven gate).

Rule 1: no open P0 — `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i P0`
returns nothing across the 25 open items. Step 1 read **both** intakes with
`ENVIRONMENT.md` §8's controls in one run (`/discussions` -> 200 len **0**;
`/not-a-real-route` -> **404**; `/issues?state=open` -> 200 len **1**, issue #2,
already triaged as `300.2`) and triaged nothing: no new input. **Rule 2
matched** — `dispatch_status.py` read `Standardize 4 / 4 Continue rounds …
OVERDUE`. Rule 3 `1 / 3 slice … ok [304]` did not match. Rules 4-8 not reached.
Rule 5 reports **STALE** (`1 wake-date(s) newer`), so per `LOOPS.md` it **could
not be evaluated** and is not reported clear; `306.1` is the open item saying
why a cloud wake cannot drive it to `ok`.

**All four lanes ran; saying `n of 4` per the playbook. This is 4 of 4.**

| lane | command | result |
|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** of **1,433**, and the unit of that 1,433 is the finding — see below |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | **8 repeated bodies**, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct |
| 3 report:prose | `npm run report:prose -w docs` | **0 unverdicted** — 118 pages · median 792 · **112,297** words; 10 over the corpus median, 11 over a family median, union **15** |
| 4 loop-prose | `python3 scripts/loops/report_loop_prose.py` | no finding — `git diff --stat 4e0248ed..HEAD -- LOOPS.md` is **empty**, so 308.1's per-section attribution still stands and re-deriving it would be the re-derivation that rule exists to prevent |

**Lane 2's membership is unchanged group-for-group**, not merely unchanged in
count: all eight bodies match `LOOPS.md`'s table one-for-one, and the
joined-control `x4` group is still **two** components, so its stated reopen
trigger — a THIRD — is unmet. **Lane 3's corpus moved and the flagged set did
not**: `111,907 -> 112,297` words (+390 since Slice 314), median 792 unchanged,
the same **15** pages, none entering unverdicted.

### The finding — a 2026-08-17 consolidation that stopped at `pages/`

`Gallery.astro`'s own `is:global` block carries two docs-local classes whose
comments record what they replaced: `.docs-list` was *"an identical inline
`style="padding-inline-start: 1.25rem"` repeated 37 times across 27 pages"*,
and `.docs-list-bare` was *"`style="list-style: none; padding: 0"` repeated 14
times"*, both from the Standardize sweep of 2026-08-17.

Every one of those 51 inline copies is gone from `pages/`. **Two survived, and
both are in the shared components that render INTO those pages** — the exact
directory Slice 314 established was outside 292.8's scope, one property over:

```
grep -rnE 'style="[^"]*padding-inline-start:\s*1\.25rem' apps/docs/src --include='*.astro'
grep -rnE 'style="[^"]*list-style:\s*none[^"]*padding:\s*0'  apps/docs/src --include='*.astro'
  # ApiTable.astro:74 and Related.astro:14 — and, in Gallery.astro, only the
  # two COMMENTS quoting the strings the classes replaced.
```

`.docs-list` is used by class in **59** files and `.docs-list-bare` in **40**,
so this is a one-off surviving beside a settled pattern, which is what this loop
means by drift. Both now use the class.

### 314.2 — closed here, because this sweep's own scan reached its sites independently

314.2 asked for a verdict on the non-zero spacing literals and an explicit
decision on `--bo-space-0`. The counts were re-run rather than quoted, with an
instrument restricted to inline `style=` **attributes** — a `<style>`-block
declaration is a stylesheet rule, not an inline one-off, and a raw grep for
`padding:` conflates them.

| site | verdict |
|---|---|
| `ApiTable.astro:74` `padding-inline-start: 1.25rem` | **converted** — to `.docs-list`, not to `var(--bo-space-5)`. A class that already owns the decision beats tokenising a one-off. |
| `Related.astro:14` `list-style: none; padding: 0` | **converted** — to `.docs-list-bare`. |
| `ApiTable.astro:57` `margin-inline-end: 0.5rem` | **converted** — `var(--bo-space-2)`, exact. |
| `detail-form.astro` x3 `font-weight: 400` | **converted** — `var(--bo-font-weight-normal)`, exact. This is 314.2's whole `font-weight` row. |
| `base/primitives.astro` x4 `margin-block-start: 1.5rem` | **refused** — all four are INSIDE a template literal, i.e. copyable samples, which 292.8's own live-markup rule puts out of scope. `1.5rem` does equal `--bo-space-6`, so the refusal is about the site, not the value: the page's subject is the primitives' gap knobs, and a token spelling in the sample teaches a second thing the sample is not about. |
| `ClassRef.astro:44` `margin-inline-end:.4rem` | **refused, and it files 320.3** — `0.4rem` is off-scale (between `--bo-space-1` 0.25rem and `--bo-space-2` 0.5rem), so any swap is a rendered change, which is the judgement 314.1 recorded for its own `2rem`. |
| every zero (`margin: 0`, `padding: 0`, `margin-block-end: 0`) | **refused. `--bo-space-0` is never the right spelling of a zero**, and the evidence is that nothing has ever used it: `grep -rn -- '--bo-space-0\b' packages/core/src apps/docs/src` excluding its own definition returns **0**. A reset is not a scale step. |

The classifier that split "copyable sample" from "live markup" is backtick
parity to the match OFFSET, and it was **wrong on its first version** — parity
to the start of the LINE misreads a line that OPENS a template literal, which
is `combobox.astro:61`. Red-proved on two controls before any verdict rested on
it (`primitives.astro:30` INSIDE, `combobox.astro:61` INSIDE), per this repo's
own base rate that an instrument's first output is not evidence.

### And a second class of inline one-off nothing had a name for

A knob set to exactly the value the consuming rule already falls back to.
`.bo-cluster` is `gap: var(--bo-cluster-gap, var(--bo-space-2))`, and six
elements set `--bo-cluster-gap: var(--bo-space-2)` (or `--bo-grid-min: 16rem`,
`.bo-grid`'s own fallback) on top of it.

**Base rate measured before treating it as a finding** (94.11): **6 of 47
inline custom-property declarations (12.8%)** — neither 0% nor 100%, so the
predicate distinguishes. All six are live markup, none nested inside another
cluster or grid that sets the knob, so removing them cannot uncover an
inherited value. After: **0 of 41**.

### The instrument defect — lane 1's headline number is not what it says

`scan:dead-style` printed **"1,433 live inline declaration(s)"**. `live += 1`
fires once per element carrying `[style]`, so 1,433 was **attributes**. Measured
on one page set on one day: **1,272 attributes holding 1,677 declarations**, a
**24.2%** under-report, and the wrong noun has been quoted as a declaration
count in ~~five consecutive sweep write-ups (214, 284, 290, 301, 314)~~ and in the
script's own header.

> **CORRECTED 2026-09-07 by Slice 322 (Objective grill): the blast radius is
> `17` sweeps, not five, and the five named are not a consecutive run.** Every
> Standardize sweep from **208** onward quoted it — 208, 214, 230, 235, 237,
> 244, 252, 255, 257, 263, 274, 284, 290, 293, 301, 308, 314 — all 17
> classified as sweeps from their own headings, none of them anything else.
> The struck list omitted ten sweeps sitting *between* 214 and 314, which is
> what makes "consecutive" false as well as low. The true statement is
> stronger than the published one: **no sweep has ever quoted this number
> correctly.** The command, recorded here because the original carried none:
>
> ```
> # whitespace-normalised — a LINE-based grep is what produced the undercount
> python3 - <<'PY'
> import re
> pat = re.compile(r'1,?433[^.\n]{0,40}live inline\s+decl', re.I|re.S)
> for f in ['ROADMAP.md','ROADMAP-archive.md']:
>     txt=open(f).read()
>     heads=[(m.start(), m.group(1)) for m in re.finditer(r'^## Slice (\d+)', txt, re.M)]
>     own=lambda p: max([n for s,n in heads if s<=p], key=lambda _:0, default=None)
>     print(f, sorted({[n for s,n in heads if s<=m.start()][-1]
>                      for m in pat.finditer(txt)}, key=int))
> PY
> ```
>
> **The grill's own first instrument made the same mistake and that is the
> reusable part.** A line-based scan returned 16 of the 17 and missed exactly
> **301**, whose `live inline` / `declarations` straddle a newline. This repo's
> prose wraps at ~78 columns, so a phrase-count taken per line silently drops
> every wrapped instance — filed as `322.3`.

**The unit is also a detection gap, and it is red-proved rather than reasoned.**
The verdict joins every property the attribute names into ONE string, so an
attribute is dead only if ALL of its declarations are. That probe's own logic,
run verbatim over three injected elements:

```
live   style="margin: 40px"                 <- the script's own live control
DEAD   style="margin: 0"                    <- the script's own dead control
live   style="margin: 40px; padding: 0"     <- the gap
```

The hidden `padding: 0` is exactly the case the script's header calls the
canonical dead one (25 of the first sweep's 29). **273 of 1,272 attributes
(21.5%)** carry more than one declaration and are in that blind spot.

1. [x] **320.1 — the output says what it counts, and prints the number it was
       missing.** Both figures now print, so the historical series stays
       comparable rather than being silently redefined, and the multi-declaration
       count publishes the blind spot's size beside the verdict that cannot see
       into it. The corrected line reproduces an independent probe exactly —
       `1272 / 1677 / 273` from both — which is the reconciliation against
       something independent that CLAUDE.md asks for before a number is quoted.
2. [x] **320.2 — judge each declaration separately, so a dead one cannot hide
       behind a live sibling. DONE 2026-09-08, Slice 342 — and the gap was NOT
       empty: 52 dead declarations in 50 of the 357 multi-declaration
       attributes, on 13 pages, invisible to every sweep that has read this
       instrument — the 17 Slice 322 enumerated (208 through 314) among them.
       The self-test's mixed control red-proves it, failing on
       exactly one of five assertions when the verdict is put back to the
       whole attribute.** Filed rather than built: it moves a headline
       number five write-ups have quoted, and the scan is `@exact`, so it owes
       its own red-proof and new self-test cases discriminating a mixed
       attribute — which the current self-test, two single-declaration controls,
       cannot do.
       - **Accept:** the scan reports a per-declaration dead count; its
         self-test gains a mixed case and **fails when that case is judged as a
         whole**; and the run's own before/after is reconciled against the 273
         attributes named above rather than against the list it was handed.
         **Finding that the gap yields zero real dead declarations is a
         satisfying outcome** if it carries the re-run counts.
3. [ ] **320.3 — the same idiom, two values, in two shared components.**
       `ApiTable.astro:57` and `ClassRef.astro:44` both space a wrapping run of
       inline `<code>` chips, at `0.5rem` and `.4rem`. One decision, two
       spellings, and the 1.6px difference is invisible in a diff.
       - **Accept:** the two agree, or a recorded reason they should not.
         Unifying them is a **rendered** change a cloud wake cannot judge, so
         this needs a wake that can look at both, at 1440px and 390px.

**Verified live — measured, not screenshotted.** A throwaway probe (scratchpad,
not the repo) drove `serve-dist.mjs` + `browser-harness.mjs` over the eight
affected pages, reading 13 computed properties for every element:

| comparison | elements | key-set diffs | computed differences |
|---|---|---|---|
| before vs after, unmodified | 12,593 | 0 | **0** |
| `.docs-list`/`.docs-list-bare` forced, **before** tree | 12,593 | 0 | 38 |
| `.docs-list`/`.docs-list-bare` forced, **after** tree | 12,593 | 0 | **107** |
| `--bo-space-2` -> 37px, before vs after | 12,593 | 0 | **60** |
| `--bo-font-weight-normal` -> 123, before vs after | 12,593 | 0 | **3** |

The no-op row alone proves nothing — it is also what an edit that never landed
produces — so the override rows are what discriminate. Forcing the two classes
moves **38** elements in the before tree (the pages' own existing uses, 3 pages)
and **107** in the after tree (**8** pages), the **+69** being the two `<ul>`s
this round rewired plus what inherits `list-style-type` from them. The
font-weight override moves **exactly 3**, all `SPAN`s on `/patterns/detail-form/`
— the three sites edited, no more.

**And the re-scan reconciles to the element, which is what caught the unit
defect.** Lane 1 re-run reads **1,433 -> 1,272**, a drop of **161**. Predicted
from the source sites: Related's `<ul>` renders **116** times and ApiTable's
notes `<ul>` **40**, plus the 5 page-level sites = **161**, exact. It reconciles
**only** in the element unit — the first prediction, in declarations, said 392
and was wrong by 231. A hand-derived number disagreeing with the instrument is
what this repo says to investigate rather than quote, and here the instrument
was right and its LABEL was wrong.

**Gates: all 17 cloud-runnable entry points green** on the committed tree, the
list re-derived from `ci.yml` rather than read off a snapshot (the two
documented set differences still hold: `check:ci-ignores` is covered by
`check:repo`, and `npm run test -w @busy-office/ui` is CI's
`npx vitest run --root packages/core`).

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. What that would add is *"does it look right"*; what is
claimed instead is that **nothing rendered changed**, asserted over 12,593
elements' computed values on eight pages plus `check:layout`, `check:scroll` and
`test:axe` across the whole built site. The claim is structural: every converted
value is byte-equal to the literal it replaces, and every removed declaration
restated a fallback the consuming rule already carries, so a visual difference
would require a class or a token to differ from its own definition. **320.3 is
the one item here that genuinely needs a rendered image, and it is left OPEN for
that reason rather than guessed at.**

## Slice 319 — Objective grill of Slices 298, 300, 318: 25 of 27 published assertions reproduce, and both defects are in what shipped BESIDE the number. Slice 317 audited a three-part runtime claim, removed the false third, and re-published the other two unmeasured — one of them is also false (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...d6a6f60`). Trap 2 clean in one
`--unshallow` (**1,991** commits, no `shallow.lock`), and it again brought the
tags — the **thirty-first** consecutive container to do so; `git tag | wc -l`
→ **8**. Trap 1c did not bite.

Rule 1: no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 25 open items). Step 1 read **both** intakes with `ENVIRONMENT.md` §8's
controls in one run (`/discussions` → 200 len **0**; `/not-a-real-route` →
**404**, so the zero is a served zero; `/issues?state=open` → 200 len **1**,
issue #2, already triaged as `300.2` and closed by Slice 317) and triaged
nothing. Rule 2 did not match (`Standardize 3 / 4 … ok`). **Rule 3 matched —
`Objective 3 / 3 slices … OVERDUE [298, 300, 318]`.** Rules 4-8 not reached.
Rule 5 reads **STALE** (`1 wake-date(s) newer`), so per its own text it **could
not be evaluated** and is not reported clear.

**Scope, per §6 step 0.** All three are grilled, and the arming is not
over-arming even though two of the numbers have appeared in a grill before:
what armed **298** is the *build* of `298.1` (Slice 316), not Slice 298's own
findings; what armed **300** is the *build* of `300.2` (Slice 317), and Slice
304's earlier grill of 300 covered its P0 half, which is different material.
**318** is named by no grill. Both builds are hours old and were done by this
same loop, which `LOOPS.md` says goes first rather than last, because a
self-grill is the one most likely to go soft.

**Full report:** `.roundtable/grill-objective-298-300-318-2026-09-07.md`.
**25 of 27 re-run assertions reproduce exactly** (10 of 10 on Slice 316, 9 of 10
on 317, 6 of 7 on 318 — the per-slice tables in the report are the enumeration
that count is reconciled against, which the first draft of this figure was not)
— including every one of Slice
316's (the 6-file image enumeration, the single `screenshot(` renderer, the
25-day gap `4ef554fa` 2026-08-12 → `605829ca` 2026-09-06, the 274-byte favicon,
DESIGN.md rule 7, and all three contrast ratios recomputed from the token hexes:
**7.56 / 2.54 / 7.46 on white**), the `@media print` base rate re-derived by an
independent brace-matching parser (**11 literal / 0 token across 6 files**, with
every per-file count matching), Slice 317's `40` components and `10` top-level
keys, and Slice 318's CI base rate (**2 failures in the last 40 runs on `main`**,
the other being run 802 = Slice 311's `check:floor`).

### Finding A — a removal verified against raw text, in a slice about determinism

Slice 318 published *"the 99 other fixed waits"* three times (roadmap, commit
message, hand-off). **It is 98.** The slice removed one real `setTimeout` wait
and its own explanatory comment then names `setTimeout(400)`, so a raw grep
reads **99 before and 99 after** — an identical value across two inputs that
must differ, which CLAUDE.md says is a defect in the instrument until proven
otherwise. Amended in place at the end of Slice 318, with both instruments.

Worth naming precisely because the repo already has the rule and the rule did
not fire: *"when verifying that something is gone, check the parsed or
structural form — the prose explaining a removal is supposed to mention it."*
The slice applied that discipline to its own red-proof, rigorously, and not to
the sentence beside it. **That is 192.1's pattern — the defect lands in what
shipped beside the number the work was about — for the fourth recorded time.**

### Finding B — the surviving two thirds of a corrected claim, one of them false

Slice 317's whole finding was that `/patterns/kanban` asserted something its
demo cannot do. The sentence it audited makes **three** claims:

| claim | status after Slice 317 | measured here |
|---|---|---|
| a screen-reader-announced result | removed as false | — |
| a keyboard path | re-published, unmeasured | **true**, and now executable |
| a touch target that works with gloves | re-published, unmeasured | **false** |

Measured on the built page with real key events and a control run that drives
nothing (`page.keyboard`, never `el.click()`):

```
trigger focused, popover closed         before: false
Enter on the trigger                    after:  true      ← keyboard path holds
Tab                                     lands on "Move to In progress" (inMenu)
menu item box                           182 x 37
per-card trigger box                    60 x 24   at 1440px AND at 390px
control (no keys pressed)               popover open: false; items measure 0x0
```

**24px is not a glove target by this framework's own scale**, measured on the
built site rather than quoted from prose: `bo-btn` is **28 / 36 / 44px** across
compact / comfortable / spacious, which reproduces `/concepts/density`'s
published figures — and all five per-card triggers are `bo-btn--sm`, whose
`--bo-btn-height` is a fixed `1.5rem`. **It reads 24px at `spacious` too**, so
no density setting reaches the glove tier; the source agrees
(`button.css:121-125`). `/concepts/density` is explicit that 24px is the WCAG
2.5.8 minimum met through the *spacing* exception, and `/components/button`
calls spacious "the glove tier, as everywhere".

**And nothing gates either claim.** `check:target-size` sweeps **7** pages and
kanban is not among them — and adding it would not help, because the menu items
measure `0x0` while the popover is closed. The one existing `check:claims`
kanban case drives `page.click` and asserts popover open/close: it says nothing
about a keyboard path.

1. [x] **319.1 — DONE. `/patterns/kanban` stops claiming a glove-sized target
       and says what it measures instead.** Prose only, in the same paragraph
       Slice 317 corrected: the keyboard path is stated as the concrete thing a
       user does (<kbd>Enter</kbd> opens, <kbd>Tab</kbd> walks the items), and a
       new clause names the trigger as `bo-btn--sm` / `1.5rem` / 24px in every
       tier, links `/concepts/density` for the 2.5.8 spacing test, and tells a
       board that really is worked in gloves to drop `--sm`. The figure is
       written as the **tier** rather than as a bare pixel count, so it stays
       true by construction if the scale moves.

2. [x] **319.2 — DONE. The keyboard claim is executable now.** A second
       `check:claims` case on `/patterns/kanban`, driven with real key events:
       the trigger takes focus, the popover is closed before, `Enter` opens it,
       and `Tab` lands inside the menu.

       **Red-proved by injection twice, once per half, each with the
       discrimination control CLAUDE.md requires** — the built page was edited,
       the injection's presence asserted in the artefact by an occurrence count
       (not a line count: `grep -c` read **1** for **2** replacements), and the
       page restored between runs:

       | injection | new case | the existing click case | reading |
       |---|---|---|---|
       | none | pass | pass | 170 verified live, rc 0 |
       | `tabindex="-1"` on both `.bo-dropdown__item` in `#kb-menu-1` | **FAIL** | pass | `tabbedInto: false`, rest true |
       | capture-phase `preventDefault()` on Enter at that trigger | **FAIL** | pass | `after: false` |

       Each injection turns **exactly 1 of 170** red, and the sibling case that
       drives the same popover with the mouse stays green in both — so the
       injections discriminate between interaction paths rather than breaking
       the page.

3. [x] **319.3 — should a docs page be allowed to assert a target size at all
       without a gate that can see it? ANSWERED 2026-09-08 by Slice 340: no,
       and the gate is `check:claims`, not `check:target-size` — the sweep's
       growth is REFUSED on a red-proof, and the four-page "overlap" was never
       coverage.** Filed, not built, with the base rate
       measured rather than promised: `grep -rlniE 'glove|tap target|touch
       target|24px|44px' apps/docs/src/pages` finds the vocabulary on **18**
       pages, while `check:target-size`'s sweep is **7** pages — chosen for CI
       cost, and stated as such in its own header. The overlap is **4**
       (`button`, `data-table`, `form`, `quantity`), leaving **14** pages that
       use the vocabulary and are swept by nothing, `/patterns/kanban` among
       them until this slice. **What the 18 does not cover, said plainly:** it
       counts pages *containing* the vocabulary, not pages making a checkable
       target-size claim — the list is the input to that judgement, not the
       judgement.
       - **Accept:** either the sweep grows to cover the pages that make the
         claim (with the CI cost measured before and after, since that is the
         stated reason it is small), or this closes as **refused with the
         reason** — the likeliest being that the honest fix is the one 319.1
         used, naming the *tier* instead of a pixel count, which needs no gate
         because the tier is the thing the CSS defines. **Refusing is a
         satisfying outcome.** Re-run the two counts first; they are snapshots,
         and the second one is a page list, not a number, so read it rather than
         diffing it.
       - **Lane:** cloud-takeable. Geometry in a headless browser, no
         screenshot.

**NOT VERIFIED, said plainly.** No 1440/390 light-and-dark screenshots — a
cloud wake has no Podman. `319.1` is prose inside an existing `<section>`: it
adds one `<p>`, two `<kbd>` elements, three `<code>` spans and one link, all
inside the page's normal flow. It was verified against the **rendered artefact**
rather than the diff — `check:layout`, `check:scroll` and `test:axe` sweep the
page at 1440 and 390 and are green, which asserts *nothing overflows, nothing is
unreachable, no axe violation*, not that it looks right. **A local wake should
glance at `/patterns/kanban` at 390px**, where the new paragraph is the only
plausible place for a wrap to look wrong. `292.4/292.5`'s screenshot lane on
`/components/icon` remains unspent, now ten wakes back.

**One thing this grill did NOT re-measure, said rather than left silent.** Slice
318's *"42-70ms across 6 runs"* headroom figure is a property of the container
that took it. Re-running it here would produce a different number in a different
container and could not falsify the original, so it is carried, not confirmed.

## Slice 318 — `check:claims`'s calendar case raced a real navigation against a fixed 400ms wait, turned `main` red once, and recovered on the next run without a code change. It is the file's ONE navigation-gated assertion that was not already using the file's own deterministic pattern (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 317 — 300.2's spike: the board's announcement cannot be decided once — 4 of the 5 things one generic core could not know are announcement strings — and the framework's answer to this screen kind already ships, saying something about itself that is not true (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 316 — 298.1: the second fixed-medium artifact was already here and PREDATES the first by 25 days. The two agree, and the half nobody wrote down is the load-bearing one — a theme token in `@media print` prints at 2.54:1 on white paper (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...f26af8f`). Trap 2 clean in one
`--unshallow` (**1,985** commits, no `shallow.lock`), and it again brought the
tags — the **twenty-ninth** consecutive container to do so; `git tag | wc -l`
→ **8**.

Rule 1: no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**).
Step 1 read both intakes with `ENVIRONMENT.md` §8's controls and triaged
nothing: issues **1** open (#2, already triaged as `300.2`), discussions
**0** open, `/not-a-real-route` → 404, so the zero is a served zero. Rule 2
`0 / 4 … ok`; rule 3 `0 / 3 … ok`. Rule 5 read **STALE** (`1 wake-date(s)
newer`), so per its own text it **could not be evaluated** and is not reported
clear. **Rule 4 dispatched Continue, build mode.**

**The pick corrects a classification the hand-offs have carried for twelve
wakes.** Rule 4 wants the oldest still-open item; walking the open set from
the oldest, `294.2` is the first the hand-off calls cloud-takeable, and it is
not takeable by any wake in this container: the six proposals it must rank
live in an owner-supplied `busyofficeui_Design_System.zip`, and the
`upstream-contribution/` folder **is correctly absent from this repo** —
`git ls-files | grep -i contribution` returns nothing, and Slice 298's own
grill records the absence as correct. Ranking six proposals that cannot be
read would be inventing verdicts. So `294.2` is **input-blocked**, the same
fourth kind as `297.1` and not one of `LOOPS.md` 186.2's three; the next
oldest takeable item is `298.1`, which is what ran.

1. [x] **316.1 — DONE 2026-09-08 (cloud wake, Slice 338). Closed by the FIRST
       branch: the gate ships, red-proved twice.** `check:print-tokens`
       (`packages/core/scripts/check-print-tokens.mjs`) is in the core build
       between `check:sticky-layers` and `build:acr`. Tagged **`@heuristic`**
       — not `@exact` as this item forecast, and the divergence is one step:
       the token half IS an exact membership test, but deciding whether a
       media query list SELECTS print is recognition, and it can be wrong in
       the direction that accuses correct code (`@media not print` contains
       the word `print` and means the opposite). It ships **12** self-test
       cases carrying that one, plus `only print`, a comma list, `print and
       (min-width: 5in)`, a token in a comment, and a token outside print.
       `check:selftests` now reports **55 gates, 21 heuristic, 172 cases
       actually run** (was 54/20), so the cases are reachable, not merely
       present — 315.3's third rung. The README's two `stat:gates` stamps
       moved with it.

       **Red-proved twice, injection verified BEFORE the gate was believed**
       (CLAUDE.md: a green red-proof is a defect in the injection until proven
       otherwise; here both went red, and the injections were still checked).
       (1) The injection this item names — `color: var(--bo-color-text-muted)`
       at the `#555` site — asserted exactly one replacement site before
       replacing, then confirmed via `postcss.walkDecls` that it parsed as a
       **declaration** rather than landing in the surrounding comment; gate
       exit **1**, naming `print/index.css:82` — **82 at the committed tree,
       and it read 79 when the proof was first taken**, because this slice's
       own comment edit added three lines above it. That is `ENVIRONMENT.md`'s
       figure rule biting inside the wake that quotes it: the number a later
       wake re-derives is the one the commit carries. One offender, not a broad
       parse failure. (2) A custom property, `--bo-timeline-marker-fg:
       var(--bo-color-text-muted)`, injected into `approval-workflow`'s real
       print block: exit **1** naming `:285` — **while the byte-identical
       pre-existing declaration at `:69`, outside any print block, was NOT
       flagged.** That second one is a discrimination proof: the detector is
       reading position, not just the token string.

       **The exemption list this item anticipated is refused on a
       measurement**, and the base rate reproduced — both in Slice 338.

       **What the gate does NOT see is filed as `338.1`** rather than quietly
       widened: a token reaching paper through the ordinary cascade.

       **Original item text, kept verbatim below** so the Accept this was
       judged against stays readable — including the `@exact` forecast the
       build diverged from, which is this file's own rule about a criterion
       naming a property rather than predicting a value.

       > **316.1 — should a gate forbid a theme token in a `@media print` colour
       declaration?** Filed, not built, and the base rate is measured rather
       than promised: the predicate "a colour declaration inside `@media print`
       references `var(--bo-color-*)`" is true of **0 of 11** such declarations
       today, across 6 files. By 94.11's rule that is a predicate uniformly
       false rather than uniformly true — it distinguishes nothing *now* and
       would distinguish exactly the regression 298.1 measured (a token here
       prints at 2.54:1). Unlike 94.11's refused gate this one is an **exact**
       membership test, not a semantic one, so it can go red.
       - **Accept:** either the gate ships red-proved by injecting
         `color: var(--bo-color-text-muted)` at the `#555` site, or this
         closes as refused **with the reason** — the likeliest being that a
         blanket ban is wrong for a fill whose colour IS content
         (`print-color-adjust: exact` markers), which would need the exemption
         list this repo's other gates carry. **Refusing is a satisfying
         outcome.** Re-run the base rate first; it is a snapshot.

       Command, so the next wake re-runs rather than re-derives — brace-match
       every `@media print` block under `packages/core/src/css`, strip
       comments, and classify each `color|background|background-color|
       border-color|fill|stroke|outline-color` declaration as token vs literal.
       On 2026-09-07 at this slice's own tree: **11 literal, 0 token**, in
       `approval-workflow` (1), `badge` (2), `data-table` (2), `stepper` (3),
       `print/index.css` (1) and `reset/index.css` (2).

## Slice 315 — Objective grill of Slices 294, 312, 314: the gate written to catch a detector that cannot fail became one — `check:ci-ignores`'s `--self-test` has sat below an early return since 312.2 emptied `paths-ignore`, running 0 of its 18 cases while `check:selftests` reported it self-tested (2026-09-07)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...35c1da7`). Trap 2 clean in one
`--unshallow` (**1,983** commits, no `shallow.lock`), and it again brought the
tags — the **twenty-eighth** consecutive container to do so; `git tag | wc -l` →
**8**. Trap 1c did not bite.

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**
across the 25 open items. Step 1 read **both** intakes with `ENVIRONMENT.md` §8's
controls in one run (`/discussions` → 200 len **0**; `/not-a-real-route` →
**404**; `/issues?state=open` → 200 len **1**, issue #2, already triaged as
`300.2`) and triaged nothing: no new input. **Rule 2 did not match** —
`Standardize 0 / 4 … ok`, reset by Slice 314's row. **Rule 3 matched** —
`Objective 4 / 3 slices … OVERDUE [292, 294, 312, 314]`, un-reached for two
consecutive wakes. Rules 4-8 not reached. Rule 5 reports **STALE** (`1
wake-date(s) newer`), so per `LOOPS.md` it **could not be evaluated** and is not
reported clear.

**Scope narrowed per §6 step 0: 292 is dropped, 294/312/314 are grilled.** Slice
298 is an Objective grill of 292 in full and
`grill-objective-292-293-295-second-pass-2026-09-06.md` is a *second* pass over
it; a third is the over-arming that step exists to prevent. 294, 312 and 314 are
named by no grill in either roadmap file or in `.roundtable/`. 312's items were
built by **Slice 313**, so 313 is read as part of 312's scope.

**Full report:** `.roundtable/grill-objective-294-312-314-2026-09-07.md`.
**21 of 23 re-run assertions reproduce exactly**, including every one of 314's
token and scope claims (`4 of 127`, `1 of 24` after 314.1, `xl` at
`typography.css:11`, `md` at line 9, no token equal to `2rem`) and every
structural claim in 312/313 (`paths-ignore` gone, `.roundtable` a bare `ROOTS`
element, `check-loop-vocab` genuinely clean).

1. [x] **315.1 — `check-ci-ignores.mjs`'s `--self-test` must run before the
       script's early returns.** 312.2 emptied `paths-ignore`, so the gate
       correctly `process.exit(0)`s at *"nothing to verify"* — at line **219**,
       above the `--self-test` branch at line **293**. From that commit onward
       `node check-ci-ignores.mjs --self-test` ran **0 of 18 cases** and exited
       0. The docs-image SKIP path (`ci.yml` absent from that build context) was
       a second route to the same silence.

       **`check:selftests` kept reporting `20 heuristic (all self-tested)`, and
       it is not lying by its own contract — that is the finding.** It asserts
       `process.argv.includes('--self-test')` appears in the source; the branch
       exists, and nothing reaches it. Its own header records closing the
       previous step of this exact hole (*"The first version matched the string
       `--self-test` and every heuristic gate passed"*). **Mention →
       implementation was closed; implementation → reachable was not.**

       - **Accept — the property:** with the tree in its shipped state (no
         `paths-ignore`), `--self-test` reports a case count that agrees with the
         number of fixtures in the file, and goes **red** on a fixture whose
         expectation is deliberately wrong; and the plain run's verdict is
         unchanged in all three contexts (no `paths-ignore`, `paths-ignore`
         present, `ci.yml` absent).
       - **DONE 2026-09-07 (cloud wake).** The block moved above the `ci.yml`
         read; all five detector helpers are hoisted `function` declarations at
         lines 94-165, so nothing else reordered, and the fixtures need neither
         `ci.yml` nor a build context.

         **Red-proved in both directions and in both dead contexts**, injection
         confirmed present by a `ZZINJECTED` marker + `grep -c -F` before each
         run:

         | tree state | wrong fixture | before fix | after fix |
         |---|---|---|---|
         | no `paths-ignore` (shipped) | yes | **rc=0, 0 cases** | **rc=1, 18 cases** |
         | no `paths-ignore` (shipped) | no | rc=0, 0 cases | rc=0, **18 cases** |
         | `ci.yml` absent (docs image) | yes | rc=0, 0 cases | **rc=1** |
         | `paths-ignore` restored + control | yes | rc=1, 18 cases | rc=1, 18 cases |

         The restored entry was `visual-baselines/**` — in `SOURCE_SKIP_DIRS`, so
         it cannot itself fail — the same control Slice 313 used. **The first
         red-proof attempt was discarded**: its `grep -c` control carried nested
         quotes and returned 0, so the run proved nothing about the injection,
         per CLAUDE.md.

2. [x] **315.2 — 294's `139` hex literals is unreproducible; the entry now
       carries the command and the re-measured figure.** 294 retracts a finding
       on that base rate and records **no command**. Re-measured at **294's own
       commit** (`c6643153`, per `ENVIRONMENT.md`'s read-it-from-that-commit
       rule), six plausible spellings return **142, 142, 123, 141, 114, 134** —
       none is 139 — and the same regexes read 142 at `HEAD`, so it is not
       snapshot drift.

       **The verdict is unaffected and stays**: at 139 or 142, *"a token file is
       where hex belongs"* is the same conclusion. The defect is the audit trail
       — `ENVIRONMENT.md`'s *harmless in their conclusions and wrong in the audit
       trail a later wake re-runs* — and CLAUDE.md's **write the command next to
       the claim** is the rule that was skipped.

       - **Accept:** 294's paragraph carries a re-runnable command and a figure
         that command produces, or states that the original figure could not be
         reproduced. **Amending 294 in place is the fix** (236.2: archived and
         live text alike may be amended for a correction); no gate is added.
       - **DONE 2026-09-07** — amended in place, with the command and both
         readings.

3. [x] **315.3 — should `check:selftests` EXECUTE each self-test rather than
       grep for the branch? Filed with its base rate, deliberately not built
       inside a grill.** 315.1 fixes the one site; this is the general question
       underneath it.

       **Base rate measured first (94.11), and it took two wrong readings to
       get** — both in ways this repo already writes down:

       | reading | figure | why it was wrong |
       |---|---|---|
       | 1st | 8 of 20 run zero cases | taken with **no `apps/docs/dist`** — 4 gates died before their own branch |
       | 2nd | 4 of 20 | counted `^self-test: `, the shared helper's format only |
       | **honest** | **1 of 20 (5%)** | `check-resume-charter` (9 cases, `ok <name>`), `check-resume-slice-ids` (12, same) and `check-rf-floor` (a bespoke one-line verdict) all **do** run |

       That third row is the cost estimate as well as the base rate: **there is
       no single parseable output shape today**. Executing each self-test means
       either standardising 20 gates onto one marker, or asserting on exit code
       alone — which cannot distinguish *"ran 18 cases, all passed"* from *"ran
       none"*, i.e. it would not have caught 315.1.

       - **Accept:** a recorded decision — a marker contract adopted across the
         heuristic gates, or a refusal with the reason. **Refusing is a
         satisfying outcome**, and so is finding that the base rate has moved:
         re-run the per-gate `--self-test` sweep **with `dist` built** and read
         each gate's raw output rather than grepping one format. The figures
         above are snapshots.
       - **Lane:** cloud-takeable. No browser, no screenshot.
       - **DONE 2026-09-07 (cloud wake) — a marker contract, ADOPTED.** The
         sweep was re-run as the Accept asks; both figures above had moved
         (**0 of 20** run zero cases, and the no-`dist` half no longer
         reproduces at all — all twenty are byte-identical without it). The
         two costs that were expected to refuse this measure zero: **about
         1.23 s added to `check:repo`** (whole gate `1355 / 1295 / 1300 ms`
         against `69 / 68 / 65 ms` for the scan alone) — **amended 2026-09-07 by
         336.1C, which read `1.38 s for twenty child processes`, a figure this
         bullet's own commit `ac4a9a0f` had already corrected 2,200 lines away
         in Slice 334 — lines 411/414 against this bullet's 2611, in that
         commit's own `ROADMAP.md`** — and only **3 of 20** gates needed an edit,
         because the contract was written to accept both shapes already in the
         tree. Exit code alone was rejected for the reason this item states —
         it cannot see 315.1 — and the count is what an unreachable branch
         cannot print. Full working, the four contexts, and the three
         red-proofs are in **Slice 334**; the one question left over is
         `334.1`.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing in this slice renders: the diff is one gate script's
statement order, roadmap prose and a `.roundtable/` report.
`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent, now from
seven wakes back, and the withdrawn-claim paragraph on `/components/data-table`
is still unlooked-at.

## Slice 314 — Standardize sweep, 4 of 4 lanes: lanes 1-4 clean, and the finding came from the re-scan step 4 mandates — 292.8's scope was "the whole page tree", and the 24 shared components/layouts that render INTO every page were outside every count it took (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 313 — 312.1 + 312.2: the honest reader set is FOUR gates, not two, and three of the four never spell the path at all. `paths-ignore` is removed rather than the reads, because keeping it means reversing three recorded decisions (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 312 — P0: `check:ci-ignores` asserts that nothing CI runs reads `.roundtable/**`, and two gates CI runs read it — one of them has the directory as a literal string in its own `ROOTS` array (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 311 — 294.1: the three probes are one line each, and the item's own reason for calling them harmless — "they arrive `@supports`-guarded" — is not a thing `derive-floor.mjs` can see. Adding the third opens the first hole in the floor where BCD says a browser will NEVER support it (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 310 — filed while closing 292.9: the two reference APPS hand a reader four deprecated glyphs that the docs gate deliberately does not cover, and `/base/motion` declares five copyable markup samples the page never renders (2026-09-07)

Both were measured while building `check:deprecated-icons` and are outside
292.9's Accept, which scopes the property to `apps/docs/src`. Filed rather than
folded in, because each turns on a judgement 292.9 did not make.

1. [x] **310.1 — DONE (2026-09-07, cloud wake). Three of the six sites went
       away, and the deprecation was the smaller half of why; three stay, with
       the reason written beside the code.** As filed: `examples/erp-suite` and
       `examples/po-app` render deprecated glyphs, and whether that was a defect
       was undecided. 292.9's whole
       argument for treating a docs page differently from a consumer screen is
       that *a reader copies from it*. These two are the reference applications
       the docs point adopters at, which is the same argument one step over —
       but they are also SCREENS, and the deprecation's own text says existing
       renders keep working. Measured 2026-09-07, on the committed tree:

       ```
       grep -rn "bo-icon--\(settings\|barcode\|building\|user\)" examples/ --include='*.mjs'
       #  examples/erp-suite/prod/production-orders.screen.mjs   bo-icon--settings
       #  examples/erp-suite/prod/capacity.screen.mjs            bo-icon--settings
       #  examples/erp-suite/prod/bom.screen.mjs                 bo-icon--settings
       #  examples/po-app/server.mjs:146                         bo-icon--barcode
       grep -rn "icon: *'" examples/erp-suite --include='*.mjs' | grep -oE "icon: *'[a-z0-9-]+'"
       #  settings and user among the six module identities
       ```

       So: **4 literal + 2 interpolated sites.** `check:deprecated-icons`
       cannot reach them from either phase — `examples/` is not in its source
       walk, and `dist-pages.mjs` skips `dist/suite/` by name, which is why the
       `/suite/` exemption written for it was removed as dead rather than left
       to look like coverage.
       - **Accept** — the property, not a value: each of the six sites either
         stops naming a deprecated glyph, or the decision that a reference
         application may keep one is recorded with its reason, in a place a
         later wake reads. **Deciding they may all keep their glyphs is a
         satisfying outcome** — it is the honest reading of "existing renders
         keep working" — provided the reason is written down and
         `check:deprecated-icons`' header stops implying the question is open.
         If they change, the audit that proves it is `npm run suite` plus
         `check:po-app`, both of which already run in a cloud wake.
       - **Lane**: cloud-takeable. Glyph choice is editorial and the mask box is
         `1em` either way, so no geometry moves; say which glyph and why.

       ### What was done, and the premise re-checked first

       **The premise reproduces exactly** — both commands above, re-run at
       `9a4be080` before anything was touched: the same four literal lines, and
       `settings` and `user` among the interpolated identities. 4 + 2 = 6.

       **The three `prod/` sites were a Standardize one-off wearing a
       deprecation's clothes, and only the wider measurement showed it.** The
       item's own frame — "is a deprecated glyph on a reference screen a
       defect?" — is answerable per site, so the first question asked was what
       the suite does ELSEWHERE for the same control:

       ```
       grep -rn "bo-btn--icon" examples/erp-suite --include='*.mjs'
       # 11 lines: 7 `bo-btn--ghost bo-btn--icon` Refresh buttons carrying `⟳`,
       #           3 `bo-btn--secondary bo-btn--icon` in prod/ carrying
       #             `bo-icon bo-icon--settings`,
       #           1 in audit.mjs — a querySelectorAll STRING, not a button.
       ```

       That eleventh line is why the rendered artefact is the authority and not
       the grep: **the built suite carries 10 Refresh icon-buttons across its 28
       screens**, and a source count read 11. So the three `prod/` screens were
       the only ones off the suite's own convention, diverging on three axes at
       once — variant (`--secondary` vs `--ghost`), content (a glyph span vs the
       `⟳` character) and label (`"Refresh"` against `"Refresh <thing>"`). The
       glyph was also simply wrong for the action: `--settings` is a sliders
       mark, the framework ships no refresh glyph, and the suite's own charter
       says a need the framework has not got is written into
       `erp-suite-gaps.md`, never papered over. All three now read
       `<button class="bo-btn bo-btn--ghost bo-btn--icon" type="button"
       aria-label="Refresh production orders">⟳</button>` and its two siblings.

       **The geometry claim is measured, not inferred from `1em`.** A throwaway
       probe (`serve.mjs` + `browser-harness.mjs`, 1440px, the built suite)
       read every `button[aria-label^="Refresh"]` on all 28 screens:

       ```
       before:  10 buttons, 2 distinct class strings (7 ghost + 3 secondary),
                distinct boxes: 36x36
       after:   10 buttons, 1 distinct class string, distinct boxes: 36x36
       ```

       **The probe's first output was wrong, and it is recorded because the
       trap is transferable.** Under `waitUntil: 'load'` the computed
       background split 4/3 *within* the seven ghost buttons — some
       `rgba(0,0,0,0)`, some Chrome's UA `rgb(239,239,239)` — which reads as a
       real cascade finding. It is not: two runs under `load` disagreed with
       each other, and two runs under `networkidle0` plus two rAFs agreed
       exactly (7 transparent, 3 white-with-border). An instrument's first
       output is not evidence; the bullet is now in `ENVIRONMENT.md`.

       **The remaining three stay, and the reason is at the code.**
       `_shell.mjs` above `MODULES` (Production's `settings`, CRM's `user`) and
       `server.mjs` above `page()` (po-app's `barcode` on Receive). The ground
       is the deprecation's own: it exists because the framework should not grow
       into an icon library, not because these glyphs are wrong — each was one
       example value of `--bo-icon-src` — and its text says existing renders
       keep working. All three are nav identities on rendered screens, and all
       three are apt. Composing an SVG instead would have these examples
       hand-author artwork no cloud wake can look at.

       **The "no alternative was free" half was written first and was FALSE, so
       it is recorded rather than quietly corrected** — 327.3's shape exactly,
       an unmeasured sentence riding beside a measured one, caught on the
       adversarial re-read of this wake's own diff. Counted:

       ```
       26 shipped glyphs − 4 deprecated − 5 already on the suite rail = 17 free
       26 shipped glyphs − 4 deprecated − 6 already on po-app's rail = 16 free
       of each, 12 are the richtext-toolbar set 137.1 added; the rest are
         suite:  chart, check-circle, close, doc, save
         po-app: cart, close, doc, save
       ```

       Both comments now carry that count, and label the remaining half — that
       none of those depicts a production module, a customer or a goods receipt
       better than the glyph in place — as the JUDGEMENT it is rather than as a
       measurement.

       **Re-measured after the change**: 1 literal site (po-app's `barcode`) + 2
       interpolated, all three carrying a written reason. `check-markup` over
       the built suite moved `4235 -> 4229` bo-* class uses, which reconciles
       exactly: three `bo-icon` + three `bo-icon--settings` removed, and
       `--secondary -> --ghost` is a swap.

       **Gates**: `npm run suite` green before and after (28 screens, zero CSS
       of its own, zero axe violations at both widths), and `check:po-app`.

       - **REFUSED in this item: a gate over `examples/**`.** Post-change the
         population is three sites and this wake has just decided all three may
         keep their glyph, so the exemption map would BE the population — the
         ceremony 94.11's base-rate rule refuses. The counter-argument was taken
         seriously rather than waved off: `check-erp-suite.mjs`'s assertion 4
         earned a gate at a 100% base rate because its population had held a
         violation one day earlier, and this population held three at the start
         of this wake, which is a stronger version of the same fact. What
         separates them is that its property admits no legitimate exception, so
         an empty exemption map is that gate's correct steady state, whereas
         this property is negotiable by construction. The reopen condition — a
         deprecated glyph in `examples/**` that nobody will write a reason for —
         is in `check-deprecated-icons.mjs`'s SCOPE section, not only here.
       - **Found in passing and fixed, because it was in the lines being
         edited**: `_shell.mjs`'s `MODULES` was headed *"The six modules"* over
         **seven** entries. Reconciled against the rendered page rather than the
         array — `bo-sidebar-nav__label` occurs 7 times in `dist/index.html`,
         and `MODULES.length` is 7. Home plus six business modules; the comment
         had counted the modules and described the array.
       - **NOT VERIFIED, said plainly**: no screenshots — a cloud wake has no
         Podman. The three buttons change their painted look (a bordered white
         `--secondary` box becomes a transparent `--ghost` one), and that is a
         rendered-image judgement no measurement here replaces. What IS measured
         is that they now match the seven the suite already shipped, byte for
         byte in class and content, at an unchanged 36x36. **A local wake should
         glance at `/prod/production-orders`, `/prod/capacity` and `/prod/bom`.**

2. [x] **310.2 — `/base/motion` declares five copyable markup samples the
       template never renders.** Found by checking the built page for a string
       the source clearly contains: `savingMarkup`'s `bo-icon--grid` appears in
       `dist/base/motion/index.html` exactly once, from the inline script, and
       the code block is simply absent. Counting references in the source, five
       consts are declared and used nowhere:

       ```
       for c in toastMarkup menuMarkup rowMarkup savingMarkup removeMarkup; do
         echo "$c $(grep -o "$c" apps/docs/src/pages/base/motion.astro | wc -l)"; done
       #  each 1 — the declaration itself.  entranceMarkup reads 2 (declared + rendered)
       ```

       They are the "intent vocabulary" samples (Entrance / Attention /
       Progress / Exit), written to sit beside the eight motion classes. Either
       the section that renders them was dropped, or they were never wired up.
       **This is not merely dead code**: 292.9's premise called one of them "a
       copyable markup string — the exact shape 292.4 just fixed", and it teaches
       nobody anything today because it ships nowhere. A page can carry a
       maintained-looking sample that no reader can reach, and nothing says so.
       - **Accept** — each of the five is either rendered (in the page's own
         skeleton, with a caption) or deleted, with one line saying which and
         why. **Deleting all five is a satisfying outcome.** Re-run the count
         above afterwards; it must read 0 for every name that remains.
       - **Lane**: cloud-takeable if deleted. Rendering them adds sections to a
         built page, which the whole-tree gates sweep but nobody would have
         LOOKED at — so that half wants a local wake, or an explicit
         NOT VERIFIED.

       **DONE 2026-09-07, Slice 333 — all five DELETED.** The premise
       reproduced exactly (each const occurring once; each one's text occurring
       **0** times in `dist/base/motion/index.html`). The deciding measurement
       is not deadness but **drift**: they were a hand-maintained second copy of
       markup the "In context" section already renders live, and **3 of the 5**
       (`menuMarkup`, `rowMarkup`, `removeMarkup`) had already diverged from the
       element the built page renders — so the *render* branch of this Accept
       would have shipped three samples contradicting the showcase beside them.
       The built page is **byte-identical** before and after
       (`f8886e3e9ee20f6464ae9545cd44d7aa`), which is why no screenshot is owed.
       The Accept's own re-run command is the one thing that does NOT apply:
       run literally it reads 2-3, because the comment explaining the deletion
       names all five — CLAUDE.md's structure-not-raw-text rule landing in a
       criterion. Full record, controls and the follow-up (`333.1`) in Slice 333.

## Slice 309 — Objective grill of Slices 307, 308: Slice 308 reproduces to the word, and underneath Slice 307's re-measurement is a P0 — the reference app's shared init has been swallowed by a trailing comment since 2026-08-23, so the select-all it timed did nothing (2026-09-06)

**Dispatched by rule 3**, `dispatch_status.py` reading `Objective 3 / 3 slices
since 2026-09-07 00:21 OVERDUE [292, 307, 308]`. Rule 1: no open P0 —
`grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i p0` returns nothing across
the 23 open items. Rule 2: `Standardize 0 / 4 … ok`. Step 1 read both intakes
with `ENVIRONMENT.md` §8's controls in one run (`/discussions` → 200 len **0**;
`/not-a-real-route` → **404**; `/issues?state=open` → 200 len **1**, issue #2,
already triaged as `300.2`) and triaged nothing: no new input.

**Scope narrowed per §6 step 0.** The armed set was `[292, 307, 308]`; **292 is
dropped**, already grilled in full and twice — Slice 298 and the redundant
second pass in `grill-objective-292-293-295-second-pass-2026-09-06.md`. Grilled
here: **307 and 308**.

### Slice 308 reproduces in full, including the instrument reconciliation

Re-derived independently, not read off the slice. The per-section split of
`LOOPS.md`'s dispatch region at the eight revisions since 274.2's cut:

```
### Step 0c  (274.2's cut)   1378 -> 936, and 936 at every revision since, HEAD included
### Step 0                    563 -> 714   (+151)
### Step 1                    300 -> 671   (+371)
### Step 2 (rule 3 within)   3203 -> 3506  (+303)
## the loops table            214 -> 266   (+52)
TOTAL body words             5602 -> 6479  (+877)
```

Every figure Slice 308 published matches. **The 56-word instrument gap
reproduces too**: heading-line words are the whole difference between the
report's row (**6,535** at HEAD) and the body split (**6,479**), and it is
exactly 56 at all eight revisions, so the deltas agree and the totals never
will. A third splitter written here — one that also strips the numbered rule
lines — reads a constant **93** below 308's table at all eight revisions, which
is the same agreement seen from a third angle. **Nothing in 308 is corrected.**

### Slice 307: the shipped correction is right, and the measurement under it is not

307's own thesis — *a wall-clock millisecond published without its machine is
not reproducible* — is correct and the paragraph it shipped to
`/components/data-table` says so well. What it also shipped was **two more
unmachined milliseconds**, and those turn out to be a measurement of nothing.

`/stress` takes its behaviours from the reference app's shared `page()`
template. On **2026-08-23**, commit `1f75dab4` reformatted that template's init
block:

```
-  initDialogs(); initDataTables(); initAlerts(); initDropdowns();
+  initDialogs();
+  initGroupedNumber(); // grouped amounts (0.4.0), dogfooded 2026-08-23 initDataTables(); initAlerts(); initDropdowns();
```

**All three calls landed inside the `//` comment.** They have not run on initial
page load since — **15 days**. So the select-all checkbox 307 timed toggled
itself and selected no rows, and its "3 ms / 1k, 7 ms / 5k, not slower" is the
cost of a no-op.

**Found by a control, not by reading the code.** The probe written to re-run
307's measurement counted how many row checkboxes ended up checked, and read
`checkedAfterLast=0` beside its timings. Without that column the wake would have
published a third set of plausible-looking milliseconds. This is CLAUDE.md's
"an instrument's first output is not evidence" doing its job in the ordinary
direction — the instrument was fine and the *subject* was dead.

**Blast radius, measured over all 10 GET routes rather than assumed:**

| behaviour | measured state before the fix |
|---|---|
| `initDataTables` | **DEAD** on the 2 routes carrying a select-all — `/pos` `0/10` rows, `/stress` `0/200` |
| `initDropdowns` | not initialised on load on the 5 routes with a dropdown surface and no own init |
| `initAlerts` | **inert** — `grep -c 'bo-alert__dismiss'` over the app reads **0**, so it had no surface to lose |

`/movements`, `/inbox` and `/receive` were unaffected — **but not for the reason
published here, corrected 2026-09-07 by `327.1`.** This sentence read *"each
runs its own inline `initDataTables()`"*, and only `/movements` does
(`examples/po-app/server.mjs:1006`). `/receive` and `/inbox` run none, and each
renders exactly one `.bo-data-table-container` — the element `initDataTables`
binds (`packages/core/src/js/behaviors/data-table.ts:98-101`) — so both were
UNBOUND for the same 15 days. They were unaffected anyway, because neither
carries a `.bo-data-table__select-all` or a `.bo-data-table__row-select`, so
`bindContainer`'s two listeners had no surface: the same reason `initAlerts` is
inert one row above, not a self-init. The blast-radius table is unchanged and
reproduces. `check:po-app` reporting **19 behaviours green** throughout is
unchanged too — every browser assertion it makes lives on a page that
self-inits, on a container the dead calls would have bound to no effect, or on
htmx-swapped content, which the template re-inits on a separate line. The gate
was real and structurally blind to this one line.

**A first dropdown reading of `0` in this grill was wrong and was caught by the
same discipline** — the probe used `[data-dropdown], .bo-dropdown`, and the
behaviour keys off `[popovertarget]` / `.bo-dropdown__item`. Re-measured with
the behaviour's own selectors, 9 of 10 routes carry a surface. A zero is a
defect in the instrument until proven otherwise; this one was.

1. [x] **309.1 — DONE. P0 fixed: the three init calls are back on their own
       line**, with a comment saying why they must stay there. Red-proved by
       discrimination, not by inspection: `/pos` `DEAD(0/10)` → `LIVE(10/10)`
       and `/stress` `DEAD(0/200)` → `LIVE(200/200)` on the same probe across
       the one-line change.

2. [x] **309.2 — DONE. The gate that should have caught it now exists and has
       been watched failing.** `check:po-app` gains one case — the shared
       template inits data-tables, so select-all on `/pos` checks every row,
       driven with `page.click` per `ENVIRONMENT.md`'s trusted-dispatch rule.
       19 → **20 behaviours**. Red-proof by re-injecting the exact broken line
       (occurrence count asserted at 1 before and after the replace): the gate
       exits 1 with **`1 of 20`** failing and
       `{"boxesBefore":10,"checked":0,"count":""}` — the one case under test and
       no other, which is the "red TOO BROADLY certifies nothing" check.

3. [x] **309.3 — DONE. The published claim is withdrawn on the page that
       carries it.** `/components/data-table` no longer quotes 3 ms / 7 ms as a
       re-run. It says the re-run is withdrawn, why (the control was not wired),
       that the 2026-08-15 table predates the break and is unaffected, and the
       reusable half: **a timing probe needs a control proving the work
       happened**. Called out rather than deleted, following this repo's own
       precedent for a withdrawn diagnosis (`ENVIRONMENT.md` §6).

       **No replacement figure is published, deliberately.** Today's fixed-tree
       readings — median **122 ms / 1k** and **586 ms / 5k** — include a forced
       style+layout flush, which the table below them scores as its own separate
       column (231 ms at 5k). They are not comparable to the `Select-all`
       column, and publishing them would repeat the exact error being corrected.
       They are recorded here, where the incomparability can be stated, and not
       there.

4. [x] **309.4 — DONE. `307.1`'s Accept named three metric names and two of the
       three claims are false today**, so it is rewritten to name the property.
       Measured over the 132 samples in `loop-metrics.jsonl`:

       | name | samples | distinct days | newest |
       |---|---|---|---|
       | `ci-wall-time` | 26 | **1** | 2026-08-18 |
       | `axe-violations` | 17 | 8 | 2026-09-06 |
       | `bundle-gz-kb` | 11 | 5 | 2026-09-03 |
       | `claims` | 11 | 3 | **2026-09-06** |

       `ci-wall-time`'s 26 samples all fall inside **17 hours of one day** and
       nothing has been recorded for it in 19 days — it is the deadest of the
       four, not one of the three live ones. `claims` is sampled as recently as
       `axe-violations` and was omitted. A later wake executing that criterion
       literally would have re-scoped rule 5 onto a dead name and dropped a live
       one. **CLAUDE.md's criterion rule, landing again**: the Accept now says
       *derive the pairing set from the log at execution time and record the
       command*, which is satisfiable by measuring.

**Two smaller things this grill noticed, logged rather than fixed** (per the
operating rule: fix only what is smaller than the explaining):

- **307's recorded re-run command does not run on a fresh clone.** It reads
  `node examples/po-app/server.mjs # :8080`; that exits `MODULE_NOT_FOUND` on
  `htmx.org/dist/htmx.min.js`, because `examples/po-app/node_modules` does not
  exist until `check:po-app` performs its own `npm pack` + install
  (`ENVIRONMENT.md` already documents the non-hoisting, not this consequence).
  The working recipe is `npm run check:po-app -w docs` first. Filed as `309.5`.
- **No re-measurement probe is kept anywhere** — `grep -rln` over
  `apps/docs/scripts`, `packages/core/scripts` and `examples/` finds the
  `/stress` route and no timing script. The docs page says the harness is kept
  so an adopter can re-measure, and what is kept is the page that renders rows,
  not the measurement. Both re-runs (307's and this one) had to invent a method,
  which is why their numbers are not comparable even before hardware. Filed as
  `309.5` with the recipe above.

6. [x] **309.6 — DONE, and found by this slice breaking it: `roadmap_scope.py`
       read a `## ` row inside a ``` fence as a real heading**, so every item
       BELOW such a row was charged to "no slice" and dropped out of the OPEN
       set dispatcher rule 4 reads.

       Not hypothetical and not new. Writing Slice 309's per-section table —
       whose rows begin `## the loops table  214 -> 266` — made the script
       report **23 open** against a raw `grep -c` of **24**, and `OPEN:` omitted
       Slice 309 entirely while listing 309 as a *closed* sweep target. The same
       bug had already swallowed **`308.1`**: the previous hand-off recorded the
       anomaly as *"it also counts … `308.1`"* and explained it as arithmetic
       rather than diagnosing it.

       **The reconciliation did not fire, and that is correct behaviour** — it
       accounts for strays, so a mis-attributed marker still balances. What it
       cannot do is notice that the marker was attributed to the *wrong* place.
       Body-line counts and the closed-share figure are unaffected.

       Fixed with a fence guard, and gated: `--self-test` gains **case F**, which
       carries its own discrimination (the same fixture with the fence removed
       must parse differently, or the case proves nothing). Red-proved by
       removing the guard — case F fails and names the item that would be
       invisible to rule 4; restored and green. After the fix: **24 open**,
       matching the raw count, `OPEN` includes 309, strays drop 8 → 2 (the two
       real `## STATE` owner calls).

       **Prior readings of this instrument are suspect wherever a slice quoted a
       `## ` row inside a fence**, which is a habit this loop has only recently
       acquired (Slices 308 and 309). The open-count figures in hand-offs before
       308 are unaffected.

5. [x] **309.5 — The `/stress` harness is half a harness: the rows are kept, the
       measurement is not.** Two re-runs have now written their own probe and
       produced numbers that cannot be compared to each other or to the
       published table. The start recipe is also incomplete (see above).
       - **Accept** — the property, not a figure: a committed probe that anyone
         can run against `/stress` and that **carries its own control** (it
         asserts the rows actually ended up selected, and fails loudly if not —
         this grill's whole finding is that a timing number without that column
         is unfalsifiable), plus the start command that works from a clean
         clone. It records what it measures — whether the style flush is inside
         the number or beside it — so two runs are comparable. **Deciding the
         probe should NOT be committed is a satisfying outcome** if the reason
         is recorded: a plausible one is that a per-adopter number is meant to
         be taken with their own tooling, in which case the docs page should
         stop implying a re-run is a supported operation.

       **DONE 2026-09-07 (cloud wake), by committing the probe rather than by
       the refusal branch.** `apps/docs/scripts/measure-stress.mjs`, run as
       `npm run measure:stress -w docs`. It is explicitly **not a gate** — CI
       runs nothing here and it asserts no budget, which is Slice 307's own
       refused-latency-gate finding still standing.

       Each Accept clause and how it was met:

       | clause | how |
       |---|---|
       | runs from a clean clone | it drives `startPoApp()`, which does the tarball pack + install; the recorded `node examples/po-app/server.mjs` never could |
       | carries its own control | every row prints `checked/rows`; a run where they disagree, or either is 0, prints **no timing at all** and exits 1 |
       | records what it measures | four named definitions in the header; `select-all` and `style-flush` are separate columns |
       | style flush inside or beside | **beside** — `update()` in `data-table.ts` only writes to the DOM, so the recalculation is not in the dispatch |

       **The control is red-proved by injection, and the injection was
       confirmed to land** (occurrence counts asserted: 1 live line → 0 live,
       1 commented). Re-applying `1f75dab4`'s exact break — the trailing
       comment that swallowed `initDataTables(); initAlerts();
       initDropdowns();` — the probe exits **1** with `0/1000 checked` and an
       empty timing row. It went red narrowly: the control failed, nothing
       crashed, and `check:po-app` was separately re-run green at **20
       behaviours**, unchanged by the refactor below.

       **The `style-flush` column's FIRST implementation was a dead detector,
       and the tell was the one CLAUDE.md names.** It timed a forced
       `offsetHeight` inside a `setTimeout(…, 0)` after the dispatch, and read
       **0.0 / 0.1 / 0.0 ms at 1k / 5k / 20k** — an identical value across
       inputs differing 20-fold, against a published column of 231 ms at 5k.
       The event loop takes a rendering opportunity *between* tasks, so the
       later task always finds the style recalculation already paid. Moved into
       the same task, at the end of the `change` dispatch, the same column
       reads **90.1 / 342.8 / 2415.2 ms** and scales monotonically. That
       transition is the red-proof by discrimination: the old form cannot
       distinguish 1k from 20k, the new one can.

       **`change`, not `click`, is what is bracketed** — `data-table.ts` binds
       `change` on the container, and a checkbox fires `change` from its
       activation behaviour *after* the `click` dispatch has finished, so a
       click-bracketed timing would have excluded the entire body of work. The
       click itself is driven with `page.click` per `ENVIRONMENT.md`'s
       trusted-dispatch rule.

       **Readings taken while verifying, recorded with their machine** (Intel
       Xeon @ 2.80GHz, 4 cores, 15.7 GB, linux x64, Node v22.22.2,
       Chrome/141.0.7390.37, no throttle, 1440px, medians of 3):

       | rows | control | render-dcl | select-all | style-flush |
       |---|---|---|---|---|
       | 1,000 | 1000/1000 | 399.9 ms | 4.6 ms | 90.1 ms |
       | 5,000 | 5000/5000 | 1782.7 ms | 14.4 ms | 342.8 ms |
       | 20,000 | 20000/20000 | 4416.8 ms | 64.3 ms | 2415.2 ms |

       **These are NOT published on the docs page and must not be read against
       its 2026-08-15 table.** `select-all` is the one column whose definition
       is close enough to compare in shape (4 / 18 / 49 there), and even that
       is different hardware. `render-dcl` is `domContentLoadedEventEnd -
       responseEnd`, which includes the reference app's own deferred
       subresources; the published *Initial render* column's method was never
       written down, so no comparison to it is available in either direction.
       Publishing them would be the exact error `309.3` withdrew.

       **One refactor came with it**: the po-app boot (tarball pack + install,
       stale-artifact wipe, free port, wait for the listener) moved out of
       `check-po-app.mjs` into `apps/docs/scripts/po-app-harness.mjs`, because
       a second caller was about to copy it and the boot is the part carrying
       the hoisting history. Behaviour-neutral, verified by the gate's own
       count.

       **The docs page now names the command**, in the paragraph that already
       said the harness is kept so an adopter can re-measure and did not say
       how. Its last sentence — *"the probe that produced those two numbers was
       not kept"* — is left standing: it is a true statement about 307's probe,
       and the new paragraph opens `One is kept now.`

## Slice 308 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's "the dispatch region is regrowing" is FALSE as stated — the section 274.2 cut has not regrown by ONE word, and the +877 is five new rules in five sections the cut never touched (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 307 — 296.2: the latency gate is REFUSED on the repo's own precedent, and the real defect was a published claim that cannot be reproduced by anyone else (2026-09-07)

**Dispatched by rule 4**, not on the oldest open item: `249.6` is oldest and the
cloud routine also takes oldest-first, so that is a collision. `296.2` was
chosen because **rule 5 has now read STALE for four wake-dates and is
worsening** (3 → 4 since yesterday), and `296.2` is precisely the item asking
whether a real performance instrument should exist.

**The item offered two branches — build an instrument, or refuse — and the
measurement found a third thing that is better than either.**

**What already exists, measured before deciding.** `/components/data-table`
publishes a table headed *"Performance at scale — measured, not guessed"* with
figures from **2026-08-15**: initial render 85 / 174 / 558 ms and select-all
4 / 18 / 49 ms at 1k / 5k / 20k rows. The `/stress?n=…` harness in
`examples/po-app` that produced them is still there and still works. So a
runtime performance claim was **already published and re-run by nothing** —
the same shape Slice 303 found in the layered-reset recipe.

**Re-run today against the same harness:**

```
node examples/po-app/server.mjs           # :8080
/stress?n=1000  select-all   3 ms   (published 4 ms)
/stress?n=5000  select-all   7 ms   (published 18 ms)
```

**Not slower — and that is exactly the problem.** These are different hardware,
so the comparison is not valid in either direction. A wall-clock millisecond
published without the machine that produced it is not a figure anyone can
reproduce, and the page names its date, its stack and its harness but **not its
machine**.

### The gate is refused, on this repo's own measured precedent

Not on taste. `LOOPS.md` rule 5 already records what happens when this project
gates a timing number: CI wall time was declared regressed on a single 290 s
reading against a 288 s budget, an Optimize item was raised, and the next two
runs came in at **267 s and 265 s** — *"the 290 was noise on a shared runner"*.
Three ascending samples were also read as a trend and were not. A gate
asserting *"select-all under 18 ms"* would be flaky by construction across
machines and CI runners, and would manufacture exactly the wake-spending false
positives that rule already documents. **The honest scope for "performance" in
`gauntlet/BAR.md` stays what it says: a size claim, plus this shape-not-figures
table.**

### What shipped instead: the claim now states its own limit

`/components/data-table` gains one paragraph saying these are one machine's
milliseconds, that the machine is not recorded, that the **shape** is what to
read (roughly linear to 20k, select-all cheap, the style flush the real cost),
and that re-running on other hardware in 2026-09 read 3 ms / 7 ms against the
4 ms / 18 ms below. The harness is kept precisely so an adopter can get figures
for their own hardware — which is what the page's existing re-open condition
already assumes and never quite said.

### Rule 5 has input again

Two metrics recorded — `select-all-1k-ms=3`, `select-all-5k-ms=7`. That does
not un-stale rule 5 by itself: it needs **two consecutive samples of one name**,
so the second reading is what makes these comparable, and the honest state
today is still *not evaluable*. Recorded so a later wake has a first point
rather than none. **42 distinct metric names across 130 samples, only 13
sampled twice** — the starvation is structural, and worth its own item rather
than another one-off sample.

1. [x] **296.2 — DONE, closed as a refusal with the measurement that decided
       it**, which is what its Accept asked for: *"if refused, the refusal names
       what was measured to decide it"*, and *"finding that the existing
       `check:size` plus the data-table page's own measurements already cover
       the useful range is a satisfying outcome"*. They do. The published table
       is the interaction-latency instrument this item imagined building — it
       existed already, and what it needed was not a gate but an honest
       statement of what a millisecond means without its machine.

2. [x] **307.1 — DONE 2026-09-07 (Slice 324, cloud wake). The Accept's second
       branch: rule 5 is RE-SCOPED to the metrics that actually pair, and the
       pairing unit is DISTINCT DAYS.** Retiring was left on the table and is
       not taken — the count below says why, and it is not the count this item
       predicted.

       **The pairing set, derived at execution time. The command is here so the
       next wake re-runs it rather than re-deriving it** (`python3
       scripts/loops/dispatch_status.py` now prints all of this; the raw form):

       ```
       python3 - <<'PY'
       import collections, json
       m=[json.loads(l) for l in open('.roundtable/loop-metrics.jsonl') if l.strip()]
       d=collections.defaultdict(set); c=collections.Counter(x['name'] for x in m)
       [d[x['name']].add(x['ts'][:10]) for x in m]
       print(len(m),'samples',len(d),'names',
             sum(1 for n in c if c[n]>=2),'count-paired',
             sum(1 for n in d if len(d[n])>=2),'day-paired')
       PY
       # 2026-09-07: 132 samples · 44 names · 13 count-paired · 7 day-paired
       ```

       **44 names → 7 day-paired → 3 alive → 1 actionable.** Each narrowing is
       a different mechanism, and the last two are the ones that make this
       structural rather than a matter of recording more:

       - **7 of 44 pair across days**, against 13 by raw sample count. The gap
         is six single-day bursts, `ci-wall-time`'s 26 samples among them.
       - **4 of the 7 are dead** — `components`, `ci-gates`, `behaviors_frozen`
         and `gates` were last sampled 2026-08-16 to 2026-08-19.
       - **`axe-violations` is 0 on all 8 of its days, and cannot be anything
         else.** `axe-audit.mjs` `process.exit(1)`s on any violation, so a tree
         that builds records a zero. Rule 5's *freshest* input is pinned by a
         gate and can never regress. (CLAUDE.md's identical-value doctrine,
         proven otherwise rather than filed as an instrument defect.)
       - **`claims` rises 35 → 169 and rising is the GOAL.** Nothing in a
         sample records a direction — `record_metric.py` writes name, value,
         unit — so a direction-blind rule reads that growth as a regression.
       - **`bundle-gz-kb` is the one metric rule 5 could genuinely fire on.**
         Its per-day series rose on **4 of 4** day-boundaries, 7.2 → 15.1 kB,
         and exactly one Optimize row names it — 2026-08-15, on the first of
         those four.

       **AND THE CLAIM THIS SLICE STARTED FROM ABOUT IT IS FALSE, refuted by
       the reconciliation step inside this same wake.** The narrowing above was
       drafted as `… → 1 actionable → 0 samplable`, on the strength of
       2026-09-04's `Meta · refusal` row (`e6631a88`): *"the name has no
       generator anywhere (only `record_metric.py`'s docstring example), so any
       value would be a guessed convention"*. A `grep -rn 'bundle-gz-kb'`
       reproduces that exactly — and it is the wrong question, because **the
       generator does not carry the metric's name**:

       ```
       npm run build -w @busy-office/ui && npm run check:size -w @busy-office/ui
       #   css/index.min.css   1 file(s)   15.10 /  16.7 kB gz
       grep -n gzipped README.md
       #   <!-- stat:size -->93 kB minified (15.0 kB gzipped)<!-- /stat -->
       ```

       `packages/core/scripts/stamp-readme.mjs` computes
       `gzipSync(minCss).length / 1024` and stamps it into both READMEs;
       `check-size.mjs` prints the same figure every run as the
       `css/index.min.css` bucket. The newest hand-recorded `bundle-gz-kb`
       sample is **15.1 on 2026-09-03**, against **15.10** measured here — so
       the convention was never guessed, it just had no name in common with the
       metric. A grep for a metric NAME cannot find a generator that computes
       the VALUE, and this is the second time in three wakes that a premise
       carried forward in a refusal row turned out to be re-runnable and wrong.

       **What actually blocks a series is smaller and sharper than "no
       generator": the noise floor.** `stamp-readme.mjs` carries
       `GZIP_TOLERANCE_KB = 0.3` because Node's zlib backend compresses the
       same bytes differently across builds — a real CI failure on 2026-08-16,
       identical source, Node 26 local against Node 22 CI. Three of the four
       historical rises are **inside** that floor (7.0 → 7.2, 9.93 → 10.0,
       11.6 → 11.7), and the two dispatchers run different containers. So a
       cross-environment `bundle-gz-kb` series cannot support a two-consecutive
       verdict on deltas under 0.3 kB, whoever records it. That is `324.2`.

       **What shipped** in `dispatch_status.py`:

       - The pairing test is `len(distinct dates) >= 2`, not `count >= 2`.
       - A **comparable-set block** prints every day-paired name, its day count,
         its last two per-day readings and the delta. Rule 5 has never been
         answerable from this line before — it reported how stale the input was
         and never what the input SAID, which is a second starvation mechanism
         underneath the first.
       - The block reports **movement, never a verdict**, and says so: no
         direction is recorded, and a `NEVER MOVED` marker names a constant
         without deciding whether it is health or a gate.
       - `PAIRING_SELF_TEST`, five cases; `--self-test` now reports 14 + 6 + 5.

       **Base rate measured before shipping** (94.11 — a predicate already true
       of everything cannot fail). Replayed at every revision of
       `loop-metrics.jsonl` with `loop-log.md` taken AT that commit, which is
       306.1's granularity lesson: **108 revisions → the flag differs on 9, the
       reported name on 42, the paired-name count on 94.** The flag differs in
       both directions, and that is the half that matters: on **5 of the 9** the
       old test read **`ok`** — rule 5 has live input — where the honest reading
       is STALE, its only "pairs" being single-day bursts. That is the same
       defect Slice 183 published as `ci-wall-time` "flat at 275s".

       **Red-proved by injection, with the injection confirmed to land.**
       Reverting `by_name_dates` to timestamp keys (one replacement, asserted,
       and grepped in the file afterwards) fails exactly the two self-test cases
       that separate a burst from a series and leaves the other three passing —
       a red-proof that went red too broadly would certify nothing either.

       **Today's live line is UNCHANGED — `1 wake-date(s) newer STALE`, newest
       pair `axe-violations`** — because both scopings pick the same name on this
       tree. A re-scoping that also flipped the reading it was built from would
       be the suspicious outcome. What changed on the live line is the honest
       denominator: `13 of 44 sampled twice` → **`7 of 44 paired across days`**.

       **Why not retire it.** The item pre-authorised retiring, and the count
       does not support it: the rule's input is not absent, it is one name
       (`bundle-gz-kb`) that nobody records for a reason that turned out to be
       wrong. Retiring would also delete the size-budget clause 184.2 added to
       revive the rule, which has never had a chance to fire. Two follow-ups
       are filed instead (`324.1`, `324.2`), and either one makes the rule live
       rather than carried.

       **The Accept it was measured against**, kept verbatim because the
       satisfying-outcome clause is what licensed refusing the retirement
       branch: *"either a small fixed set of names is sampled on a stated
       cadence so pairs actually accumulate, or rule 5 is re-scoped to the
       metrics that actually pair, or the rule is retired with the count that
       justified it. Retiring it is a satisfying outcome … Derive the pairing
       set from the log at execution time and record the command — do not take
       it from this item."* The first branch was refused on the record rather
       than on taste: **28.1 already adopted a stated cadence** (`ci-wall-time`
       recorded every wake) **and it held for one day** — 26 samples on
       2026-08-18 and nothing in the 20 days since.

## Slice 306 — Rule 5's staleness line cannot reach `ok` from a cloud wake while the other dispatcher is a calendar day ahead (2026-09-06, triaged from inside a Continue round)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 305 — 296.1: the Gauntlet ran its full three-round budget and the artifact FAILED — the loop worked, the framework was never the gap (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 304 — Objective grill of Slices 300, 301, 303: 24 of 26 reproduce, and both failures are one defect — four figures quoted from a working tree that no commit ever held (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 303 — The framework's central promise was documented, demoed, and ungated: the layered-reset recipe is now executable (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 302 — Step 1 mandates two intakes and a cloud wake could execute neither command; the Discussions half had no substitute at all, so the rule was unrunnable rather than merely awkward (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 301 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 carried the eleventh archive sweep — 37.1% closed history down to 7.2%, the largest single move on record (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 300 — P0: the first two issues ever filed against this package, and the shipped CLI crashes on its own documented usage (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 299 — The SAME Objective grill, run twice by two dispatchers: this one lost the race and re-dispatched, and the re-dispatch is what caught the two things the winner did not — a metadata baseline that matches no revision of its gate, and the count Slice 298 diagnosed and left uncorrected (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 298 — Objective grill of Slices 292, 293, 295: 44 of 47 assertions reproduce, and the two real defects are a durable file that reads as universal and a claim I made about my own work (2026-09-06)

Dispatched by rule 3, OVERDUE at `3 / 3` `[292, 293, 295]`. Scope per §6 step 0:
the heading grep over `ROADMAP.md` + `ROADMAP-archive.md` returns **0** prior
grills naming any of the three, so nothing was dropped and nothing re-grilled.

**Slice 295 is this session's own work, and it was grilled first** — a
self-grill is the one most likely to go soft, so it went before the others
rather than after.

### 295 — every NUMBER reproduces; the PROSE beside them was false

| claim | re-run | verdict |
|---|---|---|
| `og:image` on every built docs page | `grep -rl` over `dist` | **127 of 127** ✓ (138 raw `index.html` less the 11 redirect stubs + `suite/` the gate excludes by design) |
| gate assertion count 1,150 | `check-metadata.mjs` | ✓ exact |
| asset 97,379 bytes | `stat` | ✓ exact |
| *"nothing in the card's own CSS invents a colour, radius or border"* | comment-stripped hex scan | **FALSE** |

`.dot` carried a raw `#fff`. The script's own header claimed more still —
*"every colour, radius, **font-size** and border comes from a `--bo-*`
token"* — and seven display font sizes are literals.

**Amended 2026-09-07 by Slice 316 — "seven display font sizes" carries no
command and is unreproducible under the plain reading; the VERDICT is
unchanged.** The file has never held seven `font-size` literals. Measured at
both of its two commits and identical at `HEAD`:

```
git show <rev>:apps/docs/scripts/gen-og-card.mjs \
  | grep -cE 'font-size:\s*[0-9.]+(rem|px|em)'      # 4  at 605829ca AND 66cd85da
git show <rev>:apps/docs/scripts/gen-og-card.mjs \
  | grep -oE ':\s*[0-9.]+rem\b' | wc -l             # 8  raw rem literals
  # ... | sort -u | wc -l                           # 7  DISTINCT rem values
```

Four `font-size` declarations (`1.6rem` `.dot`, `2.9rem` `h1`, `1.5rem`
`p.lede`, `1.05rem` `.screen`) and **zero** `font-size: var(…)`. The seven is
recoverable only as *distinct rem-valued literals*, which counts `.dot`'s box
size, `.right`'s `padding-block-start` and the cell padding — none of them a
font size. Same shape as 315.2 one slice earlier, and the same cost CLAUDE.md's
*write the command next to the claim* predicts: the number could only be
re-derived, and re-deriving is where the second, different mistake comes from.
The sentence's point — the header claimed tokens for something that is a
literal — stands at 4 exactly as it did at 7.

**This is CLAUDE.md's rule landing on the wake that quoted it.** 192.1 says the
defect lands in what shipped BESIDE the number, not in the number: 295 spent
its red-proofs on the gate arms, and the unverified sentence next to them is
the one that was wrong.

Fixed rather than filed, both halves being small:

- `#fff` → `--bo-color-text-inverse`, the token `.bo-btn` already uses for a
  label on an accent fill. The regenerated card is **byte-identical at 97,379
  bytes**, which is the proof the change is a correctness fix and not a visual
  one.
- The header now says what is true: **tokens for colour, radius, shadow and
  border; literals for the display sizes and the 1200×630 crop**, with the
  reason — 1200×630 is the platform's, and the framework's type scale stops
  far below a 2.9rem wordmark because nothing in an ERP screen is set that
  large. A card is a poster, not a component; inventing token tiers to serve
  one poster is the ceremony 94.11 refuses.
- 295's own sentence is struck in place with the correction, per 236.2.

**And the verification tripped on its own explanation**, which is worth one
line because this repo names the trap: after the fix, `grep -c '#fff'` still
reads **1** — the hit is the new comment *explaining* that `#fff` was removed.
Comment-stripped, the code reads **zero**. Assert on the parsed form, never the
raw text (Slice 49/50/53.1's rule).

### 292 — 13 of 14, the fourteenth moved as expected

Every load-bearing figure re-runs exactly: the `bo-icon--building` line, the 5
renders outside the showcase, `_shell.mjs`'s two modules, the 4-glyph
deprecated set, balanced openers in both `.astro` sources, and the built-page
DOM readings (13/13 `section.demo` ↔ `h2`, all at 18px, 0 orphan `h2` across 91
pages). The open-set figure of 12 now reads **20** — Slices 294, 296 and 297
added items since. Moved, expected, not a defect.

### 293 — 18 of 20, and the miss is in the file Step 0 reads every wake

Four sweep lanes reproduce byte-exact (1,433 declarations; `8 · 74 · 242 · 230`;
118 pages / median 792 / 111,622 words; the union of 15 flagged pages and the
14-plus-`/concepts/scale/` attribution), as do all six dispatch-region rows and
both ratchet readings.

**`ENVIRONMENT.md` §1c is wrong outside the container, and reads as
universal.** It states that `scan:dead-style` "died on" a missing
`CHROME_PATH`. Re-run here:

```
env -u CHROME_PATH npm run scan:dead-style -w docs   # exit 0, 1,433 declarations
```

`resolve-chrome.mjs` tries `$CHROME_PATH` first and then a candidate list
ending in `/Applications/Google Chrome.app/…`, so **on a Mac with Chrome
installed no gate needs the variable at all.** 293.1's measurement was taken
in the Linux container and is correct there; the section never says so.

**Why this is more than pedantry, and why it was fixed in place rather than
filed:** a local wake reading §1c, finding every gate green without the
export, could reasonably conclude the section is stale and stop exporting it —
and then lose a cloud wake to the trap §1c correctly describes. That is the
same shape as the `--short` trap two sections above it, which this file already
records as having cost a wake. §1c now names its environment in the heading and
in the evidence.

**293.1's conclusion is unchanged** — `check-boost.mjs` was genuinely deleted
by `f1be2485`, `docs:build` genuinely does not need the variable, and the
12 npm entry points and 0 transitive consumers all re-run exactly. It is the
wording that was wrong, not the finding.

**One figure moved and the mechanism worked**: 293.1's grep printed 14 files,
now **15** — Slice 295's `gen-og-card.mjs` imports the harness and is not an
npm script. §1c's own rule is that the count is the reconciliation, and it
reconciled.

### Refused

- **A gate over "a durable file names the environment its measurement was
  taken in".** The predicate is semantic — no regex separates a universal
  claim from a container-scoped one — and the base rate is 1 of the sections
  in that file. 94.11's wall, and the shape this loop has refused six times.
- **Re-filing 295's font-size literals as a defect.** They were never a defect;
  only the sentence claiming otherwise was.

1. [x] **298.1 — DONE 2026-09-07 (Slice 316). Closed by the FIRST branch, not
       the expected one: the second artifact already existed and predates the
       first by 25 days.** Original text kept below.

       **The premise is what failed.** "There is now exactly one precedent to
       point at" is false. Enumerated rather than recalled — every tracked
       image asset plus every script that renders one:

       ```
       git ls-files | grep -iE '\.(png|jpg|jpeg|gif|webp|svg|avif)$'
       #  -> favicon.svg (+3 archived copies under versions/), og-card.png,
       #     packages/core/media/list-report-compact.png
       git ls-files '*.mjs' | xargs grep -ln 'screenshot('
       #  -> apps/docs/scripts/gen-og-card.mjs   ← the ONLY renderer
       ```

       Of those, `favicon.svg` declares **0** `font-size` (274 bytes, a
       24-unit viewBox mark) and `list-report-compact.png` photographs a real
       docs page, so its type comes from the component scale — neither
       authors display sizes. On images alone the count really is **1**.

       **The second artifact is not an image.** `packages/core/src/css/print/
       index.css` has been in the tree since the initial commit (`4ef554fa`,
       2026-08-12) against `gen-og-card.mjs`'s `605829ca` (2026-09-06) — 25
       days earlier — and it is the same shape: dimensions from the medium
       (`@page { margin: 1.6cm }`), display type as a literal outside the rem
       screen scale (`font-size: 10pt`), colour authored for the medium. That
       print counts as "a fixed-size artifact" is a judgement and is stated as
       one; what makes it the right judgement is that DESIGN.md's unit
       doctrine **already** had half this rule written down as rule 6
       (`pt` only inside `@media print`) before either artifact existed.

       **The two agree, and the half nobody had written down is the
       load-bearing one.** The card takes colour from tokens; the print sheet
       uses **zero** tokens and a literal `#555`. That reads like a
       disagreement and is the same rule applied to two media — measured under
       print emulation on the built site, with the light/dark control the
       probe must pass to be reading the theme at all:

       ```
       matchMedia('print').matches           true      (body font-size 13.3333px = 10pt)
       --bo-color-text-muted   light theme   rgb(75,85,99)     7.56:1 on white
       --bo-color-text-muted   DARK theme    rgb(156,163,175)  2.54:1 on white   ← below AA
       shipped literal #555    both themes   rgb(85,85,85)     7.46:1 on white
       control: light and dark token readings differ            true
       ```

       So a token there is not tidier, it is a contrast regression for anyone
       printing from the dark theme. **The convention holds at 11 of 11**:
       every colour declaration inside `@media print` in the shipped CSS is a
       literal, 0 tokens, across 6 files (`approval-workflow`, `badge`,
       `data-table`, `stepper`, `print/index.css`, `reset/index.css`).

       **What shipped, kept deliberately small** — the item's own warning is
       that it exists so the question is asked once, not so a convention is
       manufactured, and the convention was already half-recorded:
       - DESIGN.md unit doctrine gains **rule 7**, written from both
         precedents, carrying the measurement above.
       - The `#555` site gains the reason it never had — the one literal whose
         value is load-bearing was the one with no explanation, so a future
         tidy-up would have shipped the regression silently.
       - The gate question is **filed, not built** (`316.1`), with its base
         rate measured first.

       No new token tier, no gate, no rubric. **`gen-og-card.mjs` itself is
       unchanged** — nothing about it was wrong.

       **298.1 — `gen-og-card.mjs`'s display sizes are literals with a stated
       reason, and nothing checks that the reason stays true.** Not filed as a
       defect — a poster legitimately sits outside the component type scale.
       Filed because the *next* fixed-size artifact will face the same question
       and there is now exactly one precedent to point at.
       - **Accept:** either a second such artifact appears and the two agree a
         convention, or this closes as "one instance is not a pattern" with the
         count that decided it. **Closing it as not-a-pattern is a satisfying
         outcome**; the item exists so the question is asked once, not so a
         convention is manufactured.

## Slice 297 — Owner call: feedback intake stays on GitHub, and Discussions are enabled because issues were the only door (2026-09-06)

**Input**: the owner asked whether feedback should come through GitHub or
Linear, and answered it — **GitHub, not Linear**.

**The decision rests on who the feedback comes from.** `@busy-office/ui@0.8.0`
went to npm hours ago; the feedback worth having is from **strangers who found
the package**. A stranger can file a GitHub issue. A stranger cannot file into
a private Linear workspace, and asking one to join it is a wall in front of the
exact signal the intake exists to collect.

**Linear would also be a second truth, which this repo's storage doctrine
already refuses.** `CLAUDE.md`: narrative and contract live in markdown, in
git, reviewed and diffed — `ROADMAP.md` *is* the backlog. A tracker beside it
is the `registry.ts` shape refused in Slice 294, one decision stored twice and
drifting. **Refused, recorded so it is not re-proposed.**

**What was already built, and is not being rebuilt**: issues are public,
~~three templates enforce~~ **two forms** enforce version/browser/theme/density
plus a minimal repro on bugs and a real ERP scenario on features, and
`LOOPS.md` Step 1 already made `gh issue list` a dispatcher step read every
wake.

> **Corrected 2026-09-08 by the Objective grill in Slice 337.** There are and
> have only ever been **two** templates — `git log --all --name-only` over
> `.github/ISSUE_TEMPLATE/*` returns exactly `bug_report.yml`,
> `feature_request.yml`, `config.yml`. The third file is not a template and
> does not enforce anything: `config.yml` is the ROUTER, and its first line is
> `blank_issues_enabled: true`. **This slice counted the escape hatch as an
> enforcer** — and the archive entry it was compressing had said
> *"blank issues on"* in as many words. Slice 335 spent an API round-trip and
> a label analysis rediscovering that both real issues bypassed the forms; the
> fact that they COULD was already written down, correctly, and was lost in a
> one-word compression.

**The gap was that issues were the ONLY door.** Measured before acting:
`hasDiscussionsEnabled: false`, `stargazerCount: 0`. An issue template
demanding five fields and a repro is correct for a defect and is a wall in
front of *"how do I do X?"* and *"would you consider Y?"* — questions that
bounce off it are not filed anywhere, they are lost, and they are the earliest
signal an adopter produces.

**Done in this slice, not proposed:**

- **Discussions enabled** (`gh api -X PATCH … has_discussions=true`, verified
  `hasDiscussionsEnabled: true`), with the six default categories.
- **`LOOPS.md` Step 1 now reads BOTH intakes every wake**, with the working
  GraphQL command written beside the `gh issue list` one rather than described
  — it was run against the live repo and returns cleanly (0 open today).
- **The split is stated where it is decided**: issues are for defects,
  Discussions for everything not yet one. A Q&A that turns out to describe a
  defect is triaged as one — open the issue, link it, answer the discussion
  with the link.
- **Triage discipline for discussions, because the failure mode is the
  opposite of an issue's**: a discussion is triaged into `ROADMAP.md` only if
  it names something actionable. Answering a question is not a roadmap item,
  and recording one as such inflates the backlog with work nobody asked for.
  An unanswered Q&A older than a wake is worth answering *in the discussion*
  even when nothing is filed — reported in the wake rather than left silent.
- **`.github/ISSUE_TEMPLATE/config.yml` routes at the point of filing** — three
  contact links (Q&A, Ideas, Show and tell) beside the existing Documentation
  one, each saying *why* it is the faster door. **All four URLs verified 200**
  rather than assumed; a contact link to a category that does not exist is a
  dead end that looks like help.

1. [x] **297.1 — DONE, Slice 335.** The first real intake run is the test of this, not the
       config.** Nothing has been filed yet (0 issues, 0 discussions), so every
       claim above is about a door nobody has walked through. The next wake
       that finds either intake non-empty should record what the split did:
       whether the thing landed in the right channel, and whether the template
       or the contact link is what routed it.
       - **Accept** — the property, not a predicted outcome: one wake reports
         on a real filed item, naming which intake it arrived in and whether
         that was the right one. **Finding that the router sent it to the wrong
         place is a satisfying outcome** — that is the measurement this item
         exists to take, and it is more useful than a confirmation.

## Slice 296 — Owner direction: a Gauntlet loop aimed at next-generation ERP UI, and 21st.dev read as a reference rather than a template (2026-09-06)

**Input**: the owner asked for (a) a **gauntlet loop** whose goal is "the new
generation ERP UI — performance, UX best for the user, scalable, secure,
modern", (b) `https://21st.dev/` explored, and (c) the roadmap updated so the
**scheduled** loop can run it.

**(c) needed no scheduling change, and that is worth recording rather than
silently relying on.** The wake prompt the owner pastes — and the cloud
routine runs — deliberately restates no dispatch order: it says *"act as the
Roadmap dispatcher exactly as `LOOPS.md` specifies… evaluate the dispatcher
rules in the order that file states them"*. That was a deliberate fix
(roadmap 102.4) after an earlier prompt drifted for weeks. So **adding the
loop to `LOOPS.md` is what schedules it**; no cron, routine or prompt was
touched.

**The loop is installed with NO counter and NO rule of its own.** It is
dispatched by rule 4 like any build item, when the oldest open item names a
gauntlet artifact. This file records **five** separate occasions where a
counter sat beneath an always-true condition and starved silently — Objective
alone lost ten slices — and a ninth dispatcher rule would be the sixth
instance. `LOOPS.md` §7 carries the playbook and states the overlap with
Polish, Objective and Continue explicitly, so a later wake can see why this is
not a duplicate of the blind re-score it resembles.

**The bar was adapted, not adopted.** The contribution's `BAR.md` graded
`ui_kits/` and `explorations/` against an `assets/` screenshot — none of which
exist in this tree. `.roundtable/gauntlet/BAR.md` now names references that
are actually here (`packages/core/media/list-report-compact.png`,
`check-po-app.mjs`'s route contracts, the reverted tree) and hoists the six
requirements every class shares out of the per-class lists.

**Two of the owner's five properties are NOT gradeable today, and the bar says
so instead of inviting a critic to judge them by feel.** This is the repo's own
base-rate rule applied to a rubric: a criterion nothing can measure is one the
builder argues past.

| property | instrument today | verdict |
|---|---|---|
| Performance | `check:size` gzip budgets over all shipped artifacts | **partial** — size only; no interaction-latency or render instrument, so an artifact may not claim runtime performance |
| UX / user-centric | Class B's five-minute blind task test | **gradeable** |
| Scalable | `/components/data-table`'s measured wide-table and 50-column demos | **partial** — a claim beyond what those measure needs a new instrument |
| Secure | **none** | **not gradeable, and the framework is the wrong layer** — it ships CSS and optional behaviours, holds no credentials, makes no requests, owns no data layer. The honest scope is a pattern page documenting the server contract it assumes, which is documentation |
| Modern | Class C: a guarded platform feature with the floor unmoved | **gradeable** |

**(b) 21st.dev, read against `references-are-floors`.** A community registry of
12,000+ React components distributed three ways — an **AI-ready prompt** pasted
into Claude Code or Cursor, the `shadcn` CLI, or copy-paste — on a
React + Tailwind + shadcn stack, with "you own the code, there is no version of
us to upgrade" as its stated philosophy.

**The stack is the one this framework refuses**, so nothing about React,
Tailwind or shadcn primitives transfers, and the contribution's own guide
already says its React wrappers exist for a design tool and not for the
product. What is genuinely interesting is narrower and is **already half-built
here**:

- **The ownership philosophy is this framework's existing position**, not a new
  idea to import: `dist/` copies into any asset pipeline, the cascade is the
  API, and there is no runtime to upgrade.
- **The AI-prompt distribution shape is the transferable part**, and the
  owner-supplied `registry.json` + `install-prompts.md` (Slice 294, item 2 of
  its order) are exactly that, rebuilt HTML-first. That is where this belongs —
  filed there, not duplicated here.

**Refused, so it is not re-proposed:** publishing to the shadcn registry
format as a distribution channel. `registry.json` in the contribution already
carries `$schema: ui.shadcn.com/schema/registry.json`, and shipping into an
ecosystem whose consumers expect React components would advertise this
framework as something it is not. The prompt half is the half that works
without the stack.

1. [x] **296.1 — DONE (refused at budget), Slice 305.** Run the first gauntlet round, Class A, on the reference this
       repo actually has.** Artifact: a rebuild of `/patterns/list-report` at
       `data-density="compact"`; reference:
       `packages/core/media/list-report-compact.png`. This is the smallest real
       exercise of the loop and it tests the loop itself as much as the
       artifact — a blind critic that cannot fail the builder is the failure
       mode to watch for.
       - **Accept** — the property, not a predicted verdict: a round is
         recorded in `.roundtable/gauntlet/ROUNDS.md` naming a critic that ran
         in a **fresh context** and did not see the build; the verdict is
         whatever it is, and a FAIL that stops at round three with the gap
         reported is a satisfying outcome. What would NOT satisfy this is a
         PASS graded by the builder, or a bar edited mid-round to make the
         artifact pass.

2. [x] **296.2 — DONE (refused, with the measurement), Slice 307.** An interaction-latency instrument, or a recorded refusal.
       The bar cannot grade "performant" beyond bundle size today. Either an
       instrument lands that measures something real in a browser — first
       input delay on a dense grid, time to interactive on the heaviest
       pattern page — or this closes as a refusal stating that size is the
       honest scope and why.
       - **Accept:** if built, it reports a number from a real browser run and
         is red-proved by making the measured thing worse; if refused, the
         refusal names what was measured to decide it. Finding that the
         existing `check:size` plus the data-table page's own measurements
         already cover the useful range is a satisfying outcome.

3. [ ] **296.3 — OWNER CALL: is "secure" in scope for this framework at all?**
       The bar currently says no, with a reason: the framework ships CSS and
       optional behaviours and owns no data layer, so a security claim would be
       about the *consumer's* server. The alternative reading is that pattern
       pages should carry a threat-model section the way they carry a data
       contract. **Not built either way without a decision** — it changes what
       every pattern page owes.

## Slice 295 — 249.15 built: the social card, generated from the framework's own stylesheet rather than drawn — and the gate arm it replaces had become undeleteable-by-design (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 294 — Triaged from an owner-supplied upstream contribution: six proposals arriving pre-sequenced, and the floor risk it names is real but already paid for (2026-09-06)

**Input**: the owner supplied `busyofficeui_Design_System.zip` — an
`upstream-contribution/` folder laid out in this repo's own paths, carrying its
own `CLAUDE.md` with a six-step integration order (brand mark → registry +
install prompts → gauntlet docs → static reference consumer → modern CSS layer
→ proposals), one branch per step. Nothing is merged by this triage; the
contribution is verified and ranked, not adopted, per `references-are-floors`.

**The guide verifies clean, and that is worth stating before any finding.**
Every claim a verdict would rest on was re-run against the live tree rather
than read:

| claim | result |
|---|---|
| "44 component sheets" | **44** — exact (`find packages/core/src/css/components -name '*.css'`) |
| "26 vanilla-TS behaviours" | **26** — exact |
| the 11 files its modern-CSS step names as edit targets | **11 of 11 exist** at the stated paths |
| the repo's own stylelint over all 6 proposed sheets | **passes, exit 0** |

It also resolves one of its own open conditionals: it says to replace the
static example's `behaviors.js` with the built package *if `examples/` has a
build step*. `examples/po-app/package.json` carries only a `start` script, so
the answer is the other branch — keep the transcription and say so in its
README.

**The floor question, which is the one thing worth carrying into a decision.**
`color-oklch.css` uses `light-dark()`, and this repo's own BCD data puts it at
**Chrome 123 / Safari 17.5 / Firefox 120** against a published floor of
**Chrome/Edge 119**. That looks like a silent floor raise, and it is not:
every `light-dark()` declaration sits inside
`@supports (color: light-dark(white, black))`, so a browser below 123 skips
the block and keeps the existing tokens. That is the **`degrades` tier**, the
same treatment `:has()` and `scrollbar-width` already get, and a guarded
feature does not move the published floor by `derive-floor.mjs`'s own design.
**Reach is unchanged at 80.09%**; had it landed unguarded the cost would have
been **1.30 points** (80.09% → 78.79%).

**Two of this triage's own findings were retracted before being filed**, and
both are recorded because retracting them is the cheap half:

- *"raw hex outside `@media print`"* — three `#ffffff` inside `light-dark()`.
  Base rate first: the repo's own `tokens/` and `components/` carry **142**
  hex literals, and a token file is where hex belongs. Not a violation.

  **Amended 2026-09-07 by 315.2 — this read `139` with no command beside it,
  and 139 is unreproducible.** Re-measured at this slice's own commit
  (`c6643153`), and identical at `HEAD`:

  ```
  grep -rhoE '#[0-9a-fA-F]{3,8}\b' packages/core/src/css/tokens \
      packages/core/src/css/components | wc -l          # 142
  ```

  Five other plausible spellings return 142 (no word boundary), 123 (6-digit
  only), 141 (3- or 6-digit), 114 (distinct values) and 134
  (comment-stripped). **None returns 139**, and the tree has not moved between
  the two readings, so it is not snapshot drift. The **verdict is unchanged**:
  at 139 or 142 a token file is still where hex belongs. What was missing is
  CLAUDE.md's *write the command next to the claim*, and the cost is exactly
  what that rule predicts — the next wake could only re-derive it.
- *"an `!important`"* — the single hit is inside a comment stating the layer
  needs none. An assertion tripped by its own explanation, which is the exact
  shape this file's removal rule already names.

**And the reach instrument's first output was wrong, in the way the repo had
already written down.** A plain `browserslist.coverage()` over
`chrome/edge/firefox/safari` returned **27.22%** against a published 80.09% —
a 53-point gap. `derive-floor.mjs`'s own comment names this: browserslist's
`chrome` and `safari` are **desktop-only**, and the query needs the mobile ids
(`and_chr`, `ios_saf`, `and_ff`, `samsung`, `op_mob`). Re-run with the
script's own `reachQuery`, it reproduces **80.09%** exactly. The discrepancy
was the tell, and it is why the 1.30 figure above is trustworthy.

1. [x] **294.1 — DONE 2026-09-07 (Slice 311). Three probes added; the headline
       floor did not move, which its own Accept names as a satisfying outcome.
       The item's premise about `@supports` guarding is where the work went —
       see Slice 311.** Original text kept below.

       **294.1 — `derive-floor.mjs` has no probe for `light-dark()`,
       `oklch()` or `scroll-state()`.** Not a defect today — nothing shipped
       uses them — and **not** a blocker for the contribution, since all three
       arrive `@supports`-guarded. It is a gap that only bites if a later edit
       lands one of them *unguarded*, which is precisely the case the script
       exists to catch ("we published a floor the framework did not meet").
       Cheap: the script's own header says adding a probe is one line.
       - **Accept:** the property, not a prediction — after the change,
         `floor.json` reports a value for each of the three that agrees with
         re-reading BCD at that path, and the published headline floor agrees
         with what `check:floor` reports. Whether any of them *moves* the
         headline is the measurement's to decide, not this item's: they are
         guarded today, so finding the floor unchanged is a satisfying
         outcome and closes this.

2. [x] **294.2 — DONE, Slice 331.** Rank the six proposals against the Objective; adopt none on
       arrival.** The guide's own ordering is sound engineering (independently
       revertable, taste-call first, blocked PR named as blocked) and is not
       in dispute. What has not happened is the Objective test — simplicity /
       less-for-more / reusability, with refusal a valid outcome — applied per
       proposal. Two are flagged by the contribution itself as *not* upstream
       candidates (`surface.css`, which changes shipped visuals for every
       consumer; and `proposals/`, which is explicitly not product), so the
       live question is the other four.
       - **Accept:** each of the six carries a recorded verdict — adopt /
         adopt-with-changes / refuse — with the reason, and a refusal is as
         complete an outcome as an adoption. **OWNER CALL on the brand mark**,
         which the contribution correctly identifies as the one decision in
         the folder with no traceable source.
       - **Blocked kind, recorded 2026-09-07 (Slice 316) so it stops being
         re-derived: INPUT-BLOCKED, not cloud-takeable.** Eleven hand-offs
         listed this as the oldest cloud-takeable item, classified from Slice
         294's triage text rather than from the material. The six proposals
         live in an owner-supplied `busyofficeui_Design_System.zip`; the
         `upstream-contribution/` folder is **correctly absent** from this repo
         (`git ls-files | grep -i contribution` → nothing, and Slice 298's
         grill records the absence as correct — nothing was merged). Ranking
         six proposals no wake in this repo can read would be inventing
         verdicts, so this needs the owner to land the folder on a branch
         first. Same fourth kind as `297.1`, which `LOOPS.md` 186.2's three
         kinds do not cover.

## Slice 293 — Standardize sweep, 4 of 4 lanes: all four instrumented lanes clean for the fourth consecutive sweep, and the finding came from lane 1 FAILING — `ENVIRONMENT.md` §1c named a script deleted a week ago and missed the gate that actually needed the export (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 292 — Polish round 3 on `component/icon`: the page's Markup heading had been outside every `<section>` for 18 days, and the blind re-score then found the deprecation note resting on a **census** — "no pattern screen renders this glyph" — that a pattern screen falsifies (2026-09-06)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` arrived as
a **forced update** (`26447ba...911233e`). Trap 2 clean in one `--unshallow`
(**1,934** commits, no `shallow.lock`) and it again brought the tags —
`git tag | wc -l` → **7**, the **thirteenth** consecutive container to do so.

Rule 1: no open P0 — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, and `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**.
Step 1 triaged and committed nothing: no new input. Rule 2 `1 / 4 … ok`, rule 3
`0 / 3 … ok`. **Rule 4 was reached and found nothing it can take** — the open
set is 12 and the cloud lane is dry for the third consecutive wake; each item
re-classified from its own text per `LOOPS.md` 186.2, not carried over from the
hand-off: **owner-blocked (9)** Slice 15, `112.3`, `112.4`, `249.7`, `249.10`,
`249.11`, `249.12`, `249.13`, `273.2`; **browser-blocked in the SCREENSHOT
sense (3)** `249.6`, `249.9`, `249.15` — `249.15`'s own text says outright that
a cloud wake should not pick it up. Rule 5 read **STALE** (`3 wake-date(s)
newer`), so per its own text it **could not be evaluated** and is not reported
clear. **Rule 6 dispatched Polish.**

**The pick was measured, and the tie is now total.** §3b step 0's
`polish_requeue.py --apply` re-queued **10** surfaces and wrote nothing (`ledger
UNCHANGED`); `--audit-stamps` reads **0 of 21 stamps naming a source state no
revision carries**, so 283.3's repair is still holding. All ten sit at
`content: 3`, `2/3 rounds`, `dry 0` — so neither the score (171.1: no DSA
dimension can rank) nor §3b's "fewest rounds" tie-break discriminates at all,
for the seventh time. Broken on 216.1's discriminator, but measured **since each
surface's own last round** rather than since `scored`, because a round's own
repair commits inflate the older reading:

```
# per surface: B=$(git rev-list -1 --before="<its round-2 date>T23:59:59+08:00" HEAD)
#              git log --oneline $B..HEAD -- <its path set>
icon 4 commits +72/-4   alerts 3 +7/-1   dashboard 3 +7/-1   stepper 3 +7/-1
tree-table 3 +6/-1   badge 2 +4/-1   calendar 2 +4/-1   sidebar-nav 2 +5/-1
state-patterns 2 +9/-1   byline 0 +0/-0
```

`icon` leads by an order of magnitude on lines, and what moved is substantive
rather than whitespace: `96bd852a` (227.3's divisor guard), `5754ea02` (229's
deprecation-set mirror), `01fd7fc5` (249.2), `4dbec5bd` (249.8).

1. [x] **292.1 — the deprecation note rested on a CENSUS, and the census is
       false.** Found by §3b step 4's blind re-score and then re-derived here
       from the repo rather than taken on the scorer's word. Five live sites
       published *"No pattern screen in these docs renders this glyph — only
       this component's own showcase page does"*: the four `DEPRECATED` blocks
       in `packages/core/src/css/components/icon/icon.css` (shipped to
       consumers) and the caption on `/components/icon`, with the page's own
       frontmatter comment carrying a fifth copy of the same claim.

       Both of its clauses fail, and the commands are here so the next wake
       re-runs them rather than re-deriving them:

       ```
       grep -rn 'bo-icon--building' apps/docs/src/pages/patterns/
       #  -> patterns/app-frame.astro:114   ← a PATTERN screen. Clause 1 false.
       grep -rn 'bo-icon--\(settings\|barcode\|building\|user\)' apps/docs/src \
         --include='*.astro' | grep -v 'pages/components/icon.astro'
       #  -> app-frame (building), offcanvas, sidebar-nav, motion x2 (settings)
       #     ← five renders outside the showcase. Clause 2 false.
       grep -n 'icon:' examples/erp-suite/_shell.mjs
       #  -> MODULES gives crm `user` and prod `settings`; _shell.mjs:79 composes
       #     `bo-icon bo-icon--${name}`, so two of the reference suite's six
       #     modules wear a deprecated glyph as their identity.
       ```

       **The class of error is not "a stale count" but "a count that could
       never stay true"**, which is why the fix removes it rather than
       refreshing it (217.2 and 220.1's precedent, now with a third
       confirmation and a stronger reason): deprecating a glyph does not stop
       anything already rendering it, so renders can only ever go **up** after
       the note is written. The four blocks now carry only the mechanism
       argument they already had — the glyph was one example value of
       `--bo-icon-src` — which needs no census. The correction itself is
       recorded **once**, in `icon.css`'s header beside its existing
       `NO FIGURES HERE` rule (the same lesson, one level out), rather than
       four times: `LOOPS.md` lane 4 exists to notice prose growing by copy.

       **A trap this repo has hit before was hit again and caught by the
       build.** `icon.astro`'s `deprecationMarkers` guard equates a raw count
       of the string `DEPRECATED` in `icon.css` with the number of parsed
       deprecated glyphs, and the first draft of the header note used that
       word in prose — 5 markers against 4 glyphs. Its own comment predicts
       exactly this and calls the loud failure the acceptable direction of the
       trade; it was reworded to *"deprecation blocks"*, and
       `grep -o 'DEPRECATED' … | wc -l` reads **4** again. The one surviving
       source copy of the removed sentence is this correction quoting it, which
       is CLAUDE.md's assertion-tripped-by-its-own-explanation shape landing
       where it is harmless.
       - **Accept:** no live source copy of the census remains outside a
         quotation of it (`grep -rn 'No pattern screen\|zero pattern screens'
         apps/docs/src packages/core/src` returns only the explanatory comment);
         the deprecated set still derives to the same four glyphs; `docs:build`
         green **(done — all three)**.

2. [x] **292.2 — `/components/icon` rendered its Markup heading outside every
       `<section>`, and had since 2026-08-19.** The round's own finding, before
       the re-score. `icon.astro`'s Markup block lost its
       `<section class="demo">` opener in `efd4fd02` (Slice 53.2) when the
       Deprecated section was inserted, leaving the file with 7 openers and 8
       closers; the HTML parser drops the unmatched closer, so nothing errored.

       **Measured in the built DOM, not read off the diff.** Before the fix,
       `/components/icon/` rendered **13 `<h2>` against 12 `section.demo`**,
       with the Markup heading's parent chain reading
       `h2 < div.bo-stack.docs-content` where every comparator reads
       `h2 < section.demo`. The visible consequence is `Gallery.astro:737`'s
       `.demo h2 { font-size: var(--bo-font-size-lg) }` not applying: the
       heading rendered at **21px** among twelve siblings at **18px**, and
       every other page's Markup heading is 18px. After the fix it is 18px.

       Swept the whole built corpus with the DOM predicate rather than the
       source one — **1 of 80** built component and pattern pages carried an
       `h2` outside every `<section>` (4 redirect stubs skipped), and it was
       this one; **0 of 80** after. **Red-proved by injection with the
       injection asserted to land**: deleting one `<section class="demo">`
       opener from `calendar`'s *built* HTML moves the detector `0 → 1`, and
       the probe throws if the replace matches nothing. It still discriminates
       on the fixed tree, so the clean sweep is a measurement rather than a
       detector that has stopped being able to fail.

       **A second, DOM-neutral instance was fixed in the same pass and is
       stated separately because its evidence is different.**
       `sidebar-nav.astro` carried a duplicated `</section>` (4 openers, 5
       closers). Nothing rendered differently — asserted, not assumed: its
       built page is **byte-for-byte identical** before and after
       (`diff -q` on `dist/components/sidebar-nav/index.html`). Both pages'
       source is now balanced, and the sweep over all 41 component pages finds
       no third case by either instrument (`<section class="demo"` and any
       `<section`, which agree).
       - **Accept:** the built `/components/icon/` has as many `section.demo`
         as `.docs-content h2`, its Markup heading resolves `closest('section')`
         and computes the same `font-size` as its siblings; the corpus sweep
         reads 0; the detector is red-proved by an injection confirmed to land
         **(done — all four)**.

**§3b step 4 — the blind re-score RAN, and this is the trigger clause working
as 288.1 intended.** The round edited the surface a score is taken on, so the
re-score was owed rather than optional; a second agent scored `typography` and
`content` from the shipped CSS and the page source, told that the built page
publishes a prior verdict and that it is not evidence.

- It reports it **never saw the prior value**, and says why it could not: it
  was pointed at `apps/docs/src/data/dsa-rubric.json`, **which does not
  exist** — the rubric lives under a `rubric` key inside `dsa-scores.json`,
  the file the instruction forbids — and it read that file with `components`
  deleted so no entry rendered. That is a defect in **this wake's own
  instruction**, worth recording because §3b's blindness protocol names four
  paths to avoid and the rubric's real location is inside one of them.
- **`content` 3, agreeing with the published 3**, verified by running
  `hasWrongChoiceClause` from `wrong-choice-rule.mjs` against the page and
  again with the clause stripped — `true` then `false`, so the pass is not a
  detector that cannot fail.
- **`typography` 2, contradicting the published 3** — and the disagreement is
  about SCOPE, not about a fact. On a CSS-only reading it scores 3 and says
  so outright. The 2 is for `icon.astro` hard-coding `font-size: 1.5rem` four
  times while using `var(--bo-font-size-xs)` two lines away, `1.5rem` being
  `--bo-font-size-xl` in `tokens/typography.css`. Base rate it measured
  itself: **1 of 41** component pages carries a raw `font-size` literal, and
  it is this one.

**The score is NOT moved, and the reason is a rule rather than a preference.**
The rubric scores the component; `typography`'s own cite is about
`icon.css`'s `1em` box, and this round changed no CSS declaration. Rewriting a
published score on a dimension the round did not touch, from a reading the
scorer itself flags as out of scope, would be the ledger recording an opinion
as a measurement. `scored` stays **2026-08-23**. The page-scoped reading is
filed as 292.3 instead, where it can be decided rather than assumed.

3. [x] **292.3 — is the DSA `typography` dimension page-scoped or CSS-scoped?**
       **ANSWERED 2026-09-06 (cloud wake, Continue/build — the lane this item
       named): CSS-scoped, and it already was in practice. What was missing
       was the sentence saying so.** The item's own stated evidence is
       refuted and its conclusion survives, which is why both are recorded.

       **The premise is FALSE.** 292.3 says *"every cite for them names a CSS
       file"*. Counted rather than re-read: `\.css\b` appears in **2 of 40**
       typography cites, **3 of 40** colour, **3 of 40** spacing. Naming a
       filename is not the signal and never was.

       **The conclusion holds, on a different instrument.** All 240 cites (40
       components x 6 dimensions) were classified by which ARTIFACT the
       sentence names — a stylesheet (a `.css` file, a `--bo-` custom
       property, an at-rule, a `.bo-` selector, a length literal, a
       declaration name) or a docs page (the opener, the page, the docs, a
       caption, `.astro`, the wrong-choice clause). typography/colour/spacing
       come back **120 of 120 css-side, 0 docs-page-side**. Hand-read against
       the cite text, the five the keyword pass mis-sorted all resolve the
       same way: `typography/scan`, `colour/offcanvas` and `colour/dialog` say
       *"the page"* meaning the **consumer's** page, not the docs page, and
       `spacing/richtext` (*"zero raw dimension literals"*) and
       `spacing/dropdown` are css-side in phrasing too terse to match. So the
       trio is 40/40/40 by hand and 38-39 by lexicon, in the same direction.

       **Red-proved by injection, both directions, each asserted to land**:
       replacing `badge`'s typography cite with a page-only sentence moves
       typography `css 39 -> 38, page 0 -> 1`; replacing `alert`'s content
       cite with a css-only sentence moves content `css 3 -> 4, page 31 -> 30`.
       The classifier still discriminates on the real tree, so 120-of-120 is a
       measurement and not a detector that has stopped being able to fail.

       **Why the question could be asked at all, measured exactly.** The three
       page-scoped dimensions each already name their subject in `definitions`
       — `interaction` says *"the page"*, `content` says *"opener"*, `fit`
       says *"the page"* and *"the docs"*. Of the three CSS-scoped ones,
       `colour` names **no subject at all**, and `typography` and `spacing`
       name one only obliquely (*"in place"*, *"this file"*). That asymmetry —
       not a genuine ambiguity in the practice — is what left the blind
       re-score with two defensible answers.

       **Landed:** `rubric.scope` in `dsa-scores.json`, one `css`/`page` value
       per dimension with the count above as its `$comment`, plus two
       assertions in `check-dsa-scores.mjs` (every dimension declares a valid
       scope; no scope entry names a dimension that does not exist). Both
       red-proved by injection asserted to land, each failing **exactly one**
       of 362 assertions and exiting 1, with the tree restoring to green —
       not the too-broad red that certifies nothing.

       **Refused: repeating the scope into the six `definitions`.** Two
       records of one fact is how they drift, which is the defect assertion 4c
       in that same gate exists to prevent between a score and `check:wrong-
       choice`. Also refused: a gate asserting each CITE respects its
       dimension's scope — this item's own count is what shows the classifier
       for it is a keyword pass that mis-sorts 5 of 240 in both directions,
       so it would be the semantic-property gate CLAUDE.md 94.11 refuses.

       **Consequence for the reading that raised this**, stated because it is
       the whole point of asking: `icon.astro`'s raw font-size literals are
       **outside** `typography`, so the published `3` stands and the blind
       re-score's `2` was out of scope — as the scorer itself flagged. The
       literals are real and now belong to nothing; filed as 292.8. Note the
       re-score's *"four times"* is right for `1.5rem` specifically and the
       page carries **six** raw font-size declarations, three of which
       (`1.5rem`/`2rem`/`3rem`, lines 202-204) are the size-tracking demo
       itself and are intrinsic in the rubric's own language.
       - **Accept:** `dsa-scores.json`'s `rubric` states the scope of each
         dimension explicitly, and the statement agrees with what the 40
         existing cites actually read (asserted by counting them, not by
         reading a few); a scope that turns out to be already unambiguous is a
         satisfying outcome and closes this with the count as its evidence
         **(done — all six declared; 120/120 counted; the already-unambiguous
         outcome is the one that occurred)**.

4. [x] **292.4 — `/components/icon` deprecates `--settings` and then teaches it
       as canonical, twice, in the two places a reader copies.** Verified from
       the page source, not the re-score's word: `--settings` is one of the
       four derived deprecated glyphs, and it is also in the `markup` string
       (`icon.astro`'s canonical copy-paste block, the icon-only button) and in
       the live "In context" demo, under a caption that endorses it — *"a cog
       for settings … conventions a reader already holds"*. The page's own
       `bothLists` build guard exists to catch exactly this contradiction and
       structurally cannot see it: it compares the editorial eight against the
       deprecated four, and the `markup` string and hand-written demos are in
       neither list. Two honest resolutions, and picking between them is a
       design call rather than maintenance: un-deprecate `--settings` (the
       reference suite gives it to a module, and the caption's argument for it
       is sound), or move both teaching sites to a non-deprecated glyph.
       - **Accept:** no glyph is simultaneously in the derived deprecated set
         and in the `markup` string or a live demo on the same page, and
         whichever resolution is chosen, the guard that would have caught it is
         extended to the markup string and red-proved by putting a deprecated
         glyph back into it **(done — both clauses; the resolution taken is the
         second one, `--settings` → `--close` at both sites)**.

       **THE PREMISE HOLDS AND THE DESIGN CALL IS RESOLVED AGAINST THE
       RESOLUTION THE ITEM LEANED TOWARD (2026-09-06, cloud wake).** Premise
       re-checked first, per CLAUDE.md: `.bo-icon--settings` is one of the four
       `/* DEPRECATED` blocks in `icon.css` (line 127), and the page carried
       **exactly two** hand-written literals of it —
       `grep -noE 'bo-icon--[a-z0-9-]+' apps/docs/src/pages/components/icon.astro`
       → line 119 (the `markup` block's icon-only button) and line 220 (the
       "In context" demo). The other 14 literals name non-deprecated glyphs;
       the two showcases build their classes by interpolation and so appear in
       no literal count.

       **Un-deprecating was refused, and its stated ground is refuted.** The
       item offered it on the strength of the demo caption's argument — *"a cog
       for settings … conventions a reader already holds"*. There is no cog:
       the shipped mask for `--settings` is `M4 7h16M4 12h16M4 17h16` plus
       three filled `r='2'` circles at (9,7), (15,12), (7,17) — three rules
       with a dot on each, the **sliders** mark. The caption describes artwork
       this framework does not ship, and it was wrong under either resolution.
       Independently of that, un-deprecating changes what a published package
       recommends and reverses a dated, cited decision (53.2) — the shape
       249.13 was sent to the owner for — whereas moving a docs teaching site
       is maintenance and is what the deprecation's own text instructs.

       Landed: both sites now use `--close`, which the opener already names as
       a convention (*"close, search, settings"*) and which carries no
       `DEPRECATED` block; the caption no longer claims a cog. Verified on the
       BUILT page, not the source: `aria-label="Settings"` → **0**,
       `aria-label="Close"` → **2** (the demo button and the shell's own
       mobile-nav close, located individually rather than counted), and the
       **3** surviving `bo-icon--settings` are all generated — the Deprecated
       showcase, the `ClassRef` row and the `ApiTable` variant list — which is
       the state the page is supposed to be in.

       **The guard now asserts the property where the reader gets the class**,
       scanning the page's own source: every hand-typed `bo-icon--*` in the
       `markup` string or the template region must not be in the derived
       deprecated set. The two generated showcases are exempt *for free* rather
       than by an exception, since an interpolated class cannot match a literal
       scan. Frontmatter is excluded deliberately — the editorial-eight comment
       names a glyph in prose, which is CLAUDE.md's assertion-trips-on-its-own-
       explanation trap made concrete.

       **Red-proved twice, and the two proofs DISCRIMINATE.** Injecting
       `--settings` back into the `markup` block exits 1 with *"settings (in
       the markup block)"*; injecting it into the live demo instead exits 1
       with *"settings (in a live demo)"* — one assertion each, not a broad red,
       and the tree restores green. Each injection was asserted to land (unique
       target, replacement count 1, literal re-counted after the write) before
       the build was believed.

       **The reconciliation earned its keep on its own first run, which is the
       finding worth carrying.** The guard counts parsed + interpolated against
       a raw count of the bare prefix and refuses to pass when they disagree.
       That immediately failed with `15 + 4 ≠ 24` — because `import.meta.url`
       in Astro frontmatter resolves to the **compiled** module in
       `apps/docs/dist/pages/…/icon.astro.mjs`, so the first version scanned
       the wrong artifact. The repo's existing `../../../../../` idiom hides
       this: it works from either location only because `src/` and `dist/` sit
       at equal depth. Without the count assertion the guard would have shipped
       reading compiled JS and reported a clean page. Carried into
       `ENVIRONMENT.md` as a durable trap.

       **Not fixed here, filed as 292.9:** the same defect exists on four other
       docs pages, so the property landed is page-local while the property that
       matters is tree-wide.

5. [x] **292.5 — the canonical `markup` block teaches a different mechanism
       than the page it sits on, and drops a slot class its own demo uses.**
       Two divergences, both verified in `icon.astro`: (a) the block teaches
       `.my-icon--rocket { mask-image: url(…) }` and the `ApiTable` note says
       *"add your own with one `mask-image` line"*, while the page's headline
       section and `icon.css`'s header both say `--bo-icon-src` IS the
       mechanism — and the two are not equivalent, since `.bo-icon` lives in
       `@layer bo-components`, so a consumer's unlayered `mask-image` override
       wins by accident of layering while the custom property is
       layer-independent and is what `api.json` publishes; (b) the block's
       sidebar-link sample omits `bo-sidebar-nav__icon`, which the live demo one
       section above uses and whose caption names, and which
       `sidebar-nav.css` sizes at `1.3em` with the collapsed-rail width
       computed from it — so the copied markup mis-aligns labels.
       **The structural cause is one thing**: six of the seven demo sections
       hand-write their preview and then a separate `markup` string rewrites
       it, which is the recipe's *"never write the preview and code twice"*.
       The one section using `<Demo code={…} />` is the only one that cannot
       diverge, and it is the only one showing `--bo-icon-src`.
       - **Accept:** the sidebar-link sample a reader copies renders with the
         same classes as the live demo it sits beside (asserted against the
         BUILT page, both blocks, not against the source), and the custom-glyph
         line the page teaches is the one its own header calls the mechanism.

       **LANDED 2026-09-06 (cloud wake). Both premises reproduced on the BUILT
       page before anything was edited**, read the way a reader gets them: the
       copyable block is syntax-highlighted by `highlight-code.mjs` *after*
       `astro build`, so the source string arrives wrapped in dozens of
       `<span style=…>` tokens and HTML-escaped. The probe therefore took the
       `<pre>`'s `textContent` in a real browser — the same text the site's copy
       button hands over — and re-parsed it with `DOMParser`, rather than
       regex-stripping the file. Before: live `[bo-icon, bo-sidebar-nav__icon]`
       vs copied `[bo-icon]`, `mask-image` present, `--bo-icon-src` absent.
       After: identical structural class lists, `mask-image` absent,
       `--bo-icon-src` present, and the block's `bo-icon` span count 2 → 3,
       which reconciles with the element the stanza gained.

       **THE MECHANISM CLAIM WAS MEASURED, NOT REASONED, AND IT DISCRIMINATES.**
       This item asserted that a consumer's `mask-image` override "wins by
       accident of layering". In the built page, injecting the same rule three
       ways and reading `getComputedStyle(el).maskImage`:

       | consumer rule | computed |
       |---|---|
       | `.my-icon--rocket { mask-image: … }`, unlayered | paints |
       | the same, inside `@layer bo-primitives` | **`none`** |
       | `.my-icon--rocket { --bo-icon-src: … }`, unlayered | paints |
       | the same, inside `@layer bo-primitives` | paints |

       Declared order is `bo-reset, bo-tokens, bo-primitives, bo-components,
       bo-utilities`, so a consumer who adopts layers at all and puts their
       overrides anywhere below `bo-components` gets a glyph that silently does
       not paint. The custom property has no competing declaration, so it is
       position-independent. That makes this a correctness difference, not a
       spelling preference.

       **A THIRD SITE THE ITEM DID NOT NAME: `icon.css` contradicts ITSELF.**
       The item said the page's headline section and the stylesheet's header
       "both say `--bo-icon-src` IS the mechanism". Half true — the header's
       property comment says exactly that, and its *opening* comment, thirty
       lines above, taught `.my-icon { mask-image: … }`. So the split was
       three-sited (copyable block, `ApiTable` note 3, stylesheet header), not
       two. Fixed in all three; note 1's *"painted by `currentColor` via
       `mask-image`"* is deliberately untouched — it describes what the
       component IS, it does not tell a reader what to write.

       **The guard is page-local and asserts two properties.** Clause 1: every
       `.bo-sidebar-nav__link` sample in the copyable block and in the
       in-context demo must agree on the icon span's *structural* classes — the
       `bo-icon--*` glyph modifier is excluded, because which glyph each shows
       is editorial and comparing it would fire on a correct page, while
       `bo-sidebar-nav__icon` is not editorial (`sidebar-nav.css` sizes that
       slot at `1.3em` and derives the collapsed rail's `3.25rem` from it).
       Clause 2: the property the copyable block DECLARES must be the one
       `icon.css` puts behind `mask-image`, derived from the shipped stylesheet
       rather than hard-coded, reconciled as one DISTINCT name because the
       autoprefixer emits the declaration twice.

       **RED-PROVED, AND THE RED-PROOF CHANGED THE CODE — twice, both in the
       direction CLAUDE.md predicts.** First run: one case ABORTED (the bare
       class list occurs twice, copyable block *and* demo, so the injection
       could have hit either — the uniqueness precondition caught it before the
       build was believed), and one came back **GREEN**. The green one was a
       defect in the GUARD, not the injection: swapping the taught line to
       `background-image:` left `markup.includes('--bo-icon-src')` true, because
       the stanza's own explanatory comment names the property one line above
       the rule. That is the assertion-trips-on-its-own-explanation trap
       arriving from its other side — prose beside a change is *supposed* to
       name the thing, so a raw-text check can be **satisfied** by an
       explanation as easily as tripped by one. Comments are now stripped and
       the check is on the declaration.

       Five injections, each asserted to land (unique target, replacement count
       1, literal re-counted after the write) before the build's verdict was
       read; tree restored green after each:

       | injection | build | assertion that fired |
       |---|---|---|
       | A — slot class dropped from the copyable block | exit 1 | the cross-block comparison, as predicted |
       | D — slot class dropped from the live demo instead | exit 1 | the *within-source* arm: "the in-context demo's 3 sidebar links disagree on slot classes" |
       | B — copyable block teaches `mask-image` again | exit 1 | "never DECLARES `--bo-icon-src`" |
       | C — copyable block teaches `background-image` | exit 1 | "never DECLARES `--bo-icon-src`" |
       | E — a second rule teaching `mask-image`, property kept | exit 1 | "sets `mask-image` directly" |

       **D and B are recorded as what they DID, not as what was predicted.**
       Neither fired on the arm it was aimed at, and B is the one that matters:
       the checks run declaration-first, so removing `--bo-icon-src` to add
       `mask-image` trips the earlier assertion and leaves the `mask-image` arm
       **unreached**. E exists because of that — it keeps the declaration and
       adds a second rule, which is the only shape that reaches it. Without
       reading the messages rather than the exit codes, that arm would have
       shipped with no red-proof of its own behind four green ticks.

       **NO TREE-WIDE GATE, and the refusal is measured — including a defect in
       the instrument that measured it.** The generalisable predicate is "a
       class the copyable block teaches appears somewhere else on its own page".
       First reading: **3 of 9** pages fail (`date`, `ordered-list`,
       `quantity`). Reconciled against an independent per-class count and the
       instrument was wrong — it scanned only the template region, while
       `quantity` keeps its demos in frontmatter `Demo` strings
       (`bo-btn`: 0 template hits, 24 whole-file). Scanning the whole page
       instead: **0 of 9**, so the predicate is uniformly true and a gate over
       it is the ceremony 94.11 refuses. Commands are the two Python blocks in
       this wake's transcript; re-run them, they are snapshots.

       **And that predicate is NOT this item's property, which is why the
       page-local guard is not a smaller version of it.** Containment cannot see
       a class that is *omitted* from the sample — the actual defect here — only
       one that is *invented*. 9 of 41 component pages carry a `const markup =`
       block at all; the other 32 build the section differently, so even the
       containment form has a population of nine.

       **NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots —
       a cloud wake has no Podman. A screenshot lane IS relevant and unspent:
       the copyable block gained two lines and its longest line grew to ~88
       characters, and the `<pre>` is a scroll container, so `check:layout`
       (127 pages, 390px and 150% zoom), `check:scroll` (914 containers) and
       `test:axe` (127 x 2 widths) are green across the tree — but nobody has
       looked at `/components/icon`. The live demos and every rendered element
       are untouched; only the text inside the code block changed.

6. [x] **292.6 — `icon.css` forbids figures in itself and carries two.** Its
       header's `NO FIGURES HERE, deliberately` block says the two figures it
       used to carry were exact when written and wrong five days later, and
       that live numbers belong on `/components/icon` — which computes them.
       The 137.1 note lower in the same file then states *"took the whole
       framework from 80 kB to 84 kB minified and 13.2 kB to 13.8 kB
       gzipped"*. Measured here: `packages/core/dist/css/index.min.css` is
       **95,172 bytes (92.9 kB)**, gzipped **15,458 (15.1 kB)**.
       **Weaker than the two defects above, and stated as such**: the sentence
       is framed as a before/after DELTA of adding eleven glyphs, names its
       method (`stamp-readme.mjs`'s own stat), and a historical delta does not
       decay the way an absolute does. What has decayed is the pair of
       absolute endpoints a reader reads as current. Also note the gzip figure
       is the kind `LOOPS.md` warns must never be gated byte-exact — the
       re-score's independent reading was 15,305 against this wake's 15,458 on
       the same tree, which is the zlib-build variance that rule exists for.
       - **Accept:** the block states the delta without absolute endpoints that
         age, or states them with the revision they were taken at; deciding it
         needs no new figure is a satisfying outcome, recorded with the reading
         above as its evidence.
       - **CLOSED 2026-09-06** (cloud wake), by the Accept's SECOND branch: the
         endpoints are dated rather than deleted or refreshed, and the block now
         points a reader at the live stamp instead of carrying an absolute.

         **The premise re-verifies, and so do the endpoints — the second is the
         part that was never checked.** Rebuilt here:
         `wc -c < packages/core/dist/css/index.min.css` → **95,172**, and
         `zlib.gzipSync(...)` → **15,458**, both exactly the figures above. The
         endpoints were then read from the artifact rather than believed:
         `git show <rev>:README.md | grep stat:size` at **`d48f361d`** (parent)
         gives `80 kB minified (13.2 kB gzipped)` and at **`43ea922a`**
         (2026-08-24, "Slices 136/137") gives `84 kB minified (13.8 kB
         gzipped)`. So all four are *correct at their revisions* — the defect is
         only that nothing said which revisions, which is why dating them is a
         repair and refreshing them would not be. `git show 43ea922a --
         .../icon.css | grep -cE '^\+  \.bo-icon--'` → **11**, so the block's
         "these eleven" is right; the commit MESSAGE's "ten formatting glyphs"
         is the wrong one of the pair, left as history.

         **The `stat:size` stamp is the live equivalent this block can point
         at**, exactly as the header points at `/components/icon`: both READMEs
         read `93 kB minified (15.0 kB gzipped)` today, kept current by
         `stamp-readme.mjs`. Nothing new is asserted in the CSS.

         **One measurement contradicts this item's own parenthetical, and it
         costs nothing.** The 15,305-vs-15,458 gap was attributed to
         zlib-build variance. On this one tree and one Node build,
         `gzipSync(buf)` = **15,458** and `gzipSync(buf, {level: 9})` =
         **15,296** — a **162-byte** spread from compression LEVEL alone, with
         no second build involved. That does not identify what produced 15,305
         (neither reading is it), so the cause stays unknown; what dies is the
         inference that a gap of this size implies two zlib backends.
         **No new item**: `GZIP_TOLERANCE_KB = 0.3` (307 bytes) in
         `stamp-readme.mjs` already absorbs 162, so the latent gate risk this
         would otherwise be does not exist. Re-run it; these are snapshots.

         **NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots
         — a cloud wake has no Podman. **None is owed, and that is measured
         rather than argued:** the only CSS touched is a comment body, and
         `index.min.css` is byte-identical across the edit — **95,172 / 15,458**
         before, **95,172 / 15,458** after, re-measured a third time after
         rebasing onto the 0.8.0 release, which did not move them either.
         Nothing renders differently because nothing reaches the browser.

7. [x] **292.7 — four `content` cites score a page property while citing the
       CSS. DONE 2026-09-06 (cloud wake, Continue/build — the lane this item
       named). The four reproduce exactly; the sentence beside them does
       not, and it omitted a fifth component of the same shape.**

       **Premise re-checked before acting on it**, per CLAUDE.md's rule that a
       premise which is itself an earlier wake's measurement is part of the
       criterion. 292.3's classifier was a throwaway and left no script, so it
       was reconstructed from 292.3's own description of the lexicon (css-side:
       a `.css` file, a `--bo-` property, an at-rule, a `.bo-` selector, a
       length literal, a declaration name; page-side: the opener, the page, the
       docs, a caption, `.astro`, the wrong-choice clause) and run over the 40
       `content` cites, reconciled 40 = 40 against the component count:

       ```
       page 33 | css 0 | both 3 (money quantity richtext) | neither 4 (amount breadcrumb tabs dialog)
       ```

       - **The finding reproduces.** The `neither` bucket is exactly the four
         this item names — no more, no fewer.
       - **The sentence about `form` and `prose` does NOT reproduce, and it is
         a lexicon artifact rather than a change in the tree.** Both classify
         **page**-side here, because this reconstruction reads `EXEMPT` and
         `check:wrong-choice` as page-side signals and 292.3's evidently did
         not. The tell that the old lexicon was the inconsistent one:
         **`button` is the third `check:wrong-choice` EXEMPT component**, its
         cite says *"it is EXEMPT in check:wrong-choice rather than missing the
         clause"* — the same shape as the other two — and 292.7 does not
         mention it at all. A rule that caught two of three identical cases was
         reading something other than the property.
       - **Three cites this item does not mention are `both`** — `money`,
         `quantity` and `richtext` each name the opener AND an alternative's
         `.bo-` class. Each opens *"the opener says…"*, so each already names
         the page property the score is taken on. **Recorded as already
         adequate and NOT rewritten**, which the Accept names as a satisfying
         outcome.

       **Landed:** the four cites now name the opener's wrong-choice clause and
       the alternative it links, quoting the clause so a reader can check the
       score against the page. `neither` goes **4 → 0**; `page` **33 → 37**;
       `both` unchanged at 3; every score and the whole `rubric` block asserted
       byte-identical across the edit, and the four target strings asserted
       unique in the raw file before replacement (the first attempt **failed
       that assertion** — `json.dumps` escapes the em dash to `—` and
       found 0 occurrences of the `dialog` cite, so the run aborted before
       writing rather than silently replacing three of four).

       **Red-proved by injection, asserted to land**: `alert`'s content cite
       replaced with a css-only sentence, the injection confirmed *through the
       parser* rather than in the file, moves the buckets `page 37 → 36,
       css 0 → 1` — exactly one component, not the too-broad red that certifies
       nothing — and the tree restores to `page 37 / neither 0`.

       **Nothing was lost, checked rather than assumed.** Each displaced CSS
       fact already lives in the stylesheet's own comment —
       `breadcrumb.css:45-47` (the separator's empty accessible name),
       `dialog.css:139-147` (why forced-colors needs a border when the edge is
       box-shadow only), `tabs.css:39-42` (why the fade is not applied to
       `.bo-data-table-container`) — and `amount`'s two-channel fact is carried
       by its own `colour` cite (*"negative/positive is the two-channel
       signature contract, AA-gated"*).

       **Refused: a gate.** 292.3 already refused one asserting each cite
       respects its dimension's scope, on the ground that the classifier for it
       is a keyword pass — and this run is fresh evidence for that refusal, not
       against it: the reconstruction disagrees with the original on `form`,
       `prose` and `button` purely on lexicon. Per CLAUDE.md 94.11 the checkable
       shape is not the property.
       - **Accept:** every `content` cite names the page property the score is
         taken on, or states the exemption; asserted by re-running 292.3's
         classifier over the `content` dimension and reconciling its buckets
         against the EXEMPT set, with the finding that a cite is already
         adequate recorded as a satisfying outcome rather than rewritten
         **(done — `neither` 0, all three EXEMPT components state the
         exemption, and the three `both` cites are recorded adequate rather
         than rewritten)**.

       ORIGINAL TEXT, kept because the correction above is only readable
       against it (236.2 — archived text may be amended, and a struck claim
       stays visible):

       Found by 292.3's classification, not by reading. `content` is
       page-scoped by definition (*"the opener carries the wrong-choice
       clause"*) and assertion 4c ties the score to `check:wrong-choice`'s
       verdict on the page, so a `content: 3` is a claim about the opener.
       **4 of 40 cites name something else entirely**: `breadcrumb` (the
       separator's `content("/")` accessible name), `dialog` (the
       forced-colors rule), `tabs` (the mask comment) and `amount` (sign and
       parentheses in text). The scores are not wrong — 4c passes, so all four
       pages do carry the clause — the CITES are, and a cite is the only thing
       a reader can check a score against (assertion 3's stated reason). The
       other two non-page cites, `form` and `prose`, are correct as they
       stand: both are `check:wrong-choice` EXEMPT and their cites say so.
       ← **this last sentence is the half that did not reproduce; see above.**
       (The Accept is quoted once, in the closure above, rather than twice
       here.)
       - **Note:** rewriting a published cite is a scoring judgement, so this
         is Continue's or the owner's, not Polish's — same lane as 292.3.

8. [x] **292.8 — nothing polices style in a docs PAGE, and 292.3 is what makes
       that visible.** With `typography` established as CSS-scoped, a raw
       `font-size` in an `.astro` page is outside the rubric, outside
       `lint:css` (which lints `packages/core/src/css`), and outside every
       build gate. Measured: `grep -lE 'font-size:\s*[0-9]'` over
       `apps/docs/src/pages/components/*.astro` returns **1 of 41** files —
       `icon.astro`, with six declarations. **The base rate is why this is
       filed rather than built**: at 1 of 41 the property is nearly uniform
       already, which is the shape CLAUDE.md 94.11 says produces ceremony, and
       three of the six literals are the icon page's size-tracking demo, where
       an absolute size is the DEMONSTRATION. So the honest options are to fix
       the three display-sizing literals and leave the demo, or to decide docs
       pages are deliberately unpoliced and say so once, somewhere a reader of
       the recipe will find it.
       - **Accept:** either the count of component pages carrying a raw
         `font-size` outside a deliberate size demo reaches 0 and a one-line
         reason records why no gate was added, or the recipe in `CLAUDE.md`
         states that docs-page style is unpoliced and why; deciding no change
         is needed is satisfying if it carries the re-run count.
       - **DONE 2026-09-07 (cloud wake).** First branch taken: the three
         display-sizing literals are gone, the demo keeps its three, and no gate
         was added. **Premise re-run before building on it** — the same command
         still returns **1 of 41** (`icon.astro`, six numeric declarations, the
         other two `font-size` uses on that page already reading
         `var(--bo-font-size-xs)`).

         **The swap is exact, not approximate:** `--bo-font-size-xl` is
         `1.5rem` in `tokens/typography.css:11`, the literal's own value. Three
         sites moved on `components/icon.astro` (the set gallery, the deprecated
         gallery, the themable row) and **one on `base/motion.astro`** — the
         spinner glyph, the same shape one directory over, taken because leaving
         it would have made the recorded property untrue of the tree while
         claiming it of the page.

         **Verified by measurement, and the no-op was red-proved against being a
         dead edit.** A throwaway probe (scratchpad, not the repo) read the
         computed `font-size` of every element on both built pages before and
         after: **1,565 + 1,337 elements, 0 key-set differences, 0 computed
         differences.** A no-op diff alone proves nothing — it is also what an
         edit that never landed produces — so the same probe re-read each page
         with `--bo-font-size-xl` overridden to `3.25rem` on `:root`:
         **before, 0 elements moved on either page; after, 31 on icon and 1 on
         motion**, exactly the four edited sites and their inheriting
         descendants, every one `24px → 52px`. The token is therefore wired, and
         the elements it is wired to are the intended ones.

       - **Why no gate — three measured grounds, not one.**
         1. **Base rate.** After the edit, component pages carrying a raw
            `font-size` outside a deliberate size demo: **0 of 41**. A predicate
            already true of everything cannot fail (CLAUDE.md 94.11).
         2. **A text-grep predicate over this property is unsound, measured.**
            Widened past the Accept's scope to the whole page tree, the source
            grep returns **4 files of 127** — and **2 of the 4 carry no style
            attribute at all in the built page**:
            `getting-started/troubleshooting.astro` names
            `html { font-size: 62.5% }` in PROSE, inside `<code>`, as the
            symptom of a hostile host page, and `patterns/output-form.astro`
            carries `font-size: 9pt` inside a **copyable `@page` print sample**
            where `pt` is right and a docs token does not exist in the
            consumer's stylesheet. Commands:
            `grep -c 'style="[^"]*font-size: 62.5%' apps/docs/dist/getting-started/troubleshooting/index.html`
            → **0**, same shape for `9pt` on `patterns/output-form` → **0**,
            against `font-size: 2rem` on `patterns/app-launch` → **1**.
         3. **The one real remaining site should not be converted.**
            `patterns/app-launch.astro:134` sizes a launcher icon at `2rem`, and
            **no token equals 2rem** (`xl` is the largest at 1.5rem), so a swap
            would shrink it — a rendered-image judgement a cloud wake cannot
            make. Left, with the reason here rather than a gate red on it.

         The decision is recorded at the site too: an Astro comment above the
         Sizes section says the three literals are the demonstration, which is
         where a reader of the page meets the question.
       - **NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots
         (a cloud wake has no Podman). What that would add here is *"does it
         look right"*; what is claimed instead is that **nothing changed** —
         asserted over 2,902 elements' computed font-size, plus `check:layout`
         across 127 pages and `test:axe` at both widths.

9. [x] **292.9 — 292.4's property is tree-wide and the guard it landed is
       page-local: four other docs pages hand a reader a deprecated glyph.**
       Measured while closing 292.4, not assumed — `for g in settings barcode
       building user; do grep -rln "bo-icon--$g" apps/docs/src --include='*.astro';
       done`, then each hit classified by whether its line sits before or after
       the frontmatter fence:

       - `components/offcanvas.astro:66` — `--settings`, live demo sidebar link
       - `components/sidebar-nav.astro:82` — `--settings`, live demo sidebar link
       - `base/motion.astro:302` — `--settings`, live demo (the spinning "Saving…")
       - `base/motion.astro:62` — `--settings`, **inside a copyable markup
         string** — the exact shape 292.4 just fixed, one page over
       - `patterns/app-frame.astro:114` — `--building`, live demo sidebar link

       `--barcode` and `--user` reach **0** source pages, so this is five sites
       across four files, not a general rot. The icon page's own comment already
       records that these renders exist; what it does not say is that one of them
       is a **copy-paste block**, which is the difference between a screen that
       happens to use a deprecated class and a page that teaches it.

       **Why a tree-wide gate cannot simply be added today**: it would be red on
       all five, so the sites have to be resolved first — and the deprecation's
       own text ("existing renders keep working") means a bare render is not by
       itself a defect. The honest question is whether a docs page differs from
       a consumer screen here, and the argument that it does is that a reader
       copies from it.
       - **Accept:** every hand-written `bo-icon--*` in `apps/docs/src/pages`
         either names a glyph with no `DEPRECATED` block or carries a one-line
         reason it must stay, asserted by a check that reports its own count and
         is red-proved by putting a deprecated glyph back into a page it passed;
         **finding that some of the five should legitimately keep their glyph is
         a satisfying outcome** and closes this with the reasons recorded, not a
         gate forced over them.
       - **Lane**: the code and the counts are cloud-takeable. The only judgement
         needing eyes is whether a replacement glyph reads right, and the mask box
         is `1em` either way, so no geometry moves — say which glyph you chose and
         why rather than claiming a visual check that did not happen.
       - **CLOSED 2026-09-07 (cloud wake).** The premise reproduces to the site:
         the same command returns the same five sites across four files, and
         `--barcode`/`--user` still reach 0 as hand-written classes.
         `check:deprecated-icons` ships, in the docs BUILD chain (not
         `check:repo` — see below), reporting its own counts:
         `SOURCE: 151 .astro file(s), 17 carrying glyphs, 88 hand-written + 5
         interpolated · DIST: 127 built page(s), 0 unexplained deprecated
         render(s), 8 exempt`.

         **No site kept its glyph, so `KEEPS_ITS_GLYPH` is empty** — the Accept
         allows an exception and none was true, because every one of the five is
         a demo rail or a spinner where the glyph is editorial. Which glyph and
         why, since no screenshot was taken:
         - `components/offcanvas` — the drawer rail's third link, Settings/
           `--settings` → **Shipments/`--truck`**. Relabelled rather than
           re-glyphed: no shipped glyph reads as "settings", and the rail's other
           two entries are already ERP nouns.
         - `components/sidebar-nav` — the Finance section's second link,
           Settings/`--settings` → **Statements/`--doc`**. Same reasoning; a
           statement is a Finance screen and `--doc` is unused in that nav.
         - `patterns/app-frame` — the Purchasing rail's Vendors/`--building` →
           **Goods receipts/`--truck`**, which is a real screen in the module the
           nav is labelled for.
         - `base/motion` × 2 (the live "Saving…" swap and the `savingMarkup`
           const) — `--settings` → **`--grid`**, and this one rests on geometry
           rather than taste: `--grid`'s four `7x7` rects at (4,4) (13,4) (4,13)
           (13,13) map onto themselves under a 90° rotation about the 24x24
           viewBox centre (12,12), so it reads continuous under `bo-motion-spin`;
           `--settings`' three offset lines do not.

         **The five were not all of it, and the sixth is the finding.** The
         source phase went green while `/components/demos/sidebar-nav-narrow`
         and `-wide` were both still rendering `bo-icon--user`:
         `SidebarNavShellDemo.astro` hand-writes the glyph NAME in a tuple
         (`['user', 'CRM']`) and interpolates it into the class, so no scan for a
         literal class can ever see it. Caught by grepping the BUILT pages after
         the gate had already passed — CLAUDE.md's rendered-artefact rule doing
         exactly its job. Fixed as **Reporting/`--chart`** (no shipped glyph
         reads as "customer"; Reporting is an ERP module in its own right).

         **The blind spot had been NAMED in the gate header, with a measurement
         beside it, and the measurement was wrong** — the needle was
         `icon: '<name>'`, an object-property spelling, and the live site is a
         tuple. A needle that assumes one syntax reports a confident absence
         about the other. So the gate gained a second phase that traces no values
         at all and reads the artefact; it is why the gate moved out of
         `check:repo` (source-only, runs pre-build) into the docs `build` chain
         after `check:links`, rather than skipping half of itself when `dist/` is
         absent.

         **Three red-proofs, each going red on exactly the case under test:**
         `bo-icon--settings` re-injected into `offcanvas.astro` (occurrence count
         asserted at 1 before replacing) → `1 of 34`, that file and no other;
         `bo-icon--{grid}` into `dropdown.astro` → `1 of 33`, the reconciliation
         arm; and the real one — reverting `SidebarNavShellDemo` to
         `['user', 'CRM']` and rebuilding → `2 of 35`, the two demo pages and no
         others. `--self-test` covers 8 classification cases.

         **The `icon.astro` frontmatter exemption is load-bearing, re-measured
         after the parse it originally cited moved out**: dropping it fails
         `1 of 34` at `2 named + 2 interpolated against 9 bare`, naming that file
         alone. A `/suite/` entry in `MAY_RENDER` was written and **removed as
         dead** — `dist-pages.mjs` skips `suite` by name, so it could never have
         matched, and an exemption that cannot fire reads as coverage the gate
         does not have.

         **Also folded in:** the deprecated-set parse now lives once, in
         `apps/docs/scripts/deprecated-glyphs.mjs`, instead of being copied
         between `/components/icon`'s 292.4 guard and this gate — two copies of
         that regex would be two gates able to disagree about which glyphs a
         reader should stop being handed. `check:selftests` counted the new gate
         on its own (53 → 54 gates, 19 → 20 heuristic) and failed the core build
         until the READMEs were re-stamped, which is that mechanism working.

         **NOT VERIFIED, said plainly:** no screenshots at 1440/390 in light and
         dark — a cloud wake has no Podman. Five rail labels and two glyphs
         changed on four docs pages; the whole-tree gates swept them
         (`check:layout` 127, `test:axe` 127 x 2, `check:scroll` 914,
         `check:pseudo` 14 x 2) and the mask box is `1em` either way, so no
         geometry moves — but **nobody has looked at them**. A local wake's
         glance closes that cheaply.

**No gate is proposed for 292.2's class, and this is the sixth consecutive
refusal in this ledger** (216.2, 217.2, 220.2, 227.2, 231). `LOOPS.md` 101.3
confines Polish to maintaining the existing ratchet, and the predicate would be
a new arm on `check-page-shape`, not maintenance of one. **The base rate is
recorded here rather than argued, because it is the unusual one**: unlike
94.11's 155-of-155 ceremony, this predicate genuinely discriminated — 1 of 80
built pages failed it and 79 passed — and the defect survived
`check-page-shape`, `check:layout`, `test:axe`, two Polish rounds and two
Objective grills for 18 days. That is the strongest case for a gate this ledger
has assembled; it is still not Polish's to add. Filed for a Continue round with
the detector and its red-proof already written, in
`.roundtable/polish-state.md`'s entry for this round.

## Slice 291 — Objective grill of Slices 286, 287, 290: 32 of 32 published assertions reproduce and the three slices carry no defect — so the finding is on the other side of the desk, where **4 of this grill's own 4 ad-hoc probes were wrong**, each one reconstructed from a slice's prose instead of run from the command beside it (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 290 — Standardize sweep, 4 of 4 lanes clean, and the reading that makes that honest rather than dead: the inputs three lanes measure did not move since Slice 284. Lane 4's carried worry — `LOOPS.md`'s dispatch region regrowing — did NOT continue, and step 1's one live candidate is refused by discrimination (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 289 — Objective grill of the three items built since the last grill (283.3, 284.2, 288.1/288.2): 22 of 28 assertions reproduce, all six that do not sit beside no command, and the one that matters put an **empty diff** into the Accept of an item that is still open (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 288 — 286.3 asked for a decision on `LOOPS.md` §3b step 4 and required its own base rate re-run first; re-running it is what found that **4 of its 7 independent-pass entries do not hold**, and that the step it calls dead has moved a score twice on real defects — the LABEL and the TRIGGER were the defect, not the content (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 287 — 283.3 asked whether an advisory check is enough, and the honest answer is that the question has an EMPTY DENOMINATOR: 0 Polish rounds have run since 283.2, so the check has never had a live opportunity to fire — closed by repairing the gap that IS measurable, the printed repair command nothing ran (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 286 — the defect Slice 285 listed under "what reproduced": 281's decay is dated to the hour and its CAUSE is false — `69a53364` is a pure addition that never touched the table, the table is still reached by the rule, and the claim was shipped in the `data-table` spacing cite (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 285 — Objective grill of Slices 281, 283, 284: 31 of 33 assertions reproduce, and the one that matters is the measurement a design decision was BUILT on — "0 of 18 stamps reproduce at the parent" is **16 of 18**, and it had spread into the shipped script's own docstring (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 284 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's finding is that 167.1's stated reopen condition for `CLAUDE.md` was MET — an eighth section on "can this detector fail" was added without folding, and the fold is this slice (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 283 — Polish round 3 on `table-toolbar`: the re-queue signal this loop's step 0 runs every wake is a CONSTANT for 7 of the 13 surfaces it reports, and 5 of those 7 were broken by 276.1 — the round whose whole subject was this script's blindness (2026-09-05)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input. Rule 2 `3 / 4 Continue rounds … ok`; rule 3
`1 / 3 slice … ok [281]`. **Rule 4 found nothing this wake can take**: all 12
open items were re-read from `ROADMAP.md` and each re-classified from its own
text per `LOOPS.md` 186.2 — owner-blocked (`112.3`, `112.4`, `249.7`,
`249.10`-`249.13`, `273.2`, Slice 15) or browser-blocked in the SCREENSHOT
sense (`249.6`, `249.9`, `249.15`; a LOCAL wake can take those three).
**Rule 4's sweep clause did not fire either** — `roadmap_scope.py` read
**218 / 3,398 = 6.4%** closed-history share at dispatch (`7079c94`), with Slice
282 the only eligible target. *(The previous hand-off predicted `0.0%` and 117 lines; the difference
is Slice 282's own text, which that prediction was made before writing. Read
the number, not the forecast.)* Rule 5 reports **STALE** — 2 wake-dates of
loop activity newer than the newest comparable pair — so per `LOOPS.md` it
**could not be evaluated** and is not reported clear. **Rule 6 matched.**

**The pick was re-derived, not inherited.** §3b step 1's ranking is degenerate
— every eligible surface is `content: 3` at `2/3 rounds, dry 0` (171.1 reaching
the pick step) — so the tiebreak is the one the last wake used: which surface's
SOURCE has moved furthest from the tree its score was taken against. Re-run
this wake rather than reusing the ordering, over each surface's own paths since
the commit that recorded its stamp:

```
table-toolbar  stamped 2026-08-25  7 commits since  churn +122/-17   ← picked
alerts         stamped 2026-08-31  5 commits        +46/-7
icon           stamped 2026-08-30  4 commits        +72/-4
```

`data-table` is out at `3/3`. `table-toolbar` leads on all three readings.

1. [x] **283.1 — DONE 2026-09-05. `polish_requeue.py` reports 13 surfaces as
       "SOURCE moved"; for 7 of them that sentence is a constant that no source
       change can set and no source change can clear. Five are 276.1's own
       doing, and every affected row is a behavior-serving surface: 7 of 9
       against 0 of 12.**

       **The round on `table-toolbar` is a NO-OP on the surface** — four arms,
       all clean, listed at the end. The defect is in this loop's step 0, which
       is where the last four rounds' findings have also landed (267.1, 276.1,
       278, 279); it was found by asking the arm nobody had asked, which is
       whether the ledger's own `src` column means anything.

       **What a re-queue claims, and when it stops being true.** A row says
       "source moved since the last round" by comparing a recorded digest
       against today's. That comparison is only meaningful while both were
       computed the same way. **276.1 widened the path set to include behavior
       modules and did not re-stamp the rows computed without them.** A digest
       over strictly more blobs can never equal one over fewer, so for those
       rows the two sides can never agree again — the re-queue is `True`
       unconditionally, and `--apply` has been reporting it as a measurement
       ever since.

       **Measured, with the command, over the 21-row ledger at `7079c94`:**

       ```
       python3 scripts/loops/polish_requeue.py --audit-stamps
       ```

       | verdict | rows | what it means |
       |---|---|---|
       | equals today's digest | 7 | not re-queued at all |
       | reproducible, current path set | 7 | the re-queue means what it says |
       | reproducible ONLY under the pre-276.1 set | **5** | stamped before the widening — permanently re-queued |
       | reproducible at no revision of its own paths | **2** | `data-table`, `pagination` |

       The five are `alerts`, `dashboard`, `stepper`, `table-toolbar`,
       `tree-table`, each reproducing **exactly** under the narrow set at the
       commit that recorded it (`alerts` → `4ee5ad51` is the narrow digest at
       `4beb4b86`, where the wide digest is `577cb919`).

       **The attribution is not inferred from dates — it is a clean split.**
       Nine ledger surfaces have behavior modules in their source set; twelve do
       not. **All 7 affected rows are in the first group and none is in the
       second** (the two behavior surfaces not affected, `inline-editing` and
       `scan`, both equal today's digest, i.e. were stamped after the widening).

       **The two `data-table`/`pagination` rows are a DIFFERENT fault, and it is
       stated as an inference.** Both closed their rounds after 276.1, so the
       widening cannot explain them, and 322 and 60 revisions of their own paths
       respectively reproduce their stamp under neither path set. Both stamps
       were written by a commit that ALSO edited the surface's source, and match
       neither that commit's tree nor its parent's — so the digest was taken
       from an on-disk state between the two. `digest()` hashes the **working
       tree** by design (145.3, its own comment), so running `--stamp` before
       the round's last edit produces exactly this. **The contrast is what makes
       it more than a guess:** `byline`'s round edited both its source files in
       the same commit and its stamp is the digest of that commit's tree, not
       its parent's. Same-commit stamping is fine; stamping before the last edit
       is not. §3b step 5 and this script's own USAGE both already say "at the
       END of a round" — nothing new is being asked for, so no rule is added.

       - **Accept:** the report says, for every surface it re-queues, whether
         the recorded stamp is reproducible from a commit, and the verdict is
         red-proved by injection with the injection confirmed to have landed
         **(DONE — below)**; the number of rows the audit calls unreproducible
         agrees with an independent walk of the same question **(DONE — two
         implementations, 7 and 7, agreeing row for row)**.

       **Red-proof, and what each injection proves.** The detector returns all
       four of its verdicts on real input — `reproducible` on 6 rows, `narrow`
       on 5, `orphan` on 2 — so it demonstrably discriminates before any
       injection. Then:

       - **A stamp no commit records.** `badge`'s `1f69e677` → `deadbe01`,
         asserted to be exactly 1 occurrence before replacing and confirmed at 1
         occurrence after. The row flipped from silent to
         `⚠ stamp unknown: no commit in the ledger's history records this
         digest`. Restored and re-verified at 1 occurrence.
       - **The condition is CLEARABLE by the documented mechanism, not just by
         a hand edit.** `--stamp component/alerts` wrote `ccdfb154` and the
         report went 13 → **12** surfaces with 7 → **6** warnings: the row left
         the re-queue set entirely, because a correct stamp equals today's
         digest. Restored.
       - **The `narrow` verdict is a path-set fact, not "the digests differ".**
         Computed outside the new code: `alerts` at `4beb4b86` is `577cb919`
         over 3 paths and `4ee5ad51` over 2, and the ledger holds the second.

       **What the cheap check does NOT cover, said outright.** `--check` runs at
       step 0 every wake, so it tests two revisions — the commit that recorded
       the stamp, and its parent. Its `orphan` verdict therefore means "not the
       digest at the commit that recorded it", which is a **superset** of "no
       revision reproduces it": a stamp seeded from a historical tree reads
       `orphan` and is fine. **`component/date` is the live case** — `orphan`
       to the cheap test, and reproducible at `3909b80a`, a day before the row
       was written, to the exhaustive one. It is excluded from the re-queue set
       (SKIPPED, deprecated) so no output claims otherwise, and this is why
       `--audit-stamps` exists rather than the cheap verdict being trusted.
       The two instruments were reconciled row for row on all 21 rows, not
       compared as totals.

       **Every figure above is read at `7079c94`, the tree this round opened
       against, and closing the round moved two of them.** §3b step 5's
       `--stamp component/table-toolbar` wrote `99f7ac9f`, and the report went
       **13 → 12** surfaces with **7 → 6** warnings — the picked surface leaving
       the re-queue set is the same clearance the `alerts` red-proof
       demonstrated, arriving as the round's ordinary last step rather than as
       an injection. So the committed tree reads 12 and 6; the 13 and 7 describe
       the state in which the defect was found.

       **Nothing was re-stamped, and that is a refusal with a measured reason.**
       Migrating the five to their wide-equivalent digest at the same commit is
       exact and preserves the row's meaning — and it **breaks its own
       detector**: `stamp_provenance` finds the commit that INTRODUCED a digest,
       so a migrated stamp would be introduced by the migration commit, where
       the source has since moved, and all five would re-read `orphan`. A fix
       whose own verification turns worse is not a fix. The durable form is
       283.2.

       **The four arms on `table-toolbar` itself, all clean.** (1) The ledger
       says "unscored in DSA" and `dsa-scores.json` carries no `table-toolbar`
       entry — consistent, and the page renders no stale *"Not yet scored"*
       block, which is 176.1's defect re-checked rather than assumed. (2) The
       wrong-choice clause is present and load-bearing: *"Do not add either to
       a read-mostly list"*, with the cost named (the table collapses to one Tab
       stop). (3) `PAGE_ONLY_BEHAVIORS` reconciles — the script's own assertion
       that the page imports `initTableToolbar` and `initDataGrid` passes, and
       the documented exclusion of `initDataTables` still holds. (4) The page's
       runtime claims are covered by `check:claims`, green in the gate run
       below. **No blind re-score was run, and that is deliberate**: §3b step 4
       exists so a round cannot mark its own homework, and this round changed
       nothing on the surface, so there is no score to mark. Recorded as a call,
       not an omission.

2. [x] **283.2 — DONE 2026-09-05 (cloud wake). The revision is recorded as an
       OPTIONAL suffix, seven rows migrated, and the item's own premise was
       half wrong: two of the orphans are not formula casualties at all.**

       **Dispatched by rule 4**, and the hand-off said rule 4 would not reach
       this item — *"rule 4 takes the oldest, and the nine older ones are all
       owner-blocked"*. **That reading is refuted by measurement.** Across all
       **917** revisions of `ROADMAP.md`, the oldest open item — Slice 15's *AT
       runtime evidence*, permanently owner-blocked on a human listening to a
       screen reader — has **never** been ticked `[x]`, while the loop log
       carries **573** `Continue` rows. If a blocked oldest item stopped rule 4,
       rule 4 could not have dispatched once in the life of this repo. It skips
       blocked items and takes the oldest *dispatchable* one, exactly as its own
       173.2 bullet describes.

       ```
       for sha in $(git log --format=%H -- ROADMAP.md); do \
         git show $sha:ROADMAP.md | grep -F 'AT runtime evidence'; done | grep -c '\[x\]'   # 0
       grep -c ' · Continue · ' .roundtable/loop-log.md                                     # 573
       ```

       **What shipped.** The `src` cell is now `<digest>` or
       `<digest>@<revision>`; `stamp_provenance` and `--audit-stamps` verify a
       suffixed stamp by ONE equality at that revision instead of searching;
       `--restamp SURFACE --at REV` performs the migration mechanically; and
       `--verify-stamps` runs advisory from `record_iteration.py`.
       `--check`: **12 re-queues with 6 uninformative → 10 with 0**.
       `--verify-stamps`: **7 → 0**. `--audit-stamps`: **2 DEAD → 0**.

       **THE REVISION CANNOT BE MANDATORY, AND THE ITEM ASSUMED IT COULD BE.**
       `--stamp` runs at the END of a round, which is BEFORE that round's
       commit, so the revision its digest describes does not exist yet.
       Measured over the 21-row ledger: every stamp that reproduces anywhere
       reproduces at the commit that **carries** it — **18 of 18** — and at that
       commit's parent, which is HEAD as `--stamp` saw it, **0 of 18**. A `@rev`
       written by `--stamp` would record the one revision the measurement rules
       out, on every row.

       > **CORRECTED 2026-09-05 by Slice 285.1 (Objective grill of 281/283/284).
       > The parent half of that measurement is wrong: it is 16 of 18, not 0 of
       > 18.** The `18 of 18` stands. What does not is `0 of 18` and the "on
       > every row" it carries — 16 of the 18 carrier commits never touched
       > their surface's own source (a NO-OP round commits the ledger and the
       > roadmap, not the CSS), so the digest at the parent is identical and a
       > mandatory `@HEAD` would have been RIGHT on those 16. Only `byline` and
       > `icon` — the two rounds that edited their surface in the same commit —
       > differ at the parent. **The decision to keep the suffix optional
       > survives on a different ground**, now recorded in `parse_stamp`:
       > `--stamp` cannot know whether the round will still commit a source
       > change, so it cannot write a revision it can *guarantee*, and a wrong
       > suffix is worse than an absent one because it is trusted by one
       > equality instead of searched for. See Slice 285 for the commands and
       > the reconciliation. So the suffix is written only where the revision is
       known by construction (`--restamp --at`, `--backfill`) and omitted
       otherwise. **Seven rows carry it, fourteen do not.**

       **283.1's refusal was right, and the suffix is what dissolves it.** It
       refused re-stamping because *"a migrated stamp is introduced by the
       migration commit and would re-read `orphan`"* — true, and confirmed:
       reconciling the two implementations row for row gives **6 agree, 5
       disagree, and on every disagreement the lookup is right**, because the
       search cannot resolve a stamp whose digest is not the tree at the commit
       that introduced it. That is the Accept's "disagreement recorded with
       which one is right", and it is the justification for the format rather
       than a wrinkle in it.

       **THE PREMISE WAS HALF WRONG: the two `orphan` rows are a DIFFERENT
       BUG.** The item reads *"every fault in 283.1 reduces to this"*. It does
       not. `data-table` and `pagination` were not orphaned by 276.1's path-set
       widening — `--stamp` ran mid-round and the round then **edited the
       surface's source again before committing**, leaving the stamp describing
       a working tree no commit carries. Proved exhaustively, not inferred:
       every committed blob combination was enumerated — **2** candidate trees
       for `data-table` (only `data-table.css` differs between its commit and
       the parent), **4** for `pagination` — and **none** reproduces the stamp.
       A recorded revision would not have prevented either; what catches them is
       `--verify-stamps` after the commit, which is why that shipped too.

       **The five were four before the work started.** 283.1 measured five
       formula-orphaned rows; `table-toolbar` cleared itself through the
       documented mechanism (a round ending in `--stamp`) in between. Re-derived
       per CLAUDE.md's premise rule rather than carried over.

       **Which rows still re-queue, as the Accept required.** All four migrated
       formula-orphans (`alerts`, `dashboard`, `stepper`, `tree-table`) **still
       re-queue** — their source genuinely moved since their recorded revision.
       So 276.1's orphaning cost *false confidence, not a missed round*, which
       is what 283.2 itself predicted, now measured. The two mid-round rows
       **stop** re-queueing, correctly: their source is unmoved since their own
       round's commit. That is the whole behavioural delta, 12 → 10.

       **Red-proved by injection, both directions.** Widening `source_paths`
       with one extra file — asserted present in the path set the gate reads
       before believing anything — takes `--verify-stamps` to 21 of 21, and the
       verdicts **discriminate**: all **7** suffixed rows report `path-set`
       ("the set this surface is computed over has changed since the stamp was
       written"), all **14** bare rows report an undiagnosed `orphan`. That is
       exactly the contrast the Accept asked for — the new form *says* a
       path-set change happened where the old form cannot tell it from source
       movement — and it reproduces 276.1's silent failure on demand. Injection
       reverted and re-confirmed absent. The advisory wiring was red-proved
       separately by discrimination: clean ledger → no stderr block; one stamp
       corrupted (asserted at exactly 1 occurrence before replacing) → a block
       naming exactly that row.

       **One dead detector was caught and killed inside this item.** The first
       version of the self-explaining `orphan` message asked whether the
       introducing commit touched the surface's own source with
       `git log -1 <rev> -- <paths>`. That form walks **back** from `rev` and
       answers with the newest touching commit at or before it, so it is
       non-empty almost always: it claimed `f57570f4` touched `component/date`'s
       source (it touched none of it) and answered `a098cf85` — a different
       commit — for `6cb26268`. Replaced with `git diff-tree --no-commit-id
       --name-only -r <rev>`, which discriminates: the two mid-round rows get
       the mid-round diagnosis and `date` correctly gets the plain orphan. Found
       by the message disagreeing with a probe taken minutes earlier, which is
       the only thing that ever catches this shape.

3. [x] **283.3 — DONE 2026-09-06 (cloud wake), and the answer is neither branch
       as written: the sufficiency question has an EMPTY DENOMINATOR — 0 Polish
       rounds have run since 283.2, so the advisory check has never had a live
       opportunity to fire. Closed by shipping the self-healing branch instead,
       at the one step whose write lands in the round's own commit. See Slice
       287.** Original text follows.

       **`--stamp` cannot verify its own output, and the fix for that
       is ordering plus an advisory check. Is that enough?** 283.2 shipped
       `--verify-stamps` (advisory, post-commit) and a `LOOPS.md` rule that
       `--stamp` runs last. Both were the affordable fix, and neither *prevents*
       the fault — a round that stamps early still ships a dead stamp and learns
       about it one command later, if whoever is reading stderr notices.
       - **Accept:** either a mechanism that makes an early stamp impossible or
         self-healing (e.g. `--stamp` recording the paths' blob SHAs so a later
         edit is detectable without a commit, or the stamp being written by the
         commit itself), **or** a recorded refusal measuring why the advisory
         check is sufficient — including how many rounds since 283.2 stamped
         early, which `--verify-stamps` now makes countable. **Finding the
         advisory check sufficient is a satisfying outcome**; the base rate is 2
         in the 21 rows this ledger has ever held, both on one day.

       **283.2's ORIGINAL TEXT AND ACCEPT, kept verbatim below** on the
       precedent of Slice 147's owner call — the premise corrections above are
       only checkable against what the item actually said.

       > **the ledger records a digest with no revision beside it, so a
       stamp cannot be audited or migrated without guessing which commit it
       describes.** Every fault in 283.1 reduces to this: the `src` cell says
       *what* the source hashed to and never *when* or *over which path set*,
       so a formula change silently orphans every existing row and the only way
       back is a search over history that can be wrong (`component/date`).
       A stamp that carried its revision would make `--audit-stamps` a lookup,
       make migration after a path-set change mechanical, and make the two
       `orphan` rows self-explaining.
       - **Accept:** a stamp records the revision it was taken against as well
         as the digest; `--audit-stamps` reads that revision instead of
         searching for it, and its verdict for every row agrees with the
         current searching implementation on the tree as it stands **or the
         disagreement is recorded with which one is right**; the five
         pre-276.1 rows are migrated to the current path set at their own
         recorded revision and stop re-queueing unconditionally, verified by
         `--check` reporting them only when their source has actually moved;
         and a red-proof shows the new form catching a path-set change — widen
         the set in a throwaway edit and confirm the audit says so rather than
         reporting every row moved. **Finding that a migration is not worth the
         format change is a satisfying outcome**: record which of the five
         would still re-queue on their genuine source movement (all five have
         moved since their stamp, so the practical cost today may be only the
         false confidence, not a missed round).

## Slice 282 — the twelfth archive sweep, taken 3.5 hours after another wake REFUSED it: 13 slices moved, and the finding is that the five recorded sweep decisions lie on no threshold in either unit — the tenth ran at 3,790 lines / 55.1% and today's refusal came at 5,450 lines / 40.6%, a longer file refused for being a smaller fraction closed (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 281 — Polish round 3 on `data-table`: the `spacing` cite's worked example stopped being reachable by the rule it explains ONE DAY after it was measured, and all three live copies had also dropped the sentence separating the two effects it describes (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 280 — Objective grill of Slices 276, 277, 278, 279: 52 of 54 assertions reproduce, and the two that do not are one sentence apart in a table that measured the tree BEFORE its own fix while describing the tree after it — the two rows it dropped are the two surfaces that same item added (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 279 — Polish round on `scan`: the demo runs, and the finding is that the ONE pattern screen the component's own page points at is the one that never links it back; then reading the counter right after recording found rule 3 has been blind to 12 closed slices for the whole Polish-dispatched era (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 278 — Polish round on `table-toolbar`, the surface every prior round dropped: the two behaviors this page documents as a pair make the grid keyboard-unreachable when they meet — hiding the column the cell cursor sits in strands the grid's ONE tab stop on a `[hidden]` cell (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 277 — Polish round on `pagination`: six cites hold, and the finding is a runtime claim published in four places, asserted in none — `data-load-more-auto`'s only test says it *does not throw* in an environment where the feature cannot exist (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 276 — Polish round on `inline-editing`: every arm on the surface reproduces, and the finding is in step 0's own source map — a surface's source set stopped at CSS, so 31 commits changed a behavior module with nothing to notice (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 275 — Objective grill of Slices 271, 272, 273, 274: 271 and 272 reproduce whole, and all three defects are one shape — a figure the wake's OWN commit moved, read from `HEAD` and published as the commit's state (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 274 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4's finding is that its own instrument measures the wrong box — `LOOPS.md`'s every-wake DISPATCH region grew +300% where the file grew +220%, so the row a sweep reads understates the burden it exists to catch (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 273 — Polish round on `byline`: six cites hold and five arms reproduce, and two findings — the reason `LOOPS.md` records for `dry = 0` was false in the commit that wrote it, and the blind re-score found the page recommending the context its own wrong-choice clause forbids (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty; `HEAD` at `14947d1` with no local `main`) —
ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,877** commits, no `shallow.lock`)
and `git fetch --tags origin` brought all **seven**, so trap 2 did not bite —
the hand-off's instruction to fetch tags explicitly rather than expect either
outcome is what made that a check instead of an assumption. Rule 1: no open P0
— `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and no
open `N. [ ]` item is a P0. Step 1 triaged and committed nothing: no new input.
Rule 2 **3 / 4 … ok**; rule 3 **2 / 3 … ok [271, 272]**.

**Rule 4 found nothing dispatchable**, and per `LOOPS.md` 186.2 the kind is
named rather than lumped, each item re-read from `ROADMAP.md` this wake rather
than copied from the hand-off: **owner-blocked** Slice 15, `112.3`, `112.4`,
`249.7` (its own text holds its seed for 249.10), `249.10`-`249.13`;
**browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these)
`249.6`, `249.9`, `249.15`; **agent-blocked** none; **not blocked** none.
Rule 4's own sweep clause did not fire either: `roadmap_scope.py` reads
**837 / 3,689 = 22.7%** closed history, of which **673 lines are the four
targets 236.2 pins to open Slice 249**, leaving Slice 272 alone — one slice,
moved one wake ago — as the whole eligible scope.

Rule 5: `dispatch_status.py` reads `2 wake-date(s) newer … STALE`, so the trend
clause **could not be evaluated** rather than being reported clear. The rule's
SECOND clause (184.2's, "a size budget breached outright") **was** evaluable and
is clear — `check-size.mjs` passed at *139 shipped payload file(s) in 11 budget
bucket(s), 376.2 kB gz total; tightest headroom 110 bytes*
(`css/brand-navy.min.css`), the same reading 268 recorded. Rule 6 fired.

### The pick

§3b step 1: every non-skipped row scores 3, so "lowest score" does not
discriminate and "fewest rounds used" does — **4 rows at `1/3`** against 16 at
`2/3`. 268's rule drops `inline-editing` and `table-toolbar` (no
`dsa-scores.json` entry, so no arm can disagree with them), leaving `byline` and
`pagination`. `byline` taken.

### `byline`'s own six cites all hold

Checked at the source, comment-stripped where the claim is about declarations.

- **typography** *"sizes from `--bo-font-size-sm/xs`; no raw font-size"* — both
  tokens present, **0** raw `font-size` values.
- **colour** *"zero raw colour; name is emphasis ink, remainder secondary"* —
  **0** hex/`rgb(`/`hsl(`; `--bo-color-text-secondary` on the base and
  `--bo-color-text-primary` on `strong, b`, exactly as claimed.
- **spacing** *"zero raw dimension literals — the whole file is tokens"* — holds
  on the unit-bearing reading arm 5 uses. `min-inline-size: 0` is the one bare
  number, and it is **not** a byline literal: the same idiom appears in **16**
  component files. Recorded because it was the round's most promising-looking
  defect and the base rate is what refuted it.
- **interaction: `na`** *"plain markup, no behavior"* — holds on both readings
  the ledger now has: `behaviors.json`'s `byComponent.byline` is `[]` (arm 9)
  and `byline.css` paints **zero** interaction-state selectors (arm 10).
- **content** — the quoted clause renders on the built page (arm 4), and
  `check:wrong-choice` passes at *156 assertions / 80 pages / 1 outstanding*.
- **fit** *"record headers, comments, feed items, audit notes; composes
  `.bo-avatar` rather than owning a disc"* — the opener names all four contexts;
  `byline.css` paints no disc and says so in place.

`byline.css`'s comment also asserts a fact about **another file** — *"Breaking
(listed in the CHANGELOG)"*. It holds: `CHANGELOG.md:1265-1271` carries the
`.bo-avatar` promotion as a **Breaking** entry in those words. It is the only
such cross-file claim in the shipped CSS (`grep 'in the CHANGELOG'` → 1).

### The arms

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` in **0** dist files |
| 3 line-number cites | **0 of 40** — 266's fix has not regrown |
| 8 `interaction: na` pages importing a behaviour | **0 of 16** |
| 9 `interaction` vs declared `@serves` relation | `na`&served **1** (`stepper::initWizard`); 3&served 17; 3&none 7; `na`&none 15 |
| 10 `interaction: na` painting its own state | **1 of 16** — stepper, 3 × `[aria-current` |
| 13 **NEW** — cites naming another component's class | **17/17** resolve against `api.json` |

Arm 9 **reproduces 268's table with breadcrumb's fix applied and nothing else
moved** — `3/none` 6 → 7 and `na/none` 16 → 15, the two cells 269's `na`→`3`
had to touch, with `3/served` unchanged at 17. That is the independent
reconciliation, not the arm's own say-so.

**Arm 9's first implementation returned `served = 0` for all 40**, because it
looked `byComponent` up by CSS class where the file is keyed by component name.
Caught by this repo's own rule — an identical value across many inputs is a
defect in the instrument until proven otherwise — before any verdict rested on
it, and the corrected arm is what the table reports.

### Arm 13, and why its 17/17 is not offered as a gate

Red-proved by injection, the injection confirmed before the red was believed:
renaming `byline · fit`'s `.bo-avatar` to `.bo-avatarr` (asserted absent from
`api.json`) takes the arm 17/17 → **16/17** naming that exact cite. So it can
fail. But resolution is not truth, and the arm's value is in the second
reading, which is a human one: of the three cross-component claims spot-checked,
`progress · fit`'s *"the source names `.bo-stepper`"* holds at
`progress.css:8`, `byline · fit`'s composition holds, and `sidebar-nav · fit`'s
*"composes inside `.bo-offcanvas`"* holds as real DOM nesting on **117 of 165**
built pages — not as file co-occurrence, which is the weaker reading this
repo has been caught by before. A 100% existence check that distinguishes
nothing today is 94.11's refused gate, so arm 13 is reported, not shipped.

1. [x] **273.1 — the finding: `LOOPS.md`'s reason for `dry = 0` was false in
       the commit that wrote it.** Parsed over **all 30 revisions** of
       `.roundtable/polish-state.md`: `budget_spent = 0` and `dry > 0` count
       **0 in 30 of 30**, so the numeric claim still holds on a denominator
       that has grown from 11. The **reason** does not. It read *"every seeded
       surface landed its clause in one round, so nothing ever got a second
       round to be dry in"* — written in `eb7fd36c` (2026-08-28 16:41:03Z), a
       revision whose own ledger already carried `component/scan` at `2/3`.
       Today **16 of the 20 non-skipped rows carry a second round** — **CORRECTED
       by 275.2 (2026-09-05): 16 is the reading at `d8c9b5d1^`, and this slice's
       own commit `d8c9b5d1` makes it 17**, the seventeenth row being
       `component/byline`, the surface this very round was polishing. The figure
       was read from `HEAD` at dispatch and published as the state of the commit
       that moved it. The conclusion below is unaffected: `dry > 0` and
       `budget_spent` read 0 at all three revisions, so it survives on 17 exactly
       as on 16 — **8** of
       them recorded `NO-OP` on the surface, and `dry` reads **0** on all
       sixteen. So the counter is zero because **no round has ever incremented
       it**, not because no round could — and the two are not the same fact:
       one is structural and needs nothing, the other is bookkeeping that is
       not happening. Stated in both places `LOOPS.md` carried it (rule 6, and
       §3b's Exit), corrected in place rather than appended, because lane 4's
       ratchet reads `LOOPS.md` as accumulating with no cut behind it.
       - **Accept:** the parse is red-proved by injection **(done — a copy of
         the ledger with `byline` set `dry 1` and `pagination` set `3/3`, the
         injection confirmed present in the file, moves the reading from
         `dry>0=0, spent=0` to `dry>0=1, spent=1`)**; and `LOOPS.md`'s wording
         states the property to re-measure, not the value it will have.

**Sent to the owner rather than resolved here:**

2. [ ] **273.2 — §3b step 5 mandates `dry++` on a round whose score does not
       move, and no round has ever done it. OWNER CALL.** The conflict is real
       in both directions and neither side is safe to take unilaterally:
       - **Start incrementing** and the 8 NO-OP rows go to `dry 1`; the next
         no-op on any of them marks it DRY, forfeits its budget, and
         `polish_requeue.py` stops re-queueing it. Within a few wakes that
         empties the Polish lane — which is **exactly what 176.3 refused**,
         on the measured ground that the redundant-looking second rounds are
         the lane that finds the real defects.
       - **Leave it** and §3b step 5 is a written rule that nothing executes,
         which is the shape this repo keeps paying for (`check:resume-charter`
         hardened and demoted 44 minutes apart; rule 5 keeping only its dead
         half for six days).
       - The empirical input the owner should have: of the **8** rounds
         recorded NO-OP on their surface, **6** filed a real defect found
         elsewhere in the same round (231.2, 267.1, 268.1, 269.1, 270.1, and
         tree-table's base-rate correction); **2** — `badge` and `stepper` —
         found nothing at all. So "the score did not move" and "the round was
         busywork" have come apart 6 times out of 8, and `dry` as written
         cannot tell them apart.

         **RE-MEASURED 2026-09-05 (cloud wake): it is now 9 and 7, and the
         figure above was already one short when this hand-off quoted it.**
         `inline-editing`'s round (2026-09-05) filed **276**. The count and
         its instrument, so the next reader re-runs it rather than
         re-deriving:
         `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **9**,
         reconciled against the ledger's own table rows (same nine surfaces:
         alerts, badge, breadcrumb, inline-editing, navbar, progress, stepper,
         tree, tree-table). The two that found nothing are unchanged —
         `badge` and `stepper`. **This corrects the number, not the
         argument**: the ratio moved 6/8 → 7/9 and the conclusion is the same
         one, which is why it is amended in place rather than reopened. The
         figure goes stale on every Polish round, so **re-run the command
         before quoting it to the owner.**

         **It went stale on the very next round: 283 makes it 10 and 8.**
         `table-toolbar`'s round 3 (2026-09-05) is a tenth NO-OP on the
         surface and filed a real defect (283.1), so the same command now
         reads **10** and the ratio is **8/10**. Amended in place for the same
         reason as the line above — the number moved, the argument did not,
         and the two that found nothing are still `badge` and `stepper`.
         Two consecutive rounds now carry an in-place correction of this
         tally, which is itself input to the owner call: a figure that needs
         re-measuring every round is a poor thing to have hard-coded in the
         item that asks the owner to decide on it.
       - **Accept:** the owner picks one of — execute step 5 as written;
         redefine dry as "no score movement **and** no finding filed"; or
         delete the dry exit and say Polish runs until the owner stops it.
         Whichever is picked, `LOOPS.md` §3b step 5 and rule 6 agree with the
         ledger's own columns afterwards, asserted by re-running the parse in
         273.1 rather than by reading the prose.

### §3b step 4 ran, and it is what found the surface's own defect

A second agent was given the surface, the dimension and the rubric text, and —
per 268.2, which is the first round to apply that correction rather than record
it — was told **outright that the built page publishes a prior verdict, that
the published value is not evidence, and to reach its own reading from the page
source and the shipped CSS first**. It returned **3**, quoting the same clause
and naming the same `data-table` alternative.

**The direction of the bias is stated, per 268.2: this re-score AGREES with the
published value, so it is weak evidence for the score itself.** What it is not
weak evidence for is what it found unprompted, which no arm in this ledger
looks at: **the page recommends the context its own wrong-choice clause
forbids.**

3. [x] **273.3 — byline's wrong-choice clause forbids a POSITION while its
       reasoning forbids a PRACTICE, and the framework's own screens sit in
       the gap.** Three artefacts disagree, each measured this wake:
       - The opener says *"**Not inside the cells of a sortable grid**"* and
         draws its boundary at *"whether the reader scans DOWN a column"*.
       - `--compact`'s rationale said *"for dense feeds and table cells"* — in
         the docs heading **and in the shipped CSS comment the docs derive
         from**, which is the half that made it more than a typo. **FIXED this
         wake**, on a base rate rather than an opinion: of the **21** markup
         uses of `bo-byline--compact` in the repo (8 kanban, 5 notification,
         4 po-app, 2 report, 1 role-home, 1 its own page), **0** are in a
         `<td>` or `<th>`. The modifier's stated purpose named a context
         nothing used and the opener forbids.
       - **Still open:** `.bo-byline` appears inside a table cell on **2** built
         pages — `/patterns/settings-admin` and `/components/avatar`, whose demo
         is headed *"In context — assignee column"*. Both are a **name + avatar
         only**, so neither commits the packing the opener's reasoning actually
         objects to (*"actor and timestamp into one cell buries the value that
         differs inside two that repeat"*) — but both are squarely inside the
         position its headline forbids, and a reader following the clause would
         conclude the avatar page's own exemplar is wrong.
       - **Accept:** each of the two either changes, or the opener records in
         one line why a single-value name cell is not what the clause rules out
         — written so that finding the clause CORRECT as it stands is a
         satisfying outcome, not an off-plan one (149.1's shape). Whichever is
         chosen, `check:wrong-choice` still passes and the clause and the two
         screens no longer contradict each other, asserted by re-running the
         `<td>`-containing-`bo-byline` count over `dist` rather than by reading
         the prose.
       - **RESOLVED 2026-09-05 (cloud wake): the CLAUSE changed, not the two
         screens.** The premise was re-measured before it was acted on, per
         CLAUDE.md's premise rule, and it reproduces exactly: a jsdom parse of
         all **137** built pages finds `.bo-byline` on **10** of them and inside
         a real `td`/`th` on exactly **2** — `/components/avatar` (2 cells) and
         `/patterns/settings-admin` (3 cells), **5** cell-borne bylines in all,
         every one of them a name plus `__avatar` and nothing else. The probe
         is **red-proved by discrimination, before any real count was read**:
         the same selector returns 1 on a byline inside a `<td>`, 0 on one
         beside a table, and **0 on an escaped `<pre>` sample** — which is why
         it is a DOM parse and not a grep, since the copy-paste blocks on both
         pages carry `&lt;td&gt;` as text and a grep would have counted them.
       - **Why the clause and not the screens.** The two cells are the
         framework's own prescribed composition: `.bo-byline__avatar` exists to
         put a disc beside a name, `/components/avatar`'s opener names
         *"assignee columns"* as a use, and its `inTable` sample is the worked
         example. Changing the screens would mean either dropping that
         composition or inventing a second way to spell it — more API to say the
         same thing, which the Objective refuses. The headline was the artefact
         that over-reached: its own reasoning objects to *packing* three values
         into one cell, and a single-value name cell packs nothing. So the
         headline now names the practice — **"Not for packing actor, role and
         timestamp into a grid cell"** — and one added sentence names the
         exception and links it to `avatar`.
       - **Asserted against the BUILT artefact, not the diff.** After a clean
         rebuild: the old headline appears in **0** files under `dist` (it was
         also quoted in `dsa-scores.json`'s `content` cite, which is why 0 and
         not 1 — the cite was updated in the same commit rather than left
         quoting a string the page no longer carries), the new headline in
         exactly **1**, the exception sentence in exactly **1**. The
         `<td>`-borne count re-run after the change is **unchanged at 2 pages /
         5 cells**, which is the point: nothing moved on those screens, the
         clause stopped contradicting them. `check:wrong-choice` passes
         (**156** assertions, 37 components carry / 1 outstanding / 3 exempt)
         and `check:dsa-scores` passes (**360** assertions), so the
         `content = 3` cross-check still agrees with the reworded clause.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. The rendered
         change is one bolded clause and one added sentence inside a single
         `<p class="demo-note">` on `/components/byline`, plus the `content`
         cite `DsaScore.astro` renders on that same page. `check:layout` (390px
         and 150% zoom), `check:scroll` and `test:axe` all pass over it, so
         nothing overflows and nothing is unreachable — but **whether the longer
         opener reads well at 390px was seen by nobody.** That is the residue a
         LOCAL wake would close.

**This round is therefore NOT a NO-OP on its surface**, which matters for
273.2's tally: it belongs with the rounds that found a defect *on* the thing
they were scoring, not with the 8 recorded NO-OP, and it leaves those figures
unchanged.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The change to a rendered surface
is **two lines of text** — one `<h2>` on `/components/byline` and one CSS
comment, which postcss strips, so no `.min.css` byte moves. Overflow at both
widths is covered by `check:layout` (390px and 150% zoom) and `check:scroll`,
both run below; **whether the shortened heading looks right at 390px was not
seen by anyone**, and that is the residue a LOCAL wake would close.

## Slice 272 — the eleventh archive sweep, dispatched from inside rule 4 with rule 4 finding nothing else: 17 slices moved, and reading the four 236.2 refuses found that NONE of them is named by an amend clause — all four are provenance citations, and they stay put anyway (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 271 — `check:slice-refs` reaches the whole tracked tree: the fix for 270.1 is a DENYLIST, because an allowlist that omits a type nobody remembered *is* the defect — and reconciling the run line against an independent count found the gate's headline number counting the wrong noun (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 270 — Polish round on `tree`: all six cites hold, and the finding is that `check:slice-refs` cannot see the file extensions the shipped BEHAVIOURS are authored in — 11 slice references are cited from nowhere the gate looks (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 269 — Polish round on `breadcrumb`: all six cites hold, and the finding is that the only two blind re-scores this ledger has ever run that MOVED a score both left the entry's `scored` stamp behind — obeying a rule nothing had written down, and disobeying the one the file's own `$comment` states (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 268 — Polish round on `navbar`: navbar's six cites hold, and a new arm reading the rubric's own `na` boundary finds `breadcrumb · interaction` scored `na` seven hours before the clause that forbids it existed (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 267 — Polish round on `progress`: every arm reproduces, and the finding is in the loop's own step 0 — `polish_requeue.py --apply` reports the size of its argument, not the rows it wrote, and says "ledger updated" over a byte-identical file (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 266 — Polish round on `avatar`: 249.8's 3-line header moved every line-number pointer in the framework, and all four live ones were published or printed while pointing at the wrong line (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 265 — Objective grill of Slices 263, 264: both slices' own numbers reproduce, and both defects are in what shipped BESIDE them — a gate header that still encodes the declaration its own slice corrected, and an entity decoder consolidated everywhere except the one place a reader could see it missing (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 264 — 249.9's last no-JSON-key badge: which component a behavior serves is now declared, and the first declaration written from the headers' prose was wrong about one of the 26 (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 263 — Standardize sweep: all five lanes clean again, and the finding is again from none of them — three HTML-entity decoders in one directory, disagreeing on 8 of 11 inputs, where the fix one copy credits to a grill is exactly what makes it wrong on the mirror case (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 262 — 249.7's one banked gap measured against its own base rate: the symmetry gate is refused, and what survives is a hole in Dropdown's own wrong-choice clause (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 261 — 249.9's "no JSON key exists" is false, and the key it asked for is an inversion of one this repo already ships (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 260 — 249.15's tag half split out and landed: every built page now says what a shared link should show, and the three equalities are what makes the arm able to fail (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 259 — 249.9's two Accept clauses answered before the page is built: the miniature mechanism the item names does not exist, and two of its seven badges trace to no JSON key (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 258 — Objective grill of Slices 256, 257: 58 of 62 assertions reproduce, and two of the four that do not are the same defect the grilled slice records one item earlier — a real count of a set the sentence does not name (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 257 — Standardize sweep: all five lanes clean, and the finding came from none of them — the default-label rule was hand-copied into the scaffolder by the wake that introduced it, kept in sync by a comment, after it had already drifted once (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 256 — Objective grill of Slices 249 (.2/.3/.4), 254, 255: 57 of 60 assertions reproduce, both that do not are counts of the WRONG SET — a label group read as a browser floor and a width that is a platform scrollbar — and writing the report tripped a gate whose own comment exempts the file it fired on (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 255 — Standardize sweep: all five lanes clean, nothing to consolidate — lane 4's regrowth signal is 22.1%, well under the 55.1% that dispatched the tenth sweep three days ago, and lane 5's only two-count pair is a false positive by arity (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 254 — 249.16 built: the README screenshot, taken in the lane a cloud wake cannot reach — and the image that reads best is NOT the one the page shows (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 253 — Objective grill of Slices 247, 249, 252: 31 of 34 claims reproduce, and all three that do not are citations about citations — including one in the slice whose whole subject is citation decay (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 252 — Standardize sweep: lanes 1-3 clean a TWELFTH time, lane 4 dispatched the tenth archive sweep (13 slices, the largest single move since 228.1), and the fifth lane found the BCD walk hand-copied into both floor scripts (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 251 — 247.1 built: every live `file:line` citation into a rewritten/regenerated file is already self-documenting, and the one actual defect was in the handover file's own drift, not the roadmap's

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 250 — Objective grill of Slices 244, 245, 248: 28 of 28 claims reproduce, both red-proofs executed live, and the append-only citation-stability property survived an intervening rebase it could not have anticipated (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 249 — Triaged from an external docs-adoption-surface proposal (2026-09-03)

**Input**: a 16-item proposal comparing this repo (`5b3ab697`) against
`DibbayajyotiRoy/RoyUI@0e29468` plus eight reviewer notes, covering the "first
thirty seconds of contact" gap: bundle-size budget, page metadata, terminology,
maturity labels, a "choose your path" router, README, install commands, docs
recipe ordering, generated taglines, a visual catalogue, DESIGN.md's split, a
stability field, an outward "not for you" page, plus three open owner
questions and a lane of refusals. Full triage:
`.roundtable/grill-adoption-proposal-2026-09-03.md`.

**Every citation that a verdict depended on was re-run against the live tree
before trusting it**, per this file's own "a number you report is
load-bearing" rule — not read off the proposal's own text. Two did not
survive:

- The terminology-table item's own worked example was **backwards**:
  cited `components/offcanvas.astro` as missing the word "drawer"; the page
  actually uses "drawer" as its dominant vocabulary (15+ occurrences across
  headings, IDs, prose, and its own wrong-choice clause). No gap exists
  between the two cited pages.
- An "incidental" browserslist-vs-derived-floor mismatch is **not a
  defect** — `derive-floor.mjs`'s own header states it is deliberately
  independent of browserslist, computed from shipped CSS via BCD precisely
  because a hand-typed floor was once wrong. A derived floor one minor
  version above the declared browserslist target is the expected
  relationship. Refused as 94.11 ceremony — the predicate would be
  near-permanently true.

Everything else re-checked (bundle-size gate absent, page metadata absent,
DSA/floor/AT-evidence sourcing, README's 0 images/0 FAQ, install page's
npm-only, the recipe's demo-first/spec-last gate and its exact source
position, the hand-written sidebar/task-tile arrays, DESIGN.md's length and
dated-section count, the absent stability field) reproduced exactly as
claimed.

1. [x] **249.1 — DONE 2026-09-03. Bundle-size budget gate.**
       `packages/core/scripts/check-size.mjs`, wired into `build` as
       `check:size` immediately before `stamp-readme --check`. Eleven budget
       buckets cover all **139** shipped CSS/JS artifacts; every number is a
       gzip ceiling at current + ~10% headroom.

       **The premise needed correcting first, and the correction shaped the
       design.** "No bundle-size gate exists" is true of 138 of 139 artifacts,
       not of all of them —

       ```
       grep -rn -i budget packages/core/scripts packages/core/package.json .github/workflows
       ```

       returns exactly one enforcement: `build-rf-essentials.mjs`'s
       `RF_BUDGET_KB = 40` (roadmap 126.1), a MINIFIED-byte ceiling on one
       bundle, inline in the script that builds it. It is kept, not replaced —
       it defends an argued membership list, this gate defends transfer
       weight, and they fail for different reasons and read differently. So
       this generalises a precedent rather than inventing one.

       **gzip, against 126.1's explicit argument for minified bytes.** That
       argument (zlib-build drift; the 2026-08-16 CI failure on identical
       source) was about an EQUALITY check on a published string. Every number
       here is a ceiling with ~10% headroom. The claim is not left as an
       assertion that can go stale: the gate recomputes and prints the
       **tightest headroom in the whole table, in bytes**, on every run —
       today 110 bytes, `css/brand-navy.min.css`.

       **Red-proved live, four arms; each injection was confirmed to have
       LANDED before its red was believed.**

       - *per-file* — 2,062 bytes of unique CSS appended inside
         `data-table.css`'s `@layer` block.
         `grep -o 'bo-data-table--probe-' | wc -l` counts **28** in each of
         `dist/css/components/data-table.min.css`, `index.min.css` and
         `rf-essentials.min.css`; `npm run build -w @busy-office/ui` then
         exits 1 **at `check:size`**:
         `data-table.min.css is 2.28 kB gz > per-file budget 2.2 kB`.
       - *unbudgeted file* — a `dist/css/themes/nordic.css` no bucket claims:
         exit 1, the file named. A new shipped artifact must be budgeted
         deliberately, never absorbed by a wildcard.
       - *stale row* — `dist/css/brand-*.min.css` moved aside: exit 1,
         "budget row matched no shipped file". The reconciliation runs both
         ways.
       - *blown total* and *a multi-file bucket declaring no per-file max* —
         `--self-test`, which pins the classifier (14 cases) and the
         comparator (5) through the ONE `bucketOf`/`findBreaches` pair the
         real run uses, per check-rf-floor.mjs's lesson.

       **What the item did not name, and it decides the design: a
       group-total-only gate would have been GREEN on exactly the injection
       the Accept prescribes.** 2 kB of source CSS is **+0.37 kB gz**.
       `css/components/*.min.css` went 24.75 → 25.12 against a 27.3 budget,
       and `css/index.min.css` 15.10 → 15.53 against 16.7. Only the per-file
       arm fired. So both arms ship, and a bucket holding more than one file
       that declares only a total is itself a gate failure: a total alone lets
       one component balloon while its neighbours shrink, and a per-file max
       alone lets ten new components each land just under it.

       Current tree: 139 payload files, **371.7 kB gz** total. Not budgeted,
       with counts printed every run so the exemption cannot grow quietly:
       8 `.json` (build-time data, not per-page browser payload) and 31
       `.d.ts` (types, stripped before anything ships).
       - **Accept:** met. Fails on injection (four arms above), passes on the
         current tree, and raising a budget is a one-line diff — measured,
         not asserted: changing `css/components/*.min.css`'s `max` from 2.2 to
         2.4 produces a diff of exactly **-1/+1**.

2. [x] **249.2 — Per-page metadata: description, sitemap, robots.** `Gallery.astro`
       gains a required `description` prop (new `check-page-shape` arm fails a
       page without one); `@astrojs/sitemap`; a one-line `robots.txt`; one
       static OG image site-wide.
       - **Accept:** `grep -L 'name="description"' dist/**/*.html` returns
         empty; `dist/sitemap-index.xml` lists every built page; `check-links`
         stays green.

       **Baseline, measured before the change:** `grep -rl 'name="description"'
       dist --include='*.html' | wc -l` read **1 of 165** — the landing page,
       which has always hand-written its own `<head>`. Every other page was
       described to a search result by whatever an engine guessed from its
       body. The criterion was not vacuously true.

       **The Accept's glob over-reaches its own subject, and it is met over the
       page set this repo already defines rather than over the glob** — stated
       here rather than quietly narrowed. `dist/**/*.html` is 165 files; the
       built DOCS pages are **127**. The other 38 are two sets, and neither
       should carry a description:
       - **10 redirect stubs** (`<meta http-equiv="refresh">`). `dist-pages.mjs`
         has excluded them since the 2026-08-18 sweep — there is no content on a
         page whose only job is to bounce the browser — and the sitemap filter in
         `astro.config.mjs` now excludes the same ten, derived from that file's
         own `redirects` object so the two cannot drift. Describing a stub for
         indexing points a crawler at a page that is not a destination.
       - **28 `suite/` pages.** An app, not documentation, copied in by
         `copy-suite.mjs` *after* `astro build`, with its own gates
         (`npm run suite`). `dist-pages.mjs` carries the reason. Closing this
         half means threading a description through `_shell.mjs`'s `page()` and
         authoring 28 more — a second chunk of comparable size on a different
         app — so it is **249.14**, not an extra commit here.

       So the property verified is *every built docs page describes itself*, and
       `check-metadata.mjs` asserts it over `distPages()` — the one definition of
       "a built docs page" four gates converged on. **127 of 127**, up from 1.

       **The sitemap check is a reconciliation between two INDEPENDENT
       derivations, which is the only reason it can fail.** `@astrojs/sitemap`
       builds its list from Astro's route table; `distPages()` builds its by
       walking `dist/` for `index.html`. Generating the sitemap here from
       `distPages()` — the cheaper design, and the one first considered — would
       have made the gate compare a list against itself: green whatever broke,
       and precisely CLAUDE.md's *reconcile against the source, not against the
       argument*. The two sets agree at **127 = 127**, each reaching the same two
       exclusions separately.

       **Red-proved, injection confirmed before the result was believed** (six
       arms, each verified to have landed — a count grepped, a DOM read, or the
       thrown message itself):
       - *source page with no description* → `check-page-shape` fails naming
         `components/badge.astro` (confirmed: `grep -c 'description=' ` → 0).
       - *the required prop* → `astro build` throws
         `Gallery: page "Badge" (/components/badge/) needs a description prop…`.
       - *built page with the tag stripped* → `metadata check FAILED — 2 of 133`
         (confirmed: the meta count in the BUILT file went 1 → 0).
       - *two pages sharing one description* → fails naming both URLs. This arm
         exists because arm 1 passes in full on 127 identical descriptions,
         which is the copy-paste failure a 127-file bulk edit actually has.
       - *a built page missing from the sitemap* → fails (url count 127 → 126).
       - *a sitemap URL with no built page* → fails (127 → 128).
       - *`robots.txt` pointing elsewhere* → fails. `robots.txt` is static, so
         the published URL is spelled there a second time and cannot import
         `SITE_URL`; the answer to a copy this repo cannot delete is a gate that
         reconciles it, so the line must equal `SITE_URL + /sitemap-index.xml`,
         not merely look like a sitemap URL.

       **The bulk edit was verified against the RENDERED artefact, not the
       diff** (CLAUDE.md's rule, and its worked failure was labelling rows with
       other rows' names). Each of the 116 built pages was paired against its
       OWN `<title>` and its intended description: **116 of 116**. The first run
       of that probe reported 104 and eleven "mismatches" — every one its own
       entity handling (`&` renders as `&amp;`) plus an `index.astro` path built
       as `patterns/index/index.html`. An instrument's first output is not
       evidence; the descriptions were never wrong.

       **Not verified, and named rather than implied:** this was a cloud wake,
       so the 1440/390 light-and-dark screenshot lane could not run. Nothing in
       the diff renders differently — a `<meta>` tag, two XML files and a
       `robots.txt` have no visual surface — and `check:layout`, `check:scroll`
       and `test:axe` swept all 127 pages at both widths green.

       **The OG image is NOT done.** It is a rendered image, which a cloud wake
       cannot author honestly. Split out as **249.15** rather than left implied
       by a ticked box.

       Also landed, because it was smaller than explaining: the published URL
       was spelled out in `gen-llms.mjs`, `check-published.mjs` and
       `ai-assistants.astro`, and the sitemap needed a fourth. All three now
       import `SITE_URL`/`SITE_ORIGIN` from `paths.mjs`. Split in two because
       Astro joins `base` onto `site` itself, so handing it the full published
       root emits `/busy-office-ui/busy-office-ui/` — checked against a real
       `DOCS_BASE=/busy-office-ui` build, where the 127 sitemap URLs come out as
       `https://busy-office.github.io/busy-office-ui/…` exactly.
       - **Accept:** met, against the page set named above. All 17 CI entry
         points, re-derived from `ci.yml` rather than read off `ENVIRONMENT.md`'s
         snapshot, ran green in this container.

3. [x] **249.3 — Maturity labels with a real source. DONE 2026-09-03 (cloud
       wake).** Per component page: DSA-scored date (`dsa-scores.json.scored`),
       introduced-version, per-component floor, AT evidence rendering "none
       recorded" until the owner-blocked item closes (Slice 15's open `AT
       runtime evidence` row). A `Maturity` section on all 40 components, four
       facts each, every one read from a key.

       **THE ITEM'S OWN MECHANISM FOR "introduced-version" IS REFUTED, and
       that is the finding.** It said *"first tag containing the component's
       CSS file, computed at build"*. Measured before building — CLAUDE.md's
       rule that re-checking a premise is part of the criterion — a tag scan is
       **wrong for 38 of the 40 components**, for three independent reasons:

       - **0.1.0 was published and never tagged.** `git tag --sort=v:refname`
         starts at `v0.1.1`, so the **26** components of the first release
         would each be labelled one version late.
       - **`v0.2.0` is a tag with no release behind it.**
         `npm view @busy-office/ui versions --json` returns
         `["0.1.0","0.1.1","0.3.0","0.4.0","0.5.0","0.6.0","0.7.0"]` — no
         0.2.0, ever. **14** components would have been labelled "introduced in
         0.2.0", pointing a reader at an `npm i` that cannot resolve.
       - **A tag scan keys on a SOURCE path, and source paths rename.** The
         same probe reported `form` UNRELEASED. That was the probe's defect,
         not a fact: `src/css/components/form/` has never held a `form.css` —
         it holds five files — so `<dir>/<dir>.css` misses it at every
         revision. An instrument's first output is not evidence, and this one
         had a plausible story ready.

       So the source is **the published tarballs**, not git: for each version
       the registry serves, the earliest one whose tarball carries
       `dist/css/components/<name>.css`. That is CLAUDE.md's downstream rule in
       a new place — a tag is an *input* to publishing, not the published
       thing. Distribution: **26 at 0.1.0, 15 at 0.3.0, 1 at 0.5.0**, and two
       (`nav`, `record-card`) published once and since removed.

       **Reconciled against an independent derivation before it was trusted.**
       A throwaway probe in the scratchpad and `derive-introduced.mjs --refresh`
       were written separately and agree key-for-key on all 42
       (`JSON.stringify` equality). The record — `packages/core/src/data/
       introduced.json`, committed — is what an offline build reads, because
       neither git nor the registry is reachable from the docs container.

       **What shipped**

       - `packages/core/scripts/derive-introduced.mjs` — `--refresh` (network)
         rebuilds the record from the registry; the default build mode
         reconciles it against the stylesheets the build actually produced and
         writes `dist/introduced.json`, exported as `./introduced.json`.
       - `derive-floor.mjs` gains `perComponent`: the same probe set pointed at
         one component's sheet instead of `index.css`. **9 distinct floors
         across 40 components**, Chrome 99 → 119 — the label is worth printing
         precisely because it is not uniform, and **25** components floor at
         Chrome 99 where the framework floors at 119 — spread across **three**
         distinct labels that agree on Chrome and differ on Firefox/Safari,
         sized **20 / 3 / 2** (read the labels from `floor.json`; they are not
         typed here, per `check:floor`).
         *(Corrected 2026-09-03 by the Objective grill, Slice 256 finding A:
         this said "20 components floor at Chrome 99", which is the size of the
         largest label group, not the Chrome-99 set — 20 + 3 + 2 = 25. The
         command is in that grill; the error flattered the item, since 25 of 40
         is 63% at the framework's oldest floor rather than 50%.)*
         The framework keys are
         **byte-identical** to the pre-change file (`JSON.stringify(rest) ===
         baseline`), so the refactor moved nothing it was not meant to.
       - `apps/docs/src/data/at-evidence.json` — the hand-recorded AT register,
         empty today, naming Slice 15 as the blocker and `test:axe` +
         `check:forced-colors` as what automation covers instead.
       - `Maturity.astro`, mounted from `DsaScore.astro` — which
         `check-page-shape` already requires on every component page, so it
         reaches all 40 without a 40-file regex.
       - `check-maturity.mjs` (`@exact`), wired into `docs build` after
         `check-metadata`: **280 assertions**, 40 components across 39 pages.

       **Ten red-proofs, each with the injection confirmed first.** Four value
       arms by mutating a record without rebuilding (version, floor label,
       score date, AT record) — each failed exactly one assertion and named the
       component. Three structural arms by mutating the built HTML or the
       component set (block deleted, an emptied `<dd>`, a shipped component no
       page documents). Two guards on `derive-introduced` by exit code, not by
       message: an emptied record and a missing record both `exit 1` (checked
       with `>/dev/null; echo $?`, because the first attempt read `rc=0` — it
       was measuring `head`, not `node`). And the two branches live data cannot
       reach were proved by injecting into the record, rebuilding, and reading
       the built page: `button` with no published version renders *"Not
       published yet"*, `dialog` with an NVDA record renders it.

       **The third absence branch is unreachable BY CONSTRUCTION, and the
       injection is what showed it.** Deleting `tabs` from `dsa-scores.json` to
       reach *"Not yet scored"* turned the docs build red at
       `check:dsa-scores` — *"FAIL tabs: the page that renders its score has one
       to render"* — so the page never rebuilt and the probe read the STALE
       artefact and reported the string absent. The rc=1 is the only reason
       that was not filed as a rendering bug. The branch stays, mirroring
       `DsaScore`'s own fallback; it is defensive, not reachable.

       **`check:pseudo` found a real defect, twice, and neither round would
       have looked wrong in English.** Round 1 put the explanations inside the
       `<dd>`s: 9 of the gate's 14 sampled pages overflowed at 390px under
       ≥44% text expansion, every one naming the same expanded sentence at
       495px. Round 2 shortened the values to two words — and the same nine
       failed again, now naming a `<dd>` holding *"None recorded"*: the cause
       was the `<dt>`, because `.bo-kv--rows` is `max-content 1fr` and
       "Assistive-tech evidence" sizes that track. Plain `.bo-kv`
       (`auto-fit, minmax(11rem, 1fr)`) collapses to one column at 390 and
       passes. `check:layout` and `test:axe` were green through all three
       rounds — expansion is the only gate that could see it.

       - **Accept:** met. Every label on every built page traces to a key
         (`check:maturity`, 280 assertions), and each absence renders its
         stated string — two proved by injection, the third forbidden by an
         existing gate as recorded above.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item DOES
         have a visual surface — unlike 249.2 — and the honest statement is
         that its *properties* were swept and its *appearance* was not: no new
         CSS rule ships (the block is `.bo-kv` + `.bo-u-text-muted` +
         `.bo-badge`, all existing), and `check:layout`, `check:scroll`,
         `check:pseudo`, `test:axe`, `check:forced-colors` and
         `check:target-size` all passed across the tree at 1440 and 390. All
         **17** CI entry points, re-derived from `ci.yml`, ran green here, plus
         a `DOCS_BASE=/busy-office-ui` build (both new links carry the prefix).

4. [x] **249.4 — README: stamped gate count, who-for/not-for, FAQ.**
       *(The screenshot half is split out as 249.16 — see below.)*
       `derive-readme-facts.mjs` derives three repo facts into the committed
       record `packages/core/src/data/readme-facts.json`, and
       `stamp-readme.mjs` stamps them into both READMEs as `stat:gates`,
       `stat:notfor` and `stat:faq`.

       **TWO of this item's three source premises were false, and were measured
       before anything was built on them.**

       *Worth naming, because this slice's own header says every citation a
       verdict depended on was re-run against the live tree:* what that sweep
       covered on this item was the **README side** — "README's 0 images/0 FAQ",
       which reproduces exactly. The three counts the item's *mechanism* rested
       on are on the **source side** (`scope.astro`, `troubleshooting.astro`,
       the gate files), and none of them was in that list. Two were wrong. A
       re-check of the evidence for *whether* to build something does not cover
       the figures describing *what to build*, and the header reads as though it
       did.

       Commands, so the next wake re-runs rather than re-derives:

       ```
       ALL=$(find . -name 'check-*.mjs' -not -path './node_modules/*' -not -path '*/dist/*')
       grep -l -- '--self-test' $ALL | wc -l                              # 48
       grep -lE "argv.*includes\(['\"]--self-test" $ALL | wc -l           # 18
       grep -c 'Not for' apps/docs/src/pages/getting-started/scope.astro  # 0
       grep -cE '<h[1-6][ >]' apps/docs/src/pages/getting-started/troubleshooting.astro  # 3
       ```

       - **"count of `check-*.mjs` carrying `--self-test`" is the detector
         CLAUDE.md already records as unable to fail.** 48 gate files contain
         the literal string; only **18** contain the `process.argv` branch that
         runs one — because the tag text itself says *"Carries --self-test"*.
         Stamping the stated predicate would have published **48**, or **49**
         after any gate that merely mentions it. So nothing here re-counts:
         `check-selftests.mjs` now exports `scanGates()` and the deriver imports
         it, because a second regex over the same tree is a copy of a known trap.
         The published figure is **51 gates, 18 heuristic**.
       - **"the existing two 'Not for' clauses from `scope.astro`"** — `grep -c
         'Not for'` on that page returns **0**. It carries an `In scope` list of
         5 and a `Not in scope — decided, not forgotten` table of **7**; neither
         is spelled "Not for". The 7 table subjects are what shipped.
       - **"the five `troubleshooting.astro` headings"** — that page has **3**
         headings (2 `<h2>`, 1 `<h3>`), and its substance is an **11-row symptom
         table carrying no heading at all**. Shipped as the 11 entries plus the
         two `<h2>` questions.

         Two things measured against the BUILT page rather than assumed, with
         one command —
         `grep -oE '<h[123][^>]*>[^<]{0,70}' apps/docs/dist/getting-started/troubleshooting/index.html`:
         the built page carries **3** `<h2>`, the third being `Related`, the
         layout's own footer heading. So the deriver reads the SOURCE page, not
         the built one — parsing the built page would have counted layout chrome
         as an authored question, which is the failure CLAUDE.md's instrument
         section records. And **no heading carries an `id`**: raw `<h2>` in a
         `.astro` file gets no auto-slug, so the README links to the page, not
         to an anchor. Add ids first if a deep link is ever wanted.

       **Context safety, the trap `check:rtl` already paid for.**
       `stamp-readme --check` runs inside `npm run build -w @busy-office/ui`,
       which builds in contexts that copy only `packages/` (the po-app consumer
       image). So the deriver refuses to re-derive when an input is absent: it
       names each missing input on stderr, says the record was NOT rewritten and
       NOT verified there, leaves the record untouched, and exits 0. Verified by
       building a real packages-only tree and running both modes in it. The
       record lives in `src/data/`, not `dist/` — `files` ships `dist` only, so
       the tarball stayed at **183 files**.

       - **Accept (property, not prediction):** `npm run check:readme-facts`
         agrees with the repo and `stamp-readme --check` agrees with the record,
         both wired into `build`; each derived fact is red-proved by injection
         with the injection confirmed to have landed.
       - **Red-proofs, all with the injection verified before the verdict was
         believed:** (a) a row added to `scope.astro`'s table → `--check` red
         naming `notfor`; (b) a real gate file added → 51 → 52, `--check` red
         naming `gates`; (c) **the discrimination proof** — a prose mention of
         `--self-test` added to a gate that lacked the string, confirmed to move
         the literal count **48 → 49** while the argv count stayed 18 and the
         derived fact did **not** move; (d) a heuristic gate stripped of its
         argv branch → the deriver refuses to stamp at all rather than publish a
         count for a tree failing its own meta-gate; (e) each of the three
         markers corrupted in turn in both READMEs → `stamp-readme --check`
         rc=1; (f) a marker deleted → `requireAll` throws.
       - **Also fixed, found while doing it:** `stamp-readme`'s success line
         hard-coded *"size/behaviors/events"* while checking five stats. It now
         names them from the object.
       - **Not verified, named rather than implied:** this was a cloud wake, so
         the 1440/390 light-and-dark screenshot lane could not run. **No CSS,
         no docs page and no rendered surface changed** — the diff is two
         scripts, one JSON record, `package.json` and two markdown READMEs — so
         there is nothing here a screenshot could have shown. The docs gates
         were run across the tree anyway and are reported with the commit.

5. [x] **249.5 — DONE 2026-09-03 (cloud wake). Install commands for
       pnpm/yarn/bun — ADDED, and executed rather than written.**
       `getting-started/installation.astro` showed npm only, confirmed still
       true at dispatch: `grep -rniE 'pnpm|yarn|\bbun\b'` over `apps/docs/src`
       returned **0 files**, and over the whole repo (excluding
       `node_modules`, `dist`, lockfiles) the only hits were this item, its
       grill row and `STATUS.md`'s copy of it.

       **The refusal was weighed and lost on a measurement, not a preference.**
       The DA the item offers — "the no-bundler audience makes it noise" —
       argues about *bundlers*; the install line is for the npm-ecosystem
       audience, and the page already answers the no-package-manager case in
       its own paragraph two lines below. So the three were added.

       **What made this more than three lines of prose: the page's own opener
       claims everything on it is executed** — *"These steps are executed, not
       just written… If anything here stops working, that build fails."*
       Three unexecuted commands under that sentence would have falsified it,
       so `check:quickstart` gained step 3b, which installs the LOCAL packed
       build with each documented package manager and resolves the same four
       entry points step 3 resolves for npm. Page and gate read ONE list,
       `apps/docs/src/data/package-managers.mjs` — the `MARKUP_RULES`
       precedent (shared by `ai-assistants.astro` and `gen-llms.mjs`), because
       a restated list is a list that drifts.

       **Measured here, all four green** (Node v22.22.2; npm 10.9.7, pnpm
       10.33.0, yarn 1.22.22, bun 1.3.11): each installs the 0.7.0 tarball and
       resolves `css`, `css/reset`, `css/tokens`, `css/components/data-table`.
       Install cost 191–561 ms each; the whole gate runs in **9.2 s**.

       **The red-proof found a real defect, and it is the finding worth
       keeping.** Step 3b's first version put each package manager's directory
       INSIDE the gate's temp dir — which already holds step 2's npm install —
       so Node's resolver walked up into `dir/node_modules` and every
       documented import resolved no matter what the package manager had done.
       The injection (yarn installing `is-number@7.0.0` instead of the
       package) was confirmed present in the file and the gate still passed:
       a detector that could not fail, exactly CLAUDE.md's shape. Fixed with a
       SIBLING temp root; the comment at the `pmRoot` declaration says why, so
       it cannot be "tidied" back.

       - **Accept (property, not prediction):** the page's install commands
         come from the same list the gate executes, and each documented
         command is either run or named as not run.
       - **Red-proofs, injection asserted to land before the verdict was
         believed** (each replacement refused unless it matched exactly once):
         (a) yarn pointed at a different package → red, naming
         `the documented import "@busy-office/ui/css" does not resolve after
         \`yarn add @busy-office/ui\``; (b) bun pointed at a nonexistent
         tarball → red, naming `the documented \`bun add @busy-office/ui\`
         does not install`; (c) a package manager that is not installed →
         **rc=0** with `NOT VERIFIED here — \`no-such-pm-xyz\` is not
         installed in this context` on stderr and in the summary line.
       - **Why (c) reports instead of failing:** bun is not on a stock GitHub
         runner, and a gate that turned CI red for that would be asserting
         something about the runner, not about the package. This is
         `check:rtl`'s precedent for a legitimately absent input — say it was
         NOT verified rather than claim a pass it did not earn. Whether the
         runner carries pnpm/yarn/bun is **not knowable from here**; the gate
         prints which ones it actually ran either way.
       - **Scope limit, stated rather than glossed:** `yarn` here is **1.22.22
         (classic)**, a flat `node_modules`. **Yarn Berry / PnP is NOT
         covered** — it resolves through a zip and no evidence was taken for
         it. The documented command is correct for both; the *verification* is
         classic-only.
       - **Also changed, and caused by this one:** the paragraph below now
         reads *"No package manager?"* rather than *"No npm?"*, since the
         three commands above it are the npm-ecosystem answers. The phrase
         appears nowhere else in the repo (grepped before editing).
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item has
         a small visual surface — one new `<p class="bo-u-text-muted">` with
         three `<code>` spans — and the honest statement is that its
         *properties* were swept and its *appearance* was not: **no new CSS
         rule ships**, the classes are existing ones, and the rendered section
         was read out of the BUILT page rather than off the diff.
         `check:layout`, `check:scroll`, `check:pseudo`, `test:axe`,
         `check:forced-colors` and `check:target-size` passed across the tree
         at 1440 and 390. All **17** CI entry points, re-derived from
         `ci.yml`, ran green here.

6. [x] **249.6 — DONE, Slice 328.** "Choose your path" router, corrected from the proposal's
       own undercount.** The proposal's evidence ("index.astro:118, one
       CTA") undercounted: the page has 2 CTA buttons, 4 nav links and 6
       task-tiles.

       *Corrected by Slice 253's grill, finding C.* This item used to say the
       cited line "is the install snippet". It is not, at any revision: line
       118 is the FIRST of the two CTA buttons
       (`Build your first screen`), line 119 is the second, and the install
       snippet is line **121** — and `index.astro` has not changed since
       `f1be2485`, well before this triage. The proposal's line reference
       resolved; only its count was wrong, so what is refuted here is the
       count, not the citation. The remaining figures reproduce: 2 CTAs, 4
       nav links, and 6 `bo-widget` cards under *"Find it by task"* (a
       descriptive name — there is no `task-tile` class).

       The real gap:
       every existing router (nav, tiles) sorts by *component category*, none
       by *adoption scenario* (add to existing app / new app / CSS-only / with
       behaviours / htmx / custom theme). A six-row block on `index.astro`,
       each row ending in a rendered screen.

       **MEASURED 2026-09-03 (cloud wake), and it re-scopes the item: THREE
       rows lack a qualifying terminal page, not one.** This item said "the
       theming row currently has none". That premise is a wake-old measurement,
       so it was re-run before dispatching, per CLAUDE.md's premise rule — and
       it undercounts the same way the CTA figure did. Against the BUILT tree,
       reading each scenario's natural terminal page:

       | scenario | terminal page | `demo-pair__preview` | pattern links |
       |---|---|---|---|
       | add to an existing app | `/getting-started/installation` | 0 | 1 ✓ |
       | start something new | `/getting-started/first-screen` | 3 | 3 ✓ |
       | CSS only, no JS | `/getting-started/scope` | 0 | 0 ✗ |
       | add behaviours | `/concepts/js-behaviors` | 0 | 0 ✗ |
       | htmx | `/getting-started/htmx` | 1 | 1 ✓ |
       | custom theme | `/concepts/theming` | 0 | 0 ✗ |

       So landing this needs three rendered screens, not one — or three of the
       six rows cut, which leaves a three-row "adoption-scenario router" that
       does not route the scenarios the gap names. **Deciding that is still
       part of the item; what changed is the price.**

       **THE GATE MUST ANCHOR TO THE PAGE'S CONTENT REGION, or it cannot
       fail.** Measured before writing the Accept, per 94.11: the docs shell
       lists every pattern page in its sidebar, so *"the page contains a
       pattern link"* read whole-page is **78–81 on all 31 learning-path
       pages** — a predicate uniformly true, i.e. a detector that cannot fail,
       and exactly the shape `check-learning-path`'s own header records three
       of. Anchored to `<section class="demo"` — the anchor that gate already
       uses — the same predicate reads **17 of 31 (55%)**, so it discriminates.
       The anchor cuts off the opener (`<h1>` sits ~1,000 chars before the
       first demo section), so any ABSENCE it reports must be re-checked
       whole-page before being believed; that is how the three ✗ rows above
       were confirmed.

       **DECLINED BY A CLOUD WAKE 2026-09-03, left open, and this is the
       screenshot sense of browser-blocked** (`LOOPS.md` 186.2's vocabulary):
       three terminal pages must gain a rendered result, and a new six-row
       block lands on the site's front door — evidence that is a rendered
       image a human compares. A LOCAL wake can take it. The measurement above
       is the part a cloud wake could take, and it is banked here so the next
       wake does not re-derive it.

       **DECLINED AGAIN 2026-09-04 (cloud wake), this time at the CLAUSE
       level, which is the question `RESUME.md`'s correction block says to
       ask instead of "is this item browser-blocked".** The answer is that
       this Accept has no separable cloud-takeable half: the arm cannot land
       green until the three ✗ rows gain something, and the two ways to give
       them something are a `Demo` (a rendered screen — `ENVIRONMENT.md`'s
       FIRST list) or a bare pattern link, which would be fitting the page to
       the gate rather than the reader. Choosing between those is this item's
       own open question (*"or three of the six rows cut"*), not a wake's to
       settle by padding. The premise was re-run rather than trusted: all
       three pages still read **0** `Demo` and **0** `/patterns/` hrefs in
       source — `grep -c Demo` and `grep -o "/patterns/[a-z-]*"` over
       `getting-started/scope.astro`, `concepts/js-behaviors.astro` and
       `concepts/theming.astro`.
       - **Accept:** each row's terminal page contains a `Demo` or a pattern
         link **inside its content region**, asserted by a
         `check-learning-path`-style arm that anchors the same way that gate
         does; a row ending in prose alone fails. The arm's red-proof asserts
         the injection landed in the BUILT page before the red is believed,
         and a whole-page reading of the same predicate is recorded beside it
         so a later reader can see why the anchor is load-bearing.

7. [ ] **249.7 — Terminology table, re-scoped after its own worked example
       failed verification.** Drop the offcanvas/drawer pairing (refuted
       above — no gap exists). Before landing `src/data/terminology.mjs`,
       spot-check every remaining seed row (select/dropdown/combobox/value
       help/F4, grid/table/ALV, snackbar/toast/notification,
       master-data/CRUD/maintain, wizard/stepper/guided-procedure) the same
       way A3's citation was checked — against the actual built pages, not
       assumed. Hold the SAP/Fiori-specific rows (value help, ALV, guided
       procedure, F4, message, maintain) for 249.10 (owner vocabulary).
       Three consumers once seeded: a visible "Also called" line under
       `<h1>` (Pagefind-indexed), a `check-search.mjs` `@exact` arm per
       alias, and a glossary in `gen-llms.mjs`.
       **THE SPOT-CHECK RAN 2026-09-03 (cloud wake). Four of the five seed
       rows do not reproduce.** This is the Accept's first clause executed,
       not a new opinion: each row was grepped against the built pages it
       names, the same test that refuted the offcanvas row. Counts are of the
       page's own text (tags stripped), whole-page — the docs sidebar names
       every component, so an anchored reading undercounts, and every absence
       below was confirmed at whole-page 0.

       | seed row | pages grepped | verdict |
       |---|---|---|
       | select / dropdown / combobox | `combobox`, `dropdown`, `form` | **no gap** — the combobox page already reads `dropdown` 3, `select` 44, `autocomplete` 11; the dropdown page reads `select` 39 |
       | grid / table | `data-table`, `tree-table` | **no gap** — `grid` 10, `datagrid` 1, `spreadsheet` 1 on the data-table page |
       | snackbar / toast / notification | `alerts` | **partial** — `toast` 34, `alert` 46, `notification` 3; only **`snackbar`** is absent (0) |
       | master data / CRUD / maintain | `object-page`, `list-report` | **reproduces whole** — all three read 0 on both pages |
       | wizard / stepper / guided procedure | `stepper`, `patterns/wizard` | **no gap** — the stepper page reads `wizard` 1, the wizard page reads `stepper` 4 |

       Three of five are refuted the same way the offcanvas row was: the page
       already carries the alias as live vocabulary. The surviving seed is
       **one full row (master data / CRUD / maintain) and one single term
       (`snackbar`)** — plus `typeahead`, absent (0) from all three of
       combobox/dropdown/form, which no seed row named.

       **So the open question is now a cost question, and it is left open
       rather than settled here:** three consumers — a visible "Also called"
       line under every component `<h1>`, a `check-search.mjs` `@exact` arm
       per alias, and a glossary in `gen-llms.mjs` — built to carry **three
       aliases**. The Objective's less-for-more test is the one to apply, and
       249.10 (the owner's SAP/Fiori column) is what would grow the seed, so
       settling this before the owner answers 249.10 would decide it on the
       thinnest version of the input. **One thing measured here is worth
       keeping either way:** the dropdown page never names or links
       `combobox` in its own content (0 hrefs; the 2 whole-page hits are shell
       chrome), which is a *Related-link* gap, not a terminology one.

       **That clause is SPLIT OUT as 249.19 and LANDED (Slice 262,
       2026-09-04) — do not re-derive it.** Both readings above reproduced
       independently on the built tree, and the wake that took it measured the
       base rate before fixing anything: reciprocal linking is the exception
       at **29 of 97 pairs (29.9%)**, with **55** pairs where the target never
       names the source, so this gap is not distinctive and a symmetry gate is
       refused. The fix landed on a page-local argument instead. **Nothing
       about the terminology table moved** — this item is still the same cost
       question, still waiting on 249.10, and its seed is still one full row
       (master data / CRUD / maintain) plus `snackbar` and `typeahead`.
       - **Accept:** every row's claimed gap is independently reproduced by
         grepping the two pages it names, the same check that refuted the
         offcanvas row **(done — table above; a row that does not reproduce is
         dropped, and finding the seed empty is a satisfying outcome, not an
         off-plan one)**; then, if a table ships at all, deleting a row from
         it turns its search arm red.

8. [x] **249.8 — Component tagline + category, generated from the CSS
       header.** `/* @tagline … @category … */` in each component's CSS
       header, lifted into `api.json` by `extract-api.mjs`. Deletes two
       hand-written lists this repo's own gates already police drifting
       (`Gallery.astro`'s sidebar array, `index.astro`'s task-tile prose) and
       feeds 249.2's description, 249.7's terminology line, and 249.9's
       catalogue cards.
       - **Accept:** a stub component CSS file with the header updates
         sidebar/tiles/llms with zero hand edits on rebuild; omitting the
         header fails the build naming the file.
       - **LANDED 2026-09-03 (cloud wake).** Four directives, two required:
         `@tagline` (30-120 chars) and `@category` (one of eight in
         `extract-api.mjs`'s `CATEGORIES`); `@label` and `@order` optional and
         present only where the derived default is wrong (13 and 40 of 40).
         `api.json` gains `components[…].meta`, `api.categories` and
         `api.nav`; `apps/docs/src/data/component-nav.mjs` builds the sidebar
         groups and the homepage tiles from it, on the `pattern-groups.mjs`
         precedent. The 43-entry hand-written array is gone; 4 documented
         extras remain, each with a reason.

       **The item's premise was re-checked before building on it (CLAUDE.md's
       premise rule) and is half wrong — in the direction that strengthens the
       item.** "Two hand-written lists this repo's own gates already police
       drifting" holds only for the sidebar, and only one-way:
       `check-page-shape.mjs` failed when a component PAGE had no entry, and
       read neither the label nor the group. The tile prose was policed by
       **nothing**: `grep -rc "Find it by task" apps/docs/scripts
       packages/core/scripts` -> **0**, and the single script hit for a tile
       string (`Segmented control`) is a comment in `new-component.mjs`. The
       drift that predicts had already happened — the "Actions" tile listed
       **Combobox**, which the sidebar groups under Data input, and "Money
       field" and "Loading states" were labels no sidebar entry used.

       **Shape, measured rather than assumed:** 43 sidebar `/components/*`
       entries, 40 CSS dirs, **39** page slugs (skeleton + state share
       `state-patterns`; `alert` aliases to `alerts`). The 4-entry difference
       is 2 anchors (`form#dates`, `dashboard#card`) and 2 pages that document
       `data-table` behaviour with no stylesheet of their own
       (`inline-editing`, `table-toolbar`) — none of which has a CSS header to
       carry metadata, which is why they stay written down.

       **A pre-existing blind spot, found by a red-proof that came back
       green.** `check-page-shape`'s sidebar arm lived inside a loop over
       `src/css/components/*`, so `inline-editing` and `table-toolbar` — the
       two pages with no CSS dir — were **never reachability-checked**.
       Deleting the `inline-editing` entry (its mentions in the module went
       1 -> 0, injection confirmed) left the gate GREEN. The arm now walks the
       PAGES: 41 checked, and the same injection fails it naming the file.
       Same shape as the `scan` skip that comment already records.

       **Verified against what it RENDERS, not against the diff** (CLAUDE.md's
       bulk-edit rule). Full `dist` before and after: **45 of ~3,000 files
       differ — and 1 of 138 HTML pages.** That one is `index.html` (the
       tiles, the only intended visible change). The other 44: `llms.txt`
       (new `tagline:`/`category:` lines), `build-id.json` (a per-build
       stamp), and 42 unminified CSS files carrying the new header comment —
       **comment-stripped via postcss, all 42 are byte-identical**, and no
       `.min.css` changed at all. So the sidebar's 39 generated entries
       reproduce the hand-written array exactly, on every page that renders
       it.

       That claim is not vacuous and the check is not dead, both measured:
       a built page carries all **43** `/components/*` links server-rendered
       (`grep -o 'href="/components/[a-z#-]*"' … | sort -u | wc -l` on
       `dist/components/badge/index.html`), and changing **one** `@order`
       (badge 40 -> 5, injection confirmed) makes **41 component pages**
       differ against the same comparison that reports 0 for the real change.

       **Red-proofs, each with the injection asserted before the red was
       believed** — and the first harness was itself broken: `git checkout --`
       restored the *committed* file, which has no header yet, so two "reds"
       were red for the wrong reason. Redone against a real backup: @tagline
       removed (1 -> 0, names the file); `@category "Displays"` (names the
       file and lists the eight legal values); a 14-character tagline (names
       the file and the count); skeleton/state declaring different `@label`
       (names both dirs and the shared page); `@category` dropped from tabs.

       **The Accept's first clause was EXECUTED, not asserted.** `npm run
       new:component -- probe-widget --group=… --tagline=…` touched no shared
       file (`grep -c probe-widget Gallery.astro index.astro` -> 0, 0); after
       a rebuild the probe appeared in the built sidebar of an unrelated page,
       in `llms.txt` with its tagline and category, and — once given a
       category under the 5-name tile cap — in the built homepage tile
       (`Button · Dropdown · Segmented control · Probe widget`). The probe was
       then deleted. Two notes worth keeping: a scaffolded stub still cannot
       complete a full `docs:build` until its page has a wrong-choice clause
       and a DSA score, which is **pre-existing content-gate behaviour, not
       registration**, and no score was fabricated to get past it; and the
       scaffolder's own default label ("Probe Widget") disagreed with the
       extractor's ("Probe widget"), so it stamped a redundant `@label` — two
       derivations of one default, fixed to one.

       **Not verified, named rather than implied:** cloud wake, so the
       1440/390 light-and-dark screenshot lane could not run. 137 of 138 HTML
       pages are byte-identical so nothing there can have moved; for
       `index.html`, the tile cards were measured live in headless Chrome at
       both widths — 6 cards, grid height **281 -> 281** at 1440 and **854 ->
       854** at 390, with two individual cards swapping which is the short one
       (Actions lost "Combobox", Navigation gained names). **A "zero prose
       overflow" reading from that same probe is discarded as a dead
       detector**: a `<p>` shrink-wraps, so 400 unbreakable characters
       (injection confirmed at 400) still read **0**, and it only reached 263
       when the element was artificially clamped. Overflow is covered instead
       by `check:layout` (127 pages at 390 and 150% zoom) and `check:scroll`
       (912 containers x 2 widths), both green. All **17** CI entry points,
       re-derived from `ci.yml`, ran green in this container.

9. [x] **249.9 — DONE, Slice 329.** Visual component catalogue. Depends on 249.8 (tagline) and
       249.3 (maturity labels). `/components/` index: one card per component
       — name, tagline, CSS-only/JS-enhanced/JS-required (derived: component
       classes ∩ `behaviors.json` hooks), DSA score + date, floor, AT line,
       pattern links, a build-time miniature via `browser-harness.mjs`
       (already exists, used today for patterns via `PatternPreview.astro`).
       - **Accept:** every badge on a card either traces to a JSON key **or
         the card renders the absence and names its reason** — 249.3's
         "absence is rendered, never blank", and the audit below says which
         badge is which; the miniature-rendering build-time cost is measured
         and stated before this closes **(DONE — both routes costed below)**.

       **THE MECHANISM PREMISE IS FALSE — measured 2026-09-04 (cloud wake),
       per CLAUDE.md's rule that re-checking an item's premise is part of the
       criterion.** Neither half of "a build-time miniature via
       `browser-harness.mjs` (already exists, used today for patterns via
       `PatternPreview.astro`)" holds:

       - `browser-harness.mjs` has **13** consumers and **0** of them run at
         build time. Every one is a gate or audit invoked separately, after
         `astro build`, against `dist/`. Commands:
         `grep -rln browser-harness --include='*.mjs' --include='*.astro' . | grep -v node_modules`
         → 13; each of the 11 docs names checked against
         `require('./apps/docs/package.json').scripts.build` → **0** present;
         `packages/core`'s own build script matches neither `browser-harness`
         nor `puppeteer`.
       - `PatternPreview.astro` renders **no image and launches no browser**.
         It is a map of **10** hand-authored HTML fragments (of **39**
         patterns) drawn inline and scaled by a CSS custom property.
         `grep -E 'puppeteer|browser-harness|screenshot'` on that file → 0,
         and its own header states the scoping is deliberate: *"only patterns
         whose screens read at tile size get one — a dense list-report shrunk
         to 16rem is grey noise, and a preview that cannot be read is worse
         than text."*

       So "already exists" names a **different mechanism** than the one that
       ships, and the two have opposite cost shapes: the shipped one costs
       authoring per tile and zero build time; the named one costs build time
       and zero authoring. **That scoping sentence is the live design question
       this item now has to answer** — **40** components at tile size (from
       **39** pages) is exactly the case the pattern precedent refused for
       dense screens, and it refused it for **29 of 39** patterns.

       **COST, ROUTE A (the mechanism the item names).** One browser launch
       plus navigate-and-screenshot the first `<section class="demo">` on each
       component page, at 1440x900, against the built `dist/` served by
       `serve-dist.mjs` — i.e. the build step this item would add. Three runs
       in a cloud container; the probe is ad-hoc, not a gate, so the figures
       are snapshots:

       | | run 1 (cold) | run 2 | run 3 |
       |---|---|---|---|
       | browser launch, paid once | 2,337 ms | 259 ms | 243 ms |
       | wall for all 39 pages | **11,640 ms** | **8,013 ms** | **8,022 ms** |
       | median navigate / page | 106 ms | 87 ms | 88 ms |
       | median screenshot / page | 111 ms | 93 ms | 97 ms |
       | PNG bytes emitted | 1254 kB | 1255 kB | 1255 kB |

       So **~8 s warm, ~11.6 s cold, and +1.23 MB in `dist/`** — **8.8%** on
       top of the tree as built here (14,549,590 bytes over 526 files,
       `find apps/docs/dist -type f -printf '%s\n'`). Navigate p90 119 ms /
       p50 88 ms, screenshot p90 131 ms / p50 97 ms; slowest page
       `data-table` at 632 ms cold.

       **The byte column is stated at the precision it was taken, which is
       not the precision it is tempting to claim.** Only run 3's per-page
       bytes were kept (**1,284,734** exactly); runs 1 and 2 are the probe's
       own rounded kB print. So the honest reading is *the three agree to
       within 0.1% while the wall times move by 45%* — enough to reconcile
       the probe as measuring rendering rather than load, and NOT the
       byte-identical claim a first draft of this table asserted from one
       run's JSON.

       **39, not 40, and that reconciles rather than surprising:** `skeleton`
       and `state` share `/components/state-patterns/`
       (`api.pageSlug`), which is the pair CLAUDE.md's recipe already names.
       Every one of the 39 had a `<section class="demo">` — a 100% that is
       structural, not a dead detector: `check-page-shape` requires a demo
       section on every component page, so any other answer would be a gate
       failure.

       **COST, ROUTE B (the mechanism that actually ships).** Zero build time
       and zero bytes; the cost is authoring, and the shipped precedent has
       paid it **10 times in 39** patterns since 2026-08-23. This route has no
       measurable build cost to state, which is itself the answer the Accept's
       second clause wanted.

       **BADGE AUDIT — the Accept's first clause, run in advance against every
       component in `api.json` (n = 40).** Four resolve cleanly; **two trace
       to no JSON key at all** (`pattern links`, and the `JS-required` third
       of the maturity label), and **one traces to a key that is empty for
       every component** (`AT line`) — a distinct case, not a third failure:

       | badge | resolves | source |
       |---|---|---|
       | name | 40/40 *(tautological — the name IS the `api.json` key)* | `api.json.components` |
       | tagline | 40/40 | `meta.tagline` — 249.8 makes the core build **throw** without one, so this is structural |
       | DSA score + date | 40/40 | `dsa-scores.json` (`scored` = a date; 3 distinct: 2026-08-21/23/28) |
       | floor | 40/40 | `floor.json.perComponent` |
       | AT line | **0/40** | `at-evidence.json.components` is `{}`; the file's own `blockedBy` names Slice 15, owner hardware |
       | pattern links | **29/40**, and **no JSON key exists** | only the BUILT pattern pages' "Components used" lists (39 of them); `patterns-index.json` and `patterns.json` contain no such key |
       | CSS-only / JS-enhanced / JS-required | **binary, not ternary** | the intersection is computable; **nothing in the repo distinguishes "JS-required"** |

       Four consequences, each a real change of scope:

       1. **The AT badge is an absence on every card, not on some.** That is
          the state 249.3 built `Maturity.astro` to render, so this is
          designed-for rather than blocking — but a card laid out assuming a
          populated AT line is laid out for a case that does not exist.
       2. **Pattern links need a generator that does not exist, and it cannot
          read `dist/`.** `astro build` runs before every dist-walker in the
          build script, so a page consuming this mapping needs it emitted
          from source beforehand — the shape `gen-patterns-index.mjs` and
          `gen-patterns.mjs` already have, both of which run before
          `astro build` and read `src/pages/patterns/*.astro`.
       3. **11 components are named by zero patterns**: `breadcrumb`, `date`,
          `file-upload`, `icon`, `navbar`, `ordered-list`, `prose`,
          `richtext`, `sidebar-nav`, `tree`, `tree-table`. `date` reading
          zero is the deprecation working (45.3); the rest are the
          zero-reach question 150.1 already says is not automatically a
          defect. A card must render "no pattern uses this" without it
          reading as a fault.
       4. **The stated derivation over-reports, and the obvious fix
          under-reports.** `classes ∩ hooks` reads **23/40** — but
          `approval-workflow` matches on `data-state` alone, a vocabulary
          **6** components share and **6** behaviors hook, and no
          `approval*.ts` exists in `packages/core/src/js/behaviors/`.
          Anchoring the match to the component's own block instead reads
          **20/40** and drops `dialog` and `scan`, which are genuinely
          JS-driven through data attributes (`scan` is the documented
          attribute-only component `check-components-used.mjs` already
          carries an exception for). So one rule produces a false positive
          and the other two false negatives: this badge needs a recorded key,
          not a set intersection.

       **CORRECTION TO THE AUDIT'S `pattern links` ROW — measured 2026-09-04
       (cloud wake), and it is what 249.18 was split out to land.** Two of the
       three things that row and consequence 2 assert do not hold. The **29/40
       reproduces exactly**, from a route the audit did not use, which is what
       makes the rest of the correction believable rather than a second opinion:
       inverting `patterns-index.json`'s per-tile `components` gives 29/40 and
       the same eleven names, character for character.

       - **"No JSON key exists … only the BUILT pattern pages' lists" is
         false.** `src/data/patterns-index.json` has carried the relation per
         tile all along — `groups[].tiles[].components` as `{href,label}` — and
         `gen-llms.mjs:155` already republishes it in `llms.txt` as `uses:`.
         `node -e "const t=require('./apps/docs/src/data/patterns-index.json').groups.flatMap(g=>g.tiles); console.log(t.length, t.flatMap(x=>x.components).length)"`
         → `39 165`.
       - **"A generator that does not exist, and it cannot read `dist/`" is
         false, and it named the answer without recognising it.** Consequence 2
         describes building a generator "the shape `gen-patterns-index.mjs` and
         `gen-patterns.mjs` already have, both of which run before `astro build`
         and read `src/pages/patterns/*.astro`" — which is not a shape to copy
         but the script that already does it. The missing piece was the
         **inversion**, a dozen lines over data already in the tree, not a new
         page-parsing generator. That is the whole cost delta this correction
         buys.
       - **The eleven zero-reach names contain one FALSE zero: `sidebar-nav`.**
         `/components/nav` is a registered redirect to `/components/sidebar-nav`
         (`astro.config.mjs`), and `app-frame` and `suite-home` both cite the
         component by that old href — 5 links across the two pages. Matching
         hrefs literally, as the audit did, reads that as an absence.
         Redirect- and anchor-aware, the count is **30/40 reached, 10 zero**;
         the removed name is `sidebar-nav` alone, and the other ten stand. So
         consequence 3's list is ten, not eleven, and a card built on the
         literal reading would have rendered "no pattern uses this" for a
         component two patterns do use — the exact mis-render consequence 3
         warns about, arriving through its own input rather than its layout.

       **What this does NOT change:** the AT badge (0/40, Slice 15, owner
       hardware) and the JS-tier badge (consequence 4 — still needs a recorded
       key, not a set intersection) are untouched, and the deliverable is still
       a catalogue page whose point is rendered miniatures. Only the pattern-
       links badge's data half moved, and it moved to 249.18.

       **STILL OPEN, and browser-blocked in the SCREENSHOT sense**
       (`LOOPS.md` 186.2's vocabulary): the deliverable is a catalogue page
       whose point is rendered miniatures a human compares. A LOCAL wake can
       build it. What a cloud wake could take is measured above and banked
       here so the next wake does not re-derive it.

10. [ ] **249.10 — SAP/Fiori terminology column for 249.7.** Owner
        vocabulary — value help, ALV, guided procedure, F4, message, maintain.
        **OWNER CALL.**

11. [ ] **249.11 — "Migrate an existing admin UI" path.** No page exists.
        Which stack is the entry point decides whether this is one page or a
        pattern family. **OWNER CALL.**

12. [ ] **249.12 — Archival trigger for `ROADMAP.md`.** The archive-sweep
        *practice* exists (Slices 224, 228, 235.2, 237.1 all did one); no
        stated trigger (on slice close? every N slices?) exists. **OWNER OR
        ARCHITECTURE CALL** — low urgency, the sweep keeps happening
        regardless.

**Sent back to the owner rather than dispatched, because the proposal's own
justification doesn't hold:**

13. [ ] **249.13 — Reconsider demo-first/spec-last (the proposal's B1),
        explicitly, not as a ratification.** The facts check out exactly —
        `data-table.astro`'s Markup section is its 18th and last `<h2>`,
        `check-page-shape.mjs` gates the position with test cases proving it.
        But the proposal argues for reversing it as "1 reviewer beats 0
        readers," which misstates the 2026-08-16 decision: that call came
        from comparing four established framework docs sites with zero
        exceptions found for demo-first/spec-last (this file, then
        `CLAUDE.md`, states the comparison explicitly). The proposed reversal
        (Markup moves to position 2, spec tables stay generated-only at the
        end) is a defensible design on its own merits and costs only moving
        one block — but reversing a dated, gated, cross-referenced decision is
        the owner's call to make with the real tradeoff in front of them, not
        something a triage settles by itself. **OWNER CALL**, recommended
        default: keep spec-last unless the owner weighs the new evidence
        against the original four-site comparison and prefers the change.

**Split out of 249.2 while building it, rather than left implied by a ticked
box (2026-09-03, cloud wake):**

14. [x] **249.14 — DONE 2026-09-03 (cloud wake). A description on each of the 28
        `suite/` pages.** 249.2 closed
        `name="description"` on 127 of 127 built DOCS pages; the suite is the
        other 38 minus the 10 redirect stubs, and it is deliberately outside
        `distPages()` (an app, not documentation, copied in after `astro build`,
        gated by `npm run suite`). Every suite page's head comes from ONE place —
        `examples/erp-suite/_shell.mjs`'s `page({ title, moduleId, trail, body })`
        — so the mechanism is one added parameter; the work is authoring 28
        descriptions and threading them from each `*.screen.mjs`. Deliberately
        not folded into 249.2: the mechanism is one line and the content is a
        second chunk the size of the first, which is LOOPS' "an improvement
        bigger than the item becomes a roadmap entry".
        - **Accept:** `npm run suite`'s audit gains an arm asserting every built
          suite page carries a `<meta name="description">` of at least 40
          characters and that no two share one — the same two arms
          `check-metadata.mjs` runs over the docs, red-proved the same way
          (strip one, duplicate one, confirm each injection landed in the BUILT
          file before believing the red). A page whose description is absent or
          shared fails, naming it.

        **Every figure in the premise reproduced before building**, per this
        file's own rule: `find examples/erp-suite -name '*.screen.mjs' | wc -l`
        → 28, the built suite is 28 pages, and
        `grep -rn 'name="description"' examples/erp-suite/` returned **nothing**
        — so it really was 0 of 28. `page()` really is the only head.

        **Shipped:** `page()` takes a `description` and emits the tag;
        `DESCRIPTION_MIN = 40` is exported from `_shell.mjs` and read by both
        the render and the gate, so the floor is one number (the `MARKUP_RULES`
        precedent). 28 descriptions authored one per `*.screen.mjs`; measured
        **105–123 characters**, 28 distinct.

        **The render THROWS rather than defaulting, and that is the load-bearing
        choice.** A default would be a string all 28 share — which passes a
        presence check in full and would satisfy the length arm too; only the
        distinctness arm would catch it, and the render should notice before a
        gate does. `page()` also refuses a description containing `"`, which
        would end the `content="…"` attribute early and ship the rest of the
        sentence as stray markup in `<head>` — present to a grep, broken to a
        consumer.

        **Verified against what it RENDERS, not against the diff.** The
        insertion touched 31 files in one pass, so the assertion run was
        CLAUDE.md's row-label pairing: every built page carries the description
        authored for *that* source file — **28 of 28**, compared value-for-value
        rather than counted.

        **Four red-proofs, each with the injection confirmed before the red was
        believed:** (a) the tag stripped from one built page → confirmed 1 → 0
        tags in the file, gate red naming `/p2p/purchase-order.html`; (b) one
        page's description copied onto another → confirmed the identical
        `content` on both files, gate red naming both; (c) a 13-character
        description → gate red naming the page and the count; (d) source side, a
        screen with its `description` removed and a second with an 8-character
        one → the build itself throws, naming the page in both cases.

        **The fail-fast claim was made true rather than softened.** The first
        version of the comment said a missing description fails in milliseconds
        instead of after 28 screens × 2 widths of axe — but `failures` was only
        reported at the very end, so it did not. The arms now report and exit
        before the browser starts. The trade is stated in the comment: a run
        that trips here shows only these failures, and an axe violation on the
        same screen surfaces on the next run.

        **NOT VERIFIED, named rather than implied:** this was a cloud wake, so
        the 1440/390 light-and-dark screenshot lane could not run. It has
        **no rendered surface** — `<meta name="description">` is invisible, no
        CSS or body markup changed, and `check-erp-suite` confirms the suite
        still ships zero CSS of its own. `npm run suite` swept all 28 screens at
        both widths: zero axe violations, no sideways scroll at 390.

15. [x] **249.15 — DONE, Slice 295.** The one static OG image 249.2 named and did not build.
        Everything else in 249.2 shipped; this did not, because a social preview
        card is a *rendered image a human compares* — `ENVIRONMENT.md`'s first
        list, which a cloud wake cannot take. **browser-blocked in the
        screenshot sense, so a LOCAL wake can do it and a cloud wake should not
        pick it up.** Note the site currently has no `og:` or `twitter:` tag at
        all, so this is the whole card, not just its image.

        **RE-SCOPED 2026-09-04 (cloud wake): the TAG half is split out as
        249.17 and has landed (Slice 260); what is left here is the image.**
        Same split as 249.16 out of 249.4, for the same reason — a derivation
        half was being held behind the one half that needs a human's eyes. The
        premise was re-checked on the BUILT artifact before splitting, per
        CLAUDE.md's premise rule, and it held:
        `grep -rl 'property="og:' apps/docs/dist --include='*.html'` returned
        **0 of 138** built `index.html` files on a full `docs:build` of
        `3e1dac1` (`name="twitter:` likewise 0).
        - **Accept, image half (this item):** every built docs page carries
          `og:image`; the referenced path resolves to a file that exists in
          `dist/`; `check-metadata.mjs` gains that arm and it is red-proved by
          pointing `og:image` at a path that is not there. `twitter:card` moves
          from `summary` to `summary_large_image` in the same change, and
          arm 5's assertion that it is `summary` while no image ships is
          removed rather than left contradicting the new tag. Whether the card
          LOOKS right is the part that needs the local wake's eyes.
        - *(As first written, before the split — the clauses now covered by
          249.17 are struck through.)* ~~every built docs page carries
          `og:title`, `og:description` (agreeing with the page's own
          `name="description"`, asserted rather than assumed), `og:url`~~ and
          `og:image`; the image resolves to a file that exists in `dist/`;
          `check-metadata.mjs` gains the arm and it is red-proved by ~~removing
          the tag from one built page and by~~ pointing `og:image` at a path that
          is not there.

16. [x] **249.16 — DONE, Slice 254.** The one hand-made README screenshot, split out of 249.4.
        One screenshot of `patterns/list-report` at `data-density="compact"`,
        labelled as hand-made in alt text, in both READMEs. **browser-blocked
        in the screenshot sense** (`ENVIRONMENT.md`'s first list, `LOOPS.md`
        rule 4's vocabulary): its evidence is a rendered image a human
        compares, and a cloud wake must not take it. Split from 249.4 on
        2026-09-03 because the other three halves are plain derivation and were
        being held behind it.
        - **Accept:** both READMEs carry ≥1 image; the referenced file exists in
          the repo and, for the package README, inside the published tarball
          (`npm view @busy-office/ui` is the authority on what shipped, not
          `npm pack` — roadmap 185); `stamp-readme --check` still exits 0.

17. [x] **249.17 — DONE, Slice 260.** The `og:`/`twitter:` tag set, split out
        of 249.15 on 2026-09-04. 249.15 is the social CARD; this is everything
        about that card which is not a rendered image, and a cloud wake can
        take it in full — the evidence is `<head>` content in the built
        artifact, which is `ENVIRONMENT.md`'s SECOND list. Split for the same
        measured reason 249.16 was split out of 249.4: the derivation half was
        being held behind the half that needs a human's eyes.
        - **Accept:** every built docs page carries `og:type`, `og:site_name`,
          `og:title`, `og:description`, `og:url` and the three `twitter:` tags;
          `og:title` EQUALS that page's own `<title>` and `og:description`
          EQUALS its own `<meta name="description">`, asserted on the BUILT
          page rather than assumed; `og:url` equals the published URL
          `dist-pages.mjs` derives by WALKING `dist/`, which is a second
          derivation that cannot see the one `SocialMeta.astro` builds from
          Astro's route table; the arm is red-proved twice — a tag deleted from
          a built page, and one page's `og:title` made to disagree with its own
          `<title>` — with each injection confirmed present in the built HTML
          before the red is believed.

18. [x] **249.18 — DONE, Slice 261.** The component→patterns mapping, split out
        of 249.9 on 2026-09-04. It is one of the two badges 249.9's own audit
        found tracing to no JSON key, and it is pure derivation — no rendered
        image, `ENVIRONMENT.md`'s SECOND list — so a cloud wake can take it in
        full while the catalogue PAGE (rendered miniatures a human compares)
        stays with 249.9. Third split of this shape in three days, after 249.16
        out of 249.4 and 249.17 out of 249.15.

        **It exists because 249.9's stated cost for this badge is wrong**, and
        that premise was re-checked before the split rather than inherited
        (CLAUDE.md's premise rule). See the correction block under 249.9.
        - **Accept:** `patterns-index.json` carries a `byComponent` key emitted
          by the same generator that already emits the forward relation, with
          **one entry per component docs page including the ones no pattern
          names** (an absence is an empty array, never a missing key — 249.3's
          "absence is rendered, never blank"); hrefs are resolved through a
          redirect map with exactly ONE home in the repo, imported by both
          `astro.config.mjs` and the build-time reader rather than re-parsed,
          and the resulting reached/zero counts agree with an inversion taken
          independently of the generator; a gate arm re-derives the mapping
          from the **BUILT** pattern pages — a route the source-side regex
          cannot see — and fails when the shipped key disagrees, red-proved by
          injection with the injection confirmed present in the artefact before
          the red is believed.

19. [x] **249.19 — DONE, Slice 262.** The Related-link gap 249.7 banked as
        *"worth keeping either way"*, split out of 249.7 on 2026-09-04. 249.7
        is a COST question about a terminology table and waits on the owner's
        `249.10`; this is the one measurement inside it that is neither
        terminology nor owner-blocked, and it is `ENVIRONMENT.md`'s SECOND
        list — hrefs and prose in the built artifact, no rendered image.
        Fourth split of this shape in three days, after 249.16 out of 249.4,
        249.17 out of 249.15 and 249.18 out of 249.9. The route to it is the
        same one `RESUME.md`'s correction block names: read the clause, not
        the item's label.

        **The banked premise was re-derived independently before acting and
        held** (CLAUDE.md's premise rule) — and then the base rate refuted the
        obvious fix. Reciprocal linking is NOT the norm here: 29 of 97 pairs
        (29.9%), with 55 pairs where the target never names the source, so
        `dropdown`/`combobox` is one instance of a general property and a
        symmetry gate is refused. What justifies fixing this ONE pair is
        page-local: combobox's opener already claims the boundary from its
        side, and dropdown's answered only the too-few-options case. Full
        commands and figures in Slice 262.
        - **Accept:** the dropdown page's own content region links `combobox`,
          in the opener as a wrong-choice alternative and in `Related`, with
          the change argued from that page's own clause rather than from the
          symmetry statistic; the whole-page-versus-content-region readings
          are recorded side by side so a later reader can see why the anchor
          is load-bearing; and any gate proposed off this finding is measured
          for base rate BEFORE it is written, with the refusal recorded when
          the predicate is uniformly true.

20. [x] **249.20 — DONE, Slice 264.** The JS-tier badge's recorded key, split
        out of 249.9 on 2026-09-04. It is the second of the two badges 249.9's
        own audit found tracing to no JSON key — 249.18 took the first — and
        like it, it is pure derivation, `ENVIRONMENT.md`'s SECOND list, so a
        cloud wake can take it in full while the catalogue PAGE (rendered
        miniatures a human compares) stays with 249.9. Fifth split of this
        shape, after 249.16 out of 249.4, 249.17 out of 249.15, 249.18 out of
        249.9 and 249.19 out of 249.7.

        **249.9's consequence 4 was re-derived before the split rather than
        inherited** (CLAUDE.md's premise rule) and reproduces to the number:
        `(classes+dataAttrs) ∩ hooks` reads **23/40**, `classes ∩ hooks` reads
        **20/40** and drops `dialog` and `scan`, and `approval-workflow`
        matches on `data-state` alone — a vocabulary **6** components declare
        and **6** behaviors hook. Two things it did not say, measured here:
        the intersection's false positives are **structural, not incidental**
        (`form` matches 16 behaviors and `button` 5, because behaviors hook the
        shared primitives `bo-input`/`bo-btn` that those components define —
        composition, not a JS requirement); and `scan` declares **zero**
        classes, so no class-anchored rule can ever see it.
        - **Accept:** the relation is DECLARED in the shipped artifact — a
          directive in each behavior module's header, with the core build
          throwing and naming the file when it is missing, empty, or names a
          component `api.json` does not have — and published as a key carrying
          **one entry per component including the ones nothing serves** (an
          absence is an empty array, never a missing key — 249.3's "absence is
          rendered, never blank"); the published hook surface is asserted
          byte-identical to the previous build, because the directive sits in
          the same comments the hook scan reads; and a gate re-derives the
          relation from an INDEPENDENT source — what the BUILT component pages
          claim in their own "JS required" row — and fails when the two
          disagree, with its base rate measured before it is written and its
          red-proof asserting the injection landed in the built page before the
          red is believed.

**Refused, recorded as DA (not re-litigated here — see the triage file for
each item's reasoning):** publish-on-every-push/auto-bump, a `registry.ts`
model for component metadata, thirteen mandatory page headings, hand-typed
stability/tested badges, `COMPATIBILITY.md` as prose, `docs/decisions/`
duplicating `.roundtable/`, per-page generated OG images, a bundlephobia
badge, an npm keyword blob, Preview/Code tabs (already decided, roadmap 118),
search-side query expansion, and framework-owned column persistence.

**Concurred without a new item** (already correctly scoped, or resolved by
an item above): the visual-catalogue and split-DESIGN.md items (B3→249.9,
B4→ not separately filed, folds into ongoing `.roundtable/` practice already
in place — `DESIGN.md`'s Principles-only split and a `CONTRIBUTING.md` are
low-risk and can be built directly without a triage item; flagged here so a
future wake doesn't re-propose it from scratch), and the stability-field item
(B5, folds into 249.8's CSS-header convention once that lands — declaring
`stable`/`experimental`/`deprecated` as a field is a small extension of the
same `@tagline`/`@category` header mechanism, not a separate design).

## Slice 248 — Component-by-component design-grill: 40 of 40 covered, 1 real defect fixed, one instrument caught lying to itself (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 247 — 245.1 built: both of 244.3's counts corrected against a named revision, and upholding the "leave the log row alone" bullet found that bullet's OWN citation pointing at the wrong row (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 246 — 244.4 built: the src/css chokepoint gets its gate, and the design question it carried is answered by a count nobody had taken — there are FOUR chokepoints in this repo, one of them gated (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 245 — Objective grill of Slices 238, 241, 243, 244: twenty-nine of thirty-one published claims reproduce, and the two that do not are ONE item's two counts of one set — six and eight against a tree holding five before and seven after (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 244 — Standardize sweep: all four standing lanes clean, and the finding came from the fifth thing the playbook names — `cssFiles` hand-copied four times, one of them already diverged (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 243 — 242.1 refused: arm 8 does not become a build gate, and neither of the two arguments its Accept anticipated is what decided it — the predicate is unsound in the one direction nobody injected, red-proved by a score that stays correct while the arm goes red (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 242 — Polish round 2 on `component/dashboard`: the seventh recorded defect is the first where the SCORE was wrong, not the cite — `interaction: na` on a component that ships a behaviour, blind re-scored to 3 by a second agent (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 241 — 240.1 closed on its OWN second branch: the chevron's two hex literals are not removable, measured four ways — and the item was never browser-blocked, only its first branch was (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 240 — Polish round 2 on `component/calendar`: six arms clean, and a SEVENTH finds the sixth recorded defect — the one cite in the framework that claims an absence the shipped CSS does not have (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 239 — Polish round 2 on `component/tree-table`: NO-OP on six arms, and the sixth is the class arm 5 structurally cannot see — where 3 of this ledger's 5 recorded defects lived (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 238 — Objective grill of Slices 232, 234, 236, 237: twenty-four of twenty-five published claims reproduce, and the one that does not is the count written BESIDE a premise that was correctly re-run — five archive commits reported as four, at two durable sites (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 237 — Standardize sweep: lanes 1-3 clean an ELEVENTH time, lane 4 dispatched the ninth archive sweep, and the file that sweep writes into was still instructing the opposite of the rule written beside dispatcher rule 4 the day before (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 236 — Objective grill of Slices 232, 233, 234, 235: every published figure reproduces except one, and the two findings are both about what a verification CANNOT see — a corroborating count that measures its own explanation, and a sweep that archived the target of an open item's Accept (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 235 — Standardize sweep: lanes 1-3 clean a TENTH time, and lane 4's finding is that the sweep's own instrument has never had a file — five runs, one copy, living inside an archived slice. Committing it exposed two owner calls no run could see, and the sweep it enabled exposed three self-referential stubs in the archive (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 234 — 232.2's closing measurement is wrong about its own headline: the defect was introduced by 42.1, the commit that WROTE the sentence, and both dispatchers confirmed the opposite from the same single-file probe (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 233 — 231.2's new prose asserts two computed facts and nothing executes either; found by the THIRD independent build of 231.2 (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 232 — Objective grill of Slices 229, 230, 231: 230 and 231 survive entirely, and both findings are against how 229's refusal RECORDED its numbers, not against the refusal (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

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

