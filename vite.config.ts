import { defineConfig } from 'vite';
import path from 'path';
import preact from '@preact/preset-vite';

import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, './src'),
    },
  },
});
