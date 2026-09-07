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

Last updated 2026-09-07 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **One iteration recorded**: `Continue · build` (outcome `landed`,
one additional refusal) and **one metric**, `claims=170`. The work landed as
**`0879ec3d`** (item `310.1`), followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`0879ec3d`**, the slice commit — **not** the
working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## Rule 4 is what the next wake reaches, and rule 5 is EVALUABLE again

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   1 / 4 Continue rounds    since 2026-09-07 10:47   ok
Objective     1 / 3 slices [310]       since 2026-09-07 11:48   ok
Optimize      0 wake-date(s) newer     since 2026-09-07 12:59   ok
```

Both counters moved by exactly what this wake did by hand — Standardize `0 -> 1`
for its one Continue round, Objective `0 -> 1` because item `310.1` closed and
Slice 310 is a slice a Continue row names. Nothing anomalous. **Rules 2 and 3 do
not match**, so the next wake falls to **rule 4** unless a P0 or new input
preempts it.

**Rule 5 changed state this wake, and that is the one counter worth reading
carefully.** It has read `STALE` on every hand-off for days, and the instrument's
own instruction is *"record a metric or say the rule could not be evaluated"*.
This wake had a genuine, pairable reading to record: `check:claims` reported
**170** documented behaviours verified live against the series' last sample of
**169** on 2026-09-06. `claims=170` was recorded, and the line now reads `ok`
with `claims 4d 2026-09-06 169 -> 2026-09-07 170 +1`. **Rule 5 was therefore
EVALUATED and does not fire**: the only day-paired name that moved rose, and
rising is the healthy direction for that name (more documented behaviour
verified live, not less). Recording `axe-violations` instead would NOT have
de-staled it — `dispatch_status.py` says outright that a `NEVER MOVED` name
cannot fire this rule, and axe-violations is 0 on every one of its days because
`test:axe` fails above 0.

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, and it ran
against the **previous** revision of this file (32 ids, 1 archived, 4 closed).
Everything it named there was historical or is closed by this wake — `310.1` is
among the four, which is correct, not stale. **The standing note still applies:
saying that an id is being dropped keeps it named**, because the check reads
backticked ids and cannot tell a historical reference from a live claim.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was **green** at the start of this wake. Read the runs after your push;
one `actions/runs?branch=main` read costs nothing and is the only thing standing
between a red `main` and the next wake.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z, 1 comment
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved since the last hand-off**, so it carries
the same single owner triage comment. See Direction.

## What landed this wake — `310.1`, dispatched by rule 4

Rule 1 found no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**);
rule 2 read `0 / 4 ok`; rule 3 read `0 / 3 ok`. Rule 4's oldest still-open item
that a cloud wake can take was **`310.1`**, and every older open item is
owner-, browser- or input-blocked (the breakdown is below, carried and
re-counted rather than re-derived).

**The premise was re-checked before anything was touched and reproduces
exactly** — both commands the item published, re-run at `9a4be080`: the same
four literal lines, and `settings` and `user` among the interpolated module
identities. 4 + 2 = 6.

**The wider measurement is what reframed the item.** Asking what the suite does
ELSEWHERE for the same control found **7** `bo-btn--ghost bo-btn--icon` Refresh
buttons carrying `⟳` against the **3** in `prod/` carrying
`bo-icon bo-icon--settings` on `bo-btn--secondary`. A source grep read **11**
lines; the built suite carries **10** such buttons across its 28 screens — the
eleventh is a `querySelectorAll` string in `audit.mjs`. The rendered artefact
corrected the source count, which is CLAUDE.md's bulk-edit rule arriving in a
measurement. So the three were the only screens off the suite's own convention,
diverging on variant, content and label at once, and `--settings` is a sliders
mark standing in for an action the framework ships no glyph for.

Measured in a browser over the built suite, before and after: **10 buttons, 2
distinct class strings, every box 36x36; afterwards 10 of 10 on one class
string, still 36x36.** `check-markup` moved `4235 -> 4229` bo-* class uses,
which reconciles exactly (3 × `bo-icon` + 3 × `bo-icon--settings`;
`--secondary -> --ghost` is a swap).

**The other three keep their glyph**, with the reason at the code — `_shell.mjs`
above `MODULES` (Production's `settings`, CRM's `user`), `server.mjs` above
`page()` (po-app's `barcode` on Receive). `check-deprecated-icons.mjs`'s SCOPE
section stops calling the question open, which is the half of the Accept that
was about the gate.

**Refused inside the item: a gate over `examples/**`.** Post-change the
exemption map would BE the population, which 94.11's base-rate rule refuses.
The counter-argument — `check-erp-suite.mjs`'s assertion 4, which earned a gate
at a 100% base rate — is answered in the gate header rather than waved off, with
the reopen condition beside it.

## This wake's own two errors, recorded rather than quietly fixed

- **The first draft of both keep-reasons asserted "no shipped alternative is
  free". FALSE.** Counted: 26 shipped glyphs − 4 deprecated − 5 already on the
  suite rail = **17 free**; − 6 on po-app's rail = **16 free**; 12 of each are
  the richtext-toolbar set 137.1 added. It is **`327.3`'s shape exactly** — an
  unmeasured sentence riding beside a measured one, under the measurement's
  credibility — caught on the by-hand adversarial re-read of this wake's own
  diff, which is the practice `327.3` says is not being executed. Both comments
  now carry the count and label the remaining half as the judgement it is.
- **The probe's first output was a false cascade finding.** Under
  `waitUntil: 'load'` the computed background split 4/3 *within* the seven ghost
  buttons — some transparent, some Chrome's UA `rgb(239, 239, 239)`. Two runs
  under `load` disagreed with each other about WHICH pages; two under
  `networkidle0` + 2 rAF agreed exactly. The trap is now a bullet in
  `ENVIRONMENT.md`.

Also found in passing and fixed, because it was in the lines being edited:
`_shell.mjs`'s `MODULES` was headed *"The six modules"* over **seven** entries,
reconciled against the rendered rail (`bo-sidebar-nav__label` occurs 7 times in
`dist/index.html`; `MODULES.length` is 7).

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `9a4be080` both times. No collision.

**Step 0 traps:** trap 1 bit — `git branch --show-current` was **empty** and the
fetch reported a forced update `26447ba...9a4be08`, so the local ref was both
detached and stale. Fixed with `git checkout -B main origin/main` before any
commit. Trap 2 clean in one `--unshallow` (**2,015** commits, no `shallow.lock`),
and it again brought the tags — the **forty-first** consecutive container to do
so; `git tag | wc -l` → **8**. No `git stash` was used at any point this wake.

## The open set is 28 — no P0, and 13 are cloud-takeable

`roadmap_scope.py` at `0879ec3d` reports **28 open / 56 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 310, 315, 316, 319, 320, 322, 323, 324, 325,
326, 327]`. Net from the last hand-off's 29: `310.1` closed and nothing was
filed, so no slice entered or left the OPEN list — Slice 310 stays open on
`310.2`. The raw counts reconcile exactly: `grep -c` reads 28 open / **58**
closed, and 58 = 56 attributed + the 2 `[x]` under the non-slice `## STATE`
heading.

- **cloud-takeable: 13** — `310.2`, `315.3`, `316.1`, `319.3`, `320.2`,
  `322.3`, `323.1`, `324.1`, `324.2`, `325.1`, `325.2`, `326.3`, `327.3`.
  (`297.1` is takeable here too but is counted once, under input-blocked,
  because that is what actually gates it.) **`310.2` is now the oldest of
  these** and is what rule 4 reaches next. Read its Lane line first: it is
  cloud-takeable **in its delete form** — *"deleting all five is a satisfying
  outcome"* — while rendering the five samples adds sections to a built page
  nobody here can look at.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3` — and **`294.2`'s brand-mark half**, counted below under input-blocked
  because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. Neither was re-measured this wake; the previous
  hand-off's measurements stand and are cited as its, not as this wake's:
  `297.1` waits on a filer who is not the owner, `294.2` on the
  `upstream-contribution/` folder reaching a branch.

13 + 10 + 3 + 2 = 28, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the share moved AWAY from its trigger again

Measured at **`0879ec3d`**: **7,120 lines**, closed-history share **26.4%**
(1,880 lines across 5 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Fourth consecutive wake where the two halves disagree.**

**The share FELL again, 26.9% → 26.4%, while the file grew by 119 lines**, and
the mechanism is worth naming so it is not read as a contradiction: the
numerator is **unchanged at 1,880** — this wake's 119 lines all went into Slice
310, which is still OPEN on `310.2`, so none of them enter it. A wake that
reaches for a sweep anyway should read `roadmap_scope.py`'s pin line first — the
newest target, **Slice 309, is pinned by `325.1` and `325.2`** and amended by
`327.1`, so it is not eligible under any reading.

Trend across thirty-six readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% →
26.9% → **26.4%**.

## NOT VERIFIED, said plainly

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**This wake DOES carry a visual debt of its own, and it is new**: the three
`prod/` Refresh buttons change their painted look — a bordered white
`bo-btn--secondary` box becomes a transparent `bo-btn--ghost` one, and the
content changes from an icon mask to the `⟳` character. That is a
rendered-image judgement no measurement here replaces. What IS measured is that
they now match, byte for byte in class and content, the seven the suite already
shipped, at an unchanged 36x36 box. **A local wake should glance at
`/prod/production-orders`, `/prod/capacity` and `/prod/bom`.**

**Gates green on the committed tree:** all **17** CI-runnable entry points,
re-derived from `ci.yml` with the grep `ENVIRONMENT.md` mandates rather than
read off its snapshot — core `build`, core `test` (**165** in 29 files),
`lint:css`, `docs:build` (`check:repo`), `check:claims` (**170** live · 3 NOT
VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (914 containers / 118 pages × 2),
`check:layout` (**127** pages), `check:forced-colors`, `test:axe` (**127 × 2**,
zero violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens, zero axe violations at both widths) — plus
`check:deprecated-icons` and its `--self-test` run directly (8 cases; 33 region
+ glyph assertions), `check:selftests` (54 gates: 20 heuristic, 34 exact), and
the §3b `docs:build` re-run after this file was written.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — each staged diff re-read adversarially.
**That is what caught the false "no alternative is free" sentence above**, which
is a data point for `327.3`: the practice works when it is executed.

**The visual debts carried forward are unchanged and unspent**, and this wake
adds the `prod/` three above: `292.4/292.5`'s screenshot lane on
`/components/icon`, now twenty wakes back; the withdrawn-claim paragraph and
Slice 325's performance paragraph on `/components/data-table`; Slice 319's
paragraph on `/patterns/kanban` at 390px; and `320.3`'s `ApiTable.astro`
`0.5rem` against `ClassRef.astro` `.4rem`. **A local wake should glance at all
five.**

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention; all three are carried from the last
hand-off unchanged, and none was re-measured this wake.**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** Whether a *wake* should post that comment is `297.1`, which
   stays open until someone who is not the owner files something.
2. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Not re-checked this wake.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is now sharper still** — a fourth
consecutive wake where the two halves of the archival trigger DISAGREE (lines
past, share not), so AND and OR give different answers. Still not urgent,
because the newest target is pinned either way.

**`326.3` and `327.3` remain the two a wake could take next without the owner,
and `327.3` gained a data point this wake** rather than an answer: the by-hand
adversarial re-read it says is not being executed WAS executed here, and it
caught exactly the defect shape `327.3` describes, in this wake's own diff,
before it landed. That is evidence for the answer *"the rule is fine, the
practice is the gap, build nothing"* — which `327.3` already names as an
explicitly satisfying outcome, and which would close an item without adding a
word to any rule file.
