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
at hand-off. Two commits this wake, both pushed: `278.1` and this hand-off.

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

## ⚠ THE CLOUD LANE IS NO LONGER EMPTY — rule 4 has work for the first time in four wakes

**Read this before the block below, which describes the set as it stood at
dispatch.** The independent pass at the END of this wake filed **four new open
items** (`278.3`-`278.6`), so the open set went **12 → 16** and three of the
four are cloud-takeable. Next wake, rule 4 matches and **Polish does not get
dispatched**.

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 16
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 278]
```

Rule 4 takes **the OLDEST still-open item**, not the newest, so the four new
ones do NOT jump the queue — Slice 15, `112.3`/`112.4` and the `249.x` set are
all older and all still blocked. **The oldest item rule 4 can actually take is
`278.4`**, and it is the one worth taking:

- **`278.4`** (select-all leaves `aria-selected="false"` on every row) — a
  shipped accessibility defect, same class as `278.1` and found by the same
  question. Cloud-takeable in full: DOM and accessibility-tree assertions.
  **Its item text already names the listener-ordering trap** that will
  otherwise be rediscovered the hard way — read it before writing code.
- **`278.3`** (the composition is asserted only in jsdom) — cloud-takeable; the
  prose half already landed this wake.
- **`278.6`** (the opener's cost argument names a mechanism the module does not
  ship) — prose, cloud-takeable, but it needs a judgement about the component,
  not a find-and-replace.
- **`278.5`** (the Columns demo never calls `initDropdowns()`) — the geometry is
  cloud-measurable, but the fix **moves a menu on screen**, so say which of
  `ENVIRONMENT.md`'s two lists it needs when taking it.

## The open set was 12 at dispatch, and NONE of it was cloud-dispatchable

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

**That was the state AT DISPATCH, and it is why rule 6 fired this wake** — the
fall-through went rule 4 (nothing) → rule 5 (STALE, cannot be evaluated) →
rule 6. It is **no longer current**: see the block above, which this wake's own
findings changed. Run `polish_requeue.py --apply` first — it needs
`behaviors.json` as well as `api.json`, so `npm run build -w @busy-office/ui`
comes first or it exits naming the command.

## ⚠ The rule-6 tiebreak is AMBIGUOUS again, and it was not last wake

`table-toolbar` moved to `2/3` this wake, so the ledger's one uniquely-lowest
row is gone. **Every non-skipped surface now sits at `2/3` with `dry 0`**, which
is the state §3b step 1 has no discriminator for — the situation 176.2 measured
(`budget_spent = 0` and `marked_dry = 0` in every revision) and 217.1 used to
break by naming a reason.

Checked, not recalled:

```
grep -oE '\| [0-9]/3 \|' .roundtable/polish-state.md | sort | uniq -c
```

So the next wake must **state its discriminator in writing** rather than
picking alphabetically. The two rounds before this one both took an *unscored*
surface (`inline-editing` 276.1, `table-toolbar` 278.1) and both found a real
defect via the behaviour arm — reading a page's runtime claims against the
modules `behaviors.json`'s `byComponent` maps to it. That arm is 3-for-3 now
(277.1 on `pagination` too) and is the best available reason to pick a surface
that has serving modules.

`roadmap_scope.py` reads **1,772 / 4,894 = 36.2%** closed history. No sweep is
due (272's eleventh sweep dispatched at 56.7%); re-run the script rather than
trusting this.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input.

**Step 0 hit trap 1 for the twelfth wake running** (detached HEAD at `06c0eb8`,
`git branch --show-current` empty), and local `main` was stale at `26447ba`
while `origin/main` had moved — the exact shape that bites at `git push`, not
at Step 0. Fixed with `git checkout -B main origin/main` before any commit.
Trap 2 clean in one `--unshallow` (**1,891** commits, no `shallow.lock`); the
same fetch brought `v0.1.1` and `v0.2.0`. The Step 0c `git fetch origin main`
before the first commit reported `0 0` — no second dispatcher moved anything.

### `278.1` — two behaviors documented as a pair, never asserted together

The Polish round on `component/table-toolbar` is **NOT a no-op**, and the
defect is ON the surface. The page calls `initTableToolbar` and `initDataGrid`
*"the two opt-in behaviors that sit on top of a data table"*; each reproduces
individually and nothing had ever asserted them together.

Measured in headless Chrome against the BUILT page (`ENVIRONMENT.md`'s SECOND
list), driving both real modules with real events: park the cell cursor in a
column, hide that column with a real `change` on `[data-col-toggle]`, and the
grid's **single tab stop is left on a `[hidden]` cell** — Tab then skips the
grid entirely and a keyboard user has no way back in. Fixed in `data-grid.ts`;
hidden cells are excluded from cursor movement and can never hold the tab stop,
re-seeded from a `MutationObserver` rather than a `change` listener **because
the toolbar hides on a document-level listener that runs after any
container-level one** — that ordering was measured, not assumed.

`278.2`: the page listed four of the six keys the module implements.
`Home`/`End` and their Ctrl variants ship in `keymap.json` and render on
`/concepts/js-behaviors`, asserted nowhere (`grep -c Home` on
`data-grid.test.ts` → **0**). Here the behaviour is CORRECT and the omission is
the defect — the opposite of 277.1 the wake before.

**Four injections red-proved, each confirmed in the artifact first. Three dead
instruments are recorded rather than dropped**, and all three "passed" by not
erroring:

- importing the library from the page's own `<script type="module">` sources —
  those are Astro entry scripts, so `initDataGrid` never ran;
- `document.querySelector('[data-col-toggle]')`, which matched the **first
  demo's** Vendor box and hid a column in a different table;
- grepping `dist/js/index.js`, a **re-export barrel** where `.hidden` reads
  zero on the FIXED build too, so it would have reported "removed" for any
  injection whatsoever. The artifact is `dist/js/behaviors/data-grid.js`.

**All 17 cloud-toolchain entry points ran green**, with the list re-derived from
`ci.yml` rather than trusted — it still matches `ENVIRONMENT.md`'s in the two
documented, opposite-direction ways. `check:claims`' *"3 NOT VERIFIED"* is
`ENVIRONMENT.md` 6b, not a regression; its live count reads **163**, up from 162,
which is exactly the one case this wake added.

**One thing in this diff DOES render, and it is named as unverified.** **0** CSS
files changed, but `table-toolbar.astro` gained two prose passages, so the page
**reflows by a few lines and that reflow is UNVERIFIED VISUALLY** — a cloud wake
has no 1440/390 light-and-dark lane. What is verified: `check:layout` and
`check:scroll` sweep every page at both widths, and `test:axe` reports zero
violations across 127 pages × 2 widths.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `278.1`, `278.2`, `277.1`, `276.1`, `273.2`, `249.17` and the other
`249.x` ids are named as history or as classification evidence — what was
decided and why — not as queued work. The report is partly **self-referential**:
an id acquires a mention simply by being listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT
runtime evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's
verdict), and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention, both carried over — which is itself
the signal:**

1. **`273.2` is still the owner call worth their attention**, untouched for a
   fifth wake. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose
   score does not move; no round has ever done it. **This wake does not change
   the tally** — 278.1 is not a no-op, so step 5's first half applies and the
   count stays at **9 NO-OP rounds, 7 of which filed a real defect found
   elsewhere**. Executing the rule as written would retire surfaces and empty a
   lane **176.3 already refused to narrow**.
2. **The cloud lane's four-wake drought ENDED inside this wake, and it ended
   because the loop generated its own work.** All 12 items open at dispatch
   were owner- or screenshot-blocked; the round then filed four more
   (`278.3`-`278.6`), three of them cloud-takeable, including a **shipped
   accessibility defect** (`278.4`). So the standing report — *"nothing
   dispatchable"* — is no longer true, and rule 6 will not fire next wake.
   The owner-blocked nine are unchanged and still want answers; what has
   changed is that a cloud wake is no longer idle while waiting for them.

## `bundle-gz-kb` still cannot be sampled — twenty-first wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
