import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/shared/ToastProvider';
import { AuthErrorBoundary } from '@/components/shared/AuthErrorBoundary';
import AppRouter from '@/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </AuthErrorBoundary>
  </StrictMode>
);
