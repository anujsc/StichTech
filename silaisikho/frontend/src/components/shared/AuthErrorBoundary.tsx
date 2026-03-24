import React, { ReactNode } from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui';

interface AuthErrorBoundaryProps {
  children: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AuthErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    // In production, send to error tracking service like Sentry
  }

  handleGoToLogin = (): void => {
    localStorage.clear();
    window.location.href = '/login';
  };

  handleTryAgain = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-surface">
          <ShieldX size={64} className="text-brand" />
          <h1 className="text-navy text-2xl font-semibold mt-6">
            Something went wrong — कुछ गलत हो गया
          </h1>
          <p className="text-warm-text text-base mt-2 max-w-md">
            There was a problem with your session. Please log in again — आपके session में कोई समस्या आई। कृपया दोबारा login करें
          </p>
          <div className="flex flex-row gap-4 mt-8 justify-center">
            <Button variant="primary" size="md" onClick={this.handleGoToLogin}>
              Go to Login — Login पर जाएं
            </Button>
            <Button variant="outline" size="md" onClick={this.handleTryAgain}>
              Try Again — दोबारा कोशिश करें
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
