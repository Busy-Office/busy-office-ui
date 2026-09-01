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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `411a6663` (the slice) and the bookkeeping commit carrying this file
— pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: every counter is spent — next wake dispatches at rule 4

```
Standardize   0 / 4 Continue rounds since 2026-09-01 12:05   ok
Objective     0 / 3 slices          since 2026-09-01 15:42   ok
Optimize      0 wake-date(s) newer   since 2026-09-01 12:05   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. **This wake spent rule 3**, which
the previous hand-off had predicted; it now reads `0 / 3`. Rules 1, 2, 3 and 5
are all clear, so **the next wake reaches rule 4 — and unlike the last four
hand-offs, rule 4 now has something to take.** Re-run `dispatch_status.py`
rather than trusting this snapshot.

**Rule 5 is `ok`, not STALE**, and it was left that way deliberately: this wake
recorded `axe-violations` again — a name **already sampled** — because a name
sampled once can never satisfy "two consecutive runs" (184.1's defect).
**No regression: 0 → 0.** **Do not read `bundle-gz-kb`** — it and eleven other
names are 13+ days stale and its `10.8 → 11.6 → 11.7` *looks* exactly like a
rule-5 trigger. Not evaluable.

## The archive sweep is still DISCHARGED — do not re-raise it

`roadmap_scope.py` reads closed-history share **149 / 1,801 = 8.3%** with targets
`[237]` — a slice closed hours ago, not a backlog of history. The signal that
carried Slices 235 and 237 is spent.

## What landed this wake

**Objective, grill mode, dispatched by rule 3 (`4 / 3 OVERDUE`). One commit;
Slice 238 filed with one open item.**

- **Scope narrowed BEFORE grilling, per the playbook's step 0, and that changed
  what was grilled.** The armed set was `[232, 234, 236, 237]`, but Slice 236 is
  *"Objective grill of Slices 232, 233, 234, 235"* — so two of the four had
  already been covered in full. Resolved by listing the six Continue/Standardize
  rows logged **after** the last `Objective` row (`a5f5007a`): 232.3
  (`fd9affed`), 234.1 / 236.1 / 236.2 (`ede706af`), 237.1 / 237.2 (`7e861867`).
  All six landed after grill 236 read those slices, so **232 and 234 are armed
  by genuinely new work, not by re-arming**, and 236's verdicts on 233/235 and
  232's on 229/230/231 were left untouched.
- **24 of 25 published claims reproduce**, and the 25 are **enumerated in the
  report** rather than asserted as a total — an unaudited count is the exact
  defect the finding is about. 237.1's sweep was re-verified by a **third**
  independently written parser reading `git show 7e861867^:ROADMAP.md`:
  381/368/161/500 = 1,410, 4/4 present-once-in-archive and absent-from-live,
  headings 212 → 216, and `2,907 − 1,410 + 12` = the stated 1,509 at move time
  against 1,659 committed. Lanes 2-3 byte-identical (74/242/230/8; 118 of 127,
  median 748, total 105,705). 232.3's gate, its 11-case self-test,
  `check:selftests` 47/16/31 and `check:ci-ignores` 130/128 all land where
  stated; 236.1's command prints `any=1 excl=0` ×5 and `any=3 excl=2`;
  `roadmap_scope.py --self-test` passes A–E; 234.1's aggregate is 1/6/5/0.
- **237.1's slice-refs model PREDICTED this commit's own reading, which is worth
  more than reconciling the one it was built from.** Adding Slice 238 makes one
  new live heading and no new citation, so the item's arithmetic predicts
  `435 + 1 + 250 = 686` over 220 headings. The gate reads exactly **686 / 220**.
- **238.1 filed and left OPEN — 237.2's supporting count is five, not four.**
  Between 177.1 naming the three stubs (`2ae54a4a`) and 235.3 deleting them
  (`dc861a25`), **five** commits touched `ROADMAP-archive.md`; `e29c7c18`
  (214.1, the sixth archive sweep, +1,575 lines) is missing from the
  enumeration, at **two durable sites** — `ROADMAP.md` and the archive header
  that item itself rewrote. Presence in the range was checked with
  `git merge-base --is-ancestor`, not read off a list.

**The mechanism is nailed down rather than guessed, and this is the part worth
carrying forward.** The five commits carry near-identical subjects — *fifth*,
*sixth*, *seventh*, *eighth archive sweep* — and the one dropped is the middle
of three consecutive `— Nth archive sweep` lines. **237.1 counts `e29c7c18`
correctly one item earlier in the same commit** (calling its own sweep "the
ninth" requires it), so one enumeration of this file's history in `7e861867`
includes the commit and the other drops it. That is transcription, not a wrong
model of the range — and it is 192.1's shape a fourth time: the premise three
lines above ships its command in a fenced block and is right; the count below it
has no command and is wrong.

**Two refusals, both measured.** (1) A gate over "a commit count in prose agrees
with `git log` over that range": 79 candidate phrases exist across the two
roadmap files, **one was checked and is wrong and the other 78 were not
checked** — said that way rather than as "one in 79", because the honest
denominator is 1. Keyed on the phrase shape it is green on everything; recovering
each phrase's intended range from prose is 94.11's semantic wall. (2) Editing the
`loop-log.md:1279` / `STATUS.md:43` rows carrying the same phrase — historical
rows are never edited, which the archive itself states twice.

**Two overstatements of this wake's OWN were caught before they shipped**,
recorded because catching them is the same discipline the finding is about: an
uncounted *"sixteen figure-classes"* (replaced by an enumerated 25) and a
*"79 phrases, exactly one of which is wrong"* that implied 78 had been checked
when none had.

## Gates

**All seventeen entry points `ENVIRONMENT.md` derives from `ci.yml`: green,
exit 0 each**, against the committed tree — core `build`, core `test`,
`lint:css`, `docs:build`, `check:claims`, `check:formatting`, `check:scroll`,
`check:layout`, `check:forced-colors`, `test:axe` (**127 × 2, zero
violations**), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**19 behaviours**),
`check -w @busy-office/create-ui`, and `suite` (**28 screens × 2 widths, zero
axe violations, no sideways scroll at 390**). `check:slice-refs` passed at
**686** citations / **220** headings.

**Fifteen ran in one batch; `check:po-app` and `suite` were run separately and
only because the count was checked against the list rather than assumed.** The
batch was written from memory and held 15 of the 17 — the hand-off draft already
said "all seventeen" at that point, which would have been a false claim about
two gates that had not executed. Same shape as `check:formatting` reaching CI
unrun on 2026-08-29. **Derive the list from `ci.yml`, then count what you
actually ran.**

The six markdown-reading gates (`check-slice-refs`, `check-vendor-names`,
`check-loop-vocab`, `check-paths`, `check-ci-ignores`, `check-selftests`) were
**re-run individually after the last prose edit**, because `check:repo` runs
inside `docs:build` and that had already executed — a suite result is only
evidence for the tree it actually read.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

**`scan:dead-style` needs `CHROME_PATH` exported in the same command**, like
every other browser-driven gate here. ENVIRONMENT §1c says this; the lane-1
instruction in `LOOPS.md` does not repeat it.

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `d223b751` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT trap 1 bit at Step 0 again**: the container started **DETACHED**,
`git branch --show-current` returned empty — the check that file names as the
actual answer — and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...d223b75`). `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false`, **1,784** commits
(1,769 first-parent).

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 4 items across 3 slices, and — for the first time in five
hand-offs — ONE IS DISPATCHABLE:**

| item | kind of blocked |
|---|---|
| `238.1` five-vs-four archive commits | **DISPATCHABLE** — `git log` on an unshallowed clone + a markdown edit at two sites |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

Say the *kind* of blocked, per rule 4's own instruction. **238.1 is not
browser-blocked, not owner-blocked and not agent-blocked** — no screenshot is
evidence for any part of it, so the next wake can take it at rule 4 whether it
is cloud or local. The other three are unchanged: two owner-blocked, one
hardware-blocked.

**What is owed to the owner:** unchanged, and now three wakes old. Slice 112's
pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.** Note the
honest shape of the last three wakes: everything built has been the loop's own
bookkeeping — the roadmap, its archive, that archive's header, and now a grill
of the wake that wrote the header. That is legitimate maintenance and the
counters are driving it correctly, but it is not product work, and only the
owner can make it be.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is `ROADMAP.md` and one new `.roundtable/`
report, and the docs site renders neither — so nothing in it rests on a rendered
image. Every browser-driven reading quoted (`check:claims` 162/3,
`check:layout` 127, `test:axe` 127 × 2) came from a gate executing in this
container.
