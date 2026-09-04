# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-04 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 268 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because Slice 268's
two items were filed already closed, the way 263.1, 264's, 265's three, 266's
three and 267's were.

**`check:resume-slice-ids` will report the closed ids named below, and all are
deliberate** — `268.1`, `268.2`, `267.1`, `266.1`, `249.18`, `249.20` appear
here only as history. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4 — re-run it, this is a snapshot

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Polish**, which adds no Continue round, so the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok`. Slice 268 closed and the counter
  stays 0, which is correct rather than a bug: 161.4 admits only `Continue` and
  `Standardize` rows as slice-closers and this wake's row is `Polish`. Expect
  rule 3 to stay at 0 for as long as Polish is the loop that runs — this is the
  **fourth** consecutive wake in that state.
- **Rule 5 (Optimize)** — read the line, do not assume. Its TREND clause was
  STALE again, so it was reported *could not be evaluated*, not clear. Do not
  "fix" that by recording a guessed value (see the bottom of this file). **Its
  SECOND clause is separately evaluable and was clear** — 184.2's "a size budget
  breached outright": `check-size.mjs` passed at *376.2 kB gz over 139 payload
  files, tightest headroom 110 bytes* (`css/brand-navy.min.css`), the identical
  reading to last wake. Answer both clauses.

So the next wake reaches **rule 4**, finds every open item blocked, and falls
through to **rule 6**, which is what dispatched this wake.

## ⚠ The correction most likely to be re-broken

**A blind re-score is not blind because you withheld the score file.** §3b step
4's instruction named `dsa-scores.json`, `polish-state.md`, `ROADMAP.md` and
`.roundtable/**` — every place the score lives **except the built page the agent
was sent to read**, where `DsaScore.astro` renders it. Every blind re-score this
ledger has run was taken under that instruction, the dashboard round's included.

This wake's scorer **disclosed it unprompted**; nothing in the procedure caught
it, and a scorer that simply agreed would have looked identical to a real
independent confirmation. `LOOPS.md` §3b step 4 now carries the fix, and the
part to keep is the reasoning rather than the wording:

> a leaked prior can only pull a scorer **toward** the published value, so a
> re-score that AGREES with it is weak evidence and one that CONTRADICTS it is
> not weakened at all.

**If a future round reports a blind re-score that confirmed the existing score
and says nothing about the leak, it has been undone.**

**The standing shape, sixth round running:** the claim a round spends its
red-proof on is the one that holds; the claims shipped **alongside** go out on
credibility. This round's near-miss was arm 9 — `stepper :: initWizard` is a
real, *declared* relation and still not a defect, because being SERVED by a
behaviour is not HAVING an interaction surface. Two consecutive wakes have now
been pointed at that same stepper flag by two different instruments, and it is
correct both times. **It is not a defect; stop re-finding it.**

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly blocked.
GitHub intake is empty (`list_issues` → `totalCount: 0`). The two standing owner
blocks are unchanged: Slice 15's `AT runtime evidence` (owner hardware) and
`112.3`/`112.4` (owner briefs, then 112.3's verdict).

**Rule 4's open set, classified by WHICH KIND of blocked** (`LOOPS.md` 186.2's
vocabulary), re-read this wake rather than copied:

- **owner-blocked:** Slice 15, `112.3`, `112.4`, `249.10`, `249.11`, `249.12`,
  `249.13` — and `249.7`, a cost question its own text says should not be
  settled before the owner answers `249.10`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.

The clause-level re-read (the question `RESUME.md`'s correction block has asked
for three wakes running) found **no cloud-takeable half left in any of the
three**. `249.9` is the one worth stating, because it is where the last two
splits came from: both of its derivation halves are now split out and landed
(`249.18` the component→patterns mapping, `249.20` the JS-tier key), and what
remains is the catalogue page's rendered miniatures plus the AT badge, which is
Slice 15's owner hardware. `249.6` has been declined twice at the clause level
and `249.15` is the OG image. All three want a rendered image a human compares.

**What landed needs no owner decision.** One score and one cite in
`dsa-scores.json`, and the playbook correction around them.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **3,198 / 5,995 = 53.3%** at
hand-off (50.9% at wake start), still under the **55.1%** at which 252.1
dispatched the tenth sweep on 2026-09-03. The rise is arithmetic, not a backlog
signal: Slice 268 closed fully, so its whole body is closed history the moment
it lands — the same mechanic 264, 265, 266 and 267 recorded. **Re-run the script
rather than quoting this line**; twelve wakes running now, and the share is
within two points of the trigger, so the next wake or two may genuinely reach
it. Note `roadmap_scope.py` also reports targets NAMED by the still-open Slice
249, which stay put per 236.2.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear (no open P0; GitHub intake
`totalCount: 0`); Step 1 triaged and committed nothing — no new input. Rule 2
`1 / 4 … ok`; rule 3 `0 / 3 … ok`; **rule 4 found nothing dispatchable**, all
eleven open items blocked in the kinds above; rule 5 trend STALE and size budget
clear. Rule 6 fired — `polish_requeue.py --apply` re-queued **18** surfaces and
printed 267.1's steady-state pair over a byte-identical file, so that fix holds
one wake on. Step 0 hit **trap 1** again — the container started DETACHED on
`ebfd2ed` with no local branch — fixed with `git checkout -B main origin/main`
before any work. `--unshallow` was clean in one attempt (**1,867** commits) and
`git fetch --tags origin` brought all seven, so trap 2 did not bite.

### Slice 268 — Polish round 2 on `component/navbar`

Full entry: `.roundtable/polish-state.md`, *"Round 2: navbar (2026-09-04)"*.
Four things worth carrying:

1. **The pick needed no invented discriminator, third wake running.** 266's
   falsifiable-assertion table, re-derived, reproduces to the character with
   `progress` removed; `navbar` was 267's own second-ranked candidate.
2. **navbar itself is clean on all six cites** — including the
   `interaction: na` that no arm covered, which is the cite the round went
   looking at. Its CSS paints zero interaction-state selectors and both of its
   documented parts are `<span>`s.
3. **The finding is on breadcrumb, and it is a sixth defect class**: the cite is
   still true word for word, and the score it justified stopped being available
   **7h14m after it was written**, when 94.9 added *"`na` only when there is no
   interaction surface at all"*. Nothing in the repo moved. `sidebar-nav` — same
   two signals, zero behaviours, born in the same commit — is the control.
4. **A gate was refused an eighth time**, and for the first time because the arm
   is red on a **correct** tree even after the fix (stepper), which is 243's
   ground for refusing arm 8's.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/` changed and **0** docs page markup changed; the only
non-markdown edit is one score and one cite in `dsa-scores.json`, whose
rendering was read back off the BUILT page rather than inferred. All **17** CI
entry points were re-derived from `ci.yml` and run green here. `check:claims`'s
`3 NOT VERIFIED` is ENVIRONMENT 6b's container property, and its live count read
**162**, unchanged from last wake.

**`bundle-gz-kb` still cannot be sampled, unchanged for a ninth wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
