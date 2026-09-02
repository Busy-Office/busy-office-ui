# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired this wake, correctly**
> — it named `240.1` and `241.2`, both closed, both of which this rewrite has
> removed. That is the check doing its job.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `e60338c8` (the 242 Polish round) and the bookkeeping commit carrying
this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ Rule 4 HAS something dispatchable next wake — this reverses the last hand-off

The previous hand-off's headline was *"rule 4 finds nothing"*, and it was right
at the time. This wake's round filed **`242.1`**, so rule 4 now matches before
rule 6 is reached.

- **`242.1` is dispatchable by ANY wake** — decide whether arm 8 (a component
  scored `interaction: na` whose docs page imports a behaviour) becomes a build
  gate, or record a one-line refusal naming which argument decided it. It is
  **not** browser-blocked: it is a JSON/source/base-rate question plus, if the
  answer is yes, a red-proof by injection, all of which
  `ENVIRONMENT.md`'s "can run" list covers. Its Accept says outright that
  **finding the predicate un-gateable is a satisfying outcome**, so refusing it
  closes it.
- The other three are the long-standing blocked set — see the Direction table.
- **Objective is one slice away at 2 / 3** and preempts rule 4. It did **not**
  move this wake: rule 3 counts Continue/Standardize rows only (161.4) and this
  wake recorded a `Polish` row. It arms the moment a Continue or Standardize row
  names a slice that is not 238 or 241 — which dispatching `242.1` would do.

## Dispatcher counters, read immediately after recording (Step 0b)

```
Standardize   3 / 4 Continue rounds  since 2026-09-01 12:05   ok
Objective     2 / 3 slices           since 2026-09-01 15:42   ok  [238, 241]
Optimize      0 wake-date(s) newer   since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

**Neither counter moved this wake**, and both for the same recorded reason: a
`Polish` row arms neither. Standardize stays one round from firing.

**Rule 5 is `ok`, not STALE, and was genuinely evaluated**: `axe-violations`
reads `0.0 → 0.0 → 0.0` across three consecutive runs, and the one live absolute
budget (`RF_BUDGET_KB = 40`) passed inside `npm run build -w @busy-office/ui` at
`min 38.0 kB`. **Do not read `bundle-gz-kb`** — it and eleven other names are
13+ days stale and its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5
trigger. Not evaluable.

## The archive sweep signal: still Standardize's lane, now at 3 / 4

`roadmap_scope.py` reads closed-history share **926 / 2,645 = 35.0%** with
targets `[241, 240, 239, 238, 237]` and **no target named by a still-open item**,
so 236.2's lane is clear. Re-run it — the denominator moves every wake.

**The share fell 38.0% → 35.0% and that is this wake's own doing, not drift**:
the numerator is unchanged at 926 while Slice 242 added ~205 lines to the OPEN
side. Read it from the tool, never by subtracting. Do not self-dispatch the
sweep; it arms on its own next round.

## What landed this wake

**Polish, reconcile mode, dispatched by rule 6** after rules 1-5 were all
evaluated and clear. One commit. Full detail in ROADMAP 242 and
`.roundtable/polish-state.md`.

- **The pick needed no invented tie-break, the first time since 176.1.** Of five
  re-queued surfaces, `dashboard` was the only one at `1/3` with a DSA entry
  (`inline-editing` has none — verified, not inherited).
- **The first defect in this ledger where the SCORE was wrong, not the cite.**
  `interaction: na` / *"ships no behavior"* on a component that ships
  `initCollapsibleCards`, whose three hooks are all on dashboard's own
  `api.json` surface. Wrong when written: the behaviour and the CSS part landed
  in the same commit `055a706a` (2026-08-14), nine days before the score. `na`
  is unjustifiable under the cite's own false premise too — the rubric gives
  **3** to a component that ships no behaviour "by saying so".
- **§3b step 4's blind re-score RAN, for the first time.** Every round since
  182.1 correctly recorded it as *owed*; this session could spawn the second
  agent. Given the surface, dimension and rubric text and told nothing about the
  old score, it returned **3** and ruled out `na` on its own reading.
  **`scored` stays `2026-08-23`** — one dimension was re-scored, not six.
- **Second defect:** the `spacing` cite lists `20rem` among the comment-only
  numbers where it is live at `:16`, and never mentions the live `41rem` at
  `:145`. Score stays 3; this **supersedes** the stepper round's "not a defect",
  which examined `20rem` alone and never saw `41rem`.
- **New arm 8**, 1 of 18 → 0 of 17, red-proved three ways — after **four**
  ownership definitions were measured and discarded, reproducing the rubric's
  own note that 94.9 applied this dimension by reading because "an earlier regex
  was wrong on 4 of 7".

**Refused, and filed rather than decided:** a gate for arm 8. It is the first
member of this class that is mechanically writable — the four refusals before it
all turned on a gate needing per-cite commands — but 101.3 confines Polish to
the existing ratchet and post-fix the predicate is true of **0 of 17**. That is
`242.1`.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test`, `lint:css`, `docs:build`, `check:claims`, `check:formatting`,
`check:scroll` (**912 containers / 118 pages**), `check:layout` (**127 pages**),
`check:forced-colors`, `test:axe` (**127 × 2, zero violations**),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19 behaviours**), `check -w @busy-office/create-ui`, and
`suite` (**28 screens × 2 widths**). `check:dsa-scores` re-ran green at
`360 assertions / 40 scored`, and `Not yet scored` is absent from dist.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `e640ce5b` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...e640ce5`) with the local `main` ref stale at `17b3ba6` — the same
stale sha as the last four wakes. `git checkout -B main origin/main` fixed it
before any commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,798** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 4 items across 3 slices, and one of them is dispatchable:**

| item | kind of blocked |
|---|---|
| `242.1` arm-8 gate decision | **not blocked** — any wake; not browser-blocked |
| AT runtime evidence (Slice 15) | **hardware-blocked** — owner hardware; needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**None of the three blocked ones is browser-blocked or agent-blocked**, so a
local wake gains nothing on them that this one could not do.

**What is owed to the owner:** unchanged, and now **ten wakes old**. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**One thing this wake could do that no previous cloud wake could**, and it is
worth knowing for the next: **the blind re-score is runnable here.** §3b step 4
has been recorded as *owed* by every round since 182.1 on the grounds that the
wake could not spawn a second agent. This session could, and doing it turned a
suspected defect into a corrected score rather than a filed note. If a round
finds a score it believes is wrong, try the blind re-score before assuming it is
agent-blocked.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no CSS
and no page markup** — the diff is two cite strings, one score, `ROADMAP.md` and
the Polish ledger — so nothing in it rests on a rendered image. `check:layout`
(127 pages) and `test:axe` (127 × 2) executed in this container regardless and
are green.
