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
at hand-off. Two commits this wake: Slice 292 and this hand-off. One iteration
recorded — `Polish · round`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: the cloud lane is no longer dry — this wake filed four takeable items

This is the change worth reading. The previous two hand-offs reported **0 of 12**
open items cloud-takeable, and this wake's rule-4 pass re-derived that and agreed.
Slice 292 then filed **292.3, 292.4, 292.5, 292.6** — all four are code or
prose changes on `/components/icon` and `dsa-scores.json`'s rubric, verifiable
by `docs:build` + a DOM assertion, and **none needs a screenshot**. So rule 4
should find work next wake without falling through to Polish.

They are NOT ordered by rule 4's oldest-first rule, which still picks Slice 15
first and will still find it owner-blocked — the four sit at the young end of
the backlog. Expect rule 4 to walk to them.

Counters after this wake's row, read immediately after recording: rule 2
`1 / 4 … ok` (unchanged — a Polish row is not a Continue round), rule 3
`1 / 3 … ok [292]`. **Re-run `dispatch_status.py` anyway** — the standing
carried-forward finding is that a hand-off's claim about a dispatcher rule is a
forecast, not a measurement. Rule 5 read **STALE** (`3 wake-date(s) newer`) and
is reported as *could not be evaluated*, never clear.

**⚠ THAT COMPARISON FIRED, AND THE FAULT WAS THE ROW, NOT THE PARSER.** On the
first read rule 3 stayed `0 / 3` against a hand prediction of `1 / 3`, with
`dispatch_status.py` reporting *"1 Objective-closing round(s) … and none names a
slice"* and pricing it at `p=24.2%` — i.e. explicitly NOT evidence of a parser
bug. It was not one: this wake's `--item` began `icon round 3 —`, and all three
slice patterns are start-anchored, so the row named no slice. The four previous
Polish rows all begin `Slice N — `. Corrected in `loop-log.md` (the source of
truth) before pushing and the mirrors rebuilt with `rebuild_from_log.py` /
`generate_status.py` / `generate_roundtable_index.py`; the parser now reads
`1 / 3 [292]` and reconciles **1491 parsed against a raw `grep -c '^- '` of
1491**. **Write the item as `Slice N — …`**; this is the sixth instance of the
counter being caught by a number disagreeing with something written by hand, and
the first where the disagreement was the recorder's fault rather than the
parser's.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.

## What landed this wake

**Slice 292 — Polish round 3 on `component/icon`** (dispatcher rule 6; rules
1-5 all clear or not-evaluable). **Two defects, both on the surface.**

1. **The page's Markup heading had rendered outside every `<section>` since
   2026-08-19.** `icon.astro` lost its `<section class="demo">` opener in
   `efd4fd02`; 7 openers against 8 closers, and the HTML parser drops the
   unmatched closer silently. Built DOM read **13 `<h2>` against 12
   `section.demo`**, and `.demo h2`'s `font-size` did not apply — the heading
   rendered at **21px** among twelve siblings at **18px**. Now 18px. Corpus
   sweep: **1 of 80** built pages before, **0 of 80** after, red-proved by an
   injection asserted to land.
2. **All four deprecation blocks in the SHIPPED CSS rested on a false census.**
   Found by the blind re-score, re-derived here from the repo:
   `/patterns/app-frame` renders `--building`, three other docs pages render
   `--settings`, and `examples/erp-suite` gives two of its six modules `--user`
   and `--settings` as their identity. The fix removes the census rather than
   refreshing it — a deprecation cannot rest on a count of renders, because
   renders can only rise after the note is written.

**§3b step 4's blind re-score RAN** (the round edited the scored surface, which
is 288.1's trigger clause). `content` 3 agreeing; `typography` 2 contradicting,
on a page-scoped reading the scorer itself flags as out of scope — so the score
does **not** move and the scope question is filed as 292.3. It also exposed a
defect in the instruction it was given: `apps/docs/src/data/dsa-rubric.json`
**does not exist**; the rubric is a `rubric` key inside `dsa-scores.json`, which
the blindness protocol forbids opening. Name that explicitly next time.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **855** assertions),
`check:claims` **167** live, `check:layout` **127** pages, `test:axe` **127**
pages x 2 widths zero violations, `check:scroll` **914** containers,
`check:formatting`. The *"3 NOT VERIFIED"* in `check:claims` is
`ENVIRONMENT.md` 6b — this container reports `(pointer: fine) = false` — not a
regression.

**283.2's mid-round stamp trap was hit for real and caught by the process rule
alone.** `--stamp component/icon` ran, then a comment reflow in `icon.css`
followed before the commit — which is precisely the edit-after-stamp that
orphans a row, and nothing mechanical would have caught it at that moment.
Re-built and re-stamped (`5c5e51e4` → `ed441c58`) as the genuine last step;
`--verify-stamps` after the commit reads **21 rows, every stamp describes a real
tree**. The rule is load-bearing, not ceremony — this is n = 3 for that trap and
the first time it was avoided rather than diagnosed afterwards.

**A build gate caught this wake mid-edit, exactly as its own comment predicts.**
`icon.astro`'s `deprecationMarkers` guard equates a raw count of `DEPRECATED` in
`icon.css` with the parsed glyph count; the first draft of the correction used
that word in prose and made it 5 against 4. Reworded to "deprecation blocks".
`check:slice-refs` also correctly refused the build until `roadmap 292.1`
existed.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...911233e`). Trap 2
clean in one `--unshallow` (**1,934** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **thirteenth** consecutive
container to do so.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. This round changed rendered
markup, so unlike the last two wakes a screenshot lane **is** relevant here, and
it did not run. What did run is `ENVIRONMENT.md`'s second list, live against the
built tree: `closest('section')`, computed `font-size` per heading, parent
chains, an 80-page DOM sweep with a red-proof, and a byte-diff of the built
pages. The residue a screenshot would add is whether the corrected Markup
section *looks* right beside its siblings; it is now identical in class and
computed size to twelve of them.

## The open set is 16 — and 4 of them are cloud-takeable

Each line classified from the item's own text per `LOOPS.md` 186.2.

- **cloud-takeable: 4** — `292.3` (rubric scope; a definition change, so for a
  Continue round or the owner, not Polish), `292.4`, `292.5`, `292.6`. All four
  are on `/components/icon` or the rubric, and none needs a rendered image.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (defers to 249.10),
  `249.10`, `249.11`, `249.12`, `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.** `249.15`'s own text says a cloud wake should not pick it up.

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings; `check-resume-slice-ids`
also counts the 2 items under the non-slice `## STATE` heading. Do not quote a
bare closed count.

## No archive sweep — under the trigger both units, again

`roadmap_scope.py` read **39.4%** at the start of this wake and Slice 292 has
added lines, so re-measure rather than quoting either figure. The standing
trigger, honoured by the last two wakes: **a wake that finds itself past
5,450 lines / 40.6% should simply run it.** Trend across seven readings:
25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → (re-run). `249.12`, the
archival trigger itself, is still an open owner call, so a wake inventing a
threshold to justify a sweep it has already started is the exact thing that item
exists to prevent.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **The cloud lane is dry no longer, but only because a Polish round filed into
   it.** That is worth noticing rather than celebrating: four of the last five
   dispatchable items this loop has produced came from grilling or polishing its
   own docs, not from the roadmap. Every item the *plan* still holds waits on
   either the owner or a local wake.

2. **`273.2` is still the owner call worth their attention**, a seventeenth wake
   untouched — whether a Polish round whose score does not move should increment
   `dry`. This round did not pre-empt it. Note it now has a live cost: `icon` is
   the second surface to reach `3/3` and spend its budget while `dry` reads 0,
   so the ceiling rather than the dry rule is what retires a surface.

3. **`249.12`, the archival trigger, stays load-bearing.** Two consecutive wakes
   reached opposite conclusions on the sweep hours apart on the same tree, and
   only a hand-off happening to name a number settled it. A stated trigger
   removes that.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, re-run this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.

**A related reading this wake took, recorded so it is not mistaken for one:**
`packages/core/dist/css/index.min.css` measures **95,172 bytes**, gzipped
**15,458** — and an independent reading of the same tree minutes earlier gave
**15,305**. That spread is the zlib-build variance `LOOPS.md` warns about; it is
evidence for 292.6, not a sample for rule 5.
