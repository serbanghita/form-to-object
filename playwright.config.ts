import { defineConfig, devices } from '@playwright/test';

const PORT = 8888;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './test/e2e',
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `node test/e2e/server.mjs`,
    url: `${baseURL}/form-multiple-choice-fields.html`,
    reuseExistingServer: !process.env.CI,
    env: { E2E_PORT: String(PORT) },
  },
});
