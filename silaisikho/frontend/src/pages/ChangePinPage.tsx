import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { changeMyPin } from '@/api/authApi';
import { tokenStore } from '@/api/axiosInstance';
import { Navbar } from '@/components/shared';
import { Button, PinInput, BilingualLabel, Spinner } from '@/components/ui';

// ─── Schema ───────────────────────────────────────────────────────────────────

const ChangePinSchema = z.object({
  currentPin: z.string().min(1, 'Please enter your current PIN — मौजूदा PIN डालें'),
  newPin: z.string().regex(/^\d{4,6}$/, 'New PIN must be 4 to 6 digits — नया PIN 4 से 6 अंकों का होना चाहिए'),
  confirmPin: z.string().min(1, 'Please confirm your new PIN — नया PIN दोबारा डालें'),
}).superRefine((data, ctx) => {
  // Check if new PIN matches confirm PIN
  if (data.newPin !== data.confirmPin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'PINs do not match — दोनों PIN एक जैसे होने चाहिए',
      path: ['confirmPin'],
    });
  }

  // Check if new PIN is different from current PIN
  if (data.newPin === data.currentPin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'New PIN must be different from current PIN — नया PIN पुराने PIN से अलग होना चाहिए',
      path: ['newPin'],
    });
  }
});

type ChangePinFormValues = z.infer<typeof ChangePinSchema>;

// ─── ChangePinPage ────────────────────────────────────────────────────────────

export default function ChangePinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCurrentUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChangePinFormValues>({
    resolver: zodResolver(ChangePinSchema),
    defaultValues: {
      currentPin: '',
      newPin: '',
      confirmPin: '',
    },
  });

  const onSubmit = async (values: ChangePinFormValues) => {
    setServerError('');

    try {
      const response = await changeMyPin({
        currentPin: values.currentPin,
        newPin: values.newPin,
        confirmPin: values.confirmPin,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to change PIN');
      }

      // Extract new access token and update tokenStore
      if (response.data?.accessToken) {
        tokenStore.setToken(response.data.accessToken);
      }

      // Trigger re-render (no actual user data changes from PIN update)
      updateCurrentUser({});

      // Show success screen
      setPinChangeSuccess(true);

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 2000);
    } catch (error: any) {
      setServerError(error.message || 'An error occurred while changing your PIN');
    }
  };

  return (
    <div className="page-enter min-h-screen bg-surface">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="max-w-md mx-auto px-4 py-8">

        {/* Security Info Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm font-medium mb-1">
                PIN Change Security Notice — सुरक्षा नोटिस
              </p>
              <p className="text-amber-700 text-xs">
                Changing your PIN will log you out of all other devices. This device will stay logged in — PIN बदलने से आप सभी दूसरे devices से logout हो जाएंगे। इस device पर login रहेंगे
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <BilingualLabel
            english="Change PIN"
            hindi="PIN बदलें"
            englishSize="xl"
            englishWeight="bold"
            hindiSize="sm"
            gap="tight"
            className="mb-6"
          />

          {pinChangeSuccess ? (
            // Success Screen
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-bounce mb-4">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <p className="text-navy text-lg font-semibold mb-2">
                PIN Changed Successfully!
              </p>
              <p className="text-warm-text text-sm mb-4">
                Redirecting to profile — प्रोफ़ाइल पर जा रहे हैं...
              </p>
              <Spinner size="md" colour="brand" />
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Current PIN Field */}
              <div>
                <label className="block text-navy text-sm font-medium mb-1.5">
                  <BilingualLabel
                    english="Current PIN"
                    hindi="मौजूदा PIN"
                    englishSize="sm"
                    hindiSize="xs"
                    gap="tight"
                  />
                </label>
                <Controller
                  name="currentPin"
                  control={control}
                  render={({ field }) => (
                    <PinInput
                      value={field.value}
                      onChange={field.onChange}
                      showStrengthIndicator={false}
                      autoComplete="current-password"
                    />
                  )}
                />
                {errors.currentPin && (
                  <p className="text-brand text-xs mt-1">{errors.currentPin.message}</p>
                )}
              </div>

              {/* New PIN Field */}
              <div>
                <label className="block text-navy text-sm font-medium mb-1.5">
                  <BilingualLabel
                    english="New PIN"
                    hindi="नया PIN"
                    englishSize="sm"
                    hindiSize="xs"
                    gap="tight"
                  />
                </label>
                <Controller
                  name="newPin"
                  control={control}
                  render={({ field }) => (
                    <PinInput
                      value={field.value}
                      onChange={field.onChange}
                      showStrengthIndicator={true}
                      autoComplete="new-password"
                    />
                  )}
                />
                {errors.newPin && (
                  <p className="text-brand text-xs mt-1">{errors.newPin.message}</p>
                )}
              </div>

              {/* Confirm New PIN Field */}
              <div>
                <label className="block text-navy text-sm font-medium mb-1.5">
                  <BilingualLabel
                    english="Confirm New PIN"
                    hindi="नया PIN दोबारा"
                    englishSize="sm"
                    hindiSize="xs"
                    gap="tight"
                  />
                </label>
                <Controller
                  name="confirmPin"
                  control={control}
                  render={({ field }) => (
                    <PinInput
                      value={field.value}
                      onChange={field.onChange}
                      showStrengthIndicator={false}
                      autoComplete="new-password"
                    />
                  )}
                />
                {errors.confirmPin && (
                  <p className="text-brand text-xs mt-1">{errors.confirmPin.message}</p>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
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
                <BilingualLabel
                  english="Change PIN"
                  hindi="PIN बदलें"
                  englishSize="sm"
                  hindiSize="xs"
                  gap="tight"
                  className="text-white"
                />
              </Button>

              {/* Back Link */}
              <div className="text-center">
                <Link
                  to="/profile"
                  className="text-warm-text text-sm hover:text-brand transition-colors"
                >
                  Back to Profile — प्रोफ़ाइल पर वापस जाएं
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
