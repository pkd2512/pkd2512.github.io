/**
 * @param {URL} baseUrl - url of the page
 */
export default (baseUrl) => {
  try {
    return new URL(baseUrl).origin;
  } catch {
    // This handles a weird case where Vite's base path is
    // reset to './' after the app hydrates...
    if (typeof window !== 'undefined') return getOrigin(window.location.href);
    return '';
  }
};
