
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { User as FirebaseUser } from 'firebase/auth'; // Firebase no longer used
// import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; // Firebase no longer used
// import { auth } from '@/lib/firebase'; // Firebase no longer used
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';

// Define a simpler User type if needed, or just use null
interface User {
  // email?: string; // Example, can be extended if a mock user is desired
  // uid?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
  // signUpWithEmail: (email: string, password: string) => Promise<any>;
  // signInWithEmail: (email: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // No Firebase, so not loading initially
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  // Firebase onAuthStateChanged logic removed
  // useEffect(() => {
  //   // Simulate no user being logged in
  //   setCurrentUser(null);
  //   setLoading(false);
  // }, []);

  const logOut = async () => {
    setCurrentUser(null); // Clear local mock user if any
    toast({ title: t({en: 'Logout Disabled', el: 'Η Αποσύνδεση είναι Απενεργοποιημένη'}), description: t({en: 'Firebase authentication is currently disabled.', el: 'Η πιστοποίηση Firebase είναι προς το παρόν απενεργοποιημένη.'}) });
    router.push('/'); // Redirect to home page
  };

  // Placeholder functions for signUp and logIn if you want to keep the API
  // const signUpWithEmail = async (email, password) => {
  //   toast({ title: "Sign Up Disabled", description: "Firebase authentication is currently disabled." });
  //   throw new Error("Sign Up Disabled");
  // };
  // const signInWithEmail = async (email, password) => {
  //   toast({ title: "Login Disabled", description: "Firebase authentication is currently disabled." });
  //   throw new Error("Login Disabled");
  // };

  const value = {
    currentUser,
    loading,
    logOut,
    // signUpWithEmail,
    // signInWithEmail,
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
