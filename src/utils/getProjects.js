import { json } from '@sveltejs/kit';

/**
 * Fetches list and content of files from a folder.
 * Based on https://joyofcode.xyz/sveltekit-markdown-blog#posts-api-endpoint
 * @param {String} path - Path of the files `/src/contents/*.md`
 * @returns {JSON} List and Contents of parsed files
 */
export default async () => {
  var _a;
  let posts = [];
  const paths = import.meta.glob('/src/contents/projects/*.md', {
    eager: true,
  });
  for (const path in paths) {
    const file = paths[path];
    const slug =
      (_a = path.split('/').at(-1)) === null || _a === void 0
        ? void 0
        : _a.replace('.md', '');
    if (file && typeof file === 'object' && 'metadata' in file && slug) {
      const metadata = file.metadata;
      const post = Object.assign(Object.assign({}, metadata), { slug });
      post.published && posts.push(post);
    }
  }
  posts = posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return posts;
};
