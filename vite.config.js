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
  ssr: {
    // gsap ships ESM at deep paths (e.g. `gsap/Draggable`) but its
    // package.json doesn't declare `"type": "module"`, so Node's
    // default SSR loader chokes on the `import` statements. Letting
    // Vite bundle gsap for SSR sidesteps the issue.
    noExternal: ['gsap'],
  },
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
