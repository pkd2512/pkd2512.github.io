// A /gallery/[slug] only matches a page in src/contents/galleries/.
const slugs = Object.keys(import.meta.glob('/src/contents/galleries/*.md')).map(
  (path) => /** @type {string} */ (path.split('/').at(-1)).replace('.md', '')
);

/** @param {string} param */
export function match(param) {
  return slugs.includes(param);
}
