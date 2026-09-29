/**
 * Observes <figure> elements and toggles a `side-caption` class
 * when there is enough room to the right of the figure for the caption.
 */
export function figureCaptionObserver(node: HTMLElement) {
  const MIN_SPACE = 300;

  const figureObservers = new Map<Element, ResizeObserver>();

  function check(figure: Element) {
    const caption = figure.querySelector('figcaption');
    if (!caption) return;
    const rect = figure.getBoundingClientRect();
    const available = window.innerWidth - rect.right;
    figure.classList.toggle('side-caption', available > MIN_SPACE);
  }

  function observeFigure(figure: Element) {
    if (figureObservers.has(figure)) return;
    if (!figure.querySelector('figcaption')) return;
    check(figure);
    const ro = new ResizeObserver(() => check(figure));
    ro.observe(figure);
    figureObservers.set(figure, ro);
  }

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n instanceof Element) {
          if (n.matches?.('figure')) observeFigure(n);
          n.querySelectorAll?.('figure').forEach(observeFigure);
        }
      }
    }
  });
  mo.observe(node, { childList: true, subtree: true });

  node.querySelectorAll('figure').forEach(observeFigure);

  const onResize = () => node.querySelectorAll('figure').forEach(check);
  window.addEventListener('resize', onResize);

  return {
    destroy() {
      mo.disconnect();
      figureObservers.forEach((ro) => ro.disconnect());
      window.removeEventListener('resize', onResize);
    },
  };
}
