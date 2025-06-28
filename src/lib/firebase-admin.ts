import admin from 'firebase-admin';

// To deploy to App Hosting, you can use `applicationDefault()`
// To test locally, you will need to set up a service account and point
// to the credentials file via the GOOGLE_APPLICATION_CREDENTIALS env var.
// https://firebase.google.com/docs/admin/setup#initialize-sdk

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('[Firebase Admin] Initialized successfully.');
  } catch (error: any) {
    console.error(
        '[Firebase Admin] Initialization failed. ',
        'This can happen if you are running locally without the GOOGLE_APPLICATION_CREDENTIALS environment variable set.',
        `Error: ${error.message}`
    );
  }
}

let adminAuth: admin.auth.Auth;
let adminDb: admin.firestore.Firestore;

try {
    adminAuth = admin.auth();
    adminDb = admin.firestore();
} catch (error) {
    console.error("[Firebase Admin] Failed to get auth or firestore service. The app will not function correctly.");
    // Provide non-functional mocks if admin SDK failed to initialize
    adminAuth = {} as admin.auth.Auth;
    adminDb = {} as admin.firestore.Firestore;
}


export { adminAuth, adminDb };
