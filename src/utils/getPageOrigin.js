/**
 * Get the domain origin from a url
 * @param {string} baseUrl - url of the page
 * @returns {string} domain
 */
export default (baseUrl) => {
  try {
    return new URL(baseUrl).origin;
  } catch {
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
  }
};
