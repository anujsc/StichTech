import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import { Spinner } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

// ─── Demo Credentials ──────────────────────────────────────────────────────────
// IMPORTANT: These accounts must exist in your database before using the switcher.
// 
// To create demo accounts:
// 1. Register student: POST /api/auth/register with email: student@example.com, pin: 1234
// 2. Register admin: POST /api/auth/register with email: admin@example.com, pin: 1234
// 3. Update admin role in MongoDB: db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
//
// OR disable demo mode by setting VITE_DEMO_MODE=false in .env

const DEMO_STUDENT_CREDENTIALS = {
  identifier: 'student@example.com',
  pin: '1234',
};

const DEMO_ADMIN_CREDENTIALS = {
  identifier: 'admin@example.com',
  pin: '1234',
};

// ─── DemoRoleSwitcher ─────────────────────────────────────────────────────────

export function DemoRoleSwitcher() {
  const { login, isAdmin, isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return null;
  }

  const handleSwitch = async (role: 'student' | 'admin') => {
    setIsSwitching(true);
    setError(null);
    
    try {
      // If already logged in, log out first to clear the session
      if (isLoggedIn) {
        await handleLogout();
        // Wait for logout to complete
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const credentials = role === 'admin' ? DEMO_ADMIN_CREDENTIALS : DEMO_STUDENT_CREDENTIALS;
      await login(credentials.identifier, credentials.pin);
      
      // Navigate to appropriate dashboard
      window.location.href = role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      console.error('Demo role switch failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Switch failed';
      
      // Show user-friendly error
      if (errorMessage.includes('Too many')) {
        setError('Too many attempts. Wait 15 minutes.');
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('not found')) {
        setError('Demo accounts not found. Create them first.');
      } else {
        setError('Switch failed. Check console.');
      }
      
      setIsSwitching(false);
    }
  };

  // Determine which pill is active
  const isStudentActive = isLoggedIn && !isAdmin;
  const isAdminActive = isLoggedIn && isAdmin;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-red-700 max-w-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}
      
      <div className="flex flex-col items-end gap-1">
        <span className="text-warm-text text-xs">Demo Mode</span>
        <div className="bg-white rounded-full shadow-card px-1 py-1 flex gap-1">
          <button
            onClick={() => handleSwitch('student')}
            disabled={isSwitching}
            className={`relative h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
              isStudentActive ? 'bg-brand text-white font-bold' : 'bg-muted text-warm-text hover:bg-warm-border'
            } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Switch to student account (student@example.com)"
          >
            {isStudentActive && (
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
            {isSwitching && !isAdminActive ? <Spinner size="sm" colour={isStudentActive ? 'white' : 'brand'} /> : null}
            Student
          </button>
          <button
            onClick={() => handleSwitch('admin')}
            disabled={isSwitching}
            className={`relative h-8 px-3 rounded-full text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
              isAdminActive ? 'bg-brand text-white font-bold' : 'bg-muted text-warm-text hover:bg-warm-border'
            } ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Switch to admin account (admin@example.com)"
          >
            {isAdminActive && (
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-green-500" />
            )}
            {isSwitching && isAdminActive ? <Spinner size="sm" colour={isAdminActive ? 'white' : 'brand'} /> : null}
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
