import { error } from '@sveltejs/kit';

/**
 * Loads the file contents from the file `[slug].md`
 */
export async function load({ params }) {
  try {
    const post = await import(`../../../contents/${params.slug}.md`);

    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
