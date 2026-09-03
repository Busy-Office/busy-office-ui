import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "a document-level CONSTRAINT has no
   home in this framework."

   Every screen the suite has built so far shows STATE — approved, late, over
   capacity. A journal entry is different in kind: it cannot be posted until
   debits equal credits, and the violation is a property of the whole document
   rather than of any one row. Nothing is wrong with line 3; the SET is wrong.

   Built from shipped surface only, to find out what that costs. What exists:
   `bo-alert--danger` states the problem in words, `disabled` on the post
   button makes the rule unskippable, and `aria-describedby` ties the button to
   the reason so a screen-reader user hears why it is off rather than just that
   it is.

   A SECOND PREDICTION HERE WAS WRONG, and measuring is what said so. It read:
   "there is no treatment for a totals row — `bo-data-table__footer` is
   pagination chrome, so a `<tfoot>` is an ordinary row." The first half is
   true and the conclusion is not. Measured on the built screen, a `<tfoot>`
   cell renders at weight 600 with a 2px top rule against a body cell's 400 and
   0px, because `.bo-data-table tfoot :is(th, td)` has carried exactly that
   since roadmap 130.3 — whose own comment records that it was found on "a
   receivables ageing screen", which is the screen next door in this module.
   The gap was closed before this screen existed. No class is needed because
   the element IS the signal.

   Kept rather than quietly deleted: a prediction that survives to the build
   and dies to a measurement is the instrument working. */

const lines = [
  ['610100', 'Freight in — inbound haulage', 'CC-2205', '4,120.00', ''],
  ['610400', 'Customs duty — Q3 import', 'CC-2205', '1,880.50', ''],
  ['210300', 'Goods received not invoiced', 'CC-2205', '12,940.00', ''],
  ['200100', 'Trade payables — Acme Supply Co.', '', '', '17,940.50'],
];

const debits = '18,940.50';
const credits = '17,940.50';
const difference = '1,000.00';

export const render = () =>
  page({
    title: 'Journal entry',
    description:
      'Draft journal entry JE-2026-0841 with its accounts and cost centres, and the debit and credit totals that must agree.',
    moduleId: 'fin',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Finance', href: '/fin/journal-entry.html' },
      { label: 'JE-2026-0841' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>JE-2026-0841 <span class="bo-badge">Draft</span></h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--secondary" type="button">Save draft</button>
        <button class="bo-btn" type="button" disabled aria-describedby="je-balance">Post</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Period 09/2026 · Ledger GL-01 · Prepared by M. Osei</p>

    <!-- The constraint, stated where the decision is made. Three channels, on
         purpose: the words say what is wrong and by how much, the disabled
         button makes it unskippable, and aria-describedby means a screen-reader
         user hears the reason when they reach Post rather than meeting a dead
         control. -->
    <div class="bo-alert bo-alert--danger" role="alert" id="je-balance">
      <p class="bo-alert__title">Out of balance by $${difference}</p>
      <p>Debits total $${debits} against credits of $${credits}. An entry
      cannot be posted until the two agree — check line 3, which carries the
      full GRNI accrual against a payable net of the freight lines.</p>
    </div>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Journal entry lines, with debit and credit totals</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Account</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--code">Cost centre</th>
            <th scope="col" class="bo-data-table__col--numeric">Debit</th>
            <th scope="col" class="bo-data-table__col--numeric">Credit</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(
              ([acct, desc, cc, dr, cr]) => `<tr>
            <td class="bo-data-table__col--code">${acct}</td>
            <td>${desc}</td>
            <td class="bo-data-table__col--code">${cc || '<span class="bo-u-text-muted">—</span>'}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${dr || ''}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${cr || ''}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <!-- No class needed: .bo-data-table tfoot :is(th, td) already gives a
             summary its rule and its weight (130.3). See the header — this is
             where the prediction died. -->
        <tfoot>
          <tr>
            <th scope="row" colspan="3">Totals</th>
            <td class="bo-data-table__col--numeric bo-u-tabular">${debits}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${credits}</td>
          </tr>
          <tr>
            <th scope="row" colspan="3">Difference</th>
            <td class="bo-data-table__col--numeric bo-u-tabular" data-tone="danger" data-tone-text colspan="2">${difference}<span class="bo-visually-hidden"> — debits exceed credits</span></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p class="bo-u-text-muted">A posting rule is not a field error. Nothing is
    wrong with any single line here — the set does not balance, so the message
    belongs to the document and sits above it rather than beside a control.</p>
`,
  });
