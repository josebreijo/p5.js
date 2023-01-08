import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), splitVendorChunkPlugin()],
  build: {
    sourcemap: true,
  },
});
