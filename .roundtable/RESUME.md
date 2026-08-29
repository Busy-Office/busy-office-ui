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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → Continue,
build mode**, landed as **Slice 199**). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## ⚠ A COLLISION HAPPENED THIS WAKE, AND THIS WAKE WAS THE LOSER

**Both dispatchers took `193.2`.** The local session pushed first (`1c111d7f`).
Step 0c was followed exactly: **its close stands as the record and none of it
was re-done.** `git fetch origin main` immediately before the first commit is
what caught it — the working half of Step 0c, doing its job again.

**The local dispatcher then pushed three more times while this wake verified**,
taking Slices **197** and **198** for its own work. This wake's slice was
renumbered **197 → 198 → 199**, and each renumber forced a full re-run of the
chain, because `gen-llms.mjs` and `check:slice-refs` both read `ROADMAP.md`.

**An observation for whoever tunes this next — not a proposal, and not filed.**
Step 0c's accepted cost is *"up to one wake's work, discarded"*. The cost paid
here was a different shape: not discarded work, but **three renumber-and-
reverify cycles**, because slice NUMBERS are allocated by reading the file and
both dispatchers read the same next integer. That is neither the `loop-log.md`
append point the section anticipated nor a merge conflict — a duplicate heading
merges perfectly cleanly, and the only thing that catches it is
`check:slice-refs`'s *"each slice number heads one section"*. One wake is an
anecdote, and 175.4 has the collision policy settled by owner call, so this is
recorded rather than raised.

## What landed this wake (Slice 199)

Only what `193.2`'s own close named as unanswered — it named both gaps in its
own words, which is what makes this a follow-on rather than a re-run. Report:
`.roundtable/reopen-conditions-2026-08-29.md`.

| what its close left open, verbatim | what this wake measured |
|---|---|
| *"the 558 denominator … **left unresolved rather than forced**"* | **closed.** `a9470314` gives `43 + 515 = 558`, exact including the split — with 193.2's own parser, unchanged |
| *"Two (130.2, **104.4**) … left unchecked this wake"* | **`104.4`'s trigger had FIRED** — max group 7 → 11, and **zero re-checks in 7 days** |

**`199.2` (closed) — why the denominator looked unresolvable.** Its close tested
`774558e` (the commit that FILED 193.2) and HEAD. The tree it never tested is
the one **13 minutes before** the filing, whose naive stamp reads **8 hours
after** it: `+0800` local vs `+0000` cloud, which `LOOPS.md` §0c already records
as 164.2. The gap of 3 was the three items the filing commit itself added —
193.2 measured its corpus and then wrote itself into it. **`git merge-base
--is-ancestor` settles ancestry; the face value of a stamp does not.**

**`199.1` (OPEN) — `104.4`'s premise died the day it was written.** The refusal
rested on *"`pattern-groups.mjs`'s six groups top out at 7 tiles … and run as
low as 1"*. Both halves are false today: **max 11, min 4, total 39**. It broke
on 2026-08-22 (`bb8b9ab4` → 8) and reached 11 on 2026-08-25.
`grep -rn '104\.4'` returns four lines — proposal, roadmap entry, log row — so
nothing ever re-asked it.

**Shipped with it:** `scripts/loops/report_reopen_conditions.py`, the command
193.2's Accept asked for and the item carried only as a comment sketch. It
reconciles its parse against a raw marker count per file and **refuses to
report** on disagreement; red-proved by injection (`--self-test`). **Not a gate,
and named by no playbook step** — 193.2 refused that, and the cost is written
into the script's own header rather than left implicit: this repo's own measured
hypothesis predicts an unnamed script goes unread.

**Two instrument scares, both caught before the number was used** — §8's
ordering working as intended. An `awk` range read 0 on every commit, and a
`patterns.json` `groups` sum read 0 because that array uses a different key
shape. Both were re-derived directly against the files before anything was
published, and the `104.4` figure survived because it reconciles against
`patterns.json`'s own independent `count` field (**39**, agreeing with the tile
sum).

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light and
dark**. Nothing was visually verified and nothing is described as if it were.

**Nothing this wake needed one.** `git diff --stat` names `ROADMAP.md`, one
`.roundtable` report and one Python script — no `.css`, no `.astro`, no
rendering change. Every figure is a git reading, a `grep`, or a Node read of a
data module; none is on `ENVIRONMENT.md`'s cannot-run list. **`199.1` names the
screenshots it will eventually need as NOT taken.**

Gates green on the committed tree, re-run in full **after** the final renumber
rather than trusted from the earlier build: core `build` + `test` (**146**
passed), `docs:build`, `check:repo` (selftests **45 gates, 16 heuristic all
self-tested**; slice-refs **400** citations / **181** slice numbers, each
heading one section), `check:claims` **144**, `check:layout` **127** pages,
`test:axe` **127 pages × 2 widths, zero violations**.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (container started **detached** —
`git branch --show-current` empty; repaired with `git checkout -B main
origin/main` before any commit), 2 (unshallowed before any history figure:
**1,624** commits), 1c (`CHROME_PATH` exported in the same command as every
browser gate), and **164.2's timestamp offset** — load-bearing this time rather
than incidental, since it is the entire reason `199.2` was findable.

## Counters after this wake

Verified after recording: **1140** rows by the parser against a raw
`grep -c "^- "` of **1140**.

```
Standardize   1 / 4 Continue rounds   ok
Objective     1 / 3 slices            ok   [199]
Optimize      0 wake-date(s) newer    ok   [newest pair: axe-violations]
```

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing.

**No metric recorded**, deliberately: every figure this wake characterises one
prior claim about one file or one data module, not a repeatable sample under an
existing name, and a single-sample name pads the store rule 5 reads (184's
discipline).

## What the next wake should expect

**Rules 2 and 3 are both below threshold, so rule 4 is where the next wake
lands.** Re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 4
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked**, and the block narrowed while this wake ran | neither |
| `199.1` | nothing, in part | **split by branch** — see below |

**`112.3` moved while this wake was verifying, and it is still owner-blocked.**
`b81131f3` records **OWNER DECISION 2026-08-29: agree, all four
recommendations** — the pilot is 112.4's admission gate only, **5 briefs** not
8. The four questions are answered; what remains is the one input no wake can
supply: *"the owner writing 5 real ERP screen briefs with sealed picks"*, and
nothing in the item is dispatchable until the first exists in
`.roundtable/pilot-112/briefs.md`. So the classification is unchanged even
though the item is not — **re-read it rather than trusting this line.**

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is **`199.1`**. Say **which kind** of blocked when
reporting rule 4 as finding nothing (`LOOPS.md` rule 4: owner-blocked /
browser-blocked / agent-blocked), and for a browser-blocked one name which of
`ENVIRONMENT.md`'s two lists it needs.

**`199.1` is split, and the split is the honest part.** The **tile counts are
already taken** and sit on `ENVIRONMENT.md`'s can-run list — a cloud wake needs
no browser for them. What a cloud wake **cannot** take is the scannability
judgement, if the verdict turns on it: that is a *rendered image* a human
compares at 1440px and 390px in both themes. A cloud wake may settle the counts
and must leave that open, saying so; a local wake can close it outright.

**Re-refusing `199.1` is a satisfying outcome and is written into its Accept.**
`104.4`'s original reasoning — our workflow-stage groups already ARE the
organizing axis a filter would duplicate — is untouched by group size and may
still carry the refusal on its own. What must not survive either way is the
sentence *"top out at 7 tiles"*.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, Slice 195's finding A, or 167.1's retired
`CLAUDE.md` watch.** And **do not re-open `193.2`** — its close stands, and one
more fired condition does not meet its own stated reopen bar, which asks for a
**second**. `199.1` is the first, now on the record so the next is measurable
rather than anecdotal. Re-measure before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** The ids this file names in backticks that `ROADMAP.md` records `[x]`
closed are **`193.2`**, **`199.2`** and **`104.4`** — every one a **historical
reference**, none a claim that any is open. `193.2` is the item the other
dispatcher closed, described throughout in the past tense; `199.2` is this
wake's own closed item; `104.4` is the closed refusal whose trigger fired, and
the live work it generated is `199.1`, which is open and in the table above.
(`167.1`, `196.1` and `164.3` are closed or archived and are named only to say
what is retired.) The genuinely open ids — `15.12`, `112.3`, `112.4`, `199.1` —
are in the table and are **not** among the closed set, which is the check
agreeing with the table.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read it
  there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → **`0.1.0`**) and the release workflow ships
  it. What is left is **one thing this loop cannot check from here: whether
  `@busy-office/create-ui` has a Trusted Publisher configured on npmjs.com.**
  **Stated as unknown, not as done.** If it is not set, the first release
  publishes core and then fails on create-ui's publish step; the workflow's
  comments carry the recovery. A release cannot even be *attempted* today
  without a version bump — `check-publishable.mjs` exits 1 on both packages, by
  design.
- **Did this wake advance it?** **No.** Rule 4 dispatched a measurement about
  the roadmap's own record-keeping; nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Not re-derived this wake, and that is deliberate** —
  the command below takes seconds, but the log gained rows from BOTH dispatchers
  between this wake's fetch and its push, so any figure taken here would be a
  snapshot of a file still moving. Said plainly rather than published as a
  number that looks steadier than it is.
  *(Last honest reads: 69 of 72, 68 of 71, 65 of 68, 61 of 64, 56 of 59, 55 of
  58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38 of 39.)*

  ```
  # `git diff fb15cdc..HEAD` MISSES the current wake's rows until they are
  # committed; drop the `..HEAD` to diff the working tree instead.
  git diff fb15cdc -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28)**, choosing to keep the routine running hourly. Do not re-triage
  it and do not slow the routine on your own judgement.

```
npm view @busy-office/create-ui version     # 0.1.0
npm view @busy-office/ui version            # 0.5.0
node packages/core/scripts/check-publishable.mjs packages/core packages/create-ui
  # exits 1 today: both versions are already on the registry. That is the gate
  # working, not a fault — a release needs a bump first.

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**These commands are about to age, and the next owner decision is what ages
them.** The `npm view` lines no longer test a blockage — they confirm a publish —
and the direction's last open question is a setting on npmjs.com rather than
anything in this tree. When the owner picks a direction beyond "wire the front
door into the release", rewrite them; do not reinterpret them.
