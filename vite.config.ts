import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve('src/index.ts'),
      name: 'telemetree',
      formats: ['umd'],
      fileName: () => 'telemetree-pixel.js',
    },
    rollupOptions: {
      output: {
        globals: {
          'crypto-js': 'CryptoJS',
          jsencrypt: 'JSEncrypt',
        },
      },
    },
  },
});
