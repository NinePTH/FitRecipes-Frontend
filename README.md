# FitRecipes Frontend

A modern React + TypeScript frontend for the Healthy Recipes Web Application, built with Vite and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite 6, Tailwind CSS v3
- **Component Library**: Custom shadcn/ui-style components (Button, Input, Textarea, Card + more planned)
- **Routing**: React Router v6 with protected routes
- **Authentication**: JWT-based authentication with role-based access (placeholder)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Testing**: Vitest + React Testing Library with coverage reports
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **CI/CD**: GitHub Actions with automated testing, linting, and deployment

## 📱 Pages & Features

### ✅ Implemented
- **Authentication Page**: Combined login/register with validation
- **Recipe Browse Page**: Search, filters, infinite scroll (placeholder)
- **Recipe Detail Page**: Full recipe view with rating and comments
- **Recipe Submission Page**: Form for chefs to submit recipes
- **Admin Approval Page**: Admin interface for recipe approval

### 🚧 Placeholder Features (Not Yet Implemented)
- **UI Components**: Label, Select, Dialog, Dropdown Menu, Tabs, Accordion, Alert Dialog, Toast, Badge, Avatar, Popover, Tooltip, Sheet, Separator
- **Features**: Notifications system, Save Recipe functionality, Reporting features
- **Advanced UI**: Infinite scroll implementation, Image upload handling, Advanced filtering
- **Form Components**: Checkbox, Radio Group, Switch, Slider, Date Picker

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/NinePTH/FitRecipes-Frontend.git
   cd FitRecipes-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
npx vitest run       # Run tests once
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Library utilities
└── test/               # Test setup and utilities
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Import project from GitHub
   - Configure environment variables
   - Deploy automatically on push to main

2. **Manual deployment**
   ```bash
   npm run build
   npx vercel --prod
   ```

## 🔒 Authentication & Authorization

The application implements role-based access control:

- **Customer**: Browse recipes, view details, rate and comment
- **Chef**: All customer permissions + submit recipes
- **Admin**: All permissions + approve/reject recipes

## �️ Troubleshooting

### Common Issues

1. **Build Errors in CI/CD**
   - Issue: Native binding errors with Rolldown
   - Solution: We use standard Vite (v6) instead of rolldown-vite for better CI compatibility

2. **Test Coverage Missing**
   - Issue: `@vitest/coverage-v8` dependency missing
   - Solution: Run `npm install -D @vitest/coverage-v8`

3. **Formatting Issues**
   - Issue: Code style inconsistencies
   - Solution: Run `npm run format` to auto-fix, then `npm run format:check` to verify

4. **ESLint Warnings in Coverage Folder**
   - Issue: ESLint scans generated coverage files
   - Solution: Coverage folder is ignored in `eslint.config.js`

### Development Tips

- Use **co-located tests**: Place `.test.tsx` files next to components
- Follow **absolute imports**: Use `@/` prefix for src imports
- Check **TESTING.md** for comprehensive testing guidelines
- Review **GitHub Copilot instructions** in `.github/copilot-instructions.md`

## 📚 Documentation

- **TESTING.md**: Comprehensive testing guide and best practices
- **.github/copilot-instructions.md**: GitHub Copilot repository instructions
- **CHANGELOG.md**: Project changes and technical decisions
- **Tailwind Config**: Custom theme and component patterns in `tailwind.config.js`
- **Type Definitions**: Complete type system in `src/types/index.ts`

## 🎨 Planned shadcn/ui Components

### ✅ Implemented
- Button (with variants), Input, Textarea, Card

### 📋 To Implement
- **Form Components**: Label, Select, Checkbox, Radio Group, Switch
- **Layout Components**: Separator, Sheet, Tabs, Accordion
- **Feedback Components**: Toast, Alert Dialog, Dialog, Popover, Tooltip
- **Data Display**: Badge, Avatar, Table, Progress
- **Navigation**: Dropdown Menu, Breadcrumb, Pagination
- **Input Components**: Date Picker, Slider, Command (search)

*Note: Implement components as needed for specific features to avoid over-engineering.*

## �📄 License

This project is licensed under the MIT License.
