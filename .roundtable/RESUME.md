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

Last updated 2026-09-09 (**cloud** wake, scheduled routine). Working tree clean
at hand-off apart from this file, `loop-log.md`, `INDEX.md` and `STATUS.md`.
**No collision this wake** — `origin/main` read `2276e946` at Step 0 and again at
the mandated pre-commit fetch; it was the local tip both times.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. Run
it again against this file as it now stands. Every closed id named below is
named as history or as precedent, never as open work: `338.1` (the item THIS
wake closed), `298.1` and `316.1` (the two slices whose figures 338.1 was filed
on, both re-measured here), `320.3` (named only as an example of the
screenshot-blocked lane), `249.12` (an open item, and named as one). **Nothing
here claims an open item that is not.**

**One reconciliation worth keeping**, because two instruments disagreed and both
are right: `check:resume-slice-ids` reported *25 open / **116** closed* while
`roadmap_scope.py` reported *25 open / **114** closed*. The difference is
exactly `roadmap_scope.py`'s own last line — **2 items under a non-slice
heading**, which it excludes from every figure and the other counts. 114 + 2 =
116. Do not "fix" either.

## ⚠ WHICH RULE FIRES NEXT — rule 2, Standardize, and it is OVERDUE

`dispatch_status.py`, read immediately after this wake's recording (`LOOPS.md`
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   4 / 4 Continue rounds   OVERDUE     ← THIS wake's Continue row crossed it
Objective     1 / 3 slices            ok    [338]
Optimize      0 wake-date(s) newer    ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 25 open items). **Rule 2 matches, so the
next wake runs the Standardize playbook, not rule 4.** Run all four lanes with
`python3 scripts/loops/standardize_lanes.py` (export `CHROME_PATH` first,
`ENVIRONMENT.md` §1c) and **quote a figure that each lane itself printed** —
that wrapper is what Slice 367 landed, and a lane with no figure beside it is
one you cannot claim to have run. Say `n of 4`.

**The arming label reads `[338]`, and that is an ITEM id, not a slice number.**
`LOOPS.md` §6 step 0 carries the resolution rule; the slice that closed `338.1`
is **369**. **Measured this wake over the last 12 Continue/Standardize rows**,
mapping each row's sha to the slice number in its own commit subject rather than
carrying the previous hand-off's ordinal:

```
327/354  356/356  (no label)/357  330/358  331/360  332/361
333/362  341/363  334/365  336/366  337/367  338/369
```

Ten of the twelve differ; `356/356` is a **coincidence** (the item id happened to
equal the slice number) and 357's row carries no label at all. Counting back
from this wake's row, **nine consecutive labelled rows** exhibit the behaviour.
No parser item is filed — sixth of its kind, refused on `355.3`, `359.4` and
`LOOPS.md`'s own conclusion.

## What landed: Slice 369 — `338.1` refused on its named instance

**Dispatched by rule 4** on the oldest genuinely dispatchable open item.
Everything older was re-derived as blocked from each item's own text, not from
the previous hand-off's list.

**The named instance is refuted.** `.bo-timeline__marker` prints at **5.66:1**
at worst — eight readings, two themes, four states — not the filed 2.54:1.
`print/index.css` gives it `print-color-adjust: exact`, so the glyph sits on its
own kept disc and never meets white paper. The 2.54:1 was that token against
*white*, which is not the backdrop it has.

**The gap itself is real and framework-wide, which the gate header called
"narrow".** Over all 128 built pages in the dark theme, **19,511 of 26,817**
text fills actually painted to PDF are below 4.5:1 on white, on **125 of 128**
pages.

**The finding worth carrying forward is about the INSTRUMENT.**
`print-color-adjust: economy` (the default) does not merely drop backgrounds —
it **darkens light text** when it drops them. rgb(249,250,251) is painted
rgb(166,166,167), so the real ratio is 2.43:1 and not the computed 1.05:1; and
`--bo-color-accent` is painted rgb(27,128,115), which **PASSES at 4.79:1** while
its computed value fails at 1.86:1. So the instrument 338.1's own Accept
prescribed — *"a computed-style reading under print emulation is the right
one"* — is **wrong for any ratio**, and a gate built on it would accuse correct
code. It is still right for the structural question (does this element's own
colour survive the print reset). **This is in `ENVIRONMENT.md`, not here**, with
the two parsing traps, because it generalises and this file is rewritten every
wake.

## A defect in this wake's OWN work, caught by the base rate before publishing

The first pass reported **75,437 of 75,546** below AA — a 99.86% that CLAUDE.md
says to treat as a defect in the instrument until proven otherwise, and it was
one. `getComputedStyle(el).display` does **not** walk ancestors, so every label
inside a `@media print { … display: none }` subtree counted as visible; the docs
sidebar alone contributed 27,643. Fixed with `el.checkVisibility()` plus a
non-empty `getClientRects()`, and red-proved **both ways**: an injected
`color: var(--bo-color-text-muted)` paragraph moved the counts `797 → 798` and
`793 → 794` and appeared at exactly 2.54:1, while `.bo-sidebar-nav__label` reads
`display: block` for itself and `checkVisibility() === false`.

**A second one, and it is the shape this repo names most often.** All seven PDF
cases came back `absent` — an identical value across every input, in both arms.
The stream parser was fine; the fill matcher built `0.08\d*` from
`(n/255).toFixed(2)` while Chrome writes **leading-dot floats** (`.0784`). It
could not have matched anything, and it looked exactly like a clean negative.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: `git diff
--stat` was read, and the diff is `ROADMAP.md`, `.roundtable/ENVIRONMENT.md`,
one gate's **header comment** and one **CSS comment**. **No CSS rule, no docs
page, no `.astro` file, no generated artefact, no shipped JS.**

**The one risk that comment carried was measured, not reasoned about.**
`derive-floor.mjs` tests `/print-color-adjust\s*:/` against the built CSS, and
the new comment contains that string — the classic "assertion tripped by its own
explanation". Checked comment-stripped: the string does **not** survive
stripping, and **6** real declarations do, so the derived floor cannot move.
`check-print-tokens` parses with postcss and reported the same **14** across
**6 of 74** stylesheets as before.

**The eight older debts are unchanged and unspent**, counted from the previous
hand-off's enumeration rather than carried as a number: Slice 352's two
(`/components/data-table`'s performance table and `/concepts/scale`'s scaling
table, both at 1440 and 390 in both themes); Slice 345's two
(`/patterns/output-form` **in print** and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths); and the four older —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run in this container**, the list
re-derived from `ci.yml` rather than trusted, every one green. Figures read off
their own output: core `build` (incl. `check:package` **185** files), core
`test`, `lint:css`, `docs:build`, `check:claims` (**176** live, **3 NOT
VERIFIED**, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll`, `check:layout` (**128** pages),
`check:forced-colors`, `test:axe` (**128** pages × 2 widths, **zero**
violations), `check:target-size` (7 pages × 3 densities), `check:search`,
`check:pseudo` (14 pages × 2 widths), `check:quickstart`, `check:po-app`,
`check -w create-ui`, `npm run suite` (28 screens × 2 widths). The touched
gate's own `--self-test` was run separately: **12 cases**, passed.

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push. It gates `.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It is what
raised the `derive-floor.mjs` question above**, which was then measured rather
than argued.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing recorded, deliberately** — the same call the previous wake made, for
  the same measured reason.
- **`gates`** — unchanged at **56**; this wake added no gate and refused one
  (widening `check:print-tokens`) on the measurement.
- **`claims`** — read **176** live, identical to the sample already in the pair.
  A same-value sample moves nothing.
- **`dispatch-region-words`** — **`LOOPS.md` was not touched this wake**, so it
  cannot have moved; not re-sampled.
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.
- **The printed-below-AA figure was NOT recorded as a metric**, and that is a
  choice: rule 5 compares two runs on distinct days, and 39 of 47 names already
  have only one day. A name nothing will sample again adds to that pile rather
  than to the rule's input.

## The open set is 25 — no P0

`roadmap_scope.py` at the slice commit and the raw checkbox count agree at
**25**. Slice 369 closed one item (`338.1`) and opened two (`369.1`, `369.2`),
so the set is +1 on the previous hand-off's 24.

- **cloud-takeable: 12** — `339.2`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`,
  `351.1`, `352.1`, `352.2`, `353.2`, `362.1`, **`369.2`**. `339.2` is now the
  oldest of these; **but rule 2 fires before rule 4 next wake**, so a wake
  should run the Standardize sweep first. `362.1` carries Slice 364's amendment
  on the `include`; Slices 365-369 did not touch it.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, and the **403** was re-confirmed by
  measurement in Slice 366. A local wake can take it. **Not re-derived this
  wake** — the previous hand-off asks a wake reaching this item to record the
  fall-through rather than re-derive the 403, and rule 4 did not reach it.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (holds its remaining rows for `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**),
  **`369.1`** (new — a palette-wide print behaviour change with a visible
  result).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

12 + 1 + 11 + 1 = 25, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step
1 committed nothing. **Issue #2's `updated_at` is the same value the previous
two hand-offs recorded.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 24 open items at Step 0. Rule 2 read `Standardize 3 / 4 ok` **at Step 0**
and did not match — it crossed to 4/4 only when this wake's own Continue row was
recorded, which is why it fires next and did not fire now. Rule 3 read
`Objective 0 / 3 ok` (reset by Slice 368) and did not match. **Rule 4 matched.**
Rule 5 was **EVALUATED, not skipped**, even though rule 4 fires above it: its
movers were `gates` (+1), `dispatch-region-words` (+60) and `claims` (+7), none
a regression on two consecutive runs. Rules 6-8 were not reached, so
`polish_requeue.py --apply` was correctly NOT run.

## ⚠ The archive sweep: 59.6% — and it FELL this wake, which is worth saying

```
python3 scripts/loops/roadmap_scope.py
  8381 / 14062 = 59.6%    (this wake's slice commit)
  8256 / 13836 = 59.7%    (previous wake's tip, for the trend)
```

**The share went DOWN 0.1pp, and no history was archived to make that happen.**
Slice 369 added 226 live lines that are almost entirely OPEN content (a slice
entry plus two new items), so the denominator grew faster than the numerator.
**This is the ratio-versus-denominator caveat `LOOPS-archive.md` already
carries, arriving as a live reading** — a fall in this number is not progress
against the backlog and must not be read as one. The previous hand-off's "six
consecutive rises" is now broken; do not carry that phrase forward.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 59.6% is still
**4.5pp above** the level the tenth was dispatched at and **2.9pp above** the
eleventh's.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
4's build end to end. **`249.12` is named again** — the open **OWNER OR
ARCHITECTURE CALL** on the archival trigger. **11 targets are NAMED by a
still-open item** (`roadmap_scope.py` lists them) and must be read before moving
(236.2). Slice 368's cost — every archived slice leaves a heading-plus-pointer
stub that an enumeration can read instead of the body — is unchanged and still
belongs in that decision.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit.** `git branch --show-current` answered **EMPTY** at Step 0 — the
container arrived detached at `2276e946` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,106**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**). **No
streak ordinal is carried forward**: §2 asks for the count.

**No `git worktree` and no `git stash` were used this wake.** The three probes
(the computed-style walk, the PDF fill sweep and the 2×2) lived in the
scratchpad and never in the repo; nothing was written into the tracked tree by
any of them, and `git status` showed only the four intended files throughout.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Five things want the owner's attention:**

1. **`369.1` is new and is the biggest of them.** Printing a screen from the
   dark theme puts **19,511 of 26,817** painted text fills below AA on paper,
   across **125 of 128** pages. Chrome's economy mode is what keeps that from
   being far worse, and it is a **UA behaviour no other engine is known to
   share** — Firefox is not known to darken text this way, so this reading is a
   floor for Chrome and says nothing about the others. The proportionate fix is
   one `@media print` block re-pointing the theme tokens at their light values,
   which is a deliberate exception to `check:print-tokens`'s own rule and so is
   the owner's to make.
2. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Wake after wake has declined a sweep for want
   of the trigger this item would supply. **This wake adds a reading that argues
   the other way from the usual one:** the share FELL, without any archiving,
   because a normal slice's own text grew the denominator. A trigger phrased as
   a percentage will move for reasons that have nothing to do with how much
   closed history the file carries.
4. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
5. **`335.1` cannot be settled by any cloud wake.** A local wake can do it in
   one command, or the owner can file a throwaway Q&A discussion and let the
   next wake read it.

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages.

**`ENVIRONMENT.md` grew by 19 lines this wake** (the paper-measurement entry).
The previous hand-off flagged that the file has no size discipline and no open
item asking for one — `332.1` closed on the finding that it is long because the
environment is hostile. That is still true and this is still the first thing to
weigh if the owner wants that discipline; **if so it needs filing as its own
item**, and no wake should infer it from a closed one.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` and
`LOOPS.md` are **byte-for-byte unchanged**, so the dispatch region a wake reads
every wake is unmoved at **7,552** words.
