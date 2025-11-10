import { test, expect } from '@playwright/test';
import { clearStorage, setAuthToken } from './helpers';

test.describe('404 Not Found Page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should display 404 page for undefined routes', async ({ page }) => {
    const invalidRoutes = [
      '/this-route-does-not-exist',
      '/random-page',
      '/undefined',
      '/xyz123',
    ];

    for (const route of invalidRoutes) {
      await page.goto(route);
      
      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
      await expect(page.getByText(/page not found/i)).toBeVisible();
    }
  });

  test('should have FitRecipes branding on 404 page', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should display FitRecipes logo or title
    await expect(page.getByText(/fitrecipes/i)).toBeVisible();
  });

  test('should have "Go Back" button that navigates back', async ({ page }) => {
    // Navigate to a valid page first
    await page.goto('/auth');
    
    // Then navigate to invalid page
    await page.goto('/invalid-route');

    // Find and click Go Back button
    const goBackButton = page.getByRole('button', { name: /go back/i });
    await expect(goBackButton).toBeVisible();
    
    await goBackButton.click();

    // Should go back to previous page
    await expect(page).toHaveURL('/auth');
  });

  test('should have "Back to Home" button that navigates to home', async ({ page }) => {
    await page.goto('/invalid-route');

    // Find and click Back to Home button
    const homeButton = page.getByRole('button', { name: /back to home/i });
    await expect(homeButton).toBeVisible();
    
    await homeButton.click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('should display descriptive message for 404', async ({ page }) => {
    await page.goto('/does-not-exist');

    // Should have helpful message
    await expect(page.getByText(/the page you're looking for doesn't exist/i)).toBeVisible();
  });

  test('should work for authenticated users', async ({ page }) => {
    // Set authenticated user
    await setAuthToken(page, 'test-token', {
      id: 'user-123',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'User',
      isOAuthUser: false,
    });

    await page.goto('/invalid-authenticated-route');

    // Should still show 404 page
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();

    // Should have navigation buttons
    await expect(page.getByRole('button', { name: /back to home/i })).toBeVisible();
  });

  test('should work for OAuth users', async ({ page }) => {
    // Set OAuth user
    await setAuthToken(page, 'test-oauth-token', {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      role: 'User',
      isOAuthUser: true,
      termsAccepted: true,
    });

    await page.goto('/invalid-oauth-route');

    // Should still show 404 page
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
  });

  test('should maintain proper layout on 404 page', async ({ page }) => {
    await page.goto('/non-existent');

    // Check for layout elements
    const layout = page.locator('body');
    await expect(layout).toBeVisible();

    // Should have centered content
    const centeredContent = page.locator('.flex.flex-col.items-center');
    await expect(centeredContent).toBeVisible();
  });
});

test.describe('404 Navigation Behavior', () => {
  test('should go back in history when clicking Go Back', async ({ page }) => {
    // Create navigation history
    await page.goto('/auth');
    await page.goto('/terms');
    await page.goto('/invalid-page');

    // Click Go Back
    await page.getByRole('button', { name: /go back/i }).click();

    // Should go to previous page (terms)
    await expect(page).toHaveURL('/terms');
  });

  test('should handle Go Back when no history exists', async ({ page }) => {
    // Navigate directly to 404 (no history)
    await page.goto('/invalid-direct');

    const goBackButton = page.getByRole('button', { name: /go back/i });
    await expect(goBackButton).toBeVisible();

    // Click should still work (might go to home or stay on same page)
    await goBackButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to home from 404', async ({ page }) => {
    await page.goto('/random-invalid-route');

    // Click Back to Home
    await page.getByRole('button', { name: /back to home/i }).click();

    // Should navigate to home
    await expect(page).toHaveURL('/');
  });
});

test.describe('404 vs Protected Route Redirects', () => {
  test('should show 404 for invalid routes, not redirect to auth', async ({ page }) => {
    await clearStorage(page);

    // Invalid route should show 404, not redirect to auth
    await page.goto('/completely-invalid-route');

    // Should show 404 page
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();

    // Should NOT redirect to auth
    await expect(page).toHaveURL('/completely-invalid-route');
  });

  test('should redirect protected routes to auth, not show 404', async ({ page }) => {
    await clearStorage(page);

    // Valid protected route should redirect to auth
    await page.goto('/browse-recipes');

    // Should redirect to auth, not show 404
    await expect(page).toHaveURL(/\/auth/);

    // Should NOT show 404 page
    await expect(page.getByRole('heading', { name: /404/i })).not.toBeVisible();
  });

  test('should show 404 for misspelled protected routes', async ({ page }) => {
    await clearStorage(page);

    // Misspelled protected route should show 404
    const misspelledRoutes = [
      '/browse-recipe', // missing 's'
      '/submit-recip', // missing 'e'
      '/admin/recipe', // missing 's'
    ];

    for (const route of misspelledRoutes) {
      await page.goto(route);
      
      // Should show 404 page
      await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    }
  });
});

test.describe('404 Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/invalid-route');

    // Should have h1 for main title
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should have keyboard navigable buttons', async ({ page }) => {
    await page.goto('/invalid-route');

    // Tab to buttons
    await page.keyboard.press('Tab');

    // At least one button should be focusable
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/invalid-route');

    // Buttons should be properly labeled
    const goBackButton = page.getByRole('button', { name: /go back/i });
    const homeButton = page.getByRole('button', { name: /back to home/i });

    await expect(goBackButton).toBeVisible();
    await expect(homeButton).toBeVisible();
  });
});

test.describe('404 Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/invalid-mobile');

    // Should still show 404 content
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /back to home/i })).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/invalid-tablet');

    // Should still show 404 content
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /back to home/i })).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('/invalid-desktop');

    // Should still show 404 content
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /back to home/i })).toBeVisible();
  });
});
