
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

// Entitlements for a user who is logged in but has no active subscription.
const defaultNoPlanEntitlements = getEntitlements('none');

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [currentEntitlements, setCurrentEntitlements] = useState<PlanEntitlements>(defaultNoPlanEntitlements);
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
          // Don't toast here as it can be annoying on intermittent connection issues
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
      setCurrentEntitlements(getEntitlements(sub?.planId));
      setLoading(false);
    }
  }, [currentUser, fetchUserSubscription]);


  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setCurrentUser(null);
      setUserSubscription(null);
      setCurrentEntitlements(defaultNoPlanEntitlements);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setLoading(true);
      setCurrentUser(user);
      if (user) {
        const sub = await fetchUserSubscription(user.uid);
        setUserSubscription(sub);
        setCurrentEntitlements(getEntitlements(sub?.planId));
      } else {
        setUserSubscription(null);
        setCurrentEntitlements(defaultNoPlanEntitlements);
      }
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchUserSubscription]);

  const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    if (!auth || typeof createUserWithEmailAndPassword !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Account creation is currently unavailable.", el: "Η δημιουργία λογαριασμού δεν είναι διαθέσιμη."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Automatically create a 30-day trial subscription for the 'pro-monthly' plan on signup
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      
      const newTrialSubscription: UserSubscription = {
        planId: 'pro-monthly', // Trial is for the Pro Monthly plan
        status: 'trialing',
        currentPeriodStart: Date.now(),
        currentPeriodEnd: trialEndDate.getTime(),
        offersCreatedThisPeriod: 0,
      };

      const userSubRef = doc(db, 'users', userCredential.user.uid, 'subscription', 'current');
      await setDoc(userSubRef, newTrialSubscription);
      
      toast({ title: t({en: "Account Created", el: "Ο λογαριασμός δημιουργήθηκε"}), description: t({en: "Welcome! Your 30-day free trial has started.", el: "Καλώς ήρθατε! Η δωρεάν δοκιμή 30 ημερών ξεκίνησε."}) });
      router.push('/'); // Go to homepage after signup, they can see trial status there/on pricing page
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
      
      // Check if user is new. If so, create a trial subscription.
      const subRef = doc(db, 'users', result.user.uid, 'subscription', 'current');
      const subSnap = await getDoc(subRef);
      
      if (!subSnap.exists()) {
        // This is a new user, create a trial for them.
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30);
      
        const newTrialSubscription: UserSubscription = {
          planId: 'pro-monthly',
          status: 'trialing',
          currentPeriodStart: Date.now(),
          currentPeriodEnd: trialEndDate.getTime(),
          offersCreatedThisPeriod: 0,
        };
        await setDoc(subRef, newTrialSubscription);
        toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Welcome! Your 30-day free trial has started.", el: "Καλώς ήρθατε! Η δωρεάν δοκιμή 30 ημερών ξεκίνησε."}) });
      } else {
         toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in with Google!", el: "Επιτυχής σύνδεση με Google!"}) });
      }
      
      router.push('/'); // Always go to homepage after google sign in now
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
      setCurrentEntitlements(defaultNoPlanEntitlements);
      setLoading(false); 
      router.push('/login'); 
      return;
    }
    try {
      await signOut(auth);
      toast({ title: t({en: "Signed Out", el: "Αποσυνδεθήκατε"}), description: t({en: "Successfully signed out.", el: "Επιτυχής αποσύνδεση."})});
      router.push('/login'); 
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: t({en: "Sign Out Failed", el: "Η Αποσύνδεση Απέτυχε"}), description: error.message || t({en: "Could not sign out.", el: "Δεν ήταν δυνατή η αποσύνδεση."}), variant: "destructive" });
    }
  };
  
  const incrementOfferCountForCurrentUser = async (): Promise<boolean> => {
    if (!currentUser || !userSubscription) {
        // This case might be fine for non-subscribed users hitting their limit of 1
        if (currentUser && !userSubscription) {
             const subRef = doc(db, 'users', currentUser.uid, 'offers', 'count');
             // This part is tricky without a subscription doc.
             // For simplicity, we'll assume the check happens client-side based on entitlements.
             // If we really need to track usage for non-subscribed users, a different structure is needed.
             // Let's rely on client-side check for now.
             console.log("Incrementing offer for non-subscribed user (not implemented server-side).");
             return true;
        }
      return false;
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
