# Owner decisions — recommendations for every item waiting on you (2026-09-26)

**Advisory.** Nothing here is decided until you write it into ROADMAP.md's
`## Milestone M1` section (the field block and the O-table). The decision texts
themselves are in `.roundtable/milestone-draft-2026-09-25/5-open-decisions.md`.

**How this was produced.**
1. Six read-only reviewers covered one group of decisions each (app scope,
   release, experimental tier, loop configuration, Jev, and everything else).
   Each re-measured every premise it relied on, because the decision texts
   quote counts taken on 2026-09-25 or earlier. Several had moved, and three
   were false (see the appendix: `holds: no`).
2. A critic checked the recommendations against each other, then re-measured
   the four most likely to be wrong. Two survived, one needed an added
   reference, and one changed (the Fable 5.1 premise was false).
3. I ran the proposed field block below through `milestone.py`'s own parser.
   All 10 fields pass, 0 are unfilled, and Modules parses as 8 entries.

**What this does not cover.**
- Fable 5.1 and Opus 5.5 prices are unverified.
- The app's display name and the demo industry are your taste; defaults are
  given.
- The odds that the M0 retry passes are an estimate (about 40-60%), not a
  measurement.
- Where a reviewer quotes a Jev number, it is advisory and no recommendation
  rests on it.

## Start here — the path to `Status: ACTIVE`

1. **M0: extend, once.** Run 398.1, 398.2, then one fresh re-score
   (`m0-wakes 13`). If that fails only on new wording-level Invalids with no
   dimension at 1, activate anyway and file them. Do two things first:
   - **Archive the cloud sessions.** The disabled routine still has 302
     active sessions of 307. Two were revived on 2026-09-25. The loop's
     RemoteTrigger tool can list them but has no archive action.
   - **Bring `.roundtable/grill-kev-in-the-loop-2026-09-21.md` onto main**
     from `park/owner-checkpoint-2026-09-20`. ROADMAP.md cites it, and it
     exists only on that branch. It is a third dead reference that a fresh
     scorer would count against Correctness (added to 398.1).
2. **Paste this field block** over the `OWNER` lines. Keep `Status: DRAFT`
   until the re-score passes.

   ```
   App: busy-office-erp yes
   Modules: home=home:Home · o2c=sales:Sales · p2p=procurement:Procurement · inv=inventory:Inventory · prod=production-planning:Production planning · distribution=distribution:Distribution · fin=finance:Finance · configuration=configuration:Configuration
   Devices: desktop · phone · rugged-rf no
   Precedence: interleave 1/3 track=defect
   Rules-2-3: scoped
   Dispatcher: local
   Tiers: top=claude-opus-5-5 · balanced=claude-sonnet-5 · fast=none
   Planner: top
   Direction-drift: off
   Budget: m0-wakes 13 · wakes 60 · agents/wake 8 · workflow-wall 90m · experimental 2 · resume-lines 120 · direction-items 5
   ```

   Separate Modules entries with ` · `. A list separated by `, ` passes the
   check but is read as one module (filed as 398.4).
3. **Fill the O-table cells** O5-O18 with your answers. Filling O11, O12, O14
   and O16 turns the four loop-written fields into owner-set ones, and closes
   398.3 as satisfied.
4. **Before the loop reaches 394.4, which is milestone dispatch #4:**
   - answer O7 (`experimental`), O8 a-f and O9;
   - publish 0.9.0 (O6). It is fixes only: classes, `data-bo-*` and JS
     exports are identical to v0.8.0. Publishing closes 394.3, which every
     experimental admission waits on. Otherwise the loop stops at a one-way
     door there.

**The call most worth a second look: RF devices (O5f → `rugged-rf no`).** You
engaged RF on 2026-09-25 (the 388.2 journey grill became Slice 389). Saying no
does not throw that work away:
- the 5 RF defect-track items still run through the interleave;
- 389.2 should move to the defect track, because published RF pages claim
  "Enter posts the scan" and Enter does nothing;
- the 17 design findings go back to the backlog.

What it buys: M1 drops from 61 to 42 items, and Phase 2 from 34 to 15. RF
already ships on its own track, and the first user's contract has no
scan-task screen kind. If RF is core to the long-use app, answer yes: the
milestone roughly doubles its Phase 2.

**Planner model (O14).** `Planner: top` runs the planner on Opus 5.5 at xhigh,
stronger than builds only by effort. Fable 5.1 is available: it appears in
14,668 transcript messages, 9 of them workflow subagents in this project. The
Planner field accepts only a tier today, so Fable needs a small `milestone.py`
change. Switch `Planner` to `claude-fable-5-1` once that lands.


## Conflicts

1. **Two proposed field values do not match `milestone.py`'s field rules (O5a, O5b).** I imported the checker (`_check_value`) and fed it the reviewers' exact values.
   - The App text "Busy Office ERP; first user: busy-office-erp yes" is **rejected**. `busy-office-erp yes` passes.
   - A Modules list separated by ", " **passes, but is read as 1 entry**, so the file quietly sees one module.
   - **Keep:** `App: busy-office-erp yes`. "Busy Office ERP" is the display name, which is the owner's taste, and belongs in prose.
   - **Keep:** write Modules with ` · ` between entries.
   - **File a defect:** the Modules check should reject any entry containing ", " or a second "=".

2. **The planner model conflicts with the owner's "stronger planner" intent (O14, prefill-Planner).** With top=claude-opus-5-5, the planner runs the same model as build and is stronger only through effort (xhigh). The reviewer's reason for not using Fable is false (see Re-check 3).
   - **Keep:** Tiers `top=claude-opus-5-5 · balanced=claude-sonnet-5 · fast=none` and `Planner: top` so activation can happen.
   - Then have the loop let the Planner field accept a model id (the rule at milestone.py:108 plus `route_model`). After that, set `Planner: claude-fable-5-1`.
   - Planner runs are rare (D1 at most once a day, plus sharpen bounces), so the cost stays bounded. The Fable 5.1 price is still unverified.
   - Jev stays out of the planner role, which is consistent with O13 and shadow mode.

3. **The M0 retry vs the parked records and the cloud sessions (M0-FAIL, M0-exit, O13, park branch, O1).** Both M0 reviewers agree: run 398.1, then 398.2, then one fresh re-score, with m0-wakes set to 13.
   - The problem: ROADMAP.md:1372 cites `grill-kev-in-the-loop-2026-09-21.md`, which is missing on main. 398.1's N5 bullet (:588) names only "two dead paths", so a fresh scorer could fail the retry on this third one.
   - **Keep:** bring the four `.roundtable` records from a9a2d9bb onto main, and archive the cloud sessions (O1), both **before** the re-score.
   - **Keep loop-config's single-retry fallback** rather than other-owner's open-ended "never ACTIVE without the test".
   - Set the ACTIVE date to the day of activation.

4. **RF scope vs the Devices field, 389.2, 389.6/389.7, the journey and O8f.** With O5f = no:
   - O8f's RF clause no longer applies.
   - 389.6 and 389.7 close as superseded.
   - The journey code stays parked but gets pushed to origin. Its purchasing and approval screens become inputs to the Procurement briefs, as app-scope says; the journey is not a module.
   - The remaining problem: 389.2 records published RF pages that claim "Enter posts the scan" while Enter does nothing. Under "no", that would wait until the milestone closes, which breaks CLAUDE.md's rule that runtime claims must be executable.
   - **Keep** O5f = no, but give 389.2 `Track: defect`.

5. **Experimental cap 2 vs early admissions (O8b, O8c, 395.2, 373.6).**
   - `workspace` may take a slot at 395.2, and under O8c it counts once across all modules. The dock (373.6c) could take the other slot before 396.3.
   - Cap 2 is still right: the gap ledger's running count is pilot 13, module two 2, module three 1, module four 0 (`.roundtable/erp-suite-gaps.md:957`).
   - **Keep 2**, but re-check the first time a need waits at the cap, not at 396.13.

6. **O10 ordering vs the frame.**
   - Option (a) only affects 396.2 and 396.5 if 112.4 is tagged M1. Rule M sorts by age, so it would then dispatch straight after 394.10, ahead of 395.1.
   - 396.2's only `After:` is 394.10 (checked).
   - **Keep (a):** tag 112.4 `Milestone: M1 · Phase: 2` with `After: 395.1`, and add `After: 112.4` to 396.2. That keeps the frame first and pins the A/B metric before 396.3.

7. **Release order vs the experimental tier (O6, O8a, O9, release-sequence).** These do not conflict.
   - 0.9.0 is fixes only, and publishing it closes 394.3.
   - O9 must be answered with O7 and O8 before 394.4 (dispatch #4), not at 394.10.
   - The 0.9.0 release prep (renaming the CHANGELOG heading, bumping versions) must not use up an M0 wake.

8. **Budget vs item count vs tagging (O17, O5f, O12).**
   - `wakes 60` was sized against 61 items. With RF out, M1 has 42.
   - Defect rows tagged with both labels count toward `wakes`.
   - **Keep 60** as a checkpoint: the `budget` stop halts the loop and reports. `experimental 2` equals O8b.

9. **375.11 (O11 vs other-owner).** loop-config wants a NEEDS-RUNTIME marker; other-owner wants the owner to install Firefox with brew. **Keep both, in sequence:** add the marker now, and lift it once a stock-Firefox launch succeeds, since that launch is still untested.

10. **Frame dispatch number.** experimental-tier's "#26" is stale; three reviewers measured #17 counting only the milestone's own items. Use #17. This is a fact correction, not a decision conflict.

11. **O18a lists "dock" as refused vs 373.6 superseding the refusal for the dock.** These are consistent if the 373.6 answer is an owner entry naming new evidence (395.1's options note), which is O18a's own mechanism.

## Re-checks

1. **O6: "no new public surface".** The reviewer's class count was 283 at three revisions, and a value identical across inputs is suspect.
   - **Command:** for v0.8.0 and HEAD, `git grep -h -o -E '\.bo-[a-zA-Z0-9_-]+' <rev> -- 'packages/core/src/css/**/*.css' | sort -u`. I did the same for `--bo-*` identifiers, `data-bo-*` in `packages/core/src` and `export (function|const|class)` in `src/js`, then compared the sets with `comm -3`.
   - **Result:**
     - Classes: 283 and 283, with **0 set difference**.
     - `data-bo-*`: 3 and 3, identical.
     - JS exports: 48 and 48, identical.
     - `--bo-*`: 397 → 400. The three new ones (`--bo-cell-message`, `-above`, `-below`) are `anchor-name` and `@position-try` identifiers in data-table.css:713-739, added by 375.9 and 375.11. They are internal names, not tokens.
   - **Survives.**

2. **O5f: how many M1 items RF accounts for.**
   - **Command:** a Python parse of ROADMAP.md for open items, their `Milestone: M1 · Phase:` tags and any `After:` naming 396.12. As the raw count I used `grep -c -E '^\s*[0-9]+\. \[ \]' ROADMAP.md`.
   - **Result:**
     - 104 raw checkboxes = 104 parsed (one has no numeric id: "AT runtime evidence").
     - M1 has 61 open items: Phase 0 has 3, Phase 1 has 22, Phase 2 has 34, Phase 3 has 2.
     - 19 items are tied to RF (17 from Slice 389, plus 389.14 and 396.12), and all 19 are Phase 2. 397.2 also names 396.12, but it is the close item.
     - With RF out, M1 goes from 61 to 42 items and Phase 2 from 34 to 15.
   - **Survives.** The reviewer's Phase 2 count of 35 is off by one. The same check found the 389.2 false-claim problem (Conflict 4).

3. **O14: "no transcript contains claude-fable; a Fable subagent is unverified here".**
   - **Command:** `grep -r -h -o -E '"model":"claude-[a-z0-9.-]+"' --include='*.jsonl' ~/.claude/projects | sort | uniq -c`, then the same scoped to this project and to `subagents/`.
   - **Result:**
     - `claude-fable-5-1` appears in 14,668 messages across 433 transcripts.
     - In this project: 1,411 messages on 2026-09-19, including **9 workflow-subagent transcripts** (`5a45bcce…/subagents/workflows/wf_fe75ba68-326/`).
     - The latest use anywhere is 2026-09-23T23:04.
     - The reviewer searched only session 1dbfe40a.
   - **The premise is false, so the recommendation changes** (Conflict 2).

4. **M0-FAIL: "398.1's text edits clear the Invalids".**
   - **Command:** for every `.roundtable/…` path cited in ROADMAP.md, LOOPS.md, CLAUDE.md, DESIGN.md, RESUME.md and STATUS.md, I ran `test -e`. I also ran `grep -n -F grill-kev-in-the-loop ROADMAP.md` and `test -e .roundtable/grill-kev-in-the-loop-2026-09-21.md`.
   - **Result:**
     - 5 cited paths are missing. Two are the known N5 files (`milestone-m1-prompt.md`, `grill-milestone-m1-2026-09-25.md`).
     - Three are future outputs that Accepts name, which is fine: `ab-module-sets-protocol.md`, `adr-published-names-are-shapes-2026-09-25.md`, `queue-screen-shadow.jsonl`.
     - Separately, the citation at ROADMAP.md:1372 is a bare filename and `test -e` exits 1. My path-prefix grep missed it, as the re-score's N5 check did, so 5 missing paths is a floor, not a total.
   - **Survives only if the 1372 reference is added to 398.1** (Conflict 3).

## Order

**(a) Blocks `Status: ACTIVE`, most-unblocking first**
1. O5a, O5b and O5f: App, Modules, Devices. These also unblock 394.2, 395.1 and all of 396.x.
2. The M0-FAIL answer (extend, m0-wakes 13). Two prerequisites come before the retry: O1's session archive, and bringing the park-branch records onto main.
3. O14 (Tiers) and O17 (Budget).
4. The O11, O12 and O16 decision cells, plus Planner inside O14. This makes the loop-written fields owner-set and satisfies 398.3.

**(b) Blocks a specific later item**
- **394.1 ADR acceptance:** blocks 394.4, 394.9, 395.1 and 396.1, so it gates the first productive dispatch.
- **O7, O8a-f and O9:** block 394.4 (dispatch #4). Without them the loop hits its one-way-door stop there.
- **O6 publish:** blocks 394.3, and through it every experimental admission and 397.2.
- **O5c:** blocks 395.1 and 396.3.
- **O5e, O18b and O18d:** block 396.3.
- **O5d:** blocks 396.7.
- **O18d-GAP21:** blocks 394.8 and 396.6.
- **O10:** blocks 396.2 and 396.5.
- **O13, O13b, 394.18-mode and O15:** block 394.13-394.16 and 397.2.
- **249.10:** blocks 249.7.
- **389.6/389.7:** close once O5f is recorded.
- **Waiting on earlier work:** 373.6 after 395.1, 394.16 after 394.15, 396.13 after 396.5. 393.13 affects only that item's wording.

**(c) Independent owner actions**
- O1 archive: do this first anyway, because it also helps the retry.
- Publishing 0.9.0.
- Pushing the park branch.
- The issue #2 reply.
- `brew install --cask firefox`.
- `npx @guidepup/setup`.
- 369.1, 374.4, 296.3, 249.11, 249.12, 249.13, 273.2, 373.8, O18a and O18c.

## Final table

| id | recommendation | agrees with doc | confidence | blocks |
|---|---|---|---|---|
| O5a (critic) | App field `busy-office-erp yes`; display name Busy Office ERP is your taste; nine-kind check-markup fixture excludes placeholder screens. | no-doc-rec | medium | ACTIVE; 394.2 |
| O5b (critic) | Eight ` · `-separated modules: home, o2c=sales, p2p=procurement, inv, prod=production-planning, distribution, fin, configuration; crm joins Sales. | no-doc-rec | medium | ACTIVE; 394.2, 394.9, 395.1, 396.x |
| O5c | Profile in the user menu; Configuration a rail module; Settings = affects me, Configuration = affects others. | no-doc-rec | medium | 395.1, 396.3 |
| O5d | AP and AR are Finance sections; invoice URLs kept; two facets each plus also-called words. | no-doc-rec | medium | 396.7; facets for 396.8, 396.10 |
| O5e | Discrete pump and marine-fittings maker, make-to-stock, spare-parts distribution arm; taste, and the default matches existing data. | yes | high | 396.3 onward |
| O5f (critic) | `Devices: desktop · phone · rugged-rf no`; untag the 19 RF items; give 389.2 `Track: defect`. | no-doc-rec | medium | ACTIVE; 395.1, 396.12 |
| O18a | Confirm; cite drag by its slices, not :2613; narrow §9.1's GAP-21 line to the graph component. | yes | high | none (396.3 reads §9.1) |
| O18b | Publish placeholders with a generated Placeholder badge; leave them out of the complete-screen count and llms.txt Worked screens. | yes | high | 396.3, 394.10 |
| O18c | Confirm the 9 parked items; keep 381.1 wired until close; 398.x follow the M0 answer. | yes | medium | none |
| O18d | AI briefs with ≥2 sources counted by registrable domain; notebook is a lead only; your read does not block; realism reviewer gates. | no | medium | 396.3-396.10 |
| O18d-GAP21 | Queue 396.6's where-used screen as GAP-21's second use; keep the graph component refused. | no-doc-rec | high | 394.8, 396.6 |
| O6 | Publish 0.9.0 plus create-ui 0.2.0 now from HEAD, fixes only; closes 394.3 and 377.5. | no-doc-rec | high | 394.3 → experimental admissions, 397.2 |
| O9 | Approve now with O7 and O8, extended: api.experimental, status fields, introduced.json sibling key; ship in 0.10.0. | yes (timing: before 394.4) | high | 394.4, 394.5, 394.9, 394.10 |
| release-sequence | 0.9.0 now; 0.10.0 after 394.10 with Added and Experimental entries; release from main; refresh introduced.json after 0.9.0. | no-doc-rec | medium | only orders O6 and O9 |
| O7 | Tier word `experimental`. | yes | high | 394.4 → 394.5-394.7, 394.17 |
| O8a | Ship in the tarball at dist/css/components/<name>.css, outside index.css, marked, no Breaking entries. | yes | high | 394.4, 394.5, 394.17 (after 394.3) |
| O8b (critic) | Cap 2, components and patterns together; re-check the first time a need waits at the cap. | yes | medium | 394.7; ACTIVE (Budget) |
| O8c | Independent = distinct (job, pattern) pairs using the part unchanged; a component's two pairs need different pattern ids. | yes | high | 394.7, 394.8 (after 394.9) |
| O8d | One real use plus a queued second use on another pattern, cited as a resolvable ROADMAP item id. | yes | medium | 394.8, 394.17, 397.1 |
| O8e | The loop's N.3 grill graduates; you approve at release through a generated "Graduated since vX" list. | yes | medium | N.3 items, 394.17 |
| O8f | No: experimental parts meet the framework floor; newer features only as polish enhancements (RF clause moot). | no-doc-rec | high | 394.4, 394.17 |
| O10 (critic) | (a) Screen Contract, warnings first; tag 112.4 M1 with `After: 395.1`; add `After: 112.4` to 396.2. | yes | medium | 396.2, 396.5, 112.3/112.4 |
| M0-FAIL (critic) | Extend: 398.1 (plus the :1372 reference), 398.2, one re-score; m0-wakes 13; one retry, then ACTIVE. | no-doc-rec | medium | ACTIVE; 398.1-398.3 |
| O11 | `Precedence: interleave 1/3 track=defect`; 375.11 gets a NEEDS-RUNTIME line before ACTIVE. | yes | high | ACTIVE |
| O12 | `Rules-2-3: scoped`; tag defect rows `--milestone M1 --track defect`; fix §11's record command. | yes | high | ACTIVE |
| O14 (critic) | Tiers top=claude-opus-5-5 · balanced=claude-sonnet-5 · fast=none; Planner then moves to claude-fable-5-1 via a grammar change. | yes (partly) | medium | ACTIVE (Tiers) |
| 393.6-none-tier | Confirm: a `none` tier runs on top, and telemetry records the substitution. | yes | high | O14's fast=none |
| O16 | D1 before rule 6 Polish, at most once per 24 h; `Direction-drift: off`. | yes | high | ACTIVE (cell) |
| O17 | `m0-wakes 13 · wakes 60 · agents/wake 8 · workflow-wall 90m · experimental 2 · resume-lines 120 · direction-items 5` | yes | medium | ACTIVE |
| prefill-Precedence | Stands; write it into the O11 cell. | yes | high | ACTIVE; 398.3 |
| prefill-Rules-2-3 | Stands; write it into the O12 cell; §11 reads `--milestone M1 [--track defect]`. | yes | high | ACTIVE; 398.3 |
| prefill-Planner (critic) | `top` for activation; switch to claude-fable-5-1 once Planner accepts a model id. | yes | medium | ACTIVE; 398.3 |
| prefill-Direction-drift | Stands at off; write it into the O16 cell. | yes | high | ACTIVE; 398.3 |
| O13 | Approve JQ as Jev's third point in shadow; amend all five rule sites; restore the grill-kev file to main. | yes | medium | 394.14-394.16, 397.2 |
| O13b | Only committed public-repo text leaves the machine; JQ payload ≤1,500 chars; never ERP, NotebookLM, owner or secret data. | yes | high | 394.14, 394.18 |
| 394.18-mode | `mode: shadow` until 394.16; reject escalate-only. | yes | high | 394.14 |
| O15 | Yes: count discovery re-plans as execute, by a mechanical rule committed before any Jev call. | yes | high | 394.13 → 394.14-394.16 |
| M0-exit (critic) | Same as M0-FAIL; fix the :1372 reference and archive the sessions before the re-score; single-retry fallback. | no-doc-rec | medium | ACTIVE; 398.1, 398.2 |
| Direction-2 readings | Confirm none→top; fill the O11, O12, O14 and O16 cells, which closes 398.3 as satisfied. | no-doc-rec | medium | 398.3; ACTIVE |
| O1 action | Archive all 302 active sessions of trig_019aw8t…; keep the routine disabled; the loop re-lists to confirm 0. | yes | high | Safety risk (a); before the M0 re-score |
| issue-2 | Reply citing /patterns/kanban and Slice 317's refusal; close as not planned. | yes | high | none |
| 369.1 (critic) | Print forces the light palette with one `@media print` token block; amend check:print-tokens; Added entry. | no-doc-rec | medium (19,511 figure not re-measured) | none |
| 249.12 | Every Standardize sweep runs roadmap_scope.py and archives unnamed closed slices; no threshold. | no-doc-rec | medium | none |
| 273.2 | Dry = no score movement and no finding filed in the round; align step 5, rule 6 and the ledger. | no-doc-rec | medium | none |
| 393.13 | Replace "read LOOPS.md and ROADMAP.md fresh" with "run Step 0; read only the sections the rule names". | no-doc-rec | medium | 393.13 wording |
| 375.11 Firefox half (critic) | `brew install --cask firefox`; the loop measures via puppeteer-core; NEEDS-RUNTIME stays until a launch succeeds. | no-doc-rec | medium | 375.11 |
| park/owner-checkpoint (critic) | Push to origin; bring the four .roundtable records to main before the re-score; journey code stays parked, unmerged. | yes | medium | 389.6/389.7, 394.14, M0 retry |
| 394.1 | The loop drafts the ADR from O4's text, superseding loop-log.md:595 for examples/erp-suite only; you accept in one line. | yes | high | 394.4, 394.9, 395.1, 396.1 |
| 374.4 | Repoint the three interactive edges to --bo-color-border-control; drop their EDGE_EXEMPT rows; no new token (taste). | no-doc-rec | medium | 377.8 (part) |
| 373.6 | Decide after 395.1's options note: supersede for the dock only, trigger = phone, it enters as experimental. | yes | low | none now |
| 373.8 | Section labels over the existing groups, no third level; land it with 394.6. | yes | medium | none |
| 296.3 | Security is out of scope as an app claim; add one scope line; no threat-model section. | yes | medium | none |
| 249.10 | No SAP/Fiori column; fold the six terms into 394.9's also-called words; close it through 394.9. | no-doc-rec | medium | 249.7 |
| 249.11 | Close as deferred; reopen when the first outside consumer migrates from a named stack. | no-doc-rec | medium | none |
| 249.13 | Keep demo-first/spec-last; close as decided. | yes | high | none |
| AT runtime evidence | Run `npx @guidepup/setup` once; the loop drives the VoiceOver checks; NVDA rows stay Not Evaluated. | no-doc-rec | medium | none |
| 389.6 and 389.7 (critic) | Close both as superseded once Devices records `rugged-rf no`; the journey stays parked. | yes | medium | none (396.12 moot) |
| 394.16 | Nothing now; default to keeping it in shadow, and promote only if all six bars hold. | yes | medium | none now |
| 396.13 | Nothing now; default to job rows plus new-shape screens unless full module sets win by the margin. | yes | medium | 396.6-396.11 |

---

## Appendix — each recommendation with its evidence

Each reviewer re-measured the premises it relied on. `holds` is `yes`, `no` (the premise is false), `changed` (the number moved since it was written) or `unverifiable`.

### App scope — O5, O18

#### O5a

**Recommendation:** App: Busy Office ERP; first user: busy-office-erp yes. The name is your call and this is the default I would use. Conformance property: each of the nine screen kinds in its RUNTIME_UI_CONTRACT_V0 §2.1 maps to one patterns.json id with a worked suite screen that passes check-markup against the current dist/api.json, checked from a nine-row fixture committed in this repo. How a layout reaches the app: the compiler's per-kind template copies the pattern's Markup and validates it with bo-check-markup against the vendored api.json, which is the path its spike 6 already uses.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: ACTIVE; 394.2 (closes 377.6)

Why:
- ~/Projects/busy-office-erp exists. It is the private repo Busy-Office/busy-office-erp, with 230 commits, 'Phase 0 … No kernel code yet', and its last commit on 2026-09-10; its ADR-0016 (status Proposed) names @busy-office/ui the reference implementation of its runtime-UI markup contract.
- Adoption channels read close to zero (Slice 381 thesis: 0 stars, 0 forks, 0 non-owner items), and today 0 steering documents name this repo, so naming it gives 'serves them' its only falsifiable property.
- Its reference apps (sales, procurement, inventory, ap, ar, gl) cover six of your nine modules, so its needs and your list mostly coincide.
- A CI gate in this public repo cannot read the private repo, so the property has to be a committed fixture of the nine kinds, not a cross-repo check.
- One risk: the repo has been idle 16 days, its contract is Draft v0 and the ADR is still Proposed, so the property tests the contract as written on 2026-09-09, not a live consumer.
- Its intent.md says its platform team never builds Manufacturing, HR/Payroll, CRM or WMS, so Production Planning and Distribution serve the wider suite rather than this first user.

Cost to reverse: Low. Undoing it means changing one field and one Objective sentence and deleting one fixture and its check. No published surface depends on it.

| premise | command | result | holds |
|---|---|---|---|
| busy-office-erp exists and is the candidate first user (377.6) | `ls ~/Projects/busy-office-erp; git -C ~/Projects/busy-office-erp log -1 --format='%h %ad'; git rev-list --count HEAD; gh repo view Busy-Office/busy-office-erp --json visibility,pushedAt` | exists; 3e122b6 2026-09-10 05:57 +0800; 230 commits; PRIVATE, pushedAt 2026-09-09T21:57:37Z; README: 'Phase 0 — constitution and stack decision. No kernel code yet' | yes |
| Its ADR-0016 names this package the reference implementation | `grep -n -A1 '^## Status' ~/Projects/busy-office-erp/docs/decisions/ADR-0016-runtime-ui-markup-contract.md` | Status: Proposed; the Decision section names @busy-office/ui the reference implementation | yes |
| Nothing in this repo's steering documents names it | `for f in CLAUDE.md DESIGN.md LOOPS.md README.md; do grep -c -F busy-office-erp $f; done; awk '/^## Objective/{f=1} /^## Milestone M1/{f=0} f' ROADMAP.md \| grep -c -F busy-office-erp` | 0 0 0 0; Objective 0 | yes |
| Its contract has a §7.1 conformance harness, and spike 6 vendors api.json and validates with check-markup | `grep -n -E 'UI_VERSION\|check-markup\|api.json' ~/Projects/busy-office-erp/spikes/06-runtime-ui/render.py; sed -n 26,40p ~/Projects/busy-office-erp/docs/specs/RUNTIME_UI_CONTRACT_V0.md` | UI_VERSION = "0.8.0"; VENDOR/api.json; validated by check-markup.mjs; §2.1 defines nine kinds; §7.1 conformance exists; the contract is Draft v0 | yes |

#### O5b

**Recommendation:** Modules: home=home:Home, o2c=sales:Sales, p2p=procurement:Procurement, inv=inventory:Inventory, prod=production-planning:Production planning, distribution=distribution:Distribution, fin=finance:Finance, configuration=configuration:Configuration. The list closes at these eight rail entries, with no 'etc.' module in M1, so 396.11 closes with count 0. crm merges into Sales: its 4 screens become Sales sections and keep their URLs until 396.8 redesigns them. journey is not a module. It is a parked procurement-flow experiment, and if O2's branch is ever merged its screens become Procurement jobs.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: ACTIVE; 394.2, 394.9, 395.1, 396.1, 396.3-396.11

Why:
- Keeping the existing ids (394.2) avoids churn measured at 66 o2c references in 20 files, 146 p2p references in 35 files and 25 '/crm/' references in 8 files.
- The critic's premise that journey is in _shell.mjs:42-49 is false: those lines hold home, o2c, p2p, crm, fin, inv and prod, both on main and on the parked branch, and journey is a separate directory with its own shell that exists only on park/owner-checkpoint-2026-09-20.
- CRM's four screens (accounts, account, opportunities, opportunity) are a customer master and a pipeline, which are shapes Sales needs anyway, so a separate CRM module would test no new shape, and your list names none.
- Eight rail entries stay below GAP-1's trigger of more than 10 entries in one sidebar group.
- Each module item costs a brief, a prediction, two critics and up to 3 revise rounds across several wakes, while adding a module later costs one MODULES row plus one 396.11 item.
- The prod facet uses your own words, 'Production Planning', which is also SAP's PP scope; the existing bom, capacity and production-order screens already fit it.

Cost to reverse: Cheap before 394.9 writes MODULES. After that, facets ship in jobs.json, but row values are data that can change in any minor (394.10), and suite URLs sit outside semver. Adding a module later is additive.

| premise | command | result | holds |
|---|---|---|---|
| The existing suite modules include o2c, p2p, crm and journey (critic, _shell.mjs:42-49) | `sed -n 42,50p examples/erp-suite/_shell.mjs; git show park/owner-checkpoint-2026-09-20:examples/erp-suite/_shell.mjs \| grep -n -A8 'export const MODULES'` | Both show home, o2c, p2p, crm, fin, inv, prod. journey is absent from MODULES and exists only as examples/erp-suite/journey/ on the parked branch. | no |
| Cost of renaming the existing directory ids | `git grep -c -F '/crm/' \| awk -F: '{s+=$2;n++}END{print n,s}' (repeated for o2c and p2p)` | /crm/: 8 files, 25 refs; o2c: 20 files, 66 refs; p2p: 35 files, 146 refs | yes |
| crm holds four screens | `git ls-files examples/erp-suite/crm` | account, accounts, opportunities, opportunity | yes |

#### O5c

**Recommendation:** Profile is a user-menu destination, not a Modules entry; 395.1 builds its worked screen. Configuration is a rail module shown to administrator roles. The boundary: the frame's Settings screen (395.1, in the user menu beside Profile) holds only what changes the app for the signed-in user (theme, density, language, notifications, default landing). Anything that changes it for other people (users, roles, permissions, rules, numbering, module settings) belongs to Configuration (396.3).

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 395.1, 396.3

Why:
- The shipped app-frame pattern already puts Profile in the user menu (app-frame.astro:48, a bo-dropdown__item linking to /profile), so this fixes 395.1's dead link without adding a new idiom.
- Configuration has several screens (396.3: users and roles, permissions, rules), so it needs a landing and section navigation, which a rail module provides and a single menu link does not.
- 'Affects only me' versus 'affects others' is a boundary a critic can test screen by screen, and 394.2 asked for exactly that boundary after the critic found it undefined.
- Jev (advisory only) gave the rail module 0.63, which is in the unverified band and so neither supports nor opposes it.
- One cost: the rail needs one more glyph, and the settings and user glyphs are deprecated (_shell.mjs:25), so 395.1's icon budget has to cover it.

Cost to reverse: Low before 395.1 lands. Afterwards, moving Configuration between the rail and the user menu means rewiring the frame's navigation and one landing, and no published name changes.

| premise | command | result | holds |
|---|---|---|---|
| Profile points at nothing (395.1 cites app-frame.astro:48) | `grep -n -i -E 'profile\|settings' apps/docs/src/pages/patterns/app-frame.astro` | :48 <a class="bo-dropdown__item" href="/profile">Profile</a>; :106 href="#" | yes |
| The glyph budget is tight | `grep -n -F 'DEPRECATED' examples/erp-suite/_shell.mjs` | :25 icon.css marks settings and user DEPRECATED | yes |

#### O5d

**Recommendation:** AP and AR go under Finance, as sections of fin. The existing vendor-invoice and customer-invoice screens keep their URLs and are listed in Finance's sections. Their job rows carry two facets each (finance+procurement and finance+sales), with 'accounts payable' and 'accounts receivable' as also-called words.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 396.7; facets for 396.8 and 396.10

Why:
- Your list is cut by function (Sales, Procurement, Finance), not by process (o2c, p2p), and the suite already keeps ar-aging under fin/.
- The module-facets column in jobs.json is plural (394.9), so placement only decides where a screen sits on the rail, not whether it can be found.
- The first user makes AP and AR separate apps bound to GL (trading-starter: accounting.journal-posting -> busyoffice.gl), and the also-called words reach them from either placement.
- Keeping the invoice URLs honours 394.2's rule that a redesign replaces its predecessor at the same URL.

Cost to reverse: Low: only rail sections and facet data change, and no published name does.

| premise | command | result | holds |
|---|---|---|---|
| AR already sits under Finance in the suite | `git ls-files examples/erp-suite/fin` | ar-aging, journal-entry, period-close, trial-balance | yes |
| The first user splits AP and AR into apps | `sed -n 1,30p ~/Projects/busy-office-erp/solutions/trading-starter/busyoffice.app.yaml` | The apps are foundation, gl, ap, ar, inventory and sales, with accounting.journal-posting bound to busyoffice.gl | yes |

#### O5e

**Recommendation:** Discrete manufacturing: one industrial pump and marine-fittings maker, make-to-stock, with a spare-parts distribution arm, carrying every module's demo data. The product line is your taste, and this default is free because the data already uses it.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 396.3 onward (each brief's demoData field)

Why:
- The existing demo data is already this company: bom.screen.mjs shows PMP-4400 Pump assembly, Impeller (bronze) and Seal ring set, and the sales order shows Marine coupling 80mm and Anode kit.
- A manufacturer with a distribution arm gives credible data to all seven work modules, including Production Planning and Distribution; the first user's trading-starter, a pure trading company, could not.
- It makes where-used (GAP-21's second use) a natural Production Planning screen.

Cost to reverse: The cost grows with every screen built, because each module's demo data depends on it, so decide before 396.3. Nothing published depends on it.

| premise | command | result | holds |
|---|---|---|---|
| Discrete manufacturing matches the existing BOM | `grep -o -E "'[^']{6,60}'" examples/erp-suite/prod/bom.screen.mjs \| head -30` | PMP-4400 Pump assembly, IMP-2210 Impeller bronze, SRS-0071 Seal ring set, BRZ-0900 Bronze billet, MNT-1180 Mounting plate | yes |

#### O5f

**Recommendation:** Devices: desktop · phone · rugged-rf no. The 17 Slice-389 items lose their M1 tag and go back to the backlog, 396.12 closes as out of scope, and 389.14 (RF slot guidance folded into 395.1) is untagged with them.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 395.1 (whether Done-test 1 includes the rugged width), 396.12 and the 17 absorbed Slice-389 items

Why:
- The 17 Slice-389 items plus 396.12 are 18 of the 61 open M1 items, all in Phase 2, which has 35 (19 counting 389.14). Saying no roughly halves Phase 2, after a bootstrap that used 10 of 12 wakes and failed its exit test.
- RF already ships on its own track (loop-log.md:597, 2026-08-22: rf-essentials floor, 360x640 fixture, spacious density) with its own home, rf-landing. Slice 389 refused per-screen app chrome at 360x640, so RF task screens sit outside the M1 frame and do not test its naming bet.
- 389.6 and 389.7 are BLOCKED on the 09-20 branch that O2 parked, so two of the 17 cannot land on main anyway.
- The first user's contract defines nine screen kinds, and none of them is a scan task.
- What no costs: 389.2's false runtime claims on the published RF pages ('Enter posts the scan') wait for milestone close unless triage moves that one item to the defect track. The five RF defect-track items (389.3, .16, .19, .23, .24) keep running through the interleave.
- Jev (advisory only) chose out_of_scope at 0.99.

Cost to reverse: Switching from no to yes later means re-tagging 17 items, reopening 396.12 and measuring the frame at the rugged width (Done-test 1). That is cheap before 395.1 lands and one extra measurement after. Nothing published changes either way.

| premise | command | result | holds |
|---|---|---|---|
| If yes, 17 Slice-389 findings become acceptance tests for 396.12 | `python3 parse of ROADMAP.md items: open items whose body has 'After: … 396.12'` | 17 open 389.x items (389.1, .2, .5-.13, .15, .17, .18, .20-.22), plus 397.2 | yes |
| How RF changes the milestone's size | `python3 parse: open items tagged 'Milestone: M1', split by Phase; raw check: grep -c -E '^\s*[0-9]+\. \[ \]' ROADMAP.md` | 104 raw open items, 103 parsed (the unparsed one is 'AT runtime evidence', not M1); 61 are M1; Phase 2 has 35, of which 19 are RF (17 + 396.12 + 389.14) | yes |
| Slice 389's open items | `grep -n -E '^\s*[0-9]+\. \[[ x]\] \*\*(OWNER · \|P0 · )?389\.' ROADMAP.md` | 25 items, 23 open (389.4 and 389.25 closed): 17 go to 396.12, 1 (389.14) to 395.1, 5 to the defect track | yes |
| RF is already a shipped surface | `git ls-files packages/core/src apps/docs/src/pages \| grep -i -E 'rf\|scan'; grep -n rf packages/core/package.json` | scan.css, scan-input.ts, 6 RF pattern pages plus 6 rf/ mirrors; build:rf-essentials and check:rf-floor are in the core build | yes |
| The first user needs RF | `grep -rl -i -E 'rugged\|handheld\|barcode\|scanner' ~/Projects/busy-office-erp/docs ~/Projects/busy-office-erp/contracts` | Only ADR-0015, where 'scanner' means a dependency scanner, and a generated llms file. The contract's nine kinds include no scan task. | no |

#### O18a

**Recommendation:** Confirm: freedom to design reopens no refused-on-record item, and reopening one needs an owner entry that names new evidence. Make two text fixes to §9.1 before it is used: cite drag by its slices (100.1, 110.7, 132.5, 317) instead of the dead ROADMAP.md:2613, and narrow the GAP-21 line to 'a genealogy/graph component', so the open same-entity-row need is not on the refused list.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: Nothing structurally. 396.3's first pool stage reads the §9.1 list.

Why:
- Each refusal was argued on the merits: device-class forks were refused as '24 screens x 3 = 72 re-photographs' (loop-log.md:600), and drag was refused four times (Slice 373's C2 row). 'References are floors' asks designs to beat their references, not to bring back what was refused.
- The drag citation ROADMAP.md:2613 now lands on an unrelated RF line; the four-times record lives in Slice 373's C2 row (ROADMAP.md:5029).
- §9.1 lists 'Genealogy graph (GAP-21)' (4-prompt.md:519), and stage 7 says hits on a §9.1 key are 'never dispatched' (4-prompt.md:491), so as written it would silently discard the where-used second use that O18(d) queues.

Cost to reverse: None: any single refusal can still be reopened by one owner entry that names new evidence.

| premise | command | result | holds |
|---|---|---|---|
| The refused-on-record citations resolve | `sed -n '595p;598p;600p;727p;939p' .roundtable/loop-log.md; grep -n 'Deliberately absent' DESIGN.md; sed -n 41,66p apps/docs/src/pages/getting-started/scope.astro` | Every loop-log line is the named refusal; DESIGN.md:339 has the table (grid engine, master-detail); scope.astro names the charting engine, rich-text engine, virtualised table, page builder, icon set and state/routing | yes |
| Drag is refused four times at ROADMAP.md:2613 (4-prompt.md:512) | `sed -n 2613p ROADMAP.md; grep -n -F 'drag REFUSED' ROADMAP.md` | Line 2613 is unrelated RF text ('heights stay 52…'); the record is at :5029, 'drag REFUSED ×4 on record (100.1, 110.7, 132.5, 317)' | changed |

#### O18b

**Recommendation:** Publish placeholder screens with a visible 'Placeholder' badge, generated from each page's data-bo-gap count and never set by hand. The Screen kit's 'N complete ERP screens' count leaves them out, and llms.txt's Worked screens section (394.10) carries the same status.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: The first module item that lands a placeholder (396.3), and 394.10's Worked screens section

Why:
- The Screen kit claims '{suite.total} complete ERP screens' and 'these screens are proof the framework covers them' (screen-kit.astro:20, :38-39), so a placeholder without a badge would make the page false.
- The same page calls the suite the project's 'gap-finding instrument' (:33), and holding placeholder screens back would hide exactly the gaps it exists to show.
- Agents treat llms.txt's Worked screens as copyable, so the status has to reach that section too, or an agent will copy a placeholder as if it were a pattern.
- Jev (advisory only) gave the badge 0.86, which is in the supports band.

Cost to reverse: Low: one filter in gen-suite-index and one badge.

| premise | command | result | holds |
|---|---|---|---|
| The Screen kit claims its screens are complete | `grep -n -E 'complete ERP screens\|proof the framework covers\|gap-finding' apps/docs/src/pages/getting-started/screen-kit.astro` | :20 'complete ERP screens'; :33 'gap-finding instrument'; :39 'proof the framework covers them' | yes |

#### O18c

**Recommendation:** Confirm the 9 parked items (391.1, 384.1, 376.7, 381.1, 377.7, 377.9, 377.12, 377.13, 377.14). Do not unwire 381.1 now: keep it wired and parked until milestone close, where 381.1 decides against a stated precision floor. The live count is now 12, and the three Slice-398 items follow your answer to the M0 FAIL, not this confirmation.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: Nothing for the confirmation itself. 398.1-398.3 wait on RESUME Direction item 0.

Why:
- The live count is 12 anchored Parked: lines: the 9 in the realignment table plus 398.1-398.3. A plain grep -c -F 'Parked: M1' returns 18 because 6 of its matches are prose mentions.
- I re-ran the check over the last 30 ROADMAP.md commits (2026-09-24 to 09-26): it reported on 3 and stayed silent on 27. One report (f866ad11) was noise, 23 sites for the word 'one'. Another (2fc94372) listed 3 Slice-362 sites that still say '22 type errors' after that same commit corrected the figure to 562, which are plausibly the missed sites the check exists to find.
- The check is advisory (record_iteration.py:419-437 reports and never fails a build), so keeping it costs a few stderr lines on about 1 record in 10. Unwiring it would spend a wake on loop machinery in a milestone that parks machinery.
- 381.1's own Accept requires stating a precision floor before measuring, and unwiring now would skip that step.
- Jev (advisory only) leaned towards unwire_now at 0.70, which is in the unverified band; I disagree because of the find above.
- 398.1-398.3 say 'revisit: the owner's answer to 393.10's FAIL'. 398.1's Invalids, which cap Correctness and Maintainability at 1, are text edits only.

Cost to reverse: Unparking means deleting one line per item. Unwiring later deletes about 19 lines in record_iteration.py, which git can restore.

| premise | command | result | holds |
|---|---|---|---|
| There are 9 parked items | `grep -c -E '^\s*Parked:' ROADMAP.md; grep -c -F 'Parked: M1' ROADMAP.md` | 12 anchored (lines 577, 602, 616 = 398.1-398.3, plus 2796, 3754, 3827, 4005, 4018, 4042, 4048, 4057, 4174); the plain fixed-string count is 18, including 6 prose mentions | changed |
| 381.1: 234 printed site lines, about 4 of them real (precision around 1.7%) | `for c in $(git log -30 --format=%h -- ROADMAP.md); do python3 scripts/loops/check_correction_sites.py --commit $c; done` | 3 of 30 commits reported. f866ad11: 23 sites plus 619 unlisted for 'one', all noise. e76a8f90: 3 sites, unrelated. 2fc94372: 3 sites restating '22' after 'Before: 562 errors, not the 22 recorded here', plausibly real. The self-test passes. | changed |

#### O18d

**Recommendation:** Confirm AI-researched briefs with at least 2 independent sources per domain claim, counted by code as distinct registrable domains (eTLD+1) rather than hosts. NotebookLM notebook 89417194 is a lead only. You read each brief after it lands and can reopen it with an entry, but your read is not a gate the loop waits on; the fresh-context realism reviewer in Slice 396's common Accept is the gate.

Agrees with the draft's own recommendation: no · confidence: medium · blocks: 396.3 (the first brief), 396.4, 396.6-396.10

Why:
- Notebook 89417194 is 'Functional Architecture of the SAP Enterprise Ec…' (nb-index route), a single-vendor source, so treating it as a lead only fits 'references are floors, never copied'.
- Stage 1 counts '≥2 distinct URL hosts' (4-prompt.md:485), and help.sap.com plus community.sap.com would pass that as two sources while being one vendor.
- Seven module items each have a brief (396.3, 396.4, 396.6-396.10), so a blocking review would add seven owner stops to a queue that already holds O5-O18 plus nine Direction items.
- Slice 396's common Accept 1 already requires a fresh realism reviewer who did not author the layouts, so your read adds judgement without holding the loop.

Cost to reverse: Low for the rule text, but any brief written under a weaker rule would need re-sourcing, so decide before 396.3.

| premise | command | result | holds |
|---|---|---|---|
| Notebook 89417194 is a single-vendor lead | `python3 ~/.claude/second-brain/nb-index.py route 'ERP modules domain research'` | 89417194 'Functional Architecture of the SAP Enterprise Ec…' | yes |
| Briefs require 2 independent sources and a realism reviewer | `sed -n 485p .roundtable/milestone-draft-2026-09-25/4-prompt.md; sed -n 727,730p ROADMAP.md` | 'Code counts ≥2 distinct URL hosts per domain claim. A fresh realism reviewer…'; common Accept 1 matches, and no owner review is in the Accept | yes |

#### O18d-GAP21

**Recommendation:** Queue it. Name 396.6's where-used screen as GAP-21's second use in the ledger entry (Status OPEN, Use: lot-trace). Keep the genealogy/graph component refused, and let 396.6 decide the narrow need (marking two rows as the same entity) with both uses in hand.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: high · blocks: 394.8, 396.6

Why:
- GAP-21's own entry says the narrow finding is 'no way to mark two rows as the same entity', and that a where-used BOM explosion 'is a second use' (erp-suite-gaps.md:946-949).
- The second use is foreseen and already in a queued item's title (396.6: 'planned orders, capacity, scheduling, where-used'), yet no where-used screen exists.
- Owner answer 5 forbids closing an entry REFUSED only for lack of a second use, and lot trace and where-used are distinct (job, pattern) pairs under O8(c)'s recommended independence rule.

Cost to reverse: Low: one ledger line. Refusing on the merits after 396.6 is still possible.

| premise | command | result | holds |
|---|---|---|---|
| GAP-21 was refused pending a where-used screen that was never queued | `sed -n 931,953p .roundtable/erp-suite-gaps.md; git grep -n -i -F 'where-used' -- examples apps/docs/src` | 'Refused for now: a genealogy/graph component'; the only where-used hit is a comment in inv/lot-trace.screen.mjs:26, and no screen exists | yes |
| 396.6 builds where-used only if 394.8 queued it | `sed -n 846,857p ROADMAP.md` | 'Where-used is built as GAP-21's second use only if 394.8 queued it.' | yes |

*Cross-group notes:* - **M0 FAIL answer (RESUME.md Direction item 0).** This answer decides 398.1-398.3 and whether ACTIVE can be reached at all. My O18c leaves those three items to it. 398.1 is text edits only, and 2 of the 12 bootstrap wakes remain.
- **O2's parked branch.** It decides journey and 389.6/389.7. If RF is out of M1 (O5f), both items stop mattering to the milestone.
- **O17 budgets.** Size the milestone's wake budget against about 43 M1 items rather than 61 if O5f = no. With no 'etc.' module (O5b), 396.11 closes with count 0.
- **O7 tier word.** The 'Placeholder' badge (O18b) and the experimental tier word must stay distinct words.
- **O9/394.10.** The llms.txt Worked screens section has to carry placeholder status (O18b).
- **394.1's ADR on loop-log.md:595 (domain packs).** It governs 396.5/396.13 independently of O5.
- **395.1 glyph budget.** A Configuration rail module needs one glyph, and settings and user are deprecated.
- **Stale references and counters.**
  - The O13 text still says 394.14; it is now 394.18.
  - The critic's claim that journey sits in _shell.mjs:42-49 is false.
  - §9.1's drag line cites the dead ROADMAP.md:2613.
  - One open item ('AT runtime evidence') has no numeric id, so any M1 counter must count raw checkboxes (104).
- **Jev.** Jev was consulted once, in a batch, on public facts only: RF out 0.99, placeholder badge 0.86, Configuration rail 0.63, unwire 381.1 now 0.70. It is advisory. Two of the four answers fall in the unverified band, and I disagree with the unwire lean because of a measured find.
- **Scratch output.** The re-run of check_correction_sites.py over the last 30 commits is at /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/cs.txt.

### Release and public surface — O6, O9

#### O6

**Recommendation:** Release now, from current main HEAD, before any `@status experimental` line lands: @busy-office/ui 0.9.0 (a minor, not a patch) together with @busy-office/create-ui 0.2.0. This closes 394.3 and 377.5.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: high · blocks: 394.3, which is E-release for every experimental admission (prompt §9.3) and is in 397.2's After: line; it also closes 377.5. It does not block ACTIVE itself.

Why:
- Eight P0 package fixes are unreleased: 300.1, 375.9, 375.10, 376.2, 376.4, 377.1, 389.4 and 392.1 each have a commit after v0.8.0 that touches packages/core. They sit among 18 Fixed and 3 Changed entries under CHANGELOG `## Unreleased`. 377.2 was also a P0, but its fix only touched apps/docs.
- The published 0.8.0 still has issue #1, which was closed on 2026-09-06 as 'reaches consumers on the next release'. The 0.8.0 tarball's check-markup throws `ENOENT` on `indx.html`, while HEAD prints 'no HTML files found in: indx.html'.
- HEAD adds no new public surface since v0.8.0, so a release now is fixes-only by construction. Classes: 283 before and after. `[data-*` names: 22 before and after. The exports list is the same, and there are 0 `@status experimental` lines. This is the cleanest release boundary there will be. I checked the instrument can detect a change: it reads v0.5.0 263 and v0.7.0 283.
- It has to be a minor. Unreleased holds a licence change (MIT to Apache-2.0), a `.bo-motion-spin` display change with a Migration note, and a new `Partially Supports` verdict value in acr.json. A 0.8.1 would reach every `^0.8.0` install silently. Every release since 0.1.1 has been a minor.
- CI is green on HEAD 31b0849f in all six jobs, including vitest and check-claims. check-claims.mjs has cases for all seven CSS/JS P0s (2 to 6 references each), and I verified 300.1 by hand.
- 394.3 closing is the E-release entry test for every experimental admission (prompt §9.3:556). It is also in 397.2's After: line (ROADMAP.md:673). 'Record why not' would therefore only postpone the decision.
- The case against: demand is small. npm shows 16 downloads for 2026-09-18..24, and the one known consumer touches only 300.1 (Slice 392's correction). But a release costs one GitHub Release, and the Apache-2.0 patent grant, the stated reason for the relicence, applies only once published.
- The doc's '322 commits' is stale. It is now 346, but only 35 touch packages/ and 154 are chore(loops|resume) bookkeeping. Quote the entry counts, not the commit count.

Cost to reverse: Publishing cannot be undone. 0.9.0 can never be reused or relicensed. npm unpublish is limited to 72h, so a regression is fixed forward with 0.9.1. Answering 'record why not' instead costs nothing to reverse, but E-release then blocks every experimental admission and 397.2 until someone releases.

| premise | command | result | holds |
|---|---|---|---|
| Last published version is 0.8.0 | `npm view @busy-office/ui version time.modified dist-tags --json` | version 0.8.0, latest 0.8.0, modified 2026-09-06T13:40:56Z (network worked) | yes |
| packages/core/package.json version | `grep -n '"version"' packages/core/package.json packages/create-ui/package.json; npm view @busy-office/create-ui version` | core 0.8.0; create-ui 0.1.3 locally and 0.1.3 on the registry | yes |
| Newest tag is v0.8.0 and it is an ancestor of HEAD | `git tag --sort=-creatordate \| head; git describe --tags --abbrev=0; git merge-base --is-ancestor v0.8.0 HEAD` | v0.8.0 (2a4bb245, 2026-09-06); it is an ancestor of HEAD | yes |
| 322 commits since v0.8.0 (O6 and 394.3 text, 2026-09-25) | `git rev-list --count v0.8.0..HEAD; git rev-list --count v0.8.0..HEAD -- packages; git log --format=%s v0.8.0..HEAD \| grep -c -E '^chore\((loops\|resume)\)'` | 346 in total; 35 touch packages/; 26 touch packages/core/src; 154 are chore(loops\|resume) | changed |
| Eight unreleased P0 fixes (RESUME.md:65; the 393 correction 'it is eight, with 392.1') | `awk 'NR>=10&&NR<312' CHANGELOG.md \| awk '/^### /{s=$0} /^- \*\*/{c[s]++} END{for(k in c)print k,c[k]}'; grep -n -E '\[x\] \*\*P0 · \|— P0 ' ROADMAP.md; git log --fixed-strings --grep=<id> v0.8.0..HEAD -- packages/core` | Unreleased has Changed 3 and Fixed 18. The package P0s are 300.1, 375.9, 375.10, 376.2, 376.4, 377.1, 389.4 and 392.1, each with a post-tag core commit. 377.2's P0 fix is docs-only (b4e592d3 touches apps/docs). | yes |
| The published bin still crashes (issue #1 / 300.1) | `npm pack @busy-office/ui@0.8.0 && node package/scripts/check-markup.mjs indx.html   vs   node packages/core/scripts/check-markup.mjs indx.html` | 0.8.0 throws [Error: ENOENT ... open 'indx.html']. HEAD prints 'check-markup FAILED — no HTML files found in: indx.html'. gh issue 1 is CLOSED 2026-09-06. | yes |
| No experimental or new surface on main yet, so a release now mixes nothing | `git grep -n -F '@status experimental' -- packages apps; git grep -h -o -E '\.bo-[a-z0-9_-]+' <rev> -- 'packages/core/src/css/*.css' \| sort -u \| wc -l (v0.5.0, v0.7.0, v0.8.0, HEAD); exports key diff via node` | 0 experimental lines (control: @tagline is found in 40 files). Classes: v0.5.0 263, v0.7.0 283, v0.8.0 283, HEAD 283. data-* names 22 and 22. Exports: none added, none removed. | yes |
| HEAD is releasable (CI green, vitest included) | `gh run list --branch main --limit 5; gh run view <id> --json jobs; grep -n vitest .github/workflows/ci.yml` | CI and Pages both succeeded on 31b0849f (HEAD). All six CI jobs succeeded, including 'Core build, lint, unit tests' (ci.yml:122 runs vitest) and 'Claims'. | yes |
| Publishing is owner-triggered via a GitHub Release | `sed -n '1,12p;44,46p' .github/workflows/publish.yml; grep -n 'run: ' .github/workflows/publish.yml` | on: release types [published]. check-publishable refuses versions already on the registry. Steps run in order: core build, then docs build, then publish both packages. | yes |

#### O9

**Recommendation:** Approve now, alongside O7 and O8 and before ACTIVE, not when 394.10 is reached, with the list extended. Exports: ./patterns (busy-office.patterns/1), ./jobs (busy-office.jobs/1) and ./llms.txt (tagged). The api.json key `experimental`. A `status` field on behaviors, events, keymap and patterns entries. introduced.json stable-since as a new sibling key, not a change to `components` values. Attributes: data-bo-pattern, data-bo-gap and data-bo-experimental. All of it ships together in 0.10.0 with Added entries.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.4 (api.experimental and the status fields), 394.5 (the bin reads data-bo-experimental and data-bo-gap), 394.9 (data-bo-pattern) and 394.10 (the exports). If it is unanswered, the dispatcher stops at 394.4 under the one-way-door rule.

Why:
- I agree with the doc's action (one minor, Added entries, owner-triggered publish) but not its timing. simulate_rule_m.py over Slices 393-397 at HEAD dispatches 394.4, which adds `api.experimental`, at #4, and 394.10 at #10. An O9 answered at 394.10 would trip prompt §12's one-way-door stop (4-prompt.md:650) six dispatches earlier.
- The doc's list is incomplete. 394.4 (ROADMAP.md:1128-1130) says the additive `api.experimental` key 'is named in O9's approval', and O9's text omits it, as the critic noted at 5-open-decisions.md:72.
- introduced.json is a published export (`./introduced.json`). Today it maps each of 42 components to a version string (`alert: "0.1.0"`). Recording 394.4's stable-since by turning those strings into objects would be a Breaking shape change, so approve it only as an additive sibling key.
- None of the surface exists yet. ./patterns, ./jobs and ./llms.txt are not in exports. Built llms.txt has 0 hits for 'screen kit', 'sales' and 'distribution', against 53 for 'Components'. patterns.json has no schema tag (keys: $comment, count, groups). Approving is a forward commitment, and every name passes O4's swap test (no module word).
- Approval costs nothing until a release carries it. The actual one-way door is the owner-triggered publish of 0.10.0, which you keep.
- `data-bo-experimental` and `api.experimental` contain O7's tier word. This approval therefore assumes O7 = 'experimental', and any other word renames both before they ship.

Cost to reverse: Nothing until it is published: only repo edits and generator changes. Once 0.10.0 ships, removing or reshaping any of the three exports, three attributes or the api.json key needs a Breaking entry (a pre-1.0 minor) and breaks agents that read the schema-tagged files. Row values (jobs, also-called words, facets) stay changeable in any minor, per 394.10.

| premise | command | result | holds |
|---|---|---|---|
| The three exports do not exist yet | `node -e 'console.log(Object.keys(require("./packages/core/package.json").exports))'` | 21 exports. No ./patterns, ./jobs or ./llms.txt. | yes |
| Built llms.txt has 0 hits for 'screen kit', 'sales', 'distribution' (394.10, 2026-09-25) | `grep -c -i -F '<word>' apps/docs/dist/llms.txt (50,673 bytes, built 09-26 01:55)` | screen kit 0, sales 0, distribution 0; control 'Components' 53 | yes |
| The data-bo-* attributes and api.experimental are not in the tree yet | `git grep -n -F 'data-bo-experimental' / 'data-bo-pattern' / 'data-bo-gap' -- packages apps examples; node -e 'Object.keys(require("./packages/core/dist/api.json"))'` | 0 hits for each attribute (control: data-bo-theming 5). api.json keys are generated, components, primitives, utilities, categories, nav, motion, dataAttrValues, pageSlug and index; no experimental key and no schema tag. | yes |
| 394.4 lands before 394.10 under rule M | `awk '/^## Slice 39[3-7] /{p=1} /^## /&&!/^## Slice 39[3-7] /{p=0} p' ROADMAP.md > m1.md; python3 .roundtable/milestone-m1-2026-09-25/simulate_rule_m.py m1.md` | 38 items, no cycle. Order: owner items (394.1 394.2 394.3 394.18), then 393.11 393.12 393.13 394.4 394.5 … 394.9 394.10. 394.4 is dispatch #4 and 394.10 is #10. | yes |
| introduced.json values are version strings | `node -e 'const j=require("./packages/core/src/data/introduced.json");console.log(Object.keys(j), Object.keys(j.components).length, j.components.alert)'` | Top-level keys: $comment, refreshedAt, registryVersions, components. 42 components; alert is "0.1.0". registryVersions ends at 0.8.0. | yes |
| publish.yml builds core, then docs, then publishes (394.10 build-order premise) | `grep -n 'run: ' .github/workflows/publish.yml` | :85 core build, :95 docs build, :100/:105 npm publish | yes |

#### release-sequence

**Recommendation:** Now: 0.9.0 plus create-ui 0.2.0, fixes-only, from HEAD. Then M1 builds 394.4-394.10 on main, unreleased. Then 0.10.0 once 394.10 closes and the 394.4-394.7 gates are green: Added entries for O9's surface, and any admitted parts under `### Experimental`. After that, cut every release from main whenever you choose; each may carry labelled experimental parts. No 0.9.x branch line.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: Nothing beyond O6 and O9: it only orders the two owner-triggered publishes.

Why:
- 394.3 only forbids unlabelled experimental surface in a release (ROADMAP.md:1078). After 0.9.0 nothing requires holding defect-track fixes back from releases cut from main, so a separate patch branch adds process and no safety.
- create-ui has to bump with core: check-publishable refuses an already-published version, and create-ui changed 6 files since v0.8.0 (LICENSE, NOTICE, commands.mjs). With the licence change that makes it a minor, 0.2.0.
- The release flow documented on the versioning page (cut-version-snapshot.mjs plus versions.json) has not been followed since 0.4.0: versions.json lists only 0.4.0, 0.3.0 and 0.1.1. Either cut the 0.9.0 snapshot or remove that claim from the page.
- introduced.json's registryVersions stop at 0.8.0 and its comment says to re-run `derive-introduced --refresh` after a publish. Do that right after 0.9.0, so the stable-since baseline 394.4 needs is correct.
- Before you publish: rename `## Unreleased` to `## 0.9.0 (<date>)`, set packages/core to 0.9.0 and create-ui to 0.2.0, quote the green CI run for that exact sha (377.3: a close must be verified on HEAD), then publish GitHub Release v0.9.0.

Cost to reverse: The sequence can be changed freely until each publish. Each published version is permanent.

| premise | command | result | holds |
|---|---|---|---|
| The docs snapshot flow has been followed at releases | `cat apps/docs/versions.json; git ls-files apps/docs/versions \| cut -d/ -f4 \| sort -u` | Snapshots exist only for 0.4.0, 0.3.0 and 0.1.1; none for 0.5.0-0.8.0 | no |
| create-ui changed since v0.8.0 | `git diff --stat v0.8.0..HEAD -- packages/create-ui` | 6 files, 264 insertions: LICENSE, NOTICE, README, commands.mjs, index.mjs, package.json (commits 94bdb34d relicense, f873e16b 373.7) | yes |

*Cross-group notes:* - O9 depends on O7 and O8(a):
  - O7: the approved names `data-bo-experimental` and `api.experimental` assume O7 = 'experimental'.
  - O8(a): if you choose repo-only, `api.experimental` would ship empty and `data-bo-experimental` would mark nothing in the tarball, so the 0.10.0 Added entries shrink to the three exports and data-bo-pattern/data-bo-gap.
- The frame's dispatch number is stale in the docs that cite it (O11 and the Slice 394 header, ROADMAP.md:1003). simulate_rule_m.py at HEAD, over the 38 open items in Slices 393-397, puts 395.1 at dispatch #17, not #26, because 393.1-393.10 have closed.
- M0's failed re-score (2.375) does not block O6: it scored the loop machinery, and the package is CI-green on HEAD 31b0849f.
- O6 is independent of whether M1 ever goes ACTIVE. Releasing now is right either way.
- Scratch files (the unpacked 0.8.0 tarball, unrel.txt, class lists, m1.md) are in /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/. No repo file was modified.

### Experimental tier — O7, O8, O10

#### O7

**Recommendation:** Tier word = `experimental`.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.4, and through it 394.5-394.7 and 394.17. CLAUDE.md:365-366 still reads '(the word is owner decision O7, pending)'.

Why:
- It collides with nothing the framework ships: 0 hits in packages/core/src, apps/docs/src and the built llms.txt. `preview` has 65 whole-word hits (PatternPreview.astro, tile-preview.css, and 377.12's docs 'preview' container), and `init` already names all 26 exported init*() behaviours.
- Zero hits does not single it out, because `beta` and `unstable` also count 0. What decides it is meaning: in this tier Removed and Absorbed are normal outcomes (prompt §9.3), and 'experimental' promises no path to stable, while 'beta' implies one.
- The word is already committed: it is the Milestone Budget key `experimental 2`, it is in scripts/loops/milestone.py:92 BUDGET_KEYS, and your standing intent says 'pre-stable (experimental)'.

Cost to reverse: Free now: a find-replace across ROADMAP.md, 4 lines of milestone.py and the draft files. Once a release carries 394.4, the word is published API (the api.json `api.experimental` key, the `data-bo-experimental` attribute from O9, the `@status experimental` directive, the CHANGELOG `### Experimental` heading), and renaming it becomes a Breaking entry.

| premise | command | result | holds |
|---|---|---|---|
| 'experimental' has 0 existing uses in source, docs or llms.txt | `git grep -F -i -n experimental -- packages/core/src \| wc -l; git grep -F -i -n experimental -- apps/docs/src \| wc -l; grep -F -i -c experimental apps/docs/dist/llms.txt; control: git grep -F -i -n experimental \| wc -l` | 0 / 0 / 0. Control: 210 repo-wide (ROADMAP.md 60, .roundtable 138, scripts/loops/milestone.py 4), so the instrument does find the word. | yes |
| 'preview' already has 123 other meanings | `git grep -F -i -n preview -- packages/core/src apps/docs/src \| wc -l; git grep -F -i -o -w preview -- packages/core/src apps/docs/src \| wc -l; git grep -F -i -n preview -- packages/core apps/docs ':!apps/docs/versions' \| wc -l` | 85 lines (2 core + 83 docs), 65 whole-word, 116 lines including scripts. I could not reproduce 123 in any scope, but the word does carry many other meanings. | changed |
| 'init' collides with 26 init*() functions in llms.txt | `grep -o -E '\binit[A-Z][A-Za-z]*\(' apps/docs/dist/llms.txt \| sort -u \| wc -l; git grep -F -n 'export function init' -- packages/core/src \| wc -l` | 26 distinct in llms.txt and 26 exported in source. There are also 26 behaviour files, so three independent counts agree. | yes |
| 'preview' names the docs container in 377.12 | `grep -n -A1 '\*\*377\.12' ROADMAP.md` | 4036: '377.12 — the preview's provenance is truthful. The container reports {sha:null, dirty:true}…' | yes |
| (my check) zero collisions distinguishes 'experimental' from other candidates | `for w in beta alpha draft unstable candidate; do git grep -F -i -o -w $w -- packages/core/src apps/docs/src \| wc -l; done` | beta 0, unstable 0, alpha 2, draft 26, candidate 14. Zero collisions is not unique to 'experimental'. | no |
| Node and Primer use 'experimental' | `not fetched this session` | Not re-verified, and not relied on. | unverifiable |

#### O8a

**Recommendation:** Option (a): ship experimental parts in the npm tarball at their final path, dist/css/components/<name>.css (JS only at ./js/behaviors/<name>). Keep them out of index.css and the ./js index, mark every use, and give them no Breaking entries.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.4 ('Where the part ships'), 394.5, 394.17. Needs E-release (394.3 / O6) closed first.

Why:
- The export already exists (packages/core/package.json:43 `./css/components/*`), and `files` ships all of dist. So graduation adds one @import and moves no path, while repo-only would make graduation the first day an npm consumer, such as your long-use app if it installs from npm (O5), can use the part.
- Your standing intent is that new components 'ship pre-stable'. The docs site is public, so repo-only hides a part from npm installs only, not from readers.
- versioning.astro:22-25 already says per-component dist placement is 'not API until v1.0', so 394.4's promise never to move the path costs nothing: graduation needs no move.
- One cost the doc does not list: derive-floor.mjs:298 reads every dist/css/components file into the published floor.json perComponent map, which components/index.astro:72 displays. 394.4's inventory of readers should include floor.json, not only readers of api.components.

Cost to reverse: Low either way. Moving to repo-only later means leaving experimental files out of dist; a consumer who opted in loses a file that is documented as not API, recorded as a non-Breaking `### Experimental` Removed entry. Moving from repo-only to the tarball later costs nothing.

| premise | command | result | holds |
|---|---|---|---|
| The ./css/components/* export already exists | `grep -n -F '"./css/components/*"' packages/core/package.json` | 43: "./css/components/*": "./dist/css/components/*.css" | yes |
| The tarball ships dist | `sed -n '29,35p' packages/core/package.json` | files: dist, scripts/check-markup.mjs, NOTICE, media, LICENSE | yes |
| Per-file placement is not API before v1.0 | `sed -n '22,25p' apps/docs/src/pages/getting-started/versioning.astro` | 'Per-component dist file placement is also not API until v1.0' | yes |
| 322 unreleased commits since v0.8.0 | `git rev-list --count v0.8.0..HEAD; git log -1 --format='%h %cs' v0.8.0` | 346 (v0.8.0 = 2a4bb245, 2026-09-06) | changed |
| No external consumer exists yet | `gh issue view 2 --json author,createdAt` | The only open issue (#2) was filed by the owner's own account. npm download data was not checked. | unverifiable |

#### O8b

**Recommendation:** WIP cap = 2, counting experimental components and experimental patterns together as 394.7 does. Re-check at 396.13: if two or more needs are waiting at the cap there, raise it to 3.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 394.7 (the cap check reads it), and ACTIVE (Budget must be fully filled).

Why:
- New parts are rare: the newest component directory is `scan` (36b637a3, 2026-08-23), so none in 34 days, and only one pattern page (`first-load`, 2026-08-25) was added in that time.
- Hitting the cap costs only latency: the Milestone block says reaching it 'is not a stop', and the need stays OPEN behind its placeholder.
- A low WIP limit is prudent while the loop's re-score is 2.375 with Correctness 1, because every experimental part adds three N-items and a shipped file.
- One consequence to know: if 395.2 admits `workspace` as an experimental pattern, it takes one of the two slots before any module layout starts, which is why 396.13 is the named re-check point.

Cost to reverse: One token in the Milestone Budget field, which you can edit at any time. Lowering it below the live count would force an early N.3 on the newest part.

| premise | command | result | holds |
|---|---|---|---|
| No new component directories in 33 days | `git log --no-renames --diff-filter=A --name-only --format='@@%h %cs' -- packages/core/src/css/components/ (first add per directory); git log --since=2026-08-24 --diff-filter=A --name-only -- packages/core/src/css/components` | Newest current directory: scan, 2026-08-23. Nothing added since 2026-08-24. Positive control with --since=2026-08-22 finds scan/scan.css, so the zero is real. 40 directories today; nav and record-card were deleted. | yes |
| (my check) pattern pages added in the same window | `git log --since=2026-08-24 --diff-filter=A --name-only -- apps/docs/src/pages/patterns` | 1: first-load.astro (bdc2680e, 2026-08-25) | yes |
| The cap value 2 is already in the Milestone field | `sed -n 163p ROADMAP.md` | 'Budget: m0-wakes 12 · wakes OWNER · … · experimental 2 · …'. It is pre-filled, and milestone.py cannot tell whether you confirmed it. | yes |

#### O8c

**Recommendation:** Two uses are independent when they are distinct (job, pattern) pairs among worked screens that use the part unchanged. For a component the two pairs must differ in pattern id; for a pattern they must differ in job. A module label never counts.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.7 and N.3 counting, and 394.8's Use: lines (site, job, pattern). Depends on 394.9.

Why:
- This is already the adopted text: CLAUDE.md:367-368 (commit c8d2ccb7, your O4) says 'counted by code as distinct job-and-pattern pairs, never by module label', so any other definition reopens O4.
- Pattern id is the right grain: there are 39 pattern ids but only 7 KIND values in kinds.mjs, so counting by KIND would treat a list-report and a master-detail as the same context.
- The tightening fixes a gap in the draft: the entry test E-second requires uses on different patterns.json ids, but G1 at graduation counts (job, pattern) pairs, so a component could enter on two patterns and graduate on two jobs of the same pattern.
- Consequence to accept: module landings are one job on one pattern, so `workspace` used by nine modules still counts once and graduates only if a second job uses it. That is the swap test working as designed.
- It can be computed only after 394.9: today 0 of 27 *.screen.mjs files declare @pattern or @job.

Cost to reverse: Cheap until the first graduation, because it is a counting rule in check code and prose. After a part graduates under it, tightening the rule cannot un-graduate the part without a Breaking entry.

| premise | command | result | holds |
|---|---|---|---|
| The owner-adopted CLAUDE.md already defines independence | `sed -n '364,368p' CLAUDE.md; git log -1 -S 'job-and-pattern pairs' -- CLAUDE.md` | '…counted by code as distinct job-and-pattern pairs, never by module label.' Added in c8d2ccb7, 2026-09-25 (O1-O4 applied). | yes |
| Pattern ids are finer than KIND | `node -e "p=require('./apps/docs/src/data/patterns.json');console.log(p.groups.flatMap(g=>g.tiles).length)"; sed -n '13,50p' examples/erp-suite/kinds.mjs \| grep -o -E ": '[a-z]+'" \| sort -u` | 39 patterns versus 7 kinds (document, home, job, list, report, structure, worksheet) | yes |
| Worked screens do not yet declare a pattern or job | `git ls-files 'examples/erp-suite/**/*.screen.mjs' \| wc -l; git grep -l -F '@pattern' -- 'examples/erp-suite/**/*.screen.mjs' \| wc -l; control: git grep -F -l '@pattern' \| wc -l` | 27 screens, 0 with @pattern, 0 with @job. Control: 5 other tracked files contain '@pattern', so the grep works. | yes |

#### O8d

**Recommendation:** Entry bar: one real use plus a named, queued second use on a different pattern id. 'Queued' means an open ROADMAP item id that code can resolve, not a sentence in the ledger.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 394.8, 394.17's recipe text, and the first N.1 (397.1).

Why:
- It matches your answer 5 (flag it early, remove the flag at admission). 'Two needs before any code' would make every foreseen second use first sit as a second placeholder.
- The failure it guards against is on record: GAP-21 named its second use (a where-used BOM) on 2026-08-25, but nothing queued it until the 2026-09-25 draft made 396.6 build it conditionally. A named but unqueued use rots.
- The lighter bar is already bounded three ways: the cap (O8b), G1's requirement of two real compositions before graduation, and the Rethink rule that removes or absorbs a part still waiting when its N.3 comes up.
- The unforeseen case is already handled by code: such a need stays OPEN with 'Waiting: second use' and is re-filed at two distinct pairs, so the stricter option adds nothing there.

Cost to reverse: Cheap: the bar is a triage entry test and a code check. Tightening it later affects only new entrants, and parts admitted under the lighter bar still face G1.

| premise | command | result | holds |
|---|---|---|---|
| GAP-21's second use was named but never queued | `sed -n '931,955p' .roundtable/erp-suite-gaps.md; grep -n -i -F 'where-used' ROADMAP.md` | The ledger says 'a where-used BOM explosion, which is a second use … Refused for now'. The only ROADMAP mentions are the 2026-09-25 draft lines 847/856 (396.6, conditional on 394.8) and 1245 (394.8). | yes |

#### O8e

**Recommendation:** The loop's N.3 Objective grill graduates the part (G1-G5, with J2 advisory only). You approve at release, where the release notes carry a generated 'Graduated since vX' list built from 394.4's stable-since record. No per-part owner item.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: N.3 items and 394.17 (the recipe names who graduates).

Why:
- The one-way door is publishing, not the commit, and publishing is already yours alone (CLAUDE.md: 'Publishing remains owner-triggered'), so the release is the approval point without adding an owner-blocked item.
- Owner-blocked items rot here: 112.3 has waited 34 days with 0 of 5 briefs written, so a per-part approval item would park every graduation until you get to it.
- The release only works as a checkpoint if graduations are surfaced: 346 commits sit unreleased since v0.8.0, so a single 'Added' line would be buried, which is why the list must be generated.
- The re-score's Correctness 1 comes from dead references and a playbook over-claim (N5, N6), not from shipped code, and G1 is counted by code, so it argues for the generated list rather than for approving each part yourself.

Cost to reverse: Before a release, a graduation is undone by restoring one header line, at no cost. After a release, the class names are API and removing them is a Breaking entry. Switching to per-part owner approval later is a one-line Route change on the N.3 items.

| premise | command | result | holds |
|---|---|---|---|
| Releases are a bottleneck (322 commits since v0.8.0) | `git rev-list --count v0.8.0..HEAD` | 346; the last release was 2026-09-06, 20 days ago | changed |
| Owner-blocked 112.3 has no briefs | `awk count of non-template lines under BRIEF-n in .roundtable/pilot-112/briefs.md; git log --format='%h %cs' -- .roundtable/pilot-112/` | 0 briefs. Scaffolded e58ea3ca on 2026-08-23; the only later change is a README note (f873e16b, 2026-09-23). | yes |
| What Correctness 1 is about | `grep -n -E 'Correctness\|N5\|N6' .roundtable/loop-doctor-rescore-2026-09-26.md` | N5 = two dead file references in ROADMAP.md; N6 = LOOPS.md claims more than step0_guard does | yes |

#### O8f

**Recommendation:** No. An experimental part must meet the framework floor, today the label in `packages/core/dist/floor.json` (print it: `node -p "require('./packages/core/dist/floor.json').label"`), for its core and degrades features. Newer features are allowed only as a `polish`-tier enhancement, the same rule stable parts follow. If O5 puts rugged RF in scope, a part used on an RF screen must also meet rf-essentials' Chrome/WebView 108 floor.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: high · blocks: 394.4 (its 'floor does not change' property), G4 at N.3, 394.17

Why:
- Under O8(a) the part ships in dist/css/components, and derive-floor.mjs:298-330 already fails the build when any file there floors above the framework floor. Saying yes would mean weakening the one check that script says catches its own drift.
- Graduation is meant to be deleting one line, but an above-floor part would raise the published floor (DESIGN.md:75, README.md:60, floor.json) the day it joins index.css: a consumer-visible change made by the loop.
- The floor is derived from probes, not typed by hand (the check-floor gate), so an above-floor feature is caught only if derive-floor has a probe for it. 394.4's red-proof should add a probe for any new feature a part uses.
- 394.4's own wording needs a fix: the framework floor reads dist/css/index.css (derive-floor.mjs:90); only the per-component loop reads components/*.css.

Cost to reverse: Relaxing later is a code change to derive-floor plus a floor.json note. Tightening later could force rewriting a part consumers already opted into.

| premise | command | result | holds |
|---|---|---|---|
| The project states a browser floor | `sed -n 75p DESIGN.md; python3 -c "import json;print(json.load(open('packages/core/dist/floor.json'))['label'])"; sed -n '95,100p' packages/core/package.json` | The derived floor is `floor.json`'s `label`. browserslist agrees on Chrome/Edge, but is one version LOWER on Firefox and on Safari (compare the two commands' output). | yes |
| derive-floor reads the per-component files and fails any above the floor | `grep -n -E "index.css'\)\|const componentDir\|above the framework floor\|process.exit\(1\)" packages/core/scripts/derive-floor.mjs` | 90 reads index.css (the framework floor); 298 reads dist/css/components; 328-330 exits 1 with 'above the framework floor' | yes |
| (my check) current components all sit at or below the floor | `python3 Counter over floor.json perComponent labels` | 40 components; the highest per-component label is at or below `floor.json`'s `label` on every browser, so none exceeds the floor | yes |
| 394.4: the framework floor is derived from dist/css/components/*.css | `sed -n 90p packages/core/scripts/derive-floor.mjs` | The framework floor comes from index.css; components/*.css feed only the per-component check | no |

#### O10

**Recommendation:** Option (a): lift 112.4's dependence on 112.3 and re-scope it as a pattern-keyed Screen Contract whose regions start as warnings, sequenced after 394.10, with 112.3 kept as the job index's evaluation. Record it as superseding your 2026-08-22 and 2026-08-29 decisions by name. Keep it inside bo-check-markup and patterns.json (no new bin or package), and keep the regions field out of the exported schema until warnings are promoted.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 396.2 (it pre-registers score.mjs as an A/B metric), 396.5, Done-test 6, and the two owner-blocked rows 112.3 and 112.4

Why:
- The gate has not opened and the loop cannot open it: briefs.md holds 0 of 5 briefs and SEALED-PICKS.md holds 0 picks, 34 days after the scaffold (e58ea3ca, 2026-08-23).
- The gate measures the wrong property for this layer. 112.3 measures discovery (does an agent pick the right pattern), but a region contract targets completeness, and the recorded completeness failure is GAP-17 (6 of 7 list screens missing the create action), which your 08-29 decision excluded from the pilot's bar.
- The layer keeps being requested: in the 08-22 proposal, in 373.7's 'Not built, by name … 112.4 word for word' (ROADMAP.md:5413-5419), and in the milestone's own decision 2, 'which parts compose it'.
- It consolidates rather than adds: score.mjs OWES is already an unpublished contract keyed by 7 KINDs, and patterns.json already carries States and dataContract for 39 of 39 patterns, so one pattern-keyed source replaces two vocabularies.
- Starting as warnings follows CLAUDE.md's rule to measure a predicate's base rate before shipping it as a gate. It also answers your 08-22 worry that an unadmitted schema becomes surface that cannot fail.
- 112.3 keeps its unique value, discovery measured against sealed human picks, which is exactly what jobs.json claims to improve. But its instrument has moved (llms.txt 36.7 kB at 112.2, 50,673 bytes now), so any run must record the llms.txt it actually received.
- The real first cost: patterns.json has anatomy for 0 of 39 patterns (gen-patterns.mjs:17 keeps Anatomy out of scope), so step one is extracting the 39 gated Anatomy lists, the work 112.1 deferred.

Cost to reverse: Cheap while it is warnings-only and unpublished: delete the field and the warning branch. Once a regions field ships in an exported patterns.json (O9), it is schema, and removing it is a Breaking entry. Option (b) costs nothing now, but leaves two items owner-blocked and a two-vocabulary scoring model for the whole milestone.

| premise | command | result | holds |
|---|---|---|---|
| 112.3 is blocked on owner briefs that do not exist | `awk count of briefs in .roundtable/pilot-112/briefs.md; grep -c -E '^BRIEF-[0-9]+: *[a-z]' .roundtable/pilot-112/SEALED-PICKS.md; git log --format='%h %cs %s' -- .roundtable/pilot-112/` | 0 briefs and 0 picks (the 16-line template was read directly). Scaffold e58ea3ca 2026-08-23; later only f873e16b (2026-09-23, README instrument note). | yes |
| GAP-17: list-report anatomy gap propagated to 6 of 7 list screens | `grep -n -F '6 of 7' .roundtable/erp-suite-gaps.md` | 730: '6 of 7 suite list screens have no create action' | yes |
| patterns.json has States and data contract for 39/39, but no anatomy | `node -e "p=require('./apps/docs/src/data/patterns.json');a=p.groups.flatMap(g=>g.tiles);console.log(a.length,a.filter(x=>x.states).length,a.filter(x=>x.dataContract).length,a.filter(x=>x.anatomy).length)"; git grep -l -F '>Anatomy<' -- apps/docs/src/pages/patterns \| wc -l` | 39 / 39 / 39 / 0. All 39 pattern pages carry an Anatomy h2. | yes |
| score.mjs OWES is a kind-keyed contract | `grep -n OWES examples/erp-suite/score.mjs` | 48: const OWES = { functionality: { list, document, worksheet, report, structure, job … } } | yes |
| llms.txt (the pilot's instrument) has changed since the protocol | `wc -c < apps/docs/dist/llms.txt` | 50,673 bytes (built 2026-09-26 01:55), versus 36.7 kB recorded at 112.2 | changed |
| Where 112.4 lands in rule M's order | `grep -n by_age scripts/loops/milestone.py` | 642: sorted by gs._id_key, so an M1-tagged 112.4 dispatches straight after 394.10, ahead of 394.11-394.17 and the frame (395.1) | yes |

*Cross-group notes:* - **O7 sequencing.** O7 gates 394.4, and CLAUDE.md:365-366 still reads 'the word is owner decision O7, pending'. Recording the answer means editing that line.
- **O8(a) waits on O6.** O8(a) depends on O6 / 394.3 (E-release). There are 346 commits since v0.8.0 (2026-09-06), up from 322 on 09-25. No `@status experimental` line may merge before 394.3 closes.
- **O8(b) value is pre-filled.** `experimental 2` already sits in the Budget field. Like the four fields the re-score flagged (Precedence, Rules-2-3, Planner, Direction-drift), milestone.py cannot tell it was confirmed, so the O8 answer must go in the O-table at ROADMAP.md:371.
- **O8(c) and (d) wait on 394.9.** Today 0 of 27 screens declare @pattern or @job, so neither can be computed yet.
- **G1 wording.** The G1 text in prompt §9.3 and 394.7 should gain the component clause: the two pairs must differ in pattern id.
- **O8(f) depends on O5 Devices.** If rugged-rf is yes, an experimental part used on an RF screen must also pass check-rf-floor.mjs (108), and 394.4 should say so.
- **394.4 fixes.** Its sentence 'the framework floor (derive-floor reads dist/css/components/*.css)' needs correcting: the framework floor reads index.css (line 90), and the per-component loop fails anything above it (lines 298-330). Its reader inventory should also add floor.json perComponent (components/index.astro:72).
- **O10 timing.** Decide O10 before 396.2, not only before 396.5. 396.2 pre-registers score.mjs as an A/B metric, and (a) changes what score.mjs reads. Either add `After: 112.4` to 396.2 or pin the score.mjs commit in the protocol.
- **O10 order.** Under rule M's by_age sort (milestone.py:642), an M1-tagged 112.4 dispatches straight after 394.10, ahead of the frame, which is already dispatch #26. If you want the frame first, add `After: 395.1` to 112.4.
- **O10 and O9.** If the contract ever ships inside an exported patterns.json, O9's approval should name that field.
- **Small defect for the defect track.** browserslist and DESIGN.md:75-77's Firefox prose lag the derived floor stat by one version on Firefox and on Safari (compare `floor.json`'s `label` with package.json's `browserslist`).
- **Jev not called.** O13, which decides what may be sent to jev-ai.pro, is undecided. The round-2 call on this same O7/O8 choice returned 1.00 on a leading payload, which the report itself said was not evidence.
- **Scratch file.** /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/dirs-norename.txt holds the first-add date of every component directory.

### Loop configuration and the M0 outcome — O11, O12, O14, O16, O17

#### M0-FAIL

**Recommendation:** Option (1): extend the bootstrap to 398.1 + 398.2 + one second fresh-context re-score, set m0-wakes 13, keep rules 2-3 paused until that re-score, and allow one retry only (if it fails again only on new text-level Invalids with no dimension at 1, set ACTIVE and file them under 398).

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: ACTIVE (M0 exit test); 398.1, 398.2 and 398.3 timing

Why:
- Option (2) keeps the defects for the whole milestone, not just the test: Parked items are held while M1 is ACTIVE (393.3 marker table, 398 preamble), so 398.2's fail-open (five malformed In-flight lines all read 'nothing in flight', exit 0) would stay live while §8 runs module items as Workflow runs.
- The fix is cheap: every Invalid is a text edit ('none needs code', rescore report line 50), and M0 averaged about 35 min per wake (10 wakes, 20:34 to 02:25), so 3 more wakes is about 2 hours.
- ESTIMATE, not a measurement: with N2-N7 and both Redundants fixed, the ceilings lift, and the report's own Risk counts put every dimension at 3 (Correctness 3 on 2 Risks, or 4 once 398.2 removes the exit-1 crash; Maintainability and Understandability 3-4), which gives a mean of 3.0-3.4.
- The same estimate is fragile: each new Invalid a fresh scorer finds costs 0.125, and the 09-26 scorer found 7 new ones right after the old 4 were fixed while skipping LOOPS.md:1178-1641 and :1841-2164, so passing is roughly even odds (about 40-60%).
- Include 398.2 (hence 13, not 12): it is the only finding that changes runtime behaviour, and 398.3 closes at no cost once you fill the O11/O12/O14/O16 cells, because its Accept counts that as a satisfying outcome.
- Keep rules 2-3 paused through the retry: dispatch_status.py now prints Standardize 14/4 and Objective 3/3 [375, 392, 393] OVERDUE, and those would spend the extension wakes on M0's own rows, which changed 0 lines under packages/, apps/docs/src and examples/.
- Cap it at one retry: M0 has already spent 10 wakes and shipped no product, and Slice 381's heading records what machinery loops cost.

Cost to reverse: Low: about 3 wakes (about 2 h). If the retry fails you can still choose ACTIVE, so nothing is locked in. Option (2) is the costlier one to reverse, because unparking 398.x during ACTIVE needs an owner edit.

| premise | command | result | holds |
|---|---|---|---|
| 10 of 12 bootstrap wakes used | `grep -F ' · 393.' .roundtable/loop-log.md \| awk -F' · ' '{print $1}' \| sort -u \| wc -l` | 10 distinct timestamps (20:34 09-25 to 02:25 09-26) | yes |
| Re-score FAIL: mean 2.375, Correctness 1, Maintainability 1; N2-N7 are text edits | `Read .roundtable/loop-doctor-rescore-2026-09-26.md lines 10-60` | as stated; Correctness is capped by N5 and N6; Maintainability by N2, N3, N4 and N7; Understandability 2 by N1 (fixed in 393.10's commit) | yes |
| Loop-doctor ceiling rule | `Read ~/.claude/plugins/cache/busy-office-ai-skills/busy-office/0.9.4/skills/loop-doctor/references/scorecard.md lines 10-25` | 5 = every check passes; 4 = at most 1 Risk, nothing Invalid; 3 = 2+ Risks; 2 = one Invalid; 1 = two or more | yes |
| Slice 398 is parked | `sed -n 261,277p STATUS.md` | 398.1, 398.2 and 398.3 read 'M1, not held' | yes |
| M0 shipped no product | `for c in $(git log --format=%h --grep='^393\.' -E --since=2026-09-24); do git show --numstat --format= $c -- packages/ apps/docs/src examples/; done` | 0 lines across all 10 of M0's commits | yes |
| Rules 2-3 resume after 393.10 and are overdue | `python3 scripts/loops/dispatch_status.py` | Standardize 14 / 4 OVERDUE; Objective 3 / 3 OVERDUE [375, 392, 393] | yes |

#### O11

**Recommendation:** Precedence: interleave 1/3 track=defect. Before ACTIVE, 375.11 gets a NEEDS-RUNTIME line (Firefox half) so the interleave does not keep re-picking it.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- The defect track is 16 items, not 15, and all 16 are open and dispatchable (none are in STATUS.md's owner- or dependency-blocked lists) in a live npm package; at 1/3 they clear in about 45-48 dispatches, before rule M reaches the module fan-out (396.5 is entry 52 in milestone.py --compare).
- 'preempt' would leave them until M1 closes, and 'after <id>' would put rule 4's whole free backlog (34 free items in the HEAD replay) ahead of every M1 item.
- A scratch clone with M1 ACTIVE shows the first dispatch goes to 375.11 ('interleave 5/2 → this dispatch goes to defect 375.11'), and its only open half needs a Firefox that exits 'Could not find profile folder' on this machine.
- Interleaved wakes are never consecutive on one item, so the no-progress stop would never catch 375.11 being re-picked; adding a NEEDS-RUNTIME line in the clone moved the pick to 377.4.
- Cost to the frame, by arithmetic from the --compare order: 395.1 is the 17th own M1 dispatch (21st counting folded items), so at 1/3 it lands at about overall dispatch 25-31, before sweeps and grills.

Cost to reverse: One field edit, effective on the next wake; the interleave is counted from log rows, so nothing needs migrating.

| premise | command | result | holds |
|---|---|---|---|
| The defect track is 15 items | `grep -c -E '^\s+Track: defect\s*$' ROADMAP.md (plain grep -c -F 'Track: defect' gives 20; 4 are prose mentions at lines 1527, 1667, 1788 and 2382)` | 16 own-line markers, all open: 392.2, 392.3, 389.3, 389.16, 389.19, 389.23, 389.24, 388.3, 388.4, 387.1, 387.2, 386.1, 377.4, 377.8, 377.11, 375.11 | changed |
| Interleave falls back to rule M's pick when no defect item is dispatchable | `sed -n 31,37p scripts/loops/milestone.py` | 'with none dispatchable it stays with rule M and the count is not reset' | yes |
| First interleave pick at activation | `scratch clone (git clone --local), fields filled, Status ACTIVE: python3 scripts/loops/dispatch_status.py` | 'interleave 5/2 → this dispatch goes to defect 375.11'; with a NEEDS-RUNTIME line added: '→ defect 377.4' | yes |
| Frame lands at dispatch #26 (machinery first) | `python3 scripts/loops/milestone.py --compare` | IDENTICAL 61/61; 395.1 follows 393.11 … 394.17 (16 own items plus 4 folded items still ahead of it) | changed |

#### O12

**Recommendation:** Rules-2-3: scoped. Record defect-interleave rows with both --milestone M1 and --track defect, so scoped rules 2-3 and the wake budget see them.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- 381.2's base rate re-runs at 4 of 20 grills armed on slices that shipped nothing, at both the pinned rev and HEAD; 'normal' would keep arming on machinery rows like M0's 10 zero-product commits, and scoped arms only on M1 rows.
- 'suspended' gives one sweep and one grill across a milestone of 60 or more wakes, and LOOPS.md rule 3 records five counter-starvation bugs, so review would effectively stop.
- In the scratch clone with M1 ACTIVE and scoped, Standardize reads 5/4 OVERDUE (the five M0 rows 393.6-393.10 already carry milestone=M1) and Objective reads 1/3, so the first ACTIVE wake sweeps M0's machinery, which is exactly what the re-score found unswept.
- Prompt §11 writes '[--milestone M1 | --track defect]', but dispatch_status.py:440 counts only milestone= rows under scoped, so 16 fixes to shipped CSS/JS would never arm a Standardize sweep; milestone.py:278 already treats a row with both tags as a defect for the interleave, so both tags are safe.

Cost to reverse: One field edit; switching to normal later counts every row since the last run of each rule, which is 14/4 and 3/3 today, so both would fire at once.

| premise | command | result | holds |
|---|---|---|---|
| 381.2 base rate is 4 of 20 | `python3 .roundtable/milestone-m1-2026-09-25/grill_shipped.py --rev 5177daad ; … --rev HEAD ; … --redproof` | 'shipped nothing: 4 of 20' at both revs (109 rows parsed = raw); red-proof PASS (381 = 0, 392 = 174) | yes |
| Scoped counts only milestone-tagged rows | `sed -n 430,440p scripts/loops/dispatch_status.py; scratch-clone dispatch_status.py with Rules-2-3: scoped` | 'Standardize 5 / 4 … OVERDUE (scoped: M1 rows only)', 'Objective 1 / 3 … [393]' | yes |
| No row is tagged yet (393.5: 0 of 1,804) | `grep -c -F 'milestone=M1' .roundtable/loop-log.md` | 5 (393.6-393.10, recorded after 393.5) | changed |

#### O14

**Recommendation:** Tiers: top=claude-opus-5-5 · balanced=claude-sonnet-5 · fast=none — Planner: top (so the planner runs on Opus 5.5 at xhigh); the planner is never non-Claude.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: ACTIVE

Why:
- Every one of the 8,608 workflow-subagent messages in this session ran on claude-opus-5-5, and no recent transcript contains a claude-fable model, so a Fable 5.1 subagent is unverified here and should not be tried for the first time when rule D fires unattended.
- The Planner field accepts only top, balanced or fast (milestone.py:108); a Fable-only planner needs a grammar change, and top=Fable would move all 31 build, 29 design and 2 research routes onto Fable.
- At the cached Fable 5 prices that is twice Opus 5 ($10/$50 vs $5/$25 per 1M); Fable 5.1 and Opus 5.5 prices are unverified, and the claude-api skill's own cached table has garbled input prices.
- balanced=claude-sonnet-5: the harness ran 217 claude-sonnet-5 messages beside Opus 5.5 in this session, and mechanical has a J2 critic plus before/after counts; only one item ever carried Route: mechanical (393.9, closed), so both the saving and the risk are small.
- fast=none: collect's critic is 'none' (routes.json) and it returns counts that become load-bearing, and CLAUDE.md says an instrument's first output is not evidence, so it runs on top.
- Non-Claude planner: no, because Slice 375 retired the Codex peer-lead arrangement ('Claude Code carries out authorized development independently') and M1's Non-goals already list 'Non-Claude agents'.
- Today the planner is 'stronger' only through effort (xhigh vs build's high in routes.json); revisit Fable 5.1 as a planner-only model once a Fable subagent launch is verified and Planner accepts a model id.

Cost to reverse: One field line; --model and --tier record the model actually used, so history stays honest; moving the planner to Fable is a Tiers edit, or a small grammar change for planner-only.

| premise | command | result | holds |
|---|---|---|---|
| Which models the harness actually runs | `grep -o '"model":"claude-[a-z0-9-]*"' over ~/.claude/projects/-Users-thepfmind-Projects-busy-office-ui/*.jsonl and subagents/workflows/*/agent-*.jsonl` | session 1dbfe40a: 1,843 claude-opus-5-5 and 217 claude-sonnet-5; workflow agents: 8,608 claude-opus-5-5; claude-fable-*: 0; claude-haiku-4-5-20251001: 2 | yes |
| Fable 5.1 and Opus 5.5 prices | `Skill claude-api (cached 2026-06-24)` | lists Fable 5 ($50 output) and Opus 5 ($25 output); no Fable 5.1 or Opus 5.5 rows; input-price cells garbled | unverifiable |
| Slice 375 retired the non-Claude lead | `Read ROADMAP.md:4191-4221` | 'remove the instructions designating a peer agent ("Codex") as development lead. Claude Code carries out authorized development independently' | yes |
| The field lines parse | `scratch clone: python3 scripts/loops/milestone.py` | exit 0; M1 ACTIVE verdict printed | yes |
| Route volume by tier | `grep -E '^\s+Route: ' ROADMAP.md \| sort \| uniq -c` | build 31, design 29, research 2, planner 2, owner 6, mechanical 1 | yes |

#### 393.6-none-tier

**Recommendation:** Confirm: a tier set to none runs on top (the telemetry records the substitution); do not refuse.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: O14's fast=none

Why:
- Refusing would make every item on that route undispatchable in the middle of the milestone, while running on top is never weaker and route_model prints '(tier X is none → top)' with --tier/--model recording what actually ran (milestone.py:376-389).
- The fallback always resolves, because Tiers must name all three tiers and 'top cannot be none' (milestone.py:149-152).
- It is also what §5 and O14's own text say ('every route maps to top'), and fast=none in the recommended Tiers line depends on it.

Cost to reverse: A one-line code change either way (393.6).

| premise | command | result | holds |
|---|---|---|---|
| none runs on top in code | `sed -n 372,389p scripts/loops/milestone.py; sed -n 140,153p` | returns ('top', tiers['top'], ' (tier … is none → top)'); `Tiers: top` cannot be none | yes |

#### O16

**Recommendation:** D1 runs before rule 6 Polish, as coded (right after rules 1-4 find nothing, at most once per 24 h). D4 off: Direction-drift: off

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- Rule 6's predicate is true of every non-skipped surface ('marked_dry = 0 … every row, every revision', LOOPS.md:926-929), so 'only where rule 8 would stop' means D1 never fires, which breaks your 'escalate when there is no task'.
- D1 has a bounded base rate: 5 of 45 dates per-date, and all-held fires on 11 of 34 dates, 9 after the once-per-24h limit (replay at HEAD).
- D4 as coded counts only packages/core/src (milestone.py:866), but M1's product lands in examples/erp-suite and apps/docs/src, so a run of module-layout landings would read about 0% and fire on the milestone's intended work.
- History would fire D4 almost every day anyway: the median 10-landing share is 4.8% and a 10% X fires on 408 of 584 windows (27 dates after the 24 h limit), and Done-test 7 already reports product share at close.
- If you ever turn D4 on, first widen its path set to packages/ + apps/docs/src + examples/ with ROADMAP*.md out of the denominator, re-run the replay, and only then choose N and X.

Cost to reverse: One field edit to turn D4 back on, but a correct D4 for M1 needs a code change to framework_share and a re-run replay; D1's placement is already in code and would take a LOOPS.md and milestone.py change to move.

| premise | command | result | holds |
|---|---|---|---|
| D4 median share 4.9%, packages/core/src 6.0% of lines | `python3 .roundtable/milestone-m1-2026-09-25/replay_triggers.py --rev HEAD --n 10` | median 0.048; all landings 9668/167195 = 5.8%; below 10/20/30%: 408/524/554 of 584 windows; collapsed 24h 27/29/29 | yes |
| D1 firing rate | `same replay` | D1 fires 5 of 45 dates; all-held 11/34 dates, 9 once per 24 h | yes |
| Product about 11% of changed lines since 09-18, excluding roadmap | `git log --numstat ce17d9b4..HEAD, bucketed by path, ROADMAP*.md excluded` | 32,975 non-roadmap lines: packages/ 1,565 (core/src 766), apps/docs/src 1,512, examples 7 → 9.4%; .roundtable 54.5%, scripts/loops 13.1% | unverifiable |
| D4 reads only packages/core/src | `grep -n 'packages/core/src' scripts/loops/milestone.py` | line 866 counts only paths starting with packages/core/src/ | yes |

#### O17

**Recommendation:** Budget: m0-wakes 13 · wakes 60 · agents/wake 8 · workflow-wall 90m · experimental 2 · resume-lines 120 · direction-items 5

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: ACTIVE (Budget is on milestone.py's unfilled list)

Why:
- wakes 60 is a first checkpoint, not the whole milestone (an estimate): about 25-31 dispatches reach the frame at 1/3 interleave, plus scoped sweeps, grills and about 9 sharpen bounces (--compare 'sharpened first'), which puts 60 around the first module (396.3), just before your 396.13 call.
- agents/wake 8: 14 of the 15 workflow runs in this session used 8 or fewer agents and peak concurrency never passed 6; the machine has 10 logical CPUs (4P + 6E), not 8, but agents are API-bound and §10 runs builds one at a time.
- agents/wake is printed, not enforced (milestone.py:835-838), so the dispatcher has to honour it in each Workflow script.
- workflow-wall 90m covers 12 of 14 completed runs; 60m would have cut 4 of the 6 design and grill panels (73-98 min) that M1's design route resembles, and a hit cap keeps partial output while hold wakes cost 2 tool calls (393.2).
- resume-lines 120 holds with room to spare (RESUME.md is 80 lines and the charter passes), and direction-items 5 has no history against it; experimental 2 is O8(b)'s value, left as the doc recommends.

Cost to reverse: Field edits at any time; with 'budget' in Stop, reaching 60 halts and reports, and you raise it.

| premise | command | result | holds |
|---|---|---|---|
| The measured hardware ceiling is 8 | `sysctl -n hw.ncpu; sysctl -n hw.perflevel0.physicalcpu hw.perflevel1.physicalcpu` | 10 (4 performance + 6 efficiency); no source for '8' found in the repo or the draft files | no |
| Completed workflows ran 35 and 60 min, the uncapped one 2h52m or more | `python over subagents/workflows/wf_*/agent-*.jsonl, first to last agent timestamp` | 14 completed runs: 3.2, 17.6, 19.0, 19.3, 19.6, 20.2, 21.3, 35.2, 35.3, 59.9, 73.1, 81.9, 98.1, 388.0 min; peak concurrency 6 | changed |
| RESUME line cap 120 fits | `wc -l .roundtable/RESUME.md; node apps/docs/scripts/check-resume-charter.mjs` | 80 lines; 'resume charter passed — 16 charter rules hold' | yes |
| Budget line is valid | `scratch clone: python3 scripts/loops/milestone.py` | exit 0; 'budget wakes 5/60 · … workflow-wall 90m …' | yes |

#### prefill-Precedence

**Recommendation:** Stands: Precedence: interleave 1/3 track=defect — record it in the O11 cell.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- It matches the O11 recommendation above, and it parses and computes in the scratch clone; its one hazard (375.11 as the first pick) is fixed by a marker, not by changing the field.

Cost to reverse: One field edit.

| premise | command | result | holds |
|---|---|---|---|
| Pre-fill counted as owner-filled | `python3 scripts/loops/milestone.py` | 'M1: DRAFT · unfilled: App, Modules, Devices, Tiers, Budget' (Precedence not listed) | yes |

#### prefill-Rules-2-3

**Recommendation:** Stands: Rules-2-3: scoped — record it in the O12 cell, and fix §11's record command to '--milestone M1 [--track defect]'.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- It matches O12 above; without the dual tag, defect fixes would escape scoped sweeps and the wake budget (dispatch_status.py:440, milestone.py:285-289).

Cost to reverse: One field edit.

| premise | command | result | holds |
|---|---|---|---|
| Scoped is live code | `scratch clone dispatch_status.py` | '(scoped: M1 rows only)' on both counters | yes |

#### prefill-Planner

**Recommendation:** Stands: Planner: top — with Tiers top=claude-opus-5-5; record it in the O14 cell.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: ACTIVE

Why:
- top is the only tier mapped to the strongest model verified in this harness (Opus 5.5), and the planner route adds effort xhigh.

Cost to reverse: One field edit.

| premise | command | result | holds |
|---|---|---|---|
| Planner grammar | `sed -n 104,111p scripts/loops/milestone.py` | Planner ∈ top\|balanced\|fast | yes |

#### prefill-Direction-drift

**Recommendation:** Stands: Direction-drift: off — record it in the O16 cell.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: ACTIVE

Why:
- D4's instrument counts only packages/core/src and would fire on M1's own examples/ and apps/docs/src work; see O16.

Cost to reverse: One field edit, plus a code change if D4 is wanted with the right path set.

| premise | command | result | holds |
|---|---|---|---|
| D4 would fire on most days | `replay_triggers.py --rev HEAD --n 10` | a 10% threshold fires on 27 of 33 dates (once per 24 h) | yes |

*Cross-group notes:* Changes outside this group that my recommendations depend on:
(1) The loop, not the owner, should give 375.11 a NEEDS-RUNTIME line (its Firefox half) before ACTIVE. Checked in a scratch clone: the interleave pick moves from 375.11 to 377.4.
(2) Prompt §11's record command should read '--milestone M1 [--track defect]' instead of '[--milestone M1 | --track defect]'. milestone.row_tags treats a row with both tags as a defect, and wakes_used counts only milestone-tagged rows.
(3) The owner writes O11, O12, O14 and O16 into the decision-table cells at ROADMAP.md:371. That makes the four pre-filled fields owner-set and closes 398.3's premise. milestone.py today lists only 'App, Modules, Devices, Tiers, Budget' as unfilled.
(4) ACTIVE still needs O5 (App/Modules/Devices), which is outside my subset. The experimental cap (2) in the Budget line is O8(b)'s value.
(5) The ACTIVE date: rows tagged milestone=M1 on or after that date count toward `wakes`. In the what-if, the 5 M0 rows (393.6-393.10, dated 09-26) printed 'wakes 5/60'. Under scoped they also make Standardize read 5/4 OVERDUE at activation, so the first ACTIVE wake is a sweep.
(6) Archiving the cloud sessions (O1, Safety risk a) is your action and also helps the re-score.
(7) The 8 unreleased P0 fixes (377.5/O6) are not served by any Precedence value, because publishing stays owner-triggered.
(8) The 'hardware ceiling 8' in O17 has no source in the repo; hw.ncpu is 10.

Scratch evidence is under /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/:
- clone/ is the what-if with the fields filled and M1 ACTIVE;
- replay_head_n10.txt/.json are the D1-D4 replay;
- grill_5177.txt and grill_head.txt are the 381.2 base rate;
- dispatch_status.txt is the live status.

No repo file was edited.

### Jev — O13, O15, 394.18

#### O13

**Recommendation:** Approve the queue screen (JQ) as Jev's third declared point in one owner commit that does three things: rewrites all five places the 'two points' and 'not a gate' rule is stated (CLAUDE.md:92, :95, :102 and jev-rubrics.md:4-5, :186); names JQ as a point that never picks, orders, skips or approves an item; and restores .roundtable/grill-kev-in-the-loop-2026-09-21.md to main from the park branch.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 394.14 -> 394.15 -> 394.16, and 397.2 (the milestone close lists 394.18 in its After). It does not block ACTIVE.

Why:
- The owner's standing intent is that Jev 'screens and advises, never decides', and JQ in shadow is exactly that: the committed gate file says it 'never selects, orders, skips, closes, admits or approves an item, and in shadow it acts on nothing'.
- Running in shadow costs little: over the 35 pilot calls the median was 688 ms and 872 input tokens per call (pilot_results.json).
- The 09-21 grill refused Jev as the dispatcher 'on grounds a better model does not fix' (Part 1); that refusal stays intact because rule M in milestone.py still picks the item, and the grill left the screening question (Part 2) 'genuinely open for Jev' under two reopen conditions, which 394.13 and 394.14 test.
- The amendment must reach every copy of the rule: the re-score dropped Maintainability to 1 precisely because M0 changed rules without sweeping their other statements (N2-N4), and git grep finds this rule at CLAUDE.md:92, :95, :102 and jev-rubrics.md:4-5, :186.
- The grill file has to come back to main because ROADMAP.md:1372 (394.14's Accept) quotes it, `test -e` on main exits 1, the file exists only on park/owner-checkpoint-2026-09-20, and .roundtable/INDEX.md lists it 0 times, so the 'check INDEX before grilling' rule cannot find the earlier refusal.
- JQ's value is not yet proven: beyond the code item lint, its only enforceable pilot catches were 173.2 (owner 0.99) and 307.1, which is what shadow calibration exists to measure; declining would move the frame about 2-3 dispatches earlier than #17.

Cost to reverse: Low. Revert the text amendment and close 394.14-394.16 as refused; about 2-3 wakes of built script and gate become dead code. Nothing needs recalling, because the item text sent was already public.

| premise | command | result | holds |
|---|---|---|---|
| CLAUDE.md's Jev section says 'exactly two points' and 'not a gate' at lines 88-100 | `grep -n -F 'exactly two' CLAUDE.md; grep -n -F 'not a gate' CLAUDE.md` | 95: '...Use it at exactly two' (the line wraps before 'points'); 102: '**It is advisory and it is not a gate.**'; the heading is at 92 and the section runs 92-107 | changed |
| The repo is PUBLIC | `gh repo view --json visibility,nameWithOwner,isPrivate` | {"isPrivate":false,"nameWithOwner":"Busy-Office/busy-office-ui","visibility":"PUBLIC"} | yes |
| The item is now 394.18, and 394.14 waits on it | `grep -n -F '394.18' ROADMAP.md` | 1359: 'After: 394.12, 394.13, 394.18, 393.4' (394.14); 1447: '394.18 — OWNER CALL: declare the queue screen as Jev's third point' | yes |
| O13 no longer blocks ACTIVE | `python3 scripts/loops/milestone.py` | 'M1: DRAFT · unfilled: App, Modules, Devices, Tiers, Budget'; the field block has no Jev field. 397.2's After does list 394.18 (ROADMAP.md:673), so it blocks the milestone's close | yes |
| 394.14 can quote grill-kev-in-the-loop-2026-09-21.md | `test -e .roundtable/grill-kev-in-the-loop-2026-09-21.md; git cat-file -e park/owner-checkpoint-2026-09-20:.roundtable/grill-kev-in-the-loop-2026-09-21.md; grep -c -F kev-in-the-loop .roundtable/INDEX.md` | test -e exit 1 on main; the file exists on the park branch (parked by O2 in a9a2d9bb); INDEX.md count 0 | no |
| The frame is at dispatch #26 (Slice 394 header) | `sed -n '630,2554p' ROADMAP.md > scratch/o13_slices.md; python3 .roundtable/milestone-m1-2026-09-25/simulate_rule_m.py o13_slices.md` | 'first design-route item: 395.1 at dispatch #17'; 394.13, 394.14 and 394.15 come before it | changed |

#### O13b

**Recommendation:** Allowed to leave the machine: for JQ, only the selected item's committed ROADMAP.md text (title, about 700 chars of context and the Accept, at most 1,500 chars, no framing sentence). For J1 and J2, only text and gate output from this public repo. Never: anything from busy-office-erp, NotebookLM, owner messages, credentials or env, or customer or business data.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.18's record, and 394.14 (queue_screen.py's payload builder).

Why:
- busy-office-ui is PUBLIC and main equals origin/main (0 commits ahead, 0 behind), so committed item text is already published and sending it exposes nothing new.
- busy-office-erp is PRIVATE (verified with gh) while ROADMAP.md names it 4 times, so the rule has to be about where text comes from (this public repo), not what it is about; otherwise an ERP excerpt pasted into J1/J2 evidence would leave the machine.
- The pilot already worked this way: its 26 states were item text only, the longest 1,520 JSON characters (pilot_states.json).
- Starting narrow is the only safe direction, because anything already sent to jev-ai.pro cannot be recalled.

Cost to reverse: Widening the rule later takes one sentence in the amendment. Narrowing it cannot recall what was already sent, which is the reason to start narrow.

| premise | command | result | holds |
|---|---|---|---|
| The roadmap text is already public | `gh repo view --json visibility; git rev-list --count origin/main..main; git rev-list --count main..origin/main` | PUBLIC; 0 ahead; 0 behind | yes |
| The owner's first-user app repo is private | `gh repo view Busy-Office/busy-office-erp --json visibility; grep -c -F busy-office-erp ROADMAP.md` | PRIVATE; 4 mentions in ROADMAP.md | yes |
| The pilot sent item text only, at most 1,500 chars | `python3 over scratch design-jev-triage/pilot_states.json: max len(json.dumps(state))` | 26 states, max 1,520 JSON chars, min 270; each state is 'Item: <id> — <title>\nContext: …\nAccept: …' | yes |

#### 394.18-mode

**Recommendation:** Shadow: set `mode: shadow` in queue_screen.json until the owner decides promotion at 394.16. Do not choose escalate-only.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.14 (the gate file records the mode). 394.15's escalate-only red-proof is needed only if escalate-only is chosen.

Why:
- Escalate-only lets a Jev probability decide whether a top-tier planner run happens, which makes it a routing gate; that contradicts CLAUDE.md:102 ('it is not a gate') and the owner's 'never decides'.
- The only rule escalate-only acts on is done_evidence:nothing_stated >= 0.15, and that is the question one framing sentence moved from 0.56 to 0.24 on 173.2, while ask-owner, the one cleanly separating question (0.99 vs at most 0.15), is only logged in that mode.
- On the 26 pilot items it would have launched the planner only on 123.1 and 307.1; the code item lint already sends 123.1 (no Accept), and 307.1 is a discovery re-plan (O15), so it would have added 0 true catches.
- Owner answer 1 ('call another model') is already met by code: milestone.py fires sharpen on an item-lint failure and D1/D2/D3 (lines 725-743).
- Escalate-only would replace the recorded outcome of every flagged item with the planner's verdict, which breaks the 09-21 reopen condition 1 ('labels from recorded outcomes, not a proxy').
- The instrument is not pinned yet: the response `model` field took 3 different strings across the 35 pilot calls (17 typesafe-ai/jev, 10 jev-1.13.0, 8 typesafe/jev-1.13-20260917), while the committed gate file's note names only one.

Cost to reverse: One field edit in queue_screen.json. If the mode is switched later, the shadow report must segment its rows by mode, because escalate-only rows carry the planner's labels.

| premise | command | result | holds |
|---|---|---|---|
| nothing_stated is unstable under framing prose | `python3 over .roundtable/milestone-m1-2026-09-25/pilot_results.json, printing done_evidence.probabilities.nothing_stated per id and probe` | 173.2: base 0.56, framed 0.24; 123.1: base 0.60, framed 0.49 | yes |
| Escalate-only acts only on sharpen; ask-owner and waits_on are logged only | `sed -n '333,400p' .roundtable/milestone-draft-2026-09-25/4-prompt.md` | 'escalate-only \| ask-owner, execute, fail-open \| Logged only'; the waits_on rule is marked '(logged, never enforced)' | yes |
| Escalate-only's marginal catches in the pilot | `apply gate rules 0.45/0.15/0.85 to the base probes in pilot_results.json; T0 no-Accept from pilot_eval.txt` | sharpen launches: 123.1 (already caught by T0 no-Accept) and 307.1 (in the DISCOVERY set); 0 of 12 executes flagged | yes |
| Code-side planner triggers exist without JQ | `grep -n -F '"D1"' scripts/loops/milestone.py (and D2, D3); sed -n '412,470p' scripts/loops/milestone.py` | D1 at :731, D2 at :729, D3 at :739/:743, sharpen on an item-lint failure at :727; the lint checks 'no Accept' and 'an Accept naming no instrument' | yes |
| The gate's calibration note says the response model field reads 'typesafe-ai/jev' | `python3 -c Counter(r['answer']['model'] for r in pilot_results.json)` | {'typesafe-ai/jev': 17, 'jev-1.13.0': 10, 'typesafe/jev-1.13-20260917': 8}; repeats that got different strings moved by 0.01 or less (144.2 waits_on 0.90 to 0.89) | no |
| jev-latest is jev-1.13.0 today | `curl -s https://jev-ai.pro/api/v1/models` | 401 'Use Authorization: Bearer <API_KEY>' (the key was deliberately not read) | unverifiable |

#### O15

**Recommendation:** Yes: for calibration, count re-plans discovered by measurement as 'execute', with three conditions. 394.13 commits a mechanical rule before any Jev call: the Accept rewrite comes after the item's first dispatch row, or is a grill or verification of landed work. Ambiguous cases such as 104.1 stay positive. The discovery count is reported separately.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.13 (its 'Discovery re-plans' Accept line), and through it 394.14 -> 394.15 -> 394.16.

Why:
- Execute was the right action at dispatch time: the planner 'never builds' and does only a bounded read, so it could not have found a defect that only a measurement found, and CLAUDE.md counts finding the premise false as a satisfying outcome of executing.
- The pilot premise holds: 14 of 26 pilot items were re-planned (12 clarify, 2 owner), and the rewrite commits of the 7 DISCOVERY ids read 're-scoped by measurement' (249.6, 249.7), 'record what verification found' (373.5, 373.7) and 'Objective grill of …' (274.2, 307.1, 350.1).
- Neither instrument could see them: the item lint flagged 0 of the 7 (all had an Accept) and Jev missed 6 of 7 on base, so counting them as misses gives 7 misses (scheme A) and makes the 0-miss promotion bar unreachable without flagging most executes.
- 'About half' holds beyond the pilot: in the full harvest, the rewrite subjects of the 30 clarify cases classify as 23 discovery, 4 upfront and 3 other, which is about 22-23 of 45 positives.
- A yes does not guarantee a pass: under scheme B the pilot still has 1 miss (104.1) and 1 over-escalation (307.1), so JQ can still fail on its merits.
- The side effect is slower promotion: dropping discovery lowers the positive rate from about 12.7% (45 of 354) to about 6.5%, so 394.16's '≥5 above rank 0' needs roughly 75 or more joined dispatches, which probably lands after M1.
- The '7' is not reproducible from committed files, because pilot_results.json has no discovery field and the set exists only in a scratch pilot_eval.py, so 394.13 must re-derive it by a committed rule.

Cost to reverse: Cheap before 394.14 runs its single holdout: re-run queue_screen_harvest.py with the rule flipped, about one wake. After the holdout has run it is spent, and a fresh holdout needs weeks of new dispatch outcomes.

| premise | command | result | holds |
|---|---|---|---|
| The pilot has 14 re-plans among 26 items | `python3 -c over .roundtable/milestone-m1-2026-09-25/pilot_results.json, distinct ids by label` | 26 ids: clarify 12, owner 2, execute 12 | yes |
| 7 of the 14 were discovered by measurement after work started | `cat scratch/milestone-grill/r2/design-jev-triage/pilot_eval.py (DISCOVERY set); python3 audit_labels.py (git log -1 --format=%s of each Accept-rewrite commit)` | DISCOVERY = {249.6, 249.7, 373.5, 373.7, 350.1, 307.1, 274.2}; subjects: 449468bd5b 're-scoped by measurement', 2c1de81306 'NOT landable — record what verification found', 60ea801dad/26d464fe5b/0ad6e90384 'Objective grill'; 249.6's timeline shows a Roadmap plan row 're-scoped by measurement — 3 of 6 router rows…' before its landing | yes |
| Nothing in the item text shows them | `apply gate rules to the base probes; T0 lint from pilot_eval.txt` | T0 flagged 0 of 7; Jev flagged only 307.1 (nothing_stated 0.23); the other 6 score owner at most 0.02 and nothing_stated at most 0.05 | yes |
| About half of historical re-plans are discovery | `python3 audit_labels.py > o15_audit.txt; keyword classification of the rewrite subjects (fixed strings: grill, measurement, verification, reproduce, …; upfront: owner, realign)` | 30 clarify: 23 discovery (including 104.1), 4 upfront (112.5, 123.1, 123.2, 145.4, the same 4 that T0 no-Accept catches), 3 other; the full harvest's positives are 30 clarify, 12 replan and 3 owner = 45 | yes |
| If they count as misses, no screen can pass the zero-miss bar | `cat scratch/.../pilot_eval.txt` | scheme A: 'missed 7 [104.1, 249.6, 249.7, 373.5, 373.7, 350.1, 274.2]; over 0/12' at both guard bands; scheme B: 'missed 1 [104.1]; over 1' | yes |

*Cross-group notes:* - **394.12 overlaps the amendment.** The paragraph the O13 amendment rewrites also says 'provisional at n=5' (CLAUDE.md:107), while jev-rubrics.md:47 says 'VALIDATED at n=20'. That mismatch is 394.12's 'n agrees' property. Either fix both in the owner's commit, or leave n untouched so 394.12 settles it; do not restate it a third way.
- **O2 (parked branch).** Restoring the grill file partly reverses O2's park, but it is a record file only and changes no build. The re-score's N5 dead-reference list missed ROADMAP.md:1372 because N5 tested 'exists in no commit on any branch', and this file does exist, on the park branch.
- **O14 (planner tier).** Escalate-only would have spent Planner-tier runs. With shadow, O14's tier choice does not touch JQ until 394.16.
- **O11 and ordering.** simulate_rule_m.py on today's ROADMAP puts the frame (395.1) at dispatch #17, not #26 (the doc's figure predates M0 closing), with 394.12-394.15 ahead of it. Adding `After: 395.1` on 394.13 would pull the frame about 3 dispatches earlier, but JQ would then lose shadow rows on the first layout dispatches.
- **O15 lengthens promotion.** Promotion at 394.16 probably falls after M1 closes, which fits 397.2 deliberately leaving 394.16 out.
- **Checks for 394.14.** It should log the response `model` string on every row, because it varied 3 ways across the 35 pilot calls. It should also re-check `/v1/models`, which I could not verify today: it returns 401 without the key, and I did not read the key.
- **Scratch files** (read-only work): /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/o15_audit.txt and o13_slices.md.
- **Pilot source files** (still only in scratch, not committed): /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/milestone-grill/r2/design-jev-triage/ (pilot_eval.py, pilot_states.json, labelled_v2.jsonl).

### Everything else waiting on the owner

#### M0-exit (RESUME Direction 0, Slice 398 preamble)

**Recommendation:** Extend O3's bootstrap. Run 398.1 and 398.2, then a second fresh-context re-score, and raise the M0 cap from 12 to 13 wakes (Budget value: m0-wakes 13). Do not set ACTIVE without the test.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: high · blocks: ACTIVE (M1 activation); 398.1, 398.2

Why:
- The scorer says every re-score Invalid is a text edit ('none needs code'), and they are all still live today: both N5 files are missing and LOOPS.md:2271 still reads 'Collisions are accepted'. So 398.1 alone should lift Correctness and Maintainability off 1.
- Setting ACTIVE without the test gains no time. ACTIVE also needs App, Modules, Devices, Tiers and Budget, which still read OWNER in the field block (ROADMAP.md:154-163).
- 398.2 belongs in the extension. Parked items are held for all of an ACTIVE M1, and the in-flight check fails open (5 of 5 malformed lines gave exit 0), which is the one finding that could dispatch over a live workflow during M1.
- 398.3 needs no wake if the owner fills the O11, O12, O14 and O16 cells, because its Accept counts that as satisfied.

Cost to reverse: Low. The one extra wake is spent either way, and if the second re-score fails the owner can still take the ACTIVE-without-test path.

| premise | command | result | holds |
|---|---|---|---|
| 10 of 12 bootstrap wakes used | `grep -E '^- 2026-09-2[5-6] [0-9:]+ · [A-Za-z]+ · [a-z-]+ · 393\.[0-9]+' .roundtable/loop-log.md \| sed -E 's/^- (2026-09-2[56] [0-9:]+).*/\1/' \| sort -u \| wc -l` | 10 distinct timestamps (plus 1 row in hold-wakes.jsonl) | yes |
| N5's dead references are still dead | `test -e .roundtable/milestone-m1-prompt.md; test -e .roundtable/grill-milestone-m1-2026-09-25.md` | both MISSING; each cited once in ROADMAP.md | yes |
| N2's stale 'collisions accepted' rule is still present | `grep -n -F 'Collisions are accepted' LOOPS.md` | LOOPS.md:2271 | yes |
| ACTIVE also needs the OWNER fields filled | `Read ROADMAP.md:152-165` | App, Modules and Devices read OWNER; Tiers top=OWNER; Budget wakes/agents/workflow-wall read OWNER | yes |

#### Direction-2 readings (393.6 none-tier, 398.3 loop-written fields, D4)

**Recommendation:** Confirm 393.6's reading: a `none` tier runs on `top`. Settle the other two by writing the owner's answers into the O11, O12, O14 and O16 cells, which also closes 398.3 as satisfied. D4's threshold is decided under O16.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 398.3; ACTIVE

Why:
- Running a `none` tier on `top` costs only money, while refusing it makes a route unrunnable. It also matches §5 and O14, as 393.6's note quotes (ROADMAP.md:2024-2031).
- The four fields carry loop-written values while their decision cells are still `___` (ROADMAP.md:157-162 against :371). Only the owner's own entries make milestone.py's 'unfilled' list true.

Cost to reverse: One line in milestone.py (393.6's own note says 'a one-line change either way').

| premise | command | result | holds |
|---|---|---|---|
| Four fields are pre-filled while their decisions are blank | `Read ROADMAP.md:152-165 and :369-371` | Precedence 'interleave 1/3 track=defect', Rules-2-3 'scoped', Planner 'top', Direction-drift 'off'; O5-O18 cells all '___' | yes |
| 393.6 superseded its Accept's refusal clause | `sed -n 2018,2035p ROADMAP.md` | 'So a `none` tier runs on `top`' … 'Owner, confirm or reverse' (line 2071) | yes |

#### O1 action: archive the disabled cloud routine's sessions

**Recommendation:** The owner archives, in claude.ai/code, all 302 still-active sessions of routine trig_019aw8tDjiYxC3ejSFd5wYZY (titled 'busy-office-ui loop wake' and '⚡ ⚡ Busy Office UI loop wake'). Start with cse_01WUJ1KgzH6GM17XffvmjG27 and cse_019nfzicjq4bU6iFkDSnTq9d, which were revived on 2026-09-25. Keep the routine disabled but do not delete it yet. Then have a local wake re-list every page and confirm 0 active.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: Safety risk (a) in the re-score; 398.1's N6 wording (the archive is the prevention, exit 5 is the backstop)

Why:
- RemoteTrigger is available and I listed all 31 list_runs pages read-only: 307 sessions, 302 'active', 5 'archived'. The tool has no archive action, so the loop cannot do this and only the owner can.
- The routine is already off (enabled=false, last fired 2026-09-09T12:31Z). The remaining risk is a revived stale session, which is how collision 6 happened and what N6 describes.
- Two sessions had events on 2026-09-25 at 04:36:33Z and 05:20:50Z, the same hour as the last cloud commits 45aa4d1d (05:08Z) and 9669b24f (05:15Z). Both fall inside the 24-hour window LOOPS.md Step 0 tells a local wake to report (it is now 2026-09-26T00:56Z).
- Many sessions show worker_status 'requires_action', so answering any one prompt revives a session on a checkout that is weeks stale.
- Keeping the disabled routine lets Step 0's `list_runs` check keep working. Delete it only after the list reads 0 active.

Cost to reverse: Low. Archiving freezes the sessions and keeps their transcripts; nothing in the repo changes.

| premise | command | result | holds |
|---|---|---|---|
| The routine is disabled | `RemoteTrigger list` | trig_019aw8tDjiYxC3ejSFd5wYZY enabled=false, cron '27 * * * *', last_fired 2026-09-09T12:31:19Z, created 2026-08-27 | yes |
| Active sessions remain on every page | `RemoteTrigger list_runs trig_019aw8tDjiYxC3ejSFd5wYZY, all 31 pages until next_cursor=null` | 307 sessions: 302 active, 5 archived (cse_011zvh, cse_01DULH, cse_01Bs8f, cse_01HWtK, cse_01UFAr) | yes |
| No cloud commit since the guard landed | `git log --since=2026-09-25T05:00:00Z --author=noreply@anthropic.com origin/main` | 45aa4d1d 05:08Z and 9669b24f 05:15Z, none later | yes |

#### issue-2 (GitHub: no board/kanban component)

**Recommendation:** The owner posts one reply and closes the issue as 'not planned'. Gist: 'Thanks. The spike this triggered (ROADMAP 300.2, recorded in Slice 317) refuses a board component. A generic core needed 5 parameters, and 4 are announcement strings; with the move-legality rule, they are the screen's workflow, not the framework's. This screen kind is already documented as a pattern at /patterns/kanban: a Move-to menu gives the keyboard path and glove-sized targets, and the server decides which moves are legal. Of your three gaps, the announcement was real, and it is fixed: the pattern's Data contract now requires the screen to own a visually hidden role=status aria-live=polite node that receives every move result (accepted and 409), and States gained a Move accepted row. Drop-target styling is absent because the pattern has no drag, and drag is refused on record. In busy-office-erp, map AppSpec `kanban` to that pattern. This reopens if a second real non-table surface needs two-axis roving navigation.'

Agrees with the draft's own recommendation: yes · confidence: high · blocks: nothing

Why:
- The only comment is the 2026-09-06T15:10:34Z triage, which promised to track a spike. The spike closed on 2026-09-07 and the issue has had no answer for 20 days.
- The fix the reply points at is on main: kanban.astro has 1 'move announcement' row, 1 role=status/aria-live hit, and the 'Move accepted' state at line 253.
- The premise still holds: api.json ships 40 components and the only board-like name is 'dashboard'.
- The reporter is the owner's own account relaying an agent from busy-office-erp, so the reply doubles as that agent's mapping instruction.

Cost to reverse: Zero: reopen the issue.

| premise | command | result | holds |
|---|---|---|---|
| Only the triage comment exists | `gh issue view 2 --json comments,updatedAt` | 1 comment, 2026-09-06T15:10:34Z; state OPEN | yes |
| Slice 317 refused the component | `sed -n 42683,42862p ROADMAP-archive.md` | '### Verdict: refuse the component'; 317.1 DONE fixed /patterns/kanban | yes |
| The kanban page now names the announcement channel | `grep -c -F 'move announcement' apps/docs/src/pages/patterns/kanban.astro; grep -cE 'aria-live\|role="status"' …` | 1 and 1; 'Move accepted' at line 253 | yes |
| No board component ships | `node -e "…Object.keys(a.components)…"` | 40 [ 'dashboard' ] | yes |

#### 369.1 (print from the dark theme)

**Recommendation:** Make print force the light palette. One `@media print` block re-points the `--bo-color-*` set at the light values (no per-component sweep). Re-run the PDF measurement and amend check:print-tokens to allow that one block. Record it as an Added entry.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: high · blocks: nothing

Why:
- The framework already states the intent (reset/index.css:96 prints body #fff/#000), but nothing in the token files re-points under print. So the dark tokens beat that intent.
- ERP output lands on white paper (POs, pick lists, reports), and the 2026-09-09 PDF measurement found 19,511 of 26,817 painted fills below 4.5:1 on 125 of 128 pages.
- Chrome's economy darkening rescues only one token outright and no other engine is known to do it (369.1 text), so the browser is not the answer.
- The fix is one block plus one gate amendment, which passes the Objective's less-for-more test.

Cost to reverse: Low: delete one block. After a release a consumer may rely on light print, so it gets a CHANGELOG entry.

| premise | command | result | holds |
|---|---|---|---|
| No print re-point of tokens exists | `grep -rn -F '@media print' packages/core/src/css/print packages/core/src/css/tokens packages/core/src/css/reset` | hits only in print/index.css and reset/index.css:96; 0 in tokens/ | yes |
| 19,511 of 26,817 fills below AA | `(not re-run: needs a built site and PDF fill parsing)` | not re-measured; the check-print-tokens.mjs header still quotes it | unverifiable |

#### 249.12 (the archive-sweep trigger)

**Recommendation:** Trigger: every Standardize sweep (rule 2) runs roadmap_scope.py and moves every listed target that no open item names, hand-checked one slice at a time. No line or percentage threshold.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: nothing

Why:
- The practice already runs inside Standardize (Slice 385 did the thirteenth archive sweep there), so writing it down costs one sentence and makes it executable.
- A closed-history threshold would rarely fire: only 1,222 of 10,263 lines (11.9%) are closed slices, while the file grew from CLAUDE.md's '1,094' on open slices.
- The real growth is closed ITEMS inside open slices. Slice 393 alone spans ROADMAP.md:1471-2554 with 10 of 13 items closed, and a slice-level trigger cannot move that. It is a separate doctrine question (see cross_notes).

Cost to reverse: Trivial: one sentence in LOOPS.md.

| premise | command | result | holds |
|---|---|---|---|
| Current size and closed-history share | `python3 scripts/loops/roadmap_scope.py` | ROADMAP.md 10263 lines, 104 open / 85 closed items; closed-history share 1222/10263 = 11.9%; 8 targets, 4 named by open items | yes |
| The file 'regrows every few days' (CLAUDE.md) | `wc -l ROADMAP.md` | 10263, against CLAUDE.md's '→ 1,094' | yes |

#### 273.2 (Polish `dry`)

**Recommendation:** Take the item's middle option: redefine dry as 'no score movement AND no finding filed anywhere in the round'. Then make §3b step 5, rule 6 and the ledger columns agree, checked by re-running 273.1's parse.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: nothing

Why:
- Of the 10 rounds recorded NO-OP on their surface, 8 filed a real defect elsewhere and only badge and stepper found nothing. 'Score did not move' and 'busywork' diverged 8 times in 10.
- It keeps 176.3's refusal to empty the Polish lane while making step 5 execute: badge and stepper would go to dry 1 now.
- Deleting the dry exit leaves Polish with no end, the always-true rule-6 problem the re-score already flagged.
- It is low urgency: the last Polish round was Slice 292 on 2026-09-06.

Cost to reverse: Low: prose plus the ledger parse.

| premise | command | result | holds |
|---|---|---|---|
| NO-OP round count (was 10 on 2026-09-05) | `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` | 10, unchanged; ledger rows show badge and stepper NO-OP 'reconciliation clean' | yes |
| Polish has not run recently | `grep -E '· Polish ·' .roundtable/loop-log.md \| tail -1` | 2026-09-06 08:59 Slice 292 (icon round 3) | yes |

#### 393.13 (wake prompt 'Read LOOPS.md and ROADMAP.md fresh')

**Recommendation:** Replace it now. In LOOPS.md's single copy and in the owner's /loop text, change "Read `LOOPS.md` and `ROADMAP.md` fresh — don't assume prior-turn state; `.roundtable/RESUME.md` is the only handover." to "Don't assume prior-turn state: run `LOOPS.md` Step 0 as written and read what it names (`.roundtable/RESUME.md` is the only handover), then read only the `LOOPS.md` and `ROADMAP.md` sections the dispatched rule points at — never either file whole." Then amend 393.13's third bullet to ask whether the wake read either file whole.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 393.13's wording only

Why:
- The two files are 22,827 + 94,109 words today, and ROADMAP.md is 10,263 lines against the Read tool's 2,000-line default. The literal instruction cannot be carried out, and no measured wake did it.
- A written rule that nothing obeys is the shape the re-score penalised (N2-N7), and its Cost dimension cited this exact line.
- The new wording keeps 'don't assume prior-turn state' and the RESUME handover, and restates no dispatch order, as 102.4 requires.
- 393.13 still measures the Step 0 read cost on the first ACTIVE wake.

Cost to reverse: Trivial: one sentence in LOOPS.md and the /loop invocation.

| premise | command | result | holds |
|---|---|---|---|
| Size of the literal read set | `python3 -c "len(open(f).read().split())" per file; wc -l` | LOOPS.md 2291 lines / 22,827 words; ROADMAP.md 10263 / 94,109 (was 92,981 at the re-score) | changed |
| Real wakes read 12,352 (cold) and 3,791 (bootstrap) words | `(needs session transcripts; not re-run)` | quoted from 393.8 at ROADMAP.md:2315 | unverifiable |

#### 375.11 Firefox half

**Recommendation:** The owner runs `brew install --cask firefox` once. The loop then measures anchored mode and the static fallback in stock Firefox with the repo's existing puppeteer-core 25.7.0 over WebDriver BiDi. If stock Firefox also fails to launch, run the measurement once in a GitHub Actions ubuntu job.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 375.11 (defect track, rule 4's oldest dispatchable)

Why:
- Reproduced today: Playwright's Firefox 155 (firefox-1543, the one installed) exits with 'Could not find profile folder', exitCode=1, both headless and headed, and also with TMPDIR moved into the scratchpad.
- The repo has no Playwright package (require of playwright, playwright-core and @playwright/test all fail); the failing binary is a patched Nightly from an npx cache. puppeteer-core ^25.7.0 is already an apps/docs devDependency and drives stock Firefox.
- The newest npx Playwright (1.64.0-alpha, firefox-1549) is not installed, so a newer patched build is untested. A stock install is the cheaper test.
- Firefox is inside the published floor (both README's generated floor stat and browserslist include Firefox), so this half cannot be closed as out of scope.

Cost to reverse: Trivial: uninstall Firefox.

| premise | command | result | holds |
|---|---|---|---|
| Playwright version and installed Firefox | `npx playwright --version; /bin/ls ~/Library/Caches/ms-playwright` | 1.63.0 (fetched by npx, not a repo dependency); firefox-1543 present with INSTALLATION_COMPLETE; no /Applications/Firefox*.app | yes |
| Launch fails with 'Could not find profile folder' | `node ff2.cjs (scratchpad/owner-recs), firefox.launch headless true/false via playwright-core 1.63.0` | [err] Could not find profile folder. exitCode=1; headed: exitCode=1 (GPU helper connection invalid) | yes |
| Only the Firefox half remains open | `sed -n 4549,4626p ROADMAP.md` | frozen cells, loading table, classic scrollbars and 400% zoom FIXED; Firefox 'STILL OPEN' | yes |

#### park/owner-checkpoint-2026-09-20 (a9a2d9bb)

**Recommendation:** Push the branch to origin now as a backup. Bring only its four .roundtable records onto main: the three 09-20/09-21 grill reports and the erp-suite-gaps.md additions (the 09-20 section and GAP-22). Keep the journey code, check-journey and review_depth_gate parked until O5/394.2 decides rugged RF. Then either land the journey as 396.12's input, or delete the branch and close 389.6 and 389.7 as superseded.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 389.6, 389.7; 394.14's cited file

Why:
- The branch holds 24 files (+1,625/−16) of owner work in one local ref, with no upstream; origin has 3 heads and none is park.
- Main already cites a parked file: 394.14's Accept (ROADMAP.md:1372) quotes grill-kev-in-the-loop-2026-09-21.md, and `test -e` shows it missing on main. That is a new N5-class dead reference.
- Grill reports are reviewed markdown records, which the storage doctrine keeps in git on main, and parking them hides evidence M1 cites.
- The code half waits on unmade decisions: 389.6 and 389.7 need check-journey (missing on main), and whether RF is in scope is O5.
- It merges cleanly today, 24 commits behind main, but that cost rises once 396.x rewrites examples/erp-suite.

Cost to reverse: Low: a pushed branch can be deleted and cherry-picked records reverted.

| premise | command | result | holds |
|---|---|---|---|
| What the commit holds | `git show --stat a9a2d9bb` | 24 files, 1625 insertions, 16 deletions: journey/*, check-journey.mjs, 3 grill reports, erp-suite-gaps.md, review_depth_gate.{py,json}, package.json, .gitignore, suite.json, screen-kit.astro | yes |
| Not on main, not on origin | `git merge-base --is-ancestor a9a2d9bb main; git ls-remote --heads origin \| grep -ci park; git config branch.park/….remote` | not on main; 0 of 3 origin heads; no upstream | yes |
| Main cites a file that only exists on the branch | `test -e .roundtable/grill-kev-in-the-loop-2026-09-21.md; sed -n 1371,1373p ROADMAP.md` | missing on main; cited at ROADMAP.md:1372 | yes |
| The branch still merges cleanly | `git merge-tree --write-tree main park/owner-checkpoint-2026-09-20; git rev-list --count a9a2d9bb..main` | clean; 24 commits behind | yes |

#### 394.1 (naming doctrine ADR)

**Recommendation:** Let the loop draft `.roundtable/adr-published-names-are-shapes-2026-09-25.md` from O4's recorded text and CLAUDE.md's widened rule. In it, uphold loop-log.md:595 (domain packs) for the framework and supersede it for examples/erp-suite only. The owner accepts the draft in one line.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: 394.4, 394.9, 395.1, 396.1 (M1 Phases 1-2)

Why:
- O4 is decided and CLAUDE.md already carries the widened rule, citing 'decision O4' at CLAUDE.md:344. The ADR is the only missing piece, and no such file exists.
- Superseding :595 inside the reference app alone is what O4 says (module words live in examples/erp-suite demo data), and it lets 396.5 keep its 'full module sets' arm.
- The reversal-cost figure the ADR must quote has grown: invoice-list now appears on 171 lines in 100 files, up from 162 in 94.
- 394.1 holds 394.4, 394.9, 395.1 and 396.1 (STATUS Dependency-blocked), so this paperwork sits on M1's critical path.

Cost to reverse: High for the rule itself (O4 is a one-way door at 171 references); the ADR only records it.

| premise | command | result | holds |
|---|---|---|---|
| The ADR does not exist yet | `/bin/ls .roundtable \| grep -i adr` | only adr-tree-table-2026-08-16.md | yes |
| 162 references in 94 files | `git grep -F invoice-list \| wc -l; git grep -c -F invoice-list \| wc -l` | 171 lines in 100 files | changed |

#### 374.4 (secondary-button edge token)

**Recommendation:** Repoint the three interactive sites (.bo-btn--secondary, ::file-selector-button, .bo-file-dropzone) from --bo-color-border-strong to the existing --bo-color-border-control, and delete their EDGE_EXEMPT rows. Keep border-strong for decorative edges and add no new token. This is a visual-weight taste call; it is the default I would use.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 377.8's ACR 1.4.11 remark (partly)

Why:
- The item's gate premise has changed: since 374.7 (f1d64263, 2026-09-23) check:contrast sees edges, and the three sites sit in EDGE_EXEMPT citing 374.4 (check-contrast.mjs:316-318). Only the token shape is left to decide.
- color.css:29-31 defines border-control for exactly 'when the border is the only affordance' at about 4.8:1, so repointing adds nothing to the token surface, which the less-for-more test prefers to a new token.
- Only 3 of the 12 non-token border-strong uses are interactive boundaries; the decorative rest (kbd, prose, richtext, data-table) stays as it is.
- Jev's split-vs-repoint answer (0.61/0.32 at confidence 0.54) was below its threshold, so it gives no reason to prefer a new token.

Cost to reverse: Low: three one-line changes. The change is visible on every page with a secondary button, so it gets a Changed entry.

| premise | command | result | holds |
|---|---|---|---|
| The contrast gate cannot see border-color | `grep -n -F 'border-strong' packages/core/scripts/check-contrast.mjs` | edge fixtures at :53-60; EDGE_EXEMPT rows :316-319 name button, file-upload x2 and filters as 374.4 | changed |
| Where border-strong is used | `grep -rn -F border-strong packages/core/src/css \| grep -v tokens/color.css \| wc -l` | 12 uses; button.css:81, file-upload.css:25 and :63 are the interactive three | yes |
| 1,252 rendered instances on 123 of 139 pages | `(needs a built site; not re-run)` | not re-measured | unverifiable |

#### 373.6 (app dock, hide on upward scroll)

**Recommendation:** Decide after 395.1 files its options note. Then answer: (a) supersede the refusals for the dock only and keep general hide-on-scroll refused; (b) the trigger is O5's Devices field naming phone; (c) yes, but the dock enters as an experimental part through the Slice 397 lifecycle, never straight to stable.

Agrees with the draft's own recommendation: yes · confidence: low · blocks: nothing now (395.1 does not wait on it)

Why:
- The realignment already routes it: 395.1 builds the frame with the refusal kept and files the dock options on 373.6 (ROADMAP.md:958-963), so answering now would get ahead of evidence the frame will produce.
- Both refusals are on record (ROADMAP-archive.md:10302 bottom-nav, :18265 hide-on-scroll), and the owner's own 09-19 prompt asked for the dock, so only an owner entry can reconcile the two.
- The experimental tier (final path, outside index.css, no Breaking entries) is the cheap way to test a reversed refusal, and it matches the standing rule that new components ship pre-stable.
- Hiding on upward scroll reverses the mobile convention, and composition cannot provide safe-area insets today (0 `env(` uses in packages/core/src/css), so this is a real new part, not a recipe.

Cost to reverse: Low while the dock is experimental (remove for free); high once promoted to stable.

| premise | command | result | holds |
|---|---|---|---|
| Two refusals stand on record | `grep -n -F 'Mobile bottom-nav tier' ROADMAP-archive.md; grep -n -F 'hides on scroll-down' ROADMAP-archive.md` | archive :10302 and :18265 | yes |
| 0 env() in source | `grep -rn -c -F 'env(' packages/core/src/css \| sum` | 0 | yes |

#### 373.8 (docs IA: 17 groups into 7)

**Recommendation:** Adopt the item's own option: non-interactive section labels over the existing sidebar groups, with no third nesting level. Land it in 394.6's commit, when the Experimental group is added.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: nothing

Why:
- It keeps the recorded two-level nesting cap and avoids a 42-item Components group (42 component pages exist today).
- Slice 112 refused a six-section reorg until a second real consumer appears, and none has, so a full regroup has no new evidence behind it.
- 394.6 changes the sidebar anyway, so doing both at once avoids two rounds of IA churn.

Cost to reverse: Trivial: labels only.

| premise | command | result | holds |
|---|---|---|---|
| A single Components group would hold 42 items | `/bin/ls apps/docs/src/pages/components/*.astro \| wc -l` | 42 | yes |
| 17 sidebar groups | `grep -c -E '^    label:' apps/docs/src/layouts/Gallery.astro` | 4 literal groups plus spread COMPONENT_GROUPS and PATTERN_GROUPS; total not recounted | unverifiable |

#### 296.3 (is 'secure' in scope?)

**Recommendation:** Out of scope as an application-level claim: add no threat-model section to pattern pages. Add one scope line saying the security of data, auth and server responses belongs to the consumer, and keep the framework's own shipped behaviours free of writing data as HTML.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: nothing

Why:
- The framework ships CSS and optional behaviours and owns no data layer (296.3 text), and the owner's standing scope is layouts and components.
- A threat-model section would become an owed, build-gated section on every pattern page for a risk the framework does not own, which fails less-for-more.
- The one surface the framework does own is clean today: the only innerHTML in packages/core/src/js is `list.innerHTML = ''` (validation-summary.ts:48).
- scope.astro:46 already hands sanitization to dedicated libraries, so the new line extends an existing stance.

Cost to reverse: Low: sections can be added later if a consumer asks.

| premise | command | result | holds |
|---|---|---|---|
| No data-to-HTML writes in shipped JS | `grep -rn -F innerHTML packages/core/src/js` | 1 hit: validation-summary.ts:48 `list.innerHTML = ''` | yes |

#### 249.10 (SAP/Fiori terminology column)

**Recommendation:** Add no SAP/Fiori column. Fold the vocabulary (value help, ALV, guided procedure, F4, message, maintain) into 394.9's job index as also-called search words, and close 249.10 through 394.9. The exact word list is the owner's; those six are the default.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: 249.7 then 394.9

Why:
- Under the O4 rule, other vocabularies are search words in the generated job index, never a separately published table.
- 249.7 is folded into 394.9 and held only by `After: 249.10` (ROADMAP.md:8445-8452), so this unblocks it.
- As search words the vocabulary helps agents find shapes without the framework publishing a vendor mapping it must keep true.

Cost to reverse: Low: the words are data rows, which may change in any minor (394.10).

| premise | command | result | holds |
|---|---|---|---|
| 249.7 is held only by 249.10 | `sed -n 8445,8452p ROADMAP.md` | 'Held on 249.10'; After: 249.10; After: 394.9 | yes |

#### 249.11 ('Migrate an existing admin UI' path)

**Recommendation:** Close as deferred, with the reopen condition 'the first outside consumer migrating from a named stack'. Build no migration path now.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: nothing

Why:
- The likely first user, busy-office-erp, renders its screens on this package from an AppSpec; nothing is being migrated (issue #2's context).
- 377's grill found adoption indistinguishable from zero, so there is no measured migrating consumer to choose the entry stack.
- The item itself says the stack choice decides between one page and a pattern family, and no stack has evidence behind it.

Cost to reverse: Trivial.

| premise | command | result | holds |
|---|---|---|---|
| No migration page exists | `sed -n 8747,8749p ROADMAP.md` | 'No page exists.' (item text; no page under getting-started/) | yes |

#### 249.13 (reconsider demo-first/spec-last)

**Recommendation:** Keep demo-first/spec-last and close 249.13 as decided.

Agrees with the draft's own recommendation: yes · confidence: high · blocks: nothing

Why:
- The 2026-08-16 decision came from comparing four framework docs sites with zero exceptions, and the reversal proposal misstated it (item text).
- The order is gated: data-table.astro still has 18 h2 with Markup last (line 938), and check-page-shape enforces it across 42 component pages.
- A reversal touches every component page and the gate for a gain the proposal never measured.

Cost to reverse: Moderate: one block per page on 42 pages, plus the gate rule.

| premise | command | result | holds |
|---|---|---|---|
| Markup is data-table's 18th and last h2 | `grep -c '<h2' apps/docs/src/pages/components/data-table.astro; grep -n '<h2' … \| tail -1` | 18; line 938 'Markup — the canonical table recipe' | yes |

#### AT runtime evidence (Slice 15 item 12, NEEDS-RUNTIME)

**Recommendation:** The owner runs `npx @guidepup/setup` once on this Mac so a local wake can drive VoiceOver with @guidepup/guidepup and record the three checks (combobox activedescendant, data-grid roles, selection live region). Defer NVDA until a Windows machine exists, and keep the ACR's NVDA rows 'Not Evaluated'.

Agrees with the draft's own recommendation: no-doc-recommendation · confidence: medium · blocks: nothing (ACR rows)

Why:
- For VoiceOver the premise 'only ears verify' no longer holds: @guidepup/guidepup 0.34.0 automates VoiceOver on macOS and reads its spoken-phrase log.
- Since O1 the loop runs only locally on this Mac, so once the owner grants the OS permissions the VoiceOver half becomes loop-runnable.
- NVDA runs only on Windows, so that half stays owner hardware.
- The ACR cites this item, so real evidence moves rows out of Not Evaluated.

Cost to reverse: Low: remove a devDependency. Note that it takes over audio and focus while it runs.

| premise | command | result | holds |
|---|---|---|---|
| A VoiceOver driver exists | `npm view @guidepup/guidepup version description; npm view @guidepup/setup version` | 0.34.0 'Screen reader automation library for testing.'; setup 0.28.0 | yes |
| The item needs a human listener | `sed -n 10238,10247p ROADMAP.md` | 'it needs a human listening to a screen reader, which no gate here can simulate' | changed |

#### 389.6 and 389.7 (journey RF exit and fold)

**Recommendation:** Leave them blocked and settle them with the park-branch decision after O5. If rugged RF is in scope, they become 396.12 acceptance tests on the un-parked journey; if not, close both as superseded when the branch is deleted.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 396.12

Why:
- Their Accepts need check-journey, which exists only on the park branch.
- O2's own text said parking the journey closes them as superseded, but the realignment tied them to 396.12, so O5's RF answer decides which applies.

Cost to reverse: Low.

| premise | command | result | holds |
|---|---|---|---|
| check-journey is missing on main | `test -e examples/erp-suite/check-journey.mjs` | missing on main; present in a9a2d9bb (192 lines) | yes |

#### 394.16 (promote, shadow or retire the queue screen)

**Recommendation:** Nothing to decide now; it waits on 394.15. When the shadow report arrives, default to 'keep in shadow' and promote only if all six bars in its Accept hold (≥20 joined outcomes, ≥5 above rank 0, 0 missed, over-escalation ≤0.5, fail-open <20%, calibration admitted).

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: nothing now

Why:
- Under CLAUDE.md Jev is advisory and not a gate, and a zero-miss bar is the only safe way to let it change handling.
- Retiring to code-only is justified only if the report shows fail-open at or above 20%, and until then the report is not in.

Cost to reverse: Low while in shadow; moderate after promotion.

| premise | command | result | holds |
|---|---|---|---|
| It waits on 394.15 | `sed -n 1415,1435p ROADMAP.md` | After: 394.15; promotion bars as listed | yes |

#### 396.13 (form of the remaining modules)

**Recommendation:** Nothing to decide now; it waits on 396.5. Default: if the A/B result falls within its pre-registered margin, choose job rows plus screens only where a new shape is needed; choose full module sets only if they win by the margin.

Agrees with the draft's own recommendation: yes · confidence: medium · blocks: 396.6-396.11

Why:
- The cheaper form is the Objective's less-for-more default, and the bet's record (9 of 17 gaps came from a new shape, 0 from a new domain) predicts module sets add little.

Cost to reverse: Moderate: it sets the shape of five module items.

| premise | command | result | holds |
|---|---|---|---|
| It waits on 396.5 | `sed -n 908,918p ROADMAP.md` | After: 396.5; 396.6-396.11 wait on it | yes |

*Cross-group notes:* Items belonging to the O5-O18 subset were left out: 377.5 and 394.3 (O6), 377.6 and 394.2 (O5), 394.18 (O13), and 112.3 and 112.4 (O10). The Direction-2 readings overlap O11, O12, O14 and O16; I only recommend confirming 393.6's none→top reading and putting the owner's own answers in those cells.

The M0 recommendation assumes the owner fills O5-O17 in parallel, because ACTIVE needs both a passing re-score and filled fields.

New dead reference found: ROADMAP.md:1372 (394.14) cites grill-kev-in-the-loop-2026-09-21.md, which exists only on the park branch. If the owner does not bring it to main, add it to 398.1's sweep.

Issue #2: 394.9's job index should list 'board, kanban' as also-called words for /patterns/kanban.

249.12: the real lever on ROADMAP.md's size is closed items inside open slices (Slice 393 spans 1471-2554). Moving those needs an owner change to the 'slices move verbatim' doctrine.

Stale text, not investigated further:
- CLAUDE.md's '→ 1,094' against 10,263 lines today.
- The Sequence section near ROADMAP.md:462 still lists 'OWNER CALL — direction … 0.3.0' while tags reach v0.8.0.
- packages/core/README.md's generated floor stat and package.json's `browserslist` disagree: browserslist is one version lower on Firefox and on Safari.

Side effects: RemoteTrigger was used only for list and list_runs (31 pages). npx cached playwright 1.63.0 under ~/.npm/_npx. The Firefox repro scripts are in /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/owner-recs/ (ff.cjs, ff2.cjs). The repo working tree is untouched (git status clean).

