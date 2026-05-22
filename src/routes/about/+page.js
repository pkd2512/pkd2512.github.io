import { error } from '@sveltejs/kit';

/**
 * Loads the file contents from the file `[slug].md`
 */
export async function load() {
  try {
    // @ts-expect-error - .md imports are resolved by mdsvex at build time
    const page = await import('../../contents/about.md');

    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    error(404, 'Could not find about.md');
  }
}
