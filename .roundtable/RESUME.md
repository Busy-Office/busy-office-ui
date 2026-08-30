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

Last updated 2026-08-30 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

`228.1` is named below as **what landed**, not as open work. **The open set is
3, unchanged from the last two hand-offs, and every one of them is blocked** —
the backlog carries nothing any wake can build.

## What landed this wake

**Slice 228 — Standardize, sweep mode, dispatcher rule 2.** Rules 1 and 3 were
answered by measurement; the readings are in "Dispatcher state" below.

**Lanes 1-3 clean an eighth time; lane 4 carried the finding, as it has every
time since 208.** Reported `n of 4`, per the playbook.

**The two ordinals differ deliberately: lanes-1-3 clean = 8, archive sweep = 7**
(224's lane-4 finding was in `ENVIRONMENT.md`, not the roadmap's length). Taken
from the slice headings, not incremented from the last write-up — 214 says
"clean for the sixth time" and 224 states no ordinal, which is how an off-by-one
gets inherited. This one was caught in the writing.

- **Lane 1** `scan:dead-style`: **0 dead** of **1,433** live inline
  declarations — identical to 224.1.
- **Lane 2** `report:css-repeats`: 74 files, 242 rules, 230 distinct bodies,
  **still exactly 8 repeat groups**, same shapes as `LOOPS.md`'s standing
  table. The finding is the delta; there is none.
- **Lane 3** `report:prose`: 118 pages, median 748, union of 14 flagged pages —
  every one already verdicted. **Checked by SET MEMBERSHIP against 158.1's
  twelve / 161.1's three / 178.3's `/concepts/scale/`, not by a cite count**:
  grepping each page path out of `ROADMAP.md` + the archive returns 1-11 hits
  for all fourteen, so that instrument reports 14-of-14 covered whatever the
  truth is. A dead detector, caught before it was quoted.
- **Lane 4** `report_loop_prose.py`: `ratchet` read first — `ROADMAP.md 9 up,
  last cut f1be2485`. Rule 4 was walking **3,794 lines to find 3 open items**.

**228.1 — the seventh archive sweep. `ROADMAP.md` 3,794 → 1,473 lines
(→ 1,626 with this slice's own write-up appended).** Fifteen slices — 211,
214-227 — moved verbatim, each leaving the standing one-line pointer;
`ROADMAP-archive.md` 27,208 → 29,589.

- **62.4% of the live file was closed history** — 2,366 of 3,794 lines, on
  177's instrument unchanged. It is now **152 lines of 1,626 (9.3%)**, and
  that residue is Slice 228 itself, which the eighth sweep will move. Both
  post-write-up figures were re-measured after the LAST edit to this slice
  rather than carried from the move — they moved three times while it was
  being written, which is the 209.1 shape in miniature.
- **The instrument was red-proved by injection before its output was used.**
  An open checkbox was injected into Slice 224 on a scratch copy, its presence
  confirmed (**1** occurrence) *before* the parse; the pass moved
  `OPEN [15, 112] → [15, 112, 224]`, targets **15 → 14**, lines
  **2,366 → 2,309**. It can tell an open slice from a closed one.
- **Lossless, verified against the git blob by an independently written
  parser** — never against the dict the sweep script built, which is
  self-consistent by construction: **15/15** moved sections byte-identical to
  `HEAD:ROADMAP.md`, **194** untouched live sections with **0** changed,
  **192** pre-existing archive sections with **0** changed, 3 open checkboxes
  before and after.
- **The line accounting reconciles in both directions**, which is what a move
  owes over a rewrite: live loses 2,366 body lines and gains 15×3 pointer
  lines = **−2,321**; archive gains 15 headings + the same 2,366 = **+2,381**.
  `git diff --stat`'s own net (129 insertions − 2,328 deletions = −2,199)
  matches 3,794 → 1,595 to the line.
- **Citation-neutral, measured rather than asserted.** `check:slice-refs` was
  run against `HEAD`'s two files and then the swept pair: **453 citations, 246
  cited, 2 known-dangling, 209 slice numbers — identical both sides.** After
  the write-up landed it reads 454 / 246 / 2 / 210, the +1 being Slice 228's
  own heading.

**Not verified, said plainly:** markdown-only change; no rendered surface
moves. No Podman and no `localhost:8081` here, so the 1440/390
light-and-dark screenshot lane could not run — and **nothing in this wake
rests on a rendered image**.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

**Read the counter yourself — this is the Step 0b comparison, and the whole
value of it is that a number disagrees with what a human just wrote down.**
The expected movement: rule 2's Continue-round counter RESETS (a Standardize
just fired), and rule 3's slice counter ADVANCES, because 161.4 counts slices
closed by Continue **and Standardize** and Slice 228 is a Standardize row.

**So the next wake most likely dispatches `Objective`** — it stood at 3/3
OVERDUE this wake and was only skipped because rule 2 sits above it in
`LOOPS.md` Step 2. Verify against the counter rather than trusting this
sentence.

**How rules 1-3 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | **4/4 OVERDUE — dispatched.** Rules 3 and 4 not reached |
| 3 Objective | 3/3, also OVERDUE, armed behind rule 2 `[222, 226, 227]` |
| 4 build item | not reached; the open set is unchanged and still wholly blocked |

**The open set is 3 and NOTHING in it is dispatchable** (rule 4's
kind-of-blocked distinction, which `LOOPS.md` keeps in the durable playbook
precisely because it did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

## Direction

**This block is genuinely empty of new asks.** No new input arrived: no open
GitHub issues, and no owner message since the last wake. Step 1 had nothing to
triage, so no `Roadmap · plan` row was recorded.

**Standing three unchanged** (112.3, 112.4, AT runtime). All three need the
owner; no wake of any kind can advance them. The loop is running on counters
alone, and has been for three wakes.

**Still unacted, now fourteen wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice — 1,192 of 1,943 swept lines were five
Objective-grill slices that each also have a full report in `.roundtable/`.
**Deliberately not filed as an item**, and re-checked this wake rather than
repeated: 177's own text calls it *"a direction call about how the loop records
its own work, and this loop does not take those"*, recorded so the owner can
decide it. **This wake is direct evidence for it**: of the 15 slices swept, 215
and 225 are Objective grills that each also have a standalone `.roundtable/`
report, and rule 3 is armed to add another next wake.

**One measured observation, named rather than filed — the sweep is not
converging.** 179.2 once claimed regrowth per cycle was falling monotonically;
214's write-up recorded that the fourth cycle broke it, and this cycle does not
restore it either.

```
git show --format='%H %cI' -s e29c7c18   # 214.1's sweep   2026-08-30T00:46:02+00:00
git show e29c7c18:ROADMAP.md | wc -l     # 1721
git rev-list --count e29c7c18..HEAD -- ROADMAP.md   # 22
```

**+2,073 lines over 22 ROADMAP-touching commits in 16h03m = 94.2 lines per
commit** — against 177's recorded cycle rates of 30.4 / 51.0 / 69.5 / 66.6.
**Two sweeps inside one calendar day, for the second time** (165.1 and 177 were
twelve hours apart).

**A figure was corrected in the writing of this, and it is the same shape
209.1 already named.** The sixth sweep's own log row and write-up say
`3,197 → 1,650`; the file **as committed at `e29c7c18` is 1,721 lines**,
because 1,650 is the state after the move and *before* the write-up was
appended to it. Taking the log row at face value would have published a
regrowth of 2,144 over "~34 hours" — both wrong, and neither re-derivable
from the log. Measure the cycle from `git show <sweep>:ROADMAP.md | wc -l`,
never from the sweep's own stated after-figure.

Left as an observation and not an item, deliberately: the cadence is doing its
job, and `LOOPS.md` already refuses to pin sweep numbers in the playbook
because they go stale silently. ROADMAP 177's per-commit table is the
instrument — re-run it, the figures are snapshots.

**`cascade.astro`'s missing parse assertion is still open as an observation**
(carried from the last hand-off, unchanged and not re-derived): it parses
`Z_TOKENS` from the shipped z-index tokens with no assertion, so a zero-parse
renders an empty stacking section rather than a wrong number. Milder than
227.3's — silence, not a false figure. A Standardize sweep is the right home
for it; this one's lane 4 finding outranked it.
