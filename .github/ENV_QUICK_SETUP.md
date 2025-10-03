# Environment Variables Quick Setup

## 🎯 What You Need to Add

### 1️⃣ Vercel Staging Project
**Where**: Vercel Dashboard → Your Staging Project → Settings → Environment Variables

Add these 9 variables (all environments: Production, Preview, Development):

```
VITE_API_BASE_URL = https://your-staging-backend.com/api/v1
VITE_API_TIMEOUT = 10000
VITE_JWT_SECRET = your-staging-jwt-secret
VITE_JWT_EXPIRES_IN = 7d
VITE_ENABLE_NOTIFICATIONS = false
VITE_ENABLE_SAVE_RECIPE = false
VITE_ENABLE_REPORTING = false
VITE_ENABLE_MOCK_DATA = false
VITE_LOG_LEVEL = debug
```

**Replace**:
- `https://your-staging-backend.com/api/v1` with your actual staging backend URL
- `your-staging-jwt-secret` with your staging JWT secret (if needed)

---

### 2️⃣ Vercel Production Project
**Where**: Vercel Dashboard → Your Production Project → Settings → Environment Variables

Add these 9 variables (all environments: Production, Preview, Development):

```
VITE_API_BASE_URL = https://your-production-backend.com/api/v1
VITE_API_TIMEOUT = 10000
VITE_JWT_SECRET = your-production-jwt-secret
VITE_JWT_EXPIRES_IN = 7d
VITE_ENABLE_NOTIFICATIONS = false
VITE_ENABLE_SAVE_RECIPE = false
VITE_ENABLE_REPORTING = false
VITE_ENABLE_MOCK_DATA = false
VITE_LOG_LEVEL = error
```

**Replace**:
- `https://your-production-backend.com/api/v1` with your actual production backend URL
- `your-production-jwt-secret` with your production JWT secret (if needed)

---

### 3️⃣ GitHub Environment Variables (Optional)
**Where**: Repository → Settings → Secrets and variables → Actions → **Variables** tab

**You probably don't need these!** Vercel handles environment variables during deployment.

Only add if you want to use them during GitHub Actions build process.

---

## ✅ Step-by-Step Checklist

### Staging Setup
- [ ] Go to Vercel Staging Project
- [ ] Click Settings → Environment Variables
- [ ] Add `VITE_API_BASE_URL` with your staging backend URL
- [ ] Add `VITE_API_TIMEOUT` = `10000`
- [ ] Add `VITE_JWT_SECRET` (optional, match backend)
- [ ] Add `VITE_JWT_EXPIRES_IN` = `7d`
- [ ] Add `VITE_ENABLE_NOTIFICATIONS` = `false`
- [ ] Add `VITE_ENABLE_SAVE_RECIPE` = `false`
- [ ] Add `VITE_ENABLE_REPORTING` = `false`
- [ ] Add `VITE_ENABLE_MOCK_DATA` = `false`
- [ ] Add `VITE_LOG_LEVEL` = `debug`
- [ ] Select all 3 environments for each variable
- [ ] Save all variables
- [ ] Redeploy: `git push origin develop`

### Production Setup
- [ ] Go to Vercel Production Project
- [ ] Click Settings → Environment Variables
- [ ] Add `VITE_API_BASE_URL` with your production backend URL
- [ ] Add `VITE_API_TIMEOUT` = `10000`
- [ ] Add `VITE_JWT_SECRET` (optional, match backend)
- [ ] Add `VITE_JWT_EXPIRES_IN` = `7d`
- [ ] Add `VITE_ENABLE_NOTIFICATIONS` = `false`
- [ ] Add `VITE_ENABLE_SAVE_RECIPE` = `false`
- [ ] Add `VITE_ENABLE_REPORTING` = `false`
- [ ] Add `VITE_ENABLE_MOCK_DATA` = `false`
- [ ] Add `VITE_LOG_LEVEL` = `error`
- [ ] Select all 3 environments for each variable
- [ ] Save all variables
- [ ] Redeploy: `git push origin main`

---

## 🧪 Quick Test

### Test Staging
```bash
# Deploy to staging
git push origin develop

# Then open browser DevTools on staging site and run:
console.log(import.meta.env.VITE_API_BASE_URL)
# Should show your staging backend URL
```

### Test Production
```bash
# Deploy to production
git push origin main

# Then open browser DevTools on production site and run:
console.log(import.meta.env.VITE_API_BASE_URL)
# Should show your production backend URL
```

---

## 📝 Important Notes

1. **MUST redeploy** after adding environment variables - they don't apply automatically
2. **Select all 3 environments** (Production, Preview, Development) for each variable
3. **Use different backend URLs** for staging vs production
4. **JWT secret is optional** - only needed if frontend validates JWTs (usually backend does this)
5. **Log level**: Use `debug` for staging, `error` for production

---

## ❓ What if I don't have backend URLs yet?

You can set them later! For now, you can use:
- Staging: `http://localhost:8000/api/v1` (will need to update later)
- Production: `http://localhost:8000/api/v1` (will need to update later)

Just remember to update them once your backends are deployed!

---

## 🚨 Common Mistakes to Avoid

1. ❌ Forgetting to redeploy after adding variables
2. ❌ Not selecting all 3 environments
3. ❌ Typos in variable names (they're case-sensitive!)
4. ❌ Wrong backend URL format (missing `/api/v1`)
5. ❌ Using same backend URL for both staging and production

---

See `ENVIRONMENT_SETUP.md` for detailed explanations!
