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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `61074ca7` (the slice) and the bookkeeping commit carrying this file
— pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: rule 4 is empty again — the next wake falls through to rule 6

```
Standardize   1 / 4 Continue round   since 2026-09-01 12:05   ok
Objective     1 / 3 slice            since 2026-09-01 15:42   ok  [238]
Optimize      0 wake-date(s) newer   since 2026-09-01 15:44   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. **This wake spent rule 4** — the
one dispatchable item is now closed — so rules 1-5 are all clear and **the next
wake reaches rule 6 (Polish)**, not rule 8. Rule 8 is not the answer: LOOPS.md
measures rule 6's predicate true of **19 of 19** non-skipped surfaces in 11 of 11
ledger revisions, so it fires. Run `polish_requeue.py --apply` first, per rule 6.
Re-run `dispatch_status.py` rather than trusting this snapshot.

**Rule 5 is `ok`, not STALE**, and unchanged from the last hand-off — no metric
was recorded this wake because nothing was measured that a metric names.
**Do not read `bundle-gz-kb`** — it and eleven other names are 13+ days stale and
its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## The archive sweep signal has re-armed — but it is Standardize's lane, at 1 / 4

`roadmap_scope.py` now reads closed-history share **384 / 1,895 = 20.3%** with
targets `[238, 237]` and — for the first time in two wakes — **no target named by
a still-open item**, so 236.2's lane is clear. That is a real lane-4 signal and
it belongs to Standardize, whose counter reads **1 / 4**. Do not self-dispatch it
from rule 6; it arms on its own.

## What landed this wake

**Continue, build mode, dispatched by rule 4 — the first rule-4 dispatch in six
hand-offs. One commit; Slice 238 now fully closed.**

- **238.1 closed: the deferral cost was FIVE commits, not four**, corrected at
  both durable sites — `ROADMAP.md` 237.2's cost paragraph, and the
  `ROADMAP-archive.md` header that 237.2 itself rewrote. **Each site now carries
  the command that produces the number**, which is criterion (b) and the entire
  reason the item existed.
- **Every premise re-run on this wake's own unshallowed clone before anything was
  edited** (`is-shallow-repository` → `false`, 1,786 commits), not read out of
  the item: the range prints **5**; `e29c7c18` is in it in **both** ancestry
  directions and reads `1575 0`, third of `4369 · 2381 · 1575 · 1424 · 27`.
- **Accept (c) was verified, not assumed**, since a change that reopens it does
  not satisfy the item: the ten-commit premise still reads **10** at
  `7e861867^` with `0/12` and `27/0` the only two non-appends; `dc861a25`'s diff
  deletes exactly the Slice 24, 17 and 23 stubs and nothing else (12 lines);
  `2026-08-28 → 2026-09-01` is **4 days** exactly. None of the three moved.
- Also fixed in the same block: the `dc861a25` annotation read `-0 / -12` where
  `git log --numstat` prints the columns `0` and `12`.
- **(d) the two log rows are untouched** — historical rows are never edited —
  and the reason they stay wrong is written into 237.2's cost paragraph, where a
  reader of the correction arrives.
- **Neither is cited by LINE NUMBER, and that was a finding inside the item.**
  238.1 filed them as `loop-log.md:1279` / `STATUS.md:43`; both were already
  wrong by the time it closed. The log had grown to `:1281`, and `STATUS.md`
  regenerates its "last 10 iterations" on every `record_iteration.py` run —
  which moved the row to `:38` **within this wake**, after the slice commit had
  already quoted `:43`. Caught by re-deriving both numbers instead of copying
  them forward, and fixed in the bookkeeping commit. **A line number into a
  regenerated mirror rots by construction; grep the row.**

**Two things worth carrying forward, both about instruments rather than the
edit.**

- **`check:slice-refs` reads 686 / 220 (252 cited) — byte-identical to before
  the edit, and that was CHECKED rather than waved through.** An unchanged
  number across changed input is CLAUDE.md's "identical value is a defect until
  proven otherwise". The same gate run in a `git worktree` at HEAD prints the
  same three numbers, and the explanation holds: `cites` is a set of **distinct**
  refs, every slice this edit cited was already cited, and no heading was added.
- **The obvious removal check cannot pass here, and the item is the proof.** A
  plain `'four commits landed' not in ROADMAP.md` is red on a correct tree —
  238.1's evidence quotes the string it removed, and the grep written to verify
  the removal *is itself a match*. Both are CLAUDE.md's "an assertion tripped on
  its own explanation", met twice in one paragraph. The assertion that works is
  on the claim's **shape** with quoted forms excluded: `0` surviving live
  assertions, against `6` phrase hits and `21` wider hits, all counted before
  and after.

**One refusal, and it is the interesting half.** Criterion (e) offered
*"imprecise and right"* as a satisfying close and it was **refused with a
reason**: the number here is not decorative, it is **the size of the cost**, in a
paragraph whose whole subject is how long a correct deletion was deferred. So
this is **not** the fourth instance of 232.1/236.1's shape — it is the first in
that series where the disputed figure is load-bearing for the claim it sits in.

## Gates

**Seven entry points run green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `docs:build`, `check:claims`,
`check:layout` (**127 pages**), `test:axe` (**127 × 2, zero violations**),
`check:repo` (slice-refs **686 / 220**, ci-ignores **130 / 128**, paths **260**,
vendor-names **559**).

**Said plainly: that is 7 of the 17 entry points `ENVIRONMENT.md` derives from
`ci.yml`, and the other 10 were NOT run this wake** — `lint:css`,
`check:formatting`, `check:scroll`, `check:forced-colors`, `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app`,
`check -w @busy-office/create-ui` and `suite`. The diff is two markdown files
that no gate in that set reads. **Do not carry the previous hand-off's "all
seventeen green" forward** — it described a different tree and a different wake.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `22ea6ba5` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT trap 1 bit at Step 0 again**: the container started **DETACHED**,
`git branch --show-current` returned empty — the check that file names as the
actual answer — and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...22ea6ba`), with the local `main` ref stale at `17b3ba6`.
`git checkout -B main origin/main` fixed it before any commit existed. Trap 2's
`--unshallow` ran clean in one attempt, no `.git/shallow.lock`,
`is-shallow-repository` → `false`, **1,786** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is back to 3 items across 2 slices, and NONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

Say the *kind* of blocked, per rule 4's own instruction. **Not one of the three
is browser-blocked or agent-blocked** — a local wake with Podman gains nothing
here, and neither does a second agent. Two need an owner decision; one needs
owner hardware.

**What is owed to the owner:** unchanged, and now four wakes old. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.** The
honest shape of the last four wakes is unchanged too: everything built has been
the loop's own bookkeeping — the roadmap, its archive, that archive's header, a
grill of the wake that wrote the header, and now the correction that grill
filed. Legitimate maintenance, driven correctly by the counters, and **it is
still not product work; only the owner can make it be.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is `ROADMAP.md` and `ROADMAP-archive.md`,
and the docs site renders neither — so nothing in it rests on a rendered image.
Every browser-driven reading quoted (`check:claims` 162/3, `check:layout` 127,
`test:axe` 127 × 2) came from a gate executing in this container.
