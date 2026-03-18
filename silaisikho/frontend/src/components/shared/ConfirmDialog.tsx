import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: 'confirm' | 'danger';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel — रद्द करें',
  onConfirm,
  onClose,
  variant = 'confirm',
}: ConfirmDialogProps) {
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

  const panel = (
    <div className="bg-white rounded-t-2xl md:rounded-2xl p-6 w-full max-w-sm mx-auto">
      {/* Mobile drag handle */}
      <div className="w-10 h-1 bg-warm-border rounded-full mx-auto mb-4 md:hidden" />
      <h2 className="text-navy text-lg font-semibold">{title}</h2>
      <p className="text-warm-text text-sm mt-2 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="md" onClick={onClose}>{cancelLabel}</Button>
        <Button
          variant={variant === 'confirm' ? 'primary' : 'primary'}
          size="md"
          onClick={() => { onConfirm(); onClose(); }}
          className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600 border-0' : ''}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className={clsx('absolute inset-0 bg-black/50 transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      {/* Mobile bottom sheet */}
      <div
        className={clsx(
          'relative w-full md:hidden transition-transform duration-300',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {panel}
      </div>
      {/* Desktop centred modal */}
      <div
        className={clsx(
          'relative hidden md:block w-full max-w-sm mx-4 transition-all duration-300',
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {panel}
      </div>
    </div>
  );
}
