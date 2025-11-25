# FitRecipes System Architecture

## Complete System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        USERS[End Users<br/>Web Browsers<br/>Mobile Devices]
    end
    
    subgraph "Frontend Hosting - Vercel"
        VERCEL[Vercel Edge Network<br/>Global CDN<br/>SSL/TLS]
        
        subgraph "React Application"
            FRONTEND[React 19 + TypeScript<br/>Vite 6 Build<br/>Tailwind CSS v3]
            
            subgraph "State Management"
                AUTH_CTX[Auth Context<br/>JWT + User State]
                REACT_QUERY[React Query<br/>Server Cache]
            end
            
            subgraph "Core Pages"
                PUBLIC[Auth + OAuth<br/>Terms & Verification<br/>Browse Recipes]
                PROTECTED[Recipe Detail<br/>Submit Recipe<br/>My Recipes]
                ADMIN[User Management<br/>Recipe Approval<br/>Content Moderation]
            end
            
            subgraph "Services Layer"
                API_CLIENT[API Client<br/>Axios + JWT]
                AUTH_SVC[Auth Service<br/>Token Management]
                PUSH_SVC[Push Service<br/>FCM Web SDK]
            end
        end
    end
    
    subgraph "Backend Hosting - Render"
        RENDER_LB[Render Load Balancer<br/>SSL/TLS Termination<br/>Managed Platform]
        APP[Hono.js Server<br/>Bun Runtime<br/>Docker Container<br/>Port 3000]
        HEALTH[Health Check<br/>/health endpoint<br/>30s intervals]
    end
    
    subgraph "Database Layer - Supabase"
        POSTGRES[(PostgreSQL 15<br/>Prisma ORM<br/>Connection Pooling<br/>Daily Backups)]
        STORAGE[Supabase Storage<br/>Recipe Images<br/>CDN Enabled]
    end
    
    subgraph "External Services"
        GOOGLE[Google OAuth 2.0<br/>Social Login]
        RESEND[Resend API<br/>Email Verification<br/>Password Reset]
        FCM[Firebase Cloud Messaging<br/>Push Notifications]
    end
    
    subgraph "CI/CD Pipeline - GitHub Actions"
        GIT[Git Repository<br/>GitHub<br/>main, develop branch]
        
        subgraph "Frontend Pipeline"
            FE_LINT[ESLint + Prettier<br/>Format Check]
            FE_TYPE[TypeScript Check<br/>Type Validation]
            FE_TEST[Vitest Tests<br/>Coverage Report]
            FE_BUILD[Vite Build<br/>Node 18.x & 20.x]
            FE_DEPLOY[Vercel Deploy<br/>Staging: develop<br/>Production: main]
        end
        
        subgraph "Backend Pipeline"
            BE_TEST[Unit Tests<br/>ESLint + TypeScript<br/>59 tests passing]
            BE_BUILD[Docker Build<br/>Multi-stage<br/>Bun + Prisma]
            SECURITY[Trivy Scanner<br/>Vulnerability Check]
            BE_DEPLOY[Render Deploy<br/>DB Migrations<br/>Health Verification]
        end
    end
    
    subgraph "Monitoring"
        LOGS[Application Logs<br/>Hono Logger<br/>Error Tracking]
        METRICS[Performance Metrics<br/>Request/Response Time<br/>API Analytics]
    end

    %% User Flow
    USERS -->|HTTPS| VERCEL
    VERCEL --> FRONTEND
    
    %% Frontend Internal Flow
    FRONTEND --> PUBLIC
    FRONTEND --> PROTECTED
    FRONTEND --> ADMIN
    
    PUBLIC --> AUTH_CTX
    PROTECTED --> AUTH_CTX
    PROTECTED --> REACT_QUERY
    ADMIN --> AUTH_CTX
    
    AUTH_CTX --> AUTH_SVC
    REACT_QUERY --> API_CLIENT
    AUTH_SVC --> API_CLIENT
    
    %% Frontend to Backend
    API_CLIENT -->|REST API<br/>JWT Auth| RENDER_LB
    PUSH_SVC -->|Web Push| FCM
    
    %% Load Balancing
    RENDER_LB -->|Route| APP
    
    %% Backend to Data
    APP --> POSTGRES
    APP --> STORAGE
    
    %% External Services
    APP --> GOOGLE
    APP --> RESEND
    APP --> FCM
    
    %% Health Monitoring
    APP --> HEALTH
    RENDER_LB --> HEALTH
    
    %% CI/CD Flow - Frontend
    GIT -->|Push Frontend| FE_LINT
    FE_LINT -->|Pass| FE_TYPE
    FE_TYPE -->|Pass| FE_TEST
    FE_TEST -->|Pass| FE_BUILD
    FE_BUILD -->|Success| FE_DEPLOY
    FE_DEPLOY --> VERCEL
    
    %% CI/CD Flow - Backend
    GIT -->|Push Backend| BE_TEST
    BE_TEST -->|Pass| BE_BUILD
    BE_BUILD -->|Success| SECURITY
    SECURITY -->|Pass| BE_DEPLOY
    BE_DEPLOY --> APP
    
    %% Monitoring
    APP --> LOGS
    APP --> METRICS
    VERCEL --> METRICS

    classDef client fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef frontend fill:#bbdefb,stroke:#0d47a1,stroke-width:3px
    classDef backend fill:#ffe0b2,stroke:#e65100,stroke-width:3px
    classDef database fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef external fill:#e8f5e9,stroke:#388e3c,stroke-width:3px
    classDef cicd fill:#fff9c4,stroke:#f57f17,stroke-width:3px
    classDef monitoring fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class USERS client
    class VERCEL,FRONTEND,AUTH_CTX,REACT_QUERY,PUBLIC,PROTECTED,ADMIN,API_CLIENT,AUTH_SVC,PUSH_SVC frontend
    class RENDER_LB,APP,HEALTH backend
    class POSTGRES,STORAGE database
    class GOOGLE,RESEND,FCM external
    class GIT,FE_LINT,FE_TYPE,FE_TEST,FE_BUILD,FE_DEPLOY,BE_TEST,BE_BUILD,SECURITY,BE_DEPLOY cicd
    class LOGS,METRICS monitoring
```

## Architecture Overview

### Frontend Stack (Presentation Layer)

**Core Technologies:**
- React 19 with TypeScript (Strict Mode)
- Vite 6 (Build Tool & Dev Server)
- Tailwind CSS v3 (Styling)
- React Router v6 (Client-side Routing)
- Framer Motion (Animations)

**Key Pages:**
1. **Public Pages** (Unauthenticated)
   - Auth Page: Combined login/register with Google OAuth
   - Terms & Verification Pages
   - Browse Recipes: Search, filters, pagination

2. **Protected Pages** (Authenticated)
   - Browse Recipes: Vector search, filters, pagination
   - Recipe Details: Full recipe view, ratings, comments
   - My Recipes: Chef's recipe management
   - Recipe Submission: Form with image upload

3. **Admin Features** (Admin Role)
   - User Management: CRUD, ban/unban, role changes
   - Recipe Approval: Pending recipes workflow
   - Content Moderation: Comment management
   - System Analytics: Charts & metrics

### State Management

**Global State:**
- **AuthContext**: JWT token, user object, authentication status
- **SavedRecipesContext**: Bookmarked recipes (future)
- **TanStack React Query**: Server state caching (30s stale time)

**Local Storage:**
- `fitrecipes_token`: JWT authentication token
- `fitrecipes_user`: Serialized user object
- `fcm_token_registered`: Push notification registration status

### Frontend Services Layer

**API Client (`src/services/api.ts`):**
- Axios-based HTTP client
- Automatic JWT token attachment
- Structured error handling (ApiError class)
- Response format: `{ success, data?, message?, errors? }`

**Key Services:**
- `auth.ts`: Login, register, OAuth, password reset
- `recipes.ts`: Browse, search, CRUD operations
- `userManagement.ts`: Admin user operations
- `analytics.ts`: Charts data fetching
- `pushNotifications.ts`: FCM web push setup

### Routing Architecture

**Public Routes:**
- `/` - Browse Recipes (Home)
- `/auth` - Authentication
- `/terms` - Terms of Service
- `/verify-email/:token` - Email verification
- `/reset-password` - Password reset

**Protected Routes:**
- `/browse` - Browse recipes (all users)
- `/recipe/:id` - Recipe details (all users)
- `/chef/submit-recipe` - Submit (Chef/Admin only)
- `/chef/my-recipes` - My recipes (Chef/Admin only)
- `/admin/*` - Admin dashboard (Admin only)

### Backend Integration

**API Base URL:**
- Production: `https://fitrecipes-backend.onrender.com`
- Endpoints: `/api/v1/*`

**Authentication Flow:**
1. User logs in via `/api/v1/auth/login` or Google OAuth
2. Backend returns JWT token + user object
3. Frontend stores in localStorage
4. API client automatically includes token in headers
5. Protected routes check authentication state

**Request/Response Pattern:**
```typescript
// Request
Authorization: Bearer <JWT_TOKEN>

// Response
{
  success: true,
  data: { ... },
  message?: "Success message"
}
```

### External Integrations

**Google OAuth 2.0:**
- Flow: Frontend → Google → Backend callback → Frontend
- Requires terms acceptance for OAuth users

**Firebase Cloud Messaging (FCM):**
- Web push notifications
- Service worker: `public/firebase-messaging-sw.js`
- Vapid key configuration

**Vector Search API (Optional):**
- Semantic recipe search
- Auto-filter extraction from natural language
- Fallback to traditional browse if unavailable

### Deployment Architecture

**Vercel Platform:**
- Auto-deployment from GitHub (develop and main branches)
- Staging deployment: `develop` branch → Vercel staging project
- Production deployment: `main` branch → Vercel production project
- Global CDN for static assets

**Environment Variables (Vercel):**
```
VITE_API_BASE_URL=https://fitrecipes-backend.onrender.com
VITE_FRONTEND_URL=https://fitrecipes.vercel.app
VITE_SEARCH_API_BASE_URL=http://localhost:8000 (optional)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

### Testing Infrastructure

**E2E Tests (Playwright):**
- Multi-browser testing: Chrome, Firefox, Safari, Mobile Chrome/Safari
- Test suites: Auth flows, OAuth integration, Terms acceptance, Protected routes, 404 handling
- Test utilities: `e2e/helpers.ts` for common operations

**Unit Tests (Vitest + React Testing Library):**
- Co-located with components
- Test utilities: `src/test/setup.ts`
- jsdom environment for DOM testing

**CI/CD Pipeline (GitHub Actions):**

**Workflow Triggers:**
- Push to any branch
- Pull request to main/develop
- Manual workflow dispatch

**Pipeline Steps (Sequential):**
1. **Code Quality Check**
   - ESLint: Check code style and potential errors
   - Prettier: Verify code formatting consistency
   
2. **Type Validation**
   - TypeScript compiler: Strict mode type checking (`tsc --noEmit`)
   - Ensure no type errors before testing
   
3. **Unit Tests**
   - Vitest: Run component and service tests with coverage
   - React Testing Library: DOM interaction testing
   - Matrix testing: Node.js 18.x and 20.x
   
4. **Production Build**
   - Vite: Bundle application for production
   - Optimize assets, minify code
   
5. **Automated Deployment**
   - Staging: Vercel deploy on `develop` branch push
   - Production: Vercel deploy on `main` branch push
   - Coverage upload to Codecov (Node 20.x only)

**Build Artifacts:**
- Production bundle in `dist/` directory
- Test reports and coverage data
- Playwright HTML report

### Security Features

**Frontend Security:**
- JWT token validation
- Protected route guards
- Role-based access control
- Input sanitization
- XSS prevention (React built-in)

**Backend Security (via API):**
- Rate limiting
- CORS configuration
- DDoS protection
- SSL/TLS certificates

### Performance Optimization

**Build Optimization:**
- Vite's fast HMR and build
- Code splitting (React.lazy future implementation)
- Tree shaking
- Minification
- Gzip compression

**Runtime Optimization:**
- React Query caching (30s stale time)
- Lazy loading images (future)
- Debounced search inputs
- Pagination for large lists

### Future Enhancements

**Planned Features:**
1. WebSocket for real-time notifications
2. Progressive Web App (PWA) support
3. Image lazy loading & optimization
4. Advanced search filters UI
5. Infinite scroll pagination
6. Recipe save/bookmark feature (UI ready, API pending)
7. Code splitting for better performance

## Technology Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 6.4.1 | Build Tool |
| Tailwind CSS | 3.4.17 | Styling |
| React Router | 7.9.1 | Routing |
| Framer Motion | 11.15.0 | Animations |
| TanStack React Query | 5.90.7 | Server State |
| Axios | 1.7.9 | HTTP Client |
| Firebase | 12.5.0 | Push Notifications |
| Vitest | 2.1.8 | Unit Testing |
| Playwright | 1.50.1 | E2E Testing |

## Deployment URLs

- **Production**: `https://fitrecipes.vercel.app` (future)
- **Backend API**: `https://fitrecipes-backend.onrender.com`
- **Repository**: `https://github.com/NinePTH/FitRecipes-Frontend`

---

## Use Case Diagram

This diagram illustrates the complete user interactions across all roles in the FitRecipes system.

```mermaid
graph TB
    %% Actors
    GUEST((Guest User))
    CUSTOMER((Customer))
    CHEF((Chef))
    ADMIN((Admin))
    SYSTEM((System))
    
    %% Guest User Use Cases
    subgraph "Public Access"
        UC1[Browse Recipes]
        UC2[Search Recipes]
        UC3[View Recipe Details]
        UC4[Register Account]
        UC5[Login via Email]
        UC6[Login via Google OAuth]
        UC7[View Terms of Service]
        UC8[Request Password Reset]
        UC9[Reset Password]
        UC10[Verify Email]
        UC11[Resend Verification Email]
    end
    
    %% Customer Use Cases
    subgraph "Customer Features"
        UC12[Rate Recipes]
        UC13[Edit Own Rating]
        UC14[Delete Own Rating]
        UC15[Comment on Recipes]
        UC16[Edit Own Comment]
        UC17[Delete Own Comment]
        UC18[Save/Bookmark Recipes]
        UC19[View Saved Recipes]
        UC20[Remove Saved Recipes]
        UC21[Receive Notifications]
        UC22[Enable Push Notifications]
        UC23[View Notification History]
        UC24[Logout]
    end
    
    %% Chef Use Cases
    subgraph "Chef Features"
        UC25[Submit New Recipe]
        UC26[Upload Recipe Images]
        UC27[View My Recipes]
        UC28[Edit Own Recipe]
        UC29[Update Recipe Images]
        UC30[View Recipe Status]
        UC31[Receive Approval Notifications]
        UC32[View Recipe Analytics]
    end
    
    %% Admin Use Cases
    subgraph "Admin Features"
        UC33[Review Pending Recipes]
        UC34[Approve Recipe]
        UC35[Reject Recipe with Reason]
        UC36[Delete Any Recipe]
        UC37[View All Users]
        UC38[Manage User Roles]
        UC39[Delete User Account]
        UC40[View System Dashboard]
        UC41[Moderate Comments]
        UC42[View Analytics Reports]
    end
    
    %% System Automated Use Cases
    subgraph "System Operations"
        UC43[Send Email Verification]
        UC44[Send Password Reset Email]
        UC45[Track Recipe Views]
        UC46[Send Push Notifications]
        UC47[Generate Recipe Suggestions]
        UC48[Calculate Recipe Ratings]
        UC49[Update User Statistics]
    end
    
    %% Guest User Connections
    GUEST --> UC1
    GUEST --> UC2
    GUEST --> UC3
    GUEST --> UC4
    GUEST --> UC5
    GUEST --> UC6
    GUEST --> UC7
    GUEST --> UC8
    GUEST --> UC9
    GUEST --> UC10
    GUEST --> UC11
    
    %% Customer Connections (inherits all Guest capabilities)
    CUSTOMER --> UC1
    CUSTOMER --> UC2
    CUSTOMER --> UC3
    CUSTOMER --> UC12
    CUSTOMER --> UC13
    CUSTOMER --> UC14
    CUSTOMER --> UC15
    CUSTOMER --> UC16
    CUSTOMER --> UC17
    CUSTOMER --> UC18
    CUSTOMER --> UC19
    CUSTOMER --> UC20
    CUSTOMER --> UC21
    CUSTOMER --> UC22
    CUSTOMER --> UC23
    CUSTOMER --> UC24
    
    %% Chef Connections (inherits all Customer capabilities)
    CHEF --> UC1
    CHEF --> UC2
    CHEF --> UC3
    CHEF --> UC12
    CHEF --> UC15
    CHEF --> UC18
    CHEF --> UC21
    CHEF --> UC24
    CHEF --> UC25
    CHEF --> UC26
    CHEF --> UC27
    CHEF --> UC28
    CHEF --> UC29
    CHEF --> UC30
    CHEF --> UC31
    CHEF --> UC32
    
    %% Admin Connections (inherits all Chef capabilities)
    ADMIN --> UC1
    ADMIN --> UC2
    ADMIN --> UC3
    ADMIN --> UC12
    ADMIN --> UC15
    ADMIN --> UC18
    ADMIN --> UC21
    ADMIN --> UC24
    ADMIN --> UC25
    ADMIN --> UC27
    ADMIN --> UC33
    ADMIN --> UC34
    ADMIN --> UC35
    ADMIN --> UC36
    ADMIN --> UC37
    ADMIN --> UC38
    ADMIN --> UC39
    ADMIN --> UC40
    ADMIN --> UC41
    ADMIN --> UC42
    
    %% System Automated Connections
    SYSTEM -.->|Triggered by| UC4
    SYSTEM -.->|Triggered by| UC8
    SYSTEM -.->|Triggered by| UC3
    SYSTEM -.->|Triggered by| UC34
    SYSTEM -.->|Triggered by| UC35
    SYSTEM -.->|Triggered by| UC2
    SYSTEM -.->|Triggered by| UC12
    UC4 -.-> UC43
    UC8 -.-> UC44
    UC3 -.-> UC45
    UC34 -.-> UC46
    UC35 -.-> UC46
    UC2 -.-> UC47
    UC12 -.-> UC48
    UC25 -.-> UC49
    
    %% Extend Relationships
    UC6 -.->|extends| UC7
    UC28 -.->|includes| UC29
    UC25 -.->|includes| UC26
    UC36 -.->|includes| UC35
    
    %% Styling
    classDef actorStyle fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    classDef publicStyle fill:#95E1D3,stroke:#38A89D,stroke-width:2px
    classDef customerStyle fill:#F6E3C5,stroke:#D4A574,stroke-width:2px
    classDef chefStyle fill:#FFB6B9,stroke:#C77C7C,stroke-width:2px
    classDef adminStyle fill:#E8B4F1,stroke:#A569BD,stroke-width:2px
    classDef systemStyle fill:#D5D8DC,stroke:#85929E,stroke-width:2px
    
    class GUEST,CUSTOMER,CHEF,ADMIN,SYSTEM actorStyle
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10,UC11 publicStyle
    class UC12,UC13,UC14,UC15,UC16,UC17,UC18,UC19,UC20,UC21,UC22,UC23,UC24 customerStyle
    class UC25,UC26,UC27,UC28,UC29,UC30,UC31,UC32 chefStyle
    class UC33,UC34,UC35,UC36,UC37,UC38,UC39,UC40,UC41,UC42 adminStyle
    class UC43,UC44,UC45,UC46,UC47,UC48,UC49 systemStyle
```

### Use Case Categories

#### 🌐 Public Access (Guest Users)
Unauthenticated users can:
- Browse and search recipe catalog with filters
- View complete recipe details (ingredients, instructions, ratings)
- Create account via email or Google OAuth
- Access terms of service and privacy policy
- Complete email verification workflow
- Request and complete password reset

#### 👤 Customer Features
Authenticated customers can perform all guest actions plus:
- Rate recipes with 1-5 stars (create, edit, delete)
- Comment on recipes (create, edit, delete)
- Save/bookmark favorite recipes for quick access
- View saved recipe collection
- Receive real-time push notifications
- Enable browser push notifications
- View notification history with filters
- Manage account settings and logout

#### 👨‍🍳 Chef Features
Chefs inherit all customer capabilities plus:
- Submit new recipes with detailed information
- Upload up to 3 images per recipe
- View all submitted recipes in "My Recipes"
- Edit recipe details and update images
- Track recipe status (pending, approved, rejected)
- Receive notifications about approval/rejection
- View analytics on recipe performance

#### 🛡️ Admin Features
Admins inherit all chef capabilities plus:
- Review queue of pending recipe submissions
- Approve recipes for public display
- Reject recipes with detailed feedback
- Delete any recipe (pending, approved, rejected)
- View and manage all user accounts
- Update user roles (promote/demote)
- Delete user accounts with confirmation
- Access system-wide analytics dashboard
- Moderate user comments and ratings
- Generate system reports

#### 🤖 System Automated Operations
The system automatically:
- Send email verification links upon registration
- Send password reset emails with secure tokens
- Track recipe view counts for analytics
- Send push notifications for key events
- Generate smart recipe suggestions based on search
- Calculate and update average recipe ratings
- Update user statistics and engagement metrics

### Use Case Relationships

**Inheritance (Generalization)**:
- Customer inherits from Guest User
- Chef inherits from Customer
- Admin inherits from Chef

**Extends**:
- "Login via Google OAuth" extends "Accept Terms of Service" (OAuth users must accept terms)
- "Edit Recipe" extends "Update Recipe Images" (editing includes image management)

**Includes**:
- "Submit Recipe" includes "Upload Recipe Images" (required step)
- "Admin Delete Recipe" includes "Provide Rejection Reason" (required for audit trail)

**System Triggers**:
- Registration triggers email verification
- Password reset request triggers reset email
- Recipe view triggers view count tracking
- Recipe approval/rejection triggers push notifications
- Search queries trigger suggestion generation
- Recipe ratings trigger rating recalculation

---

**Last Updated**: November 24, 2025
**Current Status**: Authentication system complete, recipe features production-ready, admin features operational

