import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, BilingualLabel, Avatar, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';

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

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar({ transparent = false, currentPath = '/' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, isAdmin, currentUser } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  // Close mobile menu when logged out
  useEffect(() => {
    if (!isLoggedIn) {
      setIsMobileMenuOpen(false);
    }
  }, [isLoggedIn]);

  const isWhiteBg = !transparent || isScrolled;
  
  const closeMobile = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleLogoutClick = useCallback(async () => {
    setShowUserMenu(false);
    await handleLogout();
  }, [handleLogout]);

  const handleMobileLogoutClick = useCallback(async () => {
    closeMobile();
    await handleLogout();
  }, [closeMobile, handleLogout]);

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
                    isActive ? 'border-brand text-brand' : isWhiteBg ? 'border-transparent text-warm-text hover:text-brand' : 'border-transparent text-navy hover:text-brand'
                  )}
                >
                  <BilingualLabel english={item.english} hindi={item.hindi} englishSize="sm" hindiSize="xs" englishWeight="medium" gap="none" />
                </Link>
              );
            })}
          </div>

          {/* Desktop right — THREE STATES */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              // STATE 1: Loading skeleton
              <div className="w-40 h-9 rounded-full bg-muted animate-pulse" />
            ) : isLoggedIn ? (
              // STATE 3: Logged in — user menu
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((v) => !v)}
                  className={clsx(
                    'flex items-center gap-2 rounded-full border border-warm px-3 py-1.5 transition-all min-h-[36px]',
                    isWhiteBg ? 'hover:bg-muted' : 'hover:bg-white/10'
                  )}
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <Avatar name={currentUser?.name || 'User'} imageUrl={currentUser?.profilePicUrl} size="sm" />
                  <span className={clsx('text-sm font-medium max-w-[100px] truncate', isWhiteBg ? 'text-navy' : 'text-white')}>
                    {currentUser?.name ? (currentUser.name.length > 12 ? currentUser.name.slice(0, 12) + '...' : currentUser.name) : 'User'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={clsx('transition-transform', showUserMenu && 'rotate-180', isWhiteBg ? 'text-warm-text' : 'text-white/70')}
                  />
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card border border-warm z-50 py-2 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-warm">
                      <p className="text-navy text-sm font-medium truncate">{currentUser?.name || 'User'}</p>
                      <p className="text-warm-text text-xs truncate">{currentUser?.email || currentUser?.mobileNumber || ''}</p>
                    </div>

                    {/* Menu items */}
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted text-sm text-primary transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-warm-text" />
                      <span>My Dashboard — मेरा Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted text-sm text-primary transition-colors"
                    >
                      <User size={16} className="text-warm-text" />
                      <span>My Profile — मेरी Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted text-sm text-primary transition-colors"
                      >
                        <Settings size={16} className="text-warm-text" />
                        <span>Admin Panel — Admin</span>
                      </Link>
                    )}

                    <div className="border-t border-warm mx-2" />

                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-sm text-red-600 transition-all disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <Spinner size="sm" colour="brand" />
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut size={16} />
                          <span>Logout — लॉगआउट</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // STATE 2: Logged out — auth buttons
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
            className={clsx('md:hidden flex items-center justify-center w-12 h-12 rounded-lg', isWhiteBg ? 'text-navy' : 'text-white')}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile slide-down panel */}
        <div className={clsx('md:hidden overflow-hidden transition-all duration-300 bg-card border-t border-warm-border', isMobileMenuOpen ? 'max-h-screen' : 'max-h-0')}>
          <div className="px-4 py-4 flex flex-col gap-2">

            {/* THREE STATES for mobile */}
            {isLoading ? (
              // STATE 1: Loading skeleton
              <div className="w-full h-12 rounded-xl bg-muted animate-pulse" />
            ) : isLoggedIn && currentUser ? (
              // STATE 3: Logged in user info
              <div className="flex items-center gap-3 px-3 py-3 bg-muted rounded-xl mb-1">
                <Avatar name={currentUser.name} imageUrl={currentUser.profilePicUrl} size="sm" />
                <div className="min-w-0">
                  <p className="text-navy text-sm font-semibold truncate">{currentUser.name}</p>
                  <p className="text-warm-text text-xs truncate">{currentUser.email || currentUser.mobileNumber}</p>
                </div>
              </div>
            ) : null}

            {/* Nav items */}
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

            {/* Bottom section — THREE STATES */}
            <div className="pt-3 flex flex-col gap-2 border-t border-warm-border">
              {isLoading ? (
                // STATE 1: Loading skeleton
                <div className="w-full h-10 rounded-xl bg-muted animate-pulse" />
              ) : isLoggedIn ? (
                // STATE 3: Logged in menu items
                <>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => {
                      navigate(isAdmin ? '/admin' : '/dashboard');
                      closeMobile();
                    }}
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    <BilingualLabel english={isAdmin ? 'Admin Dashboard' : 'My Dashboard'} hindi="डैशबोर्ड" englishSize="sm" hindiSize="xs" gap="none" />
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => {
                      navigate('/profile');
                      closeMobile();
                    }}
                  >
                    <User size={16} className="mr-2" />
                    <BilingualLabel english="My Profile" hindi="प्रोफाइल" englishSize="sm" hindiSize="xs" gap="none" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => {
                        navigate('/admin');
                        closeMobile();
                      }}
                    >
                      <Settings size={16} className="mr-2" />
                      <BilingualLabel english="Admin Panel" hindi="Admin" englishSize="sm" hindiSize="xs" gap="none" />
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleMobileLogoutClick}
                    disabled={isLoggingOut}
                    loading={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <BilingualLabel english="Logging out..." hindi="..." englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
                    ) : (
                      <>
                        <LogOut size={16} className="mr-2" />
                        <BilingualLabel english="Logout" hindi="लॉगआउट" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                // STATE 2: Logged out buttons
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
