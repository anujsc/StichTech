import { createContext, useContext, useState, ReactNode } from 'react';
import type { IUser } from '@/types';

interface AuthContextValue {
  currentUser: IUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string | null;
  setCurrentUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('silaisikho_token')
  );

  const value: AuthContextValue = {
    currentUser,
    isLoggedIn: !!token && !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    token,
    setCurrentUser,
    setToken: (t) => {
      setToken(t);
      if (t) localStorage.setItem('silaisikho_token', t);
      else localStorage.removeItem('silaisikho_token');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
