import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Navbar } from '@/components/shared';
import { Button, Avatar, BilingualLabel, Spinner } from '@/components/ui';

// ─── Schema ───────────────────────────────────────────────────────────────────

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters — नाम कम से कम 2 अक्षर का होना चाहिए').max(100).optional(),
  profilePicUrl: z.union([
    z.string().trim().url('Please enter a valid image URL — सही image URL डालें'),
    z.literal(''),
  ]).optional(),
}).refine(
  (data) => {
    const hasName = data.name && data.name.length > 0;
    const hasUrl = data.profilePicUrl && data.profilePicUrl.length > 0;
    return hasName || hasUrl;
  },
  {
    message: 'Please update at least one field — कम से कम एक field बदलें',
    path: ['name'],
  }
);

type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>;

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const location = useLocation();
  const { currentUser, isLoading } = useAuth();
  const { isUpdating, updateError, updateSuccess, updateProfile } = useProfile();
  const [localError, setLocalError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      profilePicUrl: currentUser?.profilePicUrl || '',
    },
  });

  // Watch profilePicUrl for preview
  const profilePicUrl = watch('profilePicUrl');

  // Update preview when URL changes
  useEffect(() => {
    if (profilePicUrl && profilePicUrl.length > 0) {
      setPreviewUrl(profilePicUrl);
      setPreviewError(false);
    } else {
      setPreviewUrl(null);
      setPreviewError(false);
    }
  }, [profilePicUrl]);

  // Reset form when currentUser loads or changes
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || '',
        profilePicUrl: currentUser.profilePicUrl || '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (values: UpdateProfileFormValues) => {
    setLocalError('');

    // Build params with only changed fields
    const params: { name?: string; profilePicUrl?: string } = {};

    if (values.name && values.name !== currentUser?.name) {
      params.name = values.name;
    }

    if (values.profilePicUrl !== undefined && values.profilePicUrl !== currentUser?.profilePicUrl) {
      params.profilePicUrl = values.profilePicUrl;
    }

    // Check if anything actually changed
    if (Object.keys(params).length === 0) {
      setLocalError('No changes detected — कोई बदलाव नहीं');
      return;
    }

    await updateProfile(params);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Spinner size="lg" colour="brand" />
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-surface">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Profile Header Card */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar
              name={currentUser?.name || 'User'}
              imageUrl={currentUser?.profilePicUrl}
              size="xl"
            />
            <span className="text-warm-text text-xs">Profile photo</span>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-navy text-xl font-semibold mb-2">{currentUser?.name || 'User'}</h1>
            <div className="flex items-center gap-2 text-warm-text text-sm mb-2">
              {currentUser?.email ? (
                <>
                  <Mail size={16} />
                  <span>{currentUser.email}</span>
                </>
              ) : currentUser?.mobileNumber ? (
                <>
                  <Phone size={16} />
                  <span>{currentUser.mobileNumber}</span>
                </>
              ) : null}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand capitalize mb-3">
              {currentUser?.role === 'admin' ? 'Admin — एडमिन' : 'Student — छात्र'}
            </div>
            <Link
              to="/change-pin"
              className="flex items-center gap-1.5 text-brand text-sm hover:underline"
            >
              <Lock size={14} />
              Change PIN — PIN बदलें
            </Link>
          </div>
        </div>

        {/* Update Form Card */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <BilingualLabel
            english="Edit Profile"
            hindi="प्रोफ़ाइल बदलें"
            englishSize="xl"
            englishWeight="bold"
            hindiSize="sm"
            gap="tight"
            className="mb-6"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name Field */}
            <div>
              <label className="block text-navy text-sm font-medium mb-1.5">
                <BilingualLabel
                  english="Your Name"
                  hindi="आपका नाम"
                  englishSize="sm"
                  hindiSize="xs"
                  gap="tight"
                />
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full min-h-[52px] px-4 rounded-xl border border-warm-border text-navy text-base placeholder:text-warm-text/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-brand text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Profile Picture URL Field */}
            <div>
              <label className="block text-navy text-sm font-medium mb-1.5">
                <BilingualLabel
                  english="Profile Picture URL"
                  hindi="प्रोफ़ाइल फ़ोटो URL"
                  englishSize="sm"
                  hindiSize="xs"
                  gap="tight"
                />
              </label>
              <p className="text-warm-text text-xs mb-2">
                Enter a direct link to your photo — अपनी फ़ोटो का link डालें
              </p>
              <input
                type="url"
                {...register('profilePicUrl')}
                className="w-full min-h-[52px] px-4 rounded-xl border border-warm-border text-navy text-base placeholder:text-warm-text/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                placeholder="https://example.com/photo.jpg"
              />
              {errors.profilePicUrl && (
                <p className="text-brand text-xs mt-1">{errors.profilePicUrl.message}</p>
              )}

              {/* Preview */}
              {previewUrl && !previewError && (
                <div className="mt-3">
                  <p className="text-warm-text text-xs mb-2">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                </div>
              )}
            </div>

            {/* Local Error */}
            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-700 text-sm">{localError}</p>
              </div>
            )}

            {/* Server Error */}
            {updateError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-700 text-sm">{updateError}</p>
              </div>
            )}

            {/* Success Notification */}
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <p className="text-green-700 text-sm">
                  Profile updated successfully — प्रोफ़ाइल अपडेट हो गई
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isUpdating}
              disabled={isUpdating}
            >
              <BilingualLabel
                english="Update Profile"
                hindi="प्रोफ़ाइल अपडेट करें"
                englishSize="sm"
                hindiSize="xs"
                gap="tight"
                className="text-white"
              />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
