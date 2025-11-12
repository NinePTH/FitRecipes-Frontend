import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

// Load dotenv from the first existing path so CI or local layouts work.
// Prefer project root `.env`, then common test locations.
const envCandidates = ['.env', 'env', 'tests/.env', 'tests/env'];
const envPath = envCandidates.find(p => existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  // fallback to default behavior (searches process.cwd())
  dotenv.config();
}

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: process.env.BASE_URL || 'https://fitrecipes-staging.vercel.app/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
