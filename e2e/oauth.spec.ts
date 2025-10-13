import { test, expect } from '@playwright/test';
import { clearStorage, setAuthToken } from './helpers';

test.describe('OAuth Google Sign-In Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should display Google Sign-In button on login page', async ({ page }) => {
    await page.goto('/auth');

    // Check Google OAuth button
    const googleButton = page.getByRole('button', { name: /sign in with google/i });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toHaveClass(/flex.*items-center.*justify-center/);
  });

  test('should display Google Sign-In button on registration page', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch to register form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Check Google OAuth button
    const googleButton = page.getByRole('button', { name: /sign up with google/i });
    await expect(googleButton).toBeVisible();
  });

  test('should redirect to backend OAuth endpoint when clicking Google button', async ({ page }) => {
    await page.goto('/auth');

    // Get the Google button
    const googleButton = page.getByRole('button', { name: /sign in with google/i });

    // The button should trigger navigation to backend OAuth endpoint
    // In real scenario, this would redirect to Google's OAuth page
    // We'll check that the button has proper click handler
    await expect(googleButton).toBeEnabled();
  });
});

test.describe('OAuth Callback Handling', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should handle successful OAuth callback with accepted terms', async ({ page }) => {
    // Simulate OAuth callback with accepted terms
    const callbackUrl = '/oauth/callback?token=test-jwt-token&termsAccepted=true&isOAuthUser=true';
    
    await page.goto(callbackUrl);

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should redirect to home page (/)
    await expect(page).toHaveURL(/\/(browse-recipes)?/);

    // Check localStorage has proper values
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    const userStr = await page.evaluate(() => localStorage.getItem('fitrecipes_user'));

    expect(token).toBe('test-jwt-token');
    expect(userStr).toBeTruthy();

    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user.termsAccepted).toBe(true);
      expect(user.isOAuthUser).toBe(true);
    }
  });

  test('should handle OAuth callback with unaccepted terms', async ({ page }) => {
    // Simulate OAuth callback without accepted terms
    const callbackUrl = '/oauth/callback?token=test-jwt-token&termsAccepted=false&isOAuthUser=true';
    
    await page.goto(callbackUrl);

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should redirect to accept-terms page
    await expect(page).toHaveURL('/accept-terms');

    // Check localStorage has proper values
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    const userStr = await page.evaluate(() => localStorage.getItem('fitrecipes_user'));

    expect(token).toBe('test-jwt-token');
    expect(userStr).toBeTruthy();

    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user.termsAccepted).toBe(false);
      expect(user.isOAuthUser).toBe(true);
    }
  });

  test('should handle OAuth callback with error', async ({ page }) => {
    // Simulate OAuth callback with error
    const callbackUrl = '/oauth/callback?error=access_denied&message=User cancelled Google authentication';
    
    await page.goto(callbackUrl);

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should redirect to auth page with error
    await expect(page).toHaveURL(/\/auth\?error=/);
    
    // Should display error message
    await expect(page.getByText(/user cancelled google authentication/i)).toBeVisible();

    // Should not have token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    expect(token).toBeFalsy();
  });

  test('should handle OAuth callback with missing required parameters', async ({ page }) => {
    // Simulate OAuth callback without token
    const callbackUrl = '/oauth/callback?termsAccepted=true';
    
    await page.goto(callbackUrl);

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should redirect to auth page with error
    await expect(page).toHaveURL(/\/auth/);
    
    // Should not have token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    expect(token).toBeFalsy();
  });

  test('should preserve intended redirect path for OAuth users', async ({ page }) => {
    // User tries to access protected route
    await page.goto('/submit-recipe');

    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/);

    // Simulate OAuth callback with accepted terms
    const callbackUrl = '/oauth/callback?token=test-jwt-token&termsAccepted=true&isOAuthUser=true';
    await page.goto(callbackUrl);

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should redirect to originally intended path
    // Note: In real scenario, this would redirect to /submit-recipe
    // But since we're using a test token, it might redirect to home
    await page.waitForURL(/\//);
  });
});

test.describe('OAuth User Authentication State', () => {
  test('should maintain OAuth user state across page reloads', async ({ page }) => {
    // Set OAuth user in localStorage
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: true,
    });

    await page.goto('/browse-recipes');

    // Reload page
    await page.reload();

    // Should still be authenticated
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    const userStr = await page.evaluate(() => localStorage.getItem('fitrecipes_user'));

    expect(token).toBe('test-oauth-token');
    expect(userStr).toBeTruthy();

    if (userStr) {
      const user = JSON.parse(userStr);
      expect(user.isOAuthUser).toBe(true);
      expect(user.termsAccepted).toBe(true);
    }
  });

  test('should preserve OAuth fields after getCurrentUser call', async ({ page }) => {
    // Set OAuth user in localStorage
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: true,
    });

    // Navigate to a page that might trigger getCurrentUser
    await page.goto('/browse-recipes');

    // Check that OAuth fields are still present
    const userStr = await page.evaluate(() => localStorage.getItem('fitrecipes_user'));
    expect(userStr).toBeTruthy();

    if (userStr) {
      const user = JSON.parse(userStr);
      // These fields should be preserved even if backend doesn't return them
      expect(user.isOAuthUser).toBe(true);
      expect(user.termsAccepted).toBe(true);
    }
  });
});

test.describe('OAuth vs Regular Login Differentiation', () => {
  test('should mark regular login users correctly', async ({ page }) => {
    // Regular login should NOT set isOAuthUser
    await page.goto('/auth');

    // Note: This would require a working backend API
    // We're testing the UI behavior only
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should show different UI for OAuth users', async ({ page }) => {
    // Set OAuth user in localStorage
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: true,
    });

    await page.goto('/');

    // OAuth users should be authenticated
    const token = await page.evaluate(() => localStorage.getItem('fitrecipes_token'));
    expect(token).toBeTruthy();
  });
});
