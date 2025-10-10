# GitHub Repository Secrets Setup Guide

This guide explains how to configure GitHub repository secrets for staging and production deployments to Vercel.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### How to Add Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

---

## 1. VERCEL_TOKEN
**Description**: Your Vercel authentication token

**How to get it**:
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Give it a name (e.g., "GitHub Actions - FitRecipes")
4. Set scope to your account/team
5. Click **Create**
6. Copy the token immediately (you won't see it again)

**Add to GitHub**: 
- Name: `VERCEL_TOKEN`
- Value: `[paste your token here]`

---

## 2. VERCEL_ORG_ID
**Description**: Your Vercel organization/team ID

**How to get it**:
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** (for your team/account)
3. Look for **Team ID** or **Organization ID** 
   - OR use Vercel CLI: `npx vercel whoami` to see your org

**Alternative method**:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel link` in your project directory
3. Follow prompts to link to your Vercel project
4. Check `.vercel/project.json` - the `orgId` field contains your org ID

**Add to GitHub**:
- Name: `VERCEL_ORG_ID`
- Value: `team_xxxxxxxxxxxxxxxxxxxxx` or `user_xxxxxxxxxxxxxxxxxxxxx`

---

## 3. VERCEL_PROJECT_ID
**Description**: Your PRODUCTION Vercel project ID (main branch deployment)

**How to get it**:
1. Go to your production project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings**
3. Scroll to **General** section
4. Copy the **Project ID**

**Alternative method**:
1. Run `vercel link` in your project directory
2. Select your PRODUCTION project
3. Check `.vercel/project.json` - the `projectId` field

**Add to GitHub**:
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_xxxxxxxxxxxxxxxxxxxxx`

---

## 4. VERCEL_STAGING_PROJECT_ID
**Description**: Your STAGING Vercel project ID (develop branch deployment)

**How to get it**:
1. Create a NEW Vercel project for staging:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your repository again
   - Name it differently (e.g., "fitrecipes-frontend-staging")
   - Configure Git branch: Set to deploy only from `develop` branch
   - Click **Deploy**

2. After project is created:
   - Go to project **Settings**
   - Copy the **Project ID**

**Add to GitHub**:
- Name: `VERCEL_STAGING_PROJECT_ID`
- Value: `prj_xxxxxxxxxxxxxxxxxxxxx` (different from production)

---

## 5. GITHUB_TOKEN (Optional - Usually Auto-provided)
**Description**: GitHub authentication token

**Note**: This is usually automatically provided by GitHub Actions as `${{ secrets.GITHUB_TOKEN }}`. You typically don't need to create this manually.

If needed:
1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens**
2. Generate new token (classic) with `repo` scope
3. Copy and add to repository secrets

---

## Vercel Project Configuration

### Production Project Settings
**Project Name**: `fitrecipes-frontend` (or your chosen name)
**Git Branch**: `main`
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`
**Framework Preset**: Vite

### Staging Project Settings  
**Project Name**: `fitrecipes-frontend-staging` (or your chosen name)
**Git Branch**: `develop`
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`
**Framework Preset**: Vite

**Important**: Make sure both projects are configured to NOT auto-deploy from GitHub (since we're using GitHub Actions instead):
1. Go to project **Settings** → **Git**
2. Disable **Automatic Deployments** (or configure specific branches)

---

## Verification Checklist

After adding all secrets, verify:

- [ ] `VERCEL_TOKEN` - Valid Vercel API token
- [ ] `VERCEL_ORG_ID` - Your organization/team ID
- [ ] `VERCEL_PROJECT_ID` - Production project ID (main branch)
- [ ] `VERCEL_STAGING_PROJECT_ID` - Staging project ID (develop branch)
- [ ] Two separate Vercel projects created (production and staging)
- [ ] GitHub Actions workflow updated with staging deployment

---

## Testing the Setup

1. **Test Staging Deployment**:
   ```bash
   git checkout develop
   git commit --allow-empty -m "test: staging deployment"
   git push origin develop
   ```
   - Check GitHub Actions tab for workflow run
   - Verify deployment to staging project on Vercel

2. **Test Production Deployment**:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
   - Check GitHub Actions tab for workflow run
   - Verify deployment to production project on Vercel

---

## Troubleshooting

### Error: "Invalid token"
- Regenerate `VERCEL_TOKEN` and update in GitHub secrets
- Make sure token has correct permissions

### Error: "Project not found"
- Verify `VERCEL_ORG_ID` matches your Vercel account/team
- Verify `VERCEL_PROJECT_ID` and `VERCEL_STAGING_PROJECT_ID` are correct
- Make sure you've created both Vercel projects

### Deployment not triggering
- Check GitHub Actions workflow file (`.github/workflows/cicd.yml`)
- Verify branch names match (`main` and `develop`)
- Check GitHub Actions permissions in repository settings

---

## Quick Reference

| Secret Name | Used For | Where to Find |
|-------------|----------|---------------|
| `VERCEL_TOKEN` | Authentication | Vercel Account Settings → Tokens |
| `VERCEL_ORG_ID` | Organization ID | Vercel Settings or `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Production project | Production project Settings |
| `VERCEL_STAGING_PROJECT_ID` | Staging project | Staging project Settings |

---

## Environment URLs

After successful setup:
- **Production**: `https://your-production-project.vercel.app` (from main branch)
- **Staging**: `https://your-staging-project.vercel.app` (from develop branch)
