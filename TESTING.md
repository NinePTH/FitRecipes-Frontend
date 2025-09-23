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
```

## 🎯 Why Co-located Tests?

### ✅ **Benefits of Current Approach:**

1. **Easy Discovery**: Tests are immediately visible next to their components
2. **Simplified Imports**: Shorter import paths (`./Component` vs `../../../Component`)
3. **Better Maintenance**: When modifying a component, its test is right there
4. **Industry Standard**: Most React projects follow this pattern
5. **Vite/Vitest Default**: Built-in support for this structure

### 📋 **Naming Conventions:**
- **Component Tests**: `ComponentName.test.tsx`
- **Page Tests**: `PageName.test.tsx`
- **Hook Tests**: `useHookName.test.ts`
- **Utility Tests**: `utilityName.test.ts`

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
- App component test with Router integration
- Test configuration and setup (Vitest + React Testing Library)
- Coverage reporting with @vitest/coverage-v8
- ESLint integration (coverage folder ignored)
- Co-located test structure established

### 📊 **Current Coverage:**
- **Overall**: ~26.51% statement coverage
- **Components**: Button, Input utilities at 100%
- **Pages**: Placeholder pages with basic rendering coverage
- **Services**: 0% (not tested yet, placeholder implementations)

### 📋 **To Implement:**
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