import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

let app: FirebaseApp;

if (!getApps().length) {
  try {
    app = initializeApp();
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
    }
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);

export { db };
