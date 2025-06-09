
"use client";

import type { ReactNode, FC } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Now we use Firebase
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
  const [loading, setLoading] = useState(true); // Start as true while checking auth state
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useLocalization();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setCurrentUser(null);
      setLoading(false);
      toast({
        title: t({en: "Authentication Error", el: "Σφάλμα Πιστοποίησης"}),
        description: t({en: "Could not verify authentication status.", el: "Δεν ήταν δυνατή η επαλήθευση της κατάστασης πιστοποίησης."}),
        variant: "destructive"
      });
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [t, toast]);

  const signUpWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: t({en: "Account Created!", el: "Ο Λογαριασμός Δημιουργήθηκε!"}), description: t({en: "Successfully signed up.", el: "Επιτυχής εγγραφή."}) });
      router.push('/'); // Redirect to home or dashboard
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign up error:", authError);
      toast({ title: t({en: "Sign Up Failed", el: "Η Εγγραφή Απέτυχε"}), description: authError.message || t({en: "Please try again.", el: "Παρακαλώ προσπαθήστε ξανά."}), variant: "destructive" });
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: t({en: "Logged In!", el: "Συνδεθήκατε!"}), description: t({en: "Successfully logged in.", el: "Επιτυχής σύνδεση."}) });
      router.push('/'); // Redirect to home or dashboard
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign in error:", authError);
      toast({ title: t({en: "Login Failed", el: "Η Σύνδεση Απέτυχε"}), description: authError.message || t({en: "Invalid credentials. Please try again.", el: "Μη έγκυρα διαπιστευτήρια. Παρακαλώ προσπαθήστε ξανά."}), variant: "destructive" });
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      toast({ title: t({en: 'Logged Out', el: 'Αποσυνδεθήκατε'}), description: t({en: 'You have been successfully logged out.', el: 'Έχετε αποσυνδεθεί επιτυχώς.'}) });
      router.push('/login'); // Redirect to login page
    } catch (error) {
      const authError = error as AuthError;
      console.error("Logout error:", authError);
      toast({ title: t({en: "Logout Failed", el: "Η Αποσύνδεση Απέτυχε"}), description: authError.message, variant: "destructive"});
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
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
