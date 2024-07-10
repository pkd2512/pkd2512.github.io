import { isEqual } from 'lodash-es';

/**
 * Checks if source and destination url are on the same domain
 * @param {String} link - target url
 * @param {String} host - source host
 * @returns {String} `_blank for external links`
 */
export default (link, host) => {
  try {
    const newHost = new URL(link).hostname;

    return isEqual(host, newHost) ? '' : '_blank';
  } catch (error) {}
};
