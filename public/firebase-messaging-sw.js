importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({ projectId: 'realmatch-2126a' });
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'RealMatch 알림';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data;
  const path = data?.notificationId ? `/notifications/${data.notificationId}` : '/notifications';
  event.waitUntil(clients.openWindow(`${self.location.origin}${path}`));
});