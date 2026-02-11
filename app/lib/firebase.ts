// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app'; 
import { getMessaging } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging'; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const messaging: Messaging | null =
  typeof window !== 'undefined' ? getMessaging(app) : null;
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;