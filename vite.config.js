import { defineConfig } from 'vitest/config';
import dsv from '@rollup/plugin-dsv';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  // @ts-ignore
  plugins: [sveltekit(), dsv()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: { target: 'es2020' },
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
