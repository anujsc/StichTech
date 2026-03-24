import { useState, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Video, Upload, Users,
  Menu, LogOut, X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Avatar, BilingualLabel, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';

export interface AdminLayoutProps {
  pageTitle: string;
  children: ReactNode;
  actionButton?: ReactNode;
}

interface SideNavItem {
  href: string;
  icon: ReactNode;
  english: string;
  hindi: string;
}

const NAV_ITEMS: SideNavItem[] = [
  { href: '/admin',          icon: <LayoutDashboard size={20} />, english: 'Dashboard',    hindi: 'डैशबोर्ड' },
  { href: '/admin/courses',  icon: <Video size={20} />,           english: 'My Courses',   hindi: 'मेरे कोर्स' },
  { href: '/admin/upload',   icon: <Upload size={20} />,          english: 'Upload Video', hindi: 'वीडियो अपलोड' },
  { href: '/admin/students', icon: <Users size={20} />,           english: 'Students',     hindi: 'छात्राएं' },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { currentUser } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  return (
    <div className="flex flex-col h-full bg-navy">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 shrink-0">
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M6 22 C8 18, 14 10, 20 6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="21" cy="5.5" rx="2.2" ry="1.2" stroke="#FFFFFF" strokeWidth="1.5" fill="none" transform="rotate(-40 21 5.5)" />
          <path d="M6 22 C5 24, 7 25, 6 27" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 20 C10 22, 8 24, 10 26" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-[18px] text-white">SilaiSikho</span>
          <span className="text-[10px] text-gold">सिलाई सीखो</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-white/60 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="border-t border-warm-border/20 mx-4" />

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 min-h-[48px] rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-white/10 text-white border-l-4 border-brand pl-2'
                  : 'text-white/80 hover:bg-white/10 border-l-4 border-transparent pl-2'
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <BilingualLabel
              english={item.english}
              hindi={item.hindi}
              englishSize="sm"
              hindiSize="xs"
              englishWeight="medium"
              gap="none"
            />
          </NavLink>
        ))}
      </nav>

      {/* Admin profile pinned at bottom */}
      <div className="mt-auto border-t border-warm-border/20 mx-4 pt-4 pb-5 px-1">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={currentUser?.name || 'Admin'} imageUrl={currentUser?.profilePicUrl} size="sm" />
          <div className="flex flex-col leading-none">
            <span className="text-white text-[13px] font-medium">{currentUser?.name || 'Admin'}</span>
            <span className="text-gold text-[11px] mt-0.5 capitalize">{currentUser?.role || 'admin'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 text-warm-text text-[12px] hover:text-white transition-colors duration-150 min-h-[36px] disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Spinner size="sm" colour="white" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={14} />
              <span>Logout — लॉगआउट</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({ pageTitle, children, actionButton }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">

      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-full overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-60 z-50 md:hidden transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-16 shrink-0 bg-card border-b border-warm-border flex items-center px-4 sm:px-6 gap-3">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-navy hover:bg-muted transition-colors"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-navy flex-1 truncate">{pageTitle}</h1>
          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
