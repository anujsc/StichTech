import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/shared/ToastProvider';
import { IdentifierInput, PinInput, Button } from '@/components/ui';
import { Navbar, SessionExpiredToast } from '@/components/shared';

// ─── Form Schema ───────────────────────────────────────────────────────────

const LoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: 'Please enter your email or mobile number — ईमेल या मोबाइल नंबर डालें' }),
  pin: z
    .string()
    .min(1, { message: 'Please enter your PIN — PIN डालें' }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

// ─── Component ─────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Extract redirect destination from location state
  const from = (location.state as { from?: string })?.from ?? '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: '',
      pin: '',
    },
  });

  const [serverError, setServerError] = useState('');
  const { identifier, pin } = watch();

  // Clear server error when user modifies fields
  useEffect(() => {
    setServerError('');
  }, [identifier, pin]);

  // Form submission
  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      await login(data.identifier, data.pin);
      showToast('Login successful! — लॉगिन सफल रहा', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setServerError(message);
      showToast(message, 'error');
    }
  };

  // Handle Enter key in identifier field
  const handleIdentifierKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      pinInputRef.current?.focus();
    }
  };

  // Handle Enter key in PIN field
  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pin.length >= 4 && pin.length <= 6) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SessionExpiredToast />
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-lg">
              🪡
            </div>
            <h1 className="text-navy text-xl font-bold mt-2">SilaiSikho</h1>
            <p className="text-gold text-sm">सिलाई सीखो</p>
          </div>

          {/* Heading Section */}
          <div className="text-center mb-6">
            <h2 className="text-navy text-2xl font-semibold">Welcome Back</h2>
            <p className="text-gold text-base mt-1">स्वागत है</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Identifier Field */}
            <Controller
              name="identifier"
              control={control}
              render={({ field }) => (
                <IdentifierInput
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setServerError('');
                  }}
                  error={errors.identifier?.message}
                  disabled={isSubmitting}
                  autoFocus
                  onKeyDown={handleIdentifierKeyDown}
                />
              )}
            />

            {/* PIN Field */}
            <Controller
              name="pin"
              control={control}
              render={({ field }) => (
                <div>
                  <PinInput
                    ref={pinInputRef}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setServerError('');
                    }}
                    error={errors.pin?.message}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    onKeyDown={handlePinKeyDown}
                  />
                </div>
              )}
            />

            {/* Server Error */}
            {serverError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{serverError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Login — लॉगिन करें
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6 text-sm text-warm-text">
            New here?{' '}
            <Link to="/register" className="text-brand font-medium hover:underline">
              Create Account — अकाउंट बनाएं
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
