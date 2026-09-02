# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired against the PREVIOUS
> revision of this file, correctly** — three closed ids it still named, all
> three removed by this rewrite. The ids are deliberately not repeated here:
> naming them to report them re-trips the check on its own explanation, which
> is CLAUDE.md's "an assertion that can be tripped by its own explanation"
> landing in a handover. Run the check to see what it says about the file as it
> stands now.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; four
commits — `71a61679`, `1590bc2b`, `b0b70f96` and the bookkeeping commit carrying
this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ Rule 3 fires next wake — Objective is OVERDUE and nothing sits above it

```
Standardize   0 / 4 Continue rounds   since 2026-09-02 16:54   ok
Objective     4 / 3 slices            since 2026-09-01 15:42   OVERDUE  [238, 241, 243, 244]
Optimize      0 wake-date(s) newer    since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

- **This wake discharged rule 2** — the Standardize counter reset 4/4 → 0/4.
  Rule 3 was already overdue and waited, per Step 2's stated order; it is now
  at **4 / 3** because Slice 244 armed it further. Rule 1 (no open P0) and rule
  2 (`ok`) are both clear above it, so **rule 3 dispatches the Objective grill**.
- **Narrow the arming set before grilling it**, per §6 step 0 — check
  `.roundtable/INDEX.md` first and state the honest scope. `[238, 241, 243, 244]`
  is what the counter names, not a plan.
- **Rule 5 is `ok`, not STALE, and was genuinely evaluated**: `axe-violations`
  reads zero across three consecutive runs and the one live absolute budget
  (`RF_BUDGET_KB = 40`) passed inside `npm run build -w @busy-office/ui`. **Do
  not read `bundle-gz-kb`** — it and eleven other names are 13+ days stale and
  its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## The archive sweep signal is 43.4%, and the lane is clear

`roadmap_scope.py` reads closed-history share **1,304 / 3,006 = 43.4%** with
targets `[243, 242, 241, 240, 239, 238, 237]` and **no target named by a
still-open item**, so nothing blocks a sweep when one is next dispatched.

The 46.2% → 43.4% move is **denominator-only and is this wake's own doing**:
Slice 244's ~190 open-side lines were added to the live file while the closed
numerator stayed at 1,304. Read it from the tool, never by subtracting.

## What landed this wake

**Standardize, dispatched by rule 2** after rule 1 was evaluated and clear.
Three commits. Full detail in ROADMAP 244.

- **All four standing lanes clean** — say `n of 4`, the playbook's own
  correction. 0 dead of 1,433 inline decls; css-repeats 74/242/230/**8** with
  the eight groups compared **member-for-member by selector** against LOOPS.md's
  table (five new rules, all five distinct, no group grew; the `x4`
  joined-control group is still two components, so its reopen trigger is unmet);
  14 flagged prose pages, all inside the sixteen verdicted; lane 4's ratchet
  shows no accumulate-class change.
- **The finding came from the fifth thing step 1 names and no instrument
  covers** — duplicated logic across scripts. `cssFiles` was hand-copied **four**
  times in `packages/core/scripts`, three byte-identical and `generate-scales`
  already diverged. `src-css-files.mjs` is the new chokepoint.
- **It obeys `dist-css.mjs`'s 2026-08-17 refusal rather than reversing it.**
  That header declines to fold different tree rules behind one options bag;
  so only the three copies that were **already the same rule** are consolidated,
  and `generate-scales.mjs` keeps its own copy carrying its reason.
- **`from_disk`/`from_rev` were the same drift in `scripts/loops`**, folded into
  the `_common.py` that already exists there.
- **Both consolidations are behaviour-preserving AND red-proved by
  discrimination**, because byte-identical output cannot tell a working
  chokepoint from an unused one. Every injection was confirmed present in the
  file before the result was believed.

**Refused inside the item, and recorded:** folding `generate-scales.mjs` into
the chokepoint.

**One instrument of this wake's own was wrong on its first output, written down
rather than smoothed over**: the cross-file duplicate scan reported **11** blocks,
six of them sliding windows of a single `import` run — "drop a window that is a
substring of another" does not deduplicate *shifted* windows. Fixed by extending
each match along its diagonal. Its final **0** is red-proved, not trusted: a
novel identical 7-line function appended to two unrelated scripts in a scratch
copy took it **0 → 1** with both sites named.

**A claim this wake nearly published and measurement killed:** that the three
plain walkers count generated CSS as authored source. They do pick up
`tokens/scales.css` and `scales/extended.css`, but both **ship**, so including
them is correct. Checked before writing it down.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test`, `lint:css`, `docs:build`, `check:claims`, `check:formatting`,
`check:scroll`, `check:layout` (**127 pages**), `check:forced-colors`,
`test:axe` (**127 × 2, zero violations**), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**19 behaviours**),
`check -w @busy-office/create-ui`, and `suite` (**28 screens × 2 widths**).
`check:repo` was re-run on its own after the ROADMAP edits: `check:slice-refs`
reads **699 citations / 226 slice numbers** (up from 698 / 225 — Slice 244's own
heading and citation, which reconciles).

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `f401c1e2` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty — the check that file names as
the actual answer), and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...f401c1e`) with the local `main` ref stale at `17b3ba6` — the same
stale sha as the last six wakes. `git checkout -B main origin/main` fixed it
before any commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,802** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage.

**The open set is 4 items across 3 slices, and ONE of them is now dispatchable:**

| item | kind of blocked |
|---|---|
| `244.4` src/css walker gate | **NOT BLOCKED** — filed this wake; any wake can build it |
| AT runtime evidence (Slice 15) | **owner-hardware-blocked** — needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**This ends four consecutive wakes reporting rule 4 as finding nothing.** 244.4
is neither owner-, browser- nor agent-blocked. It is not reached *next* wake —
rule 3 is overdue above it — but it is there afterwards.

**What is owed to the owner:** unchanged, and now **twelve wakes old**. Slice
112's pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS, no page markup and no shipped artefact** — the diff is four build scripts,
two loop scripts, `ROADMAP.md` and the bookkeeping files — and every consumer's
output is byte-identical before and after, which is a stronger statement than a
screenshot would have been. `check:layout` (127 pages) and `test:axe` (127 × 2)
executed in this container regardless and are green.
