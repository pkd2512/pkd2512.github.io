import { resolve } from '$app/paths';
import checkAbsoluteUrl from '$utils/checkAbsoluteUrl';

/**
 * @param {string} url
 * @returns {string}
 */
export default (url) => {
  if (checkAbsoluteUrl(url)) return url;
  // @ts-expect-error - url is dynamic, not a known route
  return resolve('/' + url);
};
