# FitRecipes Release Plan v2.0.0

**Combined Frontend & Backend Release Plan**

---

## 1. Version Information

**Date:** December 31, 2025 (end of sprint 4)

### Frontend
- **Release:** v2.0.0
- **Git Tag:** `v2.0.0`
- **Team:** FitRecipes Frontend Team
- **Platform:** Vercel
- **Production URL:** https://fitrecipes.vercel.app
- **Staging URL:** https://fitrecipes-staging.vercel.app

### Backend
- **Release:** v2.0.0
- **Git Tag:** `v2.0.0`
- **Team:** FitRecipes Backend Team
- **Platform:** Render.com (Cloud PaaS)
- **Production URL:** https://fitrecipes-backend.onrender.com
- **Staging URL:** https://fitrecipes-backend-staging.onrender.com

---

## 2. Scope

### Features (Not in v1.0.0)

1. **Notification System**
   - Notification history sidebar with real-time updates
   - Push notifications via Firebase Cloud Messaging
   - Email notifications for key events
   - Notification preferences management

2. **Save Recipe / Bookmark Functionality**
   - Save/unsave recipes
   - Saved recipes sidebar
   - Bulk check saved status

3. **Smart Search & Advanced Filters**
   - Vector search integration with natural language processing
   - Search suggestions and auto-complete
   - Advanced filtering with multiple criteria
   - Auto-filter extraction from queries

4. **Admin Dashboard System**
   - User management page (ban/unban users, change roles, view user details)
   - Content moderation page (manage comments across all recipes)
   - System analytics page (user growth, recipe trends, engagement metrics)
   - Audit logs page (track admin actions)
   - Admin dashboard overview (quick stats and navigation)

5. **Chef Dashboard System**
   - Chef dashboard overview (recipe stats, performance metrics)
   - Chef analytics page (detailed recipe analytics)
   - Chef performance page (rankings and trends)
---

## 3. Deployment Method

### Frontend Deployment
- **Platform:** Vercel
- **Access Method:** Web browser (HTTPS)
- **Deployment Process:** Push to `main` or `develop` branch triggers auto-deployment to production or staging

### Backend Deployment
- **Platform:** Render.com (Cloud PaaS)
- **Access Method:** REST API (HTTPS)
- **Deployment Process:**
  1. Push to `main` or `develop` branch triggers auto-deployment to production or staging
  2. Database migrations run automatically after CD triggers

---

## 4. Configuration Requirements

### System Requirements
- **Node.js:** 18+ (LTS recommended)
- **npm:** 9+
- **Bun:** 1.0.0+ LTS
- **Database:** PostgreSQL 14+ (via Supabase)

### Environment Variables
All environment variables are documented in `.env.example` files in both frontend and backend repositories.
