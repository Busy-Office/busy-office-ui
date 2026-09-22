# History — the 2026-09-20/21 two-agent arrangement (RETIRED)

> **Historical record only. Nothing in this file directs current behaviour.**
> For one day in September 2026 this project ran a two-agent arrangement in
> which a peer agent ("Codex") led development and Claude Code implemented
> bounded assignments. The owner retired it on 2026-09-22: Claude Code now
> carries out authorized development independently, following the owner's
> instructions and the project's accepted technical decisions in `ROADMAP.md`,
> `LOOPS.md` and `DESIGN.md`.
>
> Removed with the arrangement: the role table, the coordination protocol, the
> await-assignment / acknowledge-before-editing convention, the "Codex owns
> shared records" ownership claims, and a claimed 15-minute
> `busy-office-ui-development-lead` heartbeat that had no definition anywhere
> on this machine.
>
> Kept below: the **measured acceptance records** from that window — live-claims
> counts, focus-sample counts, viewport/theme checks and red proofs. They are
> evidence about the code and remain true regardless of which agent wrote them.
> Read them as a dated log, not as assignments. The peer message log is
> `exchange/` (see its README); the durable work record is `loop-log.md`.
>
> Two cautions before citing anything here. The `/private/tmp/boui-*` evidence
> paths these records name were deleted on 2026-09-22 and would not have
> survived a reboot regardless, so a record is worth only what it states, not
> where it pointed. And the preview facts recorded here were wrong: they
> described a host snapshot on 127.0.0.1:8081 that competed with the Podman
> container on the same port, so `localhost:8081` answered from either one
> depending on IPv6 preference. That server is stopped; `:8081` is the
> container, as `CLAUDE.md` describes.

## Acceptance records (2026-09-20 / 2026-09-21)

**Current state — all 373.3, 373.4 and 373.7 implementation criteria accepted locally; 373.5 active; one copied-sample correction awaits rendered verification.**
Claude's journey review reports no blockers and independently executed the suite
build and journey browser checks. Codex reconciled the findings with the source
and accepted the review. No journey correction or additional review is requested.
The accepted drawer implementation/integration guards still pass 209 live claims.

The sticky-table task is accepted after Claude's review-05 corrections. Codex
verified 212/212 live claims; 280 exact-focus samples across ten viewport/theme/
density cases; isolated behavioral and fixture red proofs; header focus without
scroll jumps; and narrow horizontal/sticky-column behavior. The extra maximum
token is removed; existing density values drive body-control scroll margin.
README/sticky-layer/whitespace checks pass. Preserve accepted source and tests.

**Toast/form-feedback subset accepted locally (2026-09-21):** Claude finished
review 03 and all isolated negative proofs. Codex independently ran 223/223 claims,
actual exit 0; verified the real demo and rendered copyable recipe across four
viewport/theme combinations; and checked 170 focus samples across six scenarios,
including all expected fields/actions in both directions. A real overlay added
after setup fails the exact permanent geometry predicate with valid setup.
The persistent exposed status region supports repeated saves with one result,
no dismiss button and no focus theft. README/stamp and whitespace checks pass.
No actual screen-reader announcement is claimed. Source remains Claude's.
Evidence: `/private/tmp/boui-toast-final-claims.log` and
`/private/tmp/boui-toast-acceptance.mjs`, `.log`, `.json`; narrow screenshot inspected.
The previous reviews remain in exchange files as history. The adjacent theme-key
and accessibility-guidance findings in Claude's reply are retained for separate
verification/triage and are not part of this next task.

**Layout contract accepted locally (2026-09-21):** Claude acknowledged review
02 and returned the corrected contract and visible-scrollport guard. Codex
independently passed 230/230 live claims (actual exit 0), the 128-page layout
gate and scroll reachability over 810 containers on 118 pages at both widths.
Four normal viewport/theme cases pass the exact production measurement/predicate;
four isolated zero-height cases now fail it while overflow and scrollTop still
behave. Four screenshots were inspected with no horizontal page overflow.
Link/metadata/sticky-layer and README facts/stamp checks pass. The only remaining
900px mention is the unrelated sidebar height measurement. Source-derived band,
padding and sizing and the previous 373.2 correction are preserved.

All implementation criteria of 373.3 are now accepted locally; no commit, push,
release or publication occurred. Full evidence and limits are recorded in
`exchange/from-codex/boui-layout-acceptance-20260921-01.md`. The permanent negative
case shares the production predicate but duplicates the measurement; Codex's
independent proof invokes both exact helpers. This is Chromium geometry evidence,
not physical-device safe-area or screen-reader testing.

**Tag-input focus subset accepted locally (2026-09-21):** Claude acknowledged
both boui-tag-remove-focus-20260921-01 and the changelog integration decision.
Codex inspected the runtime/test/docs changes, independently passed all 172
behavior tests across 29 files and 235/235 live claims (actual exits 0), and
ran 16 keyboard removal scenarios across four viewport/theme combinations.
The same production helpers reproduce four old-build failures against the
frozen accepted layout preview, while the new build restores each group's field.
Four trusted-key event/consumer-focus cases and four conditional/Backspace cases
pass; event timing/target/bubbling/value remain intact. All four screenshots were
inspected. Link/metadata/README facts/stamp and whitespace checks pass.
Evidence: `exchange/from-codex/boui-tag-focus-acceptance-20260921-01.md` and
`/private/tmp/boui-tag-acceptance.{mjs,log,json}`. Codex added a Fixed entry to
CHANGELOG.md explaining measured compatibility, including asynchronous redirects.
Only the tag-input subset of 373.4 is accepted; the whole item stays open.
No commit, push, release or publication occurred. The full docs integration build passed (actual exit 0). The accepted host
preview now serves 2026-09-21T01:26:00.535Z; four viewport/theme removals and
the procurement journey were rechecked. Podman and other containers were untouched.

**Editable-grid subset accepted locally (2026-09-21):** Claude acknowledged
review `boui-editable-grid-review-20260921-03` and returned ready with no blockers.
Codex inspected the actual source and independently passed **250/250 live claims**
(actual exit 0), **32 trusted-key removal scenarios**, **16 initial/added dirty
row name cases** across live/copied recipe × 1440/390 × light/dark, and four
isolated missing-state-phrase cases rejected by the exact production predicate.
Focus lands on the exact next/previous Remove or own Add; stable row identities,
conditional focus, scoping and the self-contained recipe are verified. Save
preserves `— unsaved changes`. Eight styled cases have no document overflow;
narrow live-dark and sample-light screenshots were inspected. Link/metadata,
README facts/stamps and whitespace checks pass. Evidence and limits:
`exchange/from-codex/boui-editable-grid-acceptance-20260921-01.md`,
`/private/tmp/boui-grid-r3-acceptance.{mjs,log,json}` and
`/private/tmp/boui-grid-r3-final-claims.log`. This is Chromium focus/AX/geometry
evidence, not physical AT speech. No core runtime source or API changed here.
Source ownership was not transferred to Codex. All 373.4 implementation work is
not complete: list/kanban guidance and the generated ACR row remain.

The existing 8081 host preview now serves accepted build
`2026-09-21T03:15:35.767Z`, sha `6b72a778`, dirty=true. Four actual-preview
viewport/theme focus/name cases and the procurement journey pass; evidence:
`/private/tmp/boui-grid-preview-check.{mjs,log,json}`. The old snapshot is retained
at `/private/tmp/boui-preview-before-grid-20260921-0332`. No listener restart,
Podman change, commit, push, merge, release, publication or deployment occurred.

Claude's separate report of a direct Qty-to-Add click missing due to the existing
focus-shown message changing row height is retained for verification/triage.
The Add helper blurs/settles before clicking; these checks do not certify that
direct pointer path. It is not silently folded into the next assignment.

**Move guidance and ACR accepted locally (2026-09-21):** Claude explicitly
acknowledged review 02 and returned round 3 ready. Codex inspected the actual
diff and build `2026-09-21T12:44:38.784Z`, independently passed **252/252 live
claims**, **36 exact recipe scenarios**, **8 actual printed-caller async cases**
with real outside clicks or retained ownership, and **two exact-predicate
negative cases** for wrong-control and failed focus. All processes exited 0.
The unchanged source-relative ACR collision proof and pointer-picker evidence
remain applicable. Twelve documentation viewport/theme cases, 14,608 links,
1,159 metadata assertions, README facts/stamps and whitespace pass. Narrow dark
changed sections were inspected. Full evidence and limitations are in
`exchange/from-codex/boui-move-guidance-acceptance-20260921-01.md` and
`/private/tmp/boui-move-r3-acceptance.{mjs,log,json}`.

All implementation acceptance criteria of **373.4** are now satisfied locally,
together with prior tag-input/grid acceptances. Checkbox remains open pending
landing; no commit/release. The permanent callerOrder check uses `.focus()` and
composes the functions; Codex's separate proof executes the actual printed
async caller with trusted pointer input. This distinction is recorded rather
than claiming stronger permanent coverage. No source-writing transfer or Codex
implementation edit occurred. Review 02 is answered; do not resend it.

The accepted host preview at 8081 is now `2026-09-21T12:44:38.784Z`, dirty=true;
backup `/private/tmp/boui-preview-before-move-20260921-1256`. Four exact grid
focus/name cases and the procurement journey are rechecked in
`/private/tmp/boui-move-preview-check.{mjs,log,json}`. No listener/Podman restart.

**AI-agent composition path accepted locally (2026-09-21):** Claude explicitly
acknowledged `boui-agent-composition-20260921-01`, accepted ownership with no
conflicts and returned ready. Codex inspected source/package diff and build
`2026-09-21T13:25:38.091Z`. The extracted starter works outside this repository
with its shared commands module included. Actual generated and documented
commands pass valid markup and reject the intended typo using a locally packed,
offline-installed core. Four rendered viewport/theme cases verify command/order,
URLs and five-item count; no page overflow. Links/metadata/whitespace pass.
The lean llms baseline is preserved byte-for-byte, plus **556 bytes**, now
**50,538 bytes**. Pilot input change/delta is recorded in pilot-112/README;
112.4 stays blocked and no owner brief/pick was read or authored.

All **373.7 implementation acceptance criteria** now pass locally. Full evidence
and limits: `exchange/from-codex/boui-agent-composition-acceptance-20260921-01.md`,
`/private/tmp/boui-agent-review.{py,log,json}` and
`/private/tmp/boui-agent-browser-review.{mjs,log,json}`. Checkbox stays open
pending landing; no commit/release. Supported CLI reconfirmed the same peer and
checkout. Its busy status did not prompt any interruption or duplicate edit.

The accepted 8081 host snapshot is now `2026-09-21T13:25:38.091Z`, dirty=true;
backup `/private/tmp/boui-preview-before-agent-20260921-1336`. Four served-page
cases and procurement journey are checked in
`/private/tmp/boui-agent-preview-review.{log,json}`. No listener/Podman restart.

**15:11 UTC discovery update (2026-09-21):** no new durable handoff or sample
correction acknowledgment yet. The local build advanced to
`2026-09-21T15:07:44.976Z`. Supported `claude agents --json --cwd` now reports
**session `c878a614-03e4-4480-87d2-f443a2ea1a39`**, while retaining PID 3714,
name `busy-office-ui-8f`, original startedAt and exact checkout; status busy.
This differs from the last durably acknowledged session below. Treat it as a
candidate identity transition, not automatically the same logical conversation.
No message was sent, no restart/resume occurred, and source ownership is
preserved. Before any next send, reconfirm native discovery/name/ref and
corroborate the new session against a durable peer reply or supported identity
exchange. Do not send another assignment or assume historical ref/UUID mapping
still applies. Continue checking durable replies first; accepted preview is
unchanged. No user action is presently required.

**373.5 launcher ACTIVE — safe checkpoint received (2026-09-21):** Claude's
shared reply now says the owner returned priority to the roadmap, its loop work
is finished/self-contained, and the launcher is active with no conflicts.
Same peer `busy-office-ui-8f [01621f]`, session
`fa641e32-24d1-4321-abf0-64c7e25015ca`, exact checkout; supported discovery and
native ListAgents corroborate the busy peer. The earlier scheduling hold and
status checkpoint are answered; do not repeat them. Preserve the separate gate
files, grill and .gitignore addition; no review/adoption/execution of the gate
by Codex is claimed.

Claude owns app-launch.astro, scoped launcher claims and the shared reply under
`exchange/from-codex/boui-launcher-20260921-01.md`. Core-source task baseline
(107 files) is `/private/tmp/boui-launcher-core-source-baseline.json`; preserve
the already-dirty prior source. The gen-llms comment is corrected accurately.
The inner callerOrder comment now distinguishes programmatic focus; its enclosing
comment still claims a real click and remains a comment-only followup. No
executable changes to accepted cases are authorized by those comment fixes.

**Confirmed save-recipe defect / bounded correction:** Claude reported the
373.3 copyable in-flow save sample includes nonexistent `bo-btn--primary`.
Codex extracted that ACTUAL code from the accepted 8081 snapshot and ran the
existing consumer markup validator: exit 1 naming the invalid modifier. The
current alerts.astro source had already dropped it (mtime 14:34:08 UTC), and
its extracted saveConfirmMarkup passes, exit 0, four bo-* uses. No Codex source
edit. Evidence: `/private/tmp/boui-save-recipe-review.json`. Valid `bo-btn`
styling remains; the defect is an invalid extra modifier and consumer-validation
failure, not a completely unstyled control. The prior focus/status acceptance
is not broader proof of sample-class validity. Frozen preview remains unchanged
and still contains that typo pending the reviewed build.

Codex sent `boui-launcher-sample-correction-20260921-01`: authorize alerts.astro
ONLY for this one invalid-modifier removal, preserve the existing edit, reconcile
its provenance with the earlier "untouched" reply, and validate the actual
rendered copyable recipe after the normal full build. Also correct the remaining
enclosing callerOrder description, comment-only. No new sample-scanning gate,
broad audit or other alerts change is assigned; the wider coverage question is
unmeasured and retained separately. Codex made no competing build/source edits.
Native queue ID `2c7f14d0-9311-4a24-9411-42cff9bcc9dc`, no hold/refusal notice
observed, relay exit 0; acknowledgment pending. Transport:
`/private/tmp/boui-launcher-sample-correction-relay.jsonl`.

Record generators and floor/slice-reference/vendor/import/whitespace gates pass.
Index regeneration also discovered the separate new
`grill-kev-in-the-loop-2026-09-21.md`; it is preserved, not reviewed or
implemented as part of this assignment. No KEV invocation by Codex is claimed.
