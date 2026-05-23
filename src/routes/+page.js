import { error } from '@sveltejs/kit';
import getBlogFeed from '$utils/getBlogFeed';

/**
 * Loads the file contents from the file `[slug].md`
 */
export async function load() {
  try {
    // @ts-expect-error - .md imports are resolved by mdsvex at build time
    const page = await import(`../contents/home.md`);

    let blogFeed = [];
    try {
      blogFeed = await getBlogFeed();
    } catch (e) {
      // blog feed unavailable — render without it
    }

    return {
      content: page.default,
      meta: page.metadata,
      blogFeed,
    };
  } catch (e) {
    error(404, 'Could not find home.md');
  }
}
