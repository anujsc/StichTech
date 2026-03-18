import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button, Spinner, BilingualLabel } from '@/components/ui';
import { Navbar } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { MOCK_ADMIN, MOCK_STUDENTS } from '@/mockData';

type LoginStep = 'email' | 'otp';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, isAdmin } = useAuth();

  // Already logged in — redirect away
  useEffect(() => {
    if (isLoggedIn) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState<string>('');
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-focus first OTP box when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const validateEmail = (val: string): boolean => {
    if (!val.trim()) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError('Enter a valid email'); return false; }
    setEmailError('');
    return true;
  };

  const handleSendOtp = useCallback(() => {
    if (!validateEmail(email)) return;
    setEmailLoading(true);
    setTimeout(() => {
      setEmailLoading(false);
      setStep('otp');
      setCountdown(RESEND_SECONDS);
    }, 1200);
  }, [email]);

  const handleResend = useCallback(() => {
    if (countdown > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setCountdown(RESEND_SECONDS);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, [countdown]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    setOtpError('');
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  const handleVerifyOtp = useCallback(() => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setOtpError('Please enter all 6 digits'); return; }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      const isAdminEmail = email.toLowerCase().includes('admin');
      // New user — name is placeholder, route to profile setup
      const user = isAdminEmail
        ? MOCK_ADMIN
        : { ...MOCK_STUDENTS[0], id: Date.now().toString(), email, name: 'New User' };
      const tok = isAdminEmail ? 'mock-admin-token' : 'mock-student-token';
      login(user, tok);
      // Admin goes straight to dashboard; new students complete profile first
      navigate(isAdminEmail ? '/admin' : '/profile', { state: { from: '/dashboard' } });
    }, 1200);
  }, [otp, email, login, navigate]);

  const handleGoogleLogin = useCallback(() => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      login(MOCK_STUDENTS[0], 'mock-student-token');
      navigate('/dashboard');
    }, 1500);
  }, [login, navigate]);

  return (
    <div className="page-enter min-h-screen bg-surface flex flex-col">
      <Navbar transparent={false} currentPath={location.pathname} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-card rounded-2xl shadow-card p-8">

          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <BilingualLabel
              english="SilaiSikho"
              hindi="सिलाई सीखो"
              englishSize="xl"
              englishWeight="bold"
              hindiSize="base"
              gap="tight"
              className="justify-center"
            />
            <p className="text-warm-text text-sm mt-2">
              {step === 'email' ? 'Sign in to continue learning' : `OTP sent to ${email}`}
            </p>
          </div>

          {step === 'email' ? (
            <>
              {/* Google button */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleLogin}
                className="w-full min-h-[48px] flex items-center justify-center gap-3 border border-warm-border rounded-xl text-navy text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60 mb-6"
              >
                {googleLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                )}
                <span>{googleLoading ? 'Signing in…' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-warm-border" />
                <span className="text-warm-text text-xs">or use email OTP</span>
                <div className="flex-1 h-px bg-warm-border" />
              </div>

              {/* Email input */}
              <div className="mb-4">
                <label className="block text-navy text-sm font-medium mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-text pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    placeholder="you@example.com"
                    className="w-full min-h-[48px] pl-9 pr-4 border border-warm-border rounded-xl text-navy text-sm placeholder:text-warm-text/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  />
                </div>
                {emailError && <p className="text-brand text-xs mt-1">{emailError}</p>}
              </div>

              <Button variant="primary" size="lg" fullWidth loading={emailLoading} onClick={handleSendOtp}>
                Send OTP — OTP भेजें
              </Button>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(Array(OTP_LENGTH).fill('')); setOtpError(''); }}
                className="flex items-center gap-1.5 text-warm-text text-sm hover:text-navy transition-colors mb-6 min-h-[48px]"
              >
                <ArrowLeft size={16} /> Change email
              </button>

              {/* OTP boxes */}
              <div className="flex gap-2 justify-center mb-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-12 sm:w-11 sm:h-14 text-center text-navy text-xl font-bold border border-warm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  />
                ))}
              </div>
              {otpError && <p className="text-brand text-xs text-center mb-2">{otpError}</p>}

              {/* Resend */}
              <div className="flex items-center justify-center gap-1.5 mb-6 min-h-[32px]">
                <RefreshCw size={14} className="text-warm-text" />
                {countdown > 0 ? (
                  <span className="text-warm-text text-sm">Resend in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleResend} className="text-brand text-sm font-medium hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>

              <Button variant="primary" size="lg" fullWidth loading={otpLoading} onClick={handleVerifyOtp}>
                Verify OTP — OTP सत्यापित करें
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
