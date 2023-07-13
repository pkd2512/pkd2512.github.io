export const prerender = true;
export const trailingSlash = 'always';

import getContent from '$utils/getProjects';

export async function load() {
  const contents = await getContent();

  return { contents: contents };
}
