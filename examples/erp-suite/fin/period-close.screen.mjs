import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "a checklist with DEPENDENCIES is a
   shape this framework does not have."

   Period close is a list of tasks where order is a rule, not a suggestion:
   depreciation cannot run before accruals are posted, and the ledger cannot be
   locked until every prior task is done. The suite already has two neighbours
   and neither is this:

   - `bo-stepper` is a flow the user is walking NOW, one step at a time. Close
     is not sequential in that sense — three tasks can be in flight at once,
     owned by different people.
   - `bo-timeline` reports an ordered chain with state, which is closer, but a
     timeline is READ, not worked. Nothing in it is assignable or actionable.

   So the honest build is a table with a state column, because a close task has
   an owner, a due date and an action — and a table is what carries those. What
   is lost is the DEPENDENCY: "blocked by task 3" is stated in words in the
   status cell, and nothing draws the link. Whether that is worth a component
   is the finding; a blocked task that merely says so in text may well be
   enough, and one screen is not evidence that it is not. */

/* [task, owner, due, state, note] */
const tasks = [
  ['Bank reconciliation', 'M. Osei', '01 Oct', 'done', 'Reconciled to statement 09-30'],
  ['Sub-ledger cut-off — AP', 'J. Kim', '01 Oct', 'done', '48 invoices posted'],
  ['Sub-ledger cut-off — AR', 'J. Kim', '01 Oct', 'done', ''],
  ['Post accruals', 'M. Osei', '02 Oct', 'current', 'JE-2026-0841 is out of balance'],
  ['Inventory valuation', 'R. Vance', '02 Oct', 'current', 'Awaiting cycle count variance'],
  ['Depreciation run', 'System', '03 Oct', 'blocked', 'Blocked by Post accruals'],
  ['FX revaluation', 'System', '03 Oct', 'blocked', 'Blocked by Post accruals'],
  ['Management reporting pack', 'A. Bello', '04 Oct', 'pending', ''],
  ['Lock the period', 'A. Bello', '04 Oct', 'pending', 'Every task above must be done'],
];

const badge = {
  done: 'bo-badge bo-badge--success',
  current: 'bo-badge bo-badge--accent',
  blocked: 'bo-badge bo-badge--danger',
  pending: 'bo-badge',
};
const label = { done: 'Done', current: 'In progress', blocked: 'Blocked', pending: 'Not started' };

export const render = () =>
  page({
    title: 'Period close',
    moduleId: 'fin',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Finance', href: '/fin/journal-entry.html' },
      { label: 'Period close' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Close 09/2026 <span class="bo-badge bo-badge--accent">Day 2 of 4</span></h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button" disabled aria-describedby="close-gate">Lock period</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Ledger GL-01 · 3 of 9 tasks done · target 04 Oct.
    Owners work in parallel; the order only matters where a task says it is
    blocked.</p>

    <div class="bo-alert bo-alert--warning" role="status" id="close-gate">
      <p class="bo-alert__title">Two tasks are blocked</p>
      <p>Depreciation and FX revaluation both wait on <strong>Post
      accruals</strong>, which is held up by an unbalanced journal —
      <a href="/fin/journal-entry.html">JE-2026-0841</a>. The period cannot be
      locked until every task is done.</p>
    </div>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Period close tasks, owners, due dates and status</caption>
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Owner</th>
            <th scope="col">Due</th>
            <th scope="col">Status</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          ${tasks
            .map(
              ([task, owner, due, state, note]) => `<tr>
            <th scope="row">${task}</th>
            <td>${owner}</td>
            <td class="bo-u-tabular">${due}</td>
            <td><span class="${badge[state]}">${label[state]}</span></td>
            <td>${note || '<span class="bo-u-text-muted">—</span>'}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <p class="bo-u-text-muted">The status badge is the visible channel and its
    word is the programmatic one — "Blocked" is read out, not inferred from a
    colour. What a table cannot draw is the dependency itself: the note names
    the blocking task in prose, and nothing links the two rows.</p>
`,
  });
