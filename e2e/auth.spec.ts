import { test, expect } from '@playwright/test';
import { clearStorage } from './helpers';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  // test('should display login form by default', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Check page title and elements
  //   await expect(page.getByText('Sign In')).toBeVisible();
  //   await expect(page.getByLabel(/email/i)).toBeVisible();
  //   await expect(page.getByLabel(/password/i)).toBeVisible();
  //   await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
  //   // Check Google OAuth button
  //   await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
  // });

  // test('should switch between login and register forms', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Should show login form initially
  //   await expect(page.getByText('Sign In')).toBeVisible();
  //   await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

  //   // Click "Sign up" button
  //   await page.getByRole('button', { name: /sign up/i }).click();

  //   // Should show register form
  //   await expect(page.getByText('Create Account')).toBeVisible();
  //   await expect(page.getByLabel(/first name/i)).toBeVisible();
  //   await expect(page.getByLabel(/last name/i)).toBeVisible();
  //   await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();

  //   // Switch back to login
  //   await page.getByRole('button', { name: /sign in/i }).click();
  //   await expect(page.getByText('Sign In')).toBeVisible();
  // });

  // test('should show validation error for empty login form', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Try to submit without filling form
  //   await page.getByRole('button', { name: /Sign In/i, exact: true }).click();

  //   // HTML5 validation should prevent submission
  //   const emailInput = page.getByLabel(/email/i);
  //   await expect(emailInput).toHaveAttribute('required');
  // });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth');

    // Click forgot password link
    await page.getByRole('link', { name: /forgot your password/i }).click();

    // Should navigate to forgot password page
    await expect(page).toHaveURL('/forgot-password');
    await expect(page.getByText(/forgot password/i)).toBeVisible();
  });

  test('should navigate to resend verification page', async ({ page }) => {
    await page.goto('/auth');

    // Click resend verification link
    await page.getByRole('link', { name: /didn't receive verification email/i }).click();

    // Should navigate to resend verification page
    await expect(page).toHaveURL('/resend-verification');
  });

  // test('should show terms of service link in registration', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Switch to register form
  //   await page.getByRole('button', { name: /sign up/i }).click();

  //   // Check terms link
  //   const termsLink = page.getByRole('link', { name: /terms of service and privacy policy/i });
  //   await expect(termsLink).toBeVisible();
  //   await expect(termsLink).toHaveAttribute('href', '/terms');
  //   await expect(termsLink).toHaveAttribute('target', '_blank');
  // });

  test('should disable submit button without terms acceptance', async ({ page }) => {
    await page.goto('/auth');

    // Switch to register form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Fill all fields except terms checkbox
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/^password/i).fill('password123');

    // Submit button should be disabled
    const submitButton = page.getByRole('button', { name: /create account/i });
    await expect(submitButton).toBeDisabled();

    // Check terms checkbox
    await page.getByLabel(/agree to the terms/i).check();

    // Submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should show password toggle button', async ({ page }) => {
    await page.goto('/auth');

    const passwordInput = page.getByLabel(/^password/i);
    
    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button (eye icon)
    await page.locator('button:has-text("")').filter({ has: page.locator('svg') }).first().click();

    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should handle OAuth error from URL parameters', async ({ page }) => {
    await page.goto('/auth?error=oauth_failed&message=Google authentication failed');

    // Should display error message
    await expect(page.getByText(/google authentication failed/i)).toBeVisible();
  });

  // test('should display loading state during form submission', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Fill login form with dummy data
  //   await page.getByLabel(/email/i).fill('test@example.com');
  //   await page.getByLabel(/password/i).fill('password123');

  //   // Submit form
  //   const submitButton = page.getByRole('button', { name: /sign in/i });
  //   await submitButton.click();

  //   // Should show loading text (may be brief)
  //   // Note: This might be too fast to catch in real scenarios
  //   // await expect(page.getByRole('button', { name: /please wait/i })).toBeVisible();
  // });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should require all fields for registration', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: /sign up/i }).click();

    // Check required attributes
    await expect(page.getByLabel(/first name/i)).toHaveAttribute('required');
    await expect(page.getByLabel(/last name/i)).toHaveAttribute('required');
    await expect(page.getByLabel(/email/i)).toHaveAttribute('required');
    await expect(page.getByLabel(/^password/i)).toHaveAttribute('required');
  });

  test('should show password requirements', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should show password hint
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should have FitRecipes logo linking to home', async ({ page }) => {
    await page.goto('/auth');

    // Check logo link
    const logoLink = page.getByRole('link').filter({ has: page.getByText('FitRecipes') });
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toHaveAttribute('href', '/');
  });
});

test.describe('Accessibility', () => {
  test('should have proper form labels', async ({ page }) => {
    await page.goto('/auth');

    // All inputs should have associated labels
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  // test('should have proper heading hierarchy', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Check for proper headings
  //   const heading = page.getByRole('heading', { level: 2 });
  //   await expect(heading).toBeVisible();
  // });

  // test('should be keyboard navigable', async ({ page }) => {
  //   await page.goto('/auth');

  //   // Tab through form elements
  //   await page.keyboard.press('Tab');
  //   await expect(page.getByLabel(/email/i)).toBeFocused();

  //   await page.keyboard.press('Tab');
  //   await expect(page.getByLabel(/password/i)).toBeFocused();
  // });
});
