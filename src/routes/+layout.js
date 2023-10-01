export const prerender = true;
export const trailingSlash = 'always';

import getContents from '$utils/getContents';

export async function load() {
  const paths = import.meta.glob('/src/contents/**/*.md', {
    eager: true,
  });
  const contents = await getContents(paths);

  const contentsByDate = contents.sort(
    (a, b) => new Date(a.date) > new Date(b.date)
  );

  return { contents: contentsByDate };
}
