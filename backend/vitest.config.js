import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '*.config.js',
        'eslint.config.js',
        'vitest.config.js',
        'src/config/**',
        'src/server.js',
      ],
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    environment: 'node',
    globals: true,
  },
});
