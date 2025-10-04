# Mock Data Role Fix Guide

## ⚠️ Issue

Several page files contain mock data with lowercase role values (`'user'`, `'chef'`, `'admin'`) that don't match the TypeScript type definitions which require uppercase (`'USER'`, `'CHEF'`, `'ADMIN'`).

## 📋 Files with Role Issues

### 1. `src/pages/BrowseRecipesPage.tsx`
- Line 51: `role: 'chef'` → Should be `'CHEF'`

### 2. `src/pages/RecipeDetailPage.tsx`
- Line 83: `role: 'user'` → Should be `'USER'`
- Line 100: `role: 'chef'` → Should be `'CHEF'`
- Line 117: `role: 'user'` → Should be `'USER'`
- Line 134: `role: 'user'` → Should be `'USER'`
- Line 151: `role: 'user'` → Should be `'USER'`
- Line 171: `role: 'chef'` → Should be `'CHEF'`
- Line 241: `role: 'user'` → Should be `'USER'`
- Line 609: Comparison with `'chef'` → Should be `'CHEF'`

### 3. `src/pages/RecipeSubmissionPage.tsx`
- Line 102: `role: 'chef'` → Should be `'CHEF'`

### 4. `src/pages/AdminRecipeApprovalPage.tsx`
- Line 41: `role: 'chef'` → Should be `'CHEF'`
- Line 78: `role: 'chef'` → Should be `'CHEF'`

### 5. `src/pages/MyRecipesPage.tsx`
- Line 66: `role: 'chef'` → Should be `'CHEF'`
- Line 114: `role: 'chef'` → Should be `'CHEF'`
- Line 164: `role: 'chef'` → Should be `'CHEF'`

## 🔧 How to Fix

### Quick Fix (Find & Replace)
1. Open each file listed above
2. Find: `role: 'user'` → Replace with: `role: 'USER'`
3. Find: `role: 'chef'` → Replace with: `role: 'CHEF'`
4. Find: `role: 'admin'` → Replace with: `role: 'ADMIN'`
5. Find: `=== 'chef'` → Replace with: `=== 'CHEF'`
6. Find: `=== 'user'` → Replace with: `=== 'USER'`
7. Find: `=== 'admin'` → Replace with: `=== 'ADMIN'`

### Verification
After fixing, run:
```bash
npm run build
```

Should complete without errors.

## 📝 Root Cause

These files were created with placeholder mock data before the backend integration. The backend uses uppercase roles (`USER`, `CHEF`, `ADMIN`), which is the correct format according to the backend API specification.

## ✅ Prevention

When adding new mock data:
- Always use uppercase for roles: `'USER'`, `'CHEF'`, `'ADMIN'`
- Reference `src/types/index.ts` for correct type definitions
- Run TypeScript check before committing: `npm run build`

## 🎯 Priority

**Low Priority** - These are only mock data issues in development pages. The OAuth implementation and authentication system are working correctly with uppercase roles.

Fix when:
- Working on those specific pages
- Before final production deployment
- When converting mock data to real API calls

## 📚 Related

- `src/types/index.ts` - Defines `User['role']` type as `'USER' | 'CHEF' | 'ADMIN'`
- Backend API returns roles in uppercase format
- OAuth implementation correctly uses uppercase roles
