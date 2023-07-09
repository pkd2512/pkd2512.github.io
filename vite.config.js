import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
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
  resolve: {
    alias: {
      $utils: '/src/utils',
      $pkg: '/package.json',
      $assets: '/src/assets',
    },
  },
  css: {
    preprocessorOptions: {
      scss: { includePaths: ['src', 'node_modules'], quietDeps: true },
    },
  },
});
