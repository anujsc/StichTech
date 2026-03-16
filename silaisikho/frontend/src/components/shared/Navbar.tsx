import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, BilingualLabel } from '@/components/ui';

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
  { href: '/about',   english: 'About',   hindi: 'हमारे बारे में' },
];

function LogoSVG({ white }: { white?: boolean }) {
  const needle = white ? '#FFFFFF' : '#C0392B';
  const thread = white ? '#C9A84C' : '#C9A84C';
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* needle body */}
      <path
        d="M6 22 C8 18, 14 10, 20 6"
        stroke={needle} strokeWidth="2.2" strokeLinecap="round"
      />
      {/* needle eye */}
      <ellipse cx="21" cy="5.5" rx="2.2" ry="1.2" stroke={needle} strokeWidth="1.5" fill="none" transform="rotate(-40 21 5.5)" />
      {/* thread wavy */}
      <path
        d="M6 22 C5 24, 7 25, 6 27"
        stroke={thread} strokeWidth="1.8" strokeLinecap="round"
      />
      <path
        d="M8 20 C10 22, 8 24, 10 26"
        stroke={thread} strokeWidth="1.4" strokeLinecap="round" opacity="0.7"
      />
    </svg>
  );
}

export function Navbar({ transparent = false, currentPath = '/' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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
          isWhiteBg
            ? 'bg-card border-b border-warm-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            onClick={closeMobile}
          >
            <LogoSVG white={!isWhiteBg} />
            <div className="flex flex-col leading-none">
              <span className={clsx('font-bold text-[20px]', isWhiteBg ? 'text-navy' : 'text-white')}>
                SilaiSikho
              </span>
              <span className="text-[11px] text-gold font-medium">सिलाई सीखो</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={clsx(
                    'pb-1 border-b-2 transition-colors duration-150',
                    isActive
                      ? 'border-brand text-brand'
                      : 'border-transparent text-warm-text hover:text-brand'
                  )}
                >
                  <BilingualLabel
                    english={item.english}
                    hindi={item.hindi}
                    englishSize="sm"
                    hindiSize="xs"
                    englishWeight="medium"
                    gap="none"
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className={clsx(
                'min-h-[48px] px-4 rounded-pill font-medium text-sm transition-all duration-200',
                'border border-transparent hover:border-warm-border',
                isWhiteBg ? 'text-warm-text hover:bg-muted' : 'text-white hover:bg-white/10'
              )}
            >
              <BilingualLabel english="Login" hindi="लॉगिन" englishSize="sm" hindiSize="xs" gap="none" />
            </button>
            <Button variant="primary" size="md" onClick={() => navigate('/login')}>
              <BilingualLabel english="Start Learning" hindi="शुरू करें" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={clsx(
              'md:hidden flex items-center justify-center w-12 h-12 rounded-lg',
              textColour
            )}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile slide-down panel */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300 bg-card border-t border-warm-border',
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          )}
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMobile}
                  className={clsx(
                    'flex items-center min-h-[48px] px-3 rounded-xl transition-colors duration-150',
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-warm-text hover:bg-muted'
                  )}
                >
                  <BilingualLabel
                    english={item.english}
                    hindi={item.hindi}
                    englishSize="base"
                    hindiSize="xs"
                    englishWeight="medium"
                    gap="none"
                  />
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2 border-t border-warm-border">
              <Button variant="outline" size="md" fullWidth onClick={() => { navigate('/login'); closeMobile(); }}>
                <BilingualLabel english="Login" hindi="लॉगिन" englishSize="sm" hindiSize="xs" gap="none" />
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={() => { navigate('/login'); closeMobile(); }}>
                <BilingualLabel english="Start Learning" hindi="शुरू करें" englishSize="sm" hindiSize="xs" gap="none" className="text-white" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}

export default Navbar;
