/**
 * @param {Number} rem
 * Converts rem to pixels based on the root size
 */
export default (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
