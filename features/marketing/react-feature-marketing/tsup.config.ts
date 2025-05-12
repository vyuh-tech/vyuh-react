import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // ESM only
  dts: true,
  splitting: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  minify: true,
  external: ['react', 'react-dom'],
  injectStyle: true,
  esbuildOptions(options) {
    options.banner = {
      js: '// @vyuh/react-feature-marketing - Marketing feature package for Vyuh React framework',
    };
  },
});
