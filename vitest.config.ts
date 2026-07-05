import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts (which roots at example/ for the dev server) so
// tests are discovered under src/.
export default defineConfig({
  test: {
    root: '.',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
