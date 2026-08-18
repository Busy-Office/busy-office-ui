# Learning-path walk — 2026-08-19 (roadmap 39.2)

Owner: *"The document should make the first impression. Make user feel that it is
not difficult to learn. Make it a flawless journey to walk through."*

"Flawless journey" is not gate-able as written, so 39.2 turned it into two gates
and this walk. The walk exists because a finding of "nothing wrong" is only
credible if someone can see what was looked at.

Path walked in sidebar order: 7 Getting-started pages, then 11 Core-concepts
pages. 18 in total.

---

## 1. Result before code — GATED, and it guards one page

`check:learning-path` asserts that a page pairing previews with code leads with
the preview. It currently guards **1 of 18 pages**, and that number is the
finding.

**Only `/getting-started/first-screen` uses a live `Demo` at all.** The other 17
explain with prose and code blocks and never show the thing working. The owner's
complaint was about one page; the shape is site-wide.

That is deliberately **not** "fix" by sprinkling demos. Several of these pages
are correctly code-first — `/getting-started/installation` opens with `npm i`
because installation *is* a command; `/concepts/cascade` opens with CSS because
the subject *is* CSS. Forcing a widget above those would be decoration, which
the charter calls failure rather than capability.

→ Queued as **42.1**, framed as a question per page rather than a blanket rule.

## 2. Dead ends — GATED, none found

Every one of the 18 links onward into getting-started, concepts, components or
patterns. No reader reaches the bottom of a page with nowhere to go.

## 3. Terms used before they are defined — WALKED, 3 real gaps, all fixed

Eight framework terms were traced to their first use on the path:

| term | first met on | explained on | linked at first use? |
|---|---|---|---|
| `@layer` | installation | concepts/cascade | yes |
| behavior | installation | concepts/js-behaviors | yes |
| unlayered | troubleshooting | concepts/cascade | yes |
| container query | concepts/density | concepts/container-queries | yes |
| **density** | installation | concepts/density | **NO → fixed** |
| **token** | installation | concepts/tokens | **NO → fixed** |
| **two-channel** | ai-assistants | concepts/accessibility | **NO → fixed** |

Every term is used before its own page — which is fine and unavoidable; the
installation skeleton cannot avoid writing `data-density="comfortable"`. What
matters is whether the first mention links to the explanation. Three did not,
all on the first pages a newcomer opens. Installation's opener now names tokens
and density with links; the AI-assistants page now states the two-channel rule
and links the accessibility model.

**This was built as a gate first, and the gate was removed.** Every scoping
over-enforced: page-wide it demanded a link from a passing mention of "density"
in a changelog, and the honest version needs the sidebar's page ORDER, which
would bake docs IA into a build gate. A walk read by a human beat a rule applied
by a machine here.

---

## Method note — four detectors were wrong before one worked

Worth recording, because the failure mode is the one the Slices 31-40 grill named
(instruments lying) and it happened four times in one item:

1. `class="demo"` as the "rendered" signal — every section on these pages is
   `<section class="demo">`, including code-only ones. Passed 18/18.
2. First `bo-*` after `<main` — the slice starts *at*
   `<main class="bo-app-shell__main">`, which matches. Passed 18/18.
3. First non-chrome `bo-*` — reported the identical offset (536) on all 18 pages:
   the docs shell's own mobile menu button, a real `.bo-btn` inside main.
   Passed 18/18.
4. Any non-utility `bo-*` in the content region — counted Related-footer badges
   and prose lists as "results", so it flagged 10 pages including ones that are
   correctly code-first.

Only `.demo-pair__preview` discriminates, because it exists solely where an
author deliberately paired a preview with code. The gate now ships a
`--self-test` that runs it against three synthetic pages — code-first,
result-first, and code-only — and fails if it cannot tell them apart. A detector
this easy to get wrong needs to prove it can fail.
