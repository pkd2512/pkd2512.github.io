import galleries from '../lib/data/galleries.js';

// A /gallery/[slug] only matches a slug listed in src/lib/data/galleries.js.
/** @param {string} param */
export function match(param) {
  return galleries.some((g) => g.slug === param);
}
