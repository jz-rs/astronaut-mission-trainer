import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works on GitHub Pages, itch.io or any static host.
  base: './',
  // Phaser alone is ~1.2 MB (~330 KB gzipped); that is expected for a game.
  build: { chunkSizeWarningLimit: 1500 },
});
