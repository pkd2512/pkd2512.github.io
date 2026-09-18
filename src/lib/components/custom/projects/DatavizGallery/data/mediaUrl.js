/**
 * URL helpers for gallery items.
 *
 * CSV rows store `img_url` as `projects/dataviz-gallery/images/<slug>.webp`.
 * The assets live under `static/media/`, and `scripts/generate-thumbnails.js`
 * writes resized copies alongside `images/` as `thumbs_<width>/<slug>.webp`.
 *
 * Both helpers return root-relative URLs (with a leading slash).
 */

/**
 * Full-resolution source for an item.
 * @param {string} imgUrl
 * @returns {string}
 */
export function mediaUrl(imgUrl) {
  return imgUrl ? '/media/' + imgUrl : '';
}

/**
 * Thumbnail at a given generated width. Falls back to inserting the
 * `thumbs_<w>/` segment before the filename for legacy rows that point
 * at a flat folder rather than `<dir>/images/<file>`.
 *
 * @param {string} imgUrl
 * @param {number} width — must match a folder produced by the thumbnail script
 * @returns {string}
 */
export function thumbUrl(imgUrl, width) {
  if (!imgUrl) return '';
  if (imgUrl.includes('/images/')) {
    return '/media/' + imgUrl.replace('/images/', `/thumbs_${width}/`);
  }
  const i = imgUrl.lastIndexOf('/');
  return (
    '/media/' +
    imgUrl.slice(0, i) +
    '/thumbs_' +
    width +
    '/' +
    imgUrl.slice(i + 1)
  );
}
