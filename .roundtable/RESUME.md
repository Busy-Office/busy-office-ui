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
at hand-off. **Two commits this wake** — Slice 317 and this rewrite — and **one
iteration recorded**, `Continue · build`, outcome **`refused`**, with one
additional refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   2 / 4 Continue rounds  since 2026-09-06 22:53   ok
Objective     2 / 3 slices [298, 300] since 2026-09-06 23:47  ok
Optimize      STALE  (1 wake-date newer)
```

**This wake's row moved BOTH counters, and that is the expected reading for a
`Continue` row that closed a slice** — rule 2 counts Continue rounds (1 → 2),
and rule 3 counts slices closed by `Continue`/`Standardize`/`Polish`, so `300`
joins `298` in its armed set. **Rule 3 is now at `2 / 3`: one more slice closed
by one of those three loops arms an Objective grill.** Nothing here disagreed
with what was written by hand, which is the check that has found two of the five
parser recurrences. **Re-run `dispatch_status.py` rather than trusting these
three lines.**

`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**, so rule 1 does not
match.

**Rule 5 is reported as *could not be evaluated*, never clear.** No metric was
recorded this wake. `306.1` explains why a cloud wake cannot drive that line to
`ok` by recording more; do not try. `bundle-gz-kb` still cannot be sampled
(`259.1`, carried forward, not re-run).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, against the
*previous* revision of this file. It named `300.2` among the closed ids, which
is this wake's own work and is fixed by this rewrite; `312.2`, `298.1` and
`315.2` are historical references and stay.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, triaged as 300.2 — which this wake CLOSED
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2 is now answerable and is NOT closed on GitHub.** No wake has replied
to it. Slice 317 is the answer: the component is refused, and the one gap the
report named that was real is fixed. **Replying and closing it is an owner call
this wake did not take** — see Direction.

## What landed this wake

**Slice 317**, dispatched by **rule 4** (Continue, build mode) on `300.2`, the
oldest item this container can take. Rules 1-3 did not match; rules 5-8 were not
reached. The hand-off's blocked classifications were used as written and none
needed correcting this wake.

**The spike ran, and it refused.** One keyboard-move-plus-announcer core,
applied **unchanged** to two boards whose policies differ — an approval queue
(forward-only, position meaningless) and a service-job board (free movement,
position **is** priority) — both built only from `bo-widget-grid` / `bo-widget`
/ `role="list"`, which is the composition issue #2 reports having written.
Driven with real `page.keyboard` events, never `el.click()`, and paired with a
**control run** in which the core is loaded but never initialised.

`Object.keys(opts)` came back identical for both boards, and every entry is
policy:

| parameter | why it cannot be decided once |
|---|---|
| `canMove` | which transitions are legal is the screen's workflow |
| `announceMove` | the domain noun **and which facts matter** (destination alone vs destination + position) |
| `announceRefusal` | the refusal reason is the workflow rule, in the screen's words |
| `announceReorder` | same, for the within-column axis |
| `positionMeaningful` | **it changes the key map** — `Ctrl+ArrowUp/Down` is live on one board, inert on the other |

**4 of 5 are announcement strings.** So the announcement half of the issue's
proposal — *"the keyboard contract and the live-region announcement decided
once"* — is not achievable at all. Full record, with every reading and the
control column, in `.roundtable/explore-board-kanban-2026-09-07.md`.

**The correction the spike bought is not about a component.**
`/patterns/kanban` already ships (257 lines, full pattern shape) and had
independently reached the spike's own verdict about legal transitions. It was
also asserting the Move menu *"already gives every card a keyboard path, a
screen-reader-announced result, and a touch target that works with gloves"*
while carrying **no live region anywhere** — `grep -cE
'aria-live|role="status"|bo-visually-hidden'` on that page read **0** before
this commit, and the one `check:claims` case covers the popover opening, not any
announcement. `317.1` corrects the clause in place, adds a `move announcement`
row to the Data contract, and adds/extends two States rows. **No `check:claims`
case was added and that is the point** — the fix removes an unexecutable runtime
claim rather than adding one.

**One refusal beside the item, recorded with `--also-refused`:** lifting
`data-grid.ts`'s roving-tabindex navigation out of `<table>`. Base rate measured
first — it serves **one** candidate consumer, a board that does not exist, and
the obvious second is the opposite of one: `bo-calendar` ships no behavior and
its docs page **deliberately refuses** the model. Reopen condition is in the
slice: a second **real** non-table surface wanting two-axis roving navigation.

**One instrument was wrong on its first output, on schedule.**
`Object.keys(api.json)` reads **10** — the file's top-level keys, not its
components; the right accessor gives **40**. Caught by the number being too tidy
against a hand count of the CSS directories, not by review.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented
set differences still hold), plus the §3b re-run of `docs:build` after this file
was written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. The change is prose inside two existing tables and one
existing `<p>`. It was verified against the **rendered artefact** rather than the
diff, on the built page's DOM: `[aria-live]` elements **0** (the string is sample
text inside one `<code>`), `[role="status"]` elements **0**, both new rows
present, the false clause absent. `check:layout`, `check:scroll` and `test:axe`
sweep the page at both widths and are green — which asserts *no overflow, nothing
lost, no axe violation*, not that it looks right. **A local wake should glance at
`/patterns/kanban` at 390px**, where the two new table rows are the only
plausible place for a wrap to look wrong.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
nine wakes back, and the withdrawn-claim paragraph on `/components/data-table`
is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `8f1d43f` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...8f1d43f`). Trap 2
clean in one `--unshallow` (**1,987** commits, no `shallow.lock`), and it again
brought the tags — the **thirtieth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used.

## The open set is 25 — no P0, and 11 are cloud-takeable

`roadmap_scope.py` reports **25 open / 52 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 304, 305, 306, 307, 309, 310, 314, 315,
316]`. Net from the last hand-off's 26: **300.2 closed, 317.1 filed and closed
in the same slice**, so 25, and **Slice 300 left the open set**. **The raw
counts reconcile exactly**: `grep -c` reads 25 open / **54** closed, and 54 = 52
attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 11** — `304.1`, `305.1`, `305.2`, `306.1`, `307.1`,
  `309.5`, `310.1`, `310.2`, `314.2`, `315.3`, `316.1`. (`297.1` is takeable
  here too but is counted once, under input-blocked, because that is what
  actually gates it.) **`304.1` is now the oldest of these** — `300.2`, which
  held that place, closed this wake. **`305.1` carries a caveat, from its own
  Accept**: the four defects close by re-measuring ink extents and inter-block
  gaps, which is geometry and squarely in `ENVIRONMENT.md`'s *can* list — but it
  sits inside a Gauntlet whose scoring wants a blind critic, so a wake without
  one closes the measurement half and must say so rather than claiming the
  round. **`309.5`, `310.2`, `314.2`, `315.3` and `316.1` are the cheapest**:
  `309.5` is a script plus a start command and its Accept lets *refusing to
  commit a probe* close it; `310.2` closes by deleting five unused consts;
  `314.2` is filed with its base rates already measured; `315.3`'s Accept says
  outright that **refusing is a satisfying outcome** and names the
  re-measurement that must precede either answer (re-run the per-gate
  `--self-test` sweep **with `dist` built**, reading each gate's raw output
  rather than grepping one format); `316.1` likewise names refusal as satisfying
  and carries its own base-rate command.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do not
  re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2`** needs
  the owner to land the `upstream-contribution/` folder on a branch before any
  wake can rank the six proposals; recorded in the item itself since Slice 316,
  not re-derived here.

11 + 10 + 2 + 2 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this list
— the 25 lines it prints are exactly the ones named above. (The owner-blocked
bullet names 11 ids; `294.2` is one of them and is counted under input-blocked,
so the arithmetic uses 10.)

## No archive sweep — declined on the SHARE half, seventh wake running

Measured on the working tree after Slice 317 was written (`roadmap_scope.py`):
**6,905 lines**, closed-history share **34.5%** (2,385 lines across 12 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last six wakes made, at 26.9%, 30.5%, 29.5%, 28.9%, 31.2% and now this.

**It went UP again, and for the same reason as last wake, twice over.** 31.2% →
34.5% with nothing archived: Slices 300 and 317 both closed, so their lines
moved from the open side of the ratio to the closed side. **Two consecutive
rises now, both caused by slices closing**, after two falls caused by a growing
denominator — the trigger's share half is moved by the loop's ordinary work in
both directions, which is the argument `249.12` needs and which no amount of
waiting resolves.

Trend across twenty-five readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → **34.5%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **7 targets are named by a
still-open item** now. That leaves **317, 313, 311, 308, 303, 302, 301** and
**300** — a bulk edit, and CLAUDE.md's rule says it is verified against the
rendered artefact one slice at a time. It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, now answered by Slice 317 but not replied to;
discussions **0** open).

**Four things want the owner's attention:**

1. **Issue #2 has an answer and nobody has told the reporter.** Slice 317
   refuses the component, with the measurement, and fixes the one gap they named
   that was real. The report was good — it found a genuine false accessibility
   claim on a shipped page by reasoning from an absence. **Replying and closing
   the issue is a thirty-second owner action**, and `LOOPS.md` Step 1 says an
   issue "gets closed with a comment linking the fixing commit once its item
   ships". No wake has posted a comment to this repo's issues; whether a wake
   *should* is `297.1`, still open, and this is the second issue to reach that
   question.
2. **`249.12` — the archival trigger — is the same owner call as the last six
   wakes, and this wake strengthens the argument again.** The share half has now
   moved **down twice** and **up twice** with nothing ever archived. A trigger
   whose two halves disagree, and whose share half is pushed both ways by
   ordinary work, cannot be satisfied by waiting. Nothing states whether the
   trigger is an AND or an OR. A wake declining a sweep on that ambiguity seven
   times is the signal that the trigger needs deciding, not that the sweep needs
   doing.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
