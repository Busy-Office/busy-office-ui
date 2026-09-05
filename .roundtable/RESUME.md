# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-05 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 285 and this hand-off.
One iteration recorded — `Objective · grill`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: no counter is armed — rule 4 or rule 6 governs

**Measured after recording, not forecast.** `dispatch_status.py` read
`Objective 3 / 3 … OVERDUE [281, 283, 284]` at dispatch (what dispatched this
grill) and, immediately after this wake's row landed:

```
Standardize   0 / 4 Continue rounds   ok
Objective     0 / 3 slices            ok   ← reset by this grill's own row
```

So **neither rule 2 nor rule 3 pre-empts next wake.** Rule 4 takes the oldest
dispatchable item; if it finds none, rule 6 (Polish) does. Both `283.3` and
`284.2` are cloud-takeable, so a cloud wake reaching rule 4 has work.

Re-run it anyway rather than acting on this paragraph: the carried-forward
finding is that **a hand-off's claim about a dispatcher rule is a forecast, not
a measurement**, and two of the last three hand-offs made one, one of which was
wrong.

Rule 5 (Optimize) read **STALE** (`2 wake-date(s) newer`) and is reported as
*could not be evaluated* — never clear. `259.1`'s finding is unchanged and was
not re-verified this wake (nothing touched it).

## What landed this wake

**Dispatched by rule 3.** Rule 1 clear: `list_issues` → `totalCount: 0`; no open
item carries P0 (`grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i p0` → rc=1).
Step 1 triaged and committed nothing. Rule 2 was spent by Slice 284 (`0 / 4`);
rules 4-6 were not reached.

**Slice 285 — Objective grill of Slices 281, 283, 284. 33 assertions checked,
31 reproduce.** The arming set needed no narrowing: the last grill was Slice 280
(276-279) and none of the three had been grilled.

- **`285.1` — the finding.** 283.2 published *"18 of 18 stamps reproduce at the
  commit that CARRIES them, and at that commit's parent **0 of 18**"*, and
  concluded a `@rev` from `--stamp` *"would record the one revision the
  measurement rules out, **on every row**"*. The first half reproduces exactly.
  **The second is 16 of 18.** 16 of the carrier commits never touched their
  surface's own source — a NO-OP round commits the ledger and the roadmap and
  nothing else — so the digest is identical at the parent. Only `byline` and
  `icon`, the two rounds that edited their surface in the same commit, differ.
  A mandatory `@HEAD` would have been **right on 16 of 18**.
- **The decision survives; its evidence did not.** The suffix stays optional on
  the ground that is true by construction — `--stamp` cannot know whether the
  round will still commit a source change, so it cannot write a revision it can
  *guarantee* — plus the asymmetry that a wrong suffix is worse than an absent
  one, because a suffixed stamp is verified by ONE equality and skips the
  search. 2 of 18 silent unrecoverable errors is a fair reason to refuse it;
  "wrong on every row" was not.
- **It had spread into shipped code.** Corrected in four live places:
  `ROADMAP.md` 283.2, `.roundtable/polish-state.md`, and twice in
  `scripts/loops/polish_requeue.py` (module docstring, `--stamp` branch
  comment) — plus `parse_stamp`'s docstring, where the argument lives.
  **`loop-log.md` and `STATUS.md` rows were NOT backfilled**, per
  `record_iteration.py`'s standing rule.
- **`285.2`** — 284.2's `CLAUDE.md` ratchet reads `32 up` where its own commit
  makes it **33** (`6c18a11` 32 → `6eab896` 33 → HEAD 33; `DESIGN.md`'s 22 is
  right at both, so exactly one figure moved). This is the **third** instance of
  the trap `ENVIRONMENT.md` gained a bullet for in 275.3, and the **first after
  that bullet existed** — the bullet is not yet changing behaviour.

**Reconciled, not just re-run.** The independent predicate *"did the carrier
commit touch this surface's source?"* agrees with *"does the stamp reproduce at
the parent?"* on **18 of 18** rows.

**Two of my own instruments were dead first, both caught before producing a
finding** — one read the ledger's `status` column instead of `src` and returned
a plain `0 of 21`; the other walked the ledger newest-first, returned the
revision *after* the introducing one, and would have reported `12 of 15`. The
repo's base rate held.

**A near-miss worth carrying:** a static grep read **110** pages carrying
`.bo-data-table-container` against 281's **115**, and the argument that a static
grep must over-count a DOM walk made 281 look wrong. The DOM walk 281 used
returns **115**. *Reconcile against the instrument the claim was made with,
before calling the claim wrong.*

**Gates, all 17 CI entry points green in this container:** `build` / `test` /
`lint:css`, `docs:build`, `check:repo` (`slice-refs` **842** assertions, 318
cited across 702 files, **267** slice numbers), `check:claims`,
`check:formatting`, `check:scroll`, `check:layout`, `check:forced-colors`,
`test:axe`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`, `suite`.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...26a5561`). Trap 2
clean in one `--unshallow` (**1,914** commits, no `shallow.lock`) and it again
brought the tags — a **sixth** consecutive container, `git tag | wc -l` → **7**,
which is why `ENVIRONMENT.md` §2 states the count as the check rather than a
value. Step 0c's re-fetch before the first commit showed `origin/main` unmoved,
so no collision this wake.

**NOT VERIFIED, said plainly:** this wake's diff is three markdown files and one
Python script and changes **no CSS selector or declaration**, so the 1440/390
light-and-dark screenshot lane a cloud wake cannot run had **no subject**. That
is an absence of subject, not a skipped check, and the commit message says it
the same way. Every browser measurement above was taken with
`browser-harness.mjs` + `serve-dist.mjs` — `ENVIRONMENT.md`'s SECOND list.

## The open set is 14, unchanged — 285.1 and 285.2 both closed in their own slice

Each line below re-classified from the item's own text this wake per `LOOPS.md`
186.2, not carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 14
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 283, 284]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6`'s own text banks its clause-level decline; do not re-derive it again.
- **agent-blocked:** none. **cloud-takeable (2):** `283.3` and `284.2`, both
  script/prose/refusal work with no rendered subject — unchanged from last wake,
  since this wake spent its dispatch on a grill rather than on rule 4.

**`roadmap_scope.py` now warns that Slice 285 is NAMED by the open item `284.2`**
(236.2). That is this wake's own cross-reference — 285.2 corrected a figure
inside 284.2 — so **do not archive Slice 285 while 284.2 is open**.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, `249.7`, `249.10`-`249.13`, and
`273.2`.

**Three things want the owner's attention.**

1. **`249.12` is no longer low urgency** — carried forward unchanged, because
   nothing this wake touched it and the evidence still stands: 282.2's table
   shows two wakes reaching opposite conclusions on the archive trigger 3.5
   hours apart, with no threshold in either unit across five recorded decisions.
   It is marked **OWNER OR ARCHITECTURE CALL**, so it may not need the owner.

2. **`273.2` is unchanged for a third consecutive wake** — no Polish round ran,
   so its tally did not move. The decision is still the owner's.

3. **The cloud lane is still fed only by the loop's own maintenance.** Slice 285
   grilled three slices that were themselves loop maintenance, and its finding
   was a defect in the loop's own tooling — the same shape as 283 and 284 before
   it. Every one of the nine items older than `283.3`/`284.2` is owner-blocked.
   Unblocking any one of `249.10`-`249.13` would refill the lane with work the
   owner actually wants.

**Findings carried forward rather than acted on** (`284.2` holds the loop's
prose-growth question, so new one-line rules are still not being given
sections): *a measurement taken to justify a change must be taken under the
change, or say which side of it it is on*; *a citation should name its example
by the PROPERTY that makes it an example, not by the page that currently has
that property*; *a rule fitted to one row is ceremony, and the wake that wrote
the row is the worst-placed to judge it*; *when a derived value's FORMULA
changes, every value already recorded under the old formula becomes a constant,
not a stale reading*; *a hand-off's claim about what a dispatcher rule will do
next is a forecast, not a measurement*; *a reopen condition written into a
closed verdict is the cheapest finding a sweep can have, and it is only found by
re-reading the verdict rather than the instrument.* This wake adds a seventh,
from 285.1: **when a measurement is the stated justification for a design
decision, the decision can be right while the number is wrong — so re-derive the
number before quoting the decision, and if it fails, say which ground the
decision now stands on rather than quietly keeping both.** None of the seven has
a home yet.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `285.1`, `285.2`, `284.1`, `284.2`, `283.2`, `282.2`, `281`,
`279.4`, `275.3`, `273.1`, `274.1`, `259.1`, `169.3`, `175.3`, `186.2`, `236.2`
and `94.11` are named as history, as counter evidence, or as classification
evidence — never as queued work. The report is partly **self-referential**: an id
acquires a mention simply by being listed here.
