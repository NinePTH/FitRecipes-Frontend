# FitRecipes Release Plan v1.0.0

**Combined Frontend & Backend Release Plan**

---

## 1. Version Information ✅

### Frontend
- **Release:** v1.0.0
- **Date:** November 8, 2025
- **Team:** FitRecipes Frontend Team
- **Git Tag:** `v1.0.0`
- **Platform:** Vercel
- **Production URL:** https://fitrecipes.vercel.app
- **Staging URL:** https://fitrecipes-staging.vercel.app

### Backend
- **Release:** v1.0.0
- **Date:** November 8, 2025
- **Team:** FitRecipes Backend Team
- **Git Tag:** `v1.0.0`
- **Platform:** Render.com (Cloud PaaS)
- **Production URL:** https://fitrecipes-backend.onrender.com
- **Staging URL:** https://fitrecipes-backend-staging.onrender.com

---

## 2. Scope ✅

### Frontend Features
- ✅ **14 Pages Implemented**
  - Authentication pages (login, register, forgot password, reset password)
  - OAuth callback & terms acceptance pages
  - Email verification & resend verification pages
  - Browse recipes with advanced filters
  - Recipe detail with images, ratings, comments
  - Recipe submission form (Chef role)
  - Admin approval interface (Admin role)
  - My Recipes page
  - Recommended, Trending, New recipes pages
  - 404 error page

- ✅ **Authentication System**
  - Email/password registration & login
  - Google OAuth 2.0 integration
  - Email verification flow
  - Password reset functionality
  - JWT token management
  - Role-based access control (User, Chef, Admin)
  - Protected routes
  - Session persistence

- ✅ **Recipe Features**
  - Browse with filters (cuisine, difficulty, main ingredient, dietary)
  - Search by title/description
  - Recipe detail view with multiple images
  - Rating system (1-5 stars)
  - Comment system (add, edit, delete)
  - Share recipe (copy link)
  - Responsive image gallery

- ✅ **Admin Features**
  - Recipe approval/rejection interface
  - Pending recipes list
  - Approval with feedback

- ✅ **UI Components**
  - Custom shadcn/ui-style components
  - Toast notification system (success, error, warning, info)
  - Confirmation dialogs
  - Form validation
  - Loading states
  - Error handling

- 🔴 **Disabled Features (Not in v1.0.0)**
  - ❌ Notification history sidebar (waiting for backend)
  - ❌ Save recipe functionality (waiting for backend)

### Backend Features (31 API Endpoints)
- ✅ **Authentication Module (8 endpoints)**
  - Register, login, logout
  - Email verification & resend
  - Password reset flow
  - Google OAuth integration
  - Get current user

- ✅ **Recipe Module (12 endpoints)**
  - CRUD operations (create, read, update, delete)
  - Browse with filters & search
  - Image upload support
  - Chef recipe management

- ✅ **Rating & Comment Module (6 endpoints)**
  - Submit rating
  - Get user rating
  - Delete rating
  - Add, update, delete comments
  - Get comments with pagination

- ✅ **Admin Module (5 endpoints)**
  - Get pending recipes
  - Approve/reject recipes
  - Admin dashboard stats

- ✅ **NEW: Notification Module (10 endpoints)**
  - Get notifications
  - Mark as read/unread
  - Clear notifications
  - Update preferences
  - FCM token registration

### Bug Fixes
- ✅ Fixed Fast Refresh warning with toast context
- ✅ Fixed router conflicts in tests
- ✅ Fixed ESLint coverage folder warnings
- ✅ Fixed localStorage security errors in E2E tests
- ✅ Fixed own recipe rating error handling
- ✅ Cleaned up console logs (kept error logging)

---

## 3. Deployment Method ✅

### Frontend Deployment
- **Platform:** Vercel
- **Access Method:** Web browser (HTTPS)
- **Deployment Process:**
  1. Push to `main` branch triggers auto-deployment
  2. Vercel builds from `npm run build`
  3. Deploy to production URL
  4. Automatic HTTPS/SSL certificate
  5. CDN distribution (global edge network)

- **CI/CD Pipeline:**
  - GitHub Actions for automated testing
  - ESLint + TypeScript checks
  - Unit tests with Vitest
  - E2E tests with Playwright (85 tests)
  - Automatic preview deployments for PRs

- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Install Command:** `npm install`

### Backend Deployment
- **Platform:** Render.com (Cloud PaaS)
- **Access Method:** REST API (HTTPS)
- **Deployment Process:**
  1. Push to `main` branch triggers auto-deployment
  2. Docker container build
  3. Database migrations run automatically
  4. Deploy to production URL
  5. Health check endpoint verification

- **CI/CD Pipeline:**
  - GitHub Actions for automated testing
  - Docker containerization
  - Automated database migrations
  - Environment variable injection
  - Zero-downtime deployment

- **Docker Configuration:**
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["npm", "start"]
  ```

---

## 4. Configuration Requirements ✅

### Frontend Configuration

#### System Requirements
- **Node.js:** 18+ (LTS recommended)
- **npm:** 9+
- **Browser Compatibility:**
  - Chrome (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest 2 versions)
- **Mobile:** iOS Safari, Chrome Mobile (latest)

#### Environment Variables (Required)
```env
# Backend API URL
VITE_API_BASE_URL=https://fitrecipes-backend.onrender.com

# Frontend URL (for OAuth redirects)
VITE_FRONTEND_URL=https://fitrecipes.vercel.app

# Optional: Debug mode
VITE_DEBUG=false
```

#### Build Configuration
- **Build Tool:** Vite 6
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Testing:** Vitest + Playwright

#### Dependencies
- No external services required (stateless frontend)
- Calls backend API for all data
- Uses localStorage for JWT token storage

### Backend Configuration

#### System Requirements
- **CPU:** 1 core minimum (2+ recommended)
- **RAM:** 512 MB minimum (1 GB recommended)
- **Disk:** 1 GB minimum (SSD recommended)
- **Node.js:** 18+ LTS
- **Database:** PostgreSQL 14+ (via Supabase)

#### Environment Variables (Required)
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/fitrecipes

# JWT Authentication
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# Frontend URL (CORS)
FRONTEND_URL=https://fitrecipes.vercel.app
```

#### Environment Variables (Optional)
```env
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@fitrecipes.com

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://fitrecipes-backend.onrender.com/api/v1/auth/google/callback

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=fitrecipes
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fitrecipes.iam.gserviceaccount.com

# Image Upload (Cloudinary - if used)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### External Dependencies
- **Supabase** (Required) - PostgreSQL database
- **Resend** (Optional) - Email service for verification/reset
- **Google OAuth** (Optional) - OAuth authentication
- **Firebase** (Optional) - Push notifications
- **Cloudinary** (Optional) - Image hosting

#### Database Migrations
```bash
# Run migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down

# Reset database (dev only)
npm run migrate:reset
```

---

## 5. Rollback/Recovery Plan ✅

### Frontend Rollback

#### Method 1: Vercel Dashboard Instant Rollback (⏱️ 1 minute)
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find previous stable deployment
4. Click "Promote to Production"
5. Verify deployment URL

**Pros:** Instant rollback, no code changes needed  
**Cons:** Requires Vercel dashboard access

#### Method 2: Git Revert & Redeploy (⏱️ 3 minutes)
```bash
# Revert to previous version
git revert HEAD --no-edit
git push origin main

# Or checkout previous tag
git checkout v0.9.0
git tag v1.0.0-rollback
git push origin v1.0.0-rollback
```

**Pros:** Full version control, reproducible  
**Cons:** Requires git access, slightly slower

#### Method 3: Manual Deployment from Tag (⏱️ 5 minutes)
```bash
# Deploy specific tag
git checkout tags/v0.9.0
vercel --prod
```

### Backend Rollback

#### Method 1: Render Dashboard Rollback (⏱️ 2 minutes)
1. Go to Render dashboard
2. Navigate to service deployments
3. Find previous stable deployment
4. Click "Rollback to this version"
5. Verify health check passes

**RTO:** 2 minutes  
**RPO:** 0 (no data loss)

#### Method 2: Git Tag Rollback (⏱️ 5 minutes)
```bash
# Rollback to previous stable version
git checkout tags/v0.9.0
git push origin main --force

# Trigger redeploy on Render
# (automatic via GitHub integration)
```

**RTO:** 5 minutes  
**RPO:** 0 (no data loss)

#### Method 3: Docker Image Rollback (⏱️ 3 minutes)
```bash
# Pull previous Docker image
docker pull fitrecipes/backend:v0.9.0

# Stop current container
docker stop fitrecipes-backend

# Run previous version
docker run -d --name fitrecipes-backend \
  --env-file .env \
  -p 3000:3000 \
  fitrecipes/backend:v0.9.0
```

### Database Rollback Procedures

#### Scenario 1: Bad Migration Applied
```bash
# Rollback last migration
npm run migrate:down

# Verify database state
npm run migrate:status

# Restart backend service
```

**Time:** 3-5 minutes  
**Data Loss:** Minimal (depends on migration)

#### Scenario 2: Data Corruption
```bash
# Restore from latest backup
# (Supabase automatic daily backups)

# Via Supabase Dashboard:
# 1. Go to Database > Backups
# 2. Select backup before deployment
# 3. Click "Restore"
# 4. Wait for restoration (5-10 minutes)
```

**Time:** 10-15 minutes  
**Data Loss:** Up to 24 hours (daily backup)

### Backup Strategy
- **Frontend:** No backups needed (stateless, code in git)
- **Backend Code:** Git repository (GitHub)
- **Database:** Supabase automatic daily backups
- **Images:** Cloudinary (permanent storage)
- **Retention:** 30 days

### Recovery Time Objectives
- **Frontend RTO:** 1-3 minutes
- **Backend RTO:** 2-5 minutes
- **Database RTO:** 10-15 minutes
- **Full System RTO:** 15-20 minutes

### Recovery Point Objectives
- **Code RPO:** 0 (git version control)
- **Database RPO:** 24 hours (daily backup)
- **Images RPO:** 0 (permanent storage)

### Rollback Communication Plan
1. **Detect Issue:** Monitoring alerts or user reports
2. **Assess Severity:** Critical vs. minor issue
3. **Decision:** Rollback or hotfix?
4. **Execute:** Follow rollback procedure
5. **Notify:** Update status page and team
6. **Verify:** Run smoke tests
7. **Post-Mortem:** Document what went wrong

### Emergency Contacts
- **Frontend Lead:** [Name] - [Email] - [Phone]
- **Backend Lead:** [Name] - [Email] - [Phone]
- **DevOps:** [Name] - [Email] - [Phone]
- **Product Manager:** [Name] - [Email] - [Phone]

---

## 6. Documentation Deliverables ✅

### Frontend Documentation

#### 1. User Guide (End Users)
**Location:** `docs/USER_GUIDE.md` (To be created)

**Contents:**
- How to create an account
- How to browse and search recipes
- How to rate and comment on recipes
- How to submit recipes (Chef role)
- How to manage your recipes
- How to use filters and search
- FAQ and troubleshooting

**Target Audience:** End users (customers, chefs)

#### 2. Developer Guide (Frontend Developers)
**Location:** `README.md` + `docs/` folder

**Existing Documentation:**
- ✅ `README.md` - Setup, installation, development
- ✅ `TESTING.md` - Testing guide and best practices
- ✅ `AUTHENTICATION.md` - Auth system documentation
- ✅ `CHANGELOG.md` - Version history and changes
- ✅ `.github/copilot-instructions.md` - Development guidelines

**Contents:**
- Project setup and installation
- Development workflow
- Component architecture
- State management (Context API)
- Routing and navigation
- API integration patterns
- Testing strategy
- Build and deployment
- Troubleshooting

**Target Audience:** Frontend developers joining the project

#### 3. Component Documentation (UI Library)
**Location:** `docs/COMPONENT_LIBRARY.md` (To be created)

**Contents:**
- Button component variants
- Input and Textarea components
- Card component structure
- Form components
- Toast notification system
- Confirmation dialog
- Protected route wrapper
- Layout component
- Usage examples and props
- Accessibility guidelines

**Target Audience:** Frontend developers using components

#### 4. API Integration Guide (Backend Calls)
**Location:** `docs/API_INTEGRATION_GUIDE.md` (To be created)

**Contents:**
- API client setup (`src/services/api.ts`)
- Authentication service (`src/services/auth.ts`)
- Recipe service (`src/services/recipe.ts`)
- Error handling patterns
- Request/response types
- JWT token management
- API endpoints reference
- Example API calls

**Target Audience:** Frontend developers integrating with backend

#### 5. E2E Testing Guide
**Location:** `e2e/README.md`

**Existing Documentation:**
- ✅ Complete E2E testing guide
- ✅ 85 tests across 5 browsers
- ✅ Test helpers and utilities
- ✅ Writing new tests guide

### Backend Documentation

#### 1. User Manual (API Consumers)
**Location:** Backend repo `docs/API_DOCUMENTATION.md`

**Contents:**
- API overview and base URL
- Authentication flow
- Request/response formats
- Error handling
- Rate limiting
- Example requests (cURL, JavaScript)
- SDKs and client libraries

**Target Audience:** Frontend developers, API consumers

#### 2. Developer Guide (Backend Developers)
**Location:** Backend repo `docs/DEVELOPER_GUIDE.md`

**Contents:**
- Project structure
- Setup and installation
- Database schema
- Service layer architecture
- Authentication middleware
- File upload handling
- Email service integration
- Testing strategy
- Deployment process

**Target Audience:** Backend developers joining the project

#### 3. API Guide (31 Endpoints)
**Location:** Backend repo `docs/API_ENDPOINTS.md`

**Contents:**
- Authentication endpoints (8)
- Recipe endpoints (12)
- Rating & Comment endpoints (6)
- Admin endpoints (5)
- Notification endpoints (10)
- Request/response schemas
- Authentication requirements
- Error codes and messages

**Target Audience:** All developers, QA team

#### 4. Additional Backend Documentation (15+ files)
**Existing Files:**
- ✅ Database schema documentation
- ✅ Migration guides
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Monitoring and logging setup
- ✅ Deployment procedures
- ✅ Troubleshooting guide

#### 5. Postman Collection
**Location:** Backend repo `postman/FitRecipes_v1.0.0.json`

**Status:** 📋 To be created before release

**Contents:**
- All 31 API endpoints
- Pre-configured environment variables
- Authentication tokens
- Example requests and responses
- Test scripts for each endpoint

---

## 7. Testing Checklist ✅

### Frontend Testing

#### Unit Tests (Vitest + React Testing Library)
- **Current Status:** ~26% coverage
- **Target:** 80%+ coverage before v2.0.0
- **Test Count:** Growing (co-located tests)

**Test Categories:**
- ✅ Component rendering tests
- ✅ User interaction tests
- ✅ Form validation tests
- ✅ API service tests
- ✅ Hook tests (useAuth, useToast)

#### E2E Tests (Playwright - 85 tests)
**Current Status:** 47 passing / 38 failing (55% pass rate)

**Test Suites:**
- ✅ Authentication flows (13 tests)
  - Login/register forms
  - Google OAuth flow
  - Email verification
  - Password reset
- ✅ OAuth integration (11 tests)
  - OAuth callback handling
  - Terms acceptance
  - State preservation
- ✅ Terms of service (18 tests)
  - Read-only terms page
  - OAuth terms acceptance
  - Complete workflow
- ✅ Protected routes (16 tests)
  - Authentication guards
  - Role-based access
  - Navigation flows
- ✅ 404 handling (18 tests)
  - Error page display
  - Navigation behavior
  - Accessibility
- ✅ Accessibility (9 tests)
  - Keyboard navigation
  - ARIA labels
  - Screen reader support

**Browser Coverage:**
- ✅ Desktop Chrome
- ✅ Desktop Firefox
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

#### E2E Integration Tests with Backend (To be completed)
**Critical Path Tests:**
- [ ] **Authentication Flows**
  - [ ] Register new user → verify email → login
  - [ ] Login with email/password → access dashboard
  - [ ] Google OAuth login → accept terms → access dashboard
  - [ ] Forgot password → receive email → reset password → login
  - [ ] Logout → verify session cleared

- [ ] **Recipe CRUD Operations**
  - [ ] Chef: Submit new recipe → verify in pending list
  - [ ] Admin: Approve recipe → verify in browse page
  - [ ] Admin: Reject recipe → verify not in browse page
  - [ ] Customer: Browse recipes → filter by cuisine → see results
  - [ ] Customer: Search recipes by title → see results
  - [ ] Chef: Update own recipe → verify changes saved
  - [ ] Chef: Delete own recipe → verify removed

- [ ] **Rating & Comment System**
  - [ ] Customer: Rate recipe → verify rating saved
  - [ ] Customer: Rate own recipe → verify error message
  - [ ] Customer: Delete own rating → verify removed
  - [ ] Customer: Add comment → verify comment appears
  - [ ] Customer: Edit own comment → verify changes saved
  - [ ] Customer: Delete own comment → verify removed
  - [ ] Load more comments → verify pagination

- [ ] **Admin Approval Workflow**
  - [ ] Admin: View pending recipes → see submitted recipes
  - [ ] Admin: Approve recipe with feedback → verify chef notified
  - [ ] Admin: Reject recipe with reason → verify chef notified
  - [ ] Non-admin: Cannot access approval page → redirect to home

- [ ] **Notification System** (When backend ready)
  - [ ] Toast notifications appear for actions
  - [ ] Notification history sidebar (disabled in v1.0.0)
  - [ ] FCM push notifications (disabled in v1.0.0)
  - [ ] Email notifications (backend only)

- [ ] **Error Handling**
  - [ ] Invalid credentials → show error message
  - [ ] Expired JWT token → redirect to login
  - [ ] Network error → show retry option
  - [ ] 404 page → navigate to home
  - [ ] 500 server error → show error page

#### Manual Testing Checklist

**Pre-Deployment Checks:**
- [ ] All 14 pages load without errors
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Success toasts appear for actions
- [ ] Images load and display correctly
- [ ] Navigation works on all pages
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based access control works (Customer/Chef/Admin)
- [ ] OAuth flow completes successfully
- [ ] Email verification links work
- [ ] Password reset links work
- [ ] Mobile responsive on all pages
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Accessibility (keyboard navigation, ARIA labels)

**Performance Checks:**
- [ ] Page load time < 3 seconds
- [ ] Recipe list load time < 5 seconds
- [ ] Image loading optimized
- [ ] No console errors in production
- [ ] Lighthouse score > 90

### Backend Testing

#### Unit & Integration Tests
**Current Status:** 59 tests passing

**Test Categories:**
- ✅ Authentication service tests
- ✅ Recipe service tests
- ✅ Rating & comment service tests
- ✅ Admin service tests
- ✅ Notification service tests
- ✅ Database query tests
- ✅ Middleware tests (auth, error handling)

#### Manual Testing Checklist (60+ items)

**Authentication Module:**
- [ ] Register new user with valid data
- [ ] Register with duplicate email → error
- [ ] Login with valid credentials → JWT token returned
- [ ] Login with invalid credentials → error
- [ ] Logout → token invalidated
- [ ] Get current user with valid token
- [ ] Get current user with expired token → error
- [ ] Request password reset → email sent
- [ ] Reset password with valid token
- [ ] Reset password with expired token → error
- [ ] Verify email with valid token
- [ ] Verify email with expired token → error
- [ ] Resend verification email
- [ ] Google OAuth login → user created/logged in

**Recipe Module:**
- [ ] Create recipe (Chef) → saved to database
- [ ] Create recipe (Customer) → forbidden error
- [ ] Get all recipes → paginated list returned
- [ ] Get recipe by ID → recipe details returned
- [ ] Get non-existent recipe → 404 error
- [ ] Update own recipe (Chef) → changes saved
- [ ] Update other's recipe (Chef) → forbidden error
- [ ] Delete own recipe (Chef) → recipe removed
- [ ] Delete other's recipe (Chef) → forbidden error
- [ ] Browse recipes with filters → filtered results
- [ ] Search recipes by title → matching results
- [ ] Upload recipe images → images stored
- [ ] Get recipes by chef ID → chef's recipes returned

**Rating & Comment Module:**
- [ ] Submit rating → rating saved
- [ ] Submit rating on own recipe → error
- [ ] Get user rating → rating returned
- [ ] Delete rating → rating removed
- [ ] Add comment → comment saved
- [ ] Add comment without authentication → error
- [ ] Update own comment → changes saved
- [ ] Update other's comment → forbidden error
- [ ] Delete own comment → comment removed
- [ ] Delete other's comment → forbidden error
- [ ] Get comments with pagination → paginated list

**Admin Module:**
- [ ] Get pending recipes (Admin) → pending list
- [ ] Get pending recipes (Non-admin) → forbidden error
- [ ] Approve recipe (Admin) → status updated
- [ ] Reject recipe (Admin) → status updated
- [ ] Approve recipe (Non-admin) → forbidden error

**Notification Module:**
- [ ] Get user notifications → notification list
- [ ] Mark notification as read → status updated
- [ ] Mark all as read → all updated
- [ ] Clear notifications → notifications removed
- [ ] Update notification preferences → settings saved
- [ ] Register FCM token → token stored
- [ ] Unregister FCM token → token removed

#### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 https://fitrecipes-backend.onrender.com/api/v1/recipes

# Using Artillery
artillery quick --count 100 --num 10 https://fitrecipes-backend.onrender.com/api/v1/recipes

# Expected Results:
# - Response time: < 500ms (p95)
# - Throughput: > 100 req/s
# - Error rate: < 1%
```

#### Security Testing Checklist
- [ ] SQL injection prevention → parameterized queries
- [ ] XSS prevention → input sanitization
- [ ] CSRF protection → tokens/headers
- [ ] JWT token validation → signature verified
- [ ] Password hashing → bcrypt used
- [ ] Rate limiting → 100 req/min per IP
- [ ] CORS configuration → only allowed origins
- [ ] Environment variables → not exposed
- [ ] Sensitive data encryption → TLS/SSL
- [ ] Input validation → Zod schemas
- [ ] File upload validation → type/size limits
- [ ] Error messages → no sensitive info leaked

#### Smoke Tests (After Deployment)
```bash
# 1. Health Check
curl https://fitrecipes-backend.onrender.com/health
# Expected: {"status": "ok"}

# 2. API Root
curl https://fitrecipes-backend.onrender.com/api/v1
# Expected: {"message": "FitRecipes API v1.0.0"}

# 3. Get Recipes (No Auth)
curl https://fitrecipes-backend.onrender.com/api/v1/recipes
# Expected: {"success": true, "data": [...]}

# 4. Login
curl -X POST https://fitrecipes-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Expected: {"success": true, "data": {"token": "..."}}

# 5. Protected Endpoint (With Auth)
curl https://fitrecipes-backend.onrender.com/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
# Expected: {"success": true, "data": {"id": "...", "email": "..."}}
```

### Integration Testing (Frontend + Backend)

#### Critical User Journeys
1. **New User Registration → Recipe Browse**
   - Register account
   - Verify email
   - Login
   - Browse recipes
   - View recipe detail
   - Rate recipe
   - Add comment

2. **Chef Recipe Submission → Admin Approval**
   - Chef login
   - Submit new recipe
   - Admin views pending recipes
   - Admin approves recipe
   - Recipe appears in browse page
   - Chef sees approved recipe in "My Recipes"

3. **OAuth User Flow**
   - Click "Sign in with Google"
   - Redirect to Google
   - Accept OAuth permissions
   - Redirect back to app
   - Accept terms of service
   - Access dashboard

4. **Password Reset Flow**
   - Click "Forgot Password"
   - Enter email
   - Receive reset email
   - Click reset link
   - Enter new password
   - Login with new password

---

## 8. Pre-Release Checklist ✅

### 1 Week Before Release (November 1, 2025)
- [ ] **Code Freeze:** No new features, bug fixes only
- [ ] **Staging Deployment:** Deploy to staging environment
- [ ] **Integration Testing:** Run all E2E tests with staging backend
- [ ] **Performance Testing:** Load test backend API
- [ ] **Security Audit:** Review security checklist
- [ ] **Documentation Review:** Update all documentation
- [ ] **Backup Verification:** Test database restore procedure

### 3 Days Before Release (November 5, 2025)
- [ ] **Final Testing:** Complete manual testing checklist
- [ ] **Bug Triage:** Fix critical/high priority bugs only
- [ ] **Release Notes:** Draft release notes for users
- [ ] **Rollback Plan:** Review and practice rollback procedure
- [ ] **Monitoring Setup:** Verify alerts and logging
- [ ] **Communication Plan:** Prepare announcement for users

### 1 Day Before Release (November 7, 2025)
- [ ] **Final Staging Test:** Smoke test on staging
- [ ] **Database Backup:** Ensure latest backup exists
- [ ] **Team Briefing:** Review release plan with team
- [ ] **Emergency Contacts:** Verify contact information
- [ ] **Status Page:** Prepare status updates
- [ ] **Support Team:** Brief support team on new features

### Release Day (November 8, 2025)
- [ ] **Backend Deployment:** Deploy backend at 9:00 AM
- [ ] **Backend Verification:** Run smoke tests
- [ ] **Frontend Deployment:** Deploy frontend at 9:30 AM
- [ ] **Frontend Verification:** Test critical paths
- [ ] **Integration Test:** Verify frontend-backend communication
- [ ] **Monitor:** Watch for errors and performance issues
- [ ] **Announce:** Post release announcement
- [ ] **Team Availability:** On-call for 24 hours post-release

### Post-Release (November 8-9, 2025)
- [ ] **Monitor Metrics:** Track error rates, response times
- [ ] **User Feedback:** Monitor support tickets and feedback
- [ ] **Bug Reports:** Triage and prioritize any issues
- [ ] **Performance:** Verify performance meets SLAs
- [ ] **Post-Mortem:** Document lessons learned
- [ ] **Celebrate:** 🎉 Team celebration!

---

## 9. Success Metrics 📊

### Key Performance Indicators (KPIs)

#### Frontend Metrics
- **Page Load Time:** < 3 seconds (target)
- **Time to Interactive:** < 5 seconds
- **Lighthouse Score:** > 90
- **Error Rate:** < 1%
- **Bounce Rate:** < 40%
- **Mobile Traffic:** > 40%

#### Backend Metrics
- **API Response Time:** < 500ms (p95)
- **Throughput:** > 100 req/s
- **Error Rate:** < 0.5%
- **Uptime:** > 99.9%
- **Database Query Time:** < 100ms (average)

#### Business Metrics
- **User Registrations:** Track new signups
- **Recipe Submissions:** Track chef engagement
- **Recipe Views:** Track user engagement
- **Active Users:** Daily/weekly active users
- **User Retention:** 7-day retention rate

---

## 10. Post-Release Support 🛟

### Support Schedule
- **Release Day (Nov 8):** All hands on deck (9 AM - 9 PM)
- **Week 1 (Nov 8-15):** Extended support hours
- **Ongoing:** Normal support schedule

### Escalation Path
1. **Level 1:** Frontend developer investigates
2. **Level 2:** Backend developer investigates
3. **Level 3:** Tech lead + DevOps
4. **Critical:** All hands emergency

### Known Issues / Limitations
- 🔴 Notification history sidebar disabled (backend not ready)
- 🔴 Save recipe feature disabled (backend not ready)
- ⚠️ Some E2E tests failing (incomplete features, not bugs)
- ⚠️ Unit test coverage at 26% (target 80% for v2.0.0)

---

## 11. Version Control Strategy 📝

### Git Branching Model
```
main (production)
  ↑
  release/1.0.0 (release candidate)
  ↑
  develop (integration)
  ↑
  feature/* (feature branches)
```

### Tagging Convention
- **v1.0.0** - Production release
- **v1.0.0-rc1** - Release candidate 1
- **v1.0.0-staging** - Staging deployment
- **v1.0.1** - Patch release

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example:**
```
feat(auth): add Google OAuth integration

- Implement OAuth callback handler
- Add terms acceptance page
- Update AuthContext with OAuth state

Closes #123
```

---

## 12. Contact Information 📞

### Frontend Team
- **Team Lead:** [Name] - [Email] - [Phone]
- **Developer:** [Name] - [Email] - [Phone]
- **QA Engineer:** [Name] - [Email] - [Phone]

### Backend Team
- **Team Lead:** [Name] - [Email] - [Phone]
- **Developer:** [Name] - [Email] - [Phone]
- **QA Engineer:** [Name] - [Email] - [Phone]

### DevOps / Infrastructure
- **DevOps Lead:** [Name] - [Email] - [Phone]

### Product & Design
- **Product Manager:** [Name] - [Email] - [Phone]
- **Designer:** [Name] - [Email] - [Phone]

### Emergency Contacts
- **On-Call Rotation:** [Schedule Link]
- **Incident Response:** [Slack Channel / PagerDuty]

---

## 13. Appendix 📚

### External Resources
- **Frontend Repository:** https://github.com/NinePTH/FitRecipes-Frontend
- **Backend Repository:** [Backend Repo URL]
- **Vercel Dashboard:** https://vercel.com/ninepth/fitrecipes
- **Render Dashboard:** https://dashboard.render.com
- **Supabase Dashboard:** [Supabase Project URL]
- **Status Page:** [Status Page URL]

### Related Documents
- `README.md` - Project overview and setup
- `TESTING.md` - Testing guide
- `AUTHENTICATION.md` - Auth system documentation
- `CHANGELOG.md` - Version history
- `NOTIFICATION_SYSTEM_BACKEND_SPEC.md` - Notification backend spec
- `NOTIFICATION_FEATURE_STATUS.md` - Notification status

### Glossary
- **RTO:** Recovery Time Objective (time to restore service)
- **RPO:** Recovery Point Objective (acceptable data loss)
- **JWT:** JSON Web Token (authentication)
- **OAuth:** Open Authorization (third-party login)
- **FCM:** Firebase Cloud Messaging (push notifications)
- **E2E:** End-to-End (full user journey testing)
- **CI/CD:** Continuous Integration / Continuous Deployment

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  
**Prepared By:** FitRecipes Frontend & Backend Teams  
**Approved By:** [Product Manager Name]  

**Status:** ✅ Ready for Release  
**Release Date:** November 8, 2025  
**Next Review:** Post-release retrospective (November 15, 2025)
