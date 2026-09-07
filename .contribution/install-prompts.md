# Install prompts

One per component, in the 21st.dev "copy the prompt, paste it anywhere" shape —
but HTML-first, because this framework has no client framework. Paste a block
into Claude Code, Cursor or Codex and it has everything: the stylesheet to link,
the exact markup, the behaviour to call, and where the real values live.

Generated from `react/*/*.prompt.md` and `registry.json`; regenerate rather than
edit.

## Button

```text
Add the busy-office-ui Button to this project.
The framework action control, in solid, secondary, ghost and danger settings.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<button class="bo-btn" type="button">Post invoice</button>
<button class="bo-btn bo-btn--secondary" type="button">Cancel</button>
<button class="bo-btn bo-btn--ghost" type="button">Views</button>
<button class="bo-btn bo-btn--danger-ghost" type="button">Reject</button>
<button class="bo-btn bo-btn--sm bo-btn--icon bo-btn--ghost" type="button" aria-label="Dismiss">
  <span class="bo-icon bo-icon--close" aria-hidden="true"></span>
</button>

3. No JavaScript required.
4. Values: components/button/button.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## ButtonGroup

```text
Add the busy-office-ui ButtonGroup to this project.
Joins a row of buttons into one visually connected toolbar control.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-btn-group">
  <button class="bo-btn bo-btn--secondary" type="button">Copy</button>
  <button class="bo-btn bo-btn--secondary" type="button">Branch</button>
</div>
<div class="bo-btn-group bo-btn-group--bar">
  <button class="bo-btn bo-btn--secondary" type="button">Back</button>
  <button class="bo-btn" type="button">Confirm</button>
</div>

3. No JavaScript required.
4. Values: components/button/button.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Icon

```text
Add the busy-office-ui Icon to this project.
A CSS mask icon that takes currentColor and scales with the surrounding font size.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-icon bo-icon--truck" aria-hidden="true"></span>
<!-- Extend with the custom property, not a new class -->
<span class="bo-icon" role="img" aria-label="Package"
      style="--bo-icon-src: url('/icons/package.svg')"></span>

3. No JavaScript required.
4. Values: components/icon/icon.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Kbd

```text
Add the busy-office-ui Kbd to this project.
A single key or chord in a keyboard shortcut.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

Press <kbd class="bo-kbd">Ctrl</kbd> + <kbd class="bo-kbd">S</kbd> to save.

3. No JavaScript required.
4. Values: components/kbd/kbd.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## FormField

```text
Add the busy-office-ui FormField to this project.
Label, control, hint and error message as one vertical unit.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-form-field">
  <label class="bo-form-field__label" for="cc">Cost center</label>
  <input class="bo-input" id="cc" name="cc" value="CC-9900"
         aria-invalid="true" aria-describedby="cc-msg">
  <span class="bo-form-field__hint">Closed cost centers cannot be posted to.</span>
  <span class="bo-form-field__message" id="cc-msg" role="alert">Cost center is closed for posting.</span>
</div>

3. No JavaScript required.
4. Values: components/form/form-field.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Input

```text
Add the busy-office-ui Input to this project.
The text input, with numeric, code and seamless in-cell variants.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<input class="bo-input" name="q" placeholder="Search…">
<input class="bo-input bo-input--numeric" name="amount" value="17329.42">
<input class="bo-input bo-input--code" name="id" value="INV-10234">
<input class="bo-input bo-input--seamless" name="cc" value="CC-4021">
<textarea class="bo-input" name="note"></textarea>

3. No JavaScript required.
4. Values: components/form/input.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Select

```text
Add the busy-office-ui Select to this project.
The native select, restyled with a themed chevron.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<select class="bo-select" name="status">
  <option>All statuses</option>
  <option>Pending</option>
</select>

3. No JavaScript required.
4. Values: components/form/select.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Choice

```text
Add the busy-office-ui Choice to this project.
A checkbox or radio with its label, as one clickable target.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<label class="bo-choice">
  <input type="checkbox" class="bo-checkbox" name="post" checked> Post immediately
</label>
<label class="bo-choice">
  <input type="radio" class="bo-radio" name="terms" value="net30"> Net 30
</label>

3. No JavaScript required.
4. Values: components/form/checkbox-radio.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## FormSection

```text
Add the busy-office-ui FormSection to this project.
A bordered group of fields with an uppercase legend.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<fieldset class="bo-form-section bo-form-section--label-start">
  <legend class="bo-form-section__legend">Header</legend>
  <!-- .bo-form-field children; subgrid aligns every label column -->
</fieldset>

3. No JavaScript required.
4. Values: components/form/form-section.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## FormActions

```text
Add the busy-office-ui FormActions to this project.
The sticky save/cancel strip at the bottom of a record.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-form-actions">
  <button class="bo-btn bo-btn--secondary" type="button">Cancel</button>
  <button class="bo-btn" type="submit">Save</button>
</div>

3. No JavaScript required.
4. Values: components/form/form-field.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Combobox

```text
Add the busy-office-ui Combobox to this project.
Type-ahead picker over a coded ERP list — code, name and a meta column per row.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-combobox">
  <input class="bo-input" role="combobox" aria-expanded="false" aria-controls="cc-list"
         autocomplete="off" name="cc"
         hx-get="/cost-centers" hx-trigger="input changed delay:250ms, search"
         hx-target="#cc-list" hx-swap="innerHTML">
  <ul class="bo-combobox__listbox" id="cc-list" role="listbox" hidden>
    <li class="bo-combobox__option" role="option" aria-selected="false">
      <span class="bo-combobox__option-code">100042</span>
      <span class="bo-combobox__option-label">Acme Supply Co.</span>
      <span class="bo-combobox__option-meta">Net 30</span>
    </li>
  </ul>
</div>
<!-- Options come from the server. initCombobox() owns ARIA + keyboard. -->

3. import { initCombobox } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/combobox/combobox.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## TagInput

```text
Add the busy-office-ui TagInput to this project.
Free-text chips in one field — cost-center lists, approver sets, keywords.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-tag-input">
  <span class="bo-tag-input__tag">CC-4021
    <button class="bo-tag-input__remove" type="button" aria-label="Remove CC-4021">&times;</button>
  </span>
  <input class="bo-tag-input__field" placeholder="Add…">
</div>
<!-- initTagInput() emits bo:tag-add / bo:tag-remove; your app owns the data. -->

3. import { initTagInput } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/tag-input/tag-input.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Quantity

```text
Add the busy-office-ui Quantity to this project.
A quantity with stepper buttons and a unit of measure.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-quantity">
  <button class="bo-btn bo-btn--secondary bo-quantity__step" type="button" aria-label="Decrease">&minus;</button>
  <input class="bo-quantity__input" type="number" name="qty" value="12" step="1">
  <button class="bo-btn bo-btn--secondary bo-quantity__step" type="button" aria-label="Increase">+</button>
  <span class="bo-quantity__unit">PC</span>
</div>

3. import { initQuantity } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/quantity/quantity.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## MoneyInput

```text
Add the busy-office-ui MoneyInput to this project.
An amount and its currency as one joined control.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-money">
  <input class="bo-input bo-money__amount" name="amount" inputmode="decimal" value="17329.42">
  <select class="bo-select bo-money__currency" name="currency" aria-label="Currency">
    <option>USD</option><option>EUR</option>
  </select>
</div>

3. import { initMoneyField } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/money/money.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## FileUpload

```text
Add the busy-office-ui FileUpload to this project.
A dropzone plus the list of what has been attached.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-file-dropzone">
  <span class="bo-file-dropzone__hint">Drop files here, or</span>
  <input type="file" class="bo-file-input" name="files" multiple>
</div>
<ul class="bo-file-list">
  <li class="bo-file-list__item">
    <span class="bo-icon bo-icon--doc" aria-hidden="true"></span>
    <span class="bo-file-list__name">invoice-10234.pdf</span>
    <span class="bo-file-list__size">412 kB</span>
  </li>
</ul>

3. import { initFileDropzone } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/file-upload/file-upload.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Segmented

```text
Add the busy-office-ui Segmented to this project.
A single-choice switch: density, view mode, period.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-segmented" role="group">
  <label class="bo-segmented__option">
    <input class="bo-segmented__input" type="radio" name="density" value="compact" checked> Compact
  </label>
  <label class="bo-segmented__option">
    <input class="bo-segmented__input" type="radio" name="density" value="comfortable"> Comfortable
  </label>
</div>

3. No JavaScript required.
4. Values: components/segmented/segmented.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## DataTable

```text
Add the busy-office-ui DataTable to this project.
The dense ERP table: sticky header, selection, sort, row states and auto-compaction.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-data-table-container" data-any-selected="false">
  <div class="bo-data-table__toolbar">
    <div class="bo-cluster">312 invoices</div>
    <div class="bo-data-table__bulk-actions">
      <span class="bo-data-table__selection-count" aria-live="polite"></span>
      <button class="bo-btn bo-btn--sm bo-btn--secondary" type="submit">Approve</button>
    </div>
  </div>
  <table class="bo-data-table bo-data-table--striped">
    <thead><tr>
      <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all rows"></th>
      <th scope="col" class="bo-data-table__col--code" aria-sort="ascending">
        <button class="bo-data-table__sort-btn" type="button">Invoice #</button>
      </th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th>
    </tr></thead>
    <tbody>
      <tr id="row-INV-10234" data-row-id="INV-10234">
        <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" name="id" value="INV-10234" aria-label="Select INV-10234"></td>
        <td class="bo-data-table__col--code">INV-10234</td>
        <td class="bo-data-table__col--numeric">17,329.42</td>
      </tr>
    </tbody>
  </table>
  <div class="bo-data-table__footer"><!-- .bo-pagination --></div>
</div>
<!-- initDataTables() maintains data-any-selected and the live count.
     Row states: data-row-state="dirty|error|warning" on the <tr>. -->

3. import { initDataTables } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/data-table/data-table.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## TreeTable

```text
Add the busy-office-ui TreeTable to this project.
A hierarchy inside a table — cost-center rollups, BOM explosions, org structures.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<table class="bo-data-table bo-tree-table">
  <tbody>
    <tr data-tree-level="1" aria-expanded="true">
      <td><button class="bo-tree-table__toggle" type="button" aria-label="Collapse Operations">&#9662;</button>Operations</td>
    </tr>
    <tr data-tree-level="2">
      <td><span class="bo-tree-table__spacer" aria-hidden="true"></span>Warehouse</td>
    </tr>
  </tbody>
</table>

3. import { initTreeTable } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/tree-table/tree-table.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Tree

```text
Add the busy-office-ui Tree to this project.
A collapsible hierarchy for navigation — org units, catalogues, folders.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<ul class="bo-tree">
  <li><details class="bo-tree__branch" open>
    <summary class="bo-tree__label">Operations</summary>
    <ul><li><a class="bo-tree__link" href="/ou/warehouse" aria-current="page">Warehouse</a></li></ul>
  </details></li>
</ul>

3. No JavaScript required.
4. Values: components/tree/tree.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Pagination

```text
Add the busy-office-ui Pagination to this project.
Server-side paging for a list report — the framework’s answer instead of virtual scroll.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<nav class="bo-pagination" aria-label="Pagination">
  <a class="bo-pagination__btn" href="?page=1" aria-disabled="true">Previous</a>
  <span class="bo-pagination__info">1–50 of 312</span>
  <a class="bo-pagination__btn" href="?page=2">Next</a>
</nav>

3. No JavaScript required.
4. Values: components/pagination/pagination.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## FilterBar

```text
Add the busy-office-ui FilterBar to this project.
The row of filter controls above a list report.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<form class="bo-filter-bar" action="/pos" method="get">
  <div class="bo-form-field">
    <label class="bo-form-field__label" for="q">Query</label>
    <input class="bo-input bo-input--code" id="q" name="q" value="status:Pending">
  </div>
  <button class="bo-btn" type="submit">Apply</button>
  <a class="bo-btn bo-btn--ghost" href="?q=">Clear</a>
</form>
<!-- initSavedViews() populates these fields FROM the querystring. -->

3. import { initSavedViews } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/filters/filters.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Chip

```text
Add the busy-office-ui Chip to this project.
A saved view, an applied filter, or a removable token.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<nav data-saved-views>
  <a class="bo-chip" href="?q=" aria-current="page">All open · 312</a>
  <a class="bo-chip" href="?q=status:Pending">Pending · 18</a>
</nav>
<!-- An applied filter, removable with no JavaScript at all: -->
<span class="bo-chip bo-chip--active">vendor: Acme Supply Co.
  <a class="bo-chip__remove" href="?q=status:Pending" aria-label="Remove filter vendor">&times;</a>
</span>

3. import { initSavedViews } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/filters/filters.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Amount

```text
Add the busy-office-ui Amount to this project.
A money or quantity figure with quiet currency, decimals and unit.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-amount">
  <span class="bo-amount__currency">$</span>
  <span class="bo-amount__value">17,329<span class="bo-amount__fraction">.42</span></span>
</span>
<span class="bo-amount bo-amount--negative">…</span>
<span class="bo-amount bo-amount--strong">…</span>
<span class="bo-amount"><span class="bo-amount__value">1,240</span><span class="bo-amount__unit">PC</span></span>

3. No JavaScript required.
4. Values: components/amount/amount.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## KeyValue

```text
Add the busy-office-ui KeyValue to this project.
Read-only record facts — the header block of an object page.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<dl class="bo-kv">
  <div><dt>Vendor</dt><dd>Acme Supply Co.</dd></div>
  <div><dt>Due</dt><dd>2026-08-12</dd></div>
</dl>
<!-- .bo-kv--rows aligns every label column with subgrid. -->

3. No JavaScript required.
4. Values: components/kv/kv.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## OrderedList

```text
Add the busy-office-ui OrderedList to this project.
A numbered sequence whose order is data — approval chains, routing steps, line items.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<ol class="bo-ordered-list">
  <li>Cost-center owner
    <span class="bo-ordered-list__actions">
      <button class="bo-btn bo-btn--sm bo-btn--ghost" type="button">Move up</button>
    </span>
  </li>
</ol>

3. No JavaScript required.
4. Values: components/ordered-list/ordered-list.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Calendar

```text
Add the busy-office-ui Calendar to this project.
A month grid for factory calendars, posting periods and closing days.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-calendar">
  <div class="bo-calendar__month">August 2026</div>
  <div class="bo-calendar__grid" role="grid">
    <div class="bo-calendar__dow" aria-hidden="true">Mo</div>
    <div class="bo-calendar__day">1</div>
    <div class="bo-calendar__day" data-day="holiday">15</div>
    <div class="bo-calendar__day bo-calendar__day--outside"></div>
  </div>
</div>

3. No JavaScript required.
4. Values: components/calendar/calendar.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Alert

```text
Add the busy-office-ui Alert to this project.
An inline message about the screen you are on.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-alert bo-alert--warning" role="status">
  <div><strong class="bo-alert__title">Posting period closes today.</strong>
       Invoices posted after 18:00 land in the next period.</div>
  <button class="bo-btn bo-btn--ghost bo-btn--icon bo-btn--sm bo-alert__dismiss" type="button" aria-label="Dismiss">
    <span class="bo-icon bo-icon--close" aria-hidden="true"></span>
  </button>
</div>
<!-- role="alert" on danger, role="status" otherwise. -->

3. import { initAlerts } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/alert/alert.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Toast

```text
Add the busy-office-ui Toast to this project.
The fixed, polite region for transient confirmations.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-toast-region" role="status" aria-live="polite">
  <div class="bo-alert bo-alert--success bo-toast">
    <div><strong class="bo-alert__title">Posted.</strong> INV-10234 posted to period 08/2026.</div>
  </div>
</div>
<!-- A toast is an alert on a raised surface inside the fixed region.
     Server-rendered swaps place it here with hx-swap-oob. -->

3. No JavaScript required.
4. Values: components/alert/alert.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Badge

```text
Add the busy-office-ui Badge to this project.
A status pill that always carries the word, not just the colour.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-badge">Draft</span>
<span class="bo-badge bo-badge--warning">Pending</span>
<span class="bo-badge bo-badge--success">Approved</span>
<span class="bo-badge bo-badge--danger">Rejected</span>
<span class="bo-badge bo-badge--type">Invoice</span>

3. No JavaScript required.
4. Values: components/badge/badge.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Progress

```text
Add the busy-office-ui Progress to this project.
A determinate bar for a long-running ERP job.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<progress class="bo-progress" value="62" max="100" aria-label="Import progress">62%</progress>
<progress class="bo-progress bo-progress--warning" value="91" max="100" aria-label="Budget">91%</progress>

3. No JavaScript required.
4. Values: components/progress/progress.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Skeleton

```text
Add the busy-office-ui Skeleton to this project.
A shimmering placeholder for content that has not arrived.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-skeleton" style="inline-size:12rem" aria-hidden="true"></span>
<span class="bo-skeleton bo-skeleton--block" style="block-size:6rem" aria-hidden="true"></span>
<!-- aria-busy="true" goes on the CONTAINER, not here. -->

3. No JavaScript required.
4. Values: components/skeleton/skeleton.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## StateBlock

```text
Add the busy-office-ui StateBlock to this project.
The empty, no-results and error state for a region or a whole screen.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-state">
  <span class="bo-state__icon bo-icon bo-icon--invoice" aria-hidden="true"></span>
  <h2 class="bo-state__title">No invoices match these filters.</h2>
  <p class="bo-state__description">Clear the cost-center filter to widen the search.</p>
  <div class="bo-state__actions">
    <a class="bo-btn bo-btn--secondary" href="?q=">Clear filters</a>
  </div>
</div>

3. No JavaScript required.
4. Values: components/state/state.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Dialog

```text
Add the busy-office-ui Dialog to this project.
A native modal dialog: header, body and a muted footer action band.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<button class="bo-btn bo-btn--danger-ghost" type="button" popovertarget="reject-dlg">Reject</button>

<dialog class="bo-dialog" id="reject-dlg" popover>
  <header class="bo-dialog__header">
    <h2 class="bo-dialog__title">Reject invoice</h2>
    <button class="bo-btn bo-btn--ghost bo-btn--icon bo-btn--sm" type="button"
            popovertarget="reject-dlg" popovertargetaction="hide" aria-label="Close">
      <span class="bo-icon bo-icon--close" aria-hidden="true"></span>
    </button>
  </header>
  <form hx-post="/pos/PO-88213/reject" hx-target="#main" hx-select="#main">
    <div class="bo-dialog__body"><!-- fields --></div>
    <footer class="bo-dialog__footer">
      <button class="bo-btn bo-btn--secondary" type="button" popovertarget="reject-dlg" popovertargetaction="hide">Cancel</button>
      <button class="bo-btn bo-btn--danger" type="submit">Reject</button>
    </footer>
  </form>
</dialog>
<!-- initDialogs() adds showModal()/::backdrop where the popover attribute
     alone isn't enough. Focus trap and Escape come from the platform. -->

3. import { initDialogs } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/dialog/dialog.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Dropdown

```text
Add the busy-office-ui Dropdown to this project.
A row of actions behind one trigger, using the native popover API.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-dropdown">
  <button class="bo-btn bo-btn--secondary" type="button" popovertarget="views-menu">Views</button>
  <div class="bo-dropdown__menu" id="views-menu" popover>
    <button class="bo-dropdown__item" type="button">
      <span class="bo-icon bo-icon--save" aria-hidden="true"></span>Save this view
    </button>
    <hr class="bo-dropdown__separator">
    <button class="bo-dropdown__item bo-dropdown__item--danger" type="button">Delete view</button>
  </div>
</span>
<!-- popover="auto" gives light dismiss + top-layer stacking.
     initDropdowns() adds positioning and multi-select trigger labels. -->

3. import { initDropdowns } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/dropdown/dropdown.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Navbar

```text
Add the busy-office-ui Navbar to this project.
The application top bar — brand, primary links and account actions.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<header class="bo-navbar">
  <a class="bo-navbar__brand" href="/">Busy Office</a>
  <span class="bo-navbar__spacer"></span>
  <span class="bo-avatar">RK</span>
</header>

3. No JavaScript required.
4. Values: components/navbar/navbar.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## SidebarNav

```text
Add the busy-office-ui SidebarNav to this project.
The 14rem navigation rail, wide enough for a two-word ERP label on one line.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<nav class="bo-sidebar-nav" aria-label="Main">
  <div class="bo-sidebar-nav__section">
    <div class="bo-sidebar-nav__heading">Purchasing</div>
    <ul>
      <li><a class="bo-sidebar-nav__link" href="/pos" aria-current="page">
        <span class="bo-sidebar-nav__icon bo-icon bo-icon--invoice" aria-hidden="true"></span>
        <span class="bo-sidebar-nav__label">Purchase orders</span>
      </a></li>
    </ul>
  </div>
</nav>

3. No JavaScript required.
4. Values: components/sidebar-nav/sidebar-nav.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Breadcrumb

```text
Add the busy-office-ui Breadcrumb to this project.
The trail back up an ERP object hierarchy.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<nav aria-label="Breadcrumb">
  <ol class="bo-breadcrumb">
    <li><a href="/">Purchasing</a></li>
    <li><a href="/pos">Purchase orders</a></li>
    <li><span aria-current="page">PO-88213</span></li>
  </ol>
</nav>

3. No JavaScript required.
4. Values: components/breadcrumb/breadcrumb.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Tabs

```text
Add the busy-office-ui Tabs to this project.
Roving-tabindex tab strip with an overflow edge fade instead of arrow buttons.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-tabs__list" role="tablist">
  <button class="bo-tabs__tab" role="tab" id="tab-items" aria-selected="true"
          aria-controls="panel-items" tabindex="0">Items · 14</button>
  <button class="bo-tabs__tab" role="tab" id="tab-audit" aria-selected="false"
          aria-controls="panel-audit" tabindex="-1">Audit</button>
</div>
<div class="bo-tabs__panel" role="tabpanel" id="panel-items" aria-labelledby="tab-items">…</div>
<!-- initTabs() owns the roving tabindex. Overflow is signalled by
     data-overflow="start|end|both" on the list — an edge fade, not arrows. -->

3. import { initTabs } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/tabs/tabs.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Offcanvas

```text
Add the busy-office-ui Offcanvas to this project.
A side drawer for nav on narrow screens or a record detail beside a list.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<dialog class="bo-offcanvas bo-offcanvas--end" id="detail-panel">
  <header class="bo-offcanvas__header">
    <h2 class="bo-dialog__title">PO-88213</h2>
    <button class="bo-btn bo-btn--ghost bo-btn--icon bo-btn--sm" type="button" aria-label="Close">
      <span class="bo-icon bo-icon--close" aria-hidden="true"></span>
    </button>
  </header>
  <div class="bo-dialog__body">…</div>
</dialog>

3. No JavaScript required.
4. Values: components/offcanvas/offcanvas.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Stepper

```text
Add the busy-office-ui Stepper to this project.
Wizard progress across a multi-step ERP posting flow.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<ol class="bo-stepper">
  <li class="bo-stepper__step" data-state="done">
    <span class="bo-stepper__marker" aria-hidden="true">&check;</span>
    <span class="bo-stepper__label">Header<span class="bo-visually-hidden"> (completed)</span></span>
  </li>
  <li class="bo-stepper__step" aria-current="step">
    <span class="bo-stepper__marker" aria-hidden="true">2</span>
    <span class="bo-stepper__label">Items</span>
  </li>
</ol>

3. import { initWizard } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/stepper/stepper.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## AppShell

```text
Add the busy-office-ui AppShell to this project.
Fixed header + scrolling sidebar and main pane — the back-office chrome every screen sits in.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-app-shell">
  <div class="bo-app-shell__header"><!-- .bo-navbar --></div>
  <div class="bo-app-shell__sidebar"><!-- .bo-sidebar-nav --></div>
  <main class="bo-app-shell__main" id="main"><!-- the swap target --></main>
</div>

3. No JavaScript required.
4. Values: primitives/sidebar-layout.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Stack

```text
Add the busy-office-ui Stack to this project.
Vertical rhythm primitive — owns the gap between stacked children.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-stack">…</div>
<div class="bo-stack bo-stack--tight">…</div>

3. No JavaScript required.
4. Values: primitives/stack.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Cluster

```text
Add the busy-office-ui Cluster to this project.
Horizontal row primitive that wraps, with end and split distributions.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-cluster bo-cluster--split">
  <h1>Invoices</h1>
  <a class="bo-btn" href="/pos/new">+ New invoice</a>
</div>

3. No JavaScript required.
4. Values: primitives/cluster.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Grid

```text
Add the busy-office-ui Grid to this project.
Auto-fitting equal-width column grid.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-grid" style="--bo-grid-min: 18rem">…</div>

3. No JavaScript required.
4. Values: primitives/grid.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## WidgetGrid

```text
Add the busy-office-ui WidgetGrid to this project.
The dashboard canvas — a named container grid of widgets.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-widget-grid" style="--bo-widget-min: 20rem">
  <!-- .bo-widget children; --span-2 collapses under 41rem of grid width -->
</div>

3. No JavaScript required.
4. Values: components/dashboard/dashboard.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Widget

```text
Add the busy-office-ui Widget to this project.
A dashboard panel: bordered surface with an optional header, flush body and footer band.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<section class="bo-widget">
  <header class="bo-widget__header">
    <h3 class="bo-widget__title">Approvals waiting</h3>
    <a class="bo-btn bo-btn--sm bo-btn--ghost" href="/pos">View all</a>
  </header>
  <div class="bo-widget__body bo-widget__body--flush"><!-- a table --></div>
  <footer class="bo-widget__band bo-widget__band--msg">Updated 4 minutes ago</footer>
</section>

3. import { initCollapsibleCards } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/dashboard/dashboard.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Stat

```text
Add the busy-office-ui Stat to this project.
A single KPI figure with an optional two-channel delta.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-stat">
  <span class="bo-stat__label">Awaiting approval</span>
  <span class="bo-stat__value">312</span>
  <span class="bo-stat__delta bo-stat__delta--bad">
    <span aria-hidden="true">&#9660;</span>18 more than last week
  </span>
</div>

3. No JavaScript required.
4. Values: components/dashboard/dashboard.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Timeline

```text
Add the busy-office-ui Timeline to this project.
The approval chain of a document — who has signed, who is next, who refused.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<ol class="bo-timeline">
  <li class="bo-timeline__step" data-state="done">
    <span class="bo-timeline__marker" aria-hidden="true">&check;</span>
    <div>
      <div class="bo-timeline__title">Cost-center owner<span class="bo-visually-hidden"> — done</span></div>
      <div class="bo-timeline__meta">R. Køhler · 2026-08-11 09:14</div>
    </div>
  </li>
</ol>

3. No JavaScript required.
4. Values: components/approval-workflow/approval-workflow.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## AuditTrail

```text
Add the busy-office-ui AuditTrail to this project.
The immutable who-did-what-when log beneath a document.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<ol class="bo-audit">
  <li class="bo-audit__entry">
    <span class="bo-audit__actor">R. Køhler</span>
    <span class="bo-audit__detail">changed cost center CC-4021 → CC-1180</span>
    <time class="bo-audit__time" datetime="2026-08-11T09:14">09:14</time>
  </li>
</ol>

3. No JavaScript required.
4. Values: components/approval-workflow/approval-workflow.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Byline

```text
Add the busy-office-ui Byline to this project.
Actor plus context on one line — "R. Køhler approved · 2 hours ago".

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-byline">
  <span class="bo-avatar bo-byline__avatar" aria-hidden="true">RK</span>
  <strong>R. Køhler</strong> approved · 2 hours ago
</span>

3. No JavaScript required.
4. Values: components/byline/byline.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Avatar

```text
Add the busy-office-ui Avatar to this project.
A person or organisation mark — initials, or an image when you have one.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<span class="bo-avatar">RK</span>
<span class="bo-avatar-stack">
  <span class="bo-avatar">RK</span><span class="bo-avatar">MB</span>
</span>

3. No JavaScript required.
4. Values: components/avatar/avatar.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## ScanInput

```text
Add the busy-office-ui ScanInput to this project.
A barcode capture field with a full-viewport flash the user can read in peripheral vision.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-form-field">
  <label class="bo-form-field__label" for="scan">Scan material</label>
  <input class="bo-input bo-input--code" id="scan" name="code" autocomplete="off" inputmode="none">
</div>
<p data-scan-status role="status" aria-live="polite">SKU-88213 accepted · 4 of 12</p>
<!-- initScanInput() reads the scanner's Enter and calls flashScanResult().
     Accepted vs rejected is carried by the frame's MASS (6px solid vs 18px
     double), not the hue — peripheral vision reads mass before colour. -->

3. import { initScanInput } from '@busy-office/ui' and call it once per page; swapped-in content is picked up by delegation.
4. Values: components/scan/scan.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

## Prose

```text
Add the busy-office-ui Prose to this project.
Long-form documentation copy — the only place a reading measure applies.

1. Link the framework stylesheet once: <link rel="stylesheet" href="styles/busy-office/styles.css"> (source: styles.css).
2. Use this markup exactly — do not restyle it, do not wrap it in a React component:

<div class="bo-prose">
  <h2>Posting rules</h2>
  <p>An invoice posts to the period…</p>
</div>
<!-- Documentation only. ~70ch measure; never for application screens. -->

3. No JavaScript required.
4. Values: components/prose/prose.css. Semantic tokens only (--bo-color-*, --bo-space-*, --bo-density-*), never --bo-palette-*.
5. Every state signal needs a word or glyph AND an ARIA/data attribute — never colour alone.
```

