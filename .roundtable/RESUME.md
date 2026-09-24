# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **four** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, `polish_requeue.py
> --verify-stamps`, and `check_correction_sites.py` (346.1). All four REPORT;
> none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## GOAL — set 2026-09-23 (second, owner-requested): COMPLETE 2026-09-24 03:02.

Cleared in rule order and pushed (`ae053854`): **rule 1** — 375.9, 375.10,
376.2, 376.4, plus the 373.3/373.4 remainders; **rule 2** — Slice 376 (4 of 4
lanes) and the 376.8 archive sweep (ROADMAP.md 15,977 -> 9,314 lines);
**rule 3** — Slice 377, the Objective grill of 373-376
(`.roundtable/grill-objective-373-374-375-376-2026-09-24.md`: 47 of 47
load-bearing claims hold; 35 of 37 findings survived adversarial verification).

**Since the goal closed (wake of 2026-09-24 03:25):** P0 377.1 (a real
right-click now opens the context menu — a menu asked for mid-press opens after
the release) and P0 377.2 (the launcher re-filters on close) both LANDED and
pushed (`29365089`). Rule 1 is clear.

**Rule 2 ran at 04:15:** Slice 378, 4 of 4 lanes, all clean. Counters now
Standardize 0 / 4, Objective 1 / 3.

**Rule 4 since then:** 320.3 (ClassRef chip spacing -> the ApiTable token)
and 345.1 (`.bo-motion-spin` owns `display: inline-block`; the demo glyph no
longer orbits) LANDED and pushed (`7d0ccc44`).

**Rule 3 ran at 06:38:** Slice 379, the Objective grill of 345 and 378 (320
narrowed out; Slice 322 grilled it). 26 claims reproduce; 12 findings, all 12
survived, every one fixed or corrected in `2fad3cc7`
(`.roundtable/grill-objective-345-378-2026-09-24.md`). Counters now
Standardize 2 / 4, Objective 0 / 3.

**Rule 4 at 07:06:** 346.1 LANDED (`f8856986`) — 13 of 59 superseding
commits left a stale copy (17 sites, only 2 hidden by a wrap), so
`scripts/loops/check_correction_sites.py` now lists the other copies of a
superseded number and runs from `record_iteration.py` as a fourth REPORTED
advisory. Counters: Standardize 3 / 4, Objective 1 / 3. **Next by age: 348.1.**

**Rule 4 at 08:29:** 335.1 LANDED (`0756cafb`) — the owner, live in the
session, authorised a throwaway discussion; #3 appeared in the REST intake as
`200 len 1` and was deleted (`200 len 0`, 404, NOT_FOUND). Counters now
**Standardize 4 / 4 OVERDUE**, Objective 2 / 3 [335, 346].

**Rule 2 at 09:09:** Slice 380, the Standardize sweep, 4 of 4 lanes on a clean
worktree of HEAD (lanes 1-3 no delta; DESIGN.md re-decided HONEST, "the
control" retired; 346.1's correction rule moved to Operating rules).
Counters now Standardize 0 / 4, **Objective 3 / 3 OVERDUE [335, 346, 380]**.

**Rule 3 at 09:40:** Slice 381, the Objective grill of 335.1, 346.1 and Slice
380 (`60235d9c`): 45 claims reproduce, 27 of 33 findings survived. Fixed:
`record_iteration.py` now checks the recorded commit; the correction check
fails loudly; lane 4's cut rule ignores relocations; the intake command runs
locally; §6's Exit requires the thesis section. Filed 381.1 and 381.2. 377.5
now names **six** unreleased P0 fixes, including issue #1's promised one.
Counters: Standardize 0 / 4, Objective 0 / 3.

**Rule 4 at 11:02:** 348.1 LANDED (`bc79e235`) — the slice-id check's absent
line is hedged (7 of its 127 firings held a figure), and LOOPS.md now says a
report from it is the normal state (216 of 244 revisions). Counters:
Standardize 1 / 4, Objective 1 / 3.

**Rule 4 at 11:31:** 349.1 LANDED (`03485ac9`) — rule 3's text now says
"slices with work landed", which is what its counter always counted (of 72
past grills armed that way, only 42 had three slices closed). Counters:
Standardize 2 / 4, Objective 2 / 3 [348, 349].

**Rule 4 at 11:57:** 350.1 REFUSED on measurement (`661bc668`) — rule 2 keeps
counting Continue rounds; lane 4 had material on every multi-commit window,
and a no-input lane is now written "unchanged by construction". Counters:
Standardize 3 / 4, **Objective 3 / 3 OVERDUE [348, 349, 350]**.

**Rule 3 at 16:37:** Slice 382, the grill of 348.1, 349.1 and 350.1 (`0ed584cd`):
19 of 22 findings survived. Each closure's own correction carried an error:
348.1 called a correct 8-of-86 unreproducible; 349.1's rule-3 wording still
missed that the counter ignores outcome; 350.1's no-input shortcut had the
wrong inputs and skipped the figure comparison. All fixed. Counters:
Standardize 3 / 4, Objective 0 / 3.

**Rule 4 at 17:32:** 352.1 LANDED (`135fb21b`) — po-app's harness now names an
unbuilt `packages/core/dist` (the missing files, and that it is build state)
instead of letting a gate report a select-all defect; red-proved with `dist`
moved aside. Counters: **Standardize 4 / 4 OVERDUE**, Objective 1 / 3.

**Rule 2 at 18:00:** Slice 383, the Standardize sweep, 4 of 4 lanes on an
isolated clean build (worktree with its own `npm ci`, realpath check passed,
`dirty: false`): lane 2 unchanged by construction, lanes 1 and 3 match their
base, lane 4 cut 101 words of today's narrative (7,824 -> 7,723). Counters:
Standardize 0 / 4, Objective 2 / 3 [352, 383].

**Rule 4 at 18:51:** 352.2 LANDED (`37a704a2`) — the data-table page's
style-flush column is kept: on a recorded M4, two sittings put both columns at
the same fraction of the published figures, and the page now says so with the
command. Counters: Standardize 1 / 4, Objective 2 / 3 [352, 383].

**Rule 4 at 19:29:** 353.2 LANDED (`633ff058`) — `dispatch-region-words` is now
recorded by the instrument (region figure, commit in the row) on every
Standardize row; the hand-taken history mixed body and region figures.
Counters: Standardize 2 / 4, **Objective 3 / 3 OVERDUE [352, 353, 383]**.

**Rule 3 at 19:44 (owner-requested now):** Slice 384, the grill of 352.1,
352.2, 353.2 and Slice 383 (`eec86ae2`): 31 of 35 findings survived. The
data-table page's style-flush reading depends on the Chrome build (14x on
Chrome 153, 28-31x on 141, same M4), not the machine — page corrected; the
po-app harness now catches a stale dist; metric sampling fixed; rule 5 reads
STALE again, honestly (the names it can act on were last sampled 09-19).
Filed 384.1. Counters: Standardize 2 / 4, Objective 0 / 3.

**Rule 4 at 21:45:** 362.1 LANDED (`2fc94372`) — `astro check` with
`noUnusedLocals` is now a docs build gate (`check:types`, 164 files, 562 -> 0
errors). It found a stray "))}" rendered on the live /reference/tokens/ page
since 2026-08-16, now removed. Counters: Standardize 3 / 4, Objective 1 / 3
[362].

**Wake of 2026-09-25 (goal: rule 3, then push):** Slice 386 LANDED — the grill of
362.1, 369.2 and Slice 385. Headlines hold; 385's own write-up carried four wrong
or unmeasured figures, corrected in place. Filed 386.1 (no gate keeps the print
reset true on a new standalone page). Counters: Standardize 0 / 4, Objective
0 / 3, rule 5 still STALE. Next wake: rule 4 — oldest open item not owner-blocked
(372.1 or 386.1; check `STATUS.md`). `test:axe` 128x2 clean, `check:layout` 128,
core tests 174 green before the push.

**Wake of 2026-09-24 22:00-22:10:** 369.2 LANDED (`6a85e048`; the ten standalone
pages' own unlayered `body` beat the layered reset, each now restates the print
literals). Then rule 2: Slice 385 (`6ec0e8da`), Standardize 4 of 4 lanes on a
clean worktree, plus the thirteenth archive sweep — 21 closed slices moved
verbatim, ROADMAP.md 10,140 -> ~6,780 lines. Counters now Standardize 0 / 4,
**Objective 3 / 3 OVERDUE [362, 369, 385]** — the next wake dispatches **rule 3**,
the grill of 362.1, 369.2 and Slice 385. Nothing pushed this wake; CI still has
not run `check:types`.

**SESSION HANDED OFF 2026-09-24 ~22:00 — the owner is starting a new session.
This session's loop is STOPPED; nothing is in flight, the tree is clean except
the owner's own uncommitted files.** The next session starts at Step 0 here.

**Next wake:** rule 4 — the oldest open item not owner-blocked, **369.2** (10
of 128 pages never get the print reset on `body` — user-facing). One more
Continue round brings rule 2 to 4 / 4.
**The archive sweep is DUE at the next rule-2 sweep:** `roadmap_scope.py` read
41.0% / 10,010 lines at Slice 384, past both halves of the 5,450-line / 40.6%
trigger. **Rule 5 reads STALE** honestly: the names it can act on (`claims`,
`bundle-gz-kb`) were last sampled 09-19 / 09-03 — record one when measured, or
say it could not be evaluated. **CI has not yet run the new `check:types`
gate**; watch the first push's run.

**Lane-run note:** run the Standardize lanes on a build of HEAD without the
owner's uncommitted screen-kit edits, which otherwise enter lane 3's total
(Slice 379). **Recipe that worked (Slice 383):** `git worktree add --detach
<dir> HEAD`, then `npm ci` inside it (not symlinked `node_modules`, which
builds against the main checkout's `packages/core`; `ENVIRONMENT.md` §3c), then
the realpath check, then build core and docs and run the lanes there. The
§3 shortcut's base is now `330051e0` (Slice 383).

**Row-label trap, found by `dispatch_status.py`:** record rows that begin
`P0 377.1 — …` name no slice to the rule-3 counter (it warns "none names a
slice"). Lead an item row with its id — `377.1 — P0: …` — so the counter can
read it.

**Owner decisions now queued** — the two new ones are the grill's headline:
**377.5** (release the unreleased fixes — six of them P0 per Slice 381 — or record
why not) and **377.6** (is busy-office-erp the named first user?). Plus the
standing set: 112.3/112.4, 296.3, 373.6, 373.8, 369.1, 273.2, 374.4.

**UNCOMMITTED FILES, classified 2026-09-24 — do not trust an older label.**
The 373.3 and 373.4 hunks that sat here (DESIGN.md, Gallery.astro,
primitives.astro, extract-acr.mjs) were NOT owner checkpoint; they landed in
`24ca80b0` / `5d0146f5`. What remains uncommitted is the owner's 2026-09-20
procurement-journey checkpoint (examples/erp-suite/*, journey/, check-journey.mjs,
screen-kit.astro, suite.json, gen-suite-index.mjs, erp-suite-gaps.md,
package.json's suite:journey) and the 2026-09-21 Jev shadow gate
(.gitignore line, scripts/loops/review_depth_gate.*, grill-kev-in-the-loop).
Both await an owner decision to commit; HEAD builds green without them.

**Owner-blocked, do not touch:** 374.4 (border-strong token re-value; Jev
escalated it at 0.54, so it is a visual-weight preference), 373.6 (dock
hide-on-upward-scroll; two refusals stand and the reversal is unwritten),
373.8 (docs IA, 17 groups to 7). Plus, outside these slices: 112.3/112.4,
296.3, 369.1, 273.2.

**Dispatcher counters (2026-09-24 21:54, `dispatch_status.py`):** Standardize
3 / 4, Objective 1 / 3, 0 open P0; rule 5 STALE. Re-read them; never trust this line.

**A trap that has bitten twice — read before touching ROADMAP.md.** Build the
staged content from HEAD BY CONSTRUCTION and write the same bytes to the
working tree. Do not `git add ROADMAP.md` from a working copy that may be
stale: earlier commits staged blobs straight to the index, the working tree
drifted, and a later `git add` silently reverted four closed items to `[ ]`.

## PLAN — work this order.

**Base state.** `main` pushed after 362.1's record (session handed off). Last full run green
on this tree (2026-09-24 06:30): core build, 174 tests, docs build 0 FAIL,
`check:claims` 300, `test:axe` 128 pages x 2 widths 0 violations,
`check:layout` 128 pages. The files still uncommitted are the 2026-09-20 owner
checkpoint (erp-suite journey, DESIGN.md, Gallery.astro, …) — not this GOAL's
work; do not stage them with an item.

**Phase 1 — verify and land the uncommitted 373.x work. Highest priority: it
is the only thing at risk of rotting.** Runtime surface is small and contained:
`alert.css` (+42), `data-table.css` (+38), `offcanvas.css` (+46),
`tag-input.ts` (+26), `tag-input.test.ts` (+105), `create-ui` (+6). Everything
else is docs and records.

- **Do not land on the prior session's acceptance.** Those claims were written
  under a retired two-agent arrangement (`history-two-agent-2026-09.md`) and
  their evidence pointed at `/private/tmp` paths that no longer exist. Re-verify
  each item against the artifact before committing it. This is the completion
  gate in `jev-rubrics.md`: PASS needs the checks to pass AND the criteria
  supported; missing evidence is UNVERIFIED, not PASS.
- **Before marking any item `[x]`, run the completion review — actually call
  `jev_evaluate`, one batched call per landing round — and quote the number in
  the commit. The rubric's vocabulary is not the review.** Skipped on the first
  round and it cost two wrong positions (373.7 read 0.35, not "one line short").
- Land per item, smallest coherent commit each, so a bad one is revertable
  alone. Order: 373.2 (docs-only, independent) then 373.3, 373.4, 373.7, 373.5.
- Record each with `scripts/loops/record_iteration.py` after its commit.

**Phase 2 — 374.7, the `check:contrast` coverage guard.** The base rate is
measured and says a gate earns its keep: **7 of 36 interactive boundary
declarations are below 3:1 (19%)**, while the same predicate without the
interactive filter is 44 of 78 and would just be an opinion about
`--bo-color-border-default` delivered 44 times. Four of the seven are recorded
nowhere else; the strongest is `.bo-data-table tbody tr:hover` at 1.34:1, where
`bg-hover` and `bg-muted` are the same value so the outline is the only hover
channel. A gate cannot tell an interactive edge from a decorative one, so the
enforceable property is a SHAPE: every edge pairing is in `PAIRS` at 3:1, or in
an exemption map with a reason naming the other channel, or in a TODO list as
debt.

**Phase 3 — the verification gaps**, in this order: 369.2 (10 of 128 pages miss
the print reset on `body`), 375.4 (no gate validates class names inside
copyable samples — measure the base rate first, finding zero closes it), 375.5
(the direct Qty-to-Add pointer path is uncertified — re-check the premise, it
is another wake's measurement).

**Do NOT touch these without the owner.** Seven decisions are queued for one
sitting: 112.3/112.4 (pilot briefs), 296.3 (is "secure" in scope), 373.6 (dock
hide-on-upward-scroll; two refusals stand and the reversal is unwritten),
373.8 (docs IA, 17 groups to 7), 369.1 (dark-theme printing), 273.2 (`dry++`),
and 374.4 (token re-value — Jev escalated it at 0.54 confidence, so it is a
visual-weight preference, not a technical fact).

**Standing constraints.** Publishing stays owner-triggered. Before a push run
`test:axe` and `check:layout`. Before trusting a screenshot confirm one
listener: `lsof -nP -iTCP:8081 -sTCP:LISTEN`. A Jev outage is UNVERIFIED, never
PASS.

## 2026-09-20 — owner direction, local uncommitted checkpoint

**Local preview (corrected 2026-09-22):** `:8081` is the Podman container, as
`CLAUDE.md` prescribes — `podman build -f apps/docs/Containerfile -t bo-docs .`
then `podman run`. The paragraph that stood here described a temporary host
server on 127.0.0.1:8081 serving a frozen snapshot, and it was wrong in a way
worth recording: that server and the container were bound to the **same port**
on different stacks (node on IPv4, gvproxy on IPv6), so `http://localhost:8081`
answered from whichever the client preferred, and the IPv4 answer was two
commits and 21 hours stale. The prescribed stale-image defence
(`curl .../_astro/*.css | grep <new-class>`) cannot catch that, because it is a
different server rather than a stale layer. The host server was stopped and its
`/private/tmp/boui-*` files deleted on 2026-09-22. **Before trusting a
screenshot, confirm only one process is listening:**
`lsof -nP -iTCP:8081 -sTCP:LISTEN`.

**Drawer subset accepted locally (2026-09-21):** Claude returned the corrected
paired fixture in `exchange/from-claude/boui-drawer-test-review-20260920-03.md`.
Codex inspected it, added final setup/dimension guards after the ready-for-review
handoff, and independently ran the complete live claims suite: **209/209 pass**.
The actual four paired assertions also pass against 8081; five isolated mutations
fail the intended setup/geometry assertions. No runtime or preview was changed.
The earlier independent 1440/390 × light/dark drawer/rail checks remain valid.
The final guards in check-claims.mjs belong to this accepted integration; preserve
them. The later acceptance blocks below cover the remaining 373.3 criteria.

**Journey review complete and accepted (2026-09-21):** Claude returned
`exchange/from-claude/boui-journey-review-20260920-01.md` with no blocking findings.
It independently ran suite:build (31 screens) and check-journey.mjs, including
navigation/queue parity, focus, conflict/retry/replay, 12 viewport/theme captures,
accessibility, RF-only assets and no-JS checks. Codex reconciled those findings
against current source and existing assertions. No new journey edit or repeat
review is requested; hardware and human task-time evidence remain outside this
browser experiment.

**Sticky-table subset accepted locally (2026-09-21):** Claude acknowledged
review 05, adopted density-aware `tbody :focus` scroll margin, removed the extra
token and strengthened the fixture guards. Codex independently ran **212/212
claims, exit 0**, and **280 exact-focus samples across 10 scenarios**, both
directions with zero header intersection. The exact permanent checks reject
removed grouped rows, downgraded density and disabled margin in isolated pages.
Header sort focus preserves scrollTop 200 at 1440/390; narrow horizontal
scrolling and sticky columns are retained. README/sticky-layer/whitespace checks
pass, and tokens/density.css has no diff. Source implementation remains Claude's;
no source-writing handback was inferred. Evidence and acceptance are in
`exchange/from-codex/boui-toast-actions-20260921-01.md`.

**Toast/form-feedback subset accepted locally (2026-09-21):** Claude finished
review 03 and all isolated negative proofs. Codex independently ran 223/223 claims,
actual exit 0; verified the real demo and rendered copyable recipe across four
viewport/theme combinations; and checked 170 focus samples across six scenarios,
including all expected fields/actions in both directions. A real overlay added
after setup fails the exact permanent geometry predicate with valid setup.
The persistent exposed status region supports repeated saves with one result,
no dismiss button and no focus theft. README/stamp and whitespace checks pass.
No actual screen-reader announcement is claimed. Source remains Claude's.
Evidence: `/private/tmp/boui-toast-final-claims.log` and
`/private/tmp/boui-toast-acceptance.mjs`, `.log`, `.json`; narrow screenshot inspected.
The previous reviews remain in exchange files as history. The adjacent theme-key
and accessibility-guidance findings in Claude's reply are retained for separate
verification/triage and are not part of this next task.

**Layout contract accepted locally (2026-09-21):** Claude acknowledged review
02 and returned the corrected contract and visible-scrollport guard. Codex
independently passed 230/230 live claims (actual exit 0), the 128-page layout
gate and scroll reachability over 810 containers on 118 pages at both widths.
Four normal viewport/theme cases pass the exact production measurement/predicate;
four isolated zero-height cases now fail it while overflow and scrollTop still
behave. Four screenshots were inspected with no horizontal page overflow.
Link/metadata/sticky-layer and README facts/stamp checks pass. The only remaining
900px mention is the unrelated sidebar height measurement. Source-derived band,
padding and sizing and the previous 373.2 correction are preserved.

All implementation criteria of 373.3 are now accepted locally; no commit, push,
release or publication occurred. Full evidence and limits are recorded in
`exchange/from-codex/boui-layout-acceptance-20260921-01.md`. The permanent negative
case shares the production predicate but duplicates the measurement; Codex's
independent proof invokes both exact helpers. This is Chromium geometry evidence,
not physical-device safe-area or screen-reader testing.

**Tag-input focus subset accepted locally (2026-09-21):** Claude acknowledged
both boui-tag-remove-focus-20260921-01 and the changelog integration decision.
Codex inspected the runtime/test/docs changes, independently passed all 172
behavior tests across 29 files and 235/235 live claims (actual exits 0), and
ran 16 keyboard removal scenarios across four viewport/theme combinations.
The same production helpers reproduce four old-build failures against the
frozen accepted layout preview, while the new build restores each group's field.
Four trusted-key event/consumer-focus cases and four conditional/Backspace cases
pass; event timing/target/bubbling/value remain intact. All four screenshots were
inspected. Link/metadata/README facts/stamp and whitespace checks pass.
Evidence: `exchange/from-codex/boui-tag-focus-acceptance-20260921-01.md` and
`/private/tmp/boui-tag-acceptance.{mjs,log,json}`. Codex added a Fixed entry to
CHANGELOG.md explaining measured compatibility, including asynchronous redirects.
Only the tag-input subset of 373.4 is accepted; the whole item stays open.
No commit, push, release or publication occurred. The full docs integration build passed (actual exit 0). The accepted host
preview now serves 2026-09-21T01:26:00.535Z; four viewport/theme removals and
the procurement journey were rechecked. Podman and other containers were untouched.

**Editable-grid subset accepted locally (2026-09-21):** Claude acknowledged
review `boui-editable-grid-review-20260921-03` and returned ready with no blockers.
Codex inspected the actual source and independently passed **250/250 live claims**
(actual exit 0), **32 trusted-key removal scenarios**, **16 initial/added dirty
row name cases** across live/copied recipe × 1440/390 × light/dark, and four
isolated missing-state-phrase cases rejected by the exact production predicate.
Focus lands on the exact next/previous Remove or own Add; stable row identities,
conditional focus, scoping and the self-contained recipe are verified. Save
preserves `— unsaved changes`. Eight styled cases have no document overflow;
narrow live-dark and sample-light screenshots were inspected. Link/metadata,
README facts/stamps and whitespace checks pass. Evidence and limits:
`exchange/from-codex/boui-editable-grid-acceptance-20260921-01.md`,
`/private/tmp/boui-grid-r3-acceptance.{mjs,log,json}` and
`/private/tmp/boui-grid-r3-final-claims.log`. This is Chromium focus/AX/geometry
evidence, not physical AT speech. No core runtime source or API changed here.
Source ownership was not transferred to Codex. All 373.4 implementation work is
not complete: list/kanban guidance and the generated ACR row remain.

The existing 8081 host preview now serves accepted build
`2026-09-21T03:15:35.767Z`, sha `6b72a778`, dirty=true. Four actual-preview
viewport/theme focus/name cases and the procurement journey pass; evidence:
`/private/tmp/boui-grid-preview-check.{mjs,log,json}`. The old snapshot is retained
at `/private/tmp/boui-preview-before-grid-20260921-0332`. No listener restart,
Podman change, commit, push, merge, release, publication or deployment occurred.

Claude's separate report of a direct Qty-to-Add click missing due to the existing
focus-shown message changing row height is retained for verification/triage.
The Add helper blurs/settles before clicking; these checks do not certify that
direct pointer path. It is not silently folded into the next assignment.

**Move guidance and ACR accepted locally (2026-09-21):** Claude explicitly
acknowledged review 02 and returned round 3 ready. Codex inspected the actual
diff and build `2026-09-21T12:44:38.784Z`, independently passed **252/252 live
claims**, **36 exact recipe scenarios**, **8 actual printed-caller async cases**
with real outside clicks or retained ownership, and **two exact-predicate
negative cases** for wrong-control and failed focus. All processes exited 0.
The unchanged source-relative ACR collision proof and pointer-picker evidence
remain applicable. Twelve documentation viewport/theme cases, 14,608 links,
1,159 metadata assertions, README facts/stamps and whitespace pass. Narrow dark
changed sections were inspected. Full evidence and limitations are in
`exchange/from-codex/boui-move-guidance-acceptance-20260921-01.md` and
`/private/tmp/boui-move-r3-acceptance.{mjs,log,json}`.

All implementation acceptance criteria of **373.4** are now satisfied locally,
together with prior tag-input/grid acceptances. Checkbox remains open pending
landing; no commit/release. The permanent callerOrder check uses `.focus()` and
composes the functions; Codex's separate proof executes the actual printed
async caller with trusted pointer input. This distinction is recorded rather
than claiming stronger permanent coverage. No source-writing transfer or Codex
implementation edit occurred. Review 02 is answered; do not resend it.

The accepted host preview at 8081 is now `2026-09-21T12:44:38.784Z`, dirty=true;
backup `/private/tmp/boui-preview-before-move-20260921-1256`. Four exact grid
focus/name cases and the procurement journey are rechecked in
`/private/tmp/boui-move-preview-check.{mjs,log,json}`. No listener/Podman restart.

**AI-agent composition path accepted locally (2026-09-21):** Claude explicitly
acknowledged `boui-agent-composition-20260921-01`, accepted ownership with no
conflicts and returned ready. Codex inspected source/package diff and build
`2026-09-21T13:25:38.091Z`. The extracted starter works outside this repository
with its shared commands module included. Actual generated and documented
commands pass valid markup and reject the intended typo using a locally packed,
offline-installed core. Four rendered viewport/theme cases verify command/order,
URLs and five-item count; no page overflow. Links/metadata/whitespace pass.
The lean llms baseline is preserved byte-for-byte, plus **556 bytes**, now
**50,538 bytes**. Pilot input change/delta is recorded in pilot-112/README;
112.4 stays blocked and no owner brief/pick was read or authored.

All **373.7 implementation acceptance criteria** now pass locally. Full evidence
and limits: `exchange/from-codex/boui-agent-composition-acceptance-20260921-01.md`,
`/private/tmp/boui-agent-review.{py,log,json}` and
`/private/tmp/boui-agent-browser-review.{mjs,log,json}`. Checkbox stays open
pending landing; no commit/release. Supported CLI reconfirmed the same peer and
checkout. Its busy status did not prompt any interruption or duplicate edit.

The accepted 8081 host snapshot is now `2026-09-21T13:25:38.091Z`, dirty=true;
backup `/private/tmp/boui-preview-before-agent-20260921-1336`. Four served-page
cases and procurement journey are checked in
`/private/tmp/boui-agent-preview-review.{log,json}`. No listener/Podman restart.

**15:11 UTC discovery update (2026-09-21):** no new durable handoff or sample
correction acknowledgment yet. The local build advanced to
`2026-09-21T15:07:44.976Z`. Supported `claude agents --json --cwd` now reports
**session `c878a614-03e4-4480-87d2-f443a2ea1a39`**, while retaining PID 3714,
name `busy-office-ui-8f`, original startedAt and exact checkout; status busy.
This differs from the last durably acknowledged session below. Treat it as a
candidate identity transition, not automatically the same logical conversation.
No message was sent, no restart/resume occurred, and source ownership is
preserved. Before any next send, reconfirm native discovery/name/ref and
corroborate the new session against a durable peer reply or supported identity
exchange. Do not send another assignment or assume historical ref/UUID mapping
still applies. Continue checking durable replies first; accepted preview is
unchanged. No user action is presently required.

**373.5 launcher ACTIVE — safe checkpoint received (2026-09-21):** Claude's
shared reply now says the owner returned priority to the roadmap, its loop work
is finished/self-contained, and the launcher is active with no conflicts.
Same peer `busy-office-ui-8f [01621f]`, session
`fa641e32-24d1-4321-abf0-64c7e25015ca`, exact checkout; supported discovery and
native ListAgents corroborate the busy peer. The earlier scheduling hold and
status checkpoint are answered; do not repeat them. Preserve the separate gate
files, grill and .gitignore addition; no review/adoption/execution of the gate
by Codex is claimed.

Claude owns app-launch.astro, scoped launcher claims and the shared reply under
`exchange/from-codex/boui-launcher-20260921-01.md`. Core-source task baseline
(107 files) is `/private/tmp/boui-launcher-core-source-baseline.json`; preserve
the already-dirty prior source. The gen-llms comment is corrected accurately.
The inner callerOrder comment now distinguishes programmatic focus; its enclosing
comment still claims a real click and remains a comment-only followup. No
executable changes to accepted cases are authorized by those comment fixes.

**Confirmed save-recipe defect / bounded correction:** Claude reported the
373.3 copyable in-flow save sample includes nonexistent `bo-btn--primary`.
Codex extracted that ACTUAL code from the accepted 8081 snapshot and ran the
existing consumer markup validator: exit 1 naming the invalid modifier. The
current alerts.astro source had already dropped it (mtime 14:34:08 UTC), and
its extracted saveConfirmMarkup passes, exit 0, four bo-* uses. No Codex source
edit. Evidence: `/private/tmp/boui-save-recipe-review.json`. Valid `bo-btn`
styling remains; the defect is an invalid extra modifier and consumer-validation
failure, not a completely unstyled control. The prior focus/status acceptance
is not broader proof of sample-class validity. Frozen preview remains unchanged
and still contains that typo pending the reviewed build.

Codex sent `boui-launcher-sample-correction-20260921-01`: authorize alerts.astro
ONLY for this one invalid-modifier removal, preserve the existing edit, reconcile
its provenance with the earlier "untouched" reply, and validate the actual
rendered copyable recipe after the normal full build. Also correct the remaining
enclosing callerOrder description, comment-only. No new sample-scanning gate,
broad audit or other alerts change is assigned; the wider coverage question is
unmeasured and retained separately. Codex made no competing build/source edits.
Native queue ID `2c7f14d0-9311-4a24-9411-42cff9bcc9dc`, no hold/refusal notice
observed, relay exit 0; acknowledgment pending. Transport:
`/private/tmp/boui-launcher-sample-correction-relay.jsonl`.

Record generators and floor/slice-reference/vendor/import/whitespace gates pass.
Index regeneration also discovered the separate new
`grill-kev-in-the-loop-2026-09-21.md`; it is preserved, not reviewed or
implemented as part of this assignment. No KEV invocation by Codex is claimed.


**Latest owner acceptance:** “As you proposed” authorized the bounded
desktop/mobile/RF procurement experiment. It is built under
`examples/erp-suite/journey/`, linked from suite home and docs Screen kit, with
example-owned fixtures and no new core API. Read its README and GAP-22 in
`erp-suite-gaps.md` for behavior boundaries and the native-validation finding.
The suite now builds 31 screens. Verification includes the dedicated journey
check and suite audit; the final experiment report carries current results.
This remains local and uncommitted. Current assignment is recorded above;
this experiment does not close 373.6 or claim real RF-device evidence.

The owner asked for a comprehensive ERP UI framework emphasizing simplicity,
scale, performance, AI-agent usability, end-to-end delivery and graph engineering.
Read ROADMAP's **Objective** (ROADMAP.md:8) and
`grill-erp-framework-direction-2026-09-20.md` for the challenged scope and evidence.

**373.2 is implemented and verified locally; changes are uncommitted and nothing
is published.** Codex edited the five affected documentation pages, regenerated
README facts and both READMEs, and recorded the direction. Docs build, rendered
39/39 pattern guidance, 20 viewport/theme content cases and the 128-page layout
gate pass. Core validation passed through README checks; its final package check
passed separately with a writable temporary npm cache after a sandbox error.
No core runtime source changed. 373.3 is also locally accepted. The next development item is **373.4**, then
373.7 and 373.5. The September 19 and earlier blocks below are historical handoffs.

The code graph and SQLite mirror were refreshed and reconciled; document/semantic
edges are retained historical extraction and must be verified from current prose.
The journey's independent review is complete and accepted. No iteration is
recorded as landed without a commit.

## 2026-09-19 — a LOCAL, owner-driven session, not a router wake

The owner pasted a master prompt (five UI workstreams: docs IA, app-shell
contract, dropzone / reorder / dock / launcher, layout recipes). It was triaged
as **Slice 373** (`26ba75a1`) and its first item landed as `42c4e4b0`. **Nothing
was pushed.** `origin/main` was 81 commits ahead at the start; the local tree
was fast-forwarded first (`git pull --ff-only`), so read `git log` rather than
trusting the sha in the paragraph below.

- **Slice 373 has 10 items.** `373.1` is `[x]`. `373.2`-`373.5` and `373.7` are
  dispatchable, in that order; `373.2` is documentation-only and independent, so
  it is the next ready slice. `373.6` (the dock — it reverses two recorded
  refusals) and `373.8` (the 7-group sidebar — it contradicts the 2-level cap)
  are OWNER CALLS and block nothing else. `373.9` and `373.10` are questions,
  not builds.
- **The prompt's own budget was ≤3 slices per invocation:** 1 used.
- **Counters read after recording:** Standardize 2/4, Objective 1/3, Optimize ok.
  The Objective row's `[373]` label was resolved from this session's `--item`
  text, which begins `373.1` — the label reflects how the row was written (see
  the arming-label note below), so it is not evidence a slice CLOSED.
- **Where the evidence is:** each item's Accept lines carry the property, and
  373.1's DONE block carries every command. The red-proof scripts and the
  trusted-drop parity probe live in the session scratchpad and are NOT in the
  repo — the durable form is the 24 new cases in `check-claims.mjs`
  ("file-dropzone parity" onward).
- **One trap to carry:** in `check-claims.mjs`, replacing the document
  (`page.setContent`, `document.write`) or opening a second `browser.newPage()`
  makes a `page.click` many claims later hang until the 120s protocol timeout,
  with every assertion in the new block passing and an error that names only
  `Runtime.callFunctionOn`. The no-JS dropzone claim is therefore LAST.

## In flight: nothing

Last updated 2026-09-09 (**cloud** wake, scheduled routine). Working tree clean
at hand-off apart from this file, `ROADMAP.md`, the new grill report,
`loop-log.md`, `loop-metrics.jsonl` and the regenerated mirrors.
**No collision this wake** — `origin/main` read `61e9d92f` at Step 0 and again
at the mandated pre-commit fetch; it was the local tip both times.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**Every closed id this file names is named as history or as precedent, never as
open work.** `check:resume-slice-ids` reports **11** of them, and the
enumeration below is copied from that report rather than from memory — the
first draft of this paragraph listed only six and missed five:

- `338.1`, `339.2`, `351.1` — the items the three arming slices closed.
- `307.1`, `324.1`, `324.2` — the pairing and direction precedents this wake's
  finding is measured against.
- `355.3`, `359.4` — the parser-item refusals, cited where this file declines to
  file a ninth.
- `297.1` — cited in Direction, on whether a wake may comment on issue #2.
- `310.1` — one of the eight standing visual debts.
- `332.1` — cited on `ENVIRONMENT.md` having no size discipline.

Six more (`306.1`, `164.2`, `94.11`, `212.2`, `176.3`, `312.2`) are not in
`ROADMAP.md` at all because they are archived; that is normal, not a finding.

**`372.1` is NEW and OPEN; `353.2`, `350.1`, `345.1` are named repeatedly and
are OPEN — deliberately so.** Nothing here claims an open item that is not.

## ⚠ WHICH RULE FIRES NEXT — **rule 4**, with rules 1-3 all short

`dispatch_status.py`, read immediately after this wake's recording (`LOOPS.md`
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   1 / 4 Continue round   ok
Objective     0 / 3 slices           ok    (reset by this wake)
Optimize      0 wake-date(s) newer   ok
```

**That comparison earned its keep again this wake.** The first draft of this
heading said rule 2 was at **2/4**, reasoning that a landed slice arms it.
Reading the counter says **1/4** — an `Objective` row is not a Continue round,
so this wake armed nothing. Corrected against the instrument, not the
expectation.

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 24 open items). So **rule 4 is the expected
dispatch**, on the oldest genuinely dispatchable item — which is `345.1` unless
a collision moved it.

**The arming label resolved to a SLICE number again**, because this wake's
`--item` text begins `Slice 372 —`. That is the second consecutive deliberate
confirmation of last wake's diagnosis: the label **is not inherently
unreliable — it reflects how the row was written**. Still **no parser item is
filed** (ninth of its kind, refused on `355.3`, `359.4` and `LOOPS.md`'s own
conclusion). Resolve any label you did not write by reading the commit subject
at the row's sha; never treat it as an ordinal.

## What landed: Slice 372 — Objective grill of Slices 369, 370, 371

**Dispatched by rule 3**, `Objective 3 / 3 OVERDUE [338, 370, 371]`. All three
labels were resolved by commit subject before anything was grilled: `338` is an
item id whose slice is **369**; `370` and `371` are genuine slice numbers. No
earlier grill heading names any of the three, and `INDEX.md` reports **4
repeated subject(s)** corpus-wide, none of them here — so nothing was narrowed
out. Report: `.roundtable/grill-objective-369-370-371-2026-09-09.md`.

Step 1 read both intakes with §8's controls — issues **1**, discussions **0**,
`/not-a-real-route` **404** — and triaged nothing. Issue #2's `updated_at` is
unchanged at `2026-09-06T15:10:34Z`, a **sixth** consecutive hand-off.

### The finding: rule 5 discards a metric sample on a reason false at 72 of 73

`per_day_last` keeps only the last sample of each calendar day, on the recorded
ground that *"a wake that samples twice in one day is correcting itself"*. **A
sample separated from the next by a commit cannot be a correction of it** — the
thing measured changed in between. Over all 143 samples:

```
adjacent intra-day pairs with NO commit between:   1   (behaviors_frozen, same minute)
adjacent intra-day pairs spanning >=1 commit:     72   (2 to 50 commits)
```

**The case the rule was built around is the clearest counterexample.**
`LOOPS.md:609` and `dispatch_status.py:933-934` both present `ci-wall-time`'s 26
samples as one wake's burst; that window carries **36 loop-log rows, 35 distinct
commit shas and 5 distinct loops**.

**What it costs:** on **5 of 8** day-paired names the published movement
occurred between no two samples (`dispatch-region-words` **−8** against a true
**−68** — 56 of that gap is convention, body against region; corrected by
Slice 384), and rule 5's own two-consecutive-moves predicate **disagrees between
the two readings on 3 of 8**. Filed as **`372.1`**, cloud-takeable, with the
Accept written as a property — *deciding the day unit is right and only its
justification wrong closes it just as well as changing the unit*.

**Refused, with the measurement:** a gate on *"a sample must not be discarded
when a commit falls between it and the next"*. Base rate **72 of 73**, so it
would be red on a correct tree from its first run.

### What reproduced — every structural claim in Slices 370 and 371

Rule 3 body **907** words; `### Step 0c` **1,520**; dispatch region **7,484**
(7,428 body + **56** heading, the constant `353.2` documents — my first reading
of 7,428 was run down rather than rounded off); `LOOPS.md` **18,241**;
`LOOPS-archive.md` **3,880**; the moved P4 paragraph present in the archive
**exactly once** and absent from `LOOPS.md`; lane 2 identical at
`74 · 242 · 230 · 8`; lane 3 identical at `119 pages · median 798 · 114,124
words`. **Nothing in 370 or 371 failed to reproduce.**

**Not re-run, and named rather than implied:** Slice 371's 25-revision series
and its "all three quoted fragments are in P5" check need pre-cut revisions and
were not replayed. **Slice 369's print figures were not re-measured at all** —
a multi-hour headless-Chrome + PDF re-derivation, and the grill spent its budget
on the finding instead. Its two browser-free citations were checked and are
exact.

## Three defects in this wake's own work, all caught before publishing

1. **Authorship inferred from timestamp proximity.** The first draft said both
   `dispatch-region-words` samples came from slices in the arming set. `git
   blame` says the **7,552** was written by the wake that recorded **Slice 363**
   (`4cfb8b2c`), and **Slice 370 recorded no sample at all**. Caught by running
   the very blame the paragraph was about to cite `353.2` for. The finding is
   unchanged; the narrative sentence was wrong and is now sharper for being
   measured.
2. **The commit-boundary probe was dead on its first run** — `r.get("sha")` on
   rows from `dispatch_status.rows()`, which returns only `at`/`loop`/`item`. It
   reported **0 commits between for 17 of 17 buckets**, and the
   identical-value-across-inputs tell is what caught it. Believed only after a
   positive control (9 shas on 2026-09-09) **and** a negative control — the
   detector must be able to return 0, and does, exactly once.
3. **A paraphrase-grep reported a false absence.** `grep -cF` for `"12 of 17"`,
   `"crossings 51"`, `"18 rows"` — `ROADMAP.md`'s wording for the moved text —
   returned **0** in both files while the text is present under the archive's
   own wording. Not reported as an absence; caught by opening the paragraph.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is **structural rather than a judgement**: `git diff
--stat` was read, and the slice diff is `ROADMAP.md`, the new grill report and
the loop-record files only. **No CSS rule, no docs page, no `.astro` file, no
generated artefact, no shipped JS.**

**The eight older debts are unchanged and unspent**, counted from the previous
hand-off's enumeration rather than carried as a number: Slice 352's two
(`/components/data-table`'s performance table and `/concepts/scale`'s scaling
table, both at 1440 and 390 in both themes); Slice 345's two
(`/patterns/output-form` **in print** and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths); and the four older —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates.** This container arrived with **no `node_modules`** again (`npm ci`
first). The seven the wake prompt mandates were then run, every one green,
figures read off their own output: core `build` (`check:package` **185** files,
size check **139** payload files / **382.8 kB gz**), core `test` (**165** tests
/ 29 files), `docs:build`, `check:claims` (**176** live, **3 NOT VERIFIED**,
which is `ENVIRONMENT.md` §6b's container fact, not a regression), `test:axe`
(**128** pages × 2 widths, **zero** violations), `check:layout` (**128** pages),
`check:repo` (`slice-refs` **1030** assertions / **354** slice sections,
`vendor-names` **624** files).

**Said precisely: the full 17-entry CI set was NOT run this wake.** The prompt
named seven and those seven ran; the other ten (`lint:css`, `check:formatting`,
`check:scroll`, `check:forced-colors`, `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app`, `npm run suite`) were not,
and CI will be the first to run them on this push. The diff is markdown only,
which those ten do not read, but that is a **reason to expect green, not a
substitute for having run them**.

`docs:build` was re-run to exit 0 after the last `ROADMAP.md` edit and again
after this file was written, per `ENVIRONMENT.md` §3b, before the push. It gates
`.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing was recorded this wake, and the reason is the finding itself.**
  `LOOPS.md` was **not touched**, so `dispatch-region-words` is unchanged at
  **7,484**; `gates` is unchanged at **56**; `claims` read **176**, identical to
  the sample already in the pair; `axe-violations` is 0 again and its line
  already reads `NEVER MOVED`.
- **The temptation to record an unchanged value "to help the series" was
  refused**, and deliberately: whether a sample should be written when nothing
  moved is exactly what `372.1` puts up for decision, and pre-empting it by
  changing the convention unilaterally would decide the item by practice rather
  than by measurement.

## The open set is 24 — no P0

> **Stale: this is the Slice 372 hand-off's reading (2026-09-09).** 345.1,
> 346.1 and 335.1 have closed since, and 320.3 too. For the open set, read
> `STATUS.md` or count the `N. [ ]` checkboxes (Slice 381).

`roadmap_scope.py` at the slice commit and the raw checkbox count agree at
**24**. Slice 372 closed **no** item and opened **one** (`372.1`), so the set is
+1 on the previous hand-off's 23.

- **cloud-takeable: 11** — `345.1`, `346.1`, `348.1`, `349.1`, `350.1`,
  `352.1`, `352.2`, `353.2`, `362.1`, `369.2`, **`372.1`** (new). **`345.1`
  remains the oldest of these** and is what rule 4 would dispatch next.
  `362.1` carries Slice 364's amendment on the `include`.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, and the **403** was re-confirmed by
  measurement in Slice 366. A local wake can take it. **Not re-derived this
  wake.**
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**), `369.1` (a palette-wide print behaviour change with
  a visible result).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

11 + 1 + 11 + 1 = 24, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## The archive sweep — re-run it at your Step 0

```
python3 scripts/loops/roadmap_scope.py
  9007 / 14396 = 62.6%    (the reading at 61e9d92f, this wake's Step 0)
```

That is the **pre-slice** figure, deliberately not re-quoted post-hoc: this
wake's slice adds ~200 lines of open-side body while closing nothing, so both
halves of 208.1's ratio move and the sign of the change is not predictable from
the work done — which is the third shape the last three wakes have recorded
against `249.12`.

**Not dispatched by this wake, and the reason is the dispatch**: rule 3 fired,
and a sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md).
**`249.12` is named again** — the open **OWNER OR ARCHITECTURE CALL** on the
archival trigger. **11 targets are NAMED by a still-open item**
(`roadmap_scope.py` lists them) and must be read before moving (236.2).

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit.** `git branch --show-current` answered **EMPTY** at Step 0 — the
container arrived detached at `61e9d92f` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,112**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**).

**Trap 3 (no `node_modules`) bit again.** `npm ci` first, or the build fails
`code 127` on a missing `stylelint` and reads like a toolchain break.

**§4b was respected**: nothing was amended after `record_iteration.py` ran, so
no row points at a stranded sha.

**No `git worktree` and no `git stash` were used.** All five probes (the
day-collapse census, the commit-boundary discriminator with its two controls,
the published-vs-true movement table, the `ci-wall-time` window, the blame
attribution) lived in the scratchpad and never in the repo.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Five things want the owner's attention. The first two are unchanged and are
the two biggest.**

1. **`369.1` — printing from the dark theme puts 19,511 of 26,817 painted text
   fills below AA on paper, across 125 of 128 pages.** Chrome's economy mode is
   what keeps that from being worse, and it is a **UA behaviour no other engine
   is known to share**, so the reading is a floor for Chrome and says nothing
   about the others. The proportionate fix is one `@media print` block
   re-pointing the theme tokens at their light values — a deliberate exception
   to `check:print-tokens`'s own rule, and so the owner's to make.
2. **Issue #2 is open and carries only the triage comment**, with `updated_at`
   unchanged for a **sixth** consecutive hand-off. Slice 317 refuses the
   component with the measurement; Slice 319 corrected a second false claim on
   the page the reporter was pointing at. **Replying and closing is an owner
   action.** Whether a *wake* should post that comment was `297.1`, closed by
   Slice 335 — read it before re-raising.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Three consecutive wakes have now measured the
   share moving for reasons unrelated to how much closed history the file
   carries; this wake adds that a grill closing nothing and writing a long entry
   moves it the other way again.
4. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
5. **`335.1` cannot be settled by any cloud wake.** A local wake can do it in
   one command, or the owner can file a throwaway Q&A discussion and let the
   next wake read it. **[Settled 2026-09-24: 335.1 closed on a real
   discussion, `0756cafb`.]**

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages.

**`ENVIRONMENT.md` was NOT touched this wake.** The standing note holds: the
file has no size discipline and no open item asking for one (`332.1` closed on
the finding that it is long because the environment is hostile). **If the owner
wants that discipline it needs filing as its own item.**

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md`,
`LOOPS.md`, `LOOPS-archive.md` and `DESIGN.md` are **byte-for-byte unchanged** —
this wake filed a finding **about** `LOOPS.md`'s machinery and deliberately did
not edit it, because `372.1`'s Accept leaves open which of two fixes is right
and a grill that pre-empts its own item has decided it by practice.
