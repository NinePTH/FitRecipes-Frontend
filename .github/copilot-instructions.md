# GitHub Copilot Repository Instructions – FitRecipes Frontend

This repository contains the frontend of the FitRecipes (Healthy Recipes Web Application), built with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS v3**. This document provides comprehensive instructions for GitHub Copilot to assist in developing, testing, and maintaining features.

---

## 🚀 Tech Stack & Tools

- **Framework**: React 19 with TypeScript (strict mode)
- **Build Tool**: Vite 6 (NOT rolldown-vite - for CI compatibility)
- **Styling**: Tailwind CSS v3 + custom theme (blue color palette)
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context (AuthContext) + hooks
- **HTTP Client**: Axios with custom API wrapper (`src/services/api.ts`)
- **Testing**:
  - **Unit**: Vitest + React Testing Library (26% coverage, target 80%)
  - **E2E**: Playwright (85 tests across 5 browsers: Chrome, Firefox, Safari, Mobile)
- **Code Quality**: ESLint + Prettier + TypeScript strict
- **CI/CD**: GitHub Actions (automated testing, linting, build)
- **Deployment**: Vercel (configured with `vercel.json`)
- **Backend API**: `https://fitrecipes-backend.onrender.com` (Hono.js)

---

## 📁 Project Structure (Current)

```
src/
├── components/
│   ├── ui/                    # Custom UI components (shadcn/ui style)
│   │   ├── button.tsx         # ✅ Button component with variants
│   │   ├── button-variants.ts # ✅ Button styling variants
│   │   ├── input.tsx          # ✅ Input component
│   │   ├── textarea.tsx       # ✅ Textarea component
│   │   ├── card.tsx           # ✅ Card component
│   │   └── [more-components]  # 📋 Label, Select, Dialog, Toast, etc.
│   └── Layout.tsx             # ✅ Main layout with navigation
├── pages/                     # ✅ All 14 pages implemented
│   ├── AuthPage.tsx           # ✅ Login/Register combined
│   ├── ForgotPasswordPage.tsx # ✅ Password reset request
│   ├── ResetPasswordPage.tsx  # ✅ New password with token
│   ├── GoogleCallbackPage.tsx # ✅ OAuth callback handler
│   ├── VerifyEmailPage.tsx    # ✅ Email verification handler
│   ├── ResendVerificationPage.tsx # ✅ Resend verification email
│   ├── AcceptTermsPage.tsx    # ✅ Terms acceptance for OAuth users
│   ├── TermsViewPage.tsx      # ✅ Read-only terms of service
│   ├── NotFoundPage.tsx       # ✅ 404 error page
│   ├── BrowseRecipesPage.tsx  # ✅ Search & browse with filters
│   ├── RecipeDetailPage.tsx   # ✅ Recipe details with ratings
│   ├── RecipeSubmissionPage.tsx # ✅ Recipe submission form
│   ├── AdminRecipeApprovalPage.tsx # ✅ Admin approval interface
│   └── MyRecipesPage.tsx      # ✅ User's recipes
├── services/                  # ✅ Service layer implemented
│   ├── api.ts                 # ✅ API client with error handling
│   └── auth.ts                # ✅ Authentication service
├── types/                     # ✅ Comprehensive type definitions
│   └── index.ts               # ✅ All entities, forms, API types
├── hooks/                     # ✅ Custom hooks
│   └── useAuth.ts             # ✅ Auth context consumer hook
├── contexts/                  # ✅ Global state management
│   └── AuthContext.tsx        # ✅ Global auth state
├── lib/                       # ✅ Utility functions
│   └── utils.ts               # ✅ Class name utilities, helpers
├── test/                      # ✅ Test configuration
│   └── setup.ts               # ✅ Vitest + Testing Library setup
├── App.tsx                    # ✅ Router setup with protected routes
├── App.test.tsx               # ✅ Basic app test
└── main.tsx                   # ✅ App entry point
```


**E2E Tests:**
```
e2e/                         # Playwright E2E tests
├── auth.spec.ts             # ✅ 13 auth flow tests
├── oauth.spec.ts            # ✅ 11 OAuth integration tests
├── terms.spec.ts            # ✅ 18 terms acceptance tests
├── protected-routes.spec.ts # ✅ 16 route protection tests
├── 404.spec.ts              # ✅ 18 404 handling tests
├── helpers.ts               # ✅ Test utilities (login, storage, etc.)
└── README.md                # E2E testing guide
```

---

## ✅ Fully Implemented Features

### 🔐 Authentication System
- **Registration**: Email + password with role selection (Customer/Chef/Admin)
- **Login**: Email/password + JWT token storage
- **Google OAuth 2.0**: "Sign in with Google" flow
- **Email Verification**: Verify email via token link + resend functionality
- **Password Reset**: Forgot password → email → reset with token
- **Session Management**: JWT in `localStorage` (`fitrecipes_token`, `fitrecipes_user`)
- **Protected Routes**: Authentication + role-based access control
- **OAuth Terms Workflow**: Force OAuth users to accept terms on first login
- **Auto-verification**: Check auth status on app mount

### 📄 Pages (All 14 Implemented)
All pages are fully implemented with real API integration and proper error handling.

### 🧩 UI Components (shadcn/ui patterns)
- Button, Input, Textarea, Card, Layout, ProtectedRoute (all production-ready)
- **NOT YET IMPLEMENTED**: Label, Select, Dialog, Toast, Dropdown Menu, Tabs, Accordion, Alert Dialog, Badge, Avatar, Popover, Tooltip, Sheet, Separator, Checkbox, Radio Group, Switch, Slider, Date Picker, Table, Progress, Breadcrumb, Pagination, Command

### 🧪 Testing Infrastructure
- **Unit Tests**: ~26% coverage, co-located with components
- **E2E Tests**: 85 tests, 47 passing / 38 failing (failures indicate incomplete app features, NOT test bugs)
- **CI/CD**: Automated testing on every commit via GitHub Actions
- **Coverage**: Working locally and in CI (using `@vitest/coverage-v8`)

---

## 🎯 Development Guidelines

### Code Style & Standards
1. **TypeScript**: Always use TypeScript strict mode
2. **Components**: Functional components with hooks only (no class components)
3. **Imports**: Use `@/` absolute imports (e.g., `import { Button } from '@/components/ui/button'`)
4. **Testing**: Co-locate test files next to components (`Component.tsx` → `Component.test.tsx`)
5. **Styling**: Tailwind CSS utility classes (mobile-first, no CSS modules)
6. **Naming**:
   - Components: PascalCase (`AuthPage.tsx`)
   - Files: kebab-case for utilities (`button-variants.ts`)
   - Hooks: camelCase starting with `use` (`useAuth.ts`)
7. **Exports**: Use named exports for components, default exports for pages

### Backend Integration
- **Base URL**: `https://fitrecipes-backend.onrender.com`
- **API Wrapper**: Always use `src/services/api.ts` (`apiClient.get/post/put/delete`)
- **Response Format**: Backend returns `{ success: boolean, data?: T, message?: string, errors?: string[] }`
- **Error Handling**: API wrapper throws `ApiError` with structured error info
- **Auth Headers**: API wrapper automatically attaches JWT token from localStorage
- **Storage Keys**:
  - Token: `fitrecipes_token`
  - User: `fitrecipes_user`

### State Management
- **Global Auth State**: Use `AuthContext` (accessed via `useAuth()` hook)
- **No Redux/Zustand**: Keep it simple with React Context for now
- **Future**: Consider React Query/SWR for server state caching

### Routing & Navigation
- **Router**: `BrowserRouter` in `App.tsx` (do NOT wrap in tests)
- **Protected Routes**: Use `<ProtectedRoute>` component with `allowedRoles` prop
- **Navigation**: Use `useNavigate()` hook, NOT `<Link>` for programmatic navigation
- **Redirects**:
  - Unauthenticated → `/auth`
  - After login → home or `sessionStorage.intendedPath`
  - After OAuth → `/accept-terms` if terms not accepted

### Testing Strategy
- **Co-located tests**: Place test files next to their components
- **Vitest + React Testing Library** for unit and integration tests
- **Coverage target**: Aim for >80% test coverage
- **Test types**: Component tests, page tests, service tests, hook tests

#### Unit Tests (Vitest + React Testing Library)
- **Location**: Co-located with components (`Component.test.tsx`)
- **Run**: `npm test` (watch mode) or `npm run test:coverage` (coverage report)
- **Best Practices**:
  - DO NOT wrap App in `<BrowserRouter>` (already in App.tsx)
  - Use `render()` from `@testing-library/react` directly
  - Use `screen.getByRole()` for queries (accessibility-first)
  - Mock API calls with `vi.mock('src/services/...')`
  - Test user interactions with `userEvent` from `@testing-library/user-event`

#### E2E Tests (Playwright)
- **Location**: `e2e/*.spec.ts`
- **Run**: `npm run test:e2e:chromium` (single browser) or `npm run test:e2e` (all browsers)
- **Key Points**:
  - Use `helpers.ts` for common operations (login, storage, etc.)
  - Tests use `fitrecipes_token` and `fitrecipes_user` localStorage keys
  - 38 failing tests indicate incomplete app features (protected routes, OAuth callback logic, terms acceptance)
  - Failures are NOT test bugs - they're feature requirements

### Styling & UI
- **Tailwind CSS**: Use utility classes, follow mobile-first approach
- **Custom Components**: Build on shadcn/ui patterns, ensure consistency
- **Color Palette**: Use the configured primary color scheme (blue tones)
- **Responsive**: Ensure all components work on mobile, tablet, desktop
- **Accessibility**:
  - Use semantic HTML
  - ARIA labels for icons and interactive elements
  - Keyboard navigation support
  - Focus states visible
- **Forms**:
  - Use `<label>` with `htmlFor`
  - Show validation errors below inputs
  - Disable submit buttons during loading

---

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (includes TypeScript check)
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Prettier format
npm run format:check # Check formatting without fixing
```

---

## 🎯 Implementation Status

### ✅ **Completed (Ready for Use)**
- Project setup with Vite 6 + React 19 + TypeScript
- Tailwind CSS v3 configuration with custom theme and plugins
- All 14 pages with full authentication implementation
- UI component library (Button, Input, Textarea, Card) with shadcn/ui patterns
- Service layer for API calls and authentication
- Comprehensive type definitions for all entities and APIs
- Test setup with Vitest + React Testing Library + coverage reporting
- ESLint (with coverage folder ignored) + Prettier configuration
- GitHub Actions CI/CD pipeline (fixed for standard Vite compatibility)
- Vercel deployment configuration

### 📋 **Next Steps (Development Priorities)**
1. **Backend Integration**: Connect recipe features to actual API endpoints
2. **Form Validation**: Add comprehensive validation to all forms
3. **State Management**: Implement React Query or SWR for server state
4. **Enhanced Testing**: Add tests for all components and pages
5. **Accessibility**: Complete ARIA labels and keyboard navigation
6. **Performance**: Implement code splitting and lazy loading
7. **Error Handling**: Add global error boundaries and user feedback

### 🚧 **Features with Placeholder Code (Do NOT Implement Yet)**
- **UI Components**: Additional shadcn/ui components (Label, Select, Dialog, Dropdown Menu, Tabs, Accordion, Alert Dialog, Toast, Badge, Avatar, Popover, Tooltip, Sheet, Separator, Checkbox, Radio Group, Switch, Slider, Date Picker, Table, Progress, Breadcrumb, Pagination, Command)
- **Features**: Notifications system, Save Recipe functionality, Reporting and analytics
- **Advanced Features**: Advanced search filters, User profile management, Infinite scroll, Image upload

---

## 🛡️ Quality Standards

### Test Coverage Status
- **Current Coverage**: ~26.5% overall (focusing on core UI components)
- **Target Coverage**: >80% for production readiness
- **Test Infrastructure**: ✅ Fully configured and working locally and in CI

### Performance Requirements
- Load times:
  - Browse page list: < 5 seconds
  - Recipe detail page: < 3 seconds
  - Recipe submission: < 2 seconds
  - Comments/ratings: < 2–3 seconds

### Security Requirements
- Sanitize all user inputs
- Prevent XSS/CSRF attacks
- Implement proper authentication headers
- Validate data on both client and server

### Compatibility Requirements
- **Browsers**: Chrome, Edge, Safari (latest 2 versions)
- **Devices**: Desktop, tablet, mobile (responsive design)
- **Accessibility**: WCAG 2.1 AA compliance

---

## 📝 API Endpoints Reference

### Authentication (`src/services/auth.ts`)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/logout` - Logout (clear token)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - OAuth callback handler
- `GET /api/v1/auth/verify-email?token=...` - Verify email
- `POST /api/v1/auth/resend-verification` - Resend verification email

### Recipes (placeholder implementations)
- `GET /api/v1/recipes` - Browse recipes
- `GET /api/v1/recipes/:id` - Get recipe details
- `POST /api/v1/recipes` - Submit recipe (Chef only)
- `PUT /api/v1/recipes/:id` - Update recipe
- `DELETE /api/v1/recipes/:id` - Delete recipe

### Admin (placeholder)
- `GET /api/v1/admin/recipes/pending` - Get pending recipes
- `PUT /api/v1/admin/recipes/:id/approve` - Approve recipe
- `PUT /api/v1/admin/recipes/:id/reject` - Reject recipe

---

## 🛠️ Known Issues & Solutions

### Build & CI/CD
- ✅ **Native binding errors with rolldown-vite** → Using standard Vite v6
- ✅ **Coverage dependency missing** → `@vitest/coverage-v8` installed
- ✅ **Test environment issues** → Configured with `pool: 'forks'` and jsdom

### Code Quality
- ✅ **ESLint warnings in coverage folder** → Coverage ignored in `.gitignore` and `eslint.config.js`
- ✅ **Prettier inconsistencies** → Run `npm run format` then `npm run format:check`

### Testing
- ✅ **Router conflicts** → App.tsx includes BrowserRouter, tests don't need to wrap it
- ✅ **localStorage SecurityError in E2E** → Fixed with `page.goto()` before storage access in helpers
- ✅ **Co-located tests** → Following React best practices

### Current E2E Test Status
- **47 passing / 38 failing** (55% pass rate)
- Failures are expected and indicate incomplete app features:
  - OAuth callback page needs full implementation
  - Protected route redirects need enhancement
  - Terms acceptance page logic incomplete
  - Some UI components have wrong heading levels

---

## 🚧 Features NOT Yet Implemented (Do NOT code these without explicit request)

### UI Components (shadcn/ui)
- Label, Select, Dialog, Toast, Dropdown Menu, Tabs, Accordion, Alert Dialog
- Badge, Avatar, Popover, Tooltip, Sheet, Separator
- Checkbox, Radio Group, Switch, Slider, Date Picker
- Table, Progress, Breadcrumb, Pagination, Command

### Features
- Notifications system (toast/alerts)
- Recipe save/bookmark functionality
- Advanced search filters (auto-suggest ingredients)
- Infinite scroll pagination (currently placeholder)
- Image upload for recipes
- User profile management
- Recipe rating/comment backend integration (currently placeholder)

---

## 📚 Important Files to Reference

- **Type Definitions**: `src/types/index.ts` (User, Recipe, API responses, etc.)
- **API Client**: `src/services/api.ts` (axios wrapper, error handling)
- **Auth Service**: `src/services/auth.ts` (all auth methods)
- **Auth Context**: `src/contexts/AuthContext.tsx` (global auth state)
- **Protected Route**: `src/components/ProtectedRoute.tsx` (route guard logic)
- **Tailwind Config**: `tailwind.config.js` (custom theme, colors, plugins)
- **Vitest Config**: `vite.config.ts` (test setup, coverage)
- **Playwright Config**: `playwright.config.ts` (E2E test configuration)

---

## 🎯 Role-Based Access Control

| Role     | Permissions                                              |
|----------|----------------------------------------------------------|
| Customer | Browse recipes, view details, rate, comment              |
| Chef     | All Customer permissions + submit recipes                |
| Admin    | All permissions + approve/reject recipes, manage users   |

**Implementation**: Use `<ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>` in `App.tsx`

---

## 🌐 Environment Variables

Create `.env.local`:

```env
VITE_API_BASE_URL=https://fitrecipes-backend.onrender.com
VITE_FRONTEND_URL=http://localhost:5173
VITE_DEBUG=false
```

**IMPORTANT**: Never commit `.env.local` (it's in `.gitignore`)

---

## 📖 Additional Documentation

- **[README.md](../README.md)** - Project overview, setup, deployment
- **[TESTING.md](../TESTING.md)** - Comprehensive testing guide
- **[AUTHENTICATION.md](../AUTHENTICATION.md)** - Auth system documentation
- **[CHANGELOG.md](../CHANGELOG.md)** - Technical decisions and changes
- **[e2e/README.md](../e2e/README.md)** - E2E testing guide

---

## ⚠️ Critical Rules for GitHub Copilot

1. **NEVER use rolldown-vite** - Use standard Vite v6 for CI compatibility
2. **NEVER wrap App in BrowserRouter in tests** - It's already in App.tsx
3. **ALWAYS use `@/` imports** - Not relative paths (`../..`)
4. **ALWAYS use fitrecipes_token and fitrecipes_user** - Not `token` and `user`
5. **ALWAYS check E2E helpers before localStorage access** - Must call `page.goto()` first
6. **NEVER implement shadcn/ui components without request** - Avoid over-engineering
7. **ALWAYS use TypeScript strict mode** - No `any` types
8. **ALWAYS use apiClient from src/services/api.ts** - Not raw axios
9. **ALWAYS use useAuth() hook for auth** - Not direct context access
10. **ALWAYS write tests for new features** - Co-located unit tests + E2E if needed

---

**Last Updated**: October 13, 2025  
**Current Status**: Authentication complete, E2E tests working (55% pass rate), ready for recipe feature development

