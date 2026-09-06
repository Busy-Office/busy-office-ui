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
at hand-off. Two commits this wake: Slice 299 and this hand-off. One iteration
recorded — `Objective · grill`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 has RESET — expect rule 4, oldest cloud-takeable is `292.7`

Read immediately after recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   3 / 4 Continue rounds since 2026-09-06 12:51   ok
Objective     0 / 3 slices          since 2026-09-06 15:05   ok
Optimize      3 wake-date(s) newer  since 2026-09-03 09:54   STALE
```

**Two Objective grills of the same set ran today** (Slices 298 and 299 — see
below), so rule 3 is reset hard. Rule 2 sits at `3 / 4` and did not move: a
grill is not a Continue round. So the next wake should reach **rule 4**, unless
a Continue round lands first and crosses rule 2.

Rule 5 read **STALE** and is reported as *could not be evaluated*, never clear.
`bundle-gz-kb` still cannot be sampled (259.1's finding, carried forward, not
re-run this wake). Do not "fix" it by recording a guess.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first. It did not run this wake:
rule 3 matched, so rule 6 was never reached. (`--check` and `--audit-stamps`
were read as *evidence for the grill*, not as step 0: **10** surfaces re-queued,
**0 of 21** stamps orphaned.)

## ⚠ Step 1 changed under this wake — read BOTH intakes next time

Slice 297 (the other dispatcher, landed mid-wake) rewrote `LOOPS.md` Step 1 to
read **issues AND Discussions** every wake. **This wake's Step 1 ran before that
commit existed and read the issues intake only** (`list_issues` →
`totalCount: 0`). Said plainly rather than implied: Discussions were **not**
checked this wake. Read both next time.

## What landed this wake — and it is the SECOND half of a collision

**Slice 299.** The dispatch was rule 3's Objective grill of 292, 293, 295 —
and **the other dispatcher ran the same grill in parallel and pushed first, as
Slice 298.** That is a collision in Step 0c's full sense: two dispatchers, one
item. The third recorded, and the **first where both wakes finished**.

Per Step 0c the loser loses its work and re-dispatches. This wake's own Slice
298 was `git reset --hard` away rather than merged, so **none of the duplicated
verification reached `main`**. What did reach it is the two findings the winning
pass had not made:

- **`299.1` (closed) — Slice 295's "1,150 assertions … up from 387" names a
  baseline no revision of `check-metadata.mjs` has produced.** Slice 298 checked
  the 1,150 and marked it *"✓ exact"*; the 387 beside it was never re-run. Each
  revision run against ONE dist: **133** (`01fd7fc5`), **1,022** (`93ad43ad`),
  **1,022** (`bdb73d8f`, the revision 295 replaced), **1,150** (HEAD). The delta
  reconciles exactly — `OG_REQUIRED` gained `og:image` (+127) plus the
  distinct-url resolve arm (+1) — so the change adds **128**, not 763. Struck in
  place per 236.2; the commit message and `loop-log.md` row stay as history.
- **`299.2` (closed) — Slice 298 diagnosed `ENVIRONMENT.md` §1c's consumer count
  as having moved 14 → 15 and left the comment reading 14.** A reconciliation
  whose stated value is knowingly wrong is worse than a merely stale one,
  because the next wake cannot tell the two apart. Corrected, with the
  arithmetic restored (12 npm entry points plus **three** non-scripts, Slice
  295's `gen-og-card.mjs` being the new one), plus what a moved count MEANS and
  the one command that classifies it. Transitive-zero re-measured by an
  import-graph closure (**15**) rather than by the grep it licenses (**15**).

**Read Slice 298 as the primary record of the grill itself.** It found two
things this pass did not — a raw `#fff` in `gen-og-card.mjs` against that
script's own "nothing invents a colour" header, and §1c reading as universal
when its measurements are container-specific. Both are fixed on `main`.
**Four defects between two passes, overlap of one**, is the honest yield of
having run this twice.

The second pass's full reproduction evidence is in
`.roundtable/grill-objective-292-293-295-second-pass-2026-09-06.md` — **63 of
65 assertions reproduce**, and Slice 298 landed no `.roundtable` report, so
§6's Exit is satisfied by that file.

**Gates green on the base that was pushed** (`66cd85da` + this diff): core
`build`, `test` (**165**), `lint:css`, `docs:build` (`check:repo` incl.
`slice-refs` **874**, `page-shape` **127** pages), `check:metadata` **1,150**,
`check:claims` **167** live, `check:layout` **127**, `test:axe` **127 x 2**,
`check:scroll` **914**, `check:formatting`. The *"3 NOT VERIFIED"* in
`check:claims` is `ENVIRONMENT.md` 6b (this container reports
`(pointer: fine) = false`), not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a
cloud wake has no Podman. **None is owed, and it is checkable:** this wake's
diff touches `.roundtable/*.md` and `ROADMAP.md` only — **0** CSS files, **0**
docs pages, **0** scripts. 292.4/292.5's screenshot lane on `/components/icon`
**remains unspent**, and a local wake's glance still closes it cheaply.

## `origin/main` moved TWICE under this wake — two DIFFERENT collision shapes

Both caught by the `git fetch origin main` Step 0c mandates before a commit,
which is the working half of that section and has nothing mechanical behind it:

```
b3abc5fd..bf55dca5   Slice 297 (owner call, feedback intake)  -> a NUMBER collision
bf55dca5..66cd85da   Slice 298 (the SAME grill)               -> an ITEM collision
```

**The first is a shape Step 0c does not discuss.** Both dispatchers read
`ROADMAP.md`, both took `max + 1`, and both were right when they read it — so
both wrote a Slice 297. It cost a renumber, not a wake. Had the fetch been
skipped the push would have carried a duplicate heading, which
`check:slice-refs` fails on (*"each slice number heads one section"*, **281** of
281 today). This wake's slice was renumbered 297 → 298 → **299** across the two
fetches, each renumber by an assertion that refuses an ambiguous replace rather
than a blind `sed`.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...b3abc5f`).
Trap 2 clean in one `--unshallow` (**1,952** commits, no `shallow.lock`) and it
again brought the tags — the **nineteenth** consecutive container to do so, and
the first to read `git tag | wc -l` → **8** rather than 7 (`v0.8.0`). Trap 1c
did not bite. **One self-inflicted hazard worth naming:** a `DOCS_BASE` build
deleted `apps/docs/dist` underneath a still-running `scan:dead-style`; the scan
was killed and re-run against a restored plain dist, and nothing was published
from the interrupted run.

## The open set is 21 — and 6 are cloud-takeable

`roadmap_scope.py` reports **21 open / 49 closed**, OPEN slices
`[15, 112, 249, 273, 292, 294, 296, 297, 298]`. Net from the last hand-off's 19:
`+297.1` and `+298.1` from the other dispatcher, and `299.1`/`299.2` opened and
closed inside this wake. `check-resume-slice-ids` reports a different closed
count — it also counts the 2 `[x]` items under the non-slice `## STATE`
heading. **Do not quote a bare closed count.**

- **cloud-takeable: 7** — `292.7`, `292.8`, `292.9`, `294.1`, `294.2`, `296.2`,
  and **`298.1`**. **`294.1`/`294.2` were classified from Slice 294's triage
  text by an earlier hand-off and are again NOT re-read from their bodies this
  wake** — said plainly; `294.2` says the brand mark inside it is an owner call,
  so read it before dispatching. **`298.1` reads as input-blocked and is not**:
  its Accept has two branches, and the second — *"this closes as 'one instance
  is not a pattern' with the count that decided it"* — is a count a wake can
  take today, with the item saying outright that closing it that way is a
  satisfying outcome. Only its FIRST branch waits on an outside event.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `296.1`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (1): `297.1`** — a **fourth kind**, named because `LOOPS.md`
  186.2's three (owner / browser / agent) do not cover it. Its Accept requires
  *"one wake reports on a real filed item"*, and both intakes are empty, so no
  wake can advance it until an outside person files something. It is **not**
  owner-blocked: the owner has already done everything it asks of them.
  **Classified from its own Accept text this wake.**

7 + 10 + 3 + 1 = 21, asserted rather than left to the reader.

Rule 4's oldest cloud-takeable item next wake is **`292.7`** (four `content`
cites score a page property while citing the CSS).

## No archive sweep — the share moved DOWN this time, again for the mirror reason

Measured on the **committed** tree (`roadmap_scope.py`): **6,740 lines**,
closed-history share **37.6%**. The standing trigger the last nine hand-offs
carry is *"past 5,450 lines / 40.6%"* — lines are past it, the share is not.

Trend across fourteen readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → **37.6%**.

**Three consecutive wakes have now had this number move on them for reasons
that have nothing to do with the tree's health**, which is the finding. The
previous hand-off read it DOWN after a rebase (Slice 296 added open items to
the denominator alone). Earlier this wake it read **38.3%** UP, because a grill
closed both of its own items on the day it filed them. It now reads **37.6%**
DOWN, because Slices 297 and 298 each left an item OPEN. Same mechanism, three
signs: **the share is a property of who committed last, not of the tree.**
That remains the sharpest argument for `249.12` these hand-offs have produced.

No sweep run.

## Direction

Nothing new from the owner reached THIS wake to triage; the issues intake is
empty (`list_issues` → `totalCount: 0`) and **Discussions were not read** (the
rule requiring it landed mid-wake). Today's owner input was triaged by the
other dispatcher: Slice 297 (feedback intake), plus 294 and 296 earlier.

**Three things want the owner's attention:**

1. **Two dispatchers ran the identical grill today, and Step 0c's cost model
   held — but the number collision it does not model also fired.** Step 0c
   accepts item collisions at "up to one wake's work, discarded", and that is
   exactly what this cost. Slice 162's postscript held too: the redundant pass
   found two real defects the winner shipped past, one of them in the winner's
   own grill. **The honest reading is n = 2, not a proof** — the same evidence
   would be worth recording had the redundant pass found nothing. What is new
   and unwritten is the *number* collision: cheap, but nothing prevents it, and
   it is only caught because the pre-commit fetch is mandatory.

2. **`249.12` has stopped being low-urgency, and this wake is the strongest
   evidence yet.** Six consecutive wakes have reasoned about which unit to
   believe before declining to sweep, and this one alone produced two readings
   of the share in opposite directions. Its own roadmap text still calls it
   *"low urgency, the sweep keeps happening regardless"*.

3. **`273.2` is the owner call still worth their attention**, a twenty-third
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
