# Two things 193.2 left open — the missing denominator, and the one condition that had fired

Follow-on to **193.2**, which was closed by the other dispatcher at `1c111d7f`
while this wake was working the same item. **This is not a re-run of 193.2.**
Its close stands as the record; this report answers only the two things that
close explicitly left unanswered, and it names them in its own words:

> *"The 558 denominator does not reproduce, even at its own origin commit …
> **Left unresolved rather than forced** — three items exist somewhere that this
> parser counts and the original one didn't, or vice versa, and nothing on hand
> identifies which."*

> *"Two (130.2, 104.4) and three more left unchecked this wake for lack of the
> right corpus on hand rather than guessed at."*

Both are answered below. The collision itself is the mechanism `LOOPS.md`
Step 0c cites from Slice 162: redundant coverage finding what one pass missed.

---

## A. The 558 denominator reproduces exactly — at a commit neither pass tested

**Resolved with 193.2's own parser, unchanged.** No new method, no re-tuned
regex — the gap was never in the parser, it was in which tree was measured.
193.2's close tested `774558e` (the commit that filed the item) and HEAD, and
got 561 and 563. It did not test the commit **before** the filing:

```
for c in a9470314 774558e5 4b4993df; do
  n=$(git show $c:ROADMAP.md          | grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*')
  a=$(git show $c:ROADMAP-archive.md  | grep -cE '^[0-9]+\.\s+\[[ x]\]\s+\*\*')
  echo "$c  $n + $a = $((n+a))"
done
```

| commit | ROADMAP.md | archive | total |
|---|---|---|---|
| **`a9470314`** | **43** | **515** | **558** ✅ |
| `774558e5` — the commit that filed 193.2 | 46 | 515 | 561 |
| `4b4993df` — a later tree | 48 | 515 | 563 |

**`43 + 515 = 558`, character-exact with the recorded figure, including the
split.** The gap of 3 was three items that *the filing commit itself added* —
193.1, 193.2 and a sibling. 193.2 measured its corpus, then wrote itself into it.

**Why it looked unresolvable, and it is a trap already on the books.**
`a9470314` is 13 minutes *before* the filing, but reads as 8 hours *after* it:

```
git log -1 --format='%ad' --date=iso a9470314   # 2026-08-29 14:35:11 +0800
git log -1 --format='%ad' --date=iso 774558e5   # 2026-08-29 06:48:41 +0000
git merge-base --is-ancestor a9470314 774558e5 && echo ancestor   # ancestor
```

The two dispatchers commit in different offsets — `+0800` local, `+0000` cloud —
and `LOOPS.md` §0c records exactly this (164.2: *"a row is ambiguous by eight
hours on its face"*, and **3 of 1013 adjacent pairs read backwards**). A commit
that looks like it comes later is the ancestor. **Read the offset, or use
`--is-ancestor`; never the face value.**

## B. `104.4`'s reopen condition fired the day it was written, and nothing asked for 7 days

193.2's close left this one unchecked. The corpus it needed is one file in this
repo.

`104.4` refused the patterns-index complexity filter (2026-08-22) on a stated,
measured premise: *"`pattern-groups.mjs`'s six job-family groups **top out at 7
tiles** (enter & find) and run as low as 1 (RF) — every group is already small
enough to scan without filtering."* Its trigger: *"Revisit if the pattern count
grows past a size where a 6-7-tile group stops being scannable."*

```
node --input-type=module -e "import {PATTERN_GROUPS as G} from
  './apps/docs/src/data/pattern-groups.mjs';
  const s=G.map(g=>g.items.length);
  console.log('max',Math.max(...s),'total',s.reduce((a,b)=>a+b,0));"
# max 11  total 39      (2026-08-29)
```

Per commit that touched the file:

| date | commit | max group | total tiles |
|---|---|---|---|
| 2026-08-22 | `7aec7830` — the day `104.4` was refused | 7 | 27 |
| 2026-08-22 | `bb8b9ab4` | **8** | 30 |
| 2026-08-23 | `8c171414` | 10 | 32 |
| 2026-08-25 | `bdc2680e` | **11** | 39 |

**The premise stopped holding on the day of the refusal.** The largest group is
**11, not 7** — 57% past the number the refusal rested on — and the smallest is
4, not 1. Both halves of the sentence are now false.

Reconciled against an independent count: `patterns.json`'s own `count` field
reads **39**, agreeing with the tile sum. *(An ad-hoc sum over that file's
`groups` array returns 0 — it uses a different key shape. A dead read, caught by
the reconciliation rather than published; recorded so the next wake does not
repeat it.)*

Has anything re-asked it? `grep -rn '104\.4'` over tracked `.md`/`.mjs`/`.py`
returns **four** lines: the original proposal (twice), the roadmap entry, and the
loop-log row recording the refusal. **Zero re-checks in 7 days.**

**Not fixed here** — whether an 11-tile group still scans is a design judgement
with an owner-facing history, and `LOOPS.md`'s operating rule sends an
improvement bigger than its item to the roadmap. Filed as **199.1**.

## C. What this adds to 193.2's hypothesis — the strongest data point, not a new one

193.2's close accepted the hypothesis on n=6: *execution tracks whether a
playbook step names the condition, not whether it is checkable.* `104.4` is a
seventh case and the sharpest, because it isolates the variable:

- It is **trivially checkable** — one `node` one-liner, no corpus to assemble.
- It had **actually fired**, so there was something to find.
- It is named by **no** playbook step.
- It went **unasked for 7 days**, and was found only because a wake was
  dispatched to sweep for exactly this.

**Checkability predicts nothing; being named predicts everything.** And the
refinement worth carrying: a *dispatcher* rule reads a condition too, but its
window **moves**. `167.1` sat inside a recent grill window and still went unread
until 193.1 forced it; `104.4` is Slice 104, and no grill will ever reach it
again. **A standing step naming the artefact is the only thing that keeps
working as an item ages.**

**This does not reopen 193.2's refusal.** Its grounds — 23 of 42 semantic, a
42-row register being 94.11's ceremony — are untouched by one more fired
condition, and its own reopen bar is stated as a *second* mechanical condition
found fired-and-unasked. This is the first. The count is now on the record so
the next one is measurable rather than anecdotal.

## D. The command, shipped

`scripts/loops/report_reopen_conditions.py` — 193.2's Accept asked for the
command next to the number, and what the item carried was a comment sketch.

```
python3 scripts/loops/report_reopen_conditions.py              # today
python3 scripts/loops/report_reopen_conditions.py --rev a9470314   # the sketch's tree
python3 scripts/loops/report_reopen_conditions.py --self-test
```

It reconciles its parse against a raw marker count of each file and **refuses to
report** when they disagree, rather than printing a number it cannot defend —
the discipline that would have surfaced section A's gap immediately. It is
`@heuristic` (the verdict rests on recognising a word) and red-proves itself by
injection.

**Its count is a SHAPE, not a count of reopen conditions**, and it says so in its
own output. Hand-reading its 45 hits on `90b9e46`: the needle cannot distinguish
a trigger from narration of one, from an *anti*-reopen note (*"recorded so a
future sweep does not re-open it"*), from an item that **performed** a reopen,
from a metaphor, from `137.8`'s `Ctrl/Cmd+Shift+T` **browser shortcut**, or from
**193.2's own recorded needle matching itself**. 193.2's close reached the same
conclusion by its own route (1 false positive + 4 advisory, on its 42); the
parsers differ by one hit and the verdict does not, which is the useful part.

**Stated plainly: nothing names this script, so this repo's own measured
hypothesis predicts it goes unread.** That is a known cost accepted, not a fix.
Naming it in `LOOPS.md` §3's sweep list is the one intervention with evidence
behind it — and it stays refused on the ratio 193.2 already weighed, not on
principle. Argue with the ratio.
