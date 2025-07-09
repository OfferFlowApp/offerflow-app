
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Import db
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'; // Import Firestore functions
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import type { UserSubscription, PlanEntitlements, PlanId } from '@/lib/types';
import { getEntitlements } from '@/config/plans';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userSubscription: UserSubscription | null;
  currentEntitlements: PlanEntitlements;
  loading: boolean;
  logOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signInWithEmail: (email: string, password: string, redirectPath?: string) => Promise<string | null>;
  signInWithGoogle: (redirectPath?: string) => Promise<string | null>;
  incrementOfferCountForCurrentUser: () => Promise<boolean>;
  fetchUserSubscription: (userId: string) => Promise<UserSubscription | null>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Entitlements for a user who is logged out or has no plan.
const loggedOutEntitlements = getEntitlements('none');
// Set max offers to 0 for logged out users to force signup/login.
loggedOutEntitlements.maxOfferSheetsPerMonth = 0;


const getFriendlyAuthErrorMessage = (errorCode: string, t: (translations: { [key in 'en' | 'el']?: string }) => string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return t({en: "This email address is already in use by another account.", el: "Αυτή η διεύθυνση email χρησιμοποιείται ήδη από άλλον λογαριασμό."});
    case 'auth/invalid-email':
      return t({en: "The email address is not valid.", el: "Η διεύθυνση email δεν είναι έγκυρη."});
    case 'auth/operation-not-allowed':
      return t({en: "Email/password accounts are not enabled.", el: "Οι λογαριασμοί email/κωδικού δεν είναι ενεργοποιημένοι."});
    case 'auth/weak-password':
      return t({en: "The password is too weak.", el: "Ο κωδικός πρόσβασης είναι πολύ αδύναμος."});
    case 'auth/user-disabled':
        return t({en: "This user account has been disabled.", el: "Αυτός ο λογαριασμός χρήστη έχει απενεργοποιηθεί."});
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
        return t({en: "Invalid email or password.", el: "Μη έγκυρο email ή κωδικός πρόσβασης."});
    case 'auth/popup-closed-by-user':
        return t({en: "The sign-in window was closed. Please try again.", el: "Το παράθυρο σύνδεσης έκλεισε. Παρακαλώ προσπαθήστε ξανά."})
    default:
      return t({en: "An unexpected error occurred. Please try again.", el: "Παρουσιάστηκε ένα μη αναμενόμενο σφάλμα. Παρακαλώ προσπαθήστε ξανά."});
  }
};


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [currentEntitlements, setCurrentEntitlements] = useState<PlanEntitlements>(loggedOutEntitlements);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  const fetchUserSubscription = useCallback(async (userId: string): Promise<UserSubscription | null> => {
    if (!db || !userId) return null;
    const subRef = doc(db, 'users', userId, 'subscription', 'current');
    
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const subSnap = await getDoc(subRef);
        
        if (subSnap.exists()) {
          const subData = subSnap.data() as UserSubscription;
          return subData;
        } else {
          // No subscription document found for the user.
          return null;
        }
      } catch (error: any) {
        if (error.code === 'unavailable' && attempt < maxRetries) {
          console.warn(`Firestore: Client is offline. Retrying... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.error("Error fetching user subscription:", error);
          return null;
        }
      }
    }
    return null;
  }, []);
  
  const refreshSubscription = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      const sub = await fetchUserSubscription(currentUser.uid);
      setUserSubscription(sub);

      if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
        setCurrentEntitlements(getEntitlements(sub.planId));
      } else {
        // A logged in user with no plan gets 'none' entitlements, allowing 1 offer.
        setCurrentEntitlements(getEntitlements('none'));
      }
      setLoading(false);
    }
  }, [currentUser, fetchUserSubscription]);


  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setCurrentUser(null);
      setUserSubscription(null);
      setCurrentEntitlements(loggedOutEntitlements);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        const sub = await fetchUserSubscription(user.uid);
        setUserSubscription(sub);
        if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
          setCurrentEntitlements(getEntitlements(sub.planId));
        } else {
          setCurrentEntitlements(getEntitlements('none'));
        }
      } else {
        setUserSubscription(null);
        setCurrentEntitlements(loggedOutEntitlements);
      }
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchUserSubscription]);

  const signUpWithEmail = async (email: string, password: string): Promise<string | null> => {
    if (!auth || typeof createUserWithEmailAndPassword !== 'function') {
      const errorMsg = t({en: "Account creation is currently unavailable.", el: "Η δημιουργία λογαριασμού δεν είναι διαθέσιμη."});
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    }
    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: t({en: "Account Created!", el: "Ο λογαριασμός δημιουργήθηκε!"}), description: t({en: "Welcome! You have a 30-day free Pro trial.", el: "Καλώς ήρθατε! Έχετε 30 ημέρες δωρεάν δοκιμή Pro."}) });
      router.push('/dashboard');
      return null; // No error
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMsg = getFriendlyAuthErrorMessage(error.code, t);
      toast({ title: t({en: "Sign Up Failed", el: "Η Εγγραφή Απέτυχε"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, redirectPath: string = '/dashboard'): Promise<string | null> => {
    if (!auth || typeof signInWithEmailAndPassword !== 'function') {
      const errorMsg = t({en: "Login is currently unavailable.", el: "Η σύνδεση δεν είναι διαθέσιμη."});
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    }
    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in!", el: "Επιτυχής σύνδεση!"}) });
      router.push(redirectPath);
      return null; // No error
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMsg = getFriendlyAuthErrorMessage(error.code, t);
      toast({ title: t({en: "Sign In Failed", el: "Η Σύνδεση Απέτυχε"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (redirectPath: string = '/dashboard'): Promise<string | null> => {
    if (!auth || typeof signInWithPopup !== 'function' || typeof GoogleAuthProvider !== 'function') {
      const errorMsg = t({en: "Google Sign-In is unavailable.", el: "Η σύνδεση με Google δεν είναι διαθέσιμη."});
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithPopup(auth, provider);
      toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in with Google!", el: "Επιτυχής σύνδεση με Google!"}) });
      router.push(redirectPath);
      return null; // No error
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
       if (error.code === 'auth/unauthorized-domain' && typeof window !== 'undefined') {
         console.error(`[AuthContext] Google Sign-In failed for domain: ${window.location.hostname}. Please ensure this domain is authorized in your Firebase project settings (Authentication -> Sign-in method -> Authorized domains) AND in your Google Cloud Console OAuth consent screen & client ID credentials.`);
       }
      const errorMsg = getFriendlyAuthErrorMessage(error.code, t);
      toast({ title: t({en: "Google Sign-In Failed", el: "Η Σύνδεση με Google Απέτυχε"}), description: errorMsg, variant: "destructive" });
      return errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    if (!auth || typeof signOut !== 'function') {
      setCurrentUser(null);
      setUserSubscription(null);
      setCurrentEntitlements(loggedOutEntitlements);
      setLoading(false); 
      router.push('/'); 
      return;
    }
    try {
      await signOut(auth);
      toast({ title: t({en: "Signed Out", el: "Αποσυνδεθήκατε"}), description: t({en: "Successfully signed out.", el: "Επιτυχής αποσύνδεση."})});
      router.push('/'); 
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: t({en: "Sign Out Failed", el: "Η Αποσύνδεση Απέτυχε"}), description: getFriendlyAuthErrorMessage(error.code, t), variant: "destructive" });
    }
  };
  
  const incrementOfferCountForCurrentUser = async (): Promise<boolean> => {
    if (!currentUser) return false;

    if (!userSubscription) {
        console.log("No subscription document found to increment offer count for.");
        return true; 
    }

    const subRef = doc(db, 'users', currentUser.uid, 'subscription', 'current');
    try {
      await updateDoc(subRef, {
        offersCreatedThisPeriod: increment(1)
      });
      setUserSubscription(prev => prev ? ({ ...prev, offersCreatedThisPeriod: (prev.offersCreatedThisPeriod || 0) + 1 }) : null);
      return true;
    } catch (error) {
      console.error("Error incrementing offer count:", error);
      toast({ title: t({en:"Update Failed", el: "Η ενημέρωση απέτυχε"}), description: t({en: "Could not update your usage count.", el:"Δεν ήταν δυνατή η ενημέρωση του μετρητή χρήσης."}), variant: "destructive" });
      return false;
    }
  };

  const value = {
    currentUser,
    userSubscription,
    currentEntitlements,
    loading,
    logOut,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    incrementOfferCountForCurrentUser,
    fetchUserSubscription,
    refreshSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
