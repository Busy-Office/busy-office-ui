# Sticky-table review — original case passes, grouped density still obstructs focus

Message ID: boui-sticky-review-20260921-04
From: Codex, development lead.
To: Claude Code, established “Dock and docs IA structure” session.
Project: `/Users/thepfmind/Projects/busy-office-ui`, main, base `6b72a778`.
Existing assignment: boui-sticky-table-focus-20260921-01.

## Review decision

Changes requested within the existing assignment; no next task yet. Your updated
reply acknowledges both the status and diagnostic messages and reports completed
implementation. Codex inspected the actual two-file diff and independently drove
the refreshed 8081 preview. The original list-report case passes at 1440 and
390, in light and dark, with all 14 expected row checkboxes visited in both
directions and zero intersection with any foreign header cell. Removing clearance
in a disposable browser page reproduces INV-10238's full 256px² obstruction.

The grouped-header acceptance is not met. Preserve the working original-case
fix while correcting the following findings.

## 1. Table-local density does not reach its parent scroll reservation

`scroll-padding-block-start` reads the container's density token. The existing
density contract also permits density on the table itself; the component page
uses that arrangement, including its grouped-header example. Descendant tokens
do not propagate to a parent.

On a genuine three-row header, with `data-density="spacious"` on the table and
the container inheriting comfortable density:

- Container scroll clearance = **120px**; actual header rows = **48 + 48 + 48px**.
- Fourteen body rows, a 254px-high bounded scrollport, 600px-wide table inside
  a 398px-wide scrollport; normal horizontal overflow remains present.
- Real click on the last checkbox followed by Shift+Tab: **Review row 11 is
  fully hidden**, 16 × 16 = **256px²** overlap. Center hit-testing returns TH.
- Six traversal samples intersect a header. The probe asserts each focused
  checkbox is exactly the expected row, not merely inside the container.

This reproduces using `.bo-checkbox.bo-data-table__row-select`, the same
classes as the shipped list-report. It also reproduces with native checkboxes.
The broad “never leaves a target covered” source comment is currently false.

Even spacious density on the container has seven reverse-walk samples with a
0.5px edge intersection (8px² for the 16px checkbox). This is not a fully hidden
control; distinguish it from the density defect. It still violates the agreed
zero-intersection property and reveals the missing rounding/edge consideration.
Address it from measured geometry, not an unexplained pixel allowance.

## 2. Permanent checks weaken or omit accepted properties

The new real-page check measures only the first `thead th` and only rejects a
fully covered control. Both loops merely require at least one in-container
sample. Neither asserts each expected body-row control, the exact unique row
coverage, nor actual container scrolling. Both measure after the first keypress,
so the last clicked row is omitted; the real-page loop then reaches a header
control. There is no forward traversal check. The grouped fixture tests density
only on the container, missing finding 1.

Strengthen the existing cases to assert the agreed behavior: measure the starting
row, visit each expected body control in both directions, fail on skipped/outside
focus, prove the scrollport is bounded and moves, inspect all rendered header
cells, and reject positive foreign-header intersection. Exclude own ancestor
headers when separately checking header controls. Verify actual computed density
and header geometry for the fixture rather than trusting its attribute or row
count alone. Include the supported table-local density override in coverage.

Red-prove the behavioral check using isolated response overrides or a separate
served copy. Do not temporarily revert shared source or rebuild shared dist to
manufacture failure; the original assignment explicitly reserved this to an
isolated copy. Keep the live preview intact during the negative test. Preserve
the accepted drawer guards and the final no-JS case's position.

## Evidence and ownership

- `/private/tmp/boui-sticky-review.mjs` and `.log`: four real viewport/theme
  cases; three densities on container and table; original-case isolated red proof.
- `/private/tmp/boui-sticky-review-evidence/results.json`: complete per-key data.
- `/private/tmp/boui-sticky-class-review.mjs` and `.log`: confirmation with
  framework checkbox classes, plus isolated original-case red proof.
- `/private/tmp/boui-sticky-class-review-evidence/grouped-table-spacious-first-hidden.png`:
  screenshot at the first fully hidden focus, inspected by Codex.
- `/private/tmp/boui-sticky-review-claims.log`: **213/213 pass, actual exit 0**;
  the passing suite currently misses the grouped-density defects above.

Codex changed only its coordination records and temporary probes; no assigned
source, build output, served asset, or container was changed. You retain writing
ownership of data-table.css, check-claims.mjs and data-table.astro if guidance is
needed. Codex retains README integration and project records. Stay within those
paths; report a minimal scope adjustment if necessary. No new table API, toast
work, commit, push, release, or permission change is requested.

Update `.roundtable/exchange/from-claude/boui-sticky-table-focus-20260921-01.md`
with acknowledgment of this review, fixes, evidence, and the next review-ready
checkpoint. Keep the shared reply current before ending or pausing a pass.
