import { Page } from '@playwright/test';

/**
 * Test Helpers for E2E Tests
 */

/**
 * Login helper for authenticated tests
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Wait for redirect to home page
  await page.waitForURL('/');
}

/**
 * Register helper for new user creation
 */
export async function register(
  page: Page,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  await page.goto('/auth');
  
  // Switch to register form
  await page.getByRole('button', { name: /sign up/i }).click();
  
  // Fill registration form
  await page.getByLabel(/first name/i).fill(firstName);
  await page.getByLabel(/last name/i).fill(lastName);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password/i).fill(password);
  await page.getByLabel(/agree to the terms/i).check();
  
  // Submit registration
  await page.getByRole('button', { name: /create account/i }).click();
}

/**
 * Clear browser storage
 */
export async function clearStorage(page: Page) {
  // Navigate to a page first to ensure storage is accessible
  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded');
  
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Set authentication token in localStorage
 */
export async function setAuthToken(page: Page, token: string, user: object) {
  // Navigate to a page first to ensure storage is accessible
  await page.goto('/auth');
  await page.waitForLoadState('domcontentloaded');
  
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem('fitrecipes_token', token);
      localStorage.setItem('fitrecipes_user', JSON.stringify(user));
    },
    { token, user }
  );
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 5000
) {
  return page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: object,
  status = 200
) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}
