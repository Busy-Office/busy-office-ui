> **Status:** grill report for roadmap 388.2, produced by a six-lens workflow
> (journey; pick; goods receipt; putaway + count; landing + list; app screen),
> a synthesis, and an adversarial challenger that re-measured every actionable
> with its own scripts: **25 of 25 survived**. The challenger's corrections to
> this report are applied in place and listed at the end. Scripts live in the
> session scratchpad (`rfgrill/`), not in the repo.

# Design grill (flow): RF / rugged devices — 2026-09-25

Roadmap **388.2**. The owner's input, verbatim: *"Grill Patterns: RF / rugged devices --> Might need app screen. Task screen can be better."*

**Flow grilled.** `rf-landing > rf-list > {goods-receipt, rf-pick, rf-putaway, rf-count} > rf-landing`, plus the RF seams of the uncommitted `examples/erp-suite/journey` (approval > receiving > exit).

**How it was measured.**
- Six lenses walked the flow live on :8081: journey, pick, goods receipt, putaway+count, landing+list, and app screen. Every figure below was printed by one of their scripts. This synthesis took no measurements of its own.
- The served `rf-essentials.min.css` is byte-identical to dist (sha 8cb695ff), and the served journey matches its source.

**Viewports.**
- Primary: 360x640 at DPR 2. This is the floor study's fixture size ("common RF scanner resolution"), which matches the 5-inch 720p TC5x/CT40 class. The panel specs are the lenses' own knowledge, not a measurement.
- Also 390x844 at DPR 3.
- Three lenses also measured 320x533 at DPR 1.5 (MC3300 class).
- Both themes at every size. Dark was red-proved: the canvas goes from rgb(249,250,251) to rgb(15,17,21).

**Not covered:** WebView 108 (Chrome 153 stood in), real scanners, gloves, soft-keyboard occlusion, and Back in a kiosk browser.

## 1. Journey decision (F1): split the journey

Two journeys are tangled together. That is finding #1.

- **RF day loop** (the docs track). *The worker finishes the next task they were handed, it is recorded against the right document, and the next task is one tap away.* The track has a home (the menu), but none of its 4 task screens can finish a task.
- **Order journey** (erp-suite). *An approved PO is received, in full or in part.* It completes (Recorded 12), but its RF exit leaves RF for a desktop page.

Neither artifact walks the day loop end to end.

## 2. Measured inputs (deduplicated)

| Input | Result |
|---|---|
| Profile size | 40,787 bytes, which is 40,781 characters. The size gate counts characters, so the headroom is **179 characters**. Two lenses reported 40,781 as bytes; the pick lens measured both numbers, which settles it. |
| Link census, 6 RF docs | The menu has 4 tiles, all linking to tasks and none to the queue. The queue has 0 inbound links. A link walk from the menu reaches 5 of the 6 docs. Each task has 1 exit, Back to the menu. |
| `/next` in task contracts | Pick 1, putaway 1, count 1, goods receipt 0 (goods receipt is addressed by id). The menu's own contract routes every tile through the queue. |
| Wedge scan on arrival, no tap | Captured on 1 of 4 screens: goods receipt, the only one with `autofocus`. Lost on the other 3 (focus on body) in all 4 viewport/theme runs. After one tap, pick does capture it. |
| Completion | 0 `<form>` elements in 6 of 6 docs (the journey has 1). Primary buttons: pick 0, goods receipt 0, putaway 0, count 1. On pick, Enter, Skip item and Report short change nothing. |
| Rejection reason after the flash | On 4 of 4 screens it exists only in a 1x1 clipped live region. Visible text is unchanged 800-1000 ms after the scan. The journey keeps the reason visible, with `aria-invalid=true`. |
| Scan-flash frame | Three lenses sampled pixels: the frame is the same colour as the wash for both ok and error, in both themes. The controls (an injected border, forced colours, `padding-box`) do show a frame. The ok and error washes differ by only 1.26:1 in light and 1.08:1 in dark; for deuteranopia the difference is ΔE76 3.8 and 1.8 (Machado 2009 in linear RGB gives 6.2 and 2.4 — model-dependent; small either way). With forced colours and animation on, frame opacity falls from 0.30 to 0.002 within 555 ms. |
| Queue → task context | 0 of 4 identifiers survive the hop (the controls are found). Two POs open the same URL. |
| Scan field top, 360x640 | Goods receipt 40 px, putaway and count 140 px, pick 172 px (26.9%), journey 351 px (54.8%). First content starts at 12 px (1.9%) on all 6 docs mirrors (6.3% is goods receipt's scan-field top, a different metric) and at 175 px (27.3%) on the journey. |
| Journey at 360x640 | Confirm receipt sits at 689-741 px and "Connection lost before sending" at 774 px, both below the fold. Both are in view at 390x844. `check-journey` never runs at 360 wide. |
| Journey RF exit | Goes to `purchasing.html`, which loads `index.css` (browser floor 119; RF's is 108) at comfortable density. It has a 135 px header (21.1% of the height), a queue table that overflows its own scroll container by 29 px (305 against 276; document overflow is 0), and focus lands on body. |
| Count entry | The tile's label says "0 open", but it opens an active "PI-2026-081 · bin 4 of 30". Quantity and Submit are enabled before the bin is scanned. |
| Goods receipt | 0 KV rows (pick 4, putaway 3, count 3). It shows "No scans yet — try the live demo above." The bar moves from 274 to 531 px over 10 scans and leaves the viewport at scan 13. A dock injected in the browser holds it at 588-640 px. |
| Menu/queue after history Back | Focus returns to the last opened tile or row, so a PO wedge scan reopens Pick. An autofocused field fixes a fresh load but not Back (4 of 4 spike runs). |
| Profile membership | `bo-u-tabular` has 0 rules in the profile. 4 of 6 docs use a class the profile does not ship. `check-markup` checks against the full `api.json`, so it misses this. |
| Landing badge | 158 px wide in a 160 px tile; app-launch badges are 33-39 px. With `align-self:center` it measures 25.9 px. |
| Targets | All at least 44 px. Bar buttons are 113x52 at 360 (99x52 at 320), with no horizontal overflow at any width. Bar edge contrast is 1.41 in light and 1.90 in dark, against 4.63 and 7.44 for the fields. |

## 3. Seam verdicts

| Seam | Verdict | Evidence |
|---|---|---|
| Menu → task (arrival focus) | fix-handoff | Scan lost on 3 of 4 |
| Menu → queue | fix-handoff (the link does not exist) | 0 of 4 tiles |
| Queue → task | **merge-steps** for pick, putaway and count; fix-handoff for receive | `/next` 1/1/1/0; 0 of 4 identifiers survive |
| Queue → menu | fix-handoff | 0 links back |
| Count tile → count | fix-handoff (entry honesty) | "0 open" leads to bin 4 of 30 |
| Task → done → next | fix-handoff (the step does not exist) | 0 forms |
| Task → menu via Back | keep (disputed, §7) | 4 of 4 land on the menu |
| Menu/queue, history Back then a scan | fix (document it, or scan-to-open) | A PO scan reopens Pick |
| Journey: deep link before approval | keep (minor gap) | Honest alert, but a scan is silently dropped |
| Journey: approval → receiving | keep | Focus lands on scan; PO and outstanding count carried |
| Journey: wrong scan / partial / offline | keep | Reason stays visible; work kept |
| Journey: receiving → "my work" | **split-journey**: exit to an RF home | Desktop page (index.css, comfortable density, focus on body) |

## 4. Flow questions

- **F1** The end state can be stated, but it is split across two artifacts (§1).
- **F2** No:
  - menu → queue and task → done do not exist;
  - queue → task carries 0 of 4 identifiers;
  - arrival focus fails on 3 of 4 screens;
  - the journey's exit leaves RF.
- **F3** Yes: the queue step can go for the tasks the system directs (pick, putaway, count).
- **F4** The queue's opener ("taps the task at the top") describes a bridge screen. It earns its place only for receiving, where the worker chooses the PO or dock. The journey's approval done state is correctly merged into its exit.
- **F5** Work survives everywhere it was measured. The docs screens lose the visible reason for an error; the journey keeps it.
- **F6** Partly. Pick shows "3 of 12" and count shows "bin 4 of 30"; putaway and goods receipt show nothing; the journey shows Outstanding and Recorded.
- **F7** The docs mirrors restore a stale pick from bfcache, which only matters in the docs. On Back, the journey shows its done state.

## 5. Per-element verdicts

**Menu.**
- Keep: tiles (160x101), the hidden h1, the tile border, No-JS behaviour.
- Reword:
  - the badge, so it sizes to its content;
  - the "Count 0" demo data;
  - the "skeleton" loading row (the profile has 0 `bo-skeleton` rules);
  - the contract's "tiles → queue", to per-type routing;
  - "3-4 tiles" (the measured layout is 2 columns).
- Candidate, for the owner to confirm: an identity line and a sign-out. The screen is 64.1% empty.

**Queue.**
- Keep: the cell links (163x48).
- Remove:
  - the Status column (it has only 2 distinct values, and removing it stops 2 of 4 labels wrapping at 320);
  - the container's `tabindex=0` (the container never overflows).
- Reword: the missing title, the mixed task types, "128×42px", "not in this demo".
- Fix (low): the focus ring is clipped on the first and last rows.

**Pick.**
- Keep: KV rows, flash, steppers, quantity, Back, hidden h1.
- Skip item: keep, but wire it or say it is app-owned.
- Remove:
  - `bo-u-tabular`;
  - the placeholder (it repeats From bin);
  - Report short (a short is a quantity below need plus a reason).
- Reword: the label should name the one scan expected now.
- Make visible: the live region.
- Add: a form and one primary action, "Confirm pick".
- Fix: MAT-4471 breaks across lines at 320.

**Goods receipt.**
- Keep: the scan field and its `autofocus` on the device document, the contract, the camera recipe, contrast.
- Add: a PO/dock KV header and one primary action.
- Reword:
  - quantity: scan, then quantity, then Enter; reset per line; steppers get `tabindex=-1`;
  - the log: expected lines updated in place instead of a clock-time "Received" column, plus `data-density="spacious"`;
  - the empty-state text;
  - validation, which today rejects only codes starting with `REJECT`;
  - Report short, to "not received" (or remove it).
- Remove: Skip item (0 mutations, and it is a pick term).
- Docs page: drop the history, the profile list and the repeated Scan-feedback section, and do not autofocus when the screen is embedded.

**Putaway.**
- Keep: HU, From and the bold To bin; the label and placeholder; the confirmation line; Bin full; 0 primaries (the matching scan is the commit).
- Fix: focus on arrival.
- Make visible: the rejection reason.
- Demo: show the next HU, and never show Confirmed and an error at the same time.
- Remove: Wrong HU, if the HU gets scanned.

**Count.**
- Keep: the header rows; "—" rather than 0; Item not found; Submit count, with a one-line label and Enter submitting.
- Reword: bin emphasis should follow one shared rule.
- Keep the label "Scan bin to open the count" only if the count really opens.
- Fix: gate quantity until the right bin is scanned, then move focus to it.
- Remove: the blind-count hint from the screen.

## 6. Owner hypotheses

**H1: "Might need app screen." No new framework surface.**

The app screen already exists: rf-landing is the RF full-screen home, and app-frame is not meant for a dedicated device. What is missing is the wiring:
- no task screen completes a task or steps to the next one (0 of 4 complete; each does have a Back link to the menu);
- the queue is orphaned (0 inbound links);
- the journey's RF step exits to the desktop.

The journey does need an RF home. Build it in the example from the existing task-menu markup, with no CSS and no API.

App chrome on every screen is refused, on measurement. At 360x640 the journey's frame pushes the first task content to 27.3% of the height, the scan field to 54.8%, and Confirm below the fold. The docs screens start their task content at 1.9-6.3%.

The frame's slots go on the existing pages as guidance: identity and sign-out on the menu (64.1% empty), and everything else in existing task-screen slots.

**H2: "Task screen can be better." Yes, measured on all four.**

Every fix is composition, removal or rewording, except one framework defect in the shipped `scan.css`. In order of impact:
1. 3 of 4 screens lose the first scan.
2. 0 of 4 complete a task and move on, and their No-JS and States rows describe a form that does not exist.
3. A rejection's reason is never readable: visible text is unchanged at 80, 800, 1,000 and 1,500 ms after a wrong scan on pick, putaway and count; only the hue wash lasts about 700 ms, and it carries no reason.
4. The flash frame never renders outside forced colours, so ok vs error is told apart by hue alone.
5. Goods receipt names no PO, carries a quantity over to the next line, and loses scans after a tap.
6. Count and pick contradict their own state tables.

## 7. Where lenses disagree

1. **The Back label.** Journey and landing-list keep it. App-screen would name its destination, because system Back afterwards returns to the task. The facts agree and no measurement decides; this stays open in 389.5.
2. **Back from a task opened from the queue.** Landing-list: return to the queue. App-screen: go to the menu, in the same slot on every screen. This stays open until 389.5 decides the routing.
3. **Bar position.** App-screen: dock it (in view at 588-640). Goods receipt: put the log last. Pick: leaving it in flow is acceptable. The deciding measurement, the bar against the soft keyboard, was not taken.
4. **109.7's reopen condition.** Goods receipt: met. Pick: possibly met. App-screen: not met. All three say no generic form now. This is a reading of the condition, not a measurement.
5. **Plain `autofocus`.** Journey: add it. Pick and goods receipt measured the cost: an embedded screen pulls the docs reader's focus into the iframe. That measurement decides it, and 389.1 covers both sides.
6. **Forced-colours frame.** Pick and goods receipt saw it. Putaway/count saw it fade to 0.002 within 555 ms when animated. These are compatible; 389.4 requires the frame to stay visible for the stamp's whole lifetime.
7. **Chrome percentages** (54.8%, 27.3%, 21.1%). They measure different things, so there is no conflict.

## 8. Refusals

- **An RF app-screen pattern with frame chrome on every screen.** It costs 27.3% or 54.8% of the height, pushes Confirm below the fold, and would be a second frame beside app-frame (§2).
- **A sticky default in `--bar`.** Approval's 390 px card also uses `--bar`.
- **A generic RF scan-entry form.** 109.7 stands.
- **A visible title band on task screens.** The first KV row already names the task.
- **A key legend (R2-Q3) or a persistent offline badge (126).** No new evidence.
- **A new modifier for bar edge contrast.** Routed to 388.1.
- **Profile classes added only to make claims true.** The profile has 179 characters of headroom; reword the claim instead.
- **Not re-opened:** keypad, native select, a progress component, the spacious glove tier, blind count, empty-not-zero.

## 9. Actionables

| Id | Title | Lenses |
|---|---|---|
| 389.1 | RF task screens accept a scan on arrival without stealing docs focus | 5 lenses |
| 389.2 | RF task screens complete a task, or stop claiming to | journey, pick, receipt, put/count |
| 389.3 | A rejected scan's reason stays readable | journey, pick, receipt, put/count |
| 389.4 | `scan.css`: ok and error differ by more than hue, or the claim is corrected | pick, receipt, put/count |
| 389.5 | Join the RF track: per-type routing that links, prose and Back agree on | 5 lenses |
| 389.6 | The journey's RF step exits to an RF home | journey, landing, app |
| 389.7 | The journey's confirm and failure message are in view at 360x640 | journey, app, receipt |
| 389.8 | Goods receipt shows its delivery, expected lines and one primary action | journey, receipt, app |
| 389.9 | Goods receipt: a tap never costs the next scan | receipt |
| 389.10 | Goods receipt: quantity per line, out-of-range values refused | receipt |
| 389.11 | Count: menu, screen and state table agree | journey, put/count, landing |
| 389.12 | Pick names the next expected scan | journey, pick |
| 389.13 | Decide once where the RF bar sits | pick, receipt, app |
| 389.14 | RF frame guidance: who owns each slot | app, landing |
| 389.15 | Decide what a scan does on the menu and the queue | landing |
| 389.16 | Every RF class has a rule in the profile | pick, receipt |
| 389.17 | Decide whether putaway verifies the pallet | put/count |
| 389.18 | Receiving log at the glove tier, with accurate headers | receipt |
| 389.19 | Landing badge sized to its content | journey, landing, app |
| 389.20 | RF queue: drop the dead column and tab stop, and name the queue | landing |
| 389.21 | RF docs pages: screen first, figures true, states buildable | receipt, landing, put/count, journey |
| 389.22 | Count/putaway wording and emphasis | put/count |
| 389.23 | Pick identifiers do not break at 320 | pick |
| 389.24 | Cell-link focus ring clipped on the first and last rows | landing |
| 389.25 | Input to 388.1: edge contrast of a joined bar | pick |

Evidence (scripts, JSON, PNGs): `/private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/rfgrill/{journey,task-pick,task-receipt,task-putaway-count,landing-list,app-screen}/`.


## Challenger's corrections (applied above where the text allowed; recorded here in full)

1. H2 item 3 and §6 say a rejection's reason is 'readable for only about 700 ms'. It is never readable: visible text is unchanged at 80, 800, 1,000 and 1,500 ms on pick, putaway and count. Only the hue wash lasts about 700 ms, and it carries no reason.
2. 389.6 says 'The only visible queue link is approval work'. That depends on state: it is true only for an unapproved order, which cannot follow the RF step.
   - Approved, partly received: the exit shows 'Receive PO-1042'.
   - Complete: 0 links, showing the queues-empty state.
3. The '29 px overflow at 360' at the journey exit is the queue table overflowing inside its own scroll container (305 against 276). Document overflow is 0.
4. 389.4 gives deuteranopia ΔE76 of 3.8 and 1.8. The figure depends on the simulation model: Machado 2009 in linear RGB gives 6.2 (light) and 2.4 (dark). The conclusion, a small difference, still holds.
5. 389.21 lists goods receipt, putaway, count, landing and list as narrating roadmap history. rf-pick does too ('this page used to render the same component a second time… (roadmap 131.1)'). That makes it 6 of 6.
6. 389.22 says 'Item not found' wraps at 360 and 390. It also wraps at 320, and 'Report short' wraps at all three widths.
7. 389.18's '49 px' rows measure 48.5 px.
8. H1 says '0 of 4 docs task screens complete, so nothing returns to the menu'. Every task screen has a Back link that lands on the menu, as the report's own §2 says ('Each task has 1 exit, Back to the menu'). What is missing is completion and the step to the next task.
9. §2 gives first task content at '1.9-6.3%' on the docs screens. First content is at 12 px (1.9%) on all 6 mirrors. The 6.3% is goods receipt's scan-field top, which is a different metric.
10. 389.14 says the journey 'had to invent' its header because of app-frame's Not-for. That is causal inference, not a measurement. Also, the journey header does show the site ('Northwind SG · My work'); it lacks only the user and a sign-out.

## Challenger's hypothesis check

H1 ('Might need app screen': no new surface, wire what exists) is supported by my measurements, with one wording fix. The wiring gaps all reproduce:
- rf-list-rf has 0 inbound links, and a walk from the menu reaches 5 of 6 documents;
- 0 forms on 6 of 6, and 0 primaries on 3 of 4 task screens;
- the journey's two RF exits land on purchasing.html, with index.css, comfortable density, a 135 px header (21.1%) and focus on body.

The chrome cost that justifies refusing per-screen app chrome also reproduces at 360x640. In the journey the KV starts at 175 px (27.3%), the scan field at 351 px (54.8%), Confirm at 689-741 px and the failure message at 774-837 px (out of view). On all 6 docs mirrors, the first content is at 12 px (1.9%).

Two caveats:
- The refusal rests on 360x640. At 390x844 both Confirm and the failure message are in view, so the verdict has to name the rugged viewport as the deciding one. It should, since 360x640 is the floor study's fixture size.
- 'nothing returns to the menu' is literally false. 4 of 4 task screens have a Back link to the menu, and in-screen Back lands there. What is missing is task completion and the step to the next task, not a return path.

H2 ('Task screen can be better') is supported, with items 1, 2, 4, 5 and 6 reproduced as stated:
- arrival capture fails on 3 of 4 screens (0 of 4 runs each for putaway, pick and count);
- 0 completion on every screen;
- the flash band is identical to the wash in every normal-rendering case, while a black-border control and a padding-box gap control show the sampler can see a band;
- goods receipt has 0 KV rows, carries a quantity over, and loses scans after a tap;
- count and pick contradict their own state tables.

Item 3 is worse than stated. The reason is never visible to a sighted user: the text is unchanged at 80 to 1,500 ms on pick, putaway and count. Only the hue wash lasts about 700 ms, and it carries no reason.

'Except one framework defect' undercounts slightly. 389.24, the clipped cell-link focus ring, is also in shipped data-table CSS, though it is low severity and not a WCAG failure. In the same area, 389.18's red-proof shows the data-table @container compaction fires on any RF table that lacks an explicit data-density (rf-list's rows go from 51 to 33 px when the attribute is removed), so 109.7's column-count reasoning is wrong.

New observation outside the actionables: in the journey, after a failed send, 'Scan again' and a wrong scan, the stale 'Connection lost… Your quantity is kept' message stays next to 'Item not accepted', because #message is not cleared on a new scan (see journey-rugged-dark.png).

Evidence scripts, JSON and PNGs are in /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/rfgrill/challenge/.
