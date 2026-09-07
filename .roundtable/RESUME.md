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
at hand-off. **One iteration recorded** — `Continue · build` (outcome `landed`,
one refusal) — **and one metric**, `gates=55`, which is the first thing to read
below because it moved rule 5. The work landed as **`e4742fd4`**, followed by
this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`e4742fd4`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## ⚠ THE ONE THING THE NEXT WAKE NEEDS: RULE 2 IS OVERDUE

```
Standardize   4 / 4 Continue rounds   since 2026-09-07 22:24   OVERDUE
Objective     1 / 3 slices            since 2026-09-08 03:15   ok   [316]
Optimize      0 wake-date(s) newer    since 2026-09-07 19:53   SKEW
```

**This wake's own Continue round is what crossed it** — it read `3 / 4 … ok` at
Step 2, so rule 4 correctly matched, and the counter reached 4 only after
`record_iteration.py`. That is `LOOPS.md` Continue's Exit working exactly as
written (*"hands back to the dispatcher for the next wake, which may pick the
next item, or — every 4th round — Standardize"*), not a rule that was skipped.
**Rule 2 sits above rule 4, so the next wake dispatches Standardize** unless a
P0 or new input outranks it.

**Read `dispatch_status.py` rather than trusting this block.** It is read AFTER
recording, which is `LOOPS.md`'s own instruction and the thing that has caught
two of the five parser recurrences. Two dispatchers share this queue.

**When that sweep runs, `337.1` is a live trap in its way**: `npm run -s
scan:dead-style -w @busy-office/docs` prints nothing and does not visibly fail,
because the workspace is named `docs` and `-s` swallows npm's error. **Lane 1
is the one that dies silently**, and empty stdout is indistinguishable from a
clean lane. Say `n of 4` in the write-up; four consecutive sweeps ran three.

## Rule 5 was STALE at dispatch and is EVALUABLE at hand-off — this wake fixed it

At Step 0b it read `STALE, 1 wake-date(s) newer`, so per `LOOPS.md` it **could
not be evaluated** and was not reported clear. This wake **measured `gates` = 55
and recorded it**, which day-pairs the name and revives the input. It now reads
**`SKEW, 0 wake-date(s) newer`** — 306.1's third flag, meaning the remaining
newer date sits inside the two dispatchers' 8h clock envelope, so the input is
as fresh as the log and the rule IS evaluable.

**Evaluated, and it does not fire.** No name in the comparable set shows a
regression on two consecutive runs: `gates` `27 → 55` and `claims` `169 → 170`
are both growth in the healthy direction, `axe-violations` reads `NEVER MOVED`
and is pinned by its own gate, and `bundle-gz-kb`'s `+3.4` is a single old pair
(2026-08-17 → 2026-09-03), not two consecutive runs from this wake. **No size
budget was breached** — `check:size` reports tightest headroom 110 bytes on
`css/brand-navy.min.css`, green.

Note the line's own warning: recording *another* metric will not move `SKEW`.

## What landed: Slice 338 — `316.1` built, closed by its FIRST branch

`check:print-tokens` ships: no `var(--bo-color-*)` inside a `@media print`
block, wired into the core build between `check:sticky-layers` and `build:acr`.

**Tagged `@heuristic`, which `316.1` forecast as `@exact`.** The token half is
an exact membership test; deciding whether a media query list *selects* print is
recognition, and `@media not print` contains the word and means the opposite.
12 self-test cases carry that one. `check:selftests` now reports **55 gates, 21
heuristic, 172 cases actually run** (was 54/20) — so the cases are *reachable*,
315.3's third rung, not merely present. Both README `stat:gates` stamps moved.

**Red-proved twice, and the injection was verified before the gate was
believed** — CLAUDE.md's rule holds even when the proof comes back red:

1. `color: var(--bo-color-text-muted)` at the `#555` site `316.1` names.
   Exactly-one-site asserted before replacing; `postcss.walkDecls` then
   confirmed it parsed as a **declaration** rather than landing in the
   surrounding comment. Exit 1, one offender.
2. A **custom property** — `--bo-timeline-marker-fg: var(--bo-color-text-muted)`
   — injected into `approval-workflow`'s real print block. Exit 1, **while the
   byte-identical pre-existing declaration outside any print block was NOT
   flagged.** A discrimination proof: the detector reads position, not the
   token string. It is also why the predicate is the token reference and not a
   colour-property allowlist, which would have passed this case.

**The exemption list `316.1` anticipated is refused on a measurement** (the
recorded refusal): all three `print-color-adjust: exact` rules declare no colour
inside `@media print` at all, which is structural — preserving the cascade's
colour is the point, so such a rule has no reason to name one twice.

**A figure moved inside this wake and was corrected, not published.** The first
red-proof named `print/index.css:79`; this slice's own CSS-comment edit added
three lines above it, so the committed tree reads **82**. `ENVIRONMENT.md`'s
figure rule biting inside the wake that quotes it — the number a later wake
re-derives is the one the commit carries.

**Base rate re-run as `316.1` requires, and the denominator is two
populations.** Under the item's narrow property list it reproduces exactly —
**11 literal, 0 token, 6 files**, per-file tally to the digit. The gate counts
**14**, adding the `border` shorthand, which is the right population for it
because `border: 1px solid var(--bo-color-border)` in print IS the regression.
Both are in the gate header with which is which. **The verdict is the 0**, and
it is identical under either list. This is Slice 336's lesson applied on the
next wake instead of found by the next grill.

**Filed as `338.1`, not quietly widened:** the gate cannot see a token reaching
paper through the ordinary cascade. The source path is grepped
(`reset/index.css`'s print `body` rule covers inherited colour and loses to any
more specific rule; `.bo-timeline__marker` sets its own from a token). **The
printed contrast is NOT measured** — that needs print emulation, which a cloud
wake CAN do. Its Accept makes re-measuring step one and a benign reading a
satisfying refusal.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this slice**, and that is structural rather than a judgement
call: the diff is one new gate script, a CSS **comment**, `package.json`, two
generated README stamps, one generated JSON, and `ROADMAP.md` prose. **No CSS
rule changed**, so no rendering can move. `git diff` on `print/index.css` is
inside the `/* … */` block, checked rather than assumed.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree — core `build`, core `test`, `lint:css`, `docs:build`, `check:claims`
(**170** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (914 containers / 118
pages × 2), `check:layout` (**128** pages), `check:forced-colors`, `test:axe`
(**128 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (20 behaviours), `check -w
create-ui`, `npm run suite` (28 screens × 2). **`docs:build` was re-run after
the `ROADMAP.md` edit** (`check:slice-refs` 970 assertions / 320 slice numbers,
`check:floor` 591 files, `check:vendor-names` 613 files) **and once more after
this file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. It
found three things before the commit: the `:79`→`:82` shift above; a
`new URL(...).pathname` idiom where the sibling gates use `fileURLToPath`; and
**two wrong line numbers in the slice's own evidence table** (`print/index.css`
`88`/`110`, which this slice's comment edit had moved to `91`/`113`). Every
cited line number was then re-read with `sed -n Np` rather than trusted. A
fourth catch was a `[x]` on `338.1`, which is FILED, not built.

## The open set is 31 — no P0, and 20 are cloud-takeable

`roadmap_scope.py` at `e4742fd4` reports **31 open / 68 closed**, OPEN slices
`[15, 112, 249, 273, 296, 319, 320, 322, 323, 324, 325, 326, 327, 328, 330,
331, 332, 333, 334, 335, 336, 337, 338]`. **Slice 316 left the OPEN list**; 338
entered. The raw counts reconcile: `grep -c` reads 31 open / **70** closed, and
70 = 68 attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 20** — `319.3`, `320.2`, `322.3`, `323.1`, `324.1`,
  `324.2`, `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`,
  `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`.
  **`319.3` is the oldest of these** and is what rule 4 would reach for — but
  **rule 2 outranks rule 4 and is OVERDUE**, so read the top of this file first.
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

## The archive sweep is NOT due, and the two halves disagree for the NINTH wake

Measured at **`e4742fd4`**: **8,469 lines**, closed-history share **31.1%**
(2,632 lines across 11 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides it here — under AND, no
sweep. **Ninth consecutive wake where the two halves disagree.**

The share rose 30.5% → 31.1% as Slice 316 closed into the numerator. A wake
reaching for a sweep should read `roadmap_scope.py`'s pin line first — **9
targets are named by a still-open item**, and `316` has now joined the eligible
target list.

Trend across the last ten readings: 26.4% → 27.8% → 29.5% → 30.7% → 30.7% →
30.5% → **31.1%**.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a fifth
consecutive hand-off.** See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake (`0ba54bab`). Read the runs after
your push; one `actions/runs?branch=main` read costs nothing and is the only
thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...0ba54ba` and
the container started **detached**; fixed with `git checkout -B main
origin/main` before any commit, and `git branch --show-current` was re-read as
`main` immediately before committing. The forced update carried **Slice 337**,
which the previous hand-off predates — so the hand-off's *"what the next wake
should reach for"* (`316.1`) was still right, but its counter block was already
one wake stale. Trap 2 was clean in one `--unshallow` (no `shallow.lock`) and
again brought the tags: `git tag | wc -l` → **8**, §2's mandated count.

**Trap 1b bit once, inside a red-proof, and is worth reading**: a `cd
/home/user/busy-office-ui` at the top of the command made `node
scripts/check-print-tokens.mjs` resolve against the **repo-root** `scripts/`,
so the gate never ran and printed `MODULE_NOT_FOUND` — which, in a red-proof,
exits non-zero and therefore *looks like the gate going red*. It was caught only
because the message was a Node stack rather than the gate's own diagnostic.
**A red-proof must check WHICH failure it got**, not just that the exit code was
1. No `git stash` was used at any point.

**The pre-commit `git fetch origin main` found NO collision** — `origin/main`
unmoved at `0ba54bab`, `rev-list --left-right --count` reading `0 0`.

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
   never reached, so `polish_requeue.py --apply` was correctly not run (§3b
   step 0 is owed only once rule 6 is reached, and rule 4 matched first).

**`249.12` stays a live question and is sharper for the ninth time** — a ninth
consecutive wake where the two halves of the archival trigger DISAGREE. The
share resumed rising this wake (30.5 → 31.1) after one flat reading, so the
climb toward the threshold is back on but is still four readings from it.

**What the next wake should reach for: Standardize.** Rule 2 is `4 / 4 OVERDUE`
and sits above rule 4. If something outranks it, rule 4's pick is **`319.3`**, a
gate question about docs pages asserting a target size — cloud-takeable, no
browser needed, and its Accept makes refusing a satisfying outcome.
