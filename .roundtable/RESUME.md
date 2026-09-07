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
at hand-off. **Two commits this wake** — Slice 316 and this rewrite — and **one
iteration recorded**, `Continue · build`, with one refusal.

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
Standardize   1 / 4 Continue rounds  since 2026-09-06 22:53   ok
Objective     1 / 3 slices [298]     since 2026-09-06 23:47   ok
Optimize      STALE  (1 wake-date newer)
```

**This wake's row moved BOTH counters, and that is the expected reading for a
`Continue` row that closed a slice** — rule 2 counts Continue rounds (0 → 1),
and rule 3 counts slices closed by `Continue`/`Standardize`/`Polish`, so `298`
is now named in its armed set. Nothing here disagreed with what was written by
hand, which is the check that has found two of the five parser recurrences.
**Re-run `dispatch_status.py` rather than trusting these three lines.**

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
*previous* revision of this file. It named `298.1` among the closed ids, which
is this wake's own work and is fixed by this rewrite. The charter check and
`--verify-stamps` were silent.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

`gh` is still absent and the Discussions GraphQL route still refused, so the
REST substitute was used, with both controls in the same run:

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, already triaged as 300.2
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof ENVIRONMENT.md §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

## What landed this wake

**Slice 316**, dispatched by **rule 4** (Continue, build mode). Rules 1-3 did
not match; rules 5-8 were not reached.

**The pick corrected a classification eleven hand-offs had carried.** Rule 4
wants the oldest still-open item. `294.2` is the first the hand-offs called
cloud-takeable, and **no wake in this container can take it**: the six proposals
it ranks live in an owner-supplied `busyofficeui_Design_System.zip`, and the
`upstream-contribution/` folder is correctly absent from this repo
(`git ls-files | grep -i contribution` → nothing; Slice 298's grill records the
absence as correct). Ranking six proposals nobody here can read would be
inventing verdicts. **`294.2` is INPUT-BLOCKED** — the fourth kind, same as
`297.1` — and that is now recorded **in the item itself**, not only here, so it
stops being re-derived. The next oldest takeable item is `298.1`, which ran.

**`298.1` closed by its FIRST branch, which is not the branch it expected.**
Its premise — *"there is now exactly one precedent to point at"* — is false.
Enumerated rather than recalled: on **images** the count really is 1
(`favicon.svg` declares 0 `font-size`; `list-report-compact.png` photographs a
docs page so its type comes from the component scale; `gen-og-card.mjs` is the
only `screenshot(` call in the repo). **The second artifact is not an image** —
`packages/core/src/css/print/index.css`, in the tree since the initial commit
`4ef554fa` (2026-08-12) against the card's `605829ca` (2026-09-06), **25 days
earlier**, same shape: dimensions from the medium (`@page { margin: 1.6cm }`),
display type outside the rem screen scale (`10pt`).

**The two agree, and the half nobody had written down is the load-bearing one.**
Measured under print emulation on the built site, with the light/dark control
the probe must pass to be reading the theme at all:

| reading | value | on white paper |
|---|---|---|
| `matchMedia('print').matches` | `true` | body `13.3333px` = 10pt |
| `--bo-color-text-muted`, light | `rgb(75,85,99)` | 7.56:1 |
| `--bo-color-text-muted`, **DARK** | `rgb(156,163,175)` | **2.54:1** — below AA |
| shipped literal `#555`, both themes | `rgb(85,85,85)` | 7.46:1 |
| control: light ≠ dark token reading | `true` | — |

So a token there is a contrast regression for anyone printing from the dark
theme, not a tidy-up. **The convention holds at 11 of 11**: every colour
declaration inside `@media print` in the shipped CSS is a literal, 0 tokens,
across 6 files (`approval-workflow`, `badge`, `data-table`, `stepper`,
`print/index.css`, `reset/index.css`).

**Shipped small, deliberately** — the item's own warning is that it exists so
the question is asked once, not so a convention is manufactured, and half of it
was already DESIGN.md unit-doctrine rule 6:

- DESIGN.md gains **unit-doctrine rule 7**, written from both precedents.
- The `#555` site gains the reason it never had — the one literal whose value
  is load-bearing was the one with no explanation.
- `gen-og-card.mjs` is **unchanged**; nothing about it was wrong.

**`316.1` filed, not built — this wake's refusal.** Whether a gate should forbid
a theme token in a `@media print` colour declaration. Base rate measured first:
the predicate is true of **0 of 11** such declarations today. That is 94.11's
rule pointing the other way from its worked example (uniformly *false*, not
uniformly true), and unlike that refused gate this one is an **exact** membership
test rather than a semantic one, so it can go red. Its Accept says refusing is a
satisfying outcome and names the likeliest reason — a blanket ban is wrong for a
fill whose colour IS content (`print-color-adjust: exact` markers).

**Two amendments in place, per 236.2:**

- **Slice 298's *"seven display font sizes are literals"* is unreproducible; the
  verdict is unchanged.** The file has never held seven: **4** `font-size`
  literals at both of its commits and at `HEAD`, **8** raw rem literals, **7
  distinct** rem values — the seven is recoverable only by counting `.dot`'s box
  size and two paddings as font sizes. The missing half was the command. Same
  shape as `315.2`, one slice earlier.
- **`294.2`'s blocked kind**, above.

**Gates green on the committed tree:** all **17** cloud-runnable entry points
(`ENVIRONMENT.md`'s derived list), plus the §3b re-run of `docs:build` after
this file was written.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. The one CSS change is **comment-only**, and that was proved
on the SHIPPED artifact rather than the diff: `dist/css/index.css` keeps
comments, so it is **not** byte-identical, but comment-stripped it is —
md5 `caa23279b85b26b6c58105c4c63775a7` before and after. Asserting on the
stripped form, per the Slice 49/50/53.1 rule.
**`292.4/292.5`'s screenshot lane on `/components/icon` remains unspent**, now
eight wakes back, and the withdrawn-claim paragraph on `/components/data-table`
is still unlooked-at.

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `f26af8f` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...f26af8f`). Trap 2
clean in one `--unshallow` (**1,985** commits, no `shallow.lock`), and it again
brought the tags — the **twenty-ninth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used — the
before/after CSS comparison extracted `git show HEAD:<file>` over the live file
and restored it, per `ENVIRONMENT.md`'s stash rule.

## The open set is 26 — no P0, and 12 are cloud-takeable

`roadmap_scope.py` reports **26 open / 50 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 300, 304, 305, 306, 307, 309, 310, 314, 315,
316]`. Net from the last hand-off's 26: **298.1 closed, 316.1 filed**, so 26
again, and **Slice 298 left the open set**. **The raw counts reconcile exactly**:
`grep -c` reads 26 open / **52** closed, and 52 = 50 attributed + the 2 `[x]`
under the non-slice `## STATE` heading.

- **cloud-takeable: 12** — `300.2`, `304.1`, `305.1`, `305.2`, `306.1`,
  `307.1`, `309.5`, `310.1`, `310.2`, `314.2`, `315.3`, `316.1`. (`297.1` is
  takeable here too but is counted once, under input-blocked, because that is
  what actually gates it.) **`300.2` is now the oldest of these.** **`305.1`
  carries a caveat, from its own Accept**: the four defects close by re-measuring
  ink extents and inter-block gaps, which is geometry and squarely in
  `ENVIRONMENT.md`'s *can* list — but it sits inside a Gauntlet whose scoring
  wants a blind critic, so a wake without one closes the measurement half and
  must say so rather than claiming the round. **`309.5`, `310.2`, `314.2`,
  `315.3` and `316.1` are the cheapest**: `309.5` is a script plus a start
  command and its Accept lets *refusing to commit a probe* close it; `310.2`
  closes by deleting five unused consts; `314.2` is filed with its base rates
  already measured; `315.3`'s Accept says outright that **refusing is a
  satisfying outcome** and names the re-measurement that must precede either
  answer (re-run the per-gate `--self-test` sweep **with `dist` built**, reading
  each gate's raw output rather than grepping one format); `316.1` likewise
  names refusal as satisfying and carries its own base-rate command.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`. **`249.6` was declined at the clause level four times. Do not
  re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2` is new
  to this bucket this wake** (see above); it needs the owner to land the
  contribution folder on a branch before any wake can rank it.

12 + 10 + 2 + 2 = 26, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md` rather than against this list
— the 26 lines it prints are exactly the ones named above. (The owner-blocked
bullet names 11 ids; `294.2` is one of them and is counted under input-blocked,
so the arithmetic uses 10.)

## No archive sweep — declined on the SHARE half, sixth wake running

Measured on the working tree after Slice 316 was written (`roadmap_scope.py`):
**6,713 lines**, closed-history share **31.2%** (2,096 lines across 10 closed
slices). The standing trigger the hand-offs carry is *"past 5,450 lines /
40.6%"*: the line half is past, the share half is not — the same judgement the
last five wakes made, at 26.0%, 26.9%, 30.5%, 29.5% and 28.9%.

**It went UP this wake, and for the mirror-image reason the last two fell.**
28.9% → 31.2% with nothing archived: Slice 298 closed, so its 204 lines moved
from the open side of the ratio to the closed side. Two consecutive falls caused
by a growing denominator, then a rise caused by a slice closing — the trigger's
share half is moved by the loop's ordinary work in both directions, which is the
argument `249.12` needs and which no amount of waiting resolves.

Trend across twenty-four readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → **31.2%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **7 targets are named by a
still-open item** now. That leaves **313, 311, 308, 303, 302, 301** and the
newly-eligible **298** — a bulk edit, and CLAUDE.md's rule says it is verified
against the rendered artefact one slice at a time. It is a wake's work, not a
tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, already triaged; discussions **0** open).

**Four things want the owner's attention:**

1. **`294.2` cannot be advanced by anyone but the owner, and that is new
   information.** For eleven hand-offs it was the oldest item the loop believed
   it could take. It cannot: the material is in a zip that never reached the
   repo. **Landing `upstream-contribution/` on a branch is a one-command
   unblock** and would hand the loop its oldest genuinely-takeable item back.
2. **`249.12` — the archival trigger — is the same owner call as the last five
   wakes, and this wake produced the reading that completes the argument.** The
   share half has now moved **down twice** (denominator growth) and **up once**
   (a slice closing) with nothing ever archived. A trigger whose two halves
   disagree, and whose share half is pushed both ways by ordinary work, cannot
   be satisfied by waiting. Nothing states whether the trigger is an AND or an
   OR. A wake declining a sweep on that ambiguity six times is the signal that
   the trigger needs deciding, not that the sweep needs doing.
3. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
4. **The CI cost `312.2` accepted is unchanged and unmeasured this wake.** Slice
   313 measured 9 of the last 30 commits and 38 of the last 100 touching only
   `.roundtable/**`-shaped paths, at ~14.7 machine-minutes a run, and proposed a
   cheap second workflow — refused there because it needs a hand-kept list of
   which gates are repo-wide. Carried forward as the owner's call, **not
   re-measured here**, so treat those figures as Slice 313's.
