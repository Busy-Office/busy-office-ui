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

Last updated 2026-09-06 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake: Slice 292.6 and this hand-off. One
iteration recorded — `Continue · build`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 is OVERDUE — the dispatch is an Objective grill of 292, 293, 295

Read immediately after recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   3 / 4 Continue rounds since 2026-09-06 12:51   ok
Objective     3 / 3 slices          since 2026-09-06 07:53   OVERDUE  [292, 293, 295]
Optimize      3 wake-date(s) newer  since 2026-09-03 09:54   STALE
```

**Read AFTER the rebase described below, not before — the two readings differ
and only the later one describes the tree that was pushed.** Before rebasing
onto `01c2a8e4` the same command said `Standardize 2 / 4`; the other
dispatcher's `Continue · release` row for 0.8.0 is the third round. That is a
small, concrete instance of the rule this file keeps re-learning: a figure is
read from the revision it describes.

**Rule 3 crossed DURING this wake, and two of the three closes are not mine.**
It read `2 / 3 [292, 293]` at Step 2, so rule 3 did not match and rule 4
dispatched; it reads `3 / 3` now because Slice 295 landed on `origin/main`
mid-wake (the other dispatcher's release wake) and this wake closed 292.6.
The previous hand-off predicted exactly this shape — *"a wake that closes any
slice arms an Objective grill for the wake after"* — so the crossing is the
expected hand-off, not a missed dispatch.

**The dispatch order is unchanged by Slice 296's Gauntlet loop**, checked
rather than assumed: it is a ninth *playbook* (`LOOPS.md` §7) dispatched by
rule 4 when the oldest open item names a gauntlet artifact, and it deliberately
adds no rule and no counter. Step 2 still has eight rules in the same order.

Rule 5 read **STALE** and is reported as *could not be evaluated*, never clear.
`bundle-gz-kb` still cannot be sampled (259.1's finding, carried forward, not
re-run this wake — rule 4 had work). Do not "fix" it by recording a guess.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.
It did not run this wake: rule 4 matched, so rule 6 was never reached.

## What landed this wake

**Slice 292.6 — `icon.css`'s PRICED block dates its four size endpoints**
(dispatcher rule 4, oldest still-open item a cloud wake can take).

Closed by the Accept's **second** branch — the endpoints are dated, not deleted
and not refreshed. What made that the right branch is a measurement the item had
not taken: the endpoints are **correct at their revisions**.

```
git show d48f361d:README.md | grep stat:size   # 80 kB minified (13.2 kB gzipped)
git show 43ea922a:README.md | grep stat:size   # 84 kB minified (13.8 kB gzipped)
```

`43ea922a` is 2026-08-24, "Slices 136/137"; `d48f361d` is its parent. So the
defect was never a wrong number — it was that nothing said *when*. A refreshed
absolute would decay again; `+0.6 kB over the wire` is a fact about adding those
eleven glyphs and cannot. The block now points at the `stat:size` stamp in both
READMEs (**93 kB / 15.0 kB** today, kept current by `stamp-readme.mjs`), exactly
as the header points at `/components/icon`.

**The item's premise re-verifies exactly**: `wc -c` on
`packages/core/dist/css/index.min.css` → **95,172**, `gzipSync` → **15,458**.

**Two side figures, both checked rather than carried:**

- `git show 43ea922a -- .../icon.css | grep -cE '^\+  \.bo-icon--'` → **11**.
  The block's "these eleven" is right; the **commit message's** "ten formatting
  glyphs" is the wrong one of the pair. Left as history, not amended.
- The item blamed a 15,305-vs-15,458 gap on **zlib-build variance**. On one
  tree and one Node build, `gzipSync(buf)` = **15,458** and
  `gzipSync(buf, {level: 9})` = **15,296** — a **162-byte** spread from
  compression *level* alone. Neither reading is 15,305, so the cause stays
  unknown; what dies is the inference that a gap that size needs two zlib
  backends. **Refused filing an item**: `GZIP_TOLERANCE_KB = 0.3` (307 bytes)
  in `stamp-readme.mjs` already absorbs 162, so there is no latent gate risk.

**Gates green in this container, on the REBASED tree** (i.e. the tree that was
pushed): core `build`, `test` (165), `lint:css`, `docs:build` (`check:repo`
incl. `slice-refs` **867**, `page-shape` **127** pages), `check:claims` **167**
live, `check:layout` **127** pages, `test:axe` **127 x 2**, `check:scroll`
**914** containers. Also run green on the **pre-rebase** tree, and not re-run
after the rebase because the diff did not change: `check:formatting`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w @busy-office/create-ui`,
`npm run suite` (28 screens x 2 widths). Said that way deliberately — the two
sets are not the same evidence. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b (this container reports `(pointer: fine) = false`), not a
regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a
cloud wake has no Podman. **None is owed, and it is measured rather than
asserted:** `index.min.css` is byte-identical across the edit — **95,172 /
15,458** before, after, and again after rebasing onto 0.8.0 — because the only
CSS touched is a comment body. Nothing reaches the browser.
**292.4/292.5's screenshot lane on `/components/icon` remains unspent**, and a
local wake's glance still closes both cheaply.

## `origin/main` moved TWICE under this wake — caught both times by the mandated fetch

`git fetch origin main` immediately before the first commit reported
`c6643153..2a4bb245`, i.e. **two commits** landed on `origin/main` while this
wake was working: `605829ca` (Slice 295 — 249.15, the social card) and
`2a4bb245` (Release 0.8.0). **This is NOT a collision in Step 0c's sense** —
that word is reserved for two dispatchers taking the *same* item, and it has
happened twice. Here the other dispatcher took a different one, and `292.6` was
still `[ ]` on `origin/main` when re-read. But it is exactly the divergence the
pre-commit fetch exists to catch, and nothing else in the wake would have shown
it: `git status` was clean and every gate was green against a base two commits
stale.

Recovered without a rebase of commits, because nothing was committed yet —
`git stash` → `git merge --ff-only origin/main` → `git stash pop`, clean.
**Then everything was re-measured on the new base rather than assumed**, which
is the part worth carrying: 0.8.0 is a version bump and Slice 295 adds a
generated OG card, either of which could have moved the shipped CSS. It did not
— `95,172 / 15,458` on both bases — and the `stat:size` stamp still reads
`93 kB / 15.0 kB`, so every figure in the commit survives on the tree that was
actually pushed.

**Then it moved AGAIN, between the slice commit and the hand-off commit**:
`2a4bb245..01c2a8e4` — `691102d3` (release chore, `introduced.json` against
0.8.0) and `01c2a8e4` (Slice 296, the Gauntlet loop). That second fetch is the
one `LOOPS.md` Step 0c mandates immediately before the first commit, run again
before the last; **this time it conflicted**, exactly where that section says it
will — `.roundtable/loop-log.md`'s append point, once both wakes had recorded —
plus the generated `STATUS.md`.

Resolved by the book: **kept BOTH row sets**, then regenerated the mirrors
(`rebuild_from_log.py`, `generate_status.py`, `generate_roundtable_index.py`)
rather than hand-merging them, and reconciled the parser against a raw count —
`grep -c '^- '` reads **1514** and `rebuild_from_log.py` reports **1514
iterations**. Their five rows sort before this wake's two, which is correct
through the blame offsets (their `21:47 +0800` precedes this container's
`13:50 +0000` = 21:50 +0800), so the file's line order stays chronological.

**The two log rows were repointed from `05893dad` to `c3637cb9`** after the
rebase. `LOOPS.md` Step 0c notes that five rows in this log carry a sha that no
longer exists, rebased away by a losing dispatcher, and that blame is the
authority precisely because of them. This wake is the first to have the chance
to not add two more, and took it — the row's sha is now the commit that actually
carries the work.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...c664315`). Trap 2
clean in one `--unshallow` (**1,949** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **eighteenth** consecutive
container to do so. Trap 1c did not bite: `CHROME_PATH` was exported in the same
command as every gate, per 293.1's rewrite of that section.

## The open set is 19 — and 6 of them are cloud-takeable

**Re-read after the rebase, so this is the pushed tree.** Two items closed since
the last hand-off's 16: `292.6` (this wake) and `249.15` (Slice 295, the other
dispatcher). Five were added by two triages that are not mine — `294.1`/`294.2`
(the owner's upstream contribution) and `296.1`/`296.2`/`296.3` (the Gauntlet
loop). Net 16 − 2 + 5 = **19**, which `roadmap_scope.py` reports as **19 open /
47 closed**. `check-resume-slice-ids` will report a different closed count — it
also counts the 2 `[x]` items under the non-slice `## STATE` heading. **Do not
quote a bare closed count.**

- **cloud-takeable: 6** — `292.7`, `292.8`, `292.9` (confirmed open this wake),
  `294.1`, `294.2`, and `296.2` (an interaction-latency instrument, or a
  recorded refusal — its Accept explicitly admits the refusal branch).
  **`294.1`/`294.2` are classified from the triage commit's own text, not
  re-read from their roadmap bodies this wake** — said plainly. `294.2` says
  the brand mark inside it is an owner call, so it may be partly owner-blocked;
  read it before dispatching.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  and `296.3` (is "secure" in scope at all — it changes what every pattern page
  owes, so it is not decidable by a wake).
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these, a
  cloud wake cannot): `249.6`, `249.9`, and **`296.1`** — the first gauntlet
  round grades a rebuilt `/patterns/list-report` against a reference **PNG**,
  which is the rendered-image comparison `ENVIRONMENT.md` says a cloud wake
  cannot do. **`249.6` was declined at the clause level four times as of five
  hand-offs ago. Do not re-derive it.** `249.15` left this group by being
  **built** — the first time an item did.

6 + 10 + 3 = 19, asserted rather than left to the reader.

Rule 4's oldest cloud-takeable item next wake is **`292.7`** (four `content`
cites score a page property while citing the CSS) — but **rule 3 preempts it**,
so expect the grill first.

## No archive sweep — and the two units diverged again, for a reason worth naming

Measured on the **rebased** tree (`roadmap_scope.py`): **6,377 lines**,
closed-history share **36.9%**. The standing trigger the last seven hand-offs
carry is *"past 5,450 lines / 40.6%"* — lines are past it, the share is not.

Trend across thirteen readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → **36.9%**.

**This wake read it twice and got two different answers, which is the finding.**
At its own slice commit, before the rebase: **6,270 lines / 37.5%**, both up —
the shape the previous hand-off predicted for a wake that closes its own slice.
After rebasing onto `01c2a8e4`: **6,377 lines / 36.9%**, lines further up and
the share back **down**, because Slice 296 added 107 lines of *open* items to
the denominator alone. So the prediction was right about this wake's own commit
and wrong about the tree an hour later, and neither reading is more true than
the other — they describe different revisions. **That is the sharper argument
for `249.12`** (the archival trigger, an open owner call) than any single
reading: the share is not a property of the tree so much as of *who committed
last*, which is not something a trigger can be built on.

No sweep run.

## Direction

Nothing new from the owner reached THIS wake to triage; GitHub intake is empty
(`list_issues` → `totalCount: 0`). Two pieces of owner input landed on
`origin/main` while this wake worked and were triaged by the other dispatcher,
not by me: the upstream contribution (Slice 294) and the Gauntlet loop
(Slice 296). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **`249.12` has stopped being low-urgency.** Five consecutive wakes have now
   had to reason about which unit to believe before deciding not to sweep. Its
   own roadmap text still calls it *"low urgency, the sweep keeps happening
   regardless"*.

2. **The loop is feeding itself much less than it was, and that is new.** The
   last hand-off's version of this paragraph said all remaining cloud-takeable
   items were filed by the loop grilling its own docs. That is no longer true
   by a wide margin: **5 of the 19 open items — `294.1`, `294.2`, `296.1`,
   `296.2`, `296.3` — trace to owner input**, and both triages landed within a
   few hours of each other. `294.2` asks for a ranking against the Objective and
   `296.3` is a scope question about the product. That is the kind of input the
   loop has been short of, and it arrived while a maintenance item was being
   closed; worth knowing the queue's character changed.

3. **`273.2` is the owner call still worth their attention**, a twenty-second
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
