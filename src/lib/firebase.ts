
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Will be used later for storing user settings

// CRITICAL INSTRUCTIONS FOR FIREBASE SETUP:
// 1. '.env.local' FILE:
//    - This file MUST be in the ROOT directory of your project (same level as package.json).
//    - It MUST contain your Firebase project's configuration variables.
//
// 2. ENVIRONMENT VARIABLES (Copy from your Firebase Project Settings > General > Your apps > Web app config):
//    NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_messaging_sender_id
//    NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
//    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id (Optional)
//
// 3. RESTART SERVER:
//    - AFTER CREATING OR MODIFYING the '.env.local' file, you MUST RESTART your Next.js development server.
//      Next.js only loads these variables on startup.
//
// TROUBLESHOOTING 'auth/invalid-api-key' ERROR:
//   - If you see "Firebase: Error (auth/invalid-api-key)" after the checks below, it means:
//     a) The VALUES in your .env.local (especially NEXT_PUBLIC_FIREBASE_API_KEY) are WRONG for your Firebase project.
//     b) Or, you haven't RESTARTED the Next.js server after correcting .env.local.

const requiredEnvVars: string[] = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `CRITICAL FIREBASE CONFIG ERROR: The following required environment variables are MISSING or UNDEFINED: 
    ${missingEnvVars.join('\n    - ')}

    Please ensure ALL these variables are correctly set in your '.env.local' file, located in the project root directory. 
    You can find these values in your Firebase project settings (Project Settings > General > Your apps > Web app config).
    
    IMPORTANT: After adding or modifying the '.env.local' file, YOU MUST RESTART your Next.js development server for changes to take effect.`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// If the error "auth/invalid-api-key" occurs below this point, it means:
// 1. The environment variables were LOADED (the check above passed).
// 2. BUT, the VALUES of those variables (especially apiKey) are INCORRECT or NOT AUTHORIZED by Firebase.
// 3. OR, you have not RESTARTED your Next.js server after correcting the .env.local file.
// Please double-check your .env.local values against your Firebase project console and restart the server.
const auth = getAuth(app);
// const db = getFirestore(app); // Will be uncommented and used when we store user settings

export { app, auth /*, db */ };
