/**
 * Grouped display for numeric inputs — thousands separators via
 * `Intl.NumberFormat`, formatted ON BLUR, never while typing (123.1: what
 * Reckon ships, what SAP's own guidance steers to after live reformatting
 * broke locale decimal entry, what GOV.UK's number-input research backs;
 * live-as-you-type was refused with the evidence in
 * .roundtable/research-numeric-masking-2026-08-23.md). Opt-in per input
 * with `data-grouped`; call initGroupedNumber() once.
 *
 * Markup contract (composes with .bo-money / .bo-quantity / plain inputs):
 *   <input class="bo-input bo-input--numeric" type="number" step="0.01"
 *          name="amount" value="1234567.5" data-grouped
 *          data-locale="en-US" aria-label="Amount" />
 *
 * On upgrade (at init, or on first focus for content swapped in later):
 *   - `type="number"` becomes `type="text" inputmode="decimal"` — a number
 *     input cannot display grouping at all (WHATWG leaves locale display
 *     to the browser and none ships it).
 *   - the `name` moves to a generated hidden input that always carries the
 *     RAW machine value ("1234567.50"), so the server never parses a
 *     grouped string — the universal shape across every product studied.
 *   - the visible value shows the grouped display ("1,234,567.50").
 * Focus shows the raw value for caret-honest editing; blur re-parses
 * locale-aware (both "1234.5" and a comma-decimal "1234,5" under de) and
 * re-renders. Paste needs no special path: blur is the single parse point.
 * The lossless contract holds throughout: grouping and zero-padding only —
 * a value the precision cannot represent (12.4 at 0 decimals) keeps its
 * own decimals and is never rounded. No-JS: the field stays a native
 * number input — correct, just ungrouped.
 *
 * Decimals source: `data-decimals` on the input, else the step's own
 * precision (shared parser with money/quantity). Locale source:
 * `data-locale` on the input, else the document's `lang`, else en-US —
 * explicit, never the browser default (Indian en-IN groups 12,34,567,
 * which an every-3-digits rule cannot produce).
 */
import {
  parseDecimalsAttr, stepDecimals, valueDecimals, stepAttrFor, losslessFixed, setInputDecimals,
} from '../utils/decimal-input.js';

let installed = false;

interface GroupedState {
  raw: string; // the machine value ('' when empty or unparseable)
  hidden: HTMLInputElement | null;
}

const state = new WeakMap<HTMLInputElement, GroupedState>();

function locale(input: HTMLInputElement): string {
  return input.dataset.locale || document.documentElement.lang || 'en-US';
}

function decimals(input: HTMLInputElement): number | null {
  return parseDecimalsAttr(input.dataset.decimals) ?? stepDecimals(input);
}

const fmtCache = new Map<string, Intl.NumberFormat>();
function formatter(loc: string, d: number): Intl.NumberFormat {
  const key = `${loc}|${d}`;
  let f = fmtCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(loc, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
      useGrouping: true,
    });
    fmtCache.set(key, f);
  }
  return f;
}

const sepCache = new Map<string, { group: string; decimal: string }>();
function separators(loc: string): { group: string; decimal: string } {
  let s = sepCache.get(loc);
  if (!s) {
    const parts = new Intl.NumberFormat(loc, { useGrouping: true }).formatToParts(12345.6);
    s = {
      group: parts.find((p) => p.type === 'group')?.value ?? ',',
      decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
    };
    sepCache.set(loc, s);
  }
  return s;
}

/** Grouped display for a raw value string — LOSSLESS ONLY: pad/trim to the
 *  target decimals when numerically identical, else keep the value's own
 *  decimal places so nothing is ever rounded (the setInputDecimals rule). */
function groupedDisplay(raw: string, loc: string, d: number | null): string {
  if (raw === '') return '';
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER) return raw;
  // Shared lossless rule: the target precision only when it represents the
  // value exactly, else the value's own places — never a rounded display.
  const target = d !== null && losslessFixed(raw, d) !== null ? d : valueDecimals(raw);
  return formatter(loc, target).format(n);
}

/** Canonical raw form: pad/trim to the decimals when lossless (1250 →
 *  "1250.00" at 2), else the value exactly as given — the shared rule. */
function canonicalRaw(raw: string, d: number | null): string {
  if (raw === '' || d === null) return raw;
  return losslessFixed(raw, d) ?? raw;
}

/**
 * Locale-aware parse of user-typed text. Group separators (plus the
 * space family, which is never a decimal mark) are stripped; the locale
 * decimal separator maps to ".". One deliberate heuristic guards the
 * classic trap: under a locale whose GROUP separator is "." (de-DE),
 * "1.5" typed by a user means one-point-five — a lone separator NOT
 * followed by exactly three digits cannot be grouping, so it is read as
 * a decimal mark regardless of locale. "1.234" stays 1234 there, as a
 * German reader intends. Returns null when the text is not a number.
 */
export function parseLocaleNumber(text: string, loc: string): number | null {
  const { group, decimal } = separators(loc);
  // The whole space family (NBSP, narrow NBSP, thin space - fr/sv group
  // separators) is stripped up front: no locale uses a space as a decimal
  // mark, and \s covers the Unicode space separators.
  let t = text.trim().replace(/\s/g, '');
  if (t === '') return null;
  const hasGroup = !/\s/.test(group) && t.includes(group);
  const hasDecimal = decimal !== group && t.includes(decimal);
  if (hasGroup && hasDecimal) {
    t = t.split(group).join('');
    t = t.replace(decimal, '.');
  } else if (hasGroup) {
    // Only the group separator present: real grouping means every use is
    // followed by exactly three digits; anything else is a decimal mark.
    const parts = t.split(group);
    const isGrouping = parts.length > 1 && parts.slice(1).every((p) => /^\d{3}$/.test(p));
    t = isGrouping ? parts.join('') : parts.join('.');
  } else if (hasDecimal) {
    t = t.replace(decimal, '.');
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function render(input: HTMLInputElement): void {
  const s = state.get(input);
  if (!s) return;
  const d = decimals(input);
  s.raw = canonicalRaw(s.raw, d);
  input.value = groupedDisplay(s.raw, locale(input), d);
  if (s.hidden) s.hidden.value = Number.isFinite(Number(s.raw)) ? s.raw : '';
}

function upgrade(input: HTMLInputElement): void {
  if (state.has(input)) return;
  const s: GroupedState = { raw: input.value, hidden: null };
  if (input.name) {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = input.name;
    input.removeAttribute('name');
    input.after(hidden);
    s.hidden = hidden;
  }
  if (input.type === 'number') {
    input.type = 'text';
    input.inputMode = 'decimal';
  }
  state.set(input, s);
  render(input);
}

/** True once an input has been upgraded to grouped display. */
export function isGrouped(input: HTMLInputElement): boolean {
  return state.has(input);
}

/** The machine value of any numeric input, grouped or not — the ONE way
 *  other behaviors (quantity steppers, money reformat) should read it. */
export function numericInputValue(input: HTMLInputElement): number | null {
  const s = state.get(input);
  const raw = s ? s.raw : input.value;
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Set a grouped input's raw value programmatically (steppers). Renders
 *  the grouped display; dispatches nothing — the caller owns events. */
export function setGroupedValue(input: HTMLInputElement, raw: string): void {
  const s = state.get(input);
  if (!s) {
    input.value = raw;
    return;
  }
  s.raw = raw;
  render(input);
}

/** Grouped counterpart of setInputDecimals: update step and re-render the
 *  display at the new precision, LOSSLESSLY ONLY — same contract, operating
 *  on the raw value instead of the visible text. Dispatches a bubbling
 *  `input` event when the machine value changed (pad/trim), so dirty
 *  tracking sees it — the same rule setInputDecimals follows. */
export function setGroupedDecimals(input: HTMLInputElement, d: number): void {
  input.step = stepAttrFor(d);
  const s = state.get(input);
  if (!s) return;
  const before = s.hidden ? s.hidden.value : s.raw;
  render(input);
  const after = s.hidden ? s.hidden.value : s.raw;
  if (after !== before) input.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Re-derive an input's precision, grouped or not — the ONE call other
 *  behaviors make so the isGrouped branch is not copied at each site.
 *  Deliberately NOT re-exported from index.ts: internal composition, not
 *  public API. */
export function applyDecimals(input: HTMLInputElement, d: number): void {
  if (state.has(input)) setGroupedDecimals(input, d);
  else setInputDecimals(input, d);
}

export function initGroupedNumber(): void {
  if (installed) return;
  installed = true;

  document.querySelectorAll<HTMLInputElement>('input[data-grouped]').forEach(upgrade);

  // Late-swapped content (htmx) upgrades on first focus; the display is
  // grouped from that point on. Before it, the field is a plain native
  // number input submitting its raw value — correct either way.
  document.addEventListener('focusin', (e) => {
    const input = (e.target as Element | null)?.closest?.<HTMLInputElement>('input[data-grouped]');
    if (!input) return;
    upgrade(input);
    const s = state.get(input)!;
    input.value = s.raw; // raw for editing — the caret works on what it sees
    /* Select it. The swap above destroys any selection the pointer gesture
       was building (triple-click landed on text that no longer exists), so
       without this, select-and-retype APPENDS instead of replacing — found
       by the 0.4.0 dogfood driving po-app's real edit form, where the
       stray concatenation then parsed to an empty hidden value and a 422.
       Select-all-on-focus is also the amount-field convention AutoNumeric
       and spreadsheets follow: an amount is usually replaced, not edited
       mid-string. */
    input.select();
  });

  /* Form reset (a row-edit Cancel is a type=reset button): the browser
     restores the VISIBLE input to its value ATTRIBUTE — the raw, ungrouped
     server-rendered default — and wipes the JS-created hidden input to ''
     (it has no value attribute to restore). Left alone, that is a blurred
     field showing an ungrouped number over an EMPTY submission value, with
     row-edit's dirty state still set — three desyncs from one gesture
     (0.4.0 dogfood). The reset event fires BEFORE defaults are applied, so
     re-sync happens in a microtask after; the input event lets dirty
     tracking clear the same way every other programmatic reformat does. */
  document.addEventListener('reset', (e) => {
    const form = e.target as HTMLFormElement | null;
    if (!form?.querySelectorAll) return;
    const grouped = [...form.querySelectorAll<HTMLInputElement>('input[data-grouped]')]
      .filter((i) => state.has(i));
    if (!grouped.length) return;
    setTimeout(() => {
      for (const input of grouped) {
        const s = state.get(input)!;
        s.raw = input.defaultValue;
        render(input);
        /* SILENT on purpose — no input dispatch. A native reset never fires
           input, and row-edit clears its dirty rows from its own reset
           listener; dispatching here re-marked the row dirty right after
           row-edit had cleared it (two setTimeout(0) handlers, ours last —
           found E2E in the po-app dogfood, reproduced as the composition
           test below). Reset means "back to default", which is the one
           programmatic change dirty-tracking must NOT hear as an edit. */
      }
    }, 0);
  });

  document.addEventListener('focusout', (e) => {
    const input = (e.target as Element | null)?.closest?.<HTMLInputElement>('input[data-grouped]');
    if (!input) return;
    const s = state.get(input);
    if (!s) return;
    const typed = input.value;
    const n = parseLocaleNumber(typed, locale(input));
    if (typed.trim() === '') {
      s.raw = '';
    } else if (n === null) {
      // Not a number: keep the text for correction, submit '' (what a
      // native number input does with garbage), let the server judge.
      s.raw = typed;
      if (s.hidden) s.hidden.value = '';
      return;
    } else {
      s.raw = String(n);
    }
    const before = s.hidden ? s.hidden.value : '';
    render(input);
    const after = s.hidden ? s.hidden.value : s.raw;
    if (s.hidden && after !== before) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}
