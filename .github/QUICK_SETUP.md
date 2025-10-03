# Quick Setup Summary

## What Changed
- ✅ Updated CI/CD workflow to deploy **staging** from `develop` branch (instead of preview)
- ✅ Staging uses a separate Vercel project with `--prod` flag
- ✅ Production still deploys from `main` branch as before

## GitHub Secrets You Need to Add

Go to: **Repository Settings → Secrets and variables → Actions → New repository secret**

### 1. VERCEL_TOKEN
- Get from: https://vercel.com/account/tokens
- Create new token → Copy it

### 2. VERCEL_ORG_ID  
- Get from: Vercel Dashboard → Settings → Team ID
- OR run: `npx vercel whoami`
- Format: `team_xxxxx` or `user_xxxxx`

### 3. VERCEL_PROJECT_ID (Production)
- Your existing production project
- Get from: Vercel project → Settings → Project ID
- Format: `prj_xxxxx`

### 4. VERCEL_STAGING_PROJECT_ID (New - Important!)
- **You need to create a NEW Vercel project for staging**
- Steps:
  1. Go to Vercel → New Project
  2. Import your repo again
  3. Name it: `fitrecipes-frontend-staging` (or similar)
  4. Set Git branch to: `develop`
  5. Deploy it
  6. Go to Settings → Copy Project ID
  7. Add to GitHub secrets

## How It Works Now

### Develop Branch (Staging)
```bash
git push origin develop
```
→ Deploys to: **Staging Vercel Project** (separate URL)

### Main Branch (Production)
```bash
git push origin main
```
→ Deploys to: **Production Vercel Project** (existing URL)

## Test It
1. Add all 4 secrets to GitHub
2. Push to develop: `git push origin develop`
3. Check GitHub Actions tab
4. Verify staging deployment on Vercel

See `DEPLOYMENT_SETUP.md` for detailed instructions!
