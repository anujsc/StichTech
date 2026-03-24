import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useLogout() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      // Log error but don't surface to user since local state is cleared anyway
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return {
    handleLogout,
    isLoggingOut,
  };
}
