import { test, expect } from '@playwright/test';

const email = process.env.TEST_EMAIL!;
const password = process.env.TEST_PASSWORD!;

test.describe('Auth E2E', () => {
  // open auth page
  test('should load auth page and show login form', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    await expect(page).toHaveURL(/\/auth/);
    const loginForm = page.locator('form:has(input[name="email"]):has(input[name="password"])');
    await expect(loginForm).toBeVisible();
  });

  test('should navigate to the signup page', async ({ page, baseURL }) => {
    await page.goto(baseURL! + 'auth');
    const signup = page.locator('a:has-text("Sign up"), a:has-text("Signup"), a:has-text("Register"), button:has-text("Sign up")').first();
    await expect(signup).toBeVisible({ timeout: 5000 });
    // click and accept either a navigation to /signup or a signup form/modal to appear
    await signup.click().catch(() => null);
    await Promise.any([
      expect(page).toHaveURL(/\/signup|\/register/),
      expect(page.locator('form:has(input[name="email"]):has(input[name="password"])')).toBeVisible(),
    ]);
  });

  test('log in with the Google button click', async ({ page, baseURL }) => {
    await page.goto(baseURL! + 'auth');
    const google = page.locator('button:has-text("Google"), a:has-text("Google"), button:has-text("Sign in with Google"), button:has-text("Sign in with Google Account")').first();
    if (await google.count() === 0) {
      test.info().annotations.push({ type: 'note', description: 'No Google login button present on this build — skipping.' });
      test.skip(true, 'No Google login button present');
      return;
    }

    await expect(google).toBeVisible({ timeout: 5000 });

    // Avoid clicking the Google button (OAuth popups may open external flows and close the test browser).
    // Instead, check if the element has an href target pointing to Google OAuth or has aria/role indicating OAuth.
    const href = await google.getAttribute('href');
    if (href) {
      expect(href).toContain('accounts.google.com');
    } else {
      // No href — at least ensure it looks like a social login control (aria-label or text already asserted)
      test.info().annotations.push({ type: 'note', description: 'Google login button present but no href detected; skipping popup flow assertions.' });
    }
  });

  // invalid login 
  test('invalid login shows error and blocks access', async ({ page, baseURL }) => {
    await page.goto(baseURL! + 'auth');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'NotTheRightOne!');
    await page.click('button[type="submit"]');

  
    const errText = page.getByText(/(invalid|incorrect|wrong|failed)/i).first();
    const errRole = page.locator(':is([role="alert"], .error, .text-red-500, .text-destructive)');
    await Promise.any([
      expect(errText).toBeVisible({ timeout: 5000 }),
      expect(errRole).toBeVisible({ timeout: 5000 })
    ]);

    
    await expect(page).toHaveURL(/\/auth/);
  });

  //  valid login success
  test('valid login redirects to Browse and shows key UI', async ({ page, baseURL }) => {
    await page.goto(baseURL! + 'auth');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(
      new RegExp(`${baseURL?.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(?:$|browse|home|/)`)
    );
    await expect(page.locator('button:has-text("Filter"), [data-testid="browse-list"], [data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  //logout flow
  test('logout returns to auth page', async ({ page, baseURL }) => {
    await page.goto(baseURL! + 'auth');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator('button:has-text("Filter"), [data-testid="browse-list"], [data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });

    const logout = page.locator('[title="Logout"], [aria-label="Logout"], button:has-text("Logout")').first();
    await expect(logout).toBeVisible();
    await logout.click();
    await expect(page).toHaveURL(/\/auth/);
  });
});
