import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

// Read the service worker template
const swPath = join(__dirname, '../dist/firebase-messaging-sw.js');
let swContent = readFileSync(swPath, 'utf-8');

// Get Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

// Replace placeholders with actual values
swContent = swContent.replace(
  '/* FIREBASE_CONFIG_PLACEHOLDER */',
  JSON.stringify(firebaseConfig, null, 2)
);

// Write back to the file
writeFileSync(swPath, swContent, 'utf-8');

console.log('✅ Firebase config injected into service worker');

