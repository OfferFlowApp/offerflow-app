
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth'; // Keep type for consistency
import { auth } from '@/lib/firebase'; // Will import the mock
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  logOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true); 
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  useEffect(() => {
    // Since Firebase is mocked, onAuthStateChanged will likely do nothing or call back with null.
    // We'll just set loading to false.
    const unsubscribe = auth.onAuthStateChanged((user: FirebaseUser | null) => {
      setCurrentUser(user); // Will be null from mock
      setLoading(false);
    });
     // Ensure loading is set to false even if onAuthStateChanged doesn't fire as expected with a mock
    if (loading) {
        setLoading(false);
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [loading]);

  const showAuthDisabledToast = () => {
    toast({
      title: t({en: "Online Accounts Disabled", el: "Οι Online Λογαριασμοί είναι Απενεργοποιημένοι"}),
      description: t({en: "User registration and login are currently unavailable. Data is saved locally.", el: "Η εγγραφή και σύνδεση χρηστών δεν είναι διαθέσιμες. Τα δεδομένα αποθηκεύονται τοπικά."}),
      variant: "default"
    });
  };

  const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    showAuthDisabledToast();
    setLoading(false); // Ensure loading state is consistent
    return null;
  };
  
  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    showAuthDisabledToast();
    setLoading(false); // Ensure loading state is consistent
    return null;
  };

  const logOut = async () => {
    showAuthDisabledToast();
    setCurrentUser(null); // Explicitly set to null
    setLoading(false); // Ensure loading state is consistent
    // No redirect needed if login isn't a primary function
  };

  const value = {
    currentUser, // Will always be null
    loading,     // Will quickly become false
    logOut,
    signUpWithEmail,
    signInWithEmail,
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
