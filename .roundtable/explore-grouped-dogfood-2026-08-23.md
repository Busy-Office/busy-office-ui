# Explore: dogfooding 0.4.0's grouped numbers into po-app (2026-08-23)

Dispatched as the loop's Research/Explore fallback at the owner's ask.
Spiked in an isolated worktree; **installed the REAL npm release**
(`npm install @busy-office/ui@0.4.0`) rather than a local tarball — the
registry-install smoke test passed for free. Wiring: `data-grouped
data-locale="en-US"` on `/pos/new`'s Amount and the detail screen's
row-edit Amount, plus `initGroupedNumber()` in the shell script.

## Three real framework defects, found within hours of the release

All three surfaced from ONE gesture sequence a real user performs daily —
select the amount, retype it, then hit Cancel:

1. **Select-and-retype appended instead of replacing.** The focusin
   handler swaps the display to the raw value AFTER the pointer gesture
   built its selection, destroying it — typed digits landed beside the
   old ones ("999999.251234567.50").
2. **…and the concatenation parsed to an empty hidden value**, so a Save
   on a fine-looking form would 422.
3. **Cancel (`type="reset"`) triple-desynced the field**: the browser
   restored the visible input's raw ungrouped attribute default, wiped
   the JS-created hidden input to '' (no value attribute to restore), and
   the row stayed marked dirty.

Fix (packages/core, red-first — 3 failing tests before any change):
focus now **selects** the raw value (the spreadsheet/AutoNumeric amount
convention, which also makes the destroyed-selection case moot); a
document-level reset listener re-syncs every grouped input from
`defaultValue` after the reset applies.

**The fix itself had a bug the E2E re-drive caught**: the resync
dispatched `input`, which re-marked the dirty row right after row-edit's
own reset listener had cleared it — two `setTimeout(0)` handlers, ours
last. A control read of row-edit showed its input handler marks dirty
unconditionally, and that a NATIVE reset never fires `input` — so the
resync is now silent, and the regression is pinned by a composition test
running BOTH behaviors together. 127/127.

One probe-timing false alarm along the way, suspected before blaming the
code: the first post-fix drive read state before the deferred resync ran;
a 100ms beat showed the fix working. Instrument first, always.

## E2E proof (real browser, real npm-installed package, real server)

- Create flow: type `1234567.5` → blur → displays `1,234,567.50`, hidden
  submits `1234567.50`, server stores and re-renders the raw number.
- Edit flow: triple-click + retype → `999,999.25` / hidden `999999.25`,
  row dirty; **Cancel** → display `12,400.00` (grouped default), hidden
  `12400.00`, row **clean**, badge hidden.

## Graduation

- Framework fixes + 3 tests → main (this commit); po-app wiring → main's
  `examples/po-app` so the reference app keeps exercising the behavior.
- **npm still serves 0.4.0 with these defects** — a 0.4.1 patch release
  is recommended and is the owner's call, as every release is.
