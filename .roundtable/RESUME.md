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
two additional refusals). The work landed as **`a6e7fff6`** (Slice 323),
followed by this hand-off's own commit. Read `git log a6e7fff6~1..` for the
exact set.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken `--rev a6e7fff6`, the slice commit — **not** the
working tree and **not** `HEAD`, which is `ENVIRONMENT.md`'s figure rule and the
one two consecutive wakes broke from the `HEAD` side.

## This hand-off reports what it measured; it does NOT predict the next dispatch

Counters read **after** recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   2 / 4 Continue rounds    since 2026-09-07 05:14   ok
Objective     1 / 3 slices  [323]      since 2026-09-07 06:57   ok
Optimize      1 wake-date newer        since 2026-09-06 16:56   STALE
```

Both counters moved by exactly what this wake did by hand — one Continue round,
one slice closed — which is the disagreement check `LOOPS.md` says is the only
thing that has ever caught rule 3's parser. Nothing anomalous.

**Rule 5 reads STALE, and this wake is the one that made that word mean
something.** The line now has a third flag, `SKEW`, and STALE is no longer
reachable by a calendar boundary alone. Today's `1` is genuine: the rows at
`05:14` and `06:57` are 12h18m and 14h01m past the newest pair, outside the 8h
envelope under any offset assignment. **Still report rule 5 as *could not be
evaluated*, not clear** — a real STALE is still no input. What changed is that a
future `SKEW` reading means the opposite and must NOT be answered by recording
another metric; the line says so itself.

**No metric was recorded this wake**, deliberately: the one thing this slice
establishes is that adding a sample to chase a skew residual is wasted. This
STALE is not a skew residual, so a metric would have helped — but the item under
build was the instrument, and measuring with it in the same wake it changed is
the shape `LOOPS.md` warns about. `bundle-gz-kb` still cannot be sampled
(`259.1` — carried forward, not re-run this wake).

**`polish_requeue.py` did NOT run this wake** in any mode — `LOOPS.md` §3b step
0 is owed only once rule 6 is reached, and rule 4 matched first. No stamp
reading from this wake exists to quote.

Of the three advisory checks, only `check:resume-slice-ids` printed, against the
**previous** revision of this file. **Re-run it against this file as it now
stands.** The standing note still applies and is the one thing worth carrying:
**saying that an id is being dropped keeps it named**, because the check reads
backticked ids and cannot tell a historical reference from a live claim. The
remedy is silence, not an announcement — which is why the item this wake closed
is named in prose below rather than in backticks. The charter check and
`--verify-stamps` were silent.

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
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 says is still owed
remains owed — nothing has ever been filed in this repo's Discussions.

**Issue #2's `updated_at` has not moved since the last hand-off**, so it carries
the same single owner triage comment. See Direction.

## What landed this wake

**Slice 323**, dispatched by **rule 4** on the oldest still-open item no other
rule blocks. Rule 1 found no open P0; rule 2 was at `1 / 4`; rule 3 at `0 / 3`.

`dispatch_status.py`'s own header argued date granularity was *"immune to the
whole eight-hour ambiguity"*. It is — **within** a date, and not across one.
Slice 306 had caught the other case live: a metric this container wrote at
`2026-09-06 16:56` (+0000) sitting one calendar day behind log rows the other
dispatcher wrote at `2026-09-07 00:21` (+0800), the same wall-clock moment,
reported as `1 wake-date(s) newer   STALE`. The remedy a wake reaches for on
reading that — record another metric — cannot help.

**The fix STATES the skew rather than removing it**, which is the branch that
item's Accept named as a satisfying outcome. Neither file can be converted to a
shared basis from its own contents, and 164.2 already refused both `%z` and a
backfill. `skew_split()` splits the newer log dates into skew-explained and
provably-newer; the flag is `ok` / `SKEW` / `STALE`; the counted number is the
provable half. The softening is **one-directional by construction** — it can
turn a STALE into a SKEW, never manufacture a STALE, and never touches an `ok`.
The 8h envelope is git-blame-measured (`+0000` / `+0800` on both files) and
`observed_skew()` re-derives that spread every run, printing a NOTE when it is
wider than the constant or when git cannot answer at all.

**The base rate is the part worth carrying, because the first measurement said
"refuse this".** An as-of-DATE replay over the log's 26 wake-dates returned
**zero** SKEW verdicts and an identical 13 ok / 13 STALE split — read literally,
a discrimination that fires on nothing, which is this repo's own reason to
refuse a gate (94.11). Wrong instrument: a date-granularity replay includes rows
written hours after the wake read the line, so every occasion resolves to
provably-newer by the end of its day. Replayed at the granularity a wake
actually reads — both files taken **at each commit** of `loop-log.md` — it reads
**958 revisions → 581 STALE, 323 ok, 51 SKEW**, and the 51 are **seven distinct
occasions**, the last being Slice 306's own reading. Quoting 51 without the 7
would be a revision count dressed up as an event count.

**Two lessons, and the second is the transferable one.** A replay's granularity
is part of the instrument, not a detail of it — a state that lives four hours is
invisible to a daily sampler however many days it sweeps. And **a base rate of
zero is a claim about the instrument first**, the same grammar CLAUDE.md already
writes down; what licensed looking again was a recorded observation the
instrument could not see, not a preference for shipping.

**`323.1` is filed open**: the script now carries two replays at different
units, three screens apart, with nothing saying why they differ. Its Accept
names *"a sentence naming the difference is the whole fix"* as a satisfying
outcome and refuses a gate in the item itself.

**Today's live reading is UNCHANGED — `1 wake-date(s) newer  STALE`.** That is
the result, not a null: a fix that also flipped the reading it was built from
would be the suspicious outcome.

**Both red-proofs had their injections confirmed to land before the result was
believed**, per CLAUDE.md's rule that a green red-proof is a defect in the
injection until proven otherwise. Envelope `0` reproduces the old behaviour and
fails 3 of 6 self-test cases; envelope 999d fails a complementary 3 of 6; the
case surviving both is the one testing the date boundary rather than the
envelope. The end-to-end fixtures showed the printed LINE distinguishing all
three states.

**Gates green on the committed tree:** all **17** cloud-runnable entry points,
re-derived from `ci.yml` rather than read off a list (the two documented set
differences still hold — `check:ci-ignores` is covered by `check:repo` inside
`docs:build`, and `npm run test -w @busy-office/ui` is CI's `npx vitest run
--root packages/core`), plus the §3b re-run of `docs:build` after this file was
written.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially, and
every timestamp in `loop-metrics.jsonl` checked to parse across all **108**
revisions of that file, since `at_minutes()` would raise on one that did not.
Named rather than skipped quietly.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a cloud
wake has no Podman. Nothing rendered changed and no claim rests on rendering:
the diff is one Python script and two markdown files, no CSS, no `.astro`.
**The visual debts carried forward are unchanged and unspent**: `292.4/292.5`'s
screenshot lane on `/components/icon`, now fifteen wakes back; the
withdrawn-claim paragraph on `/components/data-table`; Slice 319's paragraph on
`/patterns/kanban` at 390px; and `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`, whose premise a previous wake re-confirmed by grep and
still cannot judge, because judging it is the rendered comparison itself. **A
local wake should glance at all four.**

## `origin/main` did NOT move under this wake

`git fetch origin main` at Step 0 and again immediately before the first commit,
as Step 0c mandates: `152b9bc9` both times. No collision.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit, and
`origin/main` again arrived as a **forced update** (`26447ba...152b9bc`). Trap 2
clean in one `--unshallow` (**2,004** commits, no `shallow.lock`), and it again
brought the tags — the **thirty-sixth** consecutive container to do so;
`git tag | wc -l` → **8**. Trap 1c did not bite. No `git stash` was used at any
point this wake.

## The open set is 25 — no P0, and 10 are cloud-takeable

`roadmap_scope.py --rev a6e7fff6` reports **25 open / 64 closed**, OPEN slices
`[15, 112, 249, 273, 294, 296, 297, 307, 309, 310, 315, 316, 319, 320, 322,
323]`. Net from the last hand-off's 25: one closed and `323.1` filed, so the
count is unchanged and **Slice 306 has left the open set**. The raw counts
reconcile exactly: `grep -c` reads 25 open / **66** closed, and 66 = 64
attributed + the 2 `[x]` under the non-slice `## STATE` heading.

- **cloud-takeable: 10** — `307.1`, `309.5`, `310.1`, `310.2`, `315.3`,
  `316.1`, `319.3`, `320.2`, `322.3`, `323.1`. (`297.1` is takeable here too but
  is counted once, under input-blocked, because that is what actually gates it.)
  **`307.1` is now the oldest of these**, and it is rule 5's other half — the
  structural starvation this wake did *not* touch. The cheapest are unchanged:
  `309.5`, `310.2`, `315.3`, `316.1`, `319.3`, `320.2`, `322.3`, and **`323.1`
  joins them** — its Accept is one measurement over git history, it names a
  sentence as a satisfying fix, and it already refuses a gate. **Everything in
  this bullet below the count except the `307.1` and `323.1` sentences is
  carried from the previous hand-off**; only the OPEN set, the count and the two
  new entries were re-measured.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`,
  `296.3`, and **`294.2`'s brand-mark half** — but `294.2` is counted below,
  under input-blocked, because the folder's absence gates it first.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these):
  `249.6`, `249.9`, `320.3`. **`249.6` was declined at the clause level four
  times. Do not re-derive it.**
- **input-blocked (2): `297.1` and `294.2`** — the **fourth kind** `LOOPS.md`
  186.2's three do not cover. `297.1` stays open because both filed issues came
  from the owner's own agent, so the router was never tested. **`294.2`** needs
  the owner to land the `upstream-contribution/` folder on a branch before any
  wake can rank the six proposals.

10 + 10 + 3 + 2 = 25, asserted rather than left to the reader, and reconciled
against `grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md`. (The owner-blocked bullet
names 11 ids; `294.2` is one of them and is counted under input-blocked, so the
arithmetic uses 10.)

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. It mis-sorts as one of the other four; it did so for
two hand-offs before Slice 321 caught it. Nothing in the current open set is of
that kind, checked rather than assumed.

## No archive sweep — declined on the SHARE half, thirteenth wake running

Measured at **`a6e7fff6`**: **7,994 lines**, closed-history share **39.9%**
(3,193 lines across 18 closed slices). The standing trigger the hand-offs carry
is *"past 5,450 lines / 40.6%"*: the line half is past, the share half is
**0.7 points short** — the closest it has come. Same judgement as the last
twelve wakes, and the next wake may well be the one that crosses it with no
recorded answer for what to do. See Direction.

**It went UP this wake, and the attribution is exact rather than inferred.**
Numerator 3,096 → 3,193 = **+97**, entirely Slice **306** becoming closed: its
body is 98 lines at this commit including its heading, which `roadmap_scope.py`
counts as 97 body lines. Denominator 7,861 → 7,994 = **+133** = that same slice
growing by **50** (the closing entry written into 306.1) plus Slice **323**'s
own body (**83**). `50 + 83 = 133`, and the sum of every slice body moves
`7,539 → 7,672`, the same +133; both sides reconcile to the line.

That is the fifth rise against four falls, all from ordinary work, and it is the
same argument `249.12` needs: **a wake that corrects an open slice pushes the
share down, and a wake that CLOSES an item in a large slice pushes it up.** This
wake is the second kind, plainly — closing one item moved the share more than
anything else this wake did.

Trend across thirty-one readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% →
10.9% → 11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7%
→ 36.4% → 38.1% → 40.3% → 39.4% → **39.9%**.

**What a sweep would take, so the next wake need not re-derive it:**
`roadmap_scope.py` reports the pins itself — **8 targets are named by a
still-open item** at this commit, unchanged in count from the last hand-off
though the target list gained Slice 306. Read that line before moving anything.
It is a wake's work, not a tail-end tidy.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention. Item 2 is the one that has moved.**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action**, and `LOOPS.md` Step 1 says an issue "gets closed with a
   comment linking the fixing commit once its item ships". Whether a *wake*
   should post that comment is `297.1`, still open.
2. **`249.12` — the archival trigger — is now 0.7 points from firing, the
   closest in thirty-one readings, and there is still no recorded answer for
   what a wake should do the first time it crosses.** Nothing states whether the
   trigger is an AND or an OR. The line half has been past for thirteen wakes;
   the share half has oscillated either side of 40% without ever being acted on.
   **A one-line answer — AND or OR, and what the crossing wake does — unblocks
   every future wake**, and the next one may be the wake that needs it.
3. **`294.2` still cannot be advanced by anyone but the owner.** The six
   proposals it ranks live in an owner-supplied zip that never reached the repo.
   **Landing `upstream-contribution/` on a branch is a one-command unblock.**
   Unchanged from the last hand-off, not re-measured here.
4. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.
