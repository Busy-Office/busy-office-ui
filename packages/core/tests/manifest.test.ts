import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('behaviors manifest (generated)', () => {
  it('lists exactly the runtime exports and counts init* correctly', async () => {
    // @ts-expect-error — generated artifact
    const manifest = (await import('../dist/behaviors.json')).default;
    const runtimeExports = Object.keys(ui).sort();
    expect(manifest.exports).toEqual(runtimeExports);
    expect(manifest.initCount).toBe(runtimeExports.filter((n) => n.startsWith('init')).length);
  });
});
