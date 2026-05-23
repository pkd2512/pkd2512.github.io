/**
 * @param {String} urlString url
 */
export default (urlString) => {
  const check = /^https?:\/\/|^\/\//i;
  return check.test(urlString);
};
