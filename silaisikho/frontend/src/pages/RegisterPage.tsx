import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/shared/ToastProvider';
import { IdentifierInput, PinInput, Button, Spinner } from '@/components/ui';
import { Navbar } from '@/components/shared';

// ─── Form Schema ───────────────────────────────────────────────────────────

const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Please enter your full name — पूरा नाम डालें' })
      .max(100),
    identifier: z
      .string()
      .trim()
      .min(1, { message: 'Please enter your email or mobile number — ईमेल या मोबाइल नंबर डालें' })
      .refine(
        (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const mobileRegex = /^(\+91|0)?[6-9]\d{9}$/;
          return emailRegex.test(val) || mobileRegex.test(val);
        },
        {
          message:
            'Please enter a valid email or 10-digit mobile number — सही ईमेल या 10 अंकों का मोबाइल नंबर डालें',
        }
      ),
    pin: z
      .string()
      .regex(/^\d{4,6}$/, {
        message: 'PIN must be 4 to 6 digits — PIN 4 से 6 अंकों का होना चाहिए',
      }),
    confirmPin: z
      .string()
      .min(1, { message: 'Please confirm your PIN — PIN दोबारा डालें' }),
  })
  .superRefine((data, ctx) => {
    if (data.pin !== data.confirmPin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPin'],
        message: 'PINs do not match — दोनों PIN एक जैसे होने चाहिए',
      });
    }
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

// ─── Component ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { register, isLoggedIn, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect destination
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      identifier: '',
      pin: '',
      confirmPin: '',
    },
  });

  const [serverError, setServerError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { name, identifier, pin, confirmPin } = watch();

  // Clear server error when user modifies fields
  useEffect(() => {
    setServerError('');
  }, [name, identifier, pin, confirmPin]);

  // Calculate progress
  const getProgress = () => {
    let completed = 0;
    if (name.trim().length >= 2) completed++;
    if (identifier.trim().length > 0) completed++;
    if (pin.length >= 4) completed++;
    if (confirmPin.length >= 4 && pin === confirmPin) completed++;
    return completed;
  };

  const progress = getProgress();

  // Form submission
  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    try {
      // Only pass name, identifier, and pin to the backend
      await register(data.name, data.identifier, data.pin);
      showToast('Account created successfully! — अकाउंट बन गया', 'success');
      setRegistrationSuccess(true);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setServerError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8">
          {registrationSuccess ? (
            // Success Screen
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle size={64} className="text-green-500 mb-4 animate-bounce" />
              <h2 className="text-navy text-xl font-semibold text-center">Account Created</h2>
              <p className="text-gold text-base text-center mt-1">आपका अकाउंट बन गया</p>
              <p className="text-warm-text text-sm text-center mt-4">Redirecting you now...</p>
              <div className="mt-4">
                <Spinner size="md" colour="brand" />
              </div>
            </div>
          ) : (
            <>
              {/* Logo Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-lg">
                  🪡
                </div>
                <h1 className="text-navy text-xl font-bold mt-2">SilaiSikho</h1>
                <p className="text-gold text-sm">सिलाई सीखो</p>
              </div>

              {/* Heading Section */}
              <div className="text-center mb-4">
                <h2 className="text-navy text-2xl font-semibold">Create Account</h2>
                <p className="text-gold text-base mt-1">अकाउंट बनाएं</p>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-1 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`flex-1 h-0.75 rounded-full transition-colors ${
                      index < progress ? 'bg-brand' : 'bg-warm-border'
                    }`}
                  />
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-navy text-sm font-medium mb-1.5">
                        Your Name — आपका नाम
                      </label>
                      <input
                        type="text"
                        placeholder="Priya Sharma"
                        {...field}
                        disabled={isSubmitting}
                        className={`w-full h-13 rounded-2xl border px-4 text-base text-navy bg-white transition-all outline-none placeholder:text-warm-text ${
                          errors.name
                            ? 'border-brand ring-1 ring-brand'
                            : 'border-warm-border focus:border-navy'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      {errors.name && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-brand text-xs">
                          <AlertCircle size={12} />
                          <span>{errors.name.message}</span>
                        </div>
                      )}
                    </div>
                  )}
                />

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
                    />
                  )}
                />

                {/* PIN Field */}
                <Controller
                  name="pin"
                  control={control}
                  render={({ field }) => (
                    <PinInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setServerError('');
                      }}
                      label="PIN"
                      hindiLabel="पिन"
                      error={errors.pin?.message}
                      disabled={isSubmitting}
                      showStrengthIndicator
                      autoComplete="new-password"
                    />
                  )}
                />

                {/* Confirm PIN Field */}
                <Controller
                  name="confirmPin"
                  control={control}
                  render={({ field }) => (
                    <PinInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setServerError('');
                      }}
                      label="Confirm PIN"
                      hindiLabel="PIN दोबारा डालें"
                      error={errors.confirmPin?.message}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
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
                  Create Account — अकाउंट बनाएं
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 text-sm text-warm-text">
                Already have an account?{' '}
                <Link to="/login" className="text-brand font-medium hover:underline">
                  Login — लॉगिन करें
                </Link>
              </div>

              {/* Terms Note */}
              <p className="text-center text-xs text-warm-text mt-4">
                By creating an account you agree to our Terms — अकाउंट बनाकर आप हमारी Terms of
                Service से सहमत हैं
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
