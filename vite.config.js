import { defineConfig } from 'vitest/config';
import dsv from '@rollup/plugin-dsv';
import purgecss from 'vite-plugin-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  // @ts-ignore
  plugins: [
    sveltekit(),
    dsv(),
    // purgecss({
    //   content: ['src/**/*.svelte', 'src/**/*.html', 'src/app.html'],
    //   safelist: {
    //     standard: [/svelte-/, /mapbox/, /:where/, /^h[1-6]$/, /^\.[hH]/],
    //     deep: [/svelte-/, /mapbox/, /:where/, /^h[1-6]$/, /^\.[hH]/],
    //     greedy: [/svelte-/, /mapbox/, /:where/, /^h[1-6]$/, /^\.[hH]/],
    //   },
    //   defaultExtractor: (content) => {
    //     const broadMatches = content.match(/[\w:\-.[\]#~>]+/g) || [];
    //     const cssMatches = content.match(/[^;{}]*[^;{}:]+/g) || [];
    //     return [...broadMatches, ...cssMatches];
    //   },
    // }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: { target: 'es2015' },
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['.'],
    },
  },
  css: {
    preprocessorOptions: {
      scss: { includePaths: ['src', 'node_modules'], quietDeps: true },
    },
  },
});
