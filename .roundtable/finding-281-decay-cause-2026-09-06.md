# Finding — Slice 281's decay cause is false, and Slice 285 listed it under "what reproduced" (2026-09-06, cloud wake)

**Why this is a standalone finding rather than a grill report.** This wake
dispatched Objective twice and lost a collision both times — first on 276-279
(Slice 280 pushed first), then on 281/283/284 (Slice 285 pushed first, taking the
same three slices, the same slice number, and the same report filename). Both
grills were discarded per `LOOPS.md` Step 0c. What survives is one defect that
Slice 285 **checked and passed**, which makes it new work rather than a re-run.

---

## The claim

Slice 281's heading:

> the `spacing` cite's worked example **stopped being reachable by the rule** it
> explains ONE DAY after it was measured

and 281.1's cause, dated to the hour:

> At that commit `detail-form.astro:122` read `<table class="bo-data-table">`
> with no density — it qualified. `69a53364` (109.19, 2026-08-22 14:48 +0800),
> **28 hours later**, added `data-density="compact"` to it.

## Refuted three ways

| reading | command | result |
|---|---|---|
| the commit never touched it | `git show 69a53364 --stat -- …detail-form.astro` | **91 insertions, 0 deletions** — a pure addition of a *different* table |
| the table still has no density | `git show <rev>:…detail-form.astro \| grep '<table class="bo-data-table'` | absent at `79f7fec9:122`, `69a53364:127`, `a24ed45:127`, HEAD`:127` |
| neither side of the comparison moved | block extract; `git log -- tokens/density.css` | markup **5 `<th>`, 3 `<tr>`, 26 lines** identical at `79f7fec9` and HEAD; `density.css` untouched between 94.3 and `6cb26268` |

`69a53364`'s diff on that file, in full, is one added container plus one added
table carrying `data-row-edit data-density="compact"` — a new demo. The cited
table is untouched by it and is still density-less today.

**And the slice refutes itself one paragraph later.** 281.1 measured:

> Three declare `data-density="compact"`, so the auto-compaction selector's
> `:not([data-density])` cannot reach them; **the fourth is reached** (injection
> confirmed) and its rows read 87px → 87px.

The fourth *is* the cited table. It is reached. What stopped is the example
producing its NUMBERS.

**Both readings of the sentence fail**, which is what makes it a defect rather
than a wording slip: if *"it"* is the table, the fact is false; if *"it"* is the
page, the fact is true and explains nothing, because the cited table's
reachability is unaffected — which the slice itself measured.

## It was shipped

The sentence lived in `dsa-scores.json`'s `data-table · spacing` cite, which
`DsaScore.astro` renders onto the built page:

```
grep -rl 'stopped being reachable by the rule' apps/docs/dist/
# apps/docs/dist/components/data-table/index.html      (1 occurrence)
```

The CSS comments in `density.css` and `data-table.css` carry only the corrected
physics and are clean, so the defect was confined to the cite. Corrected with the
replacement asserted at **exactly 1** occurrence and the JSON re-parsed; `scored`
unmoved per 269.1.

## What actually decayed — Hypothesis, not Evidence

Measured at 390px against the freshly built tree:

```
main.bo-app-shell__main   offsetWidth 390 − clientWidth 375 = 15
/patterns/detail-form, 4 tables:
  no density (reached)  width 260  first row  87px   padding-inline 4px
  data-density=compact  width 310  first row  67px
  data-density=compact  width 310  first row 126px
  data-density=compact  width 310  first row  67.5px
```

The reached table is **50px narrower** than its siblings and its row **already
wraps at 87px before any mutation**, so it cannot produce a 68 → 87 step here.
`ENVIRONMENT.md` §6c documents that 15px reservation only at **1440** and only as
a *width* trap, closing *"Heights, row counts and overflow booleans are
unaffected"*. A row whose cells WRAP takes its height from the width, so that
sentence does not hold for it. 94.3 measured on the owner's machine; 281
re-measured in a cloud container. §6c corrected in the same commit (286.2).

Recorded as **Hypothesis**: direction and magnitude fit and the alternatives are
excluded (markup unchanged, CSS unchanged, selector still reaching), but
reproducing the owner's environment would settle it and a cloud wake cannot.

## Why two grills missed it

Slice 285 grilled 281 and listed this under ***what reproduced***:

> the decay exact to the hour (`79f7fec9` 2026-08-21 10:50 +0800, bare
> `<table class="bo-data-table">` at line 122 → `69a53364` 2026-08-22 14:48
> +0800 adding `data-density="compact"` — 27h58m, published as 28 hours)

It verified the two **timestamps** and took the causal half on trust. Both
timestamps are correct; the sentence joining them is not. Re-running a slice's
own commands confirms its inputs, never its inference.

**The generalisation:** *read a slice's headline against the measurement it
publishes, before re-running anything.* Both defects here were visible in the
slice's own text, one paragraph apart, at zero instrument cost.

## Counter-evidence, recorded

281's **conclusion is right and is not in question**: the cite genuinely was
stale, naming the example by property rather than by page is genuinely better,
and the two-effects separation (padding-wrap vs the row-height floor, `0 of 101`
for padding alone) is correct and reproduces. A reader checking only the
corrected artefact would find nothing wrong. What was wrong is the audit trail a
later wake re-runs — the same class 275 recorded for 273.1/274.1, now with a
commit sha attached to it.

## Not verified

Cloud wake: no Podman, no `localhost:8081`, so no 1440/390 light-and-dark
screenshot lane. **0** CSS files changed. The cite string grows and renders on
`/components/data-table`, so **that page reflows and the reflow is UNVERIFIED
VISUALLY** — named as unverified rather than implied. Verified instead: the old
claim confirmed absent from the BUILT `dist/` and the corrected text confirmed
present, per the verify-against-what-it-renders rule; plus `check:layout`,
`check:scroll` and `test:axe` across every page at both widths.
