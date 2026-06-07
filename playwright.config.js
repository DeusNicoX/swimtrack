import { defineConfig, devices } from '@playwright/test';

const frontendBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173';
const apiBaseUrl = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000';
const shouldStartWebServers = process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== '1';

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  globalSetup: './tests/e2e/global-setup.js',
  globalTeardown: './tests/e2e/global-teardown.js',
  reporter: [['list'], ['html', { open: 'never' }]],
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: frontendBaseUrl,
    trace: 'on-first-retry',
  },
  webServer: shouldStartWebServers
    ? [
        {
          command:
            'DATABASE_URL=postgres://swimtrack:swimtrack@localhost:5433/swimtrack JWT_SECRET=e2e-secret npm run dev --workspace backend',
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
          url: apiBaseUrl,
        },
        {
          command: `VITE_API_BASE_URL=${apiBaseUrl} npm run dev --workspace frontend -- --host 127.0.0.1`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
          url: frontendBaseUrl,
        },
      ]
    : undefined,
  workers: 1,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
