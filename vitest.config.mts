import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/unit/*.test.ts', 'test/integration/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**'],
      reportsDirectory: '.tmp/coverage',
      reporter: ['html', 'json', 'lcov', 'text', 'clover'],
    },
    setupFiles: ['./vitest-setup.mts'],
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
