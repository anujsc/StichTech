import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

// ─── Demo Credentials ──────────────────────────────────────────────────────────
// These must match pre-registered test accounts in your local MongoDB.
// Create them by calling POST /api/auth/register before using the switcher.

const DEMO_STUDENT_CREDENTIALS = {
  identifier: 'student@example.com', // or a mobile number like '9876543210'
  pin: '1234',
};

const DEMO_ADMIN_CREDENTIALS = {
  identifier: 'admin@example.com', // or a mobile number
  pin: '1234',
};

// ─── DemoRoleSwitcher ─────────────────────────────────────────────────────────

export function DemoRoleSwitcher() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return null;
  }

  const handleSwitch = async (role: 'student' | 'admin') => {
    setIsSwitching(true);
    try {
      const credentials = role === 'admin' ? DEMO_ADMIN_CREDENTIALS : DEMO_STUDENT_CREDENTIALS;
      await login(credentials.identifier, credentials.pin);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Demo role switch failed:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1">
      <span className="text-warm-text text-xs mb-1">Demo Mode</span>
      <div className="bg-white rounded-full shadow-card px-1 py-1 flex gap-1">
        <button
          onClick={() => handleSwitch('student')}
          disabled={isSwitching}
          className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
            !isAdmin ? 'bg-brand text-white' : 'bg-muted text-warm-text hover:bg-warm-border'
          } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSwitching && isAdmin === false ? <Spinner size="sm" colour="white" /> : null}
          Student View — छात्र
        </button>
        <button
          onClick={() => handleSwitch('admin')}
          disabled={isSwitching}
          className={`h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
            isAdmin ? 'bg-brand text-white' : 'bg-muted text-warm-text hover:bg-warm-border'
          } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSwitching && isAdmin === true ? <Spinner size="sm" colour="white" /> : null}
          Admin View — एडमिन
        </button>
      </div>
    </div>
  );
}
