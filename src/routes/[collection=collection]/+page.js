import { error } from '@sveltejs/kit';

export function entries() {
  return [{ collection: 'zines' }, { collection: 'photography' }, { collection: 'art' }];
}

/**
 * Loads the collection page from `src/contents/collections/[collection].md`
 */
export async function load({ params }) {
  try {
    const page = await import(
      `../../contents/collections/${params.collection}.md`
    );

    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    error(404, `Could not find ${params.collection}`);
  }
}
