# Environment Variables Setup Guide

This guide explains how to configure environment variables for GitHub Actions and Vercel deployments with separate staging and production backends.

---

## 📋 **Environment Variables Overview**

You need to configure these variables in 3 places:
1. **GitHub Repository Secrets** (for CI/CD pipeline)
2. **Vercel Staging Project** (for staging deployments from `develop` branch)
3. **Vercel Production Project** (for production deployments from `main` branch)

---

## 🔐 **GitHub Repository Secrets**

These are used during the CI/CD build process.

**Where**: Repository → Settings → Secrets and variables → Actions → **Secrets** tab

### Required Secrets

| Secret Name | Value | Purpose |
|-------------|-------|---------|
| `VERCEL_TOKEN` | Your Vercel API token | Deployment authentication |
| `VERCEL_ORG_ID` | Your Vercel org/team ID | Project organization |
| `VERCEL_PROJECT_ID` | Production project ID | Production deployment target |
| `VERCEL_STAGING_PROJECT_ID` | Staging project ID | Staging deployment target |

*(These are already set up for deployment)*

---

## 🌍 **GitHub Environment Variables** (Optional but Recommended)

These can be used during build time if needed.

**Where**: Repository → Settings → Secrets and variables → Actions → **Variables** tab

### Optional Variables for Build Process

| Variable Name | Staging Value | Production Value |
|---------------|---------------|------------------|
| `VITE_API_BASE_URL` | `https://your-staging-backend.com/api` | `https://your-production-backend.com/api` |
| `VITE_API_TIMEOUT` | `10000` | `10000` |
| `VITE_ENABLE_MOCK_DATA` | `false` | `false` |
| `VITE_LOG_LEVEL` | `debug` | `error` |

**Note**: You typically don't need these in GitHub since Vercel handles the environment variables during deployment. Only add if you want to use them during GitHub Actions builds.

---

## 🚀 **Vercel Staging Project Environment Variables**

Configure these in your **staging** Vercel project.

**Where**: Vercel Staging Project → Settings → Environment Variables

### Add These Variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `VITE_API_BASE_URL` | `https://your-staging-backend.com/api/v1` | Production, Preview, Development |
| `VITE_API_TIMEOUT` | `10000` | Production, Preview, Development |
| `VITE_JWT_SECRET` | Your staging JWT secret | Production, Preview, Development |
| `VITE_JWT_EXPIRES_IN` | `7d` | Production, Preview, Development |
| `VITE_ENABLE_NOTIFICATIONS` | `false` | Production, Preview, Development |
| `VITE_ENABLE_SAVE_RECIPE` | `false` | Production, Preview, Development |
| `VITE_ENABLE_REPORTING` | `false` | Production, Preview, Development |
| `VITE_ENABLE_MOCK_DATA` | `false` | Production, Preview, Development |
| `VITE_LOG_LEVEL` | `debug` | Production, Preview, Development |

**Important Notes**:
- Replace `https://your-staging-backend.com/api/v1` with your actual staging backend URL
- The JWT secret should match your backend's JWT secret (or can be different if frontend doesn't need it)
- Set all environments to ensure consistency

---

## 🎯 **Vercel Production Project Environment Variables**

Configure these in your **production** Vercel project.

**Where**: Vercel Production Project → Settings → Environment Variables

### Add These Variables:

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| `VITE_API_BASE_URL` | `https://your-production-backend.com/api/v1` | Production, Preview, Development |
| `VITE_API_TIMEOUT` | `10000` | Production, Preview, Development |
| `VITE_JWT_SECRET` | Your production JWT secret | Production, Preview, Development |
| `VITE_JWT_EXPIRES_IN` | `7d` | Production, Preview, Development |
| `VITE_ENABLE_NOTIFICATIONS` | `false` | Production, Preview, Development |
| `VITE_ENABLE_SAVE_RECIPE` | `false` | Production, Preview, Development |
| `VITE_ENABLE_REPORTING` | `false` | Production, Preview, Development |
| `VITE_ENABLE_MOCK_DATA` | `false` | Production, Preview, Development |
| `VITE_LOG_LEVEL` | `error` | Production, Preview, Development |

**Important Notes**:
- Replace `https://your-production-backend.com/api/v1` with your actual production backend URL
- Use `error` log level for production to reduce noise
- The JWT secret should match your production backend's JWT secret
- **Never commit JWT secrets to Git!**

---

## 📝 **Step-by-Step Setup Instructions**

### 1. Vercel Staging Project Setup

1. Go to https://vercel.com/dashboard
2. Click on your **staging project** (e.g., `fitrecipes-frontend-staging`)
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter **Key** (e.g., `VITE_API_BASE_URL`)
   - Enter **Value** (e.g., `https://staging-backend.yourapp.com/api/v1`)
   - Select all environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**
5. Repeat for all variables listed above

### 2. Vercel Production Project Setup

1. Go to your **production project** (e.g., `fitrecipes-frontend`)
2. Go to **Settings** → **Environment Variables**
3. Follow the same steps as staging, but with **production values**
4. Make sure to use production backend URL and credentials

### 3. Redeploy (Important!)

After adding environment variables, you need to redeploy:

**For Staging**:
```bash
git push origin develop
```
Or manually redeploy in Vercel dashboard

**For Production**:
```bash
git push origin main
```
Or manually redeploy in Vercel dashboard

---

## 🔍 **How to Find Your Backend URLs**

### Staging Backend URL
- Check your backend staging deployment (e.g., Render, Railway, AWS)
- Format: `https://your-backend-staging.onrender.com/api/v1`
- Test it: `curl https://your-backend-staging.onrender.com/health`

### Production Backend URL
- Check your backend production deployment
- Format: `https://your-backend-prod.onrender.com/api/v1`
- Test it: `curl https://your-backend-prod.onrender.com/health`

---

## ✅ **Verification Checklist**

### Vercel Staging
- [ ] `VITE_API_BASE_URL` points to staging backend
- [ ] All environment variables added
- [ ] All variables set for all 3 environments (Production, Preview, Development)
- [ ] Redeployed after adding variables
- [ ] Test frontend can connect to staging backend

### Vercel Production  
- [ ] `VITE_API_BASE_URL` points to production backend
- [ ] All environment variables added
- [ ] All variables set for all 3 environments
- [ ] Redeployed after adding variables
- [ ] Test frontend can connect to production backend

### GitHub (Optional)
- [ ] Add variables only if needed for build-time usage
- [ ] Otherwise, rely on Vercel environment variables

---

## 🧪 **Testing Your Setup**

### Test Staging
1. Go to your staging URL (e.g., `https://fitrecipes-frontend-staging.vercel.app`)
2. Open browser DevTools → Network tab
3. Try to login or make an API call
4. Check the request URL - should point to **staging backend**
5. Check console for any CORS or connection errors

### Test Production
1. Go to your production URL (e.g., `https://fitrecipes-frontend.vercel.app`)
2. Open browser DevTools → Network tab
3. Try to login or make an API call
4. Check the request URL - should point to **production backend**
5. Verify no mock data is being used

---

## 🚨 **Common Issues & Solutions**

### Issue: Frontend can't connect to backend
**Solution**: 
- Check CORS settings on backend allow your frontend domains
- Verify `VITE_API_BASE_URL` is correct (include `/api/v1` path)
- Check backend is actually running and accessible

### Issue: Environment variables not working
**Solution**:
- Redeploy after adding variables (Vercel doesn't auto-apply)
- Check variable names match exactly (case-sensitive)
- Verify all environments are selected

### Issue: Still seeing mock data in production
**Solution**:
- Set `VITE_ENABLE_MOCK_DATA=false` in Vercel
- Redeploy the project
- Clear browser cache and hard refresh

### Issue: Different behavior in local vs deployed
**Solution**:
- Check `.env.local` vs Vercel environment variables
- Use same values for consistency
- Test with production build locally: `npm run build && npm run preview`

---

## 📚 **Environment Variables Reference**

### Required Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `VITE_API_BASE_URL` | string | Backend API endpoint | `https://api.example.com/api/v1` |
| `VITE_API_TIMEOUT` | number | Request timeout (ms) | `10000` |

### Optional Variables

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `VITE_JWT_SECRET` | string | JWT signing secret | - |
| `VITE_JWT_EXPIRES_IN` | string | JWT expiration | `7d` |
| `VITE_ENABLE_MOCK_DATA` | boolean | Use mock data | `false` |
| `VITE_LOG_LEVEL` | string | Logging level | `error` |
| `VITE_ENABLE_NOTIFICATIONS` | boolean | Enable notifications | `false` |
| `VITE_ENABLE_SAVE_RECIPE` | boolean | Enable save recipe | `false` |
| `VITE_ENABLE_REPORTING` | boolean | Enable reporting | `false` |

---

## 🔒 **Security Best Practices**

1. **Never commit secrets to Git**
   - Keep `.env.local` in `.gitignore`
   - Use different secrets for staging/production

2. **Rotate secrets regularly**
   - Change JWT secrets periodically
   - Update in both frontend and backend

3. **Use environment-specific values**
   - Different API URLs for staging/production
   - Different log levels (debug vs error)

4. **Limit access**
   - Only necessary team members should access Vercel/GitHub secrets
   - Use Vercel team permissions appropriately

---

## 📞 **Need Help?**

- **Vercel Docs**: https://vercel.com/docs/projects/environment-variables
- **Vite Env Docs**: https://vitejs.dev/guide/env-and-mode.html
- **GitHub Secrets**: https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

## Quick Command Reference

```bash
# Test your current environment variables
npm run dev  # Check console for API_BASE_URL

# Build with production mode
npm run build

# Preview production build locally
npm run preview

# Check what Vite sees
console.log(import.meta.env.VITE_API_BASE_URL)
```
