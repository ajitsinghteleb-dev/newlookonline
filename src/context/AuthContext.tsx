'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser, UserHookResult } from '@/firebase';

interface AuthContextType extends UserHookResult {
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const userState = useUser();

  // Admin access is restricted to a specific email address.
  const isAdmin = !!userState.user && userState.user.email === 'ajitsingh0110@gmail.com';

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
