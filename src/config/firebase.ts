import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let messaging: Messaging | null = null;

try {
  console.log('🔥 Initializing Firebase...');
  console.log('Firebase config check:');
  console.log('- API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.log('- Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
  console.log('- Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
  console.log('- Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing');
  console.log('- App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing');

  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Only initialize messaging if in browser and service worker is supported
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    console.log('✅ Service Worker API available');
    messaging = getMessaging(app);
    console.log('✅ Firebase messaging initialized');
  } else {
    console.warn('⚠️ Service Worker not supported in this environment');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error);
  if (error instanceof Error) {
    console.error('Error details:', error.message);
  }
}

export { messaging, getToken, onMessage };
