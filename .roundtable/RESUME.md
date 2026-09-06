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
at hand-off. Two commits this wake, both pushed: Slice 287.5 and this hand-off.
One iteration recorded — `Continue · build`, with three refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 3 read OVERDUE — but read the counter, do not act on this line

After this wake's row, `dispatch_status.py` reads rule 2 `1 / 4 … ok` and
**rule 3 `3 / 3 slices … OVERDUE [286, 287, 290]`**, so a wake that reaches
Step 2 dispatches **Objective** before rule 4 is evaluated at all. Rule 5 read
**STALE** (`3 wake-date(s) newer`) and is reported as *could not be evaluated* —
never clear.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**The counter moved correctly**, read immediately after recording — which is
`LOOPS.md`'s own instruction and the thing that has found two of that parser's
five bugs. It went `2 / 3` → `3 / 3` on this wake's Continue row closing
Slice 287.

**The arming set is `[286, 287, 290]`, and 286 has already been grilled in
part** — Slice 289 grilled `283.3`, `284.2` and `288.1/288.2`. Narrow the scope
at the Objective playbook's step 0 rather than re-grilling; 287 and 290 are
untouched, and this wake's own 287.5 sits inside 287.

## ⚠ THIS WAKE LOST A COLLISION — the ordinary kind, not 286's double

Step 0c's mandated `git fetch origin main` **before the first commit** found
`origin/main` **4 commits ahead**, carrying `04073028` — **Slice 286.4, the
same item this wake had just built**, by another dispatcher, reaching the same
headline finding (the field matrix reaches **4 of the 40** components carrying a
`fit` score). That work was discarded per Step 0c, not merged, and the wake
re-dispatched onto 287.5.

Three things worth carrying, because the discard is where a false finding gets
manufactured:

1. **The mandated pre-commit fetch is what caught it**, exactly as Step 0c says.
   Nothing else had fired: the wake had already run every gate green on work
   that was redundant.
2. **Their fix covers the `scan` cite too, and the tempting finding against it
   is FALSE.** A structural probe (`'matrix puts it' in cite`) returns `True` on
   their corrected cite — but reading it shows the hit is a **quotation of the
   old wording inside their own correction's explanation**. That is precisely
   the comment trap `CLAUDE.md`'s removal rule names, arriving inside the check
   written to police it. **Read the hit before filing.** Recorded as a refusal.
3. **The discarded diff is at `<scratch>/lost-286.4.patch` (122 lines) and is
   NOT worth recovering** — compared against theirs before discarding; theirs is
   equal or better sourced on both halves.

## What landed this wake

**Slice 287.5, dispatched by rule 4 (Continue, build) after the collision.** The
orphaned sentence in `LOOPS.md` §3b step 5 is back on the dry-rounds bullet it
was written for.

**The finding is that this item had already named the wrong commit twice, and
the METHOD is why.** `fc79ea85` (corrected by Slice 289) and then `9c1bacbe`
were wrong the same way: each merely **appended** text to a paragraph the
sentence had *already* been stranded on, so an `-S` search over that paragraph's
opening words names the commit that wrote the paragraph, never the one that did
the stranding.

- The orphaning commit is **`f57570f4`, 2026-08-25**, eleven days before either
  sha. Found by replaying every revision of `LOOPS.md` and reporting the
  **transitions** of *"does the sentence's own line still carry the dry
  bullet"* — one transition, never re-attached. **Asking the transition instead
  of the commit is what made it findable**; the command is in ROADMAP 287.5.
- **`f57570f4`'s diff is a paste artifact, not a judgement** — it cut the
  sentence off the bullet's line and re-pasted the tail onto the end of the
  paragraph it was inserting. That refutes the Accept's no-change branch
  outright, so branch 1 (move it) is the resolution.
- **Verified a PURE MOVE structurally, never by reading the diff**: one
  occurrence before and after, `attached_to_dry_bullet` `False → True`, and the
  whole file's word multiset **identical at 15,201 words either side**.
- **It does NOT decide `273.2`** (the open owner call on `dry++`). It restores
  text present since `3ddeb683` to the bullet it was written for; what that
  bullet mandates is unchanged.

**Gates green on this tree:** `build`, `test` **165**, `lint:css`, `docs:build`,
`check:repo` (`slice-refs` **853** assertions / **272** slice numbers),
`check:claims` **167** live, `check:formatting`, `check:layout` **127** pages,
`test:axe` **127** pages x 2 widths zero violations. The *"3 NOT VERIFIED"* in
`check:claims` is `ENVIRONMENT.md` 6b — this container reports
`(pointer: fine) = false` — not a regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...5b8917e`). Trap 2
clean in one `--unshallow` (**1,926** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **tenth** consecutive
container to do so, which is why that section states the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed and that
is checkable, not asserted:** the slice commit changes **0** CSS files and **0**
docs pages; both its files are markdown that nothing renders.

## The open set is 12, and the cloud lane is now DRY

Both items the last hand-off listed as cloud-takeable are closed — `286.4` by
the other dispatcher, `287.5` by this wake. Each line below is re-classified
from the item's own text per `LOOPS.md` 186.2, not carried over.

- **cloud-takeable: 0.** This is the first hand-off to report the cloud lane
  empty. It halts nothing — **rule 3 is OVERDUE and sits above rule 4**, so the
  next wake has work regardless; it means rule 4, *if reached*, has nothing a
  cloud wake can take.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

**A LOCAL wake has three items waiting** — `249.6`, `249.9`, `249.15` — which is
the whole difference between "nothing dispatchable" and "nothing *this
container* can do".

## No archive sweep this wake, and the reason is a measurement, not an omission

`roadmap_scope.py` reads **5,163 lines / 38.0%** closed-history share with 9
eligible targets, only **1** of which (Slice 283) is named by a still-open item
(`273.2`) — so 236.2's check is not what declined it. What declined it is the
position:

| | lines | closed share |
|---|---|---|
| **now** | 5,163 | 38.0% |
| Slice 282, the twelfth sweep, 13 slices moved | 5,450 | 40.6% |
| the wake that REFUSED hours before 282 | 5,450 | 40.6% |

We sit **below the last sweep's own run point in both units**, so sweeping now
would be earlier than the most recent precedent — and Slice 282's own finding is
that *the five recorded sweep decisions lie on no threshold in either unit*.
**`249.12` — the archival trigger — is an open OWNER call**, so inventing a
threshold here would pre-empt it. Recorded as a refusal with its numbers rather
than an omission. The share is climbing fast (**25.4% → 34.2% → 38.0%** across
three readings in about a day), so a wake that finds itself past 5,450 / 40.6%
should simply run it.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **The cloud lane is dry for the first time** (see above). Nine of the twelve
   open items are owner calls. The loop keeps working — rule 3 is overdue and
   Polish's rule 6 sits below it — but every remaining *build* item now waits on
   either the owner or a local wake's screenshots.

2. **`273.2` is still the owner call worth their attention**, a fourteenth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots. This wake's 287.5
   moved prose onto that very bullet and deliberately did **not** touch what it
   mandates.

3. **`249.12` (the archival trigger) is now load-bearing rather than
   low-urgency.** Its own text calls it *"low urgency, the sweep keeps happening
   regardless"*. Two consecutive wakes have now declined a sweep by
   hand-comparing against the last one's position, because there is no stated
   trigger to apply — which is the decision this item exists to settle.

## `bundle-gz-kb` still cannot be sampled — thirtieth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
