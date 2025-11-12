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
    console.log('🔔 Starting push permission request...');
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('❌ This browser does not support notifications');
      return null;
    }

    console.log('✅ Notifications API available');

    // Check if messaging is initialized
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized');
      console.log('Check if service worker is registered and Firebase config is correct');
      return null;
    }

    console.log('✅ Firebase messaging initialized');

    // Check current permission status
    console.log('Current permission status:', Notification.permission);

    // Request permission
    console.log('🔔 Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);

    if (permission !== 'granted') {
      console.log('❌ Notification permission denied by user');
      return null;
    }

    console.log('✅ Notification permission granted');

    // Get VAPID key from environment
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ VAPID key not configured in environment');
      return null;
    }

    console.log('✅ VAPID key found:', vapidKey.substring(0, 20) + '...');

    // Get FCM token
    console.log('🔔 Getting FCM token...');
    const fcmToken = await getToken(messaging, {
      vapidKey,
    });

    if (!fcmToken) {
      console.error('❌ Failed to get FCM token');
      return null;
    }

    console.log('✅ FCM token obtained:', fcmToken.substring(0, 20) + '...');

    // Register token with backend
    console.log('🔔 Registering token with backend...');
    await notificationApi.registerFcmToken(fcmToken, getBrowserName(), getPlatform());
    console.log('✅ Token registered with backend successfully');

    return fcmToken;
  } catch (error) {
    console.error('❌ Error requesting push permission:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

export async function unregisterPush(): Promise<void> {
  try {
    console.log('🔔 Starting push token unregistration...');
    
    if (!messaging) {
      console.warn('⚠️ Firebase messaging not initialized, skipping unregister');
      return;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('⚠️ VAPID key not configured, skipping unregister');
      return;
    }

    console.log('🔔 Getting current FCM token...');
    const fcmToken = await getToken(messaging, { vapidKey });
    
    if (fcmToken) {
      console.log('✅ FCM token found:', fcmToken.substring(0, 20) + '...');
      console.log('🔔 Unregistering token with backend...');
      await notificationApi.unregisterFcmToken(fcmToken);
      console.log('✅ Push token unregistered successfully');
    } else {
      console.log('ℹ️ No FCM token found to unregister');
    }
  } catch (error) {
    console.error('❌ Error unregistering push:', error);
    throw error; // Re-throw so caller can handle it
  }
}
