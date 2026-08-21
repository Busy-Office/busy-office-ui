# Scorecard — Actions + Values (Slice 94, batches 6 & 7) — SCORING COMPLETE

2026-08-21. The last four: `button`, `dropdown`, `segmented` (Actions) and
`kv` (Values — `amount` and `date` were scored earlier). **39 of 39
documented components now carry a score.** The two remaining component pages,
`inline-editing` and `table-toolbar`, document no component via
`ClassRef`/`ApiTable` — they are feature pages, as batch 1 established.

## Scores

| Component | Total | Below 3 |
|---|--:|---|
| `button` | 95% (20/21) | content |
| `dropdown` | 95% (20/21) | content |
| `segmented` | 95% (20/21) | spacing |
| `kv` | 93% (14/15) | content |

None triggered. These four are the cleanest files in the framework: `button`
carries exactly one dimension literal and it is explained, `dropdown` one,
`kv` two, and none of the four has a raw `font-size`.

`segmented` is the **first component to pass `content`** without being fixed
for it: its opener names the boundary and the alternative outright — "the
button-group alternative to a **select** when every option should be visible
at once", bounded to 2-5 options.

## The `content` gap is systemic — the evidence is now conclusive

Across the two families scored since 94.7's definitions landed, and untouched
by 94.8's hand-written fixes:

| Family | `content` failures |
|---|---|
| Display (batch 5) | 7 of 7 |
| Actions + Values (batches 6-7) | 3 of 4 |
| **Total** | **10 of 11** |

94.10 anticipated this and said: if batches 6-7 fail the same way, stop
writing the sentence by hand and change the docs recipe so a new page cannot
ship without it. **That condition is met.** Raising it rather than doing a
third manual pass is the recorded next step.

## Final distribution — all 39

`{80%: 3, 83%: 1, 87%: 1, 90%: 1, 93%: 5, 94%: 1, 95%: 8, 100%: 19}`

Per dimension, which is the honest read on 94.7's work:

| Dimension | Spread | Scored on | Below 3 |
|---|---|--:|--:|
| `spacing` | `{2: 11, 3: 28}` | 39 | **11** |
| `content` | `{2: 10, 3: 29}` | 39 | **10** |
| `typography` | `{2: 6, 3: 33}` | 39 | **6** |
| `fit` | `{0: 1, 3: 38}` | 39 | 1 |
| `hierarchy` | `{3: 25}` | 25 | **0** |
| `colour` | `{3: 39}` | 39 | **0** |
| `interaction` | `{3: 21}` | 21 | **0** |

Four dimensions discriminate. Three still do not — and `hierarchy` and
`interaction` are exactly the two 94.9 is open on. `colour` reads 0 today but
*has* failed within this session (the untokenized scrim, fixed in 94.6a), so
it is capable; the other two have never failed on any of 39 components.

## 94.5 closed, by making the branch reachable rather than by wiring pages

94.5 found that `DsaScore`'s "not yet scored" line had never rendered
anywhere, because the component was only ever added to a page at the moment
that component got scored. With scoring now complete the branch would have
been **dead forever** — the wiring fix 94.5 proposed is moot.

The real fix is upstream: `new-component.mjs` now stamps `<DsaScore>` into
the scaffold, and `check-page-shape.mjs` **requires** it, so the next
component ships with the section and shows the honest "not yet scored" line
until someone scores it. The branch is reachable by construction.

**Red-proved, not assumed:** removed the `<DsaScore>` call from `kbd.astro`,
confirmed the injection took effect (the string was gone from the file), and
watched the gate report `kbd.astro: missing <DsaScore component="kbd" />` and
**exit 1**. Restored byte-identical; gate exits 0 again. The exit code was
checked separately because `| tail` had been masking it.

## Verification

Core build and full docs build green (page-shape 39+19, link check 8712,
markup 52901 class uses). Four pages wired by script and verified against the
**built output** — each carries its own score, nothing landed in a template
literal or `<pre>`. Live on a bind-mounted container over fresh `dist` (CSS
hash matched first): `button` renders all seven rows in **both themes**, flip
confirmed by computed `background-color`, no page-level horizontal overflow.

**Not verified at 1440px** — viewport would not leave 1280 (70.1/71.1).
