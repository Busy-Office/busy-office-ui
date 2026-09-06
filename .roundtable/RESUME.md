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
at hand-off. Two commits this wake: Slice 292.5 and this hand-off. One iteration
recorded — `Continue · build`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 2 is OVERDUE — dispatch **Standardize**, not rule 4

This is the one thing on this page that changes what the next wake does. Read
immediately after recording this wake's row, which is the comparison `LOOPS.md`
mandates:

```
Standardize   4 / 4 Continue rounds since 2026-09-06 06:48   OVERDUE
Objective     1 / 3 slice           since 2026-09-06 07:53   ok  [292]
Optimize      3 wake-date(s) newer  since 2026-09-03 09:54   STALE
```

**Both counters agreed with the by-hand prediction**: rule 2 moved 3 → 4 (this
was a Continue round), and rule 3 did not move — 292 was already crossed, and
closing an item *inside* an already-counted slice adds nothing. The parser
reconciles **1500 parsed against a raw `grep -c '^- '` of 1500**; note the
figure moved by 3, not 1, because each `--also-refused` writes its own row.
Rule 5 read **STALE** and is reported as *could not be evaluated*, never clear.

Rule 2 sits **above** rule 4 deliberately (`LOOPS.md` Step 2, 2026-08-18): with
it below, a queued item always wins and the counter can only fire once the
backlog empties, which is exactly when drift is worst. So the next wake runs
the **Standardize** playbook, not `292.6`.

**Standardize has FOUR lanes and four consecutive sweeps ran three** —
`LOOPS.md` §3 numbers them for that reason. Say `n of 4` in the write-up:

1. `npm run scan:dead-style -w docs`
2. `npm run report:css-repeats -w @busy-office/ui`
3. `npm run report:prose -w docs`
4. `python3 scripts/loops/report_loop_prose.py` — read the **`ratchet` block**
   first, and for `LOOPS.md` read the **`by region`** block, not the file row
   (274.1): the finding is the dispatch region outgrowing the file.

If Standardize's own exit condition is met in one pass, rule 4's next dispatch
is **`292.6`** — the oldest of the four cloud-takeable items left.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0. It needs `packages/core/dist/api.json`, so
`npm run build -w @busy-office/ui` has to come first or it exits telling you so.
It did not run this wake: rule 2/4 matched, so rule 6 was never reached.

## What landed this wake

**Slice 292.5 — `/components/icon`'s copyable block teaches the mechanism the
page ships, and carries the rail's slot class** (dispatcher rule 4,
Continue/build).

**Both premises reproduced on the BUILT page before anything was edited**, and
the instrument matters: the copyable block is syntax-highlighted by
`highlight-code.mjs` *after* `astro build`, so the source string arrives wrapped
in dozens of `<span style=…>` tokens and HTML-escaped. The probe took the
`<pre>`'s `textContent` in a real browser — the same text the copy button hands
over — and re-parsed it with `DOMParser`, rather than regex-stripping the file.

**The mechanism difference is a correctness difference, measured in the
browser**, not a spelling preference: a consumer rule setting `mask-image`
paints while unlayered and computes to **`none`** from inside
`@layer bo-primitives`, because `.bo-icon`'s own layered declaration wins there
and resolves to nothing; `--bo-icon-src` paints from either position. Declared
order is `bo-reset, bo-tokens, bo-primitives, bo-components, bo-utilities`.

**A third site the item did not name: `icon.css` contradicted itself** — its
opening comment taught `mask-image` thirty lines above the property comment
calling `--bo-icon-src` THE mechanism. Fixed there and in `ApiTable` note 3.
Note 1's *"painted by `currentColor` via `mask-image`"* is deliberately
untouched: it describes what the component IS, it does not tell a reader what
to write. That is the only CHANGELOG-worthy half, filed under **Fixed** with
its compatibility stated rather than predicted — nothing a consumer writes
today stops working.

**The red-proof changed the code twice, and the findings are in `ROADMAP.md`
292.5 rather than here.** Both are the shapes CLAUDE.md names: one injection
ABORTED on its uniqueness precondition (the bare class list occurs in both
blocks), and one came back **GREEN because the guard was wrong** — a raw-text
check was satisfied by the stanza's own explanatory comment naming the property
it searched for. Comments are stripped now and the check is on the declaration.
**Two more fired on a different assertion than predicted**, which is how the
`mask-image` arm turned out to be unreachable by the obvious injection; a fifth
case exists solely to reach it. Reading the *messages* rather than the exit
codes is what found that.

**Two refusals, both in the log row:** a tree-wide gate (measured **0 of 9**
pages — and its first reading of 3 of 9 was an instrument defect, it scanned
only the template region while `quantity` keeps its demos in frontmatter `Demo`
strings), and converting the page's six hand-written demo sections to
`<Demo code={…}/>`, which would blind 292.4's guard — that one matches LITERAL
classes on purpose, and an interpolated generator is invisible to it.

**Gates green in this container:** core `build`, `test`, `lint:css`,
`docs:build` (`check:repo` incl. `slice-refs` **861** assertions, `page-shape`,
`wrong-choice`, `dsa-scores`, `check-markup` **165** files), the
`DOCS_BASE=/busy-office-ui` build, `check:claims` **167** live,
`check:layout` **127** pages, `test:axe` **127** pages x 2 widths zero
violations, `check:scroll` **914** containers, `check:formatting`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (19 behaviours), `check -w
@busy-office/create-ui`, `npm run suite` (28 screens x 2 widths). The
*"3 NOT VERIFIED"* in `check:claims` is `ENVIRONMENT.md` 6b — this container
reports `(pointer: fine) = false` — not a regression.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman. **A screenshot lane IS relevant here and is
unspent**: the copyable block gained two lines and its longest line grew to ~88
characters. Every rendered element is untouched — only the text inside the
`<pre>` changed — and the `<pre>` is a scroll container with `check:layout`,
`check:scroll` and `test:axe` green tree-wide, but **nobody has looked at
`/components/icon`**. A local wake glancing at it would close this cheaply, and
the same glance covers 292.4's unspent lane on the same page.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...c99ea12`). Trap 2
clean in one `--unshallow` (**1,940** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **sixteenth** consecutive
container to do so. Trap 1b bit once mid-wake: a `cd apps/docs` for a probe left
the next command there and `find packages/core` reported the repo missing.

**No collision.** `git fetch origin main` immediately before the first commit
left `origin/main` at the wake's starting sha, `0 0` against local `main`.

## The open set is 16 — and 4 of them are cloud-takeable

Each line classified from the item's own text per `LOOPS.md` 186.2. The three
older groups were re-read from their own text this wake, not carried forward on
the last hand-off's word — except `249.6`, see below.

- **cloud-takeable: 4** — `292.6`, `292.7`, `292.8`, `292.9`. All are code or
  prose on `/components/icon`, `icon.css`, `dsa-scores.json` or (292.9) four
  other docs pages, verifiable by `docs:build` plus a DOM or count assertion.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware — its
  text says outright it is "genuinely unblockable by the loop"), `112.3` and
  `112.4` (blocked on owner briefs / 112.3's verdict), `249.7` (its seed is one
  full row plus two terms and it holds for 249.10 — settling it before the owner
  answers would decide it on the thinnest input), `249.10`, `249.11`, `249.12`,
  `249.13` (all marked **OWNER CALL** in their own text), `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  **`249.6` was declined at the clause level four times as of three hand-offs
  ago. Do not re-derive it a fifth** — this wake read its text and carried that
  classification forward rather than re-examining the clause, so the four is
  that hand-off's count, not a fresh one. `249.9`'s own text says the
  deliverable is a catalogue page whose point is rendered miniatures;
  `249.15`'s says a cloud wake should not pick it up.

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings (16 open / 43 closed);
`check-resume-slice-ids` also counts the 2 items under the non-slice `## STATE`
heading (16 open / 45 closed). Do not quote a bare closed count.

## No archive sweep — and the two units diverged again, in one commit

Measured at this wake's slice commit (`git show HEAD:ROADMAP.md | wc -l`, and
`roadmap_scope.py`): **5,869 lines**, closed-history share **35.5%**. The
standing trigger the last five hand-offs carried is *"past 5,450 lines /
40.6%"*.

Trend across eleven readings: 25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4% →
37.5% → 36.9% → 36.2% → **35.5%**. This is the third consecutive wake in which
the line count rises while the percentage falls — **+117 lines and −0.7pp on
the same tree**, because 292.5's record is an OPEN-slice line: it grows the
denominator and never the numerator. Two consecutive wakes can honestly reach
opposite conclusions about the same tree by picking a unit.

**That is further direct evidence for `249.12`** (the archival trigger, an open
owner call) rather than a licence to sweep: inventing a threshold to justify a
sweep already started is precisely what that item exists to prevent. No sweep
run.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **`249.12` has stopped being low-urgency**, and this wake is the third
   consecutive one where the two units move in opposite directions inside a
   single commit. Its own roadmap text still calls it *"low urgency, the sweep
   keeps happening regardless"*.

2. **The loop is still feeding itself.** All four remaining cloud-takeable items
   were filed by this loop grilling or polishing its own docs, and every item
   the *plan* holds waits on the owner or on a local wake. The work is real —
   this wake refuted a third of the item's own premise, measured a genuine
   correctness difference in the browser, and caught a guard defect that a green
   red-proof would otherwise have shipped — but it is self-sourced.

3. **`273.2` is the owner call still worth their attention**, a twentieth wake
   untouched — whether a Polish round whose score does not move should increment
   `dry`. Not touched this wake; rule 6 was never reached.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, carried forward unchanged and **not re-run this wake** (rules
2 and 4 both had work, so nothing needed it): the only file mentioning
`bundle-gz-kb` is `scripts/loops/record_metric.py`, and the hit is its docstring
example. Nothing derives the number. Do not "fix" rule 5's staleness by
recording a guessed value. The command is in the hand-off at `e1ffcc3`.
