
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  logOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      if (typeof window !== 'undefined') {
        // console.warn("AuthContext: Firebase Auth service appears unconfigured. User authentication will not function.");
      }
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);


  const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    if (!auth || typeof auth.createUserWithEmailAndPassword !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Account creation is currently unavailable.", el: "Η δημιουργία λογαριασμού δεν είναι διαθέσιμη προς το παρόν."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: t({en: "Account Created", el: "Ο λογαριασμός δημιουργήθηκε"}), description: t({en: "Successfully signed up!", el: "Επιτυχής εγγραφή!"}) });
      router.push('/'); 
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: t({en: "Sign Up Failed", el: "Η Εγγραφή Απέτυχε"}), description: error.message || t({en: "Could not create account.", el: "Δεν ήταν δυνατή η δημιουργία λογαριασμού."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Login is currently unavailable.", el: "Η σύνδεση δεν είναι διαθέσιμη προς το παρόν."}), variant: "destructive" });
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
      toast({ title: t({en: "Sign In Failed", el: "Η Σύνδεση Απέτυχε"}), description: error.message || t({en: "Could not sign in. Please check your credentials.", el: "Δεν ήταν δυνατή η σύνδεση. Παρακαλώ ελέγξτε τα στοιχεία σας."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth || typeof auth.signInWithPopup !== 'function') {
      toast({ title: t({en: "Service Unavailable", el: "Η υπηρεσία δεν είναι διαθέσιμη"}), description: t({en: "Google Sign-In is currently unavailable.", el: "Η σύνδεση με Google δεν είναι διαθέσιμη προς το παρόν."}), variant: "destructive" });
      return null;
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast({ title: t({en: "Signed In", el: "Συνδεθήκατε"}), description: t({en: "Successfully signed in with Google!", el: "Επιτυχής σύνδεση με Google!"}) });
      router.push('/');
      return result.user;
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({ title: t({en: "Google Sign-In Failed", el: "Η Σύνδεση με Google Απέτυχε"}), description: error.message || t({en: "Could not sign in with Google.", el: "Δεν ήταν δυνατή η σύνδεση με Google."}), variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    if (!auth || typeof auth.signOut !== 'function') {
      setCurrentUser(null);
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

  const value = {
    currentUser,
    loading,
    logOut,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
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

