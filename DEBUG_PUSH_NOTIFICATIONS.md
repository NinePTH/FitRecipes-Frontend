# Debug Guide: Push Notifications Not Appearing

## ⚠️ IMPORTANT: Chrome Policy

**Chrome requires notification permission requests to be triggered by a user gesture (click, tap, etc.).**

Automatic requests (like on page load or after login) will be blocked with a violation warning:
```
[Violation] Only request notification permission in response to a user gesture.
```

**Solution**: Users MUST click the manual "Request Push Permission Now" button on the `/notification-settings` page.

## Quick Fix Steps

### 1. Use the Manual Button (REQUIRED for Chrome)

1. Navigate to **`/notification-settings`** page
2. Click the **"Request Push Permission Now"** button in the yellow debug box
3. Browser will show permission popup
4. Click "Allow"

This is the ONLY way to properly request notification permission in Chrome due to their user gesture policy.

### 2. Clear localStorage flag (if already denied)
Open browser console (F12) and run:
```javascript
localStorage.removeItem('fcm_permission_asked');
console.log('✅ Cleared push permission flag');
```

### 2. Check current notification permission
```javascript
console.log('Current permission:', Notification.permission);
// Should be: "default" (not asked), "granted" (allowed), or "denied" (blocked)
```

### 3. Reset browser permission (if denied)
If permission is "denied":
- **Chrome**: Settings > Privacy and security > Site Settings > Notifications > Find your site > Reset
- **Firefox**: Settings > Privacy & Security > Permissions > Notifications > Settings > Remove your site
- **Safari**: Safari > Settings > Websites > Notifications > Remove your site

### 4. Use the manual test button
1. Navigate to `/notification-settings` page
2. You'll see a yellow debug box at the top
3. Click "Request Push Permission Now" button
4. Check browser console for detailed logs

### 5. Check browser console logs
After the changes, you should see detailed logs like:
```
🔥 Initializing Firebase...
Firebase config check:
- API Key: ✅ Set
- Auth Domain: ✅ Set
...
🔔 Checking push notification status...
Current permission: default
🔔 Will request push permission in 3 seconds...
🔔 Requesting push permission...
✅ Push permission granted
```

## Common Issues

### Issue 1: Permission already asked
**Symptom**: No permission popup appears
**Cause**: `localStorage.getItem('fcm_permission_asked')` returns `'true'`
**Fix**: Clear localStorage flag (see step 1)

### Issue 2: Permission denied
**Symptom**: Permission is "denied" in console
**Cause**: User previously blocked notifications
**Fix**: Reset browser permission (see step 3)

### Issue 3: Service Worker not registered
**Symptom**: Firebase messaging not initialized
**Cause**: Service worker file not accessible or not registered
**Fix**: 
```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered service workers:', registrations.length);
  registrations.forEach(reg => console.log(reg.scope));
});
```

### Issue 4: Firebase config missing
**Symptom**: "Firebase messaging not initialized"
**Cause**: Missing or incorrect Firebase environment variables
**Fix**: Check `.env.local` has all required values:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_VAPID_KEY

### Issue 5: HTTPS required
**Symptom**: Service worker fails to register
**Cause**: Push notifications require HTTPS (except localhost)
**Fix**: 
- Local development: Use `http://localhost:5173` ✅
- Production: Ensure HTTPS is enabled ✅

## Testing Checklist

- [ ] Clear localStorage flag
- [ ] Check Notification.permission is "default"
- [ ] Refresh page and wait 3 seconds after login
- [ ] Should see permission popup
- [ ] If no popup, click manual test button on `/notification-settings`
- [ ] Check browser console for detailed logs
- [ ] Verify Firebase config is complete
- [ ] Check service worker is registered

## Expected Behavior

1. **On Login** (after 3 seconds):
   - If permission is "default" and not asked before → Show permission popup
   - If permission is "granted" → Log "already granted", no popup
   - If permission is "denied" → Log "denied by user", no popup

2. **After Granting Permission**:
   - FCM token is obtained
   - Token is registered with backend
   - `fcm_permission_asked` set to 'true' in localStorage
   - Bell icon should work normally

3. **Console Logs**:
   - Detailed logs with emojis (🔔, ✅, ❌)
   - Clear error messages if something fails
   - Firebase config validation on startup

## Manual Testing Commands

```javascript
// 1. Reset everything
localStorage.removeItem('fcm_permission_asked');
location.reload();

// 2. Check Firebase is initialized
console.log('Firebase app initialized:', !!firebase?.app());

// 3. Manually trigger permission request
import { requestPushPermission } from '@/services/pushNotifications';
requestPushPermission().then(token => console.log('Token:', token));

// 4. Check service worker
navigator.serviceWorker.ready.then(reg => {
  console.log('Service worker ready:', reg);
});
```

## Changes Made

### 1. Enhanced Logging in App.tsx
- Shows current permission status
- Shows whether we've asked before
- Shows countdown and request status
- Clear success/failure messages

### 2. Enhanced Logging in pushNotifications.ts
- Step-by-step console logs
- Check for Notification API support
- Check for Firebase messaging initialization
- VAPID key validation
- FCM token generation status
- Backend registration status

### 3. Enhanced Logging in firebase.ts
- Firebase config validation (shows which values are missing)
- Firebase app initialization status
- Service Worker availability check
- Firebase messaging initialization status

### 4. Added Manual Test Button
- Yellow debug box on `/notification-settings` page
- Shows current permission status
- Manual trigger button
- Real-time testing with alerts

## Next Steps

1. **Try the quick fix**: Clear localStorage flag and refresh
2. **Use manual button**: Go to `/notification-settings` and click the test button
3. **Check console logs**: Should see detailed logs with emojis
4. **If still failing**: Share the console logs to diagnose the issue

The system now has comprehensive logging and a manual test button to help debug the issue!
