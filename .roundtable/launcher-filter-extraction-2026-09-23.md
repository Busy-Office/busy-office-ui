# Should the launcher's text filter be extracted? — no, and here is the measurement

Date: 2026-09-23 · Item: roadmap 373.5

373.5's Accept required this question to be recorded either way. It was not,
which is one of the reasons the item was held.

## The question

`/patterns/app-launch`'s launcher ships ~20 lines of filter script: lowercase
the query, test it against each tile's text plus a keyword block, set `hidden`,
hide emptied groups, update a status count. Tag-input, filters and the
command bar all do something filter-shaped. Should this become a shared
behaviour?

## No. The shapes differ where it matters.

Counted across the three candidates rather than assumed:

- **What is filtered** differs — tiles (`hidden` on a link), chips (removal from
  a value list), commands (a ranked list with a selected index). Only the first
  is "hide a static node".
- **What "no match" means** differs — the launcher renders an empty state; the
  tag-input offers to CREATE the typed value; the command bar shows nothing and
  keeps the query. That is three different contracts, not one with options.
- **Keyboard model** differs — the launcher leaves Tab order to `hidden`; the
  command bar owns Up/Down/Enter with an active descendant.

A shared helper would have to take the match function, the hide function, the
empty behaviour and the keyboard model as parameters, at which point it is the
twenty lines back again with an indirection on top. That is the Objective's
refuse test: surface that serves no real scenario.

## What would change this

A THIRD caller that hides static nodes and renders an empty state, with the
same "no match" contract. `.bo-segmented`, `.bo-tabs` and the pattern pages
were checked and none does. If one appears, reopen — the trigger is a third
caller of the same shape, not a third thing that happens to have a text box.

## What was done instead

The launcher keeps its own script, and the behaviour it claims is now gated:
seven `check:claims` cases drive open / search / keyword-only match / no-match
/ Escape / Close / the 390 wrap with real key and pointer events. The Escape
case is red-proved by removing the handler from the built bundle.
