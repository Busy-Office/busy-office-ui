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

6. [ ] **292.6 — `icon.css` forbids figures in itself and carries two.** Its
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

7. [ ] **292.7 — four `content` cites score a page property while citing the
       CSS.** Found by 292.3's classification, not by reading. `content` is
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
       - **Accept:** every `content` cite names the page property the score is
         taken on, or states the exemption; asserted by re-running 292.3's
         classifier over the `content` dimension and reconciling its buckets
         against the EXEMPT set, with the finding that a cite is already
         adequate recorded as a satisfying outcome rather than rewritten.
       - **Note:** rewriting a published cite is a scoring judgement, so this
         is Continue's or the owner's, not Polish's — same lane as 292.3.

8. [ ] **292.8 — nothing polices style in a docs PAGE, and 292.3 is what makes
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

9. [ ] **292.9 — 292.4's property is tree-wide and the guard it landed is
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

**Dispatcher trace, cloud wake — and this wake LOST A COLLISION on `287.5`.**
Step 0: container **DETACHED** again (`git branch --show-current` empty),
`ENVIRONMENT.md` trap 1, fixed with `git checkout -B main origin/main` before
any commit; `origin/main` arrived as a **forced update**
(`26447ba...a3bc8fe`). Trap 2 clean in one `--unshallow` (**1,930** commits, no
`shallow.lock`) and it again brought the tags — the **twelfth** consecutive
container, `git tag | wc -l` → **7**. Step 1 triaged and committed nothing:
`list_issues` on `Busy-Office/busy-office-ui` → `totalCount: 0`, no open
`N. [ ]` item is a P0.

**First pass:** rule 2 `0 / 4 … ok`, rule 3 `2 / 3 … ok [286, 290]`, so **rule 4
was reached** and took `287.5`, the one cloud-takeable item. It was built and
verified. Step 0c's mandated `git fetch origin main` *before the first commit*
then found `origin/main` **2 ahead**, carrying the other dispatcher's `287.5` —
the same item, taken deterministically, exactly as Step 0c describes. Discarded
per the accept-collisions decision.

**Re-dispatched on the winner's tree:** their close armed rule 3 to
`3 / 3 … OVERDUE [286, 287, 290]`, and **that is what ran.** Rule 5 read
`3 wake-date(s) newer … STALE`, so it **could not be evaluated** — reported as
such per its own text, never as clear.

**No archive sweep, and this wake reversed its own decision rather than
carrying it.** It began one — 8 slices, `38.1% → 9.4%` — and stood it down on
reading the losing-side hand-off, which had refused the sweep hours earlier with
the numbers and named the trigger it would honour: *"a wake that finds itself
past 5,450 / 40.6% should simply run it."* We are at **5,163 / 38.0%**, below
that in both units. `249.12` — the archival trigger — is an **open owner call**,
so a wake inventing a threshold to justify its own in-progress work is the exact
thing that item exists to prevent. Recorded as a refusal with its numbers.

Full report: `.roundtable/grill-objective-286-287-290-2026-09-06.md`.

1. [x] **291.1 — DONE 2026-09-06. Scope narrowed per §6 step 0, and the armed
       set survives it whole: none of 286, 287, 290 has been grilled before.**

       `285` took Slices 281, 283, 284; `289` took 283.3, 284.2, 288.1/288.2.
       Nothing was dropped, so the honest scope equals the armed set — which is
       not the usual outcome (step 0 exists because 9 of 21 grills covered an
       already-grilled slice) and is worth one line rather than a paragraph.

       **32 of 32 assertions reproduce. No defect was found in any of the three
       slices.** By slice: **290** 21/21 (four lane readings, the region table's
       five rows, and 290.1's four-row discrimination table), **286** 8/8,
       **287** 3/3. Commands and figures are in the report.

2. [x] **291.2 — DONE 2026-09-06. The finding: a 100% is a suspicious number,
       so the pipeline was checked for whether it can disagree at all — it can,
       it disagreed four times, and all four were the GRILL's fault.**

       CLAUDE.md says a 0%, a 100% or an identical value across many inputs is a
       defect in the instrument until proven otherwise. A grill reporting 32/32
       is that shape. The check is that this pipeline **did** produce
       disagreements — four — and every one traced to the probe:

       | # | probe | what made it wrong |
       |---|---|---|
       | 1 | `\b284\b` over open items | matches inside **`1,284,734`**; `\b` is a poor boundary for a number, because a comma IS a word boundary. Falsely reported `249.9` naming Slice 284 against `roadmap_scope.py` |
       | 2 | lane 1 re-derived over `packages/core/src/css` | the slice's own block says `-- apps/docs/src`; read **0 in 0 files** against a true 390 in 79 |
       | 3 | a synthetic "legacy 4-field" log row | its item was a **single token**, so `ROW`'s `([\w-]+)` ate it and the row matched — apparently refuting the load-bearing half of 290.1's refusal |
       | 4 | 286.2's table figures | measured **height** and compared it to a claim about **width**; 202/213/388/756 against 260/310/310/310 |

       Each was fixed by running the slice's stated command, and each then
       reproduced exactly. The needle in #1 is red-proved by discrimination —
       `(?<![\d,.])(2[89][0-9])(?![\d,])` rejects `1,284,734` and accepts
       `Slice 284`, `284.2`, `290.1`.

       **The asymmetry is the point, and it continues 289's finding from the
       other side.** 289 found that all six of its non-reproducing assertions
       *sat beside no command*. Here every published claim had a command and all
       32 held; the four things with no command were the grill's own probes.
       **Re-deriving what to measure from prose is where the error enters** —
       not the slice's measurement, and not the detector.

       Also recorded, because *"reconcile against an independent count"* is
       written here for catching a dead script: in #1 the script was right and
       the reconciliation was wrong. **A disagreement is a signal to
       investigate, never a verdict about which side is broken.**

3. [x] **291.3 — DONE 2026-09-06. One real gap, minor: Slice 290's lane-1 block
       states `in 79 files`, which the command it quotes cannot produce.**

       The quoted pipeline ends `| grep -c ':'` and yields the declaration count
       alone; the file count needs a second command. **The number is TRUE** —
       `git grep -l 'style="' <rev> -- apps/docs/src | wc -l` reads **79** at all
       four revisions — so this is an incomplete command beside a correct claim,
       not a wrong figure. Filed rather than waved off precisely because it is
       the property 291.2 is about: the half of that claim with no command is the
       half a re-deriving wake has to guess at, and guessing is what produced
       four wrong probes here. **Amended in place** in Slice 290's own text, per
       236.2, so a reader reaches the working command rather than this note.

4. [x] **291.4 — DONE 2026-09-06. Recorded, not raised: 287.5's answer was
       derived twice independently, by two dispatchers, and the two `LOOPS.md`
       diffs are BYTE-IDENTICAL.**

       Both name `f57570f4` as the commit that stranded the sentence (here via
       `git log --oneline -S "Either way, close the round with" -- LOOPS.md`),
       and both reject the Accept's no-change branch on the same ground — the
       `9c1bacbe` diff carries the trailing fragment on its `-` side as well as
       its `+` side, so 283.2 only changed *which* paragraph the sentence trails.

       **n = 2 independent derivations agreeing is the strongest corroboration
       in this report, and no single-dispatcher grill could produce it.** Stated
       as what it is and no more: it is not an argument for collisions — Step 0c
       already prices one at a wake's work discarded — it is what this
       particular collision happened to yield, alongside Slice 162's postscript
       that the redundant wake is not pure waste.

**NOT VERIFIED, said plainly:** no screenshots at 1440px and 390px in light and
dark were taken — a cloud wake has no Podman and no `:8081`. None is owed: this
slice changes no shipped surface. Its one *rendered* measurement (286.2's
re-take, §C of the report) is layout geometry — `ENVIRONMENT.md`'s **second**
list, which a cloud wake can take, and it was taken live against the built tree.

## Slice 290 — Standardize sweep, 4 of 4 lanes clean, and the reading that makes that honest rather than dead: the inputs three lanes measure did not move since Slice 284. Lane 4's carried worry — `LOOPS.md`'s dispatch region regrowing — did NOT continue, and step 1's one live candidate is refused by discrimination (2026-09-06)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty), fixed with `git checkout -B main
origin/main` before any commit; `origin/main` again arrived as a **forced
update** (`26447ba...1023579`). Trap 2 clean in one `--unshallow` (**1,928**
commits, no `shallow.lock`), and it again brought the tags — `git tag | wc -l` →
**7**, the **eleventh** consecutive container to do so.

Rule 1: no open P0 — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, and `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**.
Step 1 triaged and committed nothing: no new input. **Rule 2 matched** —
`dispatch_status.py` read `Standardize 4 / 4 Continue rounds … OVERDUE`, the
counter the previous hand-off predicted would fire. Rule 3 `1 / 3 slices … ok
[286]` did not match. Rule 5 reports **STALE** (`3 wake-date(s) newer`), so per
`LOOPS.md` it **could not be evaluated** and is not reported clear. Rules 4 and 6
were not reached.

**All four lanes ran; saying `n of 4` per the playbook. This is 4 of 4.**

| lane | command | result |
|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** of **1,433** live inline declarations, 0 pages |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | **8 repeated bodies**, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct |
| 3 report:prose | `npm run report:prose -w docs` | **0 unverdicted** — 15 distinct flagged pages, every one carrying a verdict |
| 4 loop-prose | `python3 scripts/loops/report_loop_prose.py` | ratchet + region below; **no new finding**, and 284's is retired |

### The lanes are clean for a MEASURED reason, which is the reading worth having

Three sweeps in a row (214, 284, this one) have read lane 1 at **1,433** and
lane 2 at **242 / 230 / 8**. Per CLAUDE.md an identical value across many inputs
is a defect in the instrument until proven otherwise, so the inputs were
measured rather than the detectors trusted:

```
# lane 1's source surface — inline style= declarations under apps/docs/src
git grep -oh 'style="[^"]*"' <rev> -- apps/docs/src | tr ';' '\n' | grep -c ':'
# and the FILE count, which the line above cannot produce (added by 291.3):
git grep -l 'style="' <rev> -- apps/docs/src | wc -l
  702a6408 (Slice 214, 2026-08-30)  390 declarations in 79 files
  1de97177 (Slice 284, 2026-09-06)  390 declarations in 79 files
  1023579f (HEAD)                   390 declarations in 79 files

git diff --stat 1de97177 HEAD -- packages/core/src/css     # EMPTY
git diff --stat 702a6408 HEAD -- packages/core/src/css     # 43 files, +282 / -23
```

That is a **source proxy** for lane 1's rendered figure, not the same number —
1,433 counts every instance across the built corpus — and it is quoted as the
proxy it is. What it establishes is the direction: lane 1's input has not moved
in a week, so an unmoved output is the correct one.

**Lane 2 is the control, and it is the half that proves the sweep is not
measuring a frozen tree.** Its input DID move over the longer window — 43 CSS
files, +282 lines between Slice 214 and HEAD — and it still reads 8 with the
same membership, which is a live detector reporting no delta. Since Slice 284 the
CSS diff is empty, so the flat reading against 284 specifically says nothing
either way; the 214 window is where the claim has to rest.

**Lane 2's delta is zero including membership.** All eight groups match the table
in `LOOPS.md`; the visually-hidden group is still the same three files, and the
joined-control `x4` group is still **two** components (money, quantity), so its
stated reopen trigger (a THIRD component) is unmet.

**Lane 3: 15 flagged pages, the same 15 Slice 284 checked** — 10 over the corpus
median (1,584), 11 over a family median, union 15, every one verdicted by 158.1,
161.1 or 178.3. No page entered the flagged set unverdicted, which is the lane's
actual question. Corpus 118 pages · median 792 · 111,555 words.

### Lane 4 — 284's carried worry is retired by measurement, not by re-reading the row

The ratchet block, read first per the playbook:

```
.roundtable/RESUME.md    1 up   last cut 5b8917e5 (2026-09-06)
.roundtable/ENVIRONMENT.md 8 up last cut 1005d1db (2026-08-30)
LOOPS.md                 4 up   last cut 8848ed55 (2026-09-05)
LOOPS-archive.md         2 up   never cut
ROADMAP.md              11 up   last cut f8a93fdf (2026-09-05)
ROADMAP-archive.md       9 up   last cut dc861a25 (2026-09-01)
CLAUDE.md               33 up   never cut
DESIGN.md               22 up   never cut
```

`CLAUDE.md` and `DESIGN.md` are the two never-cut files and both carry standing
verdicts — **284.2** (HONEST, with the removable surface measured at 181 words /
3.1%) and 167.1's (HONEST, the control). Neither is re-raised.

**`LOOPS.md` is where 284 left an open worry, and it did not come true.** That
sweep measured the dispatch region at 6,112 — *"+454 in the same day, more than
the cut removed"* — and declined to file an item because *"one day is not a
trend"*. Two more `LOOPS.md` commits have landed since, and the region is
**flat**:

```
for sha in $(git log --format=%H -12 -- LOOPS.md); do
  git show $sha:LOOPS.md | awk '/^## Playbooks/{exit} {print}' | LC_ALL=C.UTF-8 wc -w; done

8848ed55  2026-09-05  dispatch 5,658   file 13,720   ← 274.2's cut
632bfc46  2026-09-05  dispatch 5,961   file 14,023
9c1bacbe  2026-09-05  dispatch 6,112   file 14,272   ← 284's reading
e68ede5f  2026-09-06  dispatch 6,112   file 14,495
d257b9b8  2026-09-06  dispatch 6,112   file 14,958
```

**+686 words of file, +0 of dispatch region, across the two commits since 284
read it.** The regrowth 284 saw was 5,658 → 5,961 → 6,112 and then stopped; the
last three `LOOPS.md` edits landed entirely below the `## Playbooks` anchor,
which is where the playbook says growth is not this finding. The cumulative
`+300.8%` against the file's `+241.5%` is unchanged and is a *window* figure
carrying that history — reading it as a current trend is the mistake this entry
exists to prevent. `LC_ALL=C.UTF-8` per ENVIRONMENT.md §7.

1. [x] **290.1 — DONE 2026-09-06. REFUSED: the two parsers that both read
       `loop-log.md` stay separate, and the refusal is recorded in `LOOPS.md`
       so the next sweep does not re-raise it.**
       *Accept was*: step 1's un-instrumented lane — *"the same lookup table or
       logic hand-copied into multiple scripts"* — is scanned, and any candidate
       it turns up is either consolidated or refused with a measurement, with
       the outcome written where a future sweep reads it.

       **The scan found the named shapes already gated.** `viewports.mjs`
       (`check:viewport-forks`), `paths.mjs`, `source-files.mjs`,
       `dist-pages.mjs`, `wrong-choice-rule.mjs` and `_common.from_disk/from_rev`
       all have an enforcing or extracting owner. The width convention verified
       clean: the only `1440`/`390` literals left under `apps/docs/scripts` are
       in **comments and one self-test** (`check-claims.mjs` x5, all prose;
       `check-viewport-forks.mjs`, its own header and `--self-test` fixtures),
       which is what that gate blanks.

       **One live candidate, and it is refused.** `_common.parse_log_line` and
       `dispatch_status.ROW` both read `.roundtable/loop-log.md`.

       - **They cannot disagree on today's file, measured:** replaying both over
         the live log against a raw `- ` bullet count reads
         **1,480 / 1,480 / 1,480**, with **0** rows either parser sees alone.
       - **So the live file cannot separate them, and the refusal rests on
         discrimination against synthetic input instead** — the honest
         instrument for a latent difference:

         | row | `parse_log_line` | `ROW` |
         |---|---|---|
         | canonical 6-field | row, `mode=build` | match |
         | legacy 4-field (`ts · loop · item · outcome`) | row, **`mode=None`** | **NO MATCH** |
         | legacy 3-field | row, **`mode=None`** | **NO MATCH** |
         | hyphenated mode (`owner-decision`) | row, `mode=owner-decision` | match |

       - **They are not the same decision.** `parse_log_line` is the RECOVERY
         path — its docstring says it is *"tolerant of the older 4-field form …
         so history written before the mode/commit columns existed still
         rebuilds cleanly"*, because `rebuild_from_log.py` must reproduce the
         mirror from whatever the file holds. `ROW` is the COUNTER, and rules 2
         and 3 read the mode column it requires. Pointing the counters at the
         tolerant parser would hand rule 2 rows carrying `mode=None` that it
         cannot classify — silently, which is the exact failure mode this
         counter has five recorded instances of.

       Consolidation was in scope as an option and was refused for that reason,
       on the same ground as the BCD `path` column above it: two readers whose
       *jobs* differ are not one decision stored twice. Reopen if a third reader
       of this file appears, or if the 1,480/1,480/1,480 replay ever returns a
       non-zero disagreement — that is drift rather than design.

       **NOT VERIFIED, said plainly:** this slice is a markdown-only diff plus
       no source change at all, so nothing it touches renders. No 1440/390
       light-and-dark screenshots were taken — a cloud wake has no Podman and no
       `:8081` — and none is owed, because the diff changes no shipped surface.

## Slice 289 — Objective grill of the three items built since the last grill (283.3, 284.2, 288.1/288.2): 22 of 28 assertions reproduce, all six that do not sit beside no command, and the one that matters put an **empty diff** into the Accept of an item that is still open (2026-09-06)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty) — `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...59bcb04`). Trap 2 clean in one
`--unshallow` (**1,924** commits, no `shallow.lock`) and it again brought the
tags — the **ninth** consecutive container, `git tag | wc -l` → **7**. Working
tree clean; `RESUME.md` "In flight: nothing".

Step 1 triaged and committed nothing: no new input. `list_issues` on
`Busy-Office/busy-office-ui` → `totalCount: 0`;
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**. Step 0b: rule 2
`3 / 4 … ok`; **rule 3 `3 / 3 slices … OVERDUE [283, 284, 288]` — matched, and
this is what ran.** Rule 5 read `3 wake-date(s) newer … STALE`, so it **could
not be evaluated** — reported as such per its own text, never as clear. No
archive sweep: `roadmap_scope.py` reads **25.4%** closed-history share with 5
eligible targets, **2 of them NAMED by still-open items** (Slice 283, by both
`287.5` and `273.2`) — 236.2's report, read before deciding not to move.

Full report: `.roundtable/grill-objective-283-284-288-2026-09-06.md`.

### 289.1 — scope, narrowed per the playbook's step 0

The armed set is `[283, 284, 288]`, and **Slices 283 and 284 were already
grilled in full by Slice 285**. What re-armed them is not the slices but the
three *items* built since the last Objective row (Slice 286, `0b9e5601`,
00:10), whose log rows name their parent slice: **`283.3`** (landed
`e68ede5f`, filed under Slice 287), **`284.2`** (`167a1092`), and
**`288.1`/`288.2`** (`d257b9b8`). Everything in 283 and 284 predating
`89455547` is dropped — 285 covered it and 286 acted on its two findings.
`.roundtable/INDEX.md` reports **4 repeated subject(s)**; this grill adds none.

### 289.2 — the finding: a criterion may not embed a CITATION any more than a forecast

287.1's evidence block opens `git show -s --format=%cI fc79ea85 # 283.2
landed`. **The date reproduces; the label does not.** `fc79ea85` is *Slice
283*, the round that FILED 283.2; 283.2 LANDED at `9c1bacbe`, whose subject
reads `Slice 283.2 — the stamp revision is an OPTIONAL suffix …`.

287.1's own conclusion is untouched — **0** Polish rows after `20:54` and
**0** after the correct `21:55`, so the empty denominator holds under either
boundary. **What broke is `287.5`, which is still open and cloud-takeable.**
Its Accept offered a no-change branch resting on *"a recorded reading of
`git show fc79ea85 -- LOOPS.md`"*:

```
git show fc79ea85 -- LOOPS.md | wc -c    # 0      ← never touched the file
git show 9c1bacbe -- LOOPS.md | wc -c    # 7138   ← added the paragraph
git log --oneline -S'the LAST thing before the commit' -- LOOPS.md   # 9c1bacbe
git log --oneline -S'This is what reconciles the budgets' -- LOOPS.md  # 3ddeb683
```

So one of two Accept branches was satisfiable **only by reading an empty
diff** — "the diff establishes no intent" is literally true of 0 bytes and is
not what the criterion means. `CLAUDE.md` already refuses a criterion that
embeds a **forecast**; this is the sibling case, and it fails **more quietly**:
a wrong forecast is contradicted by the measurement that replaces it, while a
wrong citation returns *nothing*, and nothing reads as an answer. **Corrected
in place** at 287.1 (a note, transcript left standing per 285.2) and at 287.5
(the command itself, since that one is a live instruction a later wake
executes). 287.4's diagnosis is otherwise exact and still live: the sentence
is still orphaned, still carrying the earlier bullet's 5-space indent
mid-paragraph, and it predates both commits (`3ddeb683`).

**No gate proposed.** "Is this sha the one this sentence means" is semantic in
the way 94.11 measured and refused, and the checkable shape (a sha in a fence
beside a claim) is close to universally true in these files — 94.11's base-rate
test, applied before writing the gate rather than after.

### 289.3 — the other two: figures shipped beside a red-proved one, with no command

- **284.2's concentration paragraph.** Five figures, no instrument recorded,
  and re-deriving them with the item's *own* normalization reproduces none:
  **2,972** not 2,882; **1,423 (47.9%)** not 1,376 (47.7%); **814 (14.0%)** not
  768 (13.5%), over the same five sections. Two alternative normalizations were
  tried before filing and neither reproduces them. **The HONEST verdict is
  untouched** — it rests on four instruments that all reproduce.
- **288's instrument B.** Command not recorded; the repo's own three
  slice-naming patterns on the item field give **19**, `A − B = {216, 239,
  240}`, `B − A = {}`, and never `179`. **A (22) is what 288 used, and A
  reproduces exactly**, buckets and all.

Both are 192.1's shape, twice in one window: the expensive treatment goes to
the claim that motivated the work, and everything shipped beside it goes out
on that credibility.

### 289.4 — what reproduces, so the grill is a measurement and not a complaint

**22 of 28.** `--verify-stamps` 21/21 (after `npm run build -w @busy-office/ui`
— it refuses without `dist/api.json` rather than guessing); 34 Polish rows
ever; heal-before-re-queue is what `polish_requeue.py:883-897` does; ratchet
`CLAUDE.md` **33 up, never cut** and `DESIGN.md` **22 up, never cut**; **16**
sections; the whole-history replay **34 commits, 33 up / 0 down / 0 flat, 381 →
5,880 words, 4 → 16 sections**; `6eab896f` **17 → 16 sections for +20 words
(5,860 → 5,880)**; the 8-gram sweep **120 pairs, 3 overlapping, largest 36 of
5,808 body words (0.62%)**; **removable-because-said-elsewhere = 0**,
reconstructed independently (**868** sentences ≥12 words, 0 duplicated) and
**red-proved by injection** — planting a real `LOOPS.md` sentence took the
corpus 868 → 869, left *distinct* at 868, and fired the detector naming both
files, against a green control; **14 of 16** sections cite a date or slice id
and **the two that do not are exactly the two 284.2 names**; 288's **A = 22**
with the buckets partitioning it 5 + 9 + 8; 171.1's re-verification at **40**
components exact on all six dimensions; and the region figures **dispatch
UNCHANGED at 6,112 (+300.8%), playbooks 8,846 (+209.8%)**.

**The property, measured:** every figure whose producing command the entry
records reproduces, and all six failures sit beside no command. The converse
does **not** hold — two unrecorded figures (the 834-sentence sweep's verdict,
the 14-of-16 proxy) reproduce fine — so this is not "unrecorded means wrong".

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed, and that
is checkable rather than asserted:** this commit changes **0** CSS files and
**0** docs pages.

## Slice 288 — 286.3 asked for a decision on `LOOPS.md` §3b step 4 and required its own base rate re-run first; re-running it is what found that **4 of its 7 independent-pass entries do not hold**, and that the step it calls dead has moved a score twice on real defects — the LABEL and the TRIGGER were the defect, not the content (2026-09-06)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty) — `ENVIRONMENT.md` trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...1de9717`). Trap 2 clean in one
`--unshallow` (**1,922** commits, no `shallow.lock`) and it again brought the
tags — **eighth** consecutive container, `git tag | wc -l` → **7**, which is
why §2 states the count as the check rather than a value. Working tree clean;
`RESUME.md` "In flight: nothing".

Step 1 triaged and committed nothing: no new input. `list_issues` on
`Busy-Office/busy-office-ui` → `totalCount: 0`; no open item carries P0.
Step 0b: rule 2 `2 / 4 … ok`, rule 3 `2 / 3 … ok [283, 284]`. **Rule 5 read
`3 wake-date(s) newer … STALE`, so it could not be evaluated** — reported as
such per its own text, never as clear.

**Rule 4 matched.** All 15 open items re-read from `ROADMAP.md` and
re-classified from their own text per `LOOPS.md` 186.2, oldest first:
**owner-blocked** — Slice 15 (owner hardware), `112.3`, `112.4` (blocked on
112.3), `249.7` (defers to 249.10), `249.10`, `249.11`, `249.12`, `249.13`
(each says **OWNER CALL** in its own line), `273.2`; **browser-blocked in the
SCREENSHOT sense** — `249.6`, `249.9`, `249.15` (249.15's own text names
`ENVIRONMENT.md`'s first list and says a cloud wake should not pick it up).
The oldest item this container can take is therefore **286.3**, and it is what
ran. No archive sweep: `roadmap_scope.py` reads **23.2%** closed-history share
with 4 eligible targets, and **2 of them are NAMED by still-open items**
(Slice 283, by both `287.5` and `273.2`) — 236.2's report, read before
deciding not to move anything.

### 288.1 — the base rate re-run, as the Accept's first clause requires

Its first clause is *"re-run the base rate first"*, and the population has
moved: **22 Polish-round slices, not 20** — Slices 281 and 283 were filed
after this item was written. Identified by heading, which is the instrument
that survives its own red-proof:

```
# A — heading:  ^## Slice N — Polish round   over both roadmap files,
#               deduped by longest body (a closed slice leaves a stub in
#               ROADMAP.md and its text in the archive)  -> 22
# B — loop log: rows containing ` · Polish · ` that name a slice  -> 21
```

**A is sound and B is not, which is why they are both here.** `A − B =
{216, 240}` — two rounds whose log row never names its slice. `B − A =
{179}`, and Slice 179 is an **Objective grill**: its number appears only
inside the *prose* of Slice 216's row. B is `SLICE_TOP`'s known weakness
(`LOOPS.md` rule 3) arriving in a second instrument.

> **B's command is not recorded and no reading of the repo's own patterns
> reproduces it — Slice 289, 2026-09-06.** Applying `SLICE_BARE` /
> `SLICE_PROSE` / `SLICE_TOP` to the item field of every row containing
> ` · Polish · ` gives **B = 19**, `A − B = {216, 239, 240}` and
> `B − A = {}` — a different miss set, and it never yields `179`. So whatever
> produced B was not `SLICE_TOP`, and the diagnosis above is a guess rather
> than a reading. **A is unaffected and A is what this item used**: 22, the
> same 22 numbers, still red-proved by injection below.

**Red-proved by
injection**: a `## Slice 999 — Polish round on …` heading appended to
`ROADMAP.md` moved A `22 → 23` and the parsed section count `268 → 269`
— injection confirmed in the parser's own output, then reverted and
`git status` re-checked clean.

**The buckets partition, and four of this item's seven independent-pass
entries do not hold.** Classified on whether the round *itself* put a
second agent on the surface — the affirmative construct, red-proved for
discrimination against six non-Polish slices (179, 280, 284, 285, 286,
287), all six negative:

| bucket | n | slices |
|---|---|---|
| **put a second agent on the surface** | **5** | 242, 268, 273, 278, 279 |
| **declined, with a stated reason** | **9** | 176, 182, 216, 217, 220, 227, 267, 277, 283 |
| **recorded nothing** | **8** | 231, 239, 240, 266, 269, 270, 276, 281 |

`5 + 9 + 8 = 22`, asserted distinct and non-overlapping in the script.
The four corrections, each read from the slice's own words:

- **176** ran a *cited* re-score and says so outright: *"this is a cited
  re-score, not a blind one, so it is not counted as §3b's independent
  second opinion — the blind re-score is still owed"*. Filed above as an
  independent pass; it is the opposite.
- **182**: *"§3b step 4 requires a blind re-score by a second agent; this
  wake could not run one"*. Agent-blocked, not run.
- **269** *audited* the re-scores that had run (its arm 11) without
  running one; its own round is a cite audit — *"all six cites hold"*.
- **242 — filed above as a decline — is the round the ledger itself calls
  "the first this ledger has actually run"**, and it MOVED a score. The
  extractor that reads it as a decline trips on a sentence about a
  *different* dimension in the same slice (`spacing`: "the score stays 3
  and no blind re-score is owed **for it**").

### 288.2 — VERDICT: the LABEL and the TRIGGER were wrong; the CONTENT stays

So the skip rate is worse than filed — **17 of 22, not 13 of 20** — and
the diagnosis is the part that inverts.

- **"171.1 measured this mechanism dead" is a conflation.** 171.1 measured
  that no dimension can **rank surfaces**, and that re-verifies at 40
  components (`typography`/`colour`/`spacing` 3 on all 40; `interaction`
  {3:24, na:16}; `content` {2:1, 3:39}; `fit` {0:1, 3:39}). **Step 4 does
  not rank.** It asks whether ONE dimension is right on ONE surface, and a
  dimension that cannot discriminate *between* surfaces can still be wrong
  *on* one.
- **It found exactly that, twice.** `interaction: na` on a component that
  ships a behaviour, moved to 3 in **242** (`dashboard`, ships
  `initCollapsibleCards`) and **268** (`breadcrumb`, scored `na` against a
  rubric clause forbidding it). Slice 269's arm 11 names those two
  independently as the only score-moving re-scores the ledger has run —
  an instrument that did not know it was corroborating this. **2 of 5 runs,
  both real defects. Under-run, not dead.**
- **This item's "the one round that ran it as written (279) returned
  agreement in the weak direction" is false.** Three ran it as written;
  two of the three moved a score.
- **What was actually missing is the TRIGGER.** All nine declines give the
  same reason: the round changed nothing on the scored surface, so there is
  no score to re-take. Step 2 says a round fixes "exactly ONE scored
  weakness"; most rounds repair a stale **cite** instead. Step 4 is written
  for the first kind and correctly skipped by the second — it just never
  said so.
- **278's independent review stays Hypothesis, deliberately.** It is
  recorded in §3b as *permitted and worth writing down*, and explicitly
  **not mandated**: n = 1, exactly as this item filed it.

**Cost objection answered rather than waved off.** This item declined to
act partly on 274.1 — that `LOOPS.md`'s every-wake region carries the cost
of a rule change. §3b is in the **playbooks region**, which a wake reads
only if Polish is dispatched. `report_loop_prose.py`'s by-region block,
**read at `1de97177` — the parent of this slice's commit, because this
slice's own edit moves the playbooks number** — reads dispatch
`1,525 → 6,112 (+300.8%)` against playbooks `2,855 → 8,383 (+193.6%)`.
The edit does not touch what every wake reads. **Re-run after the commit,
which is the correction ENVIRONMENT.md asks for when a SCRIPT produces the
figure and `git show :<file>` is not available: dispatch is UNCHANGED at
`6,112 (+300.8%)`, playbooks moved `8,383 → 8,846 (+193.6% → +209.8%)`.**
That was written above as a forecast and is recorded here as a measurement —
the property held, and it is the property, not the forecast, that a later
wake should re-run.

**286.3's Accept — met.** A recorded decision on what step 4 asks a round to
do, landed in §3b, that agrees with what rounds actually do: the trigger
clause matches all 9 stated declines, and it does not mandate the n = 1
activity. **NOT VERIFIED, said plainly:** no 1440/390 light-and-dark
screenshots were taken — a cloud wake has no Podman and no `:8081`. None were
needed, and that is checkable rather than asserted: this slice changes **0**
CSS files and **0** docs pages; both its files are markdown, and nothing in
the diff renders.

## Slice 287 — 283.3 asked whether an advisory check is enough, and the honest answer is that the question has an EMPTY DENOMINATOR: 0 Polish rounds have run since 283.2, so the check has never had a live opportunity to fire — closed by repairing the gap that IS measurable, the printed repair command nothing ran (2026-09-06)

**Dispatcher trace, cloud wake.** Rule 1 clear: `list_issues` on
`Busy-Office/busy-office-ui` → `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**. Step 1 triaged and
committed nothing: no new input. Rule 2 `0 / 4 Continue rounds … ok`; rule 3
`0 / 3 slices … ok`. **Rule 5 read `3 wake-date(s) newer … STALE`, so it could
not be evaluated** — reported as such, per its own text, never as clear.
**Rule 4 matched.** All 16 open items were re-read from `ROADMAP.md` this wake
and re-classified from their own text per `LOOPS.md` 186.2, oldest first:
**owner-blocked** — Slice 15 (owner hardware), `112.3` (owner briefs + four
answers), `112.4` (blocked on 112.3), `249.7` (its own text defers to 249.10,
the owner's vocabulary column), `249.10`, `249.11`, `249.12`, `249.13`
(each says **OWNER CALL** in its own line), `273.2`; **browser-blocked in the
SCREENSHOT sense** — `249.6` (its own text records the clause-level decline,
the fourth), `249.9` (its own text: "the deliverable is a catalogue page whose
point is rendered miniatures a human compares"), `249.15` (its own text names
`ENVIRONMENT.md`'s first list). The oldest item this container can take is
therefore **283.3**, and it is what ran. No archive sweep: `roadmap_scope.py`
reads **9.5%** closed-history share, the lowest recorded.

### 287.1 — the measurement that decides 283.3, and it is a denominator, not a rate

283.3's Accept offers two branches and asks for one number either way: *how
many rounds since 283.2 stamped early*. The number is not a rate — **no rounds
have run at all.**

```
git show -s --format=%cI fc79ea85                     # 283.2 landed 2026-09-05T20:54:30+00:00
awk -F' · ' '/ · Polish · /{print $1}' .roundtable/loop-log.md | sed 's/^- //' \
  | awk '$0 > "2026-09-05 20:54"' | wc -l             # 0
grep -c ' · Polish · ' .roundtable/loop-log.md        # 34 ever
python3 scripts/loops/polish_requeue.py --verify-stamps
  # stamp verification: 21 row(s), every stamp describes a real tree
```

> **`fc79ea85` is mis-labelled here — corrected 2026-09-06 by Slice 289.** The
> date is right and the command reproduces; the *label* is not. `fc79ea85` is
> **Slice 283**, the Polish round that FILED 283.2. 283.2 **landed** at
> **`9c1bacbe`** (2026-09-05T21:55:17+00:00), whose own subject reads
> `Slice 283.2 — the stamp revision is an OPTIONAL suffix …`. **This item's
> conclusion is untouched** — the Polish-row count is **0** after either
> boundary, so the denominator is empty under the correct one too. The line is
> left standing rather than rewritten (285.2's transcript rule); what the
> mis-citation did break is `287.5`'s Accept, corrected there.

Four iterations have been recorded since 283.2 (`Continue · build`,
`Standardize · sweep`, and two `Objective · grill`) and **none is a Polish
round**, so `--verify-stamps` has never had an opportunity to fire on a live
round. Its 21-of-21 green is therefore not evidence of sufficiency; it is
evidence that the two known-bad rows were repaired by hand and nothing has
been able to break since.

**So the refusal branch is not takeable as written.** "The advisory check is
sufficient" would be a claim about 0 of 0 rounds — an unfalsifiable reading of
exactly the shape `CLAUDE.md` refuses ("a 0%, a 100%, or an identical value
across many inputs is a defect until proven otherwise"; a predicate with no
opportunities cannot discriminate). Recording it would have satisfied the
Accept literally and published a number that means nothing, which is the
failure the criterion rule exists to prevent.

### 287.2 — what IS measurable: the repair was already computed and printed, and nothing ran it

The gap between "advisory" and "self-healing" turned out to be one step, not a
format change. `stamp_provenance` already distinguishes the mid-round fault
from every other way a stamp can fail to reproduce — the introducing commit
touched the surface's own source — and already printed the exact repair,
`--restamp <surface> --at <rev>`. It was a standing request for a human to
read one stderr block among three and type a command.

**Shipped:** the verdict is split (`orphan-midround`, separate from `orphan`),
`stamp_provenance` returns the revision rather than only naming it in prose,
and `heal_midround` applies the repair — restamping to `digest@rev`, the
suffixed form `parse_stamp`'s docstring reserves for a revision known by
construction.

**The repair runs from `--apply` at Polish step 0, NOT from the post-commit
report, and where the write lands is the whole reason.** Step 0 already writes
this ledger, so a healed row is committed by the round about to happen.
Healing from `record_iteration.py` would edit a tracked file *after* the
wake's slice commit — a new way to hand off a dirty tree, which `LOOPS.md`
Step 0 reads as "the previous wake was interrupted". The evidence is equally
available at either point: the fault is visible once the round's commit
exists, and by step 0 of any later wake it does. It is convergent rather than
one-shot — the search re-runs from git history, so a heal computed and not
committed is recomputed identically next time.

**Healing happens BEFORE the re-queue set is computed**, not after: a healed
row's stamp may now equal today's digest, and marking it `RE-QUEUED` on the
strength of the digest it held a moment ago would be a false re-queue
manufactured by the repair itself.

### 287.3 — red-proved by injection with a control, in a throwaway worktree

Per `CLAUDE.md`'s rule that a green red-proof is a defect in the injection
until proven otherwise, the injection was confirmed **in the commit**, not in
the file: `git show --stat` shows `polish-state.md` and `tree/tree.css` both
in it, and `git show HEAD:.roundtable/polish-state.md` carries both bogus
cells. Two rows were injected in ONE commit to make the discrimination
unavoidable:

| injected | commit touched its source? | verdict | healed? |
|---|---|---|---|
| `component/tree` = `deadbeef` | **yes** (`tree.css` edited in the same commit) | `orphan-midround` | **yes** → `aff8f038@66eebfef` |
| `component/icon` = `feedface` | no | `orphan` | **no** — left at `feedface` |

Four readings, each a different question:

- **Red:** `--verify-stamps` went `2 of 21`, naming the two kinds apart. Green
  before the injection and green again for `tree` after the heal.
- **Reconciled through a different function:** after healing, `component/tree`
  drops out of `--check`'s re-queue set — and that set is computed by
  `digest()` reading the working tree, not by the `digest_paths(…, rev)` that
  produced the heal. Two code paths agreeing on the value.
- **Idempotent:** a second `--apply` printed `ledger UNCHANGED — nothing to
  write`.
- **It does not erase a real signal.** The injection was restored and a
  *further* commit touched `tree.css`; the heal still restamped at the
  introducing commit (`aff8f038@66eebfef`) and the row **still re-queued**
  (`-> 9cfa2515`). A repair that silently cleared genuine source movement
  would have looked identical on the first three readings.

The worktree and its branch were removed; `main` carries none of it.

### 287.4 — filed, not fixed: `LOOPS.md` §3b step 5 has a run-on paragraph from 283.2's own edit

Noticed while editing next to it. The sentence *"This is what reconciles the
budgets with this file's standing 'don't manufacture busywork' rule…"* belongs
to the **`dry++`** bullet above it and now trails the `--stamp` ordering
paragraph, keeping the earlier bullet's 5-space indent mid-paragraph. It is a
prose defect in a file the loop reads every wake, introduced by the commit
that added the paragraph it now trails.

4. [x] **287.5 — DONE 2026-09-06 (cloud wake). Re-attach the orphaned sentence
       in `LOOPS.md` §3b step 5.**
       Deliberately not fixed in this slice: it is a markdown move whose
       correct target is a judgement about what 283.2 meant, and this wake's
       diff is already in that paragraph — repairing prose you are editing
       around is how a bulk edit gets verified against its own diff.
       - **Accept:** the sentence sits under the bullet it belongs to **or**
         a recorded reading of `git show 9c1bacbe -- LOOPS.md` establishing
         that the run-on is what 283.2 intended, in which case this closes as
         no-change.
       - **The sha was `fc79ea85` until 2026-09-06 and that command returns
         0 bytes** — corrected by Slice 289, which measured it. `fc79ea85` is
         Slice 283 and never touched `LOOPS.md`; the paragraph the sentence now
         trails was added by `9c1bacbe`, which a `git log --oneline -S` over
         that paragraph's own opening words names uniquely. The
         no-change branch was therefore satisfiable by reading an **empty
         diff**, which reads as an answer. The sentence itself is older than
         both (`3ddeb683`, the original Polish playbook), so what is in
         question is only whether `9c1bacbe` meant to leave it trailing.

       **RESOLVED VIA BRANCH 1 (move it), because branch 2's premise is false:
       no commit ever decided to leave the sentence trailing. The bullet above
       is ANNOTATED, not rewritten (285.2's rule) — `9c1bacbe` is the third
       sha this one item has attributed the orphaning to, and it is wrong the
       same way `fc79ea85` was: both merely APPENDED text to a paragraph the
       sentence had already been stranded on, so an `-S` search over that
       paragraph's opening words finds the commit that wrote the paragraph,
       never the commit that did the stranding.**

       The orphaning commit is **`f57570f4`, 2026-08-25** — *"loops: execute
       the Polish re-entry rule instead of hoping someone reads it"* — eleven
       days before either sha named above. Found by replaying every revision of
       `LOOPS.md` and asking, per revision, whether the sentence's own line
       still carries the dry bullet, then reporting the transitions:

       ```
       python3 - <<'PY'
       import subprocess
       revs = subprocess.run(['git','log','--format=%H','--reverse','--','LOOPS.md'],
                             capture_output=True,text=True).stdout.split()
       N='This is what reconciles the budgets'; prev=None
       for r in revs:
           txt = subprocess.run(['git','show',f'{r}:LOOPS.md'],capture_output=True,text=True).stdout
           if N not in txt: continue
           line = next(l for l in txt.split('\n') if N in l)
           att = 'forfeit its remaining budget' in line
           if prev is not None and att != prev:
               print('ORPHANED' if not att else 'RE-ATTACHED',
                     subprocess.run(['git','log','-1','--format=%h %ad %s','--date=short',r],
                                    capture_output=True,text=True).stdout.strip())
           prev = att
       PY
       ```
       → one transition only: `ORPHANED f57570f4 2026-08-25`, never re-attached.
       **Asking the transition rather than the sha is what made this findable** —
       every previous attempt started from a commit and asked what it touched,
       which is how two wrong shas were published in two wakes.

       **`f57570f4`'s own diff shows a paste artifact, not a judgement**, which
       is what refutes the no-change branch outright:

       ```
       git show f57570f4 -- LOOPS.md | grep -E '^[-+].*(reconciles|forfeit|Either way)'
       -     forfeit its remaining budget.** This is what reconciles the budgets
       +     forfeit its remaining budget.**
       +   Either way, close the round with
       +   re-queues itself forever on the change the round just made. This is what reconciles the budgets
       ```

       It cut the sentence off the bullet's line and re-pasted the tail onto the
       end of the paragraph it was inserting. The sentence's subject — a surface
       that cannot produce a measurable gain twice running is finished — is the
       DRY rule, not `--stamp`. At `3ddeb683` (the original Polish playbook) it
       sat on the dry bullet, which is where it is now back.

       **Verified as a PURE MOVE, structurally rather than by reading the diff**
       (CLAUDE.md's bulk-edit and removal rules — the prose explaining a move
       legitimately names the moved words, so a substring assertion could not
       settle it): the sentence occurs exactly **once** before and after;
       `attached_to_dry_bullet` goes `False → True`; and the whole file's word
       multiset is **identical**, 15,201 words either side, so nothing was
       reworded, added or lost. The `--stamp` paragraph now ends at
       *"mid-round kind."*

       **This does NOT decide `273.2`**, the open owner call on whether a round
       whose score does not move should increment `dry`. It restores text that
       has been in this file since `3ddeb683` to the bullet it was written for;
       what that bullet MANDATES is unchanged, and 273.2 is still the owner's.

## Slice 286 — the defect Slice 285 listed under "what reproduced": 281's decay is dated to the hour and its CAUSE is false — `69a53364` is a pure addition that never touched the table, the table is still reached by the rule, and the claim was shipped in the `data-table` spacing cite (2026-09-06)

**Dispatcher trace, cloud wake — and this wake LOST TWO COLLISIONS, which is new.**
Rule 1 clear: `list_issues` on `Busy-Office/busy-office-ui` → `totalCount: 0`, and
no open `N. [ ]` item is a P0; Step 1 triaged and committed nothing. Rule 2
`0 / 4 … ok`; **rule 3 read `3 / 3 … OVERDUE`** and dispatched Objective. Rule 5
read **STALE** (`2 wake-date(s) newer`) and is therefore **reported as
could-not-be-evaluated, never clear**.

**Collision 1.** The wake dispatched Objective on `[274, 276-279]`, completed a
full grill of 276-279, and Step 0c's mandated `git fetch origin main` *before the
first commit* found `origin/main` **12 commits ahead** carrying `71b44721`, Slice
280 — the same grill. Reset, re-read the counters, rule 3 OVERDUE again on
`[281, 283, 284]`.

**Collision 2.** It then grilled 281/283/284, committed, and `git push` was
**rejected**: another dispatcher had pushed `89455547` — *Slice 285, Objective
grill of Slices 281, 283, 284* — taking the same three slices, the same slice
number and the same report filename. The rebase conflicted (add/add on the report,
content on `ROADMAP.md`) and was aborted; that work was discarded per Step 0c.

**⚠ This is the case Step 0c says would REOPEN the accept-collisions decision.**
Its stated cost is *"up to one wake's work, discarded"*, measured at n = 1. This
wake paid it **twice in one wake**, and the second time both dispatchers had
independently done the *same grill of the same three slices* — deterministic rule
4 was never the mechanism; it is rule 3's armed set, which is equally
deterministic. Recorded here rather than acted on: changing the concurrency model
is an owner call, and `LOOPS.md` already names what would reopen it.

**What is NOT discarded, and why this is a slice rather than a re-run.** Slice 285
grilled 281 and listed its decay under ***what reproduced***, verifying the two
TIMESTAMPS (`79f7fec9` 10:50 → `69a53364` 14:48, 27h58m, published as 28 hours)
and taking the causal half on trust. The cause is false, the claim was **shipped**,
and it is still shipped at `df63f253`. That is new work, not the taken item.

1. [x] **286.1 — DONE 2026-09-06 (cloud wake). Slice 281's heading and its dated
       cause are both false, the item's own measurement is what refutes them, and
       the claim was SHIPPED on `/components/data-table`.**

       281's heading says the worked example *"stopped being **reachable** by the
       rule it explains"*; 281.1's own next paragraph measures *"the fourth **is
       reached** (injection confirmed) and its rows read 87px → 87px"*. What
       stopped is the example producing its NUMBERS, not its reachability.

       Its cause — *"`69a53364` (109.19), 28 hours later, added
       `data-density="compact"` to it"* — is refuted three independent ways:

       | reading | command | result |
       |---|---|---|
       | the commit never touched it | `git show 69a53364 --stat -- ...detail-form.astro` | **91 insertions, 0 deletions** — a pure addition of a *different* table |
       | the table still has no density | `git show <rev>:...detail-form.astro \| grep '<table class="bo-data-table'` | absent at `79f7fec9:122`, `69a53364:127`, `a24ed45:127`, HEAD`:127` |
       | neither side of the comparison moved | block extract; `git log -- tokens/density.css` | markup **5 `<th>`, 3 `<tr>`, 26 lines** identical at `79f7fec9` and HEAD; `density.css` untouched between 94.3 and `6cb26268` |

       **Both readings of the sentence fail**, which is why it is a defect rather
       than a wording slip: if *"it"* is the table the fact is false; if *"it"* is
       the page the fact is true (a compact table WAS added, at `:195`) and
       explains nothing, because the cited table's reachability is unaffected.

       **Shipped, not merely filed.** The sentence lived in `dsa-scores.json`'s
       `data-table · spacing` cite, which `DsaScore.astro` renders:
       `grep -rl 'stopped being reachable by the rule' apps/docs/dist/` returned
       `components/data-table/index.html`, **1** occurrence. The CSS comments in
       `density.css` and `data-table.css` carry only the corrected physics and are
       clean, so the defect was confined to the cite. Fixed there with the
       replacement asserted at **exactly 1** occurrence and the JSON re-parsed;
       `scored` unmoved per 269.1's contract for a single-dimension correction. The
       archived Slice 281 gains a `CORRECTED` block per 236.2 / 199.1.

       **281's CONCLUSION is preserved and is not in question**: the cite genuinely
       was stale, naming the example by property rather than by page is right, and
       the two-effects separation (`0 of 101` for padding alone) reproduces.

       **The generalisation, which is the reusable half.** Both defects were
       catchable by reading the slice against ITSELF — its heading contradicts its
       own measurement one paragraph later — and two grills missed it because both
       re-ran the slice's commands instead. **Read a slice's headline against the
       measurement it publishes, before re-running anything.**
       - **Accept:** no published copy of the cite asserts a cause the tree
         contradicts, checked by re-reading the BUILT page rather than the diff,
         and the corrected text states what was measured with the commands beside
         it. Finding a further copy already accurate is a satisfying outcome — the
         two CSS comments were checked and left alone.

2. [x] **286.2 — DONE 2026-09-06 (cloud wake). `ENVIRONMENT.md` §6c read as a
       1440-only WIDTH trap; the same 15px reservation is present at 390px, and
       "heights are unaffected" does not hold for a row that WRAPS.**

       Measured against the freshly built tree at 390px:

       ```
       main.bo-app-shell__main   offsetWidth 390 - clientWidth 375 = 15
       /patterns/detail-form, 4 tables:
         no density (reached)  width 260  first row  87px   padding-inline 4px
         data-density=compact  width 310  first row  67px
         data-density=compact  width 310  first row 126px
         data-density=compact  width 310  first row  67.5px
       ```

       The reached table is **50px narrower** than its three siblings and its row
       **already wraps at 87px before any mutation**, so it cannot show a 68 → 87
       step in this container. §6c's closing *"Heights, row counts and overflow
       booleans are unaffected"* was true of the fixed-height rows it probed —
       those still reproduce — and is false for a wrap-sensitive row, whose height
       comes from the width the 15px is taken out of. 94.3 measured on the owner's
       machine; 281 re-measured here.
       - **Accept:** §6c states at which viewports the reservation is present,
         measured rather than assumed, and says which measurements it can move.
         **Met.** That this is *the* cause of 281's decay is recorded as
         **Hypothesis**, not Evidence — direction and magnitude fit and the
         alternatives are excluded, but settling it needs the owner's environment.

3. [x] **286.3 — DONE 2026-09-06 (cloud wake). The label and the TRIGGER were
       wrong; the mechanism is NOT dead, and this item's own reading that it is
       rests on a conflation. §3b step 4 amended.** The original text is kept
       below verbatim, with the corrections after it — four of its seven
       independent-pass entries do not hold.

       **`LOOPS.md` §3b step 4 is called "the load-bearing step" and is
       absent from 13 of 20 Polish rounds, because its stated mechanism is one
       171.1 already measured as dead.** Across 20 Polish-round slices in
       `ROADMAP.md` + `ROADMAP-archive.md` (deduplicated by longest body, buckets
       asserted to partition): **7 ran an independent pass** (176, 182, 268, 269,
       273, 278, 279), **7 explicitly declined** (216, 217, 220, 227, 242, 267,
       277), **6 recorded none** (231, 239, 240, 266, 270, 276).

       The declines are principled and say so — 277: *"no blind re-score is
       owed"*, no dimension covers the defect it found; 283: *"this round changed
       nothing on the surface, so there is no score to mark"*. That is the point.
       The step is written as *re-scoring a dimension against the rubric*, and
       **171.1 measured that no DSA dimension can rank** (2, 2 and 2 distinct
       values across 39 components). Rounds skip a dead mechanism correctly.

       Its value is a different activity. Slice 278's surface had no
       `dsa-scores.json` entry, so that round ran the step's *principle rather than
       its letter* — a second agent given the page and both modules, told nothing
       about what changed — and it returned **4 of that slice's 6 items**
       (278.3-278.6), including a shipped `aria-selected` accessibility defect and
       a defect in prose the same wake had shipped an hour earlier. The one round
       that ran it as written (279, re-scoring `fit`) returned agreement in the
       weak direction and one observation it declined to act on.

       **Filed for the owner, not acted on.** Rewriting §3b is a judgement about
       how the loop works; 279.4 changed a dispatcher rule two wakes ago, and
       274.1's finding is that `LOOPS.md`'s every-wake region carries that cost.
       The base rate is Evidence; the yield claim rests on **n = 1** and is
       recorded as Hypothesis.
       - **Accept:** a recorded decision on what §3b step 4 asks a round to do —
         re-score a dimension, review the surface independently, or both — that
         agrees with what rounds actually do, **or** a recorded reason the current
         wording is right and the 13 skips are intended. **Concluding that nothing
         should change is a satisfying outcome**; what is not is leaving a step
         called load-bearing that most rounds correctly skip. Re-run the base rate
         first — parse `^## Slice N` across both files, dedupe by longest body, and
         assert the buckets partition.

       **CLOSED BY SLICE 288**, which carries the re-run base rate, the four
       corrections to the bucket list above, the verdict and its red-proofs.
       In one line: the population is **22, not 20**; the buckets are
       **5 ran / 9 declined / 8 silent**; and the diagnosis inverts — 171.1
       measured that no dimension can RANK surfaces, which is not what step 4
       does, and the step has moved a score twice on real defects. The label
       and the trigger were the defect, and §3b now states the trigger.

4. [x] **286.4 — DONE 2026-09-06. Carried from 279's `fit` rubric observation, which 101.3 sent to
       a grill and which no grill has yet taken.** `/concepts/design-language`'s
       field matrix has exactly four rows (Date, Number/rate/%, Money, Quantity),
       so `fit`'s definition — which scores against *"the field matrix"* — cannot
       literally assign `scan` a context, yet `scan` carries a `fit` score of 3.
       279.2 filed it and correctly declined to act, because 101.3 forbids a Polish
       round editing a rubric definition. Passed on rather than decided here: 101.3's
       stop rule fires only for a defect the six dimensions structurally cannot see,
       and this is a wording gap in one definition.
       - **Accept:** `fit`'s definition names what it scores in terms that reach
         every component it is applied to, **or** records why the field matrix is
         the right reference and how a component outside it should be scored.
         Finding the current wording defensible is a satisfying outcome; what is
         not is a definition whose own reference set excludes components it carries
         scores for.

       **Outcome: the wording was NOT defensible, and the premise re-checks as
       stated.** Re-measured before acting, per CLAUDE.md's rule that an item
       whose premise is an earlier wake's measurement re-checks it as part of
       the criterion:

       ```
       # matrix shape — 4 field-type rows x 4 context columns
       python3 - <<'PY'
       import re
       src=open('apps/docs/src/pages/concepts/design-language.astro').read()
       i=src.index('The field matrix')
       seg=src[i:src.index('Subtraction is the method',i)]
       print(re.findall(r'<th scope="row">(.*?)</th>',seg))   # 4 rows
       print(sorted(set(re.findall(r"/components/([a-z0-9-]+)",seg))))
       PY
       # who carries a fit score, and what it reads
       python3 -c "import json;d=json.load(open('apps/docs/src/data/dsa-scores.json'));\
       print(len([c for c in d['components'].values() if 'fit' in c['dimensions']]))"
       ```

       - **Premise holds.** 4 rows (Date, Number/rate/%, Money, Quantity);
         **40** components carry a `fit` score; `scan` is one of them at 3.
         Distribution is `{3: 39, 0: 1}` — `date` is the only sub-3.
       - **The reach number, by an EXACT predicate rather than a word count.**
         Counting occurrences of a component's name on the page is a heuristic
         that over-counts (`form` matches the column header "Standalone form
         (entry)"; `date` matches `type="date"`), so reach is measured as *does
         the matrix section link `/components/<name>`*. It links five, four of
         them scored: **amount, form, money, quantity**. So the matrix reaches
         **4 of 40**, and **36** components carry a score its stated reference
         set cannot assign. Whole-page control: 6 scored components are linked
         somewhere on the page (adds `button`, `data-table`), so the gap is not
         an artefact of scoping to the section.
       - **The cost was not hypothetical, which is what settles it.** Six `fit`
         cites invoke the matrix. Five name a component the page mentions;
         `scan` appears **0** times anywhere on `/concepts/design-language`,
         while its own published cite read *"prescribed where the field matrix
         puts it and nowhere else"*. That cite renders on `/components/scan` via
         `DsaScore.astro`, so a claim whose stated authority does not contain it
         was shipping. This is the second correction to that one cite — 279.1
         fixed it for publishing an outbound Related list as an inbound fact.
       - **Fixed both ends in one commit:** `fit`'s definition now names the
         property it actually scores (the docs prescribe the component's
         contexts, including where it does NOT belong), keeps the matrix as the
         authority *where it reaches*, and states the neighbourhood rule the 36
         were already being scored against — which is not an invention: the
         outside cites already read that way (`combobox` vs `dropdown`,
         `skeleton` vs `state`, `progress` vs `stepper`, `prose` vs `richtext`).
         `scan`'s cite drops the false clause and keeps 279.1's measured half.
       - **Refused: widening the field matrix.** A `scan` row would make the
         definition true by editing the artefact the definition points at. The
         matrix covers field TYPES across editing contexts; `scan` is an input
         mechanism, not a field type, and 92.2's two axes do not generate it.
       - **Refused: a gate.** 94.11's base-rate test first — the checkable shape
         ("a `fit` cite naming the matrix also links from it") is true of 5 of
         the 6 cites that mention it and vacuously true of the 34 that do not,
         so a gate over it fires on a healthy tree. Whether a cite's stated
         authority *supports* it is semantic, which 94.11 says stays in a human
         reading rather than becoming ceremony.
       - **NOT re-verified, said plainly:** the preserved half of `scan`'s cite
         (4 of 39 pattern screens running a live `[data-scan-input]`) is 279.1's
         measurement, carried forward unchanged, not re-taken this wake — its
         own method requires counting elements in the DOM across frames.

## Slice 285 — Objective grill of Slices 281, 283, 284: 31 of 33 assertions reproduce, and the one that matters is the measurement a design decision was BUILT on — "0 of 18 stamps reproduce at the parent" is **16 of 18**, and it had spread into the shipped script's own docstring (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty) — ENVIRONMENT trap 1, fixed with
`git checkout -B main origin/main` before any commit; `origin/main` again
arrived as a **forced update** (`26447ba...26a5561`). `--unshallow` clean in one
attempt (**1,914** commits, no `shallow.lock`) and it again brought the tags —
**sixth** consecutive container, `git tag | wc -l` → **7**, which is why
`ENVIRONMENT.md` §2 states the count as the check rather than a value. Working
tree clean; `RESUME.md` "In flight: nothing".

Step 1: no new input — `list_issues` on `Busy-Office/busy-office-ui` returns
`totalCount: 0`, and `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i p0`
returns nothing (rc=1). Nothing triaged, nothing committed for it. Step 0b:
rule 2 `0 / 4 … ok` (spent by Slice 284), **rule 3 `3 / 3 slices … OVERDUE
[281, 283, 284]` — matched**, so rules 4-6 were not reached. Rule 5 reports
**STALE** (`2 wake-date(s) newer`) and is therefore **reported as
could-not-be-evaluated, never clear**.

**The arming set needed no narrowing.** The last grill was Slice 280, covering
276-279; none of 281, 283 or 284 has been grilled before
(`grep -hoE '^## Slice [0-9]+ — Objective grill of Slices [0-9, -]+'` over both
roadmap files). **Slice 282 is closed and is NOT in the armed set** — it was
closed by a `Roadmap · sweep` row, and `Roadmap` is excluded from
`CLOSES_A_SLICE`. Recorded as an observation, not filed: it is the same shape
279.4 fixed for `Polish`, but n = 1 and a rule fitted to one row is the
ceremony this loop already has on its carried-forward list.

**Scope: 33 assertions checked across the three slices, 31 reproduce.** The two
that do not are both in what shipped BESIDE a slice's headline finding, which
is 192.1's rule landing again — neither slice's actual finding is disturbed.

1. [x] **285.1 — DONE 2026-09-05. 283.2's "0 of 18 stamps reproduce at the
       carrier's parent" is **16 of 18**, and it is the stated justification
       for a format decision now shipped in `polish_requeue.py`.**

       283.2 published: *"every stamp that reproduces anywhere reproduces at
       the commit that **carries** it — 18 of 18 — and at that commit's parent,
       which is HEAD as `--stamp` saw it, **0 of 18**. A `@rev` written by
       `--stamp` would therefore record the one revision the measurement rules
       out, on every row."*

       **The first half reproduces exactly. The second is wrong, and wrong in
       the direction that justified the decision.** Re-derived independently
       over the same 21-row ledger at `fc79ea85` (283.1's commit, the
       pre-migration ledger), trying both the current and pre-276.1 path sets:

       | | rows |
       |---|---|
       | rows with a stamp | 21 |
       | reproduce at the commit that CARRIES the stamp | **18** ✓ as published |
       | of those 18, also reproduce at that commit's **parent** | **16** — published as 0 |

       **Why, mechanically.** 16 of the 18 carrier commits never touched the
       surface's own source. A Polish round that is a NO-OP on its surface —
       which most of this ledger is — commits `polish-state.md` and
       `ROADMAP.md` and nothing else, so HEAD's source at `--stamp` time is
       byte-identical to the commit's. `component/progress` is the plain case:

       ```
       git diff-tree --no-commit-id --name-only -r a940c8f3
       # .roundtable/polish-state.md  ROADMAP.md  scripts/loops/polish_requeue.py
       # digest at a940c8f3  = 1154a4d7   (the stamp)
       # digest at a940c8f3^ = 1154a4d7   (identical — nothing in its source moved)
       ```

       Only `byline` and `icon` differ at the parent, and they are exactly the
       two rounds that edited their own surface in the same commit. **So a
       mandatory `@HEAD` would have been RIGHT on 16 of 18 rows, not wrong on
       all 18.**

       - **Accept (property, not forecast):** every live publication of the
         parent figure agrees with a re-measurement over the same ledger, and
         the decision it supports is either re-justified on a ground that
         survives the correction or reversed. **Met** — corrected in the four
         live places it had spread to (`ROADMAP.md` 283.2, `polish-state.md`,
         and **twice** in `scripts/loops/polish_requeue.py` — the module
         docstring and the `--stamp` branch comment — plus `parse_stamp`'s
         docstring, which is where the argument actually lives). The
         `loop-log.md` and `STATUS.md` rows are **not** backfilled:
         `record_iteration.py`'s standing rule forbids it, and a log row is a
         record of what a wake believed at the time.

       **THE DECISION SURVIVES; ITS EVIDENCE DID NOT.** The suffix stays
       optional, on the ground that is true by construction rather than by base
       rate: `--stamp` cannot know, at the moment it runs, whether the round
       will still commit a source change, so it cannot write a revision it can
       **guarantee**. And a wrong suffix is worse than an absent one —
       `--audit-stamps` verifies a suffixed stamp by ONE equality at the named
       revision and skips the search, so the 2 bad rows would read as confident
       and stay unrecoverable, where a bare stamp is merely searched for. That
       is a 2-of-18 failure rate for a silent, unrecoverable wrong answer,
       which is a fair reason to refuse it; "wrong on every row" was not.

       **Red-proved by reconciliation, not by re-running the same code.** The
       independent predicate — *did the carrier commit touch this surface's
       source?* — agrees with *does the stamp reproduce at the parent?* on
       **18 of 18** rows. The detector discriminates before any injection: it
       returns three distinct verdicts on real input (18 reproduce at the
       carrier, 16 at the parent, and `data-table` / `date` / `pagination`
       reproduce at neither).

       **My own first two instruments here were wrong, per this repo's base
       rate, and both were caught before they produced a finding.** The first
       read the ledger's `status` column instead of `src` (the `src` cell is
       not last), returning 0 of 21 — a plain zero, which CLAUDE.md says is a
       defect until proven otherwise. The second walked the ledger's revisions
       newest-first and returned the revision AFTER the introducing one for
       every row, and `NONE` for the six rows whose stamp the migration
       replaced; that version reported 12 of 15 at the parent and would have
       overstated this finding. Commands and both dead versions are in
       `.roundtable/grill-objective-281-283-284-2026-09-05.md`.

2. [x] **285.2 — DONE 2026-09-05. 284.2's `CLAUDE.md` ratchet reads `32 up`
       where its own commit makes it `33` — the third instance of a trap
       `ENVIRONMENT.md` gained a bullet for two wakes earlier.**

       284.2 asserts the lane-4 signature *"holds for `CLAUDE.md` (**32 up / 0
       down, never cut**)"* in the same sentence as *"284.1 left `CLAUDE.md` 20
       words longer"*. Measured by replaying `ups_since_last_cut` at three
       revisions:

       ```
       6c18a11 (parent)  CLAUDE.md 32 up, never cut   5,860 words
       6eab896 (carries 284.2)      33 up, never cut   5,880 words
       26a5561 (HEAD)               33 up, never cut   5,880 words
       ```

       `DESIGN.md`'s **22** is right at both revisions, so exactly one of the
       two figures moved — which is what makes this a misreading rather than a
       stale snapshot. **Corrected to 33 in the item; the `32 up` inside the
       lane-4 block is deliberately NOT corrected**, because that block is a
       verbatim transcript of `report_loop_prose.py` as read at dispatch, which
       is what produced the finding.

       **This is the trap `ENVIRONMENT.md` names in its own words** — *"when
       your own commit changes the file, `HEAD` is the pre-change state and is
       exactly as wrong as the tree, in the opposite direction"* — a bullet
       275.3 added on 2026-09-05 after 273.1 and 274.1 hit it on consecutive
       wakes. This is the third occurrence and **the first after the bullet
       existed**, so the bullet is not yet changing behaviour. **No gate is
       added**: the checkable shape ("a figure in a commit message or item
       matches the same figure recomputed at that commit") needs to know which
       numbers in prose are instrument readings, which is semantic — 94.11's
       lesson, and the same reason 281 refused a gate over its density cite.

**Everything else reproduced.** Named so a later wake does not re-derive them:

- **Slice 284** — `CLAUDE.md` 16 headings at `e3844c49` and 17 at `6c18a11`,
  back to **16** after the fold; section-word denominators **4,570 / 5,658 /
  5,687** and file words **4,759 / 5,860 / 5,880** all exact; on-subject
  numerators **1,893 / 2,385 / 2,414** all exact, reconstructed from the seven
  detector-can-fail sections without the (uncommitted) original classifier.
  **All ten worked examples and both corollaries survive the fold** — checked
  with 17 independently-chosen markers, all present. Dispatch region **6,112**;
  `LOOPS.md` last cut `8848ed55`.
- **Slice 283** — `--check` **10** re-queues with 0 uninformative,
  `--verify-stamps` **0**, `--audit-stamps` **0** dead, **7** suffixed rows and
  **14** bare; the four migrated formula-orphans all still re-queue and the two
  mid-round rows have stopped; the behavior-module split is **9 / 12** with all
  **7** affected rows in the first group and none in the second; Slice 15's
  *AT runtime evidence* has **never** been ticked across **919** revisions of
  `ROADMAP.md`.
- **Slice 281** — **138** built pages and **115** carrying a
  `.bo-data-table-container`, both exact; **3** raw hex in `data-table.css`,
  all **3** inside its single `@media print` block; the decay is exact to the
  hour (`79f7fec9` 2026-08-21 10:50 +0800 with a bare `<table
  class="bo-data-table">` at line 122 → `69a53364` 2026-08-22 14:48 +0800
  adding `data-density="compact"`, **27h58m**, published as 28 hours); the
  `spacing` detector reads **0** on `data-table.css`.

  **281's `115` is the reason this grill did not file a third finding, and it
  is worth recording how close it came.** A static
  `grep -rl 'bo-data-table-container' apps/docs/dist --include=index.html`
  reads **110**, and the reasoning that a static grep must be an OVER-count of
  a DOM walk (code samples are escaped text, and `data-table.ts` only *queries*
  the class, never creates it) made 115 look like a five-page overstatement.
  The DOM walk 281 actually used returns **115**. The wrong instrument was
  mine; 281 is right. *Reconcile against the instrument the claim was made
  with, before calling the claim wrong.*

- **Not re-derived, and said rather than implied:** 281's `spacing` base rate —
  *"fires on 15 of 44 component stylesheets (20 literals)"* — ships with **no
  command beside it**. The **44** reproduces exactly (44 `.css` files under
  `components/`), and a reconstructed detector reads **14 / 19**; whether the
  one-file difference is 281's definition or mine is not decidable from what
  was published. The load-bearing half — that it reads **0** on
  `data-table.css` and therefore discriminates — reproduces. Recorded as a
  reminder that CLAUDE.md's *"write the command next to the claim"* applies to
  a base rate offered as evidence, not filed as an item.

## Slice 284 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's finding is that 167.1's stated reopen condition for `CLAUDE.md` was MET — an eighth section on "can this detector fail" was added without folding, and the fold is this slice (2026-09-05)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i p0` returns **nothing**
(rc=1). Step 1 triaged and committed nothing: no new input. **Rule 2 matched** —
`dispatch_status.py` read `Standardize 4 / 4 Continue rounds … OVERDUE`, the
counter the previous hand-off predicted would fire, and rule 2 sits above the
queued build item deliberately. Rule 3 `2 / 3 slices … ok [281, 283]` did not
match. Rule 5 reports **STALE** (2 wake-dates newer than the newest comparable
pair), so per `LOOPS.md` it **could not be evaluated** and is not reported clear.
Rules 4 and 6 were not reached. Step 0c's re-fetch before the first commit is
recorded with the commit.

**All four lanes ran; saying `n of 4` per the playbook. This is 4 of 4.**

| lane | command | result |
|---|---|---|
| 1 dead-style | `npm run scan:dead-style -w docs` | **0 dead** of **1,433** live inline declarations — identical to Slice 214's 1,433 |
| 2 css-repeats | `npm run report:css-repeats -w @busy-office/ui` | **8 repeated bodies**, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct — all three unmoved from Slice 214 |
| 3 report:prose | `npm run report:prose -w docs` | **0 unverdicted** — 15 distinct flagged pages, every one carrying a verdict |
| **4 loop-prose** | `python3 scripts/loops/report_loop_prose.py` | **the finding, below** |

**Lane 2's delta is zero and that is the whole reading.** All eight groups match
the table in `LOOPS.md`, membership included — the visually-hidden group is still
the same three files, and the joined-control `x4` group is still **two**
components (money, quantity), so its stated reopen trigger (a THIRD component) is
unmet. Slice 214 read 242 rules / 230 distinct / 8 repeats and so does this
sweep, so the +5/+5 it recorded has not been followed by another.

**Lane 3: 15 flagged pages, checked against the SOURCE rather than assumed.** 10
over the corpus median (1,584), 11 over a family median, **15 distinct**. Every
one carries a verdict: 14 are named inside 158.1's own section body — verified by
extracting the page paths from it (`awk 'NR>=17549 && NR<=17800' ROADMAP-archive.md
| grep -oE '/(components|concepts|patterns|base)/[a-z-]+' | sort -u`) rather than
by counting mentions, which is a presence probe and not a fidelity probe — and
`/concepts/scale/` carries **178.3**'s. The set moved by one since Slice 214's 14
(corpus 9→10, family 12→11); `/patterns/output-form/` is verdicted but no longer
flagged. **No page entered the flagged set unverdicted**, which is the lane's
actual question.

### Lane 4 — the finding, and it is a condition an earlier wake wrote down in advance

`report_loop_prose.py`'s ratchet block, read first per the playbook:

```
CLAUDE.md   32 up   never cut          ← read every wake — the doctrine
DESIGN.md   22 up   never cut
```

`CLAUDE.md` is the only file in the report that is **read every wake AND has
never once been cut**, which is exactly the shape `LOOPS.md` names as this lane's
finding.

**`LOOPS.md` was checked against that shape too and is NOT this sweep's finding,
which took a measurement rather than a reading of the row.** Its `by region`
block reports the dispatch region growing faster than the file (+300.8% against
+225.8%), and the playbook's own rule is that *a cut which does not touch the
dispatch region does not answer this finding* — so the question is whether
today's cut (`8848ed55`, 274.2) touched it. It did:

```
8848ed55^   dispatch 6,100 words      8848ed55   dispatch 5,658      (−442)
```

So a real dispatch-region cut sits behind the file, one day old, and the
every-wake-with-no-cut shape does not apply to it. **Recorded as a measurement
and not filed as an item: the region has already regrown to 6,112 — +454 in the
same day, more than the cut removed** — from 279.4's rule-3 amendment and 283.2's
third step-0 advisory check, both of which are rule text a dispatcher reads.
One day is not a trend, and a second item fitted to it would be the "rule fitted
to one row" this loop already has on its carried-forward list. It is also the file 167.1 verdicted **HONEST** on 2026-08-28 with an
explicit, checkable reopen condition: *"7 of its 16 `##` sections — 1,893 of
4,600 section words, 41% — are all on one subject, whether a detector can fail …
a wake reading one gets no pointer to the other six. **Reopen if an eighth is
added without folding.**"*

**Measured, not inferred — the condition is met.** Exactly one `##` section has
been added to `CLAUDE.md` since 167.1's commit, and it is on that subject:

```
git show e3844c49:CLAUDE.md | grep -P '^## (?!#)'   # 16 headings
grep -P '^## (?!#)' CLAUDE.md                       # 17 headings
# the one addition: "A green red-proof is a defect in the INJECTION until proven otherwise"
```

It was inserted **directly beneath** the rule it restates ("Red-proving a gate:
verify the INJECTION, not just the red result"), and its own text says why it was
written separately — *"So state it as an observation rather than an intention"*.
That is the "without folding" case precisely.

**The classifier was reconciled against 167.1's published figures before its
delta was believed** — run over that commit it returns **7 of 16 on-subject and
1,893 section words, matching 167.1's numerator exactly**; the denominator reads
4,570 against its stated 4,600, a 30-word difference in what each counts as a
section body, which does not touch the numerator the condition rests on. On
HEAD the same classifier read **8 of 17 · 2,385 of 5,658 words · 42.2%**.

1. [x] **284.1 — DONE 2026-09-05. The eighth section is folded into the seventh,
       and the merged section leads with the observation grammar.**
       *Accept was*: the two sections on injection validity become one, with
       every worked example and both corollaries still present, and the
       on-subject section count reported by the same classifier that reconciled
       against 167.1.

       They are the same trap stated twice, which is what distinguishes this
       from the other seven — 167.1 recorded those as *"not duplicates …
       seven distinct traps"*, and that reading survives re-reading. The two
       folded sections instead closed with near-identical instructions
       (*"Confirm the injection took effect … before believing a passing gate"*
       / *"Confirm the injection changed the thing the gate reads"*), and the
       eighth's entire opening paragraph existed to point at the section
       immediately above it — a job that disappears when they are one section.

       The merged section leads with the observation form, because that is the
       form the eighth section argued for and the form this file's other rules
       take. **All ten worked examples survive** (five 2026-08-17/18 injection
       traps, five 2026-08-28 violations-of-the-written-rule), as do the
       "measure the box that carries the constraint" corollary and the
       self-test one-level-up note; verified by asserting 13 distinguishing
       markers, not by reading the diff.

       ```
       # same classifier, both revisions
       HEAD    8 of 17 on-subject · 2,385 of 5,658 words = 42.2% · file 5,860
       folded  7 of 16 on-subject · 2,414 of 5,687 words = 42.4% · file 5,880
       ```

       **It is +20 words, NOT a cut, and that is stated rather than dressed
       up.** The remedy 167.1 named is *folding*, and folding is what discharges
       its condition — one rule, one place, the strongest framing first. The
       word count is incidental to that, and trimming doctrine prose to make the
       number fall would be optimising the instrument, which 274.1 refused for
       the same reason. So `CLAUDE.md`'s **accumulation** half of the lane-4
       finding is untouched and is filed as 284.2 rather than claimed closed.

       The heading keeps both prior search terms ("Red-proving a gate", "green
       red-proof … INJECTION") because five files cite one phrase or the other,
       `scripts/loops/roadmap_scope.py` among them — checked before renaming,
       and that one is a prose comment citing the rule by content, not a
       structural dependency.

       **All 17 CI entry points green in this container** after the fold.

2. [x] **284.2 — VERDICT: HONEST, and the reason not to cut is a number.
       DONE 2026-09-06 (cloud wake).** Two red-proved instruments put the whole
       removable surface of this file at **181 words, 3.1%** — of which 36 are
       verbatim — against the +2,914 words the item is about. A cut there does
       not touch accumulation; it is 94.11's ceremony with a word count
       attached.

       *Accept was*: a recorded verdict using the 158.1 three-way split
       (**honest** / **instrument** / **removable**) reached by reading what the
       sections now carry, **or** a recorded reason the file should not be cut at
       all — with both named instruments re-run first, since every figure in the
       item is a snapshot. Both were re-run and both moved nothing: the ratchet
       still reads **33 up / 0 down, never cut**, and `grep -P '^## (?!#)'` still
       reads **16** sections.

       **The verdict rests on four measurements, not on 167.1's.** 167.1
       verdicted this file HONEST at 10 up / 4,759 words / 16 sections; it is now
       33 up / 5,880 / 16, so that verdict is quoted past its measurement exactly
       as the item says. Re-derived from scratch:

       - **The signature is literally true, over the file's WHOLE history, not
         just 158.2's window.** All 34 commits that have ever touched
         `CLAUDE.md`, consecutive-compared: **33 up / 0 down / 0 flat**, 381 → 5,880
         words and 4 → 16 sections. There is no window in which this file has
         ever ended a commit shorter than it started it.
       - **Removable-because-said-elsewhere: 0.** 158.1's own instrument, aimed
         at the four files a wake reads (`CLAUDE.md`, `LOOPS.md`, `DESIGN.md`,
         `ENVIRONMENT.md`): **0 of 834** sentences of ≥12 words appear in more
         than one place.
       - **Reconciled against an independent instrument, because a plain 0 is a
         defect until shown otherwise.** An 8-gram sweep over all **120** section
         pairs finds **3** that overlap at all. The largest is **36 of 5,808 body
         words (0.62%)** — §*An instrument's first output* and §*A number you
         report is load-bearing* retelling the same 39.2 four-dead-detectors
         example. §*A heuristic gate* tells it a third time, reworded (1 shared
         8-gram). Total spend across the three tellings: **62 + 55 + 64 = 181
         words**; folding two into pointers recovers at most ~93.
       - **Every section still names the failure that produced it.** 14 of 16
         cite a date or a slice id. **The 14 is a proxy and undercounts** — the
         two that do not cite (§*Quality bar*, §*A gate that only runs in CI*)
         each name their incidents in prose (the Podman stale-cache trap; the
         `check:rtl` po-app break and the week-long axe drift), they simply carry
         no reference. Read rather than grepped: 16 of 16.

       **Why the 181 words are KEPT.** They are one worked example illustrating
       three *different* rules, and this repo has a recorded position against
       replacing them with pointers — `LOOPS.md`'s own *"a pointer is read less
       than a paragraph, and this is the part that changes behaviour"*, which is
       why 167.2's split kept the lesson as prose and moved only the narrative.
       Cutting 3.1% would also be answering a question about accumulation with a
       change that does not move it, which is 274.1's refused shape (optimising
       the instrument).

       **One instrument caveat, measured, and it is NOT enough to verdict
       INSTRUMENT.** The ratchet's up/down is a word count, so the single commit
       that has ever reduced this file's section count — 284.1's own fold,
       `6eab896f`, **17 → 16 sections for +20 words (5,860 → 5,880**, read from
       the commit and its parent, per `ENVIRONMENT.md`) — registers as an **up**
       step. That is **1 of 33**: the file has genuinely never been cut by words,
       so the signature is right and only its resolution is coarse. Recorded so
       the next fold is not read as accumulation.

       **Growth is concentrated, not diffuse** — the other half of "what the
       sections now carry". Of the +2,882 body words since `6ffdfd3f`
       (2026-08-20), **1,376 (47.7%) are three sections that did not exist**
       (green-red-proof 581, Accept-criterion 528, base-rate 267), and **5 of 16
       sections have not gained a word** in that window (`claims-executable` 80,
       `heuristic gate` 297, `CI-only` 207, `verifying a removal` 116, `Don't` 68
       — 768 words, 13.5% of the body). The file is not creeping everywhere; it
       adds a section when a new trap costs real time, and leaves the settled
       ones alone.

       > **The five figures in the paragraph above carry no instrument, and
       > none of them reproduces — Slice 289, 2026-09-06.** Re-derived with
       > *this item's own* normalization (the 8-gram sweep's splitter, which
       > reproduces its body total of 5,808 exactly): the delta since
       > `6ffdfd3f` is **2,972**, not 2,882; the three new sections hold
       > **1,423 (47.9%)** — 602/551/270, not 581/528/267; and the five that
       > gained nothing are **the same five sections** but **814 words
       > (14.0%)** — 87/307/217/121/82, not 80/297/207/116/68. Two other
       > normalizations were tried before filing (dropping `###` sub-headings,
       > dropping inline-code spans); neither reproduces them, and the
       > inline-code variant puts the body at 5,312, contradicting this item's
       > own denominator. **The HONEST verdict is untouched** — it rests on the
       > ratchet, the section inventory, the sentence sweep and the 8-gram
       > sweep, and all four reproduce, the last two under independently
       > rebuilt, red-proved instruments. This is 192.1's shape exactly: the
       > expensive treatment went to the claim that motivated the work, and
       > what shipped beside it went out on that credibility.

       **Reopen condition, stated as a property because 167.1's was stated as a
       value.** 167.1 said *"reopen if an eighth is added without folding"*;
       284.1 satisfied that literally and it is now a consumed one-shot sitting
       in a closed archived item. The property instead: **reopen when the 8-gram
       sweep reports a section pair that is new, or an existing pair grown past
       what this entry recorded** — a comparison a later wake makes by re-running,
       not a number it has to have predicted. Deliberately still **not** a gate,
       for the item's own stated reason.

       ```
       python3 scripts/loops/report_loop_prose.py    # ratchet block, not the delta
       grep -P '^## (?!#)' CLAUDE.md                 # section inventory -> 16
       python3 - <<'EOF'   # the 8-gram sweep; baseline 3 pairs, largest 36 words
       import re,itertools,pathlib
       t=pathlib.Path("CLAUDE.md").read_text(); out,cur,f=[],None,False
       for ln in t.split("\n"):
           if ln.lstrip().startswith("```"): f=not f; continue
           if f: continue
           if re.match(r"^## (?!#)",ln): cur=[ln[3:].strip(),[]]; out.append(cur); continue
           if cur: cur[1].append(ln)
       def g(s,n=8):
           w=re.sub(r"[^a-z0-9 ]"," ",re.sub(r"\s+"," "," ".join(s).lower())).split()
           return {" ".join(w[i:i+n]) for i in range(len(w)-n+1)}
       G={h:g(b) for h,b in out}
       for (a,x),(b,y) in itertools.combinations(G.items(),2):
           if x&y: print(len(x&y), a[:38], "|", b[:38])
       EOF
       ```

       **Both sweeps were red-proved by injection, and the first one came back
       green** — CLAUDE.md's own case. The sentence detector's first version
       split line-by-line; this repo hard-wraps at ~79 columns, so it could only
       ever match a sentence short enough to fit on one line, and a duplicate
       lifted verbatim out of `LOOPS.md` and planted in `CLAUDE.md` did **not**
       fire it. Its 3 "hits" were all single-line code comments. Unwrapping
       blocks before splitting fixed it, and the fixed version asserts the
       planted sentence is **present in the corpus at both locations** before
       reporting — the injection confirmed in the parsed artefact, not in the
       file. The 8-gram sweep was red-proved separately on a planted overlap
       (8 grams, must be > 0).

       **NOT VERIFIED, said plainly:** no screenshots at 1440/390 in light and
       dark were taken — a cloud wake has no Podman and no `:8081`. **None were
       needed, and that is checkable rather than asserted:** this commit changes
       **0** CSS files and **0** docs pages. Nothing in the diff renders.

       ---

       **The item as filed, kept verbatim below** — it carries the figures the
       dispatch was made on, and a transcript is not rewritten (285.2's rule).

       **284.2 as filed — `CLAUDE.md` accumulates and has never been cut; the
       fold did not change that.** Lane 4's signature — a file the loop reads every wake,
       accumulating with no cut behind it — holds for `CLAUDE.md` (**33 up / 0
       down, never cut**) and `DESIGN.md` (**22 up / 0 down, never cut**), and
       284.1 left `CLAUDE.md` 20 words longer.

       > **`32` corrected to `33` on 2026-09-05 by Slice 285.2.** 32 is the
       > ratchet at `6c18a11`, the PARENT of the commit that carries this item;
       > 284.1's own step takes it to 33, and the sentence around the figure
       > describes the post-fold file. `DESIGN.md`'s 22 is right at both, so
       > only one of the two moved. The `32 up` in the lane-4 block above is
       > NOT corrected — that is a verbatim transcript of the report as read at
       > dispatch, which is what made the finding, and re-writing a transcript
       > would hide when the reading was taken. `ENVIRONMENT.md` names this
       > exact trap — *"when your own commit changes the file, `HEAD` is the
       > pre-change state and is exactly as wrong as the tree"* — a bullet
       > 275.3 added after 273.1 and 274.1 did it on consecutive wakes. This is
       > the third instance, and the first to occur AFTER the bullet existed.

       167.1 verdicted its growth
       HONEST at 10 up / 0 down; the file has since taken 22 more upward steps
       and grown from 4,759 to 5,880 words, so that verdict is being quoted well
       past the measurement behind it.

       *Accept*: a recorded verdict for `CLAUDE.md`'s accumulation using the
       158.1 three-way split — **honest**, **instrument**, or **removable** —
       reached by reading what its sections now carry, **or** a recorded reason
       the file should not be cut at all. **Concluding that nothing should be
       removed is a satisfying outcome**, not an off-plan one; what is not
       satisfying is quoting 167.1's verdict without re-measuring. Re-run both
       instruments first — the ratchet block and the section classifier — since
       every figure above is a snapshot:

       ```
       python3 scripts/loops/report_loop_prose.py        # ratchet block, not the delta
       grep -P '^## (?!#)' CLAUDE.md                     # section inventory
       ```

       Deliberately **not** given a gate. "This section earns its words" is
       semantic, and 94.11 already paid for that lesson: the shape is checkable,
       the meaning is not. `DESIGN.md` is named here as the second instance of
       the same signature, not as a second item — it is read only when the
       product's architecture is in play, so the every-wake half of the
       signature does not apply to it.

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

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input. Rule 2 `3 / 4 Continue rounds … ok`; rule 3
`1 / 3 slice … ok [281]`. **Rule 4 matched on its own sweep clause**, not on a
queued item: all 12 open items were re-read from `ROADMAP.md` this wake and
each re-classified from its own text per `LOOPS.md` 186.2 — owner-blocked
(`249.7`, `249.10`-`249.13`, `112.3`, `112.4`, `273.2`, Slice 15) or
browser-blocked in the SCREENSHOT sense (`249.6`, `249.9`, `249.15`; a LOCAL
wake can take those three). Rules 5-8 not reached.

*Read before quoting rule 5:* `dispatch_status.py` reports it **STALE**
(2 wake-dates of loop activity newer than the newest comparable pair, itself
`bundle-gz-kb`). Per `LOOPS.md`'s own instruction this rule **could not be
evaluated** this wake — it is not being reported clear.

1. [x] **282.1 — DONE 2026-09-05. Twelve closed slices' worth of regrowth in
       one day: 13 slices moved verbatim, `ROADMAP.md` 5,870 → 3,179 lines at
       the move, and all four 236.2 pins read one at a time and kept.**

       **⚠ A WAKE THREE AND A HALF HOURS AGO REFUSED THIS EXACT SWEEP, AND
       THIS ITEM IS THE OPPOSITE CALL ON A NEARBY READING. SAID FIRST, BECAUSE
       burying it is the failure this repo keeps paying for** (`LOOPS.md`'s own
       worked case: `check:resume-charter` hardened and demoted 44 minutes
       apart, *"two consecutive wakes, neither naming the other"*). The log row
       is `5abdce3c`, 2026-09-05 15:51: *"Meta · refusal · a twelfth archive
       sweep at 40.6% closed-history share, below both measured triggers
       (55.1%, 56.7%) — 249.12 is the open owner call on the threshold"*.

       **What changed between that refusal and this dispatch is 420 lines and
       5.9 points — and, honestly, the criterion.** `git show
       5abdce3c:ROADMAP.md | wc -l` reads **5,450**; this wake read **5,870**.
       That is a real move and it is not a large one, so this is not "new
       evidence arrived": the refusing wake weighed **share**, this one weighs
       **lines**, and rule 4's clause is written in lines (*"if this rule is
       walking thousands of lines, that is the signal"*). Both readings are
       available from the same sentence, which is the actual finding — see
       282.2. Recorded as a contestable call made deliberately, not as a
       triggered one.

       **The rest of the trigger, stated against the two thresholds it does
       NOT clear.** `roadmap_scope.py` read closed-history share **2,730 /
       5,870 = 46.5%** (208.1's definition) with 13 eligible targets — below
       the 56.7% that dispatched the eleventh sweep and the 55.1% that
       dispatched the tenth. Alongside the line count, the regrowth rate:
       `d33c1ef` left the file at **3,689** at 02:45:32Z and `4567bed` carries
       **5,870** at 19:13:17Z — **+2,181 lines in 16h 28m**, ~132/hour, which
       returns the file to the eleventh sweep's own 6,468 trigger point inside
       five hours. Slices 165, 177, 252 and 272 are the precedent for taking
       the sweep from inside a dispatch.

       Moved, in the order they held in the live file, each leaving the
       standard heading + one pointer line: **281** (137 body lines), **280**
       (175), **279** (238), **278** (522), **277** (213), **276** (150),
       **275** (169), **274** (289), **272** (164), **262** (151), **260**
       (182), **253** (165) and **237** (175) — **2,730** body lines.
       `ROADMAP-archive.md` 37,459 → **40,201**; the **+2,742** reconciles as
       2,730 body + 13 headings **− 1**, that one being the old file's trailing
       blank line, which the append consumed as the separator before Slice
       281's heading. Live loss **−2,691** = 2,730 removed + 13 × 3 stub lines
       added. Closed-history share **46.5% → 0.0%**.

       *Two different live-file figures, both true, kept apart because
       ENVIRONMENT's "read a commit's figure from that commit" bullet has been
       broken twice by exactly this conflation:* the **move** took `ROADMAP.md`
       5,870 → **3,179**; this **commit** carries 5,870 → a larger number,
       because writing this slice back is the rest. All figures read from
       `HEAD` and the index (`git show :<file> | wc -l`), never the tree.

       **The identity of the move was red-proved, not asserted.** A checker
       compared each moved heading + body against `HEAD:ROADMAP.md` and read
       **13/13** identical with no line-count difference on any slice. That
       result means nothing until the checker is shown able to fail, so one
       body line of the archived Slice 260 was mutated in memory and the
       checker re-run: **12/13**. The injection printed the line it changed
       before the re-run, per CLAUDE.md's rule that a green red-proof is a
       defect in the injection until proven otherwise.

       **THE FOUR 236.2 PINS WERE READ, AND NONE CARRIES AN AMEND CLAUSE** —
       the same finding as the eleventh sweep, re-derived rather than carried
       over, because `roadmap_scope.py` over-reports by design (any `Slice N`
       inside an open item's text fires):

       | flagged target | the open item's own words | reading |
       |---|---|---|
       | 253 | `249.6`: *"Corrected by Slice 253's grill, finding C."* | where a correction came FROM |
       | 262 | `249.7`: *"That clause is SPLIT OUT as 249.19 and LANDED (Slice 262 …)"* | where a split-out clause LANDED |
       | 237 | `249.12`: *"the archive-sweep practice exists (Slices 224, 228, 235.2, 237.1 all did one)"* | one instance of a practice, in a list of four |
       | 260 | `249.15`: *"the TAG half is split out as 249.17 and has landed (Slice 260)"* | where a split-out half LANDED |

       `check:slice-refs` after the move: **834 assertions, 314 cited across
       702 files, 263 slice numbers each heading one section**, exit 0. Open
       checkbox count **12 before and 12 after**, and every target was asserted
       to carry **zero** `N. [ ]` boxes before it was allowed to move.

2. [x] **282.2 — the finding, and it is about the trigger instrument rather
       than the sweep: 208.1's share carries a floor it can never count, so it
       is not comparable across eras.**

       The numerator is body lines of closed slices still carrying text here;
       the denominator is every live line. **The pointer stubs prior sweeps
       leave are in the denominator and can never enter the numerator** —
       measured at both ends of this regrowth window and identical:

       ```
       # per revision: slices whose body is the "archived verbatim" stub
       after the 11th sweep (d33c1ef)  file 3,689   246 stubs = 985 lines (26%)
       now (HEAD 4567bed)              file 5,870   246 stubs = 985 lines (16%)
       ```

       So immediately after a sweep, **985 of 3,689 lines — 26.7% — is pure
       pointer floor**, and that floor grows 4 lines per slice archived,
       forever. A share computed over it is capped from below by a number that
       only rises, which is why *"46.5%, below the 55.1% that dispatched the
       tenth"* is not the comparison it looks like: **this file is within 10%
       of the size that dispatched the eleventh sweep (5,870 against 6,468)
       while reading 10.2 points lower.**

       **Stated as an observation, not fixed, and the stub floor is NOT this
       window's cause** — that distinction is the part worth keeping. The floor
       is byte-identical at both revisions above, so it explains none of the
       10.2-point move; what moved is the numerator (3,668 closed body lines
       then, 2,730 now) against an open set whose text is larger — Slice 249
       alone carries **1,218** lines, and the four open slices carry **1,748**
       of 5,870 between them. The floor is a *secular* bias that makes readings
       from different eras incomparable; this window's gap is a composition
       change. Conflating the two would be the error this item exists to name.

       **THE DECISION BOUNDARY, WHICH IS THE INPUT `249.12` HAS BEEN MISSING.**
       `249.12` says a sweep trigger does not exist and calls it low urgency
       *"the sweep keeps happening regardless"*. It does keep happening — and
       the five recorded decisions do not lie on any single threshold, in
       either unit. Every row read from the commit it names, never the tree:

       | when | commit | live lines | share | decision |
       |---|---|---|---|---|
       | 2026-09-04 00:56 | `49d2c901` | 3,620 | 32.0% | **refused** |
       | 2026-09-05 02:45 | `d33c1ef~1` | 6,468 | 56.7% | dispatched (11th) |
       | 2026-09-05 15:51 | `5abdce3c` | 5,450 | 40.6% | **refused** |
       | 2026-09-05 19:13 | `4567bed` | 5,870 | 46.5% | dispatched (12th, this) |
       | *(tenth, per 252.1)* | — | 3,790 | 55.1% | dispatched |

       A share threshold consistent with those rows must sit in (46.5%, 55.1%]
       **and** above 40.6% — but 46.5% dispatched and 55.1% dispatched while
       40.6% refused, so no single share separates them: the 12th sweep fires
       below the 10th's trigger. A *line* threshold fares no better — 5,450
       refused and 5,870 dispatched, 420 apart, while 3,790 dispatched.
       **The two units disagree in direction on the same data**, which is the
       thing to bring the owner: the tenth sweep ran at 3,790 lines / 55.1%
       and the fourth row here refused at 5,450 lines / 40.6% — a file 1,660
       lines LONGER, refused for being a smaller fraction closed. That is
       208.1's stub floor doing exactly what the block above measures.

       **Refused: inventing a threshold in `roadmap_scope.py` from inside a
       dispatch.** `249.12` is the open **OWNER OR ARCHITECTURE CALL** on this
       exact question, and a wake that shipped a number would settle an owner
       call by fiat — while being, on this evidence, the very wake whose
       judgement is in dispute. What this item ships is the table, not the
       answer. **What it also does is retire "low urgency"**: two wakes on one
       day reached opposite conclusions 3.5 hours apart, which is a cost the
       item's own text did not know about when it was written.

3. [x] **282.3 — REFUSED 2026-09-05. `Roadmap · sweep` closes a slice and rule
       3 cannot see it — 279.4's defect, one loop over. Refused on base rate:
       there is exactly ONE such row in 1,445, and it is this wake's own.**

       Found by the mechanism `LOOPS.md` prescribes and credits with 2 of the
       5 recurrences — *"read the counter right after recording an iteration"*.
       It read `1 / 3 slice … ok [281]` **before and after** recording, while
       this wake had just closed Slice 282 by hand. `Roadmap` is excluded from
       `CLOSES_A_SLICE` on 161.4's reasoning that *"a triage row plans a slice,
       it does not close one"*, which is right about the mode it was measured
       on and silent about this one.

       **What is exact, and stated separately from what is not.** Over 1,445
       rows, `Roadmap` rows carrying a slice number split by MODE as
       `plan 32 · triage 22 · grill 4 · hygiene 1 · release 1 · sweep 1`; all
       `Roadmap` rows split `plan 106 · triage 40 · grill 5 · verify 3 ·
       hygiene 1 · release 1 · sweep 1`. `Roadmap` rows name **51** distinct
       slices, of which **8** — 1, 57, 114, 122, 171, 181, 221, 282 — are named
       by no `Continue`/`Standardize`/`Polish` row and so are invisible to this
       counter; **7 of the 8 resolve in the roadmap with zero open items**
       (Slice 1 has no matching heading). *Confound, named rather than
       smoothed over:* "invisible" here means no counted row **names** the
       slice, and `dispatch_status.py`'s own `SLICE_TOP` comment records a
       fourth convention — 30 rows naming their slice mid-text after an
       em-dash — that all three patterns miss, so some of the 8 may have been
       closed by an unparsed `Continue` row. Slice 282 is the one case
       first-hand: no `Continue` row for it exists.

       **NOT QUOTED: the whole-log replay, which is 161.4's and 279.4's own
       method.** A probe written for this item returned **80** crossings for
       the current `Continue + Standardize + Polish` set where
       `dispatch_status.py`'s header records **52** for the same set over
       1,437 rows. That is a 28-crossing disagreement, so the probe is wrong
       until reconciled against `report()`'s live output the way 279.4
       reconciled its own, and its delta is not evidence of anything.
       CLAUDE.md's rule, applied to this item rather than about it: an
       instrument's first output is not evidence, and a number that disagrees
       with an independent reading does not get published because the
       conclusion would be convenient.

       **The refusal, which does not rest on the replay.** Adding `Roadmap`
       wholesale re-admits the 54 `plan`/`triage` rows 161.4 excluded for
       planning rather than closing — the change that starves the build, and
       rule 3 sits above rule 4 precisely so that over-arming is the expensive
       direction here. Carving out `sweep` alone is a rule fitted to **one**
       row, written by the wake that wrote the row; 279.4's amendment had 18
       rows over 17 slices with 12 invisible behind it, and that is the
       difference between a measured correction and ceremony.

       - **Reopen when:** `grep -c ' · Roadmap · sweep · ' .roundtable/loop-log.md`
         reaches a count where a replay — reconciled against `report()`'s live
         output first — moves the crossing figure at all. Until then this is a
         known blind spot with one instance, recorded so a later wake finds it
         rather than re-deriving it.

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

6. [ ] **249.6 — "Choose your path" router, corrected from the proposal's
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

9. [ ] **249.9 — Visual component catalogue.** Depends on 249.8 (tagline) and
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

15. [ ] **249.15 — The one static OG image 249.2 named and did not build.**
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

