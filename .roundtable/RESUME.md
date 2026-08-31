# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

The open set is back to the standing three, all of them blocked. **Rule 3 is
OVERDUE and is what the next wake dispatches** — see below.

## What landed this wake

**Slice 231.2 — `bo-alert--elevated` is documented**, dispatcher rule 4,
Continue/build. One demo section on `/components/alerts`, plus the roadmap
outcome. Commit `c870a4f2`.

**This wake LOST A COLLISION first, and that is the part worth reading.**
Step 0c's mechanic fired for real. The wake opened on `7ce8129`, dispatched rule
4 on **229.3**, and did the whole item — measured the base rate, built both
candidate predicates as a throwaway probe, red-proved them by injection, and
wrote the refusal into `ROADMAP.md`. The mandated `git fetch origin main`
immediately before the first commit then showed `origin/main` had moved to
`014741ce`: the other dispatcher had landed **229.3, 229.4, 229.5, 230 and
231.1** while this wake worked. Per Step 0c the second pusher loses, so the work
was discarded with `git checkout -- ROADMAP.md` and the wake re-dispatched
against the fast-forwarded tree.

**The pre-commit fetch is the only thing that caught it** — exactly as `LOOPS.md`
says, and this is now a *second* recorded instance of that rule earning its
place. Note what did NOT catch it: the loser's diff touched only `ROADMAP.md`,
and its edit sat ~90 lines from the winner's, so a rebase would very likely have
merged clean. That is the same "safe by construction" argument `LOOPS.md` already
marks FALSE.

**Independent agreement worth recording.** Both dispatchers refused 229.3, on
*different* legs — the other on "both candidate predicates go green on a reworded
instance", this one on the ratchet having no regrowth event (all five instances
arrived in the single 42.1 sweep `84eb14ca`; of the **20** gates authored since,
**7 heuristic, 0** ever carried the sentence). Same verdict, two instruments.
Recorded here rather than in `ROADMAP.md`, since 229.3 is closed and this is
about the loop, not the item.

**231.2, as landed.** Both premises re-derived before acting, per its Accept, and
both hold: 17 low pairs across 4 of 40 components; non-glyph members exactly
`bo-alert--elevated` + the two `--seamless`; `/components/alerts` discriminates at
`--success` 5, `--warning` 5, `--danger` 3, `--elevated` 2; the call-site grep
returns the same eight lines, so **no second composition has landed** and the
Objective §3 question was live.

- **Decision: KEEP and document; removal refused on the merits.** `alert.css`'s
  own comment carries a reason that is not screen-shaped — `.bo-toast` ships the
  same raised surface *plus* `bo-toast-in`, an entrance animation asserting the
  content just arrived, wrong for a list already in the page at load. *Arrival vs
  presence* is the axis the component already uses to decide `role="alert"`.
- **One premise correction that changes nothing:** the item's "89 shipped
  variants" re-runs as **88**. Both right — 89 *(component, variant)* pairs, 88
  distinct *names*, because `bo-badge--type` is declared by both `badge` and
  `dashboard`. The `17` is over pairs either way.
- **Verified by re-running the count, not predicting it:** `bo-alert--elevated`
  **2 → 5** on the built page, low set **17 → 16**.
- The two `--seamless` variants got their required verdict: **no change** — they
  already carry an explicit `Scope` clause on `/patterns/editable-grid`.

**All 17 cloud-toolchain entry points run green here, exit 0 each**, list taken
from `ENVIRONMENT.md` rather than curated: core `build`, `test`, `lint:css`,
`docs:build` (which runs `check:repo`), `check:claims`, `check:formatting`,
`check:scroll`, `check:layout` (127 pages), `check:forced-colors`, `test:axe`
(127 × 2 widths, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**19/19**), `check -w
@busy-office/create-ui`, and `suite` (28 screens × 2 widths). Also the
`DOCS_BASE=/busy-office-ui` parity build, because a docs page gained an `<a>` —
that is what proves the base-prefixed link resolves on Pages.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false` — **not**
a regression. Do not "restore" the zero.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **No CSS changed and the
variant already renders on `/patterns/notification`**, so the change created no
new visual state to photograph; the whole-tree browser gates are the evidence
that nothing broke.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   1 / 4 Continue round   since 2026-08-31 13:03   ok
Objective     3 / 3 slices           since 2026-08-31 02:50   OVERDUE  [229, 230, 231]
Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok
```

**This is the Step 0b comparison — the counter read immediately after recording —
and it moved as predicted.** The Continue row took rule 2 from 0/4 to 1/4 and
closed Slice 231, which took rule 3 from 2/3 to **3/3 OVERDUE**. Re-run it rather
than trusting this snapshot.

**Rule 5 reads `ok`, which is not the same as informative:** its newest
comparable pair is `axe-violations`, with 13 of 33 names sampled twice. This wake
recorded no metric — 231.2 produces no tracked quantity, and inventing one would
be a name sampled once, precisely the defect 184.1 describes.

**How the rules were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | **1 / 4 — ok**, and no drift flagged |
| 3 Objective | **2 / 3 ok when evaluated**; **3 / 3 OVERDUE after recording** |
| 4 build item | oldest open is `112.3` (owner-blocked); oldest **dispatchable** was `231.2` — **taken** |

**The next wake dispatches rule 3 — an Objective grill of `[229, 230, 231]`** —
because rule 3 sits above rule 4 and is now OVERDUE. Rule 4's dispatchable set is
empty again in any case:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**Say WHICH KIND when reporting rule 4 as empty** — `LOOPS.md` keeps that
distinction in the durable playbook because an undifferentiated "blocked" cost
four wakes on 173.2. None of the three is browser-blocked; a local wake gains
nothing here that this one lacked.

## Direction

**No new input arrived**: no open GitHub issues, and no owner message since the
last wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need the
owner; no wake of any kind can advance them. The loop is otherwise running on
counters again — rule 3 is the next dispatch, well-armed with three genuinely
un-grilled slices.

**One observation for the owner, not filed as an item.** Two dispatchers ran the
same queue within one hour today and one of them threw away a completed item.
That is the accepted cost `LOOPS.md` Step 0c names, and it has now happened
**three** times (Slice 162; 2026-08-28; today). The decision is the owner's and
this loop does not take direction calls about its own orchestration, so it is
recorded here rather than raised as a slice — but the cost is no longer
hypothetical, and the "guaranteed collision point" argument has now failed in
every instance where it was tested.

**The sweep cadence, measured not asserted.** `ROADMAP.md` is at **2,518** lines,
against the **1,626** committed at the seventh sweep — **+892 over 7 commits**.
Measure the cycle from the blob, never from a sweep's own prose:

```
git show d701e61:ROADMAP.md | wc -l                 # 1626
git rev-list --count d701e61..HEAD -- ROADMAP.md    # 7
wc -l ROADMAP.md                                    # 2518
```

**Whether a sweep is due is a judgement about the closed-history *share***, which
the seventh sweep triggered on at **62.4%** — re-derive it with 177's scope
command rather than doing arithmetic on a stale percentage. The file has grown
55% since that sweep across three wakes that each added a slice, so the share is
worth actually running before concluding either way.
