export const prerender = true;
export const trailingSlash = 'always';

import getContents from '$utils/getContents';

export async function load() {
  const paths = import.meta.glob('/src/contents/**/*.md', {
    eager: true,
  });
  const contents = await getContents(paths);

  return { contents: contents };
}
