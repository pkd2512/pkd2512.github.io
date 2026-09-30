/**
 * Sets an element's background-image only once it comes near the viewport.
 * CSS backgrounds can't use `loading="lazy"`, so without this every card on a
 * page downloads its image up front, however far down the page it sits.
 *
 * Only for images below the first screen: an above-the-fold background should
 * stay inline, where the browser can fetch it before any script runs.
 */
export function lazyBackground(node: HTMLElement, url: string) {
  let src = url;
  let near = false;

  const apply = () => {
    node.style.backgroundImage = `url("${src}")`;
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      near = true;
      apply();
      io.disconnect();
    },
    // Start a little over a screen early so it has usually landed by the time
    // it scrolls in.
    { rootMargin: '600px 0px' }
  );
  io.observe(node);

  return {
    update(next: string) {
      src = next;
      if (near) apply();
    },
    destroy() {
      io.disconnect();
    },
  };
}
