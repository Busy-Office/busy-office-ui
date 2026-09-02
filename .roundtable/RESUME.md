# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired this wake, correctly**
> — it named `240.1`, `241.2` and `242.1`, all three closed, all three of which
> this rewrite has removed. That is the check doing its job.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `3f76c0e1` (the 243 refusal) and the bookkeeping commit carrying this
file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ TWO counters are OVERDUE — rule 2 fires before rule 4 is reached

This reverses the last hand-off in the other direction: it said rule 4 had
something dispatchable. It did, this wake took it, and closing it armed both
counter rules at once.

```
Standardize   4 / 4 Continue rounds   since 2026-09-01 12:05   OVERDUE
Objective     3 / 3 slices            since 2026-09-01 15:42   OVERDUE  [238, 241, 243]
Optimize      0 wake-date(s) newer    since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

- **Rule 2 wins — dispatch Standardize.** It sits above rule 3 in Step 2's
  stated order, so the Objective grill waits one more wake even though it is
  also at threshold. Do not reorder them; the ordering is 2026-08-18's decision
  and its reasoning is written beside the rule.
- **Both moved for the same recorded reason**: this wake's row is
  `Continue · build`, and rule 3 counts Continue/Standardize rows only (161.4).
  Slice 243 is the third slice since the last Objective.
- **Rule 5 is `ok`, not STALE, and was genuinely evaluated**: `axe-violations`
  reads `0.0 → 0.0 → 0.0` across three consecutive runs, and the one live
  absolute budget (`RF_BUDGET_KB = 40`) passed inside
  `npm run build -w @busy-office/ui`. **Do not read `bundle-gz-kb`** — it and
  eleven other names are 13+ days stale and its `10.8 → 11.6 → 11.7` *looks*
  exactly like a rule-5 trigger. Not evaluable.

## The archive sweep signal jumped to 46.2% — and Standardize's lane 4 is where it lands

`roadmap_scope.py` reads closed-history share **1,304 / 2,820 = 46.2%** with
targets `[243, 242, 241, 240, 239, 238, 237]` and **no target named by a
still-open item**, so the lane is clear.

**The 35.0% → 46.2% move is this wake's own doing, not drift, and the mechanism
matters**: Slice 242's only open item was `242.1`, so ticking it flipped that
whole slice's body from the OPEN side of the ratio to the closed numerator, and
Slice 243 added its own closed body on top. Numerator 926 → 1,304, denominator
2,645 → 2,820. Read it from the tool, never by subtracting — the reconciliation
above is a check on the tool, not a substitute for running it.

## What landed this wake

**Continue, build mode, dispatched by rule 4** after rules 1-3 were evaluated
and clear. One commit. Full detail in ROADMAP 243 and the Polish ledger's arm-8
section.

- **`242.1` is ANSWERED: REFUSED — arm 8 does not become a build gate.** Its
  Accept allowed a refusal and said outright that finding the predicate
  un-gateable is a satisfying outcome, so the item closes.
- **What decided it is soundness, and it is neither of the two arguments the
  Accept anticipated.** The arm goes **red on a correct tree**: `navbar` scores
  `interaction: na` with the cite *"a container: it holds controls but
  introduces none of its own"*, and giving its page the same `initDropdowns()`
  demo `button.astro` already carries makes the arm flag it while the score
  stays right by its own words. All three original injections varied the true
  positive; this direction was never tested.
- **The arm reads demo CONTENT, not a page import** — 21 of 21 matches sit
  inside a demo template literal or a body `<script type="module">`, because
  Astro frontmatter runs on the server and cannot wire a browser behaviour at
  all. That is why it cannot tell whose behaviour it found, and **4 of 21** pages
  (`button`, `offcanvas`, `richtext`, `form`) name only a neighbour's.
- **No narrowing rescues it**, which is what puts arm 8 in the same class as
  216.2/217.2/220.2/227.2 after all: the sound version needs an ownership map —
  the datum four definitions already failed to produce — and its cheapest proxy
  **misses `dashboard`/`initCollapsibleCards`, the only defect arm 8 has ever
  found.** 242.1's "the first member of this class that is mechanically
  writable" is withdrawn in ROADMAP and in the ledger.
- **Arm 8 is KEPT as a probe a human reads.** Do not re-file it as a gate; the
  ledger carries that instruction beside the probe.

**Refused inside the item, and recorded:** the name-match narrowing.

**One instrument of this wake's own over-reported and it is written down rather
than smoothed over**: the name-match probe used to shortlist Finding B's four
pages flagged **9 of 21**, and five of the nine ship their own behaviour under a
non-matching name. The four were confirmed by reading each import's context.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test`, `lint:css`, `docs:build`, `check:claims`, `check:formatting`,
`check:scroll` (**912 containers / 118 pages**), `check:layout` (**127 pages**),
`check:forced-colors`, `test:axe` (**127 × 2, zero violations**),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19 behaviours**), `check -w @busy-office/create-ui`, and
`suite` (**28 screens × 2 widths**). `check:repo` was re-run on its own after
the ROADMAP edits: `check:slice-refs` reads **698 citations / 225 slice numbers**
(up from 693 / 224 — Slice 243's own heading and citations, which reconciles),
and `check:dsa-scores` **360 assertions / 40 scored**.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `af01aadb` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...af01aad`) with the local `main` ref stale at `17b3ba6` — the same
stale sha as the last five wakes. `git checkout -B main origin/main` fixed it
before any commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,800** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 3 items across 2 slices, and NONE of them is dispatchable:**

| item | kind of blocked |
|---|---|
| AT runtime evidence (Slice 15) | **owner-hardware-blocked** — needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**None is browser-blocked or agent-blocked**, so a local wake gains nothing on
them that this one could not do. Rule 4 will find nothing next wake — but it is
not reached, because rules 2 and 3 are both overdue above it.

**What is owed to the owner:** unchanged, and now **eleven wakes old**. Slice
112's pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS, no page markup and no shipped artefact** — the diff is `ROADMAP.md`, the
Polish ledger and the bookkeeping files, and the only code written was a scratch
injection that was never committed — so nothing in it rests on a rendered image.
`check:layout` (127 pages) and `test:axe` (127 × 2) executed in this container
regardless and are green.
