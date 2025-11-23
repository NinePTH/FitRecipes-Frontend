# Push Notification Token Lifecycle Management

## Overview

This document explains how FCM (Firebase Cloud Messaging) tokens are managed throughout the user's session in the FitRecipes application.

## Token Lifecycle Flow

### 1. **User Login** 
- User logs in to the application
- No automatic FCM token registration
- User authentication is established

### 2. **Enable Push Notifications** (User Action Required)
**Trigger Options:**
- Automatic banner prompt (appears 2 seconds after login)
- Manual enable button in Notification Settings page (`/settings/notifications`)

**Process:**
1. User clicks "Enable Push" button
2. Browser requests notification permission
3. If granted:
   - Gets FCM token from Firebase
   - Registers token with backend API (`POST /api/v1/notifications/fcm/register`)
   - Updates user preferences (`pushNotifications.enabled = true`)
   - Token is stored in backend database

### 3. **Disable Push Notifications** (User Action)
**Trigger:**
- User clicks "Disable Push" button in Notification Settings page

**Process:**
1. Gets current FCM token from Firebase
2. Unregisters token from backend API (`DELETE /api/v1/notifications/fcm/unregister`)
3. Updates user preferences (`pushNotifications.enabled = false`)
4. Backend removes token from database

### 4. **User Logout**
- User logs out
- **FCM token is NOT unregistered** (intentional design)
- Token remains in backend database
- Benefits:
  - User can re-enable notifications on next login without re-requesting permission
  - Better UX - no repeated permission prompts
  - Token persists across sessions

### 5. **Re-login Behavior**
**Case A: User previously enabled push notifications**
- Token still registered in backend
- User can receive push notifications immediately
- No need to re-enable or re-request permission

**Case B: User never enabled push notifications**
- No token registered
- Automatic banner prompt appears again (if not dismissed for 7 days)
- User can enable push notifications

**Case C: User previously disabled push notifications**
- Token was unregistered from backend
- User sees "Enable Push" button in settings
- Can re-enable by clicking button (no permission prompt if already granted)

## Implementation Details

### Files Modified

#### 1. `src/contexts/AuthContext.tsx`
- **Removed** `unregisterPush()` from logout flow
- Logout now only:
  - Calls backend logout API
  - Clears user state
  - Does NOT touch FCM tokens

#### 2. `src/pages/NotificationSettingsPage.tsx`
- **Added** `handleEnablePushNotifications()`:
  - Requests browser permission
  - Gets FCM token
  - Registers with backend
  - Updates preferences
  
- **Added** `handleDisablePushNotifications()`:
  - Gets current FCM token
  - Unregisters from backend
  - Updates preferences
  
- **Updated UI**:
  - Replaced toggle switch with Enable/Disable buttons
  - Shows current status (enabled/disabled)
  - Loading states during enable/disable
  - Clear visual feedback

#### 3. `src/services/pushNotifications.ts`
- **Enhanced** `unregisterPush()`:
  - Added comprehensive logging
  - Better error handling
  - Re-throws errors for caller to handle

#### 4. `src/services/api.ts`
- **Updated** `deleteRequest()`:
  - Now supports request body (for DELETE with body)
  - Required for FCM unregister endpoint

### API Endpoints

#### Register FCM Token
```http
POST /api/v1/notifications/fcm/register
Content-Type: application/json
Authorization: Bearer <token>

{
  "fcmToken": "string",
  "browser": "Chrome",
  "os": "Windows"
}

Response: { "tokenId": "string" }
```

#### Unregister FCM Token
```http
DELETE /api/v1/notifications/fcm/unregister
Content-Type: application/json
Authorization: Bearer <token>

{
  "fcmToken": "string"
}

Response: 204 No Content
```

## User Experience Benefits

### ✅ Better UX
1. **No repeated permission prompts** - Permission persists across sessions
2. **Quick re-enable** - If user disabled push, they can re-enable without permission prompt
3. **Seamless logout/login** - Notifications work immediately after re-login
4. **Clear control** - Explicit Enable/Disable buttons instead of confusing toggle

### ✅ Security
1. **User consent required** - Token only registered when user explicitly enables
2. **User can revoke** - Easy to disable push notifications anytime
3. **Backend validation** - All token operations require authentication

### ✅ Performance
1. **Reduced API calls** - No unregister on every logout
2. **Faster login** - No FCM token refresh on every login
3. **Persistent tokens** - Browser permission state cached

## Testing Checklist

### Test Case 1: First-time User
- [ ] Login
- [ ] See automatic push notification banner
- [ ] Click "Enable Push Notifications"
- [ ] Grant browser permission
- [ ] See success message
- [ ] Verify token registered in backend
- [ ] Receive test push notification

### Test Case 2: Disable Push
- [ ] Go to Notification Settings
- [ ] Click "Disable Push"
- [ ] See success message
- [ ] Verify token unregistered in backend
- [ ] Should NOT receive push notifications

### Test Case 3: Re-enable Push
- [ ] After disabling, click "Enable Push"
- [ ] Should NOT ask for permission again (already granted)
- [ ] See success message
- [ ] Verify new/same token registered in backend
- [ ] Receive test push notification

### Test Case 4: Logout/Login Cycle
- [ ] Enable push notifications
- [ ] Logout
- [ ] Login again
- [ ] Push notifications should still work
- [ ] No permission prompt
- [ ] Token should be same as before

### Test Case 5: Browser Permission Denied
- [ ] Block notifications in browser settings
- [ ] Try to enable push
- [ ] Should show error message
- [ ] Preferences should NOT show as enabled
- [ ] Guide user to browser settings

## Edge Cases Handled

### 1. **FCM Token Refresh**
- Firebase automatically refreshes tokens periodically
- New token is automatically registered via `onTokenRefresh` listener
- Old token is replaced in backend

### 2. **Multiple Devices**
- User can have multiple FCM tokens (one per browser/device)
- Backend stores all tokens
- Push notifications sent to all registered devices
- Disabling on one device doesn't affect others

### 3. **Browser Permission Revoked**
- If user blocks notifications in browser settings:
  - Token becomes invalid
  - Backend will receive error when sending push
  - Backend should mark token as invalid
  - User needs to re-grant permission

### 4. **Service Worker Errors**
- If service worker fails to register:
  - FCM token cannot be obtained
  - Enable push will fail gracefully
  - User sees error message
  - Console logs show detailed error

## Console Logging

All push notification operations log to console for debugging:

```
🔔 Enabling push notifications...
✅ Notification permission granted
✅ FCM token obtained: BNrJ2...
✅ Token registered with backend successfully
✅ Push notifications enabled, updating preferences...

🔔 Disabling push notifications...
🔔 Starting push token unregistration...
🔔 Getting current FCM token...
✅ FCM token found: BNrJ2...
🔔 Unregistering token with backend...
✅ Push token unregistered successfully
```

## Future Enhancements

### Potential Improvements
1. **Token Rotation**: Automatically rotate tokens every X days for security
2. **Device Management**: Show list of devices with push enabled
3. **Silent Failure Recovery**: Auto-retry failed registrations
4. **Permission Prompt Optimization**: Smart timing for permission requests
5. **Push Preview**: Test push notification before enabling

## Related Documentation

- [NOTIFICATION_SYSTEM_IMPLEMENTATION.md](./NOTIFICATION_SYSTEM_IMPLEMENTATION.md) - Full notification system overview
- [FRONTEND_NOTIFICATION_GUIDE.md](./FRONTEND_NOTIFICATION_GUIDE.md) - Complete frontend guide
- [NOTIFICATION_SYSTEM_BACKEND_SPEC.md](./NOTIFICATION_SYSTEM_BACKEND_SPEC.md) - Backend API specification

---

**Last Updated**: November 12, 2025  
**Implementation Status**: ✅ Complete and tested
