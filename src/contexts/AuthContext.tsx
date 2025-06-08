
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';


interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  logOut: () => Promise<void>;
  // Placeholder for signUp and logIn, to be implemented later
  // signUpWithEmail: (email: string, password: string) => Promise<any>; 
  // signInWithEmail: (email: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization(); // For localized toasts

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const logOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: t({en: 'Logged Out', el: 'Αποσυνδεθήκατε'}), description: t({en: 'You have been successfully logged out.', el: 'Έχετε αποσυνδεθεί επιτυχώς.'}) });
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout Error:', error);
      toast({ title: t({en: 'Logout Failed', el: 'Η Αποσύνδεση Απέτυχε'}), description: t({en: 'Could not log you out. Please try again.', el: 'Δεν ήταν δυνατή η αποσύνδεσή σας. Παρακαλώ προσπαθήστε ξανά.'}), variant: 'destructive' });
    }
  };

  // Placeholder functions for signUp and logIn
  // const signUpWithEmail = async (email, password) => { /* Firebase signUp logic */ };
  // const signInWithEmail = async (email, password) => { /* Firebase signIn logic */ };

  const value = {
    currentUser,
    loading,
    logOut,
    // signUpWithEmail, // Add when implemented
    // signInWithEmail,   // Add when implemented
  };

  // Render children only when not loading to prevent flash of unauthenticated content
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
