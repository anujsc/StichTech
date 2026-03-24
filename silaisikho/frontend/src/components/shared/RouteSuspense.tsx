import { Suspense, ReactNode } from 'react';
import { Spinner } from '@/components/ui';

interface RouteSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Suspense wrapper for lazy-loaded routes
 * Shows loading spinner while component is being loaded
 */
export function RouteSuspense({ children, fallback }: RouteSuspenseProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <Spinner size="lg" colour="brand" />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
