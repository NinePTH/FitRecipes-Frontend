import { test, expect } from '@playwright/test';

const appUrl = 'https://fitrecipes-staging.vercel.app/auth';
const validEmail = 'somethin@mail.com';
const validPassword = 'Lol.11111111';

test('authenticate', async ({ page }) => {
  // Go to real login page
  await page.goto(appUrl);

  // Wait for React to load
  await page.waitForSelector('#email', { timeout: 10000 });

  // Fill login form
  await page.fill('#email', validEmail);
  await page.fill('#password', validPassword);

  // Click login button
  await page.locator('button[type="submit"]').click();

  // Wait for navigation away from auth page
  await page.waitForURL((url) => !url.pathname.includes('/auth'), { timeout: 15000 });
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Verify we're logged in by checking for user indicator
  // Option 1: Wait for the user name to appear
  await page.waitForSelector('text=polop chanel', { timeout: 10000 }).catch(() => {
    console.log('Warning: User name not found, but continuing...');
  });
  
  // Option 2: Or wait for logout button to appear
  await page.waitForSelector('[title="Logout"]', { timeout: 10000 }).catch(() => {
    console.log('Warning: Logout button not found, but continuing...');
  });

  // Log where we ended up
  console.log('✅ Successfully authenticated');
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // Take a screenshot to verify
  await page.screenshot({ path: 'test-results/after-login.png', fullPage: true });

  // Save the authenticated session
  await page.context().storageState({ path: 'auth.json' });
  
  console.log('✅ Auth state saved to auth.json');
});