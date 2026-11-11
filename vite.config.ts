import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         → normal multi-file production build in dist/
// `npm run build:single`  → one self-contained index.html (handy for sharing a preview)
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves the site from /<repo-name>/ — the workflow sets BASE_PATH.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : {},
}));
