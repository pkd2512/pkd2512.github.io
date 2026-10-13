import { error } from '@sveltejs/kit';

export function entries() {
  return Object.keys(import.meta.glob('/src/contents/galleries/*.md')).map(
    (path) => ({
      gallery: /** @type {string} */ (path.split('/').at(-1)).replace('.md', ''),
    })
  );
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
