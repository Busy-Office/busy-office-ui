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

Last updated 2026-08-30 (**cloud** wake — rule 6 → **Polish**, the dispatch the
previous hand-off predicted). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, unchanged
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed** — `216.1`, `216.2`, `216.3`, `179`, `94.3`,
`182.1`, `176.1` — are historical references to this wake's work and to what it
cites, not claims they are open. The four genuinely open are **`112.3`,
`112.4`, `211.1`, AT runtime**. This wake changed none of them.

## ⚠ THIS WAKE WAS LAPPED. READ THIS BEFORE TRUSTING ANY LONG WAKE'S PLAN.

**A collision landed, of a kind Step 0c does not model, and only the mandated
pre-commit fetch caught it.**

```
Step 0 fetch            origin/main = 52a50b58   19:50:33Z   highest slice 178
pre-commit re-fetch     origin/main = 724dc587   01:40:39Z   highest slice 215
git rev-list --count 52a50b58..724dc587          # 151 commits, 37 slices
```

The **first** of those 151 commits (`74d8c2b8`, 21:44Z) is
**`Slice 179 — Objective grill of 173/176/177/178`** — precisely the rule-3
dispatch this wake had taken at Step 0 and had carried to a finished report, two
landed fixes and a red-proof. All of it was **discarded and never pushed**, as
Step 0c instructs the loser to do.

**This is new evidence for the OPEN `175.4`, and it is recorded in ROADMAP 216's
opener rather than only here.** Step 0c bounds the cost at *"up to one wake's
work, discarded"* and models two wakes racing for the same item at the same
time. This was a **slow wake outrun**: it planned, measured and wrote against a
`ROADMAP.md` that was 37 slices out of date for its whole duration, so every
figure it produced described a tree nobody was on. Do not read 175.4's decision
as being only about simultaneity.

**Practical consequence for the next long cloud wake: re-fetch mid-wake, not
only before the first commit.** Nothing mandates that today and nothing here
changes the rule — it is a suggestion, not a decision this loop may take.

Part of the wall clock that made this wake lappable is now fixed: three failed
`git fetch --unshallow` attempts, ~10 minutes, all one stale lock file — see
**ENVIRONMENT.md trap 2b**, added by 216.3 this wake.

## What landed this wake

**Slice 216 — Polish round 2 on `component/data-table`. NOT a no-op.**

- **216.1 — the `spacing` DSA cite was already stale on the day it was scored.**
  It read *"the **1.75rem** compaction heights … reconciliation **queued** as
  94.3"*. `grep -c '1\.75rem'` on `data-table.css` reads **0**; walking all 40
  revisions, `79f7fec9` (*"94.3: the fourth density gets a name and a reason"*,
  2026-08-21) removed both literals into `--bo-density-auto-{row,control}-height`
  in `tokens/density.css`. The entry is stamped `"scored": "2026-08-23"` — two
  days later — and `/components/data-table` has published it since. The CSS
  file's own comment says the opposite, in the same block.

  **The score does not move and no blind re-score is owed:** `spacing` is a debt
  marker, not a quality signal, so naming the heights is *less* debt and 3 stays
  right. This corrects the evidence record — 176.1's and 182.1's shape.

  Every literal the replacement names was verified present in the file FIRST
  (`390px` ×4, `68px`, `87px`, `28px`, `30px`), so the fix does not re-commit the
  error. Verified in the BUILT html, not the diff: `1.75rem compaction heights`
  → **0**, `reconciliation queued as` → **0**, new sentence renders. The other
  five cites reconciled clean.

- **The pick has a stated reason, because the score cannot rank.** All 10
  re-queued surfaces are `content: 3`; nine sit at 1/3 rounds. Picked by which
  surface's SOURCE moved: `data-table` **5 commits +157/-0**, `alerts` 1 commit
  +71/-5, the other seven **0/0**. **The first draft of that instrument read
  `244 commits` for all nine** — an identical value across every input, i.e. a
  defect until proven otherwise. It was: a stray `"*"` pathspec. Caught before
  the pick, not after.

- **216.2 — refused a gate for the class, and the refusal is the interesting
  half.** Base rate says it WOULD distinguish: across all 40 components, **74**
  cites name a CSS length literal, **73** find it in that component's own CSS,
  **1** does not — this defect. That is the opposite of 94.11's dead predicate.
  Refused anyway on 101.3 (Polish may not add gates), **and** because the
  obvious widening kills it: also searching `tokens/` would have **passed** on
  this defect, since `1.75rem` is in `density.css`. Commands in ROADMAP 216.2.

- **216.3 — ENVIRONMENT.md trap 2b** (above).

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures.

```
python3 scripts/loops/dispatch_status.py
```

Rules as this wake read them, each from its own source rather than from the
previous hand-off: rule 1 clear (no open P0; GitHub intake **0 open issues**,
asked via the API twice), rule 2 `Standardize 0 / 4 ok`, rule 3
`Objective 0 / 3 ok`, **rule 4 nothing dispatchable**, **rule 5 STALE —
reported as un-evaluable, not as clear**, **rule 6 fired**.

**Rule 4's four items, with the KIND of blocked per 186.2** — re-read from each
item's own text this wake, not copied:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| `211.1` vendor htmx into `examples/po-app` | owner-blocked — a product call |
| AT runtime evidence | hardware-blocked — owner hardware |

**A Polish round is still the likely next dispatch**, and nine re-queued
surfaces remain at 1/3. But note what this wake found: the round that looked
like a no-op was not. **The productive arm is the citation reconciliation**, and
it has now found a real defect on **3 of 4** surfaces where it has been run
(`scan` 176.1, `state-patterns` 182.1, `data-table` 216.1; `badge` was the clean
one). That is the arm to run first, not last.

**Rule 5 is still STALE and this wake did not improve it** — it recorded no
metric. A wake that records one un-stales it.

## Direction

**`211.1` remains the owner's call and this wake did not touch it.** The
previous hand-off's correction stands: the docs teach no CDN wiring at all
(0 files under `apps/docs/src/` mention `unpkg` or `cdn`), so the question is
whether to ADD teaching, not to preserve it.

**`175.4` gained real evidence this wake** — see the lapping section above. It
is the one open decision whose inputs actually changed today.

**Still unacted, now two wakes older:** 177's observation that a grill's roadmap
slice pays for its text twice. Slice 216 is deliberately shorter than its
material and says so in its own closing line; that is one author's choice not to
pad, not a convention change, which stays the owner's.

**Standing three unchanged** (112.3, 112.4, AT runtime).
