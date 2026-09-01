# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **Neither fired this wake.**

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `cb7c80da` (the Polish round) and the bookkeeping commit carrying this
file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: the next wake reaches rule 6 again — 6 surfaces still re-queued

```
Standardize   1 / 4 Continue round   since 2026-09-01 12:05   ok
Objective     1 / 3 slice            since 2026-09-01 15:42   ok  [238]
Optimize      0 wake-date(s) newer   since 2026-09-01 19:43   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. Rules 1-5 are all clear and rule
4 is still empty, so **the next wake reaches rule 6 (Polish)**, not rule 8.
`polish_requeue.py --apply` re-queued **7** surfaces this wake; `tree-table`
took its round and was stamped, so **6 remain** — alerts, calendar, dashboard,
icon, inline-editing, scan. Run `--apply` again first regardless, per rule 6.
Re-run `dispatch_status.py` rather than trusting this snapshot.

**Do not read `grep -c 'RE-QUEUED' .roundtable/polish-state.md` as the queue
length.** It reads **8** at hand-off against a live queue of **6**, because the
ledger's prose quotes the marker while narrating past rounds. `--check` is the
count; the grep is not.

**Rule 5 is `ok`, not STALE.** Two metrics recorded this wake, both measured
here: `axe-violations 0` (from `test:axe`) and a new
`dsa-cite-bare-counts-resolved 8`. **Do not read `bundle-gz-kb`** — it and
eleven other names are 13+ days stale and its `10.8 → 11.6 → 11.7` *looks*
exactly like a rule-5 trigger. Not evaluable. The one absolute size budget that
IS live (`RF_BUDGET_KB = 40` in `build-rf-essentials.mjs`) is asserted inside
`npm run build -w @busy-office/ui`, which passed.

**Polish rows do not advance the Standardize or Objective counters**, which is
correct — LOOPS.md rule 3 counts Continue and Standardize only. Three wakes of
Polish will not arm a grill.

## The archive sweep signal: still Standardize's lane, at 1 / 4

`roadmap_scope.py` read closed-history share **393 / 1,904 = 20.6%** with
targets `[238, 237]` and **no target named by a still-open item**, so 236.2's
lane is clear. Re-run it — this wake added Slice 239, so the denominator moved.
Real lane-4 signal, and it belongs to Standardize, whose counter reads
**1 / 4**. Do not self-dispatch it from rule 6; it arms on its own.

## What landed this wake

**Polish, reconcile mode, dispatched by rule 6. One commit; the round is a
NO-OP on the artefact, which §3b names as a valid outcome — but it added an arm
and corrected a base rate.**

- **The pick was measured.** §3b's tie-break left four re-queued surfaces at
  `1/3`; `inline-editing` drops out for 217.1's stated reason (no
  `dsa-scores.json` entry, so no arm can disagree with it). Source movement
  since each surface's own `scored` date, with 217.1's `+08:00` boundary:
  `tree-table` 1 commit **+20/-12** last touched 2026-08-25 22:07, ahead of
  `calendar` (+18/-2, 08-24) and `dashboard` (0/0 — 227.1's reading, unchanged).
  What re-queued it is real CSS: `td` → `:is(td, th)` across the eleven-rule
  indent ladder.
- **Arms 1-5 clean and reproducing the previous round exactly** — 156/80 pages,
  360/40, line-number cites still 1 of 40 (re-read *at* `badge.css:42`, not
  assumed), content quotes **20/20**, css dimension literals **81/81**.
- **Arm 6 is new — 8/8.** Bare (unitless) counts in ANY cite, re-verified
  against the tree each one names. It exists because arm 5's literal regex is
  **unit-bearing only**, so this class is invisible to it, and it is where
  **3 of the 5 defects this ledger has ever recorded** lived (sidebar-nav,
  breadcrumb, icon).
- **The claimed number is parsed FROM THE CITE, never hard-coded** — a probe
  with the expectation baked in only sees the tree move, and 227.1's defect was
  on the cite side. **Red-proved three times**, each injection confirmed present
  in the parsed JSON or the measured tree before the run, each going red on
  exactly the injected row: a tree-side mutation, a cite-side mutation, and a
  cite-SHAPE mutation. The probe source is embedded in the ledger so the next
  wake re-runs it instead of re-deriving it.
- **No gate proposed — the fifth refusal, and this time for a sharper reason.**
  217.2/220.2/227.2 each refused this class saying a gate would need every cite
  to carry its own command. Arm 6's `CLAIMS` table **is** that, hand-maintained
  at eight rows, with no rule a detector could derive for a cite it has not
  seen. 8/8 is also uniformly true today — 94.11's own test for ceremony.

**The ledger's recorded base rate for the class was wrong, and nothing published
was.** 217.2 measured **6 of 240** and 220.2 recorded it shrinking "by
construction" to **4 of 240**. Re-measured this wake: **8 checkable claims
across 7 cites**, every one exact. 217.2's six were all in `fit`, so
`form · typography` ("its 5 CSS files"), `scan · fit` ("40 kB RF budget") and
`date · fit` (two claims) were never in the class. The reason it went wrong is
220.1's own: a count recorded without the command that produced it.

**One instrument ambiguity, caught before it became a finding.** Arm 6's first
run reported `dialog · fit :: cite says 13, tree reads 14`. Neither is wrong —
`grep -c` counts **lines** (13), `grep -o | wc -l` counts **occurrences** (14),
and line 470 carries `bo-dialog__header` and `bo-dialog__title`. Walking every
revision of `server.mjs`, both readings have been stable at 13/14 since
`4d9014d2` (2026-08-20), three days *before* the 2026-08-23 score, so `13` is
exact under the instrument that produced it and has **not** decayed. Arm 6
counts lines, **chosen from that revision history and not because it is the
reading that passes** — the occurrence count is written down beside it so the
next divergence is visible.

**239.3 — a real fix, noticed rather than searched for.** `polish_requeue.py`
is the FIRST loop script a cloud wake runs (rule 6 mandates `--apply` before
the rule is evaluated) and a cloud container starts with no
`packages/core/dist/`. It answered with a bare
`FileNotFoundError: …/dist/api.json` — a path, not the command that makes it.
It now exits naming `npm run build -w @busy-office/ui`. Red-proved by removal,
absence confirmed before the run; `--check` unaffected afterwards.

## Gates

**Nine entry points run green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `docs:build`, `check:repo`
(slice-refs **687 / 221**, ci-ignores **130 / 128**, paths **260**,
vendor-names **559**), `check:claims`, `check:layout` (**127 pages**),
`test:axe` (**127 × 2, zero violations**), `check:formatting`, `lint:css`.

`check:slice-refs` moving **686 → 687** citations and **220 → 221** headings is
the reconciliation for this wake's one added slice, not a coincidence.

**Said plainly: that is 9 of the 17 entry points `ENVIRONMENT.md` derives from
`ci.yml`, and the other 8 were NOT run this wake** — `check:scroll`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui` and
`suite`. The diff is `ROADMAP.md`, `.roundtable/**` and one Python error
message; no CSS, no page markup, no behaviour. **Do not carry "all seventeen
green" forward from any hand-off** — that described a different tree.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

Two gates outside that nine were also run, as arms 1 and 2 of the round:
`check:wrong-choice` (**156 assertions / 80 pages / 1 outstanding**, the skipped
`date`) and `check:dsa-scores` (**360 assertions / 40 scored / 40 requested by a
page**).

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `6d8d973c` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container
started **DETACHED** (`git branch --show-current` empty — the check that file
names as the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...6d8d973`) with the local `main` ref stale at `17b3ba6`.
`git checkout -B main origin/main` fixed it before any commit existed. Trap 2's
`--unshallow` ran clean in one attempt, no `.git/shallow.lock`,
`is-shallow-repository` → `false`, **1,790** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 3 items across 2 slices, and NONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23** and never modified since (read from `git log`, not from mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

Say the *kind* of blocked, per rule 4's own instruction. **Not one of the three
is browser-blocked or agent-blocked** — a local wake with Podman gains nothing
here, and neither does a second agent. Two need an owner decision; one needs
owner hardware.

**What is owed to the owner:** unchanged, and now **six wakes old**. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.** The
honest shape of the last six wakes is unchanged too: everything built has been
the loop's own bookkeeping and self-measurement. This wake's round is real work
— arm 6 covers the class three of five recorded defects came from, and the
`polish_requeue.py` guard fixes something that bit this very wake — but **it is
still not product work; only the owner can make it be.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is `ROADMAP.md`,
`.roundtable/polish-state.md`, one Python error message plus the bookkeeping
files, and the docs site renders none of them — so nothing in it rests on a
rendered image. Every browser-driven reading quoted (`check:claims` 162/3,
`check:layout` 127, `test:axe` 127 × 2, and arm 4's 20/20 against the built
pages) came from a gate or probe executing in this container.
