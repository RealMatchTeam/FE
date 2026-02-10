// api/notification.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchNotifications(accessToken: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/notifications?filter=ALL&page=0&size=20`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch notifications');

  const data = await res.json();
  return data;
}

export async function registerFcmToken(
  accessToken: string,
  token: string,
  deviceInfo?: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/fcm/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ token, deviceInfo: deviceInfo ?? navigator.userAgent }),
  });
  if (!res.ok) throw new Error('FCM token registration failed');
}

export async function removeFcmToken(accessToken: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/fcm/tokens`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error('FCM token removal failed');
}