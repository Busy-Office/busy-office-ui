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
at hand-off. Three commits this wake: Slice 302 (triage), `292.7`, and this
hand-off. Two iterations recorded — `Roadmap · triage` and `Continue · build` —
carrying three refusals between them.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 is OVERDUE — expect an Objective grill of 292, 300, 301

Read immediately after recording this wake's rows, which is the comparison
`LOOPS.md` mandates — and it is what moved:

```
Standardize   1 / 4 Continue round   since 2026-09-06 23:20   ok
Objective     3 / 3 slices           since 2026-09-06 15:05   OVERDUE  [292, 300, 301]
Optimize      3 wake-date(s) newer   since 2026-09-03 09:54   STALE
```

**Rule 3 crossed on this wake's own Continue row.** It read `2 / 3 [300, 301]`
at Step 0b and `3 / 3 [292, 300, 301]` after recording — `292.7` closing is the
third. That is the counter comparison landing for real rather than as a
formality, so the next wake should reach **rule 3**, not rule 4.

Rule 5 read **STALE** and is reported as *could not be evaluated*, never clear.
`bundle-gz-kb` still cannot be sampled (259.1's finding, carried forward, not
re-run this wake). Do not "fix" it by recording a guess.

**`polish_requeue.py --apply` did NOT run this wake** — `LOOPS.md` §3b step 0
is only owed once rule 6 is reached, and rules 3/4 matched first. It was not
run in any mode, so no stamp reading from this wake exists to quote.

## Step 1 ran BOTH intakes for the first time — and the second one had to be repaired to do it

Slice 297 made both intakes mandatory; the previous wake reported it could not
read Discussions and put that down to the rule landing mid-wake. **That was
half the reason.** This wake reached Step 1 with the rule already in place and
still could not run it: there is no `gh` in the container, and the GraphQL
endpoint the documented command needs is refused for this session outright.

Fixed rather than worked around, as Slice **302**:

- `ENVIRONMENT.md` **§8** carries the REST substitute that works here, plus the
  two controls that make its answer mean something (a `404` on an unserved
  route, so `200 []` is not "wrong route"; a known-content list route, so `len`
  is known to track content) and **the red-proof still owed** — nothing has
  ever been filed in this repo's Discussions, so that route has never been
  observed returning a non-empty list.
- `LOOPS.md` Step 1 now states the requirement as the property — *each intake
  produces a count this wake, or the wake says which one it could not read and
  why* — instead of as two `gh` commands.

**This wake's readings: issues 1 open (#2, already triaged as `300.2`),
discussions 0 open. No new untriaged input.**

## What landed this wake

**Slice 302** (triage, above) and **`292.7`** (rule 4, Continue/build — the
oldest cloud-takeable item, exactly as the last hand-off predicted).

`292.7`'s finding **reproduces and its neighbouring sentence does not**, which
is the part worth carrying:

- The four off-scope `content` cites it names — `amount`, `breadcrumb`, `tabs`,
  `dialog` — are exactly the classifier's `neither` bucket. Rewritten to quote
  the opener's wrong-choice clause; `neither` **4 → 0**, `page` **33 → 37**.
- Its claim that `form` and `prose` are *"the other two non-page cites"* does
  **not** reproduce: both classify page-side once `EXEMPT` /
  `check:wrong-choice` count as page-side signals. The tell that the older
  lexicon was the inconsistent one is **`button`** — the third EXEMPT
  component, same shape of cite — which 292.7 never mentions.
- Three cites it does not mention (`money`, `quantity`, `richtext`) classify
  `both` and each already opens *"the opener says…"*. **Recorded adequate, not
  rewritten**, which its own Accept names as a satisfying outcome.

The classifier is a reconstruction (292.3 left no script) and is in the
scratchpad, not the repo — deliberately, since 292.3 refused a gate over this
property and this run is evidence for that refusal, not against it.

**Gates green on the pushed tree** (`94bdb34d` + this work): core `build`,
`test` (**165**), `lint:css`, `docs:build` (`check:repo` incl. `slice-refs`
**891**, `page-shape` **127** pages, `wrong-choice` **156**, `dsa-scores`
**362**), `check:claims` (**167** live), `check:formatting`, `check:scroll`
(**914**), `check:layout` (**127**), `check:forced-colors`, `test:axe`
(**127 x 2**), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check -w @busy-office/create-ui`. The *"3 NOT VERIFIED"*
in `check:claims` is `ENVIRONMENT.md` 6b (this container reports
`(pointer: fine) = false`), not a regression. **Re-run after the rebase**, not
only before it — the relicense touched `package.json` and both READMEs, which
several of these assert.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a
cloud wake has no Podman. `292.7` changed **four strings inside an existing
rendered table**; the property that could break (overflow at 390 and 1440) is
asserted by `check:layout` across all 127 pages, and the rewrite was verified
against the **rendered** artefact — each of the four built pages carries the
clause twice (opener + Content row), the old cite text zero times, and a
control page zero times. What no gate covers is *"does it look right"*, and
that is not claimed. **292.4/292.5's screenshot lane on `/components/icon`
remains unspent**; a local wake's glance still closes it cheaply.

## `origin/main` moved ONCE under this wake — and it was not a collision

Caught by the `git fetch origin main` Step 0c mandates before a commit:

```
384e6a8b..94bdb34d   Relicense MIT -> Apache-2.0 (owner)
```

**No item and no number collision** — it touches licence files,
`package.json`s and READMEs, and nothing in `ROADMAP.md`. Rebased clean, both
commits replayed, and the full gate set re-run on the combined tree rather than
on the pre-rebase one.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...384e6a8`).
Trap 2 clean in one `--unshallow` (**1,958** commits, no `shallow.lock`), and
it again brought the tags — the **twentieth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite.

## The open set is 21 — and 7 are cloud-takeable

`roadmap_scope.py` reports **21 open / 31 closed**, OPEN slices
`[15, 112, 249, 273, 292, 294, 296, 297, 298, 300]`. Net from the last
hand-off's 21: `+300.2` (issue #2, triaged by the other dispatcher),
`-292.7` (closed here), `+302.1` opened and closed inside this wake.
`check-resume-slice-ids` reports a different closed count — it also counts the
2 `[x]` items under the non-slice `## STATE` heading. **Do not quote a bare
closed count.**

- **cloud-takeable: 7** — `292.8`, `292.9`, `294.1`, `294.2`, `296.2`,
  `298.1`, and **`300.2`**. **`294.1`/`294.2` have now gone three hand-offs
  classified from Slice 294's triage text rather than from their own bodies** —
  said plainly; `294.2` says the brand mark inside it is an owner call, so read
  it before dispatching. **`300.2` is listed here with a caveat, classified
  from its own Accept this wake**: it asks for an Explore *spike*, and the
  question it must answer (can the keyboard contract and the live-region
  announcement be decided once?) is DOM- and accessibility-tree-assertable,
  which `ENVIRONMENT.md` puts squarely in a cloud wake's *can* list. Any
  judgement about **drop-target styling** is not, so a cloud spike answers the
  contract half and must say so rather than claiming the whole. A refusal
  closes it, provided it records what was measured.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `296.1`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (1): `297.1`** — the **fourth kind** `LOOPS.md` 186.2's three
  do not cover. Its Accept requires *"one wake reports on a real filed item"*.
  **Note this is now closer than it was**: issue #2 is a real filed item that
  reached triage, so the next wake should re-read `297.1` against it rather
  than carrying the classification forward — this hand-off did not, because
  rule 3 is overdue and the item is not next in line either way.

7 + 10 + 3 + 1 = 21, asserted rather than left to the reader.

Rule 4's oldest cloud-takeable item is **`292.8`** — but rule 3 sits above it
and is overdue, so rule 4 is unlikely to be reached next wake.

## No archive sweep — and for the first time in fifteen readings, NEITHER half of the trigger is past

Measured on the **committed** tree (`roadmap_scope.py`): **4,878 lines**,
closed-history share **9.4%**. The standing trigger the last ten hand-offs
carry is *"past 5,450 lines / 40.6%"* — **both are now under it**, because
Slice 301 ran the eleventh sweep and moved 37.1% → 7.2%.

Trend across fifteen readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → **9.4%**.

The three previous hand-offs recorded the share moving for reasons unrelated to
the tree's health, and argued that made it a poor unit. **This reading does not
settle that argument in either direction** — it is a step change from a sweep,
which is the one thing the share is supposed to track. It goes back to being
evidence when it has drifted for a few wakes without one. Said explicitly
because quoting a post-sweep low as if it refuted the instrument would be the
same error one sign over.

No sweep run.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open) — the first
wake able to say that, and Slice 302 is what made it sayable.

**Three things want the owner's attention:**

1. **A mandated step existed for a full day that no cloud wake could execute,
   and the wake that met it recorded the symptom rather than the cause.**
   Slice 302 fixed it. The general shape is worth their eye: `LOOPS.md` already
   says *a gate that cannot run must fail loudly, never skip quietly*, and the
   rule that broke it was written in the same file eight hours earlier. A rule
   added in one environment is not known to run in another — the same lesson
   `ENVIRONMENT.md` §1c and the `check:formatting` CI incident already carry,
   arriving this time in the dispatcher itself.

2. **`249.12` remains the standing owner call on the archive trigger**, and
   this wake is the first in six that does NOT add evidence for it — Slice 301
   swept, so the share moved for the right reason. Its own roadmap text still
   calls it *"low urgency, the sweep keeps happening regardless"*, which this
   wake is consistent with. The five wakes of contrary evidence stand.

3. **`273.2` is the owner call still worth their attention**, a twenty-fourth
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
