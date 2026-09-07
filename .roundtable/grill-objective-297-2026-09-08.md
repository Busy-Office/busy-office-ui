# Objective grill — Slice 297 (2026-09-08)

**Scope note, written after a dispatcher collision.** This wake read
`Objective 4 / 3 … OVERDUE [297, 315, 332, 333]` and grilled all four. While it
was writing up, the scheduled cloud dispatcher pushed **its own Slice 336**, an
Objective grill of **315, 332, 333** — 29 assertions, three defects, deeper on
those three than this one was. Collision 5, and the first where both
dispatchers ran the same rule on overlapping scope.

**Its findings and this one’s do not contradict.** Both re-ran 332’s three lane
figures on different machines and both got them to the digit. That second
independent reproduction is kept below as corroboration; **315, 332 and 333 are
otherwise ceded to Slice 336**, which grilled them harder. What survives here
is **297**, which was in this wake’s overdue list and not in that one’s.

**Dispatched by rule 3**, `Objective 4 / 3 slices … OVERDUE [297, 315, 332, 333]`.

**Rule 1** no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → 0).
**Step 1** read both intakes in the REST form Slice 332 installed, with
`ENVIRONMENT.md` §8's controls: `/issues?state=open` → 200 len **1** (issue #2,
already triaged as `300.2`); `/discussions` → 200 len **0**; `/discussionz` →
**404**. Nothing new to triage. **Rule 2** `Standardize 3 / 4 … ok`.
**Rule 5** reports **STALE** (1 wake-date newer), so per `LOOPS.md` it could
not be evaluated and is not reported clear.

**Scope check per §6 step 0**: no prior grill in `.roundtable/` names any of the
four (`ls .roundtable | grep grill | grep -E '297|315|332|333'` → empty). All
four are in scope. Note 315 is *itself* an Objective grill; grilling a grill is
in scope here because nothing has re-run its assertions.

## Verdict: 1 defect in 4 slices. Every measured number reproduces exactly.

| # | Claim | Re-run | |
|---|---|---|---|
| 297 | `hasDiscussionsEnabled: true`, `stargazerCount: 0` | `has_discussions: True`, `stars: 0` | ✓ |
| 297 | "**three templates** enforce version/browser/theme/density…" | **two**; the third file is the router | ✗ **DEFECT** |
| 297 | config.yml carries three new contact links beside Documentation | Q&A, Ideas, Show-and-tell + Documentation = 4 | ✓ |
| 315 | `check-ci-ignores` `--self-test` sat below the early return | now at line **187**, above the exits at 243/269 | ✓ fixed |
| 315 | the self-test runs 18 cases | `self-test passed — the detector can fail (18 cases)` | ✓ |
| 332 | lane 1: 0 dead style attrs, 1,365 live, 357 multi-declaration | `0 dead … 1365 live … 357 attribute(s) carry more than one` | ✓ |
| 332 | lane 2: `74 · 242 · 230 · 8` | `74 source file(s) · 242 rule(s) · 230 distinct bodies · 8 body(ies)` | ✓ |
| 332 | lane 3: 119 pages, median 798, 113,787 words, 10 over 2x | all four exact | ✓ |
| 332 | `ENVIRONMENT.md` 731 lines / 6,316 words | `731 6316` | ✓ |
| 333 | the five markup consts are deleted | no `const <name> =` survives | ✓ |
| 333 | the built page ships 4 `<pre><code>` blocks | not re-measured (dist not built this wake) | — |

## The defect: Slice 297 counted the escape hatch as an enforcer

`.github/ISSUE_TEMPLATE/` holds three files and exactly **two** are templates:

```
git log --all --pretty=format: --name-only -- '.github/ISSUE_TEMPLATE/*' | sort -u
#   bug_report.yml   config.yml   feature_request.yml      (no file was ever deleted)
```

`config.yml` is not a template and enforces nothing. It is the **router** — the
four contact links — and its **first line is `blank_issues_enabled: true`.**

So the sentence is not off by one in a harmless direction. The file folded into
the count of things that *enforce* is the one file that lets a reporter skip
enforcement entirely.

### What makes this worth a finding rather than a typo

**The correct fact was already written down, and the error is a compression of
it.** `ROADMAP-archive.md:15107`, the entry 297 was summarising, reads:

> bug report form (…) + feature request form (…) + `config.yml`
> (**blank issues on**, docs link)

Two forms, named separately, with `config.yml` third and its blank-issue
setting stated outright. Slice 297 compressed that into "three templates
enforce", which loses both the distinction and the setting.

**And the loss had a measurable cost one slice later.** `297.1` asked whether
the router worked; Slice 335 answered it by pulling the API, noticing both
issues carry **zero labels**, and reasoning from `labels: ["bug"]` /
`labels: ["enhancement"]` in the two forms that neither form had rendered. That
conclusion — reporters can and do go around the forms — is what
`blank_issues_enabled: true` says directly. The archive knew it on 2026-08-30;
297 dropped it on 2026-09-06; 335 rediscovered it on 2026-09-08.

This is an instance of a rule `CLAUDE.md` already carries — *when the item's
PREMISE is itself a measurement from an earlier wake, re-checking it is part of
the criterion* — and it is filed as an instance deliberately, **not** as a new
section. `158.2` has the loop's prose growth open, and a fresh section restating
a neighbouring rule is the growth that item is about.

**No gate.** A detector asserting "the roadmap's template count equals the count
of non-`config` `.yml` files" would fire on one sentence in one slice and is the
ceremony the base-rate rule refuses. Corrected in place, with the reasoning.

## Two instrument notes from running this grill

**1. The removal check nearly produced a false finding, exactly as documented.**
The first pass at 333 grepped the five const names in `motion.astro` and found
**2–3 hits each**, which reads as "the deletion never happened". They are the
comment the deleting edit wrote to explain itself (lines 44, 60, 302). This is
`CLAUDE.md`'s *"Verifying a removal: assert on structure, never on raw text"* in
its exact predicted form; `grep -nE "const (name) ="` returns nothing and the
deletion holds. **The rule caught a live case in the session that re-read it.**

**2. `npm run -s` against a wrong workspace is SILENT and reads as a clean lane.**
Re-running 332's lanes, `npm run -s scan:dead-style -w @busy-office/docs`
printed **nothing at all** and did not visibly fail — the workspace is named
`docs`, not `@busy-office/docs`, and `-s` swallowed npm's
`No workspaces found` error. An empty lane output is indistinguishable from a
clean lane.

This matters because the Standardize sweep IS these four commands, and a lane
that never ran would be recorded as clean. Slice 332 was not affected — it
recorded real figures, all four of which reproduce. Carried as `337.1` for the
sweep to state its own evidence rather than rely on the operator noticing an
empty stdout.
