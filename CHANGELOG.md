# Changelog

All notable changes to the FitRecipes Frontend project are documented in this file.

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