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
survives none. **This wake is the worked example** — a line citation written
INSIDE `325.1` went stale three times in one wake, each time from the edit that
fixed the last one (5038 → 5142 → 5146 → 5148). It ships as a command, not a
number.

---

## In flight: nothing

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **No collision this wake** — `origin/main` read `56c4cf8` at Step 0
and `56c4cf8` again immediately before the first commit, and again before the
second.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: BOTH COUNTER RULES ARE OVERDUE, AND RULE 2 SITS ABOVE RULE 4

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     3 / 3 slices            OVERDUE  [324, 325, 347]
```

Both crossed **on this wake's own row**, after the dispatch had already been
decided, so neither was dispatchable this wake. **Rule 2 (Standardize) is
evaluated before rule 3, which is before rule 4** — do not reach for the oldest
open item without evaluating those two first. **Re-run the script**; a collision
could land a row between this line and your wake.

Note for whoever takes rule 3: **one of its three armed slices, 325, is still
open** — that is `349.1` below, not a reason to skip the grill.

## What landed: `325.1` REFUSED — and the corpus decomposed rather than shrank

**Rule 4 dispatched this** as the oldest still-open item no other kind of block
covers. Its Accept asked for a decision with the base rate **re-measured at
execution time**, and for what happens when a cited script is renamed.

**The premise re-check killed the item's own framing first.** Its published
base rate — *"4 occurrences on 2 pages"* — is the **parent commit's** reading.
Measured at three revisions: `82dc60e6^` → 4 on 2; `82dc60e6`, the commit that
WROTE the item, → **5 on 3**; `HEAD` → 5 on 3. The fifth is the
`measure:stress` citation the item's own first sentence describes. The regex
was not the defect; the revision was. That is `ENVIRONMENT.md`'s *a figure
describing a commit is read from THAT COMMIT*, in 275.3's `HEAD` form, inside
the item whose subject is stale citations.

**The five are three kinds, verified on the BUILT site.** One is this repo's
own script shown to a reader (`measure:stress -w docs`); **three** are the
CONSUMER's script, inside `installation.astro`'s template literals — what the
reader adds to THEIR `package.json`; **one** is inside a `/* … */` frontmatter
comment and reaches no reader. That last is asserted on the rendered artefact
with a live control: `grep -c 'npm run build'` on the built cascade page → **0**
where `grep -c 'z-index'` on the same file → **3**. Rendered census: **4 on 2
pages, 1 of them ours.**

**Decisive: the obvious gate reports 5 of 5 valid while genuinely checking 1.**
`check:markup` resolves in two workspaces here and `build` in all four, so the
three consumer citations pass by **name collision** against a different
definition. A green 5x its real coverage is worse than 94.11's case — that
detector could not fail, this one fails on the wrong thing. The one falsifiable
shape (`-w <workspace>`, which consumer samples never carry) returns **1 of 5**.

**And the consumer half is already gated by EXECUTION**: `check-quickstart.mjs`
runs `npx bo-check-markup` in a scaffolded project (its pass line printed
`→ bo-check-markup clean` again this wake), `check-package.mjs` fails on a
missing bin. **The incident that motivated the item is outside the corpus** —
Slice 307's `node examples/po-app/server.mjs` is not an `npm run` citation and
is not on a docs page.

**On rename, per kind:** `bo-check-markup` covered; the comment correctly
uncovered; **`measure:stress` caught by nothing, named as the accepted cost** —
`git grep` finds it only in `apps/docs/package.json`, the script's own header,
one `<code>` on `/components/data-table` and roadmap prose, and `ci.yml`'s three
`measure` hits are none of them this script.

## Second thing, filed not fixed: `349.1` — rule 3's TEXT and its COUNTER disagree

Found exactly the way `LOOPS.md` says this counter is always found — **a number
disagreeing with something a human had just written down**, read right after
recording. The previous hand-off predicted *"closing anything in a slice other
than 324 or 347 does it"*. This wake closed **`325.1`, an ITEM**; Slice 325
stayed open on `325.2`. The counter armed anyway.

Rule 3 says *"THREE OR MORE slices **closed**"*. `dispatch_status.py` never
opens `ROADMAP.md` — it counts distinct slice numbers **named** by
Continue/Standardize/Polish rows. Base rate measured before filing: **258
distinct slices named, 12 of them (4.7%) still open today**, and **1 of 3 in
the live arming set**. The command is in the item; the figures are snapshots.

**This is the sixth shape of a rule-3 defect and the first that is not the
parser** — the five in `LOOPS-archive.md` are log conventions a regex missed,
279.4's is the loop set. Here every row parses correctly and the number still
does not mean what the rule says. **Which side is wrong is deliberately not
decided**: the Accept accepts *either* the counter reading `ROADMAP.md` or the
rule's text being rewritten, and says outright that finding the counter right
is a satisfying outcome.

## `348.1` reproduced again on this wake's recording, unchanged

`check:resume-slice-ids` again printed `15.0`, `15.10`, `312.2` as "named ids
not in `ROADMAP.md`". Two of the three were the previous hand-off's gzip
figures; this file no longer carries them, so **the next recording is a natural
discrimination test** — if the ABSENT bucket shrinks to `312.2` alone, the
match really was the backticked figures and `348.1`'s reproducer is confirmed
by removal rather than by argument. Nothing was reworded to suppress it.

## No metric was recorded this wake, and that is deliberate

Nothing was measured that a tracked name covers. `324.2` wrote down the
`bundle-gz-kb` convention (read the left-hand number off `check:size`, never off
a README) and it remains unspent — this wake had no reason to take a sample.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, structurally rather than by judgement: the diff is `ROADMAP.md` and
this file. No CSS, no docs page, no component and no script changed, so nothing
rendered can move.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run green in this container** —
core `build` (incl. `lint:css`, `check:size`, `check:readme-facts`,
`check:package`), core `test` (**165** tests), `lint:css`, `docs:build`
(carrying `check:slice-refs` **989** assertions / **375** citations,
`check:floor` **593** files, `check:vendor-names` **615** files / 7 denied
names, `check:imports`, `check:repo`), `check:claims` (**176** live · 3 NOT
VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll`, `check:layout` (128 pages),
`check:forced-colors`, `test:axe` (128 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (20 behaviours), `check -w create-ui`, `npm run suite` (28
screens × 2).

**Said precisely, because the wake landed in two commits.** All 17 were run
green on the tree of the FIRST commit (`325.1`). The second commit adds Slice
349 to `ROADMAP.md` and this file — **markdown only**, and nothing in it can
reach a browser gate. What was re-run after it: **`docs:build`**, which is where
all four gates that read `.roundtable/**` and `ROADMAP.md` live, per
`ENVIRONMENT.md` §3b. It was also re-run mid-item, after the third correction
to the line citation, for the same reason.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially.
**It earned its keep twice.** It caught that the `ROADMAP.md:5038` citation I
had written was already false at staging time (the paragraphs above it had moved
it), and then that my *correction* to 5142 was false for the same reason, and
that 5146 would be too. That is what turned a number into a command. It also
caught a broken paragraph wrap left by the first correction.

**Every claim in the 325.1 write-up was measured, and the ones I had written
before measuring were checked afterwards rather than left.** Three were: the
`-w`-carrying count (**1**, confirmed), the three-revision loop exactly as it is
written into the roadmap (**4 / 5 / 5**, confirmed), and the line citation
(**refuted** — see above). The embedded `349.1` probe was likewise run verbatim
in its published form, not in the form I had explored with.

## The open set is 30 — no P0

`roadmap_scope.py` reports **30 open / 83 closed** at the working tree, and the
raw checkbox count reads **30 open / 85 closed**. **The two disagree by design,
not by defect**: `roadmap_scope.py` excludes the 2 `[x]` items under the
non-slice `## STATE` headings and says so in its own output. Reconciled here
rather than left for the next wake to re-derive as a finding.

This wake closed `325.1` (30 → 29) and filed `349.1` (29 → 30). **Re-run the
script at the commit** rather than quoting this.

- **cloud-takeable: 19** — `325.2`, `326.3`, `327.3`, `328.1`, `330.1`,
  `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`.
  **`325.2` is now the oldest of these** and is what rule 4 reaches for next —
  *the published `Initial render` column has no recoverable method*; its Accept
  accepts withdrawal as readily as a definition. `335.1` still carries its
  caveat — settling it may mean filing a throwaway Q&A discussion, an
  outward-facing write to a public repo whose permission has **not** been
  tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

19 + 10 + 1 = 30, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** Every owner-blocked item above was re-read **in the
file** this wake, not carried from the previous hand-off — `249.7` in full,
because it is the one whose heading does not say "OWNER CALL"; its own text
still holds the SAP/Fiori rows for `249.10`, and 249.19 (its one separable
clause) landed in Slice 262.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
FIFTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
Rule 2 `Standardize 3 / 4 ok` did not match **at dispatch time**. Rule 3
`Objective 2 / 3 ok [324, 347]` did not match **at dispatch time**. **Rule 4
matched** on `325.1`. Rules 5-8 not reached. Both counters crossed afterwards,
on this wake's own row — see the block at the top of this file.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE`: `0` wake-dates newer than the newest pair, 8 of 47 names paired across
days. No sample was recorded this wake, so it is unmoved.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **41.2%** at Step 0 (`56c4cf8`)
and **40.7%** after the `325.1` commit — the share FELL, because closing an item
adds live lines without adding a closed slice. Both are below every trigger the
last sweeps used: 252.1 dispatched the tenth at **55.1%**, 272.1 the eleventh at
**56.7%**, 279.3 declined the twelfth at **40.6%**, `324.3` took the thirteenth
at **41.5%**. **Re-run the script at the commit** rather than inferring it here.

**`249.12` is named for a NINTH consecutive wake.** Nine consecutive wakes have
now declined a sweep on the absence of a stated trigger. **Nothing is proposed
here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit, and was observed rather than run blind this time.** The fetch
reported a forced update `26447ba...56c4cf8`, and `git branch --show-current`
answered **EMPTY** — the container *was* detached. Fixed with
`git checkout -B main origin/main`; the branch read `main` afterwards. No
`git stash` at any point. **`HEAD` equalled `origin/main` at `56c4cf8`, which is
the previous wake's own commit**, so no other dispatcher had landed anything
between the two wakes.

**Trap 2: the clone was shallow and this item's premise was a history
measurement** (a base rate at three revisions), so it was unshallowed before any
figure was taken — **2,062 commits**, no `shallow.lock`, and the unshallow again
brought the tags (`git tag | wc -l` → **8**, run rather than assumed).
`polish_requeue.py --verify-stamps` therefore had real history and printed
nothing.

**No `git worktree` was used this wake** — every historical reading was taken
with `git show <rev>:<path>`, which needs no checkout. `git status` was clean
before each commit.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6
   was never reached, so `polish_requeue.py --apply` was correctly not run.

**And one new thing, which is a loop-mechanics call rather than a product one:**
`349.1` asks whether rule 3 should count slices *closed* or slices *touched*.
That is answerable by whoever owns `LOOPS.md`'s text and does not need the
owner — it is flagged here only because it changes how often the Objective
grill fires.
