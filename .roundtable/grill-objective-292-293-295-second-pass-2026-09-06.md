# Objective grill — Slices 292, 293, 295: the SECOND of two independent passes (2026-09-06, cloud wake)

**Dispatched by rule 3**, `dispatch_status.py` reading
`Objective 3 / 3 slices since 2026-09-06 07:53 OVERDUE [292, 293, 295]`.

> **⚠ READ SLICE 298 FIRST — the other dispatcher ran THIS SAME GRILL in
> parallel and pushed first.** This is a Step 0c collision, the third recorded
> and the first where both wakes finished. Step 0c's rule is that the loser
> re-dispatches, which is what happened: this wake's own Slice 298 was reset
> away rather than merged, so nothing here is a merge of the two. Slice 298 is
> the primary record; **this report is the redundant pass, and it is kept
> because it caught two things the winner did not** (roadmap 299).
>
> The two passes agree everywhere they overlap. Neither is a check on the
> other's honesty — they were written without sight of each other — which is
> what makes the agreement worth something and the two gaps worth recording.

**Scope, narrowed per §6 step 0 before grilling.** The armed set needed no
narrowing: `grep -hoE '^## Slice [0-9]+ — Objective grill of Slices [0-9, -]+'
ROADMAP.md ROADMAP-archive.md` returns nothing naming 292, 293 or 295, and the
newest prior grill is Slice 291 (286, 287, 290). All three grilled in full.

---

## Verdict — 65 published assertions checked, 63 reproduce as published

Two do not, and **neither is a measurement the grilled wake got wrong at its own
commit**. Both are the shape CLAUDE.md names as the expensive one: *the defect
lands in what shipped BESIDE the number that was red-proved.*

| # | slice | assertion | verdict | in Slice 298? |
|---|---|---|---|---|
| A | 293 → 295 | `ENVIRONMENT.md` §1c: the consumer grep prints **14** | **exact at `649ca8ef`; 15 on `main`** | diagnosed, **left uncorrected** |
| B | 295 | the metadata gate goes **387 → 1,150** | **387 matches no revision of the gate; the prior count is 1,022** | **not checked** — 1,150 marked "✓ exact", the 387 beside it not re-run |

Everything else — every count, byte figure, DOM reading, red-proof and
derivation in all three slices — reproduces exactly. The two dispatcher traces'
commit counts (1,934 and 1,942, reported at wake start) reconcile with
`git rev-list --count` at their own slice commits (1,939 after five commits;
1,943 after one).

**Slice 298 found two things this pass did not**, and they are its record, not
restated here: `gen-og-card.mjs`'s `.dot` carrying a raw `#fff` against the
script's own "nothing invents a colour" header, and §1c reading as universal
when its measurements are container-specific (on a Mac with Chrome installed,
`resolve-chrome.mjs` finds a candidate and no gate needs the variable). Both
are real and both are fixed on `main`. **Four defects between two passes over
three slices, with an overlap of one** is the honest yield of running this
twice — worth knowing before anyone argues the redundancy away.

---

## Finding A — §1c's count went stale in under a day, and the mechanism caught it

293.1's whole subject was that **a durable document holding a snapshot of names
goes stale silently**. Its repair replaced three names with a derivation and a
count, saying *"Re-run it; the count is the reconciliation, not the list."*

Re-run this wake, the grep prints **15**, against a comment that says 14.

**293.1's 14 was correct — measured, not assumed.** Reconstructing the grep at
`649ca8ef`'s own tree (`git show 649ca8ef:<file>` for every `.mjs` in both
directories) returns exactly fourteen files.

**The fifteenth is `apps/docs/scripts/gen-og-card.mjs`, added by Slice 295**
(`605829ca`, the same day, hours later), which imports `browser-harness.mjs`
directly. It is **not** an npm script — `grep -rn 'gen-og-card' --include=
'package.json'` returns nothing — so §1c's arithmetic ("12 npm-script entry
points, plus `browser-harness.mjs` and `score.mjs`") stopped summing.

**This is the mechanism working, not failing.** A snapshot of *names* rots
invisibly; a snapshot of a *count* announces itself the moment it is re-run,
which is what happened. What was missing is the sentence telling a wake what a
moved count MEANS — a new gate to export for, a non-script consumer that
changes nothing a gate runs, or the transitive-only consumer that would retire
the one-level grep.

**The transitive-zero premise re-verifies, on a stronger instrument than the
one that stated it.** §1c asserted it from a one-level grep. A relative-import
graph over both directories, closed under reachability from
`browser-harness.mjs`/`resolve-chrome.mjs`, returns a closure of **15** against
the grep's **15** — equal sets, 0 transitive-only. The equality is the licence
for the shortcut, and it is now written as such.

**Repaired here** rather than filed, and the repair is the part Slice 298 did
not make: that pass *reported* the move in its roadmap prose and left §1c's
comment reading 14. A wake following §1c at Step 0 gets **15** against a stated
**14**, with the explanation sitting in a file it is not reading — and a
reconciliation whose stated value is knowingly wrong is worse than one that is
merely stale, because the next wake cannot tell the two apart. Closed as 299.2.

## Finding B — "up from 387" is off by 635, and it spread to three records

Slice 295's own load-bearing work is red-proved thoroughly: both new arms were
injected, each injection grep-confirmed in the built HTML first, both reverted.
Every one of those claims reproduces. The figure quoted *beside* them did not
get the same treatment.

**Measured by running each historical revision of the gate against ONE dist**,
so the only thing varying is the script:

```
01fd7fc5 (249.2)  ->   133 assertions across 127 built pages
93ad43ad (260)    -> 1,022
bdb73d8f (263)    -> 1,022      <- the revision Slice 295 replaced
HEAD (295)        -> 1,150
```

No revision has ever printed 387 on this corpus. **387 appears exactly twice in
the repo's prose**: in Slice 295's own sentence, and in an unrelated archived
slice about token definitions (`2451 references, 189 distinct names, 387
definitions`) — which is the likeliest source, a number carried across from a
different instrument.

**The delta reconciles exactly, which is what makes 1,022 the right baseline
rather than merely a different reading.** The diff at `605829ca` adds
`'og:image'` to `OG_REQUIRED` (+1 assertion per page × 127) and adds the
distinct-url resolve arm (+1, a Set over one url):

```
1,022 + 127 + 1 = 1,150      observed: 1,150
```

So the change adds **128** assertions, not 763 — it is a fifth again as large a
contribution as published, on a gate five times larger than published.

**Red-proof of this grill's own instrument.** Running an old script against a
new dist could plausibly inflate its count; it does not, and the three
revisions returning three different numbers on one dist (133 / 1,022 / 1,150)
is the discrimination — the reading tracks the script, not the corpus. Per-page
ratios agree with the structure: 1,022/127 = 8.047 and 1,150/127 = 9.055, the
fractional part in both being the handful of corpus-level arms.

**Where it spread, and what is correctable.** Three records carry 387:
`ROADMAP.md` (corrected in place, with the measurement), `605829ca`'s commit
message, and `.roundtable/loop-log.md`'s row for the slice (mirrored into
`STATUS.md`). The latter two are left as history — 164.2 forbids backfilling
log rows, and 292.6 set the precedent for leaving a commit message's wrong
figure alone while correcting the durable text.

---

## What reproduced — the full check

**Slice 292** (Polish round 3 on `component/icon`). `/patterns/app-frame`
renders `bo-icon--building` at line 114 and five renders sit outside the
showcase, so both clauses of the falsified census stay falsified;
`_shell.mjs`'s `MODULES` gives crm `user` and prod `settings`, composed at line
79. `grep -o 'DEPRECATED' icon.css | wc -l` → 4. Built `/components/icon/`:
**13 `<h2>` against 13 `section.demo`**, the Markup heading inside a section at
**18px** with every sibling at 18px. Corpus sweep over the built tree: 84
component+pattern pages, **4 redirect stubs**, **80 scanned, 0** with an `h2`
outside every `<section>` — and red-proved by deleting one
`<section class="demo">` opener from `calendar`'s built HTML, with the
replacement asserted to land: `0 → 1`, restored `→ 0`. Cite classification:
`\.css\b` in **2 of 40** typography, **3 of 40** colour, **3 of 40** spacing;
`rubric.scope` carries all six values. `.bo-icon--settings` is at **line 127**
of `icon.css` at 292.4's own commit (`901ce9af`) — read from the commit, not
the tree, where it now sits at 139. Built page: `aria-label="Settings"` **0**,
`aria-label="Close"` **2**, three surviving generated `bo-icon--settings`. The
copyable block and the live demo agree on `[bo-icon, bo-sidebar-nav__icon]`,
`mask-image` absent, `--bo-icon-src` present, `bo-icon` span count 3.
`index.min.css` **95,172** bytes, gzip **15,458**, gzip level 9 **15,296** —
the 162-byte spread exactly. `stat:size` at `d48f361d` reads 80 kB/13.2 kB and
at `43ea922a` 84 kB/13.8 kB; `git show 43ea922a -- icon.css | grep -cE
'^\+  \.bo-icon--'` → **11**; `GZIP_TOLERANCE_KB = 0.3`; both READMEs read
93 kB/15.0 kB. 292.7's four off-scope `content` cites are all four there, with
`form` and `prose` stating their exemption. 292.8: **1 of 41** component pages
carries a raw `font-size`, with **6** declarations. 292.9's five sites across
four files are all present; `--barcode` and `--user` reach **0**. Ledger:
`--audit-stamps` **0 of 21**, `--check` **10** surfaces.

**Slice 293** (Standardize, 4 of 4 lanes). Lane 1 **0 dead of 1,433** live
inline declarations. Lane 2 **74 files · 242 rules · 230 distinct · 8 repeated
bodies**. Lane 3 **118 pages · median 792 · 111,622 words**, 10 over the corpus
median and 11 over a family median, union **15**. `check-boost.mjs` was deleted
on **2026-08-30** by **`f1be2485`** and does not exist. `docs:build` needs no
`CHROME_PATH` — re-derived rather than re-run: none of the 33 scripts its chain
invokes appears in the 15-file consumer closure. `scan:dead-style` is in that
closure. 293.1's own diff touched `.roundtable/ENVIRONMENT.md` and `ROADMAP.md`
only — **0** CSS files, **0** docs pages. Its round-2 detector, rewritten
independently here, also returns **11 hits**, and every false-positive class it
names is present; the bucket composition differs (this version dedupes per
file, so `check-boost.mjs` counts once, not twice) and the totals agreeing is a
coincidence, stated as one rather than as a reproduction.

**Slice 295** (the social card). `og-card.png` is **97,379** bytes, committed to
`public/` beside `favicon.svg` and `robots.txt`, referenced by no
`package.json` script. **127 of 127** built pages carry `og:image`; all 127
carry `twitter:card = summary_large_image`. Arm 5's disjunction is gone,
replaced by positive assertions, with the reasoning in the file's header; the
resolve arm collects distinct urls into a Set. `gen-og-card.mjs` reads back
`--bo-color-accent` and asserts `rows === 10`, exiting non-zero otherwise;
`--bo-palette-teal-700` is `#0f766e`, which is what the slice records it
printing. Against a real `DOCS_BASE=/busy-office-ui` build:
`og:url https://busy-office.github.io/busy-office-ui/components/button/` and
`og:image https://busy-office.github.io/busy-office-ui/og-card.png`, both
absolute, with the asset present at 97,379 bytes.

---

## This grill's own instruments, and one that was wrong first

Per 291's finding — that grill's four ad-hoc probes were all wrong — every
number above names the command that produced it, and one probe here failed the
same way before it was believed:

**The first cite-classification probe returned `0 of 0` for all six
dimensions.** It read `dsa-scores.json` assuming `components[name][dim]`; the
real shape is `components[name].dimensions[dim]`. A **0 across every input** is
CLAUDE.md's own signature for a defect in the instrument, which is what it was
— it was re-run against the real structure and returned 2/40, 3/40, 3/40. Had
the expected answer been 0 rather than nonzero, that probe would have passed
review.

**One instrument hazard cost a re-run rather than a wrong number:** the lane-1
scan was running against `apps/docs/dist` while a `DOCS_BASE` build deleted and
replaced that directory underneath it. The scan was killed and re-run against a
restored plain dist. Nothing was published from the interrupted run.

**Live-verify status, said plainly:** no 1440/390 light-and-dark screenshots —
a cloud wake has no Podman. **None is owed by this wake's own diff**, which
touches `.roundtable/*.md` and `ROADMAP.md` only: 0 CSS files, 0 docs pages, 0
scripts. Everything measured above was taken in the same headless Chrome the
docs gates drive, which `ENVIRONMENT.md` lists as available here.

## Live signal for the next Standardize sweep (not a defect in any slice)

Lane 4's dispatch-region reading has resumed moving, and **this wake read it
twice, at two revisions, and got two answers** — so each is stated with the
revision it describes, which is the discipline the reading itself is about:

```
29e3e7f7  (293's own HEAD)   dispatch 6,112   file 15,201
b3abc5fd  (this wake's base) dispatch 6,164   file 15,747
bf55dca5  (after the merge)  dispatch 6,351   file 15,934
```

293 recorded **+929 words of file, +0 of dispatch** across the four commits
since 284 and called the worry retired, as 290 had. **That flat run has ended:
+239 words of dispatch region in two commits on one day** — `+52` from Slice
296 installing the Gauntlet loop, `+187` from Slice 297 rewriting the intake
rule. Both are owner-directed additions to the rules a wake reads to DECIDE,
not rot, which is why this is a signal rather than a finding. The next sweep
should read lane 4 knowing the flat run ended rather than inheriting "retired".

## Postscript — TWO collisions in one wake, both caught by the mandated pre-commit fetch

`git fetch origin main` before each commit is the one process rule Step 0c
leaves standing, and it fired twice:

```
b3abc5fd..bf55dca5   Slice 297 (owner call, feedback intake)  -> a NUMBER collision
bf55dca5..66cd85da   Slice 298 (this same grill)              -> an ITEM collision
```

**The first is a shape Step 0c does not discuss.** Both dispatchers read
`ROADMAP.md`, both took `max + 1`, and both were right when they read it — so
both wrote a Slice 297. It cost a renumber, not a wake; but had the fetch been
skipped, the push would have carried a duplicate heading, which
`check:slice-refs` fails on (*"each slice number heads one section"*). This
report's slice was renumbered 297 → 298, and then 298 → 299 when the second
fetch fired. The renumbering used assertions that refuse an ambiguous replace
rather than a blind `sed`.

**The second is a collision in Step 0c's full sense**: two dispatchers took the
same *item*. Slice 298 pushed first and won. Per Step 0c the loser loses its
work and re-dispatches, so this wake's own Slice 298 was `git reset --hard`
away rather than merged — none of the duplicated verification reached `main`,
and what did is the two findings the winning pass had not made (roadmap 299).

**Slice 162's postscript is the precedent and it holds again**: the redundant
wake earned its keep. That is an argument for keeping two dispatchers, not for
this report's own merit — the same evidence would be worth recording if the
redundant pass had found nothing, which is the honest way to read n = 2.

**Every figure in this report was re-read on the final merged tree**, not
carried across. Lane 4's is the one that moved, and it moved twice.
