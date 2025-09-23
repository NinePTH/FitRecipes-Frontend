# GitHub Copilot Repository Instructions – Frontend

This repository contains the frontend of the Healthy Recipes Web Application, developed using React (TypeScript) and Tailwind CSS. Copilot shoul### 🛠️ Known Issues & Solutions

### Build & CI/CD
- **Issue**: Native binding errors with rolldown-vite in CI
- **Solution**: ✅ Switched to standard Vite v6 for better CI compatibility
- **Issue**: webidl-conversions/whatwg-url TypeError in CI test coverage
- **Solution**: ✅ Updated Vitest config (pool: 'forks', jsdom environment) and CI workflow (NODE_ENV=test, npm config)

### Code Quality
- **Issue**: ESLint warnings in coverage folder
- **Solution**: ✅ Coverage folder is ignored in .gitignore and eslint.config.js
- **Issue**: Prettier formatting inconsistencies
- **Solution**: ✅ Run `npm run format` then `npm run format:check`

### Testing
- **Issue**: Router conflicts in tests (multiple Router instances)
- **Solution**: ✅ App.tsx includes BrowserRouter, tests don't need to wrap it
- **Issue**: Co-located test file organization
- **Solution**: ✅ Tests are placed next to components following React best practices
- **Issue**: CI test coverage failing with dependency errors
- **Solution**: ✅ Robust test environment configuration with forked processes and proper dependenciesg, testing, and maintaining features according to the SRS provided below.

## 🚀 Current Tech Stack (Implemented)
- **Vite** - Build tool with React + TypeScript template
- **React 18** with TypeScript, functional components, and hooks
- **Tailwind CSS v3** with forms and typography plugins
- **shadcn/ui-style** custom UI components (Button, Input, Textarea, Card)
- **React Router v6** for navigation and protected routes
- **Vitest + React Testing Library** for testing
- **ESLint + Prettier** for code quality
- **GitHub Actions** for CI/CD pipeline
- **Vercel** deployment configuration

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
├── pages/                     # ✅ All 5 main pages implemented (placeholder logic)
│   ├── AuthPage.tsx           # ✅ Login/Register combined
│   ├── BrowseRecipesPage.tsx  # ✅ Search & browse with filters
│   ├── RecipeDetailPage.tsx   # ✅ Recipe details with ratings
│   ├── RecipeSubmissionPage.tsx # ✅ Recipe submission form
│   └── AdminRecipeApprovalPage.tsx # ✅ Admin approval interface
├── services/                  # ✅ Service layer implemented
│   ├── api.ts                 # ✅ API client with error handling
│   └── auth.ts                # ✅ Authentication service
├── types/                     # ✅ Comprehensive type definitions
│   └── index.ts               # ✅ All entities, forms, API types
├── hooks/                     # 📋 Custom hooks (future)
├── lib/                       # ✅ Utility functions
│   └── utils.ts               # ✅ Class name utilities, helpers
├── test/                      # ✅ Test configuration
│   └── setup.ts               # ✅ Vitest + Testing Library setup
├── App.tsx                    # ✅ Router setup with protected routes
├── App.test.tsx               # ✅ Basic app test
└── main.tsx                   # ✅ App entry point
```

## 🎯 Development Guidelines

### Code Style & Standards
- Use **React with TypeScript**, functional components, and hooks
- Follow **co-located testing** - place `.test.tsx` files next to components
- Use **absolute imports** with `@/` alias (configured in Vite)
- Maintain **responsive design** for desktop, tablet, and mobile devices
- Follow **accessibility best practices** (ARIA labels, keyboard navigation)
- Code should be **modular and maintainable**, separating UI components, pages, and services

### Testing Strategy (See TESTING.md)
- **Co-located tests**: Place test files next to their components
- **Vitest + React Testing Library** for unit and integration tests
- **Coverage target**: Aim for >80% test coverage
- **Test types**: Component tests, page tests, service tests, hook tests

### Styling & UI
- **Tailwind CSS**: Use utility classes, follow mobile-first approach
- **Custom Components**: Build on shadcn/ui patterns, ensure consistency
- **Color Palette**: Use the configured primary color scheme (blue tones)
- **Responsive**: Ensure all components work on mobile, tablet, desktop

### State Management & Data Flow
- **React Router**: Use for navigation and protected routes
- **Service Layer**: Use `src/services/` for API calls and business logic  
- **Future**: Consider React Query/SWR for server state management
- **Authentication**: Use `auth.ts` service, implement proper session handling

## Pages / Components
### 1. Authentication Page
- Combine login and registration in a single page.
- Include **email/password validation**, Terms & Conditions checkbox, error messages, and password reset flow.
- Ensure session handling and proper UX feedback for success/failure.

### 2. Recipe Search & Browse Page
- Search by ingredients (with auto-suggestions).
- Browse with **filters**: Meal Type, Diet Type, Difficulty, Main Ingredient, Cuisine Type, Preparation Time.
- Sorting: Highest Rating, Most Recent, Preparation Time (asc/desc).
- **Infinite scroll pagination** for recipe list.
- Display sections:
  - Recommended for You (personalized)
  - Trending Recipes (high ratings, saves, recent comments)
  - New Recipes (most recent submissions)

### 3. Recipe Detail Page
- Show full recipe information:
  - Title, Description, Images
  - Ingredients list with quantities
  - Cooking instructions and prep/cook time
  - Nutrition info (optional calories)
  - User ratings and comments (with average recalculation on update)
- Comment and rating functionality for registered users.

### 4. Recipe Submission Page
- Accessible only to Chef role.
- Include form validation for required fields: Recipe Name, Ingredients, Quantities, Steps, Nutrition, Allergies.
- Allow edit, cancel, resubmit if rejected.
- Validate missing fields before submission.

### 5. Admin Recipe Approval Page
- Show pending recipes list with submission date and status.
- Include **infinite scroll pagination**.
- Admin can approve or reject recipes.
- Rejected recipes should include rejection reasons.

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

## 🎯 Implementation Status

### ✅ **Completed (Ready for Use)**
- Project setup with Vite 6 + React 19 + TypeScript
- Tailwind CSS v3 configuration with custom theme and plugins
- All 5 main pages with placeholder logic and routing
- UI component library (Button, Input, Textarea, Card) with shadcn/ui patterns
- Service layer for API calls and authentication (placeholder implementations)
- Comprehensive type definitions for all entities and APIs
- Test setup with Vitest + React Testing Library + coverage reporting
- ESLint (with coverage folder ignored) + Prettier configuration
- GitHub Actions CI/CD pipeline (fixed for standard Vite compatibility)
- Vercel deployment configuration

### 📋 **Next Steps (Development Priorities)**
1. **Backend Integration**: Connect to actual API endpoints
2. **Authentication Flow**: Implement real login/logout/session management
3. **Form Validation**: Add comprehensive validation to all forms
4. **State Management**: Implement React Query or SWR for server state
5. **Enhanced Testing**: Add tests for all components and pages
6. **Accessibility**: Complete ARIA labels and keyboard navigation
7. **Performance**: Implement code splitting and lazy loading
8. **Error Handling**: Add global error boundaries and user feedback

### 🚧 **Features with Placeholder Code (Do NOT Implement Yet)**
- **UI Components**: Additional shadcn/ui components (Label, Select, Dialog, Dropdown Menu, Tabs, Accordion, Alert Dialog, Toast, Badge, Avatar, Popover, Tooltip, Sheet, Separator, Checkbox, Radio Group, Switch, Slider, Date Picker, Table, Progress, Breadcrumb, Pagination, Command)
- **Features**: Notifications system, Save Recipe functionality, Reporting and analytics
- **Advanced Features**: Advanced search filters, User profile management, Infinite scroll, Image upload

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

## 📚 Additional Resources
- **TESTING.md**: Comprehensive testing guide and best practices
- **README.md**: Project setup and getting started guide
- **Tailwind Config**: Custom theme and component patterns
- **Type Definitions**: `src/types/index.ts` for all data structures

## 🎨 Design System Notes
- **Primary Colors**: Blue color palette (50-950 scale)
- **Components**: Follow shadcn/ui patterns for consistency  
- **Spacing**: Use Tailwind's spacing scale
- **Typography**: Responsive text sizing with proper hierarchy
- **Forms**: Consistent styling with proper validation states

## 🛠️ Known Issues & Solutions

### Build & CI/CD
- **Issue**: Native binding errors with rolldown-vite in CI
- **Solution**: Using standard Vite v6 for better CI compatibility
- **Issue**: Missing coverage dependency
- **Solution**: @vitest/coverage-v8 is installed and configured

### Code Quality
- **Issue**: ESLint warnings in coverage folder
- **Solution**: Coverage folder is ignored in eslint.config.js
- **Issue**: Prettier formatting inconsistencies
- **Solution**: Run `npm run format` then `npm run format:check`

### Testing
- **Issue**: Router conflicts in tests (multiple Router instances)
- **Solution**: App.tsx includes BrowserRouter, tests don't need to wrap it
- **Issue**: Co-located test file organization
- **Solution**: Tests are placed next to components following React best practices
