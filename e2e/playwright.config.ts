import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false, // required: run setup before tests

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
  ],
});
