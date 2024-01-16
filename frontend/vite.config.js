import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
  },
  test: {
    coverage: {
      reporter: ['text', 'cobertura'],
      reportsDirectory: './coverage',
    },
  },
});