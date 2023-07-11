import { isEqual } from 'lodash-es';

/**
 * @param {String} link - target url
 * @param {String} host - source host
 */
export default (link, host) => {
  try {
    const newHost = new URL(link).hostname;

    return isEqual(host, newHost) ? '' : '_blank';
  } catch (error) {}
};
