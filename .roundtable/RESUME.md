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

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 2 → Standardize,
sweep, Slice 191**). Working tree clean at hand-off; the wake's commits went out
as one push. **No collision:** `git fetch origin main` at Step 0 and again
immediately before the first commit both showed `origin/main` unmoved at
`aa7512f5`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 8 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## What landed this wake (2026-08-29, cloud, rule 2 → Slice 191)

**Three rot-guard lanes clean, one line each** — `scan:dead-style` 0 dead of
1,428; `report:css-repeats` 8 groups matching `LOOPS.md`'s table by membership,
totals 237→238 rules and 225→226 distinct (one new rule that is not a repeat);
`report:prose` 14 flagged pages and all 14 carrying a verdict, checked by
differencing the page sets rather than by reading the reports.

**The fourth lane was reading a value its own command cannot print.** `LOOPS.md`
§3 asked for *"`LOOPS.md` still at 0 down after 167.2"*; the default window opens
2026-08-20 and *contains* 167.2's split (`3006da0a`), the only down that file has
ever had inside it. So the report printed `1 down` permanently while the
condition came true underneath it — **18 up / 0 down since the split, 9,337 →
12,852 words** — and the previous hand-off said *"still `0 down`"* with nothing
in the output to adjudicate the two.

**`report_loop_prose.py` now prints a `ratchet` block**: per file, the steps at
the tip that did NOT shrink it and the commit that last did, walked from HEAD
over full history, so no `--since` can hide or manufacture a cut. It shows
`CLAUDE.md` and `DESIGN.md` have **never been cut**, in 28 and 21 commits.

Red-proved three ways, each injection confirmed before its result was believed:
inverting `<` to `>` in a probe copy gives `(1, c4)` against the canonical
`(2, c3)`; a real cut appended to a synthetic `10·20·5·8·8` history takes it to
`(0, c6)` (the first attempt at that series produced FOUR commits — an identical
8-word file is not a commit — caught by printing the built history); and the
block is `diff`-identical across `--since 2026-08-20` and `--since 2026-08-28`
while the `accumulate` column moves `38 up / 1 down` → `19 up / 1 down`.
Reconciled against an independent walk on all five rows, ups **and** cut sha,
5 of 5.

**191.2 is the verdict the block makes readable** — `LOOPS.md` HONEST and
recurring, +3,503 words by section since its split, concentrated in Step 2
(1,441 → 3,135) and inside it **rule 4 (274 → 1,012)**. One drafted claim was
measured away before it shipped: rule 3 regrowing *181 → 672* (quoted from a
neighbouring entry) is wrong — one splitter across both revisions says **525 →
672**, the smallest of the five that moved.

**This wake's own commit added +156 words to `LOOPS.md`** (12,852 → 13,008), so
the ratchet now reads **19 up**. That is the accumulation 191.3 is about, and it
is named rather than left for the next sweep to notice.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one.** `git diff --stat` names one `.py`, one
`LOOPS.md` paragraph and one `ROADMAP.md` slice — no `.css`, no `.astro`. That is
an argument from the diff, **not a visual check, and it is not claimed as one.**

Gates green after the change: core `build` + `test` (**146**), `docs:build`,
`check:repo` (selftests **45 gates, 16 heuristic all self-tested**; slice-refs
**386** citations, **173** slice numbers), `check:claims` (**141**),
`check:layout` and `test:axe` (**127 pages × 2 widths**). No `verifier` agent is
available in this session, so the staged diff was reviewed by hand instead —
said plainly rather than logged as a verifier pass.

**Traps exercised for real this wake:** 1 (started detached — `git branch
--show-current` empty; `git checkout -B main origin/main`, and `origin/main`
again arrived as a **forced update**, `17b3ba6...aa7512f`), 1c (`CHROME_PATH`
exported in the same command as every browser gate — `scan:dead-style` needs it
too and fails loudly without it), 2 (unshallowed before any history figure:
**1,596** commits).

## Counters after this wake

**Prediction, written before running `dispatch_status.py`.** One `Standardize`
row naming Slice 191 → **1110** iterations, `Standardize` **0 / 4** (reset),
`Objective` **2 / 3** — Standardize closes a slice per rule 3's decided list.

**Verified: the prediction held exactly.** `1110` by the parser against a raw
`grep -c "^- "` of `1110`; `Standardize 0 / 4`; `Objective 2 / 3 [186, 191]`.

**No metric recorded**, deliberately: the ratchet figures are a one-off
characterisation of eight files' histories, not a repeatable sample under an
existing name, and a single-sample name pads the store rule 5 reads (184's
discipline).

## What the next wake should expect

Rules 2 and 3 are both `ok`, so **rule 4 fires**: the OLDEST still-open item.

Checkboxes at hand-off — re-count rather than copying:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 8
```

| item | blocked on | which list does it need? |
|---|---|---|
| `15.12` | **owner-blocked** (owner hardware, AT runtime) | neither; no wake can take it |
| `112.3`, `112.4` | **owner-blocked** (briefs; `112.4` waits on `112.3`) | neither |
| `189.1` | nothing | cloud-takeable — CLAUDE.md wording |
| `190.2` | nothing | cloud-takeable — `check-claims.mjs` cases |
| `190.3` | nothing | cloud-takeable — a specificity comment |
| `191.3` | nothing | cloud-takeable — a judgement about `LOOPS.md` rule 4 |
| `190.1` | nothing, but it **re-opens an owner-settled trade** | measurable in a cloud wake; the CHOICE is a design call for the owner |

Oldest still-open is `15.12`, then `112.3`/`112.4`, all owner-blocked — so the
oldest *dispatchable* one is **`189.1`**, unchanged from the last hand-off. Say
**which kind** of blocked when reporting rule 4 as finding nothing (`LOOPS.md`
rule 4: owner-blocked / browser-blocked / agent-blocked), and for a
browser-blocked one name which of `ENVIRONMENT.md`'s two lists it needs.

**On `190.1`:** its Accept is expressed as measurements a cloud wake can take,
but choosing *which* of the three options to implement re-opens what the owner
settled in 173.2. Bring the options and the table to the owner rather than
picking one autonomously.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals, or 176.3**, which the owner
closed as no-change. Re-measure before reopening anything.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** It reports **7** closed ids named here — `191.1`, `191.2`, `173.2`,
`175.3`, `176.3`, `182.2`, `185.1` — and **all seven are historical references,
none a claim that any is open.** `191.1`/`191.2` are this wake's landed items;
`173.2` is named only as the owner call `190.1` would re-open; `175.3`, `176.3`
and `182.2` are prior decisions this file says not to re-raise; `185.1` is
quoted in the Direction read. The genuinely open ids — `15.12`, `112.3`,
`112.4`, `189.1`, `190.1`-`190.3`, `191.3` — are in the table above and are not
in that list, which is the check agreeing with the table. **Seven is the highest
this file has recorded** (the measured distribution over 86 revisions was
`{0: 78, 1: 3, 2: 3, 3: 2}` before yesterday's 6); it is high because this
hand-off carries both a do-not-re-raise list and a direction history, not
because anything is stale. Do not read the number as a trend.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read it
  there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → `0.1.0`, re-asked this wake) and the release
  workflow ships it. What is left is **one thing this loop cannot check from
  here: whether `@busy-office/create-ui` has a Trusted Publisher configured on
  npmjs.com.** **Stated as unknown, not as done.** If it is not set, the first
  release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery. A release cannot even be *attempted*
  today without a version bump — `check-publishable.mjs` exits 1 on both
  packages, by design.
- **Did this wake advance it?** **No.** Rule 2 dispatched a sweep of the loop's
  own rot guards; nothing in the diff touches either package.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment. **Derived this wake, after this wake's row was
  committed: 59 non-Meta work rows since `fb15cdc`; the needle matches 6;
  reading them, `164.3`, the `0.1.0` release and `185.1` advance the direction,
  while `168.1`, the `173.2`/`185` triage and `186` narrate or detect it — so
  56 of 59 did not.** *(Last honest reads: 55 of 58, 52 of 55, 49 of 52, 46 of
  47, 43 of 44, 41 of 42, 38 of 39.)*

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
