import { json } from '@sveltejs/kit';

/**
 * Fetches list and content of files from a folder.
 * Based on https://joyofcode.xyz/sveltekit-markdown-blog#posts-api-endpoint
 * @param {String} path - Path of the files `/src/contents/*.md`
 * @returns {JSON} List and Contents of parsed files
 */
export default async (paths) => {
  let _a;
  let pages = [];

  console.log(paths);
  for (const path in paths) {
    const file = paths[path];

    // Generate slug from filepath for filename and url
    const slug =
      (_a = path.split('/').at(-1)) === null || _a === void 0
        ? void 0
        : _a.replace('.md', '');
    if (file && typeof file === 'object' && 'metadata' in file && slug) {
      const metadata = file.metadata;
      const page = Object.assign(Object.assign({}, metadata), { slug });
      page.published && pages.push(page);
    }
  }
  pages = pages.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return pages;
};
