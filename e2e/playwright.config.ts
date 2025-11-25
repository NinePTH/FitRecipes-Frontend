import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname replacement and resolved auth storage path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_STORAGE = path.resolve(__dirname, '..', 'auth.json');

export default defineConfig({
  fullyParallel: false, // required: run setup before tests

  // Resolve auth storage state to an absolute path so all projects use the same file
  use: {
    storageState: AUTH_STORAGE,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup(\.test)?\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
  ],
});
