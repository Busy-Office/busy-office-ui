# Component grill — why have it, why not have it (2026-08-19)

Owner ask: *grill each component on why we should and should not have it — ease
of work, simplicity, performance — benchmark the score to decide what to do next.
Also find what ERP needs that we do not ship.*

This replaces the one-sided instrument. The Slice 37 rubric scored what a
component is **worth** (Demand / Composition / Contracts / Evidence) and never
stated the case **against** keeping it. A score that only measures value can
only ever say "keep". This one is symmetric: NEED minus COST, and the net
decides the action.

## The axes, and why these

Both halves are 4 axes × 0-3, so NET runs −12…+12 and neither side can outweigh
the other by construction.

### NEED — why a user needs us to ship it

| | axis | what it means | how it is scored |
|---|---|---|---|
| **N1** | **Demand** | do real screens use it | measured: pattern-demo regions, chrome and code samples excluded |
| **N2** | **Correctness absorbed** | does it absorb what consumers reliably get *wrong* — focus order, ARIA state, two-channel colour, density, RTL, print, forced-colors | counted against the framework's own contracts |
| **N3** | **Effort saved** *(ease of work)* | what the consumer writes if we ship nothing | judged, with the composition written out |
| **N4** | **Consistency** | does it stop the same thing being re-invented differently per screen | judged |

**N2 is the axis that matters most, and it is not the same as N3.** Effort is
time; correctness is defects. A consumer can rebuild a badge in five minutes and
still ship a colour-only status that fails WCAG. We exist for N2.

### COST — why a user does not need us to ship it

| | axis | what it means | how it is scored |
|---|---|---|---|
| **C1** | **Already composable** | could shipped primitives do this | judged, composition written out; 3 = trivially |
| **C2** | **Payload** *(performance)* | minified CSS bytes, shipped to every user | measured: >3000=3, >1500=2, >600=1, else 0 |
| **C3** | **Runtime** *(performance)* | JS behaviours bound, listeners, layout reads | measured from `behaviors.json`: ≥3=3, 2=2, 1=1, 0=0 |
| **C4** | **Surface** *(simplicity)* | classes + variants we must keep, document, gate and never break | measured: >15=3, >9=2, >4=1, else 0 |

**Cost-to-remove is deliberately NOT here.** Per 45.5 it constrains which
*outcomes* are available; folding it in would let "hard to remove" inflate a
weak component's score.

### Benchmark → action

| NET | action |
|---|---|
| **≥ +4** | **Keep.** Recorded so the next sweep does not re-litigate it. |
| **+1 … +3** | **Keep, watch.** Fine today; re-score if payload or surface grows. |
| **0 … −3** | **Improve.** A specific change that moves an axis — usually N1 (put it in a screen) or C2/C4 (shrink it). |
| **≤ −4** | **Merge or deprecate**, subject to 45.5's cost-to-remove constraint. |

### Two limits stated up front

- **The Demand axis is blind to shell components.** `navbar`, `sidebar-nav`,
  `breadcrumb` and `app-shell` appear on all 18 docs pages but **zero** times
  inside a demo region — they are the frame, not the content. Scoring them 0
  would be an artifact. They are scored `—` on N1 and the docs site itself is
  the evidence of demand.
- **A 0 on Demand is a question, not a verdict** (carried over from Slice 37):
  it may mean genuinely unneeded, needed by a screen we have not written, or a
  screen that *should* use it and quietly does not.

---

## Measured inputs (all 39)

Bytes are minified per-component CSS. `surface` = classes + variants.
Total component CSS: **65,811 bytes minified**.

| component | screens | bytes | surface | behaviours | C2 | C3 | C4 |
|---|--:|--:|--:|--:|--:|--:|--:|
| form | 18 | 5957 | 28 | 12 | 3 | 3 | 3 |
| data-table | 18 | 5433 | 26 | 8 | 3 | 3 | 3 |
| icon | **1** | 4633 | 25 | 0 | 3 | 0 | 3 |
| tabs | 2 | 4037 | 5 | 0 | 3 | 0 | 1 |
| dashboard | 18 | 2956 | 27 | 1 | 2 | 1 | 3 |
| approval-workflow | 4 | 2759 | 13 | 0 | 2 | 0 | 2 |
| file-upload | **0** | 2204 | 7 | 1 | 2 | 1 | 1 |
| tree-table | **0** | 2177 | 3 | 1 | 2 | 1 | 0 |
| stepper | 2 | 2074 | 4 | 1 | 2 | 1 | 0 |
| button | 15 | 2016 | 13 | 4 | 2 | 3 | 2 |
| calendar | 1 | 2005 | 5 | 0 | 2 | 0 | 1 |
| tag-input | 1 | 1970 | 6 | 1 | 2 | 1 | 1 |
| sidebar-nav | — | 1672 | 6 | 1 | 2 | 1 | 1 |
| prose | **0** | 1641 | 1 | 0 | 2 | 0 | 0 |
| combobox | 1 | 1569 | 7 | 1 | 2 | 1 | 1 |
| badge | 18 | 1446 | 11 | 1 | 1 | 1 | 2 |
| alert | 4 | 1419 | 11 | 3 | 1 | 3 | 2 |
| dialog | 1 | 1400 | 7 | 0 | 1 | 0 | 1 |
| richtext | 15 | 1373 | 9 | 4 | 1 | 3 | 1 |
| quantity | 3 | 1332 | 8 | 2 | 1 | 2 | 1 |
| tree | **0** | 1327 | 4 | 0 | 1 | 0 | 0 |
| offcanvas | 1 | 1323 | 5 | 1 | 1 | 1 | 1 |
| segmented | **0** | 1278 | 3 | 0 | 1 | 0 | 0 |
| filters | 18 | 1228 | 5 | 1 | 1 | 1 | 1 |
| dropdown | 1 | 1094 | 7 | 0 | 1 | 0 | 1 |
| pagination | 2 | 1050 | 3 | 2 | 1 | 2 | 0 |
| progress | **0** | 1009 | 5 | 0 | 1 | 0 | 1 |
| amount | 2 | 967 | 15 | 0 | 1 | 0 | 2 |
| skeleton | **0** | 802 | 5 | 0 | 1 | 0 | 1 |
| avatar | 1 | 723 | 2 | 0 | 1 | 0 | 0 |
| state | **0** | 686 | 7 | 0 | 1 | 0 | 1 |
| breadcrumb | — | 675 | 1 | 0 | 1 | 0 | 0 |
| kv | 3 | 637 | 3 | 0 | 1 | 0 | 0 |
| navbar | — | 634 | 3 | 0 | 1 | 0 | 0 |
| ordered-list | 1 | 552 | 4 | 0 | 0 | 0 | 0 |
| kbd | 3 | 513 | 1 | 0 | 0 | 0 | 0 |
| byline | 2 | 442 | 4 | 0 | 0 | 0 | 0 |
| date | **0** | 403 | 5 | 0 | 0 | 0 | 1 |
| money | 2 | 395 | 3 | 2 | 0 | 2 | 0 |

---

## Scored — the components where the benchmark changes what we do

Controls first, so the instrument can be seen to discriminate.

| component | N1 | N2 | N3 | N4 | NEED | C1 | C2 | C3 | C4 | COST | **NET** | action |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|
| `data-table` *(control)* | 3 | 3 | 3 | 3 | 12 | 0 | 3 | 3 | 3 | 9 | **+3** | keep, watch |
| `badge` *(control)* | 3 | 3 | 1 | 3 | 10 | 2 | 1 | 1 | 2 | 6 | **+4** | keep |
| **`icon`** | 1 | 1 | 2 | 2 | 6 | 1 | 3 | 0 | 3 | 7 | **−1** | **improve** |
| **`tabs`** | 1 | 3 | 3 | 2 | 9 | 0 | 3 | 0 | 1 | 4 | **+5** | keep |
| **`prose`** | 0 | 1 | 2 | 2 | 5 | 2 | 2 | 0 | 0 | 4 | **+1** | keep, watch |
| **`tree`** | 0 | 2 | 2 | 1 | 5 | 2 | 1 | 0 | 0 | 3 | **+2** | keep, watch |
| **`segmented`** | 0 | 1 | 1 | 2 | 4 | 2 | 1 | 0 | 0 | 3 | **+1** | keep, watch |
| **`file-upload`** | 0 | 3 | 3 | 2 | 8 | 0 | 2 | 1 | 1 | 4 | **+4** | keep |
| **`tree-table`** | 0 | 3 | 3 | 1 | 7 | 0 | 2 | 1 | 0 | 3 | **+4** | keep |
| **`state`** | 0 | 1 | 1 | 3 | 5 | 2 | 1 | 0 | 1 | 4 | **+1** | keep, watch |
| **`skeleton`** | 0 | 2 | 1 | 2 | 5 | 1 | 1 | 0 | 1 | 3 | **+2** | keep, watch |
| **`progress`** | 0 | 2 | 1 | 2 | 5 | 1 | 1 | 0 | 1 | 3 | **+2** | keep, watch |
| **`date`** *(deprecated 45.3)* | 0 | 0 | 0 | 1 | 1 | 3 | 0 | 0 | 1 | 4 | **−3** | **deprecated — confirms 45.3** |

The controls land +3 and +4 against a low of −3, and the instrument reproduced
45.3's independent decision to deprecate `.bo-date`. **It discriminates.**

### The citations that matter

**`icon` — NET −1, the only live "improve".** It is the **third-largest
component at 4633 bytes with 25 classes** — bigger than `dashboard`, bigger than
`approval-workflow` — and **one** screen uses it. N2 is 1: it does absorb
forced-colors, but an icon is a mask painted with `background-color`, and a
consumer using inline SVG gets that for free. C4 is 3 because 12 variants is a
sprite list, not a design decision; each one is API we can never break.
→ **Improve, and the axis to move is C4/C2, not N1.** Do not put icons in more
screens to justify 25 classes. Ask whether the variant list should be a
documented convention over a shipped enum.

**`tabs` — NET +5 despite 4037 bytes and 2 screens.** N2=3 carries it: roving
tabindex, `aria-selected`, panel association and the arrow-key contract are
exactly what consumers get wrong, and this project has already shipped a tabs
bug that "worked exactly once" (Slice 35). Payload is high but the correctness is
not composable. **Keep — and this is the case where a value-only rubric and this
one agree for opposite reasons.**

**`file-upload` and `tree-table` — NET +4 each, on zero demand.** Both absorb
genuinely hard correctness (drag-and-drop with a real file input and a
visually-hidden control; hierarchical rows with `data-tree-level` and an
expand/collapse contract). A consumer re-implementing either gets it wrong. Their
0 on Demand is reading (b) — *a screen we have not written yet* — not (a).
→ Recorded as **keep**; the missing screen is a docs gap, not a component fault.

**`prose`, `state`, `skeleton`, `progress`, `segmented`, `tree` — all "keep,
watch" at +1/+2.** None is expensive; each is one screen away from clearly
earning its place. The honest reading is that our *pattern library* is thinner
than our component library, which is the finding in the next section.

---

## What ERP needs that we do not ship

Refreshed against `.roundtable/erp-gaps-2026-08-16.md`. Everything that list
queued has since shipped — `file-upload`, `tag-input`, `segmented`, `avatar`,
`calendar` — so this is a fresh pass, scored the same way: why a user needs it,
why they do not.

| gap | why a user needs it | why they do not | verdict |
|---|---|---|---|
| **Value help / F4 picker** — searchable dialog for choosing one master-data record from thousands (vendor, material, cost centre) | The single most-used interaction in SAP data entry. `combobox` handles a short list; picking from 40,000 materials needs search + filters + a table + paging | It is **composable today**: `dialog` + `filters` + `data-table` + `pagination` all ship. Adding a component would be the largest, most specific thing in the framework | **Build as a PATTERN, not a component.** Highest-value gap: it turns six "keep, watch" components into demonstrated ones |
| **Change/audit diff** — what changed on this record, by whom, from what to what | Change documents are a legal requirement in ERP, not a nicety. `timeline` shows *that* something happened; nothing shows *what changed* | Genuinely new surface (old/new value pairs, add/remove/modify states, two-channel without relying on red/green) | **Queue as a component** — the one real component-shaped gap |
| **Field help / tooltip** | ERP fields are cryptic codes (`CC-4021`, incoterm `DAP`). The 2026-08-16 pass rejected this as "too generic"; that was about tooltips generally, not field help | Hover-only help fails touch and keyboard; a `<details>` or a hint line under the field is often better and already ships (`bo-form-field__hint`) | **Refuse for now**, and say why on the form page: the accessible answer is the hint we already ship |
| **Toast / transient confirmation** | "Order saved" without stealing focus | Transient messages are an accessibility minefield, and `alert` + a live region already covers the accessible case | **Refuse**, restate on the alerts page |
| **Kanban / org chart / permission matrix** | asked for in some ERPs | Each is one screen in one module, not a framework primitive; high surface, near-zero reuse | **Refuse** — recorded so they are not re-proposed |

---

## What to do next — the benchmark's own answer

1. **Build the Value-help pattern.** It is the highest-value gap, needs **zero
   new components**, and it is the screen that gives `dialog`, `filters`,
   `pagination`, `combobox` and `state` the demand they currently lack. One
   pattern moves six components off "watch".
2. **Grill `icon`'s 12 variants** — the only NET-negative live component, and
   the axis to move is surface, not demand.
3. **Queue Change/audit diff** as the one component-shaped ERP gap.
4. **Do not** chase demand for `file-upload` / `tree-table` — they scored +4 on
   correctness absorbed; the gap is a screen, not the component.
