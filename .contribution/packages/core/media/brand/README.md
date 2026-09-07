# Assets

## Logo — "Tall BO" (direction 5a)

Two condensed letters filling the 24-grid height, drawn as strokes in the same
grammar as the shipped icon set: 24-grid, stroke 2, round caps and joins. The B
has a smaller top bowl and a larger bottom one; the O is a stadium tall enough
to read as a ledger zero. Chosen 2026-09-06 from `brand/logo-directions.html`.

| File | Use |
|---|---|
| `logo.svg` | Primary mark, teal-700 (`#0f766e`) on light surfaces. |
| `logo-dark.svg` | teal-400 (`#2dd4bf`) for dark surfaces. |
| `logo-mono.svg` | `currentColor` — inherits ink; use inline or via `--bo-icon-src`. |
| `favicon.svg` | Letters in white on the teal tile (direction 5b), for favicon and app icon where a bare mark has no ground. |
| `lockup.svg` | Mark + "Busy Office" wordmark. The wordmark is live `<text>` in the system stack, matching `--bo-font-sans`; outline it to paths if it must render identically off-platform. |

Rules: never recolour outside the accent tokens; never scale below 16px; never
add a drop shadow or gradient. Clear space is one stroke width (2 units on the
24 grid) on every side. On the teal tile the mark is white, never teal-400.

The mark is also usable as a `.bo-icon`:

```html
<span class="bo-icon" role="img" aria-label="Busy Office" style="--bo-icon-src: url('assets/logo-mono.svg')"></span>
```

`list-report-compact.png` is the one product screenshot in the source
repository, used as the fidelity reference for the list report.
