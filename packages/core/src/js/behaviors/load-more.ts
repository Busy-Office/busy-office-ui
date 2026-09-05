/**
 * Load-more pagination ("pull up to see more") — the infinite-scroll
 * alternative to page-number `.bo-pagination`. Tracks intent only, same
 * split as bo:table-export/bo:row-save/bo:scan: the consumer's code
 * fetches the next batch and appends the rows; this behavior never owns
 * data fetching.
 *
 * Markup contract:
 *   <div class="bo-data-table-container">
 *     <table class="bo-data-table">…</table>
 *     <div class="bo-data-table__footer">
 *       <button class="bo-btn bo-btn--secondary" type="button"
 *           data-table-load-more>Load more</button>
 *     </div>
 *   </div>
 *
 * Clicking the button dispatches bo:table-load-more (bubbling) on it.
 * With `data-load-more-auto` also present, an IntersectionObserver fires
 * the same event whenever the button IS in view — once per entry, so
 * a consumer that appends rows (pushing the button back out of view)
 * gets the next fire on the next approach, while a consumer that fails
 * to append doesn't get an infinite loop. Disable the button while a
 * fetch is in flight; a disabled button neither clicks nor auto-fires.
 * When there's nothing more to load, remove the button (or set
 * `disabled` permanently).
 *
 * `is in view`, not `scrolls into view`, and the difference is a fetch a
 * consumer does not expect: an IntersectionObserver delivers an initial
 * entry for every element it observes, so an auto button that is ALREADY
 * in the viewport when initLoadMore() runs fires immediately, with no
 * scroll and no click. Measured in headless Chrome against this module as
 * shipped (roadmap 277.1) — out of view at init 0 fires, scrolled in 1,
 * away and back 2; already in view at init 1. That is the intended
 * "fill the viewport" behaviour and it does not loop, because the
 * observer reports transitions; it was simply documented, in five places,
 * as something a scroll had to trigger.
 *
 * bo:table-load-more's full contract (including the optional chunk-offset
 * detail a windowed list re-request carries) is documented once, in
 * windowed-list.ts — this file's own fires carry no detail, unchanged.
 *
 * @serves pagination
 */
let installed = false;
let observer: IntersectionObserver | undefined;

function fire(btn: HTMLElement): void {
  if ((btn as HTMLButtonElement).disabled) return;
  btn.dispatchEvent(new CustomEvent('bo:table-load-more', { bubbles: true }));
}

export function initLoadMore(root: ParentNode = document): void {
  if (!installed) {
    installed = true;
    document.addEventListener('click', (e) => {
      const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-table-load-more]');
      if (btn) fire(btn);
    });
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) fire(entry.target as HTMLElement);
        });
      });
    }
  }

  // Observation runs on every call so late-arriving buttons (hx-boost
  // swaps, client-side mounts) get picked up — observing the same
  // element twice is a no-op per the IntersectionObserver spec.
  if (observer) {
    root
      .querySelectorAll<HTMLElement>('[data-table-load-more][data-load-more-auto]')
      .forEach((btn) => observer!.observe(btn));
  }
}
