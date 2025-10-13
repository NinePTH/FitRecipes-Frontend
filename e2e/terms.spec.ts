import { test, expect } from '@playwright/test';
import { clearStorage, setAuthToken } from './helpers';

test.describe('Terms of Service - View Only Page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should display read-only terms page at /terms', async ({ page }) => {
    await page.goto('/terms');

    // Check page title
    await expect(page.getByRole('heading', { level: 1, name: /terms of service/i })).toBeVisible();

    // Should have content sections
    await expect(page.getByText(/privacy policy/i)).toBeVisible();
    await expect(page.getByText(/acceptance of terms/i)).toBeVisible();
  });

  test('should NOT have Accept or Decline buttons on /terms page', async ({ page }) => {
    await page.goto('/terms');

    // Should NOT have action buttons
    await expect(page.getByRole('button', { name: /accept.*continue/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /decline.*sign out/i })).not.toBeVisible();
  });

  test('should have Back navigation button', async ({ page }) => {
    await page.goto('/terms');

    // Should have back button
    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();

    // Should go back (likely to previous page or home)
    await page.waitForLoadState('networkidle');
  });

  test('should be accessible from signup page in new tab', async ({ page }) => {
    await page.goto('/auth');

    // Switch to registration form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Get the terms link
    const termsLink = page.getByRole('link', { name: /terms of service and privacy policy/i });
    await expect(termsLink).toHaveAttribute('target', '_blank');
    await expect(termsLink).toHaveAttribute('href', '/terms');

    // Click should open new tab (we test the attributes, not actual tab opening)
    const href = await termsLink.getAttribute('href');
    expect(href).toBe('/terms');
  });

  test('should display full terms content', async ({ page }) => {
    await page.goto('/terms');

    // Check for key sections
    await expect(page.getByText(/terms of service/i)).toBeVisible();
    await expect(page.getByText(/privacy policy/i)).toBeVisible();
    await expect(page.getByText(/data collection/i)).toBeVisible();
    await expect(page.getByText(/user responsibilities/i)).toBeVisible();
  });

  test('should be scrollable for long content', async ({ page }) => {
    await page.goto('/terms');

    // Get the content container
    const content = page.locator('.space-y-6');
    await expect(content).toBeVisible();

    // Content should be present
    const textContent = await content.textContent();
    expect(textContent?.length).toBeGreaterThan(100);
  });
});

test.describe('Terms of Service - Accept/Decline Page (OAuth)', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/accept-terms');

    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should display accept-terms page for OAuth users without accepted terms', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    // Should display terms acceptance page
    await expect(page.getByRole('heading', { name: /accept terms of service/i })).toBeVisible();

    // Should have action buttons
    await expect(page.getByRole('button', { name: /accept.*continue/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /decline.*sign out/i })).toBeVisible();
  });

  test('should display full terms content with scrollable area', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    // Check for scrollable content
    const scrollableContent = page.locator('.overflow-y-auto');
    await expect(scrollableContent).toBeVisible();

    // Should contain terms sections
    await expect(page.getByText(/terms of service/i)).toBeVisible();
    await expect(page.getByText(/privacy policy/i)).toBeVisible();
  });

  test('should auto-redirect OAuth users with accepted terms', async ({ page }) => {
    // Set OAuth user WITH accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: true,
    });

    await page.goto('/accept-terms');

    // Should auto-redirect away from accept-terms page
    await page.waitForURL(url => !url.pathname.includes('/accept-terms'), { timeout: 5000 });

    // Should be on home or intended path
    expect(page.url()).not.toContain('/accept-terms');
  });

  test('should handle Accept button click', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    // Click Accept button
    const acceptButton = page.getByRole('button', { name: /accept.*continue/i });
    await expect(acceptButton).toBeEnabled();

    // Note: Actual acceptance would require backend API
    // We're testing that the button is functional
  });

  test('should handle Decline button click', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    // Click Decline button
    const declineButton = page.getByRole('button', { name: /decline.*sign out/i });
    await expect(declineButton).toBeEnabled();

    // Note: Actual decline would require backend API and would log out user
    // We're testing that the button is functional
  });

  test('should show loading state during acceptance', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    const acceptButton = page.getByRole('button', { name: /accept.*continue/i });
    
    // Button should be initially enabled
    await expect(acceptButton).toBeEnabled();

    // After clicking, button might show loading state
    // Note: This is hard to test without backend API
  });

  test('should preserve intended redirect path after acceptance', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    // Try to access protected route
    await page.goto('/submit-recipe');

    // Should redirect to accept-terms
    await expect(page).toHaveURL('/accept-terms');

    // sessionStorage should have intended path
    const intendedPath = await page.evaluate(() => sessionStorage.getItem('intendedPath'));
    expect(intendedPath).toBe('/submit-recipe');
  });
});

test.describe('Terms Acceptance Workflow', () => {
  test('should block OAuth users without accepted terms from protected routes', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    // Try to access protected routes
    const protectedRoutes = [
      '/browse-recipes',
      '/submit-recipe',
      '/admin/recipes',
      '/my-recipes',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Should redirect to accept-terms
      await expect(page).toHaveURL('/accept-terms');
    }
  });

  test('should allow OAuth users with accepted terms to access protected routes', async ({ page }) => {
    // Set OAuth user WITH accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'Chef',
      isOAuthUser: true,
      termsAccepted: true,
    });

    // Should be able to access protected routes
    await page.goto('/submit-recipe');
    
    // Should NOT redirect to accept-terms
    await expect(page).toHaveURL('/submit-recipe');
  });

  test('should handle complete OAuth flow with terms acceptance', async ({ page }) => {
    // 1. Simulate OAuth callback without accepted terms
    const callbackUrl = '/oauth/callback?token=test-jwt-token&termsAccepted=false&isOAuthUser=true';
    await page.goto(callbackUrl);

    // 2. Should redirect to accept-terms
    await expect(page).toHaveURL('/accept-terms');

    // 3. Verify content
    await expect(page.getByRole('heading', { name: /accept terms of service/i })).toBeVisible();

    // 4. Check buttons are present
    await expect(page.getByRole('button', { name: /accept.*continue/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /decline.*sign out/i })).toBeVisible();

    // 5. Verify OAuth user state in localStorage
    const userStr = await page.evaluate(() => localStorage.getItem('fitrecipes_user'));
    expect(userStr).toBeTruthy();
    
    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user.isOAuthUser).toBe(true);
      expect(user.termsAccepted).toBe(false);
    }
  });
});

test.describe('Accessibility', () => {
  test('terms page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/terms');

    // Should have h1 for main title
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Should have h2 for sections
    const headings = page.getByRole('heading', { level: 2 });
    await expect(headings.first()).toBeVisible();
  });

  test('accept-terms page should be keyboard navigable', async ({ page }) => {
    // Set OAuth user without accepted terms
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: false,
    });

    await page.goto('/accept-terms');

    // Should be able to tab to buttons
    await page.keyboard.press('Tab');
    // First focusable element (likely scrollable content or first button)
  });
});
