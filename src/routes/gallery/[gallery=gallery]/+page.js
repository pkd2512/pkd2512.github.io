import { error } from '@sveltejs/kit';
import galleries from '$lib/data/galleries.js';

export function entries() {
  return galleries.map((g) => ({ gallery: g.slug }));
}

/**
 * Loads the gallery page from `src/contents/galleries/[gallery].md`
 */
export async function load({ params }) {
  try {
    const page = await import(
      `../../../contents/galleries/${params.gallery}.md`
    );

    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    error(404, `Could not find ${params.gallery}`);
  }
}
