# FitRecipes Frontend

A modern React + TypeScript frontend for the Healthy Recipes Web Application, built with Vite and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Component Library**: Custom shadcn/ui components
- **Routing**: React Router with protected routes
- **Authentication**: JWT-based authentication with role-based access
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **CI/CD**: GitHub Actions with automated testing and deployment

## 📱 Pages & Features

### ✅ Implemented
- **Authentication Page**: Combined login/register with validation
- **Recipe Browse Page**: Search, filters, infinite scroll (placeholder)
- **Recipe Detail Page**: Full recipe view with rating and comments
- **Recipe Submission Page**: Form for chefs to submit recipes
- **Admin Approval Page**: Admin interface for recipe approval

### 🚧 Placeholder Features (Not Yet Implemented)
- Notifications system
- Save Recipe functionality  
- Reporting features
- Advanced filtering
- Infinite scroll implementation
- Image upload handling

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
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
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

## 📄 License

This project is licensed under the MIT License.
