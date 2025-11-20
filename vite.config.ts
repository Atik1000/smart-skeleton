import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      name: 'copy-css',
      closeBundle() {
        // Copy CSS file to dist folder
        try {
          mkdirSync('dist', { recursive: true });
          copyFileSync('styles/skeleton.css', 'dist/skeleton.css');
          console.log('✓ Copied skeleton.css to dist/');
        } catch (err) {
          console.error('Error copying CSS:', err);
        }
      }
    }
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SmartSkeleton',
      formats: ['es', 'cjs'],
      fileName: (format) => `smart-skeleton.${format === 'es' ? 'esm' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: 'skeleton.css',
      },
    },
  },
});
