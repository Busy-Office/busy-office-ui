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

Last updated 2026-09-05 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: `277.1` and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot — and this is
the comparison `LOOPS.md` rule 3 asks for. **Both rules read UNCHANGED, and
that is the agreement, not a stall**: this wake's row is a `Polish` row, and
161.4's list says only `Continue` and `Standardize` close a slice. A counter
that had moved here would have been the finding.

- **Rule 2 (Standardize)** `1 / 4 … ok` at dispatch → **`1 / 4 … ok`**.
- **Rule 3 (Objective)** `1 / 3 … ok [274]` at dispatch → **`1 / 3 … ok [274]`**.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`, unchanged) at
  Step 0b and again after recording. Report it *could not be evaluated*, never
  clear.
- **Rules 7-8 were NOT EVALUATED**, because rule 6 matched. A rule below a
  match is unreached, not clear.

## The open set is 12, and NONE of it is cloud-dispatchable

Re-read from `ROADMAP.md` after this wake's commit, and **every line was
re-classified from the item's own text rather than carried over from the last
hand-off**, per `LOOPS.md` 186.2:

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7`
  (its own text holds the cost question until the owner answers `249.10`),
  `249.10`, `249.11`, `249.12`, `249.13` (each says **OWNER CALL** in its own
  line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`,
  `249.15`. Each says so in its own text. `249.6` has been declined at the
  **clause** level twice; `249.15`'s remaining half is the OG *image* itself,
  and its tag half already shipped as `249.17`.
- **agent-blocked:** none.
- **NOT BLOCKED:** none.

**So a cloud wake again falls through rule 4 to rule 5 (STALE — cannot be
evaluated) and then to rule 6, which fires.** Third consecutive wake with no
queued build item to take. Run `polish_requeue.py --apply` first — it needs
`behaviors.json` as well as `api.json`, so `npm run build -w @busy-office/ui`
comes first or it exits naming the command.

## ⚠ Rule 6's tiebreak now selects the one surface every prior round dropped

**This is new this wake and the next wake will hit it immediately.** After
`pagination` moved to `2/3`, the ledger has exactly **one** surface at `1/3` —
`component/table-toolbar`. So for the first time in this ledger's history
"fewest rounds used" resolves the tie by itself, with no invented
discriminator.

**And it selects a surface with nothing to reconcile.** `table-toolbar` is
**ABSENT** from `dsa-scores.json` (176.2's recorded false gap — a
behaviour-documentation page with no CSS component under it), which is
217.1's stated reason for dropping it from the pick every previous round. Its
page makes no `DsaScore` call, so arms 1-6 have nothing to disagree with.

Checked, not recalled:

```
node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components;
for (const n of ['pagination','table-toolbar']) console.log(n, n in d)"
# pagination true · table-toolbar false
```

**Do not resolve this by skipping it and taking a `2/3` surface silently.**
276.1 took `inline-editing` — also unscored — and its arm 5 (a page's claims
against its serving module) found the source-map defect; this wake took the
same arm to `pagination` and found 277.1. An unscored page is short of DSA
arms, not short of subject: `table-toolbar` serves `initTableToolbar` **and**
`initDataGrid` per the `PAGE_ONLY_BEHAVIORS` map, so the behaviour arm has two
modules to read. Take it, or say in writing why not.

`roadmap_scope.py` reads **1,624 / 4,745 = 34.2%** closed history. No sweep is
due (272's eleventh sweep dispatched at 56.7%); re-run the script rather than
trusting this.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input.

**Step 0 hit trap 1 for the eleventh wake running** (detached HEAD at
`14fb2ad`, `git branch --show-current` empty), and `origin/main` arrived as a
**forced update** (`26447ba...14fb2ad`) — Step 0c's collision mechanic visible.
Trap 2 clean in one `--unshallow` (**1,889** commits, no `shallow.lock`);
`git fetch --tags origin` returned all seven. The Step 0c `git fetch origin
main` before the first commit reported `0 0` — no second dispatcher moved
anything this wake.

### `277.1` — a runtime promise published five times and asserted nowhere

The Polish round on `component/pagination` is **NOT a no-op**, and the defect
is ON the surface rather than found elsewhere: `initLoadMore`'s
`data-load-more-auto` path is documented in five places and asserted in none.
The only test naming the attribute asserts it *does not throw where
IntersectionObserver is unavailable (jsdom)* — an assertion about an
environment in which the feature cannot exist.

Measured in headless Chrome against the shipped module **before** anything was
written (`ENVIRONMENT.md`'s SECOND list): out of view at init **0** fires,
scrolled in **1**, away **1**, back **2** — and **already in view at
`initLoadMore()` fires 1, with no scroll and no click**. So the behaviour is
right and all five wordings were wrong.

Landed six `FakeIO` cases in a separate file, **all six red-proved with four
injections** — three of the injections left one case green, and an assertion
never watched fail is what CLAUDE.md refuses.

**The tiebreak was measured this wake, not alphabetical**, which is the
difference from 276.1: `pagination` and `table-toolbar` were level at `1/3`,
and 217.1's stated reason broke it.

**Two documented traps were walked into inside one verification step, and both
are recorded rather than quietly fixed.** After four prose edits the old
wording still grepped in `dist/` — the survivor was inside the page's
copy-paste code sample, which is CLAUDE.md's bulk-edit rule collecting on
exactly the file shape it names. And the first attempt to locate it reported
**nothing**, because `grep -o ".{140}…"` is a position filter, not a context
window. `grep -c` found it instantly. **The count in this slice went four →
five because the BUILT page said so**; do not re-quote "four" from anywhere.

**Two refusals recorded inside the item:** a `check:claims` case for the auto
path (it needs the demo button to carry the attribute, changing what the demo
DOES, which needs the screenshot lane a cloud wake cannot run), and a gate for
"a documented runtime claim with no executable assertion" (94.11's
shape-vs-content line, and 101.3 forbids Polish adding gates).

**One thing in this diff DOES render, and it is named as unverified.** **0**
CSS files changed, but `pagination.astro` gained prose, an `ApiTable` `js`
string and a code-sample comment, so the page **reflows by a few lines and
that reflow is UNVERIFIED VISUALLY** — a cloud wake has no 1440/390
light-and-dark lane. What is verified: `check:layout` and `check:scroll` sweep
every page at both widths and `test:axe` reports zero violations across 127
pages × 2 widths.

**All 17 cloud-toolchain entry points ran green**, with the list re-derived
from `ci.yml` rather than trusted — it still matches `ENVIRONMENT.md`'s in the
two documented, opposite-direction ways. `check:claims`' *"3 NOT VERIFIED"* is
`ENVIRONMENT.md` 6b (this container reports `(hover: hover) and (pointer:
fine)` false), not a regression; its live count reads **162**, unchanged from
the previous wake.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `277.1`, `276.1`, `273.2`, `249.17` and the other `249.x` ids
are named as history or as classification evidence — what was decided and why
— not as queued work. The report is partly **self-referential**: an id acquires
a mention simply by being listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT
runtime evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's
verdict), and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention, both carried over — which is itself
the signal:**

1. **`273.2` is still the owner call worth their attention**, untouched for a
   fourth wake. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose
   score does not move; no round has ever done it. **This wake does not change
   the tally** — 277.1 is not a no-op, so step 5's first half applies and the
   count stays at **9 NO-OP rounds, 7 of which filed a real defect found
   elsewhere**. Executing the rule as written would retire surfaces and empty
   a lane **176.3 already refused to narrow**.
2. **The cloud lane still has no dispatchable build work**, third wake
   running. All 12 open items are owner-blocked (9) or need a LOCAL wake's
   screenshots (3). Rule 6 keeps finding real defects — the last three Polish
   rounds each filed one — but no *queued build item* will move until the
   owner answers something or a local wake takes `249.6`/`249.9`/`249.15`.

## `bundle-gz-kb` still cannot be sampled — twentieth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
