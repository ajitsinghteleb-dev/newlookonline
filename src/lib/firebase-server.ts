import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This function initializes the Firebase Admin SDK.
// In a Firebase App Hosting environment, initializeApp() can be called without arguments,
// as it automatically discovers the necessary credentials.
if (!getApps().length) {
  initializeApp();
}

const adminDb = getFirestore();

/**
 * Returns the initialized Firestore Admin SDK client.
 * This is for server-side use only.
 */
export function getFirestoreAdmin() {
    return adminDb;
}
