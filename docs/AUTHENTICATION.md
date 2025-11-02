# Authentication System Implementation

## Overview
Complete authentication system integrated with the backend API at `https://fitrecipes-backend.onrender.com` (production) and `https://fitrecipes-backend-staging.onrender.com` (staging).

## Features Implemented

### ✅ User Authentication
- **Email/Password Registration** - New users can sign up and receive email verification
- **Email/Password Login** - Secure login with JWT token storage
- **Google OAuth** - Sign in with Google (desktop and mobile support)
- **Password Reset Flow** - Forgot password → Email → Reset link → New password
- **Session Management** - Persistent sessions with automatic token restoration
- **Account Lockout** - 5 failed login attempts → 15-minute lockout

### ✅ Protected Routes
- **Authentication Check** - Redirects unauthenticated users to login
- **Role-Based Access Control** - USER, CHEF, and ADMIN roles
- **Intended Destination** - Returns users to their intended page after login
- **Loading States** - Smooth loading experience during authentication checks

### ✅ User Experience
- **Error Handling** - Clear, user-friendly error messages
- **Success Feedback** - Visual confirmation for successful actions
- **Loading States** - Spinners and disabled buttons during API calls
- **Form Validation** - Client-side validation before submission
- **Auto-Clear Errors** - Error messages clear when user starts typing

## File Structure

```
src/
├── services/
│   ├── api.ts              # API client with backend response handling
│   └── auth.ts             # Authentication service with all auth methods
├── contexts/
│   └── AuthContext.tsx     # Auth state management provider
├── hooks/
│   └── useAuth.ts          # Hook to access auth context
├── components/
│   └── ProtectedRoute.tsx  # Route wrapper for authentication
├── pages/
│   ├── AuthPage.tsx                 # Login/Register combined page
│   ├── ForgotPasswordPage.tsx       # Password reset request
│   ├── ResetPasswordPage.tsx        # Password reset with token
│   └── GoogleCallbackPage.tsx       # OAuth callback handler
└── types/
    └── index.ts            # TypeScript types including BackendResponse
```

## Backend API Integration

### Base URLs
```typescript
// Development
VITE_API_BASE_URL=http://localhost:3000

// Staging
VITE_API_BASE_URL=https://fitrecipes-backend-staging.onrender.com

// Production
VITE_API_BASE_URL=https://fitrecipes-backend.onrender.com
```

### Endpoints Used
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - Session termination
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset with token
- `GET /api/v1/auth/me` - Get current user profile
- `GET /api/v1/auth/google` - Google OAuth initiation
- `GET /api/v1/auth/google/callback` - Google OAuth callback

### Response Format
All endpoints return consistent format:
```typescript
{
  status: 'success' | 'error',
  data: T | null,
  message: string,
  errors?: Array<{
    code: string,
    message: string,
    path?: string[]
  }>
}
```

## Authentication Flow

### 1. Registration Flow
```
User fills form → Submit → POST /api/v1/auth/register
→ Success: Email sent for verification → Show message
→ Error: Display validation errors
```

### 2. Login Flow
```
User enters credentials → Submit → POST /api/v1/auth/login
→ Success: Store token & user → Redirect to intended page
→ Error: Display error (invalid credentials, account locked, etc.)
```

### 3. OAuth Flow
```
User clicks "Sign in with Google" → GET /api/v1/auth/google
→ Redirect to Google → User authorizes → Callback to /auth/google/callback
→ Backend processes → Frontend receives token & user → Store & redirect
```

### 4. Password Reset Flow
```
Forgot Password page → Enter email → POST /api/v1/auth/forgot-password
→ Email sent with reset link → User clicks link (contains token)
→ Reset Password page → Enter new password → POST /api/v1/auth/reset-password
→ Success: Redirect to login → User logs in
```

### 5. Session Persistence
```
App loads → AuthService.init() → Check localStorage for token
→ If token exists: Set Authorization header → Verify with GET /api/v1/auth/me
→ If valid: Restore user state → If invalid: Clear auth data
```

## Role-Based Access Control

### Roles
- **USER** - Basic user, can browse and view recipes
- **CHEF** - Can submit recipes and view their submissions
- **ADMIN** - Full access including recipe approval

### Route Protection
```tsx
// All authenticated users
<ProtectedRoute>
  <BrowseRecipesPage />
</ProtectedRoute>

// Chef and Admin only
<ProtectedRoute requiredRoles={['CHEF', 'ADMIN']}>
  <RecipeSubmissionPage />
</ProtectedRoute>

// Admin only
<ProtectedRoute requiredRoles={['ADMIN']}>
  <AdminRecipeApprovalPage />
</ProtectedRoute>
```

## Usage Examples

### Using Auth in Components
```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Manual Authentication Check
```tsx
import { AuthService } from '@/services/auth';

// Check if authenticated
const isAuth = AuthService.isAuthenticated();

// Check role
const isAdmin = AuthService.hasRole('ADMIN');
const isChefOrAdmin = AuthService.hasAnyRole(['CHEF', 'ADMIN']);

// Get user
const user = AuthService.getUser();
```

### Making Authenticated API Calls
```tsx
import { apiClient } from '@/services/api';

// Token is automatically included in Authorization header
const data = await apiClient.get('/api/v1/recipes');
```

## Error Handling

### Backend Error Types
1. **Validation Errors** - Invalid input data (Zod errors)
2. **Authentication Errors** - Invalid credentials, expired token
3. **Authorization Errors** - Insufficient permissions
4. **Account Lockout** - Too many failed login attempts
5. **OAuth Errors** - Google authentication failures

### Error Display
All errors are caught and displayed with:
- Red error box with icon
- Clear error message from backend
- Auto-clear when user starts typing
- Specific guidance for special cases (lockout, OAuth, etc.)

## Security Features

### Token Storage
- JWT tokens stored in `localStorage`
- Tokens automatically attached to API requests via interceptor
- Tokens cleared on logout or authentication failure

### Session Security
- Token verification on app load
- Automatic logout on token expiration
- Account lockout after failed attempts
- Secure OAuth state validation

### CORS
Backend configured to accept requests from:
- `http://localhost:5173` (development)
- `https://fitrecipes-staging.vercel.app` (staging)
- `https://fitrecipes.vercel.app` (production)

## Environment Variables

Required environment variables in `.env.local`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# Frontend Configuration
VITE_FRONTEND_URL=http://localhost:5173

# Authentication (optional, for reference)
VITE_JWT_SECRET=your-secret-key
VITE_JWT_EXPIRES_IN=1d

# Development
VITE_ENABLE_MOCK_DATA=false
VITE_LOG_LEVEL=debug
```

## Testing

### Test Accounts
Create test accounts or use Google OAuth for testing. Backend enforces:
- Minimum 8 characters for passwords
- Valid email format
- Terms agreement for registration

### Testing Scenarios
1. **Registration** - Valid data → Email verification message
2. **Login Success** - Valid credentials → Redirect to home
3. **Login Failure** - Invalid credentials → Error message
4. **Account Lockout** - 5 failed attempts → Lockout message
5. **Password Reset** - Request → Email → Reset → Success
6. **OAuth** - Google sign-in → Callback → Success
7. **Protected Routes** - Unauthenticated → Redirect to login
8. **Role Check** - Wrong role → Redirect to home
9. **Session Persistence** - Refresh page → Still logged in
10. **Logout** - Logout → Token cleared → Redirect

## Troubleshooting

### Issue: "Request timeout"
- Check `VITE_API_BASE_URL` is correct
- Ensure backend is running and accessible
- Verify network connection

### Issue: "Authentication failed" on valid credentials
- Check backend is using correct JWT secret
- Verify user account exists and is not locked
- Check for OAuth-linked accounts (use Google sign-in instead)

### Issue: "Google login fails"
- Verify Google OAuth is configured on backend
- Check redirect URI matches frontend URL
- Ensure `VITE_FRONTEND_URL` is correct

### Issue: Session not persisting
- Check browser localStorage is enabled
- Verify token is being stored (DevTools → Application → Local Storage)
- Check token expiration (default 24 hours)

### Issue: Role-based routes not working
- Verify user role is correct (USER, CHEF, or ADMIN)
- Check backend returns role in uppercase
- Ensure `requiredRoles` array uses uppercase roles

## Next Steps

### Recommended Enhancements
- [ ] Add email verification reminder
- [ ] Implement "Remember me" option
- [ ] Add password strength indicator
- [ ] Show recent login history
- [ ] Add two-factor authentication
- [ ] Implement refresh tokens
- [ ] Add social login providers (Facebook, Apple)
- [ ] Profile management page
- [ ] Change password functionality
- [ ] Account deletion option

### Testing Improvements
- [ ] Add unit tests for auth service
- [ ] Add integration tests for auth flows
- [ ] Test protected routes
- [ ] Test role-based access
- [ ] Test OAuth flow with mocked Google
- [ ] Test error scenarios

## Support

For issues or questions:
1. Check this documentation
2. Review backend API documentation
3. Check browser console for errors
4. Verify environment variables
5. Test with backend staging environment first
