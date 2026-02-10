// src/hooks/useForegroundNotification.ts
import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../lib/firebase';

export function useForegroundNotification(onNewNotification?: () => void) {
  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      if (Notification.permission === 'granted') {
        const notification = new Notification(payload.notification?.title ?? 'RealMatch 알림', {
          body: payload.notification?.body ?? '',
          icon: '/icon-192x192.png',
          payload.data, 
        });

        // 'onclick' 핸들러 설정
        notification.onclick = function (ev: MouseEvent) {
          ev.preventDefault(); // 기본 동작 방지
          const id = payload.data?.notificationId;
          window.location.href = id ? `/notifications/${id}` : '/notifications';
        };
      }
      onNewNotification?.();
    });
    return () => unsubscribe();
  }, [onNewNotification]);
}