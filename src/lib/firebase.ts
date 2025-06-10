
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4007764419.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2211470066.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2345893357.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3533030798.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3441666344.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:454443529.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:343169924.

// Firebase is currently not configured for this application.
// All Firebase services are non-functional.

// Mock Firebase services
const mockAuth = {
  onAuthStateChanged: (): (() => void) => {
    // Immediately call the callback with null user and set loading to false
    // This simulates the behavior of Firebase when no user is logged in.
    // In a real scenario, the callback provided to onAuthStateChanged would be called.
    // For this mock, we assume the callback is (user) => { setCurrentUser(user); setLoading(false); }
    // So, we effectively do nothing as AuthContext will handle initial state.
    return () => {}; // Return an unsubscribe function
  },
  signOut: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      console.warn("Firebase Auth: signOut called, but Firebase is disabled.");
    }
  },
  createUserWithEmailAndPassword: async (): Promise<{ user: null }> => {
     if (typeof window !== 'undefined') {
      console.warn("Firebase Auth: createUserWithEmailAndPassword called, but Firebase is disabled.");
    }
    return { user: null };
  },
  signInWithEmailAndPassword: async (): Promise<{ user: null }> => {
    if (typeof window !== 'undefined') {
      console.warn("Firebase Auth: signInWithEmailAndPassword called, but Firebase is disabled.");
    }
    return { user: null };
  },
};

const mockDb = {}; 
const mockStorage = {}; 
const mockApp = {}; 

export const app = mockApp;
// Cast to any to satisfy consumers that expect a Firebase Auth object
export const auth = mockAuth as any; 
export const db = mockDb as any;
export const storage = mockStorage as any;

if (typeof window !== 'undefined') {
  console.warn(
    "FIREBASE DISABLED: Firebase is not being initialized. " +
    "Authentication, Firestore, and Storage services will not function. " +
    "Data will be saved locally where applicable. " +
    "To enable Firebase, ensure '.env.local' is correctly configured with your Firebase project credentials and restart the server."
  );
}
