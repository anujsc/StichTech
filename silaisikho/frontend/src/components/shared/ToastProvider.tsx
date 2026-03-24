import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  isExiting?: boolean;
}

export interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <XCircle    size={18} className="text-brand shrink-0" />,
  info:    <Info       size={18} className="text-blue-500 shrink-0" />,
};

// ─── Color variants ───────────────────────────────────────────────────────────
const VARIANTS = {
  success: {
    border: 'border-green-500',
    bg: 'bg-gradient-to-r from-green-50 to-white',
  },
  error: {
    border: 'border-brand',
    bg: 'bg-gradient-to-r from-red-50 to-white',
  },
  info: {
    border: 'border-blue-500',
    bg: 'bg-gradient-to-r from-blue-50 to-white',
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant, isExiting: false }]);
    
    setTimeout(() => {
      // Start exit animation
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
      );
      
      // Remove after animation completes
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast stack — fixed top-right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-[calc(100vw-2rem)] w-80 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto',
              'rounded-2xl px-4 py-3 flex items-center gap-3',
              'border-l-4 backdrop-blur-sm',
              'transition-all duration-300 ease-out',
              VARIANTS[t.variant].border,
              VARIANTS[t.variant].bg,
              // Entry animation with enhanced effects
              !t.isExiting && 'animate-toast-enter shadow-2xl',
              // Exit animation
              t.isExiting && 'animate-toast-exit',
              // Hover effect
              !t.isExiting && 'hover:shadow-2xl hover:scale-105 hover:-translate-y-1 hover:border-l-8',
              // Shadow
              'shadow-lg relative overflow-hidden'
            )}
          >
            {/* Shimmer effect on entry */}
            {!t.isExiting && (
              <div className="absolute inset-0 toast-shimmer pointer-events-none" />
            )}
            
            {/* Icon with enhanced animation */}
            <div className={clsx(
              'shrink-0 transition-transform duration-500 relative z-10',
              !t.isExiting && 'animate-icon-bounce'
            )}>
              {ICONS[t.variant]}
            </div>
            
            {/* Message */}
            <span className="text-navy text-sm flex-1 font-medium relative z-10">{t.message}</span>
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className={clsx(
                'text-warm-text hover:text-navy transition-all duration-200',
                'min-h-[32px] min-w-[32px] flex items-center justify-center',
                'rounded-lg hover:bg-warm-border/30',
                'active:scale-95',
                'hover:rotate-90 relative z-10'
              )}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
