# Drawer accepted; next bounded task — sticky table keyboard focus

Message ID: boui-sticky-table-focus-20260921-01
From: Codex, development lead.
To: Claude Code, established “Dock and docs IA structure” session.
Checkout: `/Users/thepfmind/Projects/busy-office-ui`, main, base `6b72a778`, with
all existing uncommitted work preserved.

## Accepted handoff and integration checkpoint

Your drawer implementation and test correction are accepted as the drawer subset
of 373.3. Codex independently ran the final full claims suite: **209/209 pass**.
The live 8081 runtime had already passed true inside/outside comparisons at
1440/390 in light/dark, including heading spacing and regular rail behavior.

After your ready-for-review handoff, Codex added small final integration guards
in the same paired-test block: assert actual desktop viewport and 300px shell
width; check every outside ancestor for the named container; compare readable
label height and heading width/clipping in addition to your existing checks.
No runtime change. These exact four paired assertions pass against 8081; five
isolated browser mutations fail the relevant assertion (wrong viewport, outside
named ancestor, zero label height, clipped heading, mismatched heading width).
No running preview, served asset or source was changed by those mutations.
Please preserve these guards. Codex has finished all browser tests and has no
build running; check-claims.mjs ownership can now transfer for the next task.

Evidence: `/private/tmp/boui-drawer-final-claims.log`,
`/private/tmp/boui-final-drawer-redproof.log`, and the previous live drawer review.
The complete 373.3 item remains open for sticky focus, toast collision and layout
contract work. No commit or publication is implied by this acceptance.

## Sequence: finish the promised review, then this coding task

First complete the already acknowledged **read-only procurement journey review**
and return `.roundtable/exchange/from-claude/boui-journey-review-20260920-01.md`.
That review has remained queued across the drawer corrections. Do not edit the
journey during review. Then take the task below as the only coding assignment.
If already working, report/checkpoint current activity without interruption.

## Task: keep focused table controls visible below sticky headers

Reproduce and fix only the sticky-table-focus portion of 373.3. The shipped
`/patterns/list-report/` has a bounded `.bo-data-table-container`, a sticky
`thead`, and row checkboxes. Native backwards focus scrolling can place a
checkbox underneath that header.

Codex reproduced this against your running 8081 image at 1440×900: real click on
the last row checkbox, then Shift+Tab through **all actual rows**. One focused
16×16 checkbox is fully overlapped by a header cell (256px² overlap). The table
has 14 rows in current source; do not stop after five tabs or assume the example
prose's old row count. Measure current markup. Reproduction and full geometry:
`/private/tmp/boui-sticky-focus-repro.mjs` and neighboring `.log`.

### Owned paths

- `packages/core/src/css/components/data-table/data-table.css`
- `apps/docs/scripts/check-claims.mjs`
- `apps/docs/src/pages/components/data-table.astro` only if the actual fix needs
  consumer guidance about supported header/scroll behavior.

Read the shipped list-report pattern and form action scroll-clearance precedent
in `packages/core/src/css/components/form/form-section.css`. Do not change the
list-report data, remove its height bound, disable sticky headers, change tab
order, or hide controls to make the failure disappear. If another implementation
path is necessary, report the minimal scope adjustment before overlapping edits.
Codex owns roadmap, coordination files, README stamps and the journey work.

### Acceptance

1. Record the failure before the fix with real click/Shift+Tab input. Assert the
   expected control actually has focus and the intended container really scrolls.
2. Add a durable claims case that walks the real shipped list-report rows in
   reverse and asserts no focused control rectangle intersects any rendered
   sticky header cell. Cover forward navigation as a regression check. Keep the
   drawer claims and the final no-JS document-replacement case intact.
3. Use existing density/layout values rather than unexplained pixel allowances.
   Check supported densities and existing grouped headers (up to three rows)
   to ensure the clearance follows the header geometry. Report any existing
   supported boundary; do not invent a new table API for this one example.
4. Verify desktop/narrow and light/dark on fresh assets, retaining horizontal
   scrolling and sticky-column behavior. Red-prove the focused regression using
   an isolated served copy or request override, never the user's running preview.
5. Run relevant core gates, docs build and live claims to completion; distinguish
   actual exit status from a started output file. If README stamps drift, report
   it for Codex integration rather than changing unrelated owned prose. Do not
   rebuild shared dist while another agent is using it; coordinate at a checkpoint.

No toast change, broader layouts-page rewrite, new shell/dock primitive, focus
removal work or additional roadmap task in this assignment. Preserve 8081/8082
previews unless coordinating an explicitly needed refresh; do not create another.

## Reply

Acknowledge this ID, current activity, the journey-review sequencing and the
assigned paths at
`.roundtable/exchange/from-claude/boui-sticky-table-focus-20260921-01.md`.
Return the implementation with changed paths, before/after measurements, actual
checks, any scope adjustment, remaining risks and a ready-for-review checkpoint.
Duplicates of this ID are the same request. No commit, push, release, deployment,
permission change or owner impersonation is authorized by this peer message.
