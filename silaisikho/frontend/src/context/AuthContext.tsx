import { createContext, useContext, useState, useEffect, useCallback, ReactNode, Fragment } from 'react';
import type { BackendUser } from '@/types/api';
import { tokenStore } from '@/api/axiosInstance';
import { loginUser, logoutUser, refreshTokens, registerUser, getMyProfile } from '@/api/authApi';
import { Spinner } from '@/components/ui';
import { DemoRoleSwitcher } from '@/components/shared/DemoRoleSwitcher';

// ─── AuthContextType ──────────────────────────────────────────────────────────

export interface AuthContextType {
  currentUser: BackendUser | null;
  accessToken: string | null;
  token: string | null; // Alias for backward compatibility with pages
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: ((identifier: string, pin: string) => Promise<void>) & ((user: any, token: string) => void);
  register: (name: string, identifier: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (updates: Partial<BackendUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── AuthProvider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived values
  const isLoggedIn = currentUser !== null && accessToken !== null;
  const isAdmin = currentUser?.role === 'admin';

  // ─── Startup Effect ───────────────────────────────────────────────────────
  // Restore session from httpOnly cookie on mount
  // Use a ref to prevent duplicate calls in React StrictMode

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        // Call refresh endpoint to get a new access token from the httpOnly cookie
        const refreshResponse = await refreshTokens();

        if (!isMounted) return;

        if (refreshResponse.success && refreshResponse.data) {
          const newToken = refreshResponse.data.accessToken;
          tokenStore.setToken(newToken);
          setAccessToken(newToken);

          // Fetch the current user profile
          const profileResponse = await getMyProfile();
          if (isMounted && profileResponse.success && profileResponse.data) {
            setCurrentUser(profileResponse.data);
          }
        }
      } catch (error) {
        // No valid session — user is not logged in
        // This is not an error, just means no cookie exists
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── Login Function ───────────────────────────────────────────────────────
  // Supports both:
  // 1. Real API: login(identifier: string, pin: string) - calls backend
  // 2. Mock: login(user: IUser, token: string) - for backward compatibility with pages

  const login = useCallback(async (identifierOrUser: string | any, pinOrToken?: string) => {
    // Check if this is the mock signature: login(user, token)
    if (typeof identifierOrUser === 'object' && identifierOrUser !== null && typeof pinOrToken === 'string') {
      // Mock signature - used by pages during demo
      const user = identifierOrUser;
      const token = pinOrToken;
      tokenStore.setToken(token);
      setAccessToken(token);
      // Convert IUser to BackendUser
      const backendUser: BackendUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePicUrl: user.profilePicUrl,
        role: user.role,
        authProvider: 'local',
      };
      setCurrentUser(backendUser);
      return;
    }

    // Real API signature: login(identifier: string, pin: string)
    const identifier = identifierOrUser as string;
    const pin = pinOrToken as string;
    const response = await loginUser({ identifier, pin });

    if (!response.success) {
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error('No data in login response');
    }

    const { accessToken: newToken, user } = response.data;
    tokenStore.setToken(newToken);
    setAccessToken(newToken);
    setCurrentUser(user);
  }, []);

  // ─── Register Function ────────────────────────────────────────────────────

  const register = useCallback(async (name: string, identifier: string, pin: string) => {
    const response = await registerUser({ name, identifier, pin });

    if (!response.success) {
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error('No data in register response');
    }

    const { accessToken: newToken, user } = response.data;
    tokenStore.setToken(newToken);
    setAccessToken(newToken);
    setCurrentUser(user);
  }, []);

  // ─── Logout Function ──────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      // Always clear state even if logout call fails
      tokenStore.setToken(null);
      setCurrentUser(null);
      setAccessToken(null);
      // Redirect to login using window.location instead of useNavigate
      // because AuthProvider is outside Router context
      window.location.href = '/login';
    }
  }, []);

  // ─── Update Current User ──────────────────────────────────────────────────

  const updateCurrentUser = useCallback((updates: Partial<BackendUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  // ─── Loading Screen ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" colour="brand" />
      </div>
    );
  }

  // ─── Provider ─────────────────────────────────────────────────────────────

  const value: AuthContextType = {
    currentUser,
    accessToken,
    token: accessToken, // Alias for backward compatibility
    isLoggedIn,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      <Fragment>
        {children}
        <DemoRoleSwitcher />
      </Fragment>
    </AuthContext.Provider>
  );
}

// ─── useAuth Hook ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
