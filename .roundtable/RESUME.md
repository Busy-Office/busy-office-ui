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
at hand-off. Two commits this wake: Slice 292.3 and this hand-off. One iteration
recorded — `Continue · build`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 4 has work, and it is the same lane this wake used

The previous hand-off predicted rule 4 would find the four items Slice 292 filed,
and it did — this wake walked oldest-first past Slice 15, 112, 249 and 273 (all
still blocked, unchanged) and took **292.3**, the oldest of the four. That
closed one and filed **two more**, so the cloud lane is now **five** deep:
`292.4`, `292.5`, `292.6`, `292.7`, `292.8`. Expect rule 4 to reach `292.4`
next, again after walking the blocked older set.

**One caveat on `292.4`, read it before starting**: its own text says picking
between its two resolutions (un-deprecate `--settings`, or move both teaching
sites off it) *"is a design call rather than maintenance"*. The **guard
extension** half — teaching `bothLists` to see the `markup` string, red-proved
by putting a deprecated glyph back into it — is takeable regardless of which
resolution is chosen. If you cannot justify the design call, land the guard and
say so rather than declining the whole item.

Counters after this wake's row, read immediately after recording: rule 2
`2 / 4 … ok` (a Continue round, so it moved), rule 3 `1 / 3 … ok [292]`
(unchanged — 292 was already crossed; closing items *inside* an already-counted
slice adds nothing). **Both agreed with the by-hand prediction**, which is the
comparison `LOOPS.md` mandates; the parser reconciles **1494 parsed against a
raw `grep -c '^- '` of 1494**. Rule 5 read **STALE** (`3 wake-date(s) newer`)
and is reported as *could not be evaluated*, never clear.

The previous hand-off's lesson held and cost nothing: the `--item` was written
as `Slice 292 — …`, start-anchored, so all three slice patterns matched it.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.
It did not run this wake: rule 4 matched, so rule 6 was never reached.

## What landed this wake

**Slice 292.3 — the DSA rubric now states which ARTIFACT each dimension is
scored on** (dispatcher rule 4, Continue/build — the lane 292.3's own Note
named, since `LOOPS.md` 101.3 forbids Polish from touching the rubric).

**The item's premise is refuted and its conclusion survives.** 292.3 asserted
*"every cite for them names a CSS file"*; counted, `\.css\b` appears in **2 of
40** typography cites, **3 of 40** colour, **3 of 40** spacing. A filename was
never the signal. Classifying all **240** cites by which artifact the sentence
NAMES puts typography/colour/spacing at **120 of 120 css-side, 0
docs-page-side** — so the scope was already unambiguous in practice and only
the text was silent. Hand-read, the five the keyword pass mis-sorted resolve
the same way (three say *"the page"* meaning the **consumer's** page; two are
css-side in phrasing too terse to match).

Landed: `rubric.scope` in `dsa-scores.json` (one `css`/`page` value per
dimension, the count as its `$comment`) and two assertions in
`check-dsa-scores.mjs`. Both red-proved by injection asserted to land, each
failing **exactly one** of 362 assertions and exiting 1, tree restoring green —
not the too-broad red that certifies nothing.

**Two refusals, both recorded in the log row**: repeating the scope into the six
`definitions` (two records of one fact is how they drift), and a gate asserting
each *cite* respects its scope — this item's own count is what shows the
classifier for it mis-sorts 5 of 240 in both directions, which is the semantic
gate 94.11 refuses.

**The disputed score is resolved, not moved.** `icon.astro`'s raw font-size
literals are **outside** `typography`, so the published `3` stands and the blind
re-score's `2` was out of scope exactly as the scorer itself flagged. Correction
to that re-score, measured: *"four times"* is right for `1.5rem` specifically —
the page carries **six** raw `font-size` declarations, three of which are the
size-tracking demo and are intrinsic in the rubric's own language.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **859** assertions, `dsa-scores`
**362**, `page-shape`, `wrong-choice`), `check:claims` **167** live,
`check:layout` **127** pages, `test:axe` **127** pages x 2 widths zero
violations, `check:scroll` **914** containers, `check:formatting`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b — this container reports `(pointer: fine) = false` — not a
regression.

**NOT VERIFIED, said plainly, and this wake the honest answer is that it does
not apply:** no 1440/390 light-and-dark screenshots were taken — a cloud wake
has no Podman. Unlike the previous wake, **no screenshot lane is relevant
here**, and that is measured rather than assumed: nothing under `apps/docs/src`
reads `rubric.scope` or `rubric.definitions` (`grep -rl` → empty), and the new
text reaches **0** built files. No rendered output changed.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...e1ffcc3`). Trap 2
clean in one `--unshallow` (**1,936** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **fourteenth** consecutive
container to do so. The `git rev-parse --short A B` trap was hit verbatim while
checking for a collision (`fatal: Needed a single revision`); `git rev-parse
HEAD origin/main` is the form that works, exactly as §1 says.

**No collision.** `git fetch origin main` immediately before the first commit
left `origin/main` at the wake's starting sha, `0 0` against local `main`.

## The open set is 17 — and 5 of them are cloud-takeable

Each line classified from the item's own text per `LOOPS.md` 186.2.

- **cloud-takeable: 5** — `292.4` (with the design-call caveat above), `292.5`,
  `292.6`, `292.7`, `292.8`. All five are code or prose on `/components/icon`,
  `icon.css` or `dsa-scores.json`, verifiable by `docs:build` plus a DOM or
  count assertion. None needs a rendered image.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (defers to 249.10),
  `249.10`, `249.11`, `249.12`, `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  **`249.6` had been declined at the clause level four times as of the previous
  hand-off. Do not re-derive it a fifth** — this wake did not re-examine it, it
  carried the classification forward, so the four is that hand-off's count and
  not a fresh one.  `249.15`'s own text says a cloud wake should not pick it up.

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings; `check-resume-slice-ids`
also counts the 2 items under the non-slice `## STATE` heading. Do not quote a
bare closed count.

## No archive sweep — and the two units now point OPPOSITE ways

Measured at this wake's slice commit: **5,647 lines**, closed-history share
**36.9%**. The standing trigger the last three hand-offs carried is *"past
5,450 lines / 40.6%"* — and those two halves now **disagree**, which is new and
is the finding worth handing on.

Trend across nine readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → **36.9%**. **The share is falling while the line count climbs**,
because Slice 292 keeps adding OPEN-item lines: they grow the denominator and
never the numerator. So a line-count trigger fires now and a percentage trigger
recedes, on the same tree, and a wake picking whichever unit suits its intent is
free to reach either verdict.

**That is direct evidence for `249.12`** (the archival trigger, an open owner
call) rather than a licence to sweep: inventing a threshold to justify a sweep
already started is precisely what that item exists to prevent. No sweep run.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **`249.12` has stopped being low-urgency.** Its own roadmap text calls it
   *"low urgency, the sweep keeps happening regardless"*. That held while both
   units moved together. They no longer do — see the section above — so the
   next two wakes can honestly reach opposite conclusions about the same tree,
   which is the failure the previous hand-off already flagged once and can now
   name a mechanism for.

2. **The loop is still feeding itself.** All five cloud-takeable items were
   filed by this loop grilling or polishing its own docs — three of them by
   this wake and the last, none by the plan. Every item the *plan* holds waits
   on the owner or on a local wake. Worth noticing rather than celebrating: the
   work is real (this wake refuted a published premise and closed a rubric
   ambiguity that had gone unstated since the definitions were written in
   94.7), but it is self-sourced.

3. **`273.2` is the owner call still worth their attention**, an eighteenth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, carried forward unchanged and **not re-run this wake** (rule 4
matched, so nothing needed it): the only file mentioning `bundle-gz-kb` is
`scripts/loops/record_metric.py`, and the hit is its docstring example. Nothing
derives the number. Do not "fix" rule 5's staleness by recording a guessed
value. The command is in the previous hand-off at `e1ffcc3`.
