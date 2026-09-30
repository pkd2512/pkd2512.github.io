import getContents from '$utils/getContents';

// Lives on the server (so, at prerender time) rather than in +layout.js. The
// glob imports every markdown page just to read its metadata, and in a
// universal load that pulled all of their components (PhotoPile/gsap,
// Testimonials/Splide, the community list's `marked`, and every page's CSS)
// into the bundle every page ships. Here only the serialized metadata reaches
// the browser.
export async function load() {
  const paths = /** @type {Record<string, {metadata: Record<string, any>}>} */ (
    import.meta.glob('/src/contents/**/*.md', {
      eager: true,
    })
  );
  const contents = await getContents(paths);

  const contentsByDate = contents.sort(
    (/** @type {{date: string}} */ a, /** @type {{date: string}} */ b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
  );

  return { contents: contentsByDate };
}
