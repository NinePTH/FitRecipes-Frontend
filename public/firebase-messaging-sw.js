importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// Config is injected at build time from environment variables
firebase.initializeApp(/* FIREBASE_CONFIG_PLACEHOLDER */);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'FitRecipes';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View'
      }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: payload.data?.priority === 'HIGH',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.actionUrl || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
