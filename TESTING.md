# Testing Guide - FitRecipes Frontend

## 📁 Test File Organization

### Current Structure (Recommended)
```
src/
├── App.tsx
├── App.test.tsx                    ← Co-located with component
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Button.test.tsx         ← Future component tests
│       ├── Input.tsx
│       └── Input.test.tsx
├── pages/
│   ├── AuthPage.tsx
│   ├── AuthPage.test.tsx           ← Future page tests
│   ├── BrowseRecipesPage.tsx
│   └── BrowseRecipesPage.test.tsx
└── test/
    └── setup.ts                    ← Test configuration only

e2e/
├── helpers.ts                      ← E2E test helpers
├── auth.spec.ts                    ← Authentication tests
├── oauth.spec.ts                   ← OAuth flow tests
├── terms.spec.ts                   ← Terms acceptance tests
├── protected-routes.spec.ts        ← Route guard tests
└── 404.spec.ts                     ← Not found page tests
```

## 🎯 Testing Layers

### 1. **Unit Tests** (Vitest + React Testing Library)
- Test individual components in isolation
- Fast execution, run on every save
- Located next to components (`*.test.tsx`)

### 2. **E2E Tests** (Playwright)
- Test complete user workflows
- Run in real browsers (Chrome, Firefox, Safari)
- Located in `/e2e` directory (`*.spec.ts`)

## 🎯 Why Co-located Tests?

### ✅ **Benefits of Current Approach:**

1. **Easy Discovery**: Tests are immediately visible next to their components
2. **Simplified Imports**: Shorter import paths (`./Component` vs `../../../Component`)
3. **Better Maintenance**: When modifying a component, its test is right there
4. **Industry Standard**: Most React projects follow this pattern
5. **Vite/Vitest Default**: Built-in support for this structure

### 📋 **Naming Conventions:**
- **Unit Tests**: `ComponentName.test.tsx` (next to component)
- **E2E Tests**: `feature-name.spec.ts` (in `/e2e` directory)
- **Hook Tests**: `useHookName.test.ts`
- **Utility Tests**: `utilityName.test.ts`

---

## 🌐 End-to-End Testing (Playwright)

### 📦 Setup & Configuration

#### Installation
Playwright is already installed with multi-browser support:
```bash
npm install -D @playwright/test @axe-core/playwright
```

#### Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
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

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 🧰 Test Helpers (`e2e/helpers.ts`)

We've created reusable helpers for common E2E operations:

```typescript
// Login helper
export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

// Set authentication state
export async function setAuthToken(page: Page, token: string, user: User) {
  await page.goto('/auth');
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    { token, user }
  );
}

// Clear storage
export async function clearStorage(page: Page) {
  await page.goto('/auth');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
```

### 📝 Test Suites

#### 1. **Authentication Tests** (`e2e/auth.spec.ts`)
Tests for login, registration, and authentication flows:
- Display login/register forms
- Form validation
- Password toggle visibility
- Navigation to forgot password
- Terms checkbox requirement
- OAuth error handling

#### 2. **OAuth Flow Tests** (`e2e/oauth.spec.ts`)
Tests for Google OAuth authentication:
- Google Sign-In button display
- OAuth callback handling (success/error)
- Terms acceptance parameter parsing
- OAuth user state persistence
- Intended redirect path preservation

#### 3. **Terms Acceptance Tests** (`e2e/terms.spec.ts`)
Tests for Terms of Service workflows:
- Read-only `/terms` page (no action buttons)
- OAuth `/accept-terms` page (with Accept/Decline)
- Auto-redirect for users with accepted terms
- Protected route blocking without terms
- Complete OAuth + terms flow

#### 4. **Protected Routes Tests** (`e2e/protected-routes.spec.ts`)
Tests for route guards and navigation:
- Authentication redirect for unauthenticated users
- OAuth terms guard (block without acceptance)
- Role-based access control (Chef, Admin)
- Intended path preservation after login
- Public routes accessibility

#### 5. **404 Page Tests** (`e2e/404.spec.ts`)
Tests for Not Found page:
- Display for undefined routes
- "Go Back" and "Back to Home" buttons
- Proper 404 vs auth redirect behavior
- Responsive design
- Accessibility

### 🚀 Running E2E Tests

#### Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run with debugging
npm run test:e2e:debug

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run all tests (unit + E2E)
npm run test:all
```

#### CI/CD Integration
E2E tests are configured to run in CI with:
- Retries on failure (2 retries)
- Single worker (sequential execution)
- HTML reporter with trace on failure
- Automatic dev server startup

### 📊 E2E Test Coverage

#### ✅ **Implemented:**
- **Authentication**: 10+ tests covering login/register forms
- **OAuth**: 10+ tests covering Google sign-in flow
- **Terms**: 15+ tests covering acceptance workflow
- **Protected Routes**: 10+ tests covering route guards
- **404 Page**: 15+ tests covering error handling

#### 🎯 **Test Scenarios Covered:**
- ✅ Login and registration flows
- ✅ Google OAuth callback handling
- ✅ Terms acceptance for OAuth users
- ✅ Auto-redirect logic
- ✅ Protected route authentication
- ✅ OAuth terms guard blocking
- ✅ Role-based access control
- ✅ 404 page navigation
- ✅ Intended path preservation
- ✅ localStorage/sessionStorage management
- ✅ Form validation
- ✅ Accessibility (keyboard navigation, ARIA)
- ✅ Responsive design (mobile/tablet/desktop)

### 🎭 Writing E2E Tests

#### Example: Authentication Test
```typescript
test('should display login form by default', async ({ page }) => {
  await page.goto('/auth');

  await expect(page.getByText('Sign In')).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});
```

#### Example: OAuth Flow Test
```typescript
test('should handle OAuth callback with accepted terms', async ({ page }) => {
  const callbackUrl = '/oauth/callback?token=test-jwt&termsAccepted=true&isOAuthUser=true';
  
  await page.goto(callbackUrl);
  await page.waitForLoadState('networkidle');

  // Should redirect to home
  await expect(page).toHaveURL(/\/(browse-recipes)?/);

  // Check localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBe('test-jwt');
});
```

#### Example: Using Test Helpers
```typescript
test('should allow authenticated users to access protected routes', async ({ page }) => {
  // Use helper to set auth state
  await setAuthToken(page, 'test-token', {
    id: 'user-123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'User',
    isOAuthUser: false,
  });

  await page.goto('/browse-recipes');
  await expect(page).toHaveURL('/browse-recipes');
});
```

### 🛡️ E2E Best Practices

#### ✅ Do's
- Use `page.getByRole()` for accessible queries
- Use `page.getByLabel()` for form inputs
- Wait for explicit conditions with `waitForURL()` or `waitForLoadState()`
- Use test helpers to reduce duplication
- Clear storage before each test with `clearStorage()`
- Test user-visible behavior, not implementation details

#### ❌ Don'ts
- Don't rely on CSS selectors (use semantic queries)
- Don't use hardcoded delays (`page.waitForTimeout()`)
- Don't test internal state directly
- Don't skip accessibility in tests
- Don't forget to clean up after tests

### 🎨 Accessibility Testing with Playwright

```typescript
import { test as base } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/auth');
  await injectAxe(page);
  await checkA11y(page);
});
```

---

## 🛠️ Test Configuration

### Vitest Setup
Our `vite.config.ts` is configured to find tests with these patterns:
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
}
```

### Test Setup File (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom'
```
This provides additional Jest DOM matchers for better assertions.

## 🧪 Writing Tests

### Current Test Example (App.test.tsx)
```typescript
// src/App.test.tsx (Current implementation)
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    
    // Should render the browse recipes page for authenticated users
    expect(screen.getByText(/Discover Healthy Recipes/i)).toBeInTheDocument()
  })
})
```

### Component Test Example (Future)
```typescript
// src/components/ui/Button.test.tsx (Future example)
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Page Test Example
```typescript
// src/pages/AuthPage.test.tsx (Future example)
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AuthPage } from './AuthPage'

describe('AuthPage', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    )
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})
```

## 🚀 Running Tests

### Commands
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Scripts in package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui", 
    "test:coverage": "vitest --coverage"
  }
}
```

**Note**: The main `test` script runs in watch mode by default. Use `npx vitest run` for single execution.

## 📊 Test Types to Implement

### 1. **Component Tests** (Unit)
- Test individual UI components
- Props handling, event handlers, rendering states
- Example: Button, Input, Card components

### 2. **Page Tests** (Integration)
- Test complete page functionality
- User interactions, form submissions
- Example: AuthPage, BrowseRecipesPage

### 3. **Hook Tests** (Unit)
- Test custom React hooks
- State management, side effects
- Example: useAuth, useRecipes (future)

### 4. **Service Tests** (Unit)
- Test API calls, authentication logic
- Mock external dependencies
- Example: api.ts, auth.ts

### 5. **E2E Tests** (Future - Playwright/Cypress)
- Test complete user workflows
- Cross-browser compatibility
- Full application integration

## 🔧 Testing Best Practices

### ✅ **Do's:**
- Use descriptive test names
- Test user behavior, not implementation details
- Use proper accessibility queries (`getByRole`, `getByLabelText`)
- Mock external dependencies
- Keep tests simple and focused

### ❌ **Don'ts:**
- Don't test implementation details
- Don't test third-party libraries
- Don't write overly complex test setups
- Don't forget to clean up after tests

## 📚 Testing Tools & Libraries

### Core Testing Stack
- **Vitest**: Fast test runner (Vite-native)
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Additional DOM matchers
- **User Event**: Simulate user interactions

### Additional Tools (Available)
- **MSW**: Mock Service Worker for API mocking
- **Faker**: Generate fake data for tests
- **Testing Library Queries**: Accessibility-focused queries

## 🎯 Current Test Status

### ✅ **Implemented:**
- **Unit Tests**:
  - App component test with Router integration
  - Test configuration and setup (Vitest + React Testing Library)
  - Coverage reporting with @vitest/coverage-v8
  - ESLint integration (coverage folder ignored)
  - Co-located test structure established

- **E2E Tests** (Playwright):
  - ✅ **Authentication Flow** (10+ tests): Login/register forms, validation, navigation
  - ✅ **OAuth Google Sign-In** (10+ tests): Callback handling, error states, user state
  - ✅ **Terms Acceptance** (15+ tests): View-only page, acceptance workflow, auto-redirect
  - ✅ **Protected Routes** (10+ tests): Auth guards, OAuth terms guard, role-based access
  - ✅ **404 Not Found** (15+ tests): Error page, navigation, responsive design
  - ✅ Multi-browser testing (Chrome, Firefox, Safari, Mobile)
  - ✅ Test helpers for authentication and storage management
  - ✅ Accessibility testing setup with @axe-core/playwright

### 📊 **Current Coverage:**
- **Unit Tests**:
  - Overall: ~26.51% statement coverage
  - Components: Button, Input utilities at 100%
  - Pages: Placeholder pages with basic rendering coverage
  - Services: 0% (not tested yet, placeholder implementations)

- **E2E Tests**:
  - **60+ test cases** covering critical user workflows
  - Authentication: ✅ Complete
  - OAuth Flow: ✅ Complete
  - Terms Acceptance: ✅ Complete
  - Protected Routes: ✅ Complete
  - 404 Page: ✅ Complete

### 📋 **To Implement (Unit Tests):**
- **Current Components**: Tests for Button, Input, Textarea, Card components
- **Future Components**: Tests for Label, Select, Dialog, Toast, Badge, Avatar, and other shadcn/ui components as they're added
- **Page Tests**: All 5 main pages with user interactions and form validation
- **Service Tests**: API and auth services when connected to backend
- **Hook Tests**: Custom hooks when implemented
- **Integration Tests**: Router navigation, form submissions, user workflows

## 🔍 Test File Locations Summary

| Test Type | Location | Example |
|-----------|----------|---------|
| App Tests | `src/App.test.tsx` | ✅ Current |
| Component Tests | `src/components/ui/Button.test.tsx` | 📋 Future |
| Page Tests | `src/pages/AuthPage.test.tsx` | 📋 Future |
| Service Tests | `src/services/api.test.ts` | 📋 Future |
| Hook Tests | `src/hooks/useAuth.test.ts` | 📋 Future |
| Test Utils | `src/test/setup.ts` | ✅ Current |

---

**Remember**: The co-located approach keeps tests close to the code they test, making the codebase more maintainable and easier to navigate! 🚀