import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ahscheduler/',
  plugins: [react()],
  build: {
    outDir: 'dist',      // ← default is "dist"
    // you could change this to "build" or anything,
    // but then you must use that same folder below.
  }
});
