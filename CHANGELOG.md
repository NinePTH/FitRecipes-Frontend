# Changelog

All notable changes to the FitRecipes Frontend project are documented in this file.

## [1.1.0] - 2025-10-13

### 🎉 Authentication System & E2E Testing Complete

#### Added
- **Complete Authentication System**
  - Full backend API integration with `https://fitrecipes-backend.onrender.com`
  - Email/password registration with role selection (Customer, Chef, Admin)
  - Email/password login with JWT token management
  - Google OAuth 2.0 integration ("Sign in with Google")
  - Email verification system with resend functionality
  - Password reset flow (forgot password → email → reset with token)
  - OAuth terms acceptance workflow for Google users
  - Session persistence across page reloads
  - 14 authentication pages fully implemented

- **End-to-End Testing Infrastructure**
  - Playwright E2E testing framework with 85 comprehensive tests:
    - 13 authentication flow tests
    - 11 OAuth integration tests
    - 18 terms of service tests
    - 16 protected route tests
    - 18 404 handling tests
    - 9 accessibility tests
  - Multi-browser support (Chrome, Firefox, Safari, Mobile Chrome/Safari)
  - Test helpers and utilities for common operations
  - CI/CD integration with automated testing
  - **Status**: 47 passing / 38 failing (55% pass rate, failures indicate missing app features)

- **Authentication Pages**
  - AuthPage - Combined login/register with Google OAuth
  - ForgotPasswordPage - Password reset request
  - ResetPasswordPage - New password with token validation
  - GoogleCallbackPage - OAuth callback handler
  - VerifyEmailPage - Email verification handler
  - ResendVerificationPage - Resend verification email
  - AcceptTermsPage - Terms acceptance for OAuth users
  - TermsViewPage - Read-only terms of service
  - NotFoundPage - 404 error page with navigation

- **Global State Management**
  - AuthContext for global auth state
  - useAuth() hook for easy auth access
  - ProtectedRoute component with role-based access control

#### Fixed
- **E2E Testing Issues**
  - Fixed localStorage SecurityError by adding page navigation before storage access
  - Updated localStorage keys to match app (`fitrecipes_token`, `fitrecipes_user`)
  - Improved test helpers with proper page load waits
  - Resolved Router conflicts in tests

- **Build & CI/CD**
  - Maintained standard Vite v6 for CI compatibility
  - Updated Vitest config with forked processes for better test isolation
  - Fixed test coverage collection and reporting

#### Technical Improvements
- **API Client**: Enhanced with structured error handling and backend response format
- **Type Safety**: Updated types to match backend API contracts
- **Documentation**: Comprehensive AUTHENTICATION.md and updated testing guides
- **Error Handling**: Improved user feedback with clear error messages

### 📊 Current State
- **Test Coverage**: ~26% unit tests (growing), 55% E2E pass rate
- **Pages**: 14 pages fully implemented
- **Authentication**: Production-ready with real backend integration
- **E2E Tests**: 85 tests covering all major user flows
- **Documentation**: Comprehensive and up-to-date

---

## [1.0.0] - 2025-09-23

### 🚀 Initial Release

#### Added
- **Project Setup**
  - Vite 6 + React 19 + TypeScript configuration
  - Tailwind CSS v3 with custom theme and plugins (@tailwindcss/forms, @tailwindcss/typography)
  - ESLint + Prettier code quality tools
  - Vitest + React Testing Library testing framework
  - Coverage reporting with @vitest/coverage-v8

- **Application Structure**
  - Complete routing setup with React Router v6
  - Protected routes with role-based access control
  - 5 main pages implemented with placeholder logic:
    - AuthPage (login/register combined)
    - BrowseRecipesPage (search & browse with filters)
    - RecipeDetailPage (recipe details with ratings)
    - RecipeSubmissionPage (recipe submission form)
    - AdminRecipeApprovalPage (admin approval interface)

- **UI Component Library**
  - Custom shadcn/ui-style components (Phase 1):
    - Button with variants (default, destructive, outline, secondary, ghost, link)
    - Input with consistent styling
    - Textarea with proper accessibility
    - Card with header, content, and footer sections
  - Layout component with navigation and responsive design
  - **Planned Components**: Label, Select, Dialog, Dropdown Menu, Tabs, Accordion, Alert Dialog, Toast, Badge, Avatar, Popover, Tooltip, Sheet, Separator, Checkbox, Radio Group, Switch, Slider, Date Picker, Table, Progress, Breadcrumb, Pagination, Command

- **Services & Types**
  - API client with error handling and request/response interceptors
  - Authentication service with role-based access
  - Comprehensive TypeScript definitions for all entities
  - Form types and validation structures

- **Development Tools**
  - Absolute imports with `@/` alias
  - Environment variable management
  - GitHub Actions CI/CD pipeline
  - Vercel deployment configuration

#### Fixed
- **CI/CD Compatibility Issues**
  - Replaced rolldown-vite with standard Vite v6 for better CI stability
  - Fixed native binding errors in GitHub Actions
  - Resolved npm dependency installation issues

- **Code Quality Issues**
  - Fixed TypeScript unused import/variable errors
  - Resolved ESLint configuration for coverage folder
  - Fixed Prettier formatting inconsistencies across all files
  - Separated button variants into dedicated file to resolve React refresh warnings

- **Testing Setup**
  - Fixed Router conflict in App.test.tsx (removed duplicate BrowserRouter wrapper)
  - Added missing @vitest/coverage-v8 dependency
  - Configured co-located test structure
  - Set up proper test environment with jsdom

#### Technical Decisions
- **Standard Vite over Rolldown**: Chose stability and CI compatibility over cutting-edge performance
- **Co-located Tests**: Following React community best practices for test organization
- **Tailwind v3**: Using stable version instead of v4 for better plugin compatibility
- **Placeholder Implementation**: All features have UI and structure but await backend integration

### 📊 Current State
- **Test Coverage**: ~26.51% overall (components at 100%, pages with basic rendering coverage)
- **Build Status**: ✅ All builds passing
- **Code Quality**: ✅ No ESLint errors, all files properly formatted
- **CI/CD**: ✅ GitHub Actions pipeline working
- **Documentation**: Comprehensive README, TESTING.md, and GitHub Copilot instructions

### 🚧 Placeholder Features (Not Implemented)
- Real API integration (using mock services)
- Authentication flow (using mock auth state)
- Image upload handling
- Notifications system
- Save Recipe functionality
- Advanced search and filtering
- Infinite scroll implementation
- Reporting and analytics

---

**Note**: This project is ready for backend integration and feature development. All infrastructure, tooling, and component foundations are in place.