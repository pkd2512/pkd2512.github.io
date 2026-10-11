// Slugs of the collection pages in src/contents/collections/. Add a slug here
// (and a matching .md file) to add a collection.
const slugs = ['zines', 'photography', 'art'];

/** @param {string} param */
export function match(param) {
  return slugs.includes(param);
}
