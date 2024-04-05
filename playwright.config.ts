import { defineConfig, devices } from '@playwright/test';

const isCI = process.env['CI'];
const baseURL = isCI ? 'http://webapp:3000' : 'http://localhost:3000'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{testName}-{projectName}{ext}',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: isCI ?
    undefined
    : {
      command: 'npm run start:build',
      url: 'http://127.0.0.1:3000',
      timeout: 20000,
      reuseExistingServer: !process.env.CI,
    },
});

export default config;