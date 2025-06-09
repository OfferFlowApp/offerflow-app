
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0 && typeof window !== 'undefined') { // Only run this check client-side or be careful with server components
  console.error(
    `CRITICAL FIREBASE CONFIG ERROR: The following required environment variables are MISSING or UNDEFINED: \n    - ${missingEnvVars.join(
      '\n    - '
    )}`
  );
  // Optionally, throw an error or display a more prominent message to the user
  // For now, we'll let the app try to initialize and potentially fail more gracefully later,
  // but this console error is important.
}

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
    // During build or server-side rendering, if critical vars are missing, it's a problem.
    // In a real app, you might throw here to fail the build if not in a Vercel-like env where env vars are set differently.
    // For now, this specific error is thrown client-side in AuthContext or if Firebase fails to init.
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// Check if all required config values are present for Firebase to initialize
// This is a more direct check after trying to read process.env
const configValues = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
];

if (configValues.some(value => !value) && typeof window !== 'undefined') {
   // This error will be more visible to the user.
   throw new Error(
     `CRITICAL FIREBASE CONFIG ERROR: The following required environment variables are MISSING or UNDEFINED: 
    ${missingEnvVars.join('\n    - ')}

    Please ensure ALL these variables are correctly set in your '.env.local' file, located in the project root directory. 
    You can find these values in your Firebase project settings (Project Settings > General > Your apps > Web app config).
    
    IMPORTANT: After adding or modifying the '.env.local' file, YOU MUST RESTART your Next.js development server for changes to take effect.`
   );
}


export { app, auth };
// export { app, auth, db, storage };
