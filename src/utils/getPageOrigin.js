/**
 * Get the domain origin from an url
 * @param {URL} baseUrl - url of the page
 * @returns {URL} domain
 */
export default (baseUrl) => {
  try {
    console.log(new URL(baseUrl).origin);
    return new URL(baseUrl).origin;
  } catch {
    if (typeof window !== 'undefined') return getOrigin(window.location.href);
    return '';
  }
};
