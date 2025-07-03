
// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import {getStorage, type FirebaseStorage} from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Log the config being used for debugging purposes, only on client-side
if (typeof window !== 'undefined') {
  console.log('%c[Firebase] Configuration:', 'color: orange; font-weight: bold;', firebaseConfig);
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('%c[Firebase] CRITICAL: Firebase API Key or Project ID is missing from config!', 'color: red; font-weight: bold;');
  }
}


if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  if (typeof window !== 'undefined') {
    console.warn(
      'FIREBASE NOT CONFIGURED: Essential Firebase environment variables are missing. ' +
        "Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, " +
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID are set in your .env.local file or environment. " +
        'Firebase services will be non-functional. Some features like authentication will be disabled.'
    );
  }
  // Provide non-functional mocks if config is missing to prevent app crashes
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
} else {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  auth = getAuth(app);
  storage = getStorage(app);

  // Initialize Firestore with persistence. This replaces the deprecated enableIndexedDbPersistence().
  // We check for `window` to ensure this only runs on the client-side.
  if (typeof window !== 'undefined') {
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    } catch (error: any) {
        console.warn('[Firebase] Could not initialize persistent cache. Some features might not work offline.', error);
        // Fallback to in-memory cache if persistent cache fails.
        db = getFirestore(app);
    }
  } else {
    // For server-side rendering, just get the default instance without persistence.
    db = getFirestore(app);
  }
}

export { app, auth, db, storage };
