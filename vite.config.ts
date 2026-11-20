// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ignore tous les sous-imports de refractor (utilisés uniquement par Prism, pas par Light)
      external: [/^refractor\/.*/],
    },
  },
});