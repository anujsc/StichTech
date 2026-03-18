import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, BilingualLabel } from '@/components/ui';

export interface FormDrawerProps {
  isOpen: boolean;
  title: string;
  hindiTitle: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export function FormDrawer({
  isOpen,
  title,
  hindiTitle,
  onClose,
  children,
  width = 'max-w-lg',
}: FormDrawerProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={clsx('absolute inset-0 bg-black/50 transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />

      {/* Desktop right drawer */}
      <div
        className={clsx(
          'hidden md:flex flex-col fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300',
          width, visible ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-warm-border shrink-0">
          <BilingualLabel english={title} hindi={hindiTitle} englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" />
          <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={18} />}>{''}</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={clsx(
          'md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 flex flex-col transition-transform duration-300',
          'max-h-[90vh]',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="w-10 h-1 bg-warm-border rounded-full mx-auto mt-3 mb-1 shrink-0" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border shrink-0">
          <BilingualLabel english={title} hindi={hindiTitle} englishSize="xl" englishWeight="semibold" hindiSize="sm" gap="tight" />
          <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={18} />}>{''}</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
