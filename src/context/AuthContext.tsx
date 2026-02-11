'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useUser, UserHookResult } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase';

interface AuthContextType extends UserHookResult {
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const userState = useUser();
  const auth = useFirebaseAuth();

  useEffect(() => {
    if (!userState.isUserLoading && !userState.user) {
      signInAnonymously(auth);
    }
  }, [userState.isUserLoading, userState.user, auth]);

  // In a real app, this would check for a custom claim, e.g., user.customClaims.admin
  const isAdmin = !!userState.user && !userState.user.isAnonymous;

  const value: AuthContextType = {
    ...userState,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
