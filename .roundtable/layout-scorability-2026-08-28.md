# Is `layout` scorable? — base rate measured first (roadmap 171.3, 2026-08-28)

The wishlist asked for a layout score. `LOOPS.md` and CLAUDE.md both require the
base rate to be measured **before** a dimension is proposed — a predicate already
true of everything is ceremony however carefully written, which is exactly how
`ux` died (it read 5/5 on all 28 screens).

Six candidate predicates, measured in a real browser at 1440×900 across all 28
ERP-suite screens, then put to the screen score's own **ACCEPT TEST**: at least
three distinct values, or the dimension cannot rank.

**Verdict: layout is not scorable.** Not because nothing varies — two candidates
vary plenty — but because everything that varies is either *what the screen is*
or *an artefact*, and the one candidate that could have been quality turns out to
rank hairlines.

---

## Result

| candidate | distinct | accept | why it does not survive |
|---|---|---|---|
| `depth` (scroll height ÷ viewport) | 1 | FAILS | uniform at 1 — **and it measures the fixture, not the layout**. The suite's lists carry 6 rows; the same screen with 600 rows scores differently with identical layout code. |
| `widthUse` (main ÷ viewport) | 1 | FAILS | 0.84 on all 28 — the app shell's fixed sidebar. Uniform because the shell works. |
| `aboveFold` (primary action within 900px) | 2 | FAILS | 27 true, 1 n/a. **Binary** — and a binary property belongs in a gate, enforced once, not in a rubric re-confirming it 28 times. This is precisely the reason `ux` was retired. |
| `regions` (children of the content stack) | 7 | passes | ranks **what the screen is**. `p2p/purchase-order` has 12, `index` has 4; a document screen owes more regions than a home screen. The 145.0 confound. |
| `maxDepth` (DOM nesting) | 4 | passes | same confound. Deeper is not worse — a document with tabs legitimately nests deeper. |
| `offScale` (spacing values not on the token scale) | 5 | passes | **the only candidate that could have been quality.** It is not — see below. |

## Why `offScale` fails despite passing the accept test

Nine values across the suite are genuinely not on the `--bo-space-*` scale. They
fall into two classes, and neither is a design decision:

```
  -4px      on  5/28      ┐ hairlines, border-collapse offsets,
  -1px      on 25/28      │ focus-ring insets. Near-universal,
   1px      on 27/28      │ and not "spacing" in any design sense.
   2px      on 24/28      ┘
  ------------------------------------------------------------
   4.9px    on  1/28      ┐ em/ch/percentage-derived computed
   6.5px    on  7/28      │ values. Deliberately relative, so
  10.5px    on  1/28      │ they resolve off-scale BY DESIGN.
  26.625px  on  2/28      │
  41.25px   on  1/28      ┘
```

**No screen uses a hand-picked off-scale spacing literal.** So the count ranks
how many hairlines and em-derived values a screen happens to contain — which
correlates with how many bordered tables it has, not with whether its spacing was
chosen well.

Separating "off-scale because sloppy" from "off-scale because it is a border"
requires knowing intent. That is the wall CLAUDE.md already names: *"a comment
precedes this literal" is checkable; "a comment explains this literal" is
semantic.* Same wall, different literal.

## Three instrument defects, in four rounds, on one question

Recorded because CLAUDE.md treats this as a **base rate**, not a lapse — and this
is the cleanest confirmation yet, since every one produced a plausible number.

1. **`regions` counted a wrapper.** `main > div.bo-stack > …`, so `:scope > *`
   returned **1 on 27 of 28 screens**. Caught by the uniformity being too tidy.
2. **Token membership compared rem against px.** `--bo-space-4` is `1rem`;
   computed styles report `16px`. Nothing ever matched, so `nonToken` came back
   **identical to `spacings` on all 28 rows** — the identical-value tell, again.
3. **`gap` computes to a TWO-VALUE string.** `"12px 16px"` matches no
   single-value token, so rounds 2–3 reported `4px`/`8px`/`12px`/`16px` as
   off-scale — values that are literally `--bo-space-1/2/3/4`. Caught by
   noticing the claim was not credible, then printing the resolved scale.

And one result nearly misread the other way: `depth = 1` on all 28 looked like a
dead detector (an ERP list that does not scroll?). It was real — the fixtures are
6 rows — which makes the dimension *worthless for a different reason*. The tidy
number was a true signal about the wrong thing.

## What was NOT proposed

No layout dimension. No gate. The hairline values are already covered by the
existing browser gates (`check:layout`, `check:scroll`, `check:target-size`,
`check:forced-colors`) that assert the properties which actually matter and are
binary — which is where binary properties belong.

Re-run: `scratchpad/layout4.mjs` shape — split every computed value on
whitespace before testing token membership, or the result is wrong in the
direction that flatters the framework.
