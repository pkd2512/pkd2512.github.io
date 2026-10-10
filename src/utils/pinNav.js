/**
 * Pins the mobile nav the way a "headroom" bar works: it leaves with the page
 * when you scroll down, and rolls back in as soon as you scroll up.
 *
 * The bar is only ever pinned while scrolling UP. Pinning on the way down
 * swaps it from in-flow to sticky in a single frame, wherever the page has got
 * to, so it either snapped back on screen or vanished — never a smooth exit.
 * Left in flow it simply scrolls off like any other content.
 *
 *   scrolling down, bar in view   nothing: it scrolls away naturally
 *   scrolling up, bar out of view pin it, hidden, then roll it in (`up`)
 *   pinned, scrolling down        slide it away (`down`)
 *   back at its own place         unpin: sticky and in-flow coincide there
 *
 * Expects a zero-height marker as the previous sibling, standing in for the
 * bar's natural position. The bar itself can't be measured for that: once
 * sticky it reports where it is stuck, not where it belongs.
 *
 * The CSS owns the motion (`.pin`, `.up`, `.down`, `.settling` in NavMobile).
 * @param {HTMLElement} node
 */
export default (node) => {
  const sentinel = /** @type {HTMLElement} */ (node.previousElementSibling);
  let prevY = window.scrollY;

  /** @param {'up' | 'down'} dir */
  const direction = (dir) => {
    node.classList.toggle('up', dir === 'up');
    node.classList.toggle('down', dir === 'down');
  };

  const pin = () => {
    // Stage the hidden state with transitions off and commit it, so the change
    // to `up` below has a starting point to roll in from.
    node.classList.add('settling', 'pin');
    direction('down');
    void node.offsetHeight;
    node.classList.remove('settling');
    direction('up');
  };

  const unpin = () => {
    // Drop the transform without animating it: the bar is already sitting
    // exactly where it belongs.
    node.classList.add('settling');
    node.classList.remove('pin');
    direction('up');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => node.classList.remove('settling'))
    );
  };

  const update = () => {
    const y = window.scrollY;
    const dy = y - prevY;
    prevY = y;

    const top = sentinel.getBoundingClientRect().top;
    const pinned = node.classList.contains('pin');

    if (top > -2) {
      if (pinned) unpin();
      return;
    }

    if (Math.abs(dy) <= 3) return;

    if (dy < 0) {
      if (pinned) direction('up');
      else if (top <= -(node.offsetHeight + 2)) pin();
    } else if (pinned) {
      direction('down');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  return {
    destroy() {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    },
  };
};
