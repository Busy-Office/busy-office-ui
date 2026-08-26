#!/usr/bin/env node
/**
 * Gate: a pattern page that documents an auto-update TRIGGER also documents the
 * control that stops it (roadmap 149.4).
 *
 * @exact — string membership over the page source. It asks whether two things
 * are both present, not whether prose means the right thing.
 *
 * WHY. WCAG 2.2 SC 2.2.2 (Level A) has two bullets with deliberately different
 * thresholds. Moving, blinking and scrolling trigger the requirement only after
 * five seconds; **auto-updating information triggers from the first tick**.
 * W3C's own worked example of content needing a control is a stock ticker, so
 * the "essential" carve-out does not cover an ordinary live cell.
 *
 * This project already KNEW the criterion — `components/state-patterns` cites
 * *Pause, Stop, Hide* by name and answers it correctly for skeleton animation,
 * quoting the five-second threshold. It applied it to the bullet that has a
 * grace period and not to the one that does not. Two pattern pages documented
 * `hx-trigger="every Ns"` with no control anywhere on them.
 *
 * `axe` cannot see this: "is there a control for this updating region" is not a
 * DOM-inspectable property, which is why the accessibility sweep stayed green
 * throughout. This gate covers what that one structurally cannot.
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It does not fire on a page that merely
 * mentions polling — `inbox`, `record-detail` and `bulk-actions` name it in
 * passing without documenting an interval, and demanding a control there would
 * be noise. The first measurement behind this gate got exactly that wrong: it
 * grepped `polling|every Ns|auto-refresh`, counted every mention, and reported
 * "four of four" where the truth was two. The signal is the TRIGGER.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gate, assertScanned } from './gate-report.mjs';
import { DOCS_ROOT } from './paths.mjs';

const PATTERNS = join(DOCS_ROOT, 'src', 'pages', 'patterns');

/** An interval trigger — the thing SC 2.2.2's auto-updating bullet is about. */
const TRIGGER = /hx-trigger="every\s+\d+\s*[a-z]+/i;

/**
 * Evidence that the page tells the reader how to stop or slow it. Either the
 * criterion is cited (so a reader can follow it), or a real control is present.
 * Both spellings are accepted because the right answer differs per screen:
 * `job-monitor` ships a segmented control because the updating region IS the
 * screen; `notification` polls app-shell chrome, where the honest answer is a
 * settings preference rather than a widget bolted next to the bell.
 */
const CONTROL = [
  /2\.2\.2/,
  /pause-stop-hide/,
  /bo-segmented/,
];

const g = gate('auto-update control check', 'pattern page(s)');
let scanned = 0;
let withTrigger = 0;

for (const f of (await readdir(PATTERNS)).filter((f) => f.endsWith('.astro'))) {
  const src = await readFile(join(PATTERNS, f), 'utf8');
  scanned += 1;
  if (!TRIGGER.test(src)) continue;
  withTrigger += 1;
  g.check(
    `${f} documents a control for its auto-update`,
    CONTROL.some((re) => re.test(src)),
    `it documents hx-trigger="every …" but nothing on the page cites WCAG ` +
      `SC 2.2.2 or ships a control. Auto-updating information needs a way to ` +
      `pause, stop, hide it OR control its frequency, from the FIRST tick — ` +
      `there is no five-second grace for numbers. Add the control the screen ` +
      `actually wants (a bo-segmented interval where the region is the screen; ` +
      `a settings preference where it is app chrome) and say which.`,
  );
}

assertScanned(scanned, 'pattern page(s) scanned', 'wrong directory?');

/* A zero here is a defect until proven otherwise: if NO page documents a
   trigger, either the pages changed or TRIGGER stopped matching, and this gate
   would report a serene pass while checking nothing. */
if (withTrigger === 0) {
  console.error(
    'auto-update control check FAILED — no pattern page matched the trigger ' +
      'pattern, so this gate verified nothing. Two pages documented ' +
      'hx-trigger="every Ns" when it was written; if that is deliberately no ' +
      'longer true, delete this gate rather than letting it pass on an empty set.',
  );
  process.exit(1);
}

g.report(`checked — ${withTrigger} of ${scanned} document an auto-update trigger`);
