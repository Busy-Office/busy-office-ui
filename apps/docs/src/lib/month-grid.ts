/**
 * The 5×7 date grid behind a calendar month. One implementation.
 *
 * `/components/calendar` and `/patterns/detail-form` each generate a month, and
 * they render CELLS very differently — one emits `<span>`s marked with
 * `data-day`, the other emits disabled `<button type="submit">`s carrying a
 * delivery date. That difference is real and stays in the pages.
 *
 * What must NOT differ is the date maths, and it had already started to: the
 * two spelled the same offset two ways —
 *
 *   (first.getUTCDay() - weekStart + 7) % 7      // calendar
 *   (first.getUTCDay() + 6) % 7                  // detail-form
 *
 * — which agree only while `weekStart` is Monday. The second is the first with
 * the setting folded in and forgotten, which is exactly how a Sunday-first grid
 * would come out silently wrong (Standardize sweep, 2026-08-19).
 *
 * UTC throughout, deliberately: `new Date(2026, 8, 1)` is local time, and in a
 * timezone behind UTC `toISOString()` then reports the previous day — a
 * calendar that is correct in London and off by one in New York.
 *
 * `check:calendar-grid` reads every rendered cell's date back against its
 * column heading, so an error here turns the build red rather than shipping a
 * grid that merely looks like a calendar.
 */

export type MonthDay = {
  /** ISO date, `YYYY-MM-DD`. */
  iso: string;
  /** Day of the month, 1-31. */
  day: number;
  /** Day of the week, 0 = Sunday. */
  weekday: number;
  /** True when the cell belongs to the previous or next month. */
  outside: boolean;
};

/**
 * Five weeks of seven days covering `monthIdx` (0-based), starting on
 * `weekStart` (0 = Sunday, 1 = Monday).
 */
export function monthGrid(year: number, monthIdx: number, weekStart: 0 | 1): MonthDay[][] {
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - ((first.getUTCDay() - weekStart + 7) % 7));

  return Array.from({ length: 5 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + w * 7 + d);
      return {
        iso: date.toISOString().slice(0, 10),
        day: date.getUTCDate(),
        weekday: date.getUTCDay(),
        outside: date.getUTCMonth() !== monthIdx,
      };
    }),
  );
}

/** Column headings for a week starting on `weekStart`, Sunday-indexed names. */
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const DAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export function weekdayOrder(weekStart: 0 | 1): number[] {
  return Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
}
