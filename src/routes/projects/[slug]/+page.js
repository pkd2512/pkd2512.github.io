import { error } from '@sveltejs/kit';

/**
 * Loads the file contents from the file `[slug].md`
 */
export async function load({ params }) {
  try {
    const page = await import(`../../../contents/projects/${params.slug}.md`);

    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    error(404, `Could not find ${params.slug}`);
  }
}
