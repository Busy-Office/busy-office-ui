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
at hand-off. Two commits this wake: Slice 292.4 and this hand-off. One iteration
recorded — `Continue · build`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 4 has work, same lane, and the queue did not shrink

This wake walked oldest-first past Slice 15, 112, 249 and 273 — **all still
blocked, each re-read from its own text rather than carried forward** — and took
`292.4`, the oldest of the five cloud-takeable items. It closed one and filed
one (`292.9`), so the lane is still **five** deep: `292.5`, `292.6`, `292.7`,
`292.8`, `292.9`. Expect rule 4 to reach **`292.5`** next, again after walking
the blocked older set.

**Read `292.9` before `292.5` only if you want the cheaper item** — 292.5 is
older and rule 4 is oldest-first, so 292.5 is the dispatch. Noted because 292.9
is the direct continuation of what this wake just built and is fresh in the
record.

Counters after this wake's rows, read immediately after recording, which is the
comparison `LOOPS.md` mandates: rule 2 `3 / 4 … ok` (a Continue round, so it
moved from 2), rule 3 `1 / 3 … ok [292]` (unchanged — 292 was already crossed;
closing and filing items *inside* an already-counted slice adds nothing).
**Both agreed with the by-hand prediction.** The parser reconciles **1497
parsed against a raw `grep -c '^- '` of 1497** — note that figure moved by 3,
not 1: each `--also-refused` writes its own row. Rule 5 read **STALE**
(`3 wake-date(s) newer`) and is reported as *could not be evaluated*, never
clear.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.
It did not run this wake: rule 4 matched, so rule 6 was never reached.

## What landed this wake

**Slice 292.4 — `/components/icon` stops teaching a glyph it deprecates**
(dispatcher rule 4, Continue/build).

**The premise held and the design call went the other way.** 292.4 offered two
resolutions and called picking between them a design call. Un-deprecating
`--settings` was refused on two independent grounds: it changes what a published
package recommends and reverses a dated, cited decision (53.2) — the shape
249.13 was sent to the owner for — and its *stated* ground is refuted. The demo
caption argued *"a cog for settings"*; the shipped mask is `M4 7h16M4 12h16M4
17h16` plus three filled `r='2'` dots — the **sliders** mark. There is no cog,
under either resolution.

Landed: both hand-written sites moved to `--close`, which the page's own opener
already names as a convention. Verified on the BUILT page rather than the
source: `aria-label="Settings"` → **0**, `aria-label="Close"` → **2** (the demo
button and the docs shell's own mobile-nav close, located individually rather
than counted), and the **3** surviving `bo-icon--settings` are all generated —
Deprecated showcase, `ClassRef` row, `ApiTable` variant list.

The guard now scans the page's own source for every hand-typed `bo-icon--*` in
the `markup` string or the template region. **Red-proved twice, and the proofs
discriminate** — injecting into the markup block names *"the markup block"*,
into the live demo names *"a live demo"*, one assertion each, tree restores
green. Each injection was asserted to land before the build was believed.

**The finding worth carrying forward is in `ENVIRONMENT.md`, not here.** The
guard's count reconciliation failed on its own first run (`15 + 4 ≠ 24`)
because **`import.meta.url` in Astro frontmatter is the COMPILED module in
`dist/`**, so a page reading itself reads generated JS. The repo's existing
`../../../../../` idiom hides this — it works from either location only because
`src/` and `dist/` sit at equal depth. Without the count assertion this would
have shipped reading the wrong artifact and reporting a clean page.

**Two refusals, both in the log row**: un-deprecating (above), and adding the
tree-wide gate in this round — it would be red on the five sites `292.9` now
records, and the deprecation's own text says an existing render is not by itself
a defect.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **860** assertions, `page-shape`,
`wrong-choice`, `dsa-scores`), the `DOCS_BASE=/busy-office-ui` build,
`check:claims` **167** live, `check:layout` **127** pages, `test:axe` **127**
pages x 2 widths zero violations, `check:scroll` **914** containers,
`check:formatting`, `check:forced-colors`, `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b — this container reports `(pointer: fine) = false` — not a
regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman. **Unlike the previous wake, a screenshot
lane IS relevant here and is simply unspent**: this round changed rendered
output on one page (one glyph swapped on one demo button, and a caption
sentence). The mask box is `1em` either way so no geometry moves, and
`check:layout`, `check:scroll` and `test:axe` are green across the whole tree —
but **nobody has looked at it**, and a local wake glancing at
`/components/icon` would close that cheaply.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...d22ffc4`). Trap 2
clean in one `--unshallow` (**1,938** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **fifteenth** consecutive
container to do so.

**No collision.** `git fetch origin main` immediately before the first commit
left `origin/main` at the wake's starting sha, `0 0` against local `main`.

## The open set is still 17 — and 5 of them are cloud-takeable

Each line classified from the item's own text per `LOOPS.md` 186.2. The older
three groups were re-read this wake, not carried forward on the last hand-off's
word — except `249.6`, see below.

- **cloud-takeable: 5** — `292.5`, `292.6`, `292.7`, `292.8`, `292.9`. All are
  code or prose on `/components/icon`, `icon.css`, `dsa-scores.json` or (292.9)
  four other docs pages, verifiable by `docs:build` plus a DOM or count
  assertion. 292.9 carries its own lane note.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware — its
  text says outright it is "genuinely unblockable by the loop"), `112.3` and
  `112.4` (blocked on owner briefs / 112.3's verdict), `249.7` (holds its
  SAP/Fiori rows for 249.10), `249.10`, `249.11`, `249.12`, `249.13` (all
  marked **OWNER CALL** in their own text), `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  **`249.6` was declined at the clause level four times as of two hand-offs ago.
  Do not re-derive it a fifth** — this wake carried that classification forward
  rather than re-examining it, so the four is that hand-off's count, not a fresh
  one. `249.15`'s own text says a cloud wake should not pick it up.

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings (17 open / 42 closed);
`check-resume-slice-ids` also counts the 2 items under the non-slice `## STATE`
heading (17 open / 44 closed). Do not quote a bare closed count.

## No archive sweep — and the two units are now diverging FASTER

Measured at this wake's slice commit (`git show HEAD:ROADMAP.md | wc -l`, and
`roadmap_scope.py`): **5,752 lines**, closed-history share **36.2%**. The
standing trigger the last four hand-offs carried is *"past 5,450 lines /
40.6%"*.

Trend across ten readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → **36.2%**. The previous hand-off flagged that the two halves had
begun to disagree; this wake **widens the gap in one commit** — +105 lines and
−0.7pp on the same tree, because 292.4's record and 292.9's filing are both
OPEN-item lines: they grow the denominator and never the numerator.

**That is further direct evidence for `249.12`** (the archival trigger, an open
owner call) rather than a licence to sweep: inventing a threshold to justify a
sweep already started is precisely what that item exists to prevent. No sweep
run.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **`249.12` has stopped being low-urgency, and the case is now stronger than
   when the previous hand-off made it.** Its own roadmap text calls it *"low
   urgency, the sweep keeps happening regardless"*. The line count and the
   percentage now move in opposite directions **within a single commit**, so two
   consecutive wakes can honestly reach opposite conclusions about the same tree
   by picking a unit.

2. **The loop is still feeding itself, and this wake is the clearest instance
   yet.** All five cloud-takeable items were filed by this loop grilling or
   polishing its own docs; `292.9` was filed by the round that closed `292.4`,
   about the page that round had just been reading. Every item the *plan* holds
   waits on the owner or on a local wake. The work is real — this wake refuted a
   caption's factual claim, resolved a design call on measured grounds, and
   caught a build trap that would have shipped a silent no-op guard — but it is
   self-sourced.

3. **`273.2` is the owner call still worth their attention**, a nineteenth wake
   untouched — whether a Polish round whose score does not move should increment
   `dry`. Not touched this wake; rule 6 was never reached.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, carried forward unchanged and **not re-run this wake** (rule 4
matched, so nothing needed it): the only file mentioning `bundle-gz-kb` is
`scripts/loops/record_metric.py`, and the hit is its docstring example. Nothing
derives the number. Do not "fix" rule 5's staleness by recording a guessed
value. The command is in the hand-off at `e1ffcc3`.
