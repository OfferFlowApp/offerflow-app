
// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';
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
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID are set in your .env.local file. " +
        'Firebase services will be non-functional. Some features like authentication will be disabled.'
    );
  }
  // Provide non-functional mocks if config is missing to prevent app crashes
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
} else {
  if (typeof window !== 'undefined') {
    // Log the config being used for debugging purposes
    console.log('[Auth Debug] firebaseConfig used for initialization:', firebaseConfig);
  }
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // if (typeof window !== 'undefined') {
  //     // console.log("Firebase initialized successfully with project:", firebaseConfig.projectId); // Intentionally commented out for cleaner default logs
  // }
}

export { app, auth, db, storage };

