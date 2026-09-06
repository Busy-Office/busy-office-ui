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
at hand-off. Three commits this wake: Slice 293.1, Slice 293 round 2, and this
hand-off. One iteration recorded — `Standardize · sweep`, with one refusal.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 2 has RESET — rule 4 is the likely dispatch, on `292.6`

Read immediately after recording this wake's row, which is the comparison
`LOOPS.md` mandates:

```
Standardize   0 / 4 Continue rounds since 2026-09-06 12:51   ok
Objective     2 / 3 slices          since 2026-09-06 07:53   ok  [292, 293]
Optimize      3 wake-date(s) newer  since 2026-09-03 09:54   STALE
```

**Both counters moved exactly as predicted by hand.** Rule 2 reset 4 → 0 (this
was the Standardize round it was overdue for), and rule 3 moved 1 → 2 because
Slice 293 closed — `Standardize` is in `CLOSES_A_SLICE` per 161.4, so a sweep
that files and closes its own item does arm rule 3. The parser reconciles
**1502 parsed against a raw `grep -c "^- "` of 1502**; the figure moved by 2,
not 1, because the `--also-refused` writes its own row.

Rule 5 read **STALE** and is reported as *could not be evaluated*, never clear.

So the next wake reaches **rule 4**: the oldest still-open item it can take.
That is **`292.6`** (`icon.css` forbids figures in itself and carries two) — a
CSS-comment/prose fix verifiable by grep plus `docs:build`, no screenshot owed.
**Rule 3 is one slice away from firing**, so a wake that closes any slice arms
an Objective grill for the wake after.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.
It did not run this wake: rule 2 matched, so rule 6 was never reached.

## What landed this wake

**Slice 293 — Standardize sweep, 4 of 4 lanes** (dispatcher rule 2, overdue).
All four lanes ran; say `n of 4` in the write-up, per `LOOPS.md` §3.

| lane | result |
|---|---|
| 1 dead-style | **0 dead** of **1,433** live inline declarations — but only on the SECOND run |
| 2 css-repeats | **8** repeated bodies, `LOOPS.md`'s table exactly; 74 files · 242 rules · 230 distinct |
| 3 report:prose | **0 unverdicted** — the same 15 flagged pages Slice 290 checked |
| 4 loop-prose | dispatch region flat at 6,112 for a **fourth** commit |

**Lanes 1-3 read identically to Slice 290, and that was CITED rather than
re-derived.** 290 already discharged CLAUDE.md's identical-value concern by
measuring the lanes' *inputs*; repeating it would be the re-derivation this
playbook has paid for three times.

**The finding came from lane 1 FAILING, not from any lane's output.**
`scan:dead-style` exited 1 with *"No Chrome/Chromium found"*, and
`ENVIRONMENT.md` §1c is the section that exists to prevent exactly that. It
named three commands, and **both halves of the first were wrong**:

- `check-boost.mjs` **was deleted 2026-08-30** by `f1be2485`. Seven days stale.
- `docs:build` **does not need `CHROME_PATH` at all** — `env -u CHROME_PATH npm
  run docs:build` exits **0**. The requirement left with the script rather than
  moving elsewhere in the build, which was the obvious assumption.
- `scan:dead-style`, unnamed there, **does** need it — failed without, passed
  with, same tree, same wake. That pair is the discrimination, not a single red.

§1c now carries the derivation instead of the names. The set — **12 npm-script
entry points** — was reconciled against a second, independently written
instrument before publishing (a Python transitive closure and a separately
written Node closure return the same 12). The one-level grep in §1c is exact
**today** and the check for that is why it is usable: the closure is 15 files
and **0** reach the resolver only transitively.

**Round 2 generalized the shape across all four durable files** and came back
clean: 11 hits, **1 true positive** (the one already fixed). Six are generated
dist artefacts — the three CSS names verified present in
`packages/core/dist/css/`, not assumed — one is `CLAUDE.md`'s deliberate
`serve-DIST.mjs` example, one a `.d.ts` suffix, and **two are 293.1's own
explanation naming the script it removed**. Refused promotion to a gate at that
base rate.

**Gates green in this container:** core `build`, `test`, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **863** assertions, `page-shape`
**127** pages), `check:claims` **167** live, `check:formatting`,
`check:scroll` **914** containers, `check:layout` **127** pages,
`check:forced-colors`, `test:axe`, `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app`, `check -w
@busy-office/create-ui`, `npm run suite` (28 screens x 2 widths). The
*"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b — this container
reports `(pointer: fine) = false` — not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman. **None is owed, and that is checkable
rather than asserted:** the whole wake's diff is markdown-only —
`git diff --name-only | grep -v '\.md$' | wc -l` → **0**, so 0 CSS files and 0
docs pages. Nothing in it renders. **292.4/292.5's screenshot lane on
`/components/icon` remains unspent** and a local wake's glance still closes both
cheaply.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...aabe137`). Trap 2
clean in one `--unshallow` (**1,942** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **seventeenth** consecutive
container to do so. Trap 1c bit for real and is what produced this wake's
finding.

**No collision.** `git fetch origin main` immediately before the first commit
left `origin/main` at the wake's starting sha, `0 0` against local `main`.

## The open set is still 16 — and 4 of them are cloud-takeable

293.1 was filed and closed in the same wake, so the count is unchanged.
**The three older groups are carried forward from the previous hand-off's
classification, not re-read from their own text this wake** — said plainly,
because that hand-off flagged the same thing about `249.6`.

- **cloud-takeable: 4** — `292.6`, `292.7`, `292.8`, `292.9`. Confirmed open
  this wake; `292.6` re-read and it is a CSS-comment fix needing no browser.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3`, `112.4`, `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these, a
  cloud wake cannot): `249.6`, `249.9`, `249.15`. **`249.6` was declined at the
  clause level four times as of four hand-offs ago. Do not re-derive it.**

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings (16 open / 44 closed);
`check-resume-slice-ids` also counts the 2 items under the non-slice `## STATE`
heading (16 open / 46 closed). Do not quote a bare closed count.

## No archive sweep — and this wake the two units AGREED, which is itself the point

Measured at this wake's round-2 commit (`roadmap_scope.py`): **6,041 lines**,
closed-history share **37.3%**. The standing trigger the last six hand-offs
carry is *"past 5,450 lines / 40.6%"* — lines are past it, the share is not.

Trend across twelve readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → 35.5% → **37.3%**. The previous three wakes each had the
line count rise while the percentage fell; **this wake both rose** (+172 lines,
+1.8pp), because Slice 293 closed inside its own wake and so lands in the
numerator as well as the denominator. The unit-divergence is therefore not a
property of the tree — it is a property of **whether the wake's slice closed**,
which is a sharper statement of the same evidence.

**That is further direct evidence for `249.12`** (the archival trigger, an open
owner call) rather than a licence to sweep. No sweep run.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **`249.12` has stopped being low-urgency.** Four consecutive wakes have now
   had to reason about which unit to believe before deciding not to sweep. Its
   own roadmap text still calls it *"low urgency, the sweep keeps happening
   regardless"*.

2. **The loop is still feeding itself — but this wake is a partial exception
   worth noting.** All four remaining cloud-takeable items were filed by this
   loop grilling its own docs. **293.1 was not**: it was found by the toolchain
   breaking underneath the sweep, which is the closest thing to external input
   the loop gets unattended. It is still self-repair, not product work.

3. **`273.2` is the owner call still worth their attention**, a twenty-first
   wake untouched — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, carried forward unchanged and **not re-run this wake** (rule 2
had work, so nothing needed it): the only file mentioning `bundle-gz-kb` is
`scripts/loops/record_metric.py`, and the hit is its docstring example. Nothing
derives the number. Do not "fix" rule 5's staleness by recording a guessed
value. The command is in the hand-off at `e1ffcc3`.
