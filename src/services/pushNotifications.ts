import { getToken, messaging } from '@/config/firebase';
import { notificationApi } from './notificationApi';

function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

function getPlatform(): string {
  return navigator.platform;
}

export async function requestPushPermission(): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('❌ This browser does not support notifications');
      return null;
    }

    // Check if messaging is initialized
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    // Get VAPID key from environment
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ VAPID key not configured in environment');
      return null;
    }

    // Get FCM token
    const fcmToken = await getToken(messaging, {
      vapidKey,
    });

    if (!fcmToken) {
      console.error('❌ Failed to get FCM token');
      return null;
    }

    // Register token with backend
    await notificationApi.registerFcmToken(fcmToken, getBrowserName(), getPlatform());

    return fcmToken;
  } catch (error) {
    console.error('❌ Error requesting push permission:', error);
    return null;
  }
}

export async function unregisterPush(): Promise<void> {
  try {
    if (!messaging) {
      console.warn('⚠️ Firebase messaging not initialized, skipping unregister');
      return;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('⚠️ VAPID key not configured, skipping unregister');
      return;
    }

    const fcmToken = await getToken(messaging, { vapidKey });

    if (fcmToken) {
      await notificationApi.unregisterFcmToken(fcmToken);
    }
  } catch (error) {
    console.error('❌ Error unregistering push:', error);
    throw error; // Re-throw so caller can handle it
  }
}
