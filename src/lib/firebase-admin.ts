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

// It's crucial to only get the services if the app has been initialized.
// If admin.apps.length is 0, calling admin.auth() or admin.firestore() will throw.
// By checking the length, we ensure we don't try to get services from an uninitialized app.
// If initialization failed, the server will throw a clear error when an API route that
// needs admin services is called, which is better than a silent build failure.
if (admin.apps.length > 0) {
  adminAuth = admin.auth();
  adminDb = admin.firestore();
} else {
  // In a scenario where initialization failed, we create placeholder objects
  // with a warning. This allows the app to build but will show errors at runtime
  // if these services are used, pointing to the initialization issue.
  console.warn('[Firebase Admin] SDK not initialized. Admin services will not be available.');
  adminAuth = {} as admin.auth.Auth;
  adminDb = {} as admin.firestore.Firestore;
}


export { adminAuth, adminDb };
