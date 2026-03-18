import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, BilingualLabel, Spinner } from '@/components/ui';
import { Navbar } from '@/components/shared';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileFormValues {
  name: string;
  phone: string;
  city: string;
}

interface FieldError {
  name?: string;
  phone?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputCls = [
  'w-full min-h-[52px] pl-11 pr-4 rounded-xl border border-warm-border',
  'text-navy text-base placeholder:text-warm-text/50',
  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
].join(' ');

function validate(vals: ProfileFormValues): FieldError {
  const errs: FieldError = {};
  if (!vals.name.trim() || vals.name.trim().length < 2) errs.name = 'Name must be at least 2 characters — नाम कम से कम 2 अक्षर का होना चाहिए';
  if (vals.phone && !/^[6-9]\d{9}$/.test(vals.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit Indian mobile number';
  return errs;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, token } = useAuth();

  // isSetup = true when coming from login for the first time (name is placeholder)
  const isSetup = !currentUser?.name || currentUser.name === 'New User';

  const [values, setValues] = useState<ProfileFormValues>({
    name: isSetup ? '' : (currentUser?.name ?? ''),
    phone: '',
    city: '',
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!currentUser) navigate('/login', { replace: true });
  }, [currentUser, navigate]);

  const handleChange = useCallback((field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSave = useCallback(() => {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setTimeout(() => {
      // Update the user in auth context with the new name
      if (currentUser && token) {
        login({ ...currentUser, name: values.name.trim() }, token);
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        // After setup, go to dashboard; after edit, stay on profile
        const from = (location.state as { from?: string })?.from;
        navigate(from ?? (currentUser?.role === 'admin' ? '/admin' : '/dashboard'));
      }, 1200);
    }, 900);
  }, [values, currentUser, token, login, navigate, location.state]);

  if (!currentUser) return null;

  return (
    <div className="page-enter min-h-screen bg-surface flex flex-col">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <BilingualLabel
              english={isSetup ? 'Complete Your Profile' : 'My Profile'}
              hindi={isSetup ? 'अपनी प्रोफाइल पूरी करें' : 'मेरी प्रोफाइल'}
              englishSize="xl"
              englishWeight="bold"
              hindiSize="sm"
              gap="tight"
              className="justify-center"
            />
            {isSetup && (
              <p className="text-warm-text text-sm mt-2">
                Just a few details to get you started — शुरू करने के लिए कुछ जानकारी दें
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="mb-5">
            <label className="block text-navy text-sm font-medium mb-1.5">
              Email — ईमेल
            </label>
            <div className="w-full min-h-[52px] px-4 rounded-xl border border-warm-border bg-muted flex items-center text-warm-text text-sm">
              {currentUser.email}
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-navy text-sm font-medium mb-1.5">
              Full Name — पूरा नाम <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
              <input
                type="text"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Sunita Devi"
                className={inputCls}
                autoFocus={isSetup}
              />
            </div>
            {errors.name && <p className="text-brand text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-navy text-sm font-medium mb-1.5">
              Mobile Number — मोबाइल नंबर
              <span className="text-warm-text font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
              <input
                type="tel"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="98765 43210"
                maxLength={10}
                className={inputCls}
              />
            </div>
            {errors.phone && <p className="text-brand text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* City */}
          <div className="mb-8">
            <label className="block text-navy text-sm font-medium mb-1.5">
              City — शहर
              <span className="text-warm-text font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
              <input
                type="text"
                value={values.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Indore, Jaipur…"
                className={inputCls}
              />
            </div>
          </div>

          {/* Save button */}
          {saved ? (
            <div className="flex items-center justify-center gap-2 min-h-[52px] bg-green-50 rounded-xl border border-green-200">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-green-700 text-sm font-medium">
                {isSetup ? 'Profile saved! Redirecting…' : 'Changes saved — बदलाव सेव हो गए'}
              </span>
            </div>
          ) : (
            <Button variant="primary" size="lg" fullWidth loading={saving} onClick={handleSave}>
              {isSetup ? 'Save & Continue — सेव करें' : 'Save Changes — बदलाव सेव करें'}
            </Button>
          )}

          {/* Skip for now (only on setup) */}
          {isSetup && !saved && (
            <button
              type="button"
              onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
              className="w-full mt-3 text-warm-text text-sm hover:text-navy transition-colors min-h-[44px]"
            >
              Skip for now — अभी छोड़ें
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
