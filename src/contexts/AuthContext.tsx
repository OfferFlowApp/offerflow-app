
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
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Import db
import { doc, setDoc, getDoc, Timestamp, updateDoc, increment } from 'firebase/firestore'; // Import Firestore functions
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import type { UserSubscription, PlanEntitlements, PlanId } from '@/lib/types';
import { getEntitlements, PLANS } from '@/config/plans';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userSubscription: UserSubscription | null;
  currentEntitlements: PlanEntitlements;
  loading: boolean;
  logOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  incrementOfferCountForCurrentUser: () => Promise<boolean>;
  fetchUserSubscription: (userId: string) => Promise<UserSubscription | null>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultFreePlanEntitlements = getEntitlements('free');

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [currentEntitlements, setCurrentEntitlements] = useState<PlanEntitlements>(defaultFreePlanEntitlements);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  const fetchUserSubscription = useCallback(async (userId: string): Promise<UserSubscription | null> => {
    if (!db || !userId) return null;
    const subRef = doc(db, 'users', userId, 'subscription', 'current');
    
    // Retry logic to handle transient "client is offline" errors on initial load
    const getDocWithRetry = async () => {
      try {
        return await getDoc(subRef);
      } catch (error: any) {
        if (error.code === 'unavailable') {
          console.warn("Firestore: Client is offline. Retrying once in 500ms...");
          await new Promise(resolve => setTimeout(resolve, 500));
          return await getDoc(subRef);
        }
        throw error;
      }
    };

    try {
      const subSnap = await getDocWithRetry();
      if (subSnap.exists()) {
        const subData = subSnap.data() as UserSubscription;
        // Check and reset offer period if necessary
        const now = Date.now();
        if (subData.currentPeriodEnd && now > subData.currentPeriodEnd) {
          const newPeriodStart = now;
          const newPeriodEnd = new Date(newPeriodStart).setMonth(new Date(newPeriodStart).getMonth() + 1);
          const updatedSub = {
            ...subData,
            offersCreatedThisPeriod: 0,
            currentPeriodStart: newPeriodStart,
            currentPeriodEnd: newPeriodEnd,
          };
          await setDoc(subRef, updatedSub, { merge: true });
          return updatedSub;
        }
        return subData;
      } else {
        // No subscription found, create a default free one
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const freeSub: UserSubscription = {
          planId: 'free',
          status: 'active',
          offersCreatedThisPeriod: 0,
          currentPeriodStart: Date.now(),
          currentPeriodEnd: thirtyDaysFromNow.getTime(),
        };
        await setDoc(subRef, freeSub);
        return freeSub;
      }
    } catch (error) {
      console.error("Error fetching/creating user subscription:", error);
      toast({ title: t({en: "Subscription Error", el: "Σφάλμα Συνδρομής"}), description: t({en: "Could not load subscription details.", el: "Δεν ήταν δυνατή η φόρτωση."}), variant: "destructive" });
      return null;
    }
  }, [t, toast]);
  
  const refreshSubscription = useCallback(async () => {
    if (currentUser) {
      setLoading(true);
      const sub = await fetchUserSubscription(currentUser.uid);
      setUserSubscription(sub);
      setCurrentEntitlements(getEntitlements(sub?.planId));
      setLoading(false);
    }
  }, [currentUser, fetchUserSubscription]);


  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setCurrentUser(null);
      setUserSubscription(null);
      setCurrentEntitlements(defaultFreePlanEntitlements);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setCurrentUser(user);
      if (user) {
        const sub = await fetchUserSubscription(user.uid);
        setUserSubscription(sub);
        setCurrentEntitlements(getEntitlements(sub?.planId));
      } else {
        setUserSubscription(null);
        setCurrentEntitlements(defaultFreePlanEntitlements);
      }
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchUserSubscription]);


  const createInitialSubscription = async (userId: string): Promise<UserSubscription> => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const freeSub: UserSubscription = {
      planId: 'free',
      status: 'active',
      offersCreatedThisPeriod: 0,
      currentPeriodStart: Date.now(),
      currentPeriodEnd: thirtyDaysFromNow.getTime(),
    };
    const subRef = doc(db, 'users', userId, 'subscription', 'current');
    await setDoc(subRef, freeSub);
    return freeSub;
  };

  const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    if (!auth || typeof createUserWithEmailAndPassword !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Account creation is currently unavailable.", el: "Η δημιουργία λογαριασμού δεν είναι διαθέσιμη."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createInitialSubscription(userCredential.user.uid); // Create free sub on sign up
      toast({ title: t({en: "Account Created", el: "Ο λογαριασμός δημιουργήθηκε"}), description: t({en: "Successfully signed up!", el: "Επιτυχής εγγραφή!"}) });
      router.push('/'); 
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: t({en: "Sign Up Failed", el: "Η Εγγραφή Απέτυχε"}), description: error.message || t({en: "Could not create account.", el: "Δεν ήταν δυνατή η δημιουργία."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    if (!auth || typeof signInWithEmailAndPassword !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Login is currently unavailable.", el: "Η σύνδεση δεν είναι διαθέσιμη."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Subscription will be fetched by onAuthStateChanged effect
      toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in!", el: "Επιτυχής σύνδεση!"}) });
      router.push('/');
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ title: t({en: "Sign In Failed", el: "Η Σύνδεση Απέτυχε"}), description: error.message || t({en: "Could not sign in.", el: "Δεν ήταν δυνατή η σύνδεση."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth || typeof signInWithPopup !== 'function' || typeof GoogleAuthProvider !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Google Sign-In is unavailable.", el: "Η σύνδεση με Google δεν είναι διαθέσιμη."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const subRef = doc(db, 'users', result.user.uid, 'subscription', 'current');
      const subSnap = await getDoc(subRef);
      if (!subSnap.exists()) {
        await createInitialSubscription(result.user.uid); // Create free sub if new Google user
      }
      // Subscription will be fetched/updated by onAuthStateChanged effect
      toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in with Google!", el: "Επιτυχής σύνδεση με Google!"}) });
      router.push('/');
      return result.user;
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
       if (error.code === 'auth/unauthorized-domain' && typeof window !== 'undefined') {
         console.error(`[AuthContext] Google Sign-In failed for domain: ${window.location.hostname}. Please ensure this domain is authorized in your Firebase project settings (Authentication -> Sign-in method -> Authorized domains) AND in your Google Cloud Console OAuth consent screen & client ID credentials.`);
       }
      toast({ title: t({en: "Google Sign-In Failed", el: "Η Σύνδεση με Google Απέτυχε"}), description: error.message || t({en: "Could not sign in with Google.", el: "Δεν ήταν δυνατή η σύνδεση."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    if (!auth || typeof signOut !== 'function') {
      setCurrentUser(null);
      setUserSubscription(null);
      setCurrentEntitlements(defaultFreePlanEntitlements);
      setLoading(false); 
      router.push('/login'); 
      return;
    }
    try {
      await signOut(auth);
      toast({ title: t({en: "Signed Out", el: "Αποσυνδεθήκατε"}), description: t({en: "Successfully signed out.", el: "Επιτυχής αποσύνδεση."})});
      // State will be cleared by onAuthStateChanged
      router.push('/login'); 
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: t({en: "Sign Out Failed", el: "Η Αποσύνδεση Απέτυχε"}), description: error.message || t({en: "Could not sign out.", el: "Δεν ήταν δυνατή η αποσύνδεση."}), variant: "destructive" });
    }
  };
  
  const incrementOfferCountForCurrentUser = async (): Promise<boolean> => {
    if (!currentUser || !userSubscription) {
      toast({ title: t({en:"Action Failed", el: "Η ενέργεια απέτυχε"}), description: t({en: "User or subscription not found.", el:"Ο χρήστης ή η συνδρομή δεν βρέθηκε."}), variant: "destructive" });
      return false;
    }

    const subRef = doc(db, 'users', currentUser.uid, 'subscription', 'current');
    try {
      await updateDoc(subRef, {
        offersCreatedThisPeriod: increment(1)
      });
      // Optimistically update local state or refetch
      setUserSubscription(prev => prev ? ({ ...prev, offersCreatedThisPeriod: (prev.offersCreatedThisPeriod || 0) + 1 }) : null);
      return true;
    } catch (error) {
      console.error("Error incrementing offer count:", error);
      toast({ title: t({en:"Update Failed", el: "Η ενημέρωση απέτυχε"}), description: t({en: "Could not update offer count.", el:"Δεν ήταν δυνατή η ενημέρωση."}), variant: "destructive" });
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
