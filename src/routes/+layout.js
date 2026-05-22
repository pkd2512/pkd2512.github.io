export const prerender = true;
export const trailingSlash = 'always';

import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import getContents from '$utils/getContents';

injectSpeedInsights();

export async function load() {
  const paths = /** @type {Record<string, {metadata: Record<string, any>}>} */ (import.meta.glob('/src/contents/**/*.md', {
    eager: true,
  }));
  const contents = await getContents(paths);

  const contentsByDate = contents.sort(
    (/** @type {{date: string}} */ a, /** @type {{date: string}} */ b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
  );

  return { contents: contentsByDate };
}
