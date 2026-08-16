// Build-time parser for the shipped semantic tier (tokens/color.css).
// Standardize 2026-08-16: /base/tokens and /base/colors each grew their
// own copy of the read/strip/split logic — two parsers over one file is
// exactly the drift class the Slice 22 grill flagged, so this is now the
// single reader. Frontmatter-only (node:fs — never ships to the client).
import { readFileSync } from 'node:fs';

const css = readFileSync(
  new URL('../../../../packages/core/src/css/tokens/color.css', import.meta.url),
  'utf8',
).replace(/\/\*[\s\S]*?\*\//g, '');

const darkAt = css.indexOf('[data-theme="dark"]');
if (darkAt === -1) throw new Error('semantic-css: color.css lost its dark block');

/** Light scope: :root plus the [data-theme="light"] remap. */
export const lightBlock = css.slice(0, darkAt);
/** Dark scope: the [data-theme="dark"] remap only. */
export const darkBlock = css.slice(darkAt);

export function parseVars(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/(--bo-color-[a-z-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

export const lightVars = parseVars(lightBlock);
/** Dark resolution = light values with the dark remap layered on top. */
export const darkVars = { ...lightVars, ...parseVars(darkBlock) };

/** step ("gray-200") → semantic tokens consuming it ("border-default",
 *  "dark text-secondary"), across both theme scopes. */
export function usedByMap(): Record<string, string[]> {
  const usedBy: Record<string, string[]> = {};
  for (const [scope, block] of [['', lightBlock], ['dark ', darkBlock]] as const) {
    for (const m of block.matchAll(/(--bo-color-[a-z-]+):\s*var\(--bo-palette-([a-z]+-\d+)\)/g))
      (usedBy[m[2]] ??= []).push(scope + m[1].replace('--bo-color-', ''));
  }
  if (Object.keys(usedBy).length === 0)
    throw new Error('semantic-css: parsed zero palette references from color.css');
  return usedBy;
}
