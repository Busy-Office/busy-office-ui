/**
 * Drag-and-drop convenience for a `.bo-file-dropzone`. The file INPUT itself
 * already works without this — native file inputs accept a drop in every
 * evergreen browser and open the OS picker on click/Enter/Space with zero
 * JS. What this adds is purely the visual affordance (a highlighted
 * dropzone while dragging over it) and forwarding a drop anywhere in the
 * zone — not just the small native input — into the input's FileList, so
 * `<input>`'s own `change` listeners (yours) still fire exactly as if the
 * user had picked the files via the dialog.
 *
 * Markup contract:
 *   <label class="bo-file-dropzone" data-file-dropzone>
 *     <input class="bo-file-input bo-visually-hidden" type="file" multiple>
 *     …visible hint text…
 *   </label>
 *
 * This behavior never reads file contents, uploads anything, or renders a
 * file list — that's your code, same "framework does visuals, you do the
 * data" split as every other field component here.
 */
let installed = false;

function inputFor(zone: HTMLElement): HTMLInputElement | null {
  return zone.querySelector<HTMLInputElement>('input[type="file"]');
}

export function initFileDropzone(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('dragover', (e) => {
    const zone = (e.target as Element | null)?.closest<HTMLElement>('[data-file-dropzone]');
    if (!zone) return;
    e.preventDefault(); // required for `drop` to fire at all
    zone.dataset.dragover = 'true';
  });

  document.addEventListener('dragleave', (e) => {
    const zone = (e.target as Element | null)?.closest<HTMLElement>('[data-file-dropzone]');
    if (!zone) return;
    // A dragleave on a CHILD (moving between the hint text and the input)
    // isn't leaving the zone — only clear the state once the pointer is
    // actually outside the zone's own box.
    if (zone.contains(e.relatedTarget as Node | null)) return;
    delete zone.dataset.dragover;
  });

  document.addEventListener('drop', (e) => {
    const zone = (e.target as Element | null)?.closest<HTMLElement>('[data-file-dropzone]');
    if (!zone) return;
    e.preventDefault();
    delete zone.dataset.dragover;
    const input = inputFor(zone);
    const files = e.dataTransfer?.files;
    if (!input || !files || !files.length) return;
    input.files = files;
    // Programmatic assignment fires no native `change` — dispatch a real one
    // so any listener wired the normal way (input.addEventListener('change',
    // …)) sees a drop exactly like a dialog-picked file, per this file's own
    // "no special API, just make the native input's own events fire" goal.
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
