# Research: ERP numeric-input masking best practice (for 123.1 / 122.1)

Commissioned 2026-08-23 after the owner's scope answer ("yes — Money AND
plain numeric/Quantity") and their ask: "what is best practise in other ERP
software?" One research agent, web evidence, URLs inline. This feeds the
122.1 grill — it does not decide it.

## (a) What the majority of ERP products actually do

Evidence converges on **on-blur formatting, not live-as-you-type masking**,
as the dominant pattern in real accounting/ERP software:

- **Reckon's Balance Design System** (an actual accounting-software vendor,
  direct Xero/QuickBooks competitor) — its Currency Input component
  explicitly "formats values when the input is blurred," keeps precision
  configurable via `Intl.NumberFormat`, and treats the typed value as a
  plain number until then. https://balance.reckon.com/package/currency-input/
- **SAP Fiori/SAPUI5** — `sap.ui.model.type.Currency` formats for
  *display/binding*, but developer community reports repeatedly show
  `valueLiveUpdate="true"` (formatting/validating on every keystroke)
  breaking decimal entry across locales — typing "," vs "." empties the
  field depending on locale. SAP's own recommended workaround is custom
  `liveChange` validation rather than reformatting mid-type.
  https://github.com/UI5/webcomponents/issues/1637
- **QuickBooks / Xero / NetSuite import & API layers** all reject thousands
  separators in the raw value — the *display* string (with commas) and the
  *submitted/stored* string (plain digits) are strictly different things,
  never round-tripped through the same field.
- **GOV.UK Design System** doesn't mask numbers live either — its
  number-input redesign moved *away* from `type="number"` toward plain
  `type="text" inputmode="numeric"/"decimal"`, because browser-native
  number handling (including locale/grouping display) is unreliable.
  https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers-technology-in-government/
- Odoo's monetary widget derives decimal precision from the currency
  record, but no clear public evidence on its live-vs-blur behavior —
  flagged as a gap, not a data point either way.

Where live-as-you-type masking *does* exist in the wild, it's concentrated
in **fintech-style calculator inputs** (Stripe-style amount entry, POS
apps) that sidestep the hard problem entirely by filling digits
right-to-left as cents, caret permanently pinned at the end — never
mid-string editing. It shows up as a recurring feature request against
react-number-format (issue #366), not as a default behavior.

## (b) Recommendation for a CSS-first, progressive-enhancement framework

1. **Baseline (no JS):** `<input type="text" inputmode="decimal">`, never
   `type="number"`. `type="number"` can't show grouping, rejects valid
   decimals in comma-locales, and has undefined locale behavior per WHATWG
   ("browsers are permitted... to display numbers using locale-specific
   formatting" while `value` stays dot-separated).
   https://html.spec.whatwg.org/multipage/input.html
2. **Optional JS behavior layer: format on blur** — uxpatterns.dev's
   explicit rule ("Don't reformat the value while the user is actively
   typing — format on blur") and Reckon's shipped component. Low-risk
   default wherever users edit mid-string.
3. **If true live masking is wanted anyway**, it's achievable but not
   free: AutoNumeric and react-number-format ship non-trivial
   caret-preservation machinery (`getCaretBoundary`: an n+1-length array
   marking every legal caret slot) because naive reformatting breaks the
   caret — Cleave.js's still-open issue #298 shows the failure (deleting a
   digit before the decimal jumps the caret and starts overwriting
   decimals). Budget for one of: (i) the calculator/fill-from-right
   pattern (caret always at end — no jump problem by construction), or
   (ii) a real boundary-tracking algorithm for mid-string editing.

## (c) Decisions that must be made regardless of approach

1. **Caret strategy** — evidence favors caret-pinned-at-end
   (fill-from-right) if live masking; mid-string editing needs a real
   position-boundary algorithm, not regex reformatting.
2. **Locale source** — `Intl.NumberFormat` with an **explicit** locale,
   never the browser default. Indian lakh/crore groups 3-then-2-then-2
   (`12,34,567`), which a hardcoded every-3-digits rule cannot produce.
3. **Paste** — a separate code path: strip all formatting, re-parse from
   scratch; don't feed pasted text through keystroke logic.
4. **Submission vs display value** — universal across every source:
   store/submit a clean unformatted number, decoupled from the display
   string; a hidden input carrying the raw value beside the visible
   masked field is the standard shape.
5. **Screen readers** re-announce changed text content; per-keystroke
   reformatting risks verbose repeated announcements — another point for
   format-on-blur, which changes the DOM text once.
