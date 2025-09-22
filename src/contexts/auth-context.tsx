
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInAnonymously, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { auth, database } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // Check if the signed-in user is an admin by checking the database
        const dbRef = ref(database);
        try {
          const snapshot = await get(child(dbRef, `admins/${currentUser.uid}`));
          if (snapshot.exists() && snapshot.val() === true) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        // If no user, sign in anonymously
        await signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
        });
        // After anonymous sign-in, onAuthStateChanged will run again
        // with the new anonymous user, so we don't need to set user/admin state here.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Auth state will be updated by the onAuthStateChanged listener
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const value = { user, loading, isAdmin, signInWithGoogle };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
