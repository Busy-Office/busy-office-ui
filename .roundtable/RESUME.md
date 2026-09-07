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

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **One iteration recorded** — `Continue · build` on `319.3`
(outcome `landed`, **one refusal**) — and **two metrics**, `claims=176` (which
joins rule 5's comparable set, since `claims` already has other days) and
`target-size-pages=7` (a new single-day name, not yet an input). The slice
landed as **`0d8cc85f`**, the recording and this hand-off in the commits after
it.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ THE COUNTERS, READ AFTER RECORDING — RULE 3 IS **OVERDUE**

```
Standardize   1 / 4 Continue rounds  since 2026-09-07 21:52   ok
Objective     3 / 3 slices           since 2026-09-08 03:15   OVERDUE  [316, 319, 339]
Optimize      0 wake-date(s) newer   since 2026-09-07 23:29   SKEW
```

**Rule 3 crossed on this wake's own recording** — 2 → 3, and
`dispatch_status.py` says outright *"a counter is at or past its threshold; the
dispatcher should pick it"*. **The next wake dispatches the Objective grill of
Slices 316, 319 and 339**, and rule 3 sits above rule 4, so it wins over any
build item.

**Note WHICH slice the counter credited: `319`, not `340`.** The Continue row
names `319.3`, and the parser reads the slice from the item id — that is the
`SLICE_TOP` convention working as designed, not a miscount. One slice's worth
of work closed and the counter moved by one; do not "fix" it.

Read `dispatch_status.py` rather than trusting this block. Reading it
immediately after recording is `LOOPS.md`'s own instruction and is the
comparison that has caught two of the five parser recurrences — it agreed
again this wake.

## Rule 5 evaluated, and it does not fire

The line reads **`SKEW, 0 wake-date(s) newer`** — 306.1's third flag, so the
remaining newer date sits inside the two dispatchers' 8h clock envelope and the
rule IS evaluable. **No name in the comparable set regresses on two consecutive
runs**: `claims` `169 → 170` (and `176` recorded today) and `gates` `27 → 55`
are growth in the healthy direction, `axe-violations` reads `NEVER MOVED` and
is pinned by its own gate, and `bundle-gz-kb`'s `+3.4` is a single old pair
(2026-08-17 → 2026-09-03), not two consecutive runs. Note the line's own
warning: recording another metric does not move `SKEW`.

**No size budget breached** — not re-run this wake, and said rather than
carried silently: the diff is two gate scripts and `ROADMAP.md`, so no shipped
byte moved. The previous wake's `check:size` reading (139 files, 382.7 kB gz,
tightest headroom 110 bytes on `css/brand-navy.min.css`) is the last live one.

## What landed: Slice 340 — `319.3` answered, and the answer is that the item was aimed at the wrong gate

**The premise was re-run first, as the Accept demands, and it holds**: the
vocabulary grep still finds **18** pages, the sweep is still **7**, the overlap
is still the same **4** (`button`, `data-table`, `form`, `quantity`).

**`340.1` — the overlap of 4 was never coverage.** `check-target-size.mjs`
skips every target at or above 24px and fails only when an undersized one is
crowded; its predicate is SC 2.5.8 conformance, and a page's *named pixel
value* is a different predicate that no page list converts into. Red-proved:
`.bo-btn` forced to `30px` on the swept `/components/button/`, injection
asserted **in the DOM** (24 buttons, `[30]`, at compact AND spacious, against
the shipped 28 and 44), and the gate **passed with byte-identical output** —
the same 9 exempted types, the same distances. So coverage of the pixel CLAIMS
was **0 of 18**, not 4 of 18, and `/components/button/`'s own *"`--sm` is a
24px control"* sat inside the sweep unverified. **The growth was costed anyway**
because the Accept asks for it: 7 → 14 pages is **10.4s → 19.4s (+86%)** for the
**identical** exempted set. **Refused.**

**`340.2` — the six claims are now executable**, in `check:claims`, whose own
header already said *"add a case whenever a page claims something a browser can
check"*. **170 → 176 verified live** (3 NOT VERIFIED is `ENVIRONMENT.md` §6b's
container fact). Every claim was **measured true before it was written down**,
so the refusal is not hiding a defect. The density tokens are authored in
`rem`, and the first draft of that case went red on it — it now applies each
token to a real box instead of assuming a 16px root.

**`340.3`** records the judgement the item said the 18 was only an input to:
**7 of the 14** unswept pages make a pixel claim, **7 do not** — four are
qualitative glove prose, one is a facts-strip width, `/patterns/inbox`'s
"nitrile gloves" is **demo data**, and `/concepts/accessibility` asserts the
*verification* accurately. **`340.4`** puts the assumption in
`check-target-size.mjs`'s header, where a wake reads before reaching for the
page list again.

## The by-hand verifier caught two defects in this slice's own diff

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's pass was the staged diff re-read adversarially. It found:

1. **A case named for a page it never loaded.** `button/kanban` visited only
   `/components/button/` — a detector that cannot fail for half of what its name
   claims. It now loops both pages, and an injection into `/patterns/kanban/`
   **alone** turns it red (**1 of 176**), which is what proves the second half is
   really read.
2. **Selector plumbing that string-substituted into a stringified function**
   (`.replace(/SELECTOR/g, …)` into `new Function`). Replaced with an ordinary
   `page.evaluate(SIZES, sel)` argument.

**The six-injection red-proof was re-run against the FINAL code** after both
corrections — exactly **6 of 176** red, exactly the six new names, each
injection on a page no other injection touches, so each case is paired to its
own subject. Restored and re-run green; `rp3193`/`rpk` occurrences checked back
to **0** across `apps/docs/dist`, not assumed.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this slice**, and that is structural rather than a judgement
call: the diff is `ROADMAP.md` and two **gate scripts**
(`check-claims.mjs`, `check-target-size.mjs`). No CSS rule, no docs page, no
component and no shipped byte changed, so no rendering can move —
`git diff --stat` was read to confirm it.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points run on the pre-commit tree
— core `build`, core `test`, `lint:css`, `docs:build`, `check:claims`
(**176** live · 3 NOT VERIFIED), `check:formatting`, `check:scroll` (914
containers / 118 pages × 2), `check:layout` (**128** pages),
`check:forced-colors`, `test:axe` (**128 × 2**, zero violations),
`check:target-size` (7 × 3), `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite`.
**`docs:build` was re-run after this file was written**, per `ENVIRONMENT.md`
§3b.

## The open set is 31 — no P0, and 20 are cloud-takeable

`roadmap_scope.py` reports **31 open**, and `319.3` has left the OPEN set.
Re-run the script rather than quoting this — it **refuses to print figures for
an uncommitted tree**.

- **cloud-takeable: 20** — `320.2`, `322.3`, `323.1`, `324.1`, `324.2`,
  `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`, `332.1`,
  `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`.
  **`320.2` is now the oldest of these** and is what rule 4 would reach for —
  **but rule 3 outranks rule 4 and is OVERDUE**, so the next wake grills first.
  **`335.1` still carries its caveat**: settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware —
  *"needs a human listening to a screen reader"*), `112.3` (**BLOCKED ON OWNER
  BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7` (its own text holds
  it for `249.10`, owner vocabulary), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL** in its own heading), `296.3` (**OWNER CALL**).
  **Re-derived from each item's own text this wake**, not carried forward.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty — checked rather than assumed.**

## The archive sweep is NOT due, and the two halves disagree for the ELEVENTH wake

**Read at this wake's own recording commit `dafadfcc`, not carried forward**:
**8,789 lines**, closed-history share **33.5%** (2,946 lines across 13 closed
slices). The standing trigger is *past 5,450 lines **and/or** 40.6%*: lines are
past, **share is not**. That is precisely the AND-vs-OR case `249.12` is open
on, and it decides it here — under AND, no sweep. **Eleventh consecutive wake
where the two halves disagree.**

Both halves moved because `340` closes wholly, which is `ENVIRONMENT.md`'s rule
about reading a figure from the commit it describes doing real work: at the
pre-`340` tip `273c7ae3` the same script read **8,643 lines / 30.5%**. A wake
reaching for a sweep should read `roadmap_scope.py`'s pin line first — **9
targets are named by a still-open item**.

Trend, **nine** readings, and **it is not monotone**: the previous hand-off's
32.1% was taken at `f9e0f17d`, when `339` was briefly wholly closed, and filing
`339.2` reopened it — so the series steps back for a reason, not because an
instrument disagreed. 26.4% → 27.8% → 29.5% → 30.7% → 30.7% → 30.5% → 31.1% →
32.1% → **33.5%** (the 30.5% above is the intermediate reading at `273c7ae3`,
not a ninth point).

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a seventh
consecutive hand-off.** See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake (`273c7ae3`). Read the runs after
your push; one `actions/runs?branch=main` read costs nothing and is the only
thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...273c7ae` and
the container started on a stale ref; fixed with `git checkout -B main
origin/main` before any commit, and `git branch --show-current` was re-read as
`main` immediately before committing. Trap 2 was clean in one `--unshallow` (no
`shallow.lock`) and again brought the tags: `git tag | wc -l` → **8**, §2's
mandated count — the **seventh** consecutive container to contradict the value
that section used to assert, which is why the count is the check.

Trap 1c was respected rather than met: `CHROME_PATH` was exported **in the same
command** as every browser gate and every throwaway probe. No `git stash` was
used at any point.

**The pre-commit `git fetch origin main` found NO collision** — `origin/main`
unmoved at `273c7ae3`, `rev-list --left-right --count` reading `0 0`.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their
   report rather than weakening it. **Replying and closing the issue is an
   owner action.** Whether a *wake* should post that comment was `297.1`, closed
   by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6 was
   never reached, so `polish_requeue.py --apply` was correctly not run.

**`249.12` stays a live question, sharper for the eleventh time** — the two
halves of the archival trigger DISAGREE again, and the share is **not
monotone**: it read 32.1% two wakes ago, 30.5% once `339.2` reopened Slice 339,
and **33.5%** now that `340` closes wholly. That is worth the owner seeing:
under the OR reading the sweep has been due for eleven wakes; under AND it has
never been due, and a share that can go DOWN when an item is filed means "it
will get there on its own" is not a safe assumption either.

**What the next wake should reach for: rule 3, the Objective grill of Slices
316, 319 and 339.** It is OVERDUE at `3 / 3` and outranks rule 4. Rule 4's next
item behind it is `320.2`, cloud-takeable.
