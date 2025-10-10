# OAuth Backend Requirements

This document outlines the required backend configuration for Google OAuth to work with the frontend.

## ✅ Frontend Implementation Complete

The frontend is now configured to handle the OAuth flow where:
1. User clicks "Sign in with Google"
2. Frontend calls `GET /api/v1/auth/google` to get authorization URL
3. Frontend redirects to Google
4. Backend handles Google callback and processes OAuth
5. **Backend redirects to frontend `/auth/callback` with token and user data in URL**
6. Frontend extracts token and user data, stores them, and completes login

## 🔧 Required Backend Configuration

### 1. Frontend Callback URL

The backend must redirect to the **frontend** after successful OAuth, not stay on backend URL.

**Backend Environment Variable Required:**
```bash
# .env
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://fitrecipes.vercel.app  # Production
```

### 2. OAuth Callback Redirect (Backend Code)

After successfully processing Google OAuth, backend must redirect to:

```
${FRONTEND_URL}/auth/callback?token={jwt}&userId={id}&email={email}&firstName={name}&lastName={name}&role={role}
```

**Example Success Redirect:**
```typescript
// Backend code example
return c.redirect(
  `${process.env.FRONTEND_URL}/auth/callback?` +
  `token=${jwtToken}&` +
  `userId=${user.id}&` +
  `email=${user.email}&` +
  `firstName=${user.firstName}&` +
  `lastName=${user.lastName || ''}&` +
  `role=${user.role}`
);
```

### 3. OAuth Error Redirect

On OAuth failure, backend must redirect to:

```
${FRONTEND_URL}/auth?error={errorCode}&message={errorMessage}
```

**Example Error Redirect:**
```typescript
// Backend code example
return c.redirect(
  `${process.env.FRONTEND_URL}/auth?` +
  `error=oauth_failed&` +
  `message=${encodeURIComponent('Google authentication failed')}`
);
```

**Error Codes:**
- `missing_code` - Authorization code not provided by Google
- `oauth_failed` - Token exchange or user fetch failed
- `oauth_not_implemented` - OAuth service unavailable

### 4. CORS Configuration

Backend must allow CORS from frontend URL:

```typescript
// Backend CORS configuration
const app = new Hono();

app.use('*', cors({
  origin: [
    'http://localhost:5173',           // Development
    'https://fitrecipes.vercel.app',   // Production
    // Add staging URL if needed
  ],
  credentials: true,
}));
```

### 5. Google Cloud Console Configuration

**Authorized redirect URIs** (Google Cloud Console):
- `http://localhost:3000/api/v1/auth/google/callback` (Development)
- `https://fitrecipes-backend.onrender.com/api/v1/auth/google/callback` (Production)

**Authorized JavaScript origins**:
- `http://localhost:5173` (Development)
- `https://fitrecipes.vercel.app` (Production)

## 📝 Backend OAuth Endpoint Checklist

### `GET /api/v1/auth/google`
- ✅ Returns authorization URL with state
- ✅ Response format:
```json
{
  "status": "success",
  "data": {
    "authUrl": "https://accounts.google.com/...",
    "state": "random_string"
  },
  "message": "Google auth URL generated"
}
```

### `GET /api/v1/auth/google/callback`
- ✅ Receives `code` and `state` from Google
- ✅ Exchanges code for Google tokens
- ✅ Fetches user info from Google
- ✅ Creates/updates user in database
- ✅ Generates JWT token
- ✅ **Redirects to frontend** (not backend) with:
  - Success: `${FRONTEND_URL}/auth/callback?token=...&userId=...&email=...&firstName=...&lastName=...&role=...`
  - Error: `${FRONTEND_URL}/auth?error=...&message=...`

## 🧪 Testing the Flow

### 1. Start Backend
```bash
cd backend
bun run dev
# Should be on http://localhost:3000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Should be on http://localhost:5173
```

### 3. Test OAuth Flow
1. Go to `http://localhost:5173/auth`
2. Click "Sign in with Google"
3. Verify you're redirected to Google login
4. After Google login, verify you're redirected back to `http://localhost:5173/auth/callback`
5. Verify URL contains `token`, `userId`, `email`, `firstName`, `lastName`, `role` parameters
6. Verify you're automatically logged in and redirected to `/browse`

### 4. Check Browser Console
Frontend logs should show:
```
✅ Google OAuth successful: { id, email, firstName, lastName, role, ... }
```

### 5. Check Network Tab
- `GET /api/v1/auth/google` should return 200 with authUrl
- Browser should navigate to Google
- Google should navigate to backend `/api/v1/auth/google/callback`
- Backend should 302 redirect to frontend `/auth/callback` (NOT stay on backend URL)

## ⚠️ Common Issues

### Issue: Stuck on backend URL after OAuth
**Problem**: Backend not redirecting to frontend
**Solution**: Check `FRONTEND_URL` in backend `.env`, verify redirect code

### Issue: Token not found in URL
**Problem**: Backend not including required parameters
**Solution**: Verify backend includes all parameters: token, userId, email, firstName, lastName, role

### Issue: CORS error
**Problem**: Frontend URL not in CORS_ORIGIN
**Solution**: Add frontend URL to backend CORS configuration

### Issue: "Invalid redirect URI" from Google
**Problem**: Backend callback URL not registered in Google Cloud Console
**Solution**: Add backend callback URL to Google Cloud Console authorized redirect URIs

## 🔐 Security Notes

1. **State Parameter**: Backend should validate state parameter to prevent CSRF
2. **HTTPS in Production**: Always use HTTPS for OAuth in production
3. **Token Expiration**: JWT tokens should expire (backend currently uses 24h)
4. **Secure Cookies**: Consider using httpOnly secure cookies instead of URL parameters for tokens (more secure)

## 📚 Related Files

- Frontend: `src/pages/GoogleCallbackPage.tsx` - Handles `/auth/callback` route
- Frontend: `src/pages/AuthPage.tsx` - Displays OAuth errors
- Frontend: `src/App.tsx` - Route configuration
- Backend: Check OAuth implementation in auth routes

## ✅ Implementation Status

### Frontend
- ✅ OAuth button initiates flow
- ✅ `/auth/callback` page extracts token and user data from URL
- ✅ Token and user stored in localStorage
- ✅ Automatic login and redirect
- ✅ Error handling with user-friendly messages
- ✅ Display OAuth errors on `/auth` page

### Backend Requirements
- ⚠️ **Verify**: Backend redirects to **frontend** `/auth/callback` (not backend URL)
- ⚠️ **Verify**: All required parameters included in redirect (token, userId, email, firstName, lastName, role)
- ⚠️ **Verify**: FRONTEND_URL environment variable configured
- ⚠️ **Verify**: CORS allows frontend URL
- ⚠️ **Verify**: Error redirects to frontend `/auth?error=...`
