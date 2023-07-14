import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import { importAssets } from 'svelte-preprocess-import-assets';
import { mdsvex } from 'mdsvex';
import path from 'path';
import postcssCustomMedia from 'postcss-custom-media';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import remarkToc from 'remark-toc';
import remarkUnwrapImages from 'remark-unwrap-images';
import sveltePreprocess from 'svelte-preprocess';
import widont from 'rehype-widont';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }]],
  rehypePlugins: [
    rehypeSlug,
    rehypeAccessibleEmojis,
    [widont, { fragment: true }],
  ],
  layout: {
    _: './src/lib/components/mdsvex/layout.svelte',
  },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'docs',
      assets: 'docs/assets',
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    alias: {
      $pkg: path.resolve('package.json'),
      $utils: path.resolve('src/utils'),
      $media: path.resolve('static/media'),
      $contents: path.resolve('src/contents'),
    },
  },

  appDir: '_app',
  files: {
    assets: 'static',
    lib: 'src/lib',
    routes: 'src/routes',
    appTemplate: 'src/app.html',
  },
  extensions: ['.svelte', '.md'],
  preprocess: [
    importAssets(),
    sveltePreprocess({
      preserve: ['ld+json'],
      scss: {
        includePaths: ['src', 'node_modules'],
      },
      postcss: {
        plugins: [autoprefixer, postcssCustomMedia],
      },
    }),
    mdsvex(mdsvexOptions),
  ],
};

export default config;
