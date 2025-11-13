# Security Guidelines

## 🔐 Firebase API Key Security

### Issue
GitHub Secret Scanning detected a publicly exposed Firebase API key in `public/firebase-messaging-sw.js`.

### Solution Implemented

**1. Placeholder-Based Approach**
- The source file (`public/firebase-messaging-sw.js`) now contains a placeholder: `/* FIREBASE_CONFIG_PLACEHOLDER */`
- No actual Firebase credentials are stored in the repository

**2. Build-Time Injection**
- Firebase config is injected during the build process from environment variables
- Script: `scripts/inject-firebase-config.js`
- Build command: `npm run build` automatically runs the injection script

**3. Environment Variables**
All Firebase credentials must be stored in `.env.local` (never committed):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### How It Works

1. **Development**: Service worker uses placeholder, Firebase config loaded from Vite env vars in `src/config/firebase.ts`
2. **Build**: `npm run build` compiles the app and injects Firebase config into `dist/firebase-messaging-sw.js`
3. **Deployment**: Only the `dist/` folder (with injected config) is deployed, never the source files

### Vercel Deployment

Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all `VITE_FIREBASE_*` variables
3. Deploy - Vercel will automatically inject config during build

### Security Best Practices

✅ **DO:**
- Store all secrets in `.env.local` (gitignored)
- Use environment variables in CI/CD pipelines
- Rotate Firebase API keys if exposed
- Use Firebase security rules to restrict API access
- Monitor Firebase usage for anomalies

❌ **DON'T:**
- Commit `.env.local` to git
- Hardcode credentials in source files
- Share API keys in public channels
- Use production keys in development

### Rotating Compromised Keys

If a Firebase API key is exposed:

1. **Generate New Key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new Web API key

2. **Update Environment Variables**:
   - Update `.env.local` locally
   - Update Vercel environment variables
   - Update any CI/CD secrets

3. **Revoke Old Key**:
   - Delete the compromised key from Firebase Console
   - Check Firebase Usage & Billing for unauthorized access

4. **Redeploy**:
   ```bash
   npm run build
   vercel --prod
   ```

### Additional Security Measures

**Firebase Security Rules**:
Restrict API access in Firebase Console:
- Set up App Check to prevent unauthorized access
- Configure domain whitelisting
- Enable security rules for Firestore/Storage

**GitHub Secret Scanning**:
- Enabled by default for public repos
- Alerts on exposed secrets
- Close alerts as "revoked" after rotating keys

**Rate Limiting**:
- Firebase automatically rate limits API requests
- Monitor usage in Firebase Console
- Set up billing alerts for unusual activity

---

**Last Updated**: November 13, 2025
**Status**: ✅ Secured - No hardcoded secrets in repository
