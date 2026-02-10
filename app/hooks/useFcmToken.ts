// src/hooks/useFcmToken.ts
import { useCallback, useRef } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging, VAPID_KEY } from '../lib/firebase';
import { registerFcmToken, removeFcmToken } from '../routes/notification/api/notification';

export function useFcmToken(getAccessToken: () => string | null) {
  const registered = useRef(false);

  const registerToken = useCallback(async () => {
    if (!messaging || !VAPID_KEY || registered.current) return;
    try {
      if ((await Notification.requestPermission()) !== 'granted') return;
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) return;
      const accessToken = getAccessToken();
      if (!accessToken) return;
      await registerFcmToken(accessToken, token, navigator.userAgent);
      registered.current = true;
    } catch (e) {
      console.error('[FCM] registerToken failed', e);
    }
  }, [getAccessToken]);

  const removeToken = useCallback(async () => {
    if (!messaging || !VAPID_KEY) return;
    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        const accessToken = getAccessToken();
        if (accessToken) await removeFcmToken(accessToken, token);
      }
      registered.current = false;
    } catch (e) {
      console.error('[FCM] removeToken failed', e);
    }
  }, [getAccessToken]);

  return { registerToken, removeToken };
}