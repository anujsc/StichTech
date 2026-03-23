import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, BilingualLabel, Avatar } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export interface NavbarProps {
  transparent?: boolean;
  currentPath?: string;
}

interface NavItem {
  href: string;
  english: string;
  hindi: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/',        english: 'Home',    hindi: 'होम' },
  { href: '/courses', english: 'Courses', hindi: 'कोर्स' },
];

function LogoSVG({ white }: { white?: boolean }) {
  const needle = white ? '#FFFFFF' : '#C0392B';
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 22 C8 18, 14 10, 20 6" stroke={needle} strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="21" cy="5.5" rx="2.2" ry="1.2" stroke={needle} strokeWidth="1.5" fill="none" transform="rotate(-40 21 5.5)" />
      <path d="M6 22 C5 24, 7 25, 6 27" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 20 C10 22, 8 24, 10 26" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// ─── User dropdown (logged-in state) ─────────────────────────────────────────
function UserMenu({ isWhiteBg }: { isWhiteBg: boolean }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  // Early return AFTER hooks to comply with Rules of Hooks
  if (!currentUser) return null;

  const firstName = currentUser.name?.split(' ')[0] || currentUser.name || 'User';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'flex items-center gap-2 min-h-[48px] px-3 rounded-xl transition-colors',
          isWhiteBg ? 'hover:bg-muted' : 'hover:bg-white/10'
        )}
        aria-label="User menu"
        aria-expanded={open}
      >
        <Avatar name={currentUser.name || 'User'} size="sm" />
        <span className={clsx('text-sm font-medium hidden lg:block max-w-[100px] truncate', isWhiteBg ? 'text-navy' : 'text-white')}>
          {firstName}
        </span>
        <ChevronDown size={14} className={clsx('transition-transform', open && 'rotate-180', isWhiteBg ? 'text-warm-text' : 'text-white/70')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-card border border-warm-border overflow-hidden z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-warm-border">
            <p className="text-navy text-sm font-semibold truncate">{currentUser.name || 'User'}</p>
            <p className="text-warm-text text-xs truncate">{currentUser.email || currentUser.mobileNumber || ''}</p>
            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand capitalize">
              {currentUser.role || 'user'}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => { setOpen(false); navigate(isAdmin ? '/admin' : '/dashboard'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-muted transition-colors min-h-[44px]"
            >
              <LayoutDashboard size={16} className="text-warm-text shrink-0" />
              {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); navigate('/profile'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-muted transition-colors min-h-[44px]"
            >
              <User size={16} className="text-warm-text shrink-0" />
              My Profile — प्रोफाइल
            </button>
            <div className="border-t border-warm-border my-1" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand hover:bg-brand/5 transition-colors min-h-[44px]"
            >
              <LogOut size={16} className="shrink-0" />
              Logout — लॉगआउट
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar({ transparent = false, currentPath = '/' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWhiteBg = !transparent || isScrolled;
  const textColour = isWhiteBg ? 'text-navy' : 'text-white';
  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isWhiteBg ? 'bg-card border-b border-warm-border shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={closeMobile}>
            <LogoSVG white={!isWhiteBg} />
            <div className="flex flex-col leading-none">
              <span className={clsx('font-bold text-[20px]', isWhiteBg ? 'text-navy' : 'text-white')}>SilaiSikho</span>
              <span className="text-[11px] text-gold font-medium">सिलाई सीखो</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={clsx(
                    'pb-1 border-b-2 transition-colors duration-150',
                    isActive ? 'border-brand text-brand' : 'border-transparent text-warm-text hover:text-brand'
                  )}
                >
                  <BilingualLabel english={item.english} hindi={item.hindi} englishSize="sm" hindiSize="xs" englishWeight="medium" gap="none" />
                </Link>
              );
            })}
          </div>

          {/* Desktop right — auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <UserMenu isWhiteBg={isWhiteBg} />
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={clsx(
                    'min-h-[48px] px-4 rounded-pill font-medium text-sm transition-all duration-200 border border-transparent hover:border-warm-border',
                    isWhiteBg ? 'text-warm-text hover:bg-muted' : 'text-white hover:bg-white/10'
                  )}
                >
                  <BilingualLabel english="Login" hindi="लॉगिन" englishSize="sm" hindiSize="xs" gap="none" />
                </button>
                <Button variant="primary" size="md" onClick={() => navigate('/login')}>
                  <BilingualLabel english="Start Learning" hindi="शुरू करें" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={clsx('md:hidden flex items-center justify-center w-12 h-12 rounded-lg', textColour)}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile slide-down panel */}
        <div className={clsx('md:hidden overflow-hidden transition-all duration-300 bg-card border-t border-warm-border', isMobileMenuOpen ? 'max-h-screen' : 'max-h-0')}>
          <div className="px-4 py-4 flex flex-col gap-2">

            {/* Logged-in user info on mobile */}
            {isLoggedIn && currentUser && (
              <div className="flex items-center gap-3 px-3 py-3 bg-muted rounded-xl mb-1">
                <Avatar name={currentUser.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-navy text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className="text-warm-text text-xs truncate">{currentUser.email}</p>
                </div>
              </div>
            )}

            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMobile}
                  className={clsx(
                    'flex items-center min-h-[48px] px-3 rounded-xl transition-colors duration-150',
                    isActive ? 'bg-brand/10 text-brand' : 'text-warm-text hover:bg-muted'
                  )}
                >
                  <BilingualLabel english={item.english} hindi={item.hindi} englishSize="base" hindiSize="xs" englishWeight="medium" gap="none" />
                </Link>
              );
            })}

            <div className="pt-3 flex flex-col gap-2 border-t border-warm-border">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" size="md" fullWidth onClick={() => { navigate(isAdmin ? '/admin' : '/dashboard'); closeMobile(); }}>
                    <BilingualLabel english={isAdmin ? 'Admin Dashboard' : 'My Dashboard'} hindi="डैशबोर्ड" englishSize="sm" hindiSize="xs" gap="none" />
                  </Button>
                  <Button variant="outline" size="md" fullWidth onClick={() => { navigate('/profile'); closeMobile(); }}>
                    <BilingualLabel english="My Profile" hindi="प्रोफाइल" englishSize="sm" hindiSize="xs" gap="none" />
                  </Button>
                  <Button variant="primary" size="md" fullWidth onClick={() => { logout(); navigate('/'); closeMobile(); }}>
                    <BilingualLabel english="Logout" hindi="लॉगआउट" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="md" fullWidth onClick={() => { navigate('/login'); closeMobile(); }}>
                    <BilingualLabel english="Login" hindi="लॉगिन" englishSize="sm" hindiSize="xs" gap="none" />
                  </Button>
                  <Button variant="primary" size="md" fullWidth onClick={() => { navigate('/login'); closeMobile(); }}>
                    <BilingualLabel english="Start Learning" hindi="शुरू करें" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}

export default Navbar;
