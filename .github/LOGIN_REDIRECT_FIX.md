# Login Redirect Fix

## 🐛 Issue

After successfully signing in on the `/auth` page, users were not being redirected to the home page (`/`).

## 🔍 Root Cause

The `AuthPage` component was calling `authService.login()` directly, which authenticated the user but **did not update the AuthContext state**. This caused:

1. The user's token was stored in localStorage
2. The AuthContext still showed `isAuthenticated: false` and `user: null`
3. Protected routes saw the user as unauthenticated
4. Redirect attempted to go to `/`, but ProtectedRoute immediately redirected back to `/auth`
5. User appeared stuck on the login page

## ✅ Solution

Updated `AuthPage` to use the `useAuth` hook and call the context's `login` function instead of calling the service directly.

### Changes Made

**File: `src/pages/AuthPage.tsx`**

**Before:**
```tsx
// Direct service call - doesn't update context
const response = await authService.login({
  email: formData.email,
  password: formData.password,
});

setSuccess(`Welcome back, ${response.user.firstName}!`);
```

**After:**
```tsx
import { useAuth } from '@/hooks/useAuth';

export function AuthPage() {
  const { login: contextLogin } = useAuth();
  
  // ...
  
  // Context login - updates global state
  await contextLogin(formData.email, formData.password);
  
  setSuccess(`Welcome back!`);
```

### How It Works Now

1. User submits login form
2. `contextLogin()` is called (from AuthContext)
3. AuthContext calls `authService.login()` internally
4. AuthContext updates `user` state and `isAuthenticated` to `true`
5. User is redirected to intended destination (default `/`)
6. ProtectedRoute sees `isAuthenticated: true` and allows access
7. User successfully lands on home page (BrowseRecipesPage)

## 📋 Additional Improvements

### Added `/browse` Route Alias

Updated `App.tsx` to include both `/` and `/browse` routes pointing to BrowseRecipesPage:

```tsx
<Route path="/" element={<ProtectedRoute><BrowseRecipesPage /></ProtectedRoute>} />
<Route path="/browse" element={<ProtectedRoute><BrowseRecipesPage /></ProtectedRoute>} />
```

This ensures consistency with documentation that mentions redirecting to `/browse`.

## 🧪 Testing

### Manual Test Steps

1. Navigate to `http://localhost:5174/auth` (or your dev server port)
2. Enter valid credentials and click "Sign In"
3. **Expected**: Success message appears briefly
4. **Expected**: After 1 second, redirected to `/` (Browse Recipes page)
5. **Expected**: Can see navigation header with user info
6. **Expected**: Can access protected routes

### What Should Happen

```
User at /auth (not authenticated)
    ↓
Submit login form
    ↓
contextLogin() called
    ↓
AuthContext updates:
  - user: { id, email, firstName, ... }
  - isAuthenticated: true
    ↓
setTimeout redirect to "/"
    ↓
ProtectedRoute checks auth
    ↓
isAuthenticated === true ✅
    ↓
Render BrowseRecipesPage
    ↓
User lands on home page successfully!
```

## 🔑 Key Learnings

### Always Use Context for Global State

When you have a context managing authentication state:
- ✅ **DO** use context methods: `const { login } = useAuth(); await login(email, password);`
- ❌ **DON'T** bypass context: `await authService.login(credentials);`

### Why This Matters

**Direct service calls:**
- Update localStorage
- Don't update React state
- Components don't re-render
- Protected routes don't work

**Context calls:**
- Update localStorage (via service)
- Update React state
- Trigger re-renders
- Protected routes work correctly

## 📁 Files Modified

1. **`src/pages/AuthPage.tsx`**
   - Added `useAuth` hook import
   - Changed from `authService.login()` to `contextLogin()`
   - Simplified success message

2. **`src/App.tsx`**
   - Added `/browse` route as alias to `/`
   - Both routes show BrowseRecipesPage

## ✅ Status

- ✅ Login redirects correctly to home page
- ✅ AuthContext state updates properly
- ✅ Protected routes work as expected
- ✅ User can access authenticated pages after login

## 🎉 Result

Users can now successfully sign in and are automatically redirected to the home page (Browse Recipes). The authentication flow works correctly with the global state management.

---

**Fix Date**: October 5, 2025
**Issue**: Login not redirecting to home page
**Solution**: Use AuthContext login instead of direct service call
**Status**: ✅ Fixed and tested
