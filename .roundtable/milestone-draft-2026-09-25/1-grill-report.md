# Round 2 grill report: Milestone M1, layouts and components for a long-use ERP app (2026-09-25)

**Inputs to this round:**
- the five round-1 lenses and draft;
- your five round-2 answers;
- the four-seat naming roundtable and its moderator;
- three designs: the experimental lifecycle, the Jev queue screen, and the roadmap realignment.

**What this redraft added.** I merged the inputs, resolved the places where they disagreed, and re-checked the load-bearing facts against the repo myself. Every re-checked claim is marked **(re-checked)**. Anything without evidence is marked **Hypothesis**. The redraft's scripts are in `/private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/milestone-grill/r2/redraft/`:
- `classify_r2.py` reconciles the dispositions of the 65 open items.
- `lint_roadmap.py` lints the five new slices.

Both scripts were shown to fail on injected defects before their clean results were used.

## Verdict

**The milestone can run once three things are true.** You accept the naming doctrine, you answer the owner decisions below, and the loop passes its readiness slice (M0). Each of your answers maps onto the plan like this:

1. **Answer 1: the roadmap decides which model does each item.** Every item carries a `Route:` line, and a table you review (`scripts/loops/routes.json`) maps each route to a model tier, effort, skills and a critic.
   - "No task" and "unclear" are detected by **code**.
   - The dispatcher then launches a **planner** on the strongest model tier you permit. The planner writes the direction as roadmap items.
   - Jev screens each item code has picked by answering three fact questions, and code acts on the probabilities. This runs in shadow until the data promotes it.
   - Jev still cannot call a model. What you asked for, "Jev calls another model", happens as "Jev's answer makes code call the planner". That becomes true once the queue screen is promoted.
2. **Answer 2: shape names.** The roundtable recommends that every name the framework publishes names a *shape*. Module words live only in the reference app's demo data, in a generated job index, and in the consumer. A layout a module needs becomes a new shape with its final shape name. This needs a CLAUDE.md change, drafted below, and it is a one-way door you decide (O4).
3. **Answer 3: freedom to design.** Existing suite screens are reference only. Each module's layouts are designed fresh in the reference app, and a redesign replaces its predecessor at the same URL.
   - This overrules round 1's "build only new shapes" and "stop at zero gaps" rules.
   - The prediction discipline stays, as a measurement rather than a limit.
4. **Answer 4: loop readiness first.** Slice 393 (M0) comes first, with an inclusion test. The milestone activates only when a loop-doctor re-score reaches 3.0.
   - All 65 open items are given a disposition, reconciled against a raw count: 3 go to M0, 23 fold into the milestone, 15 go to a defect track, 9 are parked and 15 are owner-blocked.
5. **Answer 5: your "flag it, remove the flag when it passes admission" is the right shape.** Recommended changes:
   - Call the tier **`experimental`**. `preview` and `init` already mean other things here.
   - Keep the part at its final path.
   - Mark every use.
   - Every experimental part has an open "admit or remove" item.
   - The piece that actually stops needs being missed is a rule that every discovered need names a queued second use. GAP-21 is the proof that this rule is missing today.

## Your round-2 answers, and where each one lands

| # | Your words (verbatim) | What it changes | Where it lands |
|---|---|---|---|
| 1 | "Jev can't do the dispatching you described. <-- That means we need to have roadmap define for the change which need to be another model to do. If there is no task in roadmap or unclear roadmap, Jev needs to call another model to review and set the direction. (Which is bigger target)" | Model choice moves into the roadmap (`Route:`). A planner escalation (rule D) is added. Jev gains a third, declared point: the queue screen (JQ), in shadow. Round 1's J4 (Jev picks the tier) is dropped. | 393.6 routes; 393.7 rule D; 394.12-394.16 JQ; prompt §5-§7 |
| 2 | "Grill / roundtable to ensure that best for the long term rather trap with short term.. pls think long term." | A four-seat roundtable was run, and its recommendation was adopted. A doctrine change is drafted. | 394.1 (OWNER); 394.9-394.10 job index; 396.1 gate; prompt §8 |
| 3 | "this scope only layout and components so existing screen ..for reference only. however, we are looking for the long use app so freedom to design." | Layouts are designed fresh, and existing screens are reference. Three round-1 scope limits are dropped: maps-as-deliverable, new-shapes-only and stop-at-zero-gaps. | 394.2; 395.1-395.2; 396.3-396.12 |
| 4 | "The loop isn't ready for this milestone - then realign the roadmap" | M0 comes first. The 65 open items are dispositioned. Ordering is enforced by code (`After:`), not by a prose section. | Slice 393; the realignment table |
| 5 | "how about flag as preview or init (or better idea let me know)... once it is pass the admission rule, then remove." | An experimental tier with one header line; graduation deletes that line. A separate placeholder marks a hole. The second-use rule is added. | 394.4-394.8, 394.17; 397.1; prompt §9 |

## The naming roundtable (answer 2)

**The question.** Should module-named layouts (a "Finance layout") exist in the framework, given the rule at CLAUDE.md:337-343? The rule reads: "A pattern is NAMED and FRAMED for its SHAPE; the domain appears only as demo data" (re-checked). What serves a 3-5 year, human-plus-agent ERP suite best?

**The seats and the moderator's scores.** Weights: long-term ×2, AI consumer ×2, doctrine ×1, cost ×1. Maximum 30.

| Seat | Position | Long-term | AI | Doctrine | Cost | Total |
|---|---|---|---|---|---|---|
| D, AI contract | The id is the shape, the index is the job, the module is a filter. Ship a Screen Contract with a validator. Status is metadata. | 4.5 | 5 | 4 | 2.5 | **25.5** |
| A, shape-only | Keep the rule absolute and state it precisely. Modules live in the reference app, a job index and the consumer. | 4 | 3 | 5 | 4 | 23 |
| C, two-layer | A shape framework plus a `@busy-office/blueprints` package named for domains. | 3 | 3.5 | 3 | 2 | 18 |
| B, module-first | Ship module templates by name in a `@busy-office/modules` package, on top of a `module-frame` pattern. | 2 | 2.5 | 2.5 | 1 | 13 |

**The evidence that decided it.**

*Published names are effectively permanent.*
- `invoice-list` still has **162 references in 94 files**, 34 days after it was renamed (re-checked with `git grep -c invoice-list`). They include a frozen docs snapshot and a permanent redirect.

*Module boundaries are not stable.*
- Your own artefacts cut modules three ways:
  - the suite's `o2c`/`p2p`/`fin`… (`_shell.mjs:42-49`, re-checked);
  - your 09-25 list;
  - busy-office-erp's `ap`/`ar`/`gl`….
- The first user's AppSpec is keyed by 9 shape kinds and has no module layouts (moderator re-check). ADR-0016 is still Proposed.

*The code already follows the rule.*
- 0 of 1,039 published names carry a module term (seat A's scanner; its self-test caught 6 of 6 injected names).
- A module-named layout would therefore break a rule that holds everywhere today.

*Agents cannot yet get from a module word to the right screen.*
- The built `llms.txt` has **0** hits for "screen kit" and "/suite/" (re-checked), and 0 for "sales" and "distribution" (moderator re-check).
- The npm tarball ships neither `patterns.json` nor `llms.txt` (moderator re-check).
- A shape-only rule with no bridge therefore leaves agents guessing. That is why the job index is part of the answer, not an extra.

*Names mislead shape choice.*
- `kinds.mjs` records three screens that were misfiled "because its NAME sounds like one".

**The recommendation (adopted).** Seat D is the spine. Grafted onto it:
- **From A:** the rule text, the swap test and the gate.
- **From B:** the module-landing anatomy (now the `workspace` spike, 395.2), `data-bo-pattern` on each screen root, and the A/B test before a third module set (396.2 and 396.5).
- **From C:** two separate flags (a hole versus a part not yet admitted) and an admission count done by code.

**Not now:**
- No modules or blueprints package. The revisit trigger is an outside consumer asking to install module screens.
- 112.4 (the Screen Contract) is your decision O10.

**The doctrine change to decide (O4).** This replaces CLAUDE.md:337-343. It is the moderator's text, with the tier word and the expiry changed by this redraft:

> **Every name the framework publishes names a SHAPE; the domain appears only as demo data and as search words** (owner rule 2026-08-22, Slice 109; widened 2026-09-25 from patterns to every published name).
> - **Published names:** classes, parts, modifiers, tokens, behaviours, component directories, `@category` values, pattern ids, `data-bo-*` values, package and export names, and docs slugs under `/patterns/`, `/components/` and `/concepts/`.
> - **The rule:** none of these contains a module, department, process-area or industry word (Finance, Sales, Distribution, o2c, AP…).
> - **The swap test:** a job word is shape vocabulary only if it names one distinct interaction AND stays true when the demo data moves to another module. `goods-receipt` passes; `invoice-list` failed and was renamed `list-report`.
> - **Where module words live, and nowhere else:** (1) demo data in `examples/erp-suite/<module>/`, the reference app, free to design and outside semver; (2) the generated job index (job → also-called words → module facets → pattern id → worked screen); (3) the consumer's own app names.
> - **A "module layout" is a generated view of those, never a namespace.** Never add per-domain demo variants: that is re-photographing.
> - **A layout a module needs that no pattern covers is a new SHAPE:** born with its final shape name and `@status experimental`, and promoted by deleting that line (no rename, no path change) once it survives Objective §3's ≥2 independent compositions. Code counts these as distinct (job, pattern) pairs, never by module label. An experimental part with no second use is removed or absorbed when its decision item comes up.

**Companion edit, recipe step 1:** "`@status experimental|deprecated` and `@decide <item>`: optional; absent means stable. An experimental part is excluded from `index.css`, listed in `api.experimental`, flagged by `bo-check-markup` unless marked, and exempt from Breaking entries."

**Risks accepted over 3-5 years.** These are from the seats' own risk lists; each has a watch point.
- **The shape vocabulary sprawls.** Watch: wrong-choice clauses, and the merge rule in §2.
- **The job index becomes the only discovery path.** Watch: it is generated and reconciled, and 396.5 measures it.
- **The reference app becomes a de-facto template library.** Watch: screens are stamped with `data-bo-pattern`, and the Screen kit says "copy the pattern, not the screen".
- **Truly vertical shapes never find a second use.** This is §3 working as intended.
- **The rule keeps being relitigated.** This is at least the fifth domain-framed ask. The ADR records why, and what reversing it would cost.

## The three designs, and what this redraft changed in each

### 1. The experimental lifecycle (answer 5)

**Adopted:**
- a header directive with a decision item;
- a separate `api.experimental` section. Readers of `api.components` fail open: 16 files read it, including the ACR;
- a use marker enforced by the shipped validator;
- a real-browser load gate. `motion.css` failed silently twice (check-claims 137.12 and 137.17);
- docs status shown in words in both directions;
- CHANGELOG `### Experimental` entries;
- the entry test, the admission tests G1-G5, and the states table;
- the rule that every need names a queued second use.

The design's evidence, re-checked where marked:
- **Tier-word collisions:** `experimental` 0, `preview` 123, `@status` 0 (re-checked).
- **`init`** has 26 `init*()` functions in `llms.txt` (re-checked).
- **"Preview" already names the docs container** in open item 377.12 ("the preview's provenance is truthful") (re-checked).
- **Documented class names are API** (versioning.astro:12-15, re-checked).
- **An `@layer` sublayer changes which rule wins at graduation** (design's Chrome probe; not re-run).
- **0 new component directories in 33 days** (design; not re-run).

**Changed in this redraft:**

| Topic | Design / moderator said | Redraft | Why |
|---|---|---|---|
| Where the CSS ships | `dist/css/experimental/<name>.css`, moved to `components/` at graduation | **The final per-file path, `dist/css/components/<name>.css`**, left out of `index.css` until graduation | The `./css/components/*` export already exists (packages/core/package.json:43, re-checked), so graduation adds one `@import` and breaks no one who opted in. The moderator criticised seat C for the same move. The marker and the validator keep opt-in deliberate. |
| Placeholder attribute | `data-gap` | **`data-bo-gap`** | `check-markup` ignores unknown `data-*` by design (its header, re-checked). A framework-namespaced attribute the shipped validator fails on means a copied placeholder cannot reach production silently. |
| Stale marker after graduation | error | **Warning by default; error under `--strict` in the repo** | An error would break every consumer's CI on the day a part graduates. |
| Expiry | Moderator: fail the build after 3 minors | **No time bomb.** Rot is bounded by the cap, the decision item reconciled against the source, and the `After:` chain; the release entry lists each part's age | A date gate breaks unrelated builds at release time, and releases are already a bottleneck (Slice 381). |
| WIP cap | Moderator 3, design 2 | **2 (O8)** | 0 new component directories in 33 days. |
| Independence | Distinct `kinds.mjs` KIND, or pattern id | **Distinct (job, pattern) pairs; a module label never counts** | Suite screens will declare `@pattern` (394.9). |
| Patterns | Components only | **Pattern pages can also be experimental** (`workspace` is the first candidate) | The naming rule sends new layouts to new shapes. |

**Jev, Rubric 1, advisory.** One batched call on the two conflicts I had to resolve. It returned `experimental` at 1.00 and the final path at 1.00. **Neither number is evidence.** The state I wrote carried my own evidence for each option, so 1.00 means the payload was leading, which CLAUDE.md treats as a defect in the instrument. The decisions rest on the evidence above, and the tier word stays your call (O7).

### 2. The Jev queue screen and the planner (answer 1)

**Adopted:**
- Code picks the item. Jev answers three fact questions about it (`decision`, `done_evidence`, `waits_on`), and code applies probability rules to choose `execute`, `sharpen` or `ask-owner`.
- Every action is reversible. An outage means `sharpen`. A cheaper model tier is reachable only through a decided `execute`.
- Shadow first. Calibration uses a tune set and a holdout drawn from ROADMAP history. Promotion is yours alone.

The design's evidence (not re-run by me):
- A cheap text-feature check is no better than chance at predicting a re-plan (AUC 0.45-0.60), so code alone cannot decide it.
- A code lint catches 15 of 45 historical re-plans and flags 19 of 309 items that were built as written.
- In a 26-item pilot:
  - `owner_or_business_choice` separated: 0.99 on the positives, at most 0.09 on the items built as written.
  - `nothing_stated` separated.
  - `waits_on` did not separate, so it stays shadow-only for good.
- One framing sentence moved `nothing_stated` from 0.56 to 0.24.
- The kev-gate K4 lint passes "clear enough to execute", so verdict-shaped questions are rejected on reasoning rather than by the lint.
- Confidence is rescaled: 0.96 comes back as 0.94.

**Changed:**
- **`Lane:` becomes `Route:`, and `lanes.json` becomes `routes.json`.** "Lane" already means the four Standardize sweep lanes, and two items use an informal bold "Lane:" (ROADMAP.md:3339 and :3552, re-checked).
- **Tiers are named abstractly (`top` / `balanced` / `fast`), and you map them to models (O14).** This redraft does not assert model names or prices it did not verify.
- **The realign design's single clarity question is dropped.** It asked "Could a builder … verify its Accept without asking anyone?", which is the verdict form that was refused on holdout. The three fact questions replace it.
- **The planner triggers are merged into one rule D.** The jev-triage design had D1-D4; the realign design had "no M1 item" plus "the pick fails the tier-0 check". The limits are once per 24 h per trigger, a halt after two wakes that only plan, and a fall-through after a second empty D1.

### 3. The realignment (answer 4)

**Adopted:**
- M0 with an inclusion test.
- The Milestone section fields, which code parses.
- The in-flight hold with at most 3 tool calls.
- The one-time bootstrap GOAL. M0 is the newest slice, and rule 4 takes the oldest.
- An interleaved defect track.
- Conditional closures only: nothing closes on the realignment commit.
- The finding that the backlog mirror under-reports owner-blocked items. I re-ran `blocked_audit.py`: **6 disagreements** (373.8, 369.1, 249.12, 377.5, 377.6, and 374.4 unmarked), so `STATUS.md` shows 9 of the 15.
- Nothing prints "oldest dispatchable".

**Changed:**
- **The phase gate is replaced by explicit `After:` lines.** Phase stays as a reporting label. A strict gate would hold Phase 2 layouts behind long-running Phase 1 items: JQ promotion needs at least 20 joined outcomes. Component work (Phase 3) has to interleave with layouts. `After: 394.1, 394.2` on every layout item still blocks layouts before the naming ADR and the app definition, and code enforces it.
- **`Lane: defect` becomes `Track: defect`,** for the same collision as above.
- **249.7 (terminology "also called") moves from parked to folded** into the job index (394.9), since it is the same mechanism for components. The dispositions are now 3 / 23 / 15 / 9 / 15. `classify_r2.py` reconciles all 65 against the raw `[ ]` count (re-checked), and fails when an id is dropped or duplicated (both red-proved).
- **373.6 (the dock) stays with you.** 395.1 builds the frame with the refusal kept and prepares the options. Reversing a recorded refusal is a one-way door.

## What changed from round 1

### Dropped: overruled by your answers

| Round-1 content | Overruled by | Replaced by |
|---|---|---|
| Deliverable = module maps plus "new suite screens only where a module forces a new shape" (Q1a) | Answer 3 | Layouts designed freely per module (396.x). The job index is the retrieval layer, not the deliverable. |
| H1 and verdict point 4, "most modules already exist", used as a scope limit | Answer 3 | Kept only as the prediction baseline |
| Rethink rule "a module that finds zero gaps: stop building it" | Answer 3 | "0 new shapes" is a satisfying outcome, and the module is still built |
| Q2(a): maps live only in `examples/erp-suite`, plus one `llms.txt` pointer | Answer 2 (roundtable) | Generated `jobs.json`, exported by the package (394.10) |
| J3 (Jev decides who looks at a requirement next) | Answer 5's lifecycle | J1 on the three drafted alternatives at triage (§9.3) |
| J4 (Jev picks the model tier) | Answer 1 | `Route:` on the item, and `routes.json` |
| Module id `dsp` for Distribution (H13) | Answer 2 (roundtable) | `distribution`; `dist` reserved |
| Configuration as the first product slice | Answer 3 plus the realignment | The app frame first (395.1); Configuration is the first module (396.3) |
| Profile as one suite screen (L4) | Answer 3 | Part of the frame (395.1) |
| Q9 new-component cap 0/2/3 through admission | Answer 5 | The experimental tier: entry test, cap, N.1-N.3, graduation (§9) |
| Non-goal "112.4 stays blocked" | Answer 2 (roundtable) | Your decision O10, with a recommended re-scope |
| Round-1 M0.3 "roadmap_scope.py computes rule M" | Realignment evidence (it reports archive scope) | `milestone.py` plus `dispatch_status.py` (393.4) |

### Kept: still true after your answers

- **B1:** Jev cannot act. Reframed as the actor table in prompt §1.
- **B2:** Jev as dispatcher or gate is on record as refused. JQ is a *declared third point* and needs your CLAUDE.md amendment (O13).
- **B3:** naming. Resolved by O4.
- **B4:** two dispatchers. Addressed by 393.1 and O1.
- **B5:** no in-flight rule. Addressed by 393.2.
- **B6:** no milestone concept. Addressed by 393.4.
- **B7:** no dependency kind. Addressed by 393.3; `After:` has 0 occurrences today (re-checked).
- **B8:** the uncommitted checkpoint. Now precondition P2, which also covers `.agents/`, `skills-lock.json`, `.gitignore` and `package.json`.
- **H2:** 112.4 overlap. Now O10.
- **H3:** the front door. Now the entry test and G2.
- **H4:** the refused-on-record list. Prompt §9.1. "Freedom to design" does not reopen these; confirm that in O18.
- **H5:** domain expertise. Sourced briefs and a realism reviewer; §8 stage 1.
- **H6:** confidence is rescaled. Fixed in 394.12.
- **H7:** no layout rubric. J2's band stays provisional.
- **H8:** parallel writers. Prompt §10 and 393.12.
- **H9:** counter labels. 393.5.
- **H10:** RESUME.md. 393.8. Still 1,022 lines, with "In flight: nothing … 2026-09-09" at :686 (re-checked).
- **H11:** telemetry. 393.6.
- **H12:** schedule authoring. 396.6, Move-to only.
- **M1:** skeleton versus placeholder. §9.2.
- **M2:** cost. Budgets and the read set.
- **M3:** grill and sweep share. O12.
- **M4:** rule 4 is re-judged every wake. 393.3.
- **M5:** the shadow gate files are uncommitted. P2.
- **M6:** Jev inside a Claude turn saves no tokens. Still true. JQ is justified as an independent logged screen, and any saving needs a driver placement later.
- **M7:** a fourth vocabulary. Now KIND derived from `pattern` (394.9).
- **M8:** `llms.txt` has no Screen kit pointer. 394.10.
- **M9:** rail and icon budget. 395.1.
- **M10:** Jev is local-only (Hypothesis). JQ runs in the local dispatcher.
- **M11:** ledger status lines. 394.8.
- **M12:** data egress. O13. The repo is PUBLIC (`gh repo view`, re-checked), so roadmap item text is already public.
- **M13:** the journey is the unit. Flow-mode critics.
- **L1:** one wake prompt. 393.8.
- **L2:** the outage shape. JQ uses direct HTTPS.
- **L3:** non-Claude agents. O14.
- **L5:** the goods-receipt exception. Now the swap test.

### New in round 2

- **Owner markers are under-reported.** The owner-marker regex misses 6 of 15 owner-blocked items.
- **Nothing prints "oldest dispatchable".** M0 cannot be reached by rule 4.
- **Tier-word collisions.** `preview` and `init` already have other meanings (preview 123 hits, including 377.12; init 26 functions).
- **Readers of `api.components` fail open,** so experimental parts need their own section.
- **The final-path export already exists** (`./css/components/*`).
- **GAP-21's second use was never scheduled.**
- **Queue-screen pilot results:** which questions separate and which do not; the framing sensitivity; the K4 lint gap.
- **The shape base rate.** 0 of 1,039 published names carry a module term.
- **The goods-receipt demo contradicts its own Anatomy** (goods-receipt.astro:109, moderator re-check).
- **322 commits since v0.8.0** (re-checked).

## Owner decisions

These are the same as the structured list returned with this report (O1-O18).

- **Before the bootstrap:** O1-O3.
- **Before ACTIVE:** O4-O14 and O17.
- **Before first use:** O15, O16 and O18.

## What this redraft did not measure

- **Carried from the seats and designs, not re-run by me:**
  - the queue-screen pilot numbers, which are tune-grade;
  - the seat A scanner's 1,039 count;
  - the `@layer` cascade probe;
  - the 0-new-directories figure;
  - the design-preview marker prototype.
- **Model names and prices** for the planner tier.
- **Hypothesis:**
  - whether a job index raises agents' pattern-choice accuracy (396.5 measures it);
  - the planner's token cost;
  - each module's gap yield;
  - every candidate shape (check matrix, rule table, unit tree, running balance, schedule board, `workspace`).
- **Whether the 375.11 workflow is still running.** The repo cannot show this, so P3 is written as a condition.
- **The item numbers 393-397 assume nothing lands first.** P5 re-checks them before pasting.
