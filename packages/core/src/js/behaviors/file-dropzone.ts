/**
 * Drag-and-drop convenience for a `.bo-file-dropzone`. The file INPUT itself
 * opens the OS picker on click/Enter/Space with zero JS, and a NATIVE,
 * VISIBLE file input is its own drop target in every evergreen browser.
 * What this adds is the visual affordance (a highlighted dropzone while
 * dragging over it) and forwarding a drop anywhere in the zone — not just
 * the small native input — into the input's FileList, so `<input>`'s own
 * listeners (yours) still fire exactly as if the user had picked the files
 * via the dialog.
 *
 * Markup contract:
 *   <label class="bo-file-dropzone" data-file-dropzone>
 *     <input class="bo-file-input bo-visually-hidden" type="file" multiple>
 *     …visible hint text…
 *   </label>
 *
 * **The documented markup hides the input, so this behavior is what makes
 * the box a drop target at all** (roadmap 373.1, measured with trusted
 * drops): `bo-visually-hidden` clips the input to 1px, and a drop on the
 * label lands on the page, not the control — the browser then opens the
 * file in a new tab. Ship the script with the zone, or show the input.
 *
 * **A forwarded drop is never more permissive than the same drop on the
 * plain input would be.** Measured against a native control in the same
 * run, not assumed: a disabled input refuses the drop, and so does a
 * non-`multiple` input handed more than one file — Chrome refuses that
 * whole drop rather than taking the first, and matching the platform beats
 * silently discarding files. A drag carrying no files is not advertised as
 * droppable at all. In each refusing case the drag operation is set to
 * `none`, which is what draws the no-drop cursor AND stops the browser
 * navigating to the dropped file.
 *
 * `accept` is NOT enforced here, because the platform does not enforce it
 * on a drop either — a native input with `accept=".pdf"` takes a dropped
 * `.exe` (measured). Treat it as a picker filter, and validate `input.files`
 * yourself; this behavior never makes the forwarded drop stricter than the
 * native one, in either direction.
 *
 * This behavior never reads file contents, uploads anything, or renders a
 * file list — that's your code, same "framework does visuals, you do the
 * data" split as every other field component here.
 *
 * @serves file-upload
 */
let installed = false;

/**
 * The nearest zone to an event target.
 *
 * `e.target` on a drag event is not guaranteed to be an Element — a Text
 * node inside the hint has no `closest`, and the repo's usual
 * `(e.target as Element)?.closest(…)` cast throws there rather than
 * returning null (`?.` guards null, not a wrong Node type). A throw inside
 * `dragover` means `preventDefault()` is never reached, so the drop is
 * refused and the zone looks dead. Walk to the element instead.
 */
function zoneFor(target: EventTarget | null): HTMLElement | null {
  const node = target as Node | null;
  if (!node) return null;
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return el?.closest<HTMLElement>('[data-file-dropzone]') ?? null;
}

function inputFor(zone: HTMLElement): HTMLInputElement | null {
  return zone.querySelector<HTMLInputElement>('input[type="file"]');
}

/**
 * Whether this drag may land on this input, judged only on what the input
 * itself declares. `count` is how many files the drag carries when that is
 * knowable — during `dragover` the items are listed but not readable, and
 * Safari has historically not exposed them at all, so an unknown count is
 * allowed through and re-judged on `drop`, where `files` is always real.
 */
function accepts(input: HTMLInputElement, dt: DataTransfer | null, count: number | null): boolean {
  if (input.disabled) return false;
  if (!dt || !Array.prototype.includes.call(dt.types, 'Files')) return false;
  if (!input.multiple && count !== null && count > 1) return false;
  return count === null || count > 0;
}

/** Files carried by a drag, or null while the browser only lists them. */
function dragFileCount(dt: DataTransfer | null): number | null {
  if (!dt) return null;
  if (dt.files && dt.files.length) return dt.files.length;
  if (!dt.items || !dt.items.length) return null;
  let n = 0;
  for (const item of Array.from(dt.items)) if (item.kind === 'file') n += 1;
  return n;
}

export function initFileDropzone(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('dragover', (e) => {
    const zone = zoneFor(e.target);
    if (!zone) return;
    const input = inputFor(zone);
    const dt = e.dataTransfer;
    if (!input || !accepts(input, dt, dragFileCount(dt))) {
      /* Cancel anyway, with the operation set to `none`: an uncancelled
         dragover lets the browser navigate to the file on drop, which is a
         worse answer to "this zone is disabled" than the no-drop cursor.
         A `none` operation also means the `drop` event never fires. */
      if (dt) dt.dropEffect = 'none';
      e.preventDefault();
      delete zone.dataset.dragover;
      return;
    }
    if (dt) dt.dropEffect = 'copy';
    e.preventDefault(); // required for `drop` to fire at all
    zone.dataset.dragover = 'true';
  });

  document.addEventListener('dragleave', (e) => {
    const zone = zoneFor(e.target);
    if (!zone) return;
    // A dragleave on a CHILD (moving between the hint text and the input)
    // isn't leaving the zone — only clear the state once the pointer is
    // actually outside the zone's own box.
    if (zone.contains(e.relatedTarget as Node | null)) return;
    delete zone.dataset.dragover;
  });

  document.addEventListener('drop', (e) => {
    const zone = zoneFor(e.target);
    if (!zone) return;
    e.preventDefault();
    delete zone.dataset.dragover;
    const input = inputFor(zone);
    const files = e.dataTransfer?.files;
    if (!input || !files || !files.length) return;
    if (!accepts(input, e.dataTransfer, files.length)) return;
    input.files = files;
    /* Programmatic assignment fires nothing — dispatch the pair a real
       selection fires, IN THAT ORDER. Native drop and native pick both emit
       `input` then `change` (measured); dispatching only `change` left
       dirty-tracking and `hx-trigger="input"` listeners silent on a drop,
       against this file's own "exactly as if the user had picked" promise. */
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
