import { createContext, useContext, useState, useEffect, ReactNode, Fragment } from 'react';
import type { IUser, UserRole } from '@/types';
import { MOCK_ADMIN, MOCK_STUDENTS } from '@/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthContextType {
  currentUser: IUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string | null;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── DemoRoleSwitcher ─────────────────────────────────────────────────────────
function DemoRoleSwitcher() {
  const { isAdmin, switchRole } = useAuth();
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;

  const handleSwitch = (role: UserRole) => {
    localStorage.setItem('silaisikho-demo-role', role);
    switchRole(role);
    window.location.href = role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1">
      <span className="text-warm-text text-xs mb-1">Demo Mode</span>
      <div className="bg-white rounded-full shadow-card px-1 py-1 flex gap-1">
        <button
          onClick={() => handleSwitch('student')}
          className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            !isAdmin ? 'bg-brand text-white' : 'bg-muted text-warm-text hover:bg-warm-border'
          }`}
        >
          Student View — छात्र
        </button>
        <button
          onClick={() => handleSwitch('admin')}
          className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            isAdmin ? 'bg-brand text-white' : 'bg-muted text-warm-text hover:bg-warm-border'
          }`}
        >
          Admin View — एडमिन
        </button>
      </div>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const login = (user: IUser, tok: string) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAdmin(user.role === 'admin');
    setToken(tok);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setToken(null);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(MOCK_ADMIN);
      setIsLoggedIn(true);
      setIsAdmin(true);
      setToken('mock-admin-token');
    } else {
      setCurrentUser(MOCK_STUDENTS[0]);
      setIsLoggedIn(true);
      setIsAdmin(false);
      setToken('mock-student-token');
    }
  };

  // Restore role from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('silaisikho-demo-role') as UserRole | null;
    if (saved === 'admin') {
      switchRole('admin');
    } else {
      switchRole('student');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = { currentUser, isLoggedIn, isAdmin, token, login, logout, switchRole };

  return (
    <AuthContext.Provider value={value}>
      <Fragment>
        {children}
        <DemoRoleSwitcher />
      </Fragment>
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
