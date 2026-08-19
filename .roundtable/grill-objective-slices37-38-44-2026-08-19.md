# Objective grill — Slices 37, 38, 44 (2026-08-19)

Dispatched by rule 3 at 3/3, third consecutive wake chosen by the counter.

Evidence gate: ≥2 independent sources for `Evidence`, else `Hypothesis`.

---

## H1 — Six new instruments this window; zero were correct on first run
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

| instrument | first run | what was wrong |
|---|---|---|
| `check-selftests` (42.1) | failed its own rule | matched the *string* `--self-test`, which its own tag text contains |
| self-tests ×3 (42.3) | failed their own rule | asserted against a **copy** of the detector |
| `check-composited` (44.2) | failed its own rule | `parseFloat` on `var()` → `NaN`, skipping **4 of 7** states |
| `derive-floor` (38.1) | wrong | ignored prefixes (Chrome **136**) and dropped a superseded partial (Safari **26.2**) |
| reach query (38.2) | wrong | browserslist `chrome`/`safari` are DESKTOP ids — **27.29%** for an 80.20% floor |
| `check-learning-path` (39.2) | failed its own rule | four detectors passed 18/18 measuring nothing |

**Six for six.** And a seventh happened while writing *this grill*: the
prose-drift detector below reported 43, then 16-of-16, before landing on 11.

The previous two grills treated this as a discipline problem and recorded it as
"held up, no new rule". Three grills of evidence say otherwise: **a first-draft
instrument in this project is wrong essentially always.** That is not a
character flaw to correct, it is a base rate to design around.

**What is working, and it is the whole story:** all six were caught *before
landing*. Nothing shipped broken. The catches came from three specific moves,
each now written down — red-proof with a verified injection, share one
implementation between gate and test, and treat an implausible number as an
instrument defect. 44.1 was written one day and caught the 27.29% error the
next.

→ **Fed back as 46.1**, framed as the base rate rather than as advice: an
instrument's *first* output is not evidence, and the adversarial check runs
before the number is used, not after it looks wrong.

---

## H2 — The patterns claim components they do not render — 11 of 16 pages
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence**

The 37.2 pilot found two by hand: `invoice-list` lists `pagination` and does not
paginate; `master-detail` says the panel "becomes a full-width drawer" and links
`offcanvas`, which no screen renders. Swept properly, it is **11 of 16 pattern
pages**, listing 20 components under **"Components used"** that the page never
renders:

```
app-launch    sidebar-nav        invoice-list  pagination, state-patterns
approval      avatar, dialog,    master-detail offcanvas
              richtext           record-detail prose
detail-form   kv, money          reporting-…   kv, progress
filter-panel  dropdown           settings-admin alerts, dialog, kv
goods-receipt alerts             staging       file-upload, state-patterns
```

"Components used" carries a complexity badge and reads as *this screen is built
from these*. Where the screen does not render them, the page overstates itself —
and a reader copying the pattern gets less than the list promised.

This is a **new defect class** for this project: not a broken gate and not a
broken component, but **documentation that disagrees with its own demo**. Every
existing gate passes on all 16 pages, because each page is individually valid.

Two honest caveats: some rows may be defensible (a pattern can reference a
component in its *data contract* without demoing it), and the number took three
attempts — 43, then 16-of-16, then 11 — before the class names came from
`api.json` instead of the page slug.

→ **Fed back as 46.2.**

---

## H3 — Third consecutive flat grill
**Seat: Chair · WORKING · MEDIUM · Evidence**

+212 / −13 lines of framework code; **248 classes, 39 components — unchanged for
the third grill running**. Gates 24 → 25.

Three windows, one component (`calendar`), which the 37.2 pilot then scored at
**zero demand** because no screen uses it. The consolidation phase flagged two
grills ago has continued without a decision, and the review found that even the
one thing built in it is not yet earning its place.

That is not an argument that the work was wrong — 43.1 was a shipped WCAG
failure and 38.2 settled a real question with real numbers. It is an argument
that **nobody has chosen this**, and it is now three grills old.

---

## H4 — npm 0.1.1, seventh consecutive grill
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

Unchanged. The published package still contains the `opacity: 0.6` WCAG failure
fixed in 43.1 and gated in 44.2. Seven grills is long enough that repeating the
sentence adds nothing; what is new is only that the defect argument is now
concrete rather than rhetorical.

---

## Feeding back into triage

- **H1** → 46.1: write the base rate into CLAUDE.md — first output is not
  evidence; the adversarial check comes first, not after it looks wrong.
- **H2** → 46.2: reconcile "Components used" with what each pattern renders, and
  gate it so the docs cannot overstate themselves again.
- **H3** → recorded, third time. Needs an owner decision, not another finding.
- **H4** → re-stated, owner-blocked.
