export const prerender = true;
export const trailingSlash = 'always';

import getContent from '$utils/getFiles';

export async function load() {
  const contents = await getContent();

  return { contents: contents };
}
