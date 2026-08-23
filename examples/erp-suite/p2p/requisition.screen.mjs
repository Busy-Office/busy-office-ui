import { page } from '../_shell.mjs';

/* PR creation — the accepted half of "does the flow need more screens".
   Tests `detail-form` at real ERP scale: a header of grouped fields plus a
   line-item grid the reader adds rows to, under one sticky action bar.
   The touch attribute recipe (127.5) is applied to every field, because a
   requisition is exactly the thing people raise from a phone. */

const lines = [
  ['10', 'ABC-10924', 'Hex bolt M8 × 40, zinc', '2400', 'ea', '0.42'],
  ['20', 'ABC-11002', 'Hex nut M8, zinc', '2400', 'ea', '0.18'],
  ['30', 'STL-4410', 'Steel plate 3mm, 1m × 2m', '60', 'sheet', '412.00'],
];

export const render = () =>
  page({
    title: 'REQ-40118',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/requisitions.html' },
      { label: 'Requisitions', href: '/p2p/requisitions.html' },
      { label: 'REQ-40118' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">REQ-40118</h1>
        <span class="bo-badge bo-badge--success">Approved</span>
      </div>
    </header>

    <form>
      <fieldset class="bo-form-section">
        <legend class="bo-form-section__legend">Request</legend>
        <div class="bo-form-row">
          <div class="bo-form-field">
            <label class="bo-form-field__label" for="rq-vendor">Suggested vendor</label>
            <input class="bo-input" id="rq-vendor" name="vendor" value="Northwind Supply"
                enterkeyhint="next">
            <p class="bo-form-field__hint">Purchasing may order elsewhere; a requisition suggests, it does not commit.</p>
          </div>
          <div class="bo-form-field">
            <label class="bo-form-field__label" for="rq-cc">Cost center</label>
            <input class="bo-input bo-input--code" id="rq-cc" name="cc" value="CC-4021"
                autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="next">
          </div>
        </div>
        <div class="bo-form-row">
          <div class="bo-form-field">
            <label class="bo-form-field__label" for="rq-needed">Needed by</label>
            <input class="bo-input" id="rq-needed" name="needed" type="date" value="2026-08-28">
          </div>
          <div class="bo-form-field">
            <label class="bo-form-field__label" for="rq-for">Requested for</label>
            <input class="bo-input" id="rq-for" name="requester" value="M. Osei" enterkeyhint="next">
          </div>
        </div>
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="rq-why">Justification</label>
          <textarea class="bo-input" id="rq-why" name="why" rows="2" enterkeyhint="enter">Line 3 restock — current stock covers 9 days of production.</textarea>
        </div>
      </fieldset>

      <fieldset class="bo-form-section">
        <legend class="bo-form-section__legend">Lines</legend>
        <div class="bo-data-table-container" tabindex="0" data-density="compact">
          <table class="bo-data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col" class="bo-data-table__col--secondary">Description</th>
                <th scope="col" class="bo-data-table__col--numeric">Qty</th>
                <th scope="col" class="bo-data-table__col--tertiary">UoM</th>
                <th scope="col" class="bo-data-table__col--numeric">Est. price</th>
              </tr>
            </thead>
            <tbody>
              ${lines
                .map(
                  ([no, item, desc, qty, uom, price]) => `<tr>
                <td class="bo-u-tabular">${no}</td>
                <td><input class="bo-input bo-input--code bo-input--seamless" value="${item}" aria-label="Item, line ${no}"
                    autocapitalize="characters" autocorrect="off" spellcheck="false"></td>
                <td class="bo-data-table__col--secondary"><input class="bo-input bo-input--seamless" value="${desc}" aria-label="Description, line ${no}"></td>
                <td class="bo-data-table__col--numeric"><input class="bo-input bo-input--numeric bo-input--seamless" type="number" inputmode="numeric" step="1" min="0" value="${qty}" aria-label="Quantity, line ${no}"></td>
                <td class="bo-data-table__col--tertiary">${uom}</td>
                <td class="bo-data-table__col--numeric"><input class="bo-input bo-input--numeric bo-input--seamless" type="number" inputmode="decimal" step="0.01" value="${price}" aria-label="Estimated price, line ${no}"></td>
              </tr>`,
                )
                .join('\n              ')}
            </tbody>
          </table>
        </div>
        <!-- GAP-12 RESOLVED 2026-08-23. "Add a line" is the most-pressed
             control on any document entry screen, and it now has a stated
             home: BELOW the table in a cluster, never in
             .bo-data-table__toolbar. The rule is that the toolbar acts on
             rows that already exist while this creates one that does not,
             and the new row is appended at the END — a control at the top
             produces a result the reader cannot see. editable-grid documents
             it; this screen and that demo had independently invented two
             different spellings of the same button, which is exactly what
             the gap predicted. -->
        <div class="bo-cluster">
          <button class="bo-btn bo-btn--secondary" type="button">+ Add line</button>
        </div>
      </fieldset>

      <div class="bo-form-actions">
        <button class="bo-btn bo-btn--ghost" type="button">Delete</button>
        <button class="bo-btn bo-btn--secondary" type="button">Save as draft</button>
        <button class="bo-btn bo-btn--secondary" type="reset">Discard changes</button>
        <button class="bo-btn" type="submit">Submit for approval</button>
      </div>
    </form>
`,
  });
