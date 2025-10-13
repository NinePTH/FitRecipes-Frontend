# E2E Tests - FitRecipes Frontend

## 📋 Overview

This directory contains end-to-end (E2E) tests for the FitRecipes frontend application using Playwright. These tests verify complete user workflows across multiple browsers and devices.

## 🧪 Test Suites

### 1. **Authentication Tests** (`auth.spec.ts`)
Tests the login and registration forms:
- ✅ Display login form by default
- ✅ Switch between login and register forms
- ✅ Form validation (required fields)
- ✅ Navigation to forgot password page
- ✅ Navigation to resend verification page
- ✅ Terms link in registration (opens in new tab)
- ✅ Submit button disabled without terms acceptance
- ✅ Password toggle visibility
- ✅ OAuth error handling from URL parameters
- ✅ Accessibility (proper labels, heading hierarchy, keyboard navigation)

**Test Count**: 13 tests

### 2. **OAuth Flow Tests** (`oauth.spec.ts`)
Tests Google OAuth authentication workflow:
- ✅ Display Google Sign-In button on login/register
- ✅ Handle successful OAuth callback with accepted terms
- ✅ Handle OAuth callback with unaccepted terms → redirect to `/accept-terms`
- ✅ Handle OAuth callback with errors
- ✅ Handle missing required parameters
- ✅ Preserve intended redirect path for OAuth users
- ✅ Maintain OAuth user state across page reloads
- ✅ Preserve OAuth fields after `getCurrentUser()` call
- ✅ Differentiate OAuth vs regular login users

**Test Count**: 11 tests

### 3. **Terms Acceptance Tests** (`terms.spec.ts`)
Tests Terms of Service workflows:

**Read-Only Terms Page (`/terms`)**:
- ✅ Display full terms content
- ✅ NO Accept/Decline buttons (read-only)
- ✅ Back navigation button
- ✅ Accessible from signup page in new tab
- ✅ Scrollable content

**OAuth Terms Acceptance Page (`/accept-terms`)**:
- ✅ Redirect unauthenticated users to login
- ✅ Display for OAuth users without accepted terms
- ✅ Show Accept & Continue and Decline & Sign Out buttons
- ✅ Auto-redirect OAuth users who already accepted terms
- ✅ Handle Accept button click
- ✅ Handle Decline button click
- ✅ Preserve intended redirect path after acceptance

**Complete Workflow**:
- ✅ Block OAuth users without accepted terms from protected routes
- ✅ Allow OAuth users with accepted terms to access protected routes
- ✅ Complete OAuth flow with terms acceptance

**Test Count**: 18 tests

### 4. **Protected Routes Tests** (`protected-routes.spec.ts`)
Tests route guards and navigation:

**Authentication Guard**:
- ✅ Redirect unauthenticated users to login
- ✅ Preserve intended path in sessionStorage
- ✅ Allow authenticated users to access protected routes

**OAuth Terms Guard**:
- ✅ Block OAuth users without accepted terms
- ✅ Allow OAuth users with accepted terms
- ✅ NOT block regular users (non-OAuth)

**Role-Based Access**:
- ✅ Allow Chef role to access recipe submission page
- ✅ Block non-Chef users from recipe submission
- ✅ Allow Admin role to access admin pages
- ✅ Block non-Admin users from admin pages

**Navigation**:
- ✅ Redirect to intended path after login
- ✅ Clear intended path after successful navigation
- ✅ Redirect OAuth users to accept-terms before intended path

**Public Routes**:
- ✅ Allow unauthenticated users to access public routes

**Authentication State**:
- ✅ Maintain authentication across page navigation
- ✅ Maintain authentication after page reload
- ✅ Handle logout correctly

**Test Count**: 16 tests

### 5. **404 Not Found Tests** (`404.spec.ts`)
Tests the Not Found error page:

**Basic Functionality**:
- ✅ Display 404 page for undefined routes
- ✅ Have FitRecipes branding
- ✅ "Go Back" button navigates back in history
- ✅ "Back to Home" button navigates to home
- ✅ Display descriptive error message

**User States**:
- ✅ Work for authenticated users
- ✅ Work for OAuth users

**Navigation Behavior**:
- ✅ Go back in history when clicking "Go Back"
- ✅ Handle "Go Back" when no history exists
- ✅ Navigate to home from 404

**404 vs Protected Routes**:
- ✅ Show 404 for invalid routes (not redirect to auth)
- ✅ Redirect protected routes to auth (not show 404)
- ✅ Show 404 for misspelled protected routes

**Accessibility**:
- ✅ Proper heading hierarchy
- ✅ Keyboard navigable buttons
- ✅ Proper ARIA labels

**Responsive Design**:
- ✅ Display correctly on mobile
- ✅ Display correctly on tablet
- ✅ Display correctly on desktop

**Test Count**: 18 tests

## 🧰 Test Helpers (`helpers.ts`)

Reusable utilities for E2E tests:

```typescript
// Login to the application
await login(page, 'user@example.com', 'password123');

// Register a new user
await register(page, 'user@example.com', 'password123', 'John', 'Doe');

// Clear browser storage
await clearStorage(page);

// Set authentication state manually
await setAuthToken(page, 'test-token', {
  id: 'user-123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'User',
  isOAuthUser: false,
});

// Wait for API response
await waitForApiResponse(page, '**/api/v1/auth/login');

// Mock API response
await mockApiResponse(page, '**/api/v1/auth/me', {
  id: 'user-123',
  email: 'user@example.com',
  // ...
});
```

## 🚀 Running Tests

### All Browsers
```bash
# Run all E2E tests (all browsers)
npm run test:e2e
```

### Specific Browser
```bash
# Chrome only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# Safari only
npm run test:e2e:webkit
```

### Interactive Mode
```bash
# Open Playwright UI (interactive debugging)
npm run test:e2e:ui

# Run with debugging enabled
npm run test:e2e:debug

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### CI/CD
```bash
# Run all tests (unit + E2E)
npm run test:all
```

## 📊 Test Statistics

- **Total Test Files**: 5
- **Total Test Cases**: 76+
- **Browsers Tested**: 5 (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- **Coverage Areas**:
  - ✅ Authentication flows
  - ✅ OAuth integration
  - ✅ Terms of Service acceptance
  - ✅ Protected routes and guards
  - ✅ Error handling (404)
  - ✅ Navigation and routing
  - ✅ Accessibility
  - ✅ Responsive design

## 🎯 Test Patterns

### User-Centric Testing
Tests focus on user-visible behavior:
```typescript
// ✅ Good - tests what users see
await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

// ❌ Avoid - tests implementation details
await expect(page.locator('.submit-button')).toBeVisible();
```

### Accessibility-First Queries
Use semantic queries that match how users interact:
```typescript
// Form inputs
page.getByLabel(/email/i)
page.getByLabel(/password/i)

// Buttons and links
page.getByRole('button', { name: /sign in/i })
page.getByRole('link', { name: /terms of service/i })

// Headings
page.getByRole('heading', { name: /sign in/i })
```

### Async/Await Best Practices
```typescript
// ✅ Wait for navigation
await page.goto('/auth');
await page.waitForLoadState('networkidle');

// ✅ Wait for specific condition
await page.waitForURL('/browse-recipes');

// ❌ Avoid hardcoded delays
await page.waitForTimeout(1000); // BAD
```

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
```typescript
{
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
}
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';
import { clearStorage, setAuthToken } from './helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/page');

    // Act
    await page.getByRole('button', { name: /click me/i }).click();

    // Assert
    await expect(page).toHaveURL('/expected-page');
  });
});
```

### Best Practices
1. **Clear storage before each test** to ensure clean state
2. **Use descriptive test names** that explain what's being tested
3. **Group related tests** with `test.describe()`
4. **Use test helpers** to avoid duplication
5. **Test user-visible behavior**, not implementation
6. **Wait for explicit conditions**, not arbitrary timeouts
7. **Test accessibility** with proper ARIA queries

## 🐛 Debugging

### View Test Report
```bash
# After running tests
npx playwright show-report
```

### Debug Specific Test
```bash
# Run one test in debug mode
npx playwright test auth.spec.ts --debug
```

### View Traces
When tests fail in CI, traces are automatically saved. View them with:
```bash
npx playwright show-trace trace.zip
```

## 🎭 CI/CD Integration

Tests automatically run in CI with:
- **Retries**: 2 retries on failure
- **Workers**: Sequential execution in CI (parallel in local)
- **Reporters**: HTML report with traces on failure
- **Dev Server**: Automatically starts before tests

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about#priority)
- [Accessibility Testing with Playwright](https://playwright.dev/docs/accessibility-testing)
