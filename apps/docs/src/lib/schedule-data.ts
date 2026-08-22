/**
 * The schedule pattern's month markup — pure logic, no Astro. Split out of
 * ScheduleScreen.astro (roadmap 119.1): an Astro component's `export const`
 * hoists to true module scope, evaluated BEFORE the frontmatter code that
 * actually runs inside the render closure, so a value computed from
 * frontmatter-local variables cannot be exported directly (a real compiler
 * quirk, found building this — `monthMarkup is not defined` at import time).
 * A plain module has no such split; the same function backs both the
 * <ScheduleScreen /> component (default rendering) and its exported markup
 * string (the "Markup" section's copyable code), so they cannot drift.
 *
 * The month grid is GENERATED, never hand-typed — same discipline as
 * /components/calendar and the same reason: a month is 35+ cells whose date
 * must agree with the column it sits under, and getting that wrong is
 * invisible (roadmap 55.1, check:calendar-grid).
 */
import { monthGrid, DAY_NAMES, DAY_SHORT, weekdayOrder } from './month-grid';

export const YEAR = 2026;
export const MONTH = 7; // August (0-indexed)
export const OPEN_DATE = '2026-08-24';
export const TODAY = '2026-08-19';
export const HOLIDAY = '2026-08-03';
// iso -> count of scheduled entries that day. Only these days become links.
export const ENTRIES: Record<string, number> = {
  '2026-08-04': 2,
  '2026-08-11': 1,
  '2026-08-19': 3,
  '2026-08-24': 4,
  '2026-08-27': 2,
};

export function scheduleMonth(year: number, monthIdx: number): string {
  const head = weekdayOrder(1)
    .map((d) => `<th scope="col"><abbr title="${DAY_NAMES[d]}">${DAY_SHORT[d]}</abbr></th>`).join('');
  const weeks = monthGrid(year, monthIdx, 1).map((week) => {
    const cells = week.map(({ iso, day, outside }) => {
      if (outside) {
        return `<td><span class="bo-calendar__day bo-calendar__day--outside"><time datetime="${iso}">${day}</time></span></td>`;
      }
      const count = ENTRIES[iso];
      const isOpen = iso === OPEN_DATE;
      const isHoliday = iso === HOLIDAY;
      const isToday = iso === TODAY && !isOpen;
      const dow = new Date(`${iso}T00:00:00Z`).getUTCDay();
      const weekend = dow === 0 || dow === 6;
      const dataDay = isOpen ? 'selected' : isHoliday ? 'holiday' : isToday ? 'today' : weekend ? 'closed' : undefined;
      const mark = dataDay ? ` data-day="${dataDay}"` : '';
      const srBits = [];
      if (isOpen) srBits.push('currently open');
      else if (isHoliday) srBits.push('public holiday, no deliveries');
      else if (isToday) srBits.push('today');
      else if (weekend) srBits.push('non-working day');
      if (count) srBits.push(`${count} scheduled`);
      const sr = srBits.length ? `<span class="bo-visually-hidden"> — ${srBits.join(', ')}</span>` : '';
      if (count && !isHoliday) {
        return `<td><a class="bo-calendar__day" href="#schedule-detail"${mark}><time datetime="${iso}">${day}</time>${sr}</a></td>`;
      }
      return `<td><span class="bo-calendar__day"${mark}><time datetime="${iso}">${day}</time>${sr}</span></td>`;
    });
    return `      <tr>${cells.join('')}</tr>`;
  });
  return `<div class="bo-calendar">
  <table class="bo-calendar__month">
    <caption>August 2026 — days with a link carry scheduled work</caption>
    <thead><tr>${head}</tr></thead>
    <tbody>
${weeks.join('\n')}
    </tbody>
  </table>
</div>`;
}

export const monthMarkupSample = scheduleMonth(YEAR, MONTH);
