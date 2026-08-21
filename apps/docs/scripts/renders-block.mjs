/**
 * Does a page's markup render a component block — as itself, a part, or a
 * modifier? ONE detector, shared.
 *
 * Extracted 2026-08-21 (Standardize sweep): component-scores.mjs carried an
 * inline copy of this regex WITHOUT the escaping, and importing it straight
 * from check-components-used.mjs runs that whole gate as an import side
 * effect — the same shape wrong-choice-rule.mjs was extracted for (98.1).
 * The self-test cases stay in check-components-used's --self-test branch,
 * which exercises this import.
 */
export function rendersBlock(markup, block) {
  const b = block.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (
    new RegExp(`class="[^"]*\\b${b}(?![a-z0-9-])`).test(markup) ||
    new RegExp(`class="[^"]*\\b${b}(__|--)`).test(markup)
  );
}
