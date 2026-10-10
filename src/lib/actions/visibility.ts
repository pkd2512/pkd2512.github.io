/**
 * Tracks whether an element is on screen. While it isn't, the element gets a
 * `data-offscreen` attribute, which a global rule in +layout.svelte uses to
 * pause every CSS animation inside it. Pass a callback for anything that isn't
 * a CSS animation (a marquee's play prop, a timer).
 */
export function visibility(
  node: HTMLElement,
  onChange?: (visible: boolean) => void
) {
  let callback = onChange;

  const io = new IntersectionObserver((entries) => {
    const visible = entries[entries.length - 1].isIntersecting;
    node.toggleAttribute('data-offscreen', !visible);
    callback?.(visible);
  });
  io.observe(node);

  return {
    update(next?: (visible: boolean) => void) {
      callback = next;
    },
    destroy() {
      io.disconnect();
      node.removeAttribute('data-offscreen');
    },
  };
}
