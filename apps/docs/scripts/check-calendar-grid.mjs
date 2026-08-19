#!/usr/bin/env node
/**
 * Gate: every calendar cell sits under the weekday its own date falls on.
 *
 * @exact — reads each cell's `datetime` back and compares it against the column
 * heading above it. Equality against a computed weekday, no judgement, so it is
 * exempt from --self-test. It was still red-proved before being trusted:
 * rewriting one cell's date to another weekday makes it report exactly that
 * cell (2026-08-19).
 *
 * WHY. The docs hand-write calendar months — five of them on `/components/
 * calendar` alone, 28 `<td>`s in template literals. A month is 35+ cells whose
 * date must agree with the column it sits under, and an error there is
 * **invisible**: the grid still looks like a calendar, the styling is right,
 * every other gate passes, and a reader copying it ships a screen that puts
 * Tuesday's delivery under Monday.
 *
 * This is the same class as the row-label bug CLAUDE.md records (`LINE-1`
 * labelled "Hydraulic pump") — data that looks plausible in the wrong slot.
 *
 * It also guards the week-start work (roadmap 54.2): Monday-first and
 * Sunday-first grids differ only in which date lands in which cell, so a gate
 * that reads the date back is the only thing that can tell a correct
 * Sunday-first month from a Monday-first month with a Sunday-first heading.
 */
import { DIST } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate } from './gate-report.mjs';

const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const g = gate('calendar-grid check', 'dated calendar cells');

let calendars = 0;
let cells = 0;

for (const page of await distPages(DIST)) {
  for (const table of page.html.match(/<table class="bo-calendar__month"[\s\S]*?<\/table>/g) ?? []) {
    calendars += 1;
    const heads = [...table.matchAll(/<th[^>]*>(?:\s*<abbr[^>]*title="([^"]+)"[^>]*>)?([^<]*)/g)]
      .map((m) => (m[1] || m[2] || '').trim())
      .filter(Boolean);
    const body = table.slice(table.indexOf('<tbody'));
    for (const row of body.match(/<tr>[\s\S]*?<\/tr>/g) ?? []) {
      const tds = row.match(/<td>[\s\S]*?<\/td>/g) ?? [];
      tds.forEach((td, col) => {
        const iso = td.match(/(?:datetime|value)="(\d{4}-\d{2}-\d{2})"/)?.[1];
        if (!iso) return;
        cells += 1;
        const actual = NAMES[new Date(`${iso}T00:00:00Z`).getUTCDay()];
        const heading = heads[col];
        g.check(
          `${page.url} ${iso} under ${heading}`,
          heading === actual,
          `${iso} is a ${actual} but sits in the ${heading} column`,
        );
      });
    }
  }
}

if (!cells) {
  console.error('calendar-grid check FAILED — found no dated calendar cells at all.');
  console.error('  The docs ship calendars; finding none means this gate is looking in the wrong place.');
  process.exit(1);
}

g.report(`verified across ${calendars} calendar(s)`);
