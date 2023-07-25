/**
 * @param {String} text - Content paragraph
 * @param {Integer} count - Word limit
 */
export default (text, count) => {
  let words = text.trim().split(/\s+/);

  return words.slice(0, count || 50).join(' ') + '&#8230;';
};
