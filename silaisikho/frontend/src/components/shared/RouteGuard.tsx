import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

/**
 * Reusable route guard component
 * Handles authentication and authorization checks
 */
export function RouteGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo = '/login',
}: RouteGuardProps) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth state to be resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <Spinner size="lg" colour="brand" />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isLoggedIn) {
    return <Navigate to={redirectTo} state={{ from: location.pathname + location.search }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
